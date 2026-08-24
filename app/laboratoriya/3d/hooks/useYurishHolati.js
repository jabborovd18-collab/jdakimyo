"use client";

import { useRef } from "react";
import * as THREE from "three";

// Yurishning butun MUTABLE holati — 20 dan ortiq ref bitta joyda.
//
// `useYurish.js` dan ajratildi (BRIF-05).
//
// NEGA TO'PLAM: bu ref lar to'rt qism (klaviatura, qarash, sikl,
// nishon amali) orasida bo'linadi va har biri boshqasining ozgina
// qismini o'qiydi. Ularni parametr sifatida uzatilsa, har hookka
// 10-20 argument kerak bo'lardi; bitta to'plam esa chegarani ochiq
// qoldiradi va yangi ref qo'shilganda imzolar o'zgarmaydi.
//
// NEGA REF, HOLAT EMAS: bularning hammasi rAF sikli ichida, React
// render siklidan TASHQARIDA o'zgaradi. `useState` bo'lganda har kadr
// qayta render bo'lardi.

export function useYurishHolati() {
  // Kirish usuli (sensor/sichqoncha) — nishon matnini moslash uchun.
  // Sikl ichida o'qiladi, shuning uchun ref.
  const kirishUsuliRef = useRef("sichqoncha");

  const sezgirlikRef = useRef(1.0);

  // Harakat klavishlari va sensor analog kirishlari
  const keysRef = useRef({ w: false, s: false, a: false, d: false, sprint: false, crouch: false });
  const analogRef = useRef({ vx: 0, vz: 0, sprint: false });

  // Kamera burchaklari (Yaw: Gorizontal, Pitch: Vertikal)
  const rotationRef = useRef({ yaw: 0, pitch: -0.12 });
  const yawJamiRef = useRef(0);
  const qarashRejimiRef = useRef("pointerlock");
  const fokusFaolRef = useRef(true);
  const pointerLockOxirgiChiqishRef = useRef(0);
  const velocityRef = useRef(new THREE.Vector3());

  // Sakrash, cho'qqayish va ko'z balandligi
  const verticalVelocityRef = useRef(0);
  const targetEyeHeightRef = useRef(1.58);
  const eyeHeightRef = useRef(1.58);

  const kadrIdRef = useRef(null);
  const oldingiVaqtRef = useRef(performance.now());
  const qadamVaqtiRef = useRef(0);
  const bobbingRef = useRef(0);

  const centerRaycasterRef = useRef(new THREE.Raycaster());
  const avvalgiFpsYoritilganRef = useRef(null);
  const avvalgiQolIdishRef = useRef(null);
  const quyishBosilganRef = useRef(false);

  // Re-render bostiruvchi ref keshlar (React re-render storm oldini olish)
  const prevIsMovingRef = useRef(false);
  const prevStansiyaRef = useRef(null);
  const prevPromptTextRef = useRef("");
  const prevPromptTypeRef = useRef("oddiy");
  const raycastFrameRef = useRef(0);

  return {
    kirishUsuliRef,
    sezgirlikRef,
    keysRef,
    analogRef,
    rotationRef,
    yawJamiRef,
    qarashRejimiRef,
    fokusFaolRef,
    pointerLockOxirgiChiqishRef,
    velocityRef,
    verticalVelocityRef,
    targetEyeHeightRef,
    eyeHeightRef,
    kadrIdRef,
    oldingiVaqtRef,
    qadamVaqtiRef,
    bobbingRef,
    centerRaycasterRef,
    avvalgiFpsYoritilganRef,
    avvalgiQolIdishRef,
    quyishBosilganRef,
    prevIsMovingRef,
    prevStansiyaRef,
    prevPromptTextRef,
    prevPromptTypeRef,
    raycastFrameRef,
  };
}
