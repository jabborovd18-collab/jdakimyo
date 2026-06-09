import Link from "next/link"

export default function IQSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📊 IQ spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Infraqizil spektroskopiya • Tebranish chastotalari • Ligand bog&apos;lanish turini aniqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR IQ TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/iq/birikmalar"
          className="group block bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
              🔍
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                Birikmalarning IQ tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                12 ta kompleks birikmaning IQ spektrlari tahlili. Har bir birikma uchun cho&apos;qqilar jadvali, 
                spektr grafigi, metall-ligand tebranish chastotalari va guruh nazariyasi tahlili.
              </p>
            </div>
            <div className="text-3xl text-blue-400 group-hover:translate-x-1 transition-transform">
              →
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Spektr grafigi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Cho&apos;qqilar jadvali</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Guruh nazariyasi</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 IQ spektroskopiya haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">IQ (Infraqizil) spektroskopiya</strong> — molekulalardagi 
              <strong className="text-yellow-400"> tebranish chastotalarini</strong> o&apos;lchashga asoslangan usul.
              Kompleks birikmalarda <strong className="text-yellow-400">metall-ligand bog&apos;lanishini</strong>, 
              ligandning qaysi atom orqali bog&apos;langanini (ambidentat ligandlar) va 
              <strong className="text-yellow-400"> sis-trans izomerlarni</strong> farqlashda ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Metall-ligand bog&apos;i</strong> mavjudligini</li>
                <li>• <strong>Ambidentat ligandlar</strong> (qaysi atom bog&apos;langan)</li>
                <li>• <strong>Sis-trans izomerlar</strong> farqini</li>
                <li>• <strong>Koordinatsion bog&apos;</strong> mustahkamligini</li>
                <li>• <strong>Funksional guruhlar</strong> mavjudligini</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Namunaga <strong>IQ nurlar</strong> yuboriladi</li>
                <li>• 4000-400 cm⁻¹ oralig&apos;ida</li>
                <li>• Molekulalar <strong>tebranish energiyasini</strong> yutadi</li>
                <li>• Har bir bog&apos; <strong>o&apos;ziga xos chastotada</strong> yutiladi</li>
                <li>• &quot;Molekulyar barmoq izi&quot;</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. METALL-LIGAND TEBRANISHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Metall-ligand tebranish chastotalari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            IQ spektroskopiyada <strong className="text-yellow-400">eng muhim soha</strong> — 
            600-200 cm⁻¹ oralig&apos;idagi <strong>metall-ligand tebranishlari</strong>. 
            Bu soha &quot;uzoq IQ&quot; yoki &quot;past chastotali IQ&quot; deb ataladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th><th className="py-3 px-4 text-purple-300">Bog&apos;</th><th className="py-3 px-4 text-purple-300">Chastota (cm⁻¹)</th><th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₆]³⁺", "Co-N", "500-450", "Kuchli bog&apos;"],
                  ["[Fe(CN)₆]³⁻", "Fe-C", "510", "CN⁻ kuchli maydon"],
                  ["[PtCl₄]²⁻", "Pt-Cl", "330-320", "Og&apos;ir metall — past chastota"],
                  ["[Ni(CO)₄]", "Ni-C", "420", "Karbonil kompleks"],
                  ["[Cr(H₂O)₆]³⁺", "Cr-O", "490", "Akvakompleks"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. AMBIDENTAT LIGANDLARNI FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔀 Ambidentat ligandlarni IQ orqali farqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            IQ spektroskopiya <strong className="text-yellow-400">ambidentat ligandlarning</strong> qaysi atom orqali 
            bog&apos;langanini aniqlashda eng ishonchli usul hisoblanadi.
          </p>

          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">NO₂⁻ (Nitro) vs ONO⁻ (Nitrito)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-green-400 font-bold mb-2">Nitro (N-bog&apos;langan)</p>
                  <p className="text-purple-200">ν<sub>as</sub>(NO₂): ~1420 cm⁻¹</p>
                  <p className="text-purple-200">ν<sub>s</sub>(NO₂): ~1310 cm⁻¹</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-red-400 font-bold mb-2">Nitrito (O-bog&apos;langan)</p>
                  <p className="text-purple-200">ν(N=O): ~1460 cm⁻¹</p>
                  <p className="text-purple-200">ν(N-O): ~1060 cm⁻¹</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">SCN⁻ (Tiosianato) vs NCS⁻ (Izotiosianato)</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-green-400 font-bold mb-2">S-bog&apos;langan</p>
                  <p className="text-purple-200">ν(C≡N): ~2120 cm⁻¹</p>
                  <p className="text-purple-200">ν(C-S): ~700 cm⁻¹</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-blue-400 font-bold mb-2">N-bog&apos;langan</p>
                  <p className="text-purple-200">ν(C≡N): ~2050 cm⁻¹</p>
                  <p className="text-purple-200">ν(C-S): ~780 cm⁻¹</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIS-TRANS FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Sis-trans izomerlarni IQ orqali farqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Sis va trans izomerlar <strong className="text-yellow-400">simmetriyasi har xil</strong> bo&apos;lgani uchun 
            IQ spektrlarida farq qiladi. Trans izomerlarda ko&apos;proq simmetriya tufayli ba&apos;zi tebranishlar &quot;ko&apos;rinmaydi&quot;.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Misol: [PtCl₂(NH₃)₂]</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 font-bold mb-2">sis-izomer</p>
                <p className="text-purple-200">Pt-Cl: 330, 315 cm⁻¹ (2 ta polosa)</p>
                <p className="text-purple-200">Pt-N: 510, 490 cm⁻¹ (2 ta polosa)</p>
              </div>
              <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-4">
                <p className="text-orange-400 font-bold mb-2">trans-izomer</p>
                <p className="text-purple-200">Pt-Cl: 325 cm⁻¹ (1 ta polosa)</p>
                <p className="text-purple-200">Pt-N: 500 cm⁻¹ (1 ta polosa)</p>
              </div>
            </div>
            <p className="text-purple-300 text-xs mt-3">
              Trans izomerda simmetriya yuqori — ba&apos;zi tebranishlar IQ faol emas.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>IQ — <strong className="text-yellow-400">metall-ligand bog&apos;lanishini</strong> o&apos;rganishda asosiy usul</li>
            <li>Past chastotali soha (600-200 cm⁻¹) — <strong>M-L tebranishlari</strong></li>
            <li>Ambidentat ligandlarni <strong>ishonchli farqlash</strong> imkonini beradi</li>
            <li>Sis-trans izomerlar <strong>simmetriya farqi</strong> tufayli ajratiladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← UB-Vis</Link>
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">NMR spektroskopiya →</Link>
        </div>

      </section>
    </main>
  )
}