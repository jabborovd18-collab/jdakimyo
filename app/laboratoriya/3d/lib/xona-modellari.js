// app/laboratoriya/3d/lib/xona-modellari.js
//
// 4-BOSQICH: 3D Laboratoriya Xonasi Interyeri modellari
// (Fume Hood, Analitik tarozi stoli, Yuvinish rakovinasi, Devor panellari).
//
import * as THREE from "three";

/** Davriy jadval plakatini yaratish */
function davriyJadvalPlakati() {
  if (typeof document === "undefined") return new THREE.Group();
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Group();

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 512, 256);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 248);

    ctx.fillStyle = "#facc15";
    ctx.font = "bold 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("D.I. MENDELEYEV DAVRIY SISTEMASI", 256, 32);

    const colors = ["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#06b6d4"];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 16; c++) {
        ctx.fillStyle = colors[(r + c) % colors.length];
        ctx.fillRect(24 + c * 29, 48 + r * 30, 26, 26);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(1.6, 0.8);
    const mat = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 1.9, -1.25);
    return mesh;
  } catch {
    return new THREE.Group();
  }
}

/** Tortma Shkaf (Fume Hood) modeli */
function tortmaShkafYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Fume_Hood";
  group.position.set(1.05, 0.9, -0.1);

  const poLatMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.6 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  // 1. Shkaf korpusi
  const korpusGeo = new THREE.BoxGeometry(0.75, 1.1, 0.55);
  const korpus = new THREE.Mesh(korpusGeo, poLatMat);
  korpus.position.y = 0.55;
  group.add(korpus);

  // 2. Ichki ish kamerasi (bo'shliq effekti)
  const kameraGeo = new THREE.BoxGeometry(0.68, 0.7, 0.48);
  const kameraMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
  const kamera = new THREE.Mesh(kameraGeo, kameraMat);
  kamera.position.set(0, 0.45, 0.02);
  group.add(kamera);

  // 3. Shisha suriluvchi oyna (Sash)
  const oynaGeo = new THREE.BoxGeometry(0.66, 0.5, 0.015);
  const oyna = new THREE.Mesh(oynaGeo, shishaMat);
  oyna.position.set(0, 0.55, 0.25);
  group.add(oyna);

  // 4. Ventilyatsiya trubasi (Tepasida)
  const trubaGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 16);
  const truba = new THREE.Mesh(trubaGeo, poLatMat);
  truba.position.set(0, 1.35, 0);
  group.add(truba);

  // 5. Ichki yorug'lik chirog'i
  const ichkiChiroq = new THREE.PointLight(0xffffff, 0.8, 1.2);
  ichkiChiroq.position.set(0, 0.75, 0);
  group.add(ichkiChiroq);

  return group;
}

/** Analitik Tarozi Stoli modeli */
function taroziStoliYasa(materiallar) {
  const group = new THREE.Group();
  group.name = "Tarozi_Stansiyasi";
  group.position.set(-1.0, 0.9, 0.15);

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  // Tarozi poydevori
  const korpusGeo = new THREE.BoxGeometry(0.38, 0.08, 0.34);
  const korpus = new THREE.Mesh(korpusGeo, metallMat);
  korpus.position.y = 0.04;
  group.add(korpus);

  // Dumaloq metall palla (Pan)
  const pallaGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.01, 24);
  const pallaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.2 });
  const palla = new THREE.Mesh(pallaGeo, pallaMat);
  palla.position.set(0, 0.09, -0.02);
  group.add(palla);

  // Shisha shamol himoya qutisi (Glass Draft Shield)
  const qutiGeo = new THREE.BoxGeometry(0.32, 0.24, 0.28);
  const quti = new THREE.Mesh(qutiGeo, shishaMat);
  quti.position.set(0, 0.2, -0.02);
  group.add(quti);

  // Raqamli displey ekrani
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
  group.position.set(-0.95, 0.9, -0.85);

  const chinniMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1 });
  const kranMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, metalness: 0.9, roughness: 0.1 });

  // Rakovina chuqurligi
  const botiqGeo = new THREE.BoxGeometry(0.45, 0.22, 0.35);
  const botiq = new THREE.Mesh(botiqGeo, chinniMat);
  botiq.position.y = -0.1;
  group.add(botiq);

  // Xrom kran
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
  group.position.set(0.65, 0.9, 0.1);

  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const suyuqlikMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, transparent: true, opacity: 0.85 });

  // 1. Shtativ quyma temir asosi (Base)
  const asosGeo = new THREE.BoxGeometry(0.24, 0.02, 0.16);
  const asos = new THREE.Mesh(asosGeo, metallMat);
  asos.position.y = 0.01;
  group.add(asos);

  // 2. Vertikal temir sterjen (Rod)
  const sterjenGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.72, 16);
  const sterjen = new THREE.Mesh(sterjenGeo, metallMat);
  sterjen.position.set(-0.08, 0.36, 0);
  group.add(sterjen);

  // 3. Byuretka qisqichi (Burette Clamp / Lapka)
  const qisqichGeo = new THREE.BoxGeometry(0.12, 0.025, 0.02);
  const qisqich = new THREE.Mesh(qisqichGeo, metallMat);
  qisqich.position.set(-0.02, 0.45, 0);
  group.add(qisqich);

  // 4. 50 ml li Shisha Byuretka naychasi
  const byuretkaGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.52, 20);
  const byuretka = new THREE.Mesh(byuretkaGeo, shishaMat);
  byuretka.position.set(0.04, 0.42, 0);
  group.add(byuretka);

  // Byuretka ichidagi titrant suyuqligi
  const suyuqGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.38, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqlikMat);
  suyuq.position.set(0.04, 0.36, 0);
  group.add(suyuq);

  // 5. Jo'mrak (Teflon Stopcock)
  const jomrakGeo = new THREE.BoxGeometry(0.035, 0.015, 0.015);
  const jomrakMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const jomrak = new THREE.Mesh(jomrakGeo, jomrakMat);
  jomrak.position.set(0.04, 0.17, 0);
  group.add(jomrak);

  // 6. Pastdagi Erlenmeyyer konussimon kolbasi
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
  group.position.set(1.05, 0.9, -0.05);

  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });
  const elektrolitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, transparent: true, opacity: 0.85 });
  const metallMat = materiallar?.metall || new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
  const tokManbaiMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });

  // 1. Shaffof Akril Vanna (Bath)
  const vannaGeo = new THREE.BoxGeometry(0.34, 0.18, 0.22);
  const vanna = new THREE.Mesh(vannaGeo, shishaMat);
  vanna.position.set(0, 0.09, 0.05);
  group.add(vanna);

  // 2. Ichidagi ko'k elektrolit suyuqligi
  const suyuqGeo = new THREE.BoxGeometry(0.32, 0.14, 0.2);
  const suyuq = new THREE.Mesh(suyuqGeo, elektrolitMat);
  suyuq.position.set(0, 0.07, 0.05);
  group.add(suyuq);

  // 3. Katod (-) Elektrod (Chapda)
  const katodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const katod = new THREE.Mesh(katodGeo, metallMat);
  katod.position.set(-0.09, 0.1, 0.05);
  group.add(katod);

  // Katod ko'k klemmalari
  const klemmaKGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaKMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
  const klemmaK = new THREE.Mesh(klemmaKGeo, klemmaKMat);
  klemmaK.position.set(-0.09, 0.19, 0.05);
  group.add(klemmaK);

  // 4. Anod (+) Elektrod (O'ngda)
  const anodGeo = new THREE.BoxGeometry(0.012, 0.16, 0.05);
  const anod = new THREE.Mesh(anodGeo, metallMat);
  anod.position.set(0.09, 0.1, 0.05);
  group.add(anod);

  // Anod qizil klemmalari
  const klemmaAGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.02, 16);
  const klemmaAMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const klemmaA = new THREE.Mesh(klemmaAGeo, klemmaAMat);
  klemmaA.position.set(0.09, 0.19, 0.05);
  group.add(klemmaA);

  // 5. Orqadagi DC Tok Manbai Qutisi
  const blokGeo = new THREE.BoxGeometry(0.24, 0.15, 0.14);
  const blok = new THREE.Mesh(blokGeo, tokManbaiMat);
  blok.position.set(0, 0.075, -0.12);
  group.add(blok);

  // Tok manbai LED ekrani
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

  // 1. Davriy Jadval Plakati
  roomGroup.add(davriyJadvalPlakati());

  // 2. Tortma Shkaf (O'ng tomonda)
  roomGroup.add(tortmaShkafYasa(materiallar));

  // 3. Analitik Tarozi Stantsiyasi (Chap oldinda)
  roomGroup.add(taroziStoliYasa(materiallar));

  // 4. Byuretka va Titrlash Stendi (O'ng oldinda)
  roomGroup.add(titrlashStendiYasa(materiallar));

  // 5. Elektroliz va Tok Manbai Stendi (O'ng orqada)
  roomGroup.add(elektrolizVannasiYasa(materiallar));

  // 6. Yuvinish Rakovinasi (Chap orqada)
  roomGroup.add(rakovinaYasa(materiallar));

  return roomGroup;
}
