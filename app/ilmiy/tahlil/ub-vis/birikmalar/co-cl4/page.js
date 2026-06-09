"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI ────────────────────────────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#60a5fa" }) {
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

  const PAD = { l: 65, r: 30, t: 30, b: 55 }
  const W = 820, H = 340
  const plotW = W - PAD.l - PAD.r
  const plotH = H - PAD.t - PAD.b
  const nmToX = (nm) => PAD.l + ((nm - 400) / (1000 - 400)) * plotW
  const absToY = (abs) => PAD.t + ((0.8 - abs) / 0.8) * plotH

  function gauss(nm, nm0, height, width) {
    return height * Math.exp(-Math.pow((nm - nm0) / width, 2))
  }

  const peakDefs = [
    [660, 0.55, 60], [580, 0.35, 50], [530, 0.28, 45]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "rgba(255,255,255,0.03)"
    ctx.fillRect(nmToX(400), PAD.t, nmToX(800) - nmToX(400), plotH)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    ;[500,600,700,800,900].forEach(nm => {
      const x = nmToX(nm)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    })
    ;[0.2,0.4,0.6].forEach(a => {
      const y = absToY(a)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    ctx.strokeStyle = "#ff0"; ctx.lineWidth = 1; ctx.setLineDash([5, 5])
    ctx.beginPath(); ctx.moveTo(nmToX(400), PAD.t); ctx.lineTo(nmToX(400), PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(nmToX(800), PAD.t); ctx.lineTo(nmToX(800), PAD.t + plotH); ctx.stroke()
    ctx.setLineDash([])

    const maxNm = 400 + (1000 - 400) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.8
    ctx.shadowBlur = 6; ctx.shadowColor = lineColor

    let firstPoint = true
    for (let nm = 400; nm <= 1000; nm += 1) {
      if (nm > maxNm && animProgress < 1) continue
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
      const x = nmToX(nm), y = absToY(Math.min(0.6, absorb))
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath(); firstPoint = true
      for (let nm = 1000; nm >= 400; nm -= 1) {
        if (nm > maxNm && animProgress < 1) continue
        let absorb = 0
        peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
        const x = nmToX(nm), y = absToY(Math.min(0.6, absorb))
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(96,165,250,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(96,165,250,0.01)")
      ctx.fillStyle = grad; ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.6, absorb))
      
      const isHovered = hoveredPeak?.nm === p.nm
      const isSelected = selectedPeak?.nm === p.nm
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
      ctx.fillText(p.nm + " nm", x, y - lineHeight - 6)
    })

    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.6, absorb))
      ctx.fillStyle = "#0f0a1a"; ctx.strokeStyle = p.color; ctx.lineWidth = 1
      const tw = 170, th = 42
      const tx = Math.min(Math.max(x - tw/2, PAD.l + 5), PAD.l + plotW - tw - 5)
      const ty = y - 58
      ctx.beginPath(); ctx.roundRect(tx, ty, tw, th, 8); ctx.fill(); ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(`${p.nm} nm`, tx + tw/2, ty + 16)
      ctx.fillStyle = p.color; ctx.font = "9px sans-serif"
      ctx.fillText(p.label, tx + tw/2, ty + 30)
    }

    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[500,600,700,800,900].forEach(nm => ctx.fillText(nm, nmToX(nm), PAD.t + plotH + 18))
    ctx.textAlign = "right"
    ;[0.2,0.4,0.6].forEach(a => ctx.fillText(a.toFixed(1), PAD.l - 8, absToY(a) + 4))
    
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("To'lqin uzunligi (nm)", PAD.l + plotW / 2, H - 8)
    ctx.save(); ctx.translate(16, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("Absorbans (A)", 0, 0); ctx.restore()

    ctx.fillStyle = "#ff0"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
    const visX = nmToX(400) + (nmToX(800) - nmToX(400)) / 2
    ctx.fillText("Ko'rinadigan soha", visX, PAD.t - 8)
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
    const nm = 400 + ((mx - PAD.l) / plotW) * (1000 - 400)
    let closest = null, minDist = 30
    peaks.forEach(p => { const dist = Math.abs(p.nm - nm); if (dist < minDist) { minDist = dist; closest = p } })
    setHoveredPeak(closest)
  }

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={W} height={H}
        onMouseMove={handleMouseMove} onClick={() => { if (hoveredPeak) setSelectedPeak(selectedPeak?.nm === hoveredPeak.nm ? null : hoveredPeak) }}
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

      <p className="text-center text-purple-500 text-xs mt-2 italic">
        Grafik sxematik. T<sub>d</sub> simmetriya — Laport-RUXSAT! ε ≈ 600 — oktaedrikdan 100 marta kuchli.
      </p>

      {selectedPeak && (
        <div className="mt-3 bg-purple-800/30 border rounded-xl p-4" style={{ borderColor: selectedPeak.color + "40" }}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full" style={{ background: selectedPeak.color }} />
            <span className="font-mono font-bold text-lg" style={{ color: selectedPeak.color }}>{selectedPeak.nm} nm</span>
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
export default function CoCl4_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 660, label: "d-d (⁴A₂ → ⁴T₁(P))", color: "#60a5fa", desc: "ASOSIY d-d O'TISH. ε ≈ 600 L·mol⁻¹·cm⁻¹. Laport-RUXSAT (T<sub>d</sub> da inversiya markazi YO'Q!). Oktaedrik analogdan 100 marta kuchli!" },
    { nm: 580, label: "d-d (⁴A₂ → ⁴T₁(F))", color: "#a78bfa", desc: "Ikkinchi d-d o'tish. Tetraedrik maydonda 3 ta spin-ruxsat d-d o'tish kutiladi." },
    { nm: 530, label: "d-d (⁴A₂ → ⁴T₂)", color: "#fbbf24", desc: "Uchinchi d-d o'tish. Barcha d-d o'tishlar Laport-ruxsat etilgan!" },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "laport",    label: "📏 Laport-RUXSAT!" },
    { id: "rang",      label: "🎨 Ko'k ↔ Pushti" },
    { id: "taqqos",    label: "⚖️ O<sub>h</sub> vs T<sub>d</sub>" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🌈 [CoCl₄]²⁻ — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetraxlorokobaltat(II) ioni • Tetraedrik d⁷ • Laport-RUXSAT • ε≈600</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tetraedrik (T<sub>d</sub>)</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁷ (YS)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Laport-RUXSAT!</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">ε ≈ 600</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (n=3)</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [CoCl₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">200.75 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetraxlorokobaltat(II) ioni — <span className="text-blue-400 italic">Tetraedrik Co²⁺ kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>3 ta intensiv d-d polosa</strong> kuzatiladi.
            Asosiy polosa <strong className="text-yellow-400">660 nm, ε ≈ 600</strong> — bu oktaedrik [Co(H₂O)₆]²⁺ 
            (ε ≈ 5) dan <strong>100 marta kuchli!</strong> Sababi: T<sub>d</sub> simmetriyada 
            <strong className="text-yellow-400"> inversiya markazi YO'Q</strong> — Laport qoidasi d-d o'tishlarni 
            taqiqlamaydi. Co²⁺ (d⁷, YS) — <strong>3 ta toq elektron</strong>, paramagnit.
            <strong className="text-yellow-400"> To'q ko'k rang</strong> — sariq-qizil nurlarni kuchli yutadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub></div>
              <div className="text-white font-bold">660 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε</div>
              <div className="text-white font-bold">~600</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Δ<sub>t</sub></div>
              <div className="text-white font-bold">~3,300 cm⁻¹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-blue-400 font-bold">To'q ko'k</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tetraedrik</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">T<sub>d</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">4.3−4.8 μ<sub>B</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Inversiya markazi</div>
              <div className="text-white font-bold">YO'Q</div>
            </div>
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> Etanol yoki kons. HCl</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻³ M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm</span>
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

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [CoCl₄]²⁻</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#60a5fa" />
            <div className="flex flex-wrap gap-3">
              {peaks.map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
                  style={{ borderColor: p.color + "40", background: p.color + "10" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="font-mono" style={{ color: p.color }}>{p.nm} nm</span>
                  <span className="text-purple-400">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Polosalar jadvali</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">O'tish</th><th className="py-3 px-4 text-purple-300">ε</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["660", "⁴A₂ → ⁴T₁(P)", "~600", "Asosiy polosa. Laport-RUXSAT. To'q ko'k rangga sabab."],
                    ["580", "⁴A₂ → ⁴T₁(F)", "~400", "Ikkinchi d-d o'tish."],
                    ["530", "⁴A₂ → ⁴T₂", "~300", "Uchinchi d-d o'tish. Barchasi Laport-ruxsat!"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-sm">{r[1]}</td>
                      <td className="py-3 px-4 font-bold text-green-400">{r[2]}</td>
                      <td className="py-3 px-4 text-sm">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── LAPORT-RUXSAT ── */}
        {activeTab === "laport" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📏 Nega Laport-RUXSAT? — T<sub>d</sub> da inversiya markazi yo'q</h2>
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Laport qoidasi:</strong> g→g va u→u o'tishlar taqiqlangan, g→u ruxsat.
              Bu qoida faqat <strong>inversiya markazi bor</strong> molekulalarda amal qiladi.
              T<sub>d</sub> simmetriyada inversiya markazi <strong>YO'Q</strong> — g/u belgilari ma'noga ega emas!
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-2">Oktaedrik (O<sub>h</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Inversiya markazi:</strong> HA<br/>
                  <strong>Laport:</strong> g→g TA'QIQ<br/>
                  <strong>ε:</strong> ~5<br/>
                  <strong>Rang:</strong> Och pushti
                </p>
              </div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                <h3 className="text-green-400 font-bold mb-2">Tetraedrik (T<sub>d</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Inversiya markazi:</strong> YO'Q<br/>
                  <strong>Laport:</strong> TA'QIQ YO'Q<br/>
                  <strong>ε:</strong> ~600<br/>
                  <strong>Rang:</strong> To'q ko'k
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Ko'k ↔ Pushti — rang o'zgarishi</h2>
            <p className="text-purple-200 leading-relaxed">
              [CoCl₄]²⁻ + 6H₂O ⇌ [Co(H₂O)₆]²⁺ + 4Cl⁻ — <strong className="text-yellow-400">qaytar reaksiya</strong>.
              Suv qo'shilsa ko'k rang pushtiga o'tadi. HCl qo'shilsa (Le-Shatele) yana ko'k rang qaytadi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 text-center">
                <h3 className="text-blue-400 font-bold mb-2">[CoCl₄]²⁻ (Ko'k)</h3>
                <p className="text-purple-200 text-sm">λ<sub>max</sub>: 660 nm<br/>ε: 600<br/>T<sub>d</sub></p>
              </div>
              <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 text-center">
                <h3 className="text-pink-400 font-bold mb-2">[Co(H₂O)₆]²⁺ (Pushti)</h3>
                <p className="text-purple-200 text-sm">λ<sub>max</sub>: 510 nm<br/>ε: 5<br/>O<sub>h</sub></p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Oktaedrik vs Tetraedrik Co²⁺</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th><th className="py-3 px-4 text-purple-300">[Co(H₂O)₆]²⁺ (O<sub>h</sub>)</th><th className="py-3 px-4 text-purple-300">[CoCl₄]²⁻ (T<sub>d</sub>)</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["λ<sub>max</sub>", "510 nm", "660 nm"],
                    ["ε", "~5", "~600"],
                    ["Rang", "Pushti", "To'q ko'k"],
                    ["Laport", "TA'QIQ", "RUXSAT"],
                    ["Δ", "Δ<sub>o</sub>≈9,300 cm⁻¹", "Δ<sub>t</sub>≈3,300 cm⁻¹"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4 text-pink-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-blue-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
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
            <li><strong className="text-yellow-400">3 ta intensiv d-d polosa:</strong> 660, 580, 530 nm</li>
            <li><strong className="text-yellow-400">ε ≈ 600</strong> — Laport-RUXSAT (T<sub>d</sub> da inversiya markazi YO'Q)</li>
            <li><strong className="text-yellow-400">Oktaedrikdan 100 marta kuchli!</strong> (ε=600 vs ε=5)</li>
            <li><strong className="text-yellow-400">To'q ko'k rang</strong> — sariq-qizil nurlarni kuchli yutadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Cu(H₂O)₆]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/fe-co5" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [Fe(CO)₅] →
          </Link>
        </div>

      </section>
    </main>
  )
}