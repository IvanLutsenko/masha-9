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

  function pub() { return { ok: true, taken: demo.gifts.map(g => g.id), coming: demo.rsvp.filter(r => r.coming).length }; }
  function demoGet(p) {
    if (p.action === "admin") return { ok: true, rsvp: demo.rsvp, gifts: demo.gifts };
    return pub();
  }
  function demoPost(b) {
    if (b.action === "rsvp") {
      demo.rsvp = demo.rsvp.filter(r => r.child.toLowerCase() !== b.child.toLowerCase());
      demo.rsvp.push({ at: new Date().toISOString(), child: b.child, coming: b.coming !== false, parent: b.parent, contact: b.contact, note: b.note });
      return { ok: true, state: pub() };
    }
    if (b.action === "reserve") {
      if (demo.gifts.some(g => g.id === b.giftId)) return { ok: false, error: "taken", state: pub() };
      const token = Math.random().toString(36).slice(2);
      demo.gifts.push({ at: new Date().toISOString(), id: b.giftId, title: b.giftTitle, who: b.who, token });
      return { ok: true, token, state: pub() };
    }
    if (b.action === "release") {
      demo.gifts = demo.gifts.filter(g => !(g.id === b.giftId && (b.pin || g.token === b.token)));
      return { ok: true, state: pub() };
    }
  }

  return { get, post, isDemo: () => !url() };
})();
