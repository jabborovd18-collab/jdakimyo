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
  const absToY = (abs) => PAD.t + ((1.0 - abs) / 1.0) * plotH

  function gauss(nm, nm0, height, width) {
    return height * Math.exp(-Math.pow((nm - nm0) / width, 2))
  }

  const peakDefs = [
    [475, 0.22, 30], [340, 0.18, 25], [260, 0.55, 22]
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
    ;[0.05,0.10,0.15,0.20].forEach(a => {
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
      const x = nmToX(nm), y = absToY(Math.min(0.25, absorb))
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
        const x = nmToX(nm), y = absToY(Math.min(0.25, absorb))
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.25, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.25, absorb))
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
    ;[0.05,0.10,0.15,0.20].forEach(a => ctx.fillText(a.toFixed(2), PAD.l - 8, absToY(a) + 4))
    
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
        Grafik sxematik ko'rinish bo'lib, haqiqiy eksperimental spektrni to'liq aks ettirmaydi. d-d o'tishlar Laporte-taqiqlangan — ε kichik (~50−80).
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
export default function CoNH36Cl3_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 475, label: "¹A₁g → ¹T₁g (d-d)", color: "#f87171", desc: "ASOSIY d-d O'TISH. ε ≈ 80 L·mol⁻¹·cm⁻¹. Laporte-taqiqlangan (g→g). Ko'rinadigan sohada — sariq rangga sabab." },
    { nm: 340, label: "¹A₁g → ¹T₂g (d-d)", color: "#60a5fa", desc: "Ikkinchi d-d o'tish. ε ≈ 60 L·mol⁻¹·cm⁻¹. UB soha chegarasida. Laporte-taqiqlangan." },
    { nm: 260, label: "CT/ligand o'tish", color: "#a78bfa", desc: "UB soha — charge-transfer va ligand ichidagi o'tishlar. Ko'rinadigan rangga ta'sir qilmaydi." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "deltao",    label: "🔢 Δo hisoblash" },
    { id: "energetika",label: "💎 Energetik diagramma" },
    { id: "taqqos",    label: "⚖️ [Co(NH₃)₆]²⁺ bilan" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🌈 [Co(NH₃)₆]Cl₃ — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaamminkobalt(III) xlorid • Verner klassikasi • d⁶ quyi spin • d-d o'tishlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik O<sub>h</sub></span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">d-d o'tishlar</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Δo = 23,000 cm⁻¹</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Co(NH₃)₆]Cl₃
            </h2>
            <span className="text-purple-400 text-lg">267.48 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaamminkobalt(III) xlorid — <span className="text-orange-400 italic">"Verner klassikasi"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>ikkita d-d o'tish</strong> kuzatiladi:
            <strong className="text-yellow-400"> ¹A₁g → ¹T₁g (~475 nm, ε≈80)</strong> va 
            <strong className="text-yellow-400"> ¹A₁g → ¹T₂g (~340 nm, ε≈60)</strong>.
            Co³⁺ (d⁶, quyi spin, t₂g⁶ eg⁰) — barcha t₂g orbitallar to'lgan.
            NH₃ kuchli maydonli ligand — <strong className="text-yellow-400">Δo ≈ 23,000 cm⁻¹</strong>.
            Ikkala o'tish ham <strong>Laporte-taqiqlangan</strong> (O<sub>h</sub>, g→g) — ε kichik.
            Spektr ko'rinadigan sohada — shuning uchun <strong>zarg'aldoq-sariq rang</strong>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (ν₁)</div>
              <div className="text-white font-bold">~475 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (ν₂)</div>
              <div className="text-white font-bold">~340 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Δo</div>
              <div className="text-white font-bold">23,000 cm⁻¹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-orange-400 font-bold">Zarg'aldoq-sariq</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε (ν₁)</div>
              <div className="text-white font-bold">~80</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">t₂g⁶ eg⁰</div>
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

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> H₂O</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻³ M</span>
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [Co(NH₃)₆]Cl₃</h2>
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
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eng muhim xususiyat:</strong> Ikkita kuchsiz d-d polosa (ε≈60−80).
                Laporte-taqiqlangan (O<sub>h</sub> simmetriya, g→g). Qizil qon tuzidan farqli — bu yerda CT emas, 
                <strong>sof d-d o'tishlar</strong> ko'rinadi.
              </p>
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
                  <th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">To'lqin soni</th><th className="py-3 px-4 text-purple-300">O'tish</th><th className="py-3 px-4 text-purple-300">ε</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["475", "21,050 cm⁻¹", "¹A₁g → ¹T₁g", "~80", "Asosiy d-d o'tish. Ko'rinadigan sohada. Zarg'aldoq-sariq rangga sabab."],
                    ["340", "29,410 cm⁻¹", "¹A₁g → ¹T₂g", "~60", "Ikkinchi d-d o'tish. UB chegarasida."],
                    ["260", "38,460 cm⁻¹", "CT/ligand", "~500", "UB soha. Ko'rinadigan rangga ta'sir qilmaydi."],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">{r[1]}</td>
                      <td className="py-3 px-4 text-sm">{r[2]}</td>
                      <td className="py-3 px-4 font-bold text-green-400">{r[3]}</td>
                      <td className="py-3 px-4 text-sm">{r[4]}</td>
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
            <h2 className="text-xl font-bold text-white">🎨 Nega zarg'aldoq-sariq rang?</h2>
            <p className="text-purple-200 leading-relaxed">
              [Co(NH₃)₆]³⁺ <strong className="text-yellow-400">ko'k-binafsha nurni yutadi</strong> (~475 nm).
              Komplementar rang — <strong className="text-orange-400">sariq-to'q sariq</strong>.
              Ikkinchi o'tish (~340 nm) UB sohaga yaqin — ko'rinadigan rangga kam ta'sir qiladi.
              d-d o'tishlar Laporte-taqiqlangan — ε kichik, rang och.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Nima uchun ε kichik?</h3>
              <p className="text-purple-200 text-sm">
                O<sub>h</sub> simmetriya — inversiya markazi mavjud. Laporte qoidasi: g→g o'tishlar taqiqlangan.
                d-d o'tishlar (t₂g→eg) — ikkala orbital ham g-simmetriyali. Shuning uchun ε ≈ 50−80.
                Taqqoslash: tetraedrik [CoCl₄]²⁻ da inversiya markazi yo'q — ε ≈ 600!
              </p>
            </div>
          </div>
        )}

        {/* ── Δo HISOBLASH ── */}
        {activeTab === "deltao" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔢 Δo hisoblash</h2>
            <p className="text-purple-200 leading-relaxed">
              d⁶ quyi spin konfiguratsiyada <strong className="text-yellow-400">Δo ni bevosita spektrdan hisoblash 
              qiyinroq</strong>, chunki asosiy holat ¹A₁g — d-d o'tish energiyasi elektronlararo itarilishga ham bog'liq.
              Ammo Tanabe-Sugano diagrammasi yordamida Δo ≈ 23,000 cm⁻¹ topilgan.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-purple-400 text-sm mb-2">ν₁ = ¹A₁g → ¹T₁g</div>
                <div className="text-yellow-400 font-bold text-xl">21,050 cm⁻¹</div>
                <div className="text-purple-400 text-xs">475 nm</div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-purple-400 text-sm mb-2">ν₂ = ¹A₁g → ¹T₂g</div>
                <div className="text-blue-400 font-bold text-xl">29,410 cm⁻¹</div>
                <div className="text-purple-400 text-xs">340 nm</div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-purple-400 text-sm mb-2">Δo (Tanabe-Sugano)</div>
                <div className="text-green-400 font-bold text-xl">23,000 cm⁻¹</div>
                <div className="text-purple-400 text-xs">~435 nm</div>
              </div>
            </div>
          </div>
        )}

        {/* ── ENERGETIK DIAGRAMMA ── */}
        {activeTab === "energetika" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💎 Energetik diagramma — d⁶ quyi spin</h2>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-3"><span className="text-purple-400 w-24">↑ Energiya</span><span className="text-red-400">— ¹T₂g (340 nm)</span></div>
                <div className="flex items-center gap-3 ml-6"><span className="text-red-400">— ¹T₁g (475 nm)</span></div>
                <div className="flex items-center gap-3 ml-6"><span className="text-green-400 font-bold">— ¹A₁g (ASOSIY HOLAT, t₂g⁶)</span></div>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>Spin-ruxsat o'tishlar:</strong> ¹A₁g → ¹T₁g (ν₁), ¹A₁g → ¹T₂g (ν₂).<br/>
                <strong>Spin-taqiqlangan:</strong> ¹A₁g → ³T₁g, ³T₂g — juda kuchsiz, ko'rinmaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ [Co(NH₃)₆]³⁺ vs [Co(NH₃)₆]²⁺</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th><th className="py-3 px-4 text-purple-300">[Co(NH₃)₆]³⁺</th><th className="py-3 px-4 text-purple-300">[Co(NH₃)₆]²⁺</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Oksidlanish darajasi", "Co³⁺ (d⁶)", "Co²⁺ (d⁷)"],
                    ["Spin holati", "Quyi spin (S=0)", "Yuqori spin (S=3/2)"],
                    ["Konfiguratsiya", "t₂g⁶ eg⁰", "t₂g⁵ eg²"],
                    ["λ<sub>max</sub>", "475, 340 nm", "~500 nm (keng)"],
                    ["Δo", "23,000 cm⁻¹", "~10,000 cm⁻¹"],
                    ["ε", "~80 (Laporte-taqiq)", "~5−10 (Laporte-taqiq)"],
                    ["Rang", "Zarg'aldoq-sariq", "Pushti-qizil"],
                    ["Magnit", "Diamagnit", "Paramagnit (μ≈5.0)"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-orange-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-purple-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Ikkita d-d o'tish:</strong> ¹A₁g→¹T₁g (475 nm), ¹A₁g→¹T₂g (340 nm)</li>
            <li><strong className="text-yellow-400">Δo ≈ 23,000 cm⁻¹</strong> — NH₃ kuchli maydonli ligand</li>
            <li><strong className="text-yellow-400">Laporte-taqiqlangan:</strong> ε ≈ 50−80 — och rang</li>
            <li>Co²⁺ analogidan farqi — quyi spin, katta Δo, boshqa rang</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← K₄[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/sisplatin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Sisplatin →
          </Link>
        </div>

      </section>
    </main>
  )
}