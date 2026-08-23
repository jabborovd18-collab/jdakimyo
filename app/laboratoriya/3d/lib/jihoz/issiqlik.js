// app/laboratoriya/3d/lib/jihoz/issiqlik.js
//
// Issiqlik manbai va tayanchlar: spirtovka, shtativ, probirka shtativi.
//
// BRIF-05: `jihoz-modellari.js` (1184 qator) mazmun bo'yicha
// bo'lindi. Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { alangaNuriniYarat } from "../yoruglik.js";
import { yorliqQosh } from "./yordamchi.js";


// 9. SPIRTOVKA — Moddalarni isitish va alanga reaksiyalari uchun spirtli yoritgich-isitgich.
export function spirtovkaYasa(materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, opacity: 0.4, transparent: true });

  // 1. Shisha korpus (Faceted Alcohol Reservoir)
  const tanaGeo = new THREE.CylinderGeometry(0.055, 0.075, 0.08, 24);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = 0.04;
  group.add(tana);

  // Ichidagi spirt suyuqligi
  const spirtGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.05, 20);
  const spirtMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
  const spirt = new THREE.Mesh(spirtGeo, spirtMat);
  spirt.position.y = 0.025;
  group.add(spirt);

  // 2. Metall bo'g'iz va qopqoq
  const qopqoqGeo = new THREE.CylinderGeometry(0.022, 0.026, 0.025, 24);
  const qopqoq = new THREE.Mesh(qopqoqGeo, metallMat);
  qopqoq.position.y = 0.09;
  group.add(qopqoq);

  // 3. Paxtali pilik (Wick)
  const pilikGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.025, 16);
  const pilikMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
  const pilik = new THREE.Mesh(pilikGeo, pilikMat);
  pilik.position.y = 0.11;
  group.add(pilik);

  // 4. Realistik Alanga guruhi (Dual-layer Flame)
  const alangaGroup = new THREE.Group();
  alangaGroup.name = "Spirtovka_Alangasi";
  alangaGroup.position.set(0, 0.125, 0);
  alangaGroup.visible = false;

  // Ichki ko'k alanga konusi (Blue Core)
  const kokAlangaGeo = new THREE.ConeGeometry(0.012, 0.04, 16);
  const kokAlangaMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.9 });
  const kokAlanga = new THREE.Mesh(kokAlangaGeo, kokAlangaMat);
  kokAlanga.position.y = 0.02;
  alangaGroup.add(kokAlanga);

  // Tashqi to'q sariq-sariq alanga (Outer Orange Flame)
  const sariqAlangaGeo = new THREE.ConeGeometry(0.024, 0.075, 16);
  const sariqAlangaMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 });
  const sariqAlanga = new THREE.Mesh(sariqAlangaGeo, sariqAlangaMat);
  sariqAlanga.position.y = 0.038;
  alangaGroup.add(sariqAlanga);

  // Alanga nurli chirog'i (Point Light)
  const alangaNuri = alangaNuriniYarat();
  alangaNuri.position.y = 0.04;
  alangaNuri.visible = false;
  alangaGroup.add(alangaNuri);

  group.add(alangaGroup);

  const alanganiYangila = (yoqilgan = false) => {
    alangaGroup.visible = yoqilgan;
    group.userData.yoqilgan = yoqilgan;
    alangaNuri.visible = yoqilgan;
  };

  group.userData = {
    kalit: "spirtovka",
    suyuqlikMesh: null,
    chokmaMesh: null,
    alanga: alangaGroup,
    sariqAlanga,
    kokAlanga,
    alangaNuri,
    alanganiYangila,
    yoqilgan: false,
    ogizBalandligi: 0.18,
    tanlanadi: true,
  };

  yorliqQosh(group, "Spirtovka");

  return group;
}


// 10. SHTATIV — Kolbalar va apparatlarni muvozanatda ushlab turuvchi metall tayanch shtativ.
export function shtativYasa(materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x9aa4b2, metalness: 0.8 });

  const asosGeo = new THREE.BoxGeometry(0.25, 0.02, 0.18);
  const asos = new THREE.Mesh(asosGeo, metallMat);
  asos.position.y = 0.01;
  group.add(asos);

  const novGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.45, 16);
  const nov = new THREE.Mesh(novGeo, metallMat);
  nov.position.set(-0.09, 0.23, 0);
  group.add(nov);

  group.userData = {
    kalit: "shtativ",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.45,
    tanlanadi: true,
  };

  yorliqQosh(group, "Shtativ");

  return group;
}


// 11. PROBIRKA-SHTATIVI — Bir necha probirkani tik holatda ushlab turuvchi yog'och yoki plastik stend.
export function probirkaShtativiYasa(materiallar) {
  const group = new THREE.Group();
  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.8 });

  const asosGeo = new THREE.BoxGeometry(0.3, 0.02, 0.1);
  const asos = new THREE.Mesh(asosGeo, yogochMat);
  asos.position.y = 0.01;
  group.add(asos);

  const ustGeo = new THREE.BoxGeometry(0.3, 0.02, 0.1);
  const ust = new THREE.Mesh(ustGeo, yogochMat);
  ust.position.y = 0.14;
  group.add(ust);

  const ustunLGeo = new THREE.BoxGeometry(0.02, 0.12, 0.1);
  const ustunL = new THREE.Mesh(ustunLGeo, yogochMat);
  ustunL.position.set(-0.14, 0.07, 0);
  group.add(ustunL);

  const ustunR = ustunL.clone();
  ustunR.position.set(0.14, 0.07, 0);
  group.add(ustunR);

  group.userData = {
    kalit: "probirka-shtativi",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  yorliqQosh(group, "Probirka shtativi");

  return group;
}
