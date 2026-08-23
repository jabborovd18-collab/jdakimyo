// app/laboratoriya/3d/lib/jihoz/yordamchi.js
//
// Jihozlar uchun umumiy yordamchilar: yorliq, qaynash zarrachalari,
// suyuqlik sathi va soya o'chirish.
//
// BRIF-05: `jihoz-modellari.js` (1184 qator) mazmun bo'yicha
// bo'lindi. Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { yorliqniBelgila } from "../yorliqlar.js";
import { EFFEKT_RANGLARI } from "@/lib/lab-modda.js";


// Matn yorlig'i (label) uchun CanvasTexture yordamchisi.
// Nega: 3D sahnada HTML elementlar o'rniga CanvasTexture dan yasalgan Sprite ishlatish
// kamera aylanganda ham yorliq har doim foydalanuvchiga qarab turishini ta'minlaydi.
export function yorliqYasa(matn = "") {
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
  return yorliqniBelgila(sprite);
}


// Yorliqni idishning tepasiga qo'yish.
//
// Nega -0.06 EMAS: guruh stol sirtida (y = 0.9) turadi, ya'ni -0.06 yorliqni
// 0.84 ga tushirardi — stol taxtasi esa 0.82 dan 0.9 gacha. Barcha 14 ta
// jihozning yorlig'i tom ma'noda stol ichida ko'milgan va hech qachon
// ko'rinmagan. Endi idish og'zidan sal yuqorida turadi.
export function yorliqQosh(group, matn) {
  const yorliq = yorliqYasa(matn);
  const ogizY = group.userData?.ogizBalandligi ?? 0.28;
  yorliq.position.set(0, ogizY + 0.07, 0);
  group.add(yorliq);
  return yorliq;
}


// Qaynash girdobi, konvektiv pufakchalar va bug' (steam) effektlarini yaratish
export function qaynashZarrachalariYasa(radius = 0.04, balandlik = 0.2) {
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
export function soyalarniYoq(group) {
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
