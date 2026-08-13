"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi, shishaUrilishi, tiqinOchilishi } from "../lib/ovoz.js";

function obyektniTop(obyekt) {
  let joriy = obyekt;
  while (joriy) {
    if (joriy.userData && (joriy.userData.tanlanadi || joriy.userData.kalit || joriy.name)) {
      return joriy;
    }
    joriy = joriy.parent;
  }
  return null;
}

/**
 * CS 1.6 USLUBIDAGI 100% ERKIN SICHQONCHA VA BIRINCHI SHAXS HARAKATLANISH DVIGATELI.
 *
 * Imkoniyatlari:
 *  - Sozlanuvchi sichqoncha sezgirligi (Sensitivity: 0.2x - 2.5x).
 *  - E / F — Ushlash va Quyish (Primary Interact / Pour).
 *  - G — Stolga qo'yish (Place down on table).
 *  - C / Ctrl — Cho'qqayish (Crouch: 1.05m pastki javonlarni ko'rish).
 *  - 1, 2, 3, 4 — Tezkor millilitr quyish.
 *  - Space (sakrash), Shift (yugurish), W/A/S/D (yurish).
 */
export function useYurish({
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onQuyishBoshla,
  onAniqHajmQuy,
  onTaroziTushdi,
  onSpirtovkagaQoyildi,
  onRakovinagaTushdi,
  onStansiyaOchildi,
}) {
  const [yurishRejimi, setYurishRejimi] = useState(false);
  const [yurmoqda, setYurmoqda] = useState(false);
  const [fpsQaralganIdish, setFpsQaralganIdish] = useState(null);
  const [fpsQolIdish, setFpsQolIdish] = useState(null);
  const [fpsQaralganStansiya, setFpsQaralganStansiya] = useState(null);
  const [sezgirlik, setSezgirlik] = useState(1.0); // 0.2 .. 2.5x

  const sezgirlikRef = useRef(1.0);
  sezgirlikRef.current = sezgirlik;

  // Harakat klavishlari va holatlar
  const keysRef = useRef({ w: false, s: false, a: false, d: false, sprint: false, crouch: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false });

  // Kamera burchaklari (Yaw: Gorizontal, Pitch: Vertikal)
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const velocityRef = useRef(new THREE.Vector3());

  // Sakrash, cho'qqayish va ko'z balandligi
  const verticalVelocityRef = useRef(0);
  const targetEyeHeightRef = useRef(1.6);
  const eyeHeightRef = useRef(1.6);

  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingRef = useRef(0);

  const centerRaycasterRef = useRef(new THREE.Raycaster());
  const avvalgiFpsYoritilganRef = useRef(null);

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

          eyeHeightRef.current = 1.6;
          targetEyeHeightRef.current = 1.6;
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
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef, rendererRef]);

  // Qo'ldagi idishni boshqarish va stansiyalarni faollashtirish
  const qolgaOlYokiQoy = useCallback((amal = "asosiy") => {
    if (!kameraRef?.current) return;

    // 1. Agar stansiyaga qaralgan bo'lsa (Davriy jadval, Titrlash, Elektroliz)
    if (!fpsQolIdish && fpsQaralganStansiya) {
      shishaUrilishi(2200);
      if (typeof onStansiyaOchildi === "function") {
        onStansiyaOchildi(fpsQaralganStansiya);
      }
      return;
    }

    // 2. Agar qo'lda idish bo'lsa -> Qaralgan joyga qo'yish yoki quyish
    if (fpsQolIdish) {
      const held = fpsQolIdish;

      // Agar G bosilgan bo'lsa -> To'g'ridan-to'g'ri stolga qo'yish
      if (amal === "stolga_qoy") {
        const dir = new THREE.Vector3();
        kameraRef.current.getWorldDirection(dir);
        const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.0);

        held.position.set(dropPos.x, 0.90, dropPos.z);
        held.rotation.set(0, 0, 0);
        held.userData.qolda = false;
        held.userData.kotarilgan = false;
        setFpsQolIdish(null);
        shishaUrilishi(2000);
        return;
      }

      // Maxsus stansiyalarga qo'yish
      if (fpsQaralganIdish && fpsQaralganIdish !== held) {
        const targetKalit = fpsQaralganIdish.userData?.kalit;

        if (targetKalit === "tarozi" || fpsQaralganStansiya === "tarozi") {
          held.position.set(-3.2, 1.014, 0.18);
          held.rotation.set(0, 0, 0);
          held.userData.tarozida = true;
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onTaroziTushdi === "function") onTaroziTushdi(held);
          return;
        } else if (targetKalit === "spirtovka") {
          held.position.set(fpsQaralganIdish.position.x, 1.08, fpsQaralganIdish.position.z);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onSpirtovkagaQoyildi === "function") onSpirtovkagaQoyildi(held);
          return;
        } else if (targetKalit === "rakovina" || fpsQaralganStansiya === "yuvinish") {
          held.position.set(-5.5, 0.98, -4.8);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          if (typeof onRakovinagaTushdi === "function") onRakovinagaTushdi(held);
          return;
        } else if (fpsQaralganIdish.userData?.sigim > 0) {
          // Boshqa idishga quyish
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

      held.position.set(dropPos.x, 0.90, dropPos.z);
      held.rotation.set(0, 0, 0);
      held.userData.qolda = false;
      held.userData.kotarilgan = false;
      setFpsQolIdish(null);
      shishaUrilishi(2000);
      return;
    }

    // 3. Agar qo'l bo'sh bo'lsa va idishga qaralgan bo'lsa -> Qo'lga olish
    if (fpsQaralganIdish) {
      const target = fpsQaralganIdish;
      target.userData.qolda = true;
      target.userData.kotarilgan = true;
      setFpsQolIdish(target);
      shishaUrilishi(2400);
      tiqinOchilishi();

      if (typeof onIdishTanlandi === "function") {
        onIdishTanlandi(target);
      }
    }
  }, [fpsQolIdish, fpsQaralganIdish, fpsQaralganStansiya, kameraRef, onIdishTanlandi, onQuyishBoshla, onTaroziTushdi, onSpirtovkagaQoyildi, onRakovinagaTushdi, onStansiyaOchildi]);

  // 1. KLAVIATURA HODISALARI (CS 1.6 + E / F / G / C / 1-4)
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
        targetEyeHeightRef.current = 1.05; // Pastki javonlar va stol sirtini ko'rish
      }

      // E yoki F — Ushlash / Quyish
      if (k === "KeyE" || k === "KeyF") {
        qolgaOlYokiQoy("asosiy");
      }

      // G — Stolga qo'yish
      if (k === "KeyG") {
        qolgaOlYokiQoy("stolga_qoy");
      }

      // 1, 2, 3, 4 — Tezkor hajmlar
      if (k === "Digit1" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(1);
      if (k === "Digit2" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(5);
      if (k === "Digit3" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(10);
      if (k === "Digit4" && typeof onAniqHajmQuy === "function") onAniqHajmQuy(25);

      if (k === "Space") {
        if (eyeHeightRef.current <= 1.62 && !keysRef.current.crouch) {
          verticalVelocityRef.current = 3.6;
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
        targetEyeHeightRef.current = 1.6;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [yurishRejimi, qolgaOlYokiQoy, onAniqHajmQuy]);

  // 2. CS 1.6 USLUBIDAGI 100% ERKIN SICHQONCHA HARAKATI
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

    const handleCanvasClick = (e) => {
      if (document.pointerLockElement !== domElement) {
        domElement.requestPointerLock?.();
      }
      qolgaOlYokiQoy("asosiy");
    };

    const handlePointerLockChange = () => {
      initialized = false;
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    window.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("click", handleCanvasClick);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      window.removeEventListener("mousemove", handleMouseMove);
      domElement.removeEventListener("click", handleCanvasClick);
    };
  }, [yurishRejimi, rendererRef, qolgaOlYokiQoy]);

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

      // Yangi pozitsiya va stol to'siqlari kolliziyasi (AABB collision)
      let nextX = kamera.position.x + velocityRef.current.x * dt;
      let nextZ = kamera.position.z + velocityRef.current.z * dt;

      // Asosiy markaziy stol to'sig'i (X: [-1.7, 1.7], Z: [-0.9, 0.9])
      const inMainTable = nextX >= -1.7 && nextX <= 1.7 && nextZ >= -0.9 && nextZ <= 0.9;
      if (inMainTable) {
        if (Math.abs(kamera.position.x) > Math.abs(kamera.position.z)) {
          nextX = kamera.position.x;
        } else {
          nextZ = kamera.position.z;
        }
      }

      kamera.position.x = Math.max(-7.6, Math.min(7.6, nextX));
      kamera.position.z = Math.max(-5.2, Math.min(5.8, nextZ));

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

      for (const hit of hits) {
        if (hit.distance > 3.2) break;

        const obj = hit.object;

        // Maxsus stansiyalarni tekshirish
        let ota = obj;
        while (ota) {
          if (ota.name === "Davriy_Jadval_LED_Plakat") {
            foundStansiya = "davriy_jadval";
            break;
          }
          if (ota.name === "Titrlash_Byuretka_Stansiyasi") {
            foundStansiya = "titrlash";
            break;
          }
          if (ota.name === "Elektroliz_Stansiyasi") {
            foundStansiya = "elektroliz";
            break;
          }
          if (ota.name === "Tarozi_Stansiyasi") {
            foundStansiya = "tarozi";
            break;
          }
          if (ota.name === "Yuvinish_Rakovinasi") {
            foundStansiya = "yuvinish";
            break;
          }
          ota = ota.parent;
        }

        let joriy = obj;
        while (joriy) {
          if (joriy.userData && joriy.userData.tanlanadi && joriy.userData.kalit && joriy !== fpsQolIdish) {
            foundIdish = joriy;
            break;
          }
          joriy = joriy.parent;
        }
      }

      if (foundIdish !== avvalgiFpsYoritilganRef.current) {
        avvalgiFpsYoritilganRef.current = foundIdish;
        setFpsQaralganIdish(foundIdish);
      }
      setFpsQaralganStansiya(foundStansiya);
    };

    kadrIdRef.current = requestAnimationFrame(fpsLoop);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [yurishRejimi, kameraRef, sahnaRef, fpsQolIdish]);

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
    qolgaOlYokiQoy,
    sezgirlik,
    sezgirlikniOzgartir,
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
