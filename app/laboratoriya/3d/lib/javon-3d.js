import * as THREE from "three";

// 3D sahnada laboratoriya orqasida joylashuvchi haqiqiy 3D Reagentlar Javoni
// (3D Wooden & Glass Reagent Cabinet).
//
// Javon javon xonalari, 3 ta shisha polkalar va uning ustiga qatorma-qator
// terib qo'yilgan 12 xil 3D reagent shishalaridan tashkil topadi.
// Har bir 3D shisha raycaster orqali tanlanadi va sichqoncha bilan bosilganda
// reagentni faollashtiradi!

const SHISHA_REAGENTLAR = [
  // 1-polka (Kislotalar va Suv)
  { kalit: "H₂O", rang: 0x38bdf8, pos: [-0.5, 1.48, -1.05] },
  { kalit: "HCl", rang: 0xf8fafc, pos: [-0.3, 1.48, -1.05] },
  { kalit: "HNO₃", rang: 0xfef08a, pos: [-0.1, 1.48, -1.05] },
  { kalit: "H₂SO₄", rang: 0xfacc15, pos: [0.1, 1.48, -1.05] },
  { kalit: "CH₃COOH", rang: 0xe2e8f0, pos: [0.3, 1.48, -1.05] },

  // 2-polka (Ishqorlar va Tuzlar)
  { kalit: "NaOH", rang: 0xbae6fd, pos: [-0.4, 1.18, -1.05] },
  { kalit: "KOH", rang: 0x93c5fd, pos: [-0.2, 1.18, -1.05] },
  { kalit: "NH₃", rang: 0xcfe8ff, pos: [0.0, 1.18, -1.05] },
  { kalit: "CuSO₄", rang: 0x0284c7, pos: [0.2, 1.18, -1.05] },
  { kalit: "AgNO₃", rang: 0x94a3b8, pos: [0.4, 1.18, -1.05] },

  // 3-polka (Rangli va Nodir Tuzlar)
  { kalit: "KMnO₄", rang: 0x7e22ce, pos: [-0.3, 0.88, -1.05] },
  { kalit: "FeCl₃", rang: 0xc2410c, pos: [-0.1, 0.88, -1.05] },
  { kalit: "BaCl₂", rang: 0xf1f5f9, pos: [0.1, 0.88, -1.05] },
  { kalit: "KI", rang: 0xfef08a, pos: [0.3, 0.88, -1.05] },
];

function yorliq3dYasa(matn = "") {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
  ctx.beginPath();
  ctx.roundRect(2, 2, 124, 44, 8);
  ctx.fill();

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(matn, 64, 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.12, 0.045, 1);
  sprite.raycast = () => {};
  return sprite;
}

export function javon3dYasa(materiallar, arzonRejim = false) {
  const mainCabinetGroup = new THREE.Group();
  mainCabinetGroup.name = "3D_Reagentlar_Javoni";

  // 1. Javon Tashqi Karkasi (Yog'och va Ramka)
  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.3 });

  const eni = 1.3;
  const balandlik = 1.0;
  const chukur = 0.25;
  const qalinlik = 0.03;

  // Yon devorlar (chap va o'ng)
  const yonGeo = new THREE.BoxGeometry(qalinlik, balandlik, chukur);
  const yonChap = new THREE.Mesh(yonGeo, yogochMat);
  yonChap.position.set(-eni / 2, 1.2, -1.1);
  mainCabinetGroup.add(yonChap);

  const yonOng = new THREE.Mesh(yonGeo, yogochMat);
  yonOng.position.set(eni / 2, 1.2, -1.1);
  mainCabinetGroup.add(yonOng);

  // Tepasi va tubi
  const qopqoqGeo = new THREE.BoxGeometry(eni + qalinlik, qalinlik, chukur);
  const qopqoqTepa = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTepa.position.set(0, 1.2 + balandlik / 2, -1.1);
  mainCabinetGroup.add(qopqoqTepa);

  const qopqoqTub = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTub.position.set(0, 1.2 - balandlik / 2, -1.1);
  mainCabinetGroup.add(qopqoqTub);

  // Orqa shaffof yog'och/shisha panel
  const orqaGeo = new THREE.BoxGeometry(eni, balandlik, 0.01);
  const orqaPanel = new THREE.Mesh(orqaGeo, yogochMat);
  orqaPanel.position.set(0, 1.2, -1.1 - chukur / 2);
  mainCabinetGroup.add(orqaPanel);

  // 2. 3 ta Shisha Polkalar (Shelves)
  const polkaGeo = new THREE.BoxGeometry(eni - 0.02, 0.015, chukur - 0.02);
  const polkaYlar = [0.82, 1.12, 1.42];

  polkaYlar.forEach((y) => {
    const polka = new THREE.Mesh(polkaGeo, shishaMat);
    polka.position.set(0, y, -1.1);
    mainCabinetGroup.add(polka);
  });

  // 3. Polkalarda terilgan 3D Reagent Shishalari
  SHISHA_REAGENTLAR.forEach((item) => {
    const bottleGroup = new THREE.Group();
    bottleGroup.userData = {
      kalit: item.kalit,
      nom: item.kalit,
      // `turi: "reagent"` — bu shisha IDISH emas, reagent ekanini bildiradi.
      // useSudrash shu belgiga qarab idish tanlashdan ajratadi: shisha bosilsa
      // joriy idish emas, faol REAGENT bo'ladi (reagentni javon shishasidan
      // tanlash — shu faylning boshida va'da qilingan, lekin ilgari ulanmagan
      // xatti-harakat).
      turi: "reagent",
      tanlanadi: true,
      ogizBalandligi: 0.1,
    };

    // Shisha tanasi (silindr)
    const tanaGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.08, 16);
    const tanaMesh = new THREE.Mesh(tanaGeo, shishaMat);
    tanaMesh.position.y = 0.04;
    bottleGroup.add(tanaMesh);

    // Ichidagi suyuqlik
    const suyuqlikMat = new THREE.MeshStandardMaterial({
      color: item.rang,
      roughness: 0.2,
      metalness: 0.1,
    });
    const suyuqlikGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.06, 16);
    const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
    suyuqlikMesh.position.y = 0.032;
    bottleGroup.add(suyuqlikMesh);

    // Qopqoq / Mantagich
    const qopqoqGeo = new THREE.CylinderGeometry(0.012, 0.016, 0.025, 12);
    const qopqoqMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const qopqoq = new THREE.Mesh(qopqoqGeo, qopqoqMat);
    qopqoq.position.y = 0.09;
    bottleGroup.add(qopqoq);

    // 3D Yorliq (Label)
    const yorliq = yorliq3dYasa(item.kalit);
    yorliq.position.set(0, 0.12, 0.01);
    bottleGroup.add(yorliq);

    bottleGroup.position.set(...item.pos);
    mainCabinetGroup.add(bottleGroup);
  });

  return mainCabinetGroup;
}
