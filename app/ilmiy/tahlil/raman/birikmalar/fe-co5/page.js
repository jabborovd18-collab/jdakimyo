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
  formula: "[Fe(CO)₅]",
  iupac: "Pentakarboniltemir(0)",
  tarixiy: "Metall karbonil — 18 elektron qoidasi namunasi",
  cas: "13463-40-6",
  molarMass: "195.90 g·mol⁻¹",
  density: "1.45 g·cm⁻³ (suyuqlik, 150 K da kristall)",
  oxidationState: "Fe(0), d⁸ (S = 0), 18e⁻ qoidasi",
  magneticMoment: "Diamagnit",
  coordinationGeom: "Trigonal bipiramidal (FeC₅, D₃h simmetriya)",
  pointGroup: "D₃h (erkin molekula), R3̄ (kristallda 150 K da)",
  bondDistances: "Fe−C(ekv): 1.812 Å (3 ta), Fe−C(aks): 1.828 Å (2 ta)",
  
  lazer: "Ar⁺ (λ = 514.5 nm) — rezonans oldi, C≡O tebranishlari juda kuchli",
  power: "10−30 mW (fotoparchalanishga juda sezgir — CO ajralishi mumkin!)",
  resolution: "1 sm⁻¹ (yuqori ruxsat — aksial/ekvatorial farqlash uchun)",
  spectralRange: "50−4000 sm⁻¹",
  acquisitionTime: "64−128 skan",
  detector: "CCD (514 nm)",
  
  peaks: [
    { wavenumber: 68, intensity: 8, fwhm: 4, assignment: "Panjara modi — molekulalararo van der Waals tebranish", symmetry: "A₁' (lattice)", polarization: "Qutblangan", category: "lattice", comment: "Past chastotali panjara modi — molekulyar kristall" },
    { wavenumber: 95, intensity: 10, fwhm: 3.5, assignment: "Panjara modi — libratsion tebranish", symmetry: "E' (lattice)", polarization: "Depolyarizatsiyalangan", category: "lattice", comment: "Molekulalararo libratsiya" },
    { wavenumber: 135, intensity: 15, fwhm: 3, assignment: "δ(C_aks−Fe−C_aks) — aksial burchak deformatsiyasi", symmetry: "E'", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "Aksial CO ligandlari burchak o'zgarishi" },
    { wavenumber: 180, intensity: 18, fwhm: 3.2, assignment: "δ(C_ekv−Fe−C_ekv) — ekvatorial burchak deformatsiyasi", symmetry: "A₂''", polarization: "—", category: "deformation", comment: "Ekvatorial tekislikdagi burchak deformatsiyasi — IQ da faol" },
    { wavenumber: 245, intensity: 22, fwhm: 2.8, assignment: "δ(Fe−C≡O) — Fe−C≡O burchak deformatsiyasi (soyabon)", symmetry: "E'", polarization: "Depolyarizatsiyalangan", category: "deformation", comment: "CO ligandlari soyabon deformatsiyasi" },
    { wavenumber: 310, intensity: 28, fwhm: 2.5, assignment: "δ(Fe−C≡O) aksial — aksial CO burchak deformatsiyasi", symmetry: "A₁'", polarization: "Qutblangan", category: "deformation", comment: "Aksial CO ligandlari burchak o'zgarishi" },
    { wavenumber: 380, intensity: 35, fwhm: 2.2, assignment: "ν(Fe−C_ekv) simmetrik — ekvatorial 'nafas olish'", symmetry: "A₁'", polarization: "Qutblangan (ρ ≈ 0.08)", category: "metal-ligand", comment: "Ekvatorial Fe−C sinxron cho'zilishi" },
    { wavenumber: 415, intensity: 100, fwhm: 2, assignment: "ν(Fe−C) simmetrik — barcha 5 ta Fe−C 'nafas olish' modi", symmetry: "A₁'", polarization: "Kuchli qutblangan (ρ ≈ 0.02)", category: "metal-ligand", forceConstant: "k(Fe−C) = 2.35 mdyn/Å", comment: "Eng intensiv Raman piki. Barcha Fe−C sinxron cho'ziladi" },
    { wavenumber: 430, intensity: 30, fwhm: 2.5, assignment: "ν(Fe−C_aks) simmetrik — aksial cho'zilish", symmetry: "A₁'", polarization: "Qutblangan (ρ ≈ 0.06)", category: "metal-ligand", comment: "Aksial Fe−C cho'zilishi — ekvatorialdan yuqori chastota" },
    { wavenumber: 2014, intensity: 85, fwhm: 1.8, assignment: "ν(C≡O_ekv) simmetrik cho'zilish — ekvatorial CO (A₁')", symmetry: "A₁'", polarization: "Kuchli qutblangan (ρ ≈ 0.02)", category: "co-stretch", forceConstant: "k(C≡O_ekv) = 17.8 mdyn/Å", comment: "Ekvatorial C≡O simmetrik tebranishi" },
    { wavenumber: 2034, intensity: 60, fwhm: 2, assignment: "ν(C≡O_aks) simmetrik cho'zilish — aksial CO (A₁')", symmetry: "A₁'", polarization: "Kuchli qutblangan (ρ ≈ 0.03)", category: "co-stretch", forceConstant: "k(C≡O_aks) = 17.5 mdyn/Å", comment: "Aksial C≡O simmetrik tebranishi — ekvatorialdan yuqori chastota" },
    { wavenumber: 2100, intensity: 15, fwhm: 2.2, assignment: "ν(C≡O) antisimmetrik — E' komponenti", symmetry: "E'", polarization: "Depolyarizatsiyalangan", category: "co-stretch", comment: "Antisimmetrik C≡O — IQ da juda kuchli" },
    { wavenumber: 2125, intensity: 8, fwhm: 3, assignment: "Kombinatsion mod: ν(C≡O) + lattice", symmetry: "—", polarization: "Depolyarizatsiyalangan", category: "combination", comment: "Anharmonik kombinatsiya" },
  ],
  
  iqComparison: [
    { vibration: "ν(Fe−C) A₁' (nafas olish)", raman: "415 (100%)", iq: "— (faol emas)", rule: "Sof Raman — A₁' D₃h" },
    { vibration: "ν(Fe−C) E'", raman: "380 (35%)", iq: "475 (kuchli)", rule: "IQ da kuchli — E' ikkalasida faol" },
    { vibration: "ν(C≡O_ekv) A₁'", raman: "2014 (85%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν(C≡O_aks) A₁'", raman: "2034 (60%)", iq: "— (faol emas)", rule: "Sof Raman — simmetrik" },
    { vibration: "ν(C≡O) E'", raman: "2100 (15%)", iq: "2020 (juda kuchli)", rule: "IQ da diagnostik — antisimmetrik" },
  ],
  
  trigonalBipyramidal: {
    title: "D₃h simmetriya — trigonal bipiramidal Fe(CO)₅",
    pointGroup: "D₃h",
    ramanActive: "A₁' + E' + E'' (8 ta Raman faol mod)",
    irActive: "A₂'' + E' (5 ta IQ faol mod)",
    note: "E' modlar Raman va IQ da bir vaqtda faol — D₃h da inversion markaz yo'q.",
    ekvVsAks: "Aksial CO tebranish chastotasi (2034 sm⁻¹) > ekvatorial CO (2014 sm⁻¹). Sababi: aksial pozitsiyada π-back-donation kuchsizroq — C≡O bog'i mustahkamroq.",
    berryPseudorotation: "Fe(CO)₅ da Berry psevdorotatsiyasi orqali aksial va ekvatorial CO ligandlari almashinadi. Bu jarayon Raman vaqt shkalasida (~10⁻¹² s) \"muzlatilgan\" — aksial/ekvatorial farq aniq ko'rinadi.",
  },
}

function RamanSpektrGrafik({ lineColor = "#f97316" }) {
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
  const ranges = { full: { min: 50, max: 2150 }, low: { min: 50, max: 500 }, co: { min: 1980, max: 2150 } }
  const { min: wnMin, max: wnMax } = ranges[zoomRegion]

  useEffect(() => {
    const us = () => { if (containerRef.current) { const w = Math.min(820, containerRef.current.clientWidth); setCanvasSize({ w, h: w > 500 ? 380 : 280 }) } }
    us(); window.addEventListener('resize', us); return () => window.removeEventListener('resize', us)
  }, [])

  useEffect(() => {
    startTimeRef.current = null; setAnimProgress(0)
    const anim = (t) => { if (!startTimeRef.current) startTimeRef.current = t; const p = Math.min((t - startTimeRef.current) / 1200, 1); setAnimProgress(p); if (p < 1) animRef.current = requestAnimationFrame(anim) }
    animRef.current = requestAnimationFrame(anim); return () => cancelAnimationFrame(animRef.current)
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
    const step = (wnMax - wnMin) > 1000 ? 200 : (wnMax - wnMin) > 300 ? 50 : 25
    for (let w = Math.ceil(wnMin / step) * step; w <= wnMax; w += step) { ctx.beginPath(); ctx.moveTo(xTo(w), PAD.t); ctx.lineTo(xTo(w), PAD.t + plotH); ctx.stroke() }
    ;[20, 40, 60, 80, 100].forEach(v => { ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke() })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const ls = laser === 1064 ? 1.0 : laser === 633 ? 2.85 : laser === 514 ? 5.4 : 8.2
    const vis = peaks.filter(p => p.wavenumber >= wnMin && p.wavenumber <= wnMax && p.wavenumber <= wnMin + (wnMax - wnMin) * animProgress)

    if (showFit) {
      ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.beginPath()
      for (let x = PAD.l; x <= PAD.l + plotW; x += 1) {
        const wn = wnMin + ((x - PAD.l) / plotW) * (wnMax - wnMin); let total = 0
        vis.forEach(p => { const g = p.fwhm / 2; total += (p.intensity * ls * g * g) / (Math.pow(wn - p.wavenumber, 2) + g * g) })
        total = Math.min(total, 102)
        if (x === PAD.l) ctx.moveTo(x, yTo(Math.max(0, total))); else ctx.lineTo(x, yTo(Math.max(0, total)))
      }
      ctx.stroke(); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.lineTo(PAD.l, yTo(0)); ctx.closePath()
      const fg = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH); fg.addColorStop(0, lineColor + "25"); fg.addColorStop(1, lineColor + "05")
      ctx.fillStyle = fg; ctx.fill()
    }

    vis.forEach(p => {
      const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * ls, 100))
      const isH = hoveredPeak?.wavenumber === p.wavenumber; const isS = selectedPeak?.wavenumber === p.wavenumber
      const cc = { "lattice": "#a78bfa", "deformation": "#fbbf24", "metal-ligand": lineColor, "co-stretch": "#34d399", "combination": "#f87171" }[p.category] || lineColor

      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4, 0, Math.PI * 2); ctx.fillStyle = cc; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = cc + "25"; ctx.fill() }
      if (p.intensity > 20 || isH || isS) { ctx.fillStyle = cc; ctx.font = "bold 9px monospace"; ctx.textAlign = "center"; ctx.fillText(`${p.wavenumber}`, x, y - 12) }
      if (isH || isS) { ctx.fillStyle = "#fff"; ctx.font = "bold 11px monospace"; ctx.fillText(`${p.wavenumber} sm⁻¹`, x, y - 26) }
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.wavenumber), y = yTo(Math.min(p.intensity * ls, 100))
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
        <div className="flex items-center gap-2"><span className="text-purple-400">Zoom:</span>{[["full", "To'liq"], ["low", "50−500"], ["co", "C≡O"]].map(([k, v]) => (<button key={k} onClick={() => setZoomRegion(k)} className={`px-2 py-1 rounded-lg ${zoomRegion === k ? "bg-orange-500/30 text-orange-300 border border-orange-500/50" : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/40"}`}>{v}</button>))}</div>
        <button onClick={() => setShowFit(!showFit)} className={`px-2 py-1 rounded-lg ml-auto ${showFit ? "bg-pink-500/30 text-pink-300 border border-pink-500/50" : "bg-purple-800/40 text-purple-300"}`}>{showFit ? "✓" : "○"} Fit</button>
      </div>
      <canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} onMouseMove={hm} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wavenumber === hoveredPeak.wavenumber ? null : hoveredPeak) }} onMouseLeave={() => setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        {[{ c: "#a78bfa", l: "Lattice" },{ c: "#fbbf24", l: "δ" },{ c: "#f97316", l: "Fe−C" },{ c: "#34d399", l: "C≡O" },{ c: "#f87171", l: "Komb" }].map((it, i) => (<div key={i} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: it.c }} /><span className="text-purple-300">{it.l}</span></div>))}
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-950 via-amber-900 to-blue-950 border border-orange-700/50 p-8 md:p-12 mb-10">
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-purple-400 mb-6"><Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span><Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span><Link href="/ilmiy/tahlil/raman" className="hover:text-purple-200">Raman</Link><span>/</span><span className="text-yellow-400">{RAMAN_DATA.formula}</span></div>
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{RAMAN_DATA.formula}</h1>
          <div className="flex flex-wrap gap-2">
            <span className="bg-orange-600/20 text-orange-300 border border-orange-600/30 rounded-full px-3 py-1 text-xs font-semibold">{RAMAN_DATA.tarixiy}</span>
            <span className="bg-amber-600/20 text-amber-300 border border-amber-600/30 rounded-full px-3 py-1 text-xs">Fe⁰ — 18e⁻</span>
            <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 rounded-full px-3 py-1 text-xs">D₃h simmetriya</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[["ν(Fe−C) A₁'","415 sm⁻¹","Eng kuchli"],["ν(C≡O_ekv)","2014 sm⁻¹","Ekvatorial"],["ν(C≡O_aks)","2034 sm⁻¹","Aksial > ekv"],["k(Fe−C)","2.35 mdyn/Å","Mustahkam"]].map(([l,v,s],i)=>(<div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-bold text-base">{v}</p><p className="text-purple-500 text-xs mt-0.5">{s}</p></div>))}
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-300 text-sm"><strong>Aksial vs Ekvatorial:</strong> ν(C≡O_aks) = <span className="font-mono text-lg font-bold">2034 sm⁻¹</span> {">"} ν(C≡O_ekv) = <span className="font-mono text-lg font-bold">2014 sm⁻¹</span> — aksial CO mustahkamroq (kuchsizroq π-back-donation).</p>
        </div>
      </div>
    </div>
  )
}

const TABS = [
  { id: "spectrum", label: "Raman spektri", icon: "📊" },
  { id: "iq-comparison", label: "Raman vs IQ", icon: "⚖️" },
  { id: "symmetry", label: "D₃h simmetriya", icon: "🔣" },
  { id: "peaks-table", label: "Piklar jadvali", icon: "📋" },
]

export default function FeCO5RamanPage() {
  const [activeTab, setActiveTab] = useState("spectrum")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="text-xl font-bold text-white">[Fe(CO)₅] — Raman spektroskopik tahlil</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-orange-600/40 text-white border border-orange-400/50" : "text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab === "spectrum" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-orange-400">Interaktiv Raman spektri — [Fe(CO)₅]</h2>
              <p className="text-purple-300 text-sm">Ar⁺ lazer (514.5 nm), 10−30 mW. D₃h simmetriya. Aksial/ekvatorial CO farqlanadi.</p>
              <RamanSpektrGrafik />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4"><h3 className="text-orange-300 font-semibold mb-2">🔬 Fe−C sohasi</h3><p className="text-purple-200 text-xs">ν(Fe−C) = 415 sm⁻¹ (A₁', 100%). Ekvatorial 380, aksial 430 sm⁻¹.</p></div>
                <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4"><h3 className="text-green-300 font-semibold mb-2">🔬 C≡O ekvatorial</h3><p className="text-purple-200 text-xs">ν(C≡O_ekv) = 2014 sm⁻¹ (A₁', 85%). k(C≡O_ekv) = 17.8 mdyn/Å.</p></div>
                <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-4"><h3 className="text-amber-300 font-semibold mb-2">🔬 C≡O aksial</h3><p className="text-purple-200 text-xs">ν(C≡O_aks) = 2034 sm⁻¹ (A₁', 60%). Aksial CO mustahkamroq.</p></div>
              </div>
            </div>
          )}
          {activeTab === "iq-comparison" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-orange-400">Raman ↔ IQ — Fe(CO)₅ D₃h</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">Tebranish</th><th className="text-left py-3 px-3 text-orange-400">Raman</th><th className="text-left py-3 px-3 text-blue-400">IQ</th><th className="text-left py-3 px-3 text-purple-400">Tanlash qoidasi</th></tr></thead><tbody>{RAMAN_DATA.iqComparison.map((r, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 text-yellow-400 font-mono text-xs">{r.vibration}</td><td className="py-3 px-3 text-orange-300 text-xs">{r.raman}</td><td className="py-3 px-3 text-blue-300 text-xs">{r.iq}</td><td className="py-3 px-3 text-purple-300 text-xs">{r.rule}</td></tr>))}</tbody></table></div>
            </div>
          )}
          {activeTab === "symmetry" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-orange-400">{RAMAN_DATA.trigonalBipyramidal.title}</h2>
              <div className="bg-purple-800/30 rounded-xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><h3 className="text-yellow-300 font-semibold mb-3">📐 Simmetriya (D₃h)</h3><div className="space-y-2 text-xs"><div className="bg-green-600/20 border border-green-500/30 rounded-lg p-2"><p className="text-green-300 font-semibold">🟢 Raman faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.trigonalBipyramidal.ramanActive}</p></div><div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-2"><p className="text-blue-300 font-semibold">🔵 IQ faol:</p><p className="text-purple-200 font-mono mt-1">{RAMAN_DATA.trigonalBipyramidal.irActive}</p></div></div></div>
                  <div><h3 className="text-yellow-300 font-semibold mb-3">⚛️ Aksial vs Ekvatorial</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.trigonalBipyramidal.ekvVsAks}</p></div>
                </div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5"><h3 className="text-yellow-300 font-semibold mb-2">🔄 Berry psevdorotatsiyasi</h3><p className="text-purple-200 text-sm">{RAMAN_DATA.trigonalBipyramidal.berryPseudorotation}</p></div>
            </div>
          )}
          {activeTab === "peaks-table" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-orange-400">To'liq piklar bazasi (13 mod)</h2>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-3 text-purple-400">ν (sm⁻¹)</th><th className="text-left py-3 px-3 text-purple-400">I (%)</th><th className="text-left py-3 px-3 text-purple-400">FWHM</th><th className="text-left py-3 px-3 text-purple-400">Simmetriya</th><th className="text-left py-3 px-3 text-purple-400">Tebranish turi</th></tr></thead><tbody>{RAMAN_DATA.peaks.map((p, i) => (<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-3 font-mono text-orange-400 font-bold">{p.wavenumber}</td><td className="py-3 px-3 text-yellow-400">{p.intensity}%</td><td className="py-3 px-3 text-purple-300 font-mono text-xs">{p.fwhm}</td><td className="py-3 px-3 text-white font-mono text-xs">{p.symmetry}</td><td className="py-3 px-3 text-purple-200 text-xs">{p.assignment}</td></tr>))}</tbody></table></div>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/raman/birikmalar/co-cl4" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [CoCl₄]²⁻</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar/zn-oh4" className="text-purple-400 hover:text-purple-200 text-sm">[Zn(OH)₄]²⁻ →</Link>
        </div>
      </div>
    </div>
  )
}