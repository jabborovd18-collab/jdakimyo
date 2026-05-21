import Link from "next/link"

export default function MonoyopiqPrizma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🏠 Monoyopiq trigonal prizma</h1>
          <p className="text-purple-400 text-sm">KS = 7 • sp³d³ gibridlanish • Simmetriya: C₂v • Yopiq prizma</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/monoyopiq-prizma/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-green-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-green-200">[NbF₇]²⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Monoyopiq trigonal prizma</strong> — trigonal prizmaning 
              to'rtburchak yuzlaridan birining ustida qo'shimcha 7-ligand joylashgan. 6 ta ligand prizma uchlarida, 
              1 ta ligand prizma yuzi ustida. KS = 7 uchun pentagonal bipiramida bilan raqobatlashadi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 7</li><li>• <strong>Gibridlanish:</strong> sp³d³</li>
                <li>• <strong>Simmetriya:</strong> C₂v (past)</li>
                <li>• <strong>Strukturasi:</strong> Prizma + yuz ustida ligand</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Monoyopiq ligand prizma yuzidan uzoqroqda</li>
                <li>• d⁰ konfiguratsiya uchun qulay</li>
                <li>• Kichik ligandlar (F⁻) bilan barqaror</li>
                <li>• Katta ion radiusli metallar uchun</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Davr</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-green-400">[NbF₇]²⁻</td><td className="py-3 px-4">geptaftoroniobat(V)</td><td className="py-3 px-4 text-yellow-400">Nb⁵⁺ (d⁰)</td><td className="py-3 px-4">5d</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-green-400">[TaF₇]²⁻</td><td className="py-3 px-4">geptaftorotantalat(V)</td><td className="py-3 px-4 text-yellow-400">Ta⁵⁺ (d⁰)</td><td className="py-3 px-4">5d</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-green-400">[MoF₇]⁻</td><td className="py-3 px-4">geptaftoromolibdat(VI)</td><td className="py-3 px-4 text-yellow-400">Mo⁶⁺ (d⁰)</td><td className="py-3 px-4">4d</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 7, <strong className="text-yellow-400">sp³d³ gibridlanish</strong></li>
            <li>Trigonal prizmaning bir yuzi ustida <strong>qo'shimcha ligand</strong></li>
            <li>Asosan <strong>d⁰ konfiguratsiyali</strong> metallar</li>
            <li>Muhim misol: <strong>[NbF₇]²⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/pentagonal-bipiramida" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Pentagonal bipiramida</Link>
          <Link href="/oquv/fazoviy/kubsimon" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Kubsimon →</Link>
        </div>

      </section>
    </main>
  )
}