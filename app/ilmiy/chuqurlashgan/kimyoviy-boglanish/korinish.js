"use client"

import Link from "next/link"
import { oqilganlar, belginiAlmashtir, mavzuniYangila } from "@/lib/oquv-progress"
import { useState, useEffect } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// BO'LIMLAR MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════════════════════════
const BOLIMLAR = [
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/vb-nazariyasi",
    icon: "📐", num: "01",
    title: "Valent bog'lanish (VB) nazariyasi",
    desc: "Gibridlanish: sp, sp², sp³, dsp², d²sp³, sp³d². Kompleks geometriyasini bashorat qilish. Pauling nazariyasi.",
    badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
    level: "boshlangich", levelLabel: "Boshlang'ich", levelColor: "bg-green-600/20 text-green-400 border-green-600/30",
    time: "35 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi",
    icon: "🔄", num: "02",
    title: "Molekulyar orbitallar (MO) nazariyasi",
    desc: "Atom orbitallarining chiziqli kombinatsiyasi (LCAO). σ va π bog'lovchi/bo'shashtiruvchi MO lar. Molekulyar energiya diagrammalari.",
    badge: "Muhim", badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    level: "orta", levelLabel: "O'rta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "40 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar",
    icon: "⚡", num: "03",
    title: "σ-donor va π-akseptor ligandlar",
    desc: "CO, CN⁻, PR₃ — kuchli maydonli ligandlar. Sinergik bog'lanish mexanizmi. Spektrokimyoviy qator.",
    badge: "Chuqur", badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
    level: "ilgor", levelLabel: "Ilg'or", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "45 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish",
    icon: "💎", num: "04",
    title: "Gibridlanish va geometriya",
    desc: "sp → chiziqli, sp³ → tetraedrik, dsp² → tekis kvadrat, d²sp³ → oktaedrik. Geometriya-gibridlanish jadvali.",
    badge: "Jadval", badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    level: "orta", levelLabel: "O'rta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "30 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma",
    icon: "📊", num: "05",
    title: "MO diagrammasi — oktaedrik kompleks",
    desc: "6 ta ligand + metall orbitallari. Bog'lovchi, bo'shashtiruvchi, bog'lamaydigan MO lar. HOMO/LUMO tahlili.",
    badge: "3D model", badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    level: "ilgor", levelLabel: "Ilg'or", levelColor: "bg-red-600/20 text-red-400 border-red-600/30",
    time: "50 daqiqa"
  },
  {
    href: "/ilmiy/chuqurlashgan/kimyoviy-boglanish/elektron-qoidasi",
    icon: "🧪", num: "06",
    title: "18 elektron qoidasi",
    desc: "Metall karbonillari va metallosenlar barqarorligi. [Ni(CO)₄], [Fe(CO)₅], ferrosen misolida. EAN qoidasi.",
    badge: "Qoida", badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
    level: "orta", levelLabel: "O'rta", levelColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    time: "30 daqiqa"
  }
]

// ═══════════════════════════════════════════════════════════════════════════════
// 1. VB vs MO TAQQOSLASH — INTERAKTIV
// ═══════════════════════════════════════════════════════════════════════════════
function VBvsMO() {
  const [view, setView] = useState("vb")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">⚖️</span> VB va MO nazariyalari — interaktiv taqqoslash
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        <button onClick={()=>setView("vb")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view==="vb"?"bg-green-600/60 text-white border border-green-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          📐 VB nazariyasi
        </button>
        <button onClick={()=>setView("mo")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view==="mo"?"bg-blue-600/60 text-white border border-blue-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          🔄 MO nazariyasi
        </button>
        <button onClick={()=>setView("comparison")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${view==="comparison"?"bg-purple-600/60 text-white border border-purple-400/50":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}>
          📊 To'liq taqqoslash
        </button>
      </div>

      {view === "vb" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
              <p className="text-green-400 font-bold text-sm">Valent bog'lanish (VB) nazariyasi</p>
              <p className="text-purple-200"><strong className="text-yellow-300">Asoschilar:</strong> Heitler, London (1927), Pauling (1931)</p>
              <p className="text-purple-200"><strong className="text-yellow-300">Asosiy g'oya:</strong> Bog' — ikkita atom orbitallarining qoplanishidan hosil bo'ladi. Har bir bog'da bittadan elektron jufti.</p>
              <p className="text-purple-200"><strong className="text-yellow-300">Gibridlanish:</strong> Atom orbitallari aralashib, yangi gibrid orbitallarni hosil qiladi. sp, sp², sp³, dsp², sp³d².</p>
            </div>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
              <p className="text-green-400 font-bold">Gibridlanish turlari:</p>
              {[
                {g:"sp", b:2, g2:"180°", misol:"[Ag(NH₃)₂]⁺"},
                {g:"sp²", b:3, g2:"120°", misol:"BF₃"},
                {g:"sp³", b:4, g2:"109.5°", misol:"CH₄, [CoCl₄]²⁻"},
                {g:"dsp²", b:4, g2:"90°", misol:"[PtCl₄]²⁻"},
                {g:"d²sp³", b:6, g2:"90°", misol:"[Co(NH₃)₆]³⁺"},
                {g:"sp³d²", b:6, g2:"90°", misol:"[FeF₆]³⁻"},
              ].map((r,i)=>(
                <div key={i} className="flex items-center justify-between bg-purple-950/50 border border-purple-700/30 rounded p-1.5 text-[10px]">
                  <span className="text-yellow-300 font-mono font-bold">{r.g}</span>
                  <span className="text-purple-300">KN={r.b}</span>
                  <span className="text-purple-300">{r.g2}</span>
                  <span className="text-cyan-300 font-mono">{r.misol}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
            <p className="text-green-400 font-bold">VB nazariyasining asosiy tamoyillari:</p>
            <ol className="list-decimal list-inside space-y-1 text-purple-200">
              <li>Kovalent bog' — <strong>ikki atomli</strong> va <strong>ikki elektronli</strong></li>
              <li>Qoplanish qancha katta bo'lsa, bog' shuncha <strong>kuchli</strong></li>
              <li>Atom orbitallari <strong>gibridlanadi</strong> (energiya jihatidan farqsiz)</li>
              <li>Gibrid orbitallar soni = bog' soni (yakka juftlar bilan)</li>
              <li>σ-bog' — o'q bo'ylab qoplanish; π-bog' — yonma-yon qoplanish</li>
              <li>Maksimal qoplanish prinsipi (Pauling)</li>
            </ol>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 mt-1">
              <p className="text-yellow-400 font-bold">⚡ VB geometriyani yaxshi bashorat qiladi, lekin spektr va magnetizmni tushuntirishda MO dan past.</p>
            </div>
          </div>
        </div>
      )}

      {view === "mo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
              <p className="text-blue-400 font-bold text-sm">Molekulyar orbitallar (MO) nazariyasi</p>
              <p className="text-purple-200"><strong className="text-yellow-300">Asoschilar:</strong> Hund, Mulliken (1932), Lennard-Jones</p>
              <p className="text-purple-200"><strong className="text-yellow-300">Asosiy g'oya:</strong> Atom orbitallari butun molekula bo'ylab delokalizatsiyalangan MO larga birikadi.</p>
              <p className="text-purple-200"><strong className="text-yellow-300">LCAO:</strong> MO = Σ cᵢ·AOᵢ — chiziqli kombinatsiya.</p>
            </div>
            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
              <p className="text-blue-400 font-bold">MO turlari:</p>
              {[
                {t:"σ (bog'lovchi)", s:"+,+ qoplanish", e:"Energiya past", n:"Bog' mustahkam"},
                {t:"σ* (bo'shashtiruvchi)", s:"+,− qoplanish", e:"Energiya yuqori", n:"Bog' kuchsizlanadi"},
                {t:"π (bog'lovchi)", s:"Yonma-yon qoplanish", e:"σ dan yuqori", n:"Ikki/uch bog'"},
                {t:"π* (bo'shashtiruvchi)", s:"Yonma-yon +,−", e:"Eng yuqori", n:"π-bog'ni buzadi"},
                {t:"n (bog'lamaydigan)", s:"Qatnashmaydi", e:"Oraliq", n:"Aynan metall t₂g"},
              ].map((r,i)=>(
                <div key={i} className="flex items-center justify-between bg-purple-950/50 border border-purple-700/30 rounded p-1.5 text-[9px]">
                  <span className="text-cyan-300 font-mono font-bold w-16">{r.t}</span>
                  <span className="text-purple-300 w-20">{r.s}</span>
                  <span className="text-purple-300 w-16">{r.e}</span>
                  <span className="text-purple-300 w-20">{r.n}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
            <p className="text-blue-400 font-bold">MO nazariyasining asosiy tamoyillari:</p>
            <ol className="list-decimal list-inside space-y-1 text-purple-200">
              <li>Har bir MO 2 tagacha elektron <strong>saqlaydi</strong> (Pauli prinsipi)</li>
              <li>Elektronlar <strong>avval past energiyali</strong> MO larni to'ldiradi (Aufbau)</li>
              <li><strong>Bog' tartibi</strong> = (N_bog' − N_bo'sh)/2</li>
              <li>Faqat <strong>bir xil simmetriyali</strong> AO lar ta'sirlashadi</li>
              <li>Qoplanish integrali <strong>S</strong> — qancha katta bo'lsa, MO shuncha stabillashadi</li>
              <li>σ, π, δ — bog'larning <strong>simmetriya turlari</strong></li>
            </ol>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 mt-1">
              <p className="text-yellow-400 font-bold">⚡ MO spektr va magnetizmni tushuntiradi (d-d o'tish, Δ₀, spin).</p>
            </div>
          </div>
        </div>
      )}

      {view === "comparison" && (
        <div className="overflow-x-auto">
          <table className="w-full text-[9px] sm:text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-1.5 text-left text-amber-400">Xususiyat</th>
                <th className="p-1.5 text-left text-green-400">VB nazariyasi</th>
                <th className="p-1.5 text-left text-blue-400">MO nazariyasi</th>
              </tr>
            </thead>
            <tbody>
              {[
                {x:"Bog' tushunchasi", vb:"Ikki atomli, lokalizatsiyalangan", mo:"Ko'p atomli, delokalizatsiyalangan"},
                {x:"Elektronlar", vb:"Bog'da juftlashgan (2e⁻)", mo:"MO larda taqsimlangan"},
                {x:"Gibridlanish", vb:"Asosiy tushuncha — kerak", mo:"Keraksiz — simmetriya yetarli"},
                {x:"Geometriya", vb:"A'lo bashorat qiladi", mo:"Bilvosita (simmetriya orqali)"},
                {x:"Spektr", vb:"Zaif tushuntiradi", mo:"A'lo darajada tushuntiradi"},
                {x:"Magnetizm", vb:"Zaif", mo:"A'lo (yuqori/past spin)"},
                {x:"Bog' tartibi", vb:"Bog'lar soni", mo:"(N_bog'−N_bo'sh)/2"},
                {x:"Simmetriya", vb:"Kerak emas", mo:"Asosiy — simmetriya tushunchasi"},
                {x:"Δ₀ (ajralish)", vb:"Tushuntira olmaydi", mo:"To'liq tushuntiradi"},
                {x:"Kompyuter hisobi", vb:"Murakkab", mo:"Ko'p qo'llaniladi (DFT, HF)"},
              ].map((r,i)=>(
                <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                  <td className="p-1.5 font-bold text-yellow-300">{r.x}</td>
                  <td className="p-1.5 text-green-200">{r.vb}</td>
                  <td className="p-1.5 text-blue-200">{r.mo}</td>
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
// 2. BOG'LANISH TURLARI — INTERAKTIV DIAGRAMMA
// ═══════════════════════════════════════════════════════════════════════════════
function BoglanishTurlari() {
  const [selType, setSelType] = useState("ion")

  const types = {
    ion: {
      name:"Ion bog'", icon:"⚡", color:"#ef4444",
      desc:"Metall + nometall. Elektron to'liq uzatiladi. Zaryadlar orasidagi elektrostatik tortishish.",
      en:"~400-4000 kJ/mol", dir:"Yo'nalishsiz", ex:"Na⁺Cl⁻, [Co(NH₃)₆]³⁺·3Cl⁻",
      note:"Kompleks birikmalarda tashqi sferada. Ichki sfera — kovalent bog'."
    },
    kovalent: {
      name:"Kovalent bog'", icon:"🔗", color:"#22c55e",
      desc:"Ikki atom elektron juftini baham ko'radi. σ (kuchli) va π (kuchsiz) turlari bor.",
      en:"~150-800 kJ/mol", dir:"Yo'naltirilgan (qoplanish)", ex:"M−L σ-bog', CO, CH₄",
      note:"Kompleksda M−L bog' — koordinatsion kovalent (donor-akseptor)."
    },
    metall: {
      name:"Metall bog'", icon:"🔩", color:"#f59e0b",
      desc:"Metall atomlari orasida delokalizatsiyalangan elektronlar. 'Elektron dengizi' modeli.",
      en:"~100-350 kJ/mol", dir:"Yo'nalishsiz", ex:"Cu, Fe, Pt metall panjarasi",
      note:"Kompleks birikmalarda metall−metall bog' (M−M) muhim."
    },
    vanderwaals: {
      name:"Van der Waals", icon:"🌀", color:"#3b82f6",
      desc:"Molekulalararo kuch. Dipol-dipol, London dispersiya, vodorod bog'i.",
      en:"~1-50 kJ/mol", dir:"Yo'nalishsiz", ex:"Molekulyar kristallar, H₂O",
      note:"Komplekslarda ligand−ligand va molekulalararo o'zaro ta'sirlar."
    },
    donor: {
      name:"Donor-akseptor", icon:"🎯", color:"#a855f7",
      desc:"Ligand (donor) → metall (akseptor) elektron juftini beradi. Koordinatsion bog'.",
      en:"~200-600 kJ/mol", dir:"Yo'naltirilgan", ex:"NH₃→Co³⁺, :CO→Fe",
      note:"Kompleks birikmalarning asosiy bog'lanish turi. σ + π."
    }
  }

  const d = types[selType]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-cyan-400">🔗</span> Bog'lanish turlari — interaktiv diagramma
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(types).map(([k,v]) => (
          <button key={k} onClick={()=>setSelType(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selType===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={selType===k ? {background:`${v.color}33`, borderColor:`${v.color}66`, color:v.color} : {}}>
            {v.icon} {v.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 text-center"
          style={{borderLeft:`3px solid ${d.color}`}}>
          <div className="text-4xl mb-2">{d.icon}</div>
          <p className="text-base font-bold mb-1" style={{color:d.color}}>{d.name}</p>
          <p className="text-purple-200 text-xs">{d.desc}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-purple-400">Energiya:</span><span className="text-yellow-300 font-mono">{d.en}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Yo'nalishi:</span><span className="text-cyan-300">{d.dir}</span></div>
          <div className="flex justify-between"><span className="text-purple-400">Misol:</span><span className="text-green-300 font-mono">{d.ex}</span></div>
          <div className="bg-purple-950/80 border border-purple-700/30 rounded p-1.5 mt-1">
            <p className="text-yellow-400 font-bold">💡 </p>
            <p className="text-purple-200">{d.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. SPEKTROKIMYOVIY QATOR — LIGAND KLASSIFIKATSIYASI
// ═══════════════════════════════════════════════════════════════════════════════
function SpektrokimyoviyQator() {
  const [ligand, setLigand] = useState("cn")

  const ligands = {
    cn: {name:"CN⁻", type:"π-akseptor", delta:33000, color:"bg-violet-500", h:85, d:"Kuchli maydon, past spin. t₂g stabillashadi.", ex:"[Fe(CN)₆]⁴⁻ LS"},
    co: {name:"CO", type:"π-akseptor", delta:35000, color:"bg-purple-500", h:90, d:"Eng kuchli maydon. t₂g → π* orqaga donorlik.", ex:"[Fe(CO)₅]"},
    no: {name:"NO⁺", type:"π-akseptor", delta:36000, color:"bg-indigo-500", h:95, d:"Izoelektron CO bilan. Juda kuchli.", ex:"[Fe(CN)₅NO]²⁻"},
    nh3: {name:"NH₃", type:"σ-donor", delta:23000, color:"bg-blue-500", h:55, d:"O'rtacha maydon. Faqat σ-donor.", ex:"[Co(NH₃)₆]³⁺ LS"},
    h2o: {name:"H₂O", type:"σ-donor", delta:18500, color:"bg-cyan-500", h:40, d:"Kuchsiz σ-donor. O'rtacha maydon.", ex:"[Co(H₂O)₆]²⁺ HS"},
    cl: {name:"Cl⁻", type:"π-donor", delta:13000, color:"bg-yellow-500", h:25, d:"Kuchsiz maydon. HS. π-donor → t₂g yuqori.", ex:"[CoCl₄]²⁻ HS"},
    br: {name:"Br⁻", type:"π-donor", delta:7000, color:"bg-orange-500", h:18, d:"Juda kuchsiz maydon. Eng past Δ₀.", ex:"[CoBr₄]²⁻ HS"}
  }

  const d = ligands[ligand]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-amber-400">📊</span> Spektrokimyoviy qator — ligand kuchi va Δ₀
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(ligands).map(([k,v]) => (
          <button key={k} onClick={()=>setLigand(k)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${ligand===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={ligand===k ? {background:`${d.color?.replace("bg-","#")}33`, borderColor:`${d.color?.replace("bg-","#")}66`} : {}}>
            {v.name}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-1.5 h-24 mb-3">
        {Object.values(ligands).map((l,i) => (
          <div key={i} className="flex-1 flex flex-col items-center group cursor-pointer"
            onClick={()=>setLigand(Object.keys(ligands)[i])}>
            <div className={`w-full rounded-t-lg ${l.color} group-hover:scale-105 transition-transform ${ligand===Object.keys(ligands)[i]?"ring-2 ring-white":""}`}
              style={{height:`${l.h}%`, minHeight:"15px"}} />
            <div className={`text-[9px] font-bold mt-1 ${ligand===Object.keys(ligands)[i]?"text-white":"text-purple-400"}`}>{l.name}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-yellow-300 font-bold">{d.name} — {d.type}</p>
          <div className="flex justify-between"><span className="text-purple-400">Δ₀:</span><span className="text-cyan-300 font-mono">{d.delta.toLocaleString()} cm⁻¹</span></div>
          <p className="text-purple-200">{d.d}</p>
          <p className="text-green-300 font-mono">{d.ex}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          <p className="text-purple-400 font-bold">Δ₀ bo'yicha tartib:</p>
          <p className="text-purple-200">
            Br⁻ {'<'} Cl⁻ {'<'} F⁻ {'<'} H₂O {'<'} NH₃ {'<'} en {'<'} CN⁻ {'<'} CO {'<'} NO⁺
          </p>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 mt-1">
            <p className="text-yellow-400 font-bold">⚡ Spektrokimyoviy qator — ligandlarning Δ₀ ga ta'siri.</p>
            <p className="text-purple-200">π-donor (I⁻, Br⁻, Cl⁻) → t₂g↑ → Δ₀↓ | π-akseptor (CN⁻, CO) → t₂g↓ → Δ₀↑</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. 18-ELEKTRON QOIDASI — INTERAKTIV HISOBLAGICH
// ═══════════════════════════════════════════════════════════════════════════════
function ElektronHisoblagich() {
  const [selected, setSelected] = useState(0)

  const complexes = [
    {name:"[Ni(CO)₄]", metal:"Ni(0)", d:"3d⁸4s²4p⁰", me:10, ligands:"4×CO (2e⁻)", le:8, total:18, stable:true, geo:"Tetraedrik Td", note:"18 e⁻, tetraedrik. Ni(0) — d¹⁰."},
    {name:"[Fe(CO)₅]", metal:"Fe(0)", d:"3d⁶4s²4p⁰", me:8, ligands:"5×CO (2e⁻)", le:10, total:18, stable:true, geo:"Trig. bipir. D3h", note:"18 e⁻. 5 ta CO ligand."},
    {name:"[Co(NH₃)₆]³⁺", metal:"Co³⁺", d:"3d⁶ (LS)", me:6, ligands:"6×NH₃ (2e⁻)", le:12, total:18, stable:true, geo:"Oktaedrik Oh", note:"18 e⁻, d⁶ LS. Bardoshli."},
    {name:"[CoCl₄]²⁻", metal:"Co²⁺", d:"3d⁷ (HS)", me:7, ligands:"4×Cl⁻ (2e⁻)", le:8, total:15, stable:false, geo:"Tetraedrik Td", note:"15 e⁻ → 18 dan kam. HS."},
    {name:"[PtCl₄]²⁻", metal:"Pt²⁺", d:"5d⁸", me:8, ligands:"4×Cl⁻ (2e⁻)", le:8, total:16, stable:true, geo:"Kv. planar D4h", note:"16 e⁻ → kvadrat-planar d⁸."},
    {name:"Ferrosen Fe(C₅H₅)₂", metal:"Fe²⁺", d:"3d⁶", me:6, ligands:"2×Cp⁻ (6e⁻)", le:12, total:18, stable:true, geo:"Sandvich D5d", note:"18 e⁻. Cp⁻ = 6 e⁻ donori."},
    {name:"[Cr(CO)₆]", metal:"Cr(0)", d:"3d⁶", me:6, ligands:"6×CO (2e⁻)", le:12, total:18, stable:true, geo:"Oktaedrik Oh", note:"18 e⁻, d⁶. Bardoshli karbonil."},
    {name:"[Mn(CO)₅]⁺", metal:"Mn⁺", d:"3d⁵", me:6, ligands:"5×CO (2e⁻)", le:10, total:16, stable:false, geo:"Trig. bipir.", note:"16 e⁻ → reaksiyaga kirishadi."},
  ]

  const c = complexes[selected]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-rose-400">🧮</span> 18 elektron qoidasi — interaktiv hisoblagich
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {complexes.map((c,i) => (
          <button key={i} onClick={()=>setSelected(i)}
            className={`px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all ${selected===i?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
            {c.name.split("[")[1]?.split("]")[0] || c.name.substring(0,12)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4">
          <p className="text-yellow-300 font-bold text-sm mb-2">{c.name}</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-purple-400">Metall:</span>
              <span className="text-cyan-300 font-mono">{c.metal} ({c.d})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-400">Metall e⁻:</span>
              <span className="text-green-300 font-mono">{c.me} e⁻</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-400">Ligandlar:</span>
              <span className="text-cyan-300 font-mono">{c.ligands} = {c.le} e⁻</span>
            </div>
            <div className="flex justify-between items-center border-t border-purple-700/30 pt-2">
              <span className="text-purple-400 font-bold">Jami:</span>
              <span className={`text-lg font-bold font-mono ${c.total===18?"text-green-400":"text-orange-400"}`}>
                {c.me} + {c.le} = {c.total} e⁻
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-400">Holat:</span>
              <span className={c.stable?"text-green-400":"text-red-400"}>
                {c.stable ? "✅ Barqaror (18 e⁻)" : "❌ Barqaror emas"}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold">Geometriya:</p>
            <p className="text-yellow-300 font-mono">{c.geo}</p>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold">Tahlil:</p>
            <p className="text-purple-200">{c.note}</p>
          </div>
          {c.total === 16 && (
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-yellow-400 font-bold">⚡ 16 e⁻, kvadrat-planar geometriya — d⁸ metallar (Pt²⁺, Pd²⁺, Ni²⁺).</p>
            </div>
          )}
          {c.total === 15 && (
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-2 text-[10px]">
              <p className="text-red-400 font-bold">⚡ 15 e⁻ → radikal. Reaksiyaga kirishadi (substitusiya).</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs mt-3">
        <p className="text-purple-400 font-bold">18 elektron qoidasi (EAN — Effective Atomic Number):</p>
        <p className="text-yellow-300 font-mono text-center my-1">EAN = Z_metal − oksidlanish + 2×ligand soni = keyingi nobile gaz konfiguratsiyasi</p>
        <p className="text-purple-200">• 18 e⁻ = nₓd¹⁰ (n+1)s² (n+1)p⁶ → Kr (36) yoki Xe (54)</p>
        <p className="text-purple-200">• Istisnolar: 16 e⁻ (d⁸ — Pt²⁺, Pd²⁺, Ni²⁺), 12 e⁻ (d¹⁰ — [CuCl₄]²⁻)</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. SIMMETRIYA VA BOG'LANISH — ORBITAL QOPLANISH
// ═══════════════════════════════════════════════════════════════════════════════
function OrbitalQoplanish() {
  const [ov, setOv] = useState("sigma")

  const overlap = {
    sigma: {name:"σ-bog' (head-on)", d:"Orbitallar o'q bo'ylab qoplanadi. Eng kuchli bog'.", col:"#22c55e",
      desc:"s−s, s−p, p−p (o'q bo'ylab), d_z²−ligand (oktaedrik). Qoplanish integrali S katta.",
      misol:"M−L σ-bog' → barcha komplekslarda mavjud. σ* → antibog'lovchi.",
      note:"σ-bog'ning kuchi qoplanish darajasiga bog'liq. d_z² + p_z (ligand) → σ."},
    pi: {name:"π-bog' (side-on)", d:"Orbitallar yonma-yon qoplanadi. σ dan kuchsizroq.", col:"#3b82f6",
      desc:"d_xy, d_xz, d_yz (t₂g) + ligand π-orbitallari. d_xz−p_x yonma-yon qoplanish.",
      misol:"[Fe(CN)₆]⁴⁻: Fe²⁺ t₂g + CN⁻ π* → π-orqaga donorlik.",
      note:"π-bog' Δ₀ ni o'zgartiradi. π-akseptor → Δ₀↑, π-donor → Δ₀↓."},
    delta: {name:"δ-bog'", d:"4 lobli qoplanish. d−d orbitallar orasida.", col:"#a855f7",
      desc:"d_xy + d_xy yoki d_x²−y² + d_x²−y². To'rt lob qoplanishi.",
      misol:"M−M bog' (metall karbonillar), [Re₂Cl₈]²⁻ — to'rt bog'.",
      note:"δ-bog' faqat d−d qoplanishda. σ + 2π + δ = to'rt bog'."}
  }

  const d = overlap[ov]

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-green-400">🔬</span> Orbital qoplanish turlari — σ, π, δ
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        {Object.entries(overlap).map(([k,v]) => (
          <button key={k} onClick={()=>setOv(k)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${ov===k?"text-white border":"bg-purple-800/40 text-purple-300 border border-purple-700/50 hover:bg-purple-700/40"}`}
            style={ov===k ? {background:`${v.col}33`, borderColor:`${v.col}66`, color:v.col} : {}}>
            {k==="sigma"?"σ-bog'":k==="pi"?"π-bog'":"δ-bog'"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4 text-center"
          style={{borderLeft:`3px solid ${d.col}`}}>
          <p className="text-base font-bold mb-1" style={{color:d.col}}>{d.name}</p>
          <p className="text-purple-200 text-xs leading-relaxed">{d.d}</p>
        </div>
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-1">
          <p className="text-purple-400 font-bold">Batafsil:</p>
          <p className="text-purple-200">{d.desc}</p>
          <p className="text-purple-200"><strong className="text-yellow-300">Misol:</strong> {d.misol}</p>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 mt-1">
            <p className="text-yellow-400 font-bold">💡 </p>
            <p className="text-purple-200">{d.note}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-3">
        <table className="w-full text-[9px] sm:text-xs">
          <thead>
            <tr className="bg-purple-800/70">
              <th className="p-1.5 text-left text-amber-400">Xususiyat</th>
              <th className="p-1.5 text-center text-green-400">σ</th>
              <th className="p-1.5 text-center text-blue-400">π</th>
              <th className="p-1.5 text-center text-purple-400">δ</th>
            </tr>
          </thead>
          <tbody>
            {[
              {x:"Kuch", s:"Eng kuchli", p:"O'rtacha", d:"Eng kuchsiz"},
              {x:"Simmetriya", s:"A₁g / A₁", p:"T₂g / T₂", d:"?"},
              {x:"Qoplanish", s:"O'q bo'ylab", p:"Yonma-yon", d:"4 lobli"},
              {x:"d-orbital", s:"d_z²", p:"d_xy, d_xz, d_yz", d:"d_xy, d_x²−y²"},
              {x:"MO turi", s:"σ, σ*", p:"π, π*", d:"δ, δ*"},
              {x:"Δ₀ ga ta'sir", s:"—", p:"Kuchli", d:"—"},
            ].map((r,i)=>(
              <tr key={i} className={`border-t border-purple-800/30 ${i%2===0?"bg-purple-900/20":"bg-purple-950/20"} hover:bg-purple-800/30`}>
                <td className="p-1.5 font-bold text-yellow-300">{r.x}</td>
                <td className="p-1.5 text-center text-green-200">{r.s}</td>
                <td className="p-1.5 text-center text-blue-200">{r.p}</td>
                <td className="p-1.5 text-center text-purple-200">{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SINERGIK BOG'LANISH — MISONLAR BILAN
// ═══════════════════════════════════════════════════════════════════════════════
function SinergikBoglanish() {
  const [system, setSystem] = useState("co")

  return (
    <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-orange-400">🔄</span> Sinergik bog'lanish — σ-donor + π-akseptor
      </h3>

      <div className="flex gap-1.5 flex-wrap mb-4">
        <button onClick={()=>setSystem("co")}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${system==="co"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
          CO ligand
        </button>
        <button onClick={()=>setSystem("cn")}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${system==="cn"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
          CN⁻ ligand
        </button>
        <button onClick={()=>setSystem("pr3")}
          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold ${system==="pr3"?"bg-purple-600 text-white":"bg-purple-900/50 text-purple-300 hover:bg-purple-800"}`}>
          PR₃ ligand
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs space-y-2">
          {system === "co" && (
            <>
              <p className="text-yellow-300 font-bold text-sm">CO — uglerod monoksid</p>
              <p className="text-purple-200">σ-donor: C dagi yakka juft → metall (σ simmetriya)</p>
              <p className="text-purple-200">π-akseptor: Metall t₂g → CO π* (bo'sh orbital)</p>
              <p className="text-purple-200"><strong className="text-cyan-300">Sinergik effekt:</strong> σ-donor metallni boyitadi → metall π-orqaga donorlikni kuchaytiradi → M−C bog'i mustahkamlanadi, C≡O kuchsizlanadi.</p>
              <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
                <p className="text-yellow-300 font-mono text-center">ν(CO) erkin: 2143 cm⁻¹ → [Ni(CO)₄]: ~2060 cm⁻¹</p>
              </div>
            </>
          )}
          {system === "cn" && (
            <>
              <p className="text-yellow-300 font-bold text-sm">CN⁻ — sianid ioni</p>
              <p className="text-purple-200">σ-donor: C dagi yakka juft → metall (σ simmetriya)</p>
              <p className="text-purple-200">π-akseptor: Metall t₂g → CN⁻ π* (bo'sh orbital)</p>
              <p className="text-purple-200"><strong className="text-cyan-300">CO dan farqi:</strong> CN⁻ manfiy zaryadli → kuchli σ-donor. π* energiyasi CO dan yuqori → π-akseptorligi CO dan kuchsiz.</p>
              <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
                <p className="text-yellow-300 font-mono text-center">Δ₀: CN⁻ ~33000 cm⁻¹ | CO ~35000 cm⁻¹</p>
              </div>
            </>
          )}
          {system === "pr3" && (
            <>
              <p className="text-yellow-300 font-bold text-sm">PR₃ — fosfin ligandlar</p>
              <p className="text-purple-200">σ-donor: P dagi yakka juft → metall</p>
              <p className="text-purple-200">π-akseptor: Metall t₂g → P−R ning σ* (bo'sh MO)</p>
              <p className="text-purple-200"><strong className="text-cyan-300">R guruhining ta'siri:</strong> R = alkil (Me, Et) → kuchli σ-donor, kuchsiz π-akseptor. R = aril (Ph) → kuchsiz σ-donor, kuchli π-akseptor.</p>
              <div className="bg-purple-950/90 border border-purple-700/30 rounded p-1.5 mt-1">
                <p className="text-yellow-300 font-mono text-center">PMe₃: kuchli σ-donor | PCl₃: kuchsiz σ-donor</p>
              </div>
            </>
          )}
        </div>
        <div className="space-y-2">
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold">Sinergik bog'lanish sxemasi:</p>
            <div className="bg-purple-950/90 border border-purple-700/30 rounded p-2 text-center">
              <p className="text-yellow-300 font-mono text-sm">M ← :L (σ-donor)</p>
              <p className="text-cyan-300 font-mono text-sm">M → L* (π-akseptor)</p>
              <p className="text-green-300 font-mono text-sm mt-1">👇 Sinergiya 👇</p>
              <p className="text-purple-200 text-[10px]">σ-donor → M boyiydi → π-orqaga donorlik kuchayadi → M−L mustahkam, L−L' kuchsiz</p>
            </div>
          </div>
          <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3 text-xs">
            <p className="text-purple-400 font-bold">Spektral diagnostika:</p>
            <p className="text-purple-200">ν(CO) yoki ν(CN) chastotasi sinergik bog'lanish kuchini ko'rsatadi:</p>
            <p className="text-purple-200">• Past chastota → kuchli π-orqaga donorlik → kuchli M−L bog'</p>
            <p className="text-purple-200">• Yuqori chastota → kuchsiz π-orqaga donorlik → kuchsiz M−L bog'</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TEST — 10 SAVOL
// ═══════════════════════════════════════════════════════════════════════════════
function TestKimyoviy() {
  const questions = [
    { q:"Oktaedrik geometriya uchun qaysi gibridlanish kerak?", a:"d²sp³", opts:["sp³","dsp²","d²sp³","sp³d²"], hint:"6 ta bog' → 6 ta gibrid orbital." },
    { q:"MO nazariyasida bog' tartibi qanday hisoblanadi?", a:"(N_bog' − N_bo'sh)/2", opts:["N_bog' + N_bo'sh","(N_bog' − N_bo'sh)/2","N_bog' − N_bo'sh","N_bog' × N_bo'sh"], hint:"Bog'lovchi va bo'shashtiruvchi MO lar farqi." },
    { q:"Spektrokimyoviy qator bo'yicha eng kuchli maydonli ligand?", a:"NO⁺", opts:["I⁻","H₂O","NO⁺","Cl⁻"], hint:"Δ₀ ≈ 36000 cm⁻¹." },
    { q:"CO ligand qanday bog'lanish mexanizmiga ega?", a:"σ-donor + π-akseptor (sinergik)", opts:["Faqat σ-donor","Faqat π-akseptor","σ-donor + π-akseptor (sinergik)","Faqat ion bog'"], hint:"C dagi yakka juft + bo'sh π*." },
    { q:"[Ni(CO)₄] kompleksidagi elektronlar soni?", a:"18 e⁻", opts:["16 e⁻","18 e⁻","20 e⁻","15 e⁻"], hint:"Ni(0) = 10 + 4×2 = 18." },
    { q:"π-bog'lovchi MO qanday qoplanish orqali hosil bo'ladi?", a:"Yonma-yon (side-on) qoplanish", opts:["O'q bo'ylab (head-on)","Yonma-yon (side-on) qoplanish","4 lobli qoplanish","Hech qanday qoplanish"], hint:"π = yonma-yon." },
    { q:"VB nazariyasining eng katta kamchiligi?", a:"Spektr va magnetizmni tushuntira olmaydi", opts:["Geometriyani bashorat qilmaydi","Spektr va magnetizmni tushuntira olmaydi","Bog' tartibini hisoblamaydi","Gibridlanishni ishlatmaydi"], hint:"MO spektrni tushuntiradi, VB — yo'q." },
    { q:"Kvadrat-planar geometriyasi bo'lgan kompleksda nechta elektron bo'ladi?", a:"16 e⁻ (d⁸ metallar)", opts:["18 e⁻ (d⁶)","16 e⁻ (d⁸ metallar)","14 e⁻ (d¹⁰)","20 e⁻"], hint:"Pt²⁺, Pd²⁺, Ni²⁺." },
    { q:"Sinergik bog'lanishda σ-donorlik va π-akseptorlik bir-biriga qanday ta'sir qiladi?", a:"Bir-birini kuchaytiradi (sinergiya)", opts:["Bir-birini zaiflashtiradi","Bir-birini kuchaytiradi (sinergiya)","Hech qanday ta'sir yo'q","Faqat σ muhim"], hint:"σ donor M ni boyitadi → π orqaga donorlik kuchayadi." },
    { q:"δ-bog' faqat qanday elementlar orasida hosil bo'ladi?", a:"Metall−metall (M−M)", opts:["Metall−ligand (M−L)","Metall−metall (M−M)","Ligand−ligand (L−L)","Metall−vodorod (M−H)"], hint:"d−d orbitallar 4 lobli qoplanishi." },
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
          <p className="text-purple-300 text-xs mt-2">{sc >= 8 ? "Kimyoviy bog'lanishni mukammal o'zlashtirdingiz!" : sc >= 5 ? "Yaxshi, ammo takrorlash kerak." : "Qayta o'qib chiqing."}</p>
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
export default function KimyoviyBoglanish() {
  const [mounted, setMounted] = useState(false)
  const [progress, setProgress] = useState({})

  useEffect(() => {
    setMounted(true)
    setProgress(oqilganlar())
  }, [])

  const toggleProgress = (href) => {
    belginiAlmashtir(href)
    // Barcha bo'limlar o'qilsa, mavzuning o'zi ham belgilanadi —
    // shunda bosh sahifadagi progress o'zi o'sadi.
    setProgress(mavzuniYangila("/ilmiy/chuqurlashgan/kimyoviy-boglanish", BOLIMLAR.map(b => b.href)))
  }

  const stats = {
    total: BOLIMLAR.length,
    // Faqat shu mavzuning bo'limlari sanaladi — belgilar xaritasi
    // umumiy, ya'ni boshqa mavzudagi belgilar ham unda bo'ladi.
    completed: BOLIMLAR.filter(b => progress[b.href]).length,
    totalTime: BOLIMLAR.reduce((s, b) => s + parseInt(b.time), 0)
  }

  const levelColors = {
    boshlangich: { dot: "bg-green-500", text: "text-green-400", bg: "bg-green-600/20" },
    orta: { dot: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-600/20" },
    ilgor: { dot: "bg-red-500", text: "text-red-400", bg: "bg-red-600/20" }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-purple-400 mb-1 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400">Kimyoviy bog'lanish</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-blue-400 flex items-center gap-2">
            <span>🔗</span> Kimyoviy bog'lanish (VB + MO)
          </h1>
          <p className="text-[10px] sm:text-xs text-purple-500">Valent bog'lanish • MO nazariyasi • Gibridlanish • 18 e⁻ qoidasi • Ligand maydon</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-5 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h2 className="text-base sm:text-xl font-bold text-white mb-3">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-3">
                <strong className="text-yellow-400">Kimyoviy bog'lanish nazariyalari</strong> — kompleks birikmalarning 
                tuzilishini tushunish, spektrlarini tahlil qilish va barqarorligini bashorat qilish uchun 
                asosiy nazariy qurol. Bu bo'limda VB (valent bog'lanish) va MO (molekulyar orbital) 
                nazariyalarining <strong className="text-yellow-400">farqlari</strong>, gibridlanish turlari, 
                σ/π/δ bog'lanish mexanizmlari va 18 elektron qoidasi o'rganiladi.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-[10px]">{stats.total} ta bo'lim</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-[10px]">VB vs MO</span>
                <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-[10px]">18 e⁻ qoidasi</span>
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-[10px]">Sinergik bog'</span>
                <span className="bg-rose-600/20 text-rose-400 border border-rose-600/30 px-2 py-0.5 rounded-full text-[10px]">10 ta test</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-3 sm:p-4 text-xs space-y-1.5">
              <p className="text-purple-300"><span className="text-blue-400 font-bold">🎯 Maqsad:</span> VB va MO nazariyalarini, gibridlanish turlarini va bog'lanish mexanizmlarini o'zlashtirish.</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">⏱️ Vaqt:</span> ~3.5 soat</p>
              <p className="text-purple-300"><span className="text-blue-400 font-bold">📚 Manba:</span> Cotton — Chemical Applications of Group Theory; Shriver — Inorganic Chemistry</p>
              <div className="bg-purple-950/90 rounded p-2 mt-1 text-center border border-purple-700/30">
                <p className="text-blue-300 font-mono text-xs font-bold">Bog'lanish — molekulalarning yaratilish siri!</p>
              </div>
            </div>
          </div>
        </div>

        {/* STATISTIKA */}
        <div className={`grid grid-cols-3 gap-3 transition-all duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-300">{stats.total}</div>
            <div className="text-[10px] sm:text-xs text-purple-400 mt-1">📚 Bo'limlar</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-300">{stats.completed}</div>
            <div className="text-[10px] sm:text-xs text-emerald-400 mt-1">✅ O'qilgan</div>
          </div>
          <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-3 sm:p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">{Math.round(stats.totalTime / 60)} soat</div>
            <div className="text-[10px] sm:text-xs text-amber-400 mt-1">⏱️ Umumiy</div>
          </div>
        </div>

        {/* BO'LIMLAR */}
        <div className="space-y-3 sm:space-y-4">
          {BOLIMLAR.map((b, i) => (
            <div key={b.href}
              className={`group relative bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-700/40 rounded-xl sm:rounded-2xl transition-all duration-500 hover:bg-purple-800/50 hover:scale-[1.005] ${progress[b.href] ? "ring-1 ring-emerald-500/30" : ""}`}
              style={{ animation: mounted ? `fadeIn 0.5s ease-out ${i * 0.08}s both` : "none" }}>
              <Link href={b.href} className="block p-3 sm:p-5">
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-purple-800/60 border border-purple-600/40 items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-400">{b.num}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl flex-shrink-0 mt-0.5">{b.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors">{b.title}</h3>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border font-semibold whitespace-nowrap ${b.badgeColor}`}>{b.badge}</span>
                      <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border ${b.levelColor} whitespace-nowrap`}>{b.levelLabel}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-purple-300/80 mt-1 leading-relaxed">{b.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-[10px] text-purple-500 whitespace-nowrap">⏱️ {b.time}</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform text-lg">→</span>
                  </div>
                </div>
              </Link>
              <button onClick={(e) => { e.preventDefault(); toggleProgress(b.href) }}
                className={`absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all ${progress[b.href] ? "bg-emerald-500 border-emerald-400 text-white" : "border-purple-600/50 hover:border-purple-400 bg-purple-950/50"}`}
                title={progress[b.href] ? "O'qilgan" : "O'qildi"}>
                {progress[b.href] && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* INTERAKTIV KOMPONENTLAR */}
        <VBvsMO />
        <BoglanishTurlari />
        <SpektrokimyoviyQator />
        <ElektronHisoblagich />
        <OrbitalQoplanish />
        <SinergikBoglanish />

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6">
          <TestKimyoviy />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-4 sm:p-8">
          <h2 className="text-base sm:text-xl font-bold text-white mb-3">✅ Asosiy xulosalar</h2>
          <ol className="space-y-1 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">VB nazariyasi</strong> — gibridlanish asosida geometriyani tushuntiradi (sp→chiziqli, sp³→tetraedrik, d²sp³→oktaedrik)</li>
            <li><strong className="text-yellow-400">MO nazariyasi</strong> — LCAO asosida elektron tuzilish, spektr va magnetizmni tushuntiradi</li>
            <li><strong className="text-yellow-400">σ, π, δ bog'lanish</strong> — orbital qoplanish turlari. σ eng kuchli, δ eng kuchsiz</li>
            <li><strong className="text-yellow-400">Sinergik bog'lanish</strong> — σ-donor (M←L) va π-akseptor (M→L*) bir-birini kuchaytiradi</li>
            <li><strong className="text-yellow-400">Spektrokimyoviy qator:</strong> Br⁻ {'<'} Cl⁻ {'<'} H₂O {'<'} NH₃ {'<'} CN⁻ {'<'} CO {'<'} NO⁺</li>
            <li><strong className="text-yellow-400">18 elektron qoidasi:</strong> Barqaror komplekslar 18 e⁻ ga intiladi (nₓd¹⁰(n+1)s²(n+1)p⁶). 16 e⁻ → d⁸ kvadrat-planar</li>
            <li><strong className="text-yellow-400">Kvadrat-planar (d⁸)</strong> — 16 e⁻. Tetraedrik (d¹⁰) — 18 e⁻. Oktaedrik (d⁶) — 18 e⁻</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/simmetriya"
            className="px-3 sm:px-6 py-2 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm flex items-center gap-2">
            <span>←</span> Molekulalar simmetriyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan"
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20">
            Chuqurlashgan mavzular <span>→</span>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-3 sm:p-6 text-center">
          <p className="text-xs text-purple-300">📚 <strong className="text-purple-200">Manba:</strong> F.A. Cotton — Chemical Applications of Group Theory; J.E. Huheey — Inorganic Chemistry</p>
          <p className="text-[9px] text-purple-500 mt-1">JDA-Kimyo © {new Date().getFullYear()}</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}