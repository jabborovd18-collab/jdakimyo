"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi, shishaUrilishi, tiqinOchilishi } from "../lib/ovoz.js";

function idishGuruhiniTop(obyekt) {
  let joriy = obyekt;
  while (joriy) {
    if (joriy.userData && joriy.userData.tanlanadi && joriy.userData.kalit) {
      return joriy;
    }
    joriy = joriy.parent;
  }
  return null;
}

/**
 * CS 1.6 & GARRY'S MOD USLUBIDAGI 100% TO'LIQ BIRINCHI SHAXS (FPS HANDS-ON INTERACTION) DVIGATELI.
 *
 * Imkoniyatlari:
 *  - W, A, S, D + Sichqoncha/Sensor bilan zalda erkin yurish.
 *  - Ekran markazidagi nishon (Crosshair) bilan masofadagi (≤ 2.8m) idishlarni aniqlash.
 *  - E tugmasi (yoki mobil [✋ Qo'l] tugmasi) bilan probirka, kolba yoki devor shishasini qo'lga olish.
 *  - Qo'lda idish bilan zal bo'ylab erkin yurish.
 *  - Boshqa idishga qarab quyish, taroziga qo'yish, spirtovkaga o'rnatish yoki stolga qo'yish.
 */
export function useYurish({
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onQuyishBoshla,
  onTaroziTushdi,
  onSpirtovkagaQoyildi,
  onRakovinagaTushdi,
}) {
  const [yurishRejimi, setYurishRejimi] = useState(false);
  const [yurmoqda, setYurmoqda] = useState(false);
  const [fpsQaralganIdish, setFpsQaralganIdish] = useState(null);
  const [fpsQolIdish, setFpsQolIdish] = useState(null);

  // Harakat klavishlari va holatlar
  const keysRef = useRef({ w: false, s: false, a: false, d: false, sprint: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false });

  // Kamera burchaklari (Yaw: Gorizontal, Pitch: Vertikal)
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const velocityRef = useRef(new THREE.Vector3());

  // Sakrash va balandlik
  const verticalVelocityRef = useRef(0);
  const eyeHeightRef = useRef(1.6); // 1.6m ko'z balandligi

  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingRef = useRef(0);

  const centerRaycasterRef = useRef(new THREE.Raycaster());
  const avvalgiFpsYoritilganRef = useRef(null);

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
          verticalVelocityRef.current = 0;
          velocityRef.current.set(0, 0, 0);
        } else {
          controlsRef.current.enabled = true;
          kameraRef.current.position.copy(aslKameraRef.current.pos);
          controlsRef.current.target.copy(aslKameraRef.current.target);
          controlsRef.current.update();

          if (avvalgiFpsYoritilganRef.current) {
            avvalgiFpsYoritilganRef.current = null;
          }
          setFpsQaralganIdish(null);
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef]);

  // Qo'ldagi idishni boshqarish (Ushlash / Stolga qo'yish / Nishonga o'rnatish)
  const qolgaOlYokiQoy = useCallback(() => {
    if (!kameraRef?.current) return;

    // 1. Agar qo'lda idish bo'lsa -> Qaralgan joyga qo'yish yoki quyish
    if (fpsQolIdish) {
      const held = fpsQolIdish;

      // Agar boshqa idishga qaralgan bo'lsa -> Quyish
      if (fpsQaralganIdish && fpsQaralganIdish !== held) {
        if (fpsQaralganIdish.userData?.kalit === "tarozi") {
          held.position.set(-3.2, 1.014, 0.18);
          held.rotation.set(0, 0, 0);
          held.userData.tarozida = true;
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onTaroziTushdi === "function") onTaroziTushdi(held);
          return;
        } else if (fpsQaralganIdish.userData?.kalit === "spirtovka") {
          held.position.set(fpsQaralganIdish.position.x, 1.08, fpsQaralganIdish.position.z);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          shishaUrilishi(2200);
          if (typeof onSpirtovkagaQoyildi === "function") onSpirtovkagaQoyildi(held);
          return;
        } else if (fpsQaralganIdish.userData?.kalit === "rakovina") {
          held.position.set(-5.5, 0.98, -4.8);
          held.rotation.set(0, 0, 0);
          held.userData.qolda = false;
          setFpsQolIdish(null);
          if (typeof onRakovinagaTushdi === "function") onRakovinagaTushdi(held);
          return;
        } else {
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
      const dropPos = kameraRef.current.position.clone().addScaledVector(dir, 1.1);
      dropPos.y = 0.90; // Stol sirti

      held.position.set(dropPos.x, 0.90, dropPos.z);
      held.rotation.set(0, 0, 0);
      held.userData.qolda = false;
      held.userData.kotarilgan = false;
      setFpsQolIdish(null);
      shishaUrilishi(2000);
      return;
    }

    // 2. Agar qo'l bo'sh bo'lsa va nishonga qaralgan bo'lsa -> Qo'lga olish
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
  }, [fpsQolIdish, fpsQaralganIdish, kameraRef, onIdishTanlandi, onQuyishBoshla, onTaroziTushdi, onSpirtovkagaQoyildi, onRakovinagaTushdi]);

  // 1. KLAVIATURA HODISALARI (CS 1.6 + E USHLASH / G TASHLASH)
  useEffect(() => {
    if (!yurishRejimi) return;

    const handleKeyDown = (e) => {
      const k = e.code;
      if (k === "KeyW" || k === "ArrowUp") keysRef.current.w = true;
      if (k === "KeyS" || k === "ArrowDown") keysRef.current.s = true;
      if (k === "KeyA" || k === "ArrowLeft") keysRef.current.a = true;
      if (k === "KeyD" || k === "ArrowRight") keysRef.current.d = true;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = true;
      if (k === "KeyE" || k === "KeyF" || k === "KeyG") {
        qolgaOlYokiQoy();
      }
      if (k === "Space") {
        if (eyeHeightRef.current <= 1.62) {
          verticalVelocityRef.current = 3.5;
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
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [yurishRejimi, qolgaOlYokiQoy]);

  // 2. SICHQONCHA BILAN QARASH (CS 1.6 MOUSE LOOK & CLICK INTERACTION)
  useEffect(() => {
    if (!yurishRejimi || !rendererRef?.current) return;

    const domElement = rendererRef.current.domElement;
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;
    let downTime = 0;

    const onMouseDown = (e) => {
      isMouseDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
      downTime = performance.now();
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      rotationRef.current.yaw -= dx * 0.0035;
      rotationRef.current.pitch -= dy * 0.0035;
      rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
    };

    const onMouseUp = () => {
      if (isMouseDown && performance.now() - downTime < 220) {
        // Tez klik -> Obyektni ushlash yoki qo'yish
        qolgaOlYokiQoy();
      }
      isMouseDown = false;
    };

    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [yurishRejimi, rendererRef, qolgaOlYokiQoy]);

  // 3. ASOSIY FPS HARAKATLANISH VA CROSSHAIR INTERACTION SIKLI
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

      // 1. Kirish signallarini hisoblash
      let forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);
      let strafe = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);

      if (analog.vx !== 0 || analog.vz !== 0) {
        strafe = analog.vx;
        forward = -analog.vz;
      }

      const isSprint = keys.sprint || analog.sprint;
      const maxSpeed = isSprint ? 5.5 : 3.0; // m/s
      const isMoving = Math.hypot(forward, strafe) > 0.05;

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
        targetVel.normalize().multiplyScalar(maxSpeed);
      }

      velocityRef.current.lerp(targetVel, dt * (isMoving ? 12 : 16));

      kamera.position.x += velocityRef.current.x * dt;
      kamera.position.z += velocityRef.current.z * dt;

      // Gravitatsiya va sakrash
      if (verticalVelocityRef.current !== 0 || eyeHeightRef.current > 1.6) {
        verticalVelocityRef.current -= 9.8 * dt;
        eyeHeightRef.current += verticalVelocityRef.current * dt;

        if (eyeHeightRef.current <= 1.6) {
          eyeHeightRef.current = 1.6;
          verticalVelocityRef.current = 0;
        }
      }

      // Qadam va Head-Bobbing
      if (isMoving && eyeHeightRef.current <= 1.62) {
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

      // Xona devorlari
      kamera.position.x = Math.max(-7.6, Math.min(7.6, kamera.position.x));
      kamera.position.z = Math.max(-5.2, Math.min(5.8, kamera.position.z));

      // Kamera yo'nalishi
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const lookTarget = kamera.position.clone().add(lookDir);
      kamera.lookAt(lookTarget);

      // 3. FPS QO'LDAGI IDISHNI KAMERA OLDIGA MAHKAMLASH (First-Person Hands View)
      if (fpsQolIdish) {
        const handOffset = new THREE.Vector3(0.24, -0.22, -0.48);
        handOffset.applyEuler(kamera.rotation);
        const handPos = kamera.position.clone().add(handOffset);

        fpsQolIdish.position.lerp(handPos, 0.4);
        fpsQolIdish.rotation.copy(kamera.rotation);
      }

      // 4. CROSSHAIR RAYCASTING (Ekran markazidagi nishon)
      centerRaycasterRef.current.setFromCamera(new THREE.Vector2(0, 0), kamera);
      const hits = centerRaycasterRef.current.intersectObjects(sahna.children, true);

      let found = null;
      for (const hit of hits) {
        if (hit.distance > 3.2) break;
        const g = idishGuruhiniTop(hit.object);
        if (g && g !== fpsQolIdish) {
          found = g;
          break;
        }
      }

      if (found !== avvalgiFpsYoritilganRef.current) {
        avvalgiFpsYoritilganRef.current = found;
        setFpsQaralganIdish(found);
      }
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
    rotationRef.current.yaw -= dx * 0.0055;
    rotationRef.current.pitch -= dy * 0.0055;
    rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
  }, []);

  return {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    fpsQaralganIdish,
    fpsQolIdish,
    qolgaOlYokiQoy,
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
