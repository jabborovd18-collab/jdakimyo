import Link from "next/link"

export default function TrigonalPrizma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔶 Trigonal prizma geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 6 • sd⁵ gibridlanish • Simmetriya: D₃h • Kam uchraydigan oktaedr alternativi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/fazoviy/trigonal-prizma/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-yellow-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-yellow-200">[ZrMe₆]²⁻ — interaktiv</div></div>
          </Link>
        </div>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Trigonal prizma</strong> — markaziy atom prizma ichida, 
              6 ta ligand prizmaning 6 ta uchida joylashgan komplekslardir. Ikkita parallel uchburchak yuz 
              bir-biriga mos tushadi (torsion burchak = 0°). KS = 6 uchun <strong className="text-yellow-400">oktaedrdan keyingi</strong> eng muhim alternativ shakl.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 6</li>
                <li>• <strong>Gibridlanish:</strong> sd⁵ (juda kam uchraydi)</li>
                <li>• <strong>Simmetriya:</strong> D₃h</li>
                <li>• <strong>Shakl:</strong> 2 ta parallel uchburchak + 3 ta to'rtburchak yuz</li>
                <li>• <strong>Torsion burchak:</strong> 0° (uchburchaklar mos tushadi)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + barcha 5 ta d orbital → <strong className="text-yellow-400">6 ta sd⁵ gibrid orbital</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Juda kam uchraydigan gibridlanish turi. Faqat d⁰ konfiguratsiyada barqaror.</p>
            </div>
          </div>
        </div>

        {/* 2. OKTAEDR BILAN TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Trigonal prizma vs Oktaedr</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Ikkala shakl ham KS = 6 ga ega, lekin ligandlarning joylashishi bilan farq qiladi.
            Oktaedrik geometriya energetik jihatdan qulayroq bo'lgani sababli, trigonal prizmatik komplekslar juda kam uchraydi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th><th className="py-3 px-4 text-purple-300 text-purple-400">Trigonal prizma</th><th className="py-3 px-4 text-purple-300 text-purple-400">Oktaedr</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Simmetriya</td><td className="py-3 px-4 text-yellow-400">D₃h</td><td className="py-3 px-4 text-purple-400">Oh</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Yuzlar</td><td className="py-3 px-4">2 ta uchburchak + 3 ta to'rtburchak</td><td className="py-3 px-4">8 ta uchburchak</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Gibridlanish</td><td className="py-3 px-4 text-yellow-400">sd⁵</td><td className="py-3 px-4 text-purple-400">d²sp³ / sp³d²</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Energiya</td><td className="py-3 px-4 text-red-400">Yuqoriroq</td><td className="py-3 px-4 text-green-400">Past (barqarorroq)</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Tarqalishi</td><td className="py-3 px-4 text-red-400">Juda kam</td><td className="py-3 px-4 text-green-400">Eng ko'p</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. XARAKTERLI IONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Trigonal prizmatik komplekslar asosan <strong className="text-yellow-400">d⁰ yoki d¹ konfiguratsiyali</strong> erta o'tish metallari uchun xarakterlidir.
            d⁰ konfiguratsiyada d-orbitallar bo'sh bo'lgani uchun ligand itarilish kuchlari minimallashgan.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Xususiyati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-yellow-400">[ZrMe₆]²⁻</td>
                  <td className="py-3 px-4">geksametilsirkonat(IV)</td>
                  <td className="py-3 px-4 text-yellow-400">Zr⁴⁺ (d⁰)</td>
                  <td className="py-3 px-4 text-sm">5.5-jadvaldan klassik misol</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-yellow-400">[Re(S₂C₂Ph₂)₃]</td>
                  <td className="py-3 px-4">tris(ditiolen)reniy</td>
                  <td className="py-3 px-4 text-yellow-400">Re (d¹)</td>
                  <td className="py-3 px-4 text-sm">Ditiolen ligandli kompleks</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-3 px-4 font-mono text-yellow-400">[Mo(S₂C₂H₂)₃]</td>
                  <td className="py-3 px-4">tris(ditiolen)molibden</td>
                  <td className="py-3 px-4 text-yellow-400">Mo (d⁰)</td>
                  <td className="py-3 px-4 text-sm">Molibden ditiolen kompleksi</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. BEYL TWIST */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Beyl twist mexanizmi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Trigonal prizma va oktaedr orasidagi o'tish <strong className="text-yellow-400">Beyl twist</strong> (Bailar twisting) mexanizmi orqali amalga oshadi.
            Bu koordinatsion birikmalarda ligand almashinish mexanizmlaridan biridir.
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <p className="text-yellow-300 font-bold">Trigonal prizma ⇄ Oktaedr</p>
            <p className="text-purple-300 text-sm mt-2">Beyl twist orqali — uchburchak yuzlar bir-biriga nisbatan buriladi</p>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Trigonal prizma — <strong className="text-yellow-400">KS = 6, sd⁵ gibridlanish</strong></li>
            <li><strong>Juda kam uchraydigan</strong> geometriya</li>
            <li>Asosan <strong>d⁰ yoki d¹ konfiguratsiyali</strong> metallar uchun</li>
            <li>Oktaedrdan farqi: <strong>D₃h simmetriya</strong>, parallel uchburchak yuzlar</li>
            <li>Oktaedr bilan <strong>Beyl twist</strong> orqali o'zaro bog'langan</li>
            <li>Muhim misol: <strong>[ZrMe₆]²⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/oktaedrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Oktaedrik</Link>
          <Link href="/oquv/fazoviy/pentagonal-bipiramida" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Pentagonal bipiramida →</Link>
        </div>

      </section>
    </main>
  )
}