"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { shishaUrilishi } from "../lib/ovoz.js";

// Idish guruhini (THREE.Group) ildizgacha qidirib topuvchi yordamchi funksiya.
// Nega: Raycaster idishning ichki meshlaridan birini (masalan, silindr yoki yorliqni)
// topadi; bizga esa uning ota guruhi (userData.kalit bor Group) kerak.
//
// `turi === "reagent"` bo'lgan obyektlar (javondagi reagent shishalari) ATLAY O'TILADI:
// ilgari ular ham `tanlanadi && kalit` shartiga tushib, "idish" deb qabul qilinardi va
// joriy idish "H₂O" (reagent!) bo'lib yozilardi. Endi idish faqat haqiqiy idish bo'ladi.
function idishGuruhiniTop(obyekt) {
  let joriy = obyekt;
  while (joriy) {
    if (
      joriy.userData &&
      joriy.userData.tanlanadi &&
      joriy.userData.kalit &&
      joriy.userData.turi !== "reagent"
    ) {
      return joriy;
    }
    joriy = joriy.parent;
  }
  return null;
}

// Javondagi reagent shishasini topuvchi yordamchi. Shisha bosilganda joriy idish emas,
// FAOL REAGENT tanlanadi — reagentni sahnadagi shishadan tanlash imkonini beradi.
function reagentGuruhiniTop(obyekt) {
  let joriy = obyekt;
  while (joriy) {
    if (joriy.userData && joriy.userData.turi === "reagent" && joriy.userData.kalit) {
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
//
// `tayyor` bog'liqlikda SHART: avval hodisalar faqat ref obyektlariga bog'lanardi (ularning
// identifikatori hech qachon o'zgarmaydi), shuning uchun sahna birinchi marta qurilganda ham,
// qayta qurilganda ham tinglovchilar Eski/yo'q canvasga ulanib qolardi va idishni bosish
// umuman ishlamasdi. `tayyor` o'zgarganda effekt qayta ishga tushib, joriy canvasga ulanadi.
export function useSudrash({
  sahnaRef,
  kameraRef,
  rendererRef,
  tayyor,
  onReagentTanlandi,
  onIdishTanlandi,
}) {
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

    // Raycast natijalaridan idish va reagent shishasini ajratib oluvchi yordamchi
    const nishonlarniTop = (event) => {
      if (!sahnaRef.current || !kameraRef.current) return { idish: null, reagent: null };
      const { x, y } = koordinataniHisobla(event);
      mouseRef.current.set(x, y);

      raycasterRef.current.setFromCamera(mouseRef.current, kameraRef.current);
      const kesishmalar = raycasterRef.current.intersectObjects(sahnaRef.current.children, true);

      let idish = null;
      let reagent = null;
      for (const kesish of kesishmalar) {
        const idishTopilgan = idishGuruhiniTop(kesish.object);
        if (idishTopilgan) {
          idish = idishTopilgan;
          break;
        }
        const reagentTopilgan = reagentGuruhiniTop(kesish.object);
        if (reagentTopilgan) {
          reagent = reagentTopilgan;
          break;
        }
      }
      return { idish, reagent };
    };

    const handlePointerMove = (event) => {
      const { idish, reagent } = nishonlarniTop(event);

      if (idish !== avvalgiYoritilganRef.current) {
        if (avvalgiYoritilganRef.current) {
          yoritishniOzgartir(avvalgiYoritilganRef.current, false);
        }
        if (idish) {
          yoritishniOzgartir(idish, true);
        }
        avvalgiYoritilganRef.current = idish;
      }

      // Javon shishasini yoritishni ataylab yoqmaymiz: barcha shishalar bitta umumiy
      // shisha materialini bo'lishadi (materiallar.js), uni o'zgartirsak butun javon
      // birga yorishadi. Kursor "pointer" bo'lishi bosish mumkinligini yetarlicha bildiradi.
      rendererElement.style.cursor = idish || reagent ? "pointer" : "default";
      setKursorIdish(idish);
    };

    // Nega hodisalar window ga emas, renderer.domElement ga qo'yiladi: UI panellar
    // yoki sahifaning boshqa qismlari bosilganda 3D raycaster chaqirib xato tanlov qilmasligi uchun.
    const handlePointerDown = (event) => {
      const { idish, reagent } = nishonlarniTop(event);

      // Reagent shishasi bosildi — joriy idish o'zgarmaydi, faol reagent tanlanadi.
      if (reagent) {
        if (typeof onReagentTanlandi === "function") {
          onReagentTanlandi(reagent.userData.kalit);
        }
        shishaUrilishi(2200);
        return;
      }

      setTanlanganIdish(idish);
      if (idish) {
        shishaUrilishi(2400);
      }
      if (idish && typeof onIdishTanlandi === "function") {
        onIdishTanlandi(idish);
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
  }, [sahnaRef, kameraRef, rendererRef, tayyor, yoritishniOzgartir, onReagentTanlandi, onIdishTanlandi]);

  return {
    tanlanganIdish,
    setTanlanganIdish,
    kursorIdish,
  };
}
