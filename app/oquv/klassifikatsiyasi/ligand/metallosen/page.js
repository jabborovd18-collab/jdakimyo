import Link from "next/link"

export default function Metallosenlar() {
  const misollar = [
    {
      formula: "[Fe(C₅H₅)₂]",
      nomi: "ferrosen (disiklopentadieniltemir(II))",
      metall: "Fe²⁺ (d⁶)",
      rang: "To'q sariq kristall",
      yil: "1951",
      izoh: "Eng birinchi va eng mashhur metallosen. 18 elektron qoidasiga bo'ysunadi. Juda barqaror — havoda oksidlanmaydi."
    },
    {
      formula: "[Cr(C₅H₅)₂]",
      nomi: "xromosen (disiklopentadienilxrom(II))",
      metall: "Cr²⁺ (d⁴)",
      rang: "Qizil kristall",
      yil: "1953",
      izoh: "Ferrosendan keyin ikkinchi metallosen. Paramagnit."
    },
    {
      formula: "[Co(C₅H₅)₂]⁺",
      nomi: "kobaltoseniy ioni",
      metall: "Co³⁺ (d⁶)",
      rang: "Sariq",
      yil: "1953",
      izoh: "Ferrosenning kobalt analogi. 18 elektron qoidasiga bo'ysunadi. Kation holida barqaror."
    },
    {
      formula: "[Ni(C₅H₅)₂]",
      nomi: "nikelosen (disiklopentadienilnikel(II))",
      metall: "Ni²⁺ (d⁸)",
      rang: "Yashil kristall",
      yil: "1953",
      izoh: "20 elektron — 18 elektron qoidasidan ko'p. Reaksiyaga kirishuvchan."
    },
    {
      formula: "[Ru(C₅H₅)₂]",
      nomi: "rutenosen (disiklopentadienilruteniy(II))",
      metall: "Ru²⁺ (d⁶)",
      rang: "Och sariq kristall",
      yil: "1952",
      izoh: "Ferrosenning ruteniy analogi. Ferrosendan ham barqarorroq."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🥪 Metallosenlar</h1>
          <p className="text-purple-400 text-sm">Sendvich birikmalar • Siklopentadienil ligand • Ferrosen — eng mashhuri</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metallosenlar haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Metallosenlar</strong> — ikkita siklopentadienil (C₅H₅⁻) halqasi orasida 
              metall atomi joylashgan <strong className="text-yellow-400">&quot;sendvich&quot; tuzilishga</strong> ega komplekslardir.
              Har bir C₅H₅⁻ halqasi 5 ta donor atom orqali metallga bog'lanadi. 
              Eng mashhur vakili — <strong className="text-yellow-400">ferrosen [Fe(C₅H₅)₂]</strong>, 1951 yilda kashf etilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Ligand:</strong> C₅H₅⁻ — siklopentadienil</li>
                <li>• <strong>Donor atom:</strong> 5 ta C (pentadentat)</li>
                <li>• <strong>Zaryadi:</strong> -1 (anion)</li>
                <li>• <strong>Tuzilishi:</strong> Sendvich</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• 1951 yil — kashf etilgan</li>
                <li>• Nobel mukofoti (1973, E. Fisher, J. Uilkinson)</li>
                <li>• 18 elektron qoidasiga bo'ysunadi</li>
                <li>• Organik erituvchilarda eriydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. FERROSEN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Ferrosen [Fe(C₅H₅)₂] — eng mashhur metallosen</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ferrosen</strong> — birinchi kashf etilgan va eng muhim metallosen.
              Ikkita siklopentadienil halqasi parallel joylashgan bo'lib, ular orasida temir atomi sendvich kabi 
              joylashgan. <strong className="text-yellow-400">10 ta Fe-C bog'</strong> mavjud. Temirning oksidlanish darajasi +2.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Fizik xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• To'q sariq kristall modda</li>
                <li>• T_suyuqlanish = 173°C</li>
                <li>• Suvda erimaydi</li>
                <li>• Organik erituvchilarda eriydi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kimyoviy xossalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Havoda barqaror (oksidlanmaydi)</li>
                <li>• Kislotalarga chidamli</li>
                <li>• Elektrofil almashinish reaksiyalari</li>
                <li>• Qaytar xossalarga ega</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
            <h3 className="text-green-400 font-bold mb-2">🔢 18 elektron qoidasi</h3>
            <p className="text-purple-200 text-sm">
              Fe²⁺: 6 ta d-elektron + 2×C₅H₅⁻ (12 ta e⁻) = <strong className="text-yellow-400">18 ta elektron</strong> ✅
            </p>
          </div>
        </div>

        {/* 3. BOSHQA METALLOSENLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa metallosenlar</h2>
          
          <div className="space-y-4">
            {misollar.filter(m => m.formula !== "[Fe(C₅H₅)₂]").map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 hover:border-yellow-400/30 transition-all">
                <h3 className="text-xl font-bold text-yellow-400 font-mono mb-2">{m.formula}</h3>
                <p className="text-purple-200 font-semibold mb-2">{m.nomi}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">
                    {m.metall}
                  </span>
                  <span className="bg-purple-600/20 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
                    {m.rang}
                  </span>
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">
                    {m.yil} yil
                  </span>
                </div>
                <p className="text-purple-300 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🏭</div>
              <h3 className="text-yellow-400 font-bold mb-2">Kataliz</h3>
              <p className="text-purple-200 text-sm">Ferrosen asosidagi katalizatorlar organik sintezda va polimer ishlab chiqarishda.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="text-yellow-400 font-bold mb-2">Tibbiyot</h3>
              <p className="text-purple-200 text-sm">Ferrosen hosilalari saraton va bezgakka qarshi dori vositalarida.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔬</div>
              <h3 className="text-yellow-400 font-bold mb-2">Analitik kimyo</h3>
              <p className="text-purple-200 text-sm">Ferrosen elektrod sifatida elektrokimyoviy sensorlarda.</p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Metallosenlar — <strong className="text-yellow-400">&quot;sendvich&quot; tuzilishga</strong> ega komplekslar</li>
            <li>Ligand: <strong>C₅H₅⁻ (siklopentadienil)</strong>, har biri 5 ta donor atom</li>
            <li>Ferrosen [Fe(C₅H₅)₂] — <strong>eng mashhur metallosen</strong> (1951 yil)</li>
            <li>18 elektron qoidasiga bo'ysunadi</li>
            <li>Kataliz, tibbiyot va analitik kimyoda muhim ahamiyatga ega</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/xelat" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Xelat komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand" 
            className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 transition-all text-white font-semibold"
          >
            Ligandlar bo'limi →
          </Link>
        </div>

      </section>

    </main>
  )
}