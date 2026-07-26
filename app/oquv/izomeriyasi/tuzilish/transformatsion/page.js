import Link from "next/link"
export default function TransformatsionIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "[Co(NH₃)₅ONO]Cl₂",
      name: "Nitrito izomer (metastabil)",
      rang: "Qizg'ish-sariq",
      rangColor: "text-orange-400",
      bg: "from-orange-600/10 to-slate-900/30 border-orange-500/30",
      boglanish: "O orqali (κO)",
      barqarorlik: "Past — yorug'lik/issiqlikda nitroga o'tadi",
      lambdaMax: "~490 nm",
      IR: "~1460, ~1060 sm⁻¹",
      izoh: "NO₂⁻ ligandi kislorod atomi orqali Co³⁺ ga bog'langan. Bu holat kinetik mahsulot bo'lib, termodinamik jihatdan kam barqaror. Xona haroratida sekin, yorug'lik ta'sirida esa tez nitro shakliga (N-bog'langan) aylanadi. Bu jarayon qaytmas (irreversible).",
    },
    {
      num: 2,
      formula: "[Co(NH₃)₅NO₂]Cl₂",
      name: "Nitro izomer (barqaror)",
      rang: "Sariq",
      rangColor: "text-yellow-400",
      bg: "from-yellow-600/10 to-slate-900/30 border-yellow-500/30",
      boglanish: "N orqali (κN)",
      barqarorlik: "Yuqori — termodinamik barqaror",
      lambdaMax: "~460 nm",
      IR: "~1420, ~1310 sm⁻¹",
      izoh: "NO₂⁻ ligandi azot atomi orqali bog'langan. N-donor kuchliroq σ-donor bo'lgani uchun Co-N bog'i mustahkam. Bu holat termodinamik mahsulot — transformatsiya shu yo'nalishda boradi. Nitro shakli nitritoga qaytarilishi juda qiyin.",
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
            <span className="text-sky-400 font-semibold">✨ Transformatsion izomeriya</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">✨</span>
                Transformatsion izomeriya
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Yorug'lik yoki issiqlik ta'sirida ligand qayta tuzilishi • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/transformatsion/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
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
              KAM UCHRAYDIGAN TUR • FOTOIZOMERIZATSIYA
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Transformatsion izomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">ligand bir shakldan ikkinchisiga o'tadi</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Transformatsion izomeriyada <strong className="text-sky-300">bir izomer tashqi ta'sir
              (yorug'lik, issiqlik) ostida boshqa izomerga aylanadi</strong>. Bu hodisa ko'pincha
              <strong className="text-sky-300"> bog'lanish izomeriyasi</strong> bilan chambarchas bog'liq —
              ligandning donor atomi o'zgaradi, lekin ligand to'liq ajralmaydi.
              Jarayon <strong className="text-sky-300">intramolekulyar</strong> va ko'pincha
              <strong className="text-sky-300"> qaytmas (irreversible)</strong> bo'ladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💡</div>
                <div className="text-2xl font-extrabold text-sky-300">hν / Δ</div>
                <div className="text-xs text-sky-300 mt-1">Faollashtiruvchi omillar</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-extrabold text-sky-300">ONO→NO₂</div>
                <div className="text-xs text-sky-300 mt-1">Klassik transformatsiya</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-extrabold text-sky-300">Intra</div>
                <div className="text-xs text-sky-300 mt-1">Molekula ichida</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-sky-300">1907</div>
                <div className="text-xs text-sky-300 mt-1">Birinchi kuzatuv</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/transformatsion/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-[360deg] transition-transform duration-700">✨</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-orange-200 text-xs">[Co(NH₃)₅ONO]²⁺</span>
                    {' '}&nbsp;→&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-yellow-200 text-xs">[Co(NH₃)₅NO₂]²⁺</span>
                    {' '}— O-bog'lanishdan N-bog'lanishga o'tish jarayonini ko'ring
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
              <strong className="text-sky-300 text-xl">Transformatsion izomeriya</strong>
              (inglizcha: <em>transformational isomerism</em>) — bir izomer
              <strong className="text-yellow-400"> tashqi energiya manbai</strong> (yorug'lik, issiqlik, bosim)
              ta'sirida <strong className="text-yellow-400"> boshqa izomerga aylanishi</strong>.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Bu hodisa <strong className="text-sky-300">bog'lanish izomeriyasining dinamik shakli</strong>
              hisoblanadi. Farqi shundaki, bog'lanish izomeriyasi ikki alohida moddaning mavjudligini
              tasvirlasa, transformatsion izomeriya <strong className="text-sky-300">ular orasidagi o'tish
              jarayonini</strong> o'rganadi. Ligand to'liq ajralmaydi — faqat
              <strong className="text-sky-300"> bog'lanish atomi o'zgaradi</strong> (intramolekulyar jarayon).
            </p>
          </div>

          {/* TRANSFORMATSION VS BOG'LANISH */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-sky-300 mb-3">⚠️ Bog'lanish vs Transformatsion izomeriya</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                <h4 className="text-sky-400 font-bold mb-2">🔗 Bog'lanish izomeriyasi</h4>
                <p className="text-blue-100 text-xs">Ikki alohida, <strong>barqaror</strong> modda mavjud.</p>
                <p className="text-blue-200 text-xs mt-2">Statik tushuncha — &quot;ikkita izomer bor&quot;</p>
              </div>
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                <h4 className="text-indigo-400 font-bold mb-2">✨ Transformatsion izomeriya</h4>
                <p className="text-blue-100 text-xs">Bir izomer <strong>boshqasiga aylanadi</strong>.</p>
                <p className="text-blue-200 text-xs mt-2">Dinamik tushuncha — &quot;o'tish jarayoni&quot;</p>
              </div>
            </div>
          </div>

          {/* MEXANIZM */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">1️⃣</span>
                <h3 className="font-bold text-sky-300">Energiya yutilishi</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Molekula <strong>foton (hν)</strong> yoki <strong>issiqlik (Δ)</strong> yutadi.
                Elektron hayajonlangan holatga o'tadi.
              </p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">2️⃣</span>
                <h3 className="font-bold text-indigo-300">Bog' uzilishi</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Metall-ligand bog'i <strong>vaqtincha uziladi</strong>, ligand erkin aylanadi.
              </p>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">3️⃣</span>
                <h3 className="font-bold text-blue-300">Qayta bog'lanish</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ligand <strong>boshqa donor atomi</strong> orqali metallga qayta bog'lanadi.
              </p>
            </div>
          </div>
        </div>

        {/* KLASSIK MISOL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">Nitrito → Nitro</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Eng mashhur transformatsion izomeriya misoli —
            <strong className="text-sky-300"> [Co(NH₃)₅ONO]Cl₂</strong> ning
            <strong className="text-sky-300"> [Co(NH₃)₅NO₂]Cl₂</strong> ga aylanishi.
            Bu jarayon <strong className="text-sky-300">1907-yilda</strong> birinchi marta kuzatilgan va
            bugungi kunda eng yaxshi o'rganilgan fotoizomerizatsiya reaksiyasidir.
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
                          {iz.num === 1 ? "Boshlang'ich holat" : "Yakuniy holat"}
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Bog'lanish</div>
                      <div className="text-base md:text-lg font-extrabold text-yellow-400">{iz.boglanish}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">λmax</div>
                      <div className="text-base md:text-lg font-extrabold text-cyan-300">{iz.lambdaMax}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">IR ν(NO₂)</div>
                      <div className="text-xs font-extrabold text-green-300">{iz.IR}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Barqarorlik</div>
                      <div className="text-xs font-extrabold text-orange-300">{iz.barqarorlik.split("—")[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REAKTSIYA SXEMASI */}
        <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            Transformatsiya <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">jarayoni</span>
          </h2>

          <div className="bg-slate-950/60 rounded-2xl p-6 md:p-8 border border-sky-700/30 text-center mb-6">
            <div className="flex items-center justify-center gap-3 flex-wrap font-mono text-base md:text-lg">
              <span className="bg-orange-950/60 px-4 py-3 rounded-lg border border-orange-600/50">
                <span className="text-orange-400">[Co(NH₃)₅ONO]²⁺</span>
                <div className="text-xs text-orange-300 mt-1">Nitrito (qizg'ish)</div>
                <div className="text-xs text-orange-300">κO bog'lanish</div>
              </span>
              <div className="text-sky-400 flex flex-col items-center">
                <span className="text-2xl">→</span>
                <span className="text-xs text-sky-300">hν yoki Δ</span>
              </div>
              <span className="bg-yellow-950/60 px-4 py-3 rounded-lg border border-yellow-600/50">
                <span className="text-yellow-400">[Co(NH₃)₅NO₂]²⁺</span>
                <div className="text-xs text-yellow-300 mt-1">Nitro (sariq)</div>
                <div className="text-xs text-yellow-300">κN bog'lanish</div>
              </span>
            </div>
            <p className="text-sky-200 text-sm mt-4">
              Jarayon <strong className="text-sky-300">qaytmas (irreversible)</strong> — nitro shakli
              termodinamik barqarorroq. Teskari reaksiya (nitro → nitrito) faqat maxsus sharoitlarda mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-900/30 border border-violet-700/40 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-violet-300 mb-3 flex items-center gap-2">
                <span>💡</span> Fotoizomerizatsiya (yorug'lik)
              </h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• <strong>To'lqin uzunligi:</strong> ~350-500 nm (ko'k-yashil)</li>
                <li>• <strong>Kvant unumdorligi:</strong> Φ ≈ 0.1-0.5</li>
                <li>• <strong>Mexanizm:</strong> LMCT (ligand-to-metal charge transfer)</li>
                <li>• <strong>Tezlik:</strong> soniyalar ichida sodir bo'ladi</li>
                <li>• <strong>Harorat:</strong> xona haroratida ham ishlaydi</li>
              </ul>
            </div>

            <div className="bg-amber-900/30 border border-amber-700/40 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                <span>🌡️</span> Termalizomerizatsiya (issiqlik)
              </h3>
              <ul className="text-blue-100 text-sm space-y-2">
                <li>• <strong>Harorat:</strong> ~60-100°C da sezilarli</li>
                <li>• <strong>Aktivatsiya energiyasi:</strong> Ea ≈ 80-100 kJ/mol</li>
                <li>• <strong>Mexanizm:</strong> Dissotsiativ (bog' uzilishi)</li>
                <li>• <strong>Tezlik:</strong> soatlar yoki kunlar</li>
                <li>• <strong>Qattiq holatda:</strong> sekinroq, eritmada tezroq</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ANALITIK USULLAR — teal-300/400 */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">kuzatish mumkin?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Transformatsiya jarayonini real vaqtda kuzatish uchun quyidagi usullar qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-teal-300">UV-Vis spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng oddiy va tez usul — rang o'zgarishini kuzatish:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• λmax siljishi: <strong>490 nm → 460 nm</strong></li>
                <li>• Absorbansiya o'zgarishi vaqt funksiyasi sifatida</li>
                <li>• <strong>Kinetik konstanta</strong> (k) aniqlanadi</li>
                <li>• In-situ yoritish bilan real vaqtda kuzatish</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">IR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Bog'lanish turini aniq belgilash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• ONO cho'qqilari (~1460, ~1060 sm⁻¹) <strong>yo'qoladi</strong></li>
                <li>• NO₂ cho'qqilari (~1420, ~1310 sm⁻¹) <strong>paydo bo'ladi</strong></li>
                <li>• Time-resolved IR — millisekund miqyosida</li>
                <li>• Oraliq holatlarni ham aniqlash mumkin</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔭</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Kristall panjarada atomlar joylashuvi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• Fotokristallografiya — yoritish paytida strukturani olish</li>
                <li>• <strong>Co-O → Co-N</strong> bog' uzunligi o'zgarishi</li>
                <li>• Oraliq holat strukturalari aniqlangan</li>
                <li>• Eng aniq, ammo sekin usul</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-teal-300">NMR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eritmada transformatsiya kinetikasi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>¹⁵N NMR:</strong> nitro va nitrito signallari farqli</li>
                <li>• Vaqtga bog'liq signal intensivligi</li>
                <li>• <strong>EXSY:</strong> almashinuv tezligini o'lchash</li>
                <li>• Suyuq holatda mexanizmni aniqlash</li>
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
            Transformatsion izomeriya faqat NO₂⁻/ONO⁻ da emas, balki boshqa tizimlarda ham kuzatiladi:
          </p>

          <div className="space-y-4">
            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                🔷 SO₂ komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">η¹-SO₂ (S orqali)</p>
                  <p className="text-sky-200 text-xs">Barqaror shakl</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">η²-SO₂ (S,O orqali)</p>
                  <p className="text-sky-200 text-xs">Metastabil — yorug'likda η¹ ga o'tadi</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Ru(II) va Os(II) komplekslarida kuzatiladi — fotokimyoviy xotira qurilmalari uchun istiqbolli
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                🔷 Nitrozil (NO) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">M—NO (N orqali)</p>
                  <p className="text-sky-200 text-xs">Odatiy barqaror shakl</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">M—ON (O orqali)</p>
                  <p className="text-sky-200 text-xs">Metastabil — fotoizomerizatsiya</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 <strong>Natriy nitroprussid</strong> Na₂[Fe(CN)₅NO]·2H₂O — klassik misol,
                metastabil holatlar uzoq vaqt saqlanadi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-amber-400 mb-3">
                🔷 Azobenzol komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">trans-azobenzol</p>
                  <p className="text-sky-200 text-xs">Barqaror, tekis shakl</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">cis-azobenzol</p>
                  <p className="text-sky-200 text-xs">UV yorug'likda hosil bo'ladi, ko'rinadigan nurda qaytadi</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 <strong>Qaytar (reversible)</strong> fotoizomerizatsiya — molekulyar motorlar va switchlar uchun asos
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-green-400 mb-3">
                🔷 Spiropiran / Merosiyanin
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Spiropiran (yopiq)</p>
                  <p className="text-sky-200 text-xs">Rangsiz, UV da ochiladi</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">Merosiyannin (ochiq)</p>
                  <p className="text-sky-200 text-xs">Rangli, ko'rinadigan nurda yopiladi</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 <strong>Fotoxromik materiallar</strong> — quyushdan himoya ko'zoynaklari, optik xotira
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
            Transformatsion izomeriya zamonaviy texnologiyalarda keng qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💾</span>
                <h3 className="text-lg font-bold text-violet-300">Optik xotira qurilmalari</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Ikki barqaror holat (A va B) <strong>0 va 1 bitlari</strong> sifatida ishlatiladi.
                Yorug'lik bilan yozish, boshqa to'lqin uzunligi bilan o'qish.
                <strong> Qayta yoziladigan DVD</strong> va holografik xotira asosi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🕶️</span>
                <h3 className="text-lg font-bold text-violet-300">Fotoxromik materiallar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>Spiropiran</strong> va <strong>azobenzol</strong> asosidagi materiallar
                yorug'lik ta'sirida rangini o'zgartiradi. Quyushdan himoya ko'zoynaklari,
                <strong> aqlli oynalar</strong> (smart windows), sensorlar.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚙️</span>
                <h3 className="text-lg font-bold text-violet-300">Molekulyar motorlar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Qaytar fotoizomerizatsiya <strong>mexanik harakat</strong> hosil qiladi.
                Azobenzol asosidagi molekulyar motorlar yorug'lik bilan aylanadi.
                2016-yil Nobel mukofoti (Feringa) shu sohaga berilgan.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Fotofarmakologiya</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Dori molekulasi <strong>yorug'lik bilan faollashtiriladi</strong>.
                Bir izomer — nofaol, ikkinchisi — faol. Bu dorini
                <strong> aniq joyda va vaqtda</strong> ishga tushirish imkonini beradi
                (masalan, saraton terapiyasida).
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
                <div className="text-4xl">🔗</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">Sophus Jørgensen (1894)</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1894:</strong> Birinchi bo'lib nitro va nitrito komplekslarini sintez qildi.
                    U ikkalasi ham bir xil tarkibga ega, lekin <strong>turli rang</strong> va
                    <strong> turli xususiyatlarga</strong> ega ekanligini kuzatdi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✨</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">Birinchi fotoizomerizatsiya (1907)</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1907:</strong> Nitrito → Nitro transformatsiyasi yorug'lik ta'sirida
                    birinchi marta kuzatildi. Bu <strong>noorganik kimyoda birinchi fotoizomerizatsiya</strong>
                    hodisasi edi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/40 border border-violet-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-violet-400">Ben Feringa (2016)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 2016</span>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>2016:</strong> Ben Feringa, Jean-Pierre Sauvage va Fraser Stoddart
                    <em> molekulyar mashinalar</em> uchun Nobel mukofotini oldi.
                    Ularning ishi <strong>fotoizomerizatsiya asosida ishlaydigan molekulyar motorlar</strong>
                    yaratishga asoslangan.
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
              Transformatsion izomeriya — bir izomer <strong className="text-sky-300">tashqi ta'sir
              (yorug'lik, issiqlik) ostida boshqa izomerga aylanishi</strong>.
            </li>
            <li>
              Bu hodisa <strong className="text-sky-300">bog'lanish izomeriyasining dinamik shakli</strong> —
              ligand to'liq ajralmaydi, faqat donor atomi o'zgaradi.
            </li>
            <li>
              Klassik misol: <strong className="text-sky-300">[Co(NH₃)₅ONO]²⁺ → [Co(NH₃)₅NO₂]²⁺</strong>
              (nitrito → nitro, qizg'ish → sariq).
            </li>
            <li>
              Jarayon odatda <strong className="text-sky-300">qaytmas (irreversible)</strong> —
              nitro shakli termodinamik barqarorroq.
            </li>
            <li>
              Mexanizm: <strong>energiya yutilishi → bog' uzilishi → qayta bog'lanish</strong>
              (boshqa donor atom orqali).
            </li>
            <li>
              Kuzatish usullari: <strong className="text-sky-300">UV-Vis, IR, XRD, NMR</strong>
              (time-resolved variantlari).
            </li>
            <li>
              Amaliy ahamiyati: <strong>optik xotira, fotoxromik materiallar, molekulyar motorlar
              (Nobel 2016), fotofarmakologiya</strong>.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">✨</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Transformatsiyani <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda ONO → NO₂ o'tish jarayonini, bog' uzilishi va qayta bog'lanishni,
              ligandning fazoviy aylanishini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/transformatsion/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/elektron" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← Elektron izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/formal" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Formal izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Transformatsion izomeriya • Nitrito→Nitro • Jørgensen (1894), Feringa (Nobel 2016)</p>
        </div>
      </footer>
    </main>
  )
}