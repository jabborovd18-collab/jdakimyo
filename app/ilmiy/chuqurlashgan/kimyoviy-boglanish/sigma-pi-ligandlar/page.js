import Link from "next/link"

export default function SigmaPiLigandlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">⚡ σ-donor va π-akseptor ligandlar</h1>
          <p className="text-purple-400 text-sm">CO, CN⁻, PR₃ — kuchli maydonli ligandlar • Sinergik bog'lanish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ligandlarning elektron xususiyatlari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ligandlar</strong> metall bilan nafaqat σ-bog', balki <strong className="text-yellow-400">π-bog'</strong> ham hosil qilishi mumkin.
              Ligandning π-orbitallari borligi uning <strong className="text-yellow-400">maydon kuchini</strong> keskin o'zgartiradi.
              Aynan π-bog'lanish sababli CO, CN⁻ va PR₃ eng kuchli maydonli ligandlar hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">σ</div>
              <h3 className="text-blue-400 font-bold">σ-donor</h3>
              <p className="text-purple-200 text-sm mt-2">Faqat σ-bog' orqali elektron beradi. Masalan: NH₃, H₂O, F⁻, Cl⁻</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">π</div>
              <h3 className="text-red-400 font-bold">π-donor</h3>
              <p className="text-purple-200 text-sm mt-2">π-orbitallaridan ham elektron beradi. Masalan: F⁻, Cl⁻, OH⁻, O²⁻</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">π*</div>
              <h3 className="text-green-400 font-bold">π-akseptor</h3>
              <p className="text-purple-200 text-sm mt-2">Metallning d-elektronlarini π*-orbitaliga qabul qiladi. Masalan: CO, CN⁻, PR₃</p>
            </div>
          </div>
        </div>

        {/* 2. SINERGIK BOG'LANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Sinergik bog'lanish mexanizmi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Sinergik bog'lanish</strong> — bir vaqtning o'zida ham σ-donor, ham π-akseptor bo'lgan ligandlarda kuzatiladi.
            Bu ikki ta'sir <strong>bir-birini kuchaytiradi</strong>: σ-bog' metallda elektron zichligini oshiradi, π-akseptor esa ortiqcha elektronni qaytarib oladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-blue-400 font-bold text-lg mb-3">1. σ-donor ta'siri</h3>
              <p className="text-purple-200 text-sm">
                Ligand o'zining taqsimlanmagan elektron juftini metallning bo'sh orbitaliga beradi. 
                Metall atrofida <strong>elektron zichligi ortadi</strong>.
              </p>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-lg mb-3">2. π-akseptor ta'siri</h3>
              <p className="text-purple-200 text-sm">
                Metall o'zining to'lgan d-orbitallaridan elektronlarni ligandning bo'sh π*-orbitaliga qaytaradi.
                Bu <strong>"orqaga donorlik"</strong> (back-donation) deb ataladi.
              </p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-6">
            <h3 className="text-yellow-400 font-bold mb-2">Natija:</h3>
            <p className="text-purple-200 text-sm">
              Ikkala ta'sir birgalikda metall-ligand bog'ini <strong>mustahkamlaydi</strong>. 
              Bu sinergik bog'lanish CO, CN⁻ va PR₃ kabi ligandlarning <strong>kuchli maydon hosil qilishini</strong> tushuntiradi.
            </p>
          </div>
        </div>

        {/* 3. CO — ENG MUHIM π-AKSEPTOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ CO — eng muhim π-akseptor ligand</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">CO ning elektron tuzilishi</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>σ-donor:</strong> C atomidagi taqsimlanmagan juft (HOMO)</li>
                <li>• <strong>π-akseptor:</strong> Bo'sh π* orbitallar (LUMO)</li>
                <li>• C≡O bog'i: 1 ta σ + 2 ta π bog'</li>
                <li>• IQ chastotasi erkin CO uchun: <strong>2143 cm⁻¹</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Metall karbonillarida</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Metall → CO π-orqaga donorlik <strong>C≡O bog'ini kuchsizlantiradi</strong></li>
                <li>• IQ chastotasi <strong>pasayadi</strong>: 2143 → 1850-2100 cm⁻¹</li>
                <li>• Metall qancha boy bo'lsa, π-orqaga donorlik shuncha kuchli</li>
                <li>• [Ni(CO)₄]: ν(CO) = 2057 cm⁻¹</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. SPEKTROKIMYOVIY QATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Spektrokimyoviy qator — π-bog'lanish ta'siri</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Ligandlarning <strong>maydon kuchi</strong> ularning π-xossalariga bevosita bog'liq. 
            π-akseptorlar eng kuchli maydon hosil qiladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand turi</th><th className="py-3 px-4 text-purple-300">π-xossasi</th><th className="py-3 px-4 text-purple-300">Maydon kuchi</th><th className="py-3 px-4 text-purple-300">Misollar</th><th className="py-3 px-4 text-purple-300">Δo (nisbiy)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["π-donor", "Elektron beradi", "Eng kuchsiz", "I⁻, Br⁻, Cl⁻, F⁻", "Kichik"],
                  ["Kuchsiz π-donor", "Kam elektron beradi", "Kuchsiz-o'rtacha", "H₂O, OH⁻", "O'rtacha"],
                  ["Faqat σ-donor", "π-bog' yo'q", "O'rtacha", "NH₃, en", "O'rtacha-katta"],
                  ["π-akseptor", "Elektron qabul qiladi", "Eng kuchli", "CN⁻, CO, PR₃", "Juda katta"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td><td className="py-3 px-4 font-mono text-sm">{r[3]}</td><td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ligandlar <strong className="text-yellow-400">σ-donor, π-donor yoki π-akseptor</strong> bo'lishi mumkin</li>
            <li>CO — <strong>eng kuchli π-akseptor</strong>, sinergik bog'lanish hosil qiladi</li>
            <li>π-akseptorlar <strong>Δo ni oshiradi</strong> — quyi spinli komplekslar</li>
            <li>IQ chastotasi orqali <strong>π-orqaga donorlik darajasi</strong> aniqlanadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MO nazariyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Gibridlanish →</Link>
        </div>

      </section>
    </main>
  )
}