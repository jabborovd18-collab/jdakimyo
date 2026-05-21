import Link from "next/link"

export default function VBNazariyasi() {
  const gibridlanish = [
    { ks: 2, gib: "sp", geometriya: "Chiziqli", burchak: "180°", misol: "[Ag(NH₃)₂]⁺, [Ag(CN)₂]⁻", rang: "text-blue-400" },
    { ks: 3, gib: "sp²", geometriya: "Uchburchak", burchak: "120°", misol: "[Cu(CN)₃]²⁻, [HgI₃]⁻", rang: "text-green-400" },
    { ks: 4, gib: "sp³", geometriya: "Tetraedrik", burchak: "109.5°", misol: "[Zn(OH)₄]²⁻, [CoCl₄]²⁻", rang: "text-cyan-400" },
    { ks: 4, gib: "dsp²", geometriya: "Tekis kvadrat", burchak: "90°", misol: "[Ni(CN)₄]²⁻, [PtCl₄]²⁻", rang: "text-pink-400" },
    { ks: 5, gib: "sp³d", geometriya: "Trigonal bipiramida", burchak: "90°/120°", misol: "[Fe(CO)₅], [Ni(CN)₅]³⁻", rang: "text-orange-400" },
    { ks: 6, gib: "d²sp³", geometriya: "Oktaedrik (ichki orb)", burchak: "90°", misol: "[Fe(CN)₆]⁴⁻, [Co(NH₃)₆]³⁺", rang: "text-purple-400" },
    { ks: 6, gib: "sp³d²", geometriya: "Oktaedrik (tashqi orb)", burchak: "90°", misol: "[Fe(H₂O)₆]²⁺, [FeF₆]³⁻", rang: "text-yellow-400" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="text-purple-400 hover:text-purple-300 text-lg">← Kimyoviy bog'lanish</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 Valent bog'lanish (VB) nazariyasi</h1>
          <p className="text-purple-400 text-sm">Gibridlanish • Geometriyani bashorat qilish • Kompleks birikmalarda qo'llanishi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 VB nazariyasi haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Valent bog'lanish nazariyasi</strong> — kimyoviy bog'lanishni 
              <strong className="text-yellow-400"> atom orbitallarining qoplashishi</strong> orqali tushuntiradi.
              Kompleks birikmalarda markaziy atom orbitallari <strong className="text-yellow-400">gibridlanib</strong>, 
              ligandlarning taqsimlanmagan elektron juftlarini qabul qiladigan gibrid orbitallar hosil qiladi.
              Gibridlanish turi kompleksning <strong className="text-yellow-400">geometriyasini bevosita belgilaydi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Asosiy g'oyalar</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Bog'lanish <strong>orbitallar qoplashishi</strong> natijasida hosil bo'ladi</li>
                <li>• Markaziy atom orbitallari <strong>gibridlanadi</strong></li>
                <li>• Ligandlar <strong>taqsimlanmagan elektron juftini</strong> beradi</li>
                <li>• <strong>Donor-akseptor</strong> (koordinatsion) bog' hosil bo'ladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday bashorat qiladi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Gibridlanish turi → <strong>geometriya</strong></li>
                <li>• Gibrid orbitallar soni = <strong>KS</strong></li>
                <li>• Ichki/tashqi orbital → <strong>spin holati</strong></li>
                <li>• Ammo <strong>rang va magnit xossalarini</strong> tushuntirmaydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. GIBRIDLANISH TURLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Kompleks birikmalarda gibridlanish turlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KS</th><th className="py-3 px-4 text-purple-300">Gibridlanish</th><th className="py-3 px-4 text-purple-300">Geometriya</th><th className="py-3 px-4 text-purple-300">Burchak</th><th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {gibridlanish.map((g, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-white">{g.ks}</td>
                    <td className={`py-3 px-4 font-mono font-bold ${g.rang}`}>{g.gib}</td>
                    <td className="py-3 px-4">{g.geometriya}</td>
                    <td className="py-3 px-4">{g.burchak}</td>
                    <td className="py-3 px-4 font-mono text-sm">{g.misol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ICHKI VA TASHQI ORBITAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Ichki va tashqi orbital komplekslar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Oktaedrik komplekslarda gibridlanish <strong className="text-yellow-400">ligand maydon kuchiga</strong> qarab ikki xil bo'ladi.
            Bu farq kompleksning <strong>spin holatini va magnit xossalarini</strong> belgilaydi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-purple-400 font-bold text-xl mb-3">d²sp³ — Ichki orbital</h3>
              <p className="text-purple-200 text-sm mb-3">(n−1)d, ns, np orbitallar ishtirok etadi</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Kuchli maydonli</strong> ligandlar (CN⁻, CO)</li>
                <li>• d-elektronlar <strong>juftlashadi</strong></li>
                <li>• <strong>Quyi spinli</strong> — diamagnit</li>
                <li>• Misol: [Fe(CN)₆]⁴⁻ — μeff = 0</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-3">sp³d² — Tashqi orbital</h3>
              <p className="text-purple-200 text-sm mb-3">ns, np, nd orbitallar ishtirok etadi</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Kuchsiz maydonli</strong> ligandlar (F⁻, H₂O)</li>
                <li>• d-elektronlar <strong>juftlashmaydi</strong></li>
                <li>• <strong>Yuqori spinli</strong> — paramagnit</li>
                <li>• Misol: [Fe(H₂O)₆]²⁺ — μeff ≈ 4.90</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. AFZALLIK VA KAMCHILIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ VB nazariyasining kuchli va zaif tomonlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">✅ Afzalliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Geometriyani</strong> to'g'ri bashorat qiladi</li>
                <li>• Oddiy va tushunarli</li>
                <li>• Gibridlanish tushunchasi foydali</li>
                <li>• Ichki/tashqi orbital farqini tushuntiradi</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">❌ Kamchiliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Rangni</strong> tushuntirmaydi</li>
                <li>• <strong>Magnit xossalarini</strong> oldindan aytib berolmaydi</li>
                <li>• <strong>Spektrlarni</strong> izohlamaydi</li>
                <li>• Orgitallar energiyasini hisobga olmaydi</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>VB nazariyasi — <strong className="text-yellow-400">gibridlanish orqali geometriyani</strong> tushuntiradi</li>
            <li>d²sp³ — ichki orbital (quyi spin), sp³d² — tashqi orbital (yuqori spin)</li>
            <li>Gibridlanish turi <strong>KS va ligand kuchiga</strong> bog'liq</li>
            <li>Kamchiliklari MO va kristall maydon nazariyalari bilan to'ldiriladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kimyoviy bog'lanish</Link>
          <Link href="/ilmiy/chuqurlashgan/kimyoviy-boglanish/mo-nazariyasi" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">MO nazariyasi →</Link>
        </div>

      </section>
    </main>
  )
}