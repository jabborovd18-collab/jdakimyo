"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

function YaMRSpektrGrafik({ peaks, lineColor = "#4ade80", xMin = 200, xMax = 0, xLabel = "δ (ppm) — ¹³C YaMR" }) {
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
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let ppm=xMax; ppm<=xMin; ppm+=0.2){if(ppm>maxPpm&&animProgress<1)continue;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(ppm,p0,h,w));const x=ppmToX(ppm), y=intToY(Math.min(98,s));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();ctx.fillStyle="rgba(74,222,128,0.12)";ctx.fill()}
    peaks.forEach(p=>{let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));const isH=hoveredPeak?.ppm===p.ppm,isS=selectedPeak?.ppm===p.ppm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,14*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);const lh=isA?45:32;ctx.moveTo(x,y-2);ctx.lineTo(x,y-lh);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 12px monospace":"bold 10px monospace";ctx.textAlign="center";ctx.fillText("δ "+p.ppm, x, y-lh-6)})
    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let s=0;peakDefs.forEach(([p0,h,w])=>s+=lorentz(p.ppm,p0,h,w));const x=ppmToX(p.ppm), y=intToY(Math.min(98,s));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=190,th=50,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-65;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 11px sans-serif";ctx.textAlign="center";ctx.fillText(`δ ${p.ppm} ppm`,tx+tw/2,ty+18);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+34)}
    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center"
    for(let ppm=xMin; ppm>=xMax; ppm-=20) ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18)
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText(xLabel,PAD.l+plotW/2,H-8)
    ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Intensivlik (%)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="right";ctx.fillText("TMS",ppmToX(0)-5,PAD.t-5)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])
  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=xMin-((mx-PAD.l)/plotW)*(xMin-xMax);let cl=null,md=5;peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-green-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. ¹³C YaMR. Barcha CN⁻ ekvivalent — 1 ta o'tkir singlet.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function NiCN4_YaMR() {
  const [activeTab, setActiveTab] = useState("13c")

  const peaks13C = [
    { ppm: 135, label: "CN⁻ (barcha 4 ta ekvivalent)", color: "#4ade80", height: 92, width: 0.5, desc: "Barcha 4 ta CN⁻ ligandi magnit jihatdan ekvivalent (D₄h simmetriya). Bitta o'tkir singlet. Erkin CN⁻: δ≈165 ppm. Koordinatsiyalanganda yuqori maydonga siljigan." },
  ]

  const tabs = [
    { id: "13c",        label: "📈 ¹³C YaMR Spektri" },
    { id: "jadval",     label: "📊 Parametrlar" },
    { id: "siljish",    label: "🔬 Kimyoviy siljish" },
    { id: "geometriya", label: "⬛ Kv-planar vs Tetraedrik" },
    { id: "barqaror",   label: "⚡ Termobarqaror, labil" },
    { id: "taqqos",     label: "⚖️ Boshqa Ni²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧲 [Ni(CN)₄]²⁻ — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetrasiyanonikkolat(II) ioni • Kvadrat-planar d⁸ • ¹³C YaMR</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹³C YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Kvadrat-planar</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">D₄h</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Termobarqaror</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Kinetik labil</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>[Ni(CN)₄]²⁻</h2>
            <span className="text-purple-400 text-lg">162.78 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">tetrasiyanonikkolat(II) ioni — <span className="text-green-400 italic">d⁸ kvadrat-planar kompleks</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">¹³C YaMR spektri</strong> — Ni²⁺ (d⁸, kvadrat-planar, D₄h) 
            <strong className="text-yellow-400"> diamagnit</strong>. Barcha 4 ta CN⁻ guruhi magnit jihatdan ekvivalent — 
            <strong className="text-yellow-400"> 1 ta o'tkir singlet</strong> δ ≈ 135 ppm da.
            Erkin CN⁻ (δ≈165 ppm) dan yuqori maydonga siljigan — Ni−C σ-bog'i tufayli uglerod atrofida 
            elektron zichlik ortgan. <strong className="text-yellow-400"> log β₄ ≈ 30</strong> — juda barqaror,
            lekin <strong>kinetik labil</strong> — CN⁻ almashinuvi tez. Bu YaMR da ko'rinmaydi, chunki 
            almashinish tez — bitta o'rtacha signal kuzatiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["¹³C δ","~135 ppm"],["Signal","O'tkir singlet"],["Ekvivalent","4 ta CN⁻"],["D₄h","Kvadrat-planar"],
              ["S","0 (diamagnit)"],["log β₄","≈30"],["Kinetik","Labil"],["Erituvchi","D₂O"],
            ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30"><div className="text-purple-400 text-xs mb-1">{r[0]}</div><div className="text-white font-bold text-sm">{r[1]}</div></div>))}
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab=>(<button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab===tab.id?"bg-green-600/40 text-white border border-green-400/50":"bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>))}
        </div>

        {activeTab==="13c"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">📈 ¹³C YaMR Spektri — [Ni(CN)₄]²⁻</h2><YaMRSpektrGrafik peaks={peaks13C} lineColor="#4ade80" xMin={200} xMax={0} xLabel="δ (ppm) — ¹³C YaMR (125 MHz, D₂O)"/></div>)}

        {activeTab==="jadval"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">📊 To'liq YaMR parametrlari</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">Qiymat</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["δ (¹³C CN⁻)","~135 ppm","Erkin CN⁻: ~165 ppm"],["Signal shakli","O'tkir singlet","D₄h — barcha CN⁻ ekvivalent"],["Δν½","~1−3 Hz","Diamagnit"],["T₁","~1−5 s","Uzoq relaksatsiya"],["¹J(¹³C−¹⁴N)","~15 Hz","¹⁴N kvadrupol — odatda ko'rinmaydi"],["Almashinuv","Tez (labil)","CN⁻ tez almashadi — o'rtacha signal"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="siljish"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">🔬 Kimyoviy siljish tahlili — δ≈135 ppm</h2><p className="text-purple-200 leading-relaxed">[Ni(CN)₄]²⁻ da ¹³C signali δ≈135 ppm. Erkin CN⁻ (δ≈165 ppm) dan <strong className="text-yellow-400">yuqori maydonga siljigan</strong> (−30 ppm).</p><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Birikma</th><th className="py-3 px-4">δ (¹³C)</th><th className="py-3 px-4">Δδ</th><th className="py-3 px-4">Sabab</th></tr></thead><tbody className="text-purple-200">{[["Erkin CN⁻","~165 ppm","0","—"],["[Ni(CN)₄]²⁻","~135 ppm","−30 ppm","Ni−C σ-bog': elektron zichlik C da ortgan"],["[Fe(CN)₆]⁴⁻","~177 ppm","+12 ppm","Fe²⁺ σ-donor — elektron zichlikni tortadi"],["[Fe(CN)₆]³⁻","~135 ppm (keng)","−30 ppm","Paramagnit siljish"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        {activeTab==="geometriya"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⬛ Kvadrat-planar vs Tetraedrik — YaMR farqi</h2><p className="text-purple-200 leading-relaxed">Ni²⁺ (d⁸) ikki geometriyada mavjud bo'la oladi. YaMR ularni farqlash imkonini beradi.</p><div className="grid grid-cols-2 gap-4"><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><h3 className="text-green-400 font-bold mb-3">[Ni(CN)₄]²⁻ (Kv-planar)</h3><p className="text-purple-200 text-sm">D₄h — diamagnit<br/>¹³C: o'tkir singlet<br/>δ≈135 ppm</p></div><div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><h3 className="text-red-400 font-bold mb-3">[NiCl₄]²⁻ (Tetraedrik)</h3><p className="text-purple-200 text-sm">T<sub>d</sub> — paramagnit<br/>¹³C: yo'q (Cl⁻)<br/>Signal: juda keng</p></div></div></div>)}

        {activeTab==="barqaror"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚡ Termodinamik barqaror, kinetik labil</h2><p className="text-purple-200 leading-relaxed">[Ni(CN)₄]²⁻ — <strong className="text-yellow-400">termodinamik va kinetik barqarorlik farqining klassik namunasi</strong>.</p><div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-green-400 font-bold mb-2">Termodinamik barqaror</h3><p className="text-purple-200 text-sm">log β₄≈30<br/>ΔG°≈−171 kJ/mol<br/>Parchalanishi qiyin</p></div><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">Kinetik labil</h3><p className="text-purple-200 text-sm">CN⁻ almashinuvi: tez<br/>d⁸ — past KMBE<br/>I<sub>d</sub> mexanizm</p></div></div><div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><p className="text-green-300 text-sm"><strong>YaMR da ko'rinishi:</strong> CN⁻ almashinuvi tez bo'lgani uchun erkin va koordinatsiyalangan CN⁻ uchun alohida signallar ko'rinmaydi — bitta o'rtacha signal kuzatiladi.</p></div></div>)}

        {activeTab==="taqqos"&&(<div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6"><h2 className="text-xl font-bold text-white">⚖️ Boshqa Ni²⁺ komplekslari YaMR</h2><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Geometriya</th><th className="py-3 px-4">¹³C δ</th><th className="py-3 px-4">Magnit</th></tr></thead><tbody className="text-purple-200">{[["[Ni(CN)₄]²⁻","Kvadrat-planar","~135 ppm","Diamagnit"],["[Ni(H₂O)₆]²⁺","Oktaedrik","— (H₂O)","Paramagnit"],["[Ni(NH₃)₆]²⁺","Oktaedrik","— (NH₃)","Paramagnit"],["[Ni(CO)₄]","Tetraedrik","~192 ppm (CO)","Diamagnit"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div></div>)}

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8"><h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2><ol className="space-y-2 text-purple-200 list-decimal list-inside"><li><strong className="text-yellow-400">¹³C: δ≈135 ppm — o'tkir singlet</strong></li><li><strong className="text-yellow-400">4 ta CN⁻ ekvivalent</strong> (D₄h simmetriya)</li><li><strong className="text-yellow-400">Erkin CN⁻ dan yuqori maydonga</strong> siljigan</li><li><strong className="text-yellow-400">Termodinamik barqaror</strong> (log β≈30), <strong>kinetik labil</strong></li></ol></div>

        <div className="flex justify-between pt-6"><Link href="/ilmiy/tahlil/nmr/birikmalar/ferrosen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ferrosen</Link><Link href="/ilmiy/tahlil/nmr/birikmalar/cu-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">[Cu(H₂O)₆]²⁺ →</Link></div>

      </section>
    </main>
  )
}