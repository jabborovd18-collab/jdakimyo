"use client"

import Link from "next/link"
import { useState, useEffect } from "react"

export default function Home() {
  const [showMobileWarning, setShowMobileWarning] = useState(false)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const dismissed = localStorage.getItem("mobileWarningDismissed")
    
    if (isMobile && !dismissed) {
      setShowMobileWarning(true)
    }
  }, [])

  const dismissMobileWarning = () => {
    localStorage.setItem("mobileWarningDismissed", "true")
    setShowMobileWarning(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-purple-950 text-white overflow-hidden">
      
      {/* MOBILE OGOHLANTIRISH MODAL */}
      {showMobileWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-yellow-950/95 to-orange-950/95 border-2 border-yellow-500/60 rounded-2xl p-6 max-w-md w-full shadow-2xl shadow-yellow-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                📱
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-300">Mobile qurilma aniqlandi</h3>
                <p className="text-xs text-yellow-100/70">Muhim ma'lumot</p>
              </div>
            </div>
            
            <p className="text-yellow-100 text-sm leading-relaxed mb-4">
              Ushbu sayt <strong className="text-yellow-300">kompyuterlar uchun</strong> to'liq moslashgan. 
              Mobile qurilmalarda ba'zi bo'limlarda <strong className="text-yellow-300">nosozliklar, qotishlar</strong> yoki 
              3D modellarda sekin ishlash kuzatilishi mumkin.
            </p>
            
            <div className="bg-black/30 border border-yellow-600/30 rounded-lg p-3 mb-5">
              <p className="text-xs text-yellow-200/90">
                💡 <strong>Eng yaxshi tajriba</strong> uchun kompyuter yoki planshetdan foydalanishni tavsiya etamiz.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={dismissMobileWarning}
                className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all"
              >
                Tushundim, davom etish
              </button>
            </div>

            <label className="flex items-center gap-2 mt-3 cursor-pointer justify-center">
              <input 
                type="checkbox" 
                className="accent-yellow-500"
                defaultChecked
                onChange={(e) => {
                  if (!e.target.checked) {
                    localStorage.removeItem("mobileWarningDismissed")
                  }
                }}
              />
              <span className="text-xs text-yellow-100/70">Boshqa ko'rsatilmasin</span>
            </label>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-purple-800/50 sticky top-0 z-50 bg-purple-950/80 backdrop-blur-xl">
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          JDA KIMYO
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/oquv" className="text-purple-300 hover:text-yellow-400 transition-colors text-sm font-medium">O'quv</Link>
          <Link href="/ilmiy" className="text-purple-300 hover:text-yellow-400 transition-colors text-sm font-medium">Ilmiy</Link>
          <Link href="/birikmalar" className="text-purple-300 hover:text-yellow-400 transition-colors text-sm font-medium">Birikmalar</Link>
          <Link href="/oquv/video-darsliklar" className="text-purple-300 hover:text-yellow-400 transition-colors text-sm font-medium">Video & Quiz</Link>
        </nav>

        <div className="flex gap-2 items-center">
          <Link href="/qidiruv" className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <span>🔍</span>
            <span className="hidden sm:inline">Qidiruv</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-700">Ctrl+K</kbd>
          </Link>
          <Link href="/hamkorlik" className="p-2 hover:bg-purple-800/50 rounded-full transition-all" title="Hamkorlik">🤝</Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 md:py-28 overflow-hidden">
        
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="absolute top-32 right-20 text-6xl opacity-20 animate-bounce" style={{animationDuration: '3s'}}>⚛️</div>
        <div className="absolute bottom-32 left-20 text-6xl opacity-20 animate-bounce" style={{animationDuration: '4s', animationDelay: '0.5s'}}>🧪</div>
        <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 animate-bounce" style={{animationDuration: '5s', animationDelay: '1s'}}>🔬</div>

        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-800/40 border border-purple-600/50 rounded-full text-xs font-semibold text-purple-200 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            O'zbek tilidagi kompleks birikmalar platformasi
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
              Kompleks
            </span>
            <br />
            <span className="text-white">birikmalar dunyosi</span>
          </h1>
          
          <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-10 leading-relaxed">
            Koordinatsion kimyoning barcha jihatlarini — <strong className="text-yellow-400">nazariyadan tortib</strong> 
            <strong className="text-orange-400"> ilmiy tadqiqotlargacha</strong> — interaktiv, tushunarli va 
            professional darajada o'rganing.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link href="/qidiruv" className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl text-black font-bold text-lg shadow-2xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-3">
              <span>🔍</span>
              <span>Qidiruv</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/ishlashi" className="px-8 py-4 bg-purple-800/50 hover:bg-purple-700/70 border-2 border-purple-600/50 rounded-2xl text-white font-bold text-lg backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center gap-3">
              <span>📖</span>
              <span>Sayt qanday ishlatiladi</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { value: "120+", label: "Birikmalar", icon: "🧪" },
              { value: "20", label: "Tahlil usuli", icon: "📊" },
              { value: "500+", label: "Quiz savollari", icon: "📝" },
              { value: "∞", label: "Interaktiv", icon: "⚡" },
            ].map((stat, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-4 backdrop-blur-sm hover:bg-purple-800/50 transition-all">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold text-yellow-400">{stat.value}</div>
                <div className="text-purple-300 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ASOSIY BO'LIMLAR (4 ta karta) */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Asosiy bo'limlar</h2>
          <p className="text-purple-300">Har bir bo'lim alohida auditoriya uchun mo'ljallangan</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 01 O'QUV BO'LIM */}
          <Link href="/oquv" 
            className="group bg-gradient-to-br from-purple-600/20 to-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-purple-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  📚
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-purple-600/30 text-purple-300">
                  01
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                O'quv bo'lim
              </h3>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Talabalar uchun — asoslardan boshlab murakkab mavzulargacha
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Boshlang'ich mavzular
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Komplekslarning 3D animatsiyalari
                </span>
              </div>
            </div>
          </Link>

          {/* 02 ILMIIY BO'LIM */}
          <Link href="/ilmiy" 
            className="group bg-gradient-to-br from-blue-600/20 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-blue-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  🔬
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-blue-600/30 text-blue-300">
                  02
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                Ilmiy bo'lim
              </h3>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Tadqiqotchilar uchun — zamonaviy tahlil usullari va ilmiy ishlar
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Fizikaviy tahlil usullari
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Maqolalar
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Birikmalar
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Chuqurlashgan murakkab mavzular
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Tadqiqotlar
                </span>
              </div>
            </div>
          </Link>

          {/* 03 QUIZ TESTLAR VA VIDEO DARSLIKLAR (BIRLASHTIRILGAN) */}
          <Link href="/oquv/video-darsliklar" 
            className="group bg-gradient-to-br from-yellow-600/20 to-yellow-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-yellow-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  🎯
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-yellow-600/30 text-yellow-300">
                  03
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                Quiz testlar va Video darsliklar
              </h3>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Bilimingizni sinang va professional video darsliklarni ko'ring
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Yirik test baza
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Natijalarni PDF shaklida yuklab olish
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Video darsliklar
                </span>
              </div>
            </div>
          </Link>

          {/* 04 HAMKORLIK */}
          <Link href="/hamkorlik" 
            className="group bg-gradient-to-br from-red-600/20 to-red-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 bg-red-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  🤝
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-red-600/30 text-red-300">
                  04
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                Hamkorlik
              </h3>
              <p className="text-purple-200 text-sm mb-4 leading-relaxed">
                Jamoa bilan birga o'rganing va loyihalarda ishtirok eting
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Jamoaga taklif
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  FAQ
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Bog'lanish
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-purple-900/50 border border-purple-700/50 rounded-full text-purple-300">
                  Yangiliklar
                </span>
                {/* OLTIN RANG - SAYT HAMKORLARI */}
                <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 border border-yellow-500/50 rounded-full text-yellow-300 font-semibold flex items-center gap-1">
                  <span>🏆</span>
                  <span>Sayt hamkorlari</span>
                </span>
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/50 px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10 backdrop-blur-sm text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl">
                    👨‍🔬
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Yaratuvchi</h4>
                    <p className="text-purple-300 text-sm">Diyorbek Jabborov Arslonivich</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <a 
                    href="mailto:jabborovd18@gmail.com" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>📧</span>
                    <span>jabborovd18@gmail.com</span>
                  </a>
                  <a 
                    href="https://t.me/diyorbek_jabborov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>✈️</span>
                    <span>@diyorbek_jabborov</span>
                  </a>
                  <a 
                    href="https://jdakimyo.uz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-yellow-400 hover:text-yellow-300 transition-all text-sm"
                  >
                    <span>🌐</span>
                    <span>jdakimyo.uz</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/30 rounded-full">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-400 text-xs font-mono font-bold">v2.1.0</span>
                </div>
                <p className="text-purple-400 text-xs text-center md:text-right">
                  © 2026 JDA KIMYO
                </p>
                <p className="text-purple-500 text-[10px] text-center md:text-right">
                  Kompleks birikmalar platformasi
                </p>
              </div>
            </div>
          </div>
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