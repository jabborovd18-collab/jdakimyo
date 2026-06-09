"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── YaMR SPEKTR GRAFIGI (Canvas + Animatsiya) ─────────────────────────────────
function YaMRSpektrGrafik({ peaks, lineColor = "#fbbf24", paramagnit = false }) {
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

  const PAD={l:70,r:40,t:35,b:55}, W=820, H=320
  const plotW=W-PAD.l-PAD.r, plotH=H-PAD.t-PAD.b
  const ppmToX=(ppm)=>PAD.l+((220-ppm)/(220-0))*plotW
  const intToY=(int)=>PAD.t+((100-int)/100)*plotH

  function lorentz(ppm, ppm0, height, width) {
    return height / (1 + Math.pow((ppm - ppm0) / width, 2))
  }

  const peakDefs = paramagnit 
    ? [[135, 85, 18]]
    : [[177, 95, 0.8]]

  function drawSpectrum(ctx,w,h){
    ctx.clearRect(0,0,w,h); ctx.fillStyle="#0f0a1a"; ctx.fillRect(0,0,w,h)
    
    // Grid
    ctx.strokeStyle="#2a1f3d"; ctx.lineWidth=0.5
    ;[200,180,160,140,120,100,80,60,40,20].forEach(ppm=>{const x=ppmToX(ppm); ctx.beginPath(); ctx.moveTo(x,PAD.t); ctx.lineTo(x,PAD.t+plotH); ctx.stroke()})
    ;[20,40,60,80].forEach(t=>{const y=intToY(t); ctx.beginPath(); ctx.moveTo(PAD.l,y); ctx.lineTo(PAD.l+plotW,y); ctx.stroke()})

    // Asosiy chiziq
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(PAD.l,intToY(0)); ctx.lineTo(PAD.l+plotW,intToY(0)); ctx.stroke()

    const maxPpm = 220 - (220-0) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle=lineColor; ctx.lineWidth=paramagnit ? 3 : 1.5
    ctx.shadowBlur=paramagnit ? 8 : 3; ctx.shadowColor=lineColor

    let fp=true
    for(let ppm=220; ppm>=0; ppm-=0.5) {
      if(ppm<maxPpm && animProgress<1) continue
      let signal=0
      peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w))
      const x=ppmToX(ppm), y=intToY(Math.min(98, signal))
      if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)
    }
    ctx.stroke(); ctx.shadowBlur=0

    // Fill
    if(animProgress>0.3){
      ctx.beginPath(); fp=true
      for(let ppm=0; ppm<=220; ppm+=0.5) {
        if(ppm>maxPpm && animProgress<1) continue
        let signal=0
        peakDefs.forEach(([p0,h,w])=>signal+=lorentz(ppm,p0,h,w))
        const x=ppmToX(ppm), y=intToY(Math.min(98, signal))
        if(fp){ctx.moveTo(x,y);fp=false}else ctx.lineTo(x,y)
      }
      ctx.closePath()
      const g=ctx.createLinearGradient(0,PAD.t,0,PAD.t+plotH)
      const col=lineColor.replace('#','')
      g.addColorStop(0,`rgba(${parseInt(col.slice(0,2),16)},${parseInt(col.slice(2,4),16)},${parseInt(col.slice(4,6),16)},0.15)`)
      g.addColorStop(1,`rgba(${parseInt(col.slice(0,2),16)},${parseInt(col.slice(2,4),16)},${parseInt(col.slice(4,6),16)},0.01)`)
      ctx.fillStyle=g; ctx.fill()
    }

    // Peak belgilari
    peaks.forEach(p=>{
      let signal=0; peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w))
      const x=ppmToX(p.ppm), y=intToY(Math.min(98, signal))
      const isH=hoveredPeak?.ppm===p.ppm, isS=selectedPeak?.ppm===p.ppm, isA=isH||isS

      if(isS){const ps=1+Math.sin(pulseRef.current)*0.15; ctx.beginPath(); ctx.arc(x,y,14*ps,0,Math.PI*2); ctx.fillStyle=p.color+"20"; ctx.fill()}

      ctx.beginPath(); ctx.strokeStyle=p.color; ctx.lineWidth=isA?2:0.8; ctx.setLineDash([3,2])
      const lh=isA?45:32; ctx.moveTo(x,y-2); ctx.lineTo(x,y-lh); ctx.stroke(); ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(x,y,isA?6:4,0,Math.PI*2); ctx.fillStyle=p.color; ctx.fill()
      if(isA){ctx.strokeStyle="#fff"; ctx.lineWidth=2; ctx.stroke()}

      ctx.fillStyle=p.color; ctx.font=isA?"bold 12px monospace":"bold 10px monospace"; ctx.textAlign="center"
      ctx.fillText("δ "+p.ppm, x, y-lh-6)
    })

    // Hover tooltip
    if(hoveredPeak&&!selectedPeak){
      const p=hoveredPeak; let signal=0; peakDefs.forEach(([p0,h,w])=>signal+=lorentz(p.ppm,p0,h,w))
      const x=ppmToX(p.ppm), y=intToY(Math.min(98, signal))
      ctx.fillStyle="#0f0a1a"; ctx.strokeStyle=p.color; ctx.lineWidth=1
      const tw=180, th=50, tx=Math.min(Math.max(x-tw/2,PAD.l+5),PAD.l+plotW-tw-5), ty=y-65
      ctx.beginPath(); ctx.roundRect(tx,ty,tw,th,8); ctx.fill(); ctx.stroke()
      ctx.fillStyle="#fff"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
      ctx.fillText(`δ ${p.ppm} ppm`, tx+tw/2, ty+18)
      ctx.fillStyle=p.color; ctx.font="9px sans-serif"
      ctx.fillText(p.label, tx+tw/2, ty+34)
    }

    // O'qlar
    ctx.strokeStyle="#3d2a5c"; ctx.lineWidth=1
    ctx.beginPath(); ctx.moveTo(PAD.l,PAD.t); ctx.lineTo(PAD.l,PAD.t+plotH); ctx.stroke()

    // X o'qi (ppm — YaMR standarti: o'ngdan chapga)
    ctx.fillStyle="#7c6a9e"; ctx.font="10px sans-serif"; ctx.textAlign="center"
    ;[200,180,160,140,120,100,80,60,40,20,0].forEach(ppm=>ctx.fillText(ppm,ppmToX(ppm),PAD.t+plotH+18))
    
    // O'q nomlari
    ctx.fillStyle="#9a8abf"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center"
    ctx.fillText("δ (ppm) — YaMR kimyoviy siljishi", PAD.l+plotW/2, H-8)
    ctx.save(); ctx.translate(16, PAD.t+plotH/2)
    ctx.rotate(-Math.PI/2); ctx.fillText("Intensivlik (%)", 0, 0); ctx.restore()

    // TMS belgisi
    ctx.fillStyle="#ff0"; ctx.font="9px sans-serif"; ctx.textAlign="right"
    ctx.fillText("TMS (δ=0)", ppmToX(0)-5, PAD.t-5)

    // Signal kengligi ko'rsatkichi
    if(!paramagnit){
      ctx.fillStyle="#fbbf24"; ctx.font="10px sans-serif"; ctx.textAlign="left"
      const lx=ppmToX(177)+50
      ctx.fillText("Δν½ ≈ 1−5 Hz", lx, PAD.t+30)
      ctx.fillText("(o'tkir singlet)", lx, PAD.t+46)
    }
  }

  useEffect(()=>{const c=canvasRef.current; if(!c)return; drawSpectrum(c.getContext("2d"),c.width,c.height)},[animProgress,hoveredPeak,selectedPeak,peaks])

  const hm=(e)=>{const c=canvasRef.current; if(!c)return; const r=c.getBoundingClientRect(),sx=820/r.width,mx=(e.clientX-r.left)*sx,ppm=220-((mx-PAD.l)/plotW)*(220-0); let cl=null,md=8; peaks.forEach(p=>{const d=Math.abs(p.ppm-ppm); if(d<md){md=d;cl=p}}); setHoveredPeak(cl)}

  return (<div className="relative"><canvas ref={canvasRef} width={W} height={H} onMouseMove={hm} onClick={()=>{if(hoveredPeak)setSelectedPeak(selectedPeak?.ppm===hoveredPeak.ppm?null:hoveredPeak)}} onMouseLeave={()=>setHoveredPeak(null)} className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />{animProgress<1&&(<div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50"><div className="flex items-center gap-2"><span className="text-xs text-purple-400">Chizilmoqda...</span><div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{width:`${animProgress*100}%`}}/></div><span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress*100)}%</span></div></div>)}<p className="text-center text-purple-500 text-xs mt-2 italic">Grafik sxematik. Haqiqiy spektrda signal kengligi magnit maydon kuchiga bog'liq.</p>{selectedPeak&&(<div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{borderColor:selectedPeak.color+"40"}}><div className="flex items-center gap-3"><span className="w-3 h-3 rounded-full" style={{background:selectedPeak.color}}/><span className="font-mono font-bold text-lg" style={{color:selectedPeak.color}}>δ {selectedPeak.ppm} ppm</span><span className="text-purple-400">—</span><span className="text-white font-semibold" dangerouslySetInnerHTML={{__html:selectedPeak.label}}/></div><p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p><button onClick={()=>setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button></div>)}</div>)
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K4FeCN6_YaMR() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { ppm: 177, label: "¹³C (CN⁻)", color: "#fbbf24", desc: "Barcha 6 ta CN⁻ ligandlari magnit jihatdan ekvivalent — bitta o'tkir singlet. Diamagnit Fe²⁺ (S=0) tufayli signal tor (~1−5 Hz)." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 ¹³C YaMR Spektri" },
    { id: "jadval",      label: "📊 Parametrlar jadvali" },
    { id: "diamagnit",   label: "💎 Diamagnit afzalligi" },
    { id: "siljish",     label: "🔬 Kimyoviy siljish tahlili" },
    { id: "relaksatsiya",label: "⏱️ Relaksatsiya vaqtlari" },
    { id: "ekvivalent",  label: "🔄 Ekvivalentlik" },
    { id: "taqqos",      label: "⚖️ Qizil qon tuzi bilan" },
    { id: "amaliy",      label: "💡 Amaliy ahamiyati" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/nmr/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← YaMR birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧲 K₄[Fe(CN)₆] — YaMR spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(II) • Sariq qon tuzi • ¹³C YaMR • Diamagnit</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">¹³C YaMR</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">O'tkir singlet</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">6 ta CN⁻ ekvivalent</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">δ = 177 ppm</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>K₄[Fe(CN)₆]</h2>
            <span className="text-purple-400 text-lg">368.35 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">kaliy geksasiyanoferrat(II) — <span className="text-yellow-400 italic">"Sariq qon tuzi"</span></p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">¹³C YaMR spektri</strong> — Fe²⁺ (d⁶, quyi spin, t₂g⁶ eg⁰) 
            <strong className="text-yellow-400"> diamagnit</strong> (S=0). Juftlanmagan elektronlar mavjud emas —
            paramagnit relaksatsiya effekti yo'q. <strong className="text-yellow-400">Signal o'tkir singlet</strong> 
            (Δν½ ≈ 1−5 Hz) δ = 177 ppm da. Barcha 6 ta CN⁻ guruhi <strong>magnit jihatdan ekvivalent</strong> —
            oktaedrik simmetriya (O<sub>h</sub>) tufayli faqat 1 ta signal kuzatiladi.
            Paramagnit K₃[Fe(CN)₆] bilan solishtirganda signal <strong>~100 marta torroq</strong> va 
            <strong> 42 ppm ga siljigan</strong> (177 vs 135 ppm). Bu farq Fe²⁺/Fe³⁺ oksidlanish darajasini 
            YaMR orqali ishonchli aniqlash imkonini beradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Yadro", "¹³C (I=½)"], ["δ (CN⁻)", "177 ppm"], ["Signal shakli", "O'tkir singlet"], ["Δν½", "~1−5 Hz"],
              ["Multipliklik", "Singlet (barcha CN⁻ ekvivalent)"], ["T₁", "~1−10 s"], ["T₂", "~0.5−5 s"], ["S", "0 (diamagnit)"],
              ["Chastota", "125.7 MHz (500 MHz ¹H)"], ["Erituvchi", "D₂O"], ["Standart", "TMS (δ=0)"], ["Harorat", "25°C"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <div className="text-purple-400 text-xs mb-1" dangerouslySetInnerHTML={{ __html: r[0] }} />
                <div className="text-white font-bold text-sm">{r[1]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> D₂O (deyteriylangan suv)</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~50 mg/mL</span>
            <span><strong className="text-purple-300">Chastota:</strong> 125.7 MHz (¹³C, 500 MHz ¹H da)</span>
            <span><strong className="text-purple-300">Impulslar soni:</strong> ~1000−5000 (yaxshi S/N uchun)</span>
            <span><strong className="text-purple-300">Relaksatsiya kechikishi:</strong> D₁ = 5−10 s (T₁ uzunligi uchun)</span>
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
            <h2 className="text-xl font-bold text-white">📈 ¹³C YaMR Spektri — K₄[Fe(CN)₆]</h2>
            <YaMRSpektrGrafik peaks={peaks} lineColor="#fbbf24" paramagnit={false} />
            <div className="flex flex-wrap gap-3">
              {peaks.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs" style={{ borderColor: p.color + "40", background: p.color + "10" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="font-mono" style={{ color: p.color }}>δ {p.ppm} ppm</span>
                  <span className="text-purple-400">{p.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm"><strong className="text-yellow-400">Eng muhim xususiyat:</strong> Bitta o'tkir singlet (δ=177 ppm). Barcha 6 ta CN⁻ ekvivalent. Signal ~100 marta torroq paramagnit K₃[Fe(CN)₆] ga nisbatan.</p>
            </div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 To'liq parametrlar jadvali</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">Qiymat</th><th className="py-3 px-4">Izoh</th></tr></thead><tbody className="text-purple-200">{[["δ (¹³C CN⁻)","177 ppm","Erkin CN⁻: ~165 ppm. Koordinatsiyalanganda past maydonga siljigan"],["Signal kengligi (Δν½)","~1−5 Hz","Diamagnit — tabiiy kenglik. Paramagnitda ~200−500 Hz"],["Multipliklik","Singlet","6 ta CN⁻ magnit jihatdan ekvivalent (O<sub>h</sub>)"],["T₁ (spin-panjara)","~1−10 s","Uzoq — to'liq relaksatsiya uchun D₁=10−30 s kerak"],["T₂ (spin-spin)","~0.5−5 s","Signal kengligi bilan bog'liq: Δν½=1/(πT₂)"],["NOE (¹H→¹³C)","~2.9 (maksimal)","¹H dekuplingi signal/sezgirlikni oshiradi"],["¹J(¹³C−¹⁴N)","~15 Hz","¹⁴N kvadrupol (I=1) — odatda ko'rinmaydi"],["Signal/Shovqin","Yuqori","Diamagnit — tor signal, yaxshi S/N"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── DIAMAGNIT ── */}
        {activeTab === "diamagnit" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💎 Diamagnit komplekslarning YaMR afzalligi</h2>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">1. Tor signallar — yuqori aniqlik</h3><p className="text-purple-200 text-sm">Diamagnit komplekslarda paramagnit kengayish yo'q — signallar tor (Δν½ ≈ 1−5 Hz). Bu kimyoviy siljishni 0.01 ppm aniqlikda o'lchash imkonini beradi. Kichik siljish farqlari ham ko'rinadi.</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">2. Yaxshi signal/Shovqin nisbati</h3><p className="text-purple-200 text-sm">Tor signal — intensivlik yuqori. Kamroq impulslar yig'ish kerak (1000−5000 vs paramagnitda 50000+). Vaqt tejaladi, spektr sifati yuqori.</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">3. Aniq integral va multipletlik</h3><p className="text-purple-200 text-sm">Signal tor va simmetrik — integral aniq hisoblanadi. Spin-spin bog'lanish (J) aniq o'lchanadi. Tuzilishni aniqlash uchun ideal.</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">4. 2D YaMR imkoniyatlari</h3><p className="text-purple-200 text-sm">Diamagnit komplekslar COSY, HSQC, HMBC kabi 2D YaMR usullari uchun mos. Relaksatsiya vaqtlari yetarlicha uzun — korrelyatsiya signallari yaxshi ko'rinadi.</p></div>
            </div>
          </div>
        )}

        {/* ── KIMYOVIY SILJISH TAHLILI ── */}
        {activeTab === "siljish" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔬 Kimyoviy siljish (δ = 177 ppm) tahlili</h2>
            <p className="text-purple-200 leading-relaxed">K₄[Fe(CN)₆] da ¹³C signali <strong className="text-yellow-400">δ = 177 ppm</strong> da kuzatiladi. Erkin CN⁻ da δ ≈ 165 ppm. Koordinatsiyalanganda <strong>past maydonga siljigan</strong> (+12 ppm).</p>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Birikma</th><th className="py-3 px-4">δ (¹³C)</th><th className="py-3 px-4">Farq</th><th className="py-3 px-4">Sabab</th></tr></thead><tbody className="text-purple-200">{[["Erkin CN⁻ (suvda)","~165 ppm","0 (etalon)","—"],["K₄[Fe(CN)₆]","177 ppm","+12 ppm","Fe²⁺ σ-donor — elektron zichlikni tortadi"],["K₃[Fe(CN)₆]","~135 ppm","−30 ppm","Paramagnit siljish + Fe³⁺ kuchliroq tortadi"],["HCN","~110 ppm","−55 ppm","Protonlangan — elektron zichlik kamaygan"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 font-mono text-green-400">{r[1]}</td><td className="py-3 px-4">{r[2]}</td><td className="py-3 px-4 text-sm">{r[3]}</td></tr>))}</tbody></table></div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5"><p className="text-purple-200 text-sm"><strong>Siljish sababi:</strong> Fe²⁺ CN⁻ dan elektron zichlikni tortadi (σ-donorlik). Uglerod atrofidagi elektron zichlik kamayadi — yadro kuchsizroq ekranlanadi — signal past maydonga siljiydi (δ ortadi).</p></div>
          </div>
        )}

        {/* ── RELAKSATSIYA ── */}
        {activeTab === "relaksatsiya" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⏱️ Relaksatsiya vaqtlari — T₁ va T₂</h2>
            <p className="text-purple-200 leading-relaxed">Diamagnit komplekslarda relaksatsiya vaqtlari <strong className="text-yellow-400">uzun</strong>. Bu sifatli spektr olish uchun muhim.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">T₁ — Spin-panjara relaksatsiyasi</h3><p className="text-purple-200 text-sm"><strong>Qiymat:</strong> ~1−10 s<br/><strong>Mexanizm:</strong> Dipol-dipol (¹³C−¹H), kimyoviy siljish anizotropiyasi<br/><strong>Ta'siri:</strong> Impulslar orasidagi kechikish D₁ ≥ 5×T₁ bo'lishi kerak (~10−50 s!)<br/><strong>NOE:</strong> ¹H dekuplingi T₁ ni qisqartiradi va signalni kuchaytiradi</p></div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">T₂ — Spin-spin relaksatsiyasi</h3><p className="text-purple-200 text-sm"><strong>Qiymat:</strong> ~0.5−5 s<br/><strong>Bog'liqlik:</strong> Δν½ = 1/(πT₂)<br/><strong>Hisoblash:</strong> T₂=1 s → Δν½≈0.3 Hz; T₂=0.1 s → Δν½≈3 Hz<br/><strong>Kengayish sabablari:</strong> Magnit maydon bir jinsli emasligi, harorat gradienti</p></div>
            </div>
          </div>
        )}

        {/* ── EKVIVALENTLIK ── */}
        {activeTab === "ekvivalent" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 6 ta CN⁻ — magnit ekvivalentlik</h2>
            <p className="text-purple-200 leading-relaxed">K₄[Fe(CN)₆] oktaedrik simmetriyaga ega (O<sub>h</sub>). <strong className="text-yellow-400">Barcha 6 ta CN⁻ guruhi magnit jihatdan ekvivalent</strong> — ularning kimyoviy muhiti bir xil. Shuning uchun ¹³C YaMR da faqat <strong>bitta singlet</strong> kuzatiladi.</p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30"><h3 className="text-yellow-400 font-bold mb-2">Ekvivalentlik sabablari:</h3><ul className="text-purple-200 text-sm space-y-1"><li>• <strong>O<sub>h</sub> simmetriya</strong> — barcha 6 ta ligand bir xil pozitsiyada</li><li>• <strong>Bir xil bog' uzunligi:</strong> Fe−C = 1.91 Å (barchasi teng)</li><li>• <strong>Tez ligand almashinuvi yo'q:</strong> [Fe(CN)₆]⁴⁻ inert (d⁶ QS)</li><li>• <strong>Harorat ta'siri:</strong> past haroratda ham ekvivalentlik saqlanadi</li></ul></div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5"><p className="text-blue-300 text-sm"><strong>Qachon ekvivalentlik buziladi?</strong> Agar bitta CN⁻ boshqa ligandga almashsa (masalan, [Fe(CN)₅(H₂O)]³⁻) — simmetriya pasayadi, bir nechta signal paydo bo'ladi.</p></div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Sariq vs Qizil qon tuzi — to'liq YaMR taqqoslash</h2>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="border-b border-purple-700"><th className="py-3 px-4">Parametr</th><th className="py-3 px-4">K₄[Fe(CN)₆] (Sariq)</th><th className="py-3 px-4">K₃[Fe(CN)₆] (Qizil)</th></tr></thead><tbody className="text-purple-200">{[["Metall","Fe²⁺ (d⁶, QS)","Fe³⁺ (d⁵, QS)"],["Magnit","Diamagnit (S=0)","Paramagnit (S=½)"],["¹³C signal","O'tkir singlet (~1−5 Hz)","Keng (~200−500 Hz)"],["δ (¹³C)","177 ppm","~135 ppm"],["T₁","~1−10 s","~0.01−0.1 s"],["Signal/Shovqin","Yuqori","Past"],["Impulslar soni","~1000−5000","~50000+ (keng signal)"],["D₁ kechikishi","10−30 s","~0.5−2 s (qisqa T₁)"],["2D YaMR","Mos","Qiyin (keng signallar)"],["Integral","Aniq","Noaniq (keng signal)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td><td className="py-3 px-4 text-yellow-300">{r[1]}</td><td className="py-3 px-4 text-red-300">{r[2]}</td></tr>))}</tbody></table></div>
          </div>
        )}

        {/* ── AMALIY ── */}
        {activeTab === "amaliy" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💡 Amaliy ahamiyati</h2>
            <div className="space-y-3">
              {["Oksidlanish darajasini aniqlash: Fe²⁺ (o'tkir, δ=177) vs Fe³⁺ (keng, δ≈135) — YaMR orqali ishonchli farqlash",
                "Sintez nazorati: K₄[Fe(CN)₆] dan K₃[Fe(CN)₆] oksidlanganda signal kengayadi va siljiydi",
                "Miqdoriy tahlil: o'tkir signal integrali orqali konsentratsiyani aniq hisoblash mumkin",
                "Qo'shimcha usul: UB-Vis (LMCT/MLCT) va IQ (ν(C≡N)) bilan birgalikda to'liq tahlil",
                "Farmatsevtika: K₄[Fe(CN)₆] E536 oziq-ovqat qo'shimchasi sifatida — YaMR tozalikni tekshirishda"
              ].map((r,i)=>(<div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3"><span className="text-yellow-400 font-bold">{i+1}.</span><p className="text-purple-200 text-sm">{r}</p></div>))}
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">δ = 177 ppm — o'tkir singlet</strong> (Δν½≈1−5 Hz)</li>
            <li><strong className="text-yellow-400">Diamagnit Fe²⁺ (S=0)</strong> — paramagnit kengayish yo'q</li>
            <li><strong className="text-yellow-400">6 ta CN⁻ magnit ekvivalent</strong> — O<sub>h</sub> simmetriya</li>
            <li><strong className="text-yellow-400">Erkin CN⁻ dan +12 ppm</strong> siljigan — σ-donorlik ta'siri</li>
            <li><strong className="text-yellow-400">Qizil qon tuzidan ~100 marta torroq</strong> signal</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← K₃[Fe(CN)₆]</Link>
          <Link href="/ilmiy/tahlil/nmr/birikmalar/co-nh3-6-cl3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">[Co(NH₃)₆]Cl₃ →</Link>
        </div>

      </section>
    </main>
  )
}