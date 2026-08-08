import * as THREE from "three";
import { RANGLAR } from "./sozlama.js";
import { fonOl } from "./fonlar.js";

// Materiallarni BIR MARTA yaratib, barcha modellarda qayta ishlatamiz.
// Nega: har bir idish uchun alohida material yasalsa, 20 ta idish bo'lganda GPU xotirasi
// va draw-call sarfi ortib, render sekinlashadi.
//
// `fonKaliti` — tanlangan fon mavzusi (fonlar.js). Shisha va stol rangi
// fonga bog'liq: oq fonda och-havorang shisha ham, to'q binafsha stol ham
// o'rinsiz ko'rinadi.
export function materiallarniYarat(fonKaliti) {
  const fon = fonOl(fonKaliti);

  const shisha = new THREE.MeshPhysicalMaterial({
    color: fon.shisha,
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
    color: fon.shisha,
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
    color: fon.stol,
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

// Fon mavzusi almashganda sahnani qaytadan qurmasdan materiallarni yangilash.
// Nega qayta qurilmaydi: idishdagi eritma, quyilgan hajm va jurnal sahna
// ichida yashaydi — sahna o'chirilsa foydalanuvchining butun tajribasi
// yo'qolardi va fon tanlash "hammasini boshdan boshlash" degani bo'lardi.
export function materiallarniFongaMoslash(materiallar, fonKaliti) {
  if (!materiallar) return;
  const fon = fonOl(fonKaliti);

  materiallar.shisha?.color.setHex(fon.shisha);
  materiallar.shishaArzon?.color.setHex(fon.shisha);
  materiallar.yogoch?.color.setHex(fon.stol);
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
      material.dispose();
    }
  });
}