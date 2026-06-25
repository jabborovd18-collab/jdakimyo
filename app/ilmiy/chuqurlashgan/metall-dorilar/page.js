import Link from "next/link"

export default function MetallDorilar() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/platina",
      icon: "💊",
      title: "Pt(II) va Pt(IV) komplekslari",
      desc: "Sisplatin, karboplatin, oksaliplatin — DNK cross-linking, rezistentlik mexanizmlari, nano-yetkazish tizimlari, Pt(IV) prodruglar",
      badge: "Asosiy",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/ruteniy",
      icon: "🔬",
      title: "Ru(III) komplekslari",
      desc: "NAMI-A, KP1019, KP1339 — antimetastatik faollik, transferrin orqali tashilish, aktivatsiya-qaytarilish mexanizmi",
      badge: "Antimetastatik",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/oltin",
      icon: "✨",
      title: "Au(I) komplekslari",
      desc: "Auranofin — revmatoid artrit, tioridoksin reduktaza ingibitori, xrizoterapiya tarixi, Au(III) komplekslari",
      badge: "Xrizoterapiya",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/temir",
      icon: "🩸",
      title: "Fe komplekslari",
      desc: "Ferroquine (bezgak), bleomitsin (saratonga qarshi), ferrosen hosilalari — tamoksifen analoglari, Fe chelatorlari",
      badge: "Bezgak/Saraton",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/boshqa",
      icon: "🧪",
      title: "Boshqa metall dori vositalari",
      desc: "Ru(II) — fotodinamik terapiya, Ga(III) — antimikrob, Bi(III) — Helicobacter pylori, V(IV) — diabet, Cu(II) — yallig'lanish",
      badge: "Xilma-xil",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/metall-dorilar/mexanizm",
      icon: "⚡",
      title: "Ta'sir mexanizmlari",
      desc: "DNK bilan bog'lanish, oqsillar bilan ta'sir, redoks aktivatsiya, prodrug strategiyasi, nano-yetkazish, immunogen hujayra o'limi (ICD)",
      badge: "Mexanizm",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💊 Metall dori vositalari</h1>
          <p className="text-purple-400 text-sm">Pt • Ru • Au • Fe • Ga • Bi • V • Cu — tibbiyotda metall komplekslar</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Metall dori vositalari haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-blue-400">Metall dori vositalari</strong> — zamonaviy farmatsevtikaning 
            eng tez rivojlanayotgan yo'nalishlaridan biri. Metall komplekslar <strong>noyob kimyoviy 
            reaksiyalarga</strong> (redoks, ligand almashinish, koordinatsion bog'lanish) kirisha oladi — 
            bu ularga <strong>organik dorilardan farqli ta'sir mexanizmlarini</strong> taqdim etadi.
            Sisplatindan boshlab (1978-yilda FDA tasdiqlagan), metall dori vositalari 
            <strong>saraton, revmatoid artrit, bezgak, bakterial infeksiyalar</strong> kabi 
            kasalliklarni davolashda qo'llanilmoqda.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">6 ta qism</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Saraton terapiyasi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">DNK target</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Nobel mukofotlari</span>
          </div>
        </div>

        {/* Tarixiy vaqt chizig'i */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-6">📜 Metall dori vositalari tarixi</h2>
          <div className="space-y-3">
            {[
              { year: "1909", event: "Salvarsan (Arsfenamin) — Paul Ehrlich. Birinchi zamonaviy metall dori. Sifilisga qarshi As kompleksi.", icon: "🏆" },
              { year: "1920-lar", event: "Xrizoterapiya (oltin terapiyasi) — Robert Koch. Au(I) tiomalat revmatoid artritga qarshi.", icon: "✨" },
              { year: "1965", event: "Sisplatinning saratonga qarshi faolligi kashf qilindi — Barnett Rosenberg. Cis-[PtCl₂(NH₃)₂] E. coli bo'linishini to'xtatdi.", icon: "💊" },
              { year: "1978", event: "Sisplatin FDA tomonidan tasdiqlandi. Tuxumdon va moyak saratoni uchun.", icon: "✅" },
              { year: "1989", event: "Karboplatin — kamroq nefrotoksik 2-avlod Pt dori vositasi.", icon: "🔬" },
              { year: "1996", event: "Oksaliplatin — kolorektal saraton uchun 3-avlod Pt dori vositasi.", icon: "🧪" },
              { year: "2000-lar", event: "NAMI-A (Ru) — birinchi antimetastatik metall dori. KP1019, KP1339 (Ru) — klinik sinovlarda.", icon: "🔮" },
              { year: "2010-lar", event: "Ferroquine (Fe) — bezgakka qarshi. Nano-yetkazish tizimlari. Immunogen hujayra o'limi (ICD).", icon: "🩸" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 border border-purple-700/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <span className="text-yellow-400 font-bold text-sm">{r.year}:</span>
                  <span className="text-purple-200 text-sm ml-2">{r.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-blue-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-blue-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Metallar jadvali */}
        <div className="mt-10 bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Tibbiyotda qo'llaniladigan metallar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Oksidlanish darajasi</th>
                <th className="py-3 px-4 text-purple-300">Dori vositasi</th>
                <th className="py-3 px-4 text-purple-300">Kasallik</th>
                <th className="py-3 px-4 text-purple-300">Holati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Pt","Pt(II)","Sisplatin, Karboplatin, Oksaliplatin","Saraton (tuxumdon, moyak, kolorektal)","✅ FDA tasdiqlangan"],
                  ["Ru","Ru(III)","NAMI-A, KP1339","Saraton (metastazlar)","🔄 Klinik sinovlarda"],
                  ["Au","Au(I)","Auranofin, Natriy aurotiomalat","Revmatoid artrit","✅ FDA tasdiqlangan"],
                  ["Fe","Fe(II)","Ferroquine, Bleomitsin","Bezgak, Saraton","🔄 Klinik sinovlarda"],
                  ["Ga","Ga(III)","Galliy nitrat, Ga-maltolat","Giperkalsemiya, Infeksiyalar","✅ FDA tasdiqlangan"],
                  ["Bi","Bi(III)","Bismut subsitrat (De-Nol)","Helicobacter pylori (oshqozon yarasi)","✅ FDA tasdiqlangan"],
                  ["V","V(IV)","Vanadil sulfat, BMOV","Diabet (insulin mimetik)","🔬 Tadqiqotda"],
                  ["Cu","Cu(II)","Cu-ATSM (radiatsiya)","Saraton (radiatsion terapiya)","🔄 Klinik sinovlarda"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-blue-400">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            💊 Metall dori vositalari — <strong className="text-blue-400">noorganik kimyo va tibbiyot 
            chorrahasida</strong> joylashgan eng istiqbolli tadqiqot yo'nalishlaridan biri
          </p>
        </div>

      </section>
    </main>
  )
}