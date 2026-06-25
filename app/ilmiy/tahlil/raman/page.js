import Link from "next/link"

export default function RamanSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-sky-400">🔆 Raman spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Tebranish spektroskopiyasi • Simmetrik tebranishlar • Metall-ligand bog'lari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <Link 
          href="/ilmiy/tahlil/raman/birikmalar"
          className="group block bg-gradient-to-r from-sky-900/40 to-purple-900/40 border border-sky-700/50 rounded-2xl p-6 hover:bg-sky-900/60 hover:border-sky-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔆</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
                Birikmalarning Raman spektroskopik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning Raman spektrlari tahlili. Metall-ligand tebranishlari,
                simmetrik moddalar, suvli eritmalar va IQ bilan taqqoslash har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-sky-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-sky-600/20 text-sky-400 border border-sky-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">M-L tebranishlar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Simmetrik moddalar</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Suvli eritmalar</span>
          </div>
        </Link>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Raman spektroskopiya haqida</h2>
          <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-sky-400">Raman spektroskopiyasi</strong> — moddaning 
              <strong className="text-sky-400"> yorug'likni noelastik sochishi</strong>ga asoslangan 
              tebranish spektroskopiyasi usuli. IQ spektroskopiyadan farqli o'laroq, Raman 
              <strong className="text-sky-400"> simmetrik tebranishlarni, gomoyadro bog'larni (M−M, C−C) 
              va suvli eritmalardagi tebranishlarni</strong> aniqlashda ustunlikka ega. 
              Kompleks birikmalarda <strong className="text-sky-400">metall-ligand tebranishlari (100−600 sm⁻¹)</strong> 
              bevosita kuzatiladi.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Metall-ligand tebranishlari</strong> — ν(M−L), ν(M−O), ν(M−N)</li>
                <li>• <strong>Simmetrik tebranishlar</strong> — IQ da faol bo'lmagan moddalar</li>
                <li>• <strong>Gomoyadro bog'lar</strong> — M−M, C−C, S−S</li>
                <li>• <strong>Suvli eritmalar</strong> — suv kuchsiz Raman sochuvchi</li>
                <li>• <strong>Rezonans Raman</strong> — xromofor yaqinidagi tebranishlar kuchayadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-2">IQ dan farqi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Tanlash qoidasi:</strong> Raman — qutblanuvchanlik o'zgarishi, IQ — dipol moment o'zgarishi</li>
                <li>• <strong>Suv:</strong> IQ da kuchli yutilish, Raman da kuchsiz — suvli eritmalar uchun ideal</li>
                <li>• <strong>Simmetrik tebranishlar:</strong> IQ da faol emas, Raman da kuchli</li>
                <li>• <strong>Past chastotalar:</strong> Raman 50 sm⁻¹ gacha, IQ 400 sm⁻¹ gacha</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Komplekslar uchun xarakterli Raman chastotalari</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Tebranish turi</th>
                <th className="py-3 px-4 text-purple-300">Chastota diapazoni (sm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Xarakterli misol</th>
                <th className="py-3 px-4 text-purple-300">Raman intensivligi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["ν(M−O)", "200−600", "[Cu(H₂O)₆]²⁺: 440 sm⁻¹", "O'rtacha"],
                  ["ν(M−N)", "300−600", "[Co(NH₃)₆]³⁺: 500 sm⁻¹", "O'rtacha"],
                  ["ν(M−C)", "200−500", "[Fe(CN)₆]⁴⁻: 390 sm⁻¹", "Kuchli"],
                  ["ν(M−Cl)", "150−400", "[CoCl₄]²⁻: 300 sm⁻¹", "Kuchli"],
                  ["ν(C≡N)", "2000−2200", "K₃[Fe(CN)₆]: 2130 sm⁻¹", "Kuchli"],
                  ["ν(C≡O)", "1800−2100", "[Fe(CO)₅]: 2014 sm⁻¹", "Juda kuchli"],
                  ["ν(M−M)", "100−300", "[Re₂Cl₈]²⁻: 275 sm⁻¹", "Kuchli"],
                  ["ν(C−C) Cp halqasi", "1100−1450", "Ferrosen: 1105 sm⁻¹", "Kuchli"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-sky-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Rezonans Raman — xromofor komplekslar uchun</h2>
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-sky-400">Rezonans Raman effekti</strong> — qo'zg'atuvchi lazer to'lqin uzunligi 
            kompleksning elektron yutilishiga yaqin bo'lganda, xromofor bilan bog'liq tebranishlarning 
            <strong> intensivligi 10³−10⁵ marta kuchayadi</strong>. Bu metall-ligand zaryad ko'chishi 
            (MLCT/LMCT) o'tishlariga ega komplekslar uchun juda informativ.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
              <h3 className="text-sky-400 font-bold mb-2">Rezonans Raman qo'llanishi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• [Ru(bpy)₃]²⁺ — MLCT o'tish orqali bpy ligand tebranishlari</li>
                <li>• Metalloporfinlar — gem temir tebranishlari</li>
                <li>• [Fe(CN)₆]³⁻/⁴⁻ — zaryad ko'chishi o'tishlari</li>
                <li>• Karotinoid komplekslar — C=C tebranishlari</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-2">Afzalliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Faqat xromofor yaqinidagi tebranishlar kuzatiladi</li>
                <li>• Past konsentratsiyalarda (~10⁻⁶ M) ishlaydi</li>
                <li>• Murakkab biologik namunalarda selektiv</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Raman — IQ ni to'ldiruvchi <strong className="text-sky-400">tebranish spektroskopiyasi</strong></li>
            <li>Simmetrik tebranishlar va gomoyadro bog'lar <strong className="text-sky-400">faqat Raman da faol</strong></li>
            <li>Suvli eritmalar uchun <strong className="text-sky-400">IQ dan afzal</strong> — suv kuchsiz Raman sochuvchi</li>
            <li>Past chastotali metall-ligand tebranishlari <strong className="text-sky-400">50−600 sm⁻¹</strong> oralig'ida</li>
            <li>Rezonans Raman — <strong className="text-sky-400">xromofor komplekslar uchun</strong> yuqori sezgirlik</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← IQ spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-semibold">YaMR spektroskopiya →</Link>
        </div>

      </section>
    </main>
  )
}