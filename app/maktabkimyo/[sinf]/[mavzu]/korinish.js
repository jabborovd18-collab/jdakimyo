"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { sinfHavolasi } from "@/lib/fanlar"
import Ikon from "@/components/Ikon"

function DarsYuklanmoqda() {
  return <div className="p-8 text-center text-sm text-blue-200/80">Dars yuklanmoqda...</div>
}

// Nega dynamic: oddiy import bilan bitta dars ochilganda 22 ta darsning hammasi
// yuklanardi. import() yo'li matn bo'lishi shart, shuning uchun ro'yxat qo'lda yozilgan.
const DARSLAR = {
  "7:1-1": dynamic(() => import("@/components/maktab/Mavzu1_1"), { loading: DarsYuklanmoqda }),
  "7:1-2": dynamic(() => import("@/components/maktab/Mavzu1_2"), { loading: DarsYuklanmoqda }),
  "7:1-3": dynamic(() => import("@/components/maktab/Mavzu1_3"), { loading: DarsYuklanmoqda }),
  "7:1-4": dynamic(() => import("@/components/maktab/Mavzu1_4"), { loading: DarsYuklanmoqda }),
  "7:1-5": dynamic(() => import("@/components/maktab/Mavzu1_5"), { loading: DarsYuklanmoqda }),
  "7:2-1": dynamic(() => import("@/components/maktab/Mavzu2_1"), { loading: DarsYuklanmoqda }),
  "7:2-2": dynamic(() => import("@/components/maktab/Mavzu2_2"), { loading: DarsYuklanmoqda }),
  "7:3-1": dynamic(() => import("@/components/maktab/Mavzu3_1"), { loading: DarsYuklanmoqda }),
  "7:3-2": dynamic(() => import("@/components/maktab/Mavzu3_2"), { loading: DarsYuklanmoqda }),
  "7:3-3": dynamic(() => import("@/components/maktab/Mavzu3_3"), { loading: DarsYuklanmoqda }),
  "7:3-4": dynamic(() => import("@/components/maktab/Mavzu3_4"), { loading: DarsYuklanmoqda }),
  "7:3-5": dynamic(() => import("@/components/maktab/Mavzu3_5"), { loading: DarsYuklanmoqda }),
  "7:3-6": dynamic(() => import("@/components/maktab/Mavzu3_6"), { loading: DarsYuklanmoqda }),
  "7:3-7": dynamic(() => import("@/components/maktab/Mavzu3_7"), { loading: DarsYuklanmoqda }),
  "7:4-1": dynamic(() => import("@/components/maktab/Mavzu4_1"), { loading: DarsYuklanmoqda }),
  "7:4-2": dynamic(() => import("@/components/maktab/Mavzu4_2"), { loading: DarsYuklanmoqda }),
  "7:4-3": dynamic(() => import("@/components/maktab/Mavzu4_3"), { loading: DarsYuklanmoqda }),
  "7:5-1": dynamic(() => import("@/components/maktab/Mavzu5_1"), { loading: DarsYuklanmoqda }),
  "7:5-2": dynamic(() => import("@/components/maktab/Mavzu5_2"), { loading: DarsYuklanmoqda }),
  "7:5-3": dynamic(() => import("@/components/maktab/Mavzu5_3"), { loading: DarsYuklanmoqda }),
  "7:5-4": dynamic(() => import("@/components/maktab/Mavzu5_4"), { loading: DarsYuklanmoqda }),
  "7:5-5": dynamic(() => import("@/components/maktab/Mavzu5_5"), { loading: DarsYuklanmoqda }),
  "7:6-1": dynamic(() => import("@/components/maktab/Mavzu6_1"), { loading: DarsYuklanmoqda }),
  "7:6-2": dynamic(() => import("@/components/maktab/Mavzu6_2"), { loading: DarsYuklanmoqda }),
  "7:6-3": dynamic(() => import("@/components/maktab/Mavzu6_3"), { loading: DarsYuklanmoqda }),
  "7:6-4": dynamic(() => import("@/components/maktab/Mavzu6_4"), { loading: DarsYuklanmoqda }),
  "7:6-5": dynamic(() => import("@/components/maktab/Mavzu6_5"), { loading: DarsYuklanmoqda }),
  "7:tayanch-tushunchalar": dynamic(() => import("@/components/maktab/Mavzu7_1"), { loading: DarsYuklanmoqda }),
  "8:1": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu1"), { loading: DarsYuklanmoqda }),
  "8:2": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu2"), { loading: DarsYuklanmoqda }),
  "8:3": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu3"), { loading: DarsYuklanmoqda }),
  "8:4": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu4"), { loading: DarsYuklanmoqda }),
  "8:5": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu5"), { loading: DarsYuklanmoqda }),
  "8:6": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu6"), { loading: DarsYuklanmoqda }),
  "8:7": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu7"), { loading: DarsYuklanmoqda }),
  "8:8": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu8"), { loading: DarsYuklanmoqda }),
  "8:9": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu9"), { loading: DarsYuklanmoqda }),
  "8:10": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu10"), { loading: DarsYuklanmoqda }),
  "8:11": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu11"), { loading: DarsYuklanmoqda }),
  "8:12": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu12"), { loading: DarsYuklanmoqda }),
  "8:13": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu13"), { loading: DarsYuklanmoqda }),
  "8:14": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu14"), { loading: DarsYuklanmoqda }),
  "8:15": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu15"), { loading: DarsYuklanmoqda }),
  "8:16": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu16"), { loading: DarsYuklanmoqda }),
  "8:17": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu17"), { loading: DarsYuklanmoqda }),
  "8:18": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu18"), { loading: DarsYuklanmoqda }),
  "8:19": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu19"), { loading: DarsYuklanmoqda }),
  "8:20": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu20"), { loading: DarsYuklanmoqda }),
  "8:21": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu21"), { loading: DarsYuklanmoqda }),
  "8:22": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu22"), { loading: DarsYuklanmoqda }),
  "8:23": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu23"), { loading: DarsYuklanmoqda }),
  "8:24": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu24"), { loading: DarsYuklanmoqda }),
  "8:25": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu25"), { loading: DarsYuklanmoqda }),
  "8:26": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu26"), { loading: DarsYuklanmoqda }),
  "8:27": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu27"), { loading: DarsYuklanmoqda }),
  "8:28": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu28"), { loading: DarsYuklanmoqda }),
  "8:29": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu29"), { loading: DarsYuklanmoqda }),
  "8:30": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu30"), { loading: DarsYuklanmoqda }),
  "8:31": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu31"), { loading: DarsYuklanmoqda }),
  "8:32": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu32"), { loading: DarsYuklanmoqda }),
  "8:33": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu33"), { loading: DarsYuklanmoqda }),
  "8:34": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu34"), { loading: DarsYuklanmoqda }),
  "8:35": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu35"), { loading: DarsYuklanmoqda }),
  "8:36": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu36"), { loading: DarsYuklanmoqda }),
  "8:37": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu37"), { loading: DarsYuklanmoqda }),
  "8:38": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu38"), { loading: DarsYuklanmoqda }),
  "8:39": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu39"), { loading: DarsYuklanmoqda }),
  "8:40": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu40"), { loading: DarsYuklanmoqda }),
  "8:41": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu41"), { loading: DarsYuklanmoqda }),
  "8:42": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu42"), { loading: DarsYuklanmoqda }),
  "8:43": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu43"), { loading: DarsYuklanmoqda }),
  "8:44": dynamic(() => import("@/components/maktab/8sinf/S8Mavzu44"), { loading: DarsYuklanmoqda }),
  "8:laboratoriya-ishlari": dynamic(() => import("@/components/maktab/8sinf/S8LabIshlari"), { loading: DarsYuklanmoqda }),
}

export default function MavzuKorinish({
  sinf,
  mavzu,
}) {
  const Dars = DARSLAR[`${sinf.sinf}:${mavzu.slug}`]

  return (
    <main
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="min-h-screen flex flex-col font-serif bg-[#04091e] text-white relative overflow-x-hidden touch-manipulation"
    >
      {/* Yengil fon yorug'ligi (Smart-doskada animatsiya unumdorligini saqlash uchun) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.16),transparent_65%)] pointer-events-none" />

      {/* ─── 1. IXCHAM SMART-DOSKA SARLAVHASI ─── */}
      <header className="border-b border-blue-900/60 bg-[#060b24]/95 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href={sinfHavolasi(sinf.sinf)}
              className="min-w-[44px] min-h-[44px] rounded-xl border border-blue-800/70 bg-[#0b1437]/80 hover:border-yellow-400/60 hover:bg-[#102054] text-blue-100 hover:text-white transition flex items-center justify-center shrink-0 touch-manipulation"
              title="Mavzular ro'yxatiga qaytish"
            >
              <Ikon nom="chap" olcham={20} />
            </Link>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xs sm:text-sm px-3 py-1 rounded-lg border border-yellow-500/50 bg-yellow-500/15 text-yellow-300 font-bold shrink-0">
                {mavzu.raqam}
              </span>
              <h1 className="text-base sm:text-xl font-bold text-white truncate">
                {mavzu.nom}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={sinfHavolasi(sinf.sinf)}
              className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-blue-800/70 bg-[#09153a]/80 hover:border-yellow-400/60 hover:bg-[#0c1f54] text-blue-100 hover:text-white transition hidden sm:inline-flex items-center gap-1.5 touch-manipulation"
            >
              <Ikon nom="kitob" olcham={15} />
              <span>Mavzular</span>
            </Link>
            <Link
              href="/"
              className="min-h-[40px] px-4 py-2 text-xs sm:text-sm rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold transition shadow-md shadow-yellow-500/20 inline-flex items-center touch-manipulation"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 2. KENG SMART-DOSKA ISHCHI MAYDONI ─── */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 py-2.5 sm:py-4 flex-1 w-full relative z-10">
        {Dars ? (
          <section className="w-full">
            <Dars />
          </section>
        ) : (
          <section className="p-8 sm:p-10 rounded-3xl border border-amber-500/40 bg-[#091234]/85 text-center space-y-4 shadow-2xl max-w-2xl mx-auto my-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-xs font-bold text-amber-300">
              <Ikon nom="qulf" olcham={13} />
              <span>Tayyorlanmoqda • {mavzu.sahifa}-bet</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {mavzu.raqam}. {mavzu.nom}
            </h3>
            <p className="text-sm sm:text-base text-blue-200/80">
              Ushbu mavzuning Smart doska ko&apos;rgazmalari va interaktiv o&apos;yinlari darslik asosida tayyorlanmoqda.
            </p>
            <div className="pt-2">
              <Link
                href={sinfHavolasi(sinf.sinf)}
                className="min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-bold text-sm sm:text-base inline-flex items-center gap-2 hover:brightness-110 transition touch-manipulation"
              >
                <Ikon nom="chap" olcham={16} />
                <span>{sinf.sinf}-sinf mavzulariga qaytish</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}