// app/admin/jdakimyo-ai/page.js
//
// JDA KIMYO AI — SUPER ADMIN TEXNIK KO'RIK VA DIAGNOSTIKA PANELI (v4.0.0)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function JdaKimyoAiAdminPage() {
  const [boshlangichYuklandi, setBoshlangichYuklandi] = useState(false);
  const [korikYuklanmoqda, setKorikYuklanmoqda] = useState(false);
  const [boshlangichMalumot, setBoshlangichMalumot] = useState(null);
  const [korikNatija, setKorikNatija] = useState(null);

  // Jonli sinov prompti
  const [testPrompt, setTestPrompt] = useState(
    "200 g 10% li NaCl eritmasiga 50 g suv qo'shildi. Yangi hosil bo'lgan eritmaning foiz konsentratsiyasini toping."
  );

  const yuklaMalumot = async () => {
    try {
      const res = await fetch("/api/admin/jdakimyo-ai");
      const data = await res.json();
      if (!res.ok) throw new Error(data.xato || "Yuklab bo'lmadi");
      setBoshlangichMalumot(data);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBoshlangichYuklandi(true);
    }
  };

  useEffect(() => {
    yuklaMalumot();
  }, []);

  const otkazKorik = async () => {
    setKorikYuklanmoqda(true);
    try {
      toast.loading("AI provayderlari texnik ko'rikdan o'tkazilmoqda...", { id: "ai-korik" });
      const res = await fetch("/api/admin/jdakimyo-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "korik",
          testPrompt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.xato || "Ko'rikda xatolik yuz berdi");

      setKorikNatija(data.hisobot);
      toast.success("Texnik ko'rik muvaffaqiyatli yakunlandi!", { id: "ai-korik" });
    } catch (e) {
      toast.error("Ko'rik xatosi: " + e.message, { id: "ai-korik" });
    } finally {
      setKorikYuklanmoqda(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── YUQORI SARLAVHA ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-800/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[11px] font-extrabold uppercase tracking-wider">
              👑 Faqat Super Admin
            </span>
            <span className="text-xs text-purple-400 font-mono">/admin/jdakimyo-ai</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2 mt-1">
            <span>🧠 JDA Kimyo AI — Texnik Ko&apos;rik & Diagnostika</span>
          </h1>
          <p className="text-xs text-purple-300 mt-1">
            Barcha ulangan AI API provayderlari (Groq, OpenRouter, Gemini) holati, ping tezligi va real xatolar nazorati.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/masala"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 text-purple-200 text-xs font-bold flex items-center gap-1.5"
          >
            <span>💬 Foydalanuvchi Ko&apos;rinishi</span>
          </Link>

          <button
            type="button"
            onClick={otkazKorik}
            disabled={korikYuklanmoqda}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            <span>{korikYuklanmoqda ? "Tekshirilmoqda..." : "🔍 To'liq Texnik Ko'rik"}</span>
          </button>
        </div>
      </div>

      {/* ─── 1. PROVAYDERLAR KALITLARI VA HOZIRGI HOLAT ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GROQ */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-800/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <strong className="text-sm text-white">⚡ Groq Cloud (120B)</strong>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                korikNatija?.groq?.status === "ok"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : korikNatija?.groq?.status === "error"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : boshlangichMalumot?.provayderlar?.groq?.kalitBormi
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {korikNatija?.groq?.status === "ok"
                ? "🟢 FAOL (200 OK)"
                : korikNatija?.groq?.status === "error"
                ? "🔴 XATOLIK"
                : boshlangichMalumot?.provayderlar?.groq?.kalitBormi
                ? "Kalit bor"
                : "Kalit yo'q"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-purple-300 font-mono">
            <div>
              Kalit:{" "}
              <span className="text-white font-bold">
                {boshlangichMalumot?.provayderlar?.groq?.kalitQisqa || "Yuklanmoqda..."}
              </span>
            </div>
            {korikNatija?.groq && (
              <>
                <div>Javob vaqti: <strong className="text-amber-400">{korikNatija.groq.sarfMs} ms</strong></div>
                <div>Model: <strong className="text-white">{korikNatija.groq.model}</strong></div>
              </>
            )}
          </div>

          {korikNatija?.groq?.xato && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-[11px] text-red-300 font-mono break-words">
              ⚠️ {korikNatija.groq.xato}
            </div>
          )}
        </div>

        {/* OPENROUTER */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-800/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <strong className="text-sm text-white">🌐 OpenRouter (Minimax/Nemotron)</strong>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                korikNatija?.openrouter?.status === "ok"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : korikNatija?.openrouter?.status === "error"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : boshlangichMalumot?.provayderlar?.openrouter?.kalitBormi
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {korikNatija?.openrouter?.status === "ok"
                ? "🟢 FAOL (200 OK)"
                : korikNatija?.openrouter?.status === "error"
                ? "🔴 XATOLIK"
                : boshlangichMalumot?.provayderlar?.openrouter?.kalitBormi
                ? "Kalit bor"
                : "Kalit yo'q"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-purple-300 font-mono">
            <div>
              Kalit:{" "}
              <span className="text-white font-bold">
                {boshlangichMalumot?.provayderlar?.openrouter?.kalitQisqa || "Yuklanmoqda..."}
              </span>
            </div>
            {korikNatija?.openrouter && (
              <>
                <div>Javob vaqti: <strong className="text-amber-400">{korikNatija.openrouter.sarfMs} ms</strong></div>
                <div>Model: <strong className="text-white">{korikNatija.openrouter.model}</strong></div>
              </>
            )}
          </div>

          {korikNatija?.openrouter?.xato && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-[11px] text-red-300 font-mono break-words">
              ⚠️ {korikNatija.openrouter.xato}
            </div>
          )}
        </div>

        {/* GEMINI */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-purple-800/40 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <strong className="text-sm text-white">✨ Google Gemini (2.0 Flash)</strong>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                korikNatija?.gemini?.status === "ok"
                  ? "bg-green-500/20 text-green-400 border border-green-500/40"
                  : korikNatija?.gemini?.status === "error"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : boshlangichMalumot?.provayderlar?.gemini?.kalitBormi
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {korikNatija?.gemini?.status === "ok"
                ? "🟢 FAOL (200 OK)"
                : korikNatija?.gemini?.status === "error"
                ? "🔴 XATOLIK"
                : boshlangichMalumot?.provayderlar?.gemini?.kalitBormi
                ? "Kalit bor"
                : "Kalit yo'q"}
            </span>
          </div>

          <div className="text-xs space-y-1 text-purple-300 font-mono">
            <div>
              Kalit:{" "}
              <span className="text-white font-bold">
                {boshlangichMalumot?.provayderlar?.gemini?.kalitQisqa || "Yuklanmoqda..."}
              </span>
            </div>
            {korikNatija?.gemini && (
              <>
                <div>Javob vaqti: <strong className="text-amber-400">{korikNatija.gemini.sarfMs} ms</strong></div>
                <div>Model: <strong className="text-white">{korikNatija.gemini.model}</strong></div>
              </>
            )}
          </div>

          {korikNatija?.gemini?.xato && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800/60 text-[11px] text-red-300 font-mono break-words">
              ⚠️ {korikNatija.gemini.xato}
            </div>
          )}
        </div>
      </div>

      {/* ─── 2. JONLI SINOV PROMPTI (TEST RUNNER) ─── */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-800/40 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>🧪 Jonli Diagnostika va Sinov Maydoni</span>
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-purple-300">
            Sinov uchun masala yoki prompt matni:
          </label>
          <textarea
            rows={2}
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-black/50 border border-purple-800/40 text-white text-xs font-sans focus:outline-hidden focus:border-amber-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={otkazKorik}
            disabled={korikYuklanmoqda || !testPrompt.trim()}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
          >
            {korikYuklanmoqda ? "Sinov o'tkazilmoqda..." : "Ushbu Masalani Sinash ➔"}
          </button>
        </div>
      </div>

      {/* ─── 3. JAVOBLAR VA XOM QAYDNOMA (LOGS) ─── */}
      {korikNatija && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-800/40 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📋 Texnik Ko&apos;rik Xom Natijalari (Provayderlar Javoblari)</span>
          </h3>

          <div className="space-y-3 text-xs font-mono">
            {/* Groq javobi */}
            {korikNatija.groq?.javob && (
              <div className="p-4 rounded-2xl bg-black/50 border border-green-500/30 space-y-1">
                <span className="text-green-400 font-bold block">
                  ⚡ Groq ({korikNatija.groq.model}) — {korikNatija.groq.sarfMs} ms:
                </span>
                <p className="text-slate-200 whitespace-pre-wrap">{korikNatija.groq.javob}</p>
              </div>
            )}

            {/* OpenRouter javobi */}
            {korikNatija.openrouter?.javob && (
              <div className="p-4 rounded-2xl bg-black/50 border border-green-500/30 space-y-1">
                <span className="text-green-400 font-bold block">
                  🌐 OpenRouter ({korikNatija.openrouter.model}) — {korikNatija.openrouter.sarfMs} ms:
                </span>
                <p className="text-slate-200 whitespace-pre-wrap">{korikNatija.openrouter.javob}</p>
              </div>
            )}

            {/* Gemini javobi */}
            {korikNatija.gemini?.javob && (
              <div className="p-4 rounded-2xl bg-black/50 border border-green-500/30 space-y-1">
                <span className="text-green-400 font-bold block">
                  ✨ Gemini ({korikNatija.gemini.model}) — {korikNatija.gemini.sarfMs} ms:
                </span>
                <p className="text-slate-200 whitespace-pre-wrap">{korikNatija.gemini.javob}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
