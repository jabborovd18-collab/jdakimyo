// Sahna grafini SANASH — chiroq, interaktiv ob'ekt, stansiya meshlari
// va GL renderer nomi.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Hammasi bir oila: kadrga
// emas, SAHNA DARAXTIGA qaraydi va hech narsani o'zgartirmaydi.

import * as THREE from "three";

import { HIMOYALANGAN_NOMLAR } from "../lib/geometriya-birlashtirish.js";

export function rendererNominiOl(gl) {
  const kengaytma = gl.getExtension("WEBGL_debug_renderer_info");
  if (kengaytma) {
    const nom = gl.getParameter(kengaytma.UNMASKED_RENDERER_WEBGL);
    if (nom) return String(nom);
  }
  return String(gl.getParameter(gl.RENDERER) || "Noma'lum WebGL renderer");
}

// BRIF-07 — nishon tanlay oladigan ob'ektlar soni.
// useYurish.js ota-zanjir bo'ylab `userData.kalit`/`tanlanadi` ni qidiradi.
export function interaktivlarniSana(scene) {
  let soni = 0;
  scene.traverse((o) => {
    if (o.userData?.kalit || o.userData?.tanlanadi) soni += 1;
  });
  return soni;
}

// BRIF-07 — nomli stansiyalar joyidami VA ichida mesh qoldimi.
//
// NEGA FAQAT SON YETMAYDI: birlashtirish guruhning O'ZINI qoldirib,
// ichidagi meshlarni tortib olishi mumkin. Shunda `getObjectByName`
// baribir tugun qaytaradi va har qanday "bormi?" sanog'i o'tadi —
// stansiya esa ko'rinmay qoladi. Shuning uchun mesh sanaladi.
//
// Ro'yxat `geometriya-birlashtirish.js` dan keladi: birlashtiruvchi
// himoyalaydi, o'lchagich tekshiradi — ikkalasi bitta manbadan
// (AGENTS.md 1-band).
export function stansiyaMeshlariniSana(scene) {
  const natija = {};
  for (const nom of HIMOYALANGAN_NOMLAR) {
    const tugun = scene.getObjectByName(nom);
    let mesh = 0;
    if (tugun) {
      tugun.traverse((o) => {
        if (o.isMesh) mesh += 1;
      });
    }
    natija[nom] = mesh;
  }
  return natija;
}

export function chiroqlarniSana(scene) {
  let soni = 0;
  scene.traverse((obyekt) => {
    if (obyekt instanceof THREE.Light) soni += 1;
  });
  return soni;
}
