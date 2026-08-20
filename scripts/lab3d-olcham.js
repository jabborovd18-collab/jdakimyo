/**
 * 3D laboratoriya grafikasini RAQAM bilan o'lchaydi.
 *
 * Ishga tushirish:
 *   npm run dev                         # boshqa terminalda
 *   npm run lab3d:olcham                # 20 qatorli jadval
 *   npm run lab3d:olcham -- --json
 *   LAB3D_SIFAT=arzon npm run lab3d:olcham
 *
 * Dev server ishlamasa jim qolmaydi — aniq xato va exit 1.
 * Bu skript sahnani o'zgartirmaydi, faqat o'qiydi.
 */

const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");

const ASOS = process.env.LAB3D_URL || "http://localhost:3000";
const CHIQISH_DIR = path.join(__dirname, "..", ".olcham");
const KUTILGAN_QATOR = 20;

const sifat = process.env.LAB3D_SIFAT || "toliq";
if (sifat !== "toliq" && sifat !== "arzon") {
  console.error("XATO: LAB3D_SIFAT faqat toliq yoki arzon bo'lishi mumkin");
  process.exit(1);
}

let urug;
if (process.env.LAB3D_SEED !== undefined && process.env.LAB3D_SEED !== "") {
  urug = Number(process.env.LAB3D_SEED);
  if (!Number.isInteger(urug) || urug < 0 || urug > 0xffffffff) {
    console.error("XATO: LAB3D_SEED 0..4294967295 oralig'idagi butun son bo'lishi shart");
    process.exit(1);
  }
}

// Har kamera boshqa vazifani o'lchaydi; bitta oraliq shipni sun'iy
// yoritishga undardi. Manba va sabab: docs/3d-lab/OLCHOV.md.
const CHEGARALAR = {
  stol: { ortacha: [0.18, 0.45], kuygan: 1, qora: 5 },
  xona: { ortacha: [0.18, 0.45], kuygan: 1, qora: 5 },
  pol: { ortacha: [0.15, 0.50], kuygan: 1, qora: 5 },
  ship: { ortacha: [0.03, 0.25], kuygan: 0.5, qora: null },
  sweep: { ortacha: null, kuygan: 2, qora: null },
};
const SHIP_POL_FARQ_MAKS = 0.5;
const jsonRejim = process.argv.includes("--json");

function yaxlit(son, raqam) {
  if (typeof son !== "number" || !Number.isFinite(son)) return son;
  const k = 10 ** raqam;
  return Math.round(son * k) / k;
}

function sweepJoyniYoz(joy) {
  if (!joy) return "";
  return [
    `#${joy.indeks}`,
    `x=${yaxlit(joy.x, 2)}`,
    `y=${yaxlit(joy.y, 2)}`,
    `z=${yaxlit(joy.z, 2)}`,
    `yaw=${yaxlit(joy.gorizontalDaraja, 1)}°`,
    `pitch=${yaxlit(joy.vertikalDaraja, 1)}°`,
  ].join(" ");
}

function qatorniJadvalga(q) {
  return {
    mavzu: q.mavzu,
    nuqta: q.nuqta,
    sifat: q.sifat,
    kuygan: yaxlit(q.kuygan, 2),
    qora: yaxlit(q.qora, 2),
    ortacha: yaxlit(q.ortacha, 4),
    p50: yaxlit(q.p50, 4),
    p95: yaxlit(q.p95, 4),
    yuqoriSoha: yaxlit(q.yuqoriSoha, 4),
    quyiSoha: yaxlit(q.quyiSoha, 4),
    fps: yaxlit(q.fps, 1),
    chiroqSoni: q.chiroqSoni,
    uchburchak: q.uchburchak,
    chaqiruv: q.chaqiruv,
    teksturaXotira: q.teksturaXotira,
    renderer: q.renderer,
    sweepEngYomon: q.nuqta === "sweep" ? yaxlit(q.sweepEngYomon, 2) : "",
    sweepJoy: q.nuqta === "sweep" ? sweepJoyniYoz(q.sweepJoy) : "",
  };
}

function chegaradanChiqdimi(q) {
  const chegara = CHEGARALAR[q.nuqta];
  if (!chegara) return [`noma'lum nuqta=${q.nuqta}`];

  const sabab = [];
  if (q.kuygan >= chegara.kuygan) {
    sabab.push(`kuygan=${yaxlit(q.kuygan, 2)}% (≥${chegara.kuygan})`);
  }
  if (chegara.qora !== null && q.qora >= chegara.qora) {
    sabab.push(`qora=${yaxlit(q.qora, 2)}% (≥${chegara.qora})`);
  }
  if (chegara.ortacha) {
    const [min, maks] = chegara.ortacha;
    if (q.ortacha < min || q.ortacha > maks) {
      sabab.push(`ortacha=${yaxlit(q.ortacha, 4)} (${min}–${maks} emas)`);
    }
  }
  return sabab;
}

function shipPolFarqlariniHisobla(olchovlar, mavzular) {
  return mavzular.map((mavzu) => {
    const ship = olchovlar.find((q) => q.mavzu === mavzu && q.nuqta === "ship");
    const pol = olchovlar.find((q) => q.mavzu === mavzu && q.nuqta === "pol");
    if (!ship || !pol) throw new Error(`${mavzu}: ship yoki pol o'lchovi yo'q`);
    return {
      mavzu,
      shipPolFarq: Math.abs(ship.ortacha - pol.ortacha),
    };
  });
}

function dasturiyRenderer(renderer) {
  return /swiftshader|llvmpipe|softpipe|software rasterizer|software renderer/i.test(
    renderer || "",
  );
}

function serverniTekshir() {
  return new Promise((resolve, reject) => {
    const url = new URL("/laboratoriya/3d/olcham", ASOS);
    const transport = url.protocol === "https:" ? https : http;
    const req = transport.get(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || (url.protocol === "https:" ? 443 : 80),
        path: url.pathname,
        timeout: 120000,
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

async function chromiumniOch(chromium) {
  const webglArgs = [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--enable-unsafe-swiftshader",
  ];

  try {
    return await chromium.launch({ headless: true, args: webglArgs });
  } catch (birinchi) {
    // Playwright o'z Chromiumini cdn.playwright.dev dan oladi — ba'zi
    // tarmoqlarda u yopiq. @sparticuz/chromium npm orqali keladi va
    // WebGL uchun SwiftShader ni o'zi chiqaradi.
    try {
      const lambdaMod = await import("@sparticuz/chromium");
      const lambda = lambdaMod.default;
      lambda.setGraphicsMode = true;
      // al2023.lib nspr/nss — playwright CDN ishlamasa, shu paketning
      // o'z kutubxonalari kerak (Debian da libnspr4 bo'lmasligi mumkin).
      const binDir = path.join(
        __dirname,
        "..",
        "node_modules",
        "@sparticuz",
        "chromium",
        "bin",
      );
      if (lambdaMod.inflate) {
        await lambdaMod.inflate(path.join(binDir, "al2023.tar.br"));
      }
      const libDir = path.join(require("os").tmpdir(), "al2023", "lib");
      process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
        ? `${libDir}:${process.env.LD_LIBRARY_PATH}`
        : libDir;
      return await chromium.launch({
        headless: true,
        executablePath: await lambda.executablePath(),
        args: [...lambda.args, ...webglArgs],
      });
    } catch (ikkinchi) {
      throw new Error(
        "Chromium ochilmadi.\n" +
          "  1) npx playwright install chromium\n" +
          "  2) yoki npm i -D @sparticuz/chromium\n" +
          birinchi.message +
          "\n" +
          ikkinchi.message,
      );
    }
  }
}

function rasmniSaqlash(dataUrl, fayl) {
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/png;base64,")) {
    throw new Error(`${path.basename(fayl)} uchun PNG ma'lumoti yo'q`);
  }
  fs.writeFileSync(
    fayl,
    Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64"),
  );
}

function natijaniTekshir(natija, mavzu, nuqta) {
  const kerak = [
    "kuygan",
    "qora",
    "ortacha",
    "p50",
    "p95",
    "yuqoriSoha",
    "quyiSoha",
    "fps",
    "uchburchak",
    "chaqiruv",
    "teksturaXotira",
    "renderer",
    "sifat",
    "chiroqSoni",
  ];
  if (nuqta === "sweep") {
    kerak.push("sweepEngYomon", "sweepJoy", "sweepUrug", "sweepNamunaSoni");
  }
  for (const maydon of kerak) {
    if (natija[maydon] === undefined || natija[maydon] === null) {
      throw new Error(`${mavzu}/${nuqta}: "${maydon}" yo'q`);
    }
  }
  if (natija.sifat !== sifat) {
    throw new Error(`${mavzu}/${nuqta}: sifat=${natija.sifat}, ${sifat} kutilgan`);
  }
  if (!Number.isInteger(natija.chiroqSoni) || natija.chiroqSoni < 0) {
    throw new Error(`${mavzu}/${nuqta}: chiroqSoni yaroqsiz`);
  }
}

async function asosiy() {
  let holat;
  try {
    holat = await serverniTekshir();
  } catch (err) {
    throw new Error(
      `dev server ${ASOS} da ishlamayapti (${err.message}).\n` +
        "Avval boshqa terminalda `npm run dev` ni ishga tushiring, keyin `npm run lab3d:olcham`.",
    );
  }

  if (holat === 404) {
    throw new Error(
      "/laboratoriya/3d/olcham 404 qaytardi.\n" +
        "Bu marshrut faqat `next dev` da ochiladi. `npm start` (production) da ataylab 404.",
    );
  }
  if (holat < 200 || holat >= 400) {
    throw new Error(`/laboratoriya/3d/olcham HTTP ${holat} qaytardi`);
  }

  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch {
    throw new Error("playwright o'rnatilmagan. `npm install` qiling (devDependencies).");
  }

  fs.mkdirSync(CHIQISH_DIR, { recursive: true });
  const browser = await chromiumniOch(chromium);
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
  let mavzular = [];
  let nuqtalar = [];
  let page;

  const sahifaniOch = async (mavzu) => {
    const url = new URL("/laboratoriya/3d/olcham", ASOS);
    url.searchParams.set("sifat", sifat);
    url.searchParams.set("nuqta", "stol");
    if (mavzu) url.searchParams.set("mavzu", mavzu);
    const javob = await page.goto(url.toString(), {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    if (!javob || !javob.ok()) {
      throw new Error(`${url} → HTTP ${javob ? javob.status() : "yo'q"}`);
    }
    await page.waitForFunction(
      () => typeof window.__olcham === "function"
        && typeof window.__supurish === "function"
        && !!window.__olchamSozlama,
      { timeout: 90000 },
    );
  };

  try {
    page = await context.newPage();
    process.stderr.write(`→ sozlama yuklanmoqda (sifat=${sifat})\n`);
    await sahifaniOch();
    const birinchiSozlama = await page.evaluate(() => window.__olchamSozlama);
    mavzular = birinchiSozlama.mavzular;
    nuqtalar = birinchiSozlama.nuqtalar;

    if (!Array.isArray(mavzular) || !Array.isArray(nuqtalar)) {
      throw new Error("O'lchagich mavzu yoki nuqta ro'yxatini bermadi");
    }
    const kutilgan = mavzular.length * (nuqtalar.length + 1);
    if (kutilgan !== KUTILGAN_QATOR) {
      throw new Error(
        `Nuqta sozlamasi ${kutilgan} qator beradi, ${KUTILGAN_QATOR} bo'lishi shart`,
      );
    }

    for (let mavzuIndeks = 0; mavzuIndeks < mavzular.length; mavzuIndeks += 1) {
      const mavzu = mavzular[mavzuIndeks];
      if (mavzuIndeks > 0 || birinchiSozlama.joriyMavzu !== mavzu) {
        process.stderr.write(`→ ${mavzu} yuklanmoqda (sifat=${sifat})\n`);
        await sahifaniOch(mavzu);
      } else {
        process.stderr.write(`→ ${mavzu} tayyor (sifat=${sifat})\n`);
      }

      for (const nuqta of nuqtalar) {
        process.stderr.write(`  ${mavzu}/${nuqta} ...\n`);
        const natija = await page.evaluate(
          (nom) => window.__olcham({ nuqta: nom, rasm: true }),
          nuqta,
        );
        const rasm = natija.rasm;
        delete natija.rasm;
        natijaniTekshir(natija, mavzu, nuqta);
        olchovlar.push(natija);
        rasmniSaqlash(rasm, path.join(CHIQISH_DIR, `${mavzu}-${nuqta}.png`));
      }

      process.stderr.write(`  ${mavzu}/sweep ...\n`);
      const sweepNatija = await page.evaluate(
        (xomUrug) => window.__supurish({ urug: xomUrug }),
        urug,
      );
      const sweepRasm = sweepNatija.rasm;
      delete sweepNatija.rasm;
      natijaniTekshir(sweepNatija, mavzu, "sweep");
      olchovlar.push(sweepNatija);
      rasmniSaqlash(
        sweepRasm,
        path.join(CHIQISH_DIR, `${mavzu}-sweep-worst.png`),
      );
    }
  } finally {
    if (page) await page.close();
    await browser.close();
  }

  if (olchovlar.length !== KUTILGAN_QATOR) {
    throw new Error(
      `${olchovlar.length} o'lchov chiqdi, ${KUTILGAN_QATOR} bo'lishi shart`,
    );
  }

  const jadval = olchovlar.map(qatorniJadvalga);
  const chiqib = [];
  for (const q of olchovlar) {
    const sabab = chegaradanChiqdimi(q);
    if (sabab.length) chiqib.push({ mavzu: q.mavzu, nuqta: q.nuqta, sabab });
  }
  const shipPolFarq = shipPolFarqlariniHisobla(olchovlar, mavzular);
  const shipPolChiqib = shipPolFarq.filter((q) => q.shipPolFarq >= SHIP_POL_FARQ_MAKS);
  const dasturiy = olchovlar.some((q) => dasturiyRenderer(q.renderer));
  const xulosa = {
    jami: olchovlar.length,
    chiqibKetgan: chiqib.length,
    qatorlar: chiqib,
    shipPolFarq,
    shipPolChegaradanChiqdi: shipPolChiqib.length,
    dasturiyRenderer: dasturiy,
  };

  if (jsonRejim) {
    console.log(
      JSON.stringify(
        {
          sozlama: {
            sifat,
            urug: olchovlar.find((q) => q.nuqta === "sweep")?.sweepUrug,
          },
          olchovlar,
          xulosa,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.table(jadval);
  if (dasturiy) {
    console.warn("OGOHLANTIRISH: FPS raqamlari dasturiy renderdan — haqiqiy GPU emas.");
  }

  const farqMatni = shipPolFarq
    .map((q) => `${q.mavzu}=${yaxlit(q.shipPolFarq, 4)}`)
    .join(", ");
  if (chiqib.length === 0 && shipPolChiqib.length === 0) {
    console.log(
      `XULOSA: ${KUTILGAN_QATOR}/${KUTILGAN_QATOR} o'lchov chegarada; shipPolFarq: ${farqMatni}.`,
    );
  } else {
    console.log(
      `XULOSA: ${chiqib.length}/${KUTILGAN_QATOR} qator va ` +
        `${shipPolChiqib.length}/${mavzular.length} shipPolFarq chegaradan chiqdi; ` +
        `shipPolFarq: ${farqMatni}.`,
    );
    for (const q of chiqib) {
      console.log(`  ${q.mavzu}/${q.nuqta}  ${q.sabab.join("; ")}`);
    }
    for (const q of shipPolChiqib) {
      console.log(
        `  ${q.mavzu}/ship-pol  farq=${yaxlit(q.shipPolFarq, 4)} (≥${SHIP_POL_FARQ_MAKS})`,
      );
    }
  }
}

asosiy().catch((err) => {
  console.error("XATO:", err.message);
  process.exit(1);
});
