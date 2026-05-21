import Link from "next/link"

export default function IkkiYoqliAntiprizma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔷 Ikki yoqli kvadrat antiprizma</h1>
          <p className="text-purple-400 text-sm">KS = 10 • Ikkala kvadrat yuzi ham yopilgan antiprizma • Juda kam uchraydi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/ikki-yoqli-antiprizma/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-red-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-red-200">KS=10 — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ikki yoqli kvadrat antiprizma</strong> — KS = 10 uchun xarakterli geometriya.
              Kvadrat antiprizmaning <strong className="text-yellow-400">ikkala kvadrat yuzi</strong> ham qo'shimcha ligandlar bilan yopilgan.
              KS ≥ 9 bo'lgan komplekslar juda kam uchraydi va asosan lantanoid/aktinoidlar uchun xarakterli.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 10</li>
                <li>• <strong>Strukturasi:</strong> Antiprizma + 2 ta yopiq yuza</li>
                <li>• <strong>Ligandlar:</strong> 8 ta antiprizma uchlarida + 2 ta yuzlarda</li>
                <li>• <strong>Tarqalishi:</strong> Juda kam</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• KS = 10 — juda kam uchraydi</li>
                <li>• Katta ion radiusli metallar (4d, 5d, f)</li>
                <li>• Lantanoid va aktinoid komplekslari</li>
                <li>• Ko'pincha aralash ligandli</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 KS va geometriya rivojlanishi</h2>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="space-y-2 text-purple-200 text-sm">
              <p>KS = 2 → <strong className="text-blue-400">Chiziqli</strong></p>
              <p>KS = 4 → <strong className="text-cyan-400">Tetraedrik / Tekis kvadrat</strong></p>
              <p>KS = 5 → <strong className="text-orange-400">Trigonal bipiramida / Kvadrat piramida</strong></p>
              <p>KS = 6 → <strong className="text-purple-400">Oktaedrik / Trigonal prizma</strong></p>
              <p>KS = 7 → <strong className="text-blue-400">Pentagonal bipiramida / Monoyopiq prizma</strong></p>
              <p>KS = 8 → <strong className="text-pink-400">Kubsimon / Dodekaedrik / Kvadrat antiprizma</strong></p>
              <p>KS = 9 → <strong className="text-orange-400">Uch yoqli prizma</strong></p>
              <p>KS = 10 → <strong className="text-red-400">Ikki yoqli antiprizma</strong></p>
              <p>KS = 12 → <strong className="text-yellow-400">Ikosaedrik</strong></p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 10 — <strong className="text-yellow-400">juda kam uchraydigan</strong> koordinatsion son</li>
            <li>Kvadrat antiprizmaning <strong>ikkala kvadrat yuzi yopilgan</strong></li>
            <li>Asosan <strong>lantanoid va aktinoidlar</strong> uchun xarakterli</li>
            <li>KS ortgan sari ligandlar orasidagi itarilish kuchayadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/uch-yoqli-prizma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Uch yoqli prizma</Link>
          <Link href="/oquv/fazoviy/ikosaedrik" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Ikosaedrik →</Link>
        </div>

      </section>
    </main>
  )
}