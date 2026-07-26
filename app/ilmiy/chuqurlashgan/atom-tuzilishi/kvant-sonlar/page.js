"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. VAQT CHIZIG'I — KVANT NAZARIYASI TARIXI
// ═══════════════════════════════════════════════════════════════════════════════
function KvantVaqtChizigI() {
  const [active, setActive] = useState(3)
  const events = [
    { year: "1900", name: "Plank", label: "Kvant tushunchasi", icon: "🔴", detail: "Qora jism nurlanishi — energiya kvantlangan: E = hν, h = 6.626×10⁻³⁴ J·s", color: "text-red-400" },
    { year: "1905", name: "Eynshteyn", label: "Foton tushunchasi", icon: "💡", detail: "Fotoeffekt: yorug'lik diskret kvantlardan (fotonlar) iborat: E = hν. Nobel mukofoti 1921.", color: "text-yellow-400" },
    { year: "1913", name: "Bor", label: "Kvant son (n)", icon: "🎯", detail: "Burchak momenti kvantlangan: mvr = nħ. n — bosh kvant soni (1, 2, 3...).", color: "text-blue-400" },
    { year: "1925", name: "Pauli", label: "Pauli prinsipi", icon: "🚫", detail: "Bir atomda 4 ta kvant soni bir xil bo'lgan 2 ta elektron bo'lmaydi.", color: "text-purple-400" },
    { year: "1926", name: "Shredinger", label: "To'lqin tenglamasi", icon: "☁️", detail: "Ĥψ = Eψ — kvant mexanikasining asosiy tenglamasi. 3 ta kvant son (n, l, mₗ) tabiiy kelib chiqadi.", color: "text-green-400" },
    { year: "1927", name: "Geyzenberg", label: "Noaniqlik prinsipi", icon: "⚛️", detail: "Δx·Δp ≥ ℏ/2 — bir vaqtda o'rin va impulsni o'lchab bo'lmaydi.", color: "text-rose-400" },
    { year: "1927", name: "Xund", label: "Xund qoidalari", icon: "🧲", detail: "Energiyasi teng orbitallarda elektronlar avval parallel spin bilan joylashadi.", color: "text-cyan-400" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span>⏳</span> Kvant nazariyasi rivojlanishi — interaktiv vaqt chizig'i
      </h3>
      <div className="relative overflow-x-auto pb-2">
        <div className="flex gap-1 sm:gap-2 min-w-max">
          {events.map((e, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`flex flex-col items-center p-2 sm:p-4 rounded-xl border transition-all min-w-[80px] sm:min-w-[100px] ${
                active === i ? `${e.color} bg-purple-800/60 border-purple-400 shadow-lg scale-105` : "bg-purple-900/40 border-purple-700/40 hover:bg-purple-800/50 text-purple-300"
              }`}>
              <span className="text-base sm:text-2xl mb-1">{e.icon}</span>
              <span className="text-[9px] sm:text-xs font-bold">{e.year}</span>
              <span className="text-[8px] sm:text-[10px] opacity-80">{e.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{events[active].icon}</span>
          <div>
            <h4 className={`font-bold text-lg ${events[active].color}`}>{events[active].year} — {events[active].name}</h4>
            <p className="text-purple-400 text-xs font-semibold">{events[active].label}</p>
          </div>
        </div>
        <p className="text-purple-200 text-sm">{events[active].detail}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TO'RTALA KVANT SON — CHUQUR FIZIK ASOS
// ═══════════════════════════════════════════════════════════════════════════════
function KvantSonChuqur() {
  const [tab, setTab] = useState("n")
  const [value, setValue] = useState(3)

  const data = {
    n: {
      name: "Bosh kvant soni (n)", symbol: "n",
      range: [1, 7], step: 1,
      meaning: "Elektron qavatini (energetik sathni) belgilaydi. n — orbitalning o'lchami va energiyasi.",
      formula: "Eₙ = −R_H · Z²/n², R_H = 13.6 eV (vodorod)",
      born: "Shredinger tenglamasining radial qismi Rₙₗ(r) dan",
      select: "n = 1, 2, 3, 4, 5, 6, 7",
      complex: "3d metallar (n=3), 4d (n=4), 5d (n=5). n davr raqamini belgilaydi.",
      maxElectrons: "2n²",
      color: "text-red-400", bg: "bg-red-600/10 border-red-500/30"
    },
    l: {
      name: "Orbital kvant soni (l)", symbol: "l",
      range: [0, 3], step: 1,
      meaning: "Orbital shaklini va burchak momentini belgilaydi. |L| = ℏ√(l(l+1)). l = 0 (s), 1 (p), 2 (d), 3 (f).",
      formula: "l = 0, 1, 2, ..., (n−1). Osti qavatlar soni = n.",
      born: "Shredinger tenglamasining burchak qismi — Lagerr ko'phadlaridan",
      select: "l = 0 (s-sferik), 1 (p-gantel), 2 (d-murakkab), 3 (f-juda murakkab)",
      complex: "d-blok elementlar uchun l=2. 5 ta orbital (mₗ = −2...+2). d¹ dan d¹⁰ gacha.",
      maxElectrons: "2(2l+1); l=2 → 10 ta",
      color: "text-green-400", bg: "bg-green-600/10 border-green-500/30"
    },
    ml: {
      name: "Magnit kvant soni (mₗ)", symbol: "mₗ",
      range: [-2, 2], step: 1,
      meaning: "Orbitalning fazoviy yo'nalishini belgilaydi. L_z = mₗ·ℏ. Magnit maydonda Zeeman ajralishi.",
      formula: "mₗ = −l, −l+1, ..., 0, ..., l−1, l. Jami = 2l+1 ta.",
      born: "Shredinger tenglamasining Φ(φ) qismidan: Φ(φ) = e^(imₗφ)",
      select: "l=2 uchun: −2, −1, 0, +1, +2",
      complex: "d-orbitallar nomi: d_xy (mₗ=−2), d_xz (mₗ=−1), d_z² (mₗ=0), d_yz (mₗ=+1), d_x²−y² (mₗ=+2)",
      maxElectrons: "2l+1 = 5; har birida 2 tadan → 10 ta",
      color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30"
    },
    ms: {
      name: "Spin kvant soni (mₛ)", symbol: "mₛ",
      range: [-0.5, 0.5], step: 0.5,
      meaning: "Elektronning xususiy burchak momenti (spin). S_z = mₛ·ℏ. Spin — relativistik effekt (Dirak, 1928).",
      formula: "mₛ = +½ (↑) yoki −½ (↓). Pauli prinsipi: bir orbitalda ko'pi bilan 2 ta.",
      born: "Dirak tenglamasidan (1928). Spin — elektronning relativistik xususiyati.",
      select: "mₛ = +½ yoki −½",
      complex: "Spin = magnit xossalar asosi. μ = √(n(n+2))·μB. HS (kuchsiz maydon) vs LS (kuchli maydon).",
      maxElectrons: "Har bir orbitalda 2 ta",
      color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const d = data[tab]
  const currentVal = tab === "ms" ? (value > 0 ? "+½ ↑" : "−½ ↓") : value

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-green-400">🎚️</span> To'rtta kvant son — chuqur fizik asoslar
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(data).map(([key, val]) => (
          <button key={key} onClick={() => { setTab(key); setValue(key === "n" ? 3 : key === "l" ? 2 : key === "ml" ? 0 : 0.5) }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"}`}>
            {val.symbol} — {val.name.split("(")[0].trim()}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-4 sm:p-6 border ${d.bg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <h4 className={`font-bold text-lg ${d.color}`}>{d.name}</h4>

            <div className="flex items-center gap-4">
              <span className="text-[10px] text-purple-400">{d.range[0]}</span>
              <input type="range" min={d.range[0]} max={d.range[1]} step={d.step} value={value}
                onChange={(e) => setValue(+e.target.value)}
                className="flex-1 h-2 rounded-full appearance-none bg-purple-800 cursor-pointer" style={{ accentColor: d.color === "text-red-400" ? "#ef4444" : d.color === "text-green-400" ? "#22c55e" : d.color === "text-blue-400" ? "#3b82f6" : "#a855f7" }} />
              <span className={`text-lg font-bold ${d.color}`}>{currentVal}</span>
            </div>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-2 text-xs">
              <p className="text-purple-200"><span className="text-yellow-400 font-bold">Fizik ma'nosi:</span> {d.meaning}</p>
              <p className="text-purple-200"><span className="text-yellow-400 font-bold">Kelib chiqishi:</span> {d.born}</p>
              <p className="text-purple-200"><span className="text-yellow-400 font-bold">Maksimal elektron:</span> {d.maxElectrons}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3">
              <h5 className="text-yellow-400 font-bold text-xs mb-2">Matematik ifoda:</h5>
              <div className="bg-purple-950/90 rounded p-2 mb-2">
                <p className="text-center text-sm text-yellow-300 font-mono">{d.formula}</p>
              </div>
              <p className="text-purple-300 text-xs"><span className="text-purple-400">Qiymatlari:</span> {d.select}</p>
            </div>

            <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3">
              <h5 className="text-cyan-400 font-bold text-xs mb-2">Kompleks birikmalar kimyosidagi ahamiyati:</h5>
              <p className="text-purple-200 text-xs">{d.complex}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ELEKTRON ORBITALLAR — SHAKLLAR VA MA'NO
// ═══════════════════════════════════════════════════════════════════════════════
function OrbitalShakllar() {
  const [sel, setSel] = useState("1s")

  const orbitals = {
    "1s": { n: 1, l: 0, shape: "Sferik simmetrik", nodes: 0, image: "⚪", desc: "Eng kichik orbital. Hech qanday tugunsiz. |ψ(0)|² maksimal.", rMax: "a₀/Z" },
    "2s": { n: 2, l: 0, shape: "Sferik + 1 radial tugun", nodes: 1, image: "⭕", desc: "1 ta sferik tugun (n−l−1=1). 1s dan katta.", rMax: "4a₀/Z" },
    "2p": { n: 2, l: 1, shape: "Gantelsimon (3 ta)", nodes: 1, image: "💫", desc: "Tugun tekisligi. p_x, p_y, p_z (mₗ = −1, 0, +1)", rMax: "4a₀/Z" },
    "3s": { n: 3, l: 0, shape: "Sferik + 2 radial tugun", nodes: 2, image: "⭕", desc: "2 ta sferik tugun. Energiyasi yuqori.", rMax: "9a₀/Z" },
    "3p": { n: 3, l: 1, shape: "Gantel + 1 radial tugun", nodes: 2, image: "💫", desc: "1 radial + 1 burchak tuguni = 2", rMax: "9a₀/Z" },
    "3d": { n: 3, l: 2, shape: "5 ta murakkab shakl", nodes: 2, image: "🔮", desc: "2 ta burchak tuguni. O'tish metallaridagi eng muhim orbitallar!", rMax: "9a₀/Z" },
    "4f": { n: 4, l: 3, shape: "7 ta juda murakkab", nodes: 3, image: "🌀", desc: "Lantanid va aktinid elementlarida muhim.", rMax: "16a₀/Z" },
  }

  const o = orbitals[sel]

  const nodeInfo = []
  if (o) {
    const radialNodes = o.n - o.l - 1
    const angularNodes = o.l
    nodeInfo.push(`Radial tugunlar: ${radialNodes} (n−l−1 = ${o.n}−${o.l}−1 = ${radialNodes})`)
    nodeInfo.push(`Burchak tugunlari: ${angularNodes} (l = ${o.l})`)
    nodeInfo.push(`Jami tugunlar: ${o.nodes} (= n−1 = ${o.n}−1 = ${o.nodes})`)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-purple-400">🔮</span> Orbitallarning shakli va tugunlari
      </h3>

      <div className="flex gap-1.5 flex-wrap">
        {Object.keys(orbitals).map(key => (
          <button key={key} onClick={() => setSel(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sel === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {key}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-8xl mb-2">{o.image}</div>
            <h4 className="text-white font-bold text-lg">{sel} orbitali</h4>
            <p className="text-purple-400 text-xs">n={o.n}, l={o.l}, {o.shape}</p>
          </div>
          <div className="space-y-3">
            <p className="text-purple-200 text-sm">{o.desc}</p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1 text-xs">
              {nodeInfo.map((info, i) => (
                <p key={i} className="text-purple-200"><span className="text-purple-400">•</span> {info}</p>
              ))}
            </div>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
              <p className="text-purple-200"><span className="text-purple-400">Eng katta ehtimollik radiusi:</span> r = n²·a₀/Z</p>
              <p className="text-purple-200"><span className="text-purple-400">3d uchun (Z=1):</span> r = 9·0.529 = <strong className="text-yellow-300">4.76 Å</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PAULI + XUND + ENERGIYA
// ═══════════════════════════════════════════════════════════════════════════════
function PauliXundInteraktiv() {
  const [electrons, setElectrons] = useState(5)
  const [field, setField] = useState("oh")

  const dArrows = (count, label) => {
    const arr = ["·", "·", "·", "·", "·"]
    if (field === "oh") {
      // t₂g (3 ta) → e_g (2 ta)
      const t2gCount = Math.min(3, count)
      for (let i = 0; i < 3; i++) {
        if (i < t2gCount) arr[i] = "↑"
        else if (i < Math.min(3 + Math.max(0, count - 3), 3)) arr[i] = "↑"
      }
      // Hund: first all up, then pair
      for (let i = 0; i < 3; i++) {
        if (i < Math.min(3, count)) arr[i] = "↑"
      }
      for (let i = 3; i < Math.min(5, count); i++) {
        arr[i] = "↑"
      }
      // Pairing
      let remaining = count
      for (let i = 0; i < 5; i++) {
        if (remaining <= 0) { arr[i] = "·"; continue }
        if (i < 5) { arr[i] = "↑"; remaining-- }
        if (remaining > 0 && i < 5) {
          // Check if already paired
          if (i < 3 && remaining >= 1 && count > 3) { arr[i] = "↑↓"; remaining-- }
          else if (i >= 3 && remaining >= 1 && count > 5) { arr[i] = "↑↓"; remaining-- }
        }
      }

      // Reset logic - cleaner
      if (count <= 5) {
        for (let i = 0; i < count; i++) arr[i] = "↑"
        for (let i = count; i < 5; i++) arr[i] = "·"
      } else {
        for (let i = 0; i < 5; i++) arr[i] = i < count - 5 ? "↑↓" : (i < count ? "↑" : "·")
      }
    } else {
      // Tetraedrik - teskari: e (past) → t₂ (yuqori)
      if (count <= 5) {
        for (let i = 0; i < count; i++) arr[i] = "↑"
        for (let i = count; i < 5; i++) arr[i] = "·"
      } else {
        for (let i = 0; i < 5; i++) arr[i] = i < count - 5 ? "↑↓" : (i < count ? "↑" : "·")
      }
    }
    return arr
  }

  const spins = dArrows(electrons)
  const unpaired = spins.filter(s => s === "↑").length
  const mu = Math.sqrt(unpaired * (unpaired + 2))

  const ohLabels = ["d_xy (t₂g)", "d_xz (t₂g)", "d_yz (t₂g)", "d_z² (e_g)", "d_x²−y² (e_g)"]
  const tdLabels = ["d_x²−y² (e)", "d_z² (e)", "d_xy (t₂)", "d_xz (t₂)", "d_yz (t₂)"]
  const labels = field === "oh" ? ohLabels : tdLabels

  const config = `${field === "oh" ? "O_h" : "T_d"}: d${electrons}, ${unpaired} ta juftlanmagan, μ = ${mu.toFixed(2)} μB`

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">🧮</span> Pauli prinsipi va Xund qoidalari — interaktiv
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4">
          <div>
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button key={n} onClick={() => setElectrons(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${electrons === n ? "bg-yellow-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                  {n}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setField("oh")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${field === "oh" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                Oktaedrik (O_h)
              </button>
              <button onClick={() => setField("td")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${field === "td" ? "bg-blue-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
                Tetraedrik (T_d)
              </button>
            </div>
          </div>

          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="text-yellow-400 font-bold">{field === "oh" ? "Oktaedrik" : "Tetraedrik"} maydonda d{electrons}</p>
            <p className="text-purple-200"><span className="text-purple-400">Juftlanmagan elektronlar:</span> <span className="text-yellow-300 font-bold">{unpaired}</span></p>
            <p className="text-purple-200"><span className="text-purple-400">Magnit moment:</span> μ = √{unpaired}({unpaired}+2) = <span className="text-yellow-300 font-bold">{mu.toFixed(2)} μB</span></p>
          </div>
        </div>

        <div className="space-y-2">
          {spins.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[10px] text-purple-400 w-24 sm:w-32 text-right font-mono">{labels[i]}</span>
              <div className="flex-1 h-8 bg-purple-950/80 border border-purple-700/30 rounded-lg flex items-center px-3">
                <span className={`text-base font-bold font-mono ${s === "·" ? "text-purple-700" : s.includes("↓") ? "text-red-400" : "text-green-300"}`}>{s}</span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                s === "·" ? "bg-purple-900/40 text-purple-600" : "bg-purple-700/60 text-purple-200"
              }`}>{s === "·" ? "0" : s === "↑" ? "1" : "2"}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-[10px] text-center">
          <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
            <p className="text-blue-400 font-bold">Pauli prinsipi</p>
            <p className="text-purple-300">↑↓ — 2 ta elektron maks.</p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
            <p className="text-green-400 font-bold">Xund qoidasi</p>
            <p className="text-purple-300">Avval parallel, keyin juft</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
            <p className="text-yellow-400 font-bold">En. minimal</p>
            <p className="text-purple-300">Avval t₂g, keyin e_g</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MAGNIT MOMENT KALKULYATORI
// ═══════════════════════════════════════════════════════════════════════════════
function MagnitKalkulyator() {
  const [n, setN] = useState(3)
  const mu = Math.sqrt(n * (n + 2))
  const ions = [
    { n: 0, ion: "Zn²⁺, Cu⁺", d: "d¹⁰", mu: 0, type: "Diamagnit" },
    { n: 1, ion: "Cu²⁺, Ti³⁺", d: "d¹/d⁹", mu: 1.73, type: "Paramagnit" },
    { n: 2, ion: "Ni²⁺, V³⁺", d: "d²/d⁸", mu: 2.83, type: "Paramagnit" },
    { n: 3, ion: "Co²⁺, Cr³⁺", d: "d³/d⁷", mu: 3.87, type: "Paramagnit" },
    { n: 4, ion: "Fe²⁺, Co²⁺(HS)", d: "d⁴/d⁶", mu: 4.90, type: "Paramagnit (HS)" },
    { n: 5, ion: "Mn²⁺, Fe³⁺", d: "d⁵", mu: 5.92, type: "Paramagnit (HS)" },
  ]

  const matched = ions.find(i => i.n === n) || ions[0]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-orange-400">🧲</span> Magnit moment kalkulyatori: μ = √<span className="underline decoration-orange-400">n(n+2)</span>
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-5 space-y-4">
          <p className="text-purple-200 text-xs">Juftlanmagan elektronlar sonini tanlang:</p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({length: 11}, (_, i) => i).map(i => (
              <button key={i} onClick={() => setN(i)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${n === i ? "bg-orange-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
                {i}
              </button>
            ))}
          </div>

          <div className="bg-purple-950/80 border border-orange-500/30 rounded-lg p-4 text-center">
            <p className="text-purple-400 text-xs">Spin-only formula</p>
            <p className="text-4xl font-bold text-yellow-300 font-mono">{mu.toFixed(2)} <span className="text-lg">μB</span></p>
            <p className="text-purple-300 text-xs mt-1">μ = √{n}·{n+2} = √{n*(n+2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold text-xs mb-2">Misol ionlar:</p>
            <p className="text-purple-200 text-xs">{matched.ion} ({matched.d})</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold text-xs mb-2">Nazariy μ:</p>
            <p className="text-purple-200 text-xs">{matched.mu.toFixed(2)} μB</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold text-xs mb-2">Magnit xossa:</p>
            <p className="text-purple-200 text-xs">{matched.type}</p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400"><strong>Eslatma:</strong> Spin-orbit bog'lanish hisobga olinmagan. Haqiqiy qiymatlar nazariydan farq qilishi mumkin (orbit hissasi).</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SHREDINGER TENGLAMASI — KVANT SONLAR BILAN BOG'LIQ
// ═══════════════════════════════════════════════════════════════════════════════
function ShredingerAjralish() {
  const [section, setSection] = useState("psi")

  const sections = {
    psi: { title: "To'lqin funksiyasining ajralishi", formula: "ψ(r,θ,φ) = Rₙₗ(r)·Θₗₘ(θ)·Φₘ(φ)", desc: "Shredinger tenglamasini sferik koordinatalarda yechish natijasida to'lqin funksiyasi 3 qismga ajraladi:", items: ["Rₙₗ(r) — radial qism (n, l ga bog'liq)", "Θₗₘ(θ) — qutb burchak qismi (l, mₗ ga bog'liq)", "Φₘ(φ) — azimutal qism (mₗ ga bog'liq)"], note: "Har bir qism alohida differensial tenglamani yechish orqali topiladi. Kvant sonlar (n, l, mₗ) aynan shu yechimlardan kelib chiqadi.", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
    radial: { title: "Radial qism — Rₙₗ(r)", formula: "Rₙₗ(r) = −√(2Z/na₀)³ · √(n−l−1)!/2n·[(n+l)!]³ · e^(−ρ/2) · ρˡ · L²ˡ⁺¹ₙ₊ₗ(ρ)", desc: "Bu yerda ρ = 2Zr/na₀, L — Lagerr ko'phadi. d-orbitallar (l=2) uchun:", items: ["R₃₂(r) = (Z/3a₀)^(3/2) · 1/9√30 · ρ² · e^(−ρ/2) (3d orbital)", "Radial tugunlar: n−l−1", "3d da: 3−2−1 = 0 → radial tugun yo'q"], note: "Radial qism orbitalning o'lchami va tugunlarini belgilaydi.", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
    burchak: { title: "Burchak qismi — sferik harmonikalar Yₗᵐ", formula: "Y₂⁰ = √(5/16π)·(3cos²θ−1) → d_z²", desc: "Sferik harmonikalar orbitalning shaklini belgilaydi. l=2 (d) uchun 5 ta:", items: ["Y₂⁰ (m=0) → d_z²", "Y₂¹ (m=±1) → d_xz, d_yz", "Y₂² (m=±2) → d_xy, d_x²−y²"], note: "Sferik harmonikalar ortonormal: ∫Yₗᵐ*·Yₗ'ᵐ' dΩ = δₗₗ'·δₘₘ'", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
  }

  const s = sections[section]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-red-400">Ψ</span> Shredinger tenglamasi va kvant sonlar
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(sections).map(([key, val]) => (
          <button key={key} onClick={() => setSection(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${section === key ? `${val.bg} ${val.color}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"}`}>
            {val.title.split("—")[0].trim()}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-4 sm:p-6 border ${s.bg}`}>
        <h4 className={`font-bold text-lg mb-2 ${s.color}`}>{s.title}</h4>
        <p className="text-purple-200 text-sm mb-4">{s.desc}</p>
        <div className="bg-purple-950/80 rounded-xl p-4 mb-4 border border-purple-700/30">
          <p className="text-center text-base sm:text-lg text-yellow-300 font-mono">{s.formula}</p>
        </div>
        <div className="space-y-1 text-xs mb-4">
          {s.items.map((item, i) => (
            <p key={i} className="text-purple-200"><span className={`${s.color} mr-1`}>•</span> {item}</p>
          ))}
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 {s.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. ZEEMAN VA SHTARK EFFEKTLARI
// ═══════════════════════════════════════════════════════════════════════════════
function ZeemanShtark() {
  const [effect, setEffect] = useState("zeeman")

  const data = {
    zeeman: { name: "Zeeman effekti", icon: "🧲", desc: "Magnit maydonda spektral chiziqlarning ajralishi", formula: "ΔE = mₗ·μB·B", detail: "mₗ → 2l+1 ta sathga ajraladi. d-orbitallar (l=2): 5 ta sath.", bg: "bg-blue-600/10 border-blue-500/30", text: "text-blue-400" },
    stark: { name: "Shtark effekti", icon: "⚡", desc: "Elektr maydonda spektral chiziqlarning ajralishi", formula: "ΔE ∝ E·⟨ψ|z|ψ⟩", detail: "d-z² orbitali eng kuchli Shtark ta'siriga uchraydi. Kvadrat Shtark effekti (d-orbital degeneratsiyasini yo'qotadi).", bg: "bg-purple-600/10 border-purple-500/30", text: "text-purple-400" },
  }

  const d = data[effect]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-blue-400">⚡</span> Zeeman va Shtark effektlari — kvant sonlarning fizik namoyishi
      </h3>

      <div className="flex gap-2">
        {Object.entries(data).map(([key, val]) => (
          <button key={key} onClick={() => setEffect(key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${effect === key ? `${val.bg} ${val.text}` : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"}`}>
            {val.icon} {val.name}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${d.bg}`}>
        <h4 className={`font-bold text-lg mb-2 ${d.text}`}>{d.name}</h4>
        <p className="text-purple-200 text-sm mb-4">{d.desc}</p>
        <div className="bg-purple-950/80 rounded-lg p-4 mb-4 border border-purple-700/30">
          <p className="text-center text-lg text-yellow-300 font-mono">{d.formula}</p>
        </div>
        <p className="text-purple-200 text-xs">{d.detail}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. BILIM TEKSHIRISH
// ═══════════════════════════════════════════════════════════════════════════════
function TestKvant() {
  const questions = [
    { q: "Nechta kvant son elektron holatini to'liq tavsiflaydi?", a: "4 ta", opts: ["2 ta", "3 ta", "4 ta", "5 ta"], hint: "n, l, mₗ, mₛ" },
    { q: "d-orbitallar uchun orbital kvant soni qiymati?", a: "l=2", opts: ["l=0", "l=1", "l=2", "l=3"], hint: "d-blok elementlar" },
    { q: "Pauli prinsipi ta'rifini ko'rsating:", a: "Bir atomda 4 ta kvant soni bir xil 2 ta elektron bo'lmaydi", opts: ["Har bir orbitalda 2 ta elektron", "Bir atomda 4 ta kvant soni bir xil 2 ta elektron bo'lmaydi", "Elektronlar eng past energiyaga joylashadi", "Spinlar parallel bo'lishi kerak"], hint: "Bu prinsip elektronlarning 'manzilini' cheklaydi" },
    { q: "d-orbitallarning umumiy soni?", a: "5 ta", opts: ["3 ta", "5 ta", "7 ta", "10 ta"], hint: "2l+1 = ?" },
    { q: "Xund qoidasiga ko'ra, elektronlar orbitallarga qanday joylashadi?", a: "Avval parallel spin bilan, keyin juftlashadi", opts: ["Avval juftlashadi", "Avval parallel spin bilan, keyin juftlashadi", "Energiya tartibida", "Tasodifiy"], hint: "Energiya jihatidan eng qulay usul" },
    { q: "Magnit moment formulasi (spin-only)?", a: "μ = √(n(n+2)) μB", opts: ["μ = n μB", "μ = √(n(n+2)) μB", "μ = n² μB", "μ = √n μB"], hint: "n — juftlanmagan elektronlar" },
    { q: "Bosh kvant soni qanday fizik kattalikni belgilaydi?", a: "Energiya va orbital o'lchami", opts: ["Faqat energia", "Orbital shakli", "Energiya va orbital o'lchami", "Fazoviy yo'nalish"], hint: "n — eng muhim kvant son" },
    { q: "dₓ²−y² orbitalining magnit kvant soni?", a: "mₗ = ±2", opts: ["mₗ = 0", "mₗ = ±1", "mₗ = ±2", "mₗ = ±3"], hint: "d-orbitallar ichida eng katta |mₗ|" },
    { q: "Elektron spinining kashf qilinishiga olib kelgan tajriba?", a: "Stern-Gerlach tajribasi (1922)", opts: ["Rezerford sochilishi", "Stern-Gerlach tajribasi (1922)", "Tomson katod nurlari", "Millikan yog' tomchisi"], hint: "Magnit maydonda kumush atomlarining og'ishi" },
    { q: "Radial tugunlar soni formulasi?", a: "n−l−1", opts: ["n+l", "n−l−1", "l−1", "n−1"], hint: "n va l ga bog'liq" },
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
          <p className="text-purple-300 mt-2">{score >= 8 ? "A'lo!" : score >= 5 ? "Yaxshi." : "Qayta o'qing."}</p>
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
            <div className={`text-xs p-3 rounded-lg ${selected === q.a ? "bg-green-600/10 border border-green-500/30 text-green-300" : "bg-red-600/10 border border-red-500/30 text-red-300"}`}>
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
export default function KvantSonlar() {
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
            <span className="text-green-400">Kvant sonlar</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-green-400 flex items-center gap-2">
                <span>📐</span> Kvant sonlar
              </h1>
              <p className="text-xs sm:text-sm text-purple-500">n, l, mₗ, mₛ — elektronning kvant "pasporti" • OTM darajasi</p>
            </div>
            <button onClick={() => setView(view === "all" ? "interactive" : "all")}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
              {view === "all" ? "🎯 Interaktiv" : "📄 To'liq"}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4">📋 Kvant sonlar — elektronning &quot;pasporti&quot;</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                <strong className="text-yellow-400">Kvant sonlar</strong> — atomdagi har bir elektronning holatini to'liq va bir qiymatli 
                tavsiflovchi 4 ta son. Ular Shredinger tenglamasini yechish natijasida kelib chiqadi. 
                Kompleks birikmalarda <strong className="text-green-400">d-orbitallar</strong> asosiy rol o'ynagani uchun, 
                aynan d-elektronlar uchun kvant sonlar muhim ahamiyatga ega.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">Magnit kalk.</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">Shredinger t.</span>
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">Zeeman eff.</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-4 text-xs space-y-2">
              <p className="text-purple-300"><span className="text-green-400 font-bold">🎯 Maqsad:</span> 4 ta kvant sonning fizik ma'nosi, matematik ifodasi va kompleks birikmalardagi rolini tushunish.</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">⏱️ Vaqt:</span> ~3 soat</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
            </div>
          </div>
        </div>

        {/* VAQT CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <KvantVaqtChizigI />
        </div>

        {/* KVANT SONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <KvantSonChuqur />
        </div>

        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <OrbitalShakllar />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <ShredingerAjralish />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <ZeemanShtark />
            </div>
          </>
        )}

        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <PauliXundInteraktiv />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <MagnitKalkulyator />
        </div>

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <TestKvant />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1.5 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>4 ta kvant son (n, l, mₗ, mₛ) — elektron holatini to'liq tavsiflaydi</li>
            <li>d-orbitallar: n ≥ 3, l = 2, mₗ = −2...+2, mₛ = ±½</li>
            <li><strong className="text-green-400">Pauli prinsipi:</strong> bir atomda 4 ta kvant soni bir xil bo'lgan 2 ta elektron bo'lmaydi</li>
            <li><strong className="text-green-400">Xund qoidasi:</strong> energiyasi teng orbitallarda elektronlar avval parallel spin bilan joylashadi</li>
            <li>Radial tugunlar = n−l−1, burchak tugunlari = l. 3d: 0 radial + 2 burchak = 2 tugun</li>
            <li>Spin kvant soni — yuqori/quyi spin va magnit xossalarini belgilaydi</li>
            <li><strong className="text-green-400">μ = √(n(n+2)) μB</strong> — magnit momentni hisoblash formulasi</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/modellar"
            className="px-4 sm:px-6 py-2.5 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm transition-all flex items-center gap-2">
            <span>←</span> Atom modellari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli"
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
            d-orbital shakli <span>→</span>
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
