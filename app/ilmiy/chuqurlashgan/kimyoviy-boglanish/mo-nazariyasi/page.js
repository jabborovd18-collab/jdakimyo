import Link from "next/link"

export default function MONazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔄 Molekulyar orbitallar (MO) nazariyasi</h1>
          <p className="text-purple-400 text-sm">Atom orbitallarining chiziqli kombinatsiyasi • σ va π bog'lar • Bog'lovchi va bo'shashtiruvchi MO</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 MO nazariyasi haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Molekulyar orbitallar nazariyasi</strong> — atom orbitallarining 
              <strong className="text-yellow-400"> chiziqli kombinatsiyasidan (LCAO)</strong> molekulyar orbitallar hosil bo'lishini tushuntiradi.
              VB nazariyasidan farqli ravishda, MO nazariyasi <strong className="text-yellow-400">butun molekulani yaxlit</strong> ko'rib chiqadi.
              Kompleks birikmalarda metall va ligand orbitallari birgalikda yangi MO larni hosil qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">🔽</div>
              <h3 className="text-green-400 font-bold">Bog'lovchi MO</h3>
              <p className="text-purple-200 text-sm">Energiyasi atom orbitallarinikidan <strong>past</strong>. Elektronlar shu yerga joylashadi — bog' mustahkamlanadi.</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">🔼</div>
              <h3 className="text-red-400 font-bold">Bo'shashtiruvchi MO</h3>
              <p className="text-purple-200 text-sm">Energiyasi atom orbitallarinikidan <strong>yuqori</strong>. Odatda bo'sh bo'ladi.</p>
            </div>
            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-5">
              <div className="text-3xl mb-2">➡️</div>
              <h3 className="text-gray-400 font-bold">Bog'lamaydigan MO</h3>
              <p className="text-purple-200 text-sm">Energiyasi o'zgarmaydi. Bog'lanishga ta'sir qilmaydi.</p>
            </div>
          </div>
        </div>

        {/* 2. σ VA π BOG'LAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Komplekslarda σ va π bog'lanish</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-blue-400 font-bold text-xl mb-3">σ-bog'lanish</h3>
              <p className="text-purple-200 text-sm mb-3">
                Orbitallar <strong>to'g'ridan-to'g'ri</strong> (bosh bilan) qoplashadi.
                Barcha koordinatsion bog'lar σ-bog'lanishdan iborat.
              </p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Ligand → Metall elektron jufti beradi</li>
                <li>• Bog'lovchi σ-MO — energiyasi past</li>
                <li>• Bo'shashtiruvchi σ*-MO — energiyasi yuqori</li>
                <li>• <strong>Asosiy bog'lanish turi</strong></li>
              </ul>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-xl mb-3">π-bog'lanish</h3>
              <p className="text-purple-200 text-sm mb-3">
                Orbitallar <strong>yonma-yon</strong> qoplashadi.
                Qo'shimcha bog'lanish — kompleks barqarorligini oshiradi.
              </p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Metall → Ligand (π-akseptor: CO, CN⁻)</li>
                <li>• Ligand → Metall (π-donor: F⁻, Cl⁻)</li>
                <li>• Sinergik bog'lanish — σ + π birgalikda</li>
                <li>• <strong>Kuchli maydonli ligandlar sababi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. MO DIAGRAMMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Oktaedrik kompleks uchun MO diagrammasi (soddalashtirilgan)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Oktaedrik kompleksda <strong className="text-yellow-400">6 ta ligand σ-orbitallari</strong> metallning 
            <strong className="text-yellow-400">s, p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>, d<sub>z²</sub>, d<sub>x²−y²</sub></strong> orbitallari bilan 
            birikib, 6 ta bog'lovchi va 6 ta bo'shashtiruvchi MO hosil qiladi.
            Metallning <strong>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub></strong> orbitallari bog'lamaydigan MO bo'lib qoladi (t₂g).
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                <span className="text-green-400 font-bold">Bog'lovchi MO (6 ta)</span>
                <span className="text-purple-200">Ligand elektronlari (12 ta e⁻) shu yerga joylashadi</span>
              </div>
              <div className="flex justify-between bg-gray-600/10 border border-gray-500/30 rounded-lg p-3">
                <span className="text-gray-400 font-bold">Bog'lamaydigan MO (t₂g — 3 ta)</span>
                <span className="text-purple-200">Metall d-elektronlari shu yerga joylashadi</span>
              </div>
              <div className="flex justify-between bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                <span className="text-red-400 font-bold">Bo'shashtiruvchi MO (eg* — 2 ta)</span>
                <span className="text-purple-200">Odatda bo'sh. Yuqori energiyali</span>
              </div>
              <div className="flex justify-between bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                <span className="text-red-400 font-bold">Bo'shashtiruvchi MO (6 ta)</span>
                <span className="text-purple-200">Yuqori energiyali — bo'sh</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. VB vs MO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ VB va MO nazariyalarini taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th><th className="py-3 px-4 text-purple-300 text-green-400">VB nazariyasi</th><th className="py-3 px-4 text-purple-300 text-yellow-400">MO nazariyasi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Yondashuv", "Lokalizatsiyalangan bog'lar", "Delokalizatsiyalangan MO lar"],
                  ["Geometriya", "Gibridlanish orqali", "Simmetriya orqali"],
                  ["Energiya", "Sifat jihatdan", "Miqdoriy hisoblash mumkin"],
                  ["Spektrlar", "Tushuntirmaydi", "Tushuntiradi (UB-Vis)"],
                  ["Magnit", "Tushuntirmaydi", "Tushuntiradi"],
                  ["Murakkabligi", "Oddiy", "Murakkab"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold">{r[0]}</td><td className="py-3 px-4 text-sm">{r[1]}</td><td className="py-3 px-4 text-sm">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>MO nazariyasi — <strong className="text-yellow-400">butun molekulani yaxlit</strong> ko'rib chiqadi</li>
            <li>σ-bog' — asosiy, π-bog' — qo'shimcha (sinergik bog'lanish)</li>
            <li>Oktaedrik kompleksda <strong>t₂g — bog'lamaydigan MO</strong>, eg* — bo'shashtiruvchi MO</li>
            <li>MO nazariyasi <strong>spektr va magnit xossalarini</strong> tushuntiradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/vb-nazariyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← VB nazariyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">σ-donor va π-akseptor →</Link>
        </div>

      </section>
    </main>
  )
}