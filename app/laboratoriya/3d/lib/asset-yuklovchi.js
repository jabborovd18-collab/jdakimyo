// app/laboratoriya/3d/lib/asset-yuklovchi.js
//
// BRIF-02 — 3D asset quvuri: `.glb` (ixtiyoriy Draco) + KTX2 tekstura.
//
// LOYIHADA ILGARI 0 TA ASSET BOR EDI. Butun laboratoriya protsedural
// primitivdan yasalgan va bu yo'lning sifat shifti bor: `CylinderGeometry`
// ni qancha silliqlamang, probirka haqiqiy bo'lmaydi — haqiqiylikni
// geometriya emas, TEKSTURA beradi.
//
// Bu modul bitta ish qiladi: modelni bir marta yuklaydi, keshlaydi va
// nusxasini beradi. Model kelmasa sahna YIQILMAYDI — chaqiruvchi
// protsedural zaxirada qoladi.
//
// UCH QOIDA (AGENTS.md 11.6):
//   1. Yuklovchi BITTA. Ikkinchi `GLTFLoader` yozilmaydi.
//   2. Har asset uchun `dispose()` yo'li bor.
//   3. Yangi asset qo'shishdan oldin hajmi yoziladi (LITSENZIYA.md).

import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

// Asset ro'yxati — YAGONA manba. Yo'l qo'lda yozilmaydi.
export const ASSETLAR = Object.freeze({
  stakan: "/3d/modellar/stakan.glb",
});

// Dekoderlar `public/3d/dekoder/` da o'z-o'zidan turadi (CDN emas).
// Ular FAQAT kerak bo'lganda yuklanadi: hozirgi modelda na Draco, na
// KTX2 bor, ya'ni tarmoqdan hech narsa tushmaydi.
const DRACO_YOLI = "/3d/dekoder/draco/";
const BASIS_YOLI = "/3d/dekoder/basis/";

let gltfYuklovchi = null;
let dracoYuklovchi = null;
let ktx2Yuklovchi = null;

// kalit -> THREE.Group (ASL nusxa; tashqariga hech qachon berilmaydi)
const kesh = new Map();
// kalit -> Promise (bir vaqtda ikki so'rov tarmoqqa ikki marta chiqmasin)
const jarayonda = new Map();

const holat = { jami: 0, yuklandi: 0, xato: 0 };

/**
 * Yuklovchini bir marta quradi.
 *
 * `renderer` ixtiyoriy: u faqat KTX2 uchun kerak (transkoder qurilma
 * qaysi siqilgan formatni qo'llashini so'raydi). Renderer berilmasa
 * `.glb` baribir yuklanadi — shuning uchun modul renderer tayyor
 * bo'lishini kutib turmaydi.
 */
function yuklovchiniOl(renderer) {
  if (!gltfYuklovchi) {
    gltfYuklovchi = new GLTFLoader();
    dracoYuklovchi = new DRACOLoader();
    dracoYuklovchi.setDecoderPath(DRACO_YOLI);
    gltfYuklovchi.setDRACOLoader(dracoYuklovchi);
  }
  if (renderer && !ktx2Yuklovchi) {
    ktx2Yuklovchi = new KTX2Loader();
    ktx2Yuklovchi.setTranscoderPath(BASIS_YOLI);
    ktx2Yuklovchi.detectSupport(renderer);
    gltfYuklovchi.setKTX2Loader(ktx2Yuklovchi);
  }
  return gltfYuklovchi;
}

/**
 * Modelni yuklaydi (yoki keshdan oladi) va NUSXA qaytaradi.
 *
 * Nusxa `clone()` bilan olinadi: geometriya va material ulashiladi,
 * ya'ni yigirmata stakan bitta geometriya ishlatadi. Aynan shu sabab
 * nusxadagi mesh `userData.assetdan = true` bilan belgilanadi —
 * jihoz sahnadan olib tashlanganda uning geometriyasi bo'shatilmasligi
 * kerak, aks holda qolgan o'n to'qqiztasi ham yo'q bo'lardi.
 *
 * @returns {Promise<THREE.Group|null>} xato bo'lsa `null` (sahna
 *   protsedural zaxirada qoladi va yiqilmaydi)
 */
export function modelOl(kalit, renderer) {
  const yol = ASSETLAR[kalit];
  if (!yol) return Promise.resolve(null);

  if (kesh.has(kalit)) return Promise.resolve(nusxaOl(kalit));
  if (jarayonda.has(kalit)) return jarayonda.get(kalit).then(() => nusxaOl(kalit));

  holat.jami += 1;
  const yuklovchi = yuklovchiniOl(renderer);
  const va = new Promise((bajar) => {
    yuklovchi.load(
      yol,
      (gltf) => {
        // Animatsiyalar HAM saqlanadi.
        //
        // Ilgari faqat `gltf.scene` keshlanardi va `gltf.animations`
        // tashlab yuborilardi. Bu kelajakdagi 3D qahramon uchun jim
        // to'siq edi: model yuklanardi, lekin yurish va turish
        // animatsiyasi yo'qolardi va sababi ko'rinmasdi.
        //
        // Hozirgi jihozlarda animatsiya yo'q, ya'ni bu o'zgarish
        // ularning xulqiga tegmaydi.
        kesh.set(kalit, {
          sahna: gltf.scene,
          animatsiyalar: gltf.animations || [],
        });
        holat.yuklandi += 1;
        jarayonda.delete(kalit);
        bajar(true);
      },
      undefined,
      (xato) => {
        // Ataylab jim emas, lekin ataylab YIQITMAYDI: chaqiruvchi
        // `null` oladi va protsedural modelda qoladi.
        console.warn(`3D asset yuklanmadi: ${yol}`, xato);
        holat.xato += 1;
        jarayonda.delete(kalit);
        bajar(false);
      },
    );
  });
  jarayonda.set(kalit, va);
  return va.then(() => nusxaOl(kalit));
}

function skeletlimi(ildiz) {
  let bor = false;
  ildiz.traverse((o) => {
    if (o.isSkinnedMesh || o.isBone) bor = true;
  });
  return bor;
}

function nusxaOl(kalit) {
  const yozuv = kesh.get(kalit);
  if (!yozuv) return null;
  const asl = yozuv.sahna;

  // SKELETLI MODEL UCHUN `clone()` YARAMAYDI.
  //
  // `Object3D.clone()` suyak havolalarini qayta bog'lamaydi: nusxa
  // ASL skeletga ishora qilib qoladi va ikkita qahramon bir xil
  // pozada qotib turadi yoki model buzilib ko'rinadi. three.js buning
  // uchun `SkeletonUtils.clone` beradi.
  //
  // Hozirgi assetlarda skelet yo'q, shuning uchun ular eski yo'ldan
  // ketadi va xulqi o'zgarmaydi. Shart kelajakdagi qahramon uchun
  // OLDINDAN qo'yildi — u kelganda bu nuqson jim buzilish bo'lib
  // chiqardi (model ko'rinadi, lekin qimirlamaydi).
  const nusxa = skeletlimi(asl) ? SkeletonUtils.clone(asl) : asl.clone(true);

  nusxa.traverse((o) => {
    if (o.isMesh) o.userData.assetdan = true;
  });
  return nusxa;
}

/**
 * Modelning animatsiya klipilari (`THREE.AnimationClip[]`).
 *
 * Model hali kelmagan bo'lsa bo'sh massiv. Klip nusxalanmaydi —
 * `AnimationMixer` uni o'zgartirmaydi, shuning uchun bir klipni bir
 * necha qahramon baham ko'rishi mumkin.
 */
export function animatsiyalarniOl(kalit) {
  return kesh.get(kalit)?.animatsiyalar || [];
}

/**
 * Keshdan SINXRON nusxa. Model hali kelmagan bo'lsa `null`.
 *
 * Nega kerak: `jihozYasa` sinxron va uni asinxron qilish butun tajriba
 * mantig'iga tarqalardi (BRIF-02 "Tegilmaydi"). Shuning uchun jihoz
 * avval protsedural yasaladi, model kelgach esa `assetlarniQollash`
 * uni joyida almashtiradi.
 */
export function modelKeshdan(kalit) {
  return nusxaOl(kalit);
}

/**
 * Sahnadagi jihozlarni keshdagi model bilan yaxshilaydi.
 *
 * Ish tartibi: zaxira (protsedural) shisha meshlari olib tashlanadi,
 * o'rniga model nusxasi qo'yiladi va uning materiali jihozning o'z
 * shisha materialiga almashtiriladi — shunda profil (transmission,
 * envMap) va fon ohangi saqlanadi.
 *
 * Idempotent: ikki marta chaqirilsa ikkinchisi hech narsa qilmaydi.
 */
export function assetlarniQollash(ildiz) {
  if (!ildiz) return 0;
  let almashdi = 0;
  ildiz.traverse((tugun) => {
    const kalit = tugun.userData?.assetKaliti;
    if (!kalit || tugun.userData.assetQollandi) return;
    const model = modelKeshdan(kalit);
    if (!model) return;

    const zaxiralar = [];
    tugun.traverse((o) => {
      if (o.userData?.zaxiraShisha) zaxiralar.push(o);
    });
    if (!zaxiralar.length) return;

    const shishaMat = zaxiralar[0].material;
    model.traverse((o) => {
      if (o.isMesh && shishaMat) o.material = shishaMat;
    });

    for (const z of zaxiralar) {
      z.geometry?.dispose();
      z.parent?.remove(z);
    }
    tugun.add(model);
    tugun.userData.assetQollandi = true;
    almashdi += 1;
  });
  return almashdi;
}

/** Yuklash holati — yuklash ekrani va o'lchagich uchun. */
export function assetHolati() {
  return { ...holat, keshda: kesh.size };
}

/**
 * Kesh va undagi barcha GPU resursini bo'shatadi.
 *
 * `useSahna` cleanup'iga ulanadi. Bo'shatilmasa xotira sizishi 3D da
 * darrov sezilmaydi — u 10 daqiqadan keyin tab'ni yiqitadi
 * (AGENTS.md 11.6).
 */
export function assetlarniTozala() {
  for (const yozuv of kesh.values()) {
    // Kesh yozuvi endi `{ sahna, animatsiyalar }`. Animatsiya klipi
    // GPU resursi emas — u faqat sonlar massivi, `dispose` talab
    // qilmaydi va Map tozalanganda yo'qoladi.
    yozuv.sahna.traverse((o) => {
      if (!o.isMesh) return;
      o.geometry?.dispose();
      const materiallar = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of materiallar) {
        if (!m) continue;
        for (const maydon of ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"]) {
          m[maydon]?.dispose?.();
        }
        m.dispose();
      }
    });
  }
  kesh.clear();
  jarayonda.clear();
  holat.jami = 0;
  holat.yuklandi = 0;
  holat.xato = 0;

  dracoYuklovchi?.dispose?.();
  ktx2Yuklovchi?.dispose?.();
  gltfYuklovchi = null;
  dracoYuklovchi = null;
  ktx2Yuklovchi = null;
}
