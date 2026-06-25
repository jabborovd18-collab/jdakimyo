"use client"
import Link from "next/link"
import { useState } from "react"

//  ═══════════════════════════════════════════════════════════════════════════════
// ION TASHISH — BIOANORGANIK KIMYO NAVIGATSIYA SAHIFASI
// Manbalar: Skou (1957, Nobel 1997), Toyoshima (2000), Maccallum (1998),
//           Baker (2003), Aisen (1998), Hentze (2010)
// 3 ta asosiy mavzu: Ca²⁺ nasos, Na⁺/K⁺ kanal, Transferrin
//  ═══════════════════════════════════════════════════════════════════════════════

const TOPICS = [
  {
    id: "ca-nasos",
    slug: "ca-nasos",
    icon: "🔬",
    title: "Ca²⁺ Nasos (Ca-ATPase)",
    subtitle: "SERCA — Sarkoplazmatik retikulum Ca²⁺-ATPase",
    shortDesc: "ATP energiyasidan foydalanib, Ca²⁺ ionlarini sitoplazmadan SR lumeniga chiqaradi. Muskul bo'shashishi uchun juda muhim.",
    type: "P-type ATPase",
    ion: "Ca²⁺",
    stoichiometry: "1 ATP : 2 Ca²⁺",
    location: "Sarkoplazmatik retikulum",
    function: "Muskul bo'shashishi, Ca²⁺ signalizatsiyasi",
    color: "blue",
    gradient: "from-blue-600/20 to-blue-900/40",
    borderColor: "border-blue-500/30",
    features: [
      "110 kDa molekulyar massa",
      "994 aminokislota",
      "10 ta transmembran spiral",
      "2 ta Ca²⁺ bog'lanish sayti",
      "Post-Albers sikli (E1 ↔ E2)",
      "Nobel 1997 (Skou)"
    ],
    keyData: {
      molecularWeight: "110 kDa",
      turnover: "~30 Ca²⁺/s",
      km_Ca: "0.1-1 μM",
      efficiency: "60-80%"
    },
    medicalRelevance: "Yurak etishmovchiligi, Brody myopatiyasi",
    path: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/ca-nasos"
  },
  {
    id: "na-k-kanal",
    slug: "na-k-kanal",
    icon: "⚡",
    title: "Na⁺/K⁺-ATPase (Na-K nasos)",
    subtitle: "Natriy-kaliy nasosi — hujayra membranasining asosi",
    shortDesc: "ATP energiyasidan foydalanib, 3 ta Na⁺ ni hujayra tashqarisiga, 2 ta K⁺ ni ichkariga chiqaradi. Membrana potensiali uchun javobgar.",
    type: "P-type ATPase",
    ion: "Na⁺, K⁺",
    stoichiometry: "1 ATP : 3 Na⁺ : 2 K⁺",
    location: "Plazma membranasi (barcha hujayralar)",
    function: "Membrana potensiali, osmotik balans",
    color: "yellow",
    gradient: "from-yellow-600/20 to-yellow-900/40",
    borderColor: "border-yellow-500/30",
    features: [
      "αβγ subunits (α = 110 kDa)",
      "Elektrogen transport (+1 net zaryad)",
      "Ouabain ingibitori",
      "Hujayra energiyasining 25-50%",
      "Neyron, muskul faoliyati",
      "Nobel 1997 (Skou)"
    ],
    keyData: {
      molecularWeight: "~170 kDa (α+β)",
      turnover: "~100 ion/s",
      km_Na: "10-20 mM",
      membranePotential: "-70 mV"
    },
    medicalRelevance: "Digoksin (yurak glikozidi), neyron faoliyati, gipertoniya",
    path: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/na-k-kanal"
  },
  {
    id: "transferrin",
    slug: "transferrin",
    icon: "🩸",
    title: "Transferrin (Temir tashuvchi)",
    subtitle: "Fe³⁺ transporti qondagi asosiy oqsil",
    shortDesc: "Qon plazmasida Fe³⁺ ni tashiydi. Har bir transferrin 2 ta Fe³⁺ ni bog'laydi. Retseptor orqali hujayra ichiga endositoz.",
    type: "Transport oqsili",
    ion: "Fe³⁺",
    stoichiometry: "1 Transferrin : 2 Fe³⁺",
    location: "Qon plazmasi, ekstratsellyular suyuqlik",
    function: "Temir transporti, antibakterial himoya",
    color: "red",
    gradient: "from-red-600/20 to-red-900/40",
    borderColor: "border-red-500/30",
    features: [
      "80 kDa molekulyar massa",
      "679 aminokislota",
      "2 ta Fe³⁺ bog'lanish domeni (N, C)",
      "CO₃²⁻ sinergistik ion",
      "pH-ga bog'liq bog'lanish (pH 7.4 → bog'laydi, pH 5.5 → chiqaradi)",
      "Transferrin retseptori (TfR1, TfR2)"
    ],
    keyData: {
      molecularWeight: "80 kDa",
      ironCapacity: "2 Fe³⁺",
      bloodConcentration: "2-3 g/L",
      saturation: "25-35% (normal)"
    },
    medicalRelevance: "Anemiya, gemoxromatoz, saraton (TfR yuqori)",
    path: "/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/transferrin"
  }
]

const GENERAL_CONCEPTS = [
  {
    icon: "🔋",
    title: "Ion gradientlari",
    desc: "Hujayra ichida va tashqarisida ion konsentratsiyalarining farqi. ATP energiyasi bilan yaratiladi va saqlanadi.",
    examples: "Na⁺ (tashqi: 145 mM, ichki: 12 mM), K⁺ (tashqi: 4 mM, ichki: 150 mM), Ca²⁺ (tashqi: 2 mM, ichki: 100 nM)"
  },
  {
    icon: "🌊",
    title: "Membrana transporti turlari",
    desc: "Passiv (kanallar), aktiv (nasoslar), ikkilamchi aktiv (kotransporterlar), endositoz.",
    examples: "K⁺ kanallari (passiv), Na⁺/K⁺-ATPase (aktiv), NCX (ikkilamchi), transferrin (endositoz)"
  },
  {
    icon: "⚡",
    title: "Energiya manbalari",
    desc: "ATP gidrolizi (P-type nasoslar), ion gradienti (kotransporterlar), yorug'lik (bakteriorodopsin).",
    examples: "ATP → ADP + Pi, ΔG ≈ -50 kJ/mol"
  },
  {
    icon: "🧬",
    title: "Metall ionlarining biologik roli",
    desc: "Na⁺, K⁺ (membrana potensiali), Ca²⁺ (signalizatsiya), Fe²⁺/Fe³⁺ (kislorod transporti, fermentlar).",
    examples: "Ca²⁺ — universal signal; Fe — gemoglobin, sitoxromlar"
  }
]

const APPLICATIONS = [
  { field: "Tibbiyot", icon: "💊", examples: "Yurak dorilari (digoksin), anemiya diagnostikasi, saraton terapiyasi" },
  { field: "Neyrobiologiya", icon: "🧠", examples: "Neyron signallari, sinaptik uzatish, epilepsiya" },
  { field: "Farmakologiya", icon: "💉", examples: "Nasos ingibitorlari, dori tashish mexanizmlari" },
  { field: "Biotexnologiya", icon: "🧪", examples: "Dori yetkazish tizimlari, sun'iy membranalar" }
]

export default function IonTashishPage() {
  const [activeTopic, setActiveTopic] = useState("ca-nasos")
  const [showAll, setShowAll] = useState(false)

  const selectedTopic = TOPICS.find(t => t.id === activeTopic)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950 to-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="hover:text-purple-300">Bioanorganik</Link>
            <span className="text-purple-600">›</span>
            <span className="text-yellow-400 font-semibold">Ion tashish</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 flex items-center gap-2">
                <span className="text-3xl">🔋</span>
                Ion tashish mexanizmlari
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Bioanorganik kimyo — Hujayra transporti va metall ionlari
              </p>
            </div>
            <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="text-xs bg-yellow-600/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
              ← Bioanorganik bo'limi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* HERO */}
        <div className="bg-gradient-to-br from-purple-900/60 to-blue-900/60 border border-purple-700/50 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -ml-20 -mb-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-xs font-semibold text-yellow-400 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              BIOANORGANIK KIMYO — 3 TA ASOSIY MAVZU
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Ion tashish
              </span>
              <br />
              <span className="text-white text-2xl md:text-3xl">Mexanizmlari va oqsillari</span>
            </h2>

            <p className="text-lg md:text-xl text-purple-200 max-w-3xl mb-8 leading-relaxed">
              Hujayralar <strong className="text-yellow-400">ion gradientlari</strong> orqali energiyani saqlaydi va signal uzatadi.
              Bu sahifada 3 ta asosiy ion tashish tizimini o'rganasiz:
              <strong className="text-blue-400"> Ca²⁺ nasos</strong>,
              <strong className="text-orange-400"> Na⁺/K⁺-ATPase</strong> va
              <strong className="text-red-400"> Transferrin</strong>.
            </p>

            {/* TEZ STATISTIKA */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl">
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔬</div>
                <div className="text-2xl font-extrabold text-yellow-400">3</div>
                <div className="text-xs text-purple-400 mt-1">Asosiy mavzu</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-2xl font-extrabold text-yellow-400">4</div>
                <div className="text-xs text-purple-400 mt-1">Ion turi</div>
              </div>
              <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-2xl font-extrabold text-yellow-400">2</div>
                <div className="text-xs text-purple-400 mt-1">Nobel mukofoti</div>
              </div>
            </div>
          </div>
        </div>

        {/* ASOSIY MAVZULAR */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Asosiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">mavzular</span>
              </h2>
              <p className="text-purple-300 text-sm mt-1">Har birini batafsil o'rganish uchun tanlang</p>
            </div>
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-4 py-2 bg-purple-800/40 hover:bg-purple-700/60 border border-purple-600/50 rounded-xl text-sm font-semibold transition-all"
            >
              {showAll ? "📖 Qisqacha ko'rish" : "📚 Hammasini ko'rish"}
            </button>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeTopic === topic.id
                    ? "bg-yellow-600/60 text-white border border-yellow-400/50 shadow-lg shadow-yellow-500/20"
                    : "bg-purple-800/30 text-purple-400 border border-purple-700/50 hover:bg-purple-700/40"
                }`}
              >
                <span>{topic.icon}</span>
                <span>{topic.title.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* TANLANGAN MAVZU PREVIEW */}
          {selectedTopic && (
            <div className={`bg-gradient-to-br ${selectedTopic.gradient} border ${selectedTopic.borderColor} rounded-3xl p-8 relative overflow-hidden`}>
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full blur-3xl opacity-20 bg-white" />
              <div className="relative z-10">
                <div className="flex items-start gap-6 mb-6 flex-col md:flex-row">
                  <div className="text-7xl">{selectedTopic.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-2xl md:text-3xl font-bold text-yellow-400">{selectedTopic.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedTopic.color === "blue" ? "bg-blue-600/30 text-blue-400 border border-blue-600/50" :
                        selectedTopic.color === "yellow" ? "bg-yellow-600/30 text-yellow-400 border border-yellow-600/50" :
                        "bg-red-600/30 text-red-400 border border-red-600/50"
                      }`}>
                        {selectedTopic.type}
                      </span>
                    </div>
                    <p className="text-purple-200 italic mb-3">{selectedTopic.subtitle}</p>
                    <p className="text-purple-300 leading-relaxed">{selectedTopic.shortDesc}</p>
                  </div>
                </div>

                {/* ASOSIY MA'LUMOTLAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-5">
                    <h4 className="text-lg font-bold text-yellow-400 mb-3">🎯 Asosiy xususiyatlar</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-400">Ion:</span>
                        <span className="text-white font-mono">{selectedTopic.ion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">Stexiometriya:</span>
                        <span className="text-white font-mono text-xs">{selectedTopic.stoichiometry}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">Joylashuv:</span>
                        <span className="text-white text-xs mt-1">{selectedTopic.location}</span>
                      </div>
                      <div className="flex justify-between flex-col">
                        <span className="text-purple-400">Funksiya:</span>
                        <span className="text-white text-xs mt-1">{selectedTopic.function}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-5">
                    <h4 className="text-lg font-bold text-yellow-400 mb-3">📊 Kalit parametrlar</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedTopic.keyData).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-purple-400">
                            {key === "molecularWeight" && "Molekulyar massa"}
                            {key === "turnover" && "Aylanish tezligi"}
                            {key === "km_Ca" && "K_m (Ca²⁺)"}
                            {key === "km_Na" && "K_m (Na⁺)"}
                            {key === "efficiency" && "Samaradorlik"}
                            {key === "membranePotential" && "Membrana potensiali"}
                            {key === "ironCapacity" && "Temir sig'imi"}
                            {key === "bloodConcentration" && "Qon konsentratsiyasi"}
                            {key === "saturation" && "Saturatsiya"}
                          </span>
                          <span className="text-white font-mono text-xs">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* XUSUSIYATLAR RO'YXATI */}
                <div className="bg-purple-950/50 border border-purple-700/30 rounded-xl p-5 mb-6">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">✨ Asosiy xususiyatlar</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTopic.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-400 flex-shrink-0">•</span>
                        <span className="text-purple-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TIBBIY QO'LLANILISHI */}
                <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💊</span>
                    <div>
                      <div className="text-red-400 font-bold text-sm mb-1">Tibbiy ahamiyati:</div>
                      <p className="text-purple-200 text-sm">{selectedTopic.medicalRelevance}</p>
                    </div>
                  </div>
                </div>

                {/* BATAFSIL TUGMASI */}
                <Link
                  href={selectedTopic.path}
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 rounded-2xl text-black font-bold text-lg shadow-2xl shadow-orange-500/30 transition-all transform hover:-translate-y-1"
                >
                  <span>{selectedTopic.icon}</span>
                  <span>Batafsil o'qish</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3 TA MAVZU — BARCHASINI KO'RISH */}
        {showAll && (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Barcha <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">3 ta mavzu</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.path}
                  className={`group bg-gradient-to-br ${topic.gradient} border ${topic.borderColor} rounded-2xl p-6 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 relative overflow-hidden`}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 bg-white" />
                  <div className="relative z-10">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{topic.icon}</div>
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{topic.title}</h3>
                    <p className="text-purple-300 text-sm mb-4 leading-relaxed">{topic.shortDesc}</p>
                    <div className="space-y-1 text-xs text-purple-400">
                      <div className="flex justify-between">
                        <span>Ion:</span>
                        <span className="text-white font-mono">{topic.ion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Turi:</span>
                        <span className="text-white">{topic.type}</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-700/50 flex items-center justify-between">
                      <span className="text-xs text-purple-400">Batafsil →</span>
                      <span className="text-yellow-400 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* UMUMIY TUSHUNCHALAR */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Umumiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">tushunchalar</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GENERAL_CONCEPTS.map((concept, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{concept.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-yellow-400 mb-2">{concept.title}</h3>
                    <p className="text-purple-200 text-sm mb-3 leading-relaxed">{concept.desc}</p>
                    <div className="bg-purple-950/50 border border-purple-700/30 rounded-lg p-3">
                      <div className="text-xs text-purple-400 mb-1">Misollar:</div>
                      <p className="text-xs text-purple-300 font-mono">{concept.examples}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TARIXIY KONTEKST */}
        <div className="bg-amber-600/10 border border-amber-500/30 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">📜</span>
            Tarixiy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">kashfiyotlar</span>
          </h2>
          <div className="space-y-4">
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Jens Christian Skou (1997)</h3>
                    <span className="px-2 py-1 bg-yellow-600/30 text-yellow-400 border border-yellow-600/50 rounded-full text-xs">Nobel mukofoti</span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1957:</strong> Na⁺/K⁺-ATPase ni birinchi marta kashf qildi.
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> Ion tashish nasoslari mavjudligini isbotladi. Paul Boyer va John Walker bilan birga Nobel oldi (ATP sintez mexanizmi).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🔬</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Chikashi Toyoshima (2000)</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>2000:</strong> SERCA1a Ca²⁺-ATPase kristall strukturasini aniqladi (PDB: 1SU4).
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>Ahamiyati:</strong> P-type nasoslari mexanizmini atom darajasida tushunish. Nature jurnalida nashr etildi.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-900/40 border border-purple-700/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🩸</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-amber-400">Transferrin tadqiqotlari</h3>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">
                    <strong>1940-yillar:</strong> Transferrin birinchi marta ajratib olindi (Schade & Levine).
                  </p>
                  <p className="text-purple-200 text-sm">
                    <strong>2000-yillar:</strong> Transferrin retseptori strukturasi aniqlandi. Saraton terapiyasida qo'llanilishi boshlandi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QO'LLANILISH SOHALARI */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Qo'llanilish <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">sohalari</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {APPLICATIONS.map((app, i) => (
              <div key={i} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 hover:border-yellow-400/50 transition-all">
                <div className="text-4xl mb-3">{app.icon}</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-2">{app.field}</h3>
                <p className="text-purple-300 text-sm leading-relaxed">{app.examples}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TAQQOSLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <span className="text-4xl">🔄</span>
            3 ta tizimning <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">taqqoslash jadvali</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-950/50">
                  <th className="py-3 px-3 text-yellow-400">Xususiyat</th>
                  <th className="py-3 px-3 text-blue-400">Ca²⁺ nasos</th>
                  <th className="py-3 px-3 text-orange-400">Na⁺/K⁺ kanal</th>
                  <th className="py-3 px-3 text-red-400">Transferrin</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Turi</td>
                  <td className="py-3 px-3">P-type ATPase</td>
                  <td className="py-3 px-3">P-type ATPase</td>
                  <td className="py-3 px-3">Transport oqsili</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Ion</td>
                  <td className="py-3 px-3 font-mono text-blue-400">Ca²⁺</td>
                  <td className="py-3 px-3 font-mono text-orange-400">Na⁺, K⁺</td>
                  <td className="py-3 px-3 font-mono text-red-400">Fe³⁺</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Stexiometriya</td>
                  <td className="py-3 px-3 font-mono text-xs">1 ATP : 2 Ca²⁺</td>
                  <td className="py-3 px-3 font-mono text-xs">1 ATP : 3 Na⁺ : 2 K⁺</td>
                  <td className="py-3 px-3 font-mono text-xs">1 Tf : 2 Fe³⁺</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Joylashuv</td>
                  <td className="py-3 px-3 text-xs">Sarkoplazmatik retikulum</td>
                  <td className="py-3 px-3 text-xs">Plazma membranasi</td>
                  <td className="py-3 px-3 text-xs">Qon plazmasi</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Molekulyar massa</td>
                  <td className="py-3 px-3 font-mono text-xs">110 kDa</td>
                  <td className="py-3 px-3 font-mono text-xs">~170 kDa</td>
                  <td className="py-3 px-3 font-mono text-xs">80 kDa</td>
                </tr>
                <tr className="border-b border-purple-800/30 bg-purple-950/20">
                  <td className="py-3 px-3 text-purple-400 font-semibold">Energiya manbai</td>
                  <td className="py-3 px-3 text-xs">ATP gidrolizi</td>
                  <td className="py-3 px-3 text-xs">ATP gidrolizi</td>
                  <td className="py-3 px-3 text-xs">pH gradienti</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-purple-400 font-semibold">Asosiy funksiya</td>
                  <td className="py-3 px-3 text-xs">Muskul bo'shashishi</td>
                  <td className="py-3 px-3 text-xs">Membrana potensiali</td>
                  <td className="py-3 px-3 text-xs">Temir transporti</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA — O'QISHNI BOSHLASH */}
        <div className="bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-red-600/20 border border-yellow-500/30 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[200px] opacity-5">🔬</div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Qaysi mavzudan <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">boshlaysiz</span>?
            </h2>
            <p className="text-purple-200 mb-8 max-w-2xl mx-auto">
              Har bir mavzu batafsil ilmiy tahlil, interaktiv diagrammalar va amaliy misollar bilan taqdim etilgan.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {TOPICS.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.path}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-1 flex items-center gap-2 ${
                    topic.color === "blue" ? "bg-blue-600/80 hover:bg-blue-500 text-white" :
                    topic.color === "yellow" ? "bg-yellow-500 hover:bg-yellow-400 text-black" :
                    "bg-red-600/80 hover:bg-red-500 text-white"
                  }`}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.title.split(" ")[0]}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center">
            ← Bioanorganik bo'limi
          </Link>
          <div className="flex gap-3 flex-wrap justify-center">
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloenzimlar" className="px-6 py-3 bg-purple-600/60 hover:bg-purple-500/80 border border-purple-500/50 rounded-xl text-white font-semibold">
              🧬 Metalloenzimlar
            </Link>
            <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-black font-bold">
              Chuqurlashgan mavzular →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-purple-800/30 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 JDA KIMYO — Bioanorganik kimyo</p>
          <p className="mt-1">Ion tashish mexanizmlari • Ca²⁺ nasos • Na⁺/K⁺-ATPase • Transferrin</p>
        </div>
      </footer>
    </main>
  )
}