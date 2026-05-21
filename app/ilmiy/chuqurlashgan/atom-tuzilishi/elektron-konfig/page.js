import Link from "next/link"

export default function ElektronKonfiguratsiyalar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 d-elektron konfiguratsiyalar</h1>
          <p className="text-purple-400 text-sm">d¹ dan d¹⁰ gacha • Xund qoidasi • Yuqori va quyi spin • Pauli prinsipi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY QOIDALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Elektronlarning orbitallarga joylashish qoidalari</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">1. Pauli prinsipi</h3>
              <p className="text-purple-200 text-sm">Bir atomda <strong>4 ta kvant soni bir xil</strong> bo'lgan ikkita elektron bo'lishi mumkin emas. Har bir orbitalda ko'pi bilan <strong>2 ta elektron</strong> (↑↓) bo'ladi.</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">2. Xund qoidasi</h3>
              <p className="text-purple-200 text-sm">Elektronlar bir xil energiyali orbitallarga avval <strong>bir xil spin bilan, juftlashmagan holda</strong> joylashadi. Juftlashish faqat barcha orbitallar yarim to'lgandan keyin boshlanadi.</p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">3. Energiya minimumi prinsipi</h3>
              <p className="text-purple-200 text-sm">Elektronlar avval <strong>eng past energiyali</strong> orbitallarni to'ldiradi. Oktaedrik maydonda: avval t₂g, keyin eg.</p>
            </div>
          </div>
        </div>

        {/* 2. YUQORI VA QUYI SPIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Yuqori spin vs Quyi spin</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-3">Yuqori spinli</h3>
              <p className="text-purple-200 mb-3"><strong>Δo &lt; P</strong> (juftlashish energiyasidan kichik)</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Elektronlar juftlashmaydi</li>
                <li>• Avval t₂g, keyin eg to'ladi</li>
                <li>• <strong>Ko'proq toq elektronlar</strong></li>
                <li>• Paramagnit</li>
                <li>• Kuchsiz maydonli ligandlar</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-xl mb-3">Quyi spinli</h3>
              <p className="text-purple-200 mb-3"><strong>Δo &gt; P</strong> (juftlashish energiyasidan katta)</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Elektronlar juftlashadi</li>
                <li>• t₂g to'liq to'lguncha eg bo'sh</li>
                <li>• <strong>Kamroq toq elektronlar</strong></li>
                <li>• Diamagnit yoki kam paramagnit</li>
                <li>• Kuchli maydonli ligandlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. d¹-d¹⁰ JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Oktaedrik maydonda d¹−d¹⁰ konfiguratsiyalar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">dⁿ</th>
                <th className="py-3 px-4 text-purple-300">t₂g</th>
                <th className="py-3 px-4 text-purple-300">eg</th>
                <th className="py-3 px-4 text-purple-300">Toq e⁻</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "↑", "—", "1", "Ti³⁺", "Faqat bitta konfiguratsiya"],
                  ["d²", "↑ ↑", "—", "2", "V³⁺", "Xund bo'yicha parallel spin"],
                  ["d³", "↑ ↑ ↑", "—", "3", "Cr³⁺", "t₂g yarim to'lgan"],
                  ["d⁴ (YS)", "↑ ↑ ↑", "↑", "4", "Cr²⁺", "Δo kichik — eg ga chiqadi"],
                  ["d⁴ (QS)", "↑↓ ↑ ↑", "—", "2", "Cr²⁺ (CN⁻)", "Δo katta — juftlashadi"],
                  ["d⁵ (YS)", "↑ ↑ ↑", "↑ ↑", "5", "Fe³⁺, Mn²⁺", "Maksimal toq elektron"],
                  ["d⁵ (QS)", "↑↓ ↑↓ ↑", "—", "1", "Fe³⁺ (CN⁻)", "Kuchli maydon — quyi spin"],
                  ["d⁶ (YS)", "↑↓ ↑ ↑", "↑ ↑", "4", "Fe²⁺ (H₂O)", "Kuchsiz maydon"],
                  ["d⁶ (QS)", "↑↓ ↑↓ ↑↓", "—", "0", "Fe²⁺ (CN⁻)", "Diamagnit!"],
                  ["d⁷ (YS)", "↑↓ ↑↓ ↑", "↑ ↑", "3", "Co²⁺", "Kuchsiz maydon"],
                  ["d⁷ (QS)", "↑↓ ↑↓ ↑↓", "↑", "1", "Co²⁺ (CN⁻)", "Kuchli maydon"],
                  ["d⁸", "↑↓ ↑↓ ↑↓", "↑ ↑", "2", "Ni²⁺", "Faqat bitta konfiguratsiya"],
                  ["d⁹", "↑↓ ↑↓ ↑↓", "↑↓ ↑", "1", "Cu²⁺", "Yan-Teller effekti"],
                  ["d¹⁰", "↑↓ ↑↓ ↑↓", "↑↓ ↑↓", "0", "Zn²⁺", "To'liq to'lgan — diamagnit"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-green-400 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-red-400 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-white">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-xs text-purple-300">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim misol: Fe²⁺ (d⁶)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold mb-3">[Fe(H₂O)₆]²⁺ — yuqori spin</h3>
              <p className="text-purple-200 text-sm mb-2">H₂O — kuchsiz maydon, Δo kichik</p>
              <p className="font-mono text-white text-center mb-2">t₂g⁴ eg²</p>
              <p className="text-purple-200 text-sm">n = 4 ta toq e⁻</p>
              <p className="text-purple-200 text-sm">μeff = 4.90 μB</p>
              <p className="text-green-400 text-sm mt-2">Paramagnit</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold mb-3">[Fe(CN)₆]⁴⁻ — quyi spin</h3>
              <p className="text-purple-200 text-sm mb-2">CN⁻ — kuchli maydon, Δo katta</p>
              <p className="font-mono text-white text-center mb-2">t₂g⁶ eg⁰</p>
              <p className="text-purple-200 text-sm">n = 0 ta toq e⁻</p>
              <p className="text-purple-200 text-sm">μeff = 0 μB</p>
              <p className="text-green-400 text-sm mt-2">Diamagnit — ajoyib farq!</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Elektronlar <strong className="text-yellow-400">Pauli, Xund va energiya minimumi</strong> qoidalari asosida joylashadi</li>
            <li><strong>Yuqori spin:</strong> Δo &lt; P — ko'p toq e⁻, paramagnit</li>
            <li><strong>Quyi spin:</strong> Δo &gt; P — kam toq e⁻, diamagnit</li>
            <li>d⁴−d⁷ konfiguratsiyalarda <strong>har ikkala holat ham</strong> mavjud bo'lishi mumkin</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-energiya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← d-orbital energiyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/metallar" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Kompleks metallar →</Link>
        </div>

      </section>
    </main>
  )
}