"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// dxz 3D TASVIR INTERAKTIV
// ============================================================================
function Dxz3D() {
  const [view, setView] = useState("angle1")
  
  const views = {
    angle1: {
      name: "XZ tekisligidan ko'rinish (yondan)",
      desc: "4 ta bo'lak x va z o'qlari orasida 45° burchak ostida. x va z o'qlarining o'zi tugun tekisliklari. dxy bilan bir xil shaklga ega, faqat fazoviy yo'nalishi boshqacha.",
      color: "text-green-400"
    },
    angle2: {
      name: "XY tekisligidan ko'rinish (yuqoridan)",
      desc: "XY tekisligi tugun tekisligi hisoblanadi — bu tekislikda orbital faqat chiziq ko'rinishida (x o'qi bo'ylab).",
      color: "text-green-400"
    },
    angle3: {
      name: "3D ko'rinish (izometrik)",
      desc: "dxz orbital — dxy ning 90° ga burilgan varianti. Bo'laklar xz tekisligida, y o'qi tugun chizig'i.",
      color: "text-green-400"
    }
  }

  const v = views[view]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 dxz — fazoviy ko'rinishlar</h3>
      
      <div className="flex gap-2 flex-wrap">
        {Object.entries(views).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              view === key ? "bg-green-600/80 text-white" : "bg-purple-800/40 text-purple-300"
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
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-500/50"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-500/50"></div>
                <span className="absolute top-1/2 right-0 text-xs text-gray-500 -mt-4 mr-1">x</span>
                <span className="absolute left-1/2 top-0 text-xs text-gray-500 -ml-4 -mt-1">z</span>
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/60 rounded-full blur-sm transform rotate-45 scale-75"></div>
                  <span className="absolute top-1 right-1 text-xs text-white font-bold">+</span>
                  <div className="absolute top-0 left-0 w-16 h-16 bg-blue-500/60 rounded-full blur-sm transform -rotate-45 scale-75"></div>
                  <span className="absolute top-1 left-1 text-xs text-white font-bold">−</span>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-green-500/60 rounded-full blur-sm transform rotate-45 scale-75"></div>
                  <span className="absolute bottom-1 left-1 text-xs text-white font-bold">+</span>
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-blue-500/60 rounded-full blur-sm transform -rotate-45 scale-75"></div>
                  <span className="absolute bottom-1 right-1 text-xs text-white font-bold">−</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-purple-400 text-xs mt-2">dxz orbital — XZ tekisligida</p>
        </div>

        <div className="rounded-lg p-4 bg-green-600/10 border border-green-500/30">
          <h4 className="font-bold text-sm mb-2 text-green-400">{v.name}</h4>
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
// ASOSIY SAHIFA
// ============================================================================
export default function Dxz() {
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
          <span className="text-green-400">dxz</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🟢 dxz orbital</h1>
          <p className="text-purple-400 text-sm">To'rt bo'lakli • XZ tekisligida • t₂g guruhi • dyz bilan degenerat</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-green-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl font-extrabold font-mono bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">dxz</span>
            <div>
              <h2 className="text-xl font-bold text-white">dxz orbital — XZ tekisligida, o'qlar orasida</h2>
              <p className="text-purple-400">Burchak momenti l=2, magnit kvant soni mₗ = ±1</p>
            </div>
          </div>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">dxz</strong> — 5 ta d-orbitaldan biri.
              <strong> dxy bilan bir xil shaklga</strong> ega, lekin XZ tekisligida joylashgan.
              4 ta bo'lagi x va z o'qlari orasida 45° burchak ostida.
              <strong> dyz bilan degenerat juftlik</strong> hosil qiladi — 
              ikkalasi ham bir xil energiyaga ega. Oktaedrik maydonda 
              <strong className="text-green-400">t₂g guruhiga</strong> kiradi (−0.4Δ₀).
              π-bog'lanishda dyz bilan birgalikda ishtirok etadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">4 ta bo'lak</p>
              <p className="text-purple-300">XZ tekisligida</p>
              <p className="text-purple-400 mt-1">x va z o'qlari orasida 45° burchak ostida</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">2 ta tugun</p>
              <p className="text-purple-300">xy va yz tekisliklari</p>
              <p className="text-purple-400 mt-1">Bu tekisliklarda elektron zichligi = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">−0.4Δ₀</p>
              <p className="text-purple-300">t₂g guruhi (stabillashgan)</p>
              <p className="text-purple-400 mt-1">dyz bilan degenerat</p>
            </div>
          </div>
        </div>

        {/* 3D KO'RINISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Dxz3D />
        </div>

        {/* TUGUN VA MATEMATIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Tugun tekisliklari va matematik ifoda</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-3">Tugun tekisliklari</h3>
              <ul className="text-purple-200 text-xs space-y-2">
                <li>• <strong>xy tekisligi (z=0):</strong> Butun tekislik bo'ylab ψ = 0</li>
                <li>• <strong>yz tekisligi (x=0):</strong> Butun tekislik bo'ylab ψ = 0</li>
                <li>• <strong>Jami:</strong> 2 ta burchak tuguni</li>
                <li>• <strong>Radial tugunlar:</strong> 0 (3d orbital)</li>
              </ul>
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 mt-3 text-xs">
                <p className="text-yellow-400 font-bold">💡 dxz vs dxy:</p>
                <p className="text-purple-200">dxz ning tugun tekisliklari dxy dan farq qiladi (xy va yz vs xz va yz). Bu ularning fazoviy yo'nalishini belgilaydi.</p>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-3">Matematik ifoda</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Dekart:</p>
                  <p className="font-mono text-purple-200">ψ_dxz ∝ xz · f(r)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Sferik:</p>
                  <p className="font-mono text-purple-200">ψ ∝ sinθ·cosθ·cosφ · R(r)</p>
                </div>
                <div className="bg-purple-900/50 rounded p-3">
                  <p className="text-purple-300">Maksimum:</p>
                  <p className="text-purple-200">θ = 45°, φ = 0°, 180°</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* dyz BILAN MUNOSABAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 dxz va dyz — degenerat juftlik</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-yellow-400">dxz va dyz orbitallar</strong> — 
              oktaedrik maydonda <strong>degenerat juftlik</strong> hosil qiladi.
              Ularning ikkalasi ham bir xil energiyaga ega (−0.4Δ₀) va 
              bir xil simmetriyaga ega (t₂g). Ular <strong>π-bog'lanishda</strong> 
              birgalikda ishtirok etadi — ligandlarning π-orbitallari bilan 
              kombinatsiyalanadi.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs text-center">
              <div className="bg-purple-900/50 rounded p-3">
                <p className="text-red-400 font-mono font-bold">dxy</p>
                <p className="text-purple-300">XY tekisligi</p>
                <p className="text-purple-400">xz, yz tugunlar</p>
              </div>
              <div className="bg-purple-900/50 rounded p-3 border border-green-500/30">
                <p className="text-green-400 font-mono font-bold">dxz</p>
                <p className="text-purple-300">XZ tekisligi</p>
                <p className="text-purple-400">xy, yz tugunlar</p>
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <p className="text-blue-400 font-mono font-bold">dyz</p>
                <p className="text-purple-300">YZ tekisligi</p>
                <p className="text-purple-400">xy, xz tugunlar</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>dxz — <strong className="text-green-400">dxy bilan bir xil shakl</strong>, XZ tekisligida joylashgan</li>
            <li><strong className="text-green-400">2 ta tugun tekisligi:</strong> xy va yz</li>
            <li>Oktaedrik maydonda <strong className="text-green-400">t₂g guruhida (−0.4Δ₀)</strong> — stabillashgan</li>
            <li><strong className="text-green-400">dyz bilan degenerat</strong> — bir xil energiyaga ega</li>
            <li>Matematik ifoda: <strong className="text-green-400">ψ ∝ xz · f(r)</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dxy" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← dxy</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/dyz" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:opacity-90 text-white font-semibold">dyz →</Link>
        </div>

      </section>
    </main>
  )
}