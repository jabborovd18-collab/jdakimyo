import Link from "next/link"

export default function TermikTahlil() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔥 Termik tahlil</h1>
          <p className="text-purple-400 text-sm">TGA • DTA • DSC • Termik barqarorlik • Suv molekulalari joylashuvi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Termik tahlil haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Termik tahlil</strong> — moddalarning 
              <strong className="text-yellow-400"> harorat ta'sirida</strong> sodir bo'ladigan fizik va kimyoviy 
              o'zgarishlarini o'rganadi. Kompleks birikmalarda <strong className="text-yellow-400">suv molekulalarining 
              joylashuvi</strong> (ichki/tashqi sfera), <strong className="text-yellow-400">termik barqarorlik</strong> va 
              <strong className="text-yellow-400">parchalanish mahsulotlari</strong> aniqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-yellow-400 font-bold">TGA</h3>
              <p className="text-purple-300 text-sm">Termogravimetrik analiz</p>
              <p className="text-purple-400 text-xs mt-1">Massa o'zgarishini o'lchaydi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🌡️</div>
              <h3 className="text-yellow-400 font-bold">DTA</h3>
              <p className="text-purple-300 text-sm">Differensial termik analiz</p>
              <p className="text-purple-400 text-xs mt-1">Harorat farqini o'lchaydi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-yellow-400 font-bold">DSC</h3>
              <p className="text-purple-300 text-sm">Differensial skanerlovchi kalorimetriya</p>
              <p className="text-purple-400 text-xs mt-1">Issiqlik oqimini o'lchaydi</p>
            </div>
          </div>
        </div>

        {/* 2. GIDRAT IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Kompleks birikmalarda suv molekulalarini aniqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Termik tahlil yordamida <strong className="text-yellow-400">ichki va tashqi sfera suvlari</strong> farqlanadi.
            Tashqi sfera suvlari <strong className="text-yellow-400">past haroratda</strong> (50-120°C), 
            ichki sfera (koordinatsiyalangan) suvlari <strong className="text-yellow-400">yuqori haroratda</strong> (150-250°C) ajraladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Misol: CrCl₃·6H₂O — 3 ta gidrat izomer</h3>
            <div className="space-y-3">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-purple-200 font-bold">[Cr(H₂O)₆]Cl₃ — binafsha</p>
                <p className="text-purple-300 text-sm">6 ta suv ichki sferada → <strong>faqat yuqori T da ajraladi</strong> (~200°C)</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-green-200 font-bold">[CrCl(H₂O)₅]Cl₂·H₂O — och yashil</p>
                <p className="text-purple-300 text-sm">1 ta tashqi suv → <strong>past T da ajraladi</strong> (~80°C)<br/>5 ta ichki suv → yuqori T da ajraladi</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-emerald-200 font-bold">[CrCl₂(H₂O)₄]Cl·2H₂O — to'q yashil</p>
                <p className="text-purple-300 text-sm">2 ta tashqi suv → past T da ajraladi<br/>4 ta ichki suv → yuqori T da ajraladi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PARCHALANISH BOSQICHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kompleks birikmalarning parchalanish bosqichlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">1-bosqich (T, °C)</th>
                <th className="py-3 px-4 text-purple-300">Ajralgan</th>
                <th className="py-3 px-4 text-purple-300">2-bosqich (T, °C)</th>
                <th className="py-3 px-4 text-purple-300">Qoldiq</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₆]Cl₃", "150-250", "NH₃ (bosqichli)", "400-600", "CoCl₂"],
                  ["[Ni(H₂O)₆]SO₄", "50-120", "Tashqi H₂O", "200-400", "NiSO₄"],
                  ["K₃[Fe(CN)₆]", "500-600", "CN⁻ parchalanadi", ">700", "Fe + KCN"],
                  ["[Fe(C₅H₅)₂]", "100-173", "Suyuqlanish", "249-400", "Bug'lanish"],
                  ["[Pt(NH₃)₂Cl₂]", "270-320", "NH₃ + HCl", "450-600", "Pt"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 ${j===0 ? "font-mono text-red-400 text-sm" : ""} ${j===1||j===3 ? "text-yellow-400" : ""} text-sm`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. TGA MISOLI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📉 TGA egri chizig'ini tahlil qilish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>TGA egri chizig'i</strong> harorat oshishi bilan massa kamayishini ko'rsatadi.
            Har bir <strong>"zinapoya"</strong> — bitta parchalanish bosqichi. 
            Massa yo'qotish foizidan <strong>qancha va qanday molekulalar</strong> ajralgani hisoblanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">[CaC₂O₄]·H₂O — klassik TGA namunasi:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">100-150°C</span>
                <span className="text-purple-300">−H₂O (tashqi)</span>
                <span className="text-yellow-400">−12.3%</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">400-500°C</span>
                <span className="text-purple-300">−CO (oksalat → karbonat)</span>
                <span className="text-yellow-400">−19.2%</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">700-800°C</span>
                <span className="text-purple-300">−CO₂ (karbonat → oksid)</span>
                <span className="text-yellow-400">−30.1%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Termik tahlil — <strong className="text-yellow-400">harorat ta'siridagi o'zgarishlarni</strong> o'rganadi</li>
            <li>TGA: massa o'zgarishi, DTA: harorat farqi, DSC: issiqlik oqimi</li>
            <li>Ichki va tashqi sfera suvlari — <strong>har xil haroratda ajraladi</strong></li>
            <li>Gidrat izomeriyani <strong>bevosita isbotlash</strong> imkonini beradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/elektrokimyo" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Elektrokimyoviy tahlil</Link>
          <Link href="/ilmiy/tahlil" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Barcha tahlil usullari →</Link>
        </div>

      </section>
    </main>
  )
}