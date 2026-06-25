"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// ISHLASHI — SAYT HAQIDA VA FOYDALANISH QOIDALARI
// Yangi foydalanuvchilar uchun to'liq qo'llanma
//  ═══════════════════════════════════════════════════════════════════════════════

const SECTIONS = [
  {
    id: "oquv",
    icon: "📚",
    title: "O'quv bo'lim",
    desc: "Koordinatsion kimyo asoslari — talabalar uchun",
    features: [
      "Boshlang'ich mavzular (nomenklatura, klassifikatsiya)",
      "Kimyoviy bog'lanish nazariyalari (CFSE, LFT, VBT)",
      "3D interaktiv molekulalar",
      "Quiz testlar va masalalar",
      "Video darsliklar"
    ],
    path: "/oquv",
    color: "purple",
    audience: "1-2 kurs talabalari"
  },
  {
    id: "ilmiy",
    icon: "🔬",
    title: "Ilmiy bo'lim",
    desc: "Chuqurlashgan mavzular va tadqiqotlar",
    features: [
      "120+ kompleks birikma tahlili",
      "20 ta zamonaviy tahlil usuli (YaMR, XRD, EXAFS)",
      "Metall asosidagi dorilar (Sisplatin, Karboplatin)",
      "Supramolekulyar kimyo (MOF, molekulyar mashinalar)",
      "Ilmiy maqolalar bazasi"
    ],
    path: "/ilmiy",
    color: "blue",
    audience: "3-4 kurs, magistratura, tadqiqotchilar"
  },
  {
    id: "birikmalar",
    icon: "🧪",
    title: "Birikmalar katalogi",
    desc: "Har bir kompleks uchun to'liq ilmiy resurs",
    features: [
      "Kristall maydon nazariyasi (d-orbital diagrammalar)",
      "Simmetriya va nuqtaviy guruhlar",
      "YaMR, IQ, UV-Vis spektrlar (interaktiv)",
      "Strukturaviy parametrlar (bog' uzunliklari, burchaklar)",
      "Laboratoriya tartibi (step-by-step)"
    ],
    path: "/ilmiy/birikmalar",
    color: "yellow",
    audience: "Amaliyotchilar, laborantlar"
  },
  {
    id: "sertifikat",
    icon: "🏅",
    title: "Sertifikat tizimi",
    desc: "Bilimingizni tasdiqlang — 4 daraja",
    features: [
      "C daraja (boshlang'ich) — asosiy tushunchalar",
      "B daraja (o'rta) — nazariyalar va masalalar",
      "A daraja (yuqori) — tahlil usullari",
      "A+ daraja (professional) — ilmiy tadqiqotlar",
      "LinkedIn va CV uchun rasmiy sertifikat"
    ],
    path: "/sertifikat",
    color: "green",
    audience: "Barcha foydalanuvchilar"
  }
]

const STEPS = [
  {
    step: "01",
    icon: "🎯",
    title: "Darajangizni aniqlang",
    desc: "Sayt 4 ta asosiy auditoriya uchun mo'ljallangan: boshlang'ich talabalar, yuqori kurs talabalari, o'qituvchilar va tadqiqotchilar. O'zingizga mos bo'limni tanlang.",
    tip: "Agar birinchi marta koordinatsion kimyo o'rganayotgan bo'lsangiz, O'quv bo'limidan boshlang."
  },
  {
    step: "02",
    icon: "📚",
    title: "Nazariyani o'rganing",
    desc: "Har bir mavzu 3 darajada taqdim etilgan: kirish (oddiy til), o'rta (formulalar bilan), ilmiy (to'liq derivatsiya). O'zingizga mos darajani tanlang.",
    tip: "Interaktiv 3D molekulalar va animatsiyalar orqali tushunish osonroq."
  },
  {
    step: "03",
    icon: "🧪",
    title: "Birikmalarni o'rganing",
    desc: "120+ kompleks birikmaning to'liq tahlili — har biri uchun YaMR spektri, kristall maydon diagrammasi, laboratoriya tartibi mavjud.",
    tip: "Qidiruv (Ctrl+K) orqali kerakli birikmani tez toping."
  },
  {
    step: "04",
    icon: "📝",
    title: "Bilimingizni sinang",
    desc: "Har bir mavzu oxirida quiz testlar va amaliy masalalar mavjud. Natijalaringizni kuzatib boring va zaif tomonlaringizni aniqlang.",
    tip: "Sertifikat olish uchun kamida 80% natija kerak."
  },
  {
    step: "05",
    icon: "🏆",
    title: "Sertifikat oling",
    desc: "Barcha testlardan muvaffaqiyatli o'tganingizdan so'ng, rasmiy sertifikat oling. Uni LinkedIn profilingizga yoki CV ga qo'shing.",
    tip: "4 xil daraja: C, B, A, A+ — o'rganganingizga qarab."
  }
]

const FEATURES = [
  {
    icon: "🎮",
    title: "Interaktiv modellar",
    desc: "3D molekulalarni aylantiring, bog' uzunliklarini o'lchang, orbitallarni ko'ring"
  },
  {
    icon: "📊",
    title: "Interaktiv spektrlar",
    desc: "YaMR, IQ, UV-Vis spektrlarni slayder bilan o'rganing — har bir signalni bosib tushuntirish oling"
  },
  {
    icon: "🧮",
    title: "Kalkulyatorlar",
    desc: "Beer-Lambert, Bragg, Evans, Tanabe-Sugano — 20+ ilmiy kalkulyator"
  },
  {
    icon: "🎥",
    title: "Video darsliklar",
    desc: "Murakkab mavzular uchun qisqa va tushunarli videolar"
  },
  {
    icon: "📱",
    title: "Mobile-first dizayn",
    desc: "Telefon, planshet, kompyuter — barcha qurilmalarda mukammal ishlaydi"
  },
  {
    icon: "🔍",
    title: "Global qidiruv",
    desc: "Ctrl+K — barcha bo'limlardan tezkor qidiruv (100+ sahifa)"
  },
  {
    icon: "🌙",
    title: "Ko'z uchun qulay",
    desc: "To'q fon, yumshoq ranglar — uzoq vaqt o'qish uchun optimallashtirilgan"
  },
  {
    icon: "🇺🇿",
    title: "O'zbek tilida",
    desc: "O'zbekistondagi kompleks birikmalar platformasi — to'liq o'zbek tilida"
  }
]

const AUDIENCES = [
  {
    icon: "🎓",
    title: "Talabalar",
    desc: "1-4 kurs kimyo, biokimyo, farmatsevtika talabalari",
    benefits: ["Imtihonlarga tayyorgarlik", "Kurs ishlari", "Laboratoriya hisobotlari"]
  },
  {
    icon: "👨‍🏫",
    title: "O'qituvchilar",
    desc: "Oliy ta'lim muassasalari o'qituvchilari",
    benefits: ["Dars materiallari", "Interaktiv namoyishlar", "Test banklari"]
  },
  {
    icon: "🔬",
    title: "Tadqiqotchilar",
    desc: "Magistrantlar, doktorantlar, ilmiy xodimlar",
    benefits: ["Ilmiy maqolalar", "Tahlil usullari", "Strukturaviy ma'lumotlar"]
  },
  {
    icon: "💼",
    title: "Amaliyotchilar",
    desc: "Laborantlar, farmatsevtlar, sanoat mutaxassislari",
    benefits: ["Amaliy qo'llanmalar", "Birikma xossalari", "Xavfsizlik ma'lumotlari"]
  }
]

const FAQ = [
  {
    q: "Sayt bepulmi?",
    a: "Ha, JDA KIMYO to'liq bepul va ochiq platforma. Barcha mavzular, birikmalar va testlar hech qanday to'lovsiz mavjud."
  },
  {
    q: "Ro'yxatdan o'tish kerakmi?",
    a: "Mavzularni o'qish uchun ro'yxatdan o'tish shart emas. Lekin sertifikatlarni olish va natijalarni saqlash uchun profil yaratish tavsiya etiladi."
  },
  {
    q: "Qaysi tillarda mavjud?",
    a: "Hozircha faqat o'zbek tilida. Kelajakda ingliz va rus tillari ham qo'shilishi rejalashtirilgan."
  },
  {
    q: "Mobil qurilmalarda ishlaydimi?",
    a: "Ha, sayt to'liq responsive — telefon, planshet va kompyuterda bir xil yaxshi ishlaydi. Ba'zi 3D modellar katta ekran uchun optimallashtirilgan."
  },
  {
    q: "Ma'lumotlar qanchalik ishonchli?",
    a: "Barcha ilmiy ma'lumotlar nufuzli manbalardan olingan: Cotton-Wilkinson, Miessler-Tarr, Greenwood-Earnshaw darsliklari, SDBS, CSD bazalari, PubMed maqolalari. Har bir sahifada manbalar ko'rsatilgan."
  },
  {
    q: "Xato topsam, qanday xabar beraman?",
    a: "Telegram orqali @diyorbek_jabborov ga yozing yoki jabborovd18@gmail.com emailiga xat tafsilotlarini yuboring. Barcha xabarlar ko'rib chiqiladi va tuzatiladi."
  },
  {
    q: "O'z maqolamni qo'sha olamanmi?",
    a: "Ha! Ilmiy bo'limda 'Maqola yaratish' funksiyasi mavjud. O'z tadqiqotlaringizni, sharhlaringizni yoki dars ishlanmalaringizni baham ko'ring."
  },
  {
    q: "Sertifikat rasmiymi?",
    a: "Sertifikat JDA KIMYO platformasi tomonidan beriladi va LinkedIn, CV uchun ishlatilishi mumkin. Rasmiy davlat namunasidagi sertifikat emas, lekin bilim darajangizni tasdiqlovchi hujjat."
  },
  {
    q: "Offline ishlash imkoniyati bormi?",
    a: "Hozircha yo'q, lekin PWA (Progressive Web App) versiyasi ustida ish olib borilmoqda. Kelajakda offline rejim qo'shiladi."
  },
  {
    q: "Yangi mavzular qachon qo'shiladi?",
    a: "Har hafta yangi birikmalar va mavzular qo'shiladi. Yangiliklar bo'limida kuzatib boring yoki Telegram kanalga obuna bo'ling."
  }
]

const TECHNOLOGIES = [
  { name: "Next.js 14+", desc: "React framework", icon: "⚛️" },
  { name: "Tailwind CSS", desc: "Styling", icon: "🎨" },
  { name: "Recharts", desc: "Grafiklar", icon: "📊" },
  { name: "Three.js", desc: "3D modellar", icon: "🎮" },
  { name: "LaTeX", desc: "Formulalar", icon: "🧮" },
  { name: "Vercel", desc: "Hosting", icon: "🚀" }
]

export default function IshlashiPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [activeSection, setActiveSection] = useState("oquv")

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Sayt qanday ishlaydi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">📖</span>
                Sayt qanday ishlaydi?
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                JDA KIMYO platformasi haqida to'liq qo'llanma
              </p>
            </div>
            <Link href="/" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Bosh sahifa
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-400 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              YANGI FOYDALANUVCHILAR UCHUN
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Kompleks birikmalar
              </span>
              <br />
              <span className="text-white">dunyoiga xush kelibsiz!</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              <strong className="text-yellow-400">JDA KIMYO</strong> — O'zbekistondagi  koordinatsion kimyo platformasi.
              Nazariyadan tortib ilmiy tadqiqotlargacha, interaktiv modellar va zamonaviy tahlil usullari —
              <strong className="text-orange-400"> barchasi bir joyda</strong>.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/oquv" className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl text-black font-bold text-lg shadow-2xl shadow-orange-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-3">
                <span>🚀</span>
                <span>O'rganishni boshlash</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/qidiruv" className="px-8 py-4 bg-purple-800/50 hover:bg-purple-700/70 border-2 border-purple-600/50 rounded-2xl text-white font-bold text-lg backdrop-blur-sm transition-all transform hover:-translate-y-1 flex items-center gap-3">
                <span>🔍</span>
                <span>Qidiruv (Ctrl+K)</span>
              </Link>
            </div>

            {/* Statistika */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">📚</div>
                <div className="text-2xl font-extrabold text-yellow-400">95+</div>
                <div className="text-xs text-purple-400 mt-1">O'quv fayllari</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">🧪</div>
                <div className="text-2xl font-extrabold text-yellow-400">120+</div>
                <div className="text-xs text-purple-400 mt-1">Birikmalar</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">🔬</div>
                <div className="text-2xl font-extrabold text-yellow-400">250+</div>
                <div className="text-xs text-purple-400 mt-1">Ilmiy fayllar</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-1">📊</div>
                <div className="text-2xl font-extrabold text-yellow-400">20</div>
                <div className="text-xs text-purple-400 mt-1">Tahlil usullari</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY BO'LIMLAR */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Saytning <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4 ta asosiy bo'limi</span>
            </h2>
            <p className="text-purple-300 max-w-2xl mx-auto">
              Har bir bo'lim alohida auditoriya va maqsad uchun mo'ljallangan
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeSection === section.id
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50 shadow-lg shadow-yellow-500/20"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>

          {SECTIONS.filter(s => s.id === activeSection).map((section) => (
            <div key={section.id} className={`bg-gradient-to-br from-${section.color}-900/30 to-purple-900/40 border border-${section.color}-700/50 rounded-3xl p-8 md:p-10`}>
              <div className="flex items-start gap-6 mb-6 flex-col md:flex-row">
                <div className="text-6xl">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{section.title}</h3>
                  <p className="text-purple-300 text-lg mb-3">{section.desc}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/50 border border-purple-700/50 rounded-full text-xs">
                    <span>🎯</span>
                    <span className="text-purple-300">Auditoriya:</span>
                    <span className="text-yellow-400 font-semibold">{section.audience}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {section.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 bg-purple-950/40 border border-purple-700/30 rounded-xl p-4">
                    <span className="text-yellow-400 text-lg">✓</span>
                    <span className="text-purple-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={section.path} className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600/80 hover:bg-yellow-500 rounded-xl text-black font-bold transition-all transform hover:-translate-y-1">
                <span>{section.icon}</span>
                <span>{section.title}ga o'tish</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* QANDAY FOYDALANISH — 5 QADAM */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">5 qadamda</span> saytdan qanday foydalanish
            </h2>
            <p className="text-purple-300 max-w-2xl mx-auto">
              Samara olish uchun oddiy yo'riqnoma
            </p>
          </div>

          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8 hover:border-yellow-400/50 transition-all transform hover:-translate-y-1">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-2xl font-extrabold text-black shadow-xl shadow-orange-500/30">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-3xl">{step.icon}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-purple-200 leading-relaxed mb-4">{step.desc}</p>
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 flex items-start gap-3">
                      <span className="text-yellow-400 text-lg flex-shrink-0">💡</span>
                      <p className="text-yellow-200 text-sm">
                        <strong>Maslahat:</strong> {step.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XUSUSIYATLAR */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Nima uchun <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">JDA KIMYO</span>?
            </h2>
            <p className="text-purple-300 max-w-2xl mx-auto">
              Platformaning asosiy xususiyatlari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AUDITORIYALAR */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Kimlar uchun <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">mo'ljallangan</span>?
            </h2>
            <p className="text-purple-300 max-w-2xl mx-auto">
              4 ta asosiy auditoriya — har biri uchun maxsus materiallar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AUDIENCES.map((aud, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="text-5xl mb-4">{aud.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{aud.title}</h3>
                <p className="text-purple-300 text-sm mb-4">{aud.desc}</p>
                <ul className="space-y-2">
                  {aud.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-400 flex-shrink-0">✓</span>
                      <span className="text-purple-200">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* TEXNOLOGIYALAR */}
        <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Zamonaviy texnologiyalar</span> asosida
            </h2>
            <p className="text-purple-300">
              Tezkor, ishonchli va qulay foydalanuvchi tajribasi
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {TECHNOLOGIES.map((tech, i) => (
              <div key={i} className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center hover:border-yellow-400/50 hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-2">{tech.icon}</div>
                <div className="text-sm font-bold text-white mb-1">{tech.name}</div>
                <div className="text-[10px] text-purple-400">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              Ko'p so'raladigan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">savollar</span>
            </h2>
            <p className="text-purple-300 max-w-2xl mx-auto">
              Eng ko'p beriladigan savollarga javoblar
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`bg-gradient-to-r from-purple-900/40 to-blue-900/40 border rounded-2xl overflow-hidden transition-all ${
                  openFaq === i ? "border-yellow-400/50" : "border-purple-700/50"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{openFaq === i ? "❓" : "❔"}</span>
                    <h3 className="text-base md:text-lg font-bold text-white">{item.q}</h3>
                  </div>
                  <span className={`text-2xl transition-transform ${openFaq === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-0">
                    <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-5">
                      <p className="text-purple-200 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* YARATUVCHI HAQIDA */}
        <div className="bg-gradient-to-br from-yellow-900/20 via-orange-900/20 to-red-900/20 border border-yellow-500/30 rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">👨‍🔬</div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">👨‍🔬</span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Yaratuvchi haqida</h2>
                <p className="text-yellow-400 text-sm">Diyorbek Jabborov Arslonivich</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">JDA KIMYO</strong> platformasi asoschisi.
                  Kimyo faniga ixlosmand, koordinatsion kimyo va spektroskopiya sohasida tadqiqotlar olib boradi.
                </p>
                <p className="text-purple-200 leading-relaxed">
                  Maqsad — O'zbekistonda zamonaviy kimyo ta'limini rivojlantirish,
                  <strong className="text-yellow-400"> o'zbek tilida</strong> yuqori sifatli ilmiy resurslar yaratish.
                </p>
              </div>
              <div className="space-y-3">
                <a
                  href="mailto:jabborovd18@gmail.com"
                  className="flex items-center gap-3 bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700/50 rounded-xl p-4 transition-all"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <div className="text-xs text-purple-400">Email</div>
                    <div className="text-yellow-400 font-semibold">jabborovd18@gmail.com</div>
                  </div>
                </a>
                <a
                  href="https://t.me/diyorbek_jabborov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700/50 rounded-xl p-4 transition-all"
                >
                  <span className="text-2xl">✈️</span>
                  <div>
                    <div className="text-xs text-purple-400">Telegram</div>
                    <div className="text-yellow-400 font-semibold">@diyorbek_jabborov</div>
                  </div>
                </a>
                <a
                  href="https://jdakimyo.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-purple-900/50 hover:bg-purple-800/70 border border-purple-700/50 rounded-xl p-4 transition-all"
                >
                  <span className="text-2xl">🌐</span>
                  <div>
                    <div className="text-xs text-purple-400">Veb-sayt</div>
                    <div className="text-yellow-400 font-semibold">jdakimyo.uz</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA — HAMKORLIK */}
        <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Birga <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">rivojlantiramiz</span>!
          </h2>
          <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
            Xato topdingizmi? Yangi mavzu taklif qilmoqchimisiz? Maqolangizni baham ko'rmoqchimisiz?
            Hamkorlikka tayyormiz!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/hamkorlik" className="px-6 py-3 bg-yellow-600/80 hover:bg-yellow-500 rounded-xl text-black font-bold transition-all transform hover:-translate-y-1">
              🤝 Hamkorlik sahifasi
            </Link>
            <Link href="/ilmiy/maqolalar/yaratish" className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-bold transition-all transform hover:-translate-y-1">
              ✍️ Maqola yaratish
            </Link>
            <a href="mailto:jabborovd18@gmail.com" className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/70 border border-purple-600/50 rounded-xl text-white font-bold transition-all transform hover:-translate-y-1">
              📧 Xabar yuborish
            </a>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Bosh sahifa
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/oquv" className="px-6 py-3 bg-purple-600/60 hover:bg-purple-500/80 border border-purple-500/50 rounded-xl text-white font-semibold">
              📚 O'quv
            </Link>
            <Link href="/ilmiy" className="px-6 py-3 bg-blue-600/60 hover:bg-blue-500/80 border border-blue-500/50 rounded-xl text-white font-semibold">
              🔬 Ilmiy
            </Link>
            <Link href="/sertifikat" className="px-6 py-3 bg-yellow-600/80 hover:bg-yellow-500 rounded-xl text-black font-bold">
              🏅 Sertifikat olish →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Koordinatsion kimyo tahlil portali</p>
          <p className="mt-1">Yaratuvchi: Diyorbek Jabborov Arslonivich • v2.0.0</p>
        </div>
      </footer>
    </main>
  )
}