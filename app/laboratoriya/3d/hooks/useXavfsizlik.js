"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import {
  oqimBoshla,
  oqimToxtat,
  pufakchaChiqishi,
  shishaUrilishi,
  tiqinOchilishi,
} from "../lib/ovoz.js";

// XAVFSIZLIK JIHOZLARI — favqulodda dush, ko'z yuvish favvorasi,
// himoya ko'zoynagi va gaz niqobi.
//
// `korinish.js` dan ajratildi (BRIF-05). To'rttasi bir oila: hammasi
// o'quvchini himoya qiladi va hammasi 3D stenddagi `userData`
// funksiyalari orqali ko'rinadigan holatni almashtiradi.

export function useXavfsizlik({ sahnaRef, amalYoz }) {
  const [dushOqmoqda, setDushOqmoqda] = useState(false);
  const [kozYuvishOqmoqda, setKozYuvishOqmoqda] = useState(false);
  const [kozoynakTaqilgan, setKozoynakTaqilgan] = useState(false);
  const [gazNiqobiTaqilgan, setGazNiqobiTaqilgan] = useState(false);

  const handleXavfsizlikDushi = useCallback(() => {
    setDushOqmoqda((prev) => {
      const yangi = !prev;
      const dushStend = sahnaRef?.current?.getObjectByName("Xavfsizlik_Dushi_Stansiyasi");
      if (dushStend?.userData?.dushniYangila) {
        dushStend.userData.dushniYangila(yangi);
      }
      if (yangi) {
        oqimBoshla();
        pufakchaChiqishi();
        toast.success("🚿 Favqulodda xavfsizlik dushi yoqildi! Kimyoviy zararsizlantirish bajarildi.");
      } else {
        oqimToxtat();
        toast("🚿 Xavfsizlik dushi yopildi", { icon: "💧" });
      }
      return yangi;
    });
  }, [sahnaRef]);

  const handleKozYuvish = useCallback(() => {
    setKozYuvishOqmoqda((prev) => {
      const yangi = !prev;
      const dushStend = sahnaRef?.current?.getObjectByName("Xavfsizlik_Dushi_Stansiyasi");
      if (dushStend?.userData?.kozYuvishniYangila) {
        dushStend.userData.kozYuvishniYangila(yangi);
      }
      if (yangi) {
        oqimBoshla();
        toast.success("👁️ Ko'z yuvish favvorasi ochildi!");
      } else {
        oqimToxtat();
        toast("👁️ Ko'z yuvish favvorasi yopildi", { icon: "💧" });
      }
      return yangi;
    });
  }, [sahnaRef]);

  const handleKozoynakTaqish = useCallback(() => {
    setKozoynakTaqilgan((prev) => {
      const yangi = !prev;
      shishaUrilishi(2600);
      if (yangi) {
        amalYoz({ turi: "amal", kalit: "kozoynak" });
        toast.success("🥽 Kimyoviy himoya ko'zoynagi taqildi!");
      } else {
        toast("🥽 Himoya ko'zoynagi yechildi", { icon: "👓" });
      }
      return yangi;
    });
  }, [amalYoz]);

  const handleGazNiqobiTaqish = useCallback(() => {
    setGazNiqobiTaqilgan((prev) => {
      const yangi = !prev;
      tiqinOchilishi();
      if (yangi) {
        toast.success("🎭 Kimyoviy gaz niqobi (Respirator) taqildi!");
      } else {
        toast("🎭 Gaz niqobi yechildi", { icon: "😷" });
      }
      return yangi;
    });
  }, []);


  return {
    dushOqmoqda,
    kozYuvishOqmoqda,
    kozoynakTaqilgan,
    gazNiqobiTaqilgan,
    handleXavfsizlikDushi,
    handleKozYuvish,
    handleKozoynakTaqish,
    handleGazNiqobiTaqish,
  };
}
