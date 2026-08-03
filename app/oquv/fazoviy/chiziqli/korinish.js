"use client"

import Link from "next/link"
import { useState } from "react"

// ═══════════════════════════════════════════════════════════
// MISOL BIRIKMALAR
// ═══════════════════════════════════════════════════════════
const misollar = [
  {
    formula: "[Ag(NH₃)₂]⁺",
    nomi: "Diamminkumush(I) ioni",
    ion: "Ag⁺",
    config: "4d¹⁰",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Tollens reaktivi",
    href: "/ilmiy/birikmalar/ag-nh3-2",
    muhim: true
  },
  {
    formula: "[Ag(CN)₂]⁻",
    nomi: "Disianoargentat(I) ioni",
    ion: "Ag⁺",
    config: "4d¹⁰",
    ligand: "2 × CN⁻",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Galvanotexnika",
    href: "/ilmiy/birikmalar/ag-cn-2",
    muhim: false
  },
  {
    formula: "[Cu(NH₃)₂]⁺",
    nomi: "Diamminmis(I) ioni",
    ion: "Cu⁺",
    config: "3d¹⁰",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Mis qoplash",
    href: "/ilmiy/birikmalar/cu-nh3-2",
    muhim: false
  },
  {
    formula: "[Au(CN)₂]⁻",
    nomi: "Disianoaurat(I) ioni",
    ion: "Au⁺",
    config: "5d¹⁰",
    ligand: "2 × CN⁻",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Oltin qazib olish",
    href: "/ilmiy/birikmalar/au-cn-2",
    muhim: true
  },
  {
    formula: "[Hg(NH₃)₂]²⁺",
    nomi: "Diamminmerkuriy(II) ioni",
    ion: "Hg²⁺",
    config: "5d¹⁰",
    ligand: "2 × NH₃",
    rang: "Rangsiz",
    magnit: "Diamagnit",
    qollanilish: "Tibbiyot",
    href: "/ilmiy/birikmalar/hg-nh3-2",
    muhim: false
  }
]

export default function Chiziqli() {
  const [selectedMisol, setSelectedMisol] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ═════ HEADER ═════ */}
      <header className="border-b border-purple-800/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-3 text-purple-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv/fazoviy" className="hover:text-purple-300">Fazoviy</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Chiziqli</span>
          </nav>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-3">
                <span className="text-3xl">📏</span>
                Chiziqli geometriya
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                KS = 2 • sp gibridlanish • 180° • D∞h simmetriya
              </p>
            </div>
            <Link 
              href="/oquv/fazoviy"
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 bg-purple-900/40 px-4 py-2 rounded-lg border border-purple-700/50"
            >
              ← Orqaga
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* ═════ STATISTIKA ═════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-4">
            <div className="text-xs text-blue-400 mb-1">Koordinatsion son</div>
            <div className="text-2xl font-bold text-white">2</div>
          </div>
          <div className="bg-cyan-900/30 border border-cyan-700/50 rounded-xl p-4">
            <div className="text-xs text-cyan-400 mb-1">Valent burchak</div>
            <div className="text-2xl font-bold text-white">180°</div>
          </div>
          <div className="bg-purple-900/30 border border-purple-700/50 rounded-xl p-4">
            <div className="text-xs text-purple-400 mb-1">Misol birikmalar</div>
            <div className="text-2xl font-bold text-white">{misollar.length}</div>
          </div>
          <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4">
            <div className="text-xs text-amber-400 mb-1">Metall ionlar</div>
            <div className="text-2xl font-bold text-white">4</div>
          </div>
        </div>

        {/* ═════ 3D MODEL ═════ */}
        <div className="text-center">
          <Link 
            href="/oquv/fazoviy/chiziqli/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-5 rounded-2xl text-lg font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30"
            aria-label="3D modelni ko'rish - Ag(NH₃)₂⁺"
          >
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-blue-200">[Ag(NH₃)₂]⁺ — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* ═════ ASOSIY MA'LUMOT ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> Asosiy ma'lumotlar
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Koordinatsion son:</span>
                  <span className="font-bold text-white">2</span>
                </li>
                <li className="flex justify-between">
                  <span>Gibridlanish:</span>
                  <span className="font-bold text-white font-mono">sp</span>
                </li>
                <li className="flex justify-between">
                  <span>Valent burchak:</span>
                  <span className="font-bold text-white">180°</span>
                </li>
                <li className="flex justify-between">
                  <span>Simmetriya:</span>
                  <span className="font-bold text-white font-mono">D∞h</span>
                </li>
                <li className="flex justify-between">
                  <span>Shakl:</span>
                  <span className="font-bold text-white">To'g'ri chiziq</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              
              {/* SVG — Gibridlanish diagrammasi */}
              <svg viewBox="0 0 400 200" className="w-full h-48 bg-purple-950/50 rounded-lg p-2">
                {/* s orbital */}
                <circle cx="60" cy="100" r="30" fill="#60a5fa" opacity="0.3" stroke="#60a5fa" strokeWidth="2"/>
                <text x="60" y="105" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">s</text>
                
                {/* p orbital */}
                <ellipse cx="140" cy="100" rx="15" ry="40" fill="#f59e0b" opacity="0.3" stroke="#f59e0b" strokeWidth="2"/>
                <text x="140" y="105" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">p<sub>z</sub></text>
                
                {/* Arrow */}
                <text x="100" y="105" fill="white" fontSize="24" textAnchor="middle">+</text>
                
                {/* Arrow */}
                <path d="M 180 100 L 220 100 M 215 95 L 220 100 L 215 105" fill="none" stroke="white" strokeWidth="2"/>
                
                {/* 2 ta sp orbital */}
                <ellipse cx="280" cy="70" rx="15" ry="35" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="2"/>
                <text x="280" y="75" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">sp</text>
                
                <ellipse cx="280" cy="130" rx="15" ry="35" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="2"/>
                <text x="280" y="135" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">sp</text>
                
                {/* Burchak */}
                <path d="M 280 105 L 280 70 M 280 105 L 280 130" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3,3"/>
                <text x="310" y="105" fill="#fbbf24" fontSize="12" textAnchor="middle">180°</text>
                
                {/* Label */}
                <text x="200" y="30" fill="#c4b5fd" fontSize="12" textAnchor="middle">s + p → 2 ta sp gibrid orbital</text>
              </svg>
              
              <p className="text-purple-300 text-xs mt-3">
                Gibrid orbitallar bir-biriga nisbatan <strong className="text-yellow-400">180°</strong> burchak ostida joylashgan.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ NIMA UCHUN d¹⁰? ═════ */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
            <span>💡</span> Nima uchun aynan d¹⁰ konfiguratsiya?
          </h2>
          
          <div className="space-y-4 text-sm text-amber-100/90">
            <p>
              <strong className="text-amber-300">VSEPR nazariyasi</strong> bo'yicha, ligandlar orasidagi itarilish kuchlari
              minimallashishi kerak. KS=2 bo'lganda, bu <strong className="text-amber-300">180° burchak</strong> orqali erishiladi.
            </p>
            
            <p>
              <strong className="text-amber-300">d¹⁰ konfiguratsiyada</strong> barcha d-orbitallar to'lgan bo'lib,
              kristall maydon stabillashuv energiyasi (CFSE) nolga teng. Shuning uchun ligand itarilishi
              asosiy omil bo'ladi → <strong className="text-amber-300">chiziqli geometriya</strong>.
            </p>
            
            <p>
              <strong className="text-amber-300">d⁸ konfiguratsiyada</strong> (masalan, Ni²⁺) esa CFSE muhim bo'lib,
              <strong className="text-amber-300"> tekis kvadrat</strong> geometriya afzal (masalan, [Ni(CN)₄]²⁻).
            </p>
          </div>
        </div>

        {/* ═════ KRISTALL MAYDON ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📊</span> Kristall maydon nazariyasida
          </h2>
          
          <p className="text-purple-200 mb-6 text-sm">
            Chiziqli komplekslarda ligandlar <strong className="text-yellow-400">z-o'qi bo'ylab</strong> joylashgan.
            Shuning uchun z-komponentli d-orbitallar kuchli destabillashadi.
          </p>
          
          {/* SVG — Kristall maydon diagrammasi */}
          <div className="bg-purple-950/50 rounded-xl p-6">
            <svg viewBox="0 0 500 300" className="w-full h-72">
              {/* Energiya o'qi */}
              <line x1="50" y1="50" x2="50" y2="280" stroke="#c4b5fd" strokeWidth="2"/>
              <text x="30" y="165" fill="#c4b5fd" fontSize="12" textAnchor="middle" transform="rotate(-90, 30, 165)">
                Energiya
              </text>
              
              {/* d_z² (eng yuqori) */}
              <line x1="100" y1="80" x2="400" y2="80" stroke="#ef4444" strokeWidth="3"/>
              <text x="420" y="85" fill="#ef4444" fontSize="14" fontWeight="bold">d<sub>z²</sub></text>
              
              {/* d_xz, d_yz (o'rtacha) */}
              <line x1="100" y1="150" x2="400" y2="150" stroke="#f59e0b" strokeWidth="3"/>
              <text x="420" y="155" fill="#f59e0b" fontSize="14" fontWeight="bold">d<sub>xz</sub>, d<sub>yz</sub></text>
              
              {/* d_xy, d_x²-y² (eng past) */}
              <line x1="100" y1="220" x2="400" y2="220" stroke="#10b981" strokeWidth="3"/>
              <text x="420" y="225" fill="#10b981" fontSize="14" fontWeight="bold">d<sub>xy</sub>, d<sub>x²-y²</sub></text>
              
              {/* Elektronlar (d¹⁰) */}
              <circle cx="150" cy="220" r="6" fill="#10b981"/>
              <circle cx="170" cy="220" r="6" fill="#10b981"/>
              <circle cx="200" cy="220" r="6" fill="#10b981"/>
              <circle cx="220" cy="220" r="6" fill="#10b981"/>
              
              <circle cx="250" cy="150" r="6" fill="#f59e0b"/>
              <circle cx="270" cy="150" r="6" fill="#f59e0b"/>
              <circle cx="300" cy="150" r="6" fill="#f59e0b"/>
              <circle cx="320" cy="150" r="6" fill="#f59e0b"/>
              
              <circle cx="350" cy="80" r="6" fill="#ef4444"/>
              <circle cx="370" cy="80" r="6" fill="#ef4444"/>
              
              {/* Label */}
              <text x="250" y="270" fill="#c4b5fd" fontSize="14" textAnchor="middle" fontWeight="bold">
                d¹⁰ konfiguratsiya — barcha orbitallar to'lgan
              </text>
            </svg>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3 text-center">
              <p className="text-red-400 font-bold text-sm mb-1">d<sub>z²</sub></p>
              <p className="text-xs text-red-200">Eng yuqori energiya</p>
            </div>
            <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold text-sm mb-1">d<sub>xz</sub>, d<sub>yz</sub></p>
              <p className="text-xs text-amber-200">O'rtacha energiya</p>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3 text-center">
              <p className="text-emerald-400 font-bold text-sm mb-1">d<sub>xy</sub>, d<sub>x²-y²</sub></p>
              <p className="text-xs text-emerald-200">Eng past energiya</p>
            </div>
          </div>
          
          <p className="text-purple-200 mt-4 text-sm">
            d¹⁰ konfiguratsiyada barcha d-orbitallar to'lgan → komplekslar
            <strong className="text-yellow-400"> diamagnit</strong> va <strong className="text-yellow-400">rangsiz</strong>
            (d-d o'tishlar mavjud emas).
          </p>
        </div>

        {/* ═════ MISOL BIRIKMALAR ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⭐</span> Xarakterli ionlar va misollar
          </h2>
          
          <p className="text-purple-200 mb-6 text-sm">
            Chiziqli komplekslar asosan <strong className="text-yellow-400">d¹⁰ konfiguratsiyali</strong>
            metall ionlari uchun xarakterli: Cu⁺ (3d¹⁰), Ag⁺ (4d¹⁰), Au⁺ (5d¹⁰) va Hg²⁺ (5d¹⁰).
          </p>
          
          {/* Mobile — cards */}
          <div className="md:hidden space-y-3">
            {misollar.map((m, i) => (
              <div 
                key={i}
                className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-mono text-blue-400 font-bold">{m.formula}</p>
                    <p className="text-xs text-purple-300 mt-1">{m.nomi}</p>
                  </div>
                  {m.muhim && (
                    <span className="text-[10px] bg-yellow-600/30 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-600/30">
                      ⭐ Muhim
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                  <div>
                    <span className="text-purple-400">Ion:</span>
                    <span className="text-yellow-400 ml-1">{m.ion}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Config:</span>
                    <span className="text-white ml-1 font-mono">{m.config}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Ligand:</span>
                    <span className="text-white ml-1">{m.ligand}</span>
                  </div>
                  <div>
                    <span className="text-purple-400">Rang:</span>
                    <span className="text-white ml-1">{m.rang}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-purple-700/30">
                  <p className="text-xs text-purple-400">
                    <span className="font-semibold">Qo'llanilish:</span> {m.qollanilish}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop — table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300 text-sm">Formula</th>
                  <th className="py-3 px-4 text-purple-300 text-sm">Nomi</th>
                  <th className="py-3 px-4 text-purple-300 text-sm">Ion</th>
                  <th className="py-3 px-4 text-purple-300 text-sm">Ligand</th>
                  <th className="py-3 px-4 text-purple-300 text-sm">Qo'llanilish</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {misollar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400 font-bold">{m.formula}</td>
                    <td className="py-3 px-4 text-sm">{m.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400">
                      {m.ion} <span className="text-xs text-purple-400">({m.config})</span>
                    </td>
                    <td className="py-3 px-4 text-sm">{m.ligand}</td>
                    <td className="py-3 px-4 text-sm">{m.qollanilish}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═════ AMALIY AHAMIYATI ═════ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🌍</span> Amaliy ahamiyati
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🧪</div>
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">Tollens reaktivi</h3>
              <p className="text-purple-200 text-xs">
                [Ag(NH₃)₂]OH — aldegidlarni aniqlashda ishlatiladi.
                "Kumush ko'zgu" reaksiyasi orqali sifat tahlili.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">⛏️</div>
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">Oltin qazib olish</h3>
              <p className="text-purple-200 text-xs">
                [Au(CN)₂]⁻ — sianidlash usulida oltin ajratib olinadi:
                4Au + 8NaCN + O₂ + 2H₂O → 4Na[Au(CN)₂] + 4NaOH
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-3">🔩</div>
              <h3 className="text-yellow-400 font-bold mb-2 text-sm">Galvanotexnika</h3>
              <p className="text-purple-200 text-xs">
                [Ag(CN)₂]⁻ — kumush qoplash uchun ishlatiladi.
                Metall sirtlarini himoya qilish.
              </p>
            </div>
          </div>
        </div>

        {/* ═════ XULOSA ═════ */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>✅</span> Asosiy xulosalar
          </h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Chiziqli komplekslar — <strong className="text-yellow-400">KS = 2, sp gibridlanish</strong></li>
            <li>Valent burchak — <strong>180°</strong></li>
            <li>Asosan <strong>d¹⁰ konfiguratsiyali</strong> ionlar: Cu⁺, Ag⁺, Au⁺, Hg²⁺</li>
            <li>Ligand — markaziy atom — ligand bir to'g'ri chiziqda joylashadi</li>
            <li>Eng muhim vakili: <strong>[Ag(NH₃)₂]OH — Tollens reaktivi</strong></li>
            <li>d¹⁰ — barcha orbitallar to'lgan → <strong>diamagnit, rangsiz</strong></li>
          </ol>
        </div>

        {/* ═════ NAVIGATSIYA ═════ */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/fazoviy" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Fazoviy bo'limi
          </Link>
          <Link 
            href="/oquv/fazoviy/uchburchak" 
            className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 transition-all text-white font-semibold"
          >
            Keyingi: Uchburchak →
          </Link>
        </div>

      </section>

    </main>
  )
}