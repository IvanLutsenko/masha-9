/**
 * Бэкенд приглашения на ДР Маши.
 * Таблица: листы «RSVP» и «Подарки» создаются функцией setup().
 * Публично отдаёт только: какие подарки заняты и сколько гостей придёт.
 * Всё остальное — только с PIN (Script Properties → ADMIN_PIN).
 */
const RSVP = 'RSVP';
const GIFTS = 'Подарки';
const RSVP_HEAD = ['Когда', 'Ребёнок', 'Придёт', 'Родитель', 'Контакт', 'Комментарий'];
const GIFT_HEAD = ['Когда', 'ID подарка', 'Подарок', 'Кто дарит', 'Токен'];

function setup() {
  sheet_(RSVP, RSVP_HEAD);
  sheet_(GIFTS, GIFT_HEAD);
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('ADMIN_PIN')) props.setProperty('ADMIN_PIN', String(Math.floor(1000 + Math.random() * 9000)));
  Logger.log('ADMIN_PIN = ' + props.getProperty('ADMIN_PIN'));
}

function doGet(e) {
  const p = e.parameter || {};
  if (p.action === 'state') return json_(publicState_());
  if (p.action === 'admin') return pinOk_(p.pin) ? json_(adminState_()) : json_({ ok: false, error: 'pin' });
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
  sheet_(RSVP, RSVP_HEAD).appendRow([new Date(), child, b.coming === false ? 'нет' : 'да',
    clean_(b.parent, 60), clean_(b.contact, 60), clean_(b.note, 300)]);
  return { ok: true, state: publicState_() };
}

function reserve_(b) {
  const id = clean_(b.giftId, 40);
  const who = clean_(b.who, 60);
  if (!/^[a-z0-9-]+$/.test(id)) return { ok: false, error: 'bad gift' };
  if (!who) return { ok: false, error: 'Укажите, от кого подарок' };
  if (takenIds_().indexOf(id) !== -1) return { ok: false, error: 'taken', state: publicState_() };
  const token = Utilities.getUuid();
  sheet_(GIFTS, GIFT_HEAD).appendRow([new Date(), id, clean_(b.giftTitle, 80), who, token]);
  return { ok: true, token: token, state: publicState_() };
}

function release_(b) {
  const id = clean_(b.giftId, 40);
  const sh = sheet_(GIFTS, GIFT_HEAD);
  const rows = sh.getDataRange().getValues();
  const admin = pinOk_(b.pin);
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] === id && (admin || (b.token && rows[i][4] === b.token))) {
      sh.deleteRow(i + 1);
      return { ok: true, state: publicState_() };
    }
  }
  return { ok: false, error: 'not found' };
}

/* ---------- чтение ---------- */

function publicState_() {
  return { ok: true, taken: takenIds_(), coming: latestRsvp_().filter(r => r.coming).length };
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
    byChild[String(r[1]).trim().toLowerCase()] =
      { at: r[0], child: r[1], coming: r[2] === 'да', parent: r[3], contact: r[4], note: r[5] };
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
  return sh;
}
function pinOk_(pin) {
  const real = PropertiesService.getScriptProperties().getProperty('ADMIN_PIN');
  return !!real && String(pin || '') === real;
}
function clean_(s, max) {
  // обрезаем; если начинается с = + - @, ставим апостроф, чтобы таблица не приняла текст за формулу
  const v = String(s == null ? '' : s).trim().slice(0, max);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
