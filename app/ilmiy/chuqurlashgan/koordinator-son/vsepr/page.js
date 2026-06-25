import Link from "next/link"

export default function VSEPRKomplekslarda() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📐 VSEPR komplekslarda</h1>
          <p className="text-purple-400 text-sm">Valent elektron juftlari itarilishi • Stereokimyoviy faol juftlar • Geometriya bashorati</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 VSEPR nazariyasi kompleks birikmalarda</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">VSEPR (Valence Shell Electron Pair Repulsion)</strong> — 
              Gillespie va Nyholm tomonidan 1957-yilda taklif qilingan. Asosiy g'oya: 
              <strong className="text-green-400"> valent qobiqdagi elektron juftlar</strong> (ham bog'lovchi, ham bo'linmagan) 
              bir-biridan imkon qadar uzoqlashishga intiladi. Kompleks birikmalarda VSEPR asosan 
              <strong className="text-green-400"> asosiy guruh elementlari va d¹⁰ metallar</strong> uchun yaxshi ishlaydi.
              O'tish metallari uchun <strong>KMN</strong> ko'proq ahamiyatga ega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">VSEPR asosiy qoidalari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Elektron juftlar itariladi</strong> — maksimal masofaga intiladi</li>
                <li>• <strong>Bo'linmagan juftlar</strong> (lone pair) bog'lovchi juftlardan kuchliroq itariladi</li>
                <li>• <strong>Karrali bog'lar</strong> oddiy bog'lardan ko'proq fazo egallaydi</li>
                <li>• <strong>Elektrmanfiy ligandlar</strong> kichikroq burchaklarga olib keladi</li>
                <li>• <strong>Stereokimyoviy faol</strong> bo'linmagan juft geometriyani buzadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Komplekslar uchun cheklovlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>d-orbitallar ishtirokida</strong> VSEPR ishlamaydi (KMN kerak)</li>
                <li>• <strong>d¹⁰ metallar</strong> — VSEPR yaxshi ishlaydi (KMN=0)</li>
                <li>• <strong>Asosiy guruh komplekslari</strong> — VSEPR ideal</li>
                <li>• <strong>Yahn-Teller effekti</strong> — VSEPR bashorat qilmaydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. ELEKTRON JUFTLAR SONI BO'YICHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Elektron juftlar soni bo'yicha geometriyalar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Sterik son</th>
                <th className="py-3 px-4 text-purple-300">Elektron juftlar</th>
                <th className="py-3 px-4 text-purple-300">Asosiy geometriya</th>
                <th className="py-3 px-4 text-purple-300">Bo'linmagan juft</th>
                <th className="py-3 px-4 text-purple-300">Haqiqiy shakl</th>
                <th className="py-3 px-4 text-purple-300">Kompleks misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["2", "2 juft", "Chiziqli (180°)", "0", "Chiziqli", "[Ag(NH₃)₂]⁺ (d¹⁰)"],
                  ["3", "3 juft", "Uchburchak (120°)", "0", "Trigonal planar", "[Pt(PPh₃)₃] (d¹⁰)"],
                  ["4", "4 juft", "Tetraedrik (109.5°)", "0", "Tetraedrik", "[Zn(OH)₄]²⁻ (d¹⁰)"],
                  ["4", "4 juft", "Tetraedrik", "1", "Trigonal piramida", "[SnCl₃]⁻ (p-guruh)"],
                  ["4", "4 juft", "Tetraedrik", "2", "Burchakli (104.5°)", "[PbCl₂] (p-guruh)"],
                  ["5", "5 juft", "Trig. bipiramida", "0", "TBP", "[Fe(CO)₅] (d⁸)"],
                  ["5", "5 juft", "Trig. bipiramida", "1", "Teteraedr (SF₄ tipi)", "[SeF₄] (p-guruh)"],
                  ["6", "6 juft", "Oktaedrik (90°)", "0", "Oktaedrik", "[Co(NH₃)₆]³⁺"],
                  ["6", "6 juft", "Oktaedrik", "1", "Kvadrat piramida", "[VO(acac)₂]"],
                  ["6", "6 juft", "Oktaedrik", "2", "Kvadrat planar", "[XeF₄] (p-guruh)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-green-400">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. STEREOKIMYOVIY FAOL JUFTLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Stereokimyoviy faol vs nofaol bo'linmagan juftlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-400 font-bold mb-2">Stereokimyoviy FAOL juft</h3>
              <p className="text-purple-200 text-sm mb-2">Bo'linmagan juft geometriyani buzadi — ligandlarni siqib, burchaklarni o'zgartiradi.</p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• <strong>Asosiy guruh elementlari:</strong> Sn²⁺, Pb²⁺, Sb³⁺, Bi³⁺</li>
                <li>• ns² elektronlar — fazoda joy egallaydi</li>
                <li>• Misol: [SnCl₃]⁻ — trigonal piramida (tetraedr emas)</li>
                <li>• Misol: [PbCl₂] — burchakli (chiziqli emas)</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Stereokimyoviy NOFAOL juft</h3>
              <p className="text-purple-200 text-sm mb-2">Bo'linmagan juft geometriyaga ta'sir qilmaydi — sferik simmetrik.</p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• <strong>O'tish metallari:</strong> d-orbitallarga joylashgan</li>
                <li>• d-elektronlar ichki qobiqda — fazoda ko'rinmaydi</li>
                <li>• Misol: [Co(NH₃)₆]³⁺ — d⁶ LS, oktaedrik ideal</li>
                <li>• Misol: [Cr(H₂O)₆]³⁺ — d³, oktaedrik ideal</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-2">Nima uchun o'tish metallarida bo'linmagan juftlar stereokimyoviy nofaol?</h3>
            <p className="text-purple-200 text-sm">
              O'tish metallarida bo'linmagan elektron juftlar <strong>d-orbitallarda</strong> joylashgan.
              d-orbitallar ichki qobiq bo'lib, ularning elektron zichligi ligandlar tomon yo'nalmagan —
              sferik simmetrik taqsimlangan. Shu sababli ular ligandlarni "itarib" chiqarmaydi.
              Asosiy guruh elementlarida bo'linmagan juftlar <strong>tashqi s-orbitalda</strong> bo'lib,
              ligandlar tomon yo'nalgan — shuning uchun ular stereokimyoviy faol.
            </p>
          </div>
        </div>

        {/* 4. VSEPR vs KMN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ VSEPR vs KMN — komplekslar uchun taqqoslash</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { title: "VSEPR yaxshi", metals: "Asosiy guruh (s,p), d¹⁰ metallar", examples: "[Zn(OH)₄]²⁻ (tetraedr), [Ag(NH₃)₂]⁺ (chiziqli)", reason: "d-orbitallar to'liq to'lgan yoki yo'q" },
              { title: "KMN yaxshi", metals: "O'tish metallari (d¹−d⁹)", examples: "[Ni(CN)₄]²⁻ (kv. planar), [Co(NH₃)₆]³⁺ (oktaedr)", reason: "d-orbital bo'linishi geometriyani belgilaydi" },
              { title: "Ikkalasi ham", metals: "d⁸ konfiguratsiya", examples: "[NiCl₄]²⁻ (tetraedr — Kepert), [Ni(CN)₄]²⁻ (kv. planar — KMN)", reason: "Ligand maydon kuchiga bog'liq" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-green-400 font-bold mb-2">{r.title}</h3>
                <p className="text-purple-300 text-xs mb-2">{r.metals}</p>
                <p className="text-yellow-400 text-xs font-mono mb-2">{r.examples}</p>
                <p className="text-purple-400 text-xs">{r.reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>VSEPR — <strong className="text-green-400">asosiy guruh elementlari va d¹⁰ metallar</strong> uchun ideal model</li>
            <li>O'tish metallarida <strong className="text-green-400">KMN</strong> VSEPR dan ustun — d-orbitallar hisobga olinadi</li>
            <li>Bo'linmagan juftlar <strong className="text-yellow-400">asosiy guruhda stereokimyoviy faol</strong>, o'tish metallarida nofaol</li>
            <li>Eng yaxshi yondashuv: <strong className="text-green-400">VSEPR + KMN + Kepert</strong> birgalikda</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kepert-modeli" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Kepert modeli</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/berry-psevdorotatsiya" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Berry psevdorotatsiyasi →</Link>
        </div>

      </section>
    </main>
  )
}