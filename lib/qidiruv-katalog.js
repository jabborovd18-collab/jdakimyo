import { normalizeChemText } from './chem-search.js'

/**
 * Sayt bo'ylab global qidiruv katalogi (v4).
 * Har bir `path` amaldagi `app/` ostidagi ommaviy sahifaga mos keladi.
 */
export const ALL_CONTENT = [
  {
    id: 1,
    title: "Maktab kimyosi",
    desc: "7–8-sinf darsliklari va mavzular ochiq, 9–11-sinflar tez kunda qo'shiladi",
    path: "/maktabkimyo",
    category: "Ta'lim",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab"],
    tags: ["maktab", "darslik", "7-sinf", "8-sinf", "9-sinf", "10-sinf", "11-sinf", "mavzular"],
    icon: "📚",
  },
  {
    id: 2,
    title: "7-sinf kimyosi",
    desc: "Kimyoga kirish, atom-molekula, kislota-asos va aralashmalar bo'yicha darslar",
    path: "/maktabkimyo/7sinf",
    category: "Ta'lim",
    type: "sinf",
    status: "faol",
    audiences: ["maktab"],
    tags: ["7-sinf", "maktab", "atom", "molekula", "kislota", "asos", "erituvchi"],
    icon: "📘",
  },
  {
    id: 3,
    title: "8-sinf kimyosi",
    desc: "Kislorod, vodorod, suv, oksid, asos, kislota va tuzlar sinflari",
    path: "/maktabkimyo/8sinf",
    category: "Ta'lim",
    type: "sinf",
    status: "faol",
    audiences: ["maktab"],
    tags: ["8-sinf", "maktab", "kislorod", "vodorod", "oksid", "tuz", "reaksiya"],
    icon: "📗",
  },
  {
    id: 4,
    title: "Oliy kimyo",
    desc: "Umumiy, anorganik, organik, analitik, fizikaviy va boshqa 12 ta fan (tez kunda qo'shiladi)",
    path: "/oliykimyo",
    category: "Ta'lim",
    type: "bo'lim",
    status: "tez-kunda",
    audiences: ["oliy", "imtihon"],
    tags: [
      "oliy",
      "umumiy",
      "anorganik",
      "organik",
      "analitik",
      "fizikaviy",
      "kolloid",
      "biokimyo",
      "kvant",
      "koordinatsion",
      "elektrokimyo",
    ],
    icon: "🎓",
  },
  {
    id: 5,
    title: "Laboratoriya mashg'ulotlari",
    desc: "7–11-sinf amaliy tajribalari va video-eksperimentlar (tez kunda qo'shiladi)",
    path: "/laboratoriya",
    category: "Ta'lim",
    type: "bo'lim",
    status: "tez-kunda",
    audiences: ["maktab", "oliy"],
    tags: ["laboratoriya", "tajriba", "amaliy", "reaktiv", "video"],
    icon: "🧪",
  },
  {
    id: 6,
    title: "Kimyogarlar haqida maqolalar",
    desc: "Sharq allomalari, O'zbekiston va jahon kimyogarlarining hayoti hamda ilmiy merosi",
    path: "/kimyogarlar",
    category: "Ta'lim",
    type: "bo'lim",
    status: "tez-kunda",
    audiences: ["maktab", "oliy"],
    tags: ["kimyogarlar", "olimlar", "maqola", "beruniy", "ibn sino", "obid sodiqov", "sobir yunusov"],
    icon: "🧬",
  },
  {
    id: 7,
    title: "Testlar markazi",
    desc: "Ustoz testlari, yozma ishlar, Kimyo 0 dan kursi va tayyorgarlik sinovlari",
    path: "/testlar",
    category: "Testlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "ustoz"],
    tags: ["test", "quiz", "sinov", "katalog", "mashq"],
    icon: "📝",
  },
  {
    id: 8,
    title: "Ustoz testlari",
    desc: "Ustozlar tuzgan variantli va ochiq testlar — natija darhol hisoblanadi",
    path: "/testlar/ustoz",
    category: "Testlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "ustoz"],
    tags: ["ustoz", "test", "variant", "quiz", "ochiq test"],
    icon: "📋",
  },
  {
    id: 9,
    title: "Yozma testlar",
    desc: "Ustoz yuborgan yozma nazorat ishlari va batafsil baholash",
    path: "/testlar/yozma",
    category: "Testlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "ustoz"],
    tags: ["yozma", "nazorat", "imtihon", "ustoz"],
    icon: "✍️",
  },
  {
    id: 10,
    title: "Kimyo 0 dan kursi — haftalik test",
    desc: "Haftalik darslar bo'yicha yakshanba testi (ism va test kodi orqali)",
    path: "/testlar/kimyo-0-dan",
    category: "Testlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon"],
    tags: ["kimyo 0 dan", "kurs", "haftalik test", "yakshanba", "boshlang'ich"],
    icon: "⚗️",
  },
  {
    id: 11,
    title: "Milliy sertifikat sinov testi",
    desc: "Rasch IRT modeli asosidagi tayyorgarlik sinovlari va ball-daraja tahlili",
    path: "/milliy-sertifikat",
    category: "Testlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["imtihon", "ustoz"],
    tags: ["milliy sertifikat", "rasch", "irt", "tayyorgarlik", "dtm", "imtihon"],
    icon: "🏅",
  },
  {
    id: 12,
    title: "Milliy Sertifikat natijasini tekshirish",
    desc: "Tayyorgarlik sinovi natijasi va ID raqam bo'yicha rasmiy tekshiruv",
    path: "/milliy-sertifikat/tekshir",
    category: "Testlar",
    type: "xizmat",
    status: "faol",
    audiences: ["imtihon"],
    tags: ["milliy sertifikat", "tekshir", "id", "natija", "daraja"],
    icon: "🔎",
  },
  {
    id: 13,
    title: "Kimyoviy o'yinlar",
    desc: "Formulani top, Elementlar dueli, Formula konstruktori, Reaksiyani tenglashtir va Sifat detektivi — 5 ta interaktiv o'yin",
    path: "/oyinlar",
    category: "O'yinlar",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "oliy"],
    tags: [
      "o'yinlar",
      "oyinlar",
      "o‘yinlar",
      "o'yin",
      "oyin",
      "o‘yin",
      "interaktiv",
      "viktorina",
      "katalog",
      "1v1",
      "formulani top",
      "elementlar dueli",
      "formula konstruktori",
      "reaksiyani tenglashtir",
      "sifat reaksiyalar detektivi",
    ],
    icon: "🎮",
  },
  {
    id: 14,
    title: "Formulani top o'yini",
    desc: "Ovozli ishoralar va 4 xil harakat rejimida kimyoviy formulalarni topish o'yini",
    path: "/oyinlar/formulani-top",
    category: "O'yinlar",
    type: "o'yin",
    status: "faol",
    audiences: ["maktab", "imtihon"],
    tags: ["formulani top", "formula", "molekula", "doska", "ovozli", "3d", "o'yin"],
    icon: "🎯",
  },
  {
    id: 15,
    title: "Kimyogar ko'chati",
    desc: "Kunlik faollik, tajriba (XP) va o'simlikni o'stirish gamifikatsiyasi",
    path: "/kochat",
    category: "O'yinlar",
    type: "gamifikatsiya",
    status: "faol",
    audiences: ["maktab", "imtihon"],
    tags: ["ko'chat", "kochat", "xp", "kunlik vazifa", "gamifikatsiya", "o'sish"],
    icon: "🌱",
  },
  {
    id: 16,
    title: "Masala yechish (JDA Kimyo AI)",
    desc: "Kimyoviy masalalarni bosqichma-bosqich tahlil qiluvchi ovozli AI yordamchi",
    path: "/masala",
    category: "Vositalar",
    type: "vosita",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy"],
    tags: ["masala", "hisoblash", "yechim", "ai", "ovozli", "reaksiya", "h2so4"],
    icon: "🧮",
  },
  {
    id: 17,
    title: "Elektron doska (Smart Doska)",
    desc: "Dars, proyektor va jonli sinf bellashuvlari uchun interaktiv doska",
    path: "/doska",
    category: "Vositalar",
    type: "vosita",
    status: "faol",
    audiences: ["ustoz", "maktab"],
    tags: ["doska", "smart doska", "dars", "proyektor", "auditoriya", "o'qituvchi"],
    icon: "🖥️",
  },
  {
    id: 18,
    title: "Smart Jangga PIN kod bilan kirish",
    desc: "Doskada ko'rsatilgan 6 raqamli PIN kod orqali jonli bellashuvga qo'shilish",
    path: "/doska/join",
    category: "Vositalar",
    type: "vosita",
    status: "faol",
    audiences: ["maktab", "ustoz"],
    tags: ["jang", "pin", "kod", "doska", "musobaqa"],
    icon: "🔑",
  },
  {
    id: 19,
    title: "Kimyo-biologiya repititorlari xaritasi",
    desc: "Hudud va GPS bo'yicha eng yaqin kimyo-biologiya repititorlarini topish yoki qo'shish",
    path: "/repititorlar",
    category: "Vositalar",
    type: "xizmat",
    status: "faol",
    audiences: ["maktab", "imtihon", "ustoz"],
    tags: ["repititor", "repititorlar", "xarita", "karta", "gps", "ustoz", "biologiya", "markaz"],
    icon: "📍",
  },
  {
    id: 20,
    title: "Sertifikatni tekshirish portali",
    desc: "JDA KIMYO sertifikatlarini raqam yoki QR kod orqali rasmiy tekshirish",
    path: "/sertifikat",
    category: "Vositalar",
    type: "xizmat",
    status: "faol",
    audiences: ["imtihon", "ustoz"],
    tags: ["sertifikat", "qr", "tekshirish", "rasmiy", "pdf"],
    icon: "📜",
  },
  {
    id: 21,
    title: "Kimyo laboratoriya do'koni",
    desc: "Laboratoriya shisha idishlari, asboblar va reaktivlar sotuvi (tez kunda qo'shiladi)",
    path: "/dokon",
    category: "Vositalar",
    type: "bo'lim",
    status: "tez-kunda",
    audiences: ["maktab", "oliy", "ustoz"],
    tags: ["do'kon", "dokon", "jihoz", "reaktiv", "idish"],
    icon: "🛒",
  },
  {
    id: 22,
    title: "Dolzarb mavzular",
    desc: "Kimyoviy savol-javoblar, muhokama forumi va ilmiy hikoyalar",
    path: "/dolzarb",
    category: "Jamoa",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy", "ustoz"],
    tags: ["muhokama", "savol", "forum", "dolzarb", "post", "hikoya"],
    icon: "💬",
  },
  {
    id: 23,
    title: "Kanallar",
    desc: "Ustoz va tashkilotlarning ta'lim hamda ilmiy kanallari",
    path: "/kanallar",
    category: "Jamoa",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "ustoz"],
    tags: ["kanal", "yangilik", "darslik", "ustoz"],
    icon: "📢",
  },
  {
    id: 24,
    title: "Ilmiy chat va xabarlar",
    desc: "Do'stlar va hamjamiyat a'zolari bilan shaxsiy yozishmalar",
    path: "/chat",
    category: "Jamoa",
    type: "bo'lim",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy", "ustoz"],
    tags: ["chat", "xabar", "do'stlar", "yozishma", "suhbat"],
    icon: "✉️",
  },
  {
    id: 25,
    title: "Hamkorlik va jamoa",
    desc: "Jamoaga taklif, bog'lanish, sayt yangiliklari, hamkorlar va tez-tez beriladigan savollar",
    path: "/hamkorlik",
    category: "Jamoa",
    type: "bo'lim",
    status: "faol",
    audiences: ["ustoz", "oliy"],
    tags: ["hamkorlik", "jamoa", "bog'lanish", "yangiliklar", "faq"],
    icon: "🤝",
  },
  {
    id: 26,
    title: "Sayt qanday ishlaydi",
    desc: "Platformaning to'liq xaritasi, tayyor va rivojlanayotgan bo'limlar qo'llanmasi",
    path: "/ishlashi",
    category: "Jamoa",
    type: "qo'llanma",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy", "ustoz"],
    tags: ["qo'llanma", "yordam", "xarita", "ishlashi"],
    icon: "🧭",
  },
  {
    id: 27,
    title: "JDA KIMYO nima?",
    desc: "Platforma haqida rasmiy ma'lumot, asoschi va ilmiy missiya",
    path: "/jda-kimyo",
    category: "Jamoa",
    type: "ma'lumot",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy"],
    tags: ["jda kimyo", "platforma", "yaratuvchi", "haqida"],
    icon: "⚛️",
  },
  {
    id: 28,
    title: "Elementlar dueli",
    desc: "Davriy jadval, elektron qobiq va atom massalari bo‘yicha 1v1 va yakka kimyoviy duel",
    path: "/oyinlar/element-duel",
    category: "O'yinlar",
    type: "o'yin",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy"],
    tags: [
      "elementlar dueli",
      "element duel",
      "element",
      "duel",
      "davriy jadval",
      "elektron qobiq",
      "atom massa",
      "1v1",
      "o'yin",
      "oyin",
      "o‘yin",
    ],
    icon: "⚛️",
  },
  {
    id: 29,
    title: "Formula konstruktori",
    desc: "Kation va anionlarni zaryad muvozanati bo‘yicha birlashtirib kimyoviy formulalarni yig‘ish o‘yini",
    path: "/oyinlar/formula-konstruktor",
    category: "O'yinlar",
    type: "o'yin",
    status: "faol",
    audiences: ["maktab", "imtihon"],
    tags: [
      "formula konstruktori",
      "formula konstruktor",
      "formula",
      "konstruktor",
      "kation",
      "anion",
      "ion",
      "zaryad",
      "valentlik",
      "o'yin",
      "oyin",
      "o‘yin",
    ],
    icon: "🧬",
  },
  {
    id: 30,
    title: "Reaksiyani tenglashtir",
    desc: "Kimyoviy reaksiya tenglamalariga stexiometrik koeffitsientlarni tez topish va 1v1 bellashuv",
    path: "/oyinlar/reaksiya-balans",
    category: "O'yinlar",
    type: "o'yin",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy"],
    tags: [
      "reaksiyani tenglashtir",
      "reaksiya balans",
      "reaksiya",
      "balans",
      "tenglashtirish",
      "koeffitsient",
      "stexiometriya",
      "redoks",
      "1v1",
      "o'yin",
      "oyin",
      "o‘yin",
    ],
    icon: "⚖️",
  },
  {
    id: 31,
    title: "Sifat reaksiyalar detektivi",
    desc: "Noma’lum eritmalarga reaktiv tomizib, cho‘kma, gaz va rang belgilaridan moddani aniqlash laboratoriyasi",
    path: "/oyinlar/sifat-detektiv",
    category: "O'yinlar",
    type: "o'yin",
    status: "faol",
    audiences: ["maktab", "imtihon", "oliy"],
    tags: [
      "sifat reaksiyalar detektivi",
      "sifat detektiv",
      "sifat",
      "detektiv",
      "reaksiya",
      "chokma",
      "cho'kma",
      "cho‘kma",
      "gaz",
      "indikator",
      "tahlil",
      "o'yin",
      "oyin",
      "o‘yin",
    ],
    icon: "🧪",
  },
]

export const POPULAR_SEARCHES = [
  "maktab",
  "7-sinf",
  "milliy sertifikat",
  "formulani top",
  "o'yinlar",
  "repititorlar",
  "kimyogarlar",
  "masala",
  "doska",
  "sertifikat",
  "oliy kimyo",
  "kimyo 0 dan",
]

export const CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "🌐" },
  { id: "Ta'lim", name: "Ta'lim", icon: "📚" },
  { id: "Testlar", name: "Testlar", icon: "📝" },
  { id: "O'yinlar", name: "O'yinlar", icon: "🎮" },
  { id: "Vositalar", name: "Vositalar", icon: "🧮" },
  { id: "Jamoa", name: "Jamoa", icon: "💬" },
]

export const VIEW_MODES = [
  { id: "cards", name: "Kartalar", icon: "🎴" },
  { id: "list", name: "Ro'yxat", icon: "📋" },
  { id: "grid", name: "Grid", icon: "⊞" },
]

export const HOLAT_FILTRLARI = [
  { id: "all", name: "Barcha holatlar" },
  { id: "faol", name: "Faol (ochiq)" },
  { id: "tez-kunda", name: "Tez kunda qo'shiladi" },
]

export const DARAJA_FILTRLARI = [
  { id: "all", name: "Barcha yo'nalishlar" },
  { id: "maktab", name: "Maktab (7–11-sinf)" },
  { id: "imtihon", name: "Milliy sertifikat / Imtihon" },
  { id: "oliy", name: "Oliy ta'lim" },
  { id: "ustoz", name: "Ustoz va repititorlar" },
]

export const BOSH_FILTRLAR = {
  status: "all",
  audience: "all",
  tagQuery: "",
}

const TUTUQ_BEZGISI_RE = /[’‘ʻ`ʼ´]/g

/**
 * Qidiruv uchun matnni yagona ko'rinishga keltiradi:
 * kimyoviy indekslarni (H₂SO₄ -> h2so4) va o'zbekcha tutuq belgilarini normallashtiradi.
 */
export function qidiruvMatnNormallashtir(matn) {
  return normalizeChemText(matn).replace(TUTUQ_BEZGISI_RE, "'")
}

function tutuqSiz(matn) {
  return matn.replace(/'/g, "")
}

/**
 * Matn ichida so'rov bor-yo'qligini tekshiradi (tutuq varianti va bo'shliqsiz kimyo bilan).
 */
export function qidiruvMatnMosmi(matn, sorov) {
  const sorovNorm = qidiruvMatnNormallashtir(sorov)
  if (!sorovNorm) return true
  const matnNorm = qidiruvMatnNormallashtir(matn)
  if (matnNorm.includes(sorovNorm)) return true

  const sorovSodda = tutuqSiz(sorovNorm)
  return sorovSodda.length >= 2 && tutuqSiz(matnNorm).includes(sorovSodda)
}

/**
 * `ALL_CONTENT` ro'yxatini matn, kategoriya va v4 kengaytirilgan filtrlari bo'yicha saralaydi.
 */
export function filtrlaQidiruvNatijalari({
  searchQuery = "",
  activeCategory = "all",
  filters = BOSH_FILTRLAR,
} = {}) {
  const tozaFilters = { ...BOSH_FILTRLAR, ...(filters || {}) }
  let natija = ALL_CONTENT

  if (activeCategory && activeCategory !== "all") {
    natija = natija.filter((item) => item.category === activeCategory)
  }

  if (tozaFilters.status && tozaFilters.status !== "all") {
    natija = natija.filter((item) => item.status === tozaFilters.status)
  }

  if (tozaFilters.audience && tozaFilters.audience !== "all") {
    natija = natija.filter((item) => (item.audiences || []).includes(tozaFilters.audience))
  }

  const tagSorov = qidiruvMatnNormallashtir(tozaFilters.tagQuery)
  if (tagSorov) {
    natija = natija.filter((item) => {
      const manba = [item.title, item.desc, ...(item.tags || [])].join(" ")
      return qidiruvMatnMosmi(manba, tagSorov)
    })
  }

  const sorov = qidiruvMatnNormallashtir(searchQuery)
  if (!sorov) {
    return [...natija]
  }

  const bolaklar = sorov.split(" ").filter(Boolean)
  const moslar = natija.filter((item) => {
    const qidiruvMaydoni = [
      item.title,
      item.desc,
      ...(item.tags || []),
      item.category,
      item.type,
      item.path,
    ].join(" ")

    if (qidiruvMatnMosmi(qidiruvMaydoni, sorov)) return true
    return bolaklar.length > 1 && bolaklar.every((b) => qidiruvMatnMosmi(qidiruvMaydoni, b))
  })

  return [...moslar].sort((a, b) => {
    const ball = (item) => {
      let s = 0
      if (qidiruvMatnNormallashtir(item.path) === sorov) s += 8
      if (qidiruvMatnMosmi(item.path, sorov)) s += 5
      if (qidiruvMatnNormallashtir(item.title) === sorov) s += 6
      if (qidiruvMatnMosmi(item.title, sorov)) s += 4
      if (bolaklar.length > 1 && bolaklar.every((b) => qidiruvMatnMosmi(item.title, b))) s += 3
      if ((item.tags || []).some((t) => qidiruvMatnNormallashtir(t) === sorov)) s += 3
      if ((item.tags || []).some((t) => qidiruvMatnMosmi(t, sorov))) s += 2
      if (item.status === "faol") s += 1
      return s
    }
    return ball(b) - ball(a)
  })
}
