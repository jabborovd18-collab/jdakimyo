"use client"

import Ikon from "@/components/Ikon"

export function tovushChiqar(turi) {
  if (typeof window === "undefined") return
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (turi === "togri" || turi === "tasdiq") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(523.25, now)
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.22)
      gain.gain.setValueAtTime(0.22, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25)
      osc.start(now)
      osc.stop(now + 0.25)
    } else if (turi === "xato" || turi === "xavf") {
      osc.type = "sawtooth"
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.28)
      gain.gain.setValueAtTime(0.24, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.3)
    } else if (turi === "bosqich") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(480, now)
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.14)
      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16)
      osc.start(now)
      osc.stop(now + 0.16)
    } else if (turi === "zafar") {
      const akkord = [523.25, 659.25, 783.99, 1046.5]
      akkord.forEach((freq, idx) => {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = "sine"
        o.frequency.value = freq
        o.connect(g)
        g.connect(ctx.destination)
        g.gain.setValueAtTime(0.09, now + idx * 0.08)
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5)
        o.start(now + idx * 0.08)
        o.stop(now + idx * 0.08 + 0.5)
      })
    }
  } catch {
    // Audio ruxsati bo'lmasa xavfsiz o'tkazib yuboriladi
  }
}

export function SmartDoskaNavigatsiya({
  mavzuRaqam,
  mavzuNom,
  oldingiRaqam,
  asosiyBolim,
  setAsosiyBolim,
  toliqEkran,
  toliqEkranniUlash,
}) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap bg-[#060c24]/90 p-2 rounded-2xl border border-blue-800/70 shadow-xl">
      <div className="flex items-center gap-2 flex-wrap">
        {toliqEkran && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0a153a] border border-yellow-500/40 mr-1">
            <span className="text-xs font-bold text-yellow-400">{mavzuRaqam}</span>
            <span className="text-sm font-bold text-white">{mavzuNom}</span>
          </div>
        )}

        {oldingiRaqam && (
          <button
            type="button"
            onClick={() => {
              setAsosiyBolim("takrorlash")
              tovushChiqar("bosqich")
            }}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              asosiyBolim === "takrorlash"
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md"
                : "bg-[#091336] text-amber-300 hover:text-white"
            }`}
          >
            <Ikon nom="chaqmoq" olcham={17} />
            <span>Takrorlash</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setAsosiyBolim("animatsiyalar")
            tovushChiqar("bosqich")
          }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            asosiyBolim === "animatsiyalar"
              ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 shadow-md"
              : "bg-[#091336] text-blue-200 hover:text-white"
          }`}
        >
          <Ikon nom="atom" olcham={17} />
          <span>Ko&apos;rgazma</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAsosiyBolim("oyinlar")
            tovushChiqar("bosqich")
          }}
          className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            asosiyBolim === "oyinlar"
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
              : "bg-[#091336] text-blue-200 hover:text-white"
          }`}
        >
          <Ikon nom="doska" olcham={17} />
          <span>O&apos;yinlar</span>
        </button>
      </div>

      <button
        type="button"
        onClick={toliqEkranniUlash}
        className="min-h-[44px] px-4 py-2 rounded-xl border border-yellow-500/50 bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-300 font-bold text-xs sm:text-sm transition flex items-center gap-2 shrink-0"
      >
        <Ikon nom={toliqEkran ? "kichraytirish" : "kengaytirish"} olcham={17} />
        <span>{toliqEkran ? "Kichraytirish" : "To'liq ekran"}</span>
      </button>
    </div>
  )
}

export function DoskadaTushuntirishKartasi() {
  return null
}
