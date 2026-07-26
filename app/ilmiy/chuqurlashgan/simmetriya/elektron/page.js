"use client"

import Link from "next/link"
import { useState } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// ORBITAL SIMMETRIYASI — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function OrbitalSimmetriya() {
  const [geo, setGeo] = useState("oh")

  const data = {
    oh: {name:"O_h", classes:[
      {ir:"A₁g", dim:1, g:true, s:true, p:"—", d:"—", f:"—", basis:"s, x²+y²+z²", desc:"To'liq simmetrik — barcha amallarda χ=+1"},
      {ir:"A₂g", dim:1, g:true, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"E_g", dim:2, g:true, s:"—", p:"—", d:"d_z², d_x²−y²", f:"—", basis:"(2z²−x²−y², x²−y²)", desc:"e_g — yuqori sath"},
      {ir:"T₁g", dim:3, g:true, s:"—", p:"—", d:"—", f:"—", basis:"(R_x,R_y,R_z)", desc:"Aylanma operatorlari"},
      {ir:"T₂g", dim:3, g:true, s:"—", p:"—", d:"d_xy, d_xz, d_yz", f:"—", basis:"(xy,xz,yz)", desc:"t₂g — pastki sath"},
      {ir:"A₁u", dim:1, g:false, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"A₂u", dim:1, g:false, s:"—", p:"—", d:"—", d:"—", f:"fₓ₃", basis:"—", desc:""},
      {ir:"E_u", dim:2, g:false, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"T₁u", dim:3, g:false, s:"—", p:"p_x,p_y,p_z", d:"—", f:"fₓ,f_y,f_z", basis:"(x,y,z)", desc:"Dipol moment. IQ-faol."},
      {ir:"T₂u", dim:3, g:false, s:"—", p:"—", d:"—", f:"fₓyz", basis:"—", desc:""},
    ]},
    td: {name:"T_d", classes:[
      {ir:"A₁", dim:1, s:true, p:"—", d:"—", f:"—", basis:"x²+y²+z²", desc:"To'liq simmetrik"},
      {ir:"A₂", dim:1, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"E", dim:2, s:"—", p:"—", d:"d_z², d_x²−y²", f:"—", basis:"(2z²−x²−y², x²−y²)", desc:"Pastki sath!"},
      {ir:"T₁", dim:3, s:"—", p:"—", d:"—", f:"—", basis:"(R_x,R_y,R_z)", desc:""},
      {ir:"T₂", dim:3, s:"—", p:"p_x,p_y,p_z", d:"d_xy,d_xz,d_yz", f:"—", basis:"(x,y,z); (xy,xz,yz)", desc:"Yuqori sath! IQ+Raman!"},
    ]},
    d4h: {name:"D₄h", classes:[
      {ir:"A₁g", dim:1, g:true, s:true, p:"—", d:"d_z²", f:"—", basis:"z²", desc:"d_z²"},
      {ir:"A₂g", dim:1, g:true, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"B₁g", dim:1, g:true, s:"—", p:"—", d:"d_x²−y²", f:"—", basis:"x²−y²", desc:"Eng yuqori!"},
      {ir:"B₂g", dim:1, g:true, s:"—", p:"—", d:"d_xy", f:"—", basis:"xy", desc:""},
      {ir:"E_g", dim:2, g:true, s:"—", p:"—", d:"d_xz,d_yz", f:"—", basis:"(xz,yz)", desc:"Eng past"},
      {ir:"A₁u", dim:1, g:false, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"A₂u", dim:1, g:false, s:"—", p:"p_z", d:"—", f:"—", basis:"z", desc:"IQ-faol"},
      {ir:"B₁u", dim:1, g:false, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"B₂u", dim:1, g:false, s:"—", p:"—", d:"—", f:"—", basis:"—", desc:""},
      {ir:"E_u", dim:2, g:false, s:"—", p:"p_x,p_y", d:"—", f:"—", basis:"(x,y)", desc:"IQ-faol"},
    ]}
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🔬</span> Orbitallarning simmetriya bo'yicha klassifikatsiyasi
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={()=>setGeo("oh")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${geo==="oh"?"bg-blue-600 text-white":"bg-purple-900/50 text-purple-300"}`}>O_h — Oktaedrik</button>
        <button onClick={()=>setGeo("td")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${geo==="td"?"bg-green-600 text-white":"bg-purple-900/50 text-purple-300"}`}>T_d — Tetraedrik</button>
        <button onClick={()=>setGeo("d4h")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${geo==="d4h"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>D₄h — Kvadrat tekis</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 sm:p-1.5 text-left text-amber-400">IRREPS</th>
              <th className="p-1 sm:p-1.5 text-center text-purple-200">dim</th>
              <th className="p-1 sm:p-1-5 text-center text-purple-200">s</th>
              <th className="p-1 sm:p-1.5 text-center text-purple-200">p</th>
              <th className="p-1 sm:p-1.5 text-center text-purple-200">d</th>
              <th className="p-1 sm:p-1.5 text-center text-purple-200 hidden md:table-cell">Bazis</th>
            </tr>
          </thead>
          <tbody>
            {d.classes.map((row,i)=>(
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className={`p-1 sm:p-1.5 font-bold font-mono ${row.g!==undefined?(row.g?"text-green-400":"text-blue-300"):"text-amber-300"}`}>{row.ir}</td>
                <td className="p-1 sm:p-1.5 text-center text-purple-400">{row.dim}</td>
                <td className="p-1 sm:p-1.5 text-center">{row.s===true?<span className="text-green-400">✓</span>:row.s==="—"?<span className="text-purple-700">·</span>:<span className="text-yellow-300">✓</span>}</td>
                <td className="p-1 sm:p-1.5 text-center">{row.p && row.p!=="—"?<span className="text-blue-300">✓</span>:<span className="text-purple-700">·</span>}</td>
                <td className="p-1 sm:p-1.5 text-center">{row.d && row.d!=="—"?<span className="text-amber-300">✓</span>:<span className="text-purple-700">·</span>}</td>
                <td className="p-1 sm:p-1.5 text-purple-400 text-[7px] sm:text-[9px] font-mono hidden md:table-cell">{row.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ Legend: </p>
        <p className="text-purple-200">✓ — orbital mavjud. · — bu IRREPS da orbital yo'q. s→A₁g/A₁. p→T₁u (O_h)/T₂ (T_d). d→E_g+T₂g (O_h)/E+T₂ (T_d)</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. d-ORBITAL AJRALISH — KRISTALL MAYDON ENERGIYA DIAGRAMMASI
// ═══════════════════════════════════════════════════════════════════════════════
function DAjralish() {
  const [geo, setGeo] = useState("oh")
  const geoData = {
    oh: {name:"O_h", levels:[
      {label:"e_g (d_z², d_x²−y²)", en:0.6, color:"#ef4444", count:2, h:"35%"},
      {label:"t₂g (d_xy, d_xz, d_yz)", en:-0.4, color:"#22c55e", count:3, h:"20%"},
    ], delta:"Δ₀", deltaVal:"10 Dq", split:"2 sath", note:"6 ta ligand. t₂g stabillashgan (−0.4Δ₀), e_g destabillashgan (+0.6Δ₀)"},
    td: {name:"T_d", levels:[
      {label:"t₂ (d_xy, d_xz, d_yz)", en:0.4, color:"#ef4444", count:3, h:"25%"},
      {label:"e (d_z², d_x²−y²)", en:-0.6, color:"#22c55e", count:2, h:"15%"},
    ], delta:"Δ_t", deltaVal:"4/9·Δ₀ ≈ 0.44Δ₀", split:"2 sath (teskari!)", note:"Teskari ajralish. e pastda, t₂ yuqorida."},
    d4h: {name:"D₄h", levels:[
      {label:"b₁g (d_x²−y²)", en:1.2, color:"#dc2626", count:1, h:"45%"},
      {label:"b₂g (d_xy)", en:0.6, color:"#f97316", count:1, h:"35%"},
      {label:"a₁g (d_z²)", en:0.1, color:"#eab308", count:1, h:"22%"},
      {label:"e_g (d_xz, d_yz)", en:-0.5, color:"#22c55e", count:2, h:"12%"},
    ], delta:"Δ_max", deltaVal:"Eng katta", split:"4 xil sath", note:"4 xil energiya darajasi. d⁸ metallar uchun xos."}
  }
  const d = geoData[geo]
  const minEn = -0.8, maxEn = 1.4

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-yellow-400">💎</span> d-orbital ajralishi — simmetriya asosida
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(geoData).map(([k,v])=>(
          <button key={k} onClick={()=>setGeo(k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>{v.name}</button>
        ))}
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 mb-4">
        <p className="text-purple-400 text-[10px] mb-3 text-center">Energiya (Δ)</p>
        <div className="space-y-3">
          {d.levels.map((lvl,i)=>{
            const pct = (lvl.en - minEn)/(maxEn-minEn)*100
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="text-purple-300 w-28 sm:w-36 text-right font-mono">{lvl.label}</span>
                <div className="flex-1 h-5 bg-purple-950/90 rounded relative overflow-hidden border border-purple-700/30">
                  <div className="h-full rounded transition-all" style={{width:`${pct}%`, background:lvl.color, opacity:0.5}} />
                </div>
                <span className="text-purple-400 w-14 text-right font-mono">{lvl.en>=0?"+":""}{lvl.en}Δ</span>
                <span className="text-purple-500 text-[9px] w-4 text-center">×{lvl.count}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center items-center gap-2 text-xs mt-3 pt-2 border-t border-purple-800/30">
          <span className="text-green-400">{d.levels[d.levels.length-1].label.split("(")[0].trim()} (past)</span>
          <div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-yellow-400" /><span className="text-yellow-400 font-bold font-mono">{d.delta} = {d.deltaVal}</span><div className="w-4 h-0.5 bg-yellow-400" /></div>
          <span className="text-red-400">{d.levels[0].label.split("(")[0].trim()} (yuqori)</span>
        </div>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
        <p className="text-yellow-400 font-bold">⚡ {d.split}. </p>
        <p className="text-purple-200">{d.note}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. PROYEKSION OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════
function ProyeksionOperator() {
  const [step, setStep] = useState(0)
  const steps = [
    {title:"1. Bazis funksiyalar", content:"6 ta ligand σ-orbitallari: φ₁, φ₂, ..., φ₆ (oktaedrik ML₆). Har bir ligand metallga σ-bog' orqali birikadi."},
    {title:"2. Qaytariluvchan tasvir Γ", content:"Γ_σ = A₁g + E_g + T₁u. χ(E)=6, χ(C₃)=0, χ(C₂)=0, χ(C₄)=2, χ(C₂')=0, χ(i)=0, χ(S₄)=0, χ(S₆)=0, χ(σ_h)=4, χ(σ_d)=2"},
    {title:"3. Proyeksion operator", content:"P^Γ = (d_Γ/h)·Σχ_Γ(R)·R. A₁g uchun: P^A₁g·φ₁ = (1/48)·Σχ(R)·R(φ₁) = (1/√6)(φ₁+φ₂+φ₃+φ₄+φ₅+φ₆)"},
    {title:"4. SALC lar", content:"A₁g: (1/√6)(φ₁+φ₂+φ₃+φ₄+φ₅+φ₆). E_g: (1/2)(φ₁−φ₂) va (1/2)(φ₃−φ₄). T₁u: (1/√2)(φ₅−φ₆), (1/√2)(φ₁−φ₂), (1/√2)(φ₃−φ₄)"},
  ]
  const s = steps[step]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">🔧</span> Proyeksion operator — SALC larni yaratish
      </h3>

      <div className="flex items-center gap-1.5 mb-3">
        {steps.map((_,i)=>(
          <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${step===i?"bg-purple-600 text-white":i<step?"bg-green-600/50 text-green-200":"bg-purple-900/60 text-purple-500"}`}>{i+1}</div>
        ))}
        <span className="text-purple-400 text-[10px]">Qadam {step+1}/{steps.length}</span>
      </div>

      <h4 className="text-white font-bold text-xs mb-2">{s.title}</h4>
      <p className="text-purple-200 text-xs sm:text-sm mb-3">{s.content}</p>

      {step===2 && (
        <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-center mb-3">
          <p className="text-yellow-300 font-mono text-sm">P^Γ = (d_Γ/h) · Σ χ_Γ(R) · R</p>
          <p className="text-purple-400 text-[10px] mt-1">Γ = A₁g, E_g yoki T₁u — har biri uchun alohida hisoblanadi</p>
        </div>
      )}

      {step===3 && (
        <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1 mb-3">
          <p className="text-yellow-300 font-mono text-sm mb-1">SALC lar:</p>
          <p className="text-purple-200">ψ(A₁g) = 1/√6 · (φ₁ + φ₂ + φ₃ + φ₄ + φ₅ + φ₆)</p>
          <p className="text-purple-200">ψ(E_g)₁ = 1/2 · (φ₁ − φ₂); &nbsp; ψ(E_g)₂ = 1/2 · (φ₃ − φ₄)</p>
          <p className="text-purple-200">ψ(T₁u)ₓ = 1/√2 · (φ₁ − φ₂); &nbsp; ψ(T₁u)ᵧ = 1/√2 · (φ₃ − φ₄); &nbsp; ψ(T₁u)₂ = 1/√2 · (φ₅ − φ₆)</p>
        </div>
      )}

      <div className="flex gap-2">
        {step>0 && <button onClick={()=>setStep(p=>p-1)} className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-800/60 text-purple-200 hover:bg-purple-700/80">← Oldingi</button>}
        {step<steps.length-1 && <button onClick={()=>setStep(p=>p+1)} className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-600 hover:bg-purple-500 text-white">Keyingi →</button>}
        <button onClick={()=>setStep(0)} className="px-3 py-1.5 rounded-lg text-[10px] bg-purple-900/50 text-purple-400 hover:bg-purple-800">Qayta</button>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ Proyeksion operator faqat bir xil simmetriyali orbitallarni topish imkonini beradi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. MO DIAGRAMMASI — OKTAEDRIK σ-BOG'
// ═══════════════════════════════════════════════════════════════════════════════
function MODiagramma() {
  const [showPi, setShowPi] = useState(false)

  const moLevels = [
    {label:"σ*(T₁u)", type:"antibond", en:5, color:"#ef4444", metal:"4p", ligand:"T₁u", desc:"Eng yuqori. 4p bilan antibog'."},
    {label:"σ*(A₁g)", type:"antibond", en:4, color:"#f97316", metal:"4s", ligand:"A₁g", desc:"4s bilan antibog'lovchi."},
    {label:"σ*(E_g)", type:"antibond", en:3.2, color:"#eab308", metal:"3d(e_g)", ligand:"E_g", desc:"e_g* — antibog'lovchi. LUMO."},
    {label:"π*(T₂g)", type:"antibond", en:2.8, color:"#a855f7", metal:"3d(t₂g)", ligand:"T₂g", desc:"π-antibog' (faqat π-ligand bilan)"},
    {label:"t₂g (T₂g)", type:"nonbond", en:2, color:"#22c55e", metal:"3d(t₂g)", ligand:"—", desc:"Bog'lanmagan. t₂g. HOMO."},
    {label:"σ(T₁u)", type:"bond", en:1.2, color:"#3b82f6", metal:"4p", ligand:"T₁u", desc:"Bog'lovchi."},
    {label:"σ(E_g)", type:"bond", en:0.8, color:"#06b6d4", metal:"3d(e_g)", ligand:"E_g", desc:"Bog'lovchi. t₂g bilan birga."},
    {label:"σ(A₁g)", type:"bond", en:0.3, color:"#22d3ee", metal:"4s", ligand:"A₁g", desc:"Eng past. σ(A₁g)."},
  ]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-emerald-400">📊</span> MO diagrammasi — σ va π bog'lanish
      </h3>

      <div className="flex gap-2 mb-4">
        <button onClick={()=>setShowPi(false)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${!showPi?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>Faqat σ</button>
        <button onClick={()=>setShowPi(true)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${showPi?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>σ + π (CN⁻, CO)</button>
      </div>

      <div className="space-y-1">
        {moLevels.filter(l=>showPi || !l.label.includes("π*")).map((lvl,i)=>{
          const h = (lvl.en/5)*100
          return (
            <div key={i} className="flex items-center gap-2 text-[10px]">
              <span className="text-purple-300 w-20 sm:w-24 text-right font-mono font-bold">{lvl.label}</span>
              <div className="flex-1 h-4 bg-purple-950/80 rounded relative border border-purple-700/30" style={{marginTop: i>0?"-2px":"0"}}>
                <div className="h-full rounded transition-all" style={{width:`${(lvl.en/5)*100}%`, background:lvl.color, opacity:0.4}} />
                <span className="absolute left-1 top-0.5 text-[8px] text-purple-300">{lvl.metal}</span>
              </div>
              <span className={`w-12 text-right font-bold ${lvl.type==="antibond"?"text-red-400":lvl.type==="nonbond"?"text-green-400":"text-blue-400"}`}>
                {lvl.type==="antibond"?"σ*":lvl.type==="nonbond"?"n":"σ"}
              </span>
            </div>
          )
        })}
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-3 space-y-1">
        <p className="text-purple-400 font-bold">MO diagrammasi xulosasi:</p>
        <p className="text-purple-200">• <strong className="text-green-400">t₂g (HOMO):</strong> bog'lanmagan — metall d-elektronlari shu sathda</p>
        <p className="text-purple-200">• <strong className="text-yellow-300">e_g* (LUMO):</strong> antibog'lovchi — d-d o'tishlar shu yerga</p>
        {showPi && <p className="text-purple-200">• <strong className="text-purple-300">π* T₂g:</strong> π-akseptor bilan t₂g pasayadi → Δ₀ ortadi</p>}
        <p className="text-purple-200">• <strong className="text-blue-300">Δ₀ = E(LUMO) − E(HOMO)</strong> = E(e_g*) − E(t₂g)</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. π-BOG'LANISH TAHLLILI
// ═══════════════════════════════════════════════════════════════════════════════
function PiBoglanish() {
  const [ligand, setLigand] = useState("acceptor")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-violet-400">🔄</span> π-bog'lanish va Δ₀ ga ta'siri
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={()=>setLigand("acceptor")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${ligand==="acceptor"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>π-akseptor (CN⁻, CO)</button>
        <button onClick={()=>setLigand("donor")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${ligand==="donor"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>π-donor (Cl⁻, Br⁻)</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={`rounded-xl p-4 border ${ligand==="acceptor"?"bg-blue-600/10 border-blue-500/30":"bg-orange-600/10 border-orange-500/30"}`}>
          <h4 className={`font-bold text-sm mb-2 ${ligand==="acceptor"?"text-blue-400":"text-orange-400"}`}>
            {ligand==="acceptor"?"π-akseptor (CN⁻, CO)":"π-donor (Cl⁻, Br⁻)"}
          </h4>
          <div className="space-y-2 text-xs">
            {ligand==="acceptor" ? (
              <>
                <p className="text-purple-200">Ligandning <strong className="text-yellow-300">bo'sh π*</strong> orbitallari T₂g simmetriyada</p>
                <p className="text-purple-200">Metall t₂g orbitallari bilan qoplanish → <strong className="text-green-300">t₂g energiyasi pasayadi</strong></p>
                <p className="text-purple-200">Natija: <strong className="text-cyan-300">Δ₀ ORTADI</strong> — kuchli maydon, past spin</p>
                <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 mt-2">
                  <p className="text-yellow-300 font-mono text-center">CN⁻: Δ₀ ≈ 33 000 cm⁻¹ | CO: Δ₀ ≈ 35 000 cm⁻¹</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-purple-200">Ligandning <strong className="text-yellow-300">to'lgan π</strong> orbitallari T₂g simmetriyada</p>
                <p className="text-purple-200">Metall t₂g orbitallari bilan qoplanish → <strong className="text-red-300">t₂g energiyasi ortadi</strong></p>
                <p className="text-purple-200">Natija: <strong className="text-orange-300">Δ₀ KAMAYADI</strong> — kuchsiz maydon, yuqori spin</p>
                <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 mt-2">
                  <p className="text-yellow-300 font-mono text-center">Cl⁻: Δ₀ ≈ 13 000 cm⁻¹ | Br⁻: Δ₀ ≈ 7 000 cm⁻¹</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">Simmetriya tahlili:</p>
          <p className="text-purple-200">• π-orbitallar <strong>T₂g</strong> simmetriyaga ega (O_h)</p>
          <p className="text-purple-200">• Metall d_xy, d_xz, d_yz — <strong>T₂g</strong></p>
          <p className="text-purple-200">• Faqat <strong className="text-yellow-300">bir xil simmetriyali</strong> orbitallar π-bog' hosil qiladi</p>
          <p className="text-purple-200">• E_g (d_z², d_x²−y²) π-bog'da ishtirok <strong className="text-red-300">etmaydi</strong></p>
          {ligand==="acceptor" && (
            <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
              <p className="text-green-400 font-bold">Spektrokimyoviy qator: CN⁻, CO → kuchli maydon → LS</p>
            </div>
          )}
          {ligand==="donor" && (
            <div className="bg-red-600/10 border border-red-500/30 rounded p-2">
              <p className="text-red-400 font-bold">Spektrokimyoviy qator: I⁻, Br⁻, Cl⁻ → kuchsiz maydon → HS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. ELEKTRON O'TISHLAR — TANLASH QOIDALARI
// ═══════════════════════════════════════════════════════════════════════════════
function TanlashQoidalari() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">⚡</span> Tanlash qoidalari — simmetriya asosida
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {t:"Laport qoidasi",f:"g → g taqiqlangan, g ↔ u ruxsat",d:"Oktaedrik (i bor) → d-d o'tish taqiqlangan (kuchsiz). Tetraedrik (i yo'q) → d-d ruxsat (kuchli)."},
          {t:"Spin qoidasi",f:"ΔS = 0 (spin saqlanishi)",d:"Toq elektronlar soni o'zgarmasligi kerak. HS→LS o'tish taqiqlangan."},
          {t:"Simmetriya qoidasi",f:"Γ_i ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g",d:"O'tish ruxsat uchun boshlang'ich ⊗ dipol ⊗ oxirgi ⊇ A₁g (to'liq simmetrik)."},
          {t:"Vibronik qoida",f:"Γ_i ⊗ Γ_vib ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g",d:"Tebranish simmetriyasi o'tishni ruxsatlantirishi mumkin (vibronik qoplanish)."},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold">{r.t}</p>
            <div className="bg-purple-950/90 rounded p-1.5 my-1.5 text-center"><p className="text-yellow-300 font-mono">{r.f}</p></div>
            <p className="text-purple-200">{r.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-xs mt-3">
        <p className="text-purple-400 font-bold">Misol — [Co(NH₃)₆]³⁺ (O_h, d⁶ LS):</p>
        <p className="text-purple-200">1. t₂g⁶ (boshlang'ich) → t₂g⁵ e_g¹ (oxirgi) — d-d o'tish</p>
        <p className="text-purple-200">2. Laport: g → g → <strong className="text-red-300">taqiqlangan</strong> (ε ~ 1-100 M⁻¹cm⁻¹)</p>
        <p className="text-purple-200">3. Spin: S=0 → S=0 → <strong className="text-green-300">ruxsat</strong> (singlet-singlet)</p>
        <p className="text-purple-200">4. Simmetriya: T₂g ⊗ T₁u ⊗ E_g → A₁g? <strong className="text-red-300">Yo'q</strong> → taqiqlangan</p>
        <p className="text-purple-300 mt-1">Vibronik qoplanish (ν₃, ν₄) tufayli kuchsiz polosa kuzatiladi. Δ₀ = 23000 cm⁻¹ → λ_max ≈ 435 nm (sariq).</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. SPEKTROKIMYOVIY QATOR — SIMMETRIYA IZOHI
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrokimyoviyIzoh() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Spektrokimyoviy qator — simmetriya asosidagi izoh
      </h3>

      <div className="flex items-end gap-1.5 h-28 mb-3">
        {[
          {name:"I⁻", h:15, col:"bg-red-500", type:"π-donor"},
          {name:"Br⁻", h:18, col:"bg-orange-500", type:"π-donor"},
          {name:"Cl⁻", h:22, col:"bg-yellow-500", type:"π-donor"},
          {name:"F⁻", h:28, col:"bg-lime-500", type:"π-donor"},
          {name:"H₂O", h:35, col:"bg-cyan-500", type:"σ-donor"},
          {name:"NH₃", h:45, col:"bg-blue-500", type:"σ-donor"},
          {name:"en", h:50, col:"bg-indigo-500", type:"σ-donor"},
          {name:"CN⁻", h:70, col:"bg-violet-500", type:"π-akseptor"},
          {name:"CO", h:85, col:"bg-purple-500", type:"π-akseptor"},
        ].map((l,i)=>(
          <div key={i} className="flex-1 flex flex-col items-center group">
            <div className="text-[8px] text-yellow-300 font-mono mb-1 opacity-0 group-hover:opacity-100">{l.type}</div>
            <div className={`w-full rounded-t-lg ${l.col} group-hover:scale-105 transition-transform`} style={{height:`${l.h}%`,minHeight:"20px"}} />
            <div className="text-[9px] sm:text-xs font-bold text-purple-300 group-hover:text-white mt-1">{l.name}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1 text-xs">
        <p className="text-purple-300"><strong className="text-purple-400">π-donor (I⁻, Br⁻, Cl⁻, F⁻):</strong> to'lgan π-orbitallar t₂g bilan qoplanadi → t₂g yuqori → Δ₀ kichik</p>
        <p className="text-purple-300"><strong className="text-purple-400">σ-donor (H₂O, NH₃, en):</strong> faqat σ-bog' — t₂g o'zgarmaydi → o'rtacha Δ₀</p>
        <p className="text-purple-300"><strong className="text-purple-400">π-akseptor (CN⁻, CO):</strong> bo'sh π*-orbitallar t₂g bilan qoplanadi → t₂g past → Δ₀ katta</p>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-2">
        <p className="text-yellow-400 font-bold">⚡ Barcha ligandlar T₂g simmetriya orqali ta'sir qiladi. E_g ga ta'sir yo'q.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. JAHN-TELLER — SIMMETRIYA ASOSIDA
// ═══════════════════════════════════════════════════════════════════════════════
function JahnTellerSimmetry() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-pink-400">📐</span> Jahn-Teller effekti — simmetriya tushuntirishi
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-purple-200 text-xs sm:text-sm"><strong className="text-yellow-400">Jahn-Teller teoremasi:</strong> Agar molekulaning elektron holati degenerat bo'lsa, molekula o'zining simmetriyasini pasaytirib, degeneratlikni yo'qotadi va barqarorlashadi.</p>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
            <p className="text-purple-400 font-bold">O_h da E_g degenerat sath:</p>
            <p className="text-purple-200">d⁹ (Cu²⁺): t₂g⁶ e_g³ → e_g da 3 ta elektron (1 ta toq)</p>
            <p className="text-purple-200">d⁴ HS (Cr²⁺): t₂g³ e_g¹ → e_g da 1 ta elektron (toq)</p>
            <p className="text-purple-200">d⁷ LS (Co²⁺): t₂g⁶ e_g¹ → e_g da 1 ta elektron (toq)</p>
            <p className="text-purple-300 mt-1">Degenerat E_g → simmetriya pasayishi → A₁g + B₁g</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold">Simmetriya pasayishi (O_h → D₄h):</p>
            <p className="text-yellow-300 font-mono text-center mt-2">E_g (O_h) → A₁g (dz²) + B₁g (dx²−y²) (D₄h)</p>
            <p className="text-purple-200 mt-2">• <strong className="text-blue-300">5 ta elektron (d×²−y²¹):</strong> Z o'qi bo'ylab cho'zilgan oktaedr</p>
            <p className="text-purple-200">• <strong className="text-green-300">1 ta elektron (dz²¹):</strong> XY tekisligida cho'zilgan oktaedr</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px]">
            <p className="text-purple-400 font-bold">Eksperimental belgilari:</p>
            <p className="text-purple-200">• [Cu(H₂O)₆]²⁺ — ko'k rang. 2 ta Cu−H₂O bog' uzunligi farqli</p>
            <p className="text-purple-200">• d-d o'tish polosasi keng (Jahn-Teller splitting ≈ 10000 cm⁻¹)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function Test() {
  const questions = [
    { q:"O_h da d-orbitallar qanday IRREPS larga ajraladi?", a:"T₂g + E_g", opts:["T₂g + E_g","E + T₂","4 xil","A₁g + T₂g"], hint:"3+2=5" },
    { q:"T_d da d-orbitallar ajralish tartibi qanday?", a:"E (past) + T₂ (yuqori) — teskari", opts:["T₂g + E_g — to'g'ri","E (past) + T₂ (yuqori) — teskari","4 xil","1 ta sath"], hint:"Tetraedrikda teskari" },
    { q:"Proyeksion operator formulasi?", a:"P^Γ = (d_Γ/h)·Σχ_Γ(R)·R", opts:["P = h·Σχ(R)·R","P^Γ = (d_Γ/h)·Σχ_Γ(R)·R","P = Σχ(R)","P = d_Γ·h"], hint:"d_Γ — o'lcham, h — tartib" },
    { q:"Oktaedrik MO da HOMO va LUMO qaysilar?", a:"HOMO = T₂g (t₂g), LUMO = E_g* (e_g*)", opts:["HOMO = A₁g, LUMO = T₁u","HOMO = T₂g (t₂g), LUMO = E_g* (e_g*)","HOMO = E_g, LUMO = T₂g","HOMO = T₁u, LUMO = A₁g"], hint:"Bog'lanmagan va antibog'lovchi" },
    { q:"π-akseptor ligand Δ₀ ga qanday ta'sir qiladi?", a:"t₂g pasayadi → Δ₀ ortadi (kuchli maydon)", opts:["t₂g ortadi → Δ₀ kamayadi","t₂g pasayadi → Δ₀ ortadi (kuchli maydon)","Hech qanday ta'sir","e_g ga ta'sir qiladi"], hint:"Bo'sh π* orbitallar" },
    { q:"Jahn-Teller effektida qaysi IRREPS ajraladi?", a:"E_g → A₁g + B₁g", opts:["T₂g → T₁g + T₂g","E_g → A₁g + B₁g","A₁g → E_g","T₁u → A₁u + B₁u"], hint:"Degenerat e_g sathi" },
    { q:"Laport qoidasiga ko'ra, qaysi o'tish taqiqlangan?", a:"g → g (inversiya markazi bor)", opts:["g → u","u → g","g → g (inversiya markazi bor)","s → p"], hint:"i bor → g→g taqiqlangan" },
    { q:"O_h da σ-donor ligand SALC lari qanday IRREPS larga kiradi?", a:"A₁g + E_g + T₁u", opts:["T₂g + E_g","A₁g + T₁u","A₁g + E_g + T₁u","E_g + T₂g"], hint:"6 ta ligand → 3 ta IRREPS" },
    { q:"Tanlash qoidasining umumiy ifodasi?", a:"Γ_i ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g", opts:["Γ_i = Γ_f","Γ_i ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g","Γ_dipol = A₁g","Γ_i + Γ_f = 0"], hint:"To'liq simmetrik tasvir kerak" },
    { q:"Spektrokimyoviy qator. Nima uchun CN⁻ kuchli maydon?", a:"π-akseptor — t₂g ni stabillashadi → Δ₀ katta", opts:["π-donor — t₂g ni destabilizatsiya qiladi","σ-donor — o'rtacha","π-akseptor — t₂g ni stabillashadi → Δ₀ katta","Hech qanday ta'sir"], hint:"Bo'sh π*" },
  ]

  const [c,setC]=useState(0);const [s,setS]=useState(null);const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false);const [ans,setAns]=useState({})
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
export default function Elektron() {
  const [view, setView] = useState("all")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span className="text-purple-600">›</span>
            <span className="text-cyan-400">Elektron tuzilish</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-cyan-400 flex items-center gap-2"><span>🔬</span> Simmetriya va elektron tuzilish</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Orbitallar simmetriyasi • SALC • MO diagramma • π-bog' • Jahn-Teller • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Simmetriya va elektron tuzilish</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Orbitallarning simmetriyasi</strong> — ularning nuqtali guruhdagi 
                qaytarilmas tasvirlar bo'yicha klassifikatsiyasi. Bu <strong>d-orbital ajralishi, MO energiya 
                diagrammalari va elektron o'tishlarning ruxsatini</strong> tushunish uchun asosdir.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-cyan-600/20 text-cyan-400 border border-cyan-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">3 geometriya</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">Proyeksion operator</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">🎯 Maqsad:</span> Orbitallarning simmetriya klassifikatsiyasi, proyeksion operator, MO diagramma va tanlash qoidalarini tushunish.</p>
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">⏱️ Vaqt:</span> ~4.5 soat</p>
              <p className="text-purple-300"><span className="text-cyan-400 font-bold">📚 Manba:</span> Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-cyan-300 font-mono text-xs">Simmetriya — elektron tuzilishning matematik tili</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <OrbitalSimmetriya />
        <DAjralish />
        <ProyeksionOperator />
        <MODiagramma />
        <PiBoglanish />
        <TanlashQoidalari />
        <SpektrokimyoviyIzoh />
        <JahnTellerSimmetry />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <Test />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Orbitallar simmetriyasi:</strong> s→A₁g, p→T₁u, d→E_g+T₂g (O_h); d→E+T₂ (T_d teskari!)</li>
            <li><strong className="text-yellow-400">Proyeksion operator:</strong> P^Γ = (d_Γ/h)·Σχ_Γ(R)·R — SALC larni yaratadi</li>
            <li>MO da <strong className="text-yellow-400">faqat bir xil IRREPS</strong> li orbitallar ta'sirlashadi</li>
            <li>HOMO = t₂g (T₂g), LUMO = e_g* (E_g). Δ₀ = E(LUMO) − E(HOMO)</li>
            <li>π-akseptor → t₂g↓ → Δ₀↑ (kuchli maydon). π-donor → t₂g↑ → Δ₀↓ (kuchsiz)</li>
            <li><strong className="text-yellow-400">Tanlash qoidalari:</strong> Γ_i ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g. Laport: g→g taqiqlangan</li>
            <li>Jahn-Teller: degenerat E_g → A₁g + B₁g (O_h → D₄h)</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/tebranish" className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2"><span>←</span> Tebranish spektrlari</Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/3d" className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20">3D vizualizatsiya <span>→</span></Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> Cotton — Chemical Applications of Group Theory | Housecroft — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
