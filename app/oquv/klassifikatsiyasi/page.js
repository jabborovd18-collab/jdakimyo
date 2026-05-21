import Link from "next/link"

export default function Klassifikatsiyasi() {
  const bolimlar = [
    {
      href: "/oquv/klassifikatsiyasi/sinf",
      icon: "🧪",
      title: "Qaysi birikmalar sinfiga ko'ra",
      desc: "Kompleks kislotalar • Kompleks asoslar • Kompleks tuzlar"
    },
    {
      href: "/oquv/klassifikatsiyasi/ligand",
      icon: "🧩",
      title: "Ligandlar tabiatiga ko'ra",
      desc: "Akvakomplekslar • Ammiakatlar • Atsidokomplekslar • Gidroksokomplekslar"
    },
    {
      href: "/oquv/klassifikatsiyasi/zaryad",
      icon: "⚡",
      title: "Kompleks zaryadiga ko'ra",
      desc: "Kation komplekslar • Anion komplekslar • Neytral komplekslar"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">📊 Klassifikatsiyasi</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarni tasniflashning 3 ta usuli</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Kompleks birikmalarni sinflarga ajratish</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Ligandlar bo'yicha tasniflash</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Zaryadiga ko'ra ajratish</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-400 mt-1">✅</span>
              <span>Har bir turga misollar keltirish</span>
            </div>
          </div>
        </div>

        {/* 3 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-cyan-400/50 transition-all transform hover:-translate-y-2"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                {b.title}
              </h3>
              <p className="text-purple-300 text-sm">{b.desc}</p>
            </Link>
          ))}
        </div>

        {/* Pastki ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.2-bo'lim)
          </p>
        </div>

      </section>

    </main>
  )
}