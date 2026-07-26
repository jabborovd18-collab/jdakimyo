import Link from "next/link"
export default function FormalIzomeriyasi() {
  const misollar = [
    {
      num: 1,
      title: "Ionlanish + Gidrat",
      icon: "⚡💧",
      formula1: "[Cr(H₂O)₆]Cl₃",
      formula2: "[CrCl(H₂O)₅]Cl₂·H₂O",
      desc: "Bir vaqtning o'zida suv molekulasi ichki/tashqi sferada almashadi (gidrat) VA xlorid ioni ham almashadi (ionlanish). CrCl₃·6H₂O ning 3 ta izomeri aynan shu holatni namoyon etadi.",
      color: "text-blue-400",
      bg: "from-blue-600/10 to-slate-900/30 border-blue-500/30",
    },
    {
      num: 2,
      title: "Bog'lanish + Transformatsion",
      icon: "🔗✨",
      formula1: "[Co(NH₃)₅ONO]²⁺",
      formula2: "[Co(NH₃)₅NO₂]²⁺",
      desc: "Nitrito (O-bog'langan) va nitro (N-bog'langan) izomerlari bog'lanish izomeriyasiga kiradi. Ammo nitrito yorug'lik ta'sirida nitroga aylanganda, bu transformatsion izomeriya jarayoni hisoblanadi.",
      color: "text-amber-400",
      bg: "from-amber-600/10 to-slate-900/30 border-amber-500/30",
    },
    {
      num: 3,
      title: "Koordinatsion + Ionlanish",
      icon: "🔄⚡",
      formula1: "[Pt(NH₃)₄][PtCl₄]",
      formula2: "[Pt(NH₃)₃Cl][Pt(NH₃)Cl₃]",
      desc: "Magnus yashil tuzi va uning izomeri. Birida metallar to'liq ligand almashgan (koordinatsion), ikkinchisida esa qisman almashinuv natijasida ionlanish xususiyati ham o'zgargan.",
      color: "text-emerald-400",
      bg: "from-emerald-600/10 to-slate-900/30 border-emerald-500/30",
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
            <span className="text-sky-400 font-semibold">📋 Formal izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">📋</span>
                Formal izomeriyasi
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Umumiy tushuncha • Murakkab va aralash izomeriya holatlari • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/formal/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
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
              KAM UCHRAYDIGAN TUR • UMUMIY KONSEPSIYA
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                Formal izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">bitta modda — bir nechta izomeriya turi</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              Formal izomeriyasi — bu alohida izomeriya turi emas, balki
              <strong className="text-sky-300"> umumiy tushuncha</strong>. U bir xil yalpi formulaga ega moddalarning
              <strong className="text-sky-300"> har xil kimyoviy bog'lanish strukturasiga</strong> ega bo'lishini ifodalaydi.
              Ko'pincha bitta kompleks bir vaqtning o'zida <strong className="text-sky-300">bir nechta izomeriya
              turlarini</strong> namoyon etadi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-extrabold text-sky-300">Umumiy</div>
                <div className="text-xs text-sky-300 mt-1">Konspektiv tushuncha</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔀</div>
                <div className="text-2xl font-extrabold text-sky-300">Aralash</div>
                <div className="text-xs text-sky-300 mt-1">Bir nechta turlar</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-2xl font-extrabold text-sky-300">Struktura</div>
                <div className="text-xs text-sky-300 mt-1">Bog'lanish farqi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-extrabold text-sky-300">10/10</div>
                <div className="text-xs text-sky-300 mt-1">Tuzilish turlari</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/formal/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-12 transition-transform">📋</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-blue-200 text-xs">[Cr(H₂O)₆]Cl₃</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-emerald-200 text-xs">[CrCl(H₂O)₅]Cl₂·H₂O</span>
                    {' '}— aralash izomeriya holatlarining fazoviy tuzilishini ko'ring
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
              <strong className="text-sky-300 text-xl">Formal izomeriyasi</strong>
              (inglizcha: <em>formal isomerism</em>) — bir xil molekulyar formulaga ega bo'lgan
              moddalarning <strong className="text-yellow-400">kimyoviy bog'lanish strukturasi</strong>
              jihatidan farq qilishi. Bu atama ko'pincha boshqa izomeriya turlariga
              <strong className="text-sky-300"> sig'maydigan</strong> yoki
              <strong className="text-sky-300"> bir nechta turlarni o'z ichiga olgan</strong>
              murakkab holatlarni tasvirlash uchun ishlatiladi.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Boshqa so'z bilan aytganda, formal izomeriya — bu
              <strong className="text-sky-300"> &quot;shamsiya&quot; (umbrella) tushuncha</strong>.
              Agar siz bitta kompleksda ionlanish, gidrat va bog'lanish izomeriyasini bir vaqtda ko'rsangiz,
              bu <strong className="text-sky-300">formal izomeriya</strong> hisoblanadi.
            </p>
          </div>

          {/* FORMAL VS BOSHA */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-sky-300 mb-3">⚠️ Nima uchun &quot;formal&quot; deb ataladi?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                <h4 className="text-sky-400 font-bold mb-2">✅ Aniq izomeriya turlari</h4>
                <p className="text-blue-100 text-xs">Ionlanish, gidrat, bog'lanish — har biri aniq mexanizmga ega.</p>
                <p className="text-blue-200 text-xs mt-2">Masalan: &quot;ligand va anion almashdi&quot;</p>
              </div>
              <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-700/30">
                <h4 className="text-indigo-400 font-bold mb-2">📋 Formal izomeriya</h4>
                <p className="text-blue-100 text-xs">Umumiy nom — strukturaviy farq bor, lekin mexanizm murakkab.</p>
                <p className="text-blue-200 text-xs mt-2">&quot;Formula bir xil, lekin bog'lanish butunlay boshqa&quot;</p>
              </div>
            </div>
          </div>

          {/* 3 TA XUSUSIYAT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">1️⃣</span>
                <h3 className="font-bold text-sky-300">Bir xil formula</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Barcha izomerlarning <strong>yalpi formulasi bir xil</strong>,
                lekin ichki tuzilishi har xil.
              </p>
            </div>
            <div className="bg-indigo-900/30 border border-indigo-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">2️⃣</span>
                <h3 className="font-bold text-indigo-300">Har xil bog'lanish</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Atomlar orasidagi <strong>bog'lanish tartibi</strong> yoki
                <strong> bog'lanish turi</strong> farq qiladi.
              </p>
            </div>
            <div className="bg-blue-900/30 border border-blue-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">3️⃣</span>
                <h3 className="font-bold text-blue-300">Aralash tabiat</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ko'pincha <strong>bir nechta izomeriya turi</strong>
                bir vaqtda kuzatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* ARALASH MISOLLAR */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Aralash <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">izomeriya misollari</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Formal izomeriyaning eng yaxshi misollari — <strong className="text-sky-300">bir vaqtning o'zida
            bir nechta izomeriya turini</strong> namoyon etadigan komplekslardir.
          </p>

          <div className="space-y-6">
            {misollar.map((m) => (
              <div
                key={m.num}
                className={`bg-gradient-to-br ${m.bg} border rounded-3xl p-6 md:p-8 relative overflow-hidden`}
              >
                <div className="absolute top-4 right-4 text-[120px] opacity-5 font-black select-none">
                  {m.num}
                </div>
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4 flex-wrap">
                    <span className="text-5xl">{m.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs text-sky-300 font-bold bg-sky-900/40 px-3 py-1 rounded-full">
                          Misol {m.num}
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold ${m.color}`}>{m.title}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-sky-700/30">
                      <div className="text-xs text-sky-300 mb-1">Izomer A</div>
                      <p className="font-mono text-sky-200 text-sm">{m.formula1}</p>
                    </div>
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-sky-700/30">
                      <div className="text-xs text-sky-300 mb-1">Izomer B</div>
                      <p className="font-mono text-sky-200 text-sm">{m.formula2}</p>
                    </div>
                  </div>

                  <p className="text-sky-100 leading-relaxed text-sm md:text-base">
                    💡 {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kontekst</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-sky-900/40 border border-sky-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏛️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">Alfred Werner (1893)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                  </div>
                  <p className="text-sky-200 text-sm mb-3">
                    Werner o'zining koordinatsion nazariyasini ishlab chiqayotganda, ba'zi komplekslar
                    <strong> bir vaqtning o'zida bir nechta izomeriya turini</strong> namoyon etishini kuzatdi.
                    U bu hodisalarni <strong>&quot;murakkab izomeriya&quot;</strong> deb atadi.
                  </p>
                  <p className="text-sky-200 text-sm">
                    Bugungi kunda biz buni <strong className="text-sky-300">formal izomeriya</strong> deb ataymiz —
                    chunki u bitta oddiy kategoriyaga sig'maydi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📚</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">Zamonaviy klassifikatsiya</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    Hozirgi IUPAC tavsiyalariga ko'ra, <strong>&quot;formal izomeriya&quot;</strong> atamasi
                    kamdan-kam ishlatiladi. Odatda olimlar aniq izomeriya turini (ionlanish, gidrat, bog'lanish)
                    belgilashni afzal ko'radi. Ammo <strong>o'quv adabiyotlarida</strong> bu atama hali ham
                    <strong> umumiy tushuncha</strong> sifatida qo'llaniladi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ANALITIK USULLAR — teal-300/400 */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">tahlil qilinadi?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            Formal izomeriya murakkab bo'lgani uchun, uni tahlil qilishda
            <strong className="text-teal-300"> bir nechta usulni kombinatsiyalash</strong> kerak:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧪</span>
                <h3 className="text-lg font-bold text-teal-300">Kimyoviy reaksiyalar</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Sifat reaksiyalari orqali ionlar aniqlanadi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>AgNO₃:</strong> erkin halogenidlarni cho'ktiradi</li>
                <li>• <strong>BaCl₂:</strong> erkin sulfatni cho'ktiradi</li>
                <li>• Har bir izomer <strong>turli miqdorda</strong> cho'kma beradi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-teal-300">Spektroskopiya (IR, UV-Vis)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Bog'lanish turini va ligand maydonini aniqlash:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>IR:</strong> NO₂ vs ONO, CN⁻ vs NC⁻ farqi</li>
                <li>• <strong>UV-Vis:</strong> d-d o'tishlar energiyasi</li>
                <li>• Har bir izomer <strong>o'ziga xos spektr</strong> beradi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng aniq usul — kristall strukturani to'g'ridan ko'rish:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• Atomlarning <strong>aniq joylashuvi</strong></li>
                <li>• Bog' uzunliklari va burchaklari</li>
                <li>• Ichki va tashqi sferani <strong>farqlash</strong></li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-teal-300">Konduktometriya</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Elektr o'tkazuvchanlik orqali ionlar soni:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>Λm qiymati:</strong> ionlar soniga proporsional</li>
                <li>• 1:1, 1:2, 1:3 elektrolitlarni farqlash</li>
                <li>• Izomerlarda <strong>turli Λm</strong> qiymatlari</li>
              </ul>
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
            Formal izomeriyani tushunish quyidagi sohalarda muhim:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎓</span>
                <h3 className="text-lg font-bold text-violet-300">Ta'lim</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Talabalar uchun izomeriya turlarini <strong>o'rganishda</strong> formal izomeriya
                <strong> umumlashtiruvchi tushuncha</strong> vazifasini o'taydi. U barcha turlarni
                birlashtirib, tizimli bilim beradi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-violet-300">Tadqiqot</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Yangi kompleks sintez qilinganda, u <strong>bir nechta izomeriya turini</strong>
                namoyon etishi mumkin. Tadqiqotchilar buni <strong>formal izomeriya</strong> doirasida
                tahlil qiladi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Farmatsevtika</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Dori moddalarining <strong>gidrat shakllari</strong> (masalan, antibiotiklar)
                bir vaqtning o'zida gidrat va ionlanish izomeriyasini namoyon etishi mumkin.
                Bu dorining <strong>eruvchanligi va bioavailability</strong>siga ta'sir qiladi.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏭</span>
                <h3 className="text-lg font-bold text-violet-300">Sanoat</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Katalizatorlar va materialshunoslikda <strong>aralash izomeriya</strong>
                materialning xususiyatlarini (rang, magnit, elektr o'tkazuvchanlik)
                <strong> nozik sozlash</strong> imkonini beradi.
              </p>
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
              Formal izomeriyasi — <strong className="text-sky-300">umumiy tushuncha</strong>,
              bir xil formulali moddalarning har xil kimyoviy bog'lanish strukturasiga ega bo'lishi.
            </li>
            <li>
              Bu <strong className="text-sky-300">alohida izomeriya turi emas</strong>, balki
              boshqa turlarni birlashtiruvchi &quot;shamsiya&quot; atama.
            </li>
            <li>
              Ko'pincha bitta kompleks <strong className="text-sky-300">bir nechta izomeriya turini</strong>
              (ionlanish + gidrat, bog'lanish + transformatsion) bir vaqtda namoyon etadi.
            </li>
            <li>
              Klassik misol: <strong className="text-sky-300">CrCl₃·6H₂O</strong> — gidrat va ionlanish
              izomeriyasining aralashmasi.
            </li>
            <li>
              Tahlil usullari: <strong className="text-sky-300">kimyoviy reaksiyalar, IR/UV-Vis, XRD, konduktometriya</strong>
              kombinatsiyasi.
            </li>
            <li>
              Amaliy ahamiyati: <strong>ta'lim, tadqiqot, farmatsevtika, sanoat</strong>.
            </li>
            <li>
              Zamonaviy IUPAC da bu atama <strong>kamdan-kam</strong> ishlatiladi, lekin o'quv adabiyotlarida
              hali ham muhim.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">📋</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Aralash izomeriyani <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda CrCl₃·6H₂O ning uchala izomerini, suv va xlorid ionlarining
              ichki/tashqi sferada joylashuvini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/formal/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/transformatsion" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← Transformatsion izomeriya
          </Link>
          <Link href="/oquv/izomeriyasi/stereo" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Stereoizomeriya →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Formal izomeriyasi • Umumiy tushuncha • Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}