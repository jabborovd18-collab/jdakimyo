import Link from "next/link"

export default function Boglanish() {
  const aloqalar = [
    {
      icon: "✈️",
      title: "Telegram",
      value: "@diyorbek_jabborov",
      link: "https://t.me/diyorbek_jabborov",
      rang: "from-blue-600 to-cyan-600",
      hoverRang: "group-hover:text-blue-400"
    },
    {
      icon: "📧",
      title: "Gmail",
      value: "jabborovd18@gmail.com",
      link: "mailto:jabborovd18@gmail.com",
      rang: "from-red-600 to-orange-600",
      hoverRang: "group-hover:text-red-400"
    },
    {
      icon: "📱",
      title: "Telefon raqamlar",
      value: "+998 94 458 99 33",
      value2: "+998 94 583 99 33",
      link: "tel:+998944589933",
      link2: "tel:+998945839933",
      rang: "from-green-600 to-emerald-600",
      hoverRang: "group-hover:text-green-400",
      isPhone: true
    },
    {
      icon: "📷",
      title: "Instagram",
      value: "d.arslonivich",
      link: "https://instagram.com/d.arslonivich",
      rang: "from-pink-600 to-rose-600",
      hoverRang: "group-hover:text-pink-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📞 Bog'lanish</h1>
          <p className="text-purple-400 text-sm">Biz bilan bog'lanish — barcha aloqa ma'lumotlari</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        
        {/* Hero */}
        <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-10 text-center">
          <div className="text-7xl mb-4">📞</div>
          <h2 className="text-2xl font-extrabold text-blue-400 mb-4">Biz bilan bog'laning!</h2>
          <p className="text-purple-200 text-lg mb-2">
            Savol, taklif yoki hamkorlik uchun quyidagi aloqa vositalari orqali bog'lanishingiz mumkin.
          </p>
          <p className="text-purple-300">
            Javob berish vaqti: odatda 1-2 soat ichida
          </p>
        </div>

        {/* Aloqa kartochkalari */}
        <div className="space-y-4">
          {aloqalar.map((a, i) => (
            <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-blue-400/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${a.rang} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{a.title}</h3>
                  
                  {a.isPhone ? (
                    <div className="space-y-1">
                      <a 
                        href={a.link} 
                        className={`text-xl font-bold ${a.hoverRang} transition-colors block hover:underline`}
                      >
                        {a.value}
                      </a>
                      <a 
                        href={a.link2} 
                        className={`text-xl font-bold ${a.hoverRang} transition-colors block hover:underline`}
                      >
                        {a.value2}
                      </a>
                    </div>
                  ) : (
                    <a 
                      href={a.link} 
                      target="_blank"
                      className={`text-xl font-bold ${a.hoverRang} transition-colors hover:underline`}
                    >
                      {a.value}
                    </a>
                  )}
                </div>
                <a 
                  href={a.isPhone ? a.link : a.link} 
                  target={a.isPhone ? "_self" : "_blank"}
                  className={`px-6 py-3 bg-gradient-to-br ${a.rang} rounded-xl text-white font-bold hover:opacity-90 transition-all transform hover:scale-105`}
                >
                  Bog'lanish
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Ish vaqti */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🕐 Ish vaqti</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🌅</div>
              <h3 className="text-white font-bold mb-2">Dushanba — Shanba</h3>
              <p className="text-purple-300">09:00 — 22:00</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🌙</div>
              <h3 className="text-white font-bold mb-2">Yakshanba</h3>
              <p className="text-purple-300">Dam olish kuni</p>
            </div>
          </div>
        </div>

        {/* Tezkor xabar */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Tezkor bog'lanish</h2>
          <p className="text-purple-300 mb-6">
            Eng tezkor javobni Telegram orqali olasiz!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-extrabold rounded-xl hover:from-blue-400 hover:to-cyan-500 transition-all transform hover:scale-105"
          >
            <span>✈️</span> Telegram da yozish
          </a>
        </div>

      </section>
    </main>
  )
}