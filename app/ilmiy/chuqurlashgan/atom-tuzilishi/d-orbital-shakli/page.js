"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// ORBITAL INTERAKTIV SLAYDERI
// ============================================================================
function OrbitalInteraktiv() {
  const [orbital, setOrbital] = useState("dxy")
  
  const orbitallar = {
    dxy: {
      nomi: "dxy",
      shape: "To'rt bo'lakli — x va y o'qlari orasida (45° burchak ostida)",
      tekislik: "xz va yz tekisliklari — tugun tekisliklari",
      desc: "4 ta bo'lak x va y o'qlari orasida 45° burchak ostida joylashgan. Har bir bo'lak qarama-qarshi ishoraga ega. x va y o'qlarining o'zi tugun tekisliklari hisoblanadi — bu tekisliklarda elektron zichligi nolga teng.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Ligandlar x,y,z o'qlarida joylashgani uchun dxy orbital ligandlardan uzoqda — energiyasi pastroq (stabillashgan). π-bog'lanishda ishtirok etadi.",
      guruh: "t₂g",
      energiya: "−0.4Δ₀ (stabillashgan)",
      burchak: "θ = 90°, φ = 45° (maksimal amplituda)",
      tugun: "2 ta tugun tekisligi (xz, yz)",
      rang: "from-red-400 to-red-600",
      textColor: "text-red-400",
      bgCard: "bg-red-600/10 border-red-500/30",
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxy"
    },
    dxz: {
      nomi: "dxz",
      shape: "To'rt bo'lakli — x va z o'qlari orasida",
      tekislik: "xy va yz tekisliklari — tugun tekisliklari",
      desc: "4 ta bo'lak x va z o'qlari orasida joylashgan. x va z o'qlari tugun tekisliklari. dxy bilan bir xil shaklga ega, faqat fazoviy yo'nalishi boshqacha.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Ligandlardan uzoqda — energiyasi pastroq. π-bog'lanishda ishtirok etadi. dxz va dyz juft holda degenerat.",
      guruh: "t₂g",
      energiya: "−0.4Δ₀ (stabillashgan)",
      burchak: "θ = 45°, φ = 0° (maksimal amplituda)",
      tugun: "2 ta tugun tekisligi (xy, yz)",
      rang: "from-green-400 to-green-600",
      textColor: "text-green-400",
      bgCard: "bg-green-600/10 border-green-500/30",
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxz"
    },
    dyz: {
      nomi: "dyz",
      shape: "To'rt bo'lakli — y va z o'qlari orasida",
      tekislik: "xy va xz tekisliklari — tugun tekisliklari",
      desc: "4 ta bo'lak y va z o'qlari orasida joylashgan. y va z o'qlari tugun tekisliklari. dxz bilan degenerat juftlik hosil qiladi.",
      ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Ligandlardan uzoqda — energiyasi pastroq. dxz va dyz birgalikda π-bog'lanishda ishtirok etadi.",
      guruh: "t₂g",
      energiya: "−0.4Δ₀ (stabillashgan)",
      burchak: "θ = 45°, φ = 90° (maksimal amplituda)",
      tugun: "2 ta tugun tekisligi (xy, xz)",
      rang: "from-blue-400 to-blue-600",
      textColor: "text-blue-400",
      bgCard: "bg-blue-600/10 border-blue-500/30",
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dyz"
    },
    dz2: {
      nomi: "dz²",
      shape: "Ikki bo'lakli (dumbbell) + ekvatorial halqa (donut)",
      tekislik: "xy tekisligida halqa — tugun konusi",
      desc: "Eng murakkab shaklli d-orbital. z o'qi bo'ylab 2 ta katta bo'lak (dumbbell) + xy tekisligida halqa (donut/torus). Halqa — dz² orbitalning noyob xususiyati. Boshqa orbitallarda bunday halqa yo'q.",
      ahamiyat: "Oktaedrik maydonda e_g guruhiga kiradi. z o'qidagi ligandlar bilan to'g'ridan-to'g'ri ta'sirlashadi — energiyasi yuqori (destabillashgan). Jahn-Teller effektida muhim rol o'ynaydi.",
      guruh: "e_g",
      energiya: "+0.6Δ₀ (destabillashgan)",
      burchak: "θ = 0°, 180° (maksimal); θ = 54.7° (tugun konusi)",
      tugun: "2 ta tugun konusi (θ = 54.7° va 125.3°)",
      rang: "from-orange-400 to-orange-600",
      textColor: "text-orange-400",
      bgCard: "bg-orange-600/10 border-orange-500/30",
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dz2"
    },
    dx2y2: {
      nomi: "dx²−y²",
      shape: "To'rt bo'lakli — to'g'ridan-to'g'ri x va y o'qlarida",
      tekislik: "xz va yz tekisliklari (45° da) — tugun tekisliklari",
      desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida joylashgan. Ligandlar aynan shu yo'nalishda bo'ladi. dxy dan 45° ga burilgan. x va y o'qlarida maksimal amplituda.",
      ahamiyat: "Oktaedrik maydonda eng yuqori energiyali orbital — ligandlar aynan shu orbital yo'nalishida joylashadi. Kuchli σ-antibog'lovchi ta'sir. Jahn-Teller effektida asosiy orbital.",
      guruh: "e_g",
      energiya: "+0.6Δ₀ (destabillashgan)",
      burchak: "θ = 90°, φ = 0°, 90°, 180°, 270° (maksimal)",
      tugun: "2 ta tugun tekisligi (xz, yz 45° da)",
      rang: "from-pink-400 to-pink-600",
      textColor: "text-pink-400",
      bgCard: "bg-pink-600/10 border-pink-500/30",
      href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dx2y2"
    }
  }

  const o = orbitallar[orbital]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎯 d-orbitallar — interaktiv ko'rish</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(orbitallar).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setOrbital(key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold font-mono transition-colors ${
              orbital === key 
                ? `bg-gradient-to-r ${val.rang} text-white` 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {val.nomi}
          </button>
        ))}
      </div>

      <div className={`rounded-xl p-5 border ${o.bgCard}`}>
        <div className="flex items-center gap-4 mb-4">
          <span className={`text-5xl font-extrabold font-mono bg-gradient-to-r ${o.rang} bg-clip-text text-transparent`}>
            {o.nomi}
          </span>
          <div>
            <h4 className={`font-bold text-xl ${o.textColor}`}>{o.shape}</h4>
            <p className="text-purple-400 text-xs">Tugun tekisliklari: {o.tekislik}</p>
          </div>
        </div>

        <p className="text-purple-200 text-sm mb-4">{o.desc}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">Oktaedrik guruh</p>
            <p className={`font-bold ${o.guruh === "t₂g" ? "text-green-400" : "text-red-400"}`}>{o.guruh}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">Energiya siljishi</p>
            <p className={o.guruh === "t₂g" ? "text-green-400 font-bold" : "text-red-400 font-bold"}>{o.energiya}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3 text-center">
            <p className="text-purple-400">Tugunlar soni</p>
            <p className="text-purple-200 font-bold">{o.tugun}</p>
          </div>
        </div>

        <div className="bg-purple-900/50 rounded-lg p-4 text-xs">
          <p className="text-yellow-400 font-bold mb-2">🧪 Komplekslar uchun ahamiyati:</p>
          <p className="text-purple-200">{o.ahamiyat}</p>
        </div>

        <div className="flex gap-3 mt-3">
          <Link href={o.href} className={`px-4 py-2 bg-gradient-to-r ${o.rang} rounded-lg text-white text-xs font-semibold hover:opacity-90 transition-opacity`}>
            Batafsil →
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d" className="px-4 py-2 bg-purple-600/80 rounded-lg text-white text-xs font-semibold hover:bg-purple-500 transition-colors">
            3D model 🔄
          </Link>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ENERGETIK DIAGRAMMA INTERAKTIV
// ============================================================================
function EnergetikDiagramma() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ Kristall maydonda d-orbital energetik ajralishi</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Erkin ion */}
          <div className="space-y-3">
            <p className="text-purple-300 font-bold text-sm">Erkin ion</p>
            <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
              {["dxy", "dxz", "dyz", "dz²", "dx²−y²"].map((d, i) => (
                <div key={i} className="bg-purple-800/50 rounded p-2">
                  <span className="text-purple-300 font-mono text-xs">{d}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-xs">Δ = 0 (degenerat)</p>
          </div>

          {/* Oktaedrik */}
          <div className="space-y-3">
            <p className="text-blue-400 font-bold text-sm">Oktaedrik maydon</p>
            <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
              <div className="space-y-1">
                <div className="bg-red-600/20 border border-red-500/30 rounded p-2">
                  <span className="text-red-400 font-mono text-xs">dz², dx²−y²</span>
                </div>
                <p className="text-red-400 text-xs">e_g: +0.6Δ₀</p>
              </div>
              <div className="h-8 border-l-2 border-dashed border-purple-500 mx-auto"></div>
              <p className="text-yellow-400 text-xs font-bold">Δ₀</p>
              <div className="h-8 border-l-2 border-dashed border-purple-500 mx-auto"></div>
              <div className="space-y-1">
                <div className="bg-green-600/20 border border-green-500/30 rounded p-2">
                  <span className="text-green-400 font-mono text-xs">dxy, dxz, dyz</span>
                </div>
                <p className="text-green-400 text-xs">t₂g: −0.4Δ₀</p>
              </div>
            </div>
          </div>

          {/* Tetraedrik */}
          <div className="space-y-3">
            <p className="text-green-400 font-bold text-sm">Tetraedrik maydon</p>
            <div className="bg-purple-900/50 rounded-lg p-4 space-y-2">
              <div className="space-y-1">
                <div className="bg-red-600/20 border border-red-500/30 rounded p-2">
                  <span className="text-red-400 font-mono text-xs">dxy, dxz, dyz</span>
                </div>
                <p className="text-red-400 text-xs">t₂: +0.4Δ_t</p>
              </div>
              <div className="h-8 border-l-2 border-dashed border-purple-500 mx-auto"></div>
              <p className="text-yellow-400 text-xs font-bold">Δ_t ≈ 0.44Δ₀</p>
              <div className="h-8 border-l-2 border-dashed border-purple-500 mx-auto"></div>
              <div className="space-y-1">
                <div className="bg-green-600/20 border border-green-500/30 rounded p-2">
                  <span className="text-green-400 font-mono text-xs">dz², dx²−y²</span>
                </div>
                <p className="text-green-400 text-xs">e: −0.6Δ_t</p>
              </div>
            </div>
            <p className="text-yellow-400 text-xs">Teskari ajralish!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function DOrbitalShakli() {
  const orbitallar = [
    { nomi: "dxy", shape: "To'rt bo'lakli — o'qlar orasida", tekislik: "xz va yz tekisliklari", desc: "4 ta bo'lak x va y o'qlari orasida (45° burchak ostida) joylashgan.", ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Ligandlar yo'nalishida emas — energiyasi pastroq.", guruh: "t₂g", energiya: "−0.4Δ₀ ↓", rang: "text-red-400", borderRang: "border-red-500/30", bgRang: "bg-red-600/10", href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxy" },
    { nomi: "dxz", shape: "To'rt bo'lakli — o'qlar orasida", tekislik: "xy va yz tekisliklari", desc: "4 ta bo'lak x va z o'qlari orasida joylashgan.", ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Energiyasi pasaygan (stabillashgan).", guruh: "t₂g", energiya: "−0.4Δ₀ ↓", rang: "text-green-400", borderRang: "border-green-500/30", bgRang: "bg-green-600/10", href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxz" },
    { nomi: "dyz", shape: "To'rt bo'lakli — o'qlar orasida", tekislik: "xy va xz tekisliklari", desc: "4 ta bo'lak y va z o'qlari orasida joylashgan.", ahamiyat: "Oktaedrik maydonda t₂g guruhiga kiradi. Energiyasi pasaygan (stabillashgan).", guruh: "t₂g", energiya: "−0.4Δ₀ ↓", rang: "text-blue-400", borderRang: "border-blue-500/30", bgRang: "bg-blue-600/10", href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dyz" },
    { nomi: "dz²", shape: "Ikki bo'lakli + halqa (dumbbell + donut)", tekislik: "xy tekisligida halqa", desc: "2 ta katta bo'lak z o'qi bo'ylab + ekvatorial halqa.", ahamiyat: "Oktaedrik maydonda e_g guruhiga kiradi. Jahn-Teller effektida muhim.", guruh: "e_g", energiya: "+0.6Δ₀ ↑", rang: "text-orange-400", borderRang: "border-orange-500/30", bgRang: "bg-orange-600/10", href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dz2" },
    { nomi: "dx²−y²", shape: "To'rt bo'lakli — o'qlar ustida", tekislik: "xz va yz tekisliklari (45° da)", desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida joylashgan.", ahamiyat: "Oktaedrik maydonda ligandlar aynan shu orbital yo'nalishida — eng yuqori energiya.", guruh: "e_g", energiya: "+0.6Δ₀ ↑", rang: "text-pink-400", borderRang: "border-pink-500/30", bgRang: "bg-pink-600/10", href: "/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dx2y2" }
  ]

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
          <span className="text-purple-300">d-orbitallar shakli</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🎯 d-orbitallarning shakli</h1>
          <p className="text-purple-400 text-sm">5 ta d-orbital • Shakli va fazoviy yo'nalishi • 3D model • Tugun tekisliklari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D LINK */}
        <div className="text-center">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-purple-200">Barcha 5 ta d-orbital — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 d-orbitallar — kompleks birikmalarning asosi</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-orbitallar</strong> — burchak momenti l = 2 bo'lgan 
              <strong> 5 ta orbital</strong>. Ularning shakli, fazoviy yo'nalishi va energetik ajralishi
              <strong className="text-yellow-400"> kompleks birikmalarning geometriyasini, rangini, 
              magnit xossalarini va reaksion qobiliyatini</strong> bevosita belgilaydi.
              Erkin ionda barcha 5 ta orbital <strong>degenerat</strong> (bir xil energiyada).
              Kristall maydonda ular <strong>t₂g</strong> (3 ta, stabillashgan) va 
              <strong>e_g</strong> (2 ta, destabillashgan) guruhlarga ajraladi.
            </p>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OrbitalInteraktiv />
        </div>

        {/* ENERGETIK DIAGRAMMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <EnergetikDiagramma />
        </div>

        {/* 5 TA ORBITAL KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Har bir orbital batafsil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orbitallar.map((o, i) => (
              <Link key={i} href={o.href} className={`group rounded-2xl p-6 border ${o.borderRang} ${o.bgRang} hover:scale-[1.02] transition-all`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-3xl font-extrabold font-mono ${o.rang}`}>{o.nomi}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${o.guruh === "t₂g" ? "bg-green-600/20 text-green-400 border-green-600/30" : "bg-red-600/20 text-red-400 border-red-600/30"}`}>
                    {o.guruh}
                  </span>
                </div>
                <p className="text-purple-200 text-sm mb-2">{o.shape}</p>
                <p className="text-purple-400 text-xs mb-2">{o.desc}</p>
                <p className={`text-xs font-bold ${o.guruh === "t₂g" ? "text-green-400" : "text-red-400"}`}>{o.energiya}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* QO'SHIMCHA BO'LIMLAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/taqqoslash" 
            className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/50 transition-colors">
            <span className="text-3xl">⚖️</span>
            <h3 className="text-yellow-400 font-bold mt-2">Orbitallar taqqoslanishi</h3>
            <p className="text-purple-300 text-xs mt-1">Shakli, energiyasi, tugunlari — barcha 5 ta orbital solishtiriladi</p>
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/tugun-tekisliklari" 
            className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6 hover:bg-purple-800/50 transition-colors">
            <span className="text-3xl">📐</span>
            <h3 className="text-yellow-400 font-bold mt-2">Tugun tekisliklari</h3>
            <p className="text-purple-300 text-xs mt-1">Burchak tugunlari, radial tugunlar, fazoviy taqsimot</p>
          </Link>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>5 ta d-orbital: <strong className="text-yellow-400">dxy, dxz, dyz (t₂g), dz², dx²−y² (e_g)</strong></li>
            <li>Oktaedrik maydonda: <strong>t₂g (−0.4Δ₀) — stabillashgan, e_g (+0.6Δ₀) — destabillashgan</strong></li>
            <li>Tetraedrik maydonda <strong>teskari ajralish</strong>: t₂ (destabillashgan), e (stabillashgan)</li>
            <li>dx²−y² — ligandlar yo'nalishida, <strong>eng yuqori energiyali orbital</strong></li>
            <li>dz² — <strong>yagona halqali orbital</strong>, Jahn-Teller effektida muhim</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kvant sonlar</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxy" className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:opacity-90 text-white font-semibold">dxy orbital →</Link>
        </div>

      </section>
    </main>
  )
}