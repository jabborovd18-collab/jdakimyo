import Link from "next/link"

export default function OksidlanishQaytarilish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">⚡ Oksidlanish-qaytarilish reaksiyalari</h1>
          <p className="text-purple-400 text-sm">Ichki/tashqi sfera • Marcus nazariyasi • Qayta tashkilanish energiyasi • Taube</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oksidlanish-qaytarilish (redoks) reaksiyalari haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-400">Oksidlanish-qaytarilish reaksiyalari</strong> — kompleks birikmalar 
              o'rtasida <strong className="text-red-400">elektron ko'chishi</strong> bilan boradigan fundamental jarayonlar.
              <strong className="text-red-400">Henry Taube (Nobel 1983)</strong> bu reaksiyalarni 
              <strong className="text-red-400">ichki sfera</strong> (ko'prik ligand orqali) va 
              <strong className="text-red-400">tashqi sfera</strong> (bevosita kontakt orqali) mexanizmlarga ajratgan.
              <strong className="text-red-400">Rudolf Marcus (Nobel 1992)</strong> elektron ko'chish kinetikasining 
              nazariy asosini yaratgan — <strong>Marcus nazariyasi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Tashqi sfera mexanizmi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Ikkala kompleksning koordinatsion qobiqlari</strong> saqlanadi</li>
                <li>• Elektron <strong>bevosita tunnel orqali</strong> ko'chadi</li>
                <li>• Reaksiya tezligi <strong>qayta tashkilanish energiyasiga</strong> bog'liq</li>
                <li>• <strong>Misollar:</strong> [Fe(CN)₆]⁴⁻/³⁻, [Ru(bpy)₃]²⁺/³⁺, [IrCl₆]³⁻/²⁻</li>
                <li>• Kichik strukturaviy o'zgarish — tez reaksiya</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Ichki sfera mexanizmi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Ko'prik ligand</strong> orqali elektron ko'chadi</li>
                <li>• Avval <strong>ko'prik ligand almashinuvi</strong>, so'ng elektron ko'chishi</li>
                <li>• Ko'prik ligand <strong>ikkala metall bilan vaqtincha bog'lanadi</strong></li>
                <li>• <strong>Klassik misol:</strong> [Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺ → [Co(NH₃)₅]²⁺ + [Cr(H₂O)₅Cl]²⁺</li>
                <li>• Cl⁻ ko'prik ligand — Cr ga o'tadi (Cr−Cl bog'i Co−Cl dan mustahkamroq)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. MARCUS NAZARIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Marcus nazariyasi — elektron ko'chish kinetikasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-red-400">Marcus nazariyasi (1956−1965)</strong> tashqi sfera elektron 
            ko'chishining <strong>asosiy tenglamasini</strong> beradi. Reaksiya tezligi konstantasi:
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 mb-3">
              <p className="text-yellow-400 font-mono text-sm text-center">
                k_et = ν_n · κ_el · exp(−ΔG‡/RT)
              </p>
              <p className="text-yellow-400 font-mono text-sm text-center mt-2">
                ΔG‡ = (λ + ΔG°)² / 4λ
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold">λ — qayta tashkilanish energiyasi</p>
                <p className="text-purple-300 mt-1">Ichki (λ_in — bog' uzunligi o'zgarishi) + tashqi (λ_out — erituvchi qutblanishi)</p>
                <p className="text-yellow-400 mt-1">λ = λ_in + λ_out</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold">ΔG° — reaksiya erkin energiyasi</p>
                <p className="text-purple-300 mt-1">Manfiy bo'lsa — ekzergonik reaksiya. Marcus inverted region: juda katta −ΔG° da tezlik PASayadi!</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-red-400 font-bold">ν_n · κ_el — yadro chastotasi va elektron uzatish koeffitsienti</p>
                <p className="text-purple-300 mt-1">ν_n ≈ 10¹¹−10¹³ s⁻¹, κ_el ≈ 1 (adiabatik) yoki {'<<'} 1 (noadiabatik)</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">Marcus inverted region — Nobel mukofotiga loyiq kashfiyot</h3>
            <p className="text-purple-200 text-sm">
              Marcus nazariyasining eng muhim bashorati: <strong>−ΔG° {'>'} λ bo'lganda</strong> reaksiya tezligi 
              <strong>termodinamik harakatlantiruvchi kuch oshgan sari KAMAYADI</strong>. Bu "inverted region" 
              deb ataladi va 1980-yillarda eksperimental tasdiqlangan. Kimyoviy sezgi uchun paradoksal — 
              energiya ko'proq ajralganda reaksiya sekinlashadi!
            </p>
          </div>
        </div>

        {/* 3. TAUBE TAJRIBASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Taube tajribasi — ichki sfera isboti</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Henry Taube (1950-yillar)</strong> ichki sfera elektron ko'chishini 
            isbotlagan klassik tajriba:
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="space-y-3 text-sm text-purple-200">
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                <p className="font-mono text-yellow-400">[Co(NH₃)₅Cl]²⁺ + [Cr(H₂O)₆]²⁺ + 5H⁺ →</p>
                <p className="font-mono text-yellow-400 mt-1">[Co(H₂O)₆]²⁺ + [Cr(H₂O)₅Cl]²⁺ + 5NH₄⁺</p>
              </div>
              
              <p><strong className="text-red-400">Isbot:</strong> Reaksiya mahsulotida <strong>Cl⁻ Cr bilan bog'langan</strong> 
              holda topilgan. Agar elektron tashqi sfera orqali ko'chganda, Cl⁻ Co da qolar edi. 
              Cl⁻ ning Cr ga o'tishi <strong>ko'prik ligand mexanizmini</strong> tasdiqlaydi.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                  <p className="text-green-400 font-bold text-xs">Nima uchun Cl⁻ Cr ga o'tadi?</p>
                  <p className="text-purple-200 text-xs mt-1">Cr²⁺ (d⁴) — labil (tez almashinadi). Co³⁺ (d⁶ LS) — inert (sekin almashinadi). Cr−Cl bog'i Co−Cl dan mustahkamroq.</p>
                </div>
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-blue-400 font-bold text-xs">Radiolabel tekshirish</p>
                  <p className="text-purple-200 text-xs mt-1">Radioaktiv ³⁶Cl⁻ bilan nishonlangan [Co(NH₃)₅³⁶Cl]²⁺ ishlatilgan. Reaksiyadan so'ng ³⁶Cl⁻ Cr kompleksida topilgan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. QAYTA TASHKILANISH ENERGIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Qayta tashkilanish energiyasi — λ ni hisoblash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-red-400">Qayta tashkilanish energiyasi (λ)</strong> elektron ko'chish 
            reaksiyalarining <strong>asosiy kinetik parametri</strong>. U ikki qismdan iborat:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Redoks jufti</th>
                <th className="py-3 px-4 text-purple-300">λ_in (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">λ_out (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">λ_umumiy</th>
                <th className="py-3 px-4 text-purple-300">k_et (M⁻¹s⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Δr (Å) bog' uzunligi farqi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Fe(CN)₆]⁴⁻/³⁻", "~5", "~60", "~65", "~10⁵", "Δ(Fe−C) ≈ 0.02 Å — juda kichik!"],
                  ["[Ru(bpy)₃]²⁺/³⁺", "~8", "~50", "~58", "~10⁸", "Δ(Ru−N) ≈ 0.01 Å"],
                  ["[Co(NH₃)₆]²⁺/³⁺", "~80", "~50", "~130", "~10⁻⁴", "Δ(Co−N) ≈ 0.18 Å — katta!"],
                  ["[Cr(H₂O)₆]²⁺/³⁺", "~70", "~55", "~125", "~10⁻⁵", "Δ(Cr−O) ≈ 0.20 Å — Yahn-Teller"],
                  ["[Fe(H₂O)₆]²⁺/³⁺", "~50", "~55", "~105", "~4", "Δ(Fe−O) ≈ 0.14 Å"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-red-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * Kichik strukturaviy o'zgarish (Δr {'<'} 0.05 Å) → kichik λ_in → tez elektron ko'chishi (k_et {'>'} 10⁵).
            Katta strukturaviy o'zgarish (Δr {'>'} 0.15 Å) → katta λ_in → sekin elektron ko'chishi (k_et {'<'} 1).
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Tashqi sfera — <strong className="text-red-400">koordinatsion qobiqlar saqlanadi</strong>, tezlik λ ga bog'liq</li>
            <li>Ichki sfera — <strong className="text-red-400">ko'prik ligand orqali</strong>, ligand almashinuvi bilan birga</li>
            <li>Marcus nazariyasi — <strong className="text-red-400">ΔG‡ = (λ + ΔG°)²/4λ</strong>, inverted region</li>
            <li>Kichik strukturaviy o'zgarish — <strong className="text-red-400">tez elektron ko'chishi</strong> (k_et 10⁵−10⁸)</li>
            <li>Taube tajribasi — <strong className="text-red-400">ichki sfera mexanizmini radiolabel bilan isbotlagan</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/ligand-almashinish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ligand almashinish</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/katalitik-sikllar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Katalitik sikllar →</Link>
        </div>

      </section>
    </main>
  )
}