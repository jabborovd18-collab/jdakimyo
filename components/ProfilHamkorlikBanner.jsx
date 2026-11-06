// components/ProfilHamkorlikBanner.jsx
"use client"

import Link from "next/link"
import Ikon from "@/components/Ikon"

export default function ProfilHamkorlikBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-r from-[#0b1437]/90 via-[#0e1d4d]/90 to-[#0b1437]/90 p-5 sm:p-6 shadow-xl transition-all hover:border-yellow-400/50 backdrop-blur-md">
      {/* Orqa fon nurlari */}
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-yellow-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-blue-600/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Chap qism: Belgilar va ma'lumot */}
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/40 flex items-center justify-center text-yellow-400 shrink-0 shadow-md mt-0.5">
            <Ikon nom="sertifikat" olcham={24} />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[11px] font-extrabold uppercase tracking-wide">
                <Ikon nom="atom" olcham={12} />
                <span>Milliy Sertifikat &amp; Rasch IRT</span>
              </span>
              <span className="text-xs font-semibold text-blue-300/90 flex items-center gap-1 font-mono">
                <Ikon nom="tasdiq" olcham={12} />
                <span>Tayyorgarlik sinovi</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
              Kimyodan Milliy Sertifikatga Tayyorgarlik
            </h3>

            <p className="text-xs sm:text-sm text-blue-200/85 leading-relaxed max-w-2xl">
              Milliy sertifikat formatidagi 40 ta savol: Georg Rasch modeli (&theta; logiti), Wright Map
              shkalasi, ochiq hisoblash topshiriqlari va taxminiy daraja.
            </p>
          </div>
        </div>

        {/* O'ng qism: Harakat tugmalari */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          <Link
            href="/milliy-sertifikat"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 border border-yellow-300"
          >
            <Ikon nom="chaqmoq" olcham={14} />
            <span>Sinovni Boshlash</span>
            <Ikon nom="ong" olcham={13} />
          </Link>

          <Link
            href="/milliy-sertifikat#mezonlar"
            className="px-4 py-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 text-blue-200 hover:text-white border border-blue-700/50 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Ikon nom="kitob" olcham={14} />
            <span>Darajalar &amp; Mezonlar</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
