"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI ──────────────────────────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#fb923c", xMin = 10, xMax = -2 }) {
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

  const peakDefs = [[4.5, 85, 0.3], [3.8, 78, 0.25], [3.2, 90, 0.2]]

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    for(let ppm=xMin; ppm>=xMax; ppm-=2){const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()}
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

    const maxPpm = xMin - (xMin-xMax) * animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.5; ctx.shadowBlur=3; ctx.shadowColor=lineColor
    let fp=true
    for(let ppm=xMin; ppm>=xMax; ppm-=0.1) {
      if(ppm<maxPpm && animProgress<1) continue
      let signal=0; peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w))
      const x=ppmToX(ppm), y=intToY(Math.min(98, signal))
      if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)
    }
    ctx.stroke(); ctx.shadowBlur=0

    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.1){if(ppm>maxPpm&&animProgress<1)continue;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,signal));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();const g=ctx.createLinearGradient(0,PAD.t,0,PAD.t+plotH);g.addColorStop(0,"rgba(251,146,60,0.15)");g.addColorStop(1,"rgba(251,146,60,0.01)");ctx.fillStyle=g;ctx.fill()}

    peaks.forEach(p=>{let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})

    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let signal=0;peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,signal));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=180,th=50,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-65;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+34)}

    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=2) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText("δ (ppm) — ¹H YaMR",PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=0.8;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-orange-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-orange-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹H YaMR (500 MHz, D₂O). NH₃ protonlari — keng singlet.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function CoNH36Cl3_YaMR() {
  const [activeTab, setActiveTab] = useState("1h")

  const peaks1H = [
    { ppm: 4.5, label: "NH₃ (keng)", color: "#fb923c", desc: "Koordinatsiyalangan NH₃ protonlari. Keng singlet — ¹⁴N kvadrupol relaksatsiyasi tufayli. 6 ta NH₃ — 18 ta proton." },
    { ppm: 3.8, label: "NH₃ (o'tkir)", color: "#fbbf24", desc: "NH₃ protonlarining ikkinchi komponenti. Haroratga bog'liq." },
    { ppm: 3.2, label: "H₂O/HDO", color: "#60a5fa", desc: "Erituvchi qoldiq signali." },
  ]

  const tabs = [
    { id: "1h", label: "📈 ¹H YaMR Spektri" },
    { id: "59co", label: "🔬 ⁵⁹Co YaMR" },
    { id: "jadval", label: "📊 Parametrlar" },
    { id: "diamagnit", label: "💎 Diamagnit afzalligi" },
    { id: "kvadrupol", label: "⚛️ ¹⁴N Kvadrupol" },
    { id: "taqqos", label: "⚖️ Co²⁺ bilan" },
    { id: "amaliy", label: "💡 Amaliy ahamiyati" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 [Co(NH₃)₆]Cl₃ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaamminkobalt(III) xlorid • Verner klassikasi • ¹H va ⁵⁹Co YaMR</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ⁵⁹Co YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">O<sub>h</sub></span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">⁵⁹Co: I=7/2</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Inert</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Co(NH₃)₆]Cl₃</h2>
            <span className="text-purple-400 text-lg">267.48 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">geksaamminkobalt(III) xlorid — <span className="text-orange-400 italic">"Verner klassikasi"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Co³⁺ (d⁶, QS, t₂g⁶ eg⁰) diamagnit.
            <strong className="text-yellow-400"> ¹H:</strong> NH₃ protonlari δ ≈ 3.5−5.0 ppm da keng singlet.
            <strong className="text-yellow-400"> ⁵⁹Co:</strong> δ ≈ 8120 ppm, I=7/2.
            <strong className="text-yellow-400"> ¹⁵N:</strong> δ ≈ −20 dan −40 ppm.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H δ","3.5−5.0 ppm"],["⁵⁹Co δ","~8120 ppm"],["⁵⁹Co I","7/2"],["¹⁴N","Kvadrupol"],
              ["S","0"],["KMBE","−2.4Δo"],["Inertlik","Juda inert"],["Erituvchi","D₂O"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1">{r[0]}</div><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-orange-600/40 text-white border border-orange-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="1h"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri</h2><YaMRSpektrGrafik peaks={peaks1H} lineColor="#fb923c" xMin={10} xMax={0}/></div>)}

        {activeTab==="59co"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 ⁵⁹Co YaMR — δ≈8120 ppm</h2><p className="text-purple-200 leading-relaxed">⁵⁹Co — I=7/2, tabiiy miqdori 100%. Kimyoviy siljish diapazoni −4000 dan +14000 ppm gacha.</p><div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30"><svg viewBox="0 0 700 80" className="w-full h-full"><line x1="50" y1="55" x2="680" y2="55" stroke="#3d2a5c" strokeWidth="0.5"/><text x="50" y="72" fill="#7c6a9e" fontSize="9">14000</text><text x="365" y="72" fill="#7c6a9e" fontSize="9">0 ppm</text><text x="640" y="72" fill="#7c6a9e" fontSize="9">−4000</text><line x1="570" y1="55" x2="570" y2="12" stroke="#fb923c" strokeWidth="3"/><text x="570" y="10" fill="#fb923c" fontSize="11" fontFamily="monospace" textAnchor="middle">δ 8120</text></svg></div></div>)}

        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 Parametrlar</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H</th><th className="py-3 px-4">⁵⁹Co</th><th className="py-3 px-4">¹⁵N</th></tr></thead><tbody className="text-purple-200">{[["δ","3.5−5.0","~8120","−20/−40"],["Signal","Keng singlet","Juda keng","Singlet"],["Sabab","¹⁴N kvadrupol","Kvadrupol I=7/2","—"],["Miqdor","99.98%","100%","0.37%"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="diamagnit"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">💎 Diamagnit — YaMR uchun ideal</h2><p className="text-purple-200 leading-relaxed">Co³⁺ (d⁶, QS) — S=0. Paramagnit effekt yo'q — signallar tor va yaxshi aniqlangan.</p><div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-orange-400 font-bold mb-2">[Co(NH₃)₆]³⁺</h3><p className="text-purple-200 text-sm">Co³⁺, d⁶, QS — S=0. Diamagnit, tor signallar. Rang: zarg'aldoq-sariq. Inert: t½&gt;kunlar.</p></div><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-blue-400 font-bold mb-2">[Co(NH₃)₆]²⁺</h3><p className="text-purple-200 text-sm">Co²⁺, d⁷, YS — S=3/2. Paramagnit, keng signallar. Rang: pushti. Labil: t½&lt;1 s.</p></div></div></div>)}

        {activeTab==="kvadrupol"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚛️ ¹⁴N Kvadrupol effekti</h2><p className="text-purple-200 leading-relaxed">¹⁴N (I=1) — kvadrupol yadro. NH₃ signalini kengaytiradi.</p><div className="space-y-3">{[["¹⁴N spini","I=1 — kvadrupol"],["Kvadrupol moment Q","2.0×10⁻³⁰ m²"],["Kengayish mexanizmi","¹⁴N tez T₁ → ¹H signali kengayadi"],["Yechim","¹⁵N boyitish (I=½, kvadrupol yo'q)"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Co³⁺ vs Co²⁺</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">Co³⁺</th><th className="py-3 px-4">Co²⁺</th></tr></thead><tbody className="text-purple-200">{[["Magnit","Diamagnit","Paramagnit"],["¹H signal","Keng (¹⁴N)","Juda keng"],["⁵⁹Co","Kuzatiladi","Kuzatilmaydi"],["KMBE","−2.4Δo","−0.8Δo"],["Inertlik","Juda inert","Labil"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-orange-300">{r[1]}</td><td className="py-3 px-4 text-purple-300">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="amaliy"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">💡 Amaliy ahamiyati</h2><div className="space-y-3">{[{t:"Koordinatsion kimyoda",d:"YaMR orqali Co³⁺/Co²⁺ oksidlanish darajasini aniqlash"},{t:"Sintez nazorati",d:"Co²⁺→Co³⁺ oksidlanganda rang va YaMR signallari o'zgaradi"},{t:"Kinetik inertlik",d:"Ligand almashinuvi sekin — oraliq mahsulotlarni YaMR da ko'rish mumkin"},{t:"⁵⁹Co YaMR",d:"Kimyoviy siljish ligand maydon kuchiga juda sezgir"},{t:"Biologik ahamiyati",d:"B₁₂ vitamini (Co³⁺ korrin kompleksi) — YaMR tahlili uchun model birikma"}].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3"><span className="text-yellow-400 font-bold">{i+1}.</span><div><p className="text-white font-semibold text-sm">{r.t}</p><p className="text-purple-300 text-xs mt-0.5">{r.d}</p></div></div>))}</div></div>)}

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">Diamagnit Co³⁺</strong> — YaMR uchun ideal</li><li><strong className="text-yellow-400">¹H: NH₃ δ≈3.5−5.0 ppm</strong></li><li><strong className="text-yellow-400">⁵⁹Co: δ≈8120 ppm</strong></li><li><strong className="text-yellow-400">¹⁴N kvadrupol</strong> — signalni kengaytiradi</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← K₄[Fe(CN)₆]</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/sisplatin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Sisplatin →</Link></div>

      </section>
    </main>
  )
}