import Link from "next/link"

export default function SinfBoyicha() {
  const sinflar = [
    {
      href: "/oquv/klassifikatsiyasi/sinf/kislota",
      icon: "🧪",
      title: "Kompleks kislotalar",
      desc: "Tarkibida vodorod kationi (H⁺) bo'lgan komplekslar",
      misol: "H₂[SiF₆], H[AuCl₄]",
      rang: "text-red-400",
      borderRang: "hover:border-red-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/sinf/asos",
      icon: "🧴",
      title: "Kompleks asoslar",
      desc: "Tarkibida gidroksid ioni (OH⁻) bo'lgan komplekslar",
      misol: "[Ag(NH₃)₂]OH",
      rang: "text-blue-400",
      borderRang: "hover:border-blue-400/50"
    },
    {
      href: "/oquv/klassifikatsiyasi/sinf/tuz",
      icon: "🧂",
      title: "Kompleks tuzlar",
      desc: "Tarkibida H⁺ yoki OH⁻ bo'lmagan komplekslar",
      misol: "K₄[Fe(CN)₆], [Cr(H₂O)₆]Cl₃",
      rang: "text-yellow-400",
      borderRang: "hover:border-yellow-400/50"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🧪 Birikmalar sinfiga ko'ra</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalar qaysi birikmalar sinfiga kirishiga ko'ra 3 turga bo'linadi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Asosiy bo'linish</h2>
          <p className="text-purple-200 leading-relaxed">
            Kompleks birikmalar <strong className="text-yellow-400">qaysi birikmalar sinfiga kirishiga ko'ra</strong> 3 ta asosiy turga bo'linadi. 
            Ular tashqi sferasining tarkibi bilan farq qiladi va har biri o'ziga xos kimyoviy xossalarga ega.
          </p>
        </div>

        {/* 3 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sinflar.map((s, i) => (
            <Link 
              key={i}
              href={s.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 ${s.borderRang} transition-all transform hover:-translate-y-2`}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
              <h3 className={`text-lg font-bold mb-3 group-hover:${s.rang} transition-colors text-white`}>
                {s.title}
              </h3>
              <p className="text-purple-300 text-sm mb-4">{s.desc}</p>
              <div className="bg-purple-800/40 rounded-lg p-3 font-mono text-xs text-purple-400">
                {s.misol}
              </div>
            </Link>
          ))}
        </div>

      </section>

    </main>
  )
}