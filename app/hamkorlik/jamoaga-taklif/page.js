import Link from "next/link"

export default function JamoagaTaklif() {
  const vakansiyalar = [
    {
      icon: "🧪",
      title: "Kontent yaratuvchi (Kimyogar)",
      desc: "Kompleks birikmalar bo'yicha maqolalar, testlar va o'quv materiallar tayyorlash. Ilmiy kontent sifatini nazorat qilish.",
      talablar: ["Kimyo sohasida oliy ma'lumot", "Kompleks birikmalar bo'yicha chuqur bilim", "Ilmiy maqolalar yoza olish"],
      rangi: "from-green-600 to-emerald-600",
      badge: "2 ta o'rin"
    },
    {
      icon: "💻",
      title: "Dasturchi (Next.js/React)",
      desc: "Platformani texnik rivojlantirish. Yangi funksiyalar qo'shish, 3D modellar, Firebase/Supabase integratsiyasi.",
      talablar: ["Next.js va React bo'yicha tajriba", "Tailwind CSS", "Firebase yoki Supabase bilan ishlash"],
      rangi: "from-blue-600 to-cyan-600",
      badge: "1 ta o'rin"
    },
    {
      icon: "🎨",
      title: "Dizayner (UI/UX)",
      desc: "Platforma interfeysini chiroyli va qulay qilish. Sertifikat dizaynlari, bannerlar, ijtimoiy tarmoq grafikasi.",
      talablar: ["Figma yoki shunga o'xshash dastur", "UI/UX dizayn tajribasi", "Ilmiy-uslubda dizayn yo'nalishi"],
      rangi: "from-pink-600 to-rose-600",
      badge: "1 ta o'rin"
    },
    {
      icon: "📱",
      title: "SMM menejer",
      desc: "Platformani ijtimoiy tarmoqlarda targ'ib qilish. Telegram, Instagram kontent rejasi. Hamkorlik aloqalari.",
      talablar: ["SMM sohasida tajriba", "Kontent reja tuzish", "Kimyo sohasiga qiziqish"],
      rangi: "from-orange-500 to-amber-600",
      badge: "1 ta o'rin"
    },
    {
      icon: "🎓",
      title: "Ilmiy maslahatchi (Professor/PhD)",
      desc: "Platformadagi ilmiy kontentni ekspertizadan o'tkazish. Maqolalarni ilmiy jihatdan tekshirish.",
      talablar: ["PhD yoki DSc ilmiy daraja", "Kompleks birikmalar sohasida tajriba", "Ilmiy maqolalar chop ettirgan"],
      rangi: "from-purple-600 to-indigo-600",
      badge: "2 ta o'rin"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🤝 Jamoaga taklif</h1>
          <p className="text-purple-400 text-sm">JDA KIMYO jamoasiga qo'shiling — birgalikda rivojlantiramiz!</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Hero */}
        <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-10 text-center">
          <div className="text-7xl mb-4">🤝</div>
          <h2 className="text-2xl font-extrabold text-green-400 mb-4">JDA KIMYO jamoasiga qo'shiling!</h2>
          <p className="text-purple-200 text-lg mb-2">
            Biz O'zbekistondagi eng yirik kimyo platformasini yaratmoqchimiz.
          </p>
          <p className="text-purple-300">
            Sizning bilimingiz va ishtiyoqingiz bilan birgalikda katta ish qilamiz!
          </p>
        </div>

        {/* Vakansiyalar */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center">📋 Ochiq vakansiyalar</h2>
          
          {vakansiyalar.map((v, i) => (
            <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-green-400/30 transition-all">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${v.rangi} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {v.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white">{v.title}</h3>
                    <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-0.5 rounded-full text-xs font-semibold">
                      {v.badge}
                    </span>
                  </div>
                  <p className="text-purple-300 text-sm mb-4">{v.desc}</p>
                  
                  <div className="bg-purple-800/30 rounded-xl p-4">
                    <h4 className="text-yellow-400 font-bold text-sm mb-2">Talablar:</h4>
                    <ul className="space-y-1">
                      {v.talablar.map((t, j) => (
                        <li key={j} className="flex items-start gap-2 text-purple-200 text-sm">
                          <span className="text-green-400 mt-0.5">•</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Qanday topshirish */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📝 Qanday topshirish kerak?</h2>
          <div className="space-y-4">
            {[
              { step: "1", text: "O'zingiz haqingizda qisqacha ma'lumot tayyorlang (CV yoki resume)" },
              { step: "2", text: "Portfolio yoki oldingi ishlaringiz namunalarini tayyorlang" },
              { step: "3", text: "Telegram orqali @diyorbek_jabborov ga yuboring" },
              { step: "4", text: "Suhbatdan so'ng qaror qabul qilinadi (1-3 kun ichida)" }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-purple-800/30 rounded-xl p-4">
                <div className="w-10 h-10 bg-green-600/30 rounded-full flex items-center justify-center text-green-400 font-bold">
                  {s.step}
                </div>
                <p className="text-purple-200 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Nega biz? */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌟 Nega JDA KIMYO?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: "🚀", title: "Katta loyiha", desc: "O'zbekistondagi eng yirik kimyo platformasi" },
              { icon: "📈", title: "O'sish", desc: "Tez rivojlanayotgan platforma" },
              { icon: "🎯", title: "Maqsad", desc: "Aniq yo'nalish va strategiya" },
              { icon: "🤝", title: "Jamoa", desc: "Do'stona va professional muhit" }
            ].map((n, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 flex items-center gap-3">
                <span className="text-2xl">{n.icon}</span>
                <div>
                  <h4 className="text-white font-bold">{n.title}</h4>
                  <p className="text-purple-300 text-sm">{n.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-green-600/10 to-blue-600/10 border border-green-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Tayyormisiz?</h2>
          <p className="text-purple-300 mb-6">
            Telegram orqali bog'laning va suhbatlashamiz!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all transform hover:scale-105"
          >
            <span>✈️</span> @diyorbek_jabborov
          </a>
        </div>

      </section>
    </main>
  )
}