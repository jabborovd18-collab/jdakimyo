"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. Sferik harmonikalar — d-orbital matematikasi
// ═══════════════════════════════════════════════════════════════════════════════
function SferikHarmonikalar() {
  const [tab, setTab] = useState("umumiy")

  const content = {
    umumiy: {
      title: "Sferik harmonikalar Yₗᵐ(θ,φ)",
      icon: "🌐",
      formula: "Yₗᵐ(θ,φ) = (−1)^m · √((2l+1)(l−m)!/4π(l+m)!) · Pₗᵐ(cosθ) · e^(imφ)",
      desc: "Sferik harmonikalar — burchak qismining xos funksiyalari. l=2 (d-orbitallar) uchun 5 ta: m = −2, −1, 0, +1, +2.",
      items: [
        "Pₗᵐ(cosθ) — Legendre ko'phadi (assotsiativ)",
        "e^(imφ) — azimutal qism, |e^(imφ)|² = 1",
        "Yₗᵐ ortonormal: ∫Yₗᵐ*Yₗ'ᵐ' dΩ = δₗₗ'·δₘₘ'",
        "Haqiqiy orbitallar: Yₗᵐ va Yₗ⁻ᵐ chiziqli kombinatsiyasi",
      ],
      note: "d-orbitallarning haqiqiy shakllari (dxy, dxz, dyz, dz², dx²−y²) — sferik harmonikalarning chiziqli kombinatsiyasi natijasida olinadi.",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    },
    dz2: {
      title: "d_z² — Y₂⁰",
      icon: "🟡",
      formula: "Y₂⁰ = √(5/16π) · (3cos²θ − 1)",
      desc: "m = 0. Haqiqiy orbital. Real fazoda ikki bo'lak + halqa ko'rinishida.",
      items: [
        "θ = 0°, 180° → cos²θ = 1 → Y₂⁰ maksimal",
        "θ = 54.7° → 3cos²θ−1 = 0 → tugun konusi",
        "Halqa (torus) — dz² ning noyob xususiyati",
        "Simmetriya: D_∞h → D4h da a₁g",
      ],
      note: "Yagona halqali d-orbital. Ekvatorial tekislikda (xy) manfiy fazali halqa mavjud.",
      color: "text-orange-400",
      bg: "bg-orange-600/10 border-orange-500/30"
    },
    dx2y2: {
      title: "d_x²−y² — (Y₂² + Y₂⁻²)/√2",
      icon: "🔴",
      formula: "Y₂² + Y₂⁻² ∝ sin²θ · cos2φ",
      desc: "m = ±2. Haqiqiy orbital. 4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida.",
      items: [
        "φ = 0° → cos2φ = 1 → maksimal (x o'qi)",
        "φ = 90° → cos2φ = −1 → manfiy maksimal",
        "φ = 45° → cos2φ = 0 → tugun",
        "Ligandlar aynan shu yo'nalishda → eng yuqori energiya",
      ],
      note: "Kvadrat tekis (D4h) geometriyada eng yuqori energiyali orbital — ligandlar bilan σ* ta'sir.",
      color: "text-red-400",
      bg: "bg-red-600/10 border-red-500/30"
    },
    dxy: {
      title: "d_xy — (Y₂² − Y₂⁻²)/(i√2)",
      icon: "🔵",
      formula: "Y₂² − Y₂⁻² ∝ sin²θ · sin2φ",
      desc: "m = ±2. Haqiqiy orbital. 4 ta bo'lak 45° burchak ostida.",
      items: [
        "φ = 45° → sin2φ = 1 → maksimal",
        "φ = 0° → sin2φ = 0 → tugun (x o'qi)",
        "d_x²−y² dan 45° ga burilgan",
        "Oktaedrik maydonda t₂g — ligandlardan uzoqda",
      ],
      note: "dxy = dx²−y² ning 45° ga burilgan varianti. Ligandlar orasiga yo'nalgan.",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    dxz_dyz: {
      title: "d_xz va d_yz — (Y₂¹ ± Y₂⁻¹)/√2",
      icon: "🟢",
      formula: "Y₂¹ + Y₂⁻¹ ∝ sinθ·cosθ·cosφ (dxz)",
      desc: "m = ±1. Ikki juft orbital — degenerat (bir xil energiya).",
      items: [
        "dxz: xz tekisligida, y o'qi bo'ylab tugun",
        "dyz: yz tekisligida, x o'qi bo'ylab tugun",
        "Og'irlik markazi ligandlar orasida → t₂g",
        "π-bog'lanishda ishtirok etadi",
      ],
      note: "dxz va dyz — bir-biriga 90° burilgan, energiyalari teng (degenerat). Oktaedrikda t₂g guruhining ikkita orbitali.",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    }
  }

  const c = content[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-purple-400">🌐</span> Sferik harmonikalar — d-orbitallarning matematik asosi
      </h3>
      <div className="flex gap-1.5 flex-wrap">
        {Object.entries(content).map(([key, val]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"}`}>
            {val.title.split("—")[0].trim()}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${c.bg}`}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{c.icon}</span>
          <div>
            <h4 className={`font-bold text-lg ${c.color}`}>{c.title}</h4>
          </div>
        </div>
        <div className="bg-purple-950/80 rounded-xl p-4 mb-4 border border-purple-700/30">
          <p className="text-center text-sm sm:text-base text-yellow-300 font-mono">{c.formula}</p>
        </div>
        <p className="text-purple-200 text-sm mb-4">{c.desc}</p>
        <div className="space-y-1 text-xs mb-4">
          {c.items.map((item, i) => (
            <p key={i} className="text-purple-200"><span className={c.color}>•</span> {item}</p>
          ))}
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
          <p className="text-yellow-400 font-bold">💡 </p>
          <p className="text-purple-200">{c.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. RADIAL EHIMOLLIK — 3D / 4d / 5d taqqoslash
// ═══════════════════════════════════════════════════════════════════════════════
function RadialEhtimollik() {
  const [level, setLevel] = useState("3d")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const w = canvas.width, h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Draw radial probability distribution for d orbitals
    // R²(r)·r² for different n values
    const data = {
      "3d": { n: 3, l: 2, color: "#a855f7", label: "3d (3d metallar)" },
      "4d": { n: 4, l: 2, color: "#22c55e", label: "4d (4d metallar)" },
      "5d": { n: 5, l: 2, color: "#f97316", label: "5d (5d metallar)" },
    }
    const d = data[level]
    const n = d.n, l = 2

    // Grid
    ctx.strokeStyle = "rgba(139, 92, 246, 0.2)"
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 10; i++) {
      const x = i * w / 10
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      const y = i * h / 5
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
    }

    // Approximate radial probability R²(r)·r² for d orbitals
    // Using hydrogen-like wavefunctions (simplified)
    const a0 = 20 // scale factor in pixels
    const Z = 1
    const points = 300
    const maxR = n * n * a0 * 2.5

    ctx.beginPath()
    ctx.strokeStyle = d.color
    ctx.lineWidth = 2.5

    for (let i = 0; i < points; i++) {
      const r = (i / points) * maxR
      const rho = 2 * Z * r / (n * a0)
      
      // Simplified radial probability for d orbitals (l=2)
      // R²(r)·r² ≈ ρ⁴·e^(−ρ)·[L³ₙ₋₃(ρ)]²·r² (simplified shape)
      let prob = 0
      const rhoNorm = rho / n
      if (n === 3) {
        prob = Math.pow(rho, 6) * Math.exp(-rho) * (1 - rho/6 + rho*rho/72) * (1 - rho/6 + rho*rho/72)
      } else if (n === 4) {
        prob = Math.pow(rho, 6) * Math.exp(-rho) * Math.pow(1 - rho/4 + rho*rho/40 - rho*rho*rho/480, 2)
      } else {
        prob = Math.pow(rho, 6) * Math.exp(-rho) * Math.pow(1 - 2*rho/5 + 2*rho*rho/75 - 2*rho*rho*rho/1875 + rho*rho*rho*rho/37500, 2)
      }
      
      prob = Math.max(0, prob)
      const x = (r / maxR) * w * 0.85 + w * 0.08
      const y = h - (prob / 0.15) * h * 0.85 - h * 0.05
      
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Fill under curve
    ctx.lineTo(w * 0.93, h - h * 0.05)
    ctx.lineTo(w * 0.08, h - h * 0.05)
    ctx.closePath()
    ctx.fillStyle = d.color.replace(")", ", 0.1)").replace("rgb", "rgba").replace("#a855f7", "rgba(168,85,247,0.08)").replace("#22c55e", "rgba(34,197,94,0.08)").replace("#f97316", "rgba(249,115,22,0.08)")
    ctx.fill()

    // Title
    ctx.fillStyle = d.color
    ctx.font = "bold 11px monospace"
    ctx.fillText(d.label, w * 0.1, 18)
    ctx.fillStyle = "rgba(168, 85, 247, 0.6)"
    ctx.font = "9px monospace"
    ctx.fillText(`n=${n}, l=2`, w * 0.1, 32)
    ctx.fillText("Radial ehtimollik P(r) = R²(r)·r²", w * 0.1, 44)

    // Peak label
    const peakX = n === 3 ? 0.35 : n === 4 ? 0.5 : 0.62
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.font = "8px sans-serif"
    ctx.fillText(`r_max ≈ ${n*n}·a₀ = ${n*n*0.529.toFixed(2)} Å`, peakX * w, h - 8)

  }, [level])

  const data = {
    "3d": { n: 3, label: "3d", desc: "3d metallar (Sc–Zn): n=3, radial tugun=0. Eng kichik d-orbital.", radius: "3²·a₀ = 4.76 Å", max: "r ≈ 4.76 Å" },
    "4d": { n: 4, label: "4d", desc: "4d metallar (Y–Cd): n=4, radial tugun=1. 3d dan katta.", radius: "4²·a₀ = 8.46 Å", max: "r ≈ 8.46 Å" },
    "5d": { n: 5, label: "5d", desc: "5d metallar (La–Hg): n=5, radial tugun=2. Eng katta d-orbital.", radius: "5²·a₀ = 13.2 Å", max: "r ≈ 13.2 Å" },
  }
  const d = data[level]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📈</span> Radial ehtimollik taqsimoti — 3d, 4d, 5d taqqoslash
      </h3>

      <div className="flex gap-2">
        {Object.keys(data).map(key => (
          <button key={key} onClick={() => setLevel(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${level === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {data[key].label}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4">
        <canvas ref={canvasRef} width={600} height={200} className="w-full h-44 sm:h-48 bg-purple-950/60 rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="text-purple-200"><span className="text-purple-400">n:</span> {d.n}</p>
            <p className="text-purple-200"><span className="text-purple-400">Radial tugunlar:</span> {d.n - 2 - 1} = n−l−1 = {d.n}−2−1 = {d.n-3}</p>
            <p className="text-purple-200"><span className="text-purple-400">Eng katta r:</span> {d.radius}</p>
          </div>
          <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-200">{d.desc}</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs mt-3">
          <p className="text-yellow-400 font-bold">⚡ Energiya va o'lcham:</p>
          <p className="text-purple-200">{'3d < 4d < 5d'} — n ortishi bilan orbital o'lchami va energiyasi ortadi. 3d metallar eng kichik, 5d metallar eng katta. Ion radiusi: {'3d < 4d < 5d'} (lantanid qisqarishiga qaramay).</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. d-orbital ma'lumot interaktiv
// ═══════════════════════════════════════════════════════════════════════════════
function DOrbitalMalumot() {
  const [orbital, setOrbital] = useState("dxy")

  const orbitallar = {
    dxy: {
      nom: "d_xy", ml: "±2", sim: "b₂g (O_h)", oh: "t₂g", en: "−0.4Δ₀",
      color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30",
      shape: "4 bo'lak — 45° burchakda",
      node: "xz va yz tekisliklari",
      pi: "π-bog'lanmagan (t₂g)",
      desc: "4 ta bo'lak x va y o'qlari orasida 45° da. Ligandlar o'qlari bo'ylab → t₂g stabillashgan."
    },
    dxz: {
      nom: "d_xz", ml: "±1", sim: "e_g (O_h)", oh: "t₂g", en: "−0.4Δ₀",
      color: "text-green-400", bg: "bg-green-600/10 border-green-500/30",
      shape: "4 bo'lak — xz tekisligida",
      node: "xy va yz tekisliklari",
      pi: "π-bog'lanish (t₂g)",
      desc: "XZ tekisligida 4 bo'lak. y o'qi bo'ylab tugun. dyz bilan degenerat."
    },
    dyz: {
      nom: "d_yz", ml: "±1", sim: "e_g (O_h)", oh: "t₂g", en: "−0.4Δ₀",
      color: "text-emerald-400", bg: "bg-emerald-600/10 border-emerald-500/30",
      shape: "4 bo'lak — yz tekisligida",
      node: "xy va xz tekisliklari",
      pi: "π-bog'lanish (t₂g)",
      desc: "YZ tekisligida 4 bo'lak. x o'qi bo'ylab tugun."
    },
    dz2: {
      nom: "d_z²", ml: "0", sim: "a₁g (O_h)", oh: "e_g", en: "+0.6Δ₀",
      color: "text-orange-400", bg: "bg-orange-600/10 border-orange-500/30",
      shape: "2 bo'lak + ekvatorial halqa",
      node: "2 konus (θ = 54.7°, 125.3°)",
      pi: "σ-bog'lanmagan (e_g)",
      desc: "Yagona halqali orbital. z o'qi bo'ylab 2 bo'lak + xy da halqa."
    },
    dx2y2: {
      nom: "d_x²−y²", ml: "±2", sim: "b₁g (O_h)", oh: "e_g", en: "+0.6Δ₀",
      color: "text-red-400", bg: "bg-red-600/10 border-red-500/30",
      shape: "4 bo'lak — x va y o'qlarida",
      node: "45° burchakdagi tekisliklar",
      pi: "σ*-antibog'lovchi (e_g)",
      desc: "Ligandlar to'g'ri yo'nalishida → eng yuqori energiya."
    }
  }

  const o = orbitallar[orbital]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className={o.color}>🎯</span> d-orbitallar — interaktiv ma'lumot
      </h3>

      <div className="flex gap-1.5 flex-wrap">
        {Object.keys(orbitallar).map(key => (
          <button key={key} onClick={() => setOrbital(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${orbital === key ? `${orbitallar[key].bg} ${orbitallar[key].color} scale-105` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"}`}>
            {orbitallar[key].nom}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${o.bg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <h4 className={`text-2xl font-bold font-mono ${o.color}`}>{o.nom}</h4>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1.5 text-xs">
              {[
                ["Magnit kvant soni", o.ml],
                ["Simmetriya (O_h)", o.sim],
                ["Guruh", o.oh],
                ["Energiya siljishi", o.en],
                ["Shakli", o.shape],
                ["Tugun tekisliklari", o.node],
                ["Bog' turi", o.pi],
              ].map(([label, value], i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-purple-400">{label}:</span>
                  <span className="text-purple-200 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 h-40 flex items-center justify-center">
              <span className={`text-7xl font-extrabold font-mono ${o.color}`}>{o.nom}</span>
            </div>
            <p className="text-purple-200 text-xs leading-relaxed">{o.desc}</p>
          </div>
        </div>
      </div>

      {/* Umumiy jadval */}
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[10px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-2 sm:p-3 text-left text-purple-200">Orbital</th>
                <th className="p-2 sm:p-3 text-center text-purple-200">mₗ</th>
                <th className="p-2 sm:p-3 text-center text-purple-200">O_h</th>
                <th className="p-2 sm:p-3 text-center text-purple-200">T_d</th>
                <th className="p-2 sm:p-3 text-center text-purple-200">D4h</th>
                <th className="p-2 sm:p-3 text-center text-purple-200 hidden md:table-cell">En (O_h)</th>
                <th className="p-2 sm:p-3 text-center text-purple-200 hidden md:table-cell">Tugunlar</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(orbitallar).map((o, i) => (
                <tr key={i} className={`border-t border-purple-800/30 hover:bg-purple-800/30 cursor-pointer ${orbital === Object.keys(orbitallar)[i] ? "bg-purple-800/40" : ""}`}
                  onClick={() => setOrbital(Object.keys(orbitallar)[i])}>
                  <td className={`p-2 sm:p-3 font-bold font-mono ${o.color}`}>{o.nom}</td>
                  <td className="p-2 sm:p-3 text-center text-purple-200">{o.ml}</td>
                  <td className="p-2 sm:p-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded ${o.oh === "t₂g" ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}`}>{o.oh}</span>
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded ${o.oh === "t₂g" ? "bg-red-600/20 text-red-300" : "bg-green-600/20 text-green-300"}`}>{o.oh === "t₂g" ? "t₂" : "e"}</span>
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded ${o.nom === "dxy" ? "bg-red-600/20 text-red-300" : o.nom === "dx2y2" ? "bg-red-600/20 text-red-300" : o.nom === "dz2" ? "bg-yellow-600/20 text-yellow-300" : "bg-blue-600/20 text-blue-300"}`}>
                      {o.nom === "dxy" ? "b₂g" : o.nom === "dx2y2" ? "b₁g" : o.nom === "dz2" ? "a₁g" : "e_g"}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 text-center text-purple-300 hidden md:table-cell">{o.en}</td>
                  <td className="p-2 sm:p-3 text-center text-purple-400 text-[9px] hidden md:table-cell">{o.node}</td>
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
// 4. ENERGETIK AJRALISH 3 geometriya
// ═══════════════════════════════════════════════════════════════════════════════
function EnergetikAjralish() {
  const [geo, setGeo] = useState("oh")

  const data = {
    oh: {
      name: "Oktaedrik (O_h)",
      note: "6 ta ligand, katta ajralish, d⁸ (Ni²⁺, Pt²⁺) uchun kuchli maydon",
      levels: [
        { name: "e_g (d_z², d_x²−y²)", energy: "+0.6Δ₀", bg: "bg-red-600/20 border-red-500/30", text: "text-red-300", h: "40%" },
        { name: "t₂g (d_xy, d_xz, d_yz)", energy: "−0.4Δ₀", bg: "bg-green-600/20 border-green-500/30", text: "text-green-300", h: "20%" },
      ]
    },
    td: {
      name: "Tetraedrik (T_d)",
      note: "4 ta ligand, kichik ajralish (Δ_t ≈ 0.44Δ₀), teskari",
      levels: [
        { name: "t₂ (d_xy, d_xz, d_yz)", energy: "+0.4Δ_t", bg: "bg-red-600/20 border-red-500/30", text: "text-red-300", h: "25%" },
        { name: "e (d_z², d_x²−y²)", energy: "−0.6Δ_t", bg: "bg-green-600/20 border-green-500/30", text: "text-green-300", h: "15%" },
      ]
    },
    d4h: {
      name: "Kvadrat tekis (D4h)",
      note: "4 ta ekvatorial ligand, eng katta ajralish, d⁸ uchun xos",
      levels: [
        { name: "b₁g (d_x²−y²)", energy: "Eng yuqori", bg: "bg-red-700/20 border-red-600/30", text: "text-red-300", h: "50%" },
        { name: "b₂g (d_xy)", energy: "Yuqori", bg: "bg-orange-600/20 border-orange-500/30", text: "text-orange-300", h: "35%" },
        { name: "a₁g (d_z²)", energy: "O'rta", bg: "bg-yellow-600/20 border-yellow-500/30", text: "text-yellow-300", h: "22%" },
        { name: "e_g (d_xz, d_yz)", energy: "Past", bg: "bg-green-600/20 border-green-500/30", text: "text-green-300", h: "12%" },
      ]
    }
  }

  const g = data[geo]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-yellow-400">⚡</span> Kristall maydonda energetik ajralish
      </h3>

      <div className="flex gap-2">
        {Object.entries(data).map(([key, val]) => (
          <button key={key} onClick={() => setGeo(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${geo === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {val.name}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5">
        <h4 className="text-white font-bold mb-4">{g.name} geometriyasi</h4>

        <div className="flex flex-col items-center space-y-1 mb-4">
          {g.levels.map((l, i) => (
            <div key={i} className="w-full flex items-center gap-3">
              <span className="text-purple-400 text-[10px] w-2/5 text-right">{l.name}</span>
              <div className="flex-1 h-8 rounded-lg border flex items-center px-2" style={{ width: `${l.h}` }} className={`flex-1 h-8 ${l.bg} border rounded-lg flex items-center px-2`}>
                <span className={`${l.text} text-[10px] font-bold`}>{l.energy}</span>
              </div>
            </div>
          ))}
        </div>

        {geo === "oh" && (
          <div className="flex justify-center text-xs text-yellow-400 font-bold mb-3">
            <span className="px-4 py-1 bg-purple-950/70 rounded-full">Δ₀ = 10 Dq</span>
          </div>
        )}
        {geo === "td" && (
          <div className="flex justify-center text-xs text-yellow-400 font-bold mb-3">
            <span className="px-4 py-1 bg-purple-950/70 rounded-full">Δ_t ≈ 4/9·Δ₀ ≈ 0.44Δ₀</span>
          </div>
        )}

        <div className={`text-xs p-3 rounded-lg ${g.levels[0].bg}`}>
          <p className="text-purple-200">{g.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. d-orbital ishtirokidagi bog'lanish turlari
// ═══════════════════════════════════════════════════════════════════════════════
function BoglanishTurlari() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-rose-400">🔗</span> d-orbitallarning bog'lanishdagi roli
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
          <div className="text-3xl mb-2">🔴</div>
          <h4 className="text-red-400 font-bold text-sm mb-2">σ-bog' (d_z², d_x²−y²)</h4>
          <p className="text-purple-200 text-xs leading-relaxed">
            Ligandlar bilan to'g'ridan-to'g'ri yo'nalishda. <strong>e_g</strong> orbitallari 
            (d_z², d_x²−y²) ligandlarning σ-orbitallari bilan qoplanishi. 
            <strong className="text-yellow-400"> Kuchli bog'lanish, yuqori energiya.</strong>
          </p>
        </div>
        <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
          <div className="text-3xl mb-2">🟢</div>
          <h4 className="text-green-400 font-bold text-sm mb-2">π-bog' (d_xy, d_xz, d_yz)</h4>
          <p className="text-purple-200 text-xs leading-relaxed">
            Ligandlar orasiga yo'nalgan. <strong>t₂g</strong> orbitallari ligandlarning 
            π-orbitallari bilan qoplanishi. <strong className="text-yellow-400">Kuchsiz bog'lanish, 
            energiyasi past.</strong> π-akseptor (CO, CN⁻) va π-donor (Cl⁻, Br⁻) ligandlar.
          </p>
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
          <div className="text-3xl mb-2">🟡</div>
          <h4 className="text-yellow-400 font-bold text-sm mb-2">σ* / π* antibog'</h4>
          <p className="text-purple-200 text-xs leading-relaxed">
            d-orbitallarning ligand orbitallari bilan antibog'lovchi kombinatsiyasi. 
            <strong className="text-yellow-400"> MO diagrammasida eng yuqori energiya.</strong> 
            d_x²−y² (σ*) — eng yuqori, d_xy (π*) — o'rta. Spektroskopik o'tishlar.
          </p>
        </div>
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 text-xs">
        <h5 className="text-purple-400 font-bold mb-2">Ligand turlari bo'yicha:</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
            <p className="text-blue-400 font-bold">σ-donor (NH₃, H₂O)</p>
            <p className="text-purple-300">Faqat σ bog'. Kuchsiz maydon. d-orbital ajralishi kichik.</p>
          </div>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded p-2">
            <p className="text-purple-400 font-bold">π-akseptor (CO, CN⁻)</p>
            <p className="text-purple-300">σ-donor + π-akseptor. Δₒ katta. Kuchli maydon. Past spin.</p>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded p-2">
            <p className="text-red-400 font-bold">π-donor (Cl⁻, Br⁻)</p>
            <p className="text-purple-300">σ-donor + π-donor. Δₒ kichik. Kuchsiz maydon. Yuqori spin.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. Tugunlar va kvant sonlar
// ═══════════════════════════════════════════════════════════════════════════════
function TugunTahlili() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📐</span> Tugunlar — orbital strukturasining asosi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5">
          <h4 className="text-purple-400 font-bold text-sm mb-3">Radial tugunlar</h4>
          <div className="bg-purple-950/70 rounded-lg p-3 mb-3">
            <p className="text-yellow-300 font-mono text-center text-base">r_tugun = n − l − 1</p>
          </div>
          <div className="space-y-1 text-xs">
            {[
              ["3d (n=3,l=2)", "3−2−1 = 0", "radial tugun yo'q"],
              ["4d (n=4,l=2)", "4−2−1 = 1", "1 ta radial tugun"],
              ["5d (n=5,l=2)", "5−2−1 = 2", "2 ta radial tugun"],
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2 bg-purple-950/50 rounded p-1.5">
                <span className="text-purple-300 w-16">{row[0]}</span>
                <span className="text-yellow-300 font-mono">{row[1]}</span>
                <span className="text-purple-400">{row[2]}</span>
              </div>
            ))}
          </div>
          <p className="text-purple-200 text-xs mt-2">Radial tugun — |ψ|² = 0 bo'lgan sferik sirt. Elektron bu sirtni kesib o'tmaydi.</p>
        </div>

        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5">
          <h4 className="text-purple-400 font-bold text-sm mb-3">Burchak (angular) tugunlar</h4>
          <div className="bg-purple-950/70 rounded-lg p-3 mb-3">
            <p className="text-yellow-300 font-mono text-center text-base">θ_tugun = l</p>
          </div>
          <div className="space-y-1 text-xs">
            {[
              ["s (l=0)", "0 tugun", "—"],
              ["p (l=1)", "1 tugun", "tugun tekisligi"],
              ["d (l=2)", "2 tugun", "2 ta tugun tekisligi / konus"],
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2 bg-purple-950/50 rounded p-1.5">
                <span className="text-purple-300 w-16">{row[0]}</span>
                <span className="text-yellow-300 font-mono">{row[1]}</span>
                <span className="text-purple-400">{row[2]}</span>
              </div>
            ))}
          </div>
          <p className="text-purple-200 text-xs mt-2">d-orbitallar: l=2 → 2 ta burchak tuguni. d_z² da 2 konus, qolganlarida 2 tekislik.</p>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
        <p className="text-yellow-400 font-bold mb-1">⚡ Jami tugunlar = n − 1:</p>
        <p className="text-purple-200">
          3d: n−1 = 2 = 0 radial + 2 burchak | 
          4d: n−1 = 3 = 1 radial + 2 burchak | 
          5d: n−1 = 4 = 2 radial + 2 burchak
        </p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestDOrbital() {
  const questions = [
    { q: "Nechta d-orbital mavjud?", a: "5", opts: ["3", "5", "7", "10"], hint: "l=2 → 2l+1 = ?" },
    { q: "d_z² orbitalining o'ziga xos xususiyati?", a: "Ekvatorial halqa (donut)", opts: ["4 ta bo'lak", "Ekvatorial halqa (donut)", "2 ta tugun tekisligi", "Sferik simmetrik"], hint: "Yagona halqali orbital" },
    { q: "Oktaedrik maydonda qaysi guruh stabillashgan?", a: "t₂g (−0.4Δ₀)", opts: ["e_g (+0.6Δ₀)", "t₂g (−0.4Δ₀)", "barchasi", "hech biri"], hint: "Ligandlardan uzoqda" },
    { q: "d_x²−y² va d_xy bir-biridan necha gradusga farq qiladi?", a: "45°", opts: ["90°", "45°", "180°", "30°"], hint: "dxy — 45° ga burilgan" },
    { q: "Radial tugunlar soni formulasi?", a: "n−l−1", opts: ["n+l", "n−l−1", "l−1", "n−1"], hint: "3d: 3−2−1 = 0" },
    { q: "Qaysi d-orbital Jahn-Teller effektida asosiy rol o'ynaydi?", a: "d_z² va d_x²−y² (e_g)", opts: ["d_xy va d_xz (t₂g)", "d_z² va d_x²−y² (e_g)", "Barchasi", "Faqat d_z²"], hint: "Degenerat e_g sathlari" },
    { q: "d-orbitallarning umumiy energiya markazi qanday?", a: "0 (baritsentr saqlanadi)", opts: ["+0.4Δ₀", "0 (baritsentr saqlanadi)", "−0.4Δ₀", "±0.6Δ₀"], hint: "3·(−0.4) + 2·(+0.6) = 0" },
    { q: "Tetraedrik ajralish oktaedrikdan necha marta kichik?", a: "≈ 0.44 marta (4/9)", opts: ["≈ 0.44 marta (4/9)", "≈ 0.5 marta", "≈ 0.25 marta", "≈ 2 marta"], hint: "Δ_t ≈ 4/9·Δ₀" },
    { q: "d_z² orbitalining simmetriya belgisi (O_h)?", a: "a₁g", opts: ["b₁g", "a₁g", "e_g", "b₂g"], hint: "To'liq simmetrik" },
    { q: "d-orbitallarning baritsentr qoidasi nimani anglatadi?", a: "t₂g (−0.4) · 3 + e_g (+0.6) · 2 = 0", opts: ["t₂g (−0.4) · 3 + e_g (+0.6) · 2 = 0", "t₂g = −e_g", "t₂g + e_g = 0", "Δ₀ = 10Dq"], hint: "Energiya saqlanadi" },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState({})

  const q = questions[current]
  const checkAnswer = (opt) => {
    setSelected(opt)
    const ok = opt === q.a
    if (ok && !answers[current]) setScore(s => s + 1)
    setAnswers(p => ({ ...p, [current]: ok }))
  }

  if (showResult) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{score >= 8 ? "🏆" : score >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{score}/{questions.length}</p>
          <button onClick={() => { setCurrent(0); setSelected(null); setScore(0); setShowResult(false); setAnswers({}) }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-emerald-400">📝</span> Bilim tekshirish — {current+1}/{questions.length}
      </h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !selected && checkAnswer(opt)}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${selected === opt ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200") : selected ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50") : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}
            </button>
          ))}
        </div>
        {selected && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${selected === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>
              {selected === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span>
            </div>
            <button onClick={() => { if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null) } else setShowResult(true) }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">
              {current < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function DOrbitalShakli() {
  const [view, setView] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="hover:text-purple-300">Atom tuzilishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">d-orbital shakli</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-purple-300 flex items-center gap-2">
                <span>🎯</span> d-orbitallarning shakli
              </h1>
              <p className="text-xs sm:text-sm text-purple-500">5 ta orbital • Matematik asos • Radial ehtimollik • OTM darajasi</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d"
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all">
                🔄 3D model
              </Link>
              <button onClick={() => setView(view === "all" ? "interactive" : "all")}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
                {view === "all" ? "🎯 Interaktiv" : "📄 To'liq"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">📋 d-orbitallar — kompleks birikmalarning asosi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                <strong className="text-yellow-400">d-orbitallar</strong> — burchak momenti l = 2 bo'lgan 5 ta orbital. 
                Ularning shakli, fazoviy yo'nalishi va energetik ajralishi kompleks birikmalarning 
                geometriyasini, rangini, magnit xossalarini va reaksion qobiliyatini belgilaydi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Radial ehtimollik</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">Sferik harmonikalar</span>
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">3 geometriya</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-4 text-xs space-y-2">
              <p className="text-purple-300"><span className="text-purple-400 font-bold">🎯 Maqsad:</span> d-orbitallarning matematik asoslarini, shakli, tugunlari va energetik ajralishini tushunish.</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
            </div>
          </div>
        </div>

        {/* SFERIK HARMONIKALAR */}
        {view === "all" && (
          <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
            <SferikHarmonikalar />
          </div>
        )}

        {/* D-ORBITAL INTERAKTIV */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <DOrbitalMalumot />
        </div>

        {/* RADIAL EHIMOLLIK */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <RadialEhtimollik />
        </div>

        {/* ENERGETIK AJRALISH */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <EnergetikAjralish />
        </div>

        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <BoglanishTurlari />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <TugunTahlili />
            </div>
          </>
        )}

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <TestDOrbital />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1.5 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>5 ta d-orbital: <strong className="text-yellow-400">dxy, dxz, dyz (t₂g), dz², dx²−y² (e_g)</strong></li>
            <li>Sferik harmonikalardan kelib chiqadi: Y₂ᵐ (m = −2,−1,0,+1,+2)</li>
            <li>Radial tugunlar = n−l−1, burchak tugunlari = l, jami = n−1</li>
            <li>Baritsentr qoidasi: 3·(−0.4Δ₀) + 2·(+0.6Δ₀) = 0</li>
            <li>Oktaedrik (O_h): t₂g↓ + e_g↑. Tetraedrik (T_d): t₂↑ + e↓. Kvadrat (D4h): 4 sath</li>
            <li>d_x²−y² — eng yuqori energiya (σ*), d_z² — yagona halqali</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar"
            className="px-4 sm:px-6 py-2.5 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Kvant sonlar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20">
            🔄 3D model <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-purple-300">📚 <strong className="text-purple-200">Manbalar:</strong> Cotton & Wilkinson — Advanced Inorganic Chemistry | Housecroft — Inorganic Chemistry | Nasimov, Tashpulatov — Noorganik kimyo</p>
          <p className="text-[10px] text-purple-500 mt-2">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
