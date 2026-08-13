"use client";

import { useEffect, useState } from "react";
import Ikon from "@/components/Ikon";

/**
 * MOBIL VA PLANSHETLARDA EKRANNI GORIZONTAL (LANDSCAPE) BURISH BILDIRISHNOMASI.
 * Tik holatda (portrait) 3D zal siqilib qolmasligi va to'liq CS/PUBG muhitini ta'minlash uchun.
 */
export default function MobilOgohlantirish() {
  const [tikHolat, setTikHolat] = useState(false);
  const [yopilgan, setYopilgan] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const holatniTekshir = () => {
      const isMobile = window.innerWidth < 1024 || "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isPortrait = window.innerHeight > window.innerWidth;
      setTikHolat(isMobile && isPortrait);
    };

    holatniTekshir();
    window.addEventListener("resize", holatniTekshir);
    window.addEventListener("orientationchange", holatniTekshir);

    return () => {
      window.removeEventListener("resize", holatniTekshir);
      window.removeEventListener("orientationchange", holatniTekshir);
    };
  }, []);

  const handleGorizontalgaOtish = async () => {
    if (typeof window === "undefined") return;

    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
      }
    } catch (e) {
      // Ba'zi brauzerlar ruxsat bermasligi mumkin
    }
    setYopilgan(true);
  };

  if (!tikHolat || yopilgan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl border border-[var(--v3-urgu)] bg-[var(--v3-fon-2)] text-[var(--v3-matn)] p-6 sm:p-7 text-center space-y-5 shadow-2xl">
        {/* Animated Rotating Phone Graphic */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-[var(--v3-urgu)] animate-spin" style={{ animationDuration: "6s" }} />
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
            📱
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="v3-nishon text-[var(--v3-urgu)]">3D Kinematik Tajriba</div>
          <h3 className="text-lg font-black text-[var(--v3-matn)]">
            Telefoningizni Yonboshga Burang
          </h3>
          <p className="text-xs text-[var(--v3-xira)] leading-relaxed">
            3D Virtual laboratoriyada to{"'"}liq atmosferani his qilish, keng formatli stendlar va dual-joystik qulayligi uchun telefonni gorizontal (landscape) holatda ushlang.
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={handleGorizontalgaOtish}
            className="v3-tugma v3-tugma-asosiy w-full justify-center text-xs py-3 font-bold inline-flex items-center gap-2 shadow-lg"
          >
            <span>🔄 Ekranni gorizontal burish</span>
          </button>

          <button
            type="button"
            onClick={() => setYopilgan(true)}
            className="v3-tugma w-full justify-center text-xs py-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            Tik holatda davom etish
          </button>
        </div>
      </div>
    </div>
  );
}
