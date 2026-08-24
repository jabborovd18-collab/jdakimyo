"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { oqimBoshla, oqimToxtat, pufakchaChiqishi } from "../lib/ovoz.js";
import { titrlashHolatiniHisobla } from "../lib/titrlash-dvigatel.js";

// TITRLASH STANSIYASI — kran holati, tomchi sikli va 3D stendni
// yangilash.
//
// `korinish.js` dan ajratildi (BRIF-05). Holat, uni o'zgartiradigan
// tugma va uni jonlantiradigan sikl bitta faylda: uchalasi bir
// stansiyaning uch tomoni. Ilgari ular komponentning uch xil joyida
// yotardi — tugma 487-qatorda, sikl 659-da.

export function useTitrlash({ sahnaRef, amalYoz }) {
  const [titrlashTomchilamoqda, setTitrlashTomchilamoqda] = useState(false);
  const [titrlashHajmi, setTitrlashHajmi] = useState(0);

  const handleTitrlashKran = useCallback(() => {
    setTitrlashTomchilamoqda((prev) => {
      const yangi = !prev;
      if (yangi) {
        oqimBoshla();
        amalYoz({ turi: "amal", kalit: "titrlash" });
        toast.success("💧 Byuretka krani ochildi: Titrant tomchilamoqda");
      } else {
        oqimToxtat();
        toast("💧 Byuretka krani yopildi", { icon: "🧪" });
      }
      return yangi;
    });
  }, [amalYoz]);


  // Titrlash jonli simulyatsiya sikli
  useEffect(() => {
    let timer = null;
    const stend = sahnaRef?.current?.getObjectByName("Titrlash_Byuretka_Stansiyasi");

    if (titrlashTomchilamoqda) {
      timer = setInterval(() => {
        setTitrlashHajmi((prev) => {
          const yangi = Math.min(50, prev + 0.5);
          const holat = titrlashHolatiniHisobla("kislota_kuchli", yangi);

          if (stend?.userData?.stendniYangila) {
            stend.userData.stendniYangila(yangi, holat.rangHex, true);
          }

          if (holat.ekvivalentlikYetdimi && Math.abs(yangi - holat.vEkvivalent) <= 0.5) {
            pufakchaChiqishi();
            toast.success(`🎯 EKVIVALENTLIK NUQTASI: pH = ${holat.ph} | V = ${yangi.toFixed(1)} ml!`);
          }

          return yangi;
        });
      }, 600);
    } else {
      if (stend?.userData?.stendniYangila) {
        const holat = titrlashHolatiniHisobla("kislota_kuchli", titrlashHajmi);
        stend.userData.stendniYangila(titrlashHajmi, holat.rangHex, false);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [titrlashTomchilamoqda, sahnaRef]);

  return { titrlashTomchilamoqda, titrlashHajmi, handleTitrlashKran };
}
