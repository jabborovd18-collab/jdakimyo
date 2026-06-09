import Link from "next/link"

export default function VBNazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔗 Valent bog'lanishlar nazariyasi (VB)</h1>
          <p className="text-purple-400 text-sm">Gibridlanish • Donor-akseptor bog' • sp, sp³, dsp², d²sp³ • Kompleks geometriyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Valent bog'lanishlar nazariyasi haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Valent bog'lanishlar (VB) nazariyasi</strong> — 
              kompleks birikmalarda kimyoviy bog'lanishni tushuntirish uchun 
              <strong className="text-yellow-400"> birinchi muvaffaqiyatli qo'llanilgan nazariya</strong>.
              1931 yilda <strong>Linus Pauling</strong> tomonidan taklif qilingan. 
              Asosiy g'oya: markaziy atom o'zining bo'sh orbitallarida 
              <strong className="text-yellow-400"> gibrid orbitallar</strong> hosil qiladi va 
              ligandlarning erkin elektron juftlari shu gibrid orbitallarga 
              <strong className="text-yellow-400"> donor-akseptor (koordinatsion) bog'</strong> orqali birikadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy tushunchalar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Donor</strong> — ligand (erkin elektron jufti beruvchi)</li>
                <li>• <strong>Akseptor</strong> — markaziy atom (bo'sh orbitalga ega)</li>
                <li>• <strong>Koordinatsion son</strong> — gibrid orbitallar soniga teng</li>
                <li>• <strong>Gibridlanish</strong> — atom orbitallarining aralashishi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nazariyaning afzalliklari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Kompleks <strong>geometriyasini</strong> tushuntiradi</li>
                <li>• <strong>Koordinatsion sonni</strong> bashorat qiladi</li>
                <li>• <strong>Magnit xossalarini</strong> izohlaydi</li>
                <li>• Oddiy va tushunarli</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── 2. GIBRIDLANISH JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Gibridlanish turlari va kompleks geometriyasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Markaziy atomning <strong className="text-yellow-400">gibridlanish turi</strong> kompleksning 
            geometriyasini, koordinatsion sonini va magnit xossalarini belgilaydi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KS</th>
                <th className="py-3 px-4 text-purple-300">Gibridlanish</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">Orbitallar</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["2", "sp", "Chiziqli", "s + p", "[Ag(NH₃)₂]⁺, [CuCl₂]⁻"],
                  ["3", "sp²", "Tekis uchburchak", "s + 2p", "[HgI₃]⁻"],
                  ["4", "sp³", "Tetraedrik", "s + 3p", "[Zn(NH₃)₄]²⁺, [CoCl₄]²⁻"],
                  ["4", "dsp²", "Tekis kvadrat", "d<sub>x²−y²</sub>+s+2p", "[PtCl₄]²⁻, [Ni(CN)₄]²⁻"],
                  ["5", "dsp³", "Trigonal bipiramida", "d<sub>z²</sub>+s+3p", "[Fe(CO)₅]"],
                  ["6", "d²sp³", "Oktaedrik (ichki orbital)", "2d+s+3p", "[Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻"],
                  ["6", "sp³d²", "Oktaedrik (tashqi orbital)", "s+3p+2d", "[Fe(H₂O)₆]²⁺, [CoF₆]³⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[3] }}></td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. ICHKI VA TASHQI ORBITAL ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Ichki orbital va tashqi orbital komplekslar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            VB nazariyasi oktaedrik komplekslarni <strong className="text-yellow-400">ikki turga</strong> ajratadi.
            Bu ajratish ularning <strong>magnit xossalarini</strong> tushuntirishda muhim rol o'ynaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-3">d²sp³ — Ichki orbital kompleks</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Gibridlanish:</strong> (n−1)d + ns + np<br/>
                <strong>Orbitallar:</strong> d<sub>x²−y²</sub>, d<sub>z²</sub>, s, p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub><br/>
                <strong>d-elektronlar:</strong> juftlashishga majbur (kuchli maydon)<br/>
                <strong>Magnit:</strong> ko'pincha <strong>diamagnit</strong> yoki kam spinli
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 text-sm">
                <p className="text-yellow-400 font-bold">Misollar:</p>
                <p className="text-purple-300">[Co(NH₃)₆]³⁺ (diamagnit)</p>
                <p className="text-purple-300">[Fe(CN)₆]⁴⁻ (diamagnit)</p>
                <p className="text-purple-300">[PtCl₆]²⁻ (diamagnit)</p>
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-3">sp³d² — Tashqi orbital kompleks</h3>
              <p className="text-purple-200 text-sm mb-3">
                <strong>Gibridlanish:</strong> ns + np + nd<br/>
                <strong>Orbitallar:</strong> s, p<sub>x</sub>, p<sub>y</sub>, p<sub>z</sub>, d<sub>x²−y²</sub>, d<sub>z²</sub><br/>
                <strong>d-elektronlar:</strong> juftlashmaydi (kuchsiz maydon)<br/>
                <strong>Magnit:</strong> ko'pincha <strong>paramagnit</strong> yoki yuqori spinli
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 text-sm">
                <p className="text-yellow-400 font-bold">Misollar:</p>
                <p className="text-purple-300">[Fe(H₂O)₆]²⁺ (paramagnit, n=4)</p>
                <p className="text-purple-300">[CoF₆]³⁻ (paramagnit, n=4)</p>
                <p className="text-purple-300">[Ni(H₂O)₆]²⁺ (paramagnit, n=2)</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5 mt-4">
            <p className="text-purple-200 text-sm">
              <strong>Asosiy farq:</strong> Ichki orbital komplekslarda ligandlar kuchli maydon hosil qiladi — 
              d-elektronlar juftlashishga majbur bo'ladi. Tashqi orbital komplekslarda ligandlar kuchsiz maydonli — 
              d-elektronlar juftlashmaydi. Bu farq <strong>magnit momentda</strong> yaqqol namoyon bo'ladi.
            </p>
          </div>
        </div>

        {/* ── 4. MAGNIT XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 VB nazariyasi va magnit xossalari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            VB nazariyasining <strong className="text-yellow-400">eng katta yutug'i</strong> — 
            komplekslarning magnit xossalarini tushuntirish. Ichki orbital (d²sp³) komplekslar 
            kam spinli (diamagnit yoki kam toq elektronli), tashqi orbital (sp³d²) komplekslar 
            yuqori spinli (ko'p toq elektronli) bo'ladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">dⁿ</th>
                <th className="py-3 px-4 text-purple-300">Gibridlanish</th>
                <th className="py-3 px-4 text-purple-300">Toq e⁻ (n)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub> (μ<sub>B</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Magnit</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₆]³⁺", "d⁶", "d²sp³", "0", "0", "Diamagnit"],
                  ["[Fe(CN)₆]⁴⁻", "d⁶", "d²sp³", "0", "0", "Diamagnit"],
                  ["[Fe(CN)₆]³⁻", "d⁵", "d²sp³", "1", "1.73", "Paramagnit"],
                  ["[Fe(H₂O)₆]²⁺", "d⁶", "sp³d²", "4", "4.90", "Paramagnit"],
                  ["[CoF₆]³⁻", "d⁶", "sp³d²", "4", "4.90", "Paramagnit"],
                  ["[Ni(H₂O)₆]²⁺", "d⁸", "sp³d²", "2", "2.83", "Paramagnit"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-green-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. VB NAZARIYASINING CHEKLOVLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ VB nazariyasining kamchiliklari</h2>
          
          <div className="space-y-4">
            {[
              {
                kamchilik: "Rangni tushuntirmaydi",
                izoh: "VB nazariyasi komplekslarning rangini, UB-Vis spektrlarini va d-d o'tishlarni tushuntirib berolmaydi. Buning uchun kristall maydon yoki ligand maydon nazariyasi kerak.",
              },
              {
                kamchilik: "Nima uchun aynan shu geometriya?",
                izoh: "VB nazariyasi geometriyani bashorat qiladi, lekin nima uchun aynan shu geometriya energetik jihatdan qulay ekanligini tushuntirmaydi.",
              },
              {
                kamchilik: "Termodinamik barqarorlik",
                izoh: "VB nazariyasi komplekslarning nisbiy barqarorligini (Irving-Uilyams qatori) tushuntirib berolmaydi.",
              },
              {
                kamchilik: "Spektroskopik xossalar",
                izoh: "IQ, UB-Vis, YaMR kabi spektroskopik xususiyatlarni tushuntirish uchun yetarli emas.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.kamchilik}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Xulosa:</strong> VB nazariyasi — kompleks kimyosida <strong>birinchi qadam</strong>. 
              U geometriya va magnit xossalarini tushuntiradi, lekin to'liq tavsif uchun 
              kristall maydon va ligand maydon nazariyalari kerak.
            </p>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">VB nazariyasi:</strong> gibridlanish + donor-akseptor bog' — kompleks geometriyasini tushuntiradi</li>
            <li><strong className="text-yellow-400">d²sp³</strong> — ichki orbital (kuchli maydon, kam spin), <strong>sp³d²</strong> — tashqi orbital (kuchsiz maydon, yuqori spin)</li>
            <li><strong className="text-yellow-400">Magnit xossalari:</strong> juftlanmagan elektronlar soni orqali aniqlanadi</li>
            <li><strong className="text-yellow-400">Kamchiliklari:</strong> rang, spektrlar, barqarorlikni tushuntirmaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/oquv/kimyoviy-boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Kimyoviy bog'lanish
          </Link>
          <Link href="/oquv/kimyoviy-boglanish/kristall-maydon" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            Kristall maydon nazariyasi →
          </Link>
        </div>

      </section>
    </main>
  )
}