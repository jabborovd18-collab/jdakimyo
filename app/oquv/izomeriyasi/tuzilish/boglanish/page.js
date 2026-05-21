import Link from "next/link"

export default function BoglanishIzomeriyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🔗 Bog'lanish izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Ambidentat ligandlar har xil atom orqali bog'langanda kuzatiladi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/izomeriyasi/tuzilish/boglanish/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-pink-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-pink-200">[Co(NH₃)₅NO₂]²⁺ vs [Co(NH₃)₅ONO]²⁺</div>
            </div>
          </Link>
        </div>

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Bog'lanish izomeriyasi haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Bog'lanish izomeriyasi</strong> — 
              <strong className="text-yellow-400"> ambidentat ligandlar</strong> (bir nechta donor atomga ega ligandlar) 
              markaziy ionga <strong className="text-yellow-400">har xil atomi orqali bog'langanda</strong> kuzatiladi.
              Ligandning qaysi atomi donor bo'lishiga qarab, kompleksning xossalari (rangi, barqarorligi, reaksion qobiliyati) farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ambidentat ligandlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>SCN⁻ / NCS⁻:</strong> S yoki N orqali</li>
                <li>• <strong>NO₂⁻ / ONO⁻:</strong> N (nitro) yoki O (nitrito) orqali</li>
                <li>• <strong>CN⁻ / NC⁻:</strong> C (siyano) yoki N (izosiyano) orqali</li>
                <li>• <strong>CO:</strong> C yoki O orqali (kam uchraydi)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday farqlanadi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Rangi:</strong> donor atomga qarab o'zgaradi</li>
                <li>• <strong>IQ spektroskopiya:</strong> bog'lanish chastotasi farqi</li>
                <li>• <strong>Rentgen difraksiyasi:</strong> qaysi atom bog'langanini ko'rsatadi</li>
                <li>• <strong>Barqarorlik:</strong> bir izomer barqarorroq bo'lishi mumkin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol: Verner kashfiyoti</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Alfred Verner tomonidan o'rganilgan eng mashhur bog'lanish izomeriyasi misoli — kobalt(III) ning 
            <strong className="text-yellow-400"> nitro va nitrito komplekslari</strong>. Verner rentgen difraksiyasi yo'q davrda 
            komplekslarning <strong className="text-yellow-400">rangiga qarab</strong> bog'lanish turini to'g'ri aniqlagan!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">Nitro izomer</h3>
              <p className="font-mono text-yellow-400 text-lg mb-3">[Co(NH₃)₅NO₂]Cl₂</p>
              <p className="text-purple-200 mb-4"><strong>nitropentaamminkobalt(III) xlorid</strong></p>
              
              <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
                <p className="text-purple-200 text-sm"><strong>Bog'lanish:</strong> <span className="text-yellow-400">N orqali (—NO₂)</span></p>
                <p className="text-purple-200 text-sm"><strong>Rangi:</strong> <span className="text-yellow-400">Sariq</span></p>
                <p className="text-purple-200 text-sm"><strong>Sababi:</strong> 6 ta N-donor (5 NH₃ + 1 NO₂)</p>
                <p className="text-purple-200 text-sm"><strong>Barqarorligi:</strong> Yuqori</p>
              </div>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-400 mb-3">Nitrito izomer</h3>
              <p className="font-mono text-red-400 text-lg mb-3">[Co(NH₃)₅ONO]Cl₂</p>
              <p className="text-purple-200 mb-4"><strong>nitritopentaamminkobalt(III) xlorid</strong></p>
              
              <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
                <p className="text-purple-200 text-sm"><strong>Bog'lanish:</strong> <span className="text-red-400">O orqali (—ONO)</span></p>
                <p className="text-purple-200 text-sm"><strong>Rangi:</strong> <span className="text-red-400">Qizg'ish-pushti</span></p>
                <p className="text-purple-200 text-sm"><strong>Sababi:</strong> 5 ta N-donor + 1 ta O-donor</p>
                <p className="text-purple-200 text-sm"><strong>Barqarorligi:</strong> Yorug'likda nitroga o'tadi</p>
              </div>
            </div>
          </div>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-4 mt-4">
            <p className="text-yellow-300 text-sm">
              <strong>💡 Verner dahosi:</strong> Nitro-kompleks sariq (6 ta N-donor), nitrito-kompleks qizg'ish (5 ta N-donor). 
              Verner donor atomlar soniga qarab rang o'zgarishini to'g'ri bashorat qilgan!
            </p>
          </div>
        </div>

        {/* 3. BOSHQA AMBIDENTAT LIGANDLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa ambidentat ligandlar va misollar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tiosianat (SCN⁻) / Izotiosianat (NCS⁻)</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Fe(SCN)(H₂O)₅]²⁺</span> — S orqali (tiosianato, κS)<br/>
                <span className="font-mono text-pink-400">[Fe(NCS)(H₂O)₅]²⁺</span> — N orqali (tiosianato, κN)
              </p>
              <p className="text-purple-300 text-sm">
                Ko'pchilik 3d metallar N orqali, 4d va 5d metallar S orqali bog'lanishni afzal ko'radi.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Sianid (CN⁻) / Izosianid (NC⁻)</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Fe(CN)₆]⁴⁻</span> — C orqali (siyano)<br/>
                <span className="font-mono text-pink-400">[Fe(NC)₆]⁴⁻</span> — N orqali (izosiyano)
              </p>
              <p className="text-purple-300 text-sm">
                Sianid komplekslarda deyarli har doim C orqali bog'lanish kuzatiladi (barqarorroq).
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">CO (karbonil) / OC (izokarbonil)</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Fe(CO)₅]</span> — C orqali (karbonil)<br/>
                <span className="font-mono text-pink-400">[Fe(OC)₅]</span> — O orqali (izokarbonil) — juda kam uchraydi
              </p>
            </div>
          </div>
        </div>

        {/* 4. IQ SPEKTROSKOPIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 IQ spektroskopiya bilan farqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Bog'lanish izomerlarini aniqlashning eng ishonchli usullaridan biri — 
            <strong className="text-yellow-400"> IQ spektroskopiya</strong>. Har bir bog'lanish turi o'ziga xos chastotada yutilish beradi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th>
                <th className="py-3 px-4 text-purple-300">Bog'lanish turi</th>
                <th className="py-3 px-4 text-purple-300">IQ chastota (sm⁻¹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">NO₂⁻ (N-bog'langan)</td><td className="py-3 px-4">Nitro</td><td className="py-3 px-4">~1420, ~1310</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">ONO⁻ (O-bog'langan)</td><td className="py-3 px-4">Nitrito</td><td className="py-3 px-4">~1460, ~1060</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">SCN⁻ (S-bog'langan)</td><td className="py-3 px-4">Tiosianato</td><td className="py-3 px-4">~2100 (C≡N)</td></tr>
                <tr><td className="py-3 px-4">NCS⁻ (N-bog'langan)</td><td className="py-3 px-4">Izotiosianato</td><td className="py-3 px-4">~2050 (C≡N)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Bog'lanish izomeriyasi — <strong className="text-yellow-400">ambidentat ligandlarning har xil atom orqali bog'lanishi</strong></li>
            <li>Eng mashhur: <strong>[Co(NH₃)₅NO₂]²⁺ (nitro, sariq) va [Co(NH₃)₅ONO]²⁺ (nitrito, qizg'ish)</strong></li>
            <li>Verner rang farqiga qarab bog'lanish turini birinchi bo'lib aniqlagan</li>
            <li>IQ spektroskopiya — eng ishonchli farqlash usuli</li>
            <li>Asosiy ambidentat ligandlar: <strong>NO₂⁻/ONO⁻, SCN⁻/NCS⁻, CN⁻/NC⁻</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/gidrat" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Gidrat izomeriyasi</Link>
          <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Koordinatsion izomeriya →</Link>
        </div>

      </section>
    </main>
  )
}