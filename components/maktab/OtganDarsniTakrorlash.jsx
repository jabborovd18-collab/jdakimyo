"use client"

import { umumiyAudio, takrorlashVariantlari } from "@/lib/maktab-animatsiya"
import { useState } from "react"
import Ikon from "@/components/Ikon"

// Web Audio API yordamida interaktiv tovush effektlari
function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const ctx = umumiyAudio()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (turi === "togri" || turi === "tasdiq") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22)
      osc.start(now)
      osc.stop(now + 0.22)
    } else if (turi === "xato") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(240, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.25)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26)
      osc.start(now)
      osc.stop(now + 0.26)
    } else if (turi === "bosqich") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.15)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18)
      osc.start(now)
      osc.stop(now + 0.18)
    } else if (turi === "zafar") {
      const akkord = [523.25, 659.25, 783.99, 1046.5]
      akkord.forEach((freq, idx) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = "sine"
        o.frequency.value = freq
        o.connect(g)
        g.connect(ctx.destination)
        g.gain.setValueAtTime(0.08, now + idx * 0.08)
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5)
        o.start(now + idx * 0.08)
        o.stop(now + idx * 0.08 + 0.5)
      })
    }
  } catch {
    // Audio kontekst xavfsiz o'tkazib yuboriladi
  }
}

export default function OtganDarsniTakrorlash({
  oldingiRaqam,
  oldingiNom,
  savollar = [],
  onYangiDarsgaOtish,
}) {
  const [indeks, setIndeks] = useState(0)
  const [tanlanganVariant, setTanlanganVariant] = useState(null)
  const [ball, setBall] = useState(0)
  const [natijalarTarixi, setNatijalarTarixi] = useState([])
  const [tugadi, setTugadi] = useState(false)
  const [raund, setRaund] = useState(0)

  if (!savollar || savollar.length === 0) return null

  const joriySavol = savollar[indeks]
  const joriyVariantlar = takrorlashVariantlari(joriySavol, raund)

  const variantniTanlash = (vIdx) => {
    if (tanlanganVariant !== null) return
    setTanlanganVariant(vIdx)
    const varObj = joriyVariantlar[vIdx]
    if (varObj.togri) {
      setBall((b) => b + 1)
      setNatijalarTarixi((prev) => [...prev, true])
      tovushChiqar("togri")
    } else {
      setNatijalarTarixi((prev) => [...prev, false])
      tovushChiqar("xato")
    }
  }

  const keyingiSavol = () => {
    if (indeks < savollar.length - 1) {
      setIndeks((i) => i + 1)
      setTanlanganVariant(null)
      tovushChiqar("bosqich")
    } else {
      setTugadi(true)
      tovushChiqar("zafar")
    }
  }

  const qaytadanBoshlash = () => {
    setIndeks(0)
    setTanlanganVariant(null)
    setBall(0)
    setNatijalarTarixi([])
    setTugadi(false)
    setRaund((r) => r + 1)
    tovushChiqar("bosqich")
  }

  return (
    <div
      style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
      className="p-4 sm:p-6 rounded-3xl border border-blue-800/60 bg-gradient-to-br from-[#0c1333] via-[#080d26] to-[#040714] shadow-2xl space-y-4 font-serif touch-manipulation"
    >
      {/* ─── YUQORI QISM ─── */}
      <div className="flex items-center justify-between gap-3 border-b border-blue-900/50 pb-3.5 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <Ikon nom="chaqmoq" olcham={22} />
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {oldingiRaqam}. {oldingiNom}
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#050a20] border border-blue-900/60">
            {savollar.map((_, sIdx) => {
              const javobBerilgan = sIdx < natijalarTarixi.length
              const togriJavob = natijalarTarixi[sIdx]
              const faol = sIdx === indeks && !tugadi
              return (
                <span
                  key={sIdx}
                  className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${
                    javobBerilgan
                      ? togriJavob
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-rose-500 text-white"
                      : faol
                      ? "bg-yellow-500 text-slate-950 ring-2 ring-yellow-300"
                      : "bg-blue-950 text-blue-400"
                  }`}
                >
                  {sIdx + 1}
                </span>
              )
            })}
          </div>

          <span className="min-h-[44px] px-4 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 font-bold text-sm sm:text-base flex items-center">
            {ball} / {savollar.length}
          </span>

          {onYangiDarsgaOtish && !tugadi && (
            <button
              type="button"
              onClick={onYangiDarsgaOtish}
              className="min-h-[48px] px-4 py-2 rounded-xl border border-blue-700/70 bg-[#091538] hover:border-yellow-400/60 text-blue-200 hover:text-white text-sm sm:text-base font-bold transition touch-manipulation flex items-center gap-1.5"
            >
              <span>Ko&apos;rgazma</span>
              <Ikon nom="ong" olcham={16} />
            </button>
          )}
        </div>
      </div>

      {!tugadi ? (
        <>
          {/* ─── SAVOL KARTASI ─── */}
          <div className="p-5 sm:p-6 rounded-2xl border border-blue-800/60 bg-[#081236]/90 text-center shadow-xl">
            <h4 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white max-w-4xl mx-auto leading-snug">
              {joriySavol.savol}
            </h4>
          </div>

          {/* ─── VARIANTLAR (SMART DOSKA UCHUN KATTA SENSORLI TUGMALAR) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {joriyVariantlar.map((vObj, vIdx) => {
              const tanlandi = tanlanganVariant === vIdx
              let tugmaStil =
                "border-blue-800/80 bg-[#060c26] text-blue-100 hover:border-yellow-400/70 hover:bg-[#0a1744]"

              if (tanlanganVariant !== null) {
                if (vObj.togri) {
                  tugmaStil =
                    "border-2 border-emerald-400 bg-emerald-950/80 text-emerald-100 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/20"
                } else if (tanlandi && !vObj.togri) {
                  tugmaStil =
                    "border-2 border-rose-500 bg-rose-950/80 text-rose-100 shadow-lg shadow-rose-500/20"
                } else {
                  tugmaStil = "opacity-45 border-blue-950 bg-[#04081c] text-blue-400"
                }
              }

              return (
                <button
                  key={vObj.matn}
                  type="button"
                  onClick={() => variantniTanlash(vIdx)}
                  disabled={tanlanganVariant !== null}
                  className={`min-h-[72px] p-4 sm:p-5 rounded-2xl border text-left font-bold text-base sm:text-lg transition-all touch-manipulation flex items-center justify-between gap-3.5 active:scale-[0.98] ${tugmaStil}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-11 h-11 rounded-xl bg-blue-950/80 border border-blue-700/80 flex items-center justify-center text-base font-bold text-yellow-300 shrink-0">
                      {String.fromCharCode(65 + vIdx)}
                    </span>
                    <span className="leading-snug">{vObj.matn}</span>
                  </div>

                  {tanlanganVariant !== null && vObj.togri && (
                    <Ikon nom="tasdiq" olcham={22} className="text-emerald-400 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* ─── IZOH VA KEYINGI BOSQICH ─── */}
          {tanlanganVariant !== null && (
            <div className="p-4 rounded-2xl border border-blue-700/70 bg-[#071135] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm sm:text-base text-blue-100 leading-relaxed text-center sm:text-left">
                {joriySavol.izoh}
              </div>

              <button
                type="button"
                onClick={keyingiSavol}
                className="min-h-[48px] px-7 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-bold text-base transition touch-manipulation flex items-center gap-2 shadow-lg shrink-0"
              >
                <span>{indeks < savollar.length - 1 ? "Keyingi" : "Natija"}</span>
                <Ikon nom="ong" olcham={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* ─── YAKUNIY NATIJA EKRANI ─── */
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-yellow-500/20 border border-yellow-500/50 mx-auto flex items-center justify-center text-yellow-400">
            <Ikon nom="kubok" olcham={32} />
          </div>

          <p className="text-xl text-emerald-300 font-bold">
            Natija: {ball} / {savollar.length}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              onClick={qaytadanBoshlash}
              className="min-h-[48px] px-6 py-3 rounded-xl border border-blue-800 bg-[#091538] hover:border-yellow-400/50 text-blue-200 font-bold text-base transition touch-manipulation"
            >
              Qayta
            </button>

            {onYangiDarsgaOtish && (
              <button
                type="button"
                onClick={onYangiDarsgaOtish}
                className="min-h-[48px] px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base transition touch-manipulation shadow-lg flex items-center gap-2"
              >
                <span>Ko&apos;rgazmaga o&apos;tish</span>
                <Ikon nom="ong" olcham={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
