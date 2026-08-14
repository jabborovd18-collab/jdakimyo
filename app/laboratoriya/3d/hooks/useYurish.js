"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi, shishaUrilishi, tiqinOchilishi, taroziBip, oqimBoshla, oqimToxtat } from "../lib/ovoz.js";

// Qat'iy AABB to'siq kolliziyasi va itarib chiqarish (Push-out separation)
function stolKolliziyasi(px, pz, minX, maxX, minZ, maxZ, radius = 0.42) {
  const boxMinX = minX - radius;
  const boxMaxX = maxX + radius;
  const boxMinZ = minZ - radius;
  const boxMaxZ = maxZ + radius;

  let x = px;
  let z = pz;

  if (x > boxMinX && x < boxMaxX && z > boxMinZ && z < boxMaxZ) {
    const dLeft = Math.abs(x - boxMinX);
    const dRight = Math.abs(x - boxMaxX);
    const dBack = Math.abs(z - boxMinZ);
    const dFront = Math.abs(z - boxMaxZ);

    const minD = Math.min(dLeft, dRight, dBack, dFront);
    if (minD === dLeft) x = boxMinX;
    else if (minD === dRight) x = boxMaxX;
    else if (minD === dBack) z = boxMinZ;
    else z = boxMaxZ;
  }
  return { x, z };
}

/**
 * CS 1.6 USLUBIDAGI 100% ERKIN SICHQONCHA VA TUGMASIZ JISMONIY 3D OLAM DVIGATELI.
 */
export function useYurish({
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onQuyishBoshla,
  onQuyishToxtat,
  onAniqHajmQuy,
  onTaroziTushdi,
  onTarozidanOlingan,
  onTaroziTara,
  onTaroziNol,
  onSpirtovkaBosildi,
  onSpirtovkagaQoyildi,
  onRakovinaKraniBosildi,
  onRakovinagaTushdi,
  onPlanshetBosildi,
  onStansiyaOchildi,
  onStenddanJihozOlish,
  onJavongaQaytar,
  onAralashtirish,
  onSpatulaAmal,
  onTitrlashKran,
  onElektrolizTok,
  onXavfsizlikDushi,
  onKozYuvish,
  onKozoynakTaqish,
  onGazNiqobiTaqish,
  isitimoda = false,
  tarozidagiIdish = null,
  taraMassa = 0,
}) {
  const [yurishRejimi, setYurishRejimi] = useState(true); // Sukut bo'yicha darhol FPS yurish rejimida
  const [yurmoqda, setYurmoqda] = useState(false);
  const [fpsQaralganIdish, setFpsQaralganIdish] = useState(null);
  const [fpsQolIdish, setFpsQolIdish] = useState(null);
  const [fpsQaralganStansiya, setFpsQaralganStansiya] = useState(null);
  const [fpsKontekstMatn, setFpsKontekstMatn] = useState("");
  const [fpsKontekstTuri, setFpsKontekstTuri] = useState("oddiy");
  const [sezgirlik, setSezgirlik] = useState(1.0); // 0.2 .. 2.5x

  const sezgirlikRef = useRef(1.0);
  sezgirlikRef.current = sezgirlik;

  // Harakat klavishlari va holatlar
  const keysRef = useRef({ w: false, s: false, a: false, d: false, sprint: false, crouch: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false });

  // Kamera burchaklari (Yaw: Gorizontal, Pitch: Vertikal)
  const rotationRef = useRef({ yaw: 0, pitch: -0.15 });
  const velocityRef = useRef(new THREE.Vector3());

  // Sakrash, cho'qqayish va ko'z balandligi
  const verticalVelocityRef = useRef(0);
  const targetEyeHeightRef = useRef(1.58);
  const eyeHeightRef = useRef(1.58);

  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingRef = useRef(0);

  const centerRaycasterRef = useRef(new THREE.Raycaster());
  const avvalgiFpsYoritilganRef = useRef(null);
  const quyishBosilganRef = useRef(false);

  // Sezgirlikni localStorage dan o'qish
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lab-3d-sezgirlik");
        if (saved) {
          const val = parseFloat(saved);
          if (!isNaN(val) && val >= 0.2 && val <= 3.0) {
            setSezgirlik(val);
            sezgirlikRef.current = val;
          }
        }
      } catch (e) {}
    }
  }, []);

  const sezgirlikniOzgartir = useCallback((yangiVal) => {
    const val = Math.max(0.2, Math.min(3.0, Number(yangiVal) || 1.0));
    setSezgirlik(val);
    sezgirlikRef.current = val;
    try {
      localStorage.setItem("lab-3d-sezgirlik", String(val));
    } catch (e) {}
  }, []);

  // Dastlabki orbit kamera holati
  const aslKameraRef = useRef({
    pos: new THREE.Vector3(0, 1.55, 2.3),
    target: new THREE.Vector3(0, 0.95, 0.3),
  });

  // Rejimni yoqish / o'chirish
  const toggleYurishRejimi = useCallback(() => {
    setYurishRejimi((prev) => {
      const yangi = !prev;

      if (kameraRef?.current && controlsRef?.current) {
        if (yangi) {
          aslKameraRef.current.pos.copy(kameraRef.current.position);
          aslKameraRef.current.target.copy(controlsRef.current.target);

          controlsRef.current.enabled = false;

          const dir = new THREE.Vector3();
          kameraRef.current.getWorldDirection(dir);
          rotationRef.current.yaw = Math.atan2(-dir.x, -dir.z);
          rotationRef.current.pitch = Math.asin(Math.max(-0.95, Math.min(0.95, dir.y)));

          eyeHeightRef.current = 1.58;
          targetEyeHeightRef.current = 1.58;
          verticalVelocityRef.current = 0;
          velocityRef.current.set(0, 0, 0);

          if (rendererRef?.current?.domElement) {
            rendererRef.current.domElement.requestPointerLock?.();
          }
        } else {
          controlsRef.current.enabled = true;
          kameraRef.current.position.copy(aslKameraRef.current.pos);
          controlsRef.current.target.copy(aslKameraRef.current.target);
          controlsRef.current.update();

          if (document.exitPointerLock) {
            document.exitPointerLock();
          }

          avvalgiFpsYoritilganRef.current = null;
          setFpsQaralganIdish(null);
          setFpsQaralganStansiya(null);
          setFpsKontekstMatn("");
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef, rendererRef]);

  // Qo'ldagi idishni boshqarish va stansiyalarni faollashtirish
  const qolgaOlYokiQoy = useCallback((amal = "asosiy") => {
    if (!kameraRef?.current || !sahnaRef?.current) return;

    // 1. Agar stenddagi yangi toza jihoz tanlangan bo'lsa (Glassware Rack)
    if (!fpsQolIdish && fpsQaralganIdish?.userData?.stendJihozi) {
      const kalit = fpsQaralganIdish.userData.kalit || "probirka";
      shishaUrilishi(2400);
      tiqinOchilishi();
      if (typeof onStenddanJihozOlish === "function") {
        const yangiIdish = onStenddanJihozOlish(kalit);
        if (yangiIdish) {
          yangiIdish.userData.qolda = true;
          yangiIdish.userData.kotarilgan = true;
          setFpsQolIdish(yangiIdish);
        }
      }
      return;
    }

    // 2. Agar Tarozi sensor tugmalari (TARA / ZERO) bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "tarozi_tara" || fpsQaralganStansiya === "tarozi_tara") {
      taroziBip(2800);
      if (typeof onTaroziTara === "function") onTaroziTara();
      return;
    }
    if (fpsQaralganIdish?.userData?.kalit === "tarozi_nol" || fpsQaralganStansiya === "tarozi_nol") {
      taroziBip(2400);
      if (typeof onTaroziNol === "function") onTaroziNol();
      return;
    }

    // 3. Agar Spirtovka yoqish/o'chirish bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "spirtovka" && !fpsQolIdish) {
      if (typeof onSpirtovkaBosildi === "function") {
        onSpirtovkaBosildi();
      }
      return;
    }

    // 4. Agar Rakovina kran jo'mragi bosilsa
    if ((fpsQaralganIdish?.userData?.kalit === "rakovina_kran" || fpsQaralganStansiya === "rakovina_kran") && !fpsQolIdish) {
      if (typeof onRakovinaKraniBosildi === "function") {
        onRakovinaKraniBosildi();
      }
      return;
    }

    // 5. Agar Byuretka krani bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "titrlash_kran" || fpsQaralganStansiya === "titrlash_kran") {
      if (typeof onTitrlashKran === "function") {
        onTitrlashKran();
      }
      return;
    }

    // 6. Agar Elektroliz tok manbai regulyatori bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "elektroliz_tok" || fpsQaralganStansiya === "elektroliz_tok") {
      if (typeof onElektrolizTok === "function") {
        onElektrolizTok();
      }
      return;
    }

    // 7. Agar Xavfsizlik Dushi zanjiri bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "xavfsizlik_dushi" || fpsQaralganStansiya === "xavfsizlik_dushi") {
      if (typeof onXavfsizlikDushi === "function") {
        onXavfsizlikDushi();
      }
      return;
    }

    // 8. Agar Ko'z Yuvish favvorasi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "koz_yuvish" || fpsQaralganStansiya === "koz_yuvish") {
      if (typeof onKozYuvish === "function") {
        onKozYuvish();
      }
      return;
    }

    // 9. Agar Himoya ko'zoynagi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "himoya_kozoynagi") {
      if (typeof onKozoynakTaqish === "function") {
        onKozoynakTaqish();
      }
      return;
    }

    // 10. Agar Gaz niqobi bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "gaz_niqobi") {
      if (typeof onGazNiqobiTaqish === "function") {
        onGazNiqobiTaqish();
      }
      return;
    }

    // 11. Agar Smart Planshet / Monitor bosilsa
    if (fpsQaralganIdish?.userData?.kalit === "lab_planshet" || fpsQaralganStansiya === "lab_planshet") {
      shishaUrilishi(2200);
      if (typeof onPlanshetBosildi === "function") {
        onPlanshetBosildi();
      }
      return;
    }

    // 12. Agar Devor / Stend stansiyalari tanlangan bo'lsa (Davriy jadval, Titrlash, Elektroliz)
    if (!fpsQolIdish && fpsQaralganStansiya && !["tarozi_tara", "tarozi_nol", "rakovina_kran", "lab_planshet", "titrlash_kran", "elektroliz_tok", "xavfsizlik_dushi", "koz_yuvish"].includes(fpsQaralganStansiya)) {
      shishaUrilishi(2200);
      if (typeof onStansiyaOchildi === "function") {
        onStansiyaOchildi(fpsQaralganStansiya);
      }
      return;
    }

    // 9. Agar devor javonidagi reagent shishasiga qaralgan bo'lsa
    if (!fpsQolIdish && fpsQaralganIdish?.userData?.devorShishasi) {
      const kalit = fpsQaralganIdish.userData.kalit;
      tiqinOchilishi();
      if (typeof onIdishTanlandi === "function") {
        onIdishTanlandi(fpsQaralganIdish);
      }
      fpsQaralganIdish.userData.qolda = true;
      fpsQaralganIdish.userData.kotarilgan = true;
      setFpsQolIdish(fpsQaralganIdish);
      return;
    }

    // 10. Agar qo'lda idish bo'lsa -> Qaralgan joyga qo'yish, yuvish yoki quyish
    if (fpsQolIdish) {
      const held = fpsQolIdish;

      // Agar G bosilgan bo'lsa yoki devor shishasi bo'lib devor javoniga qaralgan bo'lsa -> Javonga qaytarish
      if (held.userData?.devorShishasi && (amal === "javonga_qaytar" || fpsQaralganStansiya === "devor_javoni")) {
        tiqinOchilishi();
        if (typeof onJavongaQaytar === "function") {
          onJavongaQaytar();
        }
        setFpsQolIdish(null);
        return;
      }

      // Agar G bosilgan bo'lsa -> To'g'ridan-to'g'ri stolga qo'yish
      if (amal === "stolga_qoy") {
        const dir = new THREE.Vector3();
        kameraRef.current.getWorldDirection(dir);
        const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.0);

        held.position.set(Math.max(-1.5, Math.min(1.5, dropPos.x)), 0.90, Math.max(-0.6, Math.min(0.6, dropPos.z)));
        held.rotation.set(0, 0, 0);
        held.userData.qolda = false;
        held.userData.kotarilgan = false;
        setFpsQolIdish(null);
        shishaUrilishi(2000);
        return;
      }

      // Maxsus stansiyalarga qo'yish yoki aralashtirish
      if (fpsQaralganIdish && fpsQaralganIdish !== held) {
        const targetKalit = fpsQaralganIdish.userData?.kalit;

        // Agar qo'lda Shisha tayoqcha bo'lsa -> Aralashtirish
        if (held.userData?.kalit === "shisha-tayoqcha" && fpsQaralganIdish.userData?.sigim > 0) {
          shishaUrilishi(3200);
          if (typeof onAralashtirish === "function") {
            onAralashtirish(fpsQaralganIdish);
          }
          return;
        }

        // Agar qo'lda Spatula bo'lsa -> Kukun olish yoki solish
        if (held.userData?.kalit === "spatula") {
          shishaUrilishi(2600);
          if (typeof onSpatulaAmal === "function") {
            onSpatulaAmal(fpsQaralganIdish, held);
          }
          return;
        }

        // Tarozi pallasiga qo'yish
        if (targetKalit === "tarozi" || targetKalit === "tarozi_palla" || fpsQaralganStansiya === "tarozi") {
          held.position.set(-3.2, 1.014, 0.18);
          held.rotation.set(0, 0, 0);
          held.userData.tarozida = true;
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onTaroziTushdi === "function") onTaroziTushdi(held);
          return;
        }

        // Spirtovka ustiga qo'yish
        if (targetKalit === "spirtovka") {
          held.position.set(fpsQaralganIdish.position.x, 1.08, fpsQaralganIdish.position.z);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onSpirtovkagaQoyildi === "function") onSpirtovkagaQoyildi(held);
          return;
        }

        // Rakovinada yuvish
        if (targetKalit === "rakovina" || targetKalit === "rakovina_kran" || fpsQaralganStansiya === "yuvinish") {
          if (typeof onRakovinagaTushdi === "function") {
            onRakovinagaTushdi(held);
          }
          return;
        }

        // Boshqa idishga quyish
        if (fpsQaralganIdish.userData?.sigim > 0 || fpsQaralganIdish.userData?.tanlanadi) {
          if (typeof onQuyishBoshla === "function") {
            onQuyishBoshla(held.userData?.kalit, fpsQaralganIdish, held, 45);
          }
          return;
        }
      }

      // Erkin stol ustiga tushirish
      const dir = new THREE.Vector3();
      kameraRef.current.getWorldDirection(dir);
      const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.0);

      held.position.set(Math.max(-1.5, Math.min(1.5, dropPos.x)), 0.90, Math.max(-0.6, Math.min(0.6, dropPos.z)));
      held.rotation.set(0, 0, 0);
      held.userData.qolda = false;
      held.userData.kotarilgan = false;
      setFpsQolIdish(null);
      shishaUrilishi(2000);
      return;
    }

    // 9. Agar qo'l bo'sh bo'lsa va oddiy idishga qaralgan bo'lsa -> Qo'lga olish
    if (fpsQaralganIdish && !fpsQaralganIdish.userData?.stendJihozi) {
      const target = fpsQaralganIdish;
      target.userData.qolda = true;
      target.userData.kotarilgan = true;
      if (target.userData.tarozida && typeof onTarozidanOlingan === "function") {
        onTarozidanOlingan(target);
        target.userData.tarozida = false;
      }
      setFpsQolIdish(target);
      shishaUrilishi(2400);
      tiqinOchilishi();

      if (typeof onIdishTanlandi === "function") {
        onIdishTanlandi(target);
      }
    }
  }, [fpsQolIdish, fpsQaralganIdish, fpsQaralganStansiya, kameraRef, sahnaRef, onIdishTanlandi, onQuyishBoshla, onTaroziTushdi, onTarozidanOlingan, onTaroziTara, onTaroziNol, onSpirtovkaBosildi, onSpirtovkagaQoyildi, onRakovinaKraniBosildi, onRakovinagaTushdi, onPlanshetBosildi, onStansiyaOchildi, onStenddanJihozOlish, onJavongaQaytar]);

  // 1. KLAVIATURA HODISALARI (CS 1.6 + E / F / G / C / 1-5)
  useEffect(() => {
    if (!yurishRejimi) return;

    const handleKeyDown = (e) => {
      const k = e.code;
      if (k === "KeyW" || k === "ArrowUp") keysRef.current.w = true;
      if (k === "KeyS" || k === "ArrowDown") keysRef.current.s = true;
      if (k === "KeyA" || k === "ArrowLeft") keysRef.current.a = true;
      if (k === "KeyD" || k === "ArrowRight") keysRef.current.d = true;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = true;

      // Cho'qqayish (Crouch)
      if (k === "KeyC" || k === "ControlLeft" || k === "ControlRight") {
        keysRef.current.crouch = true;
        targetEyeHeightRef.current = 1.05;
      }

      // E yoki F — Ushlash / Quyish / Faollashtirish
      if (k === "KeyE" || k === "KeyF") {
        qolgaOlYokiQoy("asosiy");
      }

      // G — Stolga qo'yish yoki Javonga qaytarish
      if (k === "KeyG") {
        if (fpsQolIdish?.userData?.devorShishasi) {
          qolgaOlYokiQoy("javonga_qaytar");
        } else {
          qolgaOlYokiQoy("stolga_qoy");
        }
      }

      // 1, 2, 3, 4, 5 — Tezkor aniq hajmlar
      if (k === "Digit1" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(1);
      if (k === "Digit2" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(5);
      if (k === "Digit3" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(10);
      if (k === "Digit4" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(25);
      if (k === "Digit5" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(50);

      if (k === "Space") {
        if (eyeHeightRef.current <= 1.62 && !keysRef.current.crouch) {
          verticalVelocityRef.current = 3.2;
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.code;
      if (k === "KeyW" || k === "ArrowUp") keysRef.current.w = false;
      if (k === "KeyS" || k === "ArrowDown") keysRef.current.s = false;
      if (k === "KeyA" || k === "ArrowLeft") keysRef.current.a = false;
      if (k === "KeyD" || k === "ArrowRight") keysRef.current.d = false;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = false;
      if (k === "KeyC" || k === "ControlLeft" || k === "ControlRight") {
        keysRef.current.crouch = false;
        targetEyeHeightRef.current = 1.58;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [yurishRejimi, qolgaOlYokiQoy, onAniqHajmQuy, fpsQolIdish]);

  // 2. CS 1.6 USLUBIDAGI 100% ERKIN SICHQONCHA HARAKATI VA KLIK
  useEffect(() => {
    if (!yurishRejimi || !rendererRef?.current) return;

    const domElement = rendererRef.current.domElement;
    let initialized = false;
    let prevX = 0;
    let prevY = 0;

    const handleMouseMove = (e) => {
      let dx = 0;
      let dy = 0;
      const sens = sezgirlikRef.current || 1.0;

      if (document.pointerLockElement === domElement) {
        dx = (e.movementX || 0) * sens;
        dy = (e.movementY || 0) * sens;
      } else {
        if (!initialized) {
          prevX = e.clientX;
          prevY = e.clientY;
          initialized = true;
          return;
        }
        dx = (e.clientX - prevX) * sens;
        dy = (e.clientY - prevY) * sens;
        prevX = e.clientX;
        prevY = e.clientY;
      }

      rotationRef.current.yaw -= dx * 0.0028;
      rotationRef.current.pitch -= dy * 0.0028;
      rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) { // Left Click
        if (document.pointerLockElement !== domElement) {
          domElement.requestPointerLock?.();
        }
        qolgaOlYokiQoy("asosiy");
        quyishBosilganRef.current = true;
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        quyishBosilganRef.current = false;
        if (typeof onQuyishToxtat === "function") {
          onQuyishToxtat();
        }
      }
    };

    const handleWheel = (e) => {
      if (fpsQolIdish && fpsQaralganIdish) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 5 : -5;
        if (typeof onAniqHajmQuy === "function") {
          onAniqHajmQuy(Math.abs(delta));
        }
      }
    };

    const handlePointerLockChange = () => {
      initialized = false;
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    window.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    domElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      window.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      domElement.removeEventListener("wheel", handleWheel);
    };
  }, [yurishRejimi, rendererRef, qolgaOlYokiQoy, onQuyishToxtat, onAniqHajmQuy, fpsQolIdish, fpsQaralganIdish]);

  // 3. ASOSIY FPS HARAKATLANISH, KOLLIZIYA VA CROSSHAIR SIKLI
  useEffect(() => {
    if (!yurishRejimi || !kameraRef?.current || !sahnaRef?.current) return;

    const kamera = kameraRef.current;
    const sahna = sahnaRef.current;
    oldingiVaqtRef.current = performance.now();

    const fpsLoop = () => {
      kadrIdRef.current = requestAnimationFrame(fpsLoop);

      const hozir = performance.now();
      const dt = Math.min(0.08, (hozir - oldingiVaqtRef.current) / 1000);
      oldingiVaqtRef.current = hozir;

      const keys = keysRef.current;
      const analog = analogRef.current;

      // 1. Normalizatsiyalangan kirish signallari
      let rawFwd = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
      let rawStr = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);

      if (analog.vx !== 0 || analog.vz !== 0) {
        rawStr = analog.vx;
        rawFwd = -analog.vz;
      }

      const inputLen = Math.hypot(rawFwd, rawStr);
      let forward = 0;
      let strafe = 0;

      if (inputLen > 0.05) {
        forward = rawFwd / Math.max(1, inputLen);
        strafe = rawStr / Math.max(1, inputLen);
      }

      const isSprint = keys.sprint || analog.sprint;
      const isCrouch = keys.crouch;
      const maxSpeed = isCrouch ? 1.4 : isSprint ? 5.2 : 2.8; // m/s
      const isMoving = inputLen > 0.05;

      setYurmoqda(isMoving);

      // 2. Kamera yo'nalish vektorlari
      const yaw = rotationRef.current.yaw;
      const pitch = rotationRef.current.pitch;

      const forwardVec = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
      const rightVec = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

      const targetVel = new THREE.Vector3();
      if (isMoving) {
        targetVel.addScaledVector(forwardVec, forward);
        targetVel.addScaledVector(rightVec, strafe);
        targetVel.multiplyScalar(maxSpeed);
      }

      velocityRef.current.lerp(targetVel, dt * (isMoving ? 12 : 16));

      // Yangi xom pozitsiya
      let nextX = kamera.position.x + velocityRef.current.x * dt;
      let nextZ = kamera.position.z + velocityRef.current.z * dt;

      // 1. Asosiy markaziy stol to'sig'i itarishi (X: [-1.6, 1.6], Z: [-0.8, 0.8])
      const cMain = stolKolliziyasi(nextX, nextZ, -1.6, 1.6, -0.8, 0.8, 0.45);
      nextX = cMain.x;
      nextZ = cMain.z;

      // 2. Chap stol to'sig'i itarishi (X: [-4.2, -2.2], Z: [-0.5, 0.9])
      const cLeft = stolKolliziyasi(nextX, nextZ, -4.2, -2.2, -0.5, 0.9, 0.45);
      nextX = cLeft.x;
      nextZ = cLeft.z;

      // 3. O'ng stol to'sig'i itarishi (X: [2.2, 4.2], Z: [-0.5, 0.9])
      const cRight = stolKolliziyasi(nextX, nextZ, 2.2, 4.2, -0.5, 0.9, 0.45);
      nextX = cRight.x;
      nextZ = cRight.z;

      // 4. Chap orqa rakovina to'sig'i (X: [-6.0, -5.0], Z: [-5.3, -4.3])
      const cSink = stolKolliziyasi(nextX, nextZ, -6.0, -5.0, -5.3, -4.3, 0.45);
      nextX = cSink.x;
      nextZ = cSink.z;

      // 5. Qat'iy xona devorlari va eshik chegarasi
      kamera.position.x = Math.max(-7.2, Math.min(7.2, nextX));
      kamera.position.z = Math.max(-4.8, Math.min(5.2, nextZ));

      // Ko'z balandligi va cho'qqayish lerp
      eyeHeightRef.current = THREE.MathUtils.lerp(eyeHeightRef.current, targetEyeHeightRef.current, dt * 10);

      // Gravitatsiya va sakrash
      if (verticalVelocityRef.current !== 0 || eyeHeightRef.current > targetEyeHeightRef.current) {
        verticalVelocityRef.current -= 9.8 * dt;
        eyeHeightRef.current += verticalVelocityRef.current * dt;

        if (eyeHeightRef.current <= targetEyeHeightRef.current) {
          eyeHeightRef.current = targetEyeHeightRef.current;
          verticalVelocityRef.current = 0;
        }
      }

      // Qadam tovushi va Head-Bobbing
      if (isMoving && eyeHeightRef.current <= 1.62 && !isCrouch) {
        bobbingRef.current += dt * (isSprint ? 16 : 10);
        kamera.position.y = eyeHeightRef.current + Math.sin(bobbingRef.current) * 0.024;

        qadamVaqtiRef.current += dt;
        if (qadamVaqtiRef.current > (isSprint ? 0.28 : 0.44)) {
          qadamTovushi();
          qadamVaqtiRef.current = 0;
        }
      } else {
        kamera.position.y = eyeHeightRef.current;
      }

      // Kamera yo'nalishi
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const lookTarget = kamera.position.clone().add(lookDir);
      kamera.lookAt(lookTarget);

      // 3. FPS QO'LDAGI IDISHNI KAMERA OLDIGA MAHKAMLASH
      if (fpsQolIdish) {
        const handOffset = new THREE.Vector3(0.24, -0.22, -0.48);
        handOffset.applyEuler(kamera.rotation);
        const handPos = kamera.position.clone().add(handOffset);

        fpsQolIdish.position.lerp(handPos, 0.45);
        fpsQolIdish.rotation.copy(kamera.rotation);
      }

      // 4. CROSSHAIR RAYCASTING (Nishondagi idish yoki stansiyani aniqlash)
      centerRaycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), kamera);
      const hits = centerRaycasterRef.current.intersectObjects(sahna.children, true);

      let foundIdish = null;
      let foundStansiya = null;
      let promptText = "";
      let promptType = "oddiy";

      for (const hit of hits) {
        if (hit.distance > 3.4) break;

        const obj = hit.object;

        // Maxsus stansiyalar va tugmalarni tekshirish
        let ota = obj;
        while (ota) {
          if (ota.userData?.kalit === "tarozi_tara") {
            foundStansiya = "tarozi_tara";
            foundIdish = ota;
            promptText = "[E / Klik] Tarozini TARA qilish (Nolga tenglashtirish)";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "tarozi_nol") {
            foundStansiya = "tarozi_nol";
            foundIdish = ota;
            promptText = "[E / Klik] Tarozini NOLGA qaytarish";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "rakovina_kran") {
            foundStansiya = "rakovina_kran";
            foundIdish = ota;
            promptText = "[E / Klik] Distillangan suv kranini burash";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "lab_planshet") {
            foundStansiya = "lab_planshet";
            foundIdish = ota;
            promptText = "[E / Klik] Reaksiya Tahlili va Ilmiy Hisobot";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "titrlash_kran") {
            foundStansiya = "titrlash_kran";
            foundIdish = ota;
            promptText = "[E / Klik] Byuretka kranini burash (Tomchilatish / To'xtatish)";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "elektroliz_tok") {
            foundStansiya = "elektroliz_tok";
            foundIdish = ota;
            promptText = "[E / Klik] DC Tok Manbaini yoqish / o'chirish (Faradey Elektrolizi)";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "xavfsizlik_dushi" || ota.name === "Xavfsizlik_Dushi_Stansiyasi") {
            foundStansiya = "xavfsizlik_dushi";
            foundIdish = ota;
            promptText = "[E / Klik] Favqulodda Xavfsizlik Dushini tortish (Zararsizlantirish)";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "koz_yuvish") {
            foundStansiya = "koz_yuvish";
            foundIdish = ota;
            promptText = "[E / Klik] Ko'z Yuvish Favvorasini ochish";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "himoya_kozoynagi") {
            foundIdish = ota;
            promptText = "[E / Klik] Kimyoviy Himoya Ko'zoynagini taqish / yechish";
            promptType = "urgu";
            break;
          }
          if (ota.userData?.kalit === "gaz_niqobi") {
            foundIdish = ota;
            promptText = "[E / Klik] Kimyoviy Gaz Niqobini (Respirator) taqish / yechish";
            promptType = "urgu";
            break;
          }
          if (ota.name === "Davriy_Jadval_LED_Plakat" || ota.userData?.kalit === "davriy_jadval") {
            foundStansiya = "davriy_jadval";
            promptText = "[E / Klik] Mendeleyev Davriy Jadvali (IUPAC)";
            promptType = "urgu";
            break;
          }
          if (ota.name === "Titrlash_Byuretka_Stansiyasi" || ota.userData?.kalit === "titrlash") {
            foundStansiya = "titrlash";
            promptText = "[E / Klik] 50ml Byuretka Titrlash Stendi";
            promptType = "urgu";
            break;
          }
          if (ota.name === "Elektroliz_Stansiyasi" || ota.userData?.kalit === "elektroliz") {
            foundStansiya = "elektroliz";
            promptText = "[E / Klik] Tok Manbai va Elektroliz Stendi";
            promptType = "urgu";
            break;
          }
          if (ota.name === "Tarozi_Stansiyasi" || ota.userData?.kalit === "tarozi") {
            foundStansiya = "tarozi";
            break;
          }
          if (ota.name === "Yuvinish_Rakovinasi" || ota.userData?.kalit === "rakovina") {
            foundStansiya = "yuvinish";
            break;
          }
          if (ota.name === "3D_Devor_Reagent_Shkaflari") {
            foundStansiya = "devor_javoni";
          }
          ota = ota.parent;
        }

        if (foundStansiya && promptText) break;

        let joriy = obj;
        while (joriy) {
          if (joriy.userData && joriy.userData.tanlanadi && joriy.userData.kalit && joriy !== fpsQolIdish) {
            foundIdish = joriy;
            break;
          }
          joriy = joriy.parent;
        }

        if (foundIdish) break;
      }

      // Dinamik Cyber-HUD matnlarini shakllantirish
      if (fpsQolIdish) {
        const heldNom = fpsQolIdish.userData?.nom || fpsQolIdish.userData?.kalit || "Idish";

        if (foundIdish && foundIdish !== fpsQolIdish) {
          const targetNom = foundIdish.userData?.nom || foundIdish.userData?.kalit || "Idish";

          if (fpsQolIdish.userData?.kalit === "shisha-tayoqcha" && (foundIdish.userData?.sigim > 0 || foundIdish.userData?.tanlanadi)) {
            promptText = `[E / Klik] ${targetNom}ni shisha tayoqcha bilan aralashtirish (Reaksiya jadallashuvi)`;
            promptType = "urgu";
          } else if (fpsQolIdish.userData?.kalit === "spatula") {
            if (foundIdish.userData?.devorShishasi || foundIdish.userData?.kalit?.startsWith("Cu") || foundIdish.userData?.kalit?.startsWith("Ag") || foundIdish.userData?.kalit?.startsWith("KMn") || foundIdish.userData?.kalit?.startsWith("Fe") || foundIdish.userData?.kalit?.startsWith("Ba")) {
              promptText = `[E / Klik] 1.0g ${targetNom} kukunini spatulaga olish`;
              promptType = "urgu";
            } else if (foundIdish.userData?.sigim > 0) {
              promptText = `[E / Klik] 1.0g kukunni ${targetNom}ga solish va eritish`;
              promptType = "quyish";
            }
          } else if (foundIdish.userData?.kalit === "spirtovka") {
            promptText = `[E / Klik] ${heldNom}ni spirtovka ustiga qo'yish`;
            promptType = "urgu";
          } else if (foundIdish.userData?.kalit === "tarozi" || foundIdish.userData?.kalit === "tarozi_palla" || foundStansiya === "tarozi") {
            promptText = `[E / Klik] ${heldNom}ni tarozi pallasiga qo'yish`;
            promptType = "urgu";
          } else if (foundIdish.userData?.kalit === "rakovina" || foundStansiya === "yuvinish") {
            promptText = `[E / Klik] ${heldNom}ni rakovinada yuvish va tozalash`;
            promptType = "yuvish";
          } else if (foundIdish.userData?.sigim > 0 || foundIdish.userData?.tanlanadi) {
            promptText = `[E / LMB] ${targetNom}ga quyish | [1-5] Doza | [G] Stolga`;
            promptType = "quyish";
          }
        } else if (foundStansiya === "devor_javoni" && fpsQolIdish.userData?.devorShishasi) {
          promptText = `[E / G] ${heldNom}ni o'z devor javoniga qaytarish`;
          promptType = "urgu";
        } else {
          promptText = `[E / G] ${heldNom}ni stolga qo'yish`;
          promptType = "oddiy";
        }
      } else {
        if (foundIdish) {
          const targetNom = foundIdish.userData?.nom || foundIdish.userData?.kalit || "Jihoz";

          if (foundIdish.userData?.stendJihozi) {
            promptText = `[E / Klik] Yangi toza ${targetNom}ni olish`;
            promptType = "olish";
          } else if (foundIdish.userData?.devorShishasi) {
            const joriy = Math.round(foundIdish.userData?.joriyHajm || 500);
            const sigim = foundIdish.userData?.sigim || 500;
            promptText = `[E / Klik] ${targetNom} (${joriy}/${sigim}ml) shishasini olish`;
            promptType = "olish";
          } else if (foundIdish.userData?.kalit === "spirtovka") {
            promptText = `[E / Klik] Spirtovkani yoqish / o'chirish (Hozir: ${isitimoda ? "YONMOQDA" : "O'CHIQ"})`;
            promptType = "urgu";
          } else if (!promptText) {
            promptText = `[E / Klik] ${targetNom}ni qo'lga olish`;
            promptType = "olish";
          }
        }
      }

      if (foundIdish !== avvalgiFpsYoritilganRef.current) {
        avvalgiFpsYoritilganRef.current = foundIdish;
        setFpsQaralganIdish(foundIdish);
      }
      setFpsQaralganStansiya(foundStansiya);
      setFpsKontekstMatn(promptText);
      setFpsKontekstTuri(promptType);
    };

    kadrIdRef.current = requestAnimationFrame(fpsLoop);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [yurishRejimi, kameraRef, sahnaRef, fpsQolIdish, isitimoda]);

  // Mobil Joystik boshqaruvi
  const handleJoystickHarakat = useCallback((vx, vz, isSprint) => {
    analogRef.current = { vx, vz, sprint: isSprint };
  }, []);

  const handleJoystickBurilish = useCallback((dx, dy) => {
    const sens = sezgirlikRef.current || 1.0;
    rotationRef.current.yaw -= dx * 0.0055 * sens;
    rotationRef.current.pitch -= dy * 0.0055 * sens;
    rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
  }, []);

  return {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    fpsQaralganIdish,
    fpsQolIdish,
    fpsQaralganStansiya,
    fpsKontekstMatn,
    fpsKontekstTuri,
    qolgaOlYokiQoy,
    sezgirlik,
    sezgirlikniOzgartir,
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
