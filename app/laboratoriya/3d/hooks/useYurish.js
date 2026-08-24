"use client";

import { useCallback, useEffect, useState } from "react";

import { idishYorliginiQoldaYangila } from "../lib/yorliqlar.js";
import { useKirishUsuli } from "../lib/kirish-usuli.js";
import { useYurishHolati } from "./useYurishHolati.js";
import { useNishonAmali } from "./useNishonAmali.js";
import { useKlaviatura } from "./useKlaviatura.js";
import { useQarashBoshqaruvi } from "./useQarashBoshqaruvi.js";
import { useYurishSikli } from "./useYurishSikli.js";

/**
 * CS 1.6 USLUBIDAGI 100% ERKIN SICHQONCHA, MOBIL JOYSTIK VA TUGMASIZ JISMONIY 3D OLAM DVIGATELI.
 *
 * BRIF-05 dan keyin bu fayl faqat HOLATNI ushlaydi va bo'laklarni
 * yig'adi. Ish o'zi beshta modulda:
 *   useYurishHolati       — 20 dan ortiq ref bitta joyda
 *   useNishonAmali        — E tugmasining 15 holati
 *   useKlaviatura         — harakat tugmalari va aniq dozalar
 *   useQarashBoshqaruvi   — pointer lock, sichqoncha, zaxira rejim
 *   useYurishSikli        — fizika, to'siq va crosshair raycasti
 *   lib/yurish-kolliziya  — sof geometriya (React yo'q)
 */
export function useYurish({
  tayyor = false,
  sahnaRef,
  kameraRef,
  rendererRef,
  controlsRef,
  onIdishTanlandi,
  onQuyishBoshla,
  onQuyishToxtat,
  onAniqHajmQuy,
  onTaroziTushdi,
  onTarozidanOlingan,
  onTaroziTara,
  onTaroziNol,
  onSpirtovkaBosildi,
  onSpirtovkagaQoyildi,
  onRakovinaKraniBosildi,
  onRakovinagaTushdi,
  onPlanshetBosildi,
  onStansiyaOchildi,
  onStenddanJihozOlish,
  onJavongaQaytar,
  onAralashtirish,
  onSpatulaAmal,
  onTitrlashKran,
  onElektrolizTok,
  onXavfsizlikDushi,
  onKozYuvish,
  onKozoynakTaqish,
  onGazNiqobiTaqish,
  isitimoda = false,
  tarozidagiIdish = null,
  taraMassa = 0,
}) {
  // Kirish usuli — nishon matnlarini moslash uchun. Ref ishlatiladi,
  // chunki matn rAF sikli ichida hosil bo'ladi va u React render
  // siklidan tashqarida.
  const kirishUsuli = useKirishUsuli();
  const holat = useYurishHolati();
  const {
    analogRef,
    avvalgiQolIdishRef,
    eyeHeightRef,
    fokusFaolRef,
    kirishUsuliRef,
    rotationRef,
    sezgirlikRef,
    targetEyeHeightRef,
    velocityRef,
    yawJamiRef,
  } = holat;
  kirishUsuliRef.current = kirishUsuli;

  const [yurishRejimi, setYurishRejimi] = useState(true); // Sukut bo'yicha doimo FPS yurish faol
  const [yurmoqda, setYurmoqda] = useState(false);
  const [fpsQaralganIdish, setFpsQaralganIdish] = useState(null);
  const [fpsQolIdish, setFpsQolIdish] = useState(null);
  const [fpsQaralganStansiya, setFpsQaralganStansiya] = useState(null);
  const [fpsKontekstMatn, setFpsKontekstMatn] = useState("");
  const [fpsKontekstTuri, setFpsKontekstTuri] = useState("oddiy");
  const [sezgirlik, setSezgirlik] = useState(1.0); // 0.2 .. 2.5x
  const [qarashRejimi, setQarashRejimi] = useState("pointerlock");
  const [qarashXabari, setQarashXabari] = useState("");
  sezgirlikRef.current = sezgirlik;

  // 1. Initializatsiya: OrbitControls ni to'liq o'chirib, kamerani FPS rejimiga o'rnatish
  useEffect(() => {
    if (!tayyor || !kameraRef?.current) return;

    if (controlsRef?.current) {
      controlsRef.current.enabled = false;
    }

    kameraRef.current.position.set(0, 1.58, 2.5);
    rotationRef.current.yaw = 0;
    rotationRef.current.pitch = -0.12;
    yawJamiRef.current = 0;
    fokusFaolRef.current = true;
    eyeHeightRef.current = 1.58;
    targetEyeHeightRef.current = 1.58;
    velocityRef.current.set(0, 0, 0);
  }, [tayyor, kameraRef, controlsRef]);

  // Sezgirlikni localStorage dan o'qish
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lab-3d-sezgirlik");
        if (saved) {
          const val = parseFloat(saved);
          if (!isNaN(val) && val >= 0.2 && val <= 3.0) {
            setSezgirlik(val);
            sezgirlikRef.current = val;
          }
        }
      } catch (e) {}
    }
  }, []);

  const sezgirlikniOzgartir = useCallback((yangiVal) => {
    const val = Math.max(0.2, Math.min(3.0, Number(yangiVal) || 1.0));
    setSezgirlik(val);
    sezgirlikRef.current = val;
    try {
      localStorage.setItem("lab-3d-sezgirlik", String(val));
    } catch (e) {}
  }, []);

  // Qo'l holati o'zgarganda yorliq 5-kadr collision siklini kutmaydi.
  useEffect(() => {
    const avvalgi = avvalgiQolIdishRef.current;
    if (avvalgi && avvalgi !== fpsQolIdish) {
      idishYorliginiQoldaYangila(avvalgi, false);
    }
    if (fpsQolIdish) idishYorliginiQoldaYangila(fpsQolIdish, true);
    avvalgiQolIdishRef.current = fpsQolIdish;
  }, [fpsQolIdish]);

  const toggleYurishRejimi = useCallback(() => {
    setYurishRejimi((prev) => {
      const yangi = !prev;
      if (controlsRef?.current) {
        controlsRef.current.enabled = !yangi;
      }
      return yangi;
    });
  }, [controlsRef]);

  const qolgaOlYokiQoy = useNishonAmali({
    kameraRef,
    sahnaRef,
    fpsQolIdish,
    fpsQaralganIdish,
    fpsQaralganStansiya,
    setFpsQolIdish,
    onIdishTanlandi,
    onQuyishBoshla,
    onTaroziTushdi,
    onTarozidanOlingan,
    onTaroziTara,
    onTaroziNol,
    onSpirtovkaBosildi,
    onSpirtovkagaQoyildi,
    onRakovinaKraniBosildi,
    onRakovinagaTushdi,
    onPlanshetBosildi,
    onStansiyaOchildi,
    onStenddanJihozOlish,
    onJavongaQaytar,
    onAralashtirish,
    onSpatulaAmal,
    onTitrlashKran,
    onElektrolizTok,
    onXavfsizlikDushi,
    onKozYuvish,
    onKozoynakTaqish,
    onGazNiqobiTaqish,
  });

  useKlaviatura({
    tayyor,
    yurishRejimi,
    fpsQolIdish,
    qolgaOlYokiQoy,
    onAniqHajmQuy,
    holat,
  });

  useQarashBoshqaruvi({
    tayyor,
    yurishRejimi,
    rendererRef,
    fpsQolIdish,
    fpsQaralganIdish,
    qolgaOlYokiQoy,
    onQuyishToxtat,
    onAniqHajmQuy,
    setQarashRejimi,
    setQarashXabari,
    holat,
  });

  useYurishSikli({
    tayyor,
    yurishRejimi,
    kameraRef,
    sahnaRef,
    fpsQolIdish,
    isitimoda,
    setYurmoqda,
    setFpsQaralganIdish,
    setFpsQaralganStansiya,
    setFpsKontekstMatn,
    setFpsKontekstTuri,
    holat,
  });

  const handleJoystickHarakat = useCallback((vx, vz, isSprint) => {
    analogRef.current = { vx, vz, sprint: isSprint };
  }, []);

  const handleJoystickBurilish = useCallback((dx, dy) => {
    const sens = sezgirlikRef.current || 1.0;
    rotationRef.current.yaw -= dx * 0.0055 * sens;
    rotationRef.current.pitch -= dy * 0.0055 * sens;
    rotationRef.current.pitch = Math.max(-1.48, Math.min(1.48, rotationRef.current.pitch));
  }, []);

  return {
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
    yawJamiRef,
    qolgaOlYokiQoy,
    sezgirlik,
    sezgirlikniOzgartir,
    handleJoystickHarakat,
    handleJoystickBurilish,
  };
}
