import Link from "next/link"

export default function DDvsCTPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="hover:text-purple-300">Zaryad ko'chishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">d-d vs CT</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🌈</span>
                d-d o'tishlar vs Charge Transfer
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Elektron spektrlar — ikki xil mexanizm, ikki xil natija
              </p>
            </div>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Zaryad ko'chishi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                d-d o'tishlar
              </span>
              <br />
              <span className="text-white text-3xl md:text-4xl">vs Charge Transfer</span>
            </h2>
            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              Kompleks birikmalarning rangini belgilovchi <strong className="text-yellow-400">ikki asosiy mexanizm</strong>.
              d-d o'tishlar — metallning ichki d-orbitallarida, Charge Transfer — metall va ligand o'rtasida.
              Farqlarini tushunish — spektrlarni to'g'ri talqin qilish kaliti.
            </p>
          </div>
        </div>

        {/* ASOSIY FARQLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Asosiy farqlar
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-4 text-yellow-400">Xususiyat</th>
                  <th className="py-3 px-4 text-blue-400">d-d o'tishlar</th>
                  <th className="py-3 px-4 text-red-400">Charge Transfer (CT)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Mexanizm</td>
                  <td className="py-3 px-4">Metallning d-orbitallari orasida elektron o'tishi</td>
                  <td className="py-3 px-4">Metall ↔ Ligand orasida elektron ko'chishi</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Turlari</td>
                  <td className="py-3 px-4">Faqat bitta tur (d-d)</td>
                  <td className="py-3 px-4">LMCT, MLCT, IVCT, LLCT</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Molyar ekstinksiya (ε)</td>
                  <td className="py-3 px-4 font-mono text-blue-400">1-100 L/(mol·cm)</td>
                  <td className="py-3 px-4 font-mono text-red-400">1,000-50,000 L/(mol·cm)</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Tanlash qoidalari</td>
                  <td className="py-3 px-4">Laporte ta'qiqlangan (g→g), spin ta'qiqlangan bo'lishi mumkin</td>
                  <td className="py-3 px-4">Ruxsat etilgan (kuchli intensivlik)</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Spektr kengligi</td>
                  <td className="py-3 px-4">Keng (vibronic coupling)</td>
                  <td className="py-3 px-4">O'rta-keng</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Rang intensivligi</td>
                  <td className="py-3 px-4">Och, past intensivlik</td>
                  <td className="py-3 px-4">To'q, yuqori intensivlik</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 text-purple-400 font-semibold">Energiya diapazoni</td>
                  <td className="py-3 px-4 font-mono text-xs">10,000-30,000 cm⁻¹</td>
                  <td className="py-3 px-4 font-mono text-xs">20,000-50,000 cm⁻¹</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-purple-400 font-semibold">Qo'llanilishi</td>
                  <td className="py-3 px-4">Kristall maydon parametrini (Δ) aniqlash</td>
                  <td className="py-3 px-4">Redoks xususiyatlar, elektron struktura</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* D-D O'TISHLAR */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔵</span>
            d-d o'tishlar (Crystal Field Transitions)
          </h2>
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-4">Mexanizm</h3>
              <p className="text-purple-200 leading-relaxed mb-4">
                Metall ionining <strong className="text-yellow-400">d-orbitallari</strong> orasida elektron o'tishi.
                Kristall maydon ta'sirida d-orbitallar bo'linadi (masalan, oktaedrda t₂g va eg).
                Elektron past energiyali orbitallardan yuqori energiyali orbitallarga o'tadi.
              </p>
              <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-sm text-center">
                t₂g → eg (oktaedr, Δ₀ energiya)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Tanlash qoidalari</h3>
                <ul className="space-y-3 text-sm text-purple-200">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400 flex-shrink-0">⚠️</span>
                    <span><strong>Laporte ta'qiqlangan:</strong> g → g o'tish (markaziy simmetriya)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 flex-shrink-0">⚡</span>
                    <span><strong>Spin ta'qiqlangan:</strong> ΔS ≠ 0 bo'lsa, kuchsiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 flex-shrink-0">✓</span>
                    <span><strong>Vibronic coupling:</strong> tebranishlar orqali qisman ruxsat</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-3">Misol: [Ti(H₂O)₆]³⁺</h3>
                <div className="space-y-2 text-sm text-purple-200">
                  <p><strong>Elektron konfiguratsiya:</strong> d¹</p>
                  <p><strong>O'tish:</strong> ²T₂g → ²E<sub>g</sub></p>
                  <p><strong>Energiya:</strong> ~20,300 cm⁻¹ (493 nm)</p>
                  <p><strong>Rang:</strong> Binafsha (sariq-yashil yutilish)</p>
                  <p><strong>ε:</strong> ~5 L/(mol·cm) (kuchsiz)</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">💡 Nima uchun kuchsiz?</h3>
              <p className="text-purple-200 leading-relaxed">
                d-d o'tishlar <strong>Laporte ta'qiqlangan</strong> — markaziy simmetriyali komplekslarda (oktaedr, tetraedr)
                dipol momenti o'zgarmaydi. Shuning uchun molyar ekstinksiya past (ε = 1-100).
                Komplekslar <strong>och rangli</strong> bo'ladi (masalan, [Cu(H₂O)₆]²⁺ — och ko'k).
              </p>
            </div>
          </div>
        </div>

        {/* CHARGE TRANSFER */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔴</span>
            Charge Transfer (Zaryad ko'chishi)
          </h2>
          <div className="space-y-6">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-4">Mexanizm</h3>
              <p className="text-purple-200 leading-relaxed mb-4">
                Elektron <strong className="text-yellow-400">metall va ligand o'rtasida</strong> ko'chadi.
                Bu redoks jarayoniga o'xshaydi, lekin vaqtinchalik (qo'zg'algan holatda).
                Uch asosiy tur: <strong>LMCT</strong> (ligand → metall), <strong>MLCT</strong> (metall → ligand), <strong>IVCT</strong> (metall → metall).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-orange-900/30 border border-orange-700/50 rounded-xl p-5">
                <h4 className="text-lg font-bold text-orange-400 mb-3">LMCT</h4>
                <p className="text-xs text-purple-400 mb-2">Ligand-to-Metal Charge Transfer</p>
                <p className="text-sm text-purple-200 mb-3">Ligand → Metall</p>
                <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs">
                  L⁻ → Mⁿ⁺
                </div>
                <p className="text-xs text-purple-300 mt-3">
                  <strong>Misol:</strong> MnO₄⁻ (permanganat, binafsha)
                </p>
              </div>

              <div className="bg-pink-900/30 border border-pink-700/50 rounded-xl p-5">
                <h4 className="text-lg font-bold text-pink-400 mb-3">MLCT</h4>
                <p className="text-xs text-purple-400 mb-2">Metal-to-Ligand Charge Transfer</p>
                <p className="text-sm text-purple-200 mb-3">Metall → Ligand</p>
                <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs">
                  Mⁿ⁺ → L
                </div>
                <p className="text-xs text-purple-300 mt-3">
                  <strong>Misol:</strong> [Ru(bpy)₃]²⁺ (to'q sariq)
                </p>
              </div>

              <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-5">
                <h4 className="text-lg font-bold text-purple-400 mb-3">IVCT</h4>
                <p className="text-xs text-purple-400 mb-2">Intervalence Charge Transfer</p>
                <p className="text-sm text-purple-200 mb-3">Metall → Metall</p>
                <div className="bg-purple-950/50 rounded-lg p-3 font-mono text-xs">
                  Mⁿ⁺ → M⁽ⁿ⁺¹⁾⁺
                </div>
                <p className="text-xs text-purple-300 mt-3">
                  <strong>Misol:</strong> Prussian Blue (ko'k)
                </p>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">✓ Nima uchun kuchli?</h3>
              <p className="text-purple-200 leading-relaxed">
                Charge Transfer o'tishlari <strong>Laporte ruxsat etilgan</strong> — dipol momenti o'zgaradi.
                Shuning uchun molyar ekstinksiya yuqori (ε = 1,000-50,000).
                Komplekslar <strong>to'q rangli</strong> bo'ladi (masalan, KMnO₄ — to'q binafsha).
              </p>
            </div>
          </div>
        </div>

        {/* SOLISHTIRISH MISOLLARI */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Amaliy misollar
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">[Fe(H₂O)₆]³⁺ vs [Fe(CN)₆]³⁻</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <p className="text-blue-400 font-semibold mb-2">[Fe(H₂O)₆]³⁺ (och sariq)</p>
                  <ul className="space-y-1 text-purple-200">
                    <li>• d-d o'tishlar (kuchsiz)</li>
                    <li>• ε ~ 1-10 L/(mol·cm)</li>
                    <li>• Och rang</li>
                  </ul>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">[Fe(CN)₆]³⁻ (to'q qizil)</p>
                  <ul className="space-y-1 text-purple-200">
                    <li>• LMCT (CN⁻ → Fe³⁺)</li>
                    <li>• ε ~ 1,000-5,000 L/(mol·cm)</li>
                    <li>• To'q rang</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">[Cu(H₂O)₆]²⁺ vs [Cu(NH₃)₄(H₂O)₂]²⁺</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <p className="text-blue-400 font-semibold mb-2">[Cu(H₂O)₆]²⁺ (och ko'k)</p>
                  <ul className="space-y-1 text-purple-200">
                    <li>• d-d o'tishlar</li>
                    <li>• ε ~ 10-20 L/(mol·cm)</li>
                    <li>• Och ko'k</li>
                  </ul>
                </div>
                <div className="bg-purple-950/50 rounded-lg p-4">
                  <p className="text-red-400 font-semibold mb-2">[Cu(NH₃)₄(H₂O)₂]²⁺ (to'q ko'k)</p>
                  <ul className="space-y-1 text-purple-200">
                    <li>• d-d o'tishlar (kuchliroq)</li>
                    <li>• ε ~ 50-100 L/(mol·cm)</li>
                    <li>• To'q ko'k (NH₃ kuchliroq ligand)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">KMnO₄ (permanganat)</h3>
              <div className="text-sm text-purple-200 space-y-2">
                <p><strong>Mexanizm:</strong> LMCT (O²⁻ → Mn⁷⁺)</p>
                <p><strong>Energiya:</strong> ~18,000-25,000 cm⁻¹ (400-550 nm)</p>
                <p><strong>ε:</strong> ~2,000-3,000 L/(mol·cm) (juda kuchli)</p>
                <p><strong>Rang:</strong> To'q binafsha</p>
                <p className="text-yellow-300 mt-3">
                  <strong>Eslatma:</strong> Mn⁷⁺ da d-elektronlar yo'q (d⁰), shuning uchun d-d o'tishlar bo'lmaydi.
                  Faqat LMCT mavjud.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SPECTR TAHLILI */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">📈</span>
            Spektrni qanday tahlil qilish?
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">1-qadam: ε (molyar ekstinksiya) ni tekshiring</h3>
              <div className="text-sm text-purple-200 space-y-2">
                <p>• <strong>ε &lt; 100:</strong> d-d o'tish (Laporte ta'qiqlangan)</p>
                <p>• <strong>ε &gt; 1,000:</strong> Charge Transfer (ruxsat etilgan)</p>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">2-qadam: Energiya diapazonini tekshiring</h3>
              <div className="text-sm text-purple-200 space-y-2">
                <p>• <strong>10,000-30,000 cm⁻¹:</strong> d-d o'tishlar (Δ₀ qiymati)</p>
                <p>• <strong>20,000-50,000 cm⁻¹:</strong> Charge Transfer</p>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-green-400 mb-3">3-qadam: Simmetriyani hisobga oling</h3>
              <div className="text-sm text-purple-200 space-y-2">
                <p>• <strong>Oktaedr (Oₕ):</strong> d-d ta'qiqlangan, CT ruxsat etilgan</p>
                <p>• <strong>Tetraedr (T<sub>d</sub>):</strong> d-d qisman ruxsat (markaziy simmetriya yo'q)</p>
                <p>• <strong>Tekis kvadrat (D₄ₕ):</strong> d-d ta'qiqlangan</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-4xl">✅</span>
            Xulosa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">d-d o'tishlar</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Metall d-orbitallari ichida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Laporte ta'qiqlangan (g→g)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Kuchsiz (ε = 1-100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Och rang</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>Δ₀ parametrini aniqlash</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3">Charge Transfer</h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Metall ↔ Ligand orasida</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Laporte ruxsat etilgan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Kuchli (ε = 1,000-50,000)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>To'q rang</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>Redoks xususiyatlar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Zaryad ko'chishi
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" className="px-6 py-3 bg-orange-600/60 hover:bg-orange-500/80 border border-orange-500/50 rounded-xl text-white font-semibold">
              LMCT
            </Link>
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 bg-pink-600/60 hover:bg-pink-500/80 border border-pink-500/50 rounded-xl text-white font-semibold">
              MLCT →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Chuqurlashgan mavzular</p>
          <p className="mt-1">d-d o'tishlar vs Charge Transfer • Elektron spektroskopiya</p>
        </div>
      </footer>
    </main>
  )
}