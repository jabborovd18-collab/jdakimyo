import Link from "next/link"

export default function TuzilishIzomeriyasi() {
  const turlar = [
    { 
      href: "/oquv/izomeriyasi/tuzilish/ionlanish", 
      icon: "⚡", 
      title: "Ionlanish izomeriyasi", 
      desc: "[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br", 
      badge: "Asosiy", 
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", 
      has3D: false,
      gradient: "from-yellow-600/20 to-yellow-900/40",
      borderColor: "border-yellow-500/30",
      examples: "Ichki va tashqi sferadagi ionlar almashinadi"
    },
    { 
      href: "/oquv/izomeriyasi/tuzilish/gidrat", 
      icon: "💧", 
      title: "Gidrat izomeriyasi", 
      desc: "CrCl₃·6H₂O ning 3 ta izomeri", 
      badge: "Asosiy", 
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", 
      has3D: false,
      gradient: "from-blue-600/20 to-blue-900/40",
      borderColor: "border-blue-500/30",
      examples: "Suv molekulalari ichki yoki tashqi sferada"
    },
    { 
      href: "/oquv/izomeriyasi/tuzilish/boglanish", 
      icon: "🔗", 
      title: "Bog'lanish izomeriyasi", 
      desc: "[Co(NH₃)₅NO₂]²⁺ va [Co(NH₃)₅ONO]²⁺", 
      badge: "Asosiy", 
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", 
      has3D: true,
      gradient: "from-purple-600/20 to-purple-900/40",
      borderColor: "border-purple-500/30",
      examples: "Ambidentat ligand N yoki O orqali bog'lanadi"
    },
    { 
      href: "/oquv/izomeriyasi/tuzilish/koordinatsion", 
      icon: "🔄", 
      title: "Koordinatsion izomeriya", 
      desc: "[Cr(NH₃)₆][Fe(CN)₆] va [Fe(NH₃)₆][Cr(CN)₆]", 
      badge: "Asosiy", 
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", 
      has3D: true,
      gradient: "from-red-600/20 to-red-900/40",
      borderColor: "border-red-500/30",
      examples: "Ikki metall atomi almashinadi"
    },
    { 
      href: "/oquv/izomeriyasi/tuzilish/boshqa", 
      icon: "📚", 
      title: "Qolgan 6 ta tur", 
      desc: "O'rinbosar, konformatsion, holat, elektron, transformatsion, formal", 
      badge: "Qo'shimcha", 
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30", 
      has3D: false,
      gradient: "from-indigo-600/20 to-indigo-900/40",
      borderColor: "border-indigo-500/30",
      examples: "Kam uchraydigan turlar"
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
            <span className="text-yellow-400 font-semibold">🧬 Tuzilish izomeriyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🧬</span>
                Tuzilish (struktura) izomeriyasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Formulalar har xil yoziladigan izomerlar • 10 ta tur
              </p>
            </div>
            <Link href="/oquv/izomeriyasi" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Izomeriyasi bo'limi
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
              TUZILISH IZOMERIYASI — 10 TA TUR
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Tuzilish izomeriyasi
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">formulalar har xil yoziladi</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              Tuzilish izomeriyasida moddalarning formulalari <strong className="text-yellow-400">har xil yoziladi</strong>.
              Bunda ligandlarning ichki va tashqi sferada joylashishi, donor atomi yoki ion tarkibi farq qiladi.
            </p>

            {/* TEZ STATISTIKA */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-extrabold text-yellow-400">4</div>
                <div className="text-xs text-purple-400 mt-1">Asosiy turlar</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-2xl font-extrabold text-yellow-400">6</div>
                <div className="text-xs text-purple-400 mt-1">Qo'shimcha turlar</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🧬</div>
                <div className="text-2xl font-extrabold text-yellow-400">10</div>
                <div className="text-xs text-purple-400 mt-1">Jami turlar</div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 TA TUR — KATTA KARTOCHKALAR */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Barcha <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">turlar</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {turlar.map((t, i) => (
              <Link 
                key={i} 
                href={t.href}
                className={`group bg-gradient-to-br ${t.gradient} border ${t.borderColor} rounded-2xl p-6 hover:border-yellow-400/60 transition-all transform hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden`}
              >
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-white" />
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl group-hover:scale-110 transition-transform">{t.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs text-purple-500 font-bold">0{i+1}</span>
                        <h3 className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{t.title}</h3>
                      </div>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full border ${t.badgeColor} font-semibold mb-2`}>
                        {t.badge}
                      </span>
                      {t.has3D && (
                        <span className="ml-2 bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-bold">
                          3D
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-purple-300 text-sm mb-4 leading-relaxed">{t.desc}</p>
                  
                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-3 mb-4">
                    <div className="text-xs text-purple-400 mb-1">Qisqacha:</div>
                    <p className="text-xs text-purple-200">{t.examples}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-700/50">
                    <span className="text-xs text-purple-400">Batafsil o'qish</span>
                    <span className="text-yellow-400 group-hover:translate-x-2 transition-transform text-xl">→</span>
                  </div>
                </div>
              </Link>
            ))}
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
                    <h3 className="text-lg font-bold text-amber-400">Alfred Werner (1893)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel 1913</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1893:</strong> Koordinatsion nazariyani e'lon qildi. Ionlanish va gidrat izomeriyasini tushuntirdi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Koordinatsion kimyo asoschisi. Noorganik kimyoda birinchi Nobel.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔗</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Jørgensen (1894)</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1894:</strong> [Co(NH₃)₅(NO₂)]²⁺ va [Co(NH₃)₅(ONO)]²⁺ ni sintez qildi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Bog'lanish izomeriyasini birinchi marta kuzatdi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 border border-yellow-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🧬</div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Qaysi turdan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">boshlaysiz</span>?
            </h2>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
              Har bir tur batafsil tahlil va amaliy misollar bilan taqdim etilgan.
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/oquv/izomeriyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Izomeriyasi bo'limi
          </Link>
          <Link href="/oquv/izomeriyasi/stereo" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-black font-bold">
            Stereoizomeriya →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo</p>
          <p className="mt-1">Tuzilish izomeriyasi • 10 ta tur • Werner (Nobel 1913)</p>
        </div>
      </footer>
    </main>
  )
}