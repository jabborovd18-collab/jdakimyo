import Link from "next/link"

export const metadata = {
  title: "Stereoizomeriya: geometrik va optik",
  description:
    "Formulasi bir xil, fazoviy tuzilishi har xil izomerlar: sis-trans va fas-mer joylashuvi, xirallik, Δ/Λ enantiomerlar va optik faollik.",
}

export default function StereoIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* HEADER */}
      <header className="border-b border-blue-800/50 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-blue-400 flex-wrap">
            <Link href="/" className="hover:text-blue-300">🏠 Bosh sahifa</Link>
            <span className="text-blue-600">›</span>
            <Link href="/oquv" className="hover:text-blue-300">O'quv</Link>
            <span className="text-blue-600">›</span>
            <Link href="/oquv/izomeriyasi" className="hover:text-blue-300">Izomeriyasi</Link>
            <span className="text-blue-600">›</span>
            <span className="text-sky-400 font-semibold">🔄 Stereoizomeriya</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">🔄</span>
                Stereoizomeriya
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Formula bir xil, fazoviy tuzilish har xil • Geometrik va Optik izomeriya
              </p>
            </div>
            <Link href="/oquv/izomeriyasi" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Izomeriyasi bo'limi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-600/20 border border-sky-600/30 rounded-full text-xs font-semibold text-sky-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              FAZOVIY IZOMERIYA • 2 TA ASOSIY TUR
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Stereoizomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">atomlar bog'lanishi bir xil, joylashuvi har xil</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Stereoizomerlarda atomlarning <strong className="text-sky-300">bog'lanish tartibi bir xil</strong>,
              lekin ularning <strong className="text-sky-300">fazodagi joylashuvi</strong> farq qiladi.
              Bu izomeriya turi moddaning fizik, kimyoviy va biologik xossalariga keskin ta'sir ko'rsatadi
              (masalan, dori vositalarining faolligi yoki komplekslarning rangi).
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📐</div>
                <div className="text-2xl font-extrabold text-sky-300">Geometrik</div>
                <div className="text-xs text-sky-300 mt-1">cis/trans, fac/mer</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔮</div>
                <div className="text-2xl font-extrabold text-sky-300">Optik</div>
                <div className="text-xs text-sky-300 mt-1">Enantiomerlar</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💊</div>
                <div className="text-2xl font-extrabold text-sky-300">Sisplatin</div>
                <div className="text-xs text-sky-300 mt-1">Eng mashhur misol</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-2xl font-extrabold text-sky-300">Xirallik</div>
                <div className="text-xs text-sky-300 mt-1">Ko'zgudagi aks</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY FARQ */}
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⚖️</span>
            Tuzilish vs <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Stereoizomeriya</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-3">🧬 Tuzilish izomeriyasi</h3>
              <p className="text-blue-100 text-sm mb-4">
                Atomlar <strong>turli tartibda</strong> bog'langan. Formulalar har xil yoziladi.
              </p>
              <ul className="space-y-2 text-blue-200 text-xs">
                <li className="flex gap-2"><span className="text-purple-400">✓</span> Bog'lanish tartibi o'zgaradi</li>
                <li className="flex gap-2"><span className="text-purple-400">✓</span> Kimyoviy formula farq qiladi</li>
                <li className="flex gap-2"><span className="text-purple-400">✓</span> Misol: [CoBr(NH₃)₅]SO₄ vs [Co(NH₃)₅SO₄]Br</li>
              </ul>
            </div>
            <div className="bg-slate-950/60 border border-sky-700/30 rounded-2xl p-6 ring-1 ring-sky-500/30">
              <h3 className="text-xl font-bold text-sky-400 mb-3">🔄 Stereoizomeriya</h3>
              <p className="text-blue-100 text-sm mb-4">
                Bog'lanish tartibi <strong>bir xil</strong>, faqat fazoviy joylashuv farq qiladi.
              </p>
              <ul className="space-y-2 text-blue-200 text-xs">
                <li className="flex gap-2"><span className="text-sky-400">✓</span> Bog'lanish tartibi o'zgarmaydi</li>
                <li className="flex gap-2"><span className="text-sky-400">✓</span> Formula bir xil, strukturaviy chizma boshqa</li>
                <li className="flex gap-2"><span className="text-sky-400">✓</span> Misol: cis-[PtCl₂(NH₃)₂] vs trans-[PtCl₂(NH₃)₂]</li>
              </ul>
            </div>
          </div>
        </div>

        {/* IKKITA KATTA YO'NALISH */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* GEOMETRIK IZOMERIYA */}
          <div className="group relative bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8 hover:border-emerald-500/60 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-all" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform origin-left">📐</div>
              <h3 className="text-3xl font-bold text-emerald-300 mb-3">Geometrik izomeriya</h3>
              <p className="text-emerald-100 mb-6 leading-relaxed">
                Ligandlarning markaziy atomga nisbatan <strong>har xil tomonda</strong> joylashishi.
                Asosan kvadrat-planar va oktaedrik komplekslarda uchraydi.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="bg-emerald-950/50 rounded-lg p-3 border border-emerald-700/30">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-300">cis- / trans-</span>
                    <span className="text-xs text-emerald-400">Kvadrat & Oktaedr</span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-1">Bir xil ligandlar yonma-yon (cis) yoki qarama-qarshi (trans)</p>
                </div>
                <div className="bg-emerald-950/50 rounded-lg p-3 border border-emerald-700/30">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-300">fac- / mer-</span>
                    <span className="text-xs text-emerald-400">Faqat Oktaedr (MA₃B₃)</span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-1">Uchta ligand bir yoqda (facial) yoki meridian bo'ylab (meridional)</p>
                </div>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
                <p className="text-yellow-200 text-sm">
                  <strong className="text-yellow-400">💊 Sisplatin:</strong> cis-[PtCl₂(NH₃)₂] — saraton dorisi. 
                  Uning trans-izomeri esa shifobaxsh emas! Bu geometrik izomeriyaning eng hayotiy ahamiyati.
                </p>
              </div>

              <Link 
                href="/oquv/izomeriyasi/stereo/geometrik"
                className="block w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform group-hover:translate-y-[-2px] shadow-lg shadow-emerald-900/50"
              >
                Geometrik izomeriyani o'rganish →
              </Link>
            </div>
          </div>

          {/* OPTIK IZOMERIYA */}
          <div className="group relative bg-gradient-to-br from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-3xl p-8 hover:border-violet-500/60 transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-violet-500/10 transition-all" />
            
            <div className="relative z-10">
              <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform origin-left">🔮</div>
              <h3 className="text-3xl font-bold text-violet-300 mb-3">Optik izomeriya</h3>
              <p className="text-violet-100 mb-6 leading-relaxed">
                Molekulaning <strong>xiralligi</strong> (qo'lqopiligi) bilan bog'liq. 
                Enantiomerlar bir-birining ko'zgudagi aksi bo'lib, ustma-ust tushmaydi.
              </p>
              
              <div className="space-y-3 mb-8">
                <div className="bg-violet-950/50 rounded-lg p-3 border border-violet-700/30">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-violet-300">Δ (Delta) / Λ (Lambda)</span>
                    <span className="text-xs text-violet-400">Propeller shakli</span>
                  </div>
                  <p className="text-xs text-violet-200 mt-1">Xelat halqalarining o'ng yoki chap burama shakli</p>
                </div>
                <div className="bg-violet-950/50 rounded-lg p-3 border border-violet-700/30">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-violet-300">Polyarimetr</span>
                    <span className="text-xs text-violet-400">Aniqlash usuli</span>
                  </div>
                  <p className="text-xs text-violet-200 mt-1">Qutblangan nurni o'ng (+) yoki chap (-) ga burishi</p>
                </div>
              </div>

              <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-4 mb-6">
                <p className="text-cyan-200 text-sm">
                  <strong className="text-cyan-400">🧬 Biologik ahamiyat:</strong> Tirik organizmlar faqat bitta enantiomerni tanlaydi. 
                  Masalan, oqsillar faqat L-aminokislotalardan tuzilgan.
                </p>
              </div>

              <Link 
                href="/oquv/izomeriyasi/stereo/optik"
                className="block w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl text-center transition-all transform group-hover:translate-y-[-2px] shadow-lg shadow-violet-900/50"
              >
                Optik izomeriyani o'rganish →
              </Link>
            </div>
          </div>
        </div>

        {/* QISQA TAQQOSLASH */}
        <div className="bg-slate-950/60 border border-blue-700/30 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Tezkor taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-blue-700">
                  <th className="py-3 px-4 text-blue-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-emerald-400 text-sm">Geometrik</th>
                  <th className="py-3 px-4 text-violet-400 text-sm">Optik</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Asosiy sabab</td>
                  <td className="py-3 px-4">Ligandlarning nisbiy joylashuvi</td>
                  <td className="py-3 px-4">Molekulaning xiralligi (simmetriya yo'qligi)</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Nomlash</td>
                  <td className="py-3 px-4">cis/trans, fac/mer, E/Z</td>
                  <td className="py-3 px-4">Δ/Λ, R/S, (+)/(-)</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold">Fizik xossalar</td>
                  <td className="py-3 px-4">Har xil (qaynash temp, eruvchanlik)</td>
                  <td className="py-3 px-4">Bir xil (faqat optik burilish farqli)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Ajratish usuli</td>
                  <td className="py-3 px-4">Distillyatsiya, kristallizatsiya</td>
                  <td className="py-3 px-4">Xiral rezolyutsiya, fermentativ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MANBA */}
        <div className="text-center py-6">
          <p className="text-blue-400/60 text-xs italic">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.4-bo'lim)
          </p>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6 border-t border-blue-800/30">
          <Link href="/oquv/izomeriyasi/tuzilish/formal" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center transition-colors">
            ← Formal izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/stereo/geometrik" className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-center shadow-lg shadow-emerald-900/30 transition-all">
            Geometrik izomeriyaga o'tish →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Stereoizomeriya • Geometrik & Optik • Sisplatin • Werner (Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}