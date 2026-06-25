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
  formula: "[Cr(H₂O)₆]³⁺",
  iupac: "Geksaakvaxrom(III) ioni",
  tarixiy: "",
  molarMass: "160.07 g·mol⁻¹ (ioni)",
  oxidationState: "Cr(III), d³ (S = 3/2)",
  coordinationGeom: "Oktaedrik (Oh) — deyarli ideal",
  electronConfig: "[Ar]3d³ — 3 ta toq elektron, paramagnit",
  magneticMoment: "μ ≈ 3.87 BM (spin-only: 3.87 BM, orbital hissa muzlatilgan)",
  color: "Yashil-binafsha — ⁴A₂g → ⁴T₂g, ⁴T₁g d−d o'tishlar",
  kineticInertness: "t₁/₂ ≈ 40 soat (298 K) — eng sekin suv almashinadigan akvakompleks",
  
  crystalSystem: "Trigonal",
  spaceGroup: "R3̄c (№167)",
  a: 10.925, b: 10.925, c: 16.325,
  alpha: 90, beta: 90, gamma: 120,
  volume: 1687.5, Z: 6,
  densityCalc: 2.15,
  formulaUnitsPerCell: "Z = 6 (6 ta [Cr(H₂O)₆]³⁺ va 18 ta anion)",
  
  temperature: "293 K",
  radiationType: "Mo Kα (λ = 0.71073 Å)",
  diffractometer: "Bruker SMART APEX CCD",
  crystalSize: "0.25 × 0.22 × 0.18 mm³",
  absorptionCorrection: "SADABS (multi-scan)",
  tMin: 0.68, tMax: 0.82,
  
  reflectionsCollected: 5420,
  independentReflections: 2580,
  completeness: "99.7%",
  rInt: 0.023,
  rSigma: 0.017,
  r1Obs: 0.022, r1All: 0.029,
  wR2Obs: 0.055, wR2All: 0.061,
  gof: 1.02,
  largestDiffPeak: 0.25,
  largestDiffHole: -0.22,
  
  bondLengths: [
    { bond: "Cr−O (o'rtacha)", length: "1.958(2)", note: "6 ta ekvivalent bog' — muntazam oktaedr" },
    { bond: "Cr−O (min)", length: "1.955(2)", note: "Individual qiymat" },
    { bond: "Cr−O (max)", length: "1.962(2)", note: "Individual qiymat" },
    { bond: "Δ(Cr−O)", length: "0.007", note: "Juda kichik farq — Yahn-Teller effekti yo'q" },
    { bond: "O−H", length: "0.85(3)", note: "12 ta ekvivalent O−H bog'" },
    { bond: "O−H···O / O−H···anion", length: "2.62−2.88", note: "Kuchli vodorod bog'lari tarmog'i" },
    { bond: "Cr···Cr (eng yaqin)", length: "7.85", note: "Magnit almashinuv yo'q" },
  ],
  
  bondAngles: [
    { angle: "O−Cr−O (sis)", value: "89.9(1)°" },
    { angle: "O−Cr−O (trans)", value: "179.8(1)°" },
    { angle: "Cr−O−H", value: "121.5(3)°" },
    { angle: "Oktaedrik buzilish indeksi", value: "Δ < 0.2° — deyarli ideal Oh" },
  ],
  
  octahedralPerfection: {
    title: "Oktaedrik mukammallik tahlili",
    idealAngle: "90° / 180° — ideal Oh burchaklar",
    avgSis: "89.9° — idealga juda yaqin",
    avgTrans: "179.8° — idealga juda yaqin",
    bondEquivalence: "Cr−O: 1.955−1.962 Å (Δ = 0.007 Å) — deyarli teng",
    cause: "d³ konfiguratsiya (t₂g³) — yarim to'lgan t₂g orbitallar sferik simmetrik elektron zichlik beradi. Yahn-Teller effekti yo'q. Kinetik inertlik — suv almashinishi juda sekin.",
  },
  
  comparison: {
    title: "Cr(III) vs boshqa M(III) akvakomplekslar",
    cr: "[Cr(H₂O)₆]³⁺ — d³, Oh ideal, kinetik inert, t₁/₂≈40 soat",
    co: "[Co(H₂O)₆]³⁺ — d⁶ low-spin, Oh, kinetik inert (t₁/₂~soat), oksidlovchi",
    fe: "[Fe(H₂O)₆]³⁺ — d⁵ high-spin, Oh, labil (tez almashinadi)",
    al: "[Al(H₂O)₆]³⁺ — d⁰, Oh, labil, kislotali",
    note: "Cr(III) eng sekin suv almashinadigan 3d metall ioni — bu xossa uni ko'plab kimyoviy jarayonlarda noyob qiladi",
  },
  
  packing: {
    title: "Kristall o'rash tuzilishi",
    description: "[Cr(H₂O)₆]³⁺ kationlari anionlar bilan O−H···anion vodorod bog'lari orqali bog'langan. Har bir akvakompleks 12 ta anion bilan o'ralgan. Trigonal R3̄c panjarada kationlar qatlamlar bo'ylab joylashgan.",
    hBondsPerCation: "12 ta O−H···anion vodorod bog'i",
    coordinationNumber: "Cr³⁺ — 6 (oktaedrik)",
    shortestCrCr: "7.85 Å — almashinuv yo'q, magnit suyultirilgan",
  },
  
  safety: "Cr(III) birikmalari — nisbatan xavfsiz (Cr(VI) dan farqli). Teri va nafas yo'llari uchun yengil allergen. Ko'z bilan kontaktidan saqlaning.",
  
  diffractionPeaks: [
    { h: 1, k: 0, l: 2, twotheta: 7.25, d: 6.09, intensity: 38 },
    { h: 1, k: 1, l: 0, twotheta: 9.38, d: 4.71, intensity: 100 },
    { h: 0, k: 0, l: 6, twotheta: 12.15, d: 3.64, intensity: 45 },
    { h: 1, k: 1, l: 3, twotheta: 14.85, d: 2.98, intensity: 55 },
    { h: 2, k: 0, l: 2, twotheta: 17.25, d: 2.57, intensity: 28 },
    { h: 2, k: 1, l: 1, twotheta: 19.55, d: 2.27, intensity: 32 },
    { h: 1, k: 0, l: 5, twotheta: 22.15, d: 2.01, intensity: 22 },
    { h: 3, k: 0, l: 0, twotheta: 24.85, d: 1.79, intensity: 18 },
    { h: 2, k: 1, l: 4, twotheta: 27.45, d: 1.62, intensity: 15 },
    { h: 1, k: 1, l: 6, twotheta: 30.15, d: 1.48, intensity: 12 },
    { h: 3, k: 1, l: 2, twotheta: 32.85, d: 1.36, intensity: 10 },
    { h: 2, k: 2, l: 0, twotheta: 35.55, d: 1.26, intensity: 8 },
    { h: 4, k: 0, l: 2, twotheta: 38.25, d: 1.18, intensity: 6 },
    { h: 3, k: 2, l: 1, twotheta: 40.95, d: 1.10, intensity: 5 },
    { h: 2, k: 1, l: 7, twotheta: 43.55, d: 1.04, intensity: 4 },
  ],
}

function DifraktogrammaGrafik({ lineColor = "#34d399" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [canvasSize, setCanvasSize] = useState({ w: 820, h: 340 })
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef(null)
  const startTimeRef = useRef(null)

  const peaks = CRYSTAL.diffractionPeaks
  const ttMin = 5, ttMax = 44

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
  const [mode, setMode] = useState("bragg"); const [h, setH] = useState(1); const [k, setK] = useState(1); const [l, setL] = useState(0)
  const [lambda, setLambda] = useState(0.71073); const [n, setN] = useState(1); const [fwhm, setFwhm] = useState(0.25); const [kScherrer, setKScherrer] = useState(0.94); const [result, setResult] = useState(null)
  const trigonalD = (h, k, l) => { const { a, c } = CRYSTAL; return 1 / Math.sqrt((4*(h*h + h*k + k*k))/(3*a*a) + (l*l)/(c*c)) }
  const calculate = () => { const dVal = trigonalD(h, k, l); const st = (n * lambda) / (2 * dVal); if (st > 1) { setResult({ error: true }); return }; const th = Math.asin(st) * 180 / Math.PI; const br = fwhm * Math.PI / 180; const D = (kScherrer * lambda) / (br * Math.cos(th * Math.PI / 180)); setResult({ dVal, theta: th, twotheta: th * 2, D, error: false }) }
  useEffect(() => { calculate() }, [h, k, l, lambda, n, fwhm, kScherrer])
  return (<div className="space-y-4"><div className="flex gap-2 mb-4"><button onClick={() => setMode("bragg")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${mode==="bragg"?"bg-emerald-600/40 text-white border border-emerald-400/50":"bg-purple-800/30 text-purple-400"}`}>Bragg qonuni</button><button onClick={() => setMode("scherrer")} className={`px-4 py-2 rounded-xl text-sm font-semibold ${mode==="scherrer"?"bg-emerald-600/40 text-white border border-emerald-400/50":"bg-purple-800/30 text-purple-400"}`}>Scherrer tenglamasi</button></div><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><div><label className="text-purple-400 text-xs">h</label><input type="number" value={h} onChange={e=>setH(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">k</label><input type="number" value={k} onChange={e=>setK(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">l</label><input type="number" value={l} onChange={e=>setL(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">λ (Å)</label><select value={lambda} onChange={e=>setLambda(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"><option value={0.71073}>Mo Kα</option><option value={1.5418}>Cu Kα</option><option value={1.7902}>Co Kα</option></select></div></div>{mode==="scherrer"&&(<div className="grid grid-cols-2 gap-3"><div><label className="text-purple-400 text-xs">FWHM β (°)</label><input type="number" value={fwhm} onChange={e=>setFwhm(+e.target.value)} step="0.01" className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"/></div><div><label className="text-purple-400 text-xs">K</label><select value={kScherrer} onChange={e=>setKScherrer(+e.target.value)} className="w-full bg-purple-800/50 border border-purple-600 rounded-lg px-3 py-2 text-white text-sm"><option value={0.94}>0.94</option><option value={0.89}>0.89</option></select></div></div>)}{result&&!result.error&&(<div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4"><div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center"><div><p className="text-emerald-400 font-bold text-lg">{result.dVal.toFixed(3)}</p><p className="text-purple-400 text-xs">d (Å)</p></div><div><p className="text-emerald-400 font-bold text-lg">{result.theta.toFixed(2)}°</p><p className="text-purple-400 text-xs">θ</p></div><div><p className="text-emerald-400 font-bold text-lg">{result.twotheta.toFixed(2)}°</p><p className="text-purple-400 text-xs">2θ</p></div>{mode==="scherrer"&&<div><p className="text-emerald-400 font-bold text-lg">{result.D.toFixed(1)}</p><p className="text-purple-400 text-xs">D (Å)</p></div>}</div></div>)}{result?.error&&<p className="text-red-400 text-center">sinθ {">"} 1 — diffraksiya kuzatilmaydi</p>}</div>)
}

function HeroSection() {
  return (<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-green-900 to-blue-950 border border-emerald-700/50 p-8 md:p-12 mb-10"><div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"/><div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"/><div className="relative z-10"><div className="flex items-center gap-2 text-sm text-purple-400 mb-6"><Link href="/" className="hover:text-purple-200">Bosh sahifa</Link><span>/</span><Link href="/ilmiy/birikmalar" className="hover:text-purple-200">Birikmalar</Link><span>/</span><span className="text-yellow-400">{CRYSTAL.formula}</span></div><div className="flex flex-col md:flex-row md:items-end gap-4 mb-6"><h1 className="text-3xl md:text-4xl font-bold text-white">{CRYSTAL.formula}</h1><div className="flex flex-wrap gap-2"><span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-full px-3 py-1 text-xs font-semibold">Oktaedrik (Oh)</span><span className="bg-green-600/20 text-green-400 border border-green-600/30 rounded-full px-3 py-1 text-xs">{CRYSTAL.iupac}</span><span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded-full px-3 py-1 text-xs">d³ — kinetik inert</span></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">{[["Panjara parametrlari",`a=${CRYSTAL.a}Å, c=${CRYSTAL.c}Å`],["Fazoviy guruh",CRYSTAL.spaceGroup],["Hajm / Z",`${CRYSTAL.volume}Å³ / Z=${CRYSTAL.Z}`],["R₁ / wR₂ / GoF",`${CRYSTAL.r1Obs} / ${CRYSTAL.wR2Obs} / ${CRYSTAL.gof}`]].map(([l,v],i)=>(<div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-3 text-center"><p className="text-purple-400 text-xs mb-1">{l}</p><p className="text-white font-semibold text-sm">{v}</p></div>))}</div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4"><p className="text-green-400 text-sm"><strong>⚠ Xavfsizlik:</strong> {CRYSTAL.safety}</p></div></div></div>)
}

const TABS = [
  { id: "diffraction", label: "Difraktogramma", icon: "📊" },
  { id: "calculator", label: "Bragg + Scherrer", icon: "📐" },
  { id: "structure", label: "Struktura ma'lumotlari", icon: "💎" },
  { id: "perfection", label: "Oktaedrik mukammallik", icon: "🔷" },
  { id: "comparison", label: "M(III) taqqoslash", icon: "⚖️" },
  { id: "refinement", label: "Ishonchlilik", icon: "📋" },
]

export default function CrH2O6RentgenPage() {
  const [activeTab, setActiveTab] = useState("diffraction")
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 px-6 py-4 mb-6 border-b border-purple-800/50">
          <Link href="/ilmiy/tahlil/rentgen/birikmalar" className="hover:bg-purple-800/50 p-2 rounded-xl transition-all border border-purple-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg></Link>
          <h1 className="text-xl font-bold text-white">[Cr(H₂O)₆]³⁺ — Rentgen difraksiyasi tahlili</h1>
        </div>
        <HeroSection />
        <div className="flex flex-wrap gap-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-1.5 mb-6">
          {TABS.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab===tab.id?"bg-emerald-600/40 text-white border border-emerald-400/50":"text-purple-400 hover:text-white hover:bg-purple-800/30"}`}><span className="mr-1.5">{tab.icon}</span>{tab.label}</button>))}
        </div>
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          {activeTab==="diffraction"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">Hisoblangan difraktogramma</h2><p className="text-purple-400 text-sm">[Cr(H₂O)₆]³⁺ ning trigonal fazasi (R3̄c) uchun hisoblangan PXRD pattern. <strong className="text-emerald-400">Bu xom eksperimental difraktogramma emas.</strong></p><DifraktogrammaGrafik /><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Piklar ro'yxati</h3><div className="overflow-x-auto max-h-64"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">hkl</th><th className="text-left py-2 px-3 text-purple-400">2θ (°)</th><th className="text-left py-2 px-3 text-purple-400">d (Å)</th><th className="text-left py-2 px-3 text-purple-400">I (%)</th></tr></thead><tbody>{CRYSTAL.diffractionPeaks.map((p,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-2 px-3 font-mono text-emerald-400">({p.h}{p.k}{p.l})</td><td className="py-2 px-3 text-purple-200">{p.twotheta.toFixed(2)}</td><td className="py-2 px-3 text-purple-200">{p.d.toFixed(2)}</td><td className="py-2 px-3 text-purple-200">{p.intensity}</td></tr>))}</tbody></table></div></div></div>)}
          {activeTab==="calculator"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">Bragg + Scherrer kalkulyatori</h2><p className="text-purple-400 text-sm">Trigonal R3̄c birlik hujayra uchun d(hkl) ni hisoblang.</p><BraggScherrerKalkulyator /></div>)}
          {activeTab==="structure"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">Kristall struktura ma'lumotlari</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Bog' uzunliklari</h3><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Bog'</th><th className="text-left py-2 px-3 text-purple-400">Uzunlik (Å)</th></tr></thead><tbody>{CRYSTAL.bondLengths.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 text-emerald-400 font-mono text-xs">{r.bond}</td><td className="py-2 px-3 text-purple-200">{r.length}</td></tr>))}</tbody></table></div><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-white font-semibold mb-3">Bog' burchaklari</h3><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Burchak</th><th className="text-left py-2 px-3 text-purple-400">Qiymat</th></tr></thead><tbody>{CRYSTAL.bondAngles.map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 text-emerald-400 font-mono text-xs">{r.angle}</td><td className="py-2 px-3 text-purple-200">{r.value}</td></tr>))}</tbody></table></div></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4"><h3 className="text-blue-400 font-semibold text-sm mb-2">🔬 Nima uchun [Cr(H₂O)₆]³⁺ mukammal oktaedrik?</h3><p className="text-purple-200 text-sm">Cr³⁺ (d³) — t₂g orbitallar yarim to'lgan (t₂g³). Bu elektron konfiguratsiya sferik simmetrik elektron zichlik hosil qiladi — Yahn-Teller effekti yo'q. Natijada barcha 6 ta Cr−O bog'i deyarli teng (<strong className="text-emerald-400">Δ = 0.007 Å</strong>). O−Cr−O burchaklari ideal 90° va 180° ga juda yaqin. Kinetik inertlik (t₁/₂ ≈ 40 soat) bu mukammal geometriyani qo'shimcha stabilizatsiya qiladi.</p></div></div>)}
          {activeTab==="perfection"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">{CRYSTAL.octahedralPerfection.title}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"><div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4"><p className="text-emerald-400 font-bold text-lg">{CRYSTAL.octahedralPerfection.avgSis}</p><p className="text-purple-400 text-xs mt-1">Sis burchak</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.octahedralPerfection.avgTrans}</p><p className="text-purple-400 text-xs mt-1">Trans burchak</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.octahedralPerfection.bondEquivalence}</p><p className="text-purple-400 text-xs mt-1">Bog' ekvivalentligi</p></div><div className="bg-purple-800/30 rounded-xl p-4"><p className="text-white font-bold text-lg">{CRYSTAL.octahedralPerfection.bondEquivalence}</p><p className="text-purple-400 text-xs mt-1">Buzilish indeksi</p></div></div><p className="text-purple-200 text-sm">{CRYSTAL.octahedralPerfection.cause}</p></div>)}
          {activeTab==="comparison"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">{CRYSTAL.comparison.title}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-4"><h3 className="text-emerald-400 font-semibold mb-2">Cr(III)</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.cr}</p></div><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-purple-300 font-semibold mb-2">Co(III)</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.co}</p></div><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-purple-300 font-semibold mb-2">Fe(III)</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.fe}</p></div><div className="bg-purple-800/30 rounded-xl p-4"><h3 className="text-purple-300 font-semibold mb-2">Al(III)</h3><p className="text-purple-200 text-sm">{CRYSTAL.comparison.al}</p></div></div><p className="text-purple-400 text-sm">{CRYSTAL.comparison.note}</p></div>)}
          {activeTab==="refinement"&&(<div className="space-y-4"><h2 className="text-xl font-bold text-emerald-400">Ishonchlilik parametrlari</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-purple-700/50"><th className="text-left py-3 px-4 text-purple-400">Parametr</th><th className="text-left py-3 px-4 text-purple-400">Qiymat</th><th className="text-left py-3 px-4 text-purple-400">Maqbul diapazon</th></tr></thead><tbody>{[["R₁",CRYSTAL.r1Obs.toFixed(3),"< 0.05"],["wR₂",CRYSTAL.wR2Obs.toFixed(3),"< 0.10"],["GoF",CRYSTAL.gof.toFixed(2),"0.8−1.3"],["Rint",CRYSTAL.rInt.toFixed(3),"< 0.05"],["Rσ",CRYSTAL.rSigma.toFixed(3),"< 0.03"],["To'liqlik",CRYSTAL.completeness,"> 95%"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-3 px-4 text-emerald-400 font-mono">{r[0]}</td><td className="py-3 px-4 text-purple-200">{r[1]}</td><td className="py-3 px-4 text-purple-400">{r[2]}</td></tr>))}</tbody></table></div></div>)}
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-purple-800/50">
          <Link href="/ilmiy/tahlil/rentgen/birikmalar/zn-oh4" className="text-purple-400 hover:text-purple-200 text-sm flex items-center gap-2"><span>←</span> [Zn(OH)₄]²⁻</Link>
          <Link href="/ilmiy/tahlil/rentgen/birikmalar" className="text-purple-400 hover:text-purple-200 text-sm">Barcha birikmalar →</Link>
        </div>
      </div>
    </div>
  )
}