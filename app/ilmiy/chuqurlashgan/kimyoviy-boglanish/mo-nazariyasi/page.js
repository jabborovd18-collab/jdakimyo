"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. LCAO — MO SHAKLLANISHI VIZUALIZATSIYASI (CANVAS)
// ═══════════════════════════════════════════════════════════════════════════════
function LCAOCanvas() {
  const [mode, setMode] = useState("sigma")
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const modes = {
    sigma: {
      name: "σ-bog'lovchi MO", color: "#22c55e", desc: "s + s (head-on). Bog'lovchi — energiya past.",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        // Left atom
        const lg = ctx.createRadialGradient(cx-55, cy, 0, cx-55, cy, 20*pulse)
        lg.addColorStop(0, "#3b82f6"); lg.addColorStop(1, "#1e3a5f")
        ctx.beginPath(); ctx.arc(cx-55, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("AO₁", cx-55, cy+25)
        // Right atom
        const rg = ctx.createRadialGradient(cx+55, cy, 0, cx+55, cy, 20*pulse)
        rg.addColorStop(0, "#3b82f6"); rg.addColorStop(1, "#1e3a5f")
        ctx.beginPath(); ctx.arc(cx+55, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = rg; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif"
        ctx.fillText("AO₂", cx+55, cy+25)
        // Bonding MO between them
        const midG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 18)
        midG.addColorStop(0, "#22c55e80"); midG.addColorStop(1, "#22c55e10")
        ctx.beginPath(); ctx.ellipse(cx, cy, 35*pulse, 14*pulse, 0, 0, Math.PI*2)
        ctx.fillStyle = midG; ctx.fill()
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#22c55e"; ctx.font = "bold 9px sans-serif"
        ctx.fillText("σ-MO", cx, cy+3)
        // Bond lines
        ctx.strokeStyle = "#22c55e40"; ctx.lineWidth = 1.5; ctx.setLineDash([3,3])
        ctx.beginPath(); ctx.moveTo(cx-35, cy); ctx.lineTo(cx+35, cy); ctx.stroke()
        ctx.setLineDash([])
      }
    },
    antibond: {
      name: "σ*-bo'shashtiruvchi MO", color: "#ef4444", desc: "s − s (head-on). Bo'shashtiruvchi — energiya yuqori.",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        const lg = ctx.createRadialGradient(cx-55, cy, 0, cx-55, cy, 16*pulse)
        lg.addColorStop(0, "#3b82f6"); lg.addColorStop(1, "#1e3a5f")
        ctx.beginPath(); ctx.arc(cx-55, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("AO₁", cx-55, cy+25)
        const rg = ctx.createRadialGradient(cx+55, cy, 0, cx+55, cy, 16*pulse)
        rg.addColorStop(0, "#f43f5e"); rg.addColorStop(1, "#5f1a2e")
        ctx.beginPath(); ctx.arc(cx+55, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = rg; ctx.fill(); ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "9px sans-serif"
        ctx.fillText("AO₂", cx+55, cy+25)
        // Node plane
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx, cy-20); ctx.lineTo(cx, cy+20); ctx.stroke()
        ctx.fillStyle = "#ef4444"; ctx.font = "bold 12px sans-serif"
        ctx.fillText("⊗", cx, cy+4)
        ctx.fillStyle = "#ef4444"; ctx.font = "bold 9px sans-serif"
        ctx.fillText("σ*-MO (tugun)", cx, cy-28)
      }
    },
    pi: {
      name: "π-bog'lovchi MO", color: "#3b82f6", desc: "p + p (side-on). π-bog'lovchi.",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.1
        // Left p-orbital (vertical)
        const grd1 = ctx.createRadialGradient(cx-55, cy-18, 0, cx-55, cy-18, 14*pulse)
        grd1.addColorStop(0, "#3b82f680"); grd1.addColorStop(1, "#3b82f610")
        ctx.beginPath(); ctx.ellipse(cx-55, cy-18, 10, 14*pulse, 0, 0, Math.PI*2)
        ctx.fillStyle = grd1; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        const grd2 = ctx.createRadialGradient(cx-55, cy+18, 0, cx-55, cy+18, 14*pulse)
        grd2.addColorStop(0, "#f43f5e80"); grd2.addColorStop(1, "#f43f5e10")
        ctx.beginPath(); ctx.ellipse(cx-55, cy+18, 10, 14*pulse, 0, 0, Math.PI*2)
        ctx.fillStyle = grd2; ctx.fill(); ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 1.5; ctx.stroke()
        // Center symbol
        ctx.fillStyle = "#3b82f6"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("p-orbitallar", cx-55, cy+45)
        // Right p-orbital (vertical)
        const grd3 = ctx.createRadialGradient(cx+55, cy-18, 0, cx+55, cy-18, 14*pulse)
        grd3.addColorStop(0, "#3b82f680"); grd3.addColorStop(1, "#3b82f610")
        ctx.beginPath(); ctx.ellipse(cx+55, cy-18, 10, 14*pulse, 0, 0, Math.PI*2)
        ctx.fillStyle = grd3; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        const grd4 = ctx.createRadialGradient(cx+55, cy+18, 0, cx+55, cy+18, 14*pulse)
        grd4.addColorStop(0, "#f43f5e80"); grd4.addColorStop(1, "#f43f5e10")
        ctx.beginPath(); ctx.ellipse(cx+55, cy+18, 10, 14*pulse, 0, 0, Math.PI*2)
        ctx.fillStyle = grd4; ctx.fill(); ctx.strokeStyle = "#f43f5e"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#3b82f6"; ctx.font = "bold 10px sans-serif"
        ctx.fillText("p-orbitallar", cx+55, cy+45)
        // Side-on overlap
        ctx.strokeStyle = "#3b82f640"; ctx.lineWidth = 2; ctx.setLineDash([4,4])
        ctx.beginPath(); ctx.moveTo(cx-40, cy-18); ctx.lineTo(cx+40, cy-18); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx-40, cy+18); ctx.lineTo(cx+40, cy+18); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = "#3b82f6"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("π-MO", cx, cy-30)
      }
    },
    lcao: {
      name: "LCAO formulasi", color: "#a855f7", desc: "MO = Σ cᵢ·AOᵢ",
      draw: (ctx, cx, cy, t) => {
        // Draw energy diagram
        ctx.fillStyle = "#a78bfa"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("LCAO — Energiya diagrammasi", cx, 20)
        // Left AO levels
        ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx-100, cy-40); ctx.lineTo(cx-70, cy-40); ctx.stroke()
        ctx.fillStyle = "#3b82f6"; ctx.font = "9px sans-serif"
        ctx.fillText("AO₁ (ψ₁)", cx-85, cy-44)
        ctx.beginPath(); ctx.moveTo(cx-100, cy-10); ctx.lineTo(cx-70, cy-10); ctx.stroke()
        ctx.fillStyle = "#3b82f6"
        ctx.fillText("AO₂ (ψ₂)", cx-85, cy-14)
        // Right MO levels
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx+20, cy-70); ctx.lineTo(cx+50, cy-70); ctx.stroke()
        ctx.fillStyle = "#22c55e"; ctx.font = "9px sans-serif"
        ctx.fillText("σ (ψ₁+ψ₂) ↓", cx+55, cy-73)
        ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx+20, cy+20); ctx.lineTo(cx+50, cy+20); ctx.stroke()
        ctx.fillStyle = "#ef4444"
        ctx.fillText("σ* (ψ₁−ψ₂) ↑", cx+55, cy+17)
        // Center formula
        ctx.fillStyle = "#a855f7"; ctx.font = "bold 14px sans-serif"
        ctx.fillText("MO = c₁·ψ₁ ± c₂·ψ₂", cx, cy+55)
        // Connecting lines
        ctx.strokeStyle = "rgba(168,85,247,0.3)"; ctx.lineWidth = 1; ctx.setLineDash([3,3])
        ctx.beginPath(); ctx.moveTo(cx-70, cy-40); ctx.lineTo(cx+20, cy-70); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx-70, cy-40); ctx.lineTo(cx+20, cy+20); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx-70, cy-10); ctx.lineTo(cx+20, cy-70); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(cx-70, cy-10); ctx.lineTo(cx+20, cy+20); ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    let t = 0
    function draw() {
      t += 0.03
      ctx.clearRect(0, 0, w, h)
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
      grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)
      modes[mode].draw(ctx, cx, cy, t)
      ctx.fillStyle = "#a78bfa80"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(modes[mode].desc, cx, h-10)
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [mode])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-yellow-400">🎨</span> LCAO — MO shakllanishi (interaktiv Canvas)
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(modes).map(([k,v]) => (
          <button key={k} onClick={()=>setMode(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${mode===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={mode===k ? {background:v.color+"44", borderColor:v.color+"88"} : {}}>
            {v.name}
          </button>
        ))}
      </div>
      <canvas ref={canvasRef} width={360} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-2">
        <p className="text-yellow-400 font-bold">{modes[mode].name}</p>
        <p className="text-purple-200">{modes[mode].desc}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MO TURLARI — INTERAKTIV JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function MOTurlari() {
  const [sel, setSel] = useState(null)
  const rows = [
    { t:"σ-bog'lovchi", sym:"σ", e:"Past", o:"Head-on (s+s, s+p, p+p)", s:"A₁g/A₁", d:"Barcha komplekslarda asosiy bog'", en:"Eng kuchli", ex:"M−L σ" },
    { t:"σ*-bo'shashtiruvchi", sym:"σ*", e:"Yuqori", o:"Head-on (s−s, s−p)", s:"A₁g*/A₁*", d:"Antibog' — bog'ni buzadi", en:"Eng yuqori", ex:"M−L σ*" },
    { t:"π-bog'lovchi", sym:"π", e:"O'rtacha", o:"Side-on (p+p, d+p)", s:"T₂g/T₂", d:"π-akseptor va π-donor", en:"O'rtacha", ex:"M−CN π" },
    { t:"π*-bo'shashtiruvchi", sym:"π*", e:"Yuqori", o:"Side-on (p−p)", s:"T₂g*/T₂*", d:"Ligand π* bo'sh orbitali", en:"Yuqori", ex:"CO π*" },
    { t:"n-bog'lamaydigan", sym:"n", e:"O'rtacha", o:"Qatnashmaydi", s:"T₂g", d:"Metall t₂g orbitallari", en:"O'zgarmaydi", ex:"Fe d_xy" },
    { t:"δ-bog'lovchi", sym:"δ", e:"Juda past", o:"4-lobli (d+d)", s:"?", d:"M−M bog'", en:"Juda kuchsiz", ex:"Re−Re" },
  ]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📊</span> MO turlari — simmetriya va energetika
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">MO turi</th>
            <th className="p-1 text-center text-purple-200">Belgi</th>
            <th className="p-1 text-center text-purple-200">Energiya</th>
            <th className="p-1 text-left text-purple-200">Qoplanish</th>
            <th className="p-1 text-center text-purple-200">IRREPS</th>
            <th className="p-1 text-left text-purple-200 hidden md:table-cell">Ta'rifi</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40":"hover:bg-purple-800/30"}`}>
                <td className="p-1 font-bold" style={{color:r.t.includes("bo'sh")?"#ef4444":r.t.includes("bog'lamay")?"#a855f7":"#22c55e"}}>{r.t}</td>
                <td className="p-1 text-center font-mono font-bold text-yellow-300">{r.sym}</td>
                <td className="p-1 text-center text-purple-300">{r.e}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px]">{r.o}</td>
                <td className="p-1 text-center text-cyan-300 font-mono">{r.s}</td>
                <td className="p-1 text-purple-300 text-[7px] sm:text-[9px] hidden md:table-cell">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-3 text-xs mt-3">
          <p className="text-yellow-400 font-bold">{rows[sel].t} ({rows[sel].sym})</p>
          <p className="text-purple-200 mt-1">{rows[sel].d}. Energiya: {rows[sel].en}. Misol: {rows[sel].ex}.</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. OKTAEDRIK MO ENERGIYA DIAGRAMMASI (CANVAS)
// ═══════════════════════════════════════════════════════════════════════════════
function OKtaedrikMODiagramma() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("Oktaedrik [ML₆] MO diagrammasi", cx, 16)

    // Left: Metall AO
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("Metall AO", 15, 30)

    const metalLevels = [
      {y:cy-55, c:"#22c55e", t:"3d (t₂g)"},
      {y:cy-25, c:"#ef4444", t:"3d (e_g*)"},
      {y:cy+5, c:"#3b82f6", t:"4s (a₁g)"},
      {y:cy+35, c:"#a855f7", t:"4p (t₁u)"},
    ]
    metalLevels.forEach(l => {
      ctx.strokeStyle = l.c; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(30, l.y); ctx.lineTo(90, l.y); ctx.stroke()
      ctx.fillStyle = l.c; ctx.font = "7px sans-serif"
      ctx.fillText(l.t, 92, l.y+3)
    })

    // Right: Ligand MO (6×σ)
    ctx.fillStyle = "#60a5fa"; ctx.font = "bold 8px sans-serif"
    ctx.fillText("Ligand MO (6×σ)", cx+80, 30)
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 2
    ctx.beginPath(); ctx.moveTo(cx+110, cy-25); ctx.lineTo(cx+160, cy-25); ctx.stroke()
    ctx.fillStyle = "#60a5fa"; ctx.font = "7px sans-serif"
    ctx.fillText("6×σ (a₁g + e_g + t₁u)", cx+162, cy-22)

    // Center: MO
    ctx.fillStyle = "#22c55e"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("MO", cx, 30)

    const moLevels = [
      {y:cy-75, c:"#22c55e", t:"t₂g (bog'lamaydigan)"},
      {y:cy-40, c:"#fbbf24", t:"Δ₀"},
      {y:cy-15, c:"#ef4444", t:"e_g* (bo'shashtiruvchi)"},
      {y:cy+15, c:"#3b82f6", t:"a₁g*"},
      {y:cy+45, c:"#a855f7", t:"t₁u*"},
      {y:cy-55, c:"#22c55e", t:"a₁g + e_g + t₁u (bog'lovchi)"},
    ]
    moLevels.forEach(l => {
      ctx.strokeStyle = l.c; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-30, l.y); ctx.lineTo(cx+30, l.y); ctx.stroke()
    })
    // Labels on the right side of MO
    moLevels.forEach(l => {
      ctx.fillStyle = l.c; ctx.font = "6px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(l.t, cx+33, l.y+2)
    })

    // Δ₀ arrow
    ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(cx+35, cy-40); ctx.lineTo(cx+35, cy-15); ctx.stroke()
    ctx.fillStyle = "#fbbf24"; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("Δ₀", cx+38, cy-30)

    // Connections
    ctx.strokeStyle = "rgba(168,85,247,0.15)"; ctx.lineWidth = 1; ctx.setLineDash([2,3])
    ctx.beginPath(); ctx.moveTo(90, cy-55); ctx.lineTo(cx-30, cy-75); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(90, cy-55); ctx.lineTo(cx-30, cy-55); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(90, cy-25); ctx.lineTo(cx-30, cy-15); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(90, cy+5); ctx.lineTo(cx-30, cy+15); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(90, cy+35); ctx.lineTo(cx-30, cy+45); ctx.stroke()
    ctx.setLineDash([])

    // Energy arrow
    ctx.strokeStyle = "rgba(139,92,246,0.3)"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx+100, cy-80); ctx.lineTo(cx+100, cy+60); ctx.stroke()
    ctx.fillStyle = "rgba(139,92,246,0.3)"; ctx.font = "7px sans-serif"
    ctx.fillText("Energiya ↑", cx+100, cy+70)
  }, [])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📈</span> Oktaedrik [ML₆] MO energiya diagrammasi
      </h3>
      <canvas ref={canvasRef} width={360} height={200} className="w-full h-60 bg-purple-950/60 rounded-xl border border-purple-700/40" />
      <div className="grid grid-cols-3 gap-2 text-[10px] mt-2">
        <div className="bg-green-600/10 border border-green-500/30 rounded p-2 text-center">
          <p className="text-green-400 font-bold">Bog'lovchi</p>
          <p className="text-purple-200">a₁g + e_g + t₁u</p>
          <p className="text-purple-300">6 ta MO</p>
        </div>
        <div className="bg-purple-600/10 border border-purple-500/30 rounded p-2 text-center">
          <p className="text-purple-400 font-bold">Bog'lamaydigan</p>
          <p className="text-purple-200">t₂g (d_xy,xz,yz)</p>
          <p className="text-purple-300">3 ta MO</p>
        </div>
        <div className="bg-red-600/10 border border-red-500/30 rounded p-2 text-center">
          <p className="text-red-400 font-bold">Bo'shashtiruvchi</p>
          <p className="text-purple-200">e_g* + a₁g* + t₁u*</p>
          <p className="text-purple-300">6 ta MO</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MATEMATIK ASOSLAR — LCAO FORMULALARI
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar() {
  const [topic, setTopic] = useState("lcao")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">📐</span> MO nazariyasining matematik asoslari
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {k:"lcao", l:"LCAO formulasi"},
          {k:"secular", l:"Sekulyar tenglama"},
          {k:"huckel", l:"Xyukkel usuli"},
          {k:"bog_tartibi", l:"Bog' tartibi"},
        ].map(v => (
          <button key={v.k} onClick={()=>setTopic(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${topic===v.k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.l}
          </button>
        ))}
      </div>
      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {topic === "lcao" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">LCAO — Chiziqli Kombinatsiya:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">ψ_MO = c₁·φ₁ + c₂·φ₂ + ... + c_n·φ_n</p>
            <p className="text-purple-200">φ_i — i-atom orbitali (AO)</p>
            <p className="text-purple-200">c_i — koeffitsiyent (qoplanish darajasi)</p>
            <p className="text-purple-200">Normalizatsiya: Σ c_i² = 1</p>
            <p className="text-purple-200">σ-MO: ψ₁ = (1/√2)(φ₁ + φ₂) — bog'lovchi</p>
            <p className="text-purple-200">σ*-MO: ψ₂ = (1/√2)(φ₁ − φ₂) — bo'shashtiruvchi</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 c₁² + c₂² = 1 (normalizatsiya). c₁ = c₂ = 1/√2 simmetrik molekulalarda.</p>
            </div>
          </div>
        )}
        {topic === "secular" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Sekulyar tenglama (energiyani topish):</p>
            <p className="text-cyan-300 text-center my-2 text-sm">det|H − E·S| = 0</p>
            <p className="text-purple-200">H_{ii} = α_i (koulomb integrali, ~AO energiyasi)</p>
            <p className="text-purple-200">H_{ij} = β_{ij} (rezonans integrali, ~qoplanish)</p>
            <p className="text-purple-200">S_{ij} = δ_{ij} (ortogonallik — soddalashtirilgan)</p>
            <p className="text-purple-200 mt-2">Ikki atomli sistema: E = α ± β</p>
            <p className="text-purple-200">E_bog' = α + β (past), E_bo'sh = α − β (yuqori)</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 α — manfiy (~−10 eV). β — manfiy (~−1 to −3 eV). |β| qancha katta → bog' shuncha kuchli.</p>
            </div>
          </div>
        )}
        {topic === "huckel" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Xyukkel molekulyar orbital (HMO) usuli:</p>
            <p className="text-purple-200">Faqat π-elektronlar uchun. Soddalashtirilgan:</p>
            <p className="text-purple-200">H_{ii} = α, H_{ij} = β (qo'shni), 0 (boshqa)</p>
            <p className="text-purple-200">S_{ij} = δ_{ij} (ortogonal)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Etilen (C=C):</strong> E = α ± β</p>
            <p className="text-purple-200"><strong className="text-green-300">Benzol (C₆H₆):</strong> E = α + 2β, α + β (×2), α − β (×2), α − 2β</p>
            <p className="text-purple-200">Benzolning π-elektron energiyasi: E_π = 6α + 8β</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 HMO — organik π-sistemalar uchun. Komplekslarda ligand π* uchun qo'llaniladi.</p>
            </div>
          </div>
        )}
        {topic === "bog_tartibi" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Bog' tartibi (BO — Bond Order):</p>
            <p className="text-cyan-300 text-center my-2 text-sm">BO = (N_bog' − N_bo'sh) / 2</p>
            <p className="text-purple-200">N_bog' — bog'lovchi MO dagi elektronlar soni</p>
            <p className="text-purple-200">N_bo'sh — bo'shashtiruvchi MO dagi elektronlar soni</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Misol — [Co(NH₃)₆]³⁺:</strong></p>
            <p className="text-purple-200">12 e⁻ (ligand σ) + 6 e⁻ (metall d⁶) = 18 e⁻</p>
            <p className="text-purple-200">12 e⁻ bog'lovchi MO larda, 6 e⁻ t₂g (bog'lamaydigan) da</p>
            <p className="text-purple-200">BO = (12 − 0)/2 = 6 (6 ta M−L bog')</p>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 BO = 0 → molekula barqaror emas. BO {'>'} 0 → barqaror. BO katta → bog' kuchli.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. BOG' TARTIBI — INTERAKTIV HISOBLAGICH
// ═══════════════════════════════════════════════════════════════════════════════
function BogTartibiHisoblagich() {
  const [sel, setSel] = useState(0)
  const complexes = [
    {name:"[Co(NH₃)₆]³⁺", me:6, le:12, total:18, bo:"(12−0)/2=6", bo_val:6, stable:true, note:"d⁶ LS, 0 antibog' e⁻"},
    {name:"[Fe(CO)₅]", me:8, le:10, total:18, bo:"(10−0)/2=5", bo_val:5, stable:true, note:"d⁸, 5 ta bog', diamagnit"},
    {name:"[Ni(CO)₄]", me:10, le:8, total:18, bo:"(8−0)/2=4", bo_val:4, stable:true, note:"d¹⁰, tetraedrik"},
    {name:"[PtCl₄]²⁻", me:8, le:8, total:16, bo:"(8−0)/2=4", bo_val:4, stable:true, note:"d⁸, 16 e⁻, kv. planar"},
    {name:"[CoCl₄]²⁻", me:7, le:8, total:15, bo:"(8−1)/2=3.5", bo_val:3.5, stable:false, note:"d⁷ HS, radikal"},
    {name:"[Fe(H₂O)₆]²⁺", me:6, le:12, total:18, bo:"(12−0)/2=6", bo_val:6, stable:true, note:"d⁶ HS, sp³d²"},
  ]
  const c = complexes[sel]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">🧮</span> Bog' tartibi hisoblagichi
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {complexes.map((c,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 text-xs space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{c.name}</p>
          <div className="flex justify-between"><span className="text-purple-400">Metall e⁻:</span><span className="text-cyan-300 font-mono">{c.me}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Ligand e⁻:</span><span className="text-green-300 font-mono">{c.le}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Jami:</span><span className={`font-mono font-bold ${c.total===18?"text-green-400":"text-orange-400"}`}>{c.total} e⁻</span></div>
          <div className="flex justify-between border-t border-purple-700/30 pt-1"><span className="text-purple-400 font-bold">Bog' tartibi:</span><span className="text-yellow-300 font-mono font-bold">{c.bo} = {c.bo_val}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Barqaror:</span><span className={c.stable?"text-green-400":"text-red-400"}>{c.stable?"✅ Ha":"❌ Yo'q"}</span></div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
          <p className="text-purple-400 font-bold">Tahlil:</p>
          <p className="text-purple-200 mt-1">{c.note}</p>
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded p-2 mt-2">
            <p className="text-cyan-400 font-bold">Formula:</p>
            <p className="text-yellow-300 font-mono text-sm text-center">BO = (N_bog' − N_bo'sh) / 2</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SIMMETRIYA VA MO — IRREPS BO'YICHA TAHLIL
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaMOTahlili() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"O_h", metal:{s:"A₁g", p:"T₁u", d:"E_g+T₂g"}, ligand:{sigma:"A₁g+E_g+T₁u", pi:"T₁g+T₂g+T₁u+T₂u"},
      mos:{bonding:"a₁g, e_g, t₁u", nonbond:"t₂g", antibond:"e_g*, a₁g*, t₁u*"},
      note:"6×σ ligand → a₁g+e_g+t₁u (3 ta IRREPS). Metall s→a₁g, p→t₁u, d(z²,x²−y²)→e_g, d(xy,xz,yz)→t₂g."},
    td: {name:"T_d", metal:{s:"A₁", p:"T₂", d:"E+T₂"}, ligand:{sigma:"A₁+T₂", pi:"E+T₁+T₂"},
      mos:{bonding:"a₁, t₂", nonbond:"e", antibond:"e*, t₂*, a₁*"},
      note:"4×σ ligand → a₁+t₂. Metall d→e (past) + t₂ (yuqori) — teskari ajralish."},
    d4h: {name:"D₄h", metal:{s:"A₁g", p:"A₂u+E_u", d:"A₁g+B₁g+B₂g+E_g"}, ligand:{sigma:"A₁g+B₁g+E_u", pi:"..."},
      mos:{bonding:"a₁g, e_u, b₁g", nonbond:"b₂g, e_g", antibond:"b₁g*, e_u*, a₁g*"},
      note:"4×σ ligand → a₁g+b₁g+e_u. d⁸ → kv. planar. d(x²−y²) → b₁g* (LUMO)."},
  }
  const d = data[geo]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-indigo-400">🔬</span> Simmetriya va MO — IRREPS bo'yicha tahlil
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(data).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-amber-400 font-bold">Metall orbitallari (IRREPS):</p>
          <p className="text-purple-200">s → <span className="text-cyan-300 font-mono">{d.metal.s}</span></p>
          <p className="text-purple-200">p → <span className="text-cyan-300 font-mono">{d.metal.p}</span></p>
          <p className="text-purple-200">d → <span className="text-cyan-300 font-mono">{d.metal.d}</span></p>
          <p className="text-amber-400 font-bold mt-2">Ligand orbitallari:</p>
          <p className="text-purple-200">σ → <span className="text-green-300 font-mono">{d.ligand.sigma}</span></p>
          {d.ligand.pi && <p className="text-purple-200">π → <span className="text-blue-300 font-mono">{d.ligand.pi}</span></p>}
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-amber-400 font-bold">MO klassifikatsiyasi:</p>
          <p className="text-green-300">Bog'lovchi: <span className="text-purple-200 font-mono">{d.mos.bonding}</span></p>
          <p className="text-purple-400">Bog'lamaydigan: <span className="text-purple-200 font-mono">{d.mos.nonbond}</span></p>
          <p className="text-red-300">Bo'shashtiruvchi: <span className="text-purple-200 font-mono">{d.mos.antibond}</span></p>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400 font-bold">💡 </p>
            <p className="text-purple-200">{d.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. π-SIMMETRIYA — LIGAND π-ORBITALLARI MO TAHLILI
// ═══════════════════════════════════════════════════════════════════════════════
function PiSimmetriyaMOTahlili() {
  const [ligandType, setLigandType] = useState("acceptor")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">🔄</span> π-simmetriya — MO bo'yicha tahlil
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setLigandType("acceptor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${ligandType==="acceptor"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
          π-akseptor (CO, CN⁻)
        </button>
        <button onClick={()=>setLigandType("donor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${ligandType==="donor"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
          π-donor (Cl⁻, Br⁻)
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className={`rounded-xl p-4 border ${ligandType==="acceptor"?"bg-blue-600/10 border-blue-500/30":"bg-orange-600/10 border-orange-500/30"}`}>
          <p className={ligandType==="acceptor"?"text-blue-400 font-bold":"text-orange-400 font-bold text-sm"}>
            {ligandType==="acceptor"?"π-akseptor ligandlar":"π-donor ligandlar"}
          </p>
          <div className="space-y-1 mt-2 text-purple-200">
            {ligandType==="acceptor" ? (
              <>
                <p>• Ligand <strong className="text-yellow-300">bo'sh π*</strong> orbitallari → T₂g simmetriya</p>
                <p>• Metall t₂g (to'lgan) → ligand π* (bo'sh) → <strong className="text-green-300">orqaga donorlik</strong></p>
                <p>• t₂g energiyasi <strong className="text-green-300">pasayadi</strong> → Δ₀ ortadi</p>
                <p>• Natija: <strong className="text-cyan-300">kuchli maydon, past spin (LS)</strong></p>
                <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-1 text-center">
                  <p className="text-yellow-300 font-mono">CN⁻: Δ₀ ≈ 33000 cm⁻¹ | CO: Δ₀ ≈ 35000 cm⁻¹</p>
                </div>
              </>
            ) : (
              <>
                <p>• Ligand <strong className="text-yellow-300">to'lgan π</strong> orbitallari → T₂g simmetriya</p>
                <p>• Ligand π (to'lgan) → metall t₂g (bo'sh qisman) → <strong className="text-red-300">π-donorlik</strong></p>
                <p>• t₂g energiyasi <strong className="text-red-300">ortadi</strong> → Δ₀ kamayadi</p>
                <p>• Natija: <strong className="text-orange-300">kuchsiz maydon, yuqori spin (HS)</strong></p>
                <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-1 text-center">
                  <p className="text-yellow-300 font-mono">Cl⁻: Δ₀ ≈ 13000 cm⁻¹ | Br⁻: Δ₀ ≈ 7000 cm⁻¹</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-2">
          <p className="text-purple-400 font-bold">Simmetriya tahlili (O_h):</p>
          <p className="text-purple-200">• π-orbitallar <strong className="text-cyan-300">T₂g</strong> simmetriyaga ega</p>
          <p className="text-purple-200">• Metall d_xy, d_xz, d_yz — <strong className="text-cyan-300">T₂g</strong></p>
          <p className="text-purple-200">• Faqat <strong className="text-yellow-300">bir xil simmetriyali</strong> orbitallar π-bog' hosil qiladi</p>
          <p className="text-purple-200">• e_g (d_z², d_x²−y²) π-bog'da <strong className="text-red-300">ishtirok etmaydi</strong></p>
          <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-yellow-300 font-mono text-center">T₂g ⊗ T₂g → A₁g + E_g + T₁g + T₂g</p>
            <p className="text-purple-300 text-center text-[9px]">π-bog' faqat T₂g simmetriyali orbitallar orasida</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. AMALIY MISOLLAR — MO BO'YICHA TAHLIL
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    {name:"[Co(NH₃)₆]³⁺", g:"O_h", d:"3d⁶ LS", homo:"t₂g⁶", lumo:"e_g* (bo'sh)", delta:"23000 cm⁻¹", spin:"S=0", rang:"Sarg'ish", note:"18 e⁻, diamagnit. Kuchli maydon. d-d o'tish: ¹A₁g → ¹T₁g."},
    {name:"[Fe(CN)₆]⁴⁻", g:"O_h", d:"3d⁶ LS", homo:"t₂g⁶", lumo:"e_g*", delta:"35000 cm⁻¹", spin:"S=0", rang:"Sariq", note:"18 e⁻. CN⁻ kuchli maydon. LS. Diamagnit."},
    {name:"[Fe(H₂O)₆]²⁺", g:"O_h", d:"3d⁶ HS", homo:"t₂g⁴ e_g²", lumo:"e_g*", delta:"10400 cm⁻¹", spin:"S=2", rang:"Och yashil", note:"18 e⁻. H₂O kuchsiz maydon. HS. Paramagnit (μ≈4.9)."},
    {name:"[CoCl₄]²⁻", g:"T_d", d:"3d⁷ HS", homo:"e⁴t₂³", lumo:"t₂*", delta:"~3000 cm⁻¹", spin:"S=3/2", rang:"Ko'k", note:"15 e⁻. T_d. Inversiya yo'q → d-d o'tish kuchli. Ko'k rang."},
    {name:"[PtCl₄]²⁻", g:"D₄h", d:"5d⁸", homo:"b₂g (d_xy)", lumo:"b₁g* (d_x²−y²)", delta:"~20000 cm⁻¹", spin:"S=0", rang:"Sariq", note:"16 e⁻. Kv. planar. d⁸ → diamagnit. Anti-kanser."},
    {name:"[Ni(CO)₄]", g:"T_d", d:"3d¹⁰", homo:"t₂⁶ e⁴", lumo:"t₂*", delta:"0", spin:"S=0", rang:"Rangsiz", note:"18 e⁻. Ni(0) d¹⁰ → to'lgan. Tetraedrik. Uchuvchan."},
    {name:"[Fe(CO)₅]", g:"D₃h", d:"3d⁸", homo:"e'⁴ e''⁴", lumo:"a₁'*", delta:"—", spin:"S=0", rang:"Sarg'ish", note:"18 e⁻. Trig. bipiramida. 2 xil CO. Diamagnit."},
    {name:"[VO(acac)₂]", g:"C₄v", d:"3d¹", homo:"d_xy", lumo:"d_xz,d_yz", delta:"—", spin:"S=1/2", rang:"Ko'k", note:"V⁴⁺ d¹. Kv. piramida. Paramagnit. 1 ta juftlanmagan e⁻."},
  ]
  const m = misollar[sel]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🧪</span> Amaliy misollar — MO bo'yicha kompleks tahlili
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {misollar.map((m,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {m.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{m.name} ({m.g})</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Konfiguratsiya:</span><span className="text-cyan-300 font-mono">{m.d}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">HOMO:</span><span className="text-green-300 font-mono">{m.homo}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">LUMO:</span><span className="text-red-300 font-mono">{m.lumo}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-yellow-300 font-mono">{m.delta}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Spin (S):</span><span className={m.spin==="S=0"?"text-green-300":"text-red-300"}>{m.spin}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Rang:</span><span className="text-pink-300">{m.rang}</span></div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">MO tahlili:</p>
          <p className="text-purple-200">{m.note}</p>
          <p className="text-purple-200 mt-1">HOMO = {m.homo} (eng yuqori to'lgan MO). LUMO = {m.lumo} (eng past bo'sh MO).</p>
          <p className="text-purple-200">d-d o'tish: HOMO → LUMO, energiya = Δ₀ = {m.delta}.</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. VB vs MO — TO'LIQ TAQQOSLASH (INTERAKTIV)
// ═══════════════════════════════════════════════════════════════════════════════
function VBvsMOTaqqoslash() {
  const [view, setView] = useState("comparison")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">⚖️</span> VB va MO nazariyalari — to'liq taqqoslash
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("comparison")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="comparison"?"bg-purple-600 text-white":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          📊 Taqqoslash jadvali
        </button>
        <button onClick={()=>setView("synergy")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="synergy"?"bg-purple-600 text-white":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔄 Sinergiya
        </button>
      </div>
      {view === "comparison" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead><tr className="bg-purple-800/70">
              <th className="p-1.5 text-left text-amber-400">Xususiyat</th>
              <th className="p-1.5 text-left text-green-400">VB</th>
              <th className="p-1.5 text-left text-blue-400">MO</th>
              <th className="p-1.5 text-left text-purple-300">G'olib</th>
            </tr></thead>
            <tbody>
              {[
                {x:"Bog' tushunchasi", vb:"Lokalizatsiyalangan (ikki atomli)", mo:"Delokalizatsiyalangan (butun molekula)", w:"MO"},
                {x:"Geometriya", vb:"Gibridlanish orqali (aniq)", mo:"Simmetriya orqali (bilvosita)", w:"VB"},
                {x:"Energiya", vb:"Sifat jihatdan", mo:"Miqdoriy (sekulyar tenglama)", w:"MO"},
                {x:"Spektr (UV-Vis)", vb:"Tushuntirmaydi", mo:"To'liq tushuntiradi (d-d o'tish)", w:"MO"},
                {x:"Magnetizm", vb:"Zaif", mo:"A'lo (yuqori/past spin)", w:"MO"},
                {x:"Δ₀ hisoblash", vb:"Hisoblamaydi", mo:"Hisoblaydi (ligand maydon)", w:"MO"},
                {x:"Oddiylik", vb:"Oddiy, vizual", mo:"Murakkab, abstrakt", w:"VB"},
                {x:"π-bog'lanish", vb:"Rezonans (sun'iy)", mo:"Tabiiy (π va π*)", w:"MO"},
                {x:"Kompyuter hisobi", vb:"Kam qo'llaniladi", mo:"DFT, HF — MO asosida", w:"MO"},
                {x:"Xulosa", vb:"Geometriya + gibridlanish", mo:"Spektr + energetika", w:"Ikkalasi"},
              ].map((r,i)=>(
                <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className="p-1.5 font-bold text-yellow-300">{r.x}</td>
                  <td className="p-1.5 text-green-200">{r.vb}</td>
                  <td className="p-1.5 text-blue-200">{r.mo}</td>
                  <td className={`p-1.5 font-bold ${r.w==="MO"?"text-blue-400":r.w==="VB"?"text-green-400":"text-amber-400"}`}>{r.w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {view === "synergy" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-2">
            <p className="text-amber-400 font-bold text-sm">VB ning kuchli tomonlari:</p>
            <p className="text-purple-200">✅ Geometriyani aniq bashorat qiladi (gibridlanish)</p>
            <p className="text-purple-200">✅ Oddiy va tushunarli</p>
            <p className="text-purple-200">✅ Gibridlanish tushunchasi foydali</p>
            <p className="text-purple-200">✅ Ichki/tashqi orbital farqi</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-2">
            <p className="text-amber-400 font-bold text-sm">MO ning kuchli tomonlari:</p>
            <p className="text-purple-200">✅ Spektr va rangni tushuntiradi</p>
            <p className="text-purple-200">✅ Magnetizmni tushuntiradi (HS/LS)</p>
            <p className="text-purple-200">✅ Δ₀ ni hisoblaydi</p>
            <p className="text-purple-200">✅ π-bog'lanishni tabiiy tushuntiradi</p>
          </div>
          <div className="lg:col-span-2 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-center">
            <p className="text-yellow-400 font-bold text-sm">🎯 Xulosa: VB + MO = To'liq tushunish</p>
            <p className="text-purple-200 mt-1">VB geometriya va gibridlanishni, MO esa spektr, magnetizm va energiyani tushuntiradi. Ikkalasi birgalikda kompleks birikmalarning to'liq tasvirini beradi.</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function TestMO() {
  const questions = [
    { q:"MO nazariyasida LCAO nimani anglatadi?", a:"Atom orbitallarining chiziqli kombinatsiyasi", opts:["Ligandlarning koordinatsion bog'lanishi","Atom orbitallarining chiziqli kombinatsiyasi","Molekulyar orbitallarning ajralishi","Kovalent bog'lanish energiyasi"], hint:"LCAO = Linear Combination of Atomic Orbitals." },
    { q:"Oktaedrik O_h da qaysi metall d-orbitallari bog'lamaydigan MO (t₂g) hosil qiladi?", a:"d_xy, d_xz, d_yz", opts:["d_z², d_x²−y²","d_xy, d_xz, d_yz","barcha d-orbitallar","faqat d_z²"], hint:"T₂g simmetriyasi." },
    { q:"Bog' tartibi (BO) qanday hisoblanadi?", a:"(N_bog' − N_bo'sh)/2", opts:["N_bog' + N_bo'sh","(N_bog' − N_bo'sh)/2","N_bog' × N_bo'sh","N_bog' − N_bo'sh"], hint:"Bog'lovchi va bo'shashtiruvchi MO lardagi elektronlar farqi." },
    { q:"π-akseptor ligand (CO, CN⁻) Δ₀ ga qanday ta'sir qiladi?", a:"t₂g energiyasini pasaytiradi → Δ₀ ortadi", opts:["t₂g energiyasini oshiradi → Δ₀ kamayadi","t₂g energiyasini pasaytiradi → Δ₀ ortadi","Hech qanday ta'sir yo'q","e_g ga ta'sir qiladi"], hint:"Orqaga donorlik." },
    { q:"[Fe(CN)₆]⁴⁻ kompleksida HOMO va LUMO qaysilar?", a:"HOMO = t₂g, LUMO = e_g*", opts:["HOMO = e_g, LUMO = t₂g*","HOMO = t₂g, LUMO = e_g*","HOMO = a₁g, LUMO = t₁u","HOMO = t₁u, LUMO = a₁g*"], hint:"t₂g bog'lamaydigan, e_g* bo'shashtiruvchi." },
    { q:"Xyukkel usulida (HMO) benzolning π-elektron energiyasi necha β?", a:"8β", opts:["6β","8β","10β","12β"], hint:"E_π = 6α + 8β. β koeffitsiyenti = 8." },
    { q:"MO nazariyasining VB dan eng muhim afzalligi?", a:"Spektr va magnetizmni tushuntiradi", opts:["Geometriyani yaxshiroq bashorat qiladi","Oddiyroq","Spektr va magnetizmni tushuntiradi","Gibridlanishni ishlatmaydi"], hint:"VB bu borada zaif." },
    { q:"[PtCl₄]²⁻ kompleksida nechta valent elektron bor?", a:"16 e⁻ (d⁸)", opts:["18 e⁻ (d⁶)","16 e⁻ (d⁸)","14 e⁻ (d¹⁰)","20 e⁻"], hint:"Pt²⁺=5d⁸, 4×Cl⁻=8e⁻ → jami 16." },
    { q:"Sekulyar tenglamada H_{ij} = β_{ij} qanday nomlanadi?", a:"Rezonans integrali", opts:["Koulomb integrali","Rezonans integrali","Qoplanish integrali","Energiya integrali"], hint:"β — atomlar orasidagi ta'sir energiyasi." },
    { q:"O_h da σ-bog'lovchi MO larning IRREPS lari?", a:"A₁g + E_g + T₁u", opts:["T₂g + E_g","A₁g + T₁u","A₁g + E_g + T₁u","E_g + T₂g"], hint:"6 ta ligand σ = 6 ta MO → 3 xil IRREPS." },
  ]
  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) { return (
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "MO nazariyasini mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
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
export default function MONazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Kimyoviy bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-yellow-400">MO nazariyasi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-yellow-400 flex items-center gap-2"><span>🔄</span> Molekulyar orbitallar (MO) nazariyasi</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">LCAO • σ/π/δ MO • Oktaedrik MO diagramma • Bog' tartibi • Simmetriya • Test • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Molekulyar orbitallar nazariyasi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Molekulyar orbitallar (MO) nazariyasi</strong> — atom orbitallarining 
                chiziqli kombinatsiyasi (LCAO) orqali <strong>butun molekulani yaxlit</strong> ko'rib chiqadi. 
                VB nazariyasidan farqli ravishda, MO nazariyasi <strong className="text-cyan-300">spektr, magnetizm va energiyani</strong> 
                tushuntiradi. Kompleks birikmalarning <strong>elektron tuzilishi, rangi va spin holatini</strong> bashorat qilishda eng muhim vositadir.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">LCAO visual</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">MO diagramma</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Bog' tartibi</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-yellow-400 font-bold">🎯 Maqsad:</span> LCAO, MO turlari, oktaedrik MO diagramma, bog' tartibi va simmetriya asosida MO tahlilini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-yellow-400 font-bold">⏱️ Vaqt:</span> ~3 soat</p>
              <p className="text-purple-300"><span className="text-yellow-400 font-bold">📚 Manba:</span> Cotton — Chemical Applications of Group Theory; Albright — Orbital Interactions in Chemistry</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-yellow-300 font-mono text-xs font-bold">"MO — molekulalarning kvant mexanik portreti!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <LCAOCanvas />
        <MOTurlari />
        <OKtaedrikMODiagramma />
        <MatematikAsoslar />
        <BogTartibiHisoblagich />
        <SimmetriyaMOTahlili />
        <PiSimmetriyaMOTahlili />
        <AmaliyMisollar />
        <VBvsMOTaqqoslash />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestMO />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">MO nazariyasi</strong> — atom orbitallarining chiziqli kombinatsiyasi (LCAO): ψ_MO = Σcᵢ·φᵢ</li>
            <li><strong className="text-yellow-400">3 tur MO:</strong> σ-bog'lovchi (past energiya), σ*-bo'shashtiruvchi (yuqori), n-bog'lamaydigan (o'zgarmaydi)</li>
            <li><strong className="text-yellow-400">Bog' tartibi:</strong> BO = (N_bog' − N_bo'sh)/2. BO = 0 → barqaror emas. BO {'>'} 0 → barqaror</li>
            <li><strong className="text-yellow-400">Oktaedrik O_h:</strong> Metall: s→A₁g, p→T₁u, d→E_g+T₂g. Ligand σ→A₁g+E_g+T₁u. t₂g — bog'lamaydigan</li>
            <li><strong className="text-yellow-400">π-akseptor</strong> (CO, CN⁻) → t₂g↓ → Δ₀↑ (kuchli maydon, LS). <strong className="text-yellow-400">π-donor</strong> (Cl⁻) → t₂g↑ → Δ₀↓ (kuchsiz, HS)</li>
            <li><strong className="text-yellow-400">Sekulyar tenglama:</strong> det|H − ES| = 0 → E = α ± β. α — koulomb, β — rezonans integrali</li>
            <li>VB + MO = <strong className="text-cyan-300">to'liq tushunish.</strong> VB geometriya, MO spektr+magnetizm+energiya uchun</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/vb-nazariyasi"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> VB nazariyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-purple-600 hover:from-yellow-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-yellow-500/20">
            σ/π ligandlar <span>→</span>
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