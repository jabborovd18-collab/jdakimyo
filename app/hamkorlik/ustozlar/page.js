import Link from "next/link"

export default function UstozlarHamkorlik() {
  const shartlar = [
    {
      icon: "🎥",
      title: "Video namuna yuborish",
      desc: "O'zingiz tayyorlagan 5-10 daqiqalik video darslik namunasini yuboring. Bu YouTube havolasi yoki video fayl bo'lishi mumkin.",
      details: ["YouTube linki", "Yoki Telegram orqali video fayl", "Mavzu: Kompleks birikmalarning istalgan bo'limi"]
    },
    {
      icon: "🎙️",
      title: "Nutq va tushuntirish sifati",
      desc: "Aniq, tushunarli va ravon o'zbek tilida gapirish. Murakkab mavzularni sodda qilib tushuntira olish qobiliyati.",
      details: ["Ravon o'zbek tili", "Murakkab mavzuni oddiy tushuntirish", "Tinimsiz va ishonchli nutq"]
    },
    {
      icon: "📚",
      title: "Mavzuni chuqur bilish",
      desc: "Kompleks birikmalar kimyosini chuqur bilish. Nazariy va amaliy bilimlarga ega bo'lish. Talabalar savollariga javob bera olish.",
      details: ["Kimyo sohasida oliy ma'lumot", "Kompleks birikmalar bo'yicha tajriba", "Ilmiy daraja afzallik"]
    },
    {
      icon: "🎬",
      title: "Video sifati",
      desc: "Yaxshi yoritilgan, aniq ovozli, tushunarli taxta yoki slaydlar bilan ishlangan video. Minimal 720p sifat.",
      details: ["720p yoki 1080p sifat", "Yaxshi yoritish", "Tushunarli taxta/slaydlar", "Aniq ovoz"]
    }
  ]

  const afzalliklar = [
    { icon: "💰", title: "Daromad", desc: "Videolaringiz ko'p ko'rilsa, har bir video uchun 50 000 - 200 000 so'mgacha to'lov" },
    { icon: "🏆", title: "Obro'", desc: "O'zbekistondagi eng yirik kimyo platformasida o'z nomingizni yarating" },
    { icon: "🎓", title: "Sertifikat", desc: "Eng yaxshi ustozlarga B yoki A sertifikat bepul beriladi" },
    { icon: "📈", title: "O'sish", desc: "Doimiy hamkorlik va platforma bilan birga rivojlanish imkoniyati" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🎓 Ustozlar bilan hamkorlik</h1>
          <p className="text-purple-400 text-sm">Video darsliklar yaratish uchun kimyogar ustozlarni taklif qilamiz!</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Hero */}
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-2xl p-10 text-center">
          <div className="text-7xl mb-4">🎓</div>
          <h2 className="text-2xl font-extrabold text-yellow-400 mb-4">Ustozlar, sizni kutamiz!</h2>
          <p className="text-purple-200 text-lg mb-2">
            Siz kimyogar, o'qituvchi yoki professor bo'lsangiz — 
            platformamiz uchun video darsliklar yaratishda hamkorlik qilamiz!
          </p>
          <p className="text-purple-300 mt-4">
            Hamkorlik shartlari quyida batafsil keltirilgan.
          </p>
        </div>

        {/* Shartlar */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-6">📋 Hamkorlik shartlari</h2>
          <div className="space-y-4">
            {shartlar.map((s, i) => (
              <div key={i} className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/30 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0">{s.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-yellow-400 mb-2">{s.title}</h3>
                    <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.details.map((d, j) => (
                        <span key={j} className="bg-purple-800/30 border border-purple-600/30 px-3 py-1 rounded-full text-xs text-purple-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Afzalliklar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white text-center mb-6">🌟 Hamkorlik afzalliklari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {afzalliklar.map((a, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <div className="text-3xl mb-2">{a.icon}</div>
                <h3 className="text-white font-bold mb-1">{a.title}</h3>
                <p className="text-purple-300 text-sm">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Qanday topshirish */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📝 Qanday topshirish kerak?</h2>
          <div className="space-y-4">
            {[
              { step: "1", text: "Kompleks birikmalarning istalgan mavzusi bo'yicha 5-10 daqiqalik video tayyorlang" },
              { step: "2", text: "Videoni YouTube ga yuklang yoki Telegram orqali @diyorbek_jabborov ga yuboring" },
              { step: "3", text: "O'zingiz haqingizda qisqacha ma'lumot (ilmiy daraja, tajriba) yuboring" },
              { step: "4", text: "Ko'rib chiqiladi va 1-3 kun ichida javob beriladi" }
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-purple-800/30 rounded-xl p-4">
                <div className="w-10 h-10 bg-yellow-600/30 rounded-full flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
                  {s.step}
                </div>
                <p className="text-purple-200 text-sm">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-green-600/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Hamkorlikka tayyormisiz?</h2>
          <p className="text-purple-300 mb-6">
            Video namuna va ma'lumotingizni Telegram orqali yuboring!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
          >
            <span>✈️</span> @diyorbek_jabborov
          </a>
        </div>

      </section>
    </main>
  )
}