import Link from "next/link"

export default function KarbonilKomplekslar() {
  const misollar = [
    { formula: "[Ni(CO)₄]", nomi: "tetrakarbonilnikel(0)", markaz: "Ni⁰ (d¹⁰)", holat: "Suyuqlik, Tq = 43°C", rang: "Rangsiz" },
    { formula: "[Fe(CO)₅]", nomi: "pentakarboniltemir(0)", markaz: "Fe⁰ (d⁸)", holat: "Suyuqlik, zaharli", rang: "Sariq" },
    { formula: "[Cr(CO)₆]", nomi: "geksakarbonilxrom(0)", markaz: "Cr⁰ (d⁶)", holat: "Oq kristall", rang: "Oq" },
    { formula: "[Mo(CO)₆]", nomi: "geksakarbonilmolibden(0)", markaz: "Mo⁰ (d⁶)", holat: "Oq kristall", rang: "Oq" },
    { formula: "[Co₂(CO)₈]", nomi: "oktakarbonildikobalt(0)", markaz: "Co⁰ (d⁹)", holat: "To'q qizil kristall", rang: "Qizil" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🫧 Karbonil komplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: CO (uglerod(II) oksidi) • Kuchli maydonli ligand • Metall karbonillari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Karbonil komplekslar haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Metall karbonillari</strong> — CO (uglerod(II) oksidi) ligandli komplekslar. 
              CO — <strong className="text-yellow-400">eng kuchli maydon hosil qiluvchi</strong> ligand 
              (spektrokimyoviy qatorning eng oxirida). Metall karbonillari odatda 
              <strong className="text-yellow-400"> neytral</strong> va <strong className="text-red-400"> zaharli</strong> moddalardir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">CO ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Nomi:</strong> karbonil (IUPAC)</li>
                <li>• <strong>Donor atom:</strong> Uglerod (C)</li>
                <li>• <strong>Turi:</strong> Monodentat, neytral</li>
                <li>• <strong>Maydon kuchi:</strong> Eng kuchli</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Metall oksidlanish darajasi: <strong>0</strong></li>
                <li>• Barchasi <strong>quyi spinli</strong></li>
                <li>• Barchasi <strong>diamagnit</strong></li>
                <li>• Organik erituvchilarda eriydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim metall karbonillari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Markaziy atom</th>
                  <th className="py-3 px-4 text-purple-300">Holati</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {misollar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400">{m.formula}</td>
                    <td className="py-3 px-4">{m.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400">{m.markaz}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{m.holat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. 18 ELEKTRON QOIDASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 18 elektron qoidasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Metall karbonillari <strong className="text-yellow-400">18 elektron qoidasiga</strong> bo'ysunadi. 
            Bu qoidaga ko'ra barqaror komplekslarda markaziy atom valent qavatida 18 ta elektron bo'ladi 
            (s²p⁶d¹⁰ — inert gaz konfiguratsiyasi).
          </p>
          
          <div className="space-y-3">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Ni(CO)₄]</h3>
              <p className="text-purple-200 text-sm">
                Ni⁰: 10 ta d-elektron + 4×CO (8 ta e⁻) = <strong>18 ta elektron</strong> ✅
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Fe(CO)₅]</h3>
              <p className="text-purple-200 text-sm">
                Fe⁰: 8 ta d-elektron + 5×CO (10 ta e⁻) = <strong>18 ta elektron</strong> ✅
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Cr(CO)₆]</h3>
              <p className="text-purple-200 text-sm">
                Cr⁰: 6 ta d-elektron + 6×CO (12 ta e⁻) = <strong>18 ta elektron</strong> ✅
              </p>
            </div>
          </div>
        </div>

        {/* 4. XOSSALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Metall karbonillarining xossalari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Fizik xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ko'pchiligi suyuq yoki qattiq</li>
                <li>• Organik erituvchilarda eriydi</li>
                <li>• Suvda erimaydi</li>
                <li>• Uchuvchan moddalar</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">⚠️ Xavfsizlik</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Juda zaharli!</strong></li>
                <li>• CO ajralib chiqishi mumkin</li>
                <li>• Yopiq xonada ishlatish mumkin emas</li>
                <li>• Maxsus laboratoriya sharoitida</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>CO — <strong className="text-yellow-400">eng kuchli maydonli</strong> neytral ligand</li>
            <li>Metall karbonillari — <strong>neytral, zaharli</strong> moddalar</li>
            <li>Barchasi <strong>18 elektron qoidasiga</strong> bo'ysunadi</li>
            <li>Metall oksidlanish darajasi <strong>0</strong></li>
            <li>Barchasi <strong>quyi spinli va diamagnit</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/gidrokso" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Gidroksokomplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/nitrozil" 
            className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 transition-all text-white font-semibold"
          >
            Keyingi: Nitrozil komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}