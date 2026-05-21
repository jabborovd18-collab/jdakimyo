"use client"

import Link from "next/link"

export default function PremiumSahifa() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">👑 JDA KIMYO Premium</h1>
          <p className="text-purple-400 text-sm">Premium kontent • Faqat obuna foydalanuvchilar uchun</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        
        <div className="bg-gradient-to-br from-yellow-600/10 to-purple-600/10 border border-yellow-500/30 rounded-3xl p-10 text-center mb-10">
          <div className="text-7xl mb-4">👑</div>
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-2">JDA KIMYO</h2>
          <p className="text-purple-300 text-lg mb-6">Premium a'zolik</p>
          
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8 text-left">
            <h3 className="text-yellow-400 font-bold text-lg mb-4">⭐ Premium imkoniyatlar:</h3>
            <ul className="space-y-4 text-purple-200">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎬</span>
                <div>
                  <strong className="text-white">Video darsliklar</strong>
                  <p className="text-purple-300 text-sm">Barcha mavzular bo'yicha professional video darsliklar to'plami</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📝</span>
                <div>
                  <strong className="text-white">Maqolalar joylash</strong>
                  <p className="text-purple-300 text-sm">O'z ilmiy maqolangizni platformaga joylashtiring</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <strong className="text-white">Joylashtirilgan maqolalarni ko'ra olish</strong>
                  <p className="text-purple-300 text-sm">Boshqa foydalanuvchilarning ilmiy ishlari bilan tanishing</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🏅</span>
                <div>
                  <strong className="text-white">C sertifikat olish — oyiga 1 ta tekin urinish</strong>
                  <p className="text-purple-300 text-sm">Har oy 1 marta bepul sertifikat testini topshirish imkoniyati</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔓</span>
                <div>
                  <strong className="text-white">Premium qismlardan foydalanish</strong>
                  <p className="text-purple-300 text-sm">Barcha yopiq bo'limlar va chuqurlashtirilgan kontent</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💬</span>
                <div>
                  <strong className="text-white">Maqolalarga izoh yozish</strong>
                  <p className="text-purple-300 text-sm">Ilmiy muhokamalarda qatnashing, fikringizni bildiring</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg mb-2">
              🤝 <strong className="text-white">Birgalikda fan rivojiga hissa qo'shamiz!</strong>
            </p>
            <p className="text-purple-300 text-sm">
              Platformamiz orqali nafaqat o'rganasiz, balki o'z bilimlaringizni boshqalar bilan ulashasiz.
            </p>
          </div>
          
          <p className="text-3xl font-extrabold text-yellow-400 mb-6">
            99 000 so'm <span className="text-lg text-purple-300">/ oy</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => alert("Obuna bo'lish uchun @diyorbek_jabborov bilan bog'laning.\n\nTelegram: https://t.me/diyorbek_jabborov")}
              className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105 shadow-xl shadow-yellow-500/20 text-lg"
            >
              💳 Obuna bo'lish
            </button>
            <Link 
              href="/oquv/kimyoviy-boglanish" 
              className="px-10 py-4 border-2 border-purple-500 rounded-xl font-bold hover:bg-purple-800/50 transition-all"
            >
              ← Orqaga
            </Link>
          </div>

          <p className="text-purple-400 text-sm mt-6">
            Bog'lanish: <strong className="text-yellow-400">@diyorbek_jabborov</strong>
          </p>
        </div>

      </section>
    </main>
  )
}