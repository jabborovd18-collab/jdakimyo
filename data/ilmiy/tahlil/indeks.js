// data/ilmiy/tahlil/indeks.js
//
// Barcha usullarning ma'lumotini bitta kirish nuqtasiga yig'adi.
// Dinamik marshrut (`app/ilmiy/tahlil/[usul]/birikmalar/[birikma]`)
// faqat shu faylni biladi.
//
// YANGI USUL QO'SHISH (masalan `rentgen`):
//   1) `data/ilmiy/tahlil/rentgen/` papkasini to'ldiring
//      (`node scripts/tahlil-malumot-ajrat.js rentgen`);
//   2) `rentgen/_indeks.js` yozing;
//   3) quyida import qilib, `MALUMOTLAR` ga qo'shing;
//   4) `_usullar.js` ga usul ta'rifini kiriting;
//   5) ESKI `app/ilmiy/tahlil/rentgen/birikmalar/` papkasini o'chiring.
//
// 5-qadam MAJBURIY va ATAYLAB oxirida: Next.js'da statik segment
// dinamikdan ustun turadi, ya'ni eski papka turgan ekan yangi marshrut
// o'sha usul uchun umuman ishga tushmaydi. Bu xato emas — bu bizga
// bosqichma-bosqich, xavfsiz ko'chish imkonini beradi.

import NMR from './nmr/_indeks.js'

export const MALUMOTLAR = {
  nmr: NMR,
}

/** Berilgan usuldagi barcha birikma kalitlari. */
export function birikmaKalitlari(usul) {
  return Object.keys(MALUMOTLAR[usul] || {})
}

/** Bitta birikmaning ma'lumoti (topilmasa `null`). */
export function birikmaniOl(usul, birikma) {
  return MALUMOTLAR[usul]?.[birikma] || null
}

export default MALUMOTLAR
