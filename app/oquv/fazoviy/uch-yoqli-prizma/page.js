import Link from "next/link"

export default function UchYoqliPrizma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">📐 Uch yoqli trigonal prizma</h1>
          <p className="text-purple-400 text-sm">KS = 9 • sp³d⁵ gibridlanish • Prizmaning uchta yuzi yopilgan</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/uch-yoqli-prizma/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-orange-200">[ReH₉]²⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Uch yoqli trigonal prizma</strong> — KS = 9 bo'lgan komplekslar uchun xarakterli geometriya.
              Trigonal prizmaning <strong className="text-yellow-400">uchta to'rtburchak yuzi</strong> ustida qo'shimcha ligandlar joylashgan.
              Juda kam uchraydigan geometriya.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 9</li><li>• <strong>Gibridlanish:</strong> sp³d⁵</li>
                <li>• <strong>Strukturasi:</strong> Prizma + 3 ta yuz ustida ligand</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• [ReH₉]²⁻ — eng mashhur misol</li>
                <li>• KS=9 juda kam uchraydi</li>
                <li>• Katta ion radiusli metallar uchun</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">KS</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-orange-400">[ReH₉]²⁻</td><td className="py-3 px-4">nonagidridorenat(VII)</td><td className="py-3 px-4 text-yellow-400">Re⁷⁺</td><td className="py-3 px-4">9</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-orange-400">[TcH₉]²⁻</td><td className="py-3 px-4">nonagidridotexnetsiyat(VII)</td><td className="py-3 px-4 text-yellow-400">Tc⁷⁺</td><td className="py-3 px-4">9</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 9, <strong className="text-yellow-400">sp³d⁵ gibridlanish</strong></li>
            <li>Trigonal prizmaning <strong>uchta yuzi yopilgan</strong></li>
            <li>Juda kam uchraydigan geometriya</li>
            <li>Eng mashhur misol: <strong>[ReH₉]²⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/kvadrat-antiprizma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kvadrat antiprizma</Link>
          <Link href="/oquv/fazoviy/ikki-yoqli-antiprizma" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Ikki yoqli antiprizma →</Link>
        </div>

      </section>
    </main>
  )
}