import Link from "next/link"

export default function IonlanishIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚡ Ionlanish izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Tashqi/ichki sfera ionlari almashinuvi • Konduktometriya • AgNO₃ testi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ionlanish izomeriyasi haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ionlanish izomeriyasi</strong> — kompleks birikmalarda 
              <strong className="text-yellow-400"> tashqi va ichki sfera anionlari</strong> o'rnini almashinishi 
              natijasida yuzaga keladi. Bu izomerlar <strong>bir xil molekulyar formulaga</strong> ega bo'lib, 
              lekin eritmada <strong>turli ionlarga dissotsiatsiyalanadi</strong>. Natijada ularning 
              <strong>elektr o'tkazuvchanligi, cho'kma hosil qilish reaksiyalari va hatto rangi</strong> farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Klassik misol</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>[Co(NH₃)₅Br]SO₄</strong> — qizil-binafsha rang</li>
                <li>• <strong>[Co(NH₃)₅SO₄]Br</strong> — qizil rang</li>
                <li>• Birinchisida <strong>SO₄²⁻ tashqi sferada</strong> — BaCl₂ bilan cho'kma</li>
                <li>• Ikkinchisida <strong>Br⁻ tashqi sferada</strong> — AgNO₃ bilan cho'kma</li>
                <li>• Ikkalasi ham bir xil formula: CoN₅H₁₅BrSO₄</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Farqlash usullari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Konduktometriya:</strong> Ionlar soniga qarab Λm farq qiladi</li>
                <li>• <strong>AgNO₃ testi:</strong> Faqat tashqi sfera Cl⁻/Br⁻ cho'kmaga tushadi</li>
                <li>• <strong>BaCl₂ testi:</strong> Faqat tashqi sfera SO₄²⁻ cho'kmaga tushadi</li>
                <li>• <strong>Ion almashinish xromatografiyasi:</strong> Zaryadga qarab ajratish</li>
                <li>• <strong>UB-Vis spektroskopiya:</strong> Ichki sfera ligandlari ta'sirida rang farqi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Klassik ionlanish izomerlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Izomer 1</th>
                <th className="py-3 px-4 text-purple-300">Izomer 2</th>
                <th className="py-3 px-4 text-purple-300">Farq qiluvchi ion</th>
                <th className="py-3 px-4 text-purple-300">Tashqi sfera ioni</th>
                <th className="py-3 px-4 text-purple-300">Aniqlash</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₅Br]SO₄", "[Co(NH₃)₅SO₄]Br", "Br⁻ ↔ SO₄²⁻", "SO₄²⁻ / Br⁻", "BaCl₂ / AgNO₃ testi"],
                  ["[Co(NH₃)₅Cl]SO₄", "[Co(NH₃)₅SO₄]Cl", "Cl⁻ ↔ SO₄²⁻", "SO₄²⁻ / Cl⁻", "BaCl₂ / AgNO₃ testi"],
                  ["[Pt(NH₃)₄Cl₂]Br₂", "[Pt(NH₃)₄Br₂]Cl₂", "Cl⁻ ↔ Br⁻", "Br⁻ / Cl⁻", "AgNO₃ testi (har xil cho'kma)"],
                  ["[Cr(H₂O)₆]Cl₃", "[Cr(H₂O)₅Cl]Cl₂·H₂O", "H₂O ↔ Cl⁻", "3Cl⁻ / 2Cl⁻", "Konduktometriya (ionlar soni)"],
                  ["[Co(NH₃)₅NO₃]SO₄", "[Co(NH₃)₅SO₄]NO₃", "NO₃⁻ ↔ SO₄²⁻", "SO₄²⁻ / NO₃⁻", "IQ (NO₃⁻ tebranishlari)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. KONDUKTOMETRIK FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔌 Konduktometrik farqlash — ionlar soni</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Ionlanish izomerlari eritmada <strong>turli sondagi ionlarga</strong> dissotsiatsiyalanadi.
            Shuning uchun ularning <strong>molyar elektr o'tkazuvchanligi (Λm)</strong> farq qiladi.
            Bu farq orqali izomerlarni aniqlash mumkin — Verner aynan shu usul bilan o'z nazariyasini isbotlagan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Misol: [Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 font-semibold mb-1">[Co(NH₃)₅Br]SO₄ (eritmada):</p>
                <p className="text-purple-200 font-mono">[Co(NH₃)₅Br]²⁺ + SO₄²⁻</p>
                <p className="text-purple-300 text-xs mt-1">Ionlar soni: <strong>2</strong> (2:2 elektrolit)</p>
                <p className="text-purple-300 text-xs">Λm ≈ 250−280 S·cm²/mol</p>
                <p className="text-purple-300 text-xs mt-1">+ BaCl₂ → <strong>BaSO₄↓ (oq cho'kma)</strong></p>
              </div>
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-3">
                <p className="text-orange-400 font-semibold mb-1">[Co(NH₃)₅SO₄]Br (eritmada):</p>
                <p className="text-purple-200 font-mono">[Co(NH₃)₅SO₄]⁺ + Br⁻</p>
                <p className="text-purple-300 text-xs mt-1">Ionlar soni: <strong>2</strong> (1:1 elektrolit)</p>
                <p className="text-purple-300 text-xs">Λm ≈ 100−130 S·cm²/mol</p>
                <p className="text-purple-300 text-xs mt-1">+ AgNO₃ → <strong>AgBr↓ (sarg'ish cho'kma)</strong></p>
              </div>
            </div>
            <p className="text-purple-400 text-xs mt-3">
              * Ikkala izomer ham 2 ta ionga dissotsiatsiyalansa-da, ularning Λm qiymatlari farq qiladi, 
              chunki SO₄²⁻ ning ion harakatchanligi Br⁻ dan farq qiladi. Eng muhimi — 
              <strong>kimyoviy testlar</strong> (BaCl₂, AgNO₃) orqali aniq farqlanadi.
            </p>
          </div>
        </div>

        {/* 4. VERNER ISBOTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Verner nazariyasining ionlanish izomeriyasi orqali isboti</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Ionlanish izomeriyasi <strong>Vernerning koordinatsion nazariyasini isbotlagan</strong> eng kuchli 
            dalillardan biridir. Agar Vernerning fikricha, metall <strong>birlamchi (ion) va ikkilamchi (koordinatsion) 
            valentlikka</strong> ega bo'lsa, tashqi va ichki sfera ionlari almashinishi mumkin.
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-3">Verner tajribasi:</h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p>1. <strong>[Co(NH₃)₅Br]SO₄</strong> sintez qilindi — BaCl₂ bilan oq cho'kma (BaSO₄), AgNO₃ bilan cho'kma yo'q</p>
              <p>2. <strong>[Co(NH₃)₅SO₄]Br</strong> sintez qilindi — AgNO₃ bilan sarg'ish cho'kma (AgBr), BaCl₂ bilan cho'kma yo'q</p>
              <p>3. <strong>Xulosa:</strong> Birinchi birikmada SO₄²⁻ tashqi sferada (erkin), Br⁻ ichki sferada (bog'langan). Ikkinchisida aksincha.</p>
              <p className="text-purple-400 text-xs mt-2">Bu tajriba <strong>Blomstrand zanjir nazariyasini</strong> rad etdi va Vernerning koordinatsion nazariyasini tasdiqladi.</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ionlanish izomeriyasi — <strong className="text-yellow-400">tashqi va ichki sfera anionlari</strong> almashinuvi</li>
            <li>Konduktometriya va <strong className="text-yellow-400">AgNO₃/BaCl₂ testlari</strong> orqali oson farqlanadi</li>
            <li>Verner nazariyasini <strong className="text-yellow-400">isbotlagan eng kuchli dalil</strong></li>
            <li>Ionlanish izomerlari <strong className="text-yellow-400">turli rang, eruvchanlik va reaksion qobiliyatga</strong> ega</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/optik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Optik izomeriya</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/boglanish" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Bog'lanish izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}