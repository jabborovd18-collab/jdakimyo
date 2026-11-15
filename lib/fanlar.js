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

export const SAKKIZ_SINF_BOBLAR = [
  {
    bob: 1,
    nom: "7-sinf kimyo kursining asosiy tushunchalarini takrorlash",
    sahifa: 5,
    mavzular: [
      { raqam: "1-§", slug: "1", nom: "Dastlabki kimyoviy tushuncha va qonunlar", sahifa: 5, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "2-§", slug: "2", nom: "Noorganik birikmalarning asosiy sinflari", sahifa: 10, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 2,
    nom: "Davriy qonun va elementlar davriy sistemasi. Atom tuzilishi",
    sahifa: 17,
    mavzular: [
      { raqam: "3-§", slug: "3", nom: "Kimyoviy elementlarning dastlabki toifalanishi", sahifa: 17, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "4-§", slug: "4", nom: "Kimyoviy elementlarning tabiiy oilalari", sahifa: 21, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "5-§", slug: "5", nom: "Kimyoviy elementlarning davriy qonuni", sahifa: 25, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "6-§", slug: "6", nom: "Kimyoviy elementlar davriy sistemasi", sahifa: 30, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "7-§", slug: "7", nom: "Atom yadrosi tarkibi", sahifa: 32, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "8-§", slug: "8", nom: "Izotoplar. Izobarlar", sahifa: 36, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "9-§", slug: "9", nom: "Atom elektron qavatlarining tuzilishi", sahifa: 39, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "10-§", slug: "10", nom: "Energetik pog'onachalar", sahifa: 42, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "11-§", slug: "11", nom: "Kichik davr elementlarining atom tuzilishi", sahifa: 46, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "12-§", slug: "12", nom: "Katta davr elementlarining atom tuzilishi", sahifa: 49, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "13-§", slug: "13", nom: "Elementlarning davriy sistemadagi o'rni va atom tuzilishiga qarab tavsiflash. Davriy qonunning ahamiyati", sahifa: 51, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 3,
    nom: "Kimyoviy bog'lanishlar",
    sahifa: 63,
    mavzular: [
      { raqam: "14-§", slug: "14", nom: "Kimyoviy elementlarning nisbiy elektromanfiyligi", sahifa: 64, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "15-§", slug: "15", nom: "Kimyoviy bog'lanish turlari. Qutbli va qutbsiz kovalent bog'lanish", sahifa: 66, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "16-§", slug: "16", nom: "Ionli bog'lanish", sahifa: 71, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "17-§", slug: "17", nom: "Kristall panjaralar", sahifa: 74, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "18-§", slug: "18", nom: "Elementlarning oksidlanish darajasi", sahifa: 76, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "19-§", slug: "19", nom: "Oksidlanish-qaytarilish reaksiyalari", sahifa: 80, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "20-§", slug: "20", nom: "Oksidlanish-qaytarilish reaksiyalari tenglamalarini tuzish", sahifa: 83, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 4,
    nom: "Metallmaslar",
    sahifa: 89,
    mavzular: [
      { raqam: "21-§", slug: "21", nom: "Metallmaslarning umumiy xossalari", sahifa: 89, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "22-§", slug: "22", nom: "Galogenlarning davriy sistemadagi o'rni. Atom tuzilishi", sahifa: 92, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "23-§", slug: "23", nom: "Xlor", sahifa: 96, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "24-§", slug: "24", nom: "Vodorod xlorid", sahifa: 100, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "25-§", slug: "25", nom: "Avogadro qonuni. Molyar hajm", sahifa: 103, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "26-§", slug: "26", nom: "Ekvivalent qonuni", sahifa: 111, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "27-§", slug: "27", nom: "Xlorid kislota", sahifa: 116, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "28-§", slug: "28", nom: "Ftor, brom, yod", sahifa: 121, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 5,
    nom: "Oltinchi guruh bosh guruhchasi elementlariga umumiy tavsif",
    sahifa: 130,
    mavzular: [
      { raqam: "29-§", slug: "29", nom: "Kislorod guruhchasi elementlari", sahifa: 130, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "30-§", slug: "30", nom: "Oltingugurtning vodorodli birikmalari", sahifa: 134, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "31-§", slug: "31", nom: "Oltingugurtning kislorodli birikmalari", sahifa: 136, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "32-§", slug: "32", nom: "Sulfat kislota", sahifa: 138, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "33-§", slug: "33", nom: "Kimyoviy reaksiyalarning tezligi", sahifa: 141, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "34-§", slug: "34", nom: "Kimyoviy muvozanat", sahifa: 144, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "35-§", slug: "35", nom: "Sanoatda sulfat kislota ishlab chiqarish", sahifa: 147, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 6,
    nom: "Azot guruhchasi",
    sahifa: 156,
    mavzular: [
      { raqam: "36-§", slug: "36", nom: "Azot", sahifa: 157, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "37-§", slug: "37", nom: "Azotning vodorodli birikmalari", sahifa: 159, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "38-§", slug: "38", nom: "Azotning kislorodli birikmalari", sahifa: 164, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "39-§", slug: "39", nom: "Nitrat kislota", sahifa: 165, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "40-§", slug: "40", nom: "Fosfor", sahifa: 174, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "41-§", slug: "41", nom: "Fosforning kislorodli birikmalari", sahifa: 177, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "42-§", slug: "42", nom: "Mineral o'g'itlar", sahifa: 185, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "43-§", slug: "43", nom: "Eng muhim asosiy mineral o'g'itlar", sahifa: 189, davomiylik: "45 daqiqa", doskaBor: true },
      { raqam: "44-§", slug: "44", nom: "Biogen elementlar va ularning tirik organizmlardagi ahamiyati", sahifa: 193, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
  {
    bob: 7,
    nom: "Laboratoriya mashg'ulotlari",
    sahifa: 200,
    mavzular: [
      { raqam: "Lab", slug: "laboratoriya-ishlari", nom: "1–10-laboratoriya mashg'ulotlari va sifat reaksiyalari", sahifa: 200, davomiylik: "45 daqiqa", doskaBor: true },
    ],
  },
]

export const SAKKIZ_SINF_MAVZULARI = SAKKIZ_SINF_BOBLAR.flatMap((b) =>
  b.mavzular.map((m) => ({
    ...m,
    bobRaqam: b.bob,
    bobNomi: b.nom,
  }))
)

export const TAYYOR_MAVZULAR_ROYHATI = {
  7: new Set(YETTI_SINF_MAVZULARI.map((m) => m.slug)),
  8: new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'laboratoriya-ishlari']),
}

export function mavzuTayyormi(sinfRaqam, slug) {
  return Boolean(TAYYOR_MAVZULAR_ROYHATI[sinfRaqam]?.has(slug))
}

export const MAKTAB_SINFLARI = [
  {
    sinf: 7,
    ochiq: true,
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
    ochiq: true,
    nom: '8-sinf kimyosi',
    qisqa: 'Asosiy qonuniyatlar',
    tavsif: "7-sinf asoslarini takrorlash, Davriy qonun, atom tuzilishi, kimyoviy bog'lanish, OQR, galogenlar, oltingugurt, azot, fosfor va mineral o'g'itlar.",
    darslarSoni: SAKKIZ_SINF_MAVZULARI.length,
    ikon: 'atom',
    belgi: 'n = m/M',
    boblar: SAKKIZ_SINF_BOBLAR,
    mavzular: SAKKIZ_SINF_MAVZULARI,
  },
  {
    sinf: 9,
    ochiq: false,
    nom: '9-sinf kimyosi',
    qisqa: 'Eritmalar va elementlar',
    tavsif: "Elektrolitik dissotsiatsiya nazariyasi, galogenlar, xalkogenlar va metallar umumiy xossalari.",
    darslarSoni: 0,
    ikon: 'kristall',
    belgi: 'Na⁺ + Cl⁻',
    mavzular: [
      { raqam: 1, nom: "Elektrolitik dissotsiatsiya nazariyasi asoslari" },
      { raqam: 2, nom: "Ion almashinish reaksiyalari va ularning oxirigacha borish shartlari" },
      { raqam: 3, nom: "Oksidlanish-qaytarilish reaksiyalari va elektron balans usuli" },
      { raqam: 4, nom: "Galogenlar guruhi elementlari va ularning birikmalari" },
      { raqam: 5, nom: "Metallar umumiy xossalari va metallarning kuchlanishlar qatori" },
    ],
  },
  {
    sinf: 10,
    ochiq: false,
    nom: '10-sinf kimyosi',
    qisqa: 'Organik kimyo',
    tavsif: "Butlerovning tuzilish nazariyasi, to'yingan va to'yinmagan uglevodorodlar, aromatik birikmalar.",
    darslarSoni: 0,
    ikon: 'chaqmoq',
    belgi: 'CₙH₂ₙ₊₂',
    mavzular: [
      { raqam: 1, nom: "Organik kimyoga kirish. Butlerovning kimyoviy tuzilish nazariyasi" },
      { raqam: 2, nom: "To'yingan uglevodorodlar (alkanlar): tuzilishi, gomologik qatori va izomeriyasi" },
      { raqam: 3, nom: "Alkenlar va alkadiyenlar: qo'shbog' xossalari va polimerlanish reaksiyalari" },
      { raqam: 4, nom: "Alkinlar: asetilen va uning hosilalari" },
      { raqam: 5, nom: "Aromatik uglevodorodlar (arenlar): benzol halqasi va uning xossalari" },
    ],
  },
  {
    sinf: 11,
    ochiq: false,
    nom: '11-sinf kimyosi',
    qisqa: 'Funksional guruhlar va DTM',
    tavsif: "Spirtlar, aldegidlar, kislotalar, efirlar, uglevodlar, aminlar, oqsillar va umumlashtiruvchi DTM kursi.",
    darslarSoni: 0,
    ikon: 'kitob',
    belgi: 'R–COOH',
    mavzular: [
      { raqam: 1, nom: "Bir va ko'p atomli spirtlar: tuzilishi, olinishi va kimyoviy xossalari" },
      { raqam: 2, nom: "Karbonil birikmalar: aldegidlar va ketonlar" },
      { raqam: 3, nom: "Karbon kislotalar va murakkab efirlar. Yog'lar" },
      { raqam: 4, nom: "Uglevodlar: monosaxaridlar, disaxaridlar va polisaxaridlar" },
      { raqam: 5, nom: "Azotli organik birikmalar: aminlar, aminokislotalar va oqsillar" },
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
    slug: 'umumiy-kimyo',
    nom: 'Umumiy kimyo',
    qisqa: 'Fundamental qonuniyatlar',
    holat: 'tez_kunda',
    ikon: 'atom',
    belgi: 'PV = nRT',
    tavsif: "Atom-molekulyar ta'limot, stexiometriya, gaz qonunlari, eritmalar konsentratsiyasi va kislota-asos muvozanati.",
    kirish: "Universitet kimyo kursining poydevori: modda miqdori, gaz qonunlari, kimyoviy muvozanat va eritmalar nazariyasi.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Ideal va real gaz qonunlari, Van-der-Vaals tenglamasi" },
      { nom: "Kolligativ xossalar: Raoult va Vant-Goff qonunlari" },
      { nom: "Brensted-Louri va Lyuis kislota-asos nazariyalari" },
    ],
  },
  {
    slug: 'anorganik-kimyo',
    nom: 'Anorganik kimyo',
    qisqa: 'Elementlar kimyosi',
    holat: 'tez_kunda',
    ikon: 'kristall',
    belgi: 'Fe₂O₃',
    tavsif: "Davriy qonun, s-, p-, d-, f-elementlar kimyosi, qattiq jism tuzilishi va kimyoviy bog'lanish.",
    kirish: "Anorganik kimyoning fundamental qonunlari, elementlar davriy xossalari va zamonaviy materiallar tuzilishi.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Elementlar davriy xossalari va samarali yadro zaryadi (Slater qoidasi)" },
      { nom: "s-, p-, d- va f-elementlar guruhlari qiyosiy tavsifi" },
      { nom: "Qattiq jismlar tuzilishi va nuqsonlar kimyosi" },
    ],
  },
  {
    slug: 'organik-kimyo',
    nom: 'Organik kimyo',
    qisqa: 'Reaksiya mexanizmlari va sintez',
    holat: 'tez_kunda',
    ikon: 'chaqmoq',
    belgi: 'C₆H₆',
    tavsif: "Nukleofil va elektrofil o'rinbosish (SN1, SN2, SEAr), ajralish (E1, E2), stereokimyo va retrosintez.",
    kirish: "Organik birikmalar fazoviy tuzilishi, reaksiya mexanizmlari va ko'p bosqichli organik sintez.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "SN1 va SN2 nukleofil o'rinbosish mexanizmlari qiyosiy tahlili" },
      { nom: "E1 va E2 ajralish reaksiyalari, Zaytsev va Gofman qoidalari" },
      { nom: "Stereokimyo: R/S konfiguratsiya, enantiomerlar va diastereomerlar" },
    ],
  },
  {
    slug: 'analitik-kimyo',
    nom: 'Analitik kimyo',
    qisqa: 'Sifat va asbobiy tahlil',
    holat: 'tez_kunda',
    ikon: 'mikroskop',
    belgi: 'pH = pKₐ',
    tavsif: "Gravimetriya, titrimetriya, xromatografiya (HPLC, GC) va spektroskopik tahlil usullari (IQ, NMR, UV-Vis).",
    kirish: "Miqdoriy va sifat tahlili, zamonaviy fizik-kimyoviy asboblar va spektrlarni talqin qilish.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Kislota-asosli, kompleksometrik va oksidlovchi-qaytaruvchi titrlash" },
      { nom: "IQ, UV-Vis hamda ¹H va ¹³C NMR spektroskopiyasi signallari tahlili" },
      { nom: "Yuqori samarali suyuqlik va gaz xromatografiyasi (HPLC, GC-MS)" },
    ],
  },
  {
    slug: 'fizikaviy-kimyo',
    nom: 'Fizikaviy kimyo',
    qisqa: 'Termodinamika va kinetika',
    holat: 'tez_kunda',
    ikon: 'harorat',
    belgi: 'ΔG = ΔH − TΔS',
    tavsif: "Kimyoviy termodinamika qonunlari, fazalar muvozanati, kimyoviy kinetika, kataliz va statistik mexanika.",
    kirish: "Kimyoviy jarayonlarning harakatlantiruvchi kuchlari, muvozanat va tezlik qonuniyatlari.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Termodinamikaning 1-, 2- va 3-qonunlari, Gibbs va Gelmgols energiyalari" },
      { nom: "Fazalar qoidasi, holat diagrammalari va Klauzius-Klapeyron tenglamasi" },
      { nom: "Murakkab reaksiyalar kinetikasi, Arrhenius tenglamasi va kataliz" },
    ],
  },
  {
    slug: 'kolloid-kimyo',
    nom: 'Kolloid va sirt hodisalari kimyosi',
    qisqa: 'Dispers tizimlar va adsorbsiya',
    holat: 'tez_kunda',
    ikon: 'tomchi',
    belgi: 'ζ-potensial',
    tavsif: "Sirt taranglik, Lengmyur va BET adsorbsiya izotermalari, zollar, emulsiyalar va koagulyatsiya.",
    kirish: "Fazalararo sirt hodisalari, kolloid eritmalar barqarorligi va nanotizimlar fizika-kimyosi.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Sirt taranglik, Gibbs va Lengmyur adsorbsiya izotermalari" },
      { nom: "Qo'sh elektr qavat tuzilishi, elektrokinetik (zeta) potensial" },
      { nom: "DLVO nazariyasi, koagulyatsiya va sirt faol moddalar (SFM)" },
    ],
  },
  {
    slug: 'polimerlar-kimyosi',
    nom: 'Yuqori molekulyar birikmalar kimyosi',
    qisqa: 'Polimerlar va makromolekulalar',
    holat: 'tez_kunda',
    ikon: 'tolqin',
    belgi: '(–CH₂–CH₂–)ₙ',
    tavsif: "Radikal va ionli polimerlanish, polikondensatlanish, sopolimerlanish va polimer eritmalari xossalari.",
    kirish: "Makromolekulalar sintezi, molekulyar-massa taqsimoti va zamonaviy polimer materiallar.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Zanjirli polimerlanish va bosqichli polikondensatlanish kinetikasi" },
      { nom: "O'rtacha sonli va o'rtacha og'irlik molekulyar massa, polidisperslik" },
      { nom: "Amorf va kristall polimerlarning termomexanik egri chiziqlari" },
    ],
  },
  {
    slug: 'biokimyo',
    nom: 'Biokimyo va bioanorganik kimyo',
    qisqa: 'Tirik tizimlar kimyosi',
    holat: 'tez_kunda',
    ikon: 'yadro',
    belgi: 'ATP',
    tavsif: "Oqsillar strukturasi, fermentlar kinetikasi (Mixaelis-Menten), nuklein kislotalar va metabolik sikllar.",
    kirish: "Hujayradagi kimyoviy jarayonlar, bioenergetika, metallofermentlar va molekulyar biologiya asoslari.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Oqsillarning 1-, 2-, 3- va 4-tartibli tuzilishi hamda denaturatsiya" },
      { nom: "Fermentativ kataliz, Mixaelis-Menten va Laynuiver-Berk tenglamalari" },
      { nom: "Glikoliz, Krebs sikli va oksidlovchi fosforlanish" },
    ],
  },
  {
    slug: 'kvant-kimyosi',
    nom: 'Kvant kimyosi va molekula tuzilishi',
    qisqa: 'Molekulyar orbitallar nazariyasi',
    holat: 'tez_kunda',
    ikon: 'nurlar',
    belgi: 'ĤΨ = EΨ',
    tavsif: "Shredinger tenglamasi, MO LKAO usuli, Hyukkel yaqinlashuvi, simmetriya guruhlari va orbital o'zaro ta'sirlar.",
    kirish: "Atom va molekulalarning elektron tuzilishini kvant mexanikasi qonunlari asosida tushuntirish.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Kvant mexanikasi postulatlari va vodorodsimon atomlar to'lqin funksiyasi" },
      { nom: "Molekulyar orbitallar (MO LKAO) nazariyasi va bog' tartibi" },
      { nom: "Konjugirlangan π-tizimlar uchun Hyukkel usuli va Vudvord-Gofman qoidalari" },
    ],
  },
  {
    slug: 'koordinatsion-kimyo',
    nom: 'Koordinatsion birikmalar kimyosi',
    qisqa: 'Kompleks birikmalar',
    holat: 'tez_kunda',
    ikon: 'olmos',
    belgi: '[Co(NH₃)₆]³⁺',
    tavsif: "Verner nazariyasi, kristall va ligand maydon nazariyalari, spektrokimyoviy qator va kompleks izomeriyasi.",
    kirish: "Kompleks birikmalar fazoviy tuzilishi, magnit xossalari, elektron spektrlari va barqarorligi.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Kristall maydon nazariyasi: oktaedrik va tetraedrik ajralish energiyasi (Δ)" },
      { nom: "Yuqori va past spinli komplekslar, Yan-Teller effekti" },
      { nom: "Komplekslarda ligand almashinish reaksiyalari va trans-ta'sir" },
    ],
  },
  {
    slug: 'elektrokimyo',
    nom: 'Elektrokimyo',
    qisqa: 'Elektrod jarayonlari va tok manbalari',
    holat: 'tez_kunda',
    ikon: 'magnit',
    belgi: 'E = E° − RT/nF lnQ',
    tavsif: "Elektrolitlar o'tkazuvchanligi, Debay-Hyukkel nazariyasi, Nernst tenglamasi, polyarografiya va korroziya.",
    kirish: "Kimyoviy va elektr energiyasi o'zaro aylanish qonuniyatlari, akkumulyatorlar va yonilg'i elementlari.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Kuchli elektrolitlar, ion kuchi, aktivlik koeffitsienti va Kolraush qonuni" },
      { nom: "Elektrod potensiallari, Nernst tenglamasi va konsentratsion elementlar" },
      { nom: "Elektrokimyoviy kinetika, o'ta kuchlanish (Tafel tenglamasi) va korroziyadan himoya" },
    ],
  },
  {
    slug: 'kristallokimyo',
    nom: 'Kristallokimyo va materiallar kimyosi',
    qisqa: 'Kristall panjaralar va nanomateriallar',
    holat: 'tez_kunda',
    ikon: 'plazma',
    belgi: 'nλ = 2d sinθ',
    tavsif: "Brave panjaralari, Miller indekslari, rentgenostrukturaviy tahlil (Vulf-Bregg qonuni) va qattiq fazali sintez.",
    kirish: "Kristall moddalarning simmetriyasi, atomlar joylashuvi va zamonaviy funksional materiallar.",
    videoDarslar: 0,
    bolimlar: [],
    mavzular: [
      { nom: "Kristallografik singoniyalar, 14 ta Brave panjarasi va Miller indekslari" },
      { nom: "Zich taxlanishlar, oktaedrik va tetraedrik bo'shliqlar, Goldshmidt qoidasi" },
      { nom: "Rentgen difraksiyasi (XRD), Vulf-Bregg tenglamasi va fazaviy tahlil" },
    ],
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
