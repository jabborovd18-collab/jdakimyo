// data/ilmiy/tahlil/_usullar.js
//
// TAHLIL USULLARINING YAGONA MANBASI.
//
// NEGA. Ro'yxat ilgari `app/ilmiy/tahlil/korinish.js` ichida 340 qator
// bo'lib yashagan va uni faqat o'sha bitta sahifa ko'rardi. Endi u
// kamida uch joyda kerak: usullar katalogi, har usulning o'z sahifasi
// va dinamik marshrutning `generateStaticParams` funksiyasi. Ro'yxat
// uch joyda qo'lda yozilsa, yangi usul qo'shilganda bittasi unutiladi
// va sahifa mavjud bo'la turib katalogda ko'rinmay qoladi — aynan shu
// hol `/ilmiy/birikmalar` da yuz bergan (13 ta yetim sahifa).
//
// Bu yerda faqat usulning O'ZI haqidagi ma'lumot. Birikma bilan
// kesishma (masalan "NMR × [Co(NH₃)₆]³⁺") alohida fayllarda:
//   data/ilmiy/tahlil/<usul>/<birikma>.js

export const USULLAR = {
  nmr: {
    nom: 'YaMR (NMR)',
    toliqNom: 'Yadro magnit rezonansi',
    ikon: '🧲',
    tavsif:
      "Yadro magnit rezonansi. ¹H, ¹³C, ³¹P va metall yadrolari (⁵⁹Co, ¹⁹⁵Pt) " +
      "orqali ligandlarning muhitini, simmetriyani va almashinuv kinetikasini aniqlaydi.",
    // Sahifada ko'rsatiladigan qisqa xossalar
    olchaydi: ['Kimyoviy siljish δ', 'Bog\'lanish doimiysi J', 'Simmetriya', 'Almashinuv kinetikasi'],
    // Ro'yxatdagi tartib — o'quv mantig'i bo'yicha, alifbo emas:
    // avval Verner klassikasi, keyin murakkabroq holatlar.
    tartib: [
      'co-nh3-6',
      'co-nh3-5-no2',
      'co-nh3-5-ono',
      'co-en-3',
      'fe-cn-6',
      'fe-acac-3',
      'fe-phen-3',
      'pt-cl2-nh3-2-cis',
      'pt-cl2-nh3-2-trans',
      'pt-cl4',
      'rh-pph3-3-cl',
      'al-h2o-6',
    ],
  },
}

/** Usul kalitlari — `generateStaticParams` uchun. */
export const USUL_KALITLARI = Object.keys(USULLAR)

/** Bitta usulni qaytaradi (topilmasa `null`). */
export function usulniOl(kalit) {
  return USULLAR[kalit] || null
}
