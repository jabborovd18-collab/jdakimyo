// app/laboratoriya/3d/lib/xona/panellar.js
//
// Ekranli panellar: davriy jadval plakati va smart planshet.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { XONA } from "../sozlama.js";


/** Davriy jadval plakatini yaratish — 2048x1024 Yuqori aniqlikdagi keng formatli LED plakat */
export function davriyJadvalPlakati() {
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
    // Orqa devorga yopishadi: qattiq son yozilsa xona kattalashganda
    // plakat havoda qolardi (BRIF-04 "DIQQAT" ro'yxati).
    group.position.set(0, 2.65, -XONA.boyi / 2 + XONA.markazZ + 0.05);

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


/** 3D Smart Laboratoriya Plansheti (Cyber Lab Tablet & Journal Display) */
export function chizPlanshetEkrani(ctx, canvas, reaksiya = null, harorat = 25, kinetika = null) {
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


export function smartPlanshetYasa(materiallar) {
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
