import Link from "next/link"

export default function Gidroksokomplekslar() {
  const misollar = [
    { formula: "Na[Al(OH)₄]", nomi: "natriy tetragidroksoalyuminat", ion: "Al³⁺", ks: "4", izoh: "Bayer usulida alyuminiy olish" },
    { formula: "Na₂[Zn(OH)₄]", nomi: "natriy tetragidroksosinkat", ion: "Zn²⁺", ks: "4", izoh: "Rangsiz eritma" },
    { formula: "Na₂[Sn(OH)₆]", nomi: "natriy geksagidroksostannat(IV)", ion: "Sn⁴⁺", ks: "6", izoh: "Qalay qoplashda" },
    { formula: "K₂[Pb(OH)₆]", nomi: "kaliy geksagidroksoplyumbat(IV)", ion: "Pb⁴⁺", ks: "6", izoh: "Qo'rg'oshin birikmalari" },
    { formula: "Na₃[Cr(OH)₆]", nomi: "natriy geksagidroksoxromat(III)", ion: "Cr³⁺", ks: "6", izoh: "Yashil eritma" },
    { formula: "Na₂[Be(OH)₄]", nomi: "natriy tetragidroksoberillat", ion: "Be²⁺", ks: "4", izoh: "Berilliy kimyosi" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔬 Gidroksokomplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: OH⁻ (gidroksid) • Amfoter metallarning xarakterli komplekslari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Gidroksokomplekslar haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Gidroksokomplekslar</strong> — ligandi 
              <strong className="text-yellow-400"> gidroksid ioni (OH⁻)</strong> bo'lgan kompleks birikmalardir. 
              Ular <strong className="text-yellow-400">amfoter metallar</strong> uchun xarakterli bo'lib, 
              faqat kuchli ishqoriy muhitda barqarordir. Kislota qo'shilsa, darhol parchalanib, 
              metall gidroksidi cho'kmaga tushadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Ligand:</strong> OH⁻ — gidrokso (IUPAC)</li>
                <li>• <strong>Donor atom:</strong> Kislorod (O)</li>
                <li>• <strong>Turi:</strong> Monodentat, anion</li>
                <li>• <strong>Koordinatsion son:</strong> 4 yoki 6</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Amfoter metallar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Al — alyuminiy</li>
                <li>• Zn — rux</li>
                <li>• Cr(III) — xrom</li>
                <li>• Sn(II,IV) — qalay</li>
                <li>• Pb(II,IV) — qo'rg'oshin</li>
                <li>• Be — berilliy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. HOSIL BO'LISH REAKSIYALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Hosil bo'lish reaksiyalari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Alyuminiy gidroksidining erishi</h3>
              <p className="font-mono text-purple-200 text-sm mb-2">
                Al(OH)₃↓ + NaOH → <strong className="text-orange-400">Na[Al(OH)₄]</strong>
              </p>
              <p className="text-purple-300 text-sm">natriy tetragidroksoalyuminat — rangsiz eritma</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Rux gidroksidining erishi</h3>
              <p className="font-mono text-purple-200 text-sm mb-2">
                Zn(OH)₂↓ + 2NaOH → <strong className="text-orange-400">Na₂[Zn(OH)₄]</strong>
              </p>
              <p className="text-purple-300 text-sm">natriy tetragidroksosinkat — rangsiz eritma</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Xrom(III) gidroksidining erishi</h3>
              <p className="font-mono text-purple-200 text-sm mb-2">
                Cr(OH)₃↓ + 3NaOH → <strong className="text-orange-400">Na₃[Cr(OH)₆]</strong>
              </p>
              <p className="text-purple-300 text-sm">natriy geksagidroksoxromat(III) — yashil eritma</p>
            </div>
          </div>

          <div className="mt-4 bg-red-600/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">
              <strong>⚠️ Farqlash kerak:</strong> Amfoter bo'lmagan metallarning gidroksidlari 
              (Fe(OH)₃, Cu(OH)₂) ishqorda erimaydi. Faqat amfoter metallar gidroksokompleks hosil qiladi.
            </p>
          </div>
        </div>

        {/* 3. PARCHALANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💔 Parchalanish reaksiyasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Gidroksokomplekslar <strong className="text-yellow-400">faqat kuchli ishqoriy muhitda</strong> barqaror. 
            Kislota qo'shilsa, darhol parchalanadi:
          </p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="font-mono text-purple-200 text-sm mb-2">
              Na[Al(OH)₄] + HCl → Al(OH)₃↓ + NaCl + H₂O
            </p>
            <p className="text-purple-300 text-sm">
              Natijada amfoter metall gidroksidi cho'kmaga tushadi.
            </p>
          </div>
        </div>

        {/* 4. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim gidroksokomplekslar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Ion</th>
                  <th className="py-3 px-4 text-purple-300">KS</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {misollar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-orange-400">{m.formula}</td>
                    <td className="py-3 px-4 text-sm">{m.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400">{m.ion}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{m.ks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🏭 Bayer usuli</h3>
              <p className="text-purple-200 text-sm">
                Boksitdan alyuminiy olishda birinchi bosqich — Al(OH)₃ ni ishqorda eritib, 
                Na[Al(OH)₄] hosil qilish. Bu alyuminiy oksidini temir va kremniydan ajratish imkonini beradi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔬 Analitik kimyo</h3>
              <p className="text-purple-200 text-sm">
                Amfoter metallarni boshqa metallardan ajratish va sifat aniqlashda qo'llaniladi. 
                Ishqor qo'shilganda cho'kma hosil bo'lib, ortiqcha ishqorda erib ketishi — amfoterlik belgisi.
              </p>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gidroksokomplekslar — <strong className="text-yellow-400">OH⁻ ligandli</strong> komplekslar</li>
            <li>Faqat <strong>amfoter metallar</strong> gidroksokompleks hosil qiladi</li>
            <li>Faqat <strong>kuchli ishqoriy muhitda</strong> barqaror</li>
            <li>Kislota qo'shilsa — <strong>parchalanadi</strong></li>
            <li>Bayer usuli — eng muhim sanoat qo'llanishi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/atsido" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Atsidokomplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/karbonil" 
            className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 transition-all text-white font-semibold"
          >
            Keyingi: Karbonil komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}