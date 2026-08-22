// app/laboratoriya/3d/lib/tekstura-sifati.js
//
// Tekstura filtrlashning YAGONA EGASI.
//
// MUAMMO (2026-08-22 da o'lchandi). Filtr sozlamalari besh faylga
// tarqalgan va har birida boshqacha edi:
//
//   protsedural-tekstura.js  anisotropy = 4   (faqat yog'och)
//   materiallar.js           umuman yo'q      (pol va devor!)
//   javon-3d.js              LinearFilter
//   jihoz-modellari.js       LinearFilter
//   xona-modellari.js        ikkalasi ham
//
// Ya'ni xonaning eng katta ikki yuzasi — POL va DEVOR — anizotropiyasiz
// va mipmapsiz chizilardi. 4K ekranda aynan shu ikkisi loyqa ko'rinadi:
// pol qiya burchakda ko'riladi va anizotropiyasiz uzoqqa borgan sari
// yuviladi.
//
// IKKI XIL TEKSTURA BOR — ARALASHTIRMANG
//
// 1. KATTA STATIK YUZA (pol, devor, stol usti). Bir marta yasaladi,
//    takrorlanadi, qiya ko'riladi. Mipmap va anizotropiya SHART.
//
// 2. DINAMIK CANVAS (tarozi ekrani, yorliqlar, planshet). Har
//    yangilanishda qayta chiziladi. Bularda `LinearFilter` TO'G'RI:
//    mipmapni har kadrda qayta yasash qimmat va ular baribir ekranga
//    to'g'ri qaraydi, ya'ni anizotropiyadan foyda yo'q.
//
// Shuning uchun bu modul faqat 1-turga qo'llanadi. 2-turga tegilmaydi.

import * as THREE from "three";

/**
 * Katta statik yuzaning teksturasini 4K uchun sozlaydi.
 *
 * @param {THREE.Texture} tekstura
 * @param {number} anizotrop profil so'ragan daraja
 * @param {number} maksAnizotrop `renderer.capabilities.getMaxAnisotropy()`
 */
export function kattaYuzaniSozla(tekstura, anizotrop, maksAnizotrop) {
  if (!tekstura) return tekstura;
  // Mipmapsiz uzoqdagi sirt miltillaydi (aliasing), va piksel qancha
  // ko'p bo'lsa shuncha yomon — ya'ni 4K da eng yomon.
  tekstura.generateMipmaps = true;
  tekstura.minFilter = THREE.LinearMipmapLinearFilter;
  tekstura.magFilter = THREE.LinearFilter;
  // Anizotropiya qurilma imkoniyatidan oshmaydi. Qattiq son yozish
  // kuchli GPU da imkoniyatni behuda qoldirardi, kuchsizida esa jim
  // pastga tushirilardi.
  tekstura.anisotropy = Math.max(1, Math.min(anizotrop, maksAnizotrop || 1));
  tekstura.needsUpdate = true;
  return tekstura;
}
