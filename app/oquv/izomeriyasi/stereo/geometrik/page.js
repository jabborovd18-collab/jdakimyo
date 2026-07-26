import Link from "next/link"
export default function GeometrikIzomeriya() {
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
            <Link href="/oquv/izomeriyasi/stereo" className="hover:text-blue-300">Stereoizomeriya</Link>
            <span className="text-blue-600">›</span>
            <span className="text-emerald-400 font-semibold">📐 Geometrik izomeriya</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 flex items-center gap-2">
                <span className="text-3xl">📐</span>
                Geometrik izomeriya
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Cis-trans • Fac-mer • Kvadrat-planar va oktaedrik komplekslar
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/stereo/geometrik/3d" className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-emerald-600/30">
                🧊 3D modelni ochish
              </Link>
              <Link href="/oquv/izomeriyasi/stereo" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Stereoizomeriya
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border border-emerald-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600/20 border border-emerald-600/30 rounded-full text-xs font-semibold text-emerald-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              STEREOIZOMERIYA • ASOSIY TUR
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Geometrik izomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">ligandlarning fazoviy joylashuvi farqi</span>
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mb-8 leading-relaxed">
              Geometrik izomeriyada atomlarning bog‘lanish tartibi bir xil, lekin ularning
              <strong className="text-emerald-300"> markaziy atomga nisbatan fazoviy joylashuvi</strong> har xil.
              Bu hodisa asosan <strong className="text-emerald-300">kvadrat-planar</strong> va
              <strong className="text-emerald-300"> oktaedrik</strong> komplekslarda kuzatiladi.
              Tetraedrik komplekslarda geometrik izomeriya <strong className="text-red-400">bo‘lmaydi</strong>.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">◻️</div>
                <div className="text-2xl font-extrabold text-emerald-300">Cis/Trans</div>
                <div className="text-xs text-emerald-300 mt-1">MA₂B₂ tipi</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔷</div>
                <div className="text-2xl font-extrabold text-emerald-300">Fac/Mer</div>
                <div className="text-xs text-emerald-300 mt-1">MA₃B₃ tipi</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💊</div>
                <div className="text-2xl font-extrabold text-emerald-300">Sisplatin</div>
                <div className="text-xs text-emerald-300 mt-1">Eng muhim misol</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🚫</div>
                <div className="text-2xl font-extrabold text-red-400">Td</div>
                <div className="text-xs text-emerald-300 mt-1">Tetraedrda yo'q</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-cyan-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/stereo/geometrik/3d"
            className="relative block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-600/40 transform hover:scale-[1.02] transition-all group border border-emerald-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-90 transition-transform duration-700">📐</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modellarni ochish
                  </h3>
                  <p className="text-emerald-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-emerald-200 text-xs">cis-[PtCl₂(NH₃)₂]</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-orange-200 text-xs">trans-[PtCl₂(NH₃)₂]</span>
                    {' '}— Sisplatin va uning faolsiz izomerining fazoviy farqini ko'ring
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-5 group-hover:bg-white/30 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-white">Ko'rish →</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 animate-bounce">
              <span className="text-3xl">✨</span>
            </div>
          </Link>
        </div>

        {/* NAZARIY ASOS */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-emerald-100 text-lg leading-relaxed mb-4">
              <strong className="text-emerald-300 text-xl">Geometrik izomeriya</strong> — ligandlarning
              markaziy atom atrofidagi <strong className="text-yellow-400">nisbiy joylashuvi</strong>
              farq qilishi natijasida yuzaga keladigan stereoizomeriya turi.
            </p>
            <p className="text-emerald-200 leading-relaxed">
              Bu izomerlar bir-biridan <strong className="text-emerald-300">fizik xossalari</strong>
              (qaynash harorati, eruvchanlik, dipol momenti) va
              <strong className="text-emerald-300"> biologik faolligi</strong> bilan keskin farq qiladi.
              Eng mashhur misol — <strong className="text-yellow-400">sisplatin</strong> (saraton dorisi)
              va uning faolsiz trans-izomeri.
            </p>
          </div>

          {/* QAYSI GEOMETRIYALARDA BO'LADI? */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-900/30 border border-emerald-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">◻️</span>
                <h3 className="font-bold text-emerald-300">Kvadrat-planar</h3>
              </div>
              <p className="text-blue-100 text-sm">
                <strong>KS=4.</strong> MA₂B₂ tipidagi komplekslarda
                <strong className="text-yellow-400"> cis/trans</strong> izomeriya kuzatiladi.
                Misol: [PtCl₂(NH₃)₂].
              </p>
            </div>
            <div className="bg-teal-900/30 border border-teal-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔷</span>
                <h3 className="font-bold text-teal-300">Oktaedrik</h3>
              </div>
              <p className="text-blue-100 text-sm">
                <strong>KS=6.</strong> MA₄B₂ (cis/trans) va MA₃B₃ (fac/mer)
                tiplarida geometrik izomeriya mavjud.
              </p>
            </div>
            <div className="bg-red-900/30 border border-red-600/40 rounded-2xl p-5 opacity-80">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🚫</span>
                <h3 className="font-bold text-red-300">Tetraedrik</h3>
              </div>
              <p className="text-blue-100 text-sm">
                <strong>KS=4.</strong> Barcha 4 ta pozitsiya ekvivalent.
                <strong className="text-red-400"> Geometrik izomeriya YO'Q!</strong>
                (Faqat optik izomeriya bo'lishi mumkin).
              </p>
            </div>
          </div>
        </div>

        {/* CIS-TRANS: KVADRAT PLANAR */}
        <div className="bg-gradient-to-br from-blue-900/40 to-emerald-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">◻️</span>
            Cis-Trans: <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Kvadrat-planar (MA₂B₂)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CIS */}
            <div className="bg-emerald-900/30 border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-600/30 border border-emerald-500/50 rounded-full text-xs font-bold text-emerald-300">
                YONMA-YON
              </div>
              <h3 className="text-2xl font-bold text-emerald-300 mb-3">cis-izomer</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Bir xil ligandlar <strong className="text-yellow-400">yonma-yon</strong> (90° burchak ostida) joylashgan.
              </p>
              
              <div className="bg-slate-950/60 rounded-xl p-4 mb-4 font-mono text-center text-sm border border-emerald-700/30">
                <div className="text-emerald-300">NH₃ &nbsp;&nbsp;&nbsp;&nbsp; Cl</div>
                <div className="text-white my-1">&nbsp;&nbsp;\ &nbsp;&nbsp;&nbsp;&nbsp; /</div>
                <div className="text-yellow-400 font-bold">&nbsp;&nbsp;&nbsp;Pt</div>
                <div className="text-white my-1">&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp; \</div>
                <div className="text-emerald-300">NH₃ &nbsp;&nbsp;&nbsp;&nbsp; Cl</div>
              </div>

              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span>💊</span> SISPLATIN
                </h4>
                <ul className="text-emerald-100 text-xs space-y-1">
                  <li>• <strong>Saraton davosi</strong> (testikulyar, tuxumdon)</li>
                  <li>• DNK ga bog'lanib, replikatsiyani to'xtatadi</li>
                  <li>• Jahon sog'liqni saqlash tashkiloti ro'yxatida</li>
                  <li>• <strong>Dipol momenti ≠ 0</strong> (qutbli molekula)</li>
                </ul>
              </div>
            </div>

            {/* TRANS */}
            <div className="bg-orange-900/30 border border-orange-500/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-3 right-3 px-3 py-1 bg-orange-600/30 border border-orange-500/50 rounded-full text-xs font-bold text-orange-300">
                QARAMA-QARSHI
              </div>
              <h3 className="text-2xl font-bold text-orange-300 mb-3">trans-izomer</h3>
              <p className="text-emerald-100 text-sm mb-4">
                Bir xil ligandlar <strong className="text-yellow-400">qarama-qarshi</strong> (180° burchak ostida) joylashgan.
              </p>
              
              <div className="bg-slate-950/60 rounded-xl p-4 mb-4 font-mono text-center text-sm border border-orange-700/30">
                <div className="text-emerald-300">NH₃ &nbsp;&nbsp;&nbsp;&nbsp; NH₃</div>
                <div className="text-white my-1">&nbsp;&nbsp;\ &nbsp;&nbsp;&nbsp;&nbsp; /</div>
                <div className="text-yellow-400 font-bold">&nbsp;&nbsp;&nbsp;Pt</div>
                <div className="text-white my-1">&nbsp;&nbsp;/ &nbsp;&nbsp;&nbsp;&nbsp; \</div>
                <div className="text-emerald-300">Cl &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Cl</div>
              </div>

              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                  <span>❌</span> TRANSPLATIN
                </h4>
                <ul className="text-emerald-100 text-xs space-y-1">
                  <li>• <strong>Biologik faol EMAS</strong></li>
                  <li>• DNK bilan samarali bog'lana olmaydi</li>
                  <li>• Simmetriya tufayli sterik to'siq</li>
                  <li>• <strong>Dipol momenti = 0</strong> (qutbsiz molekula)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CIS-TRANS: OKTAEDRIK */}
        <div className="bg-gradient-to-br from-teal-900/40 to-blue-900/40 border border-teal-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔷</span>
            Cis-Trans: <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Oktaedrik (MA₄B₂)</span>
          </h2>
          <p className="text-teal-100 text-lg mb-6 leading-relaxed">
            Oktaedrik komplekslarda ham cis-trans izomeriya kuzatiladi. Klassik misol —
            <strong className="text-teal-300"> [CoCl₂(NH₃)₄]⁺</strong> kompleksi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-900/30 border border-teal-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-teal-300 mb-3">cis-[CoCl₂(NH₃)₄]⁺</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• 2 ta Cl⁻ ligand <strong className="text-yellow-400">yonma-yon</strong> (90°)</li>
                <li>• <strong>Rangi:</strong> Binafsha</li>
                <li>• <strong>Dipol momenti:</strong> Katta (qutbli)</li>
                <li>• Suvda yaxshi eriydi</li>
              </ul>
            </div>
            <div className="bg-cyan-900/30 border border-cyan-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-cyan-300 mb-3">trans-[CoCl₂(NH₃)₄]⁺</h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• 2 ta Cl⁻ ligand <strong className="text-yellow-400">qarama-qarshi</strong> (180°)</li>
                <li>• <strong>Rangi:</strong> Yashil</li>
                <li>• <strong>Dipol momenti:</strong> Nol (qutbsiz)</li>
                <li>• Kamroq eruvchan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAC-MER IZOMERIYA */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔶</span>
            Fac-Mer: <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Oktaedrik (MA₃B₃)</span>
          </h2>
          <p className="text-indigo-100 text-lg mb-6 leading-relaxed">
            <strong className="text-indigo-300">MA₃B₃</strong> tipidagi oktaedrik komplekslarda
            geometrik izomeriyaning maxsus turi — <strong className="text-yellow-400">facial (fac)</strong>
            va <strong className="text-yellow-400">meridional (mer)</strong> izomeriya kuzatiladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900/30 border border-indigo-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔺</span>
                <h3 className="text-xl font-bold text-indigo-300">fac-izomer (facial)</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                Uchta bir xil ligand oktaedrning <strong className="text-yellow-400">bitta uchburchak yuzida</strong>
                joylashgan. Barcha 3 ta ligand o'zaro <strong>90°</strong> burchak hosil qiladi.
              </p>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-indigo-700/30">
                <p className="font-mono text-indigo-300 text-center">fac-[Co(NH₃)₃Cl₃]</p>
                <p className="text-xs text-blue-200 mt-2 text-center">3 ta Cl⁻ bir yuzda • C₃v simmetriya</p>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">➖</span>
                <h3 className="text-xl font-bold text-blue-300">mer-izomer (meridional)</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                Uchta bir xil ligand oktaedrning <strong className="text-yellow-400">meridiani bo'ylab</strong>
                joylashgan. Ikkitasi qarama-qarshi (180°), uchinchisi ularga perpendikulyar.
              </p>
              <div className="bg-slate-950/60 rounded-xl p-4 border border-blue-700/30">
                <p className="font-mono text-blue-300 text-center">mer-[Co(NH₃)₃Cl₃]</p>
                <p className="text-xs text-blue-200 mt-2 text-center">Cl⁻ lar meridian bo'ylab • C₂v simmetriya</p>
              </div>
            </div>
          </div>
        </div>

        {/* ANALITIK USULLAR — teal-300/400 */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎨</span>
                <h3 className="text-lg font-bold text-teal-300">Rang farqi</h3>
              </div>
              <p className="text-teal-100 text-sm">
                Cis va trans izomerlar ko'pincha <strong>turli rangda</strong> bo'ladi.
                Masalan, [CoCl₂(NH₃)₄]⁺: cis = binafsha, trans = yashil.
              </p>
            </div>
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-teal-300">Dipol momenti</h3>
              </div>
              <p className="text-teal-100 text-sm">
                <strong>Cis:</strong> μ ≠ 0 (qutbli). <strong>Trans:</strong> μ = 0 (qutbsiz).
                Dielektrik o'tkazuvchanlik orqali aniqlanadi.
              </p>
            </div>
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-teal-300">NMR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm">
                Cis izomerda ligand signallari <strong>murakkabroq</strong> (kamroq simmetriya).
                Trans izomerda <strong>soddaroq</strong> spektr (yuqori simmetriya).
              </p>
            </div>
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi</h3>
              </div>
              <p className="text-teal-100 text-sm">
                Eng aniq usul. Kristall panjarada atomlarning
                <strong> aniq joylashuvi</strong> to'g'ridan-to'g'ri ko'rinadi.
              </p>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Cis vs Trans <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-emerald-700">
                  <th className="py-3 px-4 text-emerald-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-emerald-400 text-sm">cis-izomer</th>
                  <th className="py-3 px-4 text-orange-400 text-sm">trans-izomer</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100 text-sm">
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Ligandlar joylashuvi</td>
                  <td className="py-3 px-4">Yonma-yon (90°)</td>
                  <td className="py-3 px-4">Qarama-qarshi (180°)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Simmetriya</td>
                  <td className="py-3 px-4">Past (C₂v)</td>
                  <td className="py-3 px-4">Yuqori (D₂h)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Dipol momenti</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">μ ≠ 0 (qutbli)</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">μ = 0 (qutbsiz)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Eruvchanlik</td>
                  <td className="py-3 px-4">Yuqori (qutbli erituvchilarda)</td>
                  <td className="py-3 px-4">Past</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Barqarorlik</td>
                  <td className="py-3 px-4">Kamroq barqaror (sterik to'siq)</td>
                  <td className="py-3 px-4">Ko'proq barqaror</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Biologik faollik</td>
                  <td className="py-3 px-4 text-green-400 font-bold">Ko'pincha yuqori</td>
                  <td className="py-3 px-4 text-red-400 font-bold">Ko'pincha past</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AMALIY AHAMIYAT — violet-400 */}
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Amaliy <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ahamiyat</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Saraton terapiyasi</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>Sisplatin</strong> (cis-[PtCl₂(NH₃)₂]) — eng keng tarqalgan kimyoterapiya dorisi.
                Faqat cis-izomer DNK bilan bog'lanib, saraton hujayralarini o'ldiradi.
                Trans-izomer butunlay samarasiz.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏭</span>
                <h3 className="text-lg font-bold text-violet-300">Kataliz</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Geometrik izomerlar <strong>turli katalitik faollikka</strong> ega.
                Masalan, Ziegler-Natta katalizatorlarida cis/trans nisbati polimer
                strukturasini belgilaydi.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎨</span>
                <h3 className="text-lg font-bold text-violet-300">Materialshunoslik</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Izomerlarning <strong>rang farqi</strong> sensorlar va indikatorlar yaratishda ishlatiladi.
                Bug' bosimi va eruvchanlik farqi esa ajratish texnologiyalarida muhim.
              </p>
            </div>
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-violet-300">Bio-noorganik kimyo</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Metall fermentlarda substratning <strong>geometrik joylashuvi</strong>
                reaksiya selektivligini belgilaydi. Tabiat faqat ma'lum bir izomerni tanlaydi.
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyot</span>
          </h2>
          <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h3 className="text-xl font-bold text-amber-400">Alfred Werner (1893)</h3>
                  <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                </div>
                <p className="text-emerald-200 text-sm mb-3">
                  Werner <strong>geometrik izomeriyani</strong> birinchi bo'lib tushuntirdi.
                  U [CoCl₂(NH₃)₄]⁺ ning binafsha (cis) va yashil (trans) shakllarini alohida sintez qilib,
                  ularning <strong>turli moddalar</strong> ekanligini isbotladi.
                </p>
                <p className="text-emerald-200 text-sm">
                  <strong>1965:</strong> Barnett Rosenberg sisplatinning saratonga qarshi ta'sirini kashf qildi.
                  Bu kashfiyot geometrik izomeriyaning <strong>hayotiy ahamiyatini</strong> butun dunyoga ko'rsatdi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-emerald-100 list-decimal list-inside">
            <li>
              Geometrik izomeriya — ligandlarning <strong className="text-emerald-300">fazoviy joylashuvi</strong>
              farq qilishi (bog'lanish tartibi bir xil).
            </li>
            <li>
              <strong className="text-emerald-300">Cis-trans:</strong> MA₂B₂ (kvadrat-planar) va MA₄B₂ (oktaedrik).
            </li>
            <li>
              <strong className="text-emerald-300">Fac-mer:</strong> MA₃B₃ (oktaedrik).
            </li>
            <li>
              <strong className="text-red-400">Tetraedrik komplekslarda geometrik izomeriya YO'Q</strong>
              (barcha pozitsiyalar ekvivalent).
            </li>
            <li>
              <strong className="text-emerald-300">Sisplatin</strong> — geometrik izomeriyaning eng muhim amaliy misoli
              (cis = dori, trans = samarasiz).
            </li>
            <li>
              Farqlash usullari: <strong className="text-emerald-300">rang, dipol momenti, NMR, XRD</strong>.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">📐</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Cis va Trans ni <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">3D da</span> solishtiring!
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Sisplatin va transplatinning fazoviy tuzilishini, ligandlarning 90° va 180° joylashuvini,
              fac va mer izomerlarning oktaedr yuzidagi farqini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/stereo/geometrik/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/stereo" className="px-6 py-3 border border-emerald-500 rounded-xl hover:bg-emerald-800/50 text-emerald-300 text-center">
            ← Stereoizomeriya
          </Link>
          <Link href="/oquv/izomeriyasi/stereo/optik" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-bold text-center">
            Optik izomeriya →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Geometrik izomeriya • Cis/Trans • Fac/Mer • Sisplatin • Werner (1893)</p>
        </div>
      </footer>
    </main>
  )
}