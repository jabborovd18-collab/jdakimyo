import Link from "next/link"

export default function AnionKomplekslar() {
  const asosiyMetallar = [
    { belgi: "Pb", element: "Qo'rg'oshin", lotincha: "Plumbum", anion: "plyumbat" },
    { belgi: "Sn", element: "Qalay", lotincha: "Stannum", anion: "stannat" },
    { belgi: "Fe", element: "Temir", lotincha: "Ferrum", anion: "ferrat" },
    { belgi: "Cu", element: "Mis", lotincha: "Cuprum", anion: "kuprat" },
    { belgi: "Au", element: "Oltin", lotincha: "Aurum", anion: "aurat" },
    { belgi: "Zn", element: "Rux", lotincha: "Zincum", anion: "sinkat" },
    { belgi: "Hg", element: "Simob", lotincha: "Hydrargyrum", anion: "merkurat" },
  ]

  const qoshimchaMetallar = [
    { belgi: "Ag", element: "Kumush", lotincha: "Argentum", anion: "argentat" },
    { belgi: "Mn", element: "Marganes", lotincha: "Manganum", anion: "manganat" },
    { belgi: "Co", element: "Kobalt", lotincha: "Cobaltum", anion: "kobaltat" },
    { belgi: "Ni", element: "Nikel", lotincha: "Niccolum", anion: "nikkolat" },
    { belgi: "Cr", element: "Xrom", lotincha: "Chromium", anion: "xromat" },
    { belgi: "Pt", element: "Platina", lotincha: "Platinum", anion: "platinat" },
    { belgi: "Al", element: "Alyuminiy", lotincha: "Aluminium", anion: "alyuminat" },
  ]

  const misollar = [
    { formula: "K₄[Fe(CN)₆]", nomi: "kaliy geksasiyanoferrat(II)", izoh: "Fe → ferrat, KS = 6" },
    { formula: "Na[AuCl₄]", nomi: "natriy tetraxloroaurat(III)", izoh: "Au → aurat, KS = 4" },
    { formula: "K₂[Pb(OH)₆]", nomi: "kaliy geksagidroksoplyumbat(IV)", izoh: "Pb → plyumbat, KS = 6" },
    { formula: "Na₂[Sn(OH)₆]", nomi: "natriy geksagidroksostannat(IV)", izoh: "Sn → stannat, KS = 6" },
    { formula: "K₂[Zn(CN)₄]", nomi: "kaliy tetrasiyanosinkat(II)", izoh: "Zn → sinkat, KS = 4" },
    { formula: "K₂[HgI₄]", nomi: "kaliy tetraiodomerkurat(II)", izoh: "Hg → merkurat, KS = 4" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/nomlanishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">⚛️ Anion komplekslar markazi</h1>
          <p className="text-purple-400 text-sm">5.4-jadval • Lotincha nomlar asosida</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. Asosiy qoida */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📜 Asosiy qoida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg">
              <strong className="text-yellow-400">Anion komplekslarda</strong> markaziy atom (ion) nomiga 
              <strong className="text-yellow-400"> &quot;at&quot; qo&apos;shimchasi</strong> qo&apos;shiladi. 
              Lotincha nom ildizi + &quot;at&quot; = anion kompleks nomi.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-green-600/10 border border-green-600/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Kation kompleks</h3>
              <p className="font-mono text-green-300">[Cu(NH₃)₄]SO₄</p>
              <p className="text-purple-300 text-sm mt-2">tetraammin<b>mis</b>(II) sulfat</p>
              <p className="text-purple-400 text-xs mt-1">&quot;mis&quot; — o&apos;zgarmaydi</p>
            </div>
            <div className="flex-1 bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">Anion kompleks</h3>
              <p className="font-mono text-purple-300">K₂[CuCl₄]</p>
              <p className="text-purple-200 text-sm mt-2">kaliy tetraxloro<b>kuprat</b>(II)</p>
              <p className="text-purple-400 text-xs mt-1">&quot;kuprat&quot; — &quot;at&quot; qo&apos;shilgan</p>
            </div>
          </div>
        </div>

        {/* 2. Asosiy metallar jadvali */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📊 Asosiy metallar (5.4-jadval)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Belgi</th>
                  <th className="py-3 px-4 text-purple-300">Element</th>
                  <th className="py-3 px-4 text-purple-300">Lotincha</th>
                  <th className="py-3 px-4 text-purple-300">Anion kompleksda</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {asosiyMetallar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400 font-bold text-lg">{m.belgi}</td>
                    <td className="py-3 px-4">{m.element}</td>
                    <td className="py-3 px-4 text-purple-400 italic">{m.lotincha}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold text-lg">{m.anion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Qo'shimcha metallar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Qo&apos;shimcha metallar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Belgi</th>
                  <th className="py-3 px-4 text-purple-300">Element</th>
                  <th className="py-3 px-4 text-purple-300">Lotincha</th>
                  <th className="py-3 px-4 text-purple-300">Anion kompleksda</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {qoshimchaMetallar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400 font-bold">{m.belgi}</td>
                    <td className="py-3 px-4">{m.element}</td>
                    <td className="py-3 px-4 text-purple-400 italic">{m.lotincha}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{m.anion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Amaliy misollar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✍️ Amaliy misollar</h2>
          
          <div className="space-y-4">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 hover:border-purple-500/50 transition-all">
                <div className="font-mono text-lg text-purple-300 mb-2">{m.formula}</div>
                <div className="text-yellow-400 font-semibold mb-1">→ {m.nomi}</div>
                <div className="text-purple-400 text-sm">{m.izoh}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Yodda saqlang */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6">
          <h3 className="text-yellow-400 font-bold text-lg mb-2">💡 Yodda saqlang!</h3>
          <p className="text-purple-200">
            <strong>Lotincha nom ildizi + &quot;at&quot; = anion kompleks nomi.</strong><br/>
            Fe → Ferr + at = <strong className="text-yellow-400">ferrat</strong><br/>
            Cu → Cupr + at = <strong className="text-yellow-400">kuprat</strong><br/>
            Pb → Plumb + at = <strong className="text-yellow-400">plyumbat</strong>
          </p>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi/ligandlar" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Ligandlar nomlanishi
          </Link>
          <Link 
            href="/oquv/nomlanishi" 
            className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 transition-all text-white font-semibold"
          >
            Nomlanishi bo&apos;limi →
          </Link>
        </div>

      </section>

    </main>
  )
}