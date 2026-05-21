import Link from "next/link"

export default function PentagonalBipiramida() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">⬠ Pentagonal bipiramida</h1>
          <p className="text-purple-400 text-sm">KS = 7 • sp³d³ gibridlanish • 72° va 90° • Simmetriya: D₅h</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/pentagonal-bipiramida/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-blue-200">[V(CN)₇]⁴⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Pentagonal bipiramida</strong> — markaziy atom atrofida 7 ta ligand joylashgan. 
              5 ta ligand <strong>ekvatorial tekislikda</strong> (muntazam beshburchak, 72°), 2 ta ligand <strong>aksial o'qda</strong> (90°).
              KS = 7 nisbatan kam uchraydi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 7</li><li>• <strong>Gibridlanish:</strong> sp³d³</li>
                <li>• <strong>Burchaklar:</strong> 72° (ekv), 90° (aksial-ekv)</li>
                <li>• <strong>Simmetriya:</strong> D₅h</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200">s + 3p + 3d → <strong className="text-yellow-400">7 ta sp³d³</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">5 tasi ekvatorial (72°), 2 tasi aksial (90°)</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Ion radiusi</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-blue-400">[V(CN)₇]⁴⁻</td><td className="py-3 px-4">geptasiyanovanadat(III)</td><td className="py-3 px-4 text-yellow-400">V³⁺ (3d)</td><td className="py-3 px-4">Kichik</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-blue-400">[ZrF₇]³⁻</td><td className="py-3 px-4">geptaftorosirkonat(IV)</td><td className="py-3 px-4 text-yellow-400">Zr⁴⁺ (4d⁰)</td><td className="py-3 px-4">Katta</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-blue-400">[UF₇]³⁻</td><td className="py-3 px-4">geptaftorouranat(IV)</td><td className="py-3 px-4 text-yellow-400">U⁴⁺ (5f²)</td><td className="py-3 px-4">Juda katta</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 KS = 7 uchun alternativ shakllar</h2>
          <div className="space-y-3">
            {[["Pentagonal bipiramida","D₅h","5 ekv + 2 aksial"],["Monoyopiq trigonal prizma","C₂v","Prizma yuzi ustida qo'shimcha ligand"],["Monoyopiq oktaedr","C₃v","Oktaedr yuzi ustida qo'shimcha ligand"]].map((r,i)=>(
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex justify-between items-center">
                <span className="text-yellow-400 font-bold">{r[0]}</span>
                <span className="text-purple-300 text-sm">{r[1]}</span>
                <span className="text-purple-400 text-xs">{r[2]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 7, <strong className="text-yellow-400">sp³d³ gibridlanish</strong></li>
            <li>Burchaklar: <strong>72°</strong> (ekv) va <strong>90°</strong> (aksial)</li>
            <li>Asosan <strong>katta ion radiusli</strong> metallar uchun</li>
            <li>Muhim misol: <strong>[V(CN)₇]⁴⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/trigonal-prizma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Trigonal prizma</Link>
          <Link href="/oquv/fazoviy/monoyopiq-prizma" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Monoyopiq prizma →</Link>
        </div>

      </section>
    </main>
  )
}