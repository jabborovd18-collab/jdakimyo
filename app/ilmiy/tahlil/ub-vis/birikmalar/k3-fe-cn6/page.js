"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI (Canvas + Animatsiya) ──────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#f87171" }) {
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
    [420, 0.88, 38], [305, 0.45, 25], [260, 0.62, 20], [225, 0.92, 22]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    // Ko'rinadigan soha belgisi
    ctx.fillStyle = "rgba(255,255,255,0.03)"
    ctx.fillRect(nmToX(400), PAD.t, nmToX(800) - nmToX(400), plotH)

    // Grid
    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    ;[300,400,500,600,700].forEach(nm => {
      const x = nmToX(nm)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    })
    ;[0.2,0.4,0.6,0.8].forEach(a => {
      const y = absToY(a)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    // Ko'rinadigan soha chegarasi
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
      const x = nmToX(nm), y = absToY(Math.min(0.96, absorb))
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
        const x = nmToX(nm), y = absToY(Math.min(0.96, absorb))
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(248,113,113,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(248,113,113,0.01)")
      ctx.fillStyle = grad; ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.96, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.96, absorb))
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
    
    // O'q nomlari
    ctx.fillStyle = "#9a8abf"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("To'lqin uzunligi (nm)", PAD.l + plotW / 2, H - 8)
    ctx.save(); ctx.translate(16, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("Absorbans (A)", 0, 0); ctx.restore()

    // Ko'rinadigan soha belgisi
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
              <div className="h-full bg-red-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-red-400 font-mono">{Math.round(animProgress * 100)}%</span>
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

// ── RANG G'ILDIRAGI ──────────────────────────────────────────────────────────
function RangGildiragi({ yutilganNm }) {
  const ranglar = [
    { nm: 400, rang: "Binafsha", hex: "#9b59b6", komplement: "Sariq-yashil", hexK: "#a8e600" },
    { nm: 450, rang: "Ko'k", hex: "#3498db", komplement: "To'q sariq", hexK: "#e67e22" },
    { nm: 500, rang: "Yashil-ko'k", hex: "#1abc9c", komplement: "Qizil", hexK: "#e74c3c" },
    { nm: 550, rang: "Sariq-yashil", hex: "#a8e600", komplement: "Binafsha", hexK: "#9b59b6" },
    { nm: 600, rang: "To'q sariq", hex: "#e67e22", komplement: "Ko'k", hexK: "#3498db" },
    { nm: 700, rang: "Qizil", hex: "#e74c3c", komplement: "Yashil-ko'k", hexK: "#1abc9c" },
  ]
  
  const engYaqin = ranglar.reduce((prev, curr) => 
    Math.abs(curr.nm - yutilganNm) < Math.abs(prev.nm - yutilganNm) ? curr : prev
  )

  return (
    <div className="flex items-center gap-4 p-5 bg-purple-800/30 rounded-xl border border-purple-700/30">
      <div className="flex-1 text-center">
        <div className="text-purple-400 text-xs mb-2">Kuchli yutilish sohasi</div>
        <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white/20" style={{ background: engYaqin.hex }} />
        <div className="text-white font-bold text-sm">~{yutilganNm} nm</div>
        <div className="text-purple-400 text-xs">{engYaqin.rang}</div>
      </div>
      <div className="text-2xl text-purple-400">→</div>
      <div className="flex-1 text-center">
        <div className="text-purple-400 text-xs mb-2">Ko'rinadigan rang</div>
        <div className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-white/20" style={{ background: engYaqin.hexK }} />
        <div className="text-white font-bold text-sm">{engYaqin.komplement}</div>
        <div className="text-purple-400 text-xs">komplementar</div>
      </div>
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
        <div className="text-purple-400 text-xs mt-1">d⁵(QS): RUXSAT</div>
      </div>
      <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 text-center">
        <div className="text-orange-400 font-bold text-sm mb-1">Laporte qoidasi</div>
        <div className="text-purple-200 text-xs">g→g TA'QIQ</div>
        <div className="text-purple-400 text-xs mt-1">O<sub>h</sub>: d-d TA'QIQ</div>
      </div>
      <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
        <div className="text-green-400 font-bold text-sm mb-1">CT o'tishlar</div>
        <div className="text-purple-200 text-xs">g→u RUXSAT</div>
        <div className="text-purple-400 text-xs mt-1">LMCT: ε katta!</div>
      </div>
    </div>
  )
}
// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K3FeCN6_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 420, label: "LMCT (π CN⁻ → Fe³⁺ t₂g)", color: "#f87171", desc: "ASOSIY POLOSA. Liganddan metallga zaryad ko'chishi: CN⁻ π orbitallaridan Fe³⁺ ning yarim bo'sh t₂g orbitallariga. ε ≈ 1000 L·mol⁻¹·cm⁻¹. Laporte va spin ruxsat etilgan. Eritma rangining asosiy sababi." },
    { nm: 305, label: "LMCT (σ CN⁻ → Fe³⁺)", color: "#fb923c", desc: "Ikkinchi LMCT polosa. CN⁻ σ orbitallaridan Fe³⁺ t₂g orbitallariga. O'rtacha intensivlik, UB sohada." },
    { nm: 260, label: "π→π* (CN⁻ ichki)", color: "#60a5fa", desc: "Ligand ichidagi o'tish. CN⁻ ning π→π* o'tishi. UB sohada, ko'rinadigan rangga ta'sir qilmaydi." },
    { nm: 225, label: "Chuqur UB — CT/ligand", color: "#a78bfa", desc: "Chuqur UB soha — ligand/charge-transfer xarakterli o'tishlar. Aniq tayinlash manbaga bog'liq. Ko'rinadigan sohadan ancha uzoqda." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "qoidalar",  label: "📏 Tanlash qoidalari" },
    { id: "lmct",      label: "⚡ LMCT mexanizmi" },
    { id: "energetika", label: "💎 Energetik diagramma" },
    { id: "taqqos",    label: "⚖️ Sariq qon tuzi bilan" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🌈 K₃[Fe(CN)₆] — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(III) • Qizil qon tuzi • LMCT dominant • ε≈1000</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik O<sub>h</sub></span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁵ quyi spin (t₂g⁵)</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">LMCT dominant</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">ε ≈ 1000</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">d-d Laporte-taqiq</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              K₃[Fe(CN)₆]
            </h2>
            <span className="text-purple-400 text-lg">329.24 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            kaliy geksasiyanoferrat(III) — <span className="text-red-400 italic">"Qizil qon tuzi"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da 420 nm atrofidagi kuchli polosa 
            <strong className="text-yellow-400"> LMCT (Ligand→Metal Charge Transfer)</strong> xarakteriga ega:
            CN⁻ π orbitallaridan Fe³⁺ t₂g orbitallariga zaryad ko'chishi. Bu o'tish 
            <strong className="text-yellow-400"> Laporte va spin ruxsat etilgan</strong> — ε ≈ 1000 L·mol⁻¹·cm⁻¹.
            d⁵ quyi spin (t₂g⁵) konfiguratsiyada d-d o'tishlar <strong>spin-ruxsat etilgan</strong> (doublet→doublet), 
            lekin <strong className="text-yellow-400">Laporte-taqiqlangan</strong> (O<sub>h</sub> simmetriya, g→g) 
            va juda kuchsiz — spektrda deyarli ko'rinmaydi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (asosiy)</div>
              <div className="text-white font-bold">420 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε</div>
              <div className="text-white font-bold">~1000</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">O'tish turi</div>
              <div className="text-white font-bold">LMCT</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Eritma rangi</div>
              <div className="text-white font-bold">Sariq-qizg'ish</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Kristall rangi</div>
              <div className="text-red-400 font-bold">To'q qizil</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-d o'tish</div>
              <div className="text-white font-bold">Laporte-taqiq</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">t₂g⁵ eg⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">2.20 μ<sub>B</sub></div>
            </div>
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> H₂O (distillangan)</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻⁴ M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm kvars</span>
            <span><strong className="text-purple-300">Harorat:</strong> 25°C</span>
            <span><strong className="text-purple-300">Eslatma:</strong> Yangi tayyorlangan eritma, yorug'likdan himoya qilingan</span>
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
                  ? "bg-red-600/40 text-white border border-red-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — K₃[Fe(CN)₆]</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#f87171" />
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
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eng muhim xususiyat:</strong> 420 nm dagi kuchli LMCT polosa.
                d-d o'tishlar mavjud (spin-ruxsat etilgan), lekin Laporte-taqiqlangani uchun juda kuchsiz —
                spektrda deyarli ko'rinmaydi. Ko'rinadigan soha sariq chiziqlar bilan belgilangan (400−800 nm).
              </p>
            </div>
            <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-3 text-center">
              <p className="text-purple-500 text-xs italic">
                ⚠️ Grafik sxematik ko'rinish bo'lib, haqiqiy eksperimental spektrni to'liq aks ettirmaydi.
                Eksperimental spektrlar konsentratsiya, erituvchi va pH ga bog'liq holda o'zgarishi mumkin.
              </p>
            </div>
          </div>
        )}

        {/* ── JADVAL ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Polosalar jadvali va tahlili</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">To'lqin soni (cm⁻¹)</th><th className="py-3 px-4 text-purple-300">O'tish turi</th><th className="py-3 px-4 text-purple-300">Intensivlik</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["420", "23,810", "LMCT (π CN⁻ → Fe³⁺ t₂g)", "Juda kuchli", "Asosiy polosa. Laporte+spin ruxsat. Eritma rangini belgilaydi."],
                    ["305", "32,790", "LMCT (σ CN⁻ → Fe³⁺)", "O'rtacha", "Ikkinchi LMCT. UB sohada."],
                    ["260", "38,460", "π→π* (CN⁻ ichki)", "O'rtacha", "Ligand ichidagi o'tish. Ko'rinadigan rangga ta'sir qilmaydi."],
                    ["225", "44,440", "Chuqur UB — CT/ligand", "Kuchli", "Aniq tayinlash manbaga bog'liq. Ko'rinadigan sohadan uzoqda."],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">{r[1]}</td>
                      <td className="py-3 px-4 text-sm">{r[2]}</td>
                      <td className="py-3 px-4">{i === 0 ? <span className="text-red-400 font-bold">Juda kuchli</span> : <span className="text-yellow-400">O'rtacha</span>}</td>
                      <td className="py-3 px-4 text-sm">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eslatma:</strong> d-d o'tishlar (²T₂g → ²T₁g, ²T₂g → ²T₂u) 
                nazariy jihatdan mavjud, lekin juda kuchsiz (ε &lt; 1) va keng LMCT polosalari ostida ko'rinmaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Rang sababi — LMCT hisobiga</h2>
            <p className="text-purple-200 leading-relaxed">
              Ferrisiyanid 420 nm atrofida <strong className="text-yellow-400">binafsha-ko'k sohaga yaqin nurni 
              kuchli yutadi</strong>. Komplementar rang — sariq-to'q sariq. 
              <strong className="text-yellow-400">Eritma ko'rinishi sariq-qizg'ish</strong> tuslarda namoyon bo'ladi.
              Qattiq kristall holatda konsentratsiya yuqori bo'lgani uchun <strong>to'q qizil</strong> ko'rinadi.
              Ko'rinadigan rang bitta λ<sub>max</sub> emas, balki butun spektr, konsentratsiya, qatlam qalinligi 
              va moddaning holatiga bog'liq.
            </p>
            <RangGildiragi yutilganNm={420} />
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>Boshqa Fe³⁺ komplekslaridan farqi:</strong> [Fe(H₂O)₆]³⁺ (d⁵, YS) — 
                spin-taqiqlangan d-d o'tishlar tufayli juda och sariq rang (ε &lt; 1).
                K₃[Fe(CN)₆] da CN⁻ kuchli maydoni t₂g⁵ konfiguratsiyani barqarorlashtiradi — 
                LMCT o'tish ko'rinadigan sohaga tushadi va kuchli yutilish beradi.
              </p>
            </div>
          </div>
        )}

        {/* ── TANLASH QOIDALARI ── */}
        {activeTab === "qoidalar" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📏 Tanlash qoidalari — K₃[Fe(CN)₆] uchun</h2>
            <SelectionRules />
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-green-400 font-bold text-lg">✓</span>
                <div>
                  <p className="text-white font-semibold">LMCT: CN⁻(π) → Fe³⁺(t₂g)</p>
                  <p className="text-purple-300 text-sm">Spin ruxsat (ΔS=0) + Laporte ruxsat (u→g) → ε ≈ 1000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 font-bold text-lg">✗</span>
                <div>
                  <p className="text-white font-semibold">d-d: ²T₂g → ²T₁g, ²T₂u</p>
                  <p className="text-purple-300 text-sm">Spin ruxsat (ΔS=0, doublet→doublet), lekin Laporte TA'QIQ (g→g) → ε &lt; 1, deyarli ko'rinmaydi</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 text-sm">
                <strong>Muhim tuzatma:</strong> d⁵ quyi spin (t₂g⁵) da d-d o'tishlar <strong>spin-taqiqlangan EMAS</strong>
                (bu high-spin d⁵ uchun xos). Low-spin d⁵ da asosiy holat ²T₂g (doublet) — 
                doublet→doublet o'tishlar spin-ruxsat etilgan. Kuchsizligining asosiy sababi — 
                <strong>Laporte taqiqi</strong> (O<sub>h</sub> simmetriyada g→g o'tishlar taqiqlangan).
              </p>
            </div>
          </div>
        )}

        {/* ── LMCT MEXANIZMI ── */}
        {activeTab === "lmct" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ LMCT — Liganddan Metallga Zaryad Ko'chishi</h2>
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">LMCT (Ligand to Metal Charge Transfer)</strong> — 
              elektron ligandning to'lgan orbitallaridan metallning bo'sh yoki yarim to'lgan d-orbitallariga o'tadi.
              Laporte (u→g) va spin qoidalari bilan <strong>ruxsat etilgan</strong> — ε juda katta (10³−10⁵).
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-lg">CN⁻ (π, to'lgan) → Fe³⁺ (t₂g⁵, 1 ta "teshik")</p>
              <p className="text-purple-300 text-sm mt-2">
                t₂g⁵ konfiguratsiya — t₂g orbitallarda 5 ta elektron, 1 ta bo'sh o'rin ("teshik") mavjud.
                CN⁻ ning π elektronlari aynan shu bo'sh o'ringa o'tadi.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="text-green-400 font-bold mb-1">Laporte</div>
                <div className="text-purple-200">CN⁻ π (u) → Fe³⁺ d (g)</div>
                <div className="text-green-400 text-xs mt-1">RUXSAT ✓</div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="text-green-400 font-bold mb-1">Spin</div>
                <div className="text-purple-200">ΔS = 0</div>
                <div className="text-green-400 text-xs mt-1">RUXSAT ✓</div>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="text-green-400 font-bold mb-1">Orbital qoplashish</div>
                <div className="text-purple-200">CN⁻ π ↔ Fe t₂g</div>
                <div className="text-green-400 text-xs mt-1">Yaxshi ✓</div>
              </div>
            </div>
          </div>
        )}

        {/* ── ENERGETIK DIAGRAMMA ── */}
        {activeTab === "energetika" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💎 Energetik diagramma — d⁵ quyi spin</h2>
            <p className="text-purple-200 leading-relaxed">
              Fe³⁺ erkin ioni (d⁵) — <strong className="text-yellow-400">²D asosiy term</strong> (L=2, S=½).
              Oktaedrik maydonda (O<sub>h</sub>) asosiy holat <strong>²T₂g</strong>.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Soddalashtirilgan energetik sathlar:</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 w-24">↑ Energiya</span>
                  <span className="text-red-400">— LMCT holatlar (CN⁻ π → Fe³⁺)</span>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-yellow-400">— ²T₂u (d-d, Laporte-taqiq)</span>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-yellow-400">— ²T₁g (d-d, Laporte-taqiq)</span>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <span className="text-green-400 font-bold">— ²T₂g (ASOSIY HOLAT, t₂g⁵)</span>
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
                • <span className="text-red-400">LMCT:</span> CN⁻ π → Fe³⁺ t₂g (kuchli, ~420 nm, ε≈1000)<br/>
                • <span className="text-yellow-400">d-d:</span> ²T₂g → ²T₁g, ²T₂u (kuchsiz, Laporte-taqiq, ε&lt;1)<br/>
                • <span className="text-blue-400">CN⁻ ichki:</span> π→π* (UB, ~260 nm)
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Qizil vs Sariq qon tuzi — UB-Vis taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th><th className="py-3 px-4 text-purple-300">K₃[Fe(CN)₆]</th><th className="py-3 px-4 text-purple-300">K₄[Fe(CN)₆]</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Metall", "Fe³⁺ (d⁵, QS)", "Fe²⁺ (d⁶, QS)"],
                    ["Konfiguratsiya", "t₂g⁵ eg⁰", "t₂g⁶ eg⁰"],
                    ["Dominant o'tish", "LMCT", "MLCT"],
                    ["λ<sub>max</sub>", "420 nm", "~320 nm (UB)"],
                    ["ε", "~1000", "~500"],
                    ["Eritma rangi", "Sariq-qizg'ish", "Sariq"],
                    ["Kristall rangi", "To'q qizil", "Sariq"],
                    ["d-d o'tish", "Laporte-taqiq (kuchsiz)", "d⁶ QS — barcha orbitallar to'lgan"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4 text-red-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-yellow-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>Asosiy farq:</strong> Fe³⁺ da t₂g da 1 ta "teshik" bor — LMCT uchun ideal.
                Fe²⁺ da t₂g to'liq to'lgan — LMCT yo'q, faqat MLCT (Fe→CN⁻ π*). 
                Bu farq ularning rangini belgilaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">LMCT dominant:</strong> CN⁻(π) → Fe³⁺(t₂g), λ=420 nm, ε≈1000</li>
            <li><strong className="text-yellow-400">d⁵ quyi spin (²T₂g):</strong> d-d o'tishlar spin-ruxsat, lekin <strong>Laporte-taqiqlangan</strong></li>
            <li><strong className="text-yellow-400">Eritma rangi:</strong> sariq-qizg'ish. Kristall: to'q qizil. Rang konsentratsiyaga bog'liq</li>
            <li>Sariq qon tuzidan farqi — LMCT vs MLCT, t₂g⁵ vs t₂g⁶</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro'yxati
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/k4-fe-cn6" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            K₄[Fe(CN)₆] →
          </Link>
        </div>

      </section>
    </main>
  )
}