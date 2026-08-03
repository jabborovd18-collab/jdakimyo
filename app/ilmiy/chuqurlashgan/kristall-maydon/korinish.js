"use client"

import Link from "next/link"
import { oqilganlar, belginiAlmashtir, mavzuniYangila } from "@/lib/oquv-progress"
import { useState, useEffect, useRef } from "react"

// ─── BOʻLIMLAR ───────────────────────────────────────────────────────────────
const BOLIMLAR = [
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/d-orbital-ajralishi",
    icon: "📐", num: "01",
    title: "d-orbital ajralishi",
    desc: "Oktaedrik, tetraedrik va kvadrat-planar maydonlarda 5 ta d-orbitalning energetik ajralishi. t₂g va e_g sathlari.",
    badge: "3D model", badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    level: "boshlangich", levelLabel: "Boshlang'ich", levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "30 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/ajralish-energiyasi",
    icon: "📊", num: "02",
    title: "Ajralish energiyasi (Δ₀)",
    desc: "Δ₀ qiymatiga taʼsir qiluvchi omillar: metall zaryadi, davri, ligand kuchi. Δ_tet = (4/9)Δ_okt munosabati.",
    badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    level: "orta", levelLabel: "Oʻrta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "35 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/spektrokimyoviy-qator",
    icon: "🧪", num: "03",
    title: "Spektrokimyoviy qator",
    desc: "Ligandlarning maydon kuchi boʻyicha toʻliq joylashuvi: I⁻ dan CO gacha. π-donor va π-akseptor taʼsiri.",
    badge: "To'liq jadval", badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    level: "orta", levelLabel: "Oʻrta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "30 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/kmbe-hisoblash",
    icon: "🔢", num: "04",
    title: "KMBE hisoblash",
    desc: "Kristall maydon barqarorlashish energiyasi. d¹−d¹⁰ konfiguratsiyalar uchun KMBE = (−0.4n_t₂g + 0.6n_e_g)Δ₀.",
    badge: "Hisoblash", badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    level: "ilgor", levelLabel: "Ilgʻor", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "40 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/yuqori-quyi-spin",
    icon: "🧲", num: "05",
    title: "Yuqori va quyi spin",
    desc: "P — juftlashish energiyasi. Δ₀ {">"} P → LS, Δ₀ < P → HS. d⁴, d⁵, d⁶, d⁷ konfiguratsiyalar uchun tahlil.",
    badge: "Muhim", badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    level: "ilgor", levelLabel: "Ilgʻor", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "35 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kristall-maydon/rang-spektrlar",
    icon: "🎨", num: "06",
    title: "Rang va spektrlar",
    desc: "d-d oʻtishlar, UB-Vis spektroskopiya, tanlash qoidalari: Laport, spin. Kompleks rangining sababi.",
    badge: "UB-Vis", badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
    level: "ilgor", levelLabel: "Ilgʻor", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "40 daqiqa"
  }
]

// ═══════════════════════════════════════════════════════════════════════════════
// 1. d-ORBITAL AJRALISHI VIZUALIZATSIYASI (CANVAS)
// ═══════════════════════════════════════════════════════════════════════════════
function DAjralishCanvas() {
  const [geo, setGeo] = useState("oh")
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const geoData = {
    oh: { name: "Oktaedrik (Oₕ)", split: "t₂g (3) + e_g (2)", delta: "Δ₀", levels: [
      { label: "e_g (d_z², d_x²−y²)", y: 1.8, col: "#ef4444", e: "+0.6Δ₀", n: 2 },
      { label: "t₂g (d_xy, d_xz, d_yz)", y: 0.6, col: "#22c55e", e: "−0.4Δ₀", n: 3 },
    ], note: "6 ta ligand → katta Δ₀. t₂g stabillashgan, e_g destabillashgan." },
    td: { name: "Tetraedrik (T_d)", split: "e (2) + t₂ (3) — teskari", delta: "Δ_t", levels: [
      { label: "t₂ (d_xy, d_xz, d_yz)", y: 1.2, col: "#ef4444", e: "+0.6Δ_t", n: 3 },
      { label: "e (d_z², d_x²−y²)", y: 0.0, col: "#22c55e", e: "−0.4Δ_t", n: 2 },
    ], note: "4 ta ligand → Δ_t = (4/9)Δ₀. Ajralish teskari!" },
    d4h: { name: "Kvadrat-planar (D₄h)", split: "b₂g + e_g + a₁g + b₁g", delta: "Δ_max", levels: [
      { label: "b₁g (d_x²−y²)", y: 2.2, col: "#dc2626", e: "+1.2Δ", n: 1 },
      { label: "b₂g (d_xy)", y: 1.4, col: "#f97316", e: "+0.6Δ", n: 1 },
      { label: "a₁g (d_z²)", y: 0.8, col: "#fbbf24", e: "+0.1Δ", n: 1 },
      { label: "e_g (d_xz, d_yz)", y: 0.0, col: "#22c55e", e: "−0.5Δ", n: 2 },
    ], note: "d⁸ metallar (Pt²⁺). 4 xil sath. Eng katta Δ." },
  }

  useEffect(() => {
    const cnv = canvasRef.current; if (!cnv) return
    const ctx = cnv.getContext("2d"); if (!ctx) return
    const w = cnv.width, h = cnv.height, cx = w/2, cy = h/2
    let t = 0
    function draw() {
      t += 0.02
      ctx.clearRect(0, 0, w, h)
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
      grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = "#a78bfa"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(`${geoData[geo].name} — d-orbital ajralishi`, cx, 16)

      const baseY = cy + 25
      const d = geoData[geo]

      // Bare center
      ctx.strokeStyle = "rgba(139,92,246,0.15)"; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(cx-100, baseY); ctx.lineTo(cx+100, baseY); ctx.stroke()
      ctx.fillStyle = "#a78bfa60"; ctx.font = "7px sans-serif"
      ctx.fillText("Erkin d-orbital (degenerat)", cx, baseY-4)

      // Levels
      d.levels.forEach((lv, i) => {
        const yPos = baseY - lv.y * 25
        const pulse = 1 + Math.sin(t + i*0.8) * 0.03
        const barW = 60 + lv.n * 10

        ctx.strokeStyle = lv.col; ctx.lineWidth = 2.5 * pulse
        ctx.beginPath(); ctx.moveTo(cx - barW/2, yPos); ctx.lineTo(cx + barW/2, yPos); ctx.stroke()
        ctx.fillStyle = lv.col; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "left"
        ctx.fillText(lv.label, cx + barW/2 + 5, yPos+2)
        ctx.fillStyle = "#fbbf24"; ctx.font = "6px sans-serif"; ctx.textAlign = "right"
        ctx.fillText(lv.e, cx - barW/2 - 5, yPos+2)
      })

      // Δ arrow
      if (d.levels.length >= 2) {
        const yLow = baseY - d.levels[d.levels.length-1].y * 25
        const yHigh = baseY - d.levels[0].y * 25
        ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(cx-80, yLow); ctx.lineTo(cx-80, yHigh); ctx.stroke()
        ctx.fillStyle = "#fbbf24"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
        ctx.fillText(d.delta, cx-80, (yLow + yHigh)/2 - 4)
      }

      ctx.fillStyle = "#a78bfa60"; ctx.font = "7px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(d.note, cx, h-10)
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [geo])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">💎</span> d-orbital ajralishi — interaktiv Canvas
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.keys(geoData).map(k => (
          <button key={k} onClick={() => setGeo(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${geo===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={geo===k?{background: geoData[k].levels[0].col+"44", borderColor: "#ffffff66"}:{}}>
            {geoData[k].name}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={360} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] mt-2">
        {geoData[geo].levels.map((lv, i) => (
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded p-1.5 flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{background:lv.col}} />
            <span className="text-purple-200">{lv.label}</span>
            <span className="ml-auto text-yellow-300 font-mono">{lv.e}</span>
            <span className="text-purple-500">×{lv.n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. VB vs MO vs KMN TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
function NazariyaTaqqoslash() {
  const [view, setView] = useState("kmn")

  const data = {
    kmn: { name:"Kristall maydon (KMN)", col:"#22c55e", desc:"Elektrostatik model. Ligandlar nuqtaviy manfiy zaryad sifatida qaraladi.",
      a:["d-orbital ajralishini tushuntiradi","Rang va spektrlarni izohlaydi","Magnetizmni (HS/LS) tushuntiradi","KMBE hisoblash imkonini beradi","Soddaligi va aniqligi"],
      b:["Kovalentlikni hisobga olmaydi","π-bog'lanishni to'liq izohlamaydi","Faqat d-elektronlarga qaratilgan"] },
    mo: { name:"Molekulyar orbital (MO)", col:"#3b82f6", desc:"LCAO — metall va ligand orbitallarining kombinatsiyasi.",
      a:["MO larni aniq tasvirlaydi","σ va π bog'lanishni izohlaydi","Spektr va magnetizmni tushuntiradi","Kompyuter hisoblariga asos"],
      b:["Murakkab, abstrakt","Katta sistemalarda hisob qiyin","Talaba uchun tushunish murakkab"] },
    vb: { name:"Valent bog'lanish (VB)", col:"#a855f7", desc:"Gibridlanish va qoplanish asosida.",
      a:["Geometriyani aniq bashorat qiladi","Gibridlanish tushunchasi foydali","Oddiy va vizual"],
      b:["Spektr va rangni tushuntirmaydi","Magnetizmni zaif tushuntiradi","π-bog'lanishni sunʼiy izohlaydi","Δ₀ ni hisoblamaydi"] },
  }

  const d = data[view]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">⚖️</span> VB vs MO vs KMN — nazariyalarni taqqoslash
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.keys(data).map(k => (
          <button key={k} onClick={() => setView(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={view===k?{background:data[k].col+"44",borderColor:data[k].col+"88"}:{}}>
            {data[k].name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl p-3 space-y-1 border" style={{background:d.col+"12",borderColor:d.col+"35"}}>
          <p className="font-bold text-sm" style={{color:d.col}}>{d.name}</p>
          <p className="text-purple-200">{d.desc}</p>
          <p className="text-green-400 font-bold mt-2">✅ Afzalliklari:</p>
          {d.a.map((s,i) => <p key={i} className="text-purple-200">• {s}</p>)}
        </div>
        <div className="rounded-xl p-3 space-y-1 border bg-red-600/10 border-red-500/30">
          <p className="font-bold text-sm text-red-400">❌ Kamchiliklari:</p>
          {d.b.map((s,i) => <p key={i} className="text-purple-200">• {s}</p>)}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-2">
            <p className="text-yellow-400 font-bold">⚡ KMN + MO = eng kuchli yondashuv</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. Δ₀ VA KMBE HISOBLASH
// ═══════════════════════════════════════════════════════════════════════════════
function KMBEHisoblash() {
  const [dConf, setDConf] = useState(6)
  const [spin, setSpin] = useState("ls")

  const data = {
    1: { ls: { kmbe: -0.4, e: "t₂g¹", n: 1 }, hs: null },
    2: { ls: { kmbe: -0.8, e: "t₂g²", n: 2 }, hs: null },
    3: { ls: { kmbe: -1.2, e: "t₂g³", n: 3 }, hs: null },
    4: { ls: { kmbe: -1.6, e: "t₂g⁴", n: 6 }, hs: { kmbe: -0.6, e: "t₂g³ e_g¹", n: 4 } },
    5: { ls: { kmbe: -2.0, e: "t₂g⁵", n: 5 }, hs: { kmbe: 0.0, e: "t₂g³ e_g²", n: 5 } },
    6: { ls: { kmbe: -2.4, e: "t₂g⁶", n: 6 }, hs: { kmbe: -0.4, e: "t₂g⁴ e_g²", n: 6 } },
    7: { ls: { kmbe: -1.8, e: "t₂g⁶ e_g¹", n: 7 }, hs: { kmbe: -0.8, e: "t₂g⁵ e_g²", n: 7 } },
    8: { ls: { kmbe: -1.2, e: "t₂g⁶ e_g²", n: 8 }, hs: { kmbe: -1.2, e: "t₂g⁶ e_g²", n: 8 } },
    9: { ls: { kmbe: -0.6, e: "t₂g⁶ e_g³", n: 9 }, hs: null },
    10: { ls: { kmbe: 0.0, e: "t₂g⁶ e_g⁴", n: 10 }, hs: null },
  }

  const canSpin = data[dConf] && data[dConf].hs !== null
  const actualSpin = spin === "hs" && canSpin ? "hs" : "ls"
  const state = actualSpin === "ls" ? data[dConf].ls : data[dConf].hs

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-yellow-400">🔢</span> KMBE hisoblash — interaktiv
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <span className="text-purple-400 text-xs px-2 py-1">d<sup>n</sup>:</span>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => {setDConf(n); if(data[n].hs===null)setSpin("ls")}}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${dConf===n?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>d<sup>{n}</sup>
          </button>
        ))}
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setSpin("ls")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${spin==="ls"?"bg-green-600/50 text-white":"bg-purple-800/30 text-purple-400"}`}>Low-spin (LS)</button>
        <button onClick={() => setSpin("hs")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${spin==="hs"?"bg-red-600/50 text-white":"bg-purple-800/30 text-purple-400"}`}>High-spin (HS)</button>
        {!canSpin && <span className="text-purple-400 text-[9px]">— faqat bitta spin mumkin</span>}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">d<sup>{dConf}</sup> — {actualSpin==="ls"?"Low-spin":"High-spin"}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{state.e}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Juftlanmagan e⁻:</span><span className="text-red-300 font-mono">{state.n % 2}</span></p>
          </div>
        </div>
        <div className="space-y-1">
          <div className={`rounded-lg p-3 text-center border ${actualSpin==="ls"?"bg-green-600/10 border-green-500/30":"bg-red-600/10 border-red-500/30"}`}>
            <p className="text-purple-400 text-[9px]">KMBE = (−0.4 × n_t₂g + 0.6 × n_e_g) × Δ₀</p>
            <p className="text-yellow-300 font-mono text-lg font-bold">KMBE = {state.kmbe}Δ₀</p>
            <p className="text-purple-300">KMBE(Oh) = {state.kmbe > 0 ? "+" : ""}{state.kmbe} × Δ₀</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2 text-[9px]">
            <p className="text-yellow-400 font-bold">⚡ KMBE = (−0.4n_t₂g + 0.6n_e_g) × Δ₀</p>
            <p className="text-purple-200">KMBE barqaror komplekslarda maksimal. t₂g elektronlari stabillashadi (−0.4Dq), e_g elektronlari destabillashadi (+0.6Dq).</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Δ₀ GA TA'SIR QILUVCHI OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
function DeltaOmillar() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">⚡</span> Δ₀ ga taʼsir qiluvchi omillar
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-400 font-bold">1. Geometriya</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 space-y-0.5">
            <p className="flex justify-between"><span className="text-purple-300">O_h:</span><span className="text-green-300 font-mono">1.0</span></p>
            <p className="flex justify-between"><span className="text-purple-300">D₄h:</span><span className="text-cyan-300 font-mono">~1.7×</span></p>
            <p className="flex justify-between"><span className="text-purple-300">T_d:</span><span className="text-orange-300 font-mono">~0.44×</span></p>
          </div>
          <p className="text-purple-200">Δ_tet = (4/9)Δ_okt. Kv. planar eng katta.</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-400 font-bold">2. Metall zaryadi</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 space-y-0.5">
            <p className="flex justify-between"><span className="text-purple-300">M²⁺:</span><span className="text-green-300 font-mono">1.0 (ref)</span></p>
            <p className="flex justify-between"><span className="text-purple-300">M³⁺:</span><span className="text-cyan-300 font-mono">~1.5−2×</span></p>
          </div>
          <p className="text-purple-200">Yuqori zaryad → kuchli tortishish → katta Δ₀.</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-400 font-bold">3. Metall davri</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 space-y-0.5">
            <p className="flex justify-between"><span className="text-purple-300">3d:</span><span className="text-green-300 font-mono">1.0</span></p>
            <p className="flex justify-between"><span className="text-purple-300">4d:</span><span className="text-cyan-300 font-mono">~1.45×</span></p>
            <p className="flex justify-between"><span className="text-purple-300">5d:</span><span className="text-amber-300 font-mono">~1.75×</span></p>
          </div>
          <p className="text-purple-200">d-orbital kengligi ortishi bilan Δ₀ ortadi.</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-400 font-bold">4. Ligand</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 space-y-0.5">
            <p className="flex justify-between"><span className="text-purple-300">CO:</span><span className="text-green-300 font-mono">katta</span></p>
            <p className="flex justify-between"><span className="text-purple-300">NH₃:</span><span className="text-cyan-300 font-mono">oʼrtacha</span></p>
            <p className="flex justify-between"><span className="text-purple-300">Cl⁻:</span><span className="text-red-300 font-mono">kichik</span></p>
          </div>
          <p className="text-purple-200">π-akseptor (CO) → Δ₀↑, π-donor (Cl⁻) → Δ₀↓.</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. HS vs LS — SPIN HOLATI TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
function SpinHolati() {
  const [conf, setConf] = useState("d6")

  const data = {
    d4: { name: "d⁴", ls: { e: "t₂g⁴", s: 1, mu: 2.83 }, hs: { e: "t₂g³ e_g¹", s: 2, mu: 4.90 } },
    d5: { name: "d⁵", ls: { e: "t₂g⁵", s: 0.5, mu: 1.73 }, hs: { e: "t₂g³ e_g²", s: 2.5, mu: 5.92 } },
    d6: { name: "d⁶", ls: { e: "t₂g⁶", s: 0, mu: 0 }, hs: { e: "t₂g⁴ e_g²", s: 2, mu: 4.90 } },
    d7: { name: "d⁷", ls: { e: "t₂g⁶ e_g¹", s: 0.5, mu: 1.73 }, hs: { e: "t₂g⁵ e_g²", s: 1.5, mu: 3.87 } },
  }
  const d = data[conf] || data.d6

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">🧲</span> Yuqori (HS) va quyi (LS) spin holatlari
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.keys(data).map(k => (
          <button key={k} onClick={() => setConf(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${conf===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>{data[k].name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-3 space-y-1">
          <p className="text-green-400 font-bold">Quyi spin (LS) — Δ₀ {">"} P</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{d.ls.e}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Spin (S):</span><span className="text-green-300 font-mono">S = {d.ls.s}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Moment:</span><span className="text-green-300 font-mono">μ = {d.ls.mu} μ_B</span></p>
            <p className="text-purple-300">{d.ls.s === 0 ? "Diamagnit" : "Paramagnit"}</p>
          </div>
        </div>
        <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-3 space-y-1">
          <p className="text-red-400 font-bold">Yuqori spin (HS) — Δ₀ {"<"} P</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{d.hs.e}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Spin (S):</span><span className="text-red-300 font-mono">S = {d.hs.s}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Moment:</span><span className="text-red-300 font-mono">μ = {d.hs.mu} μ_B</span></p>
            <p className="text-purple-300">Paramagnit</p>
          </div>
        </div>
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-2">
        <p className="text-yellow-400 font-bold">HS ↔ LS oʻtish sharti:</p>
        <p className="text-purple-200">Δ₀ {'>'} P → elektronlar juftlashadi (LS, diamagnit). Δ₀ {'<'} P → elektronlar alohida joylashadi (HS, paramagnit).</p>
        <p className="text-purple-300 mt-1">P — juftlashish energiyasi (~20000−25000 cm⁻¹). Kuchli ligand (CN⁻) → Δ₀ {">"} P → LS. Kuchsiz ligand (F⁻) → Δ₀ {'<'} P → HS.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. RANG VA d-d O'TISHLAR
// ═══════════════════════════════════════════════════════════════════════════════
function RangSpektr() {
  const [color, setColor] = useState("sariq")

  const colors = {
    sariq: { komp: "[Co(NH₃)₆]³⁺", delta: 23000, lam: 435, sabab: "¹A₁g → ¹T₁g", intensiv: "Kuchsiz (Laport taqiqlangan)" },
    kok: { komp: "[CoCl₄]²⁻", delta: 7000, lam: 1428, sabab: "⁴A₂ → ⁴T₁(P)", intensiv: "Kuchli (inversiya yoʻq)" },
    yashil: { komp: "[Fe(H₂O)₆]²⁺", delta: 10400, lam: 962, sabab: "⁵T₂g → ⁵E_g", intensiv: "Kuchsiz" },
    qizil: { komp: "[Fe(CN)₆]³⁻", delta: 24000, lam: 417, sabab: "²T₂g → ²A₂g,²T₁g", intensiv: "Kuchsiz" },
    binafsha: { komp: "[Ti(H₂O)₆]³⁺", delta: 20000, lam: 500, sabab: "²T₂g → ²E_g", intensiv: "Kuchsiz" },
    rangsiz: { komp: "[Zn(NH₃)₄]²⁺", delta: 0, lam: 0, sabab: "d¹⁰ — d-d oʻtish yoʻq", intensiv: "Rangsiz" },
  }
  const d = colors[color]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-pink-400">🎨</span> Rang va d-d oʻtishlar
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.keys(colors).map(k => (
          <button key={k} onClick={() => setColor(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${color===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={color===k?{borderColor:"#ffffff88"}:{}}>
            {k === "sariq" ? "🟡 Sariq" : k === "kok" ? "🔵 Koʻk" : k === "yashil" ? "🟢 Yashil" : k === "qizil" ? "🔴 Qizil" : k === "binafsha" ? "🟣 Binafsha" : "⚪ Rangsiz"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">{d.komp}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-cyan-300 font-mono">{d.delta.toLocaleString()} cm⁻¹</span></p>
            <p className="flex justify-between"><span className="text-purple-400">λ<sub>yutilish</sub>:</span><span className="text-amber-300 font-mono">{d.lam > 0 ? d.lam + " nm" : "—"}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Oʻtish:</span><span className="text-green-300 font-mono">{d.sabab}</span></p>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Spektral izoh:</p>
          <p className="text-purple-200">{d.intensiv}</p>
          <p className="text-purple-200">d-d oʻtish energiyasi = Δ₀ = hc/λ</p>
          {d.lam > 0 && <p className="text-purple-200">λ = 1/ν̃ = 1/{d.delta} cm⁻¹ ≈ {d.lam} nm</p>}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400 font-bold">⚡ Tanlash qoidalari:</p>
            <p className="text-purple-200">Laport: g → g taqiqlangan (kuchsiz). Spin: ΔS = 0 ruxsat.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. KMN DIAFAN — SPEKTROKIMYOVIY QATOR
// ═══════════════════════════════════════════════════════════════════════════════
function SpektroQator() {
  const ligands = [
    { n: "I⁻", d: 7000, c: "#ef4444", t: "π-donor" },
    { n: "Br⁻", d: 7600, c: "#f97316", t: "π-donor" },
    { n: "Cl⁻", d: 13000, c: "#eab308", t: "π-donor" },
    { n: "F⁻", d: 15000, c: "#84cc16", t: "π-donor" },
    { n: "H₂O", d: 18500, c: "#22c55e", t: "σ-donor" },
    { n: "NH₃", d: 23000, c: "#3b82f6", t: "σ-donor" },
    { n: "en", d: 25000, c: "#6366f1", t: "σ-donor" },
    { n: "CN⁻", d: 33000, c: "#a855f7", t: "π-akseptor" },
    { n: "CO", d: 35000, c: "#ec4899", t: "π-akseptor" },
    { n: "NO⁺", d: 36000, c: "#be123c", t: "π-akseptor" },
  ]
  const maxD = 36000

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">📊</span> Spektrokimyoviy qator — KMN asosida
      </h3>
      <div className="flex items-end gap-1 h-28 mb-3">
        {ligands.map((l, i) => (
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div className="text-[6px] text-yellow-300 mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{l.t}</div>
            <div className="w-full rounded-t-lg transition-all group-hover:scale-105" style={{height:`${(l.d/maxD)*100}%`, minHeight:"6px", background:l.c, opacity:0.8}} />
            <div className="text-[7px] sm:text-[9px] font-bold text-purple-300 group-hover:text-white mt-0.5">{l.n}</div>
            <div className="text-[6px] text-purple-500">{l.d.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px]">
        <p className="text-yellow-400 font-bold">Spektrokimyoviy qator:</p>
        <p className="text-purple-200">I⁻ {'<'} Br⁻ {'<'} Cl⁻ {'<'} F⁻ {'<'} H₂O {'<'} NH₃ {'<'} en {'<'} CN⁻ {'<'} CO {'<'} NO⁺</p>
        <p className="text-purple-300 mt-1">π-donor (I⁻…F⁻) → t₂g↑ → Δ₀↓ | σ-donor (H₂O…en) → neytral | π-akseptor (CN⁻…NO⁺) → t₂g↓ → Δ₀↑</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function Test() {
  const questions = [
    { q:"Oₕ da d-orbitallar nechta IRREPS ga ajraladi?", a:"2 ta: t₂g (3) + e_g (2)", opts:["1 ta","2 ta: t₂g (3) + e_g (2)","3 ta","4 ta"], hint:"5 ta d-orbital → t₂g (3) + e_g (2)." },
    { q:"T_d da d-ajralish qanday tartibda?", a:"E (past) + T₂ (yuqori) — teskari", opts:["t₂g (past) + e_g (yuqori) — toʻgʻri","E (past) + T₂ (yuqori) — teskari","4 xil sath","faqat bitta sath"], hint:"Tetraedrikda teskari." },
    { q:"Kvadrat-planar geometriyada (D₄h) eng yuqori energiyali d-orbital qaysi?", a:"d_x²−y² (b₁g)", opts:["d_z² (a₁g)","d_xy (b₂g)","d_x²−y² (b₁g)","d_xz, d_yz (e_g)"], hint:"d⁸ da d_x²−y² LUMO." },
    { q:"KMBE formulasi?", a:"KMBE = (−0.4n_t₂g + 0.6n_e_g) × Δ₀", opts:["KMBE = n_t₂g − n_e_g","KMBE = (−0.4n_t₂g + 0.6n_e_g) × Δ₀","KMBE = (n_t₂g + n_e_g) × Δ₀","KMBE = 0.4(n_t₂g − n_e_g)"], hint:"t₂g stabillashadi, e_g destabillashadi." },
    { q:"LS va HS oʻrtasidagi tanlov nima bilan belgilanadi?", a:"Δ₀ vs P (juftlashish energiyasi)", opts:["Metallning zaryadi","Δ₀ vs P (juftlashish energiyasi)","Ligandning zaryadi","Harorat"], hint:"Δ₀ {">"} P → LS, Δ₀ < P → HS." },
    { q:"d⁶ LS konfiguratsiyasi (O_h) uchun KMBE?", a:"−2.4Δ₀ (t₂g⁶)", opts:["−0.4Δ₀ (t₂g⁴ e_g²)","−2.4Δ₀ (t₂g⁶)","+0.4Δ₀","−1.6Δ₀"], hint:"t₂g⁶ → 6×(−0.4) = −2.4Δ₀." },
    { q:"[Ti(H₂O)₆]³⁺ (d¹) qanday rangda?", a:"Binafsha (Δ₀ ≈ 20000 cm⁻¹)", opts:["Rangsiz (d¹⁰)","Binafsha (Δ₀ ≈ 20000 cm⁻¹)","Koʻk (Δ₀ ≈ 7000)","Sariq (Δ₀ ≈ 23000)"], hint:"d¹ → ²T₂g → ²E_g. 500 nm → binafsha." },
    { q:"Δ₀(4d) / Δ₀(3d) nisbati taxminan qancha?", a:"~1.45", opts:["~0.5","~1.0","~1.45","~2.0"], hint:"4d → ~1.45×, 5d → ~1.75×." },
    { q:"d-d oʻtishning Laport qoidasi boʻyicha taqiqlanishi nima deydi?", a:"g → g taqiqlangan (inversiya markazi bor)", opts:["g → u taqiqlangan","g → g taqiqlangan (inversiya markazi bor)","u → u taqiqlangan","Hech qanday taqiq yoʻq"], hint:"Oₕ va D₄h da inversiya bor → d-d kuchsiz." },
    { q:"d⁷ HS konfiguratsiyadagi magnit moment? (μ = √(n(n+2)))", a:"μ = √(3×5) = 3.87 μ_B", opts:["μ = √(5×7) = 5.92 μ_B","μ = √(3×5) = 3.87 μ_B","μ = √(4×6) = 4.90 μ_B","μ = 0 μ_B"], hint:"d⁷ HS → 3 ta juftlanmagan e⁻. n=3 → μ=√(3×5)=3.87." },
  ]
  const [c,setC]=useState(0);const [s,setS]=useState(null);const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false);const [ans,setAns]=useState({})
  const q=questions[c]
  if(res){return(
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc>=8?"🏆":sc>=5?"👍":"📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc>=8?"KMN ni mukammal oʻzlashtirdingiz!":sc>=5?"Yaxshi, ammo takrorlash kerak.":"Qayta oʻqib chiqing."}</p>
        <button onClick={()=>{setC(0);setS(null);setSc(0);setRes(false);setAns({})}} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
      </div></div>
  )}
  return(
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>!s&&(()=>{setS(opt);const ok=opt===q.a;if(ok&&!ans[c])setSc(p=>p+1);setAns(p=>({...p,[c]:ok}))})()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s===opt?(opt===q.a?"bg-green-600/20 border-green-500 text-green-200":"bg-red-600/20 border-red-500 text-red-200"):s?(opt===q.a?"bg-green-600/20 border-green-500 text-green-200 opacity-60":"bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50"):"bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}
            </button>
          ))}
        </div>
        {s&&(
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s===q.a?"bg-green-600/10 border-green-500 text-green-300":"bg-red-600/10 border-red-500 text-red-300"}`}>{s===q.a?"✅ Toʻgʻri!":"❌ Notoʻgʻri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={()=>{if(c<questions.length-1){setC(p=>p+1);setS(null)}else setRes(true)}} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c<questions.length-1?"Keyingi →":"Natijalarni koʻrish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function KristallMaydon() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setMounted(true)
    setProgress(oqilganlar())
  }, [])

  const toggleProgress = (href) => {
    belginiAlmashtir(href)
    // Barcha bo'limlar o'qilsa, mavzuning o'zi ham belgilanadi —
    // shunda bosh sahifadagi progress o'zi o'sadi.
    setProgress(mavzuniYangila("/ilmiy/chuqurlashgan/kristall-maydon", BOLIMLAR.map(b => b.href)))
  }

  const stats = {
    total: BOLIMLAR.length,
    // Faqat shu mavzuning bo'limlari sanaladi — belgilar xaritasi
    // umumiy, ya'ni boshqa mavzudagi belgilar ham unda bo'ladi.
    completed: BOLIMLAR.filter(b => progress[b.href]).length,
    totalTime: BOLIMLAR.reduce((s, b) => s + parseInt(b.time), 0)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <span className="text-green-400">Kristall maydon</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-green-400 flex items-center gap-2"><span>💎</span> Kristall maydon nazariyasi</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">d-orbital ajralishi • Δ₀ • KMBE • HS/LS • Spektrokimyoviy qator • Rang • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* Kirish */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Kristall maydon nazariyasi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Kristall maydon nazariyasi (KMN)</strong> — kompleks 
                birikmalarning <strong className="text-cyan-300">rangi, magnit xossalari va geometriyasini</strong> 
                tushuntiruvchi elektrostatik model. Ligandlar <strong>nuqtaviy manfiy zaryadlar</strong> 
                sifatida qaralib, ularning d-orbitallarga taʼsiri <strong>t₂g va e_g</strong> sathlariga 
                ajralishga olib keladi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">{stats.total} ta bo'lim</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">Canvas vizual</span>
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 py-0.5 rounded-full text-[10px]">KMBE hisoblash</span>
                <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-green-400 font-bold">🎯 Maqsad:</span> d-orbital ajralishi, Δ₀, KMBE, HS/LS va spektrokimyoviy qatorni oʻzlashtirish.</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">⏱ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">📚 Manba:</span> H. Bethe — Kristall maydon nazariyasi (1929); Cotton — Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-green-300 font-mono text-xs font-bold">KMBE = (−0.4n_t₂g + 0.6n_e_g) × Δ₀</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistika */}
        <div className={`grid grid-cols-3 gap-3 transition-all duration-700 ${mounted?"opacity-100":"opacity-0"}`}>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-purple-300">{stats.total}</div>
            <div className="text-[10px] text-purple-400 mt-1">📚 Bo'limlar</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-300">{stats.completed}</div>
            <div className="text-[10px] text-emerald-400 mt-1">✅ Oʻqilgan</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-300">{Math.round(stats.totalTime/60)} soat</div>
            <div className="text-[10px] text-amber-400 mt-1">⏱ Umumiy</div>
          </div>
        </div>

        {/* Boʻlimlar */}
        <div className="space-y-3">
          {BOLIMLAR.map((b, i) => (
            <div key={b.href}
              className={`group relative bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-700/40 rounded-xl transition-all duration-500 hover:bg-purple-800/50 hover:scale-[1.005] ${progress[b.href]?"ring-1 ring-emerald-500/30":""}`}
              style={{animation: mounted?`fadeIn 0.5s ease-out ${i*0.08}s both`:"none"}}>
              <Link href={b.href} className="block p-3 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-purple-800/60 border border-purple-600/40 items-center justify-center">
                    <span className="text-sm font-bold text-purple-400">{b.num}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">{b.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-green-400 transition-colors">{b.title}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold whitespace-nowrap ${b.badgeColor}`}>{b.badge}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${b.levelColor} whitespace-nowrap`}>{b.levelLabel}</span>
                    </div>
                    <p className="text-[11px] text-purple-300/80 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] text-purple-500 whitespace-nowrap">⏱ {b.time}</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </div>
                </div>
              </Link>
              <button onClick={(e)=>{e.preventDefault();toggleProgress(b.href)}}
                className={`absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${progress[b.href]?"bg-emerald-500 border-emerald-400 text-white":"border-purple-600/50 hover:border-purple-400 bg-purple-950/50"}`}
                title={progress[b.href]?"Oʻqilgan":"Oʻqildi"}>
                {progress[b.href] && <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </button>
            </div>
          ))}
        </div>

        {/* Interaktiv komponentlar */}
        <DAjralishCanvas />
        <NazariyaTaqqoslash />
        <KMBEHisoblash />
        <DeltaOmillar />
        <SpinHolati />
        <RangSpektr />
        <SpektroQator />

        {/* Test */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* Xulosa */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">KMN</strong> — ligandlarni nuqtaviy zaryad deb qaraydigan elektrostatik model</li>
            <li><strong className="text-yellow-400">d-ajralish:</strong> Oₕ → t₂g (3) + e_g (2). T_d → e (2) + t₂ (3) — teskari. D₄h → 4 xil sath</li>
            <li><strong className="text-yellow-400">KMBE</strong> = (−0.4n_t₂g + 0.6n_e_g) × Δ₀. d⁶ LS → −2.4Δ₀ (eng katta). d¹⁰, d⁵ HS → 0</li>
            <li><strong className="text-yellow-400">Δ₀ omillari:</strong> Geometriya (Oₕ {'<'} D₄h), Metall (3d {'<'} 4d {'<'} 5d), Zaryad (M²⁺ {'<'} M³⁺), Ligand (π-donor {'<'} π-akseptor)</li>
            <li><strong className="text-yellow-400">HS ↔ LS:</strong> Δ₀ {">"} P → LS (diamagnit). Δ₀ {'<'} P → HS (paramagnit). d⁴, d⁵, d⁶, d⁷</li>
            <li><strong className="text-yellow-400">Spektrokimyoviy qator:</strong> I⁻ (7k) {'<'} Br⁻ {'<'} Cl⁻ {'<'} F⁻ {'<'} H₂O {'<'} NH₃ {'<'} en {'<'} CN⁻ {'<'} CO {'<'} NO⁺ (36k)</li>
            <li><strong className="text-yellow-400">Rang:</strong> d-d oʻtish = Δ₀ = hc/λ. Laport taqiqlangan (Oₕ, D₄h), spin ruxsat (ΔS=0)</li>
          </ol>
        </div>

        {/* Navigatsiya */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Kimyoviy bog'lanish
          </Link>
          <Link href="/ilmiy/chuqurlashgan"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-green-500/20">
            Chuqurlashgan mavzular <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> H. Bethe — Kristall maydon nazariyasi (1929); F.A. Cotton — Chemical Applications of Group Theory</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}