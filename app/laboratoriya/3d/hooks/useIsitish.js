"use client";

import { useEffect, useState } from "react";

import { pufakchaChiqishi } from "../lib/ovoz.js";
import { idishHolatiniOl } from "../lib/idish-holati.js";
import { qaynashniYangila } from "../lib/jihoz-modellari.js";

// ISITISH VA SOVISH — spirtovka alangasidagi idishning harorati.
//
// `korinish.js` dan ajratildi (BRIF-05).
//
// `harorat` va `isitimoda` shu yerda yashaydi: ikkalasini ham faqat
// shu ikki effekt boshqaradi. Tashqarida ular O'QILADI (HUD ko'rsatadi,
// yurish hooki isitish rejimini biladi), lekin yozilmaydi.
//
// Harorat idishning O'ZIDA ham saqlanadi (`idish-holati.js`), chunki
// reaksiya tezligi shu qiymatdan hisoblanadi. Birinchi effekt aynan
// shuni ta'minlaydi — ekrandagi son bilan idishdagi son ajralib
// qolmasin (AGENTS.md 1-band).

export function useIsitish({ sahnaRef, nishonIdishGroup }) {
  const [isitimoda, setIsitimoda] = useState(false);
  const [harorat, setHarorat] = useState(25);

  // o'z harorati yangilanadi.
  useEffect(() => {
    if (nishonIdishGroup) {
      const holat = idishHolatiniOl(nishonIdishGroup, nishonIdishGroup.userData?.kalit);
      holat.harorat = harorat;
    }
  }, [harorat, nishonIdishGroup]);

  useEffect(() => {
    let timer = null;
    const spirtovkaMesh = sahnaRef?.current?.children.find((c) => c.userData?.kalit === "spirtovka");
    const termometrMesh = sahnaRef?.current?.children.find((c) => c.userData?.kalit === "termometr");

    if (isitimoda) {
      pufakchaChiqishi();
      if (spirtovkaMesh?.userData?.alanganiYangila) {
        spirtovkaMesh.userData.alanganiYangila(true);
      }

      timer = setInterval(() => {
        setHarorat((prev) => {
          const yangi = Math.min(250, prev + 6);

          if (termometrMesh?.userData?.haroratniYangila) {
            termometrMesh.userData.haroratniYangila(yangi);
          }

          if (nishonIdishGroup) {
            qaynashniYangila(nishonIdishGroup, yangi);
          }

          if (yangi >= 90) {
            pufakchaChiqishi();
          }
          return yangi;
        });
      }, 700);
    } else {
      if (spirtovkaMesh?.userData?.alanganiYangila) {
        spirtovkaMesh.userData.alanganiYangila(false);
      }

      timer = setInterval(() => {
        setHarorat((prev) => {
          if (prev <= 25) {
            if (timer) clearInterval(timer);
            if (nishonIdishGroup) qaynashniYangila(nishonIdishGroup, 25);
            return 25;
          }
          const yangi = Math.max(25, prev - 4);
          if (termometrMesh?.userData?.haroratniYangila) {
            termometrMesh.userData.haroratniYangila(yangi);
          }
          if (nishonIdishGroup) {
            qaynashniYangila(nishonIdishGroup, yangi);
          }
          return yangi;
        });
      }, 600);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isitimoda, sahnaRef, nishonIdishGroup]);

  return { isitimoda, setIsitimoda, harorat, setHarorat };
}
