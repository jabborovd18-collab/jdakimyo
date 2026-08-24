// Sahnaning MAZMUNI — stol, javon, xona interyeri va boshlang'ich
// jihozlar. Quvur (renderer, kamera) `sahna-quvuri.js` da.
//
// `useSahna.js` dan ajratildi (BRIF-05).
//
// Geometriyani birlashtirish shu faylning OXIRGI qadami: u sahna
// to'liq yig'ilganda bir marta bajarilishi shart, ya'ni mazmunni
// qo'yadigan kod bilan bir joyda turgani xavfsizroq — yangi ob'ekt
// qo'shgan odam birlashtirish tartibini o'ylashi shart emas.

import * as THREE from "three";

import { STOL, SLOTLAR } from "./sozlama.js";
import { jihozYasa } from "./jihoz-modellari.js";
import { javon3dYasa } from "./javon-3d.js";
import { xonaInteryeriniYasa } from "./xona-modellari.js";
import { harakatsizGeometriyaniBirlashtir } from "./geometriya-birlashtirish.js";

export function mazmunniQur(scene, materiallar, profil) {
  // Slot -> THREE.Group. Hook uni o'z ref iga ko'chiradi.
  const jihozlar = new Map();

  // 7. Asosiy Tajriba Stoli
  const stolGeo = new THREE.BoxGeometry(STOL.eni, STOL.qalinligi, STOL.boyi);
  const stol = new THREE.Mesh(stolGeo, materiallar.yogoch);
  stol.position.set(0, STOL.balandligi - STOL.qalinligi / 2, 0);
  stol.receiveShadow = profil.soya;
  stol.castShadow = profil.soya;
  scene.add(stol);

  // To'rtta oyoq
  const oyoqBalandligi = STOL.balandligi - STOL.qalinligi;
  const oyoqGeo = new THREE.BoxGeometry(0.07, oyoqBalandligi, 0.07);
  const oyoqX = STOL.eni / 2 - 0.1;
  const oyoqZ = STOL.boyi / 2 - 0.1;
  for (const [x, z] of [[-oyoqX, oyoqZ], [oyoqX, oyoqZ], [-oyoqX, -oyoqZ], [oyoqX, -oyoqZ]]) {
    const oyoq = new THREE.Mesh(oyoqGeo, materiallar.yogoch);
    oyoq.position.set(x, oyoqBalandligi / 2, z);
    oyoq.castShadow = profil.soya;
    scene.add(oyoq);
  }

  // 8. Haqiqiy 3D Reagentlar Javoni va 4 Devorli Xona Interyerini sahnaga o'rnatish
  const javon3d = javon3dYasa(materiallar, profil);
  scene.add(javon3d);

  const xonaInteryeri = xonaInteryeriniYasa(materiallar, profil);
  scene.add(xonaInteryeri);

  // Boshlang'ich holatda 1 ta probirka va 1 ta spirtovkani stolga qo'yamiz
  const defProbirka = jihozYasa("probirka", materiallar, profil);
  defProbirka.userData.slotIndex = 1; // 2-slot: old qator, o'rta-chap
  const [px, py, pz] = SLOTLAR[1];
  defProbirka.position.set(px, py, pz);
  scene.add(defProbirka);
  jihozlar.set(1, defProbirka);

  const defSpirtovka = jihozYasa("spirtovka", materiallar, profil);
  defSpirtovka.userData.slotIndex = 3; // 4-slot: old qator, o'rta-o'ng
  const [sx, sy, sz] = SLOTLAR[3];
  defSpirtovka.position.set(sx, sy, sz);
  scene.add(defSpirtovka);
  jihozlar.set(3, defSpirtovka);

  // BRIF-02 — stakan sukut bo'yicha stolda turadi.
  //
  // Sabab quvurga bog'liq: `.glb` almashtiriladigan yagona idish shu.
  // U faqat foydalanuvchi qo'shganda paydo bo'lsa, asset quvuri
  // o'lchanadigan kadrda umuman ko'rinmasdi — ya'ni "model sahnada
  // ko'rinadi" mezonini hech qachon tekshirib bo'lmasdi.
  const defStakan = jihozYasa("stakan", materiallar, profil);
  defStakan.userData.slotIndex = 6; // 7-slot: o'rta qator, chap
  const [kx, ky, kz] = SLOTLAR[6];
  defStakan.position.set(kx, ky, kz);
  scene.add(defStakan);
  jihozlar.set(6, defStakan);

  const defTermometr = jihozYasa("termometr", materiallar, profil);
  defTermometr.userData.slotIndex = 8; // 9-slot: o'rta qator, o'rta-o'ng
  const [tx, ty, tz] = SLOTLAR[8];
  defTermometr.position.set(tx, ty, tz);
  scene.add(defTermometr);
  jihozlar.set(8, defTermometr);

  // BRIF-07 — harakatsiz geometriyani material va fazoviy zona bo'yicha
  // birlashtiramiz. Xona 100% qimirlamaydi, shuning uchun har devor
  // bo'lagi, javon tokchasi va stol oyog'i uchun alohida draw call
  // to'lash isrof.
  //
  // NEGA SAHNA ILDIZIDAN: birlashtirilishi kerak bo'lgan geometriya
  // uchta ildizga bo'lingan — xona interyeri, reagentlar javoni va
  // to'g'ridan-to'g'ri sahnaga qo'yilgan stol. Faqat xona interyerini
  // bersak, eng katta nishon (bitta materialdagi 53 ta javon karkasi
  // meshi) tashqarida qolardi.
  //
  // Bu qator hamma dastlabki ob'ekt qo'shilgandan KEYIN turadi:
  // birlashtirish bir marta, sahna to'liq yig'ilganda bajariladi.
  // Tanlanadigan shoxlarga (`userData.kalit`/`tanlanadi`/`sigim`)
  // tegilmaydi — himoya `geometriya-birlashtirish.js` da.
  const birlashuv = harakatsizGeometriyaniBirlashtir(scene);

  return { jihozlar, birlashuv, stolGeo, oyoqGeo };
}
