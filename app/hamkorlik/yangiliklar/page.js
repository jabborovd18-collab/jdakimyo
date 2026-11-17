import Link from "next/link"

export default function Yangiliklar() {
  const yangiliklar = [
    {
      sana: "Noyabr 2026",
      badge: "v4.0",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      title: "JDA KIMYO v4 va Shaxsiy profil ekotizimi",
      desc: "Tezkor shaxsiy profil, teglar bilan tartiblanadigan ilmiy postlar, tavsiyalar lentasi hamda 24 soatlik Ilmiy Hikoyalar (Stories) ishga tushirildi.",
      icon: "🚀"
    },
    {
      sana: "Noyabr 2026",
      badge: "Yangi",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      title: "Kimyo-biologiya repititorlari jonli xaritasi",
      desc: "Bosh sahifadagi 9 ta asosiy rukn kengaytirildi: interaktiv xarita orqali hududingizdagi eng yaqin kimyo va biologiya repititorlarini GPS masofa bilan topish yo'lga qo'yildi.",
      icon: "📍"
    },
    {
      sana: "Oktabr 2026",
      badge: "Muhim",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      title: "Milliy Sertifikat va Rasch IRT tayyorlov markazi",
      desc: "DTM hamda Milliy Sertifikat formatidagi sinov testlari Rasch modeli asosida kalibrlanib, C dan A+ gacha darajalar va rasmiy QR-kodli sertifikatlar bilan taqdim etilmoqda.",
      icon: "🏅"
    },
    {
      sana: "Oktabr 2026",
      badge: "Ta'lim",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      title: "Maktab kimyosi: 7–8-sinf to'liq kurslari",
      desc: "Davlat ta'lim standarti asosida 7- va 8-sinf kimyo mavzulari, vizual reaksiyalar hamda sinf mashqlari ochildi. 9–11-sinflar hamda Oliy kimyo fanlari bosqichma-bosqich tayyorlanmoqda.",
      icon: "📚"
    },
    {
      sana: "Sentabr 2026",
      badge: "Ustozlar",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      title: "Ustoz paneli va Elektron doska",
      desc: "O'qituvchilar guruh tuzib, variantli va yozma testlar o'tkazishi, vazifa berishi hamda auditoriya uchun QR-kodli Elektron doska va Jamoalar Jangini boshqarishi mumkin.",
      icon: "🎓"
    },
    {
      sana: "Sentabr 2026",
      badge: "Tekshiruv",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      title: "QR-kodli sertifikatlar va PDF eksporti",
      desc: "Platformada berilgan barcha sertifikatlarni /sertifikat portali va QR-kod orqali onlayn tekshirish hamda vektor PDF ko'rinishida yuklab olish tizimi yo'lga qo'yildi.",
      icon: "📜"
    },
    {
      sana: "2025",
      badge: "Boshlanish",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      title: "JDA KIMYO platformasiga asos solindi",
      desc: "O'zbek tilidagi maktab va oliy kimyo ta'lim platformasi yaratildi: o'quv materiallari, masala yechish bo'limi, ochiq testlar va kimyogarlar hamjamiyati bir joyda jamlandi.",
      icon: "⚗️"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">📢 Yangiliklar</h1>
          <p className="text-purple-400 text-sm">Platformadagi eng so&apos;nggi yangiliklar va v4 rivojlanishi</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Platforma rivojlanishi</h2>
          <p className="text-purple-200 leading-relaxed">
            JDA KIMYO platformasi <strong className="text-yellow-400">muntazam yangilanib</strong> boradi. 
            Maktab darsliklari, Milliy Sertifikat sinovlari, ustoz vositalari hamda interaktiv kimyoviy o&apos;yinlar bosqichma-bosqich kengaytirilmoqda. 
            Eng so&apos;nggi o&apos;zgarishlarni shu sahifada kuzatib boring!
          </p>
        </div>

        {/* Yangiliklar ro'yxati */}
        <div className="relative">
          {/* Vertikal chiziq */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-purple-600/50 hidden md:block" />

          <div className="space-y-6">
            {yangiliklar.map((y, i) => (
              <div key={i} className="relative flex gap-4">
                {/* Nuqta */}
                <div className={`hidden md:flex w-12 h-12 rounded-full ${y.badgeColor.replace('text-', 'bg-').replace('/20', '/30')} border-2 flex-shrink-0 items-center justify-center text-xl relative z-10`}
                  style={{
                    backgroundColor: y.badgeColor.includes('green') ? 'rgba(16,185,129,0.3)' : 
                                   y.badgeColor.includes('yellow') ? 'rgba(234,179,8,0.3)' :
                                   y.badgeColor.includes('purple') ? 'rgba(147,51,234,0.3)' :
                                   'rgba(59,130,246,0.3)'
                  }}
                >
                  {y.icon}
                </div>

                {/* Kontent */}
                <div className="flex-1 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-pink-400/30 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-purple-400 text-sm">{y.sana}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${y.badgeColor} font-semibold`}>
                      {y.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{y.title}</h3>
                  <p className="text-purple-200 text-sm leading-relaxed">{y.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline pastki */}
        <div className="mt-10 bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📢 Yangi funksiyalar va kontent haqida birinchi bo&apos;lib xabar olish uchun Telegram orqali bog&apos;laning!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            <span>✈️</span> @diyorbek_jabborov
          </a>
        </div>

      </section>
    </main>
  )
}
