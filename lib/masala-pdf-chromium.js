import fs from "node:fs/promises";
import path from "node:path";
import { chromium as playwrightChromium } from "playwright-core";
import { masalaPdfHtmlYarat, MASALA_PDF_USLUBI } from "./masala-pdf-html.js";

const BRAUZER_KALITI = "__jdaMasalaPdfBrauzeri";
let resursCssVaShriftlar;
let serverlessChromiumVaadasi;

function serverlessChromiumniOl() {
  if (!serverlessChromiumVaadasi) {
    // Chromium 149 faqat ESM. Native import uni eski CommonJS require'ga
    // aylantirmaydi va Vercel function ishga tushishida ERR_REQUIRE_ESM bermaydi.
    serverlessChromiumVaadasi = import("@sparticuz/chromium")
      .then((modul) => modul.default || modul);
  }
  return serverlessChromiumVaadasi;
}

async function faylBormi(manzil) {
  if (!manzil) return false;
  try {
    await fs.access(manzil);
    return true;
  } catch {
    return false;
  }
}

function htmlHimoya(qiymat) {
  return String(qiymat ?? "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function shriftDataUrl(manzil, mime) {
  const baytlar = await fs.readFile(manzil);
  return `data:${mime};base64,${baytlar.toString("base64")}`;
}

async function resursCssiniOl() {
  if (resursCssVaShriftlar) return resursCssVaShriftlar;
  resursCssVaShriftlar = (async () => {
    const katexPapka = path.join(process.cwd(), "node_modules", "katex", "dist");
    let katexCss = await fs.readFile(path.join(katexPapka, "katex.min.css"), "utf8");
    const woff2Fayllar = [...katexCss.matchAll(/fonts\/[A-Za-z0-9_-]+\.woff2/g)]
      .map((moslik) => moslik[0]);

    for (const nisbiyManzil of new Set(woff2Fayllar)) {
      const dataUrl = await shriftDataUrl(path.join(katexPapka, nisbiyManzil), "font/woff2");
      katexCss = katexCss.replaceAll(nisbiyManzil, dataUrl);
    }

    const [oddiy, qalin] = await Promise.all([
      shriftDataUrl(path.join(process.cwd(), "public", "fonts", "DejaVuSans.ttf"), "font/ttf"),
      shriftDataUrl(path.join(process.cwd(), "public", "fonts", "DejaVuSans-Bold.ttf"), "font/ttf"),
    ]);
    const jdaShriftCss = `
      @font-face { font-family: "JDA Sans"; src: url("${oddiy}") format("truetype"); font-style: normal; font-weight: 400; }
      @font-face { font-family: "JDA Sans"; src: url("${qalin}") format("truetype"); font-style: normal; font-weight: 600 900; }
    `;

    return `${jdaShriftCss}\n${katexCss}`;
  })();
  return resursCssVaShriftlar;
}

async function mahalliyChromiumYoli() {
  const nomzodlar = [
    process.env.PDF_CHROMIUM_PATH,
    ...(process.platform === "win32" ? [
      path.join(process.env.PROGRAMFILES || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
      path.join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      path.join(process.env.PROGRAMFILES || "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
    ] : []),
    ...(process.platform === "darwin" ? [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ] : []),
    playwrightChromium.executablePath(),
  ].filter(Boolean);

  for (const nomzod of nomzodlar) {
    if (await faylBormi(nomzod)) return nomzod;
  }
  return null;
}

async function brauzerniOch() {
  const mahalliyYol = await mahalliyChromiumYoli();
  if (mahalliyYol) {
    return playwrightChromium.launch({
      executablePath: mahalliyYol,
      headless: true,
      args: ["--font-render-hinting=none", "--disable-dev-shm-usage"],
    });
  }

  const serverlessChromium = await serverlessChromiumniOl();
  const executablePath = await serverlessChromium.executablePath();
  return playwrightChromium.launch({
    executablePath,
    headless: true,
    args: serverlessChromium.args,
  });
}

async function brauzerniOl() {
  const mavjud = globalThis[BRAUZER_KALITI];
  if (mavjud) {
    const brauzer = await mavjud.catch(() => null);
    if (brauzer?.isConnected()) return brauzer;
  }

  const yangi = brauzerniOch();
  globalThis[BRAUZER_KALITI] = yangi;
  try {
    return await yangi;
  } catch (xato) {
    delete globalThis[BRAUZER_KALITI];
    throw xato;
  }
}

async function hujjatHtmlYarat(sozlamalar) {
  const resursCss = await resursCssiniOl();
  const sarlavha = htmlHimoya(
    String(sozlamalar.masalaMatni || sozlamalar.natija?.masalaMatni || "Kimyoviy masala")
      .replace(/\s+/g, " ")
      .slice(0, 90),
  );

  return `<!doctype html>
    <html lang="uz">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="JDA KIMYO" />
        <title>JDA Kimyo AI - ${sarlavha}</title>
        <style>${resursCss}\n${MASALA_PDF_USLUBI}</style>
      </head>
      <body>${masalaPdfHtmlYarat(sozlamalar)}</body>
    </html>`;
}

/** Chromium matn, SVG va KaTeX gliflarini PDF ichida vektor sifatida saqlaydi. */
export async function masalaPdfChromiumdaYarat(sozlamalar = {}) {
  const brauzer = await brauzerniOl();
  const sahifa = await brauzer.newPage({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 1,
  });

  try {
    await sahifa.setContent(await hujjatHtmlYarat(sozlamalar), { waitUntil: "load" });
    await sahifa.emulateMedia({ media: "print" });
    await sahifa.evaluate(() => document.fonts.ready.then(() => true));

    await sahifa.evaluate(() => {
      for (const formula of document.querySelectorAll(".pdf-tenglama")) {
        const katex = formula.querySelector(".katex");
        if (!katex) continue;
        const mavjudKenglik = Math.max(120, formula.clientWidth - 76);
        const kerakliKenglik = katex.getBoundingClientRect().width;
        if (kerakliKenglik <= mavjudKenglik) continue;

        // Murakkab formula satrlarga bo'lingandan keyin ham salgina oshsa,
        // faqat kichik optik moslashuv qilinadi; oddiy matnga aylantirilmaydi.
        const nisbat = Math.max(0.78, (mavjudKenglik / kerakliKenglik) * 0.98);
        katex.style.fontSize = `${nisbat}em`;
      }
    });

    const pdf = await sahifa.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      tagged: true,
      outline: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width:100%;margin:0 14mm;color:#64748b;font-family:Arial,sans-serif;font-size:8px;display:flex;justify-content:space-between;border-top:1px solid #dbe2ea;padding-top:5px;">
          <span>JDA KIMYO AI - jdakimyo.uz</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
      margin: {
        top: "12mm",
        right: "14mm",
        bottom: "18mm",
        left: "14mm",
      },
    });
    return new Uint8Array(pdf);
  } finally {
    await sahifa.close();
  }
}

export async function pdfChromiumniYop() {
  const mavjud = globalThis[BRAUZER_KALITI];
  delete globalThis[BRAUZER_KALITI];
  if (!mavjud) return;
  const brauzer = await mavjud.catch(() => null);
  if (brauzer?.isConnected()) await brauzer.close();
}
