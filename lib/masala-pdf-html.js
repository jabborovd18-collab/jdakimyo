// PDF uchun HTML va KaTeX bayonnomasini bitta joyda yasaydi.
// Nega HTML: formulani regex bilan oddiy matnga aylantirish ichma-ich kasrlar,
// indekslar va uzun tenglamalarni buzardi; KaTeX esa ekrandagi ifodani saqlaydi.

import katex from "katex";
import "katex/contrib/mhchem";
import { pdfVizualniTayyorla } from "./masala-pdf-vizual.js";
import { orbitalSvgYarat } from "./masala-pdf-orbital.js";

function htmlHimoya(qiymat) {
  return String(qiymat ?? "")
    .replace(/[‐‑‒–—]/g, "-")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function latexQobiginiOl(matn) {
  return String(matn ?? "")
    .trim()
    .replace(/^\$\$([\s\S]*)\$\$$/, "$1")
    .replace(/^\$([\s\S]*)\$$/, "$1")
    .replace(/^\\\[([\s\S]*)\\\]$/, "$1")
    .replace(/^\\\(([\s\S]*)\\\)$/, "$1")
    .trim();
}

function textIchidagiBelgilarniTuzat(matn) {
  return matn.replace(/\\text\s*\{([^{}]*)\}/g, (_, ichki) => (
    `\\text{${ichki
      .replace(/\\cdot/g, "·")
      .replace(/\\times/g, "×")
      .replace(/\\approx/g, "≈")
      .replace(/\\%/g, "%")}}`
  ));
}

function yuqoriDarajadagiOperatorlar(latex, operatorlar) {
  const natija = [];
  let qavs = 0;
  for (let indeks = 0; indeks < latex.length; indeks += 1) {
    const belgi = latex[indeks];
    if (belgi === "{" && latex[indeks - 1] !== "\\") qavs += 1;
    if (belgi === "}" && latex[indeks - 1] !== "\\") qavs = Math.max(0, qavs - 1);
    if (qavs !== 0) continue;

    const operator = operatorlar.find((nomzod) => latex.startsWith(nomzod, indeks));
    if (!operator) continue;
    if ((operator === "+" || operator === "-") && indeks === 0) continue;
    natija.push({ indeks, operator });
    indeks += operator.length - 1;
  }
  return natija;
}

function yigindiniQatorlargaBol(latex, maqsadUzunligi = 54) {
  const joylar = yuqoriDarajadagiOperatorlar(latex, ["+", "-"]);
  if (joylar.length < 2) return [latex];

  const bolaklar = [];
  let boshlanish = 0;
  for (const joy of joylar) {
    bolaklar.push(latex.slice(boshlanish, joy.indeks).trim());
    boshlanish = joy.indeks;
  }
  bolaklar.push(latex.slice(boshlanish).trim());

  const qatorlar = [];
  let joriy = "";
  for (const bolak of bolaklar.filter(Boolean)) {
    const sinov = joriy ? `${joriy} ${bolak}` : bolak;
    if (joriy && sinov.length > maqsadUzunligi) {
      qatorlar.push(joriy);
      joriy = bolak;
    } else {
      joriy = sinov;
    }
  }
  if (joriy) qatorlar.push(joriy);
  return qatorlar;
}

function uzunFormulaniTayyorla(latex) {
  if (
    latex.length < 86
    || /\\begin\{(?:aligned|alignedat|array|cases|matrix|pmatrix|bmatrix|vmatrix|gathered|split)\}/.test(latex)
    || latex.includes("\\\\")
    || latex.includes("\\ce{")
  ) {
    return latex;
  }

  const munosabatlar = yuqoriDarajadagiOperatorlar(latex, [
    "\\Longleftrightarrow",
    "\\Longrightarrow",
    "\\Rightarrow",
    "\\leftrightarrow",
    "\\rightarrow",
    "\\approx",
    "\\equiv",
    "=",
  ]);
  if (munosabatlar.length > 0) {
    const birinchi = munosabatlar[0];
    const chap = latex.slice(0, birinchi.indeks).trim();
    const ong = latex.slice(birinchi.indeks + birinchi.operator.length).trim();
    const ongQatorlari = yigindiniQatorlargaBol(ong);
    if (chap && ong && (ongQatorlari.length > 1 || chap.length > 34 || ong.length > 62)) {
      const qatorlar = [
        `${chap} &${birinchi.operator} ${ongQatorlari[0]}`,
        ...ongQatorlari.slice(1).map((qator) => `&\\quad ${qator}`),
      ];
      return `\\begin{aligned}${qatorlar.join("\\\\") }\\end{aligned}`;
    }
  }

  const qatorlar = yigindiniQatorlargaBol(latex);
  if (qatorlar.length < 2) return latex;
  return `\\begin{aligned}${qatorlar.map((qator) => `&${qator}`).join("\\\\")}\\end{aligned}`;
}

function formulaHtml(formula, displayMode = true) {
  const toza = textIchidagiBelgilarniTuzat(latexQobiginiOl(formula)).slice(0, 6000);
  if (!toza) return "";
  try {
    const html = katex.renderToString(displayMode ? uzunFormulaniTayyorla(toza) : toza, {
      displayMode,
      throwOnError: true,
      strict: "ignore",
      trust: false,
      output: "htmlAndMathml",
      maxExpand: 1000,
      maxSize: 15,
    });
    const teg = displayMode ? "div" : "span";
    const sinf = displayMode ? "pdf-render-formula pdf-tenglama" : "pdf-render-formula";
    return `<${teg} class="${sinf}" data-latex="${htmlHimoya(toza)}">${html}</${teg}>`;
  } catch {
    return `<code class="pdf-xom-formula">${htmlHimoya(toza)}</code>`;
  }
}

function xomInlineLatexniBoyit(matn) {
  const qiymat = String(matn ?? "");
  const andoza = /([A-Za-z][A-Za-z0-9]*(?:(?:_|\^)(?:\{[^{}\s]+\}|[A-Za-z0-9+\-]+))+)/g;
  let html = "";
  let boshlanish = 0;
  for (const moslik of qiymat.matchAll(andoza)) {
    html += htmlHimoya(qiymat.slice(boshlanish, moslik.index));
    html += formulaHtml(moslik[0], false);
    boshlanish = moslik.index + moslik[0].length;
  }
  html += htmlHimoya(qiymat.slice(boshlanish));
  return html;
}

function boyitilganMatnHtml(matn) {
  const qiymat = String(matn ?? "").slice(0, 20_000);
  if (!qiymat) return "";

  const bolaklar = qiymat.split(/(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)|\$[^$\n]+\$)/g);
  return bolaklar.map((bolak) => {
    if (
      (bolak.startsWith("$$") && bolak.endsWith("$$"))
      || (bolak.startsWith("\\[") && bolak.endsWith("\\]"))
    ) {
      return `<div class="pdf-formula">${formulaHtml(bolak, true)}</div>`;
    }
    if (
      (bolak.startsWith("$") && bolak.endsWith("$"))
      || (bolak.startsWith("\\(") && bolak.endsWith("\\)"))
    ) {
      return formulaHtml(bolak, false);
    }
    return xomInlineLatexniBoyit(bolak).replace(/\n/g, "<br />");
  }).join("");
}

function jadvalQatori(chap, ong) {
  return `<tr><td>${boyitilganMatnHtml(chap)}</td><td>${boyitilganMatnHtml(ong)}</td></tr>`;
}

function sonniYoz(qiymat) {
  return Number(qiymat).toLocaleString("uz-UZ", {
    maximumFractionDigits: Math.abs(Number(qiymat)) < 0.1 ? 3 : 2,
  });
}

function grafikSvg(grafik) {
  const width = 660;
  const height = 250;
  const chap = 58;
  const ong = 18;
  const yuqori = 22;
  const past = 58;
  const plotW = width - chap - ong;
  const plotH = height - yuqori - past;
  const qiymatlar = grafik.nuqtalar.map((nuqta) => nuqta.qiymat);
  let min = Math.min(0, ...qiymatlar);
  let max = Math.max(0, ...qiymatlar);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const oraliq = max - min;
  const y = (qiymat) => yuqori + ((max - qiymat) / oraliq) * plotH;
  const nolY = y(0);
  const x = (indeks) => chap + ((indeks + 0.5) / grafik.nuqtalar.length) * plotW;
  const grid = Array.from({ length: 5 }, (_, indeks) => {
    const qiymat = max - (oraliq * indeks) / 4;
    const yJoy = y(qiymat);
    return `<line x1="${chap}" y1="${yJoy}" x2="${width - ong}" y2="${yJoy}" class="pdf-grid" />
      <text x="${chap - 8}" y="${yJoy + 4}" text-anchor="end" class="pdf-grafik-belgi">${htmlHimoya(sonniYoz(qiymat))}</text>`;
  }).join("");
  const xBelgilar = grafik.nuqtalar.map((nuqta, indeks) => (
    `<text x="${x(indeks)}" y="${height - 34}" text-anchor="middle" class="pdf-grafik-belgi">${htmlHimoya(nuqta.nom.slice(0, 15))}</text>`
  )).join("");

  let shakllar;
  if (grafik.turi === "chiziqli") {
    const nuqtalar = grafik.nuqtalar.map((nuqta, indeks) => `${x(indeks)},${y(nuqta.qiymat)}`).join(" ");
    shakllar = `<polyline points="${nuqtalar}" class="pdf-chiziq" />${grafik.nuqtalar.map((nuqta, indeks) => `
      <circle cx="${x(indeks)}" cy="${y(nuqta.qiymat)}" r="5" class="pdf-nuqta" />
      <text x="${x(indeks)}" y="${y(nuqta.qiymat) - 10}" text-anchor="middle" class="pdf-grafik-qiymat">${htmlHimoya(sonniYoz(nuqta.qiymat))}</text>`).join("")}`;
  } else {
    const katakW = plotW / grafik.nuqtalar.length;
    const ustunW = Math.min(54, katakW * 0.58);
    shakllar = grafik.nuqtalar.map((nuqta, indeks) => {
      const qiymatY = y(nuqta.qiymat);
      const tepa = Math.min(qiymatY, nolY);
      const balandlik = Math.max(2, Math.abs(qiymatY - nolY));
      const yozuvY = nuqta.qiymat >= 0 ? tepa - 8 : tepa + balandlik + 13;
      return `<rect x="${x(indeks) - ustunW / 2}" y="${tepa}" width="${ustunW}" height="${balandlik}" rx="4" class="pdf-ustun" />
        <text x="${x(indeks)}" y="${yozuvY}" text-anchor="middle" class="pdf-grafik-qiymat">${htmlHimoya(sonniYoz(nuqta.qiymat))}</text>`;
    }).join("");
  }

  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${htmlHimoya(grafik.sarlavha)}">
    ${grid}
    <line x1="${chap}" y1="${nolY}" x2="${width - ong}" y2="${nolY}" class="pdf-oq" />
    ${shakllar}
    ${xBelgilar}
    ${grafik.xNomi ? `<text x="${chap + plotW / 2}" y="${height - 8}" text-anchor="middle" class="pdf-grafik-oq">${htmlHimoya(grafik.xNomi)}</text>` : ""}
    ${grafik.yNomi ? `<text x="14" y="${yuqori + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${yuqori + plotH / 2})" class="pdf-grafik-oq">${htmlHimoya(grafik.yNomi)}</text>` : ""}
  </svg>`;
}

function vizualJadvalHtml(jadval) {
  return `<div class="pdf-jadval">
    <h3>${htmlHimoya(jadval.sarlavha)}</h3>
    <table>
      <thead><tr>${jadval.ustunlar.map((ustun) => `<th>${boyitilganMatnHtml(ustun)}</th>`).join("")}</tr></thead>
      <tbody>${jadval.qatorlar.map((qator) => `<tr>${qator.map((katak) => `<td>${boyitilganMatnHtml(katak)}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  </div>`;
}

function vizualGrafikHtml(grafik) {
  return `<figure class="pdf-grafik">
    <h3>${htmlHimoya(grafik.sarlavha)}</h3>
    ${grafikSvg(grafik)}
  </figure>`;
}

function vizualOrbitalHtml(orbital) {
  return orbitalSvgYarat(orbital);
}

export function masalaPdfHtmlYarat({
  foydalanuvchiNom = "Talaba",
  masalaMatni = "",
  natija = {},
  sana = new Date(),
}) {
  const berilgan = Array.isArray(natija.berilgan) ? natija.berilgan.slice(0, 20) : [];
  const topish = Array.isArray(natija.topishKerak) ? natija.topishKerak.slice(0, 20) : [];
  const tenglamalar = Array.isArray(natija.tenglamalar)
    ? natija.tenglamalar.slice(0, 12)
    : natija.tenglama ? [natija.tenglama] : [];
  const bosqichlar = Array.isArray(natija.bosqichlar) ? natija.bosqichlar.slice(0, 30) : [];
  const formulalar = Array.isArray(natija.yonalish?.formulalar)
    ? natija.yonalish.formulalar.slice(0, 20)
    : [];
  const qadamlarRejasi = Array.isArray(natija.yonalish?.qadamlarRejasi)
    ? natija.yonalish.qadamlarRejasi.slice(0, 20)
    : [];
  const vizual = pdfVizualniTayyorla(natija);
  const jamiParametr = Math.max(berilgan.length, topish.length);

  const parametrQatorlari = Array.from({ length: jamiParametr }, (_, indeks) => {
    const b = berilgan[indeks];
    const t = topish[indeks];
    return jadvalQatori(
      b ? `${b.belgi || ""} = ${b.qiymat || ""}` : "",
      t ? `${t.belgi || ""} — ${t.nom || ""}` : "",
    );
  }).join("");

  const sanaMatni = new Intl.DateTimeFormat("uz-UZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(sana);

  return `
    <article class="jda-pdf">
      <header class="pdf-header">
        <div>
          <div class="pdf-brend">JDA KIMYO</div>
          <div class="pdf-kichik">AI kimyoviy masala yechimi</div>
        </div>
        <div class="pdf-meta">
          <div>${htmlHimoya(foydalanuvchiNom)}</div>
          <div>${htmlHimoya(sanaMatni)}</div>
        </div>
      </header>

      <section>
        <h1>Kimyoviy masala sharti</h1>
        <div class="pdf-karta pdf-matn">${boyitilganMatnHtml(masalaMatni || natija.masalaMatni)}</div>
      </section>

      ${jamiParametr > 0 ? `
        <section>
          <h2>Boshlang'ich parametrlar</h2>
          <table class="pdf-jadval-asosiy">
            <thead><tr><th>Berilgan</th><th>Topilishi kerak</th></tr></thead>
            <tbody>${parametrQatorlari}</tbody>
          </table>
        </section>
      ` : ""}

      ${tenglamalar.length > 0 ? `
        <section>
          <h2>Kimyoviy tenglamalar</h2>
          ${tenglamalar.map((tenglama) => `<div class="pdf-karta pdf-formula">${formulaHtml(tenglama, true)}</div>`).join("")}
        </section>
      ` : ""}

      ${natija.tuzoqTahlili ? `
        <section>
          <h2>Muhim nuqta va keng tarqalgan xato</h2>
          <div class="pdf-karta pdf-matn">
            ${boyitilganMatnHtml(natija.tuzoqTahlili.kalitNuqta)}
            ${natija.tuzoqTahlili.nimaUchunMuhim ? `<p>${boyitilganMatnHtml(natija.tuzoqTahlili.nimaUchunMuhim)}</p>` : ""}
            ${natija.tuzoqTahlili.kengTarqalganXato ? `<p><strong>Diqqat:</strong> ${boyitilganMatnHtml(natija.tuzoqTahlili.kengTarqalganXato)}</p>` : ""}
          </div>
        </section>
      ` : ""}

      ${(formulalar.length > 0 || qadamlarRejasi.length > 0) ? `
        <section>
          <h2>Yechish yo'nalishi</h2>
          ${formulalar.map((formula) => `<div class="pdf-karta pdf-formula">${formulaHtml(formula, true)}</div>`).join("")}
          ${qadamlarRejasi.length > 0 ? `<ol class="pdf-reja">${qadamlarRejasi.map((qadam) => `<li>${boyitilganMatnHtml(qadam)}</li>`).join("")}</ol>` : ""}
        </section>
      ` : ""}

      ${bosqichlar.length > 0 ? `
        <section>
          <h2>Bosqichma-bosqich yechim</h2>
          ${bosqichlar.map((bosqich, indeks) => `
            <div class="pdf-bosqich">
              <h3>${htmlHimoya(bosqich.sarlavha || `${indeks + 1}-bosqich`)}</h3>
              ${(bosqich.tushuntirish || bosqich.mantiq || bosqich.matn) ? `<div class="pdf-matn">${boyitilganMatnHtml(bosqich.tushuntirish || bosqich.mantiq || bosqich.matn)}</div>` : ""}
              ${bosqich.formula ? `<div class="pdf-formula">${formulaHtml(bosqich.formula, true)}</div>` : ""}
            </div>
          `).join("")}
        </section>
      ` : ""}

      ${(vizual.jadvallar.length > 0 || vizual.grafiklar.length > 0 || vizual.orbitallar.length > 0) ? `
        <section>
          <h2>Ilmiy vizual tahlil</h2>
          ${vizual.jadvallar.map(vizualJadvalHtml).join("")}
          ${vizual.grafiklar.map(vizualGrafikHtml).join("")}
          ${vizual.orbitallar.map(vizualOrbitalHtml).join("")}
        </section>
      ` : ""}

      ${natija.yakuniyJavob ? `
        <section class="pdf-yakun">
          <h2>Yakuniy javob</h2>
          <div>${boyitilganMatnHtml(natija.yakuniyJavob)}</div>
        </section>
      ` : ""}

    </article>
  `;
}

export const MASALA_PDF_USLUBI = `
  .jda-pdf { width: 794px; box-sizing: border-box; padding: 38px 44px; background: #fff; color: #111827; font-family: "JDA Sans", "DejaVu Sans", Arial, sans-serif; font-size: 14px; line-height: 1.55; counter-reset: tenglama; font-variant-numeric: tabular-nums; }
  .jda-pdf * { box-sizing: border-box; }
  .pdf-header { display: flex; justify-content: space-between; align-items: center; background: #172554; color: #fff; padding: 18px 22px; border-bottom: 4px solid #d69e2e; margin-bottom: 24px; }
  .pdf-brend { font-size: 22px; font-weight: 800; letter-spacing: .08em; }
  .pdf-kichik { font-size: 11px; opacity: .8; text-transform: uppercase; }
  .pdf-meta { text-align: right; font-size: 11px; line-height: 1.5; }
  .jda-pdf section { margin: 0 0 20px; break-inside: auto; }
  .jda-pdf h1, .jda-pdf h2 { color: #172554; font-size: 15px; margin: 0 0 9px; text-transform: uppercase; letter-spacing: .04em; }
  .jda-pdf h3 { color: #1e3a8a; font-size: 14px; margin: 0 0 7px; }
  .pdf-karta, .pdf-bosqich { border: 1px solid #dbe2ea; background: #f8fafc; border-radius: 8px; padding: 11px 14px; margin-bottom: 9px; break-inside: avoid; }
  .pdf-bosqich { background: #fff; border-left: 4px solid #2563eb; }
  .pdf-formula { overflow-wrap: anywhere; text-align: center; max-width: 100%; min-width: 0; position: relative; }
  .pdf-formula .katex-display { margin: .35em 0; max-width: 100%; }
  .pdf-formula .katex { font-size: 1.08em; }
  .pdf-render-formula { max-width: 100%; }
  .pdf-tenglama { counter-increment: tenglama; padding-left: 38px; padding-right: 38px; }
  .pdf-tenglama::after { content: "(" counter(tenglama) ")"; position: absolute; right: 3px; top: 50%; transform: translateY(-50%); color: #64748b; font-family: "JDA Sans", sans-serif; font-size: 10px; font-weight: 600; }
  .pdf-xom-formula { white-space: pre-wrap; overflow-wrap: anywhere; }
  .pdf-matn { overflow-wrap: anywhere; }
  .pdf-matn p { margin: 7px 0 0; }
  .jda-pdf table { width: 100%; table-layout: fixed; border-collapse: collapse; font-size: 13px; }
  .jda-pdf thead { display: table-header-group; }
  .jda-pdf tr { break-inside: avoid; }
  .jda-pdf th { background: #1e293b; color: #fff; text-align: left; }
  .jda-pdf th, .jda-pdf td { border: 1px solid #dbe2ea; padding: 7px 9px; vertical-align: top; overflow-wrap: anywhere; }
  .jda-pdf ol { margin: 8px 0 0 22px; padding: 0; }
  .jda-pdf li { margin-bottom: 5px; }
  .pdf-jadval, .pdf-grafik { margin: 0 0 13px; padding: 11px 13px; border: 1px solid #dbe2ea; border-radius: 8px; background: #fff; break-inside: avoid; }
  .pdf-jadval table { margin-top: 7px; }
  .pdf-grafik { break-inside: avoid; }
  .pdf-grafik svg { display: block; width: 100%; height: auto; max-height: 270px; }
  .pdf-grid { stroke: #e2e8f0; stroke-width: 1; }
  .pdf-oq { stroke: #64748b; stroke-width: 1.4; }
  .pdf-ustun { fill: #2563eb; }
  .pdf-chiziq { fill: none; stroke: #2563eb; stroke-width: 3; stroke-linejoin: round; stroke-linecap: round; }
  .pdf-nuqta { fill: #fff; stroke: #2563eb; stroke-width: 3; }
  .pdf-grafik-belgi { fill: #64748b; font-size: 10px; }
  .pdf-grafik-qiymat { fill: #172554; font-size: 10px; font-weight: 700; }
  .pdf-grafik-oq { fill: #334155; font-size: 11px; font-weight: 700; }
  .pdf-orbital { margin: 0 0 13px; padding: 11px 13px; border: 1px solid #dbe2ea; border-radius: 8px; background: #fff; break-inside: avoid; }
  .pdf-orbital svg { display: block; width: 100%; height: auto; max-height: 310px; }
  .pdf-orbital-fon { fill: #f8fafc; stroke: #dbe2ea; }
  .pdf-orbital-oq { stroke: #94a3b8; stroke-width: .8; }
  .pdf-orbital-tugun { fill: none; stroke: #475569; stroke-width: 1.2; stroke-dasharray: 5 4; }
  .pdf-orbital-halqa { fill: none; stroke: #e11d48; stroke-width: 8; stroke-opacity: .5; }
  .pdf-orbital-yadro { fill: #d69e2e; stroke: #92400e; stroke-width: 1; }
  .pdf-orbital-belgi, .pdf-orbital-izoh, .pdf-orbital-eslatma { fill: #64748b; font-size: 11px; }
  .pdf-orbital-nom { fill: #172554; font-size: 19px; font-weight: 800; }
  .pdf-orbital-turi { fill: #2563eb; font-size: 17px; font-weight: 700; }
  .pdf-orbital-eslatma { font-size: 10px; }
  .pdf-sahifa-oraliq { width: 100%; margin: 0; padding: 0; border: 0; }
  .pdf-yakun { border: 2px solid #16a34a; background: #f0fdf4; border-radius: 9px; padding: 13px 16px; font-size: 16px; font-weight: 700; }
  .pdf-yakun h2 { color: #15803d; }
  @media print {
    html, body { margin: 0; padding: 0; background: #fff; }
    .jda-pdf { width: auto; padding: 0; font-size: 10.5pt; }
    .pdf-header, .pdf-karta, .pdf-bosqich, .pdf-grafik, .pdf-orbital, .pdf-yakun { break-inside: avoid-page; }
    .pdf-jadval { break-inside: auto; }
    .jda-pdf h1, .jda-pdf h2, .jda-pdf h3 { break-after: avoid-page; }
  }
`;
