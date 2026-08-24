"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";

import {
  oqimBoshla,
  oqimToxtat,
  pufakchaChiqishi,
  shishaUrilishi,
  tiqinOchilishi,
} from "../lib/ovoz.js";
import { massaHisobla } from "../lib/tarozi.js";
import { idishHolatiniOl, idishHolatiniYoz, tozala } from "../lib/idish-holati.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";

// JIHOZ AMALLARI — idishni tanlash, holat o'zgarishi, spirtovka va
// rakovina.
//
// `korinish.js` dan ajratildi (BRIF-05). Hammasi bitta naqshga
// bo'ysunadi: 3D ob'ekt bilan nima bo'lganini eshitadi, ovoz va
// xabarni beradi, so'ng holatni yangilaydi.
//
// Tarozi qiymatlari (`tarozidagiIdish`, `taraMassa`) TASHQARIDAN
// keladi: ularning egasi `useTarozi` va ikkinchi nusxa yaratilmaydi
// (AGENTS.md 1-band).

export function useJihozAmallari({ sahnaRef, amalYoz, tarozidagiIdish, taraMassa }) {
  const handleHolatOzgardimi = useCallback((group, holat) => {
    setAralashmaOzgarish((s) => s + 1);

    if (tarozidagiIdish && tarozidagiIdish.userData?.tarozida) {
      const idishKaliti = group?.userData?.kalit || tarozidagiIdish.userData?.kalit || "probirka";
      const holatData = holat || idishHolatiniOl(tarozidagiIdish, idishKaliti);
      const data = massaHisobla(idishKaliti, holatData?.moddalar || {}, taraMassa);
      const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
      if (taroziMesh?.userData?.ekranniYangila) {
        taroziMesh.userData.ekranniYangila(data.nettoMassa, taraMassa, idishKaliti, true);
      }
    }
  }, [sahnaRef, tarozidagiIdish, taraMassa]);

  const handleIdishTanlandi = useCallback((group) => {
    if (group && group.userData?.kalit) {
      // Jihoz qo'lga olinishi ham amaliy mashg'ulot qadami bo'lishi
      // mumkin ("kolba", "konussimon-kolba", "byuretka" kabi). Reagent
      // shishasi ham shu yerdan o'tadi, lekin uning qadami QUYISH
      // bilan belgilanadi — shisha ushlash hali quyish emas.
      amalYoz({ turi: "amal", kalit: group.userData.kalit });
      if (group.userData.sigim > 0 && !group.userData.devorShishasi) {
        // Tanlangan idish uchun holat yaratilib, "idish turi" o'rnatiladi.
        idishHolatiniOl(group, group.userData.kalit);
      } else {
        setFaolReagent(group.userData.kalit);
      }
    }
  }, [amalYoz]);

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

  const handleRakovinaKraniBosildi = useCallback(() => {
    setSuvOqmoqda((prev) => {
      const yangi = !prev;
      const rakovinaMesh = sahnaRef?.current?.getObjectByName("Yuvinish_Rakovinasi");
      if (rakovinaMesh?.userData?.suvOqimiMesh) {
        rakovinaMesh.userData.suvOqimiMesh.visible = yangi;
        if (rakovinaMesh.userData.splashPoints) {
          rakovinaMesh.userData.splashPoints.visible = yangi;
        }
      }
      if (yangi) {
        oqimBoshla();
        toast.success("💧 Distillangan suv krani ochildi");
      } else {
        oqimToxtat();
        toast("💧 Suv krani yopildi", { icon: "💧" });
      }
      return yangi;
    });
  }, [sahnaRef]);

  const handleRakovinagaTushdi = useCallback((group) => {
    oqimBoshla();
    pufakchaChiqishi();

    const rakovinaMesh = sahnaRef?.current?.getObjectByName("Yuvinish_Rakovinasi");
    if (rakovinaMesh?.userData?.suvOqimiMesh) {
      rakovinaMesh.userData.suvOqimiMesh.visible = true;
      if (rakovinaMesh.userData.splashPoints) {
        rakovinaMesh.userData.splashPoints.visible = true;
      }
    }

    if (group) {
      suyuqlikSathiniYangila(group, 0, null, 0);
      // Yuvilgan idishning O'Z holati tozalanadi — boshqa idishlarga tegmaydi.
      const holat = idishHolatiniOl(group, group.userData?.kalit);
      idishHolatiniYoz(group, tozala(holat));
    }
    jurnalRef.current = jurnalYarat();

    amalYoz({ turi: "amal", kalit: "yuvish" });
    toast.success("✓ Idish distillangan suv bilan to'liq yuvildi va tozalandi!");
    setAralashmaOzgarish((s) => s + 1);

    setTimeout(() => {
      oqimToxtat();
      if (rakovinaMesh?.userData?.suvOqimiMesh) {
        rakovinaMesh.userData.suvOqimiMesh.visible = false;
        if (rakovinaMesh.userData.splashPoints) {
          rakovinaMesh.userData.splashPoints.visible = false;
        }
      }
    }, 2000);
  }, [sahnaRef, amalYoz]);

  return {
    handleHolatOzgardimi,
    handleIdishTanlandi,
    handleSpirtovkaBosildi,
    handleSpirtovkagaQoyildi,
    handleRakovinaKraniBosildi,
    handleRakovinagaTushdi,
  };
}
