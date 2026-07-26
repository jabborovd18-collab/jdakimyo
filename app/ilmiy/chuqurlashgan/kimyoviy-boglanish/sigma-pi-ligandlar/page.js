"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. LIGAND TURLARI — INTERAKTIV CANVAS VIZUALIZATSIYA
// ═══════════════════════════════════════════════════════════════════════════════
function LigandTurlariCanvas() {
  const [ligandType, setLigandType] = useState("sigma")
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  const types = {
    sigma: {
      name: "σ-donor", color: "#3b82f6", desc: "Ligand → Metall: elektron jufti beradi. Faqat σ-bog'.",
      example: "NH₃, H₂O, F⁻, Cl⁻, OH⁻",
      delta: "O'rtacha",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        // Metall markaz
        const mg = ctx.createRadialGradient(cx+30, cy, 0, cx+30, cy, 18*pulse)
        mg.addColorStop(0, "#fbbf24"); mg.addColorStop(1, "#d97706")
        ctx.beginPath(); ctx.arc(cx+30, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = mg; ctx.fill(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("M", cx+30, cy+3)

        // Ligand (left)
        const lg = ctx.createRadialGradient(cx-50, cy, 0, cx-50, cy, 14*pulse)
        lg.addColorStop(0, "#3b82f6"); lg.addColorStop(1, "#1e3a5f")
        ctx.beginPath(); ctx.arc(cx-50, cy, 14*pulse, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"
        ctx.fillText("L", cx-50, cy+3)

        // Electron pair animation
        const ex = cx - 10 + Math.sin(t*2) * 5
        ctx.fillStyle = "#3b82f680"
        ctx.beginPath(); ctx.arc(ex, cy-5, 3, 0, Math.PI*2); ctx.fill()
        ctx.beginPath(); ctx.arc(ex, cy+5, 3, 0, Math.PI*2); ctx.fill()

        // Arrow
        ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx-35, cy); ctx.lineTo(cx+12, cy); ctx.stroke()
        ctx.fillStyle = "#3b82f6"; ctx.font = "10px sans-serif"
        ctx.fillText("→", cx-15, cy-8)

        ctx.fillStyle = "#a78bfa"; ctx.font = "9px sans-serif"
        ctx.fillText(":L (elektron jufti)", cx-50, cy+28)
        ctx.fillText("← σ-donor", cx+30, cy+28)
      }
    },
    pi_donor: {
      name: "π-donor", color: "#ef4444", desc: "Ligand → Metall: to'lgan π-orbitallardan beradi.",
      example: "F⁻, Cl⁻, OH⁻, O²⁻, Br⁻",
      delta: "Kichik",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        // Metall
        const mg = ctx.createRadialGradient(cx+30, cy, 0, cx+30, cy, 18*pulse)
        mg.addColorStop(0, "#fbbf24"); mg.addColorStop(1, "#d97706")
        ctx.beginPath(); ctx.arc(cx+30, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = mg; ctx.fill(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("M", cx+30, cy+3)

        // Ligand p-orbitals
        const lg = ctx.createRadialGradient(cx-50, cy, 0, cx-50, cy, 12*pulse)
        lg.addColorStop(0, "#ef4444"); lg.addColorStop(1, "#5f1a2e")
        ctx.beginPath(); ctx.arc(cx-50, cy, 12*pulse, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"
        ctx.fillText("L", cx-50, cy+3)

        // π orbital (p_x) lobes
        const shift = Math.sin(t) * 4
        const grd1 = ctx.createRadialGradient(cx-50, cy-16-shift, 0, cx-50, cy-16-shift, 10)
        grd1.addColorStop(0, "#ef444460"); grd1.addColorStop(1, "#ef444405")
        ctx.beginPath(); ctx.ellipse(cx-50, cy-16-shift, 8, 10, 0, 0, Math.PI*2)
        ctx.fillStyle = grd1; ctx.fill(); ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1; ctx.stroke()

        const grd2 = ctx.createRadialGradient(cx-50, cy+16+shift, 0, cx-50, cy+16+shift, 10)
        grd2.addColorStop(0, "#ef444460"); grd2.addColorStop(1, "#ef444405")
        ctx.beginPath(); ctx.ellipse(cx-50, cy+16+shift, 8, 10, 0, 0, Math.PI*2)
        ctx.fillStyle = grd2; ctx.fill(); ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1; ctx.stroke()

        ctx.fillStyle = "#a78bfa"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("π-orbitallar (to'lgan)", cx-50, cy+38)
        ctx.fillText("→ π-donor", cx+30, cy+28)
      }
    },
    pi_akseptor: {
      name: "π-akseptor", color: "#22c55e", desc: "Metall → Ligand: d-elektronlarni π* ga qaytaradi (orqaga donorlik).",
      example: "CO, CN⁻, PR₃, NO⁺",
      delta: "Katta",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        // Metall
        const mg = ctx.createRadialGradient(cx+30, cy, 0, cx+30, cy, 18*pulse)
        mg.addColorStop(0, "#fbbf24"); mg.addColorStop(1, "#d97706")
        ctx.beginPath(); ctx.arc(cx+30, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = mg; ctx.fill(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("M", cx+30, cy+3)

        // Ligand (CO)
        const lg = ctx.createRadialGradient(cx-50, cy-8, 0, cx-50, cy-8, 12*pulse)
        lg.addColorStop(0, "#22c55e"); lg.addColorStop(1, "#1e5f2e")
        ctx.beginPath(); ctx.arc(cx-50, cy-8, 12*pulse, 0, Math.PI*2)
        ctx.fillStyle = lg; ctx.fill(); ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("C", cx-50, cy-6)

        // O atom
        ctx.beginPath(); ctx.arc(cx-72, cy-8, 10, 0, Math.PI*2)
        ctx.fillStyle = "#ef444480"; ctx.fill(); ctx.strokeStyle = "#ef4444"; ctx.lineWidth = 1; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"
        ctx.fillText("O", cx-72, cy-6)

        // π* orbital (bo'sh)
        const shift = Math.sin(t) * 3
        ctx.strokeStyle = "#22c55e40"; ctx.lineWidth = 1
        ctx.beginPath(); ctx.ellipse(cx-50, cy-22-shift, 7, 8, 0, 0, Math.PI*2)
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 1; ctx.stroke()
        ctx.beginPath(); ctx.ellipse(cx-50, cy+6+shift, 7, 8, 0, 0, Math.PI*2)
        ctx.strokeStyle = "#22c55e"; ctx.stroke()

        // Back-donation arrow
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx+12, cy-10); ctx.lineTo(cx-35, cy-18); ctx.stroke()
        ctx.fillStyle = "#22c55e"; ctx.font = "8px sans-serif"
        ctx.fillText("d_e⁻ → π*", cx-15, cy-22)

        ctx.fillStyle = "#a78bfa"; ctx.font = "9px sans-serif"
        ctx.fillText("π* (bo'sh)", cx-50, cy+30)
      }
    },
    synergistic: {
      name: "Sinergik (σ+π)", color: "#a855f7", desc: "σ-donor + π-akseptor. Bir-birini kuchaytiradi.",
      example: "CO, CN⁻, PR₃",
      delta: "Eng katta",
      draw: (ctx, cx, cy, t) => {
        const pulse = 1 + Math.sin(t) * 0.08
        // Metall
        const mg = ctx.createRadialGradient(cx+20, cy, 0, cx+20, cy, 18*pulse)
        mg.addColorStop(0, "#fbbf24"); mg.addColorStop(1, "#d97706")
        ctx.beginPath(); ctx.arc(cx+20, cy, 16*pulse, 0, Math.PI*2)
        ctx.fillStyle = mg; ctx.fill(); ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("M", cx+20, cy+3)

        // Ligand
        ctx.beginPath(); ctx.arc(cx-40, cy-8, 12*pulse, 0, Math.PI*2)
        ctx.fillStyle = "#a855f760"; ctx.fill(); ctx.strokeStyle = "#a855f7"; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "center"
        ctx.fillText("L", cx-40, cy-6)

        // σ arrow → (ligand to metal)
        ctx.strokeStyle = "#3b82f6"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx-27, cy-3); ctx.lineTo(cx+3, cy-3); ctx.stroke()
        ctx.fillStyle = "#3b82f6"; ctx.font = "7px sans-serif"
        ctx.fillText("σ", cx-12, cy-6)

        // π arrow ← (metal to ligand)
        ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2
        ctx.beginPath(); ctx.moveTo(cx+3, cy+3); ctx.lineTo(cx-27, cy+3); ctx.stroke()
        ctx.fillStyle = "#22c55e"; ctx.font = "7px sans-serif"
        ctx.fillText("π", cx-12, cy+13)

        // Labels
        ctx.fillStyle = "#a78bfa"; ctx.font = "9px sans-serif"
        ctx.fillText("σ-donor + π-akseptor = Sinergiya!", cx-20, cy+38)

        // d orbital on metal
        ctx.strokeStyle = "#22c55e40"; ctx.lineWidth = 1
        ctx.beginPath(); ctx.ellipse(cx+30, cy-14, 6, 8, 0.3, 0, Math.PI*2); ctx.stroke()
        ctx.beginPath(); ctx.ellipse(cx+30, cy+14, 6, 8, -0.3, 0, Math.PI*2); ctx.stroke()
        ctx.fillStyle = "#22c55e80"; ctx.font = "6px sans-serif"
        ctx.fillText("d (t₂g)", cx+38, cy-6)
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    let t = 0
    function draw() { t += 0.03
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

      types[ligandType].draw(ctx, cx, cy, t)
      ctx.fillStyle = "#a78bfa80"; ctx.font = "9px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(types[ligandType].desc, cx, h-10)
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [ligandType])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-purple-400">🎨</span> Ligand turlari — interaktiv Canvas vizualizatsiyasi
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {Object.entries(types).map(([k,v]) => (
          <button key={k} onClick={()=>setLigandType(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${ligandType===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={ligandType===k ? {background:v.color+"44", borderColor:v.color+"88"} : {}}>
            {v.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={360} height={200} className="w-full h-52 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="space-y-2 text-xs">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="font-bold text-sm" style={{color:types[ligandType].color}}>{types[ligandType].name}</p>
            <p className="text-purple-200">{types[ligandType].desc}</p>
            <p className="text-purple-200"><strong className="text-yellow-300">Misol:</strong> <span className="text-cyan-300 font-mono">{types[ligandType].example}</span></p>
            <p className="text-purple-200"><strong className="text-yellow-300">Maydon kuchi:</strong> <span className="text-green-300">{types[ligandType].delta}</span></p>
          </div>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400 font-bold">💡 Canvasda σ va π bog'larning real-time vizualizatsiyasi.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. LIGANDLAR TO'LIQ MA'LUMOT JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function LigandMalumotJadvali() {
  const [sel, setSel] = useState(null)
  const rows = [
    {n:"CO", tip:"π-akseptor", s:"σ-donor (C)", pi:"π* (bo'sh)", delta:35000, nu:"2143→2050", en:"Eng kuchli", misol:"[Ni(CO)₄], [Fe(CO)₅]", izoh:"Eng klassik π-akseptor. IQ diagnostika."},
    {n:"CN⁻", tip:"π-akseptor", s:"σ-donor (C)", pi:"π* (bo'sh)", delta:33000, nu:"2143→2080", en:"Kuchli", misol:"[Fe(CN)₆]⁴⁻, [Ni(CN)₄]²⁻", izoh:"CO dan kuchsiz π-akseptor. Kuchli σ-donor."},
    {n:"NO⁺", tip:"π-akseptor", s:"σ-donor (N)", pi:"π* (bo'sh)", delta:36000, nu:"—", en:"Eng kuchli", misol:"[Fe(CN)₅NO]²⁻", izoh:"Eng kuchli maydon. CO bilan izoelektron."},
    {n:"PR₃", tip:"π-akseptor", s:"σ-donor (P)", pi:"σ* (P−R)", delta:30000, nu:"—", en:"Kuchli", misol:"W(CO)₅PMe₃, [Pd(PPh₃)₄]", izoh:"R guruhi ta'sir qiladi. Aril>alkil."},
    {n:"NH₃", tip:"σ-donor", s:"σ-donor (N)", pi:"Yo'q", delta:23000, nu:"—", en:"O'rtacha", misol:"[Co(NH₃)₆]³⁺, [Ag(NH₃)₂]⁺", izoh:"Faqat σ-donor. π-bog' yo'q."},
    {n:"H₂O", tip:"σ-donor", s:"σ-donor (O)", pi:"Kuchsiz π-donor", delta:18500, nu:"—", en:"Kuchsiz", misol:"[Fe(H₂O)₆]²⁺, [Co(H₂O)₆]²⁺", izoh:"Kuchsiz maydon. HS komplekslar."},
    {n:"Cl⁻", tip:"π-donor", s:"σ-donor", pi:"To'lgan p (π)", delta:13000, nu:"—", en:"Kuchsiz", misol:"[CoCl₄]²⁻, [PtCl₄]²⁻", izoh:"π-donor → t₂g↑ → Δ₀↓."},
    {n:"F⁻", tip:"π-donor", s:"σ-donor", pi:"To'lgan p (π)", delta:15000, nu:"—", en:"Kuchsiz", misol:"[FeF₆]³⁻, [CoF₆]³⁻", izoh:"Eng kichik galogen, kuchsiz π-donor."},
    {n:"en", tip:"σ-donor", s:"σ-donor (2×N)", pi:"Yo'q", delta:25000, nu:"—", en:"O'rtacha-kuchli", misol:"[Co(en)₃]³⁺", izoh:"Xelat effekti. 2 ta N donori."},
    {n:"PPh₃", tip:"π-akseptor", s:"σ-donor (P)", pi:"σ* (P−Ph)", delta:28000, nu:"—", en:"Kuchli", misol:"[Pd(PPh₃)₄], [RhCl(PPh₃)₃]", izoh:"Katta fosfin. Katalizatorlarda muhim."},
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📋</span> Ligandlar ma'lumot bazasi — to'liq jadval
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead><tr className="bg-purple-800/70">
            <th className="p-1 text-left text-amber-400">Ligand</th>
            <th className="p-1 text-left text-purple-300">Tur</th>
            <th className="p-1 text-left text-purple-300">σ-donor</th>
            <th className="p-1 text-left text-purple-300">π-xossa</th>
            <th className="p-1 text-center text-purple-300">Δ₀ (cm⁻¹)</th>
            <th className="p-1 text-center text-purple-300 hidden sm:table-cell">ν(CO)</th>
            <th className="p-1 text-center text-purple-300">Maydon</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} onMouseEnter={()=>setSel(i)} onMouseLeave={()=>setSel(null)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} ${sel===i?"bg-purple-700/40":"hover:bg-purple-800/30"}`}>
                <td className={`p-1 font-mono font-bold ${sel===i?"text-pink-300":"text-yellow-300"}`}>{r.n}</td>
                <td className="p-1" style={{color:r.tip.includes("π-akseptor")?"#22c55e":r.tip.includes("π-donor")?"#ef4444":"#3b82f6"}}>{r.tip}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px]">{r.s}</td>
                <td className="p-1 text-purple-200 text-[7px] sm:text-[9px]">{r.pi}</td>
                <td className="p-1 text-center text-cyan-300 font-mono">{r.delta.toLocaleString()}</td>
                <td className="p-1 text-center text-amber-300 font-mono hidden sm:table-cell">{r.nu}</td>
                <td className="p-1 text-center font-bold" style={{color:r.en==="Eng kuchli"?"#22c55e":r.en==="Kuchli"?"#3b82f6":r.en==="O'rtacha"?"#f59e0b":"#ef4444"}}>{r.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel !== null && (
        <div className="bg-purple-950/80 border border-purple-600/50 rounded-lg p-3 text-xs mt-3">
          <p className="text-yellow-400 font-bold">{rows[sel].n} — {rows[sel].tip}</p>
          <p className="text-purple-200 mt-1">{rows[sel].izoh}</p>
          <p className="text-purple-300 mt-1"><strong className="text-cyan-300">Misol:</strong> <span className="font-mono">{rows[sel].misol}</span></p>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SPEKTROKIMYOVIY QATOR — INTERAKTIV BAR CHART
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrokimyoviyQatorInteraktiv() {
  const [sel, setSel] = useState("co")
  const ligands = [
    {k:"br", n:"Br⁻", t:"π-donor", d:7000, c:"#ef4444", h:18},
    {k:"cl", n:"Cl⁻", t:"π-donor", d:13000, c:"#f97316", h:33},
    {k:"f", n:"F⁻", t:"π-donor", d:15000, c:"#eab308", h:38},
    {k:"h2o", n:"H₂O", t:"σ-donor", d:18500, c:"#22c55e", h:47},
    {k:"nh3", n:"NH₃", t:"σ-donor", d:23000, c:"#3b82f6", h:58},
    {k:"en", n:"en", t:"σ-donor", d:25000, c:"#6366f1", h:63},
    {k:"cn", n:"CN⁻", t:"π-akseptor", d:33000, c:"#a855f7", h:83},
    {k:"co", n:"CO", t:"π-akseptor", d:35000, c:"#ec4899", h:88},
    {k:"no", n:"NO⁺", t:"π-akseptor", d:36000, c:"#be123c", h:90},
  ]
  const d = ligands.find(l => l.k === sel) || ligands[0]
  const maxD = 36000

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Spektrokimyoviy qator — Δ₀ bo'yicha ligandlar
      </h3>

      <div className="flex items-end gap-1 h-28 mb-3">
        {ligands.map(l => (
          <div key={l.k} className="flex-1 flex flex-col items-center group cursor-pointer"
            onClick={()=>setSel(l.k)}>
            <div className={`w-full rounded-t-lg transition-all group-hover:scale-105 ${sel===l.k?"ring-2 ring-white":""}`}
              style={{height:`${(l.d/maxD)*100}%`, minHeight:"8px", background:l.c, opacity:sel===l.k?1:0.6}} />
            <div className={`text-[7px] sm:text-[9px] font-bold mt-1 ${sel===l.k?"text-white":"text-purple-400"}`}>{l.n}</div>
            <div className="text-[6px] text-purple-500">{l.d.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-yellow-300 font-bold">{d.n} — {d.t}</p>
          <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-cyan-300 font-mono text-lg font-bold">{d.d.toLocaleString()} cm⁻¹</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Nisbiy kuch:</span><span className="text-green-300">{(d.d/23000).toFixed(2)}× NH₃</span></div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Spektrokimyoviy qator:</p>
          <p className="text-purple-200 text-[9px]">Br⁻ {'<'} Cl⁻ {'<'} F⁻ {'<'} H₂O {'<'} NH₃ {'<'} en {'<'} CN⁻ {'<'} CO {'<'} NO⁺</p>
          <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-purple-300 text-[9px]">π-donor (Br⁻,Cl⁻,F⁻) → t₂g↑ → Δ₀↓ | π-akseptor (CN⁻,CO,NO⁺) → t₂g↓ → Δ₀↑</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ν(CO) IQ DIAGNOSTIKASI — INTERAKTIV VIZUAL
// ═══════════════════════════════════════════════════════════════════════════════
function IQDiagnostika() {
  const canvasRef = useRef(null)
  const [complex, setComplex] = useState(0)

  const data = [
    {name:"Erkin CO", cm:2143, col:"#a78bfa", desc:"C≡O gaz fazada. π-orqaga donorlik yo'q."},
    {name:"[Ni(CO)₄]", cm:2057, col:"#3b82f6", desc:"Ni(0) → d¹⁰. Kuchsiz π-orqaga donorlik."},
    {name:"[Fe(CO)₅]", cm:2020, col:"#22c55e", desc:"Fe(0) → d⁸. O'rtacha π-orqaga donorlik."},
    {name:"[Co(CO)₄]⁻", cm:1890, col:"#a855f7", desc:"Co(−I) → d¹⁰. Kuchli π-orqaga donorlik."},
    {name:"[Mn(CO)₆]⁺", cm:2090, col:"#ef4444", desc:"Mn(I) → d⁶. Kuchsiz π-orqaga."},
    {name:"[V(CO)₆]⁻", cm:1860, col:"#f59e0b", desc:"V(−I) → d⁶. Juda kuchli π-orqaga."},
  ]
  const d = data[complex]

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext("2d"); if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120)
    grd.addColorStop(0, "#1a0a2e"); grd.addColorStop(1, "#0a0018")
    ctx.fillStyle = grd; ctx.fillRect(0, 0, w, h)

    // Spectrum bar
    const minCM = 1800, maxCM = 2200
    const barX = 40, barW = w - 80, barY = cy - 30

    // Background gradient
    const specGrd = ctx.createLinearGradient(barX, 0, barX+barW, 0)
    specGrd.addColorStop(0, "#ef444420"); specGrd.addColorStop(0.3, "#f59e0b20")
    specGrd.addColorStop(0.5, "#22c55e20"); specGrd.addColorStop(0.7, "#3b82f620")
    specGrd.addColorStop(1, "#a855f720")
    ctx.fillStyle = specGrd; ctx.fillRect(barX, barY, barW, 20)
    ctx.strokeStyle = "rgba(139,92,246,0.3)"; ctx.lineWidth = 1
    ctx.strokeRect(barX, barY, barW, 20)

    // Tick marks
    for (let cm = 1800; cm <= 2200; cm += 50) {
      const x = barX + ((cm - minCM) / (maxCM - minCM)) * barW
      ctx.strokeStyle = "rgba(139,92,246,0.2)"; ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(x, barY-5); ctx.lineTo(x, barY+25); ctx.stroke()
      ctx.fillStyle = "rgba(139,92,246,0.4)"; ctx.font = "6px sans-serif"; ctx.textAlign = "center"
      ctx.fillText(cm, x, barY+35)
    }

    // All data points
    data.forEach((item, i) => {
      const x = barX + ((item.cm - minCM) / (maxCM - minCM)) * barW
      ctx.fillStyle = i === complex ? item.col : item.col + "40"
      ctx.beginPath(); ctx.arc(x, barY+10, i === complex ? 6 : 3, 0, Math.PI*2)
      ctx.fill()
      if (i === complex) {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1
        ctx.stroke()
        // Pointer line
        ctx.setLineDash([3,3]); ctx.strokeStyle = item.col + "80"; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(x, barY-5); ctx.lineTo(x, barY-35); ctx.stroke()
        ctx.setLineDash([])
        // Label
        ctx.fillStyle = item.col; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"
        ctx.fillText(`${item.name}: ${item.cm} cm⁻¹`, cx, barY-40)
      }
    })

    ctx.fillStyle = "#a78bfa80"; ctx.font = "8px sans-serif"; ctx.textAlign = "center"
    ctx.fillText("ν(CO) — IQ spektroskopiya", cx, h-10)

  }, [complex])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📡</span> ν(CO) IQ diagnostikasi — π-orqaga donorlikni o'lchash
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {data.map((d,i) => (
          <button key={i} onClick={()=>setComplex(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${complex===i?"text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
            style={complex===i?{background:d.col+"66"}:{}}>
            {d.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={360} height={160} className="w-full h-44 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-bold">{d.name}</p>
          <div className="flex justify-between"><span className="text-purple-400">ν(CO):</span><span className="text-cyan-300 font-mono text-lg font-bold">{d.cm} cm⁻¹</span></div>
          <p className="text-purple-200">{d.desc}</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-purple-400 font-bold">Δν = {2143 - d.cm} cm⁻¹</p>
            <p className="text-purple-200">ν qancha past → π-orqaga donorlik shuncha kuchli → M−C bog'i kuchli, C≡O kuchsiz</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. π-DONOR vs π-AKSEPTOR — INTERAKTIV TAQQOSLASH
// ═══════════════════════════════════════════════════════════════════════════════
function PiDonorVsPiAkseptor() {
  const [view, setView] = useState("acceptor")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">⚡</span> π-donor vs π-akseptor — MO bo'yicha taqqoslash
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-3">
        <button onClick={()=>setView("acceptor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="acceptor"?"bg-green-600/60 text-white border border-green-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🟢 π-akseptor (CO, CN⁻)
        </button>
        <button onClick={()=>setView("donor")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="donor"?"bg-red-600/60 text-white border border-red-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔴 π-donor (Cl⁻, Br⁻)
        </button>
        <button onClick={()=>setView("comparison")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${view==="comparison"?"bg-purple-600/60 text-white border border-purple-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          📊 To'liq taqqoslash
        </button>
      </div>

      {view === "acceptor" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 space-y-2">
            <p className="text-green-400 font-bold text-sm">π-akseptor (CO, CN⁻, PR₃)</p>
            <p className="text-purple-200">• Ligandda <strong className="text-yellow-300">bo'sh π*</strong> orbitallar mavjud</p>
            <p className="text-purple-200">• Metall t₂g (to'lgan) → ligand π* (bo'sh) <strong>orqaga donorlik</strong></p>
            <p className="text-purple-200">• t₂g <strong className="text-green-300">pasayadi</strong> → Δ₀ <strong className="text-green-300">ortadi</strong></p>
            <p className="text-purple-200">• Natija: <strong className="text-cyan-300">Kuchli maydon, past spin (LS)</strong></p>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 text-center mt-1">
              <p className="text-yellow-300 font-mono">t₂g↓ → Δ₀↑ → LS</p>
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-purple-400 font-bold">Spektral belgilari:</p>
            <p className="text-purple-200">• ν(CO) <strong className="text-green-300">pasayadi</strong> (2143 → ~2050-1850 cm⁻¹)</p>
            <p className="text-purple-200">• Δ₀ katta (25000-36000 cm⁻¹)</p>
            <p className="text-purple-200">• LS komplekslar: diamagnit</p>
            <p className="text-purple-200"><strong className="text-yellow-300">Misol:</strong> [Fe(CN)₆]⁴⁻ (d⁶ LS, μ=0)</p>
          </div>
        </div>
      )}

      {view === "donor" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 space-y-2">
            <p className="text-red-400 font-bold text-sm">π-donor (Cl⁻, Br⁻, F⁻, OH⁻)</p>
            <p className="text-purple-200">• Ligandda <strong className="text-yellow-300">to'lgan π</strong> orbitallar mavjud</p>
            <p className="text-purple-200">• Ligand π (to'lgan) → metall t₂g (bo'sh qisman) <strong>π-donorlik</strong></p>
            <p className="text-purple-200">• t₂g <strong className="text-red-300">ortadi</strong> → Δ₀ <strong className="text-red-300">kamayadi</strong></p>
            <p className="text-purple-200">• Natija: <strong className="text-orange-300">Kuchsiz maydon, yuqori spin (HS)</strong></p>
            <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 text-center mt-1">
              <p className="text-yellow-300 font-mono">t₂g↑ → Δ₀↓ → HS</p>
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
            <p className="text-purple-400 font-bold">Spektral belgilari:</p>
            <p className="text-purple-200">• ν(M−X) past (200-400 cm⁻¹)</p>
            <p className="text-purple-200">• Δ₀ kichik (7000-15000 cm⁻¹)</p>
            <p className="text-purple-200">• HS komplekslar: paramagnit</p>
            <p className="text-purple-200"><strong className="text-yellow-300">Misol:</strong> [CoCl₄]²⁻ (d⁷ HS, μ≈3.87)</p>
          </div>
        </div>
      )}

      {view === "comparison" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead><tr className="bg-purple-800/70">
              <th className="p-1.5 text-left text-amber-400">Xususiyat</th>
              <th className="p-1.5 text-left text-green-400">π-akseptor</th>
              <th className="p-1.5 text-left text-red-400">π-donor</th>
            </tr></thead>
            <tbody>
              {[
                {x:"Ligand orbitali", a:"Bo'sh π*", d:"To'lgan π"},
                {x:"Elektron oqimi", a:"M → L (orqaga donorlik)", d:"L → M (π-donorlik)"},
                {x:"t₂g ga ta'sir", a:"t₂g↓ (stabillashadi)", d:"t₂g↑ (destabillashadi)"},
                {x:"Δ₀ ga ta'sir", a:"Δ₀↑ (kuchli maydon)", d:"Δ₀↓ (kuchsiz maydon)"},
                {x:"Spin holati", a:"Past spin (LS)", d:"Yuqori spin (HS)"},
                {x:"Magnit xossa", a:"Diamagnit", d:"Paramagnit"},
                {x:"Misol ligand", a:"CO, CN⁻, PR₃, NO⁺", d:"Cl⁻, Br⁻, I⁻, F⁻, OH⁻"},
                {x:"Misol kompleks", a:"[Fe(CN)₆]⁴⁻, [Ni(CO)₄]", d:"[CoCl₄]²⁻, [FeF₆]³⁻"},
                {x:"Δ₀ qiymati", a:"25000-36000 cm⁻¹", d:"7000-15000 cm⁻¹"},
                {x:"IQ/VB diagnostika", a:"ν(CO)↓ → kuchli π-akseptor", d:"ν(M−X) past"},
              ].map((r,i)=>(
                <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className="p-1.5 font-bold text-yellow-300">{r.x}</td>
                  <td className="p-1.5 text-green-200">{r.a}</td>
                  <td className="p-1.5 text-red-200">{r.d}</td>
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
// 6. SINERGIK BOG'LANISH — QADAMMA-QADAM TUSHUNTIRISH
// ═══════════════════════════════════════════════════════════════════════════════
function SinergikEnergiya() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1-qadam: σ-donorlik — Ligand metalga elektron beradi",
      icon: "🎯",
      color: "#3b82f6",
      desc: "Ligand (masalan, CO) o'zining **taqsimlanmagan elektron juftini** metallning bo'sh orbitaliga beradi. Bu **σ-bog'** hosil qiladi.",
      detail: [
        "Liganddagi yakka juft elektronlar (σ-simmetriya) metallga o'tadi",
        "Metall atrofida **elektron zichligi ortadi**",
        "M−L σ bog'lovchi MO hosil bo'ladi (energiya past)",
        "Metall boyiydi → π-orqaga donorlikka tayyor"
      ],
      formula: "L(:) + M → L−M (σ-bog')",
      result: "Metall boyidi, elektron zichligi ortdi",
      example: "CO dagi C atomidagi yakka juft → Fe(0) ga"
    },
    {
      title: "2-qadam: π-akseptorlik — Metall elektronni qaytarib oladi",
      icon: "🔄",
      color: "#22c55e",
      desc: "Boyigan metall o'zining **to'lgan d-elektronlarini** (t₂g) ligandning **bo'sh π*-orbitaliga** qaytaradi. Bu **'orqaga donorlik'** (back-donation) deb ataladi.",
      detail: [
        "Metall t₂g (to'lgan) → ligand π* (bo'sh)",
        "π-bog'lovchi MO hosil bo'ladi (qo'shimcha bog')",
        "Bu **ikkala yo'nalishdagi** elektron oqimi: M←L (σ) + M→L (π)",
        "π* orbitali bo'lgan ligandlar: CO, CN⁻, NO⁺, PR₃"
      ],
      formula: "M(d²) → L(π*) (orqaga donorlik)",
      result: "Metallning ortiqcha elektroni qaytarib olindi",
      example: "Fe t₂g → CO π*: C≡O bog'i kuchsizlanadi"
    },
    {
      title: "3-qadam: Sinergiya — Ikkalasi birgalikda kuchayadi",
      icon: "⚡",
      color: "#a855f7",
      desc: "σ-donorlik va π-akseptorlik **bir-birini kuchaytiradi**. Bu **sinergik sikl** deb ataladi: σ-donor metallni boyitadi → boy metall π-orqaga donorlikni kuchaytiradi → kuchli π-akseptor metallni yana σ-donorlikka undaydi.",
      detail: [
        "① σ-donor: L → M (metall boyiydi)",
        "② Boy metall → π*-ga ko'p elektron beradi (kuchli π)",
        "③ Kuchli π → M−L bog'i mustahkamlanadi",
        "④ Mustahkam M−L → kompleks barqarorlashadi",
        "**Natija**: M−L bog'i juda kuchli, L−L' bog'i (C≡O) kuchsiz"
      ],
      formula: "σ(L→M) + π(M→L) = Sinergiya",
      result: "M−L bog'i mustahkam, Δ₀ katta, LS holat",
      example: "[Fe(CO)₅]: Fe−CO kuchli, C≡O kuchsiz (ν=2020 cm⁻¹)"
    }
  ]

  const s = steps[step]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-purple-400">🔄</span> Sinergik bog'lanish — qadamma-qadam tushuntirish
      </h3>

      {/* Step navigation */}
      <div className="flex items-center gap-2 mb-4">
        {steps.map((_, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              step === i
                ? "bg-purple-600 text-white shadow-lg"
                : i < step
                  ? "bg-green-600/30 text-green-300 border border-green-500/30"
                  : "bg-purple-900/50 text-purple-400 border border-purple-700/40"
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
              step === i ? "bg-white text-purple-600" : i < step ? "bg-green-500 text-white" : "bg-purple-800 text-purple-400"
            }`}>
              {i < step ? "✓" : i + 1}
            </span>
            <span className="hidden sm:inline">{["σ-donor", "π-akseptor", "Sinergiya"][i]}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Main content (3/5 width) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Icon + Title */}
          <div className="flex items-center gap-3">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <p className="font-bold text-sm" style={{color: s.color}}>{s.title}</p>
              <p className="text-purple-300 text-[10px]">{s.desc}</p>
            </div>
          </div>

          {/* Principle details */}
          <div className="rounded-xl p-3 text-xs space-y-1.5"
            style={{background: s.color + "12", border: `1px solid ${s.color}40`}}>
            {s.detail.map((d, i) => (
              <p key={i} className="text-purple-200 flex items-start gap-2">
                <span style={{color: s.color}}>•</span>
                <span>{d}</span>
              </p>
            ))}
          </div>

          {/* Formula bar */}
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-2 text-center">
            <p className="text-yellow-300 font-mono text-sm font-bold">{s.formula}</p>
          </div>
        </div>

        {/* Right: Summary panel (2/5 width) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="rounded-xl p-3 text-xs space-y-2 border"
            style={{background: s.color + "15", borderColor: s.color + "35"}}>
            <p className="font-bold text-sm" style={{color: s.color}}>✅ Natija</p>
            <p className="text-purple-200">{s.result}</p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded p-2 mt-1">
              <p className="text-purple-400 font-bold">📌 Misol</p>
              <p className="text-purple-200 mt-0.5">{s.example}</p>
            </div>
          </div>

          {/* Visual diagram: simplified */}
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-xl p-3">
            <p className="text-purple-400 font-bold text-[10px] mb-2">Vizual sxema:</p>
            <div className="flex items-center justify-center gap-2 text-[10px]">
              {step === 0 && (
                <>
                  <div className="bg-blue-500/30 border border-blue-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-blue-300 font-bold">Ligand</p>
                    <p className="text-white text-[9px]">:L</p>
                  </div>
                  <div className="text-blue-400 text-lg">→</div>
                  <div className="bg-amber-500/30 border border-amber-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-amber-300 font-bold">Metall</p>
                    <p className="text-white text-[9px]">M ← e⁻</p>
                  </div>
                </>
              )}
              {step === 1 && (
                <>
                  <div className="bg-amber-500/30 border border-amber-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-amber-300 font-bold">Metall (t₂g)</p>
                    <p className="text-white text-[9px]">d² →</p>
                  </div>
                  <div className="text-green-400 text-lg">→</div>
                  <div className="bg-green-500/30 border border-green-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-green-300 font-bold">Ligand (π*)</p>
                    <p className="text-white text-[9px]">bo'sh</p>
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="bg-blue-500/30 border border-blue-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-blue-300 font-bold">σ: L → M</p>
                    <p className="text-white text-[9px]">boyitadi</p>
                  </div>
                  <div className="text-purple-400 text-lg">⇄</div>
                  <div className="bg-green-500/30 border border-green-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-green-300 font-bold">π: M → L</p>
                    <p className="text-white text-[9px]">barqaror</p>
                  </div>
                  <div className="text-purple-400 text-lg">=</div>
                  <div className="bg-purple-500/30 border border-purple-400/50 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-purple-300 font-bold">⚡ Sinergiya</p>
                    <p className="text-white text-[9px]">kuchli M−L</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 mt-4">
        {step > 0 && (
          <button onClick={() => setStep(p => p - 1)}
            className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-800/60 text-purple-200 hover:bg-purple-700/80 flex items-center gap-1">
            ← Oldingi
          </button>
        )}
        {step < steps.length - 1 && (
          <button onClick={() => setStep(p => p + 1)}
            className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1">
            Keyingi →
          </button>
        )}
        <button onClick={() => setStep(0)}
          className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-900/50 text-purple-400 hover:bg-purple-800">
          Qayta boshlash
        </button>
      </div>

      {/* Progression indicator */}
      <div className="flex gap-1 mt-3">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
            i <= step ? (i < step ? "bg-green-500" : "bg-purple-500") : "bg-purple-900/50"
          }`} />
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. FOSFIN LIGANDLAR — PR₃ TAHLILI
// ═══════════════════════════════════════════════════════════════════════════════
function FosfinTahlili() {
  const [sel, setSel] = useState(0)
  const fosfins = [
    {r:"PMe₃", en:0, tip:"Kuchli σ-donor", col:"#22c55e", sigma:95, pi:20, desc:"Metil — eng kuchli σ-donor fosfin. Kuchsiz π-akseptor.", misol:"[Ni(CO)₃(PMe₃)]", nu:"2060"},
    {r:"PEt₃", en:1, tip:"Kuchli σ-donor", col:"#3b82f6", sigma:90, pi:22, desc:"Etil — Me dan kuchsizroq σ-donor.", misol:"[Pd(PEt₃)₂Cl₂]", nu:"—"},
    {r:"PPh₃", en:2, tip:"O'rtacha σ-donor", col:"#a855f7", sigma:70, pi:45, desc:"Trifenilfosfin — π-akseptorlik yuqori. Aril halqalar σ*", misol:"[Pd(PPh₃)₄], Wilkinson", nu:"2068"},
    {r:"P(OMe)₃", en:3, tip:"Kuchsiz σ-donor", col:"#f59e0b", sigma:55, pi:60, desc:"Fosfit — kuchsiz σ-donor, kuchli π-akseptor.", misol:"[Fe(CO)₄P(OMe)₃]", nu:"—"},
    {r:"PCl₃", en:4, tip:"Juda kuchsiz σ-donor", col:"#ef4444", sigma:30, pi:75, desc:"Xlorli — eng kuchsiz σ-donor. Cl atomlari elektron tortadi.", misol:"[Ni(CO)₃(PCl₃)]", nu:"2085"},
    {r:"PF₃", en:5, tip:"Kuchsiz σ, kuchli π", col:"#dc2626", sigma:25, pi:85, desc:"Eng kuchli π-akseptor fosfin. CO bilan raqobatlashadi.", misol:"[Fe(CO)₄(PF₃)]", nu:"2095"},
  ]
  const f = fosfins[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-indigo-400">🔬</span> PR₃ fosfin ligandlar — σ-donor / π-akseptor nisbati
      </h3>
      <div className="flex gap-1 flex-wrap mb-3">
        {fosfins.map((f,i) => (
          <button key={i} onClick={()=>setSel(i)}
            className={`px-2 py-1 rounded-lg text-[9px] font-bold ${sel===i?"text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
            style={sel===i?{background:f.col+"66"}:{}}>{f.r}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 space-y-1">
          <p className="font-bold text-sm" style={{color:f.col}}>{f.r}</p>
          <p className="text-purple-200">{f.tip}</p>
          <p className="text-purple-200">{f.desc}</p>
          <div className="flex gap-2 mt-1">
            <div className="flex-1 bg-purple-950/80 border border-purple-700/30 rounded p-1.5">
              <p className="text-blue-300 font-bold">σ-donor</p>
              <div className="h-3 bg-purple-950/90 rounded mt-1 overflow-hidden border border-purple-700/30">
                <div className="h-full bg-blue-500 rounded" style={{width:`${f.sigma}%`}} />
              </div>
              <p className="text-blue-300 text-right">{f.sigma}%</p>
            </div>
            <div className="flex-1 bg-purple-950/80 border border-purple-700/30 rounded p-1.5">
              <p className="text-green-300 font-bold">π-akseptor</p>
              <div className="h-3 bg-purple-950/90 rounded mt-1 overflow-hidden border border-purple-700/30">
                <div className="h-full bg-green-500 rounded" style={{width:`${f.pi}%`}} />
              </div>
              <p className="text-green-300 text-right">{f.pi}%</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Xususiyatlari:</p>
          <p className="text-purple-200"><strong>Misol:</strong> <span className="text-cyan-300 font-mono">{f.misol}</span></p>
          {f.nu !== "—" && <p className="text-purple-200"><strong>ν(CO):</strong> <span className="text-yellow-300 font-mono">{f.nu} cm⁻¹</span></p>}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400 font-bold">💡 Tolman elektron parametri (TEP):</p>
            <p className="text-purple-200">ν(CO) ni o'lchash orqali fosfinning σ/π xossalari aniqlanadi. Kichik ν → kuchli σ-donor + kuchsiz π-akseptor.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. AMALIY MISOLLAR — SINERGIK KOMPLEKSLAR
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyMisollar() {
  const [sel, setSel] = useState(0)
  const misollar = [
    {name:"[Ni(CO)₄]", metal:"Ni(0)", d:"3d¹⁰", g:"T_d", delta:"—", nu:"2057 cm⁻¹", note:"18 e⁻. Ni(0) d¹⁰ → kuchli orqaga donorlik. C≡O kuchsizlanadi."},
    {name:"[Fe(CO)₅]", metal:"Fe(0)", d:"3d⁸", g:"D₃h", delta:"—", nu:"2020 cm⁻¹", note:"18 e⁻. Ekvatorial CO vs aksial CO → 2 xil ν(CO)."},
    {name:"[Fe(CN)₆]⁴⁻", metal:"Fe²⁺", d:"3d⁶ LS", g:"O_h", delta:"35000", nu:"—", note:"18 e⁻. CN⁻ kuchli σ-donor + π-akseptor. LS d⁶, diamagnit."},
    {name:"[Co(NH₃)₆]³⁺", metal:"Co³⁺", d:"3d⁶ LS", g:"O_h", delta:"23000", nu:"—", note:"18 e⁻. NH₃ faqat σ-donor. O'rtacha maydon."},
    {name:"[CoCl₄]²⁻", metal:"Co²⁺", d:"3d⁷ HS", g:"T_d", delta:"~3000", nu:"—", note:"15 e⁻. Cl⁻ π-donor. HS d⁷. Paramagnit."},
    {name:"[PtCl₄]²⁻", metal:"Pt²⁺", d:"5d⁸", g:"D₄h", delta:"~20000", nu:"—", note:"16 e⁻. Cl⁻ kuchsiz π-donor. Kv. planar d⁸."},
    {name:"[Pd(PPh₃)₄]", metal:"Pd(0)", d:"4d¹⁰", g:"T_d", delta:"—", nu:"—", note:"18 e⁻. PPh₃ σ-donor + π-akseptor. Katalizator."},
    {name:"Wilkinson RhCl(PPh₃)₃", metal:"Rh⁺", d:"4d⁸", g:"D₃h", delta:"—", nu:"—", note:"16 e⁻. Kv. planar. Gidrogenlash katalizatori."},
  ]
  const m = misollar[sel]
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">🧪</span> Amaliy misollar — sinergik komplekslar tahlili
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
            <div className="flex justify-between"><span className="text-purple-400">Metall:</span><span className="text-cyan-300 font-mono">{m.metal} ({m.d})</span></div>
            <div className="flex justify-between"><span className="text-purple-400">Geometriya:</span><span className="text-amber-300">{m.g}</span></div>
            {m.delta !== "—" && <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-green-300 font-mono">{m.delta} cm⁻¹</span></div>}
            {m.nu !== "—" && <div className="flex justify-between"><span className="text-purple-400">ν(CO):</span><span className="text-yellow-300 font-mono">{m.nu}</span></div>}
          </div>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 space-y-1">
          <p className="text-purple-400 font-bold">Tahlil:</p>
          <p className="text-purple-200">{m.note}</p>
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded p-1.5 mt-1">
            <p className="text-cyan-400 font-bold">Ligand turi:</p>
            <p className="text-purple-200">{["CO","CO","CN⁻","NH₃","Cl⁻","Cl⁻","PPh₃","PPh₃"][sel]} → {[["π-akseptor"],["π-akseptor"],["π-akseptor"],["σ-donor"],["π-donor"],["π-donor"],["π-akseptor"],["π-akseptor"]][sel]}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. MATEMATIK ASOSLAR — TOLMAN PARAMETRLARI
// ═══════════════════════════════════════════════════════════════════════════════
function MatematikAsoslar() {
  const [topic, setTopic] = useState("tolman")
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">📐</span> Matematik asoslar — Tolman parametrlari va π-bog' energetikasi
      </h3>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {[
          {k:"tolman", l:"Tolman parametrlari"},
          {k:"tep", l:"TEP — ν(CO)"},
          {k:"pi_en", l:"π-bog' energiyasi"},
        ].map(v => (
          <button key={v.k} onClick={()=>setTopic(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${topic===v.k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.l}</button>
        ))}
      </div>
      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-4 text-xs font-mono">
        {topic === "tolman" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">Tolman elektron parametrlari (1970):</p>
            <p className="text-purple-200">PR₃ ligandlarning σ-donor va π-akseptor xossalarini miqdoriy baholash:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">TEP = ν(CO) [Ni(CO)₃(PR₃)]</p>
            <p className="text-purple-200">TEP (cm⁻¹) — [Ni(CO)₃(PR₃)] kompleksidagi ν(CO) chastotasi</p>
            <p className="text-purple-200">Kichik TEP → kuchli σ-donor, kuchsiz π-akseptor</p>
            <p className="text-purple-200">Katta TEP → kuchsiz σ-donor, kuchli π-akseptor</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">TEP qiymatlari:</strong></p>
            <p className="text-purple-200">P(t-Bu)₃: 2056 cm⁻¹ (kuchli σ-donor)</p>
            <p className="text-purple-200">PPh₃: 2068 cm⁻¹ (o'rtacha)</p>
            <p className="text-purple-200">PCl₃: 2085 cm⁻¹ (kuchsiz σ-donor, kuchli π-akseptor)</p>
            <p className="text-purple-200">PF₃: 2095 cm⁻¹ (eng kuchli π-akseptor)</p>
          </div>
        )}
        {topic === "tep" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">TEP — Tolman Electronic Parameter:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">TEP = 2056 + Σ χ_i</p>
            <p className="text-purple-200">χ_i — PR₃ dagi R guruhining hissasi (cm⁻¹)</p>
            <p className="text-purple-200">χ(Me) = 0, χ(Et) = 1, χ(Ph) = 12</p>
            <p className="text-purple-200">χ(OMe) = 20, χ(Cl) = 29, χ(F) = 39</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Misol — PPh₃:</strong></p>
            <p className="text-purple-200">TEP = 2056 + 3×12 = 2068 cm⁻¹ (mos keladi!)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Konus burchagi (θ):</strong></p>
            <p className="text-purple-200">θ — PR₃ ligandining sterik hajmi. Katta θ → katta hajm.</p>
            <p className="text-purple-200">PMe₃: θ = 118° | PPh₃: θ = 145° | P(t-Bu)₃: θ = 182°</p>
          </div>
        )}
        {topic === "pi_en" && (
          <div className="space-y-2">
            <p className="text-yellow-300 font-bold text-sm">π-bog' energiyasi (MO nazariyasi):</p>
            <p className="text-purple-200">π-bog' energiyasi qoplanish integraliga proporsional:</p>
            <p className="text-cyan-300 text-center my-2 text-sm">E_π ∝ |β_π|² / ΔE</p>
            <p className="text-purple-200">β_π — π-qoplanish integrali (t₂g va π* orasida)</p>
            <p className="text-purple-200">ΔE = E(π*) − E(t₂g) — energiya farqi</p>
            <p className="text-purple-200">Kichik ΔE → kuchli π-bog' (CO: past π*)</p>
            <p className="text-purple-200">Katta ΔE → kuchsiz π-bog' (Cl⁻: yuqori π*)</p>
            <p className="text-purple-200 mt-2"><strong className="text-green-300">Orqaga donorlik energiyasi:</strong></p>
            <p className="text-purple-200">E_back = n·|β|²/(E_M − E_L*)</p>
            <p className="text-purple-200">n — t₂g dagi elektronlar soni</p>
            <p className="text-purple-200">E_M — metall d-orbital energiyasi</p>
            <p className="text-purple-200">E_L* — ligand π* orbital energiyasi</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function Test() {
  const questions = [
    { q:"CO ligand qanday bog'lanish mexanizmiga ega?", a:"σ-donor + π-akseptor (sinergik)", opts:["Faqat σ-donor","Faqat π-akseptor","σ-donor + π-akseptor (sinergik)","Faqat ion"], hint:"C dagi yakka juft + bo'sh π*." },
    { q:"π-akseptor ligand Δ₀ ga qanday ta'sir qiladi?", a:"t₂g pasayadi → Δ₀ ortadi (kuchli maydon)", opts:["t₂g ortadi → Δ₀ kamayadi","t₂g pasayadi → Δ₀ ortadi (kuchli maydon)","Hech qanday ta'sir","e_g ga ta'sir qiladi"], hint:"Orqaga donorlik t₂g ni stabillashadi." },
    { q:"Spektrokimyoviy qatorda eng kuchli maydonli ligand?", a:"NO⁺", opts:["I⁻","H₂O","NO⁺","Cl⁻"], hint:"Δ₀ ≈ 36000 cm⁻¹. Eng yuqori." },
    { q:"ν(CO) IQ chastotasining pasayishi nimani bildiradi?", a:"Kuchli π-orqaga donorlik → M−C bog'i kuchli", opts:["Kuchsiz π-orqaga donorlik","Kuchli π-orqaga donorlik → M−C bog'i kuchli","Hech narsa","CO konsentratsiyasi yuqori"], hint:"ν↓ → π-orqaga donorlik↑." },
    { q:"Tolman elektron parametri (TEP) nima?", a:"[Ni(CO)₃(PR₃)] da ν(CO) chastotasi", opts:["PR₃ ning bog' uzunligi","[Ni(CO)₃(PR₃)] da ν(CO) chastotasi","P atomining radiusi","PR₃ ning qaynash harorati"], hint:"TEP = ν(CO). Kichik → kuchli σ-donor." },
    { q:"π-donor ligand (Cl⁻) qanday elektron konfiguratsiyaga ega?", a:"To'lgan π-orbitallar (p⁶)", opts:["Bo'sh π* orbitallar","To'lgan π-orbitallar (p⁶)","Yarim to'lgan","π-bog' yo'q"], hint:"Galogenlar p⁶ konfiguratsiyasi." },
    { q:"PR₃ fosfinlarda R ning σ-donorlikka ta'siri?", a:"Alkil (Me, Et) → kuchli σ-donor. Aril (Ph) → kuchsiz", opts:["Alkil kuchsiz, aril kuchli","Alkil → kuchli. Aril → kuchsiz","Hammasi bir xil","Faqat elektr manfiylik"], hint:"Alkil elektron beradi, aril tortadi." },
    { q:"Sinergik bog'lanishda σ-donor va π-akseptor bir-biriga qanday ta'sir qiladi?", a:"Bir-birini kuchaytiradi (sinergiya)", opts:["Bir-birini zaiflashtiradi","Bir-birini kuchaytiradi (sinergiya)","Hech qanday ta'sir","Faqat σ muhim"], hint:"σ donor M ni boyitadi → π orqaga donorlik kuchayadi." },
    { q:"[Ni(CO)₄] dagi ν(CO) erkin CO dan qancha farq qiladi?", a:"2143 − 2057 = 86 cm⁻¹ past", opts:["2143 + 2057 = 4200 cm⁻¹","2143 − 2057 = 86 cm⁻¹ past","Farq yo'q","2000 cm⁻¹"], hint:"Erkin CO: 2143 cm⁻¹. [Ni(CO)₄]: 2057 cm⁻¹." },
    { q:"Tolman konus burchagi (θ) nima?", a:"PR₃ ligandining sterik hajmini o'lchaydi", opts:["PR₃ ning elektron xossasi","PR₃ ligandining sterik hajmini o'lchaydi","P atomining radiusi","ν(CO) chastotasi"], hint:"Katta θ → katta hajmli ligand." },
  ]
  const [c, setC] = useState(0); const [s, setS] = useState(null); const [sc, setSc] = useState(0)
  const [res, setRes] = useState(false); const [ans, setAns] = useState({})
  const q = questions[c]
  if (res) { return (
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc >= 8 ? "🏆" : sc >= 5 ? "👍" : "📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "σ/π ligandlarni mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
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
export default function SigmaPiLigandlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="hover:text-purple-300">Kimyoviy bog'lanish</Link><span className="text-purple-600">›</span>
            <span className="text-purple-400">σ/π ligandlar</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-purple-400 flex items-center gap-2"><span>⚡</span> σ-donor va π-akseptor ligandlar</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Sinergik bog'lanish • ν(CO) IQ diagnostikasi • Spektrokimyoviy qator • Tolman parametrlari • PR₃ • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 σ-donor va π-akseptor ligandlar</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Ligandlarning elektron xususiyatlari</strong> — ularning metall bilan 
                bog'lanish kuchini va kompleksning <strong className="text-cyan-300">maydon kuchi, spin holati va spektrini</strong> belgilaydi.
                σ-donor, π-donor va π-akseptor ligandlarning farqlarini tushunish — kompleks birikmalar kimyosining 
                <strong>eng muhim qismidir</strong>.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">Sinergik bog'</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">ν(CO) IQ</span>
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">Tolman TEP</span>
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">PR₃ tahlili</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-purple-400 font-bold">🎯 Maqsad:</span> σ-donor, π-donor, π-akseptor ligandlar, sinergik bog'lanish va Tolman parametrlarini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">⏱️ Vaqt:</span> ~2.5 soat</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">📚 Manba:</span> C. Tolman — Chem. Rev. 1977; Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-purple-300 font-mono text-xs font-bold">"Ligand — kompleksning xarakterini belgilovchi omil!"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <LigandTurlariCanvas />
        <LigandMalumotJadvali />
        <SpektrokimyoviyQatorInteraktiv />
        <IQDiagnostika />
        <PiDonorVsPiAkseptor />
        <SinergikEnergiya />
        <FosfinTahlili />
        <AmaliyMisollar />
        <MatematikAsoslar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">3 tur ligand:</strong> σ-donor (faqat σ), π-donor (σ + to'lgan π → Δ₀↓), π-akseptor (σ + bo'sh π* → Δ₀↑)</li>
            <li><strong className="text-yellow-400">Sinergik bog'lanish:</strong> σ-donor + π-akseptor bir-birini kuchaytiradi. M−L bog'i mustahkam, L−L' bog'i kuchsiz</li>
            <li><strong className="text-yellow-400">ν(CO) diagnostikasi:</strong> Erkin CO: 2143 cm⁻¹. Past ν → kuchli π-orqaga donorlik → kuchli M−CO</li>
            <li><strong className="text-yellow-400">Spektrokimyoviy qator:</strong> Br⁻ (7k) {'<'} Cl⁻ (13k) {'<'} F⁻ (15k) {'<'} H₂O (18.5k) {'<'} NH₃ (23k) {'<'} CN⁻ (33k) {'<'} CO (35k) {'<'} NO⁺ (36k)</li>
            <li><strong className="text-yellow-400">Tolman TEP:</strong> [Ni(CO)₃(PR₃)] da ν(CO). Kichik TEP → kuchli σ-donor. Katta TEP → kuchli π-akseptor</li>
            <li><strong className="text-yellow-400">PR₃ fosfinlar:</strong> PMe₃ (kuchli σ), PPh₃ (o'rtacha σ + π), PF₃ (kuchli π-akseptor). Tolman konus burchagi θ</li>
            <li><strong className="text-yellow-400">π-bog' energiyasi:</strong> E_π ∝ |β|²/ΔE. Kichik ΔE → kuchli π-bog' (CO). Katta ΔE → kuchsiz (Cl⁻)</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> MO nazariyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20">
            Gibridlanish <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> C.A. Tolman — Chem. Rev. 77, 313 (1977); F.A. Cotton — Chemical Applications of Group Theory</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}