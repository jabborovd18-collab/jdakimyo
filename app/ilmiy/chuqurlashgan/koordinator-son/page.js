import Link from "next/link"

export default function KoordinatorSon() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/kch-2-4",
      icon: "📏",
      title: "KCh = 2−4: Past koordinator sonlar",
      desc: "Chiziqli (D∞h), uchburchak (D₃h), tetraedrik (Td), kvadrat planar (D₄h) — sp, sp², sp³, dsp² gibridlanish",
      badge: "Asosiy",
      badgeColor: "bg-violet-600/20 text-violet-400 border-violet-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/kch-5-6",
      icon: "🔷",
      title: "KCh = 5−6: O'rta koordinator sonlar",
      desc: "Trigonal bipiramida (D₃h), kvadrat piramida (C₄v), oktaedrik (Oh) — eng ko'p uchraydigan geometriyalar",
      badge: "Muhim",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/kch-7-12",
      icon: "🪐",
      title: "KCh = 7−12: Yuqori koordinator sonlar",
      desc: "Pentagonal bipiramida, antiprizma, dodekaedr, ikosaedr — 4d/5d metallar va f-elementlar",
      badge: "Yuqori",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/kepert-modeli",
      icon: "🔮",
      title: "Kepert modeli",
      desc: "Ligandlararo elektrostatik itarilish — nuqtaviy zaryadlar modeli, M−L−M burchaklarni bashorat qilish",
      badge: "Model",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/vsepr",
      icon: "📐",
      title: "VSEPR komplekslarda",
      desc: "Valent elektron juftlari itarilishi — geometriyani bashorat qilish, stereokimyoviy faol juftlar",
      badge: "Nazariya",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/berry-psevdorotatsiya",
      icon: "🔄",
      title: "Berry psevdorotatsiyasi",
      desc: "TBP ↔ kvadrat piramida o'zaro o'tish mexanizmi, Fe(CO)₅ misolida, NMR vaqt shkalasi",
      badge: "Mexanizm",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/koordinator-son/yahn-teller-geometriya",
      icon: "⚡",
      title: "Yahn-Teller geometrik buzilishi",
      desc: "d⁴ va d⁹ konfiguratsiyalarda oktaedrik cho'zilish/siqilish, Cu²⁺ komplekslari misolida",
      badge: "Buzilish",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-violet-400">🔷 Koordinator son va geometriya</h1>
          <p className="text-purple-400 text-sm">KCh 2−12 • Poliedr modellari • VSEPR • Kepert modeli • 7 ta qism</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Koordinator son haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-violet-400">Koordinator son (KCh)</strong> — metall markaziga bevosita bog'langan 
            donor atomlar soni. Bu kompleks birikmalarning <strong className="text-violet-400">eng muhim strukturaviy 
            xarakteristikasi</strong> bo'lib, metallning elektron konfiguratsiyasi, ligand o'lchami va zaryadiga bog'liq.
            KCh 2 dan 12 gacha bo'lishi mumkin, eng ko'p uchraydigani — <strong className="text-violet-400">4 va 6</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">KCh 2−12</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">7 ta qism</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kepert + VSEPR</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Misollar bilan</span>
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-violet-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-violet-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* KCh jadvali */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Koordinator son bo'yicha geometriyalar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KCh</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Gibridlanish</th>
                <th className="py-3 px-4 text-purple-300">Xarakterli metallar</th>
                <th className="py-3 px-4 text-purple-300">Misollar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["2", "Chiziqli", "D∞h", "sp", "Cu⁺, Ag⁺, Au⁺, Hg²⁺ (d¹⁰)", "[Ag(NH₃)₂]⁺"],
                  ["3", "Uchburchak", "D₃h", "sp²", "Pt⁰, Pd⁰ (d¹⁰)", "[Pt(PPh₃)₃]"],
                  ["4", "Tetraedrik", "Td", "sp³", "Co²⁺, Zn²⁺, Fe²⁺", "[CoCl₄]²⁻"],
                  ["4", "Kvadrat planar", "D₄h", "dsp²", "Ni²⁺, Pt²⁺, Pd²⁺ (d⁸)", "[Ni(CN)₄]²⁻"],
                  ["5", "Trigonal bipiramida", "D₃h", "sp³d", "Fe⁰, Cu²⁺", "[Fe(CO)₅]"],
                  ["5", "Kvadrat piramida", "C₄v", "sp³d", "VO²⁺, Cu²⁺", "[VO(acac)₂]"],
                  ["6", "Oktaedrik", "Oh", "d²sp³", "Cr³⁺, Co³⁺, Fe²⁺/³⁺", "[Co(NH₃)₆]³⁺"],
                  ["7", "Pent. bipiramida", "D₅h", "sp³d³", "Zr⁴⁺, Mo⁴⁺", "[ZrF₇]³⁻"],
                  ["8", "Kv. antiprizma", "D₄d", "sp³d⁴", "Mo⁴⁺, W⁴⁺", "[Mo(CN)₈]⁴⁻"],
                  ["9", "Uch kal. trig. prizma", "D₃h", "—", "Nd³⁺, Sm³⁺", "[Nd(H₂O)₉]³⁺"],
                  ["12", "Ikosaedr", "Ih", "—", "La³⁺, Ce³⁺", "[Ce(NO₃)₆]²⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-violet-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-green-400 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🔷 Koordinator son kompleks birikmaning <strong className="text-violet-400">strukturaviy asosi</strong> — 
            geometriyani, bog'lanish xarakterini va fizik-kimyoviy xossalarni belgilaydi
          </p>
        </div>

      </section>
    </main>
  )
}