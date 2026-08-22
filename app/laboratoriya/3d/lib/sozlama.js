// Barcha sonli va konfiguratsion qiymatlarni bitta faylda saqlaymiz: boshqa joyda 
// 'sehrli raqamlar' (magic numbers) yozilsa, balansni va dizaynni boshqarish qiyinlashadi.

export const KAMERA = {
  // Three.js'da fov VERTIKAL. 16:9 ekranda 45° vertikal ≈ 73° gorizontal —
  // bu mahsulotni suratga olish burchagi, ichida YURISH burchagi emas:
  // u fazoni siqadi va devorlarni yaqin ko'rsatadi. FPS o'yinlari
  // 90-103° gorizontal ishlatadi; 60° vertikal ≈ 91° gorizontal.
  //
  // NEGA XONA EMAS, KAMERA: xona allaqachon 16x12 m = 192 m², ya'ni
  // haqiqiy o'quv laboratoriyasidan (60-100 m²) KATTA. "Tor" tuyg'usi
  // o'lchamdan emas, burchakdan kelgan (BRIF-04, 2026-08-20 topilmasi).
  fov: 60,
  yaqin: 0.1,
  uzoq: 100,
  boshlangich: [0, 1.6, 3.2],
  nishon: [0, 0.95, 0],
};

// XONA — o'lchamning YAGONA manbai (AGENTS.md 1-band).
//
// Ilgari bu uch son `xona-modellari.js` ichida qattiq yozilgan edi va
// undan hosila chegaralar yana uch faylda mustaqil takrorlangan:
// yurish kolliziyasi (`useYurish.js`), o'lchagich supurishi
// (`olcham/olcham-nuqtalar.js`) va soya kamerasi (`yoruglik.js`).
// Ular allaqachon bir-biridan uzila boshlagan — masalan yurish z ni
// 5.2 gacha, supurish esa 5.6 gacha ruxsat berardi.
//
// markazZ: xona z bo'yicha markazdan 0.4 m oldinga surilgan — stol
// markazda tursin, lekin orqa devordagi javonlar oldida yo'lak qolsin.
export const XONA = {
  eni: 16.0,        // X
  balandligi: 4.2,  // Y
  boyi: 12.0,       // Z
  markazZ: 0.4,
};

/**
 * Xonaning ichki devor chegaralari (dunyo koordinatasida).
 * Devorlar shu qiymatlarda turadi; yurish va supurish bundan chetlanish
 * (margin) bilan hisoblanadi.
 */
export function xonaChegarasi() {
  return {
    xMin: -XONA.eni / 2,
    xMax: XONA.eni / 2,
    zMin: -XONA.boyi / 2 + XONA.markazZ,
    zMax: XONA.boyi / 2 + XONA.markazZ,
  };
}

// Yurish chegarasi devordan qancha ichkarida to'xtaydi.
// Old tomon kattaroq: eshik va uning ostonasi shu yerda
// (xona-modellari.js eshikni zMax da qo'yadi). Qiymatlar ilgari
// `useYurish.js` da `-7.2 / 7.2 / -4.8 / 5.2` bo'lib yozilgan edi —
// shu chetlanishlar aynan o'sha sonlarni beradi.
export const YURISH_CHETLANISHI = {
  yon: 0.8,   // chap va o'ng devor
  orqa: 0.8,  // orqa devor
  old: 1.2,   // old devor (eshik)
};

// Kamera stol ostiga kirib ketmasligi uchun engKattaBurchak Math.PI / 2.05 bilan cheklanadi.
export const BOSHQARUV = {
  engYaqin: 1.2,
  engUzoq: 6,
  engKattaBurchak: Math.PI / 2.05,
};

export const STOL = {
  eni: 3.2,
  boyi: 1.6,
  qalinligi: 0.08,
  balandligi: 0.9,
};

// Stol ustida jihozlar bir-birining ustiga tushmasligi va aniq panjara bo'yicha turishi uchun 12 ta joy koordinatasi (X, Y, Z).
// Y balandligi stol sirtiga (0.9) teng qilib olingan.
export const SLOTLAR = [
  [-1.1, 0.9, 0.35],  // 1-slot: old chap
  [-0.55, 0.9, 0.35], // 2-slot: old o'rta-chap
  [0,     0.9, 0.35], // 3-slot: old markaz
  [0.55,  0.9, 0.35], // 4-slot: old o'rta-o'ng
  [1.1,   0.9, 0.35], // 5-slot: old o'ng
  [-1.1, 0.9, 0.0],   // 6-slot: o'rta chap
  [-0.55, 0.9, 0.0],  // 7-slot: o'rta
  [0,     0.9, 0.0],  // 8-slot: markaz
  [0.55,  0.9, 0.0],  // 9-slot: o'rta o'ng
  [1.1,   0.9, 0.0],  // 10-slot: o'rta chekka
  [-0.7, 0.9, -0.35], // 11-slot: orqa chap
  [0.7,  0.9, -0.35], // 12-slot: orqa o'ng
];

// 16-lik rang kodlari RGB o'rniga hex formatda beriladi: Three.js materiallari hex format bilan eng tez ishlaydi.
//
// Fon, stol va shisha ranglari bu yerda EMAS — ular tanlangan fon mavzusiga
// bog'liq va lib/fonlar.js da turadi. Bu yerda faqat mavzudan qat'i nazar
// o'zgarmaydigan ranglar qoladi.
export const RANGLAR = {
  metall: 0x9aa4b2,
};

// Standart konsentratsiya 0.5 M qilib olindi: bazada aniq molyar massalar va konsentratsiyalar yo'qligi
// sababli animatsiya va nisbatni o'quv maqsadida muvofiqlashtirish uchun shartli standart ishlatiladi.
export const QUYISH = {
  oqim: 0.8, // ml/s (standart oqim tezligi)
  engKopHajm: 150, // ml (maksimal sig'im chegarasi)
  standartKonsentratsiya: 0.5, // mol/l (yoki mol/1000ml = 0.0005 mol/ml)
};

// Stexiometriya chegaralari BU YERDA EMAS — `lib/lab-nisbat.js` da.
//
// Ular ilgari shu faylda turardi va client o'zi baho qo'yardi. Endi hakam
// server: u nima sarflanishini va qancha mahsulot chiqishini ham o'sha
// baho bilan hal qiladi, ya'ni chegaralarning ikkinchi nusxasi bo'lsa
// ekrandagi baho bilan haqiqiy natija bir-biriga qarama-qarshi chiqishi
// mumkin edi.

// Mobil va oddiy qurilmalarda kadrlar soni (FPS) tushib ketmasligi uchun zarrachalar miqdori optimal cheklangan.
export const EFFEKT_DAVOMIYLIGI = {
  pufak: 2.5,  // soniya
  chokma: 4.0, // soniya
  bug: 2.0,    // soniya
};

export const ZARRA_SONI = {
  pufak: 60,
  chokma: 120,
  bug: 40,
};