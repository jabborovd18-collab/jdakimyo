"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSahna } from "../hooks/useSahna.js";
import { FONLAR, SUKUT_FON } from "../lib/fonlar.js";
import { kadrGistogrammasi, kadrQorami } from "./olcham-hisob.js";
import { nuqtaniOl } from "./olcham-nuqtalar.js";

function parametrlarniOl() {
  const q = new URLSearchParams(window.location.search);
  const xomMavzu = q.get("mavzu") || SUKUT_FON;
  const mavzu = FONLAR[xomMavzu] ? xomMavzu : SUKUT_FON;
  const nuqta = q.get("nuqta") || "stol";
  return { mavzu, nuqta };
}

function kameraniQoy(kamera, controls, nuqtaNom) {
  const nuqta = nuqtaniOl(nuqtaNom);
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
  return { pixels, w, h };
}

export default function OlchamMijoz() {
  const [param, setParam] = useState(null);
  const konteynerRef = useRef(null);
  const fpsRef = useRef({ namuna: [], oxirgi: 0, kadr: 0 });
  const olchamRef = useRef(null);

  useEffect(() => {
    setParam(parametrlarniOl());
  }, []);

  const { tayyor, sahnaRef, kameraRef, rendererRef, controlsRef, composerRef } = useSahna(
    konteynerRef,
    !param,
    param?.mavzu || SUKUT_FON,
    { olcham: true },
  );

  useEffect(() => {
    if (!tayyor || !kameraRef.current || !param) return;
    kameraniQoy(kameraRef.current, controlsRef.current, param.nuqta);
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
    if (!rendererRef.current || !kameraRef.current) {
      throw new Error("Sahna hali tayyor emas");
    }

    const nuqtaNom = ozgartirish.nuqta || param.nuqta;
    // Avval kamera — keyin kadrlar shu nuqtada chiziladi.
    kameraniQoy(kameraRef.current, controlsRef.current, nuqtaNom);

    // Kamida 60 kadr, lekin protsedural sahnada async tekstura yo'q:
    // SwiftShader da 60 kadr bir daqiqaga cho'ziladi. 8 kadr + 4 s
    // ham yetadi; GPU da 60 kadr ~1 s da yig'iladi.
    const boshlangich = fpsRef.current.kadr;
    await new Promise((resolve, reject) => {
      const t0 = performance.now();
      const kut = () => {
        const otdi = fpsRef.current.kadr - boshlangich;
        const vaqt = performance.now() - t0;
        if (otdi >= 60 || (otdi >= 8 && vaqt >= 2000)) {
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

    const renderer = rendererRef.current;
    // autoReset o'chiq: kompozitor bir necha pass qiladi, oxirgisi
    // fullscreen quad (1 uchburchak) — shu pastda info ni o'qisak
    // sahna hajmi yo'qoladi. Yig'indini olamiz, keyin qayta yoqamiz.
    renderer.info.autoReset = false;
    renderer.info.reset();
    if (composerRef.current) composerRef.current.render();
    else renderer.render(sahnaRef.current, kameraRef.current);
    const uchburchak = renderer.info.render.triangles;
    const chaqiruv = renderer.info.render.calls;
    const teksturaXotira = renderer.info.memory.textures;
    renderer.info.autoReset = true;

    const { pixels, w, h } = kadrPikseliniOqi(renderer);
    if (kadrQorami(pixels)) {
      throw new Error("Kadr qora — WebGL buferi o'qilmadi");
    }

    const gist = kadrGistogrammasi(pixels, w, h, { origin: "bottom-left" });
    const namuna = fpsRef.current.namuna;
    const fps = namuna.length
      ? namuna.reduce((a, b) => a + b, 0) / namuna.length
      : 0;

    return {
      mavzu: param.mavzu,
      nuqta: nuqtaNom,
      kuygan: gist.kuygan,
      qora: gist.qora,
      ortacha: gist.ortacha,
      p50: gist.p50,
      p95: gist.p95,
      shipLuma: gist.shipLuma,
      polLuma: gist.polLuma,
      fps,
      uchburchak,
      chaqiruv,
      teksturaXotira,
    };
  }, [param, rendererRef, sahnaRef, kameraRef, controlsRef, composerRef]);

  olchamRef.current = olcham;

  useEffect(() => {
    if (!tayyor || !param) return;
    window.__olcham = (x) => olchamRef.current(x);
    return () => {
      if (window.__olcham) delete window.__olcham;
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
