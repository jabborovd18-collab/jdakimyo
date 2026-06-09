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
    [3280, 80, 30], [3200, 75, 25], [1600, 55, 18],
    [510, 35, 12], [490, 38, 12], [330, 30, 10], [315, 32, 10]
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
      grad.addColorStop(0, `rgba(251,191,36,${0.12 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,191,36,0.01)")
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

    // Hover tooltip
    if (hoveredPeak && !selectedPeak) {
      const p = hoveredPeak
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(p.wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(p.wn), y = tToY(T)

      ctx.fillStyle = "#0f0a1a"
      ctx.strokeStyle = p.color
      ctx.lineWidth = 1
      const tw = 160, th = 40
      const tx = Math.min(Math.max(x - tw/2, PAD.l + 5), PAD.l + plotW - tw - 5)
      const ty = y - 55
      
      ctx.beginPath()
      ctx.roundRect(tx, ty, tw, th, 8)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = "#fff"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${p.wn} cm⁻¹`, tx + tw/2, ty + 16)
      ctx.fillStyle = p.color
      ctx.font = "9px sans-serif"
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
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress * 100)}%</span>
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
export default function Sisplatin_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 3280, T: 15, label: "ν(N–H) asimmetrik", color: "#f87171", desc: "Kuchli — NH₃ ligandining asimmetrik valent tebranishi. Sis izomerda 2 ta polosa." },
    { wn: 3200, T: 20, label: "ν(N–H) simmetrik", color: "#fb923c", desc: "Kuchli — simmetrik valent tebranish. Koordinatsiyalangan ammiakka xos." },
    { wn: 1600, T: 40, label: "δ(H–N–H) degenerate", color: "#60a5fa", desc: "O'rta — NH₃ ligandining degenerat deformatsion tebranishi." },
    { wn: 510, T: 60, label: "ν(Pt–N) simmetrik", color: "#22d3ee", desc: "Muhim — Pt−N valent tebranishi (simmetrik). Sis izomerda 2 ta Pt−N polosa." },
    { wn: 490, T: 58, label: "ν(Pt–N) asimmetrik", color: "#a78bfa", desc: "Muhim — Pt−N valent tebranishi (asimmetrik). Sis izomerning diagnostik belgisi." },
    { wn: 330, T: 65, label: "ν(Pt–Cl) simmetrik", color: "#fbbf24", desc: "O'rta — Pt−Cl valent tebranishi (simmetrik). Og'ir Pt atomi tufayli past chastota." },
    { wn: 315, T: 63, label: "ν(Pt–Cl) asimmetrik", color: "#86efac", desc: "O'rta — Pt−Cl valent tebranishi (asimmetrik). Sis izomerda 2 ta Pt−Cl polosa." },
  ]

  const tabs = [
    { id: "spektr",   label: "📈 IQ Spektri" },
    { id: "jadval",   label: "📊 Cho'qqilar jadvali" },
    { id: "sis-trans", label: "🔄 Sis vs Trans farqi" },
    { id: "transtasir", label: "⚡ Trans-ta'sir" },
    { id: "dnk",      label: "🧬 DNK bilan bog'lanish" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">sis-[PtCl₂(NH₃)₂] — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">sis-diammindixloroplatina(II) • SISPLATIN • Saratonga qarshi dori</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tekis kvadrat</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">C<sub>2v</sub> simmetriya</span>
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">💊 Saratonga qarshi</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              sis-[PtCl₂(NH₃)₂]
            </h2>
            <span className="text-purple-400 text-lg">300.05 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            sis-diammindixloroplatina(II) — <span className="text-yellow-400 italic font-bold">"SISPLATIN"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> — sis-trans izomeriyani aniqlashning 
            eng ishonchli usuli. <strong className="text-yellow-400">Sis izomerda</strong> past simmetriya 
            (C<sub>2v</sub>) tufayli <strong>Pt−Cl va Pt−N tebranishlari 2 tadan polosa</strong> beradi.
            <strong className="text-yellow-400"> Trans izomerda</strong> esa yuqori simmetriya (D<sub>2h</sub>) 
            tufayli faqat bittadan polosa kuzatiladi. Bu — <strong>IQ diagnostikaning klassik namunasi!</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Pt²⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfig</div>
              <div className="text-white font-bold">d⁸</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C<sub>2v</sub></div>
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
                  ? "bg-yellow-600/40 text-white border border-yellow-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — sis-[PtCl₂(NH₃)₂]</h2>
            
            <IQSpektrGrafik peaks={peaks} lineColor="#fbbf24" />

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

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Diagnostik ahamiyat:</strong> Pt−Cl (330, 315 cm⁻¹) 
                va Pt−N (510, 490 cm⁻¹) juft polosalari — sis izomerning ishonchli belgisi.
                Trans izomerda har biri faqat bittadan polosa beradi.
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

        {/* ── SIS vs TRANS ── */}
        {activeTab === "sis-trans" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Sis vs Trans — IQ diagnostikasi</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Sisplatin uchun <strong className="text-yellow-400">IQ spektroskopiya eng ishonchli 
              diagnostik usul</strong> hisoblanadi. Polosalar sonidagi farq izomerlarni bir zumda ajratish imkonini beradi.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-3">sis-izomer (C<sub>2v</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Pt−N:</strong> 510, 490 cm⁻¹ (2 ta)<br/>
                  <strong>Pt−Cl:</strong> 330, 315 cm⁻¹ (2 ta)<br/>
                  <strong>Simmetriya:</strong> Past<br/>
                  <strong>Dipol moment:</strong> 3.2 D (qutbli)<br/>
                  <span className="text-green-400">Biologik faol!</span>
                </p>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
                <h3 className="text-red-400 font-bold mb-3">trans-izomer (D<sub>2h</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Pt−N:</strong> 500 cm⁻¹ (1 ta)<br/>
                  <strong>Pt−Cl:</strong> 325 cm⁻¹ (1 ta)<br/>
                  <strong>Simmetriya:</strong> Yuqori<br/>
                  <strong>Dipol moment:</strong> 0 D (qutbsiz)<br/>
                  <span className="text-red-400">Biologik faol emas!</span>
                </p>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>IQ diagnostika qoidasi:</strong> Sis izomerda past simmetriya — ko'proq IQ-faol tebranishlar. 
                Trans izomerda yuqori simmetriya — ba'zi tebranishlar IQ-faol emas. Polosalar soni farqi — 
                izomerlarni aniqlashning eng oson yo'li!
              </p>
            </div>
          </div>
        )}

        {/* ── TRANS-TA'SIR ── */}
        {activeTab === "transtasir" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Trans-ta'sir — IQ chastotalariga ta'siri</h2>
            
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Trans-ta'sir</strong> — kvadrat-planar komplekslarda 
              bir ligandning o'ziga trans holatda joylashgan ligand bog'ini zaiflashtirishi.
              Bu zaiflashish IQ spektrida <strong>chastotaning pasayishi</strong> sifatida namoyon bo'ladi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Trans ligand</th>
                    <th className="py-3 px-4 text-purple-300">ν(Pt−Cl) cm⁻¹</th>
                    <th className="py-3 px-4 text-purple-300">Trans-ta'sir kuchi</th>
                    <th className="py-3 px-4 text-purple-300">Izoh</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["NH₃", "330", "Kuchsiz", "Standart — sisplatindagi kabi"],
                    ["Cl⁻", "325", "Kuchsiz", "Trans izomerda — bir xil ligandlar"],
                    ["I⁻", "310", "O'rta", "Yumshoq donor — kuchliroq trans-ta'sir"],
                    ["CN⁻", "295", "Kuchli", "π-akseptor — eng kuchli trans-ta'sir"],
                    ["CO", "280", "Juda kuchli", "Kuchli π-akseptor — bog'ni maksimal zaiflashtiradi"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono">{r[1]}</td>
                      <td className="py-3 px-4">{r[2]}</td>
                      <td className="py-3 px-4 text-sm">{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DNK BILAN BOG'LANISH ── */}
        {activeTab === "dnk" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🧬 DNK bilan bog'lanish — IQ orqali kuzatish</h2>
            
            <p className="text-purple-200 leading-relaxed">
              Sisplatin DNK bilan bog'langanda Cl⁻ ligandlari suv molekulalariga almashadi.
              Bu jarayonni <strong className="text-yellow-400">IQ spektroskopiya orqali kuzatish</strong> mumkin —
              Pt−Cl polosalari yo'qoladi, Pt−O (suv) polosalari paydo bo'ladi.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2 text-sm">Sisplatin</h3>
                <p className="text-purple-200 text-xs">
                  <strong>Pt−Cl:</strong> 330, 315 cm⁻¹<br/>
                  <strong>Pt−N:</strong> 510, 490 cm⁻¹<br/>
                  Faol dori shakli
                </p>
              </div>
              <div className="bg-blue-600/10 rounded-xl p-4 text-center border border-blue-500/30">
                <h3 className="text-blue-400 font-bold mb-2 text-sm">Akvatsiyalangan</h3>
                <p className="text-purple-200 text-xs">
                  <strong>Pt−OH₂:</strong> 440 cm⁻¹<br/>
                  <strong>Pt−Cl:</strong> yo'qoladi<br/>
                  Hujayra ichida hosil bo'ladi
                </p>
              </div>
              <div className="bg-green-600/10 rounded-xl p-4 text-center border border-green-500/30">
                <h3 className="text-green-400 font-bold mb-2 text-sm">DNK bilan bog'langan</h3>
                <p className="text-purple-200 text-xs">
                  <strong>Pt−N7(guanin):</strong> 520 cm⁻¹<br/>
                  <strong>Pt−OH₂:</strong> yo'qoladi<br/>
                  Saraton hujayrasini o'ldiradi
                </p>
              </div>
            </div>

            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <p className="text-pink-300 text-sm">
                <strong>IQ monitoring:</strong> Sisplatinning DNK bilan bog'lanish jarayonini 
                IQ spektroskopiya orqali real vaqt rejimida kuzatish mumkin —
                bu dori ta'sir mexanizmini tushunishda muhim ahamiyatga ega.
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Sis izomer diagnostikasi:</strong> Pt−Cl (330, 315) va Pt−N (510, 490) — juft polosalar</li>
            <li><strong className="text-yellow-400">Trans izomer:</strong> yuqori simmetriya — har bir bog' uchun faqat 1 ta polosa</li>
            <li><strong className="text-yellow-400">Trans-ta'sir:</strong> kuchli ligandlar Pt−Cl chastotasini pasaytiradi</li>
            <li><strong className="text-yellow-400">DNK bilan bog'lanish:</strong> Pt−Cl yo'qoladi → Pt−N7(guanin) paydo bo'ladi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Co(NH₃)₆]Cl₃
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/ferrosen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Ferrosen →
          </Link>
        </div>

      </section>
    </main>
  )
}