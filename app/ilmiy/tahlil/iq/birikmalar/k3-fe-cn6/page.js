"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ── IQ SPEKTR GRAFIGI (Canvas) ────────────────────────────────────────────────
function IQSpektrGrafik({ peaks }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const W = canvas.width, H = canvas.height
    const PAD = { l: 60, r: 30, t: 30, b: 50 }
    const plotW = W - PAD.l - PAD.r
    const plotH = H - PAD.t - PAD.b

    const wnToX = (wn) => PAD.l + ((2300 - wn) / (2300 - 400)) * plotW
    const tToY  = (t)  => PAD.t + ((100 - t) / 100) * plotH

    ctx.clearRect(0, 0, W, H)
    
    // Fon
    ctx.fillStyle = "#0f0a1a"
    ctx.fillRect(0, 0, W, H)

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

    // Lorentz egri chizig'i
    function lorentz(wn, wn0, depth, width) {
      return depth / (1 + ((wn - wn0) / width) ** 2)
    }

    const peakDefs = [
      [2115, 92, 10], [2070, 50, 7], [830, 18, 20],
      [590, 75, 16], [508, 58, 14], [470, 44, 11], [440, 24, 9], [1630, 8, 22]
    ]

    // Spektr chizig'i
    ctx.beginPath()
    ctx.strokeStyle = "#4ade80"
    ctx.lineWidth = 1.8
    ctx.shadowBlur = 6
    ctx.shadowColor = "#4ade80"

    for (let wn = 400; wn <= 2300; wn += 2) {
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(wn), y = tToY(T)
      wn === 400 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
    ctx.shadowBlur = 0

    // Fill
    ctx.beginPath()
    for (let wn = 2300; wn >= 400; wn -= 2) {
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(wn), y = tToY(T)
      ctx.lineTo(x, y)
    }
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, PAD.t, 0, PAD.t + plotH)
    grad.addColorStop(0, "rgba(74,222,128,0.12)")
    grad.addColorStop(1, "rgba(74,222,128,0.01)")
    ctx.fillStyle = grad
    ctx.fill()

    // Peak belgilari
    peaks.forEach(p => {
      let absorb = 0
      peakDefs.forEach(([wn0, d, w]) => absorb += lorentz(p.wn, wn0, d, w))
      const T = Math.max(2, 98 - absorb)
      const x = wnToX(p.wn), y = tToY(T)

      ctx.beginPath()
      ctx.strokeStyle = p.color
      ctx.lineWidth = 0.8
      ctx.setLineDash([3, 2])
      ctx.moveTo(x, y - 2)
      ctx.lineTo(x, y - 28)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = p.color
      ctx.font = "bold 9px monospace"
      ctx.textAlign = "center"
      ctx.fillText(p.wn, x, y - 32)
    })

    // O'qlar
    ctx.strokeStyle = "#3d2a5c"
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t); ctx.lineTo(PAD.l, PAD.t + plotH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(PAD.l, PAD.t + plotH); ctx.lineTo(PAD.l + plotW, PAD.t + plotH); ctx.stroke()

    // X o'qi belgilari
    ctx.fillStyle = "#7c6a9e"; ctx.font = "10px sans-serif"; ctx.textAlign = "center"
    ;[2000,1800,1500,1200,1000,800,600,400].forEach(wn => {
      ctx.fillText(wn, wnToX(wn), PAD.t + plotH + 18)
    })
    
    // Y o'qi belgilari
    ctx.textAlign = "right"
    ;[20,40,60,80,100].forEach(t => {
      ctx.fillText(t + "%", PAD.l - 8, tToY(t) + 4)
    })

    // O'q nomlari
    ctx.fillStyle = "#7c6a9e"; ctx.font = "11px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("To'lqin soni (cm⁻¹)", PAD.l + plotW / 2, H - 6)
    ctx.save(); ctx.translate(14, PAD.t + plotH / 2)
    ctx.rotate(-Math.PI / 2); ctx.fillText("O'tkazuvchanlik T (%)", 0, 0); ctx.restore()

  }, [peaks])

  return (
    <canvas 
      ref={canvasRef} 
      width={820} 
      height={320}
      className="w-full h-auto rounded-xl border border-purple-700/50"
    />
  )
}

// ── ASOSIY SAHIFA ────────────────────────────────────────────────────────────
export default function K3FeCN6_IQ() {
  const [activeTab, setActiveTab] = useState("spektr")

  const peaks = [
    { wn: 2115, T: 8,  label: "ν(C≡N)", color: "#f87171", desc: "Juda kuchli — asosiy diagnostik signal. CN⁻ ligandining valent tebranishi." },
    { wn: 2070, T: 45, label: "ν(C≡N) overtone", color: "#fb923c", desc: "O'rta intensivlik — oktaedrik kristall maydonida C≡N bog'larining splittingi natijasida." },
    { wn: 830,  T: 78, label: "δ(C≡N)", color: "#60a5fa", desc: "Zaif — C≡N bog'ining bukilish (bending) tebranishi. Oktaedrik simmetriyaga xos." },
    { wn: 590,  T: 22, label: "ν(Fe–C)", color: "#22d3ee", desc: "Kuchli — metall-ligand bog'ining valent tebranishi. Fe³⁺−C bog'i mustahkamligini ko'rsatadi." },
    { wn: 508,  T: 38, label: "δ(C–Fe–C)", color: "#fbbf24", desc: "O'rta intensivlik — oktaedrik skelet deformatsion tebranishi. O<sub>h</sub> simmetriya." },
    { wn: 470,  T: 52, label: "δ(Fe–C–N)", color: "#a78bfa", desc: "O'rta — Fe−C≡N chiziqli zanjirining deformatsion tebranishi." },
    { wn: 440,  T: 72, label: "Tashqi sfera", color: "#86efac", desc: "Zaif — K⁺···NC kristall panjara tebranishlari. Tashqi sfera kationlari ta'siri." },
  ]

  const tabs = [
    { id: "spektr",   label: "📈 IQ Spektri" },
    { id: "jadval",   label: "📊 Cho'qqilar jadvali" },
    { id: "guruh",    label: "🔬 Guruh nazariyasi" },
    { id: "piback",   label: "🔄 π-Back-donatsiya" },
    { id: "taqqos",   label: "⚖️ Taqqoslash" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-purple-400 hover:text-purple-300 text-lg">← IQ birikmalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">K₃[Fe(CN)₆] — IQ spektri tahlili</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(III) • Qizil qon tuzi • Potassium hexacyanoferrate(III)</p>
        </div>
      </header>
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── HERO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">IQ Tahlil</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Oktaedrik</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">d⁵ quyi spin</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">KBr tabletka</span>
          </div>

          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent font-syne">
              K₃[Fe(CN)₆]
            </h2>
            <span className="text-purple-400 text-lg">329.24 g/mol</span>
          </div>

          <p className="text-purple-300 text-lg mb-4">
            kaliy geksasiyanoferrat(III) — <span className="text-red-400 italic">"Qizil qon tuzi"</span>
          </p>

          <p className="text-purple-200 leading-relaxed mb-6">
            <strong className="text-yellow-400">IQ spektri</strong> KBr tabletka usulida 4000−400 cm⁻¹ 
            oralig&apos;ida olingan. Eng muhim diagnostik signallar: 
            <strong className="text-yellow-400"> ν(C≡N) 2115 cm⁻¹</strong> — kuchli, o&apos;tkir polosa;
            <strong className="text-yellow-400"> ν(Fe−C) 590 cm⁻¹</strong> — metall-ligand bog&apos;i.
            CN⁻ ligandining π-akseptor xususiyati tufayli ν(C≡N) erkin CN⁻ ga nisbatan yuqori chastotaga siljigan.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Metall ioni</div>
              <div className="text-white font-bold">Fe³⁺</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">d-konfiguratsiya</div>
              <div className="text-white font-bold">d⁵ (quyi spin)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-white font-bold">Oktaedrik (O<sub>h</sub>)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center border border-purple-700/30">
              <div className="text-purple-400 text-xs mb-1">μ<sub>eff</sub></div>
              <div className="text-white font-bold">2.20 μ<sub>B</sub></div>
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
                  ? "bg-purple-600/60 text-white border border-purple-400/50"
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
            <h2 className="text-xl font-bold text-white">📈 IQ Spektri — K₃[Fe(CN)₆]</h2>
            
            <IQSpektrGrafik peaks={peaks} />

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
                <strong className="text-yellow-400">Eksperimental sharoit:</strong> KBr tabletka, 
                4000−400 cm⁻¹, xona harorati, 4 cm⁻¹ ruxsat. 
                <strong className="text-yellow-400"> Eng kuchli polosa:</strong> 2115 cm⁻¹ — 
                ν(C≡N) valent tebranishi, o&apos;tkir va intensiv.
              </p>
            </div>
          </div>
        )}

        {/* ── CHO'QQILAR JADVALI ── */}
        {activeTab === "jadval" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">📊 Cho&apos;qqilar jadvali va tahlili</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Chastota (cm⁻¹)</th>
                    <th className="py-3 px-4 text-purple-300">O&apos;tkazuvchanlik</th>
                    <th className="py-3 px-4 text-purple-300">Tebranish turi</th>
                    <th className="py-3 px-4 text-purple-300">Intensivlik</th>
                    <th className="py-3 px-4 text-purple-300">Tavsif</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {peaks.map((p, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono font-bold" style={{ color: p.color }}>{p.wn}</td>
                      <td className="py-3 px-4">{p.T}%</td>
                      <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: p.label }} />
                      <td className="py-3 px-4">
                        {p.T < 25 ? <span className="text-red-400">Kuchli</span> : 
                         p.T < 55 ? <span className="text-yellow-400">O&apos;rta</span> : 
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
            <h2 className="text-xl font-bold text-white">🔬 Guruh nazariyasi tahlili</h2>
            
            <p className="text-purple-200 leading-relaxed">
              [Fe(CN)₆]³⁻ ioni <strong className="text-yellow-400">O<sub>h</sub> nuqtali guruhga</strong> tegishli.
              Simmetriya tahlili orqali IQ-faol tebranishlar sonini bashorat qilish mumkin.
            </p>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Normal tebranish modlari</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>15 ta normal tebranish modi:</strong> Γ<sub>teb</sub> = A<sub>1g</sub> + E<sub>g</sub> + T<sub>1g</sub> + T<sub>2g</sub> + 2T<sub>1u</sub> + T<sub>2u</sub>
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">IQ-faol:</span>
                  <span className="text-purple-200"> 2T<sub>1u</sub> (ν₃ — valent, ν₄ — deformatsion)</span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <span className="text-blue-400 font-bold">Raman-faol:</span>
                  <span className="text-purple-200"> A<sub>1g</sub> + E<sub>g</sub> + T<sub>2g</sub></span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 text-sm">
                <strong>Alternativ taqiq:</strong> O<sub>h</sub> da inversiya markazi mavjud — 
                hech qaysi tebranish modi bir vaqtda ham IQ, ham Raman faol bo&apos;la olmaydi!
              </p>
            </div>
          </div>
        )}

        {/* ── π-BACK-DONATSIYA ── */}
        {activeTab === "piback" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">🔄 π-Back-donatsiya va ν(C≡N) siljishi</h2>
            
            <p className="text-purple-200 leading-relaxed">
              CN⁻ ligandining <strong className="text-yellow-400">π-akseptor</strong> xususiyati tufayli
              metallning d-elektronlari CN⁻ ning bo&apos;sh π* orbitallariga qaytadi. 
              Bu <strong className="text-yellow-400">π-back-donatsiya</strong> C≡N bog&apos;ini kuchsizlantiradi 
              va ν(C≡N) chastotasini o&apos;zgartiradi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Birikma</th>
                    <th className="py-3 px-4 text-purple-300">ν(C≡N) cm⁻¹</th>
                    <th className="py-3 px-4 text-purple-300">Δν</th>
                    <th className="py-3 px-4 text-purple-300">Izoh</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4">Erkin CN⁻</td>
                    <td className="py-3 px-4 font-mono">2080</td>
                    <td className="py-3 px-4">0</td>
                    <td className="py-3 px-4 text-sm">Etalon</td>
                  </tr>
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold text-red-400">K₃[Fe(CN)₆]</td>
                    <td className="py-3 px-4 font-mono text-red-400">2115</td>
                    <td className="py-3 px-4 text-red-400">+35</td>
                    <td className="py-3 px-4 text-sm">Fe³⁺ — kuchsiz π-donor</td>
                  </tr>
                  <tr className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold text-yellow-400">K₄[Fe(CN)₆]</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">2044</td>
                    <td className="py-3 px-4 text-yellow-400">−36</td>
                    <td className="py-3 px-4 text-sm">Fe²⁺ — kuchli π-donor</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <p className="text-orange-300 text-sm">
                <strong>Muhim xulosa:</strong> Fe³⁺ (d⁵, quyi spin) da d-elektronlar soni kam (t₂g⁵) — 
                π-back-donatsiya kuchsiz. Shuning uchun ν(C≡N) erkin CN⁻ dan yuqori. 
                Fe²⁺ (d⁶, quyi spin) da esa t₂g⁶ — kuchli π-back-donatsiya, ν(C≡N) past.
              </p>
            </div>
          </div>
        )}

        {/* ── TAQQOSLASH ── */}
        {activeTab === "taqqos" && (
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">⚖️ Qizil qon tuzi vs Sariq qon tuzi</h2>
            
            <p className="text-purple-200 leading-relaxed">
              K₃[Fe(CN)₆] va K₄[Fe(CN)₆] — <strong className="text-yellow-400">eng klassik taqqoslash</strong>.
              Faqat metall oksidlanish darajasi farq qiladi (Fe³⁺ vs Fe²⁺), lekin IQ spektrlari sezilarli farq qiladi.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Parametr</th>
                    <th className="py-3 px-4 text-purple-300">K₃[Fe(CN)₆] (Qizil)</th>
                    <th className="py-3 px-4 text-purple-300">K₄[Fe(CN)₆] (Sariq)</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Metall", "Fe³⁺ (d⁵, QS)", "Fe²⁺ (d⁶, QS)"],
                    ["ν(C≡N)", "2115 cm⁻¹", "2044 cm⁻¹"],
                    ["ν(Fe−C)", "590 cm⁻¹", "585 cm⁻¹"],
                    ["Rangi", "Qizil", "Sariq"],
                    ["Magnit", "Paramagnit (2.20 μ<sub>B</sub>)", "Diamagnit"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 text-red-300" dangerouslySetInnerHTML={{ __html: r[1] }} />
                      <td className="py-3 px-4 text-yellow-300" dangerouslySetInnerHTML={{ __html: r[2] }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ν(C≡N) = 2115 cm⁻¹</strong> — asosiy diagnostik signal, erkin CN⁻ dan yuqori</li>
            <li>Fe³⁺ (d⁵, QS) — <strong>kuchsiz π-back-donatsiya</strong>, shuning uchun C≡N chastotasi yuqori</li>
            <li><strong>ν(Fe−C) = 590 cm⁻¹</strong> — metall-ligand bog&apos;i mustahkamligini ko&apos;rsatadi</li>
            <li>O<sub>h</sub> simmetriya — <strong>alternativ taqiq</strong> amal qiladi (IQ ≠ Raman)</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar ro&apos;yxati
          </Link>
          <Link href="/ilmiy/tahlil/iq/birikmalar/k4-fe-cn6" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            K₄[Fe(CN)₆] →
          </Link>
        </div>

      </section>
    </main>
  )
}