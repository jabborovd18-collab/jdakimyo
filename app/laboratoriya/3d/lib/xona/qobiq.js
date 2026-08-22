// app/laboratoriya/3d/lib/xona/qobiq.js
//
// Xona qobig'i: pol, ship, devorlar, derazalar, eshik, EXIT belgisi,
// iqlim stansiyasi va xavfsizlik jihozlari.
//
// BRIF-05: `xona-modellari.js` (1707 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { XONA } from "../sozlama.js";
import { SHIP_PANEL_JOYLARI } from "../yoruglik.js";
import { soyaTashlasin } from "./yordamchi.js";


/** 16x12m KATTA UNIVERSITET LABORATORIYA ZALI ME'MORCHILIGI */
// Devor qalinligi. Ilgari devor qalinliksiz `PlaneGeometry` edi va
// deraza uning oldiga 2 sm da yopishtirilgan shisha to'rtburchak edi —
// ya'ni teshik yo'q, ortida ko'radigan narsa yo'q, ram va tokcha yo'q
// (BRIF-04, 3-muammo).
export const DEVOR_QALINLIGI = 0.25;


/**
 * Deraza o'lchamlari xona o'lchamidan hisoblanadi.
 *
 * Soni ham hisoblanadi: uzunroq devorga ko'proq deraza tushadi.
 * Tubi 1.1 m — ish stoli balandligidan yuqori, ya'ni tokcha ostiga
 * jihoz sig'adi. Tepasi shipdan 0.7 m pastda.
 */
export function derazaOlchami(boyi, balandligi) {
  const soni = Math.max(3, Math.round(boyi / 3));
  const oraliq = boyi / soni;
  return {
    soni,
    oraliq,
    eni: Math.min(2.4, oraliq - 1.0),
    tubi: 1.1,
    tepasi: balandligi - 0.7,
  };
}


/**
 * Chap devor — deraza TESHIKLARI bilan.
 *
 * `ExtrudeGeometry` + `Shape.holes` bitta ish bilan uchta narsani
 * beradi: haqiqiy teshik, devor qalinligi va teshik yon yuzalari
 * (chuqurlik/reveal). Ular bo'lmasa deraza tekis oq to'rtburchak
 * bo'lib ko'rinardi.
 *
 * UV lar QO'LDA qayta hisoblanadi: `ExtrudeGeometry` UV ni vertex
 * koordinatasidan oladi, devor teksturasi esa `repeat(6, 4)` bilan
 * 0..1 UV kutadi. Qayta hisoblamasa tekstura metrga 6 marta
 * takrorlanib, devor shovqinga aylanardi.
 */
export function chapDevorniYasa(eni, balandligi, ichkiX, markazZ, devorMat) {
  const yarim = eni / 2;
  const shakl = new THREE.Shape();
  shakl.moveTo(-yarim, 0);
  shakl.lineTo(yarim, 0);
  shakl.lineTo(yarim, balandligi);
  shakl.lineTo(-yarim, balandligi);
  shakl.lineTo(-yarim, 0);

  const d = derazaOlchami(eni, balandligi);
  const teshikMarkazlari = [];
  for (let i = 0; i < d.soni; i += 1) {
    const siljish = (i + 0.5 - d.soni / 2) * d.oraliq;
    teshikMarkazlari.push(siljish);
    const teshik = new THREE.Path();
    const x1 = siljish - d.eni / 2;
    const x2 = siljish + d.eni / 2;
    teshik.moveTo(x1, d.tubi);
    teshik.lineTo(x2, d.tubi);
    teshik.lineTo(x2, d.tepasi);
    teshik.lineTo(x1, d.tepasi);
    teshik.lineTo(x1, d.tubi);
    shakl.holes.push(teshik);
  }

  const geo = new THREE.ExtrudeGeometry(shakl, {
    depth: DEVOR_QALINLIGI,
    bevelEnabled: false,
  });

  const joy = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < joy.count; i += 1) {
    uv.setXY(i, (joy.getX(i) + yarim) / eni, joy.getY(i) / balandligi);
  }
  uv.needsUpdate = true;

  const devor = new THREE.Mesh(geo, devorMat);
  // Y bo'yicha +90 gradus: lokal (x, y, z) -> dunyo (z, y, -x).
  // Ya'ni ekstruziya yo'nalishi dunyo +X ga, shakl kengligi esa -Z ga
  // o'tadi. Devor xonadan TASHQARIGA qalinlashsin uchun boshlanishi
  // ichki yuzadan bir qalinlik chapda turadi.
  devor.rotation.y = Math.PI / 2;
  devor.position.set(ichkiX - DEVOR_QALINLIGI, 0, markazZ);
  devor.receiveShadow = true;
  return { devor, olcham: d, markazlar: teshikMarkazlari };
}


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

  const dz = chap.olcham;
  const derazaBalandlik = dz.tepasi - dz.tubi;
  const derazaMarkazY = (dz.tepasi + dz.tubi) / 2;
  const devorX = -XONA_W / 2 - DEVOR_QALINLIGI / 2;

  // Ram, tokcha va shisha har teshik uchun. Geometriyalar bir marta
  // yasaladi va hamma derazaga ulashiladi — BRIF-07 birlashtiruvchisi
  // ularni material bo'yicha yig'adi.
  const shishaGeo = new THREE.BoxGeometry(0.018, derazaBalandlik, dz.eni);
  const ramGorizontalGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI, 0.06, dz.eni + 0.12);
  const ramVertikalGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI, derazaBalandlik + 0.12, 0.06);
  const orqaUstunGeo = new THREE.BoxGeometry(0.05, derazaBalandlik, 0.05);
  const tokchaGeo = new THREE.BoxGeometry(DEVOR_QALINLIGI + 0.12, 0.04, dz.eni + 0.22);

  for (const siljish of chap.markazlar) {
    // Devor lokal X dunyo -Z ga o'tadi (yuqoridagi burilish).
    const z = MZ - siljish;

    const shisha = new THREE.Mesh(shishaGeo, shishaMat);
    shisha.position.set(devorX, derazaMarkazY, z);
    roomGroup.add(shisha);

    const ramTepa = new THREE.Mesh(ramGorizontalGeo, ramkaMat);
    ramTepa.position.set(devorX, dz.tepasi + 0.03, z);
    roomGroup.add(ramTepa);

    const ramTub = new THREE.Mesh(ramGorizontalGeo, ramkaMat);
    ramTub.position.set(devorX, dz.tubi - 0.03, z);
    roomGroup.add(ramTub);

    for (const yon of [-1, 1]) {
      const ramYon = new THREE.Mesh(ramVertikalGeo, ramkaMat);
      ramYon.position.set(devorX, derazaMarkazY, z + yon * (dz.eni / 2 + 0.03));
      roomGroup.add(ramYon);
    }

    // O'rta ustun — derazani ikkiga bo'ladi. Usiz 2.4 m keng oyna
    // vitrinaga o'xshaydi, laboratoriya derazasiga emas.
    const ustun = new THREE.Mesh(orqaUstunGeo, ramkaMat);
    ustun.position.set(devorX, derazaMarkazY, z);
    roomGroup.add(ustun);

    // Tokcha — xona ichiga chiqadi va soya beradi, ya'ni deraza
    // devorga chizilgan emas, devorga O'RNATILGAN bo'lib ko'rinadi.
    const tokcha = new THREE.Mesh(tokchaGeo, devorMat);
    tokcha.position.set(devorX + 0.06, dz.tubi - 0.02, z);
    roomGroup.add(tokcha);
  }

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
      exitSignMesh.position.set(0, 2.85, XONA_D / 2 + MZ - 0.04);
      roomGroup.add(exitSignMesh);
    }
  }

  // Eshik yonidagi Raqamli Xona Iqlim va Havfsizlik Stansiyasi (Room Climate & Safety Monitor)
  let clCanvas = null;
  let clCtx = null;
  let clTexture = null;

  const chizIqlimEkrani = (harorat = 22.4, tutunBormi = false, ventilyatsiyaFaol = false) => {
    if (!clCtx || !clCanvas) return;
    clCtx.fillStyle = "#030712";
    clCtx.fillRect(0, 0, 512, 256);

    clCtx.strokeStyle = tutunBormi ? "#ef4444" : "#38bdf8";
    clCtx.lineWidth = 4;
    clCtx.strokeRect(6, 6, 500, 244);

    clCtx.fillStyle = tutunBormi ? "#ef4444" : "#38bdf8";
    clCtx.font = "bold 22px monospace";
    clCtx.textAlign = "left";
    clCtx.fillText("● JDA-LAB CLIMATE & SAFETY", 20, 36);

    clCtx.fillStyle = tutunBormi ? "#f59e0b" : "#64748b";
    clCtx.font = "bold 16px monospace";
    clCtx.textAlign = "right";
    clCtx.fillText(tutunBormi ? "HAZARD ALERT" : "ONLINE", 492, 36);

    // Harorat
    clCtx.fillStyle = tutunBormi ? "#f59e0b" : "#10b981";
    clCtx.font = "900 48px monospace";
    clCtx.textAlign = "left";
    clCtx.fillText(`${harorat.toFixed(1)}°C`, 20, 100);

    clCtx.fillStyle = "#94a3b8";
    clCtx.font = "bold 18px monospace";
    clCtx.fillText("Namlik: 48% RH", 240, 75);
    clCtx.fillText("Bosim: 758 mmHg", 240, 102);

    // Havo sifati & O2
    clCtx.fillStyle = "#0f172a";
    clCtx.fillRect(16, 125, 480, 105);
    clCtx.strokeStyle = tutunBormi ? "rgba(239, 68, 68, 0.4)" : "rgba(56, 189, 248, 0.25)";
    clCtx.strokeRect(16, 125, 480, 105);

    if (tutunBormi) {
      clCtx.fillStyle = "#ef4444";
      clCtx.font = "bold 20px monospace";
      clCtx.fillText("Havo: ⚠️ TUTUN VA GAZ ANIKLANDI!", 30, 160);
      clCtx.fillStyle = "#f59e0b";
      clCtx.fillText("Ventilyatsiya: MAKSIMAL (100% SO'RISH)", 30, 195);
      clCtx.fillText("Tavsiya: Dush & Gaz niqobidan foydalaning", 30, 222);
    } else {
      clCtx.fillStyle = "#34d399";
      clCtx.font = "bold 20px monospace";
      clCtx.fillText("Havo sifati: ● XAVFSIZ (0.00 ppm)", 30, 160);
      clCtx.fillStyle = "#38bdf8";
      clCtx.fillText("O₂ darajasi: 20.9% (Optimal)", 30, 195);
      clCtx.fillText("Ventilyatsiya: ME'YORDA (Avtomatik)", 30, 222);
    }
  };

  if (typeof document !== "undefined") {
    clCanvas = document.createElement("canvas");
    clCanvas.width = 512;
    clCanvas.height = 256;
    clCtx = clCanvas.getContext("2d");
    if (clCtx) {
      chizIqlimEkrani(22.4, false, false);
      clTexture = new THREE.CanvasTexture(clCanvas);
    }
  }

  const climateMeshGeo = new THREE.PlaneGeometry(0.85, 0.44);
  const climateMeshMat = clTexture
    ? new THREE.MeshBasicMaterial({ map: clTexture })
    : new THREE.MeshBasicMaterial({ color: 0x030712 });
  const climateMesh = new THREE.Mesh(climateMeshGeo, climateMeshMat);
  climateMesh.name = "Xona_Iqlim_Stansiyasi";
  climateMesh.rotation.y = Math.PI;
  climateMesh.position.set(1.8, 1.65, XONA_D / 2 + MZ - 0.04);

  climateMesh.userData = {
    kalit: "xona_iqlimi",
    nom: "Xona Iqlim va Havfsizlik Ko'rsatkichi",
    tanlanadi: true,
    iqlimniYangila: (harorat = 22.4, tutunBormi = false, ventilyatsiyaFaol = false) => {
      if (clCtx && clCanvas && clTexture) {
        chizIqlimEkrani(harorat, tutunBormi, ventilyatsiyaFaol);
        clTexture.needsUpdate = true;
      }
    },
  };
  roomGroup.add(climateMesh);

  // 7. Xavfsizlik Dushi va Ko'z Yuvish Stansiyasi (O'ng devorda)
  const dushGroup = new THREE.Group();
  dushGroup.name = "Xavfsizlik_Dushi_Stansiyasi";
  dushGroup.position.set(XONA_W / 2 - 0.15, 0, MZ + 3.1);

  const suvMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
  const sariqMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 });

  // Vertikal po'lat truba
  const trubaGeo = new THREE.CylinderGeometry(0.025, 0.025, 2.8, 16);
  const truba = new THREE.Mesh(trubaGeo, ramkaMat);
  truba.position.y = 1.4;
  dushGroup.add(truba);

  // Dush kallagi
  const boshGeo = new THREE.ConeGeometry(0.18, 0.12, 20);
  const bosh = new THREE.Mesh(boshGeo, sariqMat);
  bosh.position.set(-0.35, 2.7, 0);
  dushGroup.add(bosh);

  // Tortish zanjiri va halqasi (Pull ring)
  const zanjirGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.6, 8);
  const zanjir = new THREE.Mesh(zanjirGeo, ramkaMat);
  zanjir.position.set(-0.35, 2.3, 0);
  dushGroup.add(zanjir);

  const halqaGeo = new THREE.TorusGeometry(0.04, 0.008, 8, 16);
  const halqa = new THREE.Mesh(halqaGeo, sariqMat);
  halqa.position.set(-0.35, 2.0, 0);
  halqa.userData = { kalit: "xavfsizlik_dushi", nom: "Favqulodda Xavfsizlik Dushi Zanjiri", tanlanadi: true };
  dushGroup.add(halqa);

  // Dush suv kaskadi (Shower Cascade mesh)
  const dushSuvGeo = new THREE.CylinderGeometry(0.35, 0.55, 2.4, 20, 1, true);
  const dushSuvMesh = new THREE.Mesh(dushSuvGeo, suvMat);
  dushSuvMesh.position.set(-0.35, 1.4, 0);
  dushSuvMesh.visible = false;
  dushGroup.add(dushSuvMesh);

  // Ko'z yuvish vannasi (Eyewash basin)
  const vannaGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.1, 20);
  const vanna = new THREE.Mesh(vannaGeo, sariqMat);
  vanna.position.set(-0.35, 1.05, 0);
  vanna.userData = { kalit: "koz_yuvish", nom: "Ko'z Yuvish Favvorasi", tanlanadi: true };
  dushGroup.add(vanna);

  const favvoraGeo = new THREE.CylinderGeometry(0.01, 0.015, 0.18, 12);
  const favvoraMesh = new THREE.Mesh(favvoraGeo, suvMat);
  favvoraMesh.position.set(-0.35, 1.15, 0);
  favvoraMesh.visible = false;
  dushGroup.add(favvoraMesh);

  const dushniYangila = (faol = false) => {
    dushSuvMesh.visible = faol;
  };

  const kozYuvishniYangila = (faol = false) => {
    favvoraMesh.visible = faol;
  };

  dushGroup.userData = {
    kalit: "xavfsizlik_dushi",
    nom: "Xavfsizlik Dushi va Ko'z Yuvish Stansiyasi",
    tanlanadi: true,
    dushniYangila,
    kozYuvishniYangila,
    dushFaol: false,
    kozFaol: false,
  };
  roomGroup.add(soyaTashlasin(dushGroup, profil));

  // 8. Eshik Yonidagi Devor Xavfsizlik Shkafi (Ko'zoynak va Gaz Niqobi)
  const xavfShkafGroup = new THREE.Group();
  xavfShkafGroup.name = "Xavfsizlik_Shkafi";
  xavfShkafGroup.position.set(-1.8, 1.65, XONA_D / 2 + MZ - 0.05);
  xavfShkafGroup.rotation.y = Math.PI;

  const shkafKarkasGeo = new THREE.BoxGeometry(0.65, 0.75, 0.18);
  const shkafKarkasMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.3 }); // Emerald Green HazMat
  const shkafKarkas = new THREE.Mesh(shkafKarkasGeo, shkafKarkasMat);
  xavfShkafGroup.add(shkafKarkas);

  const oynaQopqoqGeo = new THREE.BoxGeometry(0.60, 0.70, 0.01);
  const oynaQopqoq = new THREE.Mesh(oynaQopqoqGeo, shishaMat);
  oynaQopqoq.position.z = 0.09;
  xavfShkafGroup.add(oynaQopqoq);

  // Himoya Ko'zoynagi modeli
  const kozoynakGroup = new THREE.Group();
  kozoynakGroup.name = "Himoya_Kozoynagi";
  kozoynakGroup.position.set(0, 0.15, 0.02);

  const linzaGeo = new THREE.BoxGeometry(0.24, 0.08, 0.04);
  const linzaMat = new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6, roughness: 0.1 });
  const linza = new THREE.Mesh(linzaGeo, linzaMat);
  kozoynakGroup.add(linza);

  const tasmarGeo = new THREE.TorusGeometry(0.12, 0.008, 8, 16);
  const tasma = new THREE.Mesh(tasmarGeo, new THREE.MeshStandardMaterial({ color: 0x0f172a }));
  tasma.rotation.x = Math.PI / 2;
  kozoynakGroup.add(tasma);

  kozoynakGroup.userData = { kalit: "himoya_kozoynagi", nom: "Kimyoviy Himoya Ko'zoynagi", tanlanadi: true };
  xavfShkafGroup.add(kozoynakGroup);

  // Gaz Niqobi / Respirator modeli
  const niqobGroup = new THREE.Group();
  niqobGroup.name = "Gaz_Niqobi";
  niqobGroup.position.set(0, -0.15, 0.02);

  const korpusNGeo = new THREE.ConeGeometry(0.09, 0.14, 16);
  const korpusNMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const korpusN = new THREE.Mesh(korpusNGeo, korpusNMat);
  korpusN.rotation.x = -Math.PI / 2;
  niqobGroup.add(korpusN);

  const filtrGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.04, 16);
  const filtrMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8 });
  const filtr = new THREE.Mesh(filtrGeo, filtrMat);
  filtr.rotation.x = Math.PI / 2;
  filtr.position.set(0, 0, 0.08);
  niqobGroup.add(filtr);

  niqobGroup.userData = { kalit: "gaz_niqobi", nom: "Kimyoviy Gaz Niqobi / Respirator", tanlanadi: true };
  xavfShkafGroup.add(niqobGroup);

  roomGroup.add(soyaTashlasin(xavfShkafGroup, profil));

  return roomGroup;
}
