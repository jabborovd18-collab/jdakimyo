import Link from "next/link"
export default function HolatIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "Yuqori spin (HS)",
      name: "High-spin holat",
      rang: "To'q qizil",
      rangColor: "text-red-400",
      bg: "from-red-600/10 to-slate-900/30 border-red-500/30",
      maydonKuchi: "Kuchsiz ligand maydoni",
      deltaP: "Δo < P",
      elektronlar: "Maksimal toq elektronlar",
      magnetizm: "Kuchli paramagnit",
      misol: "[Fe(H₂O)₆]²⁺ — 4 ta toq e⁻",
      izoh: "Kuchsiz maydon ligandlari (H₂O, F⁻, Cl⁻) bilan kuzatiladi. Kristall maydon bo'linish energiyasi (Δo) elektron juftlanish energiyasidan (P) kichik, shuning uchun elektronlar yuqori energiyali eg orbitallariga ham bittadan joylashadi — Hund qoidasi bo'yicha maksimal toq elektron hosil bo'ladi.",
    },
    {
      num: 2,
      formula: "Quyi spin (LS)",
      name: "Low-spin holat",
      rang: "To'q sariq",
      rangColor: "text-yellow-400",
      bg: "from-yellow-600/10 to-slate-900/30 border-yellow-500/30",
      maydonKuchi: "Kuchli ligand maydoni",
      deltaP: "Δo > P",
      elektronlar: "Minimal toq elektronlar",
      magnetizm: "Kuchsiz paramagnit yoki diamagnit",
      misol: "[Fe(CN)₆]⁴⁻ — 0 ta toq e⁻",
      izoh: "Kuchli maydon ligandlari (CN⁻, CO, NO₂⁻, phen) bilan kuzatiladi. Δo > P bo'lgani uchun elektronlar past energiyali t₂g orbitallarida juftlanishni afzal ko'radi. Natijada toq elektronlar soni minimal bo'ladi, kompleks kuchsiz magnit xossasiga ega bo'ladi.",
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
            <span className="text-sky-400 font-semibold">🎯 Holat izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">🎯</span>
                Holat izomeriyasi
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Spin holati (yuqori/quyi spin) farqi • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/holat/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
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
              KAM UCHRAYDIGAN TUR • SPIN STATE ISOMERISM
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Holat izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">spin holati — yuqori yoki quyi</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Holat izomeriyasida (yoki <strong className="text-sky-300">spin holati izomeriyasi</strong>)
              bir xil tarkibli kompleks <strong className="text-sky-300">turli spin holatlarida</strong>
              mavjud bo'lishi mumkin. Bu hodisa asosan <strong className="text-sky-300">3d metallarning
              d⁴, d⁵, d⁶, d⁷ konfiguratsiyalarida</strong> kuzatiladi va kristall maydon nazariyasi
              (Crystal Field Theory) asosida tushuntiriladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-sky-300">d⁴-d⁷</div>
                <div className="text-xs text-sky-300 mt-1">Metall konfiguratsiyalari</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚖️</div>
                <div className="text-2xl font-extrabold text-sky-300">Δo vs P</div>
                <div className="text-xs text-sky-300 mt-1">Energiya raqobati</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧲</div>
                <div className="text-2xl font-extrabold text-sky-300">μeff</div>
                <div className="text-xs text-sky-300 mt-1">Magnit moment farqi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🌡️</div>
                <div className="text-2xl font-extrabold text-sky-300">SCO</div>
                <div className="text-xs text-sky-300 mt-1">Spin crossover</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/holat/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-180 transition-transform duration-700">🎯</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-red-200 text-xs">[Fe(H₂O)₆]²⁺ (HS)</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-yellow-200 text-xs">[Fe(CN)₆]⁴⁻ (LS)</span>
                    {' '}— d-orbitallarning bo'linishi va elektronlarning joylashuvini ko'ring
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
              <strong className="text-sky-300 text-xl">Holat izomeriyasi</strong>
              (inglizcha: <em>spin state isomerism</em>) — bir xil tarkibli kompleks birikmaning
              <strong className="text-yellow-400"> ikki xil spin holatida</strong> mavjud bo'lishi.
              Bunda molekulaning kimyoviy formulasi o'zgarmaydi, faqat
              <strong className="text-sky-300"> elektronlarning d-orbitallar bo'yicha taqsimlanishi</strong>
              farq qiladi.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Bu hodisa <strong className="text-sky-300">Kristall maydon nazariyasi</strong> (Crystal Field Theory, CFT)
              bilan tushuntiriladi. Oktaedrik maydonda 5 ta d-orbital ikki guruhga bo'linadi:
              <strong className="text-sky-300"> t₂g (past energiya, 3 orbital)</strong> va
              <strong className="text-sky-300"> e_g (yuqori energiya, 2 orbital)</strong>.
              Energiya farqi <strong className="text-yellow-400">Δo</strong> (oktaedrik bo'linish energiyasi)
              deb ataladi.
            </p>
          </div>

          {/* Δo VS P — KALIT KONSEPSIYA */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              Δo va P — ikki energiya raqobati
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-900/30 rounded-xl p-5 border border-blue-700/30">
                <h4 className="text-sky-400 font-bold mb-2">Δo — Kristall maydon bo'linish energiyasi</h4>
                <p className="text-blue-100 text-sm mb-2">
                  Elektronni <strong>t₂g dan e_g ga</strong> ko'chirish uchun kerakli energiya.
                </p>
                <ul className="text-blue-200 text-xs space-y-1">
                  <li>• Kuchli maydon ligandlari → <strong>katta Δo</strong></li>
                  <li>• Kuchsiz maydon ligandlari → <strong>kichik Δo</strong></li>
                  <li>• Spektrokimyoviy qatorga bog'liq</li>
                </ul>
              </div>
              <div className="bg-indigo-900/30 rounded-xl p-5 border border-indigo-700/30">
                <h4 className="text-indigo-400 font-bold mb-2">P — Elektron juftlanish energiyasi</h4>
                <p className="text-blue-100 text-sm mb-2">
                  Ikkita elektronni <strong>bir orbitalda juftlashtirish</strong> uchun kerakli energiya.
                </p>
                <ul className="text-blue-200 text-xs space-y-1">
                  <li>• Elektron-elektron itarish kuchi</li>
                  <li>• Metall turiga bog'liq</li>
                  <li>• Odatda 15,000-30,000 sm⁻¹ oralig'ida</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-slate-900/50 rounded-xl p-4 border border-sky-700/30 text-center">
              <p className="text-sky-200 text-sm">
                <strong className="text-yellow-400">Qoida:</strong> Agar <span className="font-mono text-sky-300">Δo &lt; P</span> →
                <strong className="text-red-400"> yuqori spin (HS)</strong> |
                Agar <span className="font-mono text-sky-300">Δo &gt; P</span> →
                <strong className="text-yellow-400"> quyi spin (LS)</strong>
              </p>
            </div>
          </div>

          {/* SPEKTROKIMYOVIY QATOR */}
          <div className="bg-gradient-to-br from-sky-900/40 to-indigo-900/40 border border-sky-700/40 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-sky-300 mb-3">📊 Spektrokimyoviy qator (ligand maydon kuchi)</h3>
            <div className="flex flex-wrap gap-2 items-center text-xs mb-3">
              <span className="text-red-400 font-bold">Kuchsiz maydon:</span>
              <span className="bg-red-950/50 px-2 py-1 rounded font-mono">I⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-red-950/50 px-2 py-1 rounded font-mono">Br⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-orange-950/50 px-2 py-1 rounded font-mono">Cl⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-orange-950/50 px-2 py-1 rounded font-mono">F⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-amber-950/50 px-2 py-1 rounded font-mono">OH⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-yellow-950/50 px-2 py-1 rounded font-mono">H₂O</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-green-950/50 px-2 py-1 rounded font-mono">NH₃</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-teal-950/50 px-2 py-1 rounded font-mono">en</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-cyan-950/50 px-2 py-1 rounded font-mono">NO₂⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-blue-950/50 px-2 py-1 rounded font-mono">phen</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-indigo-950/50 px-2 py-1 rounded font-mono">CN⁻</span>
              <span className="text-sky-400">&lt;</span>
              <span className="bg-purple-950/50 px-2 py-1 rounded font-mono">CO</span>
              <span className="text-yellow-400 font-bold">:Kuchli maydon</span>
            </div>
            <p className="text-blue-200 text-xs">
              <strong className="text-sky-300">Qoida:</strong> Qatorning chap tomonidagi ligandlar kuchsiz maydon (yuqori spin),
              o'ng tomonidagilar kuchli maydon (quyi spin) beradi.
            </p>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Ikki <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">spin holati</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Keling, ikkala holatni batafsil ko'rib chiqamiz. Fe²⁺ (d⁶) misolida — eng klassik holat:
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
                          Holat {iz.num}
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

                  {/* Orbital diagramma */}
                  <div className="bg-slate-950/60 border border-sky-700/50 rounded-2xl p-5 mb-6">
                    <div className="text-xs text-sky-300 mb-3 font-bold">⚛️ d-ORBITALLAR TAQSIMOTI:</div>
                    <div className="grid grid-cols-2 gap-4 font-mono">
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-sky-700/30">
                        <div className="text-xs text-sky-300 mb-2">e_g (yuqori)</div>
                        <div className="flex gap-2 justify-center mb-3">
                          <div className="w-8 h-12 border-2 border-sky-500 rounded flex flex-col justify-end">
                            {iz.num === 1 ? (
                              <>
                                <div className="text-red-400 text-center text-xs">↑</div>
                                <div className="text-red-400 text-center text-xs">↓</div>
                              </>
                            ) : (
                              <div className="text-slate-600 text-center text-xs">·</div>
                            )}
                          </div>
                          <div className="w-8 h-12 border-2 border-sky-500 rounded flex flex-col justify-end">
                            {iz.num === 1 ? (
                              <>
                                <div className="text-red-400 text-center text-xs">↑</div>
                                <div className="text-red-400 text-center text-xs">↓</div>
                              </>
                            ) : (
                              <div className="text-slate-600 text-center text-xs">·</div>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-sky-300 mb-2">t₂g (past)</div>
                        <div className="flex gap-2 justify-center">
                          <div className="w-8 h-12 border-2 border-sky-500 rounded flex flex-col justify-end">
                            <div className="text-yellow-400 text-center text-xs">↑</div>
                            <div className="text-yellow-400 text-center text-xs">↓</div>
                          </div>
                          <div className="w-8 h-12 border-2 border-sky-500 rounded flex flex-col justify-end">
                            <div className="text-yellow-400 text-center text-xs">↑</div>
                            <div className="text-yellow-400 text-center text-xs">↓</div>
                          </div>
                          <div className="w-8 h-12 border-2 border-sky-500 rounded flex flex-col justify-end">
                            {iz.num === 1 ? (
                              <div className="text-red-400 text-center text-xs">↑·</div>
                            ) : (
                              <>
                                <div className="text-yellow-400 text-center text-xs">↑</div>
                                <div className="text-yellow-400 text-center text-xs">↓</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-sky-700/30 flex flex-col justify-center">
                        <div className="text-xs text-sky-300 mb-2">{iz.maydonKuchi}</div>
                        <div className="text-xl font-bold text-yellow-400 mb-2">{iz.deltaP}</div>
                        <div className="text-xs text-blue-200 mb-2">{iz.misol}</div>
                        <div className="text-xs text-green-400">{iz.magnetizm}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Toq e⁻ soni</div>
                      <div className="text-2xl font-extrabold text-yellow-400">{iz.num === 1 ? "4" : "0"}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">μeff (μB)</div>
                      <div className="text-2xl font-extrabold text-cyan-300">{iz.num === 1 ? "~4.9" : "0"}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Rang</div>
                      <div className="text-sm font-extrabold text-orange-300">{iz.num === 1 ? "Och yashil" : "Sariq"}</div>
                    </div>
                    <div className="bg-sky-950/50 border border-sky-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-sky-300 mb-1">Bog' uzunligi</div>
                      <div className="text-sm font-extrabold text-green-400">{iz.num === 1 ? "Uzunroq" : "Qisqaroq"}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fe²⁺ BATAFSIL */}
        <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            Eng <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">klassik misol: Fe²⁺ (d⁶)</span>
          </h2>

          <p className="text-sky-100 text-lg mb-6 leading-relaxed">
            Temir(II) komplekslari — spin holati izomeriyasining <strong className="text-sky-300">eng keng tarqalgan
            va yaxshi o'rganilgan</strong> misollaridir. Keling, ikki xil Fe²⁺ kompleksini taqqoslaymiz:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-red-900/20 border border-red-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-2 flex items-center gap-2">
                <span>🔴</span> [Fe(H₂O)₆]²⁺ — Yuqori spin
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">geksaakvatemir(II) kationi</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ <strong>H₂O — kuchsiz maydon</strong> ligandi</li>
                <li>✅ <strong>Δo &lt; P</strong> — elektronlar juftlashmaydi</li>
                <li>✅ Elektron konfiguratsiya: <strong>t₂g⁴ e_g²</strong></li>
                <li>✅ <strong>4 ta toq elektron</strong> (paramagnit)</li>
                <li>✅ μeff ≈ 4.9-5.3 μB</li>
                <li>✅ Och yashil rangli eritma</li>
                <li>✅ <strong>Uzun Fe-O bog'lari</strong> (~2.12 Å)</li>
              </ul>
              <div className="bg-red-950/50 rounded-xl p-4 text-sm text-blue-100 border border-red-700/30">
                <strong className="text-red-300">Sabab:</strong> Kichik Δo tufayli elektronlar
                <em> Hund qoidasi bo'yicha</em> maksimal spin bilan joylashadi.
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-2 flex items-center gap-2">
                <span>🟡</span> [Fe(CN)₆]⁴⁻ — Quyi spin
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">geksasiyanoferrat(II) anioni</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ <strong>CN⁻ — kuchli maydon</strong> ligandi</li>
                <li>✅ <strong>Δo &gt; P</strong> — elektronlar juftlashadi</li>
                <li>✅ Elektron konfiguratsiya: <strong>t₂g⁶ e_g⁰</strong></li>
                <li>✅ <strong>0 ta toq elektron</strong> (diamagnit)</li>
                <li>✅ μeff = 0 μB</li>
                <li>✅ Sariq rangli kristallar</li>
                <li>✅ <strong>Qisqa Fe-C bog'lari</strong> (~1.92 Å)</li>
              </ul>
              <div className="bg-yellow-950/50 rounded-xl p-4 text-sm text-blue-100 border border-yellow-700/30">
                <strong className="text-yellow-300">Sabab:</strong> Katta Δo tufayli barcha 6 ta elektron
                past energiyali t₂g orbitallarida juftlashadi.
              </div>
            </div>
          </div>
        </div>

        {/* SPIN CROSSOVER */}
        <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💫</span>
            Spin crossover <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">(SCO)</span>
          </h2>
          <div className="bg-violet-950/40 rounded-2xl p-6 md:p-8 border border-violet-700/30">
            <p className="text-violet-100 text-lg leading-relaxed mb-4">
              Ba'zi komplekslarda <strong className="text-violet-300">harorat, bosim yoki yorug'lik</strong>
              ta'sirida HS va LS holatlari <strong className="text-violet-300">o'zaro o'tishi</strong> mumkin.
              Bu hodisa <strong className="text-violet-300">spin crossover</strong> (spin o'tishi) deb ataladi
              va zamonaviy materialshunoslikda katta ahamiyatga ega.
            </p>
            <div className="bg-slate-950/60 rounded-xl p-6 border border-violet-700/30 text-center mb-4">
              <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-lg">
                <span className="bg-red-950/60 px-4 py-3 rounded-lg border border-red-600/50">
                  <span className="text-red-400">HS (yuqori spin)</span>
                  <div className="text-xs text-red-300 mt-1">paramagnit</div>
                </span>
                <div className="text-violet-400 flex flex-col items-center">
                  <span className="text-2xl">⇌</span>
                  <span className="text-xs text-violet-300">T₁/₂</span>
                </div>
                <span className="bg-yellow-950/60 px-4 py-3 rounded-lg border border-yellow-600/50">
                  <span className="text-yellow-400">LS (quyi spin)</span>
                  <div className="text-xs text-yellow-300 mt-1">diamagnit</div>
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                <h4 className="text-violet-300 font-bold mb-2 text-sm">🌡️ Haroratga bog'liq</h4>
                <p className="text-blue-100 text-xs">Past T → LS; Yuqori T → HS. <strong>T₁/₂</strong> — yarim o'tish harorati.</p>
              </div>
              <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                <h4 className="text-violet-300 font-bold mb-2 text-sm">💡 LIESST effekti</h4>
                <p className="text-blue-100 text-xs">Light-Induced Excited Spin State Trapping — yorug'lik bilan metastabil HS holat.</p>
              </div>
              <div className="bg-violet-900/30 rounded-xl p-4 border border-violet-700/30">
                <h4 className="text-violet-300 font-bold mb-2 text-sm">🔄 Gisterezis</h4>
                <p className="text-blue-100 text-xs">Ba'zi materiallarda keng bistabil holat — xotira qurilmalari uchun foydali.</p>
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
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Yuqori va quyi spinli komplekslarni farqlashda bir nechta kuchli usul mavjud:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-teal-300">SQUID magnitometriya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng samarali usul — magnit momentni aniq o'lchash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>HS Fe²⁺:</strong> μeff ≈ 4.9-5.3 μB (4 toq e⁻)</li>
                <li>• <strong>LS Fe²⁺:</strong> μeff ≈ 0 μB (0 toq e⁻)</li>
                <li>• <strong>Formula:</strong> μ_eff = √(n(n+2)) μB (spin-only)</li>
                <li>• Haroratga bog'liq o'lchov — SCO kuzatiladi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-teal-300">Mössbauer spektroskopiya (⁵⁷Fe)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Faqat temir uchun — juda sezgir usul:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>HS Fe²⁺:</strong> katta izomer siljishi (δ ≈ 1.0 mm/s)</li>
                <li>• <strong>LS Fe²⁺:</strong> kichik izomer siljishi (δ ≈ 0.4 mm/s)</li>
                <li>• Kvadrupol bo'linish (ΔE_Q) ham farq qiladi</li>
                <li>• Spin holatini <strong>aniq belgilaydi</strong></li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Kristall panjarada bog' uzunliklari:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>HS:</strong> uzun bog'lar (eg orbitallar to'lgan)</li>
                <li>• <strong>LS:</strong> qisqa bog'lar (faqt t₂g to'lgan)</li>
                <li>• Farq: ~0.2 Å (aniq o'lchanadi)</li>
                <li>• SCO kuzatish uchun haroratli XRD</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-teal-300">UV-Vis-NIR spektroskopiya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">d-d o'tishlar energiyasi farqi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>HS:</strong> kichik Δo — uzun λ da yutilish</li>
                <li>• <strong>LS:</strong> katta Δo — qisqa λ da yutilish</li>
                <li>• Rang farqi kuzatiladi (HS och, LS to'q)</li>
                <li>• 10Dq qiymati to'g'ridan-to'g'ri o'lchanadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-blue-900/40 to-sky-900/40 border border-blue-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Metallar bo'yicha <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-blue-700">
                  <th className="py-3 px-4 text-sky-300 text-sm">Metall</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Konfiguratsiya</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">HS toq e⁻</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">LS toq e⁻</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Klassik HS misol</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Klassik LS misol</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-sky-400">Cr²⁺</td>
                  <td className="py-3 px-4 font-mono">d⁴</td>
                  <td className="py-3 px-4 text-red-400 font-bold">4</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">2</td>
                  <td className="py-3 px-4 text-xs">[Cr(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4 text-xs">[Cr(CN)₆]⁴⁻</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-indigo-400">Mn²⁺ / Fe³⁺</td>
                  <td className="py-3 px-4 font-mono">d⁵</td>
                  <td className="py-3 px-4 text-red-400 font-bold">5</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">1</td>
                  <td className="py-3 px-4 text-xs">[FeF₆]³⁻</td>
                  <td className="py-3 px-4 text-xs">[Fe(CN)₆]³⁻</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-amber-400">Fe²⁺ / Co³⁺</td>
                  <td className="py-3 px-4 font-mono">d⁶</td>
                  <td className="py-3 px-4 text-red-400 font-bold">4</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">0</td>
                  <td className="py-3 px-4 text-xs">[Fe(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4 text-xs">[Fe(CN)₆]⁴⁻</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-rose-400">Co²⁺</td>
                  <td className="py-3 px-4 font-mono">d⁷</td>
                  <td className="py-3 px-4 text-red-400 font-bold">3</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">1</td>
                  <td className="py-3 px-4 text-xs">[Co(H₂O)₆]²⁺</td>
                  <td className="py-3 px-4 text-xs">[Co(CN)₅H₂O]³⁻</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-cyan-400">Ni³⁺</td>
                  <td className="py-3 px-4 font-mono">d⁷</td>
                  <td className="py-3 px-4 text-red-400 font-bold">3</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">1</td>
                  <td className="py-3 px-4 text-xs">[NiF₆]³⁻</td>
                  <td className="py-3 px-4 text-xs">[Ni(CN)₆]³⁻</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-sky-900/40 to-indigo-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-sky-100 mb-6 text-sm md:text-base">
            Holat izomeriyasi keng tarqalgan, ayniqsa quyidagi metallarda:
          </p>

          <div className="space-y-4">
            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-red-400 mb-3">
                🔴 Fe³⁺ (d⁵) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[FeF₆]³⁻ (HS)</p>
                  <p className="text-sky-200 text-xs">5 ta toq e⁻, μeff ≈ 5.9 μB</p>
                  <p className="text-sky-300 text-xs mt-1">F⁻ — kuchsiz maydon</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Fe(CN)₆]³⁻ (LS)</p>
                  <p className="text-sky-200 text-xs">1 ta toq e⁻, μeff ≈ 2.3 μB</p>
                  <p className="text-sky-300 text-xs mt-1">CN⁻ — kuchli maydon</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Bu juftlik — <strong>ferrisianid/ferriflorid</strong> — analitik kimyoda keng qo'llaniladi
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-violet-400 mb-3">
                🟣 Co³⁺ (d⁶) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[CoF₆]³⁻ (HS)</p>
                  <p className="text-sky-200 text-xs">4 ta toq e⁻, paramagnit</p>
                  <p className="text-sky-300 text-xs mt-1">Juda kam uchraydi</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(NH₃)₆]³⁺ (LS)</p>
                  <p className="text-sky-200 text-xs">0 ta toq e⁻, diamagnit</p>
                  <p className="text-sky-300 text-xs mt-1">Kinetik inert, barqaror</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Co³⁺ deyarli har doim <strong>quyi spinli</strong> (kuchli maydon ligandlari bilan)
              </p>
            </div>

            <div className="bg-sky-950/40 rounded-2xl p-6 border border-sky-700/30">
              <h3 className="text-lg font-bold text-amber-400 mb-3">
                🟡 Spin crossover molekulalari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Fe(phen)₂(NCS)₂]</p>
                  <p className="text-sky-200 text-xs">T₁/₂ ≈ 174 K</p>
                  <p className="text-sky-300 text-xs mt-1">Klassik SCO molekulasi</p>
                </div>
                <div className="bg-sky-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Fe(ptz)₆](BF₄)₂</p>
                  <p className="text-sky-200 text-xs">LIESST effekti kuzatiladi</p>
                  <p className="text-sky-300 text-xs mt-1">Yorug'lik bilan boshqariladi</p>
                </div>
              </div>
              <p className="text-sky-300 text-xs mt-3">
                💡 Bu molekulalar <strong>molekulyar xotira qurilmalari</strong> va <strong>sensorlar</strong> uchun istiqbolli
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
            Holat izomeriyasining zamonaviy fanda katta qo'llanilishi bor:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💾</span>
                <h3 className="text-lg font-bold text-violet-300">Molekulyar xotira qurilmalari</h3>
              </div>
              <p className="text-violet-100 text-sm">
                SCO materiallari <strong>ikki barqaror holatga</strong> (HS va LS) ega bo'lib,
                ularni <strong>0 va 1 bitlari</strong> sifatida ishlatish mumkin. Keng gisterezisli
                materiallar xotira saqlash uchun ideal.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🌡️</span>
                <h3 className="text-lg font-bold text-violet-300">Harorat sensorlari</h3>
              </div>
              <p className="text-violet-100 text-sm">
                SCO komplekslari harorat o'zgarishida <strong>rangini o'zgartiradi</strong>
                (thermochromism). Bu xususiyat <strong>optik termometrlar</strong> yaratishda ishlatiladi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧬</span>
                <h3 className="text-lg font-bold text-violet-300">Biologik ahamiyat</h3>
              </div>
              <p className="text-violet-100 text-sm">
                <strong>Gemoglobin</strong> va <strong>miyoglobin</strong> kabi oqsillarda Fe²⁺ ning
                spin holati O₂ bilan bog'lanishni boshqaradi. <em>Deoksigemoglobin</em> — HS,
                <em> oksigemoglobin</em> — LS (kuchli maydon O₂ tufayli).
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-violet-300">Spintronika</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Spin holati bilan boshqariladigan materiallar <strong>spintronika</strong> —
                yangi avlod elektronikada katta istiqbolga ega. Elektron zaryadi emas,
                balki <strong>spini</strong> axborot tashuvchisi bo'ladi.
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
                <div className="text-4xl">🏛️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">Hans Bethe (1929)</h3>
                  </div>
                  <p className="text-sky-200 text-sm mb-3">
                    <strong>1929:</strong> Bethe <strong>Kristall maydon nazariyasini</strong>
                    (Crystal Field Theory) ishlab chiqdi. U birinchi bo'lib oktaedrik maydonda
                    d-orbitallarning <strong>t₂g va e_g ga bo'linishini</strong> tushuntirdi.
                  </p>
                  <p className="text-sky-200 text-sm">
                    <strong>Ahamiyati:</strong> Bu nazariya holat izomeriyasini tushunishning asosi bo'ldi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧲</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">L. Cambi (1930-yillar)</h3>
                    <span className="px-2 py-1 bg-indigo-600/30 text-indigo-300 border border-indigo-600/50 rounded-full text-xs">Birinchi SCO</span>
                  </div>
                  <p className="text-sky-200 text-sm mb-3">
                    <strong>1930-yillar:</strong> Italiyalik kimyogar Cambi birinchi bo'lib
                    <strong> spin crossover hodisasini</strong> kuzatdi. U Fe(III) ditiokarbamat
                    komplekslarida <strong>haroratga bog'liq magnit xususiyatlar</strong> o'zgarishini topdi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/40 border border-violet-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💡</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-violet-400">Gütlich, Hauser, Spiering (1994)</h3>
                    <span className="px-2 py-1 bg-violet-600/30 text-violet-300 border border-violet-600/50 rounded-full text-xs">LIESST</span>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>1994:</strong> LIESST (Light-Induced Excited Spin State Trapping) effekti
                    batafsil o'rganildi. Bu kashfiyot <strong>yorug'lik bilan boshqariladigan
                    molekulyar qurilmalar</strong> yo'lini ochdi.
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
              Holat izomeriyasi — bir xil tarkibli kompleksning <strong className="text-sky-300">ikki xil spin holatida</strong>
              (yuqori/quyi) mavjud bo'lishi.
            </li>
            <li>
              Bu hodisa <strong className="text-sky-300">Kristall maydon nazariyasi</strong> (CFT) bilan tushuntiriladi —
              <strong> Δo va P</strong> energiyalarining raqobati.
            </li>
            <li>
              <strong className="text-sky-300">Δo &lt; P</strong> → yuqori spin (HS) |
              <strong className="text-sky-300"> Δo &gt; P</strong> → quyi spin (LS).
            </li>
            <li>
              Kuchsiz maydon ligandlari (H₂O, F⁻, Cl⁻) → <strong>HS</strong>.
              Kuchli maydon (CN⁻, CO, phen) → <strong>LS</strong>.
            </li>
            <li>
              Eng klassik misol: <strong className="text-sky-300">[Fe(H₂O)₆]²⁺ (HS, 4 toq e⁻)</strong>
              va <strong className="text-sky-300">[Fe(CN)₆]⁴⁻ (LS, 0 toq e⁻)</strong>.
            </li>
            <li>
              Farqlash usullari: <strong className="text-sky-300">SQUID magnitometriya, Mössbauer, XRD, UV-Vis</strong>.
            </li>
            <li>
              <strong className="text-sky-300">Spin crossover (SCO)</strong> — haroratga bog'liq HS⇌LS o'tishi,
              <strong> LIESST effekti</strong> — yorug'lik bilan boshqarish.
            </li>
            <li>
              Zamonaviy qo'llanilish: <strong>spintronika, molekulyar xotira, harorat sensorlari,
              biologik modellar</strong> (gemoglobin).
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🎯</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Spin holatlarni <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda d-orbitallarning bo'linishini, elektronlarning t₂g va e_g larda
              joylashuvini, HS va LS komplekslarning <strong>bog' uzunliklari farqini</strong> ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/holat/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/konformatsion" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← Konformatsion izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/elektron" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Elektron izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Holat izomeriyasi • Spin crossover • Bethe (1929), Cambi (1930), Gütlich (1994)</p>
        </div>
      </footer>
    </main>
  )
}