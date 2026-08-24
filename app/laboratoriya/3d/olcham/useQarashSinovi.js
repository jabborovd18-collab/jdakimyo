"use client";

import { useEffect, useRef } from "react";

import { pointerLockMavjudmi, yawniSiljit } from "../lib/qarash-boshqaruvi.js";

// Qarash (pointer lock) matematikasining SUN'IY sinovi.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Sinov haqiqiy sichqonchani
// talab qilmaydi: `window.__qarashSinovi(px)` piksel siljishini beradi
// va cheksiz yaw hisobini qaytaradi. Shuning uchun u brauzer
// avtomatlashtiruvida ham ishlaydi.
//
// Fokus yo'qolganda yaw O'ZGARMASLIGI shart — aks holda tab orqada
// turganda ham kamera burilib ketardi.

export function useQarashSinovi(tayyor, rendererRef) {
  const qarashSinoviRef = useRef({
    rejim: "pointerlock",
    yaw: 0,
    yawJami: 0,
    faol: true,
  });

  useEffect(() => {
    if (!tayyor || !rendererRef.current) return;
    const sinov = qarashSinoviRef.current;
    sinov.rejim = pointerLockMavjudmi(rendererRef.current.domElement)
      ? "pointerlock"
      : "zaxira";
    sinov.faol = !document.hidden;

    const fokusYoqotildi = () => { sinov.faol = false; };
    const fokusQaytdi = () => { sinov.faol = true; };
    const visibility = () => { sinov.faol = !document.hidden; };

    window.__qarashSinovi = (piksel) => {
      const oldin = sinov.yaw;
      let farq = 0;
      if (sinov.faol) {
        farq = yawniSiljit(sinov, Number(piksel) || 0, 1);
        sinov.yawJami += Math.abs(farq);
      }
      return {
        qarashRejimi: sinov.rejim,
        oldin,
        keyin: sinov.yaw,
        farq,
        yawJami: sinov.yawJami,
        faol: sinov.faol,
      };
    };

    window.addEventListener("blur", fokusYoqotildi);
    window.addEventListener("focus", fokusQaytdi);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", fokusYoqotildi);
      window.removeEventListener("focus", fokusQaytdi);
      document.removeEventListener("visibilitychange", visibility);
      if (window.__qarashSinovi) delete window.__qarashSinovi;
    };
  }, [tayyor, rendererRef]);

  return qarashSinoviRef;
}
