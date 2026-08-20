// O'lchagich kamera nuqtalari va supurish qoidalari — yagona manba.
//
// Nega alohida fayl: Playwright skripti koordinatani takrorlamaydi;
// sahifa shu yerdagi nomlar va qat'iy urug'li generatorni o'zi beradi.
// Aks holda "oldin/keyin" taqqoslashda kamera sezdirmay siljishi mumkin.
//
// Koordinatalar xona o'lchamidan (16×12×4.2 m, markaz siljishi +0.4 z)
// va sozlama.js dagi stol kamerasidan keladi. Sahna o'zgarmaydi —
// faqat mavjud kamerani qo'yamiz.

import { KAMERA } from "../lib/sozlama.js";

export const NUQTA_NOMLARI = ["stol", "xona", "ship", "pol"];

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
  // Markaziy stol polni to'sib qo'yadi. Shu sabab kamera oldingi ochiq
  // yo'lakka surilgan va pastga qaratilgan: kadr geometriya nomini emas,
  // haqiqatan pol materialini o'lchaydi.
  pol: {
    kamera: [0, 1.6, 3.4],
    nishon: [0, 0, 3.4],
    up: [0, 0, 1],
  },
};

// Chegaralar devordan xavfsiz masofada: tasodifiy kamera devor ichiga
// tushsa, qamrov o'rniga bir tekis devor teksturasini o'lchab qolardi.
const SUPURISH = {
  soni: 24,
  sukutUrugi: 20260820,
  y: 1.6,
  xMin: -7.2,
  xMax: 7.2,
  zMin: -4.8,
  zMax: 5.6,
  vertikalMin: -30,
  vertikalMax: 10,
};

function urugniOl(xomUrug) {
  const urug = xomUrug === undefined || xomUrug === null || xomUrug === ""
    ? SUPURISH.sukutUrugi
    : Number(xomUrug);
  if (!Number.isInteger(urug) || urug < 0 || urug > 0xffffffff) {
    throw new Error("LAB3D_SEED 0..4294967295 oralig'idagi butun son bo'lishi shart");
  }
  return urug >>> 0;
}

function qatiyTasodif(urug) {
  let holat = urug >>> 0;
  return () => {
    // LCG tanlandi, chunki Math.random brauzer versiyasiga bog'liq;
    // 32-bit amallar esa barcha JS muhitida aynan bir ketma-ketlik beradi.
    holat = (Math.imul(1664525, holat) + 1013904223) >>> 0;
    return holat / 0x100000000;
  };
}

/**
 * Xona bo'ylab qat'iy urug'li, ko'z balandligidagi kamera namunalari.
 * @param {number|string|undefined} xomUrug
 */
export function supurishNuqtalariniYarat(xomUrug) {
  const urug = urugniOl(xomUrug);
  const tasodif = qatiyTasodif(urug);
  const nuqtalar = [];

  for (let indeks = 0; indeks < SUPURISH.soni; indeks += 1) {
    const x = SUPURISH.xMin + tasodif() * (SUPURISH.xMax - SUPURISH.xMin);
    const z = SUPURISH.zMin + tasodif() * (SUPURISH.zMax - SUPURISH.zMin);
    const gorizontal = tasodif() * Math.PI * 2;
    const vertikalDaraja = SUPURISH.vertikalMin
      + tasodif() * (SUPURISH.vertikalMax - SUPURISH.vertikalMin);
    const vertikal = vertikalDaraja * Math.PI / 180;
    const gorizontalUzunlik = Math.cos(vertikal);
    const masofa = 10;
    const dx = Math.sin(gorizontal) * gorizontalUzunlik;
    const dy = Math.sin(vertikal);
    const dz = -Math.cos(gorizontal) * gorizontalUzunlik;

    nuqtalar.push({
      kamera: [x, SUPURISH.y, z],
      nishon: [
        x + dx * masofa,
        SUPURISH.y + dy * masofa,
        z + dz * masofa,
      ],
      up: [0, 1, 0],
      joy: {
        indeks: indeks + 1,
        x,
        y: SUPURISH.y,
        z,
        gorizontalDaraja: gorizontal * 180 / Math.PI,
        vertikalDaraja,
      },
    });
  }

  return { urug, nuqtalar };
}

export function nuqtaniOl(nom) {
  return NUQTALAR[nom] || NUQTALAR.stol;
}
