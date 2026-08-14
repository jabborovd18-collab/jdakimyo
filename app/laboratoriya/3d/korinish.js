"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";
import { useSahna } from "./hooks/useSahna.js";
import { useSudrash } from "./hooks/useSudrash.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import { useYurish } from "./hooks/useYurish.js";
import ReagentJavoni from "./components/ReagentJavoni.jsx";
import JihozJavoni from "./components/JihozJavoni.jsx";
import NatijaPaneli from "./components/NatijaPaneli.jsx";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import SifatAnalizPaneli from "./components/SifatAnalizPaneli.jsx";
import MolekulaZoomModal from "./components/MolekulaZoomModal.jsx";
import PHMeterUI from "./components/PHMeterUI.jsx";
import TaroziUI from "./components/TaroziUI.jsx";
import EritmaTayyorlashModal from "./components/EritmaTayyorlashModal.jsx";
import TitrlashStendiUI from "./components/TitrlashStendiUI.jsx";
import ElektrolizStendiUI from "./components/ElektrolizStendiUI.jsx";
import EkspertXulosaModal from "./components/EkspertXulosaModal.jsx";
import XonaNavigatsiyaUI from "./components/XonaNavigatsiyaUI.jsx";
import SandiqOchishModal from "./components/SandiqOchishModal.jsx";
import XavfsizlikModal from "./components/XavfsizlikModal.jsx";
import KristallPanjaraModal from "./components/KristallPanjaraModal.jsx";
import DavriyJadvalModal from "./components/DavriyJadvalModal.jsx";
import AmaliyMashgulotModal from "./components/AmaliyMashgulotModal.jsx";
import XRayMolekulaModal from "./components/XRayMolekulaModal.jsx";
import VirtualJoystick from "./components/VirtualJoystick.jsx";
import { zonagaOt } from "./lib/xona-zonalari.js";
import { portlashniAniqla } from "./lib/portlash.js";
import { labDaftariPdfYukla } from "./lib/pdf-hisobot.js";
import { pufakchaChiqishi, oqimBoshla, oqimToxtat, taroziBip } from "./lib/ovoz.js";
import { massaHisobla } from "./lib/tarozi.js";
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

  const [tozaEkran, setTozaEkran] = useState(false);
  const [faolReagent, setFaolReagent] = useState(null);
  const [aralashmaOzgarish, setAralashmaOzgarish] = useState(0);
  const [mobilJavon, setMobilJavon] = useState(null);
  const [sifatAnalizOchilgan, setSifatAnalizOchilgan] = useState(false);
  const [molekulaModalKalit, setMolekulaModalKalit] = useState(null);
  const [isitimoda, setIsitimoda] = useState(false);
  const [harorat, setHarorat] = useState(25);
  const [phMeterOchilgan, setPhMeterOchilgan] = useState(false);
  const [taroziOchilgan, setTaroziOchilgan] = useState(false);
  const [taraMassa, setTaraMassa] = useState(0);
  const [tarozidagiIdish, setTarozidagiIdish] = useState(null);
  const [eritmaOchilgan, setEritmaOchilgan] = useState(false);
  const [titrlashOchilgan, setTitrlashOchilgan] = useState(false);
  const [elektrolizOchilgan, setElektrolizOchilgan] = useState(false);
  const [sandiqOchilgan, setSandiqOchilgan] = useState(false);
  const [portlashMaLumot, setPortlashMaLumot] = useState(null);
  const [kristallPanjaraOchilgan, setKristallPanjaraOchilgan] = useState(false);
  const [davriyJadvalOchilgan, setDavriyJadvalOchilgan] = useState(false);
  const [amaliyotOchilgan, setAmaliyotOchilgan] = useState(false);
  const [xrayModalOchilgan, setXrayModalOchilgan] = useState(false);
  const [ekspertModalOchilgan, setEkspertModalOchilgan] = useState(false);
  const [faolZona, setFaolZona] = useState('asosiy');

  const [fonKaliti, fonniOzgartir] = useFon();

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
  } = useSahna(konteynerRef, yuklanmoqda, fonKaliti);

  // 4. Tarozi, Spirtovka va Rakovina Callbacklari
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
        const kalit = group.userData.kalit;
        setFaolReagent(kalit);
      }
    }
  }, []);

  const handleTaroziTushdi = useCallback((group) => {
    setTarozidagiIdish(group);
    setTaroziOchilgan(true);
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

  const handleTaroziBosildi = useCallback(() => {
    setTaroziOchilgan((v) => !v);
  }, []);

  const handleSpirtovkagaQoyildi = useCallback((group) => {
    setIsitimoda(true);
  }, []);

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

    suyuqlikSathiniYangila(group, 0, null, 0);
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
    }, 2200);
  }, [sahnaRef]);

  // 5. Sudrash Hooki
  const {
    tanlanganIdish,
    setTanlanganIdish,
    kotarilganIdish,
    kursorIdish,
    yaqinNishon,
    nishonTuri,
    sudralmoqda,
    idishniJoyigaQoy,
  } = useSudrash({
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    onIdishTanlandi: handleIdishTanlandi,
    onTaroziTushdi: handleTaroziTushdi,
    onTarozidanOlingan: handleTarozidanOlingan,
    onTaroziBosildi: handleTaroziBosildi,
    onTaroziTara: handleTaroziTara,
    onTaroziNol: handleTaroziNol,
    onSpirtovkagaQoyildi: handleSpirtovkagaQoyildi,
    onRakovinagaTushdi: handleRakovinagaTushdi,
  });

  const nishonIdishGroup = yaqinNishon || tanlanganIdish || hammaJihozlar[0] || null;

  // 6. Quyish Hooki
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

  const handleStansiyaOchildi = useCallback((stansiya) => {
    if (stansiya === "davriy_jadval") setDavriyJadvalOchilgan(true);
    else if (stansiya === "titrlash") setTitrlashOchilgan(true);
    else if (stansiya === "elektroliz") setElektrolizOchilgan(true);
    else if (stansiya === "tarozi") setTaroziOchilgan(true);
  }, []);

  // 7. Xonada Erkin Yurish Hooki (FPS Direct Hands Engine)
  const {
    yurishRejimi,
    toggleYurishRejimi,
    yurmoqda,
    fpsQaralganIdish,
    fpsQolIdish,
    fpsQaralganStansiya,
    qolgaOlYokiQoy,
    sezgirlik,
    sezgirlikniOzgartir,
    handleJoystickHarakat,
    handleJoystickBurilish,
  } = useYurish({
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    onIdishTanlandi: handleIdishTanlandi,
    onQuyishBoshla: quyishBoshla,
    onAniqHajmQuy: (ml) => {
      if (nishonIdishGroup) {
        aniqHajmQuy(faolReagent || "H₂O", nishonIdishGroup, ml);
      }
    },
    onTaroziTushdi: handleTaroziTushdi,
    onSpirtovkagaQoyildi: handleSpirtovkagaQoyildi,
    onRakovinagaTushdi: handleRakovinagaTushdi,
    onStansiyaOchildi: handleStansiyaOchildi,
  });

  // 8. Tajriba O'tkazish Hooki
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

  // ─── BARCHA EFFECTLAR (HOOKLAR VA O'ZGARUVCHILARDAN KEYIN) ───

  useEffect(() => {
    setMounted(true);

    // 5-MUAMMO: Mobil brauzerlarda butun sahifa silkinishi va rubber-band scrollni bloklash
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

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "KeyH" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        setTozaEkran((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 4-MUAMMO: Spirtovkada isitish, termometr simob ustunini ko'tarish va qaynash girdobi
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
          const yangi = Math.min(250, prev + 5);

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
      }, 750);
    } else {
      if (spirtovkaMesh?.userData?.alanganiYangila) {
        spirtovkaMesh.userData.alanganiYangila(false);
      }

      // Sekin-asta sovish (Cooling back to 25°C)
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

  // Reagent tanlanganda avtomatik devordan stoldagi probirkaga uchirib keltirish
  useEffect(() => {
    if (faolReagent && nishonIdishGroup && typeof shishaniKeltir === "function") {
      shishaniKeltir(faolReagent, nishonIdishGroup);
    }
  }, [faolReagent, nishonIdishGroup, shishaniKeltir]);

  useEffect(() => {
    yuklaLab();
  }, [yuklaLab]);

  useEffect(() => {
    if (!natija?.reaksiya) return;
    const res = portlashniAniqla(natija.reaksiya, harorat);
    if (res.portladi) setPortlashMaLumot(res);
  }, [natija, harorat]);

  // ─── AMAL VA INTERFEYS FUNKSIYALARI ───

  const handleZonaTanlandi = (zonaKaliti) => {
    setFaolZona(zonaKaliti);
    if (kameraRef?.current && controlsRef?.current) {
      zonagaOt(kameraRef.current, controlsRef.current, zonaKaliti);
    }
  };

  const handleReagentTanla = useCallback((kalit) => {
    setFaolReagent(kalit);
  }, []);

  const handleTozalash = () => {
    holatRef.current = tozala(holatRef.current);
    jurnalRef.current = jurnalYarat();
    if (nishonIdishGroup) {
      suyuqlikSathiniYangila(nishonIdishGroup, 0, null, 0);
      qaynashniYangila(nishonIdishGroup, 25);
    }
    setNatija(null);
    setTanlov(null);
    setXato(null);
    setAralashmaOzgarish((s) => s + 1);
  };

  const handleEritmaTayyorlandi = (eritmaData) => {
    let target = nishonIdishGroup;
    if (!target) {
      target = jihozQosh('kolba');
    }
    if (target) {
      const qoshilganMl = eritmaData.hajmMl || 100;
      const qoshilganMol = Number((qoshilganMl * (eritmaData.molyarlik / 1000)).toFixed(6));

      const yangiModdalar = {
        ...holatRef.current.moddalar,
        [eritmaData.reagent]: {
          ml: qoshilganMl,
          mol: qoshilganMol,
          konsentratsiya: eritmaData.molyarlik,
        }
      };

      holatRef.current = {
        ...holatRef.current,
        idish: target.userData?.kalit || 'kolba',
        moddalar: yangiModdalar,
        hajm: qoshilganMl,
      };

      suyuqlikSathiniYangila(target, qoshilganMl, { rang: eritmaData.rang, shaffoflik: 0.85 });

      yoz(jurnalRef.current, {
        amal: "eritma_tayyorlash",
        reagent: eritmaData.reagent,
        ml: qoshilganMl,
        molyarlik: eritmaData.molyarlik,
      });

      setAralashmaOzgarish((s) => s + 1);
    }
  };

  const inventar = labMaLumot?.inventar || [];
  const reagentlar = inventar.filter((i) => i.turi === "reagent");
  const jihozlar = inventar.filter((i) => i.turi === "jihoz");

  const quyilganModdalar = holatRef.current?.moddalar || {};
  const quyilganKalitlar = Object.keys(quyilganModdalar);
  const jamiMl = jamiHajm(holatRef.current);

  if (kirilmagan) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-6 text-[var(--v3-matn)] bg-[var(--v3-fon)]"
      >
        <div className="v3-panel-karta max-w-sm w-full text-center p-8 space-y-4">
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
      <div className="v3 flex min-h-screen flex-col items-center justify-center text-[var(--v3-matn)] bg-[var(--v3-fon)]">
        <div className="flex flex-col items-center gap-3 text-[var(--v3-xira)]">
          <Ikon nom="vaqt" olcham={32} className="animate-spin" />
          <span className="text-xs font-mono">3D Laboratoriya sahnasi yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (yuklashXatosi) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-[var(--v3-matn)] bg-[var(--v3-fon)]">
        <div className="v3-panel-karta max-w-sm w-full text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <Ikon nom="taqiq" olcham={24} />
          </div>
          <h2 className="text-lg font-bold text-[var(--v3-matn)]">
            Ma{"'"}lumot Yuklanmadi
          </h2>
          <p className="text-xs text-[var(--v3-xira)]">
            Laboratoriya serveri bilan bog{"'"}lanishda xatolik yuz berdi.
          </p>
          <button
            type="button"
            onClick={yuklaLab}
            className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-2.5 font-bold"
          >
            Qayta Urinish
          </button>
        </div>
      </div>
    );
  }

  const balans = labMaLumot?.balans || { coins: 0, gems: 0, stars: 0 };
  const lab = labMaLumot?.lab || {};
  const daraja = lab.darajaHolati || { daraja: 1, joriy: 0, kerak: 100, foiz: 0 };

  return (
    <div
      data-fon={fonKaliti}
      className="v3 flex h-[100dvh] w-screen flex-col overflow-hidden text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200 select-none touch-none overscroll-none fixed inset-0"
    >
      <MobilOgohlantirish />

      {/* --- YUQORI HEADER (TOZA EKRAN BO'LMAGANDA) --- */}
      {!tozaEkran && !yurishRejimi && (
        <header
          className="relative z-40 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 backdrop-blur-md bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq)]"
        >
          <div className="flex items-center gap-3">
            <Link href="/laboratoriya" className="v3-tugma text-xs py-1.5 px-3">
              <Ikon nom="chap" olcham={14} />
              <span>2D Lab</span>
            </Link>
            <h1 className="flex items-center gap-2 text-sm font-bold tracking-wide sm:text-base">
              <Ikon nom="kolba" olcham={18} className="text-[var(--v3-urgu)]" />
              <span>3D Laboratoriya</span>
              {kuchsizQurilma && <span className="v3-tag text-[10px]">Ixcham rejim</span>}
            </h1>
          </div>

          {/* Asboblar va vidjetlar tugmalari */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPhMeterOchilgan(!phMeterOchilgan)}
              className={`v3-tugma text-xs font-bold transition ${
                phMeterOchilgan ? "v3-tugma-asosiy" : ""
              }`}
            >
              <Ikon nom="atom" olcham={13} />
              pH-Metr
            </button>

            <button
              type="button"
              onClick={() => setTaroziOchilgan(!taroziOchilgan)}
              className={`v3-tugma text-xs font-bold transition ${
                taroziOchilgan ? "v3-tugma-asosiy" : ""
              }`}
            >
              <Ikon nom="orin" olcham={13} />
              Tarozi
            </button>

            <button
              type="button"
              onClick={() => setKristallPanjaraOchilgan(!kristallPanjaraOchilgan)}
              className={`v3-tugma text-xs font-bold transition ${
                kristallPanjaraOchilgan ? "v3-tugma-asosiy" : ""
              }`}
            >
              <Ikon nom="doska" olcham={13} />
              Kristall Panjara
            </button>

            <button
              type="button"
              onClick={() => setDavriyJadvalOchilgan(!davriyJadvalOchilgan)}
              className={`v3-tugma text-xs font-bold transition ${
                davriyJadvalOchilgan ? "v3-tugma-asosiy" : ""
              }`}
              title="D.I. Mendeleyev Davriy Jadvali (IUPAC)"
            >
              <Ikon nom="atom" olcham={13} />
              Davriy Jadval
            </button>

            <button
              type="button"
              onClick={() => setSandiqOchilgan(!sandiqOchilgan)}
              className="v3-tugma text-xs font-bold text-yellow-400"
            >
              <Ikon nom="orin" olcham={13} />
              Sandiqlar
            </button>

            <button
              type="button"
              onClick={() => setEritmaOchilgan(true)}
              className="v3-tugma text-xs font-bold"
              title="Qattiq moddalarni tortib aniq molyar eritma tayyorlash"
            >
              <Ikon nom="kolba" olcham={13} />
              Eritma Tayyorlash
            </button>

            <button
              type="button"
              onClick={() => setTitrlashOchilgan(true)}
              className="v3-tugma text-xs font-bold"
              title="50 ml Byuretka bilan volumetrik titrlash va ekvivalentlik tahlili"
            >
              <Ikon nom="atom" olcham={13} />
              Titrlash
            </button>

            <button
              type="button"
              onClick={() => setElektrolizOchilgan(true)}
              className="v3-tugma text-xs font-bold"
              title="Faradey qonunlari, katod/anod elektroliz va tok manbai stendi"
            >
              <Ikon nom="chaqmoq" olcham={13} />
              Elektroliz
            </button>

            <button
              type="button"
              onClick={() => setXrayModalOchilgan(true)}
              className="v3-tugma text-xs font-bold text-amber-400 border-amber-500/40 bg-amber-500/10"
              title="Mortal Kombat X-Ray Slow-Motion Bog'lar Uzilishi Tahlili"
            >
              <Ikon nom="chaqmoq" olcham={13} />
              X-Ray Slow-Mo
            </button>

            <button
              type="button"
              onClick={() => setAmaliyotOchilgan(true)}
              className="v3-tugma v3-tugma-asosiy text-xs font-bold"
              title="Ssenariyli amaliy laboratoriya ishlari va kvestlar"
            >
              <Ikon nom="kitob" olcham={13} />
              Amaliy Mashg{"'"}ulotlar
            </button>

            <button
              type="button"
              onClick={() => setSifatAnalizOchilgan(!sifatAnalizOchilgan)}
              className={`v3-tugma text-xs font-bold ${
                sifatAnalizOchilgan ? "v3-tugma-asosiy" : ""
              }`}
            >
              <Ikon nom="quiz" olcham={13} />
              Sifat Analizi
            </button>

            <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />

            {/* Balans */}
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-1 text-xs font-mono font-bold bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]"
            >
              <span className="flex items-center gap-1 text-yellow-400">
                <span>🪙</span> {balans.coins || 0}
              </span>
              <span className="text-[var(--v3-chiziq)]">|</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span>💎</span> {balans.gems || 0}
              </span>
            </div>
          </div>
        </header>
      )}

      {/* --- ASOSIY ISH MAYDONI --- */}
      <div className="relative flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Chap panel: Javonlar (Toza ekranda yashiriladi) */}
        {!tozaEkran && !yurishRejimi && (
          <aside
            className="hidden w-80 shrink-0 flex-col gap-3 border-r p-3 md:flex border-[var(--v3-chiziq)] bg-[var(--v3-fon)]"
          >
            <div className="h-1/2 overflow-hidden">
              <ReagentJavoni
                reagentlar={reagentlar}
                faol={faolReagent}
                onTanla={handleReagentTanla}
                quyilgan={quyilganModdalar}
              />
            </div>
            <div className="h-1/2 overflow-hidden">
              <JihozJavoni
                jihozlar={jihozlar}
                stolda={hammaJihozlar}
                onQosh={(kalit) => jihozQosh(kalit)}
                onOlib={(kalit) => jihozOlib(kalit)}
              />
            </div>
          </aside>
        )}

        {/* Mobil javon tugmalari */}
        <div
          className="flex gap-2 border-b p-2 md:hidden bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)]"
        >
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "reagentlar" ? null : "reagentlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            Reagentlar ({reagentlar.length})
          </button>
          <button
            type="button"
            onClick={() => setMobilJavon(mobilJavon === "jihozlar" ? null : "jihozlar")}
            className="v3-tugma flex-1 justify-center text-xs"
          >
            Jihozlar ({hammaJihozlar.length}/6)
          </button>
        </div>

        {/* Mobil ochiluvchi javon */}
        {mobilJavon && (
          <div
            className="absolute inset-x-0 top-12 z-40 h-80 p-3 shadow-2xl md:hidden bg-[var(--v3-fon-2)]"
          >
            {mobilJavon === "reagentlar" ? (
              <ReagentJavoni
                reagentlar={reagentlar}
                faol={faolReagent}
                onTanla={(kalit) => {
                  handleReagentTanla(kalit);
                  setMobilJavon(null);
                }}
                quyilgan={quyilganModdalar}
              />
            ) : (
              <JihozJavoni
                jihozlar={jihozlar}
                stolda={hammaJihozlar}
                onQosh={(kalit) => {
                  jihozQosh(kalit);
                  setMobilJavon(null);
                }}
                onOlib={(kalit) => jihozOlib(kalit)}
              />
            )}
          </div>
        )}

        {/* --- 3D CANVAS VA HUD MAYDONI --- */}
        <main className="relative h-full min-h-[350px] w-full flex-1 overflow-hidden select-none touch-none overscroll-none">
          <div
            ref={konteynerRef}
            className="absolute inset-0 h-full w-full touch-none select-none"
            style={{ touchAction: "none", overscrollBehavior: "none" }}
          />

          {/* 4-BOSQICH: XONA ZONALARI NAVIGATSIYASI (YURISH VA TOZA EKRANDA YASHIRILADI) */}
          {!yurishRejimi && !tozaEkran && (
            <XonaNavigatsiyaUI
              faolZona={faolZona}
              onZonaTanlandi={handleZonaTanlandi}
            />
          )}

          {/* XONADA ERKIN YURISH (WALK MODE) TUGMASI VA HUD */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleYurishRejimi}
              className={`v3-tugma text-xs font-bold py-1.5 px-3 backdrop-blur-xl shadow-lg transition-all ${
                yurishRejimi
                  ? "bg-emerald-500 text-black border-emerald-400 ring-2 ring-emerald-400"
                  : "bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq-2)]"
              }`}
            >
              <Ikon nom={yurishRejimi ? "odam" : "urin"} olcham={14} />
              <span>{yurishRejimi ? "🚶 Yurish Rejimi (WASD)" : "🚶 Xonada Yurish"}</span>
            </button>

            {/* Toza ekran (Cinema Mode) tugmasi */}
            <button
              type="button"
              onClick={() => setTozaEkran((v) => !v)}
              className={`v3-tugma text-xs font-bold py-1.5 px-2.5 backdrop-blur-xl shadow-lg transition-all ${
                tozaEkran ? "v3-tugma-asosiy ring-1 ring-[var(--v3-urgu)]" : "bg-[var(--v3-fon-2)]/95"
              }`}
              title="To'liq toza ekran (H / Tab)"
            >
              <Ikon nom={tozaEkran ? "ochiq" : "qidiruv"} olcham={14} />
              <span>{tozaEkran ? "Interfeysni ochish" : "👁️ Toza Ekran"}</span>
            </button>

            {yurishRejimi && !tozaEkran && (
              <>
                <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[var(--v3-fon-2)]/95 border border-[var(--v3-chiziq-2)] shadow-lg text-[10px] font-mono">
                  <span className="text-[var(--v3-xira)]">🎯 Sezgirlik:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={sezgirlik}
                    onChange={(e) => sezgirlikniOzgartir(e.target.value)}
                    className="w-16 accent-[var(--v3-urgu)] cursor-pointer h-1"
                    title="Sichqoncha sezgirligini sozlash"
                  />
                  <span className="font-bold text-[var(--v3-urgu)]">{sezgirlik.toFixed(1)}x</span>
                </div>

                <span className="hidden sm:inline-flex v3-tag v3-tag-ochiq text-[10px] font-mono">
                  ⌨️ WASD · E (ushlash/quyish) · G (tashlash) · C (cho{"'"}qqayish) · 1-4 (doza)
                </span>
              </>
            )}
          </div>

          {/* EKRAN MARKAZIDAGI CROSSHAIR VA FPS INTERAKTIV PROMPT */}
          {(yurishRejimi || tozaEkran) && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-20">
              <div
                className={`w-2 h-2 rounded-full transition-all ${
                  fpsQaralganIdish
                    ? "bg-amber-400 scale-150 shadow-[0_0_12px_#f59e0b]"
                    : "bg-white/75 shadow-[0_0_8px_#fff]"
                }`}
              />

              {yurishRejimi && fpsQaralganIdish && (
                <div className="mt-3 px-3 py-1 rounded-xl bg-black/80 border border-amber-400 text-amber-300 text-[11px] font-mono font-bold backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 shadow-2xl">
                  {fpsQolIdish
                    ? `[E] ${fpsQaralganIdish.userData?.kalit || "Idish"}ga quyish / qo'yish`
                    : `[E / Klik] ${fpsQaralganIdish.userData?.kalit || "Idish"}ni qo'lga olish`}
                </div>
              )}

              {yurishRejimi && fpsQolIdish && !fpsQaralganIdish && (
                <div className="mt-3 px-3 py-1 rounded-xl bg-black/80 border border-emerald-400 text-emerald-300 text-[11px] font-mono font-bold backdrop-blur-md shadow-2xl">
                  [E / G] {fpsQolIdish.userData?.kalit || "Idish"}ni stolga qo{"'"}yish
                </div>
              )}
            </div>
          )}

          {/* MOBIL PUBG USLUBIDAGI DUAL SENSORLI ANALOG JOYSTIK VA FPS TUGMALARI */}
          {yurishRejimi && (
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
          )}

          {/* 1-BOSQICH: 3D Interaktiv Ko'rsatma / Status */}
          <div
            className="pointer-events-none absolute left-4 top-14 sm:top-4 z-20 rounded-xl border px-3 py-1.5 text-xs backdrop-blur-md bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] space-y-0.5"
          >
            <div className="font-bold text-[var(--v3-matn)] flex items-center gap-1.5">
              <Ikon nom="kolba" olcham={14} className="text-[var(--v3-urgu)]" />
              <span>
                {kotarilganIdish
                  ? `${kotarilganIdish.userData?.kalit || "Idish"} ko'tarildi (Y=1.15m)`
                  : faolReagent
                  ? `${faolReagent} tanlandi`
                  : "Idishni bosing yoki sudrang"}
              </span>
            </div>
            {yaqinNishon && (
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <span>{nishonTuri === "tarozi" ? "⚖️ Tarozi pallasiga tortilmoqda" : nishonTuri === "spirtovka" ? "🔥 Spirtovkaga qo'yilmoqda" : nishonTuri === "byuretka" ? "🧪 Byuretka tagiga qo'yilmoqda" : "🎯 Nishon: " + (yaqinNishon.userData?.kalit || "Idish")}</span>
              </div>
            )}
          </div>

          {/* 1-BOSQICH: ERKIN KO'TARISH VA QUYISH BOSHQARUVI (FLOATING HUD) */}
          {(kotarilganIdish || faolReagent) && nishonIdishGroup && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-md rounded-2xl border p-4 shadow-2xl backdrop-blur-xl bg-[var(--v3-fon-2)]/95 border-[var(--v3-urgu)] space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--v3-urgu)]">
                    Direct Hands-on: Devor Shishasidan Probirkaga Quyish
                  </div>
                  <div className="text-xs font-bold text-[var(--v3-matn)] truncate flex items-center gap-1.5">
                    <span>{kotarilganIdish ? kotarilganIdish.userData?.kalit : faolReagent}</span>
                    {faolShishaMesh?.userData?.joriyHajm !== undefined && (
                      <span className="text-[10px] font-mono text-[var(--v3-xira)]">
                        ({Math.round(faolShishaMesh.userData.joriyHajm)}/{faolShishaMesh.userData.sigim || 500}ml)
                      </span>
                    )}
                    <span>➔</span>
                    <span className="text-emerald-400">{nishonIdishGroup.userData?.kalit || "Probirka"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {quyishTezligiMl > 0 && (
                    <span className="v3-tag v3-tag-ochiq font-mono font-bold">
                      {quyishTezligiMl} ml/s
                    </span>
                  )}
                  {kotarilganIdish ? (
                    <button
                      type="button"
                      onClick={() => idishniJoyigaQoy()}
                      className="v3-tugma text-[11px] py-1 px-2.5"
                    >
                      Stolga qo{"'"}yish
                    </button>
                  ) : faolReagent ? (
                    <button
                      type="button"
                      onClick={() => {
                        javongaQaytar();
                        setFaolReagent(null);
                      }}
                      className="v3-tugma text-[11px] py-1 px-2.5 text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                      title="Shishaning tiqinini yopib, o'z devor javonidagi joyiga qaytarish"
                    >
                      🚪 Javonga qaytarish
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Tezkor millilitr quyish tugmalari (Quick Volumetric Dosage) */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-[var(--v3-xira)]">Aniq hajm quyish (ml):</div>
                <div className="grid grid-cols-5 gap-1.5 text-center font-mono">
                  {[
                    { ml: 1, label: "+1 ml" },
                    { ml: 5, label: "+5 ml" },
                    { ml: 10, label: "+10 ml" },
                    { ml: 25, label: "+25 ml" },
                    { ml: 50, label: "+50 ml" },
                  ].map(({ ml, label }) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => {
                        aniqHajmQuy(faolReagent || "H₂O", nishonIdishGroup, ml);
                      }}
                      className="py-1 rounded-lg text-[10px] font-bold border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] hover:border-[var(--v3-urgu)] hover:text-[var(--v3-urgu)] transition-all"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Egish Burchagi Slideri */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-[var(--v3-xira)]">
                  <span>Uzluksiz egish burchagi:</span>
                  <strong className="text-[var(--v3-matn)]">{egishBurchagi}°</strong>
                </div>

                <input
                  type="range"
                  min="0"
                  max="80"
                  value={egishBurchagi}
                  onChange={(e) => {
                    const b = parseInt(e.target.value) || 0;
                    burchakniOrnat(b);
                    if (b > 18 && !quyilmoqda) {
                      quyishBoshla(faolReagent, nishonIdishGroup, kotarilganIdish, b);
                    } else if (b <= 18 && quyilmoqda) {
                      quyishToxtat();
                    }
                  }}
                  className="w-full accent-[var(--v3-urgu)] cursor-pointer"
                />
              </div>

              {/* Tezkor burchak bosqichlari */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { b: 0, nom: "Tekis (0°)" },
                  { b: 24, nom: "Tomchi (24°)" },
                  { b: 48, nom: "O'rtacha (48°)" },
                  { b: 76, nom: "Tez (76°)" },
                ].map(({ b, nom }) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      burchakniOrnat(b);
                      if (b > 18) {
                        quyishBoshla(faolReagent, nishonIdishGroup, kotarilganIdish, b);
                      } else {
                        quyishToxtat();
                      }
                    }}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      egishBurchagi === b
                        ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]"
                        : "bg-[var(--v3-yuza)] text-[var(--v3-xira)] border-[var(--v3-chiziq)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    {nom}
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* O'ng panel: Natija va Jurnal */}
        <NatijaPaneli
          natija={natija}
          tanlov={tanlov}
          xato={xato}
          hisobot={hisobotMatni}
          nisbatBahosi={nisbatBahosi}
          kinetika={kinetika}
          onYop={() => {
            setNatija(null);
            setTanlov(null);
            setXato(null);
          }}
          onTanlovTanla={(reactionId) => otkaz(reactionId, nishonIdishGroup)}
          onQaytaUrin={() => {
            setXato(null);
            otkaz(null, nishonIdishGroup);
          }}
          onMolekulaZoom={(kalit) => setMolekulaModalKalit(kalit || "H₂O")}
          onXRayOch={() => setXrayModalOchilgan(true)}
          onEkspertTahlil={() => setEkspertModalOchilgan(true)}
          onPdfYukla={async () => {
            const res = await labDaftariPdfYukla({
              foydalanuvchiNom: labMaLumot?.foydalanuvchi?.ism || "Talaba",
              tenglama: natija?.reaksiya?.equation,
              observations: natija?.reaksiya?.observations,
              nisbat: nisbatBahosi,
              kinetika,
              jurnal: jurnalRef?.current?.yozuvlar,
            });
            if (res && !res.ochildi && res.sabab !== "server") {
              setXato(res.sabab);
            }
          }}
        />
      </div>

      {/* --- PASTKI BOSHQARUV PANELI (TOZA EKRAN BO'LMAGANDA) --- */}
      {!tozaEkran && !yurishRejimi && (
        <footer
          className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 backdrop-blur-md bg-[var(--v3-fon-2)]/95 border-[var(--v3-chiziq)]"
        >
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="v3-nishon">
                Joriy idish: {nishonIdishGroup?.userData?.kalit || "Probirka"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold font-mono text-[var(--v3-urgu)]">
                  {jamiMl.toFixed(1)} ml
                </span>
                <span className="text-xs text-[var(--v3-xira)] font-mono">({quyilganKalitlar.length} xil modda)</span>
              </div>
            </div>

            <div className="hidden flex-wrap gap-1 sm:flex">
              {quyilganKalitlar.map((kalit) => {
                const ml = quyilganModdalar[kalit]?.ml || 0;
                const birlik = reagentBirligi(kalit);
                const rang = hexDanCss(moddaKorinishi(kalit).rang);
                return (
                  <span
                    key={kalit}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs bg-[var(--v3-yuza)] border-[var(--v3-chiziq)]"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: rang }} />
                    {kalit}{" "}
                    <strong className="text-[var(--v3-urgu)] font-mono">
                      {miqdorniFormatla(hajmniBirlikka(ml, birlik), birlik)}
                    </strong>
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tezkor suv quyish */}
            <button
              type="button"
              disabled={!nishonIdishGroup}
              onClick={() => aniqHajmQuy("H₂O", nishonIdishGroup, 10)}
              className="v3-tugma text-xs font-bold text-sky-400 border-sky-500/30 hover:bg-sky-500/10"
              title="Idishga 10 ml distillangan suv quyish"
            >
              💧 +10ml H₂O
            </button>

            {/* Harorat va Spirtovka Boshqaruvi */}
            <div className="flex items-center gap-1.5 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] px-2 py-1">
              <button
                type="button"
                onClick={() => {
                  const yangiRejim = !isitimoda;
                  setIsitimoda(yangiRejim);
                  if (yangiRejim && harorat === 25) setHarorat(80);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isitimoda
                    ? "bg-amber-500 text-black border border-amber-400 shadow-md animate-pulse"
                    : "text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                }`}
                title="Spirtovka alangasini yoqish/o'chirish"
              >
                🔥 {isitimoda ? `Alanga: ${harorat}°C` : "Spirtovka"}
              </button>

              <div className="hidden sm:flex items-center gap-1 font-mono text-[10px]">
                {[25, 60, 100, 200].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setHarorat(t);
                      setIsitimoda(t > 25);
                      if (holatRef.current) holatRef.current.harorat = t;
                      const spirtovkaMesh = sahnaRef?.current?.children.find((c) => c.userData?.kalit === "spirtovka");
                      const termometrMesh = sahnaRef?.current?.children.find((c) => c.userData?.kalit === "termometr");
                      if (spirtovkaMesh?.userData?.alanganiYangila) spirtovkaMesh.userData.alanganiYangila(t > 25);
                      if (termometrMesh?.userData?.haroratniYangila) termometrMesh.userData.haroratniYangila(t);
                      if (nishonIdishGroup) qaynashniYangila(nishonIdishGroup, t);
                    }}
                    className={`px-1.5 py-0.5 rounded border transition-all ${
                      harorat === t
                        ? "bg-amber-500 text-black font-bold border-amber-400"
                        : "border-[var(--v3-chiziq)] text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
                    }`}
                  >
                    {t}°C
                  </button>
                ))}
              </div>
            </div>

            {/* Reaksiyani tekshirish */}
            <button
              type="button"
              disabled={jamiMl <= 0 || otkazilmoqda}
              onClick={() => otkaz(null, nishonIdishGroup)}
              className="v3-tugma v3-tugma-asosiy text-xs font-bold disabled:opacity-40"
            >
              <Ikon nom="atom" olcham={14} />
              <span>{otkazilmoqda ? "O'tkazilmoqda..." : "Tajriba o'tkazish"}</span>
            </button>

            {/* Tozalash */}
            <button
              type="button"
              disabled={jamiMl <= 0 && !natija && !xato}
              onClick={handleTozalash}
              className="v3-tugma text-xs text-red-400 hover:border-red-500/30"
            >
              <Ikon nom="ochir" olcham={14} />
              Tozalash
            </button>
          </div>
        </footer>
      )}

      {/* MODALLAR */}
      {molekulaModalKalit && (
        <MolekulaZoomModal
          kalit={molekulaModalKalit}
          onYop={() => setMolekulaModalKalit(null)}
        />
      )}

      {phMeterOchilgan && (
        <PHMeterUI
          moddalar={quyilganModdalar}
          onYop={() => setPhMeterOchilgan(false)}
        />
      )}

      {taroziOchilgan && (
        <TaroziUI
          idishKaliti={tarozidagiIdish?.userData?.kalit || null}
          moddalar={tarozidagiIdish ? (quyilganModdalar || {}) : {}}
          taraMassa={taraMassa}
          onTara={handleTaroziTara}
          onNolgaQaytar={handleTaroziNol}
          onYop={() => setTaroziOchilgan(false)}
          onEritmaOch={() => {
            setTaroziOchilgan(false);
            setEritmaOchilgan(true);
          }}
        />
      )}

      {/* 2-BOSQICH: ERITMA TAYYORLASH STENDI */}
      {eritmaOchilgan && (
        <EritmaTayyorlashModal
          onEritmaTayyorlandi={handleEritmaTayyorlandi}
          onYop={() => setEritmaOchilgan(false)}
        />
      )}

      {/* 1-QADAM: VOLUMETRIK TITRLASH VA BYURETKA STENDI */}
      {titrlashOchilgan && (
        <TitrlashStendiUI
          onYop={() => setTitrlashOchilgan(false)}
        />
      )}

      {/* 2-QADAM: ELEKTROLIZ VA TOK MANBAI STENDI */}
      {elektrolizOchilgan && (
        <ElektrolizStendiUI
          onYop={() => setElektrolizOchilgan(false)}
        />
      )}

      {/* 5-BOSQICH: ILMIY EKSPERT XULOSASI MODALI */}
      {ekspertModalOchilgan && natija && (
        <EkspertXulosaModal
          natija={natija}
          nisbat={nisbatBahosi}
          kinetika={kinetika}
          jurnal={jurnalRef?.current?.yozuvlar}
          foydalanuvchiNom={labMaLumot?.foydalanuvchi?.ism || "Talaba"}
          onYop={() => setEkspertModalOchilgan(false)}
        />
      )}

      {sandiqOchilgan && (
        <SandiqOchishModal
          onYop={() => setSandiqOchilgan(false)}
          onOchildi={() => yuklaLab()}
        />
      )}

      {sifatAnalizOchilgan && (
        <SifatAnalizPaneli
          onYop={() => setSifatAnalizOchilgan(false)}
          onTopshiriqBoshla={() => setSifatAnalizOchilgan(false)}
        />
      )}

      {portlashMaLumot && (
        <XavfsizlikModal
          malumot={portlashMaLumot}
          onYop={() => setPortlashMaLumot(null)}
        />
      )}

      {kristallPanjaraOchilgan && (
        <KristallPanjaraModal
          onYop={() => setKristallPanjaraOchilgan(false)}
        />
      )}

      {davriyJadvalOchilgan && (
        <DavriyJadvalModal
          onYop={() => setDavriyJadvalOchilgan(false)}
        />
      )}

      {amaliyotOchilgan && (
        <AmaliyMashgulotModal
          onYop={() => setAmaliyotOchilgan(false)}
          onMashgulotBoshlandi={(m) => {
            if (m.reagentlar && m.reagentlar[0]) {
              setFaolReagent(m.reagentlar[0]);
            }
          }}
        />
      )}

      {/* 3-BOSQICH: MORTAL KOMBAT X-RAY SLOW-MOTION BOG'LAR UZILISHI MODALI */}
      {xrayModalOchilgan && (
        <XRayMolekulaModal
          reaksiyaTenglamasi={natija?.reaksiya?.equation || "HCl + NaOH"}
          onYop={() => setXrayModalOchilgan(false)}
        />
      )}
    </div>
  );
}
