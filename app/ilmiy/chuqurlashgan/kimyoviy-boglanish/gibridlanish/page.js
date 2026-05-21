import Link from "next/link"

export default function GibridlanishGeometriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💎 Gibridlanish va geometriya</h1>
          <p className="text-purple-400 text-sm">sp → chiziqli • sp³ → tetraedrik • dsp² → tekis kvadrat • d²sp³ → oktaedrik</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Gibridlanish va geometriya — to'liq jadval</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KS</th>
                <th className="py-3 px-4 text-purple-300">Gibridlanish</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">Burchak</th>
                <th className="py-3 px-4 text-purple-300">Orbitallar</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["2","sp","Chiziqli","180°","s + pz","[Ag(NH₃)₂]⁺","D∞h"],
                  ["3","sp²","Uchburchak","120°","s + px + py","[Cu(CN)₃]²⁻","D₃h"],
                  ["4","sp³","Tetraedrik","109.5°","s + px + py + pz","[Zn(OH)₄]²⁻","Td"],
                  ["4","dsp²","Tekis kvadrat","90°","dx²−y² + s + px + py","[Ni(CN)₄]²⁻","D₄h"],
                  ["5","sp³d","Trigonal bipiramida","90°/120°","s + 3p + dz²","[Fe(CO)₅]","D₃h"],
                  ["5","sp³d","Kvadrat piramida","~90°","s + 3p + dz²","[VO(acac)₂]","C₄v"],
                  ["6","d²sp³","Oktaedrik (ichki)","90°","2d + s + 3p","[Fe(CN)₆]⁴⁻","Oh"],
                  ["6","sp³d²","Oktaedrik (tashqi)","90°","s + 3p + 2d","[Fe(H₂O)₆]²⁺","Oh"],
                  ["7","sp³d³","Pentagonal bipiramida","72°/90°","s + 3p + 3d","[V(CN)₇]⁴⁻","D₅h"],
                  ["8","sp³d⁴","Dodekaedrik","—","s + 3p + 4d","[Mo(CN)₈]⁴⁻","D₂d"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-white">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[4]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[5]}</td>
                    <td className="py-3 px-4">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. d²sp³ vs sp³d² */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 d²sp³ va sp³d² — farqi nimada?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-xl mb-4">d²sp³ (ichki orbital)</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Qaysi d:</strong> (n−1)d — ichki qavat</li>
                <li>• <strong>Ligandlar:</strong> CN⁻, CO, NO₂⁻</li>
                <li>• <strong>Spin:</strong> Quyi spinli</li>
                <li>• <strong>Magnit:</strong> Diamagnit</li>
                <li>• <strong>Misol:</strong> [Fe(CN)₆]⁴⁻ (μeff = 0)</li>
                <li>• <strong>Barqarorlik:</strong> Yuqori</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-4">sp³d² (tashqi orbital)</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Qaysi d:</strong> nd — tashqi qavat</li>
                <li>• <strong>Ligandlar:</strong> F⁻, H₂O, Cl⁻</li>
                <li>• <strong>Spin:</strong> Yuqori spinli</li>
                <li>• <strong>Magnit:</strong> Paramagnit</li>
                <li>• <strong>Misol:</strong> [Fe(H₂O)₆]²⁺ (μeff ≈ 4.90)</li>
                <li>• <strong>Barqarorlik:</strong> Pastroq</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. GEOMETRIYA VA IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Geometriya va izomeriya bog'liqligi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-blue-400 font-bold mb-2">Tetraedrik</h3>
              <p className="text-purple-200 text-sm">Geometrik izomeriya <strong>YO'Q</strong></p>
              <p className="text-purple-300 text-xs mt-2">4 ta uch ekvivalent</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-pink-400 font-bold mb-2">Tekis kvadrat</h3>
              <p className="text-purple-200 text-sm">Sis-trans izomeriya <strong>BOR</strong></p>
              <p className="text-purple-300 text-xs mt-2">MA₂B₂ tipi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <h3 className="text-purple-400 font-bold mb-2">Oktaedrik</h3>
              <p className="text-purple-200 text-sm">Sis-trans + fac-mer <strong>BOR</strong></p>
              <p className="text-purple-300 text-xs mt-2">MA₄B₂ va MA₃B₃</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gibridlanish turi <strong className="text-yellow-400">geometriyani bir xil ma'noda belgilaydi</strong></li>
            <li>d²sp³ — ichki orbital (kuchli maydon, quyi spin)</li>
            <li>sp³d² — tashqi orbital (kuchsiz maydon, yuqori spin)</li>
            <li>Geometriya <strong>geometrik izomeriya mavjudligini</strong> belgilaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/sigma-pi-ligandlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← σ-donor va π-akseptor</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-diagramma" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">MO diagrammasi →</Link>
        </div>

      </section>
    </main>
  )
}