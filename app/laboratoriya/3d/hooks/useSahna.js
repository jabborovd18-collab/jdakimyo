"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";

import { KAMERA, BOSHQARUV, STOL, SLOTLAR } from "../lib/sozlama.js";
import { materiallarniYarat, materiallarniTozala } from "../lib/materiallar.js";
import { jihozYasa } from "../lib/jihoz-modellari.js";
import { javon3dYasa } from "../lib/javon-3d.js";
import { xonaInteryeriniYasa } from "../lib/xona-modellari.js";
import { harakatsizGeometriyaniBirlashtir } from "../lib/geometriya-birlashtirish.js";
import { SAHNA_FONI } from "../lib/fonlar.js";
import { profilniAniqla, profilniOl } from "../lib/sifat-profili.js";
import { yoruglikniQur } from "../lib/yoruglik.js";
import {
  YORLIQLAR_SAQLASH_KALITI,
  YORLIQ_TEKSHIRISH_QADAMI,
  yorliqlarniYangila,
} from "../lib/yorliqlar.js";

// 3D sahnani (Scene, Camera, Renderer, Controls) boshqaruvchi asosiy React Hook.
// Nega useSahna hook ichida yozildi: barcha imperativ Three.js kodlari bitta joyda yig'iladi
// va React render siklidan ajralgan holatda 60 FPS ishlashni ta'minlaydi.
export function useSahna(konteynerRef, yuklanmoqda = false, sozlama = {}) {
  // O'lchagich profilni aniq beradi; jonli sahifa esa qurilmadan aniqlaydi.
  // Ref ishlatilishining sababi: sozlama obyektini effect bog'liqligiga
  // qo'shish sahnani har React renderida qayta qurib yuborardi.
  const olchamRef = useRef(!!sozlama.olcham);
  const aniqProfilRef = useRef(sozlama.profil || null);
  const aniqYorliqRef = useRef(
    typeof sozlama.yorliqlarYoqilgan === "boolean"
      ? sozlama.yorliqlarYoqilgan
      : null,
  );
  olchamRef.current = !!sozlama.olcham;
  aniqProfilRef.current = sozlama.profil || null;
  aniqYorliqRef.current = typeof sozlama.yorliqlarYoqilgan === "boolean"
    ? sozlama.yorliqlarYoqilgan
    : null;
  const [tayyor, setTayyor] = useState(false);
  const [hammaJihozlar, setHammaJihozlar] = useState([]);
  const [kuchsizQurilma, setKuchsizQurilma] = useState(false);
  const [yorliqlarYoqilgan, setYorliqlarYoqilgan] = useState(true);

  const sahnaRef = useRef(null);
  const kameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const materiallarRef = useRef(null);
  const profilRef = useRef(null);
  const yorliqlarYoqilganRef = useRef(true);
  const yorliqHolatiRef = useRef({ yorliqSoni: 0, yorliqToqnashuvi: 0 });
  const kadrIdRef = useRef(null);
  const composerRef = useRef(null);
  const jihozlarMapRef = useRef(new Map()); // slotIndex -> THREE.Group
  // BRIF-07 birlashuv hisoboti — o'lchagich uni o'qiydi.
  const birlashuvRef = useRef({ birlashdi: 0, guruh: 0, otkazildi: 0 });

  useEffect(() => {
    let yoqilgan = true;
    if (aniqYorliqRef.current !== null) {
      yoqilgan = aniqYorliqRef.current;
    } else {
      try {
        const saqlangan = localStorage.getItem(YORLIQLAR_SAQLASH_KALITI);
        yoqilgan = saqlangan === null ? true : saqlangan !== "0";
      } catch {
        yoqilgan = true;
      }
    }
    yorliqlarYoqilganRef.current = yoqilgan;
    setYorliqlarYoqilgan(yoqilgan);
  }, []);

  const yorliqlarniAlmashtir = useCallback((aniqQiymat) => {
    const yoqilgan = typeof aniqQiymat === "boolean"
      ? aniqQiymat
      : !yorliqlarYoqilganRef.current;
    yorliqlarYoqilganRef.current = yoqilgan;
    setYorliqlarYoqilgan(yoqilgan);
    if (!olchamRef.current) {
      try {
        localStorage.setItem(YORLIQLAR_SAQLASH_KALITI, yoqilgan ? "1" : "0");
      } catch {}
    }
    if (sahnaRef.current && kameraRef.current && rendererRef.current) {
      yorliqHolatiRef.current = yorliqlarniYangila(
        sahnaRef.current,
        kameraRef.current,
        rendererRef.current,
        yoqilgan,
      );
    }
  }, []);

  // Jihozni stoldagi bo'sh slotga qo'shish.
  // Nega bo'sh slot tanlanadi: jihozlar bir-birining ustiga chiqib qolmasligi uchun
  // SLOTLAR panjarasidagi eng birinchi bo'sh joy topiladi.
  const jihozQosh = useCallback((kalit) => {
    if (!sahnaRef.current || !materiallarRef.current || !profilRef.current) return null;

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

    const group = jihozYasa(kalit, materiallarRef.current, profilRef.current);
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
        // Ilgari faqat geometriya bo'shatilar, material va tekstura GPU da
        // qolib, ko'p marta idish olib-tashlansa xotira sizib borardi (leak).
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => { if (m?.map) m.map.dispose(); m?.dispose(); });
          } else {
            if (child.material.map) child.material.map.dispose();
            child.material.dispose();
          }
        }
      }
    });

    jihozlarMapRef.current.delete(targetSlot);
    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));
  }, []);

  useEffect(() => {
    if (yuklanmoqda) return;
    if (!konteynerRef || !konteynerRef.current) return;

    // O'lchagich aniq profilni majburlaydi; jonli sahifa qurilmani o'zi
    // aniqlaydi. Profil obyektining o'zi barcha quruvchilarga uzatiladi.
    const profil = aniqProfilRef.current
      ? profilniOl(aniqProfilRef.current)
      : profilniAniqla();
    profilRef.current = profil;
    setKuchsizQurilma(profil.nom === "telefon");

    const fon = SAHNA_FONI;

    // 1. Sahna
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(fon.fon);
    // Chekka joylar fonga singib e'tibor stolga tushishi uchun FogExp2 ishlatiladi
    scene.fog = new THREE.FogExp2(fon.fon, fon.tumanZichligi);
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
      antialias: profil.antialias,
      powerPreference: "high-performance",
      // Nega: WebGL kompozitdan keyin buferni tozalaydi. O'lchagich
      // kadr pikselini o'qishi uchun bufer saqlanishi shart. Sukut false —
      // jonli sahna yo'liga tegilmaydi.
      preserveDrawingBuffer: olchamRef.current,
    });
    renderer.setSize(konteynerRef.current.clientWidth, konteynerRef.current.clientHeight);
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
    konteynerRef.current.innerHTML = "";
    konteynerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const yoruglik = yoruglikniQur(scene, profil, renderer);

    // Bloom BRIF-01 da barcha profilda o'chirilgan; pass kodi 3-qavatda
    // kalibrlangan ostona bilan qaytishi uchun saqlanadi.
    const postprocessing = profil.postprocessing;
    let composer = null;
    if (postprocessing.bloom || postprocessing.ssao) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, kamera));

      if (postprocessing.ssao) {
        const gtao = new GTAOPass(scene, kamera, konteynerRef.current.clientWidth, konteynerRef.current.clientHeight, {
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
          new THREE.Vector2(konteynerRef.current.clientWidth, konteynerRef.current.clientHeight),
          0.55,
          0.4,
          0.55,
        ));
      }
      composer.addPass(new OutputPass());
      composerRef.current = composer;
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
    controlsRef.current = controls;

    // 5. Materiallar
    const materiallar = materiallarniYarat(profil);
    materiallarRef.current = materiallar;

    // 7. Asosiy Tajriba Stoli
    const stolGeo = new THREE.BoxGeometry(STOL.eni, STOL.qalinligi, STOL.boyi);
    const stol = new THREE.Mesh(stolGeo, materiallar.yogoch);
    stol.position.set(0, STOL.balandligi - STOL.qalinligi / 2, 0);
    stol.receiveShadow = profil.soya;
    stol.castShadow = profil.soya;
    scene.add(stol);

    // To'rtta oyoq
    const oyoqBalandligi = STOL.balandligi - STOL.qalinligi;
    const oyoqGeo = new THREE.BoxGeometry(0.07, oyoqBalandligi, 0.07);
    const oyoqX = STOL.eni / 2 - 0.1;
    const oyoqZ = STOL.boyi / 2 - 0.1;
    for (const [x, z] of [[-oyoqX, oyoqZ], [oyoqX, oyoqZ], [-oyoqX, -oyoqZ], [oyoqX, -oyoqZ]]) {
      const oyoq = new THREE.Mesh(oyoqGeo, materiallar.yogoch);
      oyoq.position.set(x, oyoqBalandligi / 2, z);
      oyoq.castShadow = profil.soya;
      scene.add(oyoq);
    }

    // 8. Haqiqiy 3D Reagentlar Javoni va 4 Devorli Xona Interyerini sahnaga o'rnatish
    const javon3d = javon3dYasa(materiallar, profil);
    scene.add(javon3d);

    const xonaInteryeri = xonaInteryeriniYasa(materiallar, profil);
    scene.add(xonaInteryeri);

    // BRIF-07 — harakatsiz geometriyani material va fazoviy zona bo'yicha
    // birlashtiramiz. Xona 100% qimirlamaydi, shuning uchun har devor
    // bo'lagi uchun alohida draw call to'lash isrof.
    //
    // Interaktiv shoxlarga TEGILMAYDI: nishon ota-zanjirda
    // `userData.kalit` ni qidiradi, ba'zi stansiyalar esa faqat NOM
    // bilan topiladi (masalan `3D_Devor_Reagent_Shkaflari`). Ikkalasi
    // ham `geometriya-birlashtirish.js` da himoyalangan.
    const birlashuv = harakatsizGeometriyaniBirlashtir(xonaInteryeri);
    birlashuvRef.current = birlashuv;

    // Boshlang'ich holatda 1 ta probirka va 1 ta spirtovkani stolga qo'yamiz
    const defProbirka = jihozYasa("probirka", materiallar, profil);
    defProbirka.userData.slotIndex = 1; // 2-slot: old qator, o'rta-chap
    const [px, py, pz] = SLOTLAR[1];
    defProbirka.position.set(px, py, pz);
    scene.add(defProbirka);
    jihozlarMapRef.current.set(1, defProbirka);

    const defSpirtovka = jihozYasa("spirtovka", materiallar, profil);
    defSpirtovka.userData.slotIndex = 3; // 4-slot: old qator, o'rta-o'ng
    const [sx, sy, sz] = SLOTLAR[3];
    defSpirtovka.position.set(sx, sy, sz);
    scene.add(defSpirtovka);
    jihozlarMapRef.current.set(3, defSpirtovka);

    const defTermometr = jihozYasa("termometr", materiallar, profil);
    defTermometr.userData.slotIndex = 8; // 9-slot: o'rta qator, o'rta-o'ng
    const [tx, ty, tz] = SLOTLAR[8];
    defTermometr.position.set(tx, ty, tz);
    scene.add(defTermometr);
    jihozlarMapRef.current.set(8, defTermometr);

    setHammaJihozlar(Array.from(jihozlarMapRef.current.values()));

    // 8. ResizeObserver (window.resize emas, chunki panel yig'ilganda ham canvas o'zgaradi)
    const handleResize = () => {
      if (!konteynerRef.current || !rendererRef.current || !kameraRef.current) return;
      const w = konteynerRef.current.clientWidth;
      const h = Math.max(1, konteynerRef.current.clientHeight);
      kameraRef.current.aspect = w / h;
      kameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      // Kompozitor o'lchami ham yangilanadi, aks holda bloom yorilib ketadi.
      if (composer) composer.setSize(w, h);
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

    // Yorliq collision hisobi renderdan arzonroq bo'lsa ham har kadrda
    // takrorlanmaydi. Kamera/idish harakati uchun 5-kadr yetarli.
    let yorliqKadri = 0;
    yorliqHolatiRef.current = yorliqlarniYangila(
      scene,
      kamera,
      renderer,
      yorliqlarYoqilganRef.current,
    );

    // 10. Animatsiya sikli
    const animate = () => {
      kadrIdRef.current = requestAnimationFrame(animate);
      if (!faolRender) return;
      yorliqKadri += 1;
      if (yorliqKadri % YORLIQ_TEKSHIRISH_QADAMI === 0) {
        yorliqHolatiRef.current = yorliqlarniYangila(
          scene,
          kamera,
          renderer,
          yorliqlarYoqilganRef.current,
        );
      }
      if (controls.enabled) {
        controls.update();
      }

      // 4-MUAMMO: Sahnadagi alanga tebranishi va qaynash pufakchalarini 60 FPS da harakatlantirish
      const vaqt = performance.now() * 0.006;
      scene.children.forEach((obj) => {
        if (obj.userData?.alanga && obj.userData.yoqilgan) {
          if (obj.userData.sariqAlanga) {
            obj.userData.sariqAlanga.scale.set(
              1 + Math.sin(vaqt * 2.5) * 0.08,
              1 + Math.cos(vaqt * 3.2) * 0.1,
              1 + Math.sin(vaqt * 2.1) * 0.08
            );
          }
          if (obj.userData.alangaNuri) {
            obj.userData.alangaNuri.intensity = 1.3 + Math.sin(vaqt * 4.0) * 0.35;
          }
        }

        if (obj.userData?.qaynashEffekti && obj.userData.qaynashEffekti.group?.visible) {
          const { geo, count, basePos, balandlik } = obj.userData.qaynashEffekti;
          if (geo?.attributes?.position) {
            const posArr = geo.attributes.position.array;
            for (let i = 0; i < count; i++) {
              posArr[i * 3 + 1] += basePos[i].speed;
              if (posArr[i * 3 + 1] > balandlik + 0.02) {
                posArr[i * 3 + 1] = 0.03;
              }
            }
            geo.attributes.position.needsUpdate = true;
          }
        }
      });

      // Bloom yoqilgan bo'lsa kompozitor chizadi, aks holda oddiy render.
      if (composer) composer.render();
      else renderer.render(scene, kamera);
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
      oyoqGeo.dispose();
      yoruglik.tozala();
      materiallarniTozala(materiallar);

      if (composerRef.current) {
        composerRef.current.dispose();
        composerRef.current = null;
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (konteynerRef.current) {
        konteynerRef.current.innerHTML = "";
      }
      jihozlarMapRef.current.clear();
      profilRef.current = null;
      yorliqHolatiRef.current = { yorliqSoni: 0, yorliqToqnashuvi: 0 };
    };
  }, [konteynerRef, yuklanmoqda]);

  // kameraRef va rendererRef ham qaytariladi: useSudrash Raycaster uchun kamerani,
  // hodisalarni ulash uchun esa renderer.domElement ni talab qiladi. Ular
  // qaytarilmaganda hook jim ishlamay qolardi — hodisa ulanmagani uchun bosish
  // ham, yoritish ham umuman ishga tushmasdi va xato xabari chiqmasdi.
  return {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    profilRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
    yorliqlarYoqilgan,
    yorliqlarniAlmashtir,
    yorliqHolatiRef,
    birlashuvRef,
    composerRef,
  };
}
