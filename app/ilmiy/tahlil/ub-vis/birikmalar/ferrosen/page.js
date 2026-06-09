"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI ────────────────────────────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#fb923c" }) {
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
  const nmToX = (nm) => PAD.l + ((nm - 200) / (800 - 200)) * plotW
  const absToY = (abs) => PAD.t + ((0.5 - abs) / 0.5) * plotH

  function gauss(nm, nm0, height, width) {
    return height * Math.exp(-Math.pow((nm - nm0) / width, 2))
  }

  const peakDefs = [
    [440, 0.22, 25], [325, 0.38, 22], [265, 0.42, 20]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "rgba(255,255,255,0.03)"
    ctx.fillRect(nmToX(400), PAD.t, nmToX(800) - nmToX(400), plotH)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    ;[300,400,500,600,700].forEach(nm => {
      const x = nmToX(nm)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    })
    ;[0.1,0.2,0.3,0.4].forEach(a => {
      const y = absToY(a)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    ctx.strokeStyle = "#ff0"; ctx.lineWidth = 1; ctx.setLineDash([5, 5])
    ctx.beginPath(); ctx.moveTo(nmToX(400), PAD.t); ctx.lineTo(nmToX(400), PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(nmToX(800), PAD.t); ctx.lineTo(nmToX(800), PAD.t + plotH); ctx.stroke()
    ctx.setLineDash([])

    const maxNm = 200 + (800 - 200) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.8
    ctx.shadowBlur = 6; ctx.shadowColor = lineColor

    let firstPoint = true
    for (let nm = 200; nm <= 800; nm += 1) {
      if (nm > maxNm && animProgress < 1) continue
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
      const x = nmToX(nm), y = absToY(Math.min(0.45, absorb))
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath(); firstPoint = true
      for (let nm = 800; nm >= 200; nm -= 1) {
        if (nm > maxNm && animProgress < 1) continue
        let absorb = 0
        peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
        const x = nmToX(nm), y = absToY(Math.min(0.45, absorb))
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(251,146,60,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,146,60,0.01)")
      ctx.fillStyle = grad; ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.45, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.45, absorb))
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
    ;[300,400,500,600,700].forEach(nm => ctx.fillText(nm, nmToX(nm), PAD.t + plotH + 18))
    ctx.textAlign = "right"
    ;[0.1,0.2,0.3,0.4].forEach(a => ctx.fillText(a.toFixed(1), PAD.l - 8, absToY(a) + 4))
    
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
    const nm = 200 + ((mx - PAD.l) / plotW) * (800 - 200)
    let closest = null, minDist = 25
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
              <div className="h-full bg-orange-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-orange-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      <p className="text-center text-purple-500 text-xs mt-2 italic">
        Grafik sxematik ko'rinish. d-d o'tishlar (440 nm) va MLCT (325 nm) ko'rsatilgan.
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
export default function Ferrosen_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 440, label: "d-d (¹A₁g → ¹E₁g)", color: "#f87171", desc: "d-d o'tish. ε ≈ 90 L·mol⁻¹·cm⁻¹. Ko'rinadigan sohada — to'q sariq rangga hissa qo'shadi. Laporte-taqiqlangan (D₅d simmetriya)." },
    { nm: 325, label: "MLCT (Fe→Cp π*)", color: "#fb923c", desc: "Metalldan ligandga zaryad ko'chishi. Fe²⁺ d-orbitallaridan Cp halqasi π* orbitallariga. ε ≈ 50. UB sohada." },
    { nm: 265, label: "π→π* (Cp ichki)", color: "#60a5fa", desc: "Siklopentadienil halqasi ichidagi π→π* o'tish. UB sohada." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "electron18",label: "⚡ 18-elektron qoidasi" },
    { id: "oksidlanish",label: "🔄 Ferrosen → Ferroseniy" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🌈 [Fe(C₅H₅)₂] — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">ferrosen • bis(siklopentadienil)temir(II) • Sendvich kompleks • d-d + MLCT</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Sendvich (D<sub>5d</sub>)</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁶</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">18 e⁻</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">d-d + MLCT</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Fe(C₅H₅)₂]
            </h2>
            <span className="text-purple-400 text-lg">186.04 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            bis(η⁵-siklopentadienil)temir(II) — <span className="text-orange-400 italic font-bold">"FERROSEN"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>ikkita asosiy polosa</strong> kuzatiladi:
            <strong className="text-yellow-400"> 440 nm (d-d, ε≈90)</strong> — ko'rinadigan sohada, to'q sariq rangga sabab;
            <strong className="text-yellow-400"> 325 nm (MLCT, ε≈50)</strong> — Fe²⁺ dan Cp halqasiga zaryad ko'chishi.
            Fe²⁺ (d⁶) + 2Cp⁻ (12e⁻) = <strong className="text-yellow-400">18 valent elektron</strong> — maksimal barqarorlik.
            Oksidlanganda ferroseniy [Fe(C₅H₅)₂]⁺ hosil bo'ladi — spektr o'zgaradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (d-d)</div>
              <div className="text-white font-bold">440 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (MLCT)</div>
              <div className="text-white font-bold">325 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε (d-d)</div>
              <div className="text-white font-bold">~90</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-orange-400 font-bold">To'q sariq</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Valent e⁻</div>
              <div className="text-white font-bold">18 ta</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Fe−C masofa</div>
              <div className="text-white font-bold">2.04 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Oksidlanish</div>
              <div className="text-white font-bold">E° = +0.40 V</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">d⁶ (18e⁻)</div>
            </div>
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> Etanol yoki geksan</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻⁴ M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm kvars</span>
            <span><strong className="text-purple-300">Harorat:</strong> 25°C</span>
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
                  ? "bg-orange-600/40 text-white border border-orange-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — Ferrosen</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#fb923c" />
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
                    ["440", "d-d (¹A₁g → ¹E₁g)", "~90", "Ko'rinadigan sohada. To'q sariq rangga asosiy hissa."],
                    ["325", "MLCT (Fe→Cp π*)", "~50", "UB sohada. Fe²⁺ dan Cp ga zaryad ko'chishi."],
                    ["265", "π→π* (Cp ichki)", "~200", "UB sohada. Cp halqasi ichidagi o'tish."],
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

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Nega to'q sariq rang?</h2>
            <p className="text-purple-200 leading-relaxed">
              Ferrosen <strong className="text-yellow-400">ko'k-binafsha nurni yutadi</strong> (~440 nm).
              Komplementar rang — <strong className="text-orange-400">to'q sariq</strong>.
              d-d o'tish Laporte-taqiqlangan (D₅d da inversiya markazi bor), lekin ε ≈ 90 —
              vibronik bog'lanish tufayli qisman ruxsat etilgan.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Konsentratsiyaga bog'liqlik</h3>
              <p className="text-purple-200 text-sm">
                Suyultirilgan eritmalarda ferrosen <strong>och sariq</strong>, konsentrlangan eritmalarda 
                <strong> to'q sariq</strong> rangda ko'rinadi. Bu — Beer-Lambert qonuniga muvofiq.
              </p>
            </div>
          </div>
        )}

        {/* ── 18-ELEKTRON QOIDASI ── */}
        {activeTab === "electron18" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ 18-elektron qoidasi — barqarorlik siri</h2>
            <p className="text-purple-200 leading-relaxed">
              Ferrosen — <strong className="text-yellow-400">18-elektron qoidasining klassik namunasi</strong>.
              Fe²⁺ (d⁶) — 6 ta d-elektron. Har bir Cp⁻ — 6 ta π-elektron (η⁵). Jami: 18 ta valent elektron!
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-2xl">Fe²⁺ (d⁶) + 2 × Cp⁻ (6e⁻) = 18 valent elektron</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>UB-Vis bilan bog'liqlik:</strong> 18-elektron konfiguratsiya tufayli barcha bog'lovchi MO lar to'lgan,
                antibog'lovchilar bo'sh. Bu barqarorlik spektrda aniq, o'tkir polosalar ko'rinishida aks etadi.
              </p>
            </div>
          </div>
        )}

        {/* ── OKSIDLANISH ── */}
        {activeTab === "oksidlanish" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Ferrosen → Ferroseniy — UB-Vis o'zgarishi</h2>
            <p className="text-purple-200 leading-relaxed">
              Ferrosen oson va qaytar oksidlanadi: <strong className="text-yellow-400">[Fe(C₅H₅)₂] → [Fe(C₅H₅)₂]⁺ + e⁻</strong> (E° = +0.40 V).
              Oksidlanish natijasida 18e⁻ → 17e⁻ — spektr o'zgaradi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
                <h3 className="text-orange-400 font-bold mb-3">Ferrosen (Fe²⁺)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Rangi:</strong> To'q sariq<br/>
                  <strong>λ<sub>max</sub>:</strong> 440 nm<br/>
                  <strong>ε:</strong> ~90<br/>
                  <strong>Valent e⁻:</strong> 18
                </p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-3">Ferroseniy (Fe³⁺)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Rangi:</strong> Ko'k-yashil<br/>
                  <strong>λ<sub>max</sub>:</strong> ~620 nm (yangi polosa!)<br/>
                  <strong>ε:</strong> ~300<br/>
                  <strong>Valent e⁻:</strong> 17
                </p>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-200 text-sm">
                <strong>UB-Vis o'zgarish sababi:</strong> Oksidlanish bilan Fe³⁺ (d⁵) hosil bo'ladi.
                Yangi LMCT polosa (~620 nm) paydo bo'ladi — bu ferroseniyning ko'k-yashil rangini beradi.
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">d-d (440 nm, ε≈90)</strong> + <strong className="text-yellow-400">MLCT (325 nm, ε≈50)</strong></li>
            <li><strong className="text-yellow-400">18-elektron qoidasi</strong> — maksimal barqarorlik, aniq spektr</li>
            <li><strong className="text-yellow-400">To'q sariq rang</strong> — ko'k-binafsha nur yutilishi hisobiga</li>
            <li><strong className="text-yellow-400">Oksidlanish:</strong> Ferrosen→Ferroseniy — yangi LMCT polosa (620 nm)</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/sisplatin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Sisplatin
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ni-cn4" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            [Ni(CN)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}