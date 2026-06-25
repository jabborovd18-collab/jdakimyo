"use client"

import Link from "next/link"
import { useState } from "react"

export default function TugunTekisliklari() {
  const [selectedOrb, setSelectedOrb] = useState("dxy")

  const orbitallar = {
    dxy: {
      nomi: "dxy", color: "text-red-400", bg: "bg-red-600/10", border: "border-red-500/30",
      tugunTekisliklari: [
        { name: "xz tekisligi", equation: "y = 0", desc: "Butun xz tekisligi bo'ylab ψ = 0. Bu tekislikda elektron zichligi nolga teng." },
        { name: "yz tekisligi", equation: "x = 0", desc: "Butun yz tekisligi bo'ylab ψ = 0. x va y o'qlarining o'zi tugun chiziqlari." }
      ],
      tugunSoni: "2 ta burchak tuguni, 0 ta radial tugun",
      formula: "ψ ∝ xy → x=0 yoki y=0 bo'lganda ψ=0",
      note: "dxy orbital uchun o'qlarning o'zi tugun tekisliklari. Bo'laklar o'qlar orasida 45° da joylashgan."
    },
    dxz: {
      nomi: "dxz", color: "text-green-400", bg: "bg-green-600/10", border: "border-green-500/30",
      tugunTekisliklari: [
        { name: "xy tekisligi", equation: "z = 0", desc: "Butun xy tekisligi bo'ylab ψ = 0." },
        { name: "yz tekisligi", equation: "x = 0", desc: "Butun yz tekisligi bo'ylab ψ = 0." }
      ],
      tugunSoni: "2 ta burchak tuguni, 0 ta radial tugun",
      formula: "ψ ∝ xz → x=0 yoki z=0 bo'lganda ψ=0",
      note: "dxz orbital dxy dan farqli o'laroq x va z o'qlarida tugunlarga ega."
    },
    dyz: {
      nomi: "dyz", color: "text-blue-400", bg: "bg-blue-600/10", border: "border-blue-500/30",
      tugunTekisliklari: [
        { name: "xy tekisligi", equation: "z = 0", desc: "Butun xy tekisligi bo'ylab ψ = 0." },
        { name: "xz tekisligi", equation: "y = 0", desc: "Butun xz tekisligi bo'ylab ψ = 0." }
      ],
      tugunSoni: "2 ta burchak tuguni, 0 ta radial tugun",
      formula: "ψ ∝ yz → y=0 yoki z=0 bo'lganda ψ=0",
      note: "dyz orbital dxz ning YZ tekisligidagi analogi."
    },
    dz2: {
      nomi: "dz²", color: "text-orange-400", bg: "bg-orange-600/10", border: "border-orange-500/30",
      tugunTekisliklari: [
        { name: "Konus 1", equation: "θ = 54.7°", desc: "3cos²θ−1 = 0 → cosθ = 1/√3 → θ = 54.7°. Bu burchakda tugun konusi hosil bo'ladi." },
        { name: "Konus 2", equation: "θ = 125.3°", desc: "Pastki yarim sharda simmetrik tugun konusi." }
      ],
      tugunSoni: "2 ta tugun konusi (tekislik emas!), 0 ta radial tugun",
      formula: "ψ ∝ (3cos²θ−1) → cosθ = ±1/√3 bo'lganda ψ=0",
      note: "dz² orbital uchun tugunlar tekislik emas, balki KONUS shaklida. Bu — 'sehrli burchak' (magic angle)."
    },
    dx2y2: {
      nomi: "dx²−y²", color: "text-pink-400", bg: "bg-pink-600/10", border: "border-pink-500/30",
      tugunTekisliklari: [
        { name: "Diagonal tekislik 1", equation: "x = y (45° da)", desc: "xz va yz tekisliklari 45° ga burilgan. x=y bo'lganda ψ=0." },
        { name: "Diagonal tekislik 2", equation: "x = −y (−45° da)", desc: "Ikkinchi diagonal tekislik. x=−y bo'lganda ψ=0." }
      ],
      tugunSoni: "2 ta burchak tuguni, 0 ta radial tugun",
      formula: "ψ ∝ (x²−y²) → x=±y bo'lganda ψ=0",
      note: "dx²−y² tugunlari dxy dan 45° ga burilgan. Bo'laklar o'qlar ustida."
    }
  }

  const o = orbitallar[selectedOrb]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="text-purple-400 hover:text-purple-300">d-orbitallar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">Tugun tekisliklari</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📐 Tugun tekisliklari va burchak tugunlari</h1>
          <p className="text-purple-400 text-sm">Radial tugunlar • Burchak tugunlari • Sehrli burchak • ψ = 0 sirtlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Tugunlar — elektron zichligi nolga teng bo'lgan sirtlar</h2>
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tugun (node)</strong> — to'lqin funksiyasi ψ = 0 bo'lgan 
              fazoviy nuqtalar to'plami. d-orbitallar uchun tugunlar ikki turga bo'linadi:
              <strong> radial tugunlar</strong> (r ga bog'liq) va <strong>burchak tugunlari</strong> (θ, φ ga bog'liq).
              3d orbitallar uchun radial tugunlar soni = <strong>n−l−1 = 3−2−1 = 0</strong>.
              Barcha tugunlar <strong>burchak tugunlari</strong> — tekislik yoki konus shaklida.
            </p>
          </div>
        </div>

        {/* ORBITAL TANLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Orbital tanlang</h2>
          <div className="flex gap-2 flex-wrap mb-6">
            {Object.entries(orbitallar).map(([key, val]) => (
              <button
                key={key}
                onClick={() => setSelectedOrb(key)}
                className={`px-4 py-2 rounded-lg text-sm font-bold font-mono transition-colors ${
                  selectedOrb === key 
                    ? `${val.bg} ${val.color} border ${val.border}` 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}
              >
                {val.nomi}
              </button>
            ))}
          </div>

          <div className={`rounded-xl p-5 border ${o.border} ${o.bg}`}>
            <h3 className={`font-bold text-xl mb-4 ${o.color}`}>{o.nomi} orbital — tugunlari</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {o.tugunTekisliklari.map((t, i) => (
                <div key={i} className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-yellow-400 font-bold mb-1">{t.name}</p>
                  <p className="font-mono text-purple-300 mb-1">{t.equation}</p>
                  <p className="text-purple-200">{t.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-purple-400">Tugunlar soni</p>
                <p className={o.color}>{o.tugunSoni}</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-purple-400">Formula</p>
                <p className="font-mono text-purple-200">{o.formula}</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-purple-400">Izoh</p>
                <p className="text-purple-200">{o.note}</p>
              </div>
            </div>
          </div>
        </div>

        {/* UMUMIY NAZARIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 Radial va burchak tugunlari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Radial tugunlar</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                <li>• <strong>Soni:</strong> n − l − 1</li>
                <li>• <strong>3d uchun:</strong> 3−2−1 = <strong>0</strong> (radial tugun yo'q)</li>
                <li>• <strong>4d uchun:</strong> 4−2−1 = <strong>1</strong> (1 ta radial tugun)</li>
                <li>• <strong>Shakli:</strong> Sferik sirtlar (r = const)</li>
                <li>• Radial tugunlar orbitalning <strong>o'lchamini</strong> belgilaydi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Burchak tugunlari</h3>
              <ul className="text-purple-200 space-y-2 text-xs">
                <li>• <strong>Soni:</strong> l (orbital kvant soni)</li>
                <li>• <strong>d-orbital uchun:</strong> l=2 → <strong>2 ta burchak tuguni</strong></li>
                <li>• <strong>Shakli:</strong> Tekislik (dxy, dxz, dyz, dx²−y²) yoki konus (dz²)</li>
                <li>• Burchak tugunlari orbitalning <strong>shaklini</strong> belgilaydi</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 mt-4 text-xs">
            <p className="text-yellow-400 font-bold mb-1">💡 Jami tugunlar soni:</p>
            <p className="text-purple-200">
              <strong>Jami = n − 1</strong>. 3d uchun: 3−1 = <strong>2 ta tugun</strong>.
              Barchasi burchak tugunlari (radial tugunlar soni 0).
              4d uchun: 4−1 = <strong>3 ta tugun</strong> (2 burchak + 1 radial).
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli/taqqoslash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Taqqoslash</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">d-orbital energiyasi →</Link>
        </div>

      </section>
    </main>
  )
}