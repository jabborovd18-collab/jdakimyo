import Link from "next/link"

export default function BoglanishIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔗 Bog'lanish izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Ambidentat ligandlar • HSAB nazariyasi • Donor atom tanlovi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Bog'lanish izomeriyasi haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Bog'lanish izomeriyasi</strong> — 
              <strong className="text-green-400"> ambidentat ligandlar</strong> (ikki yoki undan ortiq donor atomga ega ligandlar) 
              metall bilan <strong>turli donor atomlari orqali</strong> bog'lanishi natijasida yuzaga keladi.
              Eng klassik misollar: <strong>NO₂⁻ (nitro) vs ONO⁻ (nitrito)</strong> va 
              <strong>SCN⁻ (tiotsianato) vs NCS⁻ (izotiotsianato)</strong>. Qaysi donor atom bog'lanishi 
              <strong>HSAB nazariyasi</strong> (qattiq-yumshoq kislota-asos) orqali bashorat qilinadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Ambidentat ligandlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>NO₂⁻ (nitro) / ONO⁻ (nitrito)</strong> — N yoki O orqali</li>
                <li>• <strong>SCN⁻ (tiotsianato) / NCS⁻ (izotiotsianato)</strong> — S yoki N orqali</li>
                <li>• <strong>CN⁻ (siyano) / NC⁻ (izosiyano)</strong> — C yoki N orqali</li>
                <li>• <strong>OCN⁻ (sianato) / NCO⁻ (izosianato)</strong> — O yoki N orqali</li>
                <li>• <strong>SeCN⁻ / NCSe⁻</strong> — Se yoki N orqali</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">HSAB nazariyasi asosida bashorat</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Qattiq kislotalar</strong> (Cr³⁺, Co³⁺, Fe³⁺) — qattiq asoslar bilan (N, O)</li>
                <li>• <strong>Yumshoq kislotalar</strong> (Pt²⁺, Pd²⁺, Hg²⁺, Ag⁺) — yumshoq asoslar bilan (S, C, P)</li>
                <li>• <strong>Oraliq kislotalar</strong> (Cu²⁺, Ni²⁺, Zn²⁺) — har ikkala turdagi donor bilan</li>
                <li>• <strong>Sterik omillar</strong> ham donor tanloviga ta'sir qiladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. NITRO/NITRITO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Nitro (NO₂) vs Nitrito (ONO) — klassik misol</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">[Co(NH₃)₅NO₂]²⁺ (nitro, sariq)</strong> va 
            <strong className="text-green-400">[Co(NH₃)₅ONO]²⁺ (nitrito, qizil)</strong> — 
            bog'lanish izomeriyasining eng mashhur namunasi. Nitro-izomer <strong>N atomi</strong> orqali, 
            nitrito-izomer <strong>O atomi</strong> orqali bog'langan. Qizdirilganda nitrito (kinetik mahsulot) 
            nitro ga (termodinamik mahsulot) o'tadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">[Co(NH₃)₅NO₂]²⁺ — Nitro (N-bog'langan)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Rang:</strong> Sariq-to'q sariq</li>
                <li>• <strong>Barqarorlik:</strong> Termodinamik mahsulot</li>
                <li>• <strong>IQ:</strong> ν_as(NO₂) ≈ 1430 sm⁻¹, ν_s(NO₂) ≈ 1310 sm⁻¹</li>
                <li>• <strong>Co−N−O burchagi:</strong> ~120°</li>
                <li>• <strong>HSAB:</strong> Co³⁺ (qattiq) — N (qattiq asos) = mos</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">[Co(NH₃)₅ONO]²⁺ — Nitrito (O-bog'langan)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Rang:</strong> Qizil</li>
                <li>• <strong>Barqarorlik:</strong> Kinetik mahsulot (qizdirilganda nitro ga o'tadi)</li>
                <li>• <strong>IQ:</strong> ν(N=O) ≈ 1060 sm⁻¹, ν(N−O) ≈ 1470 sm⁻¹</li>
                <li>• <strong>Co−O−N burchagi:</strong> ~115°</li>
                <li>• <strong>HSAB:</strong> O (qattiq asos) bilan bog' — kinetik afzal</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. TIOTSIANATO/IZOTIOTSIANATO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Tiotsianato (SCN) vs Izotiotsianato (NCS)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall ioni</th>
                <th className="py-3 px-4 text-purple-300">HSAB turi</th>
                <th className="py-3 px-4 text-purple-300">Bog'lanish</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">IQ farqi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cr³⁺, Co³⁺, Fe³⁺", "Qattiq kislota", "NCS⁻ (N-bog')", "[Cr(NH₃)₅NCS]²⁺", "ν(CN) ≈ 2100 sm⁻¹"],
                  ["Pt²⁺, Pd²⁺, Hg²⁺, Ag⁺", "Yumshoq kislota", "SCN⁻ (S-bog')", "[Pd(SCN)₄]²⁻", "ν(CN) ≈ 2130 sm⁻¹"],
                  ["Cu²⁺, Ni²⁺, Zn²⁺", "Oraliq", "Ikkalasi ham mumkin", "[Ni(NCS)₄]²⁻ / [Zn(SCN)₄]²⁻", "Oraliq qiymat"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-green-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-2">Linkage izomerizatsiya — SCN⁻ ↔ NCS⁻</h3>
            <p className="text-purple-200 text-sm">
              Ba'zi komplekslarda bog'lanish izomerlari <strong>qizdirilganda yoki yorug'lik ta'sirida</strong> 
              bir-biriga o'tishi mumkin. Masalan, [Co(NH₃)₅SCN]²⁺ (S-bog'langan, kinetik mahsulot) 
              qizdirilganda [Co(NH₃)₅NCS]²⁺ (N-bog'langan, termodinamik mahsulot) ga o'tadi.
              Bu jarayon <strong>linkage izomerizatsiya</strong> deb ataladi va IQ spektroskopiyasi orqali 
              ν(CN) chastotasining siljishi bilan kuzatiladi.
            </p>
          </div>
        </div>

        {/* 4. IQ ORQALI FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 IQ spektroskopiya — bog'lanish izomerlarini farqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Bog'lanish izomerlari <strong>turli donor atomlar</strong> orqali bog'langani uchun 
            ularning IQ spektrlari sezilarli farq qiladi. Bu eng ishonchli farqlash usulidir.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand jufti</th>
                <th className="py-3 px-4 text-purple-300">Izomer 1</th>
                <th className="py-3 px-4 text-purple-300">IQ belgisi (sm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Izomer 2</th>
                <th className="py-3 px-4 text-purple-300">IQ belgisi (sm⁻¹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["NO₂⁻ / ONO⁻", "Nitro (N-bog')", "ν_as 1430, ν_s 1310", "Nitrito (O-bog')", "ν(N=O) 1060, ν(N−O) 1470"],
                  ["SCN⁻ / NCS⁻", "S-bog'langan", "ν(CN) 2130, ν(CS) 700", "N-bog'langan", "ν(CN) 2100, ν(CS) 780"],
                  ["OCN⁻ / NCO⁻", "O-bog'langan", "ν(CN) 2180", "N-bog'langan", "ν(CN) 2200"],
                  ["CN⁻ / NC⁻", "C-bog'langan", "ν(CN) 2100", "N-bog'langan", "ν(CN) 2050"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-green-400 text-xs">{r[0]}</td>
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

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Bog'lanish izomeriyasi — <strong className="text-green-400">ambidentat ligandlarning turli donor atomlari</strong> orqali bog'lanishi</li>
            <li>HSAB nazariyasi — <strong className="text-green-400">donor atom tanlovini bashorat qilish</strong> imkonini beradi</li>
            <li>Nitro (termodinamik) vs nitrito (kinetik) — <strong className="text-green-400">qizdirilganda o'zaro o'tadi</strong></li>
            <li>IQ spektroskopiya — <strong className="text-green-400">eng ishonchli farqlash usuli</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/ionlanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ionlanish izomeriyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/koordinatsion" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Koordinatsion izomeriya →</Link>
        </div>

      </section>
    </main>
  )
}