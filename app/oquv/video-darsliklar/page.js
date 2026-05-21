import Link from "next/link"

export default function VideoDarsliklar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🎬 Video darsliklar va Quiz</h1>
          <p className="text-purple-400 text-sm">O'z bilimingizni sinab ko'ring • Premium kontent</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Quiz Test */}
          <Link href="/oquv/video-darsliklar/quiz" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-yellow-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">📝</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">Quiz Test</h2>
            <p className="text-purple-300 mb-4">Kompleks birikmalar bo'yicha bilimingizni sinab ko'ring</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">5 ta mavzu</span>
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">75 ta savol</span>
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Natija darhol</span>
            </div>
            <span className="inline-block bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-sm font-semibold">🆓 Bepul • Hamma uchun ochiq</span>
          </Link>

          {/* Video darsliklar — Premium */}
          <Link href="/oquv/video-darsliklar/videolar" 
            className="group bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center hover:bg-purple-800/60 hover:border-pink-400/50 transition-all transform hover:-translate-y-2 hover:shadow-xl">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🎬</div>
            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">Video darsliklar</h2>
            <p className="text-purple-300 mb-4">Barcha mavzular bo'yicha professional video darsliklar</p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">20+ video</span>
              <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">3D modellar</span>
              <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Sertifikat</span>
            </div>
            <span className="inline-block bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-sm font-semibold">🔒 Premium • Obuna bo'lish</span>
          </Link>

        </div>

        {/* Qo'shimcha ma'lumot */}
        <div className="mt-10 bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📝 Quiz testlar manba asosida tuzilgan • A.M. Nasimov, X.Sh. Tashpulatov — Noorganik kimyoning tanlangan boblari
          </p>
        </div>

      </section>
    </main>
  )
}