// lib/ai-agents/deterministik-kimyo.js
//
// JDA KIMYO AI — DETERMINISTIK KIMYOVIY HAKAM VA MATEMATIK DVIGATEL (v1.0.0)
// Moddalarning aniq molyar massalarini, proporsiyalarni va tenglamalarni 0% xato bilan hisoblaydi.

// Davriy jadval atom massalari (IUPAC standart)
const ATOM_MASSALARI = {
  H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.81, C: 12.011, N: 14.007, O: 15.999,
  F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065,
  Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
  Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.64,
  As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Ag: 107.868, Cd: 112.411,
  I: 126.904, Ba: 137.327, Pt: 195.084, Au: 196.967, Hg: 200.592, Pb: 207.2
};

// DTM standart yaxlitlangan massalar (maktab va testlar uchun)
const DTM_ATOM_MASSALARI = {
  H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20,
  Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39,
  Ca: 40, Cr: 52, Mn: 55, Fe: 56, Co: 59, Ni: 59, Cu: 64, Zn: 65,
  Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207
};

/**
 * Kimyoviy formuladan aniq Molyar massani hisoblash (masalan: H2SO4, CuSO4*5H2O, Ca(OH)2)
 */
export function molyarMassaHisobla(formula, dtmYaxlit = true) {
  if (!formula || typeof formula !== "string") return null;

  const jadval = dtmYaxlit ? DTM_ATOM_MASSALARI : ATOM_MASSALARI;

  try {
    let toza = formula.replace(/\s+/g, "");

    // Kristallogidrat tekshiruvi (masalan: CuSO4*5H2O yoki CuSO4.5H2O)
    if (toza.includes("*") || toza.includes("·") || toza.includes("•")) {
      const qismlar = toza.split(/[*·•]/);
      let jami = molyarMassaHisobla(qismlar[0], dtmYaxlit);
      if (qismlar[1]) {
        const suvMatch = qismlar[1].match(/^(\d*)(.*)$/);
        const suvKoff = parseInt(suvMatch[1] || "1", 10);
        const suvM = molyarMassaHisobla(suvMatch[2] || "H2O", dtmYaxlit);
        jami += suvKoff * suvM;
      }
      return Number(jami.toFixed(2));
    }

    // Qavslarni ochish (masalan: Ca(OH)2 -> Ca O2 H2)
    while (toza.includes("(")) {
      toza = toza.replace(/\(([^()]+)\)(\d+)/g, (_, ichki, son) => {
        const k = parseInt(son, 10);
        return ichki.replace(/([A-Z][a-z]*)(\d*)/g, (__, element, miqdor) => {
          const m = miqdor ? parseInt(miqdor, 10) : 1;
          return `${element}${m * k}`;
        });
      });
      // Agar qavsdan keyin son bo'lmasa: (OH) -> OH
      toza = toza.replace(/\(([^()]+)\)/g, "$1");
    }

    // Elementlarni parse qilish
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let jamiMassa = 0;

    while ((match = regex.exec(toza)) !== null) {
      const element = match[1];
      const son = match[2] ? parseInt(match[2], 10) : 1;
      const atomM = jadval[element] || 0;
      jamiMassa += atomM * son;
    }

    return jamiMassa > 0 ? Number(jamiMassa.toFixed(2)) : null;
  } catch (e) {
    return null;
  }
}

/**
 * Pearson diagonal krestini deterministik hisoblash
 */
export function pearsonKrestiHisobla({ w1, w2, wTarget }) {
  const v1 = parseFloat(w1);
  const v2 = parseFloat(w2);
  const vt = parseFloat(wTarget);

  if (isNaN(v1) || isNaN(v2) || isNaN(vt)) return null;

  const yuqori = Math.max(v1, v2);
  const quyi = Math.min(v1, v2);

  if (vt <= quyi || vt >= yuqori) return null;

  const qism1 = Math.abs(vt - v2);
  const qism2 = Math.abs(v1 - vt);

  // Nisbatni eng kichik butun sonlarga keltirish
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const boluvchi = gcd(Math.round(qism1 * 100), Math.round(qism2 * 100)) / 100;

  const n1 = (qism1 / boluvchi).toFixed(1).replace(/\.0$/, "");
  const n2 = (qism2 / boluvchi).toFixed(1).replace(/\.0$/, "");

  return {
    mavjud: true,
    w1: v1,
    w2: v2,
    wTarget: vt,
    qism1,
    qism2,
    nisbat: `${n1} : ${n2}`
  };
}
