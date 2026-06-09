"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI ──────────────────────────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#86efac", xMin = 8, xMax = -2, xLabel = "δ (ppm) — ¹H YaMR" }) {
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
  const peakDefs = peaks.map(p => [p.ppm, p.height || 90, p.width || 0.2])

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=xMin; ppm>=xMax; ppm-=1){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()
    const maxPpm = xMin - (xMin-xMax) * animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.5; ctx.shadowBlur=3; ctx.shadowColor=lineColor
    let fp=true
    for(let ppm=xMin; ppm>=xMax; ppm-=0.05) { if(ppm<maxPpm && animProgress<1) continue; let s=0; peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w)); const x=ppmToX(ppm), y=intToY(Math.min(98,s)); if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y) }
    ctx.stroke(); ctx.shadowBlur=0
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.05){if(ppm>maxPpm&&animProgress<1)continue;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,s));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();ctx.fillStyle="rgba(134,239,172,0.12)";ctx.fill()}
    peaks.forEach(p=>{let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})
    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=190,th=50,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-65;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+34)}
    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=1) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText(xLabel,PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=0.5;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-green-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹H YaMR (D₂O). OH⁻ protonlari — konsentratsiya va pH ga bog'liq.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold">{selectedPeak.label}</span></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── pH INTERAKTIV ────────────────────────────────────────────────────────────
function PhInteraktiv() {
  const [pH, setPH] = useState(13)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = "#0f0a1a"; ctx.fillRect(0, 0, W, H)

    const PAD={l:60,r:30,t:30,b:50}, plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
    const ppmToX=(ppm)=>PAD.l+((8-ppm)/10)*plotW
    const intToY=(int)=>PAD.t+((100-int)/100)*plotH

    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=8; ppm>=-2; ppm-=1){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

    if (pH > 12) {
      const cx = ppmToX(2.5)
      ctx.strokeStyle="#86efac"; ctx.lineWidth=2
      ctx.beginPath()
      for(let x=PAD.l; x<=PAD.l+plotW; x++){const rel=(x-cx)/15; const y=intToY(98*Math.exp(-rel*rel/2)); x===PAD.l?ctx.moveTo(x,y):ctx.lineTo(x,y)}
      ctx.stroke()
      ctx.fillStyle="rgba(134,239,172,0.15)"
      ctx.beginPath(); for(let x=PAD.l+plotW; x>=PAD.l; x--){const rel=(x-cx)/15; const y=intToY(98*Math.exp(-rel*rel/2)); ctx.lineTo(x,y)}; ctx.closePath(); ctx.fill()
      ctx.fillStyle="#86efac"; ctx.font="bold 11px monospace"; ctx.textAlign="center"; ctx.fillText("δ 2.5 (OH⁻ koord.)", cx, 30)
      ctx.fillText("[Zn(OH)₄]²⁻ dominant", W/2, 50)
    } else if (pH > 8) {
      const cx1 = ppmToX(2.5), cx2 = ppmToX(1.0)
      ctx.strokeStyle="#86efac"; ctx.lineWidth=1.5
      ctx.beginPath(); for(let x=PAD.l; x<=PAD.l+plotW; x++){const rel=(x-cx1)/20; const y=intToY(55*Math.exp(-rel*rel/2)); x===PAD.l?ctx.moveTo(x,y):ctx.lineTo(x,y)}; ctx.stroke()
      ctx.strokeStyle="#a78bfa"; ctx.lineWidth=1.5
      ctx.beginPath(); for(let x=PAD.l; x<=PAD.l+plotW; x++){const rel=(x-cx2)/12; const y=intToY(70*Math.exp(-rel*rel/2)); x===PAD.l?ctx.moveTo(x,y):ctx.lineTo(x,y)}; ctx.stroke()
      ctx.fillStyle="#86efac"; ctx.font="bold 10px monospace"; ctx.textAlign="center"; ctx.fillText("δ 2.5", cx1, 28)
      ctx.fillStyle="#a78bfa"; ctx.fillText("δ 1.0", cx2, 22)
      ctx.fillText("Aralash — [Zn(OH)₄]²⁻ + erkin OH⁻", W/2, 50)
    } else {
      const cx = ppmToX(4.8)
      ctx.strokeStyle="#fbbf24"; ctx.lineWidth=2
      ctx.beginPath(); for(let x=PAD.l; x<=PAD.l+plotW; x++){const rel=(x-cx)/8; const y=intToY(40*Math.exp(-rel*rel/2)); x===PAD.l?ctx.moveTo(x,y):ctx.lineTo(x,y)}; ctx.stroke()
      ctx.fillStyle="#fbbf24"; ctx.font="bold 11px monospace"; ctx.textAlign="center"; ctx.fillText("δ 4.8 (H₂O/HDO)", cx, 30)
      ctx.fillText("Zn(OH)₂↓ — cho'kma", W/2, 50)
    }

    ctx.fillStyle="#7c6a9e"; ctx.font="10px sans-serif"; ctx.textAlign="center"
    for(let ppm=8; ppm>=-2; ppm-=2) ctx.fillText(ppm, ppmToX(ppm), PAD.t+plotH+18)
    ctx.fillText("δ (ppm)", W/2, H-8)
    ctx.fillStyle="#ff0"; ctx.font="12px sans-serif"; ctx.fillText(`pH = ${pH}`, W/2, 20)

  }, [pH])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-purple-400">pH:</span>
        <input type="range" min="5" max="14" step="0.5" value={pH} onChange={(e) => setPH(+e.target.value)} className="flex-1 h-1.5 bg-purple-800 rounded-full appearance-none cursor-pointer accent-green-400" />
        <span className="text-purple-300 font-mono w-14 text-right">{pH}</span>
      </div>
      <canvas ref={canvasRef} width={700} height={180} className="w-full h-auto rounded-lg border border-purple-700/30" />
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Dominant tur</div><div className="text-white font-bold text-sm">{pH>12?"[Zn(OH)₄]²⁻":pH>8?"Aralash":"Zn(OH)₂↓"}</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">¹H signallar</div><div className="text-white font-bold text-sm">{pH>12?"1 ta":pH>8?"2 ta":"1 ta (H₂O)"}</div></div>
        <div className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30"><div className="text-purple-400 text-xs">Geometriya</div><div className="text-white font-bold text-sm" dangerouslySetInnerHTML={{__html: pH>12?"T<sub>d</sub>":pH>8?"T<sub>d</sub>+O<sub>h</sub>":"O<sub>h</sub>"}}/></div>
      </div>
    </div>
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function ZnOH4_YaMR() {
  const [activeTab, setActiveTab] = useState("1h")

  const peaks1H = [
    { ppm: 2.5, label: "OH⁻ (koordinatsiyalangan)", color: "#86efac", height: 85, width: 0.4, desc: "[Zn(OH)₄]²⁻ da gidrokso ligandlari. 4 ta OH⁻ — barchasi ekvivalent (T<sub>d</sub>). Signal pH&gt;12 da ko'rinadi." },
    { ppm: 1.0, label: "OH⁻ (erkin, kuchsiz)", color: "#a78bfa", height: 40, width: 0.5, desc: "Eritmadagi erkin OH⁻ ionlari. Signal intensivligi konsentratsiyaga bog'liq." },
    { ppm: 4.8, label: "H₂O/HDO", color: "#fbbf24", height: 30, width: 0.3, desc: "Erituvchi qoldiq signali (D₂O da HDO). Neytral pH da asosiy signal." },
  ]

  const tabs = [
    { id: "1h",         label: "📈 ¹H YaMR Spektri" },
    { id: "ph",         label: "⚖️ pH interaktiv" },
    { id: "jadval",     label: "📊 Parametrlar" },
    { id: "zn67",       label: "🔬 ⁶⁷Zn YaMR" },
    { id: "amfoter",    label: "🔄 Amfoterlik" },
    { id: "taqqos",     label: "⚖️ Zn²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧲 [Zn(OH)₄]²⁻ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetragidroksosinkat(II) ioni • d¹⁰ diamagnit • Amfoterlik • pH interaktiv</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ⁶⁷Zn YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KMBE=0</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Amfoter</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">pH interaktiv!</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Zn(OH)₄]²⁻</h2>
            <span className="text-purple-400 text-lg">133.41 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">tetragidroksosinkat(II) ioni — <span className="text-green-400 italic">d¹⁰ amfoter kompleks</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Zn²⁺ (d¹⁰) diamagnit, YaMR uchun ideal.
            <strong className="text-yellow-400"> ¹H:</strong> OH⁻ protonlari δ≈2.0−3.5 ppm (pH ga bog'liq).
            <strong className="text-yellow-400"> Amfoterlik:</strong> Zn(OH)₂ + 2OH⁻ ⇌ [Zn(OH)₄]²⁻.
            pH &gt; 12 da [Zn(OH)₄]²⁻ dominant — ¹H da koordinatsiyalangan OH⁻ signali.
            pH &lt; 8 da Zn(OH)₂ cho'kmasi — signallar yo'qoladi.
            <strong className="text-yellow-400"> ⁶⁷Zn:</strong> I=5/2, tabiiy miqdori 4.1%, kvadrupol yadro.
            <strong className="text-yellow-400"> pH interaktiv slayderi</strong> — pH o'zgarishi bilan spektr qanday o'zgarishini ko'ring!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H δ (OH⁻)","2.0−3.5 ppm"],["⁶⁷Zn I","5/2 (4.1%)"],["Geometriya","Tetraedrik (T<sub>d</sub>)"],["log β₄","≈15.5"],
              ["KMBE","0"],["Gibridlanish","sp³"],["Bog' burchagi","109.5°"],["Erituvchi","D₂O (ishqoriy)"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-green-600/40 text-white border border-green-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="1h"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri — [Zn(OH)₄]²⁻</h2><YaMRSpektrGrafik peaks={peaks1H} lineColor="#86efac" xMin={8} xMax={-2}/></div>)}

        {activeTab==="ph"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ pH interaktiv — amfoterlik</h2><PhInteraktiv /></div>)}

        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 Parametrlar</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H</th><th className="py-3 px-4">⁶⁷Zn</th></tr></thead><tbody className="text-purple-200">{[["δ","2.0−3.5 (pH bog'liq)","~0−100 ppm"],["I","½","5/2 (kvadrupol)"],["Miqdor","99.98%","4.1%"],["Signal","Singlet (T<sub>d</sub>)","Keng (kvadrupol)"],["Sezgirlik","1.00","2.8×10⁻⁴"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="zn67"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 ⁶⁷Zn YaMR</h2><p className="text-purple-200 leading-relaxed"><strong className="text-yellow-400">⁶⁷Zn</strong> — I=5/2, tabiiy miqdori 4.1%. Kvadrupol yadro — signallar keng. T<sub>d</sub> simmetriyada elektr maydon gradienti kichik — signal nisbatan tor. Sezgirligi past — konsentrlangan eritmalar kerak.</p><div className="space-y-3">{[["⁶⁷Zn I","5/2 (kvadrupol)"],["Tabiiy miqdor","4.1%"],["Nisbiy sezgirlik","2.8×10⁻⁴ (¹H=1)"],["Kimyoviy siljish","~0−100 ppm (Zn(NO₃)₂ standart)"],["T<sub>d</sub> simmetriya","Kichik elektr maydon gradienti — torroq signal"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {activeTab==="amfoter"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Amfoterlik — YaMR monitoring</h2><p className="text-purple-200 leading-relaxed">Zn(OH)₂ ham kislota, ham asos bilan reaksiyaga kirishadi. YaMR bu jarayonni kuzatish imkonini beradi.</p><div className="grid grid-cols-2 gap-4"><div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><h3 className="text-red-400 font-bold mb-2">Kislotali muhit (pH&lt;5)</h3><p className="text-purple-200 text-sm">Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O<br/>¹H: Zn(H₂O)₆²⁺ — suv signallari<br/>Rang: rangsiz</p></div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><h3 className="text-green-400 font-bold mb-2">Ishqoriy muhit (pH&gt;12)</h3><p className="text-purple-200 text-sm">Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻<br/>¹H: OH⁻ signali δ≈2.5<br/>Rang: rangsiz</p></div></div></div>)}

        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Zn²⁺ komplekslari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">¹H δ</th><th className="py-3 px-4">Geometriya</th></tr></thead><tbody className="text-purple-200">{[["[Zn(OH)₄]²⁻","2.0−3.5 (OH⁻)","T<sub>d</sub>"],["[Zn(H₂O)₆]²⁺","4.8 (H₂O)","O<sub>h</sub>"],["[Zn(NH₃)₄]²⁺","1.5−2.5 (NH₃)","T<sub>d</sub>"],["[Zn(CN)₄]²⁻","— (CN⁻)","T<sub>d</sub>"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{__html:r[2]}}/></tr>))}</tbody></table></div></div>)}

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">Diamagnit d¹⁰</strong> — YaMR uchun ideal</li><li><strong className="text-yellow-400">pH interaktiv:</strong> pH&gt;12 → [Zn(OH)₄]²⁻, pH&lt;8 → Zn(OH)₂↓</li><li><strong className="text-yellow-400">⁶⁷Zn YaMR:</strong> I=5/2, kvadrupol</li><li><strong className="text-yellow-400">Amfoterlik</strong> — YaMR monitoring imkoniyati</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Fe(CO)₅]</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/cr-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">[Cr(H₂O)₆]³⁺ →</Link></div>

      </section>
    </main>
  )
}