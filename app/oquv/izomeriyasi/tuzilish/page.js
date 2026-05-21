import Link from "next/link"

export default function TuzilishIzomeriyasi() {
  const turlar = [
    { href: "/oquv/izomeriyasi/tuzilish/ionlanish", icon: "⚡", title: "Ionlanish izomeriyasi", desc: "[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br", badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", has3D: false },
    { href: "/oquv/izomeriyasi/tuzilish/gidrat", icon: "💧", title: "Gidrat izomeriyasi", desc: "CrCl₃·6H₂O ning 3 ta izomeri", badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", has3D: false },
    { href: "/oquv/izomeriyasi/tuzilish/boglanish", icon: "🔗", title: "Bog'lanish izomeriyasi", desc: "[Co(NH₃)₅NO₂]²⁺ va [Co(NH₃)₅ONO]²⁺", badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", has3D: true },
    { href: "/oquv/izomeriyasi/tuzilish/koordinatsion", icon: "🔄", title: "Koordinatsion izomeriya", desc: "[Cr(NH₃)₆][Fe(CN)₆] va [Fe(NH₃)₆][Cr(CN)₆]", badge: "Asosiy", badgeColor: "bg-green-600/20 text-green-400 border-green-600/30", has3D: true },
    { href: "/oquv/izomeriyasi/tuzilish/boshqa", icon: "📚", title: "Qolgan 6 ta tur", desc: "O'rinbosar, konformatsion, holat, elektron, transformatsion, formal", badge: "Qo'shimcha", badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30", has3D: false },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🧬 Tuzilish (struktura) izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Formulasi har xil yoziladigan izomerlar • 10 ta tur</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Tuzilish izomeriyasi haqida</h2>
          <p className="text-purple-200 leading-relaxed">
            <strong className="text-yellow-400">Tuzilish izomeriyasi</strong> — moddalarning formulalari 
            <strong className="text-yellow-400"> har xil yoziladigan</strong> izomeriya turi. Bunda ligandlarning 
            ichki va tashqi sferada joylashishi, donor atomi yoki ion tarkibi farq qiladi.
          </p>
        </div>

        <div className="space-y-4">
          {turlar.map((t, i) => (
            <Link key={i} href={t.href}
              className="group flex items-center gap-5 bg-purple-900/40 border border-purple-700/50 rounded-xl p-6 hover:bg-purple-800/60 hover:border-pink-400/50 transition-all transform hover:-translate-y-1"
            >
              <div className="text-4xl group-hover:scale-110 transition-transform">{t.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-purple-500 font-bold">0{i+1}</span>
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">{t.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${t.badgeColor} font-semibold`}>{t.badge}</span>
                  {t.has3D && <span className="bg-purple-600/30 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-bold">3D</span>}
                </div>
                <p className="text-purple-300 text-sm">{t.desc}</p>
              </div>
              <span className="text-purple-600 group-hover:text-pink-400 transition-colors text-xl">→</span>
            </Link>
          ))}
        </div>

      </section>
    </main>
  )
}