import Link from "next/link"

export default function FormulaYozish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/nomlanishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📋 Formula yozish qoidalari</h1>
          <p className="text-purple-400 text-sm">Kompleks birikmalar formulasini to'g'ri yozish tartibi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. Asosiy qoida */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Asosiy qoida</h2>
          
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">1️⃣</span>
              <p className="text-purple-200 text-lg">
                Avval <strong className="text-yellow-400">ichki sfera</strong>, keyin tashqi sfera yoziladi. 
                Ichki sfera <strong className="text-yellow-400">kvadrat qavs [ ]</strong> ichida bo'ladi.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-purple-800/30 rounded-xl p-4 text-center font-mono text-lg text-blue-400">
              [FeCl(H₂O)₅]Cl
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 text-center font-mono text-lg text-blue-400">
              [Fe(NH₃)₃(H₂O)₃]Cl₂
            </div>
          </div>
        </div>

        {/* 2. Ichki sferada yozish tartibi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📝 Ichki sferada yozish tartibi</h2>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-green-600/10 border border-green-600/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">✅ To'g'ri</h3>
              <p className="text-purple-200 font-mono">[FeCl(H₂O)₅]Cl</p>
              <p className="text-purple-400 text-sm mt-2">Fe → keyin Cl va H₂O</p>
            </div>
            <div className="flex-1 bg-red-600/10 border border-red-600/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">❌ Noto'g'ri</h3>
              <p className="text-purple-200 font-mono">[ClFe(H₂O)₅]Cl</p>
              <p className="text-purple-400 text-sm mt-2">Ligand markaziy atomdan oldin</p>
            </div>
          </div>
        </div>

        {/* 3. Ligandlar ketma-ketligi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🔤 Ligandlarni yozish ketma-ketligi</h2>
          
          <div className="space-y-3">
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <span className="text-2xl">1️⃣</span>
              <div>
                <h3 className="text-yellow-400 font-bold">Anion ligandlar</h3>
                <p className="text-purple-300">Manfiy zaryadlilar birinchi yoziladi: Cl⁻, Br⁻, CN⁻, OH⁻</p>
              </div>
            </div>
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <span className="text-2xl">2️⃣</span>
              <div>
                <h3 className="text-yellow-400 font-bold">Neytral ligandlar</h3>
                <p className="text-purple-300">Aniondan keyin yoziladi: H₂O, NH₃, CO</p>
              </div>
            </div>
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <span className="text-2xl">3️⃣</span>
              <div>
                <h3 className="text-yellow-400 font-bold">Kation ligandlar</h3>
                <p className="text-purple-300">Musbat zaryadlilar eng oxirida (kam uchraydi)</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 bg-purple-800/30 rounded-xl p-4 text-center font-mono text-lg text-blue-400">
            [Co(NH₃)₄Br(H₂O)](NO₃)₂
          </div>
          <p className="text-purple-400 text-sm text-center mt-2">
            Br⁻ (anion) → NH₃ (neytral) → H₂O (neytral, alfavit)
          </p>
        </div>

        {/* 4. Ambientat ligandlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🔀 Ambientat ligandlarni yozish</h2>
          
          <p className="text-purple-200 mb-6">
            <strong className="text-yellow-400">Ambidentat ligand</strong> — bir nechta donor atomga ega bo'lgan ligand. 
            Donor atomni ko'rsatish uchun uning <strong className="text-yellow-400">ostiga chiziladi</strong>.
          </p>
          
          <div className="space-y-3">
            <div className="bg-purple-800/30 rounded-xl p-4 font-mono text-blue-400">
              [Fe(<u>N</u>CS)(H₂O)₅]SO₄ — N atomi orqali (izotiosianat)
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 font-mono text-blue-400">
              [Fe(NC<u>S</u>)(H₂O)₅]SO₄ — S atomi orqali (tiosianat)
            </div>
          </div>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi/verner" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Verner nazariyasi
          </Link>
          <Link 
            href="/oquv/nomlanishi/iupac" 
            className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 transition-all text-white font-semibold"
          >
            Keyingi: IUPAC qoidalari →
          </Link>
        </div>

      </section>

    </main>
  )
}