import Link from "next/link"

export default function ElektronQoidasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧪 18 elektron qoidasi</h1>
          <p className="text-purple-400 text-sm">Metall karbonillari va metallosenlar barqarorligi • [Ni(CO)₄], [Fe(CO)₅], ferrosen</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY QOIDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 18 elektron qoidasi haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">18 elektron qoidasi</strong> — barqaror komplekslarda markaziy metall atomi 
              valent qavatida <strong className="text-yellow-400">18 ta elektron</strong> bo'lishini ta'kidlaydi 
              (s²p⁶d¹⁰ — inert gaz konfiguratsiyasi). Bu qoida asosan 
              <strong className="text-yellow-400"> metall karbonillari va metallosenlar</strong> uchun ishlaydi.
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-2xl font-extrabold text-yellow-400">18 e⁻ = (metall d-e⁻) + (ligandlar bergan e⁻)</p>
          </div>
        </div>

        {/* 2. HISOBLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 18 elektron qoidasini hisoblash</h2>
          
          <div className="space-y-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-xl mb-3">[Ni(CO)₄] — 18 e⁻ ✅</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-200">Ni⁰: [Ar] 3d⁸ 4s²</p>
                  <p className="text-purple-200">d-elektronlar: <strong>10 ta</strong></p>
                  <p className="text-purple-200">4×CO: har biri 2e⁻ = <strong>8 ta</strong></p>
                  <p className="text-yellow-400 font-bold text-lg mt-2">Jami: 10 + 8 = 18 ✅</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">Geometriya: <strong>Tetraedrik</strong></p>
                  <p className="text-purple-300 text-xs">Rangi: Rangsiz suyuqlik</p>
                  <p className="text-purple-300 text-xs">Tqayn: 43°C</p>
                  <p className="text-red-400 text-xs mt-1">⚠️ Juda zaharli!</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-3">[Fe(CO)₅] — 18 e⁻ ✅</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-200">Fe⁰: [Ar] 3d⁶ 4s²</p>
                  <p className="text-purple-200">d-elektronlar: <strong>8 ta</strong></p>
                  <p className="text-purple-200">5×CO: har biri 2e⁻ = <strong>10 ta</strong></p>
                  <p className="text-yellow-400 font-bold text-lg mt-2">Jami: 8 + 10 = 18 ✅</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">Geometriya: <strong>Trigonal bipiramida</strong></p>
                  <p className="text-purple-300 text-xs">Rangi: Sariq suyuqlik</p>
                  <p className="text-purple-300 text-xs">18 elektron — barqaror</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-xl mb-3">[Fe(C₅H₅)₂] — Ferrosen — 18 e⁻ ✅</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-200">Fe²⁺: [Ar] 3d⁶</p>
                  <p className="text-purple-200">d-elektronlar: <strong>6 ta</strong></p>
                  <p className="text-purple-200">2×C₅H₅⁻: har biri 6e⁻ = <strong>12 ta</strong></p>
                  <p className="text-yellow-400 font-bold text-lg mt-2">Jami: 6 + 12 = 18 ✅</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">Geometriya: <strong>Sendvich</strong></p>
                  <p className="text-purple-300 text-xs">Rangi: To'q sariq kristall</p>
                  <p className="text-purple-300 text-xs">Havoda barqaror</p>
                </div>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-red-400 font-bold text-xl mb-3">[Cr(CO)₆] — 18 e⁻ ✅</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-200">Cr⁰: [Ar] 3d⁵ 4s¹</p>
                  <p className="text-purple-200">d-elektronlar: <strong>6 ta</strong></p>
                  <p className="text-purple-200">6×CO: har biri 2e⁻ = <strong>12 ta</strong></p>
                  <p className="text-yellow-400 font-bold text-lg mt-2">Jami: 6 + 12 = 18 ✅</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">Geometriya: <strong>Oktaedrik</strong></p>
                  <p className="text-purple-300 text-xs">Rangi: Oq kristall</p>
                  <p className="text-purple-300 text-xs">Diamagnit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. ISTISNOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Qoidadan istisnolar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">16 elektronli komplekslar</h3>
              <p className="text-purple-200 text-sm">
                d⁸ konfiguratsiyali tekis kvadrat komplekslar ko'pincha <strong>16 e⁻</strong> bilan barqaror bo'ladi.
                Misol: [PtCl₄]²⁻, [Ni(CN)₄]²⁻, [PdCl₄]²⁻.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">20+ elektronli komplekslar</h3>
              <p className="text-purple-200 text-sm">
                Katta ion radiusli metallar ko'proq ligand sig'diradi. 
                Misol: [Ni(C₅H₅)₂] — nikelosen, <strong>20 e⁻</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>18 e⁻ = <strong className="text-yellow-400">metall d-e⁻ + ligandlardan kelgan e⁻</strong></li>
            <li>Metall karbonillari va metallosenlar — <strong>deyarli har doim 18 e⁻</strong></li>
            <li>d⁸ tekis kvadrat komplekslar — <strong>16 e⁻ bilan barqaror</strong></li>
            <li>Qoida <strong>barqarorlikni bashorat qilishda</strong> yordam beradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MO diagrammasi</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Kimyoviy bog'lanish →</Link>
        </div>

      </section>
    </main>
  )
}