// app/doska/join/page.js
//
// 6 raqamli PIN kod bilan jang xonasiga qo'shilish sahifasi.
// Agar o'quvchining kamerasi ishlamasa yoki QR skaner qilolmasa shu yerdan ulanadi.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Ikon from "@/components/Ikon";

export default function DoskaJoinPage() {
  const [pin, setPin] = useState("");
  const router = useRouter();

  const ulanish = (e) => {
    e.preventDefault();
    const tozalanganPin = pin.trim();
    if (!tozalanganPin) return;
    router.push(`/doska/jang/${tozalanganPin}`);
  };

  return (
    <main className="min-h-[100dvh] p-4 sm:p-6 flex items-center justify-center bg-[#070b14] text-white select-none touch-manipulation">
      <div className="w-full max-w-sm bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <Ikon nom="qulf" olcham={30} />
        </div>
        <h1 className="text-2xl font-black text-white mb-2">Smart Jang PIN kodi</h1>
        <p className="text-xs text-slate-400 mb-6">
          Doskada ko&apos;rsatilgan 6 raqamli PIN kodni kiriting
        </p>

        <form onSubmit={ulanish} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            required
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="Masalan: 482910"
            className="w-full text-center tracking-[0.25em] font-mono text-2xl font-bold py-3.5 px-4 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950/60 transition disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <span>Xonaga Kirish</span>
            <Ikon nom="ong" olcham={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
          <Link href="/doska" className="text-emerald-400 hover:underline inline-flex items-center gap-1">
            <Ikon nom="chap" olcham={14} />
            <span>Smart Doska katalogiga qaytish</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
