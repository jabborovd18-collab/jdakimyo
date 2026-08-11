// DTM va Kimyo Olimpiadalari uchun Sifat Analizi topshiriqlari dvigateli.
//
// NEGA `lib/` DA, 3D papkasida emas: javoblarni SERVER tekshiradi.
// Ilgari bu modul faqat client'da edi va `javobniTekshir` o'zi XP hamda
// tanga hisoblab, ekranga "+200 XP va +60 🪙" deb yozardi — lekin
// hech qayerga yubormasdi. Ya'ni mukofot va'da qilinib, berilmasdi.
//
// Serverga ko'chirilishi ikkita narsani hal qiladi:
//   1. Mukofot haqiqatan beriladi (`/api/laboratoriya/sifat-analiz`)
//   2. Ballni client hisoblamaydi — aks holda brauzer konsolidan
//      istalgan natijani yuborib tanga olish mumkin bo'lardi. Bu
//      loyihaning `lib/laboratoriya.js` da yozilgan asosiy qoidasi.
//
// O'quvchiga markalanmagan noma'lum $X, Y, Z$ tuz eritmalar beriladi.
// O'quvchi probirka va reagentlar quyib, kation hamda anionlarni aniqlaydi.

export const KATIONLAR = [
  { kalit: "Cu²⁺", nom: "Mis(II) kationi", belgi: "Och ko'k jelesimon cho'kma (NaOH bilan)" },
  { kalit: "Fe³⁺", nom: "Temir(III) kationi", belgi: "Qizil-jigarrang cho'kma (NaOH bilan)" },
  { kalit: "Fe²⁺", nom: "Temir(II) kationi", belgi: "Yashilsimon cho'kma (NaOH bilan)" },
  { kalit: "Ag⁺", nom: "Kumush kationi", belgi: "Oq cho'kma (HCl bilan, yorug'likda qorayadi)" },
  { kalit: "Ba²⁺", nom: "Bariy kationi", belgi: "Oq cho'kma (H₂SO₄ bilan, kislotada erimaydi)" },
  { kalit: "NH₄⁺", nom: "Ammoniy kationi", belgi: "O'tkir ammiak hidi (NaOH va isitilganda)" },
  { kalit: "Pb²⁺", nom: "Qo'rg'oshin(II) kationi", belgi: "Sariq yaltiroq cho'kma (KI bilan)" },
];

export const ANIONLAR = [
  { kalit: "SO₄²⁻", nom: "Sulfat anioni", belgi: "Oq cho'kma (BaCl₂ bilan)" },
  { kalit: "Cl⁻", nom: "Xlorid anioni", belgi: "Oq suzmasimon cho'kma (AgNO₃ bilan)" },
  { kalit: "CO₃²⁻", nom: "Karbonat anioni", belgi: "Shiddatli CO₂ gaz ajralishi (kislota bilan)" },
  { kalit: "I⁻", nom: "Yodid anioni", belgi: "Sariq cho'kma (AgNO₃ bilan)" },
  { kalit: "PO₄³⁻", nom: "Fosfat anioni", belgi: "Sariq cho'kma (AgNO₃ bilan)" },
  { kalit: "NO₃⁻", nom: "Nitrat anioni", belgi: "Jigarrang halqa testi (FeSO₄ va H₂SO₄)" },
];

export const MISOLLAR = [
  {
    id: "topshiriq-1",
    nom: "1-Topshiriq: Sifat Analiz Boshlang'ich",
    qiyinlik: "Oson",
    xp: 50,
    tanga: 15,
    tuzlar: [
      { idish: "X", formula: "CuSO₄", kation: "Cu²⁺", anion: "SO₄²⁻", tavsif: "Och ko'k rangli eritma" },
      { idish: "Y", formula: "FeCl₃", kation: "Fe³⁺", anion: "Cl⁻", tavsif: "Sarg'ish-jigarrang eritma" },
      { idish: "Z", formula: "AgNO₃", kation: "Ag⁺", anion: "NO₃⁻", tavsif: "Rangsiz eritma" },
    ],
  },
  {
    id: "topshiriq-2",
    nom: "2-Topshiriq: DTM Darajasidagi Sifat Analiz",
    qiyinlik: "O'rta",
    xp: 100,
    tanga: 30,
    tuzlar: [
      { idish: "X", formula: "BaCl₂", kation: "Ba²⁺", anion: "Cl⁻", tavsif: "Rangsiz eritma" },
      { idish: "Y", formula: "Na₂CO₃", kation: "Na⁺", anion: "CO₃²⁻", tavsif: "Rangsiz eritma" },
      { idish: "Z", formula: "NH₄Cl", kation: "NH₄⁺", anion: "Cl⁻", tavsif: "Rangsiz eritma" },
    ],
  },
  {
    id: "topshiriq-3",
    nom: "3-Topshiriq: Kimyo Olimpiadasi Ekspert Analiz",
    qiyinlik: "Qiyin",
    xp: 200,
    tanga: 60,
    tuzlar: [
      { idish: "X", formula: "Pb(NO₃)₂", kation: "Pb²⁺", anion: "NO₃⁻", tavsif: "Rangsiz eritma" },
      { idish: "Y", formula: "FeSO₄", kation: "Fe²⁺", anion: "SO₄²⁻", tavsif: "Och yashil eritma" },
      { idish: "Z", formula: "KI", kation: "K⁺", anion: "I⁻", tavsif: "Rangsiz eritma" },
    ],
  },
];

export function yangiTopshiriqYarat(id = "topshiriq-1") {
  const namuna = MISOLLAR.find((m) => m.id === id) || MISOLLAR[0];
  return {
    ...namuna,
    boshlanganVaqt: Date.now(),
  };
}

/**
 * Topshiriqni JAVOBLARSIZ beradi — client shu ko'rinishni oladi.
 *
 * `kation` va `anion` olib tashlanadi: ular client bo'lagiga tushsa,
 * o'quvchi javobni manbadan o'qib olardi va topshiriqning ma'nosi
 * qolmasdi.
 */
export function topshiriqniOchir(topshiriq) {
  if (!topshiriq) return null;
  return {
    id: topshiriq.id,
    nom: topshiriq.nom,
    qiyinlik: topshiriq.qiyinlik,
    xp: topshiriq.xp,
    tanga: topshiriq.tanga,
    tuzlar: topshiriq.tuzlar.map((t) => ({
      idish: t.idish,
      tavsif: t.tavsif,
    })),
  };
}

/** Ochiq (javobsiz) ro'yxat — GET uchun */
export function ochiqRoyxat() {
  return MISOLLAR.map(topshiriqniOchir);
}

export function javobniTekshir(topshiriq, javoblar) {
  // javoblar: { X: { kation: 'Cu²⁺', anion: 'SO₄²⁻' }, Y: ... }
  let togriCount = 0;
  const natijalar = {};

  topshiriq.tuzlar.forEach((tuz) => {
    const k = tuz.idish;
    const berilgan = javoblar[k] || {};
    const kationTogri = berilgan.kation === tuz.kation;
    const anionTogri = berilgan.anion === tuz.anion;

    if (kationTogri) togriCount++;
    if (anionTogri) togriCount++;

    natijalar[k] = {
      formula: tuz.formula,
      kationTogri,
      anionTogri,
      haqiqiyKation: tuz.kation,
      haqiqiyAnion: tuz.anion,
    };
  });

  const jamiSavollar = topshiriq.tuzlar.length * 2;
  const foiz = Math.round((togriCount / jamiSavollar) * 100);
  const muvaffaqiyat = foiz >= 80;

  return {
    muvaffaqiyat,
    foiz,
    togriCount,
    jamiSavollar,
    olinganXP: muvaffaqiyat ? topshiriq.xp : Math.round((topshiriq.xp * foiz) / 100),
    olinganTanga: muvaffaqiyat ? topshiriq.tanga : 0,
    natijalar,
  };
}
