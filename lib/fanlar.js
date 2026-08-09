// lib/fanlar.js
//
// FANLARNING YAGONA MANBASI (v3.0.0).
//
// Sayt "kompleks birikmalar sayti" bo'lishdan "oliy kimyo platformasi"ga
// o'tdi. Bu tuzilmada koordinatsion kimyo endi butun saytning mavzusi emas,
// balki fanlardan BITTASI. Bosh sahifa fan tanlash oynasi, har bir fanning
// ichida esa faqat o'sha fanga tegishli bo'limlar turadi.
//
// NEGA BITTA FAYL. Fan ro'yxati kamida uch joyda kerak: bosh sahifadagi
// tarmoq, `/fan/[slug]` sahifasi va (keyinchalik) fan almashtirgich. Ro'yxat
// uch joyda qo'lda yozilsa, yangi fan ochilganda bittasi unutiladi va
// foydalanuvchi qulfi ochilgan fanni topa olmay qoladi.
//
// YANGI FAN OCHISH TARTIBI:
//   1) shu yerda `holat` ni 'ochiq' ga o'zgartiring;
//   2) `bolimlar` massivini to'ldiring (bo'sh bo'lsa sahifa "bo'lim yo'q"
//      deb ko'rsatadi — bu qasddan: yolg'on havola bermaydi);
//   3) `scripts/gen-sitemap-royxat.js` ni qayta ishga tushiring.
// Boshqa faylga tegish shart emas — `/fan/[slug]` marshruti ro'yxatdan
// o'zi quriladi.
//
// MANZILLAR KO'CHIRILMADI. `/oquv` va `/ilmiy` daraxtidagi 117 sahifaga
// alohida SEO sarlavhasi berilgan va sitemapda 125 manzil turibdi. Fanni
// papkaga ko'chirish o'sha ishning hammasini bekor qilardi, shuning uchun
// `/fan/koordinatsion-kimyo` — mavjud manzillar USTIDAGI qobiq, ularning
// o'rnini bosuvchi emas.

import HAJM from './ilmiy-hajm.json'

export const FANLAR = [
  {
    slug: 'koordinatsion-kimyo',
    nom: 'Koordinatsion kimyo',
    qisqa: 'Kompleks birikmalar',
    holat: 'ochiq',
    // Fanning "imzo" formulasi — kartada bezak emas, fanni bir qarashda
    // taniydigan belgi vazifasini bajaradi.
    belgi: '[Co(NH₃)₆]³⁺',
    tavsif:
      'Markaziy atom va ligandlar: tuzilish, nomlanish, izomeriya, kristall maydon nazariyasi va fizikaviy tahlil usullari.',
    kirish:
      "Platformaning to'liq yozilgan yagona fani. Boshlang'ich mavzulardan " +
      "Mössbauer spektroskopiyasigacha — nazariya, 3D modellar va tahlil " +
      "usullari bir daraxtda yig'ilgan.",
    // `ikon` — `components/Ikon.jsx` dagi kalit. Emoji o'rniga shu ishlatiladi.
    bolimlar: [
      {
        href: '/oquv',
        ikon: 'kitob',
        nom: "O'quv bo'lim",
        tavsif:
          "Asoslardan boshlab: klassifikatsiya, nomlanish, kimyoviy bog'lanish, izomeriya va fazoviy tuzilish.",
        birlik: "5 yo'nalish",
        asosiy: true,
      },
      {
        href: '/ilmiy',
        ikon: 'atom',
        nom: 'Ilmiy kutubxona',
        tavsif:
          'Tadqiqotchilar uchun: tahlil usullari, chuqurlashgan mavzular, birikmalar bazasi va maqolalar.',
        birlik: `${HAJM.jamiTahlilVaMavzu} sahifa`,
        asosiy: true,
      },
      {
        href: '/ilmiy/birikmalar',
        ikon: 'kolba',
        nom: 'Birikmalar bazasi',
        tavsif: "Tuzilishi, xossalari, olinishi va aylantirib ko'riladigan 3D modeli.",
        birlik: `${HAJM.birikmalar} birikma`,
      },
      {
        href: '/ilmiy/tahlil',
        ikon: 'grafik',
        nom: 'Tahlil usullari',
        tavsif: "IQ, NMR, Rentgen, EXAFS, Mössbauer — har biri aniq birikmada ko'rsatilgan.",
        birlik: `${HAJM.usullar} usul`,
      },
      {
        href: '/ilmiy/chuqurlashgan',
        ikon: 'kitob',
        nom: 'Chuqurlashgan mavzular',
        tavsif: 'Kristall va ligand maydon nazariyasi, simmetriya, Yan–Teller effekti, termodinamika.',
        birlik: `${HAJM.mavzular} mavzu`,
      },
      {
        href: '/oquv/fazoviy',
        ikon: 'atom',
        nom: 'Fazoviy tuzilish',
        tavsif: "Koordinatsion sonlar bo'yicha geometriya va interaktiv 3D modellar.",
        birlik: `${HAJM.modellar3d} model`,
      },
    ],
  },

  // ─── Tayyorlanayotgan fanlar ────────────────────────────────────────
  // `bolimlar` ataylab bo'sh: sahifa yo'q joyga havola qilmaslik kerak.
  {
    slug: 'anorganik-kimyo',
    nom: 'Anorganik kimyo',
    qisqa: 'Elementlar kimyosi',
    holat: 'yopiq',
    belgi: 'Fe₂O₃',
    tavsif:
      'Davriy qonun, s- p- d- f-elementlar, oksidlar, kislota-asos nazariyalari va qattiq jism kimyosi.',
    bolimlar: [],
  },
  {
    slug: 'organik-kimyo',
    nom: 'Organik kimyo',
    qisqa: 'Uglerod birikmalari',
    holat: 'yopiq',
    belgi: 'C₆H₆',
    tavsif:
      'Uglevodorodlar, funksional guruhlar, reaksiya mexanizmlari, stereokimyo va sintez yo\'llari.',
    bolimlar: [],
  },
  {
    slug: 'analitik-kimyo',
    nom: 'Analitik kimyo',
    qisqa: 'Miqdoriy tahlil',
    holat: 'yopiq',
    belgi: 'pH = pKₐ',
    tavsif:
      'Sifat va miqdoriy tahlil, titrimetriya, gravimetriya, xromatografiya va asboblar tahlili.',
    bolimlar: [],
  },
  {
    slug: 'fizikaviy-kimyo',
    nom: 'Fizikaviy kimyo',
    qisqa: 'Termodinamika va kinetika',
    holat: 'yopiq',
    belgi: 'ΔG = ΔH − TΔS',
    tavsif:
      'Kimyoviy termodinamika, muvozanat, reaksiya kinetikasi, elektrokimyo va kvant kimyo asoslari.',
    bolimlar: [],
  },
  {
    slug: 'kolloid-kimyo',
    nom: 'Kolloid kimyo',
    qisqa: 'Sirt hodisalari',
    holat: 'yopiq',
    belgi: 'γ · dA',
    tavsif:
      'Dispers sistemalar, sirt taranglik, adsorbsiya, emulsiya va suspenziyalar barqarorligi.',
    bolimlar: [],
  },
  {
    slug: 'biokimyo',
    nom: 'Biokimyo',
    qisqa: 'Tirik tizimlar kimyosi',
    holat: 'yopiq',
    belgi: 'ATP',
    tavsif:
      'Oqsillar, fermentlar, nuklein kislotalar, metabolizm va bioanorganik koordinatsiya.',
    bolimlar: [],
  },
]

/** Manzilda ishlatiladigan asos — bir joyda tursin */
export const FAN_ILDIZ = '/fan'

export function fanHavolasi(fan) {
  return `${FAN_ILDIZ}/${fan.slug}`
}

export function fanTop(slug) {
  return FANLAR.find((f) => f.slug === slug) || null
}

/** Faqat ochiq fanlar — marshrut qurish va sitemap uchun */
export function ochiqFanlar() {
  return FANLAR.filter((f) => f.holat === 'ochiq')
}

export function ochiqFanlarSoni() {
  return ochiqFanlar().length
}
