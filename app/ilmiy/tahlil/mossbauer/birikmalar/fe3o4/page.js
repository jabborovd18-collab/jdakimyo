"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SEXTET SPEKTR SIMULYATORI (Fe₃O₄ — MAGNIT BO'LINISH)
// ============================================================================
function SextetSimulator() {
  const [delta, setDelta] = useState(0.25)
  const [deltaQ, setDeltaQ] = useState(0.10)
  const [H, setH] = useState(46.0)
  const [linewidth, setLinewidth] = useState(0.25)
  const [showFe25, setShowFe25] = useState(true)

  // Sekstet simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    const vMin = -12
    const vMax = 12
    const steps = 500

    // O'rtacha 46 T maydon uchun taxminiy cho'qqi pozitsiyalari (mm/s)
    // Fe₃O₄ uchun xarakterli: 6 ta chiziq
    // Oddiy model: H = 46 T → ~5.5 mm/s oraliqda
    const sextetPositions = [
      delta - deltaQ/2 - 5.5, // 1-chi (3)
      delta - deltaQ/2 - 2.5, // 2-chi (2)
      delta - deltaQ/2 - 0.5, // 3-chi (1)
      delta + deltaQ/2 + 0.5, // 4-chi (1)
      delta + deltaQ/2 + 2.5, // 5-chi (2)
      delta + deltaQ/2 + 5.5  // 6-chi (3)
    ]
    const intensities = [3, 2, 1, 1, 2, 3]

    for (let i = 0; i <= steps; i++) {
      const v = vMin + (i / steps) * (vMax - vMin)
      let absorption = 0
      const halfWidth = linewidth / 2

      for (let j = 0; j < 6; j++) {
        const lorentz = intensities[j] / (1 + Math.pow((v - sextetPositions[j]) / halfWidth, 2))
        absorption += lorentz
      }

      points.push({ v, y: absorption / 3.0 }) // Normalize
    }
    return points
  }, [delta, deltaQ, H, linewidth])

  const maxY = Math.max(...spectrum.map(p => p.y), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 Mössbauer spektr simulyatori — Fe₃O₄ (Sekstet)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-bold mb-2">💎 Fe₃O₄ ning o'ziga xosligi:</p>
          <p className="text-purple-200 text-xs">
            Magnetit — <strong>ferrimagnit</strong> material. Xona haroratida (300 K) <strong>kuchli ichki magnit maydon</strong>
            (H ≈ 46 Tesla) ta'sirida yadro sathlari Zeeman bo'linishiga uchraydi. Natijada
            <strong> 6 ta chiziqdan iborat sekstet</strong> hosil bo'ladi.
            <br/>
            Nisbiy intensivliklar: <strong>3 : 2 : 1 : 1 : 2 : 3</strong>.
          </p>
        </div>

        {/* SLIDERLAR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">δ (izomer siljish):</span>
                <span className="text-teal-400 font-mono">{delta.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="-0.5" max="1.0" step="0.01" value={delta}
                onChange={(e) => setDelta(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">ΔE<sub>Q</sub> (kvadrupol):</span>
                <span className="text-teal-400 font-mono">{deltaQ.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0" max="0.5" step="0.01" value={deltaQ}
                onChange={(e) => setDeltaQ(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">H (ichki maydon):</span>
                <span className="text-teal-400 font-mono">{H.toFixed(1)} T</span>
              </label>
              <input type="range" min="30" max="55" step="0.1" value={H}
                onChange={(e) => setH(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400 font-bold">Γ (kenglik):</span>
                <span className="text-teal-400 font-mono">{linewidth.toFixed(2)} mm/s</span>
              </label>
              <input type="range" min="0.15" max="0.6" step="0.01" value={linewidth}
                onChange={(e) => setLinewidth(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-teal-500" />
            </div>
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-teal-400 font-bold text-xs mb-2">Mössbauer spektri (Sekstet):</h5>
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="195" fill="#c4b5fd" fontSize="9" textAnchor="middle">v (mm/s)</text>
            <text x="40" y="195" fill="#a78bfa" fontSize="8">-12</text>
            <text x="380" y="195" fill="#a78bfa" fontSize="8" textAnchor="end">+12</text>
            <text x="20" y="95" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 95)">
              Yutilish
            </text>

            {/* 6 ta chiziqni belgilash */}
            <line x1={40 + ((-5.3 + 12) / 24) * 340} y1="170" x2={40 + ((-5.3 + 12) / 24) * 340} y2="30" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((-5.3 + 12) / 24) * 340} y="25" fill="#fbbf24" fontSize="7" textAnchor="middle">3</text>
            
            <line x1={40 + ((-2.3 + 12) / 24) * 340} y1="170" x2={40 + ((-2.3 + 12) / 24) * 340} y2="50" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((-2.3 + 12) / 24) * 340} y="45" fill="#fbbf24" fontSize="7" textAnchor="middle">2</text>

            <line x1={40 + ((-0.3 + 12) / 24) * 340} y1="170" x2={40 + ((-0.3 + 12) / 24) * 340} y2="70" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((-0.3 + 12) / 24) * 340} y="65" fill="#fbbf24" fontSize="7" textAnchor="middle">1</text>
            
            {/* O'ng tomon simmetrik */}
            <line x1={40 + ((0.3 + 12) / 24) * 340} y1="170" x2={40 + ((0.3 + 12) / 24) * 340} y2="70" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((0.3 + 12) / 24) * 340} y="65" fill="#fbbf24" fontSize="7" textAnchor="middle">1</text>
            
            <line x1={40 + ((2.3 + 12) / 24) * 340} y1="170" x2={40 + ((2.3 + 12) / 24) * 340} y2="50" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((2.3 + 12) / 24) * 340} y="45" fill="#fbbf24" fontSize="7" textAnchor="middle">2</text>

            <line x1={40 + ((5.3 + 12) / 24) * 340} y1="170" x2={40 + ((5.3 + 12) / 24) * 340} y2="30" stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((5.3 + 12) / 24) * 340} y="25" fill="#fbbf24" fontSize="7" textAnchor="middle">3</text>

            {/* Spektr chizig'i */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / spectrum.length) * 340
                const y = 170 - (p.y / maxY) * 140
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#14b8a6" strokeWidth="2"
            />

            <text x="200" y="15" fill="#14b8a6" fontSize="10" textAnchor="middle" fontWeight="bold">
              SEKTET (H = {H.toFixed(1)} T)
            </text>
          </svg>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Sekstet intensivligi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li>Chiziqlar nisbati: <strong>3 : 2 : 1 : 1 : 2 : 3</strong></li>
            <li>Tashqi chiziqlar (1 va 6) eng kuchli</li>
            <li>Ichki chiziqlar (3 va 4) eng kuchsiz</li>
            <li>Bo'linish masofasi → <strong>H</strong> (maydon kuchiga proporsional)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. ARLASH VALENTLI VA VERWEY O'TISHI
// ============================================================================
function VerweyTransition() {
  const [T, setT] = useState(300)
  const isAboveTV = T > 120

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌡️ Verwey o'tishi — Aralash valentli holat</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-lg p-4">
          <p className="text-indigo-400 font-bold mb-2">💎 Noyob hodisa:</p>
          <p className="text-purple-200 text-xs">
            Fe₃O₄ — <strong>aralash valentli</strong> birikma (Fe²⁺ va Fe³⁺ birga).
            <strong>120 K</strong> da (Verwey harorati) faza o'tishi sodir bo'ladi.
            T &gt; 120 K da elektronlar Fe²⁺ va Fe³⁺ o'rtasida tez almashinadi (hopping) —
            Mössbauer bitta <strong>o'rtacha Fe².⁵⁺</strong> ni ko'radi.
            T &lt; 120 K da elektronlar joylashadi — aniq Fe²⁺ va Fe³⁺ signallari paydo bo'ladi.
          </p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Harorat (T):</span>
            <span className={`font-mono font-bold ${isAboveTV ? "text-red-400" : "text-blue-400"}`}>
              {T} K
            </span>
          </label>
          <input type="range" min="50" max="300" step="1" value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-indigo-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>50 K (T &lt; T_v)</span>
            <span className="text-indigo-400">T_v ≈ 120 K</span>
            <span>300 K (T &gt; T_v)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className={`rounded-lg p-4 ${isAboveTV ? "bg-indigo-600/30 border border-indigo-500/50" : "bg-purple-900/30"}`}>
            <p className="text-indigo-400 font-bold mb-2">T &gt; 120 K</p>
            <p className="text-xs text-purple-200">
              <strong>Tez elektron almashinuvi</strong><br/>
              Mössbauer: <span className="text-indigo-400 font-bold">Bitta Fe².⁵⁺</span><br/>
              (Fe²⁺ va Fe³⁺ farqlanmaydi)
            </p>
          </div>
          <div className={`rounded-lg p-4 ${!isAboveTV ? "bg-indigo-600/30 border border-indigo-500/50" : "bg-purple-900/30"}`}>
            <p className="text-indigo-400 font-bold mb-2">T &lt; 120 K</p>
            <p className="text-xs text-purple-200">
              <strong>Elektronlar joylashadi</strong><br/>
              Mössbauer: <span className="text-indigo-400 font-bold">Aniq Fe²⁺ va Fe³⁺</span><br/>
              (A va B joylari farqlanadi)
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Strukturasi — Invers spinel:</p>
          <p className="text-purple-200">
            Fe³⁺[Fe²⁺Fe³⁺]O₄<br/>
            • <strong>Tetraedrik (A) joylar:</strong> faqat Fe³⁺<br/>
            • <strong>Oktaedrik (B) joylar:</strong> aralash Fe²⁺ va Fe³⁺ (almashinuvchi)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. ICHKI MAGNIT MAYDON
// ============================================================================
function InternalMagneticField() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 Ichki magnit maydon (H ≈ 46 T)</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-teal-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-5">
            <h4 className="text-red-400 font-bold mb-3">Nega maydon bunchalik kuchli?</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Ferrimagnit tartib</strong></li>
              <li>✓ <strong>Yuqori Kyuri harorati</strong> (T_C = 858 K)</li>
              <li>✓ <strong>Ko'p sonli toq elektronlar</strong></li>
              <li>✓ <strong>Fermi kontakt o'zaro ta'siri</strong></li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Taqqoslash:</p>
              <p className="text-red-400 text-xs font-mono">Yer yuzi maydoni: ~50 μT</p>
              <p className="text-red-400 text-xs font-mono">Fe₃O₄ ichki maydoni: 46,000,000 μT!</p>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-teal-400 font-bold mb-3">Spektrga ta'siri</h4>
            <ul className="text-purple-200 text-xs space-y-2">
              <li>✓ <strong>Katta bo'linish:</strong> 1- va 6-chi chiziqlar orasi ~11 mm/s</li>
              <li>✓ <strong>Aynan simmetrik:</strong> 3:2:1:1:2:3 nisbat</li>
              <li>✓ <strong>Kichik kengayish:</strong> maydon yagona</li>
            </ul>
            <div className="mt-3 bg-purple-900/50 rounded p-2">
              <p className="text-purple-400 text-[10px]">Xulosa:</p>
              <p className="text-teal-400 text-xs font-mono">Sekstet — magnit tartiblanganlik belgisi</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 A va B joylari:</p>
          <p className="text-purple-200">
            Fe₃O₄ da ikki xil kristallografik joy mavjud.
            <br/>• <strong>A joylari</strong> (Tetraedrik): Fe³⁺, H ≈ 49 T
            <br/>• <strong>B joylari</strong> (Oktaedrik): Fe².⁵⁺, H ≈ 46 T
            <br/>
            Xona haroratida spektr bu ikki komponentning aralashmasi (ko'pincha bitta keng sekstet sifatida ko'rinadi).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. TARIXIY VA AMALIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Magnetit — tabiatning mo''jizasi</h3>

      <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 rounded-xl p-5 border border-red-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧲</div>
              <div>
                <p className="text-yellow-400 font-bold">Qadim zamon — Magnit tosh</p>
                <p className="text-purple-200 text-xs mt-1">
                  Fe₃O₄ — tabiiy magnit xususiyatiga ega yagona keng tarqalgan mineral.
                  Qadimda <strong>kompass ixtiro qilinishiga</strong> sabab bo'lgan.
                  Magnesiya (Gretsiya) sharafiga "Magnetit" deb atalgan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">1939 — Verwey o'tishi</p>
                <p className="text-purple-200 text-xs mt-1">
                  E.J.W. Verwey 120 K da o'tkazuvchanlik va strukturaviy o'zgarishni kashf etdi.
                  Bu <strong>aralash valentli sistemalardagi elektron tartiblanishi</strong>ning klassik namunasi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🌍</div>
              <div>
                <p className="text-yellow-400 font-bold">Biologik ahamiyat</p>
                <p className="text-purple-200 text-xs mt-1">
                  Ba'zi bakteriyalar (<strong>Magnetotactic bacteria</strong>) va hatto
                  <strong> kaptarlar</strong> boshida Magnetit kristallari bor. Ular Yer magnit maydonini his qilish uchun ishlatadi!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Amaliy qo'llanilishi:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Ferritlar</strong> — transformatorlar, induktorlar</li>
            <li><strong>Magnit yozuv</strong> — qattiq disklar (eski)</li>
            <li><strong>MRI kontrast</strong> — superparamagnit nanopartikullar</li>
            <li><strong>Bo'yoqlar</strong> — qora pigment</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function Fe3O4Mossbauer() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/mossbauer" className="text-purple-400 hover:text-purple-300">Mössbauer</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-400">Fe₃O₄</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">⚛️ Fe₃O₄ — Mössbauer tahlili</h1>
          <p className="text-purple-400 text-sm">
            Fe²⁺/Fe³⁺ aralash • H ≈ 46 T • Ferrimagnit • Sekstet • Verwey o'tishi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-purple-400">Fe₃O₄</span>
            <div>
              <h2 className="text-xl font-bold text-white">Mössbauer tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Magnetit" — tabiiy magnit, aralash valentli</p>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Fe₃O₄ — <strong className="text-purple-400">aralash valentli temir oksidi</strong> (Fe²⁺ va Fe³⁺ birgalikda).
              Strukturasi — <strong>invers spinel</strong>: Fe³⁺[Fe²⁺Fe³⁺]O₄.
              Ferrimagnit modda, Kyuri harorati T_C = 858 K.
              Mössbauer spektri — <strong>sekstet</strong> (6 ta chiziq), chunki ichki magnit maydon juda kuchli (~46 Tesla).
              120 K da <strong>Verwey o'tishi</strong> — elektron tartiblanishi o'zgaradi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Aralash</p>
              <p className="text-purple-300">Fe²⁺/Fe³⁺</p>
              <p className="text-purple-400 mt-1">S = murakkab</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">δ ≈ 0.25</p>
              <p className="text-purple-300">mm/s (o'rtacha)</p>
              <p className="text-purple-400 mt-1">izomer siljish</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">H ≈ 46</p>
              <p className="text-purple-300">Tesla</p>
              <p className="text-purple-400 mt-1">ichki maydon</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Sekstet</p>
              <p className="text-purple-300">6 cho'qqi</p>
              <p className="text-purple-400 mt-1">spektr turi</p>
            </div>
          </div>
        </div>

        {/* SEXTET SIMULYATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SextetSimulator />
        </div>

        {/* VERWEY O'TISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <VerweyTransition />
        </div>

        {/* MAGNIT MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <InternalMagneticField />
        </div>

        {/* TARIXIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Fe₃O₄ — <strong className="text-purple-400">aralash valentli</strong> (Fe²⁺ va Fe³⁺)</li>
            <li>Spektr — <strong>sekstet</strong> (6 chiziq, 3:2:1:1:2:3 nisbat)</li>
            <li>Sababi — kuchli ichki magnit maydon (<strong>H ≈ 46 Tesla</strong>)</li>
            <li><strong>Verwey o'tishi (120 K)</strong> — elektron almashinuvi to'xtaydi</li>
            <li>T &gt; 120 K → <strong>Fe².⁵⁺</strong> (bitta o'rtacha holat)</li>
            <li>T &lt; 120 K → <strong>Fe²⁺ va Fe³⁺</strong> aniq ajraladi</li>
            <li>Invers spinel tuzilishi — Fe³⁺(A)[Fe²⁺Fe³⁺](B)O₄</li>
            <li>Ferrimagnit — magnit momentlar qarama-qarshi, lekin teng emas</li>
            <li>Mössbauer — <strong>magnit tartib va valentlikni</strong> aniq ko'rsatadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Fe(CO)₅]
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">
            Mössbauer birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}