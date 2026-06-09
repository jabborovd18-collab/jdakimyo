import Link from "next/link"

export default function YanTeller() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">⚡ Yan-Teller effekti</h1>
          <p className="text-purple-400 text-sm">Oktaedrik buzilish • d⁴ va d⁹ konfiguratsiyalar • Statik va dinamik • Cu²⁺ misoli</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Yan-Teller effekti haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Yan-Teller effekti</strong> — 1937 yilda 
              <strong> Hermann Artur Yan</strong> va <strong>Edvard Teller</strong> tomonidan kashf etilgan 
              fundamental kvant-mexanik hodisa. <strong className="text-yellow-400">Yan-Teller teoremasi</strong>ga ko'ra:
              <em> "degenerat elektron konfiguratsiyaga ega bo'lgan nochiziqli molekula barqaror bo'la olmaydi 
              va degeneratlikni yo'qotish uchun o'z geometriyasini o'zgartiradi."</em>
              Kompleks birikmalarda bu <strong className="text-yellow-400">oktaedrik geometriyaning tetragonal buzilishiga</strong> 
              olib keladi — oktaedr cho'ziladi yoki siqiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qachon kuzatiladi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>eg orbitallarda</strong> elektronlar notekis taqsimlanganda</li>
                <li>• <strong>d⁴ (YS):</strong> t₂g³ eg¹ — kuchli</li>
                <li>• <strong>d⁷ (QS):</strong> t₂g⁶ eg¹ — kuchli</li>
                <li>• <strong>d⁹:</strong> t₂g⁶ eg³ — kuchli (eng mashhur!)</li>
                <li>• t₂g orbitallarda — kuchsiz effekt</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun buziladi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Degenerat holat <strong>energetik noqulay</strong></li>
                <li>• Simmetriya pasayishi → degeneratlik yo'qoladi</li>
                <li>• <strong>Energiya pasayadi</strong> — barqarorlashish</li>
                <li>• O'z-o'zidan sodir bo'ladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── 2. TEOREMA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Yan-Teller teoremasi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              "Degenerat elektron holatga ega bo'lgan nochiziqli molekula barqaror bo'la olmaydi 
              va degeneratlikni yo'qotish uchun o'z geometriyasini o'zgartiradi."
            </p>
            <p className="text-purple-300 text-sm mt-2">— Yan-Teller teoremasi, 1937</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Degeneratlik nima?</h3>
              <p className="text-purple-200 text-sm">
                <strong>Degenerat holat</strong> — bir xil energiyaga ega bo'lgan ikki yoki undan ortiq 
                elektron konfiguratsiya. Masalan, d⁹ da 1 ta elektron eg orbitallarning qaysi birida 
                (dz² yoki dx²−y²) bo'lishidan qat'i nazar energiya bir xil.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Buzilish natijasi</h3>
              <p className="text-purple-200 text-sm">
                Molekula simmetriyani o'zgartirib (O<sub>h</sub> → D<sub>4h</sub>), 
                degeneratlikni yo'qotadi. Natijada <strong>cho'zilgan</strong> yoki 
                <strong> siqilgan</strong> oktaedr hosil bo'ladi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. QAYSI KONFIGURATSIYALAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Qaysi konfiguratsiyalarda kuzatiladi?</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">eg to'lishi</th>
                <th className="py-3 px-4 text-purple-300">Yan-Teller</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d⁴ (YS)", "t₂g³ eg¹", "eg¹ — degeneratlik bor", "KUCHLI", "Cr²⁺, Mn³⁺"],
                  ["d⁵ (YS)", "t₂g³ eg²", "eg² — degeneratlik yo'q", "YO'Q", "Fe³⁺, Mn²⁺"],
                  ["d⁶ (YS)", "t₂g⁴ eg²", "eg² — degeneratlik yo'q", "YO'Q", "Fe²⁺ (H₂O)"],
                  ["d⁶ (QS)", "t₂g⁶ eg⁰", "eg⁰ — degeneratlik yo'q", "YO'Q", "Co³⁺ (QS)"],
                  ["d⁷ (YS)", "t₂g⁵ eg²", "eg² — degeneratlik yo'q", "YO'Q", "Co²⁺ (H₂O)"],
                  ["d⁷ (QS)", "t₂g⁶ eg¹", "eg¹ — degeneratlik bor", "KUCHLI", "Co²⁺ (CN⁻)"],
                  ["d⁸", "t₂g⁶ eg²", "eg² — degeneratlik yo'q", "YO'Q", "Ni²⁺"],
                  ["d⁹", "t₂g⁶ eg³", "eg³ — degeneratlik bor!", "KUCHLI", "Cu²⁺ — eng mashhur!"],
                  ["d¹⁰", "t₂g⁶ eg⁴", "eg⁴ — degeneratlik yo'q", "YO'Q", "Zn²⁺"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold">
                      {r[3].includes("KUCHLI") ? <span className="text-orange-400">{r[3]}</span> : <span className="text-green-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Xulosa:</strong> Yan-Teller effekti <strong>eg orbitallarda 1 yoki 3 ta elektron</strong> 
              bo'lganda kuchli namoyon bo'ladi. eg⁰, eg² va eg⁴ — degeneratlik yo'q, effekt kuzatilmaydi.
            </p>
          </div>
        </div>

        {/* ── 4. Cu²⁺ MISOLI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Cu²⁺ — eng yorqin misol</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">[Cu(H₂O)₆]²⁺</strong> — Yan-Teller effektining eng klassik namunasi.
            d⁹ konfiguratsiya: t₂g⁶ eg³. eg³ — dx²−y² da 2e⁻, dz² da 1e⁻. Degeneratlik mavjud!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-gray-400 font-bold mb-2">Oddiy oktaedr</h3>
              <p className="text-purple-200 text-sm">6 ta Cu−O teng (nazariy)</p>
              <p className="text-red-400 font-bold text-lg mt-2">Beqaror!</p>
              <p className="text-purple-400 text-xs">Degenerat holat</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 text-center">
              <h3 className="text-red-400 font-bold mb-2">Cho'zilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">4 ta qisqa + 2 ta uzun bog'</p>
              <p className="text-green-400 font-bold text-lg mt-2">Barqaror!</p>
              <p className="text-purple-400 text-xs">Ko'p uchraydi</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 text-center">
              <h3 className="text-blue-400 font-bold mb-2">Siqilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">2 ta qisqa + 4 ta uzun bog'</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">Mumkin</p>
              <p className="text-purple-400 text-xs">Kam uchraydi</p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <p className="text-purple-200 text-sm">
              <strong>[Cu(H₂O)₆]²⁺ uchun bog' uzunliklari:</strong><br/>
              • <strong>Ekvatorial Cu−O:</strong> 1.97 Å (4 ta qisqa bog')<br/>
              • <strong>Aksial Cu−O:</strong> 2.28 Å (2 ta uzun bog')<br/>
              • <strong>Farq:</strong> 0.31 Å (~16%)<br/>
              • <strong>Simmetriya:</strong> O<sub>h</sub> → D<sub>4h</sub>
            </p>
          </div>
        </div>

        {/* ── 5. STATIK vs DINAMIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Statik va dinamik Yan-Teller effekti</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Statik Yan-Teller</h3>
              <p className="text-purple-200 text-sm">
                <strong>Past haroratda</strong> (&lt; 100 K) kuzatiladi.<br/>
                Buzilish <strong>bir o'qda doimiy</strong>.<br/>
                Rentgen difraksiyasida aniq ko'rinadi.<br/>
                Cu²⁺ komplekslarining aksariyati xona T da statik.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Dinamik Yan-Teller</h3>
              <p className="text-purple-200 text-sm">
                <strong>Yuqori haroratda</strong> (&gt; 200 K) kuzatiladi.<br/>
                Buzilish o'qi <strong>3 ta yo'nalish orasida tebranadi</strong>.<br/>
                Rentgenda oktaedr simmetrik ko'rinadi.<br/>
                Spektroskopiya buzilishni ko'rsatadi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 6. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Yan-Teller effektining amaliy ahamiyati</h2>
          
          <div className="space-y-3">
            {[
              "Rangni tushuntirish: Cu²⁺ komplekslarining ko'k rangi Yan-Teller buzilishi tufayli",
              "Kataliz: Yan-Teller faol markazlar fermentlarda (Cu²⁺ oksidazalarda) substrat bog'lanishini yengillashtiradi",
              "Materialshunoslik: Mn³⁺ perovskitlarda kolossal magnit qarshilik (CMR) effekti",
              "Kristallografiya: Yan-Teller tartiblanishi kristall strukturasini belgilaydi"
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i+1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Yan-Teller teoremasi:</strong> degenerat elektron holatli molekulalar simmetriyani buzadi</li>
            <li><strong className="text-yellow-400">Kuchli effekt:</strong> d⁴(YS), d⁷(QS), d⁹ — eg orbitallarda 1 yoki 3 ta elektron</li>
            <li><strong className="text-yellow-400">Cu²⁺ (d⁹):</strong> eng klassik misol — [Cu(H₂O)₆]²⁺ cho'zilgan oktaedr</li>
            <li><strong className="text-yellow-400">Statik:</strong> past T, doimiy buzilish; <strong>Dinamik:</strong> yuqori T, tebranuvchi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/kimyoviy-boglanish/kristall-maydon" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Kristall maydon nazariyasi
          </Link>
          <Link href="/oquv/kimyoviy-boglanish/ligand-maydon" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Ligand maydon nazariyasi →
          </Link>
        </div>

      </section>
    </main>
  )
}