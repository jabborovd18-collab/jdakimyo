import Link from "next/link"

export default function DOrbitalAjralishi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📐 d-orbital ajralishi</h1>
          <p className="text-purple-400 text-sm">Oktaedrik, tetraedrik, tekis kvadrat maydonlarda • t₂g va eg orbitallar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/d-orbital-ajralishi/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-purple-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-purple-200">Ajralish sxemasi — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 d-orbital ajralishi haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Erkin metall ionida</strong> barcha 5 ta d-orbital <strong>bir xil energiyaga</strong> ega — degenerat holat.
              Ligandlar yaqinlashganda ularning manfiy zaryadi d-elektronlar bilan <strong>itarishadi</strong>.
              Itarilish kuchi orbitalning fazoviy yo'nalishiga qarab <strong>har xil</strong> bo'lgani uchun orbitallar energetik jihatdan <strong>ajraladi</strong>.
            </p>
          </div>
        </div>

        {/* 2. OKTAEDRIK MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Oktaedrik maydon — eng muhim holat</h2>
          
          <p className="text-purple-200 mb-6">
            6 ta ligand oktaedr uchlarida (±x, ±y, ±z o'qlari bo'ylab) joylashganda,
            <strong className="text-yellow-400"> dx²−y² va dz²</strong> orbitallariga to'g'ridan-to'g'ri yaqinlashadi.
            Shu sababli bu ikki orbitalning energiyasi <strong>ortadi</strong>.
            Qolgan uchta orbital (<strong>dxy, dxz, dyz</strong>) ligandlar yo'nalishida emas — energiyasi <strong>pasayadi</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-3">t₂g — stabillashgan</h3>
              <p className="text-purple-200 mb-3">dxy, dxz, dyz (3 ta orbital)</p>
              <p className="text-3xl font-extrabold text-green-400">−0.4 Δo</p>
              <p className="text-purple-300 text-sm mt-3">Ligandlar yo'nalishida emas<br/>Energiyasi pasayadi</p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 text-center">
              <h3 className="text-red-400 font-bold text-xl mb-3">eg — destabillashgan</h3>
              <p className="text-purple-200 mb-3">dz², dx²−y² (2 ta orbital)</p>
              <p className="text-3xl font-extrabold text-red-400">+0.6 Δo</p>
              <p className="text-purple-300 text-sm mt-3">Ligandlar yo'nalishida<br/>Energiyasi ortadi</p>
            </div>
          </div>
        </div>

        {/* 3. TETRAEDRIK MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 Tetraedrik maydon — teskari ajralish</h2>
          
          <p className="text-purple-200 mb-4">
            Tetraedrik maydonda <strong>hech qaysi ligand to'g'ridan-to'g'ri d-orbitalga qaramaydi</strong>.
            Shuning uchun ajralish <strong>oktaedrikka nisbatan teskari va kuchsizroq</strong> bo'ladi.
          </p>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <p className="text-red-400 font-bold text-lg mb-2">t₂ — destabillashgan (3 ta)</p>
              <p className="text-purple-200 text-sm">dxy, dxz, dyz</p>
              <p className="text-red-400 font-bold text-xl mt-2">+0.4 Δtet</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <p className="text-green-400 font-bold text-lg mb-2">e — stabillashgan (2 ta)</p>
              <p className="text-purple-200 text-sm">dz², dx²−y²</p>
              <p className="text-green-400 font-bold text-xl mt-2">−0.6 Δtet</p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-4 mt-4 text-center">
            <p className="text-white font-bold">Δtet = (4/9) × Δokt</p>
          </div>
        </div>

        {/* 4. TEKIS KVADRAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">◻️ Tekis kvadrat maydon — eng katta ajralish</h2>
          
          <p className="text-purple-200 mb-4">
            4 ta ligand xy tekisligida joylashgan. <strong>dx²−y² orbitali eng yuqori energiyaga</strong> ega.
            Ajralish eng katta — d⁸ konfiguratsiyali komplekslar diamagnit bo'ladi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-center text-sm">
              Energiya ortishi: <strong className="text-green-400">dxz, dyz</strong> &lt; 
              <strong className="text-yellow-400">dz²</strong> &lt; 
              <strong className="text-orange-400">dxy</strong> &lt; 
              <strong className="text-red-400">dx²−y²</strong>
            </p>
          </div>
        </div>

        {/* 5. TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Uchala maydonni taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th><th className="py-3 px-4 text-purple-300 text-purple-400">Oktaedrik</th><th className="py-3 px-4 text-purple-300 text-green-400">Tetraedrik</th><th className="py-3 px-4 text-purple-300 text-pink-400">Tekis kvadrat</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Ligandlar soni</td><td className="py-3 px-4">6</td><td className="py-3 px-4">4</td><td className="py-3 px-4">4</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Stabillashgan</td><td className="py-3 px-4 text-green-400">t₂g (3 ta)</td><td className="py-3 px-4 text-green-400">e (2 ta)</td><td className="py-3 px-4 text-green-400">dxz, dyz</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Destabillashgan</td><td className="py-3 px-4 text-red-400">eg (2 ta)</td><td className="py-3 px-4 text-red-400">t₂ (3 ta)</td><td className="py-3 px-4 text-red-400">dx²−y²</td></tr>
                <tr><td className="py-3 px-4">Ajralish kuchi</td><td className="py-3 px-4">Δo</td><td className="py-3 px-4">(4/9)Δo</td><td className="py-3 px-4">Eng katta</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Erkin ionda 5 ta d-orbital <strong className="text-yellow-400">degenerat</strong> (bir xil energiya)</li>
            <li>Oktaedrik maydon: <strong>t₂g (−0.4Δo) + eg (+0.6Δo)</strong></li>
            <li>Tetraedrik: <strong>teskari ajralish</strong>, Δtet = (4/9)Δokt</li>
            <li>Tekis kvadrat: <strong>eng katta ajralish</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kristall maydon</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/ajralish-energiyasi" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Δo — ajralish energiyasi →</Link>
        </div>

      </section>
    </main>
  )
}