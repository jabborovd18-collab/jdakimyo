"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Zn²⁺ d¹⁰)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Formula:</p>
          <p className="text-yellow-400 text-xl">μ<sub>so</sub> = √[n(n+2)] μ<sub>B</sub></p>
        </div>

        <div>
          <label className="flex justify-between text-xs mb-2">
            <span className="text-yellow-400 font-bold">Toq elektronlar soni (n):</span>
            <span className="text-emerald-400 font-mono text-lg">{n}</span>
          </label>
          <input type="range" min="0" max="7" step="1" value={n}
            onChange={(e) => setN(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-green-500" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-green-900/40 border border-green-500/40 rounded-lg p-3">
            <p className="text-green-400">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [Zn(OH)₄]²⁻ uchun:</p>
          <p className="text-purple-200">
            Zn²⁺ — <strong>d¹⁰ konfiguratsiya</strong>. Barcha 5 ta d-orbital to'liq to'lgan.
            Hech qanday toq elektron yo'q → <strong>n = 0</strong>, S = 0.
            μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — <strong>mukammal diamagnit</strong>.
            Bu Cu⁺, Ag⁺, Cd²⁺, Hg²⁺ kabi barcha d¹⁰ ionlariga xos xususiyat.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. TETRAEDRIK 3D VIZUALIZATSIYA
// ============================================================================
function Tetrahedral3D() {
  const [rotate, setRotate] = useState(0)

  const ligands = [
    { x: 0, y: -1, z: 0, label: "OH⁻" },
    { x: 0.943, y: 0.333, z: 0, label: "OH⁻" },
    { x: -0.471, y: 0.333, z: 0.816, label: "OH⁻" },
    { x: -0.471, y: 0.333, z: -0.816, label: "OH⁻" }
  ]

  const project = (p, angle) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    const x = p.x * cos - p.z * sin
    const z = p.x * sin + p.z * cos
    return { x: 200 + x * 80, y: 140 + p.y * 80, z: z }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Tetraedrik geometriya — 3D ko'rinish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">Aylantirish burchagi:</span>
            <span className="text-emerald-400 font-mono">{rotate}°</span>
          </label>
          <input type="range" min="0" max="360" step="5" value={rotate}
            onChange={(e) => setRotate(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-green-500" />
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <circle cx="200" cy="140" r="20" fill="#22c55e" />
            <text x="200" y="146" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">Zn²⁺</text>

            {ligands.map((l, i) => {
              const proj = project(l, rotate * Math.PI / 180)
              const size = 14 + proj.z * 3
              return (
                <g key={i}>
                  <line x1="200" y1="140" x2={proj.x} y2={proj.y} stroke="#ef4444" strokeWidth="2" opacity="0.8" />
                  <circle cx={proj.x} cy={proj.y} r={size} fill="#ef4444" opacity="0.9" />
                  <text x={proj.x} y={proj.y + 4} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">OH</text>
                </g>
              )
            })}

            <text x="200" y="265" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              Burchak = 109.5° (T<sub>d</sub> simmetriya)
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Koordinatsion son</p>
            <p className="text-green-400 font-bold text-lg">4</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Burchak</p>
            <p className="text-green-400 font-bold text-lg">109.5°</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Simmetriya</p>
            <p className="text-green-400 font-bold text-lg">T<sub>d</sub></p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Zn²⁺ tetraedrik?</p>
          <p className="text-purple-200">
            d¹⁰ ionlar uchun <strong>Kristall Maydon Stabilizatsiyasi (CFSE) = 0</strong>.
            Geometriyani faqat <strong>sterik omillar</strong> (ligand-ligand itarish) belgilaydi.
            4 ta ligand uchun eng uzoq joylashuv — <strong>tetraedr</strong>.
            Shuning uchun Zn²⁺ deyarli doim tetraedrik (masalan, ZnS, ZnO).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. AMPHOTERISM SIMULATOR (Interaktiv)
// ============================================================================
function AmphoterismSimulator() {
  const [ohConc, setOhConc] = useState(0.1) // M
  // K_sp Zn(OH)2 approx 3e-17, K_f [Zn(OH)4]2- approx 2e15
  // Simple logic: low OH -> ppt, high OH -> soluble complex
  
  const state = useMemo(() => {
    if (ohConc < 0.5) return { type: "ion", label: "Zn²⁺ (erkin ion)", color: "text-blue-400", desc: "Kislotali muhit" }
    if (ohConc >= 0.5 && ohConc < 2.0) return { type: "ppt", label: "Zn(OH)₂ ↓ (oq cho'kma)", color: "text-white", desc: "Zaif ishqoriy" }
    return { type: "complex", label: "[Zn(OH)₄]²⁻ (eruvchi)", color: "text-green-400", desc: "Kuchli ishqoriy" }
  }, [ohConc])

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚗️ Amfoterlik — pH ga bog'liqlik</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Amfoter xususiyat:</p>
          <p className="text-purple-200 text-xs">
            Zn(OH)₂ — <strong>amfoter gidroksid</strong>. Ham kislota (H⁺), ham ishqor (OH⁻) bilan reaksiyaga kirishadi.
            [Zn(OH)₄]²⁻ — <strong>kuchli ishqoriy muhitda</strong> hosil bo'ladigan kompleks ion.
          </p>
        </div>

        {/* Simulator */}
        <div className="bg-purple-950/50 rounded-xl p-6 text-center">
          <div className={`text-2xl font-bold mb-2 ${state.color}`}>{state.label}</div>
          <p className="text-purple-400 text-sm mb-6">{state.desc}</p>

          {/* Visual representation */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-40 border-2 border-purple-700 rounded-b-lg bg-purple-900/20 overflow-hidden">
              {/* Liquid level */}
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500/20 h-full transition-all duration-500"></div>
              
              {/* Particles */}
              {state.type === "ion" && (
                <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-2">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
                  ))}
                </div>
              )}
              
              {state.type === "ppt" && (
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-white flex flex-wrap content-end justify-center">
                  {[...Array(20)].map((_, i) => (
                    <span key={i} className="w-2 h-2 bg-gray-200 rounded-full m-px"></span>
                  ))}
                </div>
              )}

              {state.type === "complex" && (
                <div className="absolute inset-0 flex flex-wrap content-center justify-center gap-2">
                  {[...Array(6)].map((_, i) => (
                    <span key={i} className="w-6 h-6 border-2 border-green-400 rounded-full flex items-center justify-center text-[8px] text-green-400">
                      Zn(OH)₄
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">[OH⁻] konsentratsiyasi:</span>
            <span className="text-emerald-400 font-mono">{ohConc.toFixed(1)} M</span>
          </label>
          <input type="range" min="0" max="5" step="0.1" value={ohConc}
            onChange={(e) => setOhConc(parseFloat(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-green-500" />
          
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>Kislotali</span>
            <span>Zaif ishqor</span>
            <span>Kuchli ishqor</span>
          </div>
        </div>

        {/* Reactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-purple-900/50 p-3 rounded border-l-4 border-blue-500">
            <p className="text-blue-400 font-bold mb-1">Kislota bilan:</p>
            <p className="text-purple-200">Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O</p>
          </div>
          <div className="bg-purple-900/50 p-3 rounded border-l-4 border-green-500">
            <p className="text-green-400 font-bold mb-1">Ishqor bilan:</p>
            <p className="text-purple-200">Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. BIOANORGANIK KIMYO (Zinc)
// ============================================================================
function BioZinc() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧬 Bioanorganik kimyo — Ruxning hayotiy roli</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">🌿 Zn²⁺ — hayot uchun zarur:</p>
          <p className="text-purple-200 text-xs">
            Rux (Zinc) — inson organizmidagi <strong>ikkinchi eng ko'p mikroelement</strong> (temirdan keyin).
            300 dan ortiq fermentlar tarkibiga kiradi. Zn²⁺ ning d¹⁰ konfiguratsiyasi uni
            <strong> Lewis kislotasi</strong> sifatida ishlatishga imkon beradi (redoks reaksiyalarida ishtirok etmaydi).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧬</div>
            <h4 className="text-green-400 font-bold mb-2">Zinc Fingers</h4>
            <p className="text-purple-200 text-xs">
              Oqsillardagi <strong>transkripsiya omillari</strong>.
              Zn²⁺ oqsilni "barmoq" shakliga keltiradi → DNK ga bog'lanish.
              Gen ekspressiyasini boshqaradi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-green-400 font-bold mb-2">Fermentlar</h4>
            <p className="text-purple-200 text-xs">
              <strong>Carbonic Anhydrase:</strong> CO₂ + H₂O ⇌ HCO₃⁻ + H⁺.
              Zn²⁺ suv molekulasini faollashtiradi (pKₐ ni pasaytiradi).
              Nafas olishda hal qiluvchi ahamiyatga ega.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🦷</div>
            <h4 className="text-green-400 font-bold mb-2">Immunitet va o'sish</h4>
            <p className="text-purple-200 text-xs">
              Hujayra bo'linishi, yarani bitkazish, ta'm bilish (gustin oqsili).
              Zn yetishmovchiligi — o'sishning to'xtashi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧠</div>
            <h4 className="text-green-400 font-bold mb-2">Neyrotransmissiya</h4>
            <p className="text-purple-200 text-xs">
              Miya sinapslarida Zn²⁺ saqlanadi.
              Xotira va o'rganish jarayonlarida modulyator sifatida ishlaydi.
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun Zn²⁺ fermentlar uchun ideal?</p>
          <p className="text-purple-200">
            1. <strong>Redoks-barqaror</strong> (d¹⁰, oksidlanmaydi/qaytarmaydi) — ferment buzilmaydi.
            2. <strong>Tez ligand almashinuvi</strong> (labil) — substrat tez kirib-chiqadi.
            3. <strong>Kuchli Lewis kislotasi</strong> — suvni faollashtiradi yoki substratni polarizatsiya qiladi.
            4. <strong>Diamagnit</strong> — EPR/NMR orqali o'rganish oson (paramagnit metallar kabi signalni buzmaydi).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. SOLISHTIRISH — d¹⁰ IONLARI
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 d¹⁰ ionlari — to'liq solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Ion</th>
                <th className="text-center py-3 px-2 text-yellow-400">Konfiguratsiya</th>
                <th className="text-center py-3 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-3 px-2 text-yellow-400">Magnit</th>
                <th className="text-left py-3 px-2 text-yellow-400">Misol</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Zn²⁺", "[Ar] 3d¹⁰", "Tetraedrik", "Diamagnit", "[Zn(OH)₄]²⁻, ZnS"],
                ["Cd²⁺", "[Kr] 4d¹⁰", "Tetraedrik/Okta", "Diamagnit", "[Cd(CN)₄]²⁻"],
                ["Hg²⁺", "[Xe] 4f¹⁴ 5d¹⁰", "Chiziqli", "Diamagnit", "[HgCl₂], [HgI₄]²⁻"],
                ["Cu⁺", "[Ar] 3d¹⁰", "Tetraedrik/Chiz.", "Diamagnit", "[Cu(CN)₄]³⁻"],
                ["Ag⁺", "[Kr] 4d¹⁰", "Chiziqli", "Diamagnit", "[Ag(NH₃)₂]⁺"],
                ["Au⁺", "[Xe] 4f¹⁴ 5d¹⁰", "Chiziqli", "Diamagnit", "[Au(CN)₂]⁻"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-green-600/10' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-green-400">{r[0]}</td>
                  <td className="py-2 px-2 text-center font-mono text-[10px]">{r[1]}</td>
                  <td className="py-2 px-2 text-center">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * d¹⁰ ionlari <strong>har doim diamagnit</strong>. Geometriya asosan ligand hajmi va zaryadga bog'liq.
          Og'irroq ionlar (Hg²⁺, Au⁺) ko'pincha chiziqli yoki past koordinatsion sonlarni hosil qiladi.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// 6. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Rux kimyosi</h3>

      <div className="bg-gradient-to-br from-green-900/30 to-purple-900/30 rounded-xl p-5 border border-green-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⚗️</div>
              <div>
                <p className="text-yellow-400 font-bold">Qadim zamon — Pirin (Bronza)</p>
                <p className="text-purple-200 text-xs mt-1">
                  Mis va rux qotishmasi (Pirin) miloddan avvalgi 1000 yillardan beri ishlatilgan.
                  Rux oksidi (tutiya) qadimgi Hindiston va Xitoyda metallurgiyada ma'lum bo'lgan.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🔬</div>
              <div>
                <p className="text-yellow-400 font-bold">1746 — Marggraf</p>
                <p className="text-purple-200 text-xs mt-1">
                  Nemis kimyogari <strong>Andreas Marggraf</strong> ruxni sof holda ajratib oldi.
                  Kalamin rudasini ko'mir bilan qizdirish orqali.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">💎</div>
              <div>
                <p className="text-yellow-400 font-bold">1940-60 — Bert Vallee</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Bert Vallee</strong> ruxning biologik ahamiyatini kashf etdi.
                  <strong>Carbonic Anhydrase</strong> fermentida Zn²⁺ borligini isbotladi.
                  Bu bioanorganik kimyo sohasining rivojlanishiga turtki berdi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 [Zn(OH)₄]²⁻ ning ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Sanoatda:</strong> Ruxni qayta ishlash (gidrometallurgiya)</li>
            <li><strong>Analitik kimyoda:</strong> Zn²⁺ ni aniqlash va ajratish</li>
            <li><strong>Biologiyada:</strong> Oqsil strukturasi va fermentativ kataliz</li>
            <li><strong>Geologiyada:</strong> Sulfidli rudalarning yuvilishi</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-green-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚗️</div>
            <h4 className="text-green-400 font-bold mb-2">Galvanizatsiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Temirni zanglashdan himoya qilish</li>
              <li>Zn qatlami — qurbon anod</li>
              <li>Avto sanoati, qurilish</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔋</div>
            <h4 className="text-green-400 font-bold mb-2">Batareyalar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Zn-MnO₂ (tuzli batareya)</li>
              <li>Zn-Ag (tugmacha batareya)</li>
              <li>Zn-havo batareyalari</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-green-400 font-bold mb-2">Tibbiyot</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Zink oksidi (krem, loson)</li>
              <li>Vitaminlar tarkibi</li>
              <li>Antiseptik (tutya)</li>
              <li>Immunitetni mustahkamlash</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-green-400 font-bold mb-2">Reagentlar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Rux kukuni (qaytaruvchi)</li>
              <li>Rux xlorid (yog'och konservant)</li>
              <li>Rux stearat (rezina ishlab chiqarish)</li>
            </ul>
          </div>
        </div>

        <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
          <p className="text-green-400 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Rux — <strong>o'tish metallari</strong> qatorida, lekin kimyosi boshqacha (d¹⁰)</li>
            <li>• <strong>Rux kasalligi</strong> — haddan tashqari ko'p rux iste'moli (mis yetishmovchiligiga olib keladi)</li>
            <li>• Dunyoda yiliga <strong>13 million tonna</strong> rux ishlab chiqariladi</li>
            <li>• Rux — <strong>qayta ishlash qobiliyati yuqori</strong> (100% qayta ishlanadi)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function ZnOH4Magnit() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/magnit" className="text-purple-400 hover:text-purple-300">Magnit</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/magnit/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-green-400">[Zn(OH)₄]²⁻</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧲 [Zn(OH)₄]²⁻ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Zn²⁺ (d¹⁰) • S=0 • Diamagnit • Tetraedrik • Amfoterlik • Bio-kataliz
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-green-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-green-400">[Zn(OH)₄]²⁻</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Tetragidroksosinkat(II)" — amfoterlik klassikasi</p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Zn(OH)₄]²⁻ — <strong className="text-green-400">amfoter rux gidroksidi</strong>ning kuchli ishqoriy muhitdagi eruvchan shakli.
              Zn²⁺ (d¹⁰) <strong>tetraedrik geometriyaga</strong> ega.
              Barcha d-orbitallar to'lgan → <strong>S = 0</strong>, <strong>diamagnit</strong>.
              μ<sub>eff</sub> = 0 μ<sub>B</sub>. Rux <strong>bioanorganik kimyoda</strong> muhim rol o'ynaydi
              (fermentlar, zinc finger).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">d¹⁰, S=0</p>
              <p className="text-purple-300">to'liq to'lgan</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">T<sub>d</sub></p>
              <p className="text-purple-300">tetraedrik</p>
              <p className="text-purple-400 mt-1">109.5°</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-green-400 font-bold text-lg">Amfoter</p>
              <p className="text-purple-300">Zn(OH)₂</p>
              <p className="text-purple-400 mt-1">kislota+ishqor</p>
            </div>
          </div>
        </div>

        {/* TETRAEDRIK 3D */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Tetrahedral3D />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* AMPHOTERISM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmphoterismSimulator />
        </div>

        {/* BIOANORGANIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BioZinc />
        </div>

        {/* SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SolishtirishJadvali />
        </div>

        {/* TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TarixiyKontekst />
        </div>

        {/* AMALIYOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Zn²⁺ (d¹⁰) — <strong className="text-green-400">mukammal diamagnit</strong>, barcha elektronlar juftlashgan</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — spin-only bilan ideal mos</li>
            <li><strong className="text-green-400">Amfoter xususiyat</strong> — kislotalarda Zn²⁺, ishqorlarda [Zn(OH)₄]²⁻</li>
            <li>Tetraedrik geometriya (T<sub>d</sub>) — sterik omillar ta'siri (CFSE=0)</li>
            <li>Rangsiz eritma — d-d o'tishlar yo'q</li>
            <li><strong>Bioanorganik ahamiyat:</strong> Carbonic anhydrase, Zinc finger</li>
            <li>Zn²⁺ — <strong>Lewis kislotasi</strong> (suvni faollashtirish)</li>
            <li>d¹⁰ ionlari solishtirmasi: Zn, Cd, Hg, Cu, Ag, Au</li>
            <li>Amaliy qo'llanilishi: galvanizatsiya, batareyalar, tibbiyot</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/fe-co5" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Fe(CO)₅]
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/cr-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">
            [Cr(H₂O)₆]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}