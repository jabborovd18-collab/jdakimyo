import Link from "next/link"

export default function Izomeriyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🔄 Izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalarda izomeriya turlari • 5.4-bo'lim</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-2xl p-8 mb-10">
          <h2 className="text-xl font-bold text-white mb-4">📋 Bu bo'limda nimalarni o'rganasiz?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-200">
            <div className="flex items-start gap-3"><span className="text-green-400 mt-1">✅</span><span>Tuzilish izomeriyasi — 10 ta tur</span></div>
            <div className="flex items-start gap-3"><span className="text-green-400 mt-1">✅</span><span>Stereoizomeriya — geometrik va optik</span></div>
            <div className="flex items-start gap-3"><span className="text-green-400 mt-1">✅</span><span>Sis-trans, fac-mer izomerlar</span></div>
            <div className="flex items-start gap-3"><span className="text-green-400 mt-1">✅</span><span>3D modellar va rasmlar</span></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/oquv/izomeriyasi/tuzilish" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-pink-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🧬</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Tuzilish (struktura) izomeriyasi</h2>
            <p className="text-purple-300">Koordinatsion • Ionlanish • Gidrat • Bog'lanish va boshqalar (10 ta tur)</p>
            <span className="inline-block mt-4 bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs font-semibold">Formula har xil yoziladi</span>
          </Link>

          <Link href="/oquv/izomeriyasi/stereo" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-blue-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🔄</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Stereoizomeriya</h2>
            <p className="text-purple-300">Geometrik (sis-trans, fac-mer) • Optik izomeriya (enantiomerlar)</p>
            <span className="inline-block mt-4 bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">Formula bir xil, fazoda farqli</span>
          </Link>
        </div>

        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">📚 Manba: A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari (5.4-bo'lim)</p>
        </div>

      </section>
    </main>
  )
}