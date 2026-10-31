/* feedback.js — the feedback page (form, texts in EN / MS / 中文, sending) */
const FT = {
  en: { back: "Back to map", title: "Send feedback", intro: "Found a problem or have an idea? Tell the developer — it goes straight to his email.",
    t_issue: "🐞 Something is wrong", t_improve: "💡 Suggestion", t_schedule: "🕒 Wrong bus time / route", t_other: "💬 Other",
    l_type: "What is it about?", l_msg: "What happened, or what can be improved?", ph_msg: "e.g. The bus time at KRP_G11 is different from the real bus…",
    l_where: "Bus / stop / screen (optional)", ph_where: "e.g. E1, KRP_G11, Plan tab", l_rate: "How is the app so far? (optional)",
    l_email: "Your email (optional, only if you want a reply)", l_tech: "Include device & app info (helps me fix bugs)",
    send: "Send feedback", sending: "Sending…", privacy: "Your message is emailed to the developer. Please do not include passwords or private details.",
    e_type: "Please choose what it is about.", e_short: "Please write at least 10 characters.", e_long: "Please keep it under 2000 characters.", e_email: "That email address does not look right.",
    e_wait: "Please wait a moment before sending again.", e_net: "Could not send. Check your connection and try again.", e_server: "The feedback service refused the message. Please try again later.",
    e_conf: "Feedback is not set up yet (the developer still needs to add the access key).", e_mailto: "Send with my email app",
    ok_title: "Thank you! 🎉", ok_text: "Your feedback was sent. It really helps make the app better.", again: "Send another", home: "Back to map" },
  ms: { back: "Kembali ke peta", title: "Hantar maklum balas", intro: "Jumpa masalah atau ada idea? Beritahu pembangun — ia terus dihantar ke e-melnya.",
    t_issue: "🐞 Ada masalah", t_improve: "💡 Cadangan", t_schedule: "🕒 Masa / laluan bas salah", t_other: "💬 Lain-lain",
    l_type: "Tentang apa?", l_msg: "Apa yang berlaku, atau apa yang boleh diperbaiki?", ph_msg: "cth. Masa bas di KRP_G11 berbeza daripada bas sebenar…",
    l_where: "Bas / perhentian / skrin (pilihan)", ph_where: "cth. E1, KRP_G11, tab Plan", l_rate: "Bagaimana aplikasi ini setakat ini? (pilihan)",
    l_email: "E-mel anda (pilihan, jika mahu dibalas)", l_tech: "Sertakan maklumat peranti & aplikasi (membantu pembaikan)",
    send: "Hantar", sending: "Menghantar…", privacy: "Mesej anda dihantar melalui e-mel kepada pembangun. Jangan sertakan kata laluan atau butiran peribadi.",
    e_type: "Sila pilih tentang apa.", e_short: "Sila tulis sekurang-kurangnya 10 aksara.", e_long: "Sila pendekkan kepada bawah 2000 aksara.", e_email: "Alamat e-mel kelihatan tidak betul.",
    e_wait: "Sila tunggu sebentar sebelum menghantar semula.", e_net: "Gagal menghantar. Semak sambungan anda dan cuba lagi.", e_server: "Perkhidmatan menolak mesej. Sila cuba lagi nanti.",
    e_conf: "Maklum balas belum disediakan (pembangun perlu menambah kunci akses).", e_mailto: "Hantar dengan aplikasi e-mel",
    ok_title: "Terima kasih! 🎉", ok_text: "Maklum balas anda telah dihantar. Ia sangat membantu.", again: "Hantar lagi", home: "Kembali ke peta" },
  zh: { back: "返回地图", title: "提交反馈", intro: "发现问题或有好点子？告诉开发者——会直接发到他的邮箱。",
    t_issue: "🐞 出了问题", t_improve: "💡 建议", t_schedule: "🕒 巴士时间/路线不对", t_other: "💬 其他",
    l_type: "是关于什么？", l_msg: "发生了什么，或哪里可以改进？", ph_msg: "例如：KRP_G11 的巴士时间和实际不一样……",
    l_where: "巴士 / 站点 / 页面（选填）", ph_where: "例如：E1、KRP_G11、Plan 页面", l_rate: "目前觉得这个应用如何？（选填）",
    l_email: "你的邮箱（选填，需要回复时才填）", l_tech: "附上设备和应用信息（有助于修复问题）",
    send: "发送反馈", sending: "发送中…", privacy: "你的留言会通过电子邮件发给开发者。请不要填写密码或私人信息。",
    e_type: "请选择反馈类型。", e_short: "请至少输入 10 个字符。", e_long: "请控制在 2000 字符以内。", e_email: "邮箱格式似乎不正确。",
    e_wait: "请稍等片刻再发送。", e_net: "发送失败，请检查网络后重试。", e_server: "反馈服务拒绝了该消息，请稍后再试。",
    e_conf: "反馈功能尚未设置（开发者还需要添加访问密钥）。", e_mailto: "用邮件应用发送",
    ok_title: "谢谢！🎉", ok_text: "反馈已发送，这对改进应用很有帮助。", again: "再发一条", home: "返回地图" }
};
const $ = id => document.getElementById(id);
let LANG = "en";
try { LANG = localStorage.getItem("lang") || ""; } catch (e) {}
if (!FT[LANG]) { const n = (navigator.language || "en").toLowerCase(); LANG = n.startsWith("zh") ? "zh" : n.startsWith("ms") ? "ms" : "en"; }
const ft = k => FT[LANG][k] || FT.en[k] || k;
const CFG = window.MYROAD_FEEDBACK || {};
let rating = 0, busy = false;

function applyLang() {
  document.documentElement.lang = LANG === "zh" ? "zh-CN" : LANG;
  document.title = ft("title") + " – UTM Shuttle";
  document.querySelectorAll("[data-t]").forEach(el => { el.textContent = ft(el.dataset.t); });
  document.querySelectorAll("[data-ph]").forEach(el => { el.placeholder = ft(el.dataset.ph); });
  $("langSel").value = LANG;
}
function setStatus(msg, kind) { const s = $("status"); s.textContent = msg || ""; s.className = "status" + (kind ? " " + kind : ""); }
function collect() {
  const f = $("fbForm");
  return { type: (f.querySelector("input[name=type]:checked") || {}).value, message: f.message.value, where: f.where.value,
           rating, email: f.email.value, includeTech: f.tech.checked };
}
function env() {
  let st = {}; try { st = { mapStyle: localStorage.getItem("mapStyle"), timeOfDay: localStorage.getItem("tod"), appLang: localStorage.getItem("lang") }; } catch (e) {}
  return { build: CFG.build || "?", page: location.href, referrer: document.referrer || "-", userAgent: navigator.userAgent, language: navigator.language,
           screen: `${screen.width}x${screen.height} @${window.devicePixelRatio || 1}x`, viewport: `${innerWidth}x${innerHeight}`,
           timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone || "-"), time: new Date().toString(), ...st };
}
function showFallback(p) {
  const old = $("mailFallback"); if (old) old.remove();
  if (!CFG.fallbackEmail) return;
  const a = document.createElement("a"); a.id = "mailFallback"; a.className = "ghost"; a.textContent = ft("e_mailto"); a.href = FB.mailtoUrl(CFG, p);
  $("status").after(a);
}
async function onSubmit(ev) {
  ev.preventDefault(); if (busy) return;
  const d = collect(), err = FB.validate(d);
  if (err.type) return setStatus(ft("e_type"), "err");
  if (err.message) return setStatus(ft(err.message === "long" ? "e_long" : "e_short"), "err"), $("message").focus();
  if (err.email) return setStatus(ft("e_email"), "err"), $("email").focus();
  if ($("fbForm").botcheck.checked) return done();                       // honeypot: bots tick it, pretend success
  let last = 0; try { last = +localStorage.getItem("fbLast") || 0; } catch (e) {}
  if (Date.now() - last < 30000) return setStatus(ft("e_wait"), "err");
  busy = true; $("sendBtn").disabled = true; $("sendBtn").textContent = ft("sending"); setStatus("");
  const payload = FB.buildPayload(CFG, d, d.includeTech ? env() : null);
  const res = await FB.send(CFG, payload, (u, o) => fetch(u, o));
  busy = false; $("sendBtn").disabled = false; $("sendBtn").textContent = ft("send");
  if (res.ok) {
    try { localStorage.setItem("fbLast", String(Date.now())); } catch (e) {}
    try { if (window.gtag) gtag("event", "feedback_submit", { type: d.type }); } catch (e) {}
    return done();
  }
  if (res.reason === "not_configured") console.warn("Feedback not configured: put your Web3Forms access key in js/config.js");
  setStatus(ft(res.reason === "not_configured" ? "e_conf" : res.reason === "server" ? "e_server" : "e_net"), "err");
  showFallback(payload);
}
function done() { $("formCard").classList.add("hide"); $("doneCard").classList.remove("hide"); window.scrollTo(0, 0); }
function reset() {
  $("fbForm").reset(); rating = 0; document.querySelectorAll(".rate button").forEach(b => b.classList.remove("on"));
  $("count").textContent = "0 / " + FB.MAX; setStatus("");
  const old = $("mailFallback"); if (old) old.remove();
  $("doneCard").classList.add("hide"); $("formCard").classList.remove("hide");
}

document.addEventListener("DOMContentLoaded", () => {
  applyLang();
  $("langSel").onchange = () => { LANG = $("langSel").value; try { localStorage.setItem("lang", LANG); } catch (e) {} applyLang(); };
  $("fbForm").addEventListener("submit", onSubmit);
  $("message").addEventListener("input", e => { $("count").textContent = e.target.value.length + " / " + FB.MAX; });
  document.querySelectorAll(".rate button").forEach(b => b.addEventListener("click", () => {
    const v = +b.dataset.v; rating = rating === v ? 0 : v;
    document.querySelectorAll(".rate button").forEach(x => x.classList.toggle("on", +x.dataset.v === rating));
  }));
  $("againBtn").onclick = reset;
  const q = new URLSearchParams(location.search).get("type"); if (q && FB.TYPES[q]) { const r = document.querySelector(`input[name=type][value=${q}]`); if (r) r.checked = true; }
  if (!FB.isConfigured(CFG)) console.warn("Feedback not configured yet: put your Web3Forms access key in js/config.js");
});
