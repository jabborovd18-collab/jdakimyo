import * as THREE from "three";
import { suyuqlikYasa } from "./materiallar.js";
import { EFFEKT_RANGLARI } from "@/lib/lab-modda.js";
import { idishmi, idishSigimi } from "@/lib/lab-idish.js";

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
  // Yorliq idishning oldida turadi va raycaster uni birinchi bo'lib topadi.
  // Bo'sh raycast qo'yilmasa, idishni bosmoqchi bo'lgan foydalanuvchi
  // aslida yozuvni bosgan bo'lardi.
  sprite.raycast = () => {};
  return sprite;
}

// Yorliqni idishning tepasiga qo'yish.
//
// Nega -0.06 EMAS: guruh stol sirtida (y = 0.9) turadi, ya'ni -0.06 yorliqni
// 0.84 ga tushirardi — stol taxtasi esa 0.82 dan 0.9 gacha. Barcha 14 ta
// jihozning yorlig'i tom ma'noda stol ichida ko'milgan va hech qachon
// ko'rinmagan. Endi idish og'zidan sal yuqorida turadi.
function yorliqQosh(group, matn) {
  const yorliq = yorliqYasa(matn);
  const ogizY = group.userData?.ogizBalandligi ?? 0.28;
  yorliq.position.set(0, ogizY + 0.07, 0);
  group.add(yorliq);
  return yorliq;
}

// Qaynash girdobi, konvektiv pufakchalar va bug' (steam) effektlarini yaratish
function qaynashZarrachalariYasa(radius = 0.04, balandlik = 0.2) {
  const group = new THREE.Group();
  group.name = "Qaynash_Effekti";
  group.visible = false;

  const count = 36;
  const positions = new Float32Array(count * 3);
  const basePos = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * radius * 0.75;
    const theta = Math.random() * Math.PI * 2;
    const x = Math.cos(theta) * r;
    const y = 0.03 + Math.random() * (balandlik * 0.8);
    const z = Math.sin(theta) * r;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    basePos.push({ x, y, z, speed: 0.003 + Math.random() * 0.006 });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.008,
    transparent: true,
    opacity: 0.85,
  });

  const points = new THREE.Points(geo, mat);
  group.add(points);

  // Bug' (Steam vapor) ustuni
  const steamGeo = new THREE.ConeGeometry(radius * 1.3, 0.16, 16, 1, true);
  const steamMat = new THREE.MeshBasicMaterial({
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.35,
  });
  const steam = new THREE.Mesh(steamGeo, steamMat);
  steam.position.y = balandlik + 0.07;
  steam.visible = false;
  group.add(steam);

  return { group, points, steam, basePos, geo, count, balandlik };
}

/** Idishdagi qaynash girdobi, pufakchalar va bug' sathini haroratga qarab yangilash */
export function qaynashniYangila(group, harorat = 25) {
  if (!group?.userData?.qaynashEffekti) return;
  const { group: qGroup, steam, points } = group.userData.qaynashEffekti;
  if (harorat >= 60) {
    qGroup.visible = true;
    points.material.opacity = Math.min(0.95, 0.4 + (harorat - 60) * 0.015);
    if (harorat >= 85) {
      steam.visible = true;
      steam.scale.y = Math.min(1.5, (harorat - 80) / 20);
      steam.material.opacity = Math.min(0.45, 0.15 + (harorat - 85) * 0.02);
    } else {
      steam.visible = false;
    }
  } else {
    qGroup.visible = false;
    steam.visible = false;
  }
}

// Suyuqlik va cho'kma sathini balandlik bo'yicha ko'tarish funksiyasi.
export function suyuqlikSathiniYangila(group, ml = 0, rangObyekti = null, chokmaMl = 0, chokmaRang = EFFEKT_RANGLARI.chokmaSukut, arzonMaterial = false) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
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
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.22,
    tanlanadi: true,
  };

  yorliqQosh(group, "Tomizgich");

  return group;
}

// 9. SPIRTOVKA — Moddalarni isitish va alanga reaksiyalari uchun spirtli yoritgich-isitgich.
function spirtovkaYasa(materiallar) {
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
  const alangaNuri = new THREE.PointLight(0xfbbf24, 1.4, 1.2);
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
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.45,
    tanlanadi: true,
  };

  yorliqQosh(group, "Shtativ");

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
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  yorliqQosh(group, "Probirka shtativi");

  return group;
}

function termometrYorliginiYasa(boshlangichHarorat = 25) {
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

  const yangila = (t) => {
    chiz(t);
    texture.needsUpdate = true;
  };

  return { sprite, yangila };
}

// 12. TERMOMETR — Eritma va reaksiya haroratini o'lchash uchun simobli yoki spirtli shisha termometr.
function termometrYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const simobMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.2, metalness: 0.1 });
  const shkalaMat = new THREE.MeshBasicMaterial({ color: 0x64748b });

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
    suyuqlikMesh: null,
    chokmaMesh: null,
    ogizBalandligi: 0.16,
    tanlanadi: true,
  };

  yorliqQosh(group, "Voronka");

  return group;
}

// 14. O'LCHOV KOLBASI — Aniq molyar standart eritmalar tayyorlash uchun kalibrlangan tor bo'g'izli kolba (100 ml).
function olchovKolbasiYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const belgiMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // Qizil kalibrlash halqasi

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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.75, materiallar?.arzon);
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
function olchovSilindriYasa(materiallar) {
  const group = new THREE.Group();
  const shishaMat = materiallar?.shisha || new THREE.MeshStandardMaterial({ color: 0xcfe8ff, opacity: 0.35, transparent: true });
  const shkalaMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.75, materiallar?.arzon);
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
function soatShishasiYasa(materiallar) {
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

// 17. SHISHA TAYOQCHA — Kristallarni eritish va aralashtirish uchun laboratoriya tayoqchasi.
function shishaTayoqchaYasa(materiallar) {
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
function spatulaYasa(materiallar) {
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
  const suyuqlikMat = suyuqlikYasa(0xffffff, 0.7, materiallar?.arzon);
  const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
  suyuqlikMesh.visible = false;
  group.add(suyuqlikMesh);

  group.userData = {
    kalit,
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
  yorliqQosh(group, tozaNom);

  return group;
}

// Jihozning tanasiga soya tashlashni yoqish.
//
// Nega alohida qadam: renderer'da shadowMap yoqilgan, yorug'lik castShadow
// qiladi va stol receiveShadow oladi — lekin BIRORTA jihoz meshiga
// castShadow qo'yilmagan edi. Ya'ni GPU har kadrda soya xaritasini
// hisoblardi, ekranga esa hech nima tushmasdi va idishlar stol ustida
// turgandek emas, havoda suzayotgandek ko'rinardi.
//
// Suyuqlik va cho'kma chetda qoladi: ular shaffof, lekin soya xaritasi
// shaffoflikni bilmaydi va ular to'ldirilgan qora dog' tashlardi.
//
// Shaffof shisha ham soya tashlamaydi (faqat qabul qiladi): aks holda butun
// idish shaklidagi qora "blob" soya tushib, idish stol ustida turganini
// sun'iy va tekis ko'rsatardi. Faqat shaffof bo'lmagan qismlar (metall,
// tiqin, oyoq) soya tashlaydi.
function soyalarniYoq(group) {
  group.traverse((child) => {
    if (!child.isMesh) return;
    if (child === group.userData.suyuqlikMesh) return;
    if (child === group.userData.chokmaMesh) return;

    const mat = child.material;
    const shaffof = Array.isArray(mat)
      ? mat.some((m) => m?.transparent || (m?.opacity !== undefined && m.opacity < 0.99))
      : Boolean(mat?.transparent || (mat?.opacity !== undefined && mat.opacity < 0.99));

    child.castShadow = !shaffof;
    child.receiveShadow = true;
  });
}

// Jihoz turiga qarab mos protsedural 3D model yaratish dispetcher funksiyasi.
// Nega: tashqi .glb / .gltf yuklamasdan, barcha geometriya Three.js ichida yasalishi
// tarmoq trafigini va yuklanish vaqtini 10 barobargacha tejaydi.
export function jihozYasa(kalit, materiallar) {
  const group = modelYasa(kalit, materiallar);
  soyalarniYoq(group);

  // Sig'im `lib/lab-idish.js` dan olinadi, model ichida yozilmaydi.
  //
  // Ilgari har bir modelda o'z soni bor edi va SERVER ularni umuman
  // ko'rmasdi — Three.js ni import qiladigan fayldan o'qib bo'lmaydi.
  // Natijada "idishga sig'maydi" degan tekshiruv yo'q edi: 25 ml
  // probirkaga 500 ml quyish mumkin edi. Endi ikkala tomon bitta
  // qiymatni o'qiydi.
  //
  // Idish bo'lmagani (shtativ, termometr, spirtovka) nol oladi:
  // `idishSigimi` noma'lum kalitga zaxira qiymat qaytaradi, u esa bu
  // yerda noto'g'ri bo'lardi.
  group.userData.sigim = idishmi(kalit) ? idishSigimi(kalit) : 0;

  return group;
}

function modelYasa(kalit, materiallar) {
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
    case "olchov-kolba":
      return olchovKolbasiYasa(materiallar);
    case "olchov-silindr":
      return olchovSilindriYasa(materiallar);
    case "soat-shishasi":
      return soatShishasiYasa(materiallar);
    case "shisha-tayoqcha":
      return shishaTayoqchaYasa(materiallar);
    case "spatula":
      return spatulaYasa(materiallar);
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