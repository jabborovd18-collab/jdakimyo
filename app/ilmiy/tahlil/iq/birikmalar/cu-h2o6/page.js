"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── IQ SPEKTR GRAFIGI (Canvas + Animatsiya) ────────────────────────────────────
function IQSpektrGrafik({ peaks, lineColor = "#4ade80" }) {
  const canvasRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef(null)
  const pulseRef = useRef(0)

  useEffect(() => {
    let start = null
    const duration = 2000
    function animate(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      setAnimProgress(progress)
      if (progress < 1) animRef.current = requestAnimationFrame(animate)
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      pulseRef.current = (pulseRef.current + 0.05) % (Math.PI * 2)
      if (selectedPeak) {
        const canvas = canvasRef.current
        if (canvas) drawSpectrum(canvas.getContext("2d"), canvas.width, canvas.height)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [selectedPeak, peaks])

  const PAD = { l: 60, r: 30, t: 30, b: 50 }
  const W = 820, H = 320
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const wnToX = (wn) => PAD.l + ((2300 - wn) / (2300 - 400)) * plotW
  const tToY  = (t)  => PAD.t + ((100 - t) / 100) * plotH

  function lorentz(wn, wn0, depth, width) {
    return depth / (1 + ((wn - wn0) / width) ** 2)
  }

  const peakDefs = [
    [3400, 90, 60], [3250, 85, 50], [1640, 65, 25],
    [800, 55, 20], [490, 35, 12], [440, 40, 12],
    [380, 48, 14], [310, 45, 13]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#2a1f3d"
    ctx.lineWidth = 0.5
    ;[2000,1800,1600,1400,1200,1000,800,600,400].forEach(wn => {
      const x = wnToX(wn)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    })
    ;[20,40,60,80].forEach(t => {
      const y = tToY(t)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    const maxWn = 400 + (2300 - 400) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 1.8
    ctx.shadowBlur = 6
    ctx.shadowColor = lineColor

    let firstPoint = true
    for (let wn = 2300; wn >= 400; wn -= 2) {
      if (wn > maxWn && animProgress < 1) continue
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(wn), y = tToY(T)
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath()
      firstPoint = true
      for (let wn = 2300; wn >= 400; wn -= 2) {
        if (wn > maxWn && animProgress < 1) continue
        let absorb = 0
        peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(wn, wn0, d, w))
        const T = Math.max(2, 98 - absorb)
        const x = wnToX(wn), y = tToY(T)
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(96,165,250,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(96,165,250,0.01)")
      ctx.fillStyle = grad
      ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(p.wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(p.wn), y = tToY(T)
      
      const isHovered = hoveredPeak?.wn === p.wn
      const isSelected = selectedPeak?.wn === p.wn
      const isActive = isHovered || isSelected

      if (isSelected) {
        const pulseSize = 1 + Math.sin(pulseRef.current) * 0.15
        ctx.beginPath(); ctx.arc(x, y, 12 * pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = p.color + "20"; ctx.fill()
      }

      ctx.beginPath(); ctx.strokeStyle = p.color
      ctx.lineWidth = isActive ? 2 : 0.8; ctx.setLineDash([3, 2])
      const lineHeight = isActive ? 40 : 28
      ctx.moveTo(x, y - 2); ctx.lineTo(x, y - lineHeight); ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath(); ctx.arc(x, y, isActive ? 6 : 4, 0, Math.PI * 2)
      ctx.fillStyle = p.color; ctx.fill()
      if (isActive) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke() }

      ctx.fillStyle = p.color
      ctx.font = isActive ? "bold 11px monospace" : "bold 9px monospace"
      ctx.textAlign = "center"
      ctx.fillText(p.wn, x, y - lineHeight - 6)
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(p.wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(p.wn), y = tToY(T)
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = p.color; ctx.lineWidth = 1
      const tw = 160, th = 40
      const tx = Math.min(Math.max(x - tw/2, PAD.l + 5), PAD.l + plotW - tw - 5)
      const ty = y - 55
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(`${p.wn} cm⁻¹`, tx + tw/2, ty + 16)
      ctx.fillStyle = p.color; ctx.font = "9px sans-serif"
      ctx.fillText(p.label, tx + tw/2, ty + 30)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[2000,1800,1500,1200,1000,800,600,400].forEach(wn => {
      ctx.fillText(wn, wnToX(wn), PAD.t + plotH + 18)
    })
    ctx.textAlign = "right"
    ;[20,40,60,80,100].forEach(t => ctx.fillText(t + "%", PAD.l - 8, tToY(t) + 4))
    ctx.fillStyle = "#7c6a9e"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("To'lqin soni (cm⁻¹)", PAD.l + plotW / 2, H - 6)
    ctx.save(); ctx.translate(14, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("O'tkazuvchanlik T (%)", 0, 0); ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawSpectrum(canvas.getContext("2d"), canvas.width, canvas.height)
  }, [animProgress, hoveredPeak, selectedPeak, peaks])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = 820 / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const wn = 2300 - ((mx - PAD.l) / plotW) * (2300 - 400)
    let closest = null, minDist = 30
    peaks.forEach(p => { const dist = Math.abs(p.wn - wn); if (dist < minDist) { minDist = dist; closest = p } })
    setHoveredPeak(closest)
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={820} height={320}
        onMouseMove={handleMouseMove} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.wn === hoveredPeak.wn ? null : hoveredPeak) }}
        onMouseLeave={() => setHoveredPeak(null)}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair" />
      
      {animProgress < 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">Chizilmoqda...</span>
            <div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-blue-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: selectedPeak.color + "40" }}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: selectedPeak.color }} />
            <span className="font-mono font-bold text-lg" style={{ color: selectedPeak.color }}>{selectedPeak.wn} cm⁻¹</span>
            <span className="text-purple-400">—</span>
            <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: selectedPeak.label }} />
          </div>
          <p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">✕ Yopish</button>
        </div>
      )}
    </div>
  )
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function CuH2O6_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3400, T: 12, label: "ν(O–H) asimmetrik", color: "#f87171", desc: "Juda kuchli va keng — koordinatsiyalangan suv molekulasining asimmetrik valent tebranishi. Vodorod bog'lar tufayli past chastotaga siljigan va kengaygan." },
    { wn: 3250, T: 15, label: "ν(O–H) simmetrik", color: "#fb923c", desc: "Kuchli — suv molekulasining simmetrik valent tebranishi. Asimmetrikdan past chastotada." },
    { wn: 1640, T: 32, label: "δ(H–O–H) scissoring", color: "#60a5fa", desc: "O'rta — suv molekulasining qaychi shaklidagi deformatsion tebranishi. Erkin suvga nisbatan siljigan." },
    { wn: 800, T: 42, label: "ρ(H₂O) rocking", color: "#22d3ee", desc: "O'rta — koordinatsiyalangan suvning tebranma (rocking) harakati. Cu−O bog'i mavjudligini ko'rsatadi." },
    { wn: 490, T: 58, label: "ν(Cu–O) ekvatorial", color: "#fbbf24", desc: "Muhim — ekvatorial Cu−O valent tebranishi. Qisqa bog'lar (1.97 Å) — yuqori chastota." },
    { wn: 440, T: 55, label: "ν(Cu–O) aksial", color: "#a78bfa", desc: "Muhim — aksial Cu−O valent tebranishi. Uzun bog'lar (2.28 Å) — past chastota. Yan-Teller effekti!" },
    { wn: 380, T: 48, label: "δ(O–Cu–O) ekvatorial", color: "#86efac", desc: "O'rta — ekvatorial tekislikdagi deformatsion tebranish. 4 ta qisqa bog'." },
    { wn: 310, T: 52, label: "δ(O–Cu–O) aksial", color: "#c084fc", desc: "O'rta — aksial yo'nalishdagi deformatsion tebranish. Yan-Teller buzilgan oktaedr." },
  ]

  const tabs = [
    { id: "spektr",       label: "📈 IQ Spektri" },
    { id: "jadval",       label: "📊 Cho'qqilar jadvali" },
    { id: "yanteller",    label: "⚡ Yan-Teller va IQ" },
    { id: "dinamik",      label: "🔄 Dinamik Yan-Teller" },
    { id: "almashinuv",   label: "💧 Suv almashinuvi" },
    { id: "taqqos",       label: "⚖️ Boshqa Cu²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">[Cu(H₂O)₆]²⁺ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvamis(II) ioni • Yan-Teller effekti • Hexaaquacopper(II)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Cho'zilgan oktaedr</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁹</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Yan-Teller</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Paramagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Suv almashinuvi: 10⁹ s⁻¹</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Cu(H₂O)₆]²⁺
            </h2>
            <span className="text-purple-400 text-lg">171.66 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaakvamis(II) ioni — <span className="text-blue-400 italic">Yan-Teller effektining klassik namunasi</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> — Yan-Teller buzilishini bevosita ko'rsatadi.
            <strong className="text-yellow-400"> ν(Cu−O) ikkita polosa:</strong> 490 cm⁻¹ (ekvatorial, qisqa bog'lar) 
            va <strong>440 cm⁻¹ (aksial, uzun bog'lar)</strong>. Bu <strong>4+2 geometriya</strong>ning 
            bevosita isboti! Cu²⁺ (d⁹) — eg³ konfiguratsiya, degeneratlikni yo'qotish uchun oktaedr cho'ziladi.
            <strong className="text-yellow-400"> Suv almashinish tezligi 4.4×10⁹ s⁻¹</strong> — 
            eng tez almashinuvchi akva kompleks!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Cu²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d⁹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Cho'zilgan oktaedr (4+2)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">1.7−2.2 μ<sub>B</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Cu−O(ekv)</div>
              <div className="text-white font-bold">1.97 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Cu−O(aks)</div>
              <div className="text-white font-bold">2.28 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Δr</div>
              <div className="text-white font-bold">0.31 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Suv almashinuvi</div>
              <div className="text-white font-bold">4.4×10⁹ s⁻¹</div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600/40 text-white border border-blue-400/50"
                  : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── SPEKTR GRAFIGI ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Cu(H₂O)₆]²⁺</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#60a5fa" />
            <div className="flex flex-wrap gap-3">
              {peaks.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
                  style={{ borderColor: p.color + "40", background: p.color + "10" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="font-mono" style={{ color: p.color }}>{p.wn}</span>
                  <span className="text-purple-400">{p.label}</span>
                </div>
              ))}
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eng muhim diagnostik belgi:</strong> ν(Cu−O) ikkita polosa —
                490 cm⁻¹ (ekvatorial) va 440 cm⁻¹ (aksial). Bu Yan-Teller cho'zilgan oktaedrning IQ isboti!
                Oddiy oktaedrda faqat bitta ν(M−O) polosa kuzatiladi.
              </p>
            </div>
          </div>
        )}

        {/* ── CHO'QQILAR JADVALI ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali va tahlili</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th><th className="py-3 px-4 text-purple-300">Tebranish</th><th className="py-3 px-4 text-purple-300">Intensivlik</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4">{p.T < 25 ? <span className="text-red-400">Kuchli</span> : p.T < 55 ? <span className="text-yellow-400">O'rta</span> : <span className="text-green-400">Zaif</span>}</td>
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── YAN-TELLER VA IQ ── */}
        {activeTab === "yanteller" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Yan-Teller effekti — IQ da ikkita ν(Cu−O) polosasi</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Cu²⁺ (d⁹) — eg³ konfiguratsiya. <strong className="text-yellow-400">eg orbitallarda 3 ta elektron</strong> —
              degeneratlik mavjud. Yan-Teller teoremasi: degenerat holatli molekula simmetriyani buzadi.
              Oktaedr <strong className="text-yellow-400">Z o'qi bo'ylab cho'ziladi</strong> — 
              D<sub>4h</sub> simmetriya. IQ spektrida bu <strong>ikkita ν(Cu−O) polosa</strong> sifatida namoyon bo'ladi.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
                <h3 className="text-yellow-400 font-bold mb-3">Oddiy oktaedr</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> O<sub>h</sub><br/>
                  <strong>ν(Cu−O):</strong> 1 ta polosa<br/>
                  <strong>Bog'lar:</strong> 6 ta teng<br/>
                  <span className="text-red-400">KUZATILMAYDI!</span>
                </p>
              </div>
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 text-center">
                <h3 className="text-orange-400 font-bold mb-3">Cho'zilgan oktaedr</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> D<sub>4h</sub><br/>
                  <strong>ν(Cu−O):</strong> 2 ta polosa<br/>
                  <strong>Bog'lar:</strong> 4 qisqa + 2 uzun<br/>
                  <span className="text-green-400">KUZATILADI!</span>
                </p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 text-center">
                <h3 className="text-blue-400 font-bold mb-3">Siqilgan oktaedr</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> D<sub>4h</sub><br/>
                  <strong>ν(Cu−O):</strong> 2 ta polosa<br/>
                  <strong>Bog'lar:</strong> 2 qisqa + 4 uzun<br/>
                  <span className="text-purple-400">Kam uchraydi</span>
                </p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun aynan cho'zilgan oktaedr?</h3>
              <p className="text-purple-200 text-sm">
                d⁹ konfiguratsiyada eg orbitallarda: dx²−y² (2e⁻), dz² (1e⁻). 
                dx²−y² orbital to'lgan — ekvatorial ligandlarni kuchli itaradi → bog'lar qisqa.
                dz² orbital yarim to'lgan — aksial ligandlarni kuchsiz itaradi → bog'lar uzun.
                <strong>IQ isboti:</strong> 490 cm⁻¹ (kuchli bog' — ekvatorial), 440 cm⁻¹ (zaif bog' — aksial).
              </p>
            </div>
          </div>
        )}

        {/* ── DINAMIK YAN-TELLER ── */}
        {activeTab === "dinamik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Dinamik Yan-Teller — IQ ga ta'siri</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Xona haroratida cho'zilish o'qi <strong className="text-yellow-400">3 ta ekvivalent o'q orasida tebranadi</strong>.
              Bu — dinamik Yan-Teller effekti. IQ spektrida polosalar <strong>kengayadi</strong> va 
              vaqt bo'yicha o'rtacha D<sub>4h</sub> simmetriya kuzatiladi.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold mb-2">Past harorat (77 K)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Statik Yan-Teller</strong><br/>
                  Cho'zilish bir o'qda doimiy<br/>
                  IQ polosalar: <strong>tor va aniq</strong><br/>
                  ν(Cu−O): 2 ta aniq polosa<br/>
                  Simmetriya: D<sub>4h</sub>
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-orange-400 font-bold mb-2">Xona harorati (298 K)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Dinamik Yan-Teller</strong><br/>
                  Cho'zilish o'qlar orasida tebranadi<br/>
                  IQ polosalar: <strong>keng, birlashgan</strong><br/>
                  ν(Cu−O): keng assimmetrik polosa<br/>
                  O'rtacha simmetriya: O<sub>h</sub> ga yaqin
                </p>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>IQ diagnostikasi:</strong> Past haroratda IQ spektrini o'lchash — Yan-Teller effektini 
                tasdiqlashning eng ishonchli usullaridan biri. 77 K da polosalar ajraladi, 
                xona haroratida esa birlashgan keng polosa kuzatiladi.
              </p>
            </div>
          </div>
        )}

        {/* ── SUV ALMASHINUVI ── */}
        {activeTab === "almashinuv" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💧 Suv almashinuvi — eng tez akva kompleks</h2>
            
            <p className="text-purple-200 leading-relaxed">
              [Cu(H₂O)₆]²⁺ — <strong className="text-yellow-400">eng tez suv almashinuvchi akva kompleks</strong>.
              k<sub>H₂O</sub> = 4.4×10⁹ s⁻¹ (t<sub>½</sub> ≈ 160 ps). 
              Sababi: Yan-Teller buzilishi tufayli aksial suv molekulalari juda zaif bog'langan.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Ion</th><th className="py-3 px-4 text-purple-300">k<sub>H₂O</sub> (s⁻¹)</th><th className="py-3 px-4 text-purple-300">t<sub>½</sub></th><th className="py-3 px-4 text-purple-300">Mexanizm</th><th className="py-3 px-4 text-purple-300">Geometriya</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Cu(H₂O)₆]²⁺", "4.4×10⁹", "160 ps", "I<sub>d</sub> (tez)", "Cho'zilgan oktaedr"],
                    ["[Cr(H₂O)₆]³⁺", "2.4×10⁻⁶", "80 soat", "I<sub>a</sub> (sekin)", "Oktaedr"],
                    ["[Ni(H₂O)₆]²⁺", "3.2×10⁴", "22 μs", "I<sub>d</sub>", "Oktaedr"],
                    ["[Co(H₂O)₆]²⁺", "3.2×10⁶", "220 ns", "I<sub>d</sub>", "Oktaedr"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono text-green-400">{r[1]}</td>
                      <td className="py-3 px-4 text-sm">{r[2]}</td>
                      <td className="py-3 px-4 text-sm">{r[3]}</td>
                      <td className="py-3 px-4 text-sm">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 text-sm">
                <strong>IQ bilan bog'liqlik:</strong> Aksial suv molekulalarining zaif bog'lanishi 
                ν(Cu−O) aksial chastotasining past bo'lishida (440 cm⁻¹) aks etgan.
                Zaif bog' — past chastota — tez almashinuv.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa Cu²⁺ komplekslari bilan IQ taqqoslash</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Cu²⁺ turli ligandlar bilan turli geometriyali komplekslar hosil qiladi. 
              IQ spektri geometriya va ligand turini ishonchli farqlash imkonini beradi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ν(Cu−L)</th><th className="py-3 px-4 text-purple-300">Rangi</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Cu(H₂O)₆]²⁺", "Cho'zilgan oktaedr", "490, 440 cm⁻¹", "Havorang"],
                    ["[Cu(NH₃)₄(H₂O)₂]²⁺", "Cho'zilgan oktaedr", "ν(Cu−N): 420 cm⁻¹", "To'q ko'k"],
                    ["[CuCl₄]²⁻", "Tetraedrik", "ν(Cu−Cl): 290 cm⁻¹", "Sariq-yashil"],
                    ["[Cu(CN)₄]²⁻", "Kvadrat-planar", "ν(Cu−C): 480 cm⁻¹", "Sariq"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-sm">{r[1]}</td>
                      <td className="py-3 px-4 font-mono text-green-400">{r[2]}</td>
                      <td className="py-3 px-4">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(Cu−O) ikkita polosa:</strong> 490 cm⁻¹ (ekvatorial) va 440 cm⁻¹ (aksial) — Yan-Teller isboti</li>
            <li><strong className="text-yellow-400">Cho'zilgan oktaedr (4+2):</strong> Cu−O(ekv)=1.97 Å, Cu−O(aks)=2.28 Å, Δr=0.31 Å</li>
            <li><strong className="text-yellow-400">Dinamik Yan-Teller:</strong> xona haroratida polosalar keng, 77 K da tor va aniq</li>
            <li><strong className="text-yellow-400">Eng tez suv almashinuvi:</strong> 4.4×10⁹ s⁻¹ — aksial bog'lar zaifligi tufayli</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/ni-cn4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Ni(CN)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/ag-nh3-2" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [Ag(NH₃)₂]⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}