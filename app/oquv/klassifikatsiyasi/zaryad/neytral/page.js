import Link from "next/link"

export default function NeytralKomplekslar() {
  const misollar = [
    {
      formula: "[Pt(NH₃)₂Cl₂]",
      nomi: "diammindixloroplatina(II)",
      zaryadHisob: "Pt²⁺ (+2) + 2NH₃ (0) + 2Cl⁻ (-2) = 0",
      geometriya: "Tekis kvadrat",
      izoh: "Sisplatin — saraton davosi. Sis-izomer biologik faol, trans-izomer ta'sirsiz."
    },
    {
      formula: "[Co(NH₃)₃Cl₃]",
      nomi: "trixlorotriaminkobalt(III)",
      zaryadHisob: "Co³⁺ (+3) + 3NH₃ (0) + 3Cl⁻ (-3) = 0",
      geometriya: "Oktaedrik",
      izoh: "Verner klassikasi. Fac va mer izomerlari mavjud. Yashil rangli."
    },
    {
      formula: "[Ni(CO)₄]",
      nomi: "tetrakarbonilnikel(0)",
      zaryadHisob: "Ni⁰ (0) + 4CO (0) = 0",
      geometriya: "Tetraedrik",
      izoh: "Metall karbonili. Zaharli suyuqlik. 18 elektron qoidasi. Tq = 43°C."
    },
    {
      formula: "[Fe(CO)₅]",
      nomi: "pentakarboniltemir(0)",
      zaryadHisob: "Fe⁰ (0) + 5CO (0) = 0",
      geometriya: "Trigonal bipiramida",
      izoh: "Eng muhim metall karbonillaridan biri. Sariq suyuqlik, zaharli."
    },
    {
      formula: "[Fe(C₅H₅)₂]",
      nomi: "ferrosen (disiklopentadieniltemir(II))",
      zaryadHisob: "Fe²⁺ (+2) + 2C₅H₅⁻ (-2) = 0",
      geometriya: "Sendvich",
      izoh: "Eng mashhur metallosen. To'q sariq kristall. Havoda barqaror."
    },
    {
      formula: "[Cr(CO)₆]",
      nomi: "geksakarbonilxrom(0)",
      zaryadHisob: "Cr⁰ (0) + 6CO (0) = 0",
      geometriya: "Oktaedrik",
      izoh: "Oq kristall modda. 18 elektron qoidasiga bo'ysunadi."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/zaryad" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">⭕ Neytral komplekslar</h1>
          <p className="text-purple-400 text-sm">Ichki sfera zaryadsiz • Tashqi sfera yo'q • Mustaqil molekulalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Neytral komplekslar haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Neytral komplekslar</strong> — ichki sferaning umumiy zaryadi 
              <strong className="text-yellow-400"> nolga teng</strong> bo'lgan komplekslardir. 
              Bunday komplekslarda <strong className="text-yellow-400">tashqi sfera bo'lmaydi</strong>. 
              Ular mustaqil molekulalar sifatida mavjud bo'ladi va suvda eriganda 
              <strong className="text-yellow-400"> ionlarga dissotsilanmaydi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ichki sfera zaryadi: <strong className="text-green-400">0</strong></li>
                <li>• Tashqi sfera: <strong>yo'q</strong></li>
                <li>• Suvda dissotsilanmaydi</li>
                <li>• Organik erituvchilarda eriydi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday hosil bo'ladi</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Metall zaryadi = ligandlar zaryadi (qarama-qarshi)</li>
                <li>• Metall zaryadi 0 bo'lsa (karbonillar)</li>
                <li>• Hamma ligandlar neytral bo'lsa</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim neytral komplekslar</h2>
          
          <div className="space-y-6">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 hover:border-green-400/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono">{m.formula}</h3>
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    {m.geometriya}
                  </span>
                </div>
                <p className="text-purple-200 font-semibold mb-3">{m.nomi}</p>
                <div className="bg-purple-900/50 rounded-lg p-3 mb-3">
                  <p className="text-purple-300 text-sm font-mono">{m.zaryadHisob}</p>
                </div>
                <p className="text-purple-400 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. XUSUSIYATLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Neytral komplekslarning muhim xususiyatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Eruvchanlik</h3>
              <p className="text-purple-200 text-sm">
                Neytral komplekslar odatda suvda yomon eriydi, lekin organik erituvchilarda 
                (benzol, xloroform, atseton) yaxshi eriydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Elektr o'tkazuvchanlik</h3>
              <p className="text-purple-200 text-sm">
                Suvli eritmalari elektr tokini o'tkazmaydi, chunki ular ionlarga dissotsilanmaydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Uchuvchanlik</h3>
              <p className="text-purple-200 text-sm">
                Ko'pchilik neytral komplekslar (ayniqsa metall karbonillari) uchuvchan bo'ladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Reaksion qobiliyat</h3>
              <p className="text-purple-200 text-sm">
                Neytral komplekslar ko'pincha ligand almashinish reaksiyalariga kirishadi.
              </p>
            </div>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Neytral komplekslar — <strong className="text-yellow-400">ichki sfera zaryadi nol</strong></li>
            <li><strong>Tashqi sfera yo'q</strong> — mustaqil molekulalar</li>
            <li>Suvda <strong>dissotsilanmaydi</strong>, elektr tokini o'tkazmaydi</li>
            <li>Metall karbonillari va metallosenlar — neytral komplekslarga misol</li>
            <li>Organik erituvchilarda yaxshi eriydi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad/anion" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Anion komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad" 
            className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 transition-all text-white font-semibold"
          >
            Zaryad bo'limi →
          </Link>
        </div>

      </section>

    </main>
  )
}