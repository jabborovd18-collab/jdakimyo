// app/laboratoriya/3d/lib/jihoz/asboblar.js
//
// O'lchov va yordamchi asboblar: byuretka, tomizgich, termometr,
// voronka, tayoqcha, spatula.
//
// BRIF-05: `jihoz-modellari.js` (1184 qator) mazmun bo'yicha
// bo'lindi. Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { yorliqTosigiSifatidaBelgila } from "../yorliqlar.js";
import { suyuqlikYasa } from "../materiallar.js";
import { yorliqQosh } from "./yordamchi.js";


// 7. BYURETKA — Titrlash va aniq hajmdagi uzluksiz oqim quyish uchun jo'mrakli uzun o'lchov naychasi.
export function byuretkaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x9aa4b2, metalness: 0.8 });

  // Uzun ingichka naycha
  const naychaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 32, 1, true);
  const naycha = new THREE.Mesh(naychaGeo, shishaMat);
  naycha.position.y = 0.35;
  group.add(naycha);

  // Jo'mrak (TorusGeometry + tutqich)
  const jomrakHalqaGeo = new THREE.TorusGeometry(0.025, 0.005, 12, 32);
  const jomrakHalqa = new THREE.Mesh(jomrakHalqaGeo, metallMat);
  jomrakHalqa.position.y = 0.08;
  jomrakHalqa.rotation.x = Math.PI / 2;
  group.add(jomrakHalqa);

  const tutqichGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.08, 16);
  const tutqich = new THREE.Mesh(tutqichGeo, metallMat);
  tutqich.position.set(0.04, 0.08, 0);
  tutqich.rotation.z = Math.PI / 2;
  group.add(tutqich);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.45, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.profil?.transmission ?? true);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit: "byuretka",
    suyuqlikMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.6,
    suyuqlikMaxBalandlik: 0.45,
    suyuqlikTubY: 0.1,
    tanlanadi: true,
    jomrakBurchagi: 0, // 0 - yopiq, Math.PI/2 - ochiq
  };

  yorliqQosh(group, "Byuretka");

  return group;
}


// 8. TOMIZGICH — Kam miqdorda (tomchilab) reagent qo'shish uchun rezina balonli pipetka.
export function tomizgichYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });
  const rezinaMat = materiallar?.rezina || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

  const naychaGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.18, 32);
  const naycha = new THREE.Mesh(naychaGeo, shishaMat);
  naycha.position.y = 0.09;
  group.add(naycha);

  const balonGeo = new THREE.SphereGeometry(0.025, 32, 16);
  const balon = new THREE.Mesh(balonGeo, rezinaMat);
  balon.position.y = 0.19;
  group.add(balon);

  group.userData = {
    kalit: "tomizgich",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.22,
    tanlanadi: true,
  };

  yorliqQosh(group, "Tomizgich");

  return group;
}


export function termometrYorliginiYasa(boshlangichHarorat = 25) {
  if (typeof document === "undefined") {
    const fake = new THREE.Sprite();
    return { sprite: fake, yangila: () => {} };
  }
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  const chiz = (t) => {
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.beginPath();
    ctx.roundRect(2, 2, 124, 60, 8);
    ctx.fill();

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.round(t)}°C`, 64, 42);
  };

  chiz(boshlangichHarorat);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.12, 0.06, 1);
  sprite.raycast = () => {};
  yorliqTosigiSifatidaBelgila(sprite);

  const yangila = (t) => {
    chiz(t);
    texture.needsUpdate = true;
  };

  return { sprite, yangila };
}


// 12. TERMOMETR — Eritma va reaksiya haroratini o'lchash uchun simobli yoki spirtli shisha termometr.
export function termometrYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const simobMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 });
  const shkalaMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });

  // 1. Shaffof shisha kapillyar quvur
  const tanaGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.32, 16);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = 0.16;
  group.add(tana);

  // 2. Qizil simob lampochkasi (Bulb reservoir)
  const bulbGeo = new THREE.SphereGeometry(0.014, 16, 16);
  const bulb = new THREE.Mesh(bulbGeo, simobMat);
  bulb.position.y = 0.014;
  group.add(bulb);

  // 3. Dinamik simob/spirt ustuni (Capillary Column)
  const maxUstunH = 0.26;
  const baseY = 0.02;
  const ustunGeo = new THREE.CylinderGeometry(0.003, 0.003, maxUstunH, 12);
  const ustun = new THREE.Mesh(ustunGeo, simobMat);
  ustun.position.y = baseY + (maxUstunH * 0.25) / 2;
  ustun.scale.y = 0.25; // 25°C sukut bo'yicha
  group.add(ustun);

  // 4. Shkala chiziqchalari (Graduation markings)
  for (let i = 0; i <= 10; i++) {
    const markGeo = new THREE.BoxGeometry(0.012, 0.0015, 0.001);
    const mark = new THREE.Mesh(markGeo, shkalaMat);
    mark.position.set(0.005, baseY + (maxUstunH / 10) * i, 0);
    group.add(mark);
  }

  // 5. Dinamik Harorat Raqamli Ko'rsatkichi (Badge Sprite)
  const { sprite: haroratSprite, yangila: haroratYorliqYangila } = termometrYorliginiYasa(25);
  haroratSprite.position.set(0, 0.36, 0);
  group.add(haroratSprite);

  // Haroratni yangilash funksiyasi
  const haroratniYangila = (harorat = 25) => {
    const clamped = Math.max(0, Math.min(120, Number(harorat) || 0));
    const ratio = Math.max(0.05, Math.min(1.0, clamped / 100));
    ustun.scale.y = ratio;
    ustun.position.y = baseY + (maxUstunH * ratio) / 2;
    haroratYorliqYangila(clamped);
  };

  group.userData = {
    kalit: "termometr",
    simobUstun: ustun,
    haroratniYangila,
    joriyHarorat: 25,
    ogizBalandligi: 0.32,
    tanlanadi: true,
  };

  yorliqQosh(group, "Termometr");

  return group;
}


// 13. VORONKA — Suyuqliklarni tor og'izli idishga quyish yoki filtr qog'ozi bilan cho'kmani ajratish uchun.
export function voronkaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const konusGeo = new THREE.ConeGeometry(0.06, 0.08, 32, 1, true);
  const konus = new THREE.Mesh(konusGeo, shishaMat);
  konus.position.y = 0.12;
  konus.rotation.x = Math.PI;
  group.add(konus);

  const nayGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 16, 1, true);
  const nay = new THREE.Mesh(nayGeo, shishaMat);
  nay.position.y = 0.04;
  group.add(nay);

  group.userData = {
    kalit: "voronka",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  yorliqQosh(group, "Voronka");

  return group;
}


// 17. SHISHA TAYOQCHA — Kristallarni eritish va aralashtirish uchun laboratoriya tayoqchasi.
export function shishaTayoqchaYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.5, transparent: true });

  const tayoqGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.28, 16);
  const tayoq = new THREE.Mesh(tayoqGeo, shishaMat);
  tayoq.position.y = 0.14;
  tayoq.rotation.z = Math.PI / 12; // 15 gradus engil qiyalik
  group.add(tayoq);

  group.userData = {
    kalit: "shisha-tayoqcha",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.28,
    tanlanadi: true,
  };

  yorliqQosh(group, "Shisha tayoqcha");

  return group;
}


// 18. SPATULA — Qattiq reaktiv va tuzlarni taroziga olish uchun zanglamas po'lat qoshiqcha.
export function spatulaYasa(materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.2 });

  const dastaGeo = new THREE.BoxGeometry(0.008, 0.18, 0.003);
  const dasta = new THREE.Mesh(dastaGeo, metallMat);
  dasta.position.y = 0.09;
  group.add(dasta);

  const qoshiqGeo = new THREE.CylinderGeometry(0.014, 0.004, 0.03, 16);
  const qoshiq = new THREE.Mesh(qoshiqGeo, metallMat);
  qoshiq.position.y = 0.012;
  group.add(qoshiq);

  group.userData = {
    kalit: "spatula",
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.18,
    tanlanadi: true,
  };

  yorliqQosh(group, "Spatula");

  return group;
}
