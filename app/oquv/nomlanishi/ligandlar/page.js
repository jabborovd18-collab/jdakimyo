import Link from "next/link"

export default function LigandlarNomi() {
  const anionLigandlar = [
    { formula: "Br⁻", nomi: "bromo", asli: "Bromid" },
    { formula: "Cl⁻", nomi: "xloro", asli: "Xlorid" },
    { formula: "CN⁻", nomi: "siyano", asli: "Sianid" },
    { formula: "OH⁻", nomi: "gidrokso", asli: "Gidroksid" },
    { formula: "O²⁻", nomi: "okso", asli: "Oksid" },
    { formula: "CO₃²⁻", nomi: "karbonato", asli: "Karbonat" },
    { formula: "ONO⁻", nomi: "nitrito", asli: "Nitrit" },
    { formula: "NO₂⁻", nomi: "nitro", asli: "Nitro" },
    { formula: "C₂O₄²⁻", nomi: "oksalato", asli: "Oksalat" },
    { formula: "SO₄²⁻", nomi: "sulfato", asli: "Sulfat" },
    { formula: "SCN⁻", nomi: "tiosianato (κS)", asli: "Tiosianat" },
    { formula: "NCS⁻", nomi: "tiosianato (κN)", asli: "Izotiosianat" },
  ]

  const neytralLigandlar = [
    { formula: "NH₃", nomi: "ammin", asli: "Ammiak" },
    { formula: "CO", nomi: "karbonil", asli: "Uglerod(II) oksidi" },
    { formula: "H₂O", nomi: "akva", asli: "Suv" },
    { formula: "NO", nomi: "nitrozil", asli: "Azot(II) oksidi" },
    { formula: "en", nomi: "etilendiamin", asli: "Etilendiamin" },
    { formula: "EDTA", nomi: "etilendiamintetraatsetato", asli: "EDTA" },
  ]

  const polidentat = [
    { nomi: "Etilendiamin", qisqartma: "en", donor: 2, turi: "Bidentat" },
    { nomi: "Oksalat", qisqartma: "ox", donor: 2, turi: "Bidentat" },
    { nomi: "2,2'-bipiridin", qisqartma: "bpy", donor: 2, turi: "Bidentat" },
    { nomi: "1,10-fenantrolin", qisqartma: "phen", donor: 2, turi: "Bidentat" },
    { nomi: "EDTA", qisqartma: "EDTA", donor: 6, turi: "Geksadentat" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/nomlanishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧩 Ligandlar nomlanishi</h1>
          <p className="text-purple-400 text-sm">5.3-jadval • Eng keng tarqalgan ligandlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. Anion ligandlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-red-400">🔴</span> Anion ligandlar (manfiy zaryadli)
          </h2>
          <p className="text-purple-400 text-sm mb-6">
            Barcha anion ligandlarga <strong className="text-yellow-400">&quot;o&quot; qo&apos;shimchasi</strong> qo&apos;shiladi
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Asl nomi</th>
                  <th className="py-3 px-4 text-purple-300">Ligand nomi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {anionLigandlar.map((l, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-orange-400">{l.formula}</td>
                    <td className="py-3 px-4">{l.asli}</td>
                    <td className="py-3 px-4 text-yellow-400 font-semibold">{l.nomi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Neytral ligandlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-blue-400">🔵</span> Neytral ligandlar
          </h2>
          <p className="text-purple-400 text-sm mb-6">
            4 ta maxsus nomli ligand mavjud
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Asl nomi</th>
                  <th className="py-3 px-4 text-purple-300">Ligand nomi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {neytralLigandlar.map((l, i) => (
                  <tr key={i} className={`border-b border-purple-800/30 hover:bg-purple-800/20 ${i < 4 ? 'bg-purple-800/10' : ''}`}>
                    <td className="py-3 px-4 font-mono text-blue-400">{l.formula}</td>
                    <td className="py-3 px-4">{l.asli}</td>
                    <td className="py-3 px-4 text-yellow-400 font-semibold">{l.nomi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-blue-600/10 border border-blue-600/30 rounded-xl p-4">
            <p className="text-blue-300">
              <strong>Eslatma:</strong> Birinchi 4 ta ligand maxsus nomga ega. Qolgan barcha neytral ligandlar o&apos;z molekulyar nomi bilan ataladi.
            </p>
          </div>
        </div>

        {/* 3. Polidentat ligandlar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            <span className="text-green-400">🦞</span> Polidentat ligandlar (xelatlovchi agentlar)
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Ligand</th>
                  <th className="py-3 px-4 text-purple-300">Qisqartma</th>
                  <th className="py-3 px-4 text-purple-300">Donor atomlar</th>
                  <th className="py-3 px-4 text-purple-300">Turi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {polidentat.map((l, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-semibold">{l.nomi}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{l.qisqartma}</td>
                    <td className="py-3 px-4">{l.donor}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-2 py-1 rounded-full text-xs">
                        {l.turi}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-green-600/10 border border-green-600/30 rounded-xl p-4">
            <p className="text-green-300">
              <strong>💡 Yodda saqlang:</strong> Polidentat ligandlar sonini ko&apos;rsatishda <strong>bis-, tris-, tetrakis-</strong> prefikslari ishlatiladi.
            </p>
          </div>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi/iupac" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← IUPAC qoidalari
          </Link>
          <Link 
            href="/oquv/nomlanishi/anion" 
            className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 transition-all text-white font-semibold"
          >
            Keyingi: Anion komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}