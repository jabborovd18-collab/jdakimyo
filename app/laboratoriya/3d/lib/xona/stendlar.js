// app/laboratoriya/3d/lib/xona/stendlar.js
//
// O'lchov va tajriba stendlari: tarozi, titrlash byuretkasi, elektroliz.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";


/** Analitik Tarozi 2D Canvas LED Displeyi chizgichi */
export function chizTaroziEkrani(ctx, canvas, massa = 0, tara = 0, idishNomi = "", barqaror = true) {
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
export function taroziStoliYasa(materiallar) {
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


/** Volumetrik Titrlash va Byuretka Stendi modeli */
export function titrlashStendiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Titrlash_Byuretka_Stansiyasi";
  group.position.set(3.2, 0.9, 0.4); // O'ng stolda

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const suyuqlikMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.85 });
  const kolbaSuyuqMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.15, transparent: true, opacity: 0.75 });

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

  // Byuretka shisha silindri (50ml)
  const byuretkaGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.52, 20);
  const byuretka = new THREE.Mesh(byuretkaGeo, shishaMat);
  byuretka.position.set(0.04, 0.42, 0);
  group.add(byuretka);

  // Byuretka ichidagi titrant suyuqligi
  const suyuqGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.38, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqlikMat);
  suyuq.position.set(0.04, 0.36, 0);
  group.add(suyuq);

  // Byuretka jo'mrak krani (Stopcock)
  const jomrakGeo = new THREE.BoxGeometry(0.035, 0.015, 0.015);
  const jomrakMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
  const jomrak = new THREE.Mesh(jomrakGeo, jomrakMat);
  jomrak.position.set(0.04, 0.17, 0);
  jomrak.userData = { kalit: "titrlash_kran", nom: "Byuretka Krani", tanlanadi: true };
  group.add(jomrak);

  // Tagidagi Erlenmeyer kolbasi
  const kolbaGeo = new THREE.ConeGeometry(0.055, 0.1, 24);
  const kolba = new THREE.Mesh(kolbaGeo, shishaMat);
  kolba.position.set(0.04, 0.05, 0);
  group.add(kolba);

  const kolbaSuyuqGeo = new THREE.ConeGeometry(0.05, 0.06, 20);
  const kolbaSuyuq = new THREE.Mesh(kolbaSuyuqGeo, kolbaSuyuqMat);
  kolbaSuyuq.position.set(0.04, 0.032, 0);
  group.add(kolbaSuyuq);

  // Tomchilar oqimi
  const tomchiGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.06, 8);
  const tomchiMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 });
  const tomchilar = new THREE.Mesh(tomchiGeo, tomchiMat);
  tomchilar.position.set(0.04, 0.12, 0);
  tomchilar.visible = false;
  group.add(tomchilar);

  const stendniYangila = (vTitrant = 0, rangHex = 0xffffff, tomchilamoqda = false) => {
    const r = Math.max(0.05, (50 - vTitrant) / 50);
    suyuq.scale.y = r;
    suyuq.position.y = 0.17 + (0.38 * r) / 2;

    kolbaSuyuqMat.color.setHex(rangHex);
    tomchilar.visible = tomchilamoqda;
    jomrak.rotation.z = tomchilamoqda ? Math.PI / 2 : 0;
  };

  group.userData = {
    kalit: "titrlash",
    nom: "50ml Volumetrik Titrlash Stendi",
    tanlanadi: true,
    jomrakMesh: jomrak,
    stendniYangila,
    tomchilamoqda: false,
    vTitrant: 0,
  };

  return group;
}


/** 3D Elektroliz Vannasi va Tok Manbai modeli */
export function elektrolizVannasiYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Elektroliz_Stansiyasi";
  group.position.set(3.2, 0.9, -0.6); // O'ng stolda

  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const elektrolitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85 });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
  const tokManbaiMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });

  // 1. Shisha vanna
  const vannaGeo = new THREE.BoxGeometry(0.34, 0.18, 0.22);
  const vanna = new THREE.Mesh(vannaGeo, shishaMat);
  vanna.position.set(0, 0.09, 0.05);
  group.add(vanna);

  // 2. Elektrolit suyuqligi
  const suyuqGeo = new THREE.BoxGeometry(0.32, 0.14, 0.2);
  const suyuq = new THREE.Mesh(suyuqGeo, elektrolitMat);
  suyuq.position.set(0, 0.07, 0.05);
  group.add(suyuq);

  // 3. Katod va Anod elektrodlari
  const katodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const katodMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });
  const katod = new THREE.Mesh(katodGeo, katodMat);
  katod.position.set(-0.09, 0.1, 0.05);
  group.add(katod);

  const klemmaKGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaKMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
  const klemmaK = new THREE.Mesh(klemmaKGeo, klemmaKMat);
  klemmaK.position.set(-0.09, 0.19, 0.05);
  group.add(klemmaK);

  const anodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const anodMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
  const anod = new THREE.Mesh(anodGeo, anodMat);
  anod.position.set(0.09, 0.1, 0.05);
  group.add(anod);

  const klemmaAGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaAMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
  const klemmaA = new THREE.Mesh(klemmaAGeo, klemmaAMat);
  klemmaA.position.set(0.09, 0.19, 0.05);
  group.add(klemmaA);

  // 4. DC Tok Manbai bloki
  const blokGeo = new THREE.BoxGeometry(0.24, 0.15, 0.14);
  const blok = new THREE.Mesh(blokGeo, tokManbaiMat);
  blok.position.set(0, 0.075, -0.12);
  group.add(blok);

  const ledGeo = new THREE.BoxGeometry(0.04, 0.04, 0.005);
  // Chinakam nur chiqaruvchi indikator: Basic bu yerda ataylab qoladi.
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(-0.06, 0.1, -0.048);
  group.add(led);

  // Tok kuchlanish regulyatori (Knob)
  const knobGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.015, 16);
  const knobMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.5 });
  const knob = new THREE.Mesh(knobGeo, knobMat);
  knob.rotation.x = Math.PI / 2;
  knob.position.set(0.05, 0.1, -0.045);
  knob.userData = { kalit: "elektroliz_tok", nom: "DC Tok Manbai Regulyatori", tanlanadi: true };
  group.add(knob);

  // 5. Gaz Pufakchalari (Points)
  const zarrachaSoni = 20;
  const kPoz = new Float32Array(zarrachaSoni * 3);
  const aPoz = new Float32Array(zarrachaSoni * 3);
  for (let i = 0; i < zarrachaSoni; i++) {
    kPoz[i * 3] = -0.09 + (Math.random() - 0.5) * 0.02;
    kPoz[i * 3 + 1] = 0.02 + Math.random() * 0.12;
    kPoz[i * 3 + 2] = 0.05 + (Math.random() - 0.5) * 0.03;

    aPoz[i * 3] = 0.09 + (Math.random() - 0.5) * 0.02;
    aPoz[i * 3 + 1] = 0.02 + Math.random() * 0.12;
    aPoz[i * 3 + 2] = 0.05 + (Math.random() - 0.5) * 0.03;
  }

  const kGeo = new THREE.BufferGeometry();
  kGeo.setAttribute("position", new THREE.BufferAttribute(kPoz, 3));
  const pufakMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.008, transparent: true, opacity: 0.85 });
  const katodPufaklar = new THREE.Points(kGeo, pufakMat);
  katodPufaklar.visible = false;
  group.add(katodPufaklar);

  const aGeo = new THREE.BufferGeometry();
  aGeo.setAttribute("position", new THREE.BufferAttribute(aPoz, 3));
  const anodPufaklar = new THREE.Points(aGeo, pufakMat);
  anodPufaklar.visible = false;
  group.add(anodPufaklar);

  const stendniYangila = (tokAmper = 0, misQoplanishi = false, faol = false) => {
    ledMat.color.setHex(faol ? 0x10b981 : 0x475569);
    katodPufaklar.visible = faol && tokAmper > 0;
    anodPufaklar.visible = faol && tokAmper > 0;

    if (misQoplanishi) {
      katodMat.color.setHex(0xb45309); // Qizil-jigarrang mis qoplamasi
    } else {
      katodMat.color.setHex(0x475569);
    }
  };

  group.userData = {
    kalit: "elektroliz",
    nom: "Elektroliz va Tok Manbai Stendi",
    tanlanadi: true,
    knobMesh: knob,
    stendniYangila,
    faol: false,
    tokAmper: 2.0,
  };

  return group;
}
