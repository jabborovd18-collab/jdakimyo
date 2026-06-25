"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// dx²−y² 3D TASVIR INTERAKTIV
// ============================================================================
function Dx2y23D() {
  const [view, setView] = useState("angle1")
  
  const views = {
    angle1: {
      name: "XY tekisligidan ko'rinish (yuqoridan)",
      desc: "4 ta bo'lak to'g'ridan-to'g'ri x va y o'qlarida joylashgan. Ligandlar aynan shu yo'nalishda bo'ladi — shuning uchun eng yuqori energiyali orbital. dxy dan 45° ga burilgan.",
      color: "text-pink-400"
    },
    angle2: {
      name: "XZ tekisligidan ko'rinish (yondan)",
      desc: "XZ tekisligi tugun tekisligi (45° da). Bu tekislikda orbital faqat x o'qi bo'ylab ko'rinadi. X o'qidagi bo'laklar aniq ko'rinadi.",
      color: "text-pink-400"
    },
    angle3: {
      name: "3D ko'rinish (izometrik)",
      desc: "dx²−y² — oktaedrik maydonda eng muhim orbital. Ligandlar bilan to'g'ridan-to'g'ri σ-ta'sirlashadi. Jahn-Teller effektida asosiy orbital.",
      color: "text-pink-400"
    }
  }

  const v = views[view]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 dx²−y² — fazoviy ko'rinishlar (o'qlar ustida)</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(views).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              view === key ? "bg-pink-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {val.name.split(" ").slice(0, 3).join(" ")}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="text-center mb-4">
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {/* O'qlar */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-500/50"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-500/50"></div>
                <span className="absolute top-1/2 right-0 text-xs text-gray-500 -mt-4 mr-1">x</span>
                <span className="absolute left-1/2 top-0 text-xs text-gray-500 -ml-4 -mt-1">y</span>
                
                {/* 4 ta bo'lak o'qlar ustida */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
                  {/* +x o'qi — musbat */}
                  <div className="absolute top-1/2 right-0 w-16 h-12 bg-pink-500/60 rounded-full blur-sm transform -translate-y-1/2"></div>
                  <span className="absolute top-1/2 right-2 text-xs text-white font-bold transform -translate-y-1/2">+</span>
                  {/* −x o'qi — musbat */}
                  <div className="absolute top-1/2 left-0 w-16 h-12 bg-pink-500/60 rounded-full blur-sm transform -translate-y-1/2"></div>
                  <span className="absolute top-1/2 left-2 text-xs text-white font-bold transform -translate-y-1/2">+</span>
                  {/* +y o'qi — manfiy */}
                  <div className="absolute left-1/2 top-0 w-12 h-16 bg-blue-500/60 rounded-full blur-sm transform -translate-x-1/2"></div>
                  <span className="absolute left-1/2 top-2 text-xs text-white font-bold transform -translate-x-1/2">−</span>
                  {/* −y o'qi — manfiy */}
                  <div className="absolute left-1/2 bottom-0 w-12 h-16 bg-blue-500/60 rounded-full blur-sm transform -translate-x-1/2"></div>
                  <span className="absolute left-1/2 bottom-2 text-xs text-white font-bold transform -translate-x-1/2">−</span>
                </div>
                
                {/* Tugun tekisliklari (45° da) */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-1/2 left-1/2 w-1 h-full bg-red-500/20 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  <div className="absolute top-1/2 left-1/2 w-1 h-full bg-red-500/20 transform -translate-x-1/2 -translate-y-1/2 -rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-purple-400 text-xs mt-2">dx²−y² orbital — x va y o'qlarida</p>
        </div>

        <div className="rounded-lg p-4 bg-pink-600/10 border border-pink-500/30">
          <h4 className="font-bold text-sm mb-2 text-pink-400">{v.name}</h4>
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
// LIGAND BILAN TA'SIRLASHUV
// ============================================================================
function LigandTasirlashuv() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚡ dx²−y² — ligandlar bilan to'g'ridan-to'g'ri ta'sirlashuv</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">dx²−y² orbital</strong> — 
          oktaedrik maydonda <strong>eng yuqori energiyaga ega</strong> orbital.
          Sababi: uning bo'laklari <strong>to'g'ridan-to'g'ri ligandlar yo'nalishida</strong> 
          (±x va ±y o'qlari). Bu kuchli <strong>σ-antibog'lovchi</strong> ta'sirga olib keladi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">σ-bog'lanish sxemasi:</p>
            <div className="space-y-2">
              <div className="bg-red-600/10 border border-red-500/30 rounded p-2 text-center">
                <p className="text-red-400">dx²−y² (antibog'lovchi) — +0.6Δ₀</p>
                <p className="text-purple-400">Ligand σ orbitallari bilan fazada qarama-qarshi</p>
              </div>
              <p className="text-lime-400 text-center">↓ Δ₀ (ajralish energiyasi)</p>
              <div className="bg-green-600/10 border border-green-500/30 rounded p-2 text-center">
                <p className="text-green-400">dx²−y² (bog'lovchi) — ligand σ bilan fazada</p>
                <p className="text-purple-400">Elektronlar asosan shu yerda</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-4">
            <p className="text-yellow-400 font-bold mb-2">Kompleks geometriyasiga ta'siri:</p>
            <ul className="text-purple-200 space-y-1">
              <li>• dx²−y² da <strong>elektronlar ko'p</strong> → xy tekisligidagi ligandlar itariladi</li>
              <li>• <strong>Kvadrat tekislik:</strong> d⁸ (Pt²⁺, Pd²⁺) — dx²−y² bo'sh qoladi</li>
              <li>• <strong>Jahn-Teller (d⁹, Cu²⁺):</strong> dx²−y² da 2e⁻, dz² da 1e⁻ → cho'zilgan oktaedr</li>
              <li>• <strong>Kuchli maydon ligandlari</strong> bilan Δ₀ katta — dx²−y² energiyasi juda yuqori</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// dx²−y² vs dxy TAQQOSLASH
// ============================================================================
function Dx2y2vsDxy() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ dx²−y² vs dxy — 45° farq</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <p className="text-purple-200 text-sm mb-4">
          <strong className="text-yellow-400">dx²−y² va dxy</strong> — ikkalasi ham 4 ta bo'lakli, 
          lekin <strong>45° ga burilgan</strong>. Bu kichik farq <strong>energiyada katta farq</strong> ga olib keladi:
          oktaedrik maydonda dxy stabillashgan (−0.4Δ₀), dx²−y² esa destabillashgan (+0.6Δ₀).
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-2 px-3 text-yellow-400">Xususiyat</th>
                <th className="text-left py-2 px-3 text-red-400">dxy</th>
                <th className="text-left py-2 px-3 text-pink-400">dx²−y²</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Bo'laklar joylashuvi", "O'qlar orasida (45° da)", "O'qlar ustida (0°, 90° da)"],
                ["Oktaedrik energiya", "−0.4Δ₀ (t₂g) — stabillashgan", "+0.6Δ₀ (e_g) — destabillashgan"],
                ["Ligand bilan ta'sir", "π-ta'sirlashuv (bilvosita)", "σ-ta'sirlashuv (to'g'ridan-to'g'ri)"],
                ["Tugun tekisliklari", "xz, yz (o'qlar)", "xz, yz 45° da burilgan"],
                ["Magnit kvant soni", "mₗ = ±2", "mₗ = ±2"],
                ["Simmetriya (O_h)", "t₂g — juft", "e_g — juft"],
                ["Jahn-Teller roli", "Ta'sirlanmaydi (stabillashgan)", "Asosiy orbital!"],
                ["Kvadrat tekislikda", "Oraliq energiya", "Eng yuqori energiya (bo'sh)"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30">
                  <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                  <td className="py-2 px-3">{row[1]}</td>
                  <td className="py-2 px-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function Dx2y2() {
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
          <span className="text-pink-400">dx²−y²</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🩷 dx²−y² orbital</h1>
          <p className="text-purple-400 text-sm">To'rt bo'lakli • O'qlar ustida • e_g guruhi • σ-antibog'lovchi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-pink-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl font-extrabold font-mono bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">dx²−y²</span>
            <div>
              <h2 className="text-xl font-bold text-white">dx²−y² orbital — o'qlar ustida, eng yuqori energiyali</h2>
              <p className="text-purple-400">Burchak momenti l=2, magnit kvant soni mₗ = ±2</p>
            </div>
          </div>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-pink-400">dx²−y²</strong> — 5 ta d-orbital ichida 
              <strong> oktaedrik maydonda eng yuqori energiyaga ega</strong> orbital.
              Uning 4 ta bo'lagi <strong>to'g'ridan-to'g'ri x va y o'qlarida</strong> joylashgan —
              ligandlar aynan shu yo'nalishda. Bu kuchli <strong>σ-antibog'lovchi</strong> 
              ta'sirga olib keladi. <strong className="text-red-400">e_g guruhida (+0.6Δ₀)</strong> — 
              destabillashgan. <strong>Jahn-Teller effektida</strong> asosiy orbital.
              dxy bilan bir xil shaklga ega, lekin <strong>45° ga burilgan</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">4 ta bo'lak</p>
              <p className="text-purple-300">x va y o'qlarida</p>
              <p className="text-purple-400 mt-1">Ligandlar yo'nalishida</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">2 ta tugun</p>
              <p className="text-purple-300">xz, yz (45° da)</p>
              <p className="text-purple-400 mt-1">Diagonal tekisliklar</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">+0.6Δ₀</p>
              <p className="text-purple-300">e_g guruhi</p>
              <p className="text-purple-400 mt-1">Eng yuqori energiya!</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">σ-antibog'</p>
              <p className="text-purple-300">Ligand bilan to'g'ridan-to'g'ri</p>
              <p className="text-purple-400 mt-1">Kuchli itarilish</p>
            </div>
          </div>
        </div>

        {/* 3D KO'RINISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Dx2y23D />
        </div>

        {/* LIGAND BILAN TA'SIRLASHUV */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <LigandTasirlashuv />
        </div>

        {/* dx²−y² vs dxy */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Dx2y2vsDxy />
        </div>

        {/* MATEMATIK IFODA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Matematik ifoda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold text-sm mb-3">To'lqin funksiyasi</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Dekart:</p>
                  <p className="font-mono text-purple-200 text-sm">ψ_dx²−y² ∝ (x² − y²) · f(r)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Sferik:</p>
                  <p className="font-mono text-purple-200 text-xs">Y(θ,φ) = √(15/16π) · sin²θ · cos(2φ)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Maksimum:</p>
                  <p className="text-purple-200">θ = 90°, φ = 0°, 90°, 180°, 270° (o'qlar)</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold text-sm mb-3">dxy dan farqi</h3>
              <ul className="text-purple-200 text-xs space-y-2">
                <li>• <strong>dxy:</strong> ψ ∝ xy = r²sin²θ·sinφ·cosφ ∝ <strong>sin(2φ)</strong></li>
                <li>• <strong>dx²−y²:</strong> ψ ∝ x²−y² = r²sin²θ·(cos²φ−sin²φ) ∝ <strong>cos(2φ)</strong></li>
                <li>• <strong>Farq:</strong> sin(2φ) vs cos(2φ) — 45° faza siljishi</li>
                <li>• <strong>Natija:</strong> dxy o'qlar orasida, dx²−y² o'qlar ustida</li>
              </ul>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>dx²−y² — <strong className="text-pink-400">oktaedrik maydonda eng yuqori energiyali orbital</strong> (+0.6Δ₀)</li>
            <li>Bo'laklari <strong className="text-pink-400">to'g'ridan-to'g'ri x va y o'qlarida</strong> — ligandlar yo'nalishida</li>
            <li>dxy dan <strong className="text-pink-400">45° ga burilgan</strong> — bu kichik farq energiyada katta farq yaratadi</li>
            <li><strong className="text-pink-400">σ-antibog'lovchi</strong> — ligandlar bilan kuchli itarilish</li>
            <li><strong className="text-pink-400">Jahn-Teller effektida</strong> asosiy orbital (d⁹, d⁷ LS)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dz2" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← dz²</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/taqqoslash" className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl hover:opacity-90 text-white font-semibold">Taqqoslash →</Link>
        </div>

      </section>
    </main>
  )
}