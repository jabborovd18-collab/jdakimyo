"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// ROBIN-DAY INTERAKTIV SLAYDERI
// ============================================================================
function RobinDaySlayder() {
  const [classType, setClassType] = useState(2)
  
  const classes = {
    1: {
      title: "I sinf — To'liq lokalizatsiyalangan",
      desc: "Elektron faqat bitta metall markazida lokalizatsiyalangan. IVCT (intervalent zaryad ko'chishi) yo'q yoki juda kuchsiz. Metall markazlari orasidagi o'zaro ta'sir juda kuchsiz — ular mustaqil komplekslar kabi harakat qiladi.",
      ivct: "IVCT kuzatilmaydi yoki juda kuchsiz (ε < 100 M⁻¹sm⁻¹)",
      example: "[Pt(NH₃)₄]²⁺/[PtCl₄]²⁻ aralashmasi — har biri o'z rangida",
      eCoupling: "H_ab ≈ 0 (juda kichik)",
      deltaE: "ΔE° katta — termal aktivatsiya kerak",
      color: "Har bir ion o'z rangida — aralash rang"
    },
    2: {
      title: "II sinf — Qisman delokalizatsiyalangan",
      desc: "Elektron asosan bir markazda, lekin ikkinchi markazga o'tish ehtimoli mavjud. IVCT yutilishi kuzatiladi — bu aralash valentli komplekslarning xarakterli belgisi. Termal aktivatsiya orqali elektron ko'chishi sodir bo'ladi.",
      ivct: "IVCT kuzatiladi (ε ≈ 10²−10⁴ M⁻¹sm⁻¹) — xarakterli rang!",
      example: "Prussiya ko'ki (Fe₄[Fe(CN)₆]₃) — Fe²⁺ → Fe³⁺ IVCT (~680 nm)",
      eCoupling: "H_ab ≈ 500−2000 sm⁻¹ (o'rtacha)",
      deltaE: "ΔE° o'rtacha — termal + optik ko'chish",
      color: "IVCT tufayli intensiv rang — ko'k (Prussiya ko'ki)"
    },
    3: {
      title: "III sinf — To'liq delokalizatsiyalangan",
      desc: `Elektron ikkala metall markazi o'rtasida to'liq delokalizatsiyalangan — ular orasidagi farq yo'qoladi. Ikkala metall bir xil "o'rtacha" oksidlanish darajasiga ega. IVCT juda intensiv va tor pik — intervalent zaryad ko'chishi.`,
      ivct: "IVCT juda intensiv (ε > 10⁴ M⁻¹sm⁻¹) — tor pik",
      example: "Creutz-Taube ioni: [(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ (Ru²·⁵⁺)",
      eCoupling: "H_ab katta (> 2000 sm⁻¹) — kuchli bog'lanish",
      deltaE: "ΔE° ≈ 0 — elektron erkin harakatlanadi",
      color: "IVCT — NIR sohada (~1570 nm, ko'rinmaydi)"
    },
  }

  const c = classes[classType]

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">🎚️ Robin-Day klassifikatsiyasi — interaktiv slayder</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-purple-400">I sinf</span>
          <input 
            type="range" 
            min="1" max="3" 
            value={classType} 
            onChange={(e) => setClassType(+e.target.value)}
            className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-xs text-purple-400">III sinf</span>
        </div>
        
        <div className={`rounded-xl p-5 border ${
          classType === 1 ? "bg-red-600/10 border-red-500/30" : 
          classType === 2 ? "bg-yellow-600/10 border-yellow-500/30" : 
          "bg-green-600/10 border-green-500/30"
        }`}>
          <h4 className={`font-bold text-lg mb-3 ${
            classType === 1 ? "text-red-400" : classType === 2 ? "text-yellow-400" : "text-green-400"
          }`}>{c.title}</h4>
          <p className="text-purple-200 text-sm mb-3">{c.desc}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400 font-bold mb-1">IVCT (intervalent zaryad ko'chishi):</p>
              <p className="text-purple-200">{c.ivct}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400 font-bold mb-1">Elektron bog'lanish energiyasi:</p>
              <p className="text-purple-200">{c.eCoupling}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400 font-bold mb-1">Klassik misol:</p>
              <p className="text-purple-200">{c.example}</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-purple-400 font-bold mb-1">Rang xususiyati:</p>
              <p className="text-purple-200">{c.color}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function AralashValentli() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="text-purple-400 hover:text-purple-300 text-lg">← Ko'p yadroli</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔄 Aralash valentli komplekslar</h1>
          <p className="text-purple-400 text-sm">Prussiya ko'ki • Creutz-Taube ioni • Robin-Day • IVCT</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Aralash valentli komplekslar haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Aralash valentli (mixed-valence) komplekslar</strong> — 
              bir xil metallning <strong>turli oksidlanish darajalaridagi</strong> ionlarini o'z ichiga olgan 
              ko'p yadroli tizimlar. Ular <strong>IVCT (InterValence Charge Transfer)</strong> — 
              elektronning bir metall markazidan ikkinchisiga optik ko'chishi — tufayli 
              <strong>intensiv rangga</strong> ega. <strong>Robin va Day (1967)</strong> aralash valentli 
              komplekslarni <strong>uch sinfga</strong> ajratgan: I (lokalizatsiyalangan), 
              II (qisman delokalizatsiyalangan), III (to'liq delokalizatsiyalangan).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">IVCT — intervalent zaryad ko'chishi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Mⁿ⁺−L−M⁽ⁿ⁺¹⁾⁺ + hν → M⁽ⁿ⁺¹⁾⁺−L−Mⁿ⁺</strong></li>
                <li>• Ko'prik ligand (L) orqali elektron ko'chadi</li>
                <li>• IVCT energiyasi = Marcus qayta tashkilanish energiyasi + ΔG°</li>
                <li>• Odatda ko'rinadigan yoki NIR sohada kuzatiladi</li>
                <li>• <strong>Intensivlik:</strong> ε ≈ 10²−10⁵ M⁻¹sm⁻¹</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Hush-Robinson nazariyasi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>H_ab — elektron bog'lanish energiyasi:</strong> Metall markazlari orasidagi o'zaro ta'sir kuchi</li>
                <li>• <strong>λ — qayta tashkilanish energiyasi:</strong> Elektron ko'chganda struktura o'zgarishi</li>
                <li>• <strong>2H_ab {'<'} λ:</strong> I sinf (lokalizatsiyalangan)</li>
                <li>• <strong>2H_ab ≈ λ:</strong> II sinf (qisman delokalizatsiyalangan)</li>
                <li>• <strong>2H_ab {'>'} λ:</strong> III sinf (to'liq delokalizatsiyalangan)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. PRUSSIYA KO'KI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔵 Prussiya ko'ki — Fe²⁺ → Fe³⁺ IVCT</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">Prussiya ko'ki (Fe₄[Fe(CN)₆]₃)</strong> — 
            eng mashhur aralash valentli kompleks (1704-yilda kashf etilgan). Uning tarkibida 
            <strong>Fe²⁺ (yuqori spin, S=2)</strong> va <strong>Fe³⁺ (past spin, S=1/2)</strong> 
            ionlari CN⁻ ko'prik ligandlari orqali bog'langan. <strong>Fe²⁺ → Fe³⁺ IVCT</strong> 
            ~680 nm da intensiv yutilish beradi — bu <strong>ko'k rangning</strong> sababi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Struktura va elektron tuzilish</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Fe²⁺ (HS, d⁶):</strong> Uglerod atomlari orqali bog'langan — kuchsiz maydon</li>
                <li>• <strong>Fe³⁺ (LS, d⁵):</strong> Azot atomlari orqali bog'langan — kuchli maydon</li>
                <li>• <strong>CN⁻ ko'prik:</strong> Fe²⁺−C≡N−Fe³⁺ — chiziqli ko'prik</li>
                <li>• <strong>Robin-Day:</strong> II sinf — IVCT mavjud, lekin elektronlar qisman lokalizatsiyalangan</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-2">Ajoyib xossalar</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Elektroxromizm:</strong> Prussiya ko'ki qaytarilganda rangsiz (Prussiya oqi — Fe²⁺/Fe²⁺), oksidlanganda yashil (Berlin yashili — Fe³⁺/Fe³⁺)</li>
                <li>• <strong>Magnit xossalar:</strong> Fe²⁺ (HS, S=2) + Fe³⁺ (LS, S=1/2) — ferromagnit almashinuv (T_C ≈ 5.6 K)</li>
                <li>• <strong>Elektrokataliz:</strong> H₂O₂ reduksiyasi, glyukoza sensori</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. CREUTZ-TAUBE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟣 Creutz-Taube ioni — III sinf etaloni</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">[(NH₃)₅Ru(pyz)Ru(NH₃)₅]⁵⁺ (Creutz-Taube ioni, 1969)</strong> — 
            aralash valentli kimyoning eng mashhur molekulasi. Ikkita Ru atomi <strong>pirazin (pyz)</strong> 
            ko'prik ligand orqali bog'langan. <strong>Ru²⁺ (d⁶) va Ru³⁺ (d⁵)</strong> — lekin 
            ikkala Ru ham <strong>bir xil ko'rinadi</strong> (simmetrik). IVCT ~1570 nm (NIR) da 
            juda intensiv va tor pik — <strong>Robin-Day III sinf</strong>.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-3">Nima uchun III sinf?</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Simmetrik tuzilish:</strong> Rentgen difraksiyasi — ikkala Ru−N(pyz) masofasi bir xil (~2.00 Å). Ru²⁺ va Ru³⁺ ni farqlab bo'lmaydi!</p>
              <p><strong className="text-yellow-400">2. IVCT xususiyatlari:</strong> λ_max = 1570 nm (NIR), ε ≈ 5000 M⁻¹sm⁻¹, yarim kenglik (Δν₁/₂) ≈ 1000 sm⁻¹ — III sinf uchun xarakterli.</p>
              <p><strong className="text-yellow-400">3. Kimyoviy dalil:</strong> Ru−N(pyz) valent tebranishi — bitta pik (II sinfda ikkita pik bo'ladi).</p>
              <p className="text-purple-300 mt-2"><strong>H_ab ≈ 4000 sm⁻¹</strong> — kuchli elektron bog'lanish. λ ≈ 2000 sm⁻¹. 2H_ab {'>'} λ — III sinf mezoni.</p>
            </div>
          </div>
        </div>

        {/* 4. INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RobinDaySlayder />
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Robin-Day klassifikatsiyasi — <strong className="text-yellow-400">I, II, III sinf</strong> — elektron delokalizatsiya darajasiga qarab</li>
            <li>Prussiya ko'ki (II sinf) — <strong className="text-yellow-400">Fe²⁺ → Fe³⁺ IVCT (~680 nm)</strong></li>
            <li>Creutz-Taube ioni (III sinf) — <strong className="text-yellow-400">to'liq delokalizatsiya, ikkala Ru bir xil</strong></li>
            <li>IVCT — <strong className="text-yellow-400">aralash valentli komplekslarning xarakterli belgisi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/magnit-klasterlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Magnit klasterlar</Link>
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/bioilhomlantirilgan" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Bioilhomlantirilgan →</Link>
        </div>

      </section>
    </main>
  )
}