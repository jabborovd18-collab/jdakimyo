import * as THREE from "three";
import { RANGLAR } from "./sozlama.js";
import { fonOl } from "./fonlar.js";
import { yogochTeksturasi, polTeksturasi, devorTeksturasi } from "./protsedural-tekstura.js";

// Materiallarni BIR MARTA yaratib, barcha modellarda qayta ishlatamiz.
// Nega: har bir idish uchun alohida material yasalsa, 20 ta idish bo'lganda GPU xotirasi
// va draw-call sarfi ortib, render sekinlashadi.
//
// `fonKaliti` — tanlangan fon mavzusi (fonlar.js). Shisha va stol rangi
// fonga bog'liq: oq fonda och-havorang shisha ham, to'q binafsha stol ham
// o'rinsiz ko'rinadi.
//
// `arzonRejim` — kuchsiz qurilma aniqlanganda true. Ilgari bu yerda
// `shishaArzon` degan ikkinchi material yaratilardi, lekin uni HECH KIM
// chaqirmasdi: jihoz-modellari.js har doim `materiallar.shisha` ni olardi.
// Ya'ni arzon rejim shishaga umuman ta'sir qilmagan. Endi qaysi material
// yaratilishi shu yerda hal bo'ladi va chaqiruvchi tomon o'zgarmaydi.
export function materiallarniYarat(fonKaliti, arzonRejim = false) {
  const fon = fonOl(fonKaliti);
  const muhitKuchi = fon.muhitKuchi ?? 0.8;

  // Ultra-aniq Borosilikat Laboratoriya Shishasi (High-Fidelity Pyrex Glass Material)
  const shisha = arzonRejim
    ? new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.42,
        roughness: 0.08,
        metalness: 0.1,
        envMapIntensity: 1.2,
        side: THREE.DoubleSide,
      })
    : new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.88,
        roughness: 0.04,
        metalness: 0.02,
        transmission: 0.82, // Optimal shaffoflik: shisha chegaralari va yaltirashi aniq ko'rinadi
        thickness: 0.06,
        ior: 1.52, // Borosilikat laboratoriya shishasi sindirish ko'rsatkichi
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        attenuationColor: new THREE.Color(0xdbeafe),
        attenuationDistance: 1.2,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      });

  const metall = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.25,
    metalness: 0.9,
    envMapIntensity: 1.2,
  });

  const chinni = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.2,
    metalness: 0.05,
    envMapIntensity: 0.9,
  });

  const yogoch = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.65,
    metalness: 0.1,
    envMapIntensity: 0.7,
    // Yog'och guli protsedural teksturadan (protsedural-tekstura.js) —
    // `color` oq qoldiriladi, chunki rangni teksturaning o'zi olib keladi.
    map: yogochTeksturasi(fon.stol),
  });
  yogoch.map.wrapS = THREE.RepeatWrapping;
  yogoch.map.wrapT = THREE.RepeatWrapping;
  yogoch.map.repeat.set(3, 1);

  const rezina = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.05,
  });

  const pol = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.15,
    envMapIntensity: 0.5,
    map: polTeksturasi(fon.pol ?? fon.fon),
  });
  pol.map.wrapS = THREE.RepeatWrapping;
  pol.map.wrapT = THREE.RepeatWrapping;
  pol.map.repeat.set(4, 3);

  const devor = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.0,
    map: devorTeksturasi(fon.devor ?? fon.fon),
  });
  devor.map.wrapS = THREE.RepeatWrapping;
  devor.map.wrapT = THREE.RepeatWrapping;
  devor.map.repeat.set(6, 4);

  return {
    shisha,
    metall,
    chinni,
    yogoch,
    rezina,
    pol,
    devor,
    arzon: arzonRejim,
  };
}

// Fon mavzusi almashganda sahnani qaytadan qurmasdan materiallarni yangilash.
// Nega qayta qurilmaydi: idishdagi eritma, quyilgan hajm va jurnal sahna
// ichida yashaydi — sahna o'chirilsa foydalanuvchining butun tajribasi
// yo'qolardi va fon tanlash "hammasini boshdan boshlash" degani bo'lardi.
export function materiallarniFongaMoslash(materiallar, fonKaliti) {
  if (!materiallar) return;
  const fon = fonOl(fonKaliti);
  const muhitKuchi = fon.muhitKuchi ?? 0.5;

  materiallar.shisha?.color.setHex(fon.shisha);

  // Teksturali materiallar rangni teksturadan oladi (color oq), shuning uchun
  // fon almashganda teksturalar qayta yaratiladi — aks holda eski mavzuning
  // rangi qolib ketardi.
  if (materiallar.yogoch) {
    materiallar.yogoch.color.setHex(0xffffff);
    materiallar.yogoch.map?.dispose();
    materiallar.yogoch.map = yogochTeksturasi(fon.stol);
    materiallar.yogoch.map.wrapS = THREE.RepeatWrapping;
    materiallar.yogoch.map.wrapT = THREE.RepeatWrapping;
    materiallar.yogoch.map.repeat.set(3, 1);
    materiallar.yogoch.needsUpdate = true;
  }

  if (materiallar.pol) {
    materiallar.pol.color.setHex(0xffffff);
    materiallar.pol.map?.dispose();
    materiallar.pol.map = polTeksturasi(fon.pol ?? fon.fon);
    materiallar.pol.map.wrapS = THREE.RepeatWrapping;
    materiallar.pol.map.wrapT = THREE.RepeatWrapping;
    materiallar.pol.map.repeat.set(4, 3);
    materiallar.pol.needsUpdate = true;
  }

  if (materiallar.devor) {
    materiallar.devor.color.setHex(0xffffff);
    materiallar.devor.map?.dispose();
    materiallar.devor.map = devorTeksturasi(fon.devor ?? fon.fon);
    materiallar.devor.map.wrapS = THREE.RepeatWrapping;
    materiallar.devor.map.wrapT = THREE.RepeatWrapping;
    materiallar.devor.map.repeat.set(6, 4);
    materiallar.devor.needsUpdate = true;
  }

  // Muhit xaritasining kuchi ham mavzu bilan birga o'zgaradi: qorong'u
  // sahnada to'liq kuch bersak, idishlar fonda sun'iy yaltirab turadi.
  if (materiallar.shisha) materiallar.shisha.envMapIntensity = muhitKuchi;
  if (materiallar.metall) materiallar.metall.envMapIntensity = muhitKuchi;
  if (materiallar.chinni) materiallar.chinni.envMapIntensity = muhitKuchi;
  if (materiallar.yogoch) materiallar.yogoch.envMapIntensity = muhitKuchi * 0.6;
  if (materiallar.rezina) materiallar.rezina.envMapIntensity = muhitKuchi * 0.4;
  if (materiallar.pol) materiallar.pol.envMapIntensity = muhitKuchi * 0.35;
}

// Har bir yangi aralashma (eritma) uchun dinamik material yaratish funksiyasi.
// Nega suyuqlik materiali alohida yaratiladi: har bir idish ichidagi moddalarning
// hajmi va rangi o'ziga xos bo'lgani uchun uning rangi va shaffofligi alohida o'zgaradi.
//
// `emissive` ataylab qo'shilgan: eritma rangi faqat tushayotgan yorug'likka
// bog'liq bo'lsa, qorong'i sahnada CuO yoki I₂ kabi to'q moddalar fon bilan
// qo'shilib ketardi. Kuchsiz o'z-o'zidan yorishish rangni har qanday fonda
// ajratib turadi, lekin neon effekt bermaydi.
export function suyuqlikYasa(rang = 0xffffff, shaffoflik = 0.7, arzon = false) {
  const ochiqlik = Math.min(1.0, Math.max(0.1, shaffoflik));

  if (arzon) {
    return new THREE.MeshStandardMaterial({
      color: rang,
      emissive: rang,
      emissiveIntensity: 0.18,
      transparent: true,
      opacity: ochiqlik,
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: rang,
    emissive: rang,
    emissiveIntensity: 0.15,
    transparent: true,
    opacity: ochiqlik,
    roughness: 0.08,
    // Ilgari 0.55 edi: yuqori transmission rangni yuvib yuborardi va
    // ko'k CuSO₄ ham deyarli rangsiz ko'rinardi.
    transmission: 0.3,
    ior: 1.33,
    side: THREE.DoubleSide,
  });
}

// Yaratilgan barcha materiallarni GPU xotirasidan tozalash.
// Nega: useEffect unmount bo'lganda dispose() qilinmasa, WebGL kontekstida xotira sizishi
// (memory leak) yuz beradi.
export function materiallarniTozala(materiallar) {
  if (!materiallar) return;

  Object.values(materiallar).forEach((material) => {
    if (material && typeof material.dispose === "function") {
      // Material ichidagi protsedural teksturalar ham bo'shatiladi — aks holda
      // GPU xotirasi fon almashganda yoki unmount bo'lganda sizib borardi.
      if (material.map && typeof material.map.dispose === "function") {
        material.map.dispose();
      }
      material.dispose();
    }
  });
}
