// app/laboratoriya/3d/lib/jihoz/idishlar.js
//
// Shisha idishlar: probirka, stakan, kolbalar, o'lchov idishlari.
//
// BRIF-05: `jihoz-modellari.js` (1184 qator) mazmun bo'yicha
// bo'lindi. Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { suyuqlikYasa } from "../materiallar.js";
import { EFFEKT_RANGLARI } from "@/lib/lab-modda.js";
import { qaynashZarrachalariYasa, yorliqQosh } from "./yordamchi.js";


// 1. PROBIRKA — Kichik hajmdagi sifat reaksiyalari va cho'ktirish tajribalarini o'tkazish uchun asosiy shisha idish.
export function probirkaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  // Silindr tanasi (r=0.045, h=0.28, segment soni 32)
  const silindrGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.24, 32, 1, true);
  const silindr = new THREE.Mesh(silindrGeo, shishaMat);
  silindr.position.y = 0.165;
  group.add(silindr);

  // Yarim shar tubi
  const tubGeo = new THREE.SphereGeometry(0.045, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
  const tub = new THREE.Mesh(tubGeo, shishaMat);
  tub.position.y = 0.045;
  tub.rotation.x = Math.PI;
  group.add(tub);

  // Og'iz halqasi
  const halqaGeo = new THREE.TorusGeometry(0.046, 0.005, 12, 32);
  const halqa = new THREE.Mesh(halqaGeo, shishaMat);
  halqa.position.y = 0.285;
  halqa.rotation.x = Math.PI / 2;
  group.add(halqa);

  // Suyuqlik va cho'kma mesh
  const suyuqlikGeo = new THREE.CylinderGeometry(0.041, 0.041, 0.22, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.22, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  // Qaynash girdobi va bug' zarrachalari
  const qaynash = qaynashZarrachalariYasa(0.04, 0.22);
  group.add(qaynash.group);

  group.userData = {
    kalit: "probirka",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.29,
    suyuqlikMaxBalandlik: 0.22,
    suyuqlikTubY: 0.04,
    tanlanadi: true,
  };

  yorliqQosh(group, "Probirka");

  return group;
}


// 2. STAKAN — Suyuqliklarni aralashtirish, isitish va vaqtincha saqlash uchun kimyoviy shisha stakan.
export function stakanYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  // BRIF-02 — shisha qobiq ZAXIRA. Model kelganda `assetlarniQollash`
  // shu ikkisini `stakan.glb` bilan almashtiradi.
  //
  // Nega zaxira umuman qoladi: `jihozYasa` sinxron va uni asinxron
  // qilish butun tajriba mantig'iga tarqalardi. Shuning uchun stakan
  // avval har doim protsedural yasaladi va sahna hech qachon bo'sh
  // qolmaydi — model kechiksa ham, umuman kelmasa ham.
  const silindrGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 32, 1, true);
  const silindr = new THREE.Mesh(silindrGeo, shishaMat);
  silindr.position.y = 0.11;
  silindr.userData.zaxiraShisha = true;
  group.add(silindr);

  const tubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.008, 32);
  const tub = new THREE.Mesh(tubGeo, shishaMat);
  tub.position.y = 0.004;
  tub.userData.zaxiraShisha = true;
  group.add(tub);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.076, 0.076, 0.18, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.077, 0.077, 0.18, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  // Qaynash girdobi
  const qaynash = qaynashZarrachalariYasa(0.075, 0.18);
  group.add(qaynash.group);

  group.userData = {
    kalit: "stakan",
    // BRIF-02 — `assetlarniQollash` shu kalit bo'yicha topadi.
    assetKaliti: "stakan",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.22,
    suyuqlikMaxBalandlik: 0.18,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  yorliqQosh(group, "Stakan");

  return group;
}


// 3. KONUSSIMON-KOLBA — Erlenmeyer kolbasi: suyuqliklarni chayqatganda sachramaslik va titrlash uchun qulay idish.
export function konussimonKolbaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  // LatheGeometry bilan konus va tor bo'g'iz hosil qilamiz
  const nuqtalar = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.09, 0.0),
    new THREE.Vector2(0.09, 0.02),
    new THREE.Vector2(0.035, 0.18),
    new THREE.Vector2(0.035, 0.25),
    new THREE.Vector2(0.04, 0.26),
  ];
  const latheGeo = new THREE.LatheGeometry(nuqtalar, 32);
  const kolba = new THREE.Mesh(latheGeo, shishaMat);
  group.add(kolba);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.05, 0.085, 0.13, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.051, 0.086, 0.13, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  const qaynash = qaynashZarrachalariYasa(0.07, 0.13);
  group.add(qaynash.group);

  group.userData = {
    kalit: "konussimon-kolba",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.26,
    suyuqlikMaxBalandlik: 0.13,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  yorliqQosh(group, "Konussimon kolba");

  return group;
}


// 4. DUMALOQ-TUBLI-KOLBA — Bir tekis isitish va qaynash reaksiyalari uchun dumaloq tubli shisha kolba.
export function dumaloqTubliKolbaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const sharGeo = new THREE.SphereGeometry(0.085, 32, 32);
  const shar = new THREE.Mesh(sharGeo, shishaMat);
  shar.position.y = 0.095;
  group.add(shar);

  const boyinGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.11, 32, 1, true);
  const boyin = new THREE.Mesh(boyinGeo, shishaMat);
  boyin.position.y = 0.22;
  group.add(boyin);

  const suyuqlikGeo = new THREE.SphereGeometry(0.08, 32, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.position.y = 0.095;
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.SphereGeometry(0.081, 32, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.position.y = 0.095;
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  const qaynash = qaynashZarrachalariYasa(0.075, 0.15);
  group.add(qaynash.group);

  group.userData = {
    kalit: "dumaloq-tubli-kolba",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.27,
    suyuqlikMaxBalandlik: 0.15,
    suyuqlikTubY: 0.02,
    tanlanadi: true,
  };

  yorliqQosh(group, "Dumaloq tubli kolba");

  return group;
}


// 5. KOLBA — Umumiy kimyoviy eritma tayyorlash va saqlash uchun tekis tubli kolba.
export function kolbaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const nuqtalar = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.085, 0.0),
    new THREE.Vector2(0.085, 0.06),
    new THREE.Vector2(0.035, 0.16),
    new THREE.Vector2(0.035, 0.24),
    new THREE.Vector2(0.04, 0.25),
  ];
  const latheGeo = new THREE.LatheGeometry(nuqtalar, 32);
  const mesh = new THREE.Mesh(latheGeo, shishaMat);
  group.add(mesh);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.055, 0.08, 0.12, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.056, 0.081, 0.12, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  const qaynash = qaynashZarrachalariYasa(0.07, 0.12);
  group.add(qaynash.group);

  group.userData = {
    kalit: "kolba",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.25,
    suyuqlikMaxBalandlik: 0.12,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  yorliqQosh(group, "Kolba");

  return group;
}


// 6. KRISTALLIZATOR — Eritmalarni bug'latib kristallar olish uchun keng sirtli ochiq idish.
export function kristallizatorYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const silindrGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32, 1, true);
  const silindr = new THREE.Mesh(silindrGeo, shishaMat);
  silindr.position.y = 0.04;
  group.add(silindr);

  const tubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.006, 32);
  const tub = new THREE.Mesh(tubGeo, shishaMat);
  tub.position.y = 0.003;
  group.add(tub);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.116, 0.116, 0.06, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.117, 0.117, 0.06, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "kristallizator",
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.085,
    suyuqlikMaxBalandlik: 0.06,
    suyuqlikTubY: 0.005,
    tanlanadi: true,
  };

  yorliqQosh(group, "Kristallizator");

  return group;
}


// 14. O'LCHOV KOLBASI — Aniq molyar standart eritmalar tayyorlash uchun kalibrlangan tor bo'g'izli kolba (100 ml).
export function olchovKolbasiYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const belgiMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 }); // Qizil kalibrlash halqasi

  // Dumaloq tekis tub
  const tubGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.08, 32);
  const tub = new THREE.Mesh(tubGeo, shishaMat);
  tub.position.y = 0.04;
  group.add(tub);

  // Konus o'tish qismi
  const konusGeo = new THREE.CylinderGeometry(0.016, 0.065, 0.08, 32);
  const konus = new THREE.Mesh(konusGeo, shishaMat);
  konus.position.y = 0.12;
  group.add(konus);

  // Uzun ingichka bo'g'iz
  const boyinGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.14, 32, 1, true);
  const boyin = new THREE.Mesh(boyinGeo, shishaMat);
  boyin.position.y = 0.23;
  group.add(boyin);

  // 100 ml Kalibrlash Menisk Halqasi (Calibration Ring Mark)
  const halqaGeo = new THREE.TorusGeometry(0.0165, 0.0015, 12, 32);
  const halqa = new THREE.Mesh(halqaGeo, belgiMat);
  halqa.rotation.x = Math.PI / 2;
  halqa.position.y = 0.24; // Aynan 100ml menisk sathi
  group.add(halqa);

  // Shisha tiqin (Ground glass stopper)
  const tiqinGeo = new THREE.CylinderGeometry(0.017, 0.015, 0.03, 20);
  const tiqinMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, opacity: 0.7, transparent: true });
  const tiqin = new THREE.Mesh(tiqinGeo, tiqinMat);
  tiqin.position.y = 0.31;
  group.add(tiqin);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.014, 0.06, 0.20, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.75, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.015, 0.061, 0.20, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: EFFEKT_RANGLARI.chokmaSukut, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  const qaynash = qaynashZarrachalariYasa(0.055, 0.2);
  group.add(qaynash.group);

  group.userData = {
    kalit: "olchov-kolba",
    suyuqlikMesh,
    chokmaMesh,
    qaynashEffekti: qaynash,
    ogizBalandligi: 0.30,
    suyuqlikMaxBalandlik: 0.20,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  yorliqQosh(group, "O'lchov kolbasi (100ml)");

  return group;
}


// 15. O'LCHOV SILINDRI — Suyuqlik hajmini aniq o'lchash uchun shkalali shisha silindr (50 ml).
export function olchovSilindriYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const shkalaMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

  // Oltiburchakli mustahkam taglik (Hexagonal Base)
  // Taglik ilgari 6 segmentli (oltiburchak) edi — FPS rejimida yaqinlashganda
  // qirrali "Minecraft" ko'rinardi. Endi 32 segment bilan aylana silliq.
  const taglikGeo = new THREE.CylinderGeometry(0.055, 0.06, 0.012, 32);
  const taglik = new THREE.Mesh(taglikGeo, shishaMat);
  taglik.position.y = 0.006;
  group.add(taglik);

  // Asosiy silindr naycha
  const naychaGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.32, 32, 1, true);
  const naycha = new THREE.Mesh(naychaGeo, shishaMat);
  naycha.position.y = 0.17;
  group.add(naycha);

  // O'lchov shkala chiziqchalari (10ml, 20ml, 30ml, 40ml, 50ml)
  for (let i = 1; i <= 5; i++) {
    const markGeo = new THREE.BoxGeometry(0.016, 0.002, 0.001);
    const mark = new THREE.Mesh(markGeo, shkalaMat);
    mark.position.set(0.028, 0.03 + i * 0.055, 0);
    group.add(mark);
  }

  const suyuqlikGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.28, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.75, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit: "olchov-silindr",
    suyuqlikMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.33,
    suyuqlikMaxBalandlik: 0.28,
    suyuqlikTubY: 0.012,
    tanlanadi: true,
  };

  yorliqQosh(group, "O'lchov silindri (50ml)");

  return group;
}


// 16. SOAT SHISHASI — Qattiq tuz va kristallarni tarozida tortish uchun sferik botiq shisha plastinka.
export function soatShishasiYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.45, transparent: true });

  const plastinkaGeo = new THREE.SphereGeometry(0.06, 32, 16, 0, Math.PI * 2, Math.PI * 0.7, Math.PI * 0.3);
  const plastinka = new THREE.Mesh(plastinkaGeo, shishaMat);
  plastinka.rotation.x = Math.PI;
  plastinka.position.y = 0.015;
  group.add(plastinka);

  const moddaGeo = new THREE.ConeGeometry(0.035, 0.018, 16);
  const moddaMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.7 });
  const moddaMesh = new THREE.Mesh(moddaGeo, moddaMat);
  moddaMesh.position.y = 0.012;
  moddaMesh.visible = false;
  group.add(moddaMesh);

  group.userData = {
    kalit: "soat-shishasi",
    suyuqlikMesh: moddaMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.04,
    tanlanadi: true,
  };

  yorliqQosh(group, "Soat shishasi");

  return group;
}
