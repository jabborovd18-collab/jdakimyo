import Link from "next/link"

export default function YuqoriQuyiSpin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧲 Yuqori va quyi spin</h1>
          <p className="text-purple-400 text-sm">Δo vs P — juftlashish energiyasi • Spin holatini bashorat qilish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spin holati haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d⁴−d⁷ konfiguratsiyali</strong> oktaedrik komplekslarda elektronlar 
              ikki xil usulda joylashishi mumkin. Qaysi holat amalga oshishi <strong className="text-yellow-400">Δo va P</strong> 
              (juftlashish energiyasi) qiymatlariga bog'liq. Bu kompleksning <strong className="text-yellow-400">magnit xossasini</strong> belgilaydi.
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center mb-4">
            <p className="text-lg text-white">Qoida: <strong className="text-yellow-400">Δo &gt; P → Quyi spin</strong> | <strong className="text-orange-400">Δo &lt; P → Yuqori spin</strong></p>
          </div>
        </div>

        {/* 2. TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Yuqori spin vs Quyi spin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-4">Yuqori spinli (HS)</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Shart: <strong className="text-yellow-400">Δo &lt; P</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Elektronlar: <strong>juftlashmaydi</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Avval t₂g, keyin <strong>eg ga chiqadi</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Ko'proq <strong>toq elektronlar</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Magnit: <strong>Paramagnit</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Ligandlar: <strong>Kuchsiz maydonli</strong> (H₂O, F⁻, Cl⁻)</p>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-xl mb-4">Quyi spinli (LS)</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Shart: <strong className="text-green-400">Δo &gt; P</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Elektronlar: <strong>juftlashadi</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">t₂g <strong>to'liq to'lguncha</strong> eg ga chiqmaydi</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Kamroq <strong>toq elektronlar</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Magnit: <strong>Diamagnit yoki kam paramagnit</strong></p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-200">Ligandlar: <strong>Kuchli maydonli</strong> (CN⁻, CO, en)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. d⁴−d⁷ JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 d⁴−d⁷ konfiguratsiyalar — har ikkala spin</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">dⁿ</th><th className="py-3 px-4 text-purple-300">Spin turi</th><th className="py-3 px-4 text-purple-300">t₂g</th><th className="py-3 px-4 text-purple-300">eg</th><th className="py-3 px-4 text-purple-300">Toq e⁻</th><th className="py-3 px-4 text-purple-300">μeff (naz)</th><th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d⁴","YS","↑ ↑ ↑","↑","4","4.90","Cr²⁺ (H₂O)"],
                  ["d⁴","QS","↑↓ ↑ ↑","—","2","2.83","Cr²⁺ (CN⁻)"],
                  ["d⁵","YS","↑ ↑ ↑","↑ ↑","5","5.92","Fe³⁺, Mn²⁺ (H₂O)"],
                  ["d⁵","QS","↑↓ ↑↓ ↑","—","1","1.73","Fe³⁺ (CN⁻)"],
                  ["d⁶","YS","↑↓ ↑ ↑","↑ ↑","4","4.90","Fe²⁺ (H₂O)"],
                  ["d⁶","QS","↑↓ ↑↓ ↑↓","—","0","0","Fe²⁺ (CN⁻) ✨"],
                  ["d⁷","YS","↑↓ ↑↓ ↑","↑ ↑","3","3.87","Co²⁺ (H₂O)"],
                  ["d⁷","QS","↑↓ ↑↓ ↑↓","↑","1","1.73","Co²⁺ (CN⁻)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1] === "YS" ? <span className="text-yellow-400">Yuqori</span> : <span className="text-green-400">Quyi</span>}</td>
                    <td className="py-3 px-4 font-mono text-green-400 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-red-400 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 font-bold text-white">{r[4]}</td>
                    <td className="py-3 px-4">{r[5]}</td>
                    <td className="py-3 px-4 text-sm">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. P — JUFRLASHISH ENERGIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ P — juftlashish energiyasi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-yellow-400">P (juftlashish energiyasi)</strong> — ikkita elektronni bir orbitalga 
            juftlashtirish uchun sarflanadigan energiya. P qiymati <strong>metall ioniga qarab</strong> o'zgaradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-300 text-xs">3d metallar</p>
              <p className="text-yellow-400 font-bold text-lg">P ≈ 200-300 kJ/mol</p>
              <p className="text-purple-400 text-xs">Ko'pincha yuqori spin</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-300 text-xs">4d metallar</p>
              <p className="text-yellow-400 font-bold text-lg">P ≈ 250-350 kJ/mol</p>
              <p className="text-purple-400 text-xs">Ko'pincha quyi spin</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <p className="text-purple-300 text-xs">5d metallar</p>
              <p className="text-yellow-400 font-bold text-lg">P ≈ 300-400 kJ/mol</p>
              <p className="text-purple-400 text-xs">Deyarli har doim quyi spin</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Δo &gt; P → Quyi spin</strong> (kuchli maydon)</li>
            <li><strong className="text-orange-400">Δo &lt; P → Yuqori spin</strong> (kuchsiz maydon)</li>
            <li>d⁴−d⁷ konfiguratsiyalarda <strong>har ikkala spin bo'lishi mumkin</strong></li>
            <li>5d metallar — <strong>deyarli har doim quyi spinli</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/kmbe-hisoblash" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← KMBE hisoblash</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/rang-spektrlar" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Rang va spektrlar →</Link>
        </div>

      </section>
    </main>
  )
}