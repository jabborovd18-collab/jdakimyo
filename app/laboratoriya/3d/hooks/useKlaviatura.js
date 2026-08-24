"use client";

import { useEffect } from "react";

import { ANIQ_DOZALAR } from "../lib/sozlama.js";

// KLAVIATURA — harakat tugmalari, sakrash, cho'qqayish va aniq doza
// raqamlari.
//
// `useYurish.js` dan ajratildi (BRIF-05).

export function useKlaviatura({
  tayyor,
  yurishRejimi,
  fpsQolIdish,
  qolgaOlYokiQoy,
  onAniqHajmQuy,
  holat,
}) {
  const {
    keysRef,
    verticalVelocityRef,
    targetEyeHeightRef,
    eyeHeightRef,
  } = holat;

  useEffect(() => {
    if (!tayyor || !yurishRejimi) return;

    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      const k = e.code;
      const key = e.key ? e.key.toLowerCase() : "";

      if (k === "KeyW" || k === "ArrowUp" || key === "w" || key === "ц") keysRef.current.w = true;
      if (k === "KeyS" || k === "ArrowDown" || key === "s" || key === "ы") keysRef.current.s = true;
      if (k === "KeyA" || k === "ArrowLeft" || key === "a" || key === "ф") keysRef.current.a = true;
      if (k === "KeyD" || k === "ArrowRight" || key === "d" || key === "в") keysRef.current.d = true;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = true;

      // Cho'qqayish (Crouch)
      if (k === "KeyC" || k === "ControlLeft" || k === "ControlRight" || key === "c" || key === "с") {
        keysRef.current.crouch = true;
        targetEyeHeightRef.current = 1.05;
      }

      // E yoki F — Ushlash / Quyish / Faollashtirish
      if (k === "KeyE" || k === "KeyF" || key === "e" || key === "у" || key === "f" || key === "а") {
        qolgaOlYokiQoy("asosiy");
      }

      // G — Stolga qo'yish yoki Javonga qaytarish
      if (k === "KeyG" || key === "g" || key === "п") {
        if (fpsQolIdish?.userData?.devorShishasi) {
          qolgaOlYokiQoy("javonga_qaytar");
        } else {
          qolgaOlYokiQoy("stolga_qoy");
        }
      }

      // 1, 2, 3, 4, 5 — Tezkor aniq hajmlar
      // 1..5 raqamlari `ANIQ_DOZALAR` ro'yxatidan oziqlanadi — sensor
      // tugmalari ham o'sha ro'yxatni ishlatadi (sozlama.js).
      ANIQ_DOZALAR.forEach((ml, i) => {
        const raqam = String(i + 1);
        if ((k === `Digit${raqam}` || key === raqam) && typeof onAniqHajmQuy === "function") {
          onAniqHajmQuy(ml);
        }
      });

      if (k === "Space") {
        if (eyeHeightRef.current <= 1.62 && !keysRef.current.crouch) {
          verticalVelocityRef.current = 3.2;
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.code;
      const key = e.key ? e.key.toLowerCase() : "";
      if (k === "KeyW" || k === "ArrowUp" || key === "w" || key === "ц") keysRef.current.w = false;
      if (k === "KeyS" || k === "ArrowDown" || key === "s" || key === "ы") keysRef.current.s = false;
      if (k === "KeyA" || k === "ArrowLeft" || key === "a" || key === "ф") keysRef.current.a = false;
      if (k === "KeyD" || k === "ArrowRight" || key === "d" || key === "в") keysRef.current.d = false;
      if (k === "ShiftLeft" || k === "ShiftRight") keysRef.current.sprint = false;
      if (k === "KeyC" || k === "ControlLeft" || k === "ControlRight" || key === "c" || key === "с") {
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
  }, [tayyor, yurishRejimi, qolgaOlYokiQoy, onAniqHajmQuy, fpsQolIdish]);
}
