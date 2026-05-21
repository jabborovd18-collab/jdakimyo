import Link from "next/link"

export default function Ikosaedrik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🟡 Ikosaedrik geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 12 • 20 ta uchburchak yuz • Eng yuqori simmetriyali ko'pyoq • Ih simmetriya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/ikosaedrik/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-yellow-500/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-yellow-800">KS=12 — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ikosaedr</strong> — 20 ta teng tomonli uchburchak yuz, 12 ta uch va 30 ta qirradan iborat eng yuqori simmetriyali ko'pyoq.
              KS = 12 uchun xarakterli bo'lib, <strong className="text-yellow-400">Ih simmetriya</strong> ga ega. Lantanoid va aktinoid komplekslarida kuzatiladi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 12</li>
                <li>• <strong>Simmetriya:</strong> Ih (eng yuqori)</li>
                <li>• <strong>Yuzlar:</strong> 20 ta teng tomonli uchburchak</li>
                <li>• <strong>Qirralar:</strong> 30 ta</li>
                <li>• <strong>Uchlar:</strong> 12 ta</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Platon jismlaridan biri</li>
                <li>• Bor原子 klasterlari (B₁₂)</li>
                <li>• Lantanoid komplekslari</li>
                <li>• Ce(NO₃)₆³⁻ — 12 ta O donor atom</li>
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
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-yellow-400">[Ce(NO₃)₆]³⁻</td><td className="py-3 px-4">geksanitratoserat(III)</td><td className="py-3 px-4 text-yellow-400">Ce³⁺</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-yellow-400">[Th(NO₃)₆]²⁻</td><td className="py-3 px-4">geksanitratotorat(IV)</td><td className="py-3 px-4 text-yellow-400">Th⁴⁺</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-yellow-400">[Pr(NO₃)₆]³⁻</td><td className="py-3 px-4">geksanitratoprazeodimat(III)</td><td className="py-3 px-4 text-yellow-400">Pr³⁺</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-purple-300 text-sm mt-4">
            Nitrat (NO₃⁻) — bidentat ligand sifatida 2 ta O orqali bog'lanadi. 6 ta NO₃⁻ × 2 = 12 ta donor atom.
          </p>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 12 — <strong className="text-yellow-400">Ikosaedrik geometriya</strong></li>
            <li>20 ta uchburchak yuz, <strong>Ih simmetriya</strong></li>
            <li>Asosan <strong>lantanoidlar</strong> uchun xarakterli</li>
            <li>Bidentat ligandlar orqali yuqori KS ga erishiladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/ikki-yoqli-antiprizma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ikki yoqli antiprizma</Link>
          <Link href="/oquv/fazoviy/sendvich" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Sendvich (Ferrosen) →</Link>
        </div>

      </section>
    </main>
  )
}