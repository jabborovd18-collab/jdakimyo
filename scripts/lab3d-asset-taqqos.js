/**
 * BRIF-02 dalili — stakanning protsedural va `.glb` variantlari
 * bir xil kameradan.
 *
 * Ikki marta yuklaydi: birinchisida model keladi, ikkinchisida uning
 * so'rovi to'sib qo'yiladi va sahna zaxiraga tushadi. Ikkala kadr ham
 * `.olcham/` ga yoziladi.
 */

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ASOS = process.env.LAB3D_URL || "http://localhost:3000";
const CHIQISH = path.join(__dirname, "..", ".olcham");

// Stakan SLOTLAR[6] = [-0.55, 0.9, 0] da turadi. Kamera unga yaqin
// va biroz yuqoridan qaraydi — shisha qalinligi va tub ko'rinsin.
const YAQIN = {
  kamera: [-0.16, 1.34, 0.46],
  nishon: [-0.55, 1.0, 0.0],
  up: [0, 1, 0],
};

async function kadrOl(browser, tosilsinmi) {
  const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
  if (tosilsinmi) await page.route("**/3d/modellar/*.glb", (r) => r.abort());
  await page.goto(`${ASOS}/laboratoriya/3d/olcham?profil=desktop&nuqta=stol`, {
    waitUntil: "domcontentloaded", timeout: 60000,
  });
  await page.waitForSelector("canvas", { timeout: 60000 });
  await page.waitForFunction(() => typeof window.__olcham === "function", { timeout: 90000, polling: 500 });
  await page.waitForTimeout(4000);

  const natija = await page.evaluate((nuqta) => window.__olcham({
    nuqta: "stol", kameraNuqta: nuqta, rasm: true,
  }), YAQIN);
  await page.close();
  return natija;
}

async function asosiy() {
  fs.mkdirSync(CHIQISH, { recursive: true });
  const browser = await chromium.launch();
  try {
    const glb = await kadrOl(browser, false);
    const zaxira = await kadrOl(browser, true);

    for (const [nom, n] of [["glb", glb], ["zaxira", zaxira]]) {
      const fayl = path.join(CHIQISH, `stakan-${nom}.png`);
      fs.writeFileSync(fayl, Buffer.from(n.rasm.slice(n.rasm.indexOf(",") + 1), "base64"));
      console.log(`${nom.padEnd(7)} uchburchak=${n.uchburchak} chaqiruv=${n.chaqiruv} ` +
        `asset(yuklandi=${n.asset.yuklandi} xato=${n.asset.xato}) -> ${path.basename(fayl)}`);
    }
    console.log(`\nuchburchak farqi: ${glb.uchburchak - zaxira.uchburchak}`);
  } finally {
    await browser.close();
  }
}

asosiy().catch((e) => { console.error(e.message); process.exit(1); });
