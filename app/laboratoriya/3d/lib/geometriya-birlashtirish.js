// app/laboratoriya/3d/lib/geometriya-birlashtirish.js
//
// BRIF-07 — harakatsiz geometriyani zona bo'yicha birlashtirish.
//
// MUAMMO: sahna ~200 ta alohida mesh dan iborat va har biri o'z draw
// call'ini talab qiladi. Xona esa 100% harakatsiz — devor, pol, ship,
// deraza, javon karkasi hech qachon qimirlamaydi.
//
// YECHIM: ularni material va fazoviy zona bo'yicha birlashtirish.
//
// NEGA BITTA ULKAN MESH EMAS: bitta mesh bo'lsa frustum culling
// yo'qoladi — kamera qayerga qarasa ham butun xona chiziladi. Shuning
// uchun xona XZ panjarasiga bo'linadi va har katak alohida birlashadi.

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Kod bu nomlarni to'g'ridan-to'g'ri qidiradi (useYurish.js, useSudrash.js,
// korinish.js). Ularni birlashtirsak, o'sha interaktivlik jimgina o'ladi.
//
// Ro'yxat koddan olingan — `grep -rn 'getObjectByName\|\.name ==='`.
// Yangi nom qo'shilsa, bu yerga ham qo'shilishi shart.
export const HIMOYALANGAN_NOMLAR = Object.freeze([
  "Tarozi_Stansiyasi",
  "Xavfsizlik_Dushi_Stansiyasi",
  "Davriy_Jadval_LED_Plakat",
  "Titrlash_Byuretka_Stansiyasi",
  "Elektroliz_Stansiyasi",
  "Yuvinish_Rakovinasi",
  "3D_Devor_Reagent_Shkaflari",
]);

// Xona 16x12 m. 4 m li katak => 4x3 = 12 zona. Culling shu bo'linishda
// saqlanadi: kamera bir tomonga qaraganda uzoq kataklar chizilmaydi.
const KATAK = 4.0;

/**
 * Tugun (yoki uning avlodi) interaktivmi?
 * Nishon (crosshair) ota-zanjir bo'ylab `userData.kalit` ni qidiradi,
 * shuning uchun butun shoxni tekshiramiz.
 */
function interaktivmi(tugun) {
  let topildi = false;
  tugun.traverse((o) => {
    if (topildi) return;
    if (o.userData?.kalit || o.userData?.tanlanadi) topildi = true;
    if (o.name && HIMOYALANGAN_NOMLAR.includes(o.name)) topildi = true;
  });
  return topildi;
}

/** Birlashtirishga yaroqli mesh mi? */
function yaroqlimi(o) {
  if (!o.isMesh) return false;              // Sprite, Line, Points — yo'q
  if (o.isInstancedMesh || o.isSkinnedMesh) return false;
  if (Array.isArray(o.material)) return false;
  if (!o.geometry?.attributes?.position) return false;
  if (o.geometry.morphAttributes && Object.keys(o.geometry.morphAttributes).length) return false;
  if (o.userData?.birlashtirma) return false;
  return true;
}

function katakKaliti(v) {
  return `${Math.floor(v.x / KATAK)}_${Math.floor(v.z / KATAK)}`;
}

/**
 * Harakatsiz geometriyani birlashtiradi.
 *
 * Interaktiv shoxlarga TEGMAYDI: `userData.kalit`, `userData.tanlanadi`
 * yoki HIMOYALANGAN_NOMLAR dagi nom bo'lsa, butun shox chetlab o'tiladi.
 *
 * @param {THREE.Object3D} ildiz — odatda xona interyeri guruhi
 * @returns {{birlashdi:number, guruh:number, otkazildi:number}} hisobot
 */
export function harakatsizGeometriyaniBirlashtir(ildiz) {
  if (!ildiz) return { birlashdi: 0, guruh: 0, otkazildi: 0 };

  ildiz.updateMatrixWorld(true);

  const chelaklar = new Map();   // kalit -> { material, castShadow, receiveShadow, meshlar[] }
  let otkazildi = 0;

  // Faqat to'g'ridan-to'g'ri bolalarni ko'ramiz: interaktiv shox butunlay
  // chetlab o'tiladi, ichiga kirilmaydi.
  for (const bola of [...ildiz.children]) {
    if (bola.isLight || bola.isCamera) continue;
    if (interaktivmi(bola)) { otkazildi += 1; continue; }

    bola.traverse((o) => {
      if (!yaroqlimi(o)) return;
      const joy = new THREE.Vector3();
      o.getWorldPosition(joy);
      const kalit = [
        o.material.uuid,
        o.castShadow ? 1 : 0,
        o.receiveShadow ? 1 : 0,
        katakKaliti(joy),
      ].join("|");
      if (!chelaklar.has(kalit)) {
        chelaklar.set(kalit, {
          material: o.material,
          castShadow: o.castShadow,
          receiveShadow: o.receiveShadow,
          meshlar: [],
        });
      }
      chelaklar.get(kalit).meshlar.push(o);
    });
  }

  let birlashdi = 0;
  let guruh = 0;

  for (const [, chelak] of chelaklar) {
    if (chelak.meshlar.length < 2) continue;   // bitta mesh — foyda yo'q

    const geometriyalar = [];
    let xato = false;

    for (const m of chelak.meshlar) {
      try {
        const g = m.geometry.clone();
        m.updateMatrixWorld(true);
        g.applyMatrix4(m.matrixWorld);
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
    yangi.name = "Birlashgan_Harakatsiz";
    // Nishon uni "stansiya" deb o'ylamasin.
    yangi.userData.birlashtirma = true;
    // Bo'shatish uchun: bu geometriya birlashtirishda yaratilgan.
    yangi.userData.birlashganGeometriya = true;

    // Eskilarini olib tashlaymiz. Material umumiy — uni bo'shatmaymiz.
    for (const m of chelak.meshlar) {
      m.geometry?.dispose();
      m.parent?.remove(m);
      birlashdi += 1;
    }

    ildiz.add(yangi);
    guruh += 1;
  }

  return { birlashdi, guruh, otkazildi };
}
