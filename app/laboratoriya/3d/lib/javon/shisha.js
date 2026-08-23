// app/laboratoriya/3d/lib/javon/shisha.js
//
// Reagent shishasi: yorlig'i, korpusi va suyuqligi.
//
// BRIF-05: `javon-3d.js` (868 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { yorliqniBelgila } from "../yorliqlar.js";


export const GHS_RANGLARI = {
  korroziy: "#ef4444",
  oksidlovchi: "#f59e0b",
  toksik: "#a855f7",
  yonuvchan: "#f97316",
  xavfsiz: "#38bdf8",
};


export function shishaYorliginiYasa(item) {
  if (typeof document === "undefined") {
    const fake = new THREE.Sprite();
    return { sprite: fake, yangila: () => {} };
  }
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  const chizYorliq = (joriy, sigim) => {
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.beginPath();
    ctx.roundRect(2, 2, 188, 68, 8);
    ctx.fill();

    const hoshiyaRangi = GHS_RANGLARI[item.ghs] || "#38bdf8";
    ctx.strokeStyle = hoshiyaRangi;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(item.kalit, 96, 32);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${Math.round(joriy)}/${sigim}ml`, 96, 56);
  };

  chizYorliq(item.joriyHajm, item.sigim);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.13, 0.048, 1);
  sprite.raycast = () => {};
  yorliqniBelgila(sprite);

  const yangila = (yangiHajm) => {
    chizYorliq(yangiHajm, item.sigim);
    texture.needsUpdate = true;
  };

  return { sprite, yangila };
}


export function reagentShishasiModel(item, materiallar) {
  const bottleGroup = new THREE.Group();
  bottleGroup.name = `Devor_Shisha_${item.kalit}`;

  const shishaMat =
    item.shishaTuri === "amber"
      ? new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.2, transparent: true, opacity: 0.65 })
      : materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const suyuqMat = new THREE.MeshStandardMaterial({
    color: item.rang,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const qopqoqMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });

  let radius = 0.03;
  let balandlik = 0.08;
  let boyinR = 0.013;
  let boyinH = 0.024;

  if (item.shishaTuri === "tomizgich") {
    radius = 0.018;
    balandlik = 0.05;
    boyinR = 0.008;
    boyinH = 0.018;
  } else if (item.sigim === 500) {
    radius = 0.045;
    balandlik = 0.12;
    boyinR = 0.02;
    boyinH = 0.03;
  } else if (item.sigim === 1000) {
    radius = 0.06;
    balandlik = 0.15;
    boyinR = 0.025;
    boyinH = 0.035;
  }

  const tanaGeo = new THREE.CylinderGeometry(radius, radius, balandlik, 18);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = balandlik / 2;
  bottleGroup.add(tana);

  const maksSuyuqH = balandlik * 0.8;
  const suyuqRatio = item.joriyHajm / item.sigim;
  const suyuqH = maksSuyuqH * suyuqRatio;
  const suyuqGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, maksSuyuqH, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqMat);
  suyuq.scale.y = suyuqRatio;
  suyuq.position.y = (maksSuyuqH * suyuqRatio) / 2 + 0.004;
  bottleGroup.add(suyuq);

  const qopqoqGeo = new THREE.CylinderGeometry(boyinR * 1.1, boyinR * 1.3, boyinH, 14);
  const qopqoq = new THREE.Mesh(qopqoqGeo, qopqoqMat);
  const aslQopqoqY = balandlik + boyinH / 2;
  qopqoq.position.y = aslQopqoqY;
  bottleGroup.add(qopqoq);

  const { sprite: yorliqSprite, yangila: yorliqYangila } = shishaYorliginiYasa(item);
  yorliqSprite.position.set(0, balandlik + boyinH + 0.04, 0);
  bottleGroup.add(yorliqSprite);

  bottleGroup.position.set(...item.pos);

  // Hajmni kamaytirish va real vaqtda yangilash funksiyasi
  const hajmniYangila = (yangiHajm) => {
    const clamped = Math.max(0, Math.min(item.sigim, Number(yangiHajm) || 0));
    bottleGroup.userData.joriyHajm = clamped;

    const r = Math.max(0.01, clamped / item.sigim);
    suyuq.scale.y = r;
    suyuq.position.y = (maksSuyuqH * r) / 2 + 0.004;

    yorliqYangila(clamped);
  };

  bottleGroup.userData = {
    kalit: item.kalit,
    nom: item.nom,
    sigim: item.sigim,
    joriyHajm: item.joriyHajm,
    ghs: item.ghs,
    tanlanadi: true,
    devorShishasi: true,
    aslPos: new THREE.Vector3(...item.pos),
    aslQopqoqY,
    suyuqlikMesh: suyuq,
    qopqoqMesh: qopqoq,
    hajmniYangila,
    stolUstida: false,
  };

  return bottleGroup;
}
