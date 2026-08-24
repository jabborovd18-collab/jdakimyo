"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";

import { shishaUrilishi, taroziBip, tiqinOchilishi } from "../lib/ovoz.js";
import { massaHisobla } from "../lib/tarozi.js";
import { idishHolatiniOl, idishHolatiniYoz, jamiHajm } from "../lib/idish-holati.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";

// SPATULA — quruq moddani olish va idishga solish.
//
// `korinish.js` dan ajratildi (BRIF-05). `spatulaKukun` (spatulada
// nima turgani) shu yerda yashaydi, chunki uni faqat shu amal
// o'zgartiradi.
//
// Tarozi qiymatlari tashqaridan keladi: solingandan keyin tarozi
// ekrani yangilanadi va massa `lib/tarozi.js` da hisoblanadi.

export function useSpatula({ sahnaRef, amalYoz, tarozidagiIdish, taraMassa }) {
  const [spatulaKukun, setSpatulaKukun] = useState(null);

  const handleSpatulaAmal = useCallback((group) => {
    if (spatulaKukun) {
      const tuz = spatulaKukun;
      // Qattiq tuz bir qoshiq — massa gramm bilan o'lchanadi. Modda modeli
      // suyuqlik sathini `ml` bilan ko'rsatadi, shuning uchun kukunni ham
      // kichik vizual hajm bilan belgilaymiz (bu suyuqlik emas, ko'rinish).
      const qoshilganGramm = 1.0;
      const kukunVizualMl = 0.8;

      // Kukun kukun qo'shilgan idishning O'Z holatiga qo'shiladi.
      const eskiHolat = idishHolatiniOl(group, group.userData?.kalit);
      const yangiModdalar = {
        ...(eskiHolat.moddalar || {}),
        [tuz]: {
          ...(eskiHolat.moddalar?.[tuz] || {}),
          gramm: ((eskiHolat.moddalar?.[tuz]?.gramm || 0) + qoshilganGramm),
          ml: ((eskiHolat.moddalar?.[tuz]?.ml || 0) + kukunVizualMl),
        },
      };

      idishHolatiniYoz(group, {
        ...eskiHolat,
        idish: group.userData?.kalit || eskiHolat.idish || "probirka",
        moddalar: yangiModdalar,
      });

      // Agar idish tarozida bo'lsa -> Tarozining LED ekranini darhol yangilash
      if (tarozidagiIdish || group.userData?.tarozida) {
        const idishKaliti = group.userData?.kalit || "probirka";
        const data = massaHisobla(idishKaliti, yangiModdalar, taraMassa);
        const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
        if (taroziMesh?.userData?.ekranniYangila) {
          taroziBip(2600);
          taroziMesh.userData.ekranniYangila(data.nettoMassa, taraMassa, idishKaliti, true);
        }
      }

      // Suv bor bo'lsa konsentratsiya hisoblanadi va eritma rangi olinadi.
      // Suv yo'q bo'lsa ham sath ko'rsatilishi kerak — aks holda qo'shilgan
      // kukun ko'rinmas edi (ilgari shu joyda sath umuman yangilanmasdi).
      const suvMl = yangiModdalar["H₂O"]?.ml || yangiModdalar["suv"]?.ml || 0;
      if (suvMl > 0) {
        const eritmaData = eritmaHisobla(tuz, yangiModdalar[tuz].gramm, suvMl);
        const umumiyMl = jamiHajm({ moddalar: yangiModdalar });
        suyuqlikSathiniYangila(group, umumiyMl, { rang: eritmaData.rang, shaffoflik: eritmaData.shaffoflik });
        toast.success(`🧂 ${qoshilganGramm.toFixed(3)}g ${tuz} eritildi! Konsentratsiya: ${eritmaData.molyarlik.toFixed(3)} M`);
      } else {
        const korinish = moddaKorinishi(tuz);
        suyuqlikSathiniYangila(group, kukunVizualMl, { rang: korinish.rang, shaffoflik: korinish.shaffoflik });
        toast.success(`🧂 ${qoshilganGramm.toFixed(3)}g ${tuz} kukuni idishga solindi (Tarozida tortildi)`);
      }

      setSpatulaKukun(null);
      setAralashmaOzgarish((s) => s + 1);
    } else {
      const tuzKalit = group.userData?.kalit || "CuSO₄";
      setSpatulaKukun(tuzKalit);
      tiqinOchilishi();
      toast.success(`🧂 Spatulaga 1.000g ${tuzKalit} kukuni olindi`);
    }
  }, [spatulaKukun, tarozidagiIdish, taraMassa, sahnaRef]);

  return { spatulaKukun, setSpatulaKukun, handleSpatulaAmal };
}
