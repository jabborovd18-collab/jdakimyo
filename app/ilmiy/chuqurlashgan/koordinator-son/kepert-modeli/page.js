import Link from "next/link"

export default function KepertModeli() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔮 Kepert modeli</h1>
          <p className="text-purple-400 text-sm">Ligandlararo elektrostatik itarilish • Nuqtaviy zaryadlar modeli • Geometriya bashorati</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kepert modeli haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kepert modeli (1965)</strong> — David Kepert tomonidan taklif qilingan 
              geometriya bashorat qilish modeli. Bu model ligandlarni <strong className="text-yellow-400">nuqtaviy zaryadlar</strong> 
              deb hisoblab, ular orasidagi <strong>elektrostatik itarilishni minimallashtirish</strong> orqali 
              optimal geometriyani topadi. KMN dan farqli o'laroq, 
              <strong className="text-yellow-400"> d-orbitallarni hisobga olmaydi</strong> — faqat sterik omillarga asoslanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy farazlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ligandlar — <strong>nuqtaviy zaryadlar</strong> (elektrostatik itarilish)</li>
                <li>• Metall — <strong>markaziy nuqta</strong></li>
                <li>• Barcha ligandlar <strong>bir xil</strong> (gomonuklear komplekslar)</li>
                <li>• Ligandlar metall yuzasida <strong>erkin harakatlanadi</strong></li>
                <li>• Optimal geometriya — <strong>umumiy itarilish energiyasi minimal</strong></li>
                <li>• d-orbitallar <strong>hisobga olinmaydi</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Matematik asos</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Itarilish energiyasi: <strong>U = Σᵢⱼ (q² / rᵢⱼ)</strong></li>
                <li>• rᵢⱼ — i va j ligandlar orasidagi masofa</li>
                <li>• Sferik sirtda ligandlar <strong>bir-biridan uzoqlashadi</strong></li>
                <li>• Natija — ligandlar <strong>sferada teng taqsimlanadi</strong></li>
                <li>• Ko'p hollarda <strong>KMN natijalari bilan mos keladi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KCh BO'YICHA NATIJALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Kepert modeli natijalari — KCh bo'yicha</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KCh</th>
                <th className="py-3 px-4 text-purple-300">Kepert geometriyasi</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Ligandlararo burchak</th>
                <th className="py-3 px-4 text-purple-300">Haqiqiy misol</th>
                <th className="py-3 px-4 text-purple-300">Moslik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["2", "Chiziqli", "D∞h", "180°", "[Ag(NH₃)₂]⁺", "✅ To'liq mos"],
                  ["3", "Uchburchak", "D₃h", "120°", "[Pt(PPh₃)₃]", "✅ To'liq mos"],
                  ["4", "Tetraedrik", "Td", "109.5°", "[CoCl₄]²⁻", "✅ Mos"],
                  ["4", "Kvadrat planar", "D₄h", "90°", "[Ni(CN)₄]²⁻", "❌ Mos EMAS"],
                  ["5", "Trigonal bipiramida", "D₃h", "90°, 120°", "[Fe(CO)₅]", "✅ Mos"],
                  ["5", "Kvadrat piramida", "C₄v", "~90°, ~105°", "[VO(acac)₂]", "✅ Mos"],
                  ["6", "Oktaedrik", "Oh", "90°", "[Co(NH₃)₆]³⁺", "✅ To'liq mos"],
                  ["7", "Pentagonal bipiramida", "D₅h", "72°, 90°", "[ZrF₇]³⁻", "✅ Mos"],
                  ["8", "Kvadrat antiprizma", "D₄d", "~74°, ~108°", "[Mo(CN)₈]⁴⁻", "✅ Mos"],
                  ["9", "Uch kal. trig. prizma", "D₃h", "—", "[Nd(H₂O)₉]³⁺", "✅ Mos"],
                  ["12", "Ikosaedr", "Ih", "63.4°", "[Ce(NO₃)₆]²⁻", "✅ Mos"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-white text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[4]}</td>
                    <td className="py-3 px-4">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ISTISNO — KVADRAT PLANAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Kepert istisnosi — Kvadrat planar geometriya</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Kepert modeli KCh=4 uchun faqat tetraedrik geometriyani bashorat qiladi.</strong> 
            Kvadrat planar (D₄h) geometriya Kepert modeliga zid — chunki sferada 4 ta nuqta uchun 
            maksimal masofa <strong>tetraedrik joylashuvda</strong> (109.5°) bo'ladi, kvadrat planar 
            joylashuvda (90°) emas. Kvadrat planar geometriya faqat <strong>KMN hisobiga</strong> yuzaga keladi: 
            d⁸ konfiguratsiyada dx²−y² orbital bo'sh qoladi va bu energetik jihatdan juda qulay bo'ladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Kepert bashorati — Tetraedrik</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Sterik itarilish minimal — 109.5°</li>
                <li>• <strong>d¹⁰ metallar</strong> (KMN=0) — har doim tetraedrik</li>
                <li>• [ZnCl₄]²⁻, [Cd(CN)₄]²⁻, [HgI₄]²⁻</li>
                <li>• <strong>Kuchsiz maydon ligandlari</strong> bilan barcha dⁿ — tetraedrik</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Kepert istisnosi — Kvadrat planar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• KMN hal qiluvchi — dx²−y² bo'sh qoladi</li>
                <li>• <strong>d⁸ + kuchli maydon</strong> (CN⁻, CO) — kv. planar</li>
                <li>• [Ni(CN)₄]²⁻, [PtCl₂(NH₃)₂], [PdCl₄]²⁻</li>
                <li>• <strong>Katta Δ</strong> — elektronlar juftlashadi (diamagnit)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. KEPERT vs KMN vs VSEPR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Kepert vs KMN vs VSEPR — taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-yellow-400">Kepert modeli</th>
                <th className="py-3 px-4 text-green-400">KMN</th>
                <th className="py-3 px-4 text-blue-400">VSEPR</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Asosiy omil", "Ligand-ligand itarilish", "d-orbital bo'linishi", "Elektron juftlar itarilishi"],
                  ["d-orbitallar", "Hisobga olinmaydi", "Asosiy omil", "Hisobga olinmaydi"],
                  ["Kvadrat planar", "Bashorat qilmaydi ❌", "Bashorat qiladi ✅", "Bashorat qilmaydi ❌"],
                  ["Yuqori KCh", "Yaxshi bashorat ✅", "Kuchsiz bashorat ❌", "Bashorat qilmaydi ❌"],
                  ["3d metallar", "Qisman mos", "Eng yaxshi ✅", "Qisman mos"],
                  ["4d/5d metallar", "Yaxshi mos ✅", "Kuchsizroq", "Qisman mos"],
                  ["f-elementlar", "Eng yaxshi ✅", "Ishlamaydi ❌", "Ishlamaydi ❌"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 text-purple-300">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">Qaysi model qachon ishlatiladi?</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• <strong>3d metallar, KCh=4−6:</strong> KMN eng yaxshi natija beradi</li>
              <li>• <strong>d¹⁰ metallar, har qanday KCh:</strong> Kepert modeli yetarli (KMN=0)</li>
              <li>• <strong>4d/5d metallar, yuqori KCh:</strong> Kepert modeli afzal (KMN hissasi kam)</li>
              <li>• <strong>f-elementlar:</strong> Faqat Kepert modeli ishlaydi (d-orbitallar ichki, ta'sir qilmaydi)</li>
              <li>• <strong>Asosiy guruh elementlari:</strong> VSEPR eng yaxshi (yo'naltirilgan bog'lar)</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kepert modeli — <strong className="text-yellow-400">faqat sterik omillar</strong> asosida geometriyani bashorat qiladi</li>
            <li>Kvadrat planar — <strong className="text-red-400">yagona istisno</strong>, bu yerda KMN hal qiluvchi rol o'ynaydi</li>
            <li>Yuqori KCh va f-elementlar uchun <strong className="text-yellow-400">eng yaxshi model</strong></li>
            <li>Kepert + KMN + VSEPR — <strong className="text-yellow-400">birgalikda</strong> to'liq bashorat qilish imkonini beradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kch-7-12" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← KCh = 7−12</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/vsepr" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">VSEPR komplekslarda →</Link>
        </div>

      </section>
    </main>
  )
}