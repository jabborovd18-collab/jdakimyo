"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// KONDUKTOMETRIYA — ASOSIY SAHIFA (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Bard & Faulkner
// Xususiyat: Molyar o'tkazuvchanlik, Verner nazariyasi, ionlar soni
// O'ziga xoslik: Nobel 1913, tashqi/ichki sfera farqi, Λm
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

export default function Konduktometriya() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [calcConductivity, setCalcConductivity] = useState(0.0015)
  const [calcConcentration, setCalcConcentration] = useState(0.001)
  const [activeElectrolyte, setActiveElectrolyte] = useState(0)
  const [activeExperiment, setActiveExperiment] = useState(0)

  // Λm kalkulyator
  const calcResult = useMemo(() => {
    const lm = (calcConductivity * 1000) / calcConcentration
    let type = "Noma'lum"
    let color = "text-purple-400"
    if (lm >= 400 && lm <= 500) { type = "1:3 yoki 3:1 elektrolit"; color = "text-red-400" }
    else if (lm >= 300 && lm < 400) { type = "1:2 yoki 2:1 elektrolit"; color = "text-blue-400" }
    else if (lm >= 150 && lm < 300) { type = "1:1 elektrolit"; color = "text-yellow-400" }
    else if (lm < 10) { type = "Noelektrolit"; color = "text-gray-400" }
    return { lm: lm.toFixed(2), type, color }
  }, [calcConductivity, calcConcentration])

  // Verner tajribasi ma'lumotlari
  const wernerExperiments = [
    { complex: "[Co(NH₃)₆]Cl₃", formula: "[Co(NH₃)₆]³⁺ + 3Cl⁻", ions: 4, lm: 432, type: "1:3", color: "sariq", colorCode: "text-yellow-400" },
    { complex: "[Co(NH₃)₅Cl]Cl₂", formula: "[Co(NH₃)₅Cl]²⁺ + 2Cl⁻", ions: 3, lm: 340, type: "1:2", color: "binafsha", colorCode: "text-purple-400" },
    { complex: "[Co(NH₃)₄Cl₂]Cl", formula: "[Co(NH₃)₄Cl₂]⁺ + Cl⁻", ions: 2, lm: 250, type: "1:1", color: "qizil-binafsha", colorCode: "text-pink-400" },
    { complex: "[Co(NH₃)₃Cl₃]", formula: "[Co(NH₃)₃Cl₃]⁰", ions: 0, lm: 0, type: "Noelektrolit", color: "binafsha", colorCode: "text-purple-400" },
    { complex: "[Pt(NH₃)₆]Cl₄", formula: "[Pt(NH₃)₆]⁴⁺ + 4Cl⁻", ions: 5, lm: 520, type: "1:4", color: "oq", colorCode: "text-gray-300" },
    { complex: "K₃[Fe(CN)₆]", formula: "3K⁺ + [Fe(CN)₆]³⁻", ions: 4, lm: 440, type: "3:1", color: "qizil", colorCode: "text-red-400" },
    { complex: "K₄[Fe(CN)₆]", formula: "4K⁺ + [Fe(CN)₆]⁴⁻", ions: 5, lm: 540, type: "4:1", color: "sariq", colorCode: "text-yellow-400" },
  ]

  // Elektrolit turlari
  const electrolyteTypes = [
    { type: "1:1 elektrolit", ions: 2, lm_range: "150-280", examples: "[Co(NH₃)₄Cl₂]Cl, [PtCl₂(NH₃)₂]", color: "text-yellow-400" },
    { type: "1:2 yoki 2:1", ions: 3, lm_range: "300-380", examples: "[Co(NH₃)₅Cl]Cl₂, K₂[PtCl₄]", color: "text-blue-400" },
    { type: "1:3 yoki 3:1", ions: 4, lm_range: "400-500", examples: "[Co(NH₃)₆]Cl₃, K₃[Fe(CN)₆]", color: "text-red-400" },
    { type: "1:4 yoki 4:1", ions: 5, lm_range: "500-580", examples: "[Pt(NH₃)₆]Cl₄, K₄[Fe(CN)₆]", color: "text-pink-400" },
    { type: "Noelektrolit", ions: 0, lm_range: "0-10", examples: "[PtCl₂(NH₃)₂], [Co(NH₃)₃Cl₃]", color: "text-gray-400" },
  ]

  // Qo'llanish sohalari
  const applications = [
    {
      title: "Tashqi va ichki sfera ionlarini farqlash",
      desc: "Konduktometrik o'lchashlar orqali kompleksning qancha ioni eritmada erkin holda ekanligi aniqlanadi. Ichki sferadagi ionlar erkin harakatlanmaydi va o'tkazuvchanlikka hissa qo'shmaydi.",
      icon: "🔬"
    },
    {
      title: "Kompleks sintezini kuzatish",
      desc: "Konduktometrik titrlash orqali metall ioniga ligand qo'shilganda o'tkazuvchanlik o'zgarishi kuzatiladi. Keskin o'zgarish nuqtalari kompleks stoxiometriyasini ko'rsatadi.",
      icon: "⚗️"
    },
    {
      title: "Geometrik izomerlarni farqlash",
      desc: "sis- va trans-izomerlar turli xil gidroliz mahsulotlari hosil qiladi. Masalan, sis-[PtCl₂(NH₃)₂] suvda sekin gidrolizlanib ionlar hosil qiladi.",
      icon: "🔬"
    },
    {
      title: "Kinetik tadqiqotlar",
      desc: "Ligand almashinish reaksiyalari vaqtida ionlar soni o'zgaradi. Real vaqt rejimida kuzatish imkonini beradi.",
      icon: "⏱️"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-2xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">🔌</span> KONDUKTOMETRIYA — VERNER NAZARIYASINI ISBOTLAGAN USUL!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">Konduktometriya</strong> — eritmalarning elektr o'tkazuvchanligini o'lchashga asoslangan usul. 
              Alfred Verner 1893-yilda aynan shu usul orqali koordinatsion nazariyani isbotladi!
            </p>
            
            <div className="bg-blue-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2">⚡ Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Molyar o'tkazuvchanlik (Λm)</strong> — S·cm²/mol birligida.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Ionlar soni</strong> — 1:1, 1:2, 1:3, 1:4 elektrolitlar.
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">🏆 Tarixiy ahamiyat:</div>
                  <div className="text-purple-200">
                    <strong>Verner (Nobel 1913)</strong> — tashqi/ichki sfera ionlarini farqladi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Kompleks tuzilishi</strong> — ionlar soni orqali aniqlanadi.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Asosiy qonuniyat:</strong> Λm qiymati ionlar soniga to'g'ri proporsional. 
                1:1 elektrolit ≈ 150-280, 1:2 ≈ 300-380, 1:3 ≈ 400-500 S·cm²/mol.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
            >
              Tushundim — sahifani davom ettirish
            </button>
          </div>
        </div>
      )}
      
      {/* HEADER */}
      {showHeader && (
        <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
              <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
              <span className="text-purple-600">›</span>
              <Link href="/ilmiy/tahlil" className="hover:text-purple-300">Tahlil usullari</Link>
              <span className="text-purple-600">›</span>
              <span className="text-blue-400 font-semibold">Konduktometriya</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span className="text-3xl">🔌</span>
                  Konduktometriya
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Eritma elektr o'tkazuvchanligi • Ionlar soni • Verner nazariyasi
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Λm (S·cm²/mol)</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Nobel 1913</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">12 ta birikma</span>
                  <span className="px-2 py-1 rounded bg-purple-900/30 border border-purple-700/50 text-purple-400 text-[10px] uppercase tracking-wide">Verner isboti</span>
                </div>
              </div>
              <Link 
                href="/ilmiy/tahlil/konduktometriya/birikmalar"
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                Birikmalar katalogi →
              </Link>
            </div>
          </div>
        </header>
      )}

      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-blue-600 hover:bg-blue-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* BIRIKMALAR KATALOGIGA LINK */}
        <Link 
          href="/ilmiy/tahlil/konduktometriya/birikmalar"
          className="group block bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔌</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-300 group-hover:text-blue-200 transition-colors">
                Birikmalarning konduktometrik tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                12 ta kompleks birikmaning elektr o'tkazuvchanligi. Molyar o'tkazuvchanlik Λm,
                ionlar soni, dissotsiatsiya darajasi va Verner nazariyasi isboti har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-blue-300 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-600/20 text-blue-300 border border-blue-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Λm (S·cm²/mol)</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Ionlar soni</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Verner isboti</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Konduktometriya haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-300">Konduktometriya</strong> — eritmalarning 
              <strong className="text-blue-300"> elektr o'tkazuvchanligini</strong> o'lchashga asoslangan 
              elektrokimyoviy tahlil usuli. Kompleks birikmalarda 
              <strong className="text-blue-300"> tashqi va ichki sferadagi ionlar sonini</strong> aniqlash,
              elektrolit turini (kuchli/kuchsiz) farqlash va eng muhimi — 
              <strong className="text-blue-300"> Alfred Vernerning koordinatsion nazariyasini isbotlash</strong> 
              uchun tarixiy ahamiyatga ega usul.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-300 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Molyar o'tkazuvchanlik (Λm)</strong> — 1 mol elektrolitning o'tkazuvchanligi (S·cm²/mol)</li>
                <li>• <strong>Ionlar soni</strong> — dissotsiatsiyalanadigan ionlar soni (1:1, 1:2, 1:3...)</li>
                <li>• <strong>Elektrolit turi</strong> — kuchli/kuchsiz elektrolit (Λm konsentratsiyaga bog'liqligi)</li>
                <li>• <strong>Tashqi/ichki sfera ionlari</strong> — qaysi ionlar erkin, qaysilari kompleksda</li>
                <li>• <strong>Dissotsiatsiya darajasi (α)</strong> — α = Λm / Λm°</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-300 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ikkita <strong>platina elektrodlari</strong> eritmaga tushiriladi</li>
                <li>• Elektrodlarga <strong>o'zgaruvchan tok</strong> (1−4 kHz) beriladi</li>
                <li>• Eritmaning <strong>qarshiligi (R)</strong> o'lchanadi</li>
                <li>• O'tkazuvchanlik: <strong>κ = K/R</strong> (K — yacheyka konstantasi)</li>
                <li>• Molyar o'tkazuvchanlik: <strong>Λm = κ/c</strong></li>
                <li>• O'zgarmas tok ishlatilmaydi — <strong>elektroliz va qutblanish</strong> oldini olish uchun</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. VERNER NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Verner nazariyasini konduktometrik isbotlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-blue-300">Alfred Verner (1893, Nobel 1913)</strong> konduktometriya yordamida 
            koordinatsion nazariyani isbotlagan. U kobalt komplekslarining molyar o'tkazuvchanligini o'lchab, 
            ularning turli xil ionlar soniga ega ekanligini ko'rsatgan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-blue-300 font-bold mb-3">Vernerning klassik tajribasi (25°C, suvli eritma):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-700">
                    <th className="py-3 px-4 text-purple-300">Kompleks</th>
                    <th className="py-3 px-4 text-purple-300">Formulasi (Verner)</th>
                    <th className="py-3 px-4 text-purple-300">Ionlar soni</th>
                    <th className="py-3 px-4 text-purple-300">Λm (S·cm²/mol)</th>
                    <th className="py-3 px-4 text-purple-300">Elektrolit turi</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {wernerExperiments.map((exp, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-purple-800/30 hover:bg-purple-800/20 cursor-pointer ${activeExperiment === i ? 'bg-purple-800/40' : ''}`}
                      onClick={() => setActiveExperiment(i)}
                    >
                      <td className={`py-2 px-3 font-bold text-sm ${exp.colorCode}`}>{exp.complex}</td>
                      <td className="py-2 px-3 text-xs">{exp.formula}</td>
                      <td className="py-2 px-3 font-mono text-yellow-400">{exp.ions}</td>
                      <td className="py-2 px-3 font-mono text-green-400">{exp.lm}</td>
                      <td className="py-2 px-3 text-xs">{exp.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-purple-400 text-xs mt-3">
              * Λm qiymatlari 25°C da, 10⁻³ M eritma uchun taxminiy. Verner bu ma'lumotlar asosida Cl⁻ ionlarining 
              bir qismi tashqi sferada (erkin), bir qismi ichki sferada (kompleks bilan bog'langan) ekanligini ko'rsatgan.
            </p>
          </div>
        </div>

        {/* 3. ELEKTROLIT TURLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Elektrolit turlari va Λm diapazonlari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Eritmadagi <strong className="text-blue-300">ionlar soni qancha ko'p bo'lsa, molyar o'tkazuvchanlik shuncha yuqori</strong> bo'ladi.
            Bu bog'liqlik konduktometriyaning asosiy qonuniyati.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {electrolyteTypes.map((et, i) => (
              <div 
                key={i}
                onClick={() => setActiveElectrolyte(i)}
                className={`bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 cursor-pointer transition-all ${
                  activeElectrolyte === i ? 'border-blue-400 border-2' : ''
                }`}
              >
                <p className={`font-bold text-lg ${et.color}`}>{et.type}</p>
                <p className="text-purple-300 text-xs mt-1">Ionlar soni: <strong className="text-yellow-400">{et.ions}</strong></p>
                <p className="text-yellow-400 font-mono mt-2">Λm ≈ {et.lm_range}</p>
                <p className="text-purple-300 text-xs mt-2">{et.examples}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Λm KALKULYATOR */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Molyar o'tkazuvchanlik kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            O'tkazuvchanlik va konsentratsiyani kiriting — <strong className="text-blue-300">Λm</strong> va elektrolit turi aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Solishtirma o'tkazuvchanlik κ (S/cm):</label>
              <input
                type="number"
                step="0.0001"
                value={calcConductivity}
                onChange={(e) => setCalcConductivity(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Konsentratsiya (mol/L):</label>
              <input
                type="number"
                step="0.0001"
                value={calcConcentration}
                onChange={(e) => setCalcConcentration(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Molyar o'tkazuvchanlik Λm:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{calcResult.lm} S·cm²/mol</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Elektrolit turi:</div>
                <div className={`text-xl font-mono font-bold ${calcResult.color}`}>{calcResult.type}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: Λm = (κ × 1000) / c = ({calcConductivity} × 1000) / {calcConcentration} = {calcResult.lm} S·cm²/mol
            </p>
          </div>
        </div>

        {/* 5. QO'LLANISH SOHALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Konduktometriya qo'llanish sohalari</h2>
          
          <div className="space-y-4">
            {applications.map((app, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-blue-300 font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">{app.icon}</span>
                  {app.title}
                </h3>
                <p className="text-purple-200 text-sm">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. ASOSIY FORMULALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Asosiy formulalar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 font-bold mb-2">Solishtirma o'tkazuvchanlik (κ):</p>
              <p className="text-yellow-400 font-mono text-lg">κ = K / R</p>
              <p className="text-purple-300 text-xs mt-2">K — yacheyka konstantasi (cm⁻¹), R — qarshilik (Ω)</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 font-bold mb-2">Molyar o'tkazuvchanlik (Λm):</p>
              <p className="text-yellow-400 font-mono text-lg">Λm = (κ × 1000) / c</p>
              <p className="text-purple-300 text-xs mt-2">c — konsentratsiya (mol/L), Λm (S·cm²/mol)</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 font-bold mb-2">Dissotsiatsiya darajasi (α):</p>
              <p className="text-yellow-400 font-mono text-lg">α = Λm / Λm°</p>
              <p className="text-purple-300 text-xs mt-2">Λm° — cheksiz suyultirishdagi molyar o'tkazuvchanlik</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <p className="text-blue-300 font-bold mb-2">Kohlrausch qonuni:</p>
              <p className="text-yellow-400 font-mono text-lg">Λm° = λ₊ + λ₋</p>
              <p className="text-purple-300 text-xs mt-2">λ₊, λ₋ — kation va anion ion o'tkazuvchanliklari</p>
            </div>
          </div>
        </div>

        {/* 7. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Konduktometriya — <strong className="text-blue-300">ionlar sonini aniqlashning eng oddiy va ishonchli usuli</strong></li>
            <li>Verner nazariyasini isbotlashda <strong className="text-blue-300">tarixiy ahamiyatga ega</strong> (Nobel 1913)</li>
            <li>Molyar o'tkazuvchanlik Λm — <strong className="text-blue-300">ionlar soniga to'g'ri proporsional</strong></li>
            <li>Tashqi va ichki sfera ionlarini <strong className="text-blue-300">aniq farqlash</strong> imkonini beradi</li>
            <li>Kompleks sintezi, kinetikasi va izomer farqlash uchun <strong className="text-blue-300">yordamchi, ammo muhim usul</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/icp" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← ICP-OES/ICP-MS</Link>
          <Link href="/ilmiy/tahlil" className="px-6 py-3 bg-blue-700/80 rounded-xl hover:bg-blue-600 text-white font-semibold">Barcha tahlil usullari →</Link>
        </div>

      </section>
    </main>
  )
}