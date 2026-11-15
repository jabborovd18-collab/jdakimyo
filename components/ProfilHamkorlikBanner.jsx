// components/ProfilHamkorlikBanner.jsx
"use client"

import Link from "next/link"
import Ikon from "@/components/Ikon"

export default function ProfilHamkorlikBanner() {
  return (
    <div className="v3-panel-karta relative overflow-hidden rounded-2xl sm:rounded-3xl border-[var(--v3-urgu)]/35 bg-[var(--v3-yuza-2)] p-4 sm:p-6">
      {/* Orqa fon nurlari */}
      <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[var(--v3-urgu)]/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full bg-[var(--v3-urgu-2)]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-5">
        {/* Chap qism: Belgilar va ma'lumot */}
        <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[var(--v3-fon-2)] border border-[var(--v3-urgu)]/40 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 shadow-md mt-0.5">
            <Ikon nom="sertifikat" olcham={22} />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="v3-tag v3-tag-yopiq text-[11px] font-bold uppercase tracking-wide">
                <Ikon nom="atom" olcham={12} />
                <span>Milliy Sertifikat &amp; Rasch IRT</span>
              </span>
              <span className="text-xs font-semibold text-[var(--v3-urgu-2)] flex items-center gap-1 font-mono">
                <Ikon nom="tasdiq" olcham={12} />
                <span>Tayyorgarlik sinovi</span>
              </span>
            </div>

            <h3 className="text-base sm:text-xl font-bold text-[var(--v3-matn)] tracking-tight leading-snug">
              Kimyodan Milliy Sertifikatga Tayyorgarlik
            </h3>

            <p className="text-xs sm:text-sm text-[var(--v3-xira)] leading-relaxed max-w-2xl">
              Milliy sertifikat formatidagi 40 ta savol: Georg Rasch modeli (&theta; logiti), Wright Map
              shkalasi, ochiq hisoblash topshiriqlari va taxminiy daraja.
            </p>
          </div>
        </div>

        {/* O'ng qism: Harakat tugmalari */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 pt-1 lg:pt-0">
          <Link
            href="/milliy-sertifikat"
            className="v3-tugma-asosiy justify-center py-2.5 px-5 text-xs font-extrabold rounded-xl"
          >
            <Ikon nom="chaqmoq" olcham={14} />
            <span>Bo&apos;limga O&apos;tish</span>
            <Ikon nom="ong" olcham={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}
