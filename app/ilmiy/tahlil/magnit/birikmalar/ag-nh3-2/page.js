"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. SPIN-ONLY KALKULYATORI (Ag⁺ d¹⁰)
// ============================================================================
function SpinOnlyCalc() {
  const [n, setN] = useState(0)
  const mu_so = Math.sqrt(n * (n + 2))

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧮 Spin-only magnit momenti</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
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
            className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer accent-slate-400" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>0</span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Hisoblash</p>
            <p className="text-purple-200 font-mono">√({n}·{n + 2})</p>
          </div>
          <div className="bg-slate-700/40 border border-slate-500/40 rounded-lg p-3">
            <p className="text-slate-300">Natija</p>
            <p className="text-emerald-400 font-bold font-mono text-lg">{mu_so.toFixed(3)} μ<sub>B</sub></p>
          </div>
        </div>

        <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-3 text-xs">
          <p className="text-emerald-400 font-bold mb-1">✅ [Ag(NH₃)₂]⁺ uchun:</p>
          <p className="text-purple-200">
            Ag⁺ — <strong>d¹⁰ konfiguratsiya</strong> (barcha 5 ta d-orbital to'liq to'lgan).
            Hech qanday toq elektron yo'q → <strong>n = 0</strong>, S = 0.
            μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — <strong>mukammal diamagnit</strong>.
            Bu Zn²⁺ (d¹⁰), Cu⁺ (d¹⁰), Cd²⁺ (d¹⁰) kabi barcha d¹⁰ ionlarga xos.
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 d¹⁰ ionlari — doim diamagnit!</p>
          <p className="text-purple-200">
            d¹⁰ konfiguratsiyada <strong>barcha d-orbitallar juft elektronlar bilan to'lgan</strong>.
            Hech qanday toq elektron yo'q → magnit moment = 0.
            Bu <strong>umumiy qoida</strong>: Cu⁺, Ag⁺, Au⁺, Zn²⁺, Cd²⁺, Hg²⁺ — hammasi diamagnit.
            Shuning uchun <strong>rang ham yo'q</strong> (d-d o'tishlar uchun bo'sh d-orbital kerak).
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. CHIZIQLI GEOMETRIYA — sp GIBRIDLANISH
// ============================================================================
function ChiziqliGeometriya() {
  const [burchak, setBurchak] = useState(180)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Chiziqli geometriya — sp gibridlanish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob geometriya:</p>
          <p className="text-purple-200 text-xs">
            [Ag(NH₃)₂]⁺ — <strong>chiziqli (linear)</strong> kompleks. Koordinatsion son = 2.
            Ag⁺ <strong>sp gibridlanish</strong>ga ega (yoki <strong>sd gibridlanish</strong> — d¹⁰ uchun).
            Burchak = <strong>180°</strong>. Bu d¹⁰ ionlariga xos (Cu⁺, Au⁺, Hg²⁺ ham shunday).
          </p>
        </div>

        {/* SVG VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <svg viewBox="0 0 400 250" className="w-full h-56">
            {/* Markaziy Ag */}
            <circle cx="200" cy="125" r="22" fill="#94a3b8" />
            <text x="200" y="131" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">Ag⁺</text>

            {/* Chapdagi NH₃ */}
            <line x1="200" y1="125" x2="80" y2="125" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="80" cy="125" r="18" fill="#3b82f6" />
            <text x="80" y="130" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">NH₃</text>

            {/* O'ngdagi NH₃ */}
            <line x1="200" y1="125" x2="320" y2="125" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="320" cy="125" r="18" fill="#3b82f6" />
            <text x="320" y="130" fill="white" fontSize="11" textAnchor="middle" fontWeight="bold">NH₃</text>

            {/* Burchak ko'rsatkichi */}
            <path d="M 170 125 A 30 30 0 0 1 230 125" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
            <text x="200" y="110" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">180°</text>

            {/* Bog' uzunligi */}
            <text x="140" y="150" fill="#3b82f6" fontSize="10" textAnchor="middle">2.06 Å</text>
            <text x="260" y="150" fill="#3b82f6" fontSize="10" textAnchor="middle">2.06 Å</text>

            {/* sp gibrid orbitallar */}
            <ellipse cx="140" cy="125" rx="40" ry="10" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
            <ellipse cx="260" cy="125" rx="40" ry="10" fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />

            {/* Labels */}
            <text x="200" y="200" fill="#c4b5fd" fontSize="11" textAnchor="middle">
              sp gibridlanish → chiziqli geometriya
            </text>
            <text x="200" y="220" fill="#a78bfa" fontSize="9" textAnchor="middle">
              d¹⁰ → kristall maydon stabilizatsiyasi = 0
            </text>
          </svg>
        </div>

        {/* BURCHAK SLIDERI */}
        <div>
          <label className="flex justify-between text-xs mb-1">
            <span className="text-yellow-400 font-bold">N−Ag−N burchagi:</span>
            <span className="text-emerald-400 font-mono">{burchak}°</span>
          </label>
          <input type="range" min="90" max="180" step="1" value={burchak}
            onChange={(e) => setBurchak(parseInt(e.target.value))}
            className="w-full h-2 bg-purple-900 rounded accent-slate-400" />
          <div className="flex justify-between text-[10px] text-purple-400 mt-1">
            <span>90° (buzilgan)</span>
            <span>180° (chiziqli)</span>
          </div>
        </div>

        {/* GEOMETRIYA TANLASH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className={`rounded-lg p-3 text-center ${burchak === 180 ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-purple-900/50'}`}>
            <p className="text-slate-300 font-bold text-sm">180°</p>
            <p className="text-emerald-400 text-xs">Chiziqli (sp)</p>
            <p className="text-purple-400 text-[10px]">Eng barqaror ✓</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${burchak === 120 ? 'bg-yellow-900/30 border border-yellow-500/30' : 'bg-purple-900/50'}`}>
            <p className="text-slate-300 font-bold text-sm">120°</p>
            <p className="text-yellow-400 text-xs">Trigonal (sp²)</p>
            <p className="text-purple-400 text-[10px]">Kuchsiz</p>
          </div>
          <div className={`rounded-lg p-3 text-center ${burchak === 90 ? 'bg-red-900/30 border border-red-500/30' : 'bg-purple-900/50'}`}>
            <p className="text-slate-300 font-bold text-sm">90°</p>
            <p className="text-red-400 text-xs">Buzilgan</p>
            <p className="text-purple-400 text-[10px]">Beqaror</p>
          </div>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-slate-300 font-bold text-xs mb-2">Nima uchun aynan chiziqli?</h5>
          <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
            <li><strong>d¹⁰ konfiguratsiya</strong> — barcha d-orbitallar to'lgan</li>
            <li><strong>Kristall maydon stabilizatsiyasi (CFSE) = 0</strong></li>
            <li><strong>Ligand-ligand itarish</strong> minimal bo'lishi uchun → 180°</li>
            <li><strong>sp gibridlanish</strong> — 2 ta gibrid orbital, 180° burchak</li>
            <li>Yoki <strong>sd gibridlanish</strong> (d¹⁰ uchun xos) — d<sub>z²</sub> + s</li>
          </ul>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Boshqa d¹⁰ chiziqli komplekslar:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {[
              { ion: "[Cu(CN)₂]⁻", rang: "Rangsiz" },
              { ion: "[Ag(CN)₂]⁻", rang: "Rangsiz" },
              { ion: "[Au(CN)₂]⁻", rang: "Rangsiz" },
              { ion: "[HgCl₂]", rang: "Rangsiz" },
            ].map((c, i) => (
              <div key={i} className="bg-purple-900/50 rounded p-2 text-center">
                <p className="text-slate-300 font-mono text-[10px]">{c.ion}</p>
                <p className="text-purple-400 text-[9px]">{c.rang}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. TOLLENS REAKTIVI — KUMUSH KO'ZGU
// ============================================================================
function TollensReaktivi() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. AgNO₃ eritmasi tayyorlash",
      desc: "Kumush nitrat suvda eritiladi → [Ag(H₂O)₂]⁺",
      formula: "AgNO₃ → Ag⁺ + NO₃⁻",
      icon: "💧",
      rang: "bg-blue-900/30 border-blue-500/30"
    },
    {
      title: "2. NaOH qo'shiladi",
      desc: "Jigarrang Ag₂O cho'kma hosil bo'ladi",
      formula: "2 Ag⁺ + 2 OH⁻ → Ag₂O ↓ + H₂O",
      icon: "⚗️",
      rang: "bg-amber-900/30 border-amber-500/30"
    },
    {
      title: "3. NH₃ qo'shiladi (drop by drop)",
      desc: "Cho'kma eriydi → [Ag(NH₃)₂]⁺ kompleks hosil bo'ladi",
      formula: "Ag₂O + 4 NH₃ + H₂O → 2 [Ag(NH₃)₂]⁺ + 2 OH⁻",
      icon: "🧪",
      rang: "bg-purple-900/30 border-purple-500/30"
    },
    {
      title: "4. Aldegid qo'shiladi",
      desc: "Aldegid [Ag(NH₃)₂]⁺ ni Ag⁰ ga qaytaradi",
      formula: "R-CHO + 2 [Ag(NH₃)₂]⁺ + 3 OH⁻ → R-COO⁻ + 2 Ag ↓ + 4 NH₃ + 2 H₂O",
      icon: "🧬",
      rang: "bg-slate-700/30 border-slate-500/30"
    },
    {
      title: "5. Kumush ko'zgu hosil bo'ladi",
      desc: "Idish devorida kumush qatlami cho'kadi — yaltiroq ko'zgu!",
      formula: "Ag⁺ + e⁻ → Ag⁰ (qattiq, yaltiroq)",
      icon: "🪞",
      rang: "bg-slate-600/30 border-slate-400/30"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🪞 Tollens reaktivi — kumush ko'zgu reaksiyasi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎯 Klassik analitik reaksiya:</p>
          <p className="text-purple-200 text-xs">
            <strong>Tollens reaktivi</strong> — [Ag(NH₃)₂]⁺ eritmasi. <strong>Aldegidlarni</strong>
            ketonlardan farqlash uchun ishlatiladi. Aldegidlar Ag⁺ ni Ag⁰ ga qaytaradi →
            idish devorida <strong className="text-slate-300">kumush ko'zgu</strong> hosil bo'ladi.
            Ketonlar bu reaksiyaga kirishmaydi.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-1 overflow-x-auto pb-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i
                  ? "bg-slate-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className={`rounded-xl p-5 border ${s.rang}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-yellow-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-950/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* KUMUSH KO'ZGU VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <h5 className="text-slate-300 font-bold text-xs mb-3">Kumush ko'zgu hosil bo'lishi:</h5>
          <svg viewBox="0 0 400 250" className="w-full h-56">
            {/* Idish (probirka) */}
            <path d="M 130 30 L 130 200 Q 130 230 160 230 L 240 230 Q 270 230 270 200 L 270 30"
              fill="none" stroke="#a78bfa" strokeWidth="2" />

            {/* Eritma */}
            <rect x="132" y="80" width="136" height="148" fill="#e0e7ff" opacity="0.3" />

            {/* Kumush ko'zgu qatlami (devorda) */}
            {step >= 4 && (
              <>
                <rect x="132" y="80" width="4" height="148" fill="#94a3b8" opacity="0.9" />
                <rect x="264" y="80" width="4" height="148" fill="#94a3b8" opacity="0.9" />
                <rect x="132" y="224" width="136" height="4" fill="#94a3b8" opacity="0.9" rx="2" />

                {/* Yaltiroq effekt */}
                <line x1="134" y1="90" x2="134" y2="220" stroke="white" strokeWidth="1" opacity="0.6" />
                <line x1="266" y1="90" x2="266" y2="220" stroke="white" strokeWidth="1" opacity="0.6" />
              </>
            )}

            {/* Ag nanopartikullari (oraliq bosqichlar) */}
            {step >= 3 && step < 4 && Array.from({ length: 15 }).map((_, i) => (
              <circle key={i}
                cx={140 + (i * 8) % 120}
                cy={100 + (i * 13) % 120}
                r="2"
                fill="#94a3b8"
                opacity="0.7"
              />
            ))}

            {/* Aldegid molekulasi */}
            {step === 3 && (
              <g>
                <circle cx="200" cy="150" r="10" fill="#ef4444" />
                <text x="200" y="154" fill="white" fontSize="8" textAnchor="middle" fontWeight="bold">R</text>
                <line x1="210" y1="150" x2="225" y2="150" stroke="#a78bfa" strokeWidth="1.5" />
                <text x="235" y="154" fill="#fbbf24" fontSize="9" fontWeight="bold">CHO</text>
              </g>
            )}

            {/* Label */}
            <text x="200" y="20" fill="#c4b5fd" fontSize="10" textAnchor="middle">
              {step < 4 ? "Reaksiya jarayoni..." : "✨ Kumush ko'zgu tayyor!"}
            </text>
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Oksidlovchi</p>
            <p className="text-slate-300 font-bold">[Ag(NH₃)₂]⁺</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Qaytaruvchi</p>
            <p className="text-slate-300 font-bold">R-CHO</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Mahsulot</p>
            <p className="text-slate-300 font-bold">Ag⁰ (ko'zgu)</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">Aniqlanadi</p>
            <p className="text-emerald-400 font-bold">Aldegid guruhi</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun faqat aldegidlar?</p>
          <p className="text-purple-200">
            Aldegidda <strong>C=H bog'i</strong> bor — oson oksidlanadi (R-COOH gacha).
            Ketonda (R-CO-R') bunday bog' yo'q — <strong>oksidlanish qiyin</strong>.
            Shuning uchun Tollens testi <strong>aldegid/keton farqlashda</strong> klassik usul.
            (Istisno: α-gidroksi ketonlar — ular ham musbat natija beradi.)
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. KOMPLEKS BARQARORLIGI — β₁, β₂
// ============================================================================
function BarqarorlikKonstantasi() {
  const [logBeta2, setLogBeta2] = useState(7.2)
  const [Ag_t, setAgT] = useState(0.01) // M
  const [NH3_t, setNH3T] = useState(0.1) // M

  // β₂ = [Ag(NH₃)₂⁺] / ([Ag⁺][NH₃]²)
  const beta2 = Math.pow(10, logBeta2)

  // Soddalashtirilgan hisoblash: deyarli barcha Ag⁺ kompleksda
  const Ag_complex = Ag_t * 0.999
  const Ag_free = Ag_t * 0.001
  const NH3_free = NH3_t - 2 * Ag_complex

  const complexPercent = (Ag_complex / Ag_t) * 100

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ Kompleks barqarorligi — β₁, β₂</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4 font-mono text-center">
          <p className="text-purple-400 text-xs mb-2">Bosqichma-bosqich hosil bo'lish:</p>
          <p className="text-yellow-400 text-sm">Ag⁺ + NH₃ ⇌ [Ag(NH₃)]⁺ &nbsp;&nbsp; log K₁ = 3.3</p>
          <p className="text-yellow-400 text-sm mt-1">[Ag(NH₃)]⁺ + NH₃ ⇌ [Ag(NH₃)₂]⁺ &nbsp;&nbsp; log K₂ = 3.9</p>
          <p className="text-emerald-400 text-sm mt-2 font-bold">
            β₂ = K₁ × K₂ = 10<sup>7.2</sup>
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">log β₂:</span>
              <span className="text-emerald-400 font-mono">{logBeta2.toFixed(1)}</span>
            </label>
            <input type="range" min="5" max="10" step="0.1" value={logBeta2}
              onChange={(e) => setLogBeta2(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-slate-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400">[Ag⁺]<sub>t</sub>:</span>
                <span className="text-emerald-400 font-mono">{(Ag_t * 1000).toFixed(1)} mM</span>
              </label>
              <input type="range" min="0.001" max="0.1" step="0.001" value={Ag_t}
                onChange={(e) => setAgT(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-slate-400" />
            </div>
            <div>
              <label className="flex justify-between text-xs mb-1">
                <span className="text-yellow-400">[NH₃]<sub>t</sub>:</span>
                <span className="text-emerald-400 font-mono">{(NH3_t * 1000).toFixed(0)} mM</span>
              </label>
              <input type="range" min="0.01" max="1" step="0.01" value={NH3_t}
                onChange={(e) => setNH3T(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-900 rounded accent-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">β₂</p>
            <p className="text-emerald-400 font-bold font-mono">{beta2.toExponential(1)}</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-purple-400">[Ag⁺]<sub>erkin</sub></p>
            <p className="text-yellow-400 font-bold font-mono">{Ag_free.toExponential(1)} M</p>
          </div>
          <div className="bg-slate-700/40 border border-slate-500/40 rounded-lg p-3">
            <p className="text-slate-300">Kompleksda</p>
            <p className="text-emerald-400 font-bold font-mono">{complexPercent.toFixed(1)}%</p>
          </div>
        </div>

        {/* Taqqoslash */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-slate-300 font-bold text-xs mb-2">Turli Ag⁺ komplekslarining barqarorligi:</h5>
          <div className="space-y-2 text-xs">
            {[
              { ligand: "CN⁻", logBeta: 21.1, color: "bg-emerald-500" },
              { ligand: "S₂O₃²⁻", logBeta: 13.5, color: "bg-green-500" },
              { ligand: "NH₃", logBeta: 7.2, color: "bg-yellow-500" },
              { ligand: "Br⁻", logBeta: 7.8, color: "bg-orange-500" },
              { ligand: "Cl⁻", logBeta: 5.3, color: "bg-red-500" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-20 text-purple-200 font-mono">[Ag({l.ligand})₂]ⁿ</span>
                <div className="flex-1 h-4 bg-purple-900 rounded relative">
                  <div className={`h-full ${l.color} rounded`}
                    style={{width: `${(l.logBeta / 22) * 100}%`}}></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                    log β = {l.logBeta}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-purple-400 text-[10px] mt-2 text-center">
            CN⁻ eng kuchli ligand → eng barqaror kompleks
          </p>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun β₂ = 10⁷·² muhim?</p>
          <p className="text-purple-200">
            β₂ = 10⁷·² — <strong>o'rtacha barqaror</strong> kompleks. Bu yetarli:
            <br/>• Tollens reaktivini tayyorlash mumkin (erkin Ag⁺ juda kam)
            <br/>• Lekin aldegid qo'shilganda Ag⁰ ga qaytarish oson (Ag⁺ yetarli)
            <br/>• CN⁻ bilan (β₂ = 10²¹) — <strong>juda barqaror</strong>, qaytarish qiyin
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. NMR — ¹⁰⁹Ag, ¹⁰⁷Ag
// ============================================================================
function AgNMR() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧲 NMR — ¹⁰⁹Ag va ¹⁰⁷Ag izotoplari</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">💎 Noyob xususiyat:</p>
          <p className="text-purple-200 text-xs">
            Kumushning <strong>ikkala tabiiy izotopi</strong> ham NMR-faol:
            <strong> ¹⁰⁷Ag</strong> (51.8%, I=1/2) va <strong>¹⁰⁹Ag</strong> (48.2%, I=1/2).
            Bu metallar uchun <strong>noyob</strong> — ko'pchilik metallar NMR da ko'rinmaydi.
            Diamagnit bo'lgani uchun [Ag(NH₃)₂]⁺ aniq NMR spektri beradi.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-center">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <p className="text-purple-400 text-xs mb-1">¹⁰⁷Ag</p>
            <p className="text-slate-300 font-bold text-lg">I = 1/2</p>
            <p className="text-emerald-400 font-mono">51.8%</p>
            <p className="text-purple-500 text-[10px] mt-1">γ = 1.715 × 10⁷</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-4">
            <p className="text-purple-400 text-xs mb-1">¹⁰⁹Ag</p>
            <p className="text-slate-300 font-bold text-lg">I = 1/2</p>
            <p className="text-emerald-400 font-mono">48.2%</p>
            <p className="text-purple-500 text-[10px] mt-1">γ = 1.944 × 10⁷</p>
          </div>
        </div>

        {/* NMR SPEKTRI */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-slate-300 font-bold text-xs mb-2">¹⁰⁹Ag NMR spektri (sxematik):</h5>
          <svg viewBox="0 0 400 180" className="w-full h-40">
            <line x1="40" y1="140" x2="360" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="140" stroke="#4c1d95" strokeWidth="1" />
            <text x="200" y="170" fill="#c4b5fd" fontSize="9" textAnchor="middle">δ (ppm) — 0.1 M AgNO₃ standart</text>

            {/* Scale */}
            {[-500, 0, 500, 1000, 1500].map((v, i) => (
              <g key={i}>
                <line x1={40 + i * 80} y1="138" x2={40 + i * 80} y2="142" stroke="#a78bfa" strokeWidth="1" />
                <text x={40 + i * 80} y="155" fill="#a78bfa" fontSize="8" textAnchor="middle">{v}</text>
              </g>
            ))}

            {/* Sharp peak at ~50 ppm */}
            <polyline
              points={`180,140 185,130 190,90 195,40 200,90 205,130 210,140`}
              fill="none" stroke="#94a3b8" strokeWidth="2"
            />
            <text x="195" y="30" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
              [Ag(NH₃)₂]⁺
            </text>
            <text x="195" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle">~50 ppm</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-slate-300 font-bold text-xs mb-1">¹H NMR (NH₃ ligandlari):</p>
            <p className="text-purple-200 text-xs">
              δ ≈ <strong>2.5 ppm</strong> (erkin NH₃ dan pastroq)
              <br/>Sababi: Ag⁺ ga bog'langan NH₃ protonlari
              <strong> ekranlangan</strong> (d¹⁰ → dia-magnit oqim)
            </p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-slate-300 font-bold text-xs mb-1">¹⁴N NMR:</p>
            <p className="text-purple-200 text-xs">
              δ ≈ <strong>−360 ppm</strong> (NH₃)
              <br/>Ag⁺ bilan bog'lanish →
              <strong> kimyoviy siljish</strong> o'zgaradi
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Ag NMR qiyinchiliklari:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Past sezgirlik</strong> — ¹H dan ~10⁴ marta past</li>
            <li><strong>Keng diapazon</strong> — −6000 dan +3000 ppm gacha</li>
            <li><strong>Uzun T₁ relaksatsiya</strong> — ko'p skan kerak</li>
            <li>Lekin <strong>strukturaviy ma'lumot</strong> boy — ligand almashinish, koordinatsiya</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. UV-VIS — RANGSIZ (d¹⁰)
// ============================================================================
function UVVisSpektr() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🌈 UV-Vis spektri — rangsiz eritma</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-purple-950/50 rounded-lg p-4">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            <line x1="40" y1="170" x2="380" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <line x1="40" y1="20" x2="40" y2="170" stroke="#4c1d95" strokeWidth="1" />
            <text x="210" y="195" fill="#c4b5fd" fontSize="10" textAnchor="middle">λ (nm)</text>
            <text x="15" y="95" fill="#c4b5fd" fontSize="9" transform="rotate(-90, 15, 95)">A</text>

            {[200, 300, 400, 500, 600, 700].map((wl, i) => (
              <text key={i} x={40 + ((wl - 180) / 540) * 340} y="185" fill="#a78bfa" fontSize="8" textAnchor="middle">
                {wl}
              </text>
            ))}

            {/* Faqat UV da kuchsiz LMCT */}
            <polyline
              points={Array.from({ length: 100 }, (_, i) => {
                const wl = 180 + i * 5.4
                const x = 40 + (i / 100) * 340

                // Faqat UV da kuchsiz cho'qqi (LMCT)
                const p1 = Math.exp(-0.5 * Math.pow((wl - 220) / 15, 2)) * 40
                const y = 170 - p1
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#94a3b8" strokeWidth="2" />

            {/* Ko'rinadigan sohada tekis */}
            <text x="280" y="165" fill="#10b981" fontSize="9" textAnchor="middle">
              Ko'rinadigan sohada yutilish yo'q!
            </text>

            <line x1="50" y1="130" x2="50" y2="25" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x="50" y="20" fill="#f59e0b" fontSize="8" textAnchor="middle">220 nm (LMCT)</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-slate-300 font-bold mb-1">220 nm</p>
            <p className="text-purple-200">LMCT (N → Ag)</p>
            <p className="text-purple-400 text-[10px]">ε ≈ 300 M⁻¹cm⁻¹</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-slate-300 font-bold mb-1">400-700 nm</p>
            <p className="text-emerald-400">Yutilish YO'Q</p>
            <p className="text-purple-400 text-[10px]">ε &lt; 1</p>
          </div>
          <div className="bg-purple-950/50 rounded-lg p-3">
            <p className="text-slate-300 font-bold mb-1">Natija</p>
            <p className="text-slate-300 font-bold">RANGSIZ</p>
            <p className="text-purple-400 text-[10px]">Barcha λ o'tadi</p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun rangsiz?</p>
          <p className="text-purple-200">
            <strong>d¹⁰ konfiguratsiya</strong> — barcha d-orbitallar to'liq to'lgan.
            <strong> d-d o'tishlar mumkin emas</strong> (bo'sh d-orbital yo'q).
            Faqat yuqori energiyali LMCT (N → Ag) bor, lekin u <strong>UV sohada</strong> (220 nm).
            Ko'rinadigan nur (400-700 nm) <strong>to'liq o'tadi</strong> → eritma rangsiz.
          </p>
        </div>

        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-slate-300 font-bold text-xs mb-2">Taqqoslash — rangli va rangsiz:</h5>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-1 text-yellow-400">Kompleks</th>
                  <th className="text-center py-1 text-yellow-400">dⁿ</th>
                  <th className="text-center py-1 text-yellow-400">d-d</th>
                  <th className="text-left py-1 text-yellow-400">Rang</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ag(NH₃)₂]⁺", "d¹⁰", "Yo'q", "Rangsiz"],
                  ["[Cu(NH₃)₄]²⁺", "d⁹", "Bor", "To'q ko'k"],
                  ["[Co(NH₃)₆]³⁺", "d⁶ LS", "Bor", "Sariq"],
                  ["[Zn(H₂O)₆]²⁺", "d¹⁰", "Yo'q", "Rangsiz"],
                  ["[Ni(H₂O)₆]²⁺", "d⁸", "Bor", "Yashil"],
                ].map((r, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-slate-700/20' : ''}`}>
                    <td className="py-1 font-bold text-slate-300">{r[0]}</td>
                    <td className="py-1 text-center font-mono">{r[1]}</td>
                    <td className="py-1 text-center">{r[2]}</td>
                    <td className="py-1">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 7. FOTOGRAFIYA KIMYOSI
// ============================================================================
function Fotokimyo() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Kumush galogenid (AgBr)",
      desc: "Fotografik plyonka — AgBr kristallari jelatinda",
      formula: "AgBr (kristall, sariq-och)",
      icon: "📸",
      rang: "bg-amber-900/30 border-amber-500/30"
    },
    {
      title: "2. Yorug'lik ta'siri",
      desc: "Foton AgBr ni parchalaydi — yashirin tasvir",
      formula: "2 AgBr + hν → 2 Ag⁰ + Br₂",
      icon: "☀️",
      rang: "bg-yellow-900/30 border-yellow-500/30"
    },
    {
      title: "3. Namoyon qilish (developer)",
      desc: "Yashirin tasvirni kuchaytirish — ko'rinadigan tasvir",
      formula: "Ag⁺ + e⁻ (developer) → Ag⁰ (qora)",
      icon: "🖼️",
      rang: "bg-slate-700/30 border-slate-500/30"
    },
    {
      title: "4. Fiksaj — [Ag(NH₃)₂]⁺ yoki [Ag(S₂O₃)₂]³⁻",
      desc: "Reaksiyaga kirmagan AgBr ni eritish",
      formula: "AgBr + 2 S₂O₃²⁻ → [Ag(S₂O₃)₂]³⁻ + Br⁻",
      icon: "🧪",
      rang: "bg-purple-900/30 border-purple-500/30"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📷 Fotografiya kimyosi — [Ag(NH₃)₂]⁺ ning roli</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
          <p className="text-yellow-400 font-bold mb-2">🎞️ Tarixiy ahamiyat:</p>
          <p className="text-purple-200 text-xs">
            <strong>Fotografiya</strong> — kumush kimyosining eng muhim qo'llanilishi (150 yil).
            [Ag(NH₃)₂]⁺ dastlabki <strong>fiksaj</strong> eritmasi sifatida ishlatilgan.
            Keyinchalik barqarorroq <strong>Na₂S₂O₃</strong> (giposulfit) almashtirdi.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i
                  ? "bg-slate-600/80 text-white shadow-lg"
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className={`rounded-xl p-5 border ${s.rang}`}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-yellow-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-950/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        {/* VIZUALIZATSIYA */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-slate-300 font-bold text-xs mb-3">Fotografik jarayon:</h5>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Plyonka", color: "bg-amber-500", icon: "📸" },
              { label: "Yorug'lik", color: "bg-yellow-500", icon: "☀️" },
              { label: "Tasvir", color: "bg-slate-500", icon: "🖼️" },
              { label: "Fiksaj", color: "bg-purple-500", icon: "🧪" },
            ].map((p, i) => (
              <div key={i} className={`${p.color}/30 border border-${p.color.split('-')[1]}-500/30 rounded-lg p-3 ${step === i ? 'ring-2 ring-yellow-400' : ''}`}>
                <div className="text-2xl mb-1">{p.icon}</div>
                <p className="text-purple-200 text-[10px]">{p.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun [Ag(NH₃)₂]⁺ fiksajda?</p>
          <p className="text-purple-200">
            Reaksiyaga kirmagan <strong>AgBr</strong> plyonka ustida qolsa, yorug'lik ta'sirida
            qorayib ketadi. Uni <strong>eritib yuborish</strong> kerak.
            [Ag(NH₃)₂]⁺ (yoki [Ag(S₂O₃)₂]³⁻) — <strong>eruvchan kompleks</strong> hosil qilib,
            AgBr ni plyonkadan olib tashlaydi. Natija — <strong>barqaror negativ</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 8. TARIXIY KONTEKST
// ============================================================================
function TarixiyKontekst() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏛️ Tarixiy kontekst — Tollens va kumush kimyosi</h3>

      <div className="bg-gradient-to-br from-slate-900/30 to-purple-900/30 rounded-xl p-5 border border-slate-500/30 space-y-4">
        <div className="space-y-3">
          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🧪</div>
              <div>
                <p className="text-yellow-400 font-bold">1882 — Bernhard Tollens</p>
                <p className="text-purple-200 text-xs mt-1">
                  German kimyogari <strong>Bernhard Tollens</strong> [Ag(NH₃)₂]⁺ eritmasini
                  aldegidlarni aniqlash uchun taklif qildi. Bu <strong>analitik kimyoning</strong>
                  klassik usullaridan biriga aylandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🪞</div>
              <div>
                <p className="text-yellow-400 font-bold">1835 — Justus von Liebig</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Kumush ko'zgu</strong> texnologiyasini ixtiro qildi.
                  Dastlab shisha buyumlarini kumush bilan qoplash uchun ishlatilgan.
                  Keyinchalik <strong>ko'zgu sanoati</strong> rivojlandi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">📷</div>
              <div>
                <p className="text-yellow-400 font-bold">1839 — Daguerre va Talbot</p>
                <p className="text-purple-200 text-xs mt-1">
                  <strong>Fotografiya</strong> ixtiro qilindi. Kumush galogenidlarning
                  yorug'likka sezgirligi asosida. [Ag(NH₃)₂]⁺ fiksaj eritmasi sifatida
                  ishlatilgan. 150 yil davomida <strong>asosiy texnologiya</strong> bo'ldi.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-yellow-400 font-bold">1912 — Alfred Werner (takror)</p>
                <p className="text-purple-200 text-xs mt-1">
                  Werner [Ag(NH₃)₂]⁺ ning <strong>chiziqli geometriyasini</strong>
                  eksperimental isbotladi. Bu uning <strong>koordinatsion nazariyasining</strong>
                  yana bir dalili edi (koordinatsion son = 2).
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Kumush kimyosining ahamiyati:</p>
          <ul className="text-purple-200 space-y-1 list-disc list-inside">
            <li><strong>Analitik kimyo</strong> — aldegid/keton farqlash</li>
            <li><strong>Fotografiya</strong> — 150 yillik texnologiya</li>
            <li><strong>Ko'zgu sanoati</strong> — Liebig usuli</li>
            <li><strong>Koordinatsion kimyo</strong> — chiziqli geometriya isboti</li>
            <li><strong>Antimikrob</strong> — kolloid kumush (hozirgi nano-texnologiya)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 9. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-slate-300 font-bold mb-2">Analitik kimyo</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Tollens testi</strong> — aldegid aniqlash</li>
              <li>Sifat reaksiyasi (glukoza, formaldegid)</li>
              <li>Terminal alkinlarni aniqlash</li>
              <li>Kumush ko'zgu — idishlarni qoplash</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">📷</div>
            <h4 className="text-slate-300 font-bold mb-2">Fotografiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Fiksaj eritmasi (tarixiy)</li>
              <li>Kumush galogenidlari bilan ish</li>
              <li>Negativ va plyonkalar</li>
              <li>Hozir — raqamli (lekin san'atda saqlangan)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🪞</div>
            <h4 className="text-slate-300 font-bold mb-2">Ko'zgu va qoplamalar</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Shisha ko'zgu ishlab chiqarish</li>
              <li>Termos ichki qoplami</li>
              <li>Bayram bezaklari (kumushlangan shisha)</li>
              <li>Elektronika (o'tkazuvchi qoplamalar)</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-slate-300 font-bold mb-2">Tibbiyot</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Kolloid kumush</strong> — antimikrob</li>
              <li>Kumush nitrat — <strong>lapis</strong> (ko'z tomchisi)</li>
              <li>Yara davolash (kumushli bog'lov)</li>
              <li>Nano-kumush — zamonaviy qo'llanilish</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-slate-300 font-bold mb-2">Elektronika</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li><strong>Eng yaxshi elektr o'tkazuvchi</strong> metall</li>
              <li>Elektr kontaktlari</li>
              <li>Batareyalar (Ag-Zn, Ag-Cd)</li>
              <li>Yuqori sifatli simlar</li>
            </ul>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="text-slate-300 font-bold mb-2">Zargarlik va investitsiya</h4>
            <ul className="text-purple-200 text-xs space-y-1 list-disc list-inside">
              <li>Kumush tangalar</li>
              <li>Zargarlik buyumlari (925 sterling)</li>
              <li>Investitsiya metalli</li>
              <li>Antika buyumlar</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-700/20 border border-slate-500/30 rounded-lg p-4">
          <p className="text-slate-300 font-bold mb-2">🌟 Qiziqarli faktlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Kumush — <strong>eng yaxshi elektr va issiqlik o'tkazuvchi</strong> barcha metallar orasida</li>
            <li>• <strong>Antimikrob ta'siri</strong> — oligodinamik effekt (ionlar oqsillarni denaturatsiya qiladi)</li>
            <li>• <strong>Yer yuzida kam</strong> — 0.08 ppm (oltindan ko'p, lekin baribir kam)</li>
            <li>• <strong>Valyuta</strong> sifatida 5000 yil ishlatilgan</li>
            <li>• <strong>Fotografiya</strong> — 20-asrda kumushning 30% i shu sohaga sarflangan</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 10. AG(I) KOMPLEKSLARI SOLISHTIRISH
// ============================================================================
function SolishtirishJadvali() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Ag(I) komplekslari solishtirilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-slate-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Kompleks</th>
                <th className="text-center py-3 px-2 text-yellow-400">Geometriya</th>
                <th className="text-center py-3 px-2 text-yellow-400">log β₂</th>
                <th className="text-center py-3 px-2 text-yellow-400">Magnit</th>
                <th className="text-left py-3 px-2 text-yellow-400">Qo'llanilishi</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["[Ag(NH₃)₂]⁺", "Chiziqli", "7.2", "Diamagnit", "Tollens reaktivi"],
                ["[Ag(CN)₂]⁻", "Chiziqli", "21.1", "Diamagnit", "Elektroplating"],
                ["[Ag(S₂O₃)₂]³⁻", "Chiziqli", "13.5", "Diamagnit", "Fiksaj (foto)"],
                ["[AgCl₂]⁻", "Chiziqli", "5.3", "Diamagnit", "Konsentratsiyalangan HCl"],
                ["[Ag(py)₂]⁺", "Chiziqli", "6.5", "Diamagnit", "Organik erituvchi"],
                ["[Ag(en)]⁺", "Chiziqli", "4.7", "Diamagnit", "Bidentat ligand"],
              ].map((r, i) => (
                <tr key={i} className={`border-b border-purple-800/30 ${i === 0 ? 'bg-slate-700/20' : ''} hover:bg-purple-800/20`}>
                  <td className="py-2 px-2 font-bold text-slate-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center">{r[1]}</td>
                  <td className="py-2 px-2 text-center font-mono">{r[2]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[3]}</td>
                  <td className="py-2 px-2 text-[11px]">{r[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-purple-400 text-xs mt-3">
          * Barcha Ag(I) (d¹⁰) komplekslar — <strong>diamagnit, rangsiz, chiziqli</strong>.
          Farq faqat <strong>barqarorlikda</strong> (log β₂) va <strong>qo'llanilishda</strong>.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function AgNH32Magnit() {
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
          <span className="text-slate-300">[Ag(NH₃)₂]⁺</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-slate-300">🧲 [Ag(NH₃)₂]⁺ — Magnit tahlili</h1>
          <p className="text-purple-400 text-sm">
            Ag⁺ (d¹⁰, S=0) • Diamagnit • Chiziqli • Tollens reaktivi • Kumush ko'zgu
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-slate-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-2xl md:text-4xl font-extrabold font-mono text-slate-300">[Ag(NH₃)₂]⁺</span>
            <div>
              <h2 className="text-xl font-bold text-white">Magnit tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Diamminikumush(I)" — Tollens reaktivi</p>
            </div>
          </div>

          <div className="bg-slate-700/20 border border-slate-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              [Ag(NH₃)₂]⁺ — <strong className="text-slate-300">klassik chiziqli kompleks</strong>.
              Ag⁺ <strong>d¹⁰ konfiguratsiyaga</strong> ega — barcha elektronlar juftlashgan,
              <strong> S = 0</strong>, <strong>diamagnit</strong>. μ<sub>eff</sub> = 0 μ<sub>B</sub>.
              Koordinatsion son = 2, <strong>sp gibridlanish</strong>, burchak = 180°.
              <strong> Tollens reaktivi</strong> sifatida aldegidlarni aniqlashda ishlatiladi.
              Rangsiz eritma (d-d o'tishlar yo'q).
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-slate-300 font-bold text-lg">d¹⁰, S=0</p>
              <p className="text-purple-300">to'liq to'lgan</p>
              <p className="text-purple-400 mt-1">Diamagnit</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-slate-300 font-bold text-lg">μ = 0 μ<sub>B</sub></p>
              <p className="text-purple-300">n = 0</p>
              <p className="text-purple-400 mt-1">ideal</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-slate-300 font-bold text-lg">180°</p>
              <p className="text-purple-300">chiziqli</p>
              <p className="text-purple-400 mt-1">sp gibrid</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-slate-300 font-bold text-lg">log β₂ = 7.2</p>
              <p className="text-purple-300">barqarorlik</p>
              <p className="text-purple-400 mt-1">o'rtacha</p>
            </div>
          </div>
        </div>

        {/* CHIZIQLI GEOMETRIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <ChiziqliGeometriya />
        </div>

        {/* SPIN-ONLY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SpinOnlyCalc />
        </div>

        {/* TOLLENS REAKTIVI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TollensReaktivi />
        </div>

        {/* BARQARORLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BarqarorlikKonstantasi />
        </div>

        {/* NMR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AgNMR />
        </div>

        {/* UV-VIS */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <UVVisSpektr />
        </div>

        {/* FOTOKIMYO */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Fotokimyo />
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
        <div className="bg-gradient-to-r from-slate-600/10 to-purple-600/10 border border-slate-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Ag⁺ (d¹⁰) — <strong className="text-slate-300">mukammal diamagnit</strong>, barcha elektronlar juftlashgan</li>
            <li>μ<sub>eff</sub> = <strong>0 μ<sub>B</sub></strong> — spin-only bilan ideal mos</li>
            <li><strong className="text-slate-300">Chiziqli geometriya</strong> (180°) — sp gibridlanish, KS=2</li>
            <li>Rangsiz eritma — <strong>d-d o'tishlar yo'q</strong> (d¹⁰)</li>
            <li><strong className="text-slate-300">Tollens reaktivi</strong> — aldegid/keton farqlash</li>
            <li><strong>Kumush ko'zgu</strong> reaksiyasi — klassik analitik usul</li>
            <li>log β₂ = <strong>7.2</strong> — o'rtacha barqaror kompleks</li>
            <li>¹⁰⁷Ag, ¹⁰⁹Ag (I=1/2) — <strong>NMR-faol</strong> izotoplar</li>
            <li>Fotografiya kimyosida <strong>fiksaj</strong> eritmasi (tarixiy)</li>
            <li>Tarixiy ahamiyati: <strong>Tollens (1882), Liebig (1835)</strong></li>
            <li>Amaliy qo'llanilishi: analitik kimyo, ko'zgu, tibbiyot, elektronika</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/magnit/birikmalar/cu-h2o6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← [Cu(H₂O)₆]²⁺
          </Link>
          <Link href="/ilmiy/tahlil/magnit/birikmalar/co-cl4" className="px-6 py-3 bg-slate-600/80 rounded-xl hover:bg-slate-500 text-white font-semibold">
            [CoCl₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}