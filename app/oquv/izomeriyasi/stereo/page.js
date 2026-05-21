import Link from "next/link"

export default function StereoIzomeriya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 Stereoizomeriya</h1>
          <p className="text-purple-400 text-sm">Formula bir xil, fazoda farqli • Geometrik va optik izomeriya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Stereoizomeriya haqida</h2>
          <p className="text-purple-200 leading-relaxed">
            <strong className="text-yellow-400">Stereoizomeriya</strong> — moddalarning formulasi bir xil yozilsada, 
            ligandlarning fazoda joylashishi har xil bo'lgan izomeriya turi. 
            2 ta asosiy turga bo'linadi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/oquv/izomeriyasi/stereo/geometrik" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-blue-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📐</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Geometrik izomeriya</h2>
            <p className="text-purple-300 mb-4">Sis-trans • Fac-mer • Tekis kvadrat va oktaedrik komplekslarda</p>
            <span className="inline-block bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">Sisplatin — eng mashhur misol</span>
          </Link>

          <Link href="/oquv/izomeriyasi/stereo/optik" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-green-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Optik izomeriya</h2>
            <p className="text-purple-300 mb-4">Enantiomerlar • Xirallik • Qutblangan nur burilishi</p>
            <span className="inline-block bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">Polyarimetr bilan aniqlanadi</span>
          </Link>
        </div>

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.4-bo'lim)</p>
        </div>

      </section>
    </main>
  )
}