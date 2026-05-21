import Link from "next/link"

export default function MassSpektrometriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⚖️ Mass-spektrometriya</h1>
          <p className="text-purple-400 text-sm">Molekulyar massa aniqlash • Fragmentlanish • Izotop taqsimoti</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Mass-spektrometriya haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Mass-spektrometriya</strong> — moddalarning 
              <strong className="text-yellow-400"> molekulyar massasini</strong> va 
              <strong className="text-yellow-400"> tarkibini</strong> aniqlashda eng aniq usul.
              Kompleks birikmalarda <strong className="text-yellow-400">molekulyar ion</strong>, 
              <strong className="text-yellow-400"> fragmentlanish yo'llari</strong> va 
              <strong className="text-yellow-400"> izotop taqsimoti</strong> orqali tarkib tasdiqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Molekulyar massa</strong> (aniq qiymat)</li>
                <li>• <strong>Molekulyar formula</strong> (yuqori aniqlikda)</li>
                <li>• <strong>Izotop taqsimoti</strong> (qaysi metall borligi)</li>
                <li>• <strong>Fragmentlanish yo'llari</strong></li>
                <li>• <strong>Tarkibiy qismlar</strong> (ligandlar soni)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Namuna <strong>ionlashtiriladi</strong> (ESI, MALDI)</li>
                <li>• Ionlar <strong>mass/zaryad (m/z)</strong> bo'yicha ajratiladi</li>
                <li>• Detektorda <strong>ionlar soni</strong> qayd etiladi</li>
                <li>• Natijada <strong>mass-spektr</strong> hosil bo'ladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. IONLASHTIRISH USULLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Kompleks birikmalar uchun ionlashtirish usullari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">ESI (Elektrosprey ionlashtirish)</h3>
              <p className="text-purple-200 text-sm mb-2">
                <strong>Eng ko'p qo'llaniladi.</strong> Eritmadagi kompleks ionlari yumshoq ionlashtiriladi.
                Fragmentsiz molekulyar ion kuzatiladi.
              </p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Musbat rejim: [M]⁺, [M+Na]⁺, [M+K]⁺</li>
                <li>• Manfiy rejim: [M]⁻, [M−H]⁻</li>
                <li>• Ko'p zaryadli ionlar: [M+nH]ⁿ⁺</li>
              </ul>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">MALDI (Matritsa yordamida lazer desorbsiya/ionlashtirish)</h3>
              <p className="text-purple-200 text-sm">
                Katta molekulalar va barqaror komplekslar uchun. Matritsa yordamida ionlashtiriladi.
                Asosan [M+H]⁺ yoki [M−H]⁻ ionlari hosil bo'ladi.
              </p>
            </div>
          </div>
        </div>

        {/* 3. IZOTOP TAQSIMOTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Izotop taqsimoti — metallni aniqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Izotop taqsimoti</strong> — mass-spektrometriyaning eng kuchli tomoni.
            Har bir metall o'ziga xos izotop "barmoq izi" qoldiradi. Bu kompleks tarkibidagi metallni 
            <strong className="text-yellow-400"> shubhasiz aniqlash</strong> imkonini beradi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Asosiy izotop</th>
                <th className="py-3 px-4 text-purple-300">Izotoplar nisbati</th>
                <th className="py-3 px-4 text-purple-300">Spektr ko'rinishi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe", "⁵⁶Fe (91.7%)", "⁵⁴Fe:⁵⁶Fe:⁵⁷Fe:⁵⁸Fe = 5.8:91.7:2.2:0.3", "Asosiy pik 56"],
                  ["Cu", "⁶³Cu (69.2%)", "⁶³Cu:⁶⁵Cu = 69.2:30.8", "Ikkita pik (3:1)"],
                  ["Pt", "¹⁹⁵Pt (33.8%)", "¹⁹⁴:¹⁹⁵:¹⁹⁶:¹⁹⁸Pt", "Ko'p pikli murakkab"],
                  ["Co", "⁵⁹Co (100%)", "Faqat bitta izotop", "Yagona pik"],
                  ["Cl", "³⁵Cl (75.8%)", "³⁵Cl:³⁷Cl = 75.8:24.2", "Ikkita pik (3:1)"],
                  ["Br", "⁷⁹Br (50.7%)", "⁷⁹Br:⁸¹Br = 50.7:49.3", "Ikkita teng pik"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 ${j===0 ? "font-bold text-yellow-400" : ""} ${j===3 ? "text-purple-300 text-sm" : ""} ${j<3 ? "text-sm" : ""}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FRAGMENTLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💔 Kompleks birikmalarning fragmentlanishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Mass-spektrometriyada kompleks ionlar <strong className="text-yellow-400">ligandlarini ketma-ket yo'qotib</strong> 
            fragmentlanadi. Bu fragmentlanish yo'li kompleks tarkibini tasdiqlaydi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Misol: [Co(NH₃)₆]Cl₃ (ESI+, suvda)</h3>
            <div className="space-y-2 font-mono text-sm text-purple-200">
              <p>[Co(NH₃)₆]³⁺ → <span className="text-yellow-400">m/z = 53.7</span> (M³⁺)</p>
              <p>[Co(NH₃)₅Cl]²⁺ → <span className="text-yellow-400">m/z = 78.5</span> (Cl⁻ koordinatsiyalangan)</p>
              <p>[Co(NH₃)₄Cl₂]⁺ → <span className="text-yellow-400">m/z = 191.0</span></p>
            </div>
            <p className="text-purple-300 text-xs mt-3">
              Har bir fragment kompleks tarkibining bir qismini ko'rsatadi.
            </p>
          </div>
        </div>

        {/* 5. YUQORI ANIQLIKDAGI MASS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Yuqori aniqlikdagi mass-spektrometriya (HRMS)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">HRMS</strong> (High Resolution Mass Spectrometry) yordamida 
            molekulyar massa <strong>4-5 xona aniqlikda</strong> o'lchanadi. Bu molekulyar formulani 
            <strong className="text-yellow-400"> bevosita hisoblash</strong> imkonini beradi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Misol:</h3>
            <p className="text-purple-200 text-sm">
              [Fe(CN)₆]³⁻ uchun <strong>nazariy massa:</strong> 211.9392 Da<br/>
              HRMS o'lchagan: 211.9390 Da → <strong>Δ = 0.0002 Da (0.9 ppm)</strong><br/>
              Bu molekulyar formulani to'liq tasdiqlaydi.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Mass-spektrometriya — <strong className="text-yellow-400">molekulyar massani eng aniq o'lchash</strong> usuli</li>
            <li>Izotop taqsimoti — <strong>metallni shubhasiz aniqlash</strong></li>
            <li>Fragmentlanish — <strong>tarkibni tasdiqlash</strong></li>
            <li>HRMS — <strong>molekulyar formulani bevosita hisoblash</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Rentgen difraksiyasi</Link>
          <Link href="/ilmiy/tahlil/magnit" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Magnit o'lchashlar →</Link>
        </div>

      </section>
    </main>
  )
}