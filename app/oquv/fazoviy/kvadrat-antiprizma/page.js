import Link from "next/link"

export default function KvadratAntiprizma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🟦 Kvadrat antiprizma</h1>
          <p className="text-purple-400 text-sm">KS = 8 • sp³d⁴ gibridlanish • Simmetriya: D₄d • Ikkita parallel kvadrat</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/kvadrat-antiprizma/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-purple-200">[Mo(CN)₈]⁴⁻ — antiprizma</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kvadrat antiprizma</strong> — KS = 8 uchun ikkinchi eng ko'p tarqalgan geometriya.
              Ikkita parallel kvadrat bir-biriga nisbatan <strong className="text-yellow-400">45° ga burilgan</strong>. 
              Kubsimon va dodekaedrik orasidagi oraliq shakl.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 8</li><li>• <strong>Gibridlanish:</strong> sp³d⁴</li>
                <li>• <strong>Simmetriya:</strong> D₄d</li>
                <li>• <strong>Strukturasi:</strong> Ikkita parallel kvadrat (45° burilgan)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Dodekaedrik bilan bir xil gibridlanish (sp³d⁴)</li>
                <li>• Dodekaedrikdan yuqoriroq simmetriya</li>
                <li>• Ba'zi komplekslar ikkala shaklda ham mavjud</li>
                <li>• [Mo(CN)₈]⁴⁻ — ikkala geometriyada uchraydi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-purple-400">[Mo(CN)₈]⁴⁻</td><td className="py-3 px-4">oktasiyanomolibdat(IV)</td><td className="py-3 px-4 text-yellow-400">Mo⁴⁺ (d²)</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-purple-400">[TaF₈]³⁻</td><td className="py-3 px-4">oktaftorotantalat(III)</td><td className="py-3 px-4 text-yellow-400">Ta³⁺</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 8, <strong className="text-yellow-400">sp³d⁴ gibridlanish</strong></li>
            <li>Ikkita parallel kvadrat — biri <strong>45° ga burilgan</strong></li>
            <li>Dodekaedrik bilan bir xil gibridlanish, lekin <strong>yuqoriroq simmetriya</strong></li>
            <li>Muhim misol: <strong>[Mo(CN)₈]⁴⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/dodekaedrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Dodekaedrik</Link>
          <Link href="/oquv/fazoviy/uch-yoqli-prizma" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Uch yoqli prizma →</Link>
        </div>

      </section>
    </main>
  )
}