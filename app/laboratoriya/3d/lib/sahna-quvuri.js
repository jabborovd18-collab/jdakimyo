// Sahna QUVURI — scene, kamera, renderer, kompozitor, boshqaruv va
// materiallar. Chizish uchun kerak bo'lgan hamma narsa, lekin
// sahnaning MAZMUNI emas (u `sahna-mazmuni.js` da).
//
// `useSahna.js` dan ajratildi (BRIF-05).
//
// NEGA REF EMAS, QIYMAT QAYTARADI: modul React ni bilmasligi kerak.
// Ref larni hook o'zi belgilaydi — shunda bu fayl sahifasiz, oddiy
// funksiya sifatida ham chaqirilishi mumkin.

import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";

import { KAMERA, BOSHQARUV } from "./sozlama.js";
import { materiallarniYarat } from "./materiallar.js";
import { SAHNA_FONI } from "./fonlar.js";
import { shaharManzarasiniYarat } from "./manzara.js";
import { yoruglikniQur } from "./yoruglik.js";

export function quvurniQur(konteyner, profil, { olcham = false } = {}) {
  const fon = SAHNA_FONI;

  // 1. Sahna
  const scene = new THREE.Scene();
  // Deraza ortidagi tungi shahar. Xona to'rt devor bilan yopiq, ya'ni
  // fon FAQAT deraza teshiklaridan ko'rinadi — qo'shimcha mesh ham,
  // draw call ham sarflanmaydi.
  const manzara = shaharManzarasiniYarat();
  scene.background = manzara;
  // Chekka joylar fonga singib e'tibor stolga tushishi uchun FogExp2 ishlatiladi
  scene.fog = new THREE.FogExp2(fon.fon, fon.tumanZichligi);

  // 2. Kamera
  const kamera = new THREE.PerspectiveCamera(
    KAMERA.fov,
    konteyner.clientWidth / Math.max(1, konteyner.clientHeight),
    KAMERA.yaqin,
    KAMERA.uzoq
  );
  kamera.position.set(KAMERA.boshlangich[0], KAMERA.boshlangich[1], KAMERA.boshlangich[2]);

  // 3. WebGLRenderer
  const renderer = new THREE.WebGLRenderer({
    antialias: profil.antialias,
    powerPreference: "high-performance",
    // Nega: WebGL kompozitdan keyin buferni tozalaydi. O'lchagich
    // kadr pikselini o'qishi uchun bufer saqlanishi shart. Sukut false —
    // jonli sahna yo'liga tegilmaydi.
    preserveDrawingBuffer: olcham,
  });
  renderer.setSize(konteyner.clientWidth, konteyner.clientHeight);
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, profil.pikselNisbati),
  );
  renderer.shadowMap.enabled = profil.soya;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Tone mapping turi rendererniki, ekspozitsiya esa yorug'lik byudjeti
  // bilan birga `yoruglik.js` da o'lchab boshqariladi.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.display = "block";
  konteyner.innerHTML = "";
  konteyner.appendChild(renderer.domElement);

  const yoruglik = yoruglikniQur(scene, profil, renderer);

  // Bloom BRIF-01 da barcha profilda o'chirilgan; pass kodi 3-qavatda
  // kalibrlangan ostona bilan qaytishi uchun saqlanadi.
  const postprocessing = profil.postprocessing;
  let composer = null;
  if (postprocessing.bloom || postprocessing.ssao) {
    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, kamera));

    if (postprocessing.ssao) {
      const gtao = new GTAOPass(scene, kamera, konteyner.clientWidth, konteyner.clientHeight, {
        radius: 0.2,
        distanceExponent: 1.0,
        thickness: 1.0,
        distanceFallOff: 1.0,
        scale: 4,
        samples: 16,
      }, { samples: 16 });
      gtao.output = GTAOPass.OUTPUT.Default;
      gtao.blendIntensity = 0.6;
      composer.addPass(gtao);
    }

    if (postprocessing.bloom) {
      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(konteyner.clientWidth, konteyner.clientHeight),
        0.55,
        0.4,
        0.55,
      ));
    }
    composer.addPass(new OutputPass());
  }

  // 4. OrbitControls (Sukut bo'yicha o'chirilgan, chunki FPS Walk rejimi faol)
  const controls = new OrbitControls(kamera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = BOSHQARUV.engYaqin;
  controls.maxDistance = BOSHQARUV.engUzoq;
  controls.maxPolarAngle = BOSHQARUV.engKattaBurchak;
  controls.enablePan = false;
  controls.enabled = false;
  controls.target.set(KAMERA.nishon[0], KAMERA.nishon[1], KAMERA.nishon[2]);

  // 5. Materiallar
  // Anizotropiya darajasi QURILMADAN so'raladi, qattiq yozilmaydi:
  // kuchli GPU da imkoniyat behuda qolmasin, kuchsizida esa jim
  // pastga tushirilmasin (`tekstura-sifati.js`).
  const materiallar = materiallarniYarat(
    profil,
    renderer.capabilities.getMaxAnisotropy(),
  );

  return {
    scene, kamera, renderer, composer, controls, materiallar, yoruglik, manzara,
  };
}
