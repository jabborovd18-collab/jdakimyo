import * as THREE from "three";
import { suyuqlikYasa } from "./materiallar.js";

// Matn yorlig'i (label) uchun CanvasTexture yordamchisi.
// Nega: 3D sahnada HTML elementlar o'rniga CanvasTexture dan yasalgan Sprite ishlatish
// kamera aylanganda ham yorliq har doim foydalanuvchiga qarab turishini ta'minlaydi.
function yorliqYasa(matn = "") {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
  ctx.beginPath();
  ctx.roundRect(4, 4, 248, 56, 12);
  ctx.fill();

  ctx.strokeStyle = "rgba(168, 85, 247, 0.85)";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 34px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(matn, 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(0.3, 0.075, 1);
  return sprite;
}

// Suyuqlik va cho'kma sathini balandlik bo'yicha ko'tarish funksiyasi.
// Nega scale.y va position.y birga o'zgaradi: silindr markazi geometriya markazida joylashadi,
// scale oshganda position.y yuqoriga ko'tarilmasa, suyuqlik idish tubidan pastga ochilib ketadi.
export function suyuqlikSathiniYangila(group, ml = 0, rangObyekti = null, chokmaMl = 0, chokmaRang = 0x88bbee, arzonMaterial = false) {
  if (!group || !group.userData) return;

  const suyuqlikMesh = group.userData.suyuqlikMesh;
  const chokmaMesh = group.userData.chokmaMesh;
  const sigim = group.userData.sigim || 50;
  const maxH = group.userData.suyuqlikMaxBalandlik || 0.22;
  const baseY = group.userData.suyuqlikTubY || 0.02;

  const ratio = Math.min(1.0, Math.max(0, ml / sigim));

  if (suyuqlikMesh) {
    if (ratio > 0.005) {
      suyuqlikMesh.visible = true;
      suyuqlikMesh.scale.y = ratio;
      suyuqlikMesh.position.y = baseY + (maxH * ratio) / 2;

      if (rangObyekti && rangObyekti.rang !== undefined) {
        suyuqlikMesh.material.color.setHex(rangObyekti.rang);
        suyuqlikMesh.material.opacity = Math.min(1, Math.max(0.15, rangObyekti.shaffoflik ?? 0.75));
      }
    } else {
      suyuqlikMesh.visible = false;
    }
  }

  // Cho'kma qatlami alohida ko'rsatiladi
  if (chokmaMesh) {
    const chokmaRatio = Math.min(0.35, Math.max(0, chokmaMl / sigim));
    if (chokmaRatio > 0.005) {
      chokmaMesh.visible = true;
      chokmaMesh.scale.y = chokmaRatio;
      chokmaMesh.position.y = baseY + (maxH * chokmaRatio) / 2;
      chokmaMesh.material.color.setHex(chokmaRang);
    } else {
      chokmaMesh.visible = false;
    }
  }
}

// 1. PROBIRKA — Kichik hajmdagi sifat reaksiyalari va cho'ktirish tajribalarini o'tkazish uchun asosiy shisha idish.
function probirkaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.042, 0.042, 0.22, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "probirka",
    sigim: 25,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.29,
    suyuqlikMaxBalandlik: 0.22,
    suyuqlikTubY: 0.04,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Probirka");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 2. STAKAN — Suyuqliklarni aralashtirish, isitish va vaqtincha saqlash uchun kimyoviy shisha stakan.
function stakanYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const silindrGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.22, 32, 1, true);
  const silindr = new THREE.Mesh(silindrGeo, shishaMat);
  silindr.position.y = 0.11;
  group.add(silindr);

  const tubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.008, 32);
  const tub = new THREE.Mesh(tubGeo, shishaMat);
  tub.position.y = 0.004;
  group.add(tub);

  const suyuqlikGeo = new THREE.CylinderGeometry(0.076, 0.076, 0.18, 32);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.077, 0.077, 0.18, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "stakan",
    sigim: 100,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.22,
    suyuqlikMaxBalandlik: 0.18,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Stakan");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 3. KONUSSIMON-KOLBA — Erlenmeyer kolbasi: suyuqliklarni chayqatganda sachramaslik va titrlash uchun qulay idish.
function konussimonKolbaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.051, 0.086, 0.13, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "konussimon-kolba",
    sigim: 120,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.26,
    suyuqlikMaxBalandlik: 0.13,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Konussimon kolba");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 4. DUMALOQ-TUBLI-KOLBA — Bir tekis isitish va qaynash reaksiyalari uchun dumaloq tubli shisha kolba.
function dumaloqTubliKolbaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.position.y = 0.095;
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.SphereGeometry(0.081, 32, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.position.y = 0.095;
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "dumaloq-tubli-kolba",
    sigim: 150,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.27,
    suyuqlikMaxBalandlik: 0.15,
    suyuqlikTubY: 0.02,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Dumaloq tubli kolba");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 5. KOLBA — Umumiy kimyoviy eritma tayyorlash va saqlash uchun tekis tubli kolba.
function kolbaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.056, 0.081, 0.12, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "kolba",
    sigim: 120,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.25,
    suyuqlikMaxBalandlik: 0.12,
    suyuqlikTubY: 0.01,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Kolba");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 6. KRISTALLIZATOR — Eritmalarni bug'latib kristallar olish uchun keng sirtli ochiq idish.
function kristallizatorYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  const chokmaGeo = new THREE.CylinderGeometry(0.117, 0.117, 0.06, 32);
  const chokmaMat = new THREE.MeshStandardMaterial({ color: 0x88bbee, roughness: 0.8 });
  const chokmaMesh = new THREE.Mesh(chokmaGeo, chokmaMat);
  chokmaMesh.visible = false;
  group.add(chokmaMesh);

  group.userData = {
    kalit: "kristallizator",
    sigim: 80,
    suyuqlikMesh,
    chokmaMesh,
    ogizBalandligi: 0.085,
    suyuqlikMaxBalandlik: 0.06,
    suyuqlikTubY: 0.005,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Kristallizator");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 7. BYURETKA — Titrlash va aniq hajmdagi uzluksiz oqim quyish uchun jo'mrakli uzun o'lchov naychasi.
function byuretkaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit: "byuretka",
    sigim: 50,
    suyuqlikMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.6,
    suyuqlikMaxBalandlik: 0.45,
    suyuqlikTubY: 0.1,
    tanlanadi: true,
    jomrakBurchagi: 0, // 0 - yopiq, Math.PI/2 - ochiq
  };

  const yorliq = yorliqYasa("Byuretka");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 8. TOMIZGICH — Kam miqdorda (tomchilab) reagent qo'shish uchun rezina balonli pipetka.
function tomizgichYasa(materiallar) {
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
    sigim: 5,
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.22,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Tomizgich");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 9. SPIRTOVKA — Moddalarni isitish va alanga reaksiyalari uchun spirtli yoritgich-isitgich.
function spirtovkaYasa(materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x9aa4b2, metalness: 0.8 });
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });

  const tanaGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.09, 32);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = 0.045;
  group.add(tana);

  const qopqoqGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 32);
  const qopqoq = new THREE.Mesh(qopqoqGeo, metallMat);
  qopqoq.position.y = 0.1;
  group.add(qopqoq);

  const pilikGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.025, 16);
  const pilikMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f4, roughness: 0.9 });
  const pilik = new THREE.Mesh(pilikGeo, pilikMat);
  pilik.position.y = 0.12;
  group.add(pilik);

  // Alanga mesh'i (ConeGeometry, MeshBasicMaterial, boshida visible: false)
  const alangaGeo = new THREE.ConeGeometry(0.02, 0.06, 16);
  const alangaMat = new THREE.MeshBasicMaterial({ color: 0xfb923c });
  const alangaMesh = new THREE.Mesh(alangaGeo, alangaMat);
  alangaMesh.position.y = 0.16;
  alangaMesh.visible = false;
  group.add(alangaMesh);

  group.userData = {
    kalit: "spirtovka",
    sigim: 0,
    suyuqlikMesh: null,
    chokmaMesh: null,
    alanga: alangaMesh,
    ogizBalandligi: 0.18,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Spirtovka");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 10. SHTATIV — Kolbalar va apparatlarni muvozanatda ushlab turuvchi metall tayanch shtativ.
function shtativYasa(materiallar) {
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
    sigim: 0,
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.45,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Shtativ");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 11. PROBIRKA-SHTATIVI — Bir necha probirkani tik holatda ushlab turuvchi yog'och yoki plastik stend.
function probirkaShtativiYasa(materiallar) {
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
    sigim: 0,
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Probirka shtativi");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 12. TERMOMETR — Eritma va reaksiya haroratini o'lchash uchun simobli yoki spirtli shisha termometr.
function termometrYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });

  const tanaGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.32, 16);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = 0.16;
  group.add(tana);

  const uchGeo = new THREE.SphereGeometry(0.012, 16, 16);
  const uchMat = new THREE.MeshStandardMaterial({ color: 0xdc2626 });
  const uch = new THREE.Mesh(uchGeo, uchMat);
  uch.position.y = 0.01;
  group.add(uch);

  group.userData = {
    kalit: "termometr",
    sigim: 0,
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.32,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Termometr");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 13. VORONKA — Suyuqliklarni tor og'izli idishga quyish yoki filtr qog'ozi bilan cho'kmani ajratish uchun.
function voronkaYasa(materiallar) {
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
    sigim: 30,
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  const yorliq = yorliqYasa("Voronka");
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// 14. ZAXIRA MODEL — Maxsus model taqdim etilmagan apparatlar uchun quti, quvur va nom yorlig'idan iborat zaxira model.
function zaxiraModel(kalit, materiallar) {
  const group = new THREE.Group();
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 });
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.3, transparent: true });

  const qutiGeo = new THREE.BoxGeometry(0.16, 0.14, 0.14);
  const quti = new THREE.Mesh(qutiGeo, metallMat);
  quti.position.y = 0.07;
  group.add(quti);

  const quvurGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.08, 16);
  const quvur = new THREE.Mesh(quvurGeo, shishaMat);
  quvur.position.y = 0.18;
  group.add(quvur);

  const suyuqlikGeo = new THREE.BoxGeometry(0.14, 0.1, 0.12);
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit,
    sigim: 100,
    suyuqlikMesh,
    chokmaMesh: null,
    ogizBalandligi: 0.22,
    suyuqlikMaxBalandlik: 0.1,
    suyuqlikTubY: 0.02,
    tanlanadi: true,
  };

  const tozaNom = String(kalit || "Apparat")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const yorliq = yorliqYasa(tozaNom);
  yorliq.position.set(0, -0.06, 0);
  group.add(yorliq);

  return group;
}

// Jihoz turiga qarab mos protsedural 3D model yaratish dispetcher funksiyasi.
// Nega: tashqi .glb / .gltf yuklamasdan, barcha geometriya Three.js ichida yasalishi
// tarmoq trafigini va yuklanish vaqtini 10 barobargacha tejaydi.
export function jihozYasa(kalit, materiallar) {
  switch (kalit) {
    case "probirka":
      return probirkaYasa(materiallar);
    case "stakan":
      return stakanYasa(materiallar);
    case "konussimon-kolba":
      return konussimonKolbaYasa(materiallar);
    case "dumaloq-tubli-kolba":
      return dumaloqTubliKolbaYasa(materiallar);
    case "kolba":
      return kolbaYasa(materiallar);
    case "kristallizator":
      return kristallizatorYasa(materiallar);
    case "byuretka":
      return byuretkaYasa(materiallar);
    case "tomizgich":
      return tomizgichYasa(materiallar);
    case "spirtovka":
      return spirtovkaYasa(materiallar);
    case "shtativ":
      return shtativYasa(materiallar);
    case "probirka-shtativi":
      return probirkaShtativiYasa(materiallar);
    case "termometr":
      return termometrYasa(materiallar);
    case "voronka":
    case "tomizuvchi-voronka":
      return voronkaYasa(materiallar);
    default:
      return zaxiraModel(kalit, materiallar);
  }
}