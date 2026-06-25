import Link from "next/link"

export default function OptikIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🔄 Optik izomeriya (Enantiomeriya)</h1>
          <p className="text-purple-400 text-sm">Δ/Λ konfiguratsiyalar • CD/ORD spektroskopiya • Absolyut konfiguratsiya • Xelat halqalari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Optik izomeriya haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">Optik izomeriya (enantiomeriya)</strong> — molekulalarning 
              <strong className="text-purple-400"> yorug'lik qutblanish tekisligini burish</strong> qobiliyatiga asoslangan 
              fazoviy izomeriya turi. Kompleks birikmalarda optik faollik 
              <strong className="text-purple-400"> metall markazidagi xirallik</strong> (Δ/Λ konfiguratsiyalar) yoki 
              <strong className="text-purple-400"> xiral ligandlar</strong> hisobiga yuzaga keladi.
              Eng klassik misol — <strong>[Co(en)₃]³⁺</strong> ning Δ va Λ enantiomerlari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Xirallik manbalari komplekslarda</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Metall markazi xiralligi:</strong> Δ/Λ — tris(xelat) komplekslarda</li>
                <li>• <strong>Xelat halqasi konformatsiyasi:</strong> δ/λ — etilendiamin halqalari</li>
                <li>• <strong>Xiral ligandlar:</strong> L-amino kislotalar, xiral fosfinlar</li>
                <li>• <strong>Vint geometriyasi:</strong> P (o'ng) va M (chap) helis</li>
                <li>• <strong>Propeller izomeriyasi:</strong> Trifenilfosfin ligandlarida</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Aniqlash usullari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>CD (Circular Dichroism):</strong> Δε = ε_L − ε_R — Cotton effekti</li>
                <li>• <strong>ORD (Optical Rotatory Dispersion):</strong> [α] to'lqin uzunligiga bog'liqligi</li>
                <li>• <strong>Rentgen difraksiyasi:</strong> Absolyut konfiguratsiya (Flack parametri)</li>
                <li>• <strong>NMR:</strong> Xiral siljish reagentlari bilan</li>
                <li>• <strong>Polarimetriya:</strong> [α] = α / (c·l) — solishtirma optik aylanish</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Δ va Λ KONFIGURATSIYALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 Δ va Λ enantiomerlar — tris(xelat) komplekslarda</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-purple-400">[M(A−A)₃]</strong> tipidagi tris(xelat) komplekslarda 
            metall markazi xiral bo'ladi. Uchta xelat halqasi <strong>o'ng vint (Δ, P-helis)</strong> yoki 
            <strong>chap vint (Λ, M-helis)</strong> ko'rinishida joylashgan. Bu enantiomerlar 
            <strong>oynadagi aks</strong> kabi bir-birining aynan aksi, lekin ustma-ust tushmaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Δ-[M(A−A)₃] — O'ng vint (P-helis)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• C₃ o'qi bo'ylab <strong>o'ngga</strong> burilgan</li>
                <li>• CD: birinchi d−d o'tishda <strong>musbat Cotton effekti</strong> (Δε {'>'} 0)</li>
                <li>• Konfiguratsiya: P (Plus — o'ng)</li>
                <li>• Xelat halqalari: δ (delta) konformatsiyada — energetik qulay</li>
                <li>• Misol: Δ-[Co(en)₃]³⁺ — sariq-to'q sariq</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/optik/delta/3d" className="text-blue-400 text-xs underline hover:text-blue-300">🔮 Δ-enantiomer 3D model →</Link>
              </div>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">Λ-[M(A−A)₃] — Chap vint (M-helis)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• C₃ o'qi bo'ylab <strong>chapga</strong> burilgan</li>
                <li>• CD: birinchi d−d o'tishda <strong>manfiy Cotton effekti</strong> (Δε {'<'} 0)</li>
                <li>• Konfiguratsiya: M (Minus — chap)</li>
                <li>• Xelat halqalari: λ (lambda) konformatsiyada — energetik qulay</li>
                <li>• Misol: Λ-[Co(en)₃]³⁺ — sariq-to'q sariq (rangi bir xil!)</li>
              </ul>
              <div className="mt-3 text-center">
                <Link href="/ilmiy/chuqurlashgan/izomeriya/optik/lambda/3d" className="text-purple-400 text-xs underline hover:text-purple-300">🔮 Λ-enantiomer 3D model →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CD SPEKTROSKOPIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 CD spektroskopiya — enantiomerlarni farqlash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-purple-400">CD (Circular Dichroism)</strong> — xiral moddalarning chap va o'ng 
            aylanasimon qutblangan nurni turlicha yutishiga asoslangan. Komplekslarda 
            <strong> Cotton effekti</strong> d−d o'tishlar sohasida kuzatiladi va uning belgisi 
            (musbat/manfiy) absolyut konfiguratsiyani aniqlash imkonini beradi.
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
            <h3 className="text-yellow-400 font-bold mb-3">Empirik qoida (oktaedrik tris-xelat komplekslar uchun):</h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p>• <strong className="text-blue-400">Δ-[M(A−A)₃]:</strong> ¹A₁ → ¹T₁ o'tishda <strong className="text-green-400">musbat</strong> Cotton effekti (Δε {'>'} 0)</p>
              <p>• <strong className="text-purple-400">Λ-[M(A−A)₃]:</strong> ¹A₁ → ¹T₁ o'tishda <strong className="text-red-400">manfiy</strong> Cotton effekti (Δε {'<'} 0)</p>
              <p className="text-purple-400 text-xs mt-2">Bu qoida Co(III), Rh(III), Ir(III), Cr(III) komplekslari uchun ishonchli ishlaydi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
            {[
              { label: "CD signali", delta: "Musbat (Δε {'>'} 0)", lambda: "Manfiy (Δε {'<'} 0)", note: "Birinchi d−d o'tishda" },
              { label: "ORD egri chizig'i", delta: "Musbat Cotton effekti", lambda: "Manfiy Cotton effekti", note: "Anomal dispersion" },
              { label: "[α]D (589 nm)", delta: "Musbat (+) qiymat", lambda: "Manfiy (−) qiymat", note: "Natriy D chizig'ida" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-yellow-400 font-bold mb-2">{r.label}</p>
                <p className="text-blue-400">{r.delta}</p>
                <p className="text-purple-400 mt-1">{r.lambda}</p>
                <p className="text-purple-500 text-xs mt-2">{r.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. XELAT HALQASI KONFORMATSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Xelat halqasi konformatsiyasi — δ va λ</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">Etilendiamin (en)</strong> kabi ligandlar metall bilan 
            5 a'zoli xelat halqasini hosil qiladi. Bu halqa <strong>δ (delta)</strong> yoki 
            <strong>λ (lambda)</strong> konformatsiyada bo'lishi mumkin. Metall Δ/Λ xiralligi 
            va xelat δ/λ konformatsiyasi o'zaro bog'liq — barqaror kombinatsiyalar 
            <strong>Δ(δδδ)</strong> va <strong>Λ(λλλ)</strong> ("lel" — parallel).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kombinatsiya</th>
                <th className="py-3 px-4 text-purple-300">Metall Δ/Λ</th>
                <th className="py-3 px-4 text-purple-300">Xelat δ/λ</th>
                <th className="py-3 px-4 text-purple-300">Nomlanishi</th>
                <th className="py-3 px-4 text-purple-300">Barqarorlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Δ(δδδ)", "Δ (P-helis)", "δ (delta)", "lel (parallel)", "✅ Eng barqaror"],
                  ["Λ(λλλ)", "Λ (M-helis)", "λ (lambda)", "lel (parallel)", "✅ Eng barqaror"],
                  ["Δ(λλλ)", "Δ (P-helis)", "λ (lambda)", "ob (obverse)", "❌ Kam barqaror — sterik to'siq"],
                  ["Λ(δδδ)", "Λ (M-helis)", "δ (delta)", "ob (obverse)", "❌ Kam barqaror — sterik to'siq"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Optik izomerlar — <strong className="text-purple-400">bir xil fizik xossalarga, lekin qarama-qarshi optik faollikka</strong> ega</li>
            <li>Δ (P-helis) — <strong className="text-blue-400">musbat Cotton effekti</strong>; Λ (M-helis) — <strong className="text-purple-400">manfiy Cotton effekti</strong></li>
            <li>CD spektroskopiyasi — <strong className="text-purple-400">enantiomerlarni farqlashning eng sezgir usuli</strong></li>
            <li>Δ(δδδ) va Λ(λλλ) — <strong className="text-purple-400">eng barqaror</strong> konformatsion kombinatsiyalar ("lel")</li>
            <li>Absolyut konfiguratsiya — <strong className="text-purple-400">rentgen difraksiyasi (Flack parametri)</strong> orqali aniqlanadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/geometrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Geometrik izomeriya</Link>
          <Link href="/ilmiy/chuqurlashgan/izomeriya/ionlanish" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Ionlanish izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}