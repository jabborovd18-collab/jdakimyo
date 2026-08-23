// Sahna ISH VAQTIDA quriladimi — build buni ko'rsatmaydi.
//
// 2026-08-23: `jihoz-modellari.js` bo'linganda uchta import tushib
// qoldi va uchalasi ham build'dan o'tdi. Sahna esa umuman qurilmadi.
const { chromium } = require("playwright");

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const xatolar = [];
  p.on("pageerror", (e) => xatolar.push(String(e.message)));
  p.on("console", (m) => { if (m.type() === "error") xatolar.push("KONSOL: " + m.text()); });
  await p.goto("http://localhost:3000/laboratoriya/3d/olcham?profil=telefon&nuqta=stol", {
    waitUntil: "domcontentloaded", timeout: 60000,
  });
  const tayyor = await p
    .waitForFunction(() => typeof window.__olcham === "function", { timeout: 45000 })
    .then(() => true)
    .catch(() => false);
  console.log(tayyor ? "  sahna qurildi" : "  SAHNA QURILMADI");
  if (xatolar.length) {
    console.log(`  xatolar (${xatolar.length}):`);
    for (const x of xatolar.slice(0, 3)) console.log("   • " + x.split("\n")[0].slice(0, 200));
  } else {
    console.log("  ish vaqti xatosi yo'q");
  }
  await b.close();
  process.exit(tayyor && xatolar.length === 0 ? 0 : 1);
})();
