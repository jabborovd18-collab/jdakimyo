"use client";

import { useCallback, useEffect, useRef } from "react";

// Kadr sanagichi va sahnaning BARQARORLASHISHINI kutish.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Sanagich va kutish bir
// oila: kutish aynan shu sanagichning `kadr` maydonini o'qiydi. Ular
// ajralganda kutish qaysi sanagichga tayanishi noaniq bo'lardi.
//
// `fpsRef` tashqariga CHIQMAYDI: undan tashqarida faqat o'rtacha FPS
// kerak bo'lgan va uni `fpsOrtachasi()` beradi. Xom ref berilsa,
// chaqiruvchi uni yana o'zicha o'qib, ikkinchi hisob-kitob paydo
// bo'lardi.

function kadrlarniKut(fpsRef, birinchi) {
  const boshlangich = fpsRef.current.kadr;
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const kut = () => {
      const otdi = fpsRef.current.kadr - boshlangich;
      const vaqt = performance.now() - t0;
      const birinchiTayyor = otdi >= 60 || (otdi >= 8 && vaqt >= 2000);
      if ((birinchi && birinchiTayyor) || (!birinchi && otdi >= 2)) {
        resolve();
        return;
      }
      if (vaqt > 90000) {
        reject(new Error(`Sahna barqarorlashmadi (otdi=${otdi})`));
        return;
      }
      requestAnimationFrame(kut);
    };
    kut();
  });
}

export function useKadrSanagich(tayyor) {
  const fpsRef = useRef({ namuna: [], oxirgi: 0, kadr: 0 });
  // Birinchi o'lchov sahna yukini kutadi (60 kadr yoki sekin dasturiy
  // GL uchun 8 kadr + 2 soniya), keyingilari atigi ikki kadr. Bayroq
  // shu yerda yashaydi, chunki uni faqat kutish o'zgartiradi.
  const ilkOlchovRef = useRef(true);

  useEffect(() => {
    if (!tayyor) return;
    let id = 0;
    const tik = (t) => {
      const s = fpsRef.current;
      if (s.oxirgi > 0) {
        const dt = t - s.oxirgi;
        if (dt > 0) {
          s.namuna.push(1000 / dt);
          if (s.namuna.length > 120) s.namuna.shift();
        }
      }
      s.oxirgi = t;
      s.kadr += 1;
      id = requestAnimationFrame(tik);
    };
    id = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(id);
  }, [tayyor]);

  const sahnaniKut = useCallback(async () => {
    await kadrlarniKut(fpsRef, ilkOlchovRef.current);
    ilkOlchovRef.current = false;
  }, []);

  const fpsOrtachasi = useCallback(() => {
    const namuna = fpsRef.current.namuna;
    return namuna.length
      ? namuna.reduce((a, b) => a + b, 0) / namuna.length
      : 0;
  }, []);

  return { sahnaniKut, fpsOrtachasi };
}
