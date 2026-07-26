"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. 3N−6 KALKULYATOR
// ═══════════════════════════════════════════════════════════════════════════════
function NormalModKalkulyator() {
  const [n, setN] = useState(7)
  const [linear, setLinear] = useState(false)

  const dof = 3 * n
  const vib = linear ? dof - 5 : dof - 6

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🔢</span> 3N−6 kalkulyatori — erkinlik darajalari
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">
            <strong className="text-yellow-400">Normal tebranish modi</strong> — molekuladagi barcha atomlarning 
            bir xil chastota bilan va <strong>fazada</strong> tebranadigan mustaqil tebranish turi.
            N atomli nochiziqli molekulada <strong>3N−6</strong>, chiziqlida <strong>3N−5</strong>.
          </p>
          <div className="flex gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-purple-400 text-[10px]">N (atomlar):</span>
              <div className="flex gap-1 flex-wrap">
                {[2,3,4,5,6,7,8,9,10].map(v=>(
                  <button key={v} onClick={()=>setN(v)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${n===v?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v}</button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={linear} onChange={()=>setLinear(!linear)} className="accent-purple-500"/>
              <span className="text-purple-300 text-[10px]">Chiziqli</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              {l:"Umumiy (3N)",v:dof,c:"text-blue-300"},{l:"Ilgarilanma",v:"3",c:"text-yellow-300"},{l:"Aylanma",v:linear?"2":"3",c:"text-orange-300"},
              {l:"Tebranish",v:vib,c:"text-green-400 font-bold",b:"1px solid #22c55e"}
            ].map((r,i)=>(
              <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-center">
                <p className="text-purple-400 text-[9px]">{r.l}</p>
                <p className={`text-lg font-bold font-mono ${r.c}`} style={r.b?{borderBottom:r.b}:{}}>{r.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-purple-300 text-xs">Misol komplekslar uchun tebranish modlari:</p>
          {[
            {mol:"[Ag(NH₃)₂]⁺",n:3,ch:true,v:4},
            {mol:"[CoCl₄]²⁻",n:5,ch:false,v:9},
            {mol:"[PtCl₄]²⁻",n:5,ch:false,v:9},
            {mol:"[Fe(CO)₅]",n:6,ch:false,v:12},
            {mol:"[Co(NH₃)₆]³⁺",n:7,ch:false,v:15},
            {mol:"[Fe(CN)₆]⁴⁻",n:7,ch:false,v:15},
          ].map((r,i)=>(
            <div key={i} className="flex items-center justify-between bg-purple-950/50 border border-purple-700/30 rounded-lg p-1.5 text-[10px]">
              <span className="text-yellow-300 font-mono">{r.mol}</span>
              <span className="text-purple-400">N={r.n}</span>
              <span className={`font-bold font-mono ${r.mol.includes("Co(NH₃)₆")||r.mol.includes("Fe(CN)₆")?"text-green-400":"text-purple-300"}`}>{r.v} ta</span>
            </div>
          ))}
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
            <p className="text-yellow-400 font-bold">⚡ Oktaedrik [ML₆] (N=7): 3N−6 = 21−6 = 15 ta normal mod</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. Γ_VIB — SIMMETRIYA TAHLILI
// ═══════════════════════════════════════════════════════════════════════════════
function SimmetriyaTahlili() {
  const [geo, setGeo] = useState("oh")

  const data = {
    oh: {
      name:"O_h — Oktaedrik [ML₆]", icon:"🔷",
      gamma: "A₁g + E_g + T₁g + T₂g + 2T₁u + T₂u",
      gamma3N: "A₁g + E_g + T₁g + T₂g + 2T₁u + T₂u + T₁g + T₂u",
      trans: "T₁u", rot: "T₁g",
      vib: [
        {mode:"ν₁",sym:"A₁g",iq:false,raman:true,int:"Kuchli",type:"To'liq simmetrik M−L valent",cm:"~500",note:"Eng kuchli Raman. Barcha 6 bog' fazada."},
        {mode:"ν₂",sym:"E_g",iq:false,raman:true,int:"O'rtacha",type:"Ekvatorial M−L valent (degenerat)",cm:"~450",note:"4 ekvatorial + 2 aksial."},
        {mode:"ν₃",sym:"T₁u",iq:true,raman:false,int:"Juda kuchli",type:"Asimmetrik M−L valent",cm:"~400",note:"IQ da eng kuchli."},
        {mode:"ν₄",sym:"T₁u",iq:true,raman:false,int:"O'rtacha",type:"L−M−L deformatsion",cm:"~300",note:"Burchak tebranishi."},
        {mode:"ν₅",sym:"T₂g",iq:false,raman:true,int:"Kuchsiz",type:"L−M−L deformatsion",cm:"~250",note:"Raman da kuchsiz."},
        {mode:"ν₆",sym:"T₂u",iq:false,raman:false,int:"—",type:"\"Jim\" moda (noaktiv)",cm:"~200",note:"Hech qanday spektrda ko'rinmaydi."},
      ],
      note:"6 ta tebranish modidan 4 tasi spektral faol: IQ da 2 ta (ν₃, ν₄), Raman da 3 ta (ν₁, ν₂, ν₅). Alternativ taqiq amal qiladi."
    },
    td: {
      name:"T_d — Tetraedrik [ML₄]", icon:"🔺",
      gamma: "A₁ + E + 2T₂",
      gamma3N: "A₁ + E + T₁ + T₂ + T₁ + T₂",
      trans: "T₂", rot: "T₁",
      vib: [
        {mode:"ν₁",sym:"A₁",iq:false,raman:true,int:"Kuchli",type:"Simmetrik M−L valent",cm:"~480",note:"Faqat Raman."},
        {mode:"ν₂",sym:"E",iq:false,raman:true,int:"O'rtacha",type:"Deformatsion",cm:"~350",note:"Faqat Raman."},
        {mode:"ν₃",sym:"T₂",iq:true,raman:true,int:"Kuchli",type:"Asimmetrik M−L valent",cm:"~380",note:"HAM IQ, HAM Raman!"},
        {mode:"ν₄",sym:"T₂",iq:true,raman:true,int:"O'rtacha",type:"Deformatsion",cm:"~280",note:"HAM IQ, HAM Raman!"},
      ],
      note:"4 ta tebranish. A₁ va E faqat Raman. T₂ — ham IQ, ham Raman faol. Alternativ taqiq YO'Q!"
    },
    d4h: {
      name:"D₄h — Kvadrat tekis [ML₄]", icon:"◇",
      gamma: "A₁g + B₁g + B₂g + A₂u + B₂u + 2E_u",
      gamma3N: "A₁g+A₂g+B₁g+B₂g+E_g+A₂u+B₂u+E_u+A₂u+E_u",
      trans: "A₂u + E_u", rot: "A₂g + E_g",
      vib: [
        {mode:"ν₁",sym:"A₁g",iq:false,raman:true,int:"Kuchli",type:"Simmetrik M−L valent",cm:"~340",note:"Raman."},
        {mode:"ν₂",sym:"B₁g",iq:false,raman:true,int:"O'rtacha",type:"M−L valent",cm:"~290",note:"Raman."},
        {mode:"ν₃",sym:"B₂g",iq:false,raman:true,int:"Kuchsiz",type:"M−L valent",cm:"~260",note:"Raman."},
        {mode:"ν₄",sym:"A₂u",iq:true,raman:false,int:"Kuchli",type:"M−L valent (z)",cm:"~320",note:"IQ."},
        {mode:"ν₅",sym:"E_u",iq:true,raman:false,int:"O'rtacha",type:"M−L valent (xy)",cm:"~280",note:"IQ, degenerat."},
        {mode:"ν₆",sym:"B₂u",iq:false,raman:false,int:"—",type:"\"Jim\" moda",cm:"~220",note:"Noaktiv."},
      ],
      note:"6 ta tebranish. IQ da 3 ta, Raman da 3 ta. Alternativ taqiq amal qiladi."
    }
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">📊</span> Γ_vib — simmetriya tahlili
      </h3>
      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(data).map(([k,v])=>(
          <button key={k} onClick={()=>setGeo(k)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.icon} {v.name}</button>
        ))}
      </div>

      <div className="space-y-3 mb-4">
        <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-purple-400">Γ<sub>3N</sub> = <span className="text-yellow-300 font-mono">{d.gamma3N}</span></p>
          <p className="text-purple-400">Γ<sub>trans</sub> = <span className="text-blue-300 font-mono">{d.trans}</span>, Γ<sub>rot</sub> = <span className="text-orange-300 font-mono">{d.rot}</span></p>
          <p className="text-purple-400">Γ<sub>vib</sub> = Γ<sub>3N</sub> − Γ<sub>trans</sub> − Γ<sub>rot</sub> = <span className="text-green-300 font-mono font-bold">{d.gamma}</span></p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-1 sm:p-1.5 text-left text-amber-400">Mod</th>
                <th className="p-1 sm:p-1.5 text-left text-amber-400">IRREPS</th>
                <th className="p-1 sm:p-1.5 text-center text-purple-200">IQ</th>
                <th className="p-1 sm:p-1.5 text-center text-purple-200">Raman</th>
                <th className="p-1 sm:p-1.5 text-center text-purple-200 hidden sm:table-cell">Intensivlik</th>
                <th className="p-1 sm:p-1.5 text-left text-purple-200">Tebranish turi</th>
                <th className="p-1 sm:p-1.5 text-center text-purple-200 hidden md:table-cell">~cm⁻¹</th>
              </tr>
            </thead>
            <tbody>
              {d.vib.map((r,i)=>(
                <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className="p-1 sm:p-1.5 font-bold text-yellow-300 font-mono">{r.mode}</td>
                  <td className={`p-1 sm:p-1.5 font-mono font-bold ${r.sym.includes("g")?"text-green-400":"text-blue-300"}`}>{r.sym}</td>
                  <td className="p-1 sm:p-1.5 text-center">{r.iq?<span className="text-green-400">✓</span>:<span className="text-red-400">✗</span>}</td>
                  <td className="p-1 sm:p-1.5 text-center">{r.raman?<span className="text-green-400">✓</span>:<span className="text-red-400">✗</span>}</td>
                  <td className="p-1 sm:p-1.5 text-center text-purple-300 hidden sm:table-cell">{r.int}</td>
                  <td className="p-1 sm:p-1.5 text-purple-200 text-[8px] sm:text-[10px]">{r.type}</td>
                  <td className="p-1 sm:p-1.5 text-center text-purple-400 font-mono hidden md:table-cell">{r.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
        <p className="text-yellow-400 font-bold">💡 </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. INTERAKTIV TEBRANISH MODLARI
// ═══════════════════════════════════════════════════════════════════════════════
function TebranishCanvas() {
  const [mode, setMode] = useState(0)
  const canvasRef = useRef(null)

  const modes = [
    { name:"ν₁ (A₁g)", desc:"To'liq simmetrik — barcha 6 ta M−L bog'i fazada cho'ziladi/qisqaradi", iq:false, raman:true, cm:"~500", color:"#22c55e",
      draw:(ctx,cx,cy)=>{
        const r=50;ctx.lineWidth=3;ctx.strokeStyle="#22c55e"
        ;[[cx+r,cy],[cx-r,cy],[cx,cy+r],[cx,cy-r],[cx,cy-r*0.5],[cx,cy+r*0.5]].forEach((p,i)=>{
          const amp=8;const dx=p[0]-cx,dy=p[1]-cy;const nd=Math.sqrt(dx*dx+dy*dy);const nx=dx/nd,ny=dy/nd
          ctx.beginPath();ctx.moveTo(p[0]-nx*amp,p[1]-ny*amp);ctx.lineTo(p[0]+nx*amp,p[1]+ny*amp);ctx.stroke()
        })
        ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fill()
        ctx.fillStyle="#22c55e";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText("Simmetrik valent",cx,cy+r+22)
      }
    },
    { name:"ν₃ (T₁u)", desc:"Asimmetrik — qarama-qarshi bog'lar qarama-qarshi fazada", iq:true, raman:false, cm:"~400", color:"#ef4444",
      draw:(ctx,cx,cy)=>{
        const r=50;ctx.lineWidth=3
        const pts=[[cx+r,cy,1],[cx-r,cy,-1],[cx,cy+r,1],[cx,cy-r,-1],[cx,cy-r*0.5,1],[cx,cy+r*0.5,-1]]
        pts.forEach(([px,py,s])=>{const amp=8*s;ctx.strokeStyle="#ef4444";ctx.beginPath();ctx.moveTo(px-amp,py);ctx.lineTo(px+amp,py);ctx.stroke()})
        ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fill()
        ctx.fillStyle="#ef4444";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText("Asimmetrik valent",cx,cy+r+22)
      }
    },
    { name:"ν₄ (T₁u)", desc:"Deformatsion — L−M−L burchaklari o'zgaradi", iq:true, raman:false, cm:"~300", color:"#3b82f6",
      draw:(ctx,cx,cy)=>{
        const r=50;ctx.strokeStyle="#3b82f6";ctx.lineWidth=2
        const pts=[[cx+r,cy],[cx-r,cy],[cx,cy+r],[cx,cy-r],[cx,cy-r*0.5],[cx,cy+r*0.5]]
        pts.forEach((p,i)=>{
          const a=i*Math.PI/3+Math.sin(Date.now()/500)*0.2
          ctx.beginPath();ctx.arc(p[0]+Math.cos(a)*6,p[1]+Math.sin(a)*6,9,0,Math.PI*2);ctx.stroke()
        })
        ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(cx,cy,7,0,Math.PI*2);ctx.fill()
        ctx.fillStyle="#3b82f6";ctx.font="bold 10px sans-serif";ctx.textAlign="center";ctx.fillText("Deformatsion (bending)",cx,cy+r+22)
      }
    },
  ]

  useEffect(()=>{
    const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");if(!ctx)return
    const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2;ctx.clearRect(0,0,w,h)
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,100);grad.addColorStop(0,"#1a0a2e");grad.addColorStop(1,"#0a0018")
    ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);ctx.translate(cx,cy)
    ctx.strokeStyle="rgba(139,92,246,0.08)";ctx.lineWidth=0.5
    for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*40,-80);ctx.lineTo(i*40,80);ctx.stroke();ctx.beginPath();ctx.moveTo(-80,i*40);ctx.lineTo(80,i*40);ctx.stroke()}

    const m=modes[mode]
    // Draw center + ligands
    const r=50;const pts=[[+r,0],[-r,0],[0,+r],[0,-r],[0,-r*0.6],[0,+r*0.6]]
    const cols=["#ef4444","#ef4444","#22c55e","#22c55e","#3b82f6","#3b82f6"]
    pts.forEach((p,i)=>{ctx.beginPath();ctx.arc(p[0],p[1],8,0,Math.PI*2);ctx.fillStyle=cols[i];ctx.fill();ctx.strokeStyle="#fff";ctx.lineWidth=1;ctx.stroke()})
    ctx.strokeStyle="rgba(168,85,247,0.3)";ctx.lineWidth=2;pts.forEach(p=>{ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(p[0],p[1]);ctx.stroke()})
    ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill()
    ctx.translate(-cx,-cy)
    ctx.fillStyle=m.color;ctx.font="bold 11px sans-serif";ctx.textAlign="center"
    ctx.fillText(`${m.name} — ${m.cm} cm⁻¹`,cx,16)
    ctx.fillStyle=`${m.color}80`;ctx.font="9px sans-serif"
    ctx.fillText(`IQ: ${m.iq?"✓":"✗"} | Raman: ${m.raman?"✓":"✗"}`,cx,30)
  },[mode])

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-green-400">🎯</span> Interaktiv tebranish modlari</h3>
      <div className="flex gap-1.5 flex-wrap mb-4">
        {modes.map((m,i)=>(
          <button key={i} onClick={()=>setMode(i)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${mode===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{m.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <canvas ref={canvasRef} width={300} height={200} className="w-full h-48 bg-purple-950/60 rounded-xl border border-purple-700/40" />
        <div className="space-y-2">
          <p className="text-purple-200 text-xs sm:text-sm leading-relaxed">{modes[mode].desc}</p>
          <div className="flex gap-2 text-[10px]">
            <span className={`px-2 py-1 rounded ${modes[mode].iq?"bg-green-600/20 text-green-300":"bg-red-600/20 text-red-300"}`}>IQ: {modes[mode].iq?"✓ faol":"✗ nofaol"}</span>
            <span className={`px-2 py-1 rounded ${modes[mode].raman?"bg-green-600/20 text-green-300":"bg-red-600/20 text-red-300"}`}>Raman: {modes[mode].raman?"✓ faol":"✗ nofaol"}</span>
            <span className="px-2 py-1 rounded bg-purple-600/20 text-purple-300">{modes[mode].cm} cm⁻¹</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. IQ/RAMAN SELEKSIYA QOIDALARI
// ═══════════════════════════════════════════════════════════════════════════════
function SeleksiyaQoidalari() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"O_h", i:true, iq:"T₁u", raman:"A₁g, E_g, T₂g", iqOp:"(x,y,z)",
      ramanOp:"(x²+y²+z², 2z²−x²−y², x²−y², xy, xz, yz)", alt:"✓ — ishlaydi",
      note:"IQ faol modlar = T₁u (x,y,z bilan bir xil simmetriya). Raman faol modlar = A₁g, E_g, T₂g (kvadratik funksiyalar)."}
  }
  const d = data.oh

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-rose-400">🔬</span> IQ va Raman seleksiya qoidalari</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
            <h4 className="text-red-400 font-bold text-xs mb-2">📡 IQ faollik sharti</h4>
            <p className="text-purple-200 text-xs leading-relaxed">
              Tebranish simmetriyasi <strong className="text-yellow-300">dipol moment operatori</strong> komponentlari 
              (x, y, z) simmetriyasi bilan <strong className="text-yellow-300">bir xil</strong> bo'lishi kerak.
            </p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 mt-2 text-[10px]">
              <p className="text-yellow-300 font-mono">Γ_IQ = Γ_teb ⊗ Γ_dipol; &nbsp; Γ_dipol = Γ_x + Γ_y + Γ_z</p>
              <p className="text-purple-300 mt-1">O_h da Γ_dipol = T₁u → faqat T₁u modlar IQ faol</p>
            </div>
          </div>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-bold text-xs mb-2">🔦 Raman faollik sharti</h4>
            <p className="text-purple-200 text-xs leading-relaxed">
              Tebranish simmetriyasi <strong className="text-yellow-300">qutblanuvchanlik tenzori</strong> komponentlari 
              (x², y², z², xy, xz, yz) simmetriyasi bilan <strong className="text-yellow-300">bir xil</strong> bo'lishi kerak.
            </p>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 mt-2 text-[10px]">
              <p className="text-yellow-300 font-mono">Γ_Raman = Γ_teb ⊗ Γ_α; &nbsp; Γ_α = Γ_x² + Γ_y² + ...</p>
              <p className="text-purple-300 mt-1">O_h da Γ_α = A₁g + E_g + T₂g → shu IRREPS lar Raman faol</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="flex justify-between"><span className="text-purple-400">IQ faol IRREPS:</span><span className="text-green-400 font-mono font-bold">{d.iq}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Raman faol IRREPS:</span><span className="text-blue-400 font-mono font-bold">{d.raman}</span></p>
            <p className="flex justify-between"><span className="text-purple-400">Alternativ taqiq:</span><span className="text-yellow-300 font-bold">{d.alt}</span></p>
          </div>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-xs">
            <h4 className="text-purple-400 font-bold mb-1">IQ va Raman intensivliklari:</h4>
            <p className="text-purple-200">I_IQ ∝ |⟨ψ_f|μ|ψ_i⟩|² — dipol moment o'tish matritsasi elementi</p>
            <p className="text-purple-200">I_Raman ∝ |⟨ψ_f|α|ψ_i⟩|² — qutblanuvchanlik o'tish matritsasi elementi</p>
            <p className="text-purple-300 mt-1">ν₁ (A₁g) — eng kuchli Raman. ν₃ (T₁u) — eng kuchli IQ.</p>
          </div>
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-2 text-xs">
            <p className="text-green-400 font-bold">⚡ Alternativ taqiq (Laport qoidasining tebranish analogi):</p>
            <p className="text-purple-200">Inversiya markazi bo'lgan molekulalarda g ↔ u o'tish IQ uchun, g ↔ g va u ↔ u Raman uchun. Hech qaysi mod bir vaqtda IQ va Raman faol emas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CHASTOTALAR VA OMILLAR
// ═══════════════════════════════════════════════════════════════════════════════
function ChastotaOmillar() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-amber-400">🎵</span> ν(M−L) ga ta'sir etuvchi omillar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {t:"Metall massasi",d:"ν ∝ 1/√μ (harmonik ossillyator). Og'ir metall → past ν. Pt−Cl ~340, Co−Cl ~380."},
          {t:"Oksidlanish darajasi",d:"Yuqori zaryad → kuchli bog' → yuqori ν. Fe²⁺−CN: 580, Fe³⁺−CN: 605 cm⁻¹."},
          {t:"Ligand tabiati",d:"CN⁻ > CO > NH₃ > H₂O > Cl⁻ > Br⁻ > I⁻. Kuchli ligand → yuqori ν."},
          {t:"Trans ta'sir",d:"Trans-ligand bog'ni kuchsizlantiradi → past ν. Pt−Cl trans ga NH₃ → ~320 cm⁻¹."},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold">{r.t}</p>
            <p className="text-purple-200 mt-1">{r.d}</p>
          </div>
        ))}
      </div>
      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs mt-3">
        <p className="text-purple-400 font-bold">Harmonik ossillyator modeli (Morse potensiali):</p>
        <p className="text-yellow-300 font-mono text-center text-sm">ν̄ = (1/2πc)·√(k/μ) &nbsp; (cm⁻¹)</p>
        <p className="text-purple-200 mt-1">k — kuch konstantasi (N/m). μ — keltirilgan massa (kg). ν̄ — to'lqin soni (cm⁻¹).</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. DIAGNOSTIK JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function DiagnostikJadval() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-cyan-400">🔍</span> IQ/Raman diagnostikasi — geometriyani aniqlash</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1.5 sm:p-2 text-left text-amber-400">Geometriya</th>
              <th className="p-1.5 sm:p-2 text-left text-purple-200">Guruh</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">IQ polosalar</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">Raman polosalar</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">Alt. taqiq</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200 hidden md:table-cell">ν(M−L) (cm⁻¹)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Oktaedrik ML₆","O_h","2 (ν₃, ν₄)","3 (ν₁, ν₂, ν₅)","✓","~300-500"],
              ["Tetraedrik ML₄","T_d","2 (ν₃, ν₄)","4 (ν₁, ν₂, ν₃, ν₄)","✗","~280-480"],
              ["Kvadrat tekis ML₄","D4h","3","3","✓","~260-340"],
              ["Kv. piramida ML₅","C4v","4","5","✗","~250-400"],
              ["Trig. bipir. ML₅","D3h","3","3","✓","~200-450"],
              ["cis-ML₄X₂","C₂v","2×M−X","2×M−X","✗","2 ta M−X"],
              ["trans-ML₄X₂","D4h","1×M−X","1×M−X","✓","1 ta M−X"],
            ].map((r,i)=>(
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1.5 sm:p-2 font-bold text-yellow-300">{r[0]}</td>
                <td className="p-1.5 sm:p-2 font-mono font-bold text-amber-300">{r[1]}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-200">{r[2]}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-200">{r[3]}</td>
                <td className="p-1.5 sm:p-2 text-center">{r[4]==="✓"?<span className="text-green-400">✓</span>:<span className="text-red-400">✗</span>}</td>
                <td className="p-1.5 sm:p-2 text-center text-purple-400 font-mono hidden md:table-cell">{r[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-green-400 font-bold">⚡ Misol — cis vs trans izomer farqlash:</p>
        <p className="text-purple-200">trans-[Pt(NH₃)₂Cl₂] (D4h) — 1 ta Pt−Cl valent (IQ: 330 cm⁻¹). cis-[Pt(NH₃)₂Cl₂] (C₂v) — 2 ta Pt−Cl valent (IQ: 325 va 315 cm⁻¹). Polosalar soni → izomer turi!</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. LIGAND SPERTRAL MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════════
function LigandSpektrlari() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><span className="text-violet-400">📋</span> Ligandlarning xarakteristik IQ polosalari</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1.5 sm:p-2 text-left text-amber-400">Ligand</th>
              <th className="p-1.5 sm:p-2 text-left text-purple-200">Tebranish turi</th>
              <th className="p-1.5 sm:p-2 text-center text-purple-200">ν (cm⁻¹)</th>
              <th className="p-1.5 sm:p-2 text-left text-purple-200">Xarakteristikasi</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["H₂O","ν(OH)", "~3400 (keng)","Keng, kuchli; koordinatsiyada o'zgaradi"],
              ["NH₃","ν(NH)", "~3300-3150","2-3 ta polosa; koordinatsiyada siljiydi"],
              ["CO","ν(C≡O)", "~2150-2000","Terminal CO: ~2120-2000; ko'prik CO: ~1900-1700"],
              ["CN⁻","ν(C≡N)", "~2150-2050","M−CN: ~2150; M−NC: ~2100; siljish kuzatiladi"],
              ["NO₂⁻", "ν(NO₂)","~1480-1300","Nitro (M−NO₂): ~1470-1370; Nitrito (M−ONO): ~1485-1400"],
              ["SO₄²⁻","ν(SO)","~1130-1050","T_d da: 1 ta; C₂v da: ajraladi"],
              ["en","ν(CH)","~2950-2850","Etilendiamin; NH₂ + CH tebranishlari"],
              ["Cl⁻","ν(M−Cl)","~350-300","Past chastota; metallga qarab o'zgaradi"],
            ].map((r,i)=>(
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1.5 sm:p-2 font-bold text-yellow-300 font-mono">{r[0]}</td>
                <td className="p-1.5 sm:p-2 text-purple-200">{r[1]}</td>
                <td className="p-1.5 sm:p-2 text-center text-yellow-300 font-mono">{r[2]}</td>
                <td className="p-1.5 sm:p-2 text-purple-300 text-[8px] sm:text-[10px]">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">💡 CO ligand — eng informativ. ν(CO) siljishi metall−ligand π-akseptorlik darajasini ko'rsatadi. Kuchli π-akseptor metall → ν(CO) past.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. [Co(NH₃)₆]³⁺ SPEKTR — MISOLLAR
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrTahlili() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-emerald-400">📈</span> [Co(NH₃)₆]³⁺ — IQ va Raman spektr tahlili
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">📡 IQ spektri (O_h):</p>
          {[
            {cm:"476 cm⁻¹",desc:"ν₃ (T₁u) — asimmetrik Co−N valent. Eng kuchli IQ polosa."},
            {cm:"330 cm⁻¹",desc:"ν₄ (T₁u) — deformatsion N−Co−N. O'rtacha intensivlik."},
            {cm:"~1600 cm⁻¹",desc:"NH₃ ligandidagi δ(NH) deformatsion"},
            {cm:"~3200 cm⁻¹",desc:"ν(NH) — N−H valent tebranishlari"},
          ].map((r,i)=>(
            <div key={i} className="bg-purple-950/50 border border-purple-700/30 rounded p-1.5 flex justify-between">
              <span className="text-yellow-300 font-mono">{r.cm}</span>
              <span className="text-purple-200">{r.desc}</span>
            </div>
          ))}
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">🔦 Raman spektri:</p>
          {[
            {cm:"494 cm⁻¹",desc:"ν₁ (A₁g) — simmetrik Co−N valent. Eng kuchli Raman!"},
            {cm:"440 cm⁻¹",desc:"ν₂ (E_g) — ekvatorial Co−N valent. O'rtacha."},
            {cm:"~290 cm⁻¹",desc:"ν₅ (T₂g) — deformatsion. Kuchsiz Raman."},
            {cm:"—",desc:"ν₃ va ν₄ (T₁u) — Raman spektrida KO'RINMAYDI!"},
          ].map((r,i)=>(
            <div key={i} className="bg-purple-950/50 border border-purple-700/30 rounded p-1.5 flex justify-between">
              <span className="text-yellow-300 font-mono">{r.cm}</span>
              <span className="text-purple-200">{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-green-400 font-bold">⚡ Xulosa: IQ da 2 ta (ν₃, ν₄) + ligand polosalari. Raman da 3 ta (ν₁, ν₂, ν₅). Alternativ taqiq aniq kuzatiladi — hech qanday polosa IQ va Raman da bir vaqtda emas!</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestTebranish() {
  const questions = [
    { q:"Oktaedrik [ML₆] kompleksda nechta normal tebranish modi bor?", a:"15 ta (3N−6)", opts:["9 ta","12 ta","15 ta (3N−6)","21 ta"], hint:"3×7−6=15" },
    { q:"O_h da qaysi IRREPS IQ faol?", a:"T₁u", opts:["A₁g","E_g","T₁u","T₂g"], hint:"(x,y,z) — T₁u" },
    { q:"O_h da qaysi IRREPS Raman faol?", a:"A₁g, E_g, T₂g", opts:["T₁u","A₁g, E_g, T₂g","A₁g, T₁u","E_g, T₂u"], hint:"Kvadratik funksiyalar" },
    { q:"Alternativ taqiq qoidasi nima?", a:"IQ faol modlar Raman faol emas (i bor)", opts:["Barcha modlar IQ faol","IQ faol modlar Raman faol emas (i bor)","IQ va Raman har doim bir xil","Hech qanday mod faol emas"], hint:"g vs u" },
    { q:"Tetraedrik T_d da alternativ taqiq ishlaydimi?", a:"Yo'q (i yo'q — T₂ modlar ham IQ, ham Raman)", opts:["Ha","Yo'q (i yo'q — T₂ modlar ham IQ, ham Raman)","Faqat qisman","Faqat A₁ uchun"], hint:"T_d da i yo'q" },
    { q:"Nū₁ (A₁g) tebranish turi?", a:"To'liq simmetrik M−L valent", opts:["Asimmetrik M−L valent","Deformatsion","To'liq simmetrik M−L valent","\"Jim\" moda"], hint:"Barcha 6 bog' fazada" },
    { q:"Eng kuchli IQ polosa O_h da qaysi?", a:"ν₃ (T₁u) — asimmetrik M−L valent", opts:["ν₁ (A₁g)","ν₂ (E_g)","ν₃ (T₁u) — asimmetrik M−L valent","ν₅ (T₂g)"], hint:"Dipol moment kuchli o'zgaradi" },
    { q:"cis-[ML₄X₂] va trans-[ML₄X₂] ni IQ orqali farqlash?", a:"cis — 2 ta M−X; trans — 1 ta M−X", opts:["Farqlab bo'lmaydi","cis — 2 ta M−X; trans — 1 ta M−X","cis — 1 ta; trans — 2 ta","Ikkalasi ham 1 ta"], hint:"Simmetriya farqi" },
    { q:"Nima uchun ν(CO) past siljishi kuchli π-akseptorlikni bildiradi?", a:"Metall → CO π* orqaga donorlik C≡O bog'ini kuchsizlantiradi", opts:["CO massasi ortadi","Metall → CO π* orqaga donorlik C≡O bog'ini kuchsizlantiradi","CO ning kuch konstantasi ortadi","Tebranish chastotasi o'zgarmaydi"], hint:"π-orqaga donorlik" },
    { q:"3N−6 qoidasida '6' nimani anglatadi?", a:"3 ta ilgarilanma + 3 ta aylanma erkinlik darajasi", opts:["6 ta atom","6 ta bog'","3 ta ilgarilanma + 3 ta aylanma erkinlik darajasi","6 ta tebranish modi"], hint:"3+3=6" },
  ]

  const [c,setC]=useState(0);const [s,setS]=useState(null);const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false);const [ans,setAns]=useState({})
  const q=questions[c]
  if(res){return(
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc>=8?"🏆":sc>=5?"👍":"📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 mt-2">{sc>=8?"Tebranish spektroskopiyasini mukammal o'zlashtirdingiz!":sc>=5?"Yaxshi, yana takrorlash kerak.":"Qayta o'qib chiqing."}</p>
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
export default function Tebranish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span className="text-purple-600">›</span>
            <span className="text-green-400">Tebranish spektrlari</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-green-400 flex items-center gap-2"><span>📈</span> Simmetriya va tebranish spektrlari</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">3N−6 • Γ_vib • Normal modlar • IQ/Raman • Alternativ taqiq • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Tebranish spektroskopiyasi va simmetriya</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Tebranish spektroskopiyasi (IQ va Raman)</strong> — kompleks birikmalarning 
                tuzilishini aniqlashning eng informativ usullaridan biri. Simmetriya nazariyasi yordamida qaysi tebranish 
                modlari IQ-faol, qaysilari Raman-faol ekanligini oldindan bashorat qilish mumkin.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">Γ_vib tahlili</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">IQ/Raman seleksiya</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-green-400 font-bold">🎯 Maqsad:</span> Simmetriya yordamida tebranish modlarini, IQ/Raman faollikni va spektrlarni tahlil qilishni o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">⏱️ Vaqt:</span> ~4.5 soat</p>
              <p className="text-purple-300"><span className="text-green-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory; Nakamoto — Infrared and Raman Spectra</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-green-300 font-mono text-xs font-bold">Tebranish spektri — molekulaning "barmoq izi"</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <NormalModKalkulyator />
        <SimmetriyaTahlili />
        <TebranishCanvas />
        <SeleksiyaQoidalari />
        <ChastotaOmillar />
        <DiagnostikJadval />
        <LigandSpektrlari />
        <SpektrTahlili />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestTebranish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">3N−6 qoidasi:</strong> oktaedrik [ML₆] → 15 ta tebranish, 4 tasi spektral faol</li>
            <li>Γ<sub>vib</sub> = Γ<sub>3N</sub> − Γ<sub>trans</sub> − Γ<sub>rot</sub>. O_h da A₁g+E_g+T₁g+T₂g+2T₁u+T₂u</li>
            <li><strong className="text-yellow-400">IQ faol:</strong> T₁u (x,y,z). <strong className="text-yellow-400">Raman faol:</strong> A₁g, E_g, T₂g (x², y², xy...)</li>
            <li><strong className="text-yellow-400">Alternativ taqiq:</strong> i bor → IQ va Raman polosalar hech qachon mos kelmaydi</li>
            <li>T_d da i yo'q → T₂ modlar ham IQ, ham Raman faol (diagnostik belgi!)</li>
            <li>ν(M−L) ≈ 200−500 cm⁻¹. Tartib: CN⁻ {'>'} CO {'>'} NH₃ {'>'} H₂O {'>'} Cl⁻</li>
            <li><strong className="text-yellow-400">Spektral diagnostika:</strong> polosalar soni, chastotasi va IQ/Raman mosligi orqali geometriya, izomeriya va ligand turi aniqlanadi</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/xarakterlar" className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2"><span>←</span> Xarakterlar jadvali</Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/elektron" className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-purple-600 hover:from-green-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-500/20">Simmetriya va elektron tuzilish <span>→</span></Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory | K. Nakamoto — Infrared and Raman Spectra of Coordination Compounds</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
