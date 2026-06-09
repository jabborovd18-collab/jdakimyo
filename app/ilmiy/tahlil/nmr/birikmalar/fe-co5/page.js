"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI ──────────────────────────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#fbbf24", xMin = 250, xMax = 150, xLabel = "δ (ppm) — ¹³C YaMR" }) {
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
  function lorentz(ppm, ppm0, height, width) { return height / (1 + Math.pow((ppm - ppm0) / width, 2)) }
  const peakDefs = peaks.map(p => [p.ppm, p.height || 90, p.width || 0.3])

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=xMin; ppm>=xMax; ppm-=10){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()
    const maxPpm = xMin - (xMin-xMax) * animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.5; ctx.shadowBlur=3; ctx.shadowColor=lineColor
    let fp=true
    for(let ppm=xMin; ppm>=xMax; ppm-=0.2) { if(ppm<maxPpm && animProgress<1) continue; let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y) }
    ctx.stroke(); ctx.shadowBlur=0
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.2){if(ppm>maxPpm&&animProgress<1)continue;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,s));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();ctx.fillStyle="rgba(251,191,36,0.12)";ctx.fill()}
    peaks.forEach(p=>{let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})
    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=200,th=55,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-70;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+36);ctx.fillStyle="#7c6a9e";ctx.font="8px sans-serif";ctx.fillText(p.desc,tx+tw/2,ty+50)}
    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=20) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText(xLabel,PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=5;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹³C YaMR (125 MHz). Berry psevdorotatsiyasi — aksial/ekvatorial almashinuv.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold">{selectedPeak.label}</span></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── BERRY INTERAKTIV ─────────────────────────────────────────────────────────
function BerryInteraktiv() {
  const [harorat, setHarorat] = useState(298)
  const canvasRef = useRef(null)

  const isFast = harorat > 250
  const peak1 = { ppm: 210, label: "CO (barcha 5 ta)", color: "#fbbf24", height: 90, width: isFast ? 0.8 : 0 }
  const peak2a = { ppm: 212, label: "CO (ekvatorial ×3)", color: "#fbbf24", height: 55, width: isFast ? 0 : 0.4 }
  const peak2b = { ppm: 208, label: "CO (aksial ×2)", color: "#fb923c", height: 38, width: isFast ? 0 : 0.35 }

  const displayPeaks = isFast ? [peak1] : [peak2a, peak2b]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)

    const PAD={l:60,r:30,t:30,b:50}, plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
    const ppmToX=(ppm)=>PAD.l+((230-ppm)/30)*plotW
    const intToY=(int)=>PAD.t+((100-int)/100)*plotH
    function lorentz(ppm, ppm0, height, width) { return height / (1 + Math.pow((ppm - ppm0) / width, 2)) }

    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=230; ppm>=200; ppm-=5){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

    if (isFast) {
      let peakDefs = [[210, 90, 1.2]]
      ctx.beginPath(); ctx.strokeStyle="#fbbf24"; ctx.lineWidth=2
      for(let ppm=230; ppm>=200; ppm-=0.1){let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); ppm===230?ctx.moveTo(x,y):ctx.lineTo(x,y)}
      ctx.stroke()
      ctx.fillStyle="rgba(251,191,36,0.15)"
      ctx.beginPath(); for(let ppm=200; ppm<=230; ppm+=0.1){let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); ppm===200?ctx.moveTo(x,y):ctx.lineTo(x,y)}; ctx.closePath(); ctx.fill()
      ctx.fillStyle="#fbbf24"; ctx.font="bold 12px monospace"; ctx.textAlign="center"; ctx.fillText("δ 210 (1 ta signal!)", ppmToX(210), 35)
    } else {
      let peakDefs = [[212, 55, 0.6], [208, 38, 0.5]]
      ctx.beginPath(); ctx.strokeStyle="#fbbf24"; ctx.lineWidth=2
      for(let ppm=230; ppm>=200; ppm-=0.1){let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); ppm===230?ctx.moveTo(x,y):ctx.lineTo(x,y)}
      ctx.stroke()
      ctx.fillStyle="rgba(251,191,36,0.12)"; ctx.beginPath(); for(let ppm=200; ppm<=230; ppm+=0.1){let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); ppm===200?ctx.moveTo(x,y):ctx.lineTo(x,y)}; ctx.closePath(); ctx.fill()
      ctx.fillStyle="#fbbf24"; ctx.font="bold 11px monospace"; ctx.textAlign="center"; ctx.fillText("δ 212 (ekv ×3)", ppmToX(212), 30)
      ctx.fillStyle="#fb923c"; ctx.fillText("δ 208 (aks ×2)", ppmToX(208), 48)
    }

    ctx.fillStyle="#7c6a9e"; ctx.font="10px sans-serif"; ctx.textAlign="center"
    for(let ppm=230; ppm>=200; ppm-=10) ctx.fillText(ppm, ppmToX(ppm), PAD.t+plotH+18)
    ctx.fillStyle="#ff0"; ctx.font="11px sans-serif"; ctx.fillText(`T = ${harorat} K — ${isFast ? "TEZ almashinuv (1 signal)" : "SEKIN almashinuv (2 signal)"}`, W/2, H-8)
    ctx.fillText("δ (ppm) — ¹³C YaMR", W/2, 18)
  }, [harorat, isFast])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">Harorat:</span>
        <input type="range" min="150" max="350" value={harorat} onChange={(e) => setHarorat(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-yellow-400" />
        <span className="text-purple-300 font-mono w-16 text-right">{harorat} K</span>
      </div>
      <canvas ref={canvasRef} width={700} height={200} className="w-full h-auto rounded-lg border border-purple-700/30" />
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Almashinuv</div><div className="text-white font-bold">{isFast ? "TEZ" : "SEKIN"}</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Signallar soni</div><div className="text-white font-bold">{isFast ? "1 ta" : "2 ta"}</div></div>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 text-center"><p className="text-yellow-300 text-xs">Berry psevdorotatsiyasi — aksial va ekvatorial CO ligandlari o'rin almashadi. T &gt; 250 K da tez — 1 ta o'rtacha signal. T &lt; 200 K da sekin — 2 ta alohida signal.</p></div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function FeCO5_YaMR() {
  const [activeTab, setActiveTab] = useState("13c")

  const peaks13C = [
    { ppm: 210, label: "CO (barcha 5 ta)", color: "#fbbf24", height: 90, width: 1.2, desc: "Xona haroratida: 1 ta signal! Berry psevdorotatsiyasi — aksial va ekvatorial CO tez almashadi. Barcha 5 ta CO o'rtacha ekvivalent." },
  ]

  const peaks13C_low = [
    { ppm: 212, label: "CO ekvatorial (×3)", color: "#fbbf24", height: 55, width: 0.5, desc: "Past haroratda (−100°C): ekvatorial CO lar. 3 ta CO — tekislikda 120° burchak ostida." },
    { ppm: 208, label: "CO aksial (×2)", color: "#fb923c", height: 38, width: 0.45, desc: "Past haroratda (−100°C): aksial CO lar. 2 ta CO — 180° burchak ostida." },
  ]

  const tabs = [
    { id: "13c",        label: "📈 ¹³C YaMR (298 K)" },
    { id: "13c_low",    label: "📈 ¹³C YaMR (−100°C)" },
    { id: "berry",      label: "🔄 Berry interaktiv" },
    { id: "jadval",     label: "📊 Parametrlar" },
    { id: "electron18", label: "⚡ 18-elektron" },
    { id: "xavfsizlik", label: "⚠️ Xavfsizlik" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧲 [Fe(CO)₅] — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">pentakarboniltemir(0) • Berry psevdorotatsiyasi! • ¹³C: 1 ta signal (298 K) → 2 ta (−100°C)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹³C YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">18 e⁻</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">D₃h</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Berry psevdorotatsiyasi!</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">1 signal → 2 signal</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Fe(CO)₅]</h2>
            <span className="text-purple-400 text-lg">195.90 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">pentakarboniltemir(0) — <span className="text-yellow-400 italic font-bold">BERRY PSEVDOROTATSIYASI!</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">BU — YaMR DARSLIKLARIDAGI ENG MASHHUR MISOL!</strong>
            <strong className="text-yellow-400"> 298 K:</strong> ¹³C YaMR da <strong>FAQAT 1 TA SIGNAL</strong> (δ≈210 ppm) —
            5 ta CO guruhi ekvivalent! Sababi: <strong>Berry psevdorotatsiyasi</strong> — 
            aksial va ekvatorial CO ligandlari juda tez o'rin almashadi (k≈10⁵−10⁷ s⁻¹).
            <strong className="text-yellow-400"> −100°C:</strong> almashinish sekinlashadi — 
            <strong>2 TA SIGNAL:</strong> δ≈212 ppm (3 ta ekvatorial CO) + δ≈208 ppm (2 ta aksial CO).
            <strong className="text-yellow-400"> Bu — dinamik YaMR ning klassik namunasi!</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹³C δ (298 K)","210 ppm (1 signal!)"],["¹³C δ (−100°C)","212 + 208 ppm"],["Valent e⁻","18 ta"],["Geometriya","D₃h"],
              ["Berry tezligi","10⁵−10⁷ s⁻¹"],["Holati","Suyuq (25°C)"],["Qaynash T","103°C"],["Erituvchi","CDCl₃"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1">{r[0]}</div><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-yellow-600/40 text-white border border-yellow-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="13c"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹³C YaMR — 298 K (1 ta signal!)</h2><YaMRSpektrGrafik peaks={peaks13C} lineColor="#fbbf24" xMin={250} xMax={150} xLabel="δ (ppm) — ¹³C YaMR (125 MHz, CDCl₃, 298 K)"/><div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-yellow-400">1 TA SIGNAL!</strong> Berry psevdorotatsiyasi tufayli barcha 5 ta CO ekvivalent. Bu — dinamik YaMR ning eng yorqin namunasi!</p></div></div>)}

        {activeTab==="13c_low"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹³C YaMR — −100°C (2 ta signal!)</h2><YaMRSpektrGrafik peaks={peaks13C_low} lineColor="#fbbf24" xMin={230} xMax={195} xLabel="δ (ppm) — ¹³C YaMR (125 MHz, −100°C)"/><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-blue-400">2 TA SIGNAL!</strong> Past haroratda Berry psevdorotatsiyasi sekin — aksial (δ 208, 2 ta CO) va ekvatorial (δ 212, 3 ta CO) alohida ko'rinadi.</p></div></div>)}

        {activeTab==="berry"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Berry psevdorotatsiyasi — interaktiv!</h2><BerryInteraktiv /></div>)}

        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 To'liq parametrlar</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">298 K</th><th className="py-3 px-4">−100°C (173 K)</th></tr></thead><tbody className="text-purple-200">{[["Signallar soni","1 ta","2 ta"],["δ (ekvatorial)","210 (o'rtacha)","212 ppm"],["δ (aksial)","210 (o'rtacha)","208 ppm"],["Intensivlik nisbati","—","3:2 (ekv:aks)"],["Almashinish tezligi","~10⁵−10⁷ s⁻¹","~10⁰−10² s⁻¹"],["Mexanizm","Berry psevdorotatsiyasi","—"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="electron18"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚡ 18-elektron qoidasi</h2><p className="text-purple-200 leading-relaxed">Fe⁰ (d⁸) + 5×CO (2e⁻) = 18 valent elektron. To'liq to'lgan qobiq — diamagnit, YaMR uchun ideal.</p><div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center"><p className="text-yellow-400 font-bold text-2xl">Fe⁰ (d⁸) + 5CO (10e⁻) = 18e⁻</p></div></div>)}

        {activeTab==="xavfsizlik"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚠️ Xavfsizlik</h2><div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><p className="text-red-300 text-sm"><strong>⚠️ JUDA ZAHARLI!</strong> Uchuvchan suyuqlik (qaynash T=103°C). CO ajratadi. LD₅₀≈40 mg/kg. Havoda 0.1 ppm dan oshmasligi kerak. Germetik idishda, qorong'ida saqlanadi.</p></div></div>)}

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">298 K: 1 ta signal</strong> — Berry psevdorotatsiyasi!</li><li><strong className="text-yellow-400">−100°C: 2 ta signal</strong> — aksial + ekvatorial</li><li><strong className="text-yellow-400">Dinamik YaMR klassikasi!</strong></li><li><strong className="text-red-400">⚠️ Juda zaharli!</strong></li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/co-cl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [CoCl₄]²⁻</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/zn-oh4" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">[Zn(OH)₄]²⁻ →</Link></div>

      </section>
    </main>
  )
}