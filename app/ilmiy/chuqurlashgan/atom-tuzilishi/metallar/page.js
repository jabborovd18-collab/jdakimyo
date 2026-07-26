"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// METALLAR MA'LUMOT BAZASI
// ═══════════════════════════════════════════════════════════════════════════════
const ALL_METALS = {
  // 3d metallar
  Sc: { z:21, row:"3d", config:"[Ar]3d¹4s²", common:"Sc³⁺", dN:"d⁰", color:"#a0a0a0", ks:"6", radius:"75", cfse:0, note:"Skandiy — kuchsiz komplekslar. Faqat Sc³⁺ barqaror.", bio:"—", use:"Yengil qotishmalar" },
  Ti: { z:22, row:"3d", config:"[Ar]3d²4s²", common:"Ti³⁺, Ti⁴⁺", dN:"d¹/d⁰", color:"#8080c0", ks:"6", radius:"67", cfse:-0.40, note:"Titan — Ti⁴⁺ rangsiz (d⁰), Ti³⁺ binafsha (d¹).", bio:"—", use:"Boya, oksid (TiO₂)" },
  V:  { z:23, row:"3d", config:"[Ar]3d³4s²", common:"V³⁺, V⁴⁺, VO²⁺", dN:"d²/d¹", color:"#c0c080", ks:"4-6", radius:"64", cfse:-0.80, note:"Vanadiy — turli ranglardagi komplekslar. VO²⁺ — vanadil ioni.", bio:"—", use:"Sanoat katalizatori" },
  Cr: { z:24, row:"3d", config:"[Ar]3d⁵4s¹", common:"Cr³⁺, Cr²⁺", dN:"d³/d⁴", color:"#6080c0", ks:"6", radius:"62", cfse:-1.20, note:"Cr³⁺ (d³) eng barqaror — yashil/binafsha. Cr²⁺ — qaytaruvchi.", bio:"Mikroelement", use:"Po'lat, xromlash" },
  Mn: { z:25, row:"3d", config:"[Ar]3d⁵4s²", common:"Mn²⁺, Mn³⁺, Mn⁷⁺", dN:"d⁵/d⁴/d⁰", color:"#c08060", ks:"6", radius:"67", cfse:0, note:"Mn²⁺ (d⁵ HS) rangsiz. Mn⁷⁺ (d⁰) — binafsha (MnO₄⁻).", bio:"Muhim mikroelement", use:"Batareya, o'g'it" },
  Fe: { z:26, row:"3d", config:"[Ar]3d⁶4s²", common:"Fe²⁺, Fe³⁺", dN:"d⁶/d⁵", color:"#c06040", ks:"4-6", radius:"78", cfse:-0.40, note:"Eng muhim biometall. Fe²⁺ HS/LS, Fe³⁺ HS.", bio:"Gemoglobin, mioglobin, sitoxrom", use:"Po'lat, kataliz (Haber)" },
  Co: { z:27, row:"3d", config:"[Ar]3d⁷4s²", common:"Co²⁺, Co³⁺", dN:"d⁷/d⁶", color:"#8040c0", ks:"4-6", radius:"75", cfse:-0.80, note:"Co³⁺ LS (t₂g⁶) — Verner komplekslari. Co²⁺ pushti.", bio:"B₁₂ vitamini (kobalamin)", use:"Pigment, kataliz" },
  Ni: { z:28, row:"3d", config:"[Ar]3d⁸4s²", common:"Ni²⁺", dN:"d⁸", color:"#40c080", ks:"4-6", radius:"69", cfse:-1.20, note:"Ni²⁺ d⁸ — oktaedrik (yashil) yoki kvadrat tekis (sariq).", bio:"Mikroelement", use:"Qotishma, Raney nikel" },
  Cu: { z:29, row:"3d", config:"[Ar]3d¹⁰4s¹", common:"Cu²⁺, Cu⁺", dN:"d⁹/d¹⁰", color:"#c06060", ks:"4-6", radius:"73", cfse:-0.60, note:"Cu²⁺ (d⁹) — Jahn-Teller! Moviy rang. Cu⁺ (d¹⁰) rangsiz.", bio:"Mulim mikroelement", use:"Elektr simi, boya" },
  Zn: { z:30, row:"3d", config:"[Ar]3d¹⁰4s²", common:"Zn²⁺", dN:"d¹⁰", color:"#808080", ks:"4", radius:"74", cfse:0, note:"Zn²⁺ d¹⁰ — to'liq to'lgan. Rangsiz, tetraedrik.", bio:"Karboangidraza fermenti", use:"Sink qotishma, batareya" },
  // 4d metallar
  Ru: { z:44, row:"4d", config:"[Kr]4d⁷5s¹", common:"Ru²⁺, Ru³⁺", dN:"d⁶/d⁵", color:"#4080c0", ks:"6", radius:"72", cfse:-2.40, note:"Ru²⁺ d⁶ LS. [Ru(bpy)₃]²⁺ — fotokimyo asosi.", bio:"—", use:"Fotokataliz, OLED" },
  Rh: { z:45, row:"4d", config:"[Kr]4d⁸5s¹", common:"Rh³⁺", dN:"d⁶", color:"#4080a0", ks:"6", radius:"67", cfse:-2.40, note:"Rh³⁺ d⁶ LS. Faqat LS holat. Katalizator.", bio:"—", use:"Avtokatalizator" },
  Pd: { z:46, row:"4d", config:"[Kr]4d¹⁰", common:"Pd²⁺", dN:"d⁸", color:"#40a080", ks:"4", radius:"86", cfse:-1.20, note:"Pd²⁺ d⁸ — kvadrat tekis. Suzuki reaksiyasi.", bio:"—", use:"Katalizator, zargarlik" },
  Ag: { z:47, row:"4d", config:"[Kr]4d¹⁰5s¹", common:"Ag⁺", dN:"d¹⁰", color:"#a0a0a0", ks:"2", radius:"115", cfse:0, note:"Ag⁺ d¹⁰ — chiziqli geometriya. Antimikrob.", bio:"Antimikrob", use:"Kumush, foto, tibbiyot" },
  Cd: { z:48, row:"4d", config:"[Kr]4d¹⁰5s²", common:"Cd²⁺", dN:"d¹⁰", color:"#808080", ks:"4", radius:"95", cfse:0, note:"Cd²⁺ d¹⁰ — tetraedrik. Zaharli.", bio:"Zaharli", use:"Batareya (Ni-Cd)" },
  // 5d metallar
  Os: { z:76, row:"5d", config:"[Xe]4f¹⁴5d⁶6s²", common:"Os²⁺, Os³⁺", dN:"d⁶/d⁵", color:"#4060a0", ks:"6", radius:"72", cfse:-2.40, note:"Osmiy — eng inert. NIR emissiya. [Os(bpy)₃]²⁺.", bio:"—", use:"Biomedikal" },
  Ir: { z:77, row:"5d", config:"[Xe]4f¹⁴5d⁷6s²", common:"Ir³⁺", dN:"d⁶", color:"#4060c0", ks:"6", radius:"68", cfse:-2.40, note:"Ir³⁺ d⁶ LS. OLED — [Ir(ppy)₃]. TADF.", bio:"—", use:"OLED, TADF, kataliz" },
  Pt: { z:78, row:"5d", config:"[Xe]4f¹⁴5d⁹6s¹", common:"Pt²⁺, Pt⁴⁺", dN:"d⁸/d⁶", color:"#60a0a0", ks:"4", radius:"80", cfse:-1.20, note:"Pt²⁺ d⁸ — kvadrat tekis. SISPLATIN! Saraton davosi.", bio:"Sisplatin (saraton)", use:"Tibbiyot, kataliz" },
  Au: { z:79, row:"5d", config:"[Xe]4f¹⁴5d¹⁰6s¹", common:"Au³⁺, Au⁺", dN:"d⁸/d¹⁰", color:"#c0a040", ks:"4", radius:"85", cfse:-1.20, note:"Au³⁺ d⁸ — kvadrat tekis. AURANOFIN — revmatoid artrit.", bio:"Auranofin (artrit)", use:"Tibbiyot, zargarlik" },
  Hg: { z:80, row:"5d", config:"[Xe]4f¹⁴5d¹⁰6s²", common:"Hg²⁺", dN:"d¹⁰", color:"#a0a0a0", ks:"2-4", radius:"102", cfse:0, note:"Hg²⁺ d¹⁰ — chiziqli yoki tetraedrik. Zaharli.", bio:"Zaharli", use:"Termometr" },
}

const ROWS = ["3d", "4d", "5d"]
const ROW_COLORS = { "3d": { text: "text-green-400", bg: "bg-green-600/10 border-green-500/30", header: "🟢 3d metallar" },
  "4d": { text: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30", header: "🔵 4d metallar" },
  "5d": { text: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30", header: "🟣 5d metallar" } }

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV DAVRIY JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function DavriyJadvalInteraktiv() {
  const [selected, setSelected] = useState("Fe")
  const m = ALL_METALS[selected]
  const rowStyle = ROW_COLORS[m.row]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-rose-400">🗺️</span> d-elementlar — interaktiv jadval
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        {ROWS.map(row => (
          <div key={row} className="mb-4 last:mb-0">
            <h4 className={`${ROW_COLORS[row].text} font-bold text-[10px] sm:text-xs mb-2`}>{ROW_COLORS[row].header}</h4>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {Object.entries(ALL_METALS).filter(([_, v]) => v.row === row).map(([sym, v]) => (
                <button key={sym} onClick={() => setSelected(sym)}
                  className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center transition-all min-w-[36px] sm:min-w-[44px] ${
                    selected === sym
                      ? `${ROW_COLORS[row].bg} ring-2 ring-white scale-110`
                      : "bg-purple-950/60 border border-purple-800/40 hover:bg-purple-800/50 hover:scale-105"
                  }`}>
                  <p className="text-[10px] sm:text-sm font-bold text-white">{sym}</p>
                  <p className="text-[8px] sm:text-[10px] text-purple-400">{v.z}</p>
                  <p className={`text-[7px] sm:text-[10px] ${ROW_COLORS[row].text}`}>{v.dN}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tanlangan metall haqida */}
      <div className={`${rowStyle.bg} rounded-xl p-3 sm:p-5`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`text-2xl sm:text-3xl font-bold ${rowStyle.text}`}>{selected}</span>
              <span className="text-[10px] text-purple-400">Z={m.z}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${rowStyle.text} ${rowStyle.bg.split(" ")[0]}`}>{m.row}</span>
            </div>
            <p className="text-[10px] text-purple-300">{m.config}</p>
            <p className="text-[10px] text-purple-300">Umumiy ion: <span className="text-white font-semibold">{m.common}</span></p>
          </div>
          <div className="space-y-1 text-[10px]">
            {[
              ["d konfiguratsiya", m.dN],
              ["Odatiy KS", m.ks],
              ["Ion radiusi", `${m.radius} pm`],
              ["KMBE (O_h)", `${m.cfse.toFixed(2)}Δ`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between">
                <span className="text-purple-400">{l}:</span>
                <span className="text-purple-200 font-semibold">{v}</span>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-[10px] col-span-1 sm:col-span-2 lg:col-span-1">
            <p className="text-purple-200">{m.note}</p>
            <p className="text-purple-300"><span className="text-cyan-400">Biologik:</span> {m.bio}</p>
            <p className="text-purple-300"><span className="text-amber-400">Qo'llanilish:</span> {m.use}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. 3d / 4d / 5d — TO'LIQ TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
function DavrTaqqoslash() {
  const [focus, setFocus] = useState("overview")
  const tabs = {
    overview: {
      title: "📊 Umumiy taqqoslash",
      rows: [
        ["Ion radiusi", "Kichik (60-80 pm)", "O'rtacha (70-90 pm)", "Katta (70-100 pm)"],
        ["Odatiy KS", "4, 6", "6, 7", "6, 7, 8, 9"],
        ["Δ₀ nisbiy", "Kichik (~10 000 cm⁻¹)", "Katta (~20 000 cm⁻¹)", "Juda katta (~30 000 cm⁻¹)"],
        ["Spin holati", "HS yoki LS", "Asosan LS", "Faqat LS"],
        ["Kinetik inertlik", "Labil (tez)", "Inert (sekin)", "Juda inert (eng sekin)"],
        ["Rang", "Kuchsiz-o'rtacha", "Kuchli (MLCT)", "Juda kuchli (SOC)"],
        ["Lyuminessensiya", "Kam (Fe — yo'q)", "Bor (Ru ~1μs)", "Kuchli (Os, Ir)"],
        ["SOC ξ (cm⁻¹)", "~400", "~1000", "~3000-4000"],
        ["Eng muhim", "Fe (gemoglobin)", "Ru (fotokataliz)", "Pt (sisplatin), Ir (OLED)"],
        ["Misol", "[Fe(H₂O)₆]²⁺", "[Ru(bpy)₃]²⁺", "[Ir(ppy)₃]"],
      ],
      color: "text-cyan-400",
      note: "3d → 4d → 5d o'tganda: radius, Δ₀, inertlik, SOC ortadi. Spin holati LS ga o'tadi."
    },
    delta: {
      title: "⚡ Δ₀ va davr",
      rows: [
        ["[Co(NH₃)₆]³⁺", "Co³⁺", "3d⁶", "23 000 cm⁻¹"],
        ["[Rh(NH₃)₆]³⁺", "Rh³⁺", "4d⁶", "34 000 cm⁻¹"],
        ["[Ir(NH₃)₆]³⁺", "Ir³⁺", "5d⁶", "41 000 cm⁻¹"],
        ["[Fe(CN)₆]⁴⁻", "Fe²⁺", "3d⁶", "33 000 cm⁻¹"],
        ["[Ru(CN)₆]⁴⁻", "Ru²⁺", "4d⁶", "45 000 cm⁻¹"],
      ],
      color: "text-yellow-400",
      note: "3d → 4d → 5d: Δ₀ ~30-50% ga ortadi. 5d metallar faqat LS."
    },
    inert: {
      title: "⏱️ Kinetik inertlik",
      rows: [
        ["[Co(NH₃)₆]²⁺", "Co²⁺", "3d⁷ HS", "Labil", "Tez almashinadi"],
        ["[Co(NH₃)₆]³⁺", "Co³⁺", "3d⁶ LS", "Inert", "Kunlab barqaror"],
        ["[Rh(NH₃)₆]³⁺", "Rh³⁺", "4d⁶ LS", "Juda inert", "Haftalab barqaror"],
        ["[Ir(NH₃)₆]³⁺", "Ir³⁺", "5d⁶ LS", "Eng inert", "Oylab barqaror"],
      ],
      color: "text-green-400",
      note: "Kinetik inertlik: 3d(HS) < 3d(LS) < 4d(LS) < 5d(LS). Ligand almashinish tezligi 10⁶ − 10⁻⁸ s⁻¹."
    }
  }

  const t = tabs[focus]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">⚖️</span> 3d vs 4d vs 5d — davr taqqoslash
      </h3>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(tabs).map(([key, val]) => (
          <button key={key} onClick={() => setFocus(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${focus === key ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {val.title}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="border-b border-purple-700/40">
                {focus === "overview" && (
                  <>
                    <th className="p-1.5 sm:p-2 text-left text-purple-200 font-bold">Xususiyat</th>
                    <th className="p-1.5 sm:p-2 text-left text-green-400 font-bold">3d</th>
                    <th className="p-1.5 sm:p-2 text-left text-blue-400 font-bold">4d</th>
                    <th className="p-1.5 sm:p-2 text-left text-purple-400 font-bold">5d</th>
                  </>
                )}
                {focus === "delta" && (
                  <><th className="p-1.5 sm:p-2 text-left text-purple-200">Kompleks</th><th className="p-1.5 sm:p-2 text-left text-purple-200">Ion</th><th className="p-1.5 sm:p-2 text-left text-purple-200">Konfig.</th><th className="p-1.5 sm:p-2 text-right text-yellow-400">Δ₀</th></>
                )}
                {focus === "inert" && (
                  <><th className="p-1.5 sm:p-2 text-left text-purple-200">Kompleks</th><th className="p-1.5 sm:p-2 text-left text-purple-200">Ion</th><th className="p-1.5 sm:p-2 text-left text-purple-200">dⁿ</th><th className="p-1.5 sm:p-2 text-left text-green-400">Inertlik</th><th className="p-1.5 sm:p-2 text-left text-purple-200">Barqarorlik</th></>
                )}
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {t.rows.map((row, i) => (
                <tr key={i} className="border-b border-purple-800/20 hover:bg-purple-800/20">
                  {row.map((cell, j) => (
                    <td key={j} className={`p-1.5 sm:p-2 ${j === 0 ? "font-bold text-purple-100" : j === row.length - 1 ? "text-yellow-300 font-mono font-bold" : ""}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
          <p className="text-yellow-400 font-bold">💡 </p>
          <p className="text-purple-200">{t.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. IRVING-WILLIAMS QATORI
// ═══════════════════════════════════════════════════════════════════════════════
function IrvingWilliams() {
  const [showCFSE, setShowCFSE] = useState(false)
  const data = [
    { metal: "Mn²⁺", d: "d⁵ HS", val: 0.2, bar: 15, cfse: 0, bg: "bg-gray-400", color: "#9ca3af" },
    { metal: "Fe²⁺", d: "d⁶ HS", val: 0.4, bar: 30, cfse: -0.40, bg: "bg-yellow-500", color: "#eab308" },
    { metal: "Co²⁺", d: "d⁷ HS", val: 0.6, bar: 45, cfse: -0.80, bg: "bg-orange-500", color: "#f97316" },
    { metal: "Ni²⁺", d: "d⁸", val: 0.8, bar: 60, cfse: -1.20, bg: "bg-green-500", color: "#22c55e" },
    { metal: "Cu²⁺", d: "d⁹", val: 1.0, bar: 90, cfse: -0.60, bg: "bg-blue-500", color: "#3b82f6" },
    { metal: "Zn²⁺", d: "d¹⁰", val: 0.3, bar: 20, cfse: 0, bg: "bg-gray-500", color: "#6b7280" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-amber-400">📈</span> Irving-Williams qatori — M²⁺ komplekslar barqarorligi
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <p className="text-purple-200 text-xs sm:text-sm mb-4">
          <strong className="text-yellow-400">Irving-Williams qatori</strong> (1953) — ikki valentli 3d metallarning 
          barqarorlik tartibi. <strong>Cu²⁺</strong> eng barqaror komplekslarni hosil qiladi.
        </p>

        <div className="flex items-end gap-1.5 h-32 sm:h-36 mb-3">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group">
              <div className={`text-[9px] font-mono mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${showCFSE ? "text-yellow-300" : "text-purple-300"}`}>
                {showCFSE ? `${item.cfse.toFixed(2)}Δ` : `logK=${(item.val * 6 + 2).toFixed(1)}`}
              </div>
              <div className={`w-full rounded-t-lg group-hover:scale-105 transition-transform ${item.bg}`}
                style={{ height: `${item.bar}%`, minHeight: "20px" }}>
              </div>
              <div className="text-[9px] sm:text-xs font-bold text-purple-300 group-hover:text-white transition-colors mt-1">{item.metal}</div>
              <div className="text-[7px] sm:text-[9px] text-purple-500">{item.d}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setShowCFSE(!showCFSE)}
            className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${showCFSE ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300"}`}>
            {showCFSE ? "📊 Barqarorlik k." : "⚡ KMBE ko'rsatish"}
          </button>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-[10px]">
          <p className="text-yellow-400 font-bold mb-1">Qator:</p>
          <p className="text-purple-200 font-mono text-xs sm:text-sm">
            <span className="text-gray-400">Mn²⁺ {'<'} </span>
            <span className="text-yellow-400">Fe²⁺ {'<'} </span>
            <span className="text-orange-400">Co²⁺ {'<'} </span>
            <span className="text-green-400">Ni²⁺ {'<'} </span>
            <span className="text-blue-400 font-bold">Cu²⁺</span>
            <span className="text-gray-400"> {'>'} Zn²⁺</span>
          </p>
          <p className="text-purple-300 mt-2">
            <strong className="text-cyan-400">Sababi:</strong> CFSE (−1.20Δ) + Jahn-Teller stabillashuvi + ion radiusi. 
            Cu²⁺ da JT effekti tufayli qo'shimcha barqarorlik. Zn²⁺ da CFSE = 0 — barqarorlik keskin pasayadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ION RADIUSI VA KS
// ═══════════════════════════════════════════════════════════════════════════════
function IonRadiusi() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-orange-400">📏</span> Ion radiusi va koordinatsion son
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {[
          { row: "3d", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30", size: "Kichik (60-80 pm)", ks: "4 yoki 6", note: "Ti³⁺ (67), Cr³⁺ (62), Fe²⁺ (78)", cfse: "Kichik", soc: "Kuchsiz (~400 cm⁻¹)" },
          { row: "4d", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30", size: "O'rtacha (70-90 pm)", ks: "6 yoki 7", note: "Ru²⁺ (72), Rh³⁺ (67), Pd²⁺ (86)", cfse: "Katta", soc: "Kuchli (~1000 cm⁻¹)" },
          { row: "5d", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30", size: "Katta (70-100 pm)", ks: "6, 7, 8, 9", note: "Pt²⁺ (80), Au³⁺ (85), Hg²⁺ (102)", cfse: "Juda katta", soc: "Juda kuchli (~3000 cm⁻¹)" },
        ].map(c => (
          <div key={c.row} className={`${c.bg} rounded-xl p-4 sm:p-5`}>
            <h4 className={`${c.color} font-bold text-sm mb-3`}>{c.row} metallar</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-400">Radius:</span>
                <span className="text-purple-200 font-semibold">{c.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">KS:</span>
                <span className="text-purple-200 font-semibold">{c.ks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">CFSE:</span>
                <span className="text-purple-200 font-semibold">{c.cfse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">SOC:</span>
                <span className="text-purple-200 font-semibold">{c.soc}</span>
              </div>
              <p className="text-purple-300 text-[10px] mt-2">{c.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-[10px]">
        <p className="text-purple-400 font-bold mb-1">⚡ Lantanid qisqarishi:</p>
        <p className="text-purple-200">5d metallar radiusi 4d dan kichikroq bo'lishi mumkin — 4f elektronlarning yadroni yomon ekranlashi tufayli (lantanid qisqarishi). Pt²⁺ (80 pm) vs Pd²⁺ (86 pm).</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. ENG MUHIM METALL KOMPLEKSLAR
// ═══════════════════════════════════════════════════════════════════════════════
function MuhimKomplekslar() {
  const [comp, setComp] = useState(0)
  const data = [
    { name: "Gemoglobin (Fe)", icon: "🩸", desc: "Fe²⁺(d⁶) — porfirin halqasida. O₂ tashish. Oktaedrik (N₄ + His + O₂).", bio: "Eng muhim biologik kompleks", use: "O₂ tashish, qon" },
    { name: "[Ru(bpy)₃]²⁺", icon: "💡", desc: "Ru²⁺(d⁶ LS) — MLCT *3MLCT. Fotokimyo asosi. τ ≈ 1 μs.", bio: "Fotosensibilizator", use: "Fotokataliz, DSSC" },
    { name: "Sisplatin [PtCl₂(NH₃)₂]", icon: "💊", desc: "Pt²⁺(d⁸) — kvadrat tekis. DNK bilan bog'lanadi. Saraton davosi.", bio: "Saraton terapiyasi", use: "Tibbiyot" },
    { name: "[Ir(ppy)₃]", icon: "🖥️", desc: "Ir³⁺(d⁶ LS) — TADF/OLED. Fosforessensiya. τ ≈ 1-10 μs.", bio: "OLED displeylar", use: "Elektronika" },
    { name: "B₁₂ vitamin (Co)", icon: "💊", desc: "Co³⁺(d⁶ LS) — kobalamin. Korrin halqasida Co−C σ-bog'.", bio: "Muhim vitamin", use: "Tibbiyot" },
    { name: "Ferrosen [Fe(C₅H₅)₂]", icon: "🧪", desc: "Fe²⁺(d⁶) — sendvich struktura. 1951 yil. Organometall kimyo asosi.", bio: "Model kompleks", use: "Kataliz, material" },
  ]
  const c = data[comp]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-emerald-400">🏆</span> Eng muhim metall komplekslar
      </h3>

      <div className="flex gap-1.5 flex-wrap">
        {data.map((item, i) => (
          <button key={i} onClick={() => setComp(i)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${comp === i ? "bg-purple-600 text-white" : "bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {item.icon} {item.name.split("(")[0].trim()}
          </button>
        ))}
      </div>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{c.icon}</span>
          <div>
            <h4 className="text-white font-bold text-sm">{c.name}</h4>
            <p className="text-purple-200 text-xs mt-1">{c.desc}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2">
            <p className="text-purple-400 font-bold">Biologik ahamiyati:</p>
            <p className="text-purple-200">{c.bio}</p>
          </div>
          <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2">
            <p className="text-purple-400 font-bold">Qo'llanilishi:</p>
            <p className="text-purple-200">{c.use}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestMetallar() {
  const questions = [
    { q: "Irving-Williams qatorida eng barqaror kompleks qaysi metallda?", a: "Cu²⁺", opts: ["Mn²⁺", "Fe²⁺", "Ni²⁺", "Cu²⁺"], hint: "Jahn-Teller stabillashuvi" },
    { q: "3d → 4d → 5d o'tganda Δ₀ qanday o'zgaradi?", a: "Ortadi (~30-50%)", opts: ["Kamayadi", "Ortadi (~30-50%)", "O'zgarmaydi", "Avval ortadi keyin kamayadi"], hint: "Kattaroq orbitallar → ko'proq qoplanish" },
    { q: "Kvadrat tekis geometriya qaysi metallda eng ko'p uchraydi?", a: "Pt²⁺ (d⁸)", opts: ["Fe²⁺", "Cr³⁺", "Pt²⁺ (d⁸)", "Zn²⁺"], hint: "Sisplatin" },
    { q: "Lantanid qisqarishi nima?", a: "5d metallar radiusi 4d dan kichik", opts: ["4d metallar radiusi 5d dan kichik", "5d metallar radiusi 4d dan kichik", "3d metallar eng katta", "Radius o'zgarmaydi"], hint: "4f elektronlar yomon ekranlaydi" },
    { q: "Eng inert komplekslar qaysi qator metallarida?", a: "5d metallar", opts: ["3d metallar", "4d metallar", "5d metallar", "Barchasi bir xil"], hint: "Katta Δ₀, kuchli maydon" },
    { q: "Qaysi metall kompleksi fotodinamik terapiyada qo'llaniladi?", a: "Ru (ruteniy)", opts: ["Fe (temir)", "Ru (ruteniy)", "Pt (platina)", "Co (kobalt)"], hint: "[Ru(bpy)₃]²⁺" },
    { q: "Sisplatin qanday geometriyaga ega?", a: "Kvadrat tekis (D4h)", opts: ["Oktaedrik", "Tetraedrik", "Kvadrat tekis (D4h)", "Chiziqli"], hint: "Pt²⁺ d⁸" },
    { q: "Gemoglobin tarkibida qaysi metall bor?", a: "Fe (temir)", opts: ["Cu (mis)", "Fe (temir)", "Co (kobalt)", "Zn (rux)"], hint: "Eng muhim biometall" },
    { q: "3d metallardan qaysi biri doimo LS holatida bo'ladi?", a: "Hech biri — 3d metallarda HS/LS tanlash mumkin", opts: ["Cr³⁺", "Ni²⁺", "Hech biri — 3d metallarda HS/LS tanlash mumkin", "Co³⁺"], hint: "3d da Δ₀ yetarli emas" },
    { q: "Qaysi metall kompleksi OLED displeylarda qo'llaniladi?", a: "Ir (iridiy) — [Ir(ppy)₃]", opts: ["Ru (ruteniy)", "Ir (iridiy) — [Ir(ppy)₃]", "Pt (platina)", "Os (osmiy)"], hint: "TADF/fosforessensiya" },
  ]

  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
          <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2"><span className="text-emerald-400">📝</span> Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => { setS(opt); const ok = opt === q.a; if (ok && !ans[c]) setSc(p => p + 1); setAns(p => ({...p, [c]: ok})) })()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s === opt ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200") : s ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50") : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}
            </button>
          ))}
        </div>
        {s && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>{s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={() => { if (c < questions.length - 1) { setC(p => p + 1); setS(null) } else setRes(true) }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function KompleksMetallar() {
  const [view, setView] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="hover:text-purple-300">Atom tuzilishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-rose-400">Kompleks metallar</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-rose-400 flex items-center gap-2">
                <span>🧲</span> Kompleks hosil qiluvchi metallar
              </h1>
              <p className="text-[10px] sm:text-xs text-purple-500">3d, 4d, 5d elementlari • Irving-Williams • SOC • OTM darajasi</p>
            </div>
            <button onClick={() => setView(view === "all" ? "compact" : "all")}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
              {view === "all" ? "🏆 Komplekslar" : "📄 To'liq"}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Kompleks hosil qiluvchi metallar</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">d-elementlar</strong> — kompleks birikmalarning asosiy markaziy atomlari.
                Ular bo'sh d-orbitallarga ega bo'lgani uchun ligandlardan elektron juftlarini qabul qiladi.
                3d, 4d va 5d elementlari orasida kompleks hosil qilish qobiliyati
                <strong className="text-yellow-400"> ion radiusi, zaryad, elektron konfiguratsiya va CFSE</strong> ga bog'liq.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">20 ta metall</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">3 davr taqqoslash</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-rose-400 font-bold">🎯 Maqsad:</span> d-elementlarning kompleks hosil qilish qobiliyati, davr bo'ylab o'zgarishini tushunish.</p>
              <p className="text-purple-300"><span className="text-rose-400 font-bold">⏱️ Vaqt:</span> ~3 soat</p>
              <p className="text-purple-300"><span className="text-rose-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-yellow-300 font-mono text-xs">3d → 4d → 5d: Δ₀↑, inertlik↑, LS ga o'tish</p>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <DavriyJadvalInteraktiv />
        </div>

        {view === "all" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <DavrTaqqoslash />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <IrvingWilliams />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
              <IonRadiusi />
            </div>
          </>
        )}

        {/* MUHIM KOMPLEKSLAR */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <MuhimKomplekslar />
        </div>

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestMetallar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>3d metallar — eng ko'p o'rganilgan, KS 4/6, HS/LS mumkin, labil</li>
            <li>4d/5d metallar — katta ion radiusi, yuqori KS, faqat LS, inert</li>
            <li><strong className="text-yellow-400">Irving-Williams:</strong> Mn²⁺ {'<'} Fe²⁺ {'<'} Co²⁺ {'<'} Ni²⁺ {'<'} <strong className="text-blue-400">Cu²⁺</strong> {'>'} Zn²⁺</li>
            <li>3d→4d→5d: Δ₀, inertlik, SOC ortadi. Lantanid qisqarishi — 5d radiusi 4d dan kichik</li>
            <li><strong className="text-rose-400">Eng muhim metallar:</strong> Fe (gemoglobin), Ru (fotokataliz), Pt (sisplatin), Ir (OLED)</li>
          </ol>
        </div>

        {/* NAVIGATSIYA — BU BIRINCHI MAVZUNING OXIRGI BO'LIMI */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Elektron konfiguratsiyalar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-500/20">
            📚 Atom tuzilishi (bosh sahifa) <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-xs text-purple-300">🎉 <strong className="text-yellow-400">Birinchi mavzu yakunlandi!</strong> — Atom tuzilishi va d-orbitallar (7 bo'lim, ~5600 qator kod)</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()} | O'zbekistondagi ilk interaktiv koordinatsion kimyo platformasi</p>
        </div>
      </section>
    </main>
  )
}
