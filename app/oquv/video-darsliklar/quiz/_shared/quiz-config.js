// Quiz mavzularining yagona ro'yxati.
//
// Menyu, test yechish sahifasi, PDF va serverga yuboriladigan nom bir xil
// manbadan keladi. Aks holda bitta mavzu besh faylda besh xil nom bilan
// yashab, statistika alohida-alohida guruhlarga bo'linib ketadi.
export const QUIZLAR = [
  {
    slug: "nomlanishi",
    raqam: "01",
    qisqa: "NOM",
    nom: "Nomlanish",
    sarlavha: "Koordinatsion birikmalarni nomlash",
    tavsif: "IUPAC tartibi, ligand nomlari va formuladan tizimli nom hosil qilish.",
    formula: "[Co(NH₃)₆]Cl₃ → geksaamminkobalt(III) xlorid",
    natijaNomi: "Koordinatsion birikmalarning nomlanishi",
    pdfNomi: "Nomlanish",
    mavzular: [
      "Ligandlarni alifbo tartibida yozish",
      "Oksidlanish darajasini aniqlash",
      "Kation, anion va neytral kompleks nomlari",
      "Nomdan formulaga va formuladan nomga o'tish",
    ],
  },
  {
    slug: "klassifikatsiyasi",
    raqam: "02",
    qisqa: "KLS",
    nom: "Klassifikatsiya",
    sarlavha: "Komplekslarni tasniflash",
    tavsif: "Zaryad, ligand dentatligi, koordinatsion son va kompleks turi bo'yicha tahlil.",
    formula: "kompleks turi · ligand turi · koordinatsion son",
    natijaNomi: "Koordinatsion birikmalarning klassifikatsiyasi",
    pdfNomi: "Klassifikatsiya",
    mavzular: [
      "Kation, anion va neytral komplekslar",
      "Mono-, bi- va polidentat ligandlar",
      "Koordinatsion sonni topish",
      "Kompleks zaryadini hisoblash",
    ],
  },
  {
    slug: "fazoviy",
    raqam: "03",
    qisqa: "3D",
    nom: "Fazoviy tuzilish",
    sarlavha: "Geometriya va gibridlanish",
    tavsif: "Kompleksning koordinatsion sonidan uning geometriyasi va gibridlanishini aniqlash.",
    formula: "KS 4 → tetraedr yoki tekis kvadrat",
    natijaNomi: "Koordinatsion birikmalarning fazoviy tuzilishi",
    pdfNomi: "Fazoviy tuzilish",
    mavzular: [
      "Chiziqli, tetraedrik va oktaedrik tuzilish",
      "sp³, dsp² va d²sp³ gibridlanish",
      "VSEPR va kristall maydon asoslari",
      "Koordinatsion son va geometriya bog'lanishi",
    ],
  },
  {
    slug: "izomeriya",
    raqam: "04",
    qisqa: "IZO",
    nom: "Izomeriya",
    sarlavha: "Tuzilish va stereoizomeriya",
    tavsif: "Bir xil tarkibli komplekslarning bog'lanish va fazoviy farqlarini ajratish.",
    formula: "cis / trans · fac / mer · Δ / Λ",
    natijaNomi: "Koordinatsion birikmalarning izomeriyasi",
    pdfNomi: "Izomeriya",
    mavzular: [
      "Ionlanish, gidrat va bog'lanish izomeriyasi",
      "Geometrik cis/trans va fac/mer juftliklari",
      "Optik Δ/Λ enantiomerlar",
      "Koordinatsion izomeriya",
    ],
  },
  {
    slug: "aralash",
    raqam: "05",
    qisqa: "MIX",
    nom: "Aralash test",
    sarlavha: "To'rt yo'nalish, bitta sinov",
    tavsif: "Har bir asosiy mavzudan teng miqdorda tanlangan savollar bilan umumiy bilimni tekshirish.",
    formula: "5 NOM + 5 KLS + 5 3D + 5 IZO",
    natijaNomi: "Aralash test (barcha mavzular)",
    pdfNomi: "Aralash test",
    aralash: true,
    mavzular: [
      "5 ta nomlanish savoli",
      "5 ta klassifikatsiya savoli",
      "5 ta fazoviy tuzilish savoli",
      "5 ta izomeriya savoli",
    ],
  },
]

export const ASOSIY_QUIZ_SLUGLARI = QUIZLAR.filter((q) => !q.aralash).map((q) => q.slug)

export function quizniTop(slug) {
  return QUIZLAR.find((quiz) => quiz.slug === slug) || null
}
