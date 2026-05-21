import Link from "next/link"

export default function TanabeSugano() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">📉 Tanabe-Sugano diagrammalari</h1>
          <p className="text-purple-400 text-sm">d²−d⁸ konfiguratsiyalar • Δo/B parametr • Yuqori/quyi spin o&apos;tishlari • Diagrammani o&apos;qish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Tanabe-Sugano diagrammalari haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tanabe-Sugano (TS) diagrammalari</strong> — 1954 yilda Yukito Tanabe 
              va Satoru Sugano tomonidan taklif qilingan <strong>to&apos;liq energetik diagrammalar</strong>.
              Ular Orgel diagrammalaridan farqli ravishda <strong>barcha spin holatlarini</strong> 
              (yuqori va quyi spinli) o&apos;z ichiga oladi. TS diagrammalarida ordinata o&apos;qida 
              <strong> E/B</strong>, abssissa o&apos;qida <strong>Δ<sub>o</sub>/B</strong> (yoki Δ/B) 
              normallashtirilgan qiymatlari qo&apos;llaniladi, bu yerda <strong>B</strong> — Racah parametri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Orgel dan farqi</h3>
              <p className="text-purple-200 text-sm">
                • <strong>Barcha spin holatlar</strong> — yuqori va quyi spin<br/>
                • <strong>Normallashtirilgan o&apos;qlar</strong> — E/B vs Δ/B<br/>
                • <strong>Racah parametrlari</strong> B va C ni hisobga oladi<br/>
                • <strong>Kvantitativ</strong> — spektrlarni aniq tahlil qilish imkonini beradi
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy tushunchalar</h3>
              <p className="text-purple-200 text-sm">
                • <strong>Racah B</strong> — elektronlararo itarilish parametri<br/>
                • <strong>Racah C</strong> — ikkinchi Racah parametri (C ≈ 4B)<br/>
                • <strong>Δ<sub>o</sub>/B</strong> — ligand maydon kuchining normallashtirilgan o&apos;lchovi<br/>
                • <strong>Asosiy sath</strong> — har doim E=0 (abssissa chizig&apos;i)
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. RACAH PARAMETRLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Racah parametrlari — B va C</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Racah parametrlari</strong> — elektronlararo itarilish energiyasini 
              ifodalovchi empirik konstantalar. <strong>B</strong> — asosiy Racah parametri (d-orbitallar orasidagi 
              itarilish), <strong>C</strong> — ikkinchi Racah parametri (ko&apos;pincha C ≈ 4B deb olinadi).
              Erkin ion va kompleksda B qiymati farq qiladi — bu <strong>nefelauksetrik effekt</strong> deb ataladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">B<sub>erkin</sub> (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">C (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">C/B</th>
                <th className="py-3 px-4 text-purple-300">B<sub>kompleks</sub> (cm⁻¹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ti²⁺", "720", "2630", "3.65", "—"],
                  ["V²⁺", "765", "2855", "3.73", "—"],
                  ["V³⁺", "860", "3210", "3.73", "~660"],
                  ["Cr³⁺", "1030", "3850", "3.74", "~760"],
                  ["Mn²⁺", "960", "3325", "3.46", "~860"],
                  ["Fe²⁺", "1060", "3900", "3.68", "~900"],
                  ["Co²⁺", "1120", "4360", "3.89", "~970"],
                  ["Ni²⁺", "1080", "4830", "4.47", "~940"],
                  ["Cu²⁺", "1240", "4660", "3.76", "~1100"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-blue-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Racah parametrlarining fizik ma&apos;nosi</h3>
            <p className="text-purple-200 text-sm">
              B parametri <strong>elektronlararo Kulon itarilishi</strong>ni ifodalaydi. Erkin ionda 
              elektronlar bir-biriga yaqinroq — B katta. Kompleksda d-orbitallar ligand orbitallari bilan 
              aralashib kengayadi (delokalizatsiya), elektronlar bir-biridan uzoqlashadi — B kichiklashadi.
              B<sub>kompleks</sub> / B<sub>erkin</sub> = <strong>β — nefelauksetrik koeffitsiyent</strong> (β &lt; 1).
            </p>
          </div>
        </div>

        {/* ── 3. TS DIAGRAMMA TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 TS diagramma tuzilishi va o&apos;qish qoidalari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Tanabe-Sugano diagrammasi <strong className="text-yellow-400">ikki qismdan</strong> iborat: 
            chap tomonda <strong>kuchsiz maydon</strong> (kichik Δ/B, yuqori spin), o&apos;ng tomonda 
            <strong> kuchli maydon</strong> (katta Δ/B, quyi spin). Diagrammaning o&apos;rtasida — 
            <strong> spin-krossover nuqtasi</strong>.
          </p>

          <div className="space-y-4">
            {[
              {
                qadam: "1. Abssissa o&apos;qi — Δ/B",
                izoh: "Ligand maydon kuchining normallashtirilgan qiymati. Δ<sub>o</sub> qancha katta bo&apos;lsa, shuncha o&apos;ng tomonga siljiydi. Amalda Δ<sub>o</sub>/B odatda 10−40 oralig&apos;ida.",
              },
              {
                qadam: "2. Ordinata o&apos;qi — E/B",
                izoh: "Energiyaning normallashtirilgan qiymati. Asosiy sath har doim E=0 (abssissa chizig&apos;i). Qo&apos;zg&apos;algan sathlar yuqoriga qarab ko&apos;tariladi.",
              },
              {
                qadam: "3. Asosiy sathni topish",
                izoh: "Har bir diagrammada asosiy sath abssissa bo&apos;ylab E=0 chizig&apos;ida joylashgan. Sath belgisi diagramma boshida yozilgan bo&apos;ladi. d³ uchun — ⁴A₂<sub>g</sub>, d⁸ uchun — ³A₂<sub>g</sub>.",
              },
              {
                qadam: "4. Spin-krossover nuqtasi",
                izoh: "Diagrammaning o&apos;rtasida vertikal chiziq — bu yuqori spin (chap) va quyi spin (o&apos;ng) orasidagi chegara. Bu nuqtada Δ<sub>o</sub> juflanish energiyasiga teng bo&apos;ladi.",
              },
              {
                qadam: "5. O&apos;tish energiyasini hisoblash",
                izoh: "Berilgan Δ/B qiymati uchun vertikal chiziq chiziladi. Shu chiziqning sathlar bilan kesishgan nuqtalarining E/B qiymatlari o&apos;qiladi. ν = (E/B) × B cm⁻¹.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. d² TS DIAGRAMMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟡 d² Tanabe-Sugano diagrammasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d² konfiguratsiya (V³⁺, Cr⁴⁺) — eng oddiy TS diagrammalaridan biri. Erkin ion termlari: 
              <strong> ³F</strong> (asosiy), <strong>³P, ¹G, ¹D, ¹S</strong>. Oktaedrik maydonda 
              ³F dan <strong>³T₁<sub>g</sub>, ³T₂<sub>g</sub>, ³A₂<sub>g</sub></strong> hosil bo&apos;ladi.
              d² da yuqori/quyi spin muammosi yo&apos;q (faqat yuqori spin mavjud).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O&apos;tish</th>
                <th className="py-3 px-4 text-purple-300">Term belgisi</th>
                <th className="py-3 px-4 text-purple-300">Δ/B=20 da E/B</th>
                <th className="py-3 px-4 text-purple-300">Spin holati</th>
                <th className="py-3 px-4 text-purple-300">Intensivlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["ν₁", "³T₁<sub>g</sub>(F) → ³T₂<sub>g</sub>", "~15", "Ruxsat", "O&apos;rtacha"],
                  ["ν₂", "³T₁<sub>g</sub>(F) → ³T₁<sub>g</sub>(P)", "~32", "Ruxsat", "O&apos;rtacha"],
                  ["ν₃", "³T₁<sub>g</sub>(F) → ³A₂<sub>g</sub>", "~38", "Ruxsat", "Kuchsiz"],
                  ["ν₄", "³T₁<sub>g</sub>(F) → ¹T₂<sub>g</sub>", "~25", "Taqiq", "Juda kuchsiz"],
                  ["ν₅", "³T₁<sub>g</sub>(F) → ¹E<sub>g</sub>", "~28", "Taqiq", "Juda kuchsiz"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">
                      {r[3] === "Ruxsat" 
                        ? <span className="text-green-400">✓</span> 
                        : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Misol: [V(H₂O)₆]³⁺</h3>
            <p className="text-purple-200 text-sm">
              V³⁺ — d² konfiguratsiya. <strong>B ≈ 660 cm⁻¹</strong> (erkin ionda 860 cm⁻¹).<br/>
              Spektrda: ν₁ ≈ 17,200 cm⁻¹ (³T₁<sub>g</sub> → ³T₂<sub>g</sub>), 
              ν₂ ≈ 25,600 cm⁻¹ (³T₁<sub>g</sub> → ³T₁<sub>g</sub>(P)).<br/>
              ν₁/B ≈ 26, ν₂/B ≈ 39. TS diagrammasidan Δ<sub>o</sub>/B ≈ 28 topiladi.
              <strong>Δ<sub>o</sub> ≈ 18,500 cm⁻¹.</strong>
            </p>
          </div>
        </div>

        {/* ── 5. d³ TS DIAGRAMMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟢 d³ Tanabe-Sugano diagrammasi (Cr³⁺)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d³ konfiguratsiya — <strong className="text-yellow-400">Cr³⁺ komplekslari</strong> uchun asosiy diagramma.
              Erkin ion: ⁴F (asosiy), ⁴P, ²G, ²F, ²D, ²P, ²H. Oktaedrik maydonda asosiy sath —
              <strong> ⁴A₂<sub>g</sub></strong>. d³ da faqat yuqori spin mavjud (t₂g³ barqaror).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Spin-ruxsat o&apos;tishlar (kvartet→kvartet)</h3>
              <p className="text-purple-200 text-sm">
                • ν₁: ⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub> (Δ<sub>o</sub>/B da E/B ≈ Δ<sub>o</sub>/B)<br/>
                • ν₂: ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(F)<br/>
                • ν₃: ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(P)<br/>
                <strong>ν₁ to&apos;g&apos;ridan-to&apos;g&apos;ri Δ<sub>o</sub> ga teng!</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Spin-taqiq o&apos;tishlar (kvartet→dublet)</h3>
              <p className="text-purple-200 text-sm">
                • ⁴A₂<sub>g</sub> → ²E<sub>g</sub> (juda kuchsiz)<br/>
                • ⁴A₂<sub>g</sub> → ²T₁<sub>g</sub><br/>
                • ⁴A₂<sub>g</sub> → ²T₂<sub>g</sub><br/>
                <strong>Bu o&apos;tishlar Cr³⁺ ning lazer xossalarini belgilaydi (rubin)!</strong>
              </p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <h3 className="text-green-400 font-bold mb-2">Misol: [Cr(H₂O)₆]³⁺ spektrini tahlil qilish</h3>
            <p className="text-purple-200 text-sm">
              Eksperimental spektr:<br/>
              • ν₁ = 17,400 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub>) → <strong>Δ<sub>o</sub> = 17,400 cm⁻¹</strong><br/>
              • ν₂ = 24,600 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>)<br/>
              • ν₃ = 37,800 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(P))<br/>
              ν₂/ν₁ = 24,600/17,400 = 1.41. TS diagrammasidan Δ<sub>o</sub>/B ≈ 24.<br/>
              <strong>B = 17,400/24 ≈ 725 cm⁻¹. β = 725/1030 = 0.70</strong>
            </p>
          </div>
        </div>

        {/* ── 6. d⁴−d⁷ SPIN-KROSSOVER ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 d⁴−d⁷: Spin-krossover va TS diagrammasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d⁴, d⁵, d⁶, d⁷ konfiguratsiyalar uchun TS diagrammasi <strong className="text-yellow-400">ikki qismdan</strong> 
              iborat: chapda yuqori spin (kuchsiz maydon), o&apos;ngda quyi spin (kuchli maydon).
              O&apos;rtadagi vertikal chiziq — <strong>spin-krossover nuqtasi</strong>.
              Bu konfiguratsiyalarda komplekslar <strong>ligand maydon kuchiga qarab</strong> 
              yuqori yoki quyi spinli bo&apos;lishi mumkin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Yuqori spin</th>
                <th className="py-3 px-4 text-purple-300">Quyi spin</th>
                <th className="py-3 px-4 text-purple-300">Krossover sharti</th>
                <th className="py-3 px-4 text-purple-300">Misol (YS)</th>
                <th className="py-3 px-4 text-purple-300">Misol (QS)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d⁴", "t₂g³ eg¹ (⁵D)", "t₂g⁴ eg⁰ (³H)", "Δ<sub>o</sub> > P", "Cr²⁺, Mn³⁺", "Mn³⁺ (CN⁻)"],
                  ["d⁵", "t₂g³ eg² (⁶S)", "t₂g⁵ eg⁰ (²I)", "Δ<sub>o</sub> > P", "Fe³⁺, Mn²⁺", "Fe³⁺ (CN⁻)"],
                  ["d⁶", "t₂g⁴ eg² (⁵D)", "t₂g⁶ eg⁰ (¹I)", "Δ<sub>o</sub> > P", "Fe²⁺ (H₂O)", "Fe²⁺ (CN⁻)"],
                  ["d⁷", "t₂g⁵ eg² (⁴F)", "t₂g⁶ eg¹ (²G)", "Δ<sub>o</sub> > P", "Co²⁺ (H₂O)", "Co²⁺ (CN⁻)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-xs text-blue-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-orange-400 font-bold mb-2">Juflanish energiyasi (P) va spin-krossover</h3>
            <p className="text-purple-200 text-sm">
              Spin holati Δ<sub>o</sub> va <strong>juflanish energiyasi P</strong> o&apos;rtasidagi raqobat bilan belgilanadi.
              Δ<sub>o</sub> &lt; P → yuqori spin (elektronlar juflanishdan ko&apos;ra yuqori orbitallarga o&apos;tadi).
              Δ<sub>o</sub> &gt; P → quyi spin (elektronlar past orbitallarda juflanishni afzal ko&apos;radi).
              Δ<sub>o</sub> ≈ P bo&apos;lganda — <strong>spin-krossover</strong> (harorat, bosim bilan spin o&apos;zgaradi).
            </p>
          </div>
        </div>

        {/* ── 7. d⁸ TS DIAGRAMMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 d⁸ Tanabe-Sugano diagrammasi (Ni²⁺)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d⁸ konfiguratsiya (Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺) — eng ko&apos;p qo&apos;llaniladigan TS diagrammalaridan biri.
              Erkin ion: ³F (asosiy), ³P, ¹G, ¹D, ¹S. Oktaedrik maydonda asosiy — <strong>³A₂<sub>g</sub></strong>.
              d⁸ da faqat yuqori spin mavjud. Diagramma uchta spin-ruxsat o&apos;tishni ko&apos;rsatadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O&apos;tish</th>
                <th className="py-3 px-4 text-purple-300">Boshlang&apos;ich → Oxirgi</th>
                <th className="py-3 px-4 text-purple-300">Δ/B=10 da E/B</th>
                <th className="py-3 px-4 text-purple-300">Energiya ifodasi</th>
                <th className="py-3 px-4 text-purple-300">Eslatma</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["ν₁", "³A₂<sub>g</sub> → ³T₂<sub>g</sub>", "10", "= Δ<sub>o</sub>", "Eng past energiyali"],
                  ["ν₂", "³A₂<sub>g</sub> → ³T₁<sub>g</sub>(F)", "~12.5", "≈ 1.25Δ<sub>o</sub>", "O&apos;rtacha intensivlik"],
                  ["ν₃", "³A₂<sub>g</sub> → ³T₁<sub>g</sub>(P)", "~21", "≈ 2.1Δ<sub>o</sub>", "UV sohada, kuchli"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-green-400">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kvadrat-planar komplekslar</h3>
              <p className="text-purple-200 text-sm">
                d⁸ konfiguratsiya kvadrat-planar geometriyaga moyil (ayniqsa 4d va 5d: Pd²⁺, Pt²⁺, Au³⁺).
                Buning sababi — Yuqori energiyali dx²−y² orbital bo&apos;sh qoladi, kuchli ligand maydoni 
                kvadrat-planar geometriyani barqarorlashtiradi. [Ni(CN)₄]²⁻ — klassik misol.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ni²⁺ spektrida ν₂/ν₁ nisbati</h3>
              <p className="text-purple-200 text-sm">
                Ni²⁺ komplekslarida ν₂/ν₁ nisbati <strong>geometriya haqida ma&apos;lumot</strong> beradi.<br/>
                • Oktaedrik: ν₂/ν₁ ≈ 1.5−1.7<br/>
                • Tetraedrik: ν₂/ν₁ ≈ 1.9−2.1<br/>
                • Kvadrat-planar: 3 ta polosa butunlay boshqacha nisbatda
              </p>
            </div>
          </div>
        </div>

        {/* ── 8. AMALIY HISOBLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 TS diagrammasi yordamida amaliy hisoblash</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-yellow-400 font-bold text-lg text-center">
              Algoritm: ν₁, ν₂, ν₃ → ν₂/ν₁ nisbati → TS diagrammasi → Δ<sub>o</sub>/B → Δ<sub>o</sub> va B
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qadam: "1-qadam: Eksperimental polosalarni aniqlash",
                izoh: "UB-Vis spektrdan spin-ruxsat polosalarning to&apos;lqin sonlarini (cm⁻¹) aniqlang. d⁸ (Ni²⁺) uchun odatda 3 ta polosa kuzatiladi.",
              },
              {
                qadam: "2-qadam: ν₂/ν₁ nisbatini hisoblash",
                izoh: "ν₁ — eng past energiyali polosa. ν₂/ν₁ nisbatini hisoblang. Bu nisbat Δ<sub>o</sub>/B ga bog&apos;liq. TS diagrammasidagi maxsus jadval yoki grafikdan foydalaning.",
              },
              {
                qadam: "3-qadam: Δ<sub>o</sub>/B ni topish",
                izoh: "ν₂/ν₁ nisbati orqali TS diagrammasidan (yoki jadvaldan) Δ<sub>o</sub>/B qiymatini toping. d⁸ uchun ν₂/ν₁ = 1.67 bo&apos;lsa, Δ<sub>o</sub>/B ≈ 10.",
              },
              {
                qadam: "4-qadam: B ni hisoblash",
                izoh: "ν₁ = Δ<sub>o</sub> (d³ va d⁸ uchun). Δ<sub>o</sub>/B = X topilgach, B = ν₁/X. Masalan: ν₁ = 8,700 cm⁻¹, Δ<sub>o</sub>/B = 10 → B = 870 cm⁻¹.",
              },
              {
                qadam: "5-qadam: β (nefelauksetrik koeffitsiyent)",
                izoh: "β = B<sub>kompleks</sub> / B<sub>erkin ion</sub>. Ni²⁺ erkin ioni uchun B = 1080 cm⁻¹. β = 870/1080 = 0.805. β qancha kichik bo&apos;lsa, kovalentlik shuncha yuqori.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-yellow-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Tanabe-Sugano diagrammalari</strong> — barcha spin holatlar uchun to&apos;liq energetik diagrammalar</li>
            <li><strong className="text-yellow-400">E/B vs Δ/B</strong> normallashtirilgan o&apos;qlar — Racah B parametri orqali universallik</li>
            <li><strong className="text-yellow-400">Spin-krossover:</strong> d⁴−d⁷ konfiguratsiyalarda Δ<sub>o</sub> va P raqobati</li>
            <li><strong className="text-yellow-400">d³ va d⁸:</strong> ν₁ = Δ<sub>o</sub> — to&apos;g&apos;ridan-to&apos;g&apos;ri aniqlash imkonini beradi</li>
            <li><strong className="text-yellow-400">Nefelauksetrik effekt:</strong> β = B<sub>komp</sub>/B<sub>erkin</sub> — kovalentlik darajasining o&apos;lchovi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/orgel-diagrammalari" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Orgel diagrammalari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/rang" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Komplekslarning rangi →
          </Link>
        </div>

      </section>
    </main>
  )
}