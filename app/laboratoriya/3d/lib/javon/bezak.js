// app/laboratoriya/3d/lib/javon/bezak.js
//
// Bezak: kristall panjara modellari va tokcha to'ldirgichi.
//
// BRIF-05: `javon-3d.js` (868 qator) mazmun bo'yicha bo'lindi.
// Xatti-harakat o'zgarmadi — faqat kodning joyi.

import * as THREE from "three";


// Kristall panjara maketlari. Har javonga boshqa tur — bir xil material,
// boshqa geometriya. Nega bir xil material: BRIF-07 birlashtiruvchisi
// material bo'yicha yig'adi, ya'ni 14 ta shar bitta draw call bo'lib
// qoladi. Rang bilan farqlash chiroyliroq bo'lardi, lekin har javonga
// alohida material qo'shilardi.
export const PANJARA_TURLARI = Object.freeze({
  // Oddiy kub — 8 ta burchak
  oddiy: Object.freeze([]),
  // Hajm-markazlashgan — burchaklar + markaz
  hajm: Object.freeze([[0, 0, 0]]),
  // Yoq-markazlashgan — burchaklar + 6 yoq markazi
  yoq: Object.freeze([
    [0, 0, -1], [0, 0, 1], [0, -1, 0], [0, 1, 0], [-1, 0, 0], [1, 0, 0],
  ]),
  // NaCl motifi — burchaklar + qirra o'rtalari (ikkinchi ion)
  tuz: Object.freeze([
    [-1, 0, -1], [1, 0, -1], [-1, 0, 1], [1, 0, 1],
    [0, -1, -1], [0, 1, -1], [0, -1, 1], [0, 1, 1],
    [-1, -1, 0], [1, -1, 0], [-1, 1, 0], [1, 1, 0],
  ]),
});


/**
 * Elementar yacheyka maketi — javon ustida turadigan bezak.
 *
 * Bezak, lekin bo'sh emas: bu haqiqiy kimyoviy tushuncha va o'quvchi
 * uni darslikda ko'radi. Tanlanmaydi, harakatlanmaydi — ya'ni
 * birlashtirishga to'liq yaroqli.
 */
export function kristallPanjaraYasa(tur, panjaraMat) {
  const g = new THREE.Group();
  const qadam = 0.075;        // yarim qirra uzunligi
  const sharR = 0.032;
  const bogR = 0.007;

  // 8x5 segment: 3 sm radiusdagi shar butun xona bo'ylab ko'riladi, undan
  // ortig'i faqat uchburchak. 10x6 dan 8x5 ga tushirish har sharda 100 ->
  // 64 uchburchak beradi va farqi kadrda sezilmaydi.
  const sharGeo = new THREE.SphereGeometry(sharR, 8, 5);
  const kichikGeo = new THREE.SphereGeometry(sharR * 0.72, 8, 5);
  const burchaklar = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    burchaklar.push([x, y, z]);
  }

  for (const [x, y, z] of burchaklar) {
    const m = new THREE.Mesh(sharGeo, panjaraMat.kation);
    m.position.set(x * qadam, y * qadam, z * qadam);
    g.add(m);
  }
  for (const [x, y, z] of (PANJARA_TURLARI[tur] || [])) {
    const m = new THREE.Mesh(kichikGeo, panjaraMat.anion);
    m.position.set(x * qadam, y * qadam, z * qadam);
    g.add(m);
  }

  // 12 qirra — kubning har yog'ida 4 tadan, takrorlanmasin uchun
  // faqat bitta o'q bo'ylab yuriladi.
  const bogGeo = new THREE.CylinderGeometry(bogR, bogR, qadam * 2, 6, 1, true);
  const qirralar = [];
  for (const oq of [0, 1, 2]) {
    for (const a of [-1, 1]) for (const b of [-1, 1]) {
      const joy = [0, 0, 0];
      const boshqa = [0, 1, 2].filter((i) => i !== oq);
      joy[boshqa[0]] = a * qadam;
      joy[boshqa[1]] = b * qadam;
      qirralar.push({ oq, joy });
    }
  }
  for (const { oq, joy } of qirralar) {
    const m = new THREE.Mesh(bogGeo, panjaraMat.bog);
    m.position.set(joy[0], joy[1], joy[2]);
    // Silindr sukut bo'yicha Y o'qi bo'ylab; X va Z uchun buramiz.
    if (oq === 0) m.rotation.z = Math.PI / 2;
    else if (oq === 2) m.rotation.x = Math.PI / 2;
    g.add(m);
  }

  return g;
}


// Tokchalarni to'ldiradigan idishlar.
//
// MUAMMO (egasi ko'rsatdi, 2026-08-22): javon qatorlari devorni
// uzluksiz qopladi, lekin ularning ICHI o'sha 20 ta reagent shishasi
// bo'lib qoldi. Natijada 24 metrlik tokchada bir hovuch shisha —
// "bo'sh ombor" tuyg'usi xonadan javonga ko'chdi.
//
// NEGA InstancedMesh: to'ldirish uchun yuzlab idish kerak. Oddiy mesh
// bo'lsa har biri o'z draw call'ini talab qilardi va BRIF-07 da
// erishilgan hamma narsa yo'qolardi. InstancedMesh esa nechta nusxa
// bo'lishidan qat'i nazar BITTA chaqiruv. BRIF-07 ning o'zi
// "javon tokchalari va shishalari" ni aynan shu usulning nomzodi deb
// sanagan.
//
// Ular TANLANMAYDI va o'zgarmaydi — bu ataylab. Tanlanadigan reagent
// 20 ta va ular `DEVOR_JAVON_REAGENTLARI` da; qolgani muhit.

export const TOLDIRGICH = Object.freeze({
  qadam: 0.19,        // idishlar orasidagi masofa
  chet: 0.16,         // qator chetidan bo'sh joy
  radius: 0.036,
  minBaland: 0.15,
  maksBaland: 0.25,
  // Uchala tokcha va shkaf tubi. Reagent tokchasi (-0.24) ham
  // to'ldiriladi, lekin shishalar atrofida bo'sh joy qoldiriladi —
  // aks holda ular to'ldirgich ichida yo'qolib ketardi.
  sathlar: Object.freeze([-0.62, -0.24, 0.06, 0.36]),
  reagentSathi: -0.24,
  bandChet: 0.26,     // shisha atrofidagi bo'sh joy
});


// Kam sonli, bir-biriga yaqin ranglar: tokcha rang-barang bo'lsa
// laboratoriya emas, do'kon vitrinasi bo'lib ko'rinadi.
export const TOLDIRGICH_RANGLARI = Object.freeze([
  0xdbeafe, 0xe2e8f0, 0xcfe8ff, 0xf1f5f9, 0xd9c3a0, 0xc4b5a0,
]);


export function toldirgichTasodifi(urug) {
  let holat = urug >>> 0;
  return () => {
    holat = (Math.imul(1664525, holat) + 1013904223) >>> 0;
    return holat / 0x100000000;
  };
}


/**
 * Tokchalarni to'ldiruvchi idishlar — ikkita `InstancedMesh`.
 *
 * @param {number} eni qator kengligi (lokal X bo'ylab)
 * @param {number} urug qat'iy urug' — har yuklashda AYNI joylashuv
 */
export function tokchaToldirgichi(eni, urug, materiallar, bandX = []) {
  const guruh = new THREE.Group();
  guruh.name = "Tokcha_Toldirgichi";

  const tasodif = toldirgichTasodifi(urug);
  const joylar = [];
  const boshX = -eni / 2 + TOLDIRGICH.chet;
  const oxirX = eni / 2 - TOLDIRGICH.chet;

  for (const sath of TOLDIRGICH.sathlar) {
    const reagentTokchasi = Math.abs(sath - TOLDIRGICH.reagentSathi) < 0.01;
    for (let x = boshX; x <= oxirX; x += TOLDIRGICH.qadam) {
      // Ba'zi joy ataylab bo'sh: to'la tekis qator sun'iy ko'rinadi.
      if (tasodif() < 0.18) continue;
      // Reagent tokchasida shishalar atrofi bo'sh qoladi.
      if (reagentTokchasi && bandX.some((bx) => Math.abs(bx - x) < TOLDIRGICH.bandChet)) continue;
      const baland = TOLDIRGICH.minBaland
        + tasodif() * (TOLDIRGICH.maksBaland - TOLDIRGICH.minBaland);
      joylar.push({
        x: x + (tasodif() - 0.5) * 0.03,
        y: sath,
        z: (tasodif() - 0.5) * 0.06,
        baland,
        burchak: tasodif() * Math.PI * 2,
        rang: TOLDIRGICH_RANGLARI[Math.floor(tasodif() * TOLDIRGICH_RANGLARI.length)],
      });
    }
  }
  if (!joylar.length) return guruh;

  // 6 segment: idish 3.6 sm radiusda va xona bo'ylab ko'riladi.
  // Ko'proq segment faqat uchburchak, ko'rinishda farq yo'q.
  const tanaGeo = new THREE.CylinderGeometry(
    TOLDIRGICH.radius, TOLDIRGICH.radius, 1, 6, 1, false,
  );
  const qopqoqGeo = new THREE.CylinderGeometry(
    TOLDIRGICH.radius * 0.45, TOLDIRGICH.radius * 0.5, 0.035, 6,
  );

  // SHAFFOF EMAS — ataylab.
  //
  // Shaffof sirt mobil GPU da eng qimmat narsa: u alohida o'tishda,
  // saralash bilan va depth yozmasdan chiziladi, ya'ni bir-birining
  // ustidagi yuzlab idish butun ekranni qayta-qayta bo'yaydi
  // (overdraw). Egasi telefonda aynan shundan keyin sekinlashuvni
  // sezdi (2026-08-22).
  //
  // Bu idishlar fon buyumi — ularning ichi ko'rinishi shart emas.
  // Haqiqiy reagent shishalari (20 ta) shaffofligicha qoladi.
  const tanaMat = new THREE.MeshStandardMaterial({
    roughness: 0.32, metalness: 0.04,
  });
  const qopqoqMat = materiallar?.rezina
    || new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.75 });

  const tana = new THREE.InstancedMesh(tanaGeo, tanaMat, joylar.length);
  const qopqoq = new THREE.InstancedMesh(qopqoqGeo, qopqoqMat, joylar.length);
  const matritsa = new THREE.Matrix4();
  const oq = new THREE.Vector3(0, 1, 0);
  const kvat = new THREE.Quaternion();
  const rang = new THREE.Color();

  joylar.forEach((j, i) => {
    kvat.setFromAxisAngle(oq, j.burchak);
    // Silindr balandligi 1 — masshtab bilan beriladi, ya'ni bitta
    // geometriya barcha o'lchamga xizmat qiladi.
    matritsa.compose(
      new THREE.Vector3(j.x, j.y + j.baland / 2, j.z),
      kvat,
      new THREE.Vector3(1, j.baland, 1),
    );
    tana.setMatrixAt(i, matritsa);
    tana.setColorAt(i, rang.setHex(j.rang));

    matritsa.compose(
      new THREE.Vector3(j.x, j.y + j.baland + 0.017, j.z),
      kvat,
      new THREE.Vector3(1, 1, 1),
    );
    qopqoq.setMatrixAt(i, matritsa);
  });
  tana.instanceMatrix.needsUpdate = true;
  if (tana.instanceColor) tana.instanceColor.needsUpdate = true;
  qopqoq.instanceMatrix.needsUpdate = true;

  guruh.add(tana);
  guruh.add(qopqoq);
  return guruh;
}
