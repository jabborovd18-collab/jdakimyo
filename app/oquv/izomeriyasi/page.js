import Link from "next/link"

export const metadata = {
  title: "Kompleks birikmalar izomeriyasi",
  description:
    "Koordinatsion kimyoda tuzilish va stereoizomeriya turlari: geometrik, optik, ionlanish, bog'lanish va gidrat izomeriyasi — misollar bilan.",
}

export default function Izomeriyasi() {
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
            <span className="text-yellow-400 font-semibold">🔄 Izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🔄</span>
                Kompleks birikmalar izomeriyasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Koordinatsion kimyo — Tuzilish va stereoizomeriya turlari
              </p>
            </div>
            <Link href="/oquv" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← O'quv bo'limi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-400 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              KOORDINATSION KIMYO — 12 TA IZOMERIYA TURI
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Izomeriya
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">turlari va mexanizmlari</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              Kompleks birikmalarda <strong className="text-yellow-400">12 ta izomeriya turi</strong> mavjud.
              Quyidagi 2 ta asosiy bo'limdan birini tanlang va batafsil o'rganing.
            </p>

            {/* TEZ STATISTIKA */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-2xl font-extrabold text-yellow-400">10</div>
                <div className="text-xs text-purple-400 mt-1">Tuzilish turlari</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-extrabold text-yellow-400">2</div>
                <div className="text-xs text-purple-400 mt-1">Stereoizomeriya</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-extrabold text-yellow-400">1</div>
                <div className="text-xs text-purple-400 mt-1">Nobel mukofoti</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY MAVZULAR — 2 TA KATTA KARTOCHKA */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Asosiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">mavzular</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TUZILISH IZOMERIYASI */}
            <Link
              href="/oquv/izomeriyasi/tuzilish"
              className="group bg-gradient-to-br from-yellow-600/20 to-yellow-900/40 border border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-400/60 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-20 bg-yellow-500" />
              <div className="relative z-10">
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🧬</div>
                <h3 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-3">
                  Tuzilish (struktura) izomeriyasi
                </h3>
                <p className="text-purple-200 mb-4 leading-relaxed">
                  Formulalar <strong className="text-yellow-400">har xil yoziladigan</strong> izomerlar.
                  Ichki va tashqi sferadagi ionlar almashinadi, donor atomi farq qiladi.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-yellow-400">•</span>
                    <span>Ionlanish izomeriyasi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-yellow-400">•</span>
                    <span>Gidrat izomeriyasi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-yellow-400">•</span>
                    <span>Bog'lanish (linkage) izomeriyasi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-yellow-400">•</span>
                    <span>Koordinatsion izomeriya</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-yellow-400">•</span>
                    <span>+ 6 ta boshqa tur</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-yellow-500/30">
                  <span className="text-sm text-yellow-400 font-semibold">10 ta izomeriya turi</span>
                  <span className="text-yellow-400 group-hover:translate-x-2 transition-transform text-xl">→</span>
                </div>
              </div>
            </Link>

            {/* STEREOIZOMERIYA */}
            <Link
              href="/oquv/izomeriyasi/stereo"
              className="group bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-blue-500/30 rounded-3xl p-8 hover:border-blue-400/60 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-20 bg-blue-500" />
              <div className="relative z-10">
                <div className="text-7xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
                <h3 className="text-2xl md:text-3xl font-bold text-blue-400 mb-3">
                  Stereoizomeriya
                </h3>
                <p className="text-purple-200 mb-4 leading-relaxed">
                  Formulalar <strong className="text-blue-400">bir xil</strong>, lekin ligandlarning 
                  fazoda joylashishi har xil.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-blue-400">•</span>
                    <span>Geometrik izomeriya (sis-trans)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-blue-400">•</span>
                    <span>Fac-mer izomerlar (oktaedrik)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-blue-400">•</span>
                    <span>Optik izomeriya (enantiomerlar)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-purple-300">
                    <span className="text-blue-400">•</span>
                    <span>Xiral komplekslar</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-blue-500/30">
                  <span className="text-sm text-blue-400 font-semibold">2 ta asosiy tur</span>
                  <span className="text-blue-400 group-hover:translate-x-2 transition-transform text-xl">→</span>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Alfred Werner (1913)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel mukofoti</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1893:</strong> Koordinatsion nazariyani e'lon qildi. Izomeriya turlarini tushuntirdi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Koordinatsion kimyo asoschisi. Noorganik kimyoda birinchi Nobel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💊</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Barnett Rosenberg (1965)</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1965:</strong> Sisplatinning saraton dorisi ekanligini kashf qildi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Geometrik izomerlarning biologik faolligi farqini ko'rsatdi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← O'quv bo'limi
          </Link>
          <Link href="/oquv/kimyoviy-boglanish" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-black font-bold">
            Kimyoviy bog'lanish →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Izomeriya turlari • Tuzilish • Stereoizomeriya • Werner (Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}