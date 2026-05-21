"use client"

import Link from "next/link"
import { useState } from "react"

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqData = [
    {
      savol: "JDA KIMYO nima?",
      javob: "JDA KIMYO — kompleks birikmalar kimyosi bo'yicha O'zbekistondagi eng yirik onlayn platforma. Bu yerda siz nazariy ma'lumotlar, 3D modellar, quiz testlar, ilmiy maqolalar va boshqa ko'plab resurslarni topasiz.",
      kategoriya: "Umumiy"
    },
    {
      savol: "Platforma pullikmi?",
      javob: "Platformaning asosiy qismi — bepul. Barcha o'quv materiallari, 3D modellar va quiz testlar bepul. Premium kontent (video darsliklar, chuqurlashgan mavzular, sertifikat) uchun obuna bo'lish kerak. Premium narxi: 99 000 so'm / oy.",
      kategoriya: "Narxlar"
    },
    {
      savol: "Sertifikat qanday olinadi?",
      javob: "Platformada 4 darajali sertifikat tizimi mavjud:\n\n🟢 C-sertifikat: Barcha testlardan 70%+ natija + 25 000 so'm to'lov (Premium uchun bepul)\n🔵 B-sertifikat: Ilmiy maqola yuklash (bepul)\n🟡 A-sertifikat: 1000+ foydalanuvchi foydalangan maqola (bepul)\n👑 A+-sertifikat: 5000+ foydalanuvchi, moderator huquqi (bepul)",
      kategoriya: "Sertifikat"
    },
    {
      savol: "Maqola qanday yuklanadi?",
      javob: "Maqola yuklash uchun:\n1. Ilmiy bo'lim → Maqolalar → O'z maqolangizni yarating\n2. DOCX formatida fayl yuklang\n3. Sarlavha, muallif, annotatsiya va kalit so'zlarni kiriting\n4. Admin tasdiqlashidan so'ng maqola saytda chop etiladi\n5. Plagiat tekshiruvi o'tkaziladi (80%+ original bo'lishi kerak)",
      kategoriya: "Maqolalar"
    },
    {
      savol: "Premium nima beradi?",
      javob: "Premium a'zolik quyidagi imkoniyatlarni beradi:\n• Video darsliklar to'plami\n• Ilmiy maqolalarni ko'rish va yuklash\n• C sertifikat olish uchun oyiga 1 ta bepul urinish\n• Barcha premium bo'limlar (VB nazariyasi, KMN, Yan-Teller va boshqalar)\n• Maqolalarga izoh yozish",
      kategoriya: "Premium"
    },
    {
      savol: "Testlarni qayta yechish mumkinmi?",
      javob: "Ha, barcha quiz testlarni istalgancha qayta yechish mumkin. Testlar bepul va cheksiz. Natijangizni yaxshilash uchun qayta-qayta urinib ko'rishingiz mumkin.",
      kategoriya: "Testlar"
    },
    {
      savol: "3D modellarni qanday ko'rish mumkin?",
      javob: "Fazoviy tuzilish bo'limida 19 ta kompleks birikmaning interaktiv 3D modellari mavjud. Har bir geometriya sahifasida '3D modelni ko'rish' tugmasini bosing. Modelni sichqoncha bilan aylantirish, kattalashtirish va har tomondan ko'rish mumkin.",
      kategoriya: "3D modellar"
    },
    {
      savol: "Qanday qilib ustoz bo'lib qo'shilish mumkin?",
      javob: "Ustozlar bilan hamkorlik sahifasida barcha shartlar keltirilgan. Qisqacha:\n1. 5-10 daqiqali video namuna tayyorlang\n2. YouTube yoki Telegram orqali yuboring\n3. Ko'rib chiqiladi va 1-3 kun ichida javob beriladi\n4. Videolaringiz ko'p ko'rilsa, daromad olishingiz mumkin",
      kategoriya: "Hamkorlik"
    },
    {
      savol: "Platformaga qanday hissa qo'shish mumkin?",
      javob: "Platformaga hissa qo'shishning bir necha yo'li mavjud:\n• Ilmiy maqola yuklash\n• Test savollarini taklif qilish\n• Xatoliklar haqida xabar berish\n• Do'stlaringizga platformani tavsiya qilish\n• Jamoaga qo'shilish (vakansiyalar)",
      kategoriya: "Hissa"
    },
    {
      savol: "To'lov qanday amalga oshiriladi?",
      javob: "Hozircha to'lov Click yoki Payme orqali amalga oshiriladi. Premium obuna yoki sertifikat uchun to'lov qilishdan oldin @diyorbek_jabborov bilan bog'laning. Tez orada avtomatik to'lov tizimi ishga tushadi.",
      kategoriya: "To'lov"
    }
  ]

  const kategoriyalar = [...new Set(faqData.map(f => f.kategoriya))]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/hamkorlik" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Hamkorlik</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">❓ FAQ</h1>
          <p className="text-purple-400 text-sm">Ko'p beriladigan savollar va ularga javoblar</p>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-12">
        
        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10 text-center">
          <div className="text-6xl mb-4">❓</div>
          <h2 className="text-xl font-bold text-white mb-4">Sizda savol bormi?</h2>
          <p className="text-purple-200 mb-6">
            Quyida eng ko'p beriladigan savollarga javoblar keltirilgan. 
            Agar javob topa olmasangiz, Telegram orqali bog'laning.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {kategoriyalar.map((k, i) => (
              <span key={i} className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
                {k}
              </span>
            ))}
          </div>
        </div>

        {/* Savollar */}
        <div className="space-y-4">
          {faqData.map((f, i) => (
            <div 
              key={i} 
              className="bg-purple-900/40 border border-purple-700/50 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-purple-800/30 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{openIndex === i ? "🔽" : "▶️"}</span>
                  <div>
                    <span className="text-xs text-purple-400 mb-1 block">{f.kategoriya}</span>
                    <h3 className="text-lg font-bold text-white">{f.savol}</h3>
                  </div>
                </div>
              </button>
              
              {openIndex === i && (
                <div className="px-6 pb-6 pt-0">
                  <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                    <p className="text-purple-200 text-sm whitespace-pre-line leading-relaxed">{f.javob}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Qo'shimcha yordam */}
        <div className="mt-10 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-4">Javob topa olmadingizmi?</h2>
          <p className="text-purple-300 mb-6">
            Telegram orqali bevosita bog'laning — tez yordam beramiz!
          </p>
          <a 
            href="https://t.me/diyorbek_jabborov" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold rounded-xl hover:from-purple-400 hover:to-indigo-500 transition-all transform hover:scale-105"
          >
            <span>✈️</span> @diyorbek_jabborov
          </a>
        </div>

      </section>
    </main>
  )
}