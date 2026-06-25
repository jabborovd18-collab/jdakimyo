import Link from "next/link"

export default function GeometrikIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📐 Geometrik izomeriya</h1>
          <p className="text-purple-400 text-sm">sis/trans • fac/mer • KMN energetikasi • Dipol momentlari • IQ/Raman farqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Geometrik izomeriya haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">Geometrik izomeriya</strong> — ligandlarning metall atrofida 
              <strong className="text-blue-400"> turlicha fazoviy joylashuvi</strong> natijasida yuzaga keladi.
              Bir xil ligandlar <strong>yonma-yon (sis)</strong> yoki <strong>qarama-qarshi (trans)</strong> 
              joylashgan bo'lishi mumkin. Oktaedrik komplekslarda <strong>fac (facial)</strong> — uchta bir xil 
              ligand bir yoqda, <strong>mer (meridional)</strong> — ikkitasi bir yoqda, bittasi qarama-qarshi.
              Bu izomerlarning <strong>dipol momentlari, IQ/Raman spektrlari va hatto biologik faolligi</strong> farq qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Kvadrat planar (KCh=4)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>sis/trans</strong> — [MA₂B₂] tipidagi komplekslar</li>
                <li>• <strong>Misollar:</strong> sis/trans-[PtCl₂(NH₃)₂]</li>
                <li>• <strong>3 ta geometrik izomer</strong> — [MA₂BC] tipida</li>
                <li>• d⁸ konfiguratsiya — Pt²⁺, Pd²⁺, Ni²⁺ (kuchli maydon)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Oktaedrik (KCh=6)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>sis/trans</strong> — [MA₄B₂] tipida</li>
                <li>• <strong>fac/mer</strong> — [MA₃B₃] tipida</li>
                <li>• <strong>Misollar:</strong> fac/mer-[CoCl₃(NH₃)₃]</li>
                <li>• [M(A−A)₂B₂] — xelat ligandlar bilan sis/trans</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. SISPLATIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 sis/trans-[PtCl₂(NH₃)₂] — eng mashhur misol</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-yellow-400">Sisplatin</strong> — JSST ro'yxatidagi eng muhim saraton dori vositalaridan biri.
              Uning <strong>trans-izomeri biologik nofaol</strong>. Sababi: sis-izomer ikkala Cl⁻ ni DNK bilan almashinib,
              ikki zanjirni o'zaro bog'laydi (cross-linking). Trans-izomer esa sterik to'siq tufayli buni qila olmaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">sis-[PtCl₂(NH₃)₂]</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Simmetriya:</strong> C₂v</li>
                <li>• <strong>Dipol momenti:</strong> μ ≠ 0 (qutbli)</li>
                <li>• <strong>Cl−Pt−Cl:</strong> ~91°</li>
                <li>• <strong>IQ:</strong> Pt−Cl: 330, 345 sm⁻¹ (2 ta pik)</li>
                <li>• <strong>Biologik faollik:</strong> Aktiv (DNK cross-linking)</li>
                <li>• <strong>Suvda eruvchanligi:</strong> Yuqoriroq</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik/sisplatin/3d" className="text-blue-400 text-xs underline hover:text-blue-300">🔮 3D modelni ko'rish →</Link>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">trans-[PtCl₂(NH₃)₂]</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Simmetriya:</strong> D₂h</li>
                <li>• <strong>Dipol momenti:</strong> μ = 0 (qutbsiz)</li>
                <li>• <strong>Cl−Pt−Cl:</strong> 180°</li>
                <li>• <strong>IQ:</strong> Pt−Cl: faqat 1 ta pik (~340 sm⁻¹)</li>
                <li>• <strong>Biologik faollik:</strong> Nofaol</li>
                <li>• <strong>Suvda eruvchanligi:</strong> Pastroq</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik/transplatin/3d" className="text-red-400 text-xs underline hover:text-red-300">🔮 3D modelni ko'rish →</Link>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-2">IQ va Raman orqali sis/trans farqlash</h3>
            <p className="text-purple-200 text-sm">
              <strong>sis-izomer (C₂v):</strong> Barcha tebranish modlari IQ va Raman da faol — ko'p sonli piklar.
              <strong>trans-izomer (D₂h):</strong> Inversion markaz mavjud — o'zaro istisno qoidasi. 
              Raman faol modlar IQ da ko'rinmaydi va aksincha. Bu farq orqali ikki izomerni 
              <strong>IQ va Raman spektrlari orqali aniq farqlash</strong> mumkin.
            </p>
          </div>
        </div>

        {/* 3. FAC/MER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 fac/mer — Oktaedrik [MA₃B₃] izomerlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">fac-[CoCl₃(NH₃)₃] — facial</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Simmetriya:</strong> C₃v</li>
                <li>• <strong>3 ta Cl</strong> — oktaedrning bir yoqida (uchburchak)</li>
                <li>• <strong>3 ta NH₃</strong> — qarama-qarshi yoqda</li>
                <li>• <strong>Dipol momenti:</strong> μ ≠ 0 (qutbli)</li>
                <li>• <strong>Rang:</strong> Yashil</li>
                <li>• <strong>Barqarorlik:</strong> Kamroq (sterik itarilish)</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik/fac/3d" className="text-green-400 text-xs underline hover:text-green-300">🔮 3D modelni ko'rish →</Link>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">mer-[CoCl₃(NH₃)₃] — meridional</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Simmetriya:</strong> C₂v</li>
                <li>• <strong>2 ta Cl</strong> — bir-biriga qarama-qarshi (trans)</li>
                <li>• <strong>1 ta Cl</strong> — ularga perpendikulyar</li>
                <li>• <strong>Dipol momenti:</strong> μ ≠ 0 (qutbli, fac dan kuchsizroq)</li>
                <li>• <strong>Rang:</strong> Binafsha</li>
                <li>• <strong>Barqarorlik:</strong> Ko'proq (termodinamik)</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik/mer/3d" className="text-purple-400 text-xs underline hover:text-purple-300">🔮 3D modelni ko'rish →</Link>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-2">fac/mer nisbiy barqarorlik</h3>
            <p className="text-purple-200 text-sm">
              <strong>fac-izomer</strong> — bir xil ligandlar bir-biriga yaqin (sterik itarilish kuchli).
              <strong>mer-izomer</strong> — bir xil ligandlar uzoqroq masofada (sterik itarilish kuchsiz).
              Ko'pincha <strong>mer-izomer termodinamik barqarorroq</strong>. Lekin sintez sharoitiga qarab 
              kinetik mahsulot sifatida fac-izomer ham olinishi mumkin. Qizdirilganda 
              <strong>fac → mer</strong> izomerlanish kuzatiladi.
            </p>
          </div>
        </div>

        {/* 4. UMUMIY JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Geometrik izomerlarni farqlash usullari</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Usul</th>
                <th className="py-3 px-4 text-purple-300">sis/fac</th>
                <th className="py-3 px-4 text-purple-300">trans/mer</th>
                <th className="py-3 px-4 text-purple-300">Farqlash mezoni</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Dipol momenti", "μ ≠ 0 (qutbli)", "μ = 0 yoki kuchsizroq", "Dielektrik o'tkazuvchanlik"],
                  ["IQ spektroskopiya", "Ko'p piklar (barcha modlar faol)", "Kam piklar (o'zaro istisno)", "C₂v: ko'p, D₂h: kam"],
                  ["Raman spektroskopiya", "Ko'p piklar", "Faqat g-modlar", "Simmetriyaga bog'liq"],
                  ["Rentgen difraksiyasi", "Bog' burchaklari ~90° (sis)", "Bog' burchaklari 180° (trans)", "Aniq geometrik dalil"],
                  ["Suvda eruvchanlik", "Yuqori (qutbli)", "Past (qutbsiz)", "Elektrostatik omil"],
                  ["Biologik faollik", "Faol bo'lishi mumkin", "Ko'pincha nofaol", "Farmakologik testlar"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Geometrik izomeriya — <strong className="text-blue-400">ligandlarning fazoviy joylashuvi</strong> farqi</li>
            <li>Kvadrat planar: <strong className="text-blue-400">sis/trans</strong>; Oktaedrik: <strong className="text-blue-400">sis/trans + fac/mer</strong></li>
            <li>IQ va Raman — <strong className="text-blue-400">simmetriya farqi tufayli</strong> eng ishonchli farqlash usuli</li>
            <li>Sisplatin (faol) vs trans-izomer (nofaol) — <strong className="text-blue-400">geometriya = biologik faollik</strong></li>
            <li>mer-izomer odatda <strong className="text-blue-400">fac dan termodinamik barqarorroq</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Izomeriya</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/optik" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Optik izomeriya →</Link>
        </div>

      </section>
    </main>
  )
}