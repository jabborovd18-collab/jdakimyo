// app/laboratoriya/3d/hooks/useTermalBoshqaruv.js
//
// Termal boshqaruv: spirtovka olovi, idish haroratining ko'tarilishi /
// sovishi va TERMIK reaksiya triggeri (80°C ostonasi).
//
// BRIF-05 (2-bosqich): `korinish.js` (1474 qator) dan mazmun bo'yicha
// ajratildi. Xatti-harakat o'zgarmadi — kod aynan ko'chirildi, faqat
// bog'lamlar (sahnaRef, nishonIdishGroup, ...) parametr bo'ldi.

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { pufakchaChiqishi } from "../lib/ovoz.js";
import { qaynashniYangila } from "../lib/jihoz-modellari.js";
import { idishHolatiniOl } from "../lib/idish-holati.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";

export function useTermalBoshqaruv({
  sahnaRef,
  nishonIdishGroup,
  otkazilmoqda,
  otkaz,
  setNatija,
  amalYoz,
}) {
  const [isitimoda, setIsitimoda] = useState(false);
  const [harorat, setHarorat] = useState(25);

  const handleSpirtovkaBosildi = useCallback(() => {
    setIsitimoda((prev) => {
      const yangi = !prev;
      if (yangi) {
        pufakchaChiqishi();
        amalYoz({ turi: "amal", kalit: "isitish" });
        toast.success("🔥 Spirtovka alangalantirildi!");
      } else {
        toast("❄️ Spirtovka o'chirildi", { icon: "🔥" });
      }
      return yangi;
    });
  }, [amalYoz]);

  const handleSpirtovkagaQoyildi = useCallback((group) => {
    setIsitimoda(true);
    amalYoz({ turi: "amal", kalit: "isitish" });
    toast.success("🔥 Idish spirtovka shtativiga qo'yildi va qizdirilmoqda");
  }, [amalYoz]);

  // Spirtovkada isitish va sovish sikli — faol (isitilayotgan) idishning
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

  // Isitishda TERMIK reaksiya urinishi (BRIF-R01, 6-bosqich).
  //
  // Aralashish triggeri buni qamramaydi: u 2+ modda talab qiladi, termik
  // parchalanish esa BITTA qattiq moddadan boshlanadi (Cu(OH)₂ → CuO + H₂O).
  // Shart — idishda kamida bitta QATTIQ modda (cho'kma/kukun): suv yoki
  // eritmani qizdirish reaksiya urinishi emas, shunchaki qaynash.
  //
  // Bo'ladimi-bo'lmaydimi SERVER hal qiladi: u haroratni bazadagi
  // `temperature` bilan solishtiradi ('sovuq' kodi). Har 20 gradusda bitta
  // urinish — server sekundiga so'rov bilan bombalanmasin, lekin "60 °C da
  // hali erta, 80 °C da bo'ldi" yo'li ham ochiq qolsin.
  const oxirgiTermikUrinishRef = useRef(-Infinity);
  useEffect(() => {
    if (!isitimoda) {
      oxirgiTermikUrinishRef.current = -Infinity;
      return;
    }
    if (otkazilmoqda || !nishonIdishGroup) return;
    if (harorat < 80) return;
    if (harorat - oxirgiTermikUrinishRef.current < 20) return;

    const holat = idishHolatiniOl(nishonIdishGroup, nishonIdishGroup.userData?.kalit);
    const kalitlar = Object.keys(holat?.moddalar || {});
    if (kalitlar.length === 0) return;
    if (!kalitlar.some((k) => moddaKorinishi(k).holat === "qattiq")) return;

    oxirgiTermikUrinishRef.current = harorat;
    setNatija(null);
    otkaz(null, nishonIdishGroup);
  }, [harorat, isitimoda, otkazilmoqda, nishonIdishGroup, otkaz, setNatija]);

  return {
    isitimoda,
    harorat,
    handleSpirtovkaBosildi,
    handleSpirtovkagaQoyildi,
  };
}
