"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi } from "../lib/ovoz.js";

/**
 * 1-QADAM: 16x12m KATTA XONADA PUBG DUAL JOYSTIK BILAN ERKIN YURISH (Free Roam 360°).
 */
export function useYurish({ sahnaRef, kameraRef, rendererRef, controlsRef }) {
  const [yurishRejimi, setYurishRejimi] = useState(false);
  const [tezlik, setTezlik] = useState(2.8); // m/s
  const [yurmoqda, setYurmoqda] = useState(false);

  const harakatRef = useRef({ forward: 0, backward: 0, left: 0, right: 0, sprint: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false }); // Analog joystik vektori
  const kursorRef = useRef({ yaw: 0, pitch: 0 });
  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingFazaRef = useRef(0);

  const aslKameraRef = useRef({ pos: new THREE.Vector3(0, 1.55, 2.3), target: new THREE.Vector3(0, 0.95, 0.3) });

  // Rejimni almashtirish
  const toggleYurishRejimi = useCallback(() => {
    setYurishRejimi((prev) => {
      const yangi = !prev;

      if (kameraRef?.current && controlsRef?.current) {
        if (yangi) {
          aslKameraRef.current.pos.copy(kameraRef.current.position);
          aslKameraRef.current.target.copy(controlsRef.current.target);

          controlsRef.current.enabled = false;

          kameraRef.current.position.y = 1.6;
          kursorRef.current.yaw = Math.atan2(
            -kameraRef.current.position.x,
            -kameraRef.current.position.z
          );
          kursorRef.current.pitch = 0;
        } else {
          controlsRef.current.enabled = true;
          kameraRef.current.position.copy(aslKameraRef.current.pos);
          controlsRef.current.target.copy(aslKameraRef.current.target);
          controlsRef.current.update();
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef]);

  // Klaviatura hodisalari
  useEffect(() => {
    if (!yurishRejimi) return;

    const handleKeyDown = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          harakatRef.current.forward = 1;
          break;
        case "KeyS":
        case "ArrowDown":
          harakatRef.current.backward = 1;
          break;
        case "KeyA":
        case "ArrowLeft":
          harakatRef.current.left = 1;
          break;
        case "KeyD":
        case "ArrowRight":
          harakatRef.current.right = 1;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          harakatRef.current.sprint = true;
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          harakatRef.current.forward = 0;
          break;
        case "KeyS":
        case "ArrowDown":
          harakatRef.current.backward = 0;
          break;
        case "KeyA":
        case "ArrowLeft":
          harakatRef.current.left = 0;
          break;
        case "KeyD":
        case "ArrowRight":
          harakatRef.current.right = 0;
          break;
        case "ShiftLeft":
        case "ShiftRight":
          harakatRef.current.sprint = false;
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [yurishRejimi]);

  // Kompyuterda sichqoncha bilan qarash
  useEffect(() => {
    if (!yurishRejimi || !rendererRef?.current) return;

    const domElement = rendererRef.current.domElement;
    let bosildi = false;
    let oldingiX = 0;
    let oldingiY = 0;

    const handleMouseDown = (e) => {
      bosildi = true;
      oldingiX = e.clientX;
      oldingiY = e.clientY;
    };

    const handleMouseMove = (e) => {
      if (!bosildi) return;
      const dx = e.clientX - oldingiX;
      const dy = e.clientY - oldingiY;
      oldingiX = e.clientX;
      oldingiY = e.clientY;

      kursorRef.current.yaw -= dx * 0.0035;
      kursorRef.current.pitch -= dy * 0.0035;
      kursorRef.current.pitch = Math.max(-1.4, Math.min(1.4, kursorRef.current.pitch));
    };

    const handleMouseUp = () => {
      bosildi = false;
    };

    domElement.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      domElement.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [yurishRejimi, rendererRef]);

  // 16x12m Katta Xonada 360° Harakatlanish Fizika Sikli
  useEffect(() => {
    if (!yurishRejimi || !kameraRef?.current) return;

    const kamera = kameraRef.current;
    oldingiVaqtRef.current = performance.now();

    const yurishSikli = () => {
      kadrIdRef.current = requestAnimationFrame(yurishSikli);

      const hozir = performance.now();
      const dt = Math.min(0.1, (hozir - oldingiVaqtRef.current) / 1000);
      oldingiVaqtRef.current = hozir;

      const h = harakatRef.current;
      const a = analogRef.current;

      // Klaviatura yoki Joystik orqali vektor
      let moveZ = -(h.forward - h.backward);
      let moveX = h.right - h.left;

      // Agar joystik ishlatilayotgan bo'lsa
      if (a.vx !== 0 || a.vz !== 0) {
        moveX = a.vx;
        moveZ = a.vz;
      }

      const isMoving = Math.hypot(moveX, moveZ) > 0.05;
      setYurmoqda(isMoving);

      const isSprint = h.sprint || a.sprint;
      const joriyTezlik = (isSprint ? tezlik * 1.9 : tezlik) * dt;

      // Forward va Right yo'nalish vektorlari (Yaw bo'yicha)
      const forwardVec = new THREE.Vector3(
        -Math.sin(kursorRef.current.yaw),
        0,
        -Math.cos(kursorRef.current.yaw)
      ).normalize();

      const rightVec = new THREE.Vector3(
        Math.cos(kursorRef.current.yaw),
        0,
        -Math.sin(kursorRef.current.yaw)
      ).normalize();

      if (isMoving) {
        kamera.position.addScaledVector(forwardVec, -moveZ * joriyTezlik);
        kamera.position.addScaledVector(rightVec, moveX * joriyTezlik);

        // Head-bobbing tebranishi
        bobbingFazaRef.current += dt * (isSprint ? 15 : 9.5);
        kamera.position.y = 1.6 + Math.sin(bobbingFazaRef.current) * 0.025;

        // Qadam tovushi
        qadamVaqtiRef.current += dt;
        if (qadamVaqtiRef.current > (isSprint ? 0.3 : 0.46)) {
          qadamTovushi();
          qadamVaqtiRef.current = 0;
        }
      } else {
        kamera.position.y = THREE.MathUtils.lerp(kamera.position.y, 1.6, dt * 6);
      }

      // 16x12m Katta Xona Devorlari Chegarasi (Room Boundaries)
      kamera.position.x = Math.max(-7.4, Math.min(7.4, kamera.position.x));
      kamera.position.z = Math.max(-5.0, Math.min(5.8, kamera.position.z));

      // Qarash nuqtasi
      const lookTarget = new THREE.Vector3(
        kamera.position.x - Math.sin(kursorRef.current.yaw) * Math.cos(kursorRef.current.pitch),
        kamera.position.y + Math.sin(kursorRef.current.pitch),
        kamera.position.z - Math.cos(kursorRef.current.yaw) * Math.cos(kursorRef.current.pitch)
      );

      kamera.lookAt(lookTarget);
    };

    kadrIdRef.current = requestAnimationFrame(yurishSikli);

    return () => {
      if (kadrIdRef.current) cancelAnimationFrame(kadrIdRef.current);
    };
  }, [yurishRejimi, tezlik, kameraRef]);

  // PUBG Analog Joystik boshqaruvi
  const handleJoystickHarakat = useCallback((vx, vz, isSprint) => {
    analogRef.current = { vx, vz, sprint: isSprint };
  }, []);

  const handleJoystickBurilish = useCallback((dx, dy) => {
    kursorRef.current.yaw -= dx * 0.005;
    kursorRef.current.pitch -= dy * 0.005;
    kursorRef.current.pitch = Math.max(-1.4, Math.min(1.4, kursorRef.current.pitch));
  }, []);

  return {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
