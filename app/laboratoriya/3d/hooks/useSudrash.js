"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// Idish guruhini (THREE.Group) ildizgacha qidirib topuvchi yordamchi funksiya.
// Nega: Raycaster idishning ichki meshlaridan birini (masalan, silindr yoki yorliqni)
// topadi; bizga esa uning ota guruhi (userData.kalit bor Group) kerak.
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

// 3D sahnadagi idishlarni sichqoncha yoki sensorli ekran (touch) orqali tanlash va
// ustiga kelganda yoritish (hover emissive) hooki.
// Nega pointerdown/move/up ishlatildi: mobile touch va sichqoncha hodisalarini bitta
// yagona API orqali barqaror qayta ishlash imkonini beradi.
export function useSudrash({ sahnaRef, kameraRef, rendererRef, onIdishTanlandi }) {
  const [tanlanganIdish, setTanlanganIdish] = useState(null);
  const [kursorIdish, setKursorIdish] = useState(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const avvalgiYoritilganRef = useRef(null);

  // Meshning emissive rangini yoritish yoki asliga qaytarish
  const yoritishniOzgartir = useCallback((group, yorit) => {
    if (!group) return;
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        // Yorliq va suyuqliklarni yoritmaymiz, faqat shisha yoki metall tanani
        if (child === group.userData.suyuqlikMesh || child === group.userData.chokmaMesh) return;
        if (child.material.emissive) {
          if (yorit) {
            child.userData.aslEmissive = child.material.emissive.getHex();
            child.material.emissive.setHex(0x38bdf8);
            child.material.emissiveIntensity = 0.35;
          } else {
            const asl = child.userData.aslEmissive || 0x000000;
            child.material.emissive.setHex(asl);
            child.material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    const rendererElement = rendererRef?.current?.domElement;
    if (!rendererElement || !sahnaRef?.current || !kameraRef?.current) return;

    // Kursor koordinatularini normalizatsiya qilish (-1 dan 1 gacha)
    const koordinataniHisobla = (event) => {
      const rect = rendererElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    };

    const handlePointerMove = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return;
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);
      const kesishmalar = raycasterRef.current.intersectObjects(sahnaRef.current.children, true);

      let topilganGroup = null;
      for (const kesish of kesishmalar) {
        const group = idishGuruhiniTop(kesish.object);
        if (group) {
          topilganGroup = group;
          break;
        }
      }

      if (topilganGroup !== avvalgiYoritilganRef.current) {
        if (avvalgiYoritilganRef.current) {
          yoritishniOzgartir(avvalgiYoritilganRef.current, false);
        }
        if (topilganGroup) {
          yoritishniOzgartir(topilganGroup, true);
          rendererElement.style.cursor = "pointer";
        } else {
          rendererElement.style.cursor = "default";
        }
        avvalgiYoritilganRef.current = topilganGroup;
        setKursorIdish(topilganGroup);
      }
    };

    // Nega hodisalar window ga emas, renderer.domElement ga qo'yiladi: UI panellar
    // yoki sahifaning boshqa qismlari bosilganda 3D raycaster chaqirib xato tanlov qilmasligi uchun.
    const handlePointerDown = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return;
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);
      const kesishmalar = raycasterRef.current.intersectObjects(sahnaRef.current.children, true);

      let topilganGroup = null;
      for (const kesish of kesishmalar) {
        const group = idishGuruhiniTop(kesish.object);
        if (group) {
          topilganGroup = group;
          break;
        }
      }

      setTanlanganIdish(topilganGroup);
      if (topilganGroup && typeof onIdishTanlandi === "function") {
        onIdishTanlandi(topilganGroup);
      }
    };

    const handlePointerLeave = () => {
      if (avvalgiYoritilganRef.current) {
        yoritishniOzgartir(avvalgiYoritilganRef.current, false);
        avvalgiYoritilganRef.current = null;
        setKursorIdish(null);
      }
      rendererElement.style.cursor = "default";
    };

    rendererElement.addEventListener("pointermove", handlePointerMove);
    rendererElement.addEventListener("pointerdown", handlePointerDown);
    rendererElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      rendererElement.removeEventListener("pointermove", handlePointerMove);
      rendererElement.removeEventListener("pointerdown", handlePointerDown);
      rendererElement.removeEventListener("pointerleave", handlePointerLeave);
      if (avvalgiYoritilganRef.current) {
        yoritishniOzgartir(avvalgiYoritilganRef.current, false);
      }
    };
  }, [sahnaRef, kameraRef, rendererRef, yoritishniOzgartir, onIdishTanlandi]);

  return {
    tanlanganIdish,
    setTanlanganIdish,
    kursorIdish,
  };
}