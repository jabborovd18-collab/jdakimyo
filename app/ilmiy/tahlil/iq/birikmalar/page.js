"use client"

import Link from "next/link"
import { useState } from "react"

export default function IQBirikmalar() {
  const [qidiruv, setQidiruv] = useState("")

  const birikmalar = [
    {
      id: "k3-fe-cn6",
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      rang: "Qizil kristall",
      massa: "329.24 g/mol",
      metall: "Fe³⁺",
      ligand: "CN⁻",
      geometriya: "Oktaedrik",
      ks: "6",
      href: "/ilmiy/tahlil/iq/birikmalar/k3-fe-cn6"
    },
    {
      id: "k4-fe-cn6",
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      rang: "Sariq kristall",
      massa: "368.35 g/mol",
      metall: "Fe²⁺",
      ligand: "CN⁻",
      geometriya: "Oktaedrik",
      ks: "6",
      href: "/ilmiy/tahlil/iq/birikmalar/k4-fe-cn6"
    },
    {
      id: "co-nh3-6-cl3",
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      rang: "Zarg'aldoq-sariq",
      massa: "267.48 g/mol",
      metall: "Co³⁺",
      ligand: "NH₃",
      geometriya: "Oktaedrik",
      ks: "6",
      href: "/ilmiy/tahlil/iq/birikmalar/co-nh3-6-cl3"
    },
    {
      id: "sisplatin",
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      rang: "Sariq kristall",
      massa: "300.05 g/mol",
      metall: "Pt²⁺",
      ligand: "Cl⁻, NH₃",
      geometriya: "Tekis kvadrat",
      ks: "4",
      href: "/ilmiy/tahlil/iq/birikmalar/sisplatin"
    },
    {
      id: "ferrosen",
      formula: "[Fe(C₅H₅)₂]",
      iupac: "bis(siklopentadienil)temir(II)",
      tarixiy: "Ferrosen",
      rang: "To'q sariq kristall",
      massa: "186.04 g/mol",
      metall: "Fe²⁺",
      ligand: "C₅H₅⁻",
      geometriya: "Sendvich",
      ks: "10",
      href: "/ilmiy/tahlil/iq/birikmalar/ferrosen"
    },
    {
      id: "ni-cn4",
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "",
      rang: "Sariq",
      massa: "162.78 g/mol",
      metall: "Ni²⁺",
      ligand: "CN⁻",
      geometriya: "Tekis kvadrat",
      ks: "4",
      href: "/ilmiy/tahlil/iq/birikmalar/ni-cn4"
    },
    {
      id: "cu-h2o6",
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "",
      rang: "Havorang",
      massa: "171.66 g/mol",
      metall: "Cu²⁺",
      ligand: "H₂O",
      geometriya: "Oktaedrik (Yan-Teller)",
      ks: "6",
      href: "/ilmiy/tahlil/iq/birikmalar/cu-h2o6"
    },
    {
      id: "ag-nh3-2",
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      rang: "Rangsiz",
      massa: "141.94 g/mol",
      metall: "Ag⁺",
      ligand: "NH₃",
      geometriya: "Chiziqli",
      ks: "2",
      href: "/ilmiy/tahlil/iq/birikmalar/ag-nh3-2"
    },
    {
      id: "co-cl4",
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "",
      rang: "Ko'k",
      massa: "200.75 g/mol",
      metall: "Co²⁺",
      ligand: "Cl⁻",
      geometriya: "Tetraedrik",
      ks: "4",
      href: "/ilmiy/tahlil/iq/birikmalar/co-cl4"
    },
    {
      id: "fe-co5",
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "",
      rang: "Sariq suyuqlik",
      massa: "195.90 g/mol",
      metall: "Fe⁰",
      ligand: "CO",
      geometriya: "Trigonal bipiramida",
      ks: "5",
      href: "/ilmiy/tahlil/iq/birikmalar/fe-co5"
    },
    {
      id: "zn-oh4",
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "",
      rang: "Rangsiz",
      massa: "133.41 g/mol",
      metall: "Zn²⁺",
      ligand: "OH⁻",
      geometriya: "Tetraedrik",
      ks: "4",
      href: "/ilmiy/tahlil/iq/birikmalar/zn-oh4"
    },
    {
      id: "cr-h2o6",
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "",
      rang: "Binafsha",
      massa: "160.07 g/mol",
      metall: "Cr³⁺",
      ligand: "H₂O",
      geometriya: "Oktaedrik",
      ks: "6",
      href: "/ilmiy/tahlil/iq/birikmalar/cr-h2o6"
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
        <Link href="/ilmiy/tahlil/iq" className="text-purple-400 hover:text-purple-300 text-lg">← IQ spektroskopiya</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔍 Birikmalarning IQ tahlili</h1>
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
              placeholder="Masalan: kaliy geksasiyanoferrat(III) yoki Qizil qon tuzi..."
              className="w-full px-6 py-5 pl-16 rounded-2xl bg-purple-800/50 border border-purple-600 text-white placeholder-purple-500 focus:outline-none focus:border-blue-400 transition-all text-lg"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-3xl">🔍</span>
            {qidiruv && (
              <button 
                onClick={() => setQidiruv("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-purple-400 text-sm mt-4 text-center">
            IUPAC nomi yoki tarixiy nom bo&apos;yicha qidirishingiz mumkin
          </p>
        </div>

        {qidiruv && (
          <div className="mb-6">
            <p className="text-purple-300">
              <span className="text-white font-bold">{filtered.length}</span> ta birikma topildi
            </p>
          </div>
        )}

        {!qidiruv ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">
              Yuqoridagi qidiruv maydoniga birikmaning IUPAC nomini yoki tarixiy nomini yozing
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: kaliy geksasiyanoferrat(III)
              </span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: Qizil qon tuzi
              </span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: Verner klassikasi
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">
              Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki boshqa nom bilan qidiring
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((b) => (
              <Link 
                key={b.id}
                href={b.href}
                className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-blue-400/50 transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono group-hover:text-yellow-300 transition-colors">
                    {b.formula}
                  </h3>
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-2 py-0.5 rounded-full text-xs">
                    KS={b.ks}
                  </span>
                </div>
                <p className="text-white font-semibold mb-1">{b.iupac}</p>
                {b.tarixiy && (
                  <p className="text-purple-400 text-sm mb-2 italic">&quot;{b.tarixiy}&quot;</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.rang}
                  </span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.geometriya}
                  </span>
                  <span className="bg-purple-800/30 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs text-purple-300">
                    {b.metall}
                  </span>
                </div>
                <div className="mt-3 text-purple-400 text-sm">
                  Massa: {b.massa}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🧪 Hozirda bazada <strong className="text-white">{birikmalar.length}</strong> ta kompleks birikmaning IQ tahlili mavjud. Baza doimiy yangilanib boradi.
          </p>
        </div>

      </section>
    </main>
  )
}