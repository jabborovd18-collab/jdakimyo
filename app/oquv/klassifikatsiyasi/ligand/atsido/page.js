import Link from "next/link"

export default function Atsidokomplekslar() {
  const galogenid = [
    { formula: "K₂[HgI₄]", nomi: "kaliy tetraiodomerkurat(II)", ligand: "I⁻ (iodo)", xususiyat: "Nessler reaktivi" },
    { formula: "K₂[PtCl₆]", nomi: "kaliy geksaxloroplatinat(IV)", ligand: "Cl⁻ (xloro)", xususiyat: "Sariq kristall" },
    { formula: "Na₃[AlF₆]", nomi: "natriy geksaftoroalyuminat(III)", ligand: "F⁻ (ftoro)", xususiyat: "Kriolit — alyuminiy ishlab chiqarishda" },
    { formula: "K₂[CuCl₄]", nomi: "kaliy tetraxlorokuprat(II)", ligand: "Cl⁻ (xloro)", xususiyat: "Sariq-yashil rang" },
  ]

  const sianid = [
    { formula: "K₄[Fe(CN)₆]", nomi: "kaliy geksasiyanoferrat(II)", tarixiy: "Sariq qon tuzi", xususiyat: "Oziq-ovqat E536" },
    { formula: "K₃[Fe(CN)₆]", nomi: "kaliy geksasiyanoferrat(III)", tarixiy: "Qizil qon tuzi", xususiyat: "Berlin ko'ki olinadi" },
    { formula: "K[Ag(CN)₂]", nomi: "kaliy disianoargentat(I)", tarixiy: "—", xususiyat: "Kumush qoplashda" },
  ]

  const boshqa = [
    { formula: "K₃[Fe(C₂O₄)₃]", nomi: "kaliy trioksalatoferrat(III)", ligand: "C₂O₄²⁻", turi: "Oksalatli" },
    { formula: "K₃[Fe(SCN)₆]", nomi: "kaliy geksatiosianatoferrat(III)", ligand: "SCN⁻", turi: "Tiosianatli" },
    { formula: "K₃[Co(NO₂)₆]", nomi: "kaliy geksanitrokobaltat(III)", ligand: "NO₂⁻", turi: "Fisher tuzi" },
    { formula: "K₂[Be(SO₄)₂]", nomi: "kaliy disulfatoberillat(II)", ligand: "SO₄²⁻", turi: "Sulfatli" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⚡ Atsidokomplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: kislota qoldig'i anionlari • Eng keng tarqalgan anion komplekslar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Atsidokomplekslar haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Atsidokomplekslar</strong> — ligandi 
              <strong className="text-yellow-400"> kislota qoldig'i anionlari</strong> bo'lgan kompleks birikmalardir. 
              &quot;Atsido&quot; so'zi lotincha <em>acidum</em> (kislota) so'zidan olingan. Bu eng ko'p sonli kompleks 
              birikmalar guruhidir. Deyarli barcha anionlar ligand sifatida qatnasha oladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand turlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Galogenidlar:</strong> F⁻, Cl⁻, Br⁻, I⁻</li>
                <li>• <strong>Sianid:</strong> CN⁻</li>
                <li>• <strong>Tiosianat:</strong> SCN⁻</li>
                <li>• <strong>Oksalat:</strong> C₂O₄²⁻</li>
                <li>• <strong>Sulfat:</strong> SO₄²⁻</li>
                <li>• <strong>Nitro:</strong> NO₂⁻</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Barcha anion ligandlar manfiy zaryadli</li>
                <li>• IUPAC da &quot;o&quot; qo'shimchasi qo'shiladi</li>
                <li>• Sianidli komplekslar eng barqaror</li>
                <li>• Ko'pchiligi analitik kimyoda qo'llaniladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. GALOGENIDLI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            <span className="text-green-400">🧂</span> Galogenidli atsidokomplekslar
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Ligand</th>
                  <th className="py-3 px-4 text-purple-300">Xususiyati</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {galogenid.map((g, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-pink-400">{g.formula}</td>
                    <td className="py-3 px-4">{g.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400">{g.ligand}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{g.xususiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. SIANIDLI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            <span className="text-blue-400">💎</span> Sianidli atsidokomplekslar
          </h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Sianid (CN⁻) — <strong className="text-yellow-400">eng kuchli maydonli</strong> anion ligandlardan biri. 
            Sianidli komplekslar juda barqaror va ko'pincha quyi spinli bo'ladi.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Tarixiy nomi</th>
                  <th className="py-3 px-4 text-purple-300">Xususiyati</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {sianid.map((s, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{s.formula}</td>
                    <td className="py-3 px-4">{s.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400 font-semibold">{s.tarixiy}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{s.xususiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-2">🔷 Berlin ko'kining hosil bo'lishi</h3>
            <p className="font-mono text-purple-200 text-sm">
              4Fe³⁺ + 3[Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃↓
            </p>
            <p className="text-blue-300 text-sm mt-2">To'q ko'k cho'kma — Berlin ko'ki (Prussiya ko'ki)</p>
          </div>
        </div>

        {/* 4. BOSHQA TURLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa muhim atsidokomplekslar</h2>
          
          <div className="space-y-4">
            {boshqa.map((b, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold text-lg mb-1">{b.formula}</h3>
                <p className="text-purple-200 mb-1">{b.nomi}</p>
                <div className="flex gap-2">
                  <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-2 py-0.5 rounded-full text-xs">{b.ligand}</span>
                  <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-2 py-0.5 rounded-full text-xs">{b.turi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🏭 Sanoat</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Na₃[AlF₆] — alyuminiy elektrolizi</li>
                <li>• K[Ag(CN)₂] — kumush qoplash</li>
                <li>• K[Au(CN)₂] — oltin qazib olish</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔬 Analitik kimyo</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• K₂[HgI₄] — Nessler reaktivi</li>
                <li>• K₄[Fe(CN)₆] — Fe³⁺ ni aniqlash</li>
                <li>• K₃[Fe(CN)₆] — Fe²⁺ ni aniqlash</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Atsidokomplekslar — <strong className="text-yellow-400">eng ko'p sonli</strong> komplekslar guruhi</li>
            <li>Ligandlar: <strong>galogenidlar, sianid, tiosianat, oksalat</strong> va boshqalar</li>
            <li>Ligandlar manfiy zaryadli — IUPAC da <strong>&quot;o&quot; qo'shimchasi</strong> qo'shiladi</li>
            <li>Sianidli komplekslar — <strong>eng barqaror</strong> va quyi spinli</li>
            <li>Sanoatda keng qo'llaniladi: metallurgiya, galvanotexnika</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/ammin" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Ammiakatlar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/gidrokso" 
            className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 transition-all text-white font-semibold"
          >
            Keyingi: Gidroksokomplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}