import Link from "next/link"

export default function RentgenDifraksiyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">💎 Rentgen difraksiyasi</h1>
          <p className="text-purple-400 text-sm">Kristall tuzilishini aniqlash • Bragg qonuni • Panjara parametrlari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Rentgen difraksiyasi haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Rentgen difraksiyasi</strong> — kompleks birikmalarning 
              <strong className="text-yellow-400"> aniq kristall tuzilishini</strong> aniqlashda yagona bevosita usul.
              Bu usul yordamida <strong className="text-yellow-400">bog' uzunliklari, burchaklar, fazoviy guruhlar</strong> 
              va atomlarning aniq koordinatalari aniqlanadi. 1914-yilda Bragglar tomonidan kashf etilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Kristall panjarasi</strong> parametrlari (a, b, c, α, β, γ)</li>
                <li>• <strong>Fazoviy guruh</strong> va simmetriya</li>
                <li>• <strong>Bog' uzunliklari</strong> (M-L, L-L)</li>
                <li>• <strong>Bog' burchaklari</strong> (L-M-L)</li>
                <li>• <strong>Atom koordinatalari</strong> (x, y, z)</li>
                <li>• <strong>Geometrik izomeriya</strong> (sis/trans, fac/mer)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Monoxromatik <strong>rentgen nurlari</strong> namunaga tushadi</li>
                <li>• Kristall panjaradagi elektronlar <strong>nurni sochadi</strong></li>
                <li>• <strong>Bragg qonuni</strong> bo'yicha difraksiya kuzatiladi</li>
                <li>• Difraksion rasm <strong>matematik qayta ishlanadi</strong></li>
                <li>• Natijada <strong>3D elektron zichlik xaritasi</strong> hosil bo'ladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. BRAGG QONUNI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Bragg qonuni</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6 text-center">
            <p className="text-3xl font-extrabold text-yellow-400 mb-4">nλ = 2d · sinθ</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-yellow-400 font-bold">n</div>
                <div className="text-purple-300">Diffraksiya tartibi (1, 2, 3...)</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-yellow-400 font-bold">λ</div>
                <div className="text-purple-300">To'lqin uzunligi (Cu Kα = 1.5418 Å)</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-yellow-400 font-bold">d</div>
                <div className="text-purple-300">Tekisliklar orasidagi masofa</div>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <div className="text-yellow-400 font-bold">θ</div>
                <div className="text-purple-300">Tushish burchagi</div>
              </div>
            </div>
          </div>

          <p className="text-purple-200 text-sm leading-relaxed">
            <strong className="text-yellow-400">Bragg qonuni</strong> rentgen difraksiyasining asosidir. 
            Kristall panjaradagi parallel tekisliklardan qaytgan nurlar <strong>interferensiya</strong> hosil qiladi. 
            Faqat ma'lum θ burchaklarda konstruktiv interferensiya kuzatiladi — bu difraksion piklar sifatida qayd etiladi.
          </p>
        </div>

        {/* 3. KOMPLEKSLAR UCHUN MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Kompleks birikmalarning kristallografik ma'lumotlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Fazoviy guruh</th>
                <th className="py-3 px-4 text-purple-300">a, b, c (Å)</th>
                <th className="py-3 px-4 text-purple-300">β (°)</th>
                <th className="py-3 px-4 text-purple-300">M-L (Å)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["K₃[Fe(CN)₆]", "P2₁/c", "7.07, 10.38, 13.44", "100.6", "Fe-C: 1.93"],
                  ["[Co(NH₃)₆]Cl₃", "P2₁/n", "10.82, 10.82, 15.50", "90", "Co-N: 1.96"],
                  ["sis-[PtCl₂(NH₃)₂]", "P2₁/c", "6.05, 9.02, 12.54", "97.2", "Pt-Cl: 2.33, Pt-N: 2.01"],
                  ["[Ni(CN)₄]²⁻", "P4/mmm", "10.20, 10.20, 8.90", "90", "Ni-C: 1.86"],
                  ["[Fe(C₅H₅)₂]", "P2₁/c", "5.91, 7.59, 9.59", "101.1", "Fe-C: 2.06"],
                  ["[Cu(H₂O)₆]²⁺", "P2₁/c", "6.12, 10.69, 13.88", "95.7", "Cu-O(ekv): 1.97, Cu-O(aks): 2.28"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. YAN-TELLER EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Yan-Teller effektini rentgen orqali kuzatish</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Yan-Teller effekti</strong> rentgen difraksiyasida yaqqol ko'rinadi.
            d⁹ konfiguratsiyali Cu²⁺ komplekslarida aksial bog'lar ekvatorial bog'lardan sezilarli darajada uzunroq bo'ladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3">[Cu(H₂O)₆]²⁺ — Yan-Teller buzilishi:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-400 font-bold mb-2">Ekvatorial (4 ta H₂O)</p>
                <p className="text-purple-200">Cu-O = <strong className="text-white">1.97 Å</strong></p>
                <p className="text-purple-300 text-xs">Qisqa, mustahkam bog'lar</p>
              </div>
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-red-400 font-bold mb-2">Aksial (2 ta H₂O)</p>
                <p className="text-purple-200">Cu-O = <strong className="text-white">2.28 Å</strong></p>
                <p className="text-purple-300 text-xs">Uzun, kuchsiz bog'lar</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. SIS-TRANS FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Rentgen orqali izomerlarni aniqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Rentgen difraksiyasi <strong className="text-yellow-400">geometrik izomerlarni</strong> aniq farqlash imkonini beradi.
            Bu usul yordamida Verner o'z nazariyasini isbotlagan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">sis-[PtCl₂(NH₃)₂]</h3>
              <p className="text-purple-200 text-sm">Cl⁻ lar yonma-yon — 90° burchak ostida</p>
              <p className="text-purple-300 text-sm mt-2">Cl-Pt-Cl burchagi: ~90°</p>
              <p className="text-purple-300 text-sm">Pt-Cl: 2.33 Å (ikkalasi teng)</p>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-2">trans-[PtCl₂(NH₃)₂]</h3>
              <p className="text-purple-200 text-sm">Cl⁻ lar qarama-qarshi — 180° burchak ostida</p>
              <p className="text-purple-300 text-sm mt-2">Cl-Pt-Cl burchagi: 180°</p>
              <p className="text-purple-300 text-sm">Pt-Cl: 2.32 Å (ikkalasi teng)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Rentgen difraksiyasi — <strong className="text-yellow-400">yagona bevosita tuzilish aniqlash usuli</strong></li>
            <li>Bragg qonuni: <strong>nλ = 2d·sinθ</strong></li>
            <li>Bog' uzunliklari, burchaklar, fazoviy guruhlar — <strong>aniq sonlar</strong></li>
            <li>Yan-Teller effekti, sis-trans izomerlar — <strong>bevosita ko'rinadi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← NMR spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/mass" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Mass-spektrometriya →</Link>
        </div>

      </section>
    </main>
  )
}