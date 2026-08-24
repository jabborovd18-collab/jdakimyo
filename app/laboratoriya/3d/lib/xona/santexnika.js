// app/laboratoriya/3d/lib/xona/santexnika.js
//
// Santexnika: yuvinish rakovinasi.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { XONA } from "../sozlama.js";


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

  // 1. Rakovina chinni vannasi (Kosa)
  const botiqGeo = new THREE.BoxGeometry(0.6, 0.26, 0.45);
  const botiq = new THREE.Mesh(botiqGeo, chinniMat);
  botiq.position.y = -0.1;
  botiq.castShadow = true;
  botiq.receiveShadow = true;
  group.add(botiq);

  // 2. Xrom kran ustuni va egik trubasi
  const kranAsosGeo = new THREE.CylinderGeometry(0.016, 0.02, 0.18, 16);
  const kranAsos = new THREE.Mesh(kranAsosGeo, kranMat);
  kranAsos.position.set(0, 0.09, -0.16);
  kranAsos.castShadow = true;
  group.add(kranAsos);

  const kranTrubaGeo = new THREE.TorusGeometry(0.07, 0.014, 12, 16, Math.PI);
  const kranTruba = new THREE.Mesh(kranTrubaGeo, kranMat);
  kranTruba.rotation.y = Math.PI / 2;
  kranTruba.position.set(0, 0.18, -0.09);
  kranTruba.castShadow = true;
  group.add(kranTruba);

  // Kran jo'mragi (Lever)
  const jomrakGeo = new THREE.BoxGeometry(0.015, 0.04, 0.015);
  const jomrak = new THREE.Mesh(jomrakGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }));
  jomrak.position.set(0, 0.18, -0.16);
  jomrak.castShadow = true;
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

  // ═══════════════════════════════════════════════════════════
  // 5. RAKOVINA TAYANCHI: LABORATORIYA TUMBASI, SIFON VA KRONSHTEYN
  // (Havoda osilib qolishini bartaraf etadi, polgacha mustahkam tayanadi)
  // ═══════════════════════════════════════════════════════════
  const tumbaKorpusMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.35,
    metalness: 0.15,
  });
  const tumbaEshikMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.05,
  });
  const sokolMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.6,
  });

  // 5.1. Asosiy tumba korpusi (pol y=-1.18 dan kosaning tubi y=-0.23 gacha)
  const tumbaKorpusGeo = new THREE.BoxGeometry(0.62, 0.94, 0.44);
  const tumbaKorpus = new THREE.Mesh(tumbaKorpusGeo, tumbaKorpusMat);
  tumbaKorpus.position.set(0, -0.70, -0.005);
  tumbaKorpus.castShadow = true;
  tumbaKorpus.receiveShadow = true;
  group.add(tumbaKorpus);

  // 5.2. Pastki sokol (plintus)
  const sokolGeo = new THREE.BoxGeometry(0.58, 0.06, 0.40);
  const sokol = new THREE.Mesh(sokolGeo, sokolMat);
  sokol.position.set(0, -1.15, -0.005);
  sokol.receiveShadow = true;
  group.add(sokol);

  // 5.3. Ikkita old eshikcha
  const eshikGeo = new THREE.BoxGeometry(0.285, 0.82, 0.016);
  const chapEshik = new THREE.Mesh(eshikGeo, tumbaEshikMat);
  chapEshik.position.set(-0.148, -0.67, 0.22);
  chapEshik.castShadow = true;
  chapEshik.receiveShadow = true;
  group.add(chapEshik);

  const ongEshik = new THREE.Mesh(eshikGeo, tumbaEshikMat);
  ongEshik.position.set(0.148, -0.67, 0.22);
  ongEshik.castShadow = true;
  ongEshik.receiveShadow = true;
  group.add(ongEshik);

  // 5.4. Xrom metall tutqichlar
  const tutqichGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.12, 12);
  const chapTutqich = new THREE.Mesh(tutqichGeo, kranMat);
  chapTutqich.position.set(-0.03, -0.65, 0.235);
  chapTutqich.castShadow = true;
  group.add(chapTutqich);

  const ongTutqich = new THREE.Mesh(tutqichGeo, kranMat);
  ongTutqich.position.set(0.03, -0.65, 0.235);
  ongTutqich.castShadow = true;
  group.add(ongTutqich);

  // 5.5. Sifon va drenaj tizimi (P-trap)
  const drenajHalqaGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.004, 16);
  const drenajHalqa = new THREE.Mesh(drenajHalqaGeo, kranMat);
  drenajHalqa.position.set(0, -0.228, -0.02);
  group.add(drenajHalqa);

  const sifonTrubaGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.12, 16);
  const sifonTruba = new THREE.Mesh(sifonTrubaGeo, kranMat);
  sifonTruba.position.set(0, -0.29, -0.02);
  sifonTruba.castShadow = true;
  group.add(sifonTruba);

  const sifonIdishGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.07, 16);
  const sifonIdish = new THREE.Mesh(sifonIdishGeo, kranMat);
  sifonIdish.position.set(0, -0.37, -0.02);
  sifonIdish.castShadow = true;
  group.add(sifonIdish);

  const chiqishTrubaGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16);
  const chiqishTruba = new THREE.Mesh(chiqishTrubaGeo, kranMat);
  chiqishTruba.rotation.x = Math.PI / 2;
  chiqishTruba.position.set(0, -0.36, -0.11);
  chiqishTruba.castShadow = true;
  group.add(chiqishTruba);

  // 5.6. Devorga mustahkamlovchi L-kronshteynlar
  const kronshteynMat = kranMat;
  const kronshteynGorizGeo = new THREE.BoxGeometry(0.02, 0.02, 0.20);
  const kronshteynVertGeo = new THREE.BoxGeometry(0.02, 0.14, 0.02);

  const chapKronG = new THREE.Mesh(kronshteynGorizGeo, kronshteynMat);
  chapKronG.position.set(-0.28, -0.24, -0.12);
  chapKronG.castShadow = true;
  group.add(chapKronG);

  const chapKronV = new THREE.Mesh(kronshteynVertGeo, kronshteynMat);
  chapKronV.position.set(-0.28, -0.31, -0.21);
  chapKronV.castShadow = true;
  group.add(chapKronV);

  const ongKronG = new THREE.Mesh(kronshteynGorizGeo, kronshteynMat);
  ongKronG.position.set(0.28, -0.24, -0.12);
  ongKronG.castShadow = true;
  group.add(ongKronG);

  const ongKronV = new THREE.Mesh(kronshteynVertGeo, kronshteynMat);
  ongKronV.position.set(0.28, -0.31, -0.21);
  ongKronV.castShadow = true;
  group.add(ongKronV);

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
