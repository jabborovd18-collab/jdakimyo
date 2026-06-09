"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── IQ SPEKTR GRAFIGI ────────────────────────────────────────────────────────
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
    [2025, 85, 12], [1995, 80, 10], [650, 45, 15],
    [580, 40, 13], [480, 38, 11], [420, 35, 10]
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
      grad.addColorStop(0, `rgba(251,191,36,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,191,36,0.01)")
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
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
export default function FeCO5_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 2025, T: 12, label: "ν(C≡O) A₁'", color: "#f87171", desc: "Juda kuchli — aksial CO ligandlarining simmetrik valent tebranishi. D<sub>3h</sub> simmetriyada IQ-faol." },
    { wn: 1995, T: 16, label: "ν(C≡O) E'", color: "#fb923c", desc: "Juda kuchli — ekvatorial CO ligandlarining valent tebranishi. Ikki karra degenerat. IQ-faol." },
    { wn: 650, T: 50, label: "δ(Fe–C≡O) aksial", color: "#60a5fa", desc: "O'rta — aksial CO ligandlarining deformatsion tebranishi. Chiziqli Fe−C≡O zanjiri." },
    { wn: 580, T: 55, label: "δ(Fe–C≡O) ekvatorial", color: "#22d3ee", desc: "O'rta — ekvatorial CO ligandlarining deformatsion tebranishi. Trigonal tekislikda." },
    { wn: 480, T: 58, label: "ν(Fe–C) aksial", color: "#fbbf24", desc: "MUHIM — aksial Fe−C valent tebranishi. Qisqa bog' (1.81 Å) — yuqori chastota." },
    { wn: 420, T: 62, label: "ν(Fe–C) ekvatorial", color: "#a78bfa", desc: "MUHIM — ekvatorial Fe−C valent tebranishi. Uzunroq bog' (1.83 Å) — pastroq chastota." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "electron18",  label: "⚡ 18-elektron qoidasi" },
    { id: "piback",      label: "🔄 π-Back-donatsiya" },
    { id: "berry",       label: "🔄 Berry psevdorotatsiyasi" },
    { id: "taqqos",      label: "⚖️ Boshqa karbonillar" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">[Fe(CO)₅] — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">pentakarboniltemir(0) • Trigonal-bipiramidal • 18-elektron kompleks</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Trigonal bipiramida</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D<sub>3h</sub></span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">18 e⁻</span>
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
            <strong className="text-yellow-400">ν(C≡O) = 2025, 1995 cm⁻¹</strong> — 
            erkin CO (2143 cm⁻¹) dan ancha past. Bu <strong className="text-yellow-400">kuchli π-back-donatsiya</strong> hisobiga:
            Fe⁰ boy elektron konfiguratsiya, CO ning bo'sh π* orbitallariga elektron qaytadi.
            <strong className="text-yellow-400"> Ikkita polosa</strong> — D<sub>3h</sub> simmetriyada 
            aksial (A₁') va ekvatorial (E') CO ligandlari. 
            <strong className="text-yellow-400"> Berry psevdorotatsiyasi</strong> — 
            aksial va ekvatorial ligandlar tez o'rin almashadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Valent e⁻</div>
              <div className="text-white font-bold">8 (d⁸)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Jami valent e⁻</div>
              <div className="text-white font-bold">18 ta</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Trigonal bipiramida</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Fe−C(aks)</div>
              <div className="text-white font-bold">1.81 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Fe−C(ekv)</div>
              <div className="text-white font-bold">1.83 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Holati</div>
              <div className="text-white font-bold">Suyuq (25°C)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Qaynash T</div>
              <div className="text-white font-bold">103°C</div>
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

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Fe(CO)₅]</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#fbbf24" />
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
                <strong className="text-yellow-400">Eng muhim diagnostik belgi:</strong> Ikkita ν(C≡O) polosa
                (2025 va 1995 cm⁻¹) — D<sub>3h</sub> simmetriyada aksial va ekvatorial CO ligandlari.
                Erkin CO ga nisbatan ~120−150 cm⁻¹ past — kuchli π-back-donatsiya.
              </p>
            </div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali va tahlili</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Chastota</th><th className="py-3 px-4 text-purple-300">Tebranish</th><th className="py-3 px-4 text-purple-300">Simmetriya</th><th className="py-3 px-4 text-purple-300">Intensivlik</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">
                        {i === 0 ? "A₁'" : i === 1 ? "E'" : i === 2 ? "A₂''" : i === 3 ? "E'" : i === 4 ? "A₁'" : "E'"}
                      </td>
                      <td className="py-3 px-4">{p.T < 25 ? <span className="text-red-400">Kuchli</span> : p.T < 55 ? <span className="text-yellow-400">O'rta</span> : <span className="text-green-400">Zaif</span>}</td>
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 18-ELEKTRON ── */}
        {activeTab === "electron18" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ 18-elektron qoidasi</h2>
            <p className="text-purple-200 leading-relaxed">
              [Fe(CO)₅] — <strong className="text-yellow-400">18-elektron qoidasining klassik namunasi</strong>.
              Fe⁰ — 8 ta valent elektron (3d⁸4s²). 5 ta CO — har biri 2 ta elektron beradi = 10 ta.
              <strong>Jami: 8 + 10 = 18 ta valent elektron!</strong>
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-2xl">Fe⁰ (d⁸) + 5 × CO (2e⁻) = 18 valent elektron</p>
              <p className="text-purple-300 text-sm mt-2">Barcha bog'lovchi MO lar to'lgan, antibog'lovchilar bo'sh — maksimal barqarorlik</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>IQ bilan bog'liqlik:</strong> 18-elektron konfiguratsiya tufayli barcha bog'lovchi MO lar to'lgan —
                IQ spektrida o'tkir, aniq polosalar kuzatiladi. Barqarorlik yuqori.
              </p>
            </div>
          </div>
        )}

        {/* ── π-BACK-DONATSIYA ── */}
        {activeTab === "piback" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 π-Back-donatsiya — CO ligandlari bilan</h2>
            <p className="text-purple-200 leading-relaxed">
              CO — <strong className="text-yellow-400">kuchli π-akseptor ligand</strong>.
              Fe⁰ boy elektron konfiguratsiya (d⁸) — CO ning bo'sh π* orbitallariga kuchli elektron qaytadi.
              Bu <strong>sinergik bog'lanish</strong>: σ-donorlik Fe←CO, π-akseptorlik Fe→CO.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Birikma</th><th className="py-3 px-4 text-purple-300">ν(C≡O) cm⁻¹</th><th className="py-3 px-4 text-purple-300">Δν</th><th className="py-3 px-4 text-purple-300">π-back</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Erkin CO</td><td className="py-3 px-4 font-mono">2143</td><td className="py-3 px-4">0</td><td className="py-3 px-4">Yo'q</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold text-yellow-400">[Fe(CO)₅]</td><td className="py-3 px-4 font-mono text-yellow-400">2025, 1995</td><td className="py-3 px-4 text-yellow-400">−118, −148</td><td className="py-3 px-4 text-red-400">JUDA KUCHLI</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4">[Ni(CO)₄]</td><td className="py-3 px-4 font-mono">2057</td><td className="py-3 px-4">−86</td><td className="py-3 px-4 text-yellow-400">Kuchli</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4">[Cr(CO)₆]</td><td className="py-3 px-4 font-mono">2000</td><td className="py-3 px-4">−143</td><td className="py-3 px-4 text-red-400">JUDA KUCHLI</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BERRY ── */}
        {activeTab === "berry" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Berry psevdorotatsiyasi — IQ va YaMR</h2>
            <p className="text-purple-200 leading-relaxed">
              [Fe(CO)₅] — <strong className="text-yellow-400">Berry psevdorotatsiyasi kuzatiladigan klassik molekula</strong>.
              Aksial va ekvatorial CO ligandlari <strong>juda tez</strong> o'rin almashadi.
              Xona haroratida barcha 5 ta CO guruhi magnit jihatdan ekvivalent.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">Xona haroratida (298 K)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Berry psevdorotatsiyasi:</strong> tez<br/>
                  <strong>¹³C YaMR:</strong> 1 ta signal (δ≈210)<br/>
                  <strong>IQ:</strong> o'rtacha spektr<br/>
                  <strong>Sabab:</strong> tez almashinuv
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold mb-2">Past haroratda (−100°C)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Berry psevdorotatsiyasi:</strong> sekin<br/>
                  <strong>¹³C YaMR:</strong> 2 ta signal (aks+ekv)<br/>
                  <strong>IQ:</strong> aniq polosalar<br/>
                  <strong>Sabab:</strong> sekin almashinuv
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa metall karbonillar bilan taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ν(C≡O)</th><th className="py-3 px-4 text-purple-300">Valent e⁻</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Fe(CO)₅]", "Trigonal bipiramida", "2025, 1995", "18"],
                    ["[Ni(CO)₄]", "Tetraedrik", "2057", "18"],
                    ["[Cr(CO)₆]", "Oktaedrik", "2000", "18"],
                    ["[V(CO)₆]", "Oktaedrik", "1860", "17"],
                    ["[Co(CO)₄]⁻", "Tetraedrik", "1890", "18"],
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
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(C≡O) = 2025, 1995 cm⁻¹</strong> — erkin CO dan ~120−150 cm⁻¹ past</li>
            <li><strong className="text-yellow-400">D<sub>3h</sub> simmetriya</strong> — ikkita IQ-faol CO valent tebranish (A₁' + E')</li>
            <li><strong className="text-yellow-400">Fe⁰ (d⁸) + 5CO = 18 e⁻</strong> — 18-elektron qoidasi, maksimal barqarorlik</li>
            <li><strong className="text-yellow-400">Berry psevdorotatsiyasi</strong> — xona haroratida tez, past haroratda sekin</li>
            <li><strong className="text-red-400">⚠️ Juda zaharli!</strong> Uchuvchan suyuqlik, CO ajratadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-cl4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [CoCl₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/zn-oh4" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Zn(OH)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}