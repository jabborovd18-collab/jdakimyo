"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SHREDINGER TENGLAMASI — INTERAKTIV MATN
// ═══════════════════════════════════════════════════════════════════════════════
function ShredingerTenglamasi() {
  const [section, setSection] = useState("umumiy")

  const sections = {
    umumiy: {
      title: "Umumiy Shredinger tenglamasi",
      desc: "Kvant mexanikasining asosiy tenglamasi — sistema holatini to'liq tavsiflaydi",
      formula: "Ĥ|ψ⟩ = E|ψ⟩",
      items: [
        "Ĥ — Gamilton operatori (energiya operatori)",
        "|ψ⟩ — sistema to'lqin funksiyasi",
        "E — sistema energiyasi (xos qiymat)"
      ],
      note: "Bu tenglama vaqtga bog'liq bo'lmagan Shredinger tenglamasi. Uni yechish orqali atomdagi elektronning mumkin bo'lgan energiya holatlari va ularga mos to'lqin funksiyalari topiladi.",
      color: "text-red-400",
      bg: "bg-red-600/10 border-red-500/30"
    },
    ucheb: {
      title: "Uch o'lchovli Shredinger tenglamasi",
      desc: "Sferik koordinatalarda — atom tuzilishiga tadbiq",
      formula: "−ℏ²/2m ∇²ψ + Vψ = Eψ",
      items: [
        "∇² — Laplas operatori (∂²/∂x² + ∂²/∂y² + ∂²/∂z²)",
        "V — potensial energiya (yadro uchun V = −Ze²/4πϵ₀r)",
        "ℏ = h/2π — qisqartirilgan Plank doimiysi",
        "m — elektron massasi"
      ],
      note: "Vodorod atomi uchun V = −e²/4πϵ₀r (Kulon potensiali). Bu tenglamaning aniq yechimi mavjud va kvant sonlarini (n, l, mₗ) keltirib chiqaradi.",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    ajralish: {
      title: "Radial va burchak qismga ajralish",
      desc: "To'lqin funksiyasi radial (R) va burchak (Y) qismlarga ajraladi",
      formula: "ψ(r,θ,φ) = Rₙₗ(r) · Yₗᵐ(θ,φ)",
      items: [
        "Rₙₗ(r) — radial qism (faqat r ga bog'liq)",
        "Yₗᵐ(θ,φ) — sferik harmonikalar (θ va φ ga bog'liq)",
        "n — bosh kvant soni (energiya)",
        "l — orbital kvant soni (burchak moment)",
        "m — magnit kvant soni (fazoviy yo'nalish)"
      ],
      note: "Radial qism orbitalning o'lchamini, sferik harmonikalar esa shaklini belgilaydi. d-orbitallar (l=2) uchun 5 ta sferik harmonika mavjud.",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    },
    dorbital: {
      title: "d-orbitallar uchun to'lqin funksiyalari",
      desc: "l=2 (d-orbitallar) uchun 5 ta sferik harmonika",
      formula: "Y₂⁰ = √(5/16π) · (3cos²θ−1)  →  d_z²",
      items: [
        "Y₂¹ ∝ sinθ·cosθ·e^{iφ}  →  d_xz, d_yz",
        "Y₂² ∝ sin²θ·e^{2iφ}  →  d_xy, d_x²−y²",
        "Har bir Yₗᵐ ortonormal — ∫ Yₗᵐ*·Yₗ'ᵐ' dΩ = δₗₗ'·δₘₘ'",
        "Haqiqiy d-orbitallar — chiziqli kombinatsiyalar natijasi"
      ],
      note: "Sferik harmonikalar Y₂ᵐ ni chiziqli kombinatsiyalab, haqiqiy d-orbitallar (d_xy, d_xz, d_yz, d_z², d_x²−y²) olinadi. Bu 5 ta orbital fazoda 5 xil yo'nalishga ega.",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const s = sections[section]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-red-400">Ψ</span> Shredinger tenglamasi — kvant mexanik asoslar
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(sections).map(([key, val]) => (
          <button key={key} onClick={() => setSection(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              section === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            {val.title.split("—")[0].trim()}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-6 border ${s.bg}`}>
        <h4 className={`font-bold text-lg mb-2 ${s.color}`}>{s.title}</h4>
        <p className="text-purple-200 text-sm mb-4">{s.desc}</p>

        <div className="bg-purple-950/70 rounded-xl p-5 mb-4 border border-purple-700/30">
          <p className="text-center text-2xl text-yellow-300 font-mono tracking-wider">
            {s.formula}
          </p>
        </div>

        <div className="space-y-2 mb-4">
          {s.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.color.replace("text", "bg")}`} />
              <span className="text-purple-200">{item}</span>
            </div>
          ))}
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Fizik ma'nosi:</p>
          <p className="text-purple-200">{s.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. D-ORBITAL SHAKLLARI — 3D VIZUAL + MATEMATIKA
// ═══════════════════════════════════════════════════════════════════════════════
function DOrbitalShakllari() {
  const [selected, setSelected] = useState("dz2")

  const orbitals = {
    dz2: {
      name: "d_z²",
      ml: "mₗ = 0",
      formula: "Y₂⁰ ∝ (3cos²θ − 1)",
      shape: "Ikki 'barg' z o'qi bo'ylab + ekvatorda halqa",
      phase: "+ z o'qida, − ekvatorda",
      energyOh: "e_g (yuqori)",
      energyTd: "e (past)",
      desc: "Ikki tomonga cho'zilgan + ekvatorda manfiy halqa. z o'qi bo'ylab yo'nalgan ligandlar bilan kuchli ta'sir.",
      color: "#fbbf24",
      bg: "bg-yellow-600/10 border-yellow-500/30",
      text: "text-yellow-400",
      canvas: (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h)
        const cx = w/2, cy = h/2, sc = 35
        ctx.strokeStyle = "#fbbf24"; ctx.fillStyle = "rgba(251,191,36,0.15)"
        ctx.lineWidth = 2

        // Z o'qi bo'ylab 2 barg
        for (let sign of [-1, 1]) {
          ctx.beginPath()
          for (let t = -1.2; t <= 1.2; t += 0.05) {
            const r = 0.8 * Math.sqrt(Math.abs(3*t*t - 1)) * sc
            const x = t * sc * 1.2
            const y = sign * r * 0.8
            t === -1.2 ? ctx.moveTo(cx + x, cy + y) : ctx.lineTo(cx + x, cy + y)
          }
          ctx.stroke(); ctx.fill()
        }
        // Halqa
        ctx.beginPath(); ctx.ellipse(cx, cy, 0.6*sc, 0.2*sc, 0, 0, Math.PI*2)
        ctx.strokeStyle = "#f59e0b"; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([])
        ctx.fillStyle = "rgba(245,158,11,0.1)"; ctx.fill()
        ctx.fillStyle = "#fbbf24"; ctx.font = "10px monospace"
        ctx.fillText("z", cx, 12); ctx.fillText("dz²", cx+10, h-8)
      }
    },
    dx2y2: {
      name: "d_x²−y²",
      ml: "mₗ = ±2",
      formula: "Y₂² ∝ sin²θ · cos2φ",
      shape: "4 ta 'barg' x va y o'qlari bo'ylab, 45° da nol",
      phase: "+ x va y o'qlarida musbat, − 45° da manfiy",
      energyOh: "e_g (eng yuqori)",
      energyTd: "e (past)",
      desc: "To'rtta barg x va y o'qlari bo'ylab yo'nalgan. Kvadrat tekis (D4h) geometriyada eng yuqori orbital.",
      color: "#ef4444",
      bg: "bg-red-600/10 border-red-500/30",
      text: "text-red-400",
      canvas: (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h)
        const cx = w/2, cy = h/2, sc = 30
        ctx.strokeStyle = "#ef4444"; ctx.fillStyle = "rgba(239,68,68,0.15)"
        ctx.lineWidth = 2
        // 4 barg — x va y o'qlari bo'ylab
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const y = Math.sin(angle) * t * sc * 1.5
            const xx = x + Math.cos(angle + Math.PI/2) * r * 0.6
            const yy = y + Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + xx, cy + yy) : ctx.lineTo(cx + xx, cy + yy)
          }
          ctx.stroke()
          // fill qarama-qarshi
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const y = Math.sin(angle) * t * sc * 1.5
            const xx = x - Math.cos(angle + Math.PI/2) * r * 0.6
            const yy = y - Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + xx, cy + yy) : ctx.lineTo(cx + xx, cy + yy)
          }
          ctx.fill()
        }
        ctx.fillStyle = "#ef4444"; ctx.font = "10px monospace"
        ctx.fillText("x", w-15, cy+4); ctx.fillText("y", cx-3, 14)
        ctx.fillText("dx²-y²", cx+10, h-8)
      }
    },
    dxy: {
      name: "d_xy",
      ml: "mₗ = ±2",
      formula: "Y₂² ∝ sin²θ · sin2φ",
      shape: "4 ta 'barg' x=y va x=−y yo'nalishlarida (45°)",
      phase: "I va III choraklarda musbat, II va IV da manfiy",
      energyOh: "t₂g (past)",
      energyTd: "t₂ (yuqori)",
      desc: "To'rtta barg koordinata o'qlari orasida (45° burchak ostida). Oktaedrik maydonda t₂g guruhiga kiradi.",
      color: "#3b82f6",
      bg: "bg-blue-600/10 border-blue-500/30",
      text: "text-blue-400",
      canvas: (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h)
        const cx = w/2, cy = h/2, sc = 30
        ctx.strokeStyle = "#3b82f6"; ctx.fillStyle = "rgba(59,130,246,0.15)"
        ctx.lineWidth = 2
        for (let i = 0; i < 4; i++) {
          const angle = i * Math.PI / 2 + Math.PI/4
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const y = Math.sin(angle) * t * sc * 1.5
            const xx = x + Math.cos(angle + Math.PI/2) * r * 0.6
            const yy = y + Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + xx, cy + yy) : ctx.lineTo(cx + xx, cy + yy)
          }
          ctx.stroke()
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const y = Math.sin(angle) * t * sc * 1.5
            const xx = x - Math.cos(angle + Math.PI/2) * r * 0.6
            const yy = y - Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + xx, cy + yy) : ctx.lineTo(cx + xx, cy + yy)
          }
          ctx.fill()
        }
        ctx.fillStyle = "#3b82f6"; ctx.font = "10px monospace"
        ctx.fillText("dxy", cx+10, h-8)
      }
    },
    dxz: {
      name: "d_xz",
      ml: "mₗ = ±1",
      formula: "Y₂¹ ∝ sinθ·cosθ·cosφ",
      shape: "4 ta 'barg' xz tekisligida, y o'qi bo'ylab nol",
      phase: "I va III choraklarda musbat",
      energyOh: "t₂g (past)",
      energyTd: "t₂ (yuqori)",
      desc: "To'rtta barg xz tekisligida yo'nalgan. y o'qi bo'ylab tugun tekisligi mavjud.",
      color: "#10b981",
      bg: "bg-emerald-600/10 border-emerald-500/30",
      text: "text-emerald-400",
      canvas: (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h)
        const cx = w/2, cy = h/2, sc = 30
        ctx.strokeStyle = "#10b981"; ctx.fillStyle = "rgba(16,185,129,0.15)"
        ctx.lineWidth = 2
        for (let angle of [0, Math.PI]) {
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const z = Math.sin(angle) * t * sc * 1.5
            const dx = Math.cos(angle + Math.PI/2) * r * 0.6
            const dz = Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + x + dx, cy + z + dz) : ctx.lineTo(cx + x + dx, cy + z + dz)
          }
          ctx.stroke()
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const x = Math.cos(angle) * t * sc * 1.5
            const z = Math.sin(angle) * t * sc * 1.5
            const dx = -Math.cos(angle + Math.PI/2) * r * 0.6
            const dz = -Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + x + dx, cy + z + dz) : ctx.lineTo(cx + x + dx, cy + z + dz)
          }
          ctx.fill()
        }
        ctx.fillStyle = "#10b981"; ctx.font = "10px monospace"
        ctx.fillText("dxz", cx+10, h-8)
      }
    },
    dyz: {
      name: "d_yz",
      ml: "mₗ = ±1",
      formula: "Y₂¹ ∝ sinθ·cosθ·sinφ",
      shape: "4 ta 'barg' yz tekisligida, x o'qi bo'ylab nol",
      phase: "I va III choraklarda musbat",
      energyOh: "t₂g (past)",
      energyTd: "t₂ (yuqori)",
      desc: "To'rtta barg yz tekisligida yo'nalgan. x o'qi bo'ylab tugun tekisligi mavjud.",
      color: "#8b5cf6",
      bg: "bg-violet-600/10 border-violet-500/30",
      text: "text-violet-400",
      canvas: (ctx, w, h) => {
        ctx.clearRect(0, 0, w, h)
        const cx = w/2, cy = h/2, sc = 30
        ctx.strokeStyle = "#8b5cf6"; ctx.fillStyle = "rgba(139,92,246,0.15)"
        ctx.lineWidth = 2
        for (let angle of [Math.PI/2, 3*Math.PI/2]) {
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const y = Math.cos(angle) * t * sc * 1.5
            const z = Math.sin(angle) * t * sc * 1.5
            const dy = Math.cos(angle + Math.PI/2) * r * 0.6
            const dz = Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + y + dy, cy + z + dz) : ctx.lineTo(cx + y + dy, cy + z + dz)
          }
          ctx.stroke()
          ctx.beginPath()
          for (let t = -0.8; t <= 0.8; t += 0.05) {
            const r = 1.2 * Math.cos(t * Math.PI) * sc
            const y = Math.cos(angle) * t * sc * 1.5
            const z = Math.sin(angle) * t * sc * 1.5
            const dy = -Math.cos(angle + Math.PI/2) * r * 0.6
            const dz = -Math.sin(angle + Math.PI/2) * r * 0.6
            t === -0.8 ? ctx.moveTo(cx + y + dy, cy + z + dz) : ctx.lineTo(cx + y + dy, cy + z + dz)
          }
          ctx.fill()
        }
        ctx.fillStyle = "#8b5cf6"; ctx.font = "10px monospace"
        ctx.fillText("dyz", cx+10, h-8)
      }
    }
  }

  const o = orbitals[selected]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-purple-400">🎯</span> d-orbitallarning shakli va matematik ifodasi
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(orbitals).map(([key, val]) => (
          <button key={key} onClick={() => setSelected(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              selected === key 
                ? `${val.bg} ${val.text} scale-105` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}>
            {val.name}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-6 border ${o.bg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas vizual */}
          <div className="bg-purple-950/70 rounded-xl p-3 border border-purple-700/30 h-48 flex items-center justify-center">
            <canvas
              ref={(el) => { if (el) o.canvas(el.getContext("2d"), 300, 170) }}
              width={300} height={170}
              className="w-full h-full max-w-[300px] max-h-[170px]"
            />
          </div>

          {/* Ma'lumot */}
          <div className="space-y-3">
            <h4 className={`font-bold text-lg ${o.text}`}>
              {o.name} orbitali <span className="text-purple-400 text-sm font-mono">({o.ml})</span>
            </h4>
            <div className="bg-purple-950/70 rounded-lg p-3 border border-purple-700/30">
              <p className="text-yellow-300 font-mono text-sm">{o.formula}</p>
            </div>
            <div className="space-y-1 text-xs">
              <p className="text-purple-200"><span className="text-purple-400">Shakli:</span> {o.shape}</p>
              <p className="text-purple-200"><span className="text-purple-400">Faza:</span> {o.phase}</p>
              <p className="text-purple-200"><span className="text-purple-400">O_h da:</span> {o.energyOh}</p>
              <p className="text-purple-200"><span className="text-purple-400">T_d da:</span> {o.energyTd}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">🔬 Fizik talqin:</p>
          <p className="text-purple-200">{o.desc}</p>
        </div>
      </div>

      {/* Umumiy jadval */}
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-800/60">
                <th className="p-3 text-left text-purple-300 font-semibold">Orbital</th>
                <th className="p-3 text-left text-purple-300 font-semibold">mₗ</th>
                <th className="p-3 text-left text-purple-300 font-semibold">Matematik ifoda</th>
                <th className="p-3 text-left text-purple-300 font-semibold hidden md:table-cell">Simmetriya</th>
                <th className="p-3 text-left text-purple-300 font-semibold hidden md:table-cell">O_h dagi energiya</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(orbitals).map(([key, val], i) => (
                <tr key={key} className={`${i % 2 === 0 ? "bg-purple-900/30" : "bg-purple-900/10"} hover:bg-purple-800/30 cursor-pointer`}
                  onClick={() => setSelected(key)}>
                  <td className="p-3 font-bold" style={{ color: val.color }}>{val.name}</td>
                  <td className="p-3 text-purple-300 font-mono">{val.ml}</td>
                  <td className="p-3 text-purple-200 font-mono text-[10px]">{val.formula}</td>
                  <td className="p-3 text-purple-300 hidden md:table-cell">
                    {key === "dz2" ? "a₁g" : key === "dx2y2" ? "b₁g" : key === "dxy" ? "b₂g" : "e_g"}
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded ${key === "dz2" || key === "dx2y2" ? "bg-red-600/20 text-red-300" : "bg-blue-600/20 text-blue-300"}`}>
                      {val.energyOh.split(" ")[0]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ELEKTRON KONFIGURATSIYA — dⁿ JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function ElektronKonfiguratsiya() {
  const [selectedD, setSelectedD] = useState("d8")

  const configs = {
    d0: { ions: "Sc³⁺, Ti⁴⁺, Ca²⁺", config: "—", spins: "—", mag: "Diamagnit", color: "text-gray-400", oh: "t₂g⁰ e_g⁰", hs: "—", ls: "—" },
    d1: { ions: "Ti³⁺, V⁴⁺", config: "↑", spins: "1", mag: "Paramagnit (μ=1.73 BM)", color: "text-red-400", oh: "t₂g¹ e_g⁰", hs: "—", ls: "—" },
    d2: { ions: "V³⁺, Mo⁴⁺", config: "↑↑", spins: "2", mag: "Paramagnit (μ=2.83 BM)", color: "text-orange-400", oh: "t₂g² e_g⁰", hs: "—", ls: "—" },
    d3: { ions: "Cr³⁺, V²⁺, Mo³⁺", config: "↑↑↑", spins: "3", mag: "Paramagnit (μ=3.87 BM)", color: "text-amber-400", oh: "t₂g³ e_g⁰", hs: "—", ls: "—" },
    d4: { ions: "Cr²⁺, Mn³⁺, Mo²⁺", config: "↑↑↑↑", spins: "4/2", mag: "HS: paramagnit, LS: paramagnit", color: "text-yellow-400", oh: "t₂g³ e_g¹", hs: "t₂g³ e_g¹ (4)", ls: "t₂g⁴ e_g⁰ (2)" },
    d5: { ions: "Mn²⁺, Fe³⁺, Ru³⁺", config: "↑↑↑↑↑", spins: "5/1", mag: "HS: paramagnit (μ=5.92 BM)", color: "text-lime-400", oh: "t₂g³ e_g²", hs: "t₂g³ e_g² (5)", ls: "t₂g⁵ e_g⁰ (1)" },
    d6: { ions: "Fe²⁺, Co³⁺, Ru²⁺", config: "↑↑↑↑↑↑", spins: "4/0", mag: "HS: paramagnit, LS: diamagnit", color: "text-green-400", oh: "t₂g⁴ e_g²", hs: "t₂g⁴ e_g² (4)", ls: "t₂g⁶ e_g⁰ (0)" },
    d7: { ions: "Co²⁺, Ni³⁺, Rh²⁺", config: "↑↑↑↑↑↑↑", spins: "3/1", mag: "HS: paramagnit, LS: paramagnit", color: "text-emerald-400", oh: "t₂g⁵ e_g²", hs: "t₂g⁵ e_g² (3)", ls: "t₂g⁶ e_g¹ (1)" },
    d8: { ions: "Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺", config: "↑↓↑↓↑↓↑↓", spins: "2", mag: "Paramagnit (μ=2.83 BM)", color: "text-cyan-400", oh: "t₂g⁶ e_g²", hs: "—", ls: "—" },
    d9: { ions: "Cu²⁺, Ag²⁺, Au²⁺", config: "↑↓↑↓↑↓↑↓↑", spins: "1", mag: "Paramagnit (Jahn-Teller aktiv)", color: "text-sky-400", oh: "t₂g⁶ e_g³", hs: "—", ls: "—" },
    d10: { ions: "Cu⁺, Ag⁺, Au⁺, Zn²⁺", config: "↑↓↑↓↑↓↑↓↑↓", spins: "0", mag: "Diamagnit", color: "text-blue-400", oh: "t₂g⁶ e_g⁴", hs: "—", ls: "—" },
  }

  const c = configs[selectedD]

  const getElectronDots = (config) => {
    const count = parseInt(selectedD.replace("d", ""))
    const dots = []
    for (let i = 0; i < 5; i++) {
      if (i < count) {
        // Xund qoidasi — birinchi 5 ta parallel
        if (i < 5 && i < count) {
          if (count <= 5) dots.push("↑")
          else if (count <= 10) dots.push(i < count - 5 ? "↑↓" : "↑")
        }
      } else dots.push("·")
    }
    return dots
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-cyan-400">🔄</span> d-elektron konfiguratsiyalar (d¹–d¹⁰)
      </h3>

      <div className="flex gap-1.5 flex-wrap">
        {Object.keys(configs).map(key => (
          <button key={key} onClick={() => setSelectedD(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedD === key
                ? `${configs[key].color} bg-purple-700/50 border-purple-500`
                : "text-purple-300 bg-purple-900/40 hover:bg-purple-800/50 border border-purple-800/30"
            }`}>
            {key}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-6 border ${c.color.replace("text", "bg").replace("text-", "bg-")}/10`}
        style={{ borderColor: c.color.replace("text-", "") + "/30" }}>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className={`font-bold text-lg ${c.color}`}>{selectedD} konfiguratsiyasi</h4>
            
            {/* Orbital diagramma — 5 ta orbital */}
            <div className="space-y-2">
              {["d_xy", "d_xz", "d_yz", "d_z²", "d_x²−y²"].map((name, i) => {
                const elCount = Math.max(0, Math.min(2, parseInt(selectedD.replace("d","")) - i * 2))
                const dots = []
                const remaining = parseInt(selectedD.replace("d",""))
                let left = remaining
                for (let j = 0; j < 5; j++) {
                  if (j < i) left -= 2
                  else if (j === i) {
                    if (left >= 2) { dots.push("↑↓"); left -= 2 }
                    else if (left === 1) { dots.push("↑"); left -= 1 }
                    else dots.push("·")
                  }
                }
                // Simplified
                const fill = remaining <= 5 
                  ? (i < remaining ? "↑" : "·")
                  : (i < remaining - 5 ? "↑↓" : (i < remaining ? "↑" : "·"))
                
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-purple-400 text-[10px] w-14 text-right font-mono">{name}</span>
                    <div className="flex-1 h-5 bg-purple-950/70 rounded border border-purple-700/30 flex items-center px-2">
                      <span className={`font-bold text-sm ${fill === "·" ? "text-purple-700" : c.color}`}>{fill}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-purple-950/50 rounded-lg p-3 space-y-1 text-xs">
              <p className="text-purple-200"><span className="text-purple-400">Ionlar:</span> {c.ions}</p>
              <p className="text-purple-200"><span className="text-purple-400">O_h da:</span> {c.oh}</p>
              <p className="text-purple-200"><span className="text-purple-400">Juftlanmagan spinlar:</span> <span className="text-yellow-300">{c.spins}</span></p>
              <p className="text-purple-200"><span className="text-purple-400">Magnit xossa:</span> {c.mag}</p>
            </div>
          </div>

          {/* Spin holatlari */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white">Spin holatlari (OKTAEDRIK maydonda)</h4>
            
            {selectedD === "d4" || selectedD === "d5" || selectedD === "d6" || selectedD === "d7" ? (
              <div className="space-y-3">
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 font-bold text-xs mb-1">Yuqori spin (HS) — kuchsiz maydon</p>
                  <p className="text-purple-200 text-sm font-mono">{c.hs}</p>
                  <p className="text-purple-300 text-xs mt-1">Δₒ &lt; P (juftlashuv energiyasidan kichik)</p>
                </div>
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                  <p className="text-red-400 font-bold text-xs mb-1">Past spin (LS) — kuchli maydon</p>
                  <p className="text-purple-200 text-sm font-mono">{c.ls}</p>
                  <p className="text-purple-300 text-xs mt-1">Δₒ &gt; P (juftlashuv energiyasidan katta)</p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
                  <p className="text-yellow-400 font-bold mb-1">⚡ Muhim:</p>
                  <p className="text-purple-200">Kuchsiz ligandlar (I⁻, Br⁻, Cl⁻) → HS. Kuchli ligandlar (CN⁻, CO) → LS. O'rta ligandlar (H₂O, NH₃) — ikkala holat mumkin.</p>
                </div>
              </div>
            ) : (
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  {selectedD === "d8" ? "d⁸: Oktaedrikda t₂g⁶e_g² — faqat bitta spin holat. 2 ta juftlanmagan elektron." 
                   : selectedD === "d9" ? "d⁹: Oktaedrikda t₂g⁶e_g³ — Jahn-Teller effekti kuzatiladi. 1 ta juftlanmagan."
                   : selectedD === "d0" || selectedD === "d10" ? "To'liq to'lgan yoki bo'sh qobiq — diamagnit."
                   : "Faqat bitta spin holat mumkin."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. KRISTALL MAYDON — CFSE KALKULYATOR
// ═══════════════════════════════════════════════════════════════════════════════
function CFSEKalkulyator() {
  const [geometry, setGeometry] = useState("oktaedrik")
  const [dCount, setDCount] = useState(6)
  const [deltaO, setDeltaO] = useState(20000)

  const cfseResult = useMemo(() => {
    let result = { cfse: 0, hs_cfse: 0, ls_cfse: 0, hs_spin: 0, ls_spin: 0, note: "" }
    const d = dCount

    if (geometry === "oktaedrik") {
      if (d <= 5) { // HS = LS for d1-d3
        const t2g = d, eg = 0
        result.cfse = (-0.4 * t2g + 0.6 * eg)
        result.hs_cfse = result.cfse; result.ls_cfse = result.cfse
        result.hs_spin = d; result.ls_spin = d
      } else if (d <= 7) { // d4-d7: HS vs LS
        const hs_t2g = d - 5, hs_eg = 5 - (d - hs_t2g)
        const ls_t2g = 6 - (10 - d), ls_eg = d - 6
        result.hs_cfse = -0.4 * (d - 5) + 0.6 * 5
        result.ls_cfse = -0.4 * d + 0.6 * 0
        result.hs_spin = d - 4; result.ls_spin = 6 - d
        result.cfse = deltaO > 25000 ? result.ls_cfse : result.hs_cfse
      } else { // d8-d10
        const t2g = 6, eg = d - 6
        result.cfse = -0.4 * 6 + 0.6 * (d - 6)
        result.hs_cfse = result.cfse; result.ls_cfse = result.cfse
        result.hs_spin = 10 - d; result.ls_spin = 10 - d
      }
    } else if (geometry === "tetraedrik") {
      // T_d: t₂ (yuqori), e (past) — teskari
      if (d <= 3) {
        result.cfse = (0.6 * d)
        result.hs_cfse = result.cfse; result.ls_cfse = result.cfse
        result.hs_spin = d; result.ls_spin = d
      } else if (d <= 5) {
        result.cfse = 0.6 * 3 + (-0.4) * (d - 3)
        result.hs_cfse = result.cfse; result.ls_cfse = result.cfse
        result.hs_spin = d; result.ls_spin = d
      } else if (d <= 8) {
        result.cfse = 0.6 * 3 + (-0.4) * 2 + 0.6 * (d - 5)
        result.hs_cfse = result.cfse; result.ls_cfse = result.cfse
        result.hs_spin = d - 4; result.ls_spin = d - 4
      } else {
        result.cfse = 0
        result.hs_spin = 10 - d; result.ls_spin = 10 - d
      }
    } else if (geometry === "kvadrat") {
      // D4h: approximated
      if (d <= 8) {
        result.cfse = -0.6 * d + 0.4
        result.hs_spin = d > 4 ? d - 4 : 0
        result.ls_spin = d > 4 ? d - 4 : 0
      } else {
        result.cfse = -0.6 * 8 + 0.4 + (-0.4) * (d - 8)
        result.hs_spin = 10 - d; result.ls_spin = 10 - d
      }
    }

    result.cfse = Math.round(result.cfse * 100) / 100
    result.hs_cfse = Math.round(result.hs_cfse * 100) / 100
    result.ls_cfse = Math.round(result.ls_cfse * 100) / 100
    result.energy = (result.cfse * deltaO * 0.012).toFixed(1)
    result.hs_energy = (result.hs_cfse * deltaO * 0.012).toFixed(1)
    result.ls_energy = (result.ls_cfse * deltaO * 0.012).toFixed(1)

    return result
  }, [geometry, dCount, deltaO])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-orange-400">🧮</span> Kristall maydon barqarorlik energiyasi (KMBE) — kalkulyator
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Boshqaruv */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5 space-y-4">
          <div>
            <p className="text-purple-300 text-xs mb-2">Geometriya:</p>
            <div className="flex gap-2">
              {[
                { id: "oktaedrik", label: "Oktaedrik (O_h)" },
                { id: "tetraedrik", label: "Tetraedrik (T_d)" },
                { id: "kvadrat", label: "Kvadrat (D4h)" }
              ].map(g => (
                <button key={g.id} onClick={() => setGeometry(g.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    geometry === g.id ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                  }`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 text-xs mb-2">d-elektronlar soni (dⁿ):</p>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({length: 11}, (_, i) => i).map(n => (
                <button key={n} onClick={() => setDCount(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    dCount === n ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"
                  }`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-purple-300 text-xs mb-2">Δₒ (cm⁻¹): <span className="text-yellow-300">{deltaO.toLocaleString()}</span></p>
            <input type="range" min={5000} max={40000} step={500} value={deltaO}
              onChange={(e) => setDeltaO(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-purple-800 cursor-pointer"
              style={{ accentColor: "#a855f7" }}
            />
            <div className="flex justify-between text-[10px] text-purple-500 mt-1">
              <span>Kuchsiz (5 000)</span>
              <span>Kuchli (40 000)</span>
            </div>
          </div>
        </div>

        {/* Natija */}
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5 space-y-3">
          <h4 className="text-white font-bold text-sm">KMBE natijalari</h4>
          
          <div className="bg-purple-950/70 rounded-lg p-4 text-center border border-purple-700/30">
            <p className="text-purple-400 text-xs">KMBE (Δₒ birligida)</p>
            <p className="text-4xl font-bold text-yellow-300 font-mono">{cfseResult.cfse.toFixed(2)} <span className="text-lg">Δₒ</span></p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-2 text-center">
              <p className="text-blue-400 text-[10px]">Yuqori spin (HS)</p>
              <p className="text-white font-bold font-mono">{cfseResult.hs_cfse.toFixed(2)} Δₒ</p>
              <p className="text-blue-300 text-[10px]">{cfseResult.hs_energy} kJ/mol</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-center">
              <p className="text-red-400 text-[10px]">Past spin (LS)</p>
              <p className="text-white font-bold font-mono">{cfseResult.ls_cfse.toFixed(2)} Δₒ</p>
              <p className="text-red-300 text-[10px]">{cfseResult.ls_energy} kJ/mol</p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-center">
            <p className="text-yellow-400 text-[10px]">Energiya ekvivalenti</p>
            <p className="text-white font-bold font-mono text-lg">{cfseResult.energy} kJ/mol</p>
          </div>

          <div className="text-[10px] text-purple-400">
            {dCount <= 5 || dCount >= 8 
              ? "⚠️ Bu konfiguratsiyada HS va LS bir xil (yagona spin holat)"
              : `💡 d${dCount}: Δₒ = ${deltaO.toLocaleString()} cm⁻¹, juftlashuv energiyasi P ≈ 20 000 cm⁻¹`}
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SPEKTROKIMYOVIY QATOR — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrokimyoviyQator() {
  const ligands = [
    { name: "I⁻", delta: 0.4, color: "bg-red-500", barColor: "#ef4444" },
    { name: "Br⁻", delta: 0.5, color: "bg-orange-500", barColor: "#f97316" },
    { name: "Cl⁻", delta: 0.6, color: "bg-yellow-500", barColor: "#eab308" },
    { name: "F⁻", delta: 0.7, color: "bg-lime-500", barColor: "#84cc16" },
    { name: "H₂O", delta: 0.8, color: "bg-cyan-500", barColor: "#06b6d4" },
    { name: "NH₃", delta: 0.9, color: "bg-blue-500", barColor: "#3b82f6" },
    { name: "en", delta: 0.95, color: "bg-indigo-500", barColor: "#6366f1" },
    { name: "CN⁻", delta: 1.0, color: "bg-violet-500", barColor: "#8b5cf6" },
    { name: "CO", delta: 1.1, color: "bg-purple-500", barColor: "#a855f7" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-cyan-400">📊</span> Spektrokimyoviy qator — ligandlarning maydon kuchi
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <div className="flex items-end gap-2 h-40 mb-3">
          {ligands.map(l => (
            <div key={l.name} className="flex-1 flex flex-col items-center group">
              <div className="text-[9px] text-purple-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {Math.round(l.delta * 30000)} cm⁻¹
              </div>
              <div className={`w-full rounded-t-lg group-hover:scale-105 transition-transform ${l.color}`}
                style={{ height: `${l.delta * 70}px`, minHeight: "28px" }} />
              <div className="text-[11px] font-bold mt-1.5 text-purple-300 group-hover:text-white transition-colors">
                {l.name}
              </div>
              <div className="text-[8px] text-purple-500">{l.delta.toFixed(1)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[10px] text-purple-400 mb-3">
          <span className="text-red-400">🔴 Kuchsiz maydon</span>
          <span className="text-purple-400">← Kuch ortib boradi →</span>
          <span className="text-purple-400">🔵 Kuchli maydon</span>
        </div>

        <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-purple-200">
            <strong className="text-yellow-400">Spektrokimyoviy qator</strong> — ligandlarning kristall maydon ajralishiga ta'sir kuchiga qarab tartiblangan qatori:
          </p>
          <p className="text-purple-300 font-mono text-[11px]">
            I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; CN⁻ &lt; CO
          </p>
          <p className="text-purple-300 mt-1">
            <span className="text-purple-400">σ-donor ligandlar:</span> NH₃, H₂O — o'rta kuch<br/>
            <span className="text-purple-400">π-akseptor ligandlar:</span> CN⁻, CO — kuchli maydon<br/>
            <span className="text-purple-400">π-donor ligandlar:</span> I⁻, Br⁻ — kuchsiz maydon
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. BILIM TEKSHIRISH — TESTLAR
// ═══════════════════════════════════════════════════════════════════════════════
function TestSavollari() {
  const questions = [
    { q: "d-orbitallarning soni nechta?", a: "5", opts: ["3", "5", "7", "10"], hint: "l=2 uchun mₗ = −2,−1,0,+1,+2" },
    { q: "Oktaedrik maydonda qaysi d-orbitallar yuqori energiyaga ega?", a: "e_g (d_z², d_x²−y²)", opts: ["t₂g (d_xy, d_xz, d_yz)", "e_g (d_z², d_x²−y²)", "Barchasi bir xil", "Faqat d_z²"], hint: "Ligandlarga to'g'ri yo'nalgan orbitallar" },
    { q: "d⁸ konfiguratsiyali ionning magnit momenti (BM)?", a: "2.83", opts: ["0", "1.73", "2.83", "5.92"], hint: "μ = √n(n+2), n=2" },
    { q: "Kvadrat tekis geometriya qaysi metallar uchun xarakterli?", a: "d⁸ (Pt²⁺, Pd²⁺, Au³⁺)", opts: ["d⁵ (Fe³⁺, Mn²⁺)", "d⁸ (Pt²⁺, Pd²⁺, Au³⁺)", "d¹⁰ (Zn²⁺, Cu⁺)", "d³ (Cr³⁺, V²⁺)"], hint: "Kuchli maydon ligandlari + d⁸" },
    { q: "Jahn-Teller effekti qaysi konfiguratsiyalarda kuzatiladi?", a: "d⁴, d⁹ (yuqori spin), d⁷ (past spin)", opts: ["d⁰, d¹⁰", "d⁴, d⁹ (HS), d⁷ (LS)", "d⁵, d⁶", "d¹, d²"], hint: "Degenerat sathlarda elektronlar assimetrik taqsimlangan" },
    { q: "KMBE formulasi (oktaedrik)?", a: "KMBE = −0.4·n(t₂g) + 0.6·n(e_g)", opts: ["KMBE = 0.4·n(t₂g) − 0.6·n(e_g)", "KMBE = −0.4·n(t₂g) + 0.6·n(e_g)", "KMBE = −0.6·n(t₂g) + 0.4·n(e_g)", "KMBE = 0.6·n(t₂g) − 0.4·n(e_g)"], hint: "t₂g stabilizatsiya, e_g destabilizatsiya" },
    { q: "To'lqin funksiyasi ψ³·ψ² ning fizik ma'nosi?", a: "Elektron ehtimollik zichligi", opts: ["Energiya", "Elektron ehtimollik zichligi", "Burchak momenti", "Spin"], hint: "Born talqini — |ψ|²" },
    { q: "Kuchli maydon ligandlari qaysi spinni hosil qiladi?", a: "Past spin (LS)", opts: ["Yuqori spin (HS)", "Past spin (LS)", "Ikkalasi ham", "Spinsiz"], hint: "Δₒ > P → elektronlar juftlashadi" },
    { q: "Qaysi kvant soni orbitalning fazoviy yo'nalishini belgilaydi?", a: "Magnit (mₗ)", opts: ["Bosh (n)", "Orbital (l)", "Magnit (mₗ)", "Spin (mₛ)"], hint: "−l dan +l gacha qiymatlar" },
    { q: "d_z² orbitalining shakli qanday?", a: "2 barg + ekvatorial halqa", opts: ["4 barg x va y o'qlarida", "2 barg + ekvatorial halqa", "4 barg 45° da", "8 barg"], hint: "Y₂⁰ ∝ 3cos²θ−1" },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState({})

  const q = questions[current]

  const checkAnswer = (opt) => {
    setSelected(opt)
    const isCorrect = opt === q.a
    if (isCorrect && !answers[current]) setScore(s => s + 1)
    setAnswers(prev => ({ ...prev, [current]: isCorrect }))
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
    } else {
      setShowResult(true)
    }
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setScore(0); setShowResult(false); setAnswers({})
  }

  if (showResult) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{score >= 8 ? "🏆" : score >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{score}/{questions.length}</p>
          <p className="text-purple-300 mt-2">{score >= 8 ? "A'lo! Siz ushbu mavzuni mukammal o'zlashtirdingiz!" : score >= 5 ? "Yaxshi! Yana bir oz takrorlash kerak." : "Qayta o'rganib, yana urinib ko'ring."}</p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={restart} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">
              Qayta boshlash
            </button>
            <Link href="/ilmiy/chuqurlashgan" className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 text-purple-200 rounded-lg text-sm transition-all border border-purple-700/40">
              Mavzularga qaytish
            </Link>
          </div>
        </div>
        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={i} className={`text-xs p-3 rounded-lg ${
              answers[i] ? "bg-green-600/10 border border-green-500/30" : "bg-red-600/10 border border-red-500/30"
            }`}>
              <p className={answers[i] ? "text-green-400" : "text-red-400"}>
                <strong>{i+1}.</strong> {q.q}
              </p>
              {!answers[i] && <p className="text-purple-300 mt-1">✓ {q.a}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg">
        <span className="text-emerald-400">📝</span> Bilim tekshirish — {current+1}/{questions.length}
      </h3>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-purple-400">Savol {current+1} / {questions.length}</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${
                i === current ? "bg-purple-500" : answers[i] !== undefined ? (answers[i] ? "bg-green-500" : "bg-red-500") : "bg-purple-800"
              }`} />
            ))}
          </div>
        </div>

        <p className="text-white font-bold text-base mb-6">{q.q}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !selected && checkAnswer(opt)}
              className={`p-3 rounded-xl text-sm text-left transition-all border ${
                selected === opt
                  ? opt === q.a
                    ? "bg-green-600/20 border-green-500 text-green-200"
                    : "bg-red-600/20 border-red-500 text-red-200"
                  : selected
                    ? opt === q.a
                      ? "bg-green-600/20 border-green-500 text-green-200 opacity-60"
                      : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50"
                    : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60 hover:border-purple-600"
              }`}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-3">
            <div className={`text-xs p-3 rounded-lg ${
              selected === q.a ? "bg-green-600/10 border border-green-500/30 text-green-300" : "bg-red-600/10 border border-red-500/30 text-red-300"
            }`}>
              {selected === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <span className="text-yellow-400 font-bold">💡 </span>
              <span className="text-purple-200">{q.hint}</span>
            </div>
            <button onClick={next} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">
              {current < questions.length - 1 ? "Keyingi savol →" : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function AtomTuzilishi() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/modellar",
      icon: "🧪", title: "Atom tuzilishi modellari",
      desc: "Tomson, Rezerford, Bor va kvant-mexanik modellar. Har bir modelning matematik ifodasi, yutuq va kamchiliklari.",
      badge: "Tarixiy", badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50", rangText: "group-hover:text-yellow-400",
      topics: ["Tomson", "Rezerford", "Bor", "Shredinger"]
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar",
      icon: "📐", title: "Kvant sonlar",
      desc: "n, l, mₗ, mₛ — to'rtala kvant sonining fizik ma'nosi, qiymatlari va kompleks birikmalar kimyosidagi ahamiyati.",
      badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50", rangText: "group-hover:text-green-400",
      topics: ["n", "l", "mₗ", "mₛ", "Pauli"]
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli",
      icon: "🎯", title: "d-orbitallarning shakli",
      desc: "5 ta d-orbitalning 3D shakli, matematik ifodalari, fazoviy yo'nalishi va tugun tekisliklari.",
      badge: "3D", badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50", rangText: "group-hover:text-purple-400",
      topics: ["d_xy", "d_xz", "d_yz", "d_z²", "d_x²−y²"]
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya",
      icon: "⚡", title: "d-orbitallarning energiyasi",
      desc: "O_h, T_d, D4h geometriyalarida d-orbital ajralishi. Δ_oct, Δ_tet hisoblash formulalari.",
      badge: "Muhim", badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50", rangText: "group-hover:text-orange-400",
      topics: ["O_h", "T_d", "D4h", "Δ", "KM"]
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig",
      icon: "🔄", title: "d-elektron konfiguratsiyalar",
      desc: "d¹–d¹⁰, Xund qoidasi, Pauli prinsipi, yuqori/quyi spin, magnit moment hisobi.",
      badge: "Konfig.", badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50", rangText: "group-hover:text-blue-400",
      topics: ["d¹-d¹⁰", "HS/LS", "Xund", "Pauli", "μ"]
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/metallar",
      icon: "🧲", title: "Kompleks hosil qiluvchi metallar",
      desc: "3d, 4d, 5d elementlari — ion radiusi, zaryad, elektron konfiguratsiyaning ta'siri.",
      badge: "Davriy", badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50", rangText: "group-hover:text-red-400",
      topics: ["3d", "4d", "5d", "Radius", "Zaryad"]
    },
  ]

  const [showSection, setShowSection] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      {/* BREADCRUMB */}
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Atom tuzilishi</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-purple-300">🔬 Atom tuzilishi va d-orbitallar</h1>
              <p className="text-xs sm:text-sm text-purple-500">Kompleks birikmalarning elektron asoslari — OTM darajasidagi to'liq qo'llanma</p>
            </div>
            <div className="flex gap-1">
              {["all", "interactive"].map(s => (
                <button key={s} onClick={() => setShowSection(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                    showSection === s ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-400"
                  }`}>
                  {s === "all" ? "📄 To'liq" : "🎯 Interaktiv"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Bo'lim haqida
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                Atom tuzilishi va d-orbitallar — kompleks birikmalar kimyosining <strong className="text-yellow-400">fundamental asosi</strong>. 
                d-orbitallarning shakli, energiyasi va elektron konfiguratsiyalari komplekslarning 
                geometriyasi, magnit xossalari, rangi va reaksion qobiliyatini belgilaydi.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">7 ta bo'lim</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">10 ta test</span>
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KMBE kalkulyator</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Matematik asoslar</span>
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Interaktiv 3D</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-4 space-y-2 text-xs">
              <p className="text-purple-300"><span className="text-purple-400 font-bold">🎯 Maqsad:</span> d-orbitallarning kvant-mexanik asoslarini, ularning shakli, energiyasi va kompleks birikmalardagi rolini to'liq tushunish.</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">👥 Auditoriya:</span> 1-4 kurs kimyo, biokimyo, farmatsevtika talabalari, magistrantlar, o'qituvchilar</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">⏱️ Vaqt:</span> ~4 soat (nazariya + interaktiv + test)</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">📚 Manba:</span> Cotton, Wilkinson — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry; Nasimov, Tashpulatov — Noorganik kimyo</p>
            </div>
          </div>
        </div>

        {/* SHAYDLAR */}
        {showSection === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <ShredingerTenglamasi />
            </div>

            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <DOrbitalShakllari />
            </div>

            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <ElektronKonfiguratsiya />
            </div>

            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <CFSEKalkulyator />
            </div>

            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <SpektrokimyoviyQator />
            </div>
          </>
        )}

        {/* INTERAKTIV — faqat interaktiv componentlar */}
        {showSection === "interactive" && (
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <DOrbitalShakllari />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <ElektronKonfiguratsiya />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <CFSEKalkulyator />
            </div>
          </div>
        )}

        {/* BO'LIMLAR KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">📂 Batafsil bo'limlar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bolimlar.map((b, i) => (
              <Link key={i} href={b.href}
                className={`group bg-purple-800/30 border border-purple-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-purple-800/60 ${b.rang} transition-all hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl`}
                style={{ animation: `fadeIn 0.5s ease-out ${i * 0.08}s both` }}>
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  <h3 className={`text-sm sm:text-base font-bold text-white ${b.rangText} transition-colors`}>{b.title}</h3>
                  <span className={`text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold whitespace-nowrap`}>{b.badge}</span>
                </div>
                <p className="text-[11px] sm:text-sm text-purple-300 leading-relaxed mb-3">{b.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {b.topics.map((t, ti) => (
                    <span key={ti} className="text-[9px] sm:text-[10px] px-1.5 py-0.5 bg-purple-950/60 text-purple-400 rounded-full border border-purple-800/30">
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <TestSavollari />
        </div>

        {/* FOOTER */}
        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-purple-300 leading-relaxed">
            📚 <strong className="text-purple-200">Asosiy manbalar:</strong> Cotton & Wilkinson — Advanced Inorganic Chemistry (6th ed.) | 
            Housecroft & Sharpe — Inorganic Chemistry (5th ed.) | 
            Miessler, Fischer & Tarr — Inorganic Chemistry (5th ed.) |
            Nasimov, Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
          <p className="text-[10px] sm:text-xs text-purple-500 mt-3">
            JDA-Kimyo platformasi © {new Date().getFullYear()} • O'zbekistondagi ilk interaktiv koordinatsion kimyo platformasi
          </p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"] { accent-color: #a855f7; }
      `}</style>
    </main>
  )
}
