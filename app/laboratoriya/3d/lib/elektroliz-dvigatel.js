// app/laboratoriya/3d/lib/elektroliz-dvigatel.js
//
// 2-QADAM: Elektroliz va Tok Manbai Dvigateli (Faradey Qonunlari).
// Katod/anod jarayonlari, ajralgan metall massasi, gazlar hajmi va
// elektroliz qonuniyatlarini real vaqtda hisoblaydi.

export const FARADEY_DOIMIYSI = 96485; // C/mol (A·s/mol)

export const ELEKTROLIZ_TURLARI = [
  {
    id: "cuso4_grafit",
    nomi: "Mis(II) sulfat eritmasi (CuSO₄ + Grafit elektrodlar)",
    tavsif: "Katodda sof metall mis qoplanishi va anodda kislorod gazi ajralishi.",
    tenglama: "2 CuSO₄ + 2 H₂O ➔ 2 Cu↓ (katod) + O₂↑ (anod) + 2 H₂SO₄",
    katodJarayoni: "Cu²⁺ + 2e⁻ ➔ Cu↓ (Metall qoplanishi)",
    anodJarayoni: "2 H₂O - 4e⁻ ➔ O₂↑ + 4 H⁺ (Kislorod ajralishi)",
    eritma: "1 M CuSO₄ eritmasi",
    katodModda: "Cu (Mis)",
    katodM: 63.546,
    katodZ: 2, // 2 elektron
    anodModda: "O₂ (Kislorod)",
    anodM: 31.998,
    anodZ: 4, // 4 elektron
    anodGaz: true,
    boshlangichRang: 0x0284c7, // To'q ko'k
    tugashRang: 0xe0f2fe, // Ochilib ketadi (H2SO4)
    qoplamaRangi: 0xb45309, // Mis rang (Zarxal-jigarrang)
  },
  {
    id: "suv_elektrolizi",
    nomi: "Suv Elektrolizi (Gofman apparati: H₂SO₄ eritmasi)",
    tavsif: "Katodda vodorod va anodda kislorod gazi 2:1 hajm nisbatida ajralishi.",
    tenglama: "2 H₂O ➔ 2 H₂↑ (katod) + O₂↑ (anod)",
    katodJarayoni: "4 H⁺ + 4e⁻ ➔ 2 H₂↑ (Vodorod gazi)",
    anodJarayoni: "2 H₂O - 4e⁻ ➔ O₂↑ + 4 H⁺ (Kislorod gazi)",
    eritma: "0.1 M H₂SO₄ (Elektrolit)",
    katodModda: "H₂ (Vodorod)",
    katodM: 2.016,
    katodZ: 2,
    katodGaz: true,
    anodModda: "O₂ (Kislorod)",
    anodM: 31.998,
    anodZ: 4,
    anodGaz: true,
    boshlangichRang: 0x38bdf8,
    tugashRang: 0x38bdf8,
    qoplamaRangi: 0xcccccc,
  },
  {
    id: "nacl_eritma",
    nomi: "Osh Tuzi Eritmasi Elektrolizi (Xlor-Ishqor sanoat usuli)",
    tavsif: "Katodda vodorod va NaOH, anodda sarg'ish-yashil xlor gazi hosil bo'ladi.",
    tenglama: "2 NaCl + 2 H₂O ➔ H₂↑ (katod) + Cl₂↑ (anod) + 2 NaOH",
    katodJarayoni: "2 H₂O + 2e⁻ ➔ H₂↑ + 2 OH⁻ (Ishqor hosil bo'lishi)",
    anodJarayoni: "2 Cl⁻ - 2e⁻ ➔ Cl₂↑ (Xlor gazi)",
    eritma: "2 M NaCl osh tuzi eritmasi",
    katodModda: "H₂ (Vodorod)",
    katodM: 2.016,
    katodZ: 2,
    katodGaz: true,
    anodModda: "Cl₂ (Xlor)",
    anodM: 70.9,
    anodZ: 2,
    anodGaz: true,
    boshlangichRang: 0xffffff,
    tugashRang: 0xfef08a, // Och sarg'ish xlorli
    qoplamaRangi: 0xcccccc,
  },
  {
    id: "kumushlash",
    nomi: "Galvanika: Kumushlash (AgNO₃ eritmasi va Kumush anod)",
    tavsif: "Katoddagi buyumga oyna kabi yaltiroq kumush qatlami qoplanadi.",
    tenglama: "Ag⁺ + e⁻ ➔ Ag↓ (katodda qoplanadi) | Ag - e⁻ ➔ Ag⁺ (anod eriydi)",
    katodJarayoni: "Ag⁺ + e⁻ ➔ Ag↓ (Sof kumush qoplamasi)",
    anodJarayoni: "Ag - e⁻ ➔ Ag⁺ (Eriydigan kumush anod)",
    eritma: "0.2 M AgNO₃ eritmasi",
    katodModda: "Ag (Kumush)",
    katodM: 107.87,
    katodZ: 1, // 1 elektron
    anodModda: "Ag (Erigan kumush)",
    anodM: 107.87,
    anodZ: 1,
    anodGaz: false,
    boshlangichRang: 0xffffff,
    tugashRang: 0xffffff,
    qoplamaRangi: 0xe2e8f0, // Yaltiroq kumushrang
  },
];

/**
 * Faradey qonuni bo'yicha elektroliz jarayonini hisoblash.
 * m = (M * I * t) / (z * F)
 *
 * @param {string} turId - Elektroliz turi ID si
 * @param {number} tokAmper - Tok kuchi I (Amper)
 * @param {number} vaqtSoniya - Vaqt t (Soniya)
 */
export function elektrolizHisobla(turId, tokAmper = 2.0, vaqtSoniya = 0) {
  const profil = ELEKTROLIZ_TURLARI.find((t) => t.id === turId) || ELEKTROLIZ_TURLARI[0];

  const I = Math.max(0, Number(tokAmper) || 0);
  const t = Math.max(0, Number(vaqtSoniya) || 0);
  const Q = I * t; // Kulon (C)

  // 1. Katodda ajralgan modda massasi
  // m = (M * I * t) / (z * F)
  const mKatodGramm = Number(((profil.katodM * Q) / (profil.katodZ * FARADEY_DOIMIYSI)).toFixed(4));
  const molKatod = Number((mKatodGramm / profil.katodM).toFixed(5));

  // Agar gaz bo'lsa (H2) hajmi (N.SH.)
  const vKatodLitr = profil.katodGaz ? Number((molKatod * 22.4).toFixed(3)) : 0;
  const vKatodMl = Number((vKatodLitr * 1000).toFixed(1));

  // 2. Anodda ajralgan modda massasi va hajmi
  const mAnodGramm = Number(((profil.anodM * Q) / (profil.anodZ * FARADEY_DOIMIYSI)).toFixed(4));
  const molAnod = Number((mAnodGramm / profil.anodM).toFixed(5));
  const vAnodLitr = profil.anodGaz ? Number((molAnod * 22.4).toFixed(3)) : 0;
  const vAnodMl = Number((vAnodLitr * 1000).toFixed(1));

  // Voltaj va qarshilik (taxminan U = E_parchalanish + I * R)
  const kuchlanishVolt = I > 0 ? Number((1.8 + I * 0.45).toFixed(2)) : 0;
  const quvvatVatt = Number((kuchlanishVolt * I).toFixed(1));

  return {
    profil,
    tokAmper: I,
    vaqtSoniya: t,
    kulon: Number(Q.toFixed(1)),
    kuchlanishVolt,
    quvvatVatt,
    katod: {
      modda: profil.katodModda,
      massaGramm: mKatodGramm,
      mol: molKatod,
      hajmLitr: vKatodLitr,
      hajmMl: vKatodMl,
      gaz: profil.katodGaz,
    },
    anod: {
      modda: profil.anodModda,
      massaGramm: mAnodGramm,
      mol: molAnod,
      hajmLitr: vAnodLitr,
      hajmMl: vAnodMl,
      gaz: profil.anodGaz,
    },
  };
}

/**
 * Talaba kiritgan Faradey hisob-kitobini tekshirish.
 */
export function elektrolizHisobiniTekshir(turId, tokAmper, vaqtSoniya, talabaMassasi) {
  const haqiqiy = elektrolizHisobla(turId, tokAmper, vaqtSoniya);
  const kiritilgan = parseFloat(talabaMassasi) || 0;

  const nazariy = haqiqiy.katod.gaz ? haqiqiy.katod.hajmLitr : haqiqiy.katod.massaGramm;
  const birlik = haqiqiy.katod.gaz ? "L (Hajm)" : "g (Massa)";

  const farq = Math.abs(kiritilgan - nazariy);
  const farqFoiz = farq / Math.max(0.0001, nazariy);
  const aniqlik = Math.max(0, Math.round((1 - farqFoiz) * 100));

  return {
    nazariy,
    kiritilgan,
    birlik,
    aniqlik,
    togri: aniqlik >= 95,
    izoh:
      aniqlik >= 95
        ? "Tabriklaymiz! Faradey qonuni bo'yicha hisobingiz juda yuqori aniqlikda bajarildi."
        : `Farq bor: Nazariy natija ${nazariy} ${birlik} bo'lishi kerak edi (Siz kiritdingiz: ${kiritilgan} ${birlik}).`,
  };
}
