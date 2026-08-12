"use client";

import { useState } from "react";
import MasalaKiritish from "./components/MasalaKiritish.jsx";
import YechimPaneli from "./components/YechimPaneli.jsx";

export default function MasalaSahifasi() {
  const [natija, setNatija] = useState(null);
  const [yuklanmoqda, setYuklanmoqda] = useState(false);
  const [xato, setXato] = useState(null);

  const handleYechish = async (masalaMatni) => {
    try {
      setYuklanmoqda(true);
      setXato(null);

      const res = await fetch("/api/masala/yech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ masalaMatni }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.xato || "Masalani yechishda xatolik yuz berdi.");
      }

      setNatija(data);
    } catch (err) {
      setXato(err.message);
    } finally {
      setYuklanmoqda(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full p-4 sm:p-6 md:p-8"
      style={{
        background: "var(--v3-fon)",
        color: "var(--v3-matn)",
      }}
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-6">
        {/* Navigation & Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--v3-chiziq)" }}>
          <div>
            <div className="flex items-center gap-2">
              <a href="/oquv" className="v3-xira hover:underline text-xs">
                ← Ta&apos;lim Bo&apos;limiga qaytish
              </a>
              <span className="v3-xira text-xs">/</span>
              <span className="text-xs font-bold text-amber-400">Masalalar Bo&apos;limi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              🧪 AI Kimyoviy Masalalar Yechuvchisi
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1 text-xs font-bold text-amber-400">
              🎙️ Ovozli Tushuntirish Bilan
            </span>
          </div>
        </header>

        {/* Error Notification */}
        {xato && (
          <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-xs font-bold text-red-400">
            ⚠️ {xato}
          </div>
        )}

        {/* Main Category Cards & Input Form */}
        <MasalaKiritish onYechish={handleYechish} yuklanmoqda={yuklanmoqda} />

        {/* Solution Breakdown Section */}
        {natija && <YechimPaneli natija={natija} />}
      </div>
    </div>
  );
}
