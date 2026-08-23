// app/laboratoriya/3d/lib/javon-3d.js
//
// Devor javonini YIG'ADI. Qismlar `lib/javon/` da.
//
// BRIF-05: bu fayl 868 qator edi (AGENTS.md 11.7 chegarasi 600).
//
// TASHQI IMZO O'ZGARMADI: `javon3dYasa`, `JAVON_QATORLARI`,
// `devorShishasiniTop`, `DEVOR_JAVON_REAGENTLARI` va `INDIKATORLAR`
// shu fayldan eksport qilinaveradi — chaqiruvchi kod tegilmadi.

import * as THREE from "three";
import { XONA, xonaChegarasi } from "./sozlama.js";
// DIQQAT: quyidagi `export { ... } from` QAYTA EKSPORT qiladi, lekin
// nomni shu fayl ichiga KIRITMAYDI. `javon3dYasa` uni ishlatgani uchun
// alohida import ham kerak. Bu farq build'da ko'rinmaydi.
import { DEVOR_JAVON_REAGENTLARI, reagentJoylari } from "./javon/reagentlar.js";
import { reagentShishasiModel } from "./javon/shisha.js";
import { devorShkafiYasa, pastkiShkafYasa } from "./javon/shkaf.js";
import { PANJARA_TURLARI } from "./javon/bezak.js";

// Eski import yo'lini saqlash uchun qayta eksport.
export {
  DEVOR_JAVON_REAGENTLARI,
  INDIKATORLAR,
} from "./javon/reagentlar.js";


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
