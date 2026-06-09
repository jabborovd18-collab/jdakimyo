"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── IQ SPEKTR GRAFIGI (Canvas + Animatsiya) ────────────────────────────────────
function IQSpektrGrafik({ peaks }) {
  const canvasRef = useRef(null)
  const [hoveredPeak, setHoveredPeak] = useState(null)
  const [selectedPeak, setSelectedPeak] = useState(null)
  const [animProgress, setAnimProgress] = useState(0)
  const animRef = useRef(null)
  const pulseRef = useRef(0)

  // Animatsion chizilish
  useEffect(() => {
    let start = null
    const duration = 2000
    function animate(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      setAnimProgress(progress)
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      }
    }
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  // Pulsatsiya animatsiyasi
  useEffect(() => {
    const interval = setInterval(() => {
      pulseRef.current = (pulseRef.current + 0.05) % (Math.PI * 2)
      if (selectedPeak) {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          drawSpectrum(ctx, canvas.width, canvas.height)
        }
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
  const xToWn = (x) => 2300 - ((x - PAD.l) / plotW) * (2300 - 400)

  function lorentz(wn, wn0, depth, width) {
    return depth / (1 + ((wn - wn0) / width) ** 2)
  }

  const peakDefs = [
    [2044, 92, 10], [2020, 45, 8], [585, 78, 15],
    [416, 65, 14], [390, 50, 12], [340, 38, 11], [280, 28, 10], [1600, 6, 20]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    // Grid
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

    // Spektr chizig'i (animatsiya bilan)
    const maxWn = 400 + (2300 - 400) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = 1.8
    ctx.shadowBlur = 6
    ctx.shadowColor = "#fbbf24"

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

    // Fill
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
      grad.addColorStop(0, `rgba(251,191,36,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,191,36,0.01)")
      ctx.fillStyle = grad
      ctx.fill()
    }

    // Pik belgilari
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
        ctx.beginPath()
        ctx.arc(x, y, 12 * pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = p.color + "20"
        ctx.fill()
      }

      ctx.beginPath()
      ctx.strokeStyle = p.color
      ctx.lineWidth = isActive ? 2 : 0.8
      ctx.setLineDash([3, 2])
      const lineHeight = isActive ? 40 : 28
      ctx.moveTo(x, y - 2)
      ctx.lineTo(x, y - lineHeight)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.beginPath()
      ctx.arc(x, y, isActive ? 6 : 4, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
      if (isActive) {
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      ctx.fillStyle = p.color
      ctx.font = isActive ? "bold 11px monospace" : "bold 9px monospace"
      ctx.textAlign = "center"
      ctx.fillText(p.wn, x, y - lineHeight - 6)
    })

    // Hover tooltip
    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(p.wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(p.wn), y = tToY(T)

      ctx.fillStyle = "#0f0a1a"
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1
      const tw = 160, th = 40
      const tx = Math.min(Math.max(x - tw/2, PAD.l + 5), PAD.l + plotW - tw - 5)
      const ty = y - 55
      
      ctx.beginPath()
      ctx.roundRect(tx, ty, tw, th, 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#fff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${p.wn} cm⁻¹`, tx + tw/2, ty + 16)
      ctx.fillStyle = p.color
      ctx.font = "9px sans-serif"
      ctx.fillText(p.label, tx + tw/2, ty + 30)
    }

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    // X belgilari
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[2000,1800,1500,1200,1000,800,600,400].forEach(wn => {
      ctx.fillText(wn, wnToX(wn), PAD.t + plotH + 18)
    })
    
    // Y belgilari
    ctx.textAlign = "right"
    ;[20,40,60,80,100].forEach(t => {
      ctx.fillText(t + "%", PAD.l - 8, tToY(t) + 4)
    })

    // O'q nomlari
    ctx.fillStyle = "#7c6a9e"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("To'lqin soni (cm⁻¹)", PAD.l + plotW / 2, H - 6)
    ctx.save(); ctx.translate(14, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("O'tkazuvchanlik T (%)", 0, 0); ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    drawSpectrum(ctx, canvas.width, canvas.height)
  }, [animProgress, hoveredPeak, selectedPeak, peaks])

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scaleX = 820 / rect.width
    const mx = (e.clientX - rect.left) * scaleX
    const wn = 2300 - ((mx - PAD.l) / plotW) * (2300 - 400)
    let closest = null
    let minDist = 30
    peaks.forEach(p => {
      const dist = Math.abs(p.wn - wn)
      if (dist < minDist) { minDist = dist; closest = p }
    })
    setHoveredPeak(closest)
  }

  const handleClick = () => {
    if (hoveredPeak) {
      setSelectedPeak(selectedPeak?.wn === hoveredPeak.wn ? null : hoveredPeak)
    }
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={820} height={320}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={() => setHoveredPeak(null)}
        className="w-full h-auto rounded-xl border border-purple-700/50 cursor-crosshair"
      />
      
      {animProgress < 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-purple-950/80 backdrop-blur px-4 py-2 rounded-full border border-purple-700/50">
          <div className="flex items-center gap-2">
            <span className="text-xs text-purple-400">Chizilmoqda...</span>
            <div className="w-24 h-1.5 bg-purple-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-100"
                style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4"
          style={{ borderColor: selectedPeak.color + "40" }}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: selectedPeak.color }} />
            <span className="font-mono font-bold text-lg" style={{ color: selectedPeak.color }}>
              {selectedPeak.wn} cm⁻¹
            </span>
            <span className="text-purple-400">—</span>
            <span className="text-white font-semibold" dangerouslySetInnerHTML={{ __html: selectedPeak.label }} />
          </div>
          <p className="text-purple-300 text-sm mt-2">{selectedPeak.desc}</p>
          <button onClick={() => setSelectedPeak(null)} className="mt-2 text-xs text-purple-400 hover:text-white transition-colors">
            ✕ Yopish
          </button>
        </div>
      )}
    </div>
  )
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K4FeCN6_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 2044, T: 8,  label: "ν(C≡N)", color: "#fbbf24", desc: "Juda kuchli — asosiy diagnostik signal. CN⁻ ligandining valent tebranishi. Erkin CN⁻ dan past chastotaga siljigan." },
    { wn: 2020, T: 42, label: "ν(C≡N) shoulder", color: "#f59e0b", desc: "Yelka — oktaedrik kristall maydonida C≡N bog'larining kuchsiz splittingi." },
    { wn: 585, T: 25, label: "ν(Fe–C)", color: "#22d3ee", desc: "Kuchli — metall-ligand bog'ining valent tebranishi. Fe²⁺−C bog'i Fe³⁺ ga nisbatan kuchsizroq." },
    { wn: 416, T: 52, label: "δ(Fe–C≡N)", color: "#a78bfa", desc: "O'rta — Fe−C≡N chiziqli zanjirining deformatsion tebranishi. Oktaedrik simmetriya." },
    { wn: 390, T: 60, label: "δ(C–Fe–C)", color: "#60a5fa", desc: "O'rta — oktaedrik skelet deformatsion tebranishi. O<sub>h</sub> simmetriya." },
    { wn: 340, T: 70, label: "Tashqi sfera", color: "#86efac", desc: "Zaif — K⁺···NC kristall panjara tebranishlari. Tashqi sfera kationlari ta'siri." },
    { wn: 280, T: 78, label: "ν(Fe–C) rocking", color: "#c084fc", desc: "Kuchsiz — metall-ligand bog'ining tebranma (rocking) harakati. Past chastotali soha." },
  ]

  const tabs = [
    { id: "spektr",   label: "📈 IQ Spektri" },
    { id: "jadval",   label: "📊 Cho'qqilar jadvali" },
    { id: "guruh",    label: "🔬 Guruh nazariyasi" },
    { id: "piback",   label: "🔄 π-Back-donatsiya" },
    { id: "taqqos",   label: "⚖️ Qizil qon tuzi bilan taqqoslash" },
    { id: "magnit",   label: "🧲 Magnit farqi" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">K₄[Fe(CN)₆] — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(II) • Sariq qon tuzi • Potassium hexacyanoferrate(II)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">KBr tabletka</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              K₄[Fe(CN)₆]
            </h2>
            <span className="text-purple-400 text-lg">368.35 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            kaliy geksasiyanoferrat(II) — <span className="text-yellow-400 italic">"Sariq qon tuzi"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka usulida olingan. 
            <strong className="text-yellow-400"> ν(C≡N) = 2044 cm⁻¹</strong> — erkin CN⁻ dan past chastotaga siljigan.
            Bu <strong className="text-yellow-400">kuchli π-back-donatsiya</strong> hisobiga:
            Fe²⁺ (d⁶, t₂g⁶) — boy elektron konfiguratsiya, CN⁻ ning π* orbitallariga kuchli elektron qaytishi.
            Natijada C≡N bog'i zaiflashadi — chastota pasayadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d⁶ (QS)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oktaedrik</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">KMBE</div>
              <div className="text-white font-bold">−2.4Δ<sub>o</sub></div>
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
                  ? "bg-yellow-600/40 text-white border border-yellow-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — K₄[Fe(CN)₆]</h2>
            
            <IQSpektrGrafik peaks={peaks} />

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

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eksperimental sharoit:</strong> KBr tabletka, 
                4000−200 cm⁻¹, xona harorati, 4 cm⁻¹ ruxsat.
                <strong className="text-yellow-400"> Asosiy farq:</strong> ν(C≡N) = 2044 cm⁻¹ — 
                Qizil qon tuzidan (2115 cm⁻¹) 71 cm⁻¹ ga past!
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
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Chastota (cm⁻¹)</th>
                    <th className="py-3 px-4 text-purple-300">O'tkazuvchanlik</th>
                    <th className="py-3 px-4 text-purple-300">Tebranish turi</th>
                    <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                    <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4">
                        {p.T < 25 ? <span className="text-red-400">Kuchli</span> : 
                         p.T < 55 ? <span className="text-yellow-400">O'rta</span> : 
                         <span className="text-green-400">Zaif</span>}
                      </td>
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GURUH NAZARIYASI ── */}
        {activeTab === "guruh" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili</h2>
            
            <p className="text-purple-200 leading-relaxed">
              [Fe(CN)₆]⁴⁻ ioni ham <strong className="text-yellow-400">O<sub>h</sub> nuqtali guruhga</strong> tegishli.
              Qizil qon tuzi bilan bir xil simmetriya, lekin metall oksidlanish darajasi farqi tufayli 
              tebranish chastotalari siljigan.
            </p>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Normal tebranish modlari</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>15 ta normal tebranish modi:</strong> Γ<sub>teb</sub> = A<sub>1g</sub> + E<sub>g</sub> + T<sub>1g</sub> + T<sub>2g</sub> + 2T<sub>1u</sub> + T<sub>2u</sub>
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> 2T<sub>1u</sub> (ν₃ — valent, ν₄ — deformatsion)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> A<sub>1g</sub> + E<sub>g</sub> + T<sub>2g</sub></span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-yellow-300 text-sm">
                <strong>Muhim:</strong> O<sub>h</sub> simmetriya tufayli <strong>alternativ taqiq</strong> amal qiladi —
                IQ va Raman spektrlarida bir xil chastotalar kuzatilmaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── π-BACK-DONATSIYA ── */}
        {activeTab === "piback" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 π-Back-donatsiya — Sariq qon tuzida kuchli</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Fe²⁺ (d⁶, t₂g⁶) — <strong className="text-yellow-400">boy elektron konfiguratsiya</strong>.
              To'liq to'lgan t₂g orbitallar CN⁻ ning bo'sh π* orbitallariga kuchli elektron qaytaradi.
              Bu <strong className="text-yellow-400">π-back-donatsiya</strong> C≡N bog'ini zaiflashtiradi va 
              ν(C≡N) chastotasini pasaytiradi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Birikma</th>
                    <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                    <th className="py-3 px-4 text-purple-300">t₂g elektronlar</th>
                    <th className="py-3 px-4 text-purple-300">ν(C≡N) cm⁻¹</th>
                    <th className="py-3 px-4 text-purple-300">π-back-donatsiya</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4">Erkin CN⁻</td>
                    <td className="py-3 px-4">—</td>
                    <td className="py-3 px-4">—</td>
                    <td className="py-3 px-4 font-mono">2080</td>
                    <td className="py-3 px-4">Yo'q</td>
                  </tr>
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold text-red-400">K₃[Fe(CN)₆]</td>
                    <td className="py-3 px-4">d⁵, t₂g⁵</td>
                    <td className="py-3 px-4">5</td>
                    <td className="py-3 px-4 font-mono text-red-400">2115</td>
                    <td className="py-3 px-4">Kuchsiz (+35)</td>
                  </tr>
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold text-yellow-400">K₄[Fe(CN)₆]</td>
                    <td className="py-3 px-4">d⁶, t₂g⁶</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">6</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">2044</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">Kuchli (−36)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>Xulosa:</strong> π-back-donatsiya kuchi: Fe²⁺ (t₂g⁶) &gt; Fe³⁺ (t₂g⁵). 
                Sariq qon tuzida C≡N bog'i zaifroq, chastota pastroq.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Qizil vs Sariq qon tuzi — IQ taqqoslash</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Parametr</th>
                    <th className="py-3 px-4 text-purple-300">K₃[Fe(CN)₆] (Qizil)</th>
                    <th className="py-3 px-4 text-purple-300">K₄[Fe(CN)₆] (Sariq)</th>
                    <th className="py-3 px-4 text-purple-300">Farq</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Metall", "Fe³⁺", "Fe²⁺", "1 ta elektron"],
                    ["d-konfiguratsiya", "d⁵ (t₂g⁵ eg⁰)", "d⁶ (t₂g⁶ eg⁰)", "1 ta e⁻ ko'p"],
                    ["ν(C≡N) asosiy", "2115 cm⁻¹", "2044 cm⁻¹", "−71 cm⁻¹"],
                    ["ν(Fe−C)", "590 cm⁻¹", "585 cm⁻¹", "−5 cm⁻¹"],
                    ["π-back-donatsiya", "Kuchsiz", "Kuchli", "t₂g⁶ > t₂g⁵"],
                    ["Magnit xossasi", "Paramagnit (2.20 μ<sub>B</sub>)", "Diamagnit", "1 ta toq e⁻"],
                    ["Rangi", "Qizil", "Sariq", "Fe³⁺ vs Fe²⁺"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-red-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-yellow-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
                      <td className="py-3 px-4 text-blue-400 text-sm">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MAGNIT FARQI ── */}
        {activeTab === "magnit" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🧲 Magnit farqi — IQ bilan bog'liqlik</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Magnit xossalar IQ spektrlariga <strong className="text-yellow-400">bilvosita ta'sir qiladi</strong>.
              Diamagnit komplekslarda elektron tuzilishi barqarorroq — tebranish chastotalari aniqroq.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-3">K₃[Fe(CN)₆] — Paramagnit</h3>
                <p className="text-purple-200 text-sm">
                  <strong>d⁵, t₂g⁵ eg⁰</strong><br/>
                  n = 1 ta toq elektron<br/>
                  μ<sub>eff</sub> = 2.20 μ<sub>B</sub><br/>
                  ν(C≡N) = 2115 cm⁻¹<br/>
                  <span className="text-purple-400">Kuchsiz π-back-donatsiya</span>
                </p>
              </div>
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
                <h3 className="text-yellow-400 font-bold mb-3">K₄[Fe(CN)₆] — Diamagnit</h3>
                <p className="text-purple-200 text-sm">
                  <strong>d⁶, t₂g⁶ eg⁰</strong><br/>
                  n = 0 toq elektron<br/>
                  μ<sub>eff</sub> = 0<br/>
                  ν(C≡N) = 2044 cm⁻¹<br/>
                  <span className="text-purple-400">Kuchli π-back-donatsiya</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(C≡N) = 2044 cm⁻¹</strong> — erkin CN⁻ dan 36 cm⁻¹ past</li>
            <li>Fe²⁺ (d⁶, t₂g⁶) — <strong>kuchli π-back-donatsiya</strong>, C≡N bog'i zaiflashgan</li>
            <li><strong>Diamagnit</strong> — barcha elektronlar juftlashgan, barqaror elektron tuzilish</li>
            <li>Qizil qon tuziga nisbatan ν(C≡N) <strong>71 cm⁻¹ past</strong> — asosiy diagnostik farq</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Qizil qon tuzi
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-6-cl3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Co(NH₃)₆]Cl₃ →
          </Link>
        </div>

      </section>
    </main>
  )
}