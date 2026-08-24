"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { taroziBip } from "../lib/ovoz.js";
import { massaHisobla } from "../lib/tarozi.js";
import { idishHolatiniOl } from "../lib/idish-holati.js";

// TAROZI — pallaga qo'yish, olish, tara va nol.
//
// `korinish.js` dan ajratildi (BRIF-05).
//
// `tarozidagiIdish` va `taraMassa` shu yerda yashaydi: to'rt amalning
// hammasi shu ikki qiymatni o'qiydi va yozadi. Ular komponentda
// qolganda, tarozi mantig'i uch joyga sochilib ketardi.
//
// Massa BU YERDA hisoblanmaydi — `lib/tarozi.js` dagi `massaHisobla`
// yagona manba (AGENTS.md 1-band). Bu yerda faqat ekran va ovoz.

export function useTarozi({ sahnaRef, amalYoz }) {
  const [tarozidagiIdish, setTarozidagiIdish] = useState(null);
  const [taraMassa, setTaraMassa] = useState(0);

  const handleTaroziTushdi = useCallback((group) => {
    setTarozidagiIdish(group);
    taroziBip(2400);

    const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
    if (taroziMesh?.userData?.ekranniYangila) {
      const idishKaliti = group.userData?.kalit || "probirka";
      const data = massaHisobla(idishKaliti, idishHolatiniOl(group, idishKaliti).moddalar || {}, taraMassa);

      const jitter = data.nettoMassa + (Math.random() * 0.012 - 0.006);
      taroziMesh.userData.ekranniYangila(jitter, taraMassa, idishKaliti, false);

      setTimeout(() => {
        taroziMesh.userData.ekranniYangila(data.nettoMassa, taraMassa, idishKaliti, true);
        taroziBip(3200);
      }, 160);
    }
    amalYoz({ turi: "amal", kalit: "tarozi" });
    toast.success(`⚖️ Idish tarozi pallasiga qo'yildi: ${group.userData?.kalit || "Idish"}`);
  }, [sahnaRef, taraMassa, amalYoz]);

  const handleTarozidanOlingan = useCallback((group) => {
    setTarozidagiIdish(null);
    taroziBip(2000);
    const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
    if (taroziMesh?.userData?.ekranniYangila) {
      const netto = taraMassa > 0 ? -taraMassa : 0;
      taroziMesh.userData.ekranniYangila(netto, taraMassa, "", true);
    }
  }, [sahnaRef, taraMassa]);

  const handleTaroziTara = useCallback((brutto) => {
    taroziBip(2800);
    let yangiTara = brutto;
    if (typeof yangiTara !== "number") {
      const guruh = tarozidagiIdish || nishonIdishGroup;
      const idishKaliti = guruh?.userData?.kalit || "probirka";
      const data = massaHisobla(idishKaliti, idishHolatiniOl(guruh, idishKaliti).moddalar || {}, 0);
      yangiTara = data.bruttoMassa;
    }
    setTaraMassa(yangiTara);

    const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
    if (taroziMesh?.userData?.ekranniYangila) {
      const idishNomi = tarozidagiIdish?.userData?.kalit || "";
      taroziMesh.userData.ekranniYangila(0, yangiTara, idishNomi, true);
    }
    toast.success(`✓ Tarozi TARA qilindi: ${yangiTara.toFixed(3)} g nolga tenglashtirildi!`);
  }, [sahnaRef, tarozidagiIdish]);

  const handleTaroziNol = useCallback(() => {
    taroziBip(2400);
    setTaraMassa(0);
    const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
    if (taroziMesh?.userData?.ekranniYangila) {
      if (tarozidagiIdish) {
        const idishKaliti = tarozidagiIdish.userData?.kalit || "probirka";
        const data = massaHisobla(idishKaliti, idishHolatiniOl(tarozidagiIdish, idishKaliti).moddalar || {}, 0);
        taroziMesh.userData.ekranniYangila(data.nettoMassa, 0, idishKaliti, true);
      } else {
        taroziMesh.userData.ekranniYangila(0, 0, "", true);
      }
    }
    toast("↺ Tarozi nolga qaytarildi", { icon: "⚖️" });
  }, [sahnaRef, tarozidagiIdish]);

  return {
    tarozidagiIdish,
    taraMassa,
    handleTaroziTushdi,
    handleTarozidanOlingan,
    handleTaroziTara,
    handleTaroziNol,
  };
}
