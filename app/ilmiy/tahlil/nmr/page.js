import Link from "next/link"

export default function YaMRSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧲 YaMR spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Yadro magnit rezonansi • Kimyoviy siljish • Tuzilish aniqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR YaMR TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/nmr/birikmalar"
          className="group block bg-gradient-to-r from-green-900/40 to-purple-900/40 border border-green-700/50 rounded-2xl p-6 hover:bg-green-900/60 hover:border-green-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-green-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              🔍
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                Birikmalarning YaMR tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning ¹H, ¹³C, ¹⁹⁵Pt, ⁵⁹Co YaMR spektrlari tahlili. 
                Kimyoviy siljishlar, multipletlik, diamagnit va paramagnit komplekslar farqi.
              </p>
            </div>
            <div className="text-3xl text-green-400 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">¹H, ¹³C, ¹⁹⁵Pt, ⁵⁹Co</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kimyoviy siljish</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Multipletlik</span>
            <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-3 py-1 rounded-full text-xs">Paramagnit effekti</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 YaMR spektroskopiya haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">YaMR (Yadro magnit rezonansi)</strong> — molekulalarning 
              <strong className="text-yellow-400"> tuzilishini aniqlashda</strong> eng kuchli usullardan biri.
              Kompleks birikmalarda <strong className="text-yellow-400">ligandlarning joylashuvi</strong>, 
              <strong className="text-yellow-400"> dinamik jarayonlar</strong> (ligand almashinish) va 
              <strong className="text-yellow-400"> eritmadagi muvozanat</strong> o&apos;rganiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Kimyoviy siljish</strong> (δ, ppm)</li>
                <li>• <strong>Spin-spin bog&apos;lanish</strong> (J, Hz)</li>
                <li>• <strong>Ligandlar soni va joylashuvi</strong></li>
                <li>• <strong>Dinamik jarayonlar</strong> tezligi</li>
                <li>• <strong>Sis-trans izomerlar</strong> farqi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Kuchli <strong>magnit maydoni</strong> qo&apos;llaniladi</li>
                <li>• Yadrolar <strong>radi to&apos;lqinlarni</strong> yutadi</li>
                <li>• Har bir kimyoviy muhit <strong>o&apos;ziga xos signal</strong> beradi</li>
                <li>• ¹H, ¹³C, ³¹P, ¹⁹F — eng ko&apos;p ishlatiladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KOMPLEKSLARDA NMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kompleks birikmalarda YaMR qo&apos;llanishi</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">1. Sis-trans izomerlarni farqlash</h3>
              <p className="text-purple-200 text-sm mb-2">
                [PtCl₂(NH₃)₂] — sis va trans izomerlar ¹⁹⁵Pt NMR da har xil kimyoviy siljish beradi.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3 text-center">
                  <p className="text-blue-400 font-bold">sis-izomer</p>
                  <p className="text-purple-200">δ(Pt) = −2100 ppm</p>
                </div>
                <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-3 text-center">
                  <p className="text-orange-400 font-bold">trans-izomer</p>
                  <p className="text-purple-200">δ(Pt) = −1850 ppm</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">2. Ligand almashinish kinetikasi</h3>
              <p className="text-purple-200 text-sm">
                YaMR yordamida <strong>erkin ligand</strong> va <strong>koordinatsiyalangan ligand</strong> 
                signallari farqlanadi. Almashinish tezligiga qarab:
              </p>
              <ul className="text-purple-300 text-sm space-y-1 mt-2">
                <li>• <strong>Sekin almashinish:</strong> ikkala signal ham ko&apos;rinadi</li>
                <li>• <strong>Tez almashinish:</strong> bitta o&apos;rtacha signal ko&apos;rinadi</li>
                <li>• <strong>Oraliq:</strong> kengaygan signallar</li>
              </ul>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">3. Paramagnit komplekslarda YaMR</h3>
              <p className="text-purple-200 text-sm">
                Paramagnit markaziy atom (toq elektronli) signallarni <strong>kengaytiradi</strong> va 
                <strong>siljitadi</strong>. Bu kengayish miqdori metall-markaz masofasiga bog&apos;liq.
              </p>
            </div>
          </div>
        </div>

        {/* 3. KIMYOVIY SILJISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kimyoviy siljish (δ) — kompleks birikmalarda</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Yadro</th><th className="py-3 px-4 text-purple-300">δ (ppm)</th><th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₆]³⁺", "⁵⁹Co", "8120", "Oktaedrik, diamagnit"],
                  ["[PtCl₄]²⁻", "¹⁹⁵Pt", "1620", "Tekis kvadrat"],
                  ["[Rh(acac)₃]", "¹⁰³Rh", "6700", "Oktaedrik"],
                  ["[Fe(CN)₆]⁴⁻", "¹³C", "177", "CN⁻ signali"],
                  ["[Al(H₂O)₆]³⁺", "²⁷Al", "0", "Simmetrik oktaedrik"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-green-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>NMR — <strong className="text-yellow-400">tuzilish va dinamikani</strong> o&apos;rganishda asosiy usul</li>
            <li>Sis-trans izomerlar <strong>har xil kimyoviy siljish</strong> beradi</li>
            <li>Ligand almashinish tezligini <strong>signallar shaklidan</strong> aniqlash mumkin</li>
            <li>Paramagnit metallar signallarni <strong>kengaytiradi va siljitadi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← IQ spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Rentgen difraksiyasi →</Link>
        </div>

      </section>
    </main>
  )
}