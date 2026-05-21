import Link from "next/link"

export default function KvantSonlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 Kvant sonlar</h1>
          <p className="text-purple-400 text-sm">n, l, mₗ, mₛ — 4 ta kvant son • d-orbitallar uchun qiymatlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kvant sonlar haqida</h2>
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kvant sonlar</strong> — atomdagi har bir elektronning holatini 
              to'liq tavsiflovchi 4 ta son. Shredinger tenglamasini yechish natijasida kelib chiqadi.
              Kompleks birikmalarda <strong className="text-yellow-400">d-orbitallar</strong> asosiy rol o'ynagani uchun,
              aynan d-elektronlar uchun kvant sonlar muhim ahamiyatga ega.
            </p>
          </div>
        </div>

        {/* 2. BOSH KVANT SON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">1️⃣ Bosh kvant son (n)</h2>
          <p className="text-green-400 font-semibold text-lg mb-6">Energiya qavatini belgilaydi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Qiymatlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• n = <strong>1, 2, 3, 4, 5, 6, 7</strong></li>
                <li>• n qancha katta bo'lsa, elektron yadrodan <strong>shuncha uzoq</strong></li>
                <li>• n qancha katta bo'lsa, <strong>energiya shuncha yuqori</strong></li>
                <li>• Qavatlar: K (n=1), L (n=2), M (n=3), N (n=4)...</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Komplekslar uchun</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>3d metallar:</strong> n = 3 (Fe, Co, Ni, Cu, Zn)</li>
                <li>• <strong>4d metallar:</strong> n = 4 (Ru, Rh, Pd, Ag, Cd)</li>
                <li>• <strong>5d metallar:</strong> n = 5 (Os, Ir, Pt, Au, Hg)</li>
                <li>• n ortishi bilan <strong>ion radiusi ortadi</strong> — KS ortishi mumkin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. ORBITAL KVANT SON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">2️⃣ Orbital kvant son (l)</h2>
          <p className="text-green-400 font-semibold text-lg mb-6">Orbital shaklini belgilaydi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Qiymatlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• l = <strong>0, 1, 2, ... (n−1)</strong></li>
                <li>• l = 0 → <strong>s-orbital</strong> (sharsimon)</li>
                <li>• l = 1 → <strong>p-orbital</strong> (gantelsimon)</li>
                <li>• l = 2 → <strong className="text-yellow-400">d-orbital</strong> (murakkab) ⭐</li>
                <li>• l = 3 → <strong>f-orbital</strong> (juda murakkab)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">d-orbitallar uchun</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• l = 2 — <strong>faqat d-orbitallar</strong></li>
                <li>• 3d uchun: n=3, l=2</li>
                <li>• 4d uchun: n=4, l=2</li>
                <li>• 5d uchun: n=5, l=2</li>
                <li>• d-orbitallar — komplekslarning <strong>asosiy orbitallari</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. MAGNIT KVANT SON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">3️⃣ Magnit kvant son (mₗ)</h2>
          <p className="text-green-400 font-semibold text-lg mb-6">Orbitalning fazoviy yo'nalishini belgilaydi</p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">d-orbitallar uchun mₗ qiymatlari (l=2):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">mₗ</th><th className="py-3 px-4 text-purple-300">Orbital</th><th className="py-3 px-4 text-purple-300">Yo'nalishi</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["−2", "d<sub>xy</sub>", "x va y o'qlari orasida (45°)"],
                    ["−1", "d<sub>yz</sub>", "y va z o'qlari orasida"],
                    ["0", "d<sub>z²</sub>", "z o'qi bo'ylab + halqa"],
                    ["+1", "d<sub>xz</sub>", "x va z o'qlari orasida"],
                    ["+2", "d<sub>x²−y²</sub>", "x va y o'qlarida"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                      <td className="py-3 px-4 font-mono text-green-400" dangerouslySetInnerHTML={{__html: r[1]}}></td>
                      <td className="py-3 px-4 text-sm">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-300 text-sm">
              <strong>✅ Muhim:</strong> Erkin ionda 5 ta d-orbital bir xil energiyaga ega (degenerat). 
              Lekin ligand maydonida ularning energiyasi <strong>har xil bo'ladi</strong> — 
              bu kristall maydon nazariyasining asosidir!
            </p>
          </div>
        </div>

        {/* 5. SPIN KVANT SON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">4️⃣ Spin kvant son (mₛ)</h2>
          <p className="text-green-400 font-semibold text-lg mb-6">Elektronning xususiy harakat momenti</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Qiymatlari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• mₛ = <strong>+½ (↑)</strong> yoki <strong>−½ (↓)</strong></li>
                <li>• Har bir orbitalda <strong>ko'pi bilan 2 ta elektron</strong></li>
                <li>• <strong>Pauli prinsipi:</strong> bir atomda 4 ta kvant soni bir xil bo'lgan 2 ta elektron bo'lmaydi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Komplekslar uchun ahamiyati</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Yuqori spin:</strong> elektronlar juftlashmaydi (ko'p toq e⁻)</li>
                <li>• <strong>Quyi spin:</strong> elektronlar juftlashadi (kam toq e⁻)</li>
                <li>• <strong>Magnit momenti</strong> aynan spin hisobiga</li>
                <li>• μeff = √n(n+2) — spin-only formula</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 3d metallar uchun kvant sonlar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Element</th><th className="py-3 px-4 text-purple-300">Ion</th><th className="py-3 px-4 text-purple-300">dⁿ</th><th className="py-3 px-4 text-purple-300">n</th><th className="py-3 px-4 text-purple-300">l</th><th className="py-3 px-4 text-purple-300">mₗ</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ti", "Ti³⁺", "d¹", "3", "2", "−2...+2"],
                  ["V", "V³⁺", "d²", "3", "2", "−2...+2"],
                  ["Cr", "Cr³⁺", "d³", "3", "2", "−2...+2"],
                  ["Mn", "Mn²⁺", "d⁵", "3", "2", "−2...+2"],
                  ["Fe", "Fe²⁺/Fe³⁺", "d⁶/d⁵", "3", "2", "−2...+2"],
                  ["Co", "Co²⁺/Co³⁺", "d⁷/d⁶", "3", "2", "−2...+2"],
                  ["Ni", "Ni²⁺", "d⁸", "3", "2", "−2...+2"],
                  ["Cu", "Cu²⁺", "d⁹", "3", "2", "−2...+2"],
                  ["Zn", "Zn²⁺", "d¹⁰", "3", "2", "−2...+2"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    {r.map((c, j) => (
                      <td key={j} className={`py-3 px-4 ${j===2 ? "text-yellow-400 font-bold" : ""} text-sm`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>4 ta kvant son (n, l, mₗ, mₛ) — <strong className="text-yellow-400">elektron holatini to'liq tavsiflaydi</strong></li>
            <li>d-orbitallar uchun: <strong>n ≥ 3, l = 2, mₗ = −2...+2</strong></li>
            <li>3d, 4d, 5d metallar — hammasida l = 2 (faqat n farq qiladi)</li>
            <li>Spin kvant soni — <strong>yuqori/quyi spin va magnit xossalarini</strong> belgilaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/modellar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Atom modellari</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">d-orbital shakli →</Link>
        </div>

      </section>
    </main>
  )
}