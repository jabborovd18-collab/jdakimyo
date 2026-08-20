/**
 * 3D laboratoriya grafikasini RAQAM bilan o'lchaydi.
 *
 * Ishga tushirish:
 *   npm run dev                  # boshqa terminalda
 *   npm run lab3d:olcham         # 12 qatorli jadval
 *   npm run lab3d:olcham -- --json
 *
 * Dev server ishlamasa jim qolmaydi — aniq xato va exit 1.
 *
 * Chegaralar BRIF-01 dan (docs/3d-lab/BRIF-01-yoruglik-byudjeti.md).
 * Bu skript sahnani o'zgartirmaydi, faqat o'qiydi.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");

const ASOS = process.env.LAB3D_URL || "http://localhost:3000";
const CHIQISH_DIR = path.join(__dirname, "..", ".olcham");

// fonlar.js dagi kalitlar — tartib qat'iy, "oldin/keyin" shu tartibda.
const MAVZULAR = ["tun", "siyoh", "grafit", "kunduz"];
const NUQTALAR = ["stol", "xona", "ship"];

// Manba: BRIF-01 qabul mezonlari. O'zgartirish kerak bo'lsa avval brifni yangilang.
const BRIF01 = {
  kuyganMaks: 1,
  qoraMaks: 5,
  ortachaMin: 0.18,
  ortachaMaks: 0.45,
  shipPolFarqMaks: 0.5,
};

const jsonRejim = process.argv.includes("--json");

function yaxlit(son, raqam) {
  if (typeof son !== "number" || !Number.isFinite(son)) return son;
  const k = 10 ** raqam;
  return Math.round(son * k) / k;
}

function qatorniJadvalga(q) {
  return {
    mavzu: q.mavzu,
    nuqta: q.nuqta,
    kuygan: yaxlit(q.kuygan, 2),
    qora: yaxlit(q.qora, 2),
    ortacha: yaxlit(q.ortacha, 4),
    p50: yaxlit(q.p50, 4),
    p95: yaxlit(q.p95, 4),
    shipLuma: yaxlit(q.shipLuma, 4),
    polLuma: yaxlit(q.polLuma, 4),
    fps: yaxlit(q.fps, 1),
    uchburchak: q.uchburchak,
    chaqiruv: q.chaqiruv,
    teksturaXotira: q.teksturaXotira,
  };
}

function chegaradanChiqdimi(q) {
  const sabab = [];
  if (q.kuygan > BRIF01.kuyganMaks) sabab.push(`kuygan=${yaxlit(q.kuygan, 2)}% (>${BRIF01.kuyganMaks})`);
  if (q.qora > BRIF01.qoraMaks) sabab.push(`qora=${yaxlit(q.qora, 2)}% (>${BRIF01.qoraMaks})`);
  if (q.ortacha < BRIF01.ortachaMin || q.ortacha > BRIF01.ortachaMaks) {
    sabab.push(`ortacha=${yaxlit(q.ortacha, 4)} (0.18–0.45 emas)`);
  }
  const farq = Math.abs((q.shipLuma || 0) - (q.polLuma || 0));
  if (farq > BRIF01.shipPolFarqMaks) {
    sabab.push(`ship-pol farq=${yaxlit(farq, 4)} (>${BRIF01.shipPolFarqMaks})`);
  }
  return sabab;
}

function serverniTekshir() {
  return new Promise((resolve, reject) => {
    const url = new URL("/laboratoriya/3d/olcham", ASOS);
    const req = http.get(
      {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        timeout: 4000,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode);
      },
    );
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.on("error", (err) => reject(err));
  });
}

async function asosiy() {
  let holat;
  try {
    holat = await serverniTekshir();
  } catch (err) {
    console.error(
      `XATO: dev server ${ASOS} da ishlamayapti (${err.message}).\n` +
        "Avval boshqa terminalda `npm run dev` ni ishga tushiring, keyin `npm run lab3d:olcham`.",
    );
    process.exit(1);
  }

  if (holat === 404) {
    console.error(
      "XATO: /laboratoriya/3d/olcham 404 qaytardi.\n" +
        "Bu marshrut faqat `next dev` da ochiladi. `npm start` (production) da ataylab 404.",
    );
    process.exit(1);
  }

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    console.error(
      "XATO: playwright o'rnatilmagan. `npm install` qiling (devDependencies).",
    );
    process.exit(1);
  }

  fs.mkdirSync(CHIQISH_DIR, { recursive: true });

  const webglArgs = [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--enable-unsafe-swiftshader",
  ];

  let browser;
  try {
    browser = await chromium.launch({ headless: true, args: webglArgs });
  } catch (birinchi) {
    // Playwright o'z Chromiumini cdn.playwright.dev dan oladi — ba'zi
    // tarmoqlarda u yopiq. @sparticuz/chromium npm orqali keladi va
    // WebGL uchun SwiftShader ni o'zi chiqaradi.
    try {
      const lambdaMod = await import("@sparticuz/chromium");
      const lambda = lambdaMod.default;
      lambda.setGraphicsMode = true;
      // al2023.lib nspr/nss — playwright CDN ishlamasa, shu paketning
      // o'z kutubxonalari kerak (Debian da libnspr4 o'rnatilmagan bo'lishi mumkin).
      const binDir = require("path").join(
        __dirname,
        "..",
        "node_modules",
        "@sparticuz",
        "chromium",
        "bin",
      );
      if (lambdaMod.inflate) {
        await lambdaMod.inflate(require("path").join(binDir, "al2023.tar.br"));
      }
      const libDir = require("path").join(require("os").tmpdir(), "al2023", "lib");
      process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
        ? `${libDir}:${process.env.LD_LIBRARY_PATH}`
        : libDir;
      browser = await chromium.launch({
        headless: true,
        executablePath: await lambda.executablePath(),
        args: [...lambda.args, ...webglArgs],
      });
    } catch (ikkinchi) {
      console.error(
        "XATO: Chromium ochilmadi.\n" +
          "  1) npx playwright install chromium\n" +
          "  2) yoki npm i -D @sparticuz/chromium\n" +
          birinchi.message +
          "\n" +
          ikkinchi.message,
      );
      process.exit(1);
    }
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
  });

  const olchovlar = [];
  try {
    const page = await context.newPage();
    try {
      for (const mavzu of MAVZULAR) {
        const manzil = `${ASOS}/laboratoriya/3d/olcham?mavzu=${mavzu}&nuqta=stol`;
        process.stderr.write(`→ ${mavzu} yuklanmoqda\n`);
        const javob = await page.goto(manzil, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });
        if (!javob || !javob.ok()) {
          throw new Error(`${manzil} → HTTP ${javob ? javob.status() : "yo'q"}`);
        }
        await page.waitForFunction(() => typeof window.__olcham === "function", {
          timeout: 90000,
        });

        for (const nuqta of NUQTALAR) {
          process.stderr.write(`  ${mavzu}/${nuqta} ...\n`);
          const natija = await page.evaluate((n) => window.__olcham({ nuqta: n }), nuqta);
          const kerak = [
            "kuygan",
            "qora",
            "ortacha",
            "p50",
            "p95",
            "shipLuma",
            "polLuma",
            "fps",
            "uchburchak",
            "chaqiruv",
            "teksturaXotira",
          ];
          for (const maydon of kerak) {
            if (natija[maydon] === undefined || natija[maydon] === null) {
              throw new Error(`${mavzu}/${nuqta}: "${maydon}" yo'q`);
            }
          }
          olchovlar.push(natija);

          const png = path.join(CHIQISH_DIR, `${mavzu}-${nuqta}.png`);
          // To'liq 1280×720 toDataURL SwiftShader da o'n soniya oladi.
          // Odam ko'rigi uchun 640×360 yetarli.
          const dataUrl = await page.evaluate(() => {
            const src = document.querySelector("canvas");
            if (!src) throw new Error("canvas yo'q");
            const dst = document.createElement("canvas");
            dst.width = 640;
            dst.height = 360;
            dst.getContext("2d").drawImage(src, 0, 0, 640, 360);
            return dst.toDataURL("image/png");
          });
          fs.writeFileSync(
            png,
            Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64"),
          );
        }
      }
    } catch (err) {
      console.error(`XATO: ${err.message}`);
      await browser.close();
      process.exit(1);
    } finally {
      await page.close();
    }
  } finally {
    await browser.close();
  }

  const jadval = olchovlar.map(qatorniJadvalga);
  const chiqib = [];
  for (const q of olchovlar) {
    const sabab = chegaradanChiqdimi(q);
    if (sabab.length) chiqib.push({ mavzu: q.mavzu, nuqta: q.nuqta, sabab });
  }

  if (jsonRejim) {
    console.log(
      JSON.stringify(
        {
          olchovlar,
          xulosa: {
            jami: olchovlar.length,
            chiqibKetgan: chiqib.length,
            qatorlar: chiqib,
          },
        },
        null,
        2,
      ),
    );
  } else {
    console.table(jadval);
    if (chiqib.length === 0) {
      console.log("XULOSA: 12/12 o'lchov BRIF-01 chegarasida.");
    } else {
      console.log(
        `XULOSA: ${chiqib.length}/12 o'lchov BRIF-01 chegarasidan chiqdi`,
      );
      for (const q of chiqib) {
        console.log(`  ${q.mavzu}/${q.nuqta}  ${q.sabab.join("; ")}`);
      }
    }
  }

  if (olchovlar.length !== 12) {
    console.error(`XATO: ${olchovlar.length} o'lchov chiqdi, 12 bo'lishi shart`);
    process.exit(1);
  }
}

asosiy().catch((err) => {
  console.error("XATO:", err.message);
  process.exit(1);
});
