"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// O_h VA T_d XARAKTERLAR JADVALI MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════════
const OH_TABLE = {
  name:"O_h", order:48, classes:11,
  head:["IR","E","8C₃","6C₂","6C₄","3C₂'","i","6S₄","8S₆","3σ_h","6σ_d","Bazis funksiyalar"],
  rows:[
    {ir:"A₁g", chars:["1","1","1","1","1","1","1","1","1","1"], basis:"s, x²+y²+z²", dim:1, g:true, desc:"To'liq simmetrik. Raman-faol."},
    {ir:"A₂g", chars:["1","1","−1","−1","1","1","−1","1","1","−1"], basis:"—", dim:1, g:true, desc:"C₄ bo'yicha antisimmetrik."},
    {ir:"E_g", chars:["2","−1","0","0","2","2","0","−1","2","0"], basis:"(2z²−x²−y², x²−y²)", dim:2, g:true, desc:"2D degenerat. d_z², d_x²−y². Raman-faol."},
    {ir:"T₁g", chars:["3","0","−1","1","−1","3","1","0","−1","−1"], basis:"(R_x,R_y,R_z)", dim:3, g:true, desc:"3D degenerat. Aylanish."},
    {ir:"T₂g", chars:["3","0","1","−1","−1","3","−1","0","−1","1"], basis:"(xy, xz, yz)", dim:3, g:true, desc:"d_xy,d_xz,d_yz. Raman-faol. t₂g sathi."},
    {ir:"A₁u", chars:["1","1","1","1","1","−1","−1","−1","−1","−1"], basis:"—", dim:1, g:false, desc:"Inversiyaga nisbatan antisimmetrik."},
    {ir:"A₂u", chars:["1","1","−1","−1","1","−1","1","−1","−1","1"], basis:"—", dim:1, g:false, desc:""},
    {ir:"E_u", chars:["2","−1","0","0","2","−2","0","1","−2","0"], basis:"—", dim:2, g:false, desc:"2D degenerat, u."},
    {ir:"T₁u", chars:["3","0","−1","1","−1","−3","−1","0","1","1"], basis:"(x, y, z)", dim:3, g:false, desc:"Dipol moment. IQ-faol. x,y,z."},
    {ir:"T₂u", chars:["3","0","1","−1","−1","−3","1","0","1","−1"], basis:"—", dim:3, g:false, desc:"3D degenerat, u."},
  ]
}

const TD_TABLE = {
  name:"T_d", order:24, classes:5,
  head:["IR","E","8C₃","3C₂","6S₄","6σ_d","Bazis funksiyalar"],
  rows:[
    {ir:"A₁", chars:["1","1","1","1","1"], basis:"s, x²+y²+z²", dim:1, desc:"To'liq simmetrik."},
    {ir:"A₂", chars:["1","1","1","−1","−1"], basis:"—", dim:1, desc:"S₄ bo'yicha antisimmetrik."},
    {ir:"E", chars:["2","−1","2","0","0"], basis:"(2z²−x²−y², x²−y²)", dim:2, desc:"2D. d_z²,d_x²−y². Pastki sath."},
    {ir:"T₁", chars:["3","0","−1","1","−1"], basis:"(R_x,R_y,R_z)", dim:3, desc:"3D. Aylanish."},
    {ir:"T₂", chars:["3","0","−1","−1","1"], basis:"(x,y,z); (xy,xz,yz)", dim:3, desc:"d_xy,d_xz,d_yz. Yuqori sath. IQ+Raman!"},
  ]
}

const D4H_TABLE = {
  name:"D₄h", order:16, classes:10,
  head:["IR","E","2C₄","C₂","2C₂'","2C₂''","i","2S₄","σ_h","2σ_v","2σ_d","Bazis"],
  rows:[
    {ir:"A₁g", chars:["1","1","1","1","1","1","1","1","1","1"], basis:"x²+y²+z²", dim:1, g:true, desc:"To'liq simmetrik. d_z²."},
    {ir:"A₂g", chars:["1","1","1","−1","−1","1","1","−1","1","−1"], basis:"—", dim:1, g:true, desc:""},
    {ir:"B₁g", chars:["1","−1","1","1","−1","1","−1","1","1","−1"], basis:"x²−y²", dim:1, g:true, desc:"d_x²−y². Eng yuqori."},
    {ir:"B₂g", chars:["1","−1","1","−1","1","1","−1","1","−1","1"], basis:"xy", dim:1, g:true, desc:"d_xy. O'rta."},
    {ir:"E_g", chars:["2","0","−2","0","0","2","0","−2","0","0"], basis:"(xz,yz)", dim:2, g:true, desc:"d_xz,d_yz. Eng past."},
    {ir:"A₁u", chars:["1","1","1","1","1","−1","−1","−1","−1","−1"], basis:"—", dim:1, g:false, desc:""},
    {ir:"A₂u", chars:["1","1","1","−1","−1","−1","−1","1","−1","1"], basis:"z", dim:1, g:false, desc:"IQ-faol (z)."},
    {ir:"B₁u", chars:["1","−1","1","1","−1","−1","1","−1","−1","1"], basis:"—", dim:1, g:false, desc:""},
    {ir:"B₂u", chars:["1","−1","1","−1","1","−1","1","−1","1","−1"], basis:"—", dim:1, g:false, desc:"\"Jim\" moda."},
    {ir:"E_u", chars:["2","0","−2","0","0","−2","0","2","0","0"], basis:"(x,y)", dim:2, g:false, desc:"IQ-faol (x,y)."},
  ]
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV JADVAL BROWSER
// ═══════════════════════════════════════════════════════════════════════════════
function JadvalBrowser() {
  const [point, setPoint] = useState("oh")
  const [selected, setSelected] = useState(null)

  const tables = { oh: OH_TABLE, td: TD_TABLE, d4h: D4H_TABLE }
  const t = tables[point]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-blue-400">📊</span> Interaktiv xarakterlar jadvali
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={()=>{setPoint("oh");setSelected(null)}} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${point==="oh"?"bg-blue-600 text-white":"bg-purple-900/50 text-purple-300"}`}>O_h — Oktaedrik (48)</button>
        <button onClick={()=>{setPoint("td");setSelected(null)}} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${point==="td"?"bg-green-600 text-white":"bg-purple-900/50 text-purple-300"}`}>T_d — Tetraedrik (24)</button>
        <button onClick={()=>{setPoint("d4h");setSelected(null)}} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${point==="d4h"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>D₄h — Kvadrat tekis (16)</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[8px] sm:text-[10px]">
          <thead>
            <tr className="bg-purple-800/70">
              {t.head.map((h,i)=>(
                <th key={i} className={`p-1 sm:p-1.5 ${i===0?"text-left text-amber-400":"text-center text-purple-300 font-mono"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row,i)=>(
              <tr key={i} onClick={()=>setSelected(selected===i?null:i)}
                className={`border-t border-purple-800/30 cursor-pointer transition-all ${selected===i?"bg-amber-900/30 ring-1 ring-amber-500/40":i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/40`}>
                <td className={`p-1 sm:p-1.5 font-bold font-mono ${row.g!==undefined?(row.g?"text-green-300":"text-blue-300"):"text-amber-300"}`}>{row.ir}</td>
                {row.chars.map((c,j)=>(
                  <td key={j} className="p-1 sm:p-1.5 text-center text-purple-200">{c}</td>
                ))}
                <td className="p-1 sm:p-1.5 text-purple-400 text-[7px] sm:text-[9px] font-mono">{row.basis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected!==null && (
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold font-mono text-lg ${t.rows[selected].g!==undefined?(t.rows[selected].g?"text-green-300":"text-blue-300"):"text-amber-300"}`}>{t.rows[selected].ir}</span>
            <span className="text-purple-400 text-xs">{t.rows[selected].dim}D</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${t.rows[selected].g===true?"bg-green-700/30 text-green-300":t.rows[selected].g===false?"bg-red-700/30 text-red-300":"bg-amber-700/30 text-amber-300"}`}>{t.rows[selected].g===true?"g (gerade)":t.rows[selected].g===false?"u (ungerade)":"—"}</span>
          </div>
          <p className="text-purple-200 text-xs">{t.rows[selected].desc}</p>
          <p className="text-purple-400 text-[10px] mt-1"><strong>Bazis:</strong> {t.rows[selected].basis}</p>
        </div>
      )}

      <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-purple-300"><strong className="text-yellow-400">{t.name}</strong> guruhi: {t.order} ta amal, {t.rows.length} ta qaytarilmas tasvir. Bosilgan qator haqida ma'lumot olish mumkin.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MULLIKEN BELGILARI — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function MullikenBelgilari() {
  const [sel, setSel] = useState("A")
  const data = {
    A:{n:"A",dim:"1D",desc:"Bosh o'q Cₙ bo'yicha simmetrik: χ(Cₙ)=+1",ex:"A₁g (O_h) — to'liq simmetrik",c:"text-green-400",bg:"bg-green-600/10 border-green-500/30"},
    B:{n:"B",dim:"1D",desc:"Bosh o'q Cₙ bo'yicha antisimmetrik: χ(Cₙ)=−1",ex:"B₁g (D4h) — d_x²−y²",c:"text-emerald-400",bg:"bg-emerald-600/10 border-emerald-500/30"},
    E:{n:"E",dim:"2D",desc:"Ikki karra degenerat. 'Entartet' — nemischa 'degenerat'",ex:"E_g (O_h) — d_z², d_x²−y²",c:"text-blue-400",bg:"bg-blue-600/10 border-blue-500/30"},
    T:{n:"T",dim:"3D",desc:"Uch karra degenerat. 'Dreifach' — nemischa 'uch karra'",ex:"T₂g (O_h) — d_xy, d_xz, d_yz",c:"text-purple-400",bg:"bg-purple-600/10 border-purple-500/30"},
    g:{n:"g",dim:"—",desc:"gerade (juft). Inversiyaga nisbatan simmetrik: χ(i)=+1",ex:"d-orbitallar (s,d,g) — g simmetriyali",c:"text-green-400",bg:"bg-green-600/10 border-green-500/30"},
    u:{n:"u",dim:"—",desc:"ungerade (toq). Inversiyaga nisbatan antisim.: χ(i)=−1",ex:"p,f orbitallar — u simmetriyali",c:"text-red-400",bg:"bg-red-600/10 border-red-500/30"},
  }
  const d = data[sel]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🏷️</span> Mulliken belgilari — interaktiv
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(data).map(([k,v])=>(
            <button key={k} onClick={()=>setSel(k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sel===k?`${v.bg} ${v.c} scale-105`:"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>{v.n}</button>
          ))}
        </div>
        <div className={`rounded-xl p-4 border ${d.bg}`}>
          <h4 className={`font-bold text-lg ${d.c}`}>{d.n}</h4>
          <p className="text-purple-200 text-xs mt-1"><strong className="text-yellow-400">Ma'nosi:</strong> {d.desc}</p>
          {d.dim!=="—" && <p className="text-purple-400 text-xs">Degeneratlik: {d.dim}</p>}
          <p className="text-purple-300 text-xs mt-1">📌 {d.ex}</p>
        </div>
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs mt-3 space-y-1">
        <p className="text-purple-400 font-bold">Mulliken belgilari qoidalari:</p>
        <p className="text-purple-200">• <strong>A/B:</strong> Cₙ bo'yicha χ = +1 (A) yoki −1 (B) → 1 o'lchamli</p>
        <p className="text-purple-200">• <strong>E:</strong> 2 o'lchamli degenerat tasvir (χ(E)=2)</p>
        <p className="text-purple-200">• <strong>T:</strong> 3 o'lchamli degenerat tasvir (χ(E)=3)</p>
        <p className="text-purple-200">• <strong>g/u:</strong> inversiyaga nisbatan χ(i)=+1 (g) yoki −1 (u)</p>
        <p className="text-purple-200">• <strong>'/":</strong> σ_h bo'yicha simmetrik/antisimmetrik (D₃h, D₆h da)</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ORTOGONALLIK TEOREMASI
// ═══════════════════════════════════════════════════════════════════════════════
function Ortogonallik() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">📐</span> Ortogonallik teoremalari
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {t:"1-teorema (qatorlar)",f:"Σ_R χ_i(R)*·χ_j(R) = h·δ_ij",d:"Ikki xil qaytarilmas tasvirning xarakterlari ko'paytmasi yig'indisi = 0 (ortogonal). Bir xil bo'lsa = h."},
          {t:"2-teorema (ustunlar)",f:"Σ_i χ_i(R)*·χ_i(S) = (h/N_R)·δ_RS",d:"Ikki xil sinfdagi xarakterlar ko'paytmasi yig'indisi = 0. Bir xil sinfda = h/N_R."},
          {t:"Degeneratlik",f:"Σ_i [dim(Γ_i)]² = h",d:"Barcha qaytarilmas tasvirlar o'lchamlari kvadratlari yig'indisi guruh tartibiga teng."},
          {t:"Xarakterlar yig'indisi",f:"Σ_R N_R·χ_i(R) = 0 (i≠A₁)",d:"A₁ dan boshqa barcha qaytarilmas tasvirlar uchun xarakterlarning vaznli yig'indisi 0."},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
            <p className="text-yellow-400 font-bold text-xs">{r.t}</p>
            <div className="bg-purple-950/90 rounded p-2 my-2"><p className="text-center text-yellow-300 font-mono text-xs">{r.f}</p></div>
            <p className="text-purple-200 text-[10px]">{r.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ O_h uchun tekshirish: 1²+1²+2²+3²+3²+1²+1²+2²+3²+3² = 1+1+4+9+9+1+1+4+9+9 = 48 = h ✓</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. Γ NI AJRATISH — INTERAKTIV KALKULYATOR
// ═══════════════════════════════════════════════════════════════════════════════
function AjratishKalkulyator() {
  const [point, setPoint] = useState("oh")
  const [gammaChars, setGammaChars] = useState(["","","","","","","","","",""])
  const [result, setResult] = useState("")

  const tables = {
    oh: {name:"O_h", irs:OH_TABLE.rows.map(r=>r.ir), chars:OH_TABLE.rows.map(r=>r.chars), h:48, classes:["E","8C₃","6C₂","6C₄","3C₂'","i","6S₄","8S₆","3σ_h","6σ_d"], ns:[1,8,6,6,3,1,6,8,3,6]},
    td: {name:"T_d", irs:TD_TABLE.rows.map(r=>r.ir), chars:TD_TABLE.rows.map(r=>r.chars), h:24, classes:["E","8C₃","3C₂","6S₄","6σ_d"], ns:[1,8,3,6,6]},
    d4h: {name:"D₄h", irs:D4H_TABLE.rows.map(r=>r.ir), chars:D4H_TABLE.rows.map(r=>r.chars), h:16, classes:["E","2C₄","C₂","2C₂'","2C₂''","i","2S₄","σ_h","2σ_v","2σ_d"], ns:[1,2,1,2,2,1,2,1,2,2]},
  }

  const t = tables[point]

  const handleCalc = () => {
    const gChars = gammaChars.map(c => c.trim()===""?0:parseFloat(c)).filter(c=>!isNaN(c))
    if(gChars.length!==t.classes) {setResult("Iltimos barcha maydonlarni to'ldiring!");return}

    let lines = []
    lines.push(`Γ ni ${t.name} IRREPS lariga ajratish:`)
    lines.push(`h = ${t.h}`)
    lines.push("")

    t.irs.forEach((ir,i)=>{
      let sum = 0
      for(let j=0;j<t.classes;j++){
        sum += parseInt(t.ns[j]) * gChars[j] * parseInt(t.chars[i][j])
      }
      const ai = sum/t.h
      if(ai>0) lines.push(`${ir}: a = (1/${t.h})·(${sum}) = ${ai.toFixed(2)} → ${Math.round(ai)} marta`)
    })

    let total = ""
    t.irs.forEach((ir,i)=>{
      let sum=0; for(let j=0;j<t.classes;j++) sum+=parseInt(t.ns[j])*gChars[j]*parseInt(t.chars[i][j])
      const ai=Math.round(sum/t.h)
      if(ai>0) total += `${ai}·${ir} + `
    })
    total = total.replace(/ \+ $/,"")
    lines.push("")
    lines.push(`Γ = ${total}`)
    setResult(lines.join("\n"))
  }

  const setExample = (ex) => {
    const examples = {
      "oh_vib":["6","0","0","2","2","0","0","0","4","2"],
      "oh_d":["5","−1","1","−1","1","1","−1","−1","1","−1"],
      "td_vib":["5","2","1","1","3"],
    }
    setGammaChars(examples[ex] || gammaChars)
    setResult("")
  }

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">🧮</span> Γ ni qaytarilmas tasvirlarga ajratish kalkulyatori
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={()=>setPoint("oh")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${point==="oh"?"bg-blue-600 text-white":"bg-purple-900/50 text-purple-300"}`}>O_h</button>
            <button onClick={()=>setPoint("td")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${point==="td"?"bg-green-600 text-white":"bg-purple-900/50 text-purple-300"}`}>T_d</button>
            <button onClick={()=>setPoint("d4h")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${point==="d4h"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>D₄h</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {t.classes.map((c,i)=>(
              <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-1.5 text-center">
                <p className="text-purple-400 text-[8px] font-mono">{c}</p>
                <input value={gammaChars[i]||""} onChange={(e)=>{
                  const newChars = [...gammaChars]; newChars[i]=e.target.value; setGammaChars(newChars); setResult("")
                }} className="w-full bg-purple-950/90 border border-purple-700/30 rounded text-center text-yellow-300 font-mono text-xs p-0.5" placeholder="χ" />
                <p className="text-purple-600 text-[7px]">N={t.ns[i]}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5 flex-wrap">
            <button onClick={handleCalc} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all">Hisoblash</button>
            <span className="text-purple-400 text-[10px] self-center">|</span>
            <button onClick={()=>setExample("oh_vib")} className="px-2 py-1 rounded-lg text-[10px] bg-purple-900/50 text-purple-300 hover:bg-purple-800">Misol: O_h tebranish</button>
            <button onClick={()=>setExample("oh_d")} className="px-2 py-1 rounded-lg text-[10px] bg-purple-900/50 text-purple-300 hover:bg-purple-800">Misol: d-orbitallar</button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-purple-300 text-xs font-semibold">Natija:</p>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3">
            {result ? (
              <pre className="text-purple-200 text-xs font-mono whitespace-pre-wrap leading-relaxed">{result}</pre>
            ) : (
              <p className="text-purple-400 text-[10px]">Yuqoridagi maydonlarga Γ ning xarakterlarini kiriting va "Hisoblash" tugmasini bosing. Yoki misol yuklang.</p>
            )}
          </div>

          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-2 text-[10px]">
            <p className="text-purple-400 font-bold">Formula:</p>
            <p className="text-yellow-300 font-mono text-center">aᵢ = (1/h) · Σ[N_R · χ_Γ(R) · χᵢ(R)]</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. d-ORBITAL SIMMETRIYASI — XARAKTERLAR ASOSIDA
// ═══════════════════════════════════════════════════════════════════════════════
function DOrbitalXarakter() {
  const [geo, setGeo] = useState("oh")
  const data = {
    oh: {name:"O_h", rows:[
      {orb:"d_z²", ir:"E_g", chars:["2","−1","0","0","2","2","0","−1","2","0"]},
      {orb:"d_x²−y²", ir:"E_g", chars:["2","−1","0","0","2","2","0","−1","2","0"]},
      {orb:"d_xy", ir:"T₂g", chars:["3","0","1","−1","−1","3","−1","0","−1","1"]},
      {orb:"d_xz", ir:"T₂g", chars:["3","0","1","−1","−1","3","−1","0","−1","1"]},
      {orb:"d_yz", ir:"T₂g", chars:["3","0","1","−1","−1","3","−1","0","−1","1"]},
    ]},
    td: {name:"T_d", rows:[
      {orb:"d_z²", ir:"E", chars:["2","−1","2","0","0"]},
      {orb:"d_x²−y²", ir:"E", chars:["2","−1","2","0","0"]},
      {orb:"d_xy", ir:"T₂", chars:["3","0","−1","−1","1"]},
      {orb:"d_xz", ir:"T₂", chars:["3","0","−1","−1","1"]},
      {orb:"d_yz", ir:"T₂", chars:["3","0","−1","−1","1"]},
    ]},
    d4h: {name:"D₄h", rows:[
      {orb:"d_z²", ir:"A₁g", chars:["1","1","1","1","1","1","1","1","1","1"]},
      {orb:"d_x²−y²", ir:"B₁g", chars:["1","−1","1","1","−1","1","−1","1","1","−1"]},
      {orb:"d_xy", ir:"B₂g", chars:["1","−1","1","−1","1","1","−1","1","−1","1"]},
      {orb:"d_xz", ir:"E_g", chars:["2","0","−2","0","0","2","0","−2","0","0"]},
      {orb:"d_yz", ir:"E_g", chars:["2","0","−2","0","0","2","0","−2","0","0"]},
    ]}
  }
  const d = data[geo]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🔬</span> d-orbitallarning xarakterlar jadvalidan kelib chiqishi
      </h3>

      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(data).map(([k,v])=>(
          <button key={k} onClick={()=>setGeo(k)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${geo===k?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300"}`}>{v.name}</button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1 sm:p-1.5 text-left text-amber-400">Orbital</th>
              <th className="p-1 sm:p-1.5 text-left text-amber-400">IRREPS</th>
              {d.rows[0].chars.map((_,i)=>(
                <th key={i} className="p-1 sm:p-1.5 text-center text-purple-300 font-mono text-[8px]">{String.fromCharCode(65+i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.rows.map((row,i)=>(
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1 sm:p-1.5 font-mono font-bold text-yellow-300">{row.orb}</td>
                <td className={`p-1 sm:p-1.5 font-mono font-bold ${row.ir.includes("g")?"text-green-400":"text-blue-300"}`}>{row.ir}</td>
                {row.chars.map((c,j)=>(
                  <td key={j} className="p-1 sm:p-1.5 text-center text-purple-200">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px] mt-3">
        <p className="text-yellow-400 font-bold">⚡ Xarakterlar jadvalidan foydalanib, qaysi d-orbitallar qaysi IRREPS ga tegishli ekanligi aniqlanadi.</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. AMALIY QO'LLANISHLAR
// ═══════════════════════════════════════════════════════════════════════════════
function AmaliyQollanishlar() {
  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-emerald-400">💡</span> Xarakterlar jadvalining amaliy qo'llanilishi
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          {t:"📡 IQ faollik",d:"Tebranish modi IQ-faol bo'lishi uchun Γ_teb ∩ Γ_dipol ≠ Ø. O_h da dipol=T₁u → faqat T₁u modlar IQ faol."},
          {t:"🔦 Raman faollik",d:"Γ_teb ∩ Γ_α ≠ Ø. O_h da α=A₁g+E_g+T₂g → bu IRREPS lar Raman faol. Alternativ taqiq: g↔u."},
          {t:"⚡ Elektron o'tishlar",d:"O'tish ruxsat: Γ_i ⊗ Γ_dipol ⊗ Γ_f ⊇ A₁g. d-d o'tish O_h da Laport taqiqlangan."},
          {t:"🔗 MO diagramma",d:"Faqat bir xil simmetriyali (IRREPS) orbitallar o'zaro ta'sirlashadi — MO energiya sathlari."},
        ].map((r,i)=>(
          <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-yellow-400 font-bold">{r.t}</p>
            <p className="text-purple-200 mt-1">{r.d}</p>
          </div>
        ))}
      </div>

      <div className="bg-purple-950/80 border border-purple-700/30 rounded-lg p-3 text-xs mt-3">
        <p className="text-purple-400 font-bold">📌 Misol — [Co(NH₃)₆]³⁺ da d-d o'tish:</p>
        <p className="text-purple-200">Boshlang'ich: T₂g (t₂g⁶). Oxirgi: E_g (e_g¹). Dipol: T₁u.</p>
        <p className="text-purple-200">T₂g ⊗ T₁u ⊗ E_g = ? A₁g kerak. Hisob: T₂g⊗T₁u = A₁u+E_u+T₁u+T₂u. (A₁u+E_u+T₁u+T₂u)⊗E_g → A₁g? <strong className="text-yellow-300">Yo'q → taqiqlangan!</strong></p>
        <p className="text-purple-300 mt-1">Shuning uchun oktaedrik komplekslarning rangi kuchsiz (ε ~ 1-100 M⁻¹cm⁻¹).</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestXarakter() {
  const questions = [
    { q:"O_h guruhida nechta qaytarilmas tasvir (IRREPS) bor?", a:"10 ta (5 g + 5 u)", opts:["5 ta","8 ta","10 ta (5 g + 5 u)","12 ta"], hint:"A₁g, A₂g, E_g, T₁g, T₂g, A₁u, A₂u, E_u, T₁u, T₂u" },
    { q:"Mulliken belgisi 'E' nimani anglatadi?", a:"2 o'lchamli degenerat tasvir", opts:["1 o'lchamli","2 o'lchamli degenerat tasvir","3 o'lchamli degenerat","Inversiyaga nisbatan simmetrik"], hint:"Entartet — nemischa degenerat" },
    { q:"O_h da qaysi IRREPS d_z² va d_x²−y² orbitallarga mos keladi?", a:"E_g", opts:["T₂g","E_g","A₁g","T₁u"], hint:"t₂g (3) + e_g (2)" },
    { q:"g (gerade) va u (ungerade) belgilari nimaga asoslanadi?", a:"Inversiya markaziga nisbatan simmetriya", opts:["Aylanish o'qiga nisbatan","Inversiya markaziga nisbatan simmetriya","σ_h ga nisbatan","C₄ ga nisbatan"], hint:"χ(i)=+1 (g), χ(i)=−1 (u)" },
    { q:"Xarakterlar jadvalining ortogonallik teoremasiga ko'ra, O_h da 1²+1²+2²+3²+3²+1²+1²+2²+3²+3² = ?", a:"48 = h", opts:["24","48 = h","10","12"], hint:"Barcha IRREPS o'lchamlari kvadratlari yig'indisi = guruh tartibi" },
    { q:"O_h da qaysi IRREPS IQ faol?", a:"T₁u", opts:["A₁g","E_g","T₁u","T₂g"], hint:"Dipol moment (x,y,z) — T₁u" },
    { q:"T_d da d-orbitallar qanday IRREPS larga ajraladi?", a:"E + T₂", opts:["T₂g + E_g","E + T₂","A₁g + T₂g","E_g + T₁u"], hint:"Tetraedrikda teskari!" },
    { q:"Γ = A₁g + T₁u + E_g. Bu tasvir necha o'lchamli?", a:"1+3+2 = 6 o'lchamli", opts:["3 o'lchamli","6 o'lchamli","5 o'lchamli","4 o'lchamli"], hint:"1+3+2=6" },
    { q:"D₄h da d_z² qaysi IRREPS ga tegishli?", a:"A₁g", opts:["A₁g","B₁g","B₂g","E_g"], hint:"To'liq simmetrik, z² — A₁g" },
    { q:"Ortogonallik teoremasining 1-si nimani ifodalaydi?", a:"Ikki xil IRREPS xarakterlari skalyar ko'paytmasi = 0", opts:["Barcha xarakterlar = 0","Ikki xil IRREPS xarakterlari skalyar ko'paytmasi = 0","Xarakterlar yig'indisi = h","Degeneratlik = h"], hint:"Σχᵢ(R)·χⱼ(R) = h·δᵢⱼ" },
  ]

  const [c,setC]=useState(0);const [s,setS]=useState(null);const [sc,setSc]=useState(0)
  const [res,setRes]=useState(false);const [ans,setAns]=useState({})
  const q=questions[c]
  if(res){return(
    <div className="space-y-4"><h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">{sc>=8?"🏆":sc>=5?"👍":"📚"}</div>
        <p className="text-3xl font-bold text-white">{sc}/{questions.length}</p>
        <p className="text-purple-300 mt-2">{sc>=8?"Xarakterlar jadvalini mukammal o'zlashtirdingiz!":sc>=5?"Yaxshi, takrorlash zarur.":"Qayta o'qib chiqing."}</p>
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
export default function Xarakterlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link><span>›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link><span>›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link><span>›</span>
            <Link href="/ilmiy/chuqurlashgan/simmetriya" className="hover:text-purple-300">Simmetriya</Link><span>›</span>
            <span className="text-blue-400">Xarakterlar jadvali</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-blue-400 flex items-center gap-2"><span>📊</span> Xarakterlar jadvali</h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Guruh nazariyasi • Mulliken • O_h • T_d • D₄h • Γ ni ajratish • OTM</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Guruh nazariyasi va xarakterlar jadvali</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Xarakterlar jadvali</strong> — har bir nuqtali guruh uchun 
                uning barcha <strong>qaytarilmas tasvirlari (IRREPS)</strong> va ularning simmetriya amallaridagi 
                <strong>xarakterlarini</strong> o'z ichiga olgan fundamental jadval. Bu orqali orbitallarning 
                simmetriyasini, tebranish modlarining faolligini va elektron o'tishlarning ruxsatini aniqlash mumkin.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">3 ta jadval</span>
                <span className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-2 py-0.5 rounded-full text-[10px]">Γ ajratish kalk.</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-blue-400 font-bold">🎯 Maqsad:</span> Xarakterlar jadvalining tuzilishini, Mulliken belgilarini va Γ ni ajratish usulini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">⏱️ Vaqt:</span> ~4 soat</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">📚 Manba:</span> F.A. Cotton — Chemical Applications of Group Theory</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-blue-300 font-mono text-xs font-bold">Xarakterlar jadvali — guruh nazariyasining asosiy vositasi</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOMPONENTLAR */}
        <JadvalBrowser />
        <MullikenBelgilari />
        <Ortogonallik />
        <AjratishKalkulyator />
        <DOrbitalXarakter />
        <AmaliyQollanishlar />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestXarakter />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Xarakterlar jadvali</strong> — IRREPS + ularning xarakterlari + bazis funksiyalar</li>
            <li><strong className="text-yellow-400">Mulliken:</strong> A/B (1D), E (2D), T (3D); g — gerade (χ(i)=+1), u — ungerade (χ(i)=−1)</li>
            <li><strong className="text-blue-400">O_h (10 ta IRREPS):</strong> d→T₂g+E_g. dipol→T₁u. α→A₁g+E_g+T₂g</li>
            <li><strong className="text-green-400">T_d (5 ta IRREPS):</strong> d→E+T₂ (teskari!). g/u yo'q</li>
            <li><strong className="text-purple-400">D₄h (10 ta IRREPS):</strong> d→A₁g+B₁g+B₂g+E_g. 4 xil sath</li>
            <li><strong className="text-yellow-400">Γ ni ajratish:</strong> aᵢ = (1/h)·Σ[N_R·χ_Γ(R)·χᵢ(R)]</li>
            <li><strong className="text-yellow-400">Ortogonallik:</strong> Σ_R χᵢ(R)*·χⱼ(R) = h·δᵢⱼ va Σ_i [dim(Γ_i)]² = h</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar" className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2"><span>←</span> Nuqtali guruhlar</Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/tebranish" className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20">Tebranish spektrlari <span>→</span></Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>
    </main>
  )
}
