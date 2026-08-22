"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { KIRISH, useKirishUsuli } from "../lib/kirish-usuli.js";
import { ANIQ_DOZALAR } from "../lib/sozlama.js";
import Ikon from "@/components/Ikon";

/**
 * PUBG MOBILE USLUBIDAGI ZERO-LAG DUAL SENSORLI ANALOG JOYSTIK.
 * Chapda 360° Hardware-Accelerated Analog Joystik, O'ngda Kamera Burish Paneli (Look Area).
 */
export default function VirtualJoystick({
  onHarakat,
  onBurilish,
  onSprintToggle,
  qaralganIdish,
  qolIdish,
  onQolgaOlYokiQoy,
  onQuyish,
  onAniqDoza,
}) {
  // Sensorli qurilma aniqlash `lib/kirish-usuli.js` da — u yagona ega.
  // Ilgari shart shu faylning ICHIDA yashardi va nishon matnlari uni
  // ko'ra olmasdi: joystik ko'rinardi, matn esa "[E / Klik]" derdi.
  const kirishUsuli = useKirishUsuli();
  const isTouchDevice = kirishUsuli === KIRISH.SENSOR;
  const [sprintAktiv, setSprintAktiv] = useState(false);

  const baseRef = useRef(null);
  const knobRef = useRef(null);
  const touchIdRef = useRef(null);
  const rightTouchIdRef = useRef(null);
  const rightLastPosRef = useRef({ x: 0, y: 0 });

  const RADIUS = 46; // Joystik maksimal harakat radiusi px

  // 1. CHAP TOMON: ANALOG JOYSTIK HODISALARI (ZERO REACT RE-RENDER)
  const handleJoystickTouchStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch || !baseRef.current) return;

    touchIdRef.current = touch.identifier;
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystickPos(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e) => {
    if (e.cancelable) e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        if (knobRef.current) {
          knobRef.current.style.transform = "translate3d(0px, 0px, 0px)";
        }
        if (typeof onHarakat === "function") onHarakat(0, 0, false);
        break;
      }
    }
  };

  const updateJoystickPos = (clientX, clientY) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.hypot(dx, dy);

    let normX = dx;
    let normY = dy;

    if (distance > RADIUS) {
      normX = (dx / distance) * RADIUS;
      normY = (dy / distance) * RADIUS;
    }

    if (knobRef.current) {
      knobRef.current.style.transform = `translate3d(${normX.toFixed(1)}px, ${normY.toFixed(1)}px, 0px)`;
    }

    const vectorX = normX / RADIUS; // -1 .. +1 (Left / Right)
    const vectorZ = normY / RADIUS; // -1 .. +1 (Forward / Backward: normY < 0 is UP/FORWARD)
    const isSprint = distance >= RADIUS * 0.88 || sprintAktiv;

    if (typeof onHarakat === "function") {
      onHarakat(vectorX, vectorZ, isSprint);
    }
  };

  // 2. O'NG TOMON: KAMERA BURISH (LOOK / AIM AREA)
  const handleRightTouchStart = (e) => {
    if (e.cancelable) e.preventDefault();
    const touch = e.changedTouches[0];
    if (!touch) return;
    rightTouchIdRef.current = touch.identifier;
    rightLastPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleRightTouchMove = (e) => {
    if (e.cancelable) e.preventDefault();
    if (rightTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === rightTouchIdRef.current) {
        const dx = touch.clientX - rightLastPosRef.current.x;
        const dy = touch.clientY - rightLastPosRef.current.y;
        rightLastPosRef.current = { x: touch.clientX, y: touch.clientY };

        if (typeof onBurilish === "function") {
          onBurilish(dx, dy);
        }
        break;
      }
    }
  };

  const handleRightTouchEnd = (e) => {
    if (e.cancelable) e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === rightTouchIdRef.current) {
        rightTouchIdRef.current = null;
        break;
      }
    }
  };

  if (!isTouchDevice) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none overflow-hidden touch-none">
      {/* ─── CHAP ZONA: ANALOG JOYSTIK ─── */}
      <div
        className="pointer-events-auto absolute bottom-8 left-6 w-36 h-36 flex items-center justify-center touch-none"
        onTouchStart={handleJoystickTouchStart}
        onTouchMove={handleJoystickTouchMove}
        onTouchEnd={handleJoystickTouchEnd}
        onTouchCancel={handleJoystickTouchEnd}
      >
        <div
          ref={baseRef}
          className="relative w-28 h-28 rounded-full border-2 border-white/30 bg-black/50 transition-colors flex items-center justify-center backdrop-blur-md shadow-2xl"
        >
          {/* O'rta nuqta */}
          <div className="w-2.5 h-2.5 rounded-full bg-white/25" />

          {/* Harakatlanuvchi Joystik Boshchasi (Knob - Direct CSS transform) */}
          <div
            ref={knobRef}
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-2xl border-2 border-white flex items-center justify-center will-change-transform"
            style={{ transform: "translate3d(0px, 0px, 0px)" }}
          >
            <div className="w-4 h-4 rounded-full bg-black/35" />
          </div>
        </div>
      </div>

      {/* Sprint Tugmasi */}
      <button
        type="button"
        onClick={() => {
          const yangi = !sprintAktiv;
          setSprintAktiv(yangi);
          if (typeof onSprintToggle === "function") onSprintToggle(yangi);
        }}
        className={`pointer-events-auto absolute bottom-44 left-10 p-2.5 rounded-2xl border text-xs font-mono font-bold transition-all shadow-xl ${
          sprintAktiv
            ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_#f59e0b]"
            : "bg-black/50 text-white/75 border-white/20 backdrop-blur-md"
        }`}
      >
        ⚡ SPRINT
      </button>

      {/* ─── INTERAKTIV BIRINCHI SHAXS AMALLAR TUGMALARI (FPS ACTION BUTTONS) ─── */}
      {(qaralganIdish || qolIdish) && (
        <div className="pointer-events-auto absolute right-6 bottom-28 flex flex-col gap-2.5 items-end z-50 animate-in slide-in-from-right duration-150">
          <button
            type="button"
            onClick={() => typeof onQolgaOlYokiQoy === "function" && onQolgaOlYokiQoy()}
            className="px-4 py-2.5 rounded-2xl border border-amber-400 bg-amber-500/30 text-amber-300 backdrop-blur-xl text-xs font-mono font-black shadow-2xl flex items-center gap-2 active:scale-95"
          >
            <Ikon nom={qolIdish ? "past" : "kolba"} olcham={14} />
            <span>{qolIdish ? "Stolga qo'yish" : `Qo'lga olish: ${qaralganIdish?.userData?.nom || qaralganIdish?.userData?.kalit || "Idish"}`}</span>
          </button>

          {qolIdish && qaralganIdish && qaralganIdish !== qolIdish && (
            <>
              <button
                type="button"
                onClick={() => typeof onQuyish === "function" && onQuyish()}
                className="px-4 py-2.5 rounded-2xl border border-emerald-400 bg-emerald-500/30 text-emerald-300 backdrop-blur-xl text-xs font-mono font-black shadow-2xl flex items-center gap-2 active:scale-95"
              >
                <Ikon nom="atom" olcham={14} />
                <span>{qaralganIdish.userData?.nom || qaralganIdish.userData?.kalit || "Idish"}ga quyish</span>
              </button>

              {/* ANIQ DOZA — sensorli qurilmada stexiometriya uchun.
                  Klaviaturada bu 1..5 raqamlari; telefonda esa ilgari
                  UMUMAN yo'q edi va faqat 45 ml quyish mumkin bo'lgani
                  uchun stexiometrik hisob bajarib bo'lmasdi.
                  Ro'yxat `sozlama.js` dagi ANIQ_DOZALAR dan — klaviatura
                  ham o'sha manbadan oziqlanadi. */}
              {typeof onAniqDoza === "function" && (
                <div className="flex items-center gap-1.5 rounded-2xl border border-sky-400/70 bg-slate-950/85 px-2 py-1.5 backdrop-blur-xl shadow-2xl">
                  <span className="text-[10px] font-mono font-bold text-sky-300 pl-0.5">Aniq</span>
                  {ANIQ_DOZALAR.map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => onAniqDoza(ml)}
                      // 44px — barmoq uchun eng kichik ishonchli o'lcham.
                      className="min-w-[44px] min-h-[38px] rounded-xl border border-sky-400/60 bg-sky-500/20 text-sky-200 text-[11px] font-mono font-black active:scale-90 active:bg-sky-400/40"
                    >
                      {ml}
                    </button>
                  ))}
                  <span className="text-[10px] font-mono text-slate-400 pr-0.5">ml</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ─── O'NG ZONA: KAMERA BURISH PANEL (TOUCH TO LOOK) ─── */}
      <div
        className="pointer-events-auto absolute top-16 right-0 bottom-16 w-1/2 touch-none"
        onTouchStart={handleRightTouchStart}
        onTouchMove={handleRightTouchMove}
        onTouchEnd={handleRightTouchEnd}
        onTouchCancel={handleRightTouchEnd}
      >
        <div className="absolute right-4 bottom-8 px-3 py-1.5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md text-[10px] font-mono text-white/50">
          👆 Atrofga qarash uchun suring
        </div>
      </div>
    </div>
  );
}
