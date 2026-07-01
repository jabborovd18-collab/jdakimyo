"use client"

import Link from "next/link"
import { useState } from "react"

export default function FormulaYozish() {
  const [activeExample, setActiveExample] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const misollar = [
    {
      formula: "[Co(NH₃)₆]Cl₃",
      nom: "Geksaamminkobalt(III) xlorid",
      tahlil: {
        ichki: "[Co(NH₃)₆]³⁺",
        tashqi: "3Cl⁻",
        metall: "Co³⁺ (d⁶)",
        ligandlar: "6 ta NH₃ (neytral)",
        geometriya: "Oktaedrik",
        rang: "Sariq-jigarrang",
        magnit: "Diamagnit"
      }
    },
    {
      formula: "[Co(NH₃)₅Cl]Cl₂",
      nom: "Pentaamminklorokobalt(III) xlorid",
      tahlil: {
        ichki: "[Co(NH₃)₅Cl]²⁺",
        tashqi: "2Cl⁻",
        metall: "Co³⁺ (d⁶)",
        ligandlar: "5 ta NH₃ + 1 ta Cl⁻",
        geometriya: "Oktaedrik",
        rang: "Pushti-binafsha",
        magnit: "Diamagnit"
      }
    },
    {
      formula: "[Fe(CN)₆]³⁻",
      nom: "Geksatsianoferrat(III) ioni",
      tahlil: {
        ichki: "[Fe(CN)₆]³⁻",
        tashqi: "yo'q (anion kompleks)",
        metall: "Fe³⁺ (d⁵)",
        ligandlar: "6 ta CN⁻ (kuchli maydon)",
        geometriya: "Oktaedrik",
        rang: "Qizil",
        magnit: "Paramagnit (1 e⁻)"
      }
    },
    {
      formula: "[Pt(NH₃)₂Cl₂]",
      nom: "Diammindixloroplatina(II)",
      tahlil: {
        ichki: "[Pt(NH₃)₂Cl₂]",
        tashqi: "yo'q (neytral kompleks)",
        metall: "Pt²⁺ (d⁸)",
        ligandlar: "2 ta NH₃ + 2 ta Cl⁻",
        geometriya: "Kvadrat-tekis",
        rang: "Sariq",
        magnit: "Diamagnit"
      }
    },
    {
      formula: "[Fe(H₂O)₆]²⁺",
      nom: "Geksaakvatemir(II) ioni",
      tahlil: {
        ichki: "[Fe(H₂O)₆]²⁺",
        tashqi: "yo'q (kation kompleks)",
        metall: "Fe²⁺ (d⁶)",
        ligandlar: "6 ta H₂O (kuchsiz maydon)",
        geometriya: "Oktaedrik",
        rang: "Och yashil",
        magnit: "Paramagnit (4 e⁻)"
      }
    },
    {
      formula: "[Cu(NH₃)₄]²⁺",
      nom: "Tetraamminmis(II) ioni",
      tahlil: {
        ichki: "[Cu(NH₃)₄]²⁺",
        tashqi: "yo'q (kation kompleks)",
        metall: "Cu²⁺ (d⁹)",
        ligandlar: "4 ta NH₃",
        geometriya: "Kvadrat-tekis (Yan-Teller buzilishi)",
        rang: "To'q ko'k",
        magnit: "Paramagnit (1 e⁻)"
      }
    }
  ]

  const currentMisollar = misollar[activeExample]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* Header */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv/nomlanishi" className="hover:text-purple-300">Nomlanishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-blue-400 font-semibold">📋 Formula yozish</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                <span className="text-3xl">📋</span>
                Formula yozish qoidalari
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Kompleks birikmalar formulasini to'g'ri yozish tartibi • IUPAC 2005
              </p>
            </div>
            <Link 
              href="/oquv/nomlanishi" 
              className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ← Nomlanishi bo'limi
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 space-y-8">

        {/* 1. Asosiy qoida */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            Asosiy qoida
          </h2>
          
          <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-600/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">1️⃣</span>
              <div className="flex-1">
                <p className="text-purple-200 text-lg mb-4">
                  Avval <strong className="text-yellow-400">ichki sfera</strong>, keyin tashqi sfera yoziladi. 
                  Ichki sfera <strong className="text-yellow-400">kvadrat qavs [ ]</strong> ichida bo'ladi.
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Tartib:</strong> [Markaziy atom + Ligandlar] → Tashqi sfera (ionlar)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 1: [FeCl(H₂O)₅]Cl</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">
                    <strong className="text-yellow-400">Ichki sfera:</strong> [FeCl(H₂O)₅]²⁺
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    Fe²⁺ + 1 ta Cl⁻ + 5 ta H₂O = koordinatsion son 6
                  </p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">
                    <strong className="text-yellow-400">Tashqi sfera:</strong> Cl⁻
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    1 ta erkin Cl⁻ ioni
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 2: [Fe(NH₃)₃(H₂O)₃]Cl₂</h3>
              <div className="space-y-2 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">
                    <strong className="text-yellow-400">Ichki sfera:</strong> [Fe(NH₃)₃(H₂O)₃]²⁺
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    Fe²⁺ + 3 ta NH₃ + 3 ta H₂O = koordinatsion son 6
                  </p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">
                    <strong className="text-yellow-400">Tashqi sfera:</strong> 2Cl⁻
                  </p>
                  <p className="text-purple-300 text-xs mt-1">
                    2 ta erkin Cl⁻ ioni
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Ichki sferada yozish tartibi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📝</span>
            Ichki sferada yozish tartibi
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Muhim qoida
            </h3>
            <p className="text-purple-200 mb-4">
              Ichki sferada <strong className="text-yellow-400">markaziy atom (metall)</strong> birinchi yoziladi, 
              keyin ligandlar <strong className="text-yellow-400">alfavit tartibida</strong> (formuladagi belgilar bo'yicha).
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-600/10 border border-green-600/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                To'g'ri
              </h3>
              <p className="text-purple-200 font-mono text-lg mb-2">[FeCl(H₂O)₅]Cl</p>
              <p className="text-purple-400 text-sm">Fe → Cl → H₂O (alfavit)</p>
              <div className="mt-3 bg-green-900/20 rounded-lg p-3">
                <p className="text-green-300 text-xs">
                  Metall birinchi, keyin ligandlar alfavit bo'yicha
                </p>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">❌</span>
                Noto'g'ri
              </h3>
              <p className="text-purple-200 font-mono text-lg mb-2">[ClFe(H₂O)₅]Cl</p>
              <p className="text-purple-400 text-sm">Ligand markaziy atomdan oldin</p>
              <div className="mt-3 bg-red-900/20 rounded-lg p-3">
                <p className="text-red-300 text-xs">
                  Ligand birinchi yozilgan — XATO!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Alfavit tartibi qoidasi
            </h3>
            <p className="text-purple-200 mb-4">
              IUPAC 2005 qoidasiga ko'ra, ligandlar <strong className="text-yellow-400">formuladagi belgilar bo'yicha alfavit tartibida</strong> yoziladi:
            </p>
            <div className="space-y-3">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-purple-300 text-sm">
                  <strong className="text-yellow-400">Misol:</strong> [CoCl(NH₃)(H₂O)₄]Cl₂
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  Tartib: Cl → N (NH₃) → O (H₂O) — chunki C &lt; N &lt; O
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Ligandlar ketma-ketligi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔤</span>
            Ligandlarni yozish ketma-ketligi
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Tartib qoidasi (IUPAC 2005)
            </h3>
            <p className="text-purple-200 mb-4">
              Ligandlar <strong className="text-yellow-400">formuladagi belgilar bo'yicha alfavit tartibida</strong> yoziladi.
              Avvalgi qoida (anion → neytral → kation) endi eskirgan.
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <span className="text-2xl">1️⃣</span>
              <div className="flex-1">
                <h3 className="text-yellow-400 font-bold mb-2">Alfavit tartibi</h3>
                <p className="text-purple-300 text-sm mb-2">Ligandlar formuladagi birinchi belgi bo'yicha tartiblanadi</p>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">
                    <strong className="text-yellow-400">Misol:</strong> Cl (C) &lt; NH₃ (N) &lt; H₂O (H)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <span className="text-2xl">2️⃣</span>
              <div className="flex-1">
                <h3 className="text-yellow-400 font-bold mb-2">Koordinatsion son</h3>
                <p className="text-purple-300 text-sm mb-2">Har bir ligandning koordinatsion soni qavs ichida ko'rsatiladi</p>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300 text-xs">
                    <strong className="text-yellow-400">Misol:</strong> (NH₃)₃ = 3 ta NH₃ ligandi
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">To'liq misol</h3>
            <div className="font-mono text-blue-400 text-lg mb-3">
              [Co(NH₃)₄Br(H₂O)](NO₃)₂
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-300 text-sm">
                <strong className="text-yellow-400">Tahlil:</strong>
              </p>
              <ul className="text-purple-300 text-xs space-y-1 mt-2">
                <li>• Co³⁺ — markaziy atom</li>
                <li>• (NH₃)₄ — 4 ta ammiak ligandi</li>
                <li>• Br — 1 ta bromid ligandi</li>
                <li>• (H₂O) — 1 ta suv ligandi</li>
                <li>• (NO₃)₂ — 2 ta nitrat ioni (tashqi sfera)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Ambidentat ligandlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔀</span>
            Ambidentat ligandlarni yozish
          </h2>
          
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Nima bu ambidentat ligand?
            </h3>
            <p className="text-purple-200 mb-4">
              <strong className="text-yellow-400">Ambidentat ligand</strong> — bir nechta donor atomga ega bo'lgan ligand. 
              Masalan, SCN⁻ ligandi <strong className="text-yellow-400">S yoki N</strong> orqali bog'lanishi mumkin.
            </p>
            <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
              <p className="text-purple-300 text-sm">
                <strong className="text-yellow-400">Qoida:</strong> Donor atomni ko'rsatish uchun uning 
                <strong className="text-yellow-400"> ostiga chiziladi</strong> yoki <strong className="text-yellow-400">κ-belgisi</strong> ishlatiladi.
              </p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 1: SCN⁻ (tiotsianat)</h3>
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-2">
                    <strong className="text-yellow-400">N atomi orqali bog'langan:</strong>
                  </p>
                  <div className="font-mono text-blue-400 text-lg mb-2">
                    [Fe(<u>N</u>CS)(H₂O)₅]²⁺
                  </div>
                  <p className="text-purple-300 text-xs">
                    Fe−N−C≡S (izotiosianat)
                  </p>
                </div>
                
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-2">
                    <strong className="text-yellow-400">S atomi orqali bog'langan:</strong>
                  </p>
                  <div className="font-mono text-blue-400 text-lg mb-2">
                    [Fe(SC<u>N</u>)(H₂O)₅]²⁺
                  </div>
                  <p className="text-purple-300 text-xs">
                    Fe−S−C≡N (tiosianat)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Misol 2: NO₂⁻ (nitrit)</h3>
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-2">
                    <strong className="text-yellow-400">N atomi orqali (nitro):</strong>
                  </p>
                  <div className="font-mono text-blue-400 text-lg mb-2">
                    [Co(NH₃)₅(<u>N</u>O₂)]²⁺
                  </div>
                  <p className="text-purple-300 text-xs">
                    Co−NO₂ (nitro kompleks)
                  </p>
                </div>
                
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm mb-2">
                    <strong className="text-yellow-400">O atomi orqali (nitrito):</strong>
                  </p>
                  <div className="font-mono text-blue-400 text-lg mb-2">
                    [Co(NH₃)₅(ON<u>O</u>)]²⁺
                  </div>
                  <p className="text-purple-300 text-xs">
                    Co−ONO (nitrito kompleks)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Interaktiv misollar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🧪</span>
            Interaktiv misollar
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {misollar.map((m, i) => (
              <button
                key={i}
                onClick={() => setActiveExample(i)}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeExample === i
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/50'
                }`}
              >
                {m.formula}
              </button>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-4">{currentMisollar.formula}</h3>
            <p className="text-purple-200 mb-4">{currentMisollar.nom}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Ichki sfera</p>
                  <p className="text-purple-200 font-mono">{currentMisollar.tahlil.ichki}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Tashqi sfera</p>
                  <p className="text-purple-200 font-mono">{currentMisollar.tahlil.tashqi}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Markaziy atom</p>
                  <p className="text-purple-200">{currentMisollar.tahlil.metall}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Ligandlar</p>
                  <p className="text-purple-200">{currentMisollar.tahlil.ligandlar}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Geometriya</p>
                  <p className="text-purple-200">{currentMisollar.tahlil.geometriya}</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-400 text-xs mb-1">Magnit xossasi</p>
                  <p className="text-purple-200">{currentMisollar.tahlil.magnit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Murakkab misollar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🔬</span>
            Murakkab misollar
          </h2>

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-bold rounded-xl transition-all shadow-lg mb-6"
          >
            {showAdvanced ? "▼ Murakkab misollarni yashirish" : "▶ Murakkab misollarni ko'rish"}
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-3">Polimetal komplekslar</h3>
                <div className="font-mono text-blue-400 text-lg mb-3">
                  [(NH₃)₅Co−OH−Co(NH₃)₅]⁵⁺
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Tahlil:</strong> Ikki metall atomi (Co) gidroksid ko'prigi orqali bog'langan
                  </p>
                </div>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-3">Klaste komplekslar</h3>
                <div className="font-mono text-blue-400 text-lg mb-3">
                  [Mo₆Cl₁₂]²⁺
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Tahlil:</strong> 6 ta Mo atomi klaster hosil qilgan, 12 ta Cl⁻ ligand
                  </p>
                </div>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-3">Xelat komplekslar</h3>
                <div className="font-mono text-blue-400 text-lg mb-3">
                  [Co(en)₃]³⁺
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Tahlil:</strong> 3 ta etilendiamin (en) ligandi — har biri bidentat (2 ta donor atom)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi/verner" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Verner nazariyasi
          </Link>
          <Link 
            href="/oquv/nomlanishi/iupac" 
            className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 transition-all text-white font-semibold"
          >
            Keyingi: IUPAC qoidalari →
          </Link>
        </div>

      </section>

    </main>
  )
}