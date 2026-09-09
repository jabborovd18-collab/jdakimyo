const MAKS_QATOR = 6;

function xmlniHimoya(qiymat) {
  return String(qiymat ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function qisqartir(qiymat, chegara = 62) {
  const matn = String(qiymat ?? "").replace(/\s+/g, " ").trim();
  return matn.length > chegara ? `${matn.slice(0, chegara - 1)}…` : matn;
}

function nisbatQatorlariniOl(krestSxemasi) {
  if (!krestSxemasi || typeof krestSxemasi !== "object") return [];
  const nom1 = krestSxemasi.modda1 || krestSxemasi.nom1 || "1-modda";
  const nom2 = krestSxemasi.modda2 || krestSxemasi.nom2 || "2-modda";
  const qatorlar = [
    [nom1, krestSxemasi.w1],
    ["Maqsadli ulush", krestSxemasi.wTarget],
    [nom2, krestSxemasi.w2],
  ].filter(([, qiymat]) => Number.isFinite(Number(qiymat)));
  if (krestSxemasi.nisbat) qatorlar.push(["Nisbat", krestSxemasi.nisbat]);
  return qatorlar;
}

/** Chat mijozi bevosita joylashtira oladigan, tashqi resurs ishlatmaydigan ixcham SVG hosil qiladi. */
export function chatVizualiniYarat(natija = {}) {
  const krestSxemasi = natija.krestSxemasi || natija.vizualSxema;
  const formulalar = [
    ...(Array.isArray(natija.tenglamalar) ? natija.tenglamalar : []),
    ...(Array.isArray(natija.yonalish?.formulalar) ? natija.yonalish.formulalar : []),
  ].filter((formula) => typeof formula === "string" && formula.trim())
    .slice(0, 2)
    .map((formula) => ["Formula", qisqartir(formula)]);
  const qatorlar = [...formulalar, ...nisbatQatorlariniOl(krestSxemasi)]
    .slice(0, MAKS_QATOR);
  if (qatorlar.length === 0) return null;

  const balandlik = 54 + qatorlar.length * 30;
  const satrlar = qatorlar.map(([nom, qiymat], index) => {
    const y = 48 + index * 30;
    const fon = index % 2 === 0 ? "var(--v3-yuza, #ffffff)" : "var(--v3-fon, #f6f8fb)";
    return `<rect x="12" y="${y}" width="616" height="30" fill="${fon}" />
      <text x="24" y="${y + 20}" fill="var(--v3-xira, #52606d)" font-size="12">${xmlniHimoya(nom)}</text>
      <text x="184" y="${y + 20}" fill="var(--v3-matn, #17202a)" font-size="12" font-weight="600">${xmlniHimoya(qiymat)}</text>`;
  }).join("\n");
  const sarlavha = krestSxemasi ? "Formula va moddalar nisbati" : "Formula jadvali";
  return {
    turi: "svg_formula_jadval",
    sarlavha,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 ${balandlik}" role="img" aria-label="${xmlniHimoya(sarlavha)}">
  <rect x="1" y="1" width="638" height="${balandlik - 2}" rx="12" fill="var(--v3-yuza, #ffffff)" stroke="var(--v3-chiziq, #d9e0e7)" />
  <text x="24" y="30" fill="var(--v3-urgu, #176b87)" font-size="14" font-weight="700">${xmlniHimoya(sarlavha)}</text>
  ${satrlar}
</svg>`,
  };
}
