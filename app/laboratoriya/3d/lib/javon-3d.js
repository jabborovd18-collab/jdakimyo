import * as THREE from "three";
import { XONA, xonaChegarasi } from "./sozlama.js";
import { yorliqniBelgila } from "./yorliqlar.js";

// DEVOR BO'YLAB O'RNATILGAN BIR NECHTA MAXSUS REAGENTLAR JAVONLARI (Wall Cabinets).
// O'rtadagi to'siq olib tashlandi: xona markazi to'liq ochiq, keng va erkin.
// 4 ta alohida devor shkaflari:
//  1. Kislotalar va Oksidlovchilar (Orqa devor chap qanoti)
//  2. Ishqorlar va Asoslar (Orqa devor o'ng qanoti)
//  3. Toza Qattiq Tuzlar va Reaktivlar (O'ng devor javoni)
//  4. Standart Eritmalar va Indikatorlar (Chap devor javoni)

export const DEVOR_JAVON_REAGENTLARI = [
  // ─── 1-JAVON: KISLOTALAR VA OKSIDLOVCHILAR (Orqa chap devorda: X = -4.5, Z = -5.3) ───
  { kalit: "HCl", nom: "Xlorid kislota", sigim: 500, joriyHajm: 450, rang: 0xf8fafc, ghs: "korroziy", shishaTuri: "tiniq", pos: [-5.1, 1.65, -5.25], javon: "kislota" },
  { kalit: "HNO₃", nom: "Nitrat kislota", sigim: 500, joriyHajm: 420, rang: 0xfef08a, ghs: "oksidlovchi", shishaTuri: "amber", pos: [-4.7, 1.65, -5.25], javon: "kislota" },
  { kalit: "H₂SO₄", nom: "Sulfat kislota (Quyuq)", sigim: 500, joriyHajm: 480, rang: 0xfacc15, ghs: "korroziy", shishaTuri: "amber", pos: [-4.3, 1.65, -5.25], javon: "kislota" },
  { kalit: "CH₃COOH", nom: "Sirka kislota (Muzdek)", sigim: 500, joriyHajm: 380, rang: 0xe2e8f0, ghs: "yonuvchan", shishaTuri: "tiniq", pos: [-3.9, 1.65, -5.25], javon: "kislota" },

  // ─── 2-JAVON: ISHQORLAR VA ASOSLAR (Orqa o'ng devorda: X = 4.5, Z = -5.3) ───
  { kalit: "NaOH", nom: "Natriy gidroksid ishqori", sigim: 500, joriyHajm: 400, rang: 0xbae6fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [3.9, 1.65, -5.25], javon: "ishqor" },
  { kalit: "KOH", nom: "Kaliy gidroksid", sigim: 500, joriyHajm: 350, rang: 0x93c5fd, ghs: "korroziy", shishaTuri: "tiniq", pos: [4.3, 1.65, -5.25], javon: "ishqor" },
  { kalit: "NH₃", nom: "Ammiakli suv (25%)", sigim: 500, joriyHajm: 450, rang: 0xcfe8ff, ghs: "toksik", shishaTuri: "amber", pos: [4.7, 1.65, -5.25], javon: "ishqor" },
  { kalit: "Ba(OH)₂", nom: "Bariy gidroksid", sigim: 250, joriyHajm: 200, rang: 0xf1f5f9, ghs: "korroziy", shishaTuri: "tiniq", pos: [5.1, 1.65, -5.25], javon: "ishqor" },

  // ─── 3-JAVON: TOZA QATTIQ TUZLAR (O'ng devor: X = 7.5, Z = -1.5) ───
  { kalit: "CuSO₄", nom: "Mis(II) sulfat", sigim: 100, joriyHajm: 85, rang: 0x0284c7, ghs: "xavfsiz", shishaTuri: "orta", pos: [7.42, 1.65, -2.1], javon: "tuz" },
  { kalit: "AgNO₃", nom: "Kumush nitrat", sigim: 100, joriyHajm: 70, rang: 0x94a3b8, ghs: "korroziy", shishaTuri: "amber", pos: [7.42, 1.65, -1.7], javon: "tuz" },
  { kalit: "KMnO₄", nom: "Kaliy permanganat", sigim: 100, joriyHajm: 90, rang: 0x7e22ce, ghs: "oksidlovchi", shishaTuri: "amber", pos: [7.42, 1.65, -1.3], javon: "tuz" },
  { kalit: "FeCl₃", nom: "Temir(III) xlorid", sigim: 100, joriyHajm: 75, rang: 0xc2410c, ghs: "korroziy", shishaTuri: "orta", pos: [7.42, 1.65, -0.9], javon: "tuz" },
  { kalit: "BaCl₂", nom: "Bariy xlorid", sigim: 100, joriyHajm: 80, rang: 0xf1f5f9, ghs: "toksik", shishaTuri: "orta", pos: [7.42, 1.25, -2.1], javon: "tuz" },
  { kalit: "KI", nom: "Kaliy yodid", sigim: 100, joriyHajm: 95, rang: 0xfef08a, ghs: "xavfsiz", shishaTuri: "orta", pos: [7.42, 1.25, -1.7], javon: "tuz" },
  // ZnSO₄ mashg'ulot_5 (amfoter gidroksidlar) uchun SHART, lekin javonda
  // yo'q edi — ya'ni o'sha mashg'ulotni bajarib bo'lmasdi. 2026-08-22 da
  // qamrov tekshiruvi buni topdi.
  //
  // `rang` moddalar bazasiga mos: lab-modda.js da ZnSO₄ = "rangsiz",
  // shuning uchun BaCl₂ bilan bir xil oq-kulrang tus.
  //
  // `ghs: "toksik"` — ZnSO₄ yutilganda zararli va suv organizmlari uchun
  // juda toksik. Mavjud beshta toifadan eng yaqini shu; xavfsizlik
  // yorlig'i shubhali holatda ehtiyot tomonga og'ishi kerak.
  { kalit: "ZnSO₄", nom: "Rux sulfat", sigim: 100, joriyHajm: 80, rang: 0xf1f5f9, ghs: "toksik", shishaTuri: "orta", pos: [7.42, 1.25, -1.3], javon: "tuz" },

  // ─── 4-JAVON: ERITMALAR VA INDIKATORLAR (Chap devor: X = -7.5, Z = -1.5) ───
  { kalit: "H₂O", nom: "Distillangan suv", sigim: 1000, joriyHajm: 950, rang: 0x38bdf8, ghs: "xavfsiz", shishaTuri: "bak", pos: [7.42, 1.65, 0.2], javon: "eritma" },
  { kalit: "Fenolftalein", nom: "Fenolftalein", sigim: 25, joriyHajm: 20, rang: 0xffffff, ghs: "yonuvchan", shishaTuri: "tomizgich", pos: [7.42, 1.65, 0.6], javon: "eritma" },
  { kalit: "Metiloranj", nom: "Metiloranj", sigim: 25, joriyHajm: 22, rang: 0xf97316, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [7.42, 1.65, 1.0], javon: "eritma" },
  { kalit: "Lakmus", nom: "Lakmus indikatori", sigim: 25, joriyHajm: 18, rang: 0x8b5cf6, ghs: "xavfsiz", shishaTuri: "tomizgich", pos: [7.42, 1.65, 1.4], javon: "eritma" },
];

const GHS_RANGLARI = {
  korroziy: "#ef4444",
  oksidlovchi: "#f59e0b",
  toksik: "#a855f7",
  yonuvchan: "#f97316",
  xavfsiz: "#38bdf8",
};

function shishaYorliginiYasa(item) {
  if (typeof document === "undefined") {
    const fake = new THREE.Sprite();
    return { sprite: fake, yangila: () => {} };
  }
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  const chizYorliq = (joriy, sigim) => {
    ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
    ctx.beginPath();
    ctx.roundRect(2, 2, 188, 68, 8);
    ctx.fill();

    const hoshiyaRangi = GHS_RANGLARI[item.ghs] || "#38bdf8";
    ctx.strokeStyle = hoshiyaRangi;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(item.kalit, 96, 32);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${Math.round(joriy)}/${sigim}ml`, 96, 56);
  };

  chizYorliq(item.joriyHajm, item.sigim);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(0.13, 0.048, 1);
  sprite.raycast = () => {};
  yorliqniBelgila(sprite);

  const yangila = (yangiHajm) => {
    chizYorliq(yangiHajm, item.sigim);
    texture.needsUpdate = true;
  };

  return { sprite, yangila };
}

function reagentShishasiModel(item, materiallar) {
  const bottleGroup = new THREE.Group();
  bottleGroup.name = `Devor_Shisha_${item.kalit}`;

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

  let radius = 0.03;
  let balandlik = 0.08;
  let boyinR = 0.013;
  let boyinH = 0.024;

  if (item.shishaTuri === "tomizgich") {
    radius = 0.018;
    balandlik = 0.05;
    boyinR = 0.008;
    boyinH = 0.018;
  } else if (item.sigim === 500) {
    radius = 0.045;
    balandlik = 0.12;
    boyinR = 0.02;
    boyinH = 0.03;
  } else if (item.sigim === 1000) {
    radius = 0.06;
    balandlik = 0.15;
    boyinR = 0.025;
    boyinH = 0.035;
  }

  const tanaGeo = new THREE.CylinderGeometry(radius, radius, balandlik, 18);
  const tana = new THREE.Mesh(tanaGeo, shishaMat);
  tana.position.y = balandlik / 2;
  bottleGroup.add(tana);

  const maksSuyuqH = balandlik * 0.8;
  const suyuqRatio = item.joriyHajm / item.sigim;
  const suyuqH = maksSuyuqH * suyuqRatio;
  const suyuqGeo = new THREE.CylinderGeometry(radius * 0.9, radius * 0.9, maksSuyuqH, 16);
  const suyuq = new THREE.Mesh(suyuqGeo, suyuqMat);
  suyuq.scale.y = suyuqRatio;
  suyuq.position.y = (maksSuyuqH * suyuqRatio) / 2 + 0.004;
  bottleGroup.add(suyuq);

  const qopqoqGeo = new THREE.CylinderGeometry(boyinR * 1.1, boyinR * 1.3, boyinH, 14);
  const qopqoq = new THREE.Mesh(qopqoqGeo, qopqoqMat);
  const aslQopqoqY = balandlik + boyinH / 2;
  qopqoq.position.y = aslQopqoqY;
  bottleGroup.add(qopqoq);

  const { sprite: yorliqSprite, yangila: yorliqYangila } = shishaYorliginiYasa(item);
  yorliqSprite.position.set(0, balandlik + boyinH + 0.04, 0);
  bottleGroup.add(yorliqSprite);

  bottleGroup.position.set(...item.pos);

  // Hajmni kamaytirish va real vaqtda yangilash funksiyasi
  const hajmniYangila = (yangiHajm) => {
    const clamped = Math.max(0, Math.min(item.sigim, Number(yangiHajm) || 0));
    bottleGroup.userData.joriyHajm = clamped;

    const r = Math.max(0.01, clamped / item.sigim);
    suyuq.scale.y = r;
    suyuq.position.y = (maksSuyuqH * r) / 2 + 0.004;

    yorliqYangila(clamped);
  };

  bottleGroup.userData = {
    kalit: item.kalit,
    nom: item.nom,
    sigim: item.sigim,
    joriyHajm: item.joriyHajm,
    ghs: item.ghs,
    tanlanadi: true,
    devorShishasi: true,
    aslPos: new THREE.Vector3(...item.pos),
    aslQopqoqY,
    suyuqlikMesh: suyuq,
    qopqoqMesh: qopqoq,
    hajmniYangila,
    stolUstida: false,
  };

  return bottleGroup;
}

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

const PASTKI_SHKAF = Object.freeze({
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
function pastkiShkafYasa(eni, balandlik, orqaZ, materiallar) {
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

// Kristall panjara maketlari. Har javonga boshqa tur — bir xil material,
// boshqa geometriya. Nega bir xil material: BRIF-07 birlashtiruvchisi
// material bo'yicha yig'adi, ya'ni 14 ta shar bitta draw call bo'lib
// qoladi. Rang bilan farqlash chiroyliroq bo'lardi, lekin har javonga
// alohida material qo'shilardi.
const PANJARA_TURLARI = Object.freeze({
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
function kristallPanjaraYasa(tur, panjaraMat) {
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

const TOLDIRGICH = Object.freeze({
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
const TOLDIRGICH_RANGLARI = Object.freeze([
  0xdbeafe, 0xe2e8f0, 0xcfe8ff, 0xf1f5f9, 0xd9c3a0, 0xc4b5a0,
]);

function toldirgichTasodifi(urug) {
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
function tokchaToldirgichi(eni, urug, materiallar, bandX = []) {
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

/** Devor Shkaf Karkasini Yaratish (Wall Cabinet Box) */
function devorShkafiYasa(x, y, z, rotY, nom, materiallar, panjaraTuri, panjaraMat, kenglik, bandX) {
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

// Qaysi reagent guruhi qaysi qatorda va uning qaysi qismida turadi.
//
// MUAMMO (egasi jonli sahifada ko'rsatdi, 2026-08-22): xona
// kattalashtirilganda javon qatorlari xona o'lchamidan hisoblandi,
// lekin shishalar joyi `DEVOR_JAVON_REAGENTLARI` dagi `pos` da qattiq
// yozilgan bo'lib qoldi. Natijada shishalar devordan 2.5 m narida —
// HAVODA osilib turdi, ikkitasi esa polda ko'rindi.
//
// Ildiz sabab AGENTS.md 1-bandi: bir ma'lumot (javon qayerda) ikki
// joyda yozilgan edi. Endi shishalar joyi qatordan HISOBLANADI va
// `pos` faqat tartibni belgilaydi.
const REAGENT_TAQSIMOTI = Object.freeze({
  kislota: Object.freeze({ qator: "orqaChap", bosh: 0.30, oxir: 0.70 }),
  ishqor: Object.freeze({ qator: "orqaOng", bosh: 0.30, oxir: 0.70 }),
  tuz: Object.freeze({ qator: "ong", bosh: 0.12, oxir: 0.40 }),
  eritma: Object.freeze({ qator: "ong", bosh: 0.60, oxir: 0.88 }),
});

// Shisha tokcha sirtidan shu qadar oldinda turadi (tokcha chuqurligi
// 0.35, ya'ni shisha uning o'rtasiga tushadi).
const SHISHA_CHUQURLIGI = 0.10;

/**
 * Har reagentga dunyo koordinatasini beradi.
 *
 * Qator ichida bir xil balandlikdagi shishalar teng taqsimlanadi:
 * ikki qatorli javonda (tuz) pastki qator yuqorigisining ostiga
 * tushadi, chunki ikkalasi ham bir xil oraliqqa yoyiladi.
 */
function reagentJoylari(Q) {
  const natija = new Map();
  const guruhlar = new Map();
  for (const item of DEVOR_JAVON_REAGENTLARI) {
    const kalit = `${item.javon}|${item.pos[1]}`;
    if (!guruhlar.has(kalit)) guruhlar.set(kalit, []);
    guruhlar.get(kalit).push(item);
  }

  for (const [kalit, ro] of guruhlar) {
    const [javon] = kalit.split("|");
    const t = REAGENT_TAQSIMOTI[javon];
    if (!t) continue;
    const n = ro.length;
    for (let i = 0; i < n; i += 1) {
      // n ta shisha [bosh, oxir] oralig'iga teng joylashadi.
      const ulush = n === 1
        ? (t.bosh + t.oxir) / 2
        : t.bosh + (t.oxir - t.bosh) * (i / (n - 1));
      const siljish = (ulush - 0.5);
      const y = ro[i].pos[1];
      let joy;
      let mahalliyX;
      if (t.qator === "ong") {
        mahalliyX = siljish * Q.ongKenglik;
        joy = [Q.ongX - SHISHA_CHUQURLIGI, y, Q.ongMarkazZ + mahalliyX];
      } else {
        const markaz = t.qator === "orqaOng" ? Q.orqaMarkaz : -Q.orqaMarkaz;
        mahalliyX = siljish * Q.orqaKenglik;
        joy = [markaz + mahalliyX, y, Q.orqaZ + SHISHA_CHUQURLIGI];
      }
      natija.set(ro[i].kalit, { joy, qator: t.qator, mahalliyX });
    }
  }
  return natija;
}

/**
 * Devor javon qatorlarining joylashuvi — YAGONA MANBA.
 *
 * Modelni ham, `xona-zonalari.js` dagi zona kameralarini ham shu
 * funksiya boqadi. Ikki joyda alohida hisoblansa, xona o'lchami
 * o'zgarganda kamera javonga emas, bo'sh devorga qarab qolardi
 * (AGENTS.md 1-band).
 */
export function JAVON_QATORLARI() {
  const chegara = xonaChegarasi();
  const chetlanish = 0.2;      // burchakdan bo'sh joy
  const jadvalYarim = 2.3;     // davriy jadval egallagan zona (4.12 m plakat)
  const orqaZ = chegara.zMin + 0.25;

  const orqaKenglik = (XONA.eni / 2 - chetlanish) - jadvalYarim;
  const orqaMarkaz = jadvalYarim + orqaKenglik / 2;

  // O'ng qator xavfsizlik dushidan oldin to'xtaydi.
  // Dush: xona-modellari.js -> z = markazZ + 3.1, yarim eni ~0.9.
  const ongBoshi = orqaZ + 0.25;
  const ongOxiri = XONA.markazZ + 3.1 - 0.9;

  // Chap qator deraza tokchasi ostida, old devorgacha.
  const chapBoshi = orqaZ + 0.25;
  const chapOxiri = chegara.zMax - 1.0;

  return {
    orqaZ,
    orqaKenglik,
    orqaMarkaz,
    ongX: XONA.eni / 2 - 0.4,
    ongKenglik: ongOxiri - ongBoshi,
    ongMarkazZ: (ongBoshi + ongOxiri) / 2,
    chapBalandlik: 1.05,       // deraza tokchasi 1.1 m da
    chapKenglik: chapOxiri - chapBoshi,
    chapMarkazZ: (chapBoshi + chapOxiri) / 2,
  };
}

/** 4 TA ALOHIDA DEVOR REAGENTLAR JAVONINI YARATISH */
export function javon3dYasa(materiallar, profil) {
  if (!profil) throw new Error("Javon uchun sifat profili berilmadi");
  const mainCabinetGroup = new THREE.Group();
  mainCabinetGroup.name = "3D_Devor_Reagent_Shkaflari";
  mainCabinetGroup.userData.profil = profil;

  // Panjara materiallari SAHNA bilan bir umr ko'radi va to'rt javonga
  // ulashiladi. Modul darajasida yaratilmaydi: `useSahna` tozalashda
  // sahnadagi har materialni dispose qiladi, ya'ni modul singleton
  // ikkinchi montajda o'lik bo'lib qolardi.
  const panjaraMat = {
    kation: new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.35, metalness: 0.1 }),
    anion: new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4, metalness: 0.1 }),
    bog: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.35, metalness: 0.6 }),
  };

  // JAVONLAR DEVORNI UZLUKSIZ QOPLAYDI (egasi so'rovi, 2026-08-22).
  //
  // Ilgari to'rtta 1.8 m li javon devorlarda alohida-alohida turardi va
  // ular orasida bo'sh devor qolardi. Endi har devor uchun QATOR
  // hisoblanadi va bo'shliq qolmaydi.
  //
  // Koordinatalar xona o'lchamidan keladi — kattalashtirilganda qatorlar
  // o'zi cho'ziladi va devorda yana bo'shliq paydo bo'lmaydi.
  const Q = JAVON_QATORLARI();
  const reagentJoyi = reagentJoylari(Q);
  const bandX = { orqaChap: [], orqaOng: [], ong: [] };
  for (const j of reagentJoyi.values()) bandX[j.qator].push(j.mahalliyX);

  // Orqa devor — davriy jadvalning ikki yonida ikki qator.
  mainCabinetGroup.add(devorShkafiYasa(
    -Q.orqaMarkaz, 1.8, Q.orqaZ, 0, "Kislotalar", materiallar, "oddiy", panjaraMat, Q.orqaKenglik, bandX.orqaChap,
  ));
  mainCabinetGroup.add(devorShkafiYasa(
    Q.orqaMarkaz, 1.8, Q.orqaZ, 0, "Ishqorlar", materiallar, "hajm", panjaraMat, Q.orqaKenglik, bandX.orqaOng,
  ));

  // O'ng devor — orqa qator tugagan joydan xavfsizlik dushigacha.
  mainCabinetGroup.add(devorShkafiYasa(
    Q.ongX, 1.8, Q.ongMarkazZ, -Math.PI / 2,
    "Tuzlar va Eritmalar", materiallar, "tuz", panjaraMat, Q.ongKenglik, bandX.ong,
  ));

  // Chap devor — DERAZALAR TAGIDA past javon qatori.
  //
  // Chap devorda endi deraza bor (xona-modellari.js), shuning uchun u
  // yerga baland javon qo'yib bo'lmaydi — u derazani yopib qo'yardi.
  // Lekin deraza tokchasi 1.1 m da, ya'ni tagida butun devor bo'yi
  // bo'sh joy qoladi. Haqiqiy laboratoriyada aynan o'sha joyda ish
  // yuzasi va tumba turadi.
  //
  // "Eritmalar" reagentlari shu sababli o'ng qatorga ko'chirildi.
  const chapGuruh = new THREE.Group();
  chapGuruh.position.set(-XONA.eni / 2, Q.chapBalandlik / 2, Q.chapMarkazZ);
  chapGuruh.rotation.y = Math.PI / 2;
  chapGuruh.add(pastkiShkafYasa(Q.chapKenglik, Q.chapBalandlik, 0, materiallar));
  mainCabinetGroup.add(chapGuruh);

  // BRIF-04 — javon KARKASI soya tashlaydi. Shishalar bu paytda hali
  // qo'shilmagan va bu ATAYLAB: shisha soya xaritasida qora dog' beradi
  // (chuqurlik o'tishi shaffoflikni bilmaydi).
  //
  // Javon devorga yopishtirilgan qog'ozdek ko'rinishining sababi aynan
  // shu edi — u soya zonasidan ham tashqarida, o'zi ham soya tashlamas
  // edi (BRIF-04 skrinshot tahlili).
  if (profil.soya) {
    mainCabinetGroup.traverse((o) => {
      if (!o.isMesh) return;
      const m = o.material;
      if (!m || Array.isArray(m) || m.isMeshBasicMaterial) return;
      if (m.transparent || m.opacity < 1 || m.transmission > 0) return;
      o.castShadow = true;
    });
  }

  // Shishalarni tegishli javonlarga joylashtirish.
  // Joy `pos` dan EMAS, qator geometriyasidan hisoblanadi.
  const joylar = reagentJoylari(Q);
  DEVOR_JAVON_REAGENTLARI.forEach((item) => {
    const bottle = reagentShishasiModel(item, materiallar);
    const j = joylar.get(item.kalit);
    if (j) {
      bottle.position.set(j.joy[0], j.joy[1], j.joy[2]);
      // Shishani javonga qaytarish animatsiyasi shu nuqtaga qaytaradi
      // (shisha-animatsiya.js). U ham hisoblangan joy bo'lishi shart.
      bottle.userData.aslPos = new THREE.Vector3(j.joy[0], j.joy[1], j.joy[2]);
    }
    mainCabinetGroup.add(bottle);
  });

  return mainCabinetGroup;
}

/** Sahnadagi devor shkaflaridan berilgan reagent kaliti bo'yicha shisha guruhini topish */
export function devorShishasiniTop(sahna, kalit) {
  if (!sahna || !kalit) return null;
  const javon = sahna.getObjectByName("3D_Devor_Reagent_Shkaflari");
  if (!javon) return null;

  let topildi = null;
  javon.traverse((child) => {
    if (topildi) return;
    if (child.userData && child.userData.devorShishasi && child.userData.kalit === kalit) {
      topildi = child;
    }
  });

  return topildi;
}

