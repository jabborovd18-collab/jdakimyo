import Link from "next/link"

export default function SpektrTahlil() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🔍 Spektrlarni tahlil qilish</h1>
          <p className="text-purple-400 text-sm">Eksperimental UB-Vis spektrlarni tahlil • Δo ni hisoblash • Racah B va C • Nefelauksetrik effekt</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spektr tahlilining ahamiyati</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">UB-Vis spektrlarni tahlil qilish</strong> orqali kompleks birikmalar 
              haqida quyidagi <strong>muhim parametrlarni</strong> aniqlash mumkin:
              <strong className="text-yellow-400"> Δ<sub>o</sub></strong> (ligand maydon kuchi), 
              <strong className="text-yellow-400"> Racah B va C</strong> (elektronlararo itarilish), 
              <strong className="text-yellow-400"> nefelauksetrik koeffitsiyent β</strong> (kovalentlik darajasi),
              kompleksning <strong>geometriyasi</strong> va <strong>spin holati</strong>.
              Bu ma&apos;lumotlar kompleksning tuzilishi va xossalarini chuqur tushunish imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Δ<sub>o</sub></h3>
              <p className="text-purple-200 text-sm">Ligand maydon kuchi</p>
              <p className="text-white font-bold text-lg mt-2">10,000−40,000 cm⁻¹</p>
              <p className="text-purple-400 text-xs">To&apos;g&apos;ridan ν₁ dan</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Racah B</h3>
              <p className="text-purple-200 text-sm">Elektronlararo itarilish</p>
              <p className="text-white font-bold text-lg mt-2">500−1100 cm⁻¹</p>
              <p className="text-purple-400 text-xs">ν₂/ν₁ nisbatdan</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">β</h3>
              <p className="text-purple-200 text-sm">Nefelauksetrik koeffitsiyent</p>
              <p className="text-white font-bold text-lg mt-2">0.3−1.0</p>
              <p className="text-purple-400 text-xs">B<sub>komp</sub>/B<sub>erkin</sub></p>
            </div>
          </div>
        </div>

        {/* ── 2. SPEKTRNI OLISH VA TAHLILGA TAYYORLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Eksperimental spektrni tahlilga tayyorlash</h2>
          
          <div className="space-y-4">
            {[
              {
                qadam: "1-qadam: Spektrni olish",
                izoh: "UB-Vis spektrofotometrda 200−1100 nm oralig&apos;ida spektr olinadi. Eritma konsentratsiyasi ε qiymatiga qarab tanlanadi (odatda 10⁻³−10⁻¹ M). Toza erituvchi bilan bazaviy chiziq olinadi.",
              },
              {
                qadam: "2-qadam: Polosalarni aniqlash",
                izoh: "Spektrdagi yutilish maksimumlarini (λ<sub>max</sub>) aniqlang. Har bir polosa uchun λ<sub>max</sub> va ε (yoki absorbans) qiymatlarini yozib oling. d-d o&apos;tishlar keng, CT o&apos;tishlar tor va intensiv bo&apos;ladi.",
              },
              {
                qadam: "3-qadam: To&apos;lqin soniga o&apos;tkazish",
                izoh: "λ (nm) dan to&apos;lqin soni ν (cm⁻¹) ga o&apos;tish: <strong>ν = 10⁷ / λ</strong>. Masalan: λ = 500 nm → ν = 10⁷/500 = 20,000 cm⁻¹. Bu energetik birlik — spektroskopiyada asosiy o&apos;lchov.",
              },
              {
                qadam: "4-qadam: Polosalarni belgilash",
                izoh: "Spin-ruxsat d-d polosalarni ν₁, ν₂, ν₃ deb belgilang (energiya ortishi bo&apos;yicha). Spin-taqiqlangan polosalar (juda kuchsiz) va CT polosalar (juda kuchli) alohida qayd etiladi.",
              },
              {
                qadam: "5-qadam: Keraksiz polosalarni filtrlash",
                izoh: "CT polosalar (ε > 1000) va spin-taqiqlangan polosalar (ε < 0.1) odatda TS diagrammasi tahlilida ishlatilmaydi. Faqat spin-ruxsat d-d polosalar asosiy tahlil uchun olinadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Δo NI HISOBLASH USULLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Δ<sub>o</sub> ni hisoblash usullari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Ligand maydon kuchi Δ<sub>o</sub> — kompleks kimyosidagi <strong className="text-yellow-400">eng muhim parametr</strong>.
            Uni UB-Vis spektrdan <strong>bir necha usul</strong> bilan aniqlash mumkin. Usul tanlash 
            konfiguratsiyaga va spektrdagi polosalar soniga bog&apos;liq.
          </p>

          <div className="space-y-4">
            {[
              {
                usul: "1-usul: To&apos;g&apos;ridan-to&apos;g&apos;ri aniqlash (d¹, d³, d⁶(YS), d⁸, d⁹)",
                formula: "Δ<sub>o</sub> = ν₁",
                izoh: "d¹ (Ti³⁺), d³ (Cr³⁺), d⁶(YS), d⁸ (Ni²⁺) va d⁹ (Cu²⁺) konfiguratsiyalarda ν₁ to&apos;g&apos;ridan-to&apos;g&apos;ri Δ<sub>o</sub> ga teng. Eng oddiy va aniq usul. Misol: [Ni(H₂O)₆]²⁺ da ν₁ = 8,700 cm⁻¹ → Δ<sub>o</sub> = 8,700 cm⁻¹.",
                misol: "[Cr(H₂O)₆]³⁺: ν₁ = 17,400 cm⁻¹ = Δ<sub>o</sub>",
              },
              {
                usul: "2-usul: ν₂/ν₁ nisbati orqali (d², d³, d⁷, d⁸)",
                formula: "ν₂/ν₁ → TS diagrammasi → Δ<sub>o</sub>/B → B = ν₁/(Δ<sub>o</sub>/B) → Δ<sub>o</sub>",
                izoh: "TS diagrammasidan ν₂/ν₁ nisbatiga mos Δ<sub>o</sub>/B topiladi. Keyin B hisoblanadi. Bu usul Racah B ni ham bir vaqtda beradi. d³ va d⁸ uchun eng aniq usul.",
                misol: "[Ni(H₂O)₆]²⁺: ν₂/ν₁ = 14,500/8,700 = 1.667 → Δ<sub>o</sub>/B ≈ 10.3",
              },
              {
                usul: "3-usul: O&apos;rtacha energiya usuli (d², d⁷(YS))",
                formula: "Δ<sub>o</sub> ≈ (ν₁ + ν₂)/2 yoki maxsus formulalar",
                izoh: "Asosiy sath T₁<sub>g</sub> bo&apos;lganda (d², d⁷(YS)) ν₁ ≠ Δ<sub>o</sub>. TS diagrammasi yordamida yoki approksimatsion formulalar bilan hisoblanadi.",
                misol: "[Co(H₂O)₆]²⁺: TS diagrammasidan Δ<sub>o</sub> ≈ 9,300 cm⁻¹",
              },
              {
                usul: "4-usul: Fit usuli (barcha konfiguratsiyalar)",
                formula: "To&apos;liq matritsa diagonalizatsiyasi. Kompyuter dasturlari (Ligfield, AOMX).",
                izoh: "Eng aniq usul. Barcha polosalar (shu jumladan spin-taqiqlangan) hisobga olinadi. Dastur yordamida Δ<sub>o</sub>, B, C parametrlar bir vaqtda fit qilinadi. Ilmiy tadqiqotlarda qo&apos;llaniladi.",
                misol: "Barcha eksperimental polosalar ±50 cm⁻¹ aniqlikda moslashtiriladi",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-cyan-400 text-sm font-semibold mb-1" dangerouslySetInnerHTML={{ __html: r.formula }}></p>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
                <p className="text-green-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. RACAH B NI HISOBLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Racah B parametrini hisoblash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Racah B parametri</strong> — elektronlararo itarilish energiyasini 
              ifodalaydi. Kompleksda B qiymati erkin iondagidan <strong>har doim kichik</strong> bo&apos;ladi 
              (nefelauksetrik effekt). B ni aniqlash uchun <strong>TS diagrammasi</strong> yoki 
              <strong> maxsus formulalar</strong> dan foydalaniladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d³ (Cr³⁺) uchun</h3>
              <p className="text-purple-200 text-sm">
                ν₁ = Δ<sub>o</sub><br/>
                ν₂/ν₁ nisbatdan Δ<sub>o</sub>/B topiladi<br/>
                <strong>B = ν₁ / (Δ<sub>o</sub>/B)</strong><br/>
                <span className="text-purple-400 text-xs">Misol: ν₁=17,400, ν₂/ν₁=1.41 → Δ<sub>o</sub>/B=24.7 → B=704 cm⁻¹</span>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d⁸ (Ni²⁺) uchun</h3>
              <p className="text-purple-200 text-sm">
                ν₁ = Δ<sub>o</sub><br/>
                ν₂/ν₁ nisbatdan Δ<sub>o</sub>/B topiladi<br/>
                <strong>B = ν₁ / (Δ<sub>o</sub>/B)</strong><br/>
                <span className="text-purple-400 text-xs">Misol: ν₁=8,700, ν₂/ν₁=1.667 → Δ<sub>o</sub>/B=10.3 → B=845 cm⁻¹</span>
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">d² va d⁷(YS) uchun maxsus formulalar</h3>
            <p className="text-purple-200 text-sm">
              d² va d⁷(YS) da asosiy sath T₁<sub>g</sub> bo&apos;lgani uchun bevosita formula mavjud emas.
              TS diagrammasidan foydalaniladi yoki quyidagi approksimatsiyalar qo&apos;llaniladi:<br/>
              <strong>d²:</strong> Δ<sub>o</sub> ≈ (ν₁ + ν₂)/2 − 10B (taxminiy)<br/>
              <strong>d⁷(YS):</strong> Δ<sub>o</sub> ≈ ν₂ − ν₁ + 5B (taxminiy)<br/>
              Aniq qiymat uchun TS diagrammasi yoki kompyuter fit ishlatiladi.
            </p>
          </div>
        </div>

        {/* ── 5. NEFELAUKSETRIK EFFEKT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">☁️ Nefelauksetrik effekt va β koeffitsiyent</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Nefelauksetrik effekt</strong> (yunoncha — &quot;bulut kengayishi&quot;) — 
              kompleks hosil bo&apos;lganda d-elektron bulutining kengayishi natijasida elektronlararo itarilishning 
              kamayishi. <strong>Nefelauksetrik koeffitsiyent β = B<sub>kompleks</sub> / B<sub>erkin</sub></strong>.
              β qancha kichik bo&apos;lsa, metall-ligand bog&apos;lanishi shuncha <strong>kovalentroq</strong>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th>
                <th className="py-3 px-4 text-purple-300">Cr³⁺ β</th>
                <th className="py-3 px-4 text-purple-300">Ni²⁺ β</th>
                <th className="py-3 px-4 text-purple-300">Co²⁺ β</th>
                <th className="py-3 px-4 text-purple-300">Kovalentlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["F⁻", "0.85", "0.88", "0.89", "Juda kuchsiz"],
                  ["H₂O", "0.75", "0.83", "0.85", "Kuchsiz"],
                  ["NH₃", "0.70", "0.78", "0.80", "O&apos;rtacha"],
                  ["en", "0.67", "0.75", "0.77", "O&apos;rtacha"],
                  ["Cl⁻", "0.65", "0.75", "0.78", "O&apos;rtacha"],
                  ["CN⁻", "0.50", "0.65", "0.70", "Kuchli"],
                  ["Br⁻", "0.60", "0.70", "0.73", "O&apos;rtacha-kuchli"],
                  ["I⁻", "0.50", "0.60", "0.65", "Kuchli"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nefelauksetrik qator (ligandlar)</h3>
              <p className="text-purple-200 text-sm">
                Ligandlarning nefelauksetrik ta&apos;siri kamayish tartibida:<br/>
                <strong>I⁻ &gt; Br⁻ &gt; CN⁻ &gt; Cl⁻ &gt; en &gt; NH₃ &gt; H₂O &gt; F⁻</strong><br/>
                Chapdagi ligandlar kuchliroq nefelauksetrik effekt beradi (kichik β) — kovalentlik yuqori.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nefelauksetrik qator (ionlar)</h3>
              <p className="text-purple-200 text-sm">
                Metall ionlarining nefelauksetrik ta&apos;siri ortish tartibida:<br/>
                <strong>Mn²⁺ &lt; Ni²⁺ &lt; Co²⁺ &lt; Fe²⁺ &lt; Cr³⁺ &lt; Mo³⁺ &lt; Rh³⁺ &lt; Ir³⁺ &lt; Pt⁴⁺</strong><br/>
                Og&apos;ir metallarda nefelauksetrik effekt kuchliroq.
              </p>
            </div>
          </div>
        </div>

        {/* ── 6. AMALIY MISOL ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 To&apos;liq tahlil namunasi: [Ni(H₂O)₆]²⁺</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">[Ni(H₂O)₆]²⁺</strong> — d⁸ konfiguratsiya, oktaedrik geometriya.
              Quyida <strong>to&apos;liq bosqichma-bosqich tahlil</strong> keltirilgan. Bu metod 
              boshqa komplekslar uchun ham namuna sifatida ishlatilishi mumkin.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                bosqich: "Eksperimental ma&apos;lumotlar",
                malumot: "ν₁ = 8,700 cm⁻¹ (³A₂<sub>g</sub> → ³T₂<sub>g</sub>), ν₂ = 14,500 cm⁻¹ (³A₂<sub>g</sub> → ³T₁<sub>g</sub>(F)), ν₃ = 25,300 cm⁻¹ (³A₂<sub>g</sub> → ³T₁<sub>g</sub>(P)). Ni²⁺ erkin ioni uchun B<sub>erkin</sub> = 1080 cm⁻¹.",
              },
              {
                bosqich: "Δ<sub>o</sub> ni aniqlash",
                malumot: "d⁸ da ν₁ = Δ<sub>o</sub>. Demak, <strong>Δ<sub>o</sub> = 8,700 cm⁻¹</strong> (yoki 1.08 eV). Bu — o&apos;rtacha ligand maydon kuchi (H₂O — o&apos;rtacha kuchli ligand).",
              },
              {
                bosqich: "ν₂/ν₁ nisbati va Δ<sub>o</sub>/B",
                malumot: "ν₂/ν₁ = 14,500 / 8,700 = 1.667. d⁸ TS diagrammasidan (yoki jadvaldan) bu nisbatga mos: <strong>Δ<sub>o</sub>/B ≈ 10.3</strong>.",
              },
              {
                bosqich: "Racah B ni hisoblash",
                malumot: "B = Δ<sub>o</sub> / (Δ<sub>o</sub>/B) = 8,700 / 10.3 = <strong>845 cm⁻¹</strong>. Bu erkin iondagidan (1080 cm⁻¹) kichik — nefelauksetrik effekt mavjud.",
              },
              {
                bosqich: "β va nefelauksetrik effekt",
                malumot: "β = B<sub>kompleks</sub> / B<sub>erkin</sub> = 845 / 1080 = <strong>0.782</strong>. Demak, elektronlararo itarilish 22% ga kamaygan. H₂O ligandlari o&apos;rtacha kovalent bog&apos; hosil qilgan.",
              },
              {
                bosqich: "ν₃ ni tekshirish (validatsiya)",
                malumot: "Δ<sub>o</sub>/B = 10.3 bo&apos;lganda TS diagrammasidan ν₃/B ≈ 30. Hisoblangan: ν₃ = 30 × 845 = 25,350 cm⁻¹. Eksperimental: 25,300 cm⁻¹. <strong>Xatolik ≈ 0.2%</strong> — juda yaxshi moslik!",
              },
              {
                bosqich: "Xulosa",
                malumot: "<strong>[Ni(H₂O)₆]²⁺</strong> uchun: Δ<sub>o</sub> = 8,700 cm⁻¹, B = 845 cm⁻¹, β = 0.782. Kompleks oktaedrik, yuqori spinli, o&apos;rtacha kovalentlik darajasida. Rang — yashil (ν₁ qizil sohada yutiladi).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.bosqich}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.malumot }}></p>
              </div>
            ))}
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Umumiy formula (d⁸ Ni²⁺ uchun)</h3>
            <p className="text-purple-200 text-sm">
              <strong>1.</strong> ν₁ = Δ<sub>o</sub><br/>
              <strong>2.</strong> ν₂/ν₁ nisbat → TS diagrammasi → Δ<sub>o</sub>/B<br/>
              <strong>3.</strong> B = ν₁ / (Δ<sub>o</sub>/B)<br/>
              <strong>4.</strong> β = B / B<sub>erkin</sub> (Ni²⁺: 1080 cm⁻¹)<br/>
              <strong>5.</strong> ν₃ ni tekshirish: ν₃ = (ν₃/B)<sub>TS</sub> × B
            </p>
          </div>
        </div>

        {/* ── 7. TURLI KOMPLEKSLAR UCHUN TAHLIL ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Har xil konfiguratsiyalar uchun tahlil jadvali</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Δ<sub>o</sub></th>
                <th className="py-3 px-4 text-purple-300">B qanday topiladi</th>
                <th className="py-3 px-4 text-purple-300">β = B/B<sub>erkin</sub></th>
                <th className="py-3 px-4 text-purple-300">Eslatma</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "ν₁", "Kerak emas (1 ta polosa)", "—", "Eng oddiy — Ti³⁺"],
                  ["d²", "TS diagrammasi", "ν₂/ν₁ → Δ<sub>o</sub>/B → B", "B/860 (V³⁺)", "3 ta polosa"],
                  ["d³", "ν₁", "ν₂/ν₁ → Δ<sub>o</sub>/B → B", "B/1030 (Cr³⁺)", "Eng ko&apos;p o&apos;rganilgan"],
                  ["d⁴(YS)", "ν₁", "— (Yan-Teller buzilgan)", "—", "Murakkab — Yan-Teller"],
                  ["d⁵(YS)", "—", "Spin-taqiq o&apos;tishlardan", "—", "Juda kuchsiz polosalar"],
                  ["d⁶(YS)", "ν₁", "ν₂/ν₁ → Δ<sub>o</sub>/B → B", "B/1060 (Fe²⁺)", "O&apos;xshash d¹"],
                  ["d⁶(QS)", "TS diagrammasi", "Spin-ruxsat polosalardan", "B/1060 (Fe²⁺)", "Katta Δ<sub>o</sub>"],
                  ["d⁷(YS)", "TS diagrammasi", "ν₂/ν₁ → Δ<sub>o</sub>/B → B", "B/1120 (Co²⁺)", "3 ta polosa"],
                  ["d⁸", "ν₁", "ν₂/ν₁ → Δ<sub>o</sub>/B → B", "B/1080 (Ni²⁺)", "Eng qulay — Ni²⁺"],
                  ["d⁹", "ν₁", "— (1 ta polosa, Yan-Teller)", "—", "Yan-Teller buzilgan"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs text-purple-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 8. AMALIY MASLAHATLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy maslahatlar va keng tarqalgan xatolar</h2>
          
          <div className="space-y-4">
            {[
              {
                maslahat: "Spektr sifatiga e&apos;tibor bering",
                matn: "Sifatli spektr — aniq tahlil asosi. Bazaviy chiziq to&apos;g&apos;ri olinganligiga, erituvchi polosalari yo&apos;qligiga ishonch hosil qiling. Spektrni 2-3 marta takrorlang.",
              },
              {
                maslahat: "Polosalarni ajratish",
                matn: "Keng d-d polosalar ba&apos;zida bir-biriga qo&apos;shilib ketadi. Gauss komponentlariga ajratish (dekonvolyutsiya) kerak bo&apos;ladi. Buning uchun Origin, PeakFit yoki Python (SciPy) dasturlaridan foydalaning.",
              },
              {
                maslahat: "ν₂/ν₁ nisbatining chegaralari",
                matn: "d⁸ Ni²⁺ da ν₂/ν₁ odatda 1.5−1.8 oralig&apos;ida. Agar bu nisbat 2.0 dan katta bo&apos;lsa — tetraedrik geometriya yoki noto&apos;g&apos;ri polosa identifikatsiyasi.",
              },
              {
                maslahat: "CT polosalarni ajrata bilish",
                matn: "Agar polosa intensivligi ε > 1000 bo&apos;lsa, bu CT o&apos;tish. Uni d-d tahlilga qo&apos;shmang! CT polosalar UB sohada (200-400 nm) ko&apos;proq uchraydi.",
              },
              {
                maslahat: "Validatsiya — ν₃ ni tekshiring",
                matn: "Topilgan Δ<sub>o</sub>/B va B qiymatlaridan ν₃ ni hisoblang va eksperimental ν₃ bilan solishtiring. Agar farq 5% dan katta bo&apos;lsa — hisoblashda xatolik bor.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.maslahat}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Spektr tahlili</strong> orqali Δ<sub>o</sub>, Racah B, β aniqlanadi — kompleksning elektron tuzilishi haqida to&apos;liq ma&apos;lumot</li>
            <li><strong className="text-yellow-400">Δ<sub>o</sub> ni aniqlash:</strong> d³, d⁸, d¹, d⁶(YS) da ν₁ = Δ<sub>o</sub>. d², d⁷(YS) da TS diagrammasi kerak</li>
            <li><strong className="text-yellow-400">ν₂/ν₁ nisbati</strong> — TS diagrammasidan Δ<sub>o</sub>/B va B ni topishning asosiy kaliti</li>
            <li><strong className="text-yellow-400">Nefelauksetrik β:</strong> β qancha kichik bo&apos;lsa, metall-ligand bog&apos;lanishi shuncha kovalent</li>
            <li><strong className="text-yellow-400">Validatsiya:</strong> ν₃ ni hisoblab, eksperimental qiymat bilan solishtirish — tahlil to&apos;g&apos;riligini tekshirish</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/rang" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Komplekslarning rangi
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all">
            Chuqurlashgan mavzular →
          </Link>
        </div>

      </section>
    </main>
  )
}