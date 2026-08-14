"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Ikon from "@/components/Ikon";
import { useSahna } from "./hooks/useSahna.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import { useYurish } from "./hooks/useYurish.js";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import MolekulaZoomModal from "./components/MolekulaZoomModal.jsx";
import TaroziUI from "./components/TaroziUI.jsx";
import TitrlashStendiUI from "./components/TitrlashStendiUI.jsx";
import ElektrolizStendiUI from "./components/ElektrolizStendiUI.jsx";
import EkspertXulosaModal from "./components/EkspertXulosaModal.jsx";
import DavriyJadvalModal from "./components/DavriyJadvalModal.jsx";
import XRayMolekulaModal from "./components/XRayMolekulaModal.jsx";
import VirtualJoystick from "./components/VirtualJoystick.jsx";
import { portlashniAniqla } from "./lib/portlash.js";
import { labDaftariPdfYukla } from "./lib/pdf-hisobot.js";
import { pufakchaChiqishi, oqimBoshla, oqimToxtat, taroziBip, shishaUrilishi, tiqinOchilishi } from "./lib/ovoz.js";
import { massaHisobla } from "./lib/tarozi.js";
import { eritmaHisobla } from "./lib/eritma-tayyorlash.js";
import { titrlashHolatiniHisobla } from "./lib/titrlash-dvigatel.js";
import { elektrolizHisobla } from "./lib/elektroliz-dvigatel.js";
import { idishYarat, tozala, jamiHajm } from "./lib/idish-holati.js";
import { jurnalYarat, yoz } from "./lib/jurnal.js";
import { suyuqlikSathiniYangila, qaynashniYangila } from "./lib/jihoz-modellari.js";
import { moddaKorinishi } from "./lib/modda-korinishi.js";
import { reagentBirligi, hajmniBirlikka, miqdorniFormatla } from "@/lib/lab-birlik.js";
import toast from "react-hot-toast";

function hexDanCss(hex) {
  return `#${Number(hex || 0xffffff).toString(16).padStart(6, "0")}`;
}

export default function Korinish() {
  // 1. Asosiy holatlar (States)
  const [mounted, setMounted] = useState(false);
  const [labMaLumot, setLabMaLumot] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kirilmagan, setKirilmagan] = useState(false);
  const [yuklashXatosi, setYuklashXatosi] = useState(false);

  const [faolReagent, setFaolReagent] = useState(null);
  const [aralashmaOzgarish, setAralashmaOzgarish] = useState(0);
  const [isitimoda, setIsitimoda] = useState(false);
  const [harorat, setHarorat] = useState(25);
  const [suvOqmoqda, setSuvOqmoqda] = useState(false);

  // Modallar va Stansiyalar (Faqat 3D olam orqali ochiladi)
  const [molekulaModalKalit, setMolekulaModalKalit] = useState(null);
  const [davriyJadvalOchilgan, setDavriyJadvalOchilgan] = useState(false);
  const [titrlashOchilgan, setTitrlashOchilgan] = useState(false);
  const [elektrolizOchilgan, setElektrolizOchilgan] = useState(false);
  const [ekspertModalOchilgan, setEkspertModalOchilgan] = useState(false);
  const [xrayModalOchilgan, setXrayModalOchilgan] = useState(false);
  const [yordamOchilgan, setYordamOchilgan] = useState(false);
  const [ovozYoqilgan, setOvozYoqilgan] = useState(true);

  // Tarozi holati
  const [tarozidagiIdish, setTarozidagiIdish] = useState(null);
  const [taraMassa, setTaraMassa] = useState(0);

  // 2. Reflar
  const holatRef = useRef(idishYarat("probirka", 0));
  const jurnalRef = useRef(jurnalYarat());
  const konteynerRef = useRef(null);

  // 3. 3D Sahna Hooki
  const {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    jihozQosh,
    jihozOlib,
    hammaJihozlar,
    kuchsizQurilma,
  } = useSahna(konteynerRef, yuklanmoqda, "zamonaviy");

  // 4. Tarozi va Spirtovka Callbacklari
  const handleHolatOzgardimi = useCallback(() => {
    setAralashmaOzgarish((s) => s + 1);

    if (tarozidagiIdish && tarozidagiIdish.userData?.tarozida) {
      const idishKaliti = tarozidagiIdish.userData?.kalit || "probirka";
      const data = massaHisobla(idishKaliti, holatRef.current?.moddalar || {}, taraMassa);
      const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
      if (taroziMesh?.userData?.ekranniYangila) {
        taroziMesh.userData.ekranniYangila(data.nettoMassa, taraMassa, idishKaliti, true);
      }
    }
  }, [sahnaRef, tarozidagiIdish, taraMassa]);

  const handleIdishTanlandi = useCallback((group) => {
    if (group && group.userData?.kalit) {
      if (group.userData.sigim > 0 && !group.userData.devorShishasi) {
        holatRef.current.idish = group.userData.kalit;
      } else {
        setFaolReagent(group.userData.kalit);
      }
    }
  }, []);

  const handleTaroziTushdi = useCallback((group) => {
    setTarozidagiIdish(group);
    taroziBip(2400);

    const taroziMesh = sahnaRef?.current?.getObjectByName("Tarozi_Stansiyasi");
    if (taroziMesh?.userData?.ekranniYangila) {
      const idishKaliti = group.userData?.kalit || "probirka";
      const data = massaHisobla(idishKaliti, holatRef.current?.moddalar || {}, taraMassa);

      const jitter = data.nettoMassa + (Math.random() * 0.012 - 0.006);
      taroziMesh.userData.ekranniYangila(jitter, taraMassa, idishKaliti, false);

      setTimeout(() => {
        taroziMesh.userData.ekranniYangila(data.nettoMassa, taraMassa, idishKaliti, true);
        taroziBip(3200);
      }, 160);
    }
    toast.success(`⚖️ Idish tarozi pallasiga qo'yildi: ${group.userData?.kalit || "Idish"}`);
  }, [sahnaRef, taraMassa]);

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
      const idishKaliti = tarozidagiIdish?.userData?.kalit || holatRef.current?.idish || "probirka";
      const data = massaHisobla(idishKaliti, holatRef.current?.moddalar || {}, 0);
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
        const data = massaHisobla(idishKaliti, holatRef.current?.moddalar || {}, 0);
        taroziMesh.userData.ekranniYangila(data.nettoMassa, 0, idishKaliti, true);
      } else {
        taroziMesh.userData.ekranniYangila(0, 0, "", true);
      }
    }
    toast("↺ Tarozi nolga qaytarildi", { icon: "⚖️" });
  }, [sahnaRef, tarozidagiIdish]);

  const handleSpirtovkaBosildi = useCallback(() => {
    setIsitimoda((prev) => {
      const yangi = !prev;
      if (yangi) {
        pufakchaChiqishi();
        toast.success("🔥 Spirtovka alangalantirildi!");
      } else {
        toast("❄️ Spirtovka o'chirildi", { icon: "🔥" });
      }
      return yangi;
    });
  }, []);

  const handleSpirtovkagaQoyildi = useCallback((group) => {
    setIsitimoda(true);
    toast.success("🔥 Idish spirtovka shtativiga qo'yildi va qizdirilmoqda");
  }, []);

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
    }
    holatRef.current = tozala(holatRef.current);
    jurnalRef.current = jurnalYarat();

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
  }, [sahnaRef]);

  // 5. Quyish Hooki
  const {
    quyishBoshla,
    quyishToxtat,
    burchakniOrnat,
    shishaniKeltir,
    javongaQaytar,
    aniqHajmQuy,
    egishBurchagi,
    quyilmoqda,
    quyishTezligiMl,
    faolShishaMesh,
  } = useQuyish({
    sahnaRef,
    holatRef,
    jurnalRef,
    onOzgarish: handleHolatOzgardimi,
  });

  const nishonIdishGroup = hammaJihozlar[0] || null;

  // Stenddan yangi toza jihoz qo'shish
  const handleStenddanJihozOlish = useCallback((kalit) => {
    if (!sahnaRef?.current) return null;
    const yangi = jihozQosh(kalit || "probirka");
    if (yangi) {
      toast.success(`✨ Yangi toza ${kalit} stenddan olindi`);
    }
    return yangi;
  }, [sahnaRef, jihozQosh]);

  // 6. Tajriba O'tkazish Hooki
  const yuklaLab = useCallback(async () => {
    setYuklanmoqda(true);
    setKirilmagan(false);
    setYuklashXatosi(false);

    try {
      const res = await fetch("/api/laboratoriya");
      if (res.status === 401) {
        setKirilmagan(true);
        setYuklanmoqda(false);
        return;
      }
      if (!res.ok) {
        setYuklashXatosi(true);
        setYuklanmoqda(false);
        return;
      }
      const data = await res.json();
      setLabMaLumot(data);
    } catch (e) {
      setYuklashXatosi(true);
    } finally {
      setYuklanmoqda(false);
    }
  }, []);

  const {
    otkaz,
    otkazilmoqda,
    natija,
    tanlov,
    xato,
    nisbatBahosi,
    hisobotMatni,
    kinetika,
    setNatija,
    setTanlov,
    setXato,
  } = useTajriba({
    sahnaRef,
    holatRef,
    jurnalRef,
    holatniYangila: yuklaLab,
  });

  const handlePlanshetBosildi = useCallback(() => {
    setEkspertModalOchilgan(true);
  }, []);

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
        toast.success("🥽 Kimyoviy himoya ko'zoynagi taqildi!");
      } else {
        toast("🥽 Himoya ko'zoynagi yechildi", { icon: "👓" });
      }
      return yangi;
    });
  }, []);

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
        toast.success("💧 Byuretka krani ochildi: Titrant tomchilamoqda");
      } else {
        oqimToxtat();
        toast("💧 Byuretka krani yopildi", { icon: "🧪" });
      }
      return yangi;
    });
  }, []);

  const handleElektrolizTok = useCallback(() => {
    setElektrolizFaol((prev) => {
      const yangi = !prev;
      if (yangi) {
        pufakchaChiqishi();
        toast.success("⚡ DC Tok Manbai faollashdi (2.5 A). Elektroliz jarayoni boshlandi!");
      } else {
        toast("⚡ Tok manbai o'chirildi", { icon: "🔌" });
      }
      return yangi;
    });
  }, []);

  const handleAralashtirish = useCallback((targetGroup) => {
    pufakchaChiqishi();
    toast.success("🌀 Shisha tayoqcha bilan aralashtirildi! Reaksiya kinetikasi tezlashdi.");
    otkaz(null, targetGroup);
  }, [otkaz]);

  const handleSpatulaAmal = useCallback((group) => {
    if (spatulaKukun) {
      const tuz = spatulaKukun;
      const qoshilganGramm = 1.0;

      const yangiModdalar = {
        ...(holatRef.current.moddalar || {}),
        [tuz]: {
          ...(holatRef.current.moddalar?.[tuz] || {}),
          gramm: ((holatRef.current.moddalar?.[tuz]?.gramm || 0) + qoshilganGramm),
          ml: ((holatRef.current.moddalar?.[tuz]?.ml || 0) + 1.0),
        },
      };

      holatRef.current = {
        ...holatRef.current,
        idish: group.userData?.kalit || holatRef.current.idish || "probirka",
        moddalar: yangiModdalar,
      };

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

      // Agar suv bor bo'lsa, konsentratsiyani hisoblab rangini yangilash
      const suvMl = yangiModdalar["H₂O"]?.ml || yangiModdalar["suv"]?.ml || 0;
      if (suvMl > 0) {
        const eritmaData = eritmaHisobla(tuz, yangiModdalar[tuz].gramm, suvMl);
        suyuqlikSathiniYangila(group, suvMl + 2, { rang: eritmaData.rang, shaffoflik: eritmaData.shaffoflik });
        toast.success(`🧂 ${qoshilganGramm.toFixed(3)}g ${tuz} eritildi! Konsentratsiya: ${eritmaData.molyarlik.toFixed(3)} M`);
      } else {
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

  const handleStansiyaOchildi = useCallback((stansiya) => {
    if (stansiya === "davriy_jadval") setDavriyJadvalOchilgan(true);
    else if (stansiya === "titrlash") setTitrlashOchilgan(true);
    else if (stansiya === "elektroliz") setElektrolizOchilgan(true);
    else if (stansiya === "lab_planshet") setEkspertModalOchilgan(true);
  }, []);

  // 7. Xonada Erkin Yurish Hooki (FPS Direct Hands Engine)
  const {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    fpsQaralganIdish,
    fpsQolIdish,
    fpsQaralganStansiya,
    fpsKontekstMatn,
    fpsKontekstTuri,
    qolgaOlYokiQoy,
    sezgirlik,
    sezgirlikniOzgartir,
    handleJoystickHarakat,
    handleJoystickBurilish,
  } = useYurish({
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    onIdishTanlandi: handleIdishTanlandi,
    onQuyishBoshla: (reagent, target, source, angle) => {
      quyishBoshla(reagent, target, source, angle);
    },
    onQuyishToxtat: quyishToxtat,
    onAniqHajmQuy: (ml) => {
      if (nishonIdishGroup) {
        aniqHajmQuy(faolReagent || fpsQolIdish?.userData?.kalit || "H₂O", nishonIdishGroup, ml);
      }
    },
    onTaroziTushdi: handleTaroziTushdi,
    onTarozidanOlingan: handleTarozidanOlingan,
    onTaroziTara: handleTaroziTara,
    onTaroziNol: handleTaroziNol,
    onSpirtovkaBosildi: handleSpirtovkaBosildi,
    onSpirtovkagaQoyildi: handleSpirtovkagaQoyildi,
    onRakovinaKraniBosildi: handleRakovinaKraniBosildi,
    onRakovinagaTushdi: handleRakovinagaTushdi,
    onPlanshetBosildi: handlePlanshetBosildi,
    onStansiyaOchildi: handleStansiyaOchildi,
    onStenddanJihozOlish: handleStenddanJihozOlish,
    onJavongaQaytar: javongaQaytar,
    onAralashtirish: handleAralashtirish,
    onSpatulaAmal: handleSpatulaAmal,
    onTitrlashKran: handleTitrlashKran,
    onElektrolizTok: handleElektrolizTok,
    onXavfsizlikDushi: handleXavfsizlikDushi,
    onKozYuvish: handleKozYuvish,
    onKozoynakTaqish: handleKozoynakTaqish,
    onGazNiqobiTaqish: handleGazNiqobiTaqish,
    isitimoda,
    tarozidagiIdish,
    taraMassa,
  });

  // ─── BARCHA EFFECTLAR ───

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

  useEffect(() => {
    setMounted(true);

    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;
    const prevOverscroll = document.body.style.overscrollBehavior;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
      document.body.style.overscrollBehavior = prevOverscroll;
    };
  }, []);

  // Klaviatura qisqa buyruqlari ([H] Yordam, [M] Ovoz)
  useEffect(() => {
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (e.code === "KeyH") {
        setYordamOchilgan((v) => !v);
      } else if (e.code === "KeyM") {
        setOvozYoqilgan((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Spirtovkada isitish va sovish sikli
  useEffect(() => {
    if (holatRef.current) {
      holatRef.current.harorat = harorat;
    }
  }, [harorat]);

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

  // Smart Planshet / Monitor ekranini yangilash
  useEffect(() => {
    const planshetMesh = sahnaRef?.current?.getObjectByName("Lab_Plansheti");
    if (planshetMesh?.userData?.ekranniYangila) {
      planshetMesh.userData.ekranniYangila(natija?.reaksiya || null, harorat, kinetika);
    }
  }, [natija, harorat, kinetika, sahnaRef]);

  // Moddalar aralashganda avtomatik reaksiya hisoblash
  useEffect(() => {
    const moddalar = holatRef.current?.moddalar || {};
    const moddaKalitlar = Object.keys(moddalar);

    if (moddaKalitlar.length >= 2 && !otkazilmoqda && !natija) {
      otkaz(null, nishonIdishGroup);
    }
  }, [aralashmaOzgarish, otkazilmoqda, natija, otkaz, nishonIdishGroup]);

  useEffect(() => {
    yuklaLab();
  }, [yuklaLab]);

  const quyilganModdalar = holatRef.current?.moddalar || {};
  const quyilganKalitlar = Object.keys(quyilganModdalar);
  const jamiMl = jamiHajm(holatRef.current);

  if (kirilmagan) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-[var(--v3-matn)] bg-[#030712]">
        <div className="v3-panel-karta max-w-sm w-full text-center p-8 space-y-4 border border-[var(--v3-chiziq)] bg-[#0b1329]/95 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-[var(--v3-yuza-2)] border border-[var(--v3-chiziq)] flex items-center justify-center mx-auto text-[var(--v3-urgu)]">
            <Ikon nom="qulf" olcham={24} />
          </div>
          <h2 className="text-xl font-bold text-[var(--v3-matn)]">
            Tizimga Kirish Talab Etiladi
          </h2>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            3D virtual laboratoriyadan erkin foydalanish va tajribalarni o{"'"}tkazish uchun hisobingizga kiring.
          </p>
          <a
            href="/login?callbackUrl=/laboratoriya/3d"
            className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-2.5 font-bold"
          >
            Kirish →
          </a>
          <a href="/laboratoriya" className="text-xs text-[var(--v3-xira)] hover:underline block pt-2">
            ← 2D Laboratoriyaga qaytish
          </a>
        </div>
      </div>
    );
  }

  if (!mounted || yuklanmoqda) {
    return (
      <div className="v3 flex min-h-screen flex-col items-center justify-center text-[var(--v3-matn)] bg-[#030712]">
        <div className="flex flex-col items-center gap-3 text-cyan-400">
          <Ikon nom="vaqt" olcham={36} className="animate-spin text-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-widest uppercase">
            3D Virtual Laboratoriya Yuklanmoqda...
          </span>
        </div>
      </div>
    );
  }

  const balans = labMaLumot?.balans || { coins: 0, gems: 0, stars: 0 };

  return (
    <div
      data-fon="zamonaviy"
      className="v3 flex h-[100dvh] w-screen flex-col overflow-hidden text-[var(--v3-matn)] bg-[#030712] transition-colors duration-200 select-none touch-none overscroll-none fixed inset-0"
    >
      <MobilOgohlantirish />

      {/* --- ASOSIY 3D SAHNA MAYDONI --- */}
      <main className="relative h-full w-full flex-1 overflow-hidden select-none touch-none overscroll-none">
        <div
          ref={konteynerRef}
          className="absolute inset-0 h-full w-full touch-none select-none cursor-crosshair"
          style={{ touchAction: "none", overscrollBehavior: "none" }}
        />

        {/* --- BIRINCHI SHAXS KO'ZOYNAK / GAZ NIQOBI FPS HUD QATLAMI --- */}
        {kozoynakTaqilgan && (
          <div className="pointer-events-none absolute inset-0 z-10 border-[16px] sm:border-[28px] border-cyan-950/30 ring-1 ring-cyan-400/20 shadow-[inset_0_0_100px_rgba(6,182,212,0.15)] backdrop-brightness-105" />
        )}

        {gazNiqobiTaqilgan && (
          <div className="pointer-events-none absolute inset-0 z-10 border-[24px] sm:border-[44px] border-slate-950/80 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] ring-2 ring-amber-500/30">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 border border-amber-500/40 text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
              ● RESPIRATOR HAZMAT FILTR FAOL (O₂: 99.8%)
            </div>
          </div>
        )}

        {/* --- SLEEK MINIMAL CYBER-HUD (YUQORI BURCHAKLAR) --- */}
        {/* Yuqori chap: Brend va Rejim */}
        <div className="absolute top-3 left-4 z-30 flex items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400">
              JDA KIMYO · 3D LAB
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{harorat}°C</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${tarozidagiIdish ? "bg-emerald-400" : "bg-slate-500"}`} />
              <span>{tarozidagiIdish ? "Tarozi band" : "Tarozi bo'sh"}</span>
            </span>
            {kozoynakTaqilgan && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 font-bold">🥽 Ko{"'"}zoynak</span>
              </>
            )}
            {gazNiqobiTaqilgan && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-amber-400 font-bold">🎭 Respirator</span>
              </>
            )}
          </div>
        </div>

        {/* Yuqori o'ng: 3 ta Minimalist Favqulodda Tugmalar */}
        <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
          {/* Sezgirlik sozlagichi */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono">
            <span className="text-slate-400">Sezgirlik:</span>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={sezgirlik}
              onChange={(e) => sezgirlikniOzgartir(e.target.value)}
              className="w-14 accent-cyan-400 cursor-pointer h-1"
              title="Sichqoncha sezgirligi"
            />
            <span className="font-bold text-cyan-400">{sezgirlik.toFixed(1)}x</span>
          </div>

          {/* Ovoz tugmasi */}
          <button
            type="button"
            onClick={() => setOvozYoqilgan(!ovozYoqilgan)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-all ${
              ovozYoqilgan
                ? "bg-slate-950/80 border-slate-800 text-cyan-400 hover:border-cyan-400"
                : "bg-red-950/60 border-red-800 text-red-400"
            }`}
            title="Ovozni yoqish / o'chirish (M)"
          >
            <Ikon nom={ovozYoqilgan ? "kanal" : "taqiq"} olcham={14} />
          </button>

          {/* Yordam & Boshqaruv qo'llanmasi tugmasi */}
          <button
            type="button"
            onClick={() => setYordamOchilgan(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-emerald-400 hover:border-emerald-400 backdrop-blur-md flex items-center gap-1.5 transition-all"
            title="Klaviatura va Boshqaruv Qo'llanmasi (H)"
          >
            <Ikon nom="kitob" olcham={13} />
            <span>[H] Qo{"'"}llanma</span>
          </button>

          {/* 2D Labga qaytish / Chiqish */}
          <Link
            href="/laboratoriya"
            className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:border-slate-600 backdrop-blur-md flex items-center gap-1 transition-all"
            title="2D Laboratoriyaga qaytish (ESC)"
          >
            <Ikon nom="chap" olcham={12} />
            <span>2D Lab</span>
          </Link>
        </div>

        {/* --- EKRAN MARKAZIDAGI CROSSHAIR VA JISMONIY CYBER-HUD PROMPT --- */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-20">
          {/* Markaziy nishoncha (Crosshair) */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
              fpsKontekstMatn
                ? "bg-cyan-400 scale-150 shadow-[0_0_14px_#38bdf8] ring-2 ring-cyan-300/40"
                : "bg-white/80 scale-100 shadow-[0_0_8px_#ffffff]"
            }`}
          />

          {/* Dinamik In-World Kontekst Yordamchisi */}
          {fpsKontekstMatn && (
            <div
              className={`mt-4 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 ${
                fpsKontekstTuri === "urgu"
                  ? "bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  : fpsKontekstTuri === "yuvish"
                  ? "bg-sky-950/90 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                  : fpsKontekstTuri === "quyish"
                  ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  : fpsKontekstTuri === "olish"
                  ? "bg-purple-950/90 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                  : "bg-slate-950/90 border-slate-700 text-slate-200"
              }`}
            >
              <span>{fpsKontekstMatn}</span>
            </div>
          )}
        </div>

        {/* --- MOBIL PUBG USLUBIDAGI DUAL SENSORLI ANALOG JOYSTIK --- */}
        <VirtualJoystick
          onHarakat={handleJoystickHarakat}
          onBurilish={handleJoystickBurilish}
          qaralganIdish={fpsQaralganIdish}
          qolIdish={fpsQolIdish}
          onQolgaOlYokiQoy={qolgaOlYokiQoy}
          onQuyish={() => {
            if (fpsQolIdish && fpsQaralganIdish) {
              quyishBoshla(fpsQolIdish.userData?.kalit, fpsQaralganIdish, fpsQolIdish, 45);
            }
          }}
        />

        {/* --- O'NG PASTKI BURCHAK: QO'LDAGI IDISH HUD KARTASI --- */}
        {fpsQolIdish && (
          <div className="absolute bottom-4 right-4 z-30 w-72 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl bg-slate-950/90 border-slate-800/90 space-y-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Ikon nom="kolba" olcham={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Qo{"'"}lda ushlab turilgan:
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {fpsQolIdish.userData?.nom || fpsQolIdish.userData?.kalit}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {fpsQolIdish.userData?.devorShishasi ? (
                  <button
                    type="button"
                    onClick={() => {
                      javongaQaytar();
                      setFpsQolIdish(null);
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                    title="Shishani devor javoniga qaytarish [G]"
                  >
                    [G] Javonga
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => qolgaOlYokiQoy("stolga_qoy")}
                    className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all"
                    title="Stolga qo'yish [G]"
                  >
                    [G] Stolga
                  </button>
                )}
              </div>
            </div>

            {/* Spatula yoki Shisha tayoqcha holati */}
            {fpsQolIdish.userData?.kalit === "spatula" && (
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
                {spatulaKukun ? (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <span>🧂</span> Spatulada: 1.0g {spatulaKukun} kukuni
                  </span>
                ) : (
                  <span className="text-slate-400">🧂 Spatula bo{"'"}sh (Tuz shishasidan kukun oling)</span>
                )}
              </div>
            )}

            {fpsQolIdish.userData?.kalit === "shisha-tayoqcha" && (
              <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
                🌀 Shisha tayoqcha (Probirkani aralashtirish uchun bosing)
              </div>
            )}

            {/* Agar devor reagent shishasi bo'lsa -> Tezkor doza klavishlari */}
            {fpsQolIdish.userData?.devorShishasi && (
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="text-[9px] font-mono text-slate-400 flex justify-between">
                  <span>Aniq hajm quyish:</span>
                  <span className="text-cyan-400 font-bold">Klavishlar: 1 - 5</span>
                </div>
                <div className="grid grid-cols-5 gap-1 font-mono text-[10px] text-center">
                  {[
                    { ml: 1, k: "1" },
                    { ml: 5, k: "2" },
                    { ml: 10, k: "3" },
                    { ml: 25, k: "4" },
                    { ml: 50, k: "5" },
                  ].map(({ ml, k }) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => {
                        if (nishonIdishGroup) {
                          aniqHajmQuy(fpsQolIdish.userData?.kalit, nishonIdishGroup, ml);
                        }
                      }}
                      className="py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                    >
                      +{ml}ml
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Agar idishda moddalar bo'lsa */}
            {quyilganKalitlar.length > 0 && !fpsQolIdish.userData?.devorShishasi && (
              <div className="space-y-1 pt-1 border-t border-slate-800/80">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Tarkib:</span>
                  <span className="text-emerald-400 font-bold">{jamiMl.toFixed(1)} ml</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {quyilganKalitlar.map((k) => (
                    <span
                      key={k}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                    >
                      {k}: {quyilganModdalar[k]?.ml?.toFixed(1)}ml
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- MODALLAR (FAQAT 3D OB'EKTGA YAQINLASHIB BOSILGANDA OCHILADI) --- */}
      {davriyJadvalOchilgan && (
        <DavriyJadvalModal onYop={() => setDavriyJadvalOchilgan(false)} />
      )}

      {titrlashOchilgan && (
        <TitrlashStendiUI onYop={() => setTitrlashOchilgan(false)} />
      )}

      {elektrolizOchilgan && (
        <ElektrolizStendiUI onYop={() => setElektrolizOchilgan(false)} />
      )}

      {ekspertModalOchilgan && (
        <EkspertXulosaModal
          natija={natija}
          nisbat={nisbatBahosi}
          kinetika={kinetika}
          jurnal={jurnalRef?.current?.yozuvlar}
          foydalanuvchiNom={labMaLumot?.foydalanuvchi?.ism || "Talaba"}
          onYop={() => setEkspertModalOchilgan(false)}
          onXRayOch={() => {
            setEkspertModalOchilgan(false);
            setXrayModalOchilgan(true);
          }}
          onPdfYukla={async () => {
            await labDaftariPdfYukla({
              foydalanuvchiNom: labMaLumot?.foydalanuvchi?.ism || "Talaba",
              tenglama: natija?.reaksiya?.equation,
              observations: natija?.reaksiya?.observations,
              nisbat: nisbatBahosi,
              kinetika,
              jurnal: jurnalRef?.current?.yozuvlar,
            });
          }}
        />
      )}

      {xrayModalOchilgan && (
        <XRayMolekulaModal
          reaksiyaTenglamasi={natija?.reaksiya?.equation || "HCl + NaOH"}
          onYop={() => setXrayModalOchilgan(false)}
        />
      )}

      {molekulaModalKalit && (
        <MolekulaZoomModal
          kalit={molekulaModalKalit}
          onYop={() => setMolekulaModalKalit(null)}
        />
      )}

      {/* --- [H] BOSHQARUV VA KLAVIATURA QO'LLANMASI MODALI --- */}
      {yordamOchilgan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setYordamOchilgan(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#090d16] p-6 shadow-2xl space-y-4 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                <Ikon nom="odam" olcham={18} />
                <span>3D JISMONIY BOSHQARUV QO{"'"}LLANMASI</span>
              </div>
              <button
                type="button"
                onClick={() => setYordamOchilgan(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="odam" olcham={13} />
                  <span>WASD / Joystik</span>
                </div>
                <div className="text-slate-400 text-[11px]">16x12m xona bo{"'"}ylab erkin yurish</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="qidiruv" olcham={13} />
                  <span>Erkin Sichqoncha</span>
                </div>
                <div className="text-slate-400 text-[11px]">CS 1.6 uslubidagi 360° ko{"'"}rish (Tugmasiz)</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="kolba" olcham={13} />
                  <span>[E] / Chap Klik</span>
                </div>
                <div className="text-slate-400 text-[11px]">Idishni olish, quyish, kran/tarozini bosish</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="past" olcham={13} />
                  <span>[G] Klavishi</span>
                </div>
                <div className="text-slate-400 text-[11px]">Idishni stolga qo{"'"}yish / Shkafga qaytarish</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="atom" olcham={13} />
                  <span>[1, 2, 3, 4, 5]</span>
                </div>
                <div className="text-slate-400 text-[11px]">1ml, 5ml, 10ml, 25ml, 50ml aniq doza quyish</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-sky-400 font-bold flex items-center gap-1.5">
                  <Ikon nom="ochiq" olcham={13} />
                  <span>[C / Ctrl]</span>
                </div>
                <div className="text-slate-400 text-[11px]">Cho{"'"}qqayish (Pastki javonlarni tekshirish)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <strong className="text-white block font-mono text-cyan-400">100% Tugmasiz Jismoniy Olam:</strong>
              <p>
                • <strong>Reagentlar:</strong> Devordagi 4 ta shkaf oldiga borib shishaga qarang va <code>[E]</code> bosing.
              </p>
              <p>
                • <strong>Jihozlar:</strong> Stoldagi Jihozlar Stendi oldiga borib bo{"'"}sh probirka/kolbani <code>[E]</code> bilan oling.
              </p>
              <p>
                • <strong>Tarozi:</strong> Stoldagi 3D tarozi oldiga kelib <code>[TARA]</code> yoki <code>[ZERO]</code> tugmasini bosing.
              </p>
              <p>
                • <strong>Yuvish:</strong> Rakovina oldiga borib kran jo{"'"}mragini buring yoki idishni yuving.
              </p>
              <p>
                • <strong>Reaksiya Tahlili:</strong> Stoldagi Smart Planshet oldiga kelib <code>[E]</code> bosing.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setYordamOchilgan(false)}
              className="w-full py-2 rounded-xl bg-cyan-500 text-black font-bold font-mono text-xs hover:bg-cyan-400 transition-all shadow-lg"
            >
              Tushundim, Laboratoriyaga Qaytish →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
