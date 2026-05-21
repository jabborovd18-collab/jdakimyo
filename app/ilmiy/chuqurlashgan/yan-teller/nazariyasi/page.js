import Link from "next/link"

export default function YanTellerNazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/yan-teller" className="text-purple-400 hover:text-purple-300 text-lg">← Yan-Teller</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📐 Yan-Teller effekti nazariyasi</h1>
          <p className="text-purple-400 text-sm">Degenerat elektron holatlar • d⁴ va d⁹ • Oktaedrik buzilish mexanizmi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Yan-Teller effekti haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Yan-Teller effekti</strong> — 1937 yilda Hermann Artur Yan (H.A. Jahn) 
              va Edvard Teller (E. Teller) tomonidan kashf etilgan fundamental kvant-mexanik hodisa.
              <strong className="text-yellow-400">Yan-Teller teoremasi</strong>ga ko'ra: degenerat elektron konfiguratsiyaga ega 
              bo'lgan nochiziqli molekulalar o'z simmetriyasini o'zgartirib, energiya jihatdan qulayroq holatga o'tadi.
              Kompleks birikmalarda bu <strong className="text-yellow-400">oktaedrik geometriyaning tetragonal buzilishiga</strong> olib keladi.
            </p>
          </div>
        </div>

        {/* 2. TEOREMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Yan-Teller teoremasi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <p className="text-yellow-400 font-bold text-lg text-center">
              "Degenerat elektron holatga ega bo'lgan nochiziqli molekula barqaror bo'la olmaydi 
              va degeneratlikni yo'qotish uchun o'z geometriyasini o'zgartiradi."
            </p>
            <p className="text-purple-300 text-sm text-center mt-2">— Yan-Teller teoremasi, 1937</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Degeneratlik nima?</h3>
              <p className="text-purple-200 text-sm">
                <strong>Degenerat holat</strong> — bir xil energiyaga ega bo'lgan ikki yoki undan ortiq elektron konfiguratsiya.
                Masalan, oktaedrik maydonda d⁹ konfiguratsiyada bitta elektron eg orbitallarning qaysi birida (dz² yoki dx²−y²) 
                bo'lishidan qat'i nazar, energiya bir xil. Bu degeneratlikdir.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun buziladi?</h3>
              <p className="text-purple-200 text-sm">
                Degenerat holat <strong>energetik jihatdan noqulay</strong>. Molekula simmetriyasini o'zgartirib 
                (masalan, oktaedrni cho'zib yoki siqib), degeneratlikni yo'qotadi va 
                <strong>energiya bo'yicha qulayroq</strong> holatga o'tadi. Bu jarayon o'z-o'zidan sodir bo'ladi.
              </p>
            </div>
          </div>
        </div>

        {/* 3. QAYSI KONFIGURATSIYALARDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Qaysi konfiguratsiyalarda kuzatiladi?</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Yan-Teller effekti <strong className="text-yellow-400">eg orbitallarda elektronlar notekis taqsimlanganda</strong> kuzatiladi.
            Chunki eg orbitallar (dz² va dx²−y²) to'g'ridan-to'g'ri ligandlarga qaragan — ularning to'lishidagi farq 
            bevosita bog' uzunliklariga ta'sir qiladi. t₂g orbitallardagi degeneratlik esa kuchsiz Yan-Teller effektiga sabab bo'ladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">eg to'lishi</th>
                <th className="py-3 px-4 text-purple-300">Degeneratlik</th>
                <th className="py-3 px-4 text-purple-300">Yan-Teller</th>
                <th className="py-3 px-4 text-purple-300">Misollar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d⁴ (yuqori spin)", "eg¹", "Ha (dz² yoki dx²−y²)", "KUCHLI", "Cr²⁺, Mn³⁺"],
                  ["d⁵ (yuqori spin)", "eg²", "Yo'q (ikkalasi to'lgan)", "YO'Q", "Fe³⁺, Mn²⁺"],
                  ["d⁶ (yuqori spin)", "eg²", "Yo'q", "YO'Q", "Fe²⁺, Co³⁺ (H₂O)"],
                  ["d⁶ (quyi spin)", "eg⁰", "Yo'q", "YO'Q", "Fe²⁺ (CN⁻)"],
                  ["d⁷ (yuqori spin)", "eg²", "Yo'q", "YO'Q", "Co²⁺ (H₂O)"],
                  ["d⁷ (quyi spin)", "eg¹", "Ha", "KUCHLI", "Co²⁺ (CN⁻)"],
                  ["d⁸", "eg²", "Yo'q", "YO'Q", "Ni²⁺"],
                  ["d⁹", "eg³", "Ha (dz² yoki dx²−y²)", "KUCHLI", "Cu²⁺, Ag²⁺"],
                  ["d¹⁰", "eg⁴", "Yo'q", "YO'Q", "Zn²⁺"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold">{r[3].includes("KUCHLI") ? <span className="text-orange-400">{r[3]}</span> : <span className="text-green-400">{r[3]}</span>}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Xulosa:</strong> Yan-Teller effekti <strong>d⁴ (yuqori spin), d⁷ (quyi spin) va d⁹</strong> 
              konfiguratsiyalarda kuchli namoyon bo'ladi. Sababi — eg orbitallarda 1 yoki 3 ta elektron bo'lib, 
              degeneratlik mavjud. d⁹ (Cu²⁺) eng ko'p o'rganilgan va eng yorqin misoldir.
            </p>
          </div>
        </div>

        {/* 4. ENERGIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Buzilish energetikasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Oktaedr cho'zilganda yoki siqilganda <strong>energiya pasayadi</strong>. Bu energiya pasayishi 
            <strong className="text-yellow-400">Yan-Teller barqarorlashish energiyasi</strong> deb ataladi.
            Odatda bu qiymat <strong>5-20 kJ/mol</strong> atrofida bo'ladi — katta emas, lekin geometriyani sezilarli o'zgartiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-gray-400 font-bold mb-2">Oddiy oktaedr</h3>
              <p className="text-purple-200 text-sm">Barcha 6 ta bog' teng</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">Energiya: E₀</p>
              <p className="text-purple-400 text-xs">Degenerat — beqaror</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Cho'zilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">2 ta aksial bog' uzun</p>
              <p className="text-green-400 font-bold text-lg mt-2">Energiya: E₀ − δ</p>
              <p className="text-purple-400 text-xs">Barqaror — ko'p uchraydi</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Siqilgan oktaedr</h3>
              <p className="text-purple-200 text-sm">2 ta aksial bog' qisqa</p>
              <p className="text-green-400 font-bold text-lg mt-2">Energiya: E₀ − δ'</p>
              <p className="text-purple-400 text-xs">Kam uchraydi</p>
            </div>
          </div>
        </div>

        {/* 5. QANDAY KUZATILADI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Qanday aniqlanadi?</h2>
          
          <div className="space-y-4">
            {[
              { metod: "Rentgen difraksiyasi", desc: "Bog' uzunliklarining farqini bevosita ko'rsatadi. Cu-O(ekv) ≈ 1.97 Å, Cu-O(aks) ≈ 2.28 Å." },
              { metod: "UB-Vis spektroskopiya", desc: "d-d o'tish polosalarining ajralishi. Oddiy oktaedrda bitta, cho'zilganda 2-3 ta polosa kuzatiladi." },
              { metod: "EPR spektroskopiya", desc: "Cu²⁺ komplekslarida aksial simmetriyani ko'rsatadi. g-faktor anizotropiyasi (g∥ ≠ g⊥)." },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.metod}</h3>
                <p className="text-purple-200 text-sm">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. STATIK VS DINAMIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Statik va dinamik Yan-Teller effekti</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Statik Yan-Teller</h3>
              <p className="text-purple-200 text-sm">
                Past haroratda kuzatiladi. Buzilish <strong>doimiy</strong> — cho'zilgan yoki siqilgan oktaedr barqaror.
                Rentgen difraksiyasida aniq ko'rinadi. Cu²⁺ komplekslarining aksariyati statik Yan-Tellerga ega.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Dinamik Yan-Teller</h3>
              <p className="text-purple-200 text-sm">
                Yuqori haroratda kuzatiladi. Buzilish <strong>vaqt bo'yicha o'zgarib turadi</strong> — 
                cho'zilish o'qi tebranadi. Rentgen difraksiyasida oktaedr simmetrik ko'rinadi, 
                lekin spektroskopiya buzilish mavjudligini ko'rsatadi.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Yan-Teller teoremasi: <strong className="text-yellow-400">degenerat elektron holatli molekulalar simmetriyani buzadi</strong></li>
            <li>Kuchli effekt: <strong>d⁴ (YS), d⁷ (QS), d⁹</strong> — eg orbitallarda degeneratlik</li>
            <li>Cho'zilgan oktaedr <strong>ko'proq uchraydi</strong> (Cu²⁺ misoli)</li>
            <li>Energiya pasayishi <strong>5-20 kJ/mol</strong> — kichik, lekin sezilarli</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/yan-teller" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Yan-Teller</Link>
          <Link href="/ilmiy/chuqurlashgan/yan-teller/cu-komplekslari" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Cu²⁺ komplekslari →</Link>
        </div>

      </section>
    </main>
  )
}