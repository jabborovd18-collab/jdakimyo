// app/hamkorlik/sayt-hamkorlari/page.js
"use client"

import Link from "next/link"

export default function SaytHamkorlari() {
  const saytDostlari = [
    {
      icon: "✈️",
      name: "Kimyo Mushtariy",
      type: "Telegram kanal",
      description: "Sayt ustida izlanishda, kamchiliklari va yaxshi tomonlari haqida birinchilardan bo'lib fikr bildirib, saytga eng katta hissa qo'shganlardan.",
      link: "https://t.me/kimyo_mushtariy",
      isExternal: true,
      badge: "Birinchi do'st"
    }
  ]

  const kelajakRejalari = [
    {
      icon: "🎓",
      title: "Mahalliy universitetlar",
      desc: "O'zbekistonning yetakchi universitetlari bilan hamkorlik"
    },
    {
      icon: "🔬",
      title: "Ilmiy markazlar",
      desc: "Fanlar Akademiyasi va tadqiqot institutlari"
    },
    {
      icon: "🌍",
      title: "Xalqaro tashkilotlar",
      desc: "Dunyo bo'ylab kimyogarlar bilan hamkorlik"
    },
    {
      icon: "🏭",
      title: "Kimyo sanoati",
      desc: "Amaliyot va ish joylari bilan bog'lanish"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white overflow-hidden">
      
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 sticky top-0 z-50 bg-purple-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
            <span>←</span>
            <span className="hidden sm:inline">Hamkorlik</span>
          </Link>
          <div className="h-8 w-px bg-purple-800"></div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
              🏆 Sayt hamkorlari
            </h1>
            <p className="text-purple-400 text-xs hidden sm:block">Bizning do'stlarimiz va kelajak hamkorlarimiz</p>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            ENDIGINA BOSHLANGAN YO'L
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              Yosh, ammo
            </span>
            <br />
            <span className="text-white">katta orzular bilan</span>
          </h1>
          
          <p className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto mb-8 leading-relaxed">
            JDA KIMYO platformasi hali yosh va biz uni <strong className="text-yellow-400">mukammallashtirish</strong> ustida 
            tinimsiz ishlayapmiz. Har kuni yangi imkoniyatlar, yangi kontent va yangi g'oyalar ustida ishlamoqdamiz.
          </p>

          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto mb-10 backdrop-blur-sm">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-purple-100 text-lg leading-relaxed">
              Kelajakda <strong className="text-yellow-400">xalqaro va milliy hamkorlar</strong> bilan birga ishlash orqali 
              O'zbekistondagi <strong className="text-yellow-400">eng yaxshi ilmiy platformani</strong> shakllantirish niyatidamiz. 
              Bu yo'lda sizning qo'llab-quvvatlashingiz biz uchun juda muhim!
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-sm">🌱 O'sish bosqichida</span>
            <span className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-sm">🎯 Aniq maqsadlar</span>
            <span className="px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full text-sm">🤝 Ochiq hamkorlik</span>
          </div>
        </div>
      </section>

      {/* SAYT DO'STLARI */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-600/20 border border-pink-600/30 rounded-full text-xs font-semibold text-pink-300 mb-4">
            <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
            MINNATDORCHILIK
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">🤝 Sayt do'stlari</h2>
          <p className="text-purple-300 max-w-2xl mx-auto leading-relaxed">
            Bu yerda saytning kelajakda rivojlanishiga hissa qo'shayotgan kanal va guruhlar qo'shilib boradi.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {saytDostlari.map((dost, i) => (
            <a
              key={i}
              href={dost.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-gradient-to-br from-yellow-600/10 via-amber-600/10 to-orange-600/10 border-2 border-yellow-500/30 rounded-3xl p-8 hover:border-yellow-400/70 transition-all transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl flex-shrink-0 shadow-xl shadow-yellow-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {dost.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {dost.name}
                      </h3>
                      <span className="text-xs px-3 py-1 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-full text-yellow-300 font-bold">
                        🏆 {dost.badge}
                      </span>
                    </div>
                    
                    <div className="text-yellow-400 text-sm font-semibold mb-3">
                      {dost.type}
                    </div>
                    
                    <p className="text-purple-100 leading-relaxed mb-4">
                      {dost.description}
                    </p>

                    <div className="flex items-center gap-2 text-yellow-400 font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Kanalga o'tish</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* MINNATDORCHILIK XABARI */}
          <div className="mt-8 bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-2xl p-6 text-center backdrop-blur-sm">
            <div className="text-3xl mb-3">💝</div>
            <p className="text-purple-100 leading-relaxed">
              <strong className="text-yellow-400">JDA KIMYO guruhi nomidan</strong> barcha do'stlarimizga, 
              qo'llab-quvvatlaganlarga va sayt rivojiga hissa qo'shganlarga 
              <strong className="text-yellow-400"> chin dildan minnatdorchilik</strong> bildiramiz!
            </p>
            <p className="text-purple-300 text-sm mt-3 italic">
              "Birgalikda biz ko'p narsaga erisha olamiz" 🤝
            </p>
          </div>
        </div>
      </section>

      {/* KELAJAK REJALARI */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/20 border border-blue-600/30 rounded-full text-xs font-semibold text-blue-300 mb-4">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            KELAJAK VIZYONI
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">🎯 Kelajak hamkorlik yo'nalishlari</h2>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Qaysi sohalarda hamkorlik qilishni rejalashtirganimiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kelajakRejalari.map((reja, i) => (
            <div 
              key={i}
              className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-yellow-500"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl mb-4 shadow-lg shadow-yellow-500/20">
                  {reja.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{reja.title}</h3>
                <p className="text-purple-200 text-sm leading-relaxed">{reja.desc}</p>
                
                <div className="mt-4 pt-4 border-t border-purple-700/30">
                  <span className="text-xs px-2 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full font-semibold">
                    Tez kunda
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HAMKOR BO'LISH TAKLIFI */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-600/10 via-amber-600/10 to-orange-600/10 border-2 border-yellow-500/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl mb-6 shadow-2xl shadow-yellow-500/30">
              🤝
            </div>

            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siz ham do'stlarimiz safiga qo'shiling!
            </h3>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Agar siz ham sayt rivojiga hissa qo'shmoqchi bo'lsangiz — fikr-mulohazalaringiz, 
              takliflaringiz yoki hamkorlik g'oyalaringiz bilan bog'laning.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/hamkorlik/boglanish"
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl text-black font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
              >
                Bog'lanish →
              </Link>
              <Link
                href="https://t.me/diyorbek_jabborov"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-purple-800/50 hover:bg-purple-700/70 border-2 border-purple-600/50 rounded-xl text-white font-bold text-lg backdrop-blur-sm transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <span>✈️</span>
                <span>Telegram orqali</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* O'SISH YO'LIDA */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg shadow-green-500/20">
              🌱
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">O'sish yo'limizda birga bo'ling</h3>
              <p className="text-purple-200 leading-relaxed mb-4">
                Har bir kichik qadam — katta muvaffaqiyatga yo'l. Sizning har bir fikringiz, 
                har bir taklifingiz va har bir qo'llab-quvvatlashingiz biz uchun bebaho.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-3 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full">
                  ✨ Har kuni yaxshilanmoqdamiz
                </span>
                <span className="text-xs px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full">
                  🎓 Ta'limni rivojlantiramiz
                </span>
                <span className="text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full">
                  🤝 Hamkorlikka ochiqmiz
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 px-4 py-8 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full mb-3">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-xs font-mono font-bold">v2.1.0</span>
          </div>
          <p className="text-purple-400 text-xs mb-2">© 2026 JDA KIMYO • jdakimyo.uz</p>
          <p className="text-purple-500 text-xs italic">
            "Kuch birlikda" 🤝
          </p>
        </div>
      </footer>
    </main>
  )
}