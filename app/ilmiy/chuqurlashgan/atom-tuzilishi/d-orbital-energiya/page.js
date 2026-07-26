"use client"

import Link from "next/link"
import { useState, useEffect, useMemo, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ENERGETIK AJRALISH — CANVAS ANIMATSIYALI
// ═══════════════════════════════════════════════════════════════════════════════
function EnergetikAjralishCanvas() {
  const [geo, setGeo] = useState("oh")
  const [dE, setDE] = useState(20000)
  const canvasRef = useRef(null)

  const configs = {
    oh: {
      name: "Oktaedrik (O_h)",
      color: "#60a5fa",
      levels: [
        { label: "e_g", en: 0.6, count: 2, color: "#ef4444", orbitals: "d_z², d_x²−y²" },
        { label: "t₂g", en: -0.4, count: 3, color: "#22c55e", orbitals: "d_xy, d_xz, d_yz" },
      ],
      deltaLabel: "Δ₀ = 10 Dq",
      deltaVal: 1.0,
      note: "6 ta ligand. t₂g stabillashgan (−0.4Δ₀), e_g destabillashgan (+0.6Δ₀)"
    },
    td: {
      name: "Tetraedrik (T_d)",
      color: "#22c55e",
      levels: [
        { label: "t₂", en: 0.4, count: 3, color: "#ef4444", orbitals: "d_xy, d_xz, d_yz" },
        { label: "e", en: -0.6, count: 2, color: "#22c55e", orbitals: "d_z², d_x²−y²" },
      ],
      deltaLabel: "Δ_t ≈ 4/9·Δ₀ ≈ 0.44Δ₀",
      deltaVal: 0.44,
      note: "4 ta ligand. Teskari ajralish. Kichik Δ → har doim yuqori spin."
    },
    d4h: {
      name: "Kvadrat tekis (D4h)",
      color: "#a855f7",
      levels: [
        { label: "b₁g", en: 1.2, count: 1, color: "#dc2626", orbitals: "d_x²−y²" },
        { label: "b₂g", en: 0.6, count: 1, color: "#f97316", orbitals: "d_xy" },
        { label: "a₁g", en: 0.1, count: 1, color: "#eab308", orbitals: "d_z²" },
        { label: "e_g", en: -0.5, count: 2, color: "#22c55e", orbitals: "d_xz, d_yz" },
      ],
      deltaLabel: "Eng katta ajralish",
      deltaVal: 1.7,
      note: "4 ta ekvatorial ligand. d⁸ metallar (Pt²⁺, Pd²⁺) uchun xos."
    }
  }

  const cfg = configs[geo]
  const minEn = -0.9
  const maxEn = 1.5
  const enRange = maxEn - minEn

  // Canvasda chizish
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height

    ctx.clearRect(0, 0, w, h)

    // ── Background ──
    const grad = ctx.createLinearGradient(0, 0, 0, h)
    grad.addColorStop(0, "rgba(15, 0, 30, 0.95)")
    grad.addColorStop(1, "rgba(5, 0, 18, 0.95)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // ── Layout ──
    const margin = { top: 30, bottom: 25, left: 80, right: 120 }
    const diagW = w - margin.left - margin.right
    const diagH = h - margin.top - margin.bottom
    const centerX = margin.left + diagW / 2
    const levelW = diagW * 0.55

    const enToY = (en) => margin.top + diagH * (1 - (en - minEn) / enRange)

    // ── Background grid (horizontal lines) ──
    ctx.strokeStyle = "rgba(139, 92, 246, 0.12)"
    ctx.lineWidth = 0.5
    ctx.setLineDash([3, 4])
    for (let e = -0.8; e <= 1.4; e += 0.2) {
      const y = enToY(e)
      ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(w - margin.right, y); ctx.stroke()
      ctx.fillStyle = "rgba(139, 92, 246, 0.25)"
      ctx.font = "9px monospace"
      ctx.textAlign = "right"
      ctx.fillText(e >= 0 ? `+${e.toFixed(1)}` : e.toFixed(1), margin.left - 8, y + 3)
    }

    // ── Baritsentr (E=0) line ──
    const barY = enToY(0)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 4])
    ctx.beginPath(); ctx.moveTo(margin.left - 5, barY); ctx.lineTo(w - margin.right + 5, barY); ctx.stroke()
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
    ctx.font = "9px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("E = 0 (baritsentr)", w - margin.right - 150, barY - 4)

    // ── Energy levels ──
    ctx.setLineDash([])

    cfg.levels.forEach((lvl) => {
      const y = enToY(lvl.en)
      const col = lvl.color
      const gap = 8
      const singleW = (levelW - (lvl.count - 1) * gap) / lvl.count

      for (let i = 0; i < lvl.count; i++) {
        const x = centerX - levelW / 2 + i * (singleW + gap)

        // Level bar with rounded corners
        const barH = 14
        ctx.fillStyle = col + "80"
        ctx.shadowColor = col + "40"
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.roundRect(x, y - barH/2, singleW, barH, 3)
        ctx.fill()
        ctx.shadowBlur = 0

        // Inner glow
        ctx.fillStyle = col + "30"
        ctx.beginPath()
        ctx.roundRect(x + 2, y - barH/2 + 2, singleW - 4, barH - 4, 2)
        ctx.fill()

        // Small dot for each orbital
        ctx.fillStyle = col
        ctx.beginPath()
        ctx.arc(x + singleW/2, y - barH/2 - 5, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Label on the right
      ctx.fillStyle = col
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`${lvl.label} (${lvl.count})`, centerX + levelW/2 + 10, y + 4)

      // Orbitals on the right
      ctx.fillStyle = "rgba(200, 180, 240, 0.6)"
      ctx.font = "9px sans-serif"
      ctx.fillText(lvl.orbitals, centerX + levelW/2 + 10, y + 18)

      // Energy value on the left
      ctx.fillStyle = lvl.en >= 0 ? "#fca5a5" : "#86efac"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "right"
      ctx.fillText(`${lvl.en >= 0 ? "+" : ""}${lvl.en.toFixed(1)}Δ`, centerX - levelW/2 - 10, y + 4)
    })

    // ── Delta arrow (between highest and lowest) ──
    if (cfg.levels.length >= 2) {
      const lowest = cfg.levels.reduce((a, b) => a.en < b.en ? a : b)
      const highest = cfg.levels.reduce((a, b) => a.en > b.en ? a : b)
      const yLow = enToY(lowest.en)
      const yHigh = enToY(highest.en)
      const arrowX = centerX + levelW/2 + 90

      // Arrow line
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 2
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(arrowX, yLow)
      ctx.lineTo(arrowX, yHigh)
      ctx.stroke()

      // Arrow head (top)
      ctx.beginPath()
      ctx.moveTo(arrowX - 5, yHigh + 6)
      ctx.lineTo(arrowX, yHigh)
      ctx.lineTo(arrowX + 5, yHigh + 6)
      ctx.stroke()
      ctx.fillStyle = "#fbbf24"
      ctx.fill()

      // Arrow head (bottom)
      ctx.beginPath()
      ctx.moveTo(arrowX - 5, yLow - 6)
      ctx.lineTo(arrowX, yLow)
      ctx.lineTo(arrowX + 5, yLow - 6)
      ctx.stroke()

      // Delta label
      ctx.fillStyle = "#fbbf24"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      const midY = (yLow + yHigh) / 2
      ctx.fillText(geo !== "d4h" ? "Δ" : "Δ_max", arrowX - 18, midY + 4)
      ctx.font = "8px sans-serif"
      ctx.fillText(cfg.deltaLabel, arrowX - 18, midY + 16)
    }

    // ── Title ──
    ctx.fillStyle = "#a78bfa"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(cfg.name, margin.left, 18)
    ctx.fillStyle = "rgba(168, 85, 247, 0.5)"
    ctx.font = "9px sans-serif"
    ctx.fillText("E (energiya)", margin.left + 150, 18)

    // ── Stabilization arrow indicators ──
    // Stabilized text at bottom
    cfg.levels.forEach((lvl) => {
      if (lvl.en < 0) {
        const y = enToY(lvl.en)
        ctx.fillStyle = "rgba(34, 197, 94, 0.25)"
        ctx.font = "8px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText("✓ stabillashgan", centerX - levelW/2 - 10, y + 18)
      }
      if (lvl.en > 0) {
        const y = enToY(lvl.en)
        ctx.fillStyle = "rgba(239, 68, 68, 0.25)"
        ctx.font = "8px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText("✗ destabillashgan", centerX - levelW/2 - 10, y + 18)
      }
    })

    // ── Ligand count icon ──
    const ligandCount = cfg.levels.reduce((sum, l) => sum + l.count, 0)
    ctx.fillStyle = "rgba(168, 85, 247, 0.3)"
    ctx.font = "9px sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`⚙ ${ligandCount} ta ligand • ${cfg.name.split("(")[0]}`, w - margin.right, 18)

  }, [geo])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-yellow-400">⚡</span> Kristall maydonda energetik ajralish — interaktiv
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(configs).map(([key, val]) => (
          <button key={key} onClick={() => setGeo(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${geo === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {val.name}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <canvas ref={canvasRef} width={700} height={380} className="w-full h-72 sm:h-80 bg-purple-950/60 rounded-lg" />

        <div className="mt-4 space-y-2">
          <div className="flex justify-center gap-4 text-[10px] text-purple-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-400 inline-block" /> Stabillashgan</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-400 inline-block" /> Destabillashgan</span>
            <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-yellow-400 inline-block" /> Ajralish energiyasi (Δ)</span>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400 font-bold">💡 </p>
            <p className="text-purple-200">{cfg.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. KMBE (CFSE) KALKULYATOR — 3 geometriya + dⁿ
// ═══════════════════════════════════════════════════════════════════════════════
function CFSEKalkulyator() {
  const [geo, setGeo] = useState("oh")
  const [dN, setDN] = useState(6)
  const [deltaVal, setDeltaVal] = useState(25000)

  const result = useMemo(() => {
    const d = dN
    let hsCFSE = 0, lsCFSE = 0, hsSpin = 0, lsSpin = 0
    let hsConfig = "", lsConfig = ""
    let r = { cfse: 0, spin: 0, config: "", isHSLS: false, hsCFSE: 0, lsCFSE: 0, hsSpin: 0, lsSpin: 0 }

    if (geo === "oh") {
      if (d <= 3) {
        // d1-d3: only one spin state
        const t2g = d, eg = 0
        hsCFSE = -0.4 * t2g + 0.6 * eg
        hsSpin = d; hsConfig = `t₂g${t2g} e_g${eg}`
        r = { cfse: hsCFSE, spin: hsSpin, config: hsConfig, isHSLS: false, hsCFSE, lsCFSE: hsCFSE, hsSpin, lsSpin: hsSpin }
      } else if (d <= 7) {
        // d4-d7: HS vs LS
        // HS: fill t2g with 1 e⁻ each first, then pair
        const hs_t2g = d <= 5 ? d : (d <= 6 ? 4 : 5)
        const hs_eg = d <= 4 ? d-3 : (d <= 5 ? d-3 : (d <= 6 ? 2 : 2))
        hsCFSE = -0.4 * hs_t2g + 0.6 * hs_eg
        hsSpin = d - 4
        hsConfig = `t₂g${hs_t2g} e_g${hs_eg}`
        // LS: fill t2g completely first
        const ls_t2g = d <= 6 ? d : 6
        const ls_eg = d <= 6 ? 0 : d - 6
        lsCFSE = -0.4 * ls_t2g + 0.6 * ls_eg
        lsSpin = d >= 4 && d <= 6 ? (6 - d) : (d - 6)
        lsConfig = `t₂g${ls_t2g} e_g${ls_eg}`
        r = { cfse: deltaVal > 20000 ? lsCFSE : hsCFSE, spin: deltaVal > 20000 ? lsSpin : hsSpin, config: deltaVal > 20000 ? lsConfig : hsConfig, isHSLS: true, hsCFSE, lsCFSE, hsSpin, lsSpin }
      } else {
        // d8-d10
        const t2g = 6, eg = d - 6
        hsCFSE = -0.4 * 6 + 0.6 * eg
        hsSpin = 10 - d
        hsConfig = `t₂g${t2g} e_g${eg}`
        r = { cfse: hsCFSE, spin: hsSpin, config: hsConfig, isHSLS: false, hsCFSE, lsCFSE: hsCFSE, hsSpin, lsSpin: hsSpin }
      }
    } else if (geo === "td") {
      if (d <= 3) {
        const e = d, t2 = 0
        hsCFSE = 0.6 * e + (-0.4) * t2
        hsSpin = d; hsConfig = `e${e} t₂${t2}`
      } else if (d <= 5) {
        const e = 3, t2 = d - 3
        hsCFSE = 0.6 * 3 + (-0.4) * t2
        hsSpin = d; hsConfig = `e${e} t₂${t2}`
      } else if (d <= 8) {
        const e = 3 + (d - 5), t2 = 2
        hsCFSE = 0.6 * 3 + (-0.4) * 2 + 0.6 * (d - 5)
        hsSpin = d - 4; hsConfig = `e${e} t₂${t2}`
      } else {
        const e = 6, t2 = d - 6
        hsCFSE = 0.6 * 3 + (-0.4) * 2 + 0.6 * 3 + (-0.4) * (d - 6)
        hsSpin = 10 - d; hsConfig = `e${e} t₂${t2}`
      }
      r = { cfse: hsCFSE * 0.44, spin: hsSpin, config: `T_d: ${hsConfig}`, isHSLS: false, hsCFSE: hsCFSE * 0.44, lsCFSE: hsCFSE * 0.44, hsSpin, lsSpin: hsSpin }
    } else {
      // D4h approximate
      const levels = [
        { en: 1.2, count: 0 }, // dx2y2
        { en: 0.6, count: 0 }, // dxy
        { en: 0.1, count: 0 }, // dz2
        { en: -0.5, count: 0 }, // dxz, dyz
      ]
      let remaining = d
      let cfse = 0
      let s = 0
      for (const lvl of levels) {
        const maxE = lvl.label === "e_g" ? 4 : 2
        const fill = Math.min(remaining, maxE)
        lvl.count = fill
        remaining -= fill
        if (fill > 0) {
          cfse += lvl.en * fill
          if (fill === 1) s++
        }
      }
      r = { cfse, spin: remaining > 0 ? remaining : 0, config: `D4h: d${d}`, isHSLS: false, hsCFSE: cfse, lsCFSE: cfse, hsSpin: s, lsSpin: s }
    }

    r.energy = (r.cfse * deltaVal * 0.012).toFixed(1)
    r.hsEnergy = (r.hsCFSE * deltaVal * 0.012).toFixed(1)
    r.lsEnergy = (r.lsCFSE * deltaVal * 0.012).toFixed(1)
    return r
  }, [geo, dN, deltaVal])

  const geoLabel = { oh: "Oktaedrik (O_h)", td: "Tetraedrik (T_d)", d4h: "Kvadrat (D4h)" }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-orange-400">🧮</span> KMBE (CFSE) — real vaqtli kalkulyator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Boshqaruv */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-5 space-y-4">
          <div>
            <p className="text-purple-300 text-xs mb-1.5 font-semibold">Geometriya:</p>
            <div className="flex gap-1.5 flex-wrap">
              {Object.entries(geoLabel).map(([key, val]) => (
                <button key={key} onClick={() => setGeo(key)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${geo === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 text-xs mb-1.5 font-semibold">d-elektronlar (dⁿ): <span className="text-yellow-300">{dN}</span></p>
            <div className="flex gap-1 flex-wrap">
              {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setDN(n)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${dN === n ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 text-xs mb-1.5 font-semibold">Δₒ <span className="text-yellow-300">{deltaVal.toLocaleString()} cm⁻¹</span></p>
            <input type="range" min={5000} max={40000} step={500} value={deltaVal}
              onChange={(e) => setDeltaVal(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer"
              style={{ accentColor: "#a855f7" }} />
            <div className="flex justify-between text-[9px] text-purple-500 mt-0.5">
              <span>Kuchsiz 5 000</span>
              <span>Kuchli 40 000</span>
            </div>
          </div>
        </div>

        {/* Natija */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-5 space-y-3">
          <h4 className="text-white font-bold text-xs">📊 KMBE natijalari</h4>

          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-[10px] text-purple-400">KMBE (Δ birligida)</p>
            <p className="text-3xl sm:text-4xl font-bold text-yellow-300 font-mono">{result.cfse.toFixed(2)} <span className="text-base sm:text-lg">Δ</span></p>
            <p className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">{result.energy} kJ/mol</p>
          </div>

          {result.isHSLS ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-center">
                <p className="text-blue-400 text-[9px] font-bold">HS</p>
                <p className="text-white font-mono text-sm font-bold">{result.hsCFSE.toFixed(2)}Δ</p>
                <p className="text-blue-300 text-[9px]">{result.hsEnergy} kJ/mol</p>
                <p className="text-blue-300 text-[9px]">Spin: {result.hsSpin}</p>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-center">
                <p className="text-red-400 text-[9px] font-bold">LS</p>
                <p className="text-white font-mono text-sm font-bold">{result.lsCFSE.toFixed(2)}Δ</p>
                <p className="text-red-300 text-[9px]">{result.lsEnergy} kJ/mol</p>
                <p className="text-red-300 text-[9px]">Spin: {result.lsSpin}</p>
              </div>
            </div>
          ) : (
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-center">
              <p className="text-[10px] text-purple-400">Spin: <span className="text-white font-bold">{result.spin}</span> ta juftlanmagan</p>
              <p className="text-[9px] text-purple-400">μ = {Math.sqrt(result.spin * (result.spin + 2)).toFixed(2)} μB</p>
            </div>
          )}

          <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[10px] text-center">
            <span className="text-purple-400">{result.config}</span>
          </div>

          {/* d-orbital diagram mini */}
          <div className="flex items-end gap-1 h-12 bg-purple-950/60 rounded-lg p-2">
            {result.isHSLS ? (
              <>
                <div className="flex-1 h-full flex flex-col justify-end items-center">
                  <div className="w-3 h-1 bg-red-500 rounded" />
                  <span className="text-[7px] text-purple-400 mt-0.5">e_g</span>
                </div>
                <div className="flex-1 h-1/2 flex flex-col justify-end items-center">
                  <div className="w-3 h-1 bg-green-500 rounded" />
                  <span className="text-[7px] text-purple-400 mt-0.5">t₂g</span>
                </div>
              </>
            ) : (
              Array.from({length: 5}).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end">
                  <div className={`w-full h-1 rounded ${i < Math.min(dN, 5) ? "bg-purple-400" : "bg-purple-900"}`}
                    style={{ height: `${Math.min(dN, 5) > 0 ? 100 : 20}%` }} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Spektrokimyoviy qator — to'liq interaktiv
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrokimyoviyQator() {
  const ligands = [
    { name: "I⁻", val: 0.3, color: "bg-red-500", type: "π-donor", delta: "—" },
    { name: "Br⁻", val: 0.35, color: "bg-orange-500", type: "π-donor", delta: "—" },
    { name: "Cl⁻", val: 0.42, color: "bg-yellow-500", type: "π-donor", delta: "~13 000" },
    { name: "F⁻", val: 0.48, color: "bg-lime-500", type: "π-donor", delta: "~15 000" },
    { name: "H₂O", val: 0.6, color: "bg-cyan-500", type: "σ-donor", delta: "18 200" },
    { name: "NH₃", val: 0.75, color: "bg-blue-500", type: "σ-donor", delta: "~23 000" },
    { name: "en", val: 0.85, color: "bg-indigo-500", type: "σ-donor", delta: "~25 000" },
    { name: "CN⁻", val: 0.95, color: "bg-violet-500", type: "π-akseptor", delta: "~33 000" },
    { name: "CO", val: 1.0, color: "bg-purple-500", type: "π-akseptor", delta: "~35 000" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📊</span> Spektrokimyoviy qator — Δ₀ va ligand turlari
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="flex items-end gap-1.5 h-40 sm:h-48 mb-3">
          {ligands.map((l, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className="text-[9px] text-yellow-300 font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {l.delta} cm⁻¹
              </div>
              <div className={`w-full rounded-t-lg group-hover:scale-105 transition-transform relative ${l.color}`}
                style={{ height: `${l.val * 75}px`, minHeight: "25px" }}>
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-purple-400 opacity-0 group-hover:opacity-100 whitespace-nowrap">{l.type}</span>
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-purple-300 group-hover:text-white transition-colors mt-1">{l.name}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-purple-400 mb-3">
          <span className="text-red-400">🔴 π-donor (kuchsiz)</span>
          <span className="text-cyan-400">🔵 σ-donor (o'rta)</span>
          <span className="text-purple-400">🟣 π-akseptor (kuchli)</span>
        </div>

        <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-purple-200"><strong className="text-yellow-400">Spektrokimyoviy qator:</strong> I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; CN⁻ &lt; CO</p>
          <p className="text-purple-300"><strong className="text-purple-400">π-donor:</strong> elektron beradi → t₂g ni destabilizatsiya → kichik Δ₀ (kuchsiz maydon, HS)</p>
          <p className="text-purple-300"><strong className="text-purple-400">π-akseptor:</strong> elektron oladi → t₂g ni stabilizatsiya → katta Δ₀ (kuchli maydon, LS)</p>
          <p className="text-purple-300"><strong className="text-purple-400">σ-donor:</strong> faqat σ bog' → o'rtacha Δ₀</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Δ₀ ga ta'sir etuvchi omillar — interaktiv davriy jadval
// ═══════════════════════════════════════════════════════════════════════════════
function DeltaOmillar() {
  const [tab, setTab] = useState("oxidation")

  const content = {
    oxidation: {
      title: "1. Oksidlanish darajasi",
      desc: "Oksidlanish darajasi oshgan sari Δ₀ ORTADI.",
      reason: "Yuqori zaryadli metall → ligandlarni kuchliroq tortadi → katta ajralish.",
      data: [
        ["[Co(H₂O)₆]²⁺", "Co²⁺", "d⁷", "9 300 cm⁻¹"],
        ["[Co(H₂O)₆]³⁺", "Co³⁺", "d⁶", "18 200 cm⁻¹"],
        ["[Fe(H₂O)₆]²⁺", "Fe²⁺", "d⁶", "10 400 cm⁻¹"],
        ["[Fe(H₂O)₆]³⁺", "Fe³⁺", "d⁵", "14 300 cm⁻¹"],
      ],
      color: "text-red-400", bg: "bg-red-600/10 border-red-500/30",
    },
    period: {
      title: "2. Metall davri (3d → 4d → 5d)",
      desc: "3d → 4d → 5d o'tganda Δ₀ ~30-50% ga ortadi.",
      reason: "4d va 5d orbitallar kengroq → ligand bilan ko'proq qoplanish → katta Δ₀.",
      data: [
        ["[Co(NH₃)₆]³⁺", "Co³⁺", "3d⁶", "23 000 cm⁻¹"],
        ["[Rh(NH₃)₆]³⁺", "Rh³⁺", "4d⁶", "34 000 cm⁻¹"],
        ["[Ir(NH₃)₆]³⁺", "Ir³⁺", "5d⁶", "41 000 cm⁻¹"],
        ["[Fe(CN)₆]⁴⁻", "Fe²⁺", "3d⁶", "33 000 cm⁻¹"],
        ["[Ru(CN)₆]⁴⁻", "Ru²⁺", "4d⁶", "45 000 cm⁻¹"],
      ],
      color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30",
    },
    ligand: {
      title: "3. Ligand tabiati",
      desc: "Spektrokimyoviy qator bo'yicha ligand kuchi ortadi.",
      reason: "π-akseptor (CO, CN⁻) → katta Δ₀. π-donor (I⁻, Br⁻) → kichik Δ₀. σ-donor → o'rtacha Δ₀.",
      data: [
        ["[CoCl₆]⁴⁻", "Cl⁻", "π-donor", "~9 000 cm⁻¹"],
        ["[Co(H₂O)₆]²⁺", "H₂O", "σ-donor", "9 300 cm⁻¹"],
        ["[Co(NH₃)₆]³⁺", "NH₃", "σ-donor", "23 000 cm⁻¹"],
        ["[Co(CN)₆]⁴⁻", "CN⁻", "π-akseptor", "~33 000 cm⁻¹"],
      ],
      color: "text-green-400", bg: "bg-green-600/10 border-green-500/30",
    },
    geometry: {
      title: "4. Geometriya",
      desc: "Ligandlar soni va joylashuvi Δ₀ ga ta'sir qiladi.",
      reason: "Kvadrat tekis > oktaedrik > tetraedrik. Δ_tet ≈ 4/9·Δ_oct.",
      data: [
        ["Oktaedrik", "6 ligand", "Δ₀ = 10 Dq", "Ko'pchilik komplekslar"],
        ["Tetraedrik", "4 ligand", "Δ_t ≈ 4.44 Dq", "Har doim HS"],
        ["Kvadrat", "4 ligand", "Δ_sq > Δ₀", "d⁸ metallar"],
        ["Trigonal bipiramida", "5 ligand", "O'rtacha", "D3h simmetriya"],
      ],
      color: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30",
    }
  }

  const c = content[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-rose-400">🔧</span> Δ₀ ga ta'sir etuvchi omillar
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(content).map(([key, val]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === key ? `${val.bg} ${val.color}` : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {val.title.split(".")[1]?.trim() || val.title}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-4 sm:p-6 border ${c.bg}`}>
        <h4 className={`font-bold text-sm mb-1 ${c.color}`}>{c.title}</h4>
        <p className="text-purple-200 text-xs mb-3">{c.desc}</p>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mb-4">
          <p className="text-yellow-400 font-bold">Sababi: </p>
          <p className="text-purple-200">{c.reason}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[10px] sm:text-xs">
            <thead>
              <tr className="border-b border-purple-700/40">
                <th className="p-2 text-left text-purple-300">Kompleks</th>
                <th className="p-2 text-left text-purple-300">Faktor</th>
                <th className="p-2 text-left text-purple-300">Konfig.</th>
                <th className="p-2 text-right text-purple-300">Δ₀</th>
              </tr>
            </thead>
            <tbody>
              {c.data.map((row, i) => (
                <tr key={i} className="border-b border-purple-800/20 hover:bg-purple-800/20">
                  {row.map((cell, j) => (
                    <td key={j} className={`p-2 ${j === 3 ? "text-yellow-300 font-mono text-right font-bold" : "text-purple-200"}`}>{cell}</td>
                  ))}
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
// 5. Baritsentr qoidasi — vizual
// ═══════════════════════════════════════════════════════════════════════════════
function Baritsentr() {
  return (
    <div className="space-y-3">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-emerald-400">⚖️</span> Baritsentr qoidasi — energiya saqlanishi
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <p className="text-purple-200 text-sm">
              <strong className="text-yellow-400">Baritsentr qoidasi:</strong> Kristall maydonda orbitallar ajralganda, 
              ularning <strong>energiya markazlari (baritsentr) o'zgarmaydi.</strong>
            </p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
              <p className="text-yellow-300 font-mono text-center text-base sm:text-lg">3·(−0.4Δ₀) + 2·(+0.6Δ₀) = 0</p>
            </div>
            <p className="text-purple-300 text-xs">
              t₂g da 3 ta orbital (−0.4Δ₀) + e_g da 2 ta orbital (+0.6Δ₀) = −1.2 + 1.2 = <strong className="text-yellow-400">0</strong>
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1.5 text-xs">
              {[
                ["Erkin ion", "E₀", "Barcha 5 ta orbital degenerat"],
                ["t₂g (3 ta)", "−0.4Δ₀", "Stabillashgan (ligandlardan uzoq)"],
                ["e_g (2 ta)", "+0.6Δ₀", "Destabillashgan (ligandlarga yaqin)"],
                ["Baritsentr", "0", "Energiya saqlanadi"],
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-gray-400" : i === 1 ? "bg-green-400" : i === 2 ? "bg-red-400" : "bg-yellow-400"}`} />
                  <span className="text-purple-300 w-20">{row[0]}</span>
                  <span className="text-white font-mono w-16">{row[1]}</span>
                  <span className="text-purple-400">{row[2]}</span>
                </div>
              ))}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-yellow-400 font-bold">💡</p>
              <p className="text-purple-200">Baritsentr qoidasi tufayli KMBE = −0.4·n(t₂g) + 0.6·n(e_g) formula bilan hisoblanadi.</p>
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
function TestEnergy() {
  const questions = [
    { q: "Oktaedrik maydonda nechta d-orbital t₂g guruhiga kiradi?", a: "3 ta", opts: ["2 ta", "3 ta", "5 ta", "6 ta"], hint: "t₂g — 'triple' = 3" },
    { q: "Baritsentr qoidasiga ko'ra, energiya yig'indisi nechaga teng?", a: "0", opts: ["0", "Δ₀", "−0.4Δ₀", "+0.6Δ₀"], hint: "3·(−0.4) + 2·(+0.6) = ?" },
    { q: "Tetraedrik ajralish oktaedrikdan necha marta kichik?", a: "≈ 0.44 (4/9)", opts: ["≈ 0.44 (4/9)", "≈ 0.5 (1/2)", "≈ 0.33 (1/3)", "≈ 0.66 (2/3)"], hint: "Δ_t ≈ ?·Δ₀" },
    { q: "Kuchli maydon ligandlari qanday spin hosil qiladi?", a: "Past spin (LS)", opts: ["Yuqori spin (HS)", "Past spin (LS)", "Ikkalasi", "Spinsiz"], hint: "Δ₀ > P → juftlashadi" },
    { q: "KMBE formulasi (oktaedrik)?", a: "KMBE = −0.4·n(t₂g) + 0.6·n(e_g)", opts: ["KMBE = 0.4·n(t₂g) − 0.6·n(e_g)", "KMBE = −0.4·n(t₂g) + 0.6·n(e_g)", "KMBE = −0.6·n(t₂g) + 0.4·n(e_g)", "KMBE = 0.6·n(t₂g) − 0.4·n(e_g)"], hint: "t₂g stabillashgan (−), e_g destabillashgan (+)" },
    { q: "[Co(H₂O)₆]²⁺ va [Co(H₂O)₆]³⁺ dan qaysi birida Δ₀ katta?", a: "[Co(H₂O)₆]³⁺ (Co³⁺)", opts: ["[Co(H₂O)₆]²⁺ (Co²⁺)", "[Co(H₂O)₆]³⁺ (Co³⁺)", "Ikkalasi teng", "Farqi yo'q"], hint: "Yuqori oksidlanish → katta Δ₀" },
    { q: "Qaysi geometriyada ajralish eng katta?", a: "Kvadrat tekis (D4h)", opts: ["Oktaedrik (Oh)", "Tetraedrik (Td)", "Kvadrat tekis (D4h)", "Chiziqli"], hint: "d⁸ metallar" },
    { q: "Δ₀ = 10 Dq da 1 Dq necha cm⁻¹ ga teng?", a: "Δ₀/10", opts: ["Δ₀×10", "Δ₀/10", "Δ₀²", "√Δ₀"], hint: "10 Dq = Δ₀" },
    { q: "[Co(NH₃)₆]³⁺ va [Rh(NH₃)₆]³⁺ dan qaysi birida Δ₀ katta?", a: "[Rh(NH₃)₆]³⁺ (4d metall)", opts: ["[Co(NH₃)₆]³⁺ (3d metall)", "[Rh(NH₃)₆]³⁺ (4d metall)", "Ikkalasi teng", "Farqi yo'q"], hint: "3d → 4d → 5d da Δ₀ ortadi" },
    { q: "d⁸ konfiguratsiyali metall uchun qanday geometriya barqaror?", a: "Kvadrat tekis (D4h)", opts: ["Oktaedrik", "Tetraedrik", "Kvadrat tekis (D4h)", "Chiziqli"], hint: "Pt²⁺, Pd²⁺, Au³⁺" },
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
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-emerald-400">📝</span> Bilim tekshirish — {c+1}/{questions.length}
      </h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => {
              setS(opt); const ok = opt === q.a
              if (ok && !ans[c]) setSc(p => p + 1)
              setAns(p => ({...p, [c]: ok}))
            })()}
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
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">
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
export default function DOrbitalEnergiya() {
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
            <span className="text-orange-400">d-orbital energiyasi</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-orange-400 flex items-center gap-2">
                <span>⚡</span> d-orbitallarning energiyasi
              </h1>
              <p className="text-[10px] sm:text-xs text-purple-500">Degenerat holat • Kristall maydon ajralishi • KMBE • OTM darajasi</p>
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
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Erkin ionda degenerat holat</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Erkin metall ionida</strong> barcha 5 ta d-orbital bir xil energiyaga ega — 
                <strong className="text-yellow-400"> degenerat holat</strong>. Ligandlar yaqinlashganda degeneratlik buziladi — 
                orbitallar energetik ajraladi. Bu <strong className="text-yellow-400">kristall maydon nazariyasining</strong> asosidir.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">KMBE kalkulyator</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">3 geometriya</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-orange-400 font-bold">🎯 Maqsad:</span> Kristall maydon ajralishi, KMBE hisobi, Δ₀ ga ta'sir etuvchi omillarni tushunish.</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-yellow-300 font-mono text-sm">dxy = dxz = dyz = dz² = dx²−y²  (E₀)</p>
                <p className="text-[9px] text-purple-400">Erkin ionda 5 ta d-orbital — degenerat</p>
              </div>
            </div>
          </div>
        </div>

        {/* ENERGETIK AJRALISH */}
        {view === "all" && (
          <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
            <EnergetikAjralishCanvas />
          </div>
        )}

        {/* BOSHQA BO'LIMLAR */}
        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <Baritsentr />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <DeltaOmillar />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <SpektrokimyoviyQator />
            </div>
          </>
        )}

        {/* KMBE KALKULYATOR (har doim) */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <CFSEKalkulyator />
        </div>

        {/* TAQQOSLASH JADVALI */}
        {view === "all" && (
          <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-cyan-400">📊</span> Uchala maydonni taqqoslash
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] sm:text-xs">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="p-2 sm:p-3 text-left text-purple-200 font-bold">Xususiyat</th>
                    <th className="p-2 sm:p-3 text-left text-blue-400 font-bold">Oktaedrik (Oh)</th>
                    <th className="p-2 sm:p-3 text-left text-green-400 font-bold">Tetraedrik (Td)</th>
                    <th className="p-2 sm:p-3 text-left text-purple-400 font-bold">Kvadrat (D4h)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Ajralish", "Δ₀ = 10 Dq", "Δ_t ≈ 4/9·Δ₀", "Δ_sq > Δ₀"],
                    ["Stabillashgan", "t₂g (3): −0.4Δ₀", "e (2): −0.6Δ_t", "dxz, dyz: eng past"],
                    ["Destabillashgan", "e_g (2): +0.6Δ₀", "t₂ (3): +0.4Δ_t", "dx²−y²: eng yuqori"],
                    ["Yo'nalish", "t₂g↓ e_g↑", "t₂↑ e↓ (teskari!)", "4 xil sath"],
                    ["Eng yuqori", "dx²−y², dz²", "dxy, dxz, dyz", "dx²−y² (b₁g)"],
                    ["Eng past", "dxy, dxz, dyz", "dz², dx²−y²", "dxz, dyz (e_g)"],
                    ["Spin", "HS yoki LS", "Har doim HS", "LS (d⁸ uchun)"],
                    ["Misol", "[Ti(H₂O)₆]³⁺", "[CoCl₄]²⁻", "[PtCl₄]²⁻"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/20 hover:bg-purple-800/20">
                      <td className="p-2 sm:p-3 font-bold text-purple-100">{row[0]}</td>
                      <td className="p-2 sm:p-3">{row[1]}</td>
                      <td className="p-2 sm:p-3">{row[2]}</td>
                      <td className="p-2 sm:p-3">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestEnergy />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>Erkin ionda 5 ta d-orbital <strong className="text-yellow-400">degenerat</strong></li>
            <li>Oktaedrik: <strong className="text-blue-400">t₂g↓ (−0.4Δ₀) + e_g↑ (+0.6Δ₀)</strong> — eng keng tarqalgan</li>
            <li>Tetraedrik: <strong className="text-green-400">teskari ajralish, Δ_t ≈ 0.44·Δ₀</strong></li>
            <li>Kvadrat: <strong className="text-purple-400">eng katta ajralish, 4 daraja, d⁸ metallar</strong></li>
            <li>Baritsentr qoidasi: 3·(−0.4) + 2·(+0.6) = 0</li>
            <li>Δ₀ ortadi: yuqori oksidlanish, 3d→4d→5d, kuchli ligandlar</li>
            <li><strong className="text-yellow-400">KMBE = −0.4·n(t₂g) + 0.6·n(e_g)</strong></li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> 3D model
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20">
            Elektron konfiguratsiyalar <span>→</span>
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
