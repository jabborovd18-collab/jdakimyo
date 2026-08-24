"use client";

import Link from "next/link";

import Ikon from "@/components/Ikon";

// EKRAN USTIDAGI HUD — yuqori burchaklar va markaziy nishoncha.
//
// `korinish.js` dan ajratildi (BRIF-05).
//
// Ichida holat yo'q: hamma qiymat tashqaridan keladi va har tugma
// tashqaridagi funksiyani chaqiradi. Shuning uchun HUD ni o'zgartirish
// laboratoriya mantig'iga tegmaydi — va aksincha.
//
// Nishoncha (crosshair) va yuqori panel bitta faylda, chunki ikkalasi
// ham "o'yinchi hozir nimani ko'ryapti" degan savolga javob beradi:
// biri holatni, ikkinchisi nishonni.

export default function LabHud({
  ISH,
  harorat,
  tarozidagiIdish,
  kozoynakTaqilgan,
  gazNiqobiTaqilgan,
  sezgirlik,
  sezgirlikniOzgartir,
  yorliqlarYoqilgan,
  yorliqlarniAlmashtir,
  ovozYoqilgan,
  setOvozYoqilgan,
  setMashgulotOchilgan,
  setYordamOchilgan,
  fpsKontekstMatn,
  fpsKontekstTuri,
  qarashRejimi,
  qarashXabari,
}) {
  return (
    <>
      {/* --- SLEEK MINIMAL CYBER-HUD (YUQORI BURCHAKLAR) --- */}
      {/* Yuqori chap: Brend va Rejim */}
      <div className="absolute top-3 left-4 z-30 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400">
            JDA KIMYO · 3D LAB
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>{harorat}°C</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${tarozidagiIdish ? "bg-emerald-400" : "bg-slate-500"}`} />
            <span>{tarozidagiIdish ? "Tarozi band" : "Tarozi bo'sh"}</span>
          </span>
          {kozoynakTaqilgan && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400 font-bold">🥽 Ko{"'"}zoynak</span>
            </>
          )}
          {gazNiqobiTaqilgan && (
            <>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold">🎭 Respirator</span>
            </>
          )}
        </div>
      </div>

      {/* Yuqori o'ng: 3 ta Minimalist Favqulodda Tugmalar */}
      <div className="absolute top-3 right-4 z-30 flex items-center gap-2">
        {/* Sezgirlik sozlagichi */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-2xl backdrop-blur-md text-[10px] font-mono">
          <span className="text-slate-400">Sezgirlik:</span>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={sezgirlik}
            onChange={(e) => sezgirlikniOzgartir(e.target.value)}
            className="w-14 accent-cyan-400 cursor-pointer h-1"
            title="Sichqoncha sezgirligi"
          />
          <span className="font-bold text-cyan-400">{sezgirlik.toFixed(1)}x</span>
        </div>

        {/* O'rganuvchi rejimidagi 3D yorliqlar */}
        <button
          type="button"
          onClick={() => yorliqlarniAlmashtir()}
          aria-pressed={yorliqlarYoqilgan}
          className={`h-8 px-2.5 rounded-xl flex items-center gap-1.5 border shadow-lg backdrop-blur-md transition-all bg-[var(--v3-yuza)] border-[var(--v3-chiziq)] ${
            yorliqlarYoqilgan
              ? "text-[var(--v3-urgu)]"
              : "text-[var(--v3-xira)] opacity-70"
          }`}
          title="3D jihoz yorliqlarini yoqish / o'chirish"
        >
          <Ikon nom={yorliqlarYoqilgan ? "belgi" : "taqiq"} olcham={13} />
          <span className="text-[10px] font-mono font-bold">Yorliqlar</span>
        </button>

        {/* Ovoz tugmasi */}
        <button
          type="button"
          onClick={() => setOvozYoqilgan(!ovozYoqilgan)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-lg backdrop-blur-md transition-all ${
            ovozYoqilgan
              ? "bg-slate-950/80 border-slate-800 text-cyan-400 hover:border-cyan-400"
              : "bg-red-950/60 border-red-800 text-red-400"
          }`}
          title="Ovozni yoqish / o'chirish (M)"
        >
          <Ikon nom={ovozYoqilgan ? "kanal" : "taqiq"} olcham={14} />
        </button>

        {/* Amaliy mashg'ulot tugmasi.
            ILGARI BU TUGMA YO'Q EDI: `AmaliyMashgulotModal` yozilgan,
            lekin uni hech kim chaqirmasdi — ya'ni butun amaliy
            mashg'ulotlar tizimi ochib bo'lmaydigan holatda edi. */}
        <button
          type="button"
          onClick={() => setMashgulotOchilgan(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-amber-400 hover:border-amber-400 backdrop-blur-md flex items-center gap-1.5 transition-all"
          title="Amaliy mashg'ulotlar"
        >
          <Ikon nom="quiz" olcham={13} />
          <span>Mashg{"'"}ulot</span>
        </button>

        {/* Yordam & Boshqaruv qo'llanmasi tugmasi */}
        <button
          type="button"
          onClick={() => setYordamOchilgan(true)}
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-emerald-400 hover:border-emerald-400 backdrop-blur-md flex items-center gap-1.5 transition-all"
          title={ISH.qollanmaSarlavha}
        >
          <Ikon nom="kitob" olcham={13} />
          <span>{ISH.qollanma}</span>
        </button>

        {/* 2D Labga qaytish / Chiqish */}
        <Link
          href="/laboratoriya"
          className="px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 shadow-lg text-[11px] font-mono font-bold text-slate-300 hover:text-white hover:border-slate-600 backdrop-blur-md flex items-center gap-1 transition-all"
          title="2D Laboratoriyaga qaytish (ESC)"
        >
          <Ikon nom="chap" olcham={12} />
          <span>2D Lab</span>
        </Link>
      </div>

      {/* --- EKRAN MARKAZIDAGI CROSSHAIR VA JISMONIY CYBER-HUD PROMPT --- */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center z-20">
        {/* Markaziy nishoncha (Crosshair) */}
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
            fpsKontekstMatn
              ? "bg-cyan-400 scale-150 shadow-[0_0_14px_#38bdf8] ring-2 ring-cyan-300/40"
              : "bg-white/80 scale-100 shadow-[0_0_8px_#ffffff]"
          }`}
        />

        {qarashXabari && (
          <div className="mt-3 px-3 py-1 rounded-lg border border-amber-400/60 bg-slate-950/90 text-amber-200 text-[10px] font-mono font-bold shadow-lg backdrop-blur-md">
            {qarashXabari}
            {qarashRejimi === "zaxira" ? " · zaxira" : ""}
          </div>
        )}

        {/* Dinamik In-World Kontekst Yordamchisi */}
        {fpsKontekstMatn && (
          <div
            className={`mt-4 px-3.5 py-1.5 rounded-xl border font-mono text-xs font-bold backdrop-blur-xl shadow-2xl animate-in fade-in zoom-in-95 duration-100 flex items-center gap-2 ${
              fpsKontekstTuri === "urgu"
                ? "bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                : fpsKontekstTuri === "yuvish"
                ? "bg-sky-950/90 border-sky-400 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                : fpsKontekstTuri === "quyish"
                ? "bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                : fpsKontekstTuri === "olish"
                ? "bg-purple-950/90 border-purple-400 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                : "bg-slate-950/90 border-slate-700 text-slate-200"
            }`}
          >
            <span>{fpsKontekstMatn}</span>
          </div>
        )}
      </div>
    </>
  );
}
