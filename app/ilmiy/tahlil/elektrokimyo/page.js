import Link from "next/link"

export default function ElektrokimyoviyTahlil() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">⚡ Elektrokimyoviy tahlil</h1>
          <p className="text-purple-400 text-sm">Siklik voltamperometriya • Redoks potensiallar • Barqarorlik konstantasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* BIRIKMALAR SAHIFASIGA LINK */}
        <Link 
          href="/ilmiy/tahlil/elektrokimyo/birikmalar"
          className="group block bg-gradient-to-r from-cyan-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl p-6 hover:bg-cyan-900/60 hover:border-cyan-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">⚡</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-cyan-300 group-hover:text-cyan-200 transition-colors">
                Birikmalarning elektrokimyoviy tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalarning redoks xossalarini siklik voltamperometriya (CV) yordamida o'rganish.
                Redoks potensiallar, elektron ko'chish soni, barqarorlik konstantasi har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-cyan-300 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-cyan-600/20 text-cyan-300 border border-cyan-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Redoks potensiallar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">CV voltamperogramma</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Barqarorlik konstantasi</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Elektron ko'chish</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Elektrokimyoviy tahlil haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Elektrokimyoviy tahlil</strong> — kompleks birikmalarning 
              <strong className="text-yellow-400"> oksidlanish-qaytarilish xossalarini</strong> o'rganishda asosiy usul.
              Siklik voltamperometriya (CV) yordamida <strong className="text-yellow-400">redoks potensiallar</strong>, 
              <strong className="text-yellow-400"> elektron ko'chish soni</strong> va 
              <strong className="text-yellow-400"> barqarorlik konstantasi</strong> aniqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Redoks potensial</strong> (E₁/₂)</li>
                <li>• <strong>Elektron ko'chish soni</strong> (n)</li>
                <li>• <strong>Qaytariluvchanlik</strong> (qaytar/qaytmas)</li>
                <li>• <strong>Barqarorlik konstantasi</strong> (Kstab)</li>
                <li>• <strong>Ligand almashinish</strong> ta'siri</li>
                <li>• <strong>Metall oksidlanish darajasi</strong></li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Uch elektrodli</strong> tizim qo'llaniladi</li>
                <li>• Ishchi, yordamchi va <strong>solishtirma elektrod</strong></li>
                <li>• Potensial <strong>chiziqli o'zgartiriladi</strong></li>
                <li>• Tok <strong>potensialga bog'liq</strong> qayd etiladi</li>
                <li>• Natijada <strong>voltamperogramma</strong> hosil bo'ladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. SIKLIK VOLTAMPEROMETRIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Siklik voltamperometriya (CV)</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-yellow-400">Siklik voltamperometriya</strong> — eng ko'p qo'llaniladigan 
            elektrokimyoviy usul. Potensial uchburchak shaklida o'zgartiriladi: oldinga va orqaga.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-3">Qaytar sistemada:</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• Anod va katod <strong>piklar</strong> kuzatiladi</li>
                <li>• ΔE = Epa − Epc = <strong>59/n mV</strong></li>
                <li>• Ipa/Ipc ≈ <strong>1</strong></li>
                <li>• Pik toki <strong>√v ga proporsional</strong></li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">Qaytmas sistemada:</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• <strong>Faqat bitta pik</strong> (anod yoki katod)</li>
                <li>• ΔE {'>'} 59/n mV</li>
                <li>• Piklar <strong>keng va yassi</strong></li>
                <li>• Elektron ko'chish <strong>sekin</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. KOMPLEKSLAR UCHUN MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kompleks birikmalarning redoks potensiallari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Redoks juftlik</th>
                <th className="py-3 px-4 text-purple-300">E° (V)</th>
                <th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Fe(CN)₆]³⁻/⁴⁻", "+0.36", "CN⁻ kuchli maydon — Fe³⁺ barqaror"],
                  ["[Fe(H₂O)₆]³⁺/²⁺", "+0.77", "H₂O kuchsiz maydon — Fe²⁺ barqaror"],
                  ["[Co(NH₃)₆]³⁺/²⁺", "+0.10", "NH₃ kuchli maydon — Co³⁺ juda barqaror"],
                  ["[Co(H₂O)₆]³⁺/²⁺", "+1.82", "Co³⁺ akvakompleksi kuchli oksidlovchi"],
                  ["[Cu(NH₃)₄]²⁺/⁺", "−0.01", "NH₃ Cu⁺ ni barqarorlashtiradi"],
                  ["[Ru(NH₃)₆]³⁺/²⁺", "+0.10", "Ru — 4d metall, inert"],
                  ["[Fe(C₅H₅)₂]⁺/⁰", "+0.40", "Ferrosen — qaytar redoks indikator"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-cyan-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. FERROSEN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Ferrosen — ideal elektrokimyoviy standart</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-4">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ferrosen [Fe(C₅H₅)₂]</strong> — elektrokimyoda 
              <strong className="text-yellow-400"> ichki standart</strong> sifatida ishlatiladi. 
              Qaytar bir elektronli oksidlanish (Fe²⁺ ⇄ Fe³⁺), potensial erituvchiga bog'liq emas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-cyan-400 font-bold mb-1">Ferrosen</div>
              <div className="text-purple-200">Fe²⁺ (d⁶)</div>
              <div className="text-purple-300 text-xs">18 elektron</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-yellow-400 font-bold mb-1">⇄ −e⁻</div>
              <div className="text-purple-200">Qaytar</div>
              <div className="text-purple-300 text-xs">E° ≈ +0.40 V</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-blue-400 font-bold mb-1">Ferroseniy</div>
              <div className="text-purple-200">Fe³⁺ (d⁵)</div>
              <div className="text-purple-300 text-xs">17 elektron</div>
            </div>
          </div>
        </div>

        {/* 5. BARQARORLIK KONSTANTASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Elektrokimyodan barqarorlik konstantasini hisoblash</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Metall ioniga ligand qo'shilganda <strong className="text-yellow-400">redoks potensial siljiydi</strong>.
            Bu siljishdan <strong className="text-yellow-400">barqarorlik konstantasi (Kstab)</strong> hisoblanadi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">Nernst tenglamasi orqali:</h3>
            <p className="text-purple-200 text-sm mb-3">ΔE° = (0.059/n) × log(K<sub>oks</sub>/K<sub>qayt</sub>)</p>
            <p className="text-purple-300 text-sm">
              <strong>Misol:</strong> [Fe(CN)₆]³⁻/⁴⁻ uchun E° ulchab, Kstab hisoblanadi.
              Kstab([Fe(CN)₆]⁴⁻) ≈ 10³⁵, Kstab([Fe(CN)₆]³⁻) ≈ 10⁴².
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Siklik voltamperometriya — <strong className="text-yellow-400">redoks xossalarini o'rganishda</strong> asosiy usul</li>
            <li>Ligand qo'shilganda potensial siljiydi — <strong>Kstab hisoblanadi</strong></li>
            <li>Ferrosen — <strong>universal ichki standart</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/magnit" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Magnit o'lchashlar</Link>
          <Link href="/ilmiy/tahlil/termik" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold">Termik tahlil →</Link>
        </div>

      </section>
    </main>
  )
}