"use client";

import { useEffect, useRef, useState } from "react";

import { useSahna } from "../hooks/useSahna.js";
import { SUKUT_PROFIL, profilniOl } from "../lib/sifat-profili.js";
import { kameraniQoy, nuqtaniOl } from "./olcham-nuqtalar.js";
import { useKadrSanagich } from "./useKadrSanagich.js";
import { useOlchamApi } from "./useOlchamApi.js";
import { useOlchov } from "./useOlchov.js";
import { useQarashSinovi } from "./useQarashSinovi.js";

// O'lchov sahifasi — faqat YIG'ADI.
//
// BRIF-05 da 727 qatorlik monolitdan bo'lindi. Bu yerda qolgani:
// URL shartnomasi, sahnani ulash, kamerani qo'yish va DOM. O'lchovning
// o'zi, kadr narxi, sahna sanoqlari va `window.__*` eshigi alohida
// fayllarda — har biri sahifasiz ham o'qiladi.

function parametrlarniOl() {
  const q = new URLSearchParams(window.location.search);
  const profil = profilniOl(q.get("profil") || SUKUT_PROFIL).nom;
  const nuqta = q.get("nuqta") || "stol";
  // BRIF-03 2-mezon. O'lchov paytida DRS o'chiq bo'lishi SHART, lekin
  // ulash haqiqatan ishlashini ham ko'rsatish kerak. `?drs=1` uni
  // ataylab yoqadi va shu sahifa ideal sinov maydoni: dasturiy
  // renderer sekin, ya'ni kadr nishondan ancha uzoq va boshqaruvchi
  // rezolyutsiyani pastki chegaraga tushirishi SHART.
  //
  // Oddiy o'lchov yo'liga tegmaydi: parametr berilmasa DRS o'chiq.
  const drs = q.get("drs") === "1";
  return { profil, nuqta, drs };
}

export default function OlchamMijoz() {
  const [param, setParam] = useState(null);
  const konteynerRef = useRef(null);

  useEffect(() => {
    setParam(parametrlarniOl());
  }, []);

  const {
    tayyor,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    composerRef,
    profilRef,
    yorliqHolatiRef,
    birlashuvRef,
    jihozQosh,
    jihozOlib,
  } = useSahna(
    konteynerRef,
    !param,
    {
      olcham: true,
      profil: param?.profil || SUKUT_PROFIL,
      yorliqlarYoqilgan: true,
      drsMajburiy: !!param?.drs,
    },
  );

  useEffect(() => {
    if (!tayyor || !kameraRef.current || !param) return;
    kameraniQoy(kameraRef.current, controlsRef.current, nuqtaniOl(param.nuqta));
  }, [tayyor, param, kameraRef, controlsRef]);

  const { sahnaniKut, fpsOrtachasi } = useKadrSanagich(tayyor);
  const qarashSinoviRef = useQarashSinovi(tayyor, rendererRef);

  const { olchamRef, supurishRef } = useOlchov({
    param,
    sahnaRef,
    kameraRef,
    rendererRef,
    controlsRef,
    composerRef,
    profilRef,
    yorliqHolatiRef,
    birlashuvRef,
    qarashSinoviRef,
    sahnaniKut,
    fpsOrtachasi,
  });

  useOlchamApi({
    tayyor,
    param,
    sahnaRef,
    kameraRef,
    rendererRef,
    jihozQosh,
    jihozOlib,
    olchamRef,
    supurishRef,
  });

  return (
    <div
      ref={konteynerRef}
      data-olcham="1"
      style={{ position: "fixed", inset: 0, background: "#000" }}
    />
  );
}
