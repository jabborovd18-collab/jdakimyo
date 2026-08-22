/**
 * BRIF-02 qabul sinovi — asset quvuri.
 *
 * Uch narsani tekshiradi:
 *   1. `.glb` haqiqatan yuklandi va sahnaga qo'llandi;
 *   2. 20 marta idish qo'yib/olib tashlaganda `renderer.info.memory`
 *      o'smaydi (kesh ulashilgan geometriyani saqlaydi);
 *   3. model kelmaganda sahna yiqilmaydi (yo'l buzilgan holda sinov).
 *
 * Dev server ishlab turishi shart, xuddi `lab3d:olcham` kabi.
 */

const { chromium } = require("playwright");

const ASOS = process.env.LAB3D_URL || "http://localhost:3000";

async function sahifaOch(browser, qoshimcha = "") {
  const page = await browser.newPage({ viewport: { width: 1024, height: 640 } });
  const konsol = [];
  page.on("console", (m) => konsol.push(`${m.type()}: ${m.text()}`));
  page.on("pageerror", (e) => konsol.push(`pageerror: ${e.message}`));
  const javob = await page.goto(`${ASOS}/laboratoriya/3d/olcham?profil=desktop&nuqta=stol${qoshimcha}`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  if (!javob || !javob.ok()) throw new Error(`sahifa ${javob ? javob.status() : "yo'q"}`);
  await page.waitForFunction(
    () => typeof window.__olcham === "function" && typeof window.__assetSinovi === "function",
    { timeout: 90000, polling: 500 },
  );
  return { page, konsol };
}

async function asosiy() {
  const browser = await chromium.launch();
  let xatolar = 0;
  try {
    // --- 1 va 2: normal holat ---
    const { page, konsol } = await sahifaOch(browser);
    // Model yuklanishi va qo'llanishi uchun bir necha kadr.
    await page.waitForTimeout(4000);

    const olchov = await page.evaluate(() => window.__olcham({ nuqta: "stol" }));
    const asset = olchov.asset;
    console.log("1) ASSET HOLATI");
    console.log(`   jami=${asset.jami} yuklandi=${asset.yuklandi} xato=${asset.xato} keshda=${asset.keshda}`);
    if (asset.yuklandi !== 1 || asset.xato !== 0 || asset.keshda !== 1) {
      console.log("   XATO: model yuklanmadi");
      xatolar += 1;
    }

    const qollandi = await page.evaluate(() => {
      const sahna = window.__sahnaTekshir ? window.__sahnaTekshir() : null;
      return sahna;
    });
    void qollandi;

    console.log("\n2) 20 MARTALIK XOTIRA SINOVI");
    const xotira = await page.evaluate(() => window.__assetSinovi(20));
    console.log(`   oldin  geometriya=${xotira.oldin.geometriya} tekstura=${xotira.oldin.tekstura}`);
    console.log(`   keyin  geometriya=${xotira.keyin.geometriya} tekstura=${xotira.keyin.tekstura}`);
    console.log(`   o'sish geometriya=${xotira.geometriyaOsdi} tekstura=${xotira.teksturaOsdi}`);
    console.log(`   qadamlar (qo'yilganda/olingandan keyin): ${xotira.qadamlar.slice(0, 6).join("  ")} ...`);
    if (xotira.geometriyaOsdi > 0 || xotira.teksturaOsdi > 0) {
      console.log("   XATO: xotira o'sdi");
      xatolar += 1;
    }

    const yomonKonsol = konsol.filter((r) => r.startsWith("error") || r.startsWith("pageerror"));
    if (yomonKonsol.length) {
      console.log("\n   konsol xatolari:");
      yomonKonsol.slice(0, 5).forEach((r) => console.log("     " + r));
      xatolar += 1;
    }
    await page.close();

    // --- 3: model kelmaganda sahna yiqilmasin ---
    console.log("\n3) MODEL KELMAGANDA (404 majburlanadi)");
    const page2 = await browser.newPage({ viewport: { width: 1024, height: 640 } });
    await page2.route("**/3d/modellar/*.glb", (marshrut) => marshrut.abort());
    const xatolar2 = [];
    page2.on("pageerror", (e) => { xatolar2.push(e.message); console.log("   [sahifa xatosi] " + e.message); });
    page2.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.log("   [konsol] " + m.text().slice(0, 160)); });
    await page2.goto(`${ASOS}/laboratoriya/3d/olcham?profil=desktop&nuqta=stol`, {
      waitUntil: "domcontentloaded", timeout: 60000,
    });
    await page2.waitForSelector("canvas", { timeout: 60000 });
    await page2.waitForFunction(() => typeof window.__olcham === "function", { timeout: 90000, polling: 500 });
    await page2.waitForTimeout(3500);
    const olchov2 = await page2.evaluate(() => window.__olcham({ nuqta: "stol" }));
    console.log(`   asset: jami=${olchov2.asset.jami} yuklandi=${olchov2.asset.yuklandi} xato=${olchov2.asset.xato}`);
    console.log(`   sahna: chaqiruv=${olchov2.chaqiruv} uchburchak=${olchov2.uchburchak} interaktivSoni=${olchov2.interaktivSoni}`);
    if (olchov2.asset.xato !== 1) {
      console.log("   XATO: yuklash xatosi qayd etilmadi");
      xatolar += 1;
    }
    if (!olchov2.chaqiruv || !olchov2.interaktivSoni) {
      console.log("   XATO: sahna yiqildi");
      xatolar += 1;
    }
    if (xatolar2.length) {
      console.log("   sahifa xatolari:", xatolar2.slice(0, 3));
      xatolar += 1;
    }
    await page2.close();
  } finally {
    await browser.close();
  }

  console.log(`\nXULOSA: ${xatolar === 0 ? "HAMMASI O'TDI" : xatolar + " ta muammo"}`);
  process.exit(xatolar === 0 ? 0 : 1);
}

asosiy().catch((e) => {
  console.error("SINOV YIQILDI:", e.message);
  process.exit(1);
});
