"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useSahna } from "../hooks/useSahna.js";
import { FONLAR, SUKUT_FON } from "../lib/fonlar.js";
import { kadrGistogrammasi, kadrQorami } from "./olcham-hisob.js";
import {
  NUQTA_NOMLARI,
  nuqtaniOl,
  supurishNuqtalariniYarat,
} from "./olcham-nuqtalar.js";

function parametrlarniOl() {
  const q = new URLSearchParams(window.location.search);
  const xomMavzu = q.get("mavzu") || SUKUT_FON;
  const mavzu = FONLAR[xomMavzu] ? xomMavzu : SUKUT_FON;
  const nuqta = q.get("nuqta") || "stol";
  const sifat = q.get("sifat") === "arzon" ? "arzon" : "toliq";
  return { mavzu, nuqta, sifat };
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
  } = useSahna(
    konteynerRef,
    !param,
    param?.mavzu || SUKUT_FON,
    { olcham: true, sifat: param?.sifat || "toliq" },
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

  const olcham = useCallback(async (ozgartirish = {}) => {
    const renderer = rendererRef.current;
    const kamera = kameraRef.current;
    const scene = sahnaRef.current;
    if (!renderer || !kamera || !scene || !param) {
      throw new Error("Sahna hali tayyor emas");
    }

    const nuqtaNom = ozgartirish.nuqta || param.nuqta;
    const kameraNuqta = ozgartirish.kameraNuqta || nuqtaniOl(nuqtaNom);
    kameraniQoy(kamera, controlsRef.current, kameraNuqta);

    // Birinchi kadr sahna yukini kutadi. Keyingi nomli kamerada ikki kadr
    // matritsa almashganini tasdiqlaydi; supurish esa har namunani o'zi
    // sinxron render qiladi, aks holda 24×4 tekshiruv asossiz sekinlashadi.
    if (!ozgartirish.tez) {
      await kadrlarniKut(fpsRef, ilkOlchovRef.current);
      ilkOlchovRef.current = false;
    }

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

    const natija = {
      mavzu: param.mavzu,
      nuqta: nuqtaNom,
      sifat: param.sifat,
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
      chiroqSoni: chiroqlarniSana(scene),
    };
    if (ozgartirish.rasm) {
      natija.rasm = kadrRasminiYarat(pixels, w, h);
    }
    return natija;
  }, [param, rendererRef, sahnaRef, kameraRef, controlsRef, composerRef]);

  olchamRef.current = olcham;

  const supurish = useCallback(async (sozlama = {}) => {
    const { urug, nuqtalar } = supurishNuqtalariniYarat(sozlama.urug);
    let engYomon = null;

    for (const kameraNuqta of nuqtalar) {
      const natija = await olchamRef.current({
        nuqta: "sweep",
        kameraNuqta,
        tez: true,
      });
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
      // Mavzu kalitlari qayta yozilmaydi: FONLAR ularning mavjud yagona manbai.
      mavzular: Object.keys(FONLAR),
      nuqtalar: NUQTA_NOMLARI,
      joriyMavzu: param.mavzu,
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
