import Link from "next/link"
export default function GidratIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "[Cr(H₂O)₆]Cl₃",
      name: "Geksaakvaxrom(III) xlorid",
      rang: "Binafsha",
      rangColor: "text-purple-400",
      bg: "from-purple-600/10 to-purple-900/30 border-purple-500/30",
      ichkiH2O: 6,
      tashqiH2O: 0,
      ichkiCl: 0,
      tashqiCl: 3,
      ionlar: 4,
      AgCl: 3,
      izoh: "Barcha 6 ta suv to'g'ridan-to'g'ri Cr³⁺ ga bog'langan. 3 ta Cl⁻ esa tashqi sferada kristall panjarada joylashgan. Suvda eritilganda 4 ta ionga to'liq dissotsiatsiyalanadi.",
    },
    {
      num: 2,
      formula: "[CrCl(H₂O)₅]Cl₂·H₂O",
      name: "Xloropentaakvaxrom(III) xlorid monogidrat",
      rang: "Och yashil",
      rangColor: "text-green-400",
      bg: "from-green-600/10 to-green-900/30 border-green-500/30",
      ichkiH2O: 5,
      tashqiH2O: 1,
      ichkiCl: 1,
      tashqiCl: 2,
      ionlar: 3,
      AgCl: 2,
      izoh: "Ichki sferada 5 ta suv va 1 ta xlorid ligand. Tashqi sferada 2 ta Cl⁻ ioni va 1 ta kristallizatsion suv. 1 ta suv oson ajraladi.",
    },
    {
      num: 3,
      formula: "[CrCl₂(H₂O)₄]Cl·2H₂O",
      name: "Dixlorotetraakvaxrom(III) xlorid digidrat",
      rang: "To'q yashil",
      rangColor: "text-emerald-400",
      bg: "from-emerald-600/10 to-emerald-900/30 border-emerald-500/30",
      ichkiH2O: 4,
      tashqiH2O: 2,
      ichkiCl: 2,
      tashqiCl: 1,
      ionlar: 2,
      AgCl: 1,
      izoh: "Ichki sferada 4 ta suv va 2 ta xlorid ligand. Tashqi sferada 1 ta Cl⁻ ioni va 2 ta kristallizatsion suv. Faqat 1 ta Cl⁻ AgNO₃ bilan reaksiyaga kirishadi.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv/izomeriyasi" className="hover:text-purple-300">Izomeriyasi</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv/izomeriyasi/tuzilish" className="hover:text-purple-300">Tuzilish</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">💧 Gidrat izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                <span className="text-3xl">💧</span>
                Gidrat izomeriyasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Suv molekulalarining ichki/tashqi sferada joylashishi • Asosiy tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/gidrat/3d" className="text-xs bg-cyan-600/80 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1">
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
        <div className="bg-gradient-to-br from-blue-900/60 to-cyan-900/60 border border-blue-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-600/30 rounded-full text-xs font-semibold text-blue-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ASOSIY IZOMERIYA TURI • WERNER 1893
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Gidrat izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">suvning joylashuvi o'zgaradi</span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mb-8 leading-relaxed">
              Gidrat izomeriyasida <strong className="text-cyan-300">suv molekulalari</strong> ichki koordinatsion sfera
              va tashqi kristallizatsion sfera o'rtasida joylashishi farq qiladi.
              Yalpi formula bir xil bo'lsa-da, moddaning <strong className="text-cyan-300">rangi, xossalari va reaksiyasi</strong> har xil bo'ladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">💧</div>
                <div className="text-2xl font-extrabold text-cyan-300">6</div>
                <div className="text-xs text-blue-300 mt-1">Suv molekulasi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-2xl font-extrabold text-cyan-300">3</div>
                <div className="text-xs text-blue-300 mt-1">Izomer ranglari</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-cyan-300">1893</div>
                <div className="text-xs text-blue-300 mt-1">Werner kashfiyoti</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-cyan-300">KS=6</div>
                <div className="text-xs text-blue-300 mt-1">Koordinatsion son</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY TA'RIF */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-blue-100 text-lg leading-relaxed mb-4">
              <strong className="text-cyan-300 text-xl">Gidrat izomeriya</strong> — kompleks birikmaning tarkibidagi
              <strong className="text-yellow-400"> suv molekulalarining ichki (koordinatsion) va tashqi (kristallizatsion) sferada
              joylashishi</strong> farq qiladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-blue-200 leading-relaxed">
              Bu hodisa asosan <strong className="text-cyan-300">akvakomplekslar</strong> (tarkibida H₂O bor komplekslar) uchun
              xos bo'lib, bir xil yalpi formulaga ega moddalar suvning joylashuviga qarab butunlay boshqa moddalarga aylanadi.
            </p>
          </div>

          {/* ICHKI VS TASHQI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔵</span>
                <h3 className="text-xl font-bold text-cyan-300">Ichki sfera</h3>
              </div>
              <p className="text-blue-100 mb-4 text-sm">
                <strong>Koordinatsion sfera</strong> — to'g'ridan-to'g'ri markaziy metall atomiga bog'langan ligandlar guruhi.
                Kvadrat qavslar ichida yoziladi: <code className="bg-blue-950/60 px-2 py-0.5 rounded text-cyan-300">[Cr(H₂O)₆]³⁺</code>
              </p>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Metall bilan <strong>koordinatsion bog'</strong> hosil qiladi</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Dissotsiatsiyada <strong>kompleks ion</strong> sifatida ajraladi</li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Osonlikcha reaksiyaga <strong>kirishmaydi</strong></li>
                <li className="flex gap-2"><span className="text-cyan-400">✓</span> Qizdirishda <strong>yuqori haroratda</strong> (150-250°C) chiqadi</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🟠</span>
                <h3 className="text-xl font-bold text-amber-300">Tashqi sfera</h3>
              </div>
              <p className="text-blue-100 mb-4 text-sm">
                <strong>Kristallizatsion sfera</strong> — kompleks ion bilan ion bog' orqali bog'langan erkin ionlar va suv molekulalari.
                Kvadrat qavslardan <strong>tashqarida</strong> yoziladi.
              </p>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Kompleks ion bilan <strong>ion bog'</strong> hosil qiladi</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Dissotsiatsiyada <strong>erkin ion</strong> sifatida ajraladi</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> <strong>Oson reaksiyaga</strong> kirishadi (cho'ktirish mumkin)</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Qizdirishda <strong>past haroratda</strong> (100°C) chiqadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">CrCl₃·6H₂O</span>
          </h2>
          <p className="text-blue-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Xrom(III) xlorid geksagidrat — gidrat izomeriyaning <strong className="text-cyan-300">eng mashhur va ko'rgazmali misoli</strong>.
            Bir xil yalpi formulaga ega <strong className="text-cyan-300">3 ta turli rangli modda</strong> mavjud.
            Har birini tahlil qilamiz:
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
                        <span className="text-xs text-blue-300 font-bold bg-blue-900/40 px-3 py-1 rounded-full">
                          Izomer {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-purple-600/20 border border-purple-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-cyan-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-blue-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-blue-300 mb-1">Ichki H₂O</div>
                      <div className="text-2xl font-extrabold text-cyan-300">{iz.ichkiH2O}</div>
                    </div>
                    <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-blue-300 mb-1">Tashqi H₂O</div>
                      <div className="text-2xl font-extrabold text-amber-300">{iz.tashqiH2O}</div>
                    </div>
                    <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-blue-300 mb-1">Ichki Cl⁻</div>
                      <div className="text-2xl font-extrabold text-cyan-300">{iz.ichkiCl}</div>
                    </div>
                    <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-blue-300 mb-1">Tashqi Cl⁻</div>
                      <div className="text-2xl font-extrabold text-amber-300">{iz.tashqiCl}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-950/60 rounded-xl p-4 border border-blue-700/30">
                      <div className="text-xs text-blue-300 mb-2">🧪 AgNO₃ bilan</div>
                      <div className="text-xl font-bold text-yellow-400">{iz.AgCl} mol AgCl ↓</div>
                      <p className="text-xs text-blue-200 mt-1">Tashqi sferadagi Cl⁻ soni = cho'kma miqdori</p>
                    </div>
                    <div className="bg-blue-950/60 rounded-xl p-4 border border-blue-700/30">
                      <div className="text-xs text-blue-300 mb-2">⚡ Ionlar soni</div>
                      <div className="text-xl font-bold text-cyan-300">{iz.ionlar} ta ion</div>
                      <p className="text-xs text-blue-200 mt-1">Dissotsiatsiyadan keyin hosil bo'ladigan ionlar</p>
                    </div>
                    <div className="bg-blue-950/60 rounded-xl p-4 border border-blue-700/30">
                      <div className="text-xs text-blue-300 mb-2">🔌 Elektrolit turi</div>
                      <div className="text-xl font-bold text-green-400">1:{iz.tashqiCl}</div>
                      <p className="text-xs text-blue-200 mt-1">Kation:anion nisbati</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TUSHUNARSIZ TUShUNCHALAR */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🎓</span>
            Muhim <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">tushunchalar</span>
          </h2>
          <p className="text-yellow-100 mb-6 text-sm md:text-base">
            Gidrat izomeriyasini to'liq tushunish uchun quyidagi atamalarni bilish kerak:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>🔢</span> Koordinatsion son (KS)
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Markaziy metall atomiga to'g'ridan-to'g'ri bog'langan ligandlar soni.
                Cr³⁺ uchun <strong>KS = 6</strong> (oktaedr geometriya). Barcha 3 ta izomerda ham KS = 6,
                faqat ligandlar tarkibi o'zgaradi.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>🧪</span> Ambidentat emas
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                H₂O <strong>monodentat</strong> ligand — faqat kislorod orqali bog'lanadi.
                Shu sababli gidrat izomeriya <em>bog'lanish izomeriyasi</em> emas,
                balki <strong>suv va anionning joylashuvi</strong> bilan bog'liq.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>🎨</span> d-d o'tishlar
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Cr³⁺ ning <strong>d³ elektron konfiguratsiyasi</strong> mavjud. Ligand maydonining kuchi
                (H₂O va Cl⁻ nisbati) o'zgarganda, yutilgan yorug'lik to'lqin uzunligi o'zgaradi va
                <strong> rang o'zgaradi</strong> (binafsha → yashil).
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>⚡</span> Arrhenius nazariyasi
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Elektr o'tkazuvchanlik ionlar soniga to'g'ri proporsional.
                4 ta ion (izomer 1) 2 ta iondan (izomer 3) <strong>2 marta yaxshi</strong> elektr o'tkazadi.
                Bu izomerlarni farqlashning yana bir usuli.
              </p>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Uchala izomerni <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-purple-400 text-sm">Izomer 1 (Binafsha)</th>
                  <th className="py-3 px-4 text-green-400 text-sm">Izomer 2 (Och yashil)</th>
                  <th className="py-3 px-4 text-emerald-400 text-sm">Izomer 3 (To'q yashil)</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-white">Formula</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">[Cr(H₂O)₆]Cl₃</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">[CrCl(H₂O)₅]Cl₂·H₂O</td>
                  <td className="py-3 px-4 font-mono text-cyan-300">[CrCl₂(H₂O)₄]Cl·2H₂O</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ichki H₂O</td>
                  <td className="py-3 px-4">6 ta</td>
                  <td className="py-3 px-4">5 ta</td>
                  <td className="py-3 px-4">4 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Tashqi H₂O</td>
                  <td className="py-3 px-4">0 ta</td>
                  <td className="py-3 px-4">1 ta</td>
                  <td className="py-3 px-4">2 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ichki Cl⁻ (ligand)</td>
                  <td className="py-3 px-4">0 ta</td>
                  <td className="py-3 px-4">1 ta</td>
                  <td className="py-3 px-4">2 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Tashqi Cl⁻ (ion)</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">3 ta</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">2 ta</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">1 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">AgNO₃ → AgCl ↓</td>
                  <td className="py-3 px-4 text-green-400 font-bold">3 mol</td>
                  <td className="py-3 px-4 text-green-400 font-bold">2 mol</td>
                  <td className="py-3 px-4 text-green-400 font-bold">1 mol</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ionlar soni</td>
                  <td className="py-3 px-4">4 ta (1:3)</td>
                  <td className="py-3 px-4">3 ta (1:2)</td>
                  <td className="py-3 px-4">2 ta (1:1)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Qizdirishda suv</td>
                  <td className="py-3 px-4">Barchasi 150°C+</td>
                  <td className="py-3 px-4">1 ta 100°C, 5 ta 150°C+</td>
                  <td className="py-3 px-4">2 ta 100°C, 4 ta 150°C+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALITIK USULLAR */}
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <p className="text-green-100 mb-6 text-sm md:text-base">
            Uchala izomer ko'rinishi va ba'zi xossalari bilan farqlanadi. Laboratoriyada quyidagi usullar qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧪</span>
                <h3 className="text-lg font-bold text-green-300">AgNO₃ cho'ktirish</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Kumush nitrat qo'shilganda <strong>faqat tashqi sferadagi Cl⁻</strong> cho'kadi:
              </p>
              <code className="block bg-green-950/60 rounded-lg p-3 text-xs text-cyan-300 font-mono">
                [Cr(H₂O)₆]Cl₃ + 3AgNO₃ → 3AgCl↓<br />
                [CrCl₂(H₂O)₄]Cl·2H₂O + AgNO₃ → AgCl↓
              </code>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-green-300">Elektr o'tkazuvchanlik (Λm)</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Ionlar soni ko'p bo'lsa, o'tkazuvchanlik yuqori:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>Izomer 1</strong> (1:4): ~430 S·cm²/mol</li>
                <li>• <strong>Izomer 2</strong> (1:3): ~270 S·cm²/mol</li>
                <li>• <strong>Izomer 3</strong> (1:2): ~130 S·cm²/mol</li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌡️</span>
                <h3 className="text-lg font-bold text-green-300">Termogravimetriya (TGA)</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Qizdirilganda suvning ajralish haroratini kuzatish:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>~100°C:</strong> Tashqi sferadagi (kristall) suv</li>
                <li>• <strong>150-250°C:</strong> Ichki sferadagi (koordinatsion) suv</li>
                <li>• Har bir izomerda alohida bosqichlar ko'rinadi</li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-green-300">IR-spektroskopiya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Suv va bog'larning tebranish chastotalari farqlanadi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>ν(O-H):</strong> 3400-3500 cm⁻¹ (suv)</li>
                <li>• <strong>ν(Cr-O):</strong> 500-600 cm⁻¹ (koordinatsion bog')</li>
                <li>• <strong>ν(Cr-Cl):</strong> 300-400 cm⁻¹ (ichki Cl⁻)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-blue-100 mb-6 text-sm md:text-base">
            Gidrat izomeriya faqat CrCl₃·6H₂O da emas, balki boshqa metallarning akvakomplekslarida ham uchraydi:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-950/40 rounded-2xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-bold text-pink-400 mb-3">
                💗 CoCl₃·6H₂O — Kobalt(III) xlorid geksagidrat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-blue-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(H₂O)₆]Cl₃</p>
                  <p className="text-blue-200">Pushti-qizil</p>
                </div>
                <div className="bg-blue-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[CoCl(H₂O)₅]Cl₂·H₂O</p>
                  <p className="text-blue-200">To'q qizil-binafsha</p>
                </div>
                <div className="bg-blue-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[CoCl₂(H₂O)₄]Cl·2H₂O</p>
                  <p className="text-blue-200">Ko'k-binafsha</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-950/40 rounded-2xl p-6 border border-blue-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                💙 CuSO₄·5H₂O — Mis(II) sulfat pentagidrat
              </h3>
              <p className="text-blue-100 text-sm mb-3">
                Bu misolda faqat 5 ta suv bor, shuning uchun gidrat izomerlar kamroq:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cu(H₂O)₄]SO₄·H₂O</p>
                  <p className="text-blue-200">Ko'k (oddiy mis kuporosi)</p>
                  <p className="text-xs text-blue-300 mt-1">4 ta ichki H₂O + 1 ta tashqi H₂O</p>
                </div>
                <div className="bg-blue-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cu(H₂O)₃SO₄]·2H₂O</p>
                  <p className="text-blue-200">Kam uchraydigan shakl</p>
                  <p className="text-xs text-blue-300 mt-1">SO₄²⁻ ham ichki sferada</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyot</span>
          </h2>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h3 className="text-xl font-bold text-amber-400">Alfred Werner (1893)</h3>
                  <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                </div>
                <p className="text-purple-200 text-sm mb-3">
                  <strong>1893:</strong> Werner yoshligida (26 yoshda) koordinatsion nazariyani e'lon qildi.
                  U CrCl₃·6H₂O ni uch xil rangli shaklda ko'rib, bu bir xil formulaga ega <strong>uchta turli modda</strong> ekanligini isbotladi.
                </p>
                <p className="text-purple-200 text-sm mb-3">
                  <strong>G'oyaning mohiyati:</strong> Werner davrida hali koordinatsion sfera tushunchasi yo'q edi.
                  Barcha olimlar CrCl₃·6H₂O ni bitta modda deb hisoblashgan. Werner esa
                  <strong> ichki sfera (to'g'ridan bog'langan)</strong> va <strong>tashqi sfera (kristallardagi)</strong> tushunchasini kiritdi.
                </p>
                <p className="text-purple-200 text-sm">
                  <strong>Ahamiyati:</strong> Bu kashfiyot <strong>koordinatsion kimyo</strong> fanining tug'ilishi edi.
                  Werner 1913-yilda <em>noorganik kimyo bo'yicha birinchi Nobel mukofotini</em> oldi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-blue-100 list-decimal list-inside">
            <li>
              Gidrat izomeriya — <strong className="text-cyan-300">suv molekulalarining ichki/tashqi sferada</strong>
              joylashishi farq qiladigan tuzilish izomeriyasi turi.
            </li>
            <li>
              CrCl₃·6H₂O — klassik misol, <strong className="text-cyan-300">3 ta rangli izomer</strong>
              (binafsha, och yashil, to'q yashil) mavjud.
            </li>
            <li>
              AgNO₃ bilan har xil miqdorda AgCl cho'kmasi (<strong className="text-cyan-300">3, 2, 1 mol</strong>)
              izomerlarni farqlashning ishonchli usuli.
            </li>
            <li>
              Elektr o'tkazuvchanlik, TGA va IR-spektroskopiya ham farqlashda ishlatiladi.
            </li>
            <li>
              Bu hodisa <strong className="text-cyan-300">akvakomplekslar</strong> uchun xarakterli va
              Werner koordinatsion nazariyasining asosiy isbotlaridan biri.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-purple-600/20 border border-blue-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">💧</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Uchala izomerni <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda suv molekulalarining ichki va tashqi sferada qanday joylashganini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/gidrat/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/ionlanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Ionlanish izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/boglanish" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-bold text-center">
            Bog'lanish izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Gidrat izomeriyasi • CrCl₃·6H₂O • Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}