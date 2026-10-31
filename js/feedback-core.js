const FB = (() => {
  const TYPES = { issue: "Issue / bug", improve: "Suggestion / improvement", schedule: "Wrong bus time or route", other: "Other" };
  const MIN = 10, MAX = 2000;

  // Check if Web App URL is set
  const isConfigured = cfg => !!cfg && !!cfg.endpoint && !/PASTE|YOUR_/i.test(cfg.endpoint);

  function validate(d) {
    const e = {}, m = (d.message || "").trim();
    if (!TYPES[d.type]) e.type = "type";
    if (m.length < MIN) e.message = "short"; else if (m.length > MAX) e.message = "long";
    if (d.email && d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = "email";
    return e;
  }

  function buildPayload(cfg, d, env) {
    const msg = d.message.trim();
    const p = {
      subject: `${cfg.subjectPrefix || "[Feedback]"} ${TYPES[d.type]} - ${msg.replace(/\s+/g, " ").slice(0, 50)}`,
      type: TYPES[d.type],
      message: msg
    };
    if (d.where && d.where.trim()) p.where = d.where.trim().slice(0, 200);
    if (d.rating) p.rating = d.rating + " / 5";
    if (d.email && d.email.trim()) p.email = d.email.trim();
    if (d.includeTech && env) p.device_info = Object.entries(env).map(([k, v]) => `${k}: ${v}`).join("\n");
    return p;
  }

  function mailtoUrl(cfg, p) {
    const lines = ["Type: " + p.type];
    if (p.where) lines.push("Where: " + p.where);
    if (p.rating) lines.push("Rating: " + p.rating);
    lines.push("", p.message);
    if (p.device_info) lines.push("", "--", p.device_info);
    return "mailto:" + cfg.fallbackEmail + "?subject=" + encodeURIComponent(p.subject) + "&body=" + encodeURIComponent(lines.join("\n").slice(0, 1500));
  }

  async function send(cfg, payload, fetchFn) {
    if (!isConfigured(cfg)) return { ok: false, reason: "not_configured" };
    try {
      // Note: Google Apps Script redirects POST requests, redirect: "follow" handles this cleanly
      const r = await fetchFn(cfg.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight issues with GAS
        body: JSON.stringify(payload),
        redirect: "follow"
      });
      let j = {}; try { j = await r.json(); } catch (e) {}
      if (j.success !== false) return { ok: true };
      return { ok: false, reason: "server", detail: j.message || r.status };
    } catch (e) { return { ok: false, reason: "network" }; }
  }

  return { TYPES, MIN, MAX, isConfigured, validate, buildPayload, mailtoUrl, send };
})();

if (typeof module !== "undefined") module.exports = FB;
