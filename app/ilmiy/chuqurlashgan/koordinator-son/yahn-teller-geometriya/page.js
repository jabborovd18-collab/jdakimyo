import Link from "next/link"

export default function YahnTellerGeometriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">⚡ Yahn-Teller geometrik buzilishi</h1>
          <p className="text-purple-400 text-sm">d⁴ va d⁹ konfiguratsiyalar • Oktaedrik cho'zilish/siqilish • Cu²⁺ komplekslari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Yahn-Teller effekti haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Yahn-Teller teoremasi (1937)</strong> — Hermann Yahn va Edward Teller 
              tomonidan isbotlangan: <strong className="text-red-400">degenerat elektron holatga ega har qanday 
              nochiziqli molekula geometrik buzilishga uchraydi</strong>. Kompleks birikmalarda bu 
              <strong className="text-red-400">d⁴ (yuqori spinli) va d⁹ konfiguratsiyalarda</strong> oktaedrik 
              geometriyaning cho'zilishi yoki siqilishi ko'rinishida namoyon bo'ladi. 
              Eng klassik misol — <strong>Cu²⁺ (d⁹) komplekslari</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Qachon Yahn-Teller faol?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>d⁴ (HS):</strong> t₂g³ eg¹ — eg da degeneratsiya (Cr²⁺, Mn³⁺)</li>
                <li>• <strong>d⁷ (LS):</strong> t₂g⁶ eg¹ — eg da degeneratsiya (Co²⁺ LS, Ni³⁺ LS)</li>
                <li>• <strong>d⁹:</strong> t₂g⁶ eg³ — eg da degeneratsiya (Cu²⁺, Ag²⁺)</li>
                <li>• <strong>Asosiy sabab:</strong> eg orbitallarda (dz², dx²−y²) notekis elektron taqsimoti</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Qachon Yahn-Teller nofaol?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>d³:</strong> t₂g³ — t₂g degeneratsiyasi kuchsiz buzilish beradi (Cr³⁺ — ideal Oh)</li>
                <li>• <strong>d⁵ (HS):</strong> t₂g³ eg² — eg da degeneratsiya yo'q (Fe³⁺, Mn²⁺)</li>
                <li>• <strong>d⁶ (LS):</strong> t₂g⁶ — barcha orbitallar juftlashgan (Co³⁺ LS, Fe²⁺ LS)</li>
                <li>• <strong>d⁸:</strong> t₂g⁶ eg² — eg da degeneratsiya yo'q (Ni²⁺)</li>
                <li>• <strong>d¹⁰:</strong> barcha orbitallar to'lgan — KMN=0 (Zn²⁺, Cd²⁺)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. CHO'ZILISH vs SIQILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Cho'zilish vs Siqilish — ikki xil buzilish</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Tetragonal cho'zilish (z o'qi bo'yicha) — KO'P UCHRAYDI</h3>
              <p className="text-purple-200 text-sm mb-2">
                dx²−y² orbitalda bitta bo'sh o'rin (d⁹) yoki bitta elektron (d⁴ HS) — 
                ekvatorial ligandlar bilan kuchliroq bog'lanish → 4 ta qisqa bog' (ekvatorial), 
                2 ta uzun bog' (aksial).
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
                <p className="text-yellow-400 text-xs font-semibold mb-1">Klassik misol:</p>
                <p className="text-purple-200 text-xs">[Cu(H₂O)₆]²⁺: Cu−O(ekv) = 1.97 Å (4 ta), Cu−O(aks) = 2.28 Å (2 ta)</p>
                <p className="text-purple-300 text-xs mt-1">Δ(Cu−O) = 0.31 Å — Yahn-Teller cho'zilishi</p>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Tetragonal siqilish (z o'qi bo'yicha) — KAM UCHRAYDI</h3>
              <p className="text-purple-200 text-sm mb-2">
                dz² orbitalda bitta bo'sh o'rin — aksial ligandlar bilan kuchliroq bog'lanish → 
                2 ta qisqa bog' (aksial), 4 ta uzun bog' (ekvatorial).
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
                <p className="text-yellow-400 text-xs font-semibold mb-1">Kam uchraydigan misol:</p>
                <p className="text-purple-200 text-xs">[Cu(NH₃)₄(H₂O)₂]²⁺: Cu−N(ekv) = 2.05 Å, Cu−O(aks) = 1.95 Å</p>
                <p className="text-purple-300 text-xs mt-1">Kuchli aksial ligandlar siqilishga olib keladi</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">Nima uchun cho'zilish siqilishdan ko'proq uchraydi?</h3>
            <p className="text-purple-200 text-sm">
              d⁹ konfiguratsiyada dx²−y² orbitalda bitta bo'sh o'rin mavjud. Bu ekvatorial tekislikda 
              (x,y yo'nalishida) ligandlar bilan bog'lanishni kuchaytiradi — ekvatorial bog'lar qisqaradi.
              dz² orbital to'liq to'lgan (2 ta elektron) — aksial bog'lar zaiflashadi va uzayadi.
              <strong>Siqilish</strong> faqat kuchli aksial donor ligandlar (masalan, NH₃, CN⁻) 
              mavjud bo'lganda kuzatiladi — ular dz² bilan kuchli bog'lanib, aksial bog'larni qisqartiradi.
            </p>
          </div>
        </div>

        {/* 3. Cu²⁺ MISOLIDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Cu²⁺ komplekslari — Yahn-Teller effektining klassik namunasi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">M−L(ekv) (Å)</th>
                <th className="py-3 px-4 text-purple-300">M−L(aks) (Å)</th>
                <th className="py-3 px-4 text-purple-300">Δ (Å)</th>
                <th className="py-3 px-4 text-purple-300">Rang</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Cu(H₂O)₆]²⁺", "Cho'zilgan oktaedr", "1.97", "2.28", "0.31", "Ko'k"],
                  ["[Cu(NH₃)₄(H₂O)₂]²⁺", "Siqilgan oktaedr", "2.05 (N)", "1.95 (O)", "−0.10", "To'q ko'k"],
                  ["[CuCl₆]⁴⁻", "Cho'zilgan oktaedr", "2.30", "2.95", "0.65", "Sariq-yashil"],
                  ["[Cu(acac)₂]", "Kvadrat planar", "1.91−1.95", "— (KCh=4)", "—", "Ko'k"],
                  ["K₂[CuF₄]", "Kvadrat planar", "1.89−1.93", "2.45 (kuchsiz)", "~0.55", "Ko'k"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-red-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. STATIK vs DINAMIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Statik vs Dinamik Yahn-Teller effekti</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Statik Yahn-Teller — Qattiq fazada</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Kristall panjara <strong>bir yo'nalishdagi buzilishni</strong> "muzlatadi"</li>
                <li>• Past haroratda kuzatiladi</li>
                <li>• Rentgen difraksiyasida aniq ko'rinadi</li>
                <li>• Masalan: [Cu(H₂O)₆]²⁺ — har doim cho'zilgan</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Dinamik Yahn-Teller — Eritmada</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Buzilish <strong>uchta o'q bo'yicha navbatma-navbat</strong> sodir bo'ladi</li>
                <li>• Yuqori haroratda yoki eritmada kuzatiladi</li>
                <li>• Vaqt bo'yicha o'rtacha — <strong>oktaedrik ko'rinadi</strong></li>
                <li>• EPR spektroskopiyasida kuzatiladi (g∥ ≠ g⊥)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Yahn-Teller effekti — <strong className="text-red-400">d⁴ (HS) va d⁹ konfiguratsiyalarda</strong> oktaedrik buzilish</li>
            <li>Cho'zilish (z o'qi bo'yicha) — <strong className="text-red-400">eng ko'p uchraydigan</strong> buzilish turi</li>
            <li>Cu²⁺ komplekslari — <strong className="text-red-400">Yahn-Teller effektining klassik namoyishi</strong></li>
            <li>Statik (qattiq faza) va dinamik (eritma) — <strong className="text-red-400">ikki xil rejim</strong></li>
            <li>Yahn-Teller buzilishi <strong className="text-red-400">rang, magnit xossalari va reaksion qobiliyatga</strong> ta'sir qiladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/berry-psevdorotatsiya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Berry psevdorotatsiyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Komplekslar izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}