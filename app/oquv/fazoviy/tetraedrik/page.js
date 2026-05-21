import Link from "next/link"

export default function Tetraedrik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🔺 Tetraedrik geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 4 • sp³ gibridlanish • Valent burchak: 109.5° • Simmetriya: Td</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/tetraedrik/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-cyan-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-cyan-200">[CoCl₄]²⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 4</li>
                <li>• <strong>Gibridlanish:</strong> sp³</li>
                <li>• <strong>Valent burchak:</strong> 109.5°</li>
                <li>• <strong>Simmetriya:</strong> Td</li>
                <li>• <strong>Shakl:</strong> Tetraedr (4 ta uchburchak yuz)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + p<sub>x</sub> + p<sub>y</sub> + p<sub>z</sub> → <strong className="text-yellow-400">4 ta sp³ gibrid orbital</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Orbitallar <strong className="text-yellow-400">109.5°</strong> burchak ostida tetraedr uchlariga yo'nalgan.</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Rangi</th></tr></thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[Zn(OH)₄]²⁻", n: "tetragidroksosinkat(II)", ion: "Zn²⁺ (d¹⁰)", r: "Rangsiz" },
                  { f: "[Zn(NH₃)₄]²⁺", n: "tetraamminrux(II)", ion: "Zn²⁺ (d¹⁰)", r: "Rangsiz" },
                  { f: "[CoCl₄]²⁻", n: "tetraxlorokobaltat(II)", ion: "Co²⁺ (d⁷)", r: "Ko'k" },
                  { f: "[NiCl₄]²⁻", n: "tetraxloronikkolat(II)", ion: "Ni²⁺ (d⁸)", r: "Sariq-yashil" },
                  { f: "[FeCl₄]⁻", n: "tetraxloroferrat(III)", ion: "Fe³⁺ (d⁵)", r: "Sariq-jigarrang" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-cyan-400">{m.f}</td><td className="py-3 px-4">{m.n}</td><td className="py-3 px-4 text-yellow-400">{m.ion}</td><td className="py-3 px-4">{m.r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Muhim faktlar</h2>
          <div className="space-y-3">
            {[
              "Geometrik izomeriya YO'Q — barcha 4 ta uch ekvivalent",
              "Δtet = (4/9)Δokt — deyarli har doim yuqori spinli",
              "Simmetriya markazi yo'q — Laporta qoidasi ta'qiqlamaydi, rang intensivroq",
              "[NiCl₄]²⁻ tetraedrik (paramagnit), [Ni(CN)₄]²⁻ tekis kvadrat (diamagnit) — ligand kuchi farqi!"
            ].map((f, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-purple-200 text-sm">💡 {f}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 4, <strong className="text-yellow-400">sp³ gibridlanish</strong></li>
            <li>Valent burchak — <strong>109.5°</strong></li>
            <li><strong>Geometrik izomeriya yo'q</strong></li>
            <li>Δtet = (4/9)Δokt — <strong>har doim yuqori spinli</strong></li>
            <li>Tetraedrik ranglari <strong>intensivroq</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/uchburchak" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Uchburchak</Link>
          <Link href="/oquv/fazoviy/tekis-kvadrat" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Tekis kvadrat →</Link>
        </div>

      </section>
    </main>
  )
}