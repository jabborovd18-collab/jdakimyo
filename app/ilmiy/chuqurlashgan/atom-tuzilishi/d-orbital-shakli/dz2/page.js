"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// dz² 3D TASVIR INTERAKTIV
// ============================================================================
function Dz23D() {
  const [view, setView] = useState("angle1")
  
  const views = {
    angle1: {
      name: "Z o'qi bo'ylab ko'rinish (yondan)",
      desc: "2 ta katta bo'lak z o'qi bo'ylab (dumbbell shaklida) + xy tekisligida halqa (donut). Bu — dz² orbitalning noyob xususiyati. Boshqa hech qaysi d-orbitalda bunday halqa yo'q.",
      color: "text-orange-400"
    },
    angle2: {
      name: "Yuqoridan ko'rinish (xy tekisligi)",
      desc: "Yuqoridan qaraganda halqa (donut) ko'rinadi. Markazda atom yadrosi. Halqa — musbat ishorali elektron zichligi.",
      color: "text-orange-400"
    },
    angle3: {
      name: "3D ko'rinish (izometrik)",
      desc: "dz² orbital — 2 ta bo'lak + 1 ta halqa. Halqa — boshqa orbitallarda uchramaydigan noyob struktura. Jahn-Teller effektida muhim rol o'ynaydi.",
      color: "text-orange-400"
    }
  }

  const v = views[view]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 dz² — fazoviy ko'rinishlar (dumbbell + donut)</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(views).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              view === key ? "bg-orange-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {val.name.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="text-center mb-4">
          <div className="relative w-64 h-80 mx-auto">
            {/* Z o'qi — vertikal */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 bg-gray-500/50 transform -translate-x-1/2"></div>
            <span className="absolute left-1/2 top-0 text-xs text-gray-500 -ml-4">z</span>
            
            {/* Yuqori bo'lak — musbat */}
            <div className="absolute left-1/2 top-8 w-16 h-24 bg-orange-500/60 rounded-full blur-sm transform -translate-x-1/2"></div>
            <span className="absolute left-1/2 top-12 text-xs text-white font-bold transform -translate-x-1/2">+</span>
            
            {/* Halqa (donut) — musbat */}
            <div className="absolute left-1/2 top-1/2 w-20 h-8 bg-orange-400/50 rounded-full blur-sm transform -translate-x-1/2 -translate-y-1/2 border-2 border-orange-400/30"></div>
            <span className="absolute left-1/2 top-1/2 text-xs text-white font-bold transform -translate-x-1/2 -translate-y-1/2">+</span>
            
            {/* Pastki bo'lak — musbat */}
            <div className="absolute left-1/2 bottom-8 w-16 h-24 bg-orange-500/60 rounded-full blur-sm transform -translate-x-1/2"></div>
            <span className="absolute left-1/2 bottom-12 text-xs text-white font-bold transform -translate-x-1/2">+</span>
            
            {/* Tugun konusi belgilari */}
            <div className="absolute left-1/2 top-[45%] w-12 h-0.5 bg-red-500/50 transform -translate-x-1/2 rotate-[55deg]"></div>
            <div className="absolute left-1/2 top-[55%] w-12 h-0.5 bg-red-500/50 transform -translate-x-1/2 -rotate-[55deg]"></div>
          </div>
          <p className="text-purple-400 text-xs mt-2">dz² orbital — 2 bo'lak + halqa (donut)</p>
        </div>

        <div className="rounded-lg p-4 bg-orange-600/10 border border-orange-500/30">
          <h4 className="font-bold text-sm mb-2 text-orange-400">{v.name}</h4>
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
// HALQA (DONUT) FENOMENI
// ============================================================================
function HalqaFenomeni() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🍩 dz² halqasi — noyob xususiyat</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Dz² orbitalning halqasi (donut/torus)</strong> — 
          bu boshqa hech qaysi d-orbitalda uchramaydigan <strong>noyob struktura</strong>.
          Halqa xy tekisligida joylashgan va <strong>musbat ishorali</strong> elektron zichligiga ega.
          Halqaning mavjudligi dz² orbital matematik ifodasidan kelib chiqadi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Nima uchun halqa mavjud?</p>
            <ul className="text-purple-200 space-y-1">
              <li>• dz² orbital <strong>boshqa d-orbitallarning chiziqli kombinatsiyasi</strong> sifatida ifodalanadi</li>
              <li>• Sferik koordinatalarda: <strong>ψ ∝ (3cos²θ − 1)</strong></li>
              <li>• θ = 90° (xy tekisligi) da ψ <strong>nolga teng emas</strong> — halqa hosil bo'ladi</li>
              <li>• Boshqa d-orbitallarda θ = 90° da ψ = 0 (tugun tekisligi)</li>
            </ul>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Halqaning xususiyatlari</p>
            <ul className="text-purple-200 space-y-1">
              <li>• <strong>Shakli:</strong> Torus (donut) — xy tekisligida</li>
              <li>• <strong>Ishorasi:</strong> Musbat (bo'laklar bilan bir xil)</li>
              <li>• <strong>Zichligi:</strong> Bo'laklarga nisbatan kichikroq</li>
              <li>• <strong>θ = 54.7°:</strong> Tugun konusi — bu burchakda ψ = 0</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 mt-4 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 "Sehrli burchak" — 54.7°</p>
          <p className="text-purple-200">
            θ = 54.7° da (3cos²θ − 1) = 0. Bu <strong>"sehrli burchak" (magic angle)</strong> —
            qattiq jism NMR spektroskopiyasida namuna aylantirish burchagi.
            dz² orbital uchun bu burchak <strong>tugun konusini</strong> hosil qiladi —
            bo'laklar bilan halqa orasidagi chegara.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// JAHN-TELLER EFFEKTIDA dz² ROLI
// ============================================================================
function JahnTellerRoli() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Jahn-Teller effektida dz² ning roli</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">Jahn-Teller effekti</strong> — 
          e_g orbitallarda elektronlar soni notekis bo'lganda kompleks geometriyasining buzilishi.
          dz² orbital bu effektda <strong>markaziy rol</strong> o'ynaydi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">d⁹ konfiguratsiya (Cu²⁺):</p>
            <ul className="text-purple-200 space-y-1">
              <li>• e_g da 3 ta elektron: dx²−y² (2e⁻) + <strong>dz² (1e⁻)</strong></li>
              <li>• dz² da <strong>kam elektron</strong> — z o'qidagi ligandlar yaqinlashadi</li>
              <li>• dx²−y² da <strong>ko'p elektron</strong> — xy tekisligidagi ligandlar uzoqlashadi</li>
              <li>• <strong>Natija:</strong> cho'zilgan oktaedr (2 uzun + 4 qisqa bog')</li>
            </ul>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">d⁷ (LS) konfiguratsiya (Co²⁺):</p>
            <ul className="text-purple-200 space-y-1">
              <li>• e_g da 1 ta elektron: <strong>faqat dz² da</strong> yoki faqat dx²−y² da</li>
              <li>• <strong>Qaysi orbitalda elektron bo'lsa</strong> — o'sha yo'nalishda bog' uzayadi</li>
              <li>• <strong>Statik Jahn-Teller:</strong> past haroratda bir konfiguratsiya "muzlaydi"</li>
              <li>• <strong>Dinamik Jahn-Teller:</strong> yuqori haroratda ikki konfiguratsiya orasida tebranadi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function Dz2() {
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
          <span className="text-orange-400">dz²</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🟠 dz² orbital</h1>
          <p className="text-purple-400 text-sm">Dumbbell + donut • e_g guruhi • "Sehrli burchak" • Jahn-Teller</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl font-extrabold font-mono bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">dz²</span>
            <div>
              <h2 className="text-xl font-bold text-white">dz² orbital — eng murakkab shaklli d-orbital</h2>
              <p className="text-purple-400">Burchak momenti l=2, magnit kvant soni mₗ = 0</p>
            </div>
          </div>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-orange-400">dz²</strong> — 5 ta d-orbital ichida 
              <strong> eng murakkab shaklga</strong> ega. U <strong>2 ta katta bo'lak</strong> 
              (dumbbell shaklida, z o'qi bo'ylab) va <strong>xy tekisligida halqa (donut/torus)</strong> dan 
              iborat. <strong className="text-yellow-400">Bu halqa — dz² ning noyob xususiyati</strong>, 
              boshqa hech qaysi d-orbitalda bunday struktura yo'q. Oktaedrik maydonda 
              <strong className="text-red-400">e_g guruhiga kiradi (+0.6Δ₀ — destabillashgan)</strong>.
              <strong> Jahn-Teller effektida</strong> markaziy rol o'ynaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">2 bo'lak</p>
              <p className="text-purple-300">z o'qi bo'ylab</p>
              <p className="text-purple-400 mt-1">Dumbbell shaklida</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">1 halqa</p>
              <p className="text-purple-300">xy tekisligida</p>
              <p className="text-purple-400 mt-1">Noyob struktura!</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">2 tugun</p>
              <p className="text-purple-300">Konus shaklida (54.7°)</p>
              <p className="text-purple-400 mt-1">"Sehrli burchak"</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">+0.6Δ₀</p>
              <p className="text-purple-300">e_g guruhi</p>
              <p className="text-purple-400 mt-1">Destabillashgan</p>
            </div>
          </div>
        </div>

        {/* 3D KO'RINISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Dz23D />
        </div>

        {/* HALQA FENOMENI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HalqaFenomeni />
        </div>

        {/* MATEMATIK IFODA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Matematik ifoda — "sehrli burchak"</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold text-sm mb-3">To'lqin funksiyasi</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Dekart:</p>
                  <p className="font-mono text-purple-200 text-sm">ψ_dz² ∝ (2z² − x² − y²) · f(r)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Sferik (normallashtirilgan):</p>
                  <p className="font-mono text-purple-200 text-xs">Y(θ,φ) = √(5/16π) · (3cos²θ − 1)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Tugun konusi (ψ = 0):</p>
                  <p className="font-mono text-purple-200">3cos²θ − 1 = 0 → θ = 54.7° ("sehrli burchak")</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold text-sm mb-3">Nima uchun dz² boshqacha?</h3>
              <ul className="text-purple-200 text-xs space-y-2">
                <li>• dz² — <strong>mₗ = 0</strong> orbital. Boshqa orbitallar mₗ = ±1, ±2</li>
                <li>• <strong>Simmetriya:</strong> dz² sferik garmonikada Y₂₀ ga mos keladi</li>
                <li>• <strong>Faktor (3cos²θ−1):</strong> θ = 90° da −1 (halqa!), θ = 0° da +2 (bo'lak)</li>
                <li>• <strong>Normallashtirish:</strong> dz² boshqa d-orbitallardan farqli normallangan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* JAHN-TELLER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <JahnTellerRoli />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>dz² — <strong className="text-orange-400">eng murakkab shaklli d-orbital</strong>: 2 bo'lak + 1 halqa (donut)</li>
            <li>Halqa — <strong className="text-orange-400">dz² ning noyob xususiyati</strong>, boshqa orbitallarda yo'q</li>
            <li>Oktaedrik maydonda <strong className="text-red-400">e_g guruhida (+0.6Δ₀)</strong> — destabillashgan</li>
            <li><strong className="text-orange-400">"Sehrli burchak" 54.7°</strong> — tugun konusi, (3cos²θ−1) = 0</li>
            <li><strong className="text-orange-400">Jahn-Teller effektida</strong> markaziy rol o'ynaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dyz" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← dyz</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dx2y2" className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl hover:opacity-90 text-white font-semibold">dx²−y² →</Link>
        </div>

      </section>
    </main>
  )
}