// Тонкий клиент к Apps Script. Без scriptUrl работает демо-режим в памяти.
window.API = (() => {
  const url = () => (window.PARTY.scriptUrl || "").trim();
  const demo = { taken: [], coming: 0, rsvp: [], gifts: [] };

  async function get(params) {
    if (!url()) return demoGet(params);
    const r = await fetch(url() + "?" + new URLSearchParams(params));
    return r.json();
  }
  async function post(body) {
    if (!url()) return demoPost(body);
    // text/plain — «простой» запрос без preflight, Apps Script его принимает
    const r = await fetch(url(), { method: "POST", body: JSON.stringify(body) });
    return r.json();
  }

  const norm = x => String(x || "").trim().toLowerCase().replace(/ё/g, "е");
  function pub(who){ return { ok: true, taken: demo.gifts.map(g => g.id), mine: who ? demo.gifts.filter(g => norm(g.who) === norm(who)).map(g => g.id) : [] }; }
  function demoGet(p) {
    if (p.action === "admin") return { ok: true, rsvp: demo.rsvp, gifts: demo.gifts };
    return pub(p.who);
  }
  function demoPost(b) {
    if (b.action === "rsvp") {
      const kids = b.kids || [{ name: b.child, coming: b.coming !== false }];
      const n = kids.filter(k => k.coming).length;
      demo.rsvp = demo.rsvp.filter(r => norm(r.child) !== norm(b.child));
      demo.rsvp.push({ at: new Date().toISOString(), child: b.child, coming: n > 0, kids: n, contact: b.contact, note: b.note, detail: kids.map(k => k.name + (k.coming ? " — да" : " — нет")).join(", ") });
      return { ok: true };
    }
    if (b.action === "reserve") {
      const ex = demo.gifts.find(g => g.id === b.giftId);
      if (ex) return ex.token === b.rid ? { ok: true, token: b.rid, state: pub(b.who) } : { ok: false, error: "taken", state: pub(b.who) };
      demo.gifts.push({ at: new Date().toISOString(), id: b.giftId, title: b.giftTitle, who: b.who, token: b.rid });
      return { ok: true, token: b.rid, state: pub(b.who) };
    }
    if (b.action === "release") {
      const before = demo.gifts.length;
      demo.gifts = demo.gifts.filter(g => !(g.id === b.giftId && (b.pin || (b.token && g.token === b.token) || (b.who && norm(g.who) === norm(b.who)))));
      return demo.gifts.length < before ? { ok: true, state: pub(b.who) } : { ok: false, error: "not found" };
    }
  }

  return { get, post, isDemo: () => !url() };
})();
