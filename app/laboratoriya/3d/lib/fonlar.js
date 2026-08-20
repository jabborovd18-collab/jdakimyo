// 3D laboratoriyaning yagona sahna ko'rinishi.
//
// Saytning umumiy `data-fon` tizimi boshqa qatlam (`globals.css` va
// `lib/sahifa-fon.js`). Bu fayl faqat Three.js sahnasining qat'iy ranglari
// va yorug'lik qiymatlarini saqlaydi. Fon almashtirgich egasi qarori bilan
// olib tashlangan; HUD shu ko'rinishga mos qolishi uchun kalit eksport qilinadi.

export const SUKUT_FON = "tun";

export const SAHNA_FONI = Object.freeze({
  nom: "Tun",
  izoh: "3D laboratoriyaning qat'iy ko'rinishi",
  fon: 0x070a12,
  tumanZichligi: 0.032,
  devor: 0x0e1424,
  stol: 0x1c2334,
  pol: 0x090c15,
  shisha: 0xcfe8ff,
  muhitKuchi: 0.35,
  yorugliklar: Object.freeze({
    muhit: Object.freeze({ rang: 0x404060, kuch: 0.9 }),
    asosiy: Object.freeze({ rang: 0xfffbeb, kuch: 1.4 }),
    toldiruvchi: Object.freeze({ rang: 0xa78bfa, kuch: 0.6 }),
  }),
});
