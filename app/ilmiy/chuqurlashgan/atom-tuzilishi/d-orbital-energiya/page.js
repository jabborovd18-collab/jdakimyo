import Link from "next/link"

export default function DOrbitalEnergiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">⚡ d-orbitallarning energiyasi</h1>
          <p className="text-purple-400 text-sm">Degenerat holat • Oktaedrik, tetraedrik, tekis kvadrat maydonlarda ajralish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ERKIN ION */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Erkin ionda degenerat holat</h2>
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Erkin metall ionida</strong> barcha 5 ta d-orbital 
              <strong className="text-yellow-400"> bir xil energiyaga</strong> ega. Bu holat <strong>degenerat holat</strong> deb ataladi.
              Ligandlar yaqinlashganda bu degeneratlik buziladi — orbitallar energetik jihatdan ajraladi.
              Bu ajralish <strong className="text-yellow-400">kristall maydon nazariyasining</strong> asosidir.
            </p>
          </div>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-purple-200">Erkin ionda: <strong className="text-white">dxy = dxz = dyz = dz² = dx²−y²</strong></p>
            <p className="text-purple-400 text-sm mt-2">Barcha 5 ta orbital — bir xil energiya</p>
          </div>
        </div>

        {/* 2. OKTAEDRIK MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Oktaedrik maydonda ajralish</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Oktaedrik maydon</strong> — eng muhim va eng ko'p uchraydigan holat.
            6 ta ligand oktaedr uchlarida joylashganda, ular <strong>dx²−y² va dz²</strong> orbitallarga to'g'ridan-to'g'ri yaqinlashadi.
            Natijada bu ikki orbitalning energiyasi <strong>ortadi</strong> (destabillashadi).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 text-center">
              <h3 className="text-green-400 font-bold text-xl mb-3">t₂g (stabillashgan)</h3>
              <p className="text-purple-200 mb-2">dxy, dxz, dyz</p>
              <p className="text-2xl font-extrabold text-green-400">−0.4 Δo</p>
              <p className="text-purple-300 text-sm mt-2">Ligandlar yo'nalishida emas</p>
              <p className="text-purple-300 text-sm">Energiyasi <strong>pasayadi</strong></p>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 text-center">
              <h3 className="text-red-400 font-bold text-xl mb-3">eg (destabillashgan)</h3>
              <p className="text-purple-200 mb-2">dz², dx²−y²</p>
              <p className="text-2xl font-extrabold text-red-400">+0.6 Δo</p>
              <p className="text-purple-300 text-sm mt-2">Ligandlar yo'nalishida</p>
              <p className="text-purple-300 text-sm">Energiyasi <strong>ortadi</strong></p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-6 text-center">
            <p className="text-purple-200">Δo = E(eg) − E(t₂g) — <strong className="text-yellow-400">kristall maydon ajralish energiyasi</strong></p>
          </div>
        </div>

        {/* 3. TETRAEDRIK MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 Tetraedrik maydonda ajralish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Tetraedrik maydonda <strong>hech qaysi ligand to'g'ridan-to'g'ri d-orbitalga qaramaydi</strong>.
            Shuning uchun ajralish oktaedrik maydondagiga nisbatan <strong>teskari va kuchsizroq</strong>.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-white font-bold text-center mb-3">Δtet = (4/9) × Δokt</p>
            <p className="text-purple-300 text-sm text-center">Tetraedrik ajralish oktaedrik ajralishning <strong>yarmidan kam</strong></p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 font-bold">t₂ (destabillashgan)</p>
              <p className="text-purple-200 text-sm">dxy, dxz, dyz</p>
              <p className="text-red-400 font-bold text-lg">+0.4 Δtet</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-400 font-bold">e (stabillashgan)</p>
              <p className="text-purple-200 text-sm">dz², dx²−y²</p>
              <p className="text-green-400 font-bold text-lg">−0.6 Δtet</p>
            </div>
          </div>
        </div>

        {/* 4. TEKIS KVADRAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">◻️ Tekis kvadrat maydonda ajralish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Tekis kvadrat maydonda <strong>eng murakkab ajralish</strong> kuzatiladi. 
            4 ta ligand xy tekisligida joylashgan. dx²−y² orbitali <strong>eng yuqori energiyaga</strong> ega.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-center text-sm">
              Energiya ortishi tartibi:<br/>
              <strong className="text-green-400">dxz, dyz</strong> &lt; <strong className="text-yellow-400">dz²</strong> &lt; <strong className="text-orange-400">dxy</strong> &lt; <strong className="text-red-400">dx²−y²</strong>
            </p>
          </div>
        </div>

        {/* 5. TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Uchala maydonni taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th><th className="py-3 px-4 text-purple-300">Oktaedrik</th><th className="py-3 px-4 text-purple-300">Tetraedrik</th><th className="py-3 px-4 text-purple-300">Tekis kvadrat</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Ajralish kuchi</td><td className="py-3 px-4 text-yellow-400">Kuchli (Δo)</td><td className="py-3 px-4">Kuchsiz (4/9 Δo)</td><td className="py-3 px-4 text-red-400">Eng kuchli</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4">Stabillashgan</td><td className="py-3 px-4 text-green-400">t₂g (3 ta)</td><td className="py-3 px-4 text-green-400">e (2 ta)</td><td className="py-3 px-4 text-green-400">dxz, dyz</td></tr>
                <tr><td className="py-3 px-4">Destabillashgan</td><td className="py-3 px-4 text-red-400">eg (2 ta)</td><td className="py-3 px-4 text-red-400">t₂ (3 ta)</td><td className="py-3 px-4 text-red-400">dx²−y²</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Erkin ionda 5 ta d-orbital <strong className="text-yellow-400">degenerat</strong> (bir xil energiya)</li>
            <li>Oktaedrik maydon: <strong>t₂g (−0.4Δo) + eg (+0.6Δo)</strong></li>
            <li>Tetraedrik maydon: <strong>teskari ajralish, Δtet = (4/9)Δokt</strong></li>
            <li>Tekis kvadrat: <strong>eng katta ajralish, dx²−y² eng yuqori</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/d-orbital-shakli" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← d-orbital shakli</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/elektron-konfig" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Elektron konfiguratsiyalar →</Link>
        </div>

      </section>
    </main>
  )
}