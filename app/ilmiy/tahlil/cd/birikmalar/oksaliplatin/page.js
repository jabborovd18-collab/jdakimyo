"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ============================================================================
// 1. CD SPEKTR SIMULYATORI (Oksaliplatin uchun)
// ============================================================================
function CDSpectrumSimulator() {
  const [enantiomer, setEnantiomer] = useState("1R2R")
  const [ee, setEe] = useState(100)
  const [concentration, setConcentration] = useState(1.0)

  // Oksaliplatin CD spektri xarakteristikalari
  const enantiomers = {
    "1R2R": {
      name: "(1R,2R)-oksalipatin",
      desc: "Faol enantiomer — saraton dorisi",
      lmct: 254,
      lmct_de: 3.5,
      intraligand: 215,
      il_de: -2.0,
      sign: 1,
      color: "#f97316"
    },
    "1S2S": {
      name: "(1S,2S)-oksalipatin",
      desc: "Faol emas — enantiomer",
      lmct: 254,
      lmct_de: -3.5,
      intraligand: 215,
      il_de: 2.0,
      sign: -1,
      color: "#8b5cf6"
    },
    "ratsemik": {
      name: "Ratsemik aralashma",
      desc: "50:50 aralashma — CD = 0",
      lmct: 254,
      lmct_de: 0,
      intraligand: 215,
      il_de: 0,
      sign: 0,
      color: "#6b7280"
    }
  }

  const e = enantiomers[enantiomer]
  const eeFactor = (ee / 100) * concentration

  // CD spektri simulyatsiyasi
  const spectrum = useMemo(() => {
    const points = []
    for (let i = 0; i < 400; i++) {
      const lambda = 190 + i * 0.75 // 190-490 nm
      let cotton = 0
      let absorption = 0

      // LMCT o'tish (254 nm)
      const x1 = (lambda - e.lmct) / 15
      const cotton_lmct = e.sign * x1 * Math.exp(-0.5 * x1 * x1) * e.lmct_de * eeFactor
      const abs_lmct = Math.exp(-0.5 * x1 * x1) * 8000 * concentration

      // Intraligand o'tish (215 nm)
      const x2 = (lambda - e.intraligand) / 12
      const cotton_il = e.sign * x2 * Math.exp(-0.5 * x2 * x2) * e.il_de * eeFactor
      const abs_il = Math.exp(-0.5 * x2 * x2) * 12000 * concentration

      cotton = cotton_lmct + cotton_il
      absorption = abs_lmct + abs_il

      points.push({ lambda, cotton, absorption })
    }
    return points
  }, [enantiomer, ee, concentration, e, eeFactor])

  const maxCotton = Math.max(...spectrum.map(p => Math.abs(p.cotton)), 0.1)
  const maxAbs = Math.max(...spectrum.map(p => p.absorption), 0.1)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📊 CD spektr simulyatori — Oksaliplatin</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">💎 Xiral dori vositasi — enantiomerlar farqi:</p>
          <p className="text-purple-200 text-xs">
            Oksaliplatin — <strong>(1R,2R)-dchxn</strong> ligandli platina kompleksi.
            Faqat <strong>(1R,2R) enantiomer</strong> saraton davolashda faol.
            CD spektroskopiyasi orqali <strong>enantiomer tozaligi (ee%)</strong> aniqlanadi.
            (1S,2S) enantiomer CD spektri <strong>teskari belgi</strong>ga ega.
          </p>
        </div>

        {/* ENANTIOMER TANLASH */}
        <div>
          <label className="text-xs text-yellow-400 font-bold mb-2 block">Enantiomer:</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(enantiomers).map(([key, val]) => (
              <button key={key} onClick={() => setEnantiomer(key)}
                className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all ${
                  enantiomer === key 
                    ? "bg-orange-600/80 text-white shadow-lg" 
                    : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
                }`}>
                <div className="text-xs">{val.name.split('-')[0]}</div>
                <div className="text-[9px] opacity-70 mt-1">{val.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* EE va KONSENTRATSIYA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">ee (%):</span>
              <span className="text-emerald-400 font-mono">{ee}%</span>
            </label>
            <input type="range" min="0" max="100" step="5" value={ee}
              onChange={(e) => setEe(parseInt(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          </div>
          <div>
            <label className="flex justify-between text-xs mb-1">
              <span className="text-yellow-400 font-bold">Konsentratsiya (mM):</span>
              <span className="text-emerald-400 font-mono">{concentration.toFixed(1)}</span>
            </label>
            <input type="range" min="0.1" max="5.0" step="0.1" value={concentration}
              onChange={(e) => setConcentration(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-900 rounded accent-orange-500" />
          </div>
        </div>

        {/* SPEKTR */}
        <div className="bg-purple-950/50 rounded-lg p-4">
          <h5 className="text-orange-400 font-bold text-xs mb-2">
            CD spektri: {e.name}
          </h5>
          <svg viewBox="0 0 400 280" className="w-full h-64">
            <line x1="40" y1="140" x2="380" y2="140" stroke="#4c1d95" strokeWidth="1" strokeDasharray="2,2" />
            <line x1="40" y1="20" x2="40" y2="260" stroke="#4c1d95" strokeWidth="1" />
            
            <text x="210" y="275" fill="#c4b5fd" fontSize="9" textAnchor="middle">λ (nm)</text>
            <text x="40" y="270" fill="#a78bfa" fontSize="8">190</text>
            <text x="380" y="270" fill="#a78bfa" fontSize="8" textAnchor="end">490</text>
            <text x="20" y="140" fill="#a78bfa" fontSize="8" textAnchor="middle" transform="rotate(-90, 20, 140)">
              Δε
            </text>

            {/* λ_max belgilari */}
            <line x1={40 + ((e.lmct - 190) / 300) * 340} y1="20" x2={40 + ((e.lmct - 190) / 300) * 340} y2="260"
              stroke="#fbbf24" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((e.lmct - 190) / 300) * 340} y="15" fill="#fbbf24" fontSize="7" textAnchor="middle">
              LMCT ({e.lmct} nm)
            </text>

            <line x1={40 + ((e.intraligand - 190) / 300) * 340} y1="20" x2={40 + ((e.intraligand - 190) / 300) * 340} y2="260"
              stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={40 + ((e.intraligand - 190) / 300) * 340} y="15" fill="#a78bfa" fontSize="7" textAnchor="middle">
              IL ({e.intraligand} nm)
            </text>

            {/* Absorbsiya */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 260 - (p.absorption / maxAbs) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6"
            />

            {/* CD spektri */}
            <polyline
              points={spectrum.map((p, i) => {
                const x = 40 + (i / 400) * 340
                const y = 140 - (p.cotton / maxCotton) * 110
                return `${x},${y}`
              }).join(' ')}
              fill="none" stroke={e.color} strokeWidth="2"
            />

            <text x="280" y="30" fill="#fbbf24" fontSize="8">— Absorbsiya</text>
            <text x="280" y="45" fill={e.color} fontSize="8">— CD (Δε)</text>
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs text-center">
          <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-3">
            <p className="text-orange-400">Enantiomer</p>
            <p className="text-orange-400 font-bold text-[10px]">{enantiomer}</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">ee</p>
            <p className="text-emerald-400 font-bold">{ee}%</p>
          </div>
          <div className="bg-purple-900/50 rounded-lg p-3">
            <p className="text-purple-400">LMCT CD</p>
            <p className={`font-bold ${e.sign > 0 ? "text-emerald-400" : e.sign < 0 ? "text-red-400" : "text-purple-400"}`}>
              {e.sign > 0 ? "+" : e.sign < 0 ? "−" : ""}{Math.abs(e.lmct_de * eeFactor).toFixed(1)}
            </p>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD orqali enantiomer tozaligi:</p>
          <p className="text-purple-200">
            <strong>ee = 100%</strong> → maksimal CD signali (Δε ≈ ±3.5)
            <br/>
            <strong>ee = 50%</strong> → CD signali 2 marta kuchsiz
            <br/>
            <strong>ee = 0%</strong> → CD = 0 (ratsemik aralashma)
            <br/>
            Farmatsevtikada <strong>ee &gt; 99%</strong> talab qilinadi.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 2. STRUKTURA VA XIRALLIK
// ============================================================================
function StrukturVaXirallik() {
  const [showDchxn, setShowDchxn] = useState(true)

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔗 Oksaliplatin strukturasi — xiral dchxn ligand</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">
              {showDchxn ? "(1R,2R)-dchxn ligand" : "Umumiy struktura"}
            </h4>
            <svg viewBox="0 0 200 200" className="w-full h-48">
              {showDchxn ? (
                <>
                  {/* Siklogeksan halqasi */}
                  <polygon 
                    points="60,80 80,60 120,60 140,80 140,120 120,140 80,140 60,120" 
                    fill="none" 
                    stroke="#f97316" 
                    strokeWidth="2"
                  />
                  
                  {/* Uglerodlar */}
                  <circle cx="80" cy="60" r="6" fill="#6b7280" />
                  <text x="80" y="63" fill="white" fontSize="6" textAnchor="middle">C</text>
                  
                  <circle cx="120" cy="60" r="6" fill="#6b7280" />
                  <text x="120" y="63" fill="white" fontSize="6" textAnchor="middle">C</text>

                  {/* N atomlari */}
                  <line x1="80" y1="60" x2="80" y2="30" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="80" cy="30" r="7" fill="#3b82f6" />
                  <text x="80" y="33" fill="white" fontSize="6" textAnchor="middle">N</text>
                  
                  <line x1="120" y1="60" x2="120" y2="30" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="120" cy="30" r="7" fill="#3b82f6" />
                  <text x="120" y="33" fill="white" fontSize="6" textAnchor="middle">N</text>

                  {/* Stereomarkazlar */}
                  <circle cx="80" cy="60" r="10" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
                  <circle cx="120" cy="60" r="10" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="2,2" />
                  <text x="80" y="50" fill="#fbbf24" fontSize="7" textAnchor="middle">R</text>
                  <text x="120" y="50" fill="#fbbf24" fontSize="7" textAnchor="middle">R</text>

                  <text x="100" y="170" fill="#f97316" fontSize="8" textAnchor="middle">
                    (1R,2R)-dchxn
                  </text>
                  <text x="100" y="185" fill="#fbbf24" fontSize="7" textAnchor="middle">
                    2 ta stereomarkaz
                  </text>
                </>
              ) : (
                <>
                  {/* Pt markazi */}
                  <circle cx="100" cy="100" r="15" fill="#f97316" />
                  <text x="100" y="104" fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">Pt</text>

                  {/* Dchxn ligand */}
                  <line x1="100" y1="100" x2="60" y2="60" stroke="#3b82f6" strokeWidth="2" />
                  <line x1="100" y1="100" x2="140" y2="60" stroke="#3b82f6" strokeWidth="2" />
                  <rect x="45" y="45" width="30" height="30" fill="#3b82f6" opacity="0.3" rx="5" />
                  <text x="60" y="63" fill="white" fontSize="7" textAnchor="middle">dchxn</text>
                  
                  <rect x="125" y="45" width="30" height="30" fill="#3b82f6" opacity="0.3" rx="5" />
                  <text x="140" y="63" fill="white" fontSize="7" textAnchor="middle">dchxn</text>

                  {/* Oksalat ligand */}
                  <line x1="100" y1="100" x2="60" y2="140" stroke="#ef4444" strokeWidth="2" />
                  <line x1="100" y1="100" x2="140" y2="140" stroke="#ef4444" strokeWidth="2" />
                  <rect x="45" y="125" width="30" height="30" fill="#ef4444" opacity="0.3" rx="5" />
                  <text x="60" y="143" fill="white" fontSize="7" textAnchor="middle">ox</text>
                  
                  <rect x="125" y="125" width="30" height="30" fill="#ef4444" opacity="0.3" rx="5" />
                  <text x="140" y="143" fill="white" fontSize="7" textAnchor="middle">ox</text>

                  <text x="100" y="185" fill="#f97316" fontSize="8" textAnchor="middle">
                    Kvadrat planar kompleks
                  </text>
                </>
              )}
            </svg>

            <button onClick={() => setShowDchxn(!showDchxn)}
              className="w-full mt-2 px-3 py-2 bg-orange-600/30 hover:bg-orange-600/50 rounded text-xs text-orange-400 transition-all">
              {showDchxn ? "Umumiy struktura ko'rish" : "dchxn ligand ko'rish"}
            </button>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">Xususiyatlari:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Metal markaz:</span>
                <span className="text-orange-400 font-bold">Pt²⁺ (d⁸)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Geometriya:</span>
                <span className="text-emerald-400">Kvadrat planar</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Ligandlar:</span>
                <span className="text-orange-400">dchxn + oksalat</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">dchxn konfiguratsiya:</span>
                <span className="text-orange-400 font-bold">(1R,2R)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Stereomarkazlar:</span>
                <span className="text-orange-400 font-bold">2 ta</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Molekulyar massa:</span>
                <span className="text-orange-400">393.3 g/mol</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Rang:</span>
                <span className="text-purple-200">Rangsiz/oq</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun (1R,2R) faol?</p>
          <p className="text-purple-200">
            <strong>(1R,2R)-dchxn</strong> — DNK bilan bog'langanda ma'lum bir <strong>konformatsiya</strong> hosil qiladi.
            Bu konformatsiya <strong>DNK repair mexanizmlari</strong> tomonidan taniilmaydi →
            saraton hujayrasi <strong>apoptoz</strong>ga uchraydi.
            <br/>
            <strong>(1S,2S)-dchxn</strong> — boshqa konformatsiya → repair mexanizmlari taniydi → samarasiz.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 3. SISPLATIN BILAN SOLISHTIRISH
// ============================================================================
function SisplatinBilanSolishtirish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔄 Oksaliplatin vs Sisplatin — solishtirish</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-2 text-yellow-400">Xususiyat</th>
                <th className="text-center py-3 px-2 text-blue-400">Sisplatin</th>
                <th className="text-center py-3 px-2 text-orange-400">Oksaliplatin</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["IUPAC nomi", "cis-[PtCl₂(NH₃)₂]", "(1R,2R-dchxn)oxalatoplatina"],
                ["Ligandlar", "2 Cl⁻ + 2 NH₃", "dchxn + oksalat"],
                ["Xirallik", "Axiral", "Xiral (1R,2R)"],
                ["Stereomarkazlar", "0", "2"],
                ["CD signali", "Yo'q", "Ha (Δε ≈ ±3.5)"],
                ["Molekulyar massa", "300 g/mol", "393 g/mol"],
                ["Asosiy qo'llanilish", "Testis, ovary", "Kolorektal"],
                ["Neyrotoksiklik", "Past", "Yuqori"],
                ["Nefrotoksiklik", "Yuqori", "Past"],
                ["Rezistentlik", "Tez rivojlanadi", "Sisplatindan keyin ham faol"],
                ["FDA tasdiqlangan", "1978", "2002"],
                ["Narx", "Arzon", "Qimmat"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-2 font-bold text-purple-300">{r[0]}</td>
                  <td className="py-2 px-2 text-center text-blue-400">{r[1]}</td>
                  <td className="py-2 px-2 text-center text-orange-400">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 bg-orange-600/10 border border-orange-500/30 rounded-lg p-3 text-xs">
          <p className="text-orange-400 font-bold mb-1">💡 Afzalliklari:</p>
          <p className="text-purple-200">
            <strong>Oksaliplatin</strong> — sisplatin rezistent bo'lgan saratonlarda ham <strong>faol</strong>.
            <br/>
            <strong>Nefrotoksiklik past</strong> — buyrak funksiyasi buzilmaydi.
            <br/>
            <strong>CD orqali sifat nazorati</strong> — enantiomer tozaligi (ee%) oson aniqlanadi.
            <br/>
            Lekin <strong>neyrotoksiklik yuqori</strong> — periferik nevropatiya.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 4. DNK BILAN BOG'LANISH
// ============================================================================
function DNKBilanBoglanish() {
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "1. Hujayraga kirish",
      desc: "Oksaliplatin qon orqali saraton hujayrasiga kiradi",
      formula: "Oksaliplatin → hujayra ichiga",
      icon: "💊"
    },
    {
      title: "2. Akvatsiya",
      desc: "Oksalat ligand chiqib ketadi, faol platina kompleksi hosil bo'ladi",
      formula: "[Pt(dchxn)(ox)] + H₂O → [Pt(dchxn)(H₂O)₂]²⁺",
      icon: "💧"
    },
    {
      title: "3. DNK ga bog'lanish",
      desc: "Aktiv platina 2 ta guanin bazasiga bog'lanadi",
      formula: "[Pt(dchxn)(H₂O)₂]²⁺ + DNA → Pt-DNA addukt",
      icon: "🧬"
    },
    {
      title: "4. 1,2-Intrastrand crosslink",
      desc: "Qo'shni G-G bazalari orasida platina ko'prigi",
      formula: "Pt(dchxn) bog'laydi 2 ta G (N7)",
      icon: "🔗"
    },
    {
      title: "5. DNK egilishi va apoptoz",
      desc: "DNK strukturasi buziladi → hujayra o'limi",
      formula: "DNK addukt → repair yo'q → apoptoz",
      icon: "☠️"
    }
  ]

  const s = steps[step]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🧬 DNK bilan bog'lanish mexanizmi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">💎 Sisplatin bilan bir xil mexanizm:</p>
          <p className="text-purple-200 text-xs">
            Oksaliplatin ham <strong>DNK bilan crosslink</strong> hosil qiladi.
            Lekin <strong>dchxn ligand</strong> tufayli addukt <strong>boshqacha taniladi</strong> —
            repair mexanizmlari uni yo'q qila olmaydi.
          </p>
        </div>

        {/* STEP NAVIGATION */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              className={`flex-1 px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                step === i 
                  ? "bg-orange-600/80 text-white shadow-lg" 
                  : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT STEP */}
        <div className="bg-purple-950/50 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{s.icon}</span>
            <h4 className="text-orange-400 font-bold text-lg">{s.title}</h4>
          </div>
          <p className="text-purple-200 text-sm mb-3">{s.desc}</p>
          <div className="bg-purple-900/50 rounded p-3 font-mono text-xs text-center text-emerald-400">
            {s.formula}
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 Nima uchun sisplatin rezistentligini yengadi?</p>
          <p className="text-purple-200">
            <strong>(1R,2R)-dchxn</strong> — katta, gidrofob ligand.
            <br/>
            Pt-DNA addukti <strong>HMGB1 oqsillari</strong> tomonidan taniydi →
            repair mexanizmlari <strong>bloklangan</strong> → apoptoz.
            <br/>
            Sisplatinda bu ligand yo'q (faqat NH₃) → repair mexanizmlari adduktni taniydi → samarasiz.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 5. FARMAKOKINETIKA
// ============================================================================
function Farmakokinetika() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">💊 Farmakokinetika — organizmda harakati</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">Farmakokinetik parametrlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Biodostupnost:</span>
                <span className="text-orange-400 font-bold">100% (IV)</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Plazma oqsillari bilan bog'lanish:</span>
                <span className="text-orange-400">&gt; 90%</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Yarim chiqarilish vaqti:</span>
                <span className="text-orange-400">~270 soat</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Chiqarilish:</span>
                <span className="text-orange-400">Buyrak orqali</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded p-2">
                <span className="text-purple-300">Doza:</span>
                <span className="text-orange-400">85 mg/m² (har 2 hafta)</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <h4 className="text-orange-400 font-bold mb-3">Nojo'ya ta'sirlar:</h4>
            <div className="space-y-2 text-xs">
              <div className="bg-red-900/20 border border-red-500/30 rounded p-2">
                <p className="text-red-400 font-bold">Neyrotoksiklik (asosiy)</p>
                <p className="text-purple-200">Periferik nevropatiya, sovuqka sezgirlik</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                <p className="text-yellow-400 font-bold">Gematotoksiklik</p>
                <p className="text-purple-200">Neytropeniya, trombotsitopeniya</p>
              </div>
              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-2">
                <p className="text-orange-400 font-bold">GI ta'sirlar</p>
                <p className="text-purple-200">Ko'ngil aynishi, qusish, diareya</p>
              </div>
              <div className="bg-emerald-900/20 border border-emerald-500/30 rounded p-2">
                <p className="text-emerald-400 font-bold">Kam uchraydigan</p>
                <p className="text-purple-200">Nefrotoksiklik (sisplatindan kam)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-xs">
          <p className="text-yellow-400 font-bold mb-1">💡 CD orqali monitoring:</p>
          <p className="text-purple-200">
            Oksaliplatin <strong>xiral</strong> bo'lgani uchun CD spektroskopiyasi orqali:
            <br/>
            • <strong>Enantiomer tozaligi</strong> (ee%) — ishlab chiqarishda
            <br/>
            • <strong>Plazmadagi konsentratsiya</strong> — farmakokinetik tadqiqotlarda
            <br/>
            • <strong>Metabolitlar</strong> — dchxn ligand ajralib chiqqanda CD o'zgaradi
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// 6. AMALIY QO'LLANILISH
// ============================================================================
function AmaliyQollanilish() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🏭 Amaliy qo'llanilishi</h3>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-orange-700/30 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="text-orange-400 font-bold mb-2">Kolorektal saraton</h4>
            <p className="text-purple-200 text-xs">
              <strong>Asosiy qo'llanilish</strong> — metastatik kolorektal saraton.
              FOLFOX rejimi (5-FU + leukovorin + oksaliplatin) — <strong>oltin standart</strong>.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">💊</div>
            <h4 className="text-orange-400 font-bold mb-2">Boshqa saratonlar</h4>
            <p className="text-purple-200 text-xs">
              • Oshqozon saratoni
              <br/>
              • Oshqozon osti bezi saratoni
              <br/>
              • O'pka saratoni
              <br/>
              • Tuxumdon saratoni
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🔬</div>
            <h4 className="text-orange-400 font-bold mb-2">Sifat nazorati</h4>
            <p className="text-purple-200 text-xs">
              CD spektroskopiyasi — <strong>farmatsevtik ishlab chiqarishda</strong>
              enantiomer tozaligini nazorat qilish uchun ishlatiladi.
              ee &gt; 99% talab qilinadi.
            </p>
          </div>

          <div className="bg-purple-950/50 rounded-xl p-5">
            <div className="text-3xl mb-2">🧪</div>
            <h4 className="text-orange-400 font-bold mb-2">Tadqiqotlar</h4>
            <p className="text-purple-200 text-xs">
              Yangi platina komplekslarini ishlab chiqishda
              CD orqali <strong>strukturaviy tahlil</strong> qilinadi.
              DNK bog'lanish mexanizmlari o'rganiladi.
            </p>
          </div>
        </div>

        <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
          <p className="text-orange-400 font-bold mb-2">🌟 Statistik ma'lumotlar:</p>
          <ul className="text-purple-200 text-xs space-y-1">
            <li>• Dunyoda har yili <strong>1.2 million</strong> kolorektal saraton kasali aniqlanadi</li>
            <li>• Oksaliplatin <strong>80%+</strong> bemorlarda qo'llaniladi</li>
            <li>• FOLFOX rejimi <strong>o'sish davri</strong>ni 20% ga uzaytiradi</li>
            <li>• Yillik savdo hajmi — <strong>2 milliard dollar</strong>dan ortiq</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function OksaliplatinCD() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300">Tahlil</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd" className="text-purple-400 hover:text-purple-300">CD</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/tahlil/cd/birikmalar" className="text-purple-400 hover:text-purple-300">Birikmalar</Link>
          <span className="text-purple-600">›</span>
          <span className="text-orange-400">Oksaliplatin</span>
        </nav>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔄 Oksaliplatin — CD tahlili</h1>
          <p className="text-purple-400 text-sm">
            Pt²⁺ (d⁸) • Xiral dchxn ligand • Saraton dorisi • Enantiomer tozaligi
          </p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-orange-700/30 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            <span className="text-4xl md:text-5xl font-extrabold font-mono text-orange-400">Oksaliplatin</span>
            <div>
              <h2 className="text-xl font-bold text-white">CD tahlili — to'liq profil</h2>
              <p className="text-purple-400">"Xiral saraton dorisi" — farmatsevtika klassikasi</p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Oksaliplatin — <strong className="text-orange-400">(1R,2R)-dchxn</strong> ligandli platina kompleksi.
              <strong> Kolorektal saraton</strong> davolashda <strong>oltin standart</strong>.
              CD spektroskopiyasi orqali <strong>enantiomer tozaligi (ee%)</strong> aniqlanadi.
              (1R,2R) enantiomer faol, (1S,2S) faol emas.
              Sisplatin rezistent saratonlarda ham <strong>faol</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Pt²⁺ (d⁸)</p>
              <p className="text-purple-300">kvadrat planar</p>
              <p className="text-purple-400 mt-1">S = 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">(1R,2R)</p>
              <p className="text-purple-300">dchxn</p>
              <p className="text-purple-400 mt-1">2 stereomarkaz</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">LMCT</p>
              <p className="text-purple-300">254 nm</p>
              <p className="text-purple-400 mt-1">CD faol</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-orange-400 font-bold text-lg">Δε ≈ ±3.5</p>
              <p className="text-purple-300">M⁻¹cm⁻¹</p>
              <p className="text-purple-400 mt-1">kuchli CD</p>
            </div>
          </div>
        </div>

        {/* CD SPEKTR SIMULYATORI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CDSpectrumSimulator />
        </div>

        {/* STRUKTURA VA XIRALLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <StrukturVaXirallik />
        </div>

        {/* SISPLATIN BILAN SOLISHTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SisplatinBilanSolishtirish />
        </div>

        {/* DNK BILAN BOG'LANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <DNKBilanBoglanish />
        </div>

        {/* FARMAKOKINETIKA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <Farmakokinetika />
        </div>

        {/* AMALIY QO'LLANILISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <AmaliyQollanilish />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside text-sm">
            <li>Oksaliplatin — <strong className="text-orange-400">xiral saraton dorisi</strong></li>
            <li>Pt²⁺ (d⁸) — <strong>kvadrat planar</strong>, diamagnit</li>
            <li><strong>(1R,2R)-dchxn</strong> ligand — 2 ta stereomarkaz</li>
            <li>Faqat <strong>(1R,2R) enantiomer</strong> faol (kolorektal saraton)</li>
            <li>CD orqali <strong>enantiomer tozaligi (ee%)</strong> aniqlanadi</li>
            <li>LMCT bandi — <strong>254 nm</strong> da CD signali (Δε ≈ ±3.5)</li>
            <li>Sisplatin rezistent saratonlarda ham <strong>faol</strong></li>
            <li>DNK bilan <strong>1,2-intrastrand crosslink</strong> hosil qiladi</li>
            <li><strong>Neyrotoksiklik</strong> — asosiy nojo'ya ta'sir</li>
            <li>FOLFOX rejimi — <strong>oltin standart</strong> (kolorektal saraton)</li>
          </ol>
        </div>

        {/* CD BO'LIMINING YAKUNIY XULOSASI */}
        <div className="bg-gradient-to-r from-rose-600/20 to-orange-600/20 border border-rose-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎉 CD spektroskopiya bo'limi yakunlandi!</h2>
          <p className="text-purple-200 mb-4">
            12 ta birikma orqali CD spektroskopiyasining barcha jihatlarini o'rgandik:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-blue-400 font-bold">1-6: Klassik komplekslar</p>
              <p className="text-purple-300 text-[10px]">[Co(en)₃]³⁺, [Co(ox)₃]³⁻, [Cr(acac)₃], [Fe(phen)₃]²⁺, [Ru(bpy)₃]²⁺, [Rh(en)₃]³⁺</p>
            </div>
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-violet-400 font-bold">7-9: Xiral ligandlar</p>
              <p className="text-purple-300 text-[10px]">[Co(R-pn)₃]³⁺, [Co(S-pn)₃]³⁺, [Co(dchxn)₃]³⁺</p>
            </div>
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-red-400 font-bold">10-11: Biologik</p>
              <p className="text-purple-300 text-[10px]">Gemoglobin, Sitoxrom c</p>
            </div>
            <div className="bg-purple-900/50 rounded p-3">
              <p className="text-orange-400 font-bold">12: Farmatsevtik</p>
              <p className="text-purple-300 text-[10px]">Oksaliplatin</p>
            </div>
          </div>
          <p className="text-purple-200 mt-4 text-sm">
            Keyingi bo'lim: <strong className="text-emerald-400">Mössbauer spektroskopiya</strong> ⚛️
          </p>
        </div>

        <div className="flex justify-between pt-6 flex-wrap gap-3">
          <Link href="/ilmiy/tahlil/cd/birikmalar/sitoxrom-c" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Sitoxrom c
          </Link>
          <Link href="/ilmiy/tahlil/mossbauer" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">
            Mössbauer spektroskopiya →
          </Link>
        </div>

      </section>
    </main>
  )
}