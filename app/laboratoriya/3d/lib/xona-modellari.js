// app/laboratoriya/3d/lib/xona-modellari.js
//
// 1-BOSQICH: TO'LIQ 4 DEVORLI LABORATORIYA XONASI, SHIFT VA INTERYER ME'MORCHILIGI.
// 4 ta devor, shift LED panellari, epoksi pol, derazalar, xavfsizlik dushi va Davriy Jadval.
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

    // 3D Karkas va Keng Formatli Panel (Orqa devor yuqorisiga o'rnatiladi)
    const group = new THREE.Group();
    group.name = "Davriy_Jadval_LED_Plakat";
    group.position.set(0, 2.45, -2.36); // Orqa devorda baland va keng turadi

    const karkasGeo = new THREE.BoxGeometry(3.4, 1.7, 0.03);
    const karkasMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
    const karkas = new THREE.Mesh(karkasGeo, karkasMat);
    group.add(karkas);

    const panelGeo = new THREE.PlaneGeometry(3.34, 1.64);
    const panelMat = new THREE.MeshBasicMaterial({ map: texture });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.z = 0.016;
    group.add(panel);

    return group;
  } catch {
    return new THREE.Group();
  }
}

/** 1-BOSQICH: TO'LIQ 4 DEVOR VA SHIFT ME'MORCHILIGI */
function xonaQobiginiYasa(materiallar) {
  const roomGroup = new THREE.Group();
  roomGroup.name = "4_Devorli_Xona_Qobigi";

  const devorMat = materiallar?.devor || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });
  const shiftMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const polMat = materiallar?.pol || new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.1 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.4 });
  const ramkaMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });

  const XONA_W = 8.0; // Eni
  const XONA_H = 3.6; // Balandligi
  const XONA_D = 6.8; // Uzunligi

  // 1. EPOKSI KIMYOVIY POL (Y = 0)
  const polGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const pol = new THREE.Mesh(polGeo, polMat);
  pol.rotation.x = -Math.PI / 2;
  pol.position.set(0, 0, 0.9);
  pol.receiveShadow = true;
  roomGroup.add(pol);

  // 2. SHIFT VA LED LYUMINESSENT PANELLARI (Y = 3.6)
  const shiftGeo = new THREE.PlaneGeometry(XONA_W, XONA_D);
  const shift = new THREE.Mesh(shiftGeo, shiftMat);
  shift.rotation.x = Math.PI / 2;
  shift.position.set(0, XONA_H, 0.9);
  roomGroup.add(shift);

  // 6 ta Shift LED panel chiroqlari (Recessed Troffers)
  const trofferGeo = new THREE.PlaneGeometry(1.2, 0.6);
  const trofferMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
  const trofferYlar = [
    [-2.0, 0.0], [0.0, 0.0], [2.0, 0.0],
    [-2.0, 2.2], [0.0, 2.2], [2.0, 2.2],
  ];
  trofferYlar.forEach(([x, z]) => {
    const lamp = new THREE.Mesh(trofferGeo, trofferMat);
    lamp.rotation.x = Math.PI / 2;
    lamp.position.set(x, XONA_H - 0.01, z);
    roomGroup.add(lamp);
  });

  // 3. CHAP DEVOR VA LABORATORIYA DERAZALARI (X = -4.0)
  const devorChapGeo = new THREE.PlaneGeometry(XONA_D, XONA_H);
  const devorChap = new THREE.Mesh(devorChapGeo, devorMat);
  devorChap.rotation.y = Math.PI / 2;
  devorChap.position.set(-XONA_W / 2, XONA_H / 2, 0.9);
  devorChap.receiveShadow = true;
  roomGroup.add(devorChap);

  // Deraza ramkasi va shishalari (Chap devorda)
  const derazaGeo = new THREE.PlaneGeometry(3.2, 1.8);
  const deraza = new THREE.Mesh(derazaGeo, shishaMat);
  deraza.rotation.y = Math.PI / 2;
  deraza.position.set(-XONA_W / 2 + 0.02, 2.2, 0.9);
  roomGroup.add(deraza);

  // Deraza orqasidagi bog'/kunduzgi yorug'lik nuri
  const daylight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
  daylight.position.set(-6.0, 4.0, 1.0);
  daylight.target.position.set(0, 1.0, 0);
  roomGroup.add(daylight);

  // 4. O'NG DEVOR (X = 4.0)
  const devorOngGeo = new THREE.PlaneGeometry(XONA_D, XONA_H);
  const devorOng = new THREE.Mesh(devorOngGeo, devorMat);
  devorOng.rotation.y = -Math.PI / 2;
  devorOng.position.set(XONA_W / 2, XONA_H / 2, 0.9);
  devorOng.receiveShadow = true;
  roomGroup.add(devorOng);

  // 5. OLD DEVOR VA ESHIKLAR (Z = 4.3)
  const devorOldGeo = new THREE.PlaneGeometry(XONA_W, XONA_H);
  const devorOld = new THREE.Mesh(devorOldGeo, devorMat);
  devorOld.rotation.y = Math.PI;
  devorOld.position.set(0, XONA_H / 2, 4.3);
  devorOld.receiveShadow = true;
  roomGroup.add(devorOld);

  // Laboratoriya kirish eshigi
  const eshikGeo = new THREE.BoxGeometry(1.6, 2.3, 0.04);
  const eshik = new THREE.Mesh(eshikGeo, ramkaMat);
  eshik.position.set(0, 1.15, 4.28);
  roomGroup.add(eshik);

  // Yashil "CHIQISH / EXIT" LED nuri
  const exitGeo = new THREE.BoxGeometry(0.4, 0.12, 0.02);
  const exitMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const exitSign = new THREE.Mesh(exitGeo, exitMat);
  exitSign.position.set(0, 2.45, 4.27);
  roomGroup.add(exitSign);

  // 6. Xavfsizlik Dushi va Ko'z Yuvish (O'ng devorda)
  const dushGroup = new THREE.Group();
  dushGroup.position.set(3.85, 0.9, 2.5);

  const trubaGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.8, 16);
  const truba = new THREE.Mesh(trubaGeo, ramkaMat);
  truba.position.y = 0.9;
  dushGroup.add(truba);

  const boshGeo = new THREE.ConeGeometry(0.08, 0.06, 16);
  const bosh = new THREE.Mesh(boshGeo, new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 }));
  bosh.position.set(-0.15, 1.7, 0);
  dushGroup.add(bosh);

  roomGroup.add(dushGroup);

  return roomGroup;
}

/** Tortma Shkaf (Fume Hood) modeli */
function tortmaShkafYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Fume_Hood";
  group.position.set(2.4, 0.9, -1.8); // O'ng orqa tomonga siljitildi

  const poLatMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const korpusGeo = new THREE.BoxGeometry(0.85, 1.15, 0.6);
  const korpus = new THREE.Mesh(korpusGeo, poLatMat);
  korpus.position.y = 0.575;
  group.add(korpus);

  const kameraGeo = new THREE.BoxGeometry(0.78, 0.75, 0.52);
  const kameraMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const kamera = new THREE.Mesh(kameraGeo, kameraMat);
  kamera.position.set(0, 0.48, 0.02);
  group.add(kamera);

  const oynaGeo = new THREE.BoxGeometry(0.76, 0.55, 0.015);
  const oyna = new THREE.Mesh(oynaGeo, shishaMat);
  oyna.position.set(0, 0.58, 0.28);
  group.add(oyna);

  const trubaGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.5, 16);
  const truba = new THREE.Mesh(trubaGeo, poLatMat);
  truba.position.set(0, 1.4, 0);
  group.add(truba);

  const ichkiChiroq = new THREE.PointLight(0xffffff, 0.9, 1.5);
  ichkiChiroq.position.set(0, 0.8, 0);
  group.add(ichkiChiroq);

  return group;
}

/** Analitik Tarozi Stoli modeli */
function taroziStoliYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Tarozi_Stansiyasi";
  group.position.set(-1.6, 0.9, 0.2); // Chap stolda

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  const korpusGeo = new THREE.BoxGeometry(0.38, 0.08, 0.34);
  const korpus = new THREE.Mesh(korpusGeo, metallMat);
  korpus.position.y = 0.04;
  group.add(korpus);

  const pallaGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24);
  const pallaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const palla = new THREE.Mesh(pallaGeo, pallaMat);
  palla.position.set(0, 0.09, -0.02);
  group.add(palla);

  const qutiGeo = new THREE.BoxGeometry(0.32, 0.24, 0.28);
  const quti = new THREE.Mesh(qutiGeo, shishaMat);
  quti.position.set(0, 0.2, -0.02);
  group.add(quti);

  const ekranGeo = new THREE.BoxGeometry(0.14, 0.03, 0.01);
  const ekranMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const ekran = new THREE.Mesh(ekranGeo, ekranMat);
  ekran.position.set(0, 0.05, 0.165);
  group.add(ekran);

  return group;
}

/** Yuvinish Rakovinasi va Kran modeli */
function rakovinaYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Yuvinish_Rakovinasi";
  group.position.set(-2.4, 0.9, -1.8); // Chap orqa tomonda

  const chinniMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 });
  const kranMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.1 });

  const botiqGeo = new THREE.BoxGeometry(0.5, 0.24, 0.38);
  const botiq = new THREE.Mesh(botiqGeo, chinniMat);
  botiq.position.y = -0.1;
  group.add(botiq);

  const kranAsosGeo = new THREE.CylinderGeometry(0.015, 0.018, 0.16, 16);
  const kranAsos = new THREE.Mesh(kranAsosGeo, kranMat);
  kranAsos.position.set(0, 0.08, -0.14);
  group.add(kranAsos);

  const kranTrubaGeo = new THREE.TorusGeometry(0.06, 0.012, 12, 16, Math.PI);
  const kranTruba = new THREE.Mesh(kranTrubaGeo, kranMat);
  kranTruba.rotation.y = Math.PI / 2;
  kranTruba.position.set(0, 0.16, -0.08);
  group.add(kranTruba);

  return group;
}

/** Volumetrik Titrlash va Byuretka Stendi modeli */
function titrlashStendiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Titrlash_Byuretka_Stansiyasi";
  group.position.set(1.4, 0.9, 0.2); // O'ng stolda

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

  return group;
}

/** 3D Elektroliz Vannasi va Tok Manbai modeli */
function elektrolizVannasiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Elektroliz_Stansiyasi";
  group.position.set(1.4, 0.9, -0.6); // O'ng stolda

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

  return group;
}

/** Butun 3D Laboratoriya Xonasi Interyerini yig'uvchi bosh funksiya */
export function xonaInteryeriniYasa(materiallar) {
  const roomGroup = new THREE.Group();
  roomGroup.name = "3D_Laboratoriya_Interyeri";

  // 1. To'liq 4 devor, shift LED panellari va epoksi pol
  roomGroup.add(xonaQobiginiYasa(materiallar));

  // 2. Keng Formatli Davriy Jadval Plakati
  roomGroup.add(davriyJadvalPlakati());

  // 3. Tortma Shkaf (O'ng orqada)
  roomGroup.add(tortmaShkafYasa(materiallar));

  // 4. Analitik Tarozi Stantsiyasi (Chap stolda)
  roomGroup.add(taroziStoliYasa(materiallar));

  // 5. Byuretka va Titrlash Stendi (O'ng stolda)
  roomGroup.add(titrlashStendiYasa(materiallar));

  // 6. Elektroliz va Tok Manbai Stendi (O'ng stolda)
  roomGroup.add(elektrolizVannasiYasa(materiallar));

  // 7. Yuvinish Rakovinasi (Chap orqada)
  roomGroup.add(rakovinaYasa(materiallar));

  return roomGroup;
}
