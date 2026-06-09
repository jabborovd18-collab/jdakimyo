"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI ────────────────────────────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#fbbf24" }) {
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
  const absToY=(abs)=>PAD.t+((1.0-abs)/1.0)*plotH
  function gauss(nm,nm0,h,w){return h*Math.exp(-Math.pow((nm-nm0)/w,2))}
  const peakDefs=[[280,0.68,28],[240,0.50,22],[215,0.72,18]]

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    ctx.fillStyle="rgba(255,255,255,0.03)"; ctx.fillRect(nmToX(400),PAD.t,nmToX(800)-nmToX(400),plotH)
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    ;[300,400,500,600,700].forEach(nm=>{const x=nmToX(nm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()})
    ;[0.2,0.4,0.6].forEach(a=>{const y=absToY(a); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})
    ctx.strokeStyle="#ff0"; ctx.lineWidth=1; ctx.setLineDash([5,5])
    ctx.beginPath(); ctx.moveTo(nmToX(400),PAD.t); ctx.lineTo(nmToX(400),PAD.t+plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(nmToX(800),PAD.t); ctx.lineTo(nmToX(800),PAD.t+plotH); ctx.stroke(); ctx.setLineDash([])
    const maxNm=200+(800-200)*animProgress
    ctx.beginPath(); ctx.strokeStyle=lineColor; ctx.lineWidth=1.8; ctx.shadowBlur=6; ctx.shadowColor=lineColor
    let fp=true
    for(let nm=200;nm<=800;nm+=1){if(nm>maxNm&&animProgress<1)continue;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(nm,n0,h,w));const x=nmToX(nm),y=absToY(Math.min(0.75,a));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)}
    ctx.stroke(); ctx.shadowBlur=0
    if(animProgress>0.3){ctx.beginPath();fp=true;for(let nm=800;nm>=200;nm-=1){if(nm>maxNm&&animProgress<1)continue;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(nm,n0,h,w));const x=nmToX(nm),y=absToY(Math.min(0.75,a));if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)};ctx.closePath();const g=ctx.createLinearGradient(0,PAD.t,0,PAD.t+plotH);g.addColorStop(0,`rgba(251,191,36,${0.15*Math.min(1,animProgress)})`);g.addColorStop(1,"rgba(251,191,36,0.01)");ctx.fillStyle=g;ctx.fill()}
    peaks.forEach(p=>{let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(p.nm,n0,h,w));const x=nmToX(p.nm),y=absToY(Math.min(0.75,a));const isH=hoveredPeak?.nm===p.nm,isS=selectedPeak?.nm===p.nm,isA=isH||isS;if(isS){const ps=1+Math.sin(pulseRef.current)*0.15;ctx.beginPath();ctx.arc(x,y,12*ps,0,Math.PI*2);ctx.fillStyle=p.color+"20";ctx.fill()};ctx.beginPath();ctx.strokeStyle=p.color;ctx.lineWidth=isA?2:0.8;ctx.setLineDash([3,2]);ctx.moveTo(x,y-2);ctx.lineTo(x,y-(isA?40:28));ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,isA?6:4,0,Math.PI*2);ctx.fillStyle=p.color;ctx.fill();if(isA){ctx.strokeStyle="#fff";ctx.lineWidth=2;ctx.stroke()};ctx.fillStyle=p.color;ctx.font=isA?"bold 11px monospace":"bold 9px monospace";ctx.textAlign="center";ctx.fillText(p.nm+" nm",x,y-(isA?40:28)-6)})
    if(hoveredPeak&&!selectedPeak){const p=hoveredPeak;let a=0;peakDefs.forEach(([n0,h,w])=>a+=gauss(p.nm,n0,h,w));const x=nmToX(p.nm),y=absToY(Math.min(0.75,a));ctx.fillStyle="#0f0a1a";ctx.strokeStyle=p.color;ctx.lineWidth=1;const tw=170,th=42,tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5),ty=y-58;ctx.beginPath();ctx.roundRect(tx,ty,tw,th,8);ctx.fill();ctx.stroke();ctx.fillStyle="#fff";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText(`${p.nm} nm`,tx+tw/2,ty+16);ctx.fillStyle=p.color;ctx.font="9px sans-serif";ctx.fillText(p.label,tx+tw/2,ty+30)}
    ctx.strokeStyle="#3d2a5c";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(PAD.l,PAD.t);ctx.lineTo(PAD.l,PAD.t+plotH);ctx.stroke();ctx.beginPath();ctx.moveTo(PAD.l,PAD.t+plotH);ctx.lineTo(PAD.l+plotW,PAD.t+plotH);ctx.stroke()
    ctx.fillStyle="#7c6a9e";ctx.font="10px sans-serif";ctx.textAlign="center";[300,400,500,600,700].forEach(nm=>ctx.fillText(nm,nmToX(nm),PAD.t+plotH+18));ctx.textAlign="right";[0.2,0.4,0.6].forEach(a=>ctx.fillText(a.toFixed(1),PAD.l-8,absToY(a)+4))
    ctx.fillStyle="#9a8abf";ctx.font="bold 12px sans-serif";ctx.textAlign="center";ctx.fillText("To'lqin uzunligi (nm)",PAD.l+plotW/2,H-8);ctx.save();ctx.translate(16,PAD.t+plotH/2);ctx.rotate(-Math.PI/2);ctx.fillText("Absorbans (A)",0,0);ctx.restore()
    ctx.fillStyle="#ff0";ctx.font="9px sans-serif";ctx.textAlign="center";ctx.fillText("Ko'rinadigan soha",nmToX(400)+(nmToX(800)-nmToX(400))/2,PAD.t-8)
  }

  useEffect(()=>{const c=canvasRef.current;if(!c)return;drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])

  const hm=(e)=>{const c=canvasRef.current;if(!c)return;const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,nm=200+((mx-PAD.l)/plotW)*(800-200);let cl=null,md=25;peaks.forEach(p=>{const d=Math.abs(p.nm-nm);if(d<md){md=d;cl=p}});setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.nm===hoveredPeak.nm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. Asosiy yutilish UB sohada. Ko'rinadigan sohada yutilish deyarli yo'q — och sariq rang.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>{selectedPeak.nm} nm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function FeCO5_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 280, label: "MLCT (Fe→CO π*)", color: "#fbbf24", desc: "ASOSIY MLCT O'TISH. Fe⁰ d-orbitallaridan CO π* orbitallariga zaryad ko'chishi. ε ≈ 2000 L·mol⁻¹·cm⁻¹. Laporte+Spin RUXSAT. UB sohada — ko'rinadigan rangga ta'sir qilmaydi." },
    { nm: 240, label: "σ→σ* (CO ichki)", color: "#60a5fa", desc: "CO ligandining ichki σ→σ* o'tishi. UB sohada." },
    { nm: 215, label: "Chuqur UB — CT/ligand", color: "#a78bfa", desc: "Chuqur UB soha — charge-transfer va ligand ichidagi o'tishlar. Aniq tayinlash manbaga bog'liq." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "electron18",label: "⚡ 18-elektron qoidasi" },
    { id: "piback",    label: "🔄 π-Back-donatsiya" },
    { id: "berry",     label: "🔄 Berry psevdorotatsiyasi" },
    { id: "xavfsizlik",label: "⚠️ Xavfsizlik" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🌈 [Fe(CO)₅] — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">pentakarboniltemir(0) • Trigonal-bipiramidal • MLCT dominant • 18-elektron</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Trigonal bipiramida (D<sub>3h</sub>)</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">18 e⁻</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">MLCT dominant</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Berry psevdorotatsiyasi</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Fe(CO)₅]
            </h2>
            <span className="text-purple-400 text-lg">195.90 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            pentakarboniltemir(0) — <span className="text-yellow-400 italic">suyuq metall karbonil</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da asosiy yutilish <strong>UB sohada (~280 nm)</strong>.
            Bu <strong className="text-yellow-400">MLCT (Fe→CO π*)</strong> o'tish — Fe⁰ d-orbitallaridan CO π* orbitallariga.
            <strong className="text-yellow-400"> ε ≈ 2000</strong> — Laporte va spin ruxsat etilgan.
            Fe⁰ (d⁸) + 5CO (10e⁻) = <strong>18 valent elektron</strong> — maksimal barqarorlik.
            Ko'rinadigan sohada yutilish deyarli yo'q — <strong>och sariq rang</strong>.
            <strong className="text-yellow-400"> Berry psevdorotatsiyasi</strong> — aksial va ekvatorial CO almashinuvi.
            <strong className="text-red-400"> ⚠️ Juda zaharli!</strong> Uchuvchan, CO ajratadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["λ<sub>max</sub>", "280 nm"], ["ε", "~2000"], ["O'tish", "MLCT"], ["Rang", "Sariq suyuqlik"],
              ["Valent e⁻", "18 ta"], ["Geometriya", "Trigonal bipiramida"], ["Fe−C(aks)", "1.81 Å"], ["Fe−C(ekv)", "1.83 Å"],
              ["Holati", "Suyuq (25°C)"], ["Qaynash T", "103°C"], ["Suyuqlanish T", "−20°C"], ["Zichlik", "1.45 g/cm³"],
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
            <span><strong className="text-purple-300">Erituvchi:</strong> Geksan (inert)</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻⁴ M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm kvars, germetik</span>
            <span><strong className="text-purple-300">Eslatma:</strong> Yorug'likdan himoya qilingan, havosiz muhit</span>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-yellow-600/40 text-white border border-yellow-400/50" : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"}`}>{tab.label}</button>
          ))}
        </div>

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [Fe(CO)₅]</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#fbbf24" />
            <div className="flex flex-wrap gap-3">
              {peaks.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs" style={{ borderColor: p.color + "40", background: p.color + "10" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="font-mono" style={{ color: p.color }}>{p.nm} nm</span>
                  <span className="text-purple-400">{p.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm"><strong className="text-yellow-400">Eng muhim xususiyat:</strong> MLCT 280 nm — UB sohada. Ko'rinadigan sohada yutilish deyarli yo'q. Och sariq rang.</p>
            </div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Polosalar jadvali</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">To'lqin soni</th><th className="py-3 px-4 text-purple-300">O'tish</th><th className="py-3 px-4 text-purple-300">ε</th><th className="py-3 px-4 text-purple-300">Tavsif</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["280","35,710 cm⁻¹","MLCT (Fe→CO π*)","~2000","Asosiy polosa. UB sohada. Laporte+Spin RUXSAT."],["240","41,670 cm⁻¹","σ→σ* (CO ichki)","~800","CO ligand ichidagi o'tish."],["215","46,510 cm⁻¹","Chuqur UB — CT/ligand","~1200","Aniq tayinlash manbaga bog'liq."]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-sm text-purple-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 font-bold text-green-400">{r[3]}</td><td className="py-3 px-4 text-sm">{r[4]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 18-ELEKTRON ── */}
        {activeTab === "electron18" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ 18-elektron qoidasi — maksimal barqarorlik</h2>
            <p className="text-purple-200 leading-relaxed">[Fe(CO)₅] — <strong className="text-yellow-400">18-elektron qoidasining klassik namunasi</strong>. Fe⁰ — 8 ta valent elektron (3d⁸4s²). 5 ta CO — har biri 2 ta elektron beradi = 10 ta. <strong>Jami: 18 ta!</strong></p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center"><p className="text-yellow-400 font-bold text-2xl">Fe⁰ (d⁸) + 5×CO (2e⁻) = 18 valent elektron</p><p className="text-purple-300 text-sm mt-2">Barcha bog'lovchi MO lar to'lgan, antibog'lovchilar bo'sh — maksimal barqarorlik</p></div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5"><p className="text-green-300 text-sm"><strong>UB-Vis bilan bog'liqlik:</strong> 18-elektron konfiguratsiya tufayli spektrda aniq, o'tkir polosalar. Barqarorlik yuqori.</p></div>
          </div>
        )}

        {/* ── π-BACK ── */}
        {activeTab === "piback" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 π-Back-donatsiya — MLCT asosi</h2>
            <p className="text-purple-200 leading-relaxed">CO — <strong className="text-yellow-400">kuchli π-akseptor</strong>. Fe⁰ boy elektron konfiguratsiya (d⁸) — CO ning bo'sh π* orbitallariga kuchli elektron qaytadi. Bu <strong>MLCT o'tish</strong> (~280 nm) ning asosiy sababi.</p>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Birikma</th><th className="py-3 px-4 text-purple-300">ν(C≡O) IQ</th><th className="py-3 px-4 text-purple-300">λ MLCT</th><th className="py-3 px-4 text-purple-300">π-back</th></tr></thead><tbody className="text-purple-200">{[["Erkin CO","2143 cm⁻¹","—","Yo'q"],["[Fe(CO)₅]","2025, 1995 cm⁻¹","~280 nm","JUDA KUCHLI"],["[Ni(CO)₄]","2057 cm⁻¹","~270 nm","Kuchli"],["[Cr(CO)₆]","2000 cm⁻¹","~290 nm","JUDA KUCHLI"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono">{r[1]}</td><td className="py-3 px-4 text-green-400">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── BERRY ── */}
        {activeTab === "berry" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Berry psevdorotatsiyasi — UB-Vis ga ta'siri</h2>
            <p className="text-purple-200 leading-relaxed">[Fe(CO)₅] — <strong className="text-yellow-400">Berry psevdorotatsiyasi kuzatiladigan klassik molekula</strong>. Aksial va ekvatorial CO ligandlari <strong>juda tez</strong> o'rin almashadi (k≈10⁵−10⁷ s⁻¹).</p>
            <div className="grid grid-cols-2 gap-4"><div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">Xona haroratida (298 K)</h3><p className="text-purple-200 text-sm">Berry psevdorotatsiyasi: tez<br/>¹³C YaMR: 1 ta signal<br/>UB-Vis: o'rtacha polosalar</p></div><div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><h3 className="text-blue-400 font-bold mb-2">Past haroratda (−100°C)</h3><p className="text-purple-200 text-sm">Berry psevdorotatsiyasi: sekin<br/>¹³C YaMR: 2 ta signal<br/>UB-Vis: aniq polosalar</p></div></div>
          </div>
        )}

        {/* ── XAVFSIZLIK ── */}
        {activeTab === "xavfsizlik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚠️ Xavfsizlik</h2>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5"><p className="text-red-300 text-sm"><strong>⚠️ JUDA ZAHARLI!</strong> [Fe(CO)₅] — uchuvchan suyuqlik. Bug'lari nafas yo'llariga zarar yetkazadi. Organizmda CO ajratib, karboksigemoglobin hosil qiladi. LD₅₀≈40 mg/kg. Havoda ruxsat etilgan konsentratsiyasi: 0.1 ppm.</p></div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">Xavfsizlik qoidalari:</h3><ul className="text-purple-200 text-sm space-y-1"><li>• Faqat tortish shkafida ishlash</li><li>• Qorong'i idishda, germetik saqlash</li><li>• Yorug'lik ta'sirida CO ajratadi</li><li>• Shaxsiy himoya vositalari majburiy</li></ul></div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">MLCT dominant:</strong> Fe⁰→CO π*, λ≈280 nm, ε≈2000</li>
            <li><strong className="text-yellow-400">18-elektron qoidasi</strong> — Fe⁰(d⁸)+5CO(10e⁻)=18e⁻</li>
            <li><strong className="text-yellow-400">UB sohada yutilish</strong> — och sariq rang</li>
            <li><strong className="text-yellow-400">Berry psevdorotatsiyasi</strong> — aksial/ekvatorial almashinuv</li>
            <li><strong className="text-red-400">⚠️ Juda zaharli!</strong> — uchuvchan, CO ajratadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-cl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← [CoCl₄]²⁻</Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cr-h2o6" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">[Cr(H₂O)₆]³⁺ →</Link>
        </div>

      </section>
    </main>
  )
}