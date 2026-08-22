// app/laboratoriya/3d/lib/geometriya-birlashtirish.js
//
// BRIF-07 — harakatsiz geometriyani zona bo'yicha birlashtirish.
//
// MUAMMO: sahnada 228 ta mesh bor (o'lchandi, 2026-08-22) va har biri
// o'z draw call'ini talab qiladi. Xonaning bir qismi esa 100%
// harakatsiz — devor, pol, ship, deraza, javon karkasi, stol oyoqlari
// hech qachon qimirlamaydi.
//
// YECHIM: ularni material va fazoviy zona bo'yicha birlashtirish.
//
// CHEGARASI: harakatsiz geometriya 228 dan atigi ~40 tasi. Qolgani
// tanlanadigan ob'ekt (reagent shishalari, stansiyalar, jihozlar) va
// ularga tegilmaydi. Shuning uchun umumiy `chaqiruv` eng ko'pi bilan
// ~30% kamayadi, yarmiga emas — YOL-XARITASI.md dagi 2026-08-22
// yozuviga qarang.
//
// NEGA BITTA ULKAN MESH EMAS: bitta mesh bo'lsa frustum culling
// yo'qoladi — kamera qayerga qarasa ham butun xona chiziladi. Shuning
// uchun xona XZ panjarasiga bo'linadi va har katak alohida birlashadi.

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// IKKINCHI QATLAM HIMOYA — nom bo'yicha.
//
// Birinchi qatlam `userData.kalit` / `tanlanadi` (pastdagi
// `tanlanadiganmi`), va xona stansiyalarining deyarli hammasida u BOR.
// Diqqat: u `obj.userData = { kalit: ... }` shaklida beriladi, shuning
// uchun `grep "userData.kalit"` uni TOPMAYDI va 0 qaytaradi. Bu naqsh
// bir marta ko'rikni chalg'itgan.
//
// Lekin `3D_Devor_Reagent_Shkaflari` (javon-3d.js:250) ildiz guruhida
// userData YO'Q — u faqat NOM bilan topiladi. Shuning uchun nom
// ro'yxati kerak.
//
// Ro'yxat koddan olingan:
//   grep -rn "getObjectByName\|\.name === \"" app/laboratoriya/3d/
//
// Yangi nom qo'shilsa, bu yerga ham qo'shilishi shart. O'lchagich shu
// ro'yxat bo'yicha har stansiyaning mesh sonini sanaydi — nom yo'qolsa
// yoki ichi bo'shasa, `npm run lab3d:olcham` yiqiladi.
export const HIMOYALANGAN_NOMLAR = Object.freeze([
  "Tarozi_Stansiyasi",            // korinish.js, useYurish.js, useSudrash.js
  "Xavfsizlik_Dushi_Stansiyasi",  // korinish.js, useYurish.js
  "Davriy_Jadval_LED_Plakat",     // useYurish.js
  "Titrlash_Byuretka_Stansiyasi", // korinish.js, useYurish.js
  "Elektroliz_Stansiyasi",        // korinish.js, useYurish.js
  "Yuvinish_Rakovinasi",          // korinish.js, useYurish.js
  "3D_Devor_Reagent_Shkaflari",   // javon-3d.js — YAGONA himoyasi shu nom
  "Lab_Plansheti",                // korinish.js:756 — ekranniYangila()
]);

// Xona 16x12 m. 4 m li katak => 4x3 = 12 zona. Culling shu bo'linishda
// saqlanadi: kamera bir tomonga qaraganda uzoq kataklar chizilmaydi.
//
// 8 m ham o'lchandi (telefon profili, chaqiruv) va YOMONROQ chiqdi —
// yiriklashgan chegara qutisi culling'ni yeydi:
//
//   nuqta   4 m    8 m
//   stol    121    122
//   xona     26     24
//   ship     10     14      <- yiriklashgan mesh shipga ham tushadi
//   pol       3      5
//   sweep    32     32
//
// Ya'ni katak hech qachon to'siq bo'lmagan: birlashish oldin rekursiya
// yo'qligi sabab bo'lmagan (pastdagi `meshlarniYig` izohiga qarang).
const KATAK = 4.0;

/**
 * Shu TUGUNning o'zi himoyalanganmi?
 *
 * Nishon (useYurish.js:869-978) ota-zanjir bo'ylab YUQORIGA chiqib
 * `userData.kalit`, `tanlanadi` va `sigim` ni qidiradi. Ya'ni bunday
 * belgisi bor tugunning ostidagi HAR QANDAY mesh o'sha tugunni
 * tanlanadigan qiladi — shuning uchun butun shoxga kirilmaydi.
 */
function tanlanadiganmi(tugun) {
  const ud = tugun.userData;
  return Boolean(ud?.kalit || ud?.tanlanadi || ud?.sigim > 0);
}

/**
 * Nomi bo'yicha qidiriladigan idish-tugunmi?
 *
 * Bunday tugun O'ZI saqlanishi shart, lekin ichidagi harakatsiz
 * geometriya birlashishi mumkin — SHARTI: natija o'sha tugunning ICHIDA
 * qolsin. Aks holda `ota.name === "..."` bo'yicha yuqoriga chiqadigan
 * nishon zanjiri uziladi.
 *
 * Amalda bu faqat `3D_Devor_Reagent_Shkaflari` ga tegishli: qolgan yetti
 * nomning hammasida `userData.kalit` ham bor, ya'ni ular yuqoridagi
 * `tanlanadiganmi` bilan butunlay chetlab o'tiladi.
 */
function nomlanganIdishmi(tugun) {
  return Boolean(tugun.name) && HIMOYALANGAN_NOMLAR.includes(tugun.name);
}

/** Birlashtirishga yaroqli mesh mi? */
function yaroqlimi(o) {
  if (!o.isMesh) return false;              // Sprite, Line, Points — yo'q
  if (o.isInstancedMesh || o.isSkinnedMesh) return false;
  if (Array.isArray(o.material)) return false;
  if (!o.geometry?.attributes?.position) return false;
  if (o.geometry.morphAttributes && Object.keys(o.geometry.morphAttributes).length) return false;
  if (o.userData?.birlashtirma) return false;
  // Ko'rinmas mesh birlashsa, u ko'rinadigan bo'lib qoladi. Xona ichida
  // bunday meshlar bor (dush suvi, rakovina oqimi, elektroliz pufaklari)
  // — ular effekt paytida yoqiladi.
  if (o.visible === false) return false;
  // Bolasi bor meshni birlashtirsak, uni ota-onasidan olib tashlaganda
  // bolalari ham sahnadan tushib ketadi. Bunday meshga tegmaymiz,
  // lekin ichiga tushib bolalarini ko'ramiz.
  if (o.children.length > 0) return false;
  return true;
}

function katakKaliti(v) {
  return `${Math.floor(v.x / KATAK)}_${Math.floor(v.z / KATAK)}`;
}

/**
 * Daraxtni rekursiv aylanib, birlashtirishga yaroqli meshlarni chelaklarga
 * ajratadi.
 *
 * NEGA REKURSIV: avvalgi versiya faqat 1-darajali bolalarni ko'rar va
 * shox ichida bitta himoyalangan tugun bo'lsa BUTUN shoxni tashlab
 * ketardi. Xona tuzilishida `Xavfsizlik_Dushi_Stansiyasi`
 * (`userData.kalit` bilan) xona qobig'i guruhining ichida turadi
 * (xona-modellari.js:492) — ya'ni bitta dush pol, ship, 4 devor,
 * derazalar va eshikni ham blokladi. Aynan birlashtirilishi kerak
 * bo'lgan geometriya tegilmay qolardi.
 *
 * Endi himoyalangan TUGUN tashlanadi, uning otasi emas.
 *
 * `oNa` — birlashgan mesh QAYERGA qo'shilishi. Odatda bu chaqiruv ildizi,
 * lekin nomli idish-tugunga kirganda o'sha tugunga almashadi, chunki
 * nishon nomni ota-zanjirda qidiradi.
 */
function meshlarniYig(tugun, oNa, chelaklar, hisob) {
  for (const bola of tugun.children) {
    if (bola.isLight || bola.isCamera) continue;
    if (tanlanadiganmi(bola)) {
      hisob.otkazildi += 1;
      continue;                            // butun shoxga kirilmaydi
    }
    if (yaroqlimi(bola)) {
      const joy = new THREE.Vector3();
      bola.getWorldPosition(joy);
      const kalit = [
        oNa.uuid,
        bola.material.uuid,
        bola.castShadow ? 1 : 0,
        bola.receiveShadow ? 1 : 0,
        bola.renderOrder,
        katakKaliti(joy),
      ].join("|");
      if (!chelaklar.has(kalit)) {
        chelaklar.set(kalit, {
          ona: oNa,
          material: bola.material,
          castShadow: bola.castShadow,
          receiveShadow: bola.receiveShadow,
          renderOrder: bola.renderOrder,
          meshlar: [],
        });
      }
      chelaklar.get(kalit).meshlar.push(bola);
    } else if (bola.isMesh && bola.children.length > 0) {
      hisob.bolali += 1;
    }
    if (bola.children.length > 0) {
      meshlarniYig(bola, nomlanganIdishmi(bola) ? bola : oNa, chelaklar, hisob);
    }
  }
}

/**
 * Harakatsiz geometriyani birlashtiradi.
 *
 * Tanlanadigan shoxga TEGMAYDI: `userData.kalit`, `tanlanadi` yoki
 * `sigim` bo'lsa, o'sha shox butunlay chetlab o'tiladi. Nomi bilan
 * qidiriladigan idish-tugun esa saqlanadi, lekin ichi birlashishi mumkin
 * — natija o'sha tugunning ichida qoladi.
 *
 * @param {THREE.Object3D} ildiz — sahna yoki uning bir qismi
 * @returns {{birlashdi:number, guruh:number, otkazildi:number, bolali:number}}
 */
export function harakatsizGeometriyaniBirlashtir(ildiz) {
  if (!ildiz) return { birlashdi: 0, guruh: 0, otkazildi: 0, bolali: 0 };

  ildiz.updateMatrixWorld(true);

  const chelaklar = new Map();
  const hisob = { otkazildi: 0, bolali: 0 };

  meshlarniYig(ildiz, ildiz, chelaklar, hisob);

  let birlashdi = 0;
  let guruh = 0;
  const mahalliy = new THREE.Matrix4();
  const onaTeskari = new THREE.Matrix4();
  const nomzodGeometriyalar = new Set();

  for (const [, chelak] of chelaklar) {
    if (chelak.meshlar.length < 2) continue;   // bitta mesh — foyda yo'q

    const geometriyalar = [];
    let xato = false;

    // Geometriya ONA tugunga NISBATAN pishiriladi: birlashgan mesh o'sha
    // onaning bolasi bo'lib qo'shiladi va uning matritsasi ustidan
    // ikkinchi marta qo'llanmasligi kerak.
    chelak.ona.updateMatrixWorld(true);
    onaTeskari.copy(chelak.ona.matrixWorld).invert();

    for (const m of chelak.meshlar) {
      try {
        const g = m.geometry.clone();
        m.updateMatrixWorld(true);
        mahalliy.multiplyMatrices(onaTeskari, m.matrixWorld);
        g.applyMatrix4(mahalliy);
        // Ortiqcha atributlar birlashishga xalaqit qiladi — faqat
        // umumiy uchtasini qoldiramiz.
        for (const nom of Object.keys(g.attributes)) {
          if (!["position", "normal", "uv"].includes(nom)) g.deleteAttribute(nom);
        }
        if (!g.attributes.normal) g.computeVertexNormals();
        geometriyalar.push(g);
      } catch {
        xato = true;
        break;
      }
    }

    if (xato || geometriyalar.length < 2) {
      geometriyalar.forEach((g) => g.dispose());
      continue;
    }

    // uv bor/yo'qligi aralash bo'lsa merge yiqiladi — tekislaymiz.
    const uvBor = geometriyalar.every((g) => g.attributes.uv);
    if (!uvBor) geometriyalar.forEach((g) => g.deleteAttribute("uv"));

    let birlashgan = null;
    try {
      birlashgan = mergeGeometries(geometriyalar, false);
    } catch {
      birlashgan = null;
    }
    geometriyalar.forEach((g) => g.dispose());

    if (!birlashgan) continue;

    const yangi = new THREE.Mesh(birlashgan, chelak.material);
    yangi.castShadow = chelak.castShadow;
    yangi.receiveShadow = chelak.receiveShadow;
    yangi.renderOrder = chelak.renderOrder;
    yangi.name = "Birlashgan_Harakatsiz";
    // Nishon uni "stansiya" deb o'ylamasin va qayta birlashtirishga
    // tushmasin.
    yangi.userData.birlashtirma = true;

    // Eskilarini olib tashlaymiz. Material umumiy — uni bo'shatmaymiz.
    // Geometriyani ham SHU YERDA bo'shatmaymiz: bitta geometriya bir
    // nechta mesh tomonidan ulashilgan bo'lishi mumkin (stol oyoqlari
    // bitta `BoxGeometry` dan yasalgan), va ulardan biri himoyalangan
    // bo'lib qolsa, bo'shatish uni ko'rinmas qilardi. Bo'shatish
    // hammasi tugagach, haqiqiy foydalanuvchilar sanab chiqilgandan
    // keyin qilinadi.
    for (const m of chelak.meshlar) {
      if (m.geometry) nomzodGeometriyalar.add(m.geometry);
      m.parent?.remove(m);
      birlashdi += 1;
    }

    chelak.ona.add(yangi);
    guruh += 1;
  }

  // Endi sahnada qolgan meshlar qaysi geometriyalarni ishlatayotganini
  // sanaymiz va faqat hech kim ishlatmaydiganini bo'shatamiz.
  const bandGeometriyalar = new Set();
  ildiz.traverse((o) => {
    if (o.isMesh && o.geometry) bandGeometriyalar.add(o.geometry);
  });
  for (const g of nomzodGeometriyalar) {
    if (!bandGeometriyalar.has(g)) g.dispose();
  }

  return { birlashdi, guruh, otkazildi: hisob.otkazildi, bolali: hisob.bolali };
}
