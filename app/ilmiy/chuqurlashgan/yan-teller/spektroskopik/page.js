import Link from "next/link"

export default function Spektroskopik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/yan-teller" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Yan-Teller
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📊 Spektroskopik namoyon bo&apos;lishi</h1>
          <p className="text-purple-400 text-sm">UB-Vis polosa ajralishi • IQ siljishlar • EPR anizotropiyasi • Tanlash qoidalari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spektroskopik aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Yan-Teller effekti <strong className="text-yellow-400">spektroskopik usullarda</strong> yaqqol namoyon bo&apos;ladi.
              Oddiy oktaedr va cho&apos;zilgan oktaedrning spektrlari <strong className="text-yellow-400">sezilarli farq qiladi</strong>.
              UB-Vis, IQ va EPR spektroskopiya Yan-Teller buzilishini aniqlashning eng ishonchli usullaridir.
              Simmetriyaning O<sub>h</sub> dan D<sub>4h</sub> ga pasayishi <strong className="text-yellow-400">tanlash qoidalarining o&apos;zgarishiga</strong> olib keladi.
            </p>
          </div>
        </div>

        {/* ── 2. UB-Vis SPEKTROSKOPIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 UB-Vis spektroskopiya</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            UB-Vis spektroskopiya Yan-Teller effektini aniqlashning <strong className="text-yellow-400">eng qulay usulidir</strong>.
            Oddiy oktaedrda Cu²⁺ uchun <strong>1 ta</strong> d-d o&apos;tish kutiladi (²E<sub>g</sub> → ²T<sub>2g</sub>).
            Cho&apos;zilgan oktaedrda esa energiya sathlari ajralib, <strong>2-3 ta polosa</strong> kuzatiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Oddiy oktaedr (O<sub>h</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>1 ta polosa:</strong> ²E<sub>g</sub> → ²T<sub>2g</sub><br/>
                Cu²⁺ da ≈ 12,500 cm⁻¹ (800 nm)<br/>
                <strong>Yagona, keng polosa</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Cho&apos;zilgan oktaedr (D<sub>4h</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>2-3 ta polosa:</strong><br/>
                ²B<sub>1g</sub> → ²A<sub>1g</sub> (≈ 10,000 cm⁻¹)<br/>
                ²B<sub>1g</sub> → ²B<sub>2g</sub> (≈ 12,500 cm⁻¹)<br/>
                ²B<sub>1g</sub> → ²E<sub>g</sub> (≈ 14,000 cm⁻¹)
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-4">
            <h3 className="text-blue-400 font-bold mb-2">[Cu(H₂O)₆]²⁺ spektri</h3>
            <p className="text-purple-200 text-sm">
              Suvli eritmada Cu²⁺ ning spektrida <strong>keng assimmetrik polosa</strong> kuzatiladi 
              (maksimum ≈ 800 nm). Bu polosa aslida <strong>2-3 ta yaqin polosaning superpozitsiyasi</strong>.
              Past haroratda (77 K) polosalar aniq ajraladi — bu Yan-Teller effektining bevosita isbotidir.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">λ<sub>max</sub> (nm)</th>
                <th className="py-3 px-4 text-purple-300">To&apos;lqin soni (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Rang</th>
                <th className="py-3 px-4 text-purple-300">Polosalar soni</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Cu(H₂O)₆]²⁺", "~800", "~12,500", "Och ko&apos;k", "1 (keng), 2-3 (77 K)"],
                  ["[Cu(NH₃)₄(H₂O)₂]²⁺", "~600", "~16,700", "To&apos;q ko&apos;k", "2"],
                  ["[Cu(en)₂(H₂O)₂]²⁺", "~550", "~18,200", "Binafsha-ko&apos;k", "2"],
                  ["[CuCl₄]²⁻", "~400", "~25,000", "Sariq-yashil", "3"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-sm text-blue-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. ENERGIYA SATHLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Energiya sathlarining ajralishi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Oktaedr cho&apos;zilganda <strong className="text-yellow-400">simmetriya O<sub>h</sub> dan D<sub>4h</sub> ga pasayadi</strong>.
            Natijada energiya sathlari qo&apos;shimcha ravishda ajraladi. Term belgilar o&apos;zgaradi:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O<sub>h</sub> simmetriya</th>
                <th className="py-3 px-4 text-purple-300">D<sub>4h</sub> simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Degeneratlik</th>
                <th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  { o: "²E<sub>g</sub>", d: "²A<sub>1g</sub> + ²B<sub>1g</sub>", deg: "2 → 1+1", izoh: "eg orbitallar ajraladi" },
                  { o: "²T<sub>2g</sub>", d: "²B<sub>2g</sub> + ²E<sub>g</sub>", deg: "3 → 1+2", izoh: "t₂g orbitallar ajraladi" },
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r.o }}></td>
                    <td className="py-3 px-4 text-blue-400 font-semibold" dangerouslySetInnerHTML={{ __html: r.d }}></td>
                    <td className="py-3 px-4 text-sm">{r.deg}</td>
                    <td className="py-3 px-4 text-sm">{r.izoh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Muhim:</strong> ²E<sub>g</sub> holatning ajralishi aynan Yan-Teller effektiga sabab bo&apos;ladi.
              ²A<sub>1g</sub> (dz²) va ²B<sub>1g</sub> (dx²−y²) energiyalari farqi — Yan-Teller barqarorlashish energiyasidir.
            </p>
          </div>
        </div>

        {/* ── 4. IQ SPEKTROSKOPIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📈 IQ spektroskopiya</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Yan-Teller buzilishi <strong className="text-yellow-400">IQ spektrda yangi polosalar paydo bo&apos;lishiga</strong> olib keladi.
            Oddiy oktaedrda faqat <strong>T<sub>1u</sub></strong> simmetriyali tebranishlar IQ-faol bo&apos;lsa,
            simmetriya pasayganda yangi tebranish modlari IQ-faol bo&apos;lib qoladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                metod: "M-L valent tebranishlari",
                desc: "Cho&apos;zilgan oktaedrda Cu-O(ekv) va Cu-O(aks) tebranish chastotalari farq qiladi. ν(Cu-O<sub>ekv</sub>) &gt; ν(Cu-O<sub>aks</sub>).",
              },
              {
                metod: "Yangi polosalar",
                desc: "O<sub>h</sub> da Raman-faol bo&apos;lgan tebranishlar D<sub>4h</sub> da IQ-faol bo&apos;lib qoladi. Polosalar soni ortadi.",
              },
              {
                metod: "Cho&apos;qqi siljishi",
                desc: "Bog&apos; uzunligi o&apos;zgarishi bilan tebranish chastotasi siljiydi. Uzunroq bog&apos; → past chastota.",
              },
              {
                metod: "Haroratga bog&apos;liqlik",
                desc: "Dinamik Yan-Teller holatida harorat oshishi bilan polosalar kengayadi va birlashadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.metod}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.desc }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. EPR SPEKTROSKOPIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 EPR spektroskopiya</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Elektron paramagnit rezonans (EPR)</strong> — Cu²⁺ (d⁹, S = ½) 
              uchun eng informativ usullardan biri. Yan-Teller buzilishi <strong className="text-yellow-400">g-faktor anizotropiyasida</strong> namoyon bo&apos;ladi.
              Oddiy oktaedrda g<sub>∥</sub> = g<sub>⊥</sub>, cho&apos;zilgan oktaedrda esa 
              <strong> g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.00</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-gray-400 font-bold mb-2">Oddiy oktaedr</h3>
              <p className="text-purple-200 text-sm">Izotrop g-faktor</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">g = 2.10</p>
              <p className="text-purple-400 text-xs">g<sub>∥</sub> = g<sub>⊥</sub></p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Cho&apos;zilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">Aksial anizotropiya</p>
              <p className="text-green-400 font-bold text-lg mt-2">g<sub>∥</sub> &gt; g<sub>⊥</sub></p>
              <p className="text-purple-400 text-xs">g<sub>∥</sub> ≈ 2.35, g<sub>⊥</sub> ≈ 2.07</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Siqilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">Teskari anizotropiya</p>
              <p className="text-orange-400 font-bold text-lg mt-2">g<sub>⊥</sub> &gt; g<sub>∥</sub></p>
              <p className="text-purple-400 text-xs">Kam uchraydi</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-5">
            <p className="text-orange-300 text-sm">
              <strong>Diagnostik qoida:</strong> Agar g<sub>∥</sub> &gt; g<sub>⊥</sub> &gt; 2.00 bo&apos;lsa — 
              <strong> cho&apos;zilgan oktaedr</strong> (Cu²⁺ uchun tipik). 
              Agar g<sub>⊥</sub> &gt; g<sub>∥</sub> &gt; 2.00 bo&apos;lsa — <strong>siqilgan oktaedr</strong>.
              Cu²⁺ komplekslarining 99% da g<sub>∥</sub> &gt; g<sub>⊥</sub> kuzatiladi.
            </p>
          </div>
        </div>

        {/* ── 6. TANLASH QOIDALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Tanlash qoidalari o&apos;zgarishi</h2>
          
          <div className="space-y-4">
            {[
              {
                qoida: "Laport qoidasi",
                oddiy: "g → g taqiqlangan (O<sub>h</sub> da d-d o&apos;tishlar taqiqlangan)",
                buzilgan: "D<sub>4h</sub> da inversiya markazi saqlanadi — Laport qoidasi amal qiladi, lekin vibronik bog&apos;lanish kuchayadi",
              },
              {
                qoida: "Spin qoidasi",
                oddiy: "ΔS = 0 (spini o&apos;zgarmaydi)",
                buzilgan: "O&apos;zgarmaydi. Cu²⁺ da S = ½, barcha o&apos;tishlar spin-ruxsat etilgan",
              },
              {
                qoida: "Simmetriya qoidasi",
                oddiy: "O<sub>h</sub> da faqat T<sub>1u</sub> → A<sub>1g</sub> ruxsat etilgan",
                buzilgan: "D<sub>4h</sub> da yangi ruxsat etilgan o&apos;tishlar paydo bo&apos;ladi (E<sub>u</sub>, A<sub>2u</sub>)",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.qoida}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-purple-400">Oddiy oktaedr:</span>
                    <p className="text-purple-200" dangerouslySetInnerHTML={{ __html: r.oddiy }}></p>
                  </div>
                  <div>
                    <span className="text-orange-400">Yan-Teller buzilganda:</span>
                    <p className="text-purple-200" dangerouslySetInnerHTML={{ __html: r.buzilgan }}></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">UB-Vis:</strong> 1 ta polosa o&apos;rniga 2-3 ta polosa — Yan-Tellerning eng aniq spektroskopik belgisi</li>
            <li><strong className="text-yellow-400">IQ:</strong> Yangi tebranish polosalari paydo bo&apos;ladi, M-L chastotalari ajraladi</li>
            <li><strong className="text-yellow-400">EPR:</strong> g<sub>∥</sub> &gt; g<sub>⊥</sub> — cho&apos;zilgan oktaedrning ishonchli diagnostik belgisi</li>
            <li><strong className="text-yellow-400">Past harorat:</strong> 77 K da spektrlar aniq ajraladi — statik Yan-Teller isboti</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/yan-teller/cu-komplekslari" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Cu²⁺ komplekslari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/yan-teller/boshqa-misollar" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Boshqa misollar →
          </Link>
        </div>

      </section>
    </main>
  )
}