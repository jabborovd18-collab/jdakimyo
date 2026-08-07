// Reagent kalitidan uning ko'rinishini — rangi, agregat holati va shaffofligini —
// aniqlaydi.
//
// Nega ikki bosqichli: bazada 242 ta modda bor va hammasiga qo'lda rang berish real
// emas. Lekin eng ko'p uchraydiganlari noto'g'ri rangda ko'rinsa, o'quvchi noto'g'ri
// narsa yodlab qoladi — mis kuporosini yashil deb eslab qolgan talaba buni keyin
// haqiqiy laboratoriyada tuzatishi qiyin. Shuning uchun ko'p ishlatiladiganlari
// qo'lda yozilgan, qolganlari formula tarkibidan taxmin qilinadi.

// ─────────────────────────────────────────────────────────────
// 1-bosqich: aniq jadval
// ─────────────────────────────────────────────────────────────
//
// Kalitlar Unicode pastki indeks bilan yoziladi (H₂O, H2O emas) — server aynan shu
// satrni yuboradi va oddiy `H2O` hech qachon mos kelmaydi.
const JADVAL = {
  // ── Rangsiz eritmalar va suyuqliklar ──
  "H₂O": { rang: 0xdbeafe, holat: "suyuq", shaffoflik: 0.12 },
  "NaOH": { rang: 0xe8f0fb, holat: "suyuq", shaffoflik: 0.16 },
  "KOH": { rang: 0xe8f0fb, holat: "suyuq", shaffoflik: 0.16 },
  "HCl": { rang: 0xeaf6ff, holat: "suyuq", shaffoflik: 0.14 },
  "H₂SO₄": { rang: 0xf3f6e8, holat: "suyuq", shaffoflik: 0.22 },
  "HNO₃": { rang: 0xfdf6d8, holat: "suyuq", shaffoflik: 0.2 },
  "NH₃": { rang: 0xeef4ff, holat: "gaz", shaffoflik: 0.1 },
  "CH₃COOH": { rang: 0xf1f5f9, holat: "suyuq", shaffoflik: 0.16 },

  // ── Mis birikmalari ──
  "CuSO₄": { rang: 0x1d4ed8, holat: "suyuq", shaffoflik: 0.75 },
  "CuCl₂": { rang: 0x1e88a8, holat: "suyuq", shaffoflik: 0.7 },
  "Cu(OH)₂": { rang: 0x7dd3fc, holat: "qattiq", shaffoflik: 0.9 },
  "CuO": { rang: 0x111827, holat: "qattiq", shaffoflik: 1 },
  "Cu": { rang: 0xb45309, holat: "qattiq", shaffoflik: 1 },

  // ── Temir birikmalari ──
  "FeCl₃": { rang: 0xb45309, holat: "suyuq", shaffoflik: 0.72 },
  "FeCl₂": { rang: 0x86a17a, holat: "suyuq", shaffoflik: 0.6 },
  "FeSO₄": { rang: 0x86a17a, holat: "suyuq", shaffoflik: 0.6 },
  "Fe(OH)₃": { rang: 0x9a3412, holat: "qattiq", shaffoflik: 0.95 },
  "Fe(OH)₂": { rang: 0x4d7c4d, holat: "qattiq", shaffoflik: 0.9 },
  "Fe₂O₃": { rang: 0x7f1d1d, holat: "qattiq", shaffoflik: 1 },
  "Fe": { rang: 0x6b7280, holat: "qattiq", shaffoflik: 1 },

  // ── Kuchli oksidlovchilar ──
  "KMnO₄": { rang: 0x7e22ce, holat: "suyuq", shaffoflik: 0.85 },
  "K₂Cr₂O₇": { rang: 0xea580c, holat: "suyuq", shaffoflik: 0.8 },
  "K₂CrO₄": { rang: 0xfacc15, holat: "suyuq", shaffoflik: 0.75 },

  // ── Boshqa metall tuzlari ──
  "NiSO₄": { rang: 0x15803d, holat: "suyuq", shaffoflik: 0.72 },
  "CoCl₂": { rang: 0xec4899, holat: "suyuq", shaffoflik: 0.7 },
  "AgNO₃": { rang: 0xf1f5f9, holat: "suyuq", shaffoflik: 0.15 },
  "ZnSO₄": { rang: 0xf1f5f9, holat: "suyuq", shaffoflik: 0.15 },

  // ── Oq cho'kmalar ──
  "AgCl": { rang: 0xf8fafc, holat: "qattiq", shaffoflik: 0.95 },
  "BaSO₄": { rang: 0xf8fafc, holat: "qattiq", shaffoflik: 0.95 },
  "CaCO₃": { rang: 0xf1f5f9, holat: "qattiq", shaffoflik: 0.92 },
  "Al(OH)₃": { rang: 0xf8fafc, holat: "qattiq", shaffoflik: 0.9 },
  "Mg(OH)₂": { rang: 0xf8fafc, holat: "qattiq", shaffoflik: 0.9 },

  // ── Sof moddalar ──
  "I₂": { rang: 0x4c1d95, holat: "qattiq", shaffoflik: 1 },
  "S": { rang: 0xfacc15, holat: "qattiq", shaffoflik: 1 },
  "C": { rang: 0x0f172a, holat: "qattiq", shaffoflik: 1 },
  "Zn": { rang: 0x94a3b8, holat: "qattiq", shaffoflik: 1 },
  "Al": { rang: 0xcbd5e1, holat: "qattiq", shaffoflik: 1 },
  "Mg": { rang: 0xe2e8f0, holat: "qattiq", shaffoflik: 1 },
  "Na": { rang: 0xe2e8f0, holat: "qattiq", shaffoflik: 1 },

  // ── Gazlar ──
  "O₂": { rang: 0xeff6ff, holat: "gaz", shaffoflik: 0.08 },
  "H₂": { rang: 0xf8fafc, holat: "gaz", shaffoflik: 0.06 },
  "N₂": { rang: 0xeff6ff, holat: "gaz", shaffoflik: 0.06 },
  "CO₂": { rang: 0xe2e8f0, holat: "gaz", shaffoflik: 0.1 },
  "CO": { rang: 0xe2e8f0, holat: "gaz", shaffoflik: 0.08 },
  "Cl₂": { rang: 0xbef264, holat: "gaz", shaffoflik: 0.35 },
  "SO₂": { rang: 0xfef9c3, holat: "gaz", shaffoflik: 0.3 },
  "NO₂": { rang: 0xea580c, holat: "gaz", shaffoflik: 0.45 },
  "H₂S": { rang: 0xfefce8, holat: "gaz", shaffoflik: 0.25 },
};

// Formulada metall belgisi bo'lsa shu rang olinadi. Tartib muhim: ikki harfli
// belgilar ("Cu") bir harfli ("C") dan oldin tekshiriladi, aks holda CuSO₄
// uglerod deb qabul qilinardi.
const METALL_RANGLARI = [
  ["Cu", 0x1d4ed8], // mis — ko'k
  ["Fe", 0xb45309], // temir — sarg'ish-jigarrang
  ["Mn", 0x7e22ce], // marganes — binafsha
  ["Cr", 0x15803d], // xrom — yashil
  ["Ni", 0x15803d], // nikel — yashil
  ["Co", 0xec4899], // kobalt — pushti
];

// Formulada uchraydigan, gaz ekanini ko'rsatuvchi belgilar
const GAZ_BELGISI = "↑";

const RANGSIZ = 0xdbeafe;

// Kalitning boshidagi element belgisini oladi: "CaCO₃" → "Ca", "S" → "S".
// Nega kerak: qattiq/suyuq farqini ajratishda metall bilan boshlanishi asosiy
// belgi bo'ladi.
function boshElement(kalit) {
  const moslik = kalit.match(/^[A-Z][a-z]?/);
  return moslik ? moslik[0] : "";
}

// Metall bilan boshlanadigan, lekin kislorod/vodorod/oltingugurt tutmaydigan
// birikmalar odatda qattiq tuz yoki sof metall bo'ladi.
const METALL_BOSHLARI = new Set([
  "Li", "Na", "K", "Rb", "Cs", "Be", "Mg", "Ca", "Sr", "Ba",
  "Al", "Zn", "Fe", "Cu", "Ag", "Au", "Pb", "Sn", "Ni", "Co",
  "Mn", "Cr", "Ti", "Pt", "Hg", "Cd", "W", "V",
]);

/**
 * Modda ko'rinishini qaytaradi.
 *
 * Har doim to'liq obyekt qaytariladi, hech qachon undefined emas: chaqiruvchi
 * (rang-aralashtirish.js va korinish.js) natijaning `.rang` maydonini to'g'ridan
 * o'qiydi, oraliq tekshiruvsiz.
 *
 * @param {string} kalit — reagent kaliti, masalan "CuSO₄"
 * @returns {{ rang: number, holat: 'suyuq'|'qattiq'|'gaz', shaffoflik: number }}
 */
export function moddaKorinishi(kalit) {
  const k = String(kalit || "").trim();
  if (!k) return { rang: RANGSIZ, holat: "suyuq", shaffoflik: 0.12 };

  // 1-bosqich — aniq jadval
  const toza = k.replace(GAZ_BELGISI, "").replace("↓", "").trim();
  if (JADVAL[toza]) return { ...JADVAL[toza] };

  // 2-bosqich — formuladan taxmin
  let rang = RANGSIZ;
  let shaffoflik = 0.18;
  for (const [belgi, qiymat] of METALL_RANGLARI) {
    if (toza.includes(belgi)) {
      rang = qiymat;
      shaffoflik = 0.65;
      break;
    }
  }

  let holat = "suyuq";
  if (k.includes(GAZ_BELGISI)) {
    holat = "gaz";
    shaffoflik = 0.12;
  } else if (k.includes("↓")) {
    holat = "qattiq";
    shaffoflik = 0.9;
  } else {
    const bosh = boshElement(toza);
    const kislorodsiz = !/[OHS]/.test(toza.slice(bosh.length));
    if (METALL_BOSHLARI.has(bosh) && kislorodsiz) {
      holat = "qattiq";
      shaffoflik = 0.95;
    }
  }

  return { rang, holat, shaffoflik };
}
