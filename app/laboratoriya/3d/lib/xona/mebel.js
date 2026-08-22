// app/laboratoriya/3d/lib/xona/mebel.js
//
// Mebel va stol ustidagi buyumlar.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { tortmaShkafNuriniYarat } from "../yoruglik.js";


/** Tortma Shkaf (Fume Hood) modeli */
export function tortmaShkafYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Fume_Hood";
  group.position.set(5.5, 0.9, -4.8); // O'ng orqa burchakka joylashtirildi

  const poLatMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const korpusGeo = new THREE.BoxGeometry(1.0, 1.25, 0.7);
  const korpus = new THREE.Mesh(korpusGeo, poLatMat);
  korpus.position.y = 0.625;
  group.add(korpus);

  const kameraGeo = new THREE.BoxGeometry(0.9, 0.82, 0.6);
  const kameraMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const kamera = new THREE.Mesh(kameraGeo, kameraMat);
  kamera.position.set(0, 0.52, 0.02);
  group.add(kamera);

  const oynaGeo = new THREE.BoxGeometry(0.88, 0.6, 0.015);
  const oyna = new THREE.Mesh(oynaGeo, shishaMat);
  oyna.position.set(0, 0.62, 0.32);
  group.add(oyna);

  const trubaGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
  const truba = new THREE.Mesh(trubaGeo, poLatMat);
  truba.position.set(0, 1.5, 0);
  group.add(truba);

  const ichkiChiroq = tortmaShkafNuriniYarat();
  ichkiChiroq.position.set(0, 0.85, 0);
  group.add(ichkiChiroq);

  return group;
}


/** 3D Jihozlar Stendi (Glassware Rack) — Stolda tartiblangan yangi toza shisha idishlar */
export function jihozlarStendiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Jihozlar_Stendi_Rack";
  group.position.set(-1.15, 0.90, -0.32); // Asosiy ishchi stolning chap orqasida

  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.45 });

  // 1. Shtativ taxtasi (Base board)
  const tagGeo = new THREE.BoxGeometry(0.70, 0.02, 0.22);
  const tagMesh = new THREE.Mesh(tagGeo, yogochMat);
  tagMesh.position.y = 0.01;
  group.add(tagMesh);

  // 2. Yuqori teshikli taxta (Upper rack plate)
  const tepaGeo = new THREE.BoxGeometry(0.70, 0.015, 0.22);
  const tepaMesh = new THREE.Mesh(tepaGeo, yogochMat);
  tepaMesh.position.y = 0.12;
  group.add(tepaMesh);

  // Yon ustunchalar (Side pillars)
  [[-0.33, -0.09], [0.33, -0.09], [-0.33, 0.09], [0.33, 0.09]].forEach(([px, pz]) => {
    const ustunGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.12, 12);
    const ustun = new THREE.Mesh(ustunGeo, metallMat);
    ustun.position.set(px, 0.06, pz);
    group.add(ustun);
  });

  // Stenddagi toza jihozlar
  // 1. Probirkalar (3 ta probirka)
  [-0.26, -0.18, -0.10].forEach((px, idx) => {
    const probirkaGroup = new THREE.Group();
    probirkaGroup.name = `Stend_Probirka_${idx + 1}`;
    probirkaGroup.position.set(px, 0.02, -0.04);

    const geo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 16);
    const mesh = new THREE.Mesh(geo, shishaMat);
    mesh.position.y = 0.075;
    probirkaGroup.add(mesh);

    const labGeo = new THREE.TorusGeometry(0.013, 0.002, 8, 16);
    const labMesh = new THREE.Mesh(labGeo, shishaMat);
    labMesh.rotation.x = Math.PI / 2;
    labMesh.position.y = 0.15;
    probirkaGroup.add(labMesh);

    probirkaGroup.userData = { kalit: "probirka", nom: "Bo'sh Probirka (25ml)", tanlanadi: true, yangiJihoz: true };
    group.add(probirkaGroup);
  });

  // 2. Erlenmeyer Kolba (100ml)
  const kolbaGroup = new THREE.Group();
  kolbaGroup.name = "Stend_Kolba";
  kolbaGroup.position.set(0.02, 0.02, -0.02);
  const kGeo = new THREE.ConeGeometry(0.045, 0.09, 20);
  const kMesh = new THREE.Mesh(kGeo, shishaMat);
  kMesh.position.y = 0.045;
  kolbaGroup.add(kMesh);
  const kBGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.04, 16);
  const kBMesh = new THREE.Mesh(kBGeo, shishaMat);
  kBMesh.position.y = 0.10;
  kolbaGroup.add(kBMesh);
  kolbaGroup.userData = { kalit: "kolba", nom: "Konussimon Kolba (100ml)", tanlanadi: true, yangiJihoz: true };
  group.add(kolbaGroup);

  // 3. Kimyoviy Stakan (100ml Beaker)
  const stakanGroup = new THREE.Group();
  stakanGroup.name = "Stend_Stakan";
  stakanGroup.position.set(0.12, 0.02, -0.02);
  const sGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.08, 20);
  const sMesh = new THREE.Mesh(sGeo, shishaMat);
  sMesh.position.y = 0.04;
  stakanGroup.add(sMesh);
  stakanGroup.userData = { kalit: "stakan", nom: "Kimyoviy Stakan (100ml)", tanlanadi: true, yangiJihoz: true };
  group.add(stakanGroup);

  // 4. O'lchov Silindri (50ml Graduated Cylinder)
  const silindrGroup = new THREE.Group();
  silindrGroup.name = "Stend_Silindr";
  silindrGroup.position.set(0.22, 0.02, -0.02);
  const silGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.14, 16);
  const silMesh = new THREE.Mesh(silGeo, shishaMat);
  silMesh.position.y = 0.07;
  silindrGroup.add(silMesh);
  // Silindr asosi ilgari 6 segmentli (oltiburchak) edi — endi 32 segment
  // bilan dumaloq, FPS yaqinlashuvida qirralar ko'rinmaydi.
  const silAsosGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.008, 32);
  const silAsos = new THREE.Mesh(silAsosGeo, shishaMat);
  silAsos.position.y = 0.004;
  silindrGroup.add(silAsos);
  silindrGroup.userData = { kalit: "olchov-silindr", nom: "O'lchov Silindri (50ml)", tanlanadi: true, yangiJihoz: true };
  group.add(silindrGroup);

  // 5. Shisha Tayoqcha (Glass Stirring Rod) & Spatula
  const tayoqGroup = new THREE.Group();
  tayoqGroup.name = "Stend_ShishaTayoqcha";
  tayoqGroup.position.set(-0.02, 0.02, 0.06);
  const tGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.18, 12);
  const tMesh = new THREE.Mesh(tGeo, shishaMat);
  tMesh.rotation.z = 0.15;
  tMesh.position.y = 0.09;
  tayoqGroup.add(tMesh);
  tayoqGroup.userData = { kalit: "shisha-tayoqcha", nom: "Shisha Aralashtirgich Tayoqcha", tanlanadi: true, yangiJihoz: true };
  group.add(tayoqGroup);

  const spatulaGroup = new THREE.Group();
  spatulaGroup.name = "Stend_Spatula";
  spatulaGroup.position.set(0.08, 0.02, 0.06);
  const spGeo = new THREE.BoxGeometry(0.008, 0.16, 0.002);
  const spMesh = new THREE.Mesh(spGeo, metallMat);
  spMesh.rotation.z = -0.15;
  spMesh.position.y = 0.08;
  spatulaGroup.add(spMesh);
  spatulaGroup.userData = { kalit: "spatula", nom: "Kimyoviy Spatula", tanlanadi: true, yangiJihoz: true };
  group.add(spatulaGroup);

  group.userData = { kalit: "jihoz_stendi", nom: "Jihozlar Stendi (Rack)", tanlanadi: true };
  return group;
}


/** Yon Ishchi Tajriba Stollari (Left & Right Workbenches) */
export function yonStollarniYasa(materiallar) {
  const group = new THREE.Group();
  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const oyoqMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

  // 1. Chap Stol (Analitik Tarozi Maydoni: X = -3.2, Z = 0.2)
  const chapStolGeo = new THREE.BoxGeometry(2.0, 0.08, 1.4);
  const chapStol = new THREE.Mesh(chapStolGeo, yogochMat);
  chapStol.position.set(-3.2, 0.86, 0.2);
  chapStol.receiveShadow = true;
  group.add(chapStol);

  [[-4.0, -0.4], [-2.4, -0.4], [-4.0, 0.8], [-2.4, 0.8]].forEach(([x, z]) => {
    const oyoqGeo = new THREE.BoxGeometry(0.07, 0.86, 0.07);
    const oyoq = new THREE.Mesh(oyoqGeo, oyoqMat);
    oyoq.position.set(x, 0.43, z);
    group.add(oyoq);
  });

  // 2. O'ng Stol (Byuretka va Elektroliz Maydoni: X = 3.2, Z = 0.2)
  const ongStolGeo = new THREE.BoxGeometry(2.0, 0.08, 1.4);
  const ongStol = new THREE.Mesh(ongStolGeo, yogochMat);
  ongStol.position.set(3.2, 0.86, 0.2);
  ongStol.receiveShadow = true;
  group.add(ongStol);

  [[2.4, -0.4], [4.0, -0.4], [2.4, 0.8], [4.0, 0.8]].forEach(([x, z]) => {
    const oyoqGeo = new THREE.BoxGeometry(0.07, 0.86, 0.07);
    const oyoq = new THREE.Mesh(oyoqGeo, oyoqMat);
    oyoq.position.set(x, 0.43, z);
    group.add(oyoq);
  });

  return group;
}


/** Stol ustidagi mayda realist detallar — qog'oz bloknot va ruchka.
 *
 * Nega kerak: bo'sh stol "3D o'yin" va haqiqiy lab orasidagi farqni katta
 * oshiradi. Kichik daftar va ruchka kabi narsalar tomoshabinga xonaning
 * "yashayotgan" joy ekanini sezdirib, realizmni sezilarli ko'taradi. Hammasi
 * protsedural (Canvas + asosiy geometriya), tarmoqqa chiqmaydi.
 */
export function stolDaftarlariYasa() {
  const group = new THREE.Group();
  group.name = "Stol_Daftarlari";

  // SSR'da document yo'q — bu funksiya faqat brauzerda chaqiriladi (useEffect
  // ichida), lekin xavfsizlik uchun bir xil tekshiruv qo'yiladi.
  if (typeof document === "undefined") return group;

  // Qog'oz bloknot: oq qog'oz + chiziqli satrlar (Canvas tekstura).
  const pad = new THREE.Group();
  const padOlcham = 0.28;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fbfbf6";
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = "rgba(59,130,246,0.5)";
  ctx.lineWidth = 3;
  for (let y = 30; y < 256; y += 26) {
    ctx.beginPath();
    ctx.moveTo(12, y);
    ctx.lineTo(244, y);
    ctx.stroke();
  }
  const padTex = new THREE.CanvasTexture(canvas);
  const padYuz = new THREE.Mesh(
    new THREE.BoxGeometry(padOlcham, 0.006, padOlcham * 1.3),
    new THREE.MeshStandardMaterial({ map: padTex, roughness: 0.9 }),
  );
  padYuz.position.y = 0.003;
  pad.add(padYuz);

  // Bloknot qopqog'i (ostidagi qalinroq karton).
  const padQopqoq = new THREE.Mesh(
    new THREE.BoxGeometry(padOlcham + 0.006, 0.004, padOlcham * 1.3 + 0.006),
    new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 }),
  );
  padQopqoq.position.y = 0.0005;
  pad.add(padQopqoq);

  // Qog'oz bilan qopqoq orasidagi "kesishma" — yon tomondan ko'ringan qatlam.
  const qatlam = new THREE.Mesh(
    new THREE.BoxGeometry(padOlcham + 0.004, 0.012, 0.012),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }),
  );
  qatlam.position.set(0, 0.006, -padOlcham * 0.65);
  pad.add(qatlam);

  pad.position.set(-3.9, 0.905, 0.66);
  group.add(pad);

  // Ruchka: ingichka korpus + qopqoq konusi.
  const ruchka = new THREE.Group();
  const korpusMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3, metalness: 0.2 });
  const uchMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
  const korpus = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 12), korpusMat);
  korpus.rotation.z = Math.PI / 2;
  ruchka.add(korpus);
  const uch = new THREE.Mesh(new THREE.ConeGeometry(0.005, 0.02, 12), uchMat);
  uch.rotation.z = Math.PI / 2;
  uch.position.x = 0.065;
  ruchka.add(uch);
  const qopqoq = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.035, 12), uchMat);
  qopqoq.rotation.z = Math.PI / 2;
  qopqoq.position.x = -0.06;
  ruchka.add(qopqoq);
  // Ruchka bloknotning yoniga, bir oz qiyalatib qo'yiladi.
  ruchka.position.set(-3.7, 0.908, 0.62);
  ruchka.rotation.z = -0.12;
  group.add(ruchka);

  return group;
}
