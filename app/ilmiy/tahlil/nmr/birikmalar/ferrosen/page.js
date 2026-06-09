"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI (Canvas + Animatsiya) ─────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#fb923c", xMin = 8, xMax = 0, xLabel = "δ (ppm) — ¹H YaMR" }) {
  const canvasRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef(null)
  const pulseRef = useRef(0)

  useEffect(() => {
    let start = null; const duration = 2000
    function animate(t) { if (!start) start = t; const p = Math.min((t-start)/duration, 1); setAnimProgress(p); if (p<1) animRef.current = requestAnimationFrame(animate) }
    animRef.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(animRef.current)
  }, [])

  useEffect(() => {
    const i = setInterval(() => { pulseRef.current = (pulseRef.current+0.05)%(Math.PI*2); if(selectedPeak) { const c=canvasRef.current; if(c) drawSpectrum(c.getContext("2d"),c.width,c.height) } }, 50)
    return () => clearInterval(i)
  }, [selectedPeak, peaks])

  const PAD={l:70,r:40,t:35,b:55}, W=820, H=300, plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
  const ppmToX=(ppm)=>PAD.l+((xMin-ppm)/(xMin-xMax))*plotW
  const intToY=(int)=>PAD.t+((100-int)/100)*plotH

  function lorentz(ppm, ppm0, height, width) {
    return height / (1 + Math.pow((ppm - ppm0) / width, 2))
  }

  const peakDefs = peaks.map(p => [p.ppm, p.height || 90, p.width || 0.15])

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=xMin; ppm>=xMax; ppm-=1){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

    const maxPpm = xMin - (xMin-xMax) * animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.5; ctx.shadowBlur=3; ctx.shadowColor=lineColor
    let fp=true
    for(let ppm=xMin; ppm>=xMax; ppm-=0.05) {
      if(ppm<maxPpm && animProgress<1) continue
      let signal=0; peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w))
      const x=ppmToX(ppm), y=intToY(Math.min(98, signal))
      if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)
    }
    ctx.stroke(); ctx.shadowBlur=0

    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.05){if(ppm>maxPpm&&animProgress<1)continue;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,signal));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();ctx.fillStyle="rgba(251,146,60,0.12)";ctx.fill()}

    peaks.forEach(p=>{let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})

    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=190,th=50,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-65;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+34)}

    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=1) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText(xLabel,PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=0.5;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-orange-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹H YaMR (500 MHz, CDCl₃). Bitta o'tkir singlet — yuqori simmetriya!</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── INTERAKTIV HARORAT SLADERI ──────────────────────────────────────────────
function HaroratInteraktiv() {
  const [harorat, setHarorat] = useState(298)
  const canvasRef = useRef(null)

  const signalWidth = Math.max(0.5, 1 + (298 - harorat) * 0.02)
  const signalText = harorat < 200 ? "Signal kengaygan — halqalar aylanishi sekinlashgan" : harorat > 350 ? "Signal o'tkir — halqalar tez aylanadi" : "Normal — xona harorati"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)

    // Grid
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    for (let ppm = 8; ppm >= 0; ppm -= 1) {
      const x = 50 + ((8 - ppm) / 8) * (W - 100)
      ctx.beginPath(); ctx.moveTo(x, 20); ctx.lineTo(x, H - 40); ctx.stroke()
    }

    // Asosiy chiziq
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(50, H - 40); ctx.lineTo(W - 50, H - 40); ctx.stroke()

    // Signal
    const cx = 50 + ((8 - 4.15) / 8) * (W - 100)
    const sigma = signalWidth * 8

    ctx.beginPath()
    ctx.strokeStyle = "#fb923c"; ctx.lineWidth = 2
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 80 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Fill
    ctx.beginPath()
    for (let x = 50; x <= W - 50; x++) {
      const rel = (x - cx) / sigma
      const y = (H - 40) - 80 * Math.exp(-rel * rel / 2)
      x === 50 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.lineTo(W - 50, H - 40); ctx.lineTo(50, H - 40); ctx.closePath()
    ctx.fillStyle = "rgba(251,146,60,0.15)"; ctx.fill()

    // Belgilar
    ctx.fillStyle = "#fb923c"; ctx.font = "bold 12px monospace"; ctx.textAlign = "center"
    ctx.fillText("δ 4.15", cx, H - 100)
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"
    ctx.fillText(signalText, W / 2, H - 8)
    ctx.fillText(`Δν½ ≈ ${signalWidth.toFixed(1)} Hz`, W / 2, 35)
    ctx.fillText(`T = ${harorat} K`, W / 2, 50)

    // X o'qi
    ctx.fillStyle = "#7c6a9e"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
    for (let ppm = 8; ppm >= 0; ppm -= 1) {
      const x = 50 + ((8 - ppm) / 8) * (W - 100)
      ctx.fillText(ppm, x, H - 25)
    }
    ctx.fillText("δ (ppm)", W / 2, H - 10)

  }, [harorat, signalWidth])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">Harorat:</span>
        <input type="range" min="100" max="400" value={harorat} onChange={(e) => setHarorat(+e.target.value)}
          className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-orange-400" />
        <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
      </div>
      <canvas ref={canvasRef} width={700} height={200} className="w-full h-auto rounded-lg border border-purple-700/30" />
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
          <div className="text-purple-400 text-xs">Δν½</div>
          <div className="text-white font-mono font-bold">{signalWidth.toFixed(1)} Hz</div>
        </div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
          <div className="text-purple-400 text-xs">Aylanish tezligi</div>
          <div className="text-white font-mono font-bold">{harorat > 250 ? "Tez" : "Sekin"}</div>
        </div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
          <div className="text-purple-400 text-xs">Konformatsiya</div>
          <div className="text-white font-mono font-bold">{harorat > 250 ? "D₅h/D₅d aralash" : "D₅d (staggered)"}</div>
        </div>
      </div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function Ferrosen_YaMR() {
  const [activeTab, setActiveTab] = useState("1h")

  const peaks1H = [
    { ppm: 4.15, label: "Cp protonlari", color: "#fb923c", height: 95, width: 0.1, desc: "BARCHA 10 TA PROTON EKVIVALENT! Bitta o'tkir singlet. δ = 4.15 ppm — ferrosen uchun xarakterli. Halqalar erkin aylanadi (xona T da)." },
  ]

  const peaks13C = [
    { ppm: 68, label: "Cp uglerodlari", color: "#60a5fa", height: 90, width: 0.15, desc: "Barcha 10 ta uglerod ekvivalent — 1 ta signal. δ = 68 ppm. Aromatik uglerodlarga xos." },
  ]

  const tabs = [
    { id: "1h",         label: "📈 ¹H YaMR Spektri" },
    { id: "13c",        label: "📈 ¹³C YaMR Spektri" },
    { id: "interaktiv", label: "🌡️ Harorat interaktiv" },
    { id: "jadval",     label: "📊 Parametrlar" },
    { id: "simmetriya", label: "⚛️ Simmetriya" },
    { id: "oksidlanish",label: "🔄 Ferrosen → Ferroseniy" },
    { id: "taqqos",     label: "⚖️ Boshqa metallosenlar" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 [Fe(C₅H₅)₂] — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">ferrosen • Sendvich kompleks • ¹H: 1 ta signal (δ=4.15) • ¹³C: 1 ta signal (δ=68)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ¹³C YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">18 e⁻</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Sendvich</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">10 ta H — 1 signal!</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">E°=+0.40 V</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Fe(C₅H₅)₂]</h2>
            <span className="text-purple-400 text-lg">186.04 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">bis(η⁵-siklopentadienil)temir(II) — <span className="text-orange-400 italic font-bold">"FERROSEN"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — ferrosen metallorganik kimyoda eng ko'p o'rganilgan birikma!
            <strong className="text-yellow-400"> ¹H:</strong> <strong>FAQAT BITTA SIGNAL!</strong> δ = 4.15 ppm —
            barcha 10 ta proton magnit jihatdan ekvivalent. Bu — yuqori simmetriya (D₅d/D₅h) isboti.
            <strong className="text-yellow-400"> ¹³C:</strong> ham faqat 1 ta signal — δ = 68 ppm.
            Halqalar erkin aylanadi (xona haroratida). <strong>Harorat interaktiv:</strong> past T da signal kengayadi.
            <strong className="text-yellow-400"> Oksidlanish:</strong> ferrosen → ferroseniy [Fe(C₅H₅)₂]⁺ —
            paramagnit, signallar kengayadi va siljiydi!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H δ","4.15 ppm"],["¹³C δ","68 ppm"],["Signallar soni","1 ta (¹H) / 1 ta (¹³C)"],["18 e⁻","Diamagnit"],
              ["E°","+0.40 V"],["Geometriya","Sendvich"],["Fe−C","2.04 Å"],["Erituvchi","CDCl₃"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1">{r[0]}</div><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-orange-600/40 text-white border border-orange-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {/* ── ¹H SPEKTR ── */}
        {activeTab==="1h"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri — Ferrosen</h2><YaMRSpektrGrafik peaks={peaks1H} lineColor="#fb923c" xMin={8} xMax={0} xLabel="δ (ppm) — ¹H YaMR (500 MHz, CDCl₃)"/><div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-yellow-400">BU — YaMR TARIXIDAGI ENG MASHHUR SIGNAL!</strong> Bitta o'tkir singlet δ=4.15 ppm — ferrosenning yuqori simmetriyasini ko'rsatadi. Barcha 10 ta proton ekvivalent. Halqalar erkin aylanadi.</p></div></div>)}

        {/* ── ¹³C SPEKTR ── */}
        {activeTab==="13c"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹³C YaMR Spektri — Ferrosen</h2><YaMRSpektrGrafik peaks={peaks13C} lineColor="#60a5fa" xMin={120} xMax={0} xLabel="δ (ppm) — ¹³C YaMR (125 MHz, CDCl₃)"/><p className="text-purple-200 text-sm text-center">Barcha 10 ta uglerod ekvivalent — 1 ta signal δ=68 ppm.</p></div>)}

        {/* ── INTERAKTIV ── */}
        {activeTab==="interaktiv"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🌡️ Harorat interaktiv — halqalar aylanishi</h2><p className="text-purple-200 leading-relaxed">Ferrosenda siklopentadienil halqalari <strong className="text-yellow-400">erkin aylanadi</strong>. Past haroratda aylanish sekinlashadi — signal kengayadi. Bu — <strong>molekulyar dinamikani YaMR orqali kuzatish</strong>ning klassik namunasi!</p><HaroratInteraktiv /><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-3">Harorat va signal kengligi:</h3><div className="space-y-2 text-sm">{[["T > 300 K","Tez aylanish — o'tkir singlet (Δν½≈1 Hz)"],["T ≈ 200−300 K","Oraliq — signal biroz kengaygan"],["T < 150 K","Sekin aylanish — signal keng (Δν½≈5−10 Hz)"],["T < 100 K","Aylanish to'xtagan — 2 ta signal (staggered D₅d)"]].map((r,i)=>(<div key={i} className="flex justify-between py-1.5 border-b border-purple-700/30"><span className="text-purple-400 text-xs">{r[0]}</span><span className="text-purple-200 text-xs text-right">{r[1]}</span></div>))}</div></div></div>)}

        {/* ── JADVAL ── */}
        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 To'liq YaMR parametrlari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H</th><th className="py-3 px-4">¹³C</th></tr></thead><tbody className="text-purple-200">{[["δ","4.15 ppm","68 ppm"],["Signallar soni","1 ta","1 ta"],["Multipliklik","Singlet","Singlet"],["Δν½","~1 Hz","~2 Hz"],["Ekvivalent yadrolar","10 ta H","10 ta C"],["Erituvchi","CDCl₃","CDCl₃"],["Standart","TMS (δ=0)","TMS (δ=0)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── SIMMETRIYA ── */}
        {activeTab==="simmetriya"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚛️ Nima uchun 1 ta signal? — Simmetriya!</h2><p className="text-purple-200 leading-relaxed">Ferrosenning YaMR spektrida <strong className="text-yellow-400">faqat 1 ta signal</strong> bo'lishi — uning yuqori simmetriyasining bevosita isboti.</p><div className="space-y-3">{[["D₅d simmetriya","Inversiya markazi bor — barcha protonlar ekvivalent"],["D₅h simmetriya","Inversiya markazi yo'q — lekin baribir barcha protonlar ekvivalent"],["Erkin aylanish","Xona T da halqalar tez aylanadi — vaqt bo'yicha o'rtacha ekvivalentlik"],["Ekvivalentlik isboti","Agar protonlar har xil bo'lganda — 2−3 ta signal kuzatilar edi"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {/* ── OKSIDLANISH ── */}
        {activeTab==="oksidlanish"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Ferrosen → Ferroseniy — YaMR o'zgarishi</h2><p className="text-purple-200 leading-relaxed">Ferrosen oson oksidlanadi: [Fe(C₅H₅)₂] → [Fe(C₅H₅)₂]⁺ + e⁻ (E°=+0.40 V). Ferroseniy — paramagnit (17e⁻, S=½). YaMR spektri keskin o'zgaradi!</p><div className="grid grid-cols-2 gap-4"><div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5"><h3 className="text-orange-400 font-bold mb-3">Ferrosen (Fe²⁺)</h3><p className="text-purple-200 text-sm"><strong>¹H:</strong> δ=4.15, o'tkir<br/><strong>¹³C:</strong> δ=68, o'tkir<br/><strong>Magnit:</strong> Diamagnit<br/><strong>Rang:</strong> To'q sariq</p></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><h3 className="text-blue-400 font-bold mb-3">Ferroseniy (Fe³⁺)</h3><p className="text-purple-200 text-sm"><strong>¹H:</strong> Juda keng (paramagnit)<br/><strong>¹³C:</strong> Keng, siljigan<br/><strong>Magnit:</strong> Paramagnit (S=½)<br/><strong>Rang:</strong> Ko'k-yashil</p></div></div><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><p className="text-purple-200 text-sm"><strong>YaMR diagnostikasi:</strong> Ferrosen → Ferroseniy o'tishini ¹H signali kengayishi orqali kuzatish mumkin. Bu — redoks holatini YaMR orqali aniqlashning klassik namunasi.</p></div></div>)}

        {/* ── TAQQOSLASH ── */}
        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Boshqa metallosenlar YaMR</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Metallosen</th><th className="py-3 px-4">¹H δ (ppm)</th><th className="py-3 px-4">¹³C δ (ppm)</th><th className="py-3 px-4">Magnit</th></tr></thead><tbody className="text-purple-200">{[["Ferrosen [Fe(C₅H₅)₂]","4.15","68","Diamagnit"],["Kobaltosen [Co(C₅H₅)₂]","5.5 (keng)","—","Paramagnit (19e⁻)"],["Nikelosen [Ni(C₅H₅)₂]","5.3","88","Paramagnit (20e⁻)"],["Rutenosen [Ru(C₅H₅)₂]","4.55","70","Diamagnit"],["Osmosen [Os(C₅H₅)₂]","4.65","67","Diamagnit"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><p className="text-green-300 text-sm"><strong>Qiziqarli fakt:</strong> Ferrosen — 18e⁻ (diamagnit, o'tkir signal). Kobaltosen — 19e⁻, nikelosen — 20e⁻ (ikkalasi paramagnit, keng signallar). 18-elektron qoidasi YaMR da ham o'z isbotini topadi!</p></div></div>)}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">¹H: 1 ta signal δ=4.15 ppm</strong> — yuqori simmetriya isboti!</li><li><strong className="text-yellow-400">¹³C: 1 ta signal δ=68 ppm</strong> — barcha C ekvivalent</li><li><strong className="text-yellow-400">Halqalar erkin aylanadi</strong> — past T da signal kengayadi</li><li><strong className="text-yellow-400">Ferrosen → Ferroseniy:</strong> diamagnit → paramagnit</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/sisplatin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Sisplatin</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/ni-cn4" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">[Ni(CN)₄]²⁻ →</Link></div>

      </section>
    </main>
  )
}