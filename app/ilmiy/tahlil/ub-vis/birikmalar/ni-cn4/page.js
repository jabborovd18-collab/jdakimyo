"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── UB-Vis SPEKTR GRAFIGI ────────────────────────────────────────────────────
function UBVisSpektrGrafik({ peaks, lineColor = "#4ade80" }) {
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
    [420, 0.08, 30], [320, 0.35, 25], [265, 0.52, 20]
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
      const x = nmToX(nm), y = absToY(Math.min(0.55, absorb))
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
        const x = nmToX(nm), y = absToY(Math.min(0.55, absorb))
        if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
      grad.addColorStop(0, `rgba(74,222,128,${0.15 * Math.min(1, animProgress)})`)
      grad.addColorStop(1, "rgba(74,222,128,0.01)")
      ctx.fillStyle = grad; ctx.fill()
    }

    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([nm0, h, w]) => absorb += gauss(p.nm, nm0, h, w))
      const x = nmToX(p.nm), y = absToY(Math.min(0.55, absorb))
      
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
      const x = nmToX(p.nm), y = absToY(Math.min(0.55, absorb))
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
              <div className="h-full bg-green-400 rounded-full transition-all duration-100" style={{ width: `${animProgress * 100}%` }} />
            </div>
            <span className="text-xs text-green-400 font-mono">{Math.round(animProgress * 100)}%</span>
          </div>
        </div>
      )}

      <p className="text-center text-purple-500 text-xs mt-2 italic">
        Grafik sxematik ko'rinish. d-d o'tish (420 nm) juda kuchsiz (ε≈10).
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
export default function NiCN4_UBVis() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { nm: 420, label: "d-d (¹A₁g → ¹A₂g)", color: "#f87171", desc: "Asosiy d-d o'tish. ε ≈ 10 L·mol⁻¹·cm⁻¹. Juda kuchsiz — Laporte-taqiqlangan (D₄h simmetriya, g→g). Ko'rinadigan sohada — sariq rangga sabab." },
    { nm: 320, label: "MLCT (Ni→CN π*)", color: "#60a5fa", desc: "Metalldan ligandga zaryad ko'chishi. ε ≈ 1000. UB sohada — ko'rinadigan rangga ta'sir qilmaydi." },
    { nm: 265, label: "π→π* (CN⁻ ichki)", color: "#a78bfa", desc: "Ligand ichidagi o'tish. UB sohada." },
  ]

  const tabs = [
    { id: "spektr",    label: "📈 UB-Vis Spektri" },
    { id: "jadval",    label: "📊 Polosalar jadvali" },
    { id: "rang",      label: "🎨 Rang sababi" },
    { id: "geometriya",label: "⬛ Kv-planar vs Oktaedrik" },
    { id: "barqaror",  label: "⚡ Termodinamik vs Kinetik" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/ub-vis/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← UB-Vis birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🌈 [Ni(CN)₄]²⁻ — UB-Vis spektri tahlili</h1>
          <p className="text-purple-400 text-sm">tetrasiyanonikkolat(II) ioni • Kvadrat-planar d⁸ • d-d + MLCT</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">UB-Vis Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Tekis kvadrat (D<sub>4h</sub>)</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">d⁸</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Diamagnit</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">d-d: Laporte-taqiq</span>
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Termobarqaror, labil</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Syne', sans-serif" }}>
              [Ni(CN)₄]²⁻
            </h2>
            <span className="text-purple-400 text-lg">162.78 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            tetrasiyanonikkolat(II) ioni — <span className="text-green-400 italic">d⁸ kvadrat-planar kompleks</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">UB-Vis spektri</strong>da <strong>kuchsiz d-d o'tish</strong> (420 nm, ε≈10) 
            va <strong>kuchli MLCT</strong> (320 nm, ε≈1000) kuzatiladi.
            Ni²⁺ (d⁸) — kvadrat-planar geometriya (D<sub>4h</sub>). d-d o'tish Laporte-taqiqlangan (g→g) — ε juda kichik.
            <strong className="text-yellow-400"> MLCT:</strong> Ni²⁺ t₂g orbitallaridan CN⁻ π* orbitallariga zaryad ko'chishi.
            <strong className="text-yellow-400"> Termodinamik barqaror</strong> (log β₄≈30), lekin <strong>kinetik labil</strong>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">λ<sub>max</sub> (d-d)</div>
              <div className="text-white font-bold">420 nm</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε (d-d)</div>
              <div className="text-white font-bold">~10</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">ε (MLCT)</div>
              <div className="text-white font-bold">~1000</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Rang</div>
              <div className="text-yellow-400 font-bold">Sariq</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Simmetriya</div>
              <div className="text-white font-bold">D<sub>4h</sub></div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">log β₄</div>
              <div className="text-white font-bold">≈30</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">0 (diamagnit)</div>
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
            <h2 className="text-xl font-bold text-white">📈 UB-Vis Spektri — [Ni(CN)₄]²⁻</h2>
            <UBVisSpektrGrafik peaks={peaks} lineColor="#4ade80" />
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
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-purple-200 text-sm">
                <strong className="text-yellow-400">Eng muhim xususiyat:</strong> Kuchsiz d-d o'tish (ε≈10) — 
                D₄h simmetriyada inversiya markazi bor, Laporte-taqiq. Kuchli MLCT (ε≈1000) UB sohada.
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
                    ["420", "d-d (¹A₁g → ¹A₂g)", "~10", "Juda kuchsiz. Laporte-taqiq (D₄h). Sariq rangga sabab."],
                    ["320", "MLCT (Ni→CN π*)", "~1000", "Kuchli. UB sohada. Ko'rinadigan rangga ta'sir qilmaydi."],
                    ["265", "π→π* (CN⁻ ichki)", "~800", "UB sohada."],
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

        {/* ── RANG ── */}
        {activeTab === "rang" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🎨 Nega sariq rang?</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ni(CN)₄]²⁻ <strong className="text-yellow-400">binafsha nurni yutadi</strong> (~420 nm).
              Komplementar rang — <strong className="text-yellow-400">sariq</strong>.
              d-d o'tish Laporte-taqiqlangan — ε juda kichik (~10), shuning uchun rang och.
              MLCT o'tish UB sohada (320 nm) — ko'rinadigan rangga ta'sir qilmaydi.
            </p>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Ni(H₂O)₆]²⁺ bilan taqqoslash</h3>
              <p className="text-purple-200 text-sm">
                Oktaedrik [Ni(H₂O)₆]²⁺ — <strong>yashil</strong> rang (λ≈400, 700, 1100 nm).
                Kvadrat-planar [Ni(CN)₄]²⁻ — <strong>sariq</strong> rang.
                <strong>Sabab:</strong> geometriya o'zgarishi bilan d-orbital ajralishi butunlay o'zgaradi!
              </p>
            </div>
          </div>
        )}

        {/* ── GEOMETRIYA ── */}
        {activeTab === "geometriya" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⬛ Kvadrat-planar vs Oktaedrik — UB-Vis farqi</h2>
            <p className="text-purple-200 leading-relaxed">
              Ni²⁺ (d⁸) ikki xil geometriyada mavjud bo'la oladi. UB-Vis spektri ularni ishonchli farqlash imkonini beradi.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
                <h3 className="text-green-400 font-bold mb-3">[Ni(CN)₄]²⁻ (Kvadrat-planar)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> D<sub>4h</sub><br/>
                  <strong>d-d:</strong> 420 nm (ε≈10)<br/>
                  <strong>MLCT:</strong> 320 nm (ε≈1000)<br/>
                  <strong>Magnit:</strong> Diamagnit<br/>
                  <strong>Rangi:</strong> Sariq
                </p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
                <h3 className="text-blue-400 font-bold mb-3">[Ni(H₂O)₆]²⁺ (Oktaedrik)</h3>
                <p className="text-purple-200 text-sm">
                  <strong>Simmetriya:</strong> O<sub>h</sub><br/>
                  <strong>d-d:</strong> 400, 700, 1100 nm<br/>
                  <strong>ε:</strong> ~2−5<br/>
                  <strong>Magnit:</strong> Paramagnit<br/>
                  <strong>Rangi:</strong> Yashil
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── BARQARORLIK ── */}
        {activeTab === "barqaror" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚡ Termodinamik barqaror, kinetik labil</h2>
            <p className="text-purple-200 leading-relaxed">
              [Ni(CN)₄]²⁻ — <strong className="text-yellow-400">termodinamik va kinetik barqarorlik farqining klassik namunasi</strong>.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">Termodinamik barqaror</h3>
                <p className="text-purple-200 text-sm">log β₄ ≈ 30<br/>ΔG° ≈ −171 kJ/mol<br/>Parchalanishi qiyin</p>
              </div>
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">Kinetik labil</h3>
                <p className="text-purple-200 text-sm">CN⁻ almashinuvi: tez<br/>d⁸ — past KMBE<br/>I<sub>d</sub> mexanizm</p>
              </div>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-300 text-sm">
                <strong>UB-Vis bilan bog'liqlik:</strong> Termodinamik barqarorlik yuqori bo'lsa-da, UB-Vis spektri 
                kinetik labillik haqida bevosita ma'lumot bermaydi — bu reaksiya tezligi bilan bog'liq.
              </p>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Kuchsiz d-d (420 nm, ε≈10)</strong> — Laporte-taqiq (D₄h)</li>
            <li><strong className="text-yellow-400">Kuchli MLCT (320 nm, ε≈1000)</strong> — UB sohada</li>
            <li><strong className="text-yellow-400">Sariq rang</strong> — binafsha nur yutilishi hisobiga</li>
            <li><strong className="text-yellow-400">Termodinamik barqaror</strong> (log β≈30), <strong>kinetik labil</strong></li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/ferrosen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Ferrosen
          </Link>
          <Link href="/ilmiy/tahlil/ub-vis/birikmalar/cu-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Cu(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}