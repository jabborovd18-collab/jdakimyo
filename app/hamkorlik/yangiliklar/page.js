import Link from "next/link"

export default function Yangiliklar() {
  const yangiliklar = [
    {
      sana: "11.05.2026",
      badge: "Yangi",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      title: "Ilmiy bo'lim ishga tushdi!",
      desc: "Platformamizda ilmiy bo'lim ochildi. Endi siz chuqurlashgan mavzular, maqolalar, kompleks birikmalar bazasi va tahlil usullari bilan tanishishingiz mumkin.",
      icon: "🔬"
    },
    {
      sana: "10.05.2026",
      badge: "Muhim",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      title: "19 ta interaktiv 3D model qo'shildi",
      desc: "Fazoviy tuzilish bo'limida 19 ta kompleks birikmaning CPK ranglardagi interaktiv 3D modellari qo'shildi. Modellarni sichqoncha bilan aylantirish, kattalashtirish mumkin.",
      icon: "💎"
    },
    {
      sana: "09.05.2026",
      badge: "Yangi",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      title: "5 ta quiz test qo'shildi",
      desc: "Bilimingizni sinash uchun 5 ta mavzu bo'yicha 75 ta savoldan iborat quiz testlar qo'shildi. Testlar bepul va qayta-qayta yechish mumkin.",
      icon: "📝"
    },
    {
      sana: "08.05.2026",
      badge: "Premium",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      title: "Premium tizim ishga tushdi",
      desc: "Endi platformada premium a'zolik mavjud. Premium foydalanuvchilar video darsliklar, chuqurlashgan kontent va sertifikat imkoniyatlaridan foydalanishi mumkin.",
      icon: "👑"
    },
    {
      sana: "07.05.2026",
      badge: "Yangi",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      title: "Maqolalar bo'limi ochildi",
      desc: "Endi foydalanuvchilar o'z ilmiy maqolalarini DOCX formatida yuklab, admin tasdiqlashidan so'ng platformada chop ettirishi mumkin.",
      icon: "📄"
    },
    {
      sana: "06.05.2026",
      badge: "Muhim",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      title: "Sertifikat tizimi e'lon qilindi",
      desc: "JDA KIMYO platformasi 4 darajali sertifikat tizimini e'lon qiladi: C (Asosiy), B (Ilmiy), A (Oltin) va A+ (Oltin+). Har bir daraja o'z talab va imtiyozlariga ega.",
      icon: "🏅"
    },
    {
      sana: "01.05.2026",
      badge: "Boshlanish",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      title: "JDA KIMYO platformasi ishga tushdi!",
      desc: "Kompleks birikmalar kimyosi bo'yicha O'zbekistondagi eng yirik onlayn platforma o'z ishini boshladi. 68 ta sahifa, 19 ta 3D model, 5 ta quiz test — barchasi bir joyda!",
      icon: "🚀"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">📢 Yangiliklar</h1>
          <p className="text-purple-400 text-sm">Platformadagi eng so'nggi yangiliklar va rivojlanishlar</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Platforma rivojlanishi</h2>
          <p className="text-purple-200 leading-relaxed">
            JDA KIMYO platformasi <strong className="text-yellow-400">har hafta yangilanib</strong> boradi. 
            Yangi bo'limlar, testlar, 3D modellar va ilmiy kontent qo'shilmoqda. 
            Eng so'nggi o'zgarishlarni shu sahifada kuzatib boring!
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
            📢 Yangi funksiyalar va kontent haqida birinchi bo'lib xabar olish uchun Telegram kanalimizga obuna bo'ling!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            className="inline-flex items-center gap-2 mt-3 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
          >
            <span>✈️</span> @diyorbek_jabborov
          </a>
        </div>

      </section>
    </main>
  )
}