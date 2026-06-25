"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// MLCT INTERAKTIV SPEKTR SLAYDERI
// ============================================================================
function MLCTSpektrSlayder() {
  const [complex, setComplex] = useState("rubpy")
  
  const complexes = {
    rubpy: {
      name: "[Ru(bpy)₃]²⁺ (Tris(bipiridin)ruteniy(II))",
      formula: "[Ru²⁺(bpy)₃]²⁺",
      geometry: "Oktaedrik (D₃ simmetriya)",
      metalConfig: "Ru²⁺ — d⁶ (LS, S=0, t₂g⁶)",
      ligandAcceptor: "bpy — kuchli π-akseptor, π* past energiyada",
      transition: "Ru(dπ, t₂g) → bpy(π*) — ¹MLCT",
      lambdaMax: "~450 nm (to'q sariq rang)",
      epsilon: "~15 000 M⁻¹sm⁻¹",
      emission: "~620 nm (qizil, fosforessensiya), Φ ≈ 0.04 (suvda), τ ≈ 1 μs",
      note: "Eng klassik MLCT kompleksi. Fotokimyoviy standart. ¹MLCT → ³MLCT ISC samaradorligi ~100%. ³MLCT — kuchli qaytaruvchi (E°* ≈ −0.8 V) va oksidlovchi (E°* ≈ +0.8 V).",
      color: "bg-orange-500",
      textColor: "text-orange-400",
      bgColor: "bg-orange-600/10 border-orange-500/30"
    },
    osbpy: {
      name: "[Os(bpy)₃]²⁺ (Tris(bipiridin)osmiy(II))",
      formula: "[Os²⁺(bpy)₃]²⁺",
      geometry: "Oktaedrik (D₃ simmetriya)",
      metalConfig: "Os²⁺ — d⁶ (LS, S=0, t₂g⁶)",
      ligandAcceptor: "bpy — kuchli π-akseptor",
      transition: "Os(dπ, t₂g) → bpy(π*) — ¹MLCT/³MLCT aralash",
      lambdaMax: "~480 nm (qizil-to'q sariq)",
      epsilon: "~12 000 M⁻¹sm⁻¹",
      emission: "~720 nm (yaqin IQ), Φ ≈ 0.005 (xona haroratida), τ ≈ 0.1 μs",
      note: "Os — Ru ga nisbatan kuchli SOC (ξ ≈ 3000 sm⁻¹ vs 1000 sm⁻¹). ¹MLCT va ³MLCT aralashadi — bevosita ³MLCT qo'zg'alishi mumkin. Umri qisqa, lekin NIR emissiya.",
      color: "bg-red-700",
      textColor: "text-red-400",
      bgColor: "bg-red-600/10 border-red-500/30"
    },
    cuphen: {
      name: "[Cu(phen)₂]⁺ (Bis(fenantrolin)mis(I))",
      formula: "[Cu⁺(phen)₂]⁺",
      geometry: "Buzilgan tetraedrik (D₂d)",
      metalConfig: "Cu⁺ — d¹⁰ (to'ldirilgan)",
      ligandAcceptor: "phen — kuchli π-akseptor",
      transition: "Cu(dπ) + phen(π) → phen(π*) — MLCT + IL aralash",
      lambdaMax: "~435 nm (sariq rang)",
      epsilon: "~7 000 M⁻¹sm⁻¹",
      emission: "~620 nm, τ ≈ 0.1-1 μs (strukturaga bog'liq)",
      note: "Arzon va ekologik toza alternativ (Ru, Os qimmat). Muammo: qo'zg'algan holatda tekislanish (flattening) — energiya yo'qotilishi. Lekin so'nggi ligand dizaynlari buni yengib o'tmoqda.",
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
      bgColor: "bg-yellow-600/10 border-yellow-500/30"
    },
    irppy: {
      name: "[Ir(ppy)₃] (Tris(fenilpiridin)iridiy(III))",
      formula: "[Ir³⁺(ppy)₃]",
      geometry: "Oktaedrik (mer/fac izomerlari)",
      metalConfig: "Ir³⁺ — d⁶ (LS, t₂g⁶)",
      ligandAcceptor: "ppy — siklometallangan, kuchli σ-donor + π-akseptor",
      transition: "Ir(dπ) + ppy(π) → ppy(π*) — ³MLCT/³LC aralash (TADF!)",
      lambdaMax: "~380 nm (yashil rang)",
      epsilon: "~5 000 M⁻¹sm⁻¹",
      emission: "~510 nm (yashil), Φ ≈ 0.4-1.0 (OLED da), τ ≈ 1-5 μs",
      note: "OLED emitter! Kuchli SOC (ξ ≈ 4000 sm⁻¹) → TADF. ³MLCT va ¹MLCT energiyalari yaqin → termal faollashgan kechikkan fluoressensiya. Ichki kvant chiqishi 100% gacha!",
      color: "bg-green-500",
      textColor: "text-green-400",
      bgColor: "bg-green-600/10 border-green-500/30"
    },
    reco: {
      name: "[Re(CO)₃(bpy)Cl] (Trikarbonilrheniy(I))",
      formula: "[Re⁺(CO)₃(bpy)Cl]",
      geometry: "Oktaedrik (fac izomer)",
      metalConfig: "Re⁺ — d⁶ (LS, t₂g⁶)",
      ligandAcceptor: "CO (kuchli π-akseptor) + bpy (π-akseptor)",
      transition: "Re(dπ) → bpy(π*) — ¹MLCT",
      lambdaMax: "~370 nm (UB/ko'rinadigan chegara)",
      epsilon: "~4 000 M⁻¹sm⁻¹",
      emission: "~600 nm, Φ ≈ 0.01-0.1, τ ≈ 0.1-1 μs",
      note: "CO₂ qaytarish fotokatalizatori! CO ligandlari Re ni elektron kambag'al qiladi → MLCT energiyasi yuqori. Qo'zg'algan holat — kuchli qaytaruvchi. Sun'iy fotosintezda muhim.",
      color: "bg-blue-400",
      textColor: "text-blue-400",
      bgColor: "bg-blue-600/10 border-blue-500/30"
    },
    febpy: {
      name: "[Fe(bpy)₃]²⁺ (Tris(bipiridin)temir(II))",
      formula: "[Fe²⁺(bpy)₃]²⁺",
      geometry: "Oktaedrik (D₃ simmetriya)",
      metalConfig: "Fe²⁺ — d⁶ (LS, t₂g⁶)",
      ligandAcceptor: "bpy — kuchli π-akseptor",
      transition: "Fe(dπ) → bpy(π*) — ¹MLCT",
      lambdaMax: "~520 nm (qizil rang)",
      epsilon: "~8 000 M⁻¹sm⁻¹",
      emission: "YO'Q! (ultratezkor ³MC ga o'tish, ~100 fs)",
      note: "Nega [Ru(bpy)₃]²⁺ lyuminessensiya qiladi-yu, [Fe(bpy)₃]²⁺ qilmaydi? Sababi: Fe da ligand maydon ajralishi (Δ₀) kichikroq → ³MC (metall-markazli) holat ³MLCT dan pastroq energiyada. Qo'zg'algan elektron ³MC ga o'tib, issiqlik sifatida energiyani yo'qotadi. Bu — 'energy gap law'.",
      color: "bg-red-500",
      textColor: "text-red-400",
      bgColor: "bg-red-600/10 border-red-500/30"
    }
  }

  const c = complexes[complex]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 MLCT komplekslar — interaktiv spektr ko'rish</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(complexes).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setComplex(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              complex === key 
                ? `${val.color} text-white` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.name.split(" ")[0].replace(/[\[\]]/g, '').split("(")[0]}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${c.bgColor}`}>
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded-full ${c.color}`}></div>
          <div>
            <h4 className={`font-bold text-lg ${c.textColor}`}>{c.name}</h4>
            <p className="text-purple-400 text-xs font-mono">{c.formula}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Struktura va elektron tuzilish</p>
              <ul className="text-purple-200 space-y-1">
                <li>• <strong>Geometriya:</strong> {c.geometry}</li>
                <li>• <strong>Metall:</strong> {c.metalConfig}</li>
                <li>• <strong>Ligand:</strong> {c.ligandAcceptor}</li>
                <li>• <strong>O'tish:</strong> <span className="text-blue-300">{c.transition}</span></li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Spektral ma'lumotlar</p>
              <ul className="text-purple-200 space-y-1">
                <li>• <strong>λ_max (yutilish):</strong> <span className={c.textColor}>{c.lambdaMax}</span></li>
                <li>• <strong>ε:</strong> {c.epsilon}</li>
                <li>• <strong>Emissiya:</strong> {c.emission}</li>
              </ul>
            </div>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold text-xs mb-2">💡 Tahlil va izoh</p>
            <p className="text-purple-200 text-xs leading-relaxed">{c.note}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MLCT ENERGETIK DIAGRAMMASI — INTERAKTIV
// ============================================================================
function MLCTEnergetik() {
  const [diagram, setDiagram] = useState("jablonski")
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 MLCT energetik diagrammasi</h3>
      
      <div className="flex gap-2 mb-3">
        <button onClick={() => setDiagram("jablonski")} className={`px-4 py-2 rounded-lg text-xs font-semibold ${diagram === "jablonski" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
          Jablonski (Ru)
        </button>
        <button onClick={() => setDiagram("energetika")} className={`px-4 py-2 rounded-lg text-xs font-semibold ${diagram === "energetika" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
          MO energetikasi
        </button>
        <button onClick={() => setDiagram("metallar")} className={`px-4 py-2 rounded-lg text-xs font-semibold ${diagram === "metallar" ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}>
          Metallar taqqoslash
        </button>
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {diagram === "jablonski" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-blue-400 font-bold">[Ru(bpy)₃]²⁺ — Jablonski diagrammasi</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded p-2 text-center">
                    <p className="text-blue-300">¹GS (t₂g⁶) — Asosiy singlet holat</p>
                  </div>
                  <p className="text-lime-400 text-center text-lg">↓ hν (450 nm)</p>
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded p-2 text-center">
                    <p className="text-blue-300">¹MLCT — Singlet MLCT</p>
                    <p className="text-purple-400">Ru³⁺(t₂g⁵)−bpy•⁻</p>
                  </div>
                  <p className="text-yellow-400 text-center">↓ ISC (~100%, ~30 fs)</p>
                  <div className="bg-red-600/20 border border-red-500/30 rounded p-2 text-center">
                    <p className="text-red-300">³MLCT — Triplet MLCT</p>
                    <p className="text-purple-400">τ ≈ 1 μs, Ru³⁺(t₂g⁵)−bpy•⁻</p>
                  </div>
                  <p className="text-orange-400 text-center">↓ Fosforessensiya (620 nm)</p>
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded p-2 text-center">
                    <p className="text-blue-300">¹GS — Qaytish</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4 text-xs">
                <p className="text-yellow-400 font-bold mb-2">Asosiy jarayonlar:</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• <strong>ISC (Intersistema kesishuvi):</strong> ¹MLCT → ³MLCT — ~100% samaradorlik, ~30 fs</li>
                  <li>• <strong>SOC (Spin-orbita bog'lanishi):</strong> Ru (ξ ≈ 1000 sm⁻¹) — ISC ni tezlashtiradi</li>
                  <li>• <strong>Fosforessensiya:</strong> ³MLCT → ¹GS — taqiqlangan, lekin SOC tufayli ruxsat etilgan</li>
                  <li>• <strong>Stoks siljishi:</strong> ~170 nm (450 → 620 nm) — katta</li>
                  <li>• <strong>Radiatsion bo'lmagan deaktivatsiya:</strong> ³MC (metall-markazli) holat orqali — asosiy yo'qotish</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {diagram === "energetika" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-blue-400 font-bold">MO energetikasi — MLCT qanday ishlaydi?</h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-300 mb-3">Molekulyar orbital energetik diagrammasi</p>
                <div className="space-y-1">
                  <p className="text-green-300">bpy π* — bo'sh (LUMO)</p>
                  <p className="text-blue-400 text-2xl">↕</p>
                  <p className="text-blue-400">hν (MLCT)</p>
                  <p className="text-blue-400 text-2xl">↕</p>
                  <p className="text-red-300">Ru t₂g (dπ) — to'ldirilgan (HOMO)</p>
                </div>
                <p className="text-purple-400 mt-3">HOMO−LUMO farqi = MLCT energiyasi</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold text-xs mb-2">Energiyaga ta'sir etuvchi omillar:</p>
                <ul className="text-xs text-purple-200 space-y-1">
                  <li>• <strong>Metall oksidlanish darajasi ↑</strong> → HOMO pastlashadi → MLCT energiyasi ↑</li>
                  <li>• <strong>Ligand π* energiyasi ↓</strong> → LUMO pastlashadi → MLCT energiyasi ↓</li>
                  <li>• <strong>Elektron tortuvchi o'rinbosarlar</strong> (bpy da −NO₂, −CN) → π* pastlashadi</li>
                  <li>• <strong>Elektron donor o'rinbosarlar</strong> (bpy da −CH₃, −OCH₃) → π* yuqorilashadi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {diagram === "metallar" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-blue-400 font-bold">Metallar taqqoslash — nima uchun Ru lyuminessensiya qiladi-yu, Fe qilmaydi?</h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-red-400 font-bold text-sm mb-2">[Fe(bpy)₃]²⁺</p>
                <p className="text-purple-300">Δ₀ kichik (~19 000 sm⁻¹)</p>
                <p className="text-purple-300">³MC {'<'} ³MLCT</p>
                <p className="text-red-400 mt-2">LYUMINESSENSIYA YO'Q!</p>
                <p className="text-purple-400 mt-1">³MC ga o'tish → energiya yo'qotilishi (~100 fs)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-orange-400 font-bold text-sm mb-2">[Ru(bpy)₃]²⁺</p>
                <p className="text-purple-300">Δ₀ katta (~22 000 sm⁻¹)</p>
                <p className="text-purple-300">³MC {'>'} ³MLCT</p>
                <p className="text-green-400 mt-2">LYUMINESSENSIYA BOR!</p>
                <p className="text-purple-400 mt-1">τ ≈ 1 μs, Φ ≈ 0.04 (suvda)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-blue-400 font-bold text-sm mb-2">[Os(bpy)₃]²⁺</p>
                <p className="text-purple-300">Δ₀ juda katta (~25 000 sm⁻¹)</p>
                <p className="text-purple-300">³MC {'>>'} ³MLCT</p>
                <p className="text-green-400 mt-2">LYUMINESSENSIYA BOR!</p>
                <p className="text-purple-400 mt-1">τ ≈ 0.1 μs, NIR emissiya</p>
              </div>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">💡 Asosiy qoida:</p>
              <p className="text-purple-200">
                <strong>³MLCT {'<'} ³MC bo'lishi kerak</strong> — lyuminessensiya bo'lishi uchun.
                Δ₀ 5d metallarda (Ru, Os, Ir) 3d metallarga (Fe) nisbatan <strong>kattaroq</strong> —
                ligand maydon kuchi davr bo'ylab oshadi (3d {'<'} 4d {'<'} 5d).
                Shuning uchun Ru va Os komplekslari lyuminessensiya qiladi, Fe komplekslari qilmaydi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MLCT TA'SIR ETUVCHI OMILLAR SLADYERI
// ============================================================================
function MLCTOmillar() {
  const [factor, setFactor] = useState("metal")
  
  const factors = {
    metal: {
      title: "Metall tabiati va oksidlanish darajasi",
      items: [
        { label: "Oksidlanish darajasi pasayganda", effect: "MLCT energiyasi KAMAYADI (qizilga siljish)", reason: "Metall d-orbitallari yuqorilashadi → HOMO yuqorilashadi → ΔE kamayadi" },
        { label: "3d → 4d → 5d", effect: "MLCT energiyasi OSHADI", reason: "d-orbitallar energiyasi pastlashadi (yadro zaryadi oshadi) → HOMO pastlashadi" },
        { label: "Spin-orbita bog'lanishi (SOC)", effect: "ISC tezlashadi, emissiya umri qisqaradi", reason: "Og'ir atom effekti: Fe (ξ≈400) {'<'} Ru (ξ≈1000) {'<'} Os (ξ≈3000) {'<'} Ir (ξ≈4000) sm⁻¹" },
        { label: "CFSE (Ligand maydon)", effect: "Δ₀ katta → ³MC yuqori → lyuminessensiya bor", reason: "5d {'>'} 4d {'>'} 3d — ligand maydon kuchi davr bo'ylab oshadi" },
      ]
    },
    ligand: {
      title: "Ligand π-akseptorligi va o'rinbosarlar",
      items: [
        { label: "π-akseptor kuchi oshganda", effect: "MLCT energiyasi KAMAYADI", reason: "Ligand π* orbitallari pastlashadi → LUMO pastlashadi → ΔE kamayadi" },
        { label: "Elektron tortuvchi o'rinbosarlar (−NO₂, −CN, −CF₃)", effect: "MLCT energiyasi KAMAYADI (qizilga siljish)", reason: "π* orbitallari barqarorlashadi → LUMO pastlashadi" },
        { label: "Elektron donor o'rinbosarlar (−CH₃, −OCH₃, −NH₂)", effect: "MLCT energiyasi OSHADI (ko'kka siljish)", reason: "π* orbitallari beqarorlashadi → LUMO yuqorilashadi" },
        { label: "Xelat effekti (bpy vs py)", effect: "MLCT energiyasi KAMAYADI", reason: "Xelatlanish → π* pastlashadi, intensivlik oshadi" },
      ]
    },
    solvent: {
      title: "Erituvchi qutbliligi — batroxrom solvatoxromizm",
      items: [
        { label: "Qutblilik oshganda (suv)", effect: "MLCT energiyasi OSHADI (gipsoxrom siljish)", reason: "Qo'zg'algan holat (Ru³⁺-bpy•⁻) dipol momenti katta — qutbli erituvchida barqarorlashadi. LEKIN asosiy holat (Ru²⁺-bpy) ham barqarorlashadi. Natija: raqobat." },
        { label: "Qutblilik pasayganda (geksan)", effect: "MLCT energiyasi KAMAYADI (batroxrom siljish)", reason: "Qo'zg'algan holat beqarorlashadi — asosiy holatga nisbatan ko'proq" },
        { label: "H₂O → CH₃CN → CH₂Cl₂", effect: "λ_max: 450 → 460 → 470 nm", reason: "[Ru(bpy)₃]²⁺ misolida — qutblilik pasayganda batroxrom siljish" },
        { label: "Diagnostik ahamiyati", effect: "MLCT ni LMCT dan ajratish", reason: "LMCT — gipsoxrom (qutblilik oshsa ko'kka), MLCT — batroxrom (qutblilik pasaysa qizilga)" },
      ]
    }
  }

  const f = factors[factor]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎛️ MLCT energiyasiga ta'sir etuvchi omillar</h3>
      
      <div className="flex gap-2 mb-3">
        {Object.entries(factors).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFactor(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold ${
              factor === key ? "bg-blue-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {key === "metal" ? "🔧 Metall" : key === "ligand" ? "🧬 Ligand" : "🧪 Erituvchi"}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <h4 className="text-blue-400 font-bold text-sm mb-3">{f.title}</h4>
        <div className="space-y-2">
          {f.items.map((item, i) => (
            <div key={i} className="bg-purple-900/50 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <p className="text-purple-200 text-xs font-bold">{item.label}</p>
                <p className="text-blue-400 text-xs text-right ml-4">{item.effect}</p>
              </div>
              <p className="text-purple-400 text-xs mt-1">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function MLCT() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-purple-400 hover:text-purple-300">Zaryad ko'chishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">MLCT</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔵 MLCT — Metall → Ligand zaryad ko'chishi</h1>
          <p className="text-purple-400 text-sm">π-akseptor ligandlar • Past oksidlanish darajasi • Fotofizika • Fotokataliz</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 MLCT — elektron metalldan ligandga ko'chishi</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">MLCT (Metal-to-Ligand Charge Transfer)</strong> — 
              koordinatsion birikmalarda elektronning <strong>metall d-orbitallaridan</strong> 
              (asosan to'ldirilgan t₂g) <strong>ligandning bo'sh π* orbitallariga</strong> ko'chishi.
              Bu o'tish <strong className="text-yellow-400">fotokimyo va fotofizikaning asosi</strong> — 
              MLCT qo'zg'algan holatlar yorug'lik energiyasini kimyoviy energiyaga aylantiradi.
              MLCT <strong>past oksidlanish darajasidagi metallar</strong> (Ru²⁺, Os²⁺, Re⁺, Cu⁺, Ir³⁺) 
              va <strong>kuchli π-akseptor ligandlar</strong> (bpy, phen, CO, CN⁻, aren) bilan kuzatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">MLCT shartlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Metall <strong>past oksidlanish darajasida</strong> (d⁶, d⁸, d¹⁰ — to'ldirilgan yoki ko'p elektronli)</li>
                <li>• Ligand <strong>kuchli π-akseptor</strong> (bpy, phen, CO, CN⁻, aren, olefin)</li>
                <li>• Ligand <strong>bo'sh π* orbitallari</strong> past energiyada</li>
                <li>• Metall d-orbitallari <strong>to'ldirilgan yoki yuqori energiyada</strong></li>
                <li>• <strong>Og'ir metallar</strong> (4d, 5d) — kuchli SOC → samarali ISC → fosforessensiya</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">MLCT energetikasiga ta'sir etuvchi omillar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Metall oksidlanish darajasi ↑</strong> → MLCT energiyasi ↑ (HOMO pastlashadi)</li>
                <li>• <strong>Ligand π* energiyasi ↓</strong> → MLCT energiyasi ↓ (LUMO pastlashadi)</li>
                <li>• <strong>Erituvchi qutbliligi ↓</strong> → batroxrom siljish (qizilga)</li>
                <li>• <strong>Elektron tortuvchi o'rinbosarlar</strong> → MLCT energiyasi ↓</li>
                <li>• <strong>Og'ir metall (5d {'>'} 4d {'>'} 3d):</strong> SOC kuchli → ¹/³MLCT aralashadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MO NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Molekulyar orbital nazariyasi va MLCT</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-yellow-400">MO nazariyasi</strong> bo'yicha MLCT — 
              metallning to'ldirilgan <strong>dπ orbitallaridan (t₂g)</strong> ligandning 
              <strong> π* orbitallariga</strong> elektron ko'chishi. HOMO — asosan metall xarakteriga ega,
              LUMO — ligand xarakteriga ega. MLCT energiyasi HOMO−LUMO farqi bilan belgilanadi.
              <strong> Og'ir metallarda</strong> (Ru, Os, Ir) spin-orbita bog'lanishi (SOC) kuchli bo'lib,
              singlet va triplet holatlar aralashadi — bu <strong>ISC ni tezlashtiradi</strong> va 
              <strong> fosforessensiyani ruxsat etadi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-blue-400 font-bold text-sm mb-2">HOMO — Metall dπ</p>
              <p className="text-purple-300">To'ldirilgan t₂g orbitallari</p>
              <p className="text-purple-400 mt-2">Metall xarakteri: ~80-90%</p>
              <p className="text-purple-400">Ru²⁺: t₂g⁶ (d⁶, LS)</p>
              <p className="text-purple-400">Ir³⁺: t₂g⁶ (d⁶, LS)</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-bold text-sm mb-2">MLCT O'TISH</p>
              <p className="text-purple-300">hν = E(LUMO) − E(HOMO)</p>
              <p className="text-purple-400 mt-2">Ruxsat etilgan</p>
              <p className="text-purple-400">ε ≈ 10³−10⁴ M⁻¹sm⁻¹</p>
              <p className="text-purple-400">λ: 350−600 nm</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-blue-400 font-bold text-sm mb-2">LUMO — Ligand π*</p>
              <p className="text-purple-300">Bo'sh π* orbitallari</p>
              <p className="text-purple-400 mt-2">Ligand xarakteri: ~80-90%</p>
              <p className="text-purple-400">bpy π*: ~−1.5 eV</p>
              <p className="text-purple-400">phen π*: ~−1.6 eV</p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTSpektrSlayder />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTEnergetik />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MLCTOmillar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>MLCT — <strong className="text-blue-400">metall dπ (t₂g) dan ligand π* ga</strong> elektron ko'chishi, Laporte ruxsat etilgan</li>
            <li><strong className="text-blue-400">Past oksidlanish darajasi + kuchli π-akseptor ligand</strong> — MLCT uchun zarur shart</li>
            <li>Og'ir metallar (Ru, Os, Ir) — <strong className="text-blue-400">kuchli SOC → samarali ISC → fosforessensiya</strong></li>
            <li>Lyuminessensiya sharti: <strong className="text-blue-400">³MLCT {'<'} ³MC</strong> — Δ₀ katta bo'lishi kerak (4d, 5d {'>'} 3d)</li>
            <li>MLCT qo'zg'algan holatlar — <strong className="text-blue-400">fotokataliz, OLED, DSSC, sensorlar</strong> uchun asos</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← LMCT</Link>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">IVCT →</Link>
        </div>

      </section>
    </main>
  )
}