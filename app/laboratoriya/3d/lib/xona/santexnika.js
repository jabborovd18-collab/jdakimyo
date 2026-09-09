// app/laboratoriya/3d/lib/xona/santexnika.js
//
// Santexnika: yuvinish rakovinasi.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { XONA } from "../sozlama.js";
import { soyaTashlasin } from "./yordamchi.js";


/** Yuvinish Rakovinasi, Distillangan Suv Krani va Oqim modeli */
export function rakovinaYasa(materiallar) {

  const group = new THREE.Group();
  group.name = "Yuvinish_Rakovinasi";
  // Chap devordagi ish yuzasi USTIDA.
  //
  // Ikki marta tuzatildi va ikkinchisining sababi yozib qo'yilsin:
  //
  // 1. Ilgari rakovina devordan 2.5 m narida, tayanchsiz havoda
  //    turardi. Xona kattalashganda bu ochiq ko'rinib qoldi.
  // 2. Birinchi tuzatishda u yuzaga ko'chirildi, lekin BALANDLIK
  //    noto'g'ri hisoblandi: kosa guruh markazida (+-0.13) va guruh
  //    y = 0.9 da edi, ya'ni kosa 0.77..1.03 oralig'ida — yuza esa
  //    1.05 da. Natijada kosa shkaf ICHIDA qoldi va faqat old
  //    eshikdan chiqib turdi (egasi rasmda ko'rsatdi).
  //
  // Endi kosaning TUBI yuza sirtida turadi: guruh markazi
  // 1.05 + 0.13 = 1.18.
  //
  // Burilish +90°: lokal -z (jo'mrak tomoni) dunyo -x ga, ya'ni
  // devorga qaraydi. Kosa chuqurligi 0.45, yuza chuqurligi 0.42 —
  // shuning uchun markaz devorga 2 sm suriladi.
  const YUZA_BALANDLIGI = 1.05;   // pastkiShkafYasa chapBalandlik
  const KOSA_YARIM = 0.13;        // botiqGeo balandligining yarmi
  group.position.set(
    -(XONA.eni / 2 - 0.19),
    YUZA_BALANDLIGI + KOSA_YARIM,
    -XONA.boyi / 2 + XONA.markazZ + 1.6,
  );
  group.rotation.y = Math.PI / 2;

  const chinniMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 });
  const kranMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.1 });
  const suvMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, roughness: 0.1 });

  // 1. Rakovina chinni vannasi
  const botiqGeo = new THREE.BoxGeometry(0.6, 0.26, 0.45);
  const botiq = new THREE.Mesh(botiqGeo, chinniMat);
  botiq.position.y = -0.1;
  group.add(botiq);

  // 2. Xrom kran ustuni va egik trubasi
  const kranAsosGeo = new THREE.CylinderGeometry(0.016, 0.02, 0.18, 16);
  const kranAsos = new THREE.Mesh(kranAsosGeo, kranMat);
  kranAsos.position.set(0, 0.09, -0.16);
  group.add(kranAsos);

  const kranTrubaGeo = new THREE.TorusGeometry(0.07, 0.014, 12, 16, Math.PI);
  const kranTruba = new THREE.Mesh(kranTrubaGeo, kranMat);
  kranTruba.rotation.y = Math.PI / 2;
  kranTruba.position.set(0, 0.18, -0.09);
  group.add(kranTruba);

  // Kran jo'mragi (Lever)
  const jomrakGeo = new THREE.BoxGeometry(0.015, 0.04, 0.015);
  const jomrak = new THREE.Mesh(jomrakGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
  jomrak.position.set(0, 0.18, -0.16);
  jomrak.userData = { kalit: "rakovina_kran", nom: "Distillangan Suv Krani", tanlanadi: true };
  group.add(jomrak);

  // 3. Dinamik Distillangan Suv Oqimi (Water Stream)
  const suvOqimiGeo = new THREE.CylinderGeometry(0.014, 0.018, 0.24, 16);
  const suvOqimiMesh = new THREE.Mesh(suvOqimiGeo, suvMat);
  suvOqimiMesh.position.set(0, 0.04, -0.02);
  suvOqimiMesh.visible = false;
  group.add(suvOqimiMesh);

  // 4. Suv Sachrash Zarrachalari (Splashing droplets)
  const splashGeo = new THREE.BufferGeometry();
  const splashPos = new Float32Array(36);
  for (let i = 0; i < 12; i++) {
    splashPos[i * 3] = (Math.random() - 0.5) * 0.08;
    splashPos[i * 3 + 1] = -0.08 + Math.random() * 0.04;
    splashPos[i * 3 + 2] = -0.02 + (Math.random() - 0.5) * 0.08;
  }
  splashGeo.setAttribute("position", new THREE.BufferAttribute(splashPos, 3));
  const splashMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.012, transparent: true, opacity: 0.85 });
  const splashPoints = new THREE.Points(splashGeo, splashMat);
  splashPoints.visible = false;
  group.add(splashPoints);

  group.userData = {
    kalit: "rakovina",
    nom: "Yuvinish Rakovinasi",
    tanlanadi: true,
    suvOqimiMesh,
    splashPoints,
    suvOqmoqda: false,
    jomrakMesh: jomrak,
  };

  return group;
}


/**
 * Xavfsizlik Dushi va Ko'z Yuvish Stansiyasi (O'ng devorda).
 * `userData.dushniYangila` / `kozYuvishniYangila` orqali suv oqimi
 * jonli boshqariladi (`korinish.js`, `useYurish.js`).
 *
 * BRIF-05 (2-bosqich): `qobiq.js` dan ko'chirildi — suv-santexnika
 * mazmunan shu faylga tegishli. Kod va pozitsiyalar o'zgarmadi.
 */
export function xavfsizlikDushiniQosh(roomGroup, ramkaMat, profil) {
  const XONA_W = XONA.eni;
  const MZ = XONA.markazZ;

  const dushGroup = new THREE.Group();
  dushGroup.name = "Xavfsizlik_Dushi_Stansiyasi";
  dushGroup.position.set(XONA_W / 2 - 0.15, 0, MZ + 3.1);

  const suvMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
  const sariqMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });

  // Vertikal po'lat truba
  const trubaGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.8, 16);
  const truba = new THREE.Mesh(trubaGeo, ramkaMat);
  truba.position.y = 1.4;
  dushGroup.add(truba);

  // Dush kallagi
  const boshGeo = new THREE.ConeGeometry(0.18, 0.12, 20);
  const bosh = new THREE.Mesh(boshGeo, sariqMat);
  bosh.position.set(-0.35, 2.7, 0);
  dushGroup.add(bosh);

  // Tortish zanjiri va halqasi (Pull ring)
  const zanjirGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.6, 8);
  const zanjir = new THREE.Mesh(zanjirGeo, ramkaMat);
  zanjir.position.set(-0.35, 2.3, 0);
  dushGroup.add(zanjir);

  const halqaGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 16);
  const halqa = new THREE.Mesh(halqaGeo, sariqMat);
  halqa.position.set(-0.35, 2.0, 0);
  halqa.userData = { kalit: "xavfsizlik_dushi", nom: "Favqulodda Xavfsizlik Dushi Zanjiri", tanlanadi: true };
  dushGroup.add(halqa);

  // Dush suv kaskadi (Shower Cascade mesh)
  const dushSuvGeo = new THREE.CylinderGeometry(0.35, 0.55, 2.4, 20, 1, true);
  const dushSuvMesh = new THREE.Mesh(dushSuvGeo, suvMat);
  dushSuvMesh.position.set(-0.35, 1.4, 0);
  dushSuvMesh.visible = false;
  dushGroup.add(dushSuvMesh);

  // Ko'z yuvish vannasi (Eyewash basin)
  const vannaGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.1, 20);
  const vanna = new THREE.Mesh(vannaGeo, sariqMat);
  vanna.position.set(-0.35, 1.05, 0);
  vanna.userData = { kalit: "koz_yuvish", nom: "Ko'z Yuvish Favvorasi", tanlanadi: true };
  dushGroup.add(vanna);

  const favvoraGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.18, 12);
  const favvoraMesh = new THREE.Mesh(favvoraGeo, suvMat);
  favvoraMesh.position.set(-0.35, 1.15, 0);
  favvoraMesh.visible = false;
  dushGroup.add(favvoraMesh);

  const dushniYangila = (faol = false) => {
    dushSuvMesh.visible = faol;
  };

  const kozYuvishniYangila = (faol = false) => {
    favvoraMesh.visible = faol;
  };

  dushGroup.userData = {
    kalit: "xavfsizlik_dushi",
    nom: "Xavfsizlik Dushi va Ko'z Yuvish Stansiyasi",
    tanlanadi: true,
    dushniYangila,
    kozYuvishniYangila,
    dushFaol: false,
    kozFaol: false,
  };
  roomGroup.add(soyaTashlasin(dushGroup, profil));
}
