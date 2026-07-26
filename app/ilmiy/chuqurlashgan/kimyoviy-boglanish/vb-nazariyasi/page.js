"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GIBRIDLANISH VIZUALIZATSIYASI — CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
function GibridlanishCanvas() {
  const [hybrid, setHybrid] = useState("sp")
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const hybrids = {
    sp: { name:"sp", ks:2, angle:"180°", geom:"Chiziqli", color:"#22c55e", desc:"1×s + 1×p → 2 ta sp orbital. Qarama-qarshi yo'nalgan.",
      atoms:[{a:0, l:[{x:0,y:-60}], r:[{x:0,y:60}]}], m:"[Ag(NH₃)₂]⁺" },
    sp2: { name:"sp²", ks:3, angle:"120°", geom:"Uchburchak", color:"#3b82f6", desc:"1×s + 2×p → 3 ta sp² orbital. Tekislikda 120°.",
      atoms:[{a:0, l:[{x:-52,y:30}], r:[{x:52,y:30},{x:0,y:-60}]}], m:"[Cu(CN)₃]²⁻" },
    sp3: { name:"sp³", ks:4, angle:"109.5°", geom:"Tetraedrik", color:"#a855f7", desc:"1×s + 3×p → 4 ta sp³ orbital. 3D tetraedr.",
      atoms:[{a:0, l:[{x:-45,y:-30},{x:45,y:-30}], r:[{x:-45,y:30},{x:45,y:30}]}], m:"[CoCl₄]²⁻" },
    dsp2: { name:"dsp²", ks:4, angle:"90°", geom:"Kvadrat planar", color:"#ec4899", desc:"1×d + 1×s + 2×p → 4 ta dsp². XY tekisligida.",
      atoms:[{a:0, l:[{x:0,y:-45}], r:[{x:0,y:45},{x:-45,y:0},{x:45,y:0}]}], m:"[PtCl₄]²⁻" },
    d2sp3: { name:"d²sp³", ks:6, angle:"90°", geom:"Oktaedrik (ichki)", color:"#f59e0b", desc:"2×d + 1×s + 3×p → 6 ta d²sp³. 3 o'qda.",
      atoms:[{a:0, l:[{x:0,y:-55},{x:-50,y:0}], r:[{x:0,y:55},{x:50,y:0},{x:-35,y:35},{x:35,y:-35}]}], m:"[Co(NH₃)₆]³⁺" },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2

    let phase = 0
    function draw() {
      phase += 0.02
      ctx.clearRect(0, 0, w, h)
      
      // Background gradient
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
      grd.addColorStop(0, "#1a0a2e")
      grd.addColorStop(1, "#0a0018")
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = "rgba(139,92,246,0.06)"
      ctx.lineWidth = 0.5
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(cx + i*40, 20); ctx.lineTo(cx + i*40, h-20); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(20, cy + i*40); ctx.lineTo(w-20, cy + i*40); ctx.stroke()
      }

      const d = hybrids[hybrid]
      const pulse = 1 + Math.sin(phase) * 0.06

      // Draw center atom
      const grad = ctx.createRadialGradient(cx-3, cy-3, 0, cx, cy, 18)
      grad.addColorStop(0, "#fbbf24")
      grad.addColorStop(1, "#d97706")
      ctx.beginPath(); ctx.arc(cx, cy, 14*pulse, 0, Math.PI*2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = "#fff"
      ctx.font = "bold 8px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("M", cx, cy+3)

      // Draw orbitals
      const allPoints = []
      if (d.atoms[0].l) d.atoms[0].l.forEach(p => allPoints.push(p))
      if (d.atoms[0].r) d.atoms[0].r.forEach(p => allPoints.push(p))

      allPoints.forEach((p, i) => {
        const angle = Math.atan2(p.y, p.x) + Math.sin(phase + i*1.5) * 0.08
        const dist = Math.sqrt(p.x*p.x + p.y*p.y)
        const ex = cx + Math.cos(angle) * dist
        const ey = cy + Math.sin(angle) * dist
        
        // Orbital lobe
        const lobeSize = 18 + 4 * (1 + Math.sin(phase + i*2)) * 0.5
        const grd2 = ctx.createRadialGradient(ex, ey, 0, ex, ey, lobeSize)
        grd2.addColorStop(0, d.color + "60")
        grd2.addColorStop(0.5, d.color + "30")
        grd2.addColorStop(1, d.color + "05")
        ctx.beginPath()
        ctx.ellipse(ex, ey, lobeSize * 1.1, lobeSize * 0.7, angle, 0, Math.PI*2)
        ctx.fillStyle = grd2
        ctx.fill()
        ctx.strokeStyle = d.color + "80"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Bond line
        ctx.strokeStyle = d.color + "40"
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke()
        ctx.setLineDash([])
      })

      // Labels
      ctx.fillStyle = "#a78bfa"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${d.name} gibridlanishi — ${d.geom} (${d.angle})`, cx, 18)

      ctx.fillStyle = d.color + "99"
      ctx.font = "9px sans-serif"
      ctx.fillText(d.desc, cx, 34)

      ctx.fillStyle = "#60a5fa"
      ctx.font = "9px sans-serif"
      ctx.fillText(`Misol: ${d.m}`, cx, h - 12)

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [hybrid])

  const list = Object.entries(hybrids)

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🎨</span> Gibridlanish vizualizatsiyasi — interaktiv Canvas
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {list.map(([k,v]) => (
          <button key={k} onClick={()=>setHybrid(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${hybrid===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={hybrid===k ? {background:v.color+"44", borderColor:v.color+"88"} : {}}>
            {v.name} (KN={v.ks})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={360} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className="font-mono font-bold" style={{color:hybrids[hybrid].color}}>{hybrids[hybrid].name}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Koordinatsion son:</span><span className="text-yellow-300 font-mono">{hybrids[hybrid].ks}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-cyan-300">{hybrids[hybrid].geom}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Bog' burchagi:</span><span className="text-green-300 font-mono">{hybrids[hybrid].angle}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Misol:</span><span className="text-pink-300 font-mono">{hybrids[hybrid].m}</span></div>
          <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-purple-200">{hybrids[hybrid].desc}</p>
          </div>
        </div>
      </div>

      <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-cyan-400 font-bold">⚡ Canvas pulsatsiyasi — orbital loblarining tebranishini ko'rsatadi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GIBRIDLANISH TO'LIQ JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function GibridlanishJadval() {
  const [sel, setSel] = useState(null)
  const rows = [
    { ks:2, g:"sp", a:"1×s + 1×p", b:"180°", geo:"Chiziqli", d:["s", "p_z"], ex:"[Ag(NH₃)₂]⁺, [Ag(CN)₂]⁻, [Cu(NH₃)₂]⁺", n:"2 ta sp orbital qarama-qarshi. σ-bog' uchun ideal.", e:"2×sp" },
    { ks:3, g:"sp²", a:"1×s + 2×p", b:"120°", geo:"Uchburchak", d:["s", "p_x", "p_y"], ex:"[Cu(CN)₃]²⁻, [HgI₃]⁻, [AuCl₃]", n:"3 ta sp² orbital XY tekisligida. 120° burchak.", e:"3×sp²" },
    { ks:4, g:"sp³", a:"1×s + 3×p", b:"109.5°", geo:"Tetraedrik", d:["s","p_x","p_y","p_z"], ex:"[Zn(OH)₄]²⁻, [CoCl₄]²⁻, [Ni(CO)₄]", n:"4 ta sp³ orbital 3D tetraedr. σ-bog'lar.", e:"4×sp³" },
    { ks:4, g:"dsp²", a:"1×d + 1×s + 2×p", b:"90°", geo:"Kvadrat planar", d:["d_{x²−y²}","s","p_x","p_y"], ex:"[Ni(CN)₄]²⁻, [PtCl₄]²⁻, [PdCl₄]²⁻", n:"4 ta dsp² XY tekisligida. d⁸ metallar.", e:"4×dsp²" },
    { ks:5, g:"sp³d", a:"1×s + 3×p + 1×d", b:"90°/120°", geo:"Trig. bipiramida", d:["s","p_x","p_y","p_z","d_{z²}"], ex:"[Fe(CO)₅], [Ni(CN)₅]³⁻, [CuCl₅]³⁻", n:"3 ekv (120°) + 2 aksial (90°). d⁷-d⁸.", e:"5×sp³d" },
    { ks:6, g:"d²sp³", a:"2×d + 1×s + 3×p", b:"90°", geo:"Oktaedrik (ichki)", d:["d_{z²}","d_{x²−y²}","s","p_x","p_y","p_z"], ex:"[Fe(CN)₆]⁴⁻, [Co(NH₃)₆]³⁺, [Cr(NH₃)₆]³⁺", n:"Ichki (n−1)d. Kuchli maydon. Quyi spin.", e:"6×d²sp³" },
    { ks:6, g:"sp³d²", a:"1×s + 3×p + 2×d", b:"90°", geo:"Oktaedrik (tashqi)", d:["s","p_x","p_y","p_z","d_{z²}","d_{x²−y²}"], ex:"[Fe(H₂O)₆]²⁺, [FeF₆]³⁻, [CoF₆]³⁻", n:"Tashqi nd. Kuchsiz maydon. Yuqori spin.", e:"6×sp³d²" },
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Gibridlanish turlari — to'liq ma'lumot jadvali
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 text-left text-amber-400">KS</th>
              <th className="p-1 text-left text-amber-400">Gibrid</th>
              <th className="p-1 text-left text-purple-300">Atom orbitallari</th>
              <th className="p-1 text-center text-purple-300">Burchak</th>
              <th className="p-1 text-left text-purple-300">Geometriya</th>
              <th className="p-1 text-left text-purple-300 hidden md:table-cell">Misol</th>
              <th className="p-1 text-center text-purple-300">Energiya</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}
                onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40 scale-[1.01]":"hover:bg-purple-800/30"}`}>
                <td className="p-1 font-bold text-white text-center">{r.ks}</td>
                <td className={`p-1 font-mono font-bold ${sel===i?"text-pink-300":"text-yellow-300"}`}>{r.g}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px] font-mono">{r.a}</td>
                <td className="p-1 text-center text-cyan-300 font-mono">{r.b}</td>
                <td className="p-1 text-purple-200">{r.geo}</td>
                <td className="p-1 text-purple-300 text-[7px] sm:text-[9px] font-mono hidden md:table-cell">{r.ex}</td>
                <td className="p-1 text-center text-green-300 font-mono">{r.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-3 text-xs mt-3 transition-all">
          <p className="text-yellow-400 font-bold">{rows[sel].g} — {rows[sel].geo}</p>
          <p className="text-purple-200 mt-1">{rows[sel].n}</p>
          <p className="text-purple-300 mt-1"><strong className="text-cyan-300">Ishtirok etgan AO:</strong> {rows[sel].d.join(", ")}</p>
        </div>
      )}

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ d²sp³ (ichki orbital) va sp³d² (tashqi orbital) — ligand maydon kuchiga qarab farqlanadi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ICHKI VA TASHQI ORBITAL — SIMMETRIYA TAHLLILI
// ═══════════════════════════════════════════════════════════════════════════════
function IchkiTashqiOrbital() {
  const [view, setView] = useState("inner")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2

    ctx.clearRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    // Energy levels
    const levels = view === "inner"
      ? [{l:"3d (t₂g)", y:cy-50, c:"#22c55e", w:80, txt:"t₂g⁶"},
         {l:"3d (e_g*)", y:cy-20, c:"#ef4444", w:80, txt:"e_g* (bo'sh)"},
         {l:"4s (a₁g)", y:cy+10, c:"#3b82f6", w:80, txt:"a₁g"},
         {l:"4p (t₁u)", y:cy+40, c:"#a855f7", w:80, txt:"t₁u"}]
      : [{l:"3d (t₂g)", y:cy-30, c:"#22c55e", w:80, txt:"t₂g⁴ e_g²"},
         {l:"4s", y:cy+5, c:"#3b82f6", w:80, txt:"4s"},
         {l:"4p", y:cy+40, c:"#a855f7", w:80, txt:"4p"},
         {l:"4d (tashqi)", y:cy+72, c:"#f59e0b", w:80, txt:"4d"}]

    // Center line
    ctx.strokeStyle = "rgba(139,92,246,0.2)"
    ctx.lineWidth = 1
    ctx.setLineDash([3,3])
    ctx.beginPath(); ctx.moveTo(cx-100, cy-80); ctx.lineTo(cx+100, cy-80); ctx.stroke()
    ctx.fillStyle = "#a78bfa60"; ctx.font = "8px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("Energiya ↑", cx+110, cy-76)
    ctx.beginPath(); ctx.moveTo(cx-100, cy+85); ctx.lineTo(cx+100, cy+85); ctx.stroke()

    levels.forEach((l,i) => {
      const rx = l.w, ry = 14
      ctx.beginPath()
      ctx.ellipse(cx, l.y, rx, ry, 0, 0, Math.PI*2)
      ctx.fillStyle = l.c + "30"
      ctx.fill()
      ctx.strokeStyle = l.c
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.fillStyle = l.c
      ctx.font = "bold 9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(l.txt, cx, l.y+3)
    })

    ctx.fillStyle = view === "inner" ? "#f59e0b" : "#60a5fa"
    ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText(view === "inner" ? "d²sp³ — Ichki orbital (kuchli maydon)" : "sp³d² — Tashqi orbital (kuchsiz maydon)", cx, 16)

    // Arrows
    ctx.strokeStyle = "#fbbf24"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx-90, cy-60)
    ctx.lineTo(cx-90, cy+60)
    ctx.stroke()
    ctx.fillStyle = "#fbbf24"
    ctx.font = "bold 9px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Δ₀", cx-90, cy+75)

  }, [view])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">🔄</span> d²sp³ (ichki) vs sp³d² (tashqi) — energiya tahlili
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("inner")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="inner"?"bg-amber-600/60 text-white border border-amber-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🟡 d²sp³ — Ichki orbital
        </button>
        <button onClick={()=>setView("outer")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="outer"?"bg-blue-600/60 text-white border border-blue-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔵 sp³d² — Tashqi orbital
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={300} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="space-y-2 text-xs">
          <div className={`rounded-lg p-3 border ${view==="inner"?"bg-amber-600/10 border-amber-500/30":"bg-blue-600/10 border-blue-500/30"}`}>
            <p className={`font-bold ${view==="inner"?"text-amber-400":"text-blue-400"}`}>
              {view==="inner" ? "d²sp³ — Ichki orbital komplekslar" : "sp³d² — Tashqi orbital komplekslar"}
            </p>
            <p className="text-purple-200 mt-1">{view==="inner"
              ? "(n−1)d, ns, np orbitallari ishtirok etadi. Kuchli maydon ligandlarida (CN⁻, CO, en). d-elektronlar juftlashadi → quyi spin (LS)."
              : "ns, np, nd orbitallari ishtirok etadi. Kuchsiz maydon ligandlarida (F⁻, Cl⁻, H₂O). d-elektronlar juftlashmaydi → yuqori spin (HS)."}</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className={view==="inner"?"text-amber-300 font-mono":"text-blue-300 font-mono"}>{view==="inner"?"d²sp³":"sp³d²"}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ishlatilgan d-orbital:</span><span className="text-cyan-300 font-mono">{view==="inner"?"(n−1)d":"nd"}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Ligand maydon:</span><span className={view==="inner"?"text-green-300":"text-orange-300"}>{view==="inner"?"Kuchli → LS":"Kuchsiz → HS"}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Magnit xossa:</span><span className={view==="inner"?"text-green-300":"text-red-300"}>{view==="inner"?"Diamagnit (μ=0)":"Paramagnit (μ>0)"}</span></div>
          </div>
        </div>
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs mt-3">
        <p className="text-purple-400 font-bold">Misol tahlili:</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-amber-600/10 border border-amber-500/30 rounded p-2">
            <p className="text-amber-300 font-mono font-bold">[Fe(CN)₆]⁴⁻ — d²sp³</p>
            <p className="text-purple-200">Fe²⁺ (3d⁶), CN⁻ (kuchli)</p>
            <p className="text-purple-200">6 d-e⁻ juftlashadi → μ=0</p>
            <p className="text-green-300">Diamagnit, quyi spin</p>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
            <p className="text-blue-300 font-mono font-bold">[Fe(H₂O)₆]²⁺ — sp³d²</p>
            <p className="text-purple-200">Fe²⁺ (3d⁶), H₂O (kuchsiz)</p>
            <p className="text-purple-200">6 d-e⁻ juftlashmaydi → μ≈4.9</p>
            <p className="text-red-300">Paramagnit, yuqori spin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. PAULING QOIDALARI — VB NAZARIYASI ASOSLARI
// ═══════════════════════════════════════════════════════════════════════════════
function PaulingQoidalari() {
  const [rule, setRule] = useState(0)
  const rules = [
    {t:"1. Gibridlanish prinsipi", d:"Markaziy atomning valent orbitallari aralashib, energetik jihatdan teng bo'lgan yangi gibrid orbitallarni hosil qiladi.",
      f:"ψ_hybrid = Σ c_i · ψ_i (AO). Gibrid orbitallar soni = qatnashgan AO lar soni.",
      m:"s + p → sp; s + 3p → sp³; d + s + 2p → dsp²", n:"Pauling: 'Gibrid orbitallar — atom orbitallarining chiziqli kombinatsiyasi.'" },
    {t:"2. Maksimal qoplanish prinsipi", d:"Bog' kuchi atom orbitallarining qoplanish darajasiga to'g'ri proporsional. Katta qoplanish → kuchli bog'.",
      f:"S = ∫ ψ_A · ψ_B dτ (qoplanish integrali). Bog' energiyasi E ∝ S.",
      m:"σ (head-on) > π (side-on) > δ (4-lobli)", n:"Qoplanish qancha katta → bog' shuncha kuchli." },
    {t:"3. Elektromanfiylik tenglashuvi", d:"Bog' hosil bo'lganda, atomlarning elektromanfiyliklari tenglashadi. Elektronegativ atom qisman manfiy zaryad oladi.",
      f:"χ_A − χ_B = 0.102 · √Δ (kJ/mol). Pauling elektromanfiylik shkalasi.",
      m:"H−F: χ=2.20,3.98 → Δχ=1.78 → qutbli", n:"Katta Δχ → ion bog', kichik Δχ → kovalent." },
    {t:"4. Rezonans (VB nazariyasida)", d:"Agar bir molekula bir nechta VB struktura bilan tasvirlansa, haqiqiy tuzilish ularning rezonans gibrididir.",
      f:"ψ_real = Σ c_k · ψ_k. Rezonans energiyasi = E_haqiqiy − E_eng_barqaror.",
      m:"CO₃²⁻: 3 ta rezonans struktura. Benzol: 2 ta Kekule strukturasi.", n:"Rezonans energiyasi molekulani qo'shimcha stabillashtiradi (30-150 kJ/mol)." },
  ]
  const r = rules[rule]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📐</span> Pauling qoidalari — VB nazariyasining asosiy tamoyillari
      </h3>

      <div className="flex gap-1 flex-wrap mb-3">
        {rules.map((_,i) => (
          <button key={i} onClick={()=>setRule(i)}
            className={`w-7 h-7 rounded-full text-[10px] font-bold transition-all ${rule===i?"bg-purple-600 text-white":"bg-purple-900/60 text-purple-500 hover:bg-purple-800"}`}>
            {i+1}
          </button>
        ))}
        <span className="text-purple-400 text-[10px] ml-1">Qoida {rule+1}/{rules.length}</span>
      </div>

      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs space-y-2">
        <p className="text-yellow-300 font-bold text-sm">{r.t}</p>
        <p className="text-purple-200 leading-relaxed">{r.d}</p>
        <div className="bg-purple-950/90 border border-purple-700/30 rounded p-2 text-center my-2">
          <p className="text-cyan-300 font-mono text-sm">{r.f}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-400">Misol:</span>
          <span className="text-green-300 font-mono">{r.m}</span>
        </div>
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5">
          <p className="text-yellow-400 font-bold">💡 {r.n}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {rule>0 && <button onClick={()=>setRule(p=>p-1)} className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-800/60 text-purple-200 hover:bg-purple-700/80">← Oldingi</button>}
        {rule<rules.length-1 && <button onClick={()=>setRule(p=>p+1)} className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-600 hover:bg-purple-500 text-white">Keyingi →</button>}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. PAULING ELEKTROMANFIYLIK SHKALASI
// ═══════════════════════════════════════════════════════════════════════════════
function PaulingElektromanfiylik() {
  const [sel, setSel] = useState(null)
  const elements = [
    {sym:"Cs", en:0.79, col:"#f59e0b", row:6, g:"Ishqoriy", note:"Eng past EN"},
    {sym:"K", en:0.82, col:"#eab308", row:4, g:"Ishqoriy", note:""},
    {sym:"Na", en:0.93, col:"#84cc16", row:3, g:"Ishqoriy", note:""},
    {sym:"Li", en:0.98, col:"#22c55e", row:2, g:"Ishqoriy", note:""},
    {sym:"Ca", en:1.00, col:"#14b8a6", row:4, g:"Ishqoriy yer", note:""},
    {sym:"Mg", en:1.31, col:"#06b6d4", row:3, g:"Ishqoriy yer", note:""},
    {sym:"Al", en:1.61, col:"#3b82f6", row:3, g:"Metall", note:""},
    {sym:"Fe", en:1.83, col:"#6366f1", row:4, g:"Metall", note:""},
    {sym:"Co", en:1.88, col:"#8b5cf6", row:4, g:"Metall", note:"Markaziy atom"},
    {sym:"Ni", en:1.91, col:"#a855f7", row:4, g:"Metall", note:""},
    {sym:"Cu", en:1.90, col:"#d946ef", row:4, g:"Metall", note:""},
    {sym:"Pt", en:2.28, col:"#ec4899", row:6, g:"Metall", note:""},
    {sym:"C", en:2.55, col:"#f43f5e", row:2, g:"Nometall", note:""},
    {sym:"S", en:2.58, col:"#e11d48", row:3, g:"Nometall", note:""},
    {sym:"N", en:3.04, col:"#be123c", row:2, g:"Nometall", note:""},
    {sym:"Cl", en:3.16, col:"#9f1239", row:3, g:"Galogen", note:""},
    {sym:"O", en:3.44, col:"#881337", row:2, g:"Nometall", note:""},
    {sym:"F", en:3.98, col:"#4c0519", row:2, g:"Galogen", note:"Eng yuqori EN"},
  ]

  const maxEN = 4.0

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-yellow-400">⚡</span> Pauling elektromanfiylik shkalasi — VB nazariyasida
      </h3>

      <div className="flex items-end gap-1 h-28 mb-3">
        {elements.map((el,i) => (
          <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer"
            onClick={()=>setSel(i)} onMouseEnter={()=>setSel(i)}>
            <div className="w-full rounded-t-lg transition-all group-hover:scale-105"
              style={{height:`${(el.en/maxEN)*100}%`, minHeight:"8px", background:el.col, opacity:sel===i?1:0.7}} />
            <div className={`text-[7px] sm:text-[9px] font-bold mt-1 ${sel===i?"text-white":"text-purple-400"}`}>{el.sym}</div>
            <div className="text-[6px] sm:text-[7px] text-purple-500">{el.en.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {sel !== null && (
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{elements[sel].sym} — {elements[sel].g}</p>
          <div className="flex justify-between"><span className="text-purple-400">Pauling EN:</span><span className="text-cyan-300 font-mono text-lg font-bold">{elements[sel].en.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Davr:</span><span className="text-purple-200">{elements[sel].row}-davr</span></div>
          {elements[sel].note && <p className="text-yellow-400 mt-1">💡 {elements[sel].note}</p>}
          {elements[sel].sym === "Co" && <p className="text-green-300">🔬 Kompleks birikmalarda eng keng tarqalgan markaziy atom!</p>}
        </div>
      )}

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-purple-400 font-bold">Pauling formulasida bog' qutbliligi:</p>
        <p className="text-yellow-300 font-mono text-center text-sm">Δχ = χ_A − χ_B  |  Bog' ionligi (%) = 16·Δχ + 3.5·(Δχ)²</p>
        <p className="text-purple-200 mt-1">Δχ {'<'} 0.4 → kovalent. 0.4 ≤ Δχ {'<'} 1.7 → qutbli kovalent. Δχ ≥ 1.7 → ion.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MATEMATIK ASOSLAR — VB NAZARIYASINING FORMULALARI
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar() {
  const [topic, setTopic] = useState("gibrid")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">📐</span> VB nazariyasining matematik asoslari
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {k:"gibrid", l:"Gibridlanish matritsasi"},
          {k:"qoplanish", l:"Qoplanish integrali"},
          {k:"bog", l:"Bog' energiyasi"},
          {k:"rezonans", l:"Rezonans"},
        ].map(v => (
          <button key={v.k} onClick={()=>setTopic(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${topic===v.k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.l}
          </button>
        ))}
      </div>

      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {topic === "gibrid" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Gibrid orbitalning matematik ifodasi:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">ψ_hyb = c₁·ψ_s + c₂·ψ_p + c₃·ψ_d + ...</p>
            <p className="text-purple-200">Normalizatsiya: c₁² + c₂² + c₃² = 1</p>
            <p className="text-purple-200">sp³ uchun: ψ₁ = (1/2)(ψ_s + ψ_px + ψ_py + ψ_pz)</p>
            <p className="text-purple-200">sp² uchun: ψ₁ = (1/√3)(ψ_s + √2·ψ_px)</p>
            <p className="text-purple-200">dsp² uchun: ψ₁ = (1/2)(ψ_s + ψ_px + ψ_py + ψ_d{'{'}x²−y²{'}'})</p>
            <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 Gibbsiz: orbitallar energetik jihatdan teng bo'lganda, gibridlanish optimal.</p>
            </div>
          </div>
        )}
        {topic === "qoplanish" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Qoplanish integrali (S):</p>
            <p className="text-cyan-300 text-center my-2 text-sm">S = ∫ ψ_A* · ψ_B dτ</p>
            <p className="text-purple-200">S = 0 → qoplanish yo'q (bog' hosil bo'lmaydi)</p>
            <p className="text-purple-200">S {'>'} 0 → bog'lovchi qoplanish (σ, π, δ)</p>
            <p className="text-purple-200">S {'<'} 0 → bo'shashtiruvchi qoplanish (σ*, π*, δ*)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Qoplanish darajasi:</strong> σ: S≈0.2-0.3 | π: S≈0.1-0.15 | δ: S≈0.05</p>
            <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 Katta S → kuchli bog'. σ eng kuchli (head-on), δ eng kuchsiz.</p>
            </div>
          </div>
        )}
        {topic === "bog" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">VB nazariyasida bog' energiyasi:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">E = E₀ + α·S + β·S²</p>
            <p className="text-purple-200">E₀ — atom orbitallarining o'rtacha energiyasi</p>
            <p className="text-purple-200">α — koulomb integrali (manfiy, ~1-5 eV)</p>
            <p className="text-purple-200">β — rezonans integrali (manfiy, ~0.5-3 eV)</p>
            <p className="text-purple-200">S — qoplanish integrali (0.05-0.3)</p>
            <p className="text-purple-200 mt-2">Heitler-London modeli (H₂): E = (Q±J)/(1±S²)</p>
            <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 Q — koulomb integrali. J — almashinish integrali (bog'ning manbai).</p>
            </div>
          </div>
        )}
        {topic === "rezonans" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Rezonans — VB nazariyasida:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">ψ_haqiqiy = Σ c_k · ψ_k</p>
            <p className="text-purple-200">ψ_k — k-elementar VB struktura</p>
            <p className="text-purple-200">c_k — rezonans koeffitsiyenti (c_k² — strukturaning hissasi)</p>
            <p className="text-purple-200">E_rezonans = E_haqiqiy − E_eng_barqaror_k</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Misol — CO₃²⁻:</strong> 3 ta ekvivalent VB struktura. Har biri 1/3 hissa qo'shadi.</p>
            <p className="text-purple-200">Benzol: 2 ta Kekule struktura. Rezonans energiyasi ≈ 150 kJ/mol.</p>
            <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
              <p className="text-yellow-400">💡 Rezonans → molekula barqarorlashadi (energiya kamayadi).</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. AMALIY MISOLLAR — KOMPLEKS TAHLILI
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    {name:"[Ag(NH₃)₂]⁺", k:"Ag⁺", d:"4d¹⁰", g:"sp", geo:"Chiziqli", b:"180°", mu:0, en:"Ag−N kuchli", note:"d¹⁰ → sp gibridlanish. 2 ta NH₃ ligand. Kumushning eng keng tarqalgan kompleksi."},
    {name:"[CoCl₄]²⁻", k:"Co²⁺", d:"3d⁷", g:"sp³", geo:"Tetraedrik", b:"109.5°", mu:3.87, en:"O'rtacha", note:"7 d-e⁻. Yuqori spin (HS). Paramagnit. 4 ta Cl⁻ tetraedr uchlarida."},
    {name:"[Ni(CN)₄]²⁻", k:"Ni²⁺", d:"3d⁸", g:"dsp²", geo:"Kv. planar", b:"90°", mu:0, en:"Kuchli", note:"d⁸ → dsp². CN⁻ kuchli maydon → d-e⁻ juftlashadi. Diamagnit. Ni²⁺ planar."},
    {name:"[PtCl₄]²⁻", k:"Pt²⁺", d:"5d⁸", g:"dsp²", geo:"Kv. planar", b:"90°", mu:0, en:"Kuchli", note:"d⁸ → dsp². Pt²⁺ (5d⁸) — anti-kanser dorilar. 16 e⁻, kvadrat-planar."},
    {name:"[Co(NH₃)₆]³⁺", k:"Co³⁺", d:"3d⁶", g:"d²sp³", geo:"Oktaedrik", b:"90°", mu:0, en:"Juda kuchli", note:"d⁶ LS. NH₃ kuchli maydon → d²sp³. Diamagnit. 18e⁻. Eng bardoshli kompleks."},
    {name:"[Fe(H₂O)₆]²⁺", k:"Fe²⁺", d:"3d⁶", g:"sp³d²", geo:"Oktaedrik", b:"90°", mu:4.9, en:"Kuchsiz", note:"d⁶ HS. H₂O kuchsiz maydon → sp³d². Paramagnit. 4 ta juftlanmagan e⁻."},
    {name:"[Fe(CN)₆]⁴⁻", k:"Fe²⁺", d:"3d⁶", g:"d²sp³", geo:"Oktaedrik", b:"90°", mu:0, en:"Juda kuchli", note:"d⁶ LS. CN⁻ kuchli maydon → d²sp³. Diamagnit. 0 juftlanmagan e⁻. Karbonil analogi."},
    {name:"[Fe(CO)₅]", k:"Fe(0)", d:"3d⁸", g:"sp³d", geo:"Trig. bipir.", b:"90/120°", mu:0, en:"Kuchli", note:"Fe(0) → d⁸. sp³d gibridlanish. 5 ta CO. 18 e⁻. Diamagnit."},
  ]
  const m = misollar[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">🧪</span> Amaliy misollar — VB bo'yicha kompleks tahlili
      </h3>

      <div className="flex gap-1 flex-wrap mb-3">
        {misollar.map((m,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {m.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 text-xs space-y-2">
          <p className="text-yellow-300 font-bold text-sm">{m.name}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">Markaziy atom:</span><span className="text-cyan-300 font-mono">{m.k} ({m.d})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className="text-green-300 font-mono font-bold">{m.g}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-amber-300">{m.geo} ({m.b})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Magnit moment:</span><span className={m.mu===0?"text-green-300 font-mono":"text-red-300 font-mono"}>{m.mu===0?"0 (diamagnit)":`${m.mu} μ_B (paramagnit)`}</span></div>
          </div>
          <p className="text-purple-200">{m.note}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">VB tahlili:</p>
          <p className="text-purple-200">{m.k} ({m.d}): {m.d.includes("d¹⁰") ? "to'lgan d-qavat → sp" : 
            m.d.includes("d⁷") ? "7 d-e⁻ → sp³ (yuqori spin)" :
            m.d.includes("d⁸") ? "8 d-e⁻ → " + (m.g==="dsp²"?"dsp² (kv. planar, diamagnit)":"sp³d (t.bipiramida)") :
            "6 d-e⁻ → " + (m.g==="d²sp³"?"d²sp³ (kuchli maydon, LS)":"sp³d² (kuchsiz maydon, HS)")}</p>
          <p className="text-purple-200">VB bo'yicha: {m.g} → {m.geo}. {m.mu===0?"Juftlashgan elektronlar → diamagnit.":"Juftlanmagan elektronlar → paramagnit."}</p>
          <p className="text-purple-200">Ligand: {["NH₃","Cl⁻","CN⁻","Cl⁻","NH₃","H₂O","CN⁻","CO"][sel]} → {["kuchsiz","kuchsiz","kuchli","kuchli","kuchli","kuchsiz","kuchli","kuchli"][sel]} maydon.</p>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. AFZALLIK VA KAMCHILIK — VB NAZARIYASI
// ═══════════════════════════════════════════════════════════════════════════════
function AfzallikKamchilik() {
  const [view, setView] = useState("pros")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">⚖️</span> VB nazariyasining bahosi — afzallik va kamchiliklar
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("pros")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="pros"?"bg-green-600/60 text-white border border-green-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          ✅ Afzalliklar
        </button>
        <button onClick={()=>setView("cons")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="cons"?"bg-red-600/60 text-white border border-red-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          ❌ Kamchiliklar
        </button>
        <button onClick={()=>setView("comparison")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="comparison"?"bg-purple-600/60 text-white border border-purple-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          📊 VB vs MO to'liq
        </button>
      </div>

      {view === "pros" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {t:"Geometriya bashorati", d:"Gibridlanish orqali molekula geometriyasini aniq bashorat qiladi. sp→chiziqli, sp³→tetraedrik, d²sp³→oktaedrik."},
            {t:"Oddiy va vizual", d:"Talabalar uchun tushunarli. Orbital qoplanishini vizual tasavvur qilish oson."},
            {t:"Gibridlanish tushunchasi", d:"Gibrid orbitallar — kimyoviy bog'lanishni tushunish uchun kuchli vosita."},
            {t:"Ichki/tashqi orbital", d:"Kuchli va kuchsiz maydon ligandlarini farqlaydi (d²sp³ vs sp³d²)."},
            {t:"Rezonans", d:"Bir nechta VB struktura orqali delokalizatsiyalangan bog'larni tushuntiradi."},
            {t:"Pauling qoidalari", d:"Maksimal qoplanish, elektromanfiylik tenglashuvi — foydali empirik qoidalar."},
          ].map((r,i)=>(
            <div key={i} className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-xs">
              <p className="text-green-400 font-bold">{r.t}</p>
              <p className="text-purple-200 mt-1">{r.d}</p>
            </div>
          ))}
        </div>
      )}

      {view === "cons" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {t:"Rangni tushuntirmaydi", d:"Komplekslarning rangini (d-d o'tish) tushuntira olmaydi. MO/Kristall maydon kerak."},
            {t:"Magnit xossalar", d:"Spin holatini oldindan aytib berolmaydi. Faqat ichki/tashqi orqali bilvosita."},
            {t:"Spektrlar", d:"IQ, Raman, elektron spektrlarni izohlamaydi. MO nazariyasi bu borada kuchli."},
            {t:"Energiyani hisoblamaydi", d:"Δ₀ (ajralish energiyasi) ni hisoblab bera olmaydi. MO/ligand maydon kerak."},
            {t:"Delokalizatsiya", d:"Delokalizatsiyalangan elektronlarni (π-sistema) ifodalash qiyin. Rezonans — sun'iy."},
            {t:"Kompyuter hisobi", d:"MO bilan solishtirganda, zamonaviy kvant-kimyoviy hisoblarda kam qo'llaniladi."},
          ].map((r,i)=>(
            <div key={i} className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-xs">
              <p className="text-red-400 font-bold">{r.t}</p>
              <p className="text-purple-200 mt-1">{r.d}</p>
            </div>
          ))}
        </div>
      )}

      {view === "comparison" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-1.5 text-left text-amber-400">Xususiyat</th>
                <th className="p-1.5 text-left text-green-400">VB</th>
                <th className="p-1.5 text-left text-blue-400">MO</th>
                <th className="p-1.5 text-left text-purple-300">Izoh</th>
              </tr>
            </thead>
            <tbody>
              {[
                {x:"Geometriya", vb:"A'lo", mo:"Bilvosita", i:"VB gibridlanish orqali to'g'ridan-to'g'ri bashorat qiladi"},
                {x:"Spektr (d-d)", vb:"Yo'q", mo:"A'lo", i:"MO Δ₀ ni tushuntiradi, nima uchun rang bor"},
                {x:"Magnetizm", vb:"Zaif", mo:"A'lo", i:"MO yuqori/past spinni to'liq tushuntiradi"},
                {x:"Delokalizatsiya", vb:"Rezonans", mo:"Tabiiy", i:"MO da delokalizatsiya — asosiy xususiyat"},
                {x:"3D vizual", vb:"Oson", mo:"Murakkab", i:"VB orbitallarni chizish osonroq"},
                {x:"Hisoblash", vb:"Kam", mo:"Ko'p", i:"Zamonaviy dasturlar MO/DFT asosida"},
                {x:"Komplekslar", vb:"Geometriya", mo:"Spektr+Energetika", i:"Ikkalasi bir-birini to'ldiradi"},
              ].map((r,i)=>(
                <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className="p-1.5 font-bold text-yellow-300">{r.x}</td>
                  <td className="p-1.5 text-green-200">{r.vb}</td>
                  <td className="p-1.5 text-blue-200">{r.mo}</td>
                  <td className="p-1.5 text-purple-300 text-[8px] sm:text-[10px]">{r.i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function TestVB() {
  const questions = [
    { q:"Oktaedrik geometriya uchun qanday gibridlanish kerak?", a:"d²sp³ yoki sp³d²", opts:["sp³","dsp²","d²sp³ yoki sp³d²","sp³d"], hint:"6 ta ligand → 6 ta gibrid orbital. d²sp³ (ichki) yoki sp³d² (tashqi)." },
    { q:"d²sp³ va sp³d² gibridlanishlari orasidagi asosiy farq?", a:"Ishlatilgan d-orbital: (n−1)d vs nd", opts:["Bog' burchagi","Ishlatilgan d-orbital: (n−1)d vs nd","Ligandlar soni","Geometriya"], hint:"Ichki (n−1)d → kuchli maydon. Tashqi nd → kuchsiz maydon." },
    { q:"[Ni(CN)₄]²⁻ kompleksidagi gibridlanish turi?", a:"dsp² (kvadrat planar)", opts:["sp³ (tetraedrik)","dsp² (kvadrat planar)","d²sp³ (oktaedrik)","sp (chiziqli)"], hint:"Ni²⁺ (3d⁸). CN⁻ kuchli maydon. 4 ta ligand. Geometriya?" },
    { q:"Paulingning maksimal qoplanish prinsipi nima deydi?", a:"Bog' kuchi qoplanish darajasiga proporsional", opts:["Bog' uzunligi minimal","Bog' kuchi qoplanish darajasiga proporsional","Barcha orbitallar teng","Gibridlanish shart emas"], hint:"S katta → E katta." },
    { q:"VB nazariyasining eng asosiy kamchiligi?", a:"Rang va spektrlarni tushuntirmaydi", opts:["Geometriyani bashorat qilmaydi","Rang va spektrlarni tushuntirmaydi","Gibridlanishni ishlatmaydi","Faqat organik molekulalar uchun"], hint:"MO bu borada kuchli." },
    { q:"[Fe(CN)₆]⁴⁻ kompleksidagi gibridlanish va magnit xossa?", a:"d²sp³, diamagnit (μ=0)", opts:["sp³d², paramagnit","d²sp³, diamagnit (μ=0)","sp³, paramagnit","dsp², diamagnit"], hint:"Fe²⁺ + 6CN⁻ (kuchli maydon) → LS d⁶." },
    { q:"Qaysi gibridlanish 109.5° bog' burchagiga ega?", a:"sp³ (tetraedrik)", opts:["sp (180°)","sp² (120°)","sp³ (tetraedrik)","dsp² (90°)"], hint:"Tetraedr burchagi." },
    { q:"Pauling elektromanfiylik shkalasida eng yuqori EN qaysi element?", a:"F (3.98)", opts:["O (3.44)","Cl (3.16)","F (3.98)","N (3.04)"], hint:"Eng elektromanfiy element." },
    { q:"VB nazariyasida rezonans nima?", a:"Bir nechta VB strukturalarning chiziqli kombinatsiyasi", opts:["Atomlarning tebranishi","Bir nechta VB strukturalarning chiziqli kombinatsiyasi","Elektronlarning harakati","Ion bog'ning bir turi"], hint:"ψ_real = Σ c_k·ψ_k" },
    { q:"[Fe(CO)₅] kompleksidagi gibridlanish va geometriya?", a:"sp³d, trigonal bipiramida", opts:["d²sp³, oktaedrik","sp³d, trigonal bipiramida","sp³, tetraedrik","dsp², kvadrat planar"], hint:"Fe(0) (3d⁸). 5 ta CO. 18 e⁻." },
  ]

  const [c, setC] = useState(0)
  const [s, setS] = useState(null)
  const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false)
  const [ans, setAns] = useState({})
  const q = questions[c]

  if (res) {
    return (
      <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
          <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "VB nazariyasini mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
          <button onClick={() => { setC(0); setS(null); setSc(0); setRes(false); setAns({}) }} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !s && (() => {
              setS(opt); const ok = opt === q.a; if (ok && !ans[c]) setSc(p => p+1); setAns(p => ({...p, [c]: ok}))
            })()}
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
export default function VBNazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Kimyoviy bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-green-400">VB nazariyasi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-green-400 flex items-center gap-2"><span>📐</span> Valent bog'lanish (VB) nazariyasi</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Gibridlanish • Pauling qoidalari • Ichki/tashqi orbital • 18 e- qoidasi • Amaliy misollar • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Valent bog'lanish nazariyasi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Valent bog'lanish (VB) nazariyasi</strong> — kimyoviy bog'lanishni <strong>atom orbitallarining qoplashishi</strong> orqali 
                tushuntiradi. Linus Pauling tomonidan ishlab chiqilgan bu nazariya <strong className="text-green-300">gibridlanish</strong> tushunchasi orqali 
                kompleks birikmalarning <strong>geometriyasini</strong> bashorat qiladi. Bugungi kunda MO nazariyasi bilan birgalikda qo'llaniladi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">7 gibridlanish</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">Pauling qoidalari</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">Canvas vizual</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-green-400 font-bold">🎯 Maqsad:</span> VB nazariyasi, gibridlanish turlari, Pauling qoidalari va amaliy qo'llanishini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">⏱️ Vaqt:</span> ~2.5 soat</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">📚 Manba:</span> L. Pauling — Nature of the Chemical Bond; Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-green-300 font-mono text-xs font-bold">"Kimyoviy bog' — atom orbitallarining qo'shig'i!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <GibridlanishCanvas />
        <GibridlanishJadval />
        <IchkiTashqiOrbital />
        <PaulingQoidalari />
        <PaulingElektromanfiylik />
        <MatematikAsoslar />
        <AmaliyMisollar />
        <AfzallikKamchilik />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestVB />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">VB nazariyasi</strong> — atom orbitallarining qoplanishi orqali kimyoviy bog'lanishni tushuntiradi</li>
            <li><strong className="text-yellow-400">Gibridlanish</strong> — orbitallarning aralashishi natijasida yangi, energetik jihatdan teng orbitallar hosil bo'ladi</li>
            <li><strong className="text-yellow-400">7 tur:</strong> sp (180°), sp² (120°), sp³ (109.5°), dsp² (90°), sp³d (90/120°), d²sp³ (90°), sp³d² (90°)</li>
            <li><strong className="text-yellow-400">d²sp³ (ichki)</strong> — (n−1)d → kuchli maydon, LS, diamagnit. <strong className="text-yellow-400">sp³d² (tashqi)</strong> — nd → kuchsiz maydon, HS, paramagnit</li>
            <li><strong className="text-yellow-400">Pauling qoidalari:</strong> gibridlanish, maksimal qoplanish (S↑ → E↑), elektromanfiylik tenglashuvi, rezonans</li>
            <li><strong className="text-yellow-400">Afzalliklari:</strong> geometriyani aniq bashorat qiladi, oddiy, vizual. <strong className="text-yellow-400">Kamchiliklari:</strong> spektr, rang, magnetizmni tushuntirmaydi</li>
            <li><strong className="text-yellow-400">Pauling EN</strong> — komplekslarda bog' qutbliligini baholash. Δχ {'<'} 0.4 kovalent, Δχ ≥ 1.7 ion</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Kimyoviy bog'lanish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-500/20">
            MO nazariyasi <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> L. Pauling — Nature of the Chemical Bond; F.A. Cotton — Chemical Applications of Group Theory</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}