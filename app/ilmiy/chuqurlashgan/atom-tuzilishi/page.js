"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV ATOM MODELLARI TAQQOSLASH
// ============================================================================
function AtomModellariSlayder() {
  const [model, setModel] = useState("bor")
  
  const models = {
    tomson: {
      name: "Tomson modeli",
      year: "1904",
      icon: "🧁",
      title: "\"Olxo'ri pudingi\" modeli",
      desc: "Atom — musbat zaryadlangan sfera ichida manfiy elektronlar tarqalgan. Elektronlar soni atomning kimyoviy xossalarini belgilaydi.",
      achievements: ["Atomning elektroneytralligini tushuntirdi", "Elektronlarning mavjudligini e'tirof etdi"],
      limitations: ["Yadro yo'q — Rezerford tajribasini tushuntira olmaydi", "Spektral chiziqlarni tushuntirmaydi", "Kimyoviy bog'lanish mexanizmini bermaydi"],
      color: "text-yellow-400",
      bg: "bg-yellow-600/10 border-yellow-500/30"
    },
    rezerford: {
      name: "Rezerford modeli",
      year: "1911",
      icon: "☀️",
      title: "Sayyoraviy (planetar) model",
      desc: "Atom markazida kichik, og'ir, musbat zaryadlangan yadro. Elektronlar yadro atrofida sayyoralar kabi aylanadi. Kulon kuchi markazga intilma kuch bilan muvozanatlashgan.",
      achievements: ["Yadro tushunchasini kiritdi", "α-zarralarning sochilishini tushuntirdi", "Atom bo'shliq ekanligini ko'rsatdi"],
      limitations: ["Klassik elektrodinamika bo'yicha elektron nurlanishi va yadroga qulashi kerak", "Diskret spektrlarni tushuntirmaydi", "Atomning barqarorligini tushuntirmaydi"],
      color: "text-orange-400",
      bg: "bg-orange-600/10 border-orange-500/30"
    },
    bor: {
      name: "Bor modeli",
      year: "1913",
      icon: "🎯",
      title: "Kvantlangan orbitalar modeli",
      desc: "Elektronlar faqat ma'lum diskret orbitalarda (statsionar holatlarda) nurlanmasdan harakatlanadi. Energiya faqat orbitalar orasidagi sakrashlarda yutiladi yoki chiqariladi. Burchak momenti kvantlangan: mvr = nħ.",
      achievements: ["Vodorod spektrini aniq tushuntirdi (Balmer, Layman seriyalari)", "Kvant tushunchasini atomga qo'lladi", "Ridberg doimiysini nazariy hisoblab topdi"],
      limitations: ["Ko'p elektronli atomlarga qo'llanilmaydi", "Spektral chiziqlarning intensivligini tushuntirmaydi", "Zeeman effektini to'liq tushuntirmaydi", "Yarim klassik — kvant va klassik tushunchalar aralash"],
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    kvant: {
      name: "Kvant-mexanik model",
      year: "1926",
      icon: "☁️",
      title: "Shredinger modeli — elektron bulut",
      desc: "Elektronlar aniq orbitalarda emas, balki orbitallarda — ehtimollik bulutlari ko'rinishida tasvirlanadi. Shredinger tenglamasi: Ĥψ = Eψ. To'lqin funksiyasi ψ elektronning holatini to'liq tavsiflaydi.",
      achievements: ["Barcha atomlar uchun qo'llaniladi", "Kimyoviy bog'lanishni tushuntiradi", "Spektrlarning intensivligi va Zeeman effektini tushuntiradi", "Noaniqlik prinsipi bilan mos keladi"],
      limitations: ["Ko'p elektronli atomlar uchun aniq yechim yo'q (taqribiy metodlar kerak)", "Vizual tasavvur qilish qiyin"],
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const m = models[model]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📜 Atom modellari evolyutsiyasi — interaktiv vaqt chizig'i</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(models).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setModel(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              model === key 
                ? `${val.bg} ${val.color}` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.icon} {val.name} ({val.year})
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${m.bg}`}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{m.icon}</span>
          <div>
            <h4 className={`font-bold text-lg ${m.color}`}>{m.title}</h4>
            <p className="text-purple-400 text-xs">{m.year} — {m.name}</p>
          </div>
        </div>
        
        <p className="text-purple-200 text-sm mb-4">{m.desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 font-bold mb-1">✅ Yutuqlari:</p>
            <ul className="text-purple-200 space-y-1">
              {m.achievements.map((a, i) => <li key={i}>• {a}</li>)}
            </ul>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 font-bold mb-1">❌ Kamchiliklari:</p>
            <ul className="text-purple-200 space-y-1">
              {m.limitations.map((l, i) => <li key={i}>• {l}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// D-ORBITALLAR ENERGIYASI INTERAKTIV
// ============================================================================
function DOrbitalEnergiyaSlayder() {
  const [field, setField] = useState("oktaedrik")
  
  const fields = {
    erkin: {
      name: "Erkin ion",
      desc: "5 ta d-orbital degenerat (bir xil energiyada). Kristall maydon yo'q.",
      splitting: "Δ = 0",
      orbitals: [
        { name: "dxy, dxz, dyz, dz², dx²−y²", energy: "E₀", color: "bg-gray-400" }
      ],
      note: "Bu holat faqat gaz fazada yoki erkin ionda kuzatiladi. Ligandlar mavjud bo'lganda degeneratlik yo'qoladi.",
      color: "text-gray-400",
      bg: "bg-gray-600/10 border-gray-500/30"
    },
    oktaedrik: {
      name: "Oktaedrik maydon (O_h)",
      desc: "6 ta ligand oktaedr uchlarida. d_x²−y² va d_z² (e_g) — ligandlarga to'g'ri yo'nalgan → energiyasi yuqori. d_xy, d_xz, d_yz (t₂g) — ligandlar orasiga yo'nalgan → energiyasi past.",
      splitting: "Δ_oct = 10 Dq",
      orbitals: [
        { name: "d_x²−y², d_z²", energy: "e_g: +6 Dq", color: "bg-red-500" },
        { name: "d_xy, d_xz, d_yz", energy: "t₂g: −4 Dq", color: "bg-blue-500" }
      ],
      note: "Δ_oct — oktaedrik ajralish energiyasi. Kuchli maydon ligandlarda katta, kuchsiz maydonda kichik.",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    tetraedrik: {
      name: "Tetraedrik maydon (T_d)",
      desc: "4 ta ligand tetraedr uchlarida. d_xy, d_xz, d_yz (t₂) — ligandlarga yaqinroq → energiyasi yuqori. d_x²−y², d_z² (e) — ligandlardan uzoqroq → energiyasi past.",
      splitting: "Δ_tet ≈ 4/9 Δ_oct",
      orbitals: [
        { name: "d_xy, d_xz, d_yz", energy: "t₂: +4 Dq", color: "bg-red-500" },
        { name: "d_x²−y², d_z²", energy: "e: −6 Dq", color: "bg-blue-500" }
      ],
      note: "Tetraedrik ajralish oktaedrikka nisbatan teskari va kichikroq (Δ_tet ≈ 0.44 Δ_oct). Shuning uchun tetraedrik komplekslar ko'pincha yuqori spinli.",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    },
    kvadrat: {
      name: "Kvadrat tekislik (D_4h)",
      desc: "Oktaedrdan 2 ta aksial ligand olib tashlangan. d_x²−y² — eng yuqori energiyada (ekvatorial ligandlarga to'g'ri yo'nalgan). d_z² — energiyasi pasaygan.",
      splitting: "4 xil energiya darajasi",
      orbitals: [
        { name: "d_x²−y²", energy: "Eng yuqori", color: "bg-red-600" },
        { name: "d_xy", energy: "Yuqori", color: "bg-orange-500" },
        { name: "d_z²", energy: "O'rta", color: "bg-yellow-500" },
        { name: "d_xz, d_yz", energy: "Past", color: "bg-blue-500" }
      ],
      note: "d⁸ konfiguratsiyali metallar (Pt²⁺, Pd²⁺, Au³⁺) uchun xarakterli. Kuchli maydon ligandlari bilan.",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const f = fields[field]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ d-orbitallarning energetik ajralishi</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(fields).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setField(key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              field === key 
                ? `${val.bg} ${val.color}` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.name}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${f.bg}`}>
        <h4 className={`font-bold text-lg mb-2 ${f.color}`}>{f.name}</h4>
        <p className="text-purple-200 text-sm mb-4">{f.desc}</p>
        
        <div className="bg-purple-900/50 rounded-lg p-4 mb-4">
          <p className="text-yellow-400 font-bold text-xs mb-2">Ajralish energiyasi: {f.splitting}</p>
          <div className="space-y-2">
            {f.orbitals.map((orb, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${orb.color}`}></div>
                <span className="text-purple-200 text-xs">{orb.name}</span>
                <span className="text-purple-400 text-xs">— {orb.energy}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 {f.note}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// KVANT SONLAR INTERAKTIV
// ============================================================================
function KvantSonlarInteraktiv() {
  const [tab, setTab] = useState("n")
  
  const kvantSonlar = {
    n: {
      name: "Bosh kvant soni (n)",
      symbol: "n",
      values: "1, 2, 3, ... (butun sonlar)",
      meaning: "Orbitalning energiyasi va o'lchamini belgilaydi. n qancha katta bo'lsa, orbital shuncha katta va energiyasi yuqori.",
      example: "n=1 — eng kichik orbital (H atomi); n=3 — 3d orbitallar (o'tish metallari)",
      note: "Davriy jadvalda davr raqami = eng yuqori n qiymati",
      color: "text-red-400",
      bg: "bg-red-600/10 border-red-500/30"
    },
    l: {
      name: "Orbital kvant soni (l)",
      symbol: "l",
      values: "0, 1, 2, ..., (n−1)",
      meaning: "Orbitalning shaklini belgilaydi. l=0 (s), l=1 (p), l=2 (d), l=3 (f). Kompleks birikmalar uchun l=2 (d-orbitallar) muhim.",
      example: "n=3 da l=0,1,2 bo'lishi mumkin — 3s, 3p, 3d orbitallar",
      note: "d-orbitallar (l=2) — 5 ta: dxy, dxz, dyz, dz², dx²−y²",
      color: "text-blue-400",
      bg: "bg-blue-600/10 border-blue-500/30"
    },
    ml: {
      name: "Magnit kvant soni (mₗ)",
      symbol: "mₗ",
      values: "−l, ..., 0, ..., +l (jami 2l+1 ta qiymat)",
      meaning: "Orbitalning fazoviy yo'nalishini belgilaydi. l=2 (d) uchun mₗ = −2,−1,0,+1,+2 — 5 ta d-orbital.",
      example: "d_z² (mₗ=0), d_xz (mₗ=±1), d_yz (mₗ=±1), d_xy (mₗ=±2), d_x²−y² (mₗ=±2)",
      note: "Magnit maydonda har bir mₗ qiymati har xil energiyaga ega (Zeeman effekti)",
      color: "text-green-400",
      bg: "bg-green-600/10 border-green-500/30"
    },
    ms: {
      name: "Spin kvant soni (mₛ)",
      symbol: "mₛ",
      values: "+½ yoki −½",
      meaning: "Elektronning xususiy burchak momenti — spin. Har bir orbitalda maksimum 2 ta elektron (Pauli prinsipi).",
      example: "d⁵ konfiguratsiya (Fe³⁺): 5 ta elektron, har biri alohida orbitalda (Xund qoidasi), spinlari parallel",
      note: "Spin — komplekslarning magnit xossalarini belgilaydi (paramagnit/diamagnit)",
      color: "text-purple-400",
      bg: "bg-purple-600/10 border-purple-500/30"
    }
  }

  const k = kvantSonlar[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Kvant sonlar — interaktiv qo'llanma</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(kvantSonlar).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === key 
                ? `${val.bg} ${val.color}` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.symbol} — {val.name.split("(")[0].trim()}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${k.bg}`}>
        <h4 className={`font-bold text-lg mb-3 ${k.color}`}>{k.name}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Qiymatlari:</p>
              <p className="text-purple-200 font-mono">{k.values}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Fizik ma'nosi:</p>
              <p className="text-purple-200">{k.meaning}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Misol:</p>
              <p className="text-purple-200">{k.example}</p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">💡 KB uchun ahamiyati:</p>
              <p className="text-purple-200">{k.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function AtomTuzilishi() {
  const bolimlar = [
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/modellar",
      icon: "🧪",
      title: "Atom tuzilishi modellari",
      desc: "Tomson, Rezerford, Bor modellari. Kvant-mexanik modelga o'tish. Har bir modelning yutug'i va kamchiliklari.",
      badge: "Tarixiy",
      badgeColor: "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
      rang: "hover:border-yellow-400/50",
      rangText: "group-hover:text-yellow-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar",
      icon: "📐",
      title: "Kvant sonlar",
      desc: "Bosh (n), orbital (l), magnit (mₗ), spin (mₛ) kvant sonlari. Har birining fizik ma'nosi va qabul qiladigan qiymatlari.",
      badge: "Asosiy",
      badgeColor: "bg-green-600/20 text-green-400 border-green-600/30",
      rang: "hover:border-green-400/50",
      rangText: "group-hover:text-green-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli",
      icon: "🎯",
      title: "d-orbitallarning shakli",
      desc: "5 ta d-orbital (dxy, dxz, dyz, dz², dx²−y²) — shakli, fazoviy yo'nalishi va 3D modeli.",
      badge: "3D model",
      badgeColor: "bg-purple-600/20 text-purple-400 border-purple-600/30",
      rang: "hover:border-purple-400/50",
      rangText: "group-hover:text-purple-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya",
      icon: "⚡",
      title: "d-orbitallarning energiyasi",
      desc: "Erkin ionda degenerat holat. Oktaedrik, tetraedrik va tekis kvadrat maydonlarda energetik ajralish.",
      badge: "Muhim",
      badgeColor: "bg-orange-600/20 text-orange-400 border-orange-600/30",
      rang: "hover:border-orange-400/50",
      rangText: "group-hover:text-orange-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig",
      icon: "🔄",
      title: "d-elektron konfiguratsiyalar",
      desc: "d¹ dan d¹⁰ gacha. Xund qoidasi. Yuqori spin va quyi spinli holatlar. Pauli prinsipi.",
      badge: "Konfiguratsiya",
      badgeColor: "bg-blue-600/20 text-blue-400 border-blue-600/30",
      rang: "hover:border-blue-400/50",
      rangText: "group-hover:text-blue-400"
    },
    {
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/metallar",
      icon: "🧲",
      title: "Kompleks hosil qiluvchi metallar",
      desc: "3d, 4d, 5d elementlari. Qaysilari kompleks hosil qiladi? Ion radiusi, zaryad va elektron konfiguratsiya ta'siri.",
      badge: "Davriy jadval",
      badgeColor: "bg-red-600/20 text-red-400 border-red-600/30",
      rang: "hover:border-red-400/50",
      rangText: "group-hover:text-red-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">Atom tuzilishi</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔬 Atom tuzilishi va d-orbitallar</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarning elektron asoslari • 6 ta bo'lim</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        
        {/* KIRISH */}
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Atom tuzilishi va d-orbitallar — kompleks birikmalar kimyosining <strong className="text-yellow-400">fundamental asosi</strong>. 
            d-orbitallarning shakli, energiyasi va elektron konfiguratsiyalari komplekslarning 
            <strong> geometriyasi, magnit xossalari, rangi va reaksion qobiliyatini</strong> belgilaydi.
            Bu bo'limda atom modellaridan boshlab, kvant sonlari, d-orbital shakllari va 
            energetik ajralishgacha bo'lgan barcha fundamental tushunchalarni o'rganasiz.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">6 ta bo'lim</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">3D model</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Tarixiy rivojlanish</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Interaktiv</span>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AtomModellariSlayder />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DOrbitalEnergiyaSlayder />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KvantSonlarInteraktiv />
        </div>

        {/* BO'LIMLAR KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Batafsil bo'limlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {bolimlar.map((b, i) => (
              <Link 
                key={i}
                href={b.href}
                className={`group bg-purple-800/30 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/60 ${b.rang} transition-all transform hover:-translate-y-2 hover:shadow-xl`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-base font-bold text-white ${b.rangText} transition-colors`}>{b.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${b.badgeColor} font-semibold`}>{b.badge}</span>
                </div>
                <p className="text-purple-300 text-sm leading-relaxed">{b.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Manba: Molekulalar tuzilishi va kimyoviy bog'lanish — II bob. Atom tuzilishi
          </p>
        </div>

      </section>
    </main>
  )
}