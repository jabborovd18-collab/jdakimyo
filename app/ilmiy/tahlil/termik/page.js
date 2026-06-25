"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// TERMIK TAHLIL — PREMIUM SAHIFA
// Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)
// Xususiyat: TGA, DTA, DSC — harorat ta'siridagi o'zgarishlar
// O'ziga xoslik: Gidrat izomeriya, parchalanish bosqichlari, interaktiv TGA
// ═══════════════════════════════════════════════════════════════════════════════

// TGA ma'lumotlari — CaC₂O₄·H₂O (klassik namuna)
const TGA_DATA_CaC2O4 = [
  { temp: 25, mass: 100.0, event: "Boshlang'ich" },
  { temp: 50, mass: 100.0, event: "Boshlang'ich" },
  { temp: 100, mass: 100.0, event: "Boshlang'ich" },
  { temp: 120, mass: 87.7, event: "H₂O yo'qolishi" },
  { temp: 150, mass: 87.7, event: "CaC₂O₄ barqaror" },
  { temp: 200, mass: 87.7, event: "CaC₂O₄ barqaror" },
  { temp: 300, mass: 87.7, event: "CaC₂O₄ barqaror" },
  { temp: 400, mass: 87.7, event: "CaC₂O₄ barqaror" },
  { temp: 450, mass: 68.5, event: "CO yo'qolishi" },
  { temp: 500, mass: 68.5, event: "CaCO₃ barqaror" },
  { temp: 600, mass: 68.5, event: "CaCO₃ barqaror" },
  { temp: 700, mass: 68.5, event: "CaCO₃ barqaror" },
  { temp: 750, mass: 38.4, event: "CO₂ yo'qolishi" },
  { temp: 800, mass: 38.4, event: "CaO barqaror" },
  { temp: 900, mass: 38.4, event: "CaO barqaror" },
  { temp: 1000, mass: 38.4, event: "CaO barqaror" }
]

// DTA ma'lumotlari
const DTA_DATA = [
  { temp: 25, signal: 0, event: "Boshlang'ich" },
  { temp: 100, signal: 0, event: "Boshlang'ich" },
  { temp: 120, signal: -15, event: "Endotermik (H₂O)" },
  { temp: 150, signal: 0, event: "Barqaror" },
  { temp: 300, signal: 0, event: "Barqaror" },
  { temp: 450, signal: -25, event: "Endotermik (CO)" },
  { temp: 500, signal: 0, event: "Barqaror" },
  { temp: 600, signal: 0, event: "Barqaror" },
  { temp: 750, signal: -30, event: "Endotermik (CO₂)" },
  { temp: 800, signal: 0, event: "Barqaror" },
  { temp: 900, signal: 0, event: "Barqaror" }
]

// Parchalanish bosqichlari
const decompositionSteps = [
  {
    temp: "100-150°C",
    event: "H₂O yo'qolishi",
    massLoss: "12.3%",
    product: "CaC₂O₄",
    type: "Endotermik",
    explanation: "Tashqi sfera suv molekulasi ajraladi. Bu suv koordinatsiyalanmagan, shuning uchun past haroratda ajraladi."
  },
  {
    temp: "400-500°C",
    event: "CO yo'qolishi",
    massLoss: "19.2%",
    product: "CaCO₃",
    type: "Endotermik",
    explanation: "Oksalat ionining parchalanishi: CaC₂O₄ → CaCO₃ + CO↑. CO gazi ajraladi."
  },
  {
    temp: "700-800°C",
    event: "CO₂ yo'qolishi",
    massLoss: "30.1%",
    product: "CaO",
    type: "Endotermik",
    explanation: "Karbonatning parchalanishi: CaCO₃ → CaO + CO₂↑. CaO barqaror oksid."
  }
]

// Gidrat izomeriya misollari
const hydrateIsomers = [
  {
    formula: "[Cr(H₂O)₆]Cl₃",
    name: "Geksaakvaxrom(III) xlorid",
    color: "Binafsha",
    innerSphere: "6 ta H₂O",
    outerSphere: "0 ta H₂O",
    tgaBehavior: "Faqat yuqori T da (~200°C) suv ajraladi",
    explanation: "Barcha 6 ta suv ichki sferada — koordinatsiyalangan. Shuning uchun faqat yuqori haroratda ajraladi."
  },
  {
    formula: "[CrCl(H₂O)₅]Cl₂·H₂O",
    name: "Pentakvaaxloroxrom(III) xlorid monogidrat",
    color: "Och yashil",
    innerSphere: "5 ta H₂O + 1 ta Cl⁻",
    outerSphere: "1 ta H₂O",
    tgaBehavior: "Past T da (~80°C) 1 ta H₂O, keyin yuqori T da 5 ta H₂O",
    explanation: "1 ta tashqi sfera suvi past haroratda, 5 ta ichki suv yuqori haroratda ajraladi."
  },
  {
    formula: "[CrCl₂(H₂O)₄]Cl·2H₂O",
    name: "Tetrakvaadixloroxrom(III) xlorid digidrat",
    color: "To'q yashil",
    innerSphere: "4 ta H₂O + 2 ta Cl⁻",
    outerSphere: "2 ta H₂O",
    tgaBehavior: "Past T da 2 ta H₂O, keyin yuqori T da 4 ta H₂O",
    explanation: "2 ta tashqi sfera suvi past haroratda, 4 ta ichki suv yuqori haroratda ajraladi."
  }
]

// Parchalanish bosqichlari jadvali
const decompositionTable = [
  {
    complex: "[Co(NH₃)₆]Cl₃",
    step1_temp: "150-250°C",
    step1_product: "NH₃ (bosqichli)",
    step2_temp: "400-600°C",
    step2_product: "CoCl₂",
    notes: "NH₃ bosqichli ajraladi"
  },
  {
    complex: "[Ni(H₂O)₆]SO₄",
    step1_temp: "50-120°C",
    step1_product: "Tashqi H₂O",
    step2_temp: "200-400°C",
    step2_product: "NiSO₄",
    notes: "Tashqi suv past T da"
  },
  {
    complex: "K₃[Fe(CN)₆]",
    step1_temp: "500-600°C",
    step1_product: "CN⁻ parchalanadi",
    step2_temp: ">700°C",
    step2_product: "Fe + KCN",
    notes: "CN⁻ juda barqaror"
  },
  {
    complex: "[Fe(C₅H₅)₂]",
    step1_temp: "100-173°C",
    step1_product: "Suyuqlanish",
    step2_temp: "249-400°C",
    step2_product: "Bug'lanish",
    notes: "Metallocen suyuqlanadi"
  },
  {
    complex: "[Pt(NH₃)₂Cl₂]",
    step1_temp: "270-320°C",
    step1_product: "NH₃ + HCl",
    step2_temp: "450-600°C",
    step2_product: "Pt",
    notes: "Sisplatin parchalanishi"
  },
  {
    complex: "CuSO₄·5H₂O",
    step1_temp: "100-150°C",
    step1_product: "4 ta tashqi H₂O",
    step2_temp: "200-300°C",
    step2_product: "CuSO₄",
    notes: "1 ta ichki H₂O qoladi"
  }
]

export default function TermikTahlil() {
  const [showHeader, setShowHeader] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [activeHydrate, setActiveHydrate] = useState(0)
  const [tgaTemp, setTgaTemp] = useState(25)
  const [showDecompositionModal, setShowDecompositionModal] = useState(false)
  
  // TGA kalkulyator
  const [calcMass, setCalcMass] = useState(100)
  const [calcMassLoss, setCalcMassLoss] = useState(12.3)
  const [calcMolarMass, setCalcMolarMass] = useState(146.12) // CaC₂O₄·H₂O

  const calcResult = useMemo(() => {
    const massLost = calcMass * (calcMassLoss / 100)
    const molesLost = massLost / 18.015 // H₂O molar mass
    const molesCompound = calcMass / calcMolarMass
    const watersPerMolecule = molesLost / molesCompound
    return {
      massLost: massLost.toFixed(2),
      molesLost: molesLost.toFixed(4),
      watersPerMolecule: watersPerMolecule.toFixed(2)
    }
  }, [calcMass, calcMassLoss, calcMolarMass])

  // TGA data point at current temp
  const currentTGA = useMemo(() => {
    const data = TGA_DATA_CaC2O4
    for (let i = 0; i < data.length - 1; i++) {
      if (tgaTemp >= data[i].temp && tgaTemp < data[i+1].temp) {
        const t1 = data[i].temp
        const t2 = data[i+1].temp
        const m1 = data[i].mass
        const m2 = data[i+1].mass
        const mass = m1 + (m2 - m1) * ((tgaTemp - t1) / (t2 - t1))
        return { temp: tgaTemp, mass, event: data[i].event }
      }
    }
    return data[data.length - 1]
  }, [tgaTemp])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* HEADER — TOGGLE BILAN */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <span className="text-red-400 font-semibold">Termik tahlil</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                  <span className="text-3xl">🔥</span>
                  Termik tahlil
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  TGA • DTA • DSC • Termik barqarorlik • Suv molekulalari joylashuvi
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-red-900/30 border border-red-700/50 text-red-400 text-[10px] uppercase tracking-wide">TGA</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">DTA</span>
                  <span className="px-2 py-1 rounded bg-orange-900/30 border border-orange-700/50 text-orange-400 text-[10px] uppercase tracking-wide">DSC</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Gidrat izomeriya</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/termik/birikmalar" className="text-xs bg-purple-900/50 hover:bg-purple-800 border border-purple-700 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Birikmalar katalogi →
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HEADER TOGGLE BUTTON */}
      <button
        onClick={() => setShowHeader(!showHeader)}
        className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg ${
          showHeader 
            ? "bg-red-600 hover:bg-red-500 text-white" 
            : "bg-red-600 hover:bg-red-500 text-white"
        }`}
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Termik tahlil haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Termik tahlil</strong> — moddalarning 
              <strong className="text-yellow-400"> harorat ta'sirida</strong> sodir bo'ladigan fizik va kimyoviy 
              o'zgarishlarini o'rganadi. Kompleks birikmalarda <strong className="text-yellow-400">suv molekulalarining 
              joylashuvi</strong> (ichki/tashqi sfera), <strong className="text-yellow-400">termik barqarorlik</strong> va 
              <strong className="text-yellow-400">parchalanish mahsulotlari</strong> aniqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-yellow-400 font-bold">TGA</h3>
              <p className="text-purple-300 text-sm">Termogravimetrik analiz</p>
              <p className="text-purple-400 text-xs mt-1">Massa o'zgarishini o'lchaydi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🌡️</div>
              <h3 className="text-yellow-400 font-bold">DTA</h3>
              <p className="text-purple-300 text-sm">Differensial termik analiz</p>
              <p className="text-purple-400 text-xs mt-1">Harorat farqini o'lchaydi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-yellow-400 font-bold">DSC</h3>
              <p className="text-purple-300 text-sm">Differensial skanerlovchi kalorimetriya</p>
              <p className="text-purple-400 text-xs mt-1">Issiqlik oqimini o'lchaydi</p>
            </div>
          </div>
        </div>

        {/* 2. GIDRAT IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Kompleks birikmalarda suv molekulalarini aniqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Termik tahlil yordamida <strong className="text-yellow-400">ichki va tashqi sfera suvlari</strong> farqlanadi.
            Tashqi sfera suvlari <strong className="text-yellow-400">past haroratda</strong> (50-120°C), 
            ichki sfera (koordinatsiyalangan) suvlari <strong className="text-yellow-400">yuqori haroratda</strong> (150-250°C) ajraladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Misol: CrCl₃·6H₂O — 3 ta gidrat izomer</h3>
            <div className="space-y-3">
              {hydrateIsomers.map((h, i) => (
                <div 
                  key={i}
                  onClick={() => setActiveHydrate(i)}
                  className={`rounded-lg p-4 cursor-pointer transition-all ${
                    activeHydrate === i 
                      ? "bg-purple-700/50 border-2 border-yellow-400" 
                      : "bg-purple-900/50 hover:bg-purple-800/50"
                  }`}
                >
                  <p className={`font-bold ${h.color === "Binafsha" ? "text-purple-300" : h.color === "Och yashil" ? "text-green-300" : "text-emerald-300"}`}>
                    {h.formula} — {h.color}
                  </p>
                  <p className="text-purple-300 text-sm mt-1">
                    Ichki sfera: <strong>{h.innerSphere}</strong> | Tashqi sfera: <strong>{h.outerSphere}</strong>
                  </p>
                  <p className="text-purple-300 text-sm mt-1">
                    TGA: <strong>{h.tgaBehavior}</strong>
                  </p>
                  {activeHydrate === i && (
                    <p className="text-purple-200 text-sm mt-2 italic">
                      {h.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. INTERAKTIV TGA EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📉 Interaktiv TGA egri chizig'i — CaC₂O₄·H₂O</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>TGA egri chizig'i</strong> harorat oshishi bilan massa kamayishini ko'rsatadi.
            Slayderni harakatlantirib, haroratni o'zgartiring va massa o'zgarishini kuzating.
          </p>

          {/* Temperature slider */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-yellow-400 font-bold mb-2">
              Harorat: {tgaTemp}°C
            </label>
            <input
              type="range"
              min="25"
              max="1000"
              value={tgaTemp}
              onChange={(e) => setTgaTemp(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>25°C</span>
              <span>500°C</span>
              <span>1000°C</span>
            </div>
          </div>

          {/* Current state */}
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">Harorat:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.temp}°C</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Massa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.mass.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Hodisa:</div>
                <div className="text-xl font-mono font-bold text-yellow-400">{currentTGA.event}</div>
              </div>
            </div>
          </div>

          {/* TGA curve SVG */}
          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[0, 20, 40, 60, 80, 100].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={220 - (v/100)*200} x2="580" y2={220 - (v/100)*200} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={224 - (v/100)*200} textAnchor="end" fontSize="8" fill="#a78bfa">{v}%</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 200, 400, 600, 800, 1000].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/1000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="120" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 120)">Massa (%)</text>

              {/* TGA curve */}
              <polyline
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="2"
                points={TGA_DATA_CaC2O4.map(p => {
                  const x = 50 + (p.temp/1000)*530
                  const y = 220 - (p.mass/100)*200
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Current temp marker */}
              <line 
                x1={50 + (currentTGA.temp/1000)*530} 
                y1="30" 
                x2={50 + (currentTGA.temp/1000)*530} 
                y2="220" 
                stroke="#fbbf24" 
                strokeWidth="2" 
                strokeDasharray="4,2" 
              />
              <circle 
                cx={50 + (currentTGA.temp/1000)*530} 
                cy={220 - (currentTGA.mass/100)*200} 
                r="6" 
                fill="#fbbf24" 
                stroke="#fff" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* 4. DTA EGRI CHIZIG'I */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ DTA egri chizig'i — Endotermik/ekzotermik piklar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong>DTA (Differensial Termik Analiz)</strong> — namuna va referens o'rtasidagi harorat farqini o'lchaydi.
            <strong className="text-yellow-400"> Endotermik</strong> piklar (pastga) issiqlik yutilishini, 
            <strong className="text-yellow-400"> ekzotermik</strong> piklar (yuqoriga) issiqlik ajralishini ko'rsatadi.
          </p>

          <div className="bg-purple-950/40 p-4 rounded-xl border border-purple-700/30 relative h-80">
            <svg viewBox="0 0 600 260" className="w-full h-full overflow-visible">
              {/* Grid */}
              {[-30, -20, -10, 0, 10, 20, 30].map((v, i) => (
                <g key={i}>
                  <line x1="50" y1={130 - (v/30)*100} x2="580" y2={130 - (v/30)*100} stroke="#3b3470" strokeWidth="0.5" strokeDasharray="2,2" />
                  <text x="45" y={134 - (v/30)*100} textAnchor="end" fontSize="8" fill="#a78bfa">{v}</text>
                </g>
              ))}

              {/* X axis */}
              {[0, 200, 400, 600, 800, 1000].map((t, i) => (
                <g key={i}>
                  <text x={50 + (t/1000)*530} y="245" textAnchor="middle" fontSize="8" fill="#a78bfa">{t}°C</text>
                </g>
              ))}
              <text x="310" y="258" textAnchor="middle" fontSize="10" fill="#a78bfa">Harorat (°C)</text>
              <text x="20" y="130" textAnchor="middle" fontSize="10" fill="#a78bfa" transform="rotate(-90, 20, 130)">ΔT (°C)</text>

              {/* Zero line */}
              <line x1="50" y1="130" x2="580" y2="130" stroke="#a78bfa" strokeWidth="1" />

              {/* DTA curve */}
              <polyline
                fill="none" 
                stroke="#f97316" 
                strokeWidth="2"
                points={DTA_DATA.map(p => {
                  const x = 50 + (p.temp/1000)*530
                  const y = 130 - (p.signal/30)*100
                  return `${x},${y}`
                }).join(" ")}
              />

              {/* Labels */}
              <text x="110" y="155" fontSize="8" fill="#ef4444">Endotermik (H₂O)</text>
              <text x="270" y="155" fontSize="8" fill="#ef4444">Endotermik (CO)</text>
              <text x="430" y="155" fontSize="8" fill="#ef4444">Endotermik (CO₂)</text>
            </svg>
          </div>
        </div>

        {/* 5. PARCHALANISH BOSQICHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Parchalanish bosqichlari — interaktiv</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir bosqichni bosib, batafsil ma'lumot oling. Har bir bosqichda qanday molekulalar ajraladi va qanday mahsulot hosil bo'ladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {decompositionSteps.map((step, i) => (
              <div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`rounded-xl p-5 cursor-pointer transition-all ${
                  activeStep === i 
                    ? "bg-yellow-900/40 border-2 border-yellow-400" 
                    : "bg-purple-800/30 border border-purple-700/30 hover:border-yellow-500/50"
                }`}
              >
                <div className="text-yellow-400 font-bold mb-2">{step.temp}</div>
                <div className="text-purple-200 text-sm font-bold mb-1">{step.event}</div>
                <div className="text-yellow-400 text-sm font-mono">−{step.massLoss}</div>
                <div className="text-purple-300 text-sm mt-1">→ {step.product}</div>
                {activeStep === i && (
                  <div className="mt-3 pt-3 border-t border-purple-700/50">
                    <p className="text-purple-200 text-xs italic">{step.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 6. PARCHALANISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kompleks birikmalarning parchalanish bosqichlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">1-bosqich (T, °C)</th>
                <th className="py-3 px-4 text-purple-300">Ajralgan</th>
                <th className="py-3 px-4 text-purple-300">2-bosqich (T, °C)</th>
                <th className="py-3 px-4 text-purple-300">Qoldiq</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {decompositionTable.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-red-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4 text-yellow-400">{r.step1_temp}</td>
                    <td className="py-3 px-4">{r.step1_product}</td>
                    <td className="py-3 px-4 text-yellow-400">{r.step2_temp}</td>
                    <td className="py-3 px-4">{r.step2_product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. TGA KALKULYATOR */}
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8">
          <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> TGA kalkulyatori — massa yo'qotishdan formula hisoblash
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Massa yo'qotish foizidan <strong className="text-red-300">qancha suv molekulasi</strong> ajralganini hisoblang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Boshlang'ich massa (mg):</label>
              <input
                type="number"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Massa yo'qotish (%):</label>
              <input
                type="number"
                step="0.1"
                value={calcMassLoss}
                onChange={(e) => setCalcMassLoss(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Molyar massa (g/mol):</label>
              <input
                type="number"
                step="0.01"
                value={calcMolarMass}
                onChange={(e) => setCalcMolarMass(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-red-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Yo'qotilgan massa:</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.massLost} mg</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Mol (H₂O):</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.molesLost}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">H₂O / molekula:</div>
                <div className="text-xl font-mono font-bold text-red-400">{calcResult.watersPerMolecule}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: n(H₂O) = (massa × %yo'qotish / 18.015) / (massa / M_molar)
            </p>
          </div>
        </div>

        {/* 8. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Termik tahlilga yaqin tahlil usullari
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-red-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-red-300">TGA (Termogravimetriya)</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Asosiy</div>
                  <div className="text-lg font-bold text-green-400">Asosiy</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Massa o'zgarishini harorat funksiyasi sifatida o'lchaydi.</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Massa yo'qotish foizini aniq o'lchaydi</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Faqat massa o'zgarishini ko'rsatadi, mahsulotni aniqlamaydi</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-red-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-red-300">DTA/DSC</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Qo'shimcha</div>
                  <div className="text-lg font-bold text-green-400">Qo'shimcha</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Harorat farqi (DTA) yoki issiqlik oqimi (DSC) o'lchaydi.</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Endotermik/ekzotermik hodisalarni aniqlaydi</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Faqat hodisa turini ko'rsatadi, mahsulotni aniqlamaydi</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-red-900/20 border border-red-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-red-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">TGA (massa) + DTA/DSC (hodisa) + XRD (qoldiq struktura) + IQ (guruhlar) + EA (element tarkibi)</strong> — beshta metod birgalikda to'liq termik tahlilni ta'minlaydi.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Termik tahlil — <strong className="text-yellow-400">harorat ta'siridagi o'zgarishlarni</strong> o'rganadi</li>
            <li>TGA: massa o'zgarishi, DTA: harorat farqi, DSC: issiqlik oqimi</li>
            <li>Ichki va tashqi sfera suvlari — <strong>har xil haroratda ajraladi</strong></li>
            <li>Gidrat izomeriyani <strong>bevosita isbotlash</strong> imkonini beradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/elektrokimyo" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Elektrokimyoviy tahlil</Link>
          <Link href="/ilmiy/tahlil/termik/birikmalar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Birikmalar katalogi →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Termik tahlil moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Wendlandt (Thermal Analysis)</p>
        </div>
      </footer>
    </main>
  )
}