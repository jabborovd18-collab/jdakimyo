"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

export default function MagnitBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")
  const [filter, setFilter] = useState("hammasi")

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      dn: "d⁵ (LS)",
      toqE: "1",
      muNazariy: "1.73",
      muTajriba: "2.2-2.4",
      spin: "Quyi spin (LS)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/k3-fe-cn6"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      dn: "d⁶ (LS)",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "Quyi spin (LS)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/k4-fe-cn6"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      dn: "d⁶ (LS)",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "Quyi spin (LS)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/co-nh3-6-cl3"
    },
    {
      id: "sisplatin",
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      dn: "d⁸",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "Kvadrat tekislik",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/sisplatin"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      dn: "d⁶ (LS, 18e⁻)",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "Quyi spin (LS)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/ferrosen"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      dn: "d⁸",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "Kvadrat tekislik",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/ni-cn4"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      dn: "d⁹",
      toqE: "1",
      muNazariy: "1.73",
      muTajriba: "1.9-2.1",
      spin: "Yahn-Teller",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/cu-h2o6"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      dn: "d¹⁰",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "—",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/ag-nh3-2"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      dn: "d⁷ (HS)",
      toqE: "3",
      muNazariy: "3.87",
      muTajriba: "4.3-5.2",
      spin: "Yuqori spin (HS)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/co-cl4"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      dn: "d⁸ (18e⁻)",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "—",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/fe-co5"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      dn: "d¹⁰",
      toqE: "0",
      muNazariy: "0",
      muTajriba: "0",
      spin: "—",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/zn-oh4"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      dn: "d³",
      toqE: "3",
      muNazariy: "3.87",
      muTajriba: "3.7-3.9",
      spin: "—",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/magnit/birikmalar/cr-h2o6"
    }
  ]

  const filtered = useMemo(() => {
    let results = birikmalar

    // Magnit turi bo'yicha filter
    if (filter !== "hammasi") {
      results = results.filter(b => b.magnit === filter)
    }

    // Qidiruv bo'yicha filter
    if (qidiruv.trim()) {
      const q = qidiruv.toLowerCase()
      const qClean = q.replace(/[\[\]\(\)\s]/g, '')
      
      results = results.filter(b => {
        // Formuladan indekslarni olib tashlash (K₃ → K3)
        const formulaClean = b.formula
          .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, m => '₀₁₂₃₄₅₆₇₈₉'.indexOf(m))
          .replace(/[\[\]\(\)\s]/g, '')
          .toLowerCase()
        
        // dⁿ dan raqamni olish (d⁵ → d5)
        const dnClean = b.dn.toLowerCase().replace(/[^d0-9]/g, '')
        
        return (
          b.formula.toLowerCase().includes(q) ||
          formulaClean.includes(qClean) ||
          b.iupac.toLowerCase().includes(q) ||
          (b.tarixiy && b.tarixiy.toLowerCase().includes(q)) ||
          dnClean.includes(qClean)
        )
      })
    }

    return results
  }, [qidiruv, filter])

  // Statistika
  const paramagnitlar = birikmalar.filter(b => b.magnit === "Paramagnit").length
  const diamagnitlar = birikmalar.filter(b => b.magnit === "Diamagnit").length

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/magnit" className="text-purple-400 hover:text-purple-300 text-lg">← Magnit o'lchashlar</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔍 Birikmalarning magnit tahlili</h1>
          <p className="text-purple-400 text-sm">Formula, IUPAC nomi yoki tarixiy nom bo'yicha qidiring</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* STATISTIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="text-2xl font-extrabold text-yellow-400">{birikmalar.length}</div>
              <div className="text-purple-400 text-xs">jami birikma</div>
            </div>
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4">
              <div className="text-2xl font-extrabold text-red-400">{paramagnitlar}</div>
              <div className="text-purple-400 text-xs">paramagnit</div>
            </div>
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4">
              <div className="text-2xl font-extrabold text-blue-400">{diamagnitlar}</div>
              <div className="text-purple-400 text-xs">diamagnit</div>
            </div>
          </div>
        </div>

        {/* QIDIRUV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-6">
          <div className="relative mb-4">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: K3FeCN6, ferrosen, d5, kaliy..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-orange-400 transition-all text-lg"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-2xl">✕</button>
            )}
          </div>
          <p className="text-purple-400 text-sm text-center">
            Formula (K₃[Fe(CN)₆] yoki K3FeCN6), IUPAC nomi, tarixiy nom yoki dⁿ konfiguratsiya bo'yicha qidirishingiz mumkin
          </p>
        </div>

        {/* FILTER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <p className="text-purple-300 text-sm mb-3 font-semibold">Magnit turi bo'yicha:</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "hammasi", label: "Hammasi", count: birikmalar.length },
              { id: "Paramagnit", label: "🔴 Paramagnit", count: paramagnitlar },
              { id: "Diamagnit", label: "🔵 Diamagnit", count: diamagnitlar },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.id
                    ? "bg-orange-600/80 text-white shadow-lg"
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {f.label} <span className="opacity-70">({f.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* NATIJALAR */}
        {qidiruv && (
          <div className="mb-6">
            <p className="text-purple-300"><span className="text-white font-bold">{filtered.length}</span> ta birikma topildi</p>
          </div>
        )}

        {!qidiruv && filter === "hammasi" ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🧲</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">Yuqoridagi qidiruv maydoniga birikma nomini yozing</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: ferrosen</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: K3FeCN6</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: d5</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so'zini yoki filtrni o'zgartirib ko'ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-orange-400/50 transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">{b.formula}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${b.magnit === "Diamagnit" ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" : "bg-red-600/20 text-red-400 border border-red-600/30"}`}>{b.magnit}</span>
                </div>
                <p className="text-white font-semibold mb-1">{b.iupac}</p>
                {b.tarixiy && <p className="text-purple-400 text-sm mb-2 italic">"{b.tarixiy}"</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-full text-xs">{b.dn}</span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">μ<sub>eff</sub> = {b.muNazariy} μ<sub>B</sub></span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">n = {b.toqE}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">🧲 Hozirda bazada <strong className="text-white">{birikmalar.length}</strong> ta kompleks birikmaning magnit tahlili mavjud. Baza doimiy yangilanib boradi.</p>
        </div>

      </section>
    </main>
  )
}