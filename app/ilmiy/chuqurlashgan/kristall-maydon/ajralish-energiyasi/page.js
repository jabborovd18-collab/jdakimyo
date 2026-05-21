import Link from "next/link"

export default function AjralishEnergiyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📊 Δo — ajralish energiyasi</h1>
          <p className="text-purple-400 text-sm">Δo qiymatiga ta'sir qiluvchi omillar • Δtet = (4/9)Δokt</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Δo haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Δo (kristall maydon ajralish energiyasi)</strong> — 
              oktaedrik maydonda t₂g va eg orbitallar orasidagi <strong>energiya farqi</strong>.
              Δo qiymati kompleksning <strong>rangi, magnit xossasi va barqarorligini</strong> belgilaydi.
              Δo qancha katta bo'lsa, kompleks shuncha barqaror va quyi spinli bo'lish ehtimoli yuqori.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Δo nima?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Δo = E(eg) − E(t₂g)</li>
                <li>• Birligi: <strong>kJ/mol yoki cm⁻¹</strong></li>
                <li>• 1 kJ/mol ≈ 83.6 cm⁻¹</li>
                <li>• Odatda: <strong>100-400 kJ/mol</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday o'lchanadi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>UB-Vis spektroskopiya</strong> orqali</li>
                <li>• d-d o'tish energiyasidan</li>
                <li>• Δo = h·c/λ<sub>max</sub></li>
                <li>• Plank tenglamasi asosida</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. TA'SIR QILUVCHI OMILLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Δo ga ta'sir qiluvchi 3 ta asosiy omil</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-blue-400 font-bold text-xl mb-3">1. Metall ionining zaryadi</h3>
              <p className="text-purple-200 text-sm mb-3">
                Zaryad qancha <strong>katta</strong> bo'lsa, ligandlar metallga shuncha yaqin tortiladi → <strong>Δo katta</strong>.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">[Co(H₂O)₆]²⁺</p>
                  <p className="text-yellow-400 font-bold">Δo ≈ 111 kJ/mol</p>
                  <p className="text-purple-400 text-xs">Co²⁺ — kichik zaryad</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">[Co(H₂O)₆]³⁺</p>
                  <p className="text-yellow-400 font-bold">Δo ≈ 222 kJ/mol</p>
                  <p className="text-purple-400 text-xs">Co³⁺ — katta zaryad (2×)</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-xl mb-3">2. Metallning davri (3d → 4d → 5d)</h3>
              <p className="text-purple-200 text-sm mb-3">
                Davr ortishi bilan orbitallar <strong>kengayadi</strong> → ligandlar bilan ta'sir kuchayadi → <strong>Δo katta</strong>.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">3d metall</p>
                  <p className="text-yellow-400 font-bold">Δo: 100-250</p>
                  <p className="text-purple-400 text-xs">kJ/mol</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">4d metall</p>
                  <p className="text-yellow-400 font-bold">Δo: 200-350</p>
                  <p className="text-purple-400 text-xs">kJ/mol</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">5d metall</p>
                  <p className="text-yellow-400 font-bold">Δo: 300-500</p>
                  <p className="text-purple-400 text-xs">kJ/mol</p>
                </div>
              </div>
              <p className="text-purple-300 text-xs mt-3">
                Shuning uchun 4d va 5d metallar <strong>deyarli har doim quyi spinli</strong>.
              </p>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-3">3. Ligand tabiati (spektrokimyoviy qator)</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ligand qancha <strong>kuchli maydonli</strong> bo'lsa, Δo shuncha katta.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">[Fe(H₂O)₆]²⁺</p>
                  <p className="text-yellow-400 font-bold">Δo ≈ 124 kJ/mol</p>
                  <p className="text-purple-400 text-xs">H₂O — kuchsiz maydon</p>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-purple-300">[Fe(CN)₆]⁴⁻</p>
                  <p className="text-yellow-400 font-bold">Δo ≈ 394 kJ/mol</p>
                  <p className="text-purple-400 text-xs">CN⁻ — kuchli maydon (3×)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TETRAEDRIK AJRALISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 Δtet — tetraedrik ajralish energiyasi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 text-center mb-6">
            <p className="text-3xl font-extrabold text-yellow-400">Δtet = (4/9) × Δokt</p>
            <p className="text-purple-300 text-sm mt-2">Tetraedrik ajralish oktaedrik ajralishning yarmidan kam</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Sababi:</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Tetraedrikda <strong>4 ta ligand</strong> (oktaedrikda 6 ta)</li>
                <li>• Ligandlar d-orbitallarga <strong>to'g'ridan-to'g'ri qaramaydi</strong></li>
                <li>• Itarilish kuchlari <strong>kuchsizroq</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Natijasi:</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Tetraedrik komplekslar <strong>deyarli har doim yuqori spinli</strong></li>
                <li>• Δtet doimo <strong>juftlashish energiyasidan kichik</strong></li>
                <li>• Rang intensivroq (Laporta qoidasi ta'qiqlamaydi)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Δo = E(eg) − E(t₂g) — <strong className="text-yellow-400">UB-Vis orqali o'lchanadi</strong></li>
            <li>3 ta omil: <strong>metall zaryadi, davri, ligand kuchi</strong></li>
            <li>Δtet = (4/9)Δokt — <strong>tetraedrik komplekslar yuqori spinli</strong></li>
            <li>Δo oshishi bilan <strong>quyi spin ehtimoli ortadi</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/d-orbital-ajralishi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← d-orbital ajralishi</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/spektrokimyoviy-qator" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Spektrokimyoviy qator →</Link>
        </div>

      </section>
    </main>
  )
}