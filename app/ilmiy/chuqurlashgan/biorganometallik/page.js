"use client"

import Link from "next/link"

export default function Biorganometallik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧬 Biorganometallik kimyo</h1>
          <p className="text-purple-400 text-sm">Tabiiy metalloenzimlar • Sun'iy fermentlar • Terapevtik komplekslar • Sensorlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Biorganometallik kimyo — fanlar kesishmasi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Biorganometallik kimyo</strong> — 
              organometallik kimyo va biologiya kesishmasida joylashgan fan sohasi. 
              U <strong>metall-uglerod (M−C) bog'i</strong> saqlovchi biomolekulalarni, 
              ularning tuzilishi, funksiyasi va sun'iy analoglarini o'rganadi.
              Bu soha <strong>3 ta Nobel mukofotiga</strong> sabab bo'lgan:
              <span className="text-purple-300"> B₁₂ vitamini (Hodgkin, 1964)</span>,
              <span className="text-purple-300"> nitrogenaza va gidrogenaza mexanizmlari</span>,
              <span className="text-purple-300"> va ferment katalizidagi metallarning roli</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔬 Nega muhim?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>B₁₂ — yagona tabiiy organometallik koenzim</strong></li>
                <li>• Nitrogenaza — atmosfera N₂ ni NH₃ ga aylantiradi (Haber-Bosch ga alternativ)</li>
                <li>• Gidrogenaza — H₂ ↔ 2H⁺ + 2e⁻ reversibil katalizi</li>
                <li>• Sun'iy metalofermentlar — yangi katalitik funksiyalar</li>
                <li>• Metall asosidagi dorilar — saraton, infeksiyalarga qarshi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">⚛️ Organometallik bog' turlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>M−C σ-bog':</strong> B₁₂ da Co−C, metall-alkillar</li>
                <li>• <strong>M−CO (karbonil):</strong> [FeFe]-gidrogenazada Fe−CO</li>
                <li>• <strong>M−aren (π-kompleks):</strong> Ru-aren terapevtik komplekslar</li>
                <li>• <strong>M−Cp (ferrosen):</strong> Ferrosen asosidagi dorilar</li>
                <li>• <strong>M−karben:</strong> Au-NHC, Pd-NHC katalizatorlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BO'LIMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Asosiy yo'nalishlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/ilmiy/chuqurlashgan/biorganometallik/tabiiy-birikmalar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🌿</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Tabiiy birikmalar</h3>
              <p className="text-purple-300 text-xs mt-2">B₁₂ vitamini • Nitrogenaza • Gidrogenaza</p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/biorganometallik/suniy-metalofermentlar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Sun'iy metalofermentlar</h3>
              <p className="text-purple-300 text-xs mt-2">Arsin tashuvchilar • Sun'iy restriktazalar</p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/biorganometallik/terapevtik" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Terapevtik komplekslar</h3>
              <p className="text-purple-300 text-xs mt-2">Ferrosen • Ru-aren • Oltin • CORMs</p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/biorganometallik/sensorlar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">📡</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Sensorlar</h3>
              <p className="text-purple-300 text-xs mt-2">Glyukoza • Ion-selektiv elektrodlar</p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/biorganometallik/bioikonjugatsiya" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🔗</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Biokonjugatsiya</h3>
              <p className="text-purple-300 text-xs mt-2">Metall-antikor konjugatlari</p>
            </Link>
          </div>
        </div>

        {/* ASOSIY OCHILISHLAR - TIMELINE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Tarixiy ochilishlar</h2>
          
          <div className="space-y-3">
            {[
              { year: "1926", text: "Minot va Murphy — B₁₂ vitamini jigar ekstraktida anemiya ga qarshi faollik" },
              { year: "1956", text: "Dorothy Hodgkin — B₁₂ kristall strukturasi (rentgen, 3D)" },
              { year: "1961", text: "Lenhert va Hodgkin — Co−C bog'i mavjudligi, B₁₂ — birinchi organometallik biomolekula" },
              { year: "1964", text: "Hodgkin — Nobel mukofoti (B₁₂ strukturasi uchun)" },
              { year: "1970-yillar", text: "Ferrosenning biologik faolligi kashf etildi" },
              { year: "1990-yillar", text: "Nitrogenaza FeMo-kofaktor strukturasi (Kim & Rees, 1992)" },
              { year: "2000-yillar", text: "Sun'iy metalofermentlar rivoji — Arduengo, Ward, Hartwig" },
              { year: "2010-yillar", text: "Ru-aren komplekslari saratonga qarshi klinik sinovlarda" },
              { year: "hozir", text: "Biorganometallik kimyo — mustaqil fan sohasi sifatida" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-yellow-400 font-mono text-sm w-16 shrink-0">{item.year}</span>
                <span className="text-purple-200 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TEXNIK XUSUSIYATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ M−C bog'ining biokimyoviy xususiyatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Barqarorlik muammosi</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Ko'pchilik M−C bog'lari <strong>suv va O₂ ga sezgir</strong></li>
                <li>• <strong>B₁₂ da Co−C bog'i</strong> — istisno: suvda barqaror</li>
                <li>• Buning sababi: <strong>korrin halqasi</strong> Co ni himoya qiladi</li>
                <li>• <strong>Gidrogenazalarda Fe−CO</strong>: oqsil ichida himoyalangan</li>
                <li>• Sun'iy analoglarda <strong>katta ligandlar</strong> stabillashtiradi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Reaksiya mexanizmlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gomolitik ajralish:</strong> Co³⁺−C → Co²⁺ + •C (radikal)</li>
                <li>• <strong>Geterolitik ajralish:</strong> Co³⁺−C → Co⁺ + ⁺C (karbokation)</li>
                <li>• <strong>Oksidlovchi qo'shilish:</strong> Mⁿ⁺ + R−X → M⁽ⁿ⁺²⁾⁺(R)(X)</li>
                <li>• <strong>Qaytaruvchi eliminatsiya:</strong> M(R)(X) → Mⁿ⁺ + R−X</li>
                <li>• <strong>Transmetallanish:</strong> M−R + M'−X → M−X + M'−R</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/bioilhomlantirilgan" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Bioilhomlantirilgan
          </Link>
          <Link href="/ilmiy/chuqurlashgan/biorganometallik/tabiiy-birikmalar" 
            className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            Tabiiy birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}