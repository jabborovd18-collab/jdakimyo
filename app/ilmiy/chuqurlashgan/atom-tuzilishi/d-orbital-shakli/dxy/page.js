"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// dxy 3D TASVIR INTERAKTIV (simvolik)
// ============================================================================
function Dxy3D() {
  const [view, setView] = useState("angle1")
  
  const views = {
    angle1: {
      name: "XY tekisligidan ko'rinish (yuqoridan)",
      desc: "4 ta bo'lak x va y o'qlari orasida 45° burchak ostida. O'qlarning o'zi tugun tekisliklari — elektron zichligi nolga teng. Bo'laklar navbatma-navbat ishora almashadi.",
      color: "text-red-400"
    },
    angle2: {
      name: "XZ tekisligidan ko'rinish (yondan)",
      desc: "XZ tekisligi tugun tekisligi hisoblanadi — bu tekislikda orbital ko'rinmaydi. Elektron zichligi faqat XY tekisligida.",
      color: "text-red-400"
    },
    angle3: {
      name: "3D ko'rinish (izometrik)",
      desc: "dxy orbital — 4 ta bir xil bo'lakdan iborat. Har bir bo'lak qarama-qarshi ishoraga ega. Bo'laklar orasidagi burchak 90°.",
      color: "text-red-400"
    }
  }

  const v = views[view]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 dxy — fazoviy ko'rinishlar</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(views).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              view === key ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {val.name.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      {/* Simvolik 3D ko'rinish */}
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="text-center mb-4">
          <div className="relative w-64 h-64 mx-auto">
            {/* XY tekisligi */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* O'qlar */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-500/50"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-500/50"></div>
                {/* x o'qi belgisi */}
                <span className="absolute top-1/2 right-0 text-xs text-gray-500 -mt-4 mr-1">x</span>
                <span className="absolute left-1/2 top-0 text-xs text-gray-500 -ml-4 -mt-1">y</span>
                
                {/* 4 ta bo'lak */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                  {/* I chorak — musbat */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/60 rounded-full blur-sm transform rotate-45 scale-75"></div>
                  <span className="absolute top-1 right-1 text-xs text-white font-bold">+</span>
                  {/* II chorak — manfiy */}
                  <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/60 rounded-full blur-sm transform -rotate-45 scale-75"></div>
                  <span className="absolute top-1 left-1 text-xs text-white font-bold">−</span>
                  {/* III chorak — musbat */}
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-500/60 rounded-full blur-sm transform rotate-45 scale-75"></div>
                  <span className="absolute bottom-1 left-1 text-xs text-white font-bold">+</span>
                  {/* IV chorak — manfiy */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/60 rounded-full blur-sm transform -rotate-45 scale-75"></div>
                  <span className="absolute bottom-1 right-1 text-xs text-white font-bold">−</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-purple-400 text-xs mt-2">dxy orbital — XY tekisligida</p>
        </div>

        <div className={`rounded-lg p-4 bg-red-600/10 border border-red-500/30`}>
          <h4 className={`font-bold text-sm mb-2 ${v.color}`}>{v.name}</h4>
          <p className="text-purple-200 text-xs">{v.desc}</p>
        </div>
      </div>

      <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d" 
        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white text-sm font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all">
        🔄 To'liq 3D modelni ko'rish
      </Link>
    </div>
  )
}

// ============================================================================
// TUGUN TEKISLIKLARI INTERAKTIV
// ============================================================================
function TugunTekisliklari() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 dxy — tugun tekisliklari va burchak bog'liqligi</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Tugun tekisliklari:</p>
              <ul className="text-xs text-purple-200 space-y-2">
                <li>• <strong>xz tekisligi (y=0):</strong> Butun tekislik bo'ylab elektron zichligi nolga teng</li>
                <li>• <strong>yz tekisligi (x=0):</strong> Butun tekislik bo'ylab elektron zichligi nolga teng</li>
                <li>• <strong>Jami:</strong> 2 ta tugun tekisligi (burchak tugunlari)</li>
                <li>• <strong>Radial tugunlar:</strong> yo'q (3d orbital — n=3, l=2, n−l−1=0)</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
              <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun muhim?</p>
              <p className="text-purple-200">
                Tugun tekisliklari orbitalning <strong>simmetriyasini</strong> belgilaydi.
                dxy orbital xz va yz tekisliklariga nisbatan <strong>antisimmetrik</strong> —
                bu π-bog'lanish uchun ideal.
              </p>
            </div>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold text-xs mb-2">Burchak bog'liqligi:</p>
            <div className="space-y-2 text-xs">
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-300">To'lqin funksiyasi:</p>
                <p className="font-mono text-purple-200 mt-1">ψ_dxy ∝ xy · f(r)</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-300">Sferik koordinatalarda:</p>
                <p className="font-mono text-purple-200 mt-1">ψ_dxy ∝ sin²θ · sin(2φ) · R(r)</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-300">Maksimal amplituda:</p>
                <p className="text-purple-200 mt-1">θ = 90° (XY tekisligida), φ = 45°, 135°, 225°, 315°</p>
              </div>
              <div className="bg-purple-800/30 rounded p-2">
                <p className="text-purple-300">Tugunlar:</p>
                <p className="text-purple-200 mt-1">φ = 0°, 90°, 180°, 270° (o'qlar) — ψ = 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// KB BILAN BOG'LIQLIK
// ============================================================================
function KBBilanBogliqlik() {
  const [tab, setTab] = useState("oktaedrik")
  
  const maydonlar = {
    oktaedrik: {
      name: "Oktaedrik maydon",
      desc: "6 ta ligand ±x, ±y, ±z o'qlarida joylashgan. dxy orbital ligandlarga to'g'ri yo'nalmagan — o'qlar orasida. Shuning uchun ligandlar bilan to'g'ridan-to'g'ri σ-ta'sirlashmaydi.",
      energy: "t₂g guruhida — −0.4Δ₀ (stabillashgan)",
      role: "π-bog'lanish: ligand π-orbitallari bilan ta'sirlashadi. π-donor ligandlar → energiya oshadi; π-akseptor ligandlar → energiya pasayadi.",
      color: "text-green-400"
    },
    tetraedrik: {
      name: "Tetraedrik maydon",
      desc: "4 ta ligand tetraedr uchlarida. dxy orbital bu safar ligandlarga yaqinroq — energiyasi oktaedrikka nisbatan yuqoriroq.",
      energy: "t₂ guruhida — +0.4Δ_t (destabillashgan!)",
      role: "Tetraedrik maydonda t₂g orbitallar ligandlarga yaqinroq — ajralish teskari va kichikroq (Δ_t ≈ 4/9 Δ₀).",
      color: "text-red-400"
    },
    kvadrat: {
      name: "Kvadrat tekislik",
      desc: "4 ta ligand xy tekisligida. dxy orbital ligandlar orasida — energiyasi oraliq holatda. dxz, dyz dan yuqori, lekin dx²−y² dan past.",
      energy: "Oraliq energiya — dxz/dyz dan yuqori, dx²−y² dan past",
      role: "d⁸ konfiguratsiyali metallarda (Pt²⁺, Pd²⁺) dxy to'ldirilgan bo'ladi. Kvadrat tekislikda barqarorlikka hissa qo'shadi.",
      color: "text-yellow-400"
    }
  }

  const m = maydonlar[tab]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚛️ dxy — koordinatsion birikmalarda roli</h3>
      
      <div className="flex gap-2 mb-3">
        {Object.entries(maydonlar).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold ${
              tab === key ? "bg-red-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {val.name}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <h4 className={`font-bold text-sm mb-2 ${m.color}`}>{m.name}</h4>
        <p className="text-purple-200 text-sm mb-3">{m.desc}</p>
        <div className="bg-purple-900/50 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">Energiya holati:</p>
          <p className={m.color}>{m.energy}</p>
        </div>
        <div className="bg-purple-900/50 rounded-lg p-3 text-xs mt-2">
          <p className="text-yellow-400 font-bold mb-1">Komplekslardagi roli:</p>
          <p className="text-purple-200">{m.role}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// QIZIQARLI FAKTLAR
// ============================================================================
function QiziqarliFaktlar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💡 dxy haqida qiziqarli faktlar</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {[
            { fact: "dxy — d-orbitallar ichida eng \"oddiy\" shaklga ega: 4 ta bir xil bo'lak", color: "text-red-400" },
            { fact: "dxy orbital π-bog'lanish uchun ideal — ligandlar orasida joylashgan", color: "text-green-400" },
            { fact: "dxy, dxz, dyz — uchala orbital bir xil shaklga ega, faqat fazoviy yo'nalishi farq qiladi", color: "text-blue-400" },
            { fact: "Sferik koordinatalarda ψ_dxy ∝ sin²θ · sin(2φ) — bu funksiya har 90° da ishora almashadi", color: "text-yellow-400" },
            { fact: "dxy orbital 2 ta burchak tuguniga ega, radial tugunlar soni 0 (3d uchun)", color: "text-purple-400" },
            { fact: "Oktaedrik komplekslarda dxy → dxy* (antibog'lovchi) o'tish — d−d spektrlarda kuzatiladi", color: "text-pink-400" },
          ].map((item, i) => (
            <div key={i} className="bg-purple-900/50 rounded-lg p-3">
              <span className={`font-bold ${item.color}`}>#{i+1}</span>
              <p className="text-purple-200 mt-1">{item.fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function Dxy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300">Atom tuzilishi</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="text-purple-400 hover:text-purple-300">d-orbitallar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-red-400">dxy</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔴 dxy orbital</h1>
          <p className="text-purple-400 text-sm">To'rt bo'lakli • O'qlar orasida • t₂g guruhi • π-bog'lanish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-red-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl font-extrabold font-mono bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              dxy
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">dxy orbital — to'rt bo'lakli, o'qlar orasida</h2>
              <p className="text-purple-400">Burchak momenti l=2, magnit kvant soni mₗ = ±2</p>
            </div>
          </div>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">dxy</strong> — 5 ta d-orbitaldan biri. 
              Uning <strong>4 ta bo'lagi</strong> x va y o'qlari orasida 45° burchak ostida joylashgan.
              x va y o'qlarining o'zi <strong>tugun tekisliklari</strong> hisoblanadi — 
              bu tekisliklarda elektron zichligi <strong>nolga teng</strong>.
              Oktaedrik kristall maydonda <strong className="text-green-400">t₂g guruhiga</strong> kiradi — 
              ligandlardan uzoqda joylashgani uchun energiyasi <strong>stabillashgan</strong> (−0.4Δ₀).
              π-bog'lanishda faol ishtirok etadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">4 ta bo'lak</p>
              <p className="text-purple-300">XY tekisligida</p>
              <p className="text-purple-400 mt-1">x va y o'qlari orasida 45° burchak ostida</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">2 ta tugun</p>
              <p className="text-purple-300">xz va yz tekisliklari</p>
              <p className="text-purple-400 mt-1">Bu tekisliklarda elektron zichligi = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-red-400 font-bold text-lg">−0.4Δ₀</p>
              <p className="text-purple-300">t₂g guruhi (stabillashgan)</p>
              <p className="text-purple-400 mt-1">Ligandlar yo'nalishida emas</p>
            </div>
          </div>
        </div>

        {/* 3D KO'RINISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Dxy3D />
        </div>

        {/* TUGUN TEKISLIKLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TugunTekisliklari />
        </div>

        {/* KB BILAN BOG'LIQLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KBBilanBogliqlik />
        </div>

        {/* MATEMATIK IFODA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Matematik ifoda</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-2">Dekart koordinatalarida:</p>
                  <p className="font-mono text-purple-200 text-lg text-center">ψ_dxy ∝ xy · f(r)</p>
                  <p className="text-purple-400 mt-2">Bu yerda f(r) — radial qism, xy — burchak qism</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-2">Sferik koordinatalarda:</p>
                  <p className="font-mono text-purple-200 text-sm text-center">ψ_dxy = R₃₂(r) · (√15/4π) · sin²θ · sin(2φ)</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-2">Normallashtirilgan burchak qism:</p>
                  <p className="font-mono text-purple-200 text-sm text-center">Y(θ,φ) = √(15/16π) · sin²θ · sin(2φ)</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-2">Magnit kvant soni:</p>
                  <p className="text-purple-200">mₗ = ±2 — dxy va dx²−y² chiziqli kombinatsiyasi sifatida ifodalanadi</p>
                  <p className="font-mono text-purple-300 mt-1">|2,2⟩ + |2,−2⟩ → dxy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QIZIQARLI FAKTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <QiziqarliFaktlar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>dxy — <strong className="text-red-400">4 ta bo'lakli orbital</strong>, x va y o'qlari orasida 45° da</li>
            <li><strong className="text-red-400">2 ta tugun tekisligi:</strong> xz va yz — bu tekisliklarda elektron zichligi = 0</li>
            <li>Oktaedrik maydonda <strong className="text-green-400">t₂g guruhida (−0.4Δ₀)</strong> — stabillashgan</li>
            <li>Ligandlarga to'g'ri yo'nalmagan — <strong className="text-red-400">π-bog'lanish</strong> uchun ideal</li>
            <li>dxz va dyz bilan <strong className="text-red-400">degenerat</strong> (bir xil energiyada)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← d-orbitallar</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxz" className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:opacity-90 text-white font-semibold">dxz →</Link>
        </div>

      </section>
    </main>
  )
}