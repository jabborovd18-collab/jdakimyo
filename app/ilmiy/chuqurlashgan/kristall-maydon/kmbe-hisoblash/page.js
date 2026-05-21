import Link from "next/link"

export default function KMBEHisoblash() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔢 KMBE hisoblash</h1>
          <p className="text-purple-400 text-sm">Kristall maydon barqarorlashish energiyasi • d¹−d¹⁰ uchun hisoblash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 KMBE haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">KMBE (Kristall maydon barqarorlashish energiyasi)</strong> — 
              elektronlarning t₂g va eg orbitallarga joylashishi natijasida <strong>qo'shimcha barqarorlik</strong> energiyasi.
              KMBE qancha manfiy (katta absolyut qiymat) bo'lsa, kompleks <strong>shuncha barqaror</strong>.
              KMBE — bu oktaedrik kompleks hosil bo'lishining <strong>asosiy harakatlantiruvchi kuchi</strong>.
            </p>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-white font-bold">KMBE = Σ(e⁻ t₂g da) × (−0.4Δo) + Σ(e⁻ eg da) × (+0.6Δo)</p>
          </div>
        </div>

        {/* 2. HISOBLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 d¹−d¹⁰ oktaedrik komplekslar uchun KMBE (yuqori spin)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">dⁿ</th><th className="py-3 px-4 text-purple-300">t₂g</th><th className="py-3 px-4 text-purple-300">eg</th><th className="py-3 px-4 text-purple-300">KMBE hisoblash</th><th className="py-3 px-4 text-purple-300">KMBE (Δo)</th><th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "↑", "—", "1×(−0.4)", "−0.4", "Ti³⁺"],
                  ["d²", "↑ ↑", "—", "2×(−0.4)", "−0.8", "V³⁺"],
                  ["d³", "↑ ↑ ↑", "—", "3×(−0.4)", "−1.2", "Cr³⁺"],
                  ["d⁴ (YS)", "↑ ↑ ↑", "↑", "3×(−0.4)+1×(+0.6)", "−0.6", "Cr²⁺"],
                  ["d⁵ (YS)", "↑ ↑ ↑", "↑ ↑", "3×(−0.4)+2×(+0.6)", "0", "Fe³⁺, Mn²⁺"],
                  ["d⁶ (YS)", "↑↓ ↑ ↑", "↑ ↑", "4×(−0.4)+2×(+0.6)", "−0.4", "Fe²⁺ (H₂O)"],
                  ["d⁷ (YS)", "↑↓ ↑↓ ↑", "↑ ↑", "5×(−0.4)+2×(+0.6)", "−0.8", "Co²⁺"],
                  ["d⁸", "↑↓ ↑↓ ↑↓", "↑ ↑", "6×(−0.4)+2×(+0.6)", "−1.2", "Ni²⁺"],
                  ["d⁹", "↑↓ ↑↓ ↑↓", "↑↓ ↑", "6×(−0.4)+3×(+0.6)", "−0.6", "Cu²⁺"],
                  ["d¹⁰", "↑↓ ↑↓ ↑↓", "↑↓ ↑↓", "6×(−0.4)+4×(+0.6)", "0", "Zn²⁺"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-green-400 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-red-400 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-bold text-white">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Misol: [V(H₂O)₆]³⁺ — KMBE hisoblash</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">V³⁺ elektron konfiguratsiyasi:</span>
                <span className="text-yellow-400 font-bold">d²</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">Oktaedrik maydonda joylashishi:</span>
                <span className="text-green-400 font-bold">t₂g² eg⁰</span>
              </div>
              <div className="flex justify-between bg-purple-900/50 rounded-lg p-3">
                <span className="text-purple-200">KMBE = 2 × (−0.4Δo) + 0 × (+0.6Δo)</span>
                <span className="text-yellow-400 font-bold">= −0.8Δo</span>
              </div>
              <div className="flex justify-between bg-green-600/10 border border-green-500/30 rounded-lg p-3">
                <span className="text-green-400 font-bold">Xulosa:</span>
                <span className="text-white">KMBE manfiy → kompleks barqaror</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. KMBE NOL BO'LGAN HOLLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ KMBE = 0 bo'lgan konfiguratsiyalar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">d⁵ (yuqori spin)</h3>
              <p className="text-purple-200 text-sm">t₂g³ eg²</p>
              <p className="text-purple-300 text-sm mt-2">KMBE = 0<br/>Barqarorlik <strong>yo'q</strong></p>
              <p className="text-purple-400 text-xs mt-1">Fe³⁺, Mn²⁺</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">d¹⁰</h3>
              <p className="text-purple-200 text-sm">t₂g⁶ eg⁴</p>
              <p className="text-purple-300 text-sm mt-2">KMBE = 0<br/>To'liq to'lgan</p>
              <p className="text-purple-400 text-xs mt-1">Zn²⁺, Cd²⁺, Hg²⁺</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">d⁰</h3>
              <p className="text-purple-200 text-sm">t₂g⁰ eg⁰</p>
              <p className="text-purple-300 text-sm mt-2">KMBE = 0<br/>Elektron yo'q</p>
              <p className="text-purple-400 text-xs mt-1">Sc³⁺, Ti⁴⁺</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KMBE = Σ(t₂g e⁻)×(−0.4Δo) + Σ(eg e⁻)×(+0.6Δo)</li>
            <li>Eng katta KMBE: <strong className="text-yellow-400">d³ va d⁸ (−1.2Δo)</strong></li>
            <li>KMBE = 0: <strong>d⁰, d⁵ (YS), d¹⁰</strong></li>
            <li>KMBE qancha manfiy bo'lsa — <strong>kompleks shuncha barqaror</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/spektrokimyoviy-qator" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Spektrokimyoviy qator</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/yuqori-quyi-spin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Yuqori va quyi spin →</Link>
        </div>

      </section>
    </main>
  )
}