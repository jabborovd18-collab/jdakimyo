"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI ──────────────────────────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#22d3ee", xMin = 8, xMax = 0, xLabel = "δ (ppm) — ¹H YaMR" }) {
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
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.05){if(ppm>maxPpm&&animProgress<1)continue;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,s));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();ctx.fillStyle="rgba(34,211,238,0.12)";ctx.fill()}
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

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-cyan-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹H YaMR. Diamagnit — o'tkir signallar.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function AgNH32_YaMR() {
  const [activeTab, setActiveTab] = useState("1h")

  const peaks1H = [
    { ppm: 3.5, label: "NH₃ protonlari", color: "#22d3ee", height: 88, width: 0.25, desc: "Koordinatsiyalangan NH₃ protonlari. Chiziqli N−Ag−N — ikkala NH₃ ekvivalent. Kuchsiz kengayish (¹⁴N kvadrupol)." },
    { ppm: 2.8, label: "Erkin NH₃ (muvozanat)", color: "#a78bfa", height: 35, width: 0.3, desc: "Erkin NH₃ signali. Muvozanat: [Ag(NH₃)₂]⁺ ⇌ Ag⁺ + 2NH₃." },
  ]

  const tabs = [
    { id: "1h", label: "📈 ¹H YaMR Spektri" },
    { id: "ag", label: "🔬 ¹⁰⁷/¹⁰⁹Ag YaMR" },
    { id: "jadval", label: "📊 Parametrlar" },
    { id: "izotop", label: "🔄 Ikkita izotop" },
    { id: "tollens", label: "🥈 Tollens reaksiyasi" },
    { id: "taqqos", label: "⚖️ Boshqa Ag⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧲 [Ag(NH₃)₂]⁺ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">diamminkumush(I) ioni • Tollens reaktivi • ¹⁰⁷/¹⁰⁹Ag YaMR</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹H + ¹⁰⁷/¹⁰⁹Ag YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Chiziqli</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">2 ta izotop</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">Tollens reaktivi</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Ag(NH₃)₂]⁺</h2>
            <span className="text-purple-400 text-lg">141.94 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">diamminkumush(I) ioni — <span className="text-cyan-400 italic font-bold">"TOLLENS REAKTIVI"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">YaMR spektri</strong> — Ag⁺ (d¹⁰) diamagnit, YaMR uchun ideal.
            <strong className="text-yellow-400"> ¹H:</strong> NH₃ protonlari δ≈3.0−4.0 ppm, erkin NH₃ bilan muvozanatda.
            <strong className="text-yellow-400"> ¹⁰⁷Ag (I=½, 51.8%) + ¹⁰⁹Ag (I=½, 48.2%):</strong> IKKALA izotop ham YaMR faol!
            Kimyoviy siljish δ≈+50 ppm (AgNO₃ standartiga nisbatan). Ikkita yaqin signal —
            izotop siljishi kichik (~1−2 ppm). <strong className="text-yellow-400"> K₂ &gt; K₁</strong> —
            ikkinchi NH₃ birikishi birinchisidan oson (nodir holat!).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹H δ (NH₃)","3.0−4.0 ppm"],["¹⁰⁷Ag δ","~+50 ppm"],["¹⁰⁹Ag δ","~+52 ppm"],["¹⁰⁷Ag I","½ (51.8%)"],
              ["¹⁰⁹Ag I","½ (48.2%)"],["log K₁","3.3"],["log K₂","3.9"],["Geometriya","Chiziqli"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{__html:r[0]}}/><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-cyan-600/40 text-white border border-cyan-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="1h"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹H YaMR Spektri</h2><YaMRSpektrGrafik peaks={peaks1H} lineColor="#22d3ee" xMin={8} xMax={0}/></div>)}

        {activeTab==="ag"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 ¹⁰⁷/¹⁰⁹Ag YaMR — ikkita izotop</h2><p className="text-purple-200 leading-relaxed"><strong className="text-yellow-400">¹⁰⁷Ag</strong> (I=½, 51.8%) va <strong className="text-yellow-400">¹⁰⁹Ag</strong> (I=½, 48.2%) — ikkalasi ham YaMR faol! Kimyoviy siljish diapazoni: −100 dan +200 ppm gacha.</p><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><div className="text-center"><svg viewBox="0 0 400 80" className="w-80 h-16 mx-auto"><line x1="30" y1="50" x2="370" y2="50" stroke="#3d2a5c" strokeWidth="0.5"/><line x1="180" y1="50" x2="180" y2="15" stroke="#22d3ee" strokeWidth="2.5"/><line x1="220" y1="50" x2="220" y2="20" stroke="#a78bfa" strokeWidth="2"/><text x="180" y="12" fill="#22d3ee" fontSize="9" fontFamily="monospace" textAnchor="middle">¹⁰⁷Ag (51.8%)</text><text x="220" y="18" fill="#a78bfa" fontSize="8" fontFamily="monospace" textAnchor="middle">¹⁰⁹Ag (48.2%)</text></svg><p className="text-purple-300 text-xs mt-2">Δδ ≈ 1−2 ppm — izotop siljishi kichik</p></div></div></div>)}

        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 Parametrlar</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">¹H</th><th className="py-3 px-4">¹⁰⁷Ag</th><th className="py-3 px-4">¹⁰⁹Ag</th></tr></thead><tbody className="text-purple-200">{[["δ","3.0−4.0","~+50","~+52"],["I","½","½","½"],["Miqdor","99.98%","51.8%","48.2%"],["Sezgirlik","1.00","6.7×10⁻⁵","1.0×10⁻⁴"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="izotop"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔄 Ikkita izotop — noyob holat</h2><p className="text-purple-200 leading-relaxed">Kumush — <strong className="text-yellow-400">YaMR da ikkala barqaror izotopi ham faol</strong> bo'lgan kam sonli elementlardan biri.</p><div className="space-y-3">{[["¹⁰⁷Ag","I=½, 51.8%, γ=−1.08×10⁷ rad/T·s"],["¹⁰⁹Ag","I=½, 48.2%, γ=−1.24×10⁷ rad/T·s"],["Izotop siljishi","Δδ≈1−2 ppm"],["Sezgirlik","¹⁰⁹Ag ¹⁰⁷Ag dan ~1.5× sezgirroq"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"><div className="flex justify-between text-sm"><span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-200">{r[1]}</span></div></div>))}</div></div>)}

        {activeTab==="tollens"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🥈 Tollens reaksiyasi — YaMR monitoring</h2><p className="text-purple-200 leading-relaxed">[Ag(NH₃)₂]⁺ — Tollens reaktivining faol komponenti.</p><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><p className="text-green-400 font-mono text-sm mb-2">RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O</p><p className="text-purple-200 text-sm"><strong>YaMR monitoring:</strong> [Ag(NH₃)₂]⁺ signali yo'qoladi, erkin NH₃ signali kuchayadi.</p></div></div>)}

        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Boshqa Ag⁺ komplekslari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">¹⁰⁷Ag δ</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["[Ag(NH₃)₂]⁺","~+50 ppm","N-donor, chiziqli"],["[Ag(CN)₂]⁻","~−50 ppm","C-donor, kuchli maydon"],["[AgCl₂]⁻","~+100 ppm","Cl-donor, kuchsiz maydon"],["[Ag(S₂O₃)₂]³⁻","~+200 ppm","S-donor, yumshoq asos"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">Diamagnit d¹⁰</strong> — YaMR uchun ideal</li><li><strong className="text-yellow-400">¹⁰⁷/¹⁰⁹Ag:</strong> IKKALA izotop ham YaMR faol (I=½)</li><li><strong className="text-yellow-400">K₂ &gt; K₁</strong> — nodir barqarorlik tartibi</li><li><strong className="text-yellow-400">Tollens reaktivi</strong> — YaMR monitoring imkoniyati</li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Cu(H₂O)₆]²⁺</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/co-cl4" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">[CoCl₄]²⁻ →</Link></div>

      </section>
    </main>
  )
}