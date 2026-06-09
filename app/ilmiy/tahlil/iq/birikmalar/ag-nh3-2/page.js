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
    [3350, 80, 55], [3260, 75, 45], [1600, 55, 25],
    [1250, 48, 20], [750, 42, 18], [450, 35, 14]
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
      grad.addColorStop(0, `rgba(192,132,252,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(192,132,252,0.01)")
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
              <div className="h-full bg-purple-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-purple-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
export default function AgNH32_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3350, T: 15, label: "ν(N–H) asimmetrik", color: "#f87171", desc: "Kuchli — koordinatsiyalangan ammiakning asimmetrik valent tebranishi. Erkin NH₃ ga nisbatan siljigan." },
    { wn: 3260, T: 20, label: "ν(N–H) simmetrik", color: "#fb923c", desc: "Kuchli — simmetrik valent tebranish. Asimmetrikdan past chastotada. Chiziqli kompleksga xos." },
    { wn: 1600, T: 40, label: "δ(H–N–H) degenerate", color: "#60a5fa", desc: "O'rta — NH₃ ligandining degenerat deformatsion tebranishi. Ikki ligandli kompleksda bitta polosa." },
    { wn: 1250, T: 48, label: "δ(H–N–H) simmetrik", color: "#22d3ee", desc: "O'rta — simmetrik deformatsion tebranish. Ag−N bog'i mavjudligini ko'rsatadi." },
    { wn: 750, T: 55, label: "ρ(NH₃) rocking", color: "#fbbf24", desc: "O'rta — NH₃ ligandining tebranma harakati. Chiziqli N−Ag−N uchun xos." },
    { wn: 450, T: 62, label: "ν(Ag–N)", color: "#a78bfa", desc: "Muhim — metall-ligand valent tebranishi. Og'ir Ag atomi tufayli juda past chastota. Ag−N bog'i mustahkamligini ko'rsatadi." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "chiziqli",    label: "📏 Chiziqli geometriya" },
    { id: "tollens",     label: "🥈 Tollens reaksiyasi" },
    { id: "barqarorlik", label: "⚖️ Barqarorlik konstantalari" },
    { id: "xavfsizlik",  label: "⚠️ Xavfsizlik" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">[Ag(NH₃)₂]⁺ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">diamminkumush(I) ioni • Tollens reaktivi • Chiziqli d¹⁰ kompleks</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Chiziqli</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">D<sub>∞h</sub></span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">sp-gibridlanish</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Ag(NH₃)₂]⁺
            </h2>
            <span className="text-purple-400 text-lg">141.94 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            diamminkumush(I) ioni — <span className="text-cyan-400 italic font-bold">"TOLLENS REAKTIVI"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">ν(Ag−N) = 450 cm⁻¹</strong> — og'ir kumush atomi tufayli 
            juda past chastotali metall-ligand tebranishi. 
            <strong className="text-yellow-400"> Chiziqli geometriya (D<sub>∞h</sub>)</strong> — 
            N−Ag−N burchagi 180°. Ag⁺ (d¹⁰) — barcha d-orbitallar to'lgan, KMBE=0.
            <strong className="text-yellow-400"> K₂ &gt; K₁</strong> — noodatiy barqarorlik tartibi!
            Ikkinchi NH₃ birikishi birinchisidan osonroq.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Ag⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d¹⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Chiziqli (D<sub>∞h</sub>)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">log K₁</div>
              <div className="text-white font-bold">3.3</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">log K₂</div>
              <div className="text-white font-bold">3.9</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">log β₂</div>
              <div className="text-white font-bold">7.2</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Bog' burchagi</div>
              <div className="text-white font-bold">N−Ag−N = 180°</div>
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
                  ? "bg-cyan-600/40 text-white border border-cyan-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Ag(NH₃)₂]⁺</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#c084fc" />
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
          </div>
        )}

        {/* ── CHO'QQILAR JADVALI ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Cho'qqilar jadvali</h2>
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

        {/* ── CHIZIQLI GEOMETRIYA ── */}
        {activeTab === "chiziqli" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📏 Chiziqli geometriya — IQ ga ta'siri</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ag(NH₃)₂]⁺ — <strong className="text-yellow-400">chiziqli kompleks</strong>.
              Ag⁺ (d¹⁰) — barcha d-orbitallar to'lgan, KMBE=0. Geometriya faqat sterik omillar bilan belgilanadi.
              sp-gibridlanish — ikkita ligand 180° burchak ostida joylashgan.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-cyan-400 font-bold mb-2">Chiziqli (D<sub>∞h</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Bog' burchagi:</strong> 180°<br/>
                  <strong>Gibridlanish:</strong> sp<br/>
                  <strong>Simmetriya:</strong> D<sub>∞h</sub><br/>
                  <strong>Inversiya markazi:</strong> Ha<br/>
                  <strong>IQ faol:</strong> Σ<sub>u</sub><sup>+</sup>, Π<sub>u</sub>
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-purple-400 font-bold mb-2">Nima uchun chiziqli?</h3>
                <p className="text-purple-200 text-sm">
                  d¹⁰ — KMBE=0<br/>
                  Ikkita ligand — maksimal masofa<br/>
                  Sterik itarilish — minimal<br/>
                  sp-gibridlanish — 180°<br/>
                  <span className="text-green-400">Optimal geometriya!</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TOLLENS REAKSIYASI ── */}
        {activeTab === "tollens" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🥈 Tollens reaksiyasi — IQ monitoring</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ag(NH₃)₂]⁺ — <strong className="text-yellow-400">Tollens reaktivining faol komponenti</strong>.
              Aldegidlar bilan reaksiyaga kirishib, metallik kumush ajratadi.
              IQ spektroskopiya bu jarayonni kuzatish imkonini beradi.
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-green-400 font-mono text-sm mb-2">
                RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O
              </p>
              <p className="text-purple-200 text-sm">
                <strong>IQ monitoring:</strong> Reaksiya davomida ν(Ag−N) 450 cm⁻¹ polosa yo'qoladi,
                erkin NH₃ ga xos ν(N−H) chastotalari o'zgaradi. Kumush cho'kmasi IQ spektriga ta'sir qilmaydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tollens reaktividan keyin IQ o'zgarishi</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-purple-400">Reaksiyagacha:</span><br/><span className="text-purple-200">ν(Ag−N): 450 cm⁻¹</span></div>
                <div><span className="text-purple-400">Reaksiyadan keyin:</span><br/><span className="text-purple-200">ν(Ag−N): yo'qoladi</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── BARQARORLIK ── */}
        {activeTab === "barqarorlik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Barqarorlik konstantalari — K₂ &gt; K₁!</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ag(NH₃)₂]⁺ — <strong className="text-yellow-400">K₂ &gt; K₁ bo'lgan nodir holat</strong>.
              Odatda K₁ &gt; K₂ &gt; K₃... bo'ladi. Ag⁺ da esa ikkinchi NH₃ birikishi birinchisidan oson!
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Bosqich</th><th className="py-3 px-4 text-purple-300">Reaksiya</th><th className="py-3 px-4 text-purple-300">log K</th><th className="py-3 px-4 text-purple-300">Izoh</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">1</td><td className="py-3 px-4">Ag⁺ + NH₃ ⇌ [Ag(NH₃)]⁺</td><td className="py-3 px-4 font-mono text-yellow-400">3.3</td><td className="py-3 px-4 text-sm">Birinchi NH₃ — sekinroq</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">2</td><td className="py-3 px-4">[Ag(NH₃)]⁺ + NH₃ ⇌ [Ag(NH₃)₂]⁺</td><td className="py-3 px-4 font-mono text-green-400">3.9</td><td className="py-3 px-4 text-sm">Ikkinchi NH₃ — tezroq!</td></tr>
                  <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">Umumiy</td><td className="py-3 px-4">Ag⁺ + 2NH₃ ⇌ [Ag(NH₃)₂]⁺</td><td className="py-3 px-4 font-mono text-cyan-400">7.2</td><td className="py-3 px-4 text-sm">β₂ = K₁×K₂</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>Sababi:</strong> Birinchi NH₃ birikkandan keyin Ag⁺ yumshoqroq kislota bo'lib qoladi.
                Ikkinchi NH₃ (qattiq asos) bilan bog'lanishi osonlashadi. Bu HSAB nazariyasi bilan tushuntiriladi.
              </p>
            </div>
          </div>
        )}

        {/* ── XAVFSIZLIK ── */}
        {activeTab === "xavfsizlik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚠️ Xavfsizlik — Ag₃N portlashi!</h2>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <p className="text-red-300 text-sm">
                <strong>⚠️ MUHIM OGOHLANTIRISH:</strong> Tollens reaktivi uzoq vaqt saqlansa,
                <strong> Ag₃N (kumush nitrid)</strong> hosil bo'ladi — bu modda juda portlovchi!
                Quruq holda zarba va ishqalanishdan portlashi mumkin.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xavfsizlik qoidalari:</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Reaktiv ishlatishdan oldin tayyorlanadi</li>
                <li>• Ishlatilgandan keyin darhol HNO₃ bilan neytrallanadi</li>
                <li>• Hech qachon uzoq vaqt saqlanmaydi</li>
                <li>• Quruq qoldiq qolishiga yo'l qo'yilmaydi</li>
              </ul>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(Ag−N) = 450 cm⁻¹</strong> — og'ir Ag atomi tufayli past chastota</li>
            <li><strong className="text-yellow-400">Chiziqli geometriya (D<sub>∞h</sub>)</strong> — sp-gibridlanish, N−Ag−N=180°</li>
            <li><strong className="text-yellow-400">K₂ &gt; K₁</strong> — ikkinchi NH₃ birikishi birinchisidan oson (nodir holat)</li>
            <li><strong className="text-yellow-400">Tollens reaktivi</strong> — aldegidlarni aniqlashda ishlatiladi</li>
            <li><strong className="text-red-400">⚠️ Ag₃N portlovchi!</strong> — ishlatilgandan keyin darhol zararsizlantiriladi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Cu(H₂O)₆]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-cl4" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all">
            [CoCl₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}