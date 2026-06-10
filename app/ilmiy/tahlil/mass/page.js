import Link from "next/link"

export default function MassSpektrometriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⚖️ Mass-spektrometriya</h1>
          <p className="text-purple-400 text-sm">Molekulyar massa aniqlash • Fragmentlanish • Izotop taqsimoti • HRMS</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR MASS TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/mass/birikmalar"
          className="group block bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-2xl p-6 hover:bg-pink-900/60 hover:border-pink-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-pink-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔍</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">
                Birikmalarning mass-spektr tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning mass-spektrlari tahlili. Molekulyar ion, fragmentlanish yo'llari, 
                izotopik taqsimot va HRMS ma'lumotlari har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-pink-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Izotopik taqsimot</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Fragmentlanish</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">HRMS</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Molekulyar ion</span>
          </div>
        </Link>

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
              Zamonaviy yuqori aniqlikdagi mass-spektrometriya (HRMS) molekulyar formulani 
              <strong className="text-yellow-400"> 0.1 ppm aniqlikda</strong> tasdiqlash imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Molekulyar massa</strong> — aniq qiymat (4−5 xona aniqlikda)</li>
                <li>• <strong>Molekulyar formula</strong> — HRMS orqali bevosita</li>
                <li>• <strong>Izotop taqsimoti</strong> — qaysi metall borligi (Fe, Cu, Pt, Ag...)</li>
                <li>• <strong>Fragmentlanish yo'llari</strong> — ligandlar ketma-ketligi</li>
                <li>• <strong>Zaryad holati</strong> — ko'p zaryadli ionlar (ESI)</li>
                <li>• <strong>Qo'shimcha adduktlar</strong> — [M+Na]⁺, [M+K]⁺, [M+NH₄]⁺</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Namuna <strong>ionlashtiriladi</strong> (ESI, MALDI, EI)</li>
                <li>• Ionlar <strong>mass/zaryad (m/z)</strong> bo'yicha ajratiladi</li>
                <li>• Mass-analizator: <strong>kvadrupol, TOF, Orbitrap</strong></li>
                <li>• Detektorda <strong>ionlar soni</strong> qayd etiladi</li>
                <li>• Natijada <strong>mass-spektr</strong> — m/z vs nisbiy intensivlik</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. IONLASHTIRISH USULLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Kompleks birikmalar uchun ionlashtirish usullari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">ESI (Elektrosprey ionlashtirish) — ENG KO'P QO'LLANILADI</h3>
              <p className="text-purple-200 text-sm mb-2">
                Eritmadagi kompleks ionlari <strong>yumshoq</strong> ionlashtiriladi — fragmentlanish deyarli yo'q.
                Molekulyar ion to'liq saqlanadi. Ko'p zaryadli ionlar hosil bo'lishi mumkin.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-green-400 font-bold mb-1">Musbat rejim (ESI+)</p>
                  <p className="text-purple-300">[M]⁺, [M+H]⁺, [M+Na]⁺, [M+K]⁺, [M+NH₄]⁺</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-blue-400 font-bold mb-1">Manfiy rejim (ESI−)</p>
                  <p className="text-purple-300">[M]⁻, [M−H]⁻, [M+Cl]⁻, [M+HCOO]⁻</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">MALDI — katta va barqaror komplekslar uchun</h3>
              <p className="text-purple-200 text-sm">
                Matritsa yordamida lazer desorbsiya/ionlashtirish. Asosan [M+H]⁺ yoki [M−H]⁻.
                Metall klasterlar, ko'p yadroli komplekslar uchun qulay.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">EI (Elektron zarbasi) — uchuvchan komplekslar uchun</h3>
              <p className="text-purple-200 text-sm">
                70 eV energiyali elektronlar bilan ionlashtirish. Kuchli fragmentlanish — tarkibiy ma'lumot ko'p.
                [Fe(CO)₅], [Ni(CO)₄] kabi neytral karbonillar uchun qo'llaniladi.
              </p>
            </div>
          </div>
        </div>

        {/* 3. IZOTOP TAQSIMOTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Izotop taqsimoti — metallni "barmoq izi" orqali aniqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Izotop taqsimoti</strong> — mass-spektrometriyaning 
            eng kuchli diagnostik vositasi. Har bir element o'ziga xos izotoplar nisbatiga ega.
            Bu <strong className="text-yellow-400">"barmoq izi"</strong> kompleks tarkibidagi metallni 
            <strong className="text-yellow-400"> shubhasiz aniqlash</strong> imkonini beradi.
            Ayniqsa, Fe, Cu, Zn, Pt, Ag, Cl, Br kabi elementlar uchun juda informativ.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Element</th>
                <th className="py-3 px-4 text-purple-300">Izotoplar</th>
                <th className="py-3 px-4 text-purple-300">Nisbat</th>
                <th className="py-3 px-4 text-purple-300">Spektr ko'rinishi</th>
                <th className="py-3 px-4 text-purple-300">Diagnostik qiymati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe", "⁵⁴Fe, ⁵⁶Fe, ⁵⁷Fe, ⁵⁸Fe", "5.8 : 91.7 : 2.2 : 0.3", "Asosiy pik 56 + kichik 54", "Juda yuqori — Fe borligi aniq"],
                  ["Cu", "⁶³Cu, ⁶⁵Cu", "69.2 : 30.8", "Ikkita pik (~2:1 nisbat)", "Juda yuqori — Cu borligi aniq"],
                  ["Zn", "⁶⁴Zn, ⁶⁶Zn, ⁶⁷Zn, ⁶⁸Zn, ⁷⁰Zn", "48.6:27.9:4.1:18.8:0.6", "5 ta pik — murakkab", "Yuqori — Zn borligi aniq"],
                  ["Pt", "¹⁹⁴Pt, ¹⁹⁵Pt, ¹⁹⁶Pt, ¹⁹⁸Pt", "32.9:33.8:25.3:7.2", "4 ta pik — xarakterli", "Juda yuqori — Pt borligi aniq"],
                  ["Ag", "¹⁰⁷Ag, ¹⁰⁹Ag", "51.8 : 48.2", "Ikkita deyarli teng pik", "Juda yuqori — Ag borligi aniq"],
                  ["Co", "⁵⁹Co", "100%", "Yagona pik", "O'rtacha — boshqa metallar bilan aralashishi mumkin"],
                  ["Cl", "³⁵Cl, ³⁷Cl", "75.8 : 24.2", "Ikkita pik (~3:1)", "Juda yuqori — Cl soni aniqlanadi"],
                  ["Br", "⁷⁹Br, ⁸¹Br", "50.7 : 49.3", "Ikkita deyarli teng pik", "Juda yuqori — Br soni aniqlanadi"],
                  ["Cr", "⁵⁰Cr, ⁵²Cr, ⁵³Cr, ⁵⁴Cr", "4.3:83.8:9.5:2.4", "Asosiy pik 52 + kichiklar", "Yuqori — Cr borligi aniq"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm text-green-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FRAGMENTLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💔 Komplekslarning fragmentlanishi — tarkibiy "puzzle"</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Mass-spektrometriyada kompleks ionlar <strong className="text-yellow-400">ligandlarini ketma-ket yo'qotib</strong> 
            fragmentlanadi. Fragmentlar orasidagi massa farqi aynan yo'qolgan ligand massasiga teng bo'ladi.
            Bu <strong className="text-yellow-400">"molekulyar puzzle"</strong> — kompleks tarkibini qatlamma-qatlam ochadi.
          </p>

          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 1: [Co(NH₃)₆]Cl₃ (ESI+, suvda)</h3>
              <div className="space-y-1 font-mono text-sm">
                <p className="text-purple-200">[Co(NH₃)₆]³⁺ → <span className="text-yellow-400">m/z = 53.7</span> (z=3)</p>
                <p className="text-purple-200">[Co(NH₃)₅Cl]²⁺ → <span className="text-yellow-400">m/z = 78.5</span> (Cl⁻ ichki sferada)</p>
                <p className="text-purple-200">[Co(NH₃)₄Cl₂]⁺ → <span className="text-yellow-400">m/z = 191.0</span></p>
                <p className="text-purple-300 text-xs mt-1">Har bir qadamda bitta NH₃ Cl⁻ ga almashgan — massa farqi: 17 (NH₃) → 35 (Cl⁻)</p>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 2: [Fe(CO)₅] (EI, 70 eV)</h3>
              <div className="space-y-1 font-mono text-sm">
                <p className="text-purple-200">[Fe(CO)₅]⁺ → <span className="text-yellow-400">m/z = 196</span> (M⁺)</p>
                <p className="text-purple-200">[Fe(CO)₄]⁺ → <span className="text-yellow-400">m/z = 168</span> (−28, CO)</p>
                <p className="text-purple-200">[Fe(CO)₃]⁺ → <span className="text-yellow-400">m/z = 140</span> (−28)</p>
                <p className="text-purple-200">[Fe(CO)₂]⁺ → <span className="text-yellow-400">m/z = 112</span> (−28)</p>
                <p className="text-purple-200">[FeCO]⁺ → <span className="text-yellow-400">m/z = 84</span> (−28)</p>
                <p className="text-purple-200">Fe⁺ → <span className="text-yellow-400">m/z = 56</span> (−28)</p>
                <p className="text-purple-300 text-xs mt-1">Ketma-ket 5 ta CO yo'qoladi — har bir qadam 28 Da farq!</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. HRMS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Yuqori aniqlikdagi mass-spektrometriya (HRMS)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">HRMS</strong> (High Resolution Mass Spectrometry) — 
            molekulyar massani <strong>4−6 xona aniqlikda</strong> (0.1−1 ppm) o'lchaydi.
            Bu aniqlik <strong className="text-yellow-400">molekulyar formulani bevosita hisoblash</strong> imkonini beradi,
            chunki har bir elementning aniq massasi noyobdir.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3">HRMS misollar:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-2 px-3 text-purple-300">Ion</th>
                  <th className="py-2 px-3 text-purple-300">Formula</th>
                  <th className="py-2 px-3 text-purple-300">Nazariy m/z</th>
                  <th className="py-2 px-3 text-purple-300">O'lchangan</th>
                  <th className="py-2 px-3 text-purple-300">Xatolik</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Fe(CN)₆]³⁻", "C₆FeN₆", "211.9392", "211.9390", "0.9 ppm"],
                    ["[Co(NH₃)₆]³⁺", "CoH₁₈N₆", "53.7045 (z=3)", "53.7043", "3.7 ppm"],
                    ["[PtCl₂(NH₃)₂]⁺", "PtCl₂N₂H₆", "299.9534", "299.9530", "1.3 ppm"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30">
                      {r.map((c, j) => (<td key={j} className={`py-2 px-3 ${j===0 ? "font-bold text-yellow-400" : ""} ${j===4 ? "text-green-400" : ""}`}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 6. MASSA ANALIZATORLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔧 Mass-analizator turlari</h2>
          
          <div className="space-y-4">
            {[
              { nom: "Kvadrupol (Q)", aniqlik: "0.1 Da (birlik aniqlik)", afzallik: "Arzon, ishonchli, ESI bilan tandem MS", kamchilik: "Aniqligi cheklangan" },
              { nom: "Uchish vaqti (TOF)", aniqlik: "0.001 Da (HRMS)", afzallik: "Yuqori aniqlik, keng massa diapazoni", kamchilik: "Qimmatroq" },
              { nom: "Orbitrap", aniqlik: "0.0001 Da (ultra-HRMS)", afzallik: "Eng yuqori aniqlik, ppm dan past", kamchilik: "Juda qimmat" },
              { nom: "FT-ICR", aniqlik: "0.00001 Da", afzallik: "Eng yuqori aniqlik — sub-ppm", kamchilik: "Juda qimmat, murakkab" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.nom}</h3>
                <p className="text-purple-200 text-sm"><strong>Aniqlik:</strong> {r.aniqlik}</p>
                <p className="text-purple-200 text-sm"><strong>Afzalligi:</strong> {r.afzallik}</p>
                <p className="text-purple-200 text-sm"><strong>Kamchiligi:</strong> {r.kamchilik}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Mass-spektrometriya — <strong className="text-yellow-400">molekulyar massani eng aniq o'lchash</strong> usuli</li>
            <li><strong className="text-yellow-400">ESI</strong> — komplekslar uchun eng qulay ionlashtirish usuli</li>
            <li><strong className="text-yellow-400">Izotop taqsimoti</strong> — metallni "barmoq izi" orqali shubhasiz aniqlash</li>
            <li><strong className="text-yellow-400">Fragmentlanish</strong> — ligandlar ketma-ket yo'qolishi tarkibni tasdiqlaydi</li>
            <li><strong className="text-yellow-400">HRMS</strong> — 0.1−1 ppm aniqlikda molekulyar formulani tasdiqlash</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← YaMR spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Rentgen difraksiyasi →</Link>
        </div>

      </section>
    </main>
  )
}