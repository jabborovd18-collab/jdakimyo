import Link from "next/link"

export default function Oquv() {
  const bolimlar = [
    {
      href: "/oquv/nomlanishi",
      icon: "📖",
      title: "Nomlanishi",
      desc: "IUPAC qoidalari, formula yozish, ligandlar",
      badge: "oson",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/oquv/klassifikatsiyasi",
      icon: "📊",
      title: "Klassifikatsiyasi",
      desc: "Sinf, ligand, zaryad bo'yicha tasniflash",
      badge: "oson",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/oquv/fazoviy",
      icon: "💎",
      title: "Fazoviy tuzilishi",
      desc: "Geometrik shakllar va 3D modellar",
      badge: "o'rtacha qiyin",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/oquv/izomeriyasi",
      icon: "🔄",
      title: "Izomeriyasi",
      desc: "Tuzilish va stereoizomeriya turlari",
      badge: "o'rtacha qiyin",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/oquv/kimyoviy-boglanish",
      icon: "🔗",
      title: "Kimyoviy bog'lanish",
      desc: "VB nazariyasi, kristall maydon, Yan-Teller effekti",
      badge: "biroz murakab",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/oquv/video-darsliklar",
      icon: "🎬",
      title: "Video darsliklar va quiz testlar",
      desc: "Barcha mavzular bo'yicha videolar va testlar",
      badge: "mustahkamlaydi",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          📚 O'quv bo'limi
        </h1>
      </header>

      {/* Iconkalar grid */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-purple-300 text-center mb-10">
          Kompleks birikmalarni to'liq o'rganish uchun kerakli barcha bo'limlar
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{b.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-white">{b.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full border ${b.badgeColor} font-semibold`}>
                  {b.badge}
                </span>
              </div>
              <p className="text-purple-300 text-sm">{b.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  )
}