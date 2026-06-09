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
    [3450, 75, 50], [3300, 70, 45], [1650, 50, 25],
    [950, 40, 18], [880, 38, 16], [480, 30, 12], [420, 28, 10]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
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
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.8
    ctx.shadowBlur = 6; ctx.shadowColor = lineColor

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
    ctx.stroke(); ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath(); firstPoint = true
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
      grad.addColorStop(0, `rgba(134,239,172,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(134,239,172,0.01)")
      ctx.fillStyle = grad; ctx.fill()
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
export default function ZnOH4_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3450, T: 22, label: "ν(O–H) asimmetrik", color: "#f87171", desc: "Kuchli va keng — gidrokso ligandining asimmetrik valent tebranishi. Kuchli vodorod bog'lar tufayli past chastotaga siljigan va kengaygan." },
    { wn: 3300, T: 28, label: "ν(O–H) simmetrik", color: "#fb923c", desc: "Kuchli — simmetrik valent tebranish. Tetraedrik geometriyada barcha OH⁻ ligandlari ekvivalent." },
    { wn: 1650, T: 48, label: "δ(H–O–H) namlik", color: "#60a5fa", desc: "Zaif — namunadagi namlik yoki erkin suv molekulalari. Kristallizatsion suvga xos." },
    { wn: 950, T: 55, label: "δ(Zn–O–H) bukilish", color: "#22d3ee", desc: "O'rta — Zn−O−H burchagining deformatsion tebranishi. Metall-ligand bog'i mavjudligini ko'rsatadi." },
    { wn: 880, T: 58, label: "ρ(OH) rocking", color: "#fbbf24", desc: "O'rta — gidrokso ligandining tebranma harakati. Tetraedrik Zn markazi atrofida." },
    { wn: 480, T: 65, label: "ν(Zn–O) T₂", color: "#a78bfa", desc: "MUHIM — Zn−O valent tebranishi (T₂ simmetriya). IQ va Raman faol! T<sub>d</sub> simmetriya." },
    { wn: 420, T: 68, label: "δ(O–Zn–O)", color: "#86efac", desc: "O'rta — tetraedrik skelet deformatsion tebranishi. O−Zn−O burchagi 109.5°." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "amfoter",     label: "🔄 Amfoterlik" },
    { id: "ph",          label: "⚖️ pH ta'siri" },
    { id: "taqqos",      label: "📊 Boshqa Zn komplekslari" },
    { id: "sanoat",      label: "🏭 Sanoatda qo'llanish" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">[Zn(OH)₄]²⁻ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetragidroksosinkat(II) ioni • Amfoter kompleks • Tetrahydroxozincate(II)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tetraedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d¹⁰</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KMBE=0</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Amfoter</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Zn(OH)₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">133.41 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetragidroksosinkat(II) ioni — <span className="text-green-400 italic">d¹⁰ amfoter kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">ν(Zn−O) = 480, 420 cm⁻¹</strong> — 
            og'ir Zn atomi tufayli past chastotali metall-ligand tebranishi.
            <strong className="text-yellow-400"> Zn²⁺ (d¹⁰) — KMBE=0</strong>, barcha d-orbitallar to'lgan.
            Geometriya faqat sterik omillar bilan belgilanadi — <strong>tetraedrik (T<sub>d</sub>)</strong>.
            <strong className="text-yellow-400"> Amfoterlik:</strong> Zn(OH)₂ + 2OH⁻ ⇌ [Zn(OH)₄]²⁻.
            IQ spektroskopiya bu qaytar reaksiyani kuzatish imkonini beradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Zn²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d¹⁰</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tetraedrik (T<sub>d</sub>)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Zn−O masofa</div>
              <div className="text-white font-bold">~1.97 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Bog' burchagi</div>
              <div className="text-white font-bold">O−Zn−O = 109.5°</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Gibridlanish</div>
              <div className="text-white font-bold">sp³</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">log β₄</div>
              <div className="text-white font-bold">≈15.5</div>
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

        {/* ── SPEKTR ── */}
        {activeTab === "spektr" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Zn(OH)₄]²⁻</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#86efac" />
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

        {/* ── JADVAL ── */}
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

        {/* ── AMFOTERLIK ── */}
        {activeTab === "amfoter" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Amfoterlik — IQ monitoring</h2>
            <p className="text-purple-200 leading-relaxed">
              Zn(OH)₂ — <strong className="text-yellow-400">amfoter gidroksid</strong>.
              Ham kislotalarda, ham ishqoriylarda eriydi. IQ spektroskopiya bu jarayonni kuzatish imkonini beradi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-2">Kislotali muhitda</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O</strong><br/>
                  ν(Zn−O) yo'qoladi<br/>
                  [Zn(H₂O)₆]²⁺ hosil bo'ladi<br/>
                  <span className="text-purple-400">Zn²⁺ eritmaga o'tadi</span>
                </p>
              </div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                <h3 className="text-green-400 font-bold mb-2">Ishqoriy muhitda</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻</strong><br/>
                  ν(Zn−O) 480 cm⁻¹ paydo bo'ladi<br/>
                  ν(O−H) intensivligi ortadi<br/>
                  <span className="text-purple-400">Rux eritmaga o'tadi</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── pH ── */}
        {activeTab === "ph" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ pH ta'siri — IQ spektridagi o'zgarishlar</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">pH</th><th className="py-3 px-4 text-purple-300">Dominant tur</th><th className="py-3 px-4 text-purple-300">ν(Zn−O)</th><th className="py-3 px-4 text-purple-300">Holat</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["&lt; 5", "Zn²⁺ (akva)", "~400 cm⁻¹ (Zn−OH₂)", "Eritma"],
                    ["5−8", "Zn(OH)₂↓", "— (cho'kma)", "Oq cho'kma"],
                    ["8−12", "Zn(OH)₂ + [Zn(OH)₄]²⁻", "480 cm⁻¹ (kuchsiz)", "Qisman erigan"],
                    ["&gt; 12", "[Zn(OH)₄]²⁻", "480 cm⁻¹ (kuchli)", "To'liq erigan"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }} />
                      <td className="py-3 px-4">{r[1]}</td>
                      <td className="py-3 px-4 font-mono text-green-400">{r[2]}</td>
                      <td className="py-3 px-4 text-sm">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Boshqa Zn²⁺ komplekslari bilan IQ taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ν(Zn−L)</th><th className="py-3 px-4 text-purple-300">Rangi</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Zn(OH)₄]²⁻", "Tetraedrik", "480 cm⁻¹", "Rangsiz"],
                    ["[Zn(H₂O)₆]²⁺", "Oktaedrik", "~400 cm⁻¹", "Rangsiz"],
                    ["[Zn(NH₃)₄]²⁺", "Tetraedrik", "~420 cm⁻¹", "Rangsiz"],
                    ["[ZnCl₄]²⁻", "Tetraedrik", "~280 cm⁻¹", "Rangsiz"],
                    ["[Zn(CN)₄]²⁻", "Tetraedrik", "~460 cm⁻¹", "Rangsiz"],
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
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>Barcha Zn²⁺ komplekslari rangsiz</strong> — d¹⁰ konfiguratsiya, d-d o'tishlar yo'q.
                IQ spektroskopiya ularni farqlashning eng ishonchli usuli.
              </p>
            </div>
          </div>
        )}

        {/* ── SANOAT ── */}
        {activeTab === "sanoat" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🏭 Sanoatda qo'llanish</h2>
            <div className="space-y-3">
              {[
                "Rux rudalarini qayta ishlash — ZnO yoki ZnS konsentratlari ishqorda eritilib, [Zn(OH)₄]²⁻ holatida eritmaga o'tkaziladi. Boshqa metallar (Fe, Cu) cho'kmada qoladi.",
                "Galvanik ruxlash — ishqoriy elektrolitlarda [Zn(OH)₄]²⁻ asosiy komponent. IQ monitoring elektrolit sifatini nazorat qilish imkonini beradi.",
                "Kimyoviy manbalar — rux-ishqor batareyalarida elektrolit sifatida ishlatiladi.",
                "Analitik kimyoda — Al³⁺ va Zn²⁺ ni farqlashda. Zn(OH)₂ ortiqcha ishqorda eriydi, Al(OH)₃ ham eriydi — qo'shimcha testlar kerak.",
              ].map((r, i) => (
                <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">{i + 1}.</span>
                  <p className="text-purple-200 text-sm">{r}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(Zn−O) = 480 cm⁻¹</strong> — tetraedrik geometriya, og'ir Zn tufayli past chastota</li>
            <li><strong className="text-yellow-400">Zn²⁺ (d¹⁰) — KMBE=0, diamagnit, rangsiz</strong></li>
            <li><strong className="text-yellow-400">Amfoterlik:</strong> kislotada eriydi (Zn²⁺), ishqorda eriydi ([Zn(OH)₄]²⁻)</li>
            <li><strong className="text-yellow-400">pH &gt; 12</strong> da [Zn(OH)₄]²⁻ barqaror, pH &lt; 5 da Zn²⁺ akva kompleks</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Fe(CO)₅]
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/cr-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Cr(H₂O)₆]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}