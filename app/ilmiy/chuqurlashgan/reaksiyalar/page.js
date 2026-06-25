import Link from "next/link"

export default function Reaksiyalar() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/ligand-almashinish",
      icon: "🔄",
      title: "Ligand almashinish reaksiyalari",
      desc: "D (dissotsiativ), A (assotsiativ), I (almashinish) mexanizmlari, trans-ta'sir, kinetik trans-effekt, inert va labil komplekslar",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/oksidlanish-qaytarilish",
      icon: "⚡",
      title: "Oksidlanish-qaytarilish reaksiyalari",
      desc: "Ichki sfera (ko'prik ligand orqali) va tashqi sfera elektron ko'chishi, Marcus nazariyasi, qayta tashkilanish energiyasi",
      badge: "Redoks",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/katalitik-sikllar",
      icon: "⚗️",
      title: "Metall kompleks katalizatorlari",
      desc: "Monsanto (Rh), Wacker (Pd/Cu), Grubbs (Ru), Suzuki/Heck cross-coupling (Pd), Ziegler-Natta (Ti/Zr) — sanoat katalitik sikllari",
      badge: "Sanoat",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/fotokimyoviy",
      icon: "💡",
      title: "Fotokimyoviy reaksiyalar",
      desc: "Ligand fotodissotsiatsiyasi, fotoizomerlanish (nitro→nitrito), fotooksidlanish-qaytarilish, [Ru(bpy)₃]²⁺ fotokimyosi",
      badge: "Foton",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/kislota-asos",
      icon: "🧪",
      title: "Kislota-asos reaksiyalari",
      desc: "Akvakomplekslarning gidrolizi, protonlanish-deprotonlanish muvozanati, pKa qiymatlari, gidrokso ko'prik hosil bo'lishi (olatsiya)",
      badge: "Muvozanat",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/templat-sintez",
      icon: "🏗️",
      title: "Templat sintez",
      desc: "Metall ioni yordamida makrotsiklik ligandlar sintezi, crown efirlar, Schiff asoslari, ftalotsianinlar — metall templat effekti",
      badge: "Sintez",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/reaksiyalar/koordinatsion-polimerlar",
      icon: "🔗",
      title: "Koordinatsion polimerlanish",
      desc: "MOF sintezi, sol-gel, koordinatsion tarmoqlar — o'z-o'zini yig'ish (self-assembly) jarayonlari",
      badge: "Polimer",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">⚗️ Komplekslar reaksiyalari</h1>
          <p className="text-purple-400 text-sm">Ligand almashinish • Redoks • Kataliz • Fotokimyo • Templat sintez</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Komplekslar reaksiyalari haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-emerald-400">Kompleks birikmalar</strong> boy va xilma-xil reaksiyalarga kirishadi — 
            <strong className="text-emerald-400"> ligand almashinish</strong> (eng ko'p uchraydigan), 
            <strong className="text-emerald-400"> oksidlanish-qaytarilish</strong> (elektron ko'chishi), 
            <strong className="text-emerald-400"> fotokimyoviy o'zgarishlar</strong> va 
            <strong className="text-emerald-400"> katalitik sikllar</strong>. Bu reaksiyalarni tushunish 
            metall dori vositalari ta'sir mexanizmidan tortib sanoat katalizatorlarigacha bo'lgan keng 
            qo'llanish sohalari uchun muhimdir.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full text-xs">7 ta qism</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Ligand almashinish</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Kataliz</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Mexanizmlar</span>
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-emerald-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-emerald-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Reaksiya turlari jadvali */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kompleks reaksiyalari klassifikatsiyasi</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Reaksiya turi</th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
                <th className="py-3 px-4 text-purple-300">Asosiy parametr</th>
                <th className="py-3 px-4 text-purple-300">Klassik misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ligand almashinish", "D, A, I, I_d, I_a", "Kinetik konstantalar (k₁, k₂)", "[Co(NH₃)₅Cl]²⁺ + H₂O → [Co(NH₃)₅(H₂O)]³⁺"],
                  ["Oksidlanish-qaytarilish", "Ichki/tashqi sfera", "Qayta tashkilanish energiyasi (λ)", "[Fe(H₂O)₆]²⁺ + [Fe*(H₂O)₆]³⁺ → almashinuv"],
                  ["Fotokimyoviy", "MLCT/LMCT qo'zg'alish", "Kvant unumi (Φ), yashash vaqti", "[Ru(bpy)₃]²⁺ + hν → *[Ru(bpy)₃]²⁺"],
                  ["Kislota-asos", "Proton ko'chishi", "pKa, gidroliz konstantasi", "[Fe(H₂O)₆]³⁺ ⇌ [Fe(H₂O)₅(OH)]²⁺ + H⁺"],
                  ["Templat sintez", "Metall templat effekti", "Sikllanish samaradorligi", "Ni²⁺ + 4NH₃ + 2galioksal → Ni-makrotsikl"],
                  ["Koordinatsion polimerlanish", "O'z-o'zini yig'ish", "G'ovaklik, BET yuzasi", "Cu²⁺ + H₃BTC → HKUST-1 (MOF)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-emerald-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            ⚗️ Komplekslar reaksiyalari — <strong className="text-emerald-400">metall dori vositalari, 
            sanoat katalizatorlari va zamonaviy materiallar</strong> kimyosining asosi
          </p>
        </div>

      </section>
    </main>
  )
}