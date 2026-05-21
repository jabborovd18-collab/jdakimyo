"use client"

import Link from "next/link"
import { useState } from "react"

export default function BirikmalarBazasi() {
  const [qidiruv, setQidiruv] = useState("")

  const barchaBirikmalar = [
    {
      id: 1,
      formula: "K₃[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(III)",
      tarixiy: "Qizil qon tuzi",
      rang: "Qizil kristall",
      massa: "329.24 g/mol",
      ks: 6,
      geometriya: "Oktaedrik",
      metall: "Fe³⁺",
      ligand: "CN⁻",
      href: "/ilmiy/birikmalar/k3-fe-cn6"
    },
    {
      id: 2,
      formula: "K₄[Fe(CN)₆]",
      iupac: "kaliy geksasiyanoferrat(II)",
      tarixiy: "Sariq qon tuzi",
      rang: "Sariq kristall",
      massa: "368.35 g/mol",
      ks: 6,
      geometriya: "Oktaedrik",
      metall: "Fe²⁺",
      ligand: "CN⁻",
      href: "/ilmiy/birikmalar/k4-fe-cn6"
    },
    {
      id: 3,
      formula: "[Co(NH₃)₆]Cl₃",
      iupac: "geksaamminkobalt(III) xlorid",
      tarixiy: "Verner klassikasi",
      rang: "Zarg'aldoq-sariq",
      massa: "267.48 g/mol",
      ks: 6,
      geometriya: "Oktaedrik",
      metall: "Co³⁺",
      ligand: "NH₃",
      href: "/ilmiy/birikmalar/co-nh3-6-cl3"
    },
    {
      id: 4,
      formula: "sis-[PtCl₂(NH₃)₂]",
      iupac: "sis-diammindixloroplatina(II)",
      tarixiy: "SISPLATIN",
      rang: "Sariq kristall",
      massa: "300.05 g/mol",
      ks: 4,
      geometriya: "Tekis kvadrat",
      metall: "Pt²⁺",
      ligand: "Cl⁻, NH₃",
      href: "/ilmiy/birikmalar/sisplatin"
    },
    {
      id: 5,
      formula: "[Fe(C₅H₅)₂]",
      iupac: "ferrosen (disiklopentadieniltemir(II))",
      tarixiy: "Ferrosen",
      rang: "To'q sariq kristall",
      massa: "186.04 g/mol",
      ks: 10,
      geometriya: "Sendvich",
      metall: "Fe²⁺",
      ligand: "C₅H₅⁻",
      href: "/ilmiy/birikmalar/ferrosen"
    },
    {
      id: 6,
      formula: "[Ni(CN)₄]²⁻",
      iupac: "tetrasiyanonikkolat(II) ioni",
      tarixiy: "—",
      rang: "Sariq",
      massa: "162.78 g/mol",
      ks: 4,
      geometriya: "Tekis kvadrat",
      metall: "Ni²⁺",
      ligand: "CN⁻",
      href: "/ilmiy/birikmalar/ni-cn4"
    },
    {
      id: 7,
      formula: "[Cu(H₂O)₆]²⁺",
      iupac: "geksaakvamis(II) ioni",
      tarixiy: "—",
      rang: "Havorang",
      massa: "171.66 g/mol",
      ks: 6,
      geometriya: "Oktaedrik (Yan-Teller)",
      metall: "Cu²⁺",
      ligand: "H₂O",
      href: "/ilmiy/birikmalar/cu-h2o6"
    },
    {
      id: 8,
      formula: "[Ag(NH₃)₂]⁺",
      iupac: "diamminkumush(I) ioni",
      tarixiy: "Tollens reaktivi",
      rang: "Rangsiz",
      massa: "141.94 g/mol",
      ks: 2,
      geometriya: "Chiziqli",
      metall: "Ag⁺",
      ligand: "NH₃",
      href: "/ilmiy/birikmalar/ag-nh3-2"
    },
    {
      id: 9,
      formula: "[CoCl₄]²⁻",
      iupac: "tetraxlorokobaltat(II) ioni",
      tarixiy: "—",
      rang: "Ko'k",
      massa: "200.75 g/mol",
      ks: 4,
      geometriya: "Tetraedrik",
      metall: "Co²⁺",
      ligand: "Cl⁻",
      href: "/ilmiy/birikmalar/co-cl4"
    },
    {
      id: 10,
      formula: "[Fe(CO)₅]",
      iupac: "pentakarboniltemir(0)",
      tarixiy: "—",
      rang: "Sariq suyuqlik",
      massa: "195.90 g/mol",
      ks: 5,
      geometriya: "Trigonal bipiramida",
      metall: "Fe⁰",
      ligand: "CO",
      href: "/ilmiy/birikmalar/fe-co5"
    },
    {
      id: 11,
      formula: "[Zn(OH)₄]²⁻",
      iupac: "tetragidroksosinkat(II) ioni",
      tarixiy: "—",
      rang: "Rangsiz",
      massa: "133.41 g/mol",
      ks: 4,
      geometriya: "Tetraedrik",
      metall: "Zn²⁺",
      ligand: "OH⁻",
      href: "/ilmiy/birikmalar/zn-oh4"
    },
    {
      id: 12,
      formula: "[Cr(H₂O)₆]³⁺",
      iupac: "geksaakvaxrom(III) ioni",
      tarixiy: "—",
      rang: "Binafsha",
      massa: "160.07 g/mol",
      ks: 6,
      geometriya: "Oktaedrik",
      metall: "Cr³⁺",
      ligand: "H₂O",
      href: "/ilmiy/birikmalar/cr-h2o6"
    }
  ]

  const filtered = barchaBirikmalar.filter(b => {
    if (!qidiruv) return false
    const q = qidiruv.toLowerCase()
    return (
      b.formula.toLowerCase().includes(q) ||
      b.iupac.toLowerCase().includes(q) ||
      b.tarixiy.toLowerCase().includes(q) ||
      b.metall.toLowerCase().includes(q) ||
      b.ligand.toLowerCase().includes(q)
    )
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Ilmiy bo'lim</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧪 Kompleks birikmalar bazasi</h1>
          <p className="text-purple-400 text-sm">IUPAC nomi yoki formula bo'yicha qidiring</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Qidiruv */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <div className="relative">
            <input 
              type="text"
              value={qidiruv}
              onChange={(e) => setQidiruv(e.target.value)}
              placeholder="Masalan: K₃[Fe(CN)₆] yoki kaliy geksasiyanoferrat(III) yoki qizil qon tuzi..."
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
            IUPAC nomi, formulasi, tarixiy nomi, metall yoki ligand bo'yicha qidirishingiz mumkin
          </p>
        </div>

        {/* Natijalar */}
        {qidiruv && (
          <div className="mb-6">
            <p className="text-purple-300">
              <span className="text-white font-bold">{filtered.length}</span> ta birikma topildi
            </p>
          </div>
        )}

        {!qidiruv ? (
          /* Bo'sh holat */
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">Qidiruvni boshlang</h3>
            <p className="text-purple-300">
              Yuqoridagi qidiruv maydoniga birikma nomini yoki formulasini yozing
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: K₃[Fe(CN)₆]
              </span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: sisplatin
              </span>
              <span className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                Masalan: ferrosen
              </span>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* Topilmadi */
          <div className="text-center py-16 bg-purple-900/20 border border-purple-700/30 rounded-2xl">
            <div className="text-7xl mb-4">😔</div>
            <h3 className="text-xl font-bold text-white mb-2">Birikma topilmadi</h3>
            <p className="text-purple-300">
              Qidiruv so'zini o'zgartirib ko'ring yoki boshqa nom bilan qidiring
            </p>
          </div>
        ) : (
          /* Natijalar ro'yxati */
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
                {b.tarixiy && b.tarixiy !== "—" && (
                  <p className="text-purple-400 text-sm mb-2 italic">"{b.tarixiy}"</p>
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

        {/* Jami */}
        <div className="mt-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🧪 Hozirda bazada <strong className="text-white">{barchaBirikmalar.length}</strong> ta kompleks birikma mavjud. Baza doimiy yangilanib boradi.
          </p>
        </div>

      </section>
    </main>
  )
}