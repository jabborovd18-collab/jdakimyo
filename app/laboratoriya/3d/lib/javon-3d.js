import * as THREE from "three";

// 2-BOSQICH: 3D MARKAZIY OROL REAGENTLAR JAVONI (Central Island Reagent Station).
// Markaziy javon stoli, 3 qavatli shaffof polkalar, LED yoritish va 14 xil 3D reagent shishalari.

const SHISHA_REAGENTLAR = [
  // 1-polka: Kislotalar va Distillangan Suv (Y = 1.48)
  { kalit: "H₂O", nom: "Distillangan suv", rang: 0x38bdf8, pos: [-0.48, 1.46, -0.92] },
  { kalit: "HCl", nom: "Xlorid kislota", rang: 0xf8fafc, pos: [-0.24, 1.46, -0.92] },
  { kalit: "HNO₃", nom: "Nitrat kislota", rang: 0xfef08a, pos: [0.0, 1.46, -0.92] },
  { kalit: "H₂SO₄", nom: "Sulfat kislota", rang: 0xfacc15, pos: [0.24, 1.46, -0.92] },
  { kalit: "CH₃COOH", nom: "Sirka kislota", rang: 0xe2e8f0, pos: [0.48, 1.46, -0.92] },

  // 2-polka: Ishqorlar va Indikatorlar (Y = 1.18)
  { kalit: "NaOH", nom: "Natriy gidroksid", rang: 0xbae6fd, pos: [-0.48, 1.16, -0.92] },
  { kalit: "KOH", nom: "Kaliy gidroksid", rang: 0x93c5fd, pos: [-0.24, 1.16, -0.92] },
  { kalit: "NH₃", nom: "Ammiak suvi", rang: 0xcfe8ff, pos: [0.0, 1.16, -0.92] },
  { kalit: "CuSO₄", nom: "Mis(II) sulfat", rang: 0x0284c7, pos: [0.24, 1.16, -0.92] },
  { kalit: "AgNO₃", nom: "Kumush nitrat", rang: 0x94a3b8, pos: [0.48, 1.16, -0.92] },

  // 3-polka: Tuzlar va Reaktivlar (Y = 0.88)
  { kalit: "KMnO₄", nom: "Kaliy permanganat", rang: 0x7e22ce, pos: [-0.36, 0.86, -0.92] },
  { kalit: "FeCl₃", nom: "Temir(III) xlorid", rang: 0xc2410c, pos: [-0.12, 0.86, -0.92] },
  { kalit: "BaCl₂", nom: "Bariy xlorid", rang: 0xf1f5f9, pos: [0.12, 0.86, -0.92] },
  { kalit: "KI", nom: "Kaliy yodid", rang: 0xfef08a, pos: [0.36, 0.86, -0.92] },
];

function yorliq3dYasa(matn = "") {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
  ctx.beginPath();
  ctx.roundRect(2, 2, 124, 44, 8);
  ctx.fill();

  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.5;
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
  sprite.scale.set(0.11, 0.042, 1);
  sprite.raycast = () => {};
  return sprite;
}

export function javon3dYasa(materiallar, arzonRejim = false) {
  const mainCabinetGroup = new THREE.Group();
  mainCabinetGroup.name = "3D_Markaziy_Orol_Javoni";

  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const eni = 1.35;
  const balandlik = 0.95;
  const chukur = 0.28;
  const qalinlik = 0.035;

  // 1. Javon Yon Ustunlari (Chap va O'ng)
  const yonGeo = new THREE.BoxGeometry(qalinlik, balandlik, chukur);
  const yonChap = new THREE.Mesh(yonGeo, yogochMat);
  yonChap.position.set(-eni / 2, 1.15, -0.95);
  mainCabinetGroup.add(yonChap);

  const yonOng = new THREE.Mesh(yonGeo, yogochMat);
  yonOng.position.set(eni / 2, 1.15, -0.95);
  mainCabinetGroup.add(yonOng);

  // 2. Qopqoq Tepa va Tubi
  const qopqoqGeo = new THREE.BoxGeometry(eni + qalinlik, qalinlik, chukur);
  const qopqoqTepa = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTepa.position.set(0, 1.15 + balandlik / 2, -0.95);
  mainCabinetGroup.add(qopqoqTepa);

  const qopqoqTub = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTub.position.set(0, 1.15 - balandlik / 2, -0.95);
  mainCabinetGroup.add(qopqoqTub);

  // 3. Orqa panel
  const orqaGeo = new THREE.BoxGeometry(eni, balandlik, 0.015);
  const orqaPanel = new THREE.Mesh(orqaGeo, yogochMat);
  orqaPanel.position.set(0, 1.15, -0.95 - chukur / 2);
  mainCabinetGroup.add(orqaPanel);

  // 4. 3 ta Shisha Polkalar (Shelves)
  const polkaGeo = new THREE.BoxGeometry(eni - 0.02, 0.015, chukur - 0.02);
  const polkaYlar = [0.80, 1.10, 1.40];

  polkaYlar.forEach((y) => {
    const polka = new THREE.Mesh(polkaGeo, shishaMat);
    polka.position.set(0, y, -0.95);
    mainCabinetGroup.add(polka);
  });

  // 5. Polkalarda terilgan 3D Reagent Shishalari
  SHISHA_REAGENTLAR.forEach((item) => {
    const bottleGroup = new THREE.Group();
    bottleGroup.userData = {
      kalit: item.kalit,
      nom: item.nom || item.kalit,
      tanlanadi: true,
      ogizBalandligi: 0.1,
    };

    // Shisha tanasi
    const tanaGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.075, 16);
    const tanaMesh = new THREE.Mesh(tanaGeo, shishaMat);
    tanaMesh.position.y = 0.038;
    bottleGroup.add(tanaMesh);

    // Ichidagi suyuqlik
    const suyuqlikMat = new THREE.MeshStandardMaterial({
      color: item.rang,
      roughness: 0.2,
      metalness: 0.1,
    });
    const suyuqlikGeo = new THREE.CylinderGeometry(0.023, 0.023, 0.055, 16);
    const suyuqlikMesh = new THREE.Mesh(suyuqlikGeo, suyuqlikMat);
    suyuqlikMesh.position.y = 0.03;
    bottleGroup.add(suyuqlikMesh);

    // Qopqoq
    const qopqoqGeo = new THREE.CylinderGeometry(0.012, 0.015, 0.022, 12);
    const qopqoqMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
    const qopqoq = new THREE.Mesh(qopqoqGeo, qopqoqMat);
    qopqoq.position.y = 0.086;
    bottleGroup.add(qopqoq);

    // 3D Yorliq (Formula Label)
    const yorliq = yorliq3dYasa(item.kalit);
    yorliq.position.set(0, 0.11, 0.01);
    bottleGroup.add(yorliq);

    bottleGroup.position.set(...item.pos);
    mainCabinetGroup.add(bottleGroup);
  });

  return mainCabinetGroup;
}
