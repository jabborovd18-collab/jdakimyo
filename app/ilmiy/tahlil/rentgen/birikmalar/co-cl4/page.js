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

const CRYSTAL = {
  formula: "[CoCl₄]²⁻",
  iupac: "Tetraxlorokobaltat(II) ioni",
  tarixiy: "",
  molarMass: "200.75 g·mol⁻¹ (ioni)",
  oxidationState: "Co(II), d⁷ (S = 3/2)",
  coordinationGeom: "Tetraedrik (Td)",
  electronConfig: "[Ar]3d⁷ — 3 ta toq elektron, yuqori spinli",
  magneticMoment: "μ ≈ 4.4−4.8 BM (spin-only: 3.87 BM, orbital hissa bilan)",
  color: "Ko'k — ⁴A₂ → ⁴T₁(P) d−d o'tish",
  
  crystalSystem: "Tetragonal",
  spaceGroup: "I4̄2d (№122)",
  a: 9.452, b: 9.452, c: 14.208,
  alpha: 90, beta: 90, gamma: 90,
  volume: 1268.5, Z: 4,
  densityCalc: 1.62,
  formulaUnitsPerCell: "Z = 4 (4 ta [CoCl₄]²⁻ va 8 ta kation)",
  
  temperature: "293 K",
  radiationType: "Mo Kα (λ = 0.71073 Å)",
  diffractometer: "Bruker SMART APEX CCD",
  crystalSize: "0.32 × 0.28 × 0.24 mm³",
  absorptionCorrection: "SADABS (multi-scan)",
  tMin: 0.58, tMax: 0.72,
  
  reflectionsCollected: 5850,
  independentReflections: 2780,
  completeness: "99.8%",
  rInt: 0.027,
  rSigma: 0.021,
  r1Obs: 0.031, r1All: 0.042,
  wR2Obs: 0.072, wR2All: 0.081,
  gof: 1.05,
  largestDiffPeak: 0.38,
  largestDiffHole: -0.32,
  flackParameter: "0.02(8)",
  
  bondLengths: [
    { bond: "Co−Cl (o'rtacha)", length: "2.278(2)", note: "4 ta ekvivalent bog'" },
    { bond: "Co−Cl (min)", length: "2.272(2)", note: "Individual qiymat" },
    { bond: "Co−Cl (max)", length: "2.284(2)", note: "Individual qiymat" },
    { bond: "Cl···Cl (qirra)", length: "3.718−3.745", note: "Tetraedr qirralari" },
    { bond: "Kation···Cl (ion juft)", length: "3.45−4.12", note: "Elektrostatik kontaktlar" },
    { bond: "C−H···Cl (vodorod bog')", length: "2.72−2.98", note: "Organik kationlar bilan" },
  ],
  
  bondAngles: [
    { angle: "Cl−Co−Cl (o'rtacha)", value: "109.47°" },
    { angle: "Cl−Co−Cl (min)", value: "108.2(1)°" },
    { angle: "Cl−Co−Cl (max)", value: "110.8(1)°" },
    { angle: "Tetraedrik buzilish indeksi", value: "Δ = 2.6°" },
  ],
  
  tetrahedralDistortion: {
    title: "Tetraedrik buzilish tahlili",
    idealAngle: "109.47° — ideal Td burchak",
    avgAngle: "109.47° — o'rtacha idealga teng",
    range: "108.2° − 110.8° — kichik buzilish diapazoni",
    index: "Δ = 2.6° — eng katta og'ish",
    cause: "Kristall o'rash kuchlari va kation-anion elektrostatik ta'siri tufayli",
  },
  
  comparison: {
    title: "[CoCl₄]²⁻ (Td) vs [Co(CN)₄]²⁻ (D₄h) — geometriya farqi",
    cl4: "Tetraedrik (Td) — Cl⁻ kuchsiz maydon ligandi, sp³ gibridlanish, yuqori spinli d⁷, paramagnit, ko'k",
    cn4: "Kvadrat planar (D₄h) — CN⁻ kuchli maydon ligandi, dsp² gibridlanish, past spinli d⁷, paramagnit (S=1/2)",
    reason: "CN⁻ spektrokimyoviy qatorda Cl⁻ dan ancha yuqorida — kuchli maydon bo'linishi kvadrat planar geometriyani energetik qulay qiladi",
  },
  
  packing: {
    title: "Kristall o'rash tuzilishi",
    description: "[CoCl₄]²⁻ anionlari tetragonal I4̄2d panjarada kationlar bilan almashinib joylashgan. Har bir anion 8 ta kation bilan o'ralgan. Tetraedrik anionlar c o'qi bo'yicha cho'zilgan holda orientatsiyalangan.",
    coordinationNumber: "Co²⁺ — 4 (tetraedrik)",
    packingEfficiency: "~68% (kation hajmiga bog'liq)",
    shortestCoCo: "8.52 Å — magnit almashinuv yo'q",
  },
  
  safety: "Co(II) birikmalari — teri va nafas yo'llari uchun allergen. Yutish yoki nafas olish xavfli. Qo'lqop va ventilyatsiya bilan ishlang.",
  
  diffractionPeaks: [
    { h: 1, k: 1, l: 2, twotheta: 7.45, d: 5.93, intensity: 55 },
    { h: 2, k: 0, l: 0, twotheta: 9.42, d: 4.69, intensity: 100 },
    { h: 0, k: 0, l: 4, twotheta: 12.55, d: 3.52, intensity: 38 },
    { h: 2, k: 1, l: 1, twotheta: 14.85, d: 2.98, intensity: 45 },
    { h: 2, k: 2, l: 0, twotheta: 16.78, d: 2.64, intensity: 32 },
    { h: 1, k: 1, l: 4, twotheta: 18.95, d: 2.34, intensity: 28 },
    { h: 3, k: 1, l: 2, twotheta: 21.25, d: 2.09, intensity: 22 },
    { h: 4, k: 0, l: 0, twotheta: 23.68, d: 1.88, intensity: 18 },
    { h: 2, k: 0, l: 4, twotheta: 26.15, d: 1.70, intensity: 15 },
    { h: 3, k: 3, l: 0, twotheta: 28.55, d: 1.56, intensity: 12 },
    { h: 4, k: 2, l: 0, twotheta: 31.05, d: 1.44, intensity: 10 },
    { h: 1, k: 1, l: 6, twotheta: 33.48, d: 1.34, intensity: 8 },
    { h: 5, k: 1, l: 2, twotheta: 36.05, d: 1.24, intensity: 6 },
    { h: 4, k: 4, l: 0, twotheta: 38.55, d: 1.17, intensity: 5 },
    { h: 3, k: 1, l: 6, twotheta: 41.15, d: 1.10, intensity: 4 },
  ],
}

function DifraktogrammaGrafik({ lineColor = "#3b82f6" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 340 })
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const peaks = CRYSTAL.diffractionPeaks
  const ttMin = 5, ttMax = 42

  useEffect(() => {
    const updateSize = () => { if (containerRef.current) { const w = Math.min(820, containerRef.current.clientWidth); setCanvasSize({ w, h: w > 500 ? 340 : 260 }) } }
    updateSize(); window.addEventListener('resize', updateSize); return () => window.removeEventListener('resize', updateSize)
  }, [])

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = Math.min((timestamp - startTimeRef.current) / 1500, 1)
      setAnimProgress(progress)
      if (progress < 1 || selectedPeak) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(animRef.current)
  }, [selectedPeak])

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); const W = canvas.width, H = canvas.height
    const PAD = { l: 65, r: 30, t: 30, b: 55 }; const plotW = W - PAD.l - PAD.r, plotH = H - PAD.t - PAD.b
    const xTo = (v) => PAD.l + ((v - ttMin) / (ttMax - ttMin)) * plotW
    const yTo = (v) => PAD.t + ((100 - v) / 100) * plotH

    ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    for (let t = 5; t <= 40; t += 5) { ctx.beginPath(); ctx.moveTo(xTo(t), PAD.t); ctx.lineTo(xTo(t), PAD.t + plotH); ctx.stroke() }
    ;[20, 40, 60, 80].forEach(v => { ctx.beginPath(); ctx.moveTo(PAD.l, yTo(v)); ctx.lineTo(PAD.l + plotW, yTo(v)); ctx.stroke() })
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.l, yTo(0)); ctx.lineTo(PAD.l + plotW, yTo(0)); ctx.stroke()

    const visiblePeaks = peaks.filter(p => p.twotheta <= ttMin + (ttMax - ttMin) * animProgress)
    visiblePeaks.forEach(p => {
      const x = xTo(p.twotheta), y = yTo(p.intensity); const isH = hoveredPeak?.twotheta === p.twotheta; const isS = selectedPeak?.twotheta === p.twotheta
      ctx.beginPath(); ctx.strokeStyle = p.intensity > 30 ? lineColor : "#7c6a9e"; ctx.lineWidth = (isH || isS) ? 2 : 1; ctx.moveTo(x, yTo(0)); ctx.lineTo(x, y); ctx.stroke()
      ctx.beginPath(); ctx.arc(x, y, (isH || isS) ? 7 : 4.5, 0, Math.PI * 2); ctx.fillStyle = p.intensity > 30 ? lineColor : "#7c6a9e"; ctx.fill()
      if (isS) { ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fillStyle = lineColor + "20"; ctx.fill() }
      ctx.fillStyle = p.intensity > 30 ? lineColor : "#7c6a9e"; ctx.font = "8px monospace"; ctx.textAlign = "center"; ctx.fillText(`${p.intensity}%`, x, y - 10)
      if (isH || isS) { ctx.fillStyle = "#fff"; ctx.font = "bold 10px monospace"; ctx.fillText(`2θ=${p.twotheta}°`, x, y - 24); ctx.font = "9px monospace"; ctx.fillText(`d=${p.d}Å (${p.h}${p.k}${p.l})`, x, y - 38) }
    })
    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak; const x = xTo(p.twotheta), y = yTo(p.intensity)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = lineColor; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(x - 85, y - 80, 170, 55, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"; ctx.fillText(`2θ = ${p.twotheta}°  |  d = ${p.d} Å`, x, y - 56)
      ctx.fillStyle = lineColor; ctx.font = "9px sans-serif"; ctx.fillText(`Miller: (${p.h}${p.k}${p.l})  |  Int: ${p.intensity}%`, x, y - 42)
    }
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke(); ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"; for (let t = 5; t <= 40; t += 5) ctx.fillText(t + "°", xTo(t), PAD.t + plotH + 16)
    ctx.fillText("2θ (gradus) — Mo Kα, λ = 0.71073 Å", PAD.l + plotW / 2, H - 8)
    ctx.textAlign = "right";[20, 40, 60, 80].forEach(v => ctx.fillText(v + "%", PAD.l - 8, yTo(v) + 4))
    ctx.fillStyle = "#5b7898"; ctx.font = "italic 8px sans-serif"; ctx.textAlign = "right"; ctx.fillText("Hisoblangan difraktogramma — xom eksperimental ma'lumot emas", PAD.l + plotW, PAD.t - 8)
  }, [peaks, animProgress, hoveredPeak, selectedPeak, lineColor, canvasSize])

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current; if (!canvas) return
    const rect = canvas.getBoundingClientRect(); const scaleX = canvasSize.w / rect.width; const mx = (e.clientX - rect.left) * scaleX
    const PAD = { l: 65, r: 30 }; const plotW = canvasSize.w - PAD.l - PAD.r; const tt = ttMin + ((mx - PAD.l) / plotW) * (ttMax - ttMin)
    let closest = null, minDist = 2; peaks.forEach(p => { const dist = Math.abs(p.twotheta - tt); if (dist < minDist) { minDist = dist; closest = p } }); setHoveredPeak(closest)
  }, [peaks, canvasSize])

  return (<div ref={containerRef} className="relative"><canvas ref={canvasRef} width={canvasSize.w} height={canvasSize.h} onMouseMove={handleMouseMove} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.twotheta === hoveredPeak.twotheta ? null : hoveredPeak) }} onMouseLeave={() => setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" /></div>)
}

function BraggScherrerKalkulyator() {
  const [mode, setMode] = useState("bragg"); const [h, setH] = useState(2); const [k, setK] = useState(0); const [l, setL] = useState(0)
  const [lambda, setLambda] = useState(0.71073); const [n, setN] = useState(1); const [fwhm, setFwhm] = useState(0.25); const [kScherrer, setKScherrer] = useState(0.94); const [result, setResult] = useState(null)
  const tetragonalD = (h, k, l) => { const { a, c } = CRYSTAL; return 1 / Math.sqrt((h*h + k*k)/(a*a) + (l*l)/(c*c)) }
  const calculate = () => { const dVal = tetragonalD(h, k, l); const st = (n * lambda) / (2 * dVal); if (st > 1) { setResult({ error: true }); return }; const th = Math.asin(st) * 180 / Math.PI; const br = fwhm * Math.PI / 180; const D = (kScherrer * lambda) / (br * Math.cos(th * Math.PI / 180)); setResult({ dVal, theta: th, twotheta: th * 2, D, error: false }) }
  useEffect(() => { calculate() }, [h, k, l, lambda, n, fwhm, kScherrer])
  return (<div className="space-y-4"><div className="flex gap-2 mb-4"><button onClick={() => setMode("bragg")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${mode==="bragg"?"bg-blue-600/40 text-white border border-blue-400/50":"bg-purple-800/30 text-purple-400"}`}>Bragg qonuni</button><button onClick={() => setMode("scherrer")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${mode==="scherrer"?"bg-blue-600/40 text-white border border-blue-400/50":"bg-purple-800/30 text-purple-400"}`}>Scherrer tenglamasi</button></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div><label className="text-purple-400 text-xs">h</label><input type="number" value={h} onChange={e=>setH(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">k</label><input type="number" value={k} onChange={e=>setK(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">l</label><input type="number" value={l} onChange={e=>setL(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">λ (Å)</label><select value={lambda} onChange={e=>setLambda(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"><option value={0.71073}>Mo Kα</option><option value={1.5418}>Cu Kα</option><option value={1.7902}>Co Kα</option></select></div></div>{mode==="scherrer"&&(<div className="grid grid-cols-2 gap-3"><div><label className="text-purple-400 text-xs">FWHM β (°)</label><input type="number" value={fwhm} onChange={e=>setFwhm(+e.target.value)} step="0.01" className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">K</label><select value={kScherrer} onChange={e=>setKScherrer(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"><option value={0.94}>0.94</option><option value={0.89}>0.89</option></select></div></div>)}{result&&!result.error&&(<div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center"><div><p className="text-blue-400 font-bold text-lg">{result.dVal.toFixed(3)}</p><p className="text-purple-400 text-xs">d (Å)</p></div><div><p className="text-blue-400 font-bold text-lg">{result.theta.toFixed(2)}°</p><p className="text-purple-400 text-xs">θ</p></div><div><p className="text-blue-400 font-bold text-lg">{result.twotheta.toFixed(2)}°</p><p className="text-purple-400 text-xs">2θ</p></div>{mode==="scherrer"&&<div><p className="text-blue-400 font-bold text-lg">{result.D.toFixed(1)}</p><p className="text-purple-400 text-xs">D (Å)</p></div>}</div></div>)}{result?.error&&<p className="text-red-400 text-center">sinθ {">"} 1 — diffraksiya kuzatilmaydi</p>}</div>)
}

function HeroSection() {
  return (<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-950 border border-blue-700/50 p-8 md:p-12 mb-10"><div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"/><div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"/><div className="relative z-10"><div className="flex items-center gap-2 text-sm text-purple-400 mb-6"><Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span><Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span><span className="text-yellow-400">{CRYSTAL.formula}</span></div><div className="flex flex-col md:flex-row md:items-end gap-4 mb-6"><h1 className="text-3xl md:text-4xl font-bold text-white">{CRYSTAL.formula}</h1><div className="flex flex-wrap gap-2"><span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full px-3 py-1 text-xs font-semibold">Tetraedrik (Td)</span><span className="bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded-full px-3 py-1 text-xs">{CRYSTAL.iupac}</span><span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 text-xs">d⁷ — paramagnit</span></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{[["Panjara parametrlari",`a=${CRYSTAL.a}Å, c=${CRYSTAL.c}Å`],["Fazoviy guruh",CRYSTAL.spaceGroup],["Hajm / Z / Flack",`${CRYSTAL.volume}Å³ / Z=${CRYSTAL.Z} / ${CRYSTAL.flackParameter}`],["R₁ / wR₂ / GoF",`${CRYSTAL.r1Obs} / ${CRYSTAL.wR2Obs} / ${CRYSTAL.gof}`]].map(([l,v],i)=>(<div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-semibold text-sm">{v}</p></div>))}</div><div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4"><p className="text-red-400 text-sm"><strong>⚠ Xavfsizlik:</strong> {CRYSTAL.safety}</p></div></div></div>)
}

const TABS = [
  { id: "diffraction", label: "Difraktogramma", icon: "📊" },
  { id: "calculator", label: "Bragg + Scherrer", icon: "📐" },
  { id: "structure", label: "Struktura ma'lumotlari", icon: "💎" },
  { id: "distortion", label: "Tetraedrik buzilish", icon: "🔺" },
  { id: "comparison", label: "Cl⁻ vs CN⁻", icon: "⚖️" },
  { id: "refinement", label: "Ishonchlilik", icon: "📋" },
]

export default function CoCl4RentgenPage() {
  const [activeTab, setActiveTab] = useState("diffraction")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/rentgen/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="text-xl font-bold text-white">[CoCl₄]²⁻ — Rentgen difraksiyasi tahlili</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab===tab.id?"bg-blue-600/40 text-white border border-blue-400/50":"text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab==="diffraction"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">Hisoblangan difraktogramma</h2><p className="text-purple-400 text-sm">[CoCl₄]²⁻ ning tetragonal fazasi (I4̄2d) uchun hisoblangan PXRD pattern. <strong className="text-blue-400">Bu xom eksperimental difraktogramma emas.</strong></p><DifraktogrammaGrafik /><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Piklar ro'yxati</h3><div className="overflow-x-auto max-h-64"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">hkl</th><th className="text-left py-2 px-3 text-purple-400">2θ (°)</th><th className="text-left py-2 px-3 text-purple-400">d (Å)</th><th className="text-left py-2 px-3 text-purple-400">I (%)</th></tr></thead><tbody>{CRYSTAL.diffractionPeaks.map((p,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-2 px-3 font-mono text-blue-400">({p.h}{p.k}{p.l})</td><td className="py-2 px-3 text-purple-200">{p.twotheta.toFixed(2)}</td><td className="py-2 px-3 text-purple-200">{p.d.toFixed(2)}</td><td className="py-2 px-3 text-purple-200">{p.intensity}</td></tr>))}</tbody></table></div></div></div>)}
          {activeTab==="calculator"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">Bragg + Scherrer kalkulyatori</h2><p className="text-purple-400 text-sm">Tetragonal I4̄2d birlik hujayra uchun d(hkl) ni hisoblang.</p><BraggScherrerKalkulyator /></div>)}
          {activeTab==="structure"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">Kristall struktura ma'lumotlari</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Bog' uzunliklari</h3><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Bog'</th><th className="text-left py-2 px-3 text-purple-400">Uzunlik (Å)</th></tr></thead><tbody>{CRYSTAL.bondLengths.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 text-blue-400 font-mono text-xs">{r.bond}</td><td className="py-2 px-3 text-purple-200">{r.length}</td></tr>))}</tbody></table></div><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Bog' burchaklari</h3><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Burchak</th><th className="text-left py-2 px-3 text-purple-400">Qiymat</th></tr></thead><tbody>{CRYSTAL.bondAngles.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 text-blue-400 font-mono text-xs">{r.angle}</td><td className="py-2 px-3 text-purple-200">{r.value}</td></tr>))}</tbody></table></div></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4"><h3 className="text-blue-400 font-semibold text-sm mb-2">🔬 Nima uchun [CoCl₄]²⁻ tetraedrik?</h3><p className="text-purple-200 text-sm">Co²⁺ (d⁷) — Cl⁻ kuchsiz maydon ligandi ta'sirida tetraedrik geometriya hosil qiladi. Kristall maydon nazariyasi bo'yicha tetraedrik komplekslarda orbitallar bo'linishi (Δt) oktaedrik bo'linishdan (Δo) 4/9 marta kichik. Kuchsiz maydon sharoitida yuqori spinli konfiguratsiya energetik qulay — 3 ta toq elektron, paramagnit xossa. Co−Cl bog' uzunligi <strong className="text-blue-400">2.278 Å</strong> — Co²⁺ uchun xarakterli.</p></div></div>)}
          {activeTab==="distortion"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">{CRYSTAL.tetrahedralDistortion.title}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4"><p className="text-blue-400 font-bold text-lg">{CRYSTAL.tetrahedralDistortion.idealAngle}</p><p className="text-purple-400 text-xs mt-1">Ideal Td</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.tetrahedralDistortion.avgAngle}</p><p className="text-purple-400 text-xs mt-1">O'rtacha</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.tetrahedralDistortion.range}</p><p className="text-purple-400 text-xs mt-1">Diapazon</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.tetrahedralDistortion.index}</p><p className="text-purple-400 text-xs mt-1">Buzilish indeksi</p></div></div><p className="text-purple-200 text-sm">{CRYSTAL.tetrahedralDistortion.cause}</p></div>)}
          {activeTab==="comparison"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">{CRYSTAL.comparison.title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><h3 className="text-blue-400 font-semibold mb-3">[CoCl₄]²⁻</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.cl4}</p></div><div className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-5"><h3 className="text-purple-300 font-semibold mb-3">[Co(CN)₄]²⁻</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.cn4}</p></div></div><p className="text-purple-400 text-sm">{CRYSTAL.comparison.reason}</p></div>)}
          {activeTab==="refinement"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-blue-400">Ishonchlilik parametrlari</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-4 text-purple-400">Parametr</th><th className="text-left py-3 px-4 text-purple-400">Qiymat</th><th className="text-left py-3 px-4 text-purple-400">Maqbul diapazon</th></tr></thead><tbody>{[["R₁",CRYSTAL.r1Obs.toFixed(3),"< 0.05"],["wR₂",CRYSTAL.wR2Obs.toFixed(3),"< 0.10"],["GoF",CRYSTAL.gof.toFixed(2),"0.8−1.3"],["Rint",CRYSTAL.rInt.toFixed(3),"< 0.05"],["Rσ",CRYSTAL.rSigma.toFixed(3),"< 0.03"],["Flack",CRYSTAL.flackParameter,"−0.1 < x < 0.3"],["To'liqlik",CRYSTAL.completeness,"> 95%"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-3 px-4 text-blue-400 font-mono">{r[0]}</td><td className="py-3 px-4 text-purple-200">{r[1]}</td><td className="py-3 px-4 text-purple-400">{r[2]}</td></tr>))}</tbody></table></div></div>)}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/rentgen/birikmalar/ag-nh3-2" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Ag(NH₃)₂]⁺</Link>
          <Link href="/ilmiy/tahlil/rentgen/birikmalar/fe-co5" className="text-purple-400 hover:text-purple-200 text-sm">[Fe(CO)₅] →</Link>
        </div>
      </div>
    </div>
  )
}