"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";

// SSAO (GTAOPass) — sukut bo'yicha O'CHIRILGAN.
//
// Nega o'chiq: kuch, radius va `blendIntensity`ni faqat jonli brauzerda ko'rib
// sozlash kerak — noto'g'ri qiymat sahni loyqa yoki "chalkash" qilib qo'yishi
// mumkin. Bu sandboxda ko'z bilan tekshirib bo'lmaydi, shuning uchun avval
// `true` qilib, mahalliy brauzeringizda sozlab, keyin doimiy qo'yiladi.
// Yoqilganda ob'ektlar orasidagi kontakt soya chuqurlik beradi (realizm).
const SSAO_YOQIQ = false;
import { KAMERA, BOSHQARUV, STOL, SLOTLAR } from "../lib/sozlama.js";
import {
  materiallarniYarat,
  materiallarniTozala,
  materiallarniFongaMoslash,
} from "../lib/materiallar.js";
import { jihozYasa } from "../lib/jihoz-modellari.js";
import { javon3dYasa } from "../lib/javon-3d.js";
import { xonaInteryeriniYasa } from "../lib/xona-modellari.js";
import { fonOl, SUKUT_FON } from "../lib/fonlar.js";

// Kuchsiz qurilmani aniqlash funksiyasi: mobil va past xotirali qurilmalarni aniqlab,
// shishaArzon materialiga va soyasiz rejimga o'tamiz.
// Nega: mobil GPUlarda transmission va og'ir soyalar kadrlarni 10 FPS ga tushirib qo'yishi mumkin.
function kuchsizQurilmaniAniqla() {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  // Ilgari `cpuYadrolar <= 4 || xotiraGb <= 4` edi — juda tajovuzkor:
  // ko'plab oddiy noutbuklar `navigator.deviceMemory` da aynan 4 GB
  // qaytaradi va shu tufayli soya + antialias + haqiqiy transmission shisha
  // o'chib, sahna "Minecraft" bo'lib ko'rinardi. Endi arzon rejimga faqat
  // chinakam past resursli qurilma (mobil yoki 2 yadro + 4 GB dan kam)
  // tushadi; oddiy noutbuk to'liq grafik bilan ishlaydi.
  try {
    const mobil = navigator.userAgentData?.mobile ??
      /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent || "");
    if (mobil) return true;

    const cpuYadrolar = Number(navigator.hardwareConcurrency || 4);
    const xotiraGb = Number(navigator.deviceMemory || 4);
    return cpuYadrolar <= 2 && xotiraGb <= 4;
  } catch {
    return false;
  }
}

// 3D sahnani (Scene, Camera, Renderer, Controls) boshqaruvchi asosiy React Hook.
// Nega useSahna hook ichida yozildi: barcha imperativ Three.js kodlari bitta joyda yig'iladi
// va React render siklidan ajralgan holatda 60 FPS ishlashni ta'minlaydi.
export function useSahna(konteynerRef, yuklanmoqda = false, fonKaliti = SUKUT_FON) {
  const [tayyor, setTayyor] = useState(false);
  const [hammaJihozlar, setHammaJihozlar] = useState([]);
  const [kuchsizQurilma, setKuchsizQurilma] = useState(false);

  const sahnaRef = useRef(null);
  const kameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const materiallarRef = useRef(null);
  const kadrIdRef = useRef(null);
  const composerRef = useRef(null);
  const jihozlarMapRef = useRef(new Map()); // slotIndex -> THREE.Group

  // Fon almashganda yangilanadigan obyektlar. Ular ref da saqlanadi, chunki
  // sahna bir marta quriladi va keyin faqat rangi o'zgaradi.
  const fonQismlariRef = useRef(null);

  // Sahna qurilayotgan paytda joriy fonni bilish uchun. State to'g'ridan
  // ishlatilsa, u useEffect bog'liqligiga aylanib sahnani qayta qurdirardi.
  const fonKalitiRef = useRef(fonKaliti);
  fonKalitiRef.current = fonKaliti;

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

    const arzonRejim = kuchsizQurilmaniAniqla();
    setKuchsizQurilma(arzonRejim);

    const fon = fonOl(fonKalitiRef.current);

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
      antialias: !arzonRejim,
      powerPreference: "high-performance",
    });
    renderer.setSize(konteynerRef.current.clientWidth, konteynerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.shadowMap.enabled = !arzonRejim;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // Tonemapping'siz sahna yassi va "kompyuterda chizilgan" bo'lib ko'rinardi:
    // yorug' joylar oq bo'lib kuyib ketardi, oraliq soyalar esa siqilib turardi.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    konteynerRef.current.innerHTML = "";
    konteynerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3.6. Postprocessing (bloom) — realizmning eng katta omili.
    //
    // Ilgari postprocessing umuman yo'q edi: alanga, neon chiroqlar, LED
    // ekranlar o'z yorqinligini atrofga "nur" sifatida taratolmasdi va sahna
    // yassi, "Minecraft" bo'lib ko'rinardi. UnrealBloomPass yorqin pikselni
    // atrofiga silliq yoyadi (bloom). Arzon rejimda o'chiriladi — kompozitsiya
    // qo'shimcha GPU yuki beradi, past qurilmalar oddiy render bilan ishlaydi.
    let composer = null;
    if (!arzonRejim) {
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, kamera));

      // SSAO (kontakt soya) — yoqilganda RenderPass dan keyin keladi: u
      // sahna rasmni o'qib, ustiga chuqurlik soyasini blend qiladi. Keyin
      // bloom ishlaydi. Konservativ boshlang'ich qiymatlar — ko'rib sozlanadi.
      if (SSAO_YOQIQ) {
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

      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(konteynerRef.current.clientWidth, konteynerRef.current.clientHeight),
        0.55, // kuch
        0.4,  // radius — nur tarqalishi
        0.55, // threshold — qanday yorqinlik "nur" bo'lishi
      ));
      composer.addPass(new OutputPass());
      composerRef.current = composer;
    }

    // 3.5. Muhit xaritasi (envMap)
    //
    // Bu sahnadagi eng katta o'zgarish. Shishani shisha qiladigan narsa —
    // uning sirtida aks etgan atrof. Aks etadigan narsa bo'lmasa, qanchalik
    // to'g'ri `transmission` va `ior` bersak ham, idish rangsiz silindr
    // bo'lib qolaveradi — probirka bo'sh stolda aynan shuning uchun zo'rg'a
    // bilinardi.
    //
    // RoomEnvironment protsedural: rasm yuklanmaydi, tarmoqqa chiqilmaydi.
    // PMREM undan bir marta xarita yasaydi, keyin generator kerak emas.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const muhitXaritasi = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = muhitXaritasi;
    pmrem.dispose();

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

    // 5. Yorug'lik (AmbientLight + maksimal 2 ta DirectionalLight, faqat bittasi castShadow)
    const ambientLight = new THREE.AmbientLight(
      fon.yorugliklar.muhit.rang,
      fon.yorugliklar.muhit.kuch,
    );
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(
      fon.yorugliklar.asosiy.rang,
      fon.yorugliklar.asosiy.kuch,
    );
    mainLight.position.set(2.5, 4.0, 2.0);
    mainLight.castShadow = !arzonRejim;
    if (mainLight.castShadow) {
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.camera.near = 0.5;
      mainLight.shadow.camera.far = 15;
      // Soya kamerasi sukut bo'yicha ±5 ni qamraydi, stol esa atigi 3.2 keng.
      // Ya'ni 1024px xaritaning yarmidan ko'pi bo'sh joyga sarflanardi va
      // probirkaning soyasi bir necha pikselga tushib, xarrak bo'lib chiqardi.
      mainLight.shadow.camera.left = -2.6;
      mainLight.shadow.camera.right = 2.6;
      mainLight.shadow.camera.top = 2.6;
      mainLight.shadow.camera.bottom = -2.6;
      // Bias'siz yupqa shisha devor o'z-o'ziga soya tashlab, sirtida
      // chiziqli dog'lar (shadow acne) paydo bo'ladi.
      mainLight.shadow.bias = -0.0005;
      mainLight.shadow.normalBias = 0.02;
    }
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(
      fon.yorugliklar.toldiruvchi.rang,
      fon.yorugliklar.toldiruvchi.kuch,
    );
    fillLight.position.set(-2.5, 2.0, -2.0);
    fillLight.castShadow = false;
    scene.add(fillLight);

    // 6. Materiallar
    const materiallar = materiallarniYarat(fonKalitiRef.current, arzonRejim);
    materiallarRef.current = materiallar;

    // 7. Asosiy Tajriba Stoli
    const stolGeo = new THREE.BoxGeometry(STOL.eni, STOL.qalinligi, STOL.boyi);
    const stol = new THREE.Mesh(stolGeo, materiallar.yogoch);
    stol.position.set(0, STOL.balandligi - STOL.qalinligi / 2, 0);
    stol.receiveShadow = !arzonRejim;
    stol.castShadow = !arzonRejim;
    scene.add(stol);

    // To'rtta oyoq
    const oyoqBalandligi = STOL.balandligi - STOL.qalinligi;
    const oyoqGeo = new THREE.BoxGeometry(0.07, oyoqBalandligi, 0.07);
    const oyoqX = STOL.eni / 2 - 0.1;
    const oyoqZ = STOL.boyi / 2 - 0.1;
    for (const [x, z] of [[-oyoqX, oyoqZ], [oyoqX, oyoqZ], [-oyoqX, -oyoqZ], [oyoqX, -oyoqZ]]) {
      const oyoq = new THREE.Mesh(oyoqGeo, materiallar.yogoch);
      oyoq.position.set(x, oyoqBalandligi / 2, z);
      oyoq.castShadow = !arzonRejim;
      scene.add(oyoq);
    }

    // 8. Haqiqiy 3D Reagentlar Javoni va 4 Devorli Xona Interyerini sahnaga o'rnatish
    const javon3d = javon3dYasa(materiallar, arzonRejim);
    scene.add(javon3d);

    const xonaInteryeri = xonaInteryeriniYasa(materiallar);
    scene.add(xonaInteryeri);

    // Fon almashganda shu obyektlarning rangi yangilanadi
    fonQismlariRef.current = { ambientLight, mainLight, fillLight };

    // Boshlang'ich holatda 1 ta probirka va 1 ta spirtovkani stolga qo'yamiz
    const defProbirka = jihozYasa("probirka", materiallar);
    defProbirka.userData.slotIndex = 1; // 2-slot: old qator, o'rta-chap
    const [px, py, pz] = SLOTLAR[1];
    defProbirka.position.set(px, py, pz);
    scene.add(defProbirka);
    jihozlarMapRef.current.set(1, defProbirka);

    const defSpirtovka = jihozYasa("spirtovka", materiallar);
    defSpirtovka.userData.slotIndex = 3; // 4-slot: old qator, o'rta-o'ng
    const [sx, sy, sz] = SLOTLAR[3];
    defSpirtovka.position.set(sx, sy, sz);
    scene.add(defSpirtovka);
    jihozlarMapRef.current.set(3, defSpirtovka);

    const defTermometr = jihozYasa("termometr", materiallar);
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

    // 10. Animatsiya sikli
    const animate = () => {
      kadrIdRef.current = requestAnimationFrame(animate);
      if (!faolRender) return;
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
      // PMREM generatori darrov tozalangan, lekin u yasagan xarita sahna
      // yashaguncha kerak — u shu yerda bo'shatiladi.
      muhitXaritasi.dispose();
      scene.environment = null;
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
      fonQismlariRef.current = null;
    };
  }, [konteynerRef, yuklanmoqda]);

  // Fon almashganda: sahna saqlanadi, faqat ranglar va yorug'lik yangilanadi.
  // `tayyor` bog'liqlikda turadi — birinchi renderda bu effekt sahnadan
  // oldin ishga tushib, hech nimani topolmasdi.
  useEffect(() => {
    const scene = sahnaRef.current;
    const qismlar = fonQismlariRef.current;
    if (!scene || !qismlar) return;

    const fon = fonOl(fonKaliti);

    scene.background = new THREE.Color(fon.fon);
    if (scene.fog) {
      scene.fog.color.setHex(fon.fon);
      scene.fog.density = fon.tumanZichligi;
    }

    if (qismlar.ambientLight) {
      qismlar.ambientLight.color.setHex(fon.yorugliklar.muhit.rang);
      qismlar.ambientLight.intensity = fon.yorugliklar.muhit.kuch;
    }
    if (qismlar.mainLight) {
      qismlar.mainLight.color.setHex(fon.yorugliklar.asosiy.rang);
      qismlar.mainLight.intensity = fon.yorugliklar.asosiy.kuch;
    }
    if (qismlar.fillLight) {
      qismlar.fillLight.color.setHex(fon.yorugliklar.toldiruvchi.rang);
      qismlar.fillLight.intensity = fon.yorugliklar.toldiruvchi.kuch;
    }

    materiallarniFongaMoslash(materiallarRef.current, fonKaliti);
  }, [fonKaliti, tayyor]);

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
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
  };
}