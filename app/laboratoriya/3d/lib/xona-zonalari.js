// app/laboratoriya/3d/lib/xona-zonalari.js
//
// 4-BOSQICH: Laboratoriya xonasi zonalari va kinematik kamera navigatsiyasi.
//
import * as THREE from "three";
import { XONA, xonaChegarasi } from "./sozlama.js";
import { JAVON_QATORLARI } from "./javon-3d.js";

// Zona kameralari xona o'lchamiga bog'liq. Qattiq yozilganda xona
// kattalashishi bilan ular javonga emas, bo'sh devorga qarab qolardi.
// Javon qatorlarining joyi `javon-3d.js` dan keladi — yagona manba.
const CHEGARA = xonaChegarasi();
const QATOR = JAVON_QATORLARI();

/** 9 ta asosiy laboratoriya zonalari konfiguratsiyasi */
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
  kislota_javon: {
    kalit: "kislota_javon",
    nom: "Kislotalar Shkafi",
    tavsif: "Orqa devordagi 500ml kislotalar va oksidlovchilar shkafi",
    ikon: "chaqmoq",
    kamera: [-QATOR.orqaMarkaz, 1.85, QATOR.orqaZ + 1.75],
    nishon: [-QATOR.orqaMarkaz, 1.65, QATOR.orqaZ],
    fov: 46,
  },
  ishqor_javon: {
    kalit: "ishqor_javon",
    nom: "Ishqorlar Shkafi",
    tavsif: "Orqa devordagi 500ml ishqorlar va asoslar shkafi",
    ikon: "kolba",
    kamera: [QATOR.orqaMarkaz, 1.85, QATOR.orqaZ + 1.75],
    nishon: [QATOR.orqaMarkaz, 1.65, QATOR.orqaZ],
    fov: 46,
  },
  tuz_javon: {
    kalit: "tuz_javon",
    nom: "Tuzlar Shkafi",
    tavsif: "O'ng devordagi qattiq tuzlar va reaktivlar javoni",
    ikon: "doska",
    kamera: [QATOR.ongX - 1.8, 1.85, -1.5],
    nishon: [QATOR.ongX, 1.65, -1.5],
    fov: 46,
  },
  eritma_javon: {
    kalit: "eritma_javon",
    nom: "Eritmalar & Indikatorlar",
    tavsif: "O'ng devordagi standart eritmalar va indikatorlar javoni",
    ikon: "kitob",
    kamera: [QATOR.ongX - 1.8, 1.85, 0.8],
    nishon: [QATOR.ongX, 1.65, 0.8],
    fov: 46,
  },
  tarozi: {
    kalit: "tarozi",
    nom: "Chap Stol: Analitik Tarozi",
    tavsif: "Qattiq moddalarni 0.001g aniqlikda tortish va molyar eritmalar",
    ikon: "orin",
    kamera: [-3.2, 1.45, 1.4],
    nishon: [-3.2, 0.98, 0.2],
    fov: 42,
  },
  titrlash: {
    kalit: "titrlash",
    nom: "O'ng Stol: Byuretka & Titrlash",
    tavsif: "50 ml li shisha byuretka va kislota-ishqor volumetrik tahlili",
    ikon: "atom",
    kamera: [3.2, 1.48, 1.6],
    nishon: [3.2, 1.05, 0.4],
    fov: 42,
  },
  elektroliz: {
    kalit: "elektroliz",
    nom: "O'ng Stol: Elektroliz Stendi",
    tavsif: "Faradey qonunlari, katod/anod jarayonlari va tok manbai",
    ikon: "chaqmoq",
    kamera: [3.2, 1.45, 0.6],
    nishon: [3.2, 0.98, -0.6],
    fov: 42,
  },
  yuvinish: {
    kalit: "yuvinish",
    nom: "Yuvinish Rakovinasi",
    tavsif: "Distillangan suv krani va idishlarni 100% yuvib tozalash stansiyasi",
    ikon: "ochiq",
    kamera: [-(XONA.eni / 2 - 2.5), 1.55, CHEGARA.zMin + 2.2],
    nishon: [-(XONA.eni / 2 - 2.5), 0.98, CHEGARA.zMin + 0.8],
    fov: 44,
  },
  davriy_jadval: {
    kalit: "davriy_jadval",
    nom: "Davriy Jadval (IUPAC)",
    tavsif: "Devordagi yuqori aniqlikdagi D.I. Mendeleyev Davriy Sistemasi",
    ikon: "atom",
    kamera: [0, 2.3, CHEGARA.zMin + 2.4],
    nishon: [0, 2.45, CHEGARA.zMin + 0.2],
    fov: 50,
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
