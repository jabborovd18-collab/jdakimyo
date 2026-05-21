import Link from "next/link"

export default function Maqolalar() {
  const bolimlar = [
    {
      href: "/ilmiy/maqolalar/yangi",
      icon: "🆕",
      title: "Yangi maqolalar",
      desc: "Oxirgi 7 kun ichida qo'shilgan eng so'nggi ilmiy maqolalar",
      badge: "So'nggi",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400",
      gradient: "from-green-600 to-emerald-600"
    },
    {
      href: "/ilmiy/maqolalar/baza",
      icon: "📚",
      title: "Umumiy maqolalar bazasi",
      desc: "Barcha maqolalar • Qidiruv tizimi • Mavzu bo'yicha filtr • Kalit so'zlar orqali izlash",
      badge: "Barchasi",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400",
      gradient: "from-blue-600 to-cyan-600"
    },
    {
      href: "/ilmiy/maqolalar/yaratish",
      icon: "✍️",
      title: "O'z maqolangizni yarating",
      desc: "DOCX formatida maqola yuklang • Admin tasdiqlashidan so'ng chop etiladi • Plagiat tekshiriladi",
      badge: "Yangi",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400",
      gradient: "from-yellow-500 to-orange-500"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Ilmiy bo'lim</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📝 Maqolalar</h1>
          <p className="text-purple-400 text-sm">Ilmiy maqolalar • Yangi • Baza • O'zingiz yarating</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Maqolalar bo'limi haqida</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl mb-2">📄</div>
              <div className="text-2xl font-bold text-green-400">DOCX</div>
              <div className="text-purple-400 text-sm">Qabul qilinadi</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-2xl font-bold text-blue-400">Plagiat</div>
              <div className="text-purple-400 text-sm">Tekshiriladi</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-yellow-400">Admin</div>
              <div className="text-purple-400 text-sm">Tasdiqlaydi</div>
            </div>
          </div>
        </div>

        {/* 3 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-3xl mx-auto mb-5 group-hover:scale-110 transition-transform`}>
                {b.icon}
              </div>
              <h3 className={`text-xl font-bold text-white mb-3 ${b.rangText} transition-colors`}>
                {b.title}
              </h3>
              <p className="text-purple-300 text-sm mb-4">{b.desc}</p>
              <span className={`inline-block text-xs px-3 py-1 rounded-full border ${b.badgeColor} font-semibold`}>
                {b.badge}
              </span>
            </Link>
          ))}
        </div>

        {/* Qo'shimcha ma'lumot */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">📝 Maqola standartlari:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200 text-sm">
            <div className="space-y-2">
              <p>✅ Sarlavha (o'zbek yoki ingliz tilida)</p>
              <p>✅ Muallif(lar) — ism, familiya, ilmiy daraja</p>
              <p>✅ Annotatsiya (100-200 so'z)</p>
              <p>✅ Kalit so'zlar (5-10 ta)</p>
            </div>
            <div className="space-y-2">
              <p>✅ Kirish qismi</p>
              <p>✅ Asosiy qism (metodologiya, natijalar)</p>
              <p>✅ Xulosalar</p>
              <p>✅ Foydalanilgan adabiyotlar ro'yxati</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Hajmi: 3-15 bet</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Til: O'zbek, Rus, Ingliz</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Plagiat: 80%+ original</span>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📝 Barcha maqolalar admin tasdiqlashidan va plagiat tekshiruvidan o'tkaziladi
          </p>
        </div>

      </section>
    </main>
  )
}