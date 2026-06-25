import Link from "next/link"

export default function KonformatsionIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/izomeriya" className="text-purple-400 hover:text-purple-300 text-lg">← Izomeriya</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🪑 Konformatsion izomeriya</h1>
          <p className="text-purple-400 text-sm">Xelat halqalari • δ/λ konformatsiyalar • 5 va 6 a'zoli xelatlar • Energetik barqarorlik</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Konformatsion izomeriya haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-pink-400">Konformatsion izomeriya</strong> — xelat halqalarining 
              <strong className="text-pink-400"> fazoviy shakli (konformatsiyasi)</strong> bilan farq qiluvchi 
              izomerlar. Xelat ligandlari (etilendiamin, propilendiamin) metall bilan bog'langanda 
              <strong>5 yoki 6 a'zoli halqalar</strong> hosil qiladi. Bu halqalar <strong>δ (delta)</strong> 
              yoki <strong>λ (lambda)</strong> konformatsiyada bo'lishi mumkin. Konformatsion izomerlar 
              <strong>bir-biriga o'tishi mumkin</strong> (past energetik to'siq) va ularning nisbiy barqarorligi 
              <strong>metall Δ/Λ xiralligi bilan bog'liq</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-2">δ (delta) konformatsiya</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Xelat halqasi <strong>metall tomon egilgan</strong></li>
                <li>• C−C bog'i <strong>metallga nisbatan parallel</strong> (lel)</li>
                <li>• <strong>Δ(δδδ)</strong> — eng barqaror kombinatsiya</li>
                <li>• Sterik itarilish <strong>minimal</strong></li>
                <li>• Energetik jihatdan <strong>afzal</strong> konformatsiya</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-2">λ (lambda) konformatsiya</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Xelat halqasi <strong>metall tomon teskari egilgan</strong></li>
                <li>• C−C bog'i <strong>metallga nisbatan qiya</strong> (ob)</li>
                <li>• <strong>Λ(λλλ)</strong> — eng barqaror kombinatsiya</li>
                <li>• Sterik itarilish <strong>yuqoriroq</strong></li>
                <li>• <strong>Δ(λλλ)</strong> — kam barqaror (ob konformatsiya)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. 5 A'ZOLI vs 6 A'ZOLI XELATLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 5 a'zoli vs 6 a'zoli xelat halqalari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-pink-400">5 a'zoli xelatlar</strong> (etilendiamin — en) va 
            <strong className="text-pink-400">6 a'zoli xelatlar</strong> (propilendiamin — pn, trimetilendiamin — tn)
            turli konformatsion xususiyatlarga ega. 5 a'zoli halqalar <strong>yassi</strong> (planar) yoki 
            <strong>bukilgan</strong> (puckered) bo'lishi mumkin.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5">
              <h3 className="text-pink-400 font-bold mb-3">5 a'zoli xelat (etilendiamin — en)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Atomlar:</strong> M−N−C−C−N — 5 ta</li>
                <li>• <strong>Konformatsiyalar:</strong> δ va λ — bukilgan (puckered)</li>
                <li>• <strong>Bog' burchagi:</strong> N−M−N ≈ 86° (ideal 90° dan kichik)</li>
                <li>• <strong>Kuchlanish:</strong> Kichik burchak kuchlanishi</li>
                <li>• <strong>Barqarorlik:</strong> Yuqori — eng ko'p uchraydigan xelat</li>
                <li>• <strong>Misol:</strong> [Co(en)₃]³⁺ — klassik tris-xelat</li>
              </ul>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-3">6 a'zoli xelat (trimetilendiamin — tn)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Atomlar:</strong> M−N−C−C−C−N — 6 ta</li>
                <li>• <strong>Konformatsiyalar:</strong> Kreslo (chair), vanna (boat), twist</li>
                <li>• <strong>Bog' burchagi:</strong> N−M−N ≈ 94° (ideal 90° dan katta)</li>
                <li>• <strong>Kuchlanish:</strong> Kichik — ko'proq erkinlik darajasi</li>
                <li>• <strong>Barqarorlik:</strong> 5 a'zolidan pastroq (xelat effekti)</li>
                <li>• <strong>Misol:</strong> [Co(tn)₃]³⁺ — kamroq barqaror</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. LEL vs OB */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 lel vs ob — xelat halqasi orientatsiyasi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Tris(xelat) komplekslarda xelat halqalarining orientatsiyasi <strong>lel</strong> (parallel) 
            yoki <strong>ob</strong> (obverse — teskari) bo'lishi mumkin. Lel orientatsiyada C−C bog'i 
            C₃ o'qiga parallel, ob orientatsiyada esa qiya. <strong>Lel konformatsiya energetik jihatdan 
            afzal</strong> — Δ(δδδ) va Λ(λλλ) kombinatsiyalar eng barqaror.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kombinatsiya</th>
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Xelat</th>
                <th className="py-3 px-4 text-purple-300">Orientatsiya</th>
                <th className="py-3 px-4 text-purple-300">Barqarorlik</th>
                <th className="py-3 px-4 text-purple-300">Energiya farqi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Δ(δδδ)", "Δ (P-helis)", "δ", "lel (parallel)", "✅ Eng barqaror", "0 kJ/mol (asos)"],
                  ["Λ(λλλ)", "Λ (M-helis)", "λ", "lel (parallel)", "✅ Eng barqaror", "0 kJ/mol (asos)"],
                  ["Δ(λλλ)", "Δ (P-helis)", "λ", "ob (obverse)", "❌ Kam barqaror", "~15−20 kJ/mol"],
                  ["Λ(δδδ)", "Λ (M-helis)", "δ", "ob (obverse)", "❌ Kam barqaror", "~15−20 kJ/mol"],
                  ["Δ(δδλ)", "Δ (P-helis)", "2δ + 1λ", "lel + ob aralash", "⚠️ Oraliq", "~5−10 kJ/mol"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-pink-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. CD VA NMR ANIQLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Konformatsion izomerlarni aniqlash</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-2">CD spektroskopiya</h3>
              <p className="text-purple-200 text-sm">
                Δ va Λ enantiomerlar <strong>qarama-qarshi CD signallari</strong> beradi.
                δ va λ konformatsiyalar CD signalining <strong>intensivligiga</strong> ta'sir qiladi.
                Lel konformatsiyada CD signali <strong>kuchliroq</strong>, ob da kuchsizroq.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold mb-2">NMR spektroskopiya</h3>
              <p className="text-purple-200 text-sm">
                Past haroratda turli konformatsiyalar <strong>alohida signallar</strong> beradi.
                Yuqori haroratda tez almashinuv tufayli <strong>o'rtacha signal</strong> kuzatiladi.
                <strong>Vaqt-o'lchovli NMR</strong> konformatsion dinamikani o'rganish imkonini beradi.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Konformatsion izomeriya — <strong className="text-pink-400">xelat halqalarining fazoviy shakli</strong> farqi</li>
            <li>Lel (parallel) konformatsiya — <strong className="text-pink-400">ob dan ~15−20 kJ/mol barqarorroq</strong></li>
            <li>5 a'zoli xelatlar — <strong className="text-pink-400">eng barqaror va ko'p uchraydigan</strong></li>
            <li>Konformatsion o'zgarish <strong className="text-pink-400">past energetik to'siq</strong> orqali sodir bo'ladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/izomeriya/gidrat" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Gidrat izomeriyasi</Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Barcha mavzular →</Link>
        </div>

      </section>
    </main>
  )
}