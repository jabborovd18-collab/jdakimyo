/**
 * 3D laboratoriya grafikasini RAQAM bilan o'lchaydi.
 *
 * Ishga tushirish:
 *   npm run dev                              # boshqa terminalda
 *   npm run lab3d:olcham                     # desktop, 5 qator
 *   LAB3D_PROFIL=telefon npm run lab3d:olcham
 *   LAB3D_SIFAT=arzon npm run lab3d:olcham   # eski alias
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
const KUTILGAN_QATOR = 5;
const PROFIL_NOMLARI = ["telefon", "desktop", "ilova"];
const SIFAT_ALIASES = { arzon: "telefon", toliq: "desktop" };

const profilXom = process.env.LAB3D_PROFIL || "";
const sifatXom = process.env.LAB3D_SIFAT || "";
if (profilXom && !PROFIL_NOMLARI.includes(profilXom)) {
  console.error(`XATO: LAB3D_PROFIL faqat ${PROFIL_NOMLARI.join(", ")} bo'lishi mumkin`);
  process.exit(1);
}
if (sifatXom && !SIFAT_ALIASES[sifatXom]) {
  console.error("XATO: LAB3D_SIFAT faqat toliq yoki arzon bo'lishi mumkin");
  process.exit(1);
}

// Yangi aniq profil eski aliasdan ustun. Qarama-qarshi ikkalasi birga
// berilsa ham natija yashirin bo'lmasligi uchun stderr'da aytiladi.
const profil = profilXom || SIFAT_ALIASES[sifatXom] || "desktop";
const profilManbasi = profilXom
  ? "LAB3D_PROFIL"
  : sifatXom
    ? "LAB3D_SIFAT"
    : "sukut";
if (profilXom && sifatXom && SIFAT_ALIASES[sifatXom] !== profilXom) {
  process.stderr.write(
    `OGOHLANTIRISH: LAB3D_PROFIL=${profilXom} eski LAB3D_SIFAT=${sifatXom} aliasidan ustun.\n`,
  );
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
    profil: q.profil,
    nuqta: q.nuqta,
    qarashRejimi: q.qarashRejimi,
    yawJami: yaxlit(q.yawJami, 4),
    kuygan: yaxlit(q.kuygan, 2),
    qora: yaxlit(q.qora, 2),
    ortacha: yaxlit(q.ortacha, 4),
    p50: yaxlit(q.p50, 4),
    p95: yaxlit(q.p95, 4),
    yuqoriSoha: yaxlit(q.yuqoriSoha, 4),
    quyiSoha: yaxlit(q.quyiSoha, 4),
    fps: yaxlit(q.fps, 1),
    chiroqSoni: q.chiroqSoni,
    chiroqBudjeti: q.chiroqBudjeti,
    chiroqBudjetiBuzildi: q.chiroqBudjetiBuzildi,
    yorliqSoni: q.yorliqSoni,
    yorliqToqnashuvi: q.yorliqToqnashuvi,
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
  if (q.yorliqToqnashuvi > 0) {
    sabab.push(`yorliqToqnashuvi=${q.yorliqToqnashuvi} (>0)`);
  }
  return sabab;
}

function shipPolFarqniHisobla(olchovlar) {
  const ship = olchovlar.find((q) => q.nuqta === "ship");
  const pol = olchovlar.find((q) => q.nuqta === "pol");
  if (!ship || !pol) throw new Error("ship yoki pol o'lchovi yo'q");
  return Math.abs(ship.ortacha - pol.ortacha);
}

function dasturiyRenderer(renderer) {
  return /swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer|software renderer/i.test(
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
    // Playwright Chromium CDN'i yopiq muhitda npm orqali kelgan zaxira
    // brauzer ishlatiladi; SwiftShader WebGL o'lchovini saqlab qoladi.
    try {
      const lambdaMod = await import("@sparticuz/chromium");
      const lambda = lambdaMod.default;
      lambda.setGraphicsMode = true;
      // Paketning nspr/nss kutubxonalari tizimda bo'lmasligi mumkin.
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

function natijaniTekshir(natija, nuqta) {
  const kerak = [
    "profil",
    "qarashRejimi",
    "yawJami",
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
    "chiroqSoni",
    "chiroqBudjeti",
    "chiroqBudjetiBuzildi",
    "yorliqSoni",
    "yorliqToqnashuvi",
  ];
  if (nuqta === "sweep") {
    kerak.push("sweepEngYomon", "sweepJoy", "sweepUrug", "sweepNamunaSoni");
  }
  for (const maydon of kerak) {
    if (natija[maydon] === undefined || natija[maydon] === null) {
      throw new Error(`${profil}/${nuqta}: "${maydon}" yo'q`);
    }
  }
  if (natija.profil !== profil) {
    throw new Error(`${profil}/${nuqta}: profil=${natija.profil}`);
  }
  if (!["pointerlock", "zaxira"].includes(natija.qarashRejimi)) {
    throw new Error(`${profil}/${nuqta}: qarashRejimi=${natija.qarashRejimi}`);
  }
  if (!Number.isFinite(natija.yawJami)) {
    throw new Error(`${profil}/${nuqta}: yawJami yaroqsiz`);
  }
  if (!Number.isInteger(natija.chiroqSoni) || natija.chiroqSoni < 0) {
    throw new Error(`${profil}/${nuqta}: chiroqSoni yaroqsiz`);
  }
  if (!Number.isInteger(natija.chiroqBudjeti) || natija.chiroqBudjeti < 0) {
    throw new Error(`${profil}/${nuqta}: chiroqBudjeti yaroqsiz`);
  }
  if (natija.chiroqBudjetiBuzildi !== (natija.chiroqSoni > natija.chiroqBudjeti)) {
    throw new Error(`${profil}/${nuqta}: chiroqBudjetiBuzildi noto'g'ri`);
  }
  if (!Number.isInteger(natija.yorliqSoni) || natija.yorliqSoni < 0) {
    throw new Error(`${profil}/${nuqta}: yorliqSoni yaroqsiz`);
  }
  if (!Number.isInteger(natija.yorliqToqnashuvi) || natija.yorliqToqnashuvi < 0) {
    throw new Error(`${profil}/${nuqta}: yorliqToqnashuvi yaroqsiz`);
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
  let page;
  try {
    page = await context.newPage();
    const url = new URL("/laboratoriya/3d/olcham", ASOS);
    url.searchParams.set("profil", profil);
    url.searchParams.set("nuqta", "stol");
    process.stderr.write(`→ ${profil} yuklanmoqda (${profilManbasi})\n`);
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

    const sahifaSozlamasi = await page.evaluate(() => window.__olchamSozlama);
    if (!sahifaSozlamasi.profillar.includes(profil)) {
      throw new Error(`${profil}: sahifa bu profilni bilmaydi`);
    }
    if (sahifaSozlamasi.joriyProfil !== profil) {
      throw new Error(`Sahifa ${sahifaSozlamasi.joriyProfil} profilini ochdi, ${profil} kutilgan`);
    }
    const nuqtalar = sahifaSozlamasi.nuqtalar;
    if (!Array.isArray(nuqtalar) || nuqtalar.length + 1 !== KUTILGAN_QATOR) {
      throw new Error(`Nuqta sozlamasi ${nuqtalar?.length ?? 0} nomli nuqta berdi`);
    }

    for (const nuqta of nuqtalar) {
      process.stderr.write(`  ${profil}/${nuqta} ...\n`);
      const natija = await page.evaluate(
        (nom) => window.__olcham({ nuqta: nom, rasm: true }),
        nuqta,
      );
      const rasm = natija.rasm;
      delete natija.rasm;
      natijaniTekshir(natija, nuqta);
      olchovlar.push(natija);
      rasmniSaqlash(rasm, path.join(CHIQISH_DIR, `${profil}-${nuqta}.png`));
    }

    process.stderr.write(`  ${profil}/sweep ...\n`);
    const sweepNatija = await page.evaluate(
      (xomUrug) => window.__supurish({ urug: xomUrug }),
      urug,
    );
    const sweepRasm = sweepNatija.rasm;
    delete sweepNatija.rasm;
    natijaniTekshir(sweepNatija, "sweep");
    olchovlar.push(sweepNatija);
    rasmniSaqlash(
      sweepRasm,
      path.join(CHIQISH_DIR, `${profil}-sweep-worst.png`),
    );
  } finally {
    if (page) await page.close();
    await browser.close();
  }

  if (olchovlar.length !== KUTILGAN_QATOR) {
    throw new Error(`${olchovlar.length} o'lchov chiqdi, ${KUTILGAN_QATOR} bo'lishi shart`);
  }

  const jadval = olchovlar.map(qatorniJadvalga);
  const chiqib = [];
  for (const q of olchovlar) {
    const sabab = chegaradanChiqdimi(q);
    if (sabab.length) chiqib.push({ profil: q.profil, nuqta: q.nuqta, sabab });
  }
  const shipPolFarq = shipPolFarqniHisobla(olchovlar);
  const shipPolChiqib = shipPolFarq >= SHIP_POL_FARQ_MAKS;
  const budjetBuzilgan = olchovlar.filter((q) => q.chiroqBudjetiBuzildi);
  const dasturiy = olchovlar.some((q) => dasturiyRenderer(q.renderer));
  const xulosa = {
    jami: olchovlar.length,
    chiqibKetgan: chiqib.length,
    qatorlar: chiqib,
    shipPolFarq,
    shipPolChegaradanChiqdi: shipPolChiqib,
    chiroqBudjetiBuzilganQatorlar: budjetBuzilgan.length,
    dasturiyRenderer: dasturiy,
  };

  if (jsonRejim) {
    console.log(
      JSON.stringify(
        {
          sozlama: {
            profil,
            profilManbasi,
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

  console.log(
    `XULOSA: ${chiqib.length}/${KUTILGAN_QATOR} qator` +
      `${shipPolChiqib ? " va shipPolFarq" : ""} chegaradan chiqdi; ` +
      `shipPolFarq=${yaxlit(shipPolFarq, 4)}; ` +
      `chiroqBudjetiBuzildi=${budjetBuzilgan.length}/${KUTILGAN_QATOR}.`,
  );
  for (const q of chiqib) {
    console.log(`  ${q.profil}/${q.nuqta}  ${q.sabab.join("; ")}`);
  }
  if (shipPolChiqib) {
    console.log(`  ${profil}/ship-pol  farq=${yaxlit(shipPolFarq, 4)} (≥${SHIP_POL_FARQ_MAKS})`);
  }
}

asosiy().catch((err) => {
  console.error("XATO:", err.message);
  process.exit(1);
});
