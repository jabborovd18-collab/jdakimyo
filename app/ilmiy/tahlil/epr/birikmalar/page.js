"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

export default function EPRBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")
  const [dnInput, setDnInput] = useState(1) // dⁿ kalkulyator uchun
  const [spinInput, setSpinInput] = useState("HS") // HS yoki LS

  const birikmalar = [
    // ═══════════════════════════════════════════════════════════
    // PARAMAGNIT - EPR FAOL (4 ta)
    // ═══════════════════════════════════════════════════════════
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      ion: "Fe³⁺",
      config: "d⁵ (LS)",
      dn: 5,
      S: "1/2",
      toqE: 1,
      magnit: "Paramagnit",
      epr: "Faol",
      g: "g₁=2.76, g₂=2.20, g₃=2.00",
      gType: "Rombik anizotropiya",
      hiperfin: "⁵⁷Fe: I=1/2, 2.1% tabiiy",
      zfs: "Yo'q (S=1/2)",
      izoh: "t₂g⁵ konfiguratsiya, kuchli spin-orbital coupling",
      sababi: "1 ta toq elektron (t₂g⁵)",
      alternativ: "Mössbauer, UV-Vis, Magnit",
      href: "/ilmiy/tahlil/epr/birikmalar/k3-fe-cn6",
      rang: "red"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      ion: "Cu²⁺",
      config: "d⁹",
      dn: 9,
      S: "1/2",
      toqE: 1,
      magnit: "Paramagnit",
      epr: "Faol",
      g: "g∥=2.30, g⊥=2.05",
      gType: "Aksial anizotropiya",
      hiperfin: "⁶³Cu/⁶⁵Cu: I=3/2, A∥≈150 G, 4 cho'qqi",
      zfs: "Yo'q (S=1/2)",
      izoh: "Yahn-Teller cho'zilgan oktaedr, d_x²-y² ground state",
      sababi: "1 ta toq elektron (d⁹)",
      alternativ: "UV-Vis, Magnit, NMR (paramagnit)",
      href: "/ilmiy/tahlil/epr/birikmalar/cu-h2o6",
      rang: "blue"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      ion: "Co²⁺",
      config: "d⁷ (HS)",
      dn: 7,
      S: "3/2",
      toqE: 3,
      magnit: "Paramagnit",
      epr: "Faol",
      g: "g≈4.3, g≈2.0",
      gType: "Katta anizotropiya",
      hiperfin: "⁵⁹Co: I=7/2, 100%, A≈50 G, 8 cho'qqi",
      zfs: "D≈15 cm⁻¹ (katta)",
      izoh: "Tetraedrik geometriya, kuchli ZFS",
      sababi: "3 ta toq elektron (d⁷ HS)",
      alternativ: "UV-Vis, Magnit",
      href: "/ilmiy/tahlil/epr/birikmalar/co-cl4",
      rang: "cyan"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      ion: "Cr³⁺",
      config: "d³",
      dn: 3,
      S: "3/2",
      toqE: 3,
      magnit: "Paramagnit",
      epr: "Faol",
      g: "g≈1.98 (izotrop)",
      gType: "Kuchsiz anizotropiya",
      hiperfin: "⁵³Cr: I=3/2, 9.5%, A≈16 G",
      zfs: "D≈0.2 cm⁻¹ (kichik)",
      izoh: "Oktaedrik, ⁴A₂g ground state, spin-only ga yaqin",
      sababi: "3 ta toq elektron (d³)",
      alternativ: "UV-Vis, Magnit",
      href: "/ilmiy/tahlil/epr/birikmalar/cr-h2o6",
      rang: "emerald"
    },

    // ═══════════════════════════════════════════════════════════
    // DIAMAGNIT - EPR FAOL EMAS (8 ta)
    // ═══════════════════════════════════════════════════════════
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      ion: "Fe²⁺",
      config: "d⁶ (LS)",
      dn: 6,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "t₂g⁶ to'liq to'lgan, barcha elektronlar juftlashgan",
      sababi: "d⁶ LS → barcha elektronlar juft",
      alternativ: "Mössbauer, UV-Vis, NMR",
      href: "/ilmiy/tahlil/magnit/birikmalar/k4-fe-cn6",
      rang: "yellow"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      ion: "Co³⁺",
      config: "d⁶ (LS)",
      dn: 6,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "Kuchli maydon ligandlari (NH₃), t₂g⁶, S=0",
      sababi: "d⁶ LS → barcha elektronlar juft",
      alternativ: "UV-Vis, NMR, Konduktometriya",
      href: "/ilmiy/tahlil/magnit/birikmalar/co-nh3-6-cl3",
      rang: "orange"
    },
    {
      id: "sisplatin",
      formula: "cis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      ion: "Pt²⁺",
      config: "d⁸ (kvadrat)",
      dn: 8,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "Kvadrat tekislik, barcha elektronlar juftlashgan",
      sababi: "d⁸ kvadrat → barcha elektronlar juft",
      alternativ: "¹⁹⁵Pt NMR, IR, UV-Vis",
      href: "/ilmiy/tahlil/magnit/birikmalar/sisplatin",
      rang: "pink"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      ion: "Fe²⁺",
      config: "d⁶ (LS, 18e⁻)",
      dn: 6,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "18 elektronli sandwich, barcha elektronlar juft",
      sababi: "d⁶ LS (18e⁻) → barcha elektronlar juft",
      alternativ: "¹H NMR, IR, Elektrokimyo",
      href: "/ilmiy/tahlil/magnit/birikmalar/ferrosen",
      rang: "amber"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      ion: "Ag⁺",
      config: "d¹⁰",
      dn: 10,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "d¹⁰ to'liq to'lgan, toq elektron yo'q",
      sababi: "d¹⁰ → barcha elektronlar juft",
      alternativ: "¹⁰⁹Ag NMR, UV-Vis",
      href: "/ilmiy/tahlil/magnit/birikmalar/ag-nh3-2",
      rang: "slate"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      ion: "Ni²⁺",
      config: "d⁸ (kvadrat)",
      dn: 8,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "Kvadrat tekislik, 16 elektronli, diamagnit",
      sababi: "d⁸ kvadrat → barcha elektronlar juft",
      alternativ: "¹H NMR, IR, UV-Vis",
      href: "/ilmiy/tahlil/magnit/birikmalar/ni-cn4",
      rang: "green"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      ion: "Fe⁰",
      config: "d⁸ (18e⁻)",
      dn: 8,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "18 elektronli, trigonal bipyramidal, diamagnit",
      sababi: "d⁸ (18e⁻) → barcha elektronlar juft",
      alternativ: "IR (νCO), ¹³C NMR",
      href: "/ilmiy/tahlil/magnit/birikmalar/fe-co5",
      rang: "orange"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      ion: "Zn²⁺",
      config: "d¹⁰",
      dn: 10,
      S: "0",
      toqE: 0,
      magnit: "Diamagnit",
      epr: "Faol emas",
      g: "—",
      gType: "—",
      hiperfin: "—",
      zfs: "—",
      izoh: "d¹⁰ to'liq to'lgan, tetraedrik, diamagnit",
      sababi: "d¹⁰ → barcha elektronlar juft",
      alternativ: "¹H NMR, UV-Vis",
      href: "/ilmiy/tahlil/magnit/birikmalar/zn-oh4",
      rang: "green"
    },
  ]

  // Filter va qidiruv
  const filtered = useMemo(() => {
    let results = birikmalar

    if (filter !== "hammasi") {
      results = results.filter(b => b.epr === filter)
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
          b.ion.toLowerCase().includes(q) ||
          b.config.toLowerCase().includes(q)
        )
      })
    }

    return results
  }, [qidiruv, filter])

  // Statistika
  const paramagnitlar = birikmalar.filter(b => b.epr === "Faol").length
  const diamagnitlar = birikmalar.filter(b => b.epr === "Faol emas").length

  // EPR faollik kalkulyatori
  const eprFaol = useMemo(() => {
    // dⁿ konfiguratsiyasiga qarab EPR faollik
    // HS (yuqori spin) va LS (quyi spin) holatlari
    let toqE = 0
    
    if (spinInput === "HS") {
      // Yuqori spin — maksimal toq elektronlar
      if (dnInput <= 5) toqE = dnInput
      else toqE = 10 - dnInput
    } else {
      // Quyi spin — minimal toq elektronlar
      if (dnInput === 0 || dnInput === 10) toqE = 0
      else if (dnInput === 1 || dnInput === 9) toqE = 1
      else if (dnInput === 2 || dnInput === 8) toqE = 0 // LS kvadrat
      else if (dnInput === 3) toqE = 3
      else if (dnInput === 4) toqE = 2
      else if (dnInput === 5) toqE = 1
      else if (dnInput === 6) toqE = 0
      else if (dnInput === 7) toqE = 1
    }
    
    return {
      toqE,
      faol: toqE > 0,
      sabab: toqE === 0 
        ? "Barcha elektronlar juftlashgan → EPR signal YO'Q" 
        : `${toqE} ta toq elektron → EPR signal BOR`
    }
  }, [dnInput, spinInput])

  // Ranglar xaritasi
  const rangMap = {
    red: "border-red-500/50 hover:border-red-400",
    blue: "border-blue-500/50 hover:border-blue-400",
    cyan: "border-cyan-500/50 hover:border-cyan-400",
    emerald: "border-emerald-500/50 hover:border-emerald-400",
    yellow: "border-yellow-500/50 hover:border-yellow-400",
    orange: "border-orange-500/50 hover:border-orange-400",
    pink: "border-pink-500/50 hover:border-pink-400",
    amber: "border-amber-500/50 hover:border-amber-400",
    slate: "border-slate-500/50 hover:border-slate-400",
    green: "border-green-500/50 hover:border-green-400",
  }

  const textColorMap = {
    red: "text-red-400",
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
    yellow: "text-yellow-400",
    orange: "text-orange-400",
    pink: "text-pink-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
    green: "text-green-400",
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/epr" className="text-purple-400 hover:text-purple-300 text-lg">← EPR spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-lime-400">📡 Birikmalarning EPR tahlili</h1>
          <p className="text-purple-400 text-sm">g-faktor • Gipernozik tuzilish • ZFS • Anizotropiya</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">
        
        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-yellow-400">{birikmalar.length}</div>
              <div className="text-purple-400 text-xs">jami birikma</div>
            </div>
            <div className="bg-lime-600/20 border border-lime-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-lime-400">{paramagnitlar}</div>
              <div className="text-purple-400 text-xs">EPR faol (paramagnit)</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-blue-400">{diamagnitlar}</div>
              <div className="text-purple-400 text-xs">EPR faol emas (diamagnit)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-3xl font-extrabold text-purple-400">4</div>
              <div className="text-purple-400 text-xs">batafsil sahifa</div>
            </div>
          </div>
        </div>

        {/* EPR FAQOLLIGI KALKULYATORI */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">🧮 EPR faollik kalkulyatori</h2>
          <p className="text-purple-300 text-sm mb-4">
            dⁿ konfiguratsiyasini va spin holatini kiriting — EPR signal beradimi yoki yo'qmi bilib oling
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-xs mb-2">
                  <span className="text-yellow-400 font-bold">d-elektronlar soni (n):</span>
                  <span className="text-emerald-400 font-mono text-lg">d{dnInput}</span>
                </label>
                <input type="range" min="0" max="10" step="1" value={dnInput}
                  onChange={(e) => setDnInput(parseInt(e.target.value))}
                  className="w-full h-2 bg-purple-900 rounded accent-lime-500" />
                <div className="flex justify-between text-[10px] text-purple-400 mt-1">
                  <span>d⁰</span><span>d⁵</span><span>d¹⁰</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-yellow-400 font-bold mb-2 block">Spin holati:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setSpinInput("HS")}
                    className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      spinInput === "HS" 
                        ? "bg-red-600/80 text-white shadow-lg" 
                        : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                    }`}>
                    🔴 Yuqori spin (HS)
                  </button>
                  <button onClick={() => setSpinInput("LS")}
                    className={`px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      spinInput === "LS" 
                        ? "bg-blue-600/80 text-white shadow-lg" 
                        : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                    }`}>
                    🔵 Quyi spin (LS)
                  </button>
                </div>
              </div>
            </div>

            <div className={`rounded-xl p-5 border-2 ${
              eprFaol.faol 
                ? "bg-lime-900/30 border-lime-500/50" 
                : "bg-blue-900/30 border-blue-500/50"
            }`}>
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{eprFaol.faol ? "📡" : "🚫"}</div>
                <p className={`text-2xl font-bold ${eprFaol.faol ? "text-lime-400" : "text-blue-400"}`}>
                  {eprFaol.faol ? "EPR FAOL" : "EPR FAOL EMAS"}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Toq elektronlar:</span>
                  <span className={`font-bold font-mono ${eprFaol.faol ? "text-lime-400" : "text-blue-400"}`}>
                    {eprFaol.toqE}
                  </span>
                </div>
                <div className="flex justify-between bg-purple-900/50 rounded p-2">
                  <span className="text-purple-300">Spin (S):</span>
                  <span className="text-emerald-400 font-mono">{eprFaol.toqE / 2}</span>
                </div>
                <p className="text-purple-200 text-xs mt-3 italic">{eprFaol.sabab}</p>
              </div>
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
              placeholder="Masalan: Cu²⁺, d⁹, ferrosen, sisplatin..."
              className="w-full px-6 py-4 pl-14 rounded-xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-lime-400 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white text-xl">✕</button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "hammasi", label: "Hammasi", count: birikmalar.length, icon: "🎯" },
              { id: "Faol", label: "EPR faol", count: paramagnitlar, icon: "📡" },
              { id: "Faol emas", label: "EPR faol emas", count: diamagnitlar, icon: "🚫" },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-lime-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {f.icon} {f.label} <span className="opacity-70">({f.count})</span>
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
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    b.epr === "Faol" 
                      ? "bg-lime-600/20 text-lime-400 border border-lime-600/30" 
                      : "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  }`}>
                    {b.epr === "Faol" ? "📡 EPR" : "🚫 EPR yo'q"}
                  </span>
                </div>

                {/* Ion va konfiguratsiya */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.ion}
                  </span>
                  <span className="bg-purple-800/50 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.config}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    b.magnit === "Paramagnit" 
                      ? "bg-red-600/20 text-red-400 border border-red-600/30" 
                      : "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  }`}>
                    {b.magnit}
                  </span>
                </div>

                {/* EPR parametrlari yoki sababi */}
                {b.epr === "Faol" ? (
                  <div className="space-y-2 mt-4 pt-4 border-t border-purple-700/30">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">g-faktor:</span>
                      <span className="text-lime-400 font-mono font-bold">{b.g}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Anizotropiya:</span>
                      <span className="text-emerald-400">{b.gType}</span>
                    </div>
                    {b.hiperfin !== "—" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-400">Gipernozik:</span>
                        <span className="text-yellow-400 text-right text-[10px]">{b.hiperfin}</span>
                      </div>
                    )}
                    {b.zfs !== "—" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-purple-400">ZFS:</span>
                        <span className="text-orange-400">{b.zfs}</span>
                      </div>
                    )}
                    <p className="text-purple-300 text-[10px] mt-2 italic">{b.izoh}</p>
                    <div className="mt-2 pt-2 border-t border-purple-700/30">
                      <span className="text-[10px] text-purple-400">→ Batafsil EPR tahlili</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-purple-700/30 space-y-2">
                    <div className="bg-blue-900/20 border border-blue-500/20 rounded p-2">
                      <p className="text-blue-400 text-[10px] font-bold mb-1">🚫 Nima uchun EPR yo'q?</p>
                      <p className="text-purple-200 text-[10px]">{b.sababi}</p>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-400">Alternativ usul:</span>
                      <span className="text-yellow-400 text-[10px]">{b.alternativ}</span>
                    </div>
                    <p className="text-purple-300 text-[10px] italic">{b.izoh}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* NIMA UCHUN BA'ZI KOMPLEKSLAR EPR DA KORINMAYDI */}
        <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🔵 Nima uchun ba'zi komplekslar EPR da ko'rinmaydi?</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              EPR spektroskopiyasi <strong className="text-blue-400">faqat toq elektronlarga</strong> ega bo'lgan
              moddalarni o'rganadi. Agar kompleksda <strong>barcha elektronlar juftlashgan</strong> bo'lsa,
              u <strong>diamagnit</strong> bo'ladi va EPR signal <strong>bermaydi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-lime-900/20 border border-lime-500/30 rounded-xl p-5">
              <h3 className="text-lime-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">📡</span>
                EPR FAOL (paramagnit)
              </h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>✓ Kamida <strong className="text-lime-400">1 ta toq elektron</strong> bo'lishi kerak</li>
                <li>✓ S ≥ 1/2 (paramagnit holat)</li>
                <li>✓ Relaksatsiya vaqti yetarli (T₁, T₂)</li>
                <li>✓ Odatda o'tish metallari: Cu²⁺, Fe³⁺, Co²⁺, Cr³⁺, Mn²⁺, VO²⁺</li>
              </ul>
              <div className="mt-4 bg-purple-900/50 rounded p-3">
                <p className="text-purple-300 text-xs font-bold mb-1">dⁿ konfiguratsiyalar:</p>
                <p className="text-lime-400 text-xs font-mono">
                  d¹, d², d³, d⁴(HS), d⁵(HS), d⁶(HS), d⁷, d⁸(HS), d⁹
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                EPR FAOL EMAS (diamagnit)
              </h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>✗ <strong className="text-blue-400">Barcha elektronlar juftlashgan</strong></li>
                <li>✗ S = 0 (diamagnit holat)</li>
                <li>✗ EPR signal umuman yo'q</li>
                <li>✓ Boshqa usullar bilan o'rganish mumkin (NMR, UV-Vis)</li>
              </ul>
              <div className="mt-4 bg-purple-900/50 rounded p-3">
                <p className="text-purple-300 text-xs font-bold mb-1">dⁿ konfiguratsiyalar:</p>
                <p className="text-blue-400 text-xs font-mono">
                  d⁰, d⁶(LS), d⁸(kvadrat), d¹⁰
                </p>
              </div>
            </div>
          </div>

          {/* DIAGRAMMA */}
          <div className="mt-6 bg-purple-950/50 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-4 text-center">📊 EPR faollik diagrammasi</h3>
            <div className="grid grid-cols-11 gap-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                const hsToq = n <= 5 ? n : 10 - n
                const lsToq = n === 0 || n === 10 ? 0 : n === 1 || n === 9 ? 1 : n === 3 ? 3 : n === 6 ? 0 : n === 7 ? 1 : 2
                return (
                  <div key={n} className="text-center">
                    <div className="bg-purple-900/50 rounded p-2 mb-1">
                      <p className="text-yellow-400 font-bold text-xs">d{n}</p>
                    </div>
                    <div className={`rounded p-2 ${hsToq > 0 ? 'bg-lime-600/20 border border-lime-500/30' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                      <p className="text-[9px] text-purple-400">HS</p>
                      <p className={`font-bold text-xs ${hsToq > 0 ? 'text-lime-400' : 'text-blue-400'}`}>
                        {hsToq > 0 ? `✓${hsToq}` : "✗"}
                      </p>
                    </div>
                    <div className={`rounded p-2 mt-1 ${lsToq > 0 ? 'bg-lime-600/20 border border-lime-500/30' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                      <p className="text-[9px] text-purple-400">LS</p>
                      <p className={`font-bold text-xs ${lsToq > 0 ? 'text-lime-400' : 'text-blue-400'}`}>
                        {lsToq > 0 ? `✓${lsToq}` : "✗"}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-lime-600/40 border border-lime-500/50 rounded"></div>
                <span className="text-purple-300">EPR faol (toq e⁻ bor)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600/40 border border-blue-500/50 rounded"></div>
                <span className="text-purple-300">EPR faol emas (toq e⁻ yo'q)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ALTERNATIV USULLAR */}
        <div className="bg-gradient-to-br from-yellow-900/20 to-purple-900/20 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🔄 Diamagnit komplekslarni qanday o'rganamiz?</h2>
          <p className="text-purple-300 text-sm mb-6">
            EPR signal bermasa ham, diamagnit komplekslarni <strong className="text-yellow-400">boshqa spektroskopik usullar</strong> bilan o'rganish mumkin:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                nom: "NMR spektroskopiya",
                icon: "🧲",
                desc: "Diamagnit komplekslar aniq, tor cho'qqili NMR spektri beradi. ¹H, ¹³C, ³¹P, ¹⁹F, ¹⁰⁹Ag, ¹⁹⁵Pt kabi yadrolar o'rganiladi.",
                misollar: "Ferrosen, sisplatin, [Ag(NH₃)₂]⁺",
                rang: "emerald"
              },
              {
                nom: "UV-Vis spektroskopiya",
                icon: "🌈",
                desc: "d-d o'tishlar, LMCT, MLCT o'rganiladi. Rang va Δo aniqlanadi. Ba'zi d⁶ LS, d⁸ kvadrat komplekslar kuchsiz d-d o'tishlar beradi.",
                misollar: "K₄[Fe(CN)₆], [Co(NH₃)₆]³⁺, [Ni(CN)₄]²⁻",
                rang: "blue"
              },
              {
                nom: "Mössbauer spektroskopiya",
                icon: "⚛️",
                desc: "Faqat Fe, Sn kabi ma'lum yadrolar uchun. Oksidlanish darajasi, spin holati, simmetriya aniqlanadi.",
                misollar: "K₄[Fe(CN)₆], K₃[Fe(CN)₆]",
                rang: "red"
              },
              {
                nom: "IR / Raman spektroskopiya",
                icon: "📊",
                desc: "Ligand tebranishlari o'rganiladi. ν(CN), ν(CO), ν(NO) kabi diagnostik cho'qqilar. Metal-ligand bog'lari.",
                misollar: "[Fe(CO)₅], K₄[Fe(CN)₆], sisplatin",
                rang: "yellow"
              },
              {
                nom: "Mass-spektrometriya",
                icon: "⚖️",
                desc: "Molekulyar massa, fragmentlanish, izotop taqsimoti. Kompleks tarkibi va barqarorligi.",
                misollar: "Ferrosen, [Ag(NH₃)₂]⁺, barcha komplekslar",
                rang: "pink"
              },
              {
                nom: "Rentgen diffraktsiyasi (XRD)",
                icon: "💎",
                desc: "Kristall strukturasi, bog' uzunliklari, burchaklar. Eng aniq usul — 3D struktura.",
                misollar: "Sisplatin, ferrosen, barcha kristallanuvchi",
                rang: "cyan"
              },
            ].map((u, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/30 rounded-xl p-5 hover:border-yellow-500/50 transition-all">
                <div className="text-4xl mb-2">{u.icon}</div>
                <h3 className="text-yellow-400 font-bold mb-2">{u.nom}</h3>
                <p className="text-purple-200 text-xs mb-3">{u.desc}</p>
                <div className="bg-purple-950/50 rounded p-2">
                  <p className="text-purple-400 text-[10px] font-bold mb-1">Misollar:</p>
                  <p className="text-purple-200 text-[10px]">{u.misollar}</p>
                </div>
              </div>
            ))}
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
                  <th className="text-center py-3 px-2 text-yellow-400">Ion</th>
                  <th className="text-center py-3 px-2 text-yellow-400">dⁿ</th>
                  <th className="text-center py-3 px-2 text-yellow-400">Toq e⁻</th>
                  <th className="text-center py-3 px-2 text-yellow-400">EPR</th>
                  <th className="text-left py-3 px-2 text-yellow-400">Alternativ usul</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {birikmalar.map((b, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${
                    b.epr === "Faol" ? "bg-lime-900/10" : "bg-blue-900/10"
                  }`}>
                    <td className={`py-2 px-2 font-bold ${textColorMap[b.rang]}`}>{b.formula}</td>
                    <td className="py-2 px-2 text-center">{b.ion}</td>
                    <td className="py-2 px-2 text-center font-mono">{b.config}</td>
                    <td className="py-2 px-2 text-center font-mono font-bold">
                      {b.toqE > 0 ? <span className="text-lime-400">{b.toqE}</span> : <span className="text-blue-400">0</span>}
                    </td>
                    <td className="py-2 px-2 text-center">
                      {b.epr === "Faol" 
                        ? <span className="text-lime-400">📡</span> 
                        : <span className="text-blue-400">🚫</span>}
                    </td>
                    <td className="py-2 px-2 text-[10px] text-yellow-400">{b.alternativ}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-lime-600/10 to-purple-600/10 border border-lime-500/20 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>EPR spektroskopiyasi <strong className="text-lime-400">faqat paramagnit</strong> (toq elektronli) komplekslarni o'rganadi</li>
            <li>12 ta birikmadan <strong className="text-lime-400">4 tasi EPR faol</strong>, <strong className="text-blue-400">8 tasi EPR faol emas</strong></li>
            <li><strong className="text-lime-400">EPR faol</strong>: K₃[Fe(CN)₆], [Cu(H₂O)₆]²⁺, [CoCl₄]²⁻, [Cr(H₂O)₆]³⁺</li>
            <li><strong className="text-blue-400">EPR faol emas</strong>: K₄[Fe(CN)₆], [Co(NH₃)₆]Cl₃, sisplatin, ferrosen, [Ag(NH₃)₂]⁺, [Ni(CN)₄]²⁻, [Fe(CO)₅], [Zn(OH)₄]²⁻</li>
            <li>Diamagnit komplekslar <strong className="text-yellow-400">NMR, UV-Vis, Mössbauer, IR</strong> kabi boshqa usullar bilan o'rganiladi</li>
            <li>EPR faollik <strong>dⁿ konfiguratsiya va spin holatiga</strong> bog'liq</li>
            <li>d⁰, d⁶(LS), d⁸(kvadrat), d¹⁰ — <strong>har doim diamagnit</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/epr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← EPR spektroskopiya
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 bg-lime-600/80 rounded-xl hover:bg-lime-500 text-white font-semibold">
            Mössbauer spektroskopiya →
          </Link>
        </div>

      </section>
    </main>
  )
}