"use client"

import Link from "next/link"

export default function Bioanorganik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300 text-lg">← Chuqurlashgan</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧬 Bioanorganik kimyo</h1>
          <p className="text-purple-400 text-sm">Metalloproteinlar • Metallofermentlar • Metall-dorilar • Ion tashish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Bioanorganik kimyo — fanlar kesishmasi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Bioanorganik kimyo</strong> — 
              anorganik kimyo va biologiya kesishmasidagi fan sohasi. U 
              <strong> tirik organizmlardagi metall ionlarining</strong> roli, 
              tuzilishi va funksiyasini o'rganadi. Inson tanasida 
              <strong> 25 dan ortiq muhim metall element</strong> mavjud bo'lib, 
              ular ferment katalizi, elektron tashish, O₂ tashish, signal uzatish 
              va strukturani qo'llab-quvvatlash kabi hayotiy funksiyalarni bajaradi.
              Bioanorganik kimyo <strong>5 ta Nobel mukofotiga</strong> sabab bo'lgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔬 Nima uchun muhim?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gemoglobin</strong> — O₂ tashish (Fe-porfirin)</li>
                <li>• <strong>Xlorofil</strong> — fotosintez (Mg-xlorin)</li>
                <li>• <strong>Karboangidraza</strong> — CO₂ gidratatsiyasi (Zn)</li>
                <li>• <strong>Sitoxromlar</strong> — elektron tashish zanjiri (Fe, Cu)</li>
                <li>• <strong>Nitrogenaza</strong> — N₂ fiksatsiyasi (Fe, Mo)</li>
                <li>• <strong>SOD</strong> — antioksidant himoya (Cu, Zn, Mn)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">⚛️ Asosiy bio-metallar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Fe</strong> — gemoglobin, mioglobin, katalaza, sitoxromlar, nitrogenaza</li>
                <li>• <strong>Zn</strong> — karboangidraza, SOD, insulin, rux barmoq oqsillari</li>
                <li>• <strong>Cu</strong> — SOD, sitoxrom c oksidaza, plastosianin</li>
                <li>• <strong>Mg</strong> — xlorofil, ATP komplekslari</li>
                <li>• <strong>Mn</strong> — fotosintez (OEC), Mn-SOD</li>
                <li>• <strong>Co</strong> — B₁₂ vitamini (yagona organometallik biomolekula)</li>
                <li>• <strong>Ni</strong> — gidrogenaza, ureaza</li>
                <li>• <strong>Mo, W</strong> — nitrogenaza, oksotransferazalar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BO'LIMLAR KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Asosiy yo'nalishlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🩸</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Metalloproteinlar</h3>
              <p className="text-purple-300 text-xs mt-2">
                Gemoglobin • Mioglobin • Sitoxromlar • Xlorofil — O₂ tashish, elektron tashish, fotosintez
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Metallofermentlar</h3>
              <p className="text-purple-300 text-xs mt-2">
                Karboangidraza • SOD • Katalaza • Nitrogenaza • Gidrogenaza • P450
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/b12-vitamini" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">B₁₂ vitamini</h3>
              <p className="text-purple-300 text-xs mt-2">
                Yagona tabiiy organometallik biomolekula • Co−C bog'i • Korrin halqasi
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Metall-dorilar</h3>
              <p className="text-purple-300 text-xs mt-2">
                Sisplatin • Ru-aren • Oltin • Antiaritmik • Antimikrob komplekslar
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Ion tashish</h3>
              <p className="text-purple-300 text-xs mt-2">
                Na⁺/K⁺-ATFaza • Ca²⁺ nasoslari • Kanal oqsillari • Transferrin
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/bioilhomlantirilgan" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Bioilhomlantirilgan kataliz</h3>
              <p className="text-purple-300 text-xs mt-2">
                Sun'iy fermentlar • Biomimetik komplekslar • Ko'p yadroli markazlar
              </p>
            </Link>

          </div>
        </div>

        {/* METALLARNING BIOLOGIK ROLI JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🦾 Muhim bio-metallar va ularning funksiyalari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-4 text-yellow-400">Metall</th>
                  <th className="text-left py-3 px-4 text-yellow-400">Miqdori (70 kg odamda)</th>
                  <th className="text-left py-3 px-4 text-yellow-400">Asosiy biomolekula</th>
                  <th className="text-left py-3 px-4 text-yellow-400">Funksiyasi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe", "~4 g", "Gemoglobin, mioglobin, sitoxromlar, katalaza, nitrogenaza", "O₂ tashish, elektron tashish, kataliz"],
                  ["Zn", "~2–3 g", "Karboangidraza, SOD, insulin, rux barmoq oqsillari", "Kataliz, struktura, gen regulyatsiyasi"],
                  ["Cu", "~80 mg", "Sitoxrom c oksidaza, SOD, plastosianin", "Elektron tashish, antioksidant"],
                  ["Mg", "~25 g", "Xlorofil, ATP·Mg²⁺", "Fotosintez, energiya almashinuvi"],
                  ["Ca", "~1 kg", "Gidroksiapatit, kalmodulin", "Skelet, signal uzatish"],
                  ["Mn", "~12 mg", "Mn-SOD, OEC (fotosintez)", "Antioksidant, suv oksidlanishi"],
                  ["Co", "~3 mg", "B₁₂ vitamini", "Metil guruh ko'chirish, izomerlanish"],
                  ["Ni", "~10 mg", "Gidrogenaza, ureaza", "H₂ metabolizmi, mochevina gidrolizi"],
                  ["Mo", "~5 mg", "Nitrogenaza, oksotransferazalar", "N₂ fiksatsiyasi, oksidlanish-qaytarilish"],
                  ["K", "~140 g", "Hujayra ichi suyuqligi", "Osmotik muvozanat, nerv impulsi"],
                  ["Na", "~100 g", "Hujayra tashqarisi suyuqligi", "Osmotik muvozanat, nerv impulsi"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4"><strong className="text-yellow-400">{row[0]}</strong></td>
                    <td className="py-3 px-4 text-purple-300">{row[1]}</td>
                    <td className="py-3 px-4">{row[2]}</td>
                    <td className="py-3 px-4">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TARIXIY TIMELINE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Bioanorganik kimyoning rivojlanishi</h2>
          
          <div className="space-y-3">
            {[
              { year: "1850", text: "Ko'rinadigan spektroskopiya — gemoproteinlar ranglari o'rganila boshlandi" },
              { year: "1930", text: "Pauling — gemoglobin magnit xossalarini o'rgandi" },
              { year: "1953", text: "Watson & Crick — DNK strukturasi (Mg²⁺, Zn²⁺ rollari)" },
              { year: "1956", text: "Dorothy Hodgkin — B₁₂ vitamini kristall strukturasi" },
              { year: "1960", text: "Vallee & Williams — Zn ning biologik roli bo'yicha fundamental ishlar" },
              { year: "1970", text: "Sisplatinning saratonga qarshi faolligi kashf etildi (Rosenberg)" },
              { year: "1980", text: "Bioanorganik kimyo mustaqil fan sifatida tan olindi" },
              { year: "1992", text: "Nitrogenaza FeMo-kofaktor strukturasi aniqlandi" },
              { year: "1999", text: "Ruteniy-aren komplekslari (Sadler) — yangi avlod metall-dorilar" },
              { year: "2010+", text: "Sun'iy metalofermentlar, bioilhomlantirilgan katalizatorlar rivoji" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-yellow-400 font-mono text-sm w-20 shrink-0">{item.year}</span>
                <span className="text-purple-200 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ASOSIY NAZARIY TUSHUNCHALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Bioanorganik kimyoning asosiy printsiplari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">HSAB nazariyasi</h3>
              <p className="text-purple-200 text-xs">
                Yumshoq metallar (Cu⁺, Zn²⁺) — S-donor ligandlar (sistein, metionin). 
                Qattiq metallar (Mg²⁺, Ca²⁺) — O-donor ligandlar (karboksilat, fosfat). 
                Bu tabiiy tanlanishni tushuntiradi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Irving-Williams qatori</h3>
              <p className="text-purple-200 text-xs">
                Mn²⁺ {'<'} Fe²⁺ {'<'} Co²⁺ {'<'} Ni²⁺ {'<'} Cu²⁺ {'>'} Zn²⁺ — 
                barqarorlik qatori. Cu²⁺ eng barqaror komplekslarni hosil qiladi. 
                Bu tabiat nima uchun Cu ni ko'p ishlatishini tushuntiradi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-sm mb-2">Entatik holat</h3>
              <p className="text-purple-200 text-xs">
                Fermentning faol markazi substratga "tayyor" holatda bo'ladi — 
                geometriya o'tish holatiga yaqin. Bu ferment katalizining yuqori 
                samaradorligini tushuntiradi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/bioilhomlantirilgan" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">
            ← Ko'p yadroli
          </Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar" 
            className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">
            Metalloproteinlar →
          </Link>
        </div>

      </section>
    </main>
  )
}