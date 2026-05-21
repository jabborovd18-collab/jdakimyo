import Link from "next/link"

export default function ZaryadBoyicha() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⚡ Kompleks zaryadiga ko'ra</h1>
          <p className="text-purple-400 text-sm">Kation • Anion • Neytral komplekslar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks birikmalarning zaryadiga ko'ra bo'linishi</h2>
          
          <p className="text-purple-200 leading-relaxed mb-6">
            Kompleks birikmalar <strong className="text-yellow-400">ichki sferaning umumiy zaryadiga</strong> ko'ra 
            3 ta turga bo'linadi. Ichki sfera zaryadi markaziy ion zaryadi va ligandlar 
            zaryadlarining algebraik yig'indisiga teng.
          </p>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-center font-mono">
              <strong className="text-yellow-400">Ichki sfera zaryadi = Markaziy ion zaryadi + Ligandlar zaryadlari yig'indisi</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/oquv/klassifikatsiyasi/zaryad/kation" 
              className="bg-purple-800/30 rounded-xl p-6 border border-blue-500/30 hover:bg-purple-800/60 hover:border-blue-400/50 transition-all transform hover:-translate-y-1 text-center group"
            >
              <div className="text-4xl mb-3">➕</div>
              <h3 className="text-xl font-bold text-blue-400 group-hover:text-blue-300 mb-2">Kation komplekslar</h3>
              <p className="text-purple-300 text-sm">Ichki sfera musbat zaryadli. Tashqi sferada anionlar.</p>
            </Link>
            
            <Link 
              href="/oquv/klassifikatsiyasi/zaryad/anion" 
              className="bg-purple-800/30 rounded-xl p-6 border border-red-500/30 hover:bg-purple-800/60 hover:border-red-400/50 transition-all transform hover:-translate-y-1 text-center group"
            >
              <div className="text-4xl mb-3">➖</div>
              <h3 className="text-xl font-bold text-red-400 group-hover:text-red-300 mb-2">Anion komplekslar</h3>
              <p className="text-purple-300 text-sm">Ichki sfera manfiy zaryadli. Tashqi sferada kationlar.</p>
            </Link>
            
            <Link 
              href="/oquv/klassifikatsiyasi/zaryad/neytral" 
              className="bg-purple-800/30 rounded-xl p-6 border border-green-500/30 hover:bg-purple-800/60 hover:border-green-400/50 transition-all transform hover:-translate-y-1 text-center group"
            >
              <div className="text-4xl mb-3">⭕</div>
              <h3 className="text-xl font-bold text-green-400 group-hover:text-green-300 mb-2">Neytral komplekslar</h3>
              <p className="text-purple-300 text-sm">Ichki sfera zaryadsiz. Tashqi sfera yo'q.</p>
            </Link>
          </div>
        </div>

        {/* 2. ZARYAD HISOBLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Ichki sfera zaryadini hisoblash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Ichki sfera zaryadini aniqlash uchun markaziy ion zaryadi va barcha ligandlar zaryadlari 
            yig'indisi hisoblanadi. Neytral ligandlar (H₂O, NH₃, CO) zaryadi <strong>0</strong> ga teng.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Misol 1</h3>
              <p className="text-purple-200">
                [Co(NH₃)₆]³⁺ — Co (+3) + 6×NH₃ (0) = <strong className="text-blue-400">+3</strong> → Kation kompleks
              </p>
            </div>
            
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Misol 2</h3>
              <p className="text-purple-200">
                [Fe(CN)₆]⁴⁻ — Fe (+2) + 6×CN⁻ (-6) = <strong className="text-red-400">-4</strong> → Anion kompleks
              </p>
            </div>
            
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Misol 3</h3>
              <p className="text-purple-200">
                [Co(NH₃)₃Cl₃] — Co (+3) + 3×NH₃ (0) + 3×Cl⁻ (-3) = <strong className="text-green-400">0</strong> → Neytral kompleks
              </p>
            </div>
          </div>
        </div>

        {/* 3. TAQQOSLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Uchala turni taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Xususiyat</th>
                  <th className="py-3 px-4 text-purple-300 text-blue-400">Kation</th>
                  <th className="py-3 px-4 text-purple-300 text-red-400">Anion</th>
                  <th className="py-3 px-4 text-purple-300 text-green-400">Neytral</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Ichki sfera zaryadi</td>
                  <td className="py-3 px-4 text-blue-400">Musbat (+)</td>
                  <td className="py-3 px-4 text-red-400">Manfiy (-)</td>
                  <td className="py-3 px-4 text-green-400">Nol (0)</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Tashqi sfera</td>
                  <td className="py-3 px-4">Anionlar</td>
                  <td className="py-3 px-4">Kationlar</td>
                  <td className="py-3 px-4">Yo'q</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-semibold">Markaziy atom nomi</td>
                  <td className="py-3 px-4">O'zgarmaydi</td>
                  <td className="py-3 px-4">&quot;at&quot; qo'shiladi</td>
                  <td className="py-3 px-4">O'zgarmaydi</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Suvda dissotsilanish</td>
                  <td className="py-3 px-4">Ha</td>
                  <td className="py-3 px-4">Ha</td>
                  <td className="py-3 px-4">Yo'q</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pastki ma'lumot */}
        <div className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-700/50 rounded-2xl p-6 text-center">
          <p className="text-purple-300 text-sm">
            📚 Har bir tur haqida batafsil ma'lumot olish uchun yuqoridagi tugmalarni bosing
          </p>
        </div>

      </section>

    </main>
  )
}