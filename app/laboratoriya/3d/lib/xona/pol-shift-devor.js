// app/laboratoriya/3d/lib/xona/pol-shift-devor.js
//
// Xonaning qobig'i: pol, ship (LED trofferlar bilan), to'rt devor va
// eshik. Devorga o'rnatilgan narsalar o'z fayllarida: deraza —
// `deraza.js`, EXIT/iqlim — `panellar.js`, dush — `santexnika.js`,
// xavfsizlik shkafi — `mebel.js`.
//
// BRIF-05 (2-bosqich): `qobiq.js` (493 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi. `roomGroup.add`
// TARTIBI asl fayl bilan bir xil: shaffof sirtlarda render tartibi
// pikselga ta'sir qilishi mumkin, shuning uchun tartib ham qismning
// "geometriyasi" hisoblanadi.

import * as THREE from "three";
import { XONA } from "../sozlama.js";
import { SHIP_PANEL_JOYLARI } from "../yoruglik.js";
import { chapDevorniYasa, derazaBezaklariniQosh } from "./deraza.js";
import { exitBelgisiniQosh, iqlimStansiyasiniQosh } from "./panellar.js";
import { xavfsizlikDushiniQosh } from "./santexnika.js";
import { xavfsizlikShkafiniQosh } from "./mebel.js";
import { DEVOR_QALINLIGI } from "./yordamchi.js";


export function xonaQobiginiYasa(materiallar, profil) {
  const roomGroup = new THREE.Group();
  roomGroup.name = "16x12m_Grand_Laboratoriya_Zali";

  const devorMat = materiallar?.devor || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const shiftMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
  const polMat = materiallar?.pol || new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.15 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.45 });
  const ramkaMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

  // O'lcham `sozlama.js` da — bu yerda son yozilmaydi (AGENTS.md 1-band).
  const XONA_W = XONA.eni;
  const XONA_H = XONA.balandligi;
  const XONA_D = XONA.boyi;
  // Xona z bo'yicha markazdan siljigan; devor va shipning hammasi shunga
  // bog'lanadi, aks holda kichraytirishda ular bir-biridan ajralib ketadi.
  const MZ = XONA.markazZ;

  // 1. EPOKSI KIMYOVIY POL (Y = 0, 16x12m)
  const polGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const pol = new THREE.Mesh(polGeo, polMat);
  pol.rotation.x = -Math.PI / 2;
  pol.position.set(0, 0, MZ);
  pol.receiveShadow = true;
  roomGroup.add(pol);

  // 2. SHIFT VA 8 TA RECESSED LED PANELLARI (Y = 4.2)
  const shiftGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const shift = new THREE.Mesh(shiftGeo, shiftMat);
  shift.rotation.x = Math.PI / 2;
  shift.position.set(0, XONA_H, MZ);
  roomGroup.add(shift);

  const trofferGeo = new THREE.PlaneGeometry(2.0, 0.8);
  // Panel yuzasi nur manbaini ko'rsatadi, lekin fragment uchun alohida Light
  // emas. Standard + emissive atrof yorug'ligiga javob beradi va oq qotmaydi.
  const trofferMat = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    emissive: 0xeef4ff,
    emissiveIntensity: 0.65,
    roughness: 0.45,
    metalness: 0.0,
  });
  SHIP_PANEL_JOYLARI.forEach(([x, z]) => {
    const lamp = new THREE.Mesh(trofferGeo, trofferMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x, XONA_H - 0.01, z);
    roomGroup.add(lamp);
  });

  // 3. CHAP DEVOR — HAQIQIY DERAZA TESHIKLARI BILAN
  //
  // Teshik shart: `scene.background` dagi tungi shahar manzarasi faqat
  // shu teshiklardan ko'rinadi (lib/manzara.js). Ilgari devor qattiq
  // edi va deraza uning oldiga yopishtirilgan shisha to'rtburchak edi —
  // tashqarida hech narsa yo'q edi, chunki qaraydigan joy yo'q edi.
  const chap = chapDevorniYasa(XONA_D, XONA_H, -XONA_W / 2, MZ, devorMat);
  roomGroup.add(chap.devor);

  derazaBezaklariniQosh(roomGroup, chap, {
    devorX: -XONA_W / 2 - DEVOR_QALINLIGI / 2,
    markazZ: MZ,
    shishaMat,
    ramkaMat,
    devorMat,
  });

  // 4. O'NG DEVOR (X = +8.0)
  const devorOngGeo = new THREE.PlaneGeometry(XONA_D, XONA_H);
  const devorOng = new THREE.Mesh(devorOngGeo, devorMat);
  devorOng.rotation.y = -Math.PI / 2;
  devorOng.position.set(XONA_W / 2, XONA_H / 2, MZ);
  devorOng.receiveShadow = true;
  roomGroup.add(devorOng);

  // 5. ORQA DEVOR (Z = -5.6)
  const devorOrqaGeo = new THREE.PlaneGeometry(XONA_W, XONA_H);
  const devorOrqa = new THREE.Mesh(devorOrqaGeo, devorMat);
  devorOrqa.position.set(0, XONA_H / 2, -XONA_D / 2 + MZ);
  devorOrqa.receiveShadow = true;
  roomGroup.add(devorOrqa);

  // 6. OLD DEVOR VA ESHIKLAR (Z = 6.4)
  const devorOldGeo = new THREE.PlaneGeometry(XONA_W, XONA_H);
  const devorOld = new THREE.Mesh(devorOldGeo, devorMat);
  devorOld.rotation.y = Math.PI;
  devorOld.position.set(0, XONA_H / 2, XONA_D / 2 + MZ);
  devorOld.receiveShadow = true;
  roomGroup.add(devorOld);

  const eshikGeo = new THREE.BoxGeometry(2.0, 2.6, 0.05);
  const eshik = new THREE.Mesh(eshikGeo, ramkaMat);
  eshik.position.set(0, 1.3, XONA_D / 2 + MZ - 0.02);
  roomGroup.add(eshik);

  // EXIT belgisi va iqlim stansiyasi — old devorga o'rnatilgan
  // panellar (`panellar.js`).
  exitBelgisiniQosh(roomGroup);
  iqlimStansiyasiniQosh(roomGroup);

  // 7. Xavfsizlik Dushi va Ko'z Yuvish Stansiyasi (O'ng devorda)
  xavfsizlikDushiniQosh(roomGroup, ramkaMat, profil);

  // 8. Eshik Yonidagi Devor Xavfsizlik Shkafi (Ko'zoynak va Gaz Niqobi)
  xavfsizlikShkafiniQosh(roomGroup, shishaMat, profil);

  return roomGroup;
}
