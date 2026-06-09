import Link from "next/link"

export default function KristallMaydon() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💎 Kristall maydon nazariyasi (KMN)</h1>
          <p className="text-purple-400 text-sm">d-orbital ajralishi • Δo va Δt • Spektrokimyoviy qator • KMBE • Yuqori va quyi spin</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kristall maydon nazariyasi haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kristall maydon nazariyasi (KMN)</strong> — 
              1929 yilda <strong>Hans Bethe</strong> tomonidan taklif qilingan. 
              VB nazariyasidan farqli ravishda, KMN <strong className="text-yellow-400">elektrostatik model</strong>ga asoslangan:
              ligandlar <strong>manfiy nuqtaviy zaryadlar</strong> sifatida qaraladi va 
              ularning elektrostatik maydoni markaziy atomning <strong>d-orbitallarini ajratadi</strong>.
              Bu ajralish komplekslarning <strong>rangi, magnit xossalari va geometriyasini</strong> tushuntirib beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy farazlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ligandlar — <strong>manfiy nuqtaviy zaryadlar</strong></li>
                <li>• Metall-ligand bog'i — <strong>sof ion bog'</strong></li>
                <li>• d-orbitallar ligand maydonida <strong>ajraladi</strong></li>
                <li>• Ajralish energiyasi — <strong>Δ (delta)</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani tushuntiradi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Komplekslarning <strong>rangi</strong></li>
                <li>• <strong>Magnit xossalari</strong> (yuqori/quyi spin)</li>
                <li>• <strong>Geometriya</strong> barqarorligi</li>
                <li>• <strong>Spektrokimyoviy qator</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── 2. d-ORBITAL AJRALISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Oktaedrik maydonda d-orbital ajralishi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Erkin ionda 5 ta d-orbital <strong className="text-yellow-400">degenerat</strong> (bir xil energiyali).
            Oktaedrik ligand maydonida ular <strong>ikki guruhga</strong> ajraladi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">e<sub>g</sub> — yuqori energiya (+0.6Δ<sub>o</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>d<sub>z²</sub> va d<sub>x²−y²</sub></strong><br/>
                Bu orbitallar <strong>to'g'ridan-to'g'ri ligandlarga qaragan</strong> — 
                kuchli itarilish → yuqori energiya.<br/>
                <strong>Degeneratlik:</strong> 2 karra
              </p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">t<sub>2g</sub> — past energiya (−0.4Δ<sub>o</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></strong><br/>
                Bu orbitallar <strong>ligandlar orasiga qaragan</strong> — 
                kuchsiz itarilish → past energiya.<br/>
                <strong>Degeneratlik:</strong> 3 karra
              </p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              Δ<sub>o</sub> = E(e<sub>g</sub>) − E(t<sub>2g</sub>) = 10 Dq
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Δ<sub>o</sub> — oktaedrik maydonda kristall maydon ajralish energiyasi
            </p>
          </div>
        </div>

        {/* ── 3. TETRAEDRIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 Tetraedrik maydonda d-orbital ajralishi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Tetraedrik maydonda ajralish <strong className="text-yellow-400">teskari tartibda</strong> bo'ladi.
            e orbitallar pastda, t₂ orbitallar yuqorida. Sababi: tetraedrik maydonda ligandlar 
            d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> orbitallarga yaqinroq joylashgan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">e — past energiya (+0.4Δ<sub>t</sub>)</h3>
              <p className="text-purple-200 text-sm">d<sub>z²</sub>, d<sub>x²−y²</sub></p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">t₂ — yuqori energiya (−0.6Δ<sub>t</sub>)</h3>
              <p className="text-purple-200 text-sm">d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></p>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5 mt-4">
            <p className="text-purple-200 text-sm">
              <strong>Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub></strong> — tetraedrik maydonda ajralish energiyasi 
              oktaedrikdan deyarli 2 barobar kichik. Shuning uchun tetraedrik komplekslar 
              <strong>har doim yuqori spinli</strong> bo'ladi!
            </p>
          </div>
        </div>

        {/* ── 4. SPEKTROKIMYOVIY QATOR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektrokimyoviy qator</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Spektrokimyoviy qator</strong> — ligandlarning 
            Δ<sub>o</sub> ni oshirish qobiliyati bo'yicha joylashgan ketma-ketligi.
            Chap tomonda kuchsiz maydonli ligandlar (kichik Δ<sub>o</sub>), 
            o'ng tomonda kuchli maydonli ligandlar (katta Δ<sub>o</sub>).
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ &lt; Cl⁻ &lt; NO₃⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NCS⁻ &lt; NH₃ &lt; en &lt; NO₂⁻ &lt; CN⁻ &lt; CO
            </p>
            <p className="text-purple-300 text-sm mt-2">
              <span className="text-red-400">← kuchsiz maydon (kichik Δ<sub>o</sub>)</span> | 
              <span className="text-green-400"> kuchli maydon (katta Δ<sub>o</sub>) →</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th>
                <th className="py-3 px-4 text-purple-300">Maydon kuchi</th>
                <th className="py-3 px-4 text-purple-300">Δ<sub>o</sub> (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Spin holati</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["I⁻", "Juda kuchsiz", "~7,000", "Yuqori spin", "[FeI₄]²⁻"],
                  ["Cl⁻", "Kuchsiz", "~8,000", "Yuqori spin", "[CoCl₄]²⁻"],
                  ["H₂O", "O'rtacha", "~10,000−18,000", "YS/QS (metallga bog'liq)", "[Cr(H₂O)₆]³⁺"],
                  ["NH₃", "Kuchli", "~21,000−23,000", "Ko'pincha quyi spin", "[Co(NH₃)₆]³⁺"],
                  ["CN⁻", "Juda kuchli", "~30,000−35,000", "Quyi spin", "[Fe(CN)₆]⁴⁻"],
                  ["CO", "Eng kuchli", "~35,000−40,000", "Quyi spin", "[Fe(CO)₅]"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. KMBE ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 KMBE — Kristall maydon barqarorlashish energiyasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">KMBE</strong> — elektronlarning t₂g va eg orbitallarga 
            joylashishi natijasida hosil bo'ladigan <strong>qo'shimcha barqarorlik</strong>.
            KMBE = (t₂g elektronlar × −0.4Δ<sub>o</sub>) + (eg elektronlar × +0.6Δ<sub>o</sub>).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya (YS)</th>
                <th className="py-3 px-4 text-purple-300">KMBE (Δ<sub>o</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya (QS)</th>
                <th className="py-3 px-4 text-purple-300">KMBE (Δ<sub>o</sub>)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "t₂g¹", "−0.4", "—", "—"],
                  ["d²", "t₂g²", "−0.8", "—", "—"],
                  ["d³", "t₂g³", "−1.2", "—", "—"],
                  ["d⁴", "t₂g³ eg¹", "−0.6", "t₂g⁴", "−1.6"],
                  ["d⁵", "t₂g³ eg²", "0", "t₂g⁵", "−2.0"],
                  ["d⁶", "t₂g⁴ eg²", "−0.4", "t₂g⁶", "−2.4"],
                  ["d⁷", "t₂g⁵ eg²", "−0.8", "t₂g⁶ eg¹", "−1.8"],
                  ["d⁸", "t₂g⁶ eg²", "−1.2", "—", "—"],
                  ["d⁹", "t₂g⁶ eg³", "−0.6", "—", "—"],
                  ["d¹⁰", "t₂g⁶ eg⁴", "0", "—", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <p className="text-green-300 text-sm">
              <strong>Eng yuqori KMBE:</strong> d⁶ quyi spin (t₂g⁶) — −2.4Δ<sub>o</sub>. 
              <strong>Eng past KMBE:</strong> d⁵ yuqori spin va d¹⁰ — 0. 
              Yuqori KMBE → yuqori termodinamik barqarorlik va kinetik inertlik!
            </p>
          </div>
        </div>

        {/* ── 6. YUQORI/QUYI SPIN ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Yuqori spin vs Quyi spin</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            d⁴−d⁷ konfiguratsiyalar uchun <strong className="text-yellow-400">ikki xil spin holati</strong> mumkin.
            Tanlov Δ<sub>o</sub> va <strong>juflanish energiyasi (P)</strong> orasidagi raqobat bilan belgilanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-2">Δ<sub>o</sub> &lt; P → Yuqori spin</h3>
              <p className="text-purple-200 text-sm">
                Elektronlar juftlashishdan ko'ra yuqori orbitallarga o'tishni afzal ko'radi.
                Ko'proq toq elektron — paramagnit. Kuchsiz maydonli ligandlar (Cl⁻, H₂O).
              </p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Δ<sub>o</sub> &gt; P → Quyi spin</h3>
              <p className="text-purple-200 text-sm">
                Elektronlar past orbitallarda juftlashishni afzal ko'radi.
                Kamroq toq elektron (yoki diamagnit). Kuchli maydonli ligandlar (CN⁻, CO).
              </p>
            </div>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">KMN:</strong> d-orbitallar ligand maydonida ajraladi — t₂g (past) va eg (yuqori)</li>
            <li><strong className="text-yellow-400">Δ<sub>o</sub></strong> — ajralish energiyasi, kompleks rangini va magnit xossalarini belgilaydi</li>
            <li><strong className="text-yellow-400">Spektrokimyoviy qator:</strong> I⁻ &lt; Cl⁻ &lt; H₂O &lt; NH₃ &lt; CN⁻ &lt; CO</li>
            <li><strong className="text-yellow-400">KMBE:</strong> qo'shimcha barqarorlik — d³ (−1.2Δ<sub>o</sub>), d⁶ QS (−2.4Δ<sub>o</sub>)</li>
            <li><strong className="text-yellow-400">Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub></strong> — tetraedrik komplekslar har doim yuqori spinli</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/kimyoviy-boglanish/vb-nazariyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← VB nazariyasi
          </Link>
          <Link href="/oquv/kimyoviy-boglanish/yan-teller" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Yan-Teller effekti →
          </Link>
        </div>

      </section>
    </main>
  )
}