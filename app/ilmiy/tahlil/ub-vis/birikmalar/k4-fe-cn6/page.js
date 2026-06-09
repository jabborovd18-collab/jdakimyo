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
    [320, 0.78, 30], [265, 0.55, 22], [218, 0.85, 20]
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
    ;[0.2,0.4,0.6,0.8].forEach(a => {
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
      const x = nmToX(nm), y = absToY(Math.min(0.92, absorb))
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
        const x = nmToX(nm), y = absToY(Math.min(0.92, absorb))
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(251,191,36,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,191,36,0.01)")
      ctx.fillStyle = grad; ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.92, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.92, absorb))
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
    ;[0.2,0.4,0.6,0.8].forEach(a => ctx.fillText(a.toFixed(1), PAD.l - 8, absToY(a) + 4))
    
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
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      <p className="text-center text-purple-500 text-xs mt-2 italic">
        Grafik sxematik ko'rinish bo'lib, haqiqiy eksperimental spektrni to'liq aks ettirmaydi.
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

// ── TANLASH QOIDALARI MINI-KARTA ─────────────────────────────────────────────
function SelectionRules() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 text-center">
        <div className="text-red-400 font-bold text-sm mb-1">Spin qoidasi</div>
        <div className="text-purple-200 text-xs">ΔS = 0</div>
        <div className="text-purple-400 text-xs mt-1">d⁶(QS): RUXSAT</div>
      </div>
      <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 text-center">
        <div className="text-orange-400 font-bold text-sm mb-1">Laporte qoidasi</div>
        <div className="text-purple-200 text-xs">g→g TA'QIQ</div>
        <div className="text-purple-400 text-xs mt-1">d-d: TA'QIQ</div>
      </div>
      <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="text-green-400 font-bold text-sm mb-1">CT o'tishlar</div>
        <div className="text-purple-200 text-xs">g→u RUXSAT</div>
        <div className="text-purple-400 text-xs mt-1">MLCT: ε o'rtacha</div>
      </div>
    </div>
  )
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K4FeCN6_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 320, label: "MLCT (Fe²⁺ → CN⁻ π*)", color: "#fbbf24", desc: "ASOSIY POLOSA. Metalldan ligandga zaryad ko'chishi: Fe²⁺ t₂g orbitallaridan CN⁻ bo'sh π* orbitallariga. ε ≈ 500 L·mol⁻¹·cm⁻¹. UB sohada — ko'rinadigan rangga kam ta'sir qiladi." },
    { nm: 265, label: "π→π* (CN⁻ ichki)", color: "#60a5fa", desc: "Ligand ichidagi o'tish. CN⁻ ning π→π* o'tishi. UB sohada." },
    { nm: 218, label: "Chuqur UB — CT/ligand", color: "#a78bfa", desc: "Chuqur UB soha — charge-transfer va ligand ichidagi o'tishlar. Aniq tayinlash manbaga bog'liq." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "qoidalar",  label: "📏 Tanlash qoidalari" },
    { id: "mlct",      label: "⚡ MLCT mexanizmi" },
    { id: "energetika",label: "💎 Energetik diagramma" },
    { id: "taqqos",    label: "⚖️ Qizil qon tuzi bilan" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🌈 K₄[Fe(CN)₆] — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(II) • Sariq qon tuzi • MLCT dominant • ε≈500</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik O<sub>h</sub></span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin (t₂g⁶)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">MLCT dominant</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">ε ≈ 500</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d-d yo'q (t₂g⁶ to'lgan)</span>
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
            <strong className="text-yellow-400">UB-Vis spektri</strong>da asosiy yutilish <strong>UB sohada</strong> 
            (~320 nm) joylashgan. Bu <strong className="text-yellow-400">MLCT (Metal→Ligand Charge Transfer)</strong> 
            o'tish: Fe²⁺ t₂g⁶ orbitallaridan CN⁻ bo'sh π* orbitallariga.
            <strong className="text-yellow-400"> d⁶ quyi spin (t₂g⁶ eg⁰)</strong> — barcha t₂g orbitallar to'lgan,
            d-d o'tishlar uchun bo'sh joy yo'q. Shuning uchun <strong>ko'rinadigan sohada yutilish deyarli yo'q</strong> —
            eritma och sariq rangda. Qizil qon tuzidan farqli o'laroq, bu yerda LMCT emas, MLCT dominant.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (asosiy)</div>
              <div className="text-white font-bold">~320 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε</div>
              <div className="text-white font-bold">~500</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">O'tish turi</div>
              <div className="text-white font-bold">MLCT</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Eritma rangi</div>
              <div className="text-yellow-400 font-bold">Och sariq</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-d o'tish</div>
              <div className="text-white font-bold">Yo'q (t₂g⁶ to'lgan)</div>
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — K₄[Fe(CN)₆]</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#fbbf24" />
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
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eng muhim xususiyat:</strong> Asosiy yutilish UB sohada (~320 nm).
                Ko'rinadigan sohada (400−800 nm) yutilish juda kuchsiz — shuning uchun eritma och sariq rangda.
                Qizil qon tuzidan asosiy farq — MLCT vs LMCT.
              </p>
            </div>
            <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-3 text-center">
              <p className="text-purple-500 text-xs italic">
                ⚠️ Grafik sxematik ko'rinish bo'lib, haqiqiy eksperimental spektrni to'liq aks ettirmaydi.
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
                  <th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">To'lqin soni</th><th className="py-3 px-4 text-purple-300">O'tish turi</th><th className="py-3 px-4 text-purple-300">Intensivlik</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["320", "31,250 cm⁻¹", "MLCT (Fe²⁺→CN⁻)", "Kuchli", "Asosiy polosa. UB sohada. Ko'rinadigan rangga kam ta'sir."],
                    ["265", "37,740 cm⁻¹", "π→π* (CN⁻ ichki)", "O'rtacha", "Ligand ichidagi o'tish."],
                    ["218", "45,870 cm⁻¹", "Chuqur UB — CT/ligand", "Kuchli", "Aniq tayinlash manbaga bog'liq."],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">{r[1]}</td>
                      <td className="py-3 px-4 text-sm">{r[2]}</td>
                      <td className="py-3 px-4">{i === 0 ? <span className="text-yellow-400 font-bold">Kuchli</span> : <span className="text-purple-400">O'rtacha</span>}</td>
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
            <h2 className="text-xl font-bold text-white">🎨 Nega och sariq rang?</h2>
            <p className="text-purple-200 leading-relaxed">
              K₄[Fe(CN)₆] ning <strong className="text-yellow-400">asosiy yutilishi UB sohada</strong> (~320 nm).
              Ko'rinadigan sohaga (400−800 nm) deyarli tushmaydi. Shuning uchun eritma 
              <strong className="text-yellow-400"> och sariq</strong> rangda ko'rinadi.
              d⁶ quyi spin (t₂g⁶) — barcha t₂g orbitallar to'lgan, d-d o'tishlar uchun bo'sh joy yo'q.
              Qizil qon tuzidan farqi — bu yerda <strong>MLCT dominant</strong>, LMCT emas.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Nima uchun d-d o'tishlar yo'q?</h3>
              <p className="text-purple-200 text-sm">
                t₂g⁶ eg⁰ — t₂g orbitallar to'liq to'lgan (6 ta elektron), eg orbitallar bo'sh.
                d-d o'tish uchun elektron t₂g dan eg ga o'tishi kerak — bu energetik jihatdan imkonli,
                lekin <strong>eg orbitallar yuqori energiyada</strong> va o'tish UB sohaga tushadi.
                Ko'rinadigan sohada kuzatilmaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── TANLASH QOIDALARI ── */}
        {activeTab === "qoidalar" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📏 Tanlash qoidalari — K₄[Fe(CN)₆] uchun</h2>
            <SelectionRules />
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✓</span>
                <div>
                  <p className="text-white font-semibold">MLCT: Fe²⁺(t₂g) → CN⁻(π*)</p>
                  <p className="text-purple-300 text-sm">Spin ruxsat (ΔS=0) + Laporte ruxsat (g→u) → ε ≈ 500</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-lg">✗</span>
                <div>
                  <p className="text-white font-semibold">d-d: t₂g⁶ → eg⁰ (¹A₁g → ¹T₁g, ¹T₂g)</p>
                  <p className="text-purple-300 text-sm">Spin ruxsat (ΔS=0), lekin Laporte TA'QIQ (g→g) + yuqori energiya (UB soha)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MLCT MEXANIZMI ── */}
        {activeTab === "mlct" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ MLCT — Metalldan Ligandga Zaryad Ko'chishi</h2>
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">MLCT (Metal to Ligand Charge Transfer)</strong> — 
              elektron metallning to'lgan d-orbitallaridan ligandning bo'sh π* orbitallariga o'tadi.
              K₄[Fe(CN)₆] da Fe²⁺ t₂g⁶ orbitallaridan CN⁻ π* orbitallariga.
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-lg">Fe²⁺ (t₂g⁶, to'lgan) → CN⁻ (π*, bo'sh)</p>
              <p className="text-purple-300 text-sm mt-2">
                t₂g⁶ konfiguratsiya — boy elektron manba. CN⁻ kuchli π-akseptor — bo'sh π* orbitallari mavjud.
                MLCT o'tish UB sohada (~320 nm) kuchli yutilish beradi.
              </p>
            </div>
          </div>
        )}

        {/* ── ENERGETIK DIAGRAMMA ── */}
        {activeTab === "energetika" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💎 Energetik diagramma — d⁶ quyi spin</h2>
            <p className="text-purple-200 leading-relaxed">
              Fe²⁺ erkin ioni (d⁶) — <strong className="text-yellow-400">¹A₁g asosiy holat</strong>.
              Oktaedrik maydonda (O<sub>h</sub>) barcha t₂g orbitallar to'lgan, eg orbitallar bo'sh.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Soddalashtirilgan energetik sathlar:</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 w-24">↑ Energiya</span>
                  <span className="text-yellow-400">— CN⁻ π* orbitallari (bo'sh) ← MLCT</span>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-red-400">— eg⁰ (bo'sh) ← d-d UB sohada</span>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-green-400 font-bold">— t₂g⁶ (to'lgan) ASOSIY HOLAT</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400">↓</span>
                  <span className="text-purple-500">CN⁻ π orbitallari (to'lgan)</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>O'tishlar:</strong><br/>
                • <span className="text-yellow-400">MLCT:</span> Fe²⁺ t₂g → CN⁻ π* (~320 nm, ε≈500)<br/>
                • <span className="text-red-400">d-d:</span> t₂g⁶ → eg⁰ (UB soha, Laporte-taqiq)<br/>
                • <span className="text-blue-400">CN⁻ ichki:</span> π→π* (~265 nm)
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Sariq vs Qizil qon tuzi — UB-Vis taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th><th className="py-3 px-4 text-purple-300">K₄[Fe(CN)₆] (Sariq)</th><th className="py-3 px-4 text-purple-300">K₃[Fe(CN)₆] (Qizil)</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Metall", "Fe²⁺ (d⁶, QS)", "Fe³⁺ (d⁵, QS)"],
                    ["Konfiguratsiya", "t₂g⁶ eg⁰", "t₂g⁵ eg⁰"],
                    ["Dominant o'tish", "MLCT (Fe→CN⁻)", "LMCT (CN⁻→Fe)"],
                    ["λ<sub>max</sub>", "~320 nm (UB)", "420 nm (ko'rinadigan)"],
                    ["ε", "~500", "~1000"],
                    ["Eritma rangi", "Och sariq", "Sariq-qizg'ish"],
                    ["d-d o'tish", "UB sohada (Laporte-taqiq)", "Laporte-taqiq (juda kuchsiz)"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4 text-yellow-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-red-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
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
            <li><strong className="text-yellow-400">MLCT dominant:</strong> Fe²⁺(t₂g⁶) → CN⁻(π*), λ≈320 nm, ε≈500</li>
            <li><strong className="text-yellow-400">d⁶ quyi spin (¹A₁g):</strong> t₂g⁶ to'lgan — d-d o'tishlar faqat UB sohada</li>
            <li><strong className="text-yellow-400">Och sariq rang</strong> — asosiy yutilish ko'rinadigan sohadan tashqarida</li>
            <li>Qizil qon tuzidan asosiy farq — MLCT vs LMCT, t₂g⁶ vs t₂g⁵</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/k3-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← K₃[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-nh3-6-cl3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Co(NH₃)₆]Cl₃ →
          </Link>
        </div>

      </section>
    </main>
  )
}