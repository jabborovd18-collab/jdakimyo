import Link from "next/link"

export default function Hamkorlik() {
  const bolimlar = [
    {
      href: "/hamkorlik/jamoaga-taklif",
      icon: "🤝",
      title: "Jamoaga taklif",
      desc: "JDA KIMYO jamoasiga qo'shiling! Kontent yaratuvchi, dasturchi, dizayner yoki kimyo sohasida bilimdon bo'lsangiz — sizni kutamiz!",
      badge: "Qo'shiling",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/hamkorlik/boglanish",
      icon: "📞",
      title: "Bog'lanish",
      desc: "Savol yoki taklifingiz bormi? Biz bilan bog'laning — Telegram, email yoki aloqa formasi orqali",
      badge: "24/7",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/hamkorlik/ustozlar",
      icon: "🎓",
      title: "Ustozlar bilan hamkorlik",
      desc: "Siz kimyogar, o'qituvchi yoki professor bo'lsangiz — video darsliklar yaratishda hamkorlik qilamiz!",
      badge: "Taklif",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/hamkorlik/yangiliklar",
      icon: "📢",
      title: "Yangiliklar",
      desc: "Platformadagi eng so'nggi yangiliklar, yangi funksiyalar, yangi kontent va rivojlanish rejalari",
      badge: "Yangi",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400"
    },
    {
      href: "/hamkorlik/faq",
      icon: "❓",
      title: "FAQ — Ko'p beriladigan savollar",
      desc: "Sertifikat qanday olinadi? Premium nima beradi? Maqola qanday yuklanadi? Hamma javoblar shu yerda!",
      badge: "Yordam",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Bosh sahifa</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🤝 Hamkorlik</h1>
          <p className="text-purple-400 text-sm">Jamoamizga qo'shiling • Bog'lanish • Yangiliklar • Yordam</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Hamkorlik haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            JDA KIMYO — <strong className="text-yellow-400">ochiq platforma</strong>. 
            Biz bilimli va ishtiyoqmand insonlar bilan birgalikda O'zbekistondagi eng yirik kimyo platformasini 
            yaratmoqchimiz. Siz ham jamoamizga qo'shiling yoki hamkorlik taklifingizni yuboring!
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">🤝 Ochiq platforma</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">👥 Jamoaga taklif</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">🎓 Ustozlar uchun</span>
          </div>
        </div>

        {/* 5 ta iconka */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-base font-bold text-white ${b.rangText} transition-colors`}>
                  {b.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>
                  {b.badge}
                </span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
            </Link>
          ))}
        </div>

        {/* Aloqa ma'lumotlari */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📞 Tezkor bog'lanish</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <a 
              href="https://t.me/diyorbek_jabborov" 
              target="_blank"
              className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 hover:border-blue-400/50 transition-all group"
            >
              <div className="text-4xl mb-3">✈️</div>
              <div className="text-white font-bold group-hover:text-blue-400 transition-colors">Telegram</div>
              <div className="text-purple-400 text-sm">@diyorbek_jabborov</div>
            </a>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-4xl mb-3">📧</div>
              <div className="text-white font-bold">Email</div>
              <div className="text-purple-400 text-sm">jabborovd18@gmail.com</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-4xl mb-3">📍</div>
              <div className="text-white font-bold">Manzil</div>
              <div className="text-purple-400 text-sm">Samarqand, O'zbekiston</div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🤝 JDA KIMYO — birgalikda rivojlantiramiz! Savol, taklif yoki hamkorlik uchun doimo ochiqmiz
          </p>
        </div>

      </section>
    </main>
  )
}