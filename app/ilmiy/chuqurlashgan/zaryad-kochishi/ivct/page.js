"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// IVCT INTERAKTIV SLAYDERI
// ============================================================================
function IVCTSlayder() {
  const [classType, setClassType] = useState(2)
  
  const classes = {
    1: {
      title: "I sinf — To'liq lokalizatsiyalangan",
      desc: "Elektron faqat bitta metall markazida lokalizatsiyalangan. IVCT (intervalent zaryad ko'chishi) yo'q yoki juda kuchsiz. Metall markazlari orasidagi o'zaro ta'sir juda kuchsiz — ular mustaqil komplekslar kabi harakat qiladi. Valentlik 'muzlatilgan'.",
      ivct: "IVCT kuzatilmaydi yoki juda kuchsiz (ε < 100 M⁻¹sm⁻¹)",
      example: "[Pt(NH₃)₄]²⁺/[PtCl₄]²⁻ aralashmasi — har biri o'z rangida, valentlik aniq ajralgan",
      eCoupling: "H_ab ≈ 0 (juda kichik, < 100 sm⁻¹)",
      deltaE: "ΔE° katta — termal aktivatsiya kerak, lekin baribir IVCT yo'q",
      color: "Har bir ion o'z rangida — aralash rang, IVCT hissasi yo'q",
      spectroscopy: "UB-Vis: alohida ionlarning d−d va CT spektrlari. Yangi polosa kuzatilmaydi.",
      epr: "EPR: ikkita alohida signal (har bir metall uchun). Magnit moment additiv.",
      xray: "Rentgen: ikki xil M−L masofasi (oksidlanish darajalariga mos).",
      theory: "2H_ab << λ (qayta tashkilanish energiyasi). Elektron lokalizatsiyalangan.",
      colorClass: "bg-red-600/10 border-red-500/30",
      textColor: "text-red-400",
      bgBtn: "from-red-500 via-yellow-500 to-green-500"
    },
    2: {
      title: "II sinf — Qisman delokalizatsiyalangan",
      desc: "Elektron asosan bir markazda, lekin ikkinchi markazga o'tish ehtimoli mavjud. IVCT yutilishi kuzatiladi — bu aralash valentli komplekslarning xarakterli belgisi. Termal aktivatsiya orqali elektron ko'chishi sodir bo'ladi. Bu sinf eng ko'p uchraydi.",
      ivct: "IVCT kuzatiladi (ε ≈ 10²−10⁴ M⁻¹sm⁻¹) — xarakterli rang! Yarim kenglik nazariy qiymatdan kengroq.",
      example: "Prussiya ko'ki (Fe₄[Fe(CN)₆]₃) — Fe²⁺(HS) → Fe³⁺(LS) IVCT (~680 nm)",
      eCoupling: "H_ab ≈ 500−2000 sm⁻¹ (o'rtacha elektron bog'lanish)",
      deltaE: "ΔE° o'rtacha — termal + optik ko'chish. Ikki xil valentlik mavjud.",
      color: "IVCT tufayli intensiv rang — ko'k (Prussiya ko'ki). Rang erituvchiga bog'liq.",
      spectroscopy: "UB-Vis-NIR: IVCT polosa — keng, intensiv. Solvatoxromizm kuzatiladi.",
      epr: "EPR: haroratga bog'liq. Past T da lokalizatsiyalangan signal, yuqori T da almashinuv torayishi.",
      xray: "Rentgen: ikki xil M−L masofasi, lekin farq I sinfdan kichikroq. Termal harakat mavjud.",
      theory: "2H_ab ≈ λ. Elektron qisman delokalizatsiyalangan. Hush-Robinson modeli.",
      colorClass: "bg-yellow-600/10 border-yellow-500/30",
      textColor: "text-yellow-400",
      bgBtn: "from-red-500 via-yellow-500 to-green-500"
    },
    3: {
      title: "III sinf — To'liq delokalizatsiyalangan",
      desc: "Elektron ikkala metall markazi o'rtasida to'liq delokalizatsiyalangan — ular orasidagi farq yo'qoladi. Ikkala metall bir xil 'o'rtacha' oksidlanish darajasiga ega. IVCT juda intensiv va tor pik — intervalent zaryad ko'chishi. Molekulyar orbital tavsifi qo'llaniladi.",
      ivct: "IVCT juda intensiv (ε > 10⁴ M⁻¹sm⁻¹) — tor pik. Yarim kenglik nazariy qiymatga yaqin.",
      example: "Creutz-Taube ioni: [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ (har bir Ru +2.5 o'rtacha oksidlanish darajasida)",
      eCoupling: "H_ab katta (> 2000 sm⁻¹) — kuchli elektron bog'lanish, kovalent xarakter",
      deltaE: "ΔE° ≈ 0 — elektron erkin harakatlanadi. Ikki metall ekvivalent.",
      color: "IVCT — NIR sohada (~1570 nm, ko'rinmaydi). Ko'rinadigan sohada boshqa o'tishlar.",
      spectroscopy: "UB-Vis-NIR: IVCT tor va intensiv. Valent tebranishlari IQ da bitta pik.",
      epr: "EPR: bitta signal yoki umuman yo'q (butunlay delokalizatsiyalangan).",
      xray: "Rentgen: bir xil M−L masofasi. Ikki metallni farqlab bo'lmaydi!",
      theory: "2H_ab > λ. Elektron to'liq delokalizatsiyalangan. Molekulyar orbital nazariyasi.",
      colorClass: "bg-green-600/10 border-green-500/30",
      textColor: "text-green-400",
      bgBtn: "from-red-500 via-yellow-500 to-green-500"
    }
  }

  const c = classes[classType]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎚️ Robin-Day klassifikatsiyasi — interaktiv slayder</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-red-400 font-bold">I sinf</span>
          <input 
            type="range" 
            min="1" max="3" 
            value={classType} 
            onChange={(e) => setClassType(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-green-400 font-bold">III sinf</span>
        </div>
        
        <div className={`rounded-xl p-5 border ${c.colorClass}`}>
          <h4 className={`font-bold text-lg mb-3 ${c.textColor}`}>{c.title}</h4>
          <p className="text-purple-200 text-sm mb-4">{c.desc}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">IVCT (intervalent zaryad ko'chishi):</p>
              <p className="text-purple-200">{c.ivct}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Elektron bog'lanish energiyasi:</p>
              <p className="text-purple-200">{c.eCoupling}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Redoks asimmetriyasi:</p>
              <p className="text-purple-200">{c.deltaE}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Nazariy mezon:</p>
              <p className="text-purple-200">{c.theory}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Klassik misol:</p>
              <p className="text-purple-200">{c.example}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Rang xususiyati:</p>
              <p className="text-purple-200">{c.color}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-3">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">UB-Vis-NIR spektroskopiya:</p>
              <p className="text-purple-200">{c.spectroscopy}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">EPR spektroskopiya:</p>
              <p className="text-purple-200">{c.epr}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold mb-1">Rentgen difraksiyasi:</p>
              <p className="text-purple-200">{c.xray}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HUSH-ROBINSON NAZARIYASI INTERAKTIV
// ============================================================================
function HushRobinson() {
  const [param, setParam] = useState("hab")
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">📐 Hush-Robinson nazariyasi — IVCT energiyasi va shakli</h3>
      
      <div className="flex gap-2 mb-3">
        {[
          { key: "hab", label: "H_ab ta'siri" },
          { key: "lambda", label: "λ ta'siri" },
          { key: "formula", label: "Formulalar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setParam(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold ${
              param === t.key ? "bg-purple-600/80 text-white" : "bg-purple-800/40 text-purple-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {param === "hab" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-purple-400 font-bold">H_ab — elektron bog'lanish energiyasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-red-400 font-bold">H_ab ≈ 0</p>
                <p className="text-purple-300 mt-1">I sinf</p>
                <p className="text-purple-400 mt-1">Ikki mustaqil kompleks. Valentlik 'muzlatilgan'. IVCT yo'q.</p>
              </div>
              <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-yellow-400 font-bold">H_ab ≈ λ/2</p>
                <p className="text-purple-300 mt-1">II sinf</p>
                <p className="text-purple-400 mt-1">Qisman delokalizatsiya. IVCT keng polosa. Termal aktivatsiya.</p>
              </div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-green-400 font-bold">H_ab {'>'} λ/2</p>
                <p className="text-purple-300 mt-1">III sinf</p>
                <p className="text-purple-400 mt-1">To'liq delokalizatsiya. IVCT tor va intensiv. Ikki metall ekvivalent.</p>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 mt-2 text-xs">
              <p className="text-yellow-400 font-bold mb-1">H_ab ga ta'sir etuvchi omillar:</p>
              <ul className="text-purple-200 space-y-1">
                <li>• <strong>Ko'prik ligand tabiati:</strong> konjugatsiya darajasi, uzunligi, donor/akseptorligi</li>
                <li>• <strong>Metall-ligand masofasi:</strong> qisqa masofa → kuchliroq bog'lanish</li>
                <li>• <strong>Metall tabiati:</strong> 4d, 5d metallar → orbitallar kengroq → H_ab katta</li>
                <li>• <strong>Simmetriya:</strong> simmetrik komplekslarda H_ab kattaroq</li>
              </ul>
            </div>
          </div>
        )}

        {param === "lambda" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-purple-400 font-bold">λ — qayta tashkilanish energiyasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">Ichki sfera (λ_in):</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• Metall-ligand bog' uzunliklarining o'zgarishi</li>
                  <li>• M−L masofasi oksidlanish darajasiga qarab o'zgaradi</li>
                  <li>• Ru²⁺/Ru³⁺ misolida: Δr ≈ 0.04 Å (Ru−N)</li>
                  <li>• Qancha kichik bo'lsa, λ_in shuncha kichik</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">Tashqi sfera (λ_out):</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• Erituvchi molekulalarining qayta tashkilanishi</li>
                  <li>• Qutbli erituvchida kattaroq</li>
                  <li>• Qutbsiz erituvchida kichikroq</li>
                  <li>• Katta ligandlar → λ_out kichik (erituvchi ta'siri kam)</li>
                </ul>
              </div>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-3 mt-2 text-xs">
              <p className="text-yellow-400 font-bold">λ ning ahamiyati:</p>
              <p className="text-purple-200">
                λ qancha kichik bo'lsa, III sinfga o'tish ehtimoli shuncha yuqori.
                Katta makrotsiklik ligandlar (porfirin, ftalosianin) λ ni kamaytiradi —
                ular metall-ligand masofasini 'qattiq' ushlab turadi.
              </p>
            </div>
          </div>
        )}

        {param === "formula" && (
          <div className="space-y-3 text-sm">
            <h4 className="text-purple-400 font-bold">Hush-Robinson formulalari</h4>
            <div className="space-y-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">IVCT energiyasi:</p>
                <p className="font-mono text-purple-200">E_opt = λ + ΔG°</p>
                <p className="text-purple-400 mt-1">λ — qayta tashkilanish energiyasi, ΔG° — reaksiya erkin energiyasi</p>
                <p className="text-purple-400">Simmetrik komplekslarda (ΔG°=0): E_opt = λ</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">Termal aktivatsiya energiyasi:</p>
                <p className="font-mono text-purple-200">E_th = (λ − 2H_ab)² / 4λ</p>
                <p className="text-purple-400 mt-1">III sinfda 2H_ab {'>'} λ → E_th = 0 — bar'ersiz o'tish!</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">IVCT yarim kengligi (II sinf):</p>
                <p className="font-mono text-purple-200">Δν₁/₂ = (16RT·ln2·λ)^(1/2) ≈ √(2310·λ)</p>
                <p className="text-purple-400 mt-1">λ sm⁻¹ da. Nazariy qiymatdan kengroq bo'lsa — II sinf tasdiqlanadi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">III sinf — IVCT energiyasi:</p>
                <p className="font-mono text-purple-200">E_opt = 2H_ab</p>
                <p className="text-purple-400 mt-1">λ hissasi yo'qoladi — elektron to'liq delokalizatsiyalangan!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PRUSSIYA KO'KI VA CREUTZ-TAUBE TAQQOSLASH
// ============================================================================
function IVCTMisollar() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🔬 Klassik IVCT misollari taqqoslanishi</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-3 text-yellow-400">Xususiyat</th>
                <th className="text-left py-3 px-3 text-blue-400">Prussiya ko'ki</th>
                <th className="text-left py-3 px-3 text-purple-400">Creutz-Taube ioni</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Formula", "Fe₄[Fe(CN)₆]₃·xH₂O", "[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺"],
                ["Metallar", "Fe²⁺ (HS, d⁶) → Fe³⁺ (LS, d⁵)", "Ru²⁺ (d⁶) → Ru³⁺ (d⁵)"],
                ["Ko'prik ligand", "CN⁻ — kichik, chiziqli", "pirazin (pyz) — π-konjugatsiyalangan"],
                ["IVCT λ_max", "~680 nm (ko'rinadigan)", "~1570 nm (NIR, ko'rinmas)"],
                ["IVCT ε", "~10 000 M⁻¹sm⁻¹", "~5 000 M⁻¹sm⁻¹"],
                ["Yarim kenglik", "~5 000 sm⁻¹ (keng)", "~1 000 sm⁻¹ (tor)"],
                ["Robin-Day sinfi", "II sinf", "III sinf"],
                ["H_ab", "~1 000 sm⁻¹", "~4 000 sm⁻¹"],
                ["λ", "~8 000 sm⁻¹", "~2 000 sm⁻¹"],
                ["Elektron delokalizatsiyasi", "Qisman — termal ko'chish", "To'liq — bar'ersiz ko'chish"],
                ["Rentgen", "Ikki xil Fe−CN masofasi", "Bir xil Ru−N(pyz) masofasi"],
                ["Rang", "Ko'k (IVCT + d−d)", "To'q qizil (d−d), IVCT NIR da"],
                ["Qo'llanilishi", "Pigment, elektroxromizm, sensorlar", "Molekulyar simlar, elektron tashish"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                  <td className="py-2 px-3">{row[1]}</td>
                  <td className="py-2 px-3">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function IVCT() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi" className="text-purple-400 hover:text-purple-300">Zaryad ko'chishi</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">IVCT & MMCT</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🟣 IVCT & MMCT — Metall-Metall zaryad ko'chishi</h1>
          <p className="text-purple-400 text-sm">Aralash valentli komplekslar • Robin-Day klassifikatsiyasi • Prussiya ko'ki • Creutz-Taube</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 IVCT — aralash valentli komplekslarning xarakterli belgisi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">IVCT (InterValence Charge Transfer)</strong> — 
              aralash valentli komplekslarda bir metall markazidan ikkinchisiga 
              <strong> ko'prik ligand orqali</strong> elektron ko'chishi. Bu — 
              <strong className="text-yellow-400">MMCT (Metal-to-Metal Charge Transfer)</strong> ning 
              maxsus turi. IVCT <strong>Robin-Day klassifikatsiyasi</strong> (1967) bo'yicha 
              I, II, III sinflarga bo'linadi — elektron delokalizatsiyasi darajasiga qarab.
              <strong> Hush-Robinson nazariyasi</strong> IVCT energiyasi, shakli va intensivligini 
              <strong> H_ab (elektron bog'lanish energiyasi)</strong> va 
              <strong> λ (qayta tashkilanish energiyasi)</strong> orqali tushuntiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">IVCT shartlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Kamida ikkita metall markazi</strong> — ko'prik ligand orqali bog'langan</li>
                <li>• <strong>Turli oksidlanish darajalari</strong> — Mⁿ⁺ va M⁽ⁿ⁺¹⁾⁺ (aralash valentli)</li>
                <li>• <strong>Ko'prik ligand</strong> — elektron o'tish uchun yo'l (π-konjugatsiya yaxshi)</li>
                <li>• <strong>Termal yoki optik</strong> elektron ko'chishi — H_ab va λ nisbatiga bog'liq</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Robin-Day klassifikatsiyasi</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-red-600/10 border border-red-500/30 rounded p-2">
                  <p className="text-red-400 font-bold">I sinf:</p>
                  <p className="text-purple-300">To'liq lokalizatsiyalangan — 2H_ab {'<<'} λ. IVCT yo'q.</p>
                </div>
                <div className="bg-yellow-600/10 border border-yellow-500/30 rounded p-2">
                  <p className="text-yellow-400 font-bold">II sinf:</p>
                  <p className="text-purple-300">Qisman delokalizatsiyalangan — 2H_ab ≈ λ. IVCT keng polosa.</p>
                </div>
                <div className="bg-green-600/10 border border-green-500/30 rounded p-2">
                  <p className="text-green-400 font-bold">III sinf:</p>
                  <p className="text-purple-300">To'liq delokalizatsiyalangan — 2H_ab {'>'} λ. IVCT tor pik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IVCTSlayder />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <HushRobinson />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <IVCTMisollar />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>IVCT — <strong className="text-purple-400">aralash valentli komplekslarda Mⁿ⁺ → M⁽ⁿ⁺¹⁾⁺</strong> elektron ko'chishi, ko'prik ligand orqali</li>
            <li><strong className="text-purple-400">Robin-Day:</strong> I sinf (lokalizatsiyalangan), II sinf (qisman), III sinf (to'liq delokalizatsiyalangan)</li>
            <li><strong className="text-purple-400">Hush-Robinson:</strong> 2H_ab {'<<'} λ → I sinf; 2H_ab ≈ λ → II sinf; 2H_ab {'>'} λ → III sinf</li>
            <li><strong className="text-purple-400">Prussiya ko'ki:</strong> II sinf, λ_max ~680 nm, ko'k rang; <strong className="text-purple-400">Creutz-Taube:</strong> III sinf, λ_max ~1570 nm (NIR)</li>
            <li>IVCT — <strong className="text-purple-400">molekulyar simlar, elektron tashish, elektroxrom qurilmalar</strong> uchun asos</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MLCT</Link>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/solvatoxromizm" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Solvatoxromizm →</Link>
        </div>

      </section>
    </main>
  )
}