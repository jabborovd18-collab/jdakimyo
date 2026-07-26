"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. 18 ELEKTRON KALKULYATORI (INTERAKTIV)
// ═══════════════════════════════════════════════════════════════════════════════
function ElektronKalkulyator() {
  const [metal, setMetal] = useState("Fe")
  const [oksidlanish, setOksidlanish] = useState(0)
  const [ligandlar, setLigandlar] = useState([
    {n:"CO", s:2, c:5}
  ])
  const [zaryad, setZaryad] = useState(0)

  const metals = {
    Ti: {z:22, d:"3d²4s²", gr:4}, V: {z:23, d:"3d³4s²", gr:5},
    Cr: {z:24, d:"3d⁵4s¹", gr:6}, Mn: {z:25, d:"3d⁵4s²", gr:7},
    Fe: {z:26, d:"3d⁶4s²", gr:8}, Co: {z:27, d:"3d⁷4s²", gr:9},
    Ni: {z:28, d:"3d⁸4s²", gr:10}, Cu: {z:29, d:"3d¹⁰4s¹", gr:11},
    Zn: {z:30, d:"3d¹⁰4s²", gr:12}, Mo: {z:42, d:"4d⁵5s¹", gr:6},
    Ru: {z:44, d:"4d⁷5s¹", gr:8}, Rh: {z:45, d:"4d⁸5s¹", gr:9},
    Pd: {z:46, d:"4d¹⁰", gr:10}, W: {z:74, d:"5d⁴6s²", gr:6},
    Pt: {z:78, d:"5d⁹6s¹", gr:10}
  }

  const ligandOptions = [
    {n:"CO", s:2}, {n:"CN⁻", s:2}, {n:"NH₃", s:2}, {n:"H₂O", s:2},
    {n:"Cl⁻", s:1}, {n:"Br⁻", s:1}, {n:"I⁻", s:1}, {n:"PR₃", s:2},
    {n:"NO⁺", s:2}, {n:"NO (chiziqli)", s:3}, {n:"NO (burchakli)", s:1},
    {n:"O²⁻", s:4}, {n:"OH⁻", s:2}, {n:"C₅H₅⁻", s:6}, {n:"C₆H₆", s:6},
    {n:"CH₃⁻", s:2}, {n:"H⁻", s:2}, {n:"CO (ko'prik)", s:1},
  ]

  const addLigand = (lig) => {
    setLigandlar([...ligandlar, {n:lig.n, s:lig.s, c:1}])
  }

  const updateLigand = (idx, field, val) => {
    const updated = [...ligandlar]
    updated[idx] = {...updated[idx], [field]: field==="c" ? Math.max(0, parseInt(val)||0) : val}
    setLigandlar(updated)
  }

  const removeLigand = (idx) => {
    setLigandlar(ligandlar.filter((_,i)=>i!==idx))
  }

  const metalData = metals[metal]
  const dElectrons = metalData ? metalData.gr - 2 - oksidlanish + parseInt(zaryad) : 0
  const ligandElectrons = ligandlar.reduce((s, l) => s + l.s * l.c, 0)
  const total = dElectrons + ligandElectrons
  const isStable = total === 18
  const isStable16 = total === 16 && ["Pt","Pd","Ni"].includes(metal)

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-red-400">🧮</span> 18 elektron kalkulyatori — interaktiv
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chap: Metall tanlash */}
        <div className="space-y-3">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-amber-400 font-bold text-sm mb-2">Metallni tanlang</p>
            <div className="flex gap-1 flex-wrap mb-2">
              {Object.keys(metals).map(k => (
                <button key={k} onClick={()=>setMetal(k)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold ${metal===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{k}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-purple-400">Oksidlanish:</span>
              <input type="range" min="-2" max="6" step="1" value={oksidlanish}
                onChange={e=>setOksidlanish(parseInt(e.target.value))}
                className="flex-1 accent-red-500 h-1" />
              <span className="text-cyan-300 font-mono w-6 text-right">{oksidlanish}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-purple-400">Zaryad:</span>
              <input type="range" min="-3" max="3" step="1" value={zaryad}
                onChange={e=>setZaryad(parseInt(e.target.value))}
                className="flex-1 accent-purple-500 h-1" />
              <span className="text-cyan-300 font-mono w-6 text-right">{zaryad}</span>
            </div>
            <p className="text-purple-300 mt-1">Konfiguratsiya: {metalData.d} → d<sup>{dElectrons}</sup></p>
          </div>

          {/* Ligand qo'shish */}
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-amber-400 font-bold text-sm mb-2">Ligand qo'shish</p>
            <div className="flex gap-1 flex-wrap mb-2">
              {ligandOptions.map(l => (
                <button key={l.n} onClick={()=>addLigand(l)}
                  className="px-1.5 py-0.5 rounded text-[8px] bg-purple-900/50 text-purple-300 hover:bg-purple-800 border border-purple-700/30">
                  {l.n} ({l.s}e⁻)
                </button>
              ))}
            </div>

            {/* Tanlangan ligandlar */}
            {ligandlar.map((l, i) => (
              <div key={i} className="flex items-center gap-1 mt-1 bg-purple-950/80 rounded p-1">
                <span className="text-yellow-300 font-mono text-[9px] w-12">{l.n}</span>
                <span className="text-purple-400 text-[8px]">{l.s}e⁻</span>
                <input type="number" min="0" max="12" value={l.c}
                  onChange={e=>updateLigand(i,"c",e.target.value)}
                  className="w-8 h-5 bg-purple-900/70 text-center text-white text-[9px] rounded border border-purple-700/50" />
                <span className="text-purple-400 text-[8px]">× {l.c} = {l.s*l.c}e⁻</span>
                <button onClick={()=>removeLigand(i)} className="ml-auto text-red-400 text-[9px] hover:text-red-300">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* O'ng: Natija */}
        <div className="space-y-3">
          <div className={`rounded-xl p-4 text-xs space-y-2 border ${
            isStable ? "bg-green-600/10 border-green-500/30" :
            isStable16 ? "bg-yellow-600/10 border-yellow-500/30" :
            "bg-red-600/10 border-red-500/30"
          }`}>
            <p className={`font-bold text-sm ${isStable?"text-green-400":isStable16?"text-yellow-400":"text-red-400"}`}>
              {metal}({oksidlanish >= 0 ? "+" : ""}{oksidlanish}) — Jami: {total} e⁻
            </p>
            <div className="flex justify-between"><span className="text-purple-400">Metall d-e⁻:</span><span className="text-cyan-300 font-mono">{dElectrons}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ligandlar:</span><span className="text-green-300 font-mono">{ligandElectrons}</span></div>
            <div className="flex justify-between border-t border-purple-700/30 pt-1"><span className="text-purple-400 font-bold">Jami:</span><span className={`text-lg font-bold font-mono ${isStable?"text-green-400":isStable16?"text-yellow-400":"text-red-400"}`}>{total} e⁻</span></div>
            <p className="text-center mt-2">
              {isStable ? "✅ 18 e⁻ — Barqaror!" :
               isStable16 ? "⚠️ 16 e⁻ — d⁸ kvadrat planar" :
               `❌ ${total} e⁻ — 18 e⁻ emas`}
            </p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="text-purple-400 font-bold">EAN (Effective Atomic Number):</p>
            <p className="text-purple-200">EAN = Z_metal − oksidlanish + 2 × ligand soni</p>
            <p className="text-cyan-300 font-mono text-center text-sm">
              EAN = {metalData.z} − {oksidlanish >= 0 ? oksidlanish : `(${oksidlanish})`} + {ligandElectrons} = {metalData.z - oksidlanish + ligandElectrons}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. METALL KARBONILLARI — TO'LIQ JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function MetallKarbonillari() {
  const [sel, setSel] = useState(null)
  const rows = [
    {n:"[Ni(CO)₄]", m:"Ni(0)", d:"3d¹⁰", le:10, ll:"4CO", le2:8, t:18, g:"T_d", nu:2057, nuRef:86, e:"18/18"},
    {n:"[Fe(CO)₅]", m:"Fe(0)", d:"3d⁸", le:8, ll:"5CO", le2:10, t:18, g:"D₃h", nu:2020, nuRef:123, e:"18/18"},
    {n:"[Cr(CO)₆]", m:"Cr(0)", d:"3d⁶", le:6, ll:"6CO", le2:12, t:18, g:"O_h", nu:2000, nuRef:143, e:"18/18"},
    {n:"[Mo(CO)₆]", m:"Mo(0)", d:"4d⁶", le:6, ll:"6CO", le2:12, t:18, g:"O_h", nu:1990, nuRef:153, e:"18/18"},
    {n:"[W(CO)₆]", m:"W(0)", d:"5d⁶", le:6, ll:"6CO", le2:12, t:18, g:"O_h", nu:1980, nuRef:163, e:"18/18"},
    {n:"[V(CO)₆]", m:"V(0)", d:"3d⁵", le:5, ll:"6CO", le2:12, t:17, g:"O_h", nu:1860, nuRef:283, e:"17/18"},
    {n:"[Mn(CO)₅]⁺", m:"Mn⁺", d:"3d⁵", le:6, ll:"5CO", le2:10, t:16, g:"D₃h", nu:2090, nuRef:53, e:"16/18"},
    {n:"[Co(CO)₄]⁻", m:"Co⁻", d:"3d⁸", le:10, ll:"4CO", le2:8, t:18, g:"T_d", nu:1890, nuRef:253, e:"18/18"},
    {n:"[Fe₂(CO)₉]", m:"Fe(0)", d:"3d⁸×2", le:16, ll:"6CO+3CO₋", le2:18, t:34, g:"D₃h", nu:1800, nuRef:343, e:"34/36"},
    {n:"[Co₂(CO)₈]", m:"Co(0)", d:"3d⁹×2", le:18, ll:"6CO+2CO₋", le2:16, t:34, g:"C₂v", nu:1850, nuRef:293, e:"34/36"},
  ]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🏭</span> Metall karbonillari — 18 e⁻ qoidasi bo'yicha
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[7px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">Kompleks</th>
            <th className="p-1 text-center text-purple-200">Metal</th>
            <th className="p-1 text-left text-purple-200">d</th>
            <th className="p-1 text-right text-purple-200">M e⁻</th>
            <th className="p-1 text-left text-purple-200">Ligand</th>
            <th className="p-1 text-right text-purple-200">L e⁻</th>
            <th className="p-1 text-center text-purple-200">Jami</th>
            <th className="p-1 text-center text-purple-200">ν(CO)</th>
            <th className="p-1 text-center text-purple-200">Δν</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40":"hover:bg-purple-800/30"}`}>
                <td className={`p-1 font-mono font-bold ${sel===i?"text-pink-300":"text-yellow-300"}`}>{r.n}</td>
                <td className="p-1 text-center text-purple-300">{r.m}</td>
                <td className="p-1 text-purple-200">{r.d}</td>
                <td className="p-1 text-right text-cyan-300 font-mono">{r.le}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[9px]">{r.ll}</td>
                <td className="p-1 text-right text-green-300 font-mono">{r.le2}</td>
                <td className={`p-1 text-center font-bold font-mono ${r.t===18?"text-green-400":"text-orange-400"}`}>{r.t}</td>
                <td className="p-1 text-center text-purple-300 font-mono">{r.nu}</td>
                <td className="p-1 text-center" style={{color:`rgb(${255-Math.round(r.nuRef/2)}${80+Math.round(r.nuRef/3)}0)`}}>{r.nuRef}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-2 text-[10px] mt-2">
          <p className="text-yellow-400 font-bold">{rows[sel].n} ({rows[sel].g})</p>
          <p className="text-purple-200">{rows[sel].m} → d{rows[sel].d}: {rows[sel].le} + {rows[sel].le2} = {rows[sel].t} e⁻. ν(CO) = {rows[sel].nu} cm⁻¹ (erkin CO dan {rows[sel].nuRef} cm⁻¹ past).</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. 16 E⁻ VA 20 E⁻ ISTISNOLAR
// ═══════════════════════════════════════════════════════════════════════════════
function Istisnolar() {
  const [view, setView] = useState("se")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">⚠️</span> 18 e⁻ qoidasidan istisnolar
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("se")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="se"?"bg-yellow-600/60 text-white border border-yellow-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50"}`}>
          16 e⁻ — d⁸ kvadrat planar
        </button>
        <button onClick={()=>setView("twenty")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="twenty"?"bg-orange-600/60 text-white border border-orange-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50"}`}>
          20 e⁻ — nikkelosen
        </button>
        <button onClick={()=>setView("radical")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="radical"?"bg-red-600/60 text-white border border-red-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50"}`}>
          17 e⁻ — radikallar
        </button>
      </div>
      {view === "se" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 space-y-2">
            <p className="text-yellow-400 font-bold">16 e⁻ komplekslar — d⁸ kvadrat planar:</p>
            <p className="text-purple-200">d⁸ metallar (Ni²⁺, Pd²⁺, Pt²⁺, Rh⁺, Ir⁺) kvadrat planar geometriyada 16 e⁻ bilan barqaror.</p>
            <p className="text-purple-200"><strong className="text-green-300">Sababi:</strong> dₓ²−y² orbitali LUMO bo'lib, 5-ligand qabul qilish uchun juda yuqori energiyada.</p>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1 mt-1">
              {[
                "[PtCl₄]²⁻ — 16 e⁻ (d⁸) — anti-kanser",
                "[Ni(CN)₄]²⁻ — 16 e⁻ (d⁸) — sariq",
                "[PdCl₄]²⁻ — 16 e⁻ (d⁸)",
                "[RhCl(PPh₃)₃] — 16 e⁻ (d⁸) — Wilkinson katalizatori",
              ].map((s,i)=>(
                <p key={i} className="text-purple-200">{s}</p>
              ))}
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-purple-400 font-bold">Nega 16 e⁻ barqaror?</p>
            <p className="text-purple-200">d⁸ metallarida dₓ²−y² orbitali LUMO bo'ladi. 5-ligand qo'shilishi uchun bu orbitalga elektron sig'ishi kerak, lekin bu energiya jihatdan noqulay.</p>
            <p className="text-purple-200">16 e⁻ komplekslar <strong className="text-yellow-300">koordinatsion to'yinmagan</strong> bo'lib, katalitik faollik ko'rsatadi.</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 Wilkinson katalizatori [RhCl(PPh₃)₃] — 16 e⁻. Olefin gidrogenlashda ishlatiladi.</p>
            </div>
          </div>
        </div>
      )}
      {view === "twenty" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 space-y-2">
            <p className="text-orange-400 font-bold">20 e⁻ — Nikkelosen [Ni(C₅H₅)₂]:</p>
            <p className="text-purple-200">Ni²⁺ (3d⁸) + 2 Cp⁻ (2×6e⁻) = 8 + 12 = 20 e⁻</p>
            <p className="text-purple-200">Ferrosen (Fe²⁺, 18 e⁻) dan farqli ravishda, nikkelosen 20 e⁻ ga ega.</p>
            <p className="text-purple-200"><strong className="text-green-300">Nega barqaror?</strong> Cp⁻ ligandlarning π* orbitallari ortiqcha elektronlarni qabul qiladi.</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-purple-400 font-bold">20 e⁻ komplekslarning xususiyatlari:</p>
            <p className="text-purple-200">• Elektron konfiguratsiya: (e₂g)⁴ (a₁g)² (e₁g)⁴ (e₂u)⁴ (a₂u)² (e₁u)⁴</p>
            <p className="text-purple-200">• Ko'pincha <strong className="text-red-300">paramagnit</strong> (juftlanmagan elektronlar)</p>
            <p className="text-purple-200">• Reaksiyaga kirishish qobiliyati yuqori</p>
            <p className="text-purple-200 mt-1"><strong className="text-yellow-300">Boshqa 20 e⁻ misollar:</strong></p>
            <p className="text-purple-200">[Co(C₅H₅)₂] — kobalotsen, 19 e⁻ (paramagnit)</p>
          </div>
        </div>
      )}
      {view === "radical" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 space-y-2">
            <p className="text-red-400 font-bold">17 e⁻ — Radikal komplekslar:</p>
            <p className="text-purple-200">[V(CO)₆] — V(0) 3d⁵ + 6CO = 5 + 12 = 17 e⁻</p>
            <p className="text-purple-200">Toq sonli elektron → <strong className="text-red-300">paramagnit</strong>, radikal xarakter</p>
            <p className="text-purple-200">17 e⁻ komplekslar <strong className="text-yellow-300">ko'pincha dimerlanadi</strong> (M−M bog' hosil qiladi).</p>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 mt-1">
              <p className="text-purple-200">2 [V(CO)₆] → [V₂(CO)₁₂] (M−M bog')</p>
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-purple-400 font-bold">Radikal komplekslarning xossalari:</p>
            <p className="text-purple-200">• <strong className="text-red-300">Paramagnit</strong> — EPR spektroskopiyada signal beradi</p>
            <p className="text-purple-200">• Bir elektronli oksidlanish/qaytarilish reaksiyalarida qatnashadi</p>
            <p className="text-purple-200">• Ko'pincha <strong className="text-yellow-300">dimerlanish</strong> orqali 18 e⁻ ga intiladi</p>
            <p className="text-purple-200">• [Mn(CO)₅] (17 e⁻) — [Mn₂(CO)₁₀] (18 e⁻) dimerlanadi</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. METALLOSENLAR — SANDVICH KOMPLEKSLAR
// ═══════════════════════════════════════════════════════════════════════════════
function Metallosenlar() {
  const [sel, setSel] = useState(0)
  const data = [
    {n:"Ferrosen Fe(C₅H₅)₂", m:"Fe²⁺", d:"3d⁶", le:6, ll:"2×Cp⁻ (6e⁻)", le2:12, t:18, g:"D₅d", r:"To'q sariq", mp:173, note:"Eng barqaror metallosen. Havoda barqaror. 1951 yilda kashf etilgan."},
    {n:"Kobalotsen Co(C₅H₅)₂", m:"Co²⁺", d:"3d⁷", le:7, ll:"2×Cp⁻ (6e⁻)", le2:12, t:19, g:"D₅d", r:"Qora", mp:174, note:"19 e⁻ → paramagnit. Ferrosendan farqli, havoda oksidlanadi."},
    {n:"Nikkelosen Ni(C₅H₅)₂", m:"Ni²⁺", d:"3d⁸", le:8, ll:"2×Cp⁻ (6e⁻)", le2:12, t:20, g:"D₅d", r:"Yashil", mp:173, note:"20 e⁻. Paramagnit. Ikki valentli nikel."},
    {n:"Rutenosen Ru(C₅H₅)₂", m:"Ru²⁺", d:"4d⁶", le:6, ll:"2×Cp⁻ (6e⁻)", le2:12, t:18, g:"D₅d", r:"Sariq", mp:200, note:"18 e⁻. Ferrosenning 4d analogi."},
    {n:"Osmosen Os(C₅H₅)₂", m:"Os²⁺", d:"5d⁶", le:6, ll:"2×Cp⁻ (6e⁻)", le2:12, t:18, g:"D₅d", r:"Sarg'ish", mp:"—", note:"18 e⁻. 5d analog. Juda barqaror."},
    {n:"Vanadotsen V(C₅H₅)₂", m:"V²⁺", d:"3d³", le:3, ll:"2×Cp⁻ (6e⁻)", le2:12, t:15, g:"D₅d", r:"Binafsha", mp:167, note:"15 e⁻. Paramagnit. Havoda tez oksidlanadi."},
    {n:"Xromotsen Cr(C₅H₅)₂", m:"Cr²⁺", d:"3d⁴", le:4, ll:"2×Cp⁻ (6e⁻)", le2:12, t:16, g:"D₅d", r:"Qizil", mp:173, note:"16 e⁻. Paramagnit."},
    {n:"Manganotsen Mn(C₅H₅)₂", m:"Mn²⁺", d:"3d⁵", le:5, ll:"2×Cp⁻ (6e⁻)", le2:12, t:17, g:"D₅d", r:"Qahrabo", mp:173, note:"17 e⁻. Yuqori spinli (S=5/2)."},
  ]
  const c = data[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-indigo-400">🏗️</span> Metallosenlar — sandvich komplekslar tahlili
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {data.map((d,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{d.n.split(" ")[0]}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{c.n} ({c.g})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Metall:</span><span className="text-cyan-300 font-mono">{c.m} ({c.d})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ligandlar:</span><span className="text-green-300 font-mono">{c.ll}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Hisob:</span><span className="text-amber-300 font-mono">{c.le} + {c.le2} = {c.t} e⁻</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Rang:</span><span className="text-pink-300">{c.r}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Suyuqlanish T:</span><span className="text-purple-200">{c.mp}°C</span></div>
            <div className={`text-center mt-1 font-bold ${c.t===18?"text-green-400":"text-orange-400"}`}>
              {c.t===18?"18 e⁻ → Barqaror!":`${c.t} e⁻ → 18 e⁻ emas`}
            </div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
          <p className="text-purple-400 font-bold">Tahlil:</p>
          <p className="text-purple-200 mt-1">{c.note}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-2">
            <p className="text-purple-400 font-bold">MO konfiguratsiyasi (D₅d):</p>
            <p className="text-purple-200">(e₂g)⁴ (a₁g)² (e₁g)⁴ — asosiy sathlar</p>
            <p className="text-purple-200">Cp⁻ → 6 ta π-elektron donori. 2 × Cp⁻ = 12 e⁻.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. EAN — EFFECTIVE ATOMIC NUMBER
// ═══════════════════════════════════════════════════════════════════════════════
function EANHisoblash() {
  const [comp, setComp] = useState(0)
  const data = [
    {n:"[Ni(CO)₄]", z:28, ox:0, le:8, ean:36, gn:"Kr", st:true, d:"3d¹⁰"},
    {n:"[Fe(CO)₅]", z:26, ox:0, le:10, ean:36, gn:"Kr", st:true, d:"3d⁸"},
    {n:"[Cr(CO)₆]", z:24, ox:0, le:12, ean:36, gn:"Kr", st:true, d:"3d⁶"},
    {n:"[Fe(CN)₆]⁴⁻", z:26, ox:2, le:12, ean:36, gn:"Kr", st:true, d:"3d⁶"},
    {n:"[Co(NH₃)₆]³⁺", z:27, ox:3, le:12, ean:36, gn:"Kr", st:true, d:"3d⁶"},
    {n:"[Ni(CN)₄]²⁻", z:28, ox:2, le:8, ean:34, gn:"Kr", st:true, d:"3d⁸"},
    {n:"[PtCl₄]²⁻", z:78, ox:2, le:8, ean:84, gn:"Xe", st:true, d:"5d⁸"},
    {n:"[W(CO)₆]", z:74, ox:0, le:12, ean:86, gn:"Rn", st:true, d:"5d⁶"},
  ]
  const c = data[comp]
  const ean = c.z - c.ox + c.le

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">🔢</span> EAN — Effective Atomic Number qoidasi
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {data.map((d,i) => (
          <button key={i} onClick={()=>setComp(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${comp===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>{d.n}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">{c.n} ({c.d})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2">
            <p className="text-cyan-300 font-mono text-center text-sm">EAN = Z − oksidlanish + ligand e⁻</p>
            <p className="text-yellow-300 font-mono text-center text-base font-bold mt-1">EAN = {c.z} − {c.ox} + {c.le} = {ean}</p>
          </div>
          <p className="text-purple-200 mt-1">EAN = {ean} → keyingi nobile gaz: <strong className="text-green-300">{c.gn} ({c.gn==="Kr"?36:c.gn==="Xe"?54:86})</strong></p>
          <p className="text-purple-200">{c.st ? "✅ 18 e⁻ qoidasiga mos keladi" : "⚠️ Istisno"}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">EAN qoidasi (Sidgwick, 1923):</p>
          <p className="text-purple-200">Barqaror komplekslarda metallning EAN si keyingi nobile gazning atom raqamiga teng bo'lishi kerak.</p>
          <p className="text-purple-200">EAN = Z_metal − oksidlanish darajasi + Σ(ligand e⁻ × soni)</p>
          <p className="text-purple-200">18 e⁻ qoidasi = EAN qoidasining elektron versiyasi.</p>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400">💡 EAN 36 (Kr) yoki 54 (Xe) yoki 86 (Rn) ga teng bo'lishi kerak</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. LIGAND ELEKTRON HISSASI JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function LigandHissasi() {
  const [sel, setSel] = useState(null)
  const rows = [
    {n:"H⁻", z:-1, e:2, t:"σ-donor", m:"[HFe(CO)₄]⁻, [WH₆]²⁻", izoh:"Gidrid ioni. 2 e⁻ donori."},
    {n:"CH₃⁻", z:-1, e:2, t:"σ-donor", m:"[Pt(CH₃)₃Cl]₄", izoh:"Metil anion. 2 e⁻."},
    {n:"Cl⁻", z:-1, e:2, t:"σ+π-donor", m:"[PtCl₄]²⁻, [CoCl₄]²⁻", izoh:"Xlorid. 2 e⁻ (σ) + π-donor."},
    {n:"CN⁻", z:-1, e:2, t:"σ+π-akseptor", m:"[Fe(CN)₆]⁴⁻, [Ni(CN)₄]²⁻", izoh:"Sianid. 2 e⁻, π-akseptor."},
    {n:"CO", z:0, e:2, t:"σ+π-akseptor", m:"[Ni(CO)₄], [Fe(CO)₅]", izoh:"Eng muhim. 2 e⁻."},
    {n:"NH₃", z:0, e:2, t:"σ-donor", m:"[Co(NH₃)₆]³⁺", izoh:"Ammiak. Faqat σ."},
    {n:"PR₃", z:0, e:2, t:"σ+π-akseptor", m:"[Pd(PPh₃)₄]", izoh:"Fosfin. σ+π. TEP bilan o'lchanadi."},
    {n:"NO⁺", z:1, e:2, t:"σ+π-akseptor", m:"[Fe(CN)₅NO]²⁻", izoh:"Nitrozil. 2 e⁻."},
    {n:"NO (chiziqli)", z:0, e:3, t:"σ+π", m:"[Mn(CO)₂(NO)PPh₃]", izoh:"Chiziqli NO → 3 e⁻ donori."},
    {n:"NO (burchakli)", z:0, e:1, t:"σ-donor", m:"[Co(en)₂(NO)Cl]⁺", izoh:"Burchakli NO → 1 e⁻."},
    {n:"O²⁻", z:-2, e:4, t:"σ+π-donor", m:"[VO(acac)₂], [MnO₄]⁻", izoh:"Oksid ioni. 4 e⁻ donori."},
    {n:"OH⁻", z:-1, e:2, t:"σ+π-donor", m:"[Zn(OH)₄]²⁻", izoh:"Gidroksid. 2 e⁻."},
    {n:"C₅H₅⁻", z:-1, e:6, t:"π-donor", m:"Ferrosen, nikkelosen", izoh:"Siklopentadienil. 6 π-e⁻."},
    {n:"C₆H₆", z:0, e:6, t:"π-donor", m:"[Cr(C₆H₆)₂]", izoh:"Benzol. 6 π-e⁻."},
    {n:"CO (ko'prik)", z:0, e:1, t:"σ-donor", m:"[Fe₂(CO)₉]", izoh:"Ko'prik CO → 1 e⁻ donori."},
    {n:"en", z:0, e:4, t:"σ-donor", m:"[Co(en)₃]³⁺", izoh:"Etilendiamin. 2×N → 4 e⁻."},
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">📋</span> Ligandlarning elektron hissasi — 18 e⁻ hisoblash uchun
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">Ligand</th>
            <th className="p-1 text-center text-purple-200">Zaryad</th>
            <th className="p-1 text-center text-purple-200">e⁻</th>
            <th className="p-1 text-left text-purple-200">Tur</th>
            <th className="p-1 text-left text-purple-200 hidden md:table-cell">Misol</th>
            <th className="p-1 text-left text-purple-200 hidden md:table-cell">Izoh</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40":"hover:bg-purple-800/30"}`}>
                <td className={`p-1 font-mono font-bold ${sel===i?"text-pink-300":"text-yellow-300"}`}>{r.n}</td>
                <td className="p-1 text-center text-purple-300">{r.z}</td>
                <td className="p-1 text-center text-green-300 font-mono font-bold">{r.e}</td>
                <td className="p-1 text-purple-200" style={{color:r.t.includes("akseptor")?"#22c55e":r.t.includes("donor")?"#3b82f6":"#a855f7"}}>{r.t}</td>
                <td className="p-1 text-purple-300 font-mono text-[7px] hidden md:table-cell">{r.m}</td>
                <td className="p-1 text-purple-300 text-[7px] hidden md:table-cell">{r.izoh}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-2 text-[10px] mt-2">
          <p className="text-yellow-400 font-bold">{rows[sel].n} — {rows[sel].e} e⁻</p>
          <p className="text-purple-200">{rows[sel].izoh}</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. AMALIY MISOLLAR — 18 E⁻ HISOBLASH
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const m = [
    {n:"[Ni(CO)₄]", m:"Ni(0)", d:"3d¹⁰", me:10, l:"4CO", le:8, t:18, g:"T_d", r:"Rangsiz", ean:36, note:"18 e⁻. Ni(0) d¹⁰. 4 ta CO. Uchuvchan suyuqlik. Juda zaharli."},
    {n:"[Fe(CO)₅]", m:"Fe(0)", d:"3d⁸", me:8, l:"5CO", le:10, t:18, g:"D₃h", r:"Sariq", ean:36, note:"18 e⁻. Fe(0) d⁸. 5 ta CO. Trigonal bipiramida."},
    {n:"Ferrosen", m:"Fe²⁺", d:"3d⁶", me:6, l:"2Cp⁻", le:12, t:18, g:"D₅d", r:"To'q sariq", ean:36, note:"18 e⁻. Sandvich. Havoda barqaror. 1951."},
    {n:"[Cr(CO)₆]", m:"Cr(0)", d:"3d⁶", me:6, l:"6CO", le:12, t:18, g:"O_h", r:"Oq", ean:36, note:"18 e⁻. Cr(0) d⁶. Oktaedrik. Diamagnit."},
    {n:"[V(CO)₆]", m:"V(0)", d:"3d⁵", me:5, l:"6CO", le:12, t:17, g:"O_h", r:"Yashil", ean:35, note:"17 e⁻. Toq elektron → paramagnit. Dimerlanadi."},
    {n:"[Co(NH₃)₆]³⁺", m:"Co³⁺", d:"3d⁶", me:6, l:"6NH₃", le:12, t:18, g:"O_h", r:"Sariq", ean:36, note:"18 e⁻. d⁶ LS. NH₃ σ-donor. Diamagnit."},
    {n:"[PtCl₄]²⁻", m:"Pt²⁺", d:"5d⁸", me:8, l:"4Cl⁻", le:8, t:16, g:"D₄h", r:"Sariq", ean:84, note:"16 e⁻. d⁸ kv. planar. Anti-kanser."},
    {n:"[W(CO)₆]", m:"W(0)", d:"5d⁶", me:6, l:"6CO", le:12, t:18, g:"O_h", r:"Oq", ean:86, note:"18 e⁻. 5d. Eng og'ir karbonil."},
  ]
  const c = m[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🧪</span> Amaliy misollar — 18 e⁻ hisoblash
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {m.map((x,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{x.n}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{c.n} ({c.g})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Metall:</span><span className="text-cyan-300 font-mono">{c.m} ({c.d})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ligand:</span><span className="text-green-300 font-mono">{c.l}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Hisob:</span><span className="text-amber-300 font-mono">{c.me} + {c.le} = {c.t} e⁻</span></div>
            <div className="flex justify-between"><span className="text-purple-400">EAN:</span><span className="text-cyan-300 font-mono">{c.ean}</span></div>
            <div className={`text-center mt-1 font-bold text-lg ${c.t===18?"text-green-400":"text-orange-400"}`}>
              {c.t === 18 ? "✅ 18 e⁻" : `⚠️ ${c.t} e⁻`}
            </div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
          <p className="text-purple-400 font-bold">{c.t === 18 ? "Barqaror kompleks" : "Istisno kompleks"}:</p>
          <p className="text-purple-200 mt-1">{c.note}</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. ν(CO) VA 18 E⁻ BOG'LIQLIGI
// ═══════════════════════════════════════════════════════════════════════════════
function NuCOCanvas() {
  const canvasRef = useRef(null)
  const [sel, setSel] = useState(0)
  const data = [
    {n:"Erkin CO", cm:2143, e:0, t:"—"},
    {n:"[Mn(CO)₆]⁺", cm:2090, e:16, t:"d⁶"},
    {n:"[Ni(CO)₄]", cm:2057, e:18, t:"d¹⁰"},
    {n:"[Fe(CO)₅]", cm:2020, e:18, t:"d⁸"},
    {n:"[V(CO)₆]⁻", cm:1860, e:18, t:"d⁶"},
    {n:"[Co(CO)₄]⁻", cm:1890, e:18, t:"d¹⁰"},
    {n:"[Fe₂(CO)₉]", cm:1800, e:34, t:"d⁸+d⁸"},
  ]

  useEffect(() => {
    const cnv = canvasRef.current; if (!cnv) return
    const ctx = cnv.getContext("2d"); if (!ctx) return
    const w = cnv.width, h = cnv.height, cx = w/2, cy = h/2
    ctx.clearRect(0,0,w,h)
    const grd = ctx.createRadialGradient(cx,cy,10,cx,cy,120)
    grd.addColorStop(0,"#1a0a2e"); grd.addColorStop(1,"#0a0018")
    ctx.fillStyle=grd; ctx.fillRect(0,0,w,h)
    ctx.fillStyle="#a78bfa"; ctx.font="bold 10px sans-serif"; ctx.textAlign="center"
    ctx.fillText("ν(CO) — Elektron soni bilan bog'liqlik", cx, 16)

    const minC=1750, maxC=2200
    const barX=35, barW=w-70, barY=cy+10
    const specGrd=ctx.createLinearGradient(barX,0,barX+barW,0)
    specGrd.addColorStop(0,"#ef444420"); specGrd.addColorStop(0.4,"#f59e0b20")
    specGrd.addColorStop(0.6,"#22c55e20"); specGrd.addColorStop(1,"#3b82f620")
    ctx.fillStyle=specGrd; ctx.fillRect(barX,barY,barW,15)
    ctx.strokeStyle="rgba(139,92,246,0.3)"; ctx.lineWidth=1; ctx.strokeRect(barX,barY,barW,15)

    ctx.fillStyle="rgba(139,92,246,0.4)"; ctx.font="6px sans-serif"
    for(let cm=1800; cm<=2200; cm+=50){
      const x=barX+((cm-minC)/(maxC-minC))*barW
      ctx.strokeStyle="rgba(139,92,246,0.15)"; ctx.beginPath(); ctx.moveTo(x,barY-3); ctx.lineTo(x,barY+18); ctx.stroke()
      ctx.fillText(cm, x, barY+27)
    }

    data.forEach((item,i)=>{
      const x=barX+((item.cm-minC)/(maxC-minC))*barW
      ctx.fillStyle=i===sel?item.cm>2050?"#ef4444":item.cm>1950?"#f59e0b":"#22c55e":"#a78bfa40"
      ctx.beginPath(); ctx.arc(x,barY+7,i===sel?6:3,0,Math.PI*2); ctx.fill()
      if(i===sel){
        ctx.fillStyle="#fff"; ctx.lineWidth=1; ctx.stroke()
        ctx.setLineDash([3,3]); ctx.strokeStyle="#ffffff80"; ctx.lineWidth=1
        ctx.beginPath(); ctx.moveTo(x,barY-5); ctx.lineTo(x,barY-30); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle="#a78bfa"; ctx.font="bold 9px sans-serif"
        ctx.fillText(`${item.n}: ${item.cm} cm⁻¹ (${item.e} e⁻)`, cx, barY-35)
      }
    })
    ctx.fillStyle="#a78bfa80"; ctx.font="7px sans-serif"
    ctx.fillText("↓ ν(CO) → kuchli π-orqaga donorlik", cx, h-10)
  }, [sel])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📡</span> ν(CO) va 18 e⁻ bog'liqligi
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {data.map((d,i)=>(
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>{d.n}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={360} height={160} className="w-full h-40 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-bold">{data[sel].n}</p>
          <p className="text-purple-200"><strong className="text-cyan-300">ν(CO):</strong> {data[sel].cm} cm⁻¹</p>
          <p className="text-purple-200"><strong className="text-green-300">Elektronlar:</strong> {data[sel].e} e⁻</p>
          <p className="text-purple-200"><strong className="text-amber-300">Δν:</strong> {2143 - data[sel].cm} cm⁻¹ (erkin CO dan)</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-purple-400">ν(CO) qancha past bo'lsa, π-orqaga donorlik shuncha kuchli. 18 e⁻ komplekslar odatda kuchli π-orqaga donorlikka ega.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function Test() {
  const questions = [
    {q:"[Ni(CO)₄] nechta valent elektronga ega?", a:"18 e⁻", opts:["16 e⁻","18 e⁻","20 e⁻","15 e⁻"], hint:"Ni(0)=3d¹⁰ → 10 + 4×2 = 18."},
    {q:"[PtCl₄]²⁻ nechta elektron? Nega barqaror?", a:"16 e⁻ — d⁸ kvadrat planar", opts:["18 e⁻ — d⁶ oktaedrik","16 e⁻ — d⁸ kvadrat planar","20 e⁻ — d¹⁰","14 e⁻ — d¹⁰"], hint:"Pt²⁺=5d⁸ → 8 + 4×1 = 16."},
    {q:"EAN qoidasiga ko'ra, [Fe(CO)₅] ning EAN qiymati?", a:"36 (Kr)", opts:["36 (Kr)","54 (Xe)","18","86 (Rn)"], hint:"Fe(0)=26 − 0 + 10 = 36."},
    {q:"Ferrosen Fe(C₅H₅)₂ nechta elektron?", a:"18 e⁻", opts:["20 e⁻","18 e⁻","16 e⁻","15 e⁻"], hint:"Fe²⁺=3d⁶ → 6 + 2×6 = 18."},
    {q:"Nikkelosen [Ni(C₅H₅)₂] nechta elektron? Nega 18 e⁻ qoidasiga bo'ysunmaydi?", a:"20 e⁻ — Cp⁻ π* orbitallari ortiqcha elektronlarni qabul qiladi", opts:["18 e⁻ — normal","20 e⁻ — Cp⁻ π* orbitallari ortiqcha elektronlarni qabul qiladi","16 e⁻ — d⁸","15 e⁻"], hint:"Ni²⁺=3d⁸ → 8 + 12 = 20. Cp⁻ π* LUMO."},
    {q:"17 e⁻ komplekslar qanday xususiyatga ega?", a:"Paramagnit — toq elektron", opts:["Diamagnit","Paramagnit — toq elektron","Rangsiz","IQ faol"], hint:"Toq sonli elektron → paramagnit."},
    {q:"[V(CO)₆] nechta elektron? Nima uchun dimerlanadi?", a:"17 e⁻ — 18 e⁻ ga intilib, dimerlanadi", opts:["18 e⁻ — barqaror","17 e⁻ — 18 e⁻ ga intilib, dimerlanadi","16 e⁻ — d⁸","15 e⁻"], hint:"V(0)=3d⁵ → 5 + 12 = 17."},
    {q:"Tolman TEP qanday o'lchanadi?", a:"[Ni(CO)₃(PR₃)] da ν(CO) chastotasi", opts:["PR₃ ning bog' uzunligi","[Ni(CO)₃(PR₃)] da ν(CO) chastotasi","P atomining radiusi","ν(M−P) chastotasi"], hint:"TEP = ν(CO). Kichik ν → kuchli σ-donor."},
    {q:"Wilkinson katalizatori [RhCl(PPh₃)₃] nechta elektronga ega?", a:"16 e⁻ (d⁸)", opts:["18 e⁻ (d⁶)","16 e⁻ (d⁸)","20 e⁻ (d¹⁰)","15 e⁻"], hint:"Rh⁺=4d⁸ → 8 + 3×2 + 1 = 15? Haqiqatda 16 e⁻."},
    {q:"Ligandlardan qaysi biri 6 ta elektron beradi?", a:"C₅H₅⁻ (siklopentadienil)", opts:["CO (2 e⁻)","NH₃ (2 e⁻)","C₅H₅⁻ (siklopentadienil)","Cl⁻ (2 e⁻)"], hint:"Cp⁻ → 6 π-elektron donori."},
  ]
  const [c,setC]=useState(0);const [s,setS]=useState(null);const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false);const [ans,setAns]=useState({})
  const q=questions[c]
  if(res){return(
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc>=8?"🏆":sc>=5?"👍":"📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc>=8?"18 e⁻ qoidasini mukammal o'zlashtirdingiz!":sc>=5?"Yaxshi, ammo takrorlash kerak.":"Qayta o'qib chiqing."}</p>
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
            <div className={`text-xs p-3 rounded-lg ${s===q.a?"bg-green-600/10 border-green-500 text-green-300":"bg-red-600/10 border-red-500 text-red-300"}`}>{s===q.a?"✅ To'g'ri!":"❌ Noto'g'ri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={()=>{if(c<questions.length-1){setC(p=>p+1);setS(null)}else setRes(true)}} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c<questions.length-1?"Keyingi →":"Natijalarni ko'rish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function ElektronQoidasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-red-400">18 e⁻ qoidasi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-red-400 flex items-center gap-2"><span>🧪</span> 18 elektron qoidasi</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Metall karbonillari • Metallosenlar • EAN qoidasi • 16/17/20 e⁻ istisnolar • ν(CO) diagnostikasi • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 18 elektron qoidasi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">18 elektron qoidasi</strong> — barqaror komplekslarda markaziy metall 
                valent qavatida <strong className="text-cyan-300">18 ta elektron</strong> bo'lishi kerak (nₓd¹⁰(n+1)s²(n+1)p⁶ 
                — nobile gaz konfiguratsiyasi). Bu qoida <strong>metall karbonillari, metallosenlar</strong> va 
                <strong>organometall birikmalar</strong> uchun ishlaydi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">EAN qoidasi</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">16/20 e⁻ istisno</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Metallosenlar</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-red-400 font-bold">🎯 Maqsad:</span> 18 e⁻ qoidasi, EAN, metall karbonillari, metallosenlar va istisnolarni o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">⏱ Vaqt:</span> ~2.5 soat</p>
              <p className="text-purple-300"><span className="text-red-400 font-bold">📚 Manba:</span> N.V. Sidgwick — EAN qoidasi (1923); Cotton — Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-red-300 font-mono text-xs font-bold">"\u03A3(metall e⁻) + \u03A3(ligand e⁻) = 18 → barqaror!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <ElektronKalkulyator />
        <MetallKarbonillari />
        <Istisnolar />
        <Metallosenlar />
        <EANHisoblash />
        <LigandHissasi />
        <NuCOCanvas />
        <AmaliyMisollar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">18 e⁻ qoidasi:</strong> Barqaror komplekslar 18 valent elektronga intiladi (nₓd¹⁰(n+1)s²(n+1)p⁶)</li>
            <li><strong className="text-yellow-400">EAN = Z − ox + Σ(ligand e⁻)</strong>. EAN 36 (Kr), 54 (Xe) yoki 86 (Rn) ga teng bo'lishi kerak</li>
            <li><strong className="text-yellow-400">Metall karbonillari:</strong> [Ni(CO)₄] (18), [Fe(CO)₅] (18), [Cr(CO)₆] (18), [V(CO)₆] (17)</li>
            <li><strong className="text-yellow-400">16 e⁻ istisno:</strong> d⁸ metallar kvadrat planar geometriyada 16 e⁻ bilan barqaror (Pt²⁺, Pd²⁺)</li>
            <li><strong className="text-yellow-400">20 e⁻ istisno:</strong> Nikkelosen [Ni(C₅H₅)₂] — Cp⁻ π* orbitallari ortiqcha elektronlarni qabul qiladi</li>
            <li><strong className="text-yellow-400">17 e⁻ radikallar:</strong> [V(CO)₆] — toq elektron, paramagnit. Dimerlanadi (2 × 17 → 18 e⁻ har biriga)</li>
            <li><strong className="text-yellow-400">ν(CO) diagnostikasi:</strong> ν(CO) qancha past bo'lsa, π-orqaga donorlik shuncha kuchli → 18 e⁻ barqaror</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> MO diagramma
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-red-500/20">
            Kimyoviy bog'lanish <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> N.V. Sidgwick — EAN qoidasi (1923); J.E. Huheey — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}