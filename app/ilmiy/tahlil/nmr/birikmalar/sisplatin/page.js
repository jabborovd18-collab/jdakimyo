"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI ──────────────────────────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#fbbf24", xMin = 10, xMax = -2 }) {
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

  const PAD={l:70,r:40,t:35,b:55}, W=820, H=320, plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
  const ppmToX=(ppm)=>PAD.l+((xMin-ppm)/(xMin-xMax))*plotW
  const intToY=(int)=>PAD.t+((100-int)/100)*plotH

  function lorentz(ppm, ppm0, height, width) {
    return height / (1 + Math.pow((ppm - ppm0) / width, 2))
  }

  const peakDefs = [[4.2, 80, 0.4], [3.6, 72, 0.35], [3.0, 65, 0.3]]

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=xMin; ppm>=xMax; ppm-=1){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

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

    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.05){if(ppm>maxPpm&&animProgress<1)continue;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,signal));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();const g=ctx.createLinearGradient(0,PAD.t,0,PAD.t+plotH);g.addColorStop(0,"rgba(251,191,36,0.15)");g.addColorStop(1,"rgba(251,191,36,0.01)");ctx.fillStyle=g;ctx.fill()}

    peaks.forEach(p=>{let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})

    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=180,th=50,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-65;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+34)}

    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=1) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText("δ (ppm) — ¹H YaMR",PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
    ctx.fillStyle="#fbbf24";ctx.font="10px sans-serif";ctx.textAlign="left"
    ctx.fillText("NH₃ protonlari",ppmToX(4.2)+35,PAD.t+25)
    ctx.fillText("(sis-izomer)",ppmToX(4.2)+35,PAD.t+40)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=0.5;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹H YaMR (500 MHz, D₂O). NH₃ protonlari sis-izomer uchun.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function Sisplatin_YaMR() {
  const [activeTab, setActiveTab] = useState("1h")

  const peaks1H = [
    { ppm: 4.2, label: "NH₃ (asosiy)", color: "#fbbf24", desc: "Sis-izomerda NH₃ protonlari. ¹⁹⁵Pt bilan spin-spin bog'lanish (²J≈35−50 Hz) — ikkita satellite signal." },
    { ppm: 3.6, label: "NH₃ (satellite)", color: "#60a5fa", desc: "¹⁹⁵Pt satellite signallari (I=½, 33.8%). Markaziy signal atrofida ±J/2 masofada." },
    { ppm: 3.0, label: "H₂O/HDO", color: "#a78bfa", desc: "Erituvchi qoldiq signali." },
  ]

  const tabs = [
    { id: "1h",         label: "📈 ¹H YaMR Spektri" },
    { id: "195pt",      label: "🔬 ¹⁹⁵Pt YaMR" },
    { id: "sistrans",   label: "🔄 Sis vs Trans" },
    { id: "jadval",     label: "📊 Parametrlar" },
    { id: "satellite",  label: "🛰️ Satellite signallar" },
    { id: "dnk",        label: "🧬 DNK bilan bog'lanish" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧲 sis-[PtCl₂(NH₃)₂] — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">sis-diammindixloroplatina(II) • SISPLATIN • ¹H, ¹⁹⁵Pt, ¹⁵N YaMR</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ¹⁹⁵Pt YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Kvadrat-planar</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">¹⁹⁵Pt: I=½</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">💊 Saratonga qarshi</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>sis-[PtCl₂(NH₃)₂]</h2>
            <span className="text-purple-400 text-lg">300.05 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">sis-diammindixloroplatina(II) — <span className="text-yellow-400 italic font-bold">"SISPLATIN"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — sisplatinni tahlil qilishda eng kuchli usullardan biri.
            <strong className="text-yellow-400"> ¹H:</strong> NH₃ protonlari δ ≈ 4.0−4.5 ppm, ¹⁹⁵Pt satellite signallari bilan
            (²J<sub>Pt−H</sub> ≈ 35−50 Hz). <strong className="text-yellow-400">¹⁹⁵Pt:</strong> I=½, tabiiy miqdori 33.8%.
            <strong>Sis-izomer:</strong> δ ≈ −2100 ppm. <strong>Trans-izomer:</strong> δ ≈ −1850 ppm. 
            Farq ~250 ppm — <strong>sis va trans izomerlarni ishonchli farqlash</strong> imkonini beradi!
            <strong className="text-yellow-400">¹⁵N:</strong> NH₃ azoti, ¹⁹⁵Pt bilan ¹J≈300−350 Hz.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H δ (NH₃)","4.0−4.5 ppm"],["¹⁹⁵Pt δ (sis)","−2100 ppm"],["¹⁹⁵Pt δ (trans)","−1850 ppm"],["²J(Pt−H)","35−50 Hz"],
              ["¹⁹⁵Pt I","½ (33.8%)"],["Geometriya","Kvadrat-planar"],["Dipol moment","3.2 D"],["S","0 (diamagnit)"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> D₂O yoki DMF-d₇</span>
            <span><strong className="text-purple-300">Chastota:</strong> 500 MHz (¹H), 107 MHz (¹⁹⁵Pt)</span>
            <span><strong className="text-purple-300">Standart:</strong> TMS (¹H), Na₂[PtCl₆] (¹⁹⁵Pt, δ=0)</span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-yellow-600/40 text-white border border-yellow-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {/* ── ¹H SPEKTR ── */}
        {activeTab==="1h"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri — Sisplatin</h2><YaMRSpektrGrafik peaks={peaks1H} lineColor="#fbbf24" xMin={8} xMax={0}/><div className="flex flex-wrap gap-3">{peaks1H.map((p,i)=>(<div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs" style={{borderColor:p.color+"40",background:p.color+"10"}}><span className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="font-mono" style={{color:p.color}}>δ {p.ppm} ppm</span><span className="text-purple-400">{p.label}</span></div>))}</div><div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong className="text-yellow-400">Muhim:</strong> ¹⁹⁵Pt satellite signallari markaziy signal atrofida joylashgan (²J≈35−50 Hz). Ularning mavjudligi Pt−N bog'i mavjudligini tasdiqlaydi.</p></div></div>)}

        {/* ── ¹⁹⁵Pt SPEKTR ── */}
        {activeTab==="195pt"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 ¹⁹⁵Pt YaMR — Sis vs Trans diagnostikasi</h2><p className="text-purple-200 leading-relaxed"><strong className="text-yellow-400">¹⁹⁵Pt</strong> — I=½, tabiiy miqdori 33.8%, nisbiy sezgirligi ¹H ga nisbatan 3.4×10⁻³. Kimyoviy siljish diapazoni: <strong>+6000 dan −6000 ppm gacha</strong> (12000 ppm!). Sisplatin uchun δ ≈ −2100 ppm.</p><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><div className="relative h-28 flex items-center justify-center"><svg viewBox="0 0 700 100" className="w-full h-full"><line x1="50" y1="70" x2="680" y2="70" stroke="#3d2a5c" strokeWidth="0.5"/><text x="50" y="87" fill="#7c6a9e" fontSize="9">−3000</text><text x="365" y="87" fill="#7c6a9e" fontSize="9">−2000 ppm</text><text x="640" y="87" fill="#7c6a9e" fontSize="9">−1000</text><line x1="450" y1="70" x2="450" y2="20" stroke="#fbbf24" strokeWidth="3"/><text x="450" y="18" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">δ −2100 (sis)</text><line x1="540" y1="70" x2="540" y2="40" stroke="#60a5fa" strokeWidth="2.5" strokeDasharray="4 2"/><text x="540" y="38" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">δ −1850 (trans)</text><text x="160" y="45" fill="#7c6a9e" fontSize="10" textAnchor="middle">Δδ ≈ 250 ppm!</text></svg></div></div><div className="space-y-3">{[["δ sis-izomer","−2100 ppm (C₂ᵥ simmetriya)"],["δ trans-izomer","−1850 ppm (D₂h simmetriya)"],["Δδ (sis−trans)","~250 ppm — ishonchli farqlash!"],["Chiziq kengligi","~10−100 Hz (kimyoviy siljish anizotropiyasi)"],["Standart","Na₂[PtCl₆] (δ=0) yoki H₂[PtCl₆]"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {/* ── SIS vs TRANS ── */}
        {activeTab==="sistrans"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Sis vs Trans — YaMR orqali farqlash</h2><p className="text-purple-200 leading-relaxed">Sisplatin va uning trans izomeri YaMR da <strong className="text-yellow-400">har xil signallar</strong> beradi. Bu farq ularning biologik faolligini tushuntirishda muhim.</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">sis-izomer</th><th className="py-3 px-4">trans-izomer</th></tr></thead><tbody className="text-purple-200">{[["Simmetriya","C₂ᵥ","D₂h"],["¹⁹⁵Pt δ","−2100 ppm","−1850 ppm"],["¹H δ (NH₃)","4.0−4.5 ppm","4.2−4.8 ppm"],["²J(Pt−H)","35−50 Hz","30−45 Hz"],["Dipol moment","3.2 D","0 D"],["Biologik faollik","FAOL (saratonga qarshi)","FAOL EMAS"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-blue-300">{r[1]}</td><td className="py-3 px-4 text-red-300">{r[2]}</td></tr>))}</tbody></table></div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><p className="text-green-300 text-sm"><strong>YaMR diagnostikasi:</strong> ¹⁹⁵Pt kimyoviy siljishi orqali sis va trans izomerlarni 100% ishonch bilan farqlash mumkin. Farq ~250 ppm!</p></div></div>)}

        {/* ── JADVAL ── */}
        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📊 To'liq YaMR parametrlari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H</th><th className="py-3 px-4">¹⁹⁵Pt</th><th className="py-3 px-4">¹⁵N</th></tr></thead><tbody className="text-purple-200">{[["δ","4.0−4.5 ppm","−2100 ppm","−50 dan −70 ppm"],["Multipliklik","Singlet + satellite","Singlet","Singlet (¹H dekup.)"],["J(Pt−X)","²J≈35−50 Hz","—","¹J≈300−350 Hz"],["Tabiiy miqdor","99.98%","33.8%","0.37%"],["Nisbiy sezgirlik","1.00","3.4×10⁻³","1.04×10⁻³"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {/* ── SATELLITE ── */}
        {activeTab==="satellite"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🛰️ ¹⁹⁵Pt Satellite signallar</h2><p className="text-purple-200 leading-relaxed">¹⁹⁵Pt (I=½, 33.8%) — ¹H signali atrofida <strong className="text-yellow-400">satellite signallar</strong> hosil qiladi. Bu signallar Pt−N bog'i mavjudligini tasdiqlaydi.</p><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-3">Satellite signal xususiyatlari:</h3><div className="space-y-2 text-sm">{[["Markaziy signal (¹⁹⁵Pt yo'q)","66.2% intensivlik (barcha boshqa Pt izotoplari)"],["Pastki satellite (α spin)","16.9% intensivlik, δ − J/2"],["Yuqori satellite (β spin)","16.9% intensivlik, δ + J/2"],["²J(Pt−H) qiymati","35−50 Hz — Pt−N bog'i mustahkamligini ko'rsatadi"],["Satellite yo'qligi","Pt−N bog'i uzilgan yoki Pt yo'q"]].map((r,i)=>(<div key={i} className="flex justify-between py-1.5 border-b border-purple-700/30"><span className="text-purple-400 text-xs">{r[0]}</span><span className="text-purple-200 text-xs text-right">{r[1]}</span></div>))}</div></div></div>)}

        {/* ── DNK ── */}
        {activeTab==="dnk"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🧬 DNK bilan bog'lanish — YaMR monitoring</h2><p className="text-purple-200 leading-relaxed">Sisplatin DNK bilan bog'langanda YaMR spektri <strong className="text-yellow-400">sezilarli o'zgaradi</strong>. ¹H va ¹⁹⁵Pt signallari siljiydi.</p><div className="grid grid-cols-3 gap-4"><div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2 text-sm">Erkin sisplatin</h3><p className="text-purple-200 text-xs">¹H: δ 4.2<br/>¹⁹⁵Pt: δ −2100</p></div><div className="bg-blue-600/10 rounded-xl p-4 text-center border border-blue-500/30"><h3 className="text-blue-400 font-bold mb-2 text-sm">Akvatsiyalangan</h3><p className="text-purple-200 text-xs">¹H: δ 4.5−5.0<br/>¹⁹⁵Pt: δ −1900</p></div><div className="bg-green-600/10 rounded-xl p-4 text-center border border-green-500/30"><h3 className="text-green-400 font-bold mb-2 text-sm">DNK bilan bog'langan</h3><p className="text-purple-200 text-xs">¹H: yangi signallar<br/>¹⁹⁵Pt: δ −2300</p></div></div><div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5"><p className="text-pink-300 text-sm"><strong>Klinik ahamiyati:</strong> YaMR orqali sisplatinning DNK bilan bog'lanish kinetikasi va mexanizmini o'rganish — yangi platina dorilarini yaratishda muhim.</p></div></div>)}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">¹⁹⁵Pt: δ≈−2100 ppm (sis)</strong> vs −1850 ppm (trans) — ishonchli farqlash</li><li><strong className="text-yellow-400">¹H: NH₃ δ≈4.0−4.5</strong>, ¹⁹⁵Pt satellite signallari (²J≈35−50 Hz)</li><li><strong className="text-yellow-400">Satellite signallar</strong> — Pt−N bog'i mavjudligini tasdiqlaydi</li><li><strong className="text-yellow-400">DNK bilan bog'lanish</strong> — YaMR signallari siljiydi</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Co(NH₃)₆]Cl₃</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/ferrosen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Ferrosen →</Link></div>

      </section>
    </main>
  )
}