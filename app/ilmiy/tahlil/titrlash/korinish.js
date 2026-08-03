"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// SPEKTROFOTOMETRIK TITRLASH — ASOSIY SAHIFA (PREMIUM)
// Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry)
// Xususiyat: Barqarorlik konstantalari, Job metodi, izosbestik nuqtalar
// O'ziga xoslik: Metall-ligand stoxiometriyasi, βn, molyar yutilish
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const interestingFacts = [
  {
    title: "Job metodi (uzluksiz variatsiyalar)",
    fact: "1928-yilda Wallace C. Job tomonidan ishlab chiqilgan. Metall va ligandning umumiy konsentratsiyasi o'zgarmas holda, mol nisbati o'zgartiriladi. Grafik maksimumi stoxiometriyani ko'rsatadi."
  },
  {
    title: "Izosbestik nuqta",
    fact: "Turli konsentratsiyalarda olingan spektrlarning kesishgan nuqtasi. Bu nuqta eritmada faqat ikkita yutuvchi shakl muvozanatda ekanligini ko'rsatadi."
  },
  {
    title: "Ferroin indikatori",
    fact: "[Fe(phen)₃]²⁺ — eng keng tarqalgan redoks indikatori. Qizil rang (Fe²⁺) dan ko'k rang (Fe³⁺) ga o'tish. E° = +1.06 V."
  },
  {
    title: "Beer-Lambert qonuni",
    fact: "A = ε·l·c — absorbsiya konsentratsiyaga to'g'ri proporsional. Bu spektrofotometrik titrlashning asosiy qonuni."
  },
  {
    title: "Benesi-Hildebrand metodi",
    fact: "1/(A-A₀) vs 1/[L] grafigi orqali βn hisoblanadi. Chiziqli grafik βn ni aniqlash imkonini beradi."
  }
]

const betaValues = [
  { complex: "[Cu(NH₃)₄]²⁺", stox: "1:4", logBeta: "13.3", stability: "Yuqori", color: "to'q ko'k" },
  { complex: "[Ag(NH₃)₂]⁺", stox: "1:2", logBeta: "7.2", stability: "O'rtacha", color: "rangsiz" },
  { complex: "[Fe(CN)₆]⁴⁻", stox: "1:6", logBeta: "35.4", stability: "Juda yuqori", color: "sariq" },
  { complex: "[CoCl₄]²⁻", stox: "1:4", logBeta: "~6", stability: "Past", color: "ko'k" },
  { complex: "[Ni(CN)₄]²⁻", stox: "1:4", logBeta: "31.0", stability: "Juda yuqori", color: "sariq" },
  { complex: "[Fe(phen)₃]²⁺", stox: "1:3", logBeta: "21.3", stability: "Juda yuqori", color: "qizil" },
  { complex: "[Cu(phen)₃]²⁺", stox: "1:3", logBeta: "16.7", stability: "Yuqori", color: "qizil" },
  { complex: "[Fe(SCN)]²⁺", stox: "1:1", logBeta: "2.3", stability: "Past", color: "qizil" },
]

export default function SpektrofotometrikTitrlash() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  
  // Job metodi kalkulyatori
  const [metalConc, setMetalConc] = useState(0.001)
  const [ligandConc, setLigandConc] = useState(0.001)
  const [totalConc] = useState(0.002)
  
  // βn kalkulyatori
  const [betaValue, setBetaValue] = useState(13.3)
  const [metalConcBeta, setMetalConcBeta] = useState(0.001)
  const [ligandConcBeta, setLigandConcBeta] = useState(0.004)
  
  // Benesi-Hildebrand kalkulyatori
  const [absorbance, setAbsorbance] = useState(0.5)
  const [ligandConcBH, setLigandConcBH] = useState(0.01)

  const jobResult = useMemo(() => {
    const xL = ligandConc / (metalConc + ligandConc)
    let stox = "Noma'lum"
    if (Math.abs(xL - 0.5) < 0.05) stox = "1:1 (ML)"
    else if (Math.abs(xL - 0.67) < 0.05) stox = "1:2 (ML₂)"
    else if (Math.abs(xL - 0.75) < 0.05) stox = "1:3 (ML₃)"
    else if (Math.abs(xL - 0.80) < 0.05) stox = "1:4 (ML₄)"
    return { xL: xL.toFixed(3), stox }
  }, [metalConc, ligandConc])

  const betaResult = useMemo(() => {
    const deltaG = -8.314 * 298 * Math.log(Math.pow(10, betaValue)) / 1000
    return { deltaG: deltaG.toFixed(2) }
  }, [betaValue])

  const bhResult = useMemo(() => {
    const invAbs = 1 / absorbance
    const invLigand = 1 / ligandConcBH
    return { invAbs: invAbs.toFixed(3), invLigand: invLigand.toFixed(3) }
  }, [absorbance, ligandConcBH])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-violet-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-violet-950 to-purple-950 border-2 border-violet-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-violet-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> SPEKTROFOTOMETRIK TITRLASH — BARQARORLIK KONSTANTALARI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-violet-300">Spektrofotometrik titrlash</strong> — eritmadagi metall ioniga 
              ligand eritmasini qo'shib borib, UB-Vis spektrlarini ketma-ket qayd etishga asoslangan usul.
            </p>
            
            <div className="bg-violet-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-violet-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Barqarorlik konstantasi (βn)</strong> — kompleks mustahkamligi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Stoxiometriya</strong> — metall:ligand nisbati.
                  </div>
                </div>
                <div>
                  <div className="text-violet-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>Job metodi</strong> — uzluksiz variatsiyalar metodi.
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Izosbestik nuqtalar</strong> — muvozanat ko'rsatkichi.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-violet-300">Beer-Lambert qonuni:</strong> A = ε·l·c — absorbsiya konsentratsiyaga to'g'ri proporsional. 
                Bu spektrofotometrik titrlashning asosiy qonuni.
              </p>
            </div>

            <div className="bg-violet-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-violet-300">Ferroin indikatori:</strong> [Fe(phen)₃]²⁺ — eng keng tarqalgan redoks indikatori. 
                Qizil rang (Fe²⁺) dan ko'k rang (Fe³⁺) ga o'tish. E° = +1.06 V.
              </p>
            </div>

            <button 
              onClick={() => setShowWarningModal(false)}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-lg transition-colors text-sm font-bold"
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
              <span className="text-violet-400 font-semibold">Spektrofotometrik titrlash</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-violet-400 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  Spektrofotometrik titrlash
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Barqarorlik konstantalari • Job metodi • Metall-ligand stoxiometriyasi • βn
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-violet-900/30 border border-violet-700/50 text-violet-400 text-[10px] uppercase tracking-wide">Barqarorlik konstantasi</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Job metodi</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Stoxiometriya</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Izosbestik nuqtalar</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/titrlash/birikmalar" className="text-xs bg-violet-600/80 hover:bg-violet-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Birikmalar katalogi →
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* HEADER TOGGLE BUTTON */}
      <button
        onClick={() => setShowHeader(!showHeader)}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-lg bg-violet-600 hover:bg-violet-500 text-white"
      >
        {showHeader ? "🔽 Header yashirish" : "🔼 Header ko'rsatish"}
      </button>

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/titrlash/birikmalar"
          className="group block bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-6 hover:bg-violet-900/60 hover:border-violet-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">📊</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-violet-400 group-hover:text-violet-300 transition-colors">
                Birikmalarning spektrofotometrik titrlash tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning barqarorlik konstantalari, Job metodi yordamida stoxiometriya,
                umumiy barqarorlik konstantasi βn va izosbestik nuqtalar har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-violet-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-violet-600/20 text-violet-400 border border-violet-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Barqarorlik konstantasi</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Job metodi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Stoxiometriya</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Izosbestik nuqtalar</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spektrofotometrik titrlash haqida</h2>
          
          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-violet-400">Spektrofotometrik titrlash</strong> — eritmadagi metall ioniga 
              <strong className="text-violet-400"> ligand eritmasini qo'shib borib, UB-Vis spektrlarini</strong> 
              ketma-ket qayd etishga asoslangan usul. Bu usul yordamida 
              <strong className="text-violet-400"> kompleks hosil bo'lish barqarorlik konstantasi (βn), 
              metall-ligand stoxiometriyasi va kompleksning molyar yutilish koeffitsienti</strong> aniqlanadi.
              Job metodi (uzluksiz variatsiyalar metodi) stoxiometriyani aniqlashning eng ishonchli grafik usuli hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Barqarorlik konstantasi (βn)</strong> — kompleks hosil bo'lishining termodinamik o'lchovi</li>
                <li>• <strong>Metall-ligand stoxiometriyasi</strong> — M:L nisbati (1:1, 1:2, 2:1...)</li>
                <li>• <strong>Molyar yutilish koeffitsienti (ε)</strong> — kompleksning yorug'lik yutish qobiliyati</li>
                <li>• <strong>Izosbestik nuqtalar</strong> — muvozanatdagi turli shakllarning mavjudligini tasdiqlaydi</li>
                <li>• <strong>Bosqichli konstantalar (K₁, K₂...)</strong> — har bir ligand qo'shilishidagi muvozanat</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Metall ioni eritmasiga <strong>ligand eritmasi qo'shib boriladi</strong></li>
                <li>• Har bir qo'shilgandan so'ng <strong>UB-Vis spektri qayd etiladi</strong></li>
                <li>• Spektral o'zgarishlar <strong>ma'lum to'lqin uzunligida</strong> tahlil qilinadi</li>
                <li>• Absorbsiya o'zgarishi asosida <strong>titrlash egri chizig'i</strong> quriladi</li>
                <li>• Chiziqli bo'lmagan regressiya orqali <strong>βn hisoblanadi</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* QIZIQARLI FAKTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💡 Qiziqarli faktlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interestingFacts.map((fact, i) => (
              <div key={i} className="bg-violet-900/20 border border-violet-500/30 rounded-xl p-4">
                <h3 className="text-violet-400 font-bold text-sm mb-2">{fact.title}</h3>
                <p className="text-purple-200 text-xs">{fact.fact}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Barqarorlik konstantasi (βn) — kompleks mustahkamligi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-violet-400">Umumiy barqarorlik konstantasi (βn)</strong> — metall ioniga 
            n ta ligand birikishi natijasida hosil bo'lgan kompleksning termodinamik barqarorligini ifodalaydi.
            βn qancha katta bo'lsa, kompleks shuncha barqaror bo'ladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-violet-400 font-bold mb-3">Muvozanat va formulalar:</h3>
            <div className="space-y-3 text-sm text-purple-200">
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3">
                <p className="font-mono">M + L ⇌ ML &nbsp;&nbsp;&nbsp; K₁ = [ML] / ([M][L])</p>
                <p className="text-xs text-purple-400 mt-1">Birinchi bosqich konstantasi</p>
              </div>
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3">
                <p className="font-mono">ML + L ⇌ ML₂ &nbsp;&nbsp;&nbsp; K₂ = [ML₂] / ([ML][L])</p>
                <p className="text-xs text-purple-400 mt-1">Ikkinchi bosqich konstantasi</p>
              </div>
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3">
                <p className="font-mono">β₂ = K₁ · K₂ = [ML₂] / ([M][L]²)</p>
                <p className="text-xs text-purple-400 mt-1">Umumiy barqarorlik konstantasi</p>
              </div>
              <div className="bg-violet-600/10 border border-violet-500/30 rounded-lg p-3">
                <p className="font-mono">ΔG° = −RT·ln(βn)</p>
                <p className="text-xs text-purple-400 mt-1">Erkin energiya o'zgarishi</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">Komplekslar uchun xarakterli βn qiymatlar (suvli eritma, 298 K):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Stoxiometriya</th>
                  <th className="py-3 px-4 text-purple-300">log βn</th>
                  <th className="py-3 px-4 text-purple-300">Barqarorlik</th>
                  <th className="py-3 px-4 text-purple-300">Rang</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {betaValues.map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-violet-400">{r.complex}</td>
                      <td className="py-3 px-4">{r.stox}</td>
                      <td className="py-3 px-4 font-mono text-yellow-400">{r.logBeta}</td>
                      <td className="py-3 px-4">{r.stability}</td>
                      <td className="py-3 px-4">{r.color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. JOB METODI KALKULYATORI */}
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-8">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🔬</span> Job metodi kalkulyatori — uzluksiz variatsiyalar
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Metall va ligand konsentratsiyalarini kiriting — <strong className="text-violet-300">stoxiometriya</strong> aniqlanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">[M] metall konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConc}
                onChange={(e) => setMetalConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[L] ligand konsentratsiyasi (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConc}
                onChange={(e) => setLigandConc(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">Ligand mol ulushi (xL):</div>
                <div className="text-xl font-mono font-bold text-violet-400">{jobResult.xL}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Stoxiometriya:</div>
                <div className={`text-xl font-mono font-bold ${jobResult.stox.includes("1:1") ? 'text-green-400' : jobResult.stox.includes("1:2") ? 'text-blue-400' : jobResult.stox.includes("1:3") ? 'text-yellow-400' : 'text-yellow-400'}`}>{jobResult.stox}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: xL = [L] / ([M] + [L]) = {ligandConc} / ({metalConc} + {ligandConc}) = {jobResult.xL}
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> xL = 0.5 → 1:1, xL = 0.67 → 1:2, xL = 0.75 → 1:3, xL = 0.80 → 1:4
            </p>
          </div>
        </div>

        {/* 4. βn KALKULYATORI */}
        <div className="bg-violet-900/20 border border-violet-500/30 rounded-2xl p-8">
          <h3 className="text-violet-400 font-bold mb-4 flex items-center gap-2">
            <span>🧮</span> Barqarorlik konstantasi kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            log βn ni kiriting — <strong className="text-violet-300">ΔG°</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">log βn:</label>
              <input
                type="number"
                step="0.1"
                value={betaValue}
                onChange={(e) => setBetaValue(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[M] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={metalConcBeta}
                onChange={(e) => setMetalConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[L] (M):</label>
              <input
                type="number"
                step="0.0001"
                value={ligandConcBeta}
                onChange={(e) => setLigandConcBeta(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-violet-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">βn:</div>
                <div className="text-xl font-mono font-bold text-violet-400">{Math.pow(10, betaValue).toExponential(2)}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">ΔG° (kJ/mol):</div>
                <div className="text-xl font-mono font-bold text-violet-400">{betaResult.deltaG}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: ΔG° = −RT·ln(βn) = −8.314 × 298 × ln(10^{betaValue}) / 1000 = {betaResult.deltaG} kJ/mol
            </p>
          </div>
        </div>

        {/* 5. BENESI-HILDEBRAND KALKULYATORI */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-8">
          <h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
            <span>📊</span> Benesi-Hildebrand kalkulyatori
          </h3>
          <p className="text-xs text-purple-300 mb-5">
            Absorbsiya va ligand konsentratsiyasini kiriting — <strong className="text-blue-300">1/A va 1/[L]</strong> hisoblanadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Absorbsiya (A):</label>
              <input
                type="number"
                step="0.01"
                value={absorbance}
                onChange={(e) => setAbsorbance(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">[L] ligand (M):</label>
              <input
                type="number"
                step="0.001"
                value={ligandConcBH}
                onChange={(e) => setLigandConcBH(Number(e.target.value))}
                className="w-full bg-purple-950 border border-purple-700 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="bg-purple-950/50 rounded-lg p-5 border border-purple-700/30">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-purple-400">1/A:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{bhResult.invAbs}</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">1/[L]:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{bhResult.invLigand}</div>
              </div>
            </div>
            <p className="text-xs text-purple-300 font-mono">
              Formula: 1/(A-A₀) = 1/(ε·[M]·βn) + 1/(ε·[M]·βn·[L])
            </p>
            <p className="text-xs text-purple-400 mt-2">
              💡 <strong>Eslatma:</strong> 1/A vs 1/[L] grafigi chiziqli bo'lsa, βn hisoblanadi.
            </p>
          </div>
        </div>

        {/* 6. IZOSBESTIK NUQTALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Izosbestik nuqtalar — muvozanat ko'rsatkichi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-violet-400">Izosbestik nuqta</strong> — turli konsentratsiyalarda 
            olingan spektrlarning <strong>kesishgan nuqtasi</strong>. Bu nuqta mavjudligi 
            eritmada <strong>faqat ikkita yutuvchi shakl</strong> (erkin metall va kompleks) 
            muvozanatda ekanligini ko'rsatadi. Agar bir nechta izosbestik nuqta kuzatilsa, 
            bu muvozanatning murakkabligini (bir nechta kompleks shakllari) bildiradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Bitta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                Faqat <strong>erkin ligand va kompleks</strong> muvozanatda.
                M + L ⇌ ML — oddiy muvozanat. Izosbestik nuqta to'lqin uzunligida 
                erkin ligand va kompleksning molyar yutilish koeffitsientlari teng.
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Bir nechta izosbestik nuqta</h3>
              <p className="text-purple-200 text-sm">
                <strong>ML, ML₂, ML₃</strong> kabi bir nechta kompleks shakllari muvozanatda.
                Har bir juft shakl uchun alohida izosbestik nuqta kuzatiladi.
                Spektrlarning kesishmasligi — muvozanat murakkabligini ko'rsatadi.
              </p>
            </div>
          </div>
        </div>

        {/* 7. BOSHQA METODLAR */}
        <div className="bg-gradient-to-r from-violet-900/40 to-purple-900/40 border border-violet-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Spektrofotometrik titrlashga yaqin usullar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-violet-300">UV-Vis spektroskopiya</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Asosiy</div>
                  <div className="text-lg font-bold text-green-400">100%</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Spektrlarni qayd etish va tahlil qilish</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Tez va aniq spektral ma'lumotlar</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Faqat yutuvchi moddalar uchun</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-violet-300">Potentsiometrik titrlash</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Qo'shimcha</div>
                  <div className="text-lg font-bold text-green-400">85%</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Potensial o'zgarishini o'lchash</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Rangsiz eritmalar uchun</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Ion-selektiv elektrod kerak</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-violet-300">Kalorimetrik titrlash</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Qo'shimcha</div>
                  <div className="text-lg font-bold text-green-400">80%</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Issiqlik o'zgarishini o'lchash (ΔH)</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Termodinamik parametrlar (ΔH, ΔS)</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Qimmat uskunalar</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30 hover:border-violet-500/50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-bold text-violet-300">NMR spektroskopiya</h3>
                <div className="text-right">
                  <div className="text-[10px] text-purple-400">Qo'shimcha</div>
                  <div className="text-lg font-bold text-green-400">75%</div>
                </div>
              </div>
              <p className="text-xs text-purple-200 mb-3">Yadro magnit rezonansi</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓ Afzallik:</span>
                  <span className="text-purple-300">Strukturaviy ma'lumotlar</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-red-400">✗ Kamchilik:</span>
                  <span className="text-purple-300">Diamagnit moddalar uchun</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-violet-900/20 border border-violet-700/30 rounded-xl p-4">
            <h4 className="text-sm font-bold text-violet-300 mb-2">💡 To'liq tahlil uchun eng yaxshi kombinatsiya:</h4>
            <p className="text-xs text-purple-200 leading-relaxed">
              <strong className="text-white">Spektrofotometrik titrlash (βn, stoxiometriya) + UV-Vis (spektrlar) + NMR (struktura) + Kalorimetriya (ΔH, ΔS)</strong> — to'rtta metod birgalikda kompleksni to'liq tavsiflaydi.
            </p>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrofotometrik titrlash — <strong className="text-violet-400">barqarorlik konstantalarini aniqlashning asosiy usuli</strong></li>
            <li>Umumiy barqarorlik konstantasi βn — <strong className="text-violet-400">kompleks mustahkamligini</strong> ko'rsatadi</li>
            <li>Job metodi — <strong className="text-violet-400">metall-ligand stoxiometriyasini</strong> grafik aniqlaydi</li>
            <li>Izosbestik nuqtalar — <strong className="text-violet-400">muvozanatdagi shakllar sonini</strong> ko'rsatadi</li>
            <li>ΔG° = −RT·ln(βn) — <strong className="text-violet-400">kompleks hosil bo'lish erkin energiyasi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/element-analiz" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Element analiz</Link>
          <Link href="/ilmiy/tahlil/xps" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">XPS spektroskopiya →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • Spektrofotometrik titrlash moduli</p>
          <p className="mt-1">Manbalar: Vogel's Quantitative Chemical Analysis, Skoog (Analytical Chemistry), Job (1928)</p>
        </div>
      </footer>
    </main>
  )
}