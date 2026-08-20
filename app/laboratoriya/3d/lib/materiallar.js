import * as THREE from "three";
import { SAHNA_FONI } from "./fonlar.js";
import {
  yogochTeksturasi,
  polTeksturasi,
  devorTeksturasi,
} from "./protsedural-tekstura.js";

// Materiallarni BIR MARTA yaratib, barcha modellarda qayta ishlatamiz.
// Nega: har bir idish uchun alohida material yasalsa, 20 ta idishda GPU
// xotirasi va draw-call sarfi ortadi. Profil shu umumiy to'plamda saqlanadi,
// shunda ichki jihozlar ham ikkinchi sifat booleanini yaratmaydi.
export function materiallarniYarat(profil) {
  if (!profil) throw new Error("Materiallar uchun sifat profili berilmadi");

  const fon = SAHNA_FONI;
  const muhitKuchi = fon.muhitKuchi;
  const tekstura = profil.teksturaOlchami;

  // Profilning `transmission` maydoni eski arzon/to'liq shisha tanlovining
  // aynan o'zi. Qiymatlar bu brifda o'zgarmaydi.
  const shisha = profil.transmission
    ? new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.88,
        roughness: 0.04,
        metalness: 0.02,
        transmission: 0.82,
        thickness: 0.06,
        ior: 1.52,
        specularIntensity: 1.0,
        specularColor: new THREE.Color(0xffffff),
        clearcoat: 1.0,
        clearcoatRoughness: 0.03,
        attenuationColor: new THREE.Color(0xdbeafe),
        attenuationDistance: 1.2,
        envMapIntensity: 1.4,
        side: THREE.DoubleSide,
      })
    : new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.42,
        roughness: 0.08,
        metalness: 0.1,
        envMapIntensity: 1.2,
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
    map: yogochTeksturasi(fon.stol, tekstura.yogoch),
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
    map: polTeksturasi(fon.pol, 4, tekstura.pol),
  });
  pol.map.wrapS = THREE.RepeatWrapping;
  pol.map.wrapT = THREE.RepeatWrapping;
  pol.map.repeat.set(4, 3);

  const devor = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0.0,
    map: devorTeksturasi(fon.devor, tekstura.devor),
  });
  devor.map.wrapS = THREE.RepeatWrapping;
  devor.map.wrapT = THREE.RepeatWrapping;
  devor.map.repeat.set(6, 4);

  // Eski mavzu effekti sahna tayyor bo'lgach aynan shu qiymatlarni
  // o'rnatardi. Endi ko'rinish qat'iy, shuning uchun o'sha yakuniy holat
  // bir marta shu yerda qo'llanadi; hech bir material parametri sozlanmadi.
  shisha.color.setHex(fon.shisha);
  shisha.envMapIntensity = muhitKuchi;
  metall.envMapIntensity = muhitKuchi;
  chinni.envMapIntensity = muhitKuchi;
  yogoch.envMapIntensity = muhitKuchi * 0.6;
  rezina.envMapIntensity = muhitKuchi * 0.4;
  pol.envMapIntensity = muhitKuchi * 0.35;

  return {
    shisha,
    metall,
    chinni,
    yogoch,
    rezina,
    pol,
    devor,
    profil,
  };
}

// Har bir yangi aralashma (eritma) uchun dinamik material yaratish funksiyasi.
// Nega alohida: har bir idish tarkibining rangi va shaffofligi mustaqil
// o'zgaradi. `emissive` qorong'i sahnada to'q moddani fondan ajratadi,
// lekin neon darajasida emas. `transmission` umumiy profildan keladi;
// ikkinchi sifat booleaniga ehtiyoj yo'q.
export function suyuqlikYasa(
  rang = 0xffffff,
  shaffoflik = 0.7,
  transmission = true,
) {
  const ochiqlik = Math.min(1.0, Math.max(0.1, shaffoflik));

  if (!transmission) {
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
    // Yuqoriroq transmission eritma rangini yuvib yuboradi.
    transmission: 0.3,
    ior: 1.33,
    side: THREE.DoubleSide,
  });
}

// Yaratilgan barcha materiallarni GPU xotirasidan tozalash. Unmountda
// dispose bo'lmasa, qayta kirishda WebGL xotirasi yig'ilib boradi.
export function materiallarniTozala(materiallar) {
  if (!materiallar) return;

  Object.values(materiallar).forEach((material) => {
    if (material && typeof material.dispose === "function") {
      if (material.map && typeof material.map.dispose === "function") {
        material.map.dispose();
      }
      material.dispose();
    }
  });
}
