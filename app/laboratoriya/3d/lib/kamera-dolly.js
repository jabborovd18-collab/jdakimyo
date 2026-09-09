// app/laboratoriya/3d/lib/kamera-dolly.js
//
// KINEMATIK KAMERA — Dolly Zoom ("Mortal Kombat X-Ray" sho'ng'ishi
// uchun zamin, BRIF-05 2-bosqich, 4-band).
//
// Dolly zoom nima: kamera nishonga JISMONAN yaqinlashadi va bir
// vaqtda FOV shunday kengayadiki (yoki torayadiki), nishon ekranda
// bir xil o'lchamda qoladi — orqa fon esa "cho'zilib" dramatik
// effekt beradi (Hitchcock/Vertigo effekti).
//
// HOZIRCHA HECH QAYERDA CHAQIRILMAYDI. Bu ataylab: BRIF-05 sharti —
// bitta ham vizual holat o'zgarmasin. Kelajakdagi X-Ray sho'ng'ish
// brifi buni modal ochilishidan oldin chaqiradi va `qaytar()` bilan
// asl holatga qaytadi.
//
// Nega alohida faylda: kamera harakati sahna qurilishiga (useSahna)
// ham, HUD ga ham tegishli emas — u sof matematika. rAF sikli
// funksiyaning o'zida, tashqi rendererga bog'lanmaydi (kamera
// matritsasi har kadrda baribir yangilanadi).

import * as THREE from "three";

// KINO REJIM — dolly zoom paytida FPS yurish sikli kamerani qo'yib
// turishi uchun bayroq. `useYurish` har kadrda o'qiydi: faol bo'lsa
// harakat/kolliziya/lookAt o'tkazib yuboriladi (rAF sikli to'xtamaydi,
// DRS ishlayveradi). Bitta yozuvchi — X-Ray sho'ng'ish (korinish.js).
export const kinoRejim = { faol: false };

/** Silliq tezlanish-sekinlanish (easeInOutCubic). */
export function silliqlash(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Kamerani `targetPosition` tomon dolly-zoom bilan olib boradi.
 *
 * @param {THREE.PerspectiveCamera} kamera  jonli sahna kamerasi
 * @param {THREE.Vector3|{x,y,z}} targetPosition  sho'ng'ish nishoni
 *        (masalan idish markazining dunyo koordinatasi)
 * @param {number} zoomFactor  1 dan katta — yaqinlashish darajasi
 *        (2 = masofaning yarmigacha boradi, FOV mos ravishda kengayadi)
 * @param {object} [sozlama]
 * @param {number} [sozlama.davomiylikMs=900]  animatsiya davomiyligi
 * @param {(t:number)=>number} [sozlama.egri=silliqlash]  easing
 * @returns {Promise<{qaytar: () => Promise<boolean>}|false>}
 *          tugagach asl holatga qaytaruvchi `qaytar()` beriladi;
 *          kamera yaroqsiz bo'lsa `false`.
 *
 * MUHIM: bu funksiya `controls.enabled` ga tegmaydi — chaqiruvchi
 * animatsiya paytida boshqaruvni o'zi o'chirib-yoqishi kerak
 * (pointer-lock rejimida controls baribir o'chiq).
 */
export function kameraDollyZoom(kamera, targetPosition, zoomFactor, sozlama = {}) {
  if (!kamera?.isPerspectiveCamera || !targetPosition || !(zoomFactor > 0)) {
    return Promise.resolve(false);
  }

  const davomiylikMs = sozlama.davomiylikMs ?? 900;
  const egri = sozlama.egri ?? silliqlash;

  const nishon = new THREE.Vector3(
    targetPosition.x ?? 0,
    targetPosition.y ?? 0,
    targetPosition.z ?? 0,
  );

  const boshJoy = kamera.position.clone();
  const boshFov = kamera.fov;

  // Dolly zoom o'zgarmasi: ko'rinish balandligi = 2·d·tan(fov/2).
  // Nishon ekranda bir xil o'lchamda qolsin uchun shu ko'paytma
  // saqlanadi: d1·tan(fov1/2) = d0·tan(fov0/2).
  const boshMasofa = boshJoy.distanceTo(nishon);
  const oxirMasofa = boshMasofa / zoomFactor;
  const kenglik = boshMasofa * Math.tan(THREE.MathUtils.degToRad(boshFov / 2));
  const oxirFov = 2 * THREE.MathUtils.radToDeg(Math.atan(kenglik / oxirMasofa));

  const yonalish = boshJoy.clone().sub(nishon).normalize();

  const yurgiz = (dan, ga, fovDan, fovGa) => new Promise((hal) => {
    const bosh = performance.now();
    const qadam = (hozir) => {
      const t = Math.min(1, (hozir - bosh) / davomiylikMs);
      const s = egri(t);

      const masofa = dan + (ga - dan) * s;
      kamera.position.copy(nishon).addScaledVector(yonalish, masofa);
      kamera.fov = fovDan + (fovGa - fovDan) * s;
      kamera.updateProjectionMatrix();

      if (t < 1) {
        requestAnimationFrame(qadam);
      } else {
        hal(true);
      }
    };
    requestAnimationFrame(qadam);
  });

  return yurgiz(boshMasofa, oxirMasofa, boshFov, oxirFov).then(() => ({
    qaytar: () => yurgiz(oxirMasofa, boshMasofa, oxirFov, boshFov).then(() => {
      // Suzuvchi nuqta xatosi yig'ilmasin — asl qiymatlar aynan tiklanadi.
      kamera.position.copy(boshJoy);
      kamera.fov = boshFov;
      kamera.updateProjectionMatrix();
      return true;
    }),
  }));
}
