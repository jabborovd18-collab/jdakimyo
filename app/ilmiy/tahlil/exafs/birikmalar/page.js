"use client"

import Link from "next/link"
import { useState } from "react"

export default function EXAFSBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      chegarasi: "Fe K-chegara (7112 eV)",
      xususiyat: "Fe−C: 1.942 Å, N=6, σ²=0.0018",
      oksidlanish: "Fe³⁺ (LS, d⁵)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/k3-fe-cn6"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      chegarasi: "Fe K-chegara (7112 eV)",
      xususiyat: "Fe−C: 1.918 Å, N=6, σ²=0.0015",
      oksidlanish: "Fe²⁺ (LS, d⁶)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/k4-fe-cn6"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      chegarasi: "Co K-chegara (7709 eV)",
      xususiyat: "Co−N: 1.961 Å, N=6, σ²=0.0012",
      oksidlanish: "Co³⁺ (LS, d⁶)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/co-nh3-6-cl3"
    },
    {
      id: "sisplatin",
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      chegarasi: "Pt L₃-chegara (11564 eV)",
      xususiyat: "Pt−Cl: 2.328, Pt−N: 2.012 Å",
      oksidlanish: "Pt²⁺ (d⁸)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/sisplatin"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      chegarasi: "Fe K-chegara (7112 eV)",
      xususiyat: "Fe−C: 2.064 Å, N=10, σ²=0.0021",
      oksidlanish: "Fe²⁺ (d⁶, LS)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/ferrosen"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      chegarasi: "Ni K-chegara (8333 eV)",
      xususiyat: "Ni−C: 1.858 Å, N=4, σ²=0.0014",
      oksidlanish: "Ni²⁺ (d⁸)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/ni-cn4"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      chegarasi: "Cu K-chegara (8979 eV)",
      xususiyat: "Cu−O(ekv): 1.968 (N=4), Cu−O(aks): 2.275 (N=2)",
      oksidlanish: "Cu²⁺ (d⁹)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/cu-h2o6"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      chegarasi: "Ag K-chegara (25514 eV)",
      xususiyat: "Ag−N: 2.115 Å, N=2, σ²=0.0019",
      oksidlanish: "Ag⁺ (d¹⁰)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/ag-nh3-2"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      chegarasi: "Co K-chegara (7709 eV)",
      xususiyat: "Co−Cl: 2.252 Å, N=4, σ²=0.0025",
      oksidlanish: "Co²⁺ (d⁷, HS)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/co-cl4"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      chegarasi: "Fe K-chegara (7112 eV)",
      xususiyat: "Fe−C(eks): 1.807, Fe−C(aks): 1.827 Å",
      oksidlanish: "Fe⁰ (d⁸)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/fe-co5"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      chegarasi: "Zn K-chegara (9659 eV)",
      xususiyat: "Zn−O: 1.972 Å, N=4, σ²=0.0020",
      oksidlanish: "Zn²⁺ (d¹⁰)",
      magnit: "Diamagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/zn-oh4"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      chegarasi: "Cr K-chegara (5989 eV)",
      xususiyat: "Cr−O: 1.966 Å, N=6, σ²=0.0017",
      oksidlanish: "Cr³⁺ (d³)",
      magnit: "Paramagnit",
      href: "/ilmiy/tahlil/exafs/birikmalar/cr-h2o6"
    }
  ]

  const filtered = birikmalar.filter(b => {
    if (!qidiruv) return false
    const q = qidiruv.toLowerCase()
    return (
      b.iupac.toLowerCase().includes(q) ||
      (b.tarixiy && b.tarixiy.toLowerCase().includes(q))
    )
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/exafs" className="text-purple-400 hover:text-purple-300 text-lg">← EXAFS/XANES</Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🔍 Birikmalarning EXAFS/XANES tahlili</h1>
          <p className="text-purple-400 text-sm">IUPAC nomi yoki tarixiy nom bo&apos;yicha qidiring</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <div className="relative">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: kaliy geksasiyanoferrat(III) yoki Sisplatin..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-emerald-400 transition-all text-lg"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔍</span>
            {qidiruv && (
              <button onClick={() => setQidiruv("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-2xl">✕</button>
            )}
          </div>
          <p className="text-purple-400 text-sm mt-4 text-center">IUPAC nomi yoki tarixiy nom bo&apos;yicha qidirishingiz mumkin</p>
        </div>

        {qidiruv && (
          <div className="mb-6">
            <p className="text-purple-300"><span className="text-white font-bold">{filtered.length}</span> ta birikma topildi</p>
          </div>
        )}

        {!qidiruv ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🔮</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">Yuqoridagi qidiruv maydoniga birikmaning IUPAC nomini yoki tarixiy nomini yozing</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: ferrosen</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: Verner klassikasi</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: sisplatin</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki boshqa nom bilan qidiring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-emerald-400/50 transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">{b.formula}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${b.magnit === "Diamagnit" ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" : "bg-red-600/20 text-red-400 border border-red-600/30"}`}>{b.magnit}</span>
                </div>
                <p className="text-white font-semibold mb-1">{b.iupac}</p>
                {b.tarixiy && <p className="text-purple-400 text-sm mb-2 italic">&quot;{b.tarixiy}&quot;</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-2 py-0.5 rounded-full text-xs">{b.chegarasi}</span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">{b.xususiyat}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">🔮 Hozirda bazada <strong className="text-white">{birikmalar.length}</strong> ta kompleks birikmaning EXAFS/XANES tahlili mavjud. Baza doimiy yangilanib boradi.</p>
        </div>

      </section>
    </main>
  )
}