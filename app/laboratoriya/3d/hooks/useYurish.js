"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { qadamTovushi } from "../lib/ovoz.js";

/**
 * 3D Laboratoriya Xonasida Erkin Yurish (First-Person Walkthrough) Hooki.
 * WASD / Strelkalar, Sichqoncha va Mobil Sensorlar orqali boshqariladi.
 */
export function useYurish({ sahnaRef, kameraRef, rendererRef, controlsRef }) {
  const [yurishRejimi, setYurishRejimi] = useState(false);
  const [tezlik, setTezlik] = useState(2.2); // m/s
  const [yurmoqda, setYurmoqda] = useState(false);

  // Holatlar va vektorlar
  const harakatRef = useRef({ forward: 0, backward: 0, left: 0, right: 0, sprint: false });
  const kursorRef = useRef({ yaw: 0, pitch: 0 });
  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingFazaRef = useRef(0);

  // Saqlangan dastlabki kamera holati
  const aslKameraRef = useRef({ pos: new THREE.Vector3(0, 1.55, 2.3), target: new THREE.Vector3(0, 0.95, 0) });

  // Rejimni yoqish / o'chirish
  const toggleYurishRejimi = useCallback(() => {
    setYurishRejimi((prev) => {
      const yangi = !prev;

      if (kameraRef?.current && controlsRef?.current) {
        if (yangi) {
          // OrbitControls ni to'xtatamiz
          aslKameraRef.current.pos.copy(kameraRef.current.position);
          aslKameraRef.current.target.copy(controlsRef.current.target);

          controlsRef.current.enabled = false;

          // Ko'z balandligi 1.6m ga keltiriladi
          kameraRef.current.position.y = 1.6;
          kursorRef.current.yaw = Math.atan2(
            -kameraRef.current.position.x,
            -kameraRef.current.position.z
          );
          kursorRef.current.pitch = 0;
        } else {
          // OrbitControls ga qaytarish
          controlsRef.current.enabled = true;
          kameraRef.current.position.copy(aslKameraRef.current.pos);
          controlsRef.current.target.copy(aslKameraRef.current.target);
          controlsRef.current.update();
        }
      }

      return yangi;
    });
  }, [kameraRef, controlsRef]);

  // Klaviatura hodisalarini tinglash
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

  // Sichqoncha orqali qarash (Drag to look)
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

      // Pitch chegarasi (-80° dan +80° gacha)
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

  // Asosiy harakatlanish va xona chegaralari fizika sikli
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
      const moveZ = h.forward - h.backward;
      const moveX = h.right - h.left;
      const isMoving = moveZ !== 0 || moveX !== 0;

      setYurmoqda(isMoving);

      const joriyTezlik = (h.sprint ? tezlik * 1.8 : tezlik) * dt;

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
        kamera.position.addScaledVector(forwardVec, moveZ * joriyTezlik);
        kamera.position.addScaledVector(rightVec, moveX * joriyTezlik);

        // Head bobbing tebranish effekti
        bobbingFazaRef.current += dt * (h.sprint ? 14 : 9);
        kamera.position.y = 1.6 + Math.sin(bobbingFazaRef.current) * 0.025;

        // Qadam tovushi
        qadamVaqtiRef.current += dt;
        if (qadamVaqtiRef.current > (h.sprint ? 0.32 : 0.48)) {
          qadamTovushi();
          qadamVaqtiRef.current = 0;
        }
      } else {
        kamera.position.y = THREE.MathUtils.lerp(kamera.position.y, 1.6, dt * 5);
      }

      // Xona devorlari va to'qnashuv chegaralari (Room Boundaries)
      kamera.position.x = Math.max(-3.4, Math.min(3.4, kamera.position.x));
      kamera.position.z = Math.max(-2.0, Math.min(3.6, kamera.position.z));

      // Kamera qarayotgan nuqtasini hisoblash
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

  // Mobil sensor / Virtual D-pad orqali harakatlantirish
  const mobilHarakat = useCallback((dx, dz) => {
    harakatRef.current.left = dx < -0.2 ? 1 : 0;
    harakatRef.current.right = dx > 0.2 ? 1 : 0;
    harakatRef.current.forward = dz < -0.2 ? 1 : 0;
    harakatRef.current.backward = dz > 0.2 ? 1 : 0;
  }, []);

  const mobilBurilish = useCallback((dyaw, dpitch) => {
    kursorRef.current.yaw -= dyaw * 0.04;
    kursorRef.current.pitch -= dpitch * 0.04;
    kursorRef.current.pitch = Math.max(-1.4, Math.min(1.4, kursorRef.current.pitch));
  }, []);

  return {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    mobilHarakat,
    mobilBurilish,
  };
}
