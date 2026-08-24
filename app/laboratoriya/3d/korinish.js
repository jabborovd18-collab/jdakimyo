"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Ikon from "@/components/Ikon";
import { useSahna } from "./hooks/useSahna.js";
import { SUKUT_FON } from "./lib/fonlar.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import { useYurish } from "./hooks/useYurish.js";
import { useXavfsizlik } from "./hooks/useXavfsizlik.js";
import { useTitrlash } from "./hooks/useTitrlash.js";
import { useElektroliz } from "./hooks/useElektroliz.js";
import { useTarozi } from "./hooks/useTarozi.js";
import { useJihozAmallari } from "./hooks/useJihozAmallari.js";
import { useSpatula } from "./hooks/useSpatula.js";
import { useIsitish } from "./hooks/useIsitish.js";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import MolekulaZoomModal from "./components/MolekulaZoomModal.jsx";
import TaroziUI from "./components/TaroziUI.jsx";
import TitrlashStendiUI from "./components/TitrlashStendiUI.jsx";
import ElektrolizStendiUI from "./components/ElektrolizStendiUI.jsx";
import EkspertXulosaModal from "./components/EkspertXulosaModal.jsx";
import AmaliyMashgulotModal from "./components/AmaliyMashgulotModal.jsx";
import DavriyJadvalModal from "./components/DavriyJadvalModal.jsx";
import XRayMolekulaModal from "./components/XRayMolekulaModal.jsx";
import VirtualJoystick from "./components/VirtualJoystick.jsx";
import YordamModali from "./components/YordamModali.jsx";
import QolKartasi from "./components/QolKartasi.jsx";
import LabHud from "./components/LabHud.jsx";
import LabModallari from "./components/LabModallari.jsx";
import { portlashniAniqla } from "./lib/portlash.js";
import { labDaftariPdfYukla } from "./lib/pdf-hisobot.js";
import { pufakchaChiqishi, oqimBoshla, oqimToxtat, taroziBip, shishaUrilishi, tiqinOchilishi } from "./lib/ovoz.js";
import { massaHisobla } from "./lib/tarozi.js";
import { amalQoshi, jurnaldanAmallar } from "./lib/mashgulot-kuzatuvi.js";
import { INDIKATORLAR } from "./lib/javon-3d.js";
import {
  KIRISH,
  KLAVIATURA_AMALLARI,
  ishoralarniOl,
  muqobilsizAmallar,
  useKirishUsuli,
} from "./lib/kirish-usuli.js";
import { eritmaHisobla } from "./lib/eritma-tayyorlash.js";
import { titrlashHolatiniHisobla } from "./lib/titrlash-dvigatel.js";
import { elektrolizHisobla } from "./lib/elektroliz-dvigatel.js";
import { tozala, jamiHajm, idishHolatiniOl, idishHolatiniYoz } from "./lib/idish-holati.js";
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
  const [suvOqmoqda, setSuvOqmoqda] = useState(false);

  // Isitish, avtomatik reaksiya va aniq doza qaysi idishga ishlaydi — shu idish.
  // Ilgari `nishonIdishGroup = hammaJihozlar[0]` edi: foydalanuvchi boshqa
  // idishga quysa ham, spirtovka doim birinchi qo'yilgan idishni qizdirardi.
  // Endi bu holat FPS rejimida ko'rsatkich turgan idishga (fpsQaralganIdish)
  // bog'lanadi — `faolIdish` shu idishni saqlaydi.
  const [faolIdish, setFaolIdish] = useState(null);

  // Modallar va Stansiyalar (Faqat 3D olam orqali ochiladi)
  const [molekulaModalKalit, setMolekulaModalKalit] = useState(null);
  const [davriyJadvalOchilgan, setDavriyJadvalOchilgan] = useState(false);
  const [titrlashOchilgan, setTitrlashOchilgan] = useState(false);
  const [elektrolizOchilgan, setElektrolizOchilgan] = useState(false);
  const [ekspertModalOchilgan, setEkspertModalOchilgan] = useState(false);

  const [xrayModalOchilgan, setXrayModalOchilgan] = useState(false);
  const [yordamOchilgan, setYordamOchilgan] = useState(false);
  const [mashgulotOchilgan, setMashgulotOchilgan] = useState(false);

  // Bajarilgan amallar ro'yxati — amaliy mashg'ulot qadamlari shundan
  // belgilanadi. Ilgari qadamlar QO'LDA bosib belgilanardi: o'quvchi
  // hech narsa qilmasdan hammasini "bajarildi" deb ura olardi.
  //
  // Bu XAVFSIZLIK emas, ANIQLIK: ball, XP va tanga baribir serverda
  // hisoblanadi (AGENTS.md 2-band).
  const [amallar, setAmallar] = useState([]);
  const amalYoz = useCallback((amal) => {
    setAmallar((oldingi) => amalQoshi(oldingi, amal));
  }, []);

  // "Hisob" qadami — ekspert tahlili ochilganda belgilanadi.
  //
  // Modal IKKI joydan ochiladi (planshet stansiyasi va natija paneli),
  // shuning uchun amal har chaqiruv joyida emas, HOLAT o'zgarishida
  // yoziladi. Kelajakda uchinchi joy qo'shilsa ham avtomatik qamraladi.
  //
  // E'lon `amalYoz` DAN KEYIN turishi shart — bog'liqlik ro'yxati o'sha
  // zahoti hisoblanadi (shu faylda bir marta shundan build yiqilgan).
  useEffect(() => {
    if (ekspertModalOchilgan) amalYoz({ turi: "amal", kalit: "hisob" });
  }, [ekspertModalOchilgan, amalYoz]);

  // "Faradey" qadami — elektroliz paneli ochilganda. U yerda Faradey
  // qonuni bo'yicha hisob ko'rsatiladi.
  useEffect(() => {
    if (elektrolizOchilgan) amalYoz({ turi: "amal", kalit: "faradey" });
  }, [elektrolizOchilgan, amalYoz]);
  // Kirish usuli — HUD tugmalari va qo'llanma matni shunga moslanadi.
  const kirishUsuli = useKirishUsuli();
  const ISH = ishoralarniOl(kirishUsuli);
  const sensorli = kirishUsuli === KIRISH.SENSOR;
  const [ovozYoqilgan, setOvozYoqilgan] = useState(true);

  // 2. Reflar
  // Idish holati global ref da EMAS — har bir idish o'z holatini
  // `group.userData.holat` da saqlaydi (qarang idish-holati.js). Shuning
  // uchun probirka bilan stakanning tarkibi aralashmaydi.
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
    yorliqlarYoqilgan,
    yorliqlarniAlmashtir,
  } = useSahna(konteynerRef, yuklanmoqda);

  // Tarozi holati
  const {
    tarozidagiIdish,
    taraMassa,
    handleTaroziTushdi,
    handleTarozidanOlingan,
    handleTaroziTara,
    handleTaroziNol,
  } = useTarozi({ sahnaRef, amalYoz });

  // 4. Tarozi va Spirtovka Callbacklari
  // Quyish tugagach chaqiriladi: `group` — tarkibi o'zgargan idish, `holat`
  // esa uning yangi holati. Tarozida shu idish tursa, LED ekran yangilanadi.
  const {
    handleHolatOzgardimi,
    handleIdishTanlandi,
    handleSpirtovkaBosildi,
    handleSpirtovkagaQoyildi,
    handleRakovinaKraniBosildi,
    handleRakovinagaTushdi,
  } = useJihozAmallari({ sahnaRef, amalYoz, tarozidagiIdish, taraMassa });

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
    jurnalRef,
    onOzgarish: handleHolatOzgardimi,
  });


  // Isitish, reaksiya va aniq doza uchun "faol" idish. Birinchi navbatda
  // foydalanuvchi qarayotgan idish (faolIdish), u bo'lmasa stoldagi birinchi.
  const nishonIdishGroup = faolIdish || hammaJihozlar[0] || null;

  const { isitimoda, setIsitimoda, harorat, setHarorat } =
    useIsitish({ sahnaRef, nishonIdishGroup });

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
    jurnalRef,
    holatniYangila: yuklaLab,
  });

  const handlePlanshetBosildi = useCallback(() => {
    setEkspertModalOchilgan(true);
  }, []);

  const { spatulaKukun, setSpatulaKukun, handleSpatulaAmal } =
    useSpatula({ sahnaRef, amalYoz, tarozidagiIdish, taraMassa });

  // 6-BOSQICH: Xavfsizlik Dushi, Ko'z Yuvish va HazMat jihozlari
  const {
    dushOqmoqda,
    kozYuvishOqmoqda,
    kozoynakTaqilgan,
    gazNiqobiTaqilgan,
    handleXavfsizlikDushi,
    handleKozYuvish,
    handleKozoynakTaqish,
    handleGazNiqobiTaqish,
  } = useXavfsizlik({ sahnaRef, amalYoz });

  const { titrlashTomchilamoqda, titrlashHajmi, handleTitrlashKran } =
    useTitrlash({ sahnaRef, amalYoz });

  const { elektrolizFaol, elektrolizVaqt, handleElektrolizTok } =
    useElektroliz({ sahnaRef, amalYoz });

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

  const [xonaTutun, setXonaTutun] = useState(false);

  const handleAralashtirish = useCallback((targetGroup) => {
    pufakchaChiqishi();
    amalYoz({ turi: "amal", kalit: "aralashtirish" });
    toast.success("🌀 Shisha tayoqcha bilan aralashtirildi! Reaksiya kinetikasi tezlashdi.");
    otkaz(null, targetGroup);
  }, [otkaz, amalYoz]);

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
    qarashRejimi,
    qarashXabari,
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

  // FPS rejimida foydalanuvchi qarayotgan idishni "faol idish" deb belgilaymiz.
  // Ko'rsatkich hech narsaga tegmagan paytlarda fpsQaralganIdish null bo'ladi —
  // unda avvalgi faol idish saqlanib qoladi (isitish to'xtamaydi).
  useEffect(() => {
    if (fpsQaralganIdish) setFaolIdish(fpsQaralganIdish);
  }, [fpsQaralganIdish]);

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

  // Spirtovkada isitish va sovish sikli — faol (isitilayotgan) idishning

  // Smart Planshet / Monitor ekranini yangilash
  useEffect(() => {
    const planshetMesh = sahnaRef?.current?.getObjectByName("Lab_Plansheti");
    if (planshetMesh?.userData?.ekranniYangila) {
      planshetMesh.userData.ekranniYangila(natija?.reaksiya || null, harorat, kinetika);
    }
  }, [natija, harorat, kinetika, sahnaRef]);

  // Moddalar aralashganda avtomatik reaksiya hisoblash — faol idishning
  // o'z holatiga asoslanadi.
  useEffect(() => {
    if (!nishonIdishGroup) return;
    const moddalar = idishHolatiniOl(nishonIdishGroup, nishonIdishGroup.userData?.kalit)?.moddalar || {};
    const moddaKalitlar = Object.keys(moddalar);

    if (moddaKalitlar.length >= 2 && !otkazilmoqda && !natija) {
      otkaz(null, nishonIdishGroup);
    }
  }, [aralashmaOzgarish, otkazilmoqda, natija, otkaz, nishonIdishGroup]);

  useEffect(() => {
    yuklaLab();
  }, [yuklaLab]);

  // Qo'ldagi (yoki faol) idishning tarkibi HUD'da ko'rsatiladi — global holat
  // emas, o'sha idishning o'z holati.
  const hudIdishGroup = fpsQolIdish || faolIdish || null;
  const hudHolat = hudIdishGroup ? idishHolatiniOl(hudIdishGroup, hudIdishGroup.userData?.kalit) : null;
  const quyilganModdalar = hudHolat?.moddalar || {};
  const quyilganKalitlar = Object.keys(quyilganModdalar);
  const jamiMl = jamiHajm(hudHolat || { moddalar: {} });

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
      data-fon={SUKUT_FON}
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

        <LabHud
          ISH={ISH}
          harorat={harorat}
          tarozidagiIdish={tarozidagiIdish}
          kozoynakTaqilgan={kozoynakTaqilgan}
          gazNiqobiTaqilgan={gazNiqobiTaqilgan}
          sezgirlik={sezgirlik}
          sezgirlikniOzgartir={sezgirlikniOzgartir}
          yorliqlarYoqilgan={yorliqlarYoqilgan}
          yorliqlarniAlmashtir={yorliqlarniAlmashtir}
          ovozYoqilgan={ovozYoqilgan}
          setOvozYoqilgan={setOvozYoqilgan}
          setMashgulotOchilgan={setMashgulotOchilgan}
          setYordamOchilgan={setYordamOchilgan}
          fpsKontekstMatn={fpsKontekstMatn}
          fpsKontekstTuri={fpsKontekstTuri}
          qarashRejimi={qarashRejimi}
          qarashXabari={qarashXabari}
        />

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
          // Aniq doza — klaviaturadagi 1..5 bilan AYNI yo'ldan ketadi
          // (`aniqHajmQuy`), shuning uchun server tekshiruvi va
          // stexiometriya ikkalasida ham bir xil ishlaydi.
          onAniqDoza={(ml) => {
            if (fpsQolIdish && fpsQaralganIdish) {
              aniqHajmQuy(fpsQolIdish.userData?.kalit, fpsQaralganIdish, ml);
            }
          }}
        />

        {/* --- O'NG PASTKI BURCHAK: QO'LDAGI IDISH HUD KARTASI --- */}
        <QolKartasi
          fpsQolIdish={fpsQolIdish}
          nishonIdishGroup={nishonIdishGroup}
          spatulaKukun={spatulaKukun}
          quyilganModdalar={quyilganModdalar}
          quyilganKalitlar={quyilganKalitlar}
          jamiMl={jamiMl}
          aniqHajmQuy={aniqHajmQuy}
          javongaQaytar={javongaQaytar}
          qolgaOlYokiQoy={qolgaOlYokiQoy}
          setFpsQolIdish={setFpsQolIdish}
        />
      </main>

      {/* --- MODALLAR (FAQAT 3D OB'EKTGA YAQINLASHIB BOSILGANDA) --- */}
      <LabModallari
        davriyJadvalOchilgan={davriyJadvalOchilgan}
        setDavriyJadvalOchilgan={setDavriyJadvalOchilgan}
        titrlashOchilgan={titrlashOchilgan}
        setTitrlashOchilgan={setTitrlashOchilgan}
        elektrolizOchilgan={elektrolizOchilgan}
        setElektrolizOchilgan={setElektrolizOchilgan}
        ekspertModalOchilgan={ekspertModalOchilgan}
        setEkspertModalOchilgan={setEkspertModalOchilgan}
        xrayModalOchilgan={xrayModalOchilgan}
        setXrayModalOchilgan={setXrayModalOchilgan}
        molekulaModalKalit={molekulaModalKalit}
        setMolekulaModalKalit={setMolekulaModalKalit}
        mashgulotOchilgan={mashgulotOchilgan}
        setMashgulotOchilgan={setMashgulotOchilgan}
        natija={natija}
        nisbatBahosi={nisbatBahosi}
        kinetika={kinetika}
        labMaLumot={labMaLumot}
        jurnalRef={jurnalRef}
        amallar={amallar}
      />

      {yordamOchilgan && (
        <YordamModali
          sensorli={sensorli}
          yop={() => setYordamOchilgan(false)}
        />
      )}
    </div>
  );
}
