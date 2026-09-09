"use client";

// app/laboratoriya/3d/korinish.js
//
// 3D laboratoriyaning BOSH komponenti: Canvas konteyneri, hooklar
// orasidagi bog'lam va modallarni chaqirish. Boshqa hamma narsa
// mazmun bo'yicha ajratilgan (BRIF-05, 2-bosqich):
//
//   components/LabHUD.jsx          sahna ustidagi HUD qatlami
//   components/YordamModal.jsx     [H] boshqaruv qo'llanmasi
//   hooks/useTermalBoshqaruv.js    spirtovka, harorat, termik trigger
//   hooks/useStansiyaAmallari.js   tarozi, rakovina, xavfsizlik,
//                                  titrlash, elektroliz, spatula
//   lib/kamera-dolly.js            kameraDollyZoom (kinematik zamin)
//
// Xatti-harakat o'zgarmadi — kod aynan ko'chirildi, faqat joyi
// o'zgardi. Har fayl <600 qator (AGENTS.md 11.7).

import { useState, useEffect, useRef, useCallback } from "react";
import Ikon from "@/components/Ikon";
import { useSahna } from "./hooks/useSahna.js";
import { SUKUT_FON } from "./lib/fonlar.js";
import { useQuyish } from "./hooks/useQuyish.js";
import { useTajriba } from "./hooks/useTajriba.js";
import { useYurish } from "./hooks/useYurish.js";
import { useTermalBoshqaruv } from "./hooks/useTermalBoshqaruv.js";
import { useStansiyaAmallari } from "./hooks/useStansiyaAmallari.js";
import MobilOgohlantirish from "./components/MobilOgohlantirish.jsx";
import MolekulaZoomModal from "./components/MolekulaZoomModal.jsx";
import TitrlashStendiUI from "./components/TitrlashStendiUI.jsx";
import ElektrolizStendiUI from "./components/ElektrolizStendiUI.jsx";
import EkspertXulosaModal from "./components/EkspertXulosaModal.jsx";
import AmaliyMashgulotModal from "./components/AmaliyMashgulotModal.jsx";
import DavriyJadvalModal from "./components/DavriyJadvalModal.jsx";
import XRayMolekulaModal from "./components/XRayMolekulaModal.jsx";
import LabHUD from "./components/LabHUD.jsx";
import YordamModal from "./components/YordamModal.jsx";
import { labDaftariPdfYukla } from "./lib/pdf-hisobot.js";
import { amalQoshi, jurnaldanAmallar } from "./lib/mashgulot-kuzatuvi.js";
import { INDIKATORLAR } from "./lib/javon-3d.js";
import { KIRISH, ishoralarniOl, useKirishUsuli } from "./lib/kirish-usuli.js";
import { jamiHajm, idishHolatiniOl } from "./lib/idish-holati.js";
import { jurnalYarat } from "./lib/jurnal.js";
import { kameraDollyZoom, kinoRejim } from "./lib/kamera-dolly.js";
import { vaqtniSekinlashtir, vaqtniTikla } from "./lib/vaqt-oqimi.js";
import { laboratoriyaFonOvoziniYarat, laboratoriyaFonOvoziniToxtat, shishaUrilishi } from "./lib/ovoz.js";
import * as THREE from "three";
import toast from "react-hot-toast";

export default function Korinish() {
  // 1. Asosiy holatlar (States)
  const [mounted, setMounted] = useState(false);
  const [labMaLumot, setLabMaLumot] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(true);
  const [kirilmagan, setKirilmagan] = useState(false);
  const [yuklashXatosi, setYuklashXatosi] = useState(false);

  const [faolReagent, setFaolReagent] = useState(null);
  const [aralashmaOzgarish, setAralashmaOzgarish] = useState(0);

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
    hammaJihozlar,
    yorliqlarYoqilgan,
    yorliqlarniAlmashtir,
  } = useSahna(konteynerRef, yuklanmoqda);

  // 4. Server bilan yuklash
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

  // 5. Tajriba O'tkazish Hooki
  const {
    otkaz,
    otkazilmoqda,
    natija,
    nisbatBahosi,
    kinetika,
    setNatija,
  } = useTajriba({
    sahnaRef,
    jurnalRef,
    holatniYangila: yuklaLab,
  });

  // Isitish, reaksiya va aniq doza uchun "faol" idish. Birinchi navbatda
  // foydalanuvchi qarayotgan idish (faolIdish), u bo'lmasa stoldagi birinchi.
  const nishonIdishGroup = faolIdish || hammaJihozlar[0] || null;

  // 6. Stansiya amallari (tarozi, rakovina, xavfsizlik, titrlash,
  // elektroliz, spatula) — hooks/useStansiyaAmallari.js
  const {
    tarozidagiIdish,
    taraMassa,
    spatulaKukun,
    kozoynakTaqilgan,
    gazNiqobiTaqilgan,
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
  } = useStansiyaAmallari({
    sahnaRef,
    jurnalRef,
    amalYoz,
    otkaz,
    nishonIdishGroup,
    setAralashmaOzgarish,
  });

  // 7. Quyish Hooki
  const {
    quyishBoshla,
    quyishToxtat,
    javongaQaytar,
    aniqHajmQuy,
  } = useQuyish({
    sahnaRef,
    jurnalRef,
    onOzgarish: handleHolatOzgardimi,
  });

  // 8. Termal boshqaruv (spirtovka, harorat, 80°C termik trigger) —
  // hooks/useTermalBoshqaruv.js
  const {
    isitimoda,
    harorat,
    handleSpirtovkaBosildi,
    handleSpirtovkagaQoyildi,
  } = useTermalBoshqaruv({
    sahnaRef,
    nishonIdishGroup,
    otkazilmoqda,
    otkaz,
    setNatija,
    amalYoz,
  });

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

  // Stenddan yangi toza jihoz qo'shish
  const handleStenddanJihozOlish = useCallback((kalit) => {
    if (!sahnaRef?.current) return null;
    const yangi = jihozQosh(kalit || "probirka");
    if (yangi) {
      toast.success(`✨ Yangi toza ${kalit} stenddan olindi`);
    }
    return yangi;
  }, [sahnaRef, jihozQosh]);

  const handlePlanshetBosildi = useCallback(() => {
    setEkspertModalOchilgan(true);
  }, []);

  const handleStansiyaOchildi = useCallback((stansiya) => {
    if (stansiya === "davriy_jadval") setDavriyJadvalOchilgan(true);
    else if (stansiya === "titrlash") setTitrlashOchilgan(true);
    else if (stansiya === "elektroliz") setElektrolizOchilgan(true);
    else if (stansiya === "lab_planshet") setEkspertModalOchilgan(true);
  }, []);

  // JONLI X-RAY SHO'NG'ISHI ("Mortal Kombat" uslubi).
  //
  // X-Ray chaqirilganda modal DARHOL ochilmaydi: avval kamera idish
  // markaziga dolly-zoom bilan sho'ng'iydi (kamera-dolly.js), fon
  // rentgen spektriga qorayadi (overlay), sahna vaqti sekinlashadi
  // (vaqt-oqimi.js) — keyin molekula modali ochiladi. Modal yopilganda
  // hammasi teskari tartibda tiklanadi.
  //
  // Idish yo'q bo'lsa kamera oldidagi 1 m nuqtaga sho'ng'iydi — effekt
  // baribir ishlaydi (X-Ray har doim reaksiya natijasidan ochiladi,
  // lekin himoya shart arzon).
  const [xrayQoraymoqda, setXrayQoraymoqda] = useState(false);
  const xrayQaytarRef = useRef(null);

  const xraygaShongi = useCallback(async () => {
    const kamera = kameraRef?.current;
    if (!kamera || xrayQaytarRef.current) {
      // Kamera yo'q yoki sho'ng'ish allaqachon faol — eski yo'l.
      setXrayModalOchilgan(true);
      return;
    }

    // Nishon: faol idishning dunyo koordinatasi (suyuqlik sathi
    // balandligida — idish "yuragi"), bo'lmasa kamera oldidagi nuqta.
    let nishon;
    if (nishonIdishGroup) {
      nishon = new THREE.Vector3();
      nishonIdishGroup.getWorldPosition(nishon);
      nishon.y += 0.06;
    } else {
      nishon = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(kamera.quaternion)
        .add(kamera.position);
    }

    kinoRejim.faol = true;
    setXrayQoraymoqda(true);
    vaqtniSekinlashtir(0.22);
    shishaUrilishi(1400);

    const natijaDolly = await kameraDollyZoom(kamera, nishon, 2.6, { davomiylikMs: 1100 });
    if (natijaDolly && natijaDolly.qaytar) {
      xrayQaytarRef.current = natijaDolly.qaytar;
    }
    setXrayModalOchilgan(true);
  }, [kameraRef, nishonIdishGroup]);

  const xraydanQayt = useCallback(async () => {
    setXrayModalOchilgan(false);
    const qaytar = xrayQaytarRef.current;
    xrayQaytarRef.current = null;
    if (qaytar) {
      await qaytar();
    }
    vaqtniTikla();
    setXrayQoraymoqda(false);
    kinoRejim.faol = false;
  }, []);

  // 9. Xonada Erkin Yurish Hooki (FPS Direct Hands Engine)
  const {
    fpsQaralganIdish,
    fpsQolIdish,
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

  // ATMOSFERA FON OVOZI — birinchi bosishda sokin boshlanadi.
  //
  // Brauzer AudioContext ni foydalanuvchi ishorasisiz ochmaydi, shuning
  // uchun `pointerdown` kutiladi ({ once: true } — bir marta). Ovoz
  // o'chirilgan bo'lsa boshlamaymiz; keyin yoqilsa, navbatdagi bosish
  // boshlaydi (listener ovoz holati o'zgarganda qayta o'rnatiladi).
  useEffect(() => {
    if (!ovozYoqilgan) {
      laboratoriyaFonOvoziniToxtat();
      return undefined;
    }
    const boshla = () => laboratoriyaFonOvoziniYarat();
    window.addEventListener("pointerdown", boshla, { once: true });
    return () => window.removeEventListener("pointerdown", boshla);
  }, [ovozYoqilgan]);

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

  // Smart Planshet / Monitor ekranini yangilash
  useEffect(() => {
    const planshetMesh = sahnaRef?.current?.getObjectByName("Lab_Plansheti");
    if (planshetMesh?.userData?.ekranniYangila) {
      planshetMesh.userData.ekranniYangila(natija?.reaksiya || null, harorat, kinetika);
    }
  }, [natija, harorat, kinetika, sahnaRef]);

  // Moddalar aralashganda avtomatik reaksiya hisoblash — faol idishning
  // o'z holatiga asoslanadi.
  //
  // Har `aralashmaOzgarish` uchun KO'PI BILAN BITTA urinish (ref bilan).
  // Usiz reaksiya topilmaganda sikl aylanardi: `otkazilmoqda` true→false
  // bo'lishi effektni qayta uyg'otadi, shart yana o'tadi (natija null
  // qolgan) va server bir xil so'rov bilan qayta-qayta urilardi. Yangi
  // quyish `aralashmaOzgarish` ni oshiradi va urinish yana ochiladi.
  const oxirgiAralashmaUrinishRef = useRef(-1);
  useEffect(() => {
    if (!nishonIdishGroup) return;
    if (oxirgiAralashmaUrinishRef.current === aralashmaOzgarish) return;
    const moddalar = idishHolatiniOl(nishonIdishGroup, nishonIdishGroup.userData?.kalit)?.moddalar || {};
    const moddaKalitlar = Object.keys(moddalar);

    if (moddaKalitlar.length >= 2 && !otkazilmoqda && !natija) {
      oxirgiAralashmaUrinishRef.current = aralashmaOzgarish;
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

        {/* --- X-RAY RENTGEN SPEKTRI QORAYTIRISH QATLAMI --- */}
        {/* Dolly sho'ng'ish paytida fon qorayadi va sovuq rentgen-ko'k
            vignetka paydo bo'ladi. CSS transition — GPU kompozitor
            qatlamida, sahna render narxiga ta'sir qilmaydi. */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ${
            xrayQoraymoqda ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(2,6,23,0.55) 0%, rgba(1,4,16,0.9) 62%, rgba(0,0,0,0.98) 100%)",
            boxShadow: "inset 0 0 160px rgba(56,189,248,0.18)",
          }}
        />

        <LabHUD
          kozoynakTaqilgan={kozoynakTaqilgan}
          gazNiqobiTaqilgan={gazNiqobiTaqilgan}
          harorat={harorat}
          tarozidagiIdish={tarozidagiIdish}
          sezgirlik={sezgirlik}
          sezgirlikniOzgartir={sezgirlikniOzgartir}
          yorliqlarYoqilgan={yorliqlarYoqilgan}
          yorliqlarniAlmashtir={yorliqlarniAlmashtir}
          ovozYoqilgan={ovozYoqilgan}
          setOvozYoqilgan={setOvozYoqilgan}
          setMashgulotOchilgan={setMashgulotOchilgan}
          setYordamOchilgan={setYordamOchilgan}
          ISH={ISH}
          fpsKontekstMatn={fpsKontekstMatn}
          fpsKontekstTuri={fpsKontekstTuri}
          qarashXabari={qarashXabari}
          qarashRejimi={qarashRejimi}
          handleJoystickHarakat={handleJoystickHarakat}
          handleJoystickBurilish={handleJoystickBurilish}
          fpsQaralganIdish={fpsQaralganIdish}
          fpsQolIdish={fpsQolIdish}
          qolgaOlYokiQoy={qolgaOlYokiQoy}
          quyishBoshla={quyishBoshla}
          aniqHajmQuy={aniqHajmQuy}
          javongaQaytar={javongaQaytar}
          spatulaKukun={spatulaKukun}
          nishonIdishGroup={nishonIdishGroup}
          quyilganKalitlar={quyilganKalitlar}
          quyilganModdalar={quyilganModdalar}
          jamiMl={jamiMl}
        />
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
            xraygaShongi();
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
          onYop={xraydanQayt}
        />
      )}

      {molekulaModalKalit && (
        <MolekulaZoomModal
          kalit={molekulaModalKalit}
          onYop={() => setMolekulaModalKalit(null)}
        />
      )}

      {/* --- AMALIY MASHG'ULOT MODALI --- */}
      {mashgulotOchilgan && (
        <AmaliyMashgulotModal
          // Quyish amallari JURNALDAN keladi (u ikkala quyish yo'lini
          // ham yozadi), qolgan harakatlar esa `amallar` holatidan.
          // Ikkalasi birlashtiriladi — har biri o'z sohasida yagona
          // manba.
          amallar={[
            ...jurnaldanAmallar(jurnalRef?.current, INDIKATORLAR),
            ...amallar,
          ]}
          onYop={() => setMashgulotOchilgan(false)}
        />
      )}

      {/* --- [H] BOSHQARUV VA KLAVIATURA QO'LLANMASI MODALI --- */}
      {yordamOchilgan && (
        <YordamModal
          setYordamOchilgan={setYordamOchilgan}
          sensorli={sensorli}
          ISH={ISH}
        />
      )}
    </div>
  );
}
