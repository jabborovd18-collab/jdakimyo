import Link from "next/link"

export default function Chiziqli() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📏 Chiziqli geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 2 • sp gibridlanish • Valent burchak: 180° • Simmetriya: D∞h</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link 
            href="/oquv/fazoviy/chiziqli/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-blue-600/30"
          >
            <span className="text-4xl">🔄</span>
            <div className="text-left">
              <div>3D modelni ko'rish</div>
              <div className="text-sm font-normal text-blue-200">[Ag(NH₃)₂]⁺ — interaktiv</div>
            </div>
          </Link>
        </div>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 2</li>
                <li>• <strong>Gibridlanish:</strong> sp</li>
                <li>• <strong>Valent burchak:</strong> 180°</li>
                <li>• <strong>Simmetriya:</strong> D∞h</li>
                <li>• <strong>Shakl:</strong> To'g'ri chiziq</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">s + p<sub>z</sub> → <strong className="text-yellow-400">2 ta sp gibrid orbital</strong></p>
                <p className="text-purple-300 text-sm">Qolgan p<sub>x</sub> va p<sub>y</sub> — gibridlanmagan</p>
              </div>
              <p className="text-purple-300 text-sm mt-3">Gibrid orbitallar bir-biriga nisbatan <strong className="text-yellow-400">180°</strong> burchak ostida joylashgan.</p>
            </div>
          </div>
        </div>

        {/* 2. XARAKTERLI IONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Xarakterli ionlar va misollar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Chiziqli komplekslar asosan <strong className="text-yellow-400">d¹⁰ konfiguratsiyali</strong> metall ionlari uchun xarakterli: 
            Cu⁺ (3d¹⁰), Ag⁺ (4d¹⁰), Au⁺ (5d¹⁰) va Hg²⁺ (5d¹⁰). d¹⁰ konfiguratsiyada barcha d-orbitallar to'lgan bo'lib, 
            ligandlar orasidagi itarilish kuchlari minimallashadi.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Markaziy ion</th>
                  <th className="py-3 px-4 text-purple-300">Ligandlar</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[Ag(NH₃)₂]⁺", n: "diamminkumush(I) ioni", ion: "Ag⁺ (d¹⁰)", lig: "2 × NH₃" },
                  { f: "[Ag(CN)₂]⁻", n: "disianoargentat(I) ioni", ion: "Ag⁺ (d¹⁰)", lig: "2 × CN⁻" },
                  { f: "[Cu(NH₃)₂]⁺", n: "diamminmis(I) ioni", ion: "Cu⁺ (d¹⁰)", lig: "2 × NH₃" },
                  { f: "[Au(CN)₂]⁻", n: "disianoaurat(I) ioni", ion: "Au⁺ (d¹⁰)", lig: "2 × CN⁻" },
                  { f: "[Hg(NH₃)₂]²⁺", n: "diamminmerkurat(II) ioni", ion: "Hg²⁺ (d¹⁰)", lig: "2 × NH₃" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{m.f}</td>
                    <td className="py-3 px-4">{m.n}</td>
                    <td className="py-3 px-4 text-yellow-400">{m.ion}</td>
                    <td className="py-3 px-4 text-purple-300 text-sm">{m.lig}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kristall maydon nazariyasida</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Chiziqli komplekslarda ligandlar <strong className="text-yellow-400">z-o'qi bo'ylab</strong> joylashgan. 
            Shuning uchun z-komponentli d-orbitallar (d<sub>z²</sub>) kuchli destabillashadi, 
            d<sub>xz</sub> va d<sub>yz</sub> orbitallar o'rtacha, d<sub>xy</sub> va d<sub>x²−y²</sub> orbitallar esa stabillashadi.
          </p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Energiya ortishi tartibi:</h3>
            <p className="text-purple-200 text-center text-lg">
              d<sub>xy</sub>, d<sub>x²−y²</sub> &lt; d<sub>xz</sub>, d<sub>yz</sub> &lt; <strong className="text-red-400">d<sub>z²</sub></strong>
            </p>
          </div>
          
          <p className="text-purple-200 mt-4">
            d¹⁰ konfiguratsiyada barcha d-orbitallar to'lgan bo'lib, komplekslar 
            <strong className="text-yellow-400"> diamagnit</strong> va <strong className="text-yellow-400">rangsiz</strong> bo'ladi (d-d o'tishlar mavjud emas).
          </p>
        </div>

        {/* 4. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tollens reaktivi</h3>
              <p className="text-purple-200 text-sm">
                [Ag(NH₃)₂]OH — eng mashhur chiziqli kompleks. Aldegidlarni aniqlashda ishlatiladi. 
                "Kumush ko'zgu" reaksiyasi orqali aldegidlar sifat aniqlanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Oltin qazib olish</h3>
              <p className="text-purple-200 text-sm">
                [Au(CN)₂]⁻ — sianidlash usulida oltin ajratib olinadi: 
                4Au + 8NaCN + O₂ + 2H₂O → 4Na[Au(CN)₂] + 4NaOH
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kumush qoplash</h3>
              <p className="text-purple-200 text-sm">
                [Ag(CN)₂]⁻ — galvanotexnikada kumush qoplash uchun ishlatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Chiziqli komplekslar — <strong className="text-yellow-400">KS = 2, sp gibridlanish</strong></li>
            <li>Valent burchak — <strong>180°</strong></li>
            <li>Asosan <strong>d¹⁰ konfiguratsiyali</strong> ionlar: Cu⁺, Ag⁺, Au⁺, Hg²⁺</li>
            <li>Ligand — markaziy atom — ligand bir to'g'ri chiziqda joylashadi</li>
            <li>Eng muhim vakili: <strong>[Ag(NH₃)₂]OH — Tollens reaktivi</strong></li>
            <li>d¹⁰ — barcha orbitallar to'lgan → <strong>diamagnit, rangsiz</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/fazoviy" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Fazoviy bo'limi
          </Link>
          <Link 
            href="/oquv/fazoviy/uchburchak" 
            className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 transition-all text-white font-semibold"
          >
            Keyingi: Uchburchak →
          </Link>
        </div>

      </section>

    </main>
  )
}