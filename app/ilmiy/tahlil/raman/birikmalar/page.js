"use client"

import Link from "next/link"
import { useState } from "react"

export default function RamanBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      asosiyChastota: "ν(C≡N): 2130 sm⁻¹",
      metallLigand: "ν(Fe−C): 390 sm⁻¹",
      intensivlik: "Kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/k3-fe-cn6"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      asosiyChastota: "ν(C≡N): 2098 sm⁻¹",
      metallLigand: "ν(Fe−C): 380 sm⁻¹",
      intensivlik: "Kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/k4-fe-cn6"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      asosiyChastota: "ν(Co−N): 500 sm⁻¹",
      metallLigand: "ν(Co−N): 500 sm⁻¹",
      intensivlik: "O'rtacha",
      href: "/ilmiy/tahlil/raman/birikmalar/co-nh3-6-cl3"
    },
    {
      id: "sisplatin",
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      asosiyChastota: "ν(Pt−Cl): 330 sm⁻¹",
      metallLigand: "ν(Pt−N): 520 sm⁻¹",
      intensivlik: "O'rtacha",
      href: "/ilmiy/tahlil/raman/birikmalar/sisplatin"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      asosiyChastota: "ν(C−C) Cp: 1105 sm⁻¹",
      metallLigand: "ν(Fe−Cp): 305 sm⁻¹",
      intensivlik: "Kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/ferrosen"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      asosiyChastota: "ν(C≡N): 2125 sm⁻¹",
      metallLigand: "ν(Ni−C): 420 sm⁻¹",
      intensivlik: "Kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/ni-cn4"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      asosiyChastota: "ν(Cu−O): 440 sm⁻¹",
      metallLigand: "ν(Cu−O): 440, 290 sm⁻¹",
      intensivlik: "Kuchsiz",
      href: "/ilmiy/tahlil/raman/birikmalar/cu-h2o6"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      asosiyChastota: "ν(Ag−N): 375 sm⁻¹",
      metallLigand: "ν(Ag−N): 375 sm⁻¹",
      intensivlik: "Kuchsiz",
      href: "/ilmiy/tahlil/raman/birikmalar/ag-nh3-2"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      asosiyChastota: "ν(Co−Cl): 300 sm⁻¹",
      metallLigand: "ν(Co−Cl): 300 sm⁻¹",
      intensivlik: "Kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/co-cl4"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      asosiyChastota: "ν(C≡O): 2014, 2034 sm⁻¹",
      metallLigand: "ν(Fe−C): 415 sm⁻¹",
      intensivlik: "Juda kuchli",
      href: "/ilmiy/tahlil/raman/birikmalar/fe-co5"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      asosiyChastota: "ν(Zn−O): 480 sm⁻¹",
      metallLigand: "ν(Zn−O): 480 sm⁻¹",
      intensivlik: "O'rtacha",
      href: "/ilmiy/tahlil/raman/birikmalar/zn-oh4"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      asosiyChastota: "ν(Cr−O): 540 sm⁻¹",
      metallLigand: "ν(Cr−O): 540 sm⁻¹",
      intensivlik: "Kuchsiz",
      href: "/ilmiy/tahlil/raman/birikmalar/cr-h2o6"
    }
  ]

  const filtered = birikmalar.filter(b => {
    if (!qidiruv) return false
    const q = qidiruv.toLowerCase()
    return b.iupac.toLowerCase().includes(q) || (b.tarixiy && b.tarixiy.toLowerCase().includes(q))
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil/raman" className="text-purple-400 hover:text-purple-300 text-lg">← Raman spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-sky-400">🔆 Birikmalarning Raman spektroskopik tahlili</h1>
          <p className="text-purple-400 text-sm">IUPAC nomi yoki tarixiy nom bo&apos;yicha qidiring</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <div className="relative">
            <input type="text" value={qidiruv} onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: kaliy geksasiyanoferrat(III) yoki Ferrosen..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-sky-400 transition-all text-lg" />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔆</span>
            {qidiruv && <button onClick={() => setQidiruv("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-2xl">✕</button>}
          </div>
          <p className="text-purple-400 text-sm mt-4 text-center">IUPAC nomi yoki tarixiy nom bo&apos;yicha qidirishingiz mumkin</p>
        </div>

        {qidiruv && <div className="mb-6"><p className="text-purple-300"><span className="text-white font-bold">{filtered.length}</span> ta birikma topildi</p></div>}

        {!qidiruv ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🔆</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">Yuqoridagi qidiruv maydoniga birikmaning IUPAC nomini yoki tarixiy nomini yozing</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">Masalan: ferrosen</span>
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
              <Link key={b.id} href={b.href} className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-sky-400/50 transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-sky-400 font-mono group-hover:text-sky-300 transition-colors">{b.formula}</h3>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${b.intensivlik === "Juda kuchli" ? "bg-green-600/20 text-green-400 border border-green-600/30" : b.intensivlik === "Kuchli" ? "bg-sky-600/20 text-sky-400 border border-sky-600/30" : b.intensivlik === "O'rtacha" ? "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30" : "bg-purple-600/20 text-purple-400 border border-purple-600/30"}`}>{b.intensivlik}</span>
                </div>
                <p className="text-white font-semibold mb-1">{b.iupac}</p>
                {b.tarixiy && <p className="text-purple-400 text-sm mb-2 italic">&quot;{b.tarixiy}&quot;</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">{b.asosiyChastota}</span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">{b.metallLigand}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">🔆 Hozirda bazada <strong className="text-white">{birikmalar.length}</strong> ta kompleks birikmaning Raman spektroskopik tahlili mavjud.</p>
        </div>
      </section>
    </main>
  )
}