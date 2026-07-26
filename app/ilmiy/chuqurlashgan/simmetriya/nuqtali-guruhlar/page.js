"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV GURUH VIZUALIZATORI
// ═══════════════════════════════════════════════════════════════════════════════
function GuruhVizual() {
  const [group, setGroup] = useState("oh")
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const w = canvas.width, h = canvas.height, cx = w/2, cy = h/2
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = "#0a0018"; ctx.fillRect(0, 0, w, h)

    const drawAxis = (x1,y1,x2,y2,c,l) => {
      ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.setLineDash([4,3])
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); ctx.setLineDash([])
      if(l){ctx.fillStyle=c; ctx.font="9px sans-serif"; ctx.textAlign="center"; ctx.fillText(l,(x1+x2)/2,(y1+y2)/2-6)}
    }

    const shapes = {
      oh: () => {
        drawAxis(cx,0,cx,h,"rgba(255,255,255,0.1)","z"); drawAxis(0,cy,w,cy,"rgba(255,255,255,0.1)","x")
        const r = 75
        const pts = [[cx+r,cy],[cx-r,cy],[cx,cy+r],[cx,cy-r],[cx,cy-r*0.6],[cx,cy+r*0.6]]
        const col = ["#ef4444","#ef4444","#22c55e","#22c55e","#3b82f6","#3b82f6"]
        pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],10,0,Math.PI*2);ctx.fillStyle=col[i];ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(168,85,247,0.4)"; ctx.lineWidth=2
        pts.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#60a5fa"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("O_h — Oktaedrik (6 ta ligand)", cx, 16)
        ctx.fillStyle="rgba(96,165,250,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 48 • i bor • d→T₂g+E_g", cx, 30)
      },
      td: () => {
        const r = 72
        const pts = [[cx,cy-r],[cx+r*0.8,cy+r*0.5],[cx-r*0.8,cy+r*0.5],[cx,cy+r*0.2]]
        pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],9,0,Math.PI*2);ctx.fillStyle="#22c55e";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(168,85,247,0.4)"; ctx.lineWidth=2
        pts.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#22c55e"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("T_d — Tetraedrik (4 ta ligand)", cx, 16)
        ctx.fillStyle="rgba(34,197,94,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 24 • i yo'q • d→E+T₂", cx, 30)
      },
      d4h: () => {
        drawAxis(cx,0,cx,h,"rgba(255,255,255,0.1)","z"); drawAxis(0,cy,w,cy,"rgba(255,255,255,0.1)","x")
        const r = 65
        const pts = [[cx+r,cy],[cx-r,cy],[cx,cy+r],[cx,cy-r]]
        pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],10,0,Math.PI*2);ctx.fillStyle="#a855f7";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(168,85,247,0.4)"; ctx.lineWidth=2
        pts.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.strokeStyle="rgba(168,85,247,0.2)"; ctx.lineWidth=1; ctx.setLineDash([3,3])
        for(let i=0;i<4;i++){const j=(i+1)%4;ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[j][0],pts[j][1]);ctx.stroke()}
        ctx.setLineDash([])
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#a855f7"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("D₄h — Kvadrat tekis (4 ta ligand)", cx, 16)
        ctx.fillStyle="rgba(168,85,247,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 16 • i bor • 4 xil d-sath", cx, 30)
      },
      d3h: () => {
        const r = 55
        const aPts = [[cx,cy-r],[cx,cy+r]]
        const ePts = [[cx-r*0.9,cy+r*0.3],[cx-r*0.9,cy-r*0.3],[cx+r*0.9,cy]]
        aPts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],8,0,Math.PI*2);ctx.fillStyle="#f97316";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ePts.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],8,0,Math.PI*2);ctx.fillStyle="#fbbf24";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(168,85,247,0.4)"; ctx.lineWidth=2
        ;[...aPts,...ePts].forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#f97316"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("D₃h — Trigonal bipiramida (5)", cx, 16)
        ctx.fillStyle="rgba(249,115,22,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 12 • i yo'q • C₃+σ_h", cx, 30)
      },
      c4v: () => {
        drawAxis(cx,0,cx,h,"rgba(255,255,255,0.1)","z")
        const r = 60
        const pts = [[cx+r,cy],[cx-r,cy],[cx,cy+r],[cx,cy-r],[cx,cy-r*0.6]]
        pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],9,0,Math.PI*2);ctx.fillStyle="#06b6d4";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(6,182,212,0.4)"; ctx.lineWidth=2
        pts.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,7,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#06b6d4"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("C₄v — Kvadrat piramida (5)", cx, 16)
        ctx.fillStyle="rgba(6,182,212,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 8 • i yo'q • dipol bor", cx, 30)
      },
      c2v: () => {
        const r = 50
        const pts = [[cx,cy-r],[cx+r*0.6,cy+r*0.2],[cx-r*0.6,cy+r*0.2]]
        pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],8,0,Math.PI*2);ctx.fillStyle="#22d3ee";ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
        ctx.strokeStyle="rgba(34,211,238,0.4)"; ctx.lineWidth=2
        pts.forEach(p=>{ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p[0],p[1]);ctx.stroke()})
        ctx.fillStyle="#fbbf24"; ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill()
        ctx.fillStyle="#22d3ee"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center"
        ctx.fillText("C₂v — Burchakli (V shakl)", cx, 16)
        ctx.fillStyle="rgba(34,211,238,0.6)"; ctx.font="9px sans-serif"
        ctx.fillText("Tartib: 4 • H₂O • dipol bor", cx, 30)
      }
    }
    shapes[group]()
  }, [group])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <div className="flex gap-1.5 flex-wrap mb-4">
        {[
          {k:"oh",l:"O_h Oktaedrik",c:"#60a5fa"},{k:"td",l:"T_d Tetraedrik",c:"#22c55e"},{k:"d4h",l:"D₄h Kvadrat",c:"#a855f7"},
          {k:"d3h",l:"D₃h Trig-bip",c:"#f97316"},{k:"c4v",l:"C₄v Piramida",c:"#06b6d4"},{k:"c2v",l:"C₂v Burchakli",c:"#22d3ee"}
        ].map(v=>(
          <button key={v.k} onClick={()=>setGroup(v.k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${group===v.k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}
            style={group===v.k?{borderColor:v.c,borderWidth:"2px"}:{}}>{v.l}</button>
        ))}
      </div>
      <canvas ref={canvasRef} width={400} height={260} className="w-full h-56 bg-purple-950/60 rounded-xl border border-purple-700/40" />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. GURUHLAR MA'LUMOT BAZASI
// ═══════════════════════════════════════════════════════════════════════════════
const GURUHLAR = {
  oh: {
    name:"O_h — Oktaedrik", icon:"🔷", order:48, i:true,
    elements:"E, 8C₃, 6C₂, 6C₄, 3C₂', i, 6S₄, 8S₆, 3σ_h, 6σ_d",
    irreps:"A₁g, A₂g, E_g, T₁g, T₂g, A₁u, A₂u, E_u, T₁u, T₂u (10 ta)",
    dSplit:"T₂g + E_g", dSplitDetail:"d_xy,d_xz,d_yz (T₂g) • d_z²,d_x²−y² (E_g)",
    complexes:"[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻, [Cr(H₂O)₆]³⁺, SF₆",
    subgroups:"C₄v, D₄h, C₂v, C₃v, D₃d",
    dipol:"Yo'q (i bor)", chiral:"Yo'q (S₆ bor)", iqRaman:"Alternativ taqiq",
    dIntensity:"Kuchsiz (ε~1-100, Laport taqiqlangan)",
    desc:"Eng muhim kompleks guruhi. 48 amal. Barcha muntazam oktaedrik ML₆ komplekslar.",
    color:"text-blue-400",bg:"bg-blue-600/10 border-blue-500/30",
    example:"[Co(NH₃)₆]³⁺"
  },
  td: {
    name:"T_d — Tetraedrik", icon:"🔺", order:24, i:false,
    elements:"E, 8C₃, 3C₂, 6S₄, 6σ_d",
    irreps:"A₁, A₂, E, T₁, T₂ (5 ta)",
    dSplit:"E + T₂", dSplitDetail:"d_z²,d_x²−y² (E) • d_xy,d_xz,d_yz (T₂)",
    complexes:"[CoCl₄]²⁻, [Ni(CO)₄], MnO₄⁻, CH₄",
    subgroups:"C₃v, C₂v, C₃, C₂, S₄",
    dipol:"Yo'q (simmetriya tufayli)", chiral:"Yo'q (S₄ bor)", iqRaman:"Ba'zi modlar ikkalasida faol",
    dIntensity:"Kuchli (ε~100-1000, Laport ruxsat)",
    desc:"Tetraedrik komplekslar. 24 amal. Inversiya markazi YO'Q!",
    color:"text-green-400",bg:"bg-green-600/10 border-green-500/30",
    example:"[CoCl₄]²⁻"
  },
  d4h: {
    name:"D₄h — Kvadrat tekis", icon:"◇", order:16, i:true,
    elements:"E, 2C₄, C₂, 2C₂', 2C₂'', i, 2S₄, σ_h, 2σ_v, 2σ_d",
    irreps:"A₁g, A₂g, B₁g, B₂g, E_g, A₁u, A₂u, B₁u, B₂u, E_u (10 ta)",
    dSplit:"A₁g + B₁g + B₂g + E_g", dSplitDetail:"dz²(A₁g) • dx²−y²(B₁g) • dxy(B₂g) • dxz,dyz(E_g)",
    complexes:"[PtCl₄]²⁻, [Ni(CN)₄]²⁻, [Cu(NH₃)₄]²⁺, [AuCl₄]⁻",
    subgroups:"C₄v, C₂v, C₄, C₂, Cₛ",
    dipol:"Yo'q (i bor)", chiral:"Yo'q", iqRaman:"Alternativ taqiq",
    dIntensity:"Kuchsiz",
    desc:"d⁸ metallar (Pt²⁺, Pd²⁺, Au³⁺) uchun xarakterli.",
    color:"text-purple-400",bg:"bg-purple-600/10 border-purple-500/30",
    example:"[PtCl₄]²⁻"
  },
  d3h: {
    name:"D₃h — Trigonal bipiramida", icon:"⭐", order:12, i:false,
    elements:"E, 2C₃, 3C₂, σ_h, 2S₃, 3σ_v",
    irreps:"A₁', A₂', E', A₁'', A₂'', E'' (6 ta)",
    dSplit:"A₁' + E' + E''", dSplitDetail:"dz²(A₁') • dx²−y²,dxy(E') • dxz,dyz(E'')",
    complexes:"[Fe(CO)₅], PF₅, PCl₅, [CoCl₅]³⁻",
    subgroups:"C₃v, C₂v, C₃, C₂",
    dipol:"Yo'q", chiral:"Yo'q (σ_h bor)", iqRaman:"σ_h bo'yicha seleksiya",
    dIntensity:"O'rtacha",
    desc:"5 ta ligand. 2 aksial + 3 ekvatorial. σ_h mavjud.",
    color:"text-yellow-400",bg:"bg-yellow-600/10 border-yellow-500/30",
    example:"PF₅"
  },
  c4v: {
    name:"C₄v — Kvadrat piramida", icon:"🔺", order:8, i:false,
    elements:"E, 2C₄, C₂, 4σ_v",
    irreps:"A₁, A₂, B₁, B₂, E (5 ta)",
    dSplit:"A₁ + B₁ + B₂ + E", dSplitDetail:"dz²(A₁) • dx²−y²(B₁) • dxy(B₂) • dxz,dyz(E)",
    complexes:"[VO(acac)₂], [Ni(CN)₅]³⁻, [FeBr₅]²⁻",
    subgroups:"C₂v, C₄, C₂",
    dipol:"Bor (z o'qi bo'ylab)", chiral:"Yo'q (σ_v bor)", iqRaman:"Ajratish mumkin",
    dIntensity:"O'rtacha-kuchli",
    desc:"5 ta ligand. Oktaedrdan bir ligandni olib tashlash.",
    color:"text-cyan-400",bg:"bg-cyan-600/10 border-cyan-500/30",
    example:"[VO(acac)₂]"
  },
  c2v: {
    name:"C₂v — Burchakli", icon:"📐", order:4, i:false,
    elements:"E, C₂, σ_v(xz), σ_v'(yz)",
    irreps:"A₁, A₂, B₁, B₂ (4 ta)",
    dSplit:"3A₁ + A₂ + 2B₁ + 2B₂", dSplitDetail:"Barcha orbitallar turli IRREPS",
    complexes:"H₂O, SO₂, cis-[Pt(NH₃)₂Cl₂], NO₂⁻",
    subgroups:"C₂, Cₛ, C₁",
    dipol:"Bor", chiral:"Yo'q (σ_v bor)", iqRaman:"Barcha modlar IQ va Raman faol",
    dIntensity:"Kuchli",
    desc:"Eng past simmetriya. 4 amal. C₂ + 2σ_v.",
    color:"text-teal-400",bg:"bg-teal-600/10 border-teal-500/30",
    example:"H₂O"
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. GURUH MA'LUMOT PANELI
// ═══════════════════════════════════════════════════════════════════════════════
function GuruhMalumot() {
  const [group, setGroup] = useState("oh")
  const g = GURUHLAR[group]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.keys(GURUHLAR).map(k=>{
          const v=GURUHLAR[k]
          return (
            <button key={k} onClick={()=>setGroup(k)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${group===k ? `${v.bg} ${v.color} scale-105`:"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
              {v.icon} {v.name}
            </button>
          )
        })}
      </div>

      <div className={`rounded-xl p-4 sm:p-5 border ${g.bg}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`font-bold text-lg ${g.color}`}>{g.name}</h4>
              <span className="text-purple-400 text-xs">Tartib = {g.order}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${g.i?"bg-green-700/30 text-green-300":"bg-red-700/30 text-red-300"}`}>
                {g.i ? "✓ inversiya markazi bor" : "✗ inversiya markazi yo'q"}
              </span>
            </div>
            <p className="text-purple-200 text-xs">{g.desc}</p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1.5">
              <p className="text-purple-400">Simmetriya elementlari: <span className="text-purple-200">{g.elements}</span></p>
              <p className="text-purple-400">IRREPS: <span className="text-purple-200 font-mono">{g.irreps}</span></p>
              <p className="text-purple-400">d-orbital ajralishi: <span className="text-purple-200">{g.dSplit}</span></p>
              <p className="text-purple-300 text-[10px] font-mono">{g.dSplitDetail}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1.5">
              <p className="flex justify-between"><span className="text-purple-400">Misol:</span><span className="text-purple-200">{g.complexes}</span></p>
              <p className="flex justify-between"><span className="text-purple-400">Ichki guruhlar:</span><span className="text-purple-200">{g.subgroups}</span></p>
              <p className="flex justify-between"><span className="text-purple-400">Dipol moment:</span><span className="text-purple-200">{g.dipol}</span></p>
              <p className="flex justify-between"><span className="text-purple-400">Xirallik:</span><span className="text-purple-200">{g.chiral}</span></p>
              <p className="flex justify-between"><span className="text-purple-400">IQ/Raman:</span><span className="text-purple-200">{g.iqRaman}</span></p>
              <p className="flex justify-between"><span className="text-purple-400">d-d intensivligi:</span><span className="text-purple-200">{g.dIntensity}</span></p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-yellow-400 font-bold">🔬 </p>
              <p className="text-purple-200">{g.example}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. TO'LIQ GURUHLAR JADVALI
// ═══════════════════════════════════════════════════════════════════════════════
function GuruhJadvali() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📊</span> Kompleks birikmalar uchun nuqtali guruhlar — to'liq jadval
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1.5 sm:p-2 text-left text-amber-400">Guruh</th>
              <th className="p-1.5 sm:p-2 text-left text-purple-200">Geometriya</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">Tartib</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">i</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">d-orb. ajralishi</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden md:table-cell">Dipol</th>
              <th className="p-1.5 sm:p-2 text-left text-purple-200">Misol</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(GURUHLAR).map(([k,v],i)=>(
              <tr key={k} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className={`p-1.5 sm:p-2 font-bold font-mono ${v.color}`}>{v.name.split("—")[0].trim()}</td>
                <td className="p-1.5 sm:p-2 text-purple-200">{v.icon} {k==="oh"?"Oktaedrik":k==="td"?"Tetraedrik":k==="d4h"?"Kvadrat tekis":k==="d3h"?"Trig. bipiramida":k==="c4v"?"Kv. piramida":"Burchakli"}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-200">{v.order}</td>
                <td className="p-1.5 sm:p-2 text-center">{v.i?<span className="text-green-400">✓</span>:<span className="text-red-400">✗</span>}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-300 font-mono text-[8px] sm:text-[10px]">{v.dSplit}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-300 hidden md:table-cell">{v.dipol.includes("Yo'q")?"0":"≠0"}</td>
                <td className="p-1.5 sm:p-2 text-purple-200 text-[8px] sm:text-[10px]">{v.complexes.split(",")[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SIMMETRIYA PASSAJI (O_h → past guruhlar)
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaPassaji() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">⬇️</span> Oktaedrik simmetriyaning pasayishi — ligand almashinishi
      </h3>
      <p className="text-purple-200 text-xs mb-4">
        [ML₆] O_h (48 amal) — ligandlar almashganda simmetriya pasayadi:
      </p>
      <div className="space-y-2">
        {[
          {formula:"[ML₆]", group:"O_h", order:48, i:"✓", desc:"Barcha 6 ta ligand bir xil. 48 amal. Ideal oktaedr."},
          {formula:"[ML₅X]", group:"C₄v", order:8, i:"✗", desc:"Bitta ligand farqli. 48→8 amal. Kvadrat piramida."},
          {formula:"trans-[ML₄X₂]", group:"D₄h", order:16, i:"✓", desc:"Qarama-qarshi 2 ligand farqli. 48→16 amal."},
          {formula:"cis-[ML₄X₂]", group:"C₂v", order:4, i:"✗", desc:"Yonma-yon 2 ligand farqli. 48→4 amal."},
          {formula:"fac-[ML₃X₃]", group:"C₃v", order:6, i:"✗", desc:"Uchburchak yuzida 3 ta X. 48→6 amal."},
          {formula:"mer-[ML₃X₃]", group:"C₂v", order:4, i:"✗", desc:"Meridional 3 ta X. 48→4 amal."},
        ].map((r,i)=>(
          <div key={i} className="grid grid-cols-5 sm:grid-cols-6 gap-2 bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[10px] items-center">
            <span className="text-yellow-300 font-mono font-bold">{r.formula}</span>
            <span className="text-amber-300 font-bold">{r.group}</span>
            <span className="text-purple-300">{r.order}</span>
            <span className={r.i==="✓"?"text-green-400":"text-red-400"}>{r.i}</span>
            <span className="text-purple-200 col-span-2 sm:col-span-2">{r.desc}</span>
          </div>
        ))}
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ Simmetriya pasayishi = degeneratsiyaning yo'qolishi. Spektrlarda polosalar soni ortadi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. GURUHNI ANIQLASH ALGORITMI
// ═══════════════════════════════════════════════════════════════════════════════
function AniqlashAlgoritmi() {
  const [step, setStep] = useState(1)
  const steps = [
    { title:"Maxsus guruhlar?", q:"Molekula yuqori simmetriyali maxsus guruhlardan biriga kiradimi?", opts:["Oktaedrik (O_h)","Tetraedrik (T_d)","Chiziqli (D∞h)","Oddiy"], result:"Oktaedrik → O_h (48). Tetraedrik → T_d (24). Chiziqli → D∞h yoki C∞v." },
    { title:"Bosh o'q Cₙ", q:"Eng yuqori tartibli aylanish o'qini toping (Cₙ). n = ?", opts:["n=2","n=3","n=4","n=5","n=6"], result:"Cₙ aniqlangandan keyin n guruhni belgilaydi." },
    { title:"C₂ o'qlari?", q:"Cₙ ga perpendikulyar C₂ o'qlari bormi?", opts:["Ha → D guruhi","Yo'q → C guruhi"], result:"Ha → D (diedral). Yo'q → C (siklik) yoki S." },
    { title:"σ_h tekisligi?", q:"Cₙ ga perpendikulyar σ_h tekisligi bormi?", opts:["Ha","Yo'q"], result:"Ha → Dₙₕ yoki Cₙₕ. Yo'q → keyingi qadam." },
    { title:"σ_v / σ_d?", q:"Cₙ ni o'z ichiga olgan σ_v yoki σ_d bormi?", opts:["Ha","Yo'q"], result:"Ha → Dₙd yoki Cₙᵥ. Yo'q → Dₙ yoki Cₙ." },
  ]
  const s = steps[step-1]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-emerald-400">🧭</span> Nuqtali guruhni aniqlash — interaktiv algoritm
      </h3>
      <div className="flex items-center gap-1.5 mb-3">
        {steps.map((_,i)=>(
          <div key={i} className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step===i+1?"bg-purple-600 text-white":i<step?"bg-green-600/50 text-green-200":"bg-purple-900/60 text-purple-500"}`}>{i+1}</div>
        ))}
        <span className="text-purple-400 text-[10px]">Qadam {step}/{steps.length}</span>
      </div>
      <h4 className="text-white font-bold text-xs mb-2">{s.title}</h4>
      <p className="text-purple-200 text-xs sm:text-sm mb-3">{s.q}</p>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {s.opts.map((opt,i)=>(
          <button key={i} onClick={()=>{if(step<steps.length)setStep(p=>p+1)}}
            className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-purple-800/60 hover:bg-purple-700/80 text-purple-200 transition-all border border-purple-700/40">{opt}</button>
        ))}
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-xs">
        <p className="text-purple-400">🗺️ Natija: <span className="text-purple-200">{s.result}</span></p>
      </div>
      <button onClick={()=>setStep(1)} className="mt-2 text-[10px] text-purple-400 hover:text-purple-200 underline">Qayta boshlash</button>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. GURUH VA XOSSALAR
// ═══════════════════════════════════════════════════════════════════════════════
function GuruhXossalari() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">💡</span> Nuqtali guruh va kompleks xossalari
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {t:"Dipol moment",d:"i bor → dipol = 0 (O_h, D4h). T_d da simmetriya tufayli 0. C4v, C2v da dipol bor."},
          {t:"Xirallik (optik faollik)",d:"Sₙ bo'lmasa → xiral. O_h, T_d, D4h — xiral emas. D₃ (tris-xelat) — xiral!"},
          {t:"IQ/Raman faollik",d:"i bor → alternativ taqiq. i yo'q → ba'zi modlar ikkalasida faol."},
          {t:"d-orbital ajralishi",d:"O_h: T₂g+E_g. T_d: E+T₂ (teskari). D4h: 4 xil sath."},
          {t:"d-d o'tish intensivligi",d:"i bor → Laport taqiqlangan (kuchsiz). i yo'q → ruxsat (kuchli)."},
          {t:"Degeneratsiya",d:"E=2D, T=3D. Past simmetriya → degeneratsiya kamayadi."},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold mb-0.5">{r.t}</p>
            <p className="text-purple-200">{r.d}</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-xs mt-3">
        <p className="text-purple-400 font-bold">📌 Amaliy misol — [PtCl₄]²⁻ guruhini aniqlash:</p>
        <p className="text-purple-200">1) Maxsus emas. 2) C₄ (⊥). 3) 4×C₂ ⊥ → D. 4) σ_h bor → D₄h. Natija: D₄h — kvadrat tekis.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestGuruhlar() {
  const questions = [
    { q: "O_h guruhida nechta simmetriya amali bor?", a: "48 ta", opts: ["12 ta", "24 ta", "48 ta", "6 ta"], hint: "Eng yuqori simmetriyali guruh" },
    { q: "Tetraedrik (T_d) va oktaedrik (O_h) ni farqlash belgisi?", a: "Inversiya markazi (i)", opts: ["C₄ o'qi", "Inversiya markazi (i)", "C₃ soni", "σ_h tekisligi"], hint: "T_d da i yo'q, O_h da i bor" },
    { q: "D₄h guruhi qaysi geometriyaga mos keladi?", a: "Kvadrat tekis", opts: ["Oktaedrik", "Tetraedrik", "Kvadrat tekis", "Trigonal bipiramida"], hint: "d⁸ metallar" },
    { q: "Qaysi guruhda dipol moment noldan farqli bo'lishi mumkin?", a: "C₂v", opts: ["O_h", "T_d", "C₂v", "D₄h"], hint: "i yo'q va simmetriya past" },
    { q: "trans-[Co(NH₃)₄Cl₂]⁺ qaysi guruhga kiradi?", a: "D₄h", opts: ["O_h", "D₄h", "C₄v", "C₂v"], hint: "Qarama-qarshi 2 xil ligand" },
    { q: "Xiral (optik faol) kompleks qaysi guruhga mansub?", a: "D₃ (tris-xelat)", opts: ["O_h", "T_d", "D₃ (tris-xelat)", "D₄h"], hint: "Sₙ yo'q" },
    { q: "O_h da d-orbitallar qanday ajraladi?", a: "T₂g + E_g", opts: ["T₂g + E_g", "E + T₂", "4 xil sath", "Ajralmaydi"], hint: "3 + 2" },
    { q: "C₄v guruhi qanday geometriya?", a: "Kvadrat piramida", opts: ["Kvadrat tekis", "Kvadrat piramida", "Tetraedrik", "Trigonal bipiramida"], hint: "[VO(acac)₂]" },
    { q: "Inversiya markazi bor guruhlarda IQ va Raman...", a: "Alternativ taqiq", opts: ["Bir xil", "Alternativ taqiq", "Ikkalasi ham faol", "Hech biri faol emas"], hint: "Laport qoidasi" },
    { q: "Nuqtali guruhlarda tartib (order) nimani anglatadi?", a: "Simmetriya amallarining umumiy soni", opts: ["Atomlar soni", "Simmetriya amallarining umumiy soni", "Ligandlar soni", "Elektronlar soni"], hint: "O_h=48, T_d=24" },
  ]

  const [c,setC]=useState(0); const [s,setS]=useState(null); const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false); const [ans,setAns]=useState({})
  const q=questions[c]
  if(res){return(
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc>=8?"🏆":sc>=5?"👍":"📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <button onClick={()=>{setC(0);setS(null);setSc(0);setRes(false);setAns({})}} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm">Qayta</button>
      </div></div>
  )}
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg">📝 Bilim tekshirish — {c+1}/{questions.length}</h3>
      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-6">
        <p className="text-white font-bold text-base mb-4">{q.q}</p>
        <div className="grid grid-cols-1 gap-2 mb-4">
          {q.opts.map((opt,i)=>(
            <button key={i} onClick={()=>!s&&(()=>{setS(opt);const ok=opt===q.a;if(ok&&!ans[c])setSc(p=>p+1);setAns(p=>({...p,[c]:ok}))})()}
              className={`p-3 rounded-xl text-sm text-left border transition-all ${s===opt?(opt===q.a?"bg-green-600/20 border-green-500 text-green-200":"bg-red-600/20 border-red-500 text-red-200"):s?(opt===q.a?"bg-green-600/20 border-green-500 text-green-200 opacity-60":"bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50"):"bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"}`}>
              {opt}</button>
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
export default function NuqtaliGuruhlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span className="text-purple-600">›</span>
            <span className="text-orange-400">Nuqtali guruhlar</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-orange-400 flex items-center gap-2"><span>🏷️</span> Nuqtali guruhlar</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">O_h • T_d • D4h • D3h • C4v • C2v • Schoenflies • Guruh → xossalar • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Nuqtali guruhlar — simmetriya klassifikatsiyasi</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Nuqtali guruh</strong> — molekulaning barcha simmetriya amallarining matematik to'plami. 
                "Nuqtali" deyilishining sababi — barcha simmetriya elementlari <strong>kamida bitta nuqtada kesishadi</strong> 
                (molekulaning massa markazi). Schoenflies belgilari — nemis matematigi Artur Schoenflies tomonidan taklif qilingan.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">6 ta guruh</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">Simmetriya pasayishi</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-orange-400 font-bold">🎯 Maqsad:</span> Nuqtali guruhlar, ularning xossalarini va guruh → fizik xossalar bog'liqligini tushunish.</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-orange-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-orange-300 font-mono text-xs font-bold">Guruh nazariyasi — simmetriyaning matematik tili</p>
              </div>
            </div>
          </div>
        </div>

        {/* VIZUAL + MA'LUMOT */}
        <GuruhVizual />
        <GuruhMalumot />

        {/* JADVAL + PASSAJ */}
        <GuruhJadvali />
        <SimmetriyaPassaji />

        {/* ALGORITM + XOSSALAR */}
        <AniqlashAlgoritmi />
        <GuruhXossalari />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestGuruhlar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Nuqtali guruh</strong> — molekulaning barcha simmetriya amallari to'plami, Schoenflies belgilari</li>
            <li><strong className="text-blue-400">O_h (48):</strong> oktaedrik — eng muhim. i bor, d→T₂g+E_g, dipol=0</li>
            <li><strong className="text-green-400">T_d (24):</strong> tetraedrik. i yo'q, S₄ bor C₄ yo'q, d→E+T₂ (teskari)</li>
            <li><strong className="text-purple-400">D4h (16):</strong> kvadrat tekis. d⁸ metallar. i bor, 4 xil d-sath</li>
            <li>Simmetriya pasayishi: O_h → C₄v → D4h → C₂v. Degeneratsiya kamayadi.</li>
            <li><strong className="text-yellow-400">Guruh → xossalar:</strong> dipol moment, optik faollik, IQ/Raman, d-orbital ajralishi</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/elementlar" className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2"><span>←</span> Simmetriya elementlari</Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/xarakterlar" className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-orange-500/20">Xarakterlar jadvali <span>→</span></Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory | Housecroft — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
