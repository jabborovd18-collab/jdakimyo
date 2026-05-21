import Link from "next/link"

export default function XelatKomplekslar() {
  const ligandlar = [
    {
      nomi: "Etilendiamin",
      qisqartma: "en",
      formula: "H₂N-CH₂-CH₂-NH₂",
      donor: 2,
      atomlar: "2 ta N",
      turi: "Bidentat",
      izoh: "Eng ko'p ishlatiladigan bidentat ligand. 5 a'zoli xelat halqa hosil qiladi."
    },
    {
      nomi: "Oksalat",
      qisqartma: "ox",
      formula: "C₂O₄²⁻",
      donor: 2,
      atomlar: "2 ta O",
      turi: "Bidentat",
      izoh: "Anion bidentat ligand. 5 a'zoli xelat halqa. O'simliklarda uchraydi."
    },
    {
      nomi: "2,2'-bipiridin",
      qisqartma: "bpy",
      formula: "C₁₀H₈N₂",
      donor: 2,
      atomlar: "2 ta N",
      turi: "Bidentat",
      izoh: "Aromatik bidentat ligand. Rangli komplekslar hosil qiladi. Fotokimyoda muhim."
    },
    {
      nomi: "1,10-fenantrolin",
      qisqartma: "phen",
      formula: "C₁₂H₈N₂",
      donor: 2,
      atomlar: "2 ta N",
      turi: "Bidentat",
      izoh: "Qattiq tuzilishli bidentat ligand. Fe²⁺ bilan qizil rang (ferroin)."
    },
    {
      nomi: "EDTA",
      qisqartma: "EDTA",
      formula: "C₁₀H₁₆N₂O₈",
      donor: 6,
      atomlar: "4 ta O + 2 ta N",
      turi: "Geksadentat",
      izoh: "Eng kuchli xelatlovchi agent. Analitik kimyoda keng qo'llaniladi."
    }
  ]

  const misollar = [
    {
      formula: "[Cu(en)₂]²⁺",
      nomi: "bis(etilendiamin)mis(II) ioni",
      ligand: "en (2 ta)",
      rang: "Binafsha-ko'k",
      izoh: "5 a'zoli xelat halqa. Juda barqaror kompleks."
    },
    {
      formula: "[Ca(EDTA)]²⁻",
      nomi: "etilendiamintetraatsetatokalsiyat(II) ioni",
      ligand: "EDTA",
      rang: "Rangsiz",
      izoh: "Suvning qattiqligini aniqlashda ishlatiladi."
    },
    {
      formula: "[Fe(phen)₃]²⁺",
      nomi: "tris(1,10-fenantrolin)temir(II) ioni — FERROIN",
      ligand: "phen (3 ta)",
      rang: "Qizil",
      izoh: "Oksidlanish-qaytarilish indikatori. Juda intensiv rang."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🦞 Xelat komplekslar</h1>
          <p className="text-purple-400 text-sm">Polidentat ligandlar • Xelat effekti • Yuqori barqarorlik • Metallarni qisqich kabi o'rash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Xelat komplekslar haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Xelat komplekslar</strong> — polidentat ligandlar (2 yoki undan ortiq donor atom) 
              tutgan komplekslardir. &quot;Xelat&quot; so'zi grekcha <em>&quot;chele&quot;</em> — <strong className="text-yellow-400">qisqich, panja</strong> so'zidan 
              olingan. Ligand metallni qisqich kabi o'rab oladi. Xelat komplekslar odatdagi komplekslarga qaraganda 
              <strong className="text-yellow-400"> ancha barqaror</strong> — bu hodisa <strong className="text-yellow-400">xelat effekti</strong> deyiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xelat effekti</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Polidentat ligandlar &gt; monodentat</li>
                <li>• Entropiya hisobiga barqarorlik ortadi</li>
                <li>• 5 yoki 6 a'zoli halqalar eng barqaror</li>
                <li>• Halqa qancha ko'p bo'lsa, shuncha barqaror</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tabiatdagi xelatlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Gem</strong> — temir(II) porfirin (gemoglobin)</li>
                <li>• <strong>Xlorofill</strong> — magniy(II) porfirin</li>
                <li>• <strong>B₁₂ vitamini</strong> — kobalt(III) korrin</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. LIGANDLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧩 Eng muhim xelatlovchi ligandlar</h2>
          
          <div className="space-y-4">
            {ligandlar.map((l, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 hover:border-green-400/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-yellow-400">{l.nomi}</h3>
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    {l.turi}
                  </span>
                </div>
                <p className="text-purple-200 text-sm mb-2">
                  <strong>Qisqartma:</strong> <span className="font-mono text-green-400">{l.qisqartma}</span> | 
                  <strong> Formula:</strong> <span className="text-purple-300">{l.formula}</span>
                </p>
                <p className="text-purple-300 text-sm">
                  <strong>Donor atomlar:</strong> {l.donor} ta ({l.atomlar})
                </p>
                <p className="text-purple-400 text-sm mt-1">💡 {l.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim xelat komplekslar</h2>
          
          <div className="space-y-4">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 hover:border-green-400/30 transition-all">
                <h3 className="text-xl font-bold text-yellow-400 font-mono mb-2">{m.formula}</h3>
                <p className="text-purple-200 font-semibold mb-2">{m.nomi}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">
                    Ligand: {m.ligand}
                  </span>
                  <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
                    Rangi: {m.rang}
                  </span>
                </div>
                <p className="text-purple-300 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. EDTA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ EDTA — eng kuchli xelatlovchi agent</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">EDTA</strong> (etilendiamintetraatsetat) — 
              <strong className="text-yellow-400"> geksadentat</strong> ligand, ya'ni bir vaqtning o'zida 6 ta donor atom orqali 
              metallga bog'lana oladi (4 ta O + 2 ta N). Bu eng kuchli xelatlovchi agentlardan biri bo'lib, 
              analitik kimyoda keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qo'llanish sohalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Suvning qattiqligini aniqlash</li>
                <li>• Metall ionlarini titrlash (kompleksonometriya)</li>
                <li>• Og'ir metallar bilan zaharlanishda antidot</li>
                <li>• Oziq-ovqat qo'shimchasi (E385)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Deyarli barcha metallar bilan barqaror kompleks</li>
                <li>• 1:1 nisbatda bog'lanadi (har qanday metall bilan)</li>
                <li>• Suvda yaxshi eriydi</li>
                <li>• Rangsiz komplekslar hosil qiladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Xelat komplekslar — <strong className="text-yellow-400">polidentat ligandli</strong> komplekslar</li>
            <li>Xelat effekti tufayli <strong>oddiy komplekslardan ancha barqaror</strong></li>
            <li>EDTA — <strong>eng kuchli xelatlovchi agent</strong> (geksadentat)</li>
            <li>Gem, xlorofill, B₁₂ — <strong>tabiatdagi eng muhim xelatlar</strong></li>
            <li>Analitik kimyoda, tibbiyotda va sanoatda keng qo'llaniladi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/aralash" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Aralash ligandli
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/metallosen" 
            className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 transition-all text-white font-semibold"
          >
            Keyingi: Metallosenlar →
          </Link>
        </div>

      </section>

    </main>
  )
}