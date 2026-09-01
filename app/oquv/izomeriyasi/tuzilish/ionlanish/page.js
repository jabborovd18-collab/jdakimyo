import Link from "next/link"
export default function IonlanishIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "[CoBr(NH₃)₅]SO₄",
      name: "Bromopentaamminkobalt(III) sulfat",
      rang: "Qizil-binafsha",
      rangColor: "text-pink-400",
      bg: "from-pink-600/10 to-pink-900/30 border-pink-500/30",
      ichkiLigand: "Br⁻ (ichki)",
      tashqiAnion: "SO₄²⁻ (tashqi)",
      kompleksIon: "[CoBr(NH₃)₅]²⁺",
      zaryad: "+2",
      ionlar: 2,
      AgBr: 0,
      BaSO4: 1,
      izoh: "Ichki sferada Br⁻ koordinatsion bog' orqali Co³⁺ ga bog'langan. Br⁻ suvda erkin chiqmaydi, shu sababli AgNO₃ bilan cho'kma bermaydi. Ammo SO₄²⁻ tashqi sferada bo'lgani uchun Ba²⁺ bilan BaSO₄ cho'kma beradi.",
    },
    {
      num: 2,
      formula: "[Co(NH₃)₅SO₄]Br",
      name: "Sulfatopentaamminkobalt(III) bromid",
      rang: "Qizil",
      rangColor: "text-red-400",
      bg: "from-red-600/10 to-red-900/30 border-red-500/30",
      ichkiLigand: "SO₄²⁻ (ichki)",
      tashqiAnion: "Br⁻ (tashqi)",
      kompleksIon: "[Co(NH₃)₅SO₄]⁺",
      zaryad: "+1",
      ionlar: 2,
      AgBr: 1,
      BaSO4: 0,
      izoh: "Ichki sferada SO₄²⁻ ligand sifatida bog'langan (sulfato). SO₄²⁻ suvda erkin chiqmaydi, Ba²⁺ cho'ktira olmaydi. Br⁻ esa erkin bo'lib, AgNO₃ bilan AgBr cho'kma beradi.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-pink-950 to-slate-950 text-white">
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
            <span className="text-pink-400 font-semibold">⚡ Ionlanish izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-pink-400 flex items-center gap-2">
                <span className="text-3xl">⚡</span>
                Ionlanish izomeriyasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Ligand va tashqi sfera anionining o'rin almashishi • Asosiy tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/ionlanish/3d" className="text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-pink-600/30">
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
        <div className="bg-gradient-to-br from-pink-900/60 to-purple-900/60 border border-pink-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-600/20 border border-pink-600/30 rounded-full text-xs font-semibold text-pink-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ASOSIY IZOMERIYA TURI • WERNER 1893
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-red-400 to-pink-300 bg-clip-text text-transparent">
                Ionlanish izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">ionlar almashadi, formula o'zgaradi</span>
            </h2>
            <p className="text-lg md:text-xl text-pink-100 max-w-3xl mb-8 leading-relaxed">
              Ionlanish izomeriyasida <strong className="text-pink-300">ichki sferadagi ligand</strong> va
              <strong className="text-pink-300"> tashqi sferadagi anion</strong> o'rin almashadi.
              Natijada suvda eriganda <strong className="text-pink-300">butunlay boshqa ionlar</strong> ajralib chiqadi
              va moddalar kimyoviy reaksiyalar orqali oson farqlanadi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-extrabold text-pink-300">2</div>
                <div className="text-xs text-pink-300 mt-1">Klassik izomer</div>
              </div>
              <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧪</div>
                <div className="text-2xl font-extrabold text-pink-300">Ag⁺/Ba²⁺</div>
                <div className="text-xs text-pink-300 mt-1">Farqlovchi reagentlar</div>
              </div>
              <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-pink-300">1893</div>
                <div className="text-xs text-pink-300 mt-1">Werner kashfiyoti</div>
              </div>
              <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-pink-300">Co³⁺</div>
                <div className="text-xs text-pink-300 mt-1">Markaziy atom</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA — JALB QILUVCHI */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/30 via-purple-600/30 to-pink-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/ionlanish/3d"
            className="relative block bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:from-pink-500 hover:via-purple-500 hover:to-pink-500 rounded-3xl p-8 md:p-10 shadow-2xl shadow-pink-600/40 transform hover:scale-[1.02] transition-all group border border-pink-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-12 transition-transform">🧊</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-pink-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-pink-200 text-xs">[CoBr(NH₃)₅]SO₄</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-red-200 text-xs">[Co(NH₃)₅SO₄]Br</span>
                    {' '}— ligandlarning fazoviy joylashuvini ko'ring
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
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-pink-100 text-lg leading-relaxed mb-4">
              <strong className="text-pink-300 text-xl">Ionlanish izomeriya</strong> — kompleks birikmaning
              <strong className="text-yellow-400"> ichki sferasidagi ligand</strong> va
              <strong className="text-yellow-400"> tashqi sferasidagi anion</strong> o'rin almashganda
              hosil bo'ladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-pink-200 leading-relaxed">
              Bu izomerlar <strong className="text-pink-300">suvda eritilganda</strong> butunlay boshqa ionlarga
              dissotsiatsiyalanadi, shu sababli <strong className="text-pink-300">kimyoviy reaksiyalar orqali</strong>
              osonlikcha farqlanadi. Ionlanish izomerlari —
              <strong className="text-pink-300"> bir xil tarkibli, lekin turli xil moddalar</strong> hisoblanadi.
            </p>
          </div>

          {/* ICHKI VS TASHQI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-900/40 to-red-900/40 border border-pink-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🔵</span>
                <h3 className="text-xl font-bold text-pink-300">Ichki sfera (Ligand)</h3>
              </div>
              <p className="text-pink-100 mb-4 text-sm">
                <strong>Koordinatsion sfera</strong> — to'g'ridan-to'g'ri markaziy metallga bog'langan guruh.
                Kvadrat qavslar ichida: <code className="bg-pink-950/60 px-2 py-0.5 rounded text-pink-300">[CoBr(NH₃)₅]²⁺</code>
              </p>
              <ul className="space-y-2 text-pink-200 text-sm">
                <li className="flex gap-2"><span className="text-pink-400">✓</span> Metall bilan <strong>koordinatsion bog'</strong> hosil qiladi</li>
                <li className="flex gap-2"><span className="text-pink-400">✓</span> Dissotsiatsiyada <strong>kompleks ion</strong> tarkibida qoladi</li>
                <li className="flex gap-2"><span className="text-pink-400">✓</span> <strong>Sifat reaksiyalariga kirishmaydi</strong> (erkin emas)</li>
                <li className="flex gap-2"><span className="text-pink-400">✓</span> <strong>Cho'kma bermaydi</strong></li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-500/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🟠</span>
                <h3 className="text-xl font-bold text-amber-300">Tashqi sfera (Anion)</h3>
              </div>
              <p className="text-pink-100 mb-4 text-sm">
                <strong>Erkin sfera</strong> — kompleks ion bilan ion bog' orqali bog'langan erkin anion.
                Kvadrat qavslardan <strong>tashqarida</strong> yoziladi: <code className="bg-amber-950/60 px-2 py-0.5 rounded text-amber-300">SO₄²⁻</code>
              </p>
              <ul className="space-y-2 text-pink-200 text-sm">
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Kompleks ion bilan <strong>ion bog'</strong> hosil qiladi</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Dissotsiatsiyada <strong>erkin ion</strong> sifatida ajraladi</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> <strong>Oson reaksiyaga kirishadi</strong> (cho'ktirish mumkin)</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> <strong>Cho'kma beradi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">Kobalt(III) komplekslari</span>
          </h2>
          <p className="text-pink-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Alfred Werner <strong className="text-pink-300">1893-yilda</strong> o'zining koordinatsion nazariyasini
            isbotlash uchun aynan shu misolni ishlatgan. Bir xil tarkibga ega
            <strong className="text-pink-300"> 2 ta turli rangdagi modda</strong> butunlay har xil reaksiyalar beradi.
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
                        <span className="text-xs text-pink-300 font-bold bg-pink-900/40 px-3 py-1 rounded-full">
                          Izomer {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-purple-600/20 border border-purple-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-pink-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-pink-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  {/* Dissotsiatsiya tenglamasi */}
                  <div className="bg-purple-950/60 border border-purple-700/50 rounded-2xl p-5 mb-6">
                    <div className="text-xs text-purple-300 mb-2 font-bold">⚡ Dissotsiatsiya tenglamasi:</div>
                    <p className="font-mono text-pink-300 text-sm md:text-base">
                      {iz.formula} → {iz.kompleksIon} + {iz.tashqiAnion}
                    </p>
                    <p className="text-xs text-purple-200 mt-2">
                      Hosil bo'ladigan kompleks ion zaryadi: <strong className="text-yellow-400">{iz.zaryad}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-pink-300 mb-1">Ichki ligand</div>
                      <div className="text-base md:text-lg font-extrabold text-pink-300">{iz.ichkiLigand}</div>
                    </div>
                    <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-pink-300 mb-1">Tashqi anion</div>
                      <div className="text-base md:text-lg font-extrabold text-amber-300">{iz.tashqiAnion}</div>
                    </div>
                    <div className="bg-pink-950/50 border border-pink-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-pink-300 mb-1">Ionlar soni</div>
                      <div className="text-2xl font-extrabold text-yellow-400">{iz.ionlar} ta</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-pink-950/60 rounded-xl p-4 border border-pink-700/30">
                      <div className="text-xs text-pink-300 mb-2">🧪 AgNO₃ bilan</div>
                      <div className="text-xl font-bold text-yellow-400">
                        {iz.AgBr === 0 ? "❌ Cho'kma yo'q" : `${iz.AgBr} mol AgBr ↓`}
                      </div>
                      <p className="text-xs text-pink-200 mt-1">
                        {iz.AgBr === 0
                          ? "Br⁻ ichki sferada, Ag⁺ reaksiyaga kirisha olmaydi"
                          : "Br⁻ erkin, Ag⁺ bilan AgBr sarg'ish cho'kma beradi"}
                      </p>
                    </div>
                    <div className="bg-pink-950/60 rounded-xl p-4 border border-pink-700/30">
                      <div className="text-xs text-pink-300 mb-2">🧪 BaCl₂ bilan</div>
                      <div className="text-xl font-bold text-yellow-400">
                        {iz.BaSO4 === 0 ? "❌ Cho'kma yo'q" : `${iz.BaSO4} mol BaSO₄ ↓`}
                      </div>
                      <p className="text-xs text-pink-200 mt-1">
                        {iz.BaSO4 === 0
                          ? "SO₄²⁻ ichki sferada, Ba²⁺ reaksiyaga kirisha olmaydi"
                          : "SO₄²⁻ erkin, Ba²⁺ bilan BaSO₄ oq cho'kma beradi"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MUHIM TUSHUNCHALAR */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🎓</span>
            Muhim <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">tushunchalar</span>
          </h2>
          <p className="text-yellow-100 mb-6 text-sm md:text-base">
            Ionlanish izomeriyasini to'liq tushunish uchun quyidagi atamalarni bilish kerak:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>⚛️</span> Co³⁺ — Kinetik inertlik
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Co³⁺ <strong>d⁶ past spinli</strong> konfiguratsiyaga ega. Bu uning komplekslari
                <strong> kinetik inert</strong> ekanligini anglatadi — ligandlar sekin almashadi.
                Shu sababli izomerlar <strong>suvda eritilganda bir-biriga o'tmaydi</strong>, alohida mavjud bo'ladi.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>⚖️</span> Elektrolit turi
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Ikkala izomer ham <strong>2 ta ionga</strong> dissotsiatsiyalanadi (1:1 elektrolit).
                Shu sababli elektr o'tkazuvchanliklari <strong>bir-biriga yaqin</strong> bo'ladi.
                Bu gidrat izomeriyasidan farq — u yerda ionlar soni har xil.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>🎨</span> Rang sababi
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                SO₄²⁻ va Br⁻ <strong>spektrokimyoviy qatorda</strong> har xil joylashadi.
                Ligand maydonining kuchi o'zgarsa, <strong>d-d o'tish energiyasi</strong> o'zgaradi va
                <strong> yutilgan yorug'lik to'lqin uzunligi</strong> farq qiladi — rang har xil bo'ladi.
              </p>
            </div>
            <div className="bg-yellow-950/40 rounded-xl p-5 border border-yellow-700/30">
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <span>📐</span> IUPAC nomlash
              </h3>
              <p className="text-yellow-100 text-sm leading-relaxed">
                Ligandlar <strong>alifbo tartibida</strong> yoziladi (bromo, ammin).
                Metall nomi <strong>&quot;-at&quot;</strong> qo'shimchasi olmaydi (chunki kation).
                Rim raqamlari bilan oksidlanish darajasi: <strong>kobalt(III)</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Ikkala izomerni <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-pink-400 text-sm">Izomer 1</th>
                  <th className="py-3 px-4 text-red-400 text-sm">Izomer 2</th>
                </tr>
              </thead>
              <tbody className="text-pink-100 text-sm">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold text-white">Formula</td>
                  <td className="py-3 px-4 font-mono text-pink-300">[CoBr(NH₃)₅]SO₄</td>
                  <td className="py-3 px-4 font-mono text-red-300">[Co(NH₃)₅SO₄]Br</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">IUPAC nomi</td>
                  <td className="py-3 px-4 text-xs">Bromopentaamminkobalt(III) sulfat</td>
                  <td className="py-3 px-4 text-xs">Sulfatopentaamminkobalt(III) bromid</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Rangi</td>
                  <td className="py-3 px-4">Qizil-binafsha</td>
                  <td className="py-3 px-4">Qizil</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ichki ligand</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Br⁻</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">SO₄²⁻</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Tashqi anion</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">SO₄²⁻</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">Br⁻</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Kompleks ion zaryadi</td>
                  <td className="py-3 px-4">+2</td>
                  <td className="py-3 px-4">+1</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">AgNO₃ → AgBr ↓</td>
                  <td className="py-3 px-4 text-red-400 font-bold">❌ 0 mol</td>
                  <td className="py-3 px-4 text-green-400 font-bold">✅ 1 mol</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">BaCl₂ → BaSO₄ ↓</td>
                  <td className="py-3 px-4 text-green-400 font-bold">✅ 1 mol</td>
                  <td className="py-3 px-4 text-red-400 font-bold">❌ 0 mol</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Elektr o'tkazuvchanlik</td>
                  <td className="py-3 px-4">~260 S·cm²/mol</td>
                  <td className="py-3 px-4">~255 S·cm²/mol</td>
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
            Ionlanish izomerlarini farqlashda eng ishonchli usul — <strong className="text-green-300">sifat reaksiyalari</strong>.
            Laboratoriyada quyidagi usullar qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧪</span>
                <h3 className="text-lg font-bold text-green-300">AgNO₃ cho'ktirish</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Kumush nitrat <strong>faqat tashqi sferadagi halogenidlarni</strong> cho'ktiradi:
              </p>
              <code className="block bg-green-950/60 rounded-lg p-3 text-xs text-pink-300 font-mono">
                Ag⁺ + Br⁻ → AgBr↓ (och sarg'ish)<br />
                <span className="text-red-300">{'// Ichki sferadagi Br⁻ reaksiyaga kirishmaydi!'}</span>
              </code>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚪</span>
                <h3 className="text-lg font-bold text-green-300">BaCl₂ cho'ktirish</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Bariy xlorid <strong>faqat erkin SO₄²⁻ ni</strong> cho'ktiradi:
              </p>
              <code className="block bg-green-950/60 rounded-lg p-3 text-xs text-pink-300 font-mono">
                Ba²⁺ + SO₄²⁻ → BaSO₄↓ (oq)<br />
                <span className="text-red-300">{"// Ichki sferadagi sulfato ligand cho'kmaydi!"}</span>
              </code>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚡</span>
                <h3 className="text-lg font-bold text-green-300">Konduktometriya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Elektr o'tkazuvchanlik o'lchash (Λm) — ionlar soni aniqlanadi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• Ikkala izomer ham <strong>2 ta ionga</strong> dissotsiatsiyalanadi</li>
                <li>• Λm qiymati: ~250-270 S·cm²/mol (1:1 elektrolit)</li>
                <li>• Ionlanish izomeriyasi uchun <strong>farq kam</strong></li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-green-300">UV-Vis spektroskopiya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Rangdagi farq <strong>yutilish spektrida</strong> ko'rinadi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>Izomer 1:</strong> λmax ~ 520 nm (qizil-binafsha)</li>
                <li>• <strong>Izomer 2:</strong> λmax ~ 500 nm (qizil)</li>
                <li>• d-d o'tish energiyasi farqi sabab</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-pink-100 mb-6 text-sm md:text-base">
            Ionlanish izomeriya faqat kobalt komplekslarida emas, balki boshqa metallarning komplekslarida ham uchraydi:
          </p>

          <div className="space-y-4">
            <div className="bg-pink-950/40 rounded-2xl p-6 border border-pink-700/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                🔷 Platina(IV) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Pt(NH₃)₄Cl₂]Br₂</p>
                  <p className="text-pink-200 text-xs">Ichki: 2 Cl⁻; Tashqi: 2 Br⁻</p>
                  <p className="text-pink-300 text-xs mt-1">AgNO₃ → 2 mol AgBr ↓</p>
                </div>
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Pt(NH₃)₄Br₂]Cl₂</p>
                  <p className="text-pink-200 text-xs">Ichki: 2 Br⁻; Tashqi: 2 Cl⁻</p>
                  <p className="text-pink-300 text-xs mt-1">AgNO₃ → 2 mol AgCl ↓</p>
                </div>
              </div>
              <p className="text-pink-300 text-xs mt-3">
                💡 Platina(IV) komplekslari <strong>oktaedr</strong> geometriyaga ega (KS = 6)
              </p>
            </div>

            <div className="bg-pink-950/40 rounded-2xl p-6 border border-pink-700/30">
              <h3 className="text-lg font-bold text-blue-400 mb-3">
                💙 Xrom(III) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Cr(H₂O)₆]Cl₃</p>
                  <p className="text-pink-200 text-xs">Ichki: 6 H₂O; Tashqi: 3 Cl⁻</p>
                  <p className="text-pink-300 text-xs mt-1">AgNO₃ → 3 mol AgCl ↓</p>
                </div>
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[CrCl(H₂O)₅]Cl₂·H₂O</p>
                  <p className="text-pink-200 text-xs">Ichki: 1 Cl⁻ + 5 H₂O</p>
                  <p className="text-pink-300 text-xs mt-1">AgNO₃ → 2 mol AgCl ↓</p>
                </div>
              </div>
              <p className="text-pink-300 text-xs mt-3">
                💡 Bu misol bir vaqtning o'zida <strong>ionlanish va gidrat</strong> izomeriyasini namoyon etadi
              </p>
            </div>

            <div className="bg-pink-950/40 rounded-2xl p-6 border border-pink-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                🔷 Palladiy(II) komplekslari
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Pd(NH₃)₄Cl₂]SO₄</p>
                  <p className="text-pink-200 text-xs">Ichki: 2 Cl⁻; Tashqi: SO₄²⁻</p>
                  <p className="text-pink-300 text-xs mt-1">BaCl₂ → 1 mol BaSO₄ ↓</p>
                </div>
                <div className="bg-pink-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Pd(NH₃)₄SO₄]Cl₂</p>
                  <p className="text-pink-200 text-xs">Ichki: SO₄²⁻; Tashqi: 2 Cl⁻</p>
                  <p className="text-pink-300 text-xs mt-1">AgNO₃ → 2 mol AgCl ↓</p>
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
                  U <strong>[CoBr(NH₃)₅]SO₄</strong> va <strong>[Co(NH₃)₅SO₄]Br</strong> ni o'rganib,
                  ular bir xil tarkibga ega bo'lsa-da, <strong>butunlay boshqa moddalar</strong> ekanligini isbotladi.
                </p>
                <p className="text-purple-200 text-sm mb-3">
                  <strong>Werner tajribasi:</strong> U AgNO₃ va BaCl₂ qo'shib, har bir izomer
                  <strong> faqat ma'lum ionlarga</strong> reaksiya berishini ko'rdi. Bu <strong>koordinatsion sfera</strong>
                  tushunchasining birinchi isboti edi.
                </p>
                <p className="text-purple-200 text-sm mb-3">
                  <strong>Sophus Jørgensen qarshiligi:</strong> Daniyalik kimyogar Jørgensen Werner nazariyasini
                  rad etdi va o'zining &quot;zanjir nazariyasini&quot; (chain theory) ilgari surdi. Werner 20 yil davomida
                  <strong> tajribalar bilan</strong> o'z nazariyasini isbotladi.
                </p>
                <p className="text-purple-200 text-sm">
                  <strong>Nobel mukofoti:</strong> 1913-yilda Werner <em>noorganik kimyo bo'yicha birinchi Nobel</em> mukofotini oldi.
                  Uning ishlari butun zamonaviy koordinatsion kimyoning asosi bo'ldi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-pink-100 list-decimal list-inside">
            <li>
              Ionlanish izomeriya — <strong className="text-pink-300">ichki ligand va tashqi anion o'rin almashadi</strong>,
              natijada suvda turli ionlar ajraladi.
            </li>
            <li>
              Klassik misol: <strong className="text-pink-300">[CoBr(NH₃)₅]SO₄</strong> (qizil-binafsha)
              va <strong className="text-pink-300">[Co(NH₃)₅SO₄]Br</strong> (qizil).
            </li>
            <li>
              <strong className="text-pink-300">AgNO₃</strong> — faqat tashqi sferadagi <strong>Br⁻</strong> ni cho'ktiradi.
              <strong className="text-pink-300"> BaCl₂</strong> — faqat tashqi sferadagi <strong>SO₄²⁻</strong> ni cho'ktiradi.
            </li>
            <li>
              Ikkala izomer ham <strong>1:1 elektrolit</strong> — elektr o'tkazuvchanliklari bir-biriga yaqin.
            </li>
            <li>
              Co³⁺ ning <strong>kinetik inertligi</strong> tufayli izomerlar suvda bir-biriga o'tmaydi.
            </li>
            <li>
              Bu hodisa Werner koordinatsion nazariyasining <strong>birinchi asosiy isboti</strong> bo'lgan (1893).
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-pink-600/20 via-purple-600/20 to-red-600/20 border border-pink-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">⚡</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ikkala izomerni <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda ligandlarning ichki va tashqi sferada qanday joylashganini,
              Br⁻ va SO₄²⁻ ning fazoviy joylashuvini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/ionlanish/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-pink-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Tuzilish bo'limi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/gidrat" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-bold text-center">
            Gidrat izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Ionlanish izomeriyasi • Kobalt(III) komplekslari • Werner (1893, Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}
