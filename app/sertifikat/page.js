import Link from "next/link"

export default function Sertifikat() {
  const darajalar = [
    {
      daraja: "C",
      nomi: "Asosiy sertifikat",
      icon: "🟢",
      rang: "text-green-400",
      bgRang: "bg-green-600/10",
      borderRang: "border-green-500/30",
      btnRang: "from-green-500 to-emerald-600",
      narxi: "25 000 so'm",
      muddat: "1 yil",
      shartlar: [
        "Barcha mavzular bo'yicha testlarni topshirish",
        "O'rtacha natija 70% dan yuqori bo'lishi",
        "To'lov: 25 000 so'm (Premium foydalanuvchilar uchun bepul)",
        "Har oy Premium foydalanuvchilarga 1 ta bepul urinish"
      ],
      qandayOlinadi: [
        "1. Test bo'limiga o'ting",
        "2. Barcha 5 ta mavzu bo'yicha testlarni yeching",
        "3. O'rtacha 70%+ natija to'plang",
        "4. To'lovni amalga oshiring (yoki Premium bo'ling)",
        "5. Sertifikat avtomatik yaratiladi"
      ]
    },
    {
      daraja: "B",
      nomi: "Ilmiy sertifikat",
      icon: "🔵",
      rang: "text-blue-400",
      bgRang: "bg-blue-600/10",
      borderRang: "border-blue-500/30",
      btnRang: "from-blue-500 to-cyan-600",
      narxi: "Bepul",
      muddat: "3 yil",
      shartlar: [
        "C sertifikatga ega bo'lish",
        "Platformaga ilmiy maqola yoki ma'lumotlar to'plamini yuklash",
        "Maqola admin tomonidan tasdiqlanishi",
        "Maqola original bo'lishi (plagiat tekshiruvi)"
      ],
      qandayOlinadi: [
        "1. C sertifikat oling",
        "2. Ilmiy maqola tayyorlang (DOCX formatida)",
        "3. Maqolalar bo'limi orqali yuklang",
        "4. Admin tasdiqlashini kuting",
        "5. Tasdiqlangach, B sertifikat avtomatik beriladi"
      ]
    },
    {
      daraja: "A",
      nomi: "Oltin sertifikat",
      icon: "🟡",
      rang: "text-yellow-400",
      bgRang: "bg-yellow-600/10",
      borderRang: "border-yellow-500/30",
      btnRang: "from-yellow-500 to-amber-600",
      narxi: "Bepul",
      muddat: "5 yil",
      shartlar: [
        "B sertifikatga ega bo'lish",
        "Yuklangan maqolasi 1000+ foydalanuvchi tomonidan foydalanilgan bo'lishi",
        "Platformada faol ishtirok etish",
        "Ilmiy hamjamiyat tomonidan tan olinishi"
      ],
      qandayOlinadi: [
        "1. B sertifikat oling",
        "2. Maqolangiz 1000+ ko'rishlar to'plasin",
        "3. Admin ko'rib chiqadi",
        "4. A sertifikat maxsus taqdirlash marosimida beriladi"
      ]
    },
    {
      daraja: "A+",
      nomi: "Oltin+ sertifikat",
      icon: "👑",
      rang: "text-purple-400",
      bgRang: "bg-purple-600/10",
      borderRang: "border-purple-500/30",
      btnRang: "from-purple-500 to-pink-600",
      narxi: "Bepul",
      muddat: "Umrbod",
      shartlar: [
        "A sertifikatga ega bo'lish",
        "5000+ foydalanuvchi tomonidan foydalanilgan maqola",
        "Platforma rivojiga katta hissa qo'shgan bo'lishi",
        "Moderator huquqi beriladi",
        "Barcha premium bo'limlar bepul"
      ],
      qandayOlinadi: [
        "1. A sertifikat oling",
        "2. Platformada yetakchi tadqiqotchi bo'ling",
        "3. 5000+ foydalanuvchi maqolangizdan foydalansin",
        "4. Admin tomonidan maxsus qaror bilan beriladi",
        "5. Platforma tomonidan rasmiy taqdirlanadi"
      ]
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Bosh sahifa</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🏅 Sertifikat tizimi</h1>
          <p className="text-purple-400 text-sm">JDA KIMYO platforma sertifikatlari • Bilimingizni tasdiqlang</p>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12">

        {/* Kirish */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Sertifikat tizimi haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            JDA KIMYO platformasi <strong className="text-yellow-400">4 darajali sertifikat tizimi</strong> orqali 
            foydalanuvchilarning bilim darajasini tasdiqlaydi. Har bir daraja o'ziga xos talab va imtiyozlarga ega.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">4</div>
              <div className="text-purple-400 text-xs">daraja</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">📜</div>
              <div className="text-purple-400 text-xs">PDF format</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">🔍</div>
              <div className="text-purple-400 text-xs">QR tekshirish</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-3">
              <div className="text-2xl font-extrabold text-yellow-400">🏆</div>
              <div className="text-purple-400 text-xs">Xalqaro standart</div>
            </div>
          </div>
        </div>

        {/* 4 ta sertifikat */}
        <div className="space-y-8">
          {darajalar.map((d, i) => (
            <div key={i} className={`${d.bgRang} border ${d.borderRang} rounded-2xl p-8`}>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{d.icon}</span>
                <div>
                  <h2 className={`text-2xl font-extrabold ${d.rang}`}>
                    {d.daraja}-SERTIFIKAT
                  </h2>
                  <p className="text-white text-lg font-semibold">{d.nomi}</p>
                </div>
                <div className="ml-auto flex gap-4 text-center">
                  <div>
                    <div className={`text-xl font-extrabold ${d.rang}`}>{d.narxi}</div>
                    <div className="text-purple-400 text-xs">Narxi</div>
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white">{d.muddat}</div>
                    <div className="text-purple-400 text-xs">Muddati</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shartlar */}
                <div className="bg-purple-900/50 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-3">📋 Talablar:</h3>
                  <ul className="space-y-2">
                    {d.shartlar.map((s, j) => (
                      <li key={j} className="flex items-start gap-2 text-purple-200 text-sm">
                        <span className={`${d.rang} mt-0.5`}>•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Qanday olinadi */}
                <div className="bg-purple-900/50 rounded-xl p-5">
                  <h3 className="text-white font-bold mb-3">🔄 Qanday olinadi:</h3>
                  <ul className="space-y-2">
                    {d.qandayOlinadi.map((q, j) => (
                      <li key={j} className="flex items-start gap-2 text-purple-200 text-sm">
                        <span className={`${d.rang} mt-0.5 font-bold`}>{j + 1}.</span>
                        {q.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Qo'shimcha ma'lumot */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">📜 Sertifikat xususiyatlari</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>✅ PDF formatda yuklab olish</li>
              <li>✅ QR kod orqali onlayn tekshirish</li>
              <li>✅ Unikal sertifikat raqami</li>
              <li>✅ Platforma asoschisi imzosi</li>
              <li>✅ Chiroyli dizayn, professional ko'rinish</li>
            </ul>
          </div>
          <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">⚠️ Muhim eslatmalar</h3>
            <ul className="space-y-2 text-purple-200 text-sm">
              <li>• Sertifikat platformaning ichki baholash tizimi asosida beriladi</li>
              <li>• Har bir sertifikat unikal raqamga ega</li>
              <li>• QR kod orqali istalgan vaqt tekshirish mumkin</li>
              <li>• Muddati tugagach qayta topshirish kerak</li>
              <li>• Soxta sertifikatlar aniqlanadi va bloklanadi</li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-r from-yellow-600/10 to-green-600/10 border border-yellow-500/20 rounded-2xl p-8 text-center">
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