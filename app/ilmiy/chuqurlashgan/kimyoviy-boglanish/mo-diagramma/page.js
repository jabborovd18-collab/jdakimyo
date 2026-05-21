import Link from "next/link"

export default function MODiagramma() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">📊 MO diagrammasi — oktaedrik kompleks</h1>
          <p className="text-purple-400 text-sm">6 ta ligand + metall orbitallari • Bog'lovchi, bo'shashtiruvchi, bog'lamaydigan MO</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-orange-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-orange-200">MO diagrammasi — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oktaedrik kompleks uchun MO diagrammasi</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">MO diagrammasi</strong> — metall va ligand orbitallarining 
              <strong className="text-yellow-400"> simmetriya bo'yicha</strong> o'zaro ta'sirini ko'rsatadi.
              Oktaedrik (Oh) simmetriyada orbitallar <strong className="text-yellow-400">4 xil simmetriya turiga</strong> ajraladi:
              a₁g, t₁u, eg, t₂g. Har bir simmetriya turi faqat o'ziga mos orbitallar bilan ta'sirlashadi.
            </p>
          </div>
        </div>

        {/* 2. SIMMETRIYA JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔤 Simmetriya belgilari va orbitallar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Metall orbitali</th>
                <th className="py-3 px-4 text-purple-300">Ligand orbitali</th>
                <th className="py-3 px-4 text-purple-300">MO turi</th>
                <th className="py-3 px-4 text-purple-300">Energiyasi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["a₁g", "s", "1 ta (SALC)", "Bog'lovchi + Bo'shashtiruvchi", "Eng past / Yuqori"],
                  ["t₁u", "pₓ, pᵧ, p_z", "3 ta (SALC)", "Bog'lovchi + Bo'shashtiruvchi", "Past / Yuqori"],
                  ["eg", "dz², dx²−y²", "2 ta (SALC)", "Bog'lovchi + Bo'shashtiruvchi", "O'rtacha / Yuqori"],
                  ["t₂g", "dxy, dxz, dyz", "— (mos kelmaydi)", "Bog'lamaydigan", "Oraliq"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs text-purple-300">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. MO ENERGIYA DARAJALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 MO energiya darajalari (pastdan yuqoriga)</h2>
          
          <div className="space-y-3">
            {[
              { label: "Bog'lovchi MO (a₁g + t₁u + eg)", count: "6 ta", electrons: "12 ta e⁻ (ligandlardan)", color: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
              { label: "Bog'lamaydigan MO (t₂g)", count: "3 ta", electrons: "d-elektronlar (1-10 ta)", color: "text-gray-400", bg: "bg-gray-600/10 border-gray-500/30" },
              { label: "Bo'shashtiruvchi MO (eg*)", count: "2 ta", electrons: "Odatda bo'sh", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
              { label: "Bo'shashtiruvchi MO (a₁g* + t₁u*)", count: "4 ta", electrons: "Bo'sh", color: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
            ].map((r, i) => (
              <div key={i} className={`${r.bg} rounded-xl p-4`}>
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${r.color}`}>{r.label}</span>
                  <span className="text-purple-200 text-sm">{r.count}</span>
                </div>
                <p className="text-purple-300 text-xs mt-1">Elektronlar: {r.electrons}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misol: [Co(NH₃)₆]³⁺ — MO bo'yicha</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-yellow-400 font-bold mb-2">Elektronlar taqsimoti:</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• Ligandlardan: 6×2 = <strong>12 ta e⁻</strong></li>
                  <li>• Co³⁺ dan: <strong>6 ta d-e⁻</strong></li>
                  <li>• Jami: <strong>18 ta elektron</strong></li>
                </ul>
              </div>
              <div>
                <p className="text-yellow-400 font-bold mb-2">MO larga joylashishi:</p>
                <ul className="text-purple-200 space-y-1">
                  <li>• 12 ta e⁻ → <strong>bog'lovchi MO</strong> (a₁g, t₁u, eg)</li>
                  <li>• 6 ta e⁻ → <strong>t₂g</strong> (bog'lamaydigan)</li>
                  <li>• eg* → <strong>bo'sh</strong></li>
                  <li>• <strong>Diamagnit!</strong> (barcha e⁻ juftlashgan)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 5. σ VA π TA'SIRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 π-bog'lanishning MO diagrammasiga ta'siri</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">π-donor ligand (F⁻, Cl⁻)</h3>
              <p className="text-purple-200 text-sm">
                Ligandning to'lgan π-orbitallari t₂g bilan ta'sirlashadi → 
                <strong>Δo kichiklashadi</strong>. Kuchsiz maydonli ligandlar.
              </p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">π-akseptor ligand (CO, CN⁻)</h3>
              <p className="text-purple-200 text-sm">
                Ligandning bo'sh π*-orbitallari t₂g bilan ta'sirlashadi → 
                <strong>Δo kattalashadi</strong>. Kuchli maydonli ligandlar.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Oktaedrik kompleksda <strong className="text-yellow-400">4 xil simmetriya</strong>: a₁g, t₁u, eg, t₂g</li>
            <li>t₂g — <strong>bog'lamaydigan MO</strong>, metall d-elektronlari shu yerda</li>
            <li>Δo = E(eg*) − E(t₂g) — <strong>π-bog'lanish ta'sirida o'zgaradi</strong></li>
            <li>MO diagrammasi <strong>spektr va magnit xossalarini</strong> to'liq tushuntiradi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/gibridlanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Gibridlanish</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/elektron-qoidasi" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">18 elektron qoidasi →</Link>
        </div>

      </section>
    </main>
  )
}