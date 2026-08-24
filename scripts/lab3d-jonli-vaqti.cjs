// korinish.js ISH VAQTIDA bajariladimi — vaqtinchalik tekshiruv.
//
// scripts/lab3d-ish-vaqti.cjs faqat /laboratoriya/3d/olcham ni ochadi,
// u esa korinish.js ni UMUMAN import qilmaydi. Ya'ni korinish.js
// bo'linganda mavjud tekshiruvlarning HECH BIRI uni bajarmaydi:
// build jim o'tadi, o'lchov ham jim o'tadi.
//
// Bu skript jonli sahifani ochadi. Login yo'q, shuning uchun sahna
// qurilmaydi va "kirilmagan" ekrani chiqadi — LEKIN modul importlari,
// hooklarning chaqirilishi va birinchi renderi baribir bajariladi.
// Aynan shu yerda yo'qolgan import yiqiladi.
const { chromium } = require("playwright");

const MANZIL = process.env.LAB3D_URL || "http://localhost:3000";

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const xatolar = [];
  p.on("pageerror", (e) => xatolar.push("SAHIFA: " + String(e.message)));
  p.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    // 401/403 — login yo'qligining kutilgan natijasi, nuqson emas.
    if (/401|403|Unauthorized|Failed to load resource/i.test(t)) return;
    xatolar.push("KONSOL: " + t);
  });

  await p.goto(MANZIL + "/laboratoriya/3d", {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });

  // React ilova o'z ekranini chizishini kutamiz: yo "kirilmagan"
  // ekrani, yo canvas. Ikkalasi ham "kod bajarildi" degani.
  const chizildi = await p
    .waitForFunction(
      () => {
        const t = document.body.innerText || "";
        return document.querySelector("canvas") !== null
          || /kir|hisob|login/i.test(t);
      },
      { timeout: 45000 },
    )
    .then(() => true)
    .catch(() => false);

  const matn = (await p.evaluate(() => document.body.innerText || "")).slice(0, 120);
  console.log(chizildi ? "  korinish chizildi" : "  KORINISH CHIZILMADI");
  console.log("  ekran matni: " + JSON.stringify(matn.replace(/\s+/g, " ")));
  if (xatolar.length) {
    console.log(`  xatolar (${xatolar.length}):`);
    for (const x of xatolar.slice(0, 5)) console.log("   • " + x.split("\n")[0].slice(0, 200));
  } else {
    console.log("  ish vaqti xatosi yo'q");
  }
  await b.close();
  process.exit(chizildi && xatolar.length === 0 ? 0 : 1);
})();
