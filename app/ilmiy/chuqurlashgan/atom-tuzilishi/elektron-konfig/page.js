"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV KONFIGURATSIYA SLAYDERI
// ============================================================================
function KonfiguratsiyaSlayder() {
  const [dn, setDn] = useState(4)
  const [spin, setSpin] = useState("HS")
  
  const configs = {
    1: { hs: { t2g: "↑", eg: "—", unpaired: 1, example: "Ti³⁺ [Ti(H₂O)₆]³⁺", note: "Faqat bitta konfiguratsiya. t₂g¹. Binafsha rang.", color: "text-purple-400" } },
    2: { hs: { t2g: "↑ ↑", eg: "—", unpaired: 2, example: "V³⁺ [V(H₂O)₆]³⁺", note: "Xund qoidasi: parallel spinli. t₂g².", color: "text-green-400" } },
    3: { hs: { t2g: "↑ ↑ ↑", eg: "—", unpaired: 3, example: "Cr³⁺ [Cr(H₂O)₆]³⁺", note: "t₂g yarim to'lgan — barqaror. Yashil rang.", color: "text-blue-400" } },
    4: { 
      hs: { t2g: "↑ ↑ ↑", eg: "↑", unpaired: 4, example: "Cr²⁺ [Cr(H₂O)₆]²⁺", note: "Δ₀ kichik — 4-e⁻ eg ga chiqadi. Kuchsiz maydon.", color: "text-yellow-400" },
      ls: { t2g: "↑↓ ↑ ↑", eg: "—", unpaired: 2, example: "Cr²⁺ [Cr(CN)₆]⁴⁻", note: "Δ₀ katta — elektronlar juftlashadi. Kuchli maydon.", color: "text-green-400" }
    },
    5: { 
      hs: { t2g: "↑ ↑ ↑", eg: "↑ ↑", unpaired: 5, example: "Fe³⁺ [Fe(H₂O)₆]³⁺, Mn²⁺ [Mn(H₂O)₆]²⁺", note: "Maksimal toq elektron (5). Eng yuqori spinli. Rangsiz yoki och.", color: "text-yellow-400" },
      ls: { t2g: "↑↓ ↑↓ ↑", eg: "—", unpaired: 1, example: "Fe³⁺ [Fe(CN)₆]³⁻", note: "Kuchli maydon. Faqat 1 ta toq e⁻. Qizil rang (LMCT).", color: "text-red-400" }
    },
    6: { 
      hs: { t2g: "↑↓ ↑ ↑", eg: "↑ ↑", unpaired: 4, example: "Fe²⁺ [Fe(H₂O)₆]²⁺", note: "Paramagnit (μ ≈ 4.9 μB). Och yashil rang. Kuchsiz maydon.", color: "text-yellow-400" },
      ls: { t2g: "↑↓ ↑↓ ↑↓", eg: "—", unpaired: 0, example: "Fe²⁺ [Fe(CN)₆]⁴⁻", note: "DIAMAGNIT! t₂g⁶. Ferrosianid — sariq rang. d⁶ LS — eng barqaror.", color: "text-green-400" }
    },
    7: { 
      hs: { t2g: "↑↓ ↑↓ ↑", eg: "↑ ↑", unpaired: 3, example: "Co²⁺ [Co(H₂O)₆]²⁺", note: "Pushti rang. Kuchsiz maydon. t₂g⁵ eg².", color: "text-yellow-400" },
      ls: { t2g: "↑↓ ↑↓ ↑↓", eg: "↑", unpaired: 1, example: "Co²⁺ [Co(CN)₆]⁴⁻", note: "Kuchli maydon. t₂g⁶ eg¹. Jahn-Teller faol.", color: "text-red-400" }
    },
    8: { hs: { t2g: "↑↓ ↑↓ ↑↓", eg: "↑ ↑", unpaired: 2, example: "Ni²⁺ [Ni(H₂O)₆]²⁺", note: "Faqat bitta konfiguratsiya. Yashil rang.", color: "text-blue-400" } },
    9: { hs: { t2g: "↑↓ ↑↓ ↑↓", eg: "↑↓ ↑", unpaired: 1, example: "Cu²⁺ [Cu(H₂O)₆]²⁺", note: "Jahn-Teller effekti! Cho'zilgan oktaedr. Moviy rang.", color: "text-cyan-400" } },
    10: { hs: { t2g: "↑↓ ↑↓ ↑↓", eg: "↑↓ ↑↓", unpaired: 0, example: "Zn²⁺ [Zn(H₂O)₆]²⁺", note: "To'liq to'lgan — diamagnit. Rangsiz. d¹⁰.", color: "text-gray-400" } },
  }

  const config = configs[dn]
  const current = config[spin === "LS" && config.ls ? "ls" : "hs"]
  const hasLS = config.ls !== undefined
  const showLS = spin === "LS" && hasLS

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎚️ d-elektron konfiguratsiyalar — interaktiv slayder</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-purple-400">d¹</span>
          <input 
            type="range" 
            min="1" max="10" 
            value={dn} 
            onChange={(e) => { setDn(+e.target.value); setSpin("HS") }}
            className="flex-1 h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-gray-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-purple-400">d¹⁰</span>
        </div>

        {hasLS && (
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSpin("HS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold ${!showLS ? "bg-yellow-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}
            >
              Yuqori spin (HS)
            </button>
            <button
              onClick={() => setSpin("LS")}
              className={`px-4 py-2 rounded-lg text-xs font-bold ${showLS ? "bg-green-600/80 text-white" : "bg-purple-800/40 text-purple-300"}`}
            >
              Quyi spin (LS)
            </button>
          </div>
        )}

        <div className={`rounded-xl p-5 border ${showLS ? "bg-green-600/10 border-green-500/30" : "bg-yellow-600/10 border-yellow-500/30"}`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`font-bold text-lg ${current.color}`}>d{dn} — {showLS ? "Quyi spinli" : "Yuqori spinli"}</h4>
            <span className="text-xs bg-purple-900/50 px-3 py-1 rounded-full text-purple-300">
              {current.unpaired} ta toq e⁻
            </span>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center mb-4">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold text-sm mb-2">e_g (+0.6Δ₀)</p>
              <div className="flex justify-center gap-2 text-2xl font-mono">
                {current.eg === "—" ? (
                  <span className="text-gray-500">—</span>
                ) : (
                  current.eg.split(" ").map((s, i) => (
                    <span key={i} className={s.includes("↓") ? "text-red-400" : "text-red-300"}>{s}</span>
                  ))
                )}
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-green-400 font-bold text-sm mb-2">t₂g (−0.4Δ₀)</p>
              <div className="flex justify-center gap-2 text-2xl font-mono">
                {current.t2g === "—" ? (
                  <span className="text-gray-500">—</span>
                ) : (
                  current.t2g.split(" ").map((s, i) => (
                    <span key={i} className={s.includes("↓") ? "text-green-400" : "text-green-300"}>{s}</span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-purple-900/50 rounded-lg p-4 text-xs">
            <p className="text-yellow-400 font-bold mb-1">Misol:</p>
            <p className="text-purple-200">{current.example}</p>
            <p className="text-purple-400 mt-1">{current.note}</p>
          </div>

          {/* Magnit moment */}
          <div className="bg-purple-900/50 rounded-lg p-3 mt-3 text-center text-xs">
            <p className="text-purple-400">
              <strong>Spin-formula:</strong> μ_s = √(n(n+2)) μB = <strong className="text-yellow-400">{current.unpaired > 0 ? Math.sqrt(current.unpaired * (current.unpaired + 2)).toFixed(2) : "0"} μB</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// JUFTLASHISH ENERGIYASI VS Δ₀ INTERAKTIV
// ============================================================================
function JuftlanishEnergiyasi() {
  const [showComparison, setShowComparison] = useState(false)
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Juftlashish energiyasi (P) vs Δ₀</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Spin holati</strong> Δ₀ va P nisbatiga bog'liq.
          P — ikkita elektronni bir orbitalga juftlash uchun zarur energiya.
          Elektronlararo itarilish tufayli juftlashish energiya talab qiladi.
        </p>

        <button
          onClick={() => setShowComparison(!showComparison)}
          className="px-4 py-2 bg-purple-600/80 rounded-lg text-white text-xs font-semibold mb-4"
        >
          {showComparison ? "Yashirish" : "d⁴−d⁷ barcha konfiguratsiyalarni ko'rish"}
        </button>

        {showComparison && (
          <div className="space-y-3 text-xs">
            {[
              { dn: "d⁴", hsConfig: "t₂g³ eg¹", lsConfig: "t₂g⁴ eg⁰", hsExample: "Cr²⁺ (H₂O)", lsExample: "Cr²⁺ (CN⁻)", hsSpin: 4, lsSpin: 2 },
              { dn: "d⁵", hsConfig: "t₂g³ eg²", lsConfig: "t₂g⁵ eg⁰", hsExample: "Fe³⁺, Mn²⁺ (H₂O)", lsExample: "Fe³⁺ (CN⁻)", hsSpin: 5, lsSpin: 1 },
              { dn: "d⁶", hsConfig: "t₂g⁴ eg²", lsConfig: "t₂g⁶ eg⁰", hsExample: "Fe²⁺ (H₂O)", lsExample: "Fe²⁺ (CN⁻)", hsSpin: 4, lsSpin: 0 },
              { dn: "d⁷", hsConfig: "t₂g⁵ eg²", lsConfig: "t₂g⁶ eg¹", hsExample: "Co²⁺ (H₂O)", lsExample: "Co²⁺ (CN⁻)", hsSpin: 3, lsSpin: 1 },
            ].map((row, i) => (
              <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold">{row.dn}</p>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
                    <p className="text-yellow-400 font-bold">HS: {row.hsConfig}</p>
                    <p className="text-purple-300">{row.hsExample}</p>
                    <p className="text-purple-400">{row.hsSpin} ta toq e⁻</p>
                  </div>
                  <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
                    <p className="text-green-400 font-bold">LS: {row.lsConfig}</p>
                    <p className="text-purple-300">{row.lsExample}</p>
                    <p className="text-purple-400">{row.lsSpin} ta toq e⁻</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// MAGNIT MOMENT KALKULYATORI
// ============================================================================
function MagnitMoment() {
  const [unpaired, setUnpaired] = useState(4)
  
  const muSpin = Math.sqrt(unpaired * (unpaired + 2))
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 Magnit moment kalkulyatori</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-purple-400">Toq e⁻ soni:</span>
              <input 
                type="range" min="0" max="5" value={unpaired} onChange={(e) => setUnpaired(+e.target.value)}
                className="flex-1 h-2 bg-gradient-to-r from-gray-500 via-yellow-500 to-red-500 rounded-lg cursor-pointer"
              />
              <span className="text-yellow-400 font-bold text-lg">{unpaired}</span>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-purple-400 text-xs mb-1">μ_s = √(n(n+2)) μB</p>
              <p className="text-yellow-400 text-3xl font-bold">{muSpin.toFixed(2)} <span className="text-sm">μB</span></p>
            </div>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4 text-xs">
            <p className="text-yellow-400 font-bold mb-2">Ma'lumot:</p>
            <ul className="text-purple-200 space-y-1">
              {[
                { n: 0, mu: "0", example: "d⁶ LS, d¹⁰ — diamagnit" },
                { n: 1, mu: "1.73", example: "d⁵ LS, d⁹ — Cu²⁺ komplekslari" },
                { n: 2, mu: "2.83", example: "d⁴ LS, d⁸ — Ni²⁺ komplekslari" },
                { n: 3, mu: "3.87", example: "d³, d⁷ HS — Cr³⁺, Co²⁺ (HS)" },
                { n: 4, mu: "4.90", example: "d⁴ HS, d⁶ HS — Cr²⁺, Fe²⁺ (HS)" },
                { n: 5, mu: "5.92", example: "d⁵ HS — Fe³⁺, Mn²⁺ (HS)" },
              ].map((row, i) => (
                <li key={i} className={unpaired === row.n ? "text-yellow-400 font-bold" : ""}>
                  n={row.n}: μ = {row.mu} μB — {row.example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function ElektronKonfiguratsiyalar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300">Atom tuzilishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-blue-400">d-elektron konfiguratsiyalar</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 d-elektron konfiguratsiyalar</h1>
          <p className="text-purple-400 text-sm">d¹ dan d¹⁰ gacha • Xund qoidasi • Yuqori va quyi spin • Pauli prinsipi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Elektronlarning orbitallarga joylashish qoidalari</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">1. Pauli prinsipi</h3>
              <p className="text-purple-200 text-sm">Bir atomda <strong>4 ta kvant soni bir xil</strong> bo'lgan ikkita elektron bo'lishi mumkin emas. Har bir orbitalda ko'pi bilan <strong>2 ta elektron</strong> (↑↓) bo'ladi.</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">2. Xund qoidasi</h3>
              <p className="text-purple-200 text-sm">Elektronlar bir xil energiyali orbitallarga avval <strong>bir xil spin bilan, juftlashmagan holda</strong> joylashadi. Juftlashish faqat barcha orbitallar yarim to'lgandan keyin boshlanadi.</p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">3. Energiya minimumi prinsipi</h3>
              <p className="text-purple-200 text-sm">Elektronlar avval <strong>eng past energiyali</strong> orbitallarni to'ldiradi. Oktaedrik maydonda: avval t₂g, keyin e_g.</p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KonfiguratsiyaSlayder />
        </div>

        {/* JUFTLASHISH ENERGIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <JuftlanishEnergiyasi />
        </div>

        {/* MAGNIT MOMENT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <MagnitMoment />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Elektronlar <strong className="text-yellow-400">Pauli, Xund va energiya minimumi</strong> qoidalari asosida joylashadi</li>
            <li><strong>Yuqori spin (HS):</strong> Δ₀ {'<'} P — ko'p toq e⁻, paramagnit</li>
            <li><strong>Quyi spin (LS):</strong> Δ₀ {'>'} P — kam toq e⁻, diamagnit</li>
            <li>d⁴−d⁷ konfiguratsiyalarda <strong>har ikkala holat ham</strong> mavjud bo'lishi mumkin</li>
            <li>Magnit moment: <strong>μ_s = √(n(n+2)) μB</strong> — faqat spin hissasi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← d-orbital energiyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/metallar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Kompleks metallar →</Link>
        </div>

      </section>
    </main>
  )
}