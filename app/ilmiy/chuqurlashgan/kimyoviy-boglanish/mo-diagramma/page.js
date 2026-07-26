"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. MO ENERGIYA DIAGRAMMASI — CANVAS (INTERAKTIV)
// ═══════════════════════════════════════════════════════════════════════════════
function MOEnergiyaDiagrammasi() {
  const canvasRef = useRef(null)
  const [showPi, setShowPi] = useState(false)
  const [dCount, setDCount] = useState(6)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)

    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 150)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("Oktaedrik [ML₆] — σ MO diagrammasi" + (showPi ? " + π" : ""), cx, 16)

    // Energy axis
    ctx.strokeStyle = "rgba(139,92,246,0.2)"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx+120, cy-80); ctx.lineTo(cx+120, cy+80); ctx.stroke()
    ctx.fillStyle = "rgba(139,92,246,0.3)"; ctx.font = "7px sans-serif"; ctx.textAlign = "right"
    ctx.fillText("Energiya ↑", cx+118, cy-75)

    // Left: Metal AO levels
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("Metall AO", 10, 30)

    const metalX = 25
    const mLevels = [
      {y:cy-50, c:"#22c55e", w:45, l:"3d"},
      {y:cy-15, c:"#ef4444", w:45, l:"3d (bo'sh)"},
      {y:cy+18, c:"#3b82f6", w:45, l:"4s"},
      {y:cy+50, c:"#a855f7", w:45, l:"4p"},
    ]
    const metalW = 45
    mLevels.forEach(l => {
      ctx.strokeStyle = l.c; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(metalX, l.y); ctx.lineTo(metalX+l.w, l.y); ctx.stroke()
      ctx.fillStyle = l.c; ctx.font = "6px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(l.l, metalX+l.w+3, l.y+2)
    })
    // d-split bracket
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1; ctx.setLineDash([2,2])
    ctx.beginPath(); ctx.moveTo(metalX+metalW+2, cy-50); ctx.lineTo(metalX+metalW+2, cy-15); ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = "#fbbf24"; ctx.font = "5px sans-serif"
    ctx.fillText("Δ₀", metalX+metalW+5, cy-35)

    // Right: Ligand MO (6×σ)
    const ligX = 195
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 7px sans-serif"
    ctx.fillText("Ligand MO", ligX, 30)

    // Ligand group level
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(ligX, cy-15); ctx.lineTo(ligX+45, cy-15); ctx.stroke()
    ctx.fillStyle = "#60a5fa"; ctx.font = "6px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("6×σ (a₁g+e_g+t₁u)", ligX+50, cy-12)

    // Center: MO levels
    const moX = cx-30
    const moW = 60

    // Bonding MOs
    const bondY = cy-75
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(moX, bondY); ctx.lineTo(moX+moW, bondY); ctx.stroke()
    ctx.fillStyle = "#22c55e"; ctx.font = "6px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("a₁g + e_g + t₁u (bog'lovchi)", moX+moW+3, bondY+2)

    // Nonbonding t₂g
    const nbY = cy-42
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(moX+10, nbY); ctx.lineTo(moX+moW-10, nbY); ctx.stroke()
    ctx.fillStyle = "#a855f7"; ctx.font = "6px sans-serif"
    ctx.fillText("t₂g (bog'lamaydigan)", moX+moW+3, nbY+2)

    // Antibonding e_g*
    const abY1 = cy-5
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(moX+15, abY1); ctx.lineTo(moX+moW-15, abY1); ctx.stroke()
    ctx.fillStyle = "#ef4444"; ctx.font = "6px sans-serif"
    ctx.fillText("e_g* (bo'shashtiruvchi)", moX+moW+3, abY1+2)

    // Higher antibonding
    const abY2 = cy+25
    ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(moX, abY2); ctx.lineTo(moX+moW, abY2); ctx.stroke()
    ctx.fillStyle = "#ef4444"; ctx.font = "6px sans-serif"
    ctx.fillText("a₁g* + t₁u* (bo'sh)", moX+moW+3, abY2+2)

    // π* level (if show π)
    if (showPi) {
      const piY = cy-65
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(moX+5, piY); ctx.lineTo(moX+moW-5, piY); ctx.stroke()
      ctx.fillStyle = "#f59e0b"; ctx.font = "6px sans-serif"
      ctx.fillText("π* (t₂g bilan)", moX+moW+3, piY+2)
      // Lowered t₂g due to π
      const nbYPi = cy-55
      ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(moX+10, nbYPi); ctx.lineTo(moX+moW-10, nbYPi); ctx.stroke()
      ctx.fillStyle = "#22c55e"; ctx.font = "6px sans-serif"
      ctx.fillText("t₂g↓ (π-akseptor)", moX+moW+3, nbYPi+2)
      // Larger Δ₀
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.setLineDash([2,2])
      ctx.beginPath(); ctx.moveTo(moX+moW+30, nbYPi); ctx.lineTo(moX+moW+30, abY1); ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 7px sans-serif"
      ctx.fillText("Δ₀ (katta)", moX+moW+33, nbYPi+18)
    }

    // Connections: metal → MO
    ctx.strokeStyle = "rgba(168,85,247,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([2,3])
    ctx.beginPath(); ctx.moveTo(70, cy-50); ctx.lineTo(moX, bondY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(70, cy-50); ctx.lineTo(moX+10, nbY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(70, cy-15); ctx.lineTo(moX+15, abY1); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(70, cy+18); ctx.lineTo(moX, abY2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(70, cy+50); ctx.lineTo(moX, abY2); ctx.stroke()
    ctx.setLineDash([])

    // Ligand → MO
    ctx.strokeStyle = "rgba(139,92,246,0.1)"; ctx.lineWidth = 1; ctx.setLineDash([2,3])
    ctx.beginPath(); ctx.moveTo(195, cy-15); ctx.lineTo(moX, bondY); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(195, cy-15); ctx.lineTo(moX, abY2); ctx.stroke()
    ctx.setLineDash([])

    // Electron count info
    ctx.fillStyle = "#a78bfa80"; ctx.font = "7px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("Metall: " + dCount + " e⁻ | Ligand: 12 e⁻ | Jami: " + (dCount+12) + " e⁻ | " + ((dCount+12)===18 ? "✅ 18 e⁻" : "⚠️ " + (dCount+12) + " e⁻"), cx, h-10)

  }, [showPi, dCount])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📈</span> MO energiya diagrammasi — interaktiv Canvas
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setShowPi(false)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${!showPi?"bg-orange-600/60 text-white border border-orange-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          Faqat σ-bog'
        </button>
        <button onClick={()=>setShowPi(true)}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${showPi?"bg-orange-600/60 text-white border border-orange-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          σ + π-bog' (π-akseptor)
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <canvas ref={canvasRef} width={360} height={220} className="w-full h-60 bg-purple-950/60 rounded-xl border border-purple-700/40" />
          {/* d-electron slider */}
          <div className="flex items-center gap-2 mt-2 px-1">
            <span className="text-purple-400 text-[10px]">d-e⁻ soni:</span>
            <input type="range" min="0" max="10" step="1" value={dCount} onChange={e=>setDCount(parseInt(e.target.value))}
              className="flex-1 accent-orange-500 h-1" />
            <span className="text-cyan-300 font-mono text-[10px] w-4 text-right">{dCount}</span>
          </div>
        </div>
        <div className="space-y-2 text-xs">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-yellow-400 font-bold">MO diagrammasi tahlili:</p>
            <p className="text-purple-200">• <strong className="text-green-300">Bog'lovchi MO</strong>: a₁g + e_g + t₁u (6 ta MO, 12 ta e⁻)</p>
            <p className="text-purple-200">• <strong className="text-purple-300">Bog'lamaydigan MO</strong>: t₂g (3 ta MO, {dCount} ta e⁻)</p>
            <p className="text-purple-200">• <strong className="text-red-300">Bo'shashtiruvchi MO</strong>: e_g* + a₁g* + t₁u* (6 ta MO, bo'sh)</p>
            <p className="text-purple-200">• <strong className="text-yellow-300">Δ₀</strong> = E(e_g*) − E(t₂g) = {showPi ? "katta (π-akseptor)" : "normal"}</p>
          </div>
          <div className={`rounded-lg p-2 ${(dCount+12)===18?"bg-green-600/10 border border-green-500/30":"bg-yellow-600/10 border border-yellow-500/30"}`}>
            <p className="text-purple-200">Jami: {dCount+12} e⁻ | {(dCount+12)===18?"✅ 18 e⁻ → barqaror!":"⚠️ 18 e⁻ emas"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIMMETRIYA BO'YICHA MO TAHLLIL
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaMOTahlili() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"O_h", icon:"💎",
      rows:[
        {ir:"A₁g", metal:"s", ligand:"σ₁ = (1/√6)(L₁+L₂+L₃+L₄+L₅+L₆)", mo:"σ(A₁g) + σ*(A₁g)", en:"Eng past / Yuqori"},
        {ir:"E_g", metal:"d_z², d_x²−y²", ligand:"σ₂ = (1/2)(L₁−L₂), σ₃ = (1/2)(L₃−L₄)", mo:"σ(E_g) + σ*(E_g*)", en:"O'rtacha / Yuqori"},
        {ir:"T₁u", metal:"p_x, p_y, p_z", ligand:"σ₄ = (1/√2)(L₅−L₆) va b.", mo:"σ(T₁u) + σ*(T₁u)", en:"Past / Yuqori"},
        {ir:"T₂g", metal:"d_xy, d_xz, d_yz", ligand:"— (mos emas)", mo:"Faqat n (bog'lamaydigan)", en:"Oraliq"},
      ],
      note:"4 xil simmetriya. t₂g — faqat metall d-orbitallari. Δ₀ = 10 Dq."},
    td: {name:"T_d", icon:"🔺",
      rows:[
        {ir:"A₁", metal:"s", ligand:"σ₁ = (1/2)(L₁+L₂+L₃+L₄)", mo:"σ(A₁) + σ*(A₁)", en:"Past / Yuqori"},
        {ir:"T₂", metal:"p_x,p_y,p_z", ligand:"3 ta SALC", mo:"σ(T₂) + σ*(T₂)", en:"Past / Yuqori"},
        {ir:"E", metal:"d_z², d_x²−y²", ligand:"— (mos emas)", mo:"Faqat n (bog'lamaydigan)", en:"Oraliq"},
        {ir:"T₂", metal:"d_xy,d_xz,d_yz", ligand:"π-orbitallar", mo:"π(T₂) + π*(T₂)", en:"O'rtacha"},
      ],
      note:"T_d da d-ajralish teskari: E (past) + T₂ (yuqori)."},
    d4h: {name:"D₄h", icon:"⬛",
      rows:[
        {ir:"A₁g", metal:"s, d_z²", ligand:"σ₁+σ₂+σ₃+σ₄", mo:"σ(A₁g) + σ*(A₁g)", en:"Eng past"},
        {ir:"B₁g", metal:"d_x²−y²", ligand:"σ₁−σ₂+σ₃−σ₄", mo:"σ(B₁g) + σ*(B₁g)", en:"Past / Yuqori"},
        {ir:"E_u", metal:"p_x, p_y", ligand:"2 ta SALC", mo:"σ(E_u) + σ*(E_u)", en:"O'rtacha"},
        {ir:"B₂g", metal:"d_xy", ligand:"—", mo:"n (bog'lamaydigan)", en:"Oraliq"},
        {ir:"E_g", metal:"d_xz, d_yz", ligand:"—", mo:"n (bog'lamaydigan)", en:"Oraliq"},
      ],
      note:"D₄h da d⁸ — eng pastda b₂g (d_xy). LUMO = b₁g* (d_x²−y²)."},
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">🔬</span> Simmetriya bo'yicha MO tahlili
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(data).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.icon} {v.name}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">IRREPS</th>
            <th className="p-1 text-left text-purple-300">Metall AO</th>
            <th className="p-1 text-left text-purple-300">Ligand SALC</th>
            <th className="p-1 text-left text-purple-300">MO</th>
            <th className="p-1 text-center text-purple-300">Energiya</th>
          </tr></thead>
          <tbody>
            {d.rows.map((r,i) => (
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1 font-mono font-bold text-cyan-300">{r.ir}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px]">{r.metal}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[8px] font-mono">{r.ligand}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px]">{r.mo}</td>
                <td className="p-1 text-center text-purple-300">{r.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">💡 </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. MO ENERGIYA DARAJALARI — VIZUAL KARTOCCHKA
// ═══════════════════════════════════════════════════════════════════════════════
function MOEnergetikSathlar() {
  const [selected, setSelected] = useState("bonding")
  const levels = {
    bonding: {name:"Bog'lovchi MO", icon:"🔽", color:"#22c55e", count:"6 ta", ecount:"12 ta e⁻ (ligandlardan)",
      sym:"a₁g + e_g + t₁u",
      desc:"Metalldan energiyasi past. Ligandlarning σ-elektronlari shu yerga joylashadi. 6 ta σ-bog' hosil qiladi.",
      detail:[
        "a₁g: s + (L₁+L₂+L₃+L₄+L₅+L₆) — to'liq simmetrik",
        "e_g: d_z²,d_x²−y² + ligand — 2 ta degenerat MO",
        "t₁u: p_x,p_y,p_z + ligand — 3 ta degenerat MO"
      ]},
    nonbonding: {name:"Bog'lamaydigan MO", icon:"➡️", color:"#a855f7", count:"3 ta", ecount:"d-elektronlar",
      sym:"t₂g (d_xy, d_xz, d_yz)",
      desc:"Metall d-orbitallaridan faqat t₂g (d_xy, d_xz, d_yz) ligand σ-orbitallari bilan mos kelmaydi. Shu sababli ular bog'lanmaydi.",
      detail:[
        "Faqat metall d-elektronlarini saqlaydi",
        "Energiyasi o'zgarmaydi (bog'lovchi MO bilan bir xil)",
        "π-bog'lanishda qatnashadi (π-akseptor/donor)"
      ]},
    antibond: {name:"Bo'shashtiruvchi MO", icon:"🔼", color:"#ef4444", count:"6 ta", ecount:"Odatda bo'sh",
      sym:"e_g* + a₁g* + t₁u*",
      desc:"Metalldan energiyasi yuqori. Elektronlar bu yerga joylashsa, M−L bog'i kuchsizlanadi.",
      detail:[
        "e_g* (d_z²*, d_x²−y²*) — LUMO, d-d o'tish uchun qabul qiluvchi",
        "a₁g* — s-orbitalning antibog'lovchisi",
        "t₁u* — p-orbitallarning antibog'lovchisi"
      ]},
    pi: {name:"π-MO (qo'shimcha)", icon:"🔄", color:"#f59e0b", count:"6+6 ta", ecount:"Ligandga bog'liq",
      sym:"T₂g (π) + T₁g + T₂u + T₁u",
      desc:"Ligand π-orbitallari bo'lsa, qo'shimcha π-MO lar hosil bo'ladi. Bu Δ₀ ni o'zgartiradi.",
      detail:[
        "π-akseptor (CO, CN⁻): t₂g + π* → t₂g↓ → Δ₀↑",
        "π-donor (Cl⁻, F⁻): t₂g + π → t₂g↑ → Δ₀↓",
        "T₁g va T₂u — faqat ligand π-orbitallari"
      ]},
  }
  const d = levels[selected]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📊</span> MO energiya sathlari — interaktiv tahlil
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(levels).map(([k,v]) => (
          <button key={k} onClick={()=>setSelected(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selected===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={selected===k ? {background:v.color+"44", borderColor:v.color+"88"} : {}}>
            {v.icon} {v.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1"
          style={{borderLeft:`3px solid ${d.color}`}}>
          <p className="font-bold text-sm" style={{color:d.color}}>{d.icon} {d.name}</p>
          <p className="text-purple-200">{d.desc}</p>
          <div className="flex gap-2 mt-1">
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 text-center flex-1">
              <p className="text-purple-400 text-[9px]">MO soni</p>
              <p className="text-yellow-300 font-bold">{d.count}</p>
            </div>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 text-center flex-1">
              <p className="text-purple-400 text-[9px]">Elektronlar</p>
              <p className="text-cyan-300 font-bold">{d.ecount}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Simmetriya ({d.sym}):</p>
          {d.detail.map((dt,i) => (
            <p key={i} className="text-purple-200">• {dt}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. π-BOG'LANISHNING MO DIAGRAMMASIGA TA'SIRI
// ═══════════════════════════════════════════════════════════════════════════════
function PiTasiri() {
  const [view, setView] = useState("acceptor")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText(view==="acceptor" ? "π-akseptor → Δ₀↑ (CO, CN⁻)" : "π-donor → Δ₀↓ (Cl⁻, F⁻)", cx, 16)

    // t₂g level (middle)
    const t2gY = cy + 5
    ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 2.5
    ctx.beginPath(); ctx.moveTo(cx-60, t2gY); ctx.lineTo(cx+60, t2gY); ctx.stroke()
    ctx.fillStyle = "#a855f7"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("t₂g", cx, t2gY-8)

    if (view === "acceptor") {
      // π* level above
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-40, cy-25); ctx.lineTo(cx+40, cy-25); ctx.stroke()
      ctx.fillStyle = "#f59e0b"; ctx.font = "7px sans-serif"
      ctx.fillText("π* (bo'sh)", cx, cy-30)

      // Lowered t₂g
      ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(cx-50, cy+30); ctx.lineTo(cx+50, cy+30); ctx.stroke()
      ctx.fillStyle = "#22c55e"; ctx.font = "bold 8px sans-serif"
      ctx.fillText("t₂g↓ (stabillashgan)", cx, cy+38)

      // Arrow down
      ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-80, t2gY); ctx.lineTo(cx-80, cy+30); ctx.stroke()
      ctx.fillStyle = "#22c55e"; ctx.font = "8px sans-serif"
      ctx.fillText("↓", cx-80, t2gY-5)

      // Bigger Δ₀
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx-90, cy+30); ctx.lineTo(cx-90, cy-25); ctx.stroke()
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 9px sans-serif"
      ctx.fillText("Δ₀↑", cx-92, cy+3)

      ctx.fillStyle = "#a78bfa80"; ctx.font = "7px sans-serif"
      ctx.fillText("M t₂g (to'lgan) → L π* (bo'sh): orqaga donorlik", cx, h-12)
    } else {
      // π level below
      ctx.strokeStyle = "#f97316"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-40, cy-25); ctx.lineTo(cx+40, cy-25); ctx.stroke()
      ctx.fillStyle = "#f97316"; ctx.font = "7px sans-serif"
      ctx.fillText("π (to'lgan)", cx, cy-30)

      // Raised t₂g
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(cx-50, cy+30); ctx.lineTo(cx+50, cy+30); ctx.stroke()
      ctx.fillStyle = "#ef4444"; ctx.font = "bold 8px sans-serif"
      ctx.fillText("t₂g↑ (destabillashgan)", cx, cy+38)

      // Arrow up
      ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-80, t2gY); ctx.lineTo(cx-80, cy+30); ctx.stroke()
      ctx.fillStyle = "#ef4444"; ctx.font = "8px sans-serif"
      ctx.fillText("↑", cx-80, t2gY-5)

      // Smaller Δ₀
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(cx-90, cy+30); ctx.lineTo(cx-90, cy-25); ctx.stroke()
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 9px sans-serif"
      ctx.fillText("Δ₀↓", cx-92, cy+3)

      ctx.fillStyle = "#a78bfa80"; ctx.font = "7px sans-serif"
      ctx.fillText("L π (to'lgan) → M t₂g (bo'sh): π-donorlik", cx, h-12)
    }
  }, [view])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">🔄</span> π-bog'lanishning MO diagrammasiga ta'siri
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("acceptor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="acceptor"?"bg-green-600/60 text-white border border-green-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🟢 π-akseptor (CO, CN⁻) → Δ₀↑
        </button>
        <button onClick={()=>setView("donor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="donor"?"bg-red-600/60 text-white border border-red-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔴 π-donor (Cl⁻, F⁻) → Δ₀↓
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={300} height={180} className="w-full h-48 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="space-y-2 text-xs">
          <div className={`rounded-lg p-3 border ${view==="acceptor"?"bg-green-600/10 border-green-500/30":"bg-red-600/10 border-red-500/30"}`}>
            <p className={`font-bold ${view==="acceptor"?"text-green-400":"text-red-400"}`}>
              {view==="acceptor" ? "π-akseptor mexanizmi" : "π-donor mexanizmi"}
            </p>
            <p className="text-purple-200 mt-1">
              {view==="acceptor"
                ? "Metall t₂g (to'lgan) → ligand π* (bo'sh). Orqaga donorlik t₂g ni stabillashadi → Δ₀ ortadi."
                : "Ligand π (to'lgan) → metall t₂g (bo'sh qisman). t₂g destabillashadi → Δ₀ kamayadi."}
            </p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
            <p className="text-purple-400 font-bold">Δ₀ ga ta'siri:</p>
            <p className="text-purple-200">{view==="acceptor"
              ? "Δ₀ = 25000-36000 cm⁻¹ → kuchli maydon → LS"
              : "Δ₀ = 7000-15000 cm⁻¹ → kuchsiz maydon → HS"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. MATEMATIK ASOSLAR — SEKULYAR TENGLAMA
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar() {
  const [topic, setTopic] = useState("secular")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📐</span> MO nazariyasining matematik asoslari
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {k:"secular", l:"Sekulyar tenglama"},
          {k:"salc", l:"SALC qurish"},
          {k:"huckel", l:"Xyukkel (HMO)"},
        ].map(v => (
          <button key={v.k} onClick={()=>setTopic(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${topic===v.k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.l}</button>
        ))}
      </div>
      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {topic === "secular" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Sekulyar tenglama — MO energiyasi:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">det|H − E·S| = 0</p>
            <p className="text-purple-200">Ikki atomli sistema (A va B):</p>
            <p className="text-purple-200">H{'{'}AA{'}'} = H{'{'}BB{'}'} = α (koulomb integrali, ~AO energiyasi)</p>
            <p className="text-purple-200">H{'{'}AB{'}'} = H{'{'}BA{'}'} = β (rezonans integrali, ~qoplanish)</p>
            <p className="text-purple-200">S{'{'}AA{'}'} = S{'{'}BB{'}'} = 1, S{'{'}AB{'}'} = 0 (ortogonal)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Yechim:</strong> E = α ± β</p>
            <p className="text-purple-200">E_bog' = α + β (past), E_bo'sh = α − β (yuqori)</p>
            <p className="text-purple-200">α = ∫ ψ_A·H·ψ_A dτ (manfiy, ~−10 eV)</p>
            <p className="text-purple-200">β = ∫ ψ_A·H·ψ_B dτ (manfiy, ~−1 to −3 eV)</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 |β| qancha katta → qoplanish shuncha kuchli → bog' mustahkam</p>
            </div>
          </div>
        )}
        {topic === "salc" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">SALC — Simmetriya moslashtirilgan chiziqli kombinatsiya:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">P^Γ = (d_Γ/h)·Σ χ_Γ(R)·R</p>
            <p className="text-purple-200">Oktaedrik (O_h) uchun 6 ta ligand σ-SALC:</p>
            <p className="text-purple-200"><strong className="text-green-300">A₁g:</strong> ψ₁ = (1/√6)(σ₁+σ₂+σ₃+σ₄+σ₅+σ₆)</p>
            <p className="text-purple-200"><strong className="text-cyan-300">E_g:</strong> ψ₂ = (1/2)(σ₁−σ₂), ψ₃ = (1/2)(σ₃−σ₄)</p>
            <p className="text-purple-200"><strong className="text-blue-300">T₁u:</strong> ψ₄ = (1/√2)(σ₅−σ₆), ψ₅ = (1/√2)(σ₁−σ₂) ...</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 SALC — ligand orbitallarining simmetriya moslashtirilgan kombinatsiyasi</p>
            </div>
          </div>
        )}
        {topic === "huckel" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Xyukkel MO (HMO) usuli:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">H{'{'}ij{'}'} = α (i=j), β (qo'shni), 0 (boshqa)</p>
            <p className="text-purple-200">Faqat π-elektronlar uchun. Soddalashtirilgan:</p>
            <p className="text-purple-200"><strong className="text-green-300">Etilen (C=C):</strong> E = α ± β</p>
            <p className="text-purple-200"><strong className="text-green-300">Benzol (C₆H₆):</strong> E = α + 2β, α + β (×2), α − β (×2), α − 2β</p>
            <p className="text-purple-200">π-elektron energiyasi: E_π(benzol) = 6α + 8β</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Komplekslarda qo'llanilishi:</strong></p>
            <p className="text-purple-200">HMO — ligand π* va π-orbitallarining energiyasini baholashda</p>
            <p className="text-purple-200">CO π*: E_π* = α − β_CO (CO da π* past → kuchli π-akseptor)</p>
            <p className="text-purple-200">Cl⁻ π: E_π = α + β_Cl (Cl⁻ da π to'lgan → π-donor)</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. AMALIY MISOLLAR — MO DIAGRAMMASI BO'YICHA
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    {name:"[Co(NH₃)₆]³⁺", g:"O_h", d:"3d⁶ LS", homo:"t₂g⁶", lumo:"e_g*", delta:"23000", spin:"S=0", rang:"Sarg'ish", note:"18 e⁻. Kuchli maydon (NH₃). d-d o'tish: ¹A₁g → ¹T₁g (sariq rang).", ecount:"12(σ) + 6(d) = 18"},
    {name:"[Fe(CN)₆]⁴⁻", g:"O_h", d:"3d⁶ LS", homo:"t₂g⁶", lumo:"e_g*", delta:"35000", spin:"S=0", rang:"Sariq", note:"18 e⁻. CN⁻ kuchli σ+π. LS. Δ₀ eng katta.", ecount:"12 + 6 = 18"},
    {name:"[Fe(H₂O)₆]²⁺", g:"O_h", d:"3d⁶ HS", homo:"t₂g⁴ e_g²", lumo:"e_g*", delta:"10400", spin:"S=2", rang:"Yashil", note:"18 e⁻. H₂O kuchsiz maydon. HS. μ≈4.9.", ecount:"12 + 6 = 18"},
    {name:"[CoCl₄]²⁻", g:"T_d", d:"3d⁷ HS", homo:"t₂³ e⁴", lumo:"t₂*", delta:"~3000", spin:"S=3/2", rang:"Ko'k", note:"15 e⁻. Cl⁻ π-donor. HS. T_d da inversiya yo'q.", ecount:"8(σ) + 7(d) = 15"},
    {name:"[Ni(CO)₄]", g:"T_d", d:"3d¹⁰", homo:"t₂⁶ e⁴", lumo:"t₂*", delta:"0", spin:"S=0", rang:"Rangsiz", note:"18 e⁻. Ni(0) d¹⁰. CO π-akseptor.", ecount:"8 + 10 = 18"},
    {name:"[PtCl₄]²⁻", g:"D₄h", d:"5d⁸", homo:"b₂g(d_xy)", lumo:"b₁g*(d_x²−y²)", delta:"~20000", spin:"S=0", rang:"Sariq", note:"16 e⁻. Kv. planar d⁸. Δ₀ katta.", ecount:"8 + 8 = 16"},
    {name:"[Fe(CO)₅]", g:"D₃h", d:"3d⁸", homo:"e'⁴ e''⁴", lumo:"a₁'*", delta:"—", spin:"S=0", rang:"Sarg'ish", note:"18 e⁻. 5 ta CO. 2 xil ν(CO).", ecount:"10 + 8 = 18"},
    {name:"[VO(acac)₂]", g:"C₄v", d:"3d¹", homo:"d_xy¹", lumo:"d_xz, d_yz", delta:"—", spin:"S=1/2", rang:"Ko'k", note:"V⁴⁺ d¹. Kv. piramida. 1 ta juftlanmagan e⁻.", ecount:"10 + 1 = 11"},
  ]
  const m = misollar[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🧪</span> Amaliy misollar — MO diagrammasi bo'yicha tahlil
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {misollar.map((m,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{m.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{m.name} ({m.g})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{m.d}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">HOMO:</span><span className="text-green-300 font-mono">{m.homo}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">LUMO:</span><span className="text-red-300 font-mono">{m.lumo}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-yellow-300 font-mono">{m.delta} cm⁻¹</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Elektron hisobi:</span><span className={m.ecount.includes("18")?"text-green-300":"text-orange-300"}>{m.ecount}</span></div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">MO tahlili:</p>
          <p className="text-purple-200">{m.note}</p>
          <p className="text-purple-200">d-d o'tish energiyasi = Δ₀ = {m.delta} cm⁻¹ → λ = {m.delta !== "—" && m.delta !== "0" ? `${Math.round(10000000/parseInt(m.delta))}` : "—"} nm</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. Δ₀ NI SIMMETRIYA ASOSIDA IZOHLASH
// ═══════════════════════════════════════════════════════════════════════════════
function DeltaIzoh() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"O_h", g:"d²sp³/sp³d²", delta:"10400-35000", dsplit:"t₂g (3) + e_g* (2)", deltaVal:"10 Dq",
      note:"6 ta ligand. t₂g pastda, e_g* yuqorida. π-akseptor → Δ₀↑, π-donor → Δ₀↓."},
    td: {name:"T_d", g:"sp³", delta:"3000-8000", dsplit:"e (2) + t₂ (3)", deltaVal:"4/9·Δ₀(Oh) ≈ 0.44Δ₀",
      note:"4 ta ligand. Teskari ajralish: e (past) + t₂ (yuqori). Δ₀ oktaedrikdan ~2 barobar kichik."},
    d4h: {name:"D₄h", g:"dsp²", delta:"15000-25000", dsplit:"b₂g + e_g + a₁g + b₁g", deltaVal:"Eng katta d⁸",
      note:"4 xil sath. d⁸ da b₁g* (d_x²−y²) LUMO. Δ₀ = E(b₁g*) − E(b₂g)."},
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-yellow-400">⚡</span> Δ₀ — simmetriya asosida izohlash
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(data).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="font-bold text-sm text-amber-400">{d.name} — d-orbital ajralishi</p>
          <div className="flex justify-between"><span className="text-purple-400">Δ₀ diapazoni:</span><span className="text-cyan-300 font-mono font-bold">{d.delta} cm⁻¹</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Ajralish:</span><span className="text-green-300">{d.dsplit}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Δ₀ ifodasi:</span><span className="text-yellow-300 font-mono">{d.deltaVal}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className="text-pink-300 font-mono">{d.g}</span></div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
          <p className="text-purple-400 font-bold">Tushuntirish:</p>
          <p className="text-purple-200 mt-1">{d.note}</p>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded p-1.5 mt-2">
            <p className="text-orange-400 font-bold">⚡ Δ₀ ni o'zgartiruvchi omillar:</p>
            <p className="text-purple-200">1) Geometriya (O_h {">"} T_d) | 2) Ligand (π-akseptor {">"} σ-donor {">"} π-donor) | 3) Metall (3d {'<'} 4d {'<'} 5d)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function Test() {
  const questions = [
    { q:"Oktaedrik MO diagrammasida qaysi metall orbitallari bog'lamaydigan (t₂g) bo'lib qoladi?", a:"d_xy, d_xz, d_yz", opts:["d_z², d_x²−y²","d_xy, d_xz, d_yz","s, p_x, p_y, p_z","barcha d-orbitallar"], hint:"T₂g simmetriyasi — ligand σ bilan mos kelmaydi." },
    { q:"Oktaedrik kompleksda Δ₀ qanday hisoblanadi?", a:"E(e_g*) − E(t₂g)", opts:["E(t₂g) − E(e_g*)","E(e_g*) − E(t₂g)","E(a₁g) − E(t₁u)","E(t₁u) − E(a₁g)"], hint:"Energiya farqi." },
    { q:"Ligand σ-SALC lari O_h da nechta IRREPS ga ajraladi?", a:"A₁g + E_g + T₁u", opts:["T₂g + E_g","A₁g + T₁u","A₁g + E_g + T₁u","E_g + T₂g"], hint:"6 ta ligand = 3 xil simmetriya." },
    { q:"π-akseptor ligand (CO) Δ₀ ga qanday ta'sir qiladi?", a:"t₂g pasayadi → Δ₀ ortadi", opts:["t₂g ortadi → Δ₀ kamayadi","t₂g pasayadi → Δ₀ ortadi","Hech qanday ta'sir","e_g ga ta'sir qiladi"], hint:"Orqaga donorlik." },
    { q:"[Fe(CN)₆]⁴⁻ da HOMO va LUMO qaysilar?", a:"HOMO = t₂g, LUMO = e_g*", opts:["HOMO = e_g, LUMO = t₂g*","HOMO = t₂g, LUMO = e_g*","HOMO = a₁g, LUMO = t₁u","HOMO = t₁u, LUMO = a₁g*"], hint:"d⁶ LS." },
    { q:"Sekulyar tenglamada β (rezonans integrali) nimani ifodalaydi?", a:"Ikki atom orasidagi qoplanish energiyasini", opts:["Atomning o'z energiyasini","Ikki atom orasidagi qoplanish energiyasini","Elektronning kinetik energiyasini","Yadrolar orasidagi itarishishni"], hint:"β = ∫ ψ_A·H·ψ_B dτ." },
    { q:"T_d da d-orbital ajralish tartibi qanday?", a:"E (past) + T₂ (yuqori) — teskari", opts:["T₂g (past) + E_g (yuqori)","E (past) + T₂ (yuqori) — teskari","4 xil sath","1 ta sath"], hint:"Tetraedrikda teskari ajralish." },
    { q:"[Co(NH₃)₆]³⁺ nechta valent elektronga ega?", a:"18 e⁻ (d⁶ LS)", opts:["16 e⁻ (d⁸)","18 e⁻ (d⁶ LS)","15 e⁻ (d⁷)","20 e⁻"], hint:"Co³⁺=3d⁶, 6×NH₃=12e⁻ → 18." },
    { q:"SALC qurishda qanday operator ishlatiladi?", a:"Proyeksion operator P^Γ = (d_Γ/h)·Σχ_Γ(R)·R", opts:["Hamiltonian H","Proyeksion operator P^Γ = (d_Γ/h)·Σχ_Γ(R)·R","Qoplanish integrali S","Laplas operatori ∇²"], hint:"Simmetriya asosida SALC larni yaratish." },
    { q:"D₄h (kvadrat planar) da qaysi orbital LUMO hisoblanadi?", a:"b₁g* (d_x²−y²)", opts:["a₁g (d_z²)","b₂g (d_xy)","b₁g* (d_x²−y²)","e_g (d_xz, d_yz)"], hint:"d⁸ da d_x²−y² bo'sh." },
  ]
  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) { return (
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "MO diagrammani mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
        <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
      </div></div>
  )}
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => { setS(opt); const ok = opt === q.a; if (ok && !ans[c]) setSc(p => p+1); setAns(p => ({...p, [c]: ok})) })()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s === opt ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200") : s ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50") : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}
            </button>
          ))}
        </div>
        {s && (
          <div className="space-y-2">
            <div className={`text-xs p-3 rounded-lg ${s === q.a ? "bg-green-600/10 border-green-500 text-green-300" : "bg-red-600/10 border-red-500 text-red-300"}`}>{s === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}</div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs"><span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span></div>
            <button onClick={() => { if (c < questions.length-1) { setC(p => p+1); setS(null) } else setRes(true) }} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">{c < questions.length-1 ? "Keyingi →" : "Natijalarni ko'rish"}</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function MODiagramma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Kimyoviy bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-orange-400">MO diagramma</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-orange-400 flex items-center gap-2"><span>📊</span> MO diagrammasi — oktaedrik kompleks</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Energiya diagrammasi • SALC • π-ta'sir • Sekulyar tenglama • Δ₀ • HOMO/LUMO • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 MO diagrammasi — oktaedrik kompleks</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">MO diagrammasi</strong> — metall va ligand orbitallarining 
                <strong className="text-cyan-300"> simmetriya bo'yicha</strong> o'zaro ta'sirini ko'rsatadi. 
                Oktaedrik (O_h) simmetriyada orbitallar <strong>4 xil simmetriya turiga</strong> ajraladi: 
                a₁g, t₁u, e_g, t₂g. MO diagrammasi <strong>spektr, magnetizm va Δ₀</strong> ni tushuntiradi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">Canvas diagramma</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">SALC + HMO</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Δ₀ tahlili</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-orange-400 font-bold">🎯 Maqsad:</span> MO energiya diagrammasi, simmetriya tahlili, SALC va sekulyar tenglamani o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">⏱️ Vaqt:</span> ~3 soat</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">📚 Manba:</span> Cotton — Chemical Applications of Group Theory; Albright — Orbital Interactions</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-orange-300 font-mono text-xs font-bold">"MO diagrammasi — kompleksning kvant portreti!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3D modelga o'tish */}
        <div className="text-center">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma/3d"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/30">
            <span className="text-3xl">🔄</span>
            <div className="text-left">
              <div>3D MO diagramma modelini ko'rish</div>
              <div className="text-sm font-normal text-orange-200">Three.js asosida interaktiv 3D vizualizatsiya</div>
            </div>
          </Link>
        </div>

        {/* KOMPONENTLAR */}
        <MOEnergiyaDiagrammasi />
        <SimmetriyaMOTahlili />
        <MOEnergetikSathlar />
        <PiTasiri />
        <MatematikAsoslar />
        <DeltaIzoh />
        <AmaliyMisollar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">MO diagrammasi</strong> — metall + ligand orbitallarining simmetriya bo'yicha o'zaro ta'siri (O_h: a₁g, e_g, t₁u, t₂g)</li>
            <li><strong className="text-yellow-400">t₂g (d_xy, d_xz, d_yz)</strong> — bog'lamaydigan MO, ligand σ bilan mos kelmaydi. Faqat metall d-elektronlarini saqlaydi</li>
            <li><strong className="text-yellow-400">6 ta bog'lovchi MO</strong> (a₁g+e_g+t₁u) = 12 ta e⁻ (ligandlardan). <strong className="text-yellow-400">6 ta bo'shashtiruvchi</strong> (e_g*+a₁g*+t₁u*) = odatda bo'sh</li>
            <li><strong className="text-yellow-400">Δ₀ = E(e_g*) − E(t₂g)</strong>. π-akseptor (CO) → t₂g↓ → Δ₀↑. π-donor (Cl⁻) → t₂g↑ → Δ₀↓</li>
            <li><strong className="text-yellow-400">Sekulyar tenglama:</strong> det|H − E·S| = 0 → E = α ± β. α — koulomb, β — rezonans integrali</li>
            <li><strong className="text-yellow-400">SALC:</strong> P^Γ = (d_Γ/h)·Σχ_Γ(R)·R. 6 ta σ-SALC → A₁g + E_g + T₁u</li>
            <li><strong className="text-yellow-400">Δ₀ ga ta'sir:</strong> Geometriya (O_h {'>'} T_d) | Ligand (π-akseptor {'>'} σ-donor {'>'} π-donor) | Metall (5d {'>'} 4d {'>'} 3d)</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Gibridlanish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/elektron-qoidasi"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20">
            18 elektron qoidasi <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory; T.A. Albright — Orbital Interactions in Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}