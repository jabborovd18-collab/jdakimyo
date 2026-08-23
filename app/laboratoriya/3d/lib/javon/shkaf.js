// app/laboratoriya/3d/lib/javon/shkaf.js
//
// Shkaf karkaslari: pastki ish yuzasi va devor javoni.
//
// BRIF-05: `javon-3d.js` (868 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";
import { kristallPanjaraYasa, tokchaToldirgichi } from "./bezak.js";


// ---- BRIF-04 — javonning yetishmagan ikki qismi ----
//
// Javon faqat OCHIQ o'rta qismdan iborat edi: 1.15 m dan 2.45 m gacha.
// Ostida bo'shliq, ustida bo'shliq — shuning uchun u devorga
// yopishtirilgan tokchaga o'xshardi, laboratoriya jihoziga emas.
//
// Qo'shiladi:
//   1. Poldan tokchagacha YOPIQ eshikli javon. Ochiq emasligi funksional:
//      bo'sh idish va xavfli reagentga quyosh nuri tushmasligi kerak.
//   2. Tepasida kristall panjara maketi — bezak, lekin bo'sh emas: u
//      elementar yacheyka, ya'ni haqiqiy kimyoviy tushuncha.
//
// Ikkalasi ham TANLANMAYDI (userData yo'q): shuning uchun BRIF-07
// birlashtiruvchisi ularni yig'adi va draw call narxi mesh soniga emas,
// material soniga bog'liq bo'ladi.

export const PASTKI_SHKAF = Object.freeze({
  chukur: 0.42,          // tokchadan chuqurroq — haqiqiy tumba shakli
  poyabzal: 0.09,        // pastki chekinma balandligi
  poyabzalChekinma: 0.06,
  qalinlik: 0.04,
  eshikOraligi: 0.012,
  tutqichR: 0.011,
});


/**
 * Poldan tokchagacha yopiq, ikki eshikli tumba.
 *
 * @param {number} eni      tokcha bilan bir xil kenglik
 * @param {number} balandlik  pol bilan tokcha tubi orasidagi masofa
 * @param {number} orqaZ    tokchaning orqa yuzasi (lokal z)
 */
export function pastkiShkafYasa(eni, balandlik, orqaZ, materiallar) {
  const g = new THREE.Group();
  const K = PASTKI_SHKAF;
  const chukur = K.chukur;
  const markazZ = orqaZ + chukur / 2;

  const korpusMat = materiallar?.yogoch
    || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const metallMat = materiallar?.metall
    || new THREE.MeshStandardMaterial({ color: 0x9aa4b2, metalness: 0.9, roughness: 0.25 });

  const qosh = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    g.add(m);
    return m;
  };

  // Poyabzal (toe kick) — oldinga chekingan, shuning uchun tumba polda
  // "suzib" turgandek emas, o'tirgandek ko'rinadi.
  qosh(
    new THREE.BoxGeometry(eni, K.poyabzal, chukur - K.poyabzalChekinma),
    korpusMat,
    0, -balandlik / 2 + K.poyabzal / 2, markazZ - K.poyabzalChekinma / 2,
  );

  const tanaBalandlik = balandlik - K.poyabzal;
  const tanaMarkazY = -balandlik / 2 + K.poyabzal + tanaBalandlik / 2;

  // Yon devorlar
  const yonGeo = new THREE.BoxGeometry(K.qalinlik, tanaBalandlik, chukur);
  qosh(yonGeo, korpusMat, -eni / 2 + K.qalinlik / 2, tanaMarkazY, markazZ);
  qosh(yonGeo, korpusMat, eni / 2 - K.qalinlik / 2, tanaMarkazY, markazZ);

  // Orqa panel — devor tomonda, yupqa
  qosh(
    new THREE.BoxGeometry(eni, tanaBalandlik, 0.02),
    korpusMat,
    0, tanaMarkazY, orqaZ + 0.01,
  );

  // Ustki taxta (ish yuzasi) — tokcha tubi bilan bir tekisda va biroz
  // oldinga chiqadi: chekka soya beradi va qatlam ajralib ko'rinadi.
  qosh(
    new THREE.BoxGeometry(eni + 0.03, K.qalinlik, chukur + 0.03),
    korpusMat,
    0, balandlik / 2 - K.qalinlik / 2, markazZ + 0.015,
  );

  // O'rta polka (ichkarida, eshik yopiq bo'lgani uchun deyarli ko'rinmaydi,
  // lekin eshik ochilganda joyida bo'lishi kerak)
  qosh(
    new THREE.BoxGeometry(eni - K.qalinlik * 2, 0.02, chukur - 0.04),
    korpusMat,
    0, tanaMarkazY, markazZ,
  );

  // Eshiklar — SHAFFOF EMAS. Sabab funksional: bo'sh idish va xavfli
  // reagent yorug'likdan berkitiladi.
  //
  // Eshik soni kenglikdan hisoblanadi: bitta eshik ~0.9 m dan
  // kengaymaydi. Aks holda 5.5 m li qatorda 2.7 m li eshik chiqardi va
  // u mebelga emas, devorga o'xshardi.
  const juftSoni = Math.max(1, Math.round(eni / 1.8));
  const bolimEni = eni / juftSoni;
  const eshikEni = (bolimEni - K.eshikOraligi * 3) / 2;
  const eshikBalandlik = tanaBalandlik - K.eshikOraligi * 2;
  const eshikGeo = new THREE.BoxGeometry(eshikEni, eshikBalandlik, 0.022);
  const eshikZ = orqaZ + chukur - 0.011;
  const tutqichGeo = new THREE.CylinderGeometry(K.tutqichR, K.tutqichR, 0.26, 8);

  for (let i = 0; i < juftSoni; i += 1) {
    const bolimMarkaz = -eni / 2 + bolimEni * (i + 0.5);
    for (const yon of [-1, 1]) {
      const x = bolimMarkaz + yon * (eshikEni / 2 + K.eshikOraligi / 2);
      qosh(eshikGeo, korpusMat, x, tanaMarkazY, eshikZ);
      // Tutqichlar juft eshikning o'rtasida yonma-yon turadi.
      qosh(
        tutqichGeo, metallMat,
        x - yon * (eshikEni / 2 - 0.05), tanaMarkazY, eshikZ + 0.03,
      );
    }
  }

  return g;
}


/** Devor Shkaf Karkasini Yaratish (Wall Cabinet Box) */
export function devorShkafiYasa(x, y, z, rotY, nom, materiallar, panjaraTuri, panjaraMat, kenglik, bandX) {
  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = rotY;

  const yogochMat = materiallar?.yogoch || new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const shishaMat = materiallar?.shisha || new THREE.MeshPhysicalMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.35 });

  // Kenglik endi tashqaridan beriladi: javon devorni UZLUKSIZ qoplaydi.
  // Ilgari har javon 1.8 m edi va ular orasida bo'sh devor qolardi —
  // egasi aynan shu bo'shliqni ko'rsatdi (2026-08-22).
  const eni = kenglik || 1.8;
  const balandlik = 1.3;
  const chukur = 0.35;
  const qalinlik = 0.04;
  // Uzun qator bitta ulkan quti bo'lib ko'rinmasligi uchun har ~1.8 m da
  // vertikal bo'luvchi qo'yiladi. Usiz 5.5 m javon mebel emas, devor
  // bo'lib ko'rinadi.
  const bolinmaSoni = Math.max(1, Math.round(eni / 1.8));

  // Yon devorlar
  const yonGeo = new THREE.BoxGeometry(qalinlik, balandlik, chukur);
  const yonChap = new THREE.Mesh(yonGeo, yogochMat);
  yonChap.position.set(-eni / 2, 0, 0);
  group.add(yonChap);

  const yonOng = new THREE.Mesh(yonGeo, yogochMat);
  yonOng.position.set(eni / 2, 0, 0);
  group.add(yonOng);

  // Ichki vertikal bo'luvchilar
  for (let i = 1; i < bolinmaSoni; i += 1) {
    const bolgich = new THREE.Mesh(yonGeo, yogochMat);
    bolgich.position.set(-eni / 2 + (eni / bolinmaSoni) * i, 0, 0);
    group.add(bolgich);
  }

  // Tepa va Tubi
  const qopqoqGeo = new THREE.BoxGeometry(eni + qalinlik, qalinlik, chukur);
  const qopqoqTepa = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTepa.position.set(0, balandlik / 2, 0);
  group.add(qopqoqTepa);

  const qopqoqTub = new THREE.Mesh(qopqoqGeo, yogochMat);
  qopqoqTub.position.set(0, -balandlik / 2, 0);
  group.add(qopqoqTub);

  // Orqa devor paneli
  const orqaGeo = new THREE.BoxGeometry(eni, balandlik, 0.02);
  const orqa = new THREE.Mesh(orqaGeo, yogochMat);
  orqa.position.set(0, 0, -chukur / 2);
  group.add(orqa);

  // 3 ta Shisha Polkalar
  const polkaGeo = new THREE.BoxGeometry(eni - 0.02, 0.015, chukur - 0.02);
  [-0.25, 0.05, 0.35].forEach((py) => {
    const polka = new THREE.Mesh(polkaGeo, shishaMat);
    polka.position.set(0, py, 0);
    group.add(polka);
  });

  // Tokchalarni to'ldiramiz. Urug' qator kengligidan hosila —
  // har qator o'z joylashuvini oladi, lekin har yuklashda AYNI.
  group.add(tokchaToldirgichi(eni, Math.round(Math.abs(x) * 1000) + Math.round(eni * 100) + 7, materiallar, bandX));

  // BRIF-04 — poldan tokcha tubigacha yopiq tumba.
  // Balandlik HISOBLANADI: guruh dunyoda `y` da turadi, tokchaning tubi
  // esa undan `balandlik/2` pastda. Ya'ni tumba aynan qolgan bo'shliqni
  // to'ldiradi va javon balandligi o'zgarsa o'zi moslashadi.
  const tumbaBalandlik = y - balandlik / 2;
  if (tumbaBalandlik > 0.3) {
    const tumba = pastkiShkafYasa(eni, tumbaBalandlik, -chukur / 2, materiallar);
    tumba.position.set(0, -balandlik / 2 - tumbaBalandlik / 2, 0);
    group.add(tumba);
  }

  // BRIF-04 — tokcha ustida elementar yacheyka maketlari.
  // Uzun qatorga bir nechta: har bo'linmaning o'rtasiga bittadan.
  if (panjaraTuri && panjaraMat) {
    const tagGeo = new THREE.BoxGeometry(0.24, 0.012, 0.24);
    for (let i = 0; i < bolinmaSoni; i += 1) {
      const px = -eni / 2 + (eni / bolinmaSoni) * (i + 0.5);
      const tag = new THREE.Mesh(tagGeo, yogochMat);
      tag.position.set(px, balandlik / 2 + 0.006, 0);
      group.add(tag);

      const panjara = kristallPanjaraYasa(panjaraTuri, panjaraMat);
      panjara.position.set(px, balandlik / 2 + 0.012 + 0.107, 0);
      group.add(panjara);
    }
  }

  return group;
}
