// app/laboratoriya/3d/hooks/useStansiyaAmallari.js
//
// Xona stansiyalari bilan ishlash: tarozi, rakovina, xavfsizlik
// jihozlari (dush, ko'z yuvish, ko'zoynak, niqob), titrlash krani,
// elektroliz toki, spatula va aralashtirish.
//
// BRIF-05 (2-bosqich): `korinish.js` (1474 qator) dan mazmun bo'yicha
// ajratildi. Xatti-harakat o'zgarmadi — kod aynan ko'chirildi, faqat
// bog'lamlar (sahnaRef, jurnalRef, ...) parametr bo'ldi.

"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  pufakchaChiqishi,
  oqimBoshla,
  oqimToxtat,
  taroziBip,
  shishaUrilishi,
  tiqinOchilishi,
} from "../lib/ovoz.js";
import { massaHisobla } from "../lib/tarozi.js";
import { eritmaHisobla } from "../lib/eritma-tayyorlash.js";
import { titrlashHolatiniHisobla } from "../lib/titrlash-dvigatel.js";
import { elektrolizHisobla } from "../lib/elektroliz-dvigatel.js";
import { tozala, jamiHajm, idishHolatiniOl, idishHolatiniYoz, dekantatsiya } from "../lib/idish-holati.js";
import { jurnalYarat } from "../lib/jurnal.js";
import { suyuqlikSathiniYangila } from "../lib/jihoz-modellari.js";
import { moddaKorinishi } from "../lib/modda-korinishi.js";

export function useStansiyaAmallari({
  sahnaRef,
  jurnalRef,
  amalYoz,
  otkaz,
  nishonIdishGroup,
  setAralashmaOzgarish,
}) {
  // Tarozi holati
  const [tarozidagiIdish, setTarozidagiIdish] = useState(null);
  const [taraMassa, setTaraMassa] = useState(0);
  const [suvOqmoqda, setSuvOqmoqda] = useState(false);

  const [spatulaKukun, setSpatulaKukun] = useState(null);
  const [titrlashTomchilamoqda, setTitrlashTomchilamoqda] = useState(false);
  const [titrlashHajmi, setTitrlashHajmi] = useState(0);
  const [elektrolizFaol, setElektrolizFaol] = useState(false);
  const [elektrolizVaqt, setElektrolizVaqt] = useState(0);

  // 6-BOSQICH: Xavfsizlik Dushi, Ko'z Yuvish va HazMat jihozlari
  const [dushOqmoqda, setDushOqmoqda] = useState(false);
  const [kozYuvishOqmoqda, setKozYuvishOqmoqda] = useState(false);
  const [kozoynakTaqilgan, setKozoynakTaqilgan] = useState(false);
  const [gazNiqobiTaqilgan, setGazNiqobiTaqilgan] = useState(false);
  const [xonaTutun, setXonaTutun] = useState(false);

  // Quyish tugagach chaqiriladi: `group` — tarkibi o'zgargan idish, `holat`
  // esa uning yangi holati. Tarozida shu idish tursa, LED ekran yangilanadi.
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
  }, [sahnaRef, tarozidagiIdish, taraMassa, setAralashmaOzgarish]);

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
      const holat = idishHolatiniOl(group, group.userData?.kalit);

      // Dekantatsiya: suyuqlik to'kiladi, CHO'KMA QOLADI (BRIF-R01, 5-bosqich).
      // Ilgari rakovina hammasini o'chirardi — Cu(OH)₂ cho'kmasi ham ketardi
      // va uni qizdirishga hech narsa qolmasdi. Qattiq/suyuqni modda jadvali
      // aytadi (lib/lab-modda.js — yagona manba).
      const { holat: yuvilgan, tokilgan, qolganKalitlar } = dekantatsiya(
        holat,
        (kalit) => moddaKorinishi(kalit).holat === "qattiq",
      );

      if (qolganKalitlar.length > 0) {
        idishHolatiniYoz(group, yuvilgan);
        const chokmaKorinish = moddaKorinishi(qolganKalitlar[0]);
        suyuqlikSathiniYangila(group, 0, null, jamiHajm(yuvilgan), chokmaKorinish.rang);
        toast.success(
          tokilgan.length > 0
            ? `✓ Eritma to'kildi (${tokilgan.join(", ")}), ${qolganKalitlar.join(", ")} cho'kmasi yuvilib idishda qoldi`
            : `✓ ${qolganKalitlar.join(", ")} cho'kmasi toza suv bilan yuvildi`
        );
      } else {
        suyuqlikSathiniYangila(group, 0, null, 0);
        idishHolatiniYoz(group, tozala(holat));
        toast.success("✓ Idish distillangan suv bilan to'liq yuvildi va tozalandi!");
      }
    } else {
      toast.success("✓ Idish distillangan suv bilan to'liq yuvildi va tozalandi!");
    }
    jurnalRef.current = jurnalYarat();

    amalYoz({ turi: "amal", kalit: "yuvish" });
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
  }, [sahnaRef, jurnalRef, amalYoz, setAralashmaOzgarish]);

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

  const handleElektrolizTok = useCallback(() => {
    setElektrolizFaol((prev) => {
      const yangi = !prev;
      if (yangi) {
        pufakchaChiqishi();
        amalYoz({ turi: "amal", kalit: "tok" });
        toast.success("⚡ DC Tok Manbai faollashdi (2.5 A). Elektroliz jarayoni boshlandi!");
      } else {
        toast("⚡ Tok manbai o'chirildi", { icon: "🔌" });
      }
      return yangi;
    });
  }, [amalYoz]);

  const handleAralashtirish = useCallback((targetGroup) => {
    pufakchaChiqishi();
    amalYoz({ turi: "amal", kalit: "aralashtirish" });
    toast.success("🌀 Shisha tayoqcha bilan aralashtirildi! Reaksiya kinetikasi tezlashdi.");
    otkaz(null, targetGroup);
  }, [otkaz, amalYoz]);

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
  }, [spatulaKukun, tarozidagiIdish, taraMassa, sahnaRef, setAralashmaOzgarish]);

  // "Katod" qadami — katodda mis qoplana boshlaganda.
  //
  // Chegara TAXMINIY EMAS: elektroliz taymeri ishga tushishi bilan
  // `elektrolizHisobla` katodda ajralgan massani beradi, ya'ni vaqt
  // noldan oshgani mis paydo bo'lgani demak (elektroliz-dvigatel.js).
  //
  // Bayroq alohida o'zgaruvchida: `elektrolizVaqt` har soniyada
  // o'zgaradi va effektni har safar qayta ishga tushirardi.
  const katodQoplanmoqda = elektrolizVaqt > 0;
  useEffect(() => {
    if (katodQoplanmoqda) amalYoz({ turi: "amal", kalit: "katod" });
  }, [katodQoplanmoqda, amalYoz]);

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

  // Elektroliz jonli simulyatsiya sikli
  useEffect(() => {
    let timer = null;
    const stend = sahnaRef?.current?.getObjectByName("Elektroliz_Stansiyasi");

    if (elektrolizFaol) {
      pufakchaChiqishi();
      timer = setInterval(() => {
        setElektrolizVaqt((prev) => {
          const yangi = prev + 1;
          const data = elektrolizHisobla("cuso4_grafit", 2.5, yangi);

          if (stend?.userData?.stendniYangila) {
            stend.userData.stendniYangila(2.5, true, true);
          }

          if (yangi % 5 === 0) {
            pufakchaChiqishi();
          }
          return yangi;
        });
      }, 1000);
    } else {
      if (stend?.userData?.stendniYangila) {
        stend.userData.stendniYangila(0, false, false);
      }
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [elektrolizFaol, sahnaRef]);

  return {
    tarozidagiIdish,
    taraMassa,
    suvOqmoqda,
    spatulaKukun,
    titrlashTomchilamoqda,
    titrlashHajmi,
    elektrolizFaol,
    elektrolizVaqt,
    dushOqmoqda,
    kozYuvishOqmoqda,
    kozoynakTaqilgan,
    gazNiqobiTaqilgan,
    xonaTutun,
    setXonaTutun,
    handleHolatOzgardimi,
    handleTaroziTushdi,
    handleTarozidanOlingan,
    handleTaroziTara,
    handleTaroziNol,
    handleRakovinaKraniBosildi,
    handleRakovinagaTushdi,
    handleXavfsizlikDushi,
    handleKozYuvish,
    handleKozoynakTaqish,
    handleGazNiqobiTaqish,
    handleTitrlashKran,
    handleElektrolizTok,
    handleAralashtirish,
    handleSpatulaAmal,
  };
}
