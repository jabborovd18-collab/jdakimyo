import Link from "next/link"

export default function MagnitKlasterlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="text-purple-400 hover:text-purple-300 text-lg">← Ko'p yadroli</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🧲 Ko'p yadroli magnit komplekslar (SMM)</h1>
          <p className="text-purple-400 text-sm">Mn₁₂ • Fe₈ • Molekulyar magnitlar • Kvant tunnellash • Histerezis</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 SMM haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">SMM (Single-Molecule Magnets)</strong> — past haroratda 
              <strong className="text-purple-400"> magnit histerezis va sekin magnit relaksatsiyasi</strong> 
              namoyon qiladigan ko'p yadroli metall komplekslar. Birinchi SMM — 
              <strong className="text-purple-400">[Mn₁₂O₁₂(OAc)₁₆(H₂O)₄] (Mn₁₂, 1993)</strong> — 
              molekulyar darajada magnit xotira xossasiga ega. SMM lar <strong>yuqori spin (S)</strong> 
              va <strong>katta magnit anizotropiya (D)</strong> ga ega bo'lib, ularning kombinatsiyasi 
              <strong>magnit momentning orientatsiyasini "muzlatish"</strong> imkonini beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">SMM uchun asosiy parametrlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>S — umumiy spin:</strong> Ko'p yadroli kompleksdagi barcha toq elektronlar yig'indisi</li>
                <li>• <strong>D — nol-maydon bo'linishi (ZFS):</strong> Aksial magnit anizotropiya parametri (D {'<'} 0 — oson o'qli)</li>
                <li>• <strong>U_eff = |D|·S²:</strong> Magnit momentning qayta orientatsiyalanishi uchun energetik to'siq</li>
                <li>• <strong>τ — relaksatsiya vaqti:</strong> Arrhenius qonuni: τ = τ₀·exp(U_eff/kT)</li>
                <li>• <strong>T_B — bloklash harorati:</strong> Magnit histerezis kuzatiladigan eng yuqori harorat</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Klassik SMM lar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">SMM</th><th className="text-left py-2 text-purple-300">S</th><th className="text-left py-2 text-yellow-400">U_eff (K)</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Mn₁₂-acetat","10","~60 K"],["Fe₈","10","~25 K"],["Mn₆","12","~86 K"],["Mn₄","9","~12 K"],["[Dy₅]", "10", "~530 K (rekord!)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-purple-400">{r[0]}</td><td className="py-1.5">{r[1]}</td><td className="py-1.5">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Mn₁₂ SMM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Mn₁₂ — birinchi SMM (1993)</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">[Mn₁₂O₁₂(OAc)₁₆(H₂O)₄] (Mn₁₂-acetat)</strong> — 
            eng ko'p o'rganilgan SMM. Uning tarkibida <strong>8 ta Mn³⁺ (S=2)</strong> va 
            <strong>4 ta Mn⁴⁺ (S=3/2)</strong> mavjud. Antiferromagnit almashinuv orqali 
            <strong>umumiy spin S=10</strong> hosil bo'ladi. <strong>U_eff ≈ 60 K</strong> — 
            magnit momentning relaksatsiyasi uchun energetik to'siq.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-2">Mn₁₂ struktura xususiyatlari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Markaziy kub:</strong> 4 ta Mn⁴⁺ + 4 ta O²⁻ — [Mn₄O₄] kub</li>
                <li>• <strong>Tashqi halqa:</strong> 8 ta Mn³⁺ — 8 ta O²⁻ ko'prik</li>
                <li>• <strong>Mn³⁺−Mn⁴⁺ almashinuv:</strong> Antiferromagnit — J ≈ −40 K</li>
                <li>• <strong>Mn³⁺:</strong> Yahn-Teller faol (d⁴) — aksial cho'zilish → magnit anizotropiya manbai</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Kvant tunnellash (QTM)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Klassik to'siqdan o'tmasdan:</strong> Magnit moment tunnel orqali o'tadi</li>
                <li>• <strong>Rezonans QTM:</strong> S=10 holatlari orasida — qadamlar ko'rinishidagi histerezis</li>
                <li>• <strong>Haroratga bog'liq emas:</strong> Juda past haroratda ham kuzatiladi (mK diapazonida)</li>
                <li>• <strong>Kvant histerezis:</strong> Qadamlar — magnit momentning diskret o'zgarishi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. QO'LLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔮 SMM qo'llanish istiqbollari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { title: "Molekulyar xotira", desc: "1 bit = 1 molekula! Nazariy zichlik — 10¹² bit/sm² (hozirgi HDD dan 1000× yuqori)", note: "Asosiy muammo: juda past harorat kerak (T {'<'} 4 K)" },
              { title: "Kvant kompyuterlar", desc: "SMM lar qubit sifatida — spin holatlari orasidagi kvant superpozitsiya", note: "Grovers algoritmi SMM da namoyish etilgan" },
              { title: "Spintronika", desc: "Magnit moment orqali elektron spinini boshqarish — spin klapanlari, spin tranzistorlari", note: "Organik spintronika — yumshoq materiallar" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-400 font-bold">{r.title}</p>
                <p className="text-purple-300 mt-1">{r.desc}</p>
                <p className="text-yellow-400 mt-2">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>SMM — <strong className="text-purple-400">yuqori spin + katta magnit anizotropiya</strong> = sekin magnit relaksatsiyasi</li>
            <li>U_eff = |D|·S² — <strong className="text-purple-400">magnit moment relaksatsiyasi uchun energetik to'siq</strong></li>
            <li>Kvant tunnellash (QTM) — <strong className="text-purple-400">klassik to'siqdan o'tmasdan magnit moment o'zgarishi</strong></li>
            <li>Qo'llanish: <strong className="text-purple-400">molekulyar xotira, kvant kompyuterlar, spintronika</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/karbonil-klasterlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Karbonil klasterlar</Link>
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/aralash-valentli" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Aralash valentli komplekslar →</Link>
        </div>

      </section>
    </main>
  )
}