"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. d¹–d¹⁰ KONFIGURATSIYA — TO'LIQ MA'LUMOT BAZASI
// ═══════════════════════════════════════════════════════════════════════════════
const D_CONFIGS = {
  1: {
    ions: "Ti³⁺, V⁴⁺", config: "t₂g¹", hsCfse: -0.40, lsCfse: -0.40, hsSpin: 1, lsSpin: 1,
    mag: "1.73 BM", color: "text-purple-400", ohConfig: "t₂g¹ e_g⁰",
    hsConfig: "t₂g¹ e_g⁰", lsConfig: "—",
    note: "Bitta konfiguratsiya. [Ti(H₂O)₆]³⁺ — binafsha rang (d-d o'tish: 20300 cm⁻¹).",
    example: "Ti³⁺ → [Ti(H₂O)₆]³⁺ (binafsha)"
  },
  2: {
    ions: "V³⁺, Mo⁴⁺", config: "t₂g²", hsCfse: -0.80, lsCfse: -0.80, hsSpin: 2, lsSpin: 2,
    mag: "2.83 BM", color: "text-green-400", ohConfig: "t₂g² e_g⁰",
    hsConfig: "t₂g² e_g⁰", lsConfig: "—",
    note: "Parallel spinlar (Xund). [V(H₂O)₆]³⁺ — yashil rang.",
    example: "V³⁺ → [V(H₂O)₆]³⁺ (yashil)"
  },
  3: {
    ions: "Cr³⁺, V²⁺, Mo³⁺", config: "t₂g³", hsCfse: -1.20, lsCfse: -1.20, hsSpin: 3, lsSpin: 3,
    mag: "3.87 BM", color: "text-blue-400", ohConfig: "t₂g³ e_g⁰",
    hsConfig: "t₂g³ e_g⁰", lsConfig: "—",
    note: "t₂g yarim to'lgan — barqaror. [Cr(H₂O)₆]³⁺ — moviy-binafsha.",
    example: "Cr³⁺ → [Cr(H₂O)₆]³⁺ (moviy)"
  },
  4: {
    ions: "Cr²⁺, Mn³⁺", config: "t₂g³eg¹ / t₂g⁴",
    hsCfse: -0.60, lsCfse: -1.60, hsSpin: 4, lsSpin: 2,
    mag: "4.90 / 2.83 BM", color: "text-yellow-400", ohConfig: "t₂g³ e_g¹ / t₂g⁴ e_g⁰",
    hsConfig: "t₂g³ e_g¹", lsConfig: "t₂g⁴ e_g⁰",
    note: "HS: Δ₀ < P → 4-e⁻ e_g ga chiqadi. LS: Δ₀ > P → t₂g da juftlashadi.",
    example: "HS: Cr²⁺(H₂O), LS: Cr²⁺(CN⁻) — kuchli maydon"
  },
  5: {
    ions: "Fe³⁺, Mn²⁺, Ru³⁺", config: "t₂g³eg² / t₂g⁵",
    hsCfse: 0.00, lsCfse: -2.00, hsSpin: 5, lsSpin: 1,
    mag: "5.92 / 1.73 BM", color: "text-red-400", ohConfig: "t₂g³ e_g² / t₂g⁵ e_g⁰",
    hsConfig: "t₂g³ e_g²", lsConfig: "t₂g⁵ e_g⁰",
    note: "HS: 5 ta parallel spin — maksimal! LS: 1 ta toq e⁻ — [Fe(CN)₆]³⁻ qizil.",
    example: "HS: Fe³⁺(H₂O), Mn²⁺(H₂O). LS: Fe³⁺(CN⁻)"
  },
  6: {
    ions: "Fe²⁺, Co³⁺, Ru²⁺", config: "t₂g⁴eg² / t₂g⁶",
    hsCfse: -0.40, lsCfse: -2.40, hsSpin: 4, lsSpin: 0,
    mag: "4.90 / 0 BM", color: "text-emerald-400", ohConfig: "t₂g⁴ e_g² / t₂g⁶ e_g⁰",
    hsConfig: "t₂g⁴ e_g²", lsConfig: "t₂g⁶ e_g⁰",
    note: "LS: DIAMAGNIT! t₂g⁶ — eng barqaror holat. [Fe(CN)₆]⁴⁻ sariq.",
    example: "HS: Fe²⁺(H₂O) och yashil. LS: Fe²⁺(CN⁻) sariq (ferrosianid)"
  },
  7: {
    ions: "Co²⁺, Ni³⁺, Rh²⁺", config: "t₂g⁵eg² / t₂g⁶eg¹",
    hsCfse: -0.80, lsCfse: -1.80, hsSpin: 3, lsSpin: 1,
    mag: "3.87 / 1.73 BM", color: "text-cyan-400", ohConfig: "t₂g⁵ e_g² / t₂g⁶ e_g¹",
    hsConfig: "t₂g⁵ e_g²", lsConfig: "t₂g⁶ e_g¹",
    note: "LS: Jahn-Teller faol (e_g¹ → degenerat). [Co(H₂O)₆]²⁺ pushti.",
    example: "HS: Co²⁺(H₂O) pushti. LS: Co²⁺(CN⁻) — kuchli maydon"
  },
  8: {
    ions: "Ni²⁺, Pd²⁺, Pt²⁺", config: "t₂g⁶eg²", hsCfse: -1.20, lsCfse: -1.20, hsSpin: 2, lsSpin: 2,
    mag: "2.83 BM", color: "text-green-400", ohConfig: "t₂g⁶ e_g²",
    hsConfig: "t₂g⁶ e_g²", lsConfig: "—",
    note: "Bitta konfiguratsiya. d⁸ — oktaedrik/Kvadrat. Platina guruhi.",
    example: "Ni²⁺ → [Ni(H₂O)₆]²⁺ (yashil). Pt²⁺ → [PtCl₄]²⁻ (kvadrat)"
  },
  9: {
    ions: "Cu²⁺, Ag²⁺", config: "t₂g⁶eg³", hsCfse: -0.60, lsCfse: -0.60, hsSpin: 1, lsSpin: 1,
    mag: "1.73 BM", color: "text-sky-400", ohConfig: "t₂g⁶ e_g³",
    hsConfig: "t₂g⁶ e_g³", lsConfig: "—",
    note: "Jahn-Teller effekti! e_g³ → oktaedr cho'ziladi. [Cu(H₂O)₆]²⁺ moviy.",
    example: "Cu²⁺ → [Cu(H₂O)₆]²⁺ (moviy) — JT faol"
  },
  10: {
    ions: "Zn²⁺, Cu⁺, Ag⁺, Au⁺", config: "t₂g⁶eg⁴", hsCfse: 0.00, lsCfse: 0.00, hsSpin: 0, lsSpin: 0,
    mag: "0 BM", color: "text-gray-400", ohConfig: "t₂g⁶ e_g⁴",
    hsConfig: "t₂g⁶ e_g⁴", lsConfig: "—",
    note: "To'liq to'lgan — diamagnit. Rangsiz komplekslar. Zn²⁺ — d¹⁰.",
    example: "Zn²⁺ → [Zn(H₂O)₆]²⁺ (rangsiz). Cu⁺ → [CuCl₂]⁻"
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV KONFIGURATSIYA VIZUALIZATORI
// ═══════════════════════════════════════════════════════════════════════════════
function KonfiguratsiyaVizual() {
  const [dN, setDN] = useState(6)
  const [spin, setSpin] = useState("auto")

  const cfg = D_CONFIGS[dN]
  const isHS = spin === "auto" ? dN <= 5 : spin === "hs"
  const isLS = !isHS

  // d-electron filling visual
  const fillOrbitals = (count, hsMode) => {
    const arr = ["·", "·", "·", "·", "·"]
    const t2gSlots = 3
    const egSlots = 2

    if (hsMode) {
      // HS: fill with parallel spins first
      let n = count
      for (let i = 0; i < t2gSlots && n > 0; i++) { arr[i] = "↑"; n-- }
      for (let i = 0; i < egSlots && n > 0; i++) { arr[3 + i] = "↑"; n-- }
      // pair in t2g
      for (let i = 0; i < t2gSlots && n > 0; i++) { arr[i] = "↑↓"; n-- }
      // pair in eg
      for (let i = 0; i < egSlots && n > 0; i++) { arr[3 + i] = "↑↓"; n-- }
    } else {
      // LS: fill t2g completely first, then eg
      let n = count
      for (let i = 0; i < t2gSlots && n > 0; i++) { arr[i] = n >= 2 ? "↑↓" : "↑"; n -= Math.min(n, 2) }
      for (let i = 0; i < egSlots && n > 0; i++) { arr[3 + i] = n >= 2 ? "↑↓" : "↑"; n -= Math.min(n, 2) }
    }
    return arr
  }

  const orbitals = ["d_xy", "d_xz", "d_yz", "d_z²", "d_x²−y²"]
  const hsFilling = fillOrbitals(dN, true)
  const lsFilling = dN >= 4 && dN <= 7 ? fillOrbitals(dN, false) : hsFilling
  const currentFilling = isHS ? hsFilling : lsFilling

  const canHSLS = dN >= 4 && dN <= 7

  const unpaired = currentFilling.filter(s => s === "↑").length
  const mu = unpaired > 0 ? Math.sqrt(unpaired * (unpaired + 2)).toFixed(2) : "0"

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">🎯</span> d-elektron konfiguratsiyalar — interaktiv vizualizator
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        {/* dⁿ tanlash */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-[10px] text-purple-400 self-center mr-1">dⁿ:</span>
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => { setDN(n); setSpin("auto") }}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                dN === n ? "bg-purple-600 text-white ring-2 ring-purple-400" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
              }`}>{n}</button>
          ))}
        </div>

        {/* HS/LS toggle */}
        {canHSLS && (
          <div className="flex gap-2 mb-4">
            {[
              { id: "auto", label: "🔄 Avto" },
              { id: "hs", label: "🔵 Yuqori spin (HS)" },
              { id: "ls", label: "🔴 Past spin (LS)" },
            ].map(s => (
              <button key={s.id} onClick={() => setSpin(s.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                  spin === s.id ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                }`}>{s.label}</button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Orbital diagram */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-white">d{dN} — {isHS ? "Yuqori spin" : "Past spin"}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                unpaired === 0 ? "bg-gray-600/20 text-gray-400" : "bg-yellow-600/20 text-yellow-400"
              }`}>
                {unpaired === 0 ? "Diamagnit" : `${unpaired} ta toq e⁻`}
              </span>
            </div>

            {orbitals.map((name, i) => {
              const fill = currentFilling[i]
              const isT2g = i < 3
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className={`text-[9px] sm:text-[10px] font-mono w-16 sm:w-20 text-right ${isT2g ? "text-green-400" : "text-red-400"}`}>{name}</span>
                  <div className={`flex-1 h-6 sm:h-7 rounded border flex items-center px-2 ${
                    isT2g ? "bg-green-950/60 border-green-800/40" : "bg-red-950/60 border-red-800/40"
                  }`}>
                    <span className={`font-bold text-sm ${fill === "·" ? "text-purple-800" : fill.includes("↓") ? "text-yellow-300" : isT2g ? "text-green-300" : "text-red-300"}`}>{fill}</span>
                  </div>
                  <span className={`text-[8px] w-6 text-center ${isT2g ? "text-green-700" : "text-red-700"}`}>{isT2g ? "t₂g" : "e_g"}</span>
                </div>
              )
            })}

            {/* CFSE */}
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 mt-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-purple-400">KMBE:</span>
                <span className="text-yellow-300 font-mono">{(isHS ? cfg.hsCfse : cfg.lsCfse).toFixed(2)}Δ</span>
                <span className="text-purple-400">μ:</span>
                <span className="text-yellow-300 font-mono">{mu} μB</span>
                <span className="text-purple-400">Konfig:</span>
                <span className="text-purple-200 font-mono text-[9px]">{isHS ? cfg.hsConfig : (cfg.lsConfig !== "—" ? cfg.lsConfig : cfg.hsConfig)}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1.5 text-xs">
              {[
                ["Ionlar", cfg.ions],
                ["Oktaedrik", cfg.ohConfig],
                ["KMBE (HS)", `${cfg.hsCfse.toFixed(2)}Δ`],
                canHSLS ? ["KMBE (LS)", `${cfg.lsCfse.toFixed(2)}Δ`] : null,
                ["Magnit moment", cfg.mag],
              ].filter(Boolean).map(([l, v], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-purple-400">{l}:</span>
                  <span className="text-purple-200 font-semibold">{v}</span>
                </div>
              ))}
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">🔬 Misol:</p>
              <p className="text-purple-200">{cfg.example}</p>
              <p className="text-purple-300 mt-1">{cfg.note}</p>
            </div>

            {/* HS/LS comparison for d4-d7 */}
            {canHSLS && (
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-center">
                  <p className="text-blue-400 font-bold">🔵 HS</p>
                  <p className="text-white font-mono">{cfg.hsConfig}</p>
                  <p className="text-blue-300">{cfg.hsCfse.toFixed(2)}Δ</p>
                  <p className="text-blue-300">{cfg.hsSpin} toq e⁻</p>
                </div>
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-center">
                  <p className="text-red-400 font-bold">🔴 LS</p>
                  <p className="text-white font-mono">{cfg.lsConfig === "—" ? "—" : cfg.lsConfig}</p>
                  <p className="text-red-300">{cfg.lsCfse.toFixed(2)}Δ</p>
                  <p className="text-red-300">{cfg.lsSpin} toq e⁻</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. HS vs LS — Δ₀ vs P interaktiv taqqoslash
// ═══════════════════════════════════════════════════════════════════════════════
function HSvsLS() {
  const [dN, setDN] = useState(6)
  const [deltaVal, setDeltaVal] = useState(20000)

  const configs = {
    4: { hsConfig: "t₂g³e_g¹", lsConfig: "t₂g⁴", hsKMBE: -0.60, lsKMBE: -1.60, hsSpin: 4, lsSpin: 2, P: 21000 },
    5: { hsConfig: "t₂g³e_g²", lsConfig: "t₂g⁵", hsKMBE: 0.00, lsKMBE: -2.00, hsSpin: 5, lsSpin: 1, P: 25000 },
    6: { hsConfig: "t₂g⁴e_g²", lsConfig: "t₂g⁶", hsKMBE: -0.40, lsKMBE: -2.40, hsSpin: 4, lsSpin: 0, P: 21500 },
    7: { hsConfig: "t₂g⁵e_g²", lsConfig: "t₂g⁶e_g¹", hsKMBE: -0.80, lsKMBE: -1.80, hsSpin: 3, lsSpin: 1, P: 22500 },
  }

  const c = configs[dN]
  const isHS = deltaVal < c.P
  const deltaE_HS = c.hsKMBE * deltaVal * 0.012
  const deltaE_LS = c.lsKMBE * deltaVal * 0.012
  const totalHS = -deltaE_HS
  const totalLS = -deltaE_LS + c.P * 0.012 * (dN === 4 ? 1 : dN === 5 ? 2 : dN === 6 ? 2 : 1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-amber-400">⚡</span> HS vs LS — Δ₀ va juftlashish energiyasi (P) raqobati
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <div className="space-y-3">
            <div className="flex gap-1.5">
              {[4,5,6,7].map(n => (
                <button key={n} onClick={() => setDN(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${dN === n ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                  d{n}
                </button>
              ))}
            </div>

            <div>
              <p className="text-purple-300 text-xs mb-1">Δ₀ = <span className="text-yellow-300">{deltaVal.toLocaleString()}</span> cm⁻¹</p>
              <input type="range" min={5000} max={40000} step={500} value={deltaVal}
                onChange={(e) => setDeltaVal(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer" style={{ accentColor: "#a855f7" }} />
              <div className="flex justify-between text-[9px] text-purple-500 mt-0.5">
                <span>Kuchsiz 5 000</span>
                <span>P ≈ {c.P.toLocaleString()} cm⁻¹</span>
                <span>Kuchli 40 000</span>
              </div>
            </div>

            <div className={`rounded-lg p-3 text-xs border ${isHS ? "bg-blue-600/10 border-blue-500/30" : "bg-red-600/10 border-red-500/30"}`}>
              <p className={`font-bold ${isHS ? "text-blue-400" : "text-red-400"}`}>
                {isHS ? "🔵 Yuqori spin (HS) barqaror" : "🔴 Past spin (LS) barqaror"}
              </p>
              <p className="text-purple-200 mt-1">
                Δ₀ = {deltaVal.toLocaleString()} cm⁻¹, P = {c.P.toLocaleString()} cm⁻¹
              </p>
              <p className="text-purple-200">
                Δ₀ {isHS ? "<" : ">"} P → {isHS ? "HS (kuchsiz maydon)" : "LS (kuchli maydon)"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`rounded-lg p-3 border ${isHS ? "bg-blue-600/10 border-blue-500/30 ring-2 ring-blue-500/40" : "bg-purple-900/50 border-purple-700/30"}`}>
              <p className="text-blue-400 font-bold text-xs">🔵 HS — {c.hsConfig}</p>
              <p className="text-purple-200 text-[10px]">KMBE = {c.hsKMBE.toFixed(2)}Δ = {Math.abs(deltaE_HS).toFixed(1)} kJ/mol</p>
              <p className="text-purple-200 text-[10px]">Juftlanmagan: {c.hsSpin} ta | μ = {Math.sqrt(c.hsSpin * (c.hsSpin + 2)).toFixed(2)} μB</p>
            </div>
            <div className={`rounded-lg p-3 border ${!isHS ? "bg-red-600/10 border-red-500/30 ring-2 ring-red-500/40" : "bg-purple-900/50 border-purple-700/30"}`}>
              <p className="text-red-400 font-bold text-xs">🔴 LS — {c.lsConfig}</p>
              <p className="text-purple-200 text-[10px]">KMBE = {c.lsKMBE.toFixed(2)}Δ = {Math.abs(deltaE_LS).toFixed(1)} kJ/mol</p>
              <p className="text-purple-200 text-[10px]">Juftlanmagan: {c.lsSpin} ta | μ = {c.lsSpin > 0 ? Math.sqrt(c.lsSpin * (c.lsSpin + 2)).toFixed(2) : "0"} μB</p>
            </div>

            {/* Δ vs P vizual */}
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
              <p className="text-[9px] text-purple-400 mb-2">Δ₀ vs P vizual taqqoslash:</p>
              <div className="h-6 relative bg-purple-950/80 rounded overflow-hidden border border-purple-700/30">
                <div className="absolute inset-y-0 left-0 bg-yellow-600/50 transition-all" style={{ width: `${(deltaVal / 40000) * 100}%` }} />
                <div className="absolute inset-y-0 bg-purple-400/30 transition-all" style={{ left: `${(c.P / 40000) * 100}%`, width: "3px" }} />
                <div className="absolute inset-0 flex items-center justify-between px-2 text-[8px]">
                  <span className="text-yellow-300">Δ₀ = {deltaVal.toLocaleString()}</span>
                  <span className="text-purple-300">|</span>
                  <span className="text-purple-400">P = {c.P.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-[9px] text-purple-400 mt-1">
                {isHS ? "Δ₀ < P → HS barqaror (kuchsiz maydon)" : "Δ₀ > P → LS barqaror (kuchli maydan)"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
          <p className="text-yellow-400 font-bold">💡 Nima uchun d⁴-d⁷ da ikki xil spin?</p>
          <p className="text-purple-200">d⁴–d⁷ da elektronlar t₂g ni to'ldirgandan keyin yo e_g ga chiqadi (HS, Δ₀ {'<'} P), yoki t₂g da juftlashadi (LS, Δ₀ {'>'} P). Juftlashish energiyasi P ~ 20000-25000 cm⁻¹.</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MAGNIT MOMENT — TO'LIQ KALKULYATOR
// ═══════════════════════════════════════════════════════════════════════════════
function MagnitKalkulyator() {
  const [n, setN] = useState(3)
  const spinMu = Math.sqrt(n * (n + 2))
  const orbMu = Math.sqrt(n * (n + 2) + 0.5 * (n === 0 ? 0 : 1)).toFixed(2)

  const ionData = [
    { n: 0, ions: "Zn²⁺, Cu⁺, Fe²⁺(LS)", d: "d¹⁰ / d⁶ LS", mu: 0, type: "Diamagnit", color: "text-gray-400" },
    { n: 1, ions: "Cu²⁺, Fe³⁺(LS), Co²⁺(LS)", d: "d⁹ / d⁵ LS / d⁷ LS", mu: 1.73, type: "Paramagnit", color: "text-sky-400" },
    { n: 2, ions: "Ni²⁺, Cr²⁺(LS), V³⁺", d: "d⁸ / d⁴ LS / d²", mu: 2.83, type: "Paramagnit", color: "text-green-400" },
    { n: 3, ions: "Cr³⁺, Co²⁺(HS), V²⁺", d: "d³ / d⁷ HS / d²", mu: 3.87, type: "Paramagnit", color: "text-blue-400" },
    { n: 4, ions: "Fe²⁺(HS), Cr²⁺(HS)", d: "d⁶ HS / d⁴ HS", mu: 4.90, type: "Paramagnit", color: "text-orange-400" },
    { n: 5, ions: "Fe³⁺(HS), Mn²⁺(HS)", d: "d⁵ HS", mu: 5.92, type: "Paramagnit", color: "text-red-400" },
  ]

  const match = ionData.find(i => i.n === n) || ionData[0]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-rose-400">🧲</span> Magnit moment kalkulyatori — μ = √<span className="underline">n(n+2)</span>
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <p className="text-purple-300 text-xs">Toq elektronlar sonini tanlang:</p>
            <div className="flex gap-1.5 flex-wrap">
              {[0,1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setN(i)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs font-bold transition-all ${n === i ? "bg-rose-600 text-white ring-2 ring-rose-400" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                  {i}
                </button>
              ))}
            </div>

            <div className="bg-purple-950/80 border border-rose-500/30 rounded-lg p-4 text-center">
              <p className="text-purple-400 text-[10px]">Spin-only formula: μ = √{n}·({n}+2) = √{n*(n+2)}</p>
              <p className="text-4xl font-bold text-yellow-300 font-mono">{spinMu.toFixed(2)} <span className="text-lg">μB</span></p>
              <p className="text-purple-400 text-xs mt-1">{match.type}</p>
            </div>

            <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[9px]">
              <p className="text-purple-400">Orbital hissasi bilan: μ_eff ≈ {orbMu} μB (spin-orbit bog'lanish)</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs">dⁿ ionlar va magnit momentlari:</h4>
            <div className="space-y-1">
              {ionData.map((row, i) => (
                <div key={i} className={`flex items-center justify-between p-1.5 rounded-lg text-[10px] sm:text-xs transition-all ${
                  n === row.n ? "bg-rose-600/20 border border-rose-500/40 ring-1 ring-rose-500/30" : "bg-purple-950/40 hover:bg-purple-800/30"
                }`} onClick={() => setN(row.n)}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold w-6">{row.n}</span>
                    <span className="text-purple-200">{row.ions}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-[9px]">{row.d}</span>
                    <span className={`font-mono font-bold ${row.color}`}>{row.mu.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[9px]">
              <p className="text-yellow-400 font-bold">⚠️ Eslatma:</p>
              <p className="text-purple-200">Spin-orbit bog'lanish + orbit hissasi tufayli eksperimental qiymatlar nazariydan farq qiladi. Masalan, Cu²⁺ va Ni²⁺ da spin-orbit katta.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. d¹–d¹⁰ TO'LIQ JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function DnJadval() {
  const [sortBy, setSortBy] = useState("d")

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📊</span> d¹–d¹⁰ konfiguratsiyalar — to'liq jadval
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-1.5 sm:p-2 text-left text-purple-200">dⁿ</th>
                <th className="p-1.5 sm:p-2 text-left text-purple-200">Ionlar</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">HS konfig</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">LS konfig</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden sm:table-cell">HS spin</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden sm:table-cell">LS spin</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200">μ (HS)</th>
                <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden md:table-cell">KMBE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(D_CONFIGS).map(([key, cfg], i) => (
                <tr key={key} className={`border-t border-purple-800/30 ${i % 2 === 0 ? "bg-purple-900/20" : "bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className={`p-1.5 sm:p-2 font-bold font-mono ${cfg.color}`}>d{key}</td>
                  <td className="p-1.5 sm:p-2 text-purple-200">{cfg.ions}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-200 font-mono">{cfg.hsConfig}</td>
                  <td className="p-1.5 sm:p-2 text-center text-purple-200 font-mono">{cfg.lsConfig !== "—" ? cfg.lsConfig : "—"}</td>
                  <td className="p-1.5 sm:p-2 text-center hidden sm:table-cell">{cfg.hsSpin}</td>
                  <td className="p-1.5 sm:p-2 text-center hidden sm:table-cell">{cfg.lsSpin}</td>
                  <td className="p-1.5 sm:p-2 text-center text-yellow-300 font-mono">{cfg.mag.split(" ")[0]}</td>
                  <td className="p-1.5 sm:p-2 text-center text-yellow-300 font-mono hidden md:table-cell">{cfg.hsCfse.toFixed(2)}Δ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestKonfig() {
  const questions = [
    { q: "Xund qoidasiga ko'ra, elektronlar orbitallarga qanday joylashadi?", a: "Avval parallel spin bilan, keyin juftlashadi", opts: ["Avval juftlashadi", "Avval parallel spin bilan, keyin juftlashadi", "Energiya bo'yicha", "Tasodifiy"], hint: "Energiya jihatidan eng qulay" },
    { q: "Qaysi dⁿ konfiguratsiyada HS va LS mavjud bo'lishi mumkin?", a: "d⁴, d⁵, d⁶, d⁷", opts: ["d¹, d², d³", "d⁴, d⁵, d⁶, d⁷", "d⁸, d⁹, d¹⁰", "Barcha dⁿ"], hint: "t₂g to'lgandan keyingilari" },
    { q: "d⁶ LS konfiguratsiyada nechta juftlanmagan elektron bor?", a: "0 (diamagnit)", opts: ["4", "2", "0 (diamagnit)", "1"], hint: "t₂g⁶ — to'liq to'lgan" },
    { q: "μ = √n(n+2) formulada n nimani anglatadi?", a: "Juftlanmagan elektronlar soni", opts: ["Barcha elektronlar", "Juftlanmagan elektronlar soni", "Orbitallar soni", "dⁿ dagi n"], hint: "Spin-only formula" },
    { q: "Kuchli maydon ligandlari (CN⁻, CO) qanday spin hosil qiladi?", a: "Past spin (LS)", opts: ["Yuqori spin (HS)", "Past spin (LS)", "Ikkala spin", "Spinsiz"], hint: "Δ₀ > P" },
    { q: "Fe²⁺ (d⁶) uchun HS va LS magnit momentlari?", a: "HS: 4.90, LS: 0 BM", opts: ["HS: 4.90, LS: 0 BM", "HS: 5.92, LS: 1.73 BM", "HS: 3.87, LS: 1.73 BM", "HS: 0, LS: 4.90 BM"], hint: "HS da 4, LS da 0 juftlanmagan" },
    { q: "Jahn-Teller effekti qaysi konfiguratsiyada kuzatiladi?", a: "d⁹ (Cu²⁺), d⁷ LS, d⁴ HS", opts: ["d¹⁰ (Zn²⁺)", "d⁹ (Cu²⁺), d⁷ LS, d⁴ HS", "d⁵ (Fe³⁺)", "d² (V³⁺)"], hint: "Degenerat sathlarda assimetrik to'ldirish" },
    { q: "d⁸ konfiguratsiya nechta juftlanmagan elektronga ega?", a: "2 ta", opts: ["0", "1", "2 ta", "3 ta"], hint: "t₂g⁶ e_g²" },
    { q: "Kuchsiz maydon ligandlari (I⁻, Br⁻) bilan qaysi spin barqaror?", a: "Yuqori spin (HS)", opts: ["Yuqori spin (HS)", "Past spin (LS)", "Ikkalasi", "Hech biri"], hint: "Kichik Δ₀" },
    { q: "t₂g⁶ e_g² qaysi dⁿ ga to'g'ri keladi?", a: "d⁸", opts: ["d⁶", "d⁷", "d⁸", "d⁹"], hint: "t₂g da 6 + e_g da 2 = jami 8" },
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
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>
              {s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span>
            </div>
            <button onClick={() => { if (c < questions.length - 1) { setC(p => p + 1); setS(null) } else setRes(true) }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">
              {c < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function ElektronKonfiguratsiyalar() {
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
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="hover:text-purple-300">Atom tuzilishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-cyan-400">Elektron konfiguratsiyalar</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <span>🔄</span> d-elektron konfiguratsiyalar
              </h1>
              <p className="text-[10px] sm:text-xs text-purple-500">d¹–d¹⁰ • Xund qoidasi • HS/LS • Magnit moment • OTM darajasi</p>
            </div>
            <button onClick={() => setView(view === "all" ? "calc" : "all")}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
              {view === "all" ? "🧮 Kalkulyator" : "📄 To'liq"}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Elektronlarning joylashish qoidalari</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                d-elektronlarning <strong className="text-cyan-400">orbitallarga joylashishi</strong> uchta asosiy qoidaga bo'ysunadi:
                <strong className="text-yellow-400"> Pauli prinsipi, Xund qoidasi va energiya minimumi prinsipi.</strong>
                Oktaedrik maydonda d-elektronlar avval t₂g (stabillashgan), keyin e_g (destabillashgan) orbitallarni to'ldiradi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">d¹–d¹⁰ jadval</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">Magnit kalk.</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">🎯 Maqsad:</span> d-elektronlarning orbitallarga joylashish qoidalari, HS/LS farqi, magnit moment hisobini tushunish.</p>
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30 flex gap-4 justify-center">
                <span className="text-green-400 font-mono font-bold">t₂g (↓)</span>
                <span className="text-purple-400">+</span>
                <span className="text-red-400 font-mono font-bold">e_g (↑)</span>
                <span className="text-purple-400">=</span>
                <span className="text-yellow-300 font-mono font-bold">dⁿ</span>
              </div>
            </div>
          </div>
        </div>

        {/* KONFIGURATSIYA VIZUALIZATORI (har doim) */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <KonfiguratsiyaVizual />
        </div>

        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <DnJadval />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <HSvsLS />
            </div>
          </>
        )}

        {/* MAGNIT KALKULYATOR (har doim) */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <MagnitKalkulyator />
        </div>

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestKonfig />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>Elektronlar <strong className="text-yellow-400">Pauli, Xund va energiya minimumi</strong> qoidalari asosida joylashadi</li>
            <li>Oktaedrik maydonda: <strong>t₂g (stabillashgan) → e_g (destabillashgan)</strong></li>
            <li><strong>HS:</strong> Δ₀ &lt; P — ko'p toq e⁻, paramagnit. <strong>LS:</strong> Δ₀ &gt; P — kam toq e⁻</li>
            <li>d⁴–d⁷ konfiguratsiyalarda <strong>har ikkala spin holati</strong> mavjud</li>
            <li><strong>d⁶ LS (t₂g⁶):</strong> diamagnit — eng barqaror. <strong>d⁹ (Cu²⁺):</strong> Jahn-Teller faol</li>
            <li>Magnit moment: <strong>μ_s = √(n(n+2)) μB</strong></li>
            <li>Kuchli ligand (CN⁻) → LS. Kuchsiz ligand (I⁻, Br⁻) → HS</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> d-orbital energiyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/metallar"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20">
            Kompleks metallar <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manbalar:</strong> Cotton & Wilkinson — Advanced Inorganic Chemistry | Housecroft — Inorganic Chemistry | Nasimov, Tashpulatov — Noorganik kimyo</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
