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
    [3600, 55, 40], [3400, 50, 35], [1620, 40, 25],
    [300, 25, 8], [278, 22, 7], [248, 28, 9]
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
      grad.addColorStop(0, `rgba(96,165,250,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(96,165,250,0.01)")
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
              <div className="h-full bg-blue-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-blue-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
export default function CoCl4_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3600, T: 42, label: "ν(O–H) erkin suv", color: "#f87171", desc: "O'rta — namunadagi namlik yoki kristallizatsion suv. Keng polosa — vodorod bog'lar mavjudligini ko'rsatadi." },
    { wn: 3400, T: 48, label: "ν(O–H) bog'langan", color: "#fb923c", desc: "O'rta — vodorod bog'lar orqali bog'langan suv molekulalari. Tetraedrik kompleks atrofida tartiblangan suv." },
    { wn: 1620, T: 58, label: "δ(H–O–H)", color: "#60a5fa", desc: "Zaif — suvning deformatsion tebranishi. Namunadagi namlikni ko'rsatadi." },
    { wn: 300, T: 72, label: "ν(Co–Cl) T₂", color: "#22d3ee", desc: "MUHIM — tetraedrik Co−Cl valent tebranishi (T₂ simmetriya). IQ va Raman faol! Oktaedrik komplekslardan farqli." },
    { wn: 278, T: 75, label: "ν(Co–Cl) A₁", color: "#fbbf24", desc: "MUHIM — simmetrik valent tebranish (A₁). Faqat Raman faol, IQ da kuchsiz ko'rinadi." },
    { wn: 248, T: 70, label: "δ(Cl–Co–Cl)", color: "#a78bfa", desc: "O'rta — tetraedrik skelet deformatsion tebranishi. Cl−Co−Cl burchagi 109.5°." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "tetraedrik",  label: "🔺 Tetraedrik geometriya" },
    { id: "rang",        label: "🎨 Ko'k ↔ Pushti rang" },
    { id: "indikator",   label: "💧 Namlik indikatori" },
    { id: "taqqos",      label: "⚖️ Boshqa Co²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">[CoCl₄]²⁻ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetraxlorokobaltat(II) ioni • Tetraedrik d⁷ kompleks • Tetrachlorocobaltate(II)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tetraedrik</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁷ (YS)</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">T<sub>d</sub></span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (n=3)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Inversiya markazi YO'Q</span>
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
            <strong className="text-yellow-400">ν(Co−Cl) = 300, 278 cm⁻¹</strong> — juda past chastotali 
            metall-ligand tebranishi. Og'ir Cl atomlari va tetraedrik geometriya tufayli.
            <strong className="text-yellow-400"> T<sub>d</sub> simmetriya — inversiya markazi YO'Q!</strong>
            Shuning uchun ayrim tebranishlar <strong>ham IQ, ham Raman faol</strong> — 
            alternativ taqiq amal qilmaydi. Bu tetraedrik komplekslarning asosiy diagnostik belgisi.
            <strong className="text-yellow-400"> Co²⁺ (d⁷, YS) — 3 ta toq elektron, μ≈4.5 μ<sub>B</sub>.</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Co²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d⁷ (YS)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tetraedrik (T<sub>d</sub>)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">4.3−4.8 μ<sub>B</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Co−Cl masofa</div>
              <div className="text-white font-bold">2.25 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Bog' burchagi</div>
              <div className="text-white font-bold">Cl−Co−Cl = 109.5°</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Gibridlanish</div>
              <div className="text-white font-bold">sp³</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Alternativ taqiq</div>
              <div className="text-white font-bold">YO'Q</div>
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [CoCl₄]²⁻</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#60a5fa" />
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
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Muhim xususiyat:</strong> ν(Co−Cl) juda past chastotada
                (300−250 cm⁻¹). Bu — uzoq IQ soha. Oddiy IQ spektrometrlar 400 cm⁻¹ gacha o'lchaydi,
                shuning uchun ν(Co−Cl) ni ko'rish uchun maxsus uzoq IQ qurilma kerak.
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
                  <th className="py-3 px-4 text-purple-300">Chastota</th><th className="py-3 px-4 text-purple-300">Tebranish</th><th className="py-3 px-4 text-purple-300">Intensivlik</th><th className="py-3 px-4 text-purple-300">Simmetriya</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4">{p.T < 25 ? <span className="text-red-400">Kuchli</span> : p.T < 55 ? <span className="text-yellow-400">O'rta</span> : <span className="text-green-400">Zaif</span>}</td>
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">
                        {i === 3 ? "T₂ (IQ+Raman)" : i === 4 ? "A₁ (Raman)" : i === 5 ? "T₂ (IQ+Raman)" : "—"}
                      </td>
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TETRAEDRIK ── */}
        {activeTab === "tetraedrik" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔺 Tetraedrik geometriya — T<sub>d</sub> simmetriya</h2>
            <p className="text-purple-200 leading-relaxed">
              [CoCl₄]²⁻ — <strong className="text-yellow-400">muntazam tetraedr</strong>.
              Co²⁺ markazda, 4 ta Cl⁻ ligand tetraedr uchlarida. T<sub>d</sub> nuqtali guruh — 24 ta simmetriya amali.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-400 font-bold mb-2">T<sub>d</sub> simmetriya</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya elementlari:</strong><br/>
                  • 4C₃ (Co−Cl orqali)<br/>
                  • 3S₄ (qirralar orqali)<br/>
                  • 6σ<sub>d</sub> (qirralar orqali)<br/>
                  <strong>Inversiya markazi:</strong> YO'Q!<br/>
                  <strong>Alternativ taqiq:</strong> Amal qilmaydi
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">IQ va Raman faollik</h3>
                <p className="text-purple-200 text-sm">
                  T<sub>d</sub> da T₂ tebranishlar <strong>ham IQ, ham Raman faol!</strong><br/>
                  A₁ — faqat Raman faol<br/>
                  E — faqat Raman faol<br/>
                  Bu — tetraedrik komplekslarni oktaedriklardan farqlashning asosiy usuli.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Ko'k ↔ Pushti rang o'zgarishi</h2>
            <p className="text-purple-200 leading-relaxed">
              [CoCl₄]²⁻ — <strong className="text-yellow-400">to'q ko'k rang</strong>. Suv qo'shilsa,
              <strong className="text-pink-400"> [Co(H₂O)₆]²⁺</strong> hosil bo'ladi — pushti rang.
              Bu rang o'zgarishi Co²⁺ komplekslari uchun xos.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-2">[CoCl₄]²⁻ (Ko'k)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Geometriya:</strong> Tetraedrik<br/>
                  <strong>λ<sub>max</sub>:</strong> 660 nm<br/>
                  <strong>ε:</strong> ~600 (Laport-ruxsat!)<br/>
                  <strong>Sabab:</strong> d-d o'tish, T<sub>d</sub> — intensiv
                </p>
              </div>
              <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
                <h3 className="text-pink-400 font-bold mb-2">[Co(H₂O)₆]²⁺ (Pushti)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Geometriya:</strong> Oktaedrik<br/>
                  <strong>λ<sub>max</sub>:</strong> 510 nm<br/>
                  <strong>ε:</strong> ~5 (Laport-taqiq!)<br/>
                  <strong>Sabab:</strong> d-d o'tish, O<sub>h</sub> — kuchsiz
                </p>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>IQ monitoring:</strong> Rang o'zgarishi bilan birga IQ spektri ham o'zgaradi.
                ν(Co−Cl) polosalari yo'qoladi, ν(Co−O) va ν(O−H) polosalari paydo bo'ladi.
              </p>
            </div>
          </div>
        )}

        {/* ── NAMLIK INDIKATORI ── */}
        {activeTab === "indikator" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💧 Namlik indikatori — amaliy qo'llanish</h2>
            <p className="text-purple-200 leading-relaxed">
              CoCl₂ singdirilgan silikagel — <strong className="text-yellow-400">klassik namlik indikatori</strong>.
              Quruq holda ko'k (tetraedrik [CoCl₄]²⁻), namlanganda pushti (oktaedrik [Co(H₂O)₆]²⁺).
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-2">Quruq holat</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Rang:</strong> Ko'k<br/>
                  <strong>Kompleks:</strong> [CoCl₄]²⁻<br/>
                  <strong>Geometriya:</strong> Tetraedrik<br/>
                  <strong>ν(Co−Cl):</strong> 300 cm⁻¹<br/>
                  <span className="text-green-400">Silikagel faol</span>
                </p>
              </div>
              <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
                <h3 className="text-pink-400 font-bold mb-2">Nam holat</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Rang:</strong> Pushti<br/>
                  <strong>Kompleks:</strong> [Co(H₂O)₆]²⁺<br/>
                  <strong>Geometriya:</strong> Oktaedrik<br/>
                  <strong>ν(Co−O):</strong> 490 cm⁻¹<br/>
                  <span className="text-red-400">Quritish kerak</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa Co²⁺ komplekslari bilan IQ taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ν(Co−L)</th><th className="py-3 px-4 text-purple-300">μ<sub>eff</sub></th><th className="py-3 px-4 text-purple-300">Rang</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[CoCl₄]²⁻", "Tetraedrik (T<sub>d</sub>)", "300, 278 cm⁻¹", "4.5 μ<sub>B</sub>", "Ko'k"],
                    ["[Co(H₂O)₆]²⁺", "Oktaedrik (O<sub>h</sub>)", "490 cm⁻¹", "4.7−5.2 μ<sub>B</sub>", "Pushti"],
                    ["[Co(NH₃)₆]²⁺", "Oktaedrik (O<sub>h</sub>)", "325 cm⁻¹", "4.7−5.2 μ<sub>B</sub>", "Pushti-qizil"],
                    ["[Co(CN)₆]⁴⁻", "Oktaedrik (O<sub>h</sub>)", "ν(C≡N): 2120", "1.8−2.2 μ<sub>B</sub>", "Och yashil"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 font-mono text-green-400">{r[2]}</td>
                      <td className="py-3 px-4">{r[3]}</td>
                      <td className="py-3 px-4">{r[4]}</td>
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
            <li><strong className="text-yellow-400">ν(Co−Cl) = 300, 278, 248 cm⁻¹</strong> — uzoq IQ sohada, og'ir Cl tufayli past</li>
            <li><strong className="text-yellow-400">T<sub>d</sub> simmetriya — inversiya markazi YO'Q</strong>, alternativ taqiq amal qilmaydi</li>
            <li><strong className="text-yellow-400">T₂ tebranishlar ham IQ, ham Raman faol</strong> — tetraedrik diagnostikasi</li>
            <li><strong className="text-yellow-400">Ko'k ↔ Pushti</strong> — suv ta'sirida rang o'zgarishi, namlik indikatori</li>
            <li><strong className="text-yellow-400">Co²⁺ (d⁷, YS) — 3 ta toq elektron, μ≈4.5 μ<sub>B</sub></strong></li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/ag-nh3-2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Ag(NH₃)₂]⁺
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/fe-co5" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [Fe(CO)₅] →
          </Link>
        </div>

      </section>
    </main>
  )
}