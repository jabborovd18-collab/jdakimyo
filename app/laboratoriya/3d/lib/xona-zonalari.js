// app/laboratoriya/3d/lib/xona-zonalari.js
//
// 4-BOSQICH: Laboratoriya xonasi zonalari va kinematik kamera navigatsiyasi.
//
import * as THREE from "three";

/** 8 ta asosiy laboratoriya zonalari konfiguratsiyasi */
export const XONA_ZONALARI = {
  asosiy: {
    kalit: "asosiy",
    nom: "Asosiy Tajriba Stoli",
    tavsif: "Probirkalar, kolbalar, spirtovka va erkin tajribalar maydoni",
    ikon: "kolba",
    kamera: [0, 1.55, 2.3],
    nishon: [0, 0.95, 0.3],
    fov: 45,
  },
  javon: {
    kalit: "javon",
    nom: "Markaziy Orol Javoni",
    tavsif: "3D javondagi barcha kislota, ishqor va tuzlar shishalari",
    ikon: "kitob",
    kamera: [0, 1.42, 0.25],
    nishon: [0, 1.2, -0.95],
    fov: 48,
  },
  tarozi: {
    kalit: "tarozi",
    nom: "Chap Stol: Analitik Tarozi",
    tavsif: "Qattiq moddalarni 0.001g aniqlikda tortish va molyar eritmalar",
    ikon: "orin",
    kamera: [-1.6, 1.42, 1.15],
    nishon: [-1.6, 0.96, 0.2],
    fov: 42,
  },
  titrlash: {
    kalit: "titrlash",
    nom: "O'ng Stol: Byuretka & Titrlash",
    tavsif: "50 ml li shisha byuretka va kislota-ishqor volumetrik tahlili",
    ikon: "atom",
    kamera: [1.4, 1.48, 1.15],
    nishon: [1.4, 1.05, 0.2],
    fov: 42,
  },
  elektroliz: {
    kalit: "elektroliz",
    nom: "O'ng Stol: Elektroliz Stendi",
    tavsif: "Faradey qonunlari, katod/anod jarayonlari va tok manbai",
    ikon: "chaqmoq",
    kamera: [1.4, 1.45, 0.35],
    nishon: [1.4, 0.98, -0.6],
    fov: 42,
  },
  tortma_shkaf: {
    kalit: "tortma_shkaf",
    nom: "Tortma Shkaf (Fume Hood)",
    tavsif: "Zaharli gazlar va konsentrlangan kislotalar bilan ishlash kamerasi",
    ikon: "qalqon",
    kamera: [2.4, 1.5, -0.7],
    nishon: [2.4, 1.1, -1.8],
    fov: 42,
  },
  davriy_jadval: {
    kalit: "davriy_jadval",
    nom: "Davriy Jadval (IUPAC)",
    tavsif: "Devordagi yuqori aniqlikdagi D.I. Mendeleyev Davriy Sistemasi",
    ikon: "atom",
    kamera: [0, 2.3, -0.3],
    nishon: [0, 2.45, -2.36],
    fov: 48,
  },
  yuvinish: {
    kalit: "yuvinish",
    nom: "Yuvinish Rakovinasi",
    tavsif: "Distillangan suv krani va idishlarni tozalash rakovinasi",
    ikon: "ochir",
    kamera: [-2.4, 1.45, -0.8],
    nishon: [-2.4, 0.95, -1.8],
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
