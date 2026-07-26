import Link from "next/link"
export default function BoglanishIzomeriyasi() {
  const izomerlar = [
    {
      num: 1,
      formula: "[Co(NH₃)₅NO₂]Cl₂",
      name: "Nitropentaamminkobalt(III) xlorid",
      rang: "Sariq",
      rangColor: "text-yellow-400",
      bg: "from-yellow-600/10 to-amber-900/30 border-yellow-500/30",
      boglanish: "N orqali (nitro, κN)",
      boglanishQisqa: "—NO₂",
      donorAtom: "Azot (N)",
      barqarorlik: "Yuqori (termodinamik barqaror)",
      lambdaMax: "~460 nm",
      IR: "~1420, ~1310 sm⁻¹",
      izoh: "NO₂⁻ ligand azot atomi orqali Co³⁺ ga bog'langan. Azot kuchli σ-donor bo'lgani uchun Co-N bog'i mustahkam. Bu izomer termodinamik jihatdan barqaror — uzoq vaqt saqlanadi va o'z-o'zidan nitrito shakliga o'tmaydi.",
    },
    {
      num: 2,
      formula: "[Co(NH₃)₅ONO]Cl₂",
      name: "Nitritopentaamminkobalt(III) xlorid",
      rang: "Qizg'ish-sariq",
      rangColor: "text-orange-400",
      bg: "from-orange-600/10 to-red-900/30 border-orange-500/30",
      boglanish: "O orqali (nitrito, κO)",
      boglanishQisqa: "—ONO",
      donorAtom: "Kislorod (O)",
      barqarorlik: "Kam barqaror (yorug'likda nitroga o'tadi)",
      lambdaMax: "~490 nm",
      IR: "~1460, ~1060 sm⁻¹",
      izoh: "NO₂⁻ ligand kislorod atomi orqali bog'langan. Co-O bog'i Co-N bog'idan kuchsizroq. Bu izomer kinetik mahsulot bo'lib, vaqt o'tishi bilan yoki yorug'lik ta'sirida barqarorroq nitro shakliga (N-bog'langan) o'tadi. Bu jarayon fotoizomerizatsiya deb ataladi.",
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-amber-950 to-orange-950 text-white">
      {/* HEADER */}
      <header className="border-b border-amber-800/50 sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-amber-400 flex-wrap">
            <Link href="/" className="hover:text-amber-300">🏠 Bosh sahifa</Link>
            <span className="text-amber-600">›</span>
            <Link href="/oquv" className="hover:text-amber-300">O'quv</Link>
            <span className="text-amber-600">›</span>
            <Link href="/oquv/izomeriyasi" className="hover:text-amber-300">Izomeriyasi</Link>
            <span className="text-amber-600">›</span>
            <Link href="/oquv/izomeriyasi/tuzilish" className="hover:text-amber-300">Tuzilish</Link>
            <span className="text-amber-600">›</span>
            <span className="text-amber-300 font-semibold">🔗 Bog'lanish izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-300 flex items-center gap-2">
                <span className="text-3xl">🔗</span>
                Bog'lanish izomeriyasi
              </h1>
              <p className="text-amber-500 text-sm mt-1">
                Ambidentat ligandlar har xil donor atom orqali bog'lanadi • Asosiy tur
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href="/oquv/izomeriyasi/tuzilish/boglanish/3d" className="text-xs bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1 shadow-lg shadow-amber-600/30">
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
        <div className="bg-gradient-to-br from-amber-900/60 to-orange-900/60 border border-amber-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-600/20 border border-amber-600/30 rounded-full text-xs font-semibold text-amber-300 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              ASOSIY IZOMERIYA TURI • JØRGENSEN 1894
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
                Bog'lanish izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">ambidentat ligand — har xil donor atom</span>
            </h2>
            <p className="text-lg md:text-xl text-amber-100 max-w-3xl mb-8 leading-relaxed">
              Bog'lanish izomeriyasida <strong className="text-amber-300">ambidentat ligandlar</strong>
              (bir nechta donor atomga ega bo'lgan ligandlar) markaziy metallga
              <strong className="text-amber-300"> har xil atomi orqali</strong> bog'lanadi.
              Natijada bir xil yalpi formulaga ega, lekin <strong className="text-amber-300">butunlay boshqa xususiyatlarga</strong>
              (rangi, barqarorligi, spektroskopik belgilari) ega moddalar hosil bo'ladi.
            </p>

            {/* STATISTIKA */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
              <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔗</div>
                <div className="text-2xl font-extrabold text-amber-300">N/O</div>
                <div className="text-xs text-amber-300 mt-1">Donor atomlar</div>
              </div>
              <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-2xl font-extrabold text-amber-300">2</div>
                <div className="text-xs text-amber-300 mt-1">Izomer rangi</div>
              </div>
              <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-2xl font-extrabold text-amber-300">1894</div>
                <div className="text-xs text-amber-300 mt-1">Jørgensen kashfiyoti</div>
              </div>
              <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚛️</div>
                <div className="text-2xl font-extrabold text-amber-300">Co³⁺</div>
                <div className="text-xs text-amber-300 mt-1">Markaziy atom</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 KATTA 3D TUGMA */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-amber-600/30 blur-3xl animate-pulse"></div>
          <Link
            href="/oquv/izomeriyasi/tuzilish/boglanish/3d"
            className="relative block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 rounded-3xl p-8 md:p-10 shadow-2xl shadow-amber-600/40 transform hover:scale-[1.02] transition-all group border border-amber-400/30"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className="text-7xl md:text-8xl group-hover:rotate-[360deg] transition-transform duration-700">🔗</div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white mb-2 backdrop-blur-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    INTERAKTIV 3D
                  </div>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                    3D modelni ochish
                  </h3>
                  <p className="text-amber-100 text-sm md:text-base">
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-yellow-200 text-xs">[Co(NH₃)₅NO₂]²⁺</span>
                    {' '}&nbsp;va&nbsp;{' '}
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-orange-200 text-xs">[Co(NH₃)₅ONO]²⁺</span>
                    {' '}— N va O orqali bog'lanishning fazoviy farqini ko'ring
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
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📖</span>
            Nazariy <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">asos</span>
          </h2>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-6 md:p-8 mb-6">
            <p className="text-amber-100 text-lg leading-relaxed mb-4">
              <strong className="text-amber-300 text-xl">Bog'lanish izomeriyasi</strong>
              (inglizcha: <em>linkage isomerism</em>) —
              <strong className="text-yellow-400"> ambidentat ligandlar</strong> markaziy metallga
              <strong className="text-yellow-400"> har xil donor atomi orqali</strong> bog'langanda
              hosil bo'ladigan tuzilish izomeriyasi turi.
            </p>
            <p className="text-amber-200 leading-relaxed">
              Ambidentat ligand — bu <strong className="text-amber-300">bir nechta turli atomida
              taqsimlanmagan elektron juftligiga</strong> ega bo'lgan ligand. U turli atomi orqali
              metall bilan koordinatsion bog' hosil qilishi mumkin. Har bir bog'lanish turi alohida
              <strong className="text-amber-300"> izomer</strong> hisoblanadi.
            </p>
          </div>

          {/* AMBIDENTAT LIGANDLAR JADVALI */}
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-2xl">🧪</span>
            Asosiy ambidentat ligandlar
          </h3>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left bg-slate-950/40 rounded-xl overflow-hidden border border-amber-700/30">
              <thead className="bg-amber-950/40">
                <tr>
                  <th className="py-3 px-4 text-amber-300 text-sm">Ligand</th>
                  <th className="py-3 px-4 text-amber-300 text-sm">Donor atom 1</th>
                  <th className="py-3 px-4 text-amber-300 text-sm">Donor atom 2</th>
                  <th className="py-3 px-4 text-amber-300 text-sm">IUPAC belgisi</th>
                </tr>
              </thead>
              <tbody className="text-amber-100 text-sm">
                <tr className="border-t border-amber-900/40">
                  <td className="py-3 px-4 font-bold text-white">NO₂⁻</td>
                  <td className="py-3 px-4">N (nitro)</td>
                  <td className="py-3 px-4">O (nitrito)</td>
                  <td className="py-3 px-4 font-mono text-xs">κN yoki κO</td>
                </tr>
                <tr className="border-t border-amber-900/40">
                  <td className="py-3 px-4 font-bold text-white">SCN⁻</td>
                  <td className="py-3 px-4">S (tiosianato)</td>
                  <td className="py-3 px-4">N (izotiosianato)</td>
                  <td className="py-3 px-4 font-mono text-xs">κS yoki κN</td>
                </tr>
                <tr className="border-t border-amber-900/40">
                  <td className="py-3 px-4 font-bold text-white">CN⁻</td>
                  <td className="py-3 px-4">C (siyano)</td>
                  <td className="py-3 px-4">N (izosiyano)</td>
                  <td className="py-3 px-4 font-mono text-xs">κC yoki κN</td>
                </tr>
                <tr className="border-t border-amber-900/40">
                  <td className="py-3 px-4 font-bold text-white">CO</td>
                  <td className="py-3 px-4">C (karbonil)</td>
                  <td className="py-3 px-4">O (izokarbonil)</td>
                  <td className="py-3 px-4 font-mono text-xs">κC yoki κO</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* HARD-SOFT ACID-BASE */}
          <div className="bg-gradient-to-br from-amber-950/60 to-orange-950/60 border border-amber-700/40 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">⚖️</span>
              Qattiq-Yumshoq Kislota-Asos (HSAB) nazariyasi
            </h3>
            <p className="text-amber-100 mb-4 text-sm leading-relaxed">
              <strong className="text-yellow-400">Qaysi donor atom orqali bog'lanish</strong> metallning qattiqligi/yumshoqligiga bog'liq:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-700/30">
                <h4 className="text-yellow-400 font-bold mb-2">Qattiq kislotalar</h4>
                <p className="text-amber-100 text-xs mb-2">Yuqori oksidlanish darajali, kichik radiusli metallar</p>
                <p className="text-amber-200 text-sm">→ <strong>Qattiq asoslar (O, F, N)</strong> orqali bog'lanadi</p>
                <p className="text-amber-300 text-xs mt-2">Misol: Cr³⁺, Fe³⁺, Co³⁺</p>
              </div>
              <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                <h4 className="text-orange-400 font-bold mb-2">Yumshoq kislotalar</h4>
                <p className="text-amber-100 text-xs mb-2">Past oksidlanish darajali, katta radiusli metallar</p>
                <p className="text-amber-200 text-sm">→ <strong>Yumshoq asoslar (S, P, I)</strong> orqali bog'lanadi</p>
                <p className="text-amber-300 text-xs mt-2">Misol: Pt²⁺, Pd²⁺, Ag⁺</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2 TA IZOMER BATAFSIL */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔬</span>
            Klassik misol: <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Nitro/Nitrito</span>
          </h2>
          <p className="text-amber-200 text-lg mb-6 leading-relaxed max-w-4xl">
            Sophus Jørgensen <strong className="text-amber-300">1894-yilda</strong> birinchi bo'lib
            kobalt(III) ning nitro va nitrito komplekslarini sintez qildi. Werner bu komplekslarni o'rganib,
            rangga qarab bog'lanish turini <strong className="text-amber-300">rentgen difraksiyasi yo'q davrda</strong>
            to'g'ri bashorat qilgan!
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
                        <span className="text-xs text-amber-300 font-bold bg-amber-900/40 px-3 py-1 rounded-full">
                          Izomer {iz.num}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-amber-600/20 border border-amber-500/30 ${iz.rangColor}`}>
                          🎨 {iz.rang}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{iz.name}</h3>
                      <p className="font-mono text-xl md:text-2xl text-amber-300 font-semibold">{iz.formula}</p>
                    </div>
                  </div>

                  <p className="text-amber-100 leading-relaxed mb-6 text-sm md:text-base">
                    💡 {iz.izoh}
                  </p>

                  {/* Bog'lanish turi ko'rgazmali */}
                  <div className="bg-slate-950/60 border border-amber-700/50 rounded-2xl p-5 mb-6">
                    <div className="text-xs text-amber-300 mb-3 font-bold">🔗 BOG'LANISH TURI:</div>
                    <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-lg">
                      <span className="bg-amber-950/80 px-4 py-2 rounded-lg border border-amber-600/50">
                        <span className="text-cyan-300">Co³⁺</span>
                        <span className="text-white mx-2">—</span>
                        <span className="text-yellow-400 font-bold text-xl">{iz.boglanishQisqa}</span>
                      </span>
                      <span className="text-amber-400 font-bold">{iz.boglanish}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-amber-300 mb-1">Donor atom</div>
                      <div className="text-base md:text-lg font-extrabold text-yellow-400">{iz.donorAtom}</div>
                    </div>
                    <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-amber-300 mb-1">λmax (UV-Vis)</div>
                      <div className="text-base md:text-lg font-extrabold text-cyan-300">{iz.lambdaMax}</div>
                    </div>
                    <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-amber-300 mb-1">IR chastotalari</div>
                      <div className="text-xs md:text-sm font-extrabold text-green-300">{iz.IR}</div>
                    </div>
                    <div className="bg-amber-950/50 border border-amber-700/30 rounded-xl p-4 text-center">
                      <div className="text-xs text-amber-300 mb-1">Barqarorlik</div>
                      <div className="text-xs font-extrabold text-orange-300">{iz.barqarorlik.split(" ")[0]}</div>
                    </div>
                  </div>

                  <div className="bg-amber-950/40 rounded-xl p-4 border border-amber-700/30">
                    <div className="text-xs text-amber-300 mb-2">⚖️ Termodinamik/Kinetik tahlil:</div>
                    <p className="text-amber-200 text-sm">{iz.barqarorlik}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WERNER DAHOSI */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 border border-yellow-600/40 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            Werner <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">dahosi</span>
          </h2>
          <div className="bg-yellow-950/40 rounded-2xl p-6 md:p-8 border border-yellow-700/30">
            <p className="text-yellow-100 text-lg leading-relaxed mb-4">
              Werner rentgen difraksiyasi <strong className="text-yellow-300">ixtiro qilinishidan 30 yil oldin</strong>
              bog'lanish turini faqat <strong className="text-yellow-300">rang farqiga qarab</strong> to'g'ri bashorat qilgan!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-yellow-900/30 rounded-xl p-4 border border-yellow-700/30">
                <h4 className="text-yellow-400 font-bold mb-2">🟡 Nitro (sariq)</h4>
                <p className="text-yellow-200 text-sm">6 ta N-donor (5 NH₃ + 1 NO₂)</p>
                <p className="text-yellow-300 text-xs mt-2">→ Kuchliroq ligand maydoni</p>
                <p className="text-yellow-300 text-xs">→ Katta Δo, qisqa λ yutiladi</p>
                <p className="text-yellow-300 text-xs">→ Sariq rang ko'rinadi</p>
              </div>
              <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-700/30">
                <h4 className="text-orange-400 font-bold mb-2">🟠 Nitrito (qizg'ish)</h4>
                <p className="text-yellow-200 text-sm">5 ta N-donor + 1 ta O-donor</p>
                <p className="text-yellow-300 text-xs mt-2">→ Kuchsizroq ligand maydoni</p>
                <p className="text-yellow-300 text-xs">→ Kichik Δo, uzun λ yutiladi</p>
                <p className="text-yellow-300 text-xs">→ Qizg'ish rang ko'rinadi</p>
              </div>
            </div>
            <p className="text-yellow-200 text-sm italic border-l-4 border-yellow-500 pl-4">
              &quot;Agar kompleksda bitta O-donor bo'lsa, maydon kuchsizroq bo'ladi va rang uzun to'lqin tomon siljiydi.&quot;
              <br />
              <span className="text-yellow-400">— A. Werner bashorati (1893)</span>
            </p>
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-700/50 rounded-3xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Ikkala izomerni <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">taqqoslash</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-amber-700">
                  <th className="py-3 px-4 text-amber-300 text-sm">Xususiyat</th>
                  <th className="py-3 px-4 text-yellow-400 text-sm">Nitro (Izomer 1)</th>
                  <th className="py-3 px-4 text-orange-400 text-sm">Nitrito (Izomer 2)</th>
                </tr>
              </thead>
              <tbody className="text-amber-100 text-sm">
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold text-white">Formula</td>
                  <td className="py-3 px-4 font-mono text-yellow-300">[Co(NH₃)₅NO₂]Cl₂</td>
                  <td className="py-3 px-4 font-mono text-orange-300">[Co(NH₃)₅ONO]Cl₂</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">IUPAC nomi</td>
                  <td className="py-3 px-4 text-xs">Nitropentaamminkobalt(III) xlorid</td>
                  <td className="py-3 px-4 text-xs">Nitritopentaamminkobalt(III) xlorid</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">Rangi</td>
                  <td className="py-3 px-4">🟡 Sariq</td>
                  <td className="py-3 px-4">🟠 Qizg'ish-sariq</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">Donor atom</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">Azot (N)</td>
                  <td className="py-3 px-4 text-orange-400 font-bold">Kislorod (O)</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">κ belgisi</td>
                  <td className="py-3 px-4 font-mono">κN</td>
                  <td className="py-3 px-4 font-mono">κO</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">λmax (UV-Vis)</td>
                  <td className="py-3 px-4">~460 nm</td>
                  <td className="py-3 px-4">~490 nm</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">IR ν(NO₂)</td>
                  <td className="py-3 px-4">~1420, ~1310 sm⁻¹</td>
                  <td className="py-3 px-4">~1460, ~1060 sm⁻¹</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">Co-X bog' uzunligi</td>
                  <td className="py-3 px-4">~1.95 Å (Co-N)</td>
                  <td className="py-3 px-4">~2.05 Å (Co-O)</td>
                </tr>
                <tr className="border-b border-amber-800/30">
                  <td className="py-3 px-4 font-bold">Barqarorlik</td>
                  <td className="py-3 px-4 text-green-400 font-bold">✓ Yuqori</td>
                  <td className="py-3 px-4 text-red-400 font-bold">✗ Kinetik mahsulot</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Fotoizomerizatsiya</td>
                  <td className="py-3 px-4">—</td>
                  <td className="py-3 px-4">→ Nitroga o'tadi</td>
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
            Bog'lanish izomerlarini farqlashda bir nechta instrumental usul qo'llaniladi:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">📡</span>
                <h3 className="text-lg font-bold text-green-300">IR spektroskopiya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                NO₂ va ONO bog'larining <strong>tebranish chastotalari</strong> farq qiladi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>Nitro (κN):</strong> ν(NO₂) ~1420, ~1310 sm⁻¹</li>
                <li>• <strong>Nitrito (κO):</strong> ν(ONO) ~1460, ~1060 sm⁻¹</li>
                <li>• Eng ishonchli va tez farqlash usuli</li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🎨</span>
                <h3 className="text-lg font-bold text-green-300">UV-Vis spektroskopiya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                d-d o'tishlar <strong>turli to'lqin uzunligida</strong> yutiladi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>Nitro:</strong> λmax ~460 nm (sariq)</li>
                <li>• <strong>Nitrito:</strong> λmax ~490 nm (qizg'ish)</li>
                <li>• Kristall maydon nazariyasi bilan tushuntiriladi</li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🔬</span>
                <h3 className="text-lg font-bold text-green-300">Rentgen difraksiyasi (XRD)</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                Kristall panjarada <strong>bog' uzunliklari</strong> aniqlanadi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• <strong>Co-N:</strong> ~1.95 Å (qisqa, kuchli)</li>
                <li>• <strong>Co-O:</strong> ~2.05 Å (uzun, kuchsiz)</li>
                <li>• Atomlar joylashuvi to'g'ridan-to'g'ri ko'rinadi</li>
              </ul>
            </div>

            <div className="bg-green-950/40 rounded-2xl p-6 border border-green-700/30">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⚛️</span>
                <h3 className="text-lg font-bold text-green-300">NMR spektroskopiya</h3>
              </div>
              <p className="text-green-100 text-sm mb-2">
                <strong>¹⁵N NMR</strong> va <strong>¹⁷O NMR</strong> orqali donor atom aniqlanadi:
              </p>
              <ul className="text-green-200 text-xs space-y-1">
                <li>• Nitroda ¹⁵N signali kuchli siljiydi</li>
                <li>• Nitritoda ¹⁷O signali aniqlanadi</li>
                <li>• Suyuq holatda ham qo'llaniladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FOTOIZOMERIZATSIYA */}
        <div className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">💫</span>
            Fotoizomerizatsiya: <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Nitrito → Nitro</span>
          </h2>
          <div className="bg-violet-950/40 rounded-2xl p-6 md:p-8 border border-violet-700/30">
            <p className="text-violet-100 text-lg leading-relaxed mb-4">
              Nitrito izomeri (O-bog'langan) <strong className="text-violet-300">yorug'lik yoki issiqlik</strong>
              ta'sirida barqarorroq nitro izomeriga (N-bog'langan) aylanadi. Bu hodisa
              <strong className="text-violet-300"> fotoizomerizatsiya</strong> deb ataladi va birinchi marta
              <strong className="text-violet-300"> 1907-yilda</strong> kuzatilgan.
            </p>
            <div className="bg-slate-950/60 rounded-xl p-6 border border-violet-700/30 text-center">
              <div className="flex items-center justify-center gap-4 flex-wrap font-mono text-lg">
                <span className="bg-orange-950/60 px-4 py-3 rounded-lg border border-orange-600/50">
                  <span className="text-orange-400">[Co(NH₃)₅ONO]²⁺</span>
                  <div className="text-xs text-orange-300 mt-1">Nitrito (qizg'ish)</div>
                </span>
                <div className="text-violet-400 flex flex-col items-center">
                  <span className="text-2xl">→</span>
                  <span className="text-xs text-violet-300">hν yoki Δ</span>
                </div>
                <span className="bg-yellow-950/60 px-4 py-3 rounded-lg border border-yellow-600/50">
                  <span className="text-yellow-400">[Co(NH₃)₅NO₂]²⁺</span>
                  <div className="text-xs text-yellow-300 mt-1">Nitro (sariq)</div>
                </span>
              </div>
              <p className="text-violet-200 text-sm mt-4">
                O-bog'lanishdan N-bog'lanishga o'tish <strong className="text-violet-300">intramolekulyar</strong>
                jarayon — ligand to'liq ajralmaydi, faqat bog'lanish atomi o'zgaradi.
              </p>
            </div>
          </div>
        </div>

        {/* BOSHA MISOLLAR */}
        <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-700/50 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🧬</span>
            Boshqa <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">misollar</span>
          </h2>
          <p className="text-amber-100 mb-6 text-sm md:text-base">
            Bog'lanish izomeriyasi faqat NO₂⁻/ONO⁻ da emas, balki boshqa ambidentat ligandlarda ham uchraydi:
          </p>

          <div className="space-y-4">
            <div className="bg-amber-950/40 rounded-2xl p-6 border border-amber-700/30">
              <h3 className="text-lg font-bold text-purple-400 mb-3">
                🔷 SCN⁻ / NCS⁻ — Tiosianat izomeriyasi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(NH₃)₅SCN]²⁺</p>
                  <p className="text-amber-200 text-xs">S orqali bog'langan (κS)</p>
                  <p className="text-amber-300 text-xs mt-1">Yumshoq donor: S atomi</p>
                </div>
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Co(NH₃)₅NCS]²⁺</p>
                  <p className="text-amber-200 text-xs">N orqali bog'langan (κN)</p>
                  <p className="text-amber-300 text-xs mt-1">Qattiq donor: N atomi</p>
                </div>
              </div>
              <p className="text-amber-300 text-xs mt-3">
                💡 <strong>HSAB qoidasi:</strong> Co³⁺ (qattiq kislota) — N orqali, Pt²⁺ (yumshoq kislota) — S orqali
              </p>
            </div>

            <div className="bg-amber-950/40 rounded-2xl p-6 border border-amber-700/30">
              <h3 className="text-lg font-bold text-blue-400 mb-3">
                💙 CN⁻ / NC⁻ — Siyanid izomeriyasi
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Fe(CN)₆]⁴⁻</p>
                  <p className="text-amber-200 text-xs">C orqali bog'langan (siyano, κC)</p>
                  <p className="text-amber-300 text-xs mt-1">Barqaror (deyarli har doim)</p>
                </div>
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Fe(NC)₆]⁴⁻</p>
                  <p className="text-amber-200 text-xs">N orqali bog'langan (izosiyano, κN)</p>
                  <p className="text-amber-300 text-xs mt-1">Juda kam uchraydi</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-950/40 rounded-2xl p-6 border border-amber-700/30">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">
                🔷 Ru³⁺ komplekslari (zamonaviy misol)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Ru(NH₃)₅NO₂]²⁺</p>
                  <p className="text-amber-200 text-xs">Nitro shakl (κN)</p>
                </div>
                <div className="bg-amber-950/60 rounded-lg p-3">
                  <p className="text-yellow-400 font-mono text-xs mb-1">[Ru(NH₃)₅ONO]²⁺</p>
                  <p className="text-amber-200 text-xs">Nitrito shakl (κO)</p>
                </div>
              </div>
              <p className="text-amber-300 text-xs mt-3">
                💡 Ru³⁺ komplekslari <strong>fotokimyoviy xotira qurilmalarida</strong> ishlatiladi
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
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔗</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-amber-400">Sophus Mads Jørgensen (1894)</h3>
                    <span className="px-2 py-1 bg-amber-600/30 text-amber-400 border border-amber-600/50 rounded-full text-xs">Birinchi sintez</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">
                    <strong>1894:</strong> Daniyalik kimyogar Jørgensen birinchi bo'lib
                    <strong> [Co(NH₃)₅NO₂]Cl₂</strong> (sariq) va <strong>[Co(NH₃)₅ONO]Cl₂</strong> (qizg'ish)
                    komplekslarini sintez qildi. U ikkalasi ham bir xil tarkibga ega, lekin
                    <strong> turli rang va xususiyatlarga</strong> ega ekanligini kuzatdi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Bu birinchi marta bir xil formulali moddalarning
                    <strong> turli xil tuzilishga</strong> ega bo'lishi mumkinligini ko'rsatdi — bog'lanish izomeriyasining tug'ilishi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-3">
                    <h3 className="text-xl font-bold text-amber-400">Alfred Werner (1893-1907)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-3">
                    Werner <strong>rentgen difraksiyasi ixtiro qilinishidan oldin</strong>
                    rang farqiga qarab bog'lanish turini to'g'ri bashorat qildi:
                    <strong> 6 ta N-donor = sariq, 5 ta N-donor = qizg'ish</strong>.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>1907:</strong> Fotoizomerizatsiya hodisasi (nitrito → nitro) birinchi marta kuzatildi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 border border-amber-500/20 rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-5 flex items-center gap-3">
            <span className="text-3xl">✅</span>
            Asosiy <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">xulosalar</span>
          </h2>
          <ol className="space-y-3 text-amber-100 list-decimal list-inside">
            <li>
              Bog'lanish izomeriyasi — <strong className="text-amber-300">ambidentat ligandlar har xil donor atom
              orqali</strong> metallga bog'langanda kuzatiladi.
            </li>
            <li>
              Klassik misol: <strong className="text-amber-300">[Co(NH₃)₅NO₂]²⁺</strong>
              (nitro, sariq, κN) va <strong className="text-amber-300">[Co(NH₃)₅ONO]²⁺</strong>
              (nitrito, qizg'ish, κO).
            </li>
            <li>
              Asosiy ambidentat ligandlar: <strong>NO₂⁻/ONO⁻, SCN⁻/NCS⁻, CN⁻/NC⁻, CO</strong>.
            </li>
            <li>
              <strong className="text-amber-300">HSAB nazariyasi</strong> qaysi donor atom orqali
              bog'lanishni bashorat qiladi (qattiq metall → qattiq donor).
            </li>
            <li>
              <strong className="text-amber-300">IR spektroskopiya</strong> eng ishonchli farqlash usuli
              (ν(NO₂) chastotalari farq qiladi).
            </li>
            <li>
              Nitrito izomeri <strong className="text-amber-300">yorug'lik ta'sirida</strong>
              barqaror nitro izomeriga o'tadi (fotoizomerizatsiya).
            </li>
            <li>
              Jørgensen 1894-yilda birinchi sintez qildi, Werner rangga qarab bog'lanish turini bashorat qildi.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/20 to-red-600/20 border border-amber-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔗</div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              Ikkala izomerni <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">3D da</span> ko'ring!
            </h2>
            <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
              Interaktiv 3D modellarda N va O donor atomlarining fazoviy joylashuvini,
              bog' uzunliklari va burchaklarini ko'ring.
            </p>
            <Link
              href="/oquv/izomeriyasi/tuzilish/boglanish/3d"
              className="inline-block px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-600/30"
            >
              🧊 3D modelni ochish
            </Link>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/gidrat" className="px-6 py-3 border border-amber-500 rounded-xl hover:bg-amber-800/50 text-amber-300 text-center">
            ← Gidrat izomeriyasi
          </Link>
          <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-bold text-center">
            Koordinatsion izomeriya →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-amber-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Bog'lanish izomeriyasi • Nitro/Nitrito • Jørgensen (1894), Werner (Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}