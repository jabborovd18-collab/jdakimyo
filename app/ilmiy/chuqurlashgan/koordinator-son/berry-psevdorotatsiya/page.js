import Link from "next/link"

export default function BerryPsevdorotatsiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🔄 Berry psevdorotatsiyasi</h1>
          <p className="text-purple-400 text-sm">TBP ↔ Kvadrat piramida • Fe(CO)₅ misolida • NMR vaqt shkalasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Berry psevdorotatsiyasi haqida</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-orange-400">Berry psevdorotatsiyasi</strong> — Stephen Berry tomonidan 1960-yilda 
              taklif qilingan mexanizm. Bu jarayonda <strong className="text-orange-400">trigonal bipiramida (TBP)</strong> 
              va <strong className="text-orange-400">kvadrat piramida</strong> geometriyalari bir-biriga 
              <strong>past energetik to'siq</strong> (~2−5 kJ/mol) orqali o'tadi. 
              Bu mexanizm KCh=5 komplekslarda ligandlarning <strong>ekvivalent pozitsiyalar</strong> orasida 
              almashinishini tushuntiradi — NMR spektroskopiyasida barcha ligandlar 
              <strong>ekvivalent signal</strong> berishining sababi shu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Mexanizm bosqichlari</h3>
              <ol className="text-purple-200 text-sm space-y-2 list-decimal list-inside">
                <li><strong>Boshlang'ich holat:</strong> TBP — 3 ekvatorial + 2 aksial ligand</li>
                <li><strong>Ekvatorial juft siqiladi:</strong> Ikkita ekvatorial ligand bir-biriga yaqinlashadi (120° → ~105°)</li>
                <li><strong>Aksial juft ochiladi:</strong> Ikkita aksial ligand burchagi 180° dan ~150° gacha kamayadi</li>
                <li><strong>Oraliq holat:</strong> Kvadrat piramida — 4 bazal + 1 apikal ligand</li>
                <li><strong>Davom etishi:</strong> Yangi ekvatorial ligandlar almashgan holda TBP qayta hosil bo'ladi</li>
              </ol>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Muhim xususiyatlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Energetik to'siq:</strong> ~2−5 kJ/mol (juda past!)</li>
                <li>• <strong>Xona haroratida:</strong> Doimiy ravishda sodir bo'ladi</li>
                <li>• <strong>NMR vaqt shkalasida:</strong> Barcha 5 ta ligand ekvivalent signal beradi</li>
                <li>• <strong>Past haroratda:</strong> TBP va kvadrat piramida alohida kuzatiladi</li>
                <li>• <strong>Qattiq fazada:</strong> Kristall maydon bir geometriyani "muzlatadi"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Fe(CO)₅ MISOLIDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol: Fe(CO)₅</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm mb-3">
              <strong className="text-orange-400">Fe(CO)₅</strong> — Berry psevdorotatsiyasining eng klassik namunasi.
              Bu molekula <strong>D₃h simmetriyali TBP</strong> geometriyaga ega: 3 ta CO ekvatorial tekislikda (120°), 
              2 ta CO aksial o'qda (180°).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center text-xs">
              {[
                { label: "Ekvatorial CO", value: "3 ta", detail: "Fe−C = 1.812 Å, ∠C−Fe−C = 120°" },
                { label: "Aksial CO", value: "2 ta", detail: "Fe−C = 1.828 Å, ∠C−Fe−C = 180°" },
                { label: "Berry to'sig'i", value: "~3 kJ/mol", detail: "Xona haroratida doimiy harakat" },
              ].map((r, i) => (
                <div key={i} className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-3">
                  <p className="text-orange-400 font-bold">{r.label}</p>
                  <p className="text-white font-mono mt-1">{r.value}</p>
                  <p className="text-purple-400 mt-1">{r.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">NMR dalili — nima uchun ¹³C NMR da bitta signal?</h3>
            <p className="text-purple-200 text-sm">
              Agar Berry psevdorotatsiyasi bo'lmaganda, Fe(CO)₅ ning ¹³C NMR spektrida 
              <strong>ikkita signal</strong> kuzatilishi kerak edi: biri ekvatorial CO uchun (3 ta C), 
              ikkinchisi aksial CO uchun (2 ta C). Ammo xona haroratida <strong>faqat bitta signal</strong> 
              kuzatiladi — barcha 5 ta CO ekvivalent! Bu Berry psevdorotatsiyasi tufayli 
              aksial va ekvatorial CO ligandlari NMR vaqt shkalasida (~10⁻² s) tez almashinadi.
              <strong>Past haroratda (−100°C)</strong> Berry psevdorotatsiyasi sekinlashadi va 
              ikkita alohida signal kuzatiladi.
            </p>
          </div>
        </div>

        {/* 3. BOSHQA MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Boshqa Berry faol komplekslar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Barqaror geometriya</th>
                <th className="py-3 px-4 text-purple-300">Berry to'sig'i</th>
                <th className="py-3 px-4 text-purple-300">NMR xususiyati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe(CO)₅", "Fe⁰ (d⁸)", "TBP (D₃h)", "~3 kJ/mol", "1 signal (¹³C, 298 K)"],
                  ["PF₅", "P(V) (d⁰)", "TBP (D₃h)", "~4 kJ/mol", "1 signal (¹⁹F, 298 K)"],
                  ["[CuCl₅]³⁻", "Cu²⁺ (d⁹)", "TBP + Yahn-Teller", "~5 kJ/mol", "Murakkab — YT hissasi"],
                  ["[Fe(CO)₄(PPh₃)]", "Fe⁰ (d⁸)", "TBP (PPh₃ ekvatorial)", "~8 kJ/mol", "PPh₃ ekv. pozitsiyada"],
                  ["[CdCl₅]³⁻", "Cd²⁺ (d¹⁰)", "TBP (D₃h)", "~2 kJ/mol", "1 signal — juda tez"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-orange-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. TBP vs KVADRAT PIRAMIDA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ TBP vs Kvadrat piramida — energetik farq</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-400 font-bold mb-3">TBP (D₃h) — Ko'pincha barqarorroq</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Ligandlar orasidagi masofa:</strong> Kattaroq (sterik afzal)</li>
                <li>• <strong>d⁸, d¹⁰ konfiguratsiyalar:</strong> TBP afzal</li>
                <li>• <strong>Kuchli π-akseptorlar:</strong> Ekvatorial pozitsiyani egallaydi</li>
                <li>• <strong>Ekvatorial ligandlar:</strong> 120° burchak — keng joy</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">Kvadrat piramida (C₄v)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>d⁹ (Cu²⁺) — Yahn-Teller:</strong> Kvadrat piramida afzal</li>
                <li>• <strong>Kuchli σ-donor apikal:</strong> Apikal bog' mustahkam</li>
                <li>• <strong>Okso komplekslar:</strong> M=O apikal (VO²⁺, MoO³⁺)</li>
                <li>• <strong>Bazal ligandlar:</strong> 90° burchak — torroq joy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Berry psevdorotatsiyasi — <strong className="text-orange-400">TBP ↔ kvadrat piramida</strong> o'tish mexanizmi</li>
            <li>Energetik to'siq juda past (~2−5 kJ/mol) — <strong className="text-orange-400">xona haroratida doimiy</strong></li>
            <li>Fe(CO)₅ — <strong className="text-orange-400">klassik misol</strong>, ¹³C NMR da bitta signal</li>
            <li>Past haroratda Berry <strong className="text-orange-400">"muzlaydi"</strong> — alohida signallar kuzatiladi</li>
            <li>KCh=5 komplekslarda <strong className="text-orange-400">fluxionallik</strong> ning asosiy sababi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/vsepr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← VSEPR komplekslarda</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/yahn-teller-geometriya" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold">Yahn-Teller geometrik buzilishi →</Link>
        </div>

      </section>
    </main>
  )
}