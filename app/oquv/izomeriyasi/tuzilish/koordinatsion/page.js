import Link from "next/link"
export default function KoordinatsionIzomeriya() {
  const izomerlar = [
    {
      num: 1,
      formula: "[Cr(NH₃)₆][Fe(CN)₆]",
      name: "Geksaamminkxrom(III) geksasianoferrat(III)",
      rang: "Sariq-yashil",
      rangColor: "text-emerald-400",
      bg: "from-emerald-600/10 to-teal-900/30 border-emerald-500/30",
      kation: "[Cr(NH₃)₆]³⁺",
      anion: "[Fe(CN)₆]³⁻",
      kationMetal: "Cr³⁺ (d³)",
      anionMetal: "Fe³⁺ (d⁵)",
      kationLigand: "6 ta NH₃",
      anionLigand: "6 ta CN⁻",
      izoh: "Kation kompleksida Cr³⁺ markaziy atom sifatida 6 ta NH₃ ligand bilan oktaedrik kompleks hosil qiladi. Anion kompleksida esa Fe³⁺ 6 ta CN⁻ bilan bog'langan. Cr³⁺ ning d³ konfiguratsiyasi uni kinetik inert qiladi, shu sababli izomer barqaror.",
    },
    {
      num: 2,
      formula: "[Fe(NH₃)₆][Cr(CN)₆]",
      name: "Geksaaammintemir(III) geksasianoxromat(III)",
      rang: "Ko'k-yashil",
      rangColor: "text-cyan-400",
      bg: "from-cyan-600/10 to-teal-900/30 border-cyan-500/30",
      kation: "[Fe(NH₃)₆]³⁺",
      anion: "[Cr(CN)₆]³⁻",
      kationMetal: "Fe³⁺ (d⁵)",
      anionMetal: "Cr³⁺ (d³)",
      kationLigand: "6 ta NH₃",
      anionLigand: "6 ta CN⁻",
      izoh: "Bu safar Fe³⁺ kationda, Cr³⁺ esa anion kompleksda joylashgan. Metallar o'zaro ligandlarini almashtirgan. Fe³⁺ ning d⁵ konfiguratsiyasi paramagnetik xususiyat beradi, Cr³⁺ esa CN⁻ kabi kuchli maydon ligand bilan past spinli holatga o'tadi.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-emerald-950 to-teal-950 text-white">
      {/* HEADER */}
      <header className="border-b border-emerald-800/50 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-emerald-400 flex-wrap">
            <Link href="/" className="hover:text-emerald-300">🏠 Bosh sahifa</Link>
            <span className="text-emerald-600">›</span>
            <Link href="/oquv" className="hover:text-emerald-300">O'quv</Link>
            <span className="text-emerald-600">›</span>
            <Link href="/oquv/izomeriyasi" className="hover:text-emerald-300">Izomeriyasi</Link>
            <span className="text-emerald-600">›</span>
            <Link href="/oquv/izomeriyasi/tuzilish" className="hover:text-emerald-300">Tuzilish</Link>
            <span className="text-emerald-600">›</span>
            <span className="text-emerald-300 font-semibold">🔄 Koordinatsion izomeriya</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-300 flex items-center gap-2">
                <span className="text-3xl">🔄</span>
                Koordinatsion izomeriya
              </h1>
              <p className="text-emerald-500 text-sm mt-1">
                Ikki kompleks o'zaro ligandlarini almashadi • Asosiy tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion/3d" className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-emerald-600/30">
                🧊 3D modelni ochish
              </Link>
              <Link href="/oquv/izomeriyasi/tuzilish" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                ← Tuzilish bo'limi
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* HERO */}
        <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border border-emerald-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-600/20 border border-emerald-600/30 rounded-full text-xs font-semibold text-emerald-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ASOSIY IZOMERIYA TURI • WERNER 1893
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Koordinatsion izomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">metallar o'zaro ligand almashadi</span>
            </h2>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mb-8 leading-relaxed">
              Koordinatsion izomeriya <strong className="text-emerald-300">ham kation, ham anion</strong> kompleks
              ionlarini tutgan tuzlarda kuzatiladi. Bunda ikki metall atomi
              <strong className="text-emerald-300"> o'zaro ligandlarini almashadi</strong>,
              natijada butunlay boshqa xossalarga ega juft moddalar hosil bo'ladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-emerald-300">2</div>
                <div className="text-xs text-emerald-300 mt-1">Metall atomi</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-extrabold text-emerald-300">NH₃↔CN⁻</div>
                <div className="text-xs text-emerald-300 mt-1">Almashinuvchi ligandlar</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📐</div>
                <div className="text-2xl font-extrabold text-emerald-300">KS=6</div>
                <div className="text-xs text-emerald-300 mt-1">Oktaedr geometriya</div>
              </div>
              <div className="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-emerald-300">1893</div>
                <div className="text-xs text-emerald-300 mt-1">Werner kashfiyoti</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-cyan-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/koordinatsion/3d"
            className="relative block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 rounded-3xl p-8 md:p-10 shadow-2xl shadow-emerald-600/40 transform hover:scale-[1.02] transition-all group border border-emerald-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-180 transition-transform duration-700">🔄</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-emerald-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-emerald-200 text-xs">[Cr(NH₃)₆][Fe(CN)₆]</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-cyan-200 text-xs">[Fe(NH₃)₆][Cr(CN)₆]</span>
                    {' '}— Cr³⁺ va Fe³⁺ ning fazoviy almashinuvini ko'ring
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

        {/* ASOSIY TA'RIF */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-emerald-100 text-lg leading-relaxed mb-4">
              <strong className="text-emerald-300 text-xl">Koordinatsion izomeriya</strong> — tarkibida
              <strong className="text-yellow-400"> ham kation, ham anion kompleks ionlari</strong> bo'lgan tuzlarda
              metallar o'zaro ligandlarini almashganda hosil bo'ladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-emerald-200 leading-relaxed">
              Bu hodisa <strong className="text-emerald-300">kamida ikkita kompleks ion</strong> mavjud bo'lgandagina
              yuzaga keladi. Oddiy tuzlarda (masalan, [Co(NH₃)₆]Cl₃) koordinatsion izomeriya bo'lmaydi.
            </p>
          </div>

          {/* KATION VS ANION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">➕</span>
                <h3 className="text-xl font-bold text-emerald-300">Kation kompleks</h3>
              </div>
              <p className="text-emerald-100 mb-4 text-sm">
                <strong>Musbat zaryadli</strong> kompleks ion — dissotsiatsiyada kation sifatida ajraladi.
                Kvadrat qavslardan keyin <strong>anion</strong> joylashadi.
              </p>
              <ul className="space-y-2 text-emerald-200 text-sm">
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> <strong>Kvadrat qavslar ichida</strong> birinchi yoziladi</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Metall <strong>past oksidlanish darajasida</strong> bo'lishi mumkin</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Neytral yoki musbat ligandlar (NH₃, H₂O) ko'p</li>
                <li className="flex gap-2"><span className="text-emerald-400">✓</span> Misol: <code className="bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-300 text-xs">[Cr(NH₃)₆]³⁺</code></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border border-cyan-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">➖</span>
                <h3 className="text-xl font-bold text-cyan-300">Anion kompleks</h3>
              </div>
              <p className="text-emerald-100 mb-4 text-sm">
                <strong>Manfiy zaryadli</strong> kompleks ion — dissotsiatsiyada anion sifatida ajraladi.
                Metall nomi <strong>-at</strong> qo'shimchasi oladi (ferrat, xromat).
              </p>
              <ul className="space-y-2 text-emerald-200 text-sm">
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> <strong>Kvadrat qavslar ichida</strong> ikkinchi yoziladi</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Metall <strong>yuqori oksidlanish darajasida</strong> bo'lishi kerak</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Manfiy ligandlar (CN⁻, Cl⁻) ko'p</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Misol: <code className="bg-cyan-950/60 px-2 py-0.5 rounded text-cyan-300 text-xs">[Fe(CN)₆]³⁻</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Cr/Fe almashinuvi</span>
          </h2>
          <p className="text-emerald-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Werner <strong className="text-emerald-300">1893-yilda</strong> koordinatsion nazariyani isbotlash uchun
            ushbu misolni ishlatgan. Bir xil yalpi formulaga ega <strong className="text-emerald-300">2 ta turli modda</strong>
            rangi, magnit xossalari va reaksiyalari bilan farqlanadi.
          </p>

          <div className="space-y-6">
            {izomerlar.map((iz) => (
              <div
                key={iz.num}
                className={`bg-gradient-to-br ${iz.bg} border rounded-3xl p-6 md:p-8 relative overflow-hidden`}
              >
                <div className="absolute top-4 right-4 text-[120px] opacity-5 font-black select-none">
                  {iz.num}
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs text-emerald-300 font-bold bg-emerald-900/40 px-3 py-1 rounded-full">
                          Izomer {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/20 border border-emerald-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-emerald-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-emerald-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  {/* Ikkala kompleks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950/60 border border-emerald-700/30 rounded-2xl p-5">
                      <div className="text-xs text-emerald-300 mb-2 font-bold">➕ KATION KOMPLEKS</div>
                      <p className="font-mono text-emerald-300 text-lg mb-3">{iz.kation}</p>
                      <div className="space-y-1 text-sm text-emerald-100">
                        <div>Markaziy atom: <strong className="text-yellow-400">{iz.kationMetal}</strong></div>
                        <div>Ligandlar: <strong className="text-yellow-400">{iz.kationLigand}</strong></div>
                        <div>Geometriya: <strong className="text-yellow-400">Oktaedr</strong></div>
                      </div>
                    </div>
                    <div className="bg-slate-950/60 border border-cyan-700/30 rounded-2xl p-5">
                      <div className="text-xs text-cyan-300 mb-2 font-bold">➖ ANION KOMPLEKS</div>
                      <p className="font-mono text-cyan-300 text-lg mb-3">{iz.anion}</p>
                      <div className="space-y-1 text-sm text-emerald-100">
                        <div>Markaziy atom: <strong className="text-yellow-400">{iz.anionMetal}</strong></div>
                        <div>Ligandlar: <strong className="text-yellow-400">{iz.anionLigand}</strong></div>
                        <div>Geometriya: <strong className="text-yellow-400">Oktaedr</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-700/30">
                      <div className="text-xs text-emerald-300 mb-2">⚛️ Oksidlanish darajalari</div>
                      <div className="text-lg font-bold text-yellow-400">Cr³⁺ va Fe³⁺</div>
                      <p className="text-xs text-emerald-200 mt-1">Almashinuvi davomida saqlanadi</p>
                    </div>
                    <div className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-700/30">
                      <div className="text-xs text-emerald-300 mb-2">🧲 Magnit xossasi</div>
                      <div className="text-lg font-bold text-cyan-400">Paramagnit</div>
                      <p className="text-xs text-emerald-200 mt-1">d³ va d⁵ — toq elektronlar bor</p>
                    </div>
                    <div className="bg-emerald-950/60 rounded-xl p-4 border border-emerald-700/30">
                      <div className="text-xs text-emerald-300 mb-2">🔌 Elektrolit turi</div>
                      <div className="text-lg font-bold text-green-400">1:1 (3+/3-)</div>
                      <p className="text-xs text-emerald-200 mt-1">Ikkala izomerda ham bir xil</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MUHIM TUSHUNCHALAR */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 border border-yellow-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🎓</span>
            Muhim <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">tushunchalar</span>
          </h2>
          <p className="text-yellow-100 mb-6 text-sm md:text-base">
            Koordinatsion izomeriyani to'liq tushunish uchun quyidagi atamalarni bilish kerak:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>⚛️</span> Metallarning roli
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Koordinatsion izomeriya uchun <strong>ikki xil metall</strong> kerak.
                Biri kationda, ikkinchisi anionda bo'lishi shart. Bir xil metall bo'lsa,
                <strong> almashinuv sodir bo'lmaydi</strong> — bu boshqa izomeriya turiga aylanadi.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>📐</span> Oksidlanish darajasi
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Izomerlar hosil bo'lishida metallarning <strong>oksidlanish darajalari saqlanadi</strong>.
                Masalan, Cr³⁺ va Fe³⁺ har doim +3 darajada qoladi, faqat joylashuvi o'zgaradi.
                Bu <strong>elektron izomeriyasidan</strong> farq qiladi.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>🧲</span> Magnit xususiyatlari
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Har bir izomer <strong>turli magnit moment</strong>ga ega bo'ladi.
                Cr³⁺ ning d³ konfiguratsiyasi har doim 3 ta toq elektronga ega.
                Fe³⁺ esa ligand maydon kuchiga qarab <strong>yuqori yoki past spinli</strong> bo'lishi mumkin.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>📚</span> IUPAC nomlash
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Kation kompleks birinchi yoziladi. Anion kompleksda metall nomi
                <strong> "-at"</strong> qo'shimchasi oladi: <strong>ferrat</strong> (Fe),
                <strong> xromat</strong> (Cr), <strong>kobaltat</strong> (Co).
              </p>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Ikkala izomerni <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-emerald-700">
                  <th className="py-3 px-4 text-emerald-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-emerald-400 text-sm">Izomer 1</th>
                  <th className="py-3 px-4 text-cyan-400 text-sm">Izomer 2</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100 text-sm">
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold text-white">Formula</td>
                  <td className="py-3 px-4 font-mono text-emerald-300">[Cr(NH₃)₆][Fe(CN)₆]</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">[Fe(NH₃)₆][Cr(CN)₆]</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">IUPAC nomi</td>
                  <td className="py-3 px-4 text-xs">Geksaamminkxrom(III) geksasianoferrat(III)</td>
                  <td className="py-3 px-4 text-xs">Geksaammintemir(III) geksasianoxromat(III)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Kation markaziy atomi</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Cr³⁺ (d³)</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Fe³⁺ (d⁵)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Anion markaziy atomi</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Fe³⁺ (d⁵)</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Cr³⁺ (d³)</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Kation ligandlari</td>
                  <td className="py-3 px-4">6 ta NH₃</td>
                  <td className="py-3 px-4">6 ta NH₃</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Anion ligandlari</td>
                  <td className="py-3 px-4">6 ta CN⁻</td>
                  <td className="py-3 px-4">6 ta CN⁻</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Rangi</td>
                  <td className="py-3 px-4">Sariq-yashil</td>
                  <td className="py-3 px-4">Ko'k-yashil</td>
                </tr>
                <tr className="border-b border-emerald-800/30">
                  <td className="py-3 px-4 font-bold">Magnit momenti (μeff)</td>
                  <td className="py-3 px-4">~7.5 μB</td>
                  <td className="py-3 px-4">~9.5 μB</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Elektr o'tkazuvchanlik</td>
                  <td className="py-3 px-4">~500 S·cm²/mol</td>
                  <td className="py-3 px-4">~495 S·cm²/mol</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALITIK USULLAR */}
        <div className="bg-gradient-to-br from-teal-900/30 to-emerald-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Koordinatsion izomerlarini farqlashda bir nechta instrumental usul qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-teal-300">Magnitometriya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">
                Magnit momentni o'lchash orqali metallarning spin holati aniqlanadi:
              </p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Izomer 1:</strong> Cr³⁺ (3 toq e⁻) + Fe³⁺ (1 toq e⁻, past spin)</li>
                <li>• <strong>Izomer 2:</strong> Fe³⁺ (5 toq e⁻, yuqori spin) + Cr³⁺ (3 toq e⁻)</li>
                <li>• <strong>Farq:</strong> sezilarli darajada katta</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-teal-300">UV-Vis spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">
                Rangdagi farq yutilish spektrlarida ko'rinadi:
              </p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Izomer 1:</strong> λmax ~ 460 nm (sariq-yashil)</li>
                <li>• <strong>Izomer 2:</strong> λmax ~ 520 nm (ko'k-yashil)</li>
                <li>• d-d o'tishlar turlicha energiyada</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">IR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">
                CN⁻ va NH₃ bog'larining tebranish chastotalari farqlanadi:
              </p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>ν(C≡N):</strong> 2100-2200 cm⁻¹ (kuchli cho'qqi)</li>
                <li>• <strong>ν(N-H):</strong> 3200-3400 cm⁻¹</li>
                <li>• ν(C≡N) qiymati metallarga bog'liq o'zgaradi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧪</span>
                <h3 className="text-lg font-bold text-teal-300">Kimyoviy reaksiyalar</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">
                Kislota yoki asos bilan reaksiya har xil mahsulotlar beradi:
              </p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Kuchli kislota:</strong> NH₃ ligandlari protonlanadi</li>
                <li>• <strong>Kationdagi metall</strong> erkin ion sifatida chiqadi</li>
                <li>• Ikkala izomerda turli metallar ajraladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-emerald-100 mb-6 text-sm md:text-base">
            Koordinatsion izomeriya faqat Cr/Fe da emas, balki boshqa metall juftliklarida ham uchraydi:
          </p>

          <div className="space-y-4">
            <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-700/30">
              <h3 className="text-lg font-bold text-indigo-400 mb-3">
                🔷 Platina(II) va Mis(II) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Pt(NH₃)₄][CuCl₄]</p>
                  <p className="text-emerald-200 text-xs">Pt²⁺ kationda, Cu²⁻ anionda</p>
                  <p className="text-emerald-300 text-xs mt-1">Ikkalasi ham kvadrat-planar</p>
                </div>
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cu(NH₃)₄][PtCl₄]</p>
                  <p className="text-emerald-200 text-xs">Cu²⁺ kationda, Pt²⁺ anionda</p>
                  <p className="text-emerald-300 text-xs mt-1">Magnus yashil tuzi izomeri</p>
                </div>
              </div>
              <p className="text-emerald-300 text-xs mt-3">
                💡 <strong>Magnus yashil tuzi</strong> [Pt(NH₃)₄][PtCl₄] — bir xil metallning koordinatsion izomeri (noyob holat)
              </p>
            </div>

            <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-700/30">
              <h3 className="text-lg font-bold text-blue-400 mb-3">
                💙 Kobalt(III) va Xrom(III) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(NH₃)₆][Cr(CN)₆]</p>
                  <p className="text-emerald-200 text-xs">Co³⁺ kationda, Cr³⁺ anionda</p>
                  <p className="text-emerald-300 text-xs mt-1">Oktaedr geometriya</p>
                </div>
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cr(NH₃)₆][Co(CN)₆]</p>
                  <p className="text-emerald-200 text-xs">Cr³⁺ kationda, Co³⁺ anionda</p>
                  <p className="text-emerald-300 text-xs mt-1">Turli rang va magnit moment</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-700/30">
              <h3 className="text-lg font-bold text-amber-400 mb-3">
                🟡 Qisman almashinuv
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(NH₃)₆][Cr(NH₃)₂(CN)₄]</p>
                  <p className="text-emerald-200 text-xs">Qisman ligand almashinuvi</p>
                </div>
                <div className="bg-emerald-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cr(NH₃)₄(CN)₂][Co(NH₃)₂(CN)₄]</p>
                  <p className="text-emerald-200 text-xs">Murakkab almashinuv</p>
                </div>
              </div>
              <p className="text-emerald-300 text-xs mt-3">
                💡 Ligandlar <strong>to'liq yoki qisman</strong> almashishi mumkin — bu ko'plab izomerlar hosil bo'lishiga olib keladi
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">kashfiyot</span>
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
                  <strong>1893:</strong> Werner o'zining inqilobiy <em>&quot;Beitrag zur Theorie der Affinität und Valenz&quot;</em>
                  asarida koordinatsion nazariyani e'lon qildi. U Cr/Fe komplekslarini o'rganib,
                  <strong> ikkita mustaqil koordinatsion sfera</strong> mavjudligini isbotladi.
                </p>
                <p className="text-emerald-200 text-sm mb-3">
                  <strong>Werner tajribasi:</strong> U [Cr(NH₃)₆][Fe(CN)₆] va [Fe(NH₃)₆][Cr(CN)₆] ni
                  alohida sintez qildi va ularning rangi, magnit xossalari va kimyoviy reaksiyalari
                  <strong> butunlay boshqa</strong> ekanligini ko'rsatdi. Bu nazariyaning asosiy isbotlaridan biri bo'ldi.
                </p>
                <p className="text-emerald-200 text-sm mb-3">
                  <strong>&quot;Koordinatsion son&quot;</strong> tushunchasi aynan shu ishlar orqali kiritildi.
                  Werner har bir metallning <strong>6 ta ligand</strong> bilan bog'lana olishini ko'rsatdi —
                  bu oktaedr geometriyaning birinchi tavsifi edi.
                </p>
                <p className="text-emerald-200 text-sm">
                  <strong>Nobel mukofoti:</strong> 1913-yilda Werner <em>noorganik kimyo bo'yicha birinchi Nobel</em>
                  mukofotini oldi. Uning ishlari butun zamonaviy koordinatsion kimyoning asosi bo'ldi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-emerald-100 list-decimal list-inside">
            <li>
              Koordinatsion izomeriya — <strong className="text-emerald-300">kation va anion komplekslar
              ligand almashadi</strong>, natijada metallar o'rin almashadi.
            </li>
            <li>
              Bu hodisa <strong className="text-emerald-300">faqat ikkala ion kompleks</strong> bo'lgan tuzlarda
              yuzaga keladi.
            </li>
            <li>
              Klassik misol: <strong className="text-emerald-300">[Cr(NH₃)₆][Fe(CN)₆]</strong>
              va <strong className="text-emerald-300">[Fe(NH₃)₆][Cr(CN)₆]</strong>.
            </li>
            <li>
              Izomerlar <strong className="text-emerald-300">rang, magnit moment</strong> va
              <strong> spektroskopik xususiyatlari</strong> bilan farqlanadi.
            </li>
            <li>
              Metallarning <strong>oksidlanish darajalari saqlanadi</strong>, faqat joylashuvi o'zgaradi.
            </li>
            <li>
              Werner bu hodisani <strong>1893-yilda</strong> o'rganib, koordinatsion nazariyaning
              asosiy isbotlaridan birini taqdim etdi.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔄</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ikkala izomerni <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda Cr³⁺ va Fe³⁺ ning fazoviy almashinuvini,
              NH₃ va CN⁻ ligandlarining joylashuvini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/koordinatsion/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/boglanish" className="px-6 py-3 border border-emerald-500 rounded-xl hover:bg-emerald-800/50 text-emerald-300 text-center">
            ← Bog'lanish izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/boshqa" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-bold text-center">
            Qolgan turlari →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-emerald-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Koordinatsion izomeriya • Cr/Fe almashinuvi • Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}