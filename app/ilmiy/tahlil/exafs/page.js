import Link from "next/link"

export default function EXAFSXANES() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-emerald-400">🔮 EXAFS / XANES</h1>
          <p className="text-purple-400 text-sm">Rentgen yutilish spektroskopiyasi • Mahalliy struktura • Koordinatsion son • Bog' uzunliklari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── BIRIKMALAR TAHLILI KARTASI ── */}
        <Link 
          href="/ilmiy/tahlil/exafs/birikmalar"
          className="group block bg-gradient-to-r from-emerald-900/40 to-purple-900/40 border border-emerald-700/50 rounded-2xl p-6 hover:bg-emerald-900/60 hover:border-emerald-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🔮</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Birikmalarning EXAFS/XANES tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning rentgen yutilish spektrlari tahlili. Mahalliy struktura, 
                bog' uzunliklari, koordinatsion son va Debay-Uoller faktorlari har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-emerald-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Bog' uzunliklari R</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Koordinatsion son N</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Debay-Uoller σ²</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">XANES — oksidlanish darajasi</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 EXAFS va XANES haqida</h2>
          
          <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-emerald-400">EXAFS (Extended X-ray Absorption Fine Structure)</strong> va 
              <strong className="text-emerald-400"> XANES (X-ray Absorption Near Edge Structure)</strong> — 
              rentgen yutilish spektroskopiyasining ikkita bir-birini to'ldiruvchi sohasi. 
              <strong className="text-emerald-400">XANES</strong> yutilish chegarasi yaqinidagi (~50 eV) 
              spektral xususiyatlardan <strong className="text-emerald-400">oksidlanish darajasi, koordinatsion geometriya 
              va bo'sh orbitallar</strong> haqida ma'lumot beradi. <strong className="text-emerald-400">EXAFS</strong> 
              yutilish chegarasidan yuqorida (50−1000 eV) kuzatiladigan ossillyatsiyalardan 
              <strong className="text-emerald-400">bog' uzunliklari, koordinatsion son va Debay-Uoller faktorlari</strong> ni 
              yuqori aniqlikda (±0.01 Å, ±10%) aniqlaydi. Eng katta afzalligi — 
              <strong className="text-emerald-400">kristall bo'lmagan moddalar, eritmalar va amorf materiallar</strong> 
              uchun ham ishlaydi. Senkrotron nurlanishi talab qilinadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-emerald-400 font-bold mb-2">XANES nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Oksidlanish darajasi</strong> — yutilish chegarasi siljishi (ΔE₀)</li>
                <li>• <strong>Koordinatsion geometriya</strong> — pre-edge piklar intensivligi va shakli</li>
                <li>• <strong>Bo'sh orbitallar</strong> — 1s → 3d, 1s → 4p o'tishlar</li>
                <li>• <strong>Elektr manfiylik muhiti</strong> — yutilish chegarasi energiyasi</li>
                <li>• <strong>Spin holati</strong> — pre-edge piklar orqali (masalan, Fe²⁺ HS vs LS)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-emerald-400 font-bold mb-2">EXAFS nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Bog' uzunliklari (R)</strong> — ±0.01 Å aniqlikda</li>
                <li>• <strong>Koordinatsion son (N)</strong> — ±10% aniqlikda</li>
                <li>• <strong>Debay-Uoller faktori (σ²)</strong> — strukturaviy tartibsizlik</li>
                <li>• <strong>Sochuvchi atom turi (Z)</strong> — qo'shnilarning kimyoviy tabiati</li>
                <li>• <strong>Ko'p karrali sochilish</strong> — bog' burchaklari haqida ma'lumot</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. EXAFS TENGLAMASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 EXAFS tenglamasi — strukturaviy parametrlarni hisoblash</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-emerald-400">EXAFS signali χ(k)</strong> quyidagi formula orqali 
            strukturaviy parametrlarga bog'lanadi. Bu tenglama yordamida bog' uzunliklari, koordinatsion son 
            va Debay-Uoller faktorlari aniqlanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-emerald-400 font-bold mb-3">EXAFS formulasi:</h3>
            <div className="bg-emerald-600/10 border border-emerald-500/30 rounded-lg p-4 mb-3">
              <p className="font-mono text-sm text-purple-200 leading-relaxed">
                χ(k) = Σᵢ [Nᵢ·S₀²·Fᵢ(k) / (k·Rᵢ²)] · exp(−2k²σᵢ²) · exp(−2Rᵢ/λ(k)) · sin[2kRᵢ + φᵢ(k)]
              </p>
            </div>
            <div className="space-y-2 text-sm text-purple-200">
              <p><strong className="text-emerald-400">Nᵢ</strong> — koordinatsion son (i-chi qobiqdagi qo'shni atomlar soni)</p>
              <p><strong className="text-emerald-400">Rᵢ</strong> — bog' uzunligi (yutuvchi atomdan i-chi qobiqgacha masofa, Å)</p>
              <p><strong className="text-emerald-400">σᵢ²</strong> — Debay-Uoller faktori (strukturaviy va termik tartibsizlik, Å²)</p>
              <p><strong className="text-emerald-400">S₀²</strong> — amplituda reduksiya faktori (ko'p elektronli effektlar, ~0.7−1.0)</p>
              <p><strong className="text-emerald-400">Fᵢ(k)</strong> — sochilish amplitudasi (atom turiga bog'liq)</p>
              <p><strong className="text-emerald-400">λ(k)</strong> — fotoelektronning erkin yugurish yo'li</p>
              <p><strong className="text-emerald-400">φᵢ(k)</strong> — faza siljishi (yutuvchi va sochuvchi atomlar uchun)</p>
            </div>
          </div>
        </div>

        {/* 3. XANES — PRE-EDGE */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 XANES — pre-edge piklar va oksidlanish darajasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-emerald-400">Pre-edge piklar</strong> (yutilish chegarasidan oldingi kuchsiz signallar) 
            metall markazining <strong>elektron konfiguratsiyasi, koordinatsion geometriyasi va spin holati</strong> 
            haqida noyob ma'lumot beradi. Ayniqsa, birinchi qator o'tish metallari (Fe, Co, Ni, Cu) uchun juda informativ.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-emerald-400 font-bold mb-3">Fe K-chegara pre-edge ma'lumotlari:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Birikma / Ion</th>
                  <th className="py-3 px-4 text-purple-300">Oks. darajasi</th>
                  <th className="py-3 px-4 text-purple-300">Pre-edge energiya (eV)</th>
                  <th className="py-3 px-4 text-purple-300">Pre-edge intensivlik</th>
                  <th className="py-3 px-4 text-purple-300">Geometriya</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["[Fe(H₂O)₆]²⁺", "Fe²⁺ HS", "7112.0", "Kuchsiz (~0.05)", "Oktaedrik"],
                    ["[Fe(H₂O)₆]³⁺", "Fe³⁺ HS", "7113.5", "Kuchsiz (~0.05)", "Oktaedrik"],
                    ["K₄[Fe(CN)₆]", "Fe²⁺ LS", "7111.8", "O'rtacha (~0.10)", "Oktaedrik"],
                    ["K₃[Fe(CN)₆]", "Fe³⁺ LS", "7113.0", "O'rtacha (~0.12)", "Oktaedrik"],
                    ["[FeCl₄]²⁻", "Fe²⁺ HS", "7112.5", "Kuchli (~0.25)", "Tetraedrik"],
                    ["[Fe(CO)₅]", "Fe⁰", "7110.5", "Kuchsiz (~0.03)", "Trigonal bipiramidal"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3 font-bold text-emerald-400 text-xs">{r[0]}</td>
                      <td className="py-2 px-3 text-xs">{r[1]}</td>
                      <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[2]}</td>
                      <td className="py-2 px-3 text-xs">{r[3]}</td>
                      <td className="py-2 px-3 text-xs">{r[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-purple-400 text-xs mt-3">
              * Pre-edge intensivlik — 1s → 3d o'tishning dipol taqiqlanganligi tufayli oktaedrik komplekslarda kuchsiz, 
              tetraedrik komplekslarda p-d aralashuvi hisobiga kuchliroq bo'ladi.
            </p>
          </div>
        </div>

        {/* 4. EXAFS — KOMPLEKSLAR UCHUN MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Komplekslar uchun EXAFS strukturaviy parametrlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            EXAFS tahlili natijasida olingan strukturaviy parametrlar. Bu qiymatlar rentgen difraksiyasi 
            natijalari bilan solishtirilganda, eritmadagi va qattiq fazadagi struktura farqlarini ko'rsatadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Bog'</th>
                <th className="py-3 px-4 text-purple-300">N (koord. son)</th>
                <th className="py-3 px-4 text-purple-300">R (Å)</th>
                <th className="py-3 px-4 text-purple-300">σ² (Å²)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Fe(CN)₆]⁴⁻", "Fe−C", "6.0", "1.918", "0.0015"],
                  ["[Fe(CN)₆]³⁻", "Fe−C", "6.0", "1.942", "0.0018"],
                  ["[Cu(H₂O)₆]²⁺", "Cu−O(ekv)", "4.0", "1.968", "0.0022"],
                  ["[Cu(H₂O)₆]²⁺", "Cu−O(aks)", "2.0", "2.275", "0.0035"],
                  ["[Co(NH₃)₆]³⁺", "Co−N", "6.0", "1.961", "0.0012"],
                  ["[Ni(CN)₄]²⁻", "Ni−C", "4.0", "1.858", "0.0014"],
                  ["[PtCl₂(NH₃)₂]", "Pt−Cl", "2.0", "2.328", "0.0016"],
                  ["[PtCl₂(NH₃)₂]", "Pt−N", "2.0", "2.012", "0.0015"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-bold text-emerald-400 text-xs">{r[0]}</td>
                    <td className="py-2 px-3 text-xs">{r[1]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 font-mono text-green-400 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 font-mono text-purple-300 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. AFZALLIKLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 EXAFS/XANES — afzalliklari va rentgen difraksiyasidan farqi</h2>
          
          <div className="space-y-4">
            {[
              {
                title: "1. Kristall talab qilinmaydi",
                desc: "Rentgen difraksiyasidan farqli o'laroq, EXAFS amorf moddalar, nanozarrachalar, eritmalar va hatto biologik namunalar uchun ham ishlaydi. Bu komplekslarni eritmadagi haqiqiy holatida o'rganish imkonini beradi."
              },
              {
                title: "2. Element-selektiv tahlil",
                desc: "Yutilish chegarasi energiyasini tanlab, faqat ma'lum metall atrofidagi mahalliy strukturani o'rganish mumkin. Ko'p komponentli sistemalarda har bir metall uchun alohida EXAFS spektri olinadi."
              },
              {
                title: "3. Yuqori aniqlikdagi bog' uzunliklari",
                desc: "EXAFS bog' uzunliklarini ±0.01 Å aniqlikda beradi — bu rentgen difraksiyasidan ham yuqori aniqlik. Ayniqsa, birinchi koordinatsion qobiq uchun juda ishonchli."
              },
              {
                title: "4. Senkrotron nurlanishi — cheklov",
                desc: "EXAFS/XANES uchun yuqori intensivlikdagi sozlanuvchan rentgen nurlanishi kerak — bu faqat senkrotron manbalarida mavjud. Shu sababli, bu usul keng tarqalmagan, lekin ilmiy tadqiqotlarda juda muhim."
              },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-emerald-400 font-bold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-600/10 to-purple-600/10 border border-emerald-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>XANES — <strong className="text-emerald-400">oksidlanish darajasi, geometriya va elektron konfiguratsiyani</strong> aniqlaydi</li>
            <li>EXAFS — <strong className="text-emerald-400">bog' uzunliklari (±0.01 Å), koordinatsion son va Debay-Uoller faktorlarini</strong> beradi</li>
            <li>Kristall bo'lmagan moddalar, eritmalar va amorf materiallar uchun <strong className="text-emerald-400">yagona strukturaviy usul</strong></li>
            <li>Element-selektiv — <strong className="text-emerald-400">har bir metall atrofidagi mahalliy struktura</strong> alohida o'rganiladi</li>
            <li>Senkrotron nurlanishi talab qilinadi — <strong className="text-emerald-400">keng tarqalmagan, lekin ilmiy jihatdan juda muhim</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/rentgen" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Rentgen difraksiyasi</Link>
          <Link href="/ilmiy/tahlil/aas" className="px-6 py-3 bg-emerald-600/80 rounded-xl hover:bg-emerald-500 text-white font-semibold">AAS →</Link>
        </div>

      </section>
    </main>
  )
}