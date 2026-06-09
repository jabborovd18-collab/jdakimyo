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
    [305, 0.38, 22], [250, 0.55, 20], [215, 0.72, 18]
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
      grad.addColorStop(0, `rgba(251,191,36,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(251,191,36,0.01)")
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
              <div className="h-full bg-yellow-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-yellow-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      <p className="text-center text-purple-500 text-xs mt-2 italic">
        Grafik sxematik ko'rinish. Asosiy yutilish UB sohada (305 nm). Ko'rinadigan sohada zaif d-d o'tishlar.
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
export default function Sisplatin_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 305, label: "d-d (¹A₁g → ¹E_g)", color: "#fbbf24", desc: "Asosiy d-d o'tish. ε ≈ 150 L·mol⁻¹·cm⁻¹. UB soha chegarasida. Pt²⁺ (5d⁸) — kuchli SOC tufayli spin-taqiq yengillashgan." },
    { nm: 250, label: "d-d + MLCT", color: "#60a5fa", desc: "d-d o'tish va MLCT (Pt→NH₃) aralashmasi. UB sohada." },
    { nm: 215, label: "CT/ligand (chuqur UB)", color: "#a78bfa", desc: "Chuqur UB — charge-transfer va ligand ichidagi o'tishlar. Aniq tayinlash manbaga bog'liq." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "dnk",       label: "🧬 DNK bilan bog'lanish" },
    { id: "akvatsiya", label: "💧 Akvatsiya monitoring" },
    { id: "sis-trans", label: "🔄 Sis vs Trans" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🌈 sis-[PtCl₂(NH₃)₂] — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">sis-diammindixloroplatina(II) • SISPLATIN • d⁸ kvadrat-planar • d-d o'tishlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
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
            <strong className="text-yellow-400">UB-Vis spektri</strong> — asosiy yutilish UB sohada (~305 nm).
            Pt²⁺ (5d⁸) — <strong className="text-yellow-400">og'ir metall</strong>, kuchli spin-orbit bog'lanish (SOC)
            tufayli spin-taqiqlangan o'tishlar qisman ruxsat etilgan.
            <strong className="text-yellow-400"> d-d o'tishlar:</strong> ¹A₁g → ¹E_g (~305 nm, ε≈150).
            Sisplatinning UB-Vis spektri <strong>DNK bilan bog'lanish jarayonini kuzatish</strong> uchun ishlatiladi —
            akvatsiya natijasida spektr o'zgaradi.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub></div>
              <div className="text-white font-bold">305 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε</div>
              <div className="text-white font-bold">~150</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">O'tish turi</div>
              <div className="text-white font-bold">d-d (+ MLCT)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-yellow-400 font-bold">Sariq kristall</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">C<sub>2v</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Spin-orbit (ζ)</div>
              <div className="text-white font-bold">~3000 cm⁻¹</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Konfiguratsiya</div>
              <div className="text-white font-bold">5d⁸</div>
            </div>
          </div>
        </div>

        {/* ── TAJRIBA SHAROITI ── */}
        <div className="bg-purple-800/20 border border-purple-700/30 rounded-xl p-4">
          <div className="flex flex-wrap gap-4 text-xs text-purple-400">
            <span><strong className="text-purple-300">Erituvchi:</strong> H₂O yoki DMSO</span>
            <span><strong className="text-purple-300">Konsentratsiya:</strong> ~10⁻⁴ M</span>
            <span><strong className="text-purple-300">Kyuveta:</strong> 1 cm kvars</span>
            <span><strong className="text-purple-300">Eslatma:</strong> Suvda sekin gidrolizlanadi — yangi eritma kerak</span>
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — Sisplatin</h2>
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
                <strong className="text-yellow-400">5d metall xususiyati:</strong> Kuchli spin-orbit bog'lanish (ζ≈3000 cm⁻¹)
                tufayli d-d o'tishlar 3d metallarga nisbatan intensivroq. Sisplatin UB sohada yutadi —
                shuning uchun kristall holatda sariq rangda.
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
                  <th className="py-3 px-4 text-purple-300">λ (nm)</th><th className="py-3 px-4 text-purple-300">O'tish</th><th className="py-3 px-4 text-purple-300">ε</th><th className="py-3 px-4 text-purple-300">Tavsif</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["305", "d-d (¹A₁g → ¹E_g) + MLCT", "~150", "Asosiy polosa. UB chegarasida. 5d metall — SOC ta'siri."],
                    ["250", "d-d + MLCT", "~300", "UB sohada."],
                    ["215", "CT/ligand (chuqur UB)", "~800", "Chuqur UB. Aniq tayinlash manbaga bog'liq."],
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

        {/* ── DNK BILAN BOG'LANISH ── */}
        {activeTab === "dnk" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🧬 DNK bilan bog'lanish — UB-Vis monitoring</h2>
            <p className="text-purple-200 leading-relaxed">
              Sisplatin DNK bilan bog'langanda UB-Vis spektri <strong className="text-yellow-400">sezilarli o'zgaradi</strong>.
              Bu o'zgarish dori ta'sir mexanizmini tushunish va monitoring qilish uchun ishlatiladi.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2 text-sm">Erkin sisplatin</h3>
                <p className="text-purple-200 text-xs">λ<sub>max</sub> = 305 nm<br/>ε ≈ 150</p>
              </div>
              <div className="bg-blue-600/10 rounded-xl p-4 text-center border border-blue-500/30">
                <h3 className="text-blue-400 font-bold mb-2 text-sm">Akvatsiyalangan</h3>
                <p className="text-purple-200 text-xs">λ<sub>max</sub> = 300 nm<br/>ε ≈ 200<br/>Spektr o'zgaradi</p>
              </div>
              <div className="bg-green-600/10 rounded-xl p-4 text-center border border-green-500/30">
                <h3 className="text-green-400 font-bold mb-2 text-sm">DNK bilan bog'langan</h3>
                <p className="text-purple-200 text-xs">λ<sub>max</sub> siljiydi<br/>Yangi polosalar<br/>Giperxrom effekt</p>
              </div>
            </div>
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <p className="text-pink-300 text-sm">
                <strong>Klinik ahamiyati:</strong> UB-Vis spektroskopiya sisplatinning DNK bilan bog'lanish kinetikasini 
                o'rganish va yangi platina asosidagi dorilarni sinash uchun keng qo'llaniladi.
              </p>
            </div>
          </div>
        )}

        {/* ── AKVATSIYA ── */}
        {activeTab === "akvatsiya" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">💧 Akvatsiya — UB-Vis orqali kuzatish</h2>
            <p className="text-purple-200 leading-relaxed">
              Sisplatin suvda <strong className="text-yellow-400">asta-sekin gidrolizlanadi</strong> (akvatsiya):
              Cl⁻ ligandlari suv molekulalariga almashadi. Bu jarayon UB-Vis spektrida kuzatiladi.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-mono text-sm mb-2">
                sis-[PtCl₂(NH₃)₂] + H₂O → sis-[PtCl(H₂O)(NH₃)₂]⁺ + Cl⁻
              </p>
              <p className="text-purple-200 text-sm">
                Akvatsiya natijasida 305 nm polosa <strong>qisqa to'lqinli sohaga siljiydi</strong> (gipsoxrom siljish)
                va intensivligi ortadi. Bu o'zgarishlarni UB-Vis orqali real vaqt rejimida kuzatish mumkin.
              </p>
            </div>
          </div>
        )}

        {/* ── SIS VS TRANS ── */}
        {activeTab === "sis-trans" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 Sis vs Trans — UB-Vis farqi</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th><th className="py-3 px-4 text-purple-300">sis-izomer</th><th className="py-3 px-4 text-purple-300">trans-izomer</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Simmetriya", "C<sub>2v</sub>", "D<sub>2h</sub>"],
                    ["λ<sub>max</sub>", "305 nm", "~310 nm"],
                    ["ε", "~150", "~100"],
                    ["Rangi", "Sariq", "Och sariq"],
                    ["Dipol moment", "3.2 D (qutbli)", "0 D (qutbsiz)"],
                    ["Biologik faollik", "FAOL (saraton)", "FAOL EMAS"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-blue-300">{r[1]}</td>
                      <td className="py-3 px-4 text-red-300">{r[2]}</td>
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
            <li><strong className="text-yellow-400">Pt²⁺ (5d⁸):</strong> kuchli spin-orbit bog'lanish (ζ≈3000) — d-d o'tishlar intensivroq</li>
            <li><strong className="text-yellow-400">λ<sub>max</sub> ≈ 305 nm</strong> — UB soha chegarasida, sariq rang</li>
            <li><strong className="text-yellow-400">Akvatsiya:</strong> spektr o'zgaradi — UB-Vis monitoring imkonini beradi</li>
            <li><strong className="text-yellow-400">DNK bilan bog'lanish:</strong> yangi polosalar paydo bo'ladi — diagnostik ahamiyatga ega</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/co-nh3-6-cl3" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← [Co(NH₃)₆]Cl₃
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ferrosen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Ferrosen →
          </Link>
        </div>

      </section>
    </main>
  )
}