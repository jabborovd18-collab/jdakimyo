import Link from "next/link"

export default function KoordinatsionIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔀 Koordinatsion izomeriya</h1>
          <p className="text-purple-400 text-sm">Ko'p metalli komplekslar • Ligandlar qayta taqsimlanishi • Kation/anion almashinuvi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Koordinatsion izomeriya haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-orange-400">Koordinatsion izomeriya</strong> — 
              <strong className="text-orange-400"> ikkita kompleks iondan tashkil topgan</strong> tuzlarda 
              ligandlarning kation va anion o'rtasida <strong>qayta taqsimlanishi</strong> natijasida yuzaga keladi.
              Bunda kompleks kation va kompleks anion tarkibidagi ligandlar o'zaro almashinadi, 
              lekin <strong>umumiy molekulyar formula o'zgarmaydi</strong>. Bu izomeriya turi faqat 
              <strong>ko'p metalli</strong> (kation + anion ikkalasi ham kompleks) tizimlarda kuzatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Klassik misol</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>[Pt(NH₃)₄][CuCl₄]</strong> — Pt kationda, Cu anionda</li>
                <li>• <strong>[Cu(NH₃)₄][PtCl₄]</strong> — Cu kationda, Pt anionda</li>
                <li>• Umumiy formula: PtCuN₄H₁₂Cl₄ — bir xil!</li>
                <li>• Farqi: ligandlar qaysi metall bilan bog'langan</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Boshqa misollar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>[Co(NH₃)₆][Cr(CN)₆]</strong> vs <strong>[Cr(NH₃)₆][Co(CN)₆]</strong></li>
                <li>• <strong>[Pt(NH₃)₄][PdCl₄]</strong> vs <strong>[Pd(NH₃)₄][PtCl₄]</strong></li>
                <li>• <strong>[Cr(NH₃)₆][Fe(CN)₆]</strong> vs <strong>[Fe(NH₃)₆][Cr(CN)₆]</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOL TAHLILI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ [Pt(NH₃)₄][CuCl₄] vs [Cu(NH₃)₄][PtCl₄]</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Eng klassik koordinatsion izomerlar jufti. Birinchisida <strong>Pt²⁺ NH₃ bilan, Cu²⁺ Cl⁻ bilan</strong> 
            koordinatsiyalangan. Ikkinchisida <strong>Cu²⁺ NH₃ bilan, Pt²⁺ Cl⁻ bilan</strong>. 
            Bu almashinuv ikkala metallning <strong>ligandlarga bo'lgan moyilligi</strong> (HSAB) bilan bog'liq.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">[Pt(NH₃)₄][CuCl₄]</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Kation:</strong> [Pt(NH₃)₄]²⁺ — Pt²⁺ (yumshoq) + NH₃ (qattiq asos)</li>
                <li>• <strong>Anion:</strong> [CuCl₄]²⁻ — Cu²⁺ (oraliq) + Cl⁻ (oraliq asos)</li>
                <li>• <strong>Rang:</strong> Pt(NH₃)₄²⁺ rangsiz, CuCl₄²⁻ sariq-yashil</li>
                <li>• <strong>HSAB mosligi:</strong> Qisman mos</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">[Cu(NH₃)₄][PtCl₄]</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Kation:</strong> [Cu(NH₃)₄]²⁺ — Cu²⁺ (oraliq) + NH₃ (qattiq asos)</li>
                <li>• <strong>Anion:</strong> [PtCl₄]²⁻ — Pt²⁺ (yumshoq) + Cl⁻ (oraliq asos)</li>
                <li>• <strong>Rang:</strong> Cu(NH₃)₄²⁺ ko'k, PtCl₄²⁻ qizil-jigarrang</li>
                <li>• <strong>HSAB mosligi:</strong> Yaxshi mos — <strong>termodinamik barqaror!</strong></li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">HSAB asosida bashorat</h3>
            <p className="text-purple-200 text-sm">
              Pt²⁺ — <strong>yumshoq kislota</strong>, Cl⁻ — yumshoqroq asos (NH₃ ga nisbatan). 
              Cu²⁺ — <strong>oraliq kislota</strong>, NH₃ — qattiqroq asos. 
              HSAB nazariyasiga ko'ra: <strong>yumshoq+yumshoq, qattiq+qattiq</strong> — eng barqaror kombinatsiya.
              Shuning uchun <strong>[Cu(NH₃)₄][PtCl₄]</strong> (Cu−NH₃ qattiq+qattiq, Pt−Cl yumshoq+yumshoq) 
              <strong>[Pt(NH₃)₄][CuCl₄]</strong> ga nisbatan barqarorroq.
            </p>
          </div>
        </div>

        {/* 3. FARQLASH USULLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Koordinatsion izomerlarni farqlash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Usul</th>
                <th className="py-3 px-4 text-purple-300">Nimani aniqlaydi</th>
                <th className="py-3 px-4 text-purple-300">Misol: [Pt(NH₃)₄][CuCl₄]</th>
                <th className="py-3 px-4 text-purple-300">Misol: [Cu(NH₃)₄][PtCl₄]</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["UB-Vis spektroskopiya", "d−d o'tishlar", "CuCl₄²⁻ yutilishi (sariq-yashil)", "Cu(NH₃)₄²⁺ yutilishi (ko'k)"],
                  ["IQ spektroskopiya", "M−L tebranishlar", "Pt−N: ~520 sm⁻¹", "Cu−N: ~450 sm⁻¹"],
                  ["Element analiz", "Metall nisbati", "Pt:Cu = 1:1 (bir xil)", "Pt:Cu = 1:1 (bir xil!)"],
                  ["Rentgen difraksiyasi", "Kristall struktura", "Kationda Pt, anionda Cu", "Kationda Cu, anionda Pt"],
                  ["Konduktometriya", "Ionlar soni", "2:2 elektrolit (bir xil)", "2:2 elektrolit (bir xil!)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * Diqqat: Element analiz va konduktometriya koordinatsion izomerlarni farqlay olmaydi — 
            ularning element tarkibi va ionlar soni bir xil! Faqat <strong>spektroskopik usullar</strong> 
            (UB-Vis, IQ) va <strong>rentgen difraksiyasi</strong> farqlash imkonini beradi.
          </p>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Koordinatsion izomeriya — <strong className="text-orange-400">ko'p metalli komplekslarda ligandlar qayta taqsimlanishi</strong></li>
            <li>HSAB nazariyasi — <strong className="text-orange-400">qaysi izomer barqarorligini bashorat qiladi</strong></li>
            <li>Element analiz farqlay olmaydi — <strong className="text-orange-400">faqat spektroskopiya va rentgen</strong> yordam beradi</li>
            <li>Rang farqi — eng oddiy, lekin <strong className="text-orange-400">ishonchli birlamchi test</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Bog'lanish izomeriyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/gidrat" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Gidrat izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}