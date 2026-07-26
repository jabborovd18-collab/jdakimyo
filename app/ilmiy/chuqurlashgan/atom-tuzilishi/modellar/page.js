"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// 1. INTERAKTIV VAQT CHIZIG'I
// ═══════════════════════════════════════════════════════════════════════════════
function VaqtChizigI() {
  const [activeIdx, setActiveIdx] = useState(3)
  const events = [
    { year: "400 BCE", name: "Demokrit", label: "Atom — eng kichik bo'linmas zarra", icon: "🏛️", detail: "Atom so'zi yunoncha 'atomos' — bo'linmas degan ma'noni anglatadi.", color: "text-amber-400" },
    { year: "1803", name: "Dalton", label: "Atom nazariyasi — kimyoning asosi", icon: "⚗️", detail: "Har bir element atomlardan tashkil topgan. Kimyoviy reaksiyalar atomlarning qayta guruhlanishidir.", color: "text-lime-400" },
    { year: "1897", name: "Tomson", label: "Elektron kashf qilindi", icon: "🧁", detail: "Katod nurlari bilan tajribalar. Elektron — manfiy zaryadli zarra. Atom ichida elektronlar mavjud.", color: "text-yellow-400" },
    { year: "1911", name: "Rezerford", label: "Yadro kashf qilindi", icon: "☀️", detail: "α-zarrachalarning oltin folgadan sochilishi. Atom markazida kichik, og'ir yadro bor.", color: "text-orange-400" },
    { year: "1913", name: "Bor", label: "Kvantlangan atom modeli", icon: "🎯", detail: "Vodorod spektrini tushuntiruvchi postulatlarni taklif qildi. Kvant sonlari mavjudligini ko'rsatdi.", color: "text-blue-400" },
    { year: "1926", name: "Shredinger", label: "To'lqin tenglamasi", icon: "☁️", detail: "Kvant-mexanik model: Ĥψ = Eψ. Elektron holati to'lqin funksiyasi bilan tasvirlanadi.", color: "text-purple-400" },
    { year: "1927", name: "Geyzenberg", label: "Noaniqlik prinsipi", icon: "⚛️", detail: "Δx·Δp ≥ ℏ/2 — bir vaqtda o'rin va impulsni aniq o'lchash mumkin emas.", color: "text-rose-400" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span>⏳</span> Atom modellari evolyutsiyasi — interaktiv vaqt chizig'i
      </h3>

      <div className="relative overflow-x-auto pb-2">
        <div className="flex gap-1 sm:gap-2 min-w-max">
          {events.map((e, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className={`flex flex-col items-center p-3 sm:p-4 rounded-xl border transition-all min-w-[90px] sm:min-w-[110px] ${
                activeIdx === i
                  ? `${e.color} bg-purple-800/60 border-purple-400 shadow-lg scale-105`
                  : "bg-purple-900/40 border-purple-700/40 hover:bg-purple-800/50 text-purple-300"
              }`}>
              <span className="text-lg sm:text-2xl mb-1">{e.icon}</span>
              <span className={`text-[10px] sm:text-xs font-bold ${activeIdx === i ? "text-white" : ""}`}>{e.year}</span>
              <span className="text-[9px] sm:text-[10px] opacity-80">{e.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/40 rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{events[activeIdx].icon}</span>
          <div>
            <h4 className={`font-bold text-lg ${events[activeIdx].color}`}>
              {events[activeIdx].year} — {events[activeIdx].name}
            </h4>
            <p className="text-purple-400 text-xs font-semibold">{events[activeIdx].label}</p>
          </div>
        </div>
        <p className="text-purple-200 text-sm">{events[activeIdx].detail}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. TOMSON MODELI — MATEMATIKASIGACHA
// ═══════════════════════════════════════════════════════════════════════════════
function TomsonModeli() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-yellow-400">🧁</span> 1. Tomson modeli (1897)
      </h3>

      <div className="rounded-xl p-5 border border-yellow-500/30 bg-yellow-600/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-yellow-400 font-bold">"Pudingdagi mayiz" (Plum Pudding) modeli</h4>
            <p className="text-purple-200 text-sm leading-relaxed">
              J.J. Tomson 1897-yili katod nurlari bilan tajribalar o'tkazib, <strong className="text-yellow-400">elektronni kashf qildi</strong>.
              U atomni musbat zaryadlangan shar shaklida, ichida manfiy elektronlar tarqalgan deb tasavvur qildi.
            </p>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4">
              <h5 className="text-yellow-400 font-bold text-xs mb-2">Asosiy fizik parametrlar:</h5>
              <div className="space-y-1.5 text-xs">
                <p className="text-purple-200"><span className="text-purple-400">Elektron zaryadi:</span> e = −1.602×10⁻¹⁹ C</p>
                <p className="text-purple-200"><span className="text-purple-400">Elektron massasi:</span> mₑ = 9.109×10⁻³¹ kg</p>
                <p className="text-purple-200"><span className="text-purple-400">Zaryad/massa nisbati:</span> e/m = 1.7588×10¹¹ C/kg</p>
                <p className="text-purple-200"><span className="text-purple-400">Atom radiusi:</span> r ~ 10⁻¹⁰ m</p>
              </div>
            </div>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4">
              <h5 className="text-yellow-400 font-bold text-xs mb-2">Tomson modelida Kulon kuchi:</h5>
              <div className="bg-purple-950/90 rounded p-2 mb-2">
                <p className="text-center text-sm text-yellow-300 font-mono">F(r) = −(Ze²/4πϵ₀)·(r/R³)</p>
              </div>
              <p className="text-purple-300 text-xs">Bu yerda Z — atom raqami, R — atom radiusi. Elektron muvozanat holatiga qaytaruvchi kuch ta'sirida garmonik tebranadi.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
              <h5 className="text-emerald-400 font-bold text-xs mb-2">✅ Yutuqlari</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Elektronning mavjudligini isbotladi</li>
                <li>• Atomning elektroneytralligini tushuntirdi</li>
                <li>• Massa-spektrometriyaga asos soldi</li>
                <li>• Zaryad/massa nisbatini aniq o'lchadi</li>
                <li>• Atom tarkibida elektron borligini ko'rsatdi</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
              <h5 className="text-red-400 font-bold text-xs mb-2">❌ Kamchiliklari</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Yadro tushunchasi yo'q — Rezerford tajribasiga zid</li>
                <li>• α-zarrachalarning katta burchakka og'ishini (1:8000) tushuntirmaydi</li>
                <li>• Atom spektrlarini izohlamaydi</li>
                <li>• Elektronlarning turg'unligini asoslay olmaydi</li>
                <li>• Klassik fizika doirasida qolgan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. REZERFORD MODELI — α-SOCHILISH MATEMATIKASI
// ═══════════════════════════════════════════════════════════════════════════════
function RezerfordModeli() {
  const [showMath, setShowMath] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-orange-400">☀️</span> 2. Rezerford modeli (1911)
      </h3>

      <div className="rounded-xl p-5 border border-orange-500/30 bg-orange-600/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-orange-400 font-bold">α-zarrachalarning sochilishi — Oltin folga tajribasi</h4>
            <p className="text-purple-200 text-sm leading-relaxed">
              Geyger-Marsden (Rezerford) tajribasida α-zarrachalar (⁴He²⁺, E ≈ 5 MeV) yupqa (≈ 2×10⁻⁷ m) 
              oltin folgadan o'tkazilgan. <strong className="text-orange-400">8000 zarrachadan 1 tasi</strong> 90° dan katta burchakka og'gan.
            </p>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4">
              <h5 className="text-orange-400 font-bold text-xs mb-2">Tajriba natijalari:</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Ko'pchilik α-zarrachalar (≈ 99.99%) to'g'ri o'tgan — atom bo'shliq</li>
                <li>• Ba'zilari (≈ 1:8000) 90° dan katta og'gan — kichik yadro</li>
                <li>• Juda oz qismi (≈ 1:20000) orqaga qaytgan — juda og'ir yadro</li>
              </ul>
            </div>

            <button onClick={() => setShowMath(!showMath)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${showMath ? "bg-orange-600 text-white" : "bg-purple-800/50 text-purple-300 hover:bg-purple-700/60"} border border-orange-500/30`}>
              {showMath ? "📘 Matematikani yashirish" : "📐 Matematik modelni ko'rsatish"}
            </button>

            {showMath && (
              <div className="bg-purple-950/80 border border-orange-500/30 rounded-lg p-4 space-y-3">
                <h5 className="text-orange-400 font-bold text-xs">Rezerfordning sochilish formulasi:</h5>
                <div className="bg-purple-950/90 rounded p-3">
                  <p className="text-center text-sm text-yellow-300 font-mono leading-relaxed">
                    N(θ) = N₀ · (Z₁Z₂e²/16πε₀E)² · 1/sin⁴(θ/2)
                  </p>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-purple-200"><span className="text-purple-400">N(θ):</span> θ burchakka og'gan zarrachalar soni</p>
                  <p className="text-purple-200"><span className="text-purple-400">Z₁, Z₂:</span> α-zarra (Z₁=2) va yadro (Z₂=79) zaryadlari</p>
                  <p className="text-purple-200"><span className="text-purple-400">E:</span> α-zarraning kinetik energiyasi (~5 MeV)</p>
                  <p className="text-purple-200"><span className="text-purple-400">ε₀:</span> elektr doimiysi (8.854×10⁻¹² F/m)</p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
                  <p className="text-yellow-400 text-xs font-bold">Yadro radiusi bahosi:</p>
                  <p className="text-purple-200 text-xs">r_min = (Z₁Z₂e²/4πε₀)·(1/E) ~ 3×10⁻¹⁴ m (10⁻¹⁴ m, ya'ni atomdan ~10000 marta kichik)</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
              <h5 className="text-emerald-400 font-bold text-xs mb-2">✅ Yutuqlari</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Yadro kashf qilindi — atom massasining 99.9%</li>
                <li>• Yadro o'lchami: ~10⁻¹⁴ m (atom: ~10⁻¹⁰ m)</li>
                <li>• Yadro zaryadi: +Ze (musbat)</li>
                <li>• Elektronlar yadro atrofida aylanadi</li>
                <li>• Atom asosan bo'shliqdan iborat</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
              <h5 className="text-red-400 font-bold text-xs mb-2">❌ Kamchiliklari</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Elektron yadro atrofida tezlanish bilan harakat qiladi</li>
                <li>• Larmor formulasi: P = (2/3)·(e²/4πε₀c³)·a² → nurlanish energiya yo'qotadi</li>
                <li>• Elektron ~10⁻¹¹ s da yadroga qulashi kerak</li>
                <li>• Diskret spektrlarni tushuntirmaydi</li>
                <li>• Klassik fizika asosida atom barqaror bo'lmaydi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. BOR MODELI — ENERGIYA KALKULYATOR
// ═══════════════════════════════════════════════════════════════════════════════
function BorModeli() {
  const [n1, setN1] = useState(1)
  const [n2, setN2] = useState(2)
  const [Z, setZ] = useState(1)
  const [showSerie, setShowSerie] = useState(true)

  const E_n1 = -13.6 * (Z*Z) / (n1*n1)
  const E_n2 = -13.6 * (Z*Z) / (n2*n2)
  const deltaE = Math.abs(E_n2 - E_n1)
  const lambda = 1240 / deltaE * 10 // nm

  const series = [
    { name: "Layman", n1: 1, desc: "UV (122 nm)", color: "text-violet-400" },
    { name: "Balmer", n1: 2, desc: "Ko'rinadigan (656 nm)", color: "text-blue-400" },
    { name: "Pashen", n1: 3, desc: "IQ (1875 nm)", color: "text-red-400" },
    { name: "Brekket", n1: 4, desc: "IQ (4052 nm)", color: "text-amber-400" },
    { name: "Pfund", n1: 5, desc: "IQ (7458 nm)", color: "text-purple-300" },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-blue-400">🎯</span> 3. Bor modeli (1913)
      </h3>

      <div className="rounded-xl p-5 border border-blue-500/30 bg-blue-600/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chap taraf */}
          <div className="space-y-4">
            <h4 className="text-blue-400 font-bold">Bor postulatlari</h4>

            <div className="space-y-2">
              {[
                { title: "1-postulat: Statsionar orbitalar", 
                  text: "Elektron faqat ma'lum orbitalarda (n=1,2,3...) nurlanmasdan harakatlanadi.",
                  formula: "mvr = nħ, ħ = h/2π, n = 1, 2, 3..." },
                { title: "2-postulat: Energiya o'tish", 
                  text: "Orbital o'zgartirilganda foton yutiladi yoki chiqariladi:",
                  formula: "ΔE = hν = E₂ − E₁ = 13.6·Z²·(1/n₁² − 1/n₂²) eV" },
                { title: "3-postulat: Kvantlanish", 
                  text: "Burchak momenti kvantlangan: mvr = n·h/2π",
                  formula: "rₙ = n²·a₀/Z, a₀ = 0.529 Å (Bor radiusi)" },
              ].map((p, i) => (
                <div key={i} className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
                  <p className="text-blue-400 font-bold text-xs">{p.title}</p>
                  <p className="text-purple-200 text-xs mt-1">{p.text}</p>
                  <p className="text-yellow-300 font-mono text-[11px] mt-1">{p.formula}</p>
                </div>
              ))}
            </div>
          </div>

          {/* O'ng taraf — interaktiv kalkulyator */}
          <div className="space-y-4">
            <h4 className="text-blue-400 font-bold text-sm">⚡ Bor modeli kalkulyatori</h4>
            
            <div className="bg-purple-950/80 border border-blue-500/30 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-purple-300 text-xs mb-1">Yadro zaryadi (Z): <span className="text-blue-300">{Z}</span></p>
                <input type="range" min={1} max={26} value={Z} onChange={(e) => setZ(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer" style={{accentColor: "#60a5fa"}} />
                <div className="flex justify-between text-[9px] text-purple-600"><span>H (1)</span><span>Fe (26)</span></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-purple-300 text-xs mb-1">n₁ (boshlang'ich): <span className="text-blue-300">{n1}</span></p>
                  <input type="range" min={1} max={7} value={n1} onChange={(e) => setN1(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer" style={{accentColor: "#60a5fa"}} />
                </div>
                <div>
                  <p className="text-purple-300 text-xs mb-1">n₂ (tushish): <span className="text-blue-300">{n2}</span></p>
                  <input type="range" min={1} max={7} value={n2} onChange={(e) => setN2(Math.max(n1+1, Number(e.target.value)))}
                    className="w-full h-1.5 rounded-full appearance-none bg-purple-800 cursor-pointer" style={{accentColor: "#60a5fa"}} />
                </div>
              </div>

              {/* Natijalar */}
              <div className="bg-purple-950/90 border border-purple-700/30 rounded-lg p-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400">E(n₁):</span>
                  <span className="text-white font-mono">{E_n1.toFixed(2)} eV</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400">E(n₂):</span>
                  <span className="text-white font-mono">{E_n2.toFixed(2)} eV</span>
                </div>
                <div className="flex justify-between text-xs border-t border-purple-700/30 pt-1 mt-1">
                  <span className="text-yellow-400 font-bold">ΔE:</span>
                  <span className="text-yellow-300 font-bold font-mono">{deltaE.toFixed(2)} eV</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cyan-400">λ:</span>
                  <span className="text-cyan-300 font-bold font-mono">{lambda.toFixed(1)} nm</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-purple-400">ν:</span>
                  <span className="text-purple-200 font-mono">{(deltaE * 2.418e14).toExponential(2)} Hz</span>
                </div>
              </div>
            </div>

            {/* Spektral seriyalar */}
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-lg p-3">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowSerie(!showSerie)}>
                <h5 className="text-blue-400 font-bold text-xs">📊 Spektral seriyalar</h5>
                <span className="text-purple-400">{showSerie ? "▲" : "▼"}</span>
              </div>
              {showSerie && (
                <div className="mt-2 space-y-1">
                  {series.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-[11px] bg-purple-900/50 rounded px-2 py-1.5 cursor-pointer hover:bg-purple-800/50"
                      onClick={() => { setN1(1); setN2(s.n1+1) }}>
                      <span className={`font-bold ${s.color}`}>{s.name} ({s.n1})</span>
                      <span className="text-purple-300">{s.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Xulosa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
            <h5 className="text-emerald-400 font-bold text-xs mb-2">✅ Yutuqlari</h5>
            <ul className="text-purple-200 space-y-1 text-xs">
              <li>• Vodorod spektrini aniq tushuntirdi (Ridberg formulasi bilan mos)</li>
              <li>• Kvant soni n ni kiritdi</li>
              <li>• Bor radiusi: a₀ = 0.529 Å</li>
              <li>• Energiya sathlari: Eₙ = −13.6/n² eV</li>
              <li>• Spektral seriyalarni (Layman, Balmer, Pashen) tushuntirdi</li>
            </ul>
          </div>
          <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
            <h5 className="text-red-400 font-bold text-xs mb-2">❌ Kamchiliklari</h5>
            <ul className="text-purple-200 space-y-1 text-xs">
              <li>• Ko'p elektronli atomlar uchun ishlamaydi (He, Li...)</li>
              <li>• Spektral chiziq intensivligini tushuntirmaydi</li>
              <li>• Noaniqlik prinsipi bilan mos kelmaydi</li>
              <li>• Zeeman effekti g'oyasini bermaydi</li>
              <li>• Yarim klassik — kvant va klassik tushunchalar aralashmasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. KVANT-MEXANIK MODEL
// ═══════════════════════════════════════════════════════════════════════════════
function KvantMexanikModel() {
  const [showNoaniqlik, setShowNoaniqlik] = useState(false)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-purple-400">☁️</span> 4. Kvant-mexanik model (1926)
      </h3>

      <div className="rounded-xl p-5 border border-purple-500/30 bg-purple-600/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-purple-400 font-bold">Shredinger tenglamasi — kvant mexanikasining asosi</h4>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-4">
              <h5 className="text-purple-400 font-bold text-xs mb-2">Vaqtga bog'liq bo'lmagan Shredinger tenglamasi:</h5>
              <div className="bg-purple-950/90 rounded p-3">
                <p className="text-center text-lg text-yellow-300 font-mono">Ĥ|ψ⟩ = E|ψ⟩</p>
              </div>
              <p className="text-purple-300 text-xs mt-2">yoki uch o'lchovda:</p>
              <div className="bg-purple-950/90 rounded p-3">
                <p className="text-center text-sm text-yellow-300 font-mono">[−ℏ²/2m·∇² + V(r)]ψ(r) = Eψ(r)</p>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="text-purple-400 font-bold text-xs">Modelning asosiy farqlari:</h5>
              {[
                "Elektron aniq orbita bo'ylab harakatlanmaydi — orbital (ehtimollik buluti) mavjud",
                "To'lqin funksiyasi ψ — elektron holati haqida to'liq ma'lumot beradi",
                "|ψ|² — elektronni ma'lum nuqtada topish ehtimollik zichligi (Born talqini)",
                "4 ta kvant son (n, l, mₗ, mₛ) elektron holatini to'liq tavsiflaydi",
                "Pauli prinsipi — bir atomda 4 ta kvant soni bir xil bo'lgan 2 ta elektron bo'lmaydi",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-purple-200">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setShowNoaniqlik(!showNoaniqlik)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${showNoaniqlik ? "bg-rose-600 text-white" : "bg-purple-800/50 text-purple-300 hover:bg-purple-700/60"} border border-rose-500/30`}>
              {showNoaniqlik ? "📘 Yopish" : "⚛️ Geyzenberg noaniqlik prinsipi"}
            </button>

            {showNoaniqlik && (
              <div className="bg-rose-600/10 border border-rose-500/30 rounded-lg p-4 space-y-2">
                <h5 className="text-rose-400 font-bold text-xs">Geyzenberg noaniqlik prinsipi (1927):</h5>
                <div className="bg-purple-950/90 rounded p-2">
                  <p className="text-center text-sm text-yellow-300 font-mono">Δx·Δp ≥ ℏ/2</p>
                </div>
                <p className="text-purple-200 text-xs">Bu yerda Δx — o'rin noaniqligi, Δp — impuls noaniqligi, ℏ = h/2π</p>
                <div className="bg-purple-950/70 rounded p-2">
                  <p className="text-purple-300 text-xs"><strong className="text-rose-300">Ma'nosi:</strong> Elektronning bir vaqtda ham o'rnini, ham impulsini cheksiz aniqlik bilan o'lchash mumkin emas. Birini qanchalik aniq o'lchasangiz, ikkinchisini shunchalik noaniq o'lchaysiz.</p>
                </div>
                <div className="bg-purple-950/70 rounded p-2">
                  <p className="text-purple-300 text-xs"><strong className="text-rose-300">Bor modeliga ta'siri:</strong> Bor modelida elektronning aniq orbitasi (r) va aniq tezligi (v) mavjud. Bu noaniqlik prinsipiga zid. Shu sababli Bor modeli noto'g'ri.</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4">
              <h5 className="text-emerald-400 font-bold text-xs mb-2">✅ Kvant-mexanik modelning yutuqlari</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• Barcha atomlar va molekulalar uchun qo'llaniladi</li>
                <li>• Spektral chiziqlarning intensivligini tushuntiradi</li>
                <li>• Kimyoviy bog'lanishni asoslavdi (VB, MO nazariyalari)</li>
                <li>• Kristall maydon va ligand maydon nazariyalariga asos</li>
                <li>• Zeeman effekti, Shtark effekti tushuntiriladi</li>
                <li>• Orbital shakllari va energetik ajralishni hisoblash imkonini beradi</li>
              </ul>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
              <h5 className="text-yellow-400 font-bold text-xs mb-2">⚡ Kompleks birikmalar kimyosidagi ahamiyati</h5>
              <ul className="text-purple-200 space-y-1 text-xs">
                <li>• d-orbitallarning shakli va energiyasi — KM model asosida tushuntiriladi</li>
                <li>• Kristall maydon nazariyasi — d-orbital ajralishini KM asosida tahlil qiladi</li>
                <li>• MO nazariyasi — metall-ligand bog'larini molekulyar orbitallar orqali tasvirlaydi</li>
                <li>• Komplekslarning rangi, magnit xossalari, geometriyasi — KM asosida izohlanadi</li>
                <li>• <strong className="text-yellow-400">Pirovard natija:</strong> KM model — kompleks birikmalar kimyosining nazariy poydevori</li>
              </ul>
            </div>

            <div className="bg-purple-950/70 border border-purple-700/30 rounded-lg p-3">
              <h5 className="text-purple-400 font-bold text-xs mb-2">To'lqin funksiyasining fizik ma'nosi:</h5>
              <div className="bg-purple-950/90 rounded p-2 mb-2">
                <p className="text-center text-sm text-yellow-300 font-mono">|ψ(r)|² dV = P(r)dV</p>
              </div>
              <p className="text-purple-300 text-xs">|ψ(r)|² — elektronni r nuqtada dV hajm ichida topish ehtimollik zichligi. Born talqini (1926).</p>
              <div className="bg-purple-950/90 rounded p-2 mt-2">
                <p className="text-center text-sm text-yellow-300 font-mono">∫|ψ(r)|²dV = 1 (normallashtirish)</p>
              </div>
              <p className="text-purple-300 text-xs mt-1">Butun fazo bo'yicha ehtimollik yig'indisi 1 ga teng.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. MODELLARNI TAQQOSLASH — INTERAKTIV JADVAL
// ═══════════════════════════════════════════════════════════════════════════════
function ModellarTaqqoslash() {
  const [activeRow, setActiveRow] = useState(null)

  const models = [
    { name: "Tomson (1897)", icon: "🧁", sochilish: false, yadro: false, spektr: false, kvant: false, barqaror: false, status: "Eskirgan" },
    { name: "Rezerford (1911)", icon: "☀️", sochilish: true, yadro: true, spektr: false, kvant: false, barqaror: false, status: "Eskirgan" },
    { name: "Bor (1913)", icon: "🎯", sochilish: true, yadro: true, spektr: true, kvant: true, barqaror: false, status: "Cheklangan" },
    { name: "Kvant-mexanik (1926)", icon: "☁️", sochilish: true, yadro: true, spektr: true, kvant: true, barqaror: true, status: "✅ Hozirgi" },
  ]

  const details = {
    "Tomson (1897)": "α-sochilishni tushuntirmaydi, yadro yo'q, spektrlar yo'q, kvantlash yo'q. Klassik model.",
    "Rezerford (1911)": "α-sochilishni tushuntiradi, yadro bor, lekin spektr va barqarorlik muammosi hal etilmagan.",
    "Bor (1913)": "Vodorod spektrini tushuntiradi, kvant sonlari kiritilgan, lekin ko'p elektronli atomlar uchun ishlamaydi, noaniqlik printsipiga zid.",
    "Kvant-mexanik (1926)": "Barcha hodisalarni tushuntiruvchi to'liq model. Hozirgi kunda qo'llaniladi.",
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-cyan-400">📊</span> Modellarni taqqoslash
      </h3>

      <div className="bg-purple-900/30 border border-purple-700/40 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-purple-800/70">
                <th className="p-3 text-left text-purple-200 font-bold">Model</th>
                <th className="p-3 text-center text-purple-200 font-bold">α-sochilish</th>
                <th className="p-3 text-center text-purple-200 font-bold">Yadro</th>
                <th className="p-3 text-center text-purple-200 font-bold">Spektrlar</th>
                <th className="p-3 text-center text-purple-200 font-bold">Kvantlash</th>
                <th className="p-3 text-center text-purple-200 font-bold">Barqarorlik</th>
                <th className="p-3 text-center text-purple-200 font-bold">Holati</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={i} 
                  className={`border-t border-purple-800/30 cursor-pointer transition-all ${
                    activeRow === i ? "bg-purple-700/40" : "hover:bg-purple-800/30"
                  }`}
                  onClick={() => setActiveRow(activeRow === i ? null : i)}>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <span>{m.icon}</span>
                    <span>{m.name}</span>
                  </td>
                  <td className="p-3 text-center">{m.sochilish ? "✅" : "❌"}</td>
                  <td className="p-3 text-center">{m.yadro ? "✅" : "❌"}</td>
                  <td className="p-3 text-center">{m.spektr ? "✅" : "❌"}</td>
                  <td className="p-3 text-center">{m.kvant ? "✅" : "❌"}</td>
                  <td className="p-3 text-center">{m.barqaror ? "✅" : "❌"}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      i === 3 ? "bg-green-600/20 text-green-400 border border-green-500/40" 
                      : i === 2 ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/40"
                      : "bg-red-600/20 text-red-400 border border-red-500/40"
                    }`}>{m.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeRow !== null && (
          <div className="bg-purple-950/80 border-t border-purple-700/40 px-4 py-3 animate-slideDown">
            <p className="text-purple-200 text-xs">{details[models[activeRow].name]}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. TEST
// ═══════════════════════════════════════════════════════════════════════════════
function TestModellar() {
  const questions = [
    { q: "Tomson modelining asosiy kamchiligi nima?", a: "Yadro yo'q — α-zarrachalarning sochilishini tushuntirmaydi", opts: ["Elektron yo'q", "Yadro yo'q — α-zarrachalarning sochilishini tushuntirmaydi", "Atom zaryadsiz", "Spektrlarni tushuntiradi"], hint: "Rezerford tajribasiga e'tibor bering" },
    { q: "Rezerford tajribasida α-zarrachalarning necha foizi 90° dan katta og'gan?", a: "0.0125% (1:8000)", opts: ["50%", "0.0125% (1:8000)", "99.99%", "1%"], hint: "8000 zarrachadan 1 tasi" },
    { q: "Rezerfordning sochilish formulasi qanday bog'liqlikni ifodalaydi?", a: "N(θ) ∝ 1/sin⁴(θ/2)", opts: ["N(θ) ∝ sin²θ", "N(θ) ∝ 1/sin⁴(θ/2)", "N(θ) ∝ cos²θ", "N(θ) ∝ θ²"], hint: "Katta burchakda keskin kamayadi" },
    { q: "Bor modelida elektronning burchak momenti qanday kvantlanadi?", a: "mvr = nħ", opts: ["mvr = n²ħ", "mvr = nħ", "mvr = ℏ/n", "mvr = n·h"], hint: "Bor postulatlari, n=1,2,3..." },
    { q: "Vodorod atomi uchun Bor radiusi (a₀) qiymati?", a: "0.529 Å", opts: ["0.529 Å", "1.0 Å", "0.1 Å", "5.29 Å"], hint: "Bu eng kichik orbita radiusi (n=1)" },
    { q: "Layman seriyasidagi chiziqlar qaysi diapazonda joylashgan?", a: "UV (122 nm)", opts: ["Ko'rinadigan (656 nm)", "UV (122 nm)", "IQ (1875 nm)", "Rentgen"], hint: "n=1 ga o'tishlar" },
    { q: "Energiya sathlari formulasini ko'rsating (Bor modeli):", a: "Eₙ = −13.6·Z²/n² eV", opts: ["Eₙ = −13.6·n² eV", "Eₙ = −13.6·Z²/n² eV", "Eₙ = −13.6/n eV", "Eₙ = 13.6·Z²·n² eV"], hint: "n maxrajda, manfiy ishora" },
    { q: "Geyzenberg noaniqlik prinsipining matematik ifodasi:", a: "Δx·Δp ≥ ℏ/2", opts: ["Δx·Δp = 0", "Δx·Δp ≥ ℏ/2", "Δx·Δp ≤ ℏ/2", "Δx·Δp = ℏ"], hint: "O'rin va impuls" },
    { q: "|ψ(r)|² ning fizik ma'nosi nima?", a: "Elektronni r nuqtada topish ehtimollik zichligi", opts: ["Energiya", "Elektron zaryadi", "Elektronni r nuqtada topish ehtimollik zichligi", "Magnit moment"], hint: "Born talqini" },
    { q: "Qaysi model kompleks birikmalar kimyosida asosiy hisoblanadi?", a: "Kvant-mexanik model (1926)", opts: ["Tomson", "Rezerford", "Bor", "Kvant-mexanik model (1926)"], hint: "Kristall maydon, MO — hammasi shu modelga asoslanadi" },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState({})

  const q = questions[current]

  const checkAnswer = (opt) => {
    setSelected(opt)
    const isCorrect = opt === q.a
    if (isCorrect && !answers[current]) setScore(s => s + 1)
    setAnswers(prev => ({ ...prev, [current]: isCorrect }))
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1); setSelected(null)
    } else { setShowResult(true) }
  }

  if (showResult) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-bold text-lg">📝 Test natijalari</h3>
        <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-8 text-center">
          <div className="text-6xl mb-4">{score >= 8 ? "🏆" : score >= 5 ? "👍" : "📚"}</div>
          <p className="text-3xl font-bold text-white">{score}/{questions.length}</p>
          <p className="text-purple-300 mt-2">{score >= 8 ? "A'lo! Atom modellarini mukammal o'zlashtirdingiz!" : score >= 5 ? "Yaxshi. Yana bir oz takrorlash kerak." : "Qayta o'qib chiqing va yana urinib ko'ring."}</p>
          <div className="flex gap-2 justify-center mt-4">
            <button onClick={() => { setCurrent(0); setSelected(null); setScore(0); setShowResult(false); setAnswers({}) }} 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">Qayta</button>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" 
              className="px-4 py-2 bg-purple-800/50 hover:bg-purple-700/70 text-purple-200 rounded-lg text-sm border border-purple-700/40">← Orqaga</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-bold text-lg flex items-center gap-2">
        <span className="text-emerald-400">📝</span> Bilim tekshirish — {current+1}/{questions.length}
      </h3>
      <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/30 border border-purple-700/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-purple-400">10 ta savol</span>
          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${
                i === current ? "bg-purple-500" : answers[i] !== undefined ? (answers[i] ? "bg-green-500" : "bg-red-500") : "bg-purple-800"
              }`} />
            ))}
          </div>
        </div>

        <p className="text-white font-bold text-base mb-6">{q.q}</p>

        <div className="grid grid-cols-1 gap-3 mb-4">
          {q.opts.map((opt, i) => (
            <button key={i} onClick={() => !selected && checkAnswer(opt)}
              className={`p-3 rounded-xl text-sm text-left transition-all border ${
                selected === opt
                  ? opt === q.a ? "bg-green-600/20 border-green-500 text-green-200" : "bg-red-600/20 border-red-500 text-red-200"
                  : selected ? (opt === q.a ? "bg-green-600/20 border-green-500 text-green-200 opacity-60" : "bg-purple-800/40 border-purple-700/40 text-purple-300 opacity-50")
                    : "bg-purple-800/40 border-purple-700/40 text-purple-200 hover:bg-purple-700/60"
              }`}>
              {opt}
            </button>
          ))}
        </div>

        {selected && (
          <div className="space-y-3">
            <div className={`text-xs p-3 rounded-lg ${selected === q.a ? "bg-green-600/10 border border-green-500/30 text-green-300" : "bg-red-600/10 border border-red-500/30 text-red-300"}`}>
              {selected === q.a ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-2 text-xs">
              <span className="text-yellow-400 font-bold">💡 </span><span className="text-purple-200">{q.hint}</span>
            </div>
            <button onClick={next} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm transition-all">
              {current < questions.length - 1 ? "Keyingi →" : "Natijalarni ko'rish"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASOSIY SAHIFA
// ═══════════════════════════════════════════════════════════════════════════════
export default function AtomModellari() {
  const [showAll, setShowAll] = useState(true)

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-blue-950 text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-purple-950/90 backdrop-blur-xl border-b border-purple-800/50 px-4 sm:px-6 py-3">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-purple-400 mb-1">
            <Link href="/" className="hover:text-purple-300">🏠</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy" className="hover:text-purple-300">Ilmiy</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan" className="hover:text-purple-300">Chuqurlashgan</Link>
            <span className="text-purple-600">›</span>
            <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="hover:text-purple-300">Atom tuzilishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-purple-300">Modellar</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <span>🧪</span> Atom tuzilishi modellari
              </h1>
              <p className="text-xs sm:text-sm text-purple-500">Tomson → Rezerford → Bor → Kvant-mexanik • OTM darajasidagi to'liq qo'llanma</p>
            </div>
            <button onClick={() => setShowAll(!showAll)}
              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold bg-purple-800/50 text-purple-300 hover:bg-purple-700/60 border border-purple-700/40">
              {showAll ? "🎯 Interaktiv" : "📄 To'liq"}
            </button>
          </div>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* KIRISH */}
        <div className="bg-gradient-to-br from-purple-900/50 via-indigo-900/30 to-blue-900/30 border border-purple-700/40 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📋</span> Atom tuzilishi haqidagi tasavvurlarning rivojlanishi
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-purple-200 leading-relaxed mb-4">
                Atom tuzilishi haqidagi bilimlar <strong className="text-yellow-400">asrlar davomida</strong> rivojlanib kelgan.
                Har bir yangi model oldingisining kamchiliklarini tuzatgan va yangi kashfiyotlar asosida takomillashgan.
                <strong className="text-purple-300"> Tomson (1897) → Rezerford (1911) → Bor (1913) → Kvant-mexanik (1926)</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">4 ta model</span>
                <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">10 ta test</span>
                <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Bor kalkulyatori</span>
                <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 px-3 py-1 rounded-full text-xs">Sochilish formulasi</span>
              </div>
            </div>
            <div className="bg-purple-950/60 border border-purple-700/30 rounded-xl p-4 text-xs space-y-2">
              <p className="text-purple-300"><span className="text-purple-400 font-bold">🎯 Maqsad:</span> Atom modellarining tarixiy rivojlanishi, fizik asoslari va bir-biridan farqlarini tushunish.</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">📚 Manba:</span> Cotton — Advanced Inorganic Chemistry; Housecroft — Inorganic Chemistry</p>
              <p className="text-purple-300"><span className="text-purple-400 font-bold">⏱️ Vaqt:</span> ~3 soat</p>
            </div>
          </div>
        </div>

        {/* VAQT CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <VaqtChizigI />
        </div>

        {/* MODELLAR */}
        {showAll && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <TomsonModeli />
            </div>
            <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
              <RezerfordModeli />
            </div>
          </>
        )}

        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <BorModeli />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <KvantMexanikModel />
        </div>

        {showAll && (
          <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
            <ModellarTaqqoslash />
          </div>
        )}

        {/* TEST */}
        <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6">
          <TestModellar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-xs sm:text-sm text-purple-200 list-decimal list-inside">
            <li>Atom modellari <strong className="text-yellow-400">Tomson → Rezerford → Bor → Kvant-mexanik</strong> yo'nalishida rivojlangan</li>
            <li>Har bir model oldingisining <strong className="text-purple-300">kamchiliklarini</strong> tuzatgan va yangi tushunchalar kiritgan</li>
            <li><strong className="text-purple-300">Tomson:</strong> elektron kashf qilindi — yo'nalish beruvchi model</li>
            <li><strong className="text-purple-300">Rezerford:</strong> yadro kashf qilindi — α-sochilish matematikasi</li>
            <li><strong className="text-purple-300">Bor:</strong> kvantlash kiritildi — vodorod spektri tushuntirildi</li>
            <li><strong className="text-purple-300">Kvant-mexanik:</strong> Shredinger tenglamasi — hozirgi zamon modeli</li>
            <li>Kompleks birikmalar kimyosi <strong className="text-yellow-400">kvant-mexanik model</strong> asosida qurilgan</li>
            <li>Orbitallar — elektronning aniq orbitasi emas, balki ehtimollik bulutidir</li>
          </ol>
        </div>

        {/* NAVIGATSIYA */}
        <div className="flex justify-between pt-2">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" 
            className="px-4 sm:px-6 py-2.5 sm:py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-xs sm:text-sm transition-all flex items-center gap-2">
            <span>←</span> Atom tuzilishi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar" 
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
            Kvant sonlar <span>→</span>
          </Link>
        </div>

        {/* FOOTER */}
        <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-purple-900/40 border border-purple-700/40 rounded-2xl p-4 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-purple-300">📚 <strong className="text-purple-200">Manbalar:</strong> Cotton & Wilkinson — Advanced Inorganic Chemistry | Housecroft & Sharpe — Inorganic Chemistry | Nasimov, Tashpulatov — Noorganik kimyoning tanlangan boblari</p>
          <p className="text-[10px] sm:text-xs text-purple-500 mt-2">JDA-Kimyo platformasi © {new Date().getFullYear()}</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 100px; }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        input[type="range"] { accent-color: #60a5fa; }
      `}</style>
    </main>
  )
}
