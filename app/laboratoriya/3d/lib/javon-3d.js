import * as THREE from "three";

// 2-QADAM: KO'P QAVATLI KATTA REAGENTLAR JAVONI VA ANIQ HAJMLI SHISHALAR (25ml - 1000ml).
// 4 ta alohida kimyoviy sektsiya, GHS xavfsizlik belgilari va real suyuqlik kamayishi.

export const KATTA_JAVON_REAGENTLARI = [
  // ─── 1-SEKTSIYA: KISLOTALAR VA OKSIDLOVCHILAR (500 ml Katta Amber/Shisha Bankalar) ───
  { kalit: "HCl", nom: "Xlorid kislota", sigim: 500, joriyHajm: 450, rang: 0xf8fafc, ghs: "korroziy", shishaTuri: "tiniq", pos: [-0.62, 1.44, -0.92] },
  { kalit: "HNO₃", nom: "Nitrat kislota", sigim: 500, joriyHajm: 420, rang: 0xfef08a, ghs: "oksidlovchi", shishaTuri: "amber", pos: [-0.38, 1.44, -0.92] },
  { kalit: "H₂SO₄", nom: "Sulfat kislota (Quyuq)", sigim: 500, joriyHajm: 480, rang: 0xfacc15, ghs: "korroziy", shishaTuri: "amber", pos: [-0.14, 1.44, -0.92] },
  { kalit: "CH₃COOH", nom: "Sirka kislota (Muzdek)", sigim: 500, joriyHajm: 380, rang: 0xe2e8f0, ghs: "yonuvchan", shishaTuri: "tiniq", pos: [0.10, 1.44, -0.92] },
  { kalit: "H₂O", nom: "Distillangan suv (1L)", sigim: 1000, joriyHajm: 950, rang: 0x38bdf8, ghs: "xavfsiz", shishaTuri: "bak", pos: [0.45, 1.44, -0.92] },

  // ─── 2-SEKTSIYA: ISHQORLAR VA ASOSLAR (500 ml / 250 ml) ───
  { kalit: "NaOH", nom: "Natriy gidroksid ishqori", sigim: 500, joriyHajm: 400, rang: 0xbae6fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [-0.55, 1.15, -0.92] },
  { kalit: "KOH", nom: "Kaliy gidroksid", sigim: 500, joriyHajm: 350, rang: 0x93c5fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [-0.30, 1.15, -0.92] },
  { kalit: "NH₃", nom: "Ammiakli suv (25%)", sigim: 500, joriyHajm: 450, rang: 0xcfe8ff, ghs: "toksik", shishaTuri: "amber", pos: [-0.05, 1.15, -0.92] },
  { kalit: "Ba(OH)₂", nom: "Bariy gidroksid", sigim: 250, joriyHajm: 200, rang: 0xf1f5f9, ghs: "korroziy", shishaTuri: "tiniq", pos: [0.20, 1.15, -0.92] },
  { kalit: "Ca(OH)₂", nom: "Ohakli suv", sigim: 500, joriyHajm: 300, rang: 0xffffff, ghs: "xavfsiz", shishaTuri: "tiniq", pos: [0.45, 1.15, -0.92] },

  // ─── 3-SEKTSIYA: STANDART TUZLAR (100 ml O'rtacha Shishalar) ───
  { kalit: "CuSO₄", nom: "Mis(II) sulfat", sigim: 100, joriyHajm: 85, rang: 0x0284c7, ghs: "xavfsiz", shishaTuri: "orta", pos: [-0.55, 0.86, -0.92] },
  { kalit: "AgNO₃", nom: "Kumush nitrat", sigim: 100, joriyHajm: 70, rang: 0x94a3b8, ghs: "korroziy", shishaTuri: "amber", pos: [-0.35, 0.86, -0.92] },
  { kalit: "KMnO₄", nom: "Kaliy permanganat", sigim: 100, joriyHajm: 90, rang: 0x7e22ce, ghs: "oksidlovchi", shishaTuri: "amber", pos: [-0.15, 0.86, -0.92] },
  { kalit: "FeCl₃", nom: "Temir(III) xlorid", sigim: 100, joriyHajm: 75, rang: 0xc2410c, ghs: "korroziy", shishaTuri: "orta", pos: [0.05, 0.86, -0.92] },
  { kalit: "BaCl₂", nom: "Bariy xlorid", sigim: 100, joriyHajm: 80, rang: 0xf1f5f9, ghs: "toksik", shishaTuri: "orta", pos: [0.25, 0.86, -0.92] },
  { kalit: "KI", nom: "Kaliy yodid", sigim: 100, joriyHajm: 95, rang: 0xfef08a, ghs: "xavfsiz", shishaTuri: "orta", pos: [0.45, 0.86, -0.92] },

  // ─── 4-SEKTSIYA: INDIKATORLAR (25 ml Tomizgichli Flakonlar) ───
  { kalit: "Fenolftalein", nom: "Fenolftalein", sigim: 25, joriyHajm: 20, rang: 0xffffff, ghs: "yonuvchan", shishaTuri: "tomizgich", pos: [-0.25, 0.58, -0.92] },
  { kalit: "Metiloranj", nom: "Metiloranj", sigim: 25, joriyHajm: 22, rang: 0xf97316, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [0.0, 0.58, -0.92] },
  { kalit: "Lakmus", nom: "Lakmus indikatori", sigim: 25, joriyHajm: 18, rang: 0x8b5cf6, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [0.25, 0.58, -0.92] },
];

const GHS_RANGLARI = {
  korroziy: "#ef4444",   // Qizil
  oksidlovchi: "#f59e0b", // To'q sariq
  toksik: "#a855f7",      // Binafsha
  yonuvchan: "#f97316",   // Olovrang
  xavfsiz: "#38bdf8",     // Zangori
};

/** Shisha uchun 3D Canvas Yorlig'i (Formula + Sig'im + GHS belgisi) */
function shishaYorliginiYasa(item) {
  if (typeof document === "undefined") return new THREE.Group();
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  // Fon
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.beginPath();
  ctx.roundRect(2, 2, 188, 68, 8);
  ctx.fill();

  // GHS Hoshiyasi
  const hoshiyaRangi = GHS_RANGLARI[item.ghs] || "#38bdf8";
  ctx.strokeStyle = hoshiyaRangi;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Formula
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(item.kalit, 96, 32);

  // Sig'im (ml)
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 16px monospace";
  ctx.fillText(`${item.joriyHajm}/${item.sigim}ml`, 96, 56);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.14, 0.052, 1);
  sprite.raycast = () => {};
  return sprite;
}

/** 3D Reagent Shishasi Yasash (25ml, 100ml, 500ml, 1000ml) */
function reagentShishasiModel(item, materiallar) {
  const bottleGroup = new THREE.Group();
  bottleGroup.userData = {
    kalit: item.kalit,
    nom: item.nom,
    sigim: item.sigim,
    joriyHajm: item.joriyHajm,
    ghs: item.ghs,
    tanlanadi: true,
  };

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

  let radius = 0.026;
  let balandlik = 0.075;
  let boyinR = 0.012;
  let boyinH = 0.022;

  // 1. 25 ml Flakon
  if (item.shishaTuri === "tomizgich") {
    radius = 0.016;
    balandlik = 0.045;
    boyinR = 0.007;
    boyinH = 0.018;
  }
  // 2. 500 ml Katta Banka
  else if (item.sigim === 500) {
    radius = 0.042;
    balandlik = 0.11;
    boyinR = 0.018;
    boyinH = 0.028;
  }
  // 3. 1000 ml Suv Baki
  else if (item.sigim === 1000) {
    radius = 0.055;
    balandlik = 0.14;
    boyinR = 0.024;
    boyinH = 0.035;
  }

  // Tana
  const tanaGeo = new THREE.CylinderGeometry(radius, radius, balandlik, 18);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = balandlik / 2;
  bottleGroup.add(tana);

  // Ichidagi suyuqlik (Hajmga qarab)
  const suyuqRatio = item.joriyHajm / item.sigim;
  const suyuqH = (balandlik * 0.8) * suyuqRatio;
  const suyuqGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, suyuqH, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqMat);
  suyuq.position.y = suyuqH / 2 + 0.004;
  bottleGroup.add(suyuq);
  bottleGroup.userData.suyuqlikMesh = suyuq;

  // Bo'yin va Qopqoq
  const qopqoqGeo = new THREE.CylinderGeometry(boyinR * 1.1, boyinR * 1.3, boyinH, 14);
  const qopqoq = new THREE.Mesh(qopqoqGeo, qopqoqMat);
  qopqoq.position.y = balandlik + boyinH / 2;
  bottleGroup.add(qopqoq);

  // Yorliq (Label)
  const yorliq = shishaYorliginiYasa(item);
  yorliq.position.set(0, balandlik + boyinH + 0.04, 0);
  bottleGroup.add(yorliq);

  bottleGroup.position.set(...item.pos);
  return bottleGroup;
}

export function javon3dYasa(materiallar, arzonRejim = false) {
  const mainCabinetGroup = new THREE.Group();
  mainCabinetGroup.name = "3D_Katta_Reagentlar_Javoni";

  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const eni = 1.6;
  const balandlik = 1.25;
  const chukur = 0.32;
  const qalinlik = 0.035;

  // 1. Javon Karkasi
  const yonGeo = new THREE.BoxGeometry(qalinlik, balandlik, chukur);
  const yonChap = new THREE.Mesh(yonGeo, yogochMat);
  yonChap.position.set(-eni / 2, 1.05, -0.95);
  mainCabinetGroup.add(yonChap);

  const yonOng = new THREE.Mesh(yonGeo, yogochMat);
  yonOng.position.set(eni / 2, 1.05, -0.95);
  mainCabinetGroup.add(yonOng);

  const qopqoqGeo = new THREE.BoxGeometry(eni + qalinlik, qalinlik, chukur);
  const qopqoqTepa = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTepa.position.set(0, 1.05 + balandlik / 2, -0.95);
  mainCabinetGroup.add(qopqoqTepa);

  const qopqoqTub = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTub.position.set(0, 1.05 - balandlik / 2, -0.95);
  mainCabinetGroup.add(qopqoqTub);

  const orqaGeo = new THREE.BoxGeometry(eni, balandlik, 0.015);
  const orqaPanel = new THREE.Mesh(orqaGeo, yogochMat);
  orqaPanel.position.set(0, 1.05, -0.95 - chukur / 2);
  mainCabinetGroup.add(orqaPanel);

  // 2. 4 ta Shisha Polkalar (Shelves)
  const polkaGeo = new THREE.BoxGeometry(eni - 0.02, 0.015, chukur - 0.02);
  const polkaYlar = [0.55, 0.82, 1.12, 1.42];

  polkaYlar.forEach((y) => {
    const polka = new THREE.Mesh(polkaGeo, shishaMat);
    polka.position.set(0, y, -0.95);
    mainCabinetGroup.add(polka);
  });

  // 3. Shishalarni o'rnatish
  KATTA_JAVON_REAGENTLARI.forEach((item) => {
    const bottle = reagentShishasiModel(item, materiallar);
    mainCabinetGroup.add(bottle);
  });

  return mainCabinetGroup;
}
