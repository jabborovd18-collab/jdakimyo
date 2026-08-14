// app/laboratoriya/3d/lib/xona-modellari.js
//
// 16x12m KATTA UNIVERSITET LABORATORIYA ZALI ME'MORCHILIGI VA DEVOR JAVONLARI.
// O'rtadagi to'siq javon butunlay olib tashlangan: zal keng, yorug' va erkin.
//
import * as THREE from "three";

/** Davriy jadval plakatini yaratish — 2048x1024 Yuqori aniqlikdagi keng formatli LED plakat */
function davriyJadvalPlakati() {
  if (typeof document === "undefined") return new THREE.Group();
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Group();

    // 1. To'q titan shisha fon
    ctx.fillStyle = "#0a0f1d";
    ctx.fillRect(0, 0, 2048, 1024);

    // Neon ramka hoshiyasi
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 10;
    ctx.strokeRect(16, 16, 2016, 992);

    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1988, 964);

    // 2. Sarlavha
    ctx.fillStyle = "#facc15";
    ctx.font = "900 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("D.I. MENDELEYEV DAVRIY SISTEMASI (IUPAC)", 1024, 76);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 24px monospace";
    ctx.fillText("JDA KIMYO — OLIY TA'LIM VA TADQIQOT PLATFORMASI", 1024, 114);

    // 3. Davriy Jadval Elementlari Koordinata Matritsasi
    const GRID_ELEMENTS = [
      // 1-davr
      { col: 1, row: 1, z: 1, sym: "H", colCat: "#22c55e" },
      { col: 18, row: 1, z: 2, sym: "He", colCat: "#38bdf8" },

      // 2-davr
      { col: 1, row: 2, z: 3, sym: "Li", colCat: "#f97316" },
      { col: 2, row: 2, z: 4, sym: "Be", colCat: "#eab308" },
      { col: 13, row: 2, z: 5, sym: "B", colCat: "#14b8a6" },
      { col: 14, row: 2, z: 6, sym: "C", colCat: "#22c55e" },
      { col: 15, row: 2, z: 7, sym: "N", colCat: "#22c55e" },
      { col: 16, row: 2, z: 8, sym: "O", colCat: "#22c55e" },
      { col: 17, row: 2, z: 9, sym: "F", colCat: "#84cc16" },
      { col: 18, row: 2, z: 10, sym: "Ne", colCat: "#38bdf8" },

      // 3-davr
      { col: 1, row: 3, z: 11, sym: "Na", colCat: "#f97316" },
      { col: 2, row: 3, z: 12, sym: "Mg", colCat: "#eab308" },
      { col: 13, row: 3, z: 13, sym: "Al", colCat: "#06b6d4" },
      { col: 14, row: 3, z: 14, sym: "Si", colCat: "#14b8a6" },
      { col: 15, row: 3, z: 15, sym: "P", colCat: "#22c55e" },
      { col: 16, row: 3, z: 16, sym: "S", colCat: "#22c55e" },
      { col: 17, row: 3, z: 17, sym: "Cl", colCat: "#84cc16" },
      { col: 18, row: 3, z: 18, sym: "Ar", colCat: "#38bdf8" },

      // 4-davr
      { col: 1, row: 4, z: 19, sym: "K", colCat: "#f97316" },
      { col: 2, row: 4, z: 20, sym: "Ca", colCat: "#eab308" },
      { col: 3, row: 4, z: 21, sym: "Sc", colCat: "#a855f7" },
      { col: 4, row: 4, z: 22, sym: "Ti", colCat: "#a855f7" },
      { col: 5, row: 4, z: 23, sym: "V", colCat: "#a855f7" },
      { col: 6, row: 4, z: 24, sym: "Cr", colCat: "#a855f7" },
      { col: 7, row: 4, z: 25, sym: "Mn", colCat: "#a855f7" },
      { col: 8, row: 4, z: 26, sym: "Fe", colCat: "#a855f7" },
      { col: 9, row: 4, z: 27, sym: "Co", colCat: "#a855f7" },
      { col: 10, row: 4, z: 28, sym: "Ni", colCat: "#a855f7" },
      { col: 11, row: 4, z: 29, sym: "Cu", colCat: "#a855f7" },
      { col: 12, row: 4, z: 30, sym: "Zn", colCat: "#a855f7" },
      { col: 13, row: 4, z: 31, sym: "Ga", colCat: "#06b6d4" },
      { col: 14, row: 4, z: 32, sym: "Ge", colCat: "#14b8a6" },
      { col: 15, row: 4, z: 33, sym: "As", colCat: "#14b8a6" },
      { col: 16, row: 4, z: 34, sym: "Se", colCat: "#22c55e" },
      { col: 17, row: 4, z: 35, sym: "Br", colCat: "#84cc16" },
      { col: 18, row: 4, z: 36, sym: "Kr", colCat: "#38bdf8" },

      // 5-davr
      { col: 1, row: 5, z: 37, sym: "Rb", colCat: "#f97316" },
      { col: 2, row: 5, z: 38, sym: "Sr", colCat: "#eab308" },
      { col: 3, row: 5, z: 39, sym: "Y", colCat: "#a855f7" },
      { col: 4, row: 5, z: 40, sym: "Zr", colCat: "#a855f7" },
      { col: 5, row: 5, z: 41, sym: "Nb", colCat: "#a855f7" },
      { col: 6, row: 5, z: 42, sym: "Mo", colCat: "#a855f7" },
      { col: 7, row: 5, z: 43, sym: "Tc", colCat: "#a855f7" },
      { col: 8, row: 5, z: 44, sym: "Ru", colCat: "#a855f7" },
      { col: 9, row: 5, z: 45, sym: "Rh", colCat: "#a855f7" },
      { col: 10, row: 5, z: 46, sym: "Pd", colCat: "#a855f7" },
      { col: 11, row: 5, z: 47, sym: "Ag", colCat: "#a855f7" },
      { col: 12, row: 5, z: 48, sym: "Cd", colCat: "#a855f7" },
      { col: 13, row: 5, z: 49, sym: "In", colCat: "#06b6d4" },
      { col: 14, row: 5, z: 50, sym: "Sn", colCat: "#06b6d4" },
      { col: 15, row: 5, z: 51, sym: "Sb", colCat: "#14b8a6" },
      { col: 16, row: 5, z: 52, sym: "Te", colCat: "#14b8a6" },
      { col: 17, row: 5, z: 53, sym: "I", colCat: "#84cc16" },
      { col: 18, row: 5, z: 54, sym: "Xe", colCat: "#38bdf8" },

      // 6-davr
      { col: 1, row: 6, z: 55, sym: "Cs", colCat: "#f97316" },
      { col: 2, row: 6, z: 56, sym: "Ba", colCat: "#eab308" },
      { col: 3, row: 6, z: 57, sym: "La*", colCat: "#ec4899" },
      { col: 4, row: 6, z: 72, sym: "Hf", colCat: "#a855f7" },
      { col: 5, row: 6, z: 73, sym: "Ta", colCat: "#a855f7" },
      { col: 6, row: 6, z: 74, sym: "W", colCat: "#a855f7" },
      { col: 7, row: 6, z: 75, sym: "Re", colCat: "#a855f7" },
      { col: 8, row: 6, z: 76, sym: "Os", colCat: "#a855f7" },
      { col: 9, row: 6, z: 77, sym: "Ir", colCat: "#a855f7" },
      { col: 10, row: 6, z: 78, sym: "Pt", colCat: "#a855f7" },
      { col: 11, row: 6, z: 79, sym: "Au", colCat: "#a855f7" },
      { col: 12, row: 6, z: 80, sym: "Hg", colCat: "#a855f7" },
      { col: 13, row: 6, z: 81, sym: "Tl", colCat: "#06b6d4" },
      { col: 14, row: 6, z: 82, sym: "Pb", colCat: "#06b6d4" },
      { col: 15, row: 6, z: 83, sym: "Bi", colCat: "#06b6d4" },
      { col: 16, row: 6, z: 84, sym: "Po", colCat: "#14b8a6" },
      { col: 17, row: 6, z: 85, sym: "At", colCat: "#84cc16" },
      { col: 18, row: 6, z: 86, sym: "Rn", colCat: "#38bdf8" },

      // 7-davr
      { col: 1, row: 7, z: 87, sym: "Fr", colCat: "#f97316" },
      { col: 2, row: 7, z: 88, sym: "Ra", colCat: "#eab308" },
      { col: 3, row: 7, z: 89, sym: "Ac**", colCat: "#ec4899" },
      { col: 4, row: 7, z: 104, sym: "Rf", colCat: "#a855f7" },
      { col: 5, row: 7, z: 105, sym: "Db", colCat: "#a855f7" },
      { col: 6, row: 7, z: 106, sym: "Sg", colCat: "#a855f7" },
      { col: 7, row: 7, z: 107, sym: "Bh", colCat: "#a855f7" },
      { col: 8, row: 7, z: 108, sym: "Hs", colCat: "#a855f7" },
      { col: 9, row: 7, z: 109, sym: "Mt", colCat: "#a855f7" },
      { col: 10, row: 7, z: 110, sym: "Ds", colCat: "#a855f7" },
      { col: 11, row: 7, z: 111, sym: "Rg", colCat: "#a855f7" },
      { col: 12, row: 7, z: 112, sym: "Cn", colCat: "#a855f7" },
      { col: 13, row: 7, z: 113, sym: "Nh", colCat: "#06b6d4" },
      { col: 14, row: 7, z: 114, sym: "Fl", colCat: "#06b6d4" },
      { col: 15, row: 7, z: 115, sym: "Mc", colCat: "#06b6d4" },
      { col: 16, row: 7, z: 116, sym: "Lv", colCat: "#06b6d4" },
      { col: 17, row: 7, z: 117, sym: "Ts", colCat: "#84cc16" },
      { col: 18, row: 7, z: 118, sym: "Og", colCat: "#38bdf8" },
    ];

    const cellW = 98;
    const cellH = 100;
    const startX = 60;
    const startY = 150;

    GRID_ELEMENTS.forEach((el) => {
      const x = startX + (el.col - 1) * (cellW + 8);
      const y = startY + (el.row - 1) * (cellH + 8);

      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.roundRect(x, y, cellW, cellH, 8);
      ctx.fill();

      ctx.strokeStyle = el.colCat;
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(String(el.z), x + 8, y + 26);

      ctx.fillStyle = "#ffffff";
      ctx.font = "900 36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(el.sym, x + cellW / 2, y + 68);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;

    const group = new THREE.Group();
    group.name = "Davriy_Jadval_LED_Plakat";
    group.position.set(0, 2.65, -5.55);

    const karkasGeo = new THREE.BoxGeometry(4.2, 2.1, 0.04);
    const karkasMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const karkas = new THREE.Mesh(karkasGeo, karkasMat);
    karkas.userData = { kalit: "davriy_jadval", nom: "D.I. Mendeleyev Davriy Jadvali", tanlanadi: true };
    group.add(karkas);

    const panelGeo = new THREE.PlaneGeometry(4.12, 2.02);
    const panelMat = new THREE.MeshBasicMaterial({ map: texture });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.z = 0.022;
    panel.userData = { kalit: "davriy_jadval", nom: "D.I. Mendeleyev Davriy Jadvali", tanlanadi: true };
    group.add(panel);

    group.userData = { kalit: "davriy_jadval", nom: "D.I. Mendeleyev Davriy Jadvali", tanlanadi: true };
    return group;
  } catch {
    return new THREE.Group();
  }
}

/** 16x12m KATTA UNIVERSITET LABORATORIYA ZALI ME'MORCHILIGI */
function xonaQobiginiYasa(materiallar) {
  const roomGroup = new THREE.Group();
  roomGroup.name = "16x12m_Grand_Laboratoriya_Zali";

  const devorMat = materiallar?.devor || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const shiftMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
  const polMat = materiallar?.pol || new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.25, metalness: 0.15 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.45 });
  const ramkaMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

  const XONA_W = 16.0;
  const XONA_H = 4.2;
  const XONA_D = 12.0;

  // 1. EPOKSI KIMYOVIY POL (Y = 0, 16x12m)
  const polGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const pol = new THREE.Mesh(polGeo, polMat);
  pol.rotation.x = -Math.PI / 2;
  pol.position.set(0, 0, 0.4);
  pol.receiveShadow = true;
  roomGroup.add(pol);

  // 2. SHIFT VA 8 TA RECESSED LED PANELLARI (Y = 4.2)
  const shiftGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const shift = new THREE.Mesh(shiftGeo, shiftMat);
  shift.rotation.x = Math.PI / 2;
  shift.position.set(0, XONA_H, 0.4);
  roomGroup.add(shift);

  const trofferGeo = new THREE.PlaneGeometry(2.0, 0.8);
  const trofferMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const trofferYlar = [
    [-5.0, -3.0], [-1.8, -3.0], [1.8, -3.0], [5.0, -3.0],
    [-5.0, 2.5],  [-1.8, 2.5],  [1.8, 2.5],  [5.0, 2.5],
  ];
  trofferYlar.forEach(([x, z]) => {
    const lamp = new THREE.Mesh(trofferGeo, trofferMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x, XONA_H - 0.01, z);
    roomGroup.add(lamp);
  });

  // 3. CHAP DEVOR VA 4 TA KATTA DERAZALAR (X = -8.0)
  const devorChapGeo = new THREE.PlaneGeometry(XONA_D, XONA_H);
  const devorChap = new THREE.Mesh(devorChapGeo, devorMat);
  devorChap.rotation.y = Math.PI / 2;
  devorChap.position.set(-XONA_W / 2, XONA_H / 2, 0.4);
  devorChap.receiveShadow = true;
  roomGroup.add(devorChap);

  [-3.5, -1.0, 1.5, 4.0].forEach((z) => {
    const derazaGeo = new THREE.PlaneGeometry(2.0, 2.4);
    const deraza = new THREE.Mesh(derazaGeo, shishaMat);
    deraza.rotation.y = Math.PI / 2;
    deraza.position.set(-XONA_W / 2 + 0.02, 2.3, z);
    roomGroup.add(deraza);
  });

  const daylight = new THREE.DirectionalLight(0xe0f2fe, 1.4);
  daylight.position.set(-12.0, 6.0, 1.0);
  daylight.target.position.set(0, 1.0, 0);
  roomGroup.add(daylight);

  // 4. O'NG DEVOR (X = +8.0)
  const devorOngGeo = new THREE.PlaneGeometry(XONA_D, XONA_H);
  const devorOng = new THREE.Mesh(devorOngGeo, devorMat);
  devorOng.rotation.y = -Math.PI / 2;
  devorOng.position.set(XONA_W / 2, XONA_H / 2, 0.4);
  devorOng.receiveShadow = true;
  roomGroup.add(devorOng);

  // 5. ORQA DEVOR (Z = -5.6)
  const devorOrqaGeo = new THREE.PlaneGeometry(XONA_W, XONA_H);
  const devorOrqa = new THREE.Mesh(devorOrqaGeo, devorMat);
  devorOrqa.position.set(0, XONA_H / 2, -XONA_D / 2 + 0.4);
  devorOrqa.receiveShadow = true;
  roomGroup.add(devorOrqa);

  // 6. OLD DEVOR VA ESHIKLAR (Z = 6.4)
  const devorOldGeo = new THREE.PlaneGeometry(XONA_W, XONA_H);
  const devorOld = new THREE.Mesh(devorOldGeo, devorMat);
  devorOld.rotation.y = Math.PI;
  devorOld.position.set(0, XONA_H / 2, XONA_D / 2 + 0.4);
  devorOld.receiveShadow = true;
  roomGroup.add(devorOld);

  const eshikGeo = new THREE.BoxGeometry(2.0, 2.6, 0.05);
  const eshik = new THREE.Mesh(eshikGeo, ramkaMat);
  eshik.position.set(0, 1.3, XONA_D / 2 + 0.38);
  roomGroup.add(eshik);

  // Haqiqiy neon nurli EXIT / CHIQISH belgisi (Illuminated Emergency Exit Sign)
  if (typeof document !== "undefined") {
    const exitCanvas = document.createElement("canvas");
    exitCanvas.width = 256;
    exitCanvas.height = 96;
    const exitCtx = exitCanvas.getContext("2d");
    if (exitCtx) {
      exitCtx.fillStyle = "#064e3b";
      exitCtx.fillRect(0, 0, 256, 96);
      exitCtx.strokeStyle = "#10b981";
      exitCtx.lineWidth = 6;
      exitCtx.strokeRect(4, 4, 248, 88);

      exitCtx.fillStyle = "#ffffff";
      exitCtx.font = "900 34px sans-serif";
      exitCtx.textAlign = "center";
      exitCtx.fillText("EXIT / CHIQISH", 128, 48);

      exitCtx.fillStyle = "#34d399";
      exitCtx.font = "bold 20px monospace";
      exitCtx.fillText("🏃 CHIQISH ESALIK", 128, 78);

      const exitTexture = new THREE.CanvasTexture(exitCanvas);
      const exitSignGeo = new THREE.PlaneGeometry(0.72, 0.26);
      const exitSignMat = new THREE.MeshBasicMaterial({ map: exitTexture });
      const exitSignMesh = new THREE.Mesh(exitSignGeo, exitSignMat);
      exitSignMesh.rotation.y = Math.PI;
      exitSignMesh.position.set(0, 2.85, XONA_D / 2 + 0.36);
      roomGroup.add(exitSignMesh);
    }
  }

  // Eshik yonidagi Raqamli Xona Iqlim va Havfsizlik Stansiyasi (Room Climate & Safety Monitor)
  if (typeof document !== "undefined") {
    const climateCanvas = document.createElement("canvas");
    climateCanvas.width = 512;
    climateCanvas.height = 256;
    const clCtx = climateCanvas.getContext("2d");
    if (clCtx) {
      clCtx.fillStyle = "#030712";
      clCtx.fillRect(0, 0, 512, 256);

      clCtx.strokeStyle = "#38bdf8";
      clCtx.lineWidth = 4;
      clCtx.strokeRect(6, 6, 500, 244);

      clCtx.fillStyle = "#38bdf8";
      clCtx.font = "bold 22px monospace";
      clCtx.textAlign = "left";
      clCtx.fillText("● JDA-LAB CLIMATE & SAFETY", 20, 36);

      clCtx.fillStyle = "#64748b";
      clCtx.font = "bold 16px monospace";
      clCtx.textAlign = "right";
      clCtx.fillText("ONLINE", 492, 36);

      // Harorat
      clCtx.fillStyle = "#10b981";
      clCtx.font = "900 48px monospace";
      clCtx.textAlign = "left";
      clCtx.fillText("22.4°C", 20, 100);

      clCtx.fillStyle = "#94a3b8";
      clCtx.font = "bold 18px monospace";
      clCtx.fillText("Namlik: 48% RH", 240, 75);
      clCtx.fillText("Bosim: 758 mmHg", 240, 102);

      // Havo sifati & O2
      clCtx.fillStyle = "#0f172a";
      clCtx.fillRect(16, 125, 480, 105);
      clCtx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      clCtx.strokeRect(16, 125, 480, 105);

      clCtx.fillStyle = "#34d399";
      clCtx.font = "bold 20px monospace";
      clCtx.fillText("Havo sifati: ● XAVFSIZ (0.00 ppm)", 30, 160);

      clCtx.fillStyle = "#38bdf8";
      clCtx.fillText("O₂ darajasi: 20.9% (Optimal)", 30, 195);
      clCtx.fillText("Ventilyatsiya: FAOL (100%)", 30, 222);

      const climateTexture = new THREE.CanvasTexture(climateCanvas);
      const climateMeshGeo = new THREE.PlaneGeometry(0.85, 0.44);
      const climateMeshMat = new THREE.MeshBasicMaterial({ map: climateTexture });
      const climateMesh = new THREE.Mesh(climateMeshGeo, climateMeshMat);
      climateMesh.name = "Xona_Iqlim_Stansiyasi";
      climateMesh.rotation.y = Math.PI;
      climateMesh.position.set(1.8, 1.65, XONA_D / 2 + 0.36);
      roomGroup.add(climateMesh);
    }
  }

  // 7. Xavfsizlik Dushi va Ko'z Yuvish (O'ng devorda)
  const dushGroup = new THREE.Group();
  dushGroup.position.set(XONA_W / 2 - 0.15, 0.9, 3.5);

  const trubaGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.0, 16);
  const truba = new THREE.Mesh(trubaGeo, ramkaMat);
  truba.position.y = 1.0;
  dushGroup.add(truba);

  const boshGeo = new THREE.ConeGeometry(0.1, 0.08, 16);
  const bosh = new THREE.Mesh(boshGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
  bosh.position.set(-0.2, 1.9, 0);
  dushGroup.add(bosh);

  roomGroup.add(dushGroup);

  return roomGroup;
}

/** Tortma Shkaf (Fume Hood) modeli */
function tortmaShkafYasa(materiallar) {
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

  const ichkiChiroq = new THREE.PointLight(0xffffff, 1.0, 1.8);
  ichkiChiroq.position.set(0, 0.85, 0);
  group.add(ichkiChiroq);

  return group;
}

/** Analitik Tarozi 2D Canvas LED Displeyi chizgichi */
function chizTaroziEkrani(ctx, canvas, massa = 0, tara = 0, idishNomi = "", barqaror = true) {
  const w = canvas.width;
  const h = canvas.height;

  // 1. OLED to'q fon va neon hoshiya
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, w, h);

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#090d16");
  grad.addColorStop(1, "#020617");
  ctx.fillStyle = grad;
  ctx.fillRect(4, 4, w - 8, h - 8);

  ctx.strokeStyle = barqaror ? "rgba(16, 185, 129, 0.6)" : "rgba(245, 158, 11, 0.8)";
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  // 2. Yuqori qator: Model va Barqarorlik holati
  ctx.fillStyle = "#64748b";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText("JDA-LAB 0.001g", 18, 30);

  ctx.textAlign = "right";
  if (barqaror) {
    ctx.fillStyle = "#10b981";
    ctx.fillText("● STABLE", w - 18, 30);
  } else {
    ctx.fillStyle = "#f59e0b";
    ctx.fillText("◌ WEIGHING...", w - 18, 30);
  }

  // 3. Asosiy raqamli massa displeyi (Yorqin Emerald Neon)
  const isharat = massa < -0.0001 ? "-" : "";
  const formatMassa = Math.abs(massa).toFixed(3);

  ctx.shadowColor = "#10b981";
  ctx.shadowBlur = barqaror ? 12 : 6;
  ctx.fillStyle = "#10b981";
  ctx.font = "900 76px monospace";
  ctx.textAlign = "right";
  ctx.fillText(`${isharat}${formatMassa}`, w - 75, 118);

  ctx.shadowBlur = 0; // Shadow reset
  ctx.fillStyle = "#34d399";
  ctx.font = "bold 32px monospace";
  ctx.textAlign = "left";
  ctx.fillText("g", w - 62, 115);

  // 4. Pastki axborot paneli (TARA, NET, IDISH NOMI)
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(10, h - 54, w - 20, 42);
  ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(10, h - 54, w - 20, 42);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "left";

  let statusMatn = "TARA: 0.000g  [READY]";
  if (tara > 0) {
    statusMatn = `TARA: ${tara.toFixed(3)}g [NET]`;
  }
  if (idishNomi) {
    statusMatn += ` | ${idishNomi.toUpperCase()}`;
  }
  ctx.fillText(statusMatn, 22, h - 28);
}

/** Analitik Tarozi Stoli modeli (High-Precision 3D Digital Analytical Balance) */
function taroziStoliYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Tarozi_Stansiyasi";
  group.position.set(-3.2, 0.9, 0.2); // Chap stolda

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.25 });
  const pallaMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.95, roughness: 0.1 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35, roughness: 0.1 });
  const qoraPlastikMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
  const sariqMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
  const kokMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.4 });

  // 1. Asosiy quyma alyuminiy korpus (Base Body)
  const korpusGeo = new THREE.BoxGeometry(0.44, 0.09, 0.42);
  const korpus = new THREE.Mesh(korpusGeo, metallMat);
  korpus.position.y = 0.045;
  korpus.castShadow = true;
  korpus.receiveShadow = true;
  group.add(korpus);

  // 4 ta rezina tekislovchi oyoqlar (Leveling feet)
  const oyoqGeo = new THREE.CylinderGeometry(0.018, 0.022, 0.02, 16);
  [[-0.19, -0.18], [0.19, -0.18], [-0.19, 0.18], [0.19, 0.18]].forEach(([ox, oz]) => {
    const oyoq = new THREE.Mesh(oyoqGeo, qoraPlastikMat);
    oyoq.position.set(ox, -0.01, oz);
    group.add(oyoq);
  });

  // Old qiyalikdagi boshqaruv paneli (Tilted Front Panel)
  const bevelGeo = new THREE.BoxGeometry(0.44, 0.075, 0.14);
  const bevel = new THREE.Mesh(bevelGeo, metallMat);
  bevel.rotation.x = Math.PI / 12; // 15 gradus qiyalik
  bevel.position.set(0, 0.05, 0.16);
  group.add(bevel);

  // 2. Dinamik LED Raqamli Displey (2D Canvas Texture)
  let canvas = null;
  let ctx = null;
  let texture = null;

  if (typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 220;
    ctx = canvas.getContext("2d");
    if (ctx) {
      chizTaroziEkrani(ctx, canvas, 0, 0, "", true);
      texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
    }
  }

  const ekranGeo = new THREE.PlaneGeometry(0.20, 0.06);
  const ekranMat = texture
    ? new THREE.MeshBasicMaterial({ map: texture })
    : new THREE.MeshBasicMaterial({ color: 0x10b981 });

  const ekran = new THREE.Mesh(ekranGeo, ekranMat);
  ekran.name = "Tarozi_LED_Ekrani";
  ekran.rotation.x = -Math.PI / 2.6; // Oldinga qaragan ergonomik qiyalik
  ekran.position.set(0, 0.072, 0.17);
  group.add(ekran);

  // 3. 3D Interaktiv Sensor Tugmalari (TARA, ZERO, UNIT)
  // TARA tugmasi
  const taraGeo = new THREE.BoxGeometry(0.045, 0.018, 0.008);
  const taraBtn = new THREE.Mesh(taraGeo, sariqMat);
  taraBtn.rotation.x = -Math.PI / 2.6;
  taraBtn.position.set(0.13, 0.062, 0.185);
  taraBtn.userData = { kalit: "tarozi_tara", tanlanadi: true };
  group.add(taraBtn);

  // ZERO tugmasi
  const zeroGeo = new THREE.BoxGeometry(0.045, 0.018, 0.008);
  const zeroBtn = new THREE.Mesh(zeroGeo, kokMat);
  zeroBtn.rotation.x = -Math.PI / 2.6;
  zeroBtn.position.set(-0.13, 0.062, 0.185);
  zeroBtn.userData = { kalit: "tarozi_nol", tanlanadi: true };
  group.add(zeroBtn);

  // 4. Zanglamas po'lat palla (Stainless Steel Weighing Pan)
  const pallaAsosGeo = new THREE.CylinderGeometry(0.065, 0.07, 0.02, 32);
  const pallaAsos = new THREE.Mesh(pallaAsosGeo, metallMat);
  pallaAsos.position.set(0, 0.10, -0.02);
  group.add(pallaAsos);

  const pallaGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.008, 32);
  const palla = new THREE.Mesh(pallaGeo, pallaMat);
  palla.name = "Tarozi_Palla";
  palla.position.set(0, 0.114, -0.02);
  palla.receiveShadow = true;
  group.add(palla);

  // Palla atrofidagi himoya halqasi (Draft ring)
  const ringGeo = new THREE.TorusGeometry(0.095, 0.004, 12, 32);
  const ring = new THREE.Mesh(ringGeo, metallMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.114, -0.02);
  group.add(ring);

  // 5. Shamol to'sig'i shisha kamerasi (Glass Draft Shield Enclosure)
  // Chap oyna
  const oynaChapGeo = new THREE.BoxGeometry(0.008, 0.28, 0.32);
  const oynaChap = new THREE.Mesh(oynaChapGeo, shishaMat);
  oynaChap.position.set(-0.18, 0.23, -0.02);
  group.add(oynaChap);

  // O'ng oyna
  const oynaOng = oynaChap.clone();
  oynaOng.position.x = 0.18;
  group.add(oynaOng);

  // Orqa oyna
  const oynaOrqaGeo = new THREE.BoxGeometry(0.36, 0.28, 0.008);
  const oynaOrqa = new THREE.Mesh(oynaOrqaGeo, shishaMat);
  oynaOrqa.position.set(0, 0.23, -0.18);
  group.add(oynaOrqa);

  // Old suriluvchi oyna va xrom tutqich
  const oynaOldGeo = new THREE.BoxGeometry(0.36, 0.28, 0.008);
  const oynaOld = new THREE.Mesh(oynaOldGeo, shishaMat);
  oynaOld.position.set(0, 0.23, 0.14);
  group.add(oynaOld);

  const dastakGeo = new THREE.BoxGeometry(0.06, 0.012, 0.015);
  const dastak = new THREE.Mesh(dastakGeo, metallMat);
  dastak.position.set(0, 0.24, 0.15);
  group.add(dastak);

  // Shift qopqog'i
  const shiftQopqoqGeo = new THREE.BoxGeometry(0.38, 0.01, 0.34);
  const shiftQopqoq = new THREE.Mesh(shiftQopqoqGeo, metallMat);
  shiftQopqoq.position.set(0, 0.375, -0.02);
  group.add(shiftQopqoq);

  // 6. userData va Ekranni yangilash dvigateli
  const ekranniYangila = (massa = 0, tara = 0, idishNomi = "", barqaror = true) => {
    if (ctx && canvas && texture) {
      chizTaroziEkrani(ctx, canvas, massa, tara, idishNomi, barqaror);
      texture.needsUpdate = true;
    }
  };

  group.userData = {
    kalit: "tarozi",
    tanlanadi: true,
    pallaMesh: palla,
    ekranMesh: ekran,
    taraBtn,
    zeroBtn,
    ekranniYangila,
    joriyMassa: 0,
    taraMassa: 0,
    idishNomi: "",
    barqaror: true,
  };

  return group;
}

/** Yuvinish Rakovinasi, Distillangan Suv Krani va Oqim modeli */
function rakovinaYasa(materiallar) {

  const group = new THREE.Group();
  group.name = "Yuvinish_Rakovinasi";
  group.position.set(-5.5, 0.9, -4.8); // Chap orqa burchakda

  const chinniMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 });
  const kranMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.1 });
  const suvMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75, roughness: 0.1 });

  // 1. Rakovina chinni vannasi
  const botiqGeo = new THREE.BoxGeometry(0.6, 0.26, 0.45);
  const botiq = new THREE.Mesh(botiqGeo, chinniMat);
  botiq.position.y = -0.1;
  group.add(botiq);

  // 2. Xrom kran ustuni va egik trubasi
  const kranAsosGeo = new THREE.CylinderGeometry(0.016, 0.02, 0.18, 16);
  const kranAsos = new THREE.Mesh(kranAsosGeo, kranMat);
  kranAsos.position.set(0, 0.09, -0.16);
  group.add(kranAsos);

  const kranTrubaGeo = new THREE.TorusGeometry(0.07, 0.014, 12, 16, Math.PI);
  const kranTruba = new THREE.Mesh(kranTrubaGeo, kranMat);
  kranTruba.rotation.y = Math.PI / 2;
  kranTruba.position.set(0, 0.18, -0.09);
  group.add(kranTruba);

  // Kran jo'mragi (Lever)
  const jomrakGeo = new THREE.BoxGeometry(0.015, 0.04, 0.015);
  const jomrak = new THREE.Mesh(jomrakGeo, new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
  jomrak.position.set(0, 0.18, -0.16);
  jomrak.userData = { kalit: "rakovina_kran", nom: "Distillangan Suv Krani", tanlanadi: true };
  group.add(jomrak);

  // 3. Dinamik Distillangan Suv Oqimi (Water Stream)
  const suvOqimiGeo = new THREE.CylinderGeometry(0.014, 0.018, 0.24, 16);
  const suvOqimiMesh = new THREE.Mesh(suvOqimiGeo, suvMat);
  suvOqimiMesh.position.set(0, 0.04, -0.02);
  suvOqimiMesh.visible = false;
  group.add(suvOqimiMesh);

  // 4. Suv Sachrash Zarrachalari (Splashing droplets)
  const splashGeo = new THREE.BufferGeometry();
  const splashPos = new Float32Array(36);
  for (let i = 0; i < 12; i++) {
    splashPos[i * 3] = (Math.random() - 0.5) * 0.08;
    splashPos[i * 3 + 1] = -0.08 + Math.random() * 0.04;
    splashPos[i * 3 + 2] = -0.02 + (Math.random() - 0.5) * 0.08;
  }
  splashGeo.setAttribute("position", new THREE.BufferAttribute(splashPos, 3));
  const splashMat = new THREE.PointsMaterial({ color: 0x38bdf8, size: 0.012, transparent: true, opacity: 0.85 });
  const splashPoints = new THREE.Points(splashGeo, splashMat);
  splashPoints.visible = false;
  group.add(splashPoints);

  group.userData = {
    kalit: "rakovina",
    nom: "Yuvinish Rakovinasi",
    tanlanadi: true,
    suvOqimiMesh,
    splashPoints,
    suvOqmoqda: false,
    jomrakMesh: jomrak,
  };

  return group;
}

/** Volumetrik Titrlash va Byuretka Stendi modeli */
function titrlashStendiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Titrlash_Byuretka_Stansiyasi";
  group.position.set(3.2, 0.9, 0.4); // O'ng stolda

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const suyuqlikMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.85 });

  const asosGeo = new THREE.BoxGeometry(0.24, 0.02, 0.16);
  const asos = new THREE.Mesh(asosGeo, metallMat);
  asos.position.y = 0.01;
  group.add(asos);

  const sterjenGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.72, 16);
  const sterjen = new THREE.Mesh(sterjenGeo, metallMat);
  sterjen.position.set(-0.08, 0.36, 0);
  group.add(sterjen);

  const qisqichGeo = new THREE.BoxGeometry(0.12, 0.025, 0.02);
  const qisqich = new THREE.Mesh(qisqichGeo, metallMat);
  qisqich.position.set(-0.02, 0.45, 0);
  group.add(qisqich);

  const byuretkaGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.52, 20);
  const byuretka = new THREE.Mesh(byuretkaGeo, shishaMat);
  byuretka.position.set(0.04, 0.42, 0);
  group.add(byuretka);

  const suyuqGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.38, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqlikMat);
  suyuq.position.set(0.04, 0.36, 0);
  group.add(suyuq);

  const jomrakGeo = new THREE.BoxGeometry(0.035, 0.015, 0.015);
  const jomrakMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const jomrak = new THREE.Mesh(jomrakGeo, jomrakMat);
  jomrak.position.set(0.04, 0.17, 0);
  group.add(jomrak);

  const kolbaGeo = new THREE.ConeGeometry(0.055, 0.1, 24);
  const kolba = new THREE.Mesh(kolbaGeo, shishaMat);
  kolba.position.set(0.04, 0.05, 0);
  group.add(kolba);

  group.userData = {
    kalit: "titrlash",
    nom: "50ml Volumetrik Titrlash Stendi",
    tanlanadi: true,
  };

  group.traverse((c) => {
    c.userData = { kalit: "titrlash", nom: "50ml Volumetrik Titrlash Stendi", tanlanadi: true };
  });

  return group;
}

/** 3D Elektroliz Vannasi va Tok Manbai modeli */
function elektrolizVannasiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Elektroliz_Stansiyasi";
  group.position.set(3.2, 0.9, -0.6); // O'ng stolda

  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const elektrolitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85 });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
  const tokManbaiMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });

  const vannaGeo = new THREE.BoxGeometry(0.34, 0.18, 0.22);
  const vanna = new THREE.Mesh(vannaGeo, shishaMat);
  vanna.position.set(0, 0.09, 0.05);
  group.add(vanna);

  const suyuqGeo = new THREE.BoxGeometry(0.32, 0.14, 0.2);
  const suyuq = new THREE.Mesh(suyuqGeo, elektrolitMat);
  suyuq.position.set(0, 0.07, 0.05);
  group.add(suyuq);

  const katodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const katod = new THREE.Mesh(katodGeo, metallMat);
  katod.position.set(-0.09, 0.1, 0.05);
  group.add(katod);

  const klemmaKGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaKMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
  const klemmaK = new THREE.Mesh(klemmaKGeo, klemmaKMat);
  klemmaK.position.set(-0.09, 0.19, 0.05);
  group.add(klemmaK);

  const anodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const anod = new THREE.Mesh(anodGeo, metallMat);
  anod.position.set(0.09, 0.1, 0.05);
  group.add(anod);

  const klemmaAGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaAMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const klemmaA = new THREE.Mesh(klemmaAGeo, klemmaAMat);
  klemmaA.position.set(0.09, 0.19, 0.05);
  group.add(klemmaA);

  const blokGeo = new THREE.BoxGeometry(0.24, 0.15, 0.14);
  const blok = new THREE.Mesh(blokGeo, tokManbaiMat);
  blok.position.set(0, 0.075, -0.12);
  group.add(blok);

  const ledGeo = new THREE.BoxGeometry(0.12, 0.04, 0.005);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(0, 0.1, -0.048);
  group.add(led);

  group.userData = {
    kalit: "elektroliz",
    nom: "Elektroliz va Tok Manbai Stendi",
    tanlanadi: true,
  };

  group.traverse((c) => {
    c.userData = { kalit: "elektroliz", nom: "Elektroliz va Tok Manbai Stendi", tanlanadi: true };
  });

  return group;
}

/** 3D Jihozlar Stendi (Glassware Rack) — Stolda tartiblangan yangi toza shisha idishlar */
function jihozlarStendiYasa(materiallar) {
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
  const silAsosGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.008, 6);
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

/** 3D Smart Laboratoriya Plansheti (Cyber Lab Tablet & Journal Display) */
function chizPlanshetEkrani(ctx, canvas, reaksiya = null, harorat = 25, kinetika = null) {
  const w = canvas.width;
  const h = canvas.height;

  // OLED to'q fon
  ctx.fillStyle = "#030712";
  ctx.fillRect(0, 0, w, h);

  // Kiber ramka
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, w - 12, h - 12);

  // Sarlavha
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 22px monospace";
  ctx.textAlign = "left";
  ctx.fillText("● JDA SMART LAB MONITOR", 20, 36);

  ctx.fillStyle = "#10b981";
  ctx.font = "bold 16px monospace";
  ctx.textAlign = "right";
  ctx.fillText("LIVE ANALYTICS", w - 20, 36);

  // Reaksiya tenglamasi yoki kutish holati
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(16, 50, w - 32, 90);
  ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(16, 50, w - 32, 90);

  if (reaksiya && (reaksiya.equation || reaksiya.nomi)) {
    ctx.fillStyle = "#facc15";
    ctx.font = "900 24px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(reaksiya.equation || reaksiya.nomi, w / 2, 92);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`Kinetika: ${kinetika ? kinetika.nom || "Faol" : "Tezkor"} | T = ${harorat}°C`, w / 2, 122);
  } else {
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("[KUTISH REJIMI - Idishga modda soling]", w / 2, 92);
    ctx.fillStyle = "#64748b";
    ctx.font = "14px monospace";
    ctx.fillText(`Harorat: ${harorat}°C | Vant-Goff kinetikasi faol`, w / 2, 122);
  }

  // Pastki ko'rsatma
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(16, 155, w - 32, 80);
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 155, w - 32, 80);

  ctx.fillStyle = "#10b981";
  ctx.font = "900 22px monospace";
  ctx.textAlign = "center";
  ctx.fillText("[E] BOSING: EKSPERT TAHLILI & PDF DIPLOM", w / 2, 195);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "bold 14px monospace";
  ctx.fillText("Stoximetriya, X-Ray Bog'lar va Ilmiy Xulosa", w / 2, 222);
}

function smartPlanshetYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Lab_Plansheti";
  group.position.set(1.15, 0.90, -0.28);

  const korpusMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.9 });

  // Planshet korpusi
  const korpusGeo = new THREE.BoxGeometry(0.38, 0.018, 0.28);
  const korpus = new THREE.Mesh(korpusGeo, korpusMat);
  korpus.rotation.x = Math.PI / 8;
  korpus.position.y = 0.04;
  group.add(korpus);

  // Stend oyog'i
  const stendGeo = new THREE.BoxGeometry(0.24, 0.06, 0.08);
  const stend = new THREE.Mesh(stendGeo, metallMat);
  stend.position.set(0, 0.03, -0.06);
  group.add(stend);

  // LED Ekran
  let canvas = null;
  let ctx = null;
  let texture = null;

  if (typeof document !== "undefined") {
    canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    ctx = canvas.getContext("2d");
    if (ctx) {
      chizPlanshetEkrani(ctx, canvas, null, 25, null);
      texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
    }
  }

  const ekranGeo = new THREE.PlaneGeometry(0.35, 0.24);
  const ekranMat = texture
    ? new THREE.MeshBasicMaterial({ map: texture })
    : new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const ekran = new THREE.Mesh(ekranGeo, ekranMat);
  ekran.rotation.x = -Math.PI / 2 + Math.PI / 8;
  ekran.position.set(0, 0.052, 0.005);
  group.add(ekran);

  const ekranniYangila = (reaksiya = null, harorat = 25, kinetika = null) => {
    if (ctx && canvas && texture) {
      chizPlanshetEkrani(ctx, canvas, reaksiya, harorat, kinetika);
      texture.needsUpdate = true;
    }
  };

  group.userData = {
    kalit: "lab_planshet",
    nom: "Smart Laboratoriya Daftari & Tahlil",
    tanlanadi: true,
    ekranniYangila,
  };

  return group;
}

/** Yon Ishchi Tajriba Stollari (Left & Right Workbenches) */
function yonStollarniYasa(materiallar) {
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

/** Butun 3D Laboratoriya Xonasi Interyerini yig'uvchi bosh funksiya */
export function xonaInteryeriniYasa(materiallar) {
  const roomGroup = new THREE.Group();
  roomGroup.name = "3D_Laboratoriya_Interyeri";

  // 1. To'liq 16x12m Katta Zal Devorlari va Shift LED panellari
  roomGroup.add(xonaQobiginiYasa(materiallar));

  // 2. Orqa Devordagi Keng Formatli Davriy Jadval Plakati
  roomGroup.add(davriyJadvalPlakati());

  // 3. Yon Ishchi Tajriba Stollari (Chap & O'ng)
  roomGroup.add(yonStollarniYasa(materiallar));

  // 4. Analitik Tarozi Stantsiyasi (Chap stolda)
  roomGroup.add(taroziStoliYasa(materiallar));

  // 5. Byuretka va Titrlash Stendi (O'ng stolda)
  roomGroup.add(titrlashStendiYasa(materiallar));

  // 6. Elektroliz va Tok Manbai Stendi (O'ng stolda)
  roomGroup.add(elektrolizVannasiYasa(materiallar));

  // 7. Yuvinish Rakovinasi (Chap orqa burchakda)
  roomGroup.add(rakovinaYasa(materiallar));

  // 8. Stoldagi 3D Jihozlar Stendi (Glassware Rack — Probirkalar, Kolba, Stakan, Silindr, Spatula)
  roomGroup.add(jihozlarStendiYasa(materiallar));

  // 9. Stoldagi 3D Smart Laboratoriya Plansheti (Smart Monitor & Notebook)
  roomGroup.add(smartPlanshetYasa(materiallar));

  return roomGroup;
}
