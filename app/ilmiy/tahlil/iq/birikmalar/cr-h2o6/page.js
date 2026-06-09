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
    [3400, 85, 55], [3250, 80, 45], [1630, 60, 25],
    [780, 48, 18], [490, 35, 12], [440, 40, 14],
    [350, 42, 13], [290, 38, 11]
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
      grad.addColorStop(0, `rgba(168,85,247,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(168,85,247,0.01)")
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
export default function CrH2O6_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3400, T: 14, label: "ν(O–H) asimmetrik", color: "#f87171", desc: "Juda kuchli va keng — koordinatsiyalangan suv molekulasining asimmetrik valent tebranishi. Kuchli vodorod bog'lar." },
    { wn: 3250, T: 18, label: "ν(O–H) simmetrik", color: "#fb923c", desc: "Kuchli — suv molekulasining simmetrik valent tebranishi. Oktaedrik O<sub>h</sub> simmetriya." },
    { wn: 1630, T: 38, label: "δ(H–O–H) scissoring", color: "#60a5fa", desc: "O'rta — suvning deformatsion tebranishi. Koordinatsiyalangan suvga xos." },
    { wn: 780, T: 50, label: "ρ(H₂O) rocking", color: "#22d3ee", desc: "O'rta — koordinatsiyalangan suvning tebranma harakati. Cr−O bog'i mavjudligini ko'rsatadi." },
    { wn: 490, T: 58, label: "ν(Cr–O) T₁u", color: "#fbbf24", desc: "MUHIM — Cr−O valent tebranishi. Cr³⁺ (d³) — kuchli bog'. KMBE=−1.2Δ<sub>o</sub> hisobiga yuqori chastota." },
    { wn: 440, T: 55, label: "ν(Cr–O) qo'shimcha", color: "#a78bfa", desc: "O'rta — ikkinchi ν(Cr−O) polosa. Oktaedrik maydonda T₁u simmetriya — IQ-faol." },
    { wn: 350, T: 52, label: "δ(O–Cr–O) T₂u", color: "#c084fc", desc: "O'rta — oktaedrik skelet deformatsion tebranishi. O<sub>h</sub> simmetriya." },
    { wn: 290, T: 58, label: "δ(O–Cr–O) T₂g", color: "#86efac", desc: "O'rta — Raman-faol, IQ da kuchsiz. Alternativ taqiq tufayli IQ da zaif ko'rinadi." },
  ]

  const tabs = [
    { id: "spektr",      label: "📈 IQ Spektri" },
    { id: "jadval",      label: "📊 Cho'qqilar jadvali" },
    { id: "izomeriya",   label: "🔄 Gidrat izomeriyasi" },
    { id: "inert",       label: "🐢 Kinetik inertlik" },
    { id: "kmbe",        label: "💎 KMBE va barqarorlik" },
    { id: "taqqos",      label: "⚖️ Boshqa Cr³⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">[Cr(H₂O)₆]³⁺ — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvaxrom(III) ioni • d³ inert kompleks • Hexaaquachromium(III)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d³</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">O<sub>h</sub></span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (n=3)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">INERT (t½≈80 soat)</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Cr(H₂O)₆]³⁺
            </h2>
            <span className="text-purple-400 text-lg">160.07 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaakvaxrom(III) ioni — <span className="text-purple-400 italic">d³ inert kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">ν(Cr−O) = 490 cm⁻¹</strong> — 
            Cr³⁺ (d³) kuchli bog' hosil qiladi. 
            <strong className="text-yellow-400"> KMBE = −1.2Δ<sub>o</sub></strong> — yuqori barqarorlik.
            <strong className="text-yellow-400"> t<sub>½</sub> ≈ 80 soat!</strong> — eng inert akva komplekslardan biri.
            <strong className="text-yellow-400"> O<sub>h</sub> simmetriya — alternativ taqiq</strong> amal qiladi.
            CrCl₃·6H₂O — <strong className="text-yellow-400">gidrat izomeriyasining klassik namunasi</strong>:
            3 xil izomer (binafsha, och yashil, to'q yashil).
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Cr³⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d³ (t₂g³)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oktaedrik (O<sub>h</sub>)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">3.7−3.9 μ<sub>B</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Cr−O masofa</div>
              <div className="text-white font-bold">1.97 Å</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">KMBE</div>
              <div className="text-white font-bold">−1.2Δ<sub>o</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Suv almashinuvi</div>
              <div className="text-white font-bold">2.4×10⁻⁶ s⁻¹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">t<sub>½</sub></div>
              <div className="text-white font-bold">~80 soat</div>
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
                  ? "bg-purple-600/40 text-white border border-purple-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — [Cr(H₂O)₆]³⁺</h2>
            <IQSpektrGrafik peaks={peaks} lineColor="#a855f7" />
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
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Muhim xususiyat:</strong> ν(Cr−O) 490 cm⁻¹ — 
                d³ konfiguratsiya tufayli kuchli bog'. O<sub>h</sub> simmetriya — alternativ taqiq.
                T₂g tebranishlar IQ da ko'rinmaydi, faqat Raman faol.
              </p>
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
                  <th className="py-3 px-4 text-purple-300">Chastota</th><th className="py-3 px-4 text-purple-300">Tebranish</th><th className="py-3 px-4 text-purple-300">Simmetriya</th><th className="py-3 px-4 text-purple-300">Faollik</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4 font-mono text-sm text-purple-400">
                        {i === 4 ? "T₁u" : i === 5 ? "T₁u" : i === 6 ? "T₂u" : i === 7 ? "T₂g (Raman)" : "—"}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {i === 7 ? <span className="text-blue-400">Raman</span> : <span className="text-green-400">IQ</span>}
                      </td>
                      <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: p.desc }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── GIDRAT IZOMERIYASI ── */}
        {activeTab === "izomeriya" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Gidrat izomeriyasi — IQ farqi</h2>
            <p className="text-purple-200 leading-relaxed">
              CrCl₃·6H₂O — <strong className="text-yellow-400">gidrat izomeriyasining klassik namunasi</strong>.
              Bir xil empirik formulaga ega 3 xil izomer. IQ spektri ularni farqlash imkonini beradi.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Izomer</th><th className="py-3 px-4 text-purple-300">Tarkibi</th><th className="py-3 px-4 text-purple-300">Rangi</th><th className="py-3 px-4 text-purple-300">ν(Cr−O)</th><th className="py-3 px-4 text-purple-300">ν(Cr−Cl)</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Binafsha", "[Cr(H₂O)₆]Cl₃", "Binafsha", "490 cm⁻¹", "— (yo'q)"],
                    ["Och yashil", "[Cr(H₂O)₅Cl]Cl₂·H₂O", "Och yashil", "490 cm⁻¹", "~350 cm⁻¹"],
                    ["To'q yashil", "[Cr(H₂O)₄Cl₂]Cl·2H₂O", "To'q yashil", "490 cm⁻¹", "~350 cm⁻¹ (kuchli)"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-sm">{r[1]}</td>
                      <td className="py-3 px-4">{r[2]}</td>
                      <td className="py-3 px-4 font-mono text-green-400">{r[3]}</td>
                      <td className="py-3 px-4 font-mono text-blue-400">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong>IQ diagnostikasi:</strong> Binafsha izomerda ν(Cr−Cl) yo'q (Cl⁻ tashqi sferada).
                Yashil izomerlarda ν(Cr−Cl) polosasi paydo bo'ladi — Cl⁻ ichki sferaga kirgan.
              </p>
            </div>
          </div>
        )}

        {/* ── INERTLIK ── */}
        {activeTab === "inert" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🐢 Kinetik inertlik — IQ bilan bog'liqlik</h2>
            <p className="text-purple-200 leading-relaxed">
              [Cr(H₂O)₆]³⁺ — <strong className="text-yellow-400">eng inert akva komplekslardan biri</strong>.
              k<sub>H₂O</sub> = 2.4×10⁻⁶ s⁻¹, t<sub>½</sub> ≈ 80 soat.
              IQ spektridagi yuqori ν(Cr−O) chastotasi kuchli bog'ni ko'rsatadi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-red-400 font-bold mb-2">Nima uchun inert?</h3>
                <p className="text-purple-200 text-sm">
                  <strong>d³ (t₂g³):</strong> yarim to'lgan t₂g<br/>
                  <strong>Almashinuv energiyasi:</strong> qo'shimcha barqarorlik<br/>
                  <strong>ΔKMBE:</strong> −0.6Δ<sub>o</sub> (katta)<br/>
                  <strong>E<sub>a</sub>:</strong> 110 kJ/mol (yuqori)
                </p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">IQ va inertlik</h3>
                <p className="text-purple-200 text-sm">
                  <strong>ν(Cr−O) = 490 cm⁻¹:</strong> yuqori<br/>
                  <strong>Kuchli bog' → sekin almashinuv</strong><br/>
                  IQ chastotasi inertlikni bashorat qiladi!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── KMBE ── */}
        {activeTab === "kmbe" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💎 KMBE va barqarorlik</h2>
            <p className="text-purple-200 leading-relaxed">
              Cr³⁺ (d³) — <strong className="text-yellow-400">KMBE = −1.2Δ<sub>o</sub></strong>.
              t₂g orbitallar yarim to'lgan — bu qo'shimcha almashinuv energiyasi beradi.
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-xl">
                KMBE = 3 × (−0.4Δ<sub>o</sub>) + 0 × (+0.6Δ<sub>o</sub>) = −1.2Δ<sub>o</sub>
              </p>
              <p className="text-purple-300 text-sm mt-2">
                d³ — A₂<sub>g</sub> asosiy term. Orbital hissa deyarli yo'q. μ<sub>eff</sub> ≈ μ<sub>SO</sub> = 3.87 μ<sub>B</sub>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Δ<sub>o</sub> = ν₁ = 17,400 cm⁻¹</h3>
              <p className="text-purple-200 text-sm">
                UB-Vis spektridan: ν₁ = ⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub> = 17,400 cm⁻¹ = Δ<sub>o</sub>.
                ν₂ = 24,600 cm⁻¹, ν₂/ν₁ = 1.414. Tanabe-Sugano dan: Δ<sub>o</sub>/B ≈ 24.7, B ≈ 704 cm⁻¹.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa Cr³⁺ komplekslari bilan IQ taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ν(Cr−L)</th><th className="py-3 px-4 text-purple-300">Rangi</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Cr(H₂O)₆]³⁺", "Oktaedrik", "490 cm⁻¹", "Binafsha"],
                    ["[Cr(NH₃)₆]³⁺", "Oktaedrik", "~460 cm⁻¹", "Sariq"],
                    ["[CrCl₆]³⁻", "Oktaedrik", "~320 cm⁻¹", "Yashil"],
                    ["[Cr(CN)₆]³⁻", "Oktaedrik", "ν(C≡N): 2130", "Sariq"],
                    ["[Cr(en)₃]³⁺", "Oktaedrik", "~450 cm⁻¹", "Sariq"],
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
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(Cr−O) = 490 cm⁻¹</strong> — Cr³⁺ (d³) kuchli bog'i, yuqori chastota</li>
            <li><strong className="text-yellow-400">KMBE = −1.2Δ<sub>o</sub></strong> — yuqori barqarorlik, inertlik sababi</li>
            <li><strong className="text-yellow-400">t<sub>½</sub> ≈ 80 soat</strong> — eng inert akva komplekslardan biri</li>
            <li><strong className="text-yellow-400">Gidrat izomeriyasi</strong> — 3 xil izomer, IQ ularni farqlaydi (ν(Cr−Cl) bor/yo'q)</li>
            <li><strong className="text-yellow-400">O<sub>h</sub> simmetriya — alternativ taqiq</strong> amal qiladi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/zn-oh4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Zn(OH)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Barcha birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}