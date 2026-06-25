"use client"

import Link from "next/link"
import { useState, useEffect, useRef, useCallback } from "react"

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r }
    this.beginPath()
    this.moveTo(x + r.tl, y)
    this.lineTo(x + w - r.tr, y)
    this.quadraticCurveTo(x + w, y, x + w, y + r.tr)
    this.lineTo(x + w, y + h - r.br)
    this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h)
    this.lineTo(x + r.bl, y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - r.bl)
    this.lineTo(x, y + r.tl)
    this.quadraticCurveTo(x, y, x + r.tl, y)
    this.closePath()
  }
}

const RAMAN_DATA = {
  formula: "[Cu(H₂O)₆]²⁺",
  iupac: "Geksaakvamis(II) ioni",
  tarixiy: "",
  cas: "— (ioni), 7758-99-8 (CuSO₄·5H₂O)",
  molarMass: "171.66 g·mol⁻¹ (ioni)",
  density: "2.05 g·cm⁻³ (tuz holida)",
  oxidationState: "Cu(II), d⁹ (S = 1/2)",
  magneticMoment: "μ_eff ≈ 1.9−2.0 μ_B",
  coordinationGeom: "Cho'zilgan oktaedr (CuO₆, D₄h simmetriya)",
  pointGroup: "D₄h (Yahn-Teller cho'zilishi), T_h (ideal Oh dan buzilgan)",
  bondDistances: "Cu−O(ekv): 1.97 Å (4 ta), Cu−O(aks): 2.28 Å (2 ta)",
  jahnTellerDelta: "Δ(Cu−O) = 0.31 Å — Yahn-Teller cho'zilishi",
  
  lazer: "Ar⁺ (λ = 514.5 nm) — rezonans oldi sharoit",
  power: "20−50 mW (fotoparchalanishga sezgir!)",
  resolution: "2 sm⁻¹",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "128−256 skan, 15−30 daqiqa",
  detector: "CCD (514 nm)",
  
  peaks: [
    { wavenumber: 55, intensity: 10, fwhm: 6, assignment: "Panjara modi — anion···[Cu(H₂O)₆]²⁺ translatsion tebranish", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi" },
    { wavenumber: 95, intensity: 15, fwhm: 5.5, assignment: "Panjara modi — O−H···anion vodorod bog' tebranishi", symmetry: "A_g (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Molekulalararo vodorod bog'lari" },
    { wavenumber: 160, intensity: 20, fwhm: 5, assignment: "δ(O−Cu−O) — ekvatorial burchak deformatsiyasi (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Ekvatorial tekislikdagi burchak deformatsiyasi" },
    { wavenumber: 220, intensity: 18, fwhm: 4.5, assignment: "δ(O−Cu−O) — aksial-ekvatorial burchak deformatsiyasi", symmetry: "B₁g", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Aksial va ekvatorial ligandlararo burchak o'zgarishi" },
    { wavenumber: 290, intensity: 35, fwhm: 4, assignment: "ν(Cu−O_aks) — aksial valent tebranish (A₁g)", symmetry: "A₁g", polarization: "Qutblangan (ρ ≈ 0.12)", category: "metal-ligand", comment: "Aksial Cu−O cho'zilishi — uzun bog' (2.28 Å), past chastota" },
    { wavenumber: 350, intensity: 28, fwhm: 4.5, assignment: "ν(Cu−O_ekv) + ν(Cu−O_aks) gibrid mod (E_g)", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Aralash ekvatorial-aksial valent tebranish" },
    { wavenumber: 440, intensity: 100, fwhm: 3.2, assignment: "ν(Cu−O_ekv) simmetrik valent tebranish — ekvatorial 'nafas olish'", symmetry: "A₁g", polarization: "Kuchli qutblangan (ρ ≈ 0.04)", category: "metal-ligand", forceConstant: "k(Cu−O_ekv) = 1.65 mdyn/Å", comment: "Eng intensiv Raman piki. 4 ta ekvatorial Cu−O sinxron cho'ziladi" },
    { wavenumber: 480, intensity: 22, fwhm: 5, assignment: "ν(Cu−O_ekv) antisimmetrik valent tebranish (B₁g)", symmetry: "B₁g", polarization: "Depolyarizatsiyalangan", category: "metal-ligand", comment: "Ekvatorial Cu−O antifazada — Yahn-Teller buzilishi tufayli faol" },
    { wavenumber: 610, intensity: 12, fwhm: 6.5, assignment: "ρ_r(H₂O) — suv rocking tebranishi", symmetry: "E_g", polarization: "Depolyarizatsiyalangan", category: "h2o-rock", comment: "H₂O ligandlarining rocking harakati" },
    { wavenumber: 760, intensity: 15, fwhm: 6, assignment: "ρ_w(H₂O) — suv wagging tebranishi", symmetry: "A₂u", polarization: "—", category: "h2o-wag", comment: "H₂O wagging harakati" },
    { wavenumber: 1640, intensity: 18, fwhm: 8, assignment: "δ(H₂O) — suv deformatsion tebranishi (soyabon)", symmetry: "A₁g", polarization: "Qutblangan", category: "h2o-deform", comment: "H₂O soyabon deformatsiyasi" },
    { wavenumber: 3150, intensity: 30, fwhm: 12, assignment: "ν_s(O−H) — simmetrik valent tebranish (vodorod bog'li)", symmetry: "A₁g", polarization: "Qutblangan", category: "oh-stretch", forceConstant: "k(O−H) = 7.2 mdyn/Å", comment: "Simmetrik O−H cho'zilishi — keng pik, vodorod bog'lari tarmog'i" },
    { wavenumber: 3380, intensity: 20, fwhm: 10, assignment: "ν_as(O−H) — antisimmetrik valent tebranish", symmetry: "B₁g", polarization: "Depolyarizatsiyalangan", category: "oh-stretch", comment: "Antisimmetrik O−H cho'zilishi" },
    { wavenumber: 3510, intensity: 10, fwhm: 8, assignment: "ν(O−H) — erkin O−H tebranishi (vodorod bog'siz)", symmetry: "A₁g", polarization: "Qutblangan", category: "oh-stretch", comment: "Vodorod bog'iga ega bo'lmagan suv molekulalari" },
  ],
  
  jahnTellerEffect: {
    title: "Yahn-Teller effekti — Raman spektrida namoyon bo'lishi",
    description: "Cu²⁺ (d⁹) — eg orbitallarda (dz², dx²−y²) 3 ta elektron. Yahn-Teller teoremasi bo'yicha degeneratsiya bartaraf qilinishi kerak. Natijada oktaedr z o'qi bo'yicha cho'ziladi: 4 ta ekvatorial Cu−O bog'i qisqa (1.97 Å), 2 ta aksial Cu−O bog'i uzun (2.28 Å).",
    ramanEvidence: [
      "ν(Cu−O_ekv) = 440 sm⁻¹ (kuchli, qutblangan) — qisqa, mustahkam bog'lar",
      "ν(Cu−O_aks) = 290 sm⁻¹ (o'rtacha, qutblangan) — uzun, kuchsiz bog'lar",
      "Farq Δν = 150 sm⁻¹ — Yahn-Teller cho'zilishining bevosita spektroskopik dalili",
      "Ekvatorial va aksial Cu−O tebranishlarining ajralishi — ideal Oh simmetriyadan og'ish",
    ],
    comparison: {
      noJT: "[Cr(H₂O)₆]³⁺ (d³) — Yahn-Teller yo'q, bitta ν(M−O) ≈ 540 sm⁻¹",
      withJT: "[Cu(H₂O)₆]²⁺ (d⁹) — Yahn-Teller faol, ikkita ν(Cu−O): 440 va 290 sm⁻¹",
    },
  },
  
  iqComparison: [
    { vibration: "ν(Cu−O_ekv) A₁g", raman: "440 (100%)", iq: "— (kuchsiz)", rule: "Raman da diagnostik" },
    { vibration: "ν(Cu−O_aks) A₁g", raman: "290 (35%)", iq: "280 (o'rtacha)", rule: "Ikkalasida ham faol" },
    { vibration: "ν(Cu−O) B₁g", raman: "480 (22%)", iq: "470 (kuchli)", rule: "IQ da kuchliroq" },
    { vibration: "δ(H₂O) A₁g", raman: "1640 (18%)", iq: "1630 (juda kuchli)", rule: "IQ da diagnostik" },
    { vibration: "ν_s(O−H) A₁g", raman: "3150 (30%)", iq: "3150 (kuchli)", rule: "Ikkalasida ham faol" },
  ],
}

function RamanSpektrGrafik({ lineColor = "#4ade80" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 380 })
  const [animProgress, setAnimProgress] = useState(0)
  const [laser, setLaser] = useState(514)
  const [zoomRegion, setZoomRegion] = useState("full")
  const [showFit, setShowFit] = useState(true)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const peaks = RAMAN_DATA.peaks
  const ranges = {
    full: { min: 50, max: 3600 },
    low: { min: 50, max: 800 },
    oh: { min: 3000, max: 3600 },
  }
  const { min: wnMin, max: wnMax } = ranges[zoomRegion]

  useEffect(() => {
    const updateSize = () => { if (containerRef.current) { const w = Math.min(820, containerRef.current.clientWidth); setCanvasSize({ w, h: w > 500 ? 380 : 280 }) } }
    updateSize(); window.addEventListener('resize', updateSize); return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    startTimeRef.current = null; setAnimProgress(0)
    const animate = (timestamp) => { if (!startTimeRef.current) startTimeRef.current = timestamp; const p = Math.min((timestamp - startTimeRef.current) / 1200, 1); setAnimProgress(p); if (p < 1) animRef.current = requestAnimationFrame(animate) }
    animRef.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(animRef.current)
  }, [zoomRegion, laser])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); const W = canvas.width, H = canvas.height
    const PAD = { l: 70, r: 30, t: 30, b: 60 }; const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - wnMin) / (wnMax - wnMin)) * plotW
    const yTo = (v) => PAD.t + ((105 - v) / 105) * plotH

    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#0a0716"); bg.addColorStop(1, "#1a0f2e")
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    const step = (wnMax - wnMin) > 2000 ? 500 : (wnMax - wnMin) > 500 ? 100 : 50
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) { ctx.beginPath(); ctx.moveTo(xTo(w), PAD.t); ctx.lineTo(xTo(w), PAD.t + plotH); ctx.stroke() }
    ;[20, 40, 60, 80, 100].forEach(v => { ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke() })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const laserScale = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2
    const vis = peaks.filter(p => p.wavenumber >= wnMin && p.wavenumber <= wnMax && p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress)

    if (showFit) {
      ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin); let total = 0
        vis.forEach(p => { const g = p.fwhm / 2; total += (p.intensity * laserScale * g * g) / (Math.pow(wn - p.wavenumber, 2) + g * g) })
        total = Math.min(total, 102)
        if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total))); else ctx.lineTo(x, yTo(Math.max(0, total)))
      }
      ctx.stroke(); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.lineTo(PAD.l, yTo(0)); ctx.closePath()
      const fg = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH); fg.addColorStop(0, lineColor + "25"); fg.addColorStop(1, lineColor + "05")
      ctx.fillStyle = fg; ctx.fill()
    }

    vis.forEach(p => {
      const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const isH = hoveredPeak?.wavenumber === p.wavenumber; const isS = selectedPeak?.wavenumber === p.wavenumber
      const cc = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "h2o-rock": "#38bdf8", "h2o-wag": "#34d399", "h2o-deform": "#f97316", "oh-stretch": "#e879f9" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2); ctx.fillStyle = cc; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = cc + "25"; ctx.fill() }
      if (p.intensity > 20 || isH || isS) { ctx.fillStyle = cc; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText(`${p.wavenumber}`, x, y - 12) }
      if (isH || isS) { ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"; ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26) }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * laserScale, 100))
      const tx = Math.min(Math.max(x - 110, PAD.l + 5), PAD.l + plotW - 225)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1
      ctx.beginPath(); ctx.roundRect(tx, y - 85, 220, 65, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(`${p.wavenumber} sm⁻¹`, tx + 8, y - 68)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"; ctx.fillText(p.assignment.substring(0, 48), tx + 8, y - 54)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) ctx.fillText(w, xTo(w), PAD.t + plotH + 16)
    ctx.font = "11px sans-serif"; ctx.fillStyle = "#a78bfa"; ctx.fillText("Raman siljishi (sm⁻¹)", PAD.l + plotW / 2, H - 8)
    ctx.textAlign = "right"; ctx.font = "10px sans-serif"; ctx.fillStyle = "#7c6a9e"
    ;[20, 40, 60, 80, 100].forEach(v => ctx.fillText(v, PAD.l - 8, yTo(v) + 4))
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 10px monospace"; ctx.textAlign = "right"; ctx.fillText(`λ = ${laser} nm`, PAD.l + plotW - 8, PAD.t + 14)
  }, [peaks, animProgress, hoveredPeak, selectedPeak, lineColor, canvasSize, wnMin, wnMax, laser, showFit])

  const hm = useCallback((e) => {
    const c = canvasRef.current; if (!c) return
    const r = c.getBoundingClientRect(); const sx = canvasSize.w / r.width; const mx = (e.clientX - r.left) * sx
    const P = { l: 70, r: 30 }; const pw = canvasSize.w - P.l - P.r
    const wn = wnMin + ((mx - P.l) / pw) * (wnMax - wnMin); let cl = null, md = (wnMax - wnMin) / 50
    peaks.forEach(p => { const d = Math.abs(p.wavenumber - wn); if (d < md) { md = d; cl = p } }); setHoveredPeak(cl)
  }, [peaks, canvasSize, wnMin, wnMax])

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-purple-900/50 border border-purple-700/50 rounded-xl p-3 mb-3 flex flex-wrap gap-3 items-center text-xs">
        <div className="flex items-center gap-2"><span className="text-purple-400">Lazer:</span>{[514, 633, 1064].map(l => (<button key={l} onClick={() => setLaser(l)} className={`px-2 py-1 rounded-lg font-mono ${laser === l ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{l}nm</button>))}</div>
        <div className="flex items-center gap-2"><span className="text-purple-400">Zoom:</span>{[["full", "To'liq"], ["low", "50−800"], ["oh", "O−H"]].map(([k, v]) => (<button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-green-500/30 text-green-300 border border-green-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>))}</div>
        <button onClick={() => setShowFit(!showFit)} className={`px-2 py-1 rounded-lg ml-auto ${showFit ? "bg-pink-500/30 text-pink-300 border border-pink-500/50" : "bg-purple-800/40 text-purple-300"}`}>{showFit ? "✓" : "○"} Fit</button>
      </div>
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} onMouseMove={hm} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wavenumber === hoveredPeak.wavenumber ? null : hoveredPeak) }} onMouseLeave={() => setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ" },{ c: "#4ade80", l: "Cu−O" },{ c: "#38bdf8", l: "H₂O" },{ c: "#e879f9", l: "O−H" }].map((it, i) => (<div key={i} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: it.c }} /><span className="text-purple-300">{it.l}</span></div>))}
      </div>
      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: lineColor + "40" }}>
          <div className="flex items-center gap-3 flex-wrap mb-2"><span className="font-mono font-bold text-lg" style={{ color: lineColor }}>{selectedPeak.wavenumber} sm⁻¹</span><span className="bg-purple-700/50 text-purple-200 rounded-full px-2 py-0.5 text-xs">{selectedPeak.symmetry}</span><span className="bg-yellow-500/20 text-yellow-300 rounded-full px-2 py-0.5 text-xs">FWHM: {selectedPeak.fwhm} sm⁻¹</span></div>
          <p className="text-white text-sm mb-1"><strong>Tebranish:</strong> {selectedPeak.assignment}</p>
          {selectedPeak.forceConstant && <p className="text-green-300 text-xs mb-1"><strong>Kuch konstantasi:</strong> {selectedPeak.forceConstant}</p>}
          <p className="text-purple-400 text-xs mt-2 italic">{selectedPeak.comment}</p>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white">✕ Yopish</button>
        </div>
      )}
    </div>
  )
}

function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-emerald-900 to-blue-950 border border-green-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6"><Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span><Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span><Link href="/ilmiy/tahlil/raman" className="hover:text-purple-200">Raman</Link><span>/</span><span className="text-yellow-400">{RAMAN_DATA.formula}</span></div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{RAMAN_DATA.formula}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-green-600/20 text-green-300 border border-green-600/30 rounded-full px-3 py-1 text-xs font-semibold">Yahn-Teller faol</span>
            <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-600/30 rounded-full px-3 py-1 text-xs">d⁹ — S=1/2</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">D₄h simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["ν(Cu−O_ekv)","440 sm⁻¹","Eng kuchli"],["ν(Cu−O_aks)","290 sm⁻¹","Yahn-Teller"],["Δ(Cu−O)","0.31 Å","Cho'zilish"],["k(Cu−O_ekv)","1.65 mdyn/Å","Kuchsizroq"]].map(([l,v,s],i)=>(<div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Yahn-Teller dalili:</strong> ν(Cu−O_ekv) = <span className="font-mono text-lg font-bold">440 sm⁻¹</span> va ν(Cu−O_aks) = <span className="font-mono text-lg font-bold">290 sm⁻¹</span> — ikki xil Cu−O tebranish chastotasi (Δν = 150 sm⁻¹).</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "jahn-teller", label: "Yahn-Teller effekti", icon: "🔷" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function CuH2O6RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="text-xl font-bold text-white">[Cu(H₂O)₆]²⁺ — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-green-600/40 text-white border border-green-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-400">Interaktiv Raman spektri — [Cu(H₂O)₆]²⁺</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm), 20−50 mW. Yahn-Teller cho'zilishi — ikki xil Cu−O tebranish.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4"><h3 className="text-green-300 font-semibold mb-2">🔬 Cu−O ekvatorial</h3><p className="text-purple-200 text-xs">ν(Cu−O_ekv) = 440 sm⁻¹ (A₁g, 100%). Qisqa bog'lar (1.97 Å).</p></div>
                <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4"><h3 className="text-emerald-300 font-semibold mb-2">🔬 Cu−O aksial</h3><p className="text-purple-200 text-xs">ν(Cu−O_aks) = 290 sm⁻¹ (A₁g). Uzun bog'lar (2.28 Å) — Yahn-Teller.</p></div>
                <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4"><h3 className="text-pink-300 font-semibold mb-2">🔬 O−H sohasi</h3><p className="text-purple-200 text-xs">ν(O−H) = 3150−3510 sm⁻¹. Vodorod bog'lari tarmog'i — keng piklar.</p></div>
              </div>
            </div>
          )}
          {activeTab === "jahn-teller" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-400">{RAMAN_DATA.jahnTellerEffect.title}</h2>
              <p className="text-purple-200 text-sm">{RAMAN_DATA.jahnTellerEffect.description}</p>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <h3 className="text-yellow-300 font-semibold mb-3">Raman spektrida Yahn-Teller dalillari:</h3>
                <ul className="text-purple-200 text-sm space-y-2">{RAMAN_DATA.jahnTellerEffect.ramanEvidence.map((e, i) => (<li key={i} className="flex items-start gap-2"><span className="text-green-400">•</span>{e}</li>))}</ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><h3 className="text-green-400 font-semibold mb-2">Yahn-Teller YO'Q</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.jahnTellerEffect.comparison.noJT}</p></div>
                <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><h3 className="text-red-400 font-semibold mb-2">Yahn-Teller FAOL</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.jahnTellerEffect.comparison.withJT}</p></div>
              </div>
            </div>
          )}
          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-400">Raman ↔ IQ — [Cu(H₂O)₆]²⁺</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-green-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead><tbody>{RAMAN_DATA.iqComparison.map((r, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-green-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>))}</tbody></table></div>
            </div>
          )}
          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-400">To'liq piklar bazasi (14 mod)</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead><tbody>{RAMAN_DATA.peaks.map((p, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-green-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/ni-cn4" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Ni(CN)₄]²⁻</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/ag-nh3-2" className="text-purple-400 hover:text-purple-200 text-sm">[Ag(NH₃)₂]⁺ →</Link>
        </div>
      </div>
    </div>
  )
}