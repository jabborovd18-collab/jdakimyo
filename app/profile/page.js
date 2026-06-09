import Link from "next/link"

export default function Profile() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/" className="text-purple-400 hover:text-purple-300 text-lg">← Bosh sahifa</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">👤 Profil</h1>
          <p className="text-purple-400 text-sm">Shaxsiy ma'lumotlaringiz</p>
        </div>
      </header>

      <section className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 border-4 border-purple-400">
            U
          </div>
          <h2 className="text-2xl font-bold text-white">Foydalanuvchi</h2>
          <p className="text-purple-300 mt-1">Profilingiz hozircha soddalashtirilgan</p>
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📊 Faollik</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Izohlar</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Saqlangan</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5">
              <div className="text-3xl font-bold text-yellow-400">0</div>
              <div className="text-purple-400 text-sm">Testlar</div>
            </div>
          </div>
        </div>

      </section>
    </main>
  )
}