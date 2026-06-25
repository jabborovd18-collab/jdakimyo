"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

export default function CDBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")

  const birikmalar = [
    // ═══════════════════════════════════════════════════════════
    // A. KLASSIK TRIS-XELAT KOMPLEKSLAR (Δ/Λ) — 6 ta
    // ═══════════════════════════════════════════════════════════
    {
      id: "co-en3",
      formula: "[Co(en)₃]³⁺",
      iupac: "tris(etilendiamin)kobalt(III) ioni",
      tarixiy: "Verner klassikasi",
      metal: "Co³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "470",
      delta_epsilon: "±2.0",
      spectrum_type: "Cotton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "en (axiral)",
      izoh: "CD spektroskopiyasining eng klassik namunasi. Δ-izomer birinchi d-d o'tishda musbat Cotton effekti beradi.",
      href: "/ilmiy/tahlil/cd/birikmalar/co-en3",
      rang: "blue"
    },
    {
      id: "co-ox3",
      formula: "[Co(ox)₃]³⁻",
      iupac: "tris(oksalato)kobaltat(III) ioni",
      tarixiy: "",
      metal: "Co³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "560",
      delta_epsilon: "±1.5",
      spectrum_type: "Cotton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "ox²⁻ (axiral)",
      izoh: "Anion tris-xelat kompleks. Okzalato ligand bidentat, 5 a'zoli xelat halqasi.",
      href: "/ilmiy/tahlil/cd/birikmalar/co-ox3",
      rang: "indigo"
    },
    {
      id: "cr-acac3",
      formula: "[Cr(acac)₃]",
      iupac: "tris(atsetilasetonato)xrom(III)",
      tarixiy: "",
      metal: "Cr³⁺",
      config: "d³",
      spin: "S=3/2",
      magnit: "Paramagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "580",
      delta_epsilon: "±0.8",
      spectrum_type: "Cotton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "acac⁻ (axiral)",
      izoh: "Neytral tris-xelat kompleks. d³ konfiguratsiya — ⁴A₂g ground state. Paramagnit bo'lsa ham CD beradi.",
      href: "/ilmiy/tahlil/cd/birikmalar/cr-acac3",
      rang: "emerald"
    },
    {
      id: "fe-phen3",
      formula: "[Fe(phen)₃]²⁺",
      iupac: "tris(1,10-fenantrolin)temir(II) ioni",
      tarixiy: "",
      metal: "Fe²⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "510",
      delta_epsilon: "±3.5",
      spectrum_type: "Cotton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "phen (axiral)",
      izoh: "Kuchli CD signal — fenantrolin katta π-sistema. MLCT o'tishlar ham CD da ko'rinadi.",
      href: "/ilmiy/tahlil/cd/birikmalar/fe-phen3",
      rang: "red"
    },
    {
      id: "ru-bpy3",
      formula: "[Ru(bpy)₃]²⁺",
      iupac: "tris(2,2'-bipiridin)ruteniy(II) ioni",
      tarixiy: "",
      metal: "Ru²⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "452",
      delta_epsilon: "±5.0",
      spectrum_type: "Eksiton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "bpy (axiral)",
      izoh: "Fotofizik xususiyatlari bilan mashhur. Kuchli eksiton coupling — bisignate Cotton effekti. MLCT o'tishlar.",
      href: "/ilmiy/tahlil/cd/birikmalar/ru-bpy3",
      rang: "amber"
    },
    {
      id: "rh-en3",
      formula: "[Rh(en)₃]³⁺",
      iupac: "tris(etilendiamin)rodiy(III) ioni",
      tarixiy: "",
      metal: "Rh³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Δ → +, Λ → −",
      lambda_max: "345",
      delta_epsilon: "±4.0",
      spectrum_type: "Cotton",
      chiral_type: "Markaz (Δ/Λ)",
      ligand: "en (axiral)",
      izoh: "4d metall — kuchli spin-orbital coupling. Co(III) analogiga qaraganda intensivroq CD signallar.",
      href: "/ilmiy/tahlil/cd/birikmalar/rh-en3",
      rang: "cyan"
    },

    // ═══════════════════════════════════════════════════════════
    // B. XIRAL LIGANDLAR BILAN — 3 ta
    // ═══════════════════════════════════════════════════════════
    {
      id: "co-r-pn3",
      formula: "[Co(R-pn)₃]³⁺",
      iupac: "tris((R)-propilendiamin)kobalt(III) ioni",
      tarixiy: "",
      metal: "Co³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Murakkab",
      lambda_max: "470",
      delta_epsilon: "±2.5",
      spectrum_type: "Cotton",
      chiral_type: "Ligand (R) + Markaz",
      ligand: "R-pn (xiral)",
      izoh: "Xiral ligand (R-konfiguratsiya) — metall markazidagi Δ/Λ bilan birgalikda murakkab CD spektri. Diastereomerlar.",
      href: "/ilmiy/tahlil/cd/birikmalar/co-r-pn3",
      rang: "violet"
    },
    {
      id: "co-s-pn3",
      formula: "[Co(S-pn)₃]³⁺",
      iupac: "tris((S)-propilendiamin)kobalt(III) ioni",
      tarixiy: "",
      metal: "Co³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Δ yoki Λ",
      cotton_sign: "Murakkab",
      lambda_max: "470",
      delta_epsilon: "±2.5",
      spectrum_type: "Cotton",
      chiral_type: "Ligand (S) + Markaz",
      ligand: "S-pn (xiral)",
      izoh: "R-pn ning enantiomeri. CD spektri R-pn kompleksining ko'zgudagi aksi (teskari belgi).",
      href: "/ilmiy/tahlil/cd/birikmalar/co-s-pn3",
      rang: "fuchsia"
    },
    {
      id: "co-dchxn3",
      formula: "[Co(dchxn)₃]³⁺",
      iupac: "tris((1R,2R)-diaminosiklogeksan)kobalt(III) ioni",
      tarixiy: "",
      metal: "Co³⁺",
      config: "d⁶ (LS)",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "Λ (afzal)",
      cotton_sign: "Kuchli manfiy",
      lambda_max: "470",
      delta_epsilon: "−4.5",
      spectrum_type: "Cotton",
      chiral_type: "Ligand (R,R) + Markaz",
      ligand: "(R,R)-dchxn (xiral halqa)",
      izoh: "Halqali xiral ligand — Λ-konfiguratsiyani afzal ko'radi. Kuchli CD signal, stereoselektiv sintez.",
      href: "/ilmiy/tahlil/cd/birikmalar/co-dchxn3",
      rang: "pink"
    },

    // ═══════════════════════════════════════════════════════════
    // C. BIOLOGIK KOMPLEKSLAR — 2 ta
    // ═══════════════════════════════════════════════════════════
    {
      id: "gemoglobin",
      formula: "Gemoglobin",
      iupac: "temir-saqliydigan metalloprotein",
      tarixiy: "Qondagi oqsil",
      metal: "Fe²⁺/Fe³⁺",
      config: "d⁶/d⁵",
      spin: "HS/LS",
      magnit: "Paramagnit",
      helicity: "—",
      cotton_sign: "Musbat (222 nm)",
      lambda_max: "222, 208",
      delta_epsilon: "−30000",
      spectrum_type: "Ikkilamchi struktura",
      chiral_type: "Oqsil (L-aminokislotalar)",
      ligand: "Porfirin + globin",
      izoh: "UV sohada (208, 222 nm) α-spirl strukturani ko'rsatadi. Soret bandi (415 nm) — gem guruhi. Konformatsion o'zgarishlar CD orqali kuzatiladi.",
      href: "/ilmiy/tahlil/cd/birikmalar/gemoglobin",
      rang: "red"
    },
    {
      id: "sitoxrom-c",
      formula: "Sitoxrom c",
      iupac: "mitoxondrial metalloprotein",
      tarixiy: "Nafas olish zanjiri",
      metal: "Fe²⁺/Fe³⁺",
      config: "d⁶/d⁵",
      spin: "LS",
      magnit: "Paramagnit/Diamagnit",
      helicity: "—",
      cotton_sign: "Musbat (222 nm)",
      lambda_max: "222, 410",
      delta_epsilon: "−25000",
      spectrum_type: "Ikkilamchi struktura",
      chiral_type: "Oqsil (L-aminokislotalar)",
      ligand: "Gem + 2 His",
      izoh: "Elektron tashuvchi oqsil. CD orqali denaturatsiya, gem bog'lanishi va konformatsion o'zgarishlar o'rganiladi.",
      href: "/ilmiy/tahlil/cd/birikmalar/sitoxrom-c",
      rang: "rose"
    },

    // ═══════════════════════════════════════════════════════════
    // D. XIRAL DORI VOSITASI — 1 ta
    // ═══════════════════════════════════════════════════════════
    {
      id: "oksaliplatin",
      formula: "Oksaliplatin",
      iupac: "(SP-4-2)-[(1R,2R)-siklogeksan-1,2-diamin-κN,κN'][oksalato-κ²O¹,O²]platina",
      tarixiy: "Kolorektal saraton dorisi",
      metal: "Pt²⁺",
      config: "d⁸",
      spin: "S=0",
      magnit: "Diamagnit",
      helicity: "—",
      cotton_sign: "Musbat (210-250 nm)",
      lambda_max: "215, 254",
      delta_epsilon: "+3500",
      spectrum_type: "LMCT",
      chiral_type: "Ligand (R,R)",
      ligand: "(R,R)-dchxn + oksalat",
      izoh: "Sisplatin analogi — xiral dchxn ligand bilan. Faqat (1R,2R) enantiomer faol. CD orqali enantiomer tozaligi nazorat qilinadi.",
      href: "/ilmiy/tahlil/cd/birikmalar/oksaliplatin",
      rang: "orange"
    },
  ]

  // Filter va qidiruv
  const filtered = useMemo(() => {
    let results = birikmalar

    if (filter !== "hammasi") {
      if (filter === "delta") results = results.filter(b => b.helicity.includes("Δ"))
      else if (filter === "lambda") results = results.filter(b => b.helicity.includes("Λ"))
      else if (filter === "musbat") results = results.filter(b => b.cotton_sign.includes("+") || b.cotton_sign.includes("Musbat"))
      else if (filter === "manfiy") results = results.filter(b => b.cotton_sign.includes("−") || b.cotton_sign.includes("Manfiy"))
      else if (filter === "xiral-ligand") results = results.filter(b => b.chiral_type.includes("Ligand"))
      else if (filter === "biologik") results = results.filter(b => b.id === "gemoglobin" || b.id === "sitoxrom-c")
      else if (filter === "klassik") results = results.filter(b => ["co-en3", "co-ox3", "cr-acac3", "fe-phen3", "ru-bpy3", "rh-en3"].includes(b.id))
    }

    if (qidiruv.trim()) {
      const q = qidiruv.toLowerCase()
      results = results.filter(b => {
        const formulaClean = b.formula
          .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, m => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
          .replace(/[\[\]\(\)\s]/g, '')
          .toLowerCase()
        
        return (
          b.formula.toLowerCase().includes(q) ||
          formulaClean.includes(q) ||
          b.iupac.toLowerCase().includes(q) ||
          (b.tarixiy && b.tarixiy.toLowerCase().includes(q)) ||
          b.metal.toLowerCase().includes(q) ||
          b.ligand.toLowerCase().includes(q)
        )
      })
    }

    return results
  }, [qidiruv, filter])

  // Statistikalar
  const klassikCount = 6
  const xiralLigandCount = 3
  const biologikCount = 2
  const doriCount = 1

  // Ranglar xaritasi
  const rangMap = {
    blue: "border-blue-500/50 hover:border-blue-400",
    indigo: "border-indigo-500/50 hover:border-indigo-400",
    emerald: "border-emerald-500/50 hover:border-emerald-400",
    red: "border-red-500/50 hover:border-red-400",
    amber: "border-amber-500/50 hover:border-amber-400",
    cyan: "border-cyan-500/50 hover:border-cyan-400",
    violet: "border-violet-500/50 hover:border-violet-400",
    fuchsia: "border-fuchsia-500/50 hover:border-fuchsia-400",
    pink: "border-pink-500/50 hover:border-pink-400",
    rose: "border-rose-500/50 hover:border-rose-400",
    orange: "border-orange-500/50 hover:border-orange-400",
  }

  const textColorMap = {
    blue: "text-blue-400",
    indigo: "text-indigo-400",
    emerald: "text-emerald-400",
    red: "text-red-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
    fuchsia: "text-fuchsia-400",
    pink: "text-pink-400",
    rose: "text-rose-400",
    orange: "text-orange-400",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/cd" className="text-purple-400 hover:text-purple-300 text-lg">← CD spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-rose-400">🔄 Birikmalarning CD tahlili</h1>
          <p className="text-purple-400 text-sm">Cotton effekti • Δ/Λ enantiomerlar • Xiral ligandlar • Biologik komplekslar</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-yellow-400">{birikmalar.length}</div>
              <div className="text-purple-400 text-xs">jami birikma</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-blue-400">{klassikCount}</div>
              <div className="text-purple-400 text-xs">Klassik tris-xelat</div>
            </div>
            <div className="bg-violet-600/20 border border-violet-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-violet-400">{xiralLigandCount}</div>
              <div className="text-purple-400 text-xs">Xiral ligandlar</div>
            </div>
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-red-400">{biologikCount}</div>
              <div className="text-purple-400 text-xs">Biologik</div>
            </div>
            <div className="bg-orange-600/20 border border-orange-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-orange-400">{doriCount}</div>
              <div className="text-purple-400 text-xs">Dori vositasi</div>
            </div>
          </div>
        </div>

        {/* QIDIRUV VA FILTER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 space-y-4">
          <div className="relative">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: Co(en)₃, Ru(bpy)₃, gemoglobin, R-pn..."
              className="w-full px-6 py-4 pl-14 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-rose-400 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xl">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "hammasi", label: "Hammasi", count: birikmalar.length, icon: "🎯" },
              { id: "klassik", label: "Klassik tris-xelat", count: klassikCount, icon: "🔷" },
              { id: "xiral-ligand", label: "Xiral ligand", count: xiralLigandCount, icon: "🌀" },
              { id: "biologik", label: "Biologik", count: biologikCount, icon: "🧬" },
              { id: "musbat", label: "Musbat Cotton", count: 0, icon: "📈" },
              { id: "manfiy", label: "Manfiy Cotton", count: 0, icon: "📉" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-rose-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>

          {qidiruv && (
            <p className="text-purple-300 text-sm">
              <span className="text-white font-bold">{filtered.length}</span> ta birikma topildi
            </p>
          )}
        </div>

        {/* BIRIKMALAR GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini yoki filtrni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} 
                className={`group bg-purple-900/40 border-2 ${rangMap[b.rang]} rounded-2xl p-6 hover:bg-purple-800/60 transition-all transform hover:-translate-y-1`}>
                
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold font-mono ${textColorMap[b.rang]} group-hover:brightness-125 transition-all`}>
                      {b.formula}
                    </h3>
                    <p className="text-white font-semibold text-sm mt-1">{b.iupac}</p>
                    {b.tarixiy && <p className="text-purple-400 text-xs italic mt-1">"{b.tarixiy}"</p>}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-rose-600/20 text-rose-400 border border-rose-600/30">
                    🔄 CD
                  </span>
                </div>

                {/* Metal va konfiguratsiya */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.metal}
                  </span>
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.config}
                  </span>
                  <span className="bg-rose-800/50 border border-rose-600/30 px-2 py-0.5 rounded-full text-xs text-rose-300">
                    {b.chiral_type}
                  </span>
                </div>

                {/* CD parametrlari */}
                <div className="mt-4 pt-4 border-t border-purple-700/30 space-y-2">
                  <div className="grid grid-cols-3 gap-2 text-xs text-center">
                    <div className="bg-rose-900/30 border border-rose-500/30 rounded p-2">
                      <p className="text-rose-400 text-[10px]">λ<sub>max</sub></p>
                      <p className="text-white font-mono font-bold">{b.lambda_max} nm</p>
                    </div>
                    <div className="bg-purple-900/50 rounded p-2">
                      <p className="text-purple-400 text-[10px]">Δε</p>
                      <p className="text-yellow-400 font-mono font-bold">{b.delta_epsilon}</p>
                    </div>
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded p-2">
                      <p className="text-blue-400 text-[10px]">Xirallik</p>
                      <p className="text-emerald-400 font-bold text-[10px]">{b.helicity}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-purple-400">Spektr turi:</span>
                    <span className="text-rose-400 text-[10px]">{b.spectrum_type}</span>
                  </div>
                  
                  <p className="text-purple-300 text-[10px] italic">{b.izoh}</p>
                  
                  <div className="mt-2 pt-2 border-t border-purple-700/30">
                    <span className="text-[10px] text-purple-400">→ Batafsil CD tahlili</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CD PARAMETRLARINI QANDAY TALQIN QILISH */}
        <div className="bg-gradient-to-br from-rose-900/30 to-purple-900/30 border border-rose-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">📐 CD parametrlarini talqin qilish</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-600/10 border border-rose-500/30 rounded-xl p-5">
              <h3 className="text-rose-400 font-bold mb-2">λ<sub>max</sub> (to'lqin uzunligi)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ d-d o'tishlar: 400-700 nm</li>
                <li>✓ MLCT: 300-500 nm</li>
                <li>✓ π-π*: 200-300 nm</li>
                <li>✓ Oqsillar: 208, 222 nm (α-spirl)</li>
              </ul>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Δε (Δε = ε<sub>L</sub> − ε<sub>R</sub>)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>Musbat (+)</strong> → Δ-konfiguratsiya</li>
                <li>✓ <strong>Manfiy (−)</strong> → Λ-konfiguratsiya</li>
                <li>✓ Katta |Δε| → kuchli xirallik</li>
                <li>✓ Δε = 0 → axiral yoki ratsemik</li>
              </ul>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Spektr shakli</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>✓ <strong>Cotton</strong> — oddiy musbat/manfiy</li>
                <li>✓ <strong>Bisignate</strong> — eksiton juftlashuvi</li>
                <li>✓ <strong>Ikki to'lqinli</strong> — α-spirl (208+222)</li>
                <li>✓ <strong>Keng</strong> — konformatsion aralashma</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TO'LIQ SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📋 To'liq solishtirish jadvali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-2 text-yellow-400">Birikma</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Metal</th>
                  <th className="text-center py-3 px-2 text-yellow-400">λ<sub>max</sub></th>
                  <th className="text-center py-3 px-2 text-yellow-400">Δε</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Xirallik</th>
                  <th className="text-left py-3 px-2 text-yellow-400">Spektr</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {birikmalar.map((b, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className={`py-2 px-2 font-bold ${textColorMap[b.rang]}`}>{b.formula}</td>
                    <td className="py-2 px-2 text-center">{b.metal}</td>
                    <td className="py-2 px-2 text-center font-mono">{b.lambda_max}</td>
                    <td className="py-2 px-2 text-center font-mono text-yellow-400">{b.delta_epsilon}</td>
                    <td className="py-2 px-2 text-center text-[10px] text-rose-400">{b.helicity}</td>
                    <td className="py-2 px-2 text-[10px]">{b.spectrum_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-rose-600/10 to-purple-600/10 border border-rose-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>12 ta birikma — <strong className="text-rose-400">CD spektroskopiyasining barcha jihatlarini</strong> qamrab oladi</li>
            <li><strong>6 ta klassik tris-xelat</strong> — Δ/Λ enantiomerlar (Co, Cr, Fe, Ru, Rh)</li>
            <li><strong>3 ta xiral ligandli</strong> — R/S konfiguratsiya, diastereomerlar</li>
            <li><strong>2 ta biologik</strong> — gemoglobin, sitoxrom c (oqsillar)</li>
            <li><strong>1 ta dori vositasi</strong> — oksaliplatin (xiral Pt kompleksi)</li>
            <li>Δ-izomer → musbat Cotton effekti (empirik qoida)</li>
            <li>Λ-izomer → manfiy Cotton effekti</li>
            <li>Xiral ligand → metall markazining afzal konfiguratsiyasi</li>
            <li>Eksiton coupling → bisignate Cotton effekti</li>
            <li>Biologik oqsillar → α-spirl (208, 222 nm)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← CD spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/cd/birikmalar/co-en3" className="px-6 py-3 bg-rose-600/80 rounded-xl hover:bg-rose-500 text-white font-semibold">
            [Co(en)₃]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}