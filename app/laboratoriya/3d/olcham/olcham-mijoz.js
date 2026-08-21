"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSahna } from "../hooks/useSahna.js";
import {
  PROFIL_NOMLARI,
  SUKUT_PROFIL,
  profilniOl,
} from "../lib/sifat-profili.js";
import { kadrGistogrammasi, kadrQorami } from "./olcham-hisob.js";
import { yorliqlarniYangila } from "../lib/yorliqlar.js";
import { pointerLockMavjudmi, yawniSiljit } from "../lib/qarash-boshqaruvi.js";
import {
  NUQTA_NOMLARI,
  nuqtaniOl,
  supurishNuqtalariniYarat,
} from "./olcham-nuqtalar.js";

function parametrlarniOl() {
  const q = new URLSearchParams(window.location.search);
  const profil = profilniOl(q.get("profil") || SUKUT_PROFIL).nom;
  const nuqta = q.get("nuqta") || "stol";
  return { profil, nuqta };
}

function kameraniQoy(kamera, controls, nuqta) {
  kamera.up.set(nuqta.up[0], nuqta.up[1], nuqta.up[2]);
  kamera.position.set(nuqta.kamera[0], nuqta.kamera[1], nuqta.kamera[2]);
  kamera.lookAt(nuqta.nishon[0], nuqta.nishon[1], nuqta.nishon[2]);
  kamera.updateMatrixWorld();
  if (controls) {
    controls.enabled = false;
    controls.target.set(nuqta.nishon[0], nuqta.nishon[1], nuqta.nishon[2]);
  }
}

function kadrPikseliniOqi(renderer) {
  const canvas = renderer.domElement;
  const w = canvas.width;
  const h = canvas.height;
  if (w < 2 || h < 2) {
    throw new Error(`Canvas o'lchami yaroqsiz: ${w}×${h}`);
  }
  const gl = renderer.getContext();
  if (!gl || gl.isContextLost?.()) {
    throw new Error("WebGL kontekst yo'q yoki yo'qolgan");
  }
  const pixels = new Uint8Array(w * h * 4);
  gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  return { pixels, w, h, gl };
}

function rendererNominiOl(gl) {
  const kengaytma = gl.getExtension("WEBGL_debug_renderer_info");
  if (kengaytma) {
    const nom = gl.getParameter(kengaytma.UNMASKED_RENDERER_WEBGL);
    if (nom) return String(nom);
  }
  return String(gl.getParameter(gl.RENDERER) || "Noma'lum WebGL renderer");
}

// BRIF-07 — nishon tanlay oladigan ob'ektlarni sanaydi.
//
// useYurish.js ota-zanjir bo'ylab `userData.kalit` ni qidiradi; ba'zi
// stansiyalar esa faqat NOM bilan topiladi (masalan
// `3D_Devor_Reagent_Shkaflari`). Ikkala usul ham sanaladi, chunki
// geometriya birlashtirilganda ikkalasi ham yo'qolishi mumkin.
function interaktivlarniSana(scene) {
  const nomlar = new Set([
    "Tarozi_Stansiyasi",
    "Xavfsizlik_Dushi_Stansiyasi",
    "Davriy_Jadval_LED_Plakat",
    "Titrlash_Byuretka_Stansiyasi",
    "Elektroliz_Stansiyasi",
    "Yuvinish_Rakovinasi",
    "3D_Devor_Reagent_Shkaflari",
  ]);
  let soni = 0;
  scene.traverse((o) => {
    if (o.userData?.kalit || o.userData?.tanlanadi) soni += 1;
    else if (o.name && nomlar.has(o.name)) soni += 1;
  });
  return soni;
}

function chiroqlarniSana(scene) {
  let soni = 0;
  scene.traverse((obyekt) => {
    if (obyekt instanceof THREE.Light) soni += 1;
  });
  return soni;
}

function kadrRasminiYarat(pixels, width, height) {
  const rasmW = 640;
  const rasmH = 360;
  const kichik = new Uint8ClampedArray(rasmW * rasmH * 4);

  // readPixels pastki chapdan boshlanadi. Canvas ImageData esa yuqori
  // chapdan: shu yerda aylantirilmasa ko'rik PNG'i teskari chiqadi.
  for (let y = 0; y < rasmH; y += 1) {
    const srcY = height - 1 - Math.min(height - 1, Math.floor((y + 0.5) * height / rasmH));
    for (let x = 0; x < rasmW; x += 1) {
      const srcX = Math.min(width - 1, Math.floor((x + 0.5) * width / rasmW));
      const src = (srcY * width + srcX) * 4;
      const dst = (y * rasmW + x) * 4;
      kichik[dst] = pixels[src];
      kichik[dst + 1] = pixels[src + 1];
      kichik[dst + 2] = pixels[src + 2];
      kichik[dst + 3] = pixels[src + 3];
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = rasmW;
  canvas.height = rasmH;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(new ImageData(kichik, rasmW, rasmH), 0, 0);
  return canvas.toDataURL("image/png");
}

function kadrlarniKut(fpsRef, birinchi) {
  const boshlangich = fpsRef.current.kadr;
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const kut = () => {
      const otdi = fpsRef.current.kadr - boshlangich;
      const vaqt = performance.now() - t0;
      const birinchiTayyor = otdi >= 60 || (otdi >= 8 && vaqt >= 2000);
      if ((birinchi && birinchiTayyor) || (!birinchi && otdi >= 2)) {
        resolve();
        return;
      }
      if (vaqt > 90000) {
        reject(new Error(`Sahna barqarorlashmadi (otdi=${otdi})`));
        return;
      }
      requestAnimationFrame(kut);
    };
    kut();
  });
}

export default function OlchamMijoz() {
  const [param, setParam] = useState(null);
  const konteynerRef = useRef(null);
  const fpsRef = useRef({ namuna: [], oxirgi: 0, kadr: 0 });
  const ilkOlchovRef = useRef(true);
  const olchamRef = useRef(null);
  const supurishRef = useRef(null);
  const qarashSinoviRef = useRef({
    rejim: "pointerlock",
    yaw: 0,
    yawJami: 0,
    faol: true,
  });

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
  } = useSahna(
    konteynerRef,
    !param,
    {
      olcham: true,
      profil: param?.profil || SUKUT_PROFIL,
      yorliqlarYoqilgan: true,
    },
  );

  useEffect(() => {
    if (!tayyor || !kameraRef.current || !param) return;
    kameraniQoy(kameraRef.current, controlsRef.current, nuqtaniOl(param.nuqta));
  }, [tayyor, param, kameraRef, controlsRef]);

  useEffect(() => {
    if (!tayyor) return;
    let id = 0;
    const tik = (t) => {
      const s = fpsRef.current;
      if (s.oxirgi > 0) {
        const dt = t - s.oxirgi;
        if (dt > 0) {
          s.namuna.push(1000 / dt);
          if (s.namuna.length > 120) s.namuna.shift();
        }
      }
      s.oxirgi = t;
      s.kadr += 1;
      id = requestAnimationFrame(tik);
    };
    id = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(id);
  }, [tayyor]);

  useEffect(() => {
    if (!tayyor || !rendererRef.current) return;
    const sinov = qarashSinoviRef.current;
    sinov.rejim = pointerLockMavjudmi(rendererRef.current.domElement)
      ? "pointerlock"
      : "zaxira";
    sinov.faol = !document.hidden;

    const fokusYoqotildi = () => { sinov.faol = false; };
    const fokusQaytdi = () => { sinov.faol = true; };
    const visibility = () => { sinov.faol = !document.hidden; };

    window.__qarashSinovi = (piksel) => {
      const oldin = sinov.yaw;
      let farq = 0;
      if (sinov.faol) {
        farq = yawniSiljit(sinov, Number(piksel) || 0, 1);
        sinov.yawJami += Math.abs(farq);
      }
      return {
        qarashRejimi: sinov.rejim,
        oldin,
        keyin: sinov.yaw,
        farq,
        yawJami: sinov.yawJami,
        faol: sinov.faol,
      };
    };

    window.addEventListener("blur", fokusYoqotildi);
    window.addEventListener("focus", fokusQaytdi);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", fokusYoqotildi);
      window.removeEventListener("focus", fokusQaytdi);
      document.removeEventListener("visibilitychange", visibility);
      if (window.__qarashSinovi) delete window.__qarashSinovi;
    };
  }, [tayyor, rendererRef]);

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
      await kadrlarniKut(fpsRef, ilkOlchovRef.current);
      ilkOlchovRef.current = false;
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
    const namuna = fpsRef.current.namuna;
    const fps = namuna.length
      ? namuna.reduce((a, b) => a + b, 0) / namuna.length
      : 0;
    const chiroqSoni = chiroqlarniSana(scene);
    // BRIF-07 — nishon (crosshair) tanlay oladigan ob'ektlar soni.
    // Birlashtirish interaktiv shoxga tegib ketsa, bu son TUSHADI.
    // useYurish.js ota-zanjirda `userData.kalit` ni qidiradi, ba'zi
    // stansiyalar esa faqat nom bilan topiladi — ikkalasi sanaladi.
    const interaktivSoni = interaktivlarniSana(scene);
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
      yuqoriSoha: gist.yuqoriSoha,
      quyiSoha: gist.quyiSoha,
      fps,
      uchburchak,
      chaqiruv,
      teksturaXotira,
      renderer: rendererNominiOl(gl),
      chiroqSoni,
      interaktivSoni,
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
    qarashSinoviRef,
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

  useEffect(() => {
    if (!tayyor || !param) return;
    window.__olcham = (x) => olchamRef.current(x);
    window.__supurish = (x) => supurishRef.current(x);
    window.__olchamSozlama = {
      profillar: PROFIL_NOMLARI,
      nuqtalar: NUQTA_NOMLARI,
      joriyProfil: param.profil,
    };
    return () => {
      if (window.__olcham) delete window.__olcham;
      if (window.__supurish) delete window.__supurish;
      if (window.__olchamSozlama) delete window.__olchamSozlama;
    };
  }, [tayyor, param]);

  return (
    <div
      ref={konteynerRef}
      data-olcham="1"
      style={{ position: "fixed", inset: 0, background: "#000" }}
    />
  );
}
