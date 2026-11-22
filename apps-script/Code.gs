/**
 * Бэкенд приглашения на ДР Маши.
 * Скрипт привязан к Google-таблице; листы «RSVP» и «Подарки» создаются сами.
 * Публично отдаёт только: какие подарки заняты (и какие из них — по этой же личной ссылке).
 * Всё остальное — только с PIN (ADMIN_PIN в Secrets.gs).
 */
const RSVP = 'RSVP';
const GIFTS = 'Подарки';
const RSVP_HEAD = ['Когда', 'Приглашение', 'Придёт', 'Детей придёт', 'Контакт', 'Комментарий', 'Кто именно'];
const GIFT_HEAD = ['Когда', 'ID подарка', 'Подарок', 'Кто дарит', 'Токен'];

// Должно совпадать с id в config.js — чужие id отклоняются.
const ALLOWED_IDS = ['tab-paws','paint-num','canvas','cat-lamp','soap','bedding-glow','bunny-charm','hp-pajama',
  'hp-science','hp-mug','hp-rug','hp-bag','mc-lego','karate-chest','karate-blue','doll'];
const MAX_RESERVES_PER_10MIN = 20;   // от спама скриптом
const MAX_PIN_FAILS = 5;             // потом блокировка на 15 минут

// PIN админки — константа ADMIN_PIN в Secrets.gs (не в git).
// Листы создаются сами при первом обращении.

function doGet(e) {
  const p = e.parameter || {};
  if (p.action === 'state') return json_(publicState_(p.who));
  if (p.action === 'admin') return checkPin_(p.pin) ? json_(adminState_()) : json_({ ok: false, error: pinLocked_() ? 'locked' : 'pin' });
  return json_({ ok: false, error: 'unknown action' });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (_) { return json_({ ok: false, error: 'bad json' }); }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    switch (b.action) {
      case 'rsvp':    return json_(rsvp_(b));
      case 'reserve': return json_(reserve_(b));
      case 'release': return json_(release_(b));
      default:        return json_({ ok: false, error: 'unknown action' });
    }
  } finally { lock.releaseLock(); }
}

/* ---------- действия ---------- */

function rsvp_(b) {
  const child = clean_(b.child, 60);
  if (!child) return { ok: false, error: 'Укажите имя ребёнка' };
  const kids = (Array.isArray(b.kids) ? b.kids : [{ name: child, coming: b.coming !== false }]).slice(0, 6)
    .map(k => ({ name: clean_(k && k.name, 40), coming: !!(k && k.coming) }));
  const n = kids.filter(k => k.coming).length;
  const detail = kids.map(k => k.name + (k.coming ? ' — да' : ' — нет')).join(', ');
  sheet_(RSVP, RSVP_HEAD).appendRow([new Date(), child, n > 0 ? 'да' : 'нет', n,
    clean_(b.contact, 60), clean_(b.note, 300), detail]);
  return { ok: true };
}

function reserve_(b) {
  const id = clean_(b.giftId, 40);
  const who = clean_(b.who, 60);
  if (ALLOWED_IDS.indexOf(id) === -1) return { ok: false, error: 'bad gift' };
  if (!rateOk_('reserve', MAX_RESERVES_PER_10MIN)) return { ok: false, error: 'busy' };
  if (!who) return { ok: false, error: 'Укажите, от кого подарок' };
  const rid = /^[A-Za-z0-9-]{8,64}$/.test(String(b.rid || '')) ? String(b.rid) : Utilities.getUuid();
  const rows = sheet_(GIFTS, GIFT_HEAD).getDataRange().getValues().slice(1);
  const existing = rows.filter(r => r[1] === id)[0];
  if (existing) {
    if (existing[4] === rid) return { ok: true, token: rid, state: publicState_(who) };   // повтор той же брони
    return { ok: false, error: 'taken', state: publicState_(who) };
  }
  sheet_(GIFTS, GIFT_HEAD).appendRow([new Date(), id, clean_(b.giftTitle, 80), who, rid]);
  return { ok: true, token: rid, state: publicState_(who) };
}

function release_(b) {
  const id = clean_(b.giftId, 40);
  const sh = sheet_(GIFTS, GIFT_HEAD);
  const rows = sh.getDataRange().getValues();
  const admin = b.pin ? checkPin_(b.pin) : false;
  const who = norm_(b.who);
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] !== id) continue;
    if (admin || (b.token && rows[i][4] === b.token) || (who && norm_(rows[i][3]) === who)) {
      sh.deleteRow(i + 1);
      return { ok: true, state: publicState_(b.who) };
    }
  }
  return { ok: false, error: 'not found' };
}

/* ---------- чтение ---------- */

// занятые подарки; с who — ещё и какие из них забронированы по этой личной ссылке
function publicState_(whoRaw) {
  const rows = sheet_(GIFTS, GIFT_HEAD).getDataRange().getValues().slice(1);
  const who = norm_(whoRaw);
  return { ok: true, taken: rows.map(r => r[1]), mine: who ? rows.filter(r => norm_(r[3]) === who).map(r => r[1]) : [] };
}

function adminState_() {
  const gifts = sheet_(GIFTS, GIFT_HEAD).getDataRange().getValues().slice(1)
    .map(r => ({ at: r[0], id: r[1], title: r[2], who: r[3] }));
  return { ok: true, rsvp: latestRsvp_(), gifts: gifts };
}

// последний ответ по каждому ребёнку
function latestRsvp_() {
  const rows = sheet_(RSVP, RSVP_HEAD).getDataRange().getValues().slice(1);
  const byChild = {};
  rows.forEach(r => {
    const kids = typeof r[3] === 'number' ? r[3] : (r[2] === 'да' ? 1 : 0);
    byChild[norm_(r[1])] =
      { at: r[0], child: r[1], coming: r[2] === 'да', kids: kids, contact: r[4], note: r[5], detail: r[6] || '' };
  });
  return Object.keys(byChild).map(k => byChild[k]);
}

function takenIds_() {
  return sheet_(GIFTS, GIFT_HEAD).getDataRange().getValues().slice(1).map(r => r[1]);
}

/* ---------- утилиты ---------- */

function sheet_(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); }
  else if (sh.getRange(1, 1, 1, head.length).getValues()[0].join('|') !== head.join('|')) sh.getRange(1, 1, 1, head.length).setValues([head]);
  return sh;
}
// PIN с блокировкой после MAX_PIN_FAILS неудачных попыток
function pinLocked_() {
  return Number(CacheService.getScriptCache().get('pinFails') || 0) >= MAX_PIN_FAILS;
}
function checkPin_(pin) {
  if (pinLocked_()) return false;
  if (pinOk_(pin)) return true;
  const c = CacheService.getScriptCache();
  c.put('pinFails', String(Number(c.get('pinFails') || 0) + 1), 15 * 60);
  return false;
}
// не больше n действий за 10 минут на всех
function rateOk_(key, n) {
  const c = CacheService.getScriptCache();
  const v = Number(c.get('rate_' + key) || 0);
  if (v >= n) return false;
  c.put('rate_' + key, String(v + 1), 10 * 60);
  return true;
}
function pinOk_(pin) {
  return typeof ADMIN_PIN !== 'undefined' && !!ADMIN_PIN && String(pin || '') === String(ADMIN_PIN);
}
function norm_(s) { return String(s || '').trim().toLowerCase().replace(/ё/g, 'е').replace(/\s+/g, ' '); }
function clean_(s, max) {
  // обрезаем; если начинается с = + - @, ставим апостроф, чтобы таблица не приняла текст за формулу
  const v = String(s == null ? '' : s).trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
