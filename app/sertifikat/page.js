"use client"

import Link from "next/link"
import { useState } from "react"

// ═══════════════════════════════════════════════════════════
// SERTIFIKAT MA'LUMOTLARI
// ═══════════════════════════════════════════════════════════
const darajalar = [
  {
    daraja: "C",
    nomi: "Asosiy sertifikat",
    icon: "🟢",
    rang: "green",
    narxi: "25 000 so'm",
    muddat: "1 yil",
    qiyinlik: 1,
    shartlar: [
      "Barcha mavzular bo'yicha testlarni topshirish",
      "O'rtacha natija 70% dan yuqori bo'lishi",
      "To'lov: 25 000 so'm (Premium uchun bepul)",
      "Har oy Premium foydalanuvchilarga 1 ta bepul urinish"
    ],
    imtiyozlar: [
      "PDF sertifikat",
      "QR kod orqali tekshirish",
      "Platformada maxsus badge",
      "B darajaga o'tish huquqi"
    ]
  },
  {
    daraja: "B",
    nomi: "Ilmiy sertifikat",
    icon: "🔵",
    rang: "blue",
    narxi: "Bepul",
    muddat: "3 yil",
    qiyinlik: 2,
    shartlar: [
      "C sertifikatga ega bo'lish",
      "Platformaga ilmiy maqola yuklash",
      "Maqola admin tomonidan tasdiqlanishi",
      "Maqola original bo'lishi (plagiat tekshiruvi)"
    ],
    imtiyozlar: [
      "Ilmiy maqola muallifi",
      "Tadqiqotchilar bazasiga qo'shilish",
      "A darajaga o'tish huquqi",
      "Maxsus profil badge"
    ]
  },
  {
    daraja: "A",
    nomi: "Oltin sertifikat",
    icon: "🟡",
    rang: "yellow",
    narxi: "Bepul",
    muddat: "5 yil",
    qiyinlik: 3,
    shartlar: [
      "B sertifikatga ega bo'lish",
      "Yuklangan maqolasi 1000+ ko'rish to'plashi",
      "Platformada faol ishtirok etish",
      "Ilmiy hamjamiyat tomonidan tan olinishi"
    ],
    imtiyozlar: [
      "Oltin badge",
      "Maxsus taqdirlash marosimi",
      "A+ darajaga nomzod",
      "Platforma elchisi"
    ]
  },
  {
    daraja: "A+",
    nomi: "Oltin+ sertifikat",
    icon: "👑",
    rang: "purple",
    narxi: "Bepul",
    muddat: "Umrbod",
    qiyinlik: 4,
    shartlar: [
      "A sertifikatga ega bo'lish",
      "5000+ foydalanuvchi tomonidan foydalanilgan maqola",
      "Platforma rivojiga katta hissa qo'shgan bo'lishi",
      "Moderator huquqi beriladi",
      "Barcha premium bo'limlar bepul"
    ],
    imtiyozlar: [
      "Toj badge 👑",
      "Moderator huquqi",
      "Barcha premium bepul",
      "Umrbod sertifikat",
      "Platforma hammuallifi"
    ]
  }
]

// Rang xaritasi
const rangMap = {
  green: {
    text: "text-green-400",
    bg: "bg-green-600/10",
    border: "border-green-500/30",
    btn: "from-green-500 to-emerald-600",
    hex: "#10b981"
  },
  blue: {
    text: "text-blue-400",
    bg: "bg-blue-600/10",
    border: "border-blue-500/30",
    btn: "from-blue-500 to-cyan-600",
    hex: "#3b82f6"
  },
  yellow: {
    text: "text-yellow-400",
    bg: "bg-yellow-600/10",
    border: "border-yellow-500/30",
    btn: "from-yellow-500 to-amber-600",
    hex: "#eab308"
  },
  purple: {
    text: "text-purple-400",
    bg: "bg-purple-600/10",
    border: "border-purple-500/30",
    btn: "from-purple-500 to-pink-600",
    hex: "#a855f7"
  }
}

// FAQ
const faqs = [
  {
    savol: "Sertifikatni qancha vaqtda olsam bo'ladi?",
    javob: "C sertifikatni 1-2 oyda olish mumkin (testlarni topshirish). B, A, A+ darajalar esa uzoq muddatli faoliyatni talab qiladi."
  },
  {
    savol: "Sertifikat xalqaro miqyosda tan olinadimi?",
    javob: "Hozircha platformaning ichki sertifikati. Kelajakda xalqaro akkreditatsiya olish rejalashtirilgan."
  },
  {
    savol: "Muddati tugagach nima bo'ladi?",
    javob: "Qayta test topshirishingiz kerak. C sertifikat uchun 25 000 so'm to'lov (yoki Premium bo'ling)."
  },
  {
    savol: "Sertifikatni ishga joylashishda ishlatsam bo'ladimi?",
    javob: "Ha, CV ga qo'shishingiz mumkin. QR kod orqali ish beruvchi tekshirishi mumkin."
  },
  {
    savol: "Premium foydalanuvchi bo'lsam, C sertifikat bepulmi?",
    javob: "Ha, Premium foydalanuvchilar har oy 1 ta bepul C sertifikat urinishiga ega."
  }
]

export default function Sertifikat() {
  const [selectedDaraja, setSelectedDaraja] = useState(0)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Sertifikat</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-3">
                <span className="text-3xl">🏅</span>
                Sertifikat tizimi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                JDA KIMYO platforma sertifikatlari • Bilimingizni tasdiqlang
              </p>
            </div>
            <Link 
              href="/"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-8">

        {/* STATISTIKA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">4</div>
            <div className="text-xs text-purple-400">daraja</div>
          </div>
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">📜</div>
            <div className="text-xs text-purple-400">PDF format</div>
          </div>
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🔍</div>
            <div className="text-xs text-purple-400">QR tekshirish</div>
          </div>
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-xs text-purple-400">Xalqaro standart</div>
          </div>
        </div>

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>📋</span> Sertifikat tizimi haqida
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed">
            JDA KIMYO platformasi <strong className="text-yellow-400">4 darajali sertifikat tizimi</strong> orqali 
            foydalanuvchilarning bilim darajasini tasdiqlaydi. Har bir daraja o'ziga xos talab va imtiyozlarga ega.
            C darajadan boshlab, asta-sekin A+ darajagacha ko'tarilishingiz mumkin.
          </p>
        </div>

        {/* PROGRESS TIMELINE */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>📈</span> Rivojlanish yo'li
          </h2>
          
          {/* Timeline */}
          <div className="relative">
            {/* Chiziq */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-purple-700/50 hidden md:block"></div>
            
            {/* Darajalar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {darajalar.map((d, i) => {
                const colors = rangMap[d.rang]
                return (
                  <div 
                    key={i} 
                    className="relative text-center cursor-pointer group"
                    onClick={() => setSelectedDaraja(i)}
                  >
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto rounded-full ${colors.bg} border-2 ${colors.border} flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform relative z-10`}>
                      {d.icon}
                    </div>
                    
                    {/* Info */}
                    <div className={`font-bold ${colors.text} text-sm`}>{d.daraja}</div>
                    <div className="text-xs text-purple-400 mt-1">{d.nomi}</div>
                    <div className="text-xs text-purple-500 mt-2">{d.muddat}</div>
                    
                    {/* Qiyinlik */}
                    <div className="flex justify-center gap-1 mt-2">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <div 
                          key={j}
                          className={`w-2 h-2 rounded-full ${j < d.qiyinlik ? colors.bg : 'bg-purple-800'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* TANLANGAN DARAJA — BATAFSIL */}
        <div className="mb-8">
          {darajalar.map((d, i) => {
            if (i !== selectedDaraja) return null
            const colors = rangMap[d.rang]
            
            return (
              <div key={i} className={`${colors.bg} border ${colors.border} rounded-2xl p-6 md:p-8`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{d.icon}</span>
                    <div>
                      <h2 className={`text-2xl font-extrabold ${colors.text}`}>
                        {d.daraja}-SERTIFIKAT
                      </h2>
                      <p className="text-white text-lg font-semibold">{d.nomi}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <div className={`text-xl font-extrabold ${colors.text}`}>{d.narxi}</div>
                      <div className="text-purple-400 text-xs">Narxi</div>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-white">{d.muddat}</div>
                      <div className="text-purple-400 text-xs">Muddati</div>
                    </div>
                  </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shartlar */}
                  <div className="bg-purple-900/50 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <span>📋</span> Talablar
                    </h3>
                    <ul className="space-y-2">
                      {d.shartlar.map((s, j) => (
                        <li key={j} className="flex items-start gap-2 text-purple-200 text-sm">
                          <span className={`${colors.text} mt-0.5`}>•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Imtiyozlar */}
                  <div className="bg-purple-900/50 rounded-xl p-5">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <span>🎁</span> Imtiyozlar
                    </h3>
                    <ul className="space-y-2">
                      {d.imtiyozlar.map((im, j) => (
                        <li key={j} className="flex items-start gap-2 text-purple-200 text-sm">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{im}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6 text-center">
                  <button className={`px-8 py-3 bg-gradient-to-r ${colors.btn} text-white font-bold rounded-xl hover:opacity-90 transition-all`}>
                    {i === 0 ? "📝 Testlarni boshlash" : "Batafsil ma'lumot"}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* COMPARISON TABLE */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> Darajalarni solishtirish
          </h2>
          
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-left text-purple-300">Xususiyat</th>
                {darajalar.map((d, i) => {
                  const colors = rangMap[d.rang]
                  return (
                    <th key={i} className={`py-3 px-4 text-center ${colors.text}`}>
                      {d.daraja}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="text-purple-200">
              <tr className="border-b border-purple-800/30">
                <td className="py-3 px-4 font-semibold">Narxi</td>
                {darajalar.map((d, i) => (
                  <td key={i} className="py-3 px-4 text-center">{d.narxi}</td>
                ))}
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="py-3 px-4 font-semibold">Muddati</td>
                {darajalar.map((d, i) => (
                  <td key={i} className="py-3 px-4 text-center">{d.muddat}</td>
                ))}
              </tr>
              <tr className="border-b border-purple-800/30">
                <td className="py-3 px-4 font-semibold">Qiyinlik</td>
                {darajalar.map((d, i) => {
                  const colors = rangMap[d.rang]
                  return (
                    <td key={i} className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div 
                            key={j}
                            className={`w-2 h-2 rounded-full ${j < d.qiyinlik ? colors.bg : 'bg-purple-800'}`}
                          ></div>
                        ))}
                      </div>
                    </td>
                  )
                })}
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold">Imtiyozlar</td>
                {darajalar.map((d, i) => (
                  <td key={i} className="py-3 px-4 text-center text-xs">
                    {d.imtiyozlar.length} ta
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>❓</span> Tez-tez so'raladigan savollar
          </h2>
          
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="bg-purple-800/30 border border-purple-700/30 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-purple-800/50 transition-colors"
                >
                  <span className="text-white font-semibold text-sm">{faq.savol}</span>
                  <span className={`text-purple-400 text-xl transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-purple-200 text-sm">
                    {faq.javob}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SERTIFIKAT XUSUSIYATLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📜</span> Sertifikat xususiyatlari
            </h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>PDF formatda yuklab olish</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>QR kod orqali onlayn tekshirish</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Unikal sertifikat raqami</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Platforma asoschisi imzosi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Chiroyli dizayn, professional ko'rinish</span>
              </li>
            </ul>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⚠️</span> Muhim eslatmalar
            </h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Sertifikat platformaning ichki baholash tizimi asosida beriladi</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Har bir sertifikat unikal raqamga ega</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>QR kod orqali istalgan vaqt tekshirish mumkin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Muddati tugagach qayta topshirish kerak</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span>Soxta sertifikatlar aniqlanadi va bloklanadi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-green-600/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sertifikat olishga tayyormisiz?</h2>
          <p className="text-purple-300 mb-6">Testlarni topshiring va bilimingizni tasdiqlang!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/oquv/video-darsliklar/quiz" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold rounded-xl hover:from-green-400 hover:to-emerald-500 transition-all">
              📝 Testlarni boshlash
            </Link>
            <Link href="/sertifikat/yasash" className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all">
              ✨ Namuna yaratish
            </Link>
          </div>
        </div>

      </section>
    </main>
  )
}