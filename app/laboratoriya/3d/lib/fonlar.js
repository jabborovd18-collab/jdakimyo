// 3D laboratoriyaning yagona sahna ko'rinishi.
//
// Saytning umumiy `data-fon` tizimi boshqa qatlam (`globals.css` va
// `lib/sahifa-fon.js`). Bu fayl faqat Three.js sahnasining qat'iy sirt,
// tuman va fon ranglarini saqlaydi; yorug'lik `yoruglik.js`da. Fon
// almashtirgich egasi qarori bilan olib tashlangan; HUD shu ko'rinishga
// mos qolishi uchun kalit eksport qilinadi.

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
});
