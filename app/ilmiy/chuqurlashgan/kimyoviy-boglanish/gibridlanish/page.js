"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. GIBRIDLANISH VIZUALIZATSIYASI — CANVAS (3D STYLE)
// ═══════════════════════════════════════════════════════════════════════════════
function GibridlanishCanvas() {
  const [hybrid, setHybrid] = useState("sp")
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const hybrids = {
    sp: { name:"sp", ks:2, angle:"180°", geom:"Chiziqli", sym:"D∞h", color:"#3b82f6",
      desc:"1×s + 1×p → 2 ta sp orbital. Qarama-qarshi yo'nalgan (180°). σ-bog' uchun ideal.",
      lobes:[{x:0,y:-65},{x:0,y:65}], m:"[Ag(NH₃)₂]⁺" },
    sp2: { name:"sp²", ks:3, angle:"120°", geom:"Uchburchak", sym:"D₃h", color:"#22c55e",
      desc:"1×s + 2×p → 3 ta sp² orbital. Tekislikda 120° burchak.",
      lobes:[{x:-56,y:32},{x:56,y:32},{x:0,y:-64}], m:"[Cu(CN)₃]²⁻" },
    sp3: { name:"sp³", ks:4, angle:"109.5°", geom:"Tetraedrik", sym:"Td", color:"#a855f7",
      desc:"1×s + 3×p → 4 ta sp³ orbital. 3D tetraedr. Eng keng tarqalgan.",
      lobes:[{x:-50,y:-35},{x:50,y:-35},{x:-50,y:35},{x:50,y:35}], m:"[CoCl₄]²⁻" },
    dsp2: { name:"dsp²", ks:4, angle:"90°", geom:"Kvadrat planar", sym:"D₄h", color:"#ec4899",
      desc:"1×d + 1×s + 2×p → 4 ta dsp². XY tekisligida. d⁸ metallar.",
      lobes:[{x:-50,y:0},{x:50,y:0},{x:0,y:-50},{x:0,y:50}], m:"[PtCl₄]²⁻" },
    d2sp3: { name:"d²sp³", ks:6, angle:"90°", geom:"Oktaedrik", sym:"Oh", color:"#f59e0b",
      desc:"2×d + 1×s + 3×p → 6 ta d²sp³. 3 o'q bo'ylab. Ichki orbital.",
      lobes:[{x:0,y:-60},{x:0,y:60},{x:-55,y:0},{x:55,y:0},{x:-30,y:35},{x:30,y:-35}], m:"[Co(NH₃)₆]³⁺" },
    sp3d: { name:"sp³d", ks:5, angle:"90/120°", geom:"Trig. bipiramida", sym:"D₃h", color:"#06b6d4",
      desc:"1×s + 3×p + 1×d → 5 ta. 3 ekv. (120°) + 2 aks. (90°).",
      lobes:[{x:0,y:-55},{x:0,y:55},{x:-50,y:30},{x:50,y:30},{x:0,y:-65}], m:"[Fe(CO)₅]" },
  }

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    let t = 0
    function draw() {
      t += 0.025
      ctx.clearRect(0, 0, w, h)
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130)
      grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
      ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

      // Grid
      ctx.strokeStyle = "rgba(139,92,246,0.04)"; ctx.lineWidth = 0.5
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath(); ctx.moveTo(cx+i*35, 15); ctx.lineTo(cx+i*35, h-15); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(15, cy+i*35); ctx.lineTo(w-15, cy+i*35); ctx.stroke()
      }

      const d = hybrids[hybrid]
      const pulse = 1 + Math.sin(t) * 0.07

      // Central atom
      const mg = ctx.createRadialGradient(cx-3, cy-3, 0, cx, cy, 16*pulse)
      mg.addColorStop(0, "#fbbf24"); mg.addColorStop(1, "#d97706")
      ctx.beginPath(); ctx.arc(cx, cy, 14*pulse, 0, Math.PI*2)
      ctx.fillStyle = mg; ctx.fill()
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
      ctx.fillText("M", cx, cy+3)

      // Lobes
      d.lobes.forEach((p, i) => {
        const angle = Math.atan2(p.y, p.x) + Math.sin(t + i*1.2) * 0.05
        const dist = Math.sqrt(p.x*p.x + p.y*p.y)
        const ex = cx + Math.cos(angle) * dist
        const ey = cy + Math.sin(angle) * dist

        const lobeSize = 16 + 3 * (1 + Math.sin(t + i*1.5)) * 0.5
        const lg = ctx.createRadialGradient(ex, ey, 0, ex, ey, lobeSize)
        lg.addColorStop(0, d.color + "70")
        lg.addColorStop(0.5, d.color + "35")
        lg.addColorStop(1, d.color + "05")
        ctx.beginPath()
        ctx.ellipse(ex, ey, lobeSize*1.1, lobeSize*0.65, angle, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill()
        ctx.strokeStyle = d.color + "90"; ctx.lineWidth = 1.5; ctx.stroke()

        // Bond line
        ctx.strokeStyle = d.color + "35"; ctx.lineWidth = 2; ctx.setLineDash([3,4])
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke()
        ctx.setLineDash([])
      })

      // Labels
      ctx.fillStyle = "#a78bfa"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(`${d.name} — ${d.geom} (${d.angle})`, cx, 18)
      ctx.fillStyle = d.color + "99"; ctx.font = "8px sans-serif"
      ctx.fillText(d.desc, cx, 34)
      ctx.fillStyle = "#60a5fa"; ctx.font = "9px sans-serif"
      ctx.fillText(`Misol: ${d.m} | Simmetriya: ${d.sym}`, cx, h-12)

      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [hybrid])

  const list = Object.entries(hybrids)

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🎨</span> Gibridlanish vizualizatsiyasi — interaktiv 3D Canvas
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
          <div className="flex justify-between"><span className="text-purple-400">Gibrid:</span><span className="font-mono font-bold" style={{color:hybrids[hybrid].color}}>{hybrids[hybrid].name}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">KS:</span><span className="text-yellow-300 font-mono">{hybrids[hybrid].ks}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-cyan-300">{hybrids[hybrid].geom}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Burchak:</span><span className="text-green-300 font-mono">{hybrids[hybrid].angle}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Simmetriya:</span><span className="text-pink-300 font-mono">{hybrids[hybrid].sym}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Misol:</span><span className="text-cyan-300 font-mono">{hybrids[hybrid].m}</span></div>
          <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-purple-200">{hybrids[hybrid].desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GIBRIDLANISH TO'LIQ JADVALI — 10 TUR
// ═══════════════════════════════════════════════════════════════════════════════
function GibridlanishJadval() {
  const [sel, setSel] = useState(null)
  const rows = [
    {ks:2, g:"sp", ao:"s + p", b:"180°", geo:"Chiziqli", sym:"D∞h", ex:"[Ag(NH₃)₂]⁺, [Ag(CN)₂]⁻, [CuCl₂]⁻", n:"2 ta sp orbital qarama-qarshi. σ-bog' uchun ideal. d¹⁰ metallar (Cu⁺, Ag⁺, Au⁺).", spin:"d¹⁰", e:"2×sp"},
    {ks:3, g:"sp²", ao:"s + p_x + p_y", b:"120°", geo:"Uchburchak", sym:"D₃h", ex:"[Cu(CN)₃]²⁻, [HgI₃]⁻, [AuCl₃]", n:"3 ta sp² XY tekisligida. 120°. d¹⁰ metallar.", spin:"d¹⁰", e:"3×sp²"},
    {ks:4, g:"sp³", ao:"s + 3p", b:"109.5°", geo:"Tetraedrik", sym:"Td", ex:"[Zn(OH)₄]²⁻, [CoCl₄]²⁻, [Ni(CO)₄]", n:"4 ta sp³ 3D tetraedr. d¹⁰ yoki d⁷ HS.", spin:"d¹⁰/d⁷ HS", e:"4×sp³"},
    {ks:4, g:"dsp²", ao:"d_x²−y² + s + p_x + p_y", b:"90°", geo:"Kvadrat planar", sym:"D₄h", ex:"[Ni(CN)₄]²⁻, [PtCl₄]²⁻, [PdCl₄]²⁻", n:"4 ta dsp² XY tekisligida. d⁸ metallar. 16 e⁻.", spin:"d⁸", e:"4×dsp²"},
    {ks:5, g:"sp³d", ao:"s + 3p + d_z²", b:"90°/120°", geo:"Trig. bipiramida", sym:"D₃h", ex:"[Fe(CO)₅], [Ni(CN)₅]³⁻, [CuCl₅]³⁻", n:"3 ekv (120°) + 2 aks (90°). d⁷-d⁸.", spin:"d⁷-d⁸", e:"5×sp³d"},
    {ks:5, g:"sp³d", ao:"s + 3p + d_z²", b:"~90°", geo:"Kvadrat piramida", sym:"C₄v", ex:"[VO(acac)₂], [Ni(CN)₅]³⁻", n:"1 aksial + 4 bazal. d¹-d⁹. C₄v.", spin:"d¹-d⁹", e:"5×sp³d"},
    {ks:6, g:"d²sp³", ao:"2d + s + 3p", b:"90°", geo:"Oktaedrik (ichki)", sym:"Oh", ex:"[Fe(CN)₆]⁴⁻, [Co(NH₃)₆]³⁺, [Cr(NH₃)₆]³⁺", n:"Ichki (n−1)d. Kuchli maydon. LS. 18 e⁻.", spin:"d⁶ LS", e:"6×d²sp³"},
    {ks:6, g:"sp³d²", ao:"s + 3p + 2d", b:"90°", geo:"Oktaedrik (tashqi)", sym:"Oh", ex:"[Fe(H₂O)₆]²⁺, [FeF₆]³⁻, [CoF₆]³⁻", n:"Tashqi nd. Kuchsiz maydon. HS.", spin:"d⁶ HS", e:"6×sp³d²"},
    {ks:7, g:"sp³d³", ao:"s + 3p + 3d", b:"72°/90°", geo:"Pent. bipiramida", sym:"D₅h", ex:"[V(CN)₇]⁴⁻, [ZrF₇]³⁻", n:"7 ta ligand. 5 ekv + 2 aks.", spin:"d¹-d³", e:"7×sp³d³"},
    {ks:8, g:"sp³d⁴", ao:"s + 3p + 4d", b:"—", geo:"Dodekaedrik", sym:"D₂d", ex:"[Mo(CN)₈]⁴⁻, [W(CN)₈]³⁻", n:"8 ta ligand. 2 ta o'zaro perpendikulyar trapetsiya.", spin:"d²-d⁴", e:"8×sp³d⁴"},
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Gibridlanish va geometriya — to'liq ma'lumot jadvali
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[7px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">KS</th>
            <th className="p-1 text-left text-amber-400">Gibrid</th>
            <th className="p-1 text-left text-purple-300">AO</th>
            <th className="p-1 text-center text-purple-300">Burchak</th>
            <th className="p-1 text-left text-purple-300">Geometriya</th>
            <th className="p-1 text-left text-purple-300">Sim.</th>
            <th className="p-1 text-left text-purple-300 hidden md:table-cell">Misol</th>
            <th className="p-1 text-center text-purple-300">Energiya</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40 scale-[1.01]":"hover:bg-purple-800/30"}`}>
                <td className="p-1 font-bold text-white text-center">{r.ks}</td>
                <td className={`p-1 font-mono font-bold ${sel===i?"text-pink-300":"text-yellow-300"}`}>{r.g}</td>
                <td className="p-1 text-purple-200 text-[6px] sm:text-[8px] font-mono">{r.ao}</td>
                <td className="p-1 text-center text-cyan-300 font-mono">{r.b}</td>
                <td className="p-1 text-purple-200">{r.geo}</td>
                <td className="p-1 text-purple-300 font-mono text-[9px]">{r.sym}</td>
                <td className="p-1 text-purple-300 text-[6px] sm:text-[8px] font-mono hidden md:table-cell">{r.ex}</td>
                <td className="p-1 text-center text-green-300 font-mono">{r.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-3 text-xs mt-3">
          <p className="text-yellow-400 font-bold">{rows[sel].g} — {rows[sel].geo} ({rows[sel].sym})</p>
          <p className="text-purple-200 mt-1">{rows[sel].n}</p>
          <p className="text-purple-300 mt-0.5"><strong className="text-cyan-300">Spin:</strong> {rows[sel].spin}</p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. d²sp³ vs sp³d² — ENERGIYA DIAGRAMMASI (CANVAS)
// ═══════════════════════════════════════════════════════════════════════════════
function IchkiTashqiEnergiya() {
  const [view, setView] = useState("inner")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    const isInner = view === "inner"
    ctx.fillStyle = "#a78bfa"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center"
    ctx.fillText(isInner ? "d²sp³ (ichki orbital) — kuchli maydon" : "sp³d² (tashqi orbital) — kuchsiz maydon", cx, 16)

    // Energy axis
    ctx.strokeStyle = "rgba(139,92,246,0.2)"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx+95, cy-65); ctx.lineTo(cx+95, cy+70); ctx.stroke()
    ctx.fillStyle = "rgba(139,92,246,0.3)"; ctx.font = "7px sans-serif"
    ctx.fillText("E ↑", cx+105, cy-60)

    // d-orbital levels
    const levels = isInner
      ? [{l:"(n−1)d (t₂g)", y:cy-30, c:"#22c55e", w:70, txt:"t₂g⁶ (LS)"},
         {l:"(n−1)d (e_g*)", y:cy+5, c:"#ef4444", w:70, txt:"e_g* (bo'sh)"},
         {l:"ns (a₁g)", y:cy+35, c:"#3b82f6", w:60, txt:"ns"},
         {l:"np (t₁u)", y:cy+60, c:"#a855f7", w:60, txt:"np"}]
      : [{l:"(n−1)d (t₂g+e_g)", y:cy-15, c:"#22c55e", w:75, txt:"t₂g⁴ e_g² (HS)"},
         {l:"ns", y:cy+20, c:"#3b82f6", w:60, txt:"ns"},
         {l:"np", y:cy+50, c:"#a855f7", w:60, txt:"np"},
         {l:"nd (tashqi)", y:cy+75, c:"#f59e0b", w:60, txt:"nd"}]

    levels.forEach(l => {
      ctx.strokeStyle = l.c; ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(cx-35, l.y); ctx.lineTo(cx+35, l.y); ctx.stroke()
      ctx.fillStyle = l.c; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "left"
      ctx.fillText(l.txt, cx+38, l.y+2.5)
    })

    // Δ₀ arrow
    if (isInner) {
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(cx-50, cy-30); ctx.lineTo(cx-50, cy+5); ctx.stroke()
      ctx.fillStyle = "#fbbf24"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "right"
      ctx.fillText("Δ₀ (katta)", cx-53, cy-14)
    }

    // Left labels
    ctx.fillStyle = "#60a5fa"; ctx.font = "7px sans-serif"; ctx.textAlign = "left"
    ctx.fillText("Energiya", cx-90, cy-62)
    ctx.fillStyle = "rgba(139,92,246,0.2)"; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(cx-95, cy-60); ctx.lineTo(cx-95, cy+65); ctx.stroke()

    // Bottom info
    ctx.fillStyle = "#a78bfa80"; ctx.font = "7px sans-serif"; ctx.textAlign = "center"
    ctx.fillText(isInner ? "Kuchli maydon (CN⁻, CO, NH₃)" : "Kuchsiz maydon (F⁻, Cl⁻, H₂O)", cx, h-12)
  }, [view])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">🔄</span> d²sp³ vs sp³d² — energiya diagrammasi
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("inner")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="inner"?"bg-amber-600/60 text-white border border-amber-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🟡 d²sp³ — Ichki orbital (LS)
        </button>
        <button onClick={()=>setView("outer")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="outer"?"bg-blue-600/60 text-white border border-blue-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔵 sp³d² — Tashqi orbital (HS)
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={300} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="space-y-2 text-xs">
          <div className={`rounded-lg p-3 border ${view==="inner"?"bg-amber-600/10 border-amber-500/30":"bg-blue-600/10 border-blue-500/30"}`}>
            <p className={`font-bold ${view==="inner"?"text-amber-400":"text-blue-400"}`}>
              {view==="inner" ? "d²sp³ — Ichki orbital" : "sp³d² — Tashqi orbital"}
            </p>
            <p className="text-purple-200 mt-1">{view==="inner"
              ? "(n−1)d, ns, np orbitallari. Kuchli ligand (CN⁻, CO). d-e⁻ juftlashadi → LS. Diamagnit."
              : "ns, np, nd orbitallari. Kuchsiz ligand (F⁻, H₂O). d-e⁻ juftlanmaydi → HS. Paramagnit."}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-amber-600/10 border border-amber-500/30 rounded p-2">
              <p className="text-amber-300 font-bold text-[9px]">d²sp³ — Ichki</p>
              <p className="text-purple-200 text-[9px]">Kuchli maydon</p>
              <p className="text-purple-200 text-[9px]">LS, diamagnit</p>
              <p className="text-cyan-300 font-mono text-[8px]">[Fe(CN)₆]⁴⁻</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded p-2">
              <p className="text-blue-300 font-bold text-[9px]">sp³d² — Tashqi</p>
              <p className="text-purple-200 text-[9px]">Kuchsiz maydon</p>
              <p className="text-purple-200 text-[9px]">HS, paramagnit</p>
              <p className="text-cyan-300 font-mono text-[8px]">[Fe(H₂O)₆]²⁺</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. GEOMETRIYA VA IZOMERIYA — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function GeometriyaIzomeriya() {
  const [geo, setGeo] = useState("tetra")

  const geometries = {
    tetra: {name:"Tetraedrik", sym:"Td", ks:4, g:"sp³", izomer:"Yo'q", izoh:"4 ta uch ekvivalent. MA₂B₂ tipida ham barcha joylashuvlar ekvivalent.",
      misol:"[CoCl₄]²⁻, [Zn(NH₃)₄]²⁺", iz:"—", img:"🔺" },
    sq: {name:"Kvadrat planar", sym:"D₄h", ks:4, g:"dsp²", izomer:"Sis-trans", izoh:"4 ta ligand XY tekisligida. MA₂B₂ tipida sis (90°) va trans (180°) izomerlar mavjud.",
      misol:"[Pt(NH₃)₂Cl₂] (cisplatin, transplatin)", iz:"cis → anti-kanser, trans → toksik", img:"⬛" },
    octa: {name:"Oktaedrik", sym:"Oh", ks:6, g:"d²sp³/sp³d²", izomer:"Sis-trans + fac-mer",
      izoh:"MA₄B₂ → sis va trans izomerlari. MA₃B₃ → fac (bir yuz) va mer (bir meridian) izomerlari.",
      misol:"[Co(NH₃)₄Cl₂]⁺, [Co(NH₃)₃Cl₃]", iz:"fac → C₃v, mer → C₂v", img:"💎" },
    trig: {name:"Trig. bipiramida", sym:"D₃h", ks:5, g:"sp³d", izomer:"Aksial-ekvatorial",
      izoh:"MA₃B₂ tipida aksial va ekvatorial izomerlar. Ekvatorial o'rin keng (120°), aksial tor (90°).",
      misol:"[Fe(CO)₅], [Ni(CN)₅]³⁻", iz:"Ekvat. → katta ligand", img:"🔷" },
  }
  const d = geometries[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🎯</span> Geometriya va izomeriya bog'liqligi
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(geometries).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {v.img} {v.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{d.img} {d.name} ({d.sym})</p>
          <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className="text-green-300 font-mono">{d.g}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Izomeriya:</span><span className={d.izomer==="Yo'q"?"text-red-300":"text-green-300"}>{d.izomer}</span></div>
          <p className="text-purple-200 mt-1">{d.izoh}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Misol:</p>
          <p className="text-cyan-300 font-mono">{d.misol}</p>
          {d.iz !== "—" && <p className="text-yellow-300 mt-1">💡 {d.iz}</p>}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400 font-bold">💡 Simmetriya va izomeriya:</p>
            <p className="text-purple-200">Yuqori simmetriya (Td, Oh) → izomerlar soni kam. Past simmetriya (C₂v) → izomerlar ko'p.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. KS VA GEOMETRIYA — VSEPR ASOSIDA TAHLLIL
// ═══════════════════════════════════════════════════════════════════════════════
function KSGeometriya() {
  const [ks, setKs] = useState(4)
  const ksData = {
    2: {geo:"Chiziqli", g:"sp", b:"180°", sym:"D∞h", misol:"[Ag(NH₃)₂]⁺", n:"2 ta orbital qarama-qarshi. d¹⁰."},
    3: {geo:"Uchburchak", g:"sp²", b:"120°", sym:"D₃h", misol:"[Cu(CN)₃]²⁻", n:"3 ta tekislikda. d¹⁰."},
    4: {geo:"Tetraedrik / Kv. planar", g:"sp³ / dsp²", b:"109.5° / 90°", sym:"Td / D₄h", misol:"[CoCl₄]²⁻ / [PtCl₄]²⁻", n:"4 ta ligand. 2 xil geometriya mumkin."},
    5: {geo:"Trig. bipir. / Kv. piramida", g:"sp³d", b:"90°/120°", sym:"D₃h / C₄v", misol:"[Fe(CO)₅] / [VO(acac)₂]", n:"5 ta ligand. 2 xil geometriya."},
    6: {geo:"Oktaedrik", g:"d²sp³ / sp³d²", b:"90°", sym:"Oh", misol:"[Co(NH₃)₆]³⁺ / [Fe(H₂O)₆]²⁺", n:"6 ta ligand. Ichki yoki tashqi orbital."},
    7: {geo:"Pent. bipiramida", g:"sp³d³", b:"72°/90°", sym:"D₅h", misol:"[V(CN)₇]⁴⁻", n:"7 ta ligand. 5 ekv + 2 aks."},
    8: {geo:"Dodekaedrik / Kub", g:"sp³d⁴", b:"—", sym:"D₂d / Oh", misol:"[Mo(CN)₈]⁴⁻", n:"8 ta ligand. Murakkab geometriya."},
  }
  const d = ksData[ks]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">📐</span> Koordinatsion son va geometriya bog'liqligi
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[2,3,4,5,6,7,8].map(v => (
          <button key={v} onClick={()=>setKs(v)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${ks===v?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            KS = {v}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">KS = {ks}</p>
          <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-cyan-300">{d.geo}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Gibridlanish:</span><span className="text-green-300 font-mono">{d.g}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Bog' burchagi:</span><span className="text-amber-300 font-mono">{d.b}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Simmetriya:</span><span className="text-pink-300 font-mono">{d.sym}</span></div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Tahlil:</p>
          <p className="text-purple-200">{d.n}</p>
          <p className="text-cyan-300 font-mono mt-1">{d.misol}</p>
        </div>
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-2">
        <p className="text-purple-400 font-bold">KS bo'yicha geometriya qoidasi:</p>
        <p className="text-purple-200">KS=2 → chiziqli | KS=3 → uchburchak | KS=4 → tetraedrik yoki kv. planar | KS=5 → trig. bipir. yoki kv. piramida | KS=6 → oktaedrik</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SIMMETRIYA VA GIBRIDLANISH — IRREPS BO'YICHA
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaGibrid() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"Oh — Oktaedrik", g:"d²sp³/sp³d²", ks:6, orb:"d_z², d_x²−y², s, p_x, p_y, p_z",
      irreps:"A₁g (s) + E_g (d_z², d_x²−y²) + T₁u (p_x, p_y, p_z)",
      note:"6 ta gibrid orbital = A₁g + E_g + T₁u. s→A₁g, d(z²,x²−y²)→E_g, p(x,y,z)→T₁u."},
    td: {name:"Td — Tetraedrik", g:"sp³", ks:4, orb:"s, p_x, p_y, p_z",
      irreps:"A₁ (s) + T₂ (p_x, p_y, p_z)",
      note:"4 ta gibrid orbital = A₁ + T₂. s→A₁, p→T₂."},
    d4h: {name:"D₄h — Kvadrat planar", g:"dsp²", ks:4, orb:"d_x²−y², s, p_x, p_y",
      irreps:"A₁g (s) + B₁g (d_x²−y²) + E_u (p_x, p_y)",
      note:"4 ta gibrid orbital = A₁g + B₁g + E_u."},
    d3h: {name:"D₃h — Trig. bipiramida", g:"sp³d", ks:5, orb:"s, p_x, p_y, p_z, d_z²",
      irreps:"A₁' (s, d_z²) + A₁' + E' (p_x, p_y)",
      note:"5 ta gibrid orbital. Ekvatorial: E', aksial: A₁'."},
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">🔬</span> Simmetriya va gibridlanish — IRREPS bo'yicha tahlil
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(data).map(([k,v]) => (
          <button key={k} onClick={()=>setGeo(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-amber-400 font-bold">{d.name}</p>
          <p className="text-purple-200"><strong className="text-yellow-300">Gibridlanish:</strong> <span className="text-green-300 font-mono">{d.g}</span></p>
          <p className="text-purple-200"><strong className="text-yellow-300">KS:</strong> {d.ks}</p>
          <p className="text-purple-200"><strong className="text-yellow-300">AO:</strong> <span className="text-cyan-300 font-mono">{d.orb}</span></p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">IRREPS bo'yicha:</p>
          <p className="text-cyan-300 font-mono">{d.irreps}</p>
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
// 7. AMALIY MISOLLAR — GEOMETRIYA BO'YICHA
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    {name:"[Ag(NH₃)₂]⁺", ks:2, g:"sp", geo:"Chiziqli", b:"180°", d:"4d¹⁰", sym:"D∞h", mu:0, magnet:"Diamagnit", note:"Ag⁺ d¹⁰. 2 ta NH₃ ligand. Kumushning tipik kompleksi."},
    {name:"[Cu(CN)₃]²⁻", ks:3, g:"sp²", geo:"Uchburchak", b:"120°", d:"3d¹⁰", sym:"D₃h", mu:0, magnet:"Diamagnit", note:"Cu⁺ d¹⁰. 3 ta CN⁻ ligand. Uchburchak geometriya."},
    {name:"[CoCl₄]²⁻", ks:4, g:"sp³", geo:"Tetraedrik", b:"109.5°", d:"3d⁷ HS", sym:"Td", mu:3.87, magnet:"Paramagnit", note:"Co²⁺ d⁷. 4 ta Cl⁻. HS. Ko'k rang."},
    {name:"[PtCl₄]²⁻", ks:4, g:"dsp²", geo:"Kvadrat planar", b:"90°", d:"5d⁸", sym:"D₄h", mu:0, magnet:"Diamagnit", note:"Pt²⁺ d⁸. 4 ta Cl⁻. 16 e⁻. Anti-kanser."},
    {name:"[Fe(CO)₅]", ks:5, g:"sp³d", geo:"Trig. bipiramida", b:"90/120°", d:"3d⁸", sym:"D₃h", mu:0, magnet:"Diamagnit", note:"Fe(0) d⁸. 5 ta CO. 18 e⁻."},
    {name:"[VO(acac)₂]", ks:5, g:"sp³d", geo:"Kvadrat piramida", b:"~90°", d:"3d¹", sym:"C₄v", mu:1.73, magnet:"Paramagnit", note:"V⁴⁺ d¹. V=O qisqa. 1 ta juftlanmagan e⁻."},
    {name:"[Co(NH₃)₆]³⁺", ks:6, g:"d²sp³", geo:"Oktaedrik (ichki)", b:"90°", d:"3d⁶ LS", sym:"Oh", mu:0, magnet:"Diamagnit", note:"Co³⁺ d⁶ LS. Kuchli maydon. 18 e⁻. Sariq."},
    {name:"[Fe(H₂O)₆]²⁺", ks:6, g:"sp³d²", geo:"Oktaedrik (tashqi)", b:"90°", d:"3d⁶ HS", sym:"Oh", mu:4.9, magnet:"Paramagnit", note:"Fe²⁺ d⁶ HS. Kuchsiz maydon. H₂O."},
    {name:"[Ni(CN)₄]²⁻", ks:4, g:"dsp²", geo:"Kvadrat planar", b:"90°", d:"3d⁸", sym:"D₄h", mu:0, magnet:"Diamagnit", note:"Ni²⁺ d⁸. CN⁻ kuchli maydon → dsp²."},
    {name:"[Zn(OH)₄]²⁻", ks:4, g:"sp³", geo:"Tetraedrik", b:"109.5°", d:"3d¹⁰", sym:"Td", mu:0, magnet:"Diamagnit", note:"Zn²⁺ d¹⁰. To'lgan d-qavat. sp³ tetraedrik."},
  ]
  const m = misollar[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🧪</span> Amaliy misollar — geometriya bo'yicha tahlil
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {misollar.map((m,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{m.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="text-yellow-300 font-bold text-sm">{m.name}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-2 space-y-1">
            <div className="flex justify-between"><span className="text-purple-400">KS:</span><span className="text-white font-bold">{m.ks}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Gibrid:</span><span className="text-green-300 font-mono font-bold">{m.g}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-cyan-300">{m.geo} ({m.b})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Simmetriya:</span><span className="text-pink-300 font-mono">{m.sym}</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Magnit:</span><span className={m.mu===0?"text-green-300":"text-red-300"}>{m.magnet} (μ={m.mu})</span></div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Tahlil:</p>
          <p className="text-purple-200">{m.note}</p>
          <p className="text-purple-200">KS={m.ks} → {m.g} → {m.geo}. {m.d} konfiguratsiyasi.</p>
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
    { q:"Oktaedrik geometriya uchun qanday gibridlanish kerak?", a:"d²sp³ yoki sp³d²", opts:["sp³","dsp²","d²sp³ yoki sp³d²","sp³d"], hint:"6 ta ligand → 6 ta gibrid orbital. 2 xil variant." },
    { q:"d²sp³ va sp³d² o'rtasidagi asosiy farq?", a:"Ishlatilgan d-orbital: (n−1)d vs nd", opts:["Bog' burchagi","Ishlatilgan d-orbital: (n−1)d vs nd","Ligandlar soni","Simmetriya"], hint:"Ichki orbital (n−1)d → LS. Tashqi nd → HS." },
    { q:"Kvadrat planar geometriya qaysi elektron konfiguratsiyaga ega metallarda uchraydi?", a:"d⁸ (Ni²⁺, Pt²⁺, Pd²⁺)", opts:["d⁶","d⁸ (Ni²⁺, Pt²⁺, Pd²⁺)","d¹⁰","d¹"], hint:"16 e⁻, d⁸. Kvadrat planar." },
    { q:"Qaysi geometriyada sis-trans izomeriya mavjud?", a:"Kvadrat planar va oktaedrik", opts:["Tetraedrik","Kvadrat planar va oktaedrik","Faqat chiziqli","Trig. bipiramida"], hint:"Tetraedrda izomer yo'q." },
    { q:"Trigonal bipiramida (sp³d) bog' burchaklari?", a:"90° va 120°", opts:["109.5°","90°","90° va 120°","180°"], hint:"Ekvatorial 120°, aksial 90°." },
    { q:"[Ni(CN)₄]²⁻ kompleksidagi gibridlanish?", a:"dsp² (kvadrat planar)", opts:["sp³ (tetraedrik)","dsp² (kvadrat planar)","d²sp³ (oktaedrik)","sp (chiziqli)"], hint:"Ni²⁺ 3d⁸. CN⁻ kuchli maydon. 4 ta ligand." },
    { q:"Fac va mer izomerlari qaysi geometriyada uchraydi?", a:"Oktaedrik (MA₃B₃)", opts:["Tetraedrik","Oktaedrik (MA₃B₃)","Kvadrat planar","Chiziqli"], hint:"MA₃B₃ → fac va mer." },
    { q:"KS=5 bo'lgan kompleksda qanday geometriya mumkin?", a:"Trigonal bipiramida yoki kvadrat piramida", opts:["Faqat trig. bipir.","Faqat kv. piramida","Trigonal bipiramida yoki kvadrat piramida","Oktaedrik"], hint:"5 ta ligand → 2 xil geometriya." },
    { q:"[Fe(CO)₅] kompleksidagi gibridlanish va geometriya?", a:"sp³d, trigonal bipiramida", opts:["d²sp³, oktaedrik","sp³d, trigonal bipiramida","sp³, tetraedrik","dsp², kvadrat planar"], hint:"Fe(0) 3d⁸. 5 ta CO. 18 e⁻." },
    { q:"Oh simmetriyasida gibrid orbitallarning IRREPS lari?", a:"A₁g + E_g + T₁u", opts:["T₂g + E_g","A₁g + T₁u","A₁g + E_g + T₁u","E_g + T₂g"], hint:"6 ta orbital. s→A₁g, d(z²,x²−y²)→E_g, p→T₁u." },
  ]
  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) { return (
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "Gibridlanishni mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
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
export default function GibridlanishGeometriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Kimyoviy bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-blue-400">Gibridlanish</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-blue-400 flex items-center gap-2"><span>💎</span> Gibridlanish va geometriya</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">sp→chiziqli • sp²→uchburchak • sp³→tetraedrik • dsp²→kv. planar • d²sp³→oktaedrik • Izomeriya • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Gibridlanish va geometriya</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Gibridlanish</strong> — atom orbitallarining aralashib, yangi 
                <strong className="text-cyan-300"> energetik jihatdan teng</strong> orbitallar hosil qilishi. 
                Gibrid orbitallarning <strong>soni va fazoviy joylashuvi</strong> kompleksning geometriyasini 
                bevosita belgilaydi. KS=2 (chiziqli) dan KS=8 (dodekaedrik) gacha.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">10 geometriya</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">Canvas 3D</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Izomeriya</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-blue-400 font-bold">🎯 Maqsad:</span> Gibridlanish turlari, ularning geometriya va izomeriya bilan bog'liqligini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">⏱️ Vaqt:</span> ~2.5 soat</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">📚 Manba:</span> L. Pauling — Nature of the Chemical Bond; Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-blue-300 font-mono text-xs font-bold">"Gibridlanish — geometriyaning kaliti!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <GibridlanishCanvas />
        <GibridlanishJadval />
        <IchkiTashqiEnergiya />
        <GeometriyaIzomeriya />
        <KSGeometriya />
        <SimmetriyaGibrid />
        <AmaliyMisollar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Gibridlanish</strong> — atom orbitallarining aralashishi natijasida yangi, energetik jihatdan teng orbitallar hosil bo'ladi</li>
            <li><strong className="text-yellow-400">KS va geometriya:</strong> KS=2→chiziqli, KS=3→uchburchak, KS=4→tetraedrik/kv.planar, KS=5→trig.bipir./kv.piramida, KS=6→oktaedrik</li>
            <li><strong className="text-yellow-400">d²sp³ (ichki)</strong> — (n−1)d, kuchli maydon, LS, diamagnit. <strong className="text-yellow-400">sp³d² (tashqi)</strong> — nd, kuchsiz maydon, HS, paramagnit</li>
            <li><strong className="text-yellow-400">Izomeriya:</strong> Tetraedrik → izomer yo'q. Kv. planar → sis-trans. Oktaedrik → sis-trans + fac-mer</li>
            <li><strong className="text-yellow-400">Simmetriya IRREPS:</strong> Oh → A₁g+E_g+T₁u. Td → A₁+T₂. D₄h → A₁g+B₁g+E_u. D₃h → A₁'+A₁'+E'</li>
            <li><strong className="text-yellow-400">10 tur gibridlanish:</strong> sp (2) → sp³d⁴ (8). Eng keng tarqalgan: sp³, dsp², d²sp³</li>
            <li><strong className="text-yellow-400">Ikkala geometriya (KS=4,5):</strong> Ligand maydon kuchi qaysi geometriya bo'lishini belgilaydi (d⁸ → dsp² yoki sp³)</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> σ/π ligandlar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20">
            MO diagrammasi <span>→</span>
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