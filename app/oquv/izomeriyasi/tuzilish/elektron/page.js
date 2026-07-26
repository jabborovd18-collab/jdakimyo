import Link from "next/link"
export default function ElektronIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "Co³⁺—NO₂⁻",
      name: "Odatiy (normal) elektron holat",
      rang: "Sariq",
      rangColor: "text-yellow-400",
      bg: "from-yellow-600/10 to-slate-900/30 border-yellow-500/30",
      metallOksid: "Co³⁺ (d⁶, past spinli)",
      ligandHolat: "NO₂⁻ (nitrit anion)",
      elektronTaqsimot: "Metall: +3 oksidlanish | Ligand: -1 zaryadli",
      magnetizm: "Diamagnit (0 toq e⁻)",
      rangIzoh: "Sariq rang — klassik [Co(NH₃)₅NO₂]²⁺ (nitro shakl)",
      izoh: "Eng keng tarqalgan va termodinamik barqaror holat. Barcha elektronlar to'g'ri taqsimlangan: Co³⁺ (d⁶ past spinli, 0 toq elektron) va NO₂⁻ (azot orqali bog'langan anion). Bu holat kinetik inert — uzoq vaqt saqlanadi.",
    },
    {
      num: 2,
      formula: "Co²⁺—NO₂•",
      name: "Elektron ko'chgan holat (redoks izomer)",
      rang: "To'q qizil-jigarrang",
      rangColor: "text-red-400",
      bg: "from-red-600/10 to-slate-900/30 border-red-500/30",
      metallOksid: "Co²⁺ (d⁷)",
      ligandHolat: "NO₂• (neytral nitro radikali)",
      elektronTaqsimot: "Metall: +2 oksidlanish | Ligand: neytral radikal",
      magnetizm: "Paramagnit (1+ toq e⁻)",
      rangIzoh: "Qizil-jigarrang — LMCT (ligand-to-metal charge transfer) tufayli",
      izoh: "Metallga liganddan bir elektron ko'chgan: Co³⁺ → Co²⁺, NO₂⁻ → NO₂• (radikal). Bu holat metastabil (kam barqaror) va ko'pincha faqat past haroratlarda yoki fotokimyoviy sharoitda kuzatiladi. EPR spektroskopiya orqali aniqlanadi.",
    },
  ]

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
            <Link href="/oquv/izomeriyasi/tuzilish" className="hover:text-blue-300">Tuzilish</Link>
            <span className="text-blue-600">›</span>
            <span className="text-sky-400 font-semibold">⚛️ Elektron izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">⚛️</span>
                Elektron izomeriyasi
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Redoks izomeriya — elektron taqsimoti farqi • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/elektron/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
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
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 border border-blue-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-600/20 border border-sky-600/30 rounded-full text-xs font-semibold text-sky-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              KAM UCHRAYDIGAN TUR • REDOKS IZOMERIYA
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Elektron izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">metall va ligand o'rtasida elektron almashinuvi</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Elektron izomeriyasi (yoki <strong className="text-sky-300">redoks izomeriya</strong>) —
              bir xil kimyoviy formulaga ega komplekslarda
              <strong className="text-sky-300"> elektronlarning metall va ligand orasidagi taqsimlanishi</strong>
              farq qilishi natijasida kuzatiladigan hodisa. Bunda metallning
              <strong className="text-sky-300"> oksidlanish darajasi</strong> o'zgaradi, ligand esa
              qarama-qarshi yo'nalishda oksidlanadi yoki qaytariladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-sky-300">e⁻</div>
                <div className="text-xs text-sky-300 mt-1">Elektron ko'chishi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-extrabold text-sky-300">Redoks</div>
                <div className="text-xs text-sky-300 mt-1">Oksidlanish-qaytarilish</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧲</div>
                <div className="text-2xl font-extrabold text-sky-300">EPR</div>
                <div className="text-xs text-sky-300 mt-1">Asosiy farqlash</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-sky-300">1969</div>
                <div className="text-xs text-sky-300 mt-1">Creutz & Taube</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/elektron/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-[360deg] transition-transform duration-700">⚛️</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-yellow-200 text-xs">Co³⁺—NO₂⁻</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-red-200 text-xs">Co²⁺—NO₂•</span>
                    {' '}— elektronning metall va ligand orasidagi ko'chishini ko'ring
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
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-sky-100 text-lg leading-relaxed mb-4">
              <strong className="text-sky-300 text-xl">Elektron izomeriyasi</strong>
              (inglizcha: <em>electronic isomerism</em> yoki <em>redox isomerism</em>) —
              bir xil kimyoviy formulaga ega komplekslarda
              <strong className="text-yellow-400"> metall va ligand orasidagi elektron taqsimlanishi</strong>
              har xil bo'lishi natijasida yuzaga keladigan hodisa.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Bunda metallning <strong className="text-sky-300">oksidlanish darajasi</strong>
              (va shuning uchun d-elektron konfiguratsiyasi) o'zgaradi, ligand esa qarama-qarshi
              yo'nalishda oksidlanadi yoki qaytariladi. Natijada ikkala izomer
              <strong className="text-sky-300"> butunlay boshqa fizik-kimyoviy xususiyatlar</strong>
              (rangi, magnit momenti, spektroskopik belgilari)ga ega bo'ladi.
            </p>
          </div>

          {/* ELEKTRON KO'CHISHI */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span>
              Intramolekulyar elektron ko'chishi
            </h3>
            <div className="bg-slate-900/50 rounded-xl p-6 border border-sky-700/30 text-center">
              <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-lg">
                <span className="bg-yellow-950/60 px-4 py-3 rounded-lg border border-yellow-600/50">
                  <span className="text-yellow-400">Mⁿ⁺—L</span>
                  <div className="text-xs text-yellow-300 mt-1">Normal holat</div>
                </span>
                <div className="text-sky-400 flex flex-col items-center">
                  <span className="text-2xl">⇌</span>
                  <span className="text-xs text-sky-300">e⁻ ko'chishi</span>
                </div>
                <span className="bg-red-950/60 px-4 py-3 rounded-lg border border-red-600/50">
                  <span className="text-red-400">M⁽ⁿ⁻¹⁾⁺—L⁺•</span>
                  <div className="text-xs text-red-300 mt-1">Redoks izomer</div>
                </span>
              </div>
              <p className="text-sky-200 text-sm mt-4">
                Metall bir elektron qabul qiladi (qaytariladi), ligand bir elektron beradi (oksidlanadi)
              </p>
            </div>
          </div>

          {/* 3 TA ASOSIY XUSUSIYAT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">1️⃣</span>
                <h3 className="font-bold text-sky-300">Oksidlanish darajasi</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Izomerlarda metallning oksidlanish darajasi farq qiladi
                (masalan, <strong>Fe²⁺ vs Fe³⁺</strong>, <strong>Co²⁺ vs Co³⁺</strong>).
              </p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">2️⃣</span>
                <h3 className="font-bold text-indigo-300">Ligand holati</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ligand oksidlangan yoki qaytarilgan shaklda bo'ladi
                (masalan, NO₂⁻ ↔ NO₂•, O₂²⁻ ↔ O₂⁻•).
              </p>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">3️⃣</span>
                <h3 className="font-bold text-blue-300">Metastabillik</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ko'pincha bir izomer <strong>metastabil</strong> (kam barqaror) —
                tashqi ta'sirlar (yorug'lik, harorat) ta'sirida ikkinchisiga o'tadi.
              </p>
            </div>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Co³⁺/Co²⁺ almashinuvi</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Eng klassik misol — <strong className="text-sky-300">[Co(NH₃)₅NO₂]</strong>
            kompleksining ikki elektron holati. Metall va NO₂ ligandi orasidagi
            <strong className="text-sky-300"> intramolekulyar elektron ko'chishi</strong>
            ikki xil elektron izomerini hosil qiladi.
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
                        <span className="text-xs text-sky-300 font-bold bg-sky-900/40 px-3 py-1 rounded-full">
                          Elektron holat {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-indigo-600/20 border border-indigo-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-sky-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-sky-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-950/60 border border-yellow-700/30 rounded-2xl p-5">
                      <div className="text-xs text-yellow-300 mb-2 font-bold">⚛️ MARKAZIY METALL</div>
                      <p className="text-yellow-300 text-lg font-mono mb-2">{iz.metallOksid}</p>
                      <div className="text-xs text-blue-100">{iz.elektronTaqsimot}</div>
                    </div>
                    <div className="bg-slate-950/60 border border-red-700/30 rounded-2xl p-5">
                      <div className="text-xs text-red-300 mb-2 font-bold">🧪 LIGAND HOLATI</div>
                      <p className="text-red-300 text-lg font-mono mb-2">{iz.ligandHolat}</p>
                      <div className="text-xs text-blue-100">{iz.rangIzoh}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-sky-950/50 rounded-xl p-4 border border-sky-700/30">
                      <div className="text-xs text-sky-300 mb-2">🧲 Magnetizm</div>
                      <div className="text-sm font-bold text-yellow-400">{iz.magnetizm}</div>
                    </div>
                    <div className="bg-sky-950/50 rounded-xl p-4 border border-sky-700/30">
                      <div className="text-xs text-sky-300 mb-2">📡 EPR signali</div>
                      <div className="text-sm font-bold text-cyan-300">{iz.num === 1 ? "Yo'q (diamagnit)" : "Aniq (radikal)"}</div>
                    </div>
                    <div className="bg-sky-950/50 rounded-xl p-4 border border-sky-700/30">
                      <div className="text-xs text-sky-300 mb-2">⚖️ Barqarorlik</div>
                      <div className="text-sm font-bold text-green-400">{iz.num === 1 ? "Yuqori" : "Past (metastabil)"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CREUTZ-TAUBE IONI */}
        <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            Creutz-Taube ioni: <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">aralash valentli klassik misol</span>
          </h2>

          <p className="text-sky-100 text-lg mb-6 leading-relaxed">
            <strong className="text-sky-300">1969-yilda</strong> Carol Creutz va Henry Taube tomonidan sintez qilingan
            <strong className="text-yellow-400"> [(NH₃)₅Ru—pyz—Ru(NH₃)₅]⁵⁺</strong> ioni (pyz = pirazin) —
            elektron izomeriyaning <strong className="text-sky-300">eng mashhur misoli</strong>.
            Unda ikki Ru atomi <strong>aralash valentli (mixed-valence)</strong> holatda:
          </p>

          <div className="bg-slate-950/60 rounded-2xl p-6 border border-sky-700/30 mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap font-mono text-base md:text-lg mb-4">
              <span className="bg-blue-950/80 px-4 py-3 rounded-xl border border-sky-600/50">
                <span className="text-sky-300">[Ru²⁺(NH₃)₅]</span>
              </span>
              <span className="text-sky-400">—</span>
              <span className="bg-yellow-950/80 px-4 py-3 rounded-xl border border-yellow-600/50">
                <span className="text-yellow-300">pyz</span>
              </span>
              <span className="text-sky-400">—</span>
              <span className="bg-red-950/80 px-4 py-3 rounded-xl border border-red-600/50">
                <span className="text-red-300">[Ru³⁺(NH₃)₅]</span>
              </span>
            </div>
            <p className="text-sky-200 text-center text-sm mb-4">
              Bitta Ru²⁺ (d⁶) va bitta Ru³⁺ (d⁵) — <strong>jami zaryad: +5</strong>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-sky-900/30 rounded-xl p-4 border border-sky-700/30">
                <h4 className="text-sky-300 font-bold text-sm mb-2">🎯 Class II (lokal)</h4>
                <p className="text-blue-100 text-xs">
                  Elektron <strong>bir Ru da lokalizatsiya qilingan</strong> — Ru²⁺ va Ru³⁺ ajratilgan.
                  NIR diapazonda IVCT cho'qqisi kuzatiladi.
                </p>
              </div>
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                <h4 className="text-indigo-300 font-bold text-sm mb-2">🌀 Class III (delokal)</h4>
                <p className="text-blue-100 text-xs">
                  Elektron ikkala Ru orasida <strong>to'liq delokalizatsiyalangan</strong> — ikkalasi ham Ru²·⁵⁺.
                  "O'rtacha" valentlik holati.
                </p>
              </div>
              <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                <h4 className="text-yellow-300 font-bold text-sm mb-2">⚖️ Creutz-Taube</h4>
                <p className="text-blue-100 text-xs">
                  <strong>Class II va III orasida</strong> — yaqin Class III. Elektron tez almashinadi,
                  ammo to'liq delokalizatsiya emas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ROBIN-DAY KLASSIFIKATSIYASI */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-sky-900/40 border border-indigo-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📚</span>
            Robin-Day <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">klassifikatsiyasi</span>
          </h2>

          <p className="text-sky-100 text-lg mb-6 leading-relaxed">
            <strong className="text-yellow-400">1967-yilda</strong> Melvyn Robin va Peter Day aralash valentli
            (mixed-valence) komplekslarni <strong className="text-sky-300">3 ta sinfga</strong> bo'ldi.
            Bu klassifikatsiya elektron izomeriyaning asosiy ramkasi hisoblanadi:
          </p>

          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left bg-slate-950/40 rounded-xl overflow-hidden border border-indigo-700/30">
              <thead className="bg-indigo-950/40">
                <tr>
                  <th className="py-3 px-4 text-indigo-300 text-sm">Sinf</th>
                  <th className="py-3 px-4 text-indigo-300 text-sm">Xususiyati</th>
                  <th className="py-3 px-4 text-indigo-300 text-sm">Elektron holati</th>
                  <th className="py-3 px-4 text-indigo-300 text-sm">Spektroskopik belgi</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-t border-indigo-900/40">
                  <td className="py-3 px-4 font-bold text-red-400">Class I</td>
                  <td className="py-3 px-4 text-xs">Metallar to'liq izolyatsiyalangan</td>
                  <td className="py-3 px-4 text-xs">Lokalizatsiya qilingan (alohida Ru²⁺ va Ru³⁺)</td>
                  <td className="py-3 px-4 text-xs">Ikki alohida spektr (Ru²⁺ va Ru³⁺)</td>
                </tr>
                <tr className="border-t border-indigo-900/40">
                  <td className="py-3 px-4 font-bold text-yellow-400">Class II</td>
                  <td className="py-3 px-4 text-xs">Kuchsiz o'zaro ta'sir</td>
                  <td className="py-3 px-4 text-xs">Qisman lokallashgan, sekin almashinuv</td>
                  <td className="py-3 px-4 text-xs"><strong>IVCT cho'qqisi</strong> NIR da</td>
                </tr>
                <tr className="border-t border-indigo-900/40">
                  <td className="py-3 px-4 font-bold text-green-400">Class III</td>
                  <td className="py-3 px-4 text-xs">Kuchli o'zaro ta'sir</td>
                  <td className="py-3 px-4 text-xs">To'liq delokalizatsiya (Ru²·⁵⁺—Ru²·⁵⁺)</td>
                  <td className="py-3 px-4 text-xs">Bitta "o'rtacha" spektr</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-indigo-950/50 rounded-2xl p-5 border border-indigo-700/30">
            <h4 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
              <span>📐</span> IVCT — Intervalence Charge Transfer
            </h4>
            <p className="text-blue-100 text-sm leading-relaxed">
              Class II komplekslarda kuzatiladigan <strong>yutilish cho'qqisi</strong>.
              Bitta metalldan ikkinchisiga elektron ko'chishi natijasida yuzaga keladi.
              <strong className="text-sky-300"> Hush modeli</strong> (Noel Hush, 1967) orqali
              <strong> elektron bog'lanish kuchi</strong> (H_ab) aniqlanadi:
            </p>
            <div className="mt-3 bg-slate-900/50 rounded-lg p-3 border border-indigo-700/30">
              <p className="font-mono text-yellow-400 text-sm text-center">
                H_ab = (0.0206 / r) × √(ν_max × ε × Δν_½)
              </p>
              <p className="text-xs text-blue-200 mt-2 text-center">
                Bu yerda r — metallar orasidagi masofa, ν_max — IVCT cho'qqisi chastotasi,
                ε — molyar ekstinktsiya, Δν_½ — cho'qqining yarim kengligi
              </p>
            </div>
          </div>
        </div>

        {/* VALENTLIK TAUTOMERIYASI */}
        <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💫</span>
            Valentlik tautomeriyasi: <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">dinamik shakl</span>
          </h2>
          <div className="bg-violet-950/40 rounded-2xl p-6 md:p-8 border border-violet-700/30">
            <p className="text-violet-100 text-lg leading-relaxed mb-4">
              Ba'zi komplekslarda elektron izomerlari <strong className="text-violet-300">muvozanatda</strong>
              bo'ladi va tashqi sharoit (harorat, yorug'lik, bosim) o'zgarganda bir-biriga o'tadi.
              Bu hodisa <strong className="text-violet-300">valentlik tautomeriyasi</strong>
              (inglizcha: <em>valence tautomerism</em>, VT) deb ataladi va
              <strong className="text-violet-300"> spin crossover</strong> hodisasiga yaqin.
            </p>
            <div className="bg-slate-950/60 rounded-xl p-6 border border-violet-700/30 text-center mb-4">
              <div className="flex items-center justify-center gap-3 flex-wrap font-mono text-base">
                <span className="bg-yellow-950/60 px-3 py-3 rounded-lg border border-yellow-600/50">
                  <span className="text-yellow-400 text-xs">Co³⁺(LS)—SQ</span>
                  <div className="text-xs text-yellow-300 mt-1">Past T</div>
                </span>
                <div className="text-violet-400 flex flex-col items-center">
                  <span className="text-xl">⇌</span>
                  <span className="text-xs text-violet-300">VT</span>
                </div>
                <span className="bg-red-950/60 px-3 py-3 rounded-lg border border-red-600/50">
                  <span className="text-red-400 text-xs">Co²⁺(HS)—Q</span>
                  <div className="text-xs text-red-300 mt-1">Yuqori T</div>
                </span>
              </div>
              <p className="text-blue-200 text-xs mt-3">
                SQ = semikvinon radikali, Q = kinon (neytral); LS = past spin, HS = yuqori spin
              </p>
            </div>
            <p className="text-violet-100 text-sm leading-relaxed">
              Eng klassik VT misoli — <strong className="text-violet-300">kobalt-dioksalen komplekslari</strong>
              ([Co(3,5-DBSQ)₂(3,5-DBCat)] kabi). Bu komplekslar
              <strong className="text-yellow-400"> molekulyar qurilmalar</strong> (xotira, sensorlar,
              qayta yoziladigan materiallar) uchun katta istiqbolga ega.
            </p>
          </div>
        </div>

        {/* ANALITIK USULLAR — teal-300/400 */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Elektron izomerlarni farqlash uchun bir nechta kuchli usul mavjud —
            ular elektron taqsimlanishiga bevosita sezgir:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-teal-300">EPR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng sezgir usul — toq elektronlarni aniqlaydi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Co³⁺—NO₂⁻:</strong> EPR signali yo'q (diamagnit)</li>
                <li>• <strong>Co²⁺—NO₂•:</strong> aniq EPR signali (S=1/2)</li>
                <li>• <strong>g-faktor</strong> — elektron qayerda ekanligini ko'rsatadi</li>
                <li>• Haroratga bog'liq — VT kuzatiladi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-teal-300">Mössbauer spektroskopiya (⁵⁷Fe)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Fe aralashgan komplekslar uchun ideal:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Fe²⁺:</strong> katta izomer siljishi (δ ≈ 1.0 mm/s)</li>
                <li>• <strong>Fe³⁺:</strong> kichik izomer siljishi (δ ≈ 0.4 mm/s)</li>
                <li>• Aralash valentli: <strong>ikkala signal</strong> kuzatiladi</li>
                <li>• Tez almashinuvi — bitta "o'rtacha" signal</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌈</span>
                <h3 className="text-lg font-bold text-teal-300">UV-Vis-NIR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">IVCT cho'qqisini aniqlash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Class II:</strong> NIR (800-2000 nm) diapazonda keng cho'qqi</li>
                <li>• Bu cho'qqi <strong>elektron ko'chishi</strong> (IVCT) natijasi</li>
                <li>• Class III — cho'qqi yo'q (to'liq delokalizatsiya)</li>
                <li>• Class I — ikki alohida spektr (alohida valentliklar)</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen (XRD + XAS)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Metallarning oksidlanish holatini to'g'ridan aniqlash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>XRD:</strong> M—L bog' uzunliklari (qisqa = yuqori oksidlanish)</li>
                <li>• <strong>XAS (XANES):</strong> yaqin struktura — oksidlanish darajasi</li>
                <li>• <strong>EXAFS:</strong> mahalliy muhit (qo'shni atomlar)</li>
                <li>• Haroratli XRD — VT dinamikasini kuzatish</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-sky-900/40 to-indigo-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-sky-100 mb-6 text-sm md:text-base">
            Elektron izomeriya keng tarqalgan — ayniqsa quyidagi tizimlarda:
          </p>

          <div className="space-y-4">
            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">
                🟡 O₂ bilan bog'lanish (gemoglobin modeli)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Fe²⁺—O₂ (end-on)</p>
                  <p className="text-sky-200 text-xs">Oddiy model — Fe²⁺ va neytral O₂</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Fe³⁺—O₂⁻• (superoksid)</p>
                  <p className="text-sky-200 text-xs">Redoks izomer — elektron O₂ ga ko'chgan</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 <strong>Gemoglobinda</strong> aslida ikkinchi shakl ustun (Fe³⁺—O₂⁻•),
                shu sababli EPR signali kuzatiladi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-violet-400 mb-3">
                🟣 Kobalt-dioksalen (VT klassik misol)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Co³⁺(LS)—(SQ⁻)(Cat²⁻)</p>
                  <p className="text-sky-200 text-xs">Past harorat (diamagnit, qora)</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Co²⁺(HS)—(SQ⁻)₂</p>
                  <p className="text-sky-200 text-xs">Yuqori harorat (paramagnit, yashil)</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 <strong>T₁/₂ ≈ 250-320 K</strong> — xona haroratida ikki shakl aralashmasi kuzatiladi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                🔷 Cu²⁺-semikvinon komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Cu²⁺—SQ⁻</p>
                  <p className="text-sky-200 text-xs">Antiferromagnit bog'liq</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Cu⁺—Q (neytral kinon)</p>
                  <p className="text-sky-200 text-xs">Redoks izomer (diamagnit Cu⁺)</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Bu tizimlarda <strong>magnit xususiyatlari</strong> keskin o'zgaradi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-green-400 mb-3">
                🟢 Prussian Blue analoglari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Fe³⁺—CN—Fe²⁺</p>
                  <p className="text-sky-200 text-xs">Odatiy aralash valentli shakl</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Fe²⁺—CN—Fe³⁺</p>
                  <p className="text-sky-200 text-xs">Elektron ko'chgan shakl (IVCT beradi)</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Bu aralash valentli shakl <strong>ko'k rang</strong>ni beradi (IVCT tufayli)
              </p>
            </div>
          </div>
        </div>

        {/* AMALIY AHAMIYAT — violet-400 */}
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Amaliy <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ahamiyat</span>
          </h2>
          <p className="text-violet-100 mb-6 text-sm md:text-base">
            Elektron izomeriyaning zamonaviy fanda katta qo'llanilishi bor:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💾</span>
                <h3 className="text-lg font-bold text-violet-300">Molekulyar xotira</h3>
              </div>
              <p className="text-violet-100 text-sm">
                VT komplekslari ikki barqaror elektron holatga ega bo'lib, ularni
                <strong> 0 va 1 bitlari</strong> sifatida ishlatish mumkin. Harorat yoki yorug'lik bilan
                boshqariladigan qayta yoziladigan materiallar.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-violet-300">Molekulyar elektronika</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Creutz-Taube kabi aralash valentli molekulalar
                <strong> molekulyar simlar</strong> va <strong>molekulyar tranzistorlar</strong> uchun
                istiqbolli. Elektron bir molekuladan ikkinchisiga ko'chadi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔋</span>
                <h3 className="text-lg font-bold text-violet-300">Batareyalar va kataliz</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Aralash valentli materiallar <strong>elektron tashish</strong> uchun ideal.
                <strong> Prussian Blue analoglari</strong> (PBAs) Na-ion batareyalarda katod materiali
                sifatida ishlatiladi. O₂ qaytarish reaksiyalarida (ORR) ham aralash valentli saytlar muhim.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-violet-300">Biologik tizimlar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Fotosinteza (PSII), nafas zanjiri (sitoxromlar), O₂ tashish
                (<strong>gemoglobin</strong>), azot fiksatsiyasi (nitrogenaza) — barchasida
                <strong> aralash valentli klasterlar</strong> (Fe-S, Mn₄CaO₅) elektron ko'chishini amalga oshiradi.
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-sky-900/40 border border-sky-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📚</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">Robin va Day (1967)</h3>
                    <span className="px-2 py-1 bg-sky-600/30 text-sky-300 border border-sky-600/50 rounded-full text-xs">Klassifikatsiya</span>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1967:</strong> Melvyn Robin va Peter Day aralash valentli komplekslarni
                    <strong> Class I, II, III</strong> ga bo'ldi. Bu klassifikatsiya bugungi kungacha
                    elektron izomeriyasining asosiy ramkasi hisoblanadi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">Creutz va Taube (1969)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1983</span>
                  </div>
                  <p className="text-sky-200 text-sm mb-3">
                    <strong>1969:</strong> Carol Creutz (Henry Taube shogirdi)
                    <strong> [(NH₃)₅Ru—pyz—Ru(NH₃)₅]⁵⁺</strong> ni sintez qildi — aralash valentli
                    molekulaning klassik namunasi. Bu ish <strong>molekulyar elektronika</strong>
                    yo'nalishining tug'ilishiga sabab bo'ldi.
                  </p>
                  <p className="text-sky-200 text-sm">
                    <strong>1983:</strong> Henry Taube elektron ko'chishi reaksiyalari bo'yicha
                    <em> Nobel mukofotini</em> oldi (noorganik kimyo).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/40 border border-violet-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧪</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-violet-400">Noel Hush (1967)</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1967:</strong> Avstraliyalik kimyogar Noel Hush IVCT cho'qqilarini
                    tahlil qilish uchun <strong>Hush modelini</strong> ishlab chiqdi. Bu model orqali
                    elektron bog'lanish kuchi (H_ab) to'g'ridan-to'g'ri spektrdan hisoblanadi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-sky-600/10 to-indigo-600/10 border border-sky-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-sky-100 list-decimal list-inside">
            <li>
              Elektron izomeriyasi (redoks izomeriya) — bir xil formulali komplekslarda
              <strong className="text-sky-300"> elektronlarning metall va ligand orasidagi taqsimlanishi</strong>
              farq qiladi.
            </li>
            <li>
              Metall <strong>oksidlanadi yoki qaytariladi</strong>, ligand esa qarama-qarshi yo'nalishda.
              Natijada <strong>turli d-elektron konfiguratsiyalari</strong> hosil bo'ladi.
            </li>
            <li>
              Eng klassik misol: <strong className="text-sky-300">Co³⁺—NO₂⁻ (sariq, diamagnit)</strong>
              va <strong className="text-sky-300">Co²⁺—NO₂• (qizil-jigarrang, paramagnit)</strong>.
            </li>
            <li>
              Creutz-Taube ioni <strong className="text-sky-300">[(NH₃)₅Ru—pyz—Ru(NH₃)₅]⁵⁺</strong> —
              aralash valentli klassik misol (1969).
            </li>
            <li>
              <strong className="text-sky-300">Robin-Day klassifikatsiyasi</strong>:
              Class I (lokal), Class II (IVCT beradi), Class III (delokal).
            </li>
            <li>
              <strong className="text-sky-300">Valentlik tautomeriyasi</strong> (VT) — elektron izomerlari
              orasidagi <strong>muvozanat</strong> (haroratga bog'liq).
            </li>
            <li>
              Farqlash usullari: <strong className="text-sky-300">EPR, Mössbauer (⁵⁷Fe),
              UV-Vis-NIR (IVCT), XAS/XRD</strong>.
            </li>
            <li>
              Amaliy ahamiyati: <strong>molekulyar elektronika, batareyalar (PBAs), kataliz, biologik modellar</strong>.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">⚛️</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Elektron ko'chishini <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda metall va ligand orasidagi elektron ko'chishini,
              Creutz-Taube ionining aralash valentli holatini, Robin-Day Class II ni ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/elektron/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/holat" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← Holat izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/transformatsion" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Transformatsion izomeriya →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Elektron (redoks) izomeriya • Creutz-Taube ioni • Robin & Day (1967), Taube (Nobel 1983)</p>
        </div>
      </footer>
    </main>
  )
}