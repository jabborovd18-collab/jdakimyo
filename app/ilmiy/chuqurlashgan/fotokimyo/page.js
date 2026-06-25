import Link from "next/link"

export default function Fotokimyo() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo/jablonski",
      icon: "📊",
      title: "Jablonski diagrammasi",
      desc: "Yutilish, fluoressensiya, fosforessensiya, interkombinatsion konversiya (ISC), ichki konversiya (IC) — barcha fotofizik jarayonlar",
      badge: "Asosiy",
      badgeColor: "bg-sky-600/20 text-sky-400 border-sky-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo/mlct-holati",
      icon: "⭐",
      title: "MLCT qo'zg'algan holat",
      desc: "[Ru(bpy)₃]²⁺ — fotosensibilizator etaloni, ³MLCT holat, yashash vaqti, kvant unumi, oksidlovchi/qaytaruvchi so'ndirish",
      badge: "Muhim",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo/lantanidlar",
      icon: "🔬",
      title: "Lantanid komplekslari fotofizikasi",
      desc: "Eu³⁺, Tb³⁺ — tor emission chiziqlar, antenna effekti, uzoq yashash vaqti (ms), vaqt-ajraladigan fluoressensiya",
      badge: "Lantanidlar",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo/oled",
      icon: "🖥️",
      title: "OLED materiallari — Ir(III) va Pt(II)",
      desc: "Spin-orbit bog'lanish, 100% ichki kvant unumi, fosforessensiya, Ir(ppy)₃, FIrpic, zamonaviy displeylar",
      badge: "OLED",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/fotokimyo/fotokataliz",
      icon: "⚡",
      title: "Fotokatalitik sikllar",
      desc: "Suvning fotokatalitik parchalanishi, CO₂ reduksiyasi, [Ru(bpy)₃]²⁺ asosidagi katalitik tizimlar, quyosh energiyasi konversiyasi",
      badge: "Kataliz",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-sky-400">💡 Fotokimyo va fotofizika</h1>
          <p className="text-purple-400 text-sm">Jablonski diagrammasi • MLCT holat • Lantanidlar • OLED • Fotokataliz</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Fotokimyo va fotofizika haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-sky-400">Fotokimyo</strong> — yorug'lik ta'sirida boradigan kimyoviy reaksiyalarni,
            <strong className="text-sky-400"> fotofizika</strong> esa qo'zg'algan holatlarning fizik jarayonlarini o'rganadi.
            Kompleks birikmalarda <strong className="text-sky-400">MLCT qo'zg'algan holatlar</strong> juda muhim —
            ular fotosensibilizator, fotokatalizator va OLED materiallari sifatida qo'llaniladi.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-sky-600/20 text-sky-400 border border-sky-600/30 px-3 py-1 rounded-full text-xs">5 ta qism</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Jablonski diagrammasi</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">MLCT holat</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Amaliy qo'llanish</span>
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-sky-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-sky-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            💡 Fotokimyo va fotofizika — <strong className="text-sky-400">quyosh energiyasi konversiyasi, 
            fotokataliz va zamonaviy optoelektron materiallar</strong> uchun fundamental asos
          </p>
        </div>

      </section>
    </main>
  )
}