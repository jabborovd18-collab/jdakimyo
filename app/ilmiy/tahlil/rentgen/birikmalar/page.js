"use client"

import Link from "next/link"
import { useState } from "react"

export default function RentgenBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      sistema: "Monoklinik",
      fazoviyGuruh: "P2₁/c",
      parametrlar: "a=7.07, b=10.38, c=13.44 Å, β=100.6°",
      bogUzunligi: "Fe-C: 1.93 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/k3-fe-cn6"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      sistema: "Monoklinik",
      fazoviyGuruh: "C2/c",
      parametrlar: "a=9.42, b=12.88, c=14.15 Å, β=95.2°",
      bogUzunligi: "Fe-C: 1.91 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/k4-fe-cn6"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      sistema: "Monoklinik",
      fazoviyGuruh: "P2₁/n",
      parametrlar: "a=10.82, b=10.82, c=15.50 Å, β=90°",
      bogUzunligi: "Co-N: 1.96 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/co-nh3-6-cl3"
    },
    {
      id: "sisplatin",
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      sistema: "Monoklinik",
      fazoviyGuruh: "P2₁/c",
      parametrlar: "a=6.05, b=9.02, c=12.54 Å, β=97.2°",
      bogUzunligi: "Pt-Cl: 2.33, Pt-N: 2.01 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/sisplatin"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      sistema: "Monoklinik",
      fazoviyGuruh: "P2₁/c",
      parametrlar: "a=5.91, b=7.59, c=9.59 Å, β=101.1°",
      bogUzunligi: "Fe-C: 2.06 Å (o'rtacha)",
      href: "/ilmiy/tahlil/rentgen/birikmalar/ferrosen"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      sistema: "Tetragonal",
      fazoviyGuruh: "P4/mmm",
      parametrlar: "a=10.20, b=10.20, c=8.90 Å, β=90°",
      bogUzunligi: "Ni-C: 1.86 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/ni-cn4"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      sistema: "Monoklinik",
      fazoviyGuruh: "P2₁/c",
      parametrlar: "a=6.12, b=10.69, c=13.88 Å, β=95.7°",
      bogUzunligi: "Cu-O(ekv): 1.97, Cu-O(aks): 2.28 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/cu-h2o6"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      sistema: "Ortorombik",
      fazoviyGuruh: "Pnma",
      parametrlar: "a=8.54, b=7.12, c=11.23 Å, β=90°",
      bogUzunligi: "Ag-N: 2.12 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/ag-nh3-2"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      sistema: "Tetragonal",
      fazoviyGuruh: "I4₂d",
      parametrlar: "a=9.45, b=9.45, c=14.20 Å, β=90°",
      bogUzunligi: "Co-Cl: 2.28 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/co-cl4"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      sistema: "Trigonal",
      fazoviyGuruh: "R3̄",
      parametrlar: "a=6.02, b=6.02, c=10.89 Å, γ=120°",
      bogUzunligi: "Fe-C(eks): 1.81, Fe-C(aks): 1.83 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/fe-co5"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      sistema: "Tetragonal",
      fazoviyGuruh: "I4̄",
      parametrlar: "a=8.92, b=8.92, c=10.45 Å, β=90°",
      bogUzunligi: "Zn-O: 1.97 Å",
      href: "/ilmiy/tahlil/rentgen/birikmalar/zn-oh4"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      sistema: "Trigonal",
      fazoviyGuruh: "R3̄c",
      parametrlar: "a=10.92, b=10.92, c=16.32 Å, γ=120°",
      bogUzunligi: "Cr-O: 1.96 Å (muntazam oktaedr)",
      href: "/ilmiy/tahlil/rentgen/birikmalar/cr-h2o6"
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
        <Link href="/ilmiy/tahlil/rentgen" className="text-purple-400 hover:text-purple-300 text-lg">← Rentgen difraksiyasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">💎 Birikmalarning kristallografik tahlili</h1>
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
              placeholder="Masalan: kaliy geksasiyanoferrat(III) yoki Ferrosen..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-yellow-400 transition-all text-lg"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">💎</span>
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
            <div className="text-7xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">Yuqoridagi qidiruv maydoniga birikmaning IUPAC nomini yoki tarixiy nomini yozing</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: ferrosen</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: sisplatin</span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: Qizil qon tuzi</span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link key={b.id} href={b.href} className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">{b.formula}</h3>
                  <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-2 py-0.5 rounded-full text-xs">{b.sistema}</span>
                </div>
                <p className="text-white font-semibold mb-1">{b.iupac}</p>
                {b.tarixiy && <p className="text-purple-400 text-sm mb-2 italic">&quot;{b.tarixiy}&quot;</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">FG: {b.fazoviyGuruh}</span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">{b.parametrlar}</span>
                </div>
                <p className="text-purple-400 text-xs mt-2">{b.bogUzunligi}</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">💎 Hozirda bazada <strong className="text-white">{birikmalar.length}</strong> ta kompleks birikmaning kristallografik tahlili mavjud.</p>
        </div>

      </section>
    </main>
  )
}