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
    [2128, 88, 10], [2090, 50, 8], [540, 40, 12],
    [417, 32, 10], [380, 35, 11]
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
      grad.addColorStop(0, `rgba(74,222,128,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(74,222,128,0.01)")
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
              <div className="h-full bg-green-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-green-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
export default function NiCN4_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 2128, T: 10, label: "ν(C≡N)", color: "#f87171", desc: "Juda kuchli — asosiy diagnostik signal. Erkin CN⁻ dan yuqori chastotaga siljigan — Ni→CN π-back-donatsiya kuchsiz." },
    { wn: 2090, T: 42, label: "ν(C≡N) shoulder", color: "#fb923c", desc: "Yelka — kvadrat-planar maydonda C≡N bog'larining kuchsiz splittingi. D<sub>4h</sub> simmetriya." },
    { wn: 540, T: 52, label: "δ(Ni–C≡N)", color: "#60a5fa", desc: "O'rta — Ni−C≡N chiziqli zanjirining deformatsion tebranishi. Oktaedrik komplekslardan farqli." },
    { wn: 417, T: 60, label: "ν(Ni–C)", color: "#22d3ee", desc: "Muhim — metall-ligand valent tebranishi. Ni²⁺−C bog'i mustahkamligini ko'rsatadi. Og'ir Ni atomi tufayli past chastota." },
    { wn: 380, T: 58, label: "δ(C–Ni–C)", color: "#a78bfa", desc: "O'rta — kvadrat-planar skelet deformatsion tebranishi. C−Ni−C burchaklari 90° va 180°." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "piback",      label: "🔄 π-Back-donatsiya" },
    { id: "geometriya",  label: "⬛ Kv-planar vs Tetraedrik" },
    { id: "labillik",    label: "⚡ Termodinamik vs Kinetik" },
    { id: "xavfsizlik",  label: "⚠️ Xavfsizlik — HCN ajralishi" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">[Ni(CN)₄]²⁻ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetrasiyanonikkolat(II) ioni • Kvadrat-planar d⁸ kompleks • Tetracyanonickelate(II)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tekis kvadrat</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">D<sub>4h</sub></span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">log β₄ ≈ 30</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Ni(CN)₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">162.78 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetrasiyanonikkolat(II) ioni — <span className="text-green-400 italic">d⁸ kvadrat-planar kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">ν(C≡N) = 2128 cm⁻¹</strong> — erkin CN⁻ dan yuqori.
            Bu <strong className="text-yellow-400">kuchsiz π-back-donatsiya</strong> hisobiga.
            Ni²⁺ (d⁸) da d<sub>x²−y²</sub> orbital bo'sh — elektronlar asosan pastki orbitallarda joylashgan.
            <strong className="text-yellow-400"> ν(Ni−C) = 417 cm⁻¹</strong> — og'ir Ni atomi tufayli past chastota.
            D<sub>4h</sub> simmetriya — <strong>alternativ taqiq</strong> amal qiladi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Ni²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d⁸</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Barqarorlik</div>
              <div className="text-white font-bold">log β₄ ≈ 30</div>
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
                  ? "bg-green-600/40 text-white border border-green-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Ni(CN)₄]²⁻</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#4ade80" />
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
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eksperimental sharoit:</strong> KBr tabletka,
                4000−200 cm⁻¹. <strong>Eng kuchli polosa:</strong> 2128 cm⁻¹ — ν(C≡N).
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

        {/* ── π-BACK-DONATSIYA ── */}
        {activeTab === "piback" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 π-Back-donatsiya — Ni²⁺ da kuchsiz</h2>
            <p className="text-purple-200 leading-relaxed">
              Ni²⁺ (d⁸) — <strong className="text-yellow-400">oraliq π-donor</strong>.
              d<sub>x²−y²</sub> orbital bo'sh — bu orbital σ-bog' hosil qilishda ishtirok etadi.
              Qolgan 4 ta d-orbital (d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>, d<sub>z²</sub>) to'lgan.
              π-back-donatsiya Fe²⁺ ga nisbatan kuchsiz — ν(C≡N) erkin CN⁻ dan yuqori.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Birikma</th><th className="py-3 px-4 text-purple-300">Metall</th><th className="py-3 px-4 text-purple-300">ν(C≡N)</th><th className="py-3 px-4 text-purple-300">π-back</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Erkin CN⁻</td><td className="py-3 px-4">—</td><td className="py-3 px-4 font-mono">2080</td><td className="py-3 px-4">Yo'q</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold text-green-400">[Ni(CN)₄]²⁻</td><td className="py-3 px-4">Ni²⁺ (d⁸)</td><td className="py-3 px-4 font-mono text-green-400">2128</td><td className="py-3 px-4 text-yellow-400">Kuchsiz (+48)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold text-red-400">[Fe(CN)₆]³⁻</td><td className="py-3 px-4">Fe³⁺ (d⁵)</td><td className="py-3 px-4 font-mono text-red-400">2115</td><td className="py-3 px-4 text-yellow-400">Kuchsiz (+35)</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold text-yellow-400">[Fe(CN)₆]⁴⁻</td><td className="py-3 px-4">Fe²⁺ (d⁶)</td><td className="py-3 px-4 font-mono text-yellow-400">2044</td><td className="py-3 px-4 text-red-400">Kuchli (−36)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GEOMETRIYA ── */}
        {activeTab === "geometriya" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⬛ Kvadrat-planar vs Tetraedrik — IQ farqi</h2>
            <p className="text-purple-200 leading-relaxed">
              Ni²⁺ (d⁸) ikki xil geometriyada mavjud bo'la oladi: kvadrat-planar (kuchli maydon, CN⁻) va 
              tetraedrik (kuchsiz maydon, Cl⁻). IQ spektri geometriyani ishonchli farqlash imkonini beradi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                <h3 className="text-green-400 font-bold mb-3">[Ni(CN)₄]²⁻ (Kvadrat-planar)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> D<sub>4h</sub><br/>
                  <strong>ν(C≡N):</strong> 2128 cm⁻¹ (1 ta IQ polosa)<br/>
                  <strong>ν(Ni−C):</strong> 417 cm⁻¹<br/>
                  <strong>Magnit:</strong> Diamagnit (n=0)<br/>
                  <strong>Rangi:</strong> Sariq<br/>
                  <strong>Alternativ taqiq:</strong> Ha
                </p>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-3">[NiCl₄]²⁻ (Tetraedrik)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> T<sub>d</sub><br/>
                  <strong>ν(Ni−Cl):</strong> 290 cm⁻¹<br/>
                  <strong>Magnit:</strong> Paramagnit (n=2)<br/>
                  <strong>μ<sub>eff</sub>:</strong> 3.5−4.1 μ<sub>B</sub><br/>
                  <strong>Rangi:</strong> Ko'k<br/>
                  <strong>Alternativ taqiq:</strong> Yo'q
                </p>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>IQ diagnostikasi:</strong> ν(C≡N) mavjudligi — bu faqat CN⁻ komplekslariga xos.
                ν(Ni−Cl) esa Cl⁻ komplekslarida kuzatiladi. Ikki xil ligand — ikki xil IQ spektr!
              </p>
            </div>
          </div>
        )}

        {/* ── LABILLIK ── */}
        {activeTab === "labillik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Termodinamik barqaror, kinetik labil</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ni(CN)₄]²⁻ — <strong className="text-yellow-400">termodinamik va kinetik barqarorlik farqining klassik namunasi</strong>.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">Termodinamik barqarorlik</h3>
                <p className="text-purple-200 text-sm">
                  log β₄ ≈ 30 — juda yuqori<br/>
                  ΔG° ≈ −171 kJ/mol<br/>
                  K<sub>diss</sub> ≈ 10⁻³⁰<br/>
                  <span className="text-green-400">Parchalanishi qiyin</span>
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">Kinetik labillik</h3>
                <p className="text-purple-200 text-sm">
                  CN⁻ almashinuvi: tez (t<sub>½</sub> &lt; 1 s)<br/>
                  d⁸ — past KMBE<br/>
                  I<sub>d</sub> mexanizm — past E<sub>a</sub><br/>
                  <span className="text-yellow-400">Ligandlar tez almashadi</span>
                </p>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>IQ bilan bog'liqlik:</strong> Termodinamik barqarorlik yuqori ν(C≡N) chastotasida aks etadi.
                Kinetik labillik esa IQ spektrida bevosita ko'rinmaydi — bu reaksiya tezligi bilan bog'liq parametr.
              </p>
            </div>
          </div>
        )}

        {/* ── XAVFSIZLIK ── */}
        {activeTab === "xavfsizlik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚠️ Xavfsizlik — HCN ajralishi va IQ monitoring</h2>
            
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-6">
              <p className="text-red-300 text-sm">
                <strong>⚠️ Ogohlantirish:</strong> [Ni(CN)₄]²⁻ kislotali muhitda <strong>zaharli HCN gazi</strong> ajratadi!
                IQ spektroskopiya HCN ajralishini real vaqt rejimida kuzatish imkonini beradi.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">pH</th>
                  <th className="py-3 px-4 text-purple-300">ν(C≡N)</th>
                  <th className="py-3 px-4 text-purple-300">Holat</th>
                  <th className="py-3 px-4 text-purple-300">Xavfsizlik</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["&gt; 10", "2128 cm⁻¹", "Barqaror [Ni(CN)₄]²⁻", "Xavfsiz ✅"],
                    ["7−10", "2128 cm⁻¹", "Barqaror", "Xavfsiz ✅"],
                    ["5−7", "2128 + 2090 cm⁻¹", "Qisman protonlanish", "Ehtiyot ⚠️"],
                    ["&lt; 5", "2090 cm⁻¹ (HCN)", "HCN ajraladi", "XAVFLI 🚫"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4 font-mono">{r[1]}</td>
                      <td className="py-3 px-4">{r[2]}</td>
                      <td className="py-3 px-4">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Reaksiya tenglamasi:</h3>
              <p className="text-green-400 font-mono text-sm mb-2">
                [Ni(CN)₄]²⁻ + 4H⁺ → Ni²⁺ + 4HCN↑
              </p>
              <p className="text-purple-200 text-sm">
                <strong>IQ monitoring:</strong> Reaksiya davomida 2128 cm⁻¹ polosa yo'qoladi,
                2090 cm⁻¹ da HCN ga xos polosa paydo bo'ladi. Bu — kislotali muhitda 
                kompleks parchalanishini IQ orqali kuzatish imkonini beradi.
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(C≡N) = 2128 cm⁻¹</strong> — erkin CN⁻ dan yuqori, kuchsiz π-back-donatsiya</li>
            <li><strong className="text-yellow-400">ν(Ni−C) = 417 cm⁻¹</strong> — og'ir Ni atomi tufayli past chastota</li>
            <li>D<sub>4h</sub> simmetriya — <strong>alternativ taqiq</strong> amal qiladi</li>
            <li><strong>Termodinamik barqaror</strong> (log β≈30), lekin <strong>kinetik labil</strong></li>
            <li>Kislotali muhitda <strong>zaharli HCN ajraladi</strong> — IQ orqali kuzatish mumkin</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/ferrosen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Ferrosen
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/cu-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Cu(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}