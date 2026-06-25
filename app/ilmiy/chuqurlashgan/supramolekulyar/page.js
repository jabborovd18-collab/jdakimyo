import Link from "next/link"

export default function Supramolekulyar() {
  const qismlar = [
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/host-guest",
      icon: "🔒",
      title: "Host-guest kimyosi",
      desc: "Crown efirlar, kriptandlar, kaliksarenlar, siklodekstrinlar — molekulyar qafaslar va ularning selektiv bog'lash xossalari, termodinamik barqarorlik",
      badge: "Asosiy",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/mof",
      icon: "🏗️",
      title: "MOF — Metall-Organic Frameworks",
      desc: "G'ovakli koordinatsion polimerlar — gaz saqlash (H₂, CH₄, CO₂), kataliz, dori yetkazib berish, rekord BET yuzalari (7000+ m²/g)",
      badge: "G'ovakli",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/metallosupramolekulyar",
      icon: "🔗",
      title: "Metallosupramolekulyar ansambllar",
      desc: "Metall ioni yordamida o'z-o'zini yig'ish — molekulyar panjaralar, kataklar, helikatlar, metall-makrotsikllar, Fujita va Stang ansambllari",
      badge: "O'z-o'zini yig'ish",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/molekulyar-mashinalar",
      icon: "⚙️",
      title: "Molekulyar mashinalar",
      desc: "Rotaksanlar, katenanlar, molekulyar motorlar — Nobel 2016 (Sauvage, Stoddart, Feringa), molekulyar liftlar, mushaklar, nanomashinalar",
      badge: "Nobel 2016",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/sensorlar",
      icon: "📡",
      title: "Supramolekulyar sensorlar",
      desc: "Anion va kation tanib olish, fluoressensiya va kolorimetrik sensorlar, turn-on/turn-off mexanizmlari, portlovchi moddalarni aniqlash",
      badge: "Sensorlar",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30"
    },
    {
      href: "/ilmiy/chuqurlashgan/supramolekulyar/biologik",
      icon: "🧬",
      title: "Biologik supramolekulyar tizimlar",
      desc: "DNK origami, oqsil-protein o'zaro ta'siri, dori yetkazib berish, membrana kanallari, bioilhomlantirilgan materiallar",
      badge: "Bio",
      badgeColor: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan mavzular</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🏗️ Supramolekulyar komplekslar</h1>
          <p className="text-purple-400 text-sm">Host-guest • MOF • Metallosupramolekulyar • Molekulyar mashinalar</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Asosiy ma'lumot */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Supramolekulyar kimyo haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-purple-400">Supramolekulyar kimyo</strong> — molekulalararo 
            <strong className="text-purple-400"> kovalent bo'lmagan o'zaro ta'sirlar</strong> (vodorod bog'lar, 
            Van der Waals kuchlari, π−π stacking, elektrostatik, gidrofob effekt) orqali 
            murakkab tuzilmalarni o'rganadi. <strong className="text-purple-400">Jean-Marie Lehn 
            (Nobel 1987)</strong> — supramolekulyar kimyoning asoschisi. Kompleks birikmalar nuqtai 
            nazaridan, metall ionlari <strong>koordinatsion bog'lanish</strong> orqali supramolekulyar 
            ansambllarni barqarorlashtiradi — bu <strong>metallosupramolekulyar kimyo</strong>.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">6 ta qism</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Nobel mukofotlari (1987, 2016)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">O'z-o'zini yig'ish</span>
          </div>
        </div>

        {/* Asosiy tushunchalar jadvali */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-6">📊 Supramolekulyar o'zaro ta'sirlar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O'zaro ta'sir turi</th>
                <th className="py-3 px-4 text-purple-300">Energiya (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Yo'naltirilganligi</th>
                <th className="py-3 px-4 text-purple-300">Komplekslarda misoli</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Koordinatsion bog' (M−L)","100−400","Kuchli yo'naltirilgan","Metall-ligand bog'i — asosiy"],
                  ["Vodorod bog' (D−H···A)","4−40","Yo'naltirilgan","N−H···Cl, O−H···O — ikkinchi sfera"],
                  ["π−π stacking","2−15","Yo'naltirilgan","bpy ligandlar orasida, grafit tipidagi"],
                  ["Van der Waals","0.5−5","Yo'naltirilmagan","Molekulalararo — to'ldirish effekti"],
                  ["Elektrostatik (ion-ion)","10−200","Yo'naltirilmagan","Kation-anion juftlari, tashqi sfera"],
                  ["Gidrofob effekt","5−50","Yo'naltirilmagan","Suvli eritmalarda — biologik tizimlar"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-purple-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Qismlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {qismlar.map((q, i) => (
            <Link 
              key={i}
              href={q.href}
              className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 hover:border-purple-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl group-hover:scale-110 transition-transform">{q.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">{q.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${q.badgeColor} font-semibold`}>{q.badge}</span>
                  </div>
                  <p className="text-purple-300 text-sm leading-relaxed">{q.desc}</p>
                </div>
                <div className="text-purple-400 text-2xl group-hover:translate-x-1 transition-transform">→</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Nobel bloki */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold text-lg mb-3">🏆 Supramolekulyar kimyoda Nobel mukofotlari</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold min-w-[90px]">1987:</span>
              <span className="text-purple-200"><strong>Donald J. Cram, Jean-Marie Lehn, Charles J. Pedersen</strong> — "yuqori selektiv strukturaga ega molekulalarni ishlab chiqish va qo'llash" (crown efirlar, kriptandlar, sferandlar)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-yellow-400 font-bold min-w-[90px]">2016:</span>
              <span className="text-purple-200"><strong>Jean-Pierre Sauvage, J. Fraser Stoddart, Bernard L. Feringa</strong> — "molekulyar mashinalarni loyihalash va sintez qilish" (katenanlar, rotaksanlar, molekulyar motorlar)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            🏗️ Supramolekulyar kimyo — <strong className="text-purple-400">"molekulalardan tashqari kimyo"</strong> —
            kovalent bo'lmagan o'zaro ta'sirlar orqali murakkab funktsional tizimlar yaratish
          </p>
        </div>

      </section>
    </main>
  )
}