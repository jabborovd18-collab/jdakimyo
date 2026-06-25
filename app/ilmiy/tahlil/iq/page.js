"use client"

import Link from "next/link"
import { useState, useMemo } from "react"

// ═══════════════════════════════════════════════════════════════════════════════
// IQ SPEKTROSKOPIYA — ASOSIY SAHIFA (PREMIUM)
// Manbalar: Nakamoto (Infrared and Raman Spectra), Nakamoto (IR Spectra of Inorganic Compounds)
// Xususiyat: Metall-ligand tebranishlari, ambidentat ligandlar, sis-trans izomerlar
// O'ziga xoslik: Guruhiy nazariya, simmetriya, tanlash qoidalari
// Maqsad: Premium ilmiy sayt — barcha mayda detallar bilan
// ═══════════════════════════════════════════════════════════════════════════════

const IQ_DATA = {
  // Metall-ligand tebranish chastotalari
  metalLigandVibrations: [
    { complex: "[Co(NH₃)₆]³⁺", bond: "Co-N", freq: "500-450", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Co(NH₃)₅Cl]²⁺", bond: "Co-N", freq: "490-470", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Co(NH₃)₅Cl]²⁺", bond: "Co-Cl", freq: "330-310", type: "O'rta bog'", color: "text-orange-400" },
    { complex: "[Fe(CN)₆]³⁻", bond: "Fe-C", freq: "510", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]³⁻", bond: "C≡N", freq: "2135", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]⁴⁻", bond: "Fe-C", freq: "490", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Fe(CN)₆]⁴⁻", bond: "C≡N", freq: "2044", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[PtCl₄]²⁻", bond: "Pt-Cl", freq: "330-320", type: "Og'ir metall", color: "text-orange-400" },
    { complex: "[Ni(CO)₄]", bond: "Ni-C", freq: "420", type: "Karbonil", color: "text-blue-400" },
    { complex: "[Ni(CO)₄]", bond: "C≡O", freq: "2057", type: "Kuchli bog'", color: "text-blue-400" },
    { complex: "[Cr(H₂O)₆]³⁺", bond: "Cr-O", freq: "490", type: "Akvakompleks", color: "text-blue-400" },
    { complex: "[Cu(NH₃)₄]²⁺", bond: "Cu-N", freq: "450-420", type: "O'rta bog'", color: "text-orange-400" },
    { complex: "[Zn(phen)₃]²⁺", bond: "Zn-N", freq: "420-380", type: "Xelat", color: "text-orange-400" },
    { complex: "[Fe(acac)₃]", bond: "Fe-O", freq: "560-530", type: "Xelat", color: "text-orange-400" },
    { complex: "[Cu(salen)]", bond: "Cu-N", freq: "450", type: "Schiff asos", color: "text-orange-400" },
    { complex: "[Cu(salen)]", bond: "Cu-O", freq: "420", type: "Schiff asos", color: "text-orange-400" },
  ],

  // Ambidentat ligandlar
  ambidentateLigands: [
    {
      name: "NO₂⁻ (Nitrito)",
      bonded: [
        { type: "Nitro (N-bog'langan)", formula: "M-NO₂", freq_as: "1420-1400", freq_s: "1320-1300", color: "text-green-400", example: "[Co(NH₃)₅NO₂]Cl₂ (sariq)" },
        { type: "Nitrito (O-bog'langan)", formula: "M-ONO", freq_as: "1470-1450", freq_s: "1065-1060", color: "text-red-400", example: "[Co(NH₃)₅ONO]Cl₂ (qizil)" }
      ],
      linkageIsomerism: "Linkage izomerizm — bir xil ligand turli atom orqali bog'lanishi mumkin"
    },
    {
      name: "SCN⁻ (Tiosianato)",
      bonded: [
        { type: "Tiosianato (S-bog'langan)", formula: "M-SCN", freq_cn: "2120-2100", freq_cs: "710-690", color: "text-green-400", example: "[Pd(SCN)₄]²⁻" },
        { type: "Izotiosianato (N-bog'langan)", formula: "M-NCS", freq_cn: "2080-2050", freq_cs: "790-780", color: "text-blue-400", example: "[Fe(SCN)]²⁺ (qizil)" }
      ],
      linkageIsomerism: "HSAB nazariyasi: yumshoq metallar S orqali, qattiq metallar N orqali bog'lanadi"
    },
    {
      name: "CN⁻ (Tsiano)",
      bonded: [
        { type: "Tsiano (C-bog'langan)", formula: "M-CN", freq_cn: "2150-2120", freq_cn2: "2130-2100", color: "text-green-400", example: "[Fe(CN)₆]⁴⁻" },
        { type: "Izotsiano (N-bog'langan)", formula: "M-NC", freq_cn: "2180-2150", freq_cn2: "2150-2120", color: "text-blue-400", example: "[Co(NC)₆]³⁻" }
      ],
      linkageIsomerism: "C-bog'lanish kuchliroq (π-backbonding), N-bog'lanish kuchsizroq"
    }
  ],

  // Sis-trans izomerlar
  cisTransIsomers: [
    {
      name: "[Pt(NH₃)₂Cl₂] (Sisplatin)",
      isomers: [
        { 
          type: "sis-izomer", 
          color: "text-blue-400", 
          freq_ML: "330, 315 cm⁻¹ (2 ta Pt-Cl)",
          freq_ML2: "510, 490 cm⁻¹ (2 ta Pt-N)",
          symmetry: "C₂ᵥ — kam simmetriya",
          irActive: "Ko'p IQ faol tebranishlar"
        },
        { 
          type: "trans-izomer", 
          color: "text-orange-400", 
          freq_ML: "325 cm⁻¹ (1 ta Pt-Cl)",
          freq_ML2: "500 cm⁻¹ (1 ta Pt-N)",
          symmetry: "D₂ₕ — yuqori simmetriya",
          irActive: "Kam IQ faol tebranishlar (simmetriya tufayli)"
        }
      ],
      explanation: "Trans izomerda simmetriya yuqori — ba'zi tebranishlar IQ faol emas (tanlash qoidalari)"
    },
    {
      name: "[Co(en)₂Cl₂]Cl",
      isomers: [
        { 
          type: "sis-izomer", 
          color: "text-blue-400", 
          freq_ML: "490, 470 cm⁻¹ (2 ta Co-N)",
          freq_ML2: "330, 310 cm⁻¹ (2 ta Co-Cl)",
          symmetry: "C₂ — kam simmetriya",
          irActive: "Ko'p IQ faol tebranishlar"
        },
        { 
          type: "trans-izomer", 
          color: "text-orange-400", 
          freq_ML: "480 cm⁻¹ (1 ta Co-N)",
          freq_ML2: "325 cm⁻¹ (1 ta Co-Cl)",
          symmetry: "D₂ₕ — yuqori simmetriya",
          irActive: "Kam IQ faol tebranishlar"
        }
      ],
      explanation: "Sis-izomer biologik faol, trans-izomer faol emas"
    }
  ],

  // Funksional guruhlar
  functionalGroups: [
    { group: "O-H", freq: "3600-3200", type: "Keng polosa", example: "Akvakomplekslar" },
    { group: "N-H", freq: "3400-3200", type: "O'rta polosa", example: "Ammin komplekslar" },
    { group: "C≡N", freq: "2200-2100", type: "Kuchli polosa", example: "Tsiano komplekslar" },
    { group: "C≡O", freq: "2100-1900", type: "Kuchli polosa", example: "Karbonil komplekslar" },
    { group: "C=O", freq: "1700-1600", type: "Kuchli polosa", example: "Atsetilasetonat" },
    { group: "C=N", freq: "1650-1600", type: "O'rta polosa", example: "Schiff asoslar" },
    { group: "M-N", freq: "550-400", type: "Past chastota", example: "Ammin komplekslar" },
    { group: "M-O", freq: "600-400", type: "Past chastota", example: "Akvakomplekslar" },
    { group: "M-Cl", freq: "400-250", type: "Past chastota", example: "Xlorokomplekslar" },
  ]
}

export default function IQSpektroskopiya() {
  const [showHeader, setShowHeader] = useState(true)
  const [showWarningModal, setShowWarningModal] = useState(true)
  const [activeAmbidentate, setActiveAmbidentate] = useState(0)
  const [activeCisTrans, setActiveCisTrans] = useState(0)
  const [freqSlider, setFreqSlider] = useState(2000)
  const [activeFunctionalGroup, setActiveFunctionalGroup] = useState(0)

  const currentFreq = useMemo(() => {
    return freqSlider
  }, [freqSlider])

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 via-blue-950/20 to-blue-950 text-white">
      
      {/* OGOHLANTIRISH MODALI */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-blue-950 to-purple-950 border-2 border-blue-500 rounded-2xl p-6 max-w-3xl w-full animate-pulse">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              <span className="text-3xl">📊</span> IQ SPEKTROSKOPIYA — METALL-LIGAND TEBRANISHLARI!
            </h3>
            <p className="text-purple-200 text-sm mb-4">
              <strong className="text-blue-300">IQ (Infraqizil) spektroskopiya</strong> — molekulalardagi 
              tebranish chastotalarini o'lchashga asoslangan usul.
            </p>
            
            <div className="bg-blue-950/60 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-blue-400 font-bold mb-2">📊 Nima o'lchanadi?</div>
                  <div className="text-purple-200">
                    <strong>Metall-ligand bog'i</strong> mavjudligini
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Ambidentat ligandlar</strong> — qaysi atom bog'langan
                  </div>
                </div>
                <div>
                  <div className="text-blue-400 font-bold mb-2">🔬 Qanday ishlaydi?</div>
                  <div className="text-purple-200">
                    <strong>IQ nurlar</strong> — 4000-400 cm⁻¹ oralig'ida
                  </div>
                  <div className="text-purple-200 mt-2">
                    <strong>Sis-trans izomerlar</strong> farqini aniqlash
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Guruhiy nazariya:</strong> Har bir bog' o'ziga xos chastotada tebranadi. 
                Bu "molekulyar barmoq izi" — har bir kompleks o'ziga xos IQ spektrga ega.
              </p>
            </div>

            <div className="bg-blue-900/30 rounded-lg p-3 mb-4">
              <p className="text-xs text-purple-200">
                <strong className="text-blue-300">Past chastotali IQ:</strong> 600-200 cm⁻¹ oralig'i — metall-ligand tebranishlari. 
                Bu soha "uzoq IQ" deb ataladi.
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
              <span className="text-blue-400 font-semibold">IQ spektroskopiya</span>
            </nav>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-400 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  IQ spektroskopiya
                </h1>
                <p className="text-purple-400 text-sm mt-1">
                  Infraqizil spektroskopiya • Tebranish chastotalari • Ligand bog'lanish turini aniqlash
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Metall-ligand</span>
                  <span className="px-2 py-1 rounded bg-blue-900/30 border border-blue-700/50 text-blue-400 text-[10px] uppercase tracking-wide">Ambidentat</span>
                  <span className="px-2 py-1 rounded bg-yellow-900/30 border border-yellow-700/50 text-yellow-400 text-[10px] uppercase tracking-wide">Sis-trans</span>
                  <span className="px-2 py-1 rounded bg-green-900/30 border border-green-700/50 text-green-400 text-[10px] uppercase tracking-wide">Guruhiy nazariya</span>
                </div>
              </div>
              <Link href="/ilmiy/tahlil/iq/birikmalar" className="text-xs bg-blue-600/80 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                Birikmalar IQ tahlili →
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

        {/* BIRIKMALAR KARTASI */}
        <Link 
          href="/ilmiy/tahlil/iq/birikmalar"
          className="group block bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-6 hover:bg-blue-900/60 hover:border-blue-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔍</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                Birikmalarning IQ tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                12 ta kompleks birikmaning IQ spektrlari tahlili. Har bir birikma uchun cho'qqilar jadvali, 
                spektr grafigi, metall-ligand tebranish chastotalari va guruh nazariyasi tahlili.
              </p>
            </div>
            <div className="text-3xl text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Spektr grafigi</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Cho'qqilar jadvali</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Guruh nazariyasi</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 IQ spektroskopiya haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">IQ (Infraqizil) spektroskopiya</strong> — molekulalardagi 
              <strong className="text-yellow-400"> tebranish chastotalarini</strong> o'lchashga asoslangan usul.
              Kompleks birikmalarda <strong className="text-yellow-400">metall-ligand bog'lanishini</strong>, 
              ligandning qaysi atom orqali bog'langanini (ambidentat ligandlar) va 
              <strong className="text-yellow-400"> sis-trans izomerlarni</strong> farqlashda ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Metall-ligand bog'i</strong> mavjudligini</li>
                <li>• <strong>Ambidentat ligandlar</strong> (qaysi atom bog'langan)</li>
                <li>• <strong>Sis-trans izomerlar</strong> farqini</li>
                <li>• <strong>Koordinatsion bog'</strong> mustahkamligini</li>
                <li>• <strong>Funksional guruhlar</strong> mavjudligini</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Namunaga <strong>IQ nurlar</strong> yuboriladi</li>
                <li>• 4000-400 cm⁻¹ oralig'ida</li>
                <li>• Molekulalar <strong>tebranish energiyasini</strong> yutadi</li>
                <li>• Har bir bog' <strong>o'ziga xos chastotada</strong> yutiladi</li>
                <li>• "Molekulyar barmoq izi"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. METALL-LIGAND TEBRANISHLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Metall-ligand tebranish chastotalari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            IQ spektroskopiyada <strong className="text-yellow-400">eng muhim soha</strong> — 
            600-200 cm⁻¹ oralig'idagi <strong>metall-ligand tebranishlari</strong>. 
            Bu soha "uzoq IQ" yoki "past chastotali IQ" deb ataladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Kompleks</th>
                  <th className="py-3 px-4 text-purple-300">Bog'</th>
                  <th className="py-3 px-4 text-purple-300">Chastota (cm⁻¹)</th>
                  <th className="py-3 px-4 text-purple-300">Izoh</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {IQ_DATA.metalLigandVibrations.map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400 text-sm">{r.complex}</td>
                    <td className="py-3 px-4">{r.bond}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r.freq}</td>
                    <td className="py-3 px-4 text-sm">{r.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. AMBIDENTAT LIGANDLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔀 Ambidentat ligandlarni IQ orqali farqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            IQ spektroskopiya <strong className="text-yellow-400">ambidentat ligandlarning</strong> qaysi atom orqali 
            bog'langanini aniqlashda eng ishonchli usul hisoblanadi.
          </p>

          {/* Ambidentate ligand selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.ambidentateLigands.map((lig, i) => (
              <button
                key={i}
                onClick={() => setActiveAmbidentate(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeAmbidentate === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-blue-500"
                }`}
              >
                {lig.name}
              </button>
            ))}
          </div>

          {IQ_DATA.ambidentateLigands.map((lig, i) => (
            activeAmbidentate === i && (
              <div key={i} className="space-y-4">
                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">{lig.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {lig.bonded.map((bonded, j) => (
                      <div key={j} className="bg-purple-900/50 rounded-lg p-4">
                        <p className={`${bonded.color} font-bold mb-2`}>{bonded.type}</p>
                        <p className="text-purple-200">Formula: {bonded.formula}</p>
                        {bonded.freq_as && (
                          <p className="text-purple-200">ν<sub>as</sub>: ~{bonded.freq_as} cm⁻¹</p>
                        )}
                        {bonded.freq_s && (
                          <p className="text-purple-200">ν<sub>s</sub>: ~{bonded.freq_s} cm⁻¹</p>
                        )}
                        {bonded.freq_cn && (
                          <p className="text-purple-200">ν(C≡N): ~{bonded.freq_cn} cm⁻¹</p>
                        )}
                        {bonded.freq_cs && (
                          <p className="text-purple-200">ν(C-S): ~{bonded.freq_cs} cm⁻¹</p>
                        )}
                        <p className="text-purple-200 mt-2 text-[10px] italic">Misol: {bonded.example}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-purple-300 text-xs mt-3 italic">
                    {lig.linkageIsomerism}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {/* 4. SIS-TRANS FARQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Sis-trans izomerlarni IQ orqali farqlash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Sis va trans izomerlar <strong className="text-yellow-400">simmetriyasi har xil</strong> bo'lgani uchun 
            IQ spektrlarida farq qiladi. Trans izomerlarda ko'proq simmetriya tufayli ba'zi tebranishlar "ko'rinmaydi".
          </p>

          {/* Cis-trans selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.cisTransIsomers.map((isomer, i) => (
              <button
                key={i}
                onClick={() => setActiveCisTrans(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeCisTrans === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-blue-500"
                }`}
              >
                {isomer.name}
              </button>
            ))}
          </div>

          {IQ_DATA.cisTransIsomers.map((isomer, i) => (
            activeCisTrans === i && (
              <div key={i}>
                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-2">{isomer.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {isomer.isomers.map((iso, j) => (
                      <div key={j} className={`bg-${iso.color === 'text-blue-400' ? 'blue' : 'orange'}-600/10 border border-${iso.color === 'text-blue-400' ? 'blue' : 'orange'}-500/30 rounded-xl p-4`}>
                        <p className={`${iso.color} font-bold mb-2`}>{iso.type}</p>
                        <p className="text-purple-200">M-L: {iso.freq_ML}</p>
                        <p className="text-purple-200">M-L₂: {iso.freq_ML2}</p>
                        <p className="text-purple-200 mt-2 text-[10px]">{iso.symmetry}</p>
                        <p className="text-purple-200 mt-1 text-[10px] italic">{iso.irActive}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-purple-300 text-xs mt-3 italic">
                    {isomer.explanation}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {/* 5. FUNKSIONAL GURUHLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Funksional guruhlar chastotalari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            IQ spektroskopiyada <strong className="text-yellow-400">funksional guruhlar</strong> o'ziga xos chastotalarda tebranadi.
          </p>

          {/* Functional group selector */}
          <div className="flex flex-wrap gap-2 mb-4">
            {IQ_DATA.functionalGroups.map((group, i) => (
              <button
                key={i}
                onClick={() => setActiveFunctionalGroup(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                  activeFunctionalGroup === i
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-purple-950/50 border-purple-700/30 text-purple-400 hover:border-blue-500"
                }`}
              >
                {group.group}
              </button>
            ))}
          </div>

          {IQ_DATA.functionalGroups.map((group, i) => (
            activeFunctionalGroup === i && (
              <div key={i}>
                <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                  <h3 className="text-yellow-400 font-bold mb-3">{group.group}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <p className="text-yellow-400 font-bold mb-2">Chastota</p>
                      <p className="text-purple-200">{group.freq} cm⁻¹</p>
                    </div>
                    <div className="bg-purple-900/50 rounded-lg p-4">
                      <p className="text-yellow-400 font-bold mb-2">Polosa turi</p>
                      <p className="text-purple-200">{group.type}</p>
                    </div>
                  </div>
                  <p className="text-purple-300 text-xs mt-3 italic">
                    Misol: {group.example}
                  </p>
                </div>
              </div>
            )
          ))}
        </div>

        {/* 6. INTERAKTIV SPEKTR GRAFIGI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Interaktiv IQ spektr grafigi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">IQ spektr grafigi</strong> — to'lqin soni (cm⁻¹) vs yutilish (%).
            Slayderni harakatlantirib, chastotani o'zgartiring.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <label className="block text-blue-400 font-bold mb-2">
              To'lqin soni: {freqSlider} cm⁻¹
            </label>
            <input
              type="range"
              min="400"
              max="4000"
              value={freqSlider}
              onChange={(e) => setFreqSlider(Number(e.target.value))}
              className="w-full h-2 bg-purple-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-purple-400 mt-1">
              <span>400 cm⁻¹</span>
              <span>2000 cm⁻¹</span>
              <span>4000 cm⁻¹</span>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-purple-400">To'lqin soni:</div>
                <div className="text-xl font-mono font-bold text-blue-400">{currentFreq} cm⁻¹</div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Soha:</div>
                <div className="text-xl font-mono font-bold text-blue-400">
                  {currentFreq > 2000 ? "X-H tebranishlar" : currentFreq > 1500 ? "Ikki atomli" : currentFreq > 600 ? "M-L tebranishlar" : "Past chastota"}
                </div>
              </div>
              <div>
                <div className="text-xs text-purple-400">Bog' turi:</div>
                <div className="text-xl font-mono font-bold text-blue-400">
                  {currentFreq > 2000 ? "X-H" : currentFreq > 1500 ? "C=O, C=N" : currentFreq > 600 ? "M-N, M-O" : "M-Cl"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. QIZIQARLI FAKTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">💡 Qiziqarli faktlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Guruhiy nazariya</h3>
              <p className="text-purple-200 text-xs">Har bir bog' o'ziga xos chastotada tebranadi. Bu "molekulyar barmoq izi" — har bir kompleks o'ziga xos IQ spektrga ega.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Past chastotali IQ</h3>
              <p className="text-purple-200 text-xs">600-200 cm⁻¹ oralig'i — metall-ligand tebranishlari. Bu soha "uzoq IQ" deb ataladi.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Simmetriya va tanlash qoidalari</h3>
              <p className="text-purple-200 text-xs">Yuqori simmetriyali molekulalarda ba'zi tebranishlar IQ faol emas. Trans izomerlarda kamroq cho'qqilar ko'rinadi.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Linkage izomerizm</h3>
              <p className="text-purple-200 text-xs">Ambidentat ligandlar (NO₂⁻, SCN⁻) turli atom orqali bog'lanishi mumkin. IQ orqali qaysi atom bog'langanini aniqlash mumkin.</p>
            </div>
          </div>
        </div>

        {/* 8. LABORATORIYA TARTIBI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Laboratoriyada 0 dan bajarish tartibi</h2>
          
          <div className="space-y-3">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 font-bold mb-2">1. Namuna tayyorlash</p>
              <p className="text-purple-200 text-xs">1-2 mg namunani KBr tabletkasi bilan aralashtiring yoki ATR (Attenuated Total Reflectance) usulidan foydalaning.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 font-bold mb-2">2. IQ spektrometrni tayyorlash</p>
              <p className="text-purple-200 text-xs">IQ spektrometrni yoqing, 30 daqiqa isitish. Fon spektrini oling (background).</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 font-bold mb-2">3. Spektrni olish</p>
              <p className="text-purple-200 text-xs">4000-400 cm⁻¹ oralig'ida spektrni oling. Har bir cho'qqini aniqlang.</p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <p className="text-blue-400 font-bold mb-2">4. Cho'qqilarni aniqlash</p>
              <p className="text-purple-200 text-xs">Har bir cho'qqini funksional guruhlar jadvali bilan solishtiring. M-L tebranishlarni aniqlang.</p>
            </div>
          </div>
        </div>

        {/* 9. KENGAYTIRUVCHI METODLAR */}
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <span>⚖️</span> Kengaytiruvchi metodlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sm font-bold text-blue-300">Raman spektroskopiya</h3>
              <p className="text-xs text-purple-200 mb-3">IQ faol bo'lmagan tebranishlarni aniqlash</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓:</span>
                  <span className="text-purple-300">Simmetrik tebranishlar</span>
                </div>
              </div>
            </div>
            <div className="bg-purple-950/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sm font-bold text-blue-300">EXAFS</h3>
              <p className="text-xs text-purple-200 mb-3">Metall-ligand masofalarini aniqlash</p>
              <div className="space-y-2 text-[10px]">
                <div className="flex gap-2">
                  <span className="text-green-400">✓:</span>
                  <span className="text-purple-300">Mahalliy struktura</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSALAR */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>IQ — <strong className="text-yellow-400">metall-ligand bog'lanishini</strong> o'rganishda asosiy usul</li>
            <li>Past chastotali soha (600-200 cm⁻¹) — <strong>M-L tebranishlari</strong></li>
            <li>Ambidentat ligandlarni <strong>ishonchli farqlash</strong> imkonini beradi</li>
            <li>Sis-trans izomerlar <strong>simmetriya farqi</strong> tufayli ajratiladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/ub-vis" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← UB-Vis</Link>
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">NMR spektroskopiya →</Link>
        </div>

      </section>

      <footer className="border-t border-purple-800/30 py-6 mt-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-purple-500">
          <p>© 2026 Koordinatsion kimyo tahlil portali • IQ spektroskopiya moduli</p>
          <p className="mt-1">Manbalar: Nakamoto (Infrared and Raman Spectra of Inorganic and Coordination Compounds)</p>
        </div>
      </footer>
    </main>
  )
}