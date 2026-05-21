import Link from "next/link"

export default function AnionKomplekslar() {
  const misollar = [
    {
      formula: "K₄[Fe(CN)₆]",
      nomi: "kaliy geksasiyanoferrat(II)",
      ichki: "[Fe(CN)₆]⁴⁻",
      tashqi: "4K⁺",
      zaryad: "-4",
      metallNomi: "ferrat",
      izoh: "Sariq qon tuzi. Oziq-ovqat qo'shimchasi E536. Berlin ko'ki olishda."
    },
    {
      formula: "K₃[Fe(CN)₆]",
      nomi: "kaliy geksasiyanoferrat(III)",
      ichki: "[Fe(CN)₆]³⁻",
      tashqi: "3K⁺",
      zaryad: "-3",
      metallNomi: "ferrat",
      izoh: "Qizil qon tuzi. Fe²⁺ ni aniqlashda. Turnbul ko'ki olishda."
    },
    {
      formula: "Li[AlH₄]",
      nomi: "litiy tetragidroalyuminat(III)",
      ichki: "[AlH₄]⁻",
      tashqi: "Li⁺",
      zaryad: "-1",
      metallNomi: "alyuminat",
      izoh: "Kuchli qaytaruvchi. Organik sintezda muhim reagent."
    },
    {
      formula: "Na[Al(OH)₄]",
      nomi: "natriy tetragidroksoalyuminat",
      ichki: "[Al(OH)₄]⁻",
      tashqi: "Na⁺",
      zaryad: "-1",
      metallNomi: "alyuminat",
      izoh: "Bayer usulida alyuminiy olish. Gidroksokompleks."
    },
    {
      formula: "K₂[CuCl₄]",
      nomi: "kaliy tetraxlorokuprat(II)",
      ichki: "[CuCl₄]²⁻",
      tashqi: "2K⁺",
      zaryad: "-2",
      metallNomi: "kuprat",
      izoh: "Sariq-yashil rangli. Tetraedrik geometriya."
    },
    {
      formula: "K[Ag(CN)₂]",
      nomi: "kaliy disianoargentat(I)",
      ichki: "[Ag(CN)₂]⁻",
      tashqi: "K⁺",
      zaryad: "-1",
      metallNomi: "argentat",
      izoh: "Kumush qoplashda ishlatiladi. Chiziqli geometriya."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/zaryad" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">➖ Anion komplekslar</h1>
          <p className="text-purple-400 text-sm">Ichki sfera manfiy zaryadli • Tashqi sferada kationlar • &quot;at&quot; qo&apos;shimchasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Anion komplekslar haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Anion komplekslar</strong> — ichki sferaning umumiy zaryadi 
              <strong className="text-yellow-400"> manfiy</strong> bo'lgan komplekslardir. 
              Tashqi sferada kationlar (K⁺, Na⁺, Li⁺ va h.k.) bo'ladi.
              Markaziy atom nomiga <strong className="text-yellow-400">&quot;at&quot; qo&apos;shimchasi</strong> qo&apos;shiladi.
              Lotincha nom ildizi + &quot;at&quot; = anion kompleks nomi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ichki sfera zaryadi: <strong className="text-red-400">-1, -2, -3, -4</strong></li>
                <li>• Tashqi sfera: kationlar</li>
                <li>• Nomlashda &quot;at&quot; qo&apos;shiladi</li>
                <li>• Suvda dissotsilanadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Metall nomlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Fe → <strong className="text-red-400">ferrat</strong></li>
                <li>• Cu → <strong className="text-red-400">kuprat</strong></li>
                <li>• Ag → <strong className="text-red-400">argentat</strong></li>
                <li>• Al → <strong className="text-red-400">alyuminat</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim anion komplekslar</h2>
          
          <div className="space-y-6">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 hover:border-red-400/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono">{m.formula}</h3>
                  <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    Z = {m.zaryad}
                  </span>
                </div>
                <p className="text-purple-200 font-semibold mb-3">{m.nomi}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div className="text-purple-300">
                    <span className="text-purple-400">Ichki:</span> <strong className="text-red-400">{m.ichki}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Tashqi:</span> <strong className="text-yellow-400">{m.tashqi}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Metall:</span> <strong className="text-red-400">{m.metallNomi}</strong>
                  </div>
                </div>
                <p className="text-purple-400 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DISSOTSILANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Dissotsilanish reaksiyalari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                K₄[Fe(CN)₆] → 4K⁺ + <strong className="text-red-400">[Fe(CN)₆]⁴⁻</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                Na[Al(OH)₄] → Na⁺ + <strong className="text-red-400">[Al(OH)₄]⁻</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                K[Ag(CN)₂] → K⁺ + <strong className="text-red-400">[Ag(CN)₂]⁻</strong>
              </p>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Muhim:</strong> Anion komplekslarda ham ichki sfera mustahkam bog'langan. 
              Faqat tashqi sfera kationlari ajraladi.
            </p>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Anion komplekslar — <strong className="text-yellow-400">ichki sfera manfiy zaryadli</strong></li>
            <li>Tashqi sferada <strong>kationlar</strong> joylashgan</li>
            <li>Markaziy atom nomiga <strong>&quot;at&quot; qo&apos;shimchasi</strong> qo&apos;shiladi</li>
            <li>Lotincha nom ildizi ishlatiladi: Fe → ferrat, Cu → kuprat</li>
            <li>Eng barqaror anion komplekslar — sianidli komplekslar</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad/kation" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Kation komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad/neytral" 
            className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 transition-all text-white font-semibold"
          >
            Keyingi: Neytral komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}