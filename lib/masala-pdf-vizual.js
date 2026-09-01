const MAX_JADVAL = 2;
const MAX_USTUN = 5;
const MAX_QATOR = 12;
const MAX_GRAFIK = 2;
const MAX_NUQTA = 8;
const MAX_ORBITAL = 2;
const ORBITAL_TURLARI = new Set([
  "1s",
  "2s",
  "2p_x",
  "2p_y",
  "2p_z",
  "3d_xy",
  "3d_xz",
  "3d_yz",
  "3d_x2-y2",
  "3d_z2",
]);

function qisqaMatn(qiymat, uzunlik = 180) {
  return String(qiymat ?? "").replace(/\s+/g, " ").trim().slice(0, uzunlik);
}

function jadvalniTayyorla(jadval) {
  const ustunlar = (Array.isArray(jadval?.ustunlar) ? jadval.ustunlar : [])
    .slice(0, MAX_USTUN)
    .map((ustun) => qisqaMatn(ustun, 60))
    .filter(Boolean);
  if (ustunlar.length === 0) return null;

  const qatorlar = (Array.isArray(jadval?.qatorlar) ? jadval.qatorlar : [])
    .slice(0, MAX_QATOR)
    .map((qator) => {
      const qiymatlar = Array.isArray(qator) ? qator : [];
      return ustunlar.map((_, indeks) => qisqaMatn(qiymatlar[indeks], 180));
    })
    .filter((qator) => qator.some(Boolean));
  if (qatorlar.length === 0) return null;

  return {
    sarlavha: qisqaMatn(jadval?.sarlavha || "Hisoblash jadvali", 100),
    ustunlar,
    qatorlar,
  };
}

function grafikniTayyorla(grafik) {
  const nuqtalar = (Array.isArray(grafik?.nuqtalar) ? grafik.nuqtalar : [])
    .slice(0, MAX_NUQTA)
    .map((nuqta, indeks) => ({
      nom: qisqaMatn(nuqta?.nom || `${indeks + 1}`, 32),
      qiymat: Number(nuqta?.qiymat),
    }))
    .filter((nuqta) => nuqta.nom && Number.isFinite(nuqta.qiymat));
  if (nuqtalar.length < 2) return null;

  return {
    turi: grafik?.turi === "chiziqli" ? "chiziqli" : "ustunli",
    sarlavha: qisqaMatn(grafik?.sarlavha || "Qiymatlar taqqoslanishi", 100),
    xNomi: qisqaMatn(grafik?.xNomi, 50),
    yNomi: qisqaMatn(grafik?.yNomi, 50),
    nuqtalar,
  };
}

function orbitalniTayyorla(orbital) {
  const turi = qisqaMatn(orbital?.turi, 20)
    .toLowerCase()
    .replace(/^2px$/, "2p_x")
    .replace(/^2py$/, "2p_y")
    .replace(/^2pz$/, "2p_z")
    .replace(/^3dxy$/, "3d_xy")
    .replace(/^3dxz$/, "3d_xz")
    .replace(/^3dyz$/, "3d_yz")
    .replace(/^3dx2-y2$/, "3d_x2-y2")
    .replace(/^3dz2$/, "3d_z2");
  if (!ORBITAL_TURLARI.has(turi)) return null;

  return {
    turi,
    atom: qisqaMatn(orbital?.atom || "Atom", 30),
    sarlavha: qisqaMatn(orbital?.sarlavha, 100),
  };
}

function krestVizuali(krest) {
  if (!krest?.mavjud) return null;
  const nuqtalar = [
    { nom: "1-eritma", qiymat: Number(krest.w1) },
    { nom: "Maqsad", qiymat: Number(krest.wTarget) },
    { nom: "2-eritma", qiymat: Number(krest.w2) },
  ].filter((nuqta) => Number.isFinite(nuqta.qiymat));
  if (nuqtalar.length < 2) return null;

  return {
    jadval: {
      sarlavha: "Pearson kresti natijasi",
      ustunlar: ["Ko'rsatkich", "Konsentratsiya", "Ulush"],
      qatorlar: [
        ["1-eritma", `${krest.w1}%`, String(krest.qism1 ?? "-")],
        ["Maqsad", `${krest.wTarget}%`, `Nisbat: ${krest.nisbat || "-"}`],
        ["2-eritma", `${krest.w2}%`, String(krest.qism2 ?? "-")],
      ],
    },
    grafik: {
      turi: "ustunli",
      sarlavha: "Eritmalar konsentratsiyasi",
      xNomi: "Eritma",
      yNomi: "%",
      nuqtalar,
    },
  };
}

/** AI bergan ixtiyoriy vizualni qat'iy chegaralab, PDF generatorlariga bir xil shakl beradi. */
export function pdfVizualniTayyorla(natija = {}) {
  const manba = natija?.vizual && typeof natija.vizual === "object"
    ? natija.vizual
    : {};
  const jadvallar = (Array.isArray(manba.jadvallar) ? manba.jadvallar : [])
    .map(jadvalniTayyorla)
    .filter(Boolean)
    .slice(0, MAX_JADVAL);
  const grafiklar = (Array.isArray(manba.grafiklar) ? manba.grafiklar : [])
    .map(grafikniTayyorla)
    .filter(Boolean)
    .slice(0, MAX_GRAFIK);
  const orbitallar = (Array.isArray(manba.orbitallar) ? manba.orbitallar : [])
    .map(orbitalniTayyorla)
    .filter(Boolean)
    .slice(0, MAX_ORBITAL);

  const krest = krestVizuali(natija?.krestSxemasi);
  if (krest) {
    if (jadvallar.length < MAX_JADVAL) jadvallar.unshift(krest.jadval);
    if (grafiklar.length < MAX_GRAFIK) grafiklar.unshift(krest.grafik);
  }

  return {
    jadvallar: jadvallar.slice(0, MAX_JADVAL),
    grafiklar: grafiklar.slice(0, MAX_GRAFIK),
    orbitallar,
  };
}
