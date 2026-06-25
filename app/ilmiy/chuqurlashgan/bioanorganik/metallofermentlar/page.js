"use client"

import Link from "next/link"

export default function Metallofermentlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/xlorofil" className="text-purple-400 hover:text-purple-300 text-lg">← Metalloproteinlar</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">⚡ Metallofermentlar</h1>
          <p className="text-purple-400 text-sm">Karboangidraza • SOD • Katalaza • Nitrogenaza • Gidrogenaza • P450</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metallofermentlar — metall katalizatori fermentlar</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-amber-400">Metallofermentlar</strong> — 
              faol markazida <strong>metall ioni</strong> saqlovchi va 
              <strong> katalitik funksiyani</strong> bajaruvchi fermentlar.
              Barcha fermentlarning <strong>~1/3 qismi</strong> metallofermentlardir.
              Metall ioni <strong>substratni faollashtiradi</strong>, 
              <strong> o'tish holatini stabillashtiradi</strong> yoki 
              <strong> redoks reaksiyalarda</strong> elektron tashiydi.
              Koordinatsion birikmalar kimyosi bu fermentlarning mexanizmini 
              tushunish uchun <strong>kalit</strong> hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Metall ionlarining katalitik roli</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Lyuis kislotasi:</strong> Zn²⁺ karboangidrazada — substratni qutblaydi</li>
                <li>• <strong>Redoks markaz:</strong> Fe, Cu — elektron tashish</li>
                <li>• <strong>O₂ aktivatsiyasi:</strong> Fe, Cu — monooksigenazalar, oksidazalar</li>
                <li>• <strong>Nukleofil yaratish:</strong> Zn−OH — kuchli nukleofil</li>
                <li>• <strong>Struktura:</strong> Zn — rux barmoq fermentlarida</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">KB nazariyasi bilan bog'liqlik</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Geometriya:</strong> oktaedr (Fe, Cu), tetraedr (Zn), kvadrat piramida</li>
                <li>• <strong>Ligandlar:</strong> His, Cys, Asp, Glu, H₂O — O, N, S donorlar</li>
                <li>• <strong>Kristall maydon:</strong> CFSE geometriyani belgilaydi</li>
                <li>• <strong>Koordinatsion son:</strong> 4 (Zn), 5 (Fe P450), 6 (Fe, Cu)</li>
                <li>• <strong>Ko'p yadroli:</strong> Fe-S, Mn₄Ca, FeMo — klaster markazlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAVZULAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Metalloferment turlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/karboangidraza" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🫁</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Karboangidraza</h3>
              <p className="text-purple-300 text-xs mt-2">
                Zn²⁺ • Tetraedrik • CO₂ ↔ HCO₃⁻ • Eng tezkor fermentlardan biri
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/superoksid-dismutaza" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🛡️</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Superoksid dismutaza</h3>
              <p className="text-purple-300 text-xs mt-2">
                Cu,Zn / Mn / Fe • Antioksidant • O₂⁻ dismutatsiyasi
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/katalaza" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💥</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Katalaza</h3>
              <p className="text-purple-300 text-xs mt-2">
                Fe³⁺-gem • H₂O₂ → H₂O + O₂ • Eng tezkor ferment
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/nitrogenaza" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Nitrogenaza</h3>
              <p className="text-purple-300 text-xs mt-2">
                FeMo-kofaktor • N₂ → NH₃ • 8e⁻ + 8H⁺ • ATP sarflanadi
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/gidrogenaza" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💧</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Gidrogenaza</h3>
              <p className="text-purple-300 text-xs mt-2">
                [NiFe] / [FeFe] • H₂ ↔ 2H⁺ + 2e⁻ • CO, CN⁻ ligandlar
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/sitoxrom-p450" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💊</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">Sitoxrom P450</h3>
              <p className="text-purple-300 text-xs mt-2">
                Fe³⁺-gem • Tiolat ligand • Monooksigenaza • Dori metabolizmi
              </p>
            </Link>

          </div>
        </div>

        {/* SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Asosiy metallofermentlar solishtirilishi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-3 text-yellow-400">Ferment</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Metall</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Geometriya</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Reaksiya</th>
                  <th className="text-left py-3 px-3 text-yellow-400">k_cat (s⁻¹)</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-xs">
                {[
                  ["Karboangidraza", "Zn²⁺", "Tetraedr", "CO₂ + H₂O → HCO₃⁻ + H⁺", "~10⁶"],
                  ["SOD (Cu,Zn)", "Cu²⁺, Zn²⁺", "Oktaedr (Cu), Tetraedr (Zn)", "2O₂⁻ + 2H⁺ → H₂O₂ + O₂", "~2×10⁹"],
                  ["Katalaza", "Fe³⁺", "Oktaedr (gem)", "2H₂O₂ → 2H₂O + O₂", "~10⁷"],
                  ["Nitrogenaza", "Fe, Mo", "Ko'p yadroli klaster", "N₂ + 8H⁺ + 8e⁻ → 2NH₃ + H₂", "~5 (sekin)"],
                  ["Gidrogenaza [NiFe]", "Ni²⁺, Fe²⁺", "Oktaedr (Fe), Kvadrat piramida (Ni)", "H₂ ↔ 2H⁺ + 2e⁻", "~10⁴"],
                  ["P450", "Fe³⁺", "Kvadrat piramida (tiolat)", "R−H + O₂ → R−OH + H₂O", "~1-100"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3"><strong className="text-amber-400">{row[0]}</strong></td>
                    <td className="py-2 px-3">{row[1]}</td>
                    <td className="py-2 px-3">{row[2]}</td>
                    <td className="py-2 px-3">{row[3]}</td>
                    <td className="py-2 px-3 text-amber-300">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ENTTATIK HOLAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Entatik holat — metallofermentlarning siri</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-5">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-amber-400">Entatik holat</strong> — 
              metalloferment faol markazining <strong>"taranglashgan"</strong> holati.
              Oqsil strukturasi metall markazini <strong>o'tish holati geometriyasiga</strong> 
              yaqinlashtiradi. Bu <strong className="text-yellow-400">koordinatsion birikmalar</strong> 
              kimyosi nuqtai nazaridan: ligand maydoni, koordinatsion son va geometriya 
              <strong> optimal tarzda buzilgan</strong> — bu esa reaksiyaning 
              aktivatsiya energiyasini keskin kamaytiradi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">Karboangidraza</p>
                <p className="text-purple-200">Zn−OH geometriyasi — tetraedrikdan buzilgan, suvni qutblash uchun ideal</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">SOD</p>
                <p className="text-purple-200">Cu geometriyasi — oktaedr va kvadrat piramida orasida, O₂⁻ ni bog'lashga tayyor</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold">P450</p>
                <p className="text-purple-200">Fe³⁺-tiolat — S⁻ ligand kuchli donor, O−O bog'ini faollashtiradi</p>
              </div>
            </div>
          </div>
        </div>

        {/* REDOKS POTENSIALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Redoks potensiallar — oqsil muhitining ta'siri</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              <strong className="text-yellow-400">KB ning asosiy tushunchasi:</strong> 
              Metall ionining redoks potensiali <strong>ligand muhiti</strong> bilan 
              keskin o'zgaradi. Metallofermentlarda oqsil strukturasi bu potensialni 
              <strong> nozik sozlaydi</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold mb-1">Sitoxrom c:</p>
                <p className="text-purple-200">
                  Fe³⁺/Fe²⁺: +0.26 V — Met/His ligandlar orqali sozlangan.
                  Erkin Fe³⁺/Fe²⁺ juftligi: +0.77 V. Oqsil potensialni <strong>500 mV ga pasaytirgan!</strong>
                </p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-amber-400 font-bold mb-1">P450:</p>
                <p className="text-purple-200">
                  Fe³⁺/Fe²⁺: −0.3 V — tiolat (S⁻) ligand <strong>kuchli elektron donor</strong>.
                  Potensialni juda manfiy qiladi — O₂ ni faollashtirish uchun kerak.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metalloproteinlar/xlorofil" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Xlorofil</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/karboangidraza" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Karboangidraza →</Link>
        </div>

      </section>
    </main>
  )
}