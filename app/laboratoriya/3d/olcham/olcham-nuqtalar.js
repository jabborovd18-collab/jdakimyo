// O'lchagich kamera nuqtalari — yagona manba.
//
// Nega alohida fayl: Playwright skripti ham, sahifa ham shu nomlarni
// ishlatadi. Ikki joyda yozilsa "oldin/keyin" taqqoslash buziladi.
//
// Koordinatalar xona o'lchamidan (16×12×4.2 m, markaz siljishi +0.4 z)
// va sozlama.js dagi stol kamerasidan keladi. Sahna o'zgarmaydi —
// faqat mavjud kamerani qo'yamiz.

import { KAMERA } from "../lib/sozlama.js";

export const MAVZULAR = ["tun", "siyoh", "grafit", "kunduz"];

export const NUQTA_NOMLARI = ["stol", "xona", "ship"];

export const NUQTALAR = {
  // Stol oldida, jihozlarga qaragan — sahnaning o'z boshlang'ich nigohi.
  stol: {
    kamera: KAMERA.boshlangich,
    nishon: KAMERA.nishon,
    up: [0, 1, 0],
  },
  // Xona markazida, gorizontal — orqa devordagi javonlarga qaragan.
  xona: {
    kamera: [0, 1.7, 0.4],
    nishon: [0, 1.7, -5.4],
    up: [0, 1, 0],
  },
  // Xona markazida, yuqoriga qaragan.
  // lookAt + default up=(0,1,0) gimbal lock beradi (nigoh up bilan
  // parallel), shuning uchun up ni -Z ga buramiz: kadrning "tepa"si
  // xonaning orqa devori tomoni.
  ship: {
    kamera: [0, 1.7, 0.4],
    nishon: [0, 4.2, 0.4],
    up: [0, 0, -1],
  },
};

export function nuqtaniOl(nom) {
  return NUQTALAR[nom] || NUQTALAR.stol;
}
