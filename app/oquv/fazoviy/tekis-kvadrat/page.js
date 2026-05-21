import Link from "next/link"

export default function TekisKvadrat() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/fazoviy" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">◻️ Tekis kvadrat geometriya</h1>
          <p className="text-purple-400 text-sm">KS = 4 • sp²d (dsp²) gibridlanish • Valent burchak: 90° • Simmetriya: D₄h</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 3D ICONKA */}
        <div className="text-center">
          <Link href="/oquv/fazoviy/tekis-kvadrat/3d" 
            className="inline-flex items-center gap-4 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-10 py-6 rounded-2xl text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-pink-600/30">
            <span className="text-4xl">🔄</span>
            <div className="text-left"><div>3D modelni ko'rish</div><div className="text-sm font-normal text-pink-200">sis-[PtCl₂(NH₃)₂] — SISPLATIN</div></div>
          </Link>
        </div>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma'lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Geometrik xususiyatlar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Koordinatsion son:</strong> 4</li>
                <li>• <strong>Gibridlanish:</strong> sp²d (dsp²)</li>
                <li>• <strong>Valent burchak:</strong> 90°</li>
                <li>• <strong>Simmetriya:</strong> D₄h</li>
                <li>• <strong>Shakl:</strong> Kvadrat — barcha 4 ligand bir tekislikda</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Gibridlanish sxemasi</h3>
              <div className="bg-purple-900/50 rounded-lg p-4 text-center">
                <p className="text-purple-200 mb-2">d<sub>x²−y²</sub> + s + p<sub>x</sub> + p<sub>y</sub> → <strong className="text-yellow-400">4 ta dsp² gibrid orbital</strong></p>
              </div>
              <p className="text-purple-300 text-sm mt-3">
                Gibrid orbitallar bir tekislikda, bir-biriga nisbatan <strong className="text-yellow-400">90°</strong> burchak ostida joylashgan.
              </p>
            </div>
          </div>
        </div>

        {/* 2. XARAKTERLI IONLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Xarakterli ionlar va misollar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Tekis kvadrat komplekslar asosan <strong className="text-yellow-400">d⁸ konfiguratsiyali</strong> metall ionlari uchun xarakterli: 
            Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺, Rh⁺, Ir⁺. Pd²⁺ va Pt²⁺ ning deyarli barcha komplekslari tekis kvadrat shaklga ega.
            Tetraedrik komplekslardan farqli ravishda, tekis kvadrat komplekslarda <strong className="text-yellow-400">sis-trans geometrik izomeriya</strong> kuzatiladi.
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Formula</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Markaziy ion</th><th className="py-3 px-4 text-purple-300">Xususiyati</th></tr></thead>
              <tbody className="text-purple-200">
                {[
                  { f: "[Ni(CN)₄]²⁻", n: "tetrasiyanonikkolat(II)", ion: "Ni²⁺ (d⁸)", x: "Sariq, diamagnit" },
                  { f: "[PtCl₄]²⁻", n: "tetraxloroplatinat(II)", ion: "Pt²⁺ (d⁸)", x: "Qizil, diamagnit" },
                  { f: "[PdCl₄]²⁻", n: "tetraxloropalladat(II)", ion: "Pd²⁺ (d⁸)", x: "Jigarrang" },
                  { f: "[AuCl₄]⁻", n: "tetraxloroaurat(III)", ion: "Au³⁺ (d⁸)", x: "Sariq, zar suvi" },
                  { f: "sis-[PtCl₂(NH₃)₂]", n: "sisplatin — SARATON DAVOSI", ion: "Pt²⁺ (d⁸)", x: "Biologik faol" },
                  { f: "trans-[PtCl₂(NH₃)₂]", n: "transplatin", ion: "Pt²⁺ (d⁸)", x: "Biologik faol EMAS" },
                ].map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-pink-400">{m.f}</td><td className="py-3 px-4">{m.n}</td><td className="py-3 px-4 text-yellow-400">{m.ion}</td><td className="py-3 px-4 text-sm">{m.x}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. SIS-TRANS IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Sis-trans izomeriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-400 mb-3">sis-izomer</h3>
              <p className="text-purple-200 mb-3">Bir xil ligandlar <strong>yonma-yon</strong> (90° burchak ostida)</p>
              <div className="bg-purple-900/50 rounded-lg p-3 font-mono text-sm text-purple-200 text-center">
                Cl — Pt — Cl<br/>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>NH₃&nbsp;&nbsp;&nbsp;NH₃
              </div>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-400 mb-3">trans-izomer</h3>
              <p className="text-purple-200 mb-3">Bir xil ligandlar <strong>qarama-qarshi</strong> (180° burchak ostida)</p>
              <div className="bg-purple-900/50 rounded-lg p-3 font-mono text-sm text-purple-200 text-center">
                Cl — Pt — NH₃<br/>|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|<br/>NH₃&nbsp;&nbsp;&nbsp;Cl
              </div>
            </div>
          </div>
        </div>

        {/* 4. SISPLATIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Sisplatin — stereokimyoning tibbiyotdagi eng katta yutug'i</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">sis-[PtCl₂(NH₃)₂]</strong> — sisplatin — tekis kvadrat komplekslarning eng yorqin amaliy misoli. 
              Bu dori <strong className="text-yellow-400">saraton kasalliklarini davolashda</strong> eng samarali kimyoterapevtik vositalardan biri hisoblanadi.
              Trans-izomer esa biologik faol emas!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ta'sir mexanizmi</h3>
              <p className="text-purple-200 text-sm">
                Sisplatin DNK molekulasiga kirib, qo'shni guanin asoslari bilan o'zaro bog'lanib (cross-linking), 
                DNK replikatsiyasini to'xtatadi. Natijada saraton hujayralari bo'lina olmaydi va nobud bo'ladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nega faqat sis-izomer?</h3>
              <p className="text-purple-200 text-sm">
                Trans-izomer DNK bilan bunday bog'lanishni hosil qila olmaydi, chunki ikkita Cl ligandlari 
                qarama-qarshi tomonda joylashgan. Bu geometrik izomeriyaning hayotiy ahamiyatini ko'rsatadi!
              </p>
            </div>
          </div>
        </div>

        {/* 5. KRISTALL MAYDON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kristall maydon nazariyasida</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Tekis kvadrat maydon <strong className="text-yellow-400">eng katta energetik ajralishga</strong> ega. 
            d<sub>x²−y²</sub> orbital eng yuqori energiyaga ega (ligandlar bevosita shu orbital yo'nalishida).
          </p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Energiya ortishi tartibi:</h3>
            <p className="text-purple-200 text-center">
              d<sub>xz</sub>, d<sub>yz</sub> &lt; d<sub>z²</sub> &lt; d<sub>xy</sub> &lt; <strong className="text-red-400">d<sub>x²−y²</sub></strong>
            </p>
          </div>
          
          <p className="text-purple-200 mt-4">
            d⁸ konfiguratsiyada barcha 8 ta elektron quyi energiyali orbitallarga juftlashib joylashadi → kompleks <strong className="text-yellow-400">diamagnit</strong>.
          </p>
        </div>

        {/* 6. TETRAEDRIK VS TEKIS KVADRAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Tetraedrik va tekis kvadratni farqlash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700"><th className="py-3 px-4 text-purple-300">Xususiyat</th><th className="py-3 px-4 text-purple-300 text-cyan-400">Tetraedrik</th><th className="py-3 px-4 text-purple-300 text-pink-400">Tekis kvadrat</th></tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Gibridlanish", "sp³", "dsp²"],
                  ["Valent burchak", "109.5°", "90°"],
                  ["Geometrik izomeriya", "Yo'q", "Sis-trans"],
                  ["Spin holati", "Yuqori", "Quyi"],
                  ["Rang intensivligi", "Intensiv", "Kamroq"],
                  ["Misol (Ni²⁺)", "[NiCl₄]²⁻ tetraedrik", "[Ni(CN)₄]²⁻ tekis kvadrat"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-semibold">{r[0]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[1]}</td>
                    <td className="py-3 px-4 text-pink-400">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 7. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Tekis kvadrat — <strong className="text-yellow-400">KS = 4, dsp² gibridlanish</strong></li>
            <li>Valent burchak — <strong>90°</strong></li>
            <li>Asosan <strong>d⁸ konfiguratsiyali</strong> ionlar: Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺</li>
            <li><strong>Sis-trans geometrik izomeriya</strong> mavjud</li>
            <li>Odatda <strong>quyi spinli va diamagnit</strong></li>
            <li><strong>Sisplatin</strong> — eng muhim tekis kvadrat kompleks (saraton davosi)</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/fazoviy/tetraedrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Tetraedrik</Link>
          <Link href="/oquv/fazoviy/trigonal-bipiramida" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Trigonal bipiramida →</Link>
        </div>

      </section>
    </main>
  )
}