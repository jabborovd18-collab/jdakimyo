import Link from "next/link"

export default function Bioilhomlantirilgan() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kop-yadroli" className="text-purple-400 hover:text-purple-300 text-lg">← Ko'p yadroli</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🌿 Bioilhomlantirilgan ko'p yadroli komplekslar</h1>
          <p className="text-purple-400 text-sm">Mn₄Ca • FeMo-koferment • Fotosintez II • Nitrogenaza • Fe₈S₇</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Bioilhomlantirilgan komplekslar haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Bioilhomlantirilgan ko'p yadroli komplekslar</strong> — 
              tabiatdagi eng muhim metalloklasterlarning <strong>tuzilishi va funksiyasini</strong> 
              o'rganadi va taqlid qiladi. Tabiat milliardlab yillar davomida 
              <strong>mukammal ko'p yadroli katalizatorlarni</strong> yaratgan. Ularning eng muhim 
              vakillari: <strong>fotosintez II ning Mn₄Ca klasteri</strong> (suvning oksidlanishi, 
              O₂ ajralishi) va <strong>nitrogenaza fermentining FeMo-kofermenti</strong> 
              (atmosfera N₂ ni NH₃ ga aylantirish). Bu tizimlarni tushunish 
              <strong>sun'iy fotosintez va yashil kimyo</strong> uchun kalit hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Nima uchun ko'p yadroli?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Ko'p elektronli reaksiyalar:</strong> 2H₂O → O₂ + 4H⁺ + 4e⁻ — 4 ta elektron bir vaqtda kerak</li>
                <li>• <strong>Substrat preorganizatsiyasi:</strong> Bir nechta metall substratni kerakli orientatsiyada ushlaydi</li>
                <li>• <strong>Redoks bufer:</strong> Metall klasteri elektronlarni to'playdi va bosqichma-bosqich uzatadi</li>
                <li>• <strong>Katalitik kooperativlik:</strong> Metall markazlari birgalikda ishlaydi — "jamoa katalizi"</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">Asosiy tabiiy tizimlar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Ferment/Klaster</th><th className="text-left py-2 text-cyan-400">Metallar</th><th className="text-left py-2 text-yellow-400">Funksiya</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Fotosintez II (OEC)","Mn₄CaO₅","2H₂O → O₂ + 4H⁺ + 4e⁻"],["Nitrogenaza (FeMo-co)","MoFe₇S₉C","N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂"],["Gidrogenaza [FeFe]","Fe₂S₂(CO)(CN)","2H⁺ + 2e⁻ ⇌ H₂"],["Sitoxrom c oksidaza","FeCu (heme a₃/Cu_B)","O₂ + 4H⁺ + 4e⁻ → 2H₂O"],["Kislorod ajratuvchi kompleks","Mn₄CaO₅","Kokubo-Yano sikl (S₀→S₄)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5 font-mono text-xs">{r[0]}</td><td className="py-1.5 text-xs">{r[1]}</td><td className="py-1.5 text-xs">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Mn₄Ca — FOTOSINTEZ II */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">☀️ Mn₄CaO₅ — fotosintez II kislorod ajratuvchi kompleksi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Fotosintez II ning kislorod ajratuvchi kompleksi (OEC)</strong> — 
            tabiatdagi eng muhim katalitik markazlardan biri. U <strong>suvni oksidlab, 
            molekulyar kislorod ajratadi</strong> — bu yer yuzidagi deyarli barcha kislorodning manbai.
            <strong>Umena va boshqalar (2011)</strong> tomonidan 1.9 Å aniqlikdagi rentgen strukturasi 
            e'lon qilingan. Klaster tarkibi: <strong>Mn₄CaO₅</strong> — 4 ta Mn, 1 ta Ca, 5 ta O ko'prik.
            U <strong>Kokubo-Yano sikli (S₀→S₁→S₂→S₃→S₄→S₀)</strong> orqali ishlaydi — 
            5 ta oksidlanish holati orqali 2 ta suv molekulasidan O₂ ajratadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-2">Kokubo-Yano sikli (S-holatlar)</h3>
              <div className="space-y-1 text-xs text-purple-200">
                <p><strong className="text-yellow-400">S₀:</strong> Eng qaytarilgan holat (Mn₄: 3×III + 1×IV). Qorong'ida barqaror.</p>
                <p><strong className="text-yellow-400">S₁:</strong> Qorong'ida barqaror (Mn₄: 2×III + 2×IV).</p>
                <p><strong className="text-yellow-400">S₂:</strong> Yorug'lik ta'sirida (Mn₄: 1×III + 3×IV). EPR faol.</p>
                <p><strong className="text-yellow-400">S₃:</strong> Yorug'lik ta'sirida (Mn₄: 4×IV).</p>
                <p><strong className="text-yellow-400">S₄:</strong> O'tkinchi holat — O₂ ajraladi va S₀ ga qaytadi.</p>
                <p className="text-purple-300 mt-2">Har bir o'tish: 1 ta foton yutiladi → 1 ta elektron ajraladi → Mn oksidlanadi.</p>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Sun'iy Mn₄Ca komplekslari</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Christou (2004):</strong> [Mn₄O₄] — birinchi Mn₄ kuban klasteri</li>
                <li>• <strong>Dismukes (2005):</strong> [Mn₄O₄L₆] — Ca siz, lekin O₂ ajrata olmaydi</li>
                <li>• <strong>Zhang (2015):</strong> [Mn₄CaO₄] — Ca qo'shilgan, OEC ga eng yaqin model</li>
                <li>• <strong>Asosiy muammo:</strong> Yuqori oksidlanish darajasida Mn komplekslarining beqarorligi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. FeMo-koferment */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 FeMo-koferment — nitrogenaza</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-cyan-400">Nitrogenaza fermenti</strong> — atmosfera azotini (N₂) 
            ammiakka (NH₃) aylantiruvchi noyob biologik katalizator. Uning faol markazi — 
            <strong>FeMo-koferment (FeMoco)</strong>: <strong>MoFe₇S₉C</strong> — 1 ta Mo, 7 ta Fe, 
            9 ta S va <strong>1 ta markaziy C atomi!</strong> (2011-yilda kashf etilgan).
            Bu <strong>Yer yuzidagi eng murakkab metalloklasterlardan biri</strong>.
            Sanoatda Haber-Bosch jarayoni (450°C, 200 atm) bilan solishtirganda, nitrogenaza 
            <strong>xona harorati va atmosfera bosimida</strong> ishlaydi!
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-cyan-400 font-bold mb-3">FeMoco — struktura va funksiya:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-2">Tarkibi: MoFe₇S₉C</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• <strong>P-klaster:</strong> [Fe₈S₇] — elektronlarni FeMoco ga uzatadi</li>
                  <li>• <strong>FeMoco:</strong> MoFe₇S₉C — N₂ bog'lanadigan va qaytariladigan markaz</li>
                  <li>• <strong>Markaziy C:</strong> Karbid atomi — klaster strukturasini barqarorlashtiradi</li>
                  <li>• <strong>Sitrat + gomotsitrat:</strong> Mo ga koordinatsiyalangan</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-2">N₂ qaytarilish mexanizmi:</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• <strong>Lowe-Thornley sikli:</strong> 8 ta elektron bosqichma-bosqich qo'shiladi</li>
                  <li>• <strong>N₂ bog'lanishi:</strong> Mo yoki Fe markaziga (munozarali)</li>
                  <li>• <strong>Yon mahsulot:</strong> Har bir N₂ uchun 1 ta H₂ ajraladi (muqarrar)</li>
                  <li>• <strong>Sun'iy modellar:</strong> Mo-Fe-S klasterlari — N₂ qaytara olmaydi (hali!)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Fotosintez II (Mn₄Ca) — <strong className="text-cyan-400">suvni oksidlab O₂ ajratadi</strong>, Kokubo-Yano sikli</li>
            <li>Nitrogenaza (FeMo-koferment) — <strong className="text-cyan-400">N₂ ni NH₃ ga aylantiradi</strong>, xona haroratida!</li>
            <li>Tabiiy klasterlar — <strong className="text-cyan-400">ko'p elektronli reaksiyalar uchun mukammal dizayn</strong></li>
            <li>Sun'iy modellar — <strong className="text-cyan-400">tabiiy samaradorlikka hali erishilmagan</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kop-yadroli/aralash-valentli" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Aralash valentli komplekslar</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Bioanorganik kimyo →</Link>
        </div>

      </section>
    </main>
  )
}