import Link from "next/link"

export default function RangSpektrlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🎨 Rang va spektrlar</h1>
          <p className="text-purple-400 text-sm">d-d o'tishlar • Tanlash qoidalari • Komplekslarning rangi sababi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. RANG SABABI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks birikmalarning rangi</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-metall komplekslarining rangi</strong> — 
              elektronlarning <strong className="text-yellow-400">d-d o'tishlari</strong> natijasida yuzaga keladi.
              Elektron t₂g orbitallardan eg orbitallarga o'tganda <strong>ma'lum to'lqin uzunligidagi yorug'lik yutiladi</strong>.
              Ko'zimizga <strong>yutilmagan, qaytgan yorug'lik</strong> ko'rinadi — bu kompleksning rangi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Rang g'ildiragi</h3>
              <p className="text-purple-200 text-sm">
                Yutilgan rang va ko'rinadigan rang <strong>bir-biriga komplementar</strong> (qarama-qarshi).
              </p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                {[
                  ["Qizil", "Yashil"], ["To'q sariq", "Ko'k"], ["Sariq", "Binafsha"],
                  ["Yashil-sariq", "Qizil-binafsha"], ["Yashil", "Qizil"], ["Ko'k", "To'q sariq"],
                  ["Binafsha", "Sariq"]
                ].map((r, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-2 text-center">
                    <span className="text-purple-300">Yutilgan: {r[0]}</span><br/>
                    <span className="text-white font-bold">Ko'rinadi: {r[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d¹⁰ va d⁰ — rangsiz</h3>
              <p className="text-purple-200 text-sm">
                d¹⁰ (Zn²⁺) va d⁰ (Ti⁴⁺) konfiguratsiyalarda <strong>d-d o'tishlar mavjud emas</strong>.
                Shuning uchun bu komplekslar <strong>rangsiz</strong> bo'ladi.
              </p>
              <p className="text-purple-300 text-sm mt-3">
                Misol: [Zn(H₂O)₆]²⁺ — rangsiz, [TiCl₄] — rangsiz.
              </p>
            </div>
          </div>
        </div>

        {/* 2. TANLASH QOIDALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Tanlash qoidalari</h2>
          
          <div className="space-y-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">1. Laporta qoidasi</h3>
              <p className="text-purple-200 text-sm">
                Δl = ±1 bo'lgan o'tishlarga ruxsat berilgan. <strong>d→d o'tishlar ta'qiqlangan!</strong>
                Ammo simmetriya markazi bo'lmagan komplekslarda (tetraedrik) bu qoida <strong>buziladi</strong>.
              </p>
              <p className="text-purple-300 text-sm mt-2">
                Natija: Tetraedrik komplekslar rangi <strong>oktaedriklarga qaraganda intensivroq</strong>.
              </p>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">2. Spin qoidasi</h3>
              <p className="text-purple-200 text-sm">
                ΔS = 0 — elektronning <strong>spini o'zgarmasligi</strong> kerak.
                Singlet→Singlet yoki Triplet→Triplet ruxsat. Singlet→Triplet <strong>ta'qiqlangan</strong>.
              </p>
              <p className="text-purple-300 text-sm mt-2">
                Ayniqsa <strong>d⁵ yuqori spinli</strong> komplekslarda muhim — barcha o'tishlar ta'qiqlangan → <strong>juda och rang</strong>.
              </p>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">3. Juftlik qoidasi</h3>
              <p className="text-purple-200 text-sm">
                Sentrosimmetrik molekulalarda <strong>g→g va u→u o'tishlar ta'qiqlangan</strong>.
                Faqat g→u va u→g o'tishlarga ruxsat berilgan.
              </p>
              <p className="text-purple-300 text-sm mt-2">
                Oktaedrikda t₂g→eg o'tish bu qoida bilan ta'qiqlangan (ikkalasi ham g).
              </p>
            </div>
          </div>
        </div>

        {/* 3. INTENSIVLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Turli komplekslarning rang intensivligi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">ε (L·mol⁻¹·cm⁻¹)</th><th className="py-3 px-4 text-purple-300">Ta'qiq</th><th className="py-3 px-4 text-purple-300">Intensivlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Mn(H₂O)₆]²⁺","Oktaedrik","&lt; 1","Laporta + Spin","Deyarli rangsiz"],
                  ["[Co(H₂O)₆]²⁺","Oktaedrik","1-10","Laporta + Juftlik","Och pushti"],
                  ["[CoCl₄]²⁻","Tetraedrik","100-1000","Faqat Spin","Intensiv ko'k"],
                  ["[MnO₄]⁻","Tetraedrik","10000+","Hech qaysi","Juda intensiv binafsha"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-pink-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{__html: r[2]}}></td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kompleks rangi — <strong className="text-yellow-400">d-d o'tishlar</strong> natijasi</li>
            <li>3 ta tanlash qoidasi: <strong>Laporta, Spin, Juftlik</strong></li>
            <li>Tetraedrik komplekslar — <strong>intensivroq rang</strong></li>
            <li>d⁰ va d¹⁰ — <strong>rangsiz</strong> (d-d o'tish yo'q)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/yuqori-quyi-spin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Yuqori va quyi spin</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Kristall maydon →</Link>
        </div>

      </section>
    </main>
  )
}