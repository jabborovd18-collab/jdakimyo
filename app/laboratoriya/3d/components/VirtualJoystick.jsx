"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Ikon from "@/components/Ikon";

/**
 * PUBG MOBILE USLUBIDAGI DUAL SENSORLI ANALOG JOYSTIK.
 * Chapda 360° Analog Joystik (Harakat), O'ngda Kamera Burish Paneli (Look Area).
 */
export default function VirtualJoystick({ onHarakat, onBurilish, onSprintToggle }) {
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [joystickAktiv, setJoystickAktiv] = useState(false);
  const [sprintAktiv, setSprintAktiv] = useState(false);

  const baseRef = useRef(null);
  const touchIdRef = useRef(null);
  const rightTouchIdRef = useRef(null);
  const rightLastPosRef = useRef({ x: 0, y: 0 });

  const RADIUS = 45; // Joystik maksimal harakat radiusi px

  // 1. CHAP TOMON: ANALOG JOYSTIK HODISALARI
  const handleJoystickTouchStart = (e) => {
    const touch = e.changedTouches[0];
    if (!touch || !baseRef.current) return;

    touchIdRef.current = touch.identifier;
    setJoystickAktiv(true);
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e) => {
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
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setJoystickAktiv(false);
        setKnobPos({ x: 0, y: 0 });
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

    setKnobPos({ x: normX, y: normY });

    const vectorX = normX / RADIUS; // -1 .. +1 (Left / Right)
    const vectorZ = normY / RADIUS; // -1 .. +1 (Forward / Backward)
    const isSprint = distance >= RADIUS * 0.9 || sprintAktiv;

    if (typeof onHarakat === "function") {
      onHarakat(vectorX, vectorZ, isSprint);
    }
  };

  // 2. O'NG TOMON: KAMERA BURISH (LOOK / AIM AREA)
  const handleRightTouchStart = (e) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    rightTouchIdRef.current = touch.identifier;
    rightLastPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleRightTouchMove = (e) => {
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
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === rightTouchIdRef.current) {
        rightTouchIdRef.current = null;
        break;
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none overflow-hidden">
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
          className={`relative w-28 h-28 rounded-full border-2 transition-colors flex items-center justify-center backdrop-blur-md shadow-2xl ${
            joystickAktiv
              ? "border-[var(--v3-urgu)] bg-[var(--v3-urgu)]/15"
              : "border-white/25 bg-black/40"
          }`}
        >
          {/* O'rta nuqta */}
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />

          {/* Harakatlanuvchi Joystik Boshchasi (Knob) */}
          <div
            className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 shadow-xl border-2 border-white flex items-center justify-center transition-transform duration-75"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          >
            <div className="w-4 h-4 rounded-full bg-black/30" />
          </div>
        </div>
      </div>

      {/* Sprint Tugmasi */}
      <button
        type="button"
        onClick={() => {
          setSprintAktiv(!sprintAktiv);
          if (typeof onSprintToggle === "function") onSprintToggle(!sprintAktiv);
        }}
        className={`pointer-events-auto absolute bottom-44 left-10 p-2.5 rounded-2xl border text-xs font-mono font-bold transition-all shadow-xl ${
          sprintAktiv
            ? "bg-[var(--v3-urgu)] text-[var(--v3-urgu-matn)] border-[var(--v3-urgu)]"
            : "bg-black/40 text-white/70 border-white/20 backdrop-blur-md"
        }`}
      >
        ⚡ SPRINT
      </button>

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
