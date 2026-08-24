"use client";

import { useCallback, useRef } from "react";

import { kadrGistogrammasi, kadrQorami, kadrYuqoriChastotasi } from "./olcham-hisob.js";
import { narxTaqsimoti, supurishNarxi } from "./olcham-kadr-narxi.js";
import { kadrPikseliniOqi, kadrRasminiYarat } from "./olcham-kadr-rasm.js";
import {
  chiroqlarniSana,
  interaktivlarniSana,
  rendererNominiOl,
  stansiyaMeshlariniSana,
} from "./olcham-sahna-oqish.js";
import {
  kameraniQoy,
  nuqtaniOl,
  supurishNuqtalariniYarat,
} from "./olcham-nuqtalar.js";
import { yorliqlarniYangila } from "../lib/yorliqlar.js";
import { assetHolati } from "../lib/asset-yuklovchi.js";

// O'LCHOVNING O'ZI — bitta kadr va 24 nuqtali supurish.
//
// `olcham-mijoz.js` dan ajratildi (BRIF-05). Komponentda sahnani ulash
// va DOM qoldi; o'lchov mantig'i shu yerda, chunki u sahifadan
// mustaqil: kirishi — sahna havolalari, chiqishi — sonlar obyekti.
//
// NEGA `ref` QAYTARADI. `window.__olcham` ni o'rnatadigan effekt bir
// marta ishlaydi va u eng SO'NGGI funksiyani chaqirishi kerak. Qiymat
// berilsa, effekt har qayta yaratilishda qayta o'rnatilishi kerak
// bo'lardi — asl kodda ham aynan shu sabab ref ishlatilgan.

export function useOlchov({
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
}) {
  const olchamRef = useRef(null);
  const supurishRef = useRef(null);

  const olcham = useCallback(async (ozgartirish = {}) => {
    const renderer = rendererRef.current;
    const kamera = kameraRef.current;
    const scene = sahnaRef.current;
    const profil = profilRef.current;
    if (!renderer || !kamera || !scene || !profil || !param) {
      throw new Error("Sahna hali tayyor emas");
    }

    const nuqtaNom = ozgartirish.nuqta || param.nuqta;
    const kameraNuqta = ozgartirish.kameraNuqta || nuqtaniOl(nuqtaNom);
    kameraniQoy(kamera, controlsRef.current, kameraNuqta);

    // Birinchi kadr sahna yukini kutadi. Keyingi nomli kamerada ikki kadr
    // matritsa almashganini tasdiqlaydi; supurish esa har namunani o'zi
    // sinxron render qiladi, aks holda 24 nuqta asossiz sekinlashadi.
    if (!ozgartirish.tez) {
      await sahnaniKut();
    }

    // Kamera o'zgargach label siklining navbatdagi 5-kadrini kutmaymiz:
    // bu qator aynan o'lchanayotgan kamera uchun collision holatini oladi.
    const yorliqHolati = yorliqlarniYangila(scene, kamera, renderer, true);
    yorliqHolatiRef.current = yorliqHolati;

    // autoReset o'chiq: kompozitor bir necha pass qiladi, oxirgisi
    // fullscreen quad — yig'indini olamiz, so'ng avvalgi holatni qaytaramiz.
    const eskiAutoReset = renderer.info.autoReset;
    renderer.info.autoReset = false;
    renderer.info.reset();
    if (composerRef.current) composerRef.current.render();
    else renderer.render(scene, kamera);
    const uchburchak = renderer.info.render.triangles;
    const chaqiruv = renderer.info.render.calls;
    const teksturaXotira = renderer.info.memory.textures;
    renderer.info.autoReset = eskiAutoReset;

    const { pixels, w, h, gl } = kadrPikseliniOqi(renderer);
    if (kadrQorami(pixels)) {
      throw new Error("Kadr qora — WebGL buferi o'qilmadi");
    }

    const gist = kadrGistogrammasi(pixels, w, h, { origin: "bottom-left" });
    // Yuqori chastotali energiya. DIQQAT: bu tiniqlik EMAS —
    // olcham-hisob.js dagi izohga qarang.
    const yuqoriChastota = kadrYuqoriChastotasi(pixels, w, h);

    // Kadr narxi — piksel o'qilgandan KEYIN, chunki o'lchov vaqtincha
    // bufer o'lchamini o'zgartiradi. Supurishda o'tkazib yuboriladi:
    // 24 nuqtaning har birida ~1 soniya qo'shilardi va supurishning
    // vazifasi qamrov, narx emas.
    const narx = ozgartirish.tez
      ? supurishNarxi()
      : narxTaqsimoti(renderer, scene, kamera, composerRef.current);

    const fps = fpsOrtachasi();
    const chiroqSoni = chiroqlarniSana(scene);
    // BRIF-07 — birlashtirish interaktivlikni yeb qo'ymaganini ikki
    // xil tomondan tekshiradi: `userData` bilan tanlanadiganlar soni va
    // nomli stansiyalarning mesh qoldig'i.
    const interaktivSoni = interaktivlarniSana(scene);
    const stansiyaMeshlari = stansiyaMeshlariniSana(scene);
    const qarashSinovi = qarashSinoviRef.current;

    const natija = {
      profil: profil.nom,
      qarashRejimi: qarashSinovi.rejim,
      yawJami: qarashSinovi.yawJami,
      nuqta: nuqtaNom,
      chiroqBudjeti: profil.chiroqBudjeti,
      chiroqBudjetiBuzildi: chiroqSoni > profil.chiroqBudjeti,
      kuygan: gist.kuygan,
      qora: gist.qora,
      ortacha: gist.ortacha,
      p50: gist.p50,
      p95: gist.p95,
      yuqoriChastota,
      yuqoriSoha: gist.yuqoriSoha,
      quyiSoha: gist.quyiSoha,
      // FPS SAQLANADI, lekin unga tayanilmaydi — u sahna og'irligini
      // sezmaydi (yuqoridagi izoh). Haqiqiy o'lchov `kadrVaqti`.
      fps,
      kadrVaqti: narx.kadrVaqti,
      kadrVaqtiTarqoq: narx.kadrVaqtiTarqoq,
      kadrVaqti4x: narx.kadrVaqti4x,
      fragmentNarxi: narx.fragment,
      geometriyaNarxi: narx.geometriya,
      fragmentUlushi: narx.fragmentUlushi,
      narxIshonchli: narx.ishonchli,
      narxSababi: narx.narxSababi,
      narxPikselNisbati: narx.pikselNisbati,
      uchburchak,
      chaqiruv,
      teksturaXotira,
      renderer: rendererNominiOl(gl),
      chiroqSoni,
      // BRIF-03 — o'lchov paytida rezolyutsiya qotib turishi shart.
      // `kutilgan` profil va ekran zichligidan hisoblanadi; ikkisi teng
      // bo'lmasa DRS o'lchagichda ishlab ketgan degani.
      pikselNisbati: renderer.getPixelRatio(),
      pikselNisbatiKutilgan: Math.min(window.devicePixelRatio || 1, profil.pikselNisbati),
      interaktivSoni,
      stansiyaMeshlari,
      // BRIF-07 dalili: nechta mesh birlashdi, nechta guruh hosil bo'ldi,
      // nechta tanlanadigan shox chetlab o'tildi.
      birlashuv: { ...(birlashuvRef?.current || {}) },
      // BRIF-02 dalili: nechta asset so'raldi, nechtasi keldi, nechtasi
      // xato berdi. `xato > 0` bo'lsa sahna protsedural zaxirada.
      asset: assetHolati(),
      yorliqSoni: yorliqHolati.yorliqSoni,
      yorliqToqnashuvi: yorliqHolati.yorliqToqnashuvi,
    };
    if (ozgartirish.rasm) {
      natija.rasm = kadrRasminiYarat(pixels, w, h);
    }
    return natija;
  }, [
    param,
    rendererRef,
    sahnaRef,
    kameraRef,
    controlsRef,
    composerRef,
    profilRef,
    yorliqHolatiRef,
    birlashuvRef,
    qarashSinoviRef,
    sahnaniKut,
    fpsOrtachasi,
  ]);

  olchamRef.current = olcham;

  const supurish = useCallback(async (sozlama = {}) => {
    const { urug, nuqtalar } = supurishNuqtalariniYarat(sozlama.urug);
    let engYomon = null;
    let engKopYorliq = 0;
    let engKopToqnashuv = 0;

    for (const kameraNuqta of nuqtalar) {
      const natija = await olchamRef.current({
        nuqta: "sweep",
        kameraNuqta,
        tez: true,
      });
      engKopYorliq = Math.max(engKopYorliq, natija.yorliqSoni);
      engKopToqnashuv = Math.max(
        engKopToqnashuv,
        natija.yorliqToqnashuvi,
      );
      if (!engYomon || natija.kuygan > engYomon.natija.kuygan) {
        engYomon = { natija, kameraNuqta };
      }
    }

    if (!engYomon) throw new Error("Supurish nuqtasi yaratilmagan");

    // Sikl oxirida kamera boshqa joyda qoladi. Eng yomon joyni yana bir
    // marta chizib, aynan o'sha joy PNG'ga tushishini kafolatlaymiz.
    const rasmli = await olchamRef.current({
      nuqta: "sweep",
      kameraNuqta: engYomon.kameraNuqta,
      tez: true,
      rasm: true,
    });

    return {
      ...engYomon.natija,
      sweepEngYomon: engYomon.natija.kuygan,
      sweepJoy: engYomon.kameraNuqta.joy,
      // Sweep satrida label maydonlari 24 nuqtaning maksimumi: kuyish-worst
      // kamera label-worst kamerani yashirib qo'ymasligi kerak.
      yorliqSoni: engKopYorliq,
      yorliqToqnashuvi: engKopToqnashuv,
      sweepUrug: urug,
      sweepNamunaSoni: nuqtalar.length,
      rasm: rasmli.rasm,
    };
  }, []);

  supurishRef.current = supurish;

  return { olchamRef, supurishRef };
}
