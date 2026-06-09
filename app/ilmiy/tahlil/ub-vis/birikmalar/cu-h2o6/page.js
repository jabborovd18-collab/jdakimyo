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
  const nmToX = (nm) => PAD.l + ((nm - 400) / (1100 - 400)) * plotW
  const absToY = (abs) => PAD.t + ((0.05 - abs) / 0.05) * plotH

  function gauss(nm, nm0, height, width) {
    return height * Math.exp(-Math.pow((nm - nm0) / width, 2))
  }

  const peakDefs = [
    [800, 0.018, 80], [700, 0.014, 60], [900, 0.012, 55]
  ]

  function drawSpectrum(ctx, width, height) {
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "rgba(255,255,255,0.03)"
    ctx.fillRect(nmToX(400), PAD.t, nmToX(800) - nmToX(400), plotH)

    ctx.strokeStyle = "#2a1f3d"; ctx.lineWidth = 0.5
    ;[500,600,700,800,900,1000].forEach(nm => {
      const x = nmToX(nm)
      ctx.beginPath(); ctx.moveTo(x, PAD.t); ctx.lineTo(x, PAD.t + plotH); ctx.stroke()
    })
    ;[0.01,0.02,0.03,0.04].forEach(a => {
      const y = absToY(a)
      ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + plotW, y); ctx.stroke()
    })

    ctx.strokeStyle = "#ff0"; ctx.lineWidth = 1; ctx.setLineDash([5, 5])
    ctx.beginPath(); ctx.moveTo(nmToX(400), PAD.t); ctx.lineTo(nmToX(400), PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(nmToX(800), PAD.t); ctx.lineTo(nmToX(800), PAD.t + plotH); ctx.stroke()
    ctx.setLineDash([])

    const maxNm = 400 + (1100 - 400) * animProgress
    
    ctx.beginPath()
    ctx.strokeStyle = lineColor; ctx.lineWidth = 1.8
    ctx.shadowBlur = 6; ctx.shadowColor = lineColor

    let firstPoint = true
    for (let nm = 400; nm <= 1100; nm += 1) {
      if (nm > maxNm && animProgress < 1) continue
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
      const x = nmToX(nm), y = absToY(Math.min(0.02, absorb))
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)
    }
    ctx.stroke(); ctx.shadowBlur = 0

    if (animProgress > 0.3) {
      ctx.beginPath(); firstPoint = true
      for (let nm = 1100; nm >= 400; nm -= 1) {
        if (nm > maxNm && animProgress < 1) continue
        let absorb = 0
        peakDefs.forEach(([nm0, h, w]) => absorb += gauss(nm, nm0, h, w))
        const x = nmToX(nm), y = absToY(Math.min(0.02, absorb))
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.02, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.02, absorb))
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
    ;[500,600,700,800,900,1000].forEach(nm => ctx.fillText(nm, nmToX(nm), PAD.t + plotH + 18))
    ctx.textAlign = "right"
    ;[0.01,0.02,0.03,0.04].forEach(a => ctx.fillText(a.toFixed(2), PAD.l - 8, absToY(a) + 4))
    
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
    const nm = 400 + ((mx - PAD.l) / plotW) * (1100 - 400)
    let closest = null, minDist = 35
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
        Grafik sxematik. Keng assimmetrik polosa — Yan-Teller buzilishi tufayli 2−3 ta polosa superpozitsiyasi.
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
export default function CuH2O6_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 800, label: "d-d (²E_g → ²T₂g)", color: "#60a5fa", desc: "ASOSIY d-d O'TISH. ε ≈ 12 L·mol⁻¹·cm⁻¹. Keng assimmetrik polosa — Yan-Teller buzilishi tufayli 2−3 ta polosa superpozitsiyasi. Havorang rangga sabab." },
    { nm: 700, label: "²B₁g → ²A₁g (Yan-Teller)", color: "#a78bfa", desc: "Yan-Teller ajralgan komponent. Cho'zilgan oktaedr (D₄h) da energiya sathlari qo'shimcha ajralgan." },
    { nm: 900, label: "²B₁g → ²B₂g (Yan-Teller)", color: "#86efac", desc: "Yan-Teller ajralgan komponent. Past energiyali yelka. 77 K da aniq ko'rinadi." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "yanteller", label: "⚡ Yan-Teller va UB-Vis" },
    { id: "deltao",    label: "🔢 Δo hisoblash" },
    { id: "harorat",   label: "🌡️ Past haroratda" },
    { id: "taqqos",    label: "⚖️ Boshqa Cu²⁺ komplekslari" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🌈 [Cu(H₂O)₆]²⁺ — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">geksaakvamis(II) ioni • Yan-Teller effekti • d⁹ • Δo=12,500 cm⁻¹</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Cho'zilgan oktaedr</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁹</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Yan-Teller</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Paramagnit (n=1)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Δo=12,500 cm⁻¹</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Cu(H₂O)₆]²⁺
            </h2>
            <span className="text-purple-400 text-lg">171.66 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            geksaakvamis(II) ioni — <span className="text-blue-400 italic">Yan-Teller effektining klassik namunasi</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>keng assimmetrik polosa</strong> 
            ~800 nm atrofida (yaqin IQ soha). Bu polosa aslida <strong className="text-yellow-400">2−3 ta yaqin 
            polosaning superpozitsiyasi</strong> — Yan-Teller buzilishi tufayli D<sub>4h</sub> simmetriyada
            energiya sathlari qo'shimcha ajralgan. <strong className="text-yellow-400">Δo = ν₁ = 12,500 cm⁻¹</strong>.
            Cu²⁺ (d⁹, t₂g⁶ eg³) — <strong className="text-yellow-400">1 ta toq elektron</strong>, paramagnit.
            <strong className="text-yellow-400"> Havorang (och ko'k) rang</strong> — qizil-sariq nurlarni yutadi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub></div>
              <div className="text-white font-bold">~800 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε</div>
              <div className="text-white font-bold">~12</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Δo</div>
              <div className="text-white font-bold">12,500 cm⁻¹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-blue-400 font-bold">Havorang</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">t₂g⁶ eg³</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">1.7−2.2 μ<sub>B</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Cho'zilgan oktaedr</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D<sub>4h</sub></div>
            </div>
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> H₂O</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻² M (ε kichikligi uchun)</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm</span>
            <span><strong className="text-purple-300">Harorat:</strong> 25°C (xona) yoki 77 K (past harorat)</span>
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [Cu(H₂O)₆]²⁺</h2>
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
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Yan-Teller isboti:</strong> Oddiy oktaedrda 1 ta d-d polosa kutiladi.
                Keng assimmetrik polosa — Yan-Teller buzilishi tufayli 2−3 ta polosa superpozitsiyasi.
                77 K da polosalar aniq ajraladi.
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
                    ["~800", "~12,500 cm⁻¹", "²E_g → ²T₂g (asosiy)", "~12", "Keng assimmetrik polosa. Δo ga teng."],
                    ["~700", "~14,300 cm⁻¹", "²B₁g → ²A₁g", "~8", "Yan-Teller komponenti. 77 K da aniq."],
                    ["~900", "~11,100 cm⁻¹", "²B₁g → ²B₂g", "~6", "Yan-Teller komponenti. Past energiyali yelka."],
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

        {/* ── YAN-TELLER VA UB-Vis ── */}
        {activeTab === "yanteller" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Yan-Teller effekti — UB-Vis da qanday ko'rinadi?</h2>
            <p className="text-purple-200 leading-relaxed">
              Cu²⁺ (d⁹) — eg³ konfiguratsiya. Yan-Teller teoremasi: degenerat holatli molekula simmetriyani buzadi.
              Oktaedr cho'ziladi — O<sub>h</sub> → D<sub>4h</sub>. UB-Vis da bu <strong className="text-yellow-400">qo'shimcha polosalar</strong> sifatida namoyon bo'ladi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">Oddiy oktaedr (O<sub>h</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>d-d o'tish:</strong> ²E_g → ²T₂g<br/>
                  <strong>Polosalar soni:</strong> 1 ta<br/>
                  <strong>Kuzatiladi:</strong> Nazariy — haqiqatda YO'Q
                </p>
              </div>
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
                <h3 className="text-orange-400 font-bold mb-2">Cho'zilgan oktaedr (D<sub>4h</sub>)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>d-d o'tishlar:</strong> ²B₁g → ²A₁g, ²B₂g, ²E_g<br/>
                  <strong>Polosalar soni:</strong> 2−3 ta<br/>
                  <strong>Kuzatiladi:</strong> Keng assimmetrik polosa
                </p>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 text-sm">
                <strong>UB-Vis diagnostikasi:</strong> Agar Cu²⁺ kompleksida <strong>bitta keng assimmetrik polosa</strong> 
                kuzatilsa — bu Yan-Teller buzilishining bevosita isboti!
              </p>
            </div>
          </div>
        )}

        {/* ── Δo HISOBLASH ── */}
        {activeTab === "deltao" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔢 Δo hisoblash — to'g'ridan-to'g'ri spektrdan</h2>
            <p className="text-purple-200 leading-relaxed">
              d⁹ konfiguratsiyada <strong className="text-yellow-400">Δo = ν₁</strong> — to'g'ridan-to'g'ri spektrdan!
              Bu d¹, d³, d⁶(YS), d⁸, d⁹ konfiguratsiyalar uchun xos.
            </p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-bold text-xl">Δo = ν₁ = 12,500 cm⁻¹ (800 nm)</p>
              <p className="text-purple-300 text-sm mt-2">
                H₂O — o'rtacha kuchsiz ligand. Spektrokimyoviy qatorda: I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; <strong>H₂O</strong> &lt; NH₃ &lt; CN⁻
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-200 text-sm">
                <strong>Hisoblash:</strong> Δo = h·c/λ = (6.626×10⁻³⁴)(2.998×10⁸)/(800×10⁻⁹) = 2.48×10⁻¹⁹ J = 12,500 cm⁻¹ = 149 kJ/mol
              </p>
            </div>
          </div>
        )}

        {/* ── PAST HARORAT ── */}
        {activeTab === "harorat" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🌡️ Past haroratda (77 K) — polosalar ajraladi</h2>
            <p className="text-purple-200 leading-relaxed">
              Xona haroratida dinamik Yan-Teller — polosalar keng va birlashgan.
              <strong className="text-yellow-400"> 77 K da statik Yan-Teller</strong> — polosalar torayadi va aniq ajraladi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-orange-400 font-bold mb-2">298 K (xona harorati)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Dinamik Yan-Teller</strong><br/>
                  Cho'zilish o'qi tebranadi<br/>
                  <strong>1 ta keng polosa</strong><br/>
                  ε ≈ 12
                </p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-2">77 K (suyuq azot)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Statik Yan-Teller</strong><br/>
                  Cho'zilish bir o'qda doimiy<br/>
                  <strong>2−3 ta aniq polosa</strong><br/>
                  ε ≈ 15−20 (tor polosalar)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Boshqa Cu²⁺ komplekslari bilan UB-Vis taqqoslash</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">λ<sub>max</sub></th><th className="py-3 px-4 text-purple-300">Rang</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Cu(H₂O)₆]²⁺", "Cho'zilgan oktaedr", "~800 nm", "Havorang"],
                    ["[Cu(NH₃)₄(H₂O)₂]²⁺", "Cho'zilgan oktaedr", "~600 nm", "To'q ko'k"],
                    ["[CuCl₄]²⁻", "Tetraedrik", "~400 nm (kuchli)", "Sariq-yashil"],
                    ["[Cu(CN)₄]²⁻", "Kvadrat-planar", "~480 nm", "Sariq"],
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
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Keng assimmetrik polosa (~800 nm)</strong> — Yan-Teller buzilishi</li>
            <li><strong className="text-yellow-400">Δo = 12,500 cm⁻¹</strong> — to'g'ridan-to'g'ri spektrdan (d⁹)</li>
            <li><strong className="text-yellow-400">77 K da polosalar ajraladi</strong> — statik Yan-Teller isboti</li>
            <li><strong className="text-yellow-400">Havorang rang</strong> — qizil-sariq nurlarni yutadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ni-cn4" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Ni(CN)₄]²⁻
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-cl4" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [CoCl₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}