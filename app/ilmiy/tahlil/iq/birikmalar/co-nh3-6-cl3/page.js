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

  // [Co(NH₃)₆]Cl₃ uchun peak ma'lumotlari
  const peakDefs = [
    [3260, 85, 30], [3190, 80, 25], [1605, 60, 20],
    [1320, 55, 18], [830, 40, 15], [495, 28, 12], [330, 35, 14]
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
      if (isActive) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke() }

      ctx.fillStyle = p.color
      ctx.font = isActive ? "bold 11px monospace" : "bold 9px monospace"
      ctx.textAlign = "center"
      ctx.fillText(p.wn, x, y - lineHeight - 6)
    })

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[2000,1800,1500,1200,1000,800,600,400].forEach(wn => {
      ctx.fillText(wn, wnToX(wn), PAD.t + plotH + 18)
    })
    
    ctx.textAlign = "right"
    ;[20,40,60,80,100].forEach(t => {
      ctx.fillText(t + "%", PAD.l - 8, tToY(t) + 4)
    })

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
export default function CoNH36Cl3_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3260, T: 12, label: "ν(N–H) asimmetrik", color: "#f87171", desc: "Kuchli va keng — NH₃ ligandining asimmetrik valent tebranishi. Vodorod bog'lar tufayli past chastotaga siljigan." },
    { wn: 3190, T: 18, label: "ν(N–H) simmetrik", color: "#fb923c", desc: "Kuchli — simmetrik valent tebranish. Asimmetrikdan biroz past chastotada." },
    { wn: 1605, T: 35, label: "δ(H–N–H) degenerate", color: "#60a5fa", desc: "O'rta — NH₃ ligandining degenerat deformatsion tebranishi. Oktaedrik simmetriya." },
    { wn: 1320, T: 42, label: "δ(H–N–H) simmetrik", color: "#22d3ee", desc: "O'rta — simmetrik deformatsion tebranish. Xarakterli NH₃ signali." },
    { wn: 830, T: 55, label: "ρ(NH₃) rocking", color: "#fbbf24", desc: "O'rta — NH₃ ligandining tebranma (rocking) harakati. Koordinatsiyalangan ammiakka xos." },
    { wn: 495, T: 68, label: "ν(Co–N)", color: "#a78bfa", desc: "Muhim — metall-ligand valent tebranishi. Co³⁺−N bog'i mustahkamligini ko'rsatadi. Co³⁺ (d⁶, QS) — kuchli bog'." },
    { wn: 330, T: 62, label: "δ(N–Co–N)", color: "#86efac", desc: "O'rta — oktaedrik skelet deformatsion tebranishi. O<sub>h</sub> simmetriya." },
  ]

  const tabs = [
    { id: "spektr",   label: "📈 IQ Spektri" },
    { id: "jadval",   label: "📊 Cho'qqilar jadvali" },
    { id: "guruh",    label: "🔬 Guruh nazariyasi" },
    { id: "taqqos",   label: "⚖️ [Co(NH₃)₆]²⁺ bilan taqqoslash" },
    { id: "inert",    label: "🐢 Kinetik inertlik" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">[Co(NH₃)₆]Cl₃ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaamminkobalt(III) xlorid • Verner klassikasi • Hexaamminecobalt(III) chloride</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁶ quyi spin</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Kinetik inert</span>
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
            <strong className="text-yellow-400">IQ spektri</strong> — koordinatsion kimyoning eng muhim 
            tarixiy birikmasi. <strong className="text-yellow-400">ν(Co−N) = 495 cm⁻¹</strong> — 
            Co³⁺ (d⁶, quyi spin) kuchli maydoni tufayli mustahkam metall-ligand bog'i.
            <strong className="text-yellow-400"> ν(N−H) = 3260, 3190 cm⁻¹</strong> — 
            koordinatsiyalangan NH₃ uchun xos chastotalar.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co³⁺</div>
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
                  ? "bg-orange-600/40 text-white border border-orange-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Co(NH₃)₆]Cl₃</h2>
            
            <IQSpektrGrafik peaks={peaks} lineColor="#fb923c" />

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

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Xarakterli xususiyat:</strong> Co³⁺ (d⁶, quyi spin) — 
                t₂g⁶ eg⁰, barcha elektronlar juftlashgan. KMBE = −2.4Δ<sub>o</sub> — maksimal barqarorlik.
                ν(Co−N) = 495 cm⁻¹ — yuqori chastota kuchli bog'ni ko'rsatadi.
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
                    <th className="py-3 px-4 text-purple-300">Tebranish turi</th>
                    <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                    <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
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
            <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili — O<sub>h</sub> simmetriya</h2>
            
            <p className="text-purple-200 leading-relaxed">
              [Co(NH₃)₆]³⁺ ioni <strong className="text-yellow-400">O<sub>h</sub> nuqtali guruhga</strong> tegishli.
              Co³⁺ markazida joylashgan, 6 ta NH₃ ligandlari oktaedr uchlarida.
            </p>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">NH₃ ligandining ichki tebranishlari</h3>
              <p className="text-purple-200 text-sm">
                Erkin NH₃ molekulasi C<sub>3v</sub> simmetriyaga ega. Koordinatsiyalanganda simmetriya pasayadi, 
                lekin asosiy tebranish chastotalari saqlanadi:<br/>
                • ν(N−H): 3400−3200 cm⁻¹ (2 ta polosa — simmetrik va asimmetrik)<br/>
                • δ(H−N−H): 1650−1300 cm⁻¹ (2 ta polosa)<br/>
                • ρ(NH₃): 850−800 cm⁻¹ (rocking)
              </p>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <p className="text-orange-300 text-sm">
                <strong>Eslatma:</strong> O<sub>h</sub> simmetriyada inversiya markazi mavjud — 
                <strong> alternativ taqiq</strong> amal qiladi. IQ va Raman spektrlarida bir xil chastotalar kuzatilmaydi.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ [Co(NH₃)₆]³⁺ vs [Co(NH₃)₆]²⁺ — IQ taqqoslash</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Co³⁺ va Co²⁺ ammiak komplekslarining IQ spektrlari metall-ligand bog'i mustahkamligi farqini aks ettiradi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Parametr</th>
                    <th className="py-3 px-4 text-purple-300">[Co(NH₃)₆]³⁺</th>
                    <th className="py-3 px-4 text-purple-300">[Co(NH₃)₆]²⁺</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Oksidlanish darajasi", "Co³⁺ (d⁶)", "Co²⁺ (d⁷)"],
                    ["Spin holati", "Quyi spin (diamagnit)", "Yuqori spin (paramagnit)"],
                    ["ν(Co−N)", "495 cm⁻¹", "325 cm⁻¹"],
                    ["Bog' mustahkamligi", "Kuchli", "Zaifroq"],
                    ["KMBE", "−2.4Δ<sub>o</sub>", "−0.8Δ<sub>o</sub>"],
                    ["Rangi", "Zarg'aldoq-sariq", "Pushti-qizil"],
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

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 text-sm">
                <strong>Xulosa:</strong> Co³⁺ da zaryad yuqori, ion radiusi kichik — kuchliroq bog'. 
                ν(Co−N) farqi <strong>170 cm⁻¹</strong> — bu juda katta farq!
              </p>
            </div>
          </div>
        )}

        {/* ── KINETIK INERTLIK ── */}
        {activeTab === "inert" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🐢 Kinetik inertlik va IQ bog'liqlik</h2>
            
            <p className="text-purple-200 leading-relaxed">
              [Co(NH₃)₆]³⁺ — <strong className="text-yellow-400">eng inert komplekslardan biri</strong>.
              IQ spektridagi yuqori ν(Co−N) chastotasi kuchli bog'ni ko'rsatadi — bu inertlikning 
              bevosita sababi. Bog' qancha mustahkam bo'lsa, ligand almashinuvi shuncha sekin boradi.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
                <h3 className="text-orange-400 font-bold mb-3">[Co(NH₃)₆]³⁺</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Co³⁺, d⁶ (QS)</strong><br/>
                  ν(Co−N) = 495 cm⁻¹<br/>
                  KMBE = −2.4Δ<sub>o</sub><br/>
                  t<sub>½</sub> &gt; bir necha kun<br/>
                  <span className="text-red-400">JUDA INERT</span>
                </p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-3">[Co(NH₃)₆]²⁺</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Co²⁺, d⁷ (YS)</strong><br/>
                  ν(Co−N) = 325 cm⁻¹<br/>
                  KMBE = −0.8Δ<sub>o</sub><br/>
                  t<sub>½</sub> &lt; 1 soniya<br/>
                  <span className="text-green-400">LABIL</span>
                </p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">IQ va inertlik korrelyatsiyasi</h3>
              <p className="text-purple-200 text-sm">
                ν(M−L) chastotasi qancha yuqori bo'lsa, bog' shuncha mustahkam — ligand almashinuvi 
                shuncha sekin. IQ spektroskopiya <strong>inertlikni bashorat qilish</strong> imkonini beradi!
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(Co−N) = 495 cm⁻¹</strong> — kuchli metall-ligand bog'i</li>
            <li>Co³⁺ (d⁶, QS) — <strong>KMBE = −2.4Δ<sub>o</sub></strong>, maksimal barqarorlik</li>
            <li>NH₃ ligandiga xos <strong>ν(N−H) 3260, 3190 cm⁻¹</strong> va δ(H−N−H) 1605, 1320 cm⁻¹</li>
            <li>Co²⁺ analogiga nisbatan ν(Co−N) <strong>170 cm⁻¹ yuqori</strong> — oksidlanish darajasi ta'siri</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/k4-fe-cn6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← K₄[Fe(CN)₆]
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/sisplatin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Sisplatin →
          </Link>
        </div>

      </section>
    </main>
  )
}