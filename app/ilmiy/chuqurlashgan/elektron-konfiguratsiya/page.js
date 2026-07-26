"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TERM MA'LUMOT BAZASI
// ═══════════════════════════════════════════════════════════════════════════════
const TERM_DATA = {
  0: {
    ions: "Sc³⁺, Ti⁴⁺, V⁵⁺", all: ["¹S"], ground: "¹S", S: "0", mult: "Singlet (1)", L: 0,
    Llabel: "S", J: "0", microstates: 1,
    ohSplit: "¹A₁g", ohGround: "¹A₁g",
    note: "d⁰ – bo'sh qobiq. Diamagnit. Rangsiz. Faqat ¹S termi."
  },
  1: {
    ions: "Ti³⁺, V⁴⁺", all: ["²D"], ground: "²D", S: "½", mult: "Dublet (2)", L: 2,
    Llabel: "D", J: "3/2", microstates: 10,
    ohSplit: "²T₂g + ²E_g", ohGround: "²T₂g",
    note: "Yagona term. Oktaedrikda ²T₂g (asosiy) + ²E_g (qo'zg'algan)."
  },
  2: {
    ions: "V³⁺, Cr⁴⁺", all: ["³F", "³P", "¹G", "¹D", "¹S"], ground: "³F", S: "1", mult: "Triplet (3)", L: 3,
    Llabel: "F", J: "2", microstates: 45,
    ohSplit: "³T₁g(F)+³T₂g+³A₂g", ohGround: "³T₁g(F)",
    note: "Asosiy term ³F. ³P — birinchi qo'zg'algan. 45 ta mikroholat."
  },
  3: {
    ions: "Cr³⁺, Mn⁴⁺", all: ["⁴F", "⁴P", "²G", "²F", "²D", "²H"], ground: "⁴F", S: "3/2", mult: "Kvartet (4)", L: 3,
    Llabel: "F", J: "3/2", microstates: 120,
    ohSplit: "⁴A₂g+⁴T₂g+⁴T₁g(F)", ohGround: "⁴A₂g",
    note: "⁴A₂g — Cr³⁺ komplekslarining asosiy holati. Optik spektrlarda muhim."
  },
  4: {
    ions: "Cr²⁺, Mn³⁺", all: ["⁵D", "³H", "³G", "³F", "³D", "³P", "¹I", "¹G", "¹F", "¹D", "¹S"], ground: "⁵D", S: "2", mult: "Kvintet (5)", L: 2,
    Llabel: "D", J: "0", microstates: 210,
    ohSplit: "⁵E_g+⁵T₂g", ohGround: "⁵E_g (HS) / ⁵T₂g (?)",
    note: "d⁴ HS da ⁵E_g — Jahn-Teller faol (Cr²⁺). LS da ³T₁g."
  },
  5: {
    ions: "Mn²⁺, Fe³⁺", all: ["⁶S", "⁴G", "⁴F", "⁴D", "⁴P", "²I", "²H", "²G", "²F", "²D", "²S"], ground: "⁶S", S: "5/2", mult: "Sekstet (6)", L: 0,
    Llabel: "S", J: "5/2", microstates: 252,
    ohSplit: "⁶A₁g", ohGround: "⁶A₁g",
    note: "⁶S → ⁶A₁g (ajralmaydi, L=0). Eng ko'p mikroholatli konfiguratsiya."
  },
  6: {
    ions: "Fe²⁺, Co³⁺", all: ["⁵D", "³H", "³G", "³F", "³D", "³P", "¹I", "¹G", "¹F", "¹D", "¹S"], ground: "⁵D", S: "2", mult: "Kvintet (5)", L: 2,
    Llabel: "D", J: "4", microstates: 210,
    ohSplit: "⁵T₂g+⁵E_g", ohGround: "⁵T₂g (HS) / ¹A₁g (LS)",
    note: "d⁶ — HS/LS muhim! HS: ⁵T₂g. LS: ¹A₁g (t₂g⁶, diamagnit)."
  },
  7: {
    ions: "Co²⁺, Ni³⁺", all: ["⁴F", "⁴P", "²G", "²F", "²D", "²H"], ground: "⁴F", S: "3/2", mult: "Kvartet (4)", L: 3,
    Llabel: "F", J: "9/2", microstates: 120,
    ohSplit: "⁴T₁g(F)+⁴T₂g+⁴A₂g", ohGround: "⁴T₁g(F)",
    note: "Co²⁺ (d⁷) HS: ⁴T₁g(F) — pushti rang. LS: ²E_g (sariq)."
  },
  8: {
    ions: "Ni²⁺, Cu³⁺", all: ["³F", "³P", "¹G", "¹D", "¹S"], ground: "³F", S: "1", mult: "Triplet (3)", L: 3,
    Llabel: "F", J: "4", microstates: 45,
    ohSplit: "³A₂g+³T₂g+³T₁g(F)", ohGround: "³A₂g",
    note: "Ni²⁺ (d⁸): ³A₂g — yashil rang. Oktaedrik komplekslar."
  },
  9: {
    ions: "Cu²⁺", all: ["²D"], ground: "²D", S: "½", mult: "Dublet (2)", L: 2,
    Llabel: "D", J: "5/2", microstates: 10,
    ohSplit: "²E_g+²T₂g", ohGround: "²E_g",
    note: "Cu²⁺ (d⁹): ²E_g — Jahn-Teller faol. Moviy rang."
  },
  10: {
    ions: "Zn²⁺, Cd²⁺", all: ["¹S"], ground: "¹S", S: "0", mult: "Singlet (1)", L: 0,
    Llabel: "S", J: "0", microstates: 1,
    ohSplit: "¹A₁g", ohGround: "¹A₁g",
    note: "To'liq to'lgan qobiq. Diamagnit. Rangsiz."
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. TERM BELGI — INTERAKTIV VIZUALIZATOR
// ═══════════════════════════════════════════════════════════════════════════════
function TermVizualizator() {
  const [dN, setDN] = useState(5)
  const cfg = TERM_DATA[dN]

  // Calculate term symbol display
  const S_val = parseFloat(cfg.S)
  const multVal = cfg.mult.split(" ")[0]
  const L_names = ["S", "P", "D", "F", "G", "H", "I"]
  const L_map = { 0: "S", 1: "P", 2: "D", 3: "F", 4: "G", 5: "H", 6: "I" }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-amber-400">🎯</span> Term belgi — interaktiv vizualizator
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        {/* dⁿ tanlash */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] text-purple-400 self-center mr-1">dⁿ:</span>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => setDN(n)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                dN === n ? "bg-amber-600 text-white ring-2 ring-amber-400" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
              }`}>{n === 0 ? "0" : n}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Term vizual */}
          <div className="space-y-3 text-center">
            <div className="bg-purple-950/80 border border-amber-500/30 rounded-xl p-6">
              <h4 className="text-purple-400 text-xs mb-2">Asosiy holat term belgisi</h4>
              {dN > 0 && dN < 10 ? (
                <>
                  <div className="text-6xl sm:text-7xl font-bold text-amber-300 font-mono tracking-wider mb-2">
                    <sup className="text-3xl sm:text-4xl">{multVal}</sup>{cfg.ground}
                  </div>
                  <p className="text-purple-400 text-xs">
                    <span className="text-amber-400">2S+1</span> = {multVal} • 
                    <span className="text-amber-400"> L</span> = {cfg.Llabel} ({cfg.L}) • 
                    <span className="text-amber-400"> S</span> = {cfg.S}
                  </p>
                </>
              ) : (
                <div className="text-4xl sm:text-5xl font-bold text-amber-300 font-mono">
                  {dN === 0 ? "¹S" : "¹S"}
                </div>
              )}

              {/* Electron configuration box */}
              <div className="mt-4 grid grid-cols-5 gap-1 max-w-xs mx-auto">
                {Array.from({length: 5}).map((_, i) => {
                  let fill = "·"
                  let n = dN
                  // Simplified Hund filling
                  if (dN <= 5) {
                    fill = i < dN ? "↑" : "·"
                  } else {
                    fill = i < dN - 5 ? "↑↓" : (i < dN ? "↑" : "·")
                  }
                  return (
                    <div key={i} className={`h-8 rounded border flex items-center justify-center text-xs font-bold font-mono ${
                      fill === "·" ? "bg-purple-950/60 border-purple-800/40 text-purple-700" :
                      fill.includes("↓") ? "bg-amber-950/60 border-amber-700/40 text-amber-300" :
                      "bg-amber-900/40 border-amber-700/40 text-amber-200"
                    }`}>{fill}</div>
                  )
                })}
              </div>
            </div>

            {/* Hund qoidalari vizual */}
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[10px]">
              <p className="text-purple-300">
                <strong className="text-amber-400">Hund 1:</strong> S = {cfg.S} (maksimal) • 
                <strong className="text-amber-400"> Hund 2:</strong> L = {cfg.L} ({cfg.Llabel}) • 
                <strong className="text-amber-400"> Hund 3:</strong> J = {cfg.J}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1.5 text-xs">
              {[
                ["Ion misoli", cfg.ions],
                ["Barcha termlar", cfg.all.join(", ")],
                ["Asosiy (Hund) term", cfg.ground],
                ["Spin multiplikligi", cfg.mult],
                ["S (umumiy spin)", cfg.S],
                ["L (orbital moment)", `${cfg.Llabel} (L=${cfg.L})`],
                ["J (to'liq moment)", cfg.J],
                ["Mikroholatlar soni", `${cfg.microstates.toLocaleString()}`],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-purple-400">{l}:</span>
                  <span className="text-purple-200 font-semibold">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-yellow-400 font-bold mb-1">💡 Oktaedrik maydonda:</p>
              <p className="text-purple-200">{cfg.note}</p>
              <p className="text-purple-300 mt-1">{cfg.ground} → <span className="text-amber-300 font-mono">{cfg.ohSplit}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. d¹–d¹⁰ TERMLAR JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function TermlarJadvali() {
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📊</span> dⁿ konfiguratsiyalar — to'liq termlar jadvali
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-1.5 sm:p-2 text-left text-amber-400">dⁿ</th>
                <th className="p-1.5 sm:p-2 text-left text-purple-200">Ionlar</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">Barcha termlar</th>
                <th className="p-1.5 sm:p-2 text-center text-amber-400">Asosiy</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">S</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">Mult.</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">O_h da</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden sm:table-cell">Mikro</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TERM_DATA).filter(([k]) => k !== "0").map(([key, cfg], i) => (
                <tr key={key}
                  className={`border-t border-purple-800/30 cursor-pointer transition-all ${
                    highlight === parseInt(key) ? "bg-amber-900/30" : i % 2 === 0 ? "bg-purple-900/20" : "bg-purple-950/20"
                  } hover:bg-purple-800/30`}
                  onClick={() => setHighlight(highlight === parseInt(key) ? null : parseInt(key))}>
                  <td className="p-1.5 sm:p-2 font-bold font-mono text-amber-400">d{key}</td>
                  <td className="p-1.5 sm:p-2 text-purple-200 text-[8px] sm:text-[10px]">{cfg.ions}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-300 font-mono text-[8px] sm:text-[10px] max-w-[200px] truncate">{cfg.all.join(" ")}</td>
                  <td className="p-1.5 sm:p-2 text-center text-amber-300 font-bold font-mono text-xs sm:text-sm">{cfg.ground}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-200">{cfg.S}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-200">{cfg.mult.split(" ")[0]}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-300 font-mono text-[8px] sm:text-[10px]">{cfg.ohGround}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-200 hidden sm:table-cell">{cfg.microstates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {highlight && (
          <div className="bg-amber-600/10 border-t border-amber-500/30 px-4 py-2 text-[10px]">
            <p className="text-amber-400 font-bold">d{highlight}: {TERM_DATA[highlight].note}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MIKROHOLATLAR — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function Mikroholatlar() {
  const [tab, setTab] = useState("d2")

  const data = {
    d2: {
      d: 2, total: 45,
      terms: [
        { label: "³F", count: 21, spin: "Triplet", en: "Eng past (asosiy)", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
        { label: "³P", count: 9, spin: "Triplet", en: "+~15000 cm⁻¹", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
        { label: "¹G", count: 9, spin: "Singlet", en: "+~20000 cm⁻¹", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
        { label: "¹D", count: 5, spin: "Singlet", en: "+~25000 cm⁻¹", color: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30" },
        { label: "¹S", count: 1, spin: "Singlet", en: "+~30000 cm⁻¹", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
      ],
      note: "Jami 45 ta mikroholat: 30 ta triplet (parallel spin) + 15 ta singlet (antiparallel)."
    },
    d3: {
      d: 3, total: 120,
      terms: [
        { label: "⁴F", count: 28, spin: "Kvartet", en: "Eng past", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
        { label: "⁴P", count: 12, spin: "Kvartet", en: "+~20000 cm⁻¹", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
        { label: "²G", count: 22, spin: "Dublet", en: "+~25000 cm⁻¹", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
        { label: "²F", count: 18, spin: "Dublet", en: "+~30000 cm⁻¹", color: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30" },
        { label: "²D, ²H", count: 40, spin: "Dublet", en: "+~35000 cm⁻¹", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
      ],
      note: "Jami 120 ta mikroholat. Eng murakkab term strukturasiga ega konfiguratsiyalardan biri."
    },
    d5: {
      d: 5, total: 252,
      terms: [
        { label: "⁶S", count: 6, spin: "Sekstet", en: "Eng past", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
        { label: "⁴G", count: 36, spin: "Kvartet", en: "+~25000 cm⁻¹", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
        { label: "⁴F", count: 28, spin: "Kvartet", en: "+~28000 cm⁻¹", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
        { label: "⁴D, ⁴P", count: 32, spin: "Kvartet", en: "+~30000 cm⁻¹", color: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30" },
        { label: "²I, ²H, ²G...", count: 150, spin: "Dublet", en: "+~35000 cm⁻¹", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
      ],
      note: "Jami 252 ta mikroholat — d-elementlar orasida eng ko'pi! ⁶S termi ajralmaydi (L=0)."
    }
  }

  const d = data[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">🔬</span> Mikroholatlar — termlarga ajralish
      </h3>

      <div className="flex gap-2">
        {Object.entries(data).map(([key, val]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            d{val.d} — {val.total} mikroholat
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <h4 className="text-white font-bold text-sm mb-4">d{d.d}: {d.total} ta mikroholat → {d.terms.length} ta term</h4>

        <div className="space-y-2 mb-4">
          {d.terms.map((t, i) => (
            <div key={i} className={`${t.bg} rounded-lg p-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-lg sm:text-xl font-bold font-mono ${t.color}`}>{t.label}</span>
                  <span className="text-purple-300 text-[10px]">{t.spin}</span>
                </div>
                <span className="text-purple-200 text-[10px]">{t.count} ta • {t.en}</span>
              </div>
              <div className="w-full bg-purple-950/60 rounded-full h-2 mt-2 overflow-hidden">
                <div className="h-2 rounded-full transition-all" style={{ width: `${(t.count / d.total) * 100}%`, background: t.color.replace("text-", "") === "text-green-400" ? "#22c55e" : t.color.replace("text-", "") === "text-blue-400" ? "#3b82f6" : t.color.replace("text-", "") === "text-purple-400" ? "#a855f7" : t.color.replace("text-", "") === "text-yellow-400" ? "#eab308" : "#ef4444" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
          <p className="text-yellow-400 font-bold">💡 </p>
          <p className="text-purple-200">{d.note}</p>
          <p className="text-purple-300 mt-1">
            <strong>Hisob:</strong> C(10,{d.d}) = 10!/({d.d}!·{10-d.d}!) = {d.total}
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. OKTAEDRIK MAYDONDA TERM AJRALISHI
// ═══════════════════════════════════════════════════════════════════════════════
function OhAjralish() {
  const [level, setLevel] = useState("D")

  const corrTable = {
    S: { oh: "A₁g", deg: 1, examples: ["d⁵ HS: ⁶S → ⁶A₁g"] },
    P: { oh: "T₁g", deg: 3, examples: ["d²: ³P → ³T₁g(P)"] },
    D: { oh: "E_g + T₂g", deg: "2+3=5", examples: ["d¹: ²D → ²T₂g + ²E_g", "d⁴ HS: ⁵D → ⁵E_g + ⁵T₂g"] },
    F: { oh: "A₂g + T₁g + T₂g", deg: "1+3+3=7", examples: ["d³: ⁴F → ⁴A₂g + ⁴T₂g + ⁴T₁g(F)", "d²: ³F → ³T₁g(F) + ³T₂g + ³A₂g"] },
    G: { oh: "A₁g + E_g + T₁g + T₂g", deg: "1+2+3+3=9", examples: ["d²: ¹G → ¹A₁g + ¹E_g + ¹T₁g + ¹T₂g"] },
  }

  const c = corrTable[level]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-purple-400">💎</span> Oktaedrik (Oh) maydonda termlarning ajralishi
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="flex gap-2 flex-wrap mb-4">
          {Object.entries(corrTable).map(([key, val]) => (
            <button key={key} onClick={() => setLevel(key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${level === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
              {key} (L={key === "S" ? 0 : key === "P" ? 1 : key === "D" ? 2 : key === "F" ? 3 : 4})
            </button>
          ))}
        </div>

        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 mb-4">
          <h4 className="text-white font-bold text-sm mb-2">Erkin ion: <span className="text-amber-400 font-mono">{level}</span></h4>
          <div className="h-24 flex flex-col justify-center items-center space-y-2">
            <span className="text-3xl font-bold font-mono text-amber-300">{level}</span>
            <span className="text-purple-400 text-xs">Ajralish darajasi: {c.deg}</span>
          </div>
        </div>

        <div className="text-center text-purple-400 text-xs mb-3">↓ Oh maydon ↓</div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          {c.oh.split(" + ").map((oh, i) => {
            const colors = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#ef4444"]
            return (
              <div key={i} className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 flex items-center justify-between">
                <span className="font-mono font-bold" style={{ color: colors[i] }}>{oh}</span>
                <span className="text-purple-400 text-[10px]">simmetriya</span>
              </div>
            )
          })}
        </div>

        <div className="space-y-1 text-[10px]">
          {c.examples.map((ex, i) => (
            <div key={i} className="bg-purple-950/50 rounded p-1.5">
              <span className="text-purple-200">{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. RUSSELL-SAUNDERS BOG'LANISH
// ═══════════════════════════════════════════════════════════════════════════════
function RSBoglanish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-rose-400">⚛️</span> Russell-Saunders (LS) bog'lanish sxemasi
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <h4 className="text-rose-400 font-bold text-sm">LS bog'lanish tartibi:</h4>
            <div className="space-y-2 text-xs">
              {[
                { step: "1", desc: "Har bir elektronning spinlari (sᵢ) qo'shiladi → umumiy spin S = |Σsᵢ|", formula: "S = |Σsᵢ|" },
                { step: "2", desc: "Har bir elektronning orbital momentlari (lᵢ) qo'shiladi → umumiy orbital L = |Σlᵢ|", formula: "L = |Σlᵢ|" },
                { step: "3", desc: "Spin-orbit bog'lanish: J = |L−S| dan L+S gacha", formula: "J = |L−S|, ..., L+S" },
                { step: "4", desc: "Term belgi: ²S⁺¹L_J", formula: "²S⁺¹L_J" },
              ].map((item, i) => (
                <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-600/30 text-rose-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{item.step}</span>
                    <div>
                      <p className="text-purple-200">{item.desc}</p>
                      <p className="text-yellow-300 font-mono mt-0.5">{item.formula}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-rose-400 font-bold text-sm">Misol: V³⁺ (d²) uchun term hisobi</h4>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-2 text-xs">
              {[
                ["Elektron konfig.", "3d² → 2 ta d-elektron"],
                ["Maks. S", "Parallel spinlar → S = ½ + ½ = 1 → 2S+1 = 3 (triplet)"],
                ["Maks. L", "mₗ = 1 va 2 → L = |1+2| = 3 → F"],
                ["J", "|L−S| = 2, L+S = 4 → J = 2, 3, 4"],
                ["Asosiy term", "Qobiq yarimdan kam → eng kichik J → ³F₂"],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-purple-400">{l}:</span>
                  <span className="text-purple-200 font-semibold text-right">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-yellow-400 font-bold">💡 3d metallar LS bog'lanish — to'g'ri</p>
              <p className="text-purple-200">
                3d metallar uchun LS (Russell-Saunders) bog'lanish sxemasi qo'llaniladi (SOC kichik). 
                4d, 5d va aktinidlar uchun jj bog'lanish kerak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestTermlar() {
  const questions = [
    { q: "²S⁺¹L belgidagi 2S+1 nima?", a: "Spin multiplikligi", opts: ["Umumiy spin", "Spin multiplikligi", "Orbital moment", "To'liq moment"], hint: "Singlet=1, Dublet=2, Triplet=3..." },
    { q: "d⁵ konfiguratsiyaning asosiy termi?", a: "⁶S", opts: ["⁵D", "⁴F", "⁶S", "²D"], hint: "Maksimal spin: 5 ta ↑" },
    { q: "Oktaedrik maydonda D termi qanday ajraladi?", a: "E_g + T₂g", opts: ["A₂g + T₁g + T₂g", "E_g + T₂g", "A₁g + E_g + T₁g + T₂g", "T₁g"], hint: "5 ta orbital → 2+3" },
    { q: "d² konfiguratsiya uchun jami nechta mikroholat bor?", a: "45 ta", opts: ["45 ta", "10 ta", "120 ta", "252 ta"], hint: "C(10,2) = ?" },
    { q: "Russell-Saunders bog'lanish sxemasida avval nima qo'shiladi?", a: "Spinlar (sᵢ → S)", opts: ["Orbitallar (lᵢ → L)", "Spinlar (sᵢ → S)", "J = |L−S|", "Term belgi"], hint: "Hund qoidasi" },
    { q: "Fe³⁺ (d⁵ HS) ning asosiy termi va O_h dagi simmetriyasi?", a: "⁶S → ⁶A₁g", opts: ["⁵D → ⁵E_g", "⁶S → ⁶A₁g", "⁴F → ⁴A₂g", "²D → ²T₂g"], hint: "L=0 → ajralmaydi" },
    { q: "d⁹ konfiguratsiyaning asosiy termi va O_h dagi holati?", a: "²D → ²E_g (Jahn-Teller)", opts: ["²D → ²T₂g", "²D → ²E_g (Jahn-Teller)", "³F → ³A₂g", "¹S → ¹A₁g"], hint: "Cu²⁺ — Jahn-Teller faol" },
    { q: "Energiyasi eng past (asosiy) termni aniqlovchi qoida?", a: "Eng katta S, keyin eng katta L", opts: ["Eng kichik J", "Eng katta S, keyin eng katta L", "Eng kichik L", "Eng katta J"], hint: "Hund qoidalari" },
    { q: "d³ va d⁷ konfiguratsiyalar bir-biriga qanday munosabatda?", a: "Teshik ekvivalenti (bir xil termlar)", opts: ["Hech qanday", "Teshik ekvivalenti (bir xil termlar)", "d³ katta energiya", "d⁷ katta spin"], hint: "dⁿ va d¹⁰⁻ⁿ" },
    { q: "Oktaedrik maydonda F termi necha xil simmetriyaga ajraladi?", a: "3 xil (A₂g + T₁g + T₂g)", opts: ["2 xil", "3 xil (A₂g + T₁g + T₂g)", "4 xil", "1 xil"], hint: "L=3 → 1+3+3=7" },
  ]

  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
          <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => { setS(opt); const ok = opt === q.a; if (ok && !ans[c]) setSc(p => p + 1); setAns(p => ({...p, [c]: ok})) })()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s === opt ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200") : s ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50") : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}
            </button>
          ))}
        </div>
        {s && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>{s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={() => { if (c < questions.length - 1) { setC(p => p + 1); setS(null) } else setRes(true) }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function ElektronKonfiguratsiyaTermlar() {
  const [view, setView] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <span className="text-amber-400">Elektron konfiguratsiya va termlar</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-amber-400 flex items-center gap-2">
                <span>📝</span> Elektron konfiguratsiya va termlar
              </h1>
              <p className="text-[10px] sm:text-xs text-purple-500">dⁿ konfiguratsiyalar • Term belgilar • Mikroholatlar • OTM darajasi</p>
            </div>
            <button onClick={() => setView(view === "all" ? "compact" : "all")}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
              {view === "all" ? "🧮 Termlar" : "📄 To'liq"}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Elektron konfiguratsiya va term belgilar</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-amber-400">Term belgi</strong> — atom yoki ionning umumiy spin (S) va orbital (L) 
                burchak momentlarini ifodalovchi kvant-mekanik belgi: <strong className="text-amber-400">²S⁺¹L</strong>.
                Kompleks birikmalarda metall markazining term belgisi uning 
                spektral, magnit va kimyoviy xossalarini tushunish uchun asos bo'ladi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">d¹–d¹⁰ termlar</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">LS bog'lanish</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-amber-400 font-bold">🎯 Maqsad:</span> Term belgi tizimini, Russell-Saunders bog'lanish sxemasini va mikroholatlar tushunchasini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-amber-400 font-bold">⏱️ Vaqt:</span> ~4 soat</p>
              <p className="text-purple-300"><span className="text-amber-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Tanabe-Sugano diagrammalari</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-amber-300 font-mono text-xs">²S⁺¹L_J — atomning kvant \"imzosi\"</p>
              </div>
            </div>
          </div>
        </div>

        {/* TERM VIZUALIZATOR */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TermVizualizator />
        </div>

        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <TermlarJadvali />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <RSBoglanish />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <Mikroholatlar />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <OhAjralish />
            </div>
          </>
        )}

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestTermlar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>Term belgi: <strong className="text-amber-400">²S⁺¹L</strong> — umumiy spin (S) va orbital (L) momentlarni ifodalaydi</li>
            <li>Russell-Saunders: sᵢ → S (spin), lᵢ → L (orbital), J = |L−S|...L+S</li>
            <li><strong className="text-amber-400">Hund qoidalari:</strong> 1) maks S, 2) maks L, 3) min/max J</li>
            <li>Mikroholatlar soni = <strong className="text-amber-400">C(10,n)</strong>. d⁵ da eng ko'p (252 ta)</li>
            <li>O_h da: S→A₁g, P→T₁g, D→E_g+T₂g, F→A₂g+T₁g+T₂g, G→A₁g+E_g+T₁g+T₂g</li>
            <li>dⁿ va d¹⁰⁻ⁿ teshik ekvivalenti — bir xil termlarga ega</li>
            <li><strong className="text-amber-400">Tanabe-Sugano diagrammalari</strong> term ajralishiga asoslanadi</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Atom tuzilishi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20">
            Kimyoviy bog'lanish <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manbalar:</strong> Cotton — Advanced Inorganic Chemistry | Housecroft — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
