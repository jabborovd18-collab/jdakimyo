import Link from "next/link"

export default function MagnitMoment() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📐 Magnit moment nazariyasi</h1>
          <p className="text-purple-400 text-sm">Spin va orbital hissalar • μ = √n(n+2) • Komplekslarda μ<sub>eff</sub> • d¹−d⁹ konfiguratsiyalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Magnit moment haqida fundamental tushunchalar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Magnit moment (μ)</strong> — moddaning magnit maydonga bo&apos;lgan javobini 
              xarakterlovchi asosiy fizik kattalik bo&apos;lib, kompleks birikmalar kimyosida 
              <strong className="text-yellow-400"> elektron tuzilishning bevosita aksidir</strong>. 
              Magnit moment ikki mustaqil manbadan kelib chiqadi: 
              <strong className="text-yellow-400"> elektronning xususiy spini</strong> (spin magnit momenti) va 
              <strong className="text-yellow-400"> elektronning yadro atrofidagi orbital harakati</strong> (orbital magnit momenti).
              Kompleks birikmalarda magnit moment qiymati metall ionining 
              <strong> oksidlanish darajasi, spin holati, koordinatsion soni va geometriyasi</strong> haqida 
              to&apos;g&apos;ridan-to&apos;g&apos;ri ma&apos;lumot beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Spin magnit momenti (μ<sub>S</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tabiati:</strong> elektronning ichki xususiyati — fundamental spin kvant soni s=½<br/>
                <strong>Formula:</strong> μ<sub>S</sub> = g<sub>e</sub>√[S(S+1)] μ<sub>B</sub><br/>
                <strong>g<sub>e</sub> = 2.002319...</strong> — erkin elektron uchun giromagnit nisbat<br/>
                <strong>Kompleksda:</strong> asosiy hissa (ayniqsa 3d-metallarda), ligand maydoni deyarli ta&apos;sir qilmaydi
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Orbital magnit momenti (μ<sub>L</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tabiati:</strong> elektronning yadro atrofidagi orbital harakati — klassik analog: tokli g&apos;altak<br/>
                <strong>Formula:</strong> μ<sub>L</sub> = √[L(L+1)] μ<sub>B</sub><br/>
                <strong>Kompleksda:</strong> ligand maydoni tomonidan qisman yoki to&apos;liq so&apos;ndiriladi<br/>
                <strong>Sabab:</strong> ligandlarning elektrostatik maydoni orbital degeneratlikni yo&apos;qotadi
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. SPIN-ONLY FORMULA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Spin-only formula — μ<sub>SO</sub> = √[n(n+2)]</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Spin-only (faqat spin) formula</strong> — kompleks birikmalarning 
              magnit momentini hisoblash uchun eng fundamental va keng qo&apos;llaniladigan formula.
              Bu formula <strong>orbital magnit momenti to&apos;liq so&apos;ndirilgan</strong> (kvantlangan) 
              degan farazga asoslanadi. Ko&apos;pchilik 3d-metall komplekslari, ayniqsa 
              <strong> A va E simmetriyali asosiy termga</strong> ega bo&apos;lganlari uchun 
              eksperimental natijalar bilan juda yaxshi mos keladi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-2xl">
              μ<sub>SO</sub> = √[n(n+2)] μ<sub>B</sub>
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Bu yerda <strong>n</strong> — juftlanmagan elektronlar soni (0 dan 5 gacha d-orbitallarda), 
              <strong> μ<sub>B</sub></strong> — Bor magnetoni (9.274009994 × 10⁻²⁴ J/T)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">n</th>
                <th className="py-3 px-4 text-purple-300">S = n/2</th>
                <th className="py-3 px-4 text-purple-300">2S+1</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub> (μ<sub>B</sub>)</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup> (YS)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks misoli</th>
                <th className="py-3 px-4 text-purple-300">Eksp μ<sub>eff</sub></th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["0", "0", "1 (singlet)", "0.00", "d⁰, d¹⁰, d⁶(QS)", "[Co(NH₃)₆]³⁺, [Zn(H₂O)₆]²⁺", "0 (diamagnit)"],
                  ["1", "½", "2 (dublet)", "1.73", "d¹, d⁹", "[Ti(H₂O)₆]³⁺, [Cu(H₂O)₆]²⁺", "1.7−2.2"],
                  ["2", "1", "3 (triplet)", "2.83", "d², d⁸", "[V(H₂O)₆]³⁺, [Ni(H₂O)₆]²⁺", "2.7−3.3"],
                  ["3", "3/2", "4 (kvartet)", "3.87", "d³, d⁷(YS)", "[Cr(H₂O)₆]³⁺, [Co(H₂O)₆]²⁺", "3.7−5.2"],
                  ["4", "2", "5 (kvintet)", "4.90", "d⁴(YS), d⁶(YS)", "[Cr(H₂O)₆]²⁺, [Fe(H₂O)₆]²⁺", "4.7−5.5"],
                  ["5", "5/2", "6 (sekstet)", "5.92", "d⁵(YS)", "[Fe(H₂O)₆]³⁺, [Mn(H₂O)₆]²⁺", "5.8−5.95"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold text-sm">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Spin-only formulaning qo&apos;llanish chegaralari</h3>
            <p className="text-purple-200 text-sm">
              Spin-only formula <strong>A va E simmetriyali asosiy termlarga</strong> ega komplekslarda 
              eng aniq natija beradi. Bunga quyidagilar kiradi:<br/>
              • d³ oktaedrik: ⁴A₂<sub>g</sub> — μ<sub>eff</sub> ≈ 3.7−3.9 μ<sub>B</sub> (hisoblangan: 3.87)<br/>
              • d⁵(YS) oktaedrik: ⁶A₁<sub>g</sub> — μ<sub>eff</sub> ≈ 5.8−5.95 μ<sub>B</sub> (hisoblangan: 5.92)<br/>
              • d⁸ oktaedrik: ³A₂<sub>g</sub> — μ<sub>eff</sub> ≈ 2.8−3.3 μ<sub>B</sub> (hisoblangan: 2.83)<br/>
              • d⁶(QS) oktaedrik: ¹A₁<sub>g</sub> — diamagnit (hisoblangan: 0)<br/>
              <strong>T simmetriyali termlarda</strong> orbital hissa qo&apos;shilgani uchun spin-only formula 
              eksperimentaldan kichikroq qiymat beradi.
            </p>
          </div>
        </div>

        {/* ── 3. EFFEKTIV MAGNIT MOMENT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Effektiv magnit moment (μ<sub>eff</sub>) — eksperimental haqiqat</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Effektiv magnit moment (μ<sub>eff</sub>)</strong> — 
              eksperimental o&apos;lchanadigan haqiqiy magnit moment bo&apos;lib, 
              u spin va orbital hissalarning <strong>umumiy vektor yig&apos;indisi</strong>ni aks ettiradi.
              μ<sub>eff</sub> ni bilish orqali metall ionining <strong>elektron konfiguratsiyasi,
              oksidlanish darajasi va spin holati</strong> haqida bir qiymatli xulosa chiqarish mumkin.
              Bu magnit o&apos;lchashlarning kimyodagi eng katta amaliy ahamiyatidir.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Ion (misol)</th>
                <th className="py-3 px-4 text-purple-300">Asosiy term (O<sub>h</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Term simmetriyasi</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub></th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> (eksp diapazon)</th>
                <th className="py-3 px-4 text-purple-300">Orbital hissa</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "Ti³⁺", "²T₂<sub>g</sub>", "T", "1.73", "1.65−1.85", "Kichik (5−10%)"],
                  ["d²", "V³⁺", "³T₁<sub>g</sub>(F)", "T", "2.83", "2.65−2.95", "O&apos;rtacha (5−15%)"],
                  ["d³", "Cr³⁺", "⁴A₂<sub>g</sub>", "A", "3.87", "3.75−3.90", "Deyarli yo&apos;q (&lt;2%)"],
                  ["d⁴(YS)", "Cr²⁺", "⁵E<sub>g</sub>", "E", "4.90", "4.70−5.05", "Kichik (Yan-Teller)"],
                  ["d⁵(YS)", "Fe³⁺", "⁶A₁<sub>g</sub>", "A", "5.92", "5.80−5.95", "Deyarli yo&apos;q (&lt;1%)"],
                  ["d⁵(QS)", "Fe³⁺(CN⁻)", "²T₂<sub>g</sub>", "T", "1.73", "2.0−2.5", "Katta (quyi spin)"],
                  ["d⁶(YS)", "Fe²⁺", "⁵T₂<sub>g</sub>", "T", "4.90", "5.10−5.60", "Katta (10−25%)"],
                  ["d⁶(QS)", "Co³⁺", "¹A₁<sub>g</sub>", "A", "0.00", "0 (diamagnit)", "Yo&apos;q"],
                  ["d⁷(YS)", "Co²⁺", "⁴T₁<sub>g</sub>(F)", "T", "3.87", "4.30−5.20", "Juda katta (20−35%)"],
                  ["d⁷(QS)", "Co²⁺(CN⁻)", "²E<sub>g</sub>", "E", "1.73", "1.80−2.20", "Kichik-o&apos;rtacha"],
                  ["d⁸", "Ni²⁺", "³A₂<sub>g</sub>", "A", "2.83", "2.80−3.30", "Kichik (5−10%)"],
                  ["d⁹", "Cu²⁺", "²E<sub>g</sub>", "E", "1.73", "1.70−2.20", "Kichik-o&apos;rtacha (Yan-Teller)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[2] }}></td>
                    <td className="py-3 px-4">
                      {r[3] === "T" ? <span className="text-orange-400 font-bold">T</span> : 
                       r[3] === "A" ? <span className="text-green-400 font-bold">A</span> :
                       <span className="text-yellow-400 font-bold">E</span>}
                    </td>
                    <td className="py-3 px-4 text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">{r[5]}</td>
                    <td className="py-3 px-4 text-sm">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mt-4">
            <p className="text-cyan-300 text-sm">
              <strong>Asosiy xulosa:</strong> A simmetriyali termlarda (A₁<sub>g</sub>, A₂<sub>g</sub>) 
              orbital hissa deyarli yo&apos;q — μ<sub>eff</sub> ≈ μ<sub>SO</sub>. 
              E simmetriyali termlarda (E<sub>g</sub>) orbital hissa kichik — μ<sub>eff</sub> μ<sub>SO</sub> dan biroz katta.
              T simmetriyali termlarda (T₁<sub>g</sub>, T₂<sub>g</sub>) orbital hissa sezilarli — 
              μ<sub>eff</sub> μ<sub>SO</sub> dan ancha katta bo&apos;lishi mumkin.
            </p>
          </div>
        </div>

        {/* ── 4. ORBITAL HISSA MEXANIZMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Orbital hissaning qo&apos;shilish mexanizmi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Orbital magnit momenti <strong className="text-yellow-400">ligand maydoni tomonidan qisman yoki to&apos;liq 
              kvantlanadi (so&apos;ndiriladi)</strong>. Agar asosiy term <strong>T simmetriyaga</strong> ega bo&apos;lsa 
              (uch karra orbital degeneratlik), elektron bir orbitaldan ikkinchisiga aylanib o&apos;tishi mumkin — 
              bu orbital burchak momentini va demak, orbital magnit momentini hosil qiladi.
              <strong> A yoki E termlarda</strong> orbital degeneratlik yo&apos;q — orbital moment to&apos;liq so&apos;ndirilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">T termli komplekslar — orbital hissa mavjud</h3>
              <p className="text-purple-200 text-sm">
                <strong>d¹:</strong> ²T₂<sub>g</sub> — t₂g orbitallar orasida aylanish mumkin<br/>
                <strong>d²:</strong> ³T₁<sub>g</sub> — murakkab uch karra degeneratlik<br/>
                <strong>d⁶(YS):</strong> ⁵T₂<sub>g</sub> — t₂g⁴ eg², kuchli orbital hissa<br/>
                <strong>d⁷(YS):</strong> ⁴T₁<sub>g</sub> — eng kuchli orbital hissa (Co²⁺)<br/>
                <span className="text-purple-400 text-xs">μ<sub>eff</sub> spin-only dan 10−35% katta bo&apos;lishi mumkin</span>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">A/E termli komplekslar — orbital hissa so&apos;ndirilgan</h3>
              <p className="text-purple-200 text-sm">
                <strong>d³:</strong> ⁴A₂<sub>g</sub> — t₂g³ yarim to&apos;lgan, orbital moment nolga teng<br/>
                <strong>d⁵(YS):</strong> ⁶A₁<sub>g</sub> — barcha orbitallar yarim to&apos;lgan, L=0<br/>
                <strong>d⁶(QS):</strong> ¹A₁<sub>g</sub> — barcha t₂g orbitallar to&apos;liq, diamagnit<br/>
                <strong>d⁸:</strong> ³A₂<sub>g</sub> — t₂g⁶ eg², orbital degeneratlik yo&apos;q<br/>
                <span className="text-purple-400 text-xs">μ<sub>eff</sub> ≈ μ<sub>SO</sub> (farq &lt;5−10%)</span>
              </p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-orange-400 font-bold mb-2">[Co(H₂O)₆]²⁺ — orbital hissaning klassik namunasi</h3>
            <p className="text-purple-200 text-sm">
              Co²⁺ (d⁷, yuqori spin, t₂g⁵ eg²) asosiy termi <strong>⁴T₁<sub>g</sub>(F)</strong> — 
              uch karra orbital degeneratlik. Spin-only qiymat: <strong>3.87 μ<sub>B</sub></strong> (n=3). 
              Eksperimental μ<sub>eff</sub>: <strong>4.7−5.2 μ<sub>B</sub></strong>. 
              Orbital hissa ≈ <strong>20−35%</strong>. Bu Co²⁺ komplekslarini magnit o&apos;lchashlar orqali 
              boshqa ionlardan (masalan, Cr³⁺ — ham 3 ta juftlanmagan elektron, lekin μ<sub>eff</sub> ≈ 3.87) 
              ishonchli farqlash imkonini beradi. Tetraedrik [CoCl₄]²⁻ da orbital hissa yanada kattaroq — 
              μ<sub>eff</sub> ≈ 4.3−4.8 μ<sub>B</sub>.
            </p>
          </div>
        </div>

        {/* ── 5. BOR MAGNETONI VA LANDE G-FAKTORI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Bor magnetoni va Lande g-faktori</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Bor magnetoni (μ<sub>B</sub>)</strong> — atom fizikasidagi 
              fundamental konstanta bo&apos;lib, elektronning orbital harakati natijasida hosil bo&apos;ladigan 
              eng kichik magnit momentiga teng. <strong className="text-yellow-400">Lande g-faktori</strong> esa 
              spin va orbital magnit momentlarining nisbiy hissasini xarakterlaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Bor magnetoni</h3>
              <p className="text-purple-200 text-sm">
                <strong>Formula:</strong> μ<sub>B</sub> = eħ / 2m<sub>e</sub><br/>
                <strong>Qiymat:</strong> 9.274009994 × 10⁻²⁴ J/T<br/>
                <strong>SI birlik:</strong> A·m² yoki J/T<br/>
                <strong>CGS birlik:</strong> erg/G<br/>
                <strong>Fizik ma&apos;nosi:</strong> 1 μ<sub>B</sub> — bu vodorod atomidagi elektronning asosiy holatdagi orbital magnit momenti
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Lande g-faktori</h3>
              <p className="text-purple-200 text-sm">
                <strong>Formula:</strong> g = 1 + [J(J+1) + S(S+1) − L(L+1)] / [2J(J+1)]<br/>
                <strong>Sof spin:</strong> L=0 bo&apos;lsa, g = 2.00<br/>
                <strong>Sof orbital:</strong> S=0 bo&apos;lsa, g = 1.00<br/>
                <strong>3d komplekslar:</strong> g ≈ 2.0−2.3 (spin-orbit bog&apos;lanish kuchsiz)<br/>
                <strong>5d/lantanoidlar:</strong> g 1 dan 2 gacha keng diapazonda
              </p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Umumiy formula: μ = g√[J(J+1)] μ<sub>B</sub>
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Bu formula <strong>spin-orbit bog&apos;lanish kuchli bo&apos;lganda</strong> (4d, 5d, lantanoidlar) qo&apos;llaniladi.
              3d-metall komplekslari uchun odatda spin-only formula yetarli.
            </p>
          </div>
        </div>

        {/* ── 6. MAGNIT MOMENTNING AMALIY AHAMIYATI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Kompleks kimyosida magnit momentning diagnostik ahamiyati</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Oksidlanish darajasini aniqlash",
                matn: "μ<sub>eff</sub> qiymati juftlanmagan elektronlar sonini (n) beradi. n orqali metall ionining d-elektronlar soni va demak, oksidlanish darajasi aniqlanadi. Masalan: Fe²⁺ (d⁶, YS) — n=4, μ ≈ 5.1−5.5; Fe³⁺ (d⁵, YS) — n=5, μ ≈ 5.9.",
              },
              {
                sarlavha: "Spin holatini farqlash (YS vs QS)",
                matn: "d⁴−d⁷ konfiguratsiyalar uchun spin-only qiymatlar YS va QS holatlarda keskin farq qiladi. d⁶: YS (n=4, μ=4.90) vs QS (n=0, μ=0). d⁷: YS (n=3, μ=3.87) vs QS (n=1, μ=1.73). Magnit o&apos;lchash spin holatini aniqlashning eng ishonchli usulidir.",
              },
              {
                sarlavha: "Geometriyani aniqlash",
                matn: "Oktaedrik va tetraedrik komplekslarda orbital hissa turlicha. Masalan, Co²⁺: oktaedrik [Co(H₂O)₆]²⁺ — μ ≈ 4.7−5.1, tetraedrik [CoCl₄]²⁻ — μ ≈ 4.3−4.8. Farq orbital hissaning geometriyaga bog&apos;liqligidan kelib chiqadi.",
              },
              {
                sarlavha: "Ko&apos;p yadroli komplekslarda almashinuv",
                matn: "Ikki yadroli komplekslarda xona haroratidagi μ<sub>eff</sub> qiymati metall ionlari orasidagi magnit almashinuv (J) haqida ma&apos;lumot beradi. μ<sub>eff</sub> spin-only dan kichik bo&apos;lsa — antiferromagnit almashinuv.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Spin-only formula:</strong> μ<sub>SO</sub> = √[n(n+2)] μ<sub>B</sub> — 3d komplekslar uchun asosiy hisoblash formulasi</li>
            <li><strong className="text-yellow-400">A va E termli</strong> komplekslarda (d³, d⁵(YS), d⁸, d⁶(QS)) orbital hissa deyarli yo&apos;q — μ<sub>eff</sub> ≈ μ<sub>SO</sub></li>
            <li><strong className="text-yellow-400">T termli</strong> komplekslarda (d¹, d², d⁶(YS), d⁷(YS)) orbital hissa sezilarli — μ<sub>eff</sub> &gt; μ<sub>SO</sub></li>
            <li><strong className="text-yellow-400">d⁷(YS) Co²⁺</strong> — eng kuchli orbital hissa: μ<sub>SO</sub> = 3.87, μ<sub>eff</sub> = 4.3−5.2 μ<sub>B</sub></li>
            <li><strong className="text-yellow-400">Magnit moment</strong> — oksidlanish darajasi, spin holati va geometriyani aniqlashning eng ishonchli eksperimental usuli</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Magnit xossalari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/magnit/sezgirlik" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Magnit sezgirlik →
          </Link>
        </div>

      </section>
    </main>
  )
}