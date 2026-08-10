"use client";

import { useEffect, useState } from "react";

// WebGL kontekst olib bo'ladimi-yo'qmi aniqlaydigan yordamchi funksiya.
// Nega: ba'zi telefonlarda grafik karta WebGL 2.0 ni ko'tarmasa, 3D sahifasi oq ekran bo'lib qoladi.
function webglMavjudmi() {
  if (typeof window === "undefined" || typeof document === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

// Mobil qurilma yoki kuchsiz apparat taqdimo'ti uchun ogohlantirish modali.
// Nega localStorage da eslab qolinadi: foydalanuvchi "Baribir ochish" ni tanlasa,
// har safar sahifani ochganida modal ko'rinib uni bezovta qilmasligi shart.
export default function MobilOgohlantirish() {
  const [korsat, setKorsat] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Avvalgi tanlov saqlanganmi tekshiramiz
    const saqlanganTanlov = localStorage.getItem("3d-lab-mobil-tanlov");
    if (saqlanganTanlov === "baribir") {
      return;
    }

    const kichikEkran = window.innerWidth < 768;
    const pastYadro = (navigator.hardwareConcurrency || 8) <= 4;
    const pastXotira = (navigator.deviceMemory || 8) <= 4;
    const webglYoq = !webglMavjudmi();

    if (kichikEkran || pastYadro || pastXotira || webglYoq) {
      setKorsat(true);
    }
  }, []);

  const handleBaribirOchish = () => {
    try {
      localStorage.setItem("3d-lab-mobil-tanlov", "baribir");
    } catch (e) {
      // LocalStorage yopiq bo'lsa xato bermasligi uchun xavfsiz blok
    }
    setKorsat(false);
  };

  const handleOddiygaOtish = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/laboratoriya";
    }
  };

  if (!korsat) return null;

  return (
    <div className="v3-parda fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="v3-modal">
        <h3 className="text-lg font-bold" style={{ color: "var(--v3-urgu)" }}>
          Diqqat: Kuchli qurilma talab etiladi
        </h3>
        <p className="v3-xira mt-3 text-sm leading-relaxed">
          Bu sahifa kuchli qurilma talab qiladi. Oddiy laboratoriya har qanday telefonda ishlaydi.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleBaribirOchish} className="v3-tugma justify-center">
            Baribir ochish
          </button>
          <button
            type="button"
            onClick={handleOddiygaOtish}
            className="v3-tugma-asosiy justify-center"
          >
            Oddiy laboratoriyaga o&apos;tish
          </button>
        </div>
      </div>
    </div>
  );
}