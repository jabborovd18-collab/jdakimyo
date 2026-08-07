// Barcha sonli va konfiguratsion qiymatlarni bitta faylda saqlaymiz: boshqa joyda 
// 'sehrli raqamlar' (magic numbers) yozilsa, balansni va dizaynni boshqarish qiyinlashadi.

export const KAMERA = {
  fov: 45,
  yaqin: 0.1,
  uzoq: 100,
  boshlangich: [0, 1.6, 3.2],
  nishon: [0, 0.95, 0],
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

// Stol ustida jihozlar bir-birining ustiga tushmasligi va aniq panjara bo'yicha turishi uchun 6 ta joy koordinatasi (X, Y, Z).
// Y balandligi stol sirtiga (0.9) teng qilib olingan.
export const SLOTLAR = [
  [-0.8, 0.9, 0.25],  // 1-slot: old qator, chap
  [0,    0.9, 0.25],  // 2-slot: old qator, o'rta
  [0.8,  0.9, 0.25],  // 3-slot: old qator, o'ng
  [-0.8, 0.9, -0.25], // 4-slot: orqa qator, chap
  [0,    0.9, -0.25], // 5-slot: orqa qator, o'rta
  [0.8,  0.9, -0.25], // 6-slot: orqa qator, o'ng
];

// 16-lik rang kodlari RGB o'rniga hex formatda beriladi: Three.js materiallari hex format bilan eng tez ishlaydi.
export const RANGLAR = {
  stol: 0x2a2438,
  shisha: 0xcfe8ff,
  metall: 0x9aa4b2,
  fon: 0x0b0714,
};

// Standart konsentratsiya 0.5 M qilib olindi: bazada aniq molyar massalar va konsentratsiyalar yo'qligi
// sababli animatsiya va nisbatni o'quv maqsadida muvofiqlashtirish uchun shartli standart ishlatiladi.
export const QUYISH = {
  oqim: 0.8, // ml/s (standart oqim tezligi)
  engKopHajm: 150, // ml (maksimal sig'im chegarasi)
  standartKonsentratsiya: 0.5, // mol/l (yoki mol/1000ml = 0.0005 mol/ml)
};

// Stexiometriyaning to'g'rilik foizi va chegaralari: o'quvchi xatosini bloklamasdan,
// natijaga va xulosaga ta'sir qiladigan interfallar.
export const NISBAT_CHEGARALARI = {
  chala: 0.6,
  togri: 0.2,
  ortiqcha: 1.5,
  keskin: 3.0,
};

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