import Link from "next/link"
export default function OrinbosarIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      title: "Diaminopropan komplekslari",
      icon: "🔷",
      desc: "Eng klassik o'rinbosar izomeriyasi misoli",
      bg: "from-blue-600/10 to-slate-900/40 border-blue-500/30",
      izomerlar: [
        {
          name: "1,2-diaminopropan (1,2-pn)",
          formula: "CH₃-CH(NH₂)-CH₂-NH₂",
          rang: "To'q sariq-qizil",
          rangColor: "text-red-400",
          izoh: "Ikkala amino guruhi qo'shni uglerod atomlarida joylashgan. Co³⁺ bilan bidentat xelat halqasini (5 a'zoli) hosil qiladi. Bu halqada metil guruhi mavjud.",
          halqa: "5 a'zoli xelat",
          barqarorlik: "Barqaror",
        },
        {
          name: "1,3-diaminopropan (tn)",
          formula: "NH₂-CH₂-CH₂-CH₂-NH₂",
          rang: "Pushti-qizil",
          rangColor: "text-pink-400",
          izoh: "Amino guruhlari bir uglerod oraliqda (uchinchi pozitsiyalarda). Co³⁺ bilan 6 a'zoli xelat halqasini hosil qiladi. Metil guruhi yo'q — toza chiziqli zanjir.",
          halqa: "6 a'zoli xelat",
          barqarorlik: "Barqaror",
        },
      ],
    },
    {
      num: 2,
      title: "Diaminobenzol (fenilendiamin)",
      icon: "🧬",
      desc: "Aromatik ligandlarda o'rinbosarlar joylashuvi",
      bg: "from-indigo-600/10 to-slate-900/40 border-indigo-500/30",
      izomerlar: [
        {
          name: "orto-fenilendiamin (o-phen)",
          formula: "1,2-C₆H₄(NH₂)₂",
          rang: "To'q yashil",
          rangColor: "text-green-400",
          izoh: "NH₂ guruhlari yonma-yon joylashgan — bidentat ligand sifatida xelat halqa hosil qila oladi (chelating agent).",
          halqa: "Xelat hosil qiladi",
          barqarorlik: "Barqaror",
        },
        {
          name: "para-fenilendiamin (p-phen)",
          formula: "1,4-C₆H₄(NH₂)₂",
          rang: "To'q jigarrang",
          rangColor: "text-orange-400",
          izoh: "NH₂ guruhlari benzol halqasining qarama-qarshi tomonlarida. Bir metall bilan xelat hosil qila olmaydi — ko'prik ligandi sifatida ishlatiladi (bridging ligand).",
          halqa: "Ko'prik ligandi",
          barqarorlik: "Polimer kompleks beradi",
        },
      ],
    },
    {
      num: 3,
      title: "Metilpiridinlar (Picolines)",
      icon: "🧪",
      desc: "Piridin halqasida CH₃ guruhi joylashuvi",
      bg: "from-sky-600/10 to-slate-900/40 border-sky-500/30",
      izomerlar: [
        {
          name: "2-metilpiridin (α-pikolin)",
          formula: "C₅H₄N-2-CH₃",
          rang: "Sarg'ish",
          rangColor: "text-yellow-400",
          izoh: "Metil guruhi azot atomi yonida — bu sterik to'siq hosil qiladi, chunki metall azotga yaqinlashish qiyin.",
          halqa: "Sterik to'siqli",
          barqarorlik: "Kam barqaror",
        },
        {
          name: "4-metilpiridin (γ-pikolin)",
          formula: "C₅H₄N-4-CH₃",
          rang: "Pushti-sarg'ish",
          rangColor: "text-rose-400",
          izoh: "Metil guruhi azotdan uzoqda — sterik to'siq yo'q, shuning uchun kompleks oson hosil bo'ladi va barqaror.",
          halqa: "Sterik to'siqsiz",
          barqarorlik: "Yuqori barqaror",
        },
      ],
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
            <span className="text-sky-400 font-semibold">🔀 O'rinbosar izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-sky-300 flex items-center gap-2">
                <span className="text-3xl">🔀</span>
                O'rinbosar izomeriyasi
              </h1>
              <p className="text-blue-400 text-sm mt-1">
                Ligandning o'zi izomer — ichki tuzilishi farq qiladi • Kam uchraydigan tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/orinbosar/3d" className="text-xs bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-sky-600/30">
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
              KAM UCHRAYDIGAN TUR • LIGAND IZOMERIYASI
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                O'rinbosar izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">ligandning o'zi ikki xil bo'ladi</span>
            </h2>
            <p className="text-lg md:text-xl text-sky-100 max-w-3xl mb-8 leading-relaxed">
              O'rinbosar izomeriyasida (yoki <strong className="text-sky-300">ligand izomeriyasi</strong>)
              kompleksdagi <strong className="text-sky-300">ligandning o'zi izomer</strong> holatda bo'ladi.
              Bir xil yalpi formulali komplekslarda <strong className="text-sky-300">turli izomer ligandlar</strong>
              ishlatiladi, shuning uchun komplekslarning xossalari —
              <strong className="text-sky-300"> rang, barqarorlik, sterik xususiyat</strong> farq qiladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔷</div>
                <div className="text-2xl font-extrabold text-sky-300">3+</div>
                <div className="text-xs text-sky-300 mt-1">Ligand turi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📏</div>
                <div className="text-2xl font-extrabold text-sky-300">Xelat</div>
                <div className="text-xs text-sky-300 mt-1">Halqa o'lchami farqi</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚗️</div>
                <div className="text-2xl font-extrabold text-sky-300">NMR</div>
                <div className="text-xs text-sky-300 mt-1">Farqlovchi usul</div>
              </div>
              <div className="bg-blue-950/50 border border-blue-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧲</div>
                <div className="text-2xl font-extrabold text-sky-300">Sterik</div>
                <div className="text-xs text-sky-300 mt-1">Ta'sir turi</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-blue-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/orinbosar/3d"
            className="relative block bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 hover:from-sky-500 hover:via-indigo-500 hover:to-blue-600 rounded-3xl p-8 md:p-10 shadow-2xl shadow-sky-600/40 transform hover:scale-[1.02] transition-all group border border-sky-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:scale-110 transition-transform">🔷</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-sky-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-sky-200 text-xs">[Co(1,2-pn)₂Cl₂]⁺</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-pink-200 text-xs">[Co(tn)₂Cl₂]⁺</span>
                    {' '}— 5 vs 6 a'zoli xelat halqalarining farqini ko'ring
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
              <strong className="text-sky-300 text-xl">O'rinbosar izomeriyasi</strong>
              (inglizcha: <em>substituent isomerism</em> yoki <em>ligand isomerism</em>) —
              kompleks birikma tarkibidagi
              <strong className="text-yellow-400"> ligandning o'zi ikki xil izomer</strong> shaklida bo'lishi
              natijasida yuzaga keladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-sky-200 leading-relaxed">
              Bunda komplekslarning <strong className="text-sky-300">yalpi formulalari bir xil bo'lsa-da</strong>,
              ligand ichki tuzilishi — o'rinbosar guruhlarining joylashuvi — farq qiladi.
              Bu komplekslarning <strong className="text-sky-300">xela halqa o'lchami, sterik to'siq, barqarorlik
              va spektroskopik belgilarini</strong> o'zgartiradi.
            </p>
          </div>

          {/* LIGAND VS KOMPLEKS IZOMERIYA */}
          <div className="bg-slate-950/60 border border-blue-700/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-sky-300 mb-3">⚠️ Muhim farqlash:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-700/30">
                <h4 className="text-sky-400 font-bold mb-2">✅ Haqiqiy ligand izomeriyasi</h4>
                <p className="text-blue-100 text-xs">Ligandlar bir xil yalpi formula, ammo <strong>turli ichki tuzilish</strong>ga ega.</p>
                <p className="text-blue-200 text-xs mt-2">Misol: 1,2-dap va 1,3-dap — ikkalasi ham C₃H₁₀N₂</p>
              </div>
              <div className="bg-red-900/30 rounded-xl p-4 border border-red-700/30">
                <h4 className="text-red-400 font-bold mb-2">❌ Turli ligandlar (izomeriya EMAS)</h4>
                <p className="text-blue-100 text-xs">Ligandlarning <strong>yalpi formulasi har xil</strong>.</p>
                <p className="text-blue-200 text-xs mt-2">Misol: NH₃ va en (etilendiamin) — yalpisi farqli</p>
              </div>
            </div>
          </div>

          {/* QOIDALAR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">1️⃣</span>
                <h3 className="font-bold text-sky-300">Bir xil formula</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ikkala ligandning <strong>molekulyar formulasi bir xil</strong> bo'lishi shart.
              </p>
            </div>
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">2️⃣</span>
                <h3 className="font-bold text-sky-300">Farqli ichki tuzilish</h3>
              </div>
              <p className="text-blue-100 text-sm">
                O'rinbosar guruhlari yoki funktsional guruhlar <strong>turli pozitsiyalarda</strong>.
              </p>
            </div>
            <div className="bg-sky-900/30 border border-sky-600/40 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">3️⃣</span>
                <h3 className="font-bold text-sky-300">Bir xil donoligi</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Ligandlar bir xil <strong>dentatlik</strong>ga (bog'lanish nuqtasi soni) ega bo'lishi kerak.
              </p>
            </div>
          </div>
        </div>

        {/* 3 TA LIGAND MISOLI */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Asosiy <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-sky-200 text-lg mb-6 leading-relaxed max-w-4xl">
            O'rinbosar izomeriyasi asosan <strong className="text-sky-300">organik ligandlarda</strong> kuzatiladi,
            chunki ularda o'rinbosar guruhlari turli pozitsiyalarda joylashishi mumkin.
          </p>

          <div className="space-y-8">
            {izomerlar.map((cat) => (
              <div key={cat.num} className={`bg-gradient-to-br ${cat.bg} border rounded-3xl p-6 md:p-8`}>
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <span className="text-5xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-blue-300 font-bold bg-blue-900/40 inline-block px-3 py-1 rounded-full mb-1">
                      Misol {cat.num}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                    <p className="text-blue-200 text-sm">{cat.desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cat.izomerlar.map((iz, idx) => (
                    <div key={idx} className="bg-slate-950/70 border border-blue-700/30 rounded-2xl p-5 relative overflow-hidden">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className={`font-bold text-lg ${iz.rangColor}`}>{iz.name}</h4>
                      </div>
                      <p className="font-mono text-sky-300 text-sm mb-3">{iz.formula}</p>
                      <p className="text-blue-100 text-sm mb-4 leading-relaxed">{iz.izoh}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-blue-950/50 rounded-lg p-2 text-center">
                          <div className="text-xs text-blue-300 mb-1">Halqa turi</div>
                          <div className="text-sm font-bold text-sky-400">{iz.halqa}</div>
                        </div>
                        <div className="bg-blue-950/50 rounded-lg p-2 text-center">
                          <div className="text-xs text-blue-300 mb-1">Barqarorlik</div>
                          <div className="text-xs font-bold text-green-400">{iz.barqarorlik}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DIAMINOPROPAN BATAFSIL */}
        <div className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border border-sky-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⭐</span>
            Eng <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">klassik misol</span>
          </h2>

          <p className="text-sky-100 text-lg mb-6 leading-relaxed">
            Alfred Werner va keyinchilik Bailar tomonidan chuqur o'rganilgan — kobalt(III) komplekslarida
            <strong className="text-sky-300"> 1,2-diaminopropan (pn) </strong>
            va <strong className="text-sky-300"> 1,3-diaminopropan (tn) </strong> izomerlari:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* pn kompleksi */}
            <div className="bg-red-900/20 border border-red-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-2 flex items-center gap-2">
                <span>🔶</span> [Co(1,2-pn)₂Cl₂]⁺
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">1,2-diaminopropan — CH₃CH(NH₂)CH₂NH₂</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ Ikkala <strong>NH₂ guruhi qo'shni C da</strong></li>
                <li>✅ <strong>5 a'zoli xelat halqasi</strong> — eng barqaror halqalar biri</li>
                <li>⚠️ Metil guruhi halqa yonida — <strong>qo'shimcha sterik to'siq</strong></li>
                <li>✅ Co³⁺ bilan mustahkam kompleks hosil qiladi</li>
              </ul>
              <div className="bg-red-950/50 rounded-xl p-4 text-sm text-blue-100 border border-red-700/30">
                <strong className="text-red-300">Barqarorlik sababi:</strong> 5 a'zoli halqa —
                <em> ideal burchaklar</em> (~109°), kam halqa tarangligi.
              </div>
            </div>

            {/* tn kompleksi */}
            <div className="bg-pink-900/20 border border-pink-600/40 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-pink-300 mb-2 flex items-center gap-2">
                <span>🔶</span> [Co(tn)₂Cl₂]⁺
              </h3>
              <p className="font-mono text-sky-300 text-sm mb-3">1,3-diaminopropan — NH₂CH₂CH₂CH₂NH₂</p>
              <ul className="text-blue-100 text-sm space-y-2 mb-4">
                <li>✅ Ikkala <strong>NH₂ guruhi 3-pozitsiyada</strong></li>
                <li>✅ <strong>6 a'zoli xelat halqasi</strong> — biroz kamroq barqaror</li>
                <li>✅ Metil guruhi <strong>yo'q</strong> — toza chiziqli</li>
                <li>✅ Co³⁺ bilan yaxshi kompleks, ammo pn dan biroz kuchsizroq</li>
              </ul>
              <div className="bg-pink-950/50 rounded-xl p-4 text-sm text-blue-100 border border-pink-700/30">
                <strong className="text-pink-300">Kamroq barqarorlik:</strong> 6 a'zoli halqa —
                <em> biroz yuqoriroq taranglik</em> (konformatsion cheklovlar).
              </div>
            </div>
          </div>
        </div>

        {/* STERIK TA'SIR */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-sky-900/40 border border-indigo-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            Sterik ta'sir: <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Picolinlar misolida</span>
          </h2>
          <div className="bg-slate-950/50 rounded-2xl p-6 md:p-8 border border-indigo-700/30">
            <p className="text-sky-100 text-lg leading-relaxed mb-4">
              <strong className="text-yellow-400">Picolinlar</strong> (metilpiridinlar) sterik ta'sirni eng yaxshi ko'rsatadi.
              CH₃ guruhining <strong>piridin halqasida qayerda</strong> joylashuvi kompleks hosil bo'lishiga bevosita ta'sir qiladi:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-indigo-700">
                    <th className="py-3 px-4 text-sky-300 text-sm">Pikolin</th>
                    <th className="py-3 px-4 text-sky-300 text-sm">CH₃ joylashuvi</th>
                    <th className="py-3 px-4 text-sky-300 text-sm">Sterik to'siq</th>
                    <th className="py-3 px-4 text-sky-300 text-sm">Kompleks hosil bo'lishi</th>
                  </tr>
                </thead>
                <tbody className="text-blue-100 text-sm">
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">α-pikolin (2-metilpiridin)</td>
                    <td className="py-3 px-4 text-red-400 font-mono">2-pozitsiya (N yonida)</td>
                    <td className="py-3 px-4 text-red-400">Katta to'siq ⛔</td>
                    <td className="py-3 px-4">Kam yoki hech hosil bo'lmaydi</td>
                  </tr>
                  <tr className="border-b border-indigo-800/30">
                    <td className="py-3 px-4 font-bold">β-pikolin (3-metilpiridin)</td>
                    <td className="py-3 px-4 text-yellow-400 font-mono">3-pozitsiya</td>
                    <td className="py-3 px-4 text-yellow-400">O'rta to'siq</td>
                    <td className="py-3 px-4">O'racha hosil bo'ladi</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold">γ-pikolin (4-metilpiridin)</td>
                    <td className="py-3 px-4 text-green-400 font-mono">4-pozitsiya (N dan uzoq)</td>
                    <td className="py-3 px-4 text-green-400">To'siqsiz ✅</td>
                    <td className="py-3 px-4">Piridin kabi mustahkam kompleks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ANALITIK USULLAR */}
        <div className="bg-gradient-to-br from-teal-900/30 to-sky-900/30 border border-teal-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔍</span>
            Qanday <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">farqlash mumkin?</span>
          </h2>
          <p className="text-teal-100 mb-6 text-sm md:text-base">
            O'rinbosar izomerlarini farqlashda quyidagi usullar ishlatiladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-teal-300">¹H va ¹³C NMR</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Eng samarali usul — ligand ichidagi protonlarning signallari farq qiladi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• <strong>1,2-pn:</strong> CH₃ signali ~1.2 ppm (doublet)</li>
                <li>• <strong>tn:</strong> CH₃ yo'q, CH₂ signallari ko'rinadi</li>
                <li>• Xelat halqa shakli signal yorilishida ko'rinadi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚖️</span>
                <h3 className="text-lg font-bold text-teal-300">Mass spektrometriya (MS)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Parchalanish naqshlari turlicha:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• Turli <strong>fragmentsiya naqshlari</strong></li>
                <li>• Turli <strong>m/z piklari</strong></li>
                <li>• MS/MS yordamida izomerlar to'liq farqlanadi</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-teal-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Kristallda to'g'ridan-to'g'ri halqalarning shakli va o'lchami:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• 5 a'zoli halqa vs 6 a'zoli halqa — to'g'ridan ko'rinadi</li>
                <li>• <strong>Burchaklar va masofalar</strong> aniq o'lchanadi</li>
                <li>• Eng aniq, ammo sekin usul</li>
              </ul>
            </div>

            <div className="bg-teal-950/40 rounded-2xl p-6 border border-teal-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-teal-300">CD spektroskopiya (CD = circular dichroism)</h3>
              </div>
              <p className="text-teal-100 text-sm mb-2">Optik faol komplekslarda halqa shakli signal beradi:</p>
              <ul className="text-teal-200 text-xs space-y-1">
                <li>• Xelat halqaning <strong>δ yoki λ</strong> konformatsiyasi aniqlanadi</li>
                <li>• Turli Cotton effekti naqshlari</li>
                <li>• Xiralikni aniqlashda yordamchi usul</li>
              </ul>
            </div>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-blue-900/40 to-sky-900/40 border border-blue-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Asosiy ligand <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">juftliklarini</span> taqqoslash
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-blue-700">
                  <th className="py-3 px-4 text-sky-300 text-sm">Juftlik</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Umumiy formula</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Asosiy farqi</th>
                  <th className="py-3 px-4 text-sky-300 text-sm">Tarkibiy halqa</th>
                </tr>
              </thead>
              <tbody className="text-blue-100 text-sm">
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-sky-400">1,2-dap / 1,3-dap</td>
                  <td className="py-3 px-4 font-mono">C₃H₁₀N₂</td>
                  <td className="py-3 px-4">NH₂ lar orasi: 1 yoki 2 C atomi</td>
                  <td className="py-3 px-4">5 yoki 6 a'zoli halqa</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-indigo-400">orto- / para-fenilendiamin</td>
                  <td className="py-3 px-4 font-mono">C₆H₈N₂</td>
                  <td className="py-3 px-4">1,2 yoki 1,4 joylashuv</td>
                  <td className="py-3 px-4">Xelat yoki ko'prik</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-amber-400">2- / 3- / 4-pikolin</td>
                  <td className="py-3 px-4 font-mono">C₆H₇N</td>
                  <td className="py-3 px-4">CH₃ guruhi pozitsiyasi</td>
                  <td className="py-3 px-4">Sterik to'siq farqi</td>
                </tr>
                <tr className="border-b border-blue-800/30">
                  <td className="py-3 px-4 font-bold text-rose-400">1,2-butanodiol / 1,3-butanodiol</td>
                  <td className="py-3 px-4 font-mono">C₄H₁₀O₂</td>
                  <td className="py-3 px-4">OH lar joylashuvi</td>
                  <td className="py-3 px-4">Xelat halqa turi</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-cyan-400">orto- / meta- / para-xilol</td>
                  <td className="py-3 px-4 font-mono">C₈H₁₀</td>
                  <td className="py-3 px-4">CH₃ lar nisbiy joylashuvi</td>
                  <td className="py-3 px-4">π-ligand sifatida</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* AMALIY AHAMIYAT */}
        <div className="bg-gradient-to-br from-violet-900/40 to-slate-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Amaliy <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">ahamiyat</span>
          </h2>
          <p className="text-violet-100 mb-6 text-sm md:text-base">
            O'rinbosar izomeriyasining zamonaviy fanda bir necha muhim qo'llanilishi bor:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💊</span>
                <h3 className="text-lg font-bold text-violet-300">Dori moddalarining faolligi</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Turli izomer ligandlar turli <strong>farmakologik ta'sirga</strong> ega komplekslar beradi.
                Bir izomer shifobaxsh, ikkinchisi zaharli bo'lishi mumkin (klassik misol:
                <em> cisplatin</em> — saraton dorisi, uning <em>trans</em> izomeri — samarasiz).
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏭</span>
                <h3 className="text-lg font-bold text-violet-300">Kataliz</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Birikma ichidagi <strong>ligandning shakli katalitik tanlovlilikka</strong> ta'sir qiladi.
                Masalan, enantiomer toza mahsulot olish uchun xiral ligand izomerlari ishlatiladi
                (asimmetrik sintez).
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧲</span>
                <h3 className="text-lg font-bold text-violet-300">Magnit materiallar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Birikmalardagi <strong>sterik to'siq magnit almashinuv yo'llarini</strong> o'zgartiradi.
                Bir izomer — <em>ferromagnit</em>, boshqasi — <em>antiferromagnit</em> bo'lishi mumkin.
              </p>
            </div>

            <div className="bg-violet-950/40 rounded-2xl p-6 border border-violet-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🧫</span>
                <h3 className="text-lg font-bold text-violet-300">Biologik modellar</h3>
              </div>
              <p className="text-violet-100 text-sm">
                Fermentlar ichki <strong>o'rinbosar guruhlariga ega ligandlar</strong> (masalan,
                aminokislotalar) ishlatadi. Ularning izomeriyasini tushunish — biomimetik komplekslarni
                sintez qilishda muhim.
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
          <div className="space-y-4">
            <div className="bg-sky-900/40 border border-sky-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏛️</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-sky-400">John C. Bailar Jr. (1950-yillar)</h3>
                    <span className="px-2 py-1 bg-sky-600/30 text-sky-300 border border-sky-600/50 rounded-full text-xs">Pioneer tadqiqotchi</span>
                  </div>
                  <p className="text-sky-200 text-sm mb-2">
                    Bailar <strong>Illinoys universitetida</strong> diaminopropan izomerlarini Co(III)
                    komplekslarida chuqur o'rganib, <strong>ligand izomeriyasini rasmiylashtirdi</strong>.
                  </p>
                  <p className="text-sky-200 text-sm">
                    Uning ishi Werner nazariyasini zamonaviy darajada mustahkamladi va <em>xelat effekti</em>
                    haqidagi tushunchani mustahkamladi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-900/40 border border-indigo-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🧬</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-indigo-400">Chela halqa qoidalari (Chugaev, 1911)</h3>
                  </div>
                  <p className="text-sky-200 text-sm">
                    <strong>Lev Chugaev</strong> birinchi bo'lib xelat halqa shakli kompleksning barqarorligini
                    belgilashini ko'rsatdi: <strong>5 va 6 a'zoli halqalar eng barqaror</strong>
                    (3 yoki 4 a'zoli halqalar — yuqori taranglik). Bu bugungi o'rinbosar izomeriyasi tadqiqotlari
                    uchun asosdir.
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
              O'rinbosar izomeriya (ligand izomeriyasi) — <strong className="text-sky-300">ligandning ichki tuzilishi
              farq qilganda</strong> kuzatiladigan tuzilish izomeriyasi turi.
            </li>
            <li>
              Ikkala ligand <strong className="text-sky-300">bir xil molekulyar formulaga</strong>
              ega, ammo o'rinbosar guruhlarining joylashuvi farqli.
            </li>
            <li>
              Eng klassik misol: <strong className="text-sky-300">1,2-diaminopropan vs 1,3-diaminopropan</strong> —
              Co(III) kompleksida <strong>5 vs 6 a'zoli halqalar</strong> beradi.
            </li>
            <li>
              Aromatik misol: <strong className="text-sky-300">orto, meta, para diaminobenzol</strong> —
              biri xelat, boshqasi ko'prik ligandi.
            </li>
            <li>
              Sterik ta'sir — muhim omil: <strong>α-pikolin</strong> to'siqli,
              <strong> γ-pikolin</strong> to'siqsiz, shu sababli komplekslar turlicha barqaror.
            </li>
            <li>
              <strong className="text-sky-300">NMR spektroskopiya</strong> — farqlashning eng samarali usuli,
              chunki proton signallar to'g'ridan-to'g'ri halqaning ichki tuzilishini aks ettiradi.
            </li>
            <li>
              Zamonaviy fanda: dori moddalari, katalizatorlar, magnit materiallar,
              biomimetik modellar uchun muhim.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-sky-600/20 via-indigo-600/20 to-blue-600/20 border border-sky-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔷</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Xelat halqalarni <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              1,2-pn va tn komplekslarining <strong>5 vs 6 a'zoli halqa shakllari</strong>ni,
              metil guruhining fazodagi joylashuvini, Co-N bog' uzunliklarini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/orinbosar/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion" className="px-6 py-3 border border-blue-500 rounded-xl hover:bg-blue-800/50 text-blue-300 text-center">
            ← Koordinatsion izomeriya
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/konformatsion" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-bold text-center">
            Konformatsion izomeriyasi →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-blue-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">O'rinbosar (ligand) izomeriyasi • 1,2-dap / tn • Bailar (1950), Chugaev (1911)</p>
        </div>
      </footer>
    </main>
  )
}