// app/hamkorlik/page.js
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Hamkorlik() {
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const dismissed = localStorage.getItem("mobileWarningDismissed")
    if (isMobile && !dismissed) setShowMobileWarning(true)
  }, [])

  const dismissMobileWarning = () => {
    localStorage.setItem("mobileWarningDismissed", "true")
    setShowMobileWarning(false)
  }

  const bolimlar = [
    {
      href: "/hamkorlik/jamoaga-taklif",
      icon: "🤝",
      title: "Jamoaga taklif",
      desc: "JDA KIMYO jamoasiga qo'shiling! Kontent yaratuvchi, dasturchi, dizayner yoki kimyo sohasida bilimdon bo'lsangiz — sizni kutamiz!",
      badge: "Qo'shiling",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      gradientFrom: "from-green-600/20",
      gradientTo: "to-emerald-900/40",
      blurColor: "bg-green-500",
      numberColor: "bg-green-600/30 text-green-300",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400",
      iconBg: "from-green-600 to-emerald-600",
      number: "01"
    },
    {
      href: "/hamkorlik/boglanish",
      icon: "📞",
      title: "Bog'lanish",
      desc: "Savol yoki taklifingiz bormi? Biz bilan bog'laning — Telegram, email yoki aloqa formasi orqali",
      badge: "24/7",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      gradientFrom: "from-blue-600/20",
      gradientTo: "to-cyan-900/40",
      blurColor: "bg-blue-500",
      numberColor: "bg-blue-600/30 text-blue-300",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400",
      iconBg: "from-blue-600 to-cyan-600",
      number: "02"
    },
    {
      href: "/hamkorlik/yangiliklar",
      icon: "📢",
      title: "Yangiliklar",
      desc: "Platformadagi eng so'nggi yangiliklar, yangi funksiyalar, yangi kontent va rivojlanish rejalari",
      badge: "Yangi",
      badgeColor: "bg-pink-600/20 text-pink-400 border-pink-600/30",
      gradientFrom: "from-pink-600/20",
      gradientTo: "to-rose-900/40",
      blurColor: "bg-pink-500",
      numberColor: "bg-pink-600/30 text-pink-300",
      rang: "hover:border-pink-400/50",
      rangText: "group-hover:text-pink-400",
      iconBg: "from-pink-600 to-rose-600",
      number: "03"
    },
    {
      href: "/hamkorlik/faq",
      icon: "❓",
      title: "FAQ — Ko'p beriladigan savollar",
      desc: "Sertifikat qanday olinadi? Premium nima beradi? Maqola qanday yuklanadi? Hamma javoblar shu yerda!",
      badge: "Yordam",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      gradientFrom: "from-purple-600/20",
      gradientTo: "to-indigo-900/40",
      blurColor: "bg-purple-500",
      numberColor: "bg-purple-600/30 text-purple-300",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400",
      iconBg: "from-purple-600 to-indigo-600",
      number: "04"
    },
    {
      href: "/hamkorlik/sayt-hamkorlari",
      icon: "🏆",
      title: "Sayt hamkorlari",
      desc: "Bizning hamkor tashkilotlar, universitetlar va kompaniyalar. Birgalikda kimyo ta'limini rivojlantiramiz!",
      badge: "Premium",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      gradientFrom: "from-yellow-600/20",
      gradientTo: "to-amber-900/40",
      blurColor: "bg-yellow-500",
      numberColor: "bg-yellow-600/30 text-yellow-300",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400",
      iconBg: "from-yellow-600 to-amber-600",
      number: "05",
      isGold: true
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white overflow-hidden">
      
      {/* MOBILE OGOHLANTIRISH */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-yellow-950/95 to-orange-950/95 border-2 border-yellow-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl">📱</div>
              <div>
                <h3 className="text-lg font-bold text-yellow-300">Mobile qurilma aniqlandi</h3>
                <p className="text-xs text-yellow-100/70">Muhim ma'lumot</p>
              </div>
            </div>
            <p className="text-yellow-100 text-sm leading-relaxed mb-4">
              Ushbu sayt <strong className="text-yellow-300">kompyuterlar uchun</strong> to'liq moslashgan.
              Mobile qurilmalarda ba'zi bo'limlarda nosozliklar kuzatilishi mumkin.
            </p>
            <button
              onClick={dismissMobileWarning}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
            >
              Tushundim, davom etish
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 sticky top-0 z-50 bg-purple-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg flex items-center gap-2">
            <span>←</span>
            <span className="hidden sm:inline">Bosh sahifa</span>
          </Link>
          <div className="h-8 w-px bg-purple-800"></div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              🤝 Hamkorlik
            </h1>
            <p className="text-purple-400 text-xs hidden sm:block">Jamoamizga qo'shiling • Bog'lanish • Hamkorlar</p>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Link href="/qidiruv" className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <span>🔍</span>
            <span className="hidden sm:inline">Qidiruv</span>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full text-xs font-semibold text-green-300 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            OCHIQ PLATFORMA
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-yellow-400 bg-clip-text text-transparent">
              Hamkorlik
            </span>
            <br />
            <span className="text-white">imkoniyatlari</span>
          </h1>
          
          <p className="text-lg md:text-xl text-purple-200 max-w-3xl mx-auto mb-10 leading-relaxed">
            JDA KIMYO — <strong className="text-yellow-400">ochiq platforma</strong>. 
            Biz bilimli va ishtiyoqmand insonlar bilan birgalikda O'zbekistondagi eng yirik kimyo platformasini 
            yaratmoqchimiz.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <span className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded-full text-sm">🤝 Ochiq platforma</span>
            <span className="px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-full text-sm">👥 Jamoaga taklif</span>
            <span className="px-4 py-2 bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 rounded-full text-sm">🏆 Hamkorlar</span>
            <span className="px-4 py-2 bg-pink-600/20 text-pink-400 border border-pink-600/30 rounded-full text-sm">📢 Yangiliklar</span>
          </div>

          {/* Statistika */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "120+", label: "Birikmalar", icon: "🧪" },
              { value: "500+", label: "Quiz savollari", icon: "📝" },
              { value: "20+", label: "Tahlil usuli", icon: "📊" },
              { value: "∞", label: "Imkoniyatlar", icon: "⚡" },
            ].map((stat, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-400">{stat.value}</div>
                <div className="text-purple-300 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASOSIY BO'LIMLAR */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Hamkorlik yo'nalishlari</h2>
          <p className="text-purple-300">O'zingizga mos bo'limni tanlang</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group bg-gradient-to-br ${b.gradientFrom} ${b.gradientTo} border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden ${b.isGold ? 'ring-2 ring-yellow-500/30' : ''}`}
            >
              <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${b.blurColor}`}></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${b.iconBg} flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    {b.icon}
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-1 rounded-lg ${b.numberColor}`}>
                    {b.number}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className={`text-lg font-bold text-white ${b.rangText} transition-colors`}>
                    {b.title}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>
                    {b.badge}
                  </span>
                </div>

                <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                  {b.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-purple-700/30">
                  <span className={`text-sm font-semibold ${b.rangText} group-hover:translate-x-2 transition-all flex items-center gap-2`}>
                    <span>Batafsil</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TEZKOR BOG'LANISH */}
      <section className="px-4 py-16 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">📞 Tezkor bog'lanish</h2>
            <p className="text-purple-300">Biz bilan istalgan vaqtda bog'laning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="https://t.me/diyorbek_jabborov" 
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-purple-950/50 rounded-2xl p-6 border border-purple-700/30 hover:border-blue-400/50 transition-all text-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                ✈️
              </div>
              <div className="text-white font-bold mb-1 group-hover:text-blue-400 transition-colors">Telegram</div>
              <div className="text-purple-400 text-sm">@diyorbek_jabborov</div>
            </a>

            <a 
              href="mailto:jabborovd18@gmail.com"
              className="group bg-purple-950/50 rounded-2xl p-6 border border-purple-700/30 hover:border-red-400/50 transition-all text-center hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-500/20">
                📧
              </div>
              <div className="text-white font-bold mb-1 group-hover:text-red-400 transition-colors">Email</div>
              <div className="text-purple-400 text-sm">jabborovd18@gmail.com</div>
            </a>

            <div className="group bg-purple-950/50 rounded-2xl p-6 border border-purple-700/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-3xl mb-4 shadow-lg shadow-green-500/20">
                📍
              </div>
              <div className="text-white font-bold mb-1">Manzil</div>
              <div className="text-purple-400 text-sm">Samarqand, O'zbekiston</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-4 py-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            🤝 Birgalikda rivojlantiramiz!
          </h3>
          <p className="text-purple-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Savol, taklif yoki hamkorlik uchun doimo ochiqmiz. 
            O'zbekistondagi eng yirik kimyo platformasini birgalikda yaratamiz!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/hamkorlik/jamoaga-taklif"
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-xl text-black font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              Jamoaga qo'shilish →
            </Link>
            <Link
              href="/hamkorlik/sayt-hamkorlari"
              className="px-8 py-4 bg-purple-800/50 hover:bg-purple-700/70 border-2 border-purple-600/50 rounded-xl text-white font-bold text-lg backdrop-blur-sm transition-all transform hover:scale-105"
            >
              Hamkorlarni ko'rish
            </Link>
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
          <p className="text-purple-400 text-xs">© 2026 JDA KIMYO • jdakimyo.uz</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  )
}