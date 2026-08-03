import Link from "next/link"

export const metadata = {
  title: "Komplekslarda kimyoviy bog'lanish",
  description:
    "Kompleks birikmalarda bog'lanishning to'rt nazariyasi: valent bog'lanish, kristall maydon, ligand maydon va Yan-Teller effekti.",
}

export default function KimyoviyBoglanish() {
  const bolimlar = [
    {
      href: "/oquv/kimyoviy-boglanish/vb-nazariyasi",
      icon: "🔗",
      title: "Valent bog'lanishlar nazariyasi",
      desc: "Gibridlanish turlari, donor-akseptor bog'lanish, sp, sp², sp³, dsp², d²sp³ gibridlanish. Kompleks birikmalarda VB nazariyasining qo'llanishi.",
      badge: "Asosiy",
      badgeColor: "bg-red-500/15 text-red-300 border-red-500/40",
      gradient: "from-red-500/20 via-rose-500/10 to-transparent",
      glow: "group-hover:shadow-red-500/30",
      borderHover: "hover:border-red-400/60",
      iconBg: "from-red-500/30 to-rose-600/20",
      accent: "bg-red-400",
      textHover: "group-hover:text-red-300",
      tags: ["sp³", "sp³d²", "Donor-akseptor"]
    },
    {
      href: "/oquv/kimyoviy-boglanish/kristall-maydon",
      icon: "💎",
      title: "Kristall maydon nazariyasi",
      desc: "d-orbital ajralishi, Δo va Δt energiyalari, spektrokimyoviy qator, KMBE hisoblash, yuqori va quyi spinli komplekslar.",
      badge: "Muhim",
      badgeColor: "bg-blue-500/15 text-blue-300 border-blue-500/40",
      gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
      glow: "group-hover:shadow-blue-500/30",
      borderHover: "hover:border-blue-400/60",
      iconBg: "from-blue-500/30 to-cyan-600/20",
      accent: "bg-blue-400",
      textHover: "group-hover:text-blue-300",
      tags: ["Δo / Δt", "KMBE", "Spin holati"]
    },
    {
      href: "/oquv/kimyoviy-boglanish/yan-teller",
      icon: "⚡",
      title: "Yan-Teller effekti",
      desc: "Oktaedrik buzilish mexanizmi, d⁴ va d⁹ konfiguratsiyalar, Cu²⁺ komplekslari misolida statik va dinamik Yan-Teller effekti.",
      badge: "Qiziqarli",
      badgeColor: "bg-purple-500/15 text-purple-300 border-purple-500/40",
      gradient: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
      glow: "group-hover:shadow-purple-500/30",
      borderHover: "hover:border-purple-400/60",
      iconBg: "from-purple-500/30 to-fuchsia-600/20",
      accent: "bg-purple-400",
      textHover: "group-hover:text-purple-300",
      tags: ["d⁴", "d⁹", "Cu²⁺"]
    },
    {
      href: "/oquv/kimyoviy-boglanish/ligand-maydon",
      icon: "🧩",
      title: "Ligand maydon nazariyasi",
      desc: "Molekulyar orbitallar nazariyasi, σ-donor va π-akseptor ligandlar, metall-ligand bog'lanishining MO tavsifi.",
      badge: "Chuqur",
      badgeColor: "bg-pink-500/15 text-pink-300 border-pink-500/40",
      gradient: "from-pink-500/20 via-rose-500/10 to-transparent",
      glow: "group-hover:shadow-pink-500/30",
      borderHover: "hover:border-pink-400/60",
      iconBg: "from-pink-500/30 to-rose-600/20",
      accent: "bg-pink-400",
      textHover: "group-hover:text-pink-300",
      tags: ["σ-donor", "π-akseptor", "MO"]
    },
    {
      href: "/ilmiy",
      icon: "🔬",
      title: "Ilmiy tadqiqotlar va chuqur ma'lumotlar",
      desc: "Spektroskopiya (IQ, UB-Vis, YaMR), magnit xossalari, termodinamika va barqarorlik, kinetika, kvant kimyosi asoslari.",
      badge: "Kengaytirilgan",
      badgeColor: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      glow: "group-hover:shadow-emerald-500/30",
      borderHover: "hover:border-emerald-400/60",
      iconBg: "from-emerald-500/30 to-teal-600/20",
      accent: "bg-emerald-400",
      textHover: "group-hover:text-emerald-300",
      tags: ["Spektroskopiya", "YaMR", "Kvant kimyo"]
    }
  ]

  const xususiyatlar = [
    { icon: "🔗", title: "VB nazariyasi", desc: "Gibridlanish, donor-akseptor bog', kompleks geometriyasi", color: "red" },
    { icon: "💎", title: "Kristall maydon", desc: "d-orbital ajralishi, Δo, KMBE, spin holatlari", color: "blue" },
    { icon: "⚡", title: "Yan-Teller effekti", desc: "Oktaedrik buzilish, d⁴/d⁹ konfiguratsiyalar", color: "purple" },
    { icon: "🧩", title: "Ligand maydon", desc: "MO yondashuvi, σ-donor/π-akseptor ligandlar", color: "pink" },
  ]

  return (
    <main className="relative min-h-screen bg-[#0a0618] text-white overflow-hidden">
      
      {/* ═══════════ ANIMATSION FON ═══════════ */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '4s'}} />
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* ═══════════ HEADER ═══════════ */}
      <header className="relative backdrop-blur-xl bg-white/[0.02] border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link 
            href="/oquv" 
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/40 transition-all"
          >
            <span className="text-purple-300 group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm font-medium text-purple-200">O'quv bo'limi</span>
          </Link>
          
          <div className="flex-1 flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/40 blur-xl rounded-full" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/50">
                🔗
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Kimyoviy bog'lanish
              </h1>
              <p className="text-purple-300/70 text-xs md:text-sm hidden sm:block">
                VB • Kristall maydon • Yan-Teller • Ligand maydon nazariyalari
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">Oliy kimyo</span>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wider text-purple-200 uppercase">
              Kompleks birikmalar nazariyasi
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Bog'lanish
            </span>{" "}
            <span className="text-white">nazariyalari</span>
          </h2>
          
          <p className="text-purple-200/80 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Kompleks birikmalarning tuzilishi, rang-barangligi va xossalarini tushunishning 
            <span className="text-yellow-300 font-semibold"> fundamental asoslari</span>
          </p>
        </div>

        {/* Statistika kartalari */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
          {[
            { num: "5", label: "Asosiy bo'lim", icon: "📚", color: "from-purple-500 to-pink-500" },
            { num: "20+", label: "Kichik mavzu", icon: "📖", color: "from-blue-500 to-cyan-500" },
            { num: "50+", label: "Formula", icon: "🧮", color: "from-emerald-500 to-teal-500" },
            { num: "100%", label: "Bepul", icon: "🎓", color: "from-yellow-500 to-orange-500" },
          ].map((s, i) => (
            <div 
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-4 hover:border-white/20 transition-all hover:-translate-y-1"
            >
              <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
              <div className="relative">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`text-2xl md:text-3xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>
                  {s.num}
                </div>
                <div className="text-xs text-purple-200/60 mt-1">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ NIMALARNI O'RGANASIZ BLOCK ═══════════ */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-purple-950/50 to-blue-950/40 backdrop-blur-xl border border-white/10 p-6 md:p-8">
          
          {/* Dekorativ SVG */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="0.5" />
              <circle cx="100" cy="40" r="4" fill="white" />
              <circle cx="160" cy="100" r="4" fill="white" />
              <circle cx="100" cy="160" r="4" fill="white" />
              <circle cx="40" cy="100" r="4" fill="white" />
              <circle cx="100" cy="100" r="6" fill="white" />
            </svg>
          </div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                📋
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Bu bo'limda nimalarni o'rganasiz?
              </h2>
            </div>

            <p className="text-purple-100/80 leading-relaxed mb-6 max-w-3xl">
              <strong className="text-yellow-300">Kimyoviy bog'lanish nazariyalari</strong> — kompleks birikmalarning 
              tuzilishi, rang-barangligi, magnit xossalari va reaksion qobiliyatini tushunish uchun{" "}
              <strong className="text-yellow-300">eng fundamental asos</strong>. 
              Valent bog'lanishlar nazariyasidan zamonaviy ligand maydon nazariyasigacha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {xususiyatlar.map((x, i) => {
                const colorMap = {
                  red: "from-red-500/20 to-rose-500/5 border-red-500/20 text-red-300",
                  blue: "from-blue-500/20 to-cyan-500/5 border-blue-500/20 text-blue-300",
                  purple: "from-purple-500/20 to-fuchsia-500/5 border-purple-500/20 text-purple-300",
                  pink: "from-pink-500/20 to-rose-500/5 border-pink-500/20 text-pink-300",
                }
                return (
                  <div 
                    key={i}
                    className={`group flex items-start gap-3 bg-gradient-to-br ${colorMap[x.color]} backdrop-blur-sm rounded-xl p-4 border hover:scale-[1.02] transition-all cursor-default`}
                  >
                    <div className="text-2xl group-hover:scale-110 transition-transform">{x.icon}</div>
                    <div>
                      <strong className="text-white text-sm block mb-1">{x.title}</strong>
                      <p className="text-purple-200/70 text-xs leading-relaxed">{x.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ ASOSIY KARTALAR ═══════════ */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Bo'limlar
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {bolimlar.map((b, i) => (
            <Link 
              key={i}
              href={b.href}
              className={`group relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 ${b.borderHover} p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${b.glow}`}
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

              {/* Corner decoration */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${b.accent} opacity-5 blur-3xl group-hover:opacity-20 transition-opacity`} />

              <div className="relative">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.iconBg} border border-white/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  {b.icon}
                </div>

                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] tracking-widest uppercase font-bold px-2.5 py-1 rounded-full border ${b.badgeColor}`}>
                    {b.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold text-white ${b.textHover} transition-colors mb-2 leading-snug`}>
                  {b.title}
                </h3>

                {/* Description */}
                <p className="text-purple-200/60 text-sm leading-relaxed mb-4">
                  {b.desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {b.tags.map((t, j) => (
                    <span 
                      key={j} 
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-purple-200/70 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Arrow */}
                <div className={`flex items-center gap-2 text-xs font-semibold ${b.textHover} text-white/60 transition-colors`}>
                  <span>Batafsil o'rganish</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ FOOTER MANBA ═══════════ */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-purple-500/20 p-6">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22%3E%3Cpath d=%22M30 30m-4 0a4 4 0 1 1 8 0a4 4 0 1 1-8 0%22 fill=%22white%22 opacity=%220.03%22/%3E%3C/svg%3E')]" />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 flex items-center justify-center text-2xl shrink-0">
              📚
            </div>
            <div className="flex-1">
              <div className="text-xs uppercase tracking-widest text-yellow-300/80 font-semibold mb-1">
                Asosiy manba
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                <strong className="text-white">A.M. Nasimov, X.Sh. Tashpulatov</strong> — 
                Noorganik kimyoning tanlangan boblari
                <span className="text-purple-300/60 ml-2 text-xs">(5.5–5.6 bo'limlar)</span>
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <span className="text-xs text-purple-200/70">kimyo.uz</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
