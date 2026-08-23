// lib/kimyo-fonetika.js
//
// Kimyoviy formulalar, belgilar va sonlarni tabiiy o'zbekcha nutqqa (fonetikaga)
// aylantiruvchi yordamchi modul.
// Nega kerak: TTS robotlariga "CuSO₄" berilsa "se-u-es-o-to'rt" deb xunuk o'qiydi.
// Fonetik normalizator uni "Mis sulfat" yoki "Mis kuporosi" ga o'girib beradi.

// Eksport qilingan: ochiq lug'at generatori shu jadvaldan o'zbekcha
// nomlarni oladi. Nusxa ko'chirilsa, ikkinchi nusxa vaqt o'tishi bilan
// bu yerdagidan uzilib qolardi.
export const BIRIKMALAR_LUGATI = {
  "CuSO4*5H2O": "Mis kuporosi kristallogidrati",
  "CuSO4·5H2O": "Mis kuporosi kristallogidrati",
  "CuSO₄·5H₂O": "Mis kuporosi kristallogidrati",
  "CuSO₄*5H₂O": "Mis kuporosi kristallogidrati",
  "FeSO4*7H2O": "Temir kuporosi kristallogidrati",
  "FeSO4·7H2O": "Temir kuporosi kristallogidrati",
  "FeSO₄·7H₂O": "Temir kuporosi kristallogidrati",
  "CuSO4": "Mis sulfat",
  "CuSO₄": "Mis sulfat",
  "FeSO4": "Temir ikki sulfat",
  "FeSO₄": "Temir ikki sulfat",
  "Fe2(SO4)3": "Temir uch sulfat",
  "Fe₂(SO₄)₃": "Temir uch sulfat",
  "H2SO4": "Sulfat kislota",
  "H₂SO₄": "Sulfat kislota",
  "HNO3": "Nitrat kislota",
  "HNO₃": "Nitrat kislota",
  "HCl": "Xlorid kislota",
  "H3PO4": "Fosfat kislota",
  "H₃PO₄": "Fosfat kislota",
  "CH3COOH": "Sirka kislota",
  "CH₃COOH": "Sirka kislota",
  "NaOH": "Natriy gidroksid ishqori",
  "KOH": "Kaliy gidroksid ishqori",
  "Ca(OH)2": "Kalsiy gidroksid",
  "Ca(OH)₂": "Kalsiy gidroksid",
  "Ba(OH)2": "Bariy gidroksid",
  "Ba(OH)₂": "Bariy gidroksid",
  "NaCl": "Osh tuzi natriy xlorid",
  "Na2SO4": "Natriy sulfat tuzi",
  "Na₂SO₄": "Natriy sulfat tuzi",
  "K2SO4": "Kaliy sulfat",
  "K₂SO₄": "Kaliy sulfat",
  "AgNO3": "Kumush nitrat",
  "AgNO₃": "Kumush nitrat",
  "BaCl2": "Bariy xlorid",
  "BaCl₂": "Bariy xlorid",
  "FeCl3": "Temir uch xlorid",
  "FeCl₃": "Temir uch xlorid",
  "H2O": "suv",
  "H₂O": "suv",
  "CO2": "uglerod ikki oksidi gazi",
  "CO₂": "uglerod ikki oksidi gazi",
  "CO": "is gazi",
  "O2": "kislorod gazi",
  "O₂": "kislorod gazi",
  "O3": "ozon gazi",
  "O₃": "ozon gazi",
  "N2": "azot gazi",
  "N₂": "azot gazi",
  "H2": "vodorod gazi",
  "H₂": "vodorod gazi",
  "NH3": "ammiak gazi",
  "NH₃": "ammiak gazi",
  "CH4": "metan gazi",
  "CH₄": "metan gazi",
};

/**
 * Matnni o'zbekcha ravon o'qish uchun fonetik jihatdan moslashtirish.
 *
 * @param {string} matn - Xom kimyoviy yoki matematik matn
 * @returns {string} Fonetik o'zbekcha matn
 */
export function kimyoMatniniFonetikQil(matn = "") {
  if (!matn) return "";

  let natija = String(matn);

  // 1. Birikmalar lug'atidan almashtirish
  for (const [formula, oqilishi] of Object.entries(BIRIKMALAR_LUGATI)) {
    const qidiruv = new RegExp(`\\b${formula.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    natija = natija.replace(qidiruv, oqilishi);
  }

  // 2. Kimyoviy va matematik belgilar
  natija = natija
    .replace(/→|➔|⟶|⇒/g, " natijasida hosil bo'ladi ")
    .replace(/⇌|⇄/g, " qaytar reaksiyada muvozanatlashadi ")
    .replace(/\+/g, " va ")
    .replace(/×|\*/g, " ko'paytirilgan ")
    .replace(/÷|\//g, " taqsim ")
    .replace(/=/g, " teng ")
    .replace(/ΔH/g, "entalpiya o'zgarishi")
    .replace(/N_A|N_a|NA/g, "Avogadro soni")
    .replace(/V_m|Vm/g, "molyar hajm")
    .replace(/C_M|CM/g, "molyar konsentratsiya")
    .replace(/ω|omega/gi, "massaviy ulush");

  // 3. Fizik birliklar
  natija = natija
    .replace(/(\d+(?:\.\d+)?)\s*%/g, "$1 foiz")
    .replace(/(\d+(?:\.\d+)?)\s*g\b/gi, "$1 gramm")
    .replace(/(\d+(?:\.\d+)?)\s*kg\b/gi, "$1 kilogramm")
    .replace(/(\d+(?:\.\d+)?)\s*ml\b/gi, "$1 millilitr")
    .replace(/(\d+(?:\.\d+)?)\s*l\b/gi, "$1 litr")
    .replace(/(\d+(?:\.\d+)?)\s*mol\b/gi, "$1 mol")
    .replace(/(\d+(?:\.\d+)?)\s*kj\b/gi, "$1 kilojoul")
    .replace(/(\d+(?:\.\d+)?)\s*°c\b/gi, "$1 gradus selsiy")
    .replace(/N\.SH\.|n\.sh\./gi, "normal sharoitda");

  // 4. O'nlik kasrlar (masalan: 12.8 -> "12 butun 8")
  natija = natija.replace(/(\d+)\.(\d+)/g, "$1 butun $2");

  // 5. Ortiqcha probellarni tozalash
  natija = natija.replace(/\s+/g, " ").trim();

  return natija;
}

/**
 * Matnni Google TTS chegarasi bo'yicha kichik gaplarga (chunks <= 140 belgi) ajratish.
 */
export function matnniGaplargaBol(matn = "", maxUzunlik = 140) {
  if (!matn) return [];

  const tozaMatn = kimyoMatniniFonetikQil(matn);
  const gaplar = tozaMatn.match(/[^.!?]+[.!?]+/g) || [tozaMatn];

  const qismlar = [];
  gaplar.forEach((gap) => {
    const t = gap.trim();
    if (!t) return;
    if (t.length <= maxUzunlik) {
      qismlar.push(t);
    } else {
      // Uzun gapni vergul yoki probel bo'yicha bo'lish
      const bolaklar = t.split(/,\s+/);
      let joriy = "";
      bolaklar.forEach((b) => {
        if ((joriy + ", " + b).length <= maxUzunlik) {
          joriy = joriy ? joriy + ", " + b : b;
        } else {
          if (joriy) qismlar.push(joriy);
          joriy = b;
        }
      });
      if (joriy) qismlar.push(joriy);
    }
  });

  return qismlar.length > 0 ? qismlar : [tozaMatn.slice(0, maxUzunlik)];
}
