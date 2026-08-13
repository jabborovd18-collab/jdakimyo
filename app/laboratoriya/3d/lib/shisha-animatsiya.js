// app/laboratoriya/3d/lib/shisha-animatsiya.js
//
// 3-MUAMMO DASTURI: Devor shkaflaridagi reagent shishalarini sinov idishiga
// parabolik traektoriya bo'ylab silliq uchirib keltirish va qaytarish dvigateli.
//
import * as THREE from "three";
import { tiqinOchilishi, shishaUrilishi } from "./ovoz.js";

let faolUchishAnimatsiyasi = null;

/**
 * Devor javonidagi shishani ishchi stoldagi aktiv probirka/kolba ustiga silliq uchirib keltirish.
 *
 * @param {THREE.Group} shishaGroup - Tanlangan 3D reagent shishasi
 * @param {THREE.Group} nishonGroup - Stoldagi maqsadli probirka/kolba
 * @param {Function} [onYetibKeldi] - Shisha og'ziga yetib kelganda chaqiriluvchi callback
 */
export function shishaniUchiribKeltir(shishaGroup, nishonGroup, onYetibKeldi) {
  if (!shishaGroup || !nishonGroup) return null;

  if (faolUchishAnimatsiyasi) {
    cancelAnimationFrame(faolUchishAnimatsiyasi);
    faolUchishAnimatsiyasi = null;
  }

  const startPos = shishaGroup.position.clone();
  const ogizY = nishonGroup.userData?.ogizBalandligi || 0.28;
  const targetPos = new THREE.Vector3(
    nishonGroup.position.x + 0.14,
    nishonGroup.position.y + ogizY + 0.12,
    nishonGroup.position.z
  );

  const davomiylik = 580; // ms
  const boshlanishVaqti = performance.now();

  const animatsiya = (hozir) => {
    const otgan = hozir - boshlanishVaqti;
    const progress = Math.min(1.0, otgan / davomiylik);

    // Smooth cubic ease-out
    const ease = 1 - Math.pow(1 - progress, 3);

    shishaGroup.position.x = THREE.MathUtils.lerp(startPos.x, targetPos.x, ease);
    shishaGroup.position.z = THREE.MathUtils.lerp(startPos.z, targetPos.z, ease);
    // Parabolik balandlik yoyi (kamida +0.35m tepaga ko'tarilib stollarni aylanib o'tadi)
    shishaGroup.position.y = THREE.MathUtils.lerp(startPos.y, targetPos.y, ease) + Math.sin(progress * Math.PI) * 0.35;

    // Burchakni to'g'rilash
    shishaGroup.rotation.z = THREE.MathUtils.lerp(shishaGroup.rotation.z, 0, ease);

    if (progress < 1.0) {
      faolUchishAnimatsiyasi = requestAnimationFrame(animatsiya);
    } else {
      shishaGroup.position.copy(targetPos);
      shishaGroup.rotation.set(0, 0, 0);
      shishaGroup.userData.stolUstida = true;
      faolUchishAnimatsiyasi = null;

      // Tiqinni ochish (pop up)
      if (shishaGroup.userData?.qopqoqMesh) {
        const aslY = shishaGroup.userData.aslQopqoqY || 0.1;
        shishaGroup.userData.qopqoqMesh.position.y = aslY + 0.035;
      }
      tiqinOchilishi();

      if (typeof onYetibKeldi === "function") {
        onYetibKeldi(shishaGroup);
      }
    }
  };

  faolUchishAnimatsiyasi = requestAnimationFrame(animatsiya);
}

/**
 * Reagent shishasining tiqinini yopib, uni o'z devor javonidagi joyiga qaytarish.
 *
 * @param {THREE.Group} shishaGroup - Reagent shishasi
 * @param {Function} [onJoyigaQaytdi] - Javonga o'tirganda chaqiriluvchi callback
 */
export function shishaniJavongaQaytar(shishaGroup, onJoyigaQaytdi) {
  if (!shishaGroup) return null;

  if (faolUchishAnimatsiyasi) {
    cancelAnimationFrame(faolUchishAnimatsiyasi);
    faolUchishAnimatsiyasi = null;
  }

  // Tiqinni yopish
  if (shishaGroup.userData?.qopqoqMesh) {
    const aslY = shishaGroup.userData.aslQopqoqY || 0.1;
    shishaGroup.userData.qopqoqMesh.position.y = aslY;
  }
  shishaUrilishi(2200);

  shishaGroup.rotation.set(0, 0, 0);

  const startPos = shishaGroup.position.clone();
  const targetPos = shishaGroup.userData.aslPos || new THREE.Vector3(0, 1.65, -5.25);

  const davomiylik = 580; // ms
  const boshlanishVaqti = performance.now();

  const animatsiya = (hozir) => {
    const otgan = hozir - boshlanishVaqti;
    const progress = Math.min(1.0, otgan / davomiylik);

    const ease = 1 - Math.pow(1 - progress, 3);

    shishaGroup.position.x = THREE.MathUtils.lerp(startPos.x, targetPos.x, ease);
    shishaGroup.position.z = THREE.MathUtils.lerp(startPos.z, targetPos.z, ease);
    shishaGroup.position.y = THREE.MathUtils.lerp(startPos.y, targetPos.y, ease) + Math.sin(progress * Math.PI) * 0.35;

    if (progress < 1.0) {
      faolUchishAnimatsiyasi = requestAnimationFrame(animatsiya);
    } else {
      shishaGroup.position.copy(targetPos);
      shishaGroup.rotation.set(0, 0, 0);
      shishaGroup.userData.stolUstida = false;
      faolUchishAnimatsiyasi = null;

      // Javonga qonishi ovozi
      shishaUrilishi(2600);

      if (typeof onJoyigaQaytdi === "function") {
        onJoyigaQaytdi(shishaGroup);
      }
    }
  };

  faolUchishAnimatsiyasi = requestAnimationFrame(animatsiya);
}
