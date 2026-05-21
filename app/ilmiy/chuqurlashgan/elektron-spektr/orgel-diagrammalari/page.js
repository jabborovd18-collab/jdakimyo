import Link from "next/link"

export default function OrgelDiagrammalari() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📈 Orgel diagrammalari</h1>
          <p className="text-purple-400 text-sm">d¹, d⁴, d⁶, d⁹ konfiguratsiyalar • Oktaedrik va tetraedrik maydonlar • d-d o&apos;tish energiyalari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Orgel diagrammalari haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Orgel diagrammalari</strong> — 1955 yilda Leslie Orgel tomonidan 
              taklif qilingan soddalashtirilgan energetik diagrammalar. Ular faqat 
              <strong className="text-yellow-400"> bir xil spin-multipletligiga ega bo&apos;lgan termlar</strong> 
              orasidagi o&apos;tishlarni ko&apos;rsatadi. Orgel diagrammalari <strong>d¹, d⁴, d⁶, d⁹</strong> 
              (yuqori spinli) va <strong>d², d³, d⁷, d⁸</strong> konfiguratsiyalar uchun qo&apos;llaniladi.
              Bu diagrammalar yordamida d-d o&apos;tish energiyalarini osongina aniqlash mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Afzalliklari</h3>
              <p className="text-purple-200 text-sm">
                • Soddalashtirilgan — faqat bir xil spinli termlar<br/>
                • d-d o&apos;tish energiyasini to&apos;g&apos;ridan-to&apos;g&apos;ri ko&apos;rsatadi<br/>
                • Oktaedrik va tetraedrik maydonlar bir diagrammada<br/>
                • D va F termli konfiguratsiyalar uchun universal
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Cheklovlari</h3>
              <p className="text-purple-200 text-sm">
                • Faqat yuqori spinli konfiguratsiyalar uchun<br/>
                • Spin-taqiqlangan o&apos;tishlarni ko&apos;rsatmaydi<br/>
                • Kvantitativ aniqlik cheklangan<br/>
                • Murakkab konfiguratsiyalar (d³, d⁵) uchun Tanabe-Sugano kerak
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. ORGEL DIAGRAMMA TURLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Orgel diagrammalarining ikki turi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Orgel diagrammalari <strong className="text-yellow-400">ikki guruhga</strong> bo&apos;linadi.
            Guruhlar erkin ionning asosiy term belgisiga qarab aniqlanadi.
            Har bir guruh ichidagi konfiguratsiyalar o&apos;xshash energetik tuzilishga ega 
            (teshik simmetriyasi tufayli).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3 text-lg">📌 D-term diagramma</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Asosiy term:</strong> D (L = 2)<br/>
                <strong>Konfiguratsiyalar:</strong> d¹, d⁴ (YS), d⁶ (YS), d⁹<br/>
                <strong>Oktaedrik maydonda:</strong> D → T₂<sub>g</sub> + E<sub>g</sub><br/>
                <strong>Tetraedrik maydonda:</strong> D → E + T₂<br/>
                <strong className="text-green-400">Xususiyat:</strong> Oktaedrik va tetraedrik maydonlar <strong>teskari</strong> tartibda
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3 text-lg">📌 F-term diagramma</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Asosiy term:</strong> F (L = 3)<br/>
                <strong>Konfiguratsiyalar:</strong> d², d³ (YS), d⁷ (YS), d⁸<br/>
                <strong>Oktaedrik maydonda:</strong> F → T₁<sub>g</sub> + T₂<sub>g</sub> + A₂<sub>g</sub><br/>
                <strong>Qo&apos;shimcha:</strong> P termi ham ishtirok etadi (F + P)<br/>
                <strong className="text-green-400">Xususiyat:</strong> Uchta energetik sath, P term bilan aralashish
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. D-TERM DIAGRAMMA (d¹/d⁹) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟢 D-term Orgel diagrammasi: d¹ va d⁹</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d¹ va d⁹ konfiguratsiyalar eng oddiy Orgel diagrammasiga ega. Erkin ionning yagona 
              <strong> ²D</strong> termi oktaedrik maydonda <strong>²T₂<sub>g</sub></strong> va 
              <strong> ²E<sub>g</sub></strong> larga ajraladi. Tetraedrik maydonda esa teskari tartibda: 
              <strong> ²E</strong> pastda, <strong>²T₂</strong> yuqorida. d¹ va d⁹ uchun diagramma bir xil, 
              lekin d⁹ da &quot;teshik&quot; tufayli energetik sathlar teskari.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">O<sub>h</sub> da asosiy</th>
                <th className="py-3 px-4 text-purple-300">O&apos;tish</th>
                <th className="py-3 px-4 text-purple-300">Energiya</th>
                <th className="py-3 px-4 text-purple-300">Polosalar soni</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "Ti³⁺, V⁴⁺", "²T₂<sub>g</sub>", "²T₂<sub>g</sub> → ²E<sub>g</sub>", "Δ<sub>o</sub>", "1 ta"],
                  ["d⁹", "Cu²⁺, Ag²⁺", "²E<sub>g</sub>", "²E<sub>g</sub> → ²T₂<sub>g</sub>", "Δ<sub>o</sub>", "1 ta (Yan-Teller: 2-3)"],
                  ["d⁴ (YS)", "Cr²⁺, Mn³⁺", "⁵E<sub>g</sub>", "⁵E<sub>g</sub> → ⁵T₂<sub>g</sub>", "Δ<sub>o</sub>", "1 ta (Yan-Teller: 2-3)"],
                  ["d⁶ (YS)", "Fe²⁺, Co³⁺ (YS)", "⁵T₂<sub>g</sub>", "⁵T₂<sub>g</sub> → ⁵E<sub>g</sub>", "Δ<sub>o</sub>", "1 ta"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: r[2] }}></td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[3] }}></td>
                    <td className="py-3 px-4 text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Misol: [Ti(H₂O)₆]³⁺</h3>
            <p className="text-purple-200 text-sm">
              Ti³⁺ — d¹ konfiguratsiya. Erkin ion: ²D. Oktaedrik maydonda: ²T₂<sub>g</sub> (asosiy) → ²E<sub>g</sub> (uyg&apos;ongan).
              <strong>Yagona d-d polosa:</strong> ≈ 20,300 cm⁻¹ (493 nm). Bu to&apos;g&apos;ridan-to&apos;g&apos;ri Δ<sub>o</sub> ga teng.
              Spektrda bitta keng polosa kuzatiladi (Laport-taqiqlangan, ε ≈ 5 L·mol⁻¹·cm⁻¹).
              <strong>Rang:</strong> binafsha-qizil (yutilish yashil-sariq sohada).
            </p>
          </div>
        </div>

        {/* ── 4. F-TERM DIAGRAMMA (d²/d⁸) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 F-term Orgel diagrammasi: d² va d⁸</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d² va d⁸ konfiguratsiyalar F-term diagrammaga ega. Erkin ionda asosiy term <strong>³F</strong> 
              va qo&apos;zg&apos;algan <strong>³P</strong> termi mavjud. Oktaedrik maydonda ³F termi 
              <strong> ³T₁<sub>g</sub>, ³T₂<sub>g</sub>, ³A₂<sub>g</sub></strong> larga ajraladi. 
              ³P termi esa <strong>³T₁<sub>g</sub>(P)</strong> beradi. Ikkita ³T₁<sub>g</sub> sathi 
              o&apos;zaro aralashadi (bir xil simmetriya).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d² oktaedrik maydonda</h3>
              <p className="text-purple-200 text-sm">
                <strong>Asosiy:</strong> ³T₁<sub>g</sub>(F)<br/>
                <strong>O&apos;tishlar:</strong><br/>
                ³T₁<sub>g</sub> → ³T₂<sub>g</sub> (ν₁ ≈ 0.8Δ<sub>o</sub>)<br/>
                ³T₁<sub>g</sub> → ³T₁<sub>g</sub>(P) (ν₂ ≈ 1.6Δ<sub>o</sub>)<br/>
                ³T₁<sub>g</sub> → ³A₂<sub>g</sub> (ν₃ ≈ 2.1Δ<sub>o</sub>)<br/>
                <strong>3 ta polosa</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d⁸ oktaedrik maydonda</h3>
              <p className="text-purple-200 text-sm">
                <strong>Asosiy:</strong> ³A₂<sub>g</sub><br/>
                <strong>O&apos;tishlar:</strong><br/>
                ³A₂<sub>g</sub> → ³T₂<sub>g</sub> (ν₁ = Δ<sub>o</sub>)<br/>
                ³A₂<sub>g</sub> → ³T₁<sub>g</sub>(F) (ν₂ ≈ 1.25Δ<sub>o</sub>)<br/>
                ³A₂<sub>g</sub> → ³T₁<sub>g</sub>(P) (ν₃ ≈ 1.8Δ<sub>o</sub>)<br/>
                <strong>3 ta polosa</strong>
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-2">Misol: [Ni(H₂O)₆]²⁺</h3>
            <p className="text-purple-200 text-sm">
              Ni²⁺ — d⁸ konfiguratsiya. Asosiy term: ³F → oktaedrik maydonda ³A₂<sub>g</sub> asosiy.
              Uchta d-d o&apos;tish:<br/>
              • ν₁ = 8,700 cm⁻¹ (³A₂<sub>g</sub> → ³T₂<sub>g</sub>)<br/>
              • ν₂ = 14,500 cm⁻¹ (³A₂<sub>g</sub> → ³T₁<sub>g</sub>(F))<br/>
              • ν₃ = 25,300 cm⁻¹ (³A₂<sub>g</sub> → ³T₁<sub>g</sub>(P))<br/>
              <strong>Δ<sub>o</sub> = ν₁ = 8,700 cm⁻¹. Rang:</strong> yashil.
            </p>
          </div>
        </div>

        {/* ── 5. d³/d⁷ F-TERM ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟣 d³ va d⁷ (yuqori spin) F-term diagrammasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            d³ va d⁷ (YS) konfiguratsiyalar erkin ionda <strong>⁴F</strong> asosiy termga ega.
            Oktaedrik maydonda bu term uchta sathga ajraladi: ⁴A₂<sub>g</sub>, ⁴T₂<sub>g</sub>, ⁴T₁<sub>g</sub>.
            ⁴P termi esa ⁴T₁<sub>g</sub>(P) beradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d³ oktaedrik (Cr³⁺)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Asosiy:</strong> ⁴A₂<sub>g</sub><br/>
                <strong>O&apos;tishlar:</strong><br/>
                ⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub> (ν₁ = Δ<sub>o</sub>)<br/>
                ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(F) (ν₂ ≈ 1.8Δ<sub>o</sub>)<br/>
                ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(P) (ν₃ ≈ 2.8Δ<sub>o</sub>)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d⁷ (YS) oktaedrik (Co²⁺)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Asosiy:</strong> ⁴T₁<sub>g</sub>(F)<br/>
                <strong>O&apos;tishlar:</strong><br/>
                ⁴T₁<sub>g</sub>(F) → ⁴T₂<sub>g</sub> (ν₁ ≈ 0.8Δ<sub>o</sub>)<br/>
                ⁴T₁<sub>g</sub>(F) → ⁴A₂<sub>g</sub> (ν₂ ≈ 1.6Δ<sub>o</sub>)<br/>
                ⁴T₁<sub>g</sub>(F) → ⁴T₁<sub>g</sub>(P) (ν₃ ≈ 2.3Δ<sub>o</sub>)
              </p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
            <h3 className="text-green-400 font-bold mb-2">Misol: [Cr(H₂O)₆]³⁺</h3>
            <p className="text-purple-200 text-sm">
              Cr³⁺ — d³ konfiguratsiya. Asosiy: ⁴A₂<sub>g</sub>. Uchta d-d o&apos;tish:<br/>
              • ν₁ = 17,400 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub>) — Δ<sub>o</sub> = 17,400 cm⁻¹<br/>
              • ν₂ = 24,600 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(F)) — ν₂/ν₁ ≈ 1.41<br/>
              • ν₃ = 37,800 cm⁻¹ (⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(P)) — UV soha<br/>
              ν₂/ν₁ nisbati orqali Δ<sub>o</sub> va Racah B parametrini hisoblash mumkin.
            </p>
          </div>
        </div>

        {/* ── 6. OKTAEDRIK vs TETRAEDRIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Oktaedrik va tetraedrik maydonlar — teskari munosabat</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Orgel diagrammasining muhim xususiyati — <strong className="text-yellow-400">oktaedrik va tetraedrik 
              maydonlar bitta diagrammada</strong> ko&apos;rsatilgan. Oktaedrik maydon chap tomonda (Δ<sub>o</sub> ortishi 
              o&apos;ngga), tetraedrik maydon o&apos;ng tomonda (Δ<sub>t</sub> ortishi chapga). Sathlarning energetik 
              tartibi oktaedrik va tetraedrik maydonlarda <strong>teskari</strong>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">O<sub>h</sub> asosiy term</th>
                <th className="py-3 px-4 text-purple-300">T<sub>d</sub> asosiy term</th>
                <th className="py-3 px-4 text-purple-300">Δ<sub>t</sub> / Δ<sub>o</sub></th>
                <th className="py-3 px-4 text-purple-300">Misol (T<sub>d</sub>)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "²T₂<sub>g</sub>", "²E", "≈ 4/9", "[VO₄]³⁻"],
                  ["d⁹", "²E<sub>g</sub>", "²T₂", "≈ 4/9", "[CuCl₄]²⁻"],
                  ["d²", "³T₁<sub>g</sub>(F)", "³A₂", "≈ 4/9", "[VCl₄]"],
                  ["d⁸", "³A₂<sub>g</sub>", "³T₁(F)", "≈ 4/9", "[NiCl₄]²⁻"],
                  ["d³", "⁴A₂<sub>g</sub>", "⁴T₁(F)", "≈ 4/9", "[CrO₄]⁴⁻"],
                  ["d⁷", "⁴T₁<sub>g</sub>(F)", "⁴A₂", "≈ 4/9", "[CoCl₄]²⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                    <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: r[2] }}></td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Muhim:</strong> Tetraedrik maydonda Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub>. Shuning uchun 
              tetraedrik komplekslarning d-d polosalari oktaedriklarga nisbatan <strong>past energiyali</strong> 
              (qizil siljigan) va <strong>intensivroq</strong> bo&apos;ladi (inversiya markazi yo&apos;qligi tufayli).
            </p>
          </div>
        </div>

        {/* ── 7. ORGEL vs TANABE-SUGANO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Orgel vs Tanabe-Sugano diagrammalari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                xususiyat: "Spin holatlar",
                orgel: "Faqat bir xil spinli termlar",
                ts: "Barcha spin holatlar (yuqori + quyi spin)",
              },
              {
                xususiyat: "Qo&apos;llanilishi",
                orgel: "d¹, d⁴(YS), d⁶(YS), d⁹ va d², d³(YS), d⁷(YS), d⁸",
                ts: "Barcha d¹−d⁹ konfiguratsiyalar",
              },
              {
                xususiyat: "Aniqlik darajasi",
                orgel: "Sifat tavsifi, taxminiy energiyalar",
                ts: "Miqdoriy hisoblash, Racah B va C parametrlari",
              },
              {
                xususiyat: "O&apos;qlar",
                orgel: "Energiya vs Δ (chiziqli bo&apos;lmagan)",
                ts: "E/B vs Δ/B (normallashtirilgan)",
              },
              {
                xususiyat: "Spin-taqiqlangan o&apos;tishlar",
                orgel: "Ko&apos;rsatilmaydi",
                ts: "To&apos;liq ko&apos;rsatilgan",
              },
              {
                xususiyat: "Quyi spinli holatlar",
                orgel: "Ko&apos;rsatilmaydi",
                ts: "To&apos;liq ko&apos;rsatilgan (kuchli maydon chegarasi)",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.xususiyat}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-green-400 font-semibold">Orgel:</span>
                    <p className="text-purple-200">{r.orgel}</p>
                  </div>
                  <div>
                    <span className="text-yellow-400 font-semibold">Tanabe-Sugano:</span>
                    <p className="text-purple-200">{r.ts}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Orgel diagrammalari</strong> — bir xil spinli termlar uchun soddalashtirilgan energetik diagrammalar</li>
            <li><strong className="text-yellow-400">D-term:</strong> d¹, d⁴(YS), d⁶(YS), d⁹ — bitta o&apos;tish, Δ<sub>o</sub> ni to&apos;g&apos;ridan-to&apos;g&apos;ri beradi</li>
            <li><strong className="text-yellow-400">F-term:</strong> d², d³(YS), d⁷(YS), d⁸ — uchta o&apos;tish, P-term aralashuvi</li>
            <li><strong className="text-yellow-400">Oktaedrik ↔ Tetraedrik:</strong> sathlar teskari tartibda, Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub></li>
            <li><strong className="text-yellow-400">Cheklov:</strong> spin-taqiqlangan va quyi spinli o&apos;tishlar uchun Tanabe-Sugano diagrammasi kerak</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/tanlash-qoidalari" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Tanlash qoidalari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/tanabe-sugano" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Tanabe-Sugano diagrammalari →
          </Link>
        </div>

      </section>
    </main>
  )
}