// app/laboratoriya/3d/lib/titrlash-dvigatel.js
//
// 1-QADAM: Volumetrik Titrlash va Analitik Byuretka Dvigateli.
// Kislota-asosli, Oksidlanish-qaytarilish (Permanganatometriya) va
// Kompleksonometriya (Trilon B) titrlashlarini 0.01 ml aniqlik bilan hisoblaydi.

export const TITRLASH_TURLARI = [
  {
    id: "kislota_kuchli",
    nomi: "Kuchli kislota + Kuchli ishqor (HCl + NaOH)",
    tur: "kislota_asos",
    tavsif: "0.1 M HCl kislotani 0.1 M NaOH standart titranti bilan titrlash.",
    tenglama: "HCl + NaOH → NaCl + H₂O",
    titrant: "0.100 M NaOH (Standart)",
    titrantKons: 0.1,
    aniqlanuvchi: "Noma'lum HCl eritmasi",
    aniqlanuvchiHajm: 20.0, // ml
    haqiqiyKons: 0.1, // 0.1 M -> V_eq = 20.0 ml
    indikator: "Fenolftalein",
    indikatorOzon: "pH 8.2 - 10.0 (Rangsiz → Pushti)",
    boshlangichRang: 0xffffff,
    ekvivalentRang: 0xf472b6, // Pushti
    ortiqchaRang: 0xec4899, // To'q fuksiya
  },
  {
    id: "sirka_ishqor",
    nomi: "Kuchsiz kislota + Kuchli ishqor (CH₃COOH + NaOH)",
    tur: "kislota_asos",
    tavsif: "0.1 M Sirka kislotasini 0.1 M NaOH bilan titrlash (Bufer soha).",
    tenglama: "CH₃COOH + NaOH → CH₃COONa + H₂O",
    titrant: "0.100 M NaOH (Standart)",
    titrantKons: 0.1,
    aniqlanuvchi: "Sirka kislota (CH₃COOH)",
    aniqlanuvchiHajm: 20.0,
    haqiqiyKons: 0.1,
    pKa: 4.76,
    indikator: "Fenolftalein",
    indikatorOzon: "pH 8.2 - 10.0 (Ekvivalentlik nuqtasi pH ~ 8.7)",
    boshlangichRang: 0xffffff,
    ekvivalentRang: 0xf472b6,
    ortiqchaRang: 0xec4899,
  },
  {
    id: "permanganat",
    nomi: "Redoks Titrlash: Permanganatometriya (Fe²⁺ + KMnO₄)",
    tur: "redoks",
    tavsif: "Kislotali muhitda Fe²⁺ tuzini 0.02 M KMnO₄ bilan titrlash (Indikatorsiz).",
    tenglama: "5 FeSO₄ + KMnO₄ + 4 H₂SO₄ → 5/2 Fe₂(SO₄)₃ + MnSO₄ + 1/2 K₂SO₄ + 4 H₂O",
    titrant: "0.020 M KMnO₄ (To'q binafsha)",
    titrantKons: 0.02,
    aniqlanuvchi: "Temir(II) sulfat (FeSO₄)",
    aniqlanuvchiHajm: 20.0,
    haqiqiyKons: 0.05, // 5 Fe2+ : 1 MnO4- -> V_eq = (0.05 * 20) / (0.02 * 5) = 10.0 ml
    stexioNisbat: 5,
    indikator: "KMnO₄ ning o'zi (Indikatorsiz)",
    indikatorOzon: "Ekvivalentlik nuqtasida birinchi ortiqcha tomchidan och pushti rang hosil bo'ladi",
    boshlangichRang: 0xdcfce7, // Och yashil (Fe2+)
    ekvivalentRang: 0xfbcfe8, // Och pushti (Ortiqcha MnO4-)
    ortiqchaRang: 0xa855f7, // Binafsha
  },
  {
    id: "trilon_b",
    nomi: "Kompleksonometriya: Suv Qattiqligi (Ca²⁺ + EDTA)",
    tur: "kompleks",
    tavsif: "Ca²⁺ ionlarini Trilon B (EDTA) bilan Erixrom qora T indikatori yordamida titrlash.",
    tenglama: "Ca²⁺ + [H₂EDTA]²⁻ → [CaEDTA]²⁻ + 2 H⁺",
    titrant: "0.050 M Trilon B (EDTA)",
    titrantKons: 0.05,
    aniqlanuvchi: "Qattiq suv (Ca²⁺ eritmasi)",
    aniqlanuvchiHajm: 25.0,
    haqiqiyKons: 0.03, // V_eq = (0.03 * 25) / 0.05 = 15.0 ml
    indikator: "Eriochrome Black T (Erio T)",
    indikatorOzon: "Sharob qizil (Vino) → Toza zangori ko'k (Moviy)",
    boshlangichRang: 0x991b1b, // Sharob qizil
    ekvivalentRang: 0x0284c7, // Moviy ko'k
    ortiqchaRang: 0x0369a1, // To'q ko'k
  },
];

/**
 * Qo'shilgan titrant hajmi (V_ml) bo'yicha real vaqtda pH va eritma holatini hisoblash.
 *
 * @param {object} p
 * @param {string} p.turId - Titrlash turi ID si
 * @param {number} p.vTitrant - Qo'shilgan titrant hajmi (ml)
 */
export function titrlashHolatiniHisobla(turId, vTitrant = 0) {
  const profil = TITRLASH_TURLARI.find((t) => t.id === turId) || TITRLASH_TURLARI[0];
  const V_t = Math.max(0, Number(vTitrant) || 0);

  const C_titrant = profil.titrantKons;
  const V_analit = profil.aniqlanuvchiHajm;
  const C_analit = profil.haqiqiyKons;
  const stex = profil.stexioNisbat || 1;

  // Ekvivalentlik nuqtasi hajmi (V_eq)
  const V_eq = Number(((C_analit * V_analit) / (C_titrant * stex)).toFixed(2));
  const jamiHajm = V_analit + V_t;

  let ph = 7.0;
  let rangHex = profil.boshlangichRang;
  let holatNomi = "Titrlash boshlanishi";
  let ekvivalentlikYetdimi = false;

  // 1. KUCHLI KISLOTA + KUCHLI ISHQOR (HCl + NaOH)
  if (profil.id === "kislota_kuchli") {
    const molH_boshlangich = (V_analit * C_analit) / 1000;
    const molOH_qoshilgan = (V_t * C_titrant) / 1000;

    if (V_t < V_eq - 0.01) {
      const qolganMolH = molH_boshlangich - molOH_qoshilgan;
      const konsH = (qolganMolH / (jamiHajm / 1000));
      ph = Math.max(1.0, Math.min(6.99, Number((-Math.log10(Math.max(1e-7, konsH))).toFixed(2))));
      rangHex = profil.boshlangichRang;
      holatNomi = "Kislotali muhit (HCl ortiqcha)";
    } else if (Math.abs(V_t - V_eq) <= 0.05) {
      ph = 7.0;
      rangHex = profil.ekvivalentRang;
      holatNomi = "🎯 EKVIVALENTLIK NUQTASI (Neytral pH = 7.00)";
      ekvivalentlikYetdimi = true;
    } else {
      const ortganMolOH = molOH_qoshilgan - molH_boshlangich;
      const konsOH = (ortganMolOH / (jamiHajm / 1000));
      const poh = -Math.log10(Math.max(1e-7, konsOH));
      ph = Math.min(13.0, Math.max(7.01, Number((14 - poh).toFixed(2))));
      rangHex = profil.ortiqchaRang;
      holatNomi = "Ishqoriy muhit (NaOH ortiqcha)";
      ekvivalentlikYetdimi = true;
    }
  }

  // 2. KUCHSIZ KISLOTA + KUCHLI ISHQOR (CH3COOH + NaOH)
  else if (profil.id === "sirka_ishqor") {
    const pKa = profil.pKa || 4.76;
    if (V_t <= 0.05) {
      ph = Number((0.5 * (pKa - Math.log10(C_analit))).toFixed(2));
      rangHex = profil.boshlangichRang;
      holatNomi = "Sirka kislota dastlabki pH";
    } else if (V_t < V_eq - 0.05) {
      // Henderson-Hasselbalch bufer tenglamasi: pH = pKa + log([A-] / [HA])
      const ratio = V_t / (V_eq - V_t);
      ph = Number((pKa + Math.log10(ratio)).toFixed(2));
      rangHex = profil.boshlangichRang;
      holatNomi = "Bufer soha (CH₃COOH + CH₃COONa)";
    } else if (Math.abs(V_t - V_eq) <= 0.08) {
      ph = 8.72; // Tuz gidrolizi sababli ishqoriy
      rangHex = profil.ekvivalentRang;
      holatNomi = "🎯 EKVIVALENTLIK NUQTASI (Gidroliz pH = 8.72)";
      ekvivalentlikYetdimi = true;
    } else {
      const ortganV = V_t - V_eq;
      const konsOH = (ortganV * C_titrant) / jamiHajm;
      const poh = -Math.log10(Math.max(1e-7, konsOH));
      ph = Math.min(13.0, Number((14 - poh).toFixed(2)));
      rangHex = profil.ortiqchaRang;
      holatNomi = "Ishqoriy ortiqchalik";
      ekvivalentlikYetdimi = true;
    }
  }

  // 3. PERMANGANATOMETRIYA (FeSO4 + KMnO4)
  else if (profil.id === "permanganat") {
    if (V_t < V_eq - 0.02) {
      ph = 1.0; // Kislotali H2SO4 muhiti
      rangHex = profil.boshlangichRang; // Och yashil
      holatNomi = `Fe²⁺ oksidlanmoqda (${((V_t / V_eq) * 100).toFixed(0)}%)`;
    } else if (Math.abs(V_t - V_eq) <= 0.06) {
      ph = 1.0;
      rangHex = profil.ekvivalentRang; // Och pushti
      holatNomi = "🎯 EKVIVALENTLIK NUQTASI (1-ortiqcha MnO₄⁻ tomchisi)";
      ekvivalentlikYetdimi = true;
    } else {
      ph = 1.0;
      rangHex = profil.ortiqchaRang; // Binafsha
      holatNomi = "KMnO₄ ortiqcha qo'shildi";
      ekvivalentlikYetdimi = true;
    }
  }

  // 4. TRILON B / SUVI QATTIQLIGI
  else if (profil.id === "trilon_b") {
    ph = 10.0; // Ammiakli bufer
    if (V_t < V_eq - 0.02) {
      rangHex = profil.boshlangichRang; // Sharob qizil
      holatNomi = `[Ca-ErioT] kompleksi (${((V_t / V_eq) * 100).toFixed(0)}%)`;
    } else if (Math.abs(V_t - V_eq) <= 0.05) {
      rangHex = profil.ekvivalentRang; // Zangori moviy
      holatNomi = "🎯 EKVIVALENTLIK NUQTASI (Erkin Erio T zangori rangda)";
      ekvivalentlikYetdimi = true;
    } else {
      rangHex = profil.ortiqchaRang; // To'q moviy
      holatNomi = "Trilon B to'liq bog'ladi";
      ekvivalentlikYetdimi = true;
    }
  }

  return {
    profil,
    vTitrant: V_t,
    vEkvivalent: V_eq,
    jamiHajm: Number(jamiHajm.toFixed(2)),
    ph: Number(ph.toFixed(2)),
    rangHex,
    holatNomi,
    ekvivalentlikYetdimi,
    foizBajarildi: Math.min(100, Number(((V_t / V_eq) * 100).toFixed(1))),
  };
}

/**
 * 0 ml dan 50 ml gacha to'liq Titrlash S-Egri Chizig'i (Titration Curve) nuqtalarini yasash.
 */
export function titrlashEgriChiziginiTuz(turId) {
  const nuqtalar = [];
  const qadam = 0.5; // 0.5 ml oraliqda hisoblash

  for (let v = 0; v <= 40; v += qadam) {
    const res = titrlashHolatiniHisobla(turId, v);
    nuqtalar.push({ v: Number(v.toFixed(1)), ph: res.ph });
  }

  return nuqtalar;
}

/**
 * O'quvchi kiritgan konsentratsiya javobini tekshirish.
 */
export function titrlashNatijasiniBaho(turId, vSarflangan, talabaKonsentratsiya) {
  const profil = TITRLASH_TURLARI.find((t) => t.id === turId) || TITRLASH_TURLARI[0];
  const stex = profil.stexioNisbat || 1;

  // Haqiqiy formula: C_analit = (C_titrant * stex * V_sarf) / V_analit
  const nazariyKons = Number(
    ((profil.titrantKons * stex * vSarflangan) / profil.aniqlanuvchiHajm).toFixed(4)
  );

  const kiritilgan = parseFloat(talabaKonsentratsiya) || 0;
  const farqFoiz = Math.abs(kiritilgan - nazariyKons) / Math.max(0.001, nazariyKons);
  const aniqlik = Math.max(0, Math.round((1 - farqFoiz) * 100));

  return {
    nazariyKons,
    kiritilgan,
    aniqlik,
    togri: aniqlik >= 95,
    izoh:
      aniqlik >= 95
        ? "Tabriklaymiz! Analitik titrlash hisob-kitobingiz juda yuqori aniqlikda bajarildi."
        : `Farq bor: Nazariy qiymat ${nazariyKons} M bo'lishi kerak edi (Siz kiritdingiz: ${kiritilgan} M).`,
  };
}
