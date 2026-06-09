"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI ────────────────────────────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#a855f7" }) {
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

  const PAD={l:65,r:30,t:30,b:55}, W=820, H=340, plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
  const nmToX=(nm)=>PAD.l+((nm-200)/(800-200))*plotW
  const absToY=(abs)=>PAD.t+((0.06-abs)/0.06)*plotH
  function gauss(nm,nm0,h,w){return h*Math.exp(-Math.pow((nm-nm0)/w,2))}
  const peakDefs=[[575,0.022,28],[407,0.018,22],[265,0.048,20]]

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fillRect(nmToX(400),PAD.t,nmToX(800)-nmToX(400),plotH)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    ;[300,400,500,600,700].forEach(nm=>{const x=nmToX(nm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()})
    ;[0.01,0.02,0.03,0.04,0.05].forEach(a=>{const y=absToY(a); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#ff0"; ctx.lineWidth=1; ctx.setLineDash([5,5])
    ctx.beginPath(); ctx.moveTo(nmToX(400),PAD.t); ctx.lineTo(nmToX(400),PAD.t+plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(nmToX(800),PAD.t); ctx.lineTo(nmToX(800),PAD.t+plotH); ctx.stroke(); ctx.setLineDash([])
    const maxNm=200+(800-200)*animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.8; ctx.shadowBlur=6; ctx.shadowColor=lineColor
    let fp=true
    for(let nm=200;nm<=800;nm+=1){if(nm>maxNm&&animProgress<1)continue;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(nm,n0,h,w));const x=nmToX(nm),y=absToY(Math.min(0.025,a));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)}
    ctx.stroke(); ctx.shadowBlur=0
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let nm=800;nm>=200;nm-=1){if(nm>maxNm&&animProgress<1)continue;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(nm,n0,h,w));const x=nmToX(nm),y=absToY(Math.min(0.025,a));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();const g=ctx.createLinearGradient(0,PAD.t,0,PAD.t+plotH);g.addColorStop(0,`rgba(168,85,247,${0.15*Math.min(1,animProgress)})`);g.addColorStop(1,"rgba(168,85,247,0.01)");ctx.fillStyle=g;ctx.fill()}
    peaks.forEach(p=>{let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(p.nm,n0,h,w));const x=nmToX(p.nm),y=absToY(Math.min(0.025,a));const isH=hoveredPeak?.nm===p.nm,isS=selectedPeak?.nm===p.nm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,12*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);ctx.moveTo(x,y-2);ctx.lineTo(x,y-(isA?40:28));ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 11px monospace":"bold 9px monospace";ctx.textAlign="center";ctx.fillText(p.nm+" nm",x,y-(isA?40:28)-6)})
    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(p.nm,n0,h,w));const x=nmToX(p.nm),y=absToY(Math.min(0.025,a));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=170,th=42,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-58;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(`${p.nm} nm`,tx+tw/2,ty+16);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+30)}
    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke();ctx.beginPath();ctx.moveTo(PAD.l,PAD.t+plotH);ctx.lineTo(PAD.l+plotW,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center";[300,400,500,600,700].forEach(nm=>ctx.fillText(nm,nmToX(nm),PAD.t+plotH+18));ctx.textAlign="right";[0.01,0.02,0.03,0.04,0.05].forEach(a=>ctx.fillText(a.toFixed(2),PAD.l-8,absToY(a)+4))
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText("To'lqin uzunligi (nm)",PAD.l+plotW/2,H-8);ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Absorbans (A)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="center";ctx.fillText("Ko'rinadigan soha",nmToX(400)+(nmToX(800)-nmToX(400))/2,PAD.t-8)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])

  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,nm=200+((mx-PAD.l)/plotW)*(800-200);let cl=null,md=25;peaks.forEach(p=>{const d=Math.abs(p.nm-nm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.nm===hoveredPeak.nm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-purple-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-purple-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. d-d o'tishlar Laporte-taqiqlangan — ε juda kichik (~15−20).</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>{selectedPeak.nm} nm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function CrH2O6_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 575, label: "⁴A₂g → ⁴T₂g (ν₁)", color: "#f87171", desc: "ASOSIY d-d O'TISH. ε ≈ 20 L·mol⁻¹·cm⁻¹. ν₁ = Δo = 17,400 cm⁻¹. Sariq nurni yutadi — binafsha rangga sabab." },
    { nm: 407, label: "⁴A₂g → ⁴T₁g(F) (ν₂)", color: "#60a5fa", desc: "Ikkinchi d-d o'tish. ε ≈ 15. ν₂ = 24,600 cm⁻¹, ν₂/ν₁ = 1.414." },
    { nm: 265, label: "⁴A₂g → ⁴T₁g(P) (ν₃) + CT", color: "#a78bfa", desc: "Uchinchi spin-ruxsat o'tish + CT polosalar. UB sohada." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "deltao",    label: "🔢 Δo hisoblash" },
    { id: "tanabe",    label: "📉 Tanabe-Sugano" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "inert",     label: "🐢 Inertlik" },
    { id: "taqqos",    label: "⚖️ Boshqa Cr³⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🌈 [Cr(H₂O)₆]³⁺ — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvaxrom(III) ioni • d³ inert kompleks • Δo=17,400 cm⁻¹</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik O<sub>h</sub></span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d³</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (n=3)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">INERT (t½≈80 soat)</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Δo=17,400 cm⁻¹</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Cr(H₂O)₆]³⁺
            </h2>
            <span className="text-purple-400 text-lg">160.07 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaakvaxrom(III) ioni — <span className="text-purple-400 italic">d³ inert kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>ikkita d-d polosa</strong> kuzatiladi:
            <strong className="text-yellow-400"> ν₁ = 17,400 cm⁻¹ (575 nm)</strong> — ⁴A₂g → ⁴T₂g,
            <strong className="text-yellow-400"> ν₂ = 24,600 cm⁻¹ (407 nm)</strong> — ⁴A₂g → ⁴T₁g(F).
            Cr³⁺ (d³, t₂g³) — <strong>ν₁ = Δo</strong> (to'g'ridan-to'g'ri spektrdan!).
            KMBE = −1.2Δ<sub>o</sub> — yuqori barqarorlik, <strong>t<sub>½</sub> ≈ 80 soat</strong>.
            <strong className="text-yellow-400"> ν₂/ν₁ = 1.414</strong> — Tanabe-Sugano dan Δ<sub>o</sub>/B ≈ 24.7, B ≈ 704 cm⁻¹.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["λ<sub>max</sub> (ν₁)", "575 nm"], ["λ<sub>max</sub> (ν₂)", "407 nm"], ["Δo", "17,400 cm⁻¹"], ["Rang", "Binafsha"],
              ["ε (ν₁)", "~20"], ["ν₂/ν₁", "1.414"], ["B", "704 cm⁻¹"], ["β", "0.68"],
              ["KMBE", "−1.2Δ<sub>o</sub>"], ["μ<sub>eff</sub>", "3.87 μ<sub>B</sub>"], ["t<sub>½</sub>", "~80 soat"], ["Konfig", "t₂g³"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{ __html: r[0] }} />
                <div className="text-white font-bold">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> H₂O</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻² M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm</span>
            <span><strong className="text-purple-300">Harorat:</strong> 25°C</span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-purple-600/40 text-white border border-purple-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>
          ))}
        </div>

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [Cr(H₂O)₆]³⁺</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#a855f7" />
            <div className="flex flex-wrap gap-3">{peaks.map((p,i)=>(<div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs" style={{borderColor:p.color+"40",background:p.color+"10"}}><span className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="font-mono" style={{color:p.color}}>{p.nm} nm</span><span className="text-purple-400">{p.label}</span></div>))}</div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Polosalar jadvali</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">λ</th><th className="py-3 px-4">To'lqin soni</th><th className="py-3 px-4">O'tish</th><th className="py-3 px-4">ε</th><th className="py-3 px-4">Tavsif</th></tr></thead><tbody className="text-purple-200">{[["575","17,400 cm⁻¹","⁴A₂g→⁴T₂g (ν₁=Δo)","~20","Asosiy d-d o'tish. Binafsha rangga sabab."],["407","24,600 cm⁻¹","⁴A₂g→⁴T₁g(F) (ν₂)","~15","Ikkinchi d-d o'tish. ν₂/ν₁=1.414."],["265","37,740 cm⁻¹","⁴A₂g→⁴T₁g(P)+CT","~50","UB sohada."]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-sm text-purple-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 font-bold text-green-400">{r[3]}</td><td className="py-3 px-4 text-sm">{r[4]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── Δo HISOBLASH ── */}
        {activeTab === "deltao" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔢 Δo hisoblash — to'g'ridan-to'g'ri spektrdan</h2>
            <p className="text-purple-200 leading-relaxed">d³ konfiguratsiyada <strong className="text-yellow-400">ν₁ = Δo</strong>. Bu d¹, d³, d⁶(YS), d⁸, d⁹ uchun xos.</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center"><p className="text-yellow-400 font-bold text-xl">Δo = ν₁ = 17,400 cm⁻¹ (575 nm)</p></div>
            <div className="grid grid-cols-3 gap-4 text-center">{[["ν₁ = Δo","17,400 cm⁻¹","575 nm"],["ν₂","24,600 cm⁻¹","407 nm"],["ν₂/ν₁","1.414","—"]].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><div className="text-purple-400 text-sm mb-2">{r[0]}</div><div className="text-green-400 font-bold text-xl">{r[1]}</div><div className="text-purple-400 text-xs">{r[2]}</div></div>))}</div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><p className="text-purple-200 text-sm"><strong>B hisoblash:</strong> ν₂/ν₁=1.414 → Tanabe-Sugano → Δo/B≈24.7 → B=17,400/24.7=<strong>704 cm⁻¹</strong>. Erkin Cr³⁺: B=1030 cm⁻¹. β=704/1030=<strong>0.68</strong>.</p></div>
          </div>
        )}

        {/* ── TANABE-SUGANO ── */}
        {activeTab === "tanabe" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📉 Tanabe-Sugano diagrammasi</h2>
            <p className="text-purple-200 leading-relaxed">d³ konfiguratsiya uchun Tanabe-Sugano diagrammasi. Asosiy holat — ⁴A₂g.</p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><div className="space-y-2 text-sm font-mono"><div className="flex items-center gap-3"><span className="text-purple-400 w-24">↑ E/B</span><span className="text-blue-400">— ⁴T₁g(P) (ν₃, UB)</span></div><div className="flex items-center gap-3 ml-6"><span className="text-blue-400">— ⁴T₁g(F) (ν₂, 407 nm)</span></div><div className="flex items-center gap-3 ml-6"><span className="text-red-400">— ⁴T₂g (ν₁=Δo, 575 nm)</span></div><div className="flex items-center gap-3 ml-6"><span className="text-green-400 font-bold">— ⁴A₂g (ASOSIY HOLAT)</span></div></div></div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong>O'tishlar:</strong> Spin-ruxsat: ⁴A₂g→⁴T₂g, ⁴T₁g(F), ⁴T₁g(P). Spin-taqiq: ⁴A₂g→²E_g, ²T₁g, ²T₂g (juda kuchsiz, lazer xossalari!).</p></div>
          </div>
        )}

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Nega binafsha rang?</h2>
            <p className="text-purple-200 leading-relaxed">[Cr(H₂O)₆]³⁺ <strong className="text-yellow-400">sariq nurni yutadi</strong> (~575 nm, ν₁). Komplementar rang — <strong className="text-purple-400">binafsha</strong>. Ikkinchi o'tish (~407 nm) binafsha nurni yutadi — qolgan rang binafsha.</p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">[Cr(NH₃)₆]³⁺ bilan taqqoslash</h3><p className="text-purple-200 text-sm">NH₃ kuchliroq ligand — Δo kattaroq (21,550 cm⁻¹). ν₁=464 nm — ko'k nurni yutadi → <strong>sariq rang</strong>. Ligand o'zgarishi bilan rang o'zgaradi!</p></div>
          </div>
        )}

        {/* ── INERTLIK ── */}
        {activeTab === "inert" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🐢 Kinetik inertlik — UB-Vis bilan bog'liqlik</h2>
            <p className="text-purple-200 leading-relaxed">[Cr(H₂O)₆]³⁺ — <strong className="text-yellow-400">eng inert akva komplekslardan biri</strong>. t<sub>½</sub>≈80 soat. Sababi: KMBE=−1.2Δ<sub>o</sub>, almashinuv energiyasi.</p>
            <div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-red-400 font-bold mb-2">Nima uchun inert?</h3><p className="text-purple-200 text-sm">d³ (t₂g³) — yarim to'lgan t₂g. Almashinuv energiyasi qo'shimcha barqarorlik beradi. ΔKMBE=−0.6Δo.</p></div><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-green-400 font-bold mb-2">UB-Vis va inertlik</h3><p className="text-purple-200 text-sm">Δo=17,400 cm⁻¹ — yuqori. Kuchli bog' → sekin almashinuv. UB-Vis chastotasi inertlikni bashorat qiladi!</p></div></div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa Cr³⁺ komplekslari</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Kompleks</th><th className="py-3 px-4">Ligand</th><th className="py-3 px-4">ν₁ (Δo)</th><th className="py-3 px-4">Rang</th></tr></thead><tbody className="text-purple-200">{[["[Cr(H₂O)₆]³⁺","H₂O","17,400 cm⁻¹","Binafsha"],["[Cr(NH₃)₆]³⁺","NH₃","21,550 cm⁻¹","Sariq"],["[Cr(en)₃]³⁺","en","22,300 cm⁻¹","Sariq"],["[Cr(CN)₆]³⁻","CN⁻","26,700 cm⁻¹","Sariq"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4">{r[1]}</td><td className="py-3 px-4 font-mono text-green-400">{r[2]}</td><td className="py-3 px-4">{r[3]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν₁=Δo=17,400 cm⁻¹</strong> — d³ da to'g'ridan-to'g'ri spektrdan</li>
            <li><strong className="text-yellow-400">ν₂/ν₁=1.414</strong> → Δo/B≈24.7 → B=704 cm⁻¹, β=0.68</li>
            <li><strong className="text-yellow-400">Binafsha rang</strong> — sariq nur yutilishi hisobiga</li>
            <li><strong className="text-yellow-400">INERT:</strong> KMBE=−1.2Δo, t<sub>½</sub>≈80 soat</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [Fe(CO)₅]</Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ag-nh3-2" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">[Ag(NH₃)₂]⁺ →</Link>
        </div>

      </section>
    </main>
  )
}