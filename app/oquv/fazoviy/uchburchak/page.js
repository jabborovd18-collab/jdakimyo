import Link from "next/link"

export default function Uchburchak() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 Uchburchak geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 3 • sp² gibridlanish • Valent burchak: 120° • Simmetriya: D₃h</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link 
            href="/oquv/fazoviy/uchburchak/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-green-600/30"
          >
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-green-200">[Cu(CN)₃]²⁻ — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 3</li>
                <li>• <strong>Gibridlanish:</strong> sp²</li>
                <li>• <strong>Valent burchak:</strong> 120°</li>
                <li>• <strong>Simmetriya:</strong> D₃h</li>
                <li>• <strong>Shakl:</strong> Tekis uchburchak</li>
                <li>• <strong>Strukturasi:</strong> Barcha 3 ta ligand bir tekislikda</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + p<sub>x</sub> + p<sub>y</sub> → <strong className="text-yellow-400">3 ta sp² gibrid orbital</strong></p>
                <p className="text-purple-300 text-sm">p<sub>z</sub> — gibridlanmagan, π-bog'lar uchun</p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Gibrid orbitallar bir tekislikda, <strong className="text-yellow-400">120°</strong> burchak ostida joylashgan.</p>
            </div>
          </div>
        </div>

        {/* 2. XARAKTERLI IONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar va xarakterli ionlar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Uchburchak komplekslar <strong className="text-yellow-400">KS = 3</strong> uchun xarakterli. 
            Bu nisbatan kam uchraydigan geometriya bo'lib, asosan d¹⁰ konfiguratsiyali ionlar (Cu⁺, Ag⁺, Au⁺, Hg²⁺) 
            va ba'zi katta ligandlar bilan hosil bo'ladi.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Markaziy ion</th>
                  <th className="py-3 px-4 text-purple-300">Ligandlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[Cu(CN)₃]²⁻", n: "trisiyanokuprat(I) ioni", ion: "Cu⁺ (d¹⁰)", lig: "3 × CN⁻" },
                  { f: "[HgI₃]⁻", n: "triiodomerkurat(II) ioni", ion: "Hg²⁺ (d¹⁰)", lig: "3 × I⁻" },
                  { f: "[Ag(PR₃)₃]⁺", n: "tris(fosfin)kumush(I) ioni", ion: "Ag⁺ (d¹⁰)", lig: "3 × PR₃" },
                  { f: "[AuCl₃]", n: "trixloroaurat(III)", ion: "Au³⁺ (d⁸)", lig: "3 × Cl⁻" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-green-400">{m.f}</td>
                    <td className="py-3 px-4">{m.n}</td>
                    <td className="py-3 px-4 text-yellow-400">{m.ion}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{m.lig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. XUSUSIYATLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Muhim xususiyatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Strukturasi</h3>
              <p className="text-purple-200 text-sm">
                Barcha 3 ta ligand bir tekislikda joylashgan. Molekula yassi tuzilishga ega. 
                p<sub>z</sub> orbital π-bog'lanish uchun qatnashishi mumkin.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geometrik izomeriya</h3>
              <p className="text-purple-200 text-sm">
                MA₂B tipidagi komplekslarda geometrik izomeriya kuzatilishi mumkin. 
                Ikkita bir xil ligand yonma-yon yoki qarama-qarshi bo'lishi mumkin emas (hamma joylashuv ekvivalent).
              </p>
            </div>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Uchburchak komplekslar — <strong className="text-yellow-400">KS = 3, sp² gibridlanish</strong></li>
            <li>Valent burchak — <strong>120°</strong></li>
            <li>Barcha 3 ta ligand <strong>bir tekislikda</strong> joylashgan</li>
            <li>Asosan <strong>d¹⁰ konfiguratsiyali</strong> ionlar uchun xarakterli</li>
            <li>Nisbatan <strong>kam uchraydigan</strong> geometriya</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/fazoviy/chiziqli" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Chiziqli
          </Link>
          <Link 
            href="/oquv/fazoviy/tetraedrik" 
            className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 transition-all text-white font-semibold"
          >
            Keyingi: Tetraedrik →
          </Link>
        </div>

      </section>

    </main>
  )
}