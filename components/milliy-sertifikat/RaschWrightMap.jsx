// components/milliy-sertifikat/RaschWrightMap.jsx
"use client"

import { useMemo } from "react"
import Ikon from "@/components/Ikon"

/**
 * Rasch IRT Wright Map (Persona-Savol Xaritasi) va Psixometrik Tahlil komponenti.
 * O'quvchining bilim darajasi (theta) va savollarning qiyinlik logitlarini (b_i)
 * yagona ilmiy shkalada solishtiradi.
 */
export default function RaschWrightMap({
  theta = 0,
  se = 0.35,
  infitMNSQ = 1.0,
  outfitMNSQ = 1.0,
  savollar = [],
  wrightMapData = []
}) {
  // Savollarni qiyinlik logiti bo'yicha saralash (-3.0 dan +3.0 gacha)
  const saralanganSavollar = useMemo(() => {
    return [...wrightMapData].sort((a, b) => b.qiyinlik - a.qiyinlik)
  }, [wrightMapData])

  // Sohalar bo'yicha tahlil (Umumiy kimyo, Anorganik kimyo, Organik kimyo, Kimyoviy hisoblashlar, Eritmalar, Fizik kimyo)
  const sohalarTahlili = useMemo(() => {
    const guruhlar = {}
    savollar.forEach((s, idx) => {
      const soha = s.soha || "Umumiy kimyo"
      if (!guruhlar[soha]) {
        guruhlar[soha] = { jami: 0, togri: 0 }
      }
      guruhlar[soha].jami += 1
      if (wrightMapData[idx]?.togri) {
        guruhlar[soha].togri += 1
      }
    })

    return Object.entries(guruhlar).map(([nom, stat]) => ({
      nom,
      jami: stat.jami,
      togri: stat.togri,
      foiz: Math.round((stat.togri / stat.jami) * 100)
    }))
  }, [savollar, wrightMapData])

  // Moslik (Fit) izohi
  let moslikXulosasi = {
    holat: "A'lo moslashuv",
    rang: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
    izoh: "Javoblaringiz kutilgan qiyinlik darajalariga to'liq mos keladi. Tasodifiy topish yoki e'tiborsizlik deyarli kuzatilmadi."
  }
  if (outfitMNSQ > 1.35) {
    moslikXulosasi = {
      holat: "Tasaddufiy javoblar yoki kutilmagan qiyinchilik",
      rang: "text-amber-400 bg-amber-500/15 border-amber-500/30",
      izoh: "Ayrim oson savollarda noaniqlik yoki juda qiyin savollarda omadli taxminlar mavjudligi ehtimoli bor."
    }
  } else if (infitMNSQ < 0.65) {
    moslikXulosasi = {
      holat: "Haddan tashqari qat'iy javoblar",
      rang: "text-blue-400 bg-blue-500/15 border-blue-500/30",
      izoh: "Javoblar modeli o'ta deterministik. O'quvchi o'z darajasidagi barcha savollarni qat'iy yechgan."
    }
  }

  return (
    <div
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="space-y-6 text-white"
    >
      {/* ─── 1. PSIXOMETRIK KO'RSATKICHLAR KARTASI ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Theta qobiliyati */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121c4b]/80 to-[#0a1438]/80 border border-blue-800/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span>Bilim darajasi (θ)</span>
            <span className="text-yellow-400 font-mono">Logit shkala</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-yellow-300">
            {theta > 0 ? `+${theta}` : theta}
            <span className="text-xs text-blue-300 ml-1">± {se}</span>
          </div>
          <div className="text-[11px] text-blue-300/80 mt-1">
            Standart xatolik: SE = {se} logit
          </div>
        </div>

        {/* Infit MNSQ */}
        <div className="p-4 rounded-2xl bg-[#09153a]/80 border border-blue-800/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span>Ichki moslik (Infit)</span>
            <span className="text-emerald-400 font-mono">MNSQ</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-300">
            {infitMNSQ}
          </div>
          <div className="text-[11px] text-blue-300/80 mt-1">
            Me&apos;yoriy oraliq: 0.70 – 1.30
          </div>
        </div>

        {/* Outfit MNSQ */}
        <div className="p-4 rounded-2xl bg-[#09153a]/80 border border-blue-800/60 shadow-lg">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span>Tashqi moslik (Outfit)</span>
            <span className="text-cyan-400 font-mono">MNSQ</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">
            {outfitMNSQ}
          </div>
          <div className="text-[11px] text-blue-300/80 mt-1">
            Ekstremal savollarga sezgirlik
          </div>
        </div>

        {/* Psixometrik sifat xulosasi */}
        <div className={`p-4 rounded-2xl border ${moslikXulosasi.rang} flex flex-col justify-between`}>
          <div className="text-xs font-semibold uppercase tracking-wider">
            Rasch Validlik Xulosasi
          </div>
          <div className="text-sm font-bold mt-1">
            {moslikXulosasi.holat}
          </div>
          <div className="text-[11px] opacity-90 mt-1 line-clamp-2">
            {moslikXulosasi.izoh}
          </div>
        </div>
      </div>

      {/* ─── 2. WRIGHT MAP (PERSONA-SAVOL XARITASI) ─── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#0e163d]/90 via-[#091336]/90 to-[#04081c]/90 border border-blue-800/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/60 pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
              <Ikon nom="grafik" olcham={14} />
              <span>Georg Rasch Persona-Item Wright Map</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-1">
              Savollar qiyinligi va bilim chegarangiz (Logit)
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> To&apos;g&apos;ri yechilgan
            </span>
            <span className="inline-flex items-center gap-1 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Qiyinchilik tug&apos;dirgan
            </span>
            <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
              ★ Sizning nuqtangiz (θ)
            </span>
          </div>
        </div>

        {/* Gorizontal / Vertikal shkala ko'rinishi */}
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {saralanganSavollar.map((s) => {
            const farq = (theta - s.qiyinlik).toFixed(2)
            const togri = s.togri
            const isNearTheta = Math.abs(theta - s.qiyinlik) <= 0.35

            return (
              <div
                key={s.id}
                className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                  isNearTheta
                    ? "bg-amber-500/15 border-amber-500/40 shadow-md ring-1 ring-amber-400/30"
                    : "bg-blue-950/40 border-blue-900/50 hover:bg-blue-900/30"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      togri
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    }`}
                  >
                    {s.id}
                  </span>

                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {s.mavzu}
                    </div>
                    <div className="text-[11px] text-blue-300/80 flex items-center gap-2">
                      <span>Qiyinlik: <strong className="font-mono">{s.qiyinlik > 0 ? `+${s.qiyinlik}` : s.qiyinlik} logit</strong></span>
                      <span>•</span>
                      <span>Kutilgan ehtimollik: <strong className="font-mono text-cyan-300">{s.ehtimollikFoiz}%</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isNearTheta && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                      Bilim chegarangiz (θ ≈ b)
                    </span>
                  )}
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border ${
                      togri
                        ? "bg-emerald-950/50 border-emerald-800 text-emerald-300"
                        : "bg-rose-950/50 border-rose-800 text-rose-300"
                    }`}
                  >
                    {togri ? "✓ To'g'ri" : "✕ Xato"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── 3. KIMYO SOHALARI BO'YICHA O'ZLASHTIRISH ─── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#09153a]/80 border border-blue-800/60 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Ikon nom="atom" olcham={18} />
          <span>Kimyo Fani Sohalari Bo&apos;yicha Natijalar</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sohalarTahlili.map((soha) => {
            let rang = "bg-emerald-400 text-emerald-400"
            if (soha.foiz < 50) rang = "bg-rose-400 text-rose-400"
            else if (soha.foiz < 75) rang = "bg-amber-400 text-amber-400"

            return (
              <div
                key={soha.nom}
                className="p-3.5 rounded-2xl bg-blue-950/50 border border-blue-900/60 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{soha.nom}</span>
                  <span className="font-bold font-mono">{soha.togri} / {soha.jami}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden border border-blue-900">
                  <div
                    className={`h-full ${rang.split(" ")[0]} transition-all duration-500`}
                    style={{ width: `${soha.foiz}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-blue-300/80">
                  <span>O&apos;zlashtirish:</span>
                  <strong className={`font-mono ${rang.split(" ")[1]}`}>{soha.foiz}%</strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
