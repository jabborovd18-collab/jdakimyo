"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { KAMERA, BOSHQARUV, STOL, SLOTLAR, RANGLAR } from "../lib/sozlama.js";
import { materiallarniYarat, materiallarniTozala } from "../lib/materiallar.js";
import { jihozYasa } from "../lib/jihoz-modellari.js";

// Kuchsiz qurilmani aniqlash funksiyasi: mobil va past xotirali qurilmalarni aniqlab,
// shishaArzon materialiga va soyasiz rejimga o'tamiz.
// Nega: mobil GPUlarda transmission va og'ir soyalar kadrlarni 10 FPS ga tushirib qo'yishi mumkin.
function kuchsizQurilmaniAniqla() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const cpuYadrolar = Number(navigator.hardwareConcurrency || 4);
  const xotiraGb = Number(navigator.deviceMemory || 4);
  return cpuYadrolar <= 4 || xotiraGb <= 4;
}

// 3D sahnani (Scene, Camera, Renderer, Controls) boshqaruvchi asosiy React Hook.
// Nega useSahna hook ichida yozildi: barcha imperativ Three.js kodlari bitta joyda yig'iladi
// va React render siklidan ajralgan holatda 60 FPS ishlashni ta'minlaydi.
export function useSahna(konteynerRef) {
  const [tayyor, setTayyor] = useState(false);
  const [hammaJihozlar, setHammaJihozlar] = useState([]);
  const [kuchsizQurilma, setKuchsizQurilma] = useState(false);

  const sahnaRef = useRef(null);
  const kameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const materiallarRef = useRef(null);
  const kadrIdRef = useRef(null);
  const jihozlarMapRef = useRef(new Map()); // slotIndex -> THREE.Group

  // Jihozni stoldagi bo'sh slotga qo'shish.
  // Nega bo'sh slot tanlanadi: jihozlar bir-birining ustiga chiqib qolmasligi uchun
  // SLOTLAR panjarasidagi eng birinchi bo'sh joy topiladi.
  const jihozQosh = useCallback((kalit) => {
    if (!sahnaRef.current || !materiallarRef.current) return null;

    let boshSlot = -1;
    for (let i = 0; i < SLOTLAR.length; i++) {
      if (!jihozlarMapRef.current.has(i)) {
        boshSlot = i;
        break;
      }
    }

    if (boshSlot === -1) {
      return null; // Stolda 6 ta joy to'ldi
    }

    const group = jihozYasa(kalit, materiallarRef.current);
    group.userData.slotIndex = boshSlot;

    const [x, y, z] = SLOTLAR[boshSlot];
    group.position.set(x, y, z);
    sahnaRef.current.add(group);
    jihozlarMapRef.current.set(boshSlot, group);

    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));
    return group;
  }, []);

  // Jihozni stoldan va sahnadan olib tashlash.
  const jihozOlib = useCallback((slotIndexYokiKalit) => {
    if (!sahnaRef.current) return;

    let targetSlot = -1;
    if (typeof slotIndexYokiKalit === "number") {
      targetSlot = slotIndexYokiKalit;
    } else {
      for (const [index, group] of jihozlarMapRef.current.entries()) {
        if (group.userData?.kalit === slotIndexYokiKalit) {
          targetSlot = index;
          break;
        }
      }
    }

    const group = jihozlarMapRef.current.get(targetSlot);
    if (!group) return;

    sahnaRef.current.remove(group);
    group.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry) child.geometry.dispose();
      }
    });

    jihozlarMapRef.current.delete(targetSlot);
    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));
  }, []);

  useEffect(() => {
    if (!konteynerRef || !konteynerRef.current) return;

    const arzonRejim = kuchsizQurilmaniAniqla();
    setKuchsizQurilma(arzonRejim);

    // 1. Sahna
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(RANGLAR.fon);
    // Chekka joylar qorayib e'tibor stolga tushishi uchun FogExp2 ishlatiladi
    scene.fog = new THREE.FogExp2(RANGLAR.fon, 0.085);
    sahnaRef.current = scene;

    // 2. Kamera
    const kamera = new THREE.PerspectiveCamera(
      KAMERA.fov,
      konteynerRef.current.clientWidth / Math.max(1, konteynerRef.current.clientHeight),
      KAMERA.yaqin,
      KAMERA.uzoq
    );
    kamera.position.set(KAMERA.boshlangich[0], KAMERA.boshlangich[1], KAMERA.boshlangich[2]);
    kameraRef.current = kamera;

    // 3. WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !arzonRejim,
      powerPreference: "high-performance",
    });
    renderer.setSize(konteynerRef.current.clientWidth, konteynerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = !arzonRejim;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    konteynerRef.current.innerHTML = "";
    konteynerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(kamera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = BOSHQARUV.engYaqin;
    controls.maxDistance = BOSHQARUV.engUzoq;
    // Kamera stol ostiga kirib ketmasligi uchun engKattaBurchak cheklanadi
    controls.maxPolarAngle = BOSHQARUV.engKattaBurchak;
    // Telefonda panning tasodifan ishlaydi, shuning uchun enablePan o'chirildi
    controls.enablePan = false;
    controls.target.set(KAMERA.nishon[0], KAMERA.nishon[1], KAMERA.nishon[2]);
    controls.update();
    controlsRef.current = controls;

    // 5. Yorug'lik (AmbientLight + maksimal 2 ta DirectionalLight, faqat bittasi castShadow)
    const ambientLight = new THREE.AmbientLight(0x404060, 0.9);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    mainLight.position.set(2.5, 4.0, 2.0);
    mainLight.castShadow = !arzonRejim;
    if (mainLight.castShadow) {
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 15;
    }
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xa78bfa, 0.6);
    fillLight.position.set(-2.5, 2.0, -2.0);
    fillLight.castShadow = false;
    scene.add(fillLight);

    // 6. Materiallar
    const materiallar = materiallarniYarat();
    materiallarRef.current = materiallar;

    // 7. Stol va Orqa devor yaratish
    const stolGeo = new THREE.BoxGeometry(STOL.eni, STOL.qalinligi, STOL.boyi);
    const stol = new THREE.Mesh(stolGeo, materiallar.yogoch);
    stol.position.set(0, STOL.balandligi - STOL.qalinligi / 2, 0);
    stol.receiveShadow = !arzonRejim;
    scene.add(stol);

    const devorGeo = new THREE.PlaneGeometry(10, 6);
    const devorMat = new THREE.MeshStandardMaterial({ color: 0x181324, roughness: 0.9 });
    const devor = new THREE.Mesh(devorGeo, devorMat);
    devor.position.set(0, 3, -1.8);
    scene.add(devor);

    // Boshlang'ich holatda 1 ta probirkani stolga qo'yamiz
    const defProbirka = jihozYasa("probirka", materiallar);
    defProbirka.userData.slotIndex = 1; // 2-slot: old qator, o'rta
    const [x, y, z] = SLOTLAR[1];
    defProbirka.position.set(x, y, z);
    scene.add(defProbirka);
    jihozlarMapRef.current.set(1, defProbirka);
    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));

    // 8. ResizeObserver (window.resize emas, chunki panel yig'ilganda ham canvas o'zgaradi)
    const handleResize = () => {
      if (!konteynerRef.current || !rendererRef.current || !kameraRef.current) return;
      const w = konteynerRef.current.clientWidth;
      const h = Math.max(1, konteynerRef.current.clientHeight);
      kameraRef.current.aspect = w / h;
      kameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(konteynerRef.current);

    // 9. Sahifa fonga o'tsa render to'xtashi uchun visibilitychange
    let faolRender = true;
    const handleVisibility = () => {
      faolRender = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // 10. Animatsiya sikli
    const animate = () => {
      kadrIdRef.current = requestAnimationFrame(animate);
      if (!faolRender) return;
      controls.update();
      renderer.render(scene, kamera);
    };
    animate();

    setTayyor(true);

    // 11. Xotira tozalanadi (cleanup)
    return () => {
      if (kadrIdRef.current) {
        cancelAnimationFrame(kadrIdRef.current);
      }
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);

      // Sahnadagi barcha geometriya, material va teksturalarni tozalash
      scene.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });

      stolGeo.dispose();
      devorGeo.dispose();
      devorMat.dispose();
      materiallarniTozala(materiallar);

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (konteynerRef.current) {
        konteynerRef.current.innerHTML = "";
      }
      jihozlarMapRef.current.clear();
    };
  }, [konteynerRef]);

  // kameraRef va rendererRef ham qaytariladi: useSudrash Raycaster uchun kamerani,
  // hodisalarni ulash uchun esa renderer.domElement ni talab qiladi. Ular
  // qaytarilmaganda hook jim ishlamay qolardi — hodisa ulanmagani uchun bosish
  // ham, yoritish ham umuman ishga tushmasdi va xato xabari chiqmasdi.
  return {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
  };
}