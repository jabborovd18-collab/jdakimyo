import Link from "next/link"

export default function Dodekaedrik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⬡ Dodekaedrik geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 8 • sp³d⁴ gibridlanish • Simmetriya: D₂d • KS=8 uchun eng barqaror</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/dodekaedrik/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-pink-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-pink-200">[Mo(CN)₈]⁴⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Dodekaedrik komplekslar</strong> — KS = 8 uchun eng barqaror va eng ko'p tarqalgan geometriya.
              Dodekaedr 12 ta uchburchak yuzli ko'pyoq. Kubsimon geometriyadan farqli ravishda, ligandlar orasidagi itarilish kuchlari minimallashgan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 8</li><li>• <strong>Gibridlanish:</strong> sp³d⁴</li>
                <li>• <strong>Simmetriya:</strong> D₂d</li><li>• <strong>Shakl:</strong> 12 ta uchburchak yuzli dodekaedr</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200">s + 3p + 4d → <strong className="text-yellow-400">8 ta sp³d⁴</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Kubsimondan farqli — f orbital ishtirok etmaydi, energetik qulayroq</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Davr</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-pink-400">[Mo(CN)₈]⁴⁻</td><td className="py-3 px-4">oktasiyanomolibdat(IV)</td><td className="py-3 px-4 text-yellow-400">Mo⁴⁺ (d²)</td><td className="py-3 px-4">4d</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-pink-400">[W(CN)₈]⁴⁻</td><td className="py-3 px-4">oktasiyanovolframat(IV)</td><td className="py-3 px-4 text-yellow-400">W⁴⁺ (d²)</td><td className="py-3 px-4">5d</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-pink-400">[Re(CN)₈]³⁻</td><td className="py-3 px-4">oktasiyanorenat(V)</td><td className="py-3 px-4 text-yellow-400">Re⁵⁺ (d²)</td><td className="py-3 px-4">5d</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 KS = 8 geometriyalari taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Shakl</th><th className="py-3 px-4 text-purple-300">Gibridlanish</th><th className="py-3 px-4 text-purple-300">Simmetriya</th><th className="py-3 px-4 text-purple-300">Barqarorlik</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Kubsimon</td><td className="py-3 px-4">sp³d³f</td><td className="py-3 px-4">Oh</td><td className="py-3 px-4 text-red-400">Past</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Kvadrat antiprizma</td><td className="py-3 px-4">sp³d⁴</td><td className="py-3 px-4">D₄d</td><td className="py-3 px-4 text-yellow-400">O'rtacha</td></tr>
                <tr><td className="py-3 px-4 font-bold">Dodekaedrik</td><td className="py-3 px-4">sp³d⁴</td><td className="py-3 px-4">D₂d</td><td className="py-3 px-4 text-green-400">Eng yuqori</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 8, <strong className="text-yellow-400">sp³d⁴ gibridlanish</strong></li>
            <li>KS = 8 uchun <strong>eng barqaror</strong> geometriya</li>
            <li>Asosan <strong>4d va 5d elementlari</strong> (Mo, W, Re)</li>
            <li>Muhim misol: <strong>[Mo(CN)₈]⁴⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/kubsimon" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kubsimon</Link>
          <Link href="/oquv/fazoviy/kvadrat-antiprizma" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Kvadrat antiprizma →</Link>
        </div>

      </section>
    </main>
  )
}