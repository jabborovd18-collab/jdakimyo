import Link from "next/link"

export default function Kubsimon() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧊 Kubsimon geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 8 • sp³d³f gibridlanish • Simmetriya: Oh • Aktinoidlar uchun xarakterli</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <div className="text-center">
          <Link href="/oquv/fazoviy/kubsimon/3d" className="inline-flex items-center gap-4 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-cyan-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-cyan-200">[PaF₈]²⁻ — interaktiv</div></div>
          </Link>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kubsimon komplekslar</strong> — markaziy atom kub markazida, 
              8 ta ligand kubning 8 ta uchida joylashgan. Eng yuqori simmetriyali KS = 8 geometriyasi (Oh). 
              Asosan <strong className="text-yellow-400">aktinoidlar</strong> (5f elementlar) uchun xarakterli.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>KS:</strong> 8</li><li>• <strong>Gibridlanish:</strong> sp³d³f</li>
                <li>• <strong>Simmetriya:</strong> Oh (oktaedr bilan bir xil!)</li>
                <li>• <strong>Burchak:</strong> ~70.5° (qo'shni), 180° (qarama-qarshi)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200">s + 3p + 3d + f → <strong className="text-yellow-400">8 ta sp³d³f</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Eng ko'p orbital ishtirok etadigan gibridlanish turi</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misollar</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th></tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-cyan-400">[PaF₈]²⁻</td><td className="py-3 px-4">oktaftoroprotaktinat(V)</td><td className="py-3 px-4 text-yellow-400">Pa⁵⁺ (5f)</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-cyan-400">[UF₈]²⁻</td><td className="py-3 px-4">oktaftorouranat(VI)</td><td className="py-3 px-4 text-yellow-400">U⁶⁺ (5f)</td></tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20"><td className="py-3 px-4 font-mono text-cyan-400">[ThF₈]⁴⁻</td><td className="py-3 px-4">oktaftorotorat(IV)</td><td className="py-3 px-4 text-yellow-400">Th⁴⁺ (5f)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 KS = 8 geometriyalari</h2>
          <div className="space-y-3">
            {[["Kubsimon","Oh","Kub uchlarida","Kam"],["Kvadrat antiprizma","D₄d","Ikkita parallel kvadrat","O'rtacha"],["Dodekaedrik","D₂d","8 ta uchli dodekaedr","Eng ko'p"]].map((r,i)=>(
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex justify-between">
                <span className="text-yellow-400 font-bold">{r[0]}</span><span className="text-purple-300 text-sm">{r[1]}</span><span className="text-purple-400 text-xs">{r[2]}</span><span className="text-purple-400 text-xs">{r[3]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KS = 8, <strong className="text-yellow-400">sp³d³f gibridlanish</strong></li>
            <li>Asosan <strong>aktinoidlar</strong> uchun xarakterli</li>
            <li>Ligandlar orasidagi itarilish katta — <strong>kam uchraydi</strong></li>
            <li>Dodekaedrik shakl energetik jihatdan <strong>qulayroq</strong></li>
            <li>Muhim misol: <strong>[PaF₈]²⁻</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/monoyopiq-prizma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Monoyopiq prizma</Link>
          <Link href="/oquv/fazoviy/dodekaedrik" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Dodekaedrik →</Link>
        </div>

      </section>
    </main>
  )
}