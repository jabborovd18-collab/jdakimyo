// lib/fanlar.js
//
// Platformaning yangi tuzilmasi: Maktab kimyosi, Oliy kimyo,
// Milliy sertifikat (Rasch modeli) va Boshqa testlar.

export const YETTI_SINF_BOBLAR = [
  {
    bob: 1,
    nom: "Kimyo faniga kirish",
    sahifa: 1,
    mavzular: [
      { raqam: "1.1", slug: "1-1", nom: "Kimyo fani nimani o'rganadi?", sahifa: 2, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "1.2", slug: "1-2", nom: "Tadqiqotchilikka xos xususiyatlar", sahifa: 3, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "1.3", slug: "1-3", nom: "Kimyo fanini o'rganishda ilmiy tadqiqot metodlari", sahifa: 4, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "1.4", slug: "1-4", nom: "Kimyo laboratoriyasida texnika xavfsizligi qoidalari", sahifa: 9, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "1.5", slug: "1-5", nom: "Kimyo laboratoriyasida foydalaniladigan jihozlar", sahifa: 11, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 2,
    nom: "Moddaning tuzilishi",
    sahifa: 14,
    mavzular: [
      { raqam: "2.1", slug: "2-1", nom: "Moddaning tuzilishi", sahifa: 15, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "2.2", slug: "2-2", nom: "Modda holatlarining o'zgarishi", sahifa: 19, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 3,
    nom: "Kimyoviy elementlar. Oddiy va murakkab moddalar",
    sahifa: 27,
    mavzular: [
      { raqam: "3.1", slug: "3-1", nom: "Kimyoviy elementlar", sahifa: 28, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.2", slug: "3-2", nom: "Atom va molekula", sahifa: 31, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.3", slug: "3-3", nom: "Metall va metallmaslar", sahifa: 34, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.4", slug: "3-4", nom: "Davriy jadval", sahifa: 37, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.5", slug: "3-5", nom: "Murakkab moddalar", sahifa: 39, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.6", slug: "3-6", nom: "Murakkab moddalarning xossalari", sahifa: 44, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "3.7", slug: "3-7", nom: "Murakkab moddalarning olinishi", sahifa: 46, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 4,
    nom: "Moddalar va ularning xossalari",
    sahifa: 52,
    mavzular: [
      { raqam: "4.1", slug: "4-1", nom: "Moddalarning fizik xossalari", sahifa: 53, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "4.2", slug: "4-2", nom: "Metall va metallmaslarning fizik xossalari", sahifa: 59, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "4.3", slug: "4-3", nom: "Kundalik hayotda foydalaniladigan moddalar va ularning xossalari", sahifa: 62, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 5,
    nom: "Kislotalar va asoslar",
    sahifa: 75,
    mavzular: [
      { raqam: "5.1", slug: "5-1", nom: "Kislotalar", sahifa: 76, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "5.2", slug: "5-2", nom: "Asoslar", sahifa: 80, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "5.3", slug: "5-3", nom: "Indikatorlar", sahifa: 83, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "5.4", slug: "5-4", nom: "pH ko'rsatkichi", sahifa: 85, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "5.5", slug: "5-5", nom: "Neytrallanish reaksiyasi", sahifa: 88, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 6,
    nom: "Aralashmalar",
    sahifa: 94,
    mavzular: [
      { raqam: "6.1", slug: "6-1", nom: "Aralashmalar", sahifa: 95, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "6.2", slug: "6-2", nom: "Oddiy moddalar, murakkab moddalar va aralashmalarni o'zaro farqlash", sahifa: 99, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "6.3", slug: "6-3", nom: "Aralashmalarni ajratish", sahifa: 101, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "6.4", slug: "6-4", nom: "Eritmalar", sahifa: 108, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "6.5", slug: "6-5", nom: "Eruvchanlik", sahifa: 110, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 7,
    nom: "Tayanch tushunchalar",
    sahifa: 116,
    mavzular: [
      { raqam: "7.1", slug: "tayanch-tushunchalar", nom: "Tayanch tushunchalar va asosiy atamalar lug'ati", sahifa: 116, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
]

export const YETTI_SINF_MAVZULARI = YETTI_SINF_BOBLAR.flatMap((b) =>
  b.mavzular.map((m) => ({
    ...m,
    bobRaqam: b.bob,
    bobNomi: b.nom,
  }))
)

export const MAKTAB_SINFLARI = [
  {
    sinf: 7,
    nom: '7-sinf kimyosi',
    qisqa: "Boshlang'ich tushunchalar",
    tavsif: "Atom-molekulyar ta'limot, kimyoviy elementlar, oddiy va murakkab moddalar, kislotalar, asoslar va aralashmalar.",
    darslarSoni: YETTI_SINF_MAVZULARI.length,
    ikon: 'kolba',
    belgi: 'O₂ / H₂',
    boblar: YETTI_SINF_BOBLAR,
    mavzular: YETTI_SINF_MAVZULARI,
  },
  {
    sinf: 8,
    nom: '8-sinf kimyosi',
    qisqa: 'Asosiy qonuniyatlar',
    tavsif: "Davriy qonun va davriy sistema, atom tuzilishi, kimyoviy bog'lanish va modda miqdori (mol).",
    darslarSoni: 34,
    ikon: 'atom',
    belgi: 'n = m/M',
    mavzular: [
      { raqam: 1, nom: "Anorganik birikmalarning asosiy sinflari: oksidlar, asoslar, kislotalar, tuzlar", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 2, nom: "D.I. Mendeleyevning davriy qonuni va davriy sistemasi", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 3, nom: "Atom tuzilishi: yadro, proton, neytron va elektron qobiqlari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 4, nom: "Kimyoviy bog'lanish turlari: kovalent, ion va metall bog'lanish", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 5, nom: "Modda miqdori. Avogadro doimiysi va molyar hajm", davomiylik: '45 daqiqa', doskaBor: true },
    ],
  },
  {
    sinf: 9,
    nom: '9-sinf kimyosi',
    qisqa: 'Eritmalar va elementlar',
    tavsif: "Elektrolitik dissotsiatsiya nazariyasi, galogenlar, xalkogenlar va metallar umumiy xossalari.",
    darslarSoni: 34,
    ikon: 'kristall',
    belgi: 'Na⁺ + Cl⁻',
    mavzular: [
      { raqam: 1, nom: "Elektrolitik dissotsiatsiya nazariyasi asoslari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 2, nom: "Ion almashinish reaksiyalari va ularning oxirigacha borish shartlari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 3, nom: "Oksidlanish-qaytarilish reaksiyalari va elektron balans usuli", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 4, nom: "Galogenlar guruhi elementlari va ularning birikmalari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 5, nom: "Metallar umumiy xossalari va metallarning kuchlanishlar qatori", davomiylik: '45 daqiqa', doskaBor: true },
    ],
  },
  {
    sinf: 10,
    nom: '10-sinf kimyosi',
    qisqa: 'Organik kimyo',
    tavsif: "Butlerovning tuzilish nazariyasi, to'yingan va to'yinmagan uglevodorodlar, aromatik birikmalar.",
    darslarSoni: 34,
    ikon: 'chaqmoq',
    belgi: 'CₙH₂ₙ₊₂',
    mavzular: [
      { raqam: 1, nom: "Organik kimyoga kirish. Butlerovning kimyoviy tuzilish nazariyasi", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 2, nom: "To'yingan uglevodorodlar (alkanlar): tuzilishi, gomologik qatori va izomeriyasi", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 3, nom: "Alkenlar va alkadiyenlar: qo'shbog' xossalari va polimerlanish reaksiyalari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 4, nom: "Alkinlar: asetilen va uning hosilalari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 5, nom: "Aromatik uglevodorodlar (arenlar): benzol halqasi va uning xossalari", davomiylik: '45 daqiqa', doskaBor: true },
    ],
  },
  {
    sinf: 11,
    nom: '11-sinf kimyosi',
    qisqa: 'Funksional guruhlar va DTM',
    tavsif: "Spirtlar, aldegidlar, kislotalar, efirlar, uglevodlar, aminlar, oqsillar va umumlashtiruvchi DTM kursi.",
    darslarSoni: 34,
    ikon: 'kitob',
    belgi: 'R–COOH',
    mavzular: [
      { raqam: 1, nom: "Bir va ko'p atomli spirtlar: tuzilishi, olinishi va kimyoviy xossalari", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 2, nom: "Karbonil birikmalar: aldegidlar va ketonlar", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 3, nom: "Karbon kislotalar va murakkab efirlar. Yog'lar", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 4, nom: "Uglevodlar: monosaxaridlar, disaxaridlar va polisaxaridlar", davomiylik: '45 daqiqa', doskaBor: true },
      { raqam: 5, nom: "Azotli organik birikmalar: aminlar, aminokislotalar va oqsillar", davomiylik: '45 daqiqa', doskaBor: true },
    ],
  },
]

export function sinfTop(slug) {
  if (!slug) return null
  const raqam = parseInt(String(slug).replace(/\D/g, ''), 10)
  return MAKTAB_SINFLARI.find((s) => s.sinf === raqam) || null
}

export function sinfHavolasi(sinf) {
  const raqam = typeof sinf === 'object' ? sinf.sinf : sinf
  return `/maktabkimyo/${raqam}sinf`
}

export function mavzuHavolasi(sinf, mavzu) {
  const sinfRaqam = typeof sinf === 'object' ? sinf.sinf : parseInt(String(sinf).replace(/\D/g, ''), 10)
  const mavzuSlug = typeof mavzu === 'object' ? mavzu.slug : String(mavzu).replace(/\./g, '-')
  return `/maktabkimyo/${sinfRaqam}sinf/${mavzuSlug}`
}

export function mavzuTop(sinfSlug, mavzuSlug) {
  const sinf = sinfTop(sinfSlug)
  if (!sinf || !mavzuSlug) return null

  const slugNorm = String(mavzuSlug).trim().toLowerCase()
  const raqamNorm = slugNorm.replace(/-/g, '.')

  const index = (sinf.mavzular || []).findIndex(
    (m) =>
      m.slug === slugNorm ||
      String(m.raqam) === slugNorm ||
      String(m.raqam) === raqamNorm ||
      (m.slug && m.slug.replace(/-/g, '.') === raqamNorm)
  )

  if (index === -1) return null

  const mavzu = sinf.mavzular[index]
  const oldingi = index > 0 ? sinf.mavzular[index - 1] : null
  const keyingi = index < sinf.mavzular.length - 1 ? sinf.mavzular[index + 1] : null

  const bob = (sinf.boblar || []).find((b) => b.bob === mavzu.bobRaqam) || null

  return {
    sinf,
    bob,
    mavzu,
    oldingi,
    keyingi,
    indeks: index + 1,
    jami: sinf.mavzular.length,
  }
}

export const OLIY_KIMYO = [
  {
    slug: 'anorganik-kimyo',
    nom: 'Anorganik kimyo',
    qisqa: 'Elementlar kimyosi',
    holat: 'ochiq',
    belgi: 'Fe₂O₃',
    tavsif: "Davriy qonun, s-, p-, d-, f-elementlar, qattiq jism kimyosi va kimyoviy bog'lanish.",
    kirish: "Anorganik kimyoning fundamental qonunlari, elementlar davriy xossalari va zamonaviy materiallar tuzilishi.",
    videoDarslar: 24,
    bolimlar: [
      { href: '/fan/anorganik-kimyo', ikon: 'atom', nom: 'Video maʼruzalar', tavsif: "24 ta chuqurlashtirilgan video dars", asosiy: true },
      { href: '/doska', ikon: 'doska', nom: 'Elektron doska', tavsif: "Sinf va auditoriyada namoyish qilish vositalari", asosiy: false },
    ],
    mavzular: [
      { nom: 'Elementlar davriy xossalari va samarali yadro zaryadi', davomiylik: '38 daqiqa' },
      { nom: "d-elementlar koordinatsion kimyosi va rang paydo bo'lish mexanizmi", davomiylik: '42 daqiqa' },
      { nom: "Qattiq jismlar tuzilishi va yarimo'tkazgichlar kimyosi", davomiylik: '50 daqiqa' },
    ],
  },
  {
    slug: 'organik-kimyo',
    nom: 'Organik kimyo',
    qisqa: 'Reaksiya mexanizmlari',
    holat: 'ochiq',
    belgi: 'C₆H₆',
    tavsif: "Nukleofil/elektrofil o'rinbosish, stereokimyo, konformatsiya va retrosintez.",
    kirish: "Organik birikmalar sintezi, reaksiya mexanizmlari va zamonaviy dori moddalari kimyosi.",
    videoDarslar: 30,
    bolimlar: [
      { href: '/fan/organik-kimyo', ikon: 'chaqmoq', nom: 'Video maʼruzalar', tavsif: "30 ta mexanizmlar kursi", asosiy: true },
      { href: '/doska', ikon: 'doska', nom: 'Elektron doska', tavsif: "Reaksiya mexanizmlarini doskada tahlil qilish", asosiy: false },
    ],
    mavzular: [
      { nom: "Sn1 va Sn2 nukleofil o'rinbosish mexanizmlari qiyosiy tahlili", davomiylik: '44 daqiqa' },
      { nom: 'E1 va E2 ajralish reaksiyalari va Zaytsev qoidasi', davomiylik: '36 daqiqa' },
      { nom: "Aromatik elektrofil o'rinbosish va yo'naltiruvchilar effekti", davomiylik: '48 daqiqa' },
    ],
  },
  {
    slug: 'analitik-kimyo',
    nom: 'Analitik kimyo',
    qisqa: 'Asboblar tahlili',
    holat: 'ochiq',
    belgi: 'pH = pKₐ',
    tavsif: 'Xromatografiya, spektroskopiya (IQ, NMR, UV-Vis), elektroanalitika va titrimetriya.',
    kirish: 'Miqdoriy va sifat tahlili, zamonaviy fizik-kimyoviy asboblar va spektrlarni talqin qilish.',
    videoDarslar: 20,
    bolimlar: [
      { href: '/fan/analitik-kimyo', ikon: 'mikroskop', nom: 'Spektrlar va tahlil', tavsif: "20 ta asbobiy tahlil maʼruzasi", asosiy: true },
      { href: '/doska', ikon: 'doska', nom: 'Elektron doska', tavsif: "Spektrlarni interaktiv tahlil qilish", asosiy: false },
    ],
    mavzular: [
      { nom: 'IQ-spektroskopiya asoslari va funksional guruhlarni aniqlash', davomiylik: '46 daqiqa' },
      { nom: '¹H va ¹³C NMR spektroskopiyasi signallari tahlili', davomiylik: '55 daqiqa' },
      { nom: 'Yuqori samarali suyuqlik xromatografiyasi (HPLC) asoslari', davomiylik: '40 daqiqa' },
    ],
  },
  {
    slug: 'fizikaviy-kimyo',
    nom: 'Fizikaviy kimyo',
    qisqa: 'Termodinamika va kinetika',
    holat: 'ochiq',
    belgi: 'ΔG = ΔH − TΔS',
    tavsif: 'Kimyoviy termodinamika, kinetika, elektrokimyoviy jarayonlar va statistik mexanika.',
    kirish: 'Kimyoviy jarayonlarning harakatlantiruvchi kuchlari, muvozanat va tezlik qonuniyatlari.',
    videoDarslar: 22,
    bolimlar: [
      { href: '/fan/fizikaviy-kimyo', ikon: 'kristall', nom: 'Termodinamika kursi', tavsif: "22 ta nazariy va hisoblash darsi", asosiy: true },
      { href: '/doska', ikon: 'doska', nom: 'Elektron doska', tavsif: "Izotermalar va kinetik grafiklar", asosiy: false },
    ],
    mavzular: [
      { nom: 'Termodinamikaning 1- va 2-qonunlari, Gibbs erkin energiyasi', davomiylik: '52 daqiqa' },
      { nom: 'Reaksiya tezligi va Arrhenius tenglamasi, faollanish energiyasi', davomiylik: '45 daqiqa' },
      { nom: 'Galvanik elementlar, Nernst tenglamasi va korroziya', davomiylik: '40 daqiqa' },
    ],
  },
  {
    slug: 'koordinatsion-kimyo',
    nom: 'Koordinatsion kimyo',
    qisqa: 'Kompleks birikmalar',
    holat: 'tayyorlanmoqda',
    belgi: '[Co(NH₃)₆]³⁺',
    tavsif: 'Kristall va ligand maydon nazariyalari, spektrokimyoviy qator va izomeriya.',
    kirish: 'Kompleks birikmalar fazoviy tuzilishi, magnetizmi va spektroskopiyasi.',
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [],
  },
  {
    slug: 'biokimyo',
    nom: 'Biokimyo',
    qisqa: 'Tirik tizimlar kimyosi',
    holat: 'tayyorlanmoqda',
    belgi: 'ATP',
    tavsif: 'Oqsillar strukturasi, fermentlar kinetikasi (Mixaelis-Menten) va Krebs sikli.',
    kirish: 'Hujayradagi kimyoviy jarayonlar, metabolizm va fermentativ reaksiyalar kinetikasi.',
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [],
  },
]

export const MILLIY_SERTIFIKAT_TIZIMI = [
  {
    id: 'rasch-diagnostika',
    nom: 'Rasch Diagnostik Testi',
    qisqa: 'Ilmiy baholash',
    tavsif: 'Item Response Theory (IRT) va Rasch logit modeli asosida har bir savolning qiyinligi va bilimingiz darajasi (theta) aniqlanadi.',
    savollarSoni: 30,
    vaqt: '60 daqiqa',
    model: 'Rasch Dichotomous Model',
    ikon: 'sertifikat',
  },
  {
    id: 'milliy-sertifikat-variant',
    nom: 'Milliy Sertifikatga Tayyorgarlik Sinovi',
    qisqa: 'Tayyorgarlik',
    tavsif: 'Milliy sertifikat formatidagi tayyorgarlik sinovi: yopiq va ochiq savollar.',
    savollarSoni: 45,
    vaqt: '150 daqiqa',
    model: 'Rasch Dichotomous Model',
    ikon: 'medal',
  },
  {
    id: 'attestatsiya-sinov',
    nom: "O'qituvchilar Attestatsiya Sinovi",
    qisqa: 'Toifa va ustama',
    tavsif: "Mutaxassis, 2-toifa, 1-toifa va oliy toifa uchun pedagogik mahorat hamda chuqurlashtirilgan kimyo savollari.",
    savollarSoni: 50,
    vaqt: '120 daqiqa',
    model: 'Attestatsiya Mezoni',
    ikon: 'ustoz',
  },
]

export const BOSHQA_TESTLAR = [
  {
    id: 'mavzuli-testlar',
    nom: 'Mavzulashtirilgan Testlar',
    tavsif: "Har bir kimyoviy mavzu bo'yicha 10-20 talik amaliy testlar to'plami.",
    soni: '150+ mavzu',
    ikon: 'quiz',
  },
  {
    id: 'dtm-blok',
    nom: 'DTM Blok Testlari',
    tavsif: "Majburiy va asosiy kimyo bloklari bo'yicha 30 talik saralash imtihonlari.",
    soni: '25 ta variant',
    ikon: 'kitob',
  },
  {
    id: 'tezkor-blits',
    nom: 'Tezkor Blits Sinov',
    tavsif: 'Vaqtga qarshi 1 daqiqada 5 ta savolga javob berish va XP ishlash.',
    soni: 'Cheksiz savol',
    ikon: 'chaqmoq',
  },
]

// Eski moslik uchun FANLAR eksporti:
export const FANLAR = OLIY_KIMYO
export const FAN_ILDIZ = '/fan'

export function fanHavolasi(fan) {
  return `${FAN_ILDIZ}/${fan.slug}`
}

export function fanTop(slug) {
  return OLIY_KIMYO.find((f) => f.slug === slug) || null
}

export function ochiqFanlar() {
  return OLIY_KIMYO.filter((f) => f.holat === 'ochiq')
}

export function ochiqFanlarSoni() {
  return ochiqFanlar().length
}
