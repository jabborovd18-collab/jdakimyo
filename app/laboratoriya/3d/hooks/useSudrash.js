"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { shishaUrilishi } from "../lib/ovoz.js";
import { SLOTLAR } from "../lib/sozlama.js";

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
 * 3D Sahnadagi idishlarni erkin ko'tarish, sudrash va stol/nishonlar ustiga qo'yish hooki.
 *
 * 1-BOSQICH IMKONIYATLARI:
 *  1. Idishni bosganda ko'tarish (Y = 1.15m balandlikka ko'tariladi).
 *  2. Stol yuzasi bo'ylab 3D koordinatalarda erkin harakatlantirish.
 *  3. Boshqa idishga yaqinlashganda nishonni avtomatik aniqlash (quyish pozitsiyasi).
 *  4. OrbitControls bilan to'qnashuvsiz ishlash (sudrash paytida kamera qotadi).
 */
export function useSudrash({
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onIdishKotarildi,
  onNishongaYaqinlashdi,
  onIdishQoyildi,
}) {
  const [tanlanganIdish, setTanlanganIdish] = useState(null);
  const [kotarilganIdish, setKotarilganIdish] = useState(null);
  const [kursorIdish, setKursorIdish] = useState(null);
  const [yaqinNishon, setYaqinNishon] = useState(null);
  const [sudralmoqda, setSudralmoqda] = useState(false);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const avvalgiYoritilganRef = useRef(null);

  // Sudrash uchun tekislik (Plane parallel to table at Y = 1.15)
  const sudrashTekisligiRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.15));
  const kesishmaNuqtaRef = useRef(new THREE.Vector3());
  const boshlangichPozitsiyaRef = useRef(new THREE.Vector3());
  const sudrashOffsetRef = useRef(new THREE.Vector3());
  const faolGuruhRef = useRef(null);

  // Emissive yoritish
  const yoritishniOzgartir = useCallback((group, yorit, rang = 0x38bdf8) => {
    if (!group) return;
    group.traverse((child) => {
      if (child.isMesh && child.material) {
        if (child === group.userData.suyuqlikMesh || child === group.userData.chokmaMesh) return;
        if (child.material.emissive) {
          if (yorit) {
            child.userData.aslEmissive = child.material.emissive.getHex();
            child.material.emissive.setHex(rang);
            child.material.emissiveIntensity = 0.4;
          } else {
            const asl = child.userData.aslEmissive || 0x000000;
            child.material.emissive.setHex(asl);
            child.material.emissiveIntensity = 0;
          }
        }
      }
    });
  }, []);

  // Eng yaqin nishon idishni aniqlash
  const yaqinIdishniTop = useCallback((kotarilganGuruh) => {
    if (!kotarilganGuruh || !sahnaRef?.current) return null;

    let engYaqin = null;
    let engKamMasofa = 0.42; // 42 sm radiusda nishon qidiriladi

    sahnaRef.current.children.forEach((obj) => {
      if (
        obj !== kotarilganGuruh &&
        obj.userData &&
        obj.userData.tanlanadi &&
        obj.userData.kalit &&
        obj.userData.sigim // Faqat idishlar nishon bo'la oladi
      ) {
        const masofa = kotarilganGuruh.position.distanceTo(obj.position);
        if (masofa < engKamMasofa) {
          engKamMasofa = masofa;
          engYaqin = obj;
        }
      }
    });

    return engYaqin;
  }, [sahnaRef]);

  useEffect(() => {
    const rendererElement = rendererRef?.current?.domElement;
    if (!rendererElement || !sahnaRef?.current || !kameraRef?.current) return;

    const koordinataniHisobla = (event) => {
      const rect = rendererElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y };
    };

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

      if (topilganGroup) {
        // Idish ko'tariladi
        faolGuruhRef.current = topilganGroup;
        boshlangichPozitsiyaRef.current.copy(topilganGroup.position);

        // Kamera boshqaruvini to'xtatamiz
        if (controlsRef?.current) {
          controlsRef.current.enabled = false;
        }

        // Sudrash tekisligini idish balandligiga moslaymiz
        sudrashTekisligiRef.current.constant = -(topilganGroup.position.y + 0.22);
        
        if (raycasterRef.current.ray.intersectPlane(sudrashTekisligiRef.current, kesishmaNuqtaRef.current)) {
          sudrashOffsetRef.current.copy(topilganGroup.position).sub(kesishmaNuqtaRef.current);
        }

        // Idishni balandlikka ko'taramiz
        topilganGroup.position.y = Math.max(1.12, topilganGroup.position.y + 0.22);
        topilganGroup.userData.kotarilgan = true;

        shishaUrilishi(2600);
        yoritishniOzgartir(topilganGroup, true, 0xfacc15); // Oltin urg'u bilan yoritish

        setTanlanganIdish(topilganGroup);
        setKotarilganIdish(topilganGroup);
        setSudralmoqda(true);

        if (typeof onIdishTanlandi === "function") onIdishTanlandi(topilganGroup);
        if (typeof onIdishKotarildi === "function") onIdishKotarildi(topilganGroup);
      } else {
        setTanlanganIdish(null);
      }
    };

    const handlePointerMove = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return;
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);

      // Agar idish ko'tarilgan va sudralayotgan bo'lsa
      if (faolGuruhRef.current && controlsRef?.current?.enabled === false) {
        if (raycasterRef.current.ray.intersectPlane(sudrashTekisligiRef.current, kesishmaNuqtaRef.current)) {
          const yangiPos = kesishmaNuqtaRef.current.add(sudrashOffsetRef.current);
          
          // Stol chegarasidan chiqib ketmasligi uchun cheklovlar
          yangiPos.x = Math.max(-1.4, Math.min(1.4, yangiPos.x));
          yangiPos.z = Math.max(-0.65, Math.min(0.65, yangiPos.z));

          faolGuruhRef.current.position.x = yangiPos.x;
          faolGuruhRef.current.position.z = yangiPos.z;

          // Yaqin nishonni qidiramiz
          const nishon = yaqinIdishniTop(faolGuruhRef.current);
          if (nishon !== yaqinNishon) {
            if (yaqinNishon) yoritishniOzgartir(yaqinNishon, false);
            if (nishon) yoritishniOzgartir(nishon, true, 0x34d399); // Yashil nishon yoritish
            setYaqinNishon(nishon);
            if (typeof onNishongaYaqinlashdi === "function") onNishongaYaqinlashdi(nishon);
          }
        }
        return;
      }

      // Oddiy hover tekshiruvi
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
        if (avvalgiYoritilganRef.current && avvalgiYoritilganRef.current !== kotarilganIdish) {
          yoritishniOzgartir(avvalgiYoritilganRef.current, false);
        }
        if (topilganGroup && topilganGroup !== kotarilganIdish) {
          yoritishniOzgartir(topilganGroup, true);
          rendererElement.style.cursor = "grab";
        } else {
          rendererElement.style.cursor = "default";
        }
        avvalgiYoritilganRef.current = topilganGroup;
        setKursorIdish(topilganGroup);
      }
    };

    const handlePointerUp = () => {
      if (faolGuruhRef.current) {
        const guruh = faolGuruhRef.current;
        
        // Agar nishon bo'lmasa, stolga tushadi
        if (!yaqinNishon) {
          // Eng yaqin slotga yoki o'z joyiga qaytarish
          guruh.position.y = 0.9; // Stol sathi
          guruh.userData.kotarilgan = false;
          yoritishniOzgartir(guruh, false);
          setKotarilganIdish(null);
          if (typeof onIdishQoyildi === "function") onIdishQoyildi(guruh);
        } else {
          // Nishon ustida qoladi (quyish holati uchun tayyor)
          shishaUrilishi(2200);
        }

        faolGuruhRef.current = null;
        setSudralmoqda(false);
      }

      if (controlsRef?.current) {
        controlsRef.current.enabled = true;
      }
    };

    rendererElement.addEventListener("pointerdown", handlePointerDown);
    rendererElement.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    return () => {
      rendererElement.removeEventListener("pointerdown", handlePointerDown);
      rendererElement.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      if (avvalgiYoritilganRef.current) {
        yoritishniOzgartir(avvalgiYoritilganRef.current, false);
      }
    };
  }, [sahnaRef, kameraRef, rendererRef, controlsRef, yoritishniOzgartir, yaqinIdishniTop, yaqinNishon, kotarilganIdish, onIdishTanlandi, onIdishKotarildi, onNishongaYaqinlashdi, onIdishQoyildi]);

  // Idishni qo'lda joyiga tushirish
  const idishniJoyigaQoy = useCallback((group) => {
    const nishonGroup = group || kotarilganIdish;
    if (!nishonGroup) return;

    nishonGroup.position.y = 0.9;
    nishonGroup.rotation.set(0, 0, 0);
    nishonGroup.userData.kotarilgan = false;
    yoritishniOzgartir(nishonGroup, false);

    if (yaqinNishon) {
      yoritishniOzgartir(yaqinNishon, false);
      setYaqinNishon(null);
    }

    setKotarilganIdish(null);
    setTanlanganIdish(null);
    if (typeof onIdishQoyildi === "function") onIdishQoyildi(nishonGroup);
  }, [kotarilganIdish, yaqinNishon, yoritishniOzgartir, onIdishQoyildi]);

  return {
    tanlanganIdish,
    setTanlanganIdish,
    kotarilganIdish,
    kursorIdish,
    yaqinNishon,
    sudralmoqda,
    idishniJoyigaQoy,
  };
}
