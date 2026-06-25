import Link from "next/link"

export default function GidratIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">💧 Gidrat (solvat) izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Kristallanish suvi • Tashqi vs ichki sfera • CrCl₃·6H₂O klassik misoli</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Gidrat izomeriyasi haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Gidrat (solvat) izomeriyasi</strong> — 
              <strong className="text-cyan-400"> suv (yoki erituvchi) molekulalarining</strong> kompleksning 
              tashqi yoki ichki koordinatsion sferasida joylashuvi bilan farq qiluvchi izomerlar.
              Eng klassik misol — <strong>CrCl₃·6H₂O</strong> ning uchta izomeri: yashil, och yashil va binafsha.
              Bu izomerlar <strong>turli sondagi Cl⁻ ionlarini AgNO₃ bilan cho'kmaga tushiradi</strong> — 
              Verner nazariyasining eng yorqin isbotlaridan biri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Suv molekulasining roli</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Tashqi sfera suvi:</strong> Kristallanish suvi — erkin, ionlarga ta'sir qilmaydi</li>
                <li>• <strong>Ichki sfera suvi:</strong> Metall bilan bevosita koordinatsiyalangan</li>
                <li>• Ichki sfera suvi <strong>Cl⁻ ni tashqi sferaga siqib chiqaradi</strong></li>
                <li>• Har bir ichki sfera suvi → bitta anion tashqi sferaga o'tadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Farqlash usullari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>AgNO₃ testi:</strong> Faqat tashqi sfera Cl⁻ cho'kmaga tushadi</li>
                <li>• <strong>Konduktometriya:</strong> Ionlar soni farq qiladi</li>
                <li>• <strong>Termogravimetrik analiz (TGA):</strong> Suv yo'qotish harorati farqi</li>
                <li>• <strong>Element analiz:</strong> Farq qilmaydi — bir xil formula!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. CrCl₃·6H₂O — UCHTA IZOMER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ CrCl₃·6H₂O — uchta gidrat izomeri</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">CrCl₃·6H₂O</strong> — gidrat izomeriyasining eng klassik namunasi.
            Uchta izomer mavjud bo'lib, ular <strong>rangi, AgNO₃ bilan cho'kmaga tushadigan Cl⁻ soni 
            va elektr o'tkazuvchanligi</strong> bilan farq qiladi. Bu izomerlar Verner tomonidan 
            sintez qilingan va uning nazariyasini isbotlashda muhim rol o'ynagan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">[Cr(H₂O)₆]Cl₃</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Rang:</strong> Binafsha</li>
                <li>• <strong>Formula:</strong> [Cr(H₂O)₆]Cl₃</li>
                <li>• <strong>Ichki sfera:</strong> 6 H₂O, 0 Cl</li>
                <li>• <strong>Tashqi sfera:</strong> 3 Cl⁻</li>
                <li>• <strong>AgNO₃ da cho'kma:</strong> 3 ta Cl⁻ (barchasi)</li>
                <li>• <strong>Λm:</strong> ~430 S·cm²/mol (4 ion)</li>
                <li>• <strong>TGA:</strong> Barcha H₂O ~100°C da yo'qoladi</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">[Cr(H₂O)₅Cl]Cl₂·H₂O</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Rang:</strong> Och yashil</li>
                <li>• <strong>Formula:</strong> [Cr(H₂O)₅Cl]Cl₂·H₂O</li>
                <li>• <strong>Ichki sfera:</strong> 5 H₂O, 1 Cl</li>
                <li>• <strong>Tashqi sfera:</strong> 2 Cl⁻ + 1 H₂O</li>
                <li>• <strong>AgNO₃ da cho'kma:</strong> 2 ta Cl⁻</li>
                <li>• <strong>Λm:</strong> ~340 S·cm²/mol (3 ion)</li>
                <li>• <strong>TGA:</strong> 1 H₂O past haroratda, 5 H₂O yuqoriroqda</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-3">[Cr(H₂O)₄Cl₂]Cl·2H₂O</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Rang:</strong> To'q yashil</li>
                <li>• <strong>Formula:</strong> [Cr(H₂O)₄Cl₂]Cl·2H₂O</li>
                <li>• <strong>Ichki sfera:</strong> 4 H₂O, 2 Cl</li>
                <li>• <strong>Tashqi sfera:</strong> 1 Cl⁻ + 2 H₂O</li>
                <li>• <strong>AgNO₃ da cho'kma:</strong> 1 ta Cl⁻</li>
                <li>• <strong>Λm:</strong> ~250 S·cm²/mol (2 ion)</li>
                <li>• <strong>TGA:</strong> 2 H₂O past haroratda, 4 H₂O yuqoriroqda</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">🏆 Verner isboti</h3>
            <p className="text-purple-200 text-sm">
              Uchala izomer <strong>bir xil element tarkibga</strong> (CrCl₃·6H₂O) ega bo'lishiga qaramay, 
              AgNO₃ bilan <strong>turli miqdorda AgCl cho'kmasi</strong> hosil qiladi. Bu Blomstrand zanjir 
              nazariyasini rad etdi — agar Cl atomlari zanjirda bo'lganda, ularning barchasi bir xil 
              reaksion qobiliyatga ega bo'lar edi. Verner nazariyasi bo'yicha esa <strong>faqat tashqi 
              sfera ionlari</strong> erkin va reaksion faol.
            </p>
          </div>
        </div>

        {/* 3. TGA FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Termogravimetrik farqlash (TGA)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Gidrat izomerlari <strong>tashqi va ichki sfera suvlarini turli haroratlarda</strong> yo'qotadi.
            Tashqi sfera (kristallanish) suvi <strong>past haroratda</strong> (50−120°C), ichki sfera 
            (koordinatsiyalangan) suvi <strong>yuqori haroratda</strong> (150−300°C) ajraladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-3">TGA yo'qotish bosqichlari:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Izomer</th>
                  <th className="py-3 px-4 text-purple-300">1-bosqich (past T)</th>
                  <th className="py-3 px-4 text-purple-300">Yo'qotilgan</th>
                  <th className="py-3 px-4 text-purple-300">2-bosqich (yuqori T)</th>
                  <th className="py-3 px-4 text-purple-300">Yo'qotilgan</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Cr(H₂O)₆]Cl₃", "~100°C", "6 H₂O (barchasi)", "—", "—"],
                    ["[Cr(H₂O)₅Cl]Cl₂·H₂O", "~80°C", "1 H₂O (tashqi)", "~200°C", "5 H₂O (ichki)"],
                    ["[Cr(H₂O)₄Cl₂]Cl·2H₂O", "~70°C", "2 H₂O (tashqi)", "~220°C", "4 H₂O (ichki)"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-mono text-cyan-400 text-xs">{r[0]}</td>
                      <td className="py-3 px-4 text-xs">{r[1]}</td>
                      <td className="py-3 px-4 text-yellow-400 text-xs">{r[2]}</td>
                      <td className="py-3 px-4 text-xs">{r[3]}</td>
                      <td className="py-3 px-4 text-yellow-400 text-xs">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gidrat izomeriyasi — <strong className="text-cyan-400">suv molekulalarining tashqi/ichki sferada joylashuvi</strong> farqi</li>
            <li>CrCl₃·6H₂O — <strong className="text-cyan-400">uchta izomer</strong>: binafsha, och yashil, to'q yashil</li>
            <li>AgNO₃ testi — <strong className="text-cyan-400">eng oddiy va ishonchli farqlash usuli</strong></li>
            <li>TGA — tashqi va ichki sfera suvlari <strong className="text-cyan-400">turli haroratlarda</strong> ajraladi</li>
            <li>Verner nazariyasining <strong className="text-cyan-400">eng yorqin isbotlaridan biri</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/koordinatsion" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Koordinatsion izomeriya</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/konformatsion" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Konformatsion izomeriya →</Link>
        </div>

      </section>
    </main>
  )
}