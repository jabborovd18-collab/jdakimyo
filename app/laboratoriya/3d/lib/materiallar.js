import * as THREE from "three";
import { RANGLAR } from "./sozlama.js";

// Materiallarni BIR MARTA yaratib, barcha modellarda qayta ishlatamiz.
// Nega: har bir idish uchun alohida material yasalsa, 20 ta idish bo'lganda GPU xotirasi
// va draw-call sarfi ortib, render sekinlashadi.
export function materiallarniYarat() {
  const shisha = new THREE.MeshPhysicalMaterial({
    color: RANGLAR.shisha,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.9,
    thickness: 0.4,
    ior: 1.5,
    side: THREE.DoubleSide,
  });

  // Kuchsiz qurilmalar va mobil telefonlar uchun arzon shisha materiali.
  // Nega: MeshPhysicalMaterial dagi transmission va ior hisob-kitobi mobil GPU da
  // juda qimmatga tushadi va FPS ni tushirib yuboradi.
  const shishaArzon = new THREE.MeshStandardMaterial({
    color: RANGLAR.shisha,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0,
    side: THREE.DoubleSide,
  });

  const metall = new THREE.MeshStandardMaterial({
    color: RANGLAR.metall,
    roughness: 0.3,
    metalness: 0.85,
  });

  const chinni = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.6,
    metalness: 0.05,
  });

  const yogoch = new THREE.MeshStandardMaterial({
    color: RANGLAR.stol,
    roughness: 0.8,
    metalness: 0.1,
  });

  const rezina = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.9,
    metalness: 0,
  });

  return {
    shisha,
    shishaArzon,
    metall,
    chinni,
    yogoch,
    rezina,
  };
}

// Har bir yangi aralashma (eritma) uchun dinamik material yaratish funksiyasi.
// Nega suyuqlik materiali alohida yaratiladi: har bir idish ichidagi moddalarning
// hajmi va rangi o'ziga xos bo'lgani uchun uning rangi va shaffofligi alohida o'zgaradi.
export function suyuqlikYasa(rang = 0xffffff, shaffoflik = 0.7, arzon = false) {
  if (arzon) {
    return new THREE.MeshStandardMaterial({
      color: rang,
      transparent: true,
      opacity: Math.min(1.0, Math.max(0.1, shaffoflik)),
      roughness: 0.2,
      side: THREE.DoubleSide,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    color: rang,
    transparent: true,
    opacity: Math.min(1.0, Math.max(0.1, shaffoflik)),
    roughness: 0.08,
    transmission: 0.55,
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
      material.dispose();
    }
  });
}