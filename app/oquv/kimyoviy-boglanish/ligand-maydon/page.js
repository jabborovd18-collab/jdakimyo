import Link from "next/link"

export default function LigandMaydon() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🧩 Ligand maydon nazariyasi (LMN)</h1>
          <p className="text-purple-400 text-sm">MO nazariyasi • σ-donor va π-akseptor • Metall-ligand bog'lanishi • KMN dan LMN ga</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ligand maydon nazariyasi haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ligand maydon nazariyasi (LMN)</strong> — 
              kristall maydon nazariyasi va molekulyar orbitallar nazariyasining 
              <strong className="text-yellow-400"> birlashmasi</strong>. 
              KMN dan farqli ravishda, LMN <strong>kovalent bog'lanishni</strong> ham hisobga oladi:
              metall va ligand orbitallari o'zaro ta'sirlashib, 
              <strong className="text-yellow-400"> molekulyar orbitallar (MO)</strong> hosil qiladi.
              LMN komplekslarning <strong>barcha xossalarini</strong> — rang, magnit, spektroskopik, 
              termodinamik — to'liq tushuntirib beradigan eng zamonaviy nazariyadir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">KMN</h3>
              <p className="text-purple-200 text-sm">Sof ion model<br/>Ligandlar = nuqtaviy zaryad</p>
              <p className="text-red-400 text-xs mt-2">Kamchilik: kovalentlik yo'q</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">MO nazariyasi</h3>
              <p className="text-purple-200 text-sm">Sof kovalent model<br/>Orbitallar qoplashadi</p>
              <p className="text-red-400 text-xs mt-2">Kamchilik: murakkab hisoblash</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">LMN</h3>
              <p className="text-purple-200 text-sm">Aralash model<br/>Ion + kovalent hissalar</p>
              <p className="text-green-400 text-xs mt-2">Afzallik: to'liq tavsif</p>
            </div>
          </div>
        </div>

        {/* ── 2. MO HOSIL BO'LISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Molekulyar orbitallarning hosil bo'lishi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            LMN da metallning <strong className="text-yellow-400">9 ta valent orbitali</strong> 
            (5 ta d + 1 ta s + 3 ta p) ligandlarning <strong>guruh orbitallari (SALC)</strong> bilan 
            o'zaro ta'sirlashib, <strong>bog'lovchi, bog'lanmagan va antibog'lovchi</strong> MO larni hosil qiladi.
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Metall orbitallari + Ligand SALC lar → Molekulyar orbitallar
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Faqat <strong>simmetriyasi bir xil</strong> bo'lgan orbitallar o'zaro ta'sirlashadi!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Bog'lovchi MO</h3>
              <p className="text-purple-200 text-sm">
                Metall va ligand orbitallari <strong>bir xil ishorada</strong> qoplashadi.<br/>
                Energiyasi <strong>past</strong> — elektronlar shu yerda joylashadi.<br/>
                Bog' mustahkamligini ta'minlaydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Antibog'lovchi MO</h3>
              <p className="text-purple-200 text-sm">
                Metall va ligand orbitallari <strong>qarama-qarshi ishorada</strong> qoplashadi.<br/>
                Energiyasi <strong>yuqori</strong> — odatda bo'sh.<br/>
                Bog'ni zaiflashtiradi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. σ-DONOR VA π-AKSEPTOR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ σ-Donor va π-akseptor ligandlar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            LMN ligandlarni <strong className="text-yellow-400">ikki turga</strong> ajratadi.
            Bu ajralish spektrokimyoviy qatorni va Δ<sub>o</sub> qiymatini tushuntirib beradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">σ-Donor ligandlar</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Mexanizm:</strong> Ligand → Metall (σ-bog')<br/>
                Faqat <strong>elektron beradi</strong>.<br/>
                <strong>Misollar:</strong> NH₃, H₂O, Cl⁻, F⁻<br/>
                <strong>Δ<sub>o</sub>:</strong> kichik yoki o'rtacha
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 text-sm">
                <p className="text-yellow-400 font-bold">σ-Donor qatori:</p>
                <p className="text-purple-300">I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃</p>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-3">π-Akseptor ligandlar</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Mexanizm:</strong> Metall → Ligand (π-qaytish)<br/>
                σ-donor + <strong>π-akseptor</strong> — elektron qaytarib oladi.<br/>
                <strong>Misollar:</strong> CN⁻, CO, PR₃, C₂H₄<br/>
                <strong>Δ<sub>o</sub>:</strong> katta (sinergik bog'lanish)
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 text-sm">
                <p className="text-yellow-400 font-bold">π-Akseptor qatori:</p>
                <p className="text-purple-300">CN⁻ &lt; CO (eng kuchli π-akseptor)</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Sinergik bog'lanish:</strong> σ-donorlik metallga elektron beradi, 
              π-akseptorlik metallning ortiqcha elektron zichligini qaytarib oladi. 
              Bu ikki effekt bir-birini kuchaytiradi — <strong>Δ<sub>o</sub> maksimal bo'ladi!</strong>
            </p>
          </div>
        </div>

        {/* ── 4. π-DONOR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 π-Donor ligandlar — Δ<sub>o</sub> ni kamaytiradi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Ayrim ligandlar <strong className="text-yellow-400">π-donor</strong> xususiyatga ega — 
            ularning to'lgan π-orbitallari metallning t₂g orbitallari bilan ta'sirlashib, 
            <strong>Δ<sub>o</sub> ni kamaytiradi</strong>.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand turi</th>
                <th className="py-3 px-4 text-purple-300">σ-Donor</th>
                <th className="py-3 px-4 text-purple-300">π-Donor</th>
                <th className="py-3 px-4 text-purple-300">π-Akseptor</th>
                <th className="py-3 px-4 text-purple-300">Δ<sub>o</sub> ga ta'siri</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["σ-Donor (faqat)", "✓", "✗", "✗", "O'rtacha", "NH₃"],
                  ["π-Donor", "✓", "✓", "✗", "Kamaytiradi", "Cl⁻, F⁻, H₂O"],
                  ["π-Akseptor", "✓", "✗", "✓", "Oshiradi", "CN⁻, CO"],
                  ["π-Donor + π-Akseptor", "✓", "✓", "✓", "Murakkab", "NCS⁻ (ambidentat)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-center text-green-400">{r[1]}</td>
                    <td className="py-3 px-4 text-center">{r[2] === "✓" ? <span className="text-orange-400">✓</span> : <span className="text-red-400">✗</span>}</td>
                    <td className="py-3 px-4 text-center">{r[3] === "✓" ? <span className="text-blue-400">✓</span> : <span className="text-red-400">✗</span>}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. KMN vs LMN ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ KMN vs LMN — taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-purple-300">KMN</th>
                <th className="py-3 px-4 text-purple-300">LMN</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Bog' turi", "Sof ion", "Ion + kovalent"],
                  ["Ligandlar", "Nuqtaviy zaryadlar", "Orbitallar to'plami"],
                  ["d-orbital ajralishi", "Elektrostatik", "Orbital qoplashish"],
                  ["Spektrokimyoviy qator", "Tushuntirmaydi", "To'liq tushuntiradi (π-donor/akseptor)"],
                  ["Nefelauksetrik effekt", "Yo'q", "Tushuntiradi (B kamayishi)"],
                  ["Hisoblash murakkabligi", "Oddiy", "Murakkab (MO hisoblash)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400 text-sm">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">LMN = KMN + MO:</strong> ion va kovalent hissalarni birlashtiradi</li>
            <li><strong className="text-yellow-400">σ-Donor:</strong> ligand → metall; <strong>π-Akseptor:</strong> metall → ligand</li>
            <li><strong className="text-yellow-400">π-Akseptor ligandlar</strong> (CN⁻, CO) Δ<sub>o</sub> ni oshiradi — sinergik bog'lanish</li>
            <li><strong className="text-yellow-400">π-Donor ligandlar</strong> (Cl⁻, F⁻) Δ<sub>o</sub> ni kamaytiradi</li>
            <li><strong className="text-yellow-400">LMN</strong> — komplekslarning barcha xossalarini tushuntiruvchi eng to'liq nazariya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/kimyoviy-boglanish/yan-teller" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Yan-Teller effekti
          </Link>
          <Link href="/oquv/kimyoviy-boglanish" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            Kimyoviy bog'lanish →
          </Link>
        </div>

      </section>
    </main>
  )
}