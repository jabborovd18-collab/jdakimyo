import Link from "next/link"

export default function TrigonalBipiramida() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔷 Trigonal bipiramida</h1>
          <p className="text-purple-400 text-sm">KS = 5 • sp³d gibridlanish • 90° va 120° • Simmetriya: D₃h</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/tigonal-bipiramida/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-orange-200">[Fe(CO)₅] • interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 5</li>
                <li>• <strong>Gibridlanish:</strong> sp³d</li>
                <li>• <strong>Valent burchaklar:</strong> 90° (aksial-ekv), 120° (ekv-ekv)</li>
                <li>• <strong>Simmetriya:</strong> D₃h</li>
                <li>• <strong>Ligandlar:</strong> 3 ekvatorial + 2 aksial</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + p<sub>x</sub> + p<sub>y</sub> + p<sub>z</sub> + d<sub>z²</sub> → <strong className="text-yellow-400">5 ta sp³d gibrid orbital</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">3 tasi ekvatorial (120°), 2 tasi aksial (90°)</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Xususiyati</th></tr></thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[Fe(CO)₅]", n: "pentakarboniltemir(0)", ion: "Fe⁰ (d⁸)", x: "Sariq suyuqlik, zaharli" },
                  { f: "[Ni(CN)₅]³⁻", n: "pentasiyanonikkolat(II)", ion: "Ni²⁺ (d⁸)", x: "TBP yoki kvadrat piramida" },
                  { f: "[CuCl₅]³⁻", n: "pentaxlorokuprat(II)", ion: "Cu²⁺ (d⁹)", x: "Yan-Teller buzilishi" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-orange-400">{m.f}</td><td className="py-3 px-4">{m.n}</td><td className="py-3 px-4 text-yellow-400">{m.ion}</td><td className="py-3 px-4 text-sm">{m.x}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Berri psevdorotasiyasi</h2>
          <p className="text-purple-200 mb-4 leading-relaxed">
            KS = 5 komplekslarda <strong className="text-yellow-400">trigonal bipiramida</strong> va <strong className="text-yellow-400">kvadrat piramida</strong> shakllari orasidagi energetik farq juda kichik (~5-10 kJ/mol).
            Bu ikki shakl <strong className="text-yellow-400">Berri psevdorotasiyasi</strong> orqali bir-biriga aylanib turadi.
          </p>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4 text-center">
            <p className="text-yellow-300 font-bold">Trigonal bipiramida ⇄ Kvadrat piramida</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 5, <strong className="text-yellow-400">sp³d gibridlanish</strong></li>
            <li><strong>Ikki xil burchak:</strong> 90° va 120°</li>
            <li>3 ta ekvatorial + 2 ta aksial ligand</li>
            <li>Kvadrat piramida bilan <strong>Berri psevdorotasiyasi</strong></li>
            <li>Eng mashhur: <strong>[Fe(CO)₅]</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/tekis-kvadrat" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Tekis kvadrat</Link>
          <Link href="/oquv/fazoviy/kvadrat-piramida" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Kvadrat piramida →</Link>
        </div>

      </section>
    </main>
  )
}