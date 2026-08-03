"use client"

import Link from "next/link"
import { useState } from "react"

export default function VernerNazariyasi() {
  const [activeSection, setActiveSection] = useState("kirish")
  const [showHistory, setShowHistory] = useState(false)
  const [showExperiment, setShowExperiment] = useState(false)
  const [selectedComplex, setSelectedComplex] = useState(0)

  const sections = [
    { id: "kirish", label: "📋 Kirish", icon: "📋" },
    { id: "muammo", label: "🔍 Tarixiy muammo", icon: "🔍" },
    { id: "kashfiyot", label: "💡 Verner kashfiyoti", icon: "💡" },
    { id: "valentlik", label: "⚛️ Ikki valentlik", icon: "⚛️" },
    { id: "ichki-tashqi", label: "🔲 Ichki/Tashqi sfera", icon: "🔲" },
    { id: "geometriya", label: "💎 Geometriya", icon: "💎" },
    { id: "meros", label: "🏆 Verner merosi", icon: "🏆" },
  ]

  const kobaltKomplekslari = [
    {
      formula: "[Co(NH₃)₆]Cl₃",
      nomi: "Luteo-kobalt",
      rangi: "🟠 Zarg'aldoq-sariq",
      agcl: "3 mol",
      izoh: "Barcha 3 ta Cl⁻ tashqi sferada — suvda eriydi va Ag⁺ bilan darhol cho'kadi",
      ichki: "[Co(NH₃)₆]³⁺",
      tashqi: "3Cl⁻",
      rangSabab: "6 ta NH₃ kuchli ligand → Δₒ katta → ko'k nur yutiladi → sariq ko'rinadi"
    },
    {
      formula: "[Co(NH₃)₅Cl]Cl₂",
      nomi: "Purpureo-kobalt",
      rangi: "🩷 Pushti-binafsha",
      agcl: "2 mol",
      izoh: "1 ta Cl⁻ ichki sferada (Co ga mustahkam bog'langan), 2 ta Cl⁻ tashqarida",
      ichki: "[Co(NH₃)₅Cl]²⁺",
      tashqi: "2Cl⁻",
      rangSabab: "1 ta Cl⁻ kuchli liganddan kuchsizroq → Δₒ biroz kichik → boshqa rang"
    },
    {
      formula: "[Co(NH₃)₄Cl₂]Cl",
      nomi: "Praseo-kobalt",
      rangi: "🟢 Yashil",
      agcl: "1 mol",
      izoh: "2 ta Cl⁻ ichki sferada, faqat 1 ta Cl⁻ tashqarida",
      ichki: "[Co(NH₃)₄Cl₂]⁺",
      tashqi: "Cl⁻",
      rangSabab: "2 ta Cl⁻ ligand → Δₒ yana kichrayadi → yashil nur qaytariladi"
    },
    {
      formula: "[Co(NH₃)₃Cl₃]",
      nomi: "Neytral kompleks",
      rangi: "🟢 Yashil-kulrang",
      agcl: "0 mol",
      izoh: "3 ta Cl⁻ ham ichki sferada — tashqarida Cl⁻ yo'q, AgCl cho'kmaydi",
      ichki: "[Co(NH₃)₃Cl₃]",
      tashqi: "yo'q",
      rangSabab: "3 ta Cl⁻ ligand → Δₒ eng kichik → yashil-kulrang"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-slate-950 text-white">
      
      {/* HEADER */}
      <header className="border-b border-purple-800/50 sticky top-0 z-40 bg-purple-950/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-xs mb-2 text-purple-400 flex-wrap">
            <Link href="/" className="hover:text-purple-300">🏠 Bosh sahifa</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv" className="hover:text-purple-300">O'quv</Link>
            <span className="text-purple-600">›</span>
            <Link href="/oquv/nomlanishi" className="hover:text-purple-300">Nomlanishi</Link>
            <span className="text-purple-600">›</span>
            <span className="text-red-400 font-semibold">🏛️ Verner nazariyasi</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center gap-2">
                <span className="text-3xl">🏛️</span>
                Verner nazariyasi
              </h1>
              <p className="text-purple-400 text-sm mt-1">
                Alfred Verner (1866–1919) • Koordinatsion birikmalar asoslari • Nobel 1913
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

      {/* SECTION NAVIGATION */}
      <div className="sticky top-[73px] z-30 bg-purple-950/95 backdrop-blur-md border-b border-purple-800/50">
        <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                    : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800/60'
                }`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 1. KIRISH */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "kirish" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                Kompleks birikmalar haqida
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Nima uchun "kompleks" deb ataladi?
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">Koordinatsion birikmalar</strong> — tarkibida metall atomi (yoki ioni) 
                  bilan bog'langan ligand tutgan kompleks tuzilishga ega moddalardir.
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Oddiy misol:</strong> CoCl₃ oddiy tuz. Lekin CoCl₃ + 6NH₃ → 
                    <strong className="text-yellow-400"> [Co(NH₃)₆]Cl₃</strong> — bu endi oddiy tuz emas, 
                    <strong className="text-yellow-400"> kompleks birikma</strong>!
                  </p>
                </div>
              </div>

              <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  Tarixiy kontekst
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  Dastlabki kompleks birikmalar <strong className="text-yellow-400">XVIII asr</strong> boshlarida ma'lum bo'lsa, 
                  ular haqidagi nazariya keyinroq paydo bo'ldi. <strong className="text-yellow-400">1893 yili</strong> shveytsariyalik 
                  kimyogar <strong className="text-yellow-400">Alfred Verner</strong> kobalt(III) tuzlarining ammiak bilan 
                  birikmalarini o'rganadi va fanga kompleks birikmalar tushunchasini kiritadi.
                </p>
                
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-semibold rounded-lg transition-all shadow-lg flex items-center gap-2"
                >
                  <span className="text-xl">{showHistory ? "▼" : "▶"}</span>
                  {showHistory ? "Verner kim edi? (yashirish)" : "Verner kim edi? (ko'rish)"}
                </button>
              </div>

              {showHistory && (
                <div className="mt-6 bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-600/30 rounded-xl p-6 animate-fade-in">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <span className="text-2xl">👨‍🔬</span>
                    Alfred Verner (1866–1919)
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <p className="text-purple-200 text-sm leading-relaxed">
                        <strong className="text-yellow-400">Alfred Verner</strong> — shveytsariyalik kimyogar, 
                        koordinatsion kimyoning otasi. 1893 yilda 27 yoshida o'zining inqilobiy nazariyasini e'lon qildi.
                      </p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <p className="text-purple-200 text-sm leading-relaxed">
                        <strong className="text-yellow-400">Nima muammo bor edi?</strong> O'sha davrda kimyogarlar 
                        kompleks birikmalarning tuzilishini tushuntira olmasdi. Masalan, nima uchun CoCl₃ + 6NH₃ 
                        birikmasi oddiy CoCl₃ dan farq qiladi?
                      </p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <p className="text-purple-200 text-sm leading-relaxed">
                        <strong className="text-yellow-400">Verner javobi:</strong> Metall atomi ikki xil valentlikka ega — 
                        <strong className="text-yellow-400"> asosiy</strong> (ion bog'lar) va 
                        <strong className="text-yellow-400"> qo'shimcha</strong> (koordinatsion bog'lar).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 2. TARIXIY MUAMMO */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "muammo" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🔍</span>
                Tarixiy muammo: Nima uchun ranglar farq qiladi?
              </h2>
              
              <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">❓</span>
                  Jørgensen muammosi
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">Sophus Jørgensen</strong> (Daniyalik kimyogar) kobalt(III) tuzlarining 
                  ammiak bilan birikmalarini sintez qildi. U quyidagi 4 ta birikmani oldi:
                </p>
                
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Muammo:</strong> Bu birikmalarning formulasi bir xil 
                    (CoCl₃ + NH₃), lekin <strong className="text-red-400">ranglari farq qiladi</strong>!
                  </p>
                </div>
              </div>

              {/* Kobalt komplekslari jadvali */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-purple-700">
                      <th className="py-3 px-4 text-purple-300 font-semibold">Formula</th>
                      <th className="py-3 px-4 text-purple-300 font-semibold">Rangi</th>
                      <th className="py-3 px-4 text-purple-300 font-semibold">AgCl cho'kmasi</th>
                    </tr>
                  </thead>
                  <tbody className="text-purple-200">
                    {kobaltKomplekslari.map((k, i) => (
                      <tr 
                        key={i} 
                        className={`border-b border-purple-800/50 hover:bg-purple-800/30 cursor-pointer ${
                          selectedComplex === i ? 'bg-purple-800/50' : ''
                        }`}
                        onClick={() => setSelectedComplex(i)}
                      >
                        <td className="py-3 px-4 font-mono">{k.formula}</td>
                        <td className="py-3 px-4">{k.rangi}</td>
                        <td className="py-3 px-4">{k.agcl}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Nima uchun AgCl cho'kmasi farq qiladi?
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">AgNO₃</strong> qo'shilganda, faqat 
                  <strong className="text-yellow-400"> erkin Cl⁻ ionlari</strong> AgCl cho'kmasi hosil qiladi.
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Ag⁺ + Cl⁻ → AgCl↓</strong> (oq cho'kma)
                  </p>
                </div>
                
                <div className="mt-4 bg-purple-900/50 rounded-lg p-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Savol:</strong> Nima uchun [Co(NH₃)₆]Cl₃ da 3 mol AgCl cho'kadi, 
                    lekin [Co(NH₃)₃Cl₃] da 0 mol?
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 3. KASHFIYOT */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "kashfiyot" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Verner kashfiyoti: Ichki va tashqi sfera
              </h2>
              
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Verner javobi
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">Verner tushuntirdi:</strong> Kompleks birikmalarda metall atomi 
                  <strong className="text-yellow-400"> ikki xil sfera</strong>ga ega:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-bold mb-2">🔲 Ichki sfera [ ]</h4>
                    <p className="text-purple-300 text-sm">
                      Metallga <strong className="text-yellow-400">mustahkam bog'langan</strong> ligandlar. 
                      Kvadrat qavs [ ] ichida yoziladi.
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-bold mb-2">🔓 Tashqi sfera</h4>
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Erkin ionlar</strong> — suvda eriydi, 
                      Ag⁺ bilan cho'kadi.
                    </p>
                  </div>
                </div>
              </div>

              {/* Misol */}
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Misol: [Co(NH₃)₆]Cl₃
                </h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">[Co(NH₃)₆]³⁺</strong> — ichki sfera (mustahkam bog'langan)
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">3Cl⁻</strong> — tashqi sfera (erkin ionlar)
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">AgNO₃ qo'shilganda:</strong> 3Cl⁻ + 3Ag⁺ → 3AgCl↓
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 4. IKKI VALENTLIK */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "valentlik" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">⚛️</span>
                Ikki xil valentlik
              </h2>
              
              <div className="space-y-4">
                <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Asosiy valentlik</h3>
                    <p className="text-purple-300 text-sm">
                      Metallning <strong className="text-yellow-400">oksidlanish darajasi</strong> — ion bog'lar hosil qiladi.
                      Masalan, Co³⁺ → 3 ta Cl⁻ bilan ion bog'.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Qo'shimcha valentlik</h3>
                    <p className="text-purple-300 text-sm">
                      Metallning <strong className="text-yellow-400">koordinatsion soni</strong> — ligandlar bilan koordinatsion bog'lar.
                      Masalan, Co³⁺ → 6 ta NH₃ bilan koordinatsion bog'.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mt-6">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Misol: [Co(NH₃)₆]Cl₃
                </h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Asosiy valentlik:</strong> Co³⁺ → 3 ta Cl⁻ (ion bog'lar)
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Qo'shimcha valentlik:</strong> Co³⁺ → 6 ta NH₃ (koordinatsion bog'lar)
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Koordinatsion son:</strong> 6 (6 ta ligand)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 5. ICHKI/TASHQI SFERA */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "ichki-tashqi" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🔲</span>
                Ichki va tashqi sfera
              </h2>
              
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Yozish qoidasi
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  Kompleks birikmalarni yozishda <strong className="text-yellow-400">kvadrat qavs [ ]</strong> ishlatiladi:
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm font-mono text-lg text-center">
                    [Co(NH₃)₆]Cl₃
                  </p>
                  <p className="text-purple-300 text-xs text-center mt-2">
                    ↑ ichki sfera ↑ tashqi sfera
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-2">🔲 Ichki sfera [ ]</h3>
                  <p className="text-purple-300 text-sm">
                    Metallga <strong className="text-yellow-400">mustahkam bog'langan</strong> ligandlar. 
                    Kvadrat qavs [ ] ichida yoziladi.
                  </p>
                </div>
                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-2">🔓 Tashqi sfera</h3>
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Erkin ionlar</strong> — suvda eriydi, 
                    Ag⁺ bilan cho'kadi.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 6. GEOMETRIYA */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "geometriya" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💎</span>
                Geometriya: Nima uchun oktaedrik?
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Verner bashorati
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">Verner aytgan:</strong> Markaziy atomning qo'shimcha valentligi 
                  fazoda <strong className="text-yellow-400">ma'lum yo'nalishga</strong> ega bo'ladi.
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Savol:</strong> Nima uchun Co³⁺ 6 ta ligand bilan bog'lanadi, 
                    4 yoki 8 emas?
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💎</span>
                  Oktaedrik geometriya
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">6 ta ligand</strong> metall atrofida 
                  <strong className="text-yellow-400"> oktaedrik</strong> joylashadi:
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm font-mono text-center">
                    ↑<br/>
                    ← M →<br/>
                    ↓
                  </p>
                  <p className="text-purple-300 text-xs text-center mt-2">
                    6 ta ligand: yuqori, pastki, chap, o'ng, old, orqa
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* 7. MEROs */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeSection === "meros" && (
          <>
            <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                Verner merosi: Nobel 1913
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-600/30 rounded-xl p-6 mb-6">
                <h3 className="text-yellow-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Nobel mukofoti 1913
                </h3>
                <p className="text-purple-200 leading-relaxed mb-4">
                  <strong className="text-yellow-400">1913 yilda</strong> Alfred Verner 
                  <strong className="text-yellow-400"> Nobel mukofoti</strong>ni oldi — 
                  <strong className="text-yellow-400"> noorganik kimyoda birinchi Nobel</strong>!
                </p>
                <div className="bg-purple-900/50 rounded-lg p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong className="text-yellow-400">Sabab:</strong> "Kimyodagi xizmatlari uchun, 
                    ayniqsa molekulyar tuzilmalar bo'yicha tadqiqotlari uchun"
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-600/30 rounded-xl p-6">
                <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>
                  Verner merosi
                </h3>
                <div className="space-y-3">
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Koordinatsion kimyo</strong> — yangi fan sohasi
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Koordinatsion son</strong> — yangi tushuncha
                    </p>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <p className="text-purple-300 text-sm">
                      <strong className="text-yellow-400">Ichki/tashqi sfera</strong> — yangi tushuncha
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* PASTKI NAVIGATSIYA */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Nomlanishi bo'limi
          </Link>
          <Link 
            href="/oquv/nomlanishi/formula" 
            className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 transition-all text-white font-semibold"
          >
            Keyingi: Formula yozish →
          </Link>
        </div>

      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </main>
  )
}