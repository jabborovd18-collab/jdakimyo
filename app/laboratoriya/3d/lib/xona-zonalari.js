// app/laboratoriya/3d/lib/xona-zonalari.js
//
// 4-BOSQICH: Laboratoriya xonasi zonalari va kinematik kamera navigatsiyasi.
//
import * as THREE from "three";

/** 5 ta asosiy laboratoriya zonalari konfiguratsiyasi */
export const XONA_ZONALARI = {
  asosiy: {
    kalit: "asosiy",
    nom: "Asosiy Tajriba Stoli",
    tavsif: "Probirkalar, kolbalar, spirtovka va reaksiyalar maydoni",
    ikon: "kolba",
    kamera: [0, 1.55, 2.3],
    nishon: [0, 0.95, 0],
    fov: 45,
  },
  tarozi: {
    kalit: "tarozi",
    nom: "Analitik Tarozi Stoli",
    tavsif: "Qattiq moddalarni tortish va o'lchov kolbasida eritma tayyorlash",
    ikon: "orin",
    kamera: [-1.15, 1.35, 1.05],
    nishon: [-0.95, 0.96, 0.15],
    fov: 40,
  },
  titrlash: {
    kalit: "titrlash",
    nom: "Byuretka va Titrlash Stendi",
    tavsif: "50 ml li shisha byuretka, kislota-ishqor va redoks volumetrik tahlili",
    ikon: "atom",
    kamera: [0.75, 1.48, 1.15],
    nishon: [0.65, 1.05, 0.1],
    fov: 40,
  },
  elektroliz: {
    kalit: "elektroliz",
    nom: "Elektroliz va Tok Manbai",
    tavsif: "Faradey qonunlari, katod/anod jarayonlari va galvanik qoplama",
    ikon: "chaqmoq",
    kamera: [1.25, 1.45, 0.55],
    nishon: [1.05, 0.98, -0.05],
    fov: 40,
  },
  tortma_shkaf: {
    kalit: "tortma_shkaf",
    nom: "Tortma Shkaf (Fume Hood)",
    tavsif: "Zaharli gazlar va konsentrlangan kislotalar bilan xavfsiz ishlash kamerasi",
    ikon: "qalqon",
    kamera: [1.15, 1.42, 0.95],
    nishon: [0.95, 1.02, -0.1],
    fov: 42,
  },
  javon: {
    kalit: "javon",
    nom: "Reagentlar Javoni",
    tavsif: "3D javondagi barcha moddalar, kislotalar, ishqorlar va tuzlar",
    ikon: "kitob",
    kamera: [0, 1.35, 0.25],
    nishon: [0, 1.18, -1.05],
    fov: 48,
  },
  davriy_jadval: {
    kalit: "davriy_jadval",
    nom: "Davriy Jadval (IUPAC)",
    tavsif: "Devordagi yuqori aniqlikdagi D.I. Mendeleyev Davriy Sistemasi",
    ikon: "atom",
    kamera: [0, 2.2, -0.4],
    nishon: [0, 2.1, -2.35],
    fov: 46,
  },
  yuvinish: {
    kalit: "yuvinish",
    nom: "Yuvinish va Tozalash",
    tavsif: "Distillangan suv krani, idishlarni tozalash va xavfsizlik rakovinasi",
    ikon: "ochir",
    kamera: [-1.1, 1.45, -0.2],
    nishon: [-0.9, 0.95, -0.85],
    fov: 45,
  },
};

/**
 * Kamerani berilgan zonaga silliq uchirib o'tkazish dvigateli.
 *
 * @param {THREE.Camera} kamera - Three.js kamerasi
 * @param {OrbitControls} controls - OrbitControls obyekti
 * @param {string} zonaKaliti - 'asosiy' | 'tarozi' | 'tortma_shkaf' | 'javon' | 'yuvinish'
 * @param {function} [onYakunlandi] - Animatsiya tugaganda chaqiriluvchi callback
 */
export function zonagaOt(kamera, controls, zonaKaliti = "asosiy", onYakunlandi = null) {
  const zona = XONA_ZONALARI[zonaKaliti] || XONA_ZONALARI.asosiy;
  if (!kamera || !controls) return null;

  const startPos = kamera.position.clone();
  const endPos = new THREE.Vector3(...zona.kamera);

  const startTarget = controls.target.clone();
  const endTarget = new THREE.Vector3(...zona.nishon);

  const davomiylik = 1.1; // soniya
  const boshlanishVaqti = performance.now();
  let kadrId = null;

  const animatsiya = (hozir) => {
    const otgan = (hozir - boshlanishVaqti) / 1000;
    const progress = Math.min(1.0, otgan / davomiylik);

    // Smooth cubic ease-out
    const ease = 1 - Math.pow(1 - progress, 3);

    kamera.position.lerpVectors(startPos, endPos, ease);
    controls.target.lerpVectors(startTarget, endTarget, ease);
    controls.update();

    if (progress < 1.0) {
      kadrId = requestAnimationFrame(animatsiya);
    } else {
      kamera.position.copy(endPos);
      controls.target.copy(endTarget);
      controls.update();
      if (typeof onYakunlandi === "function") onYakunlandi(zona);
    }
  };

  kadrId = requestAnimationFrame(animatsiya);

  return {
    toxtat() {
      if (kadrId) cancelAnimationFrame(kadrId);
    },
  };
}
