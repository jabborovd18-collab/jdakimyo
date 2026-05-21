import Link from "next/link"

export default function MODiagrammaLMN() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Ligand maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📊 MO energiya diagrammasi</h1>
          <p className="text-purple-400 text-sm">Oktaedrik kompleks uchun to'liq MO diagrammasi • σ va π ta'sirni hisobga olgan holda</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oktaedrik kompleks MO diagrammasi haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">MO diagrammasi</strong> — ligand maydon nazariyasining eng muhim natijasi.
              Bu diagramma metall va ligand orbitallarining <strong className="text-yellow-400">simmetriya bo'yicha</strong> o'zaro ta'sirini 
              ko'rsatadi. Diagramma uch qismdan iborat: chapda <strong>metall orbitallari</strong>, o'rtada <strong>MO lar</strong>, 
              o'ngda <strong>ligand SALC lari</strong>. Oktaedrik kompleks uchun bu diagramma <strong className="text-yellow-400">barcha xossalarni</strong> tushuntirib beradi.
            </p>
          </div>
        </div>

        {/* 2. ASOSIY QISMLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏗️ MO diagrammasining tuzilishi</h2>
          
          <div className="space-y-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Chap qism — Metall orbitallari</h3>
              <p className="text-purple-200 text-sm mb-2">Chap tomonda metallning <strong>valent orbitallari</strong> energiya sathlari bo'yicha joylashgan:</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>3d</strong> (5 ta orbital) — o'rtacha energiya</li>
                <li>• <strong>4s</strong> (1 ta) — yuqoriroq energiya</li>
                <li>• <strong>4p</strong> (3 ta) — eng yuqori energiya</li>
                <li>• Barcha orbitallar <strong>ionlanish darajasiga qarab</strong> siljiydi</li>
              </ul>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">O'rta qism — Molekulyar orbitallar</h3>
              <p className="text-purple-200 text-sm mb-2">O'rtada metall va ligand orbitallari ta'sirlashib hosil qilgan <strong>MO lar</strong>:</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Bog'lovchi MO</strong> — past energiya (asosan ligand xarakterida)</li>
                <li>• <strong>Bog'lamaydigan MO (t₂g)</strong> — o'rtacha energiya (sof metall)</li>
                <li>• <strong>Bo'shashtiruvchi MO (eg*)</strong> — yuqori energiya (asosan metall xarakterida)</li>
              </ul>
            </div>

            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">O'ng qism — Ligand SALC lari</h3>
              <p className="text-purple-200 text-sm mb-2">O'ng tomonda ligand orbitallarining <strong>simmetriya bo'yicha guruhlari</strong>:</p>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>a₁g</strong> — 1 ta (eng past energiya)</li>
                <li>• <strong>t₁u</strong> — 3 ta (o'rtacha)</li>
                <li>• <strong>eg</strong> — 2 ta (yuqoriroq)</li>
                <li>• <strong>t₂g</strong> — mos kelmaydi, ta'sirlashmaydi!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. ENERGIYA SATHLARI — TO'LIQ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 To'liq MO energiya sathlari (pastdan yuqoriga)</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">#</th>
                <th className="py-3 px-4 text-purple-300">MO belgisi</th>
                <th className="py-3 px-4 text-purple-300">Turi</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Soni</th>
                <th className="py-3 px-4 text-purple-300">Elektronlar</th>
                <th className="py-3 px-4 text-purple-300">Xarakteri</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["1","1a₁g","Bog'lovchi","a₁g","1","2 e⁻","Asosan ligand (s) — eng past"],
                  ["2","1t₁u","Bog'lovchi","t₁u","3","6 e⁻","Asosan ligand (p) — past"],
                  ["3","1eg","Bog'lovchi","eg","2","4 e⁻","Ligand + Metall aralash"],
                  ["4","t₂g","Bog'lamaydigan","t₂g","3","d-e⁻ (1-10)","Sof metall — KMN dagi t₂g!"],
                  ["5","eg*","Bo'shashtiruvchi","eg","2","Bo'sh","Asosan metall — KMN dagi eg*!"],
                  ["6","t₁u*","Bo'shashtiruvchi","t₁u","3","Bo'sh","Asosan metall (p) — yuqori"],
                  ["7","a₁g*","Bo'shashtiruvchi","a₁g","1","Bo'sh","Asosan metall (s) — eng yuqori"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 font-mono text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-sm">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                    <td className="py-3 px-4 text-xs">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. ELEKTRONLAR TAQSIMOTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Elektronlarning MO larga joylashishi</h2>
          
          <div className="space-y-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Ligandlardan kelgan elektronlar (12 ta)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• a₁g (1σ): <strong>2 ta e⁻</strong></li>
                <li>• t₁u (3σ): <strong>6 ta e⁻</strong></li>
                <li>• eg (2σ): <strong>4 ta e⁻</strong></li>
                <li>• Jami: <strong>12 ta elektron</strong> — barcha bog'lovchi MO larni to'ldiradi</li>
              </ul>
            </div>

            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-5">
              <h3 className="text-gray-400 font-bold mb-2">Metall d-elektronlari (1−10 ta)</h3>
              <p className="text-purple-200 text-sm">
                Metallning d-elektronlari <strong>t₂g</strong> (bog'lamaydigan) va <strong>eg*</strong> (bo'shashtiruvchi) 
                orbitallarga joylashadi. Aynan shu elektronlar soni va taqsimoti kompleksning 
                <strong>magnit xossasi, rangi va barqarorligini</strong> belgilaydi.
              </p>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Misol: [Co(NH₃)₆]³⁺ (d⁶, quyi spin)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Ligandlardan: 6×NH₃ = <strong>12 ta e⁻</strong> → bog'lovchi MO larga</li>
                <li>• Co³⁺ dan: <strong>6 ta d-e⁻</strong></li>
                <li>• 6 ta d-e⁻ → <strong>t₂g⁶</strong> (barchasi juftlashgan)</li>
                <li>• eg* — <strong>bo'sh</strong></li>
                <li>• Natija: <strong>diamagnit</strong>, rangi sariq</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. KMN BILAN BOG'LIQLIGI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 LMN MO diagrammasi va KMN bog'liqligi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Qiziqarlisi shundaki, LMN MO diagrammasidagi <strong>t₂g va eg*</strong> orbitallar 
            <strong className="text-yellow-400">KMN dagi t₂g va eg orbitallarga aynan mos keladi</strong>!
            KMN soddalashtirilgan model bo'lib, faqat shu ikkita sathga e'tibor beradi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
            <p className="text-xl font-extrabold text-yellow-400">Δo = E(eg*) − E(t₂g)</p>
            <p className="text-purple-300 text-sm mt-2">
              Bu farq <strong>LMN da hisoblanishi</strong>, KMN da esa faqat <strong>empirik o'lchanishi</strong> mumkin.
              LMN ning KMN dan asosiy ustunligi ham shunda!
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>MO diagrammasi <strong className="text-yellow-400">3 qismdan</strong> iborat: metall, MO, ligand SALC</li>
            <li>Jami <strong>7 ta energetik sath</strong> (4 bog'lovchi/ bog'lamaydigan + 3 bo'shashtiruvchi)</li>
            <li>Ligandlardan <strong>12 ta elektron</strong> bog'lovchi MO larga joylashadi</li>
            <li>t₂g va eg* — <strong>KMN bilan bir xil</strong>, lekin LMN da nazariy hisoblanadi</li>
            <li>Δo = E(eg*) − E(t₂g) — <strong>LMN da hisoblash mumkin</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/pi-boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← π-bog'lanish</Link>
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/kmn-vs-lmn" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">KMN vs LMN →</Link>
        </div>

      </section>
    </main>
  )
}