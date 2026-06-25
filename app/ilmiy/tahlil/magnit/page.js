import Link from "next/link"

export default function MagnitOlchashlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 Magnit o'lchashlar</h1>
          <p className="text-purple-400 text-sm">Magnit qabulqiluvchanlik • μ<sub>eff</sub> hisoblash • Spin holatini aniqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR MAGNIT TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/magnit/birikmalar"
          className="group block bg-gradient-to-r from-orange-900/40 to-purple-900/40 border border-orange-700/50 rounded-2xl p-6 hover:bg-orange-900/60 hover:border-orange-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🧲</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-orange-400 group-hover:text-orange-300 transition-colors">
                Birikmalarning magnit tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning magnit qabulqiluvchanlik o'lchashlari. Magnit momenti, 
                spin holati, toq elektronlar soni va Gouy usuli bilan aniqlash har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-orange-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Magnit momenti μ<sub>eff</sub></span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Spin holati</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Toq e⁻ soni</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Gouy usuli</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Magnit o'lchashlar haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Magnit o'lchashlar</strong> — kompleks birikmalarning 
              <strong className="text-yellow-400"> spin holatini</strong> (yuqori yoki quyi) va 
              <strong className="text-yellow-400"> toq elektronlar sonini</strong> aniqlashda eng to'g'ridan-to'g'ri usul.
              Oktaedrik kompleksda d-elektronlarning taqsimlanishi (t₂g va e<sub>g</sub>) magnit momenti orqali aniqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">📐</div>
              <div className="text-white font-bold">μ<sub>eff</sub> = √n(n+2)</div>
              <div className="text-purple-400 text-xs mt-1">Spin-only formula</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🔢</div>
              <div className="text-white font-bold">n = toq e⁻ soni</div>
              <div className="text-purple-400 text-xs mt-1">d-elektronlar sonidan</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">📏</div>
              <div className="text-white font-bold">μ<sub>B</sub> = 9.27×10⁻²⁴ J/T</div>
              <div className="text-purple-400 text-xs mt-1">Bor magnetoni</div>
            </div>
          </div>
        </div>

        {/* 2. GOUY USULI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Gouy usuli — magnit qabulqiluvchanlikni o'lchash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Gouy usuli</strong> (Louis Georges Gouy, 1854-1926, fransuz fizigi) — eng oddiy va keng tarqalgan magnit o'lchash usuli.
            Namuna kuchli magnit maydoniga joylashtiriladi va uning <strong className="text-yellow-400">og'irlik o'zgarishi</strong> o'lchanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ol className="text-purple-200 text-sm space-y-2 list-decimal list-inside">
                <li>Namuna <strong>torsion tarozida</strong> osiladi</li>
                <li>Kuchli <strong>magnit maydoni</strong> qo'llaniladi</li>
                <li><strong>Og'irlik o'zgarishi</strong> (Δm) o'lchanadi</li>
                <li>Magnit qabulqiluvchanlik <strong>χ</strong> hisoblanadi</li>
                <li>μ<sub>eff</sub> <strong>topiladi</strong></li>
              </ol>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Formulalar</h3>
              <div className="space-y-2 text-sm">
                <p className="text-purple-200">χ<sub>g</sub> = (2·Δm·g) / (μ₀·H²·A·ρ)</p>
                <p className="text-purple-200">χ<sub>M</sub> = χ<sub>g</sub> × M</p>
                <p className="text-purple-200">χ<sub>M</sub><sup>korr</sup> = χ<sub>M</sub> − χ<sub>dia</sub></p>
                <p className="text-yellow-400 font-bold">μ<sub>eff</sub> = 2.828 × √(χ<sub>M</sub><sup>korr</sup> × T)</p>
                <p className="text-purple-400 text-xs mt-3">
                  * Amaliyotda ko'pincha kalibrlangan namuna (Hg[Co(SCN)₄]) ishlatiladi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. μeff JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 d-elektronlar va magnit momenti (μ<sub>eff</sub>)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">dⁿ</th>
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">n (toq e⁻)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> (nazariy)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> (tajriba)</th>
                <th className="py-3 px-4 text-purple-300">Spin holati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "Ti³⁺", "1", "1.73", "1.7-1.8", "—"],
                  ["d²", "V³⁺", "2", "2.83", "2.8-3.1", "—"],
                  ["d³", "Cr³⁺", "3", "3.87", "3.7-3.9", "—"],
                  ["d⁴ (HS)", "Cr²⁺, Mn³⁺", "4", "4.90", "4.8-4.9", "Yuqori spin"],
                  ["d⁴ (LS)", "Cr²⁺ (kuchli maydon)", "2", "2.83", "3.0-3.3", "Quyi spin"],
                  ["d⁵ (HS)", "Fe³⁺, Mn²⁺", "5", "5.92", "5.7-6.0", "Yuqori spin"],
                  ["d⁵ (LS)", "Fe³⁺ (CN⁻)", "1", "1.73", "2.2-2.4", "Quyi spin"],
                  ["d⁶ (HS)", "Fe²⁺, Co³⁺", "4", "4.90", "5.0-5.6", "Yuqori spin"],
                  ["d⁶ (LS)", "Fe²⁺ (CN⁻), Co³⁺", "0", "0", "0", "Diamagnit"],
                  ["d⁷ (HS)", "Co²⁺ (oktaedrik)", "3", "3.87", "4.3-5.2", "Yuqori spin"],
                  ["d⁷ (LS, kv)", "Co²⁺ (kuchli maydon)", "1", "1.73", "1.8-2.0", "Quyi spin"],
                  ["d⁸", "Ni²⁺", "2", "2.83", "2.9-3.9", "—"],
                  ["d⁹", "Cu²⁺", "1", "1.73", "1.9-2.1", "—"],
                  ["d¹⁰", "Zn²⁺, Cu⁺, Ag⁺", "0", "0", "0", "Diamagnit"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 text-sm ${j===2 ? "text-yellow-400 font-bold" : ""} ${j===3||j===4 ? "font-mono" : ""}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. SPIN HOLATINI ANIQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Magnit momenti orqali spin holatini aniqlash</h2>
          
          <div className="space-y-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Misol 1: [Fe(CN)₆]⁴⁻</h3>
              <p className="text-purple-200 text-sm mb-2">Fe²⁺ (d⁶), CN⁻ — kuchli maydon</p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Konfiguratsiya: <strong>t₂g⁶</strong> (quyi spin)</li>
                <li>• n = 0, μ<sub>eff</sub> (nazariy) = <strong>0 μ<sub>B</sub></strong></li>
                <li>• Tajriba: <strong>0 μ<sub>B</sub> — diamagnit</strong> ✅</li>
              </ul>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Misol 2: [Fe(H₂O)₆]²⁺</h3>
              <p className="text-purple-200 text-sm mb-2">Fe²⁺ (d⁶), H₂O — kuchsiz maydon</p>
              <ul className="text-purple-300 text-sm space-y-1">
                <li>• Konfiguratsiya: <strong>t₂g⁴ e<sub>g</sub>²</strong> (yuqori spin)</li>
                <li>• n = 4, μ<sub>eff</sub> (nazariy) = <strong>4.90 μ<sub>B</sub></strong></li>
                <li>• Tajriba: <strong>~5.2 μ<sub>B</sub> — paramagnit</strong> ✅</li>
              </ul>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Xulosa</h3>
              <p className="text-purple-200 text-sm">
                Bir xil metall (Fe²⁺), har xil ligand (CN⁻ vs H₂O) — <strong>butunlay boshqa magnit xossasi</strong>!
                Magnit o'lchashlar ligand maydon kuchini <strong>bevosita ko'rsatadi</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 5. DIAMAGNIT TUZATMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📝 Diamagnit tuzatma (Paskal konstantalari)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Murakkab molekulalarda <strong className="text-yellow-400">diamagnit hissa</strong> (barcha juftlashgan elektronlardan) 
            hisobga olinishi kerak. Paskal konstantalari yordamida har bir atom va bog' uchun diamagnit tuzatma qo'shiladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">
              Paskal konstantalari (χ<sub>dia</sub> × 10⁻⁶ emu/mol):
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {[
                ["K⁺", "−15"], ["Fe²⁺", "−13"], ["Fe³⁺", "−10"],
                ["Co³⁺", "−10"], ["NH₃", "−18"], ["H₂O", "−13"],
                ["Cl⁻", "−25"], ["CN⁻", "−15"], ["C=C", "+5"],
              ].map((r, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-2 text-center">
                  <div className="text-purple-400">{r[0]}</div>
                  <div className="text-white font-bold">{r[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. ZAMONAVIY USULLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔧 Zamonaviy magnit o'lchash usullari</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-2xl mb-2">⚖️</div>
              <h3 className="text-yellow-400 font-bold mb-2">Gouy usuli</h3>
              <p className="text-purple-300 text-xs">Klassik, arzon, lekin sezgirligi past. ~100 mg namuna kerak.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-yellow-400 font-bold mb-2">Faraday usuli</h3>
              <p className="text-purple-300 text-xs">Gradientli maydon, yuqori aniqlik. 1-10 mg namuna yetarli.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-2xl mb-2">🌡️</div>
              <h3 className="text-yellow-400 font-bold mb-2">SQUID magnitometr</h3>
              <p className="text-purple-300 text-xs">Eng sezgir (10⁻⁸ emu), 1.8-400 K, χ(T), M(H), ZFC/FC o'lchash.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Magnit moment — <strong className="text-yellow-400">toq elektronlar sonini bevosita ko'rsatadi</strong></li>
            <li>μ<sub>eff</sub> = √n(n+2) — <strong>spin-only formula</strong></li>
            <li>Gouy usuli — eng oddiy va keng tarqalgan o'lchash usuli</li>
            <li>Magnit xossasi — <strong>yuqori/quyi spin farqini aniqlashda</strong> asosiy usul</li>
            <li>Zamonaviy SQUID magnitometr — eng sezgir va ishonchli usul</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/mass" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Mass-spektrometriya</Link>
          <Link href="/ilmiy/tahlil/elektrokimyo" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Elektrokimyoviy tahlil →</Link>
        </div>

      </section>
    </main>
  )
}