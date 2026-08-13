"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi } from "../lib/ovoz.js";

/**
 * CS 1.6 USLUBIDAGI 100% MUSTAQIL VA ERKIN YURISH (FIRST-PERSON FPS ENGINE).
 * W (oldinga), S (orqaga), A (chapga strafe), D (o'ngga strafe), Shift (yugurish), Space (sakrash).
 * Hech qanday markazga tortilish yoki orqaga sakrash muammosi bo'lmaydi!
 */
export function useYurish({ sahnaRef, kameraRef, rendererRef, controlsRef }) {
  const [yurishRejimi, setYurishRejimi] = useState(false);
  const [yurmoqda, setYurmoqda] = useState(false);

  // Harakat klavishlari va holatlar
  const keysRef = useRef({ w: false, s: false, a: false, d: false, sprint: false, space: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false });

  // Kamera burchaklari (Yaw: Gorizontal, Pitch: Vertikal)
  const rotationRef = useRef({ yaw: 0, pitch: 0 });
  const velocityRef = useRef(new THREE.Vector3()); // CS inersiya tezligi

  // Sakrash va balandlik
  const verticalVelocityRef = useRef(0);
  const eyeHeightRef = useRef(1.6); // 1.6m ko'z balandligi

  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingRef = useRef(0);

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

          // OrbitControls to'liq o'chiriladi
          controlsRef.current.enabled = false;

          // Joriy qarash burchagini hisoblash
          const dir = new THREE.Vector3();
          kameraRef.current.getWorldDirection(dir);
          rotationRef.current.yaw = Math.atan2(-dir.x, -dir.z);
          rotationRef.current.pitch = Math.asin(Math.max(-0.95, Math.min(0.95, dir.y)));

          eyeHeightRef.current = 1.6;
          verticalVelocityRef.current = 0;
          velocityRef.current.set(0, 0, 0);
        } else {
          // OrbitControls ga silliq qaytarish
          controlsRef.current.enabled = true;
          kameraRef.current.position.copy(aslKameraRef.current.pos);
          controlsRef.current.target.copy(aslKameraRef.current.target);
          controlsRef.current.update();
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef]);

  // 1. KLAVIATURA HODISALARI (CS 1.6 KEYS)
  useEffect(() => {
    if (!yurishRejimi) return;

    const handleKeyDown = (e) => {
      const k = e.code;
      if (k === "KeyW" || k === "ArrowUp") keysRef.current.w = true;
      if (k === "KeyS" || k === "ArrowDown") keysRef.current.s = true;
      if (k === "KeyA" || k === "ArrowLeft") keysRef.current.a = true;
      if (k === "KeyD" || k === "ArrowRight") keysRef.current.d = true;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = true;
      if (k === "Space") {
        if (eyeHeightRef.current <= 1.62) {
          verticalVelocityRef.current = 3.5; // Sakrash kuchi
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
  }, [yurishRejimi]);

  // 2. SICHQONCHA BILAN QARASH (CS 1.6 MOUSE LOOK)
  useEffect(() => {
    if (!yurishRejimi || !rendererRef?.current) return;

    const domElement = rendererRef.current.domElement;
    let isMouseDown = false;
    let lastX = 0;
    let lastY = 0;

    const onMouseDown = (e) => {
      isMouseDown = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isMouseDown) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      rotationRef.current.yaw -= dx * 0.0035;
      rotationRef.current.pitch -= dy * 0.0035;

      // Vertikal burchak chegarasi (-85° dan +85° gacha)
      rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
    };

    const onMouseUp = () => {
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
  }, [yurishRejimi, rendererRef]);

  // 3. ASOSIY FPS HARAKATLANISH VA FIZIKA SIKLI
  useEffect(() => {
    if (!yurishRejimi || !kameraRef?.current) return;

    const kamera = kameraRef.current;
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

      // Agar mobil joystik faol bo'lsa
      if (analog.vx !== 0 || analog.vz !== 0) {
        strafe = analog.vx;
        forward = -analog.vz;
      }

      const isSprint = keys.sprint || analog.sprint;
      const maxSpeed = isSprint ? 5.5 : 3.0; // m/s
      const isMoving = Math.hypot(forward, strafe) > 0.05;

      setYurmoqda(isMoving);

      // 2. Kamera yo'nalish vektorlari (Yaw gorizontal burchak bo'yicha)
      const yaw = rotationRef.current.yaw;
      const pitch = rotationRef.current.pitch;

      const forwardVec = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
      const rightVec = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

      // 3. Nishon tezlik (Target velocity)
      const targetVel = new THREE.Vector3();
      if (isMoving) {
        targetVel.addScaledVector(forwardVec, forward);
        targetVel.addScaledVector(rightVec, strafe);
        targetVel.normalize().multiplyScalar(maxSpeed);
      }

      // 4. CS 1.6 Inersiya va ishqalanish (Damping acceleration)
      velocityRef.current.lerp(targetVel, dt * (isMoving ? 12 : 16));

      // 5. Kamerani siljitish
      kamera.position.x += velocityRef.current.x * dt;
      kamera.position.z += velocityRef.current.z * dt;

      // 6. Sakrash va tortishish kuchi (Gravity)
      if (verticalVelocityRef.current !== 0 || eyeHeightRef.current > 1.6) {
        verticalVelocityRef.current -= 9.8 * dt; // Gravitatsiya
        eyeHeightRef.current += verticalVelocityRef.current * dt;

        if (eyeHeightRef.current <= 1.6) {
          eyeHeightRef.current = 1.6;
          verticalVelocityRef.current = 0;
        }
      }

      // 7. Qadam tovushi va Head-Bobbing
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

      // 8. 16x12m Katta Xona Chegaralari (Room Collision)
      kamera.position.x = Math.max(-7.6, Math.min(7.6, kamera.position.x));
      kamera.position.z = Math.max(-5.2, Math.min(5.8, kamera.position.z));

      // 9. Kamera qarash yo'nalishini o'rnatish (100% erkin qarash)
      const lookDir = new THREE.Vector3(
        -Math.sin(yaw) * Math.cos(pitch),
        Math.sin(pitch),
        -Math.cos(yaw) * Math.cos(pitch)
      );

      const lookTarget = kamera.position.clone().add(lookDir);
      kamera.lookAt(lookTarget);
    };

    kadrIdRef.current = requestAnimationFrame(fpsLoop);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [yurishRejimi, kameraRef]);

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
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
