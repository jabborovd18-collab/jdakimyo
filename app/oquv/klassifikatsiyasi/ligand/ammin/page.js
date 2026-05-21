import Link from "next/link"

export default function Ammiakatlar() {
  const misollar = [
    { formula: "[Ag(NH₃)₂]⁺", nomi: "diamminkumush(I) ioni", ks: "2", rang: "Rangsiz", rangCode: "text-gray-400" },
    { formula: "[Cu(NH₃)₄]²⁺", nomi: "tetraamminmis(II) ioni", ks: "4", rang: "To'q ko'k", rangCode: "text-blue-400" },
    { formula: "[Zn(NH₃)₄]²⁺", nomi: "tetraamminrux(II) ioni", ks: "4", rang: "Rangsiz", rangCode: "text-gray-400" },
    { formula: "[Co(NH₃)₆]³⁺", nomi: "geksaamminkobalt(III) ioni", ks: "6", rang: "Sariq-zarg'aldoq", rangCode: "text-yellow-400" },
    { formula: "[Cr(NH₃)₆]³⁺", nomi: "geksaamminxrom(III) ioni", ks: "6", rang: "Sariq", rangCode: "text-yellow-400" },
    { formula: "[Ni(NH₃)₆]²⁺", nomi: "geksaamminikel(II) ioni", ks: "6", rang: "Binafsha", rangCode: "text-purple-400" },
  ]

  const vernerJadvali = [
    { formula: "[Co(NH₃)₆]Cl₃", nomi: "geksaamminkobalt(III) xlorid", rang: "Zarg'aldoq-sariq", rangCode: "text-yellow-400", agcl: "3 mol" },
    { formula: "[Co(NH₃)₅Cl]Cl₂", nomi: "xloropentaamminkobalt(III) xlorid", rang: "Pushti", rangCode: "text-pink-400", agcl: "2 mol" },
    { formula: "[Co(NH₃)₄Cl₂]Cl", nomi: "dixlorotetraamminkobalt(III) xlorid", rang: "Yashil", rangCode: "text-green-400", agcl: "1 mol" },
    { formula: "[Co(NH₃)₃Cl₃]", nomi: "trixlorotriaminkobalt(III)", rang: "Yashil", rangCode: "text-green-400", agcl: "0 mol" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧪 Ammiakatlar</h1>
          <p className="text-purple-400 text-sm">Ligand: NH₃ (ammiak) • Koordinatsion son: 2, 4 yoki 6 • Verner klassikasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ammiakatlar haqida</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ammiakatlar</strong> (ammin komplekslar) — ligandi 
              <strong className="text-yellow-400"> ammiak (NH₃)</strong> bo'lgan kompleks birikmalardir. 
              Ammiak molekulasi azot atomidagi taqsimlanmagan elektron jufti orqali markaziy metall ioniga 
              koordinatsion bog' hosil qiladi. Ammiakatlar <strong className="text-yellow-400">Verner davridan beri</strong> eng yaxshi o'rganilgan komplekslar qatoriga kiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Ligand:</strong> NH₃ — ammin (IUPAC)</li>
                <li>• <strong>Donor atom:</strong> Azot (N)</li>
                <li>• <strong>Turi:</strong> Monodentat, neytral</li>
                <li>• <strong>Koordinatsion son:</strong> 2, 4 yoki 6</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• NH₃ — o'rtacha kuchli ligand</li>
                <li>• Suvdan kuchliroq ligand</li>
                <li>• Akvakompleksdan ammiakatga o'tganda rang o'zgaradi</li>
                <li>• [Co(NH₃)₆]³⁺ juda barqaror</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim ammiakat komplekslari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">KS</th>
                  <th className="py-3 px-4 text-purple-300">Rangi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {misollar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-cyan-400">{m.formula}</td>
                    <td className="py-3 px-4">{m.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{m.ks}</td>
                    <td className={`py-3 px-4 ${m.rangCode} font-semibold`}>{m.rang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. VERNER KLASSIKASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏛️ Vernerning klassik kobalt(III) ammiakatlari</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Alfred Verner aynan shu birikmalarni o'rganib, kompleks birikmalar nazariyasini yaratgan. 
            U AgNO₃ bilan bergan cho'kma miqdoriga qarab, ichki va tashqi sfera mavjudligini isbotlagan.
          </p>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Rangi</th>
                  <th className="py-3 px-4 text-purple-300">AgCl</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {vernerJadvali.map((v, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-cyan-400">{v.formula}</td>
                    <td className="py-3 px-4">{v.nomi}</td>
                    <td className={`py-3 px-4 ${v.rangCode} font-semibold`}>{v.rang}</td>
                    <td className="py-3 px-4 text-yellow-400 font-bold">{v.agcl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <h3 className="text-yellow-400 font-bold mb-2">🔍 Verner xulosasi</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              AgNO₃ bilan bergan AgCl cho'kmasi miqdori tashqi sferadagi xlorid ionlari soniga teng. 
              Ichki sferadagi Cl⁻ cho'kmaga tushmaydi. Bu esa <strong className="text-yellow-400">ichki va tashqi sfera</strong> mavjudligini isbotlaydi.
            </p>
          </div>
        </div>

        {/* 4. TOLLENS REAKTIVI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Kumush ammiakat — Tollens reaktivi</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-cyan-400">[Ag(NH₃)₂]OH</strong> — <strong>diamminkumush(I) gidroksid</strong> — 
              Tollens reaktivi sifatida mashhur. Organik kimyoda aldegidlarni aniqlashda ishlatiladi.
            </p>
          </div>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <h3 className="text-yellow-400 font-bold mb-2">Hosil bo'lish reaksiyasi</h3>
            <div className="font-mono text-purple-200 text-sm space-y-1">
              <p>AgNO₃ + NaOH → AgOH↓ + NaNO₃</p>
              <p>AgOH + 2NH₃ → <strong className="text-yellow-400">[Ag(NH₃)₂]OH</strong></p>
            </div>
          </div>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">
              <strong>⚠️ Eslatma:</strong> Ammiakli eritma uzoq vaqt saqlansa, portlovchi 
              <strong> kumush nitrid (Ag₃N)</strong> hosil bo'lishi mumkin. Tollens reaktivi ishlatish oldidan tayyorlanadi.
            </p>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ammiakatlar — <strong className="text-yellow-400">NH₃ ligandli</strong> komplekslar</li>
            <li>Ligand nomi: <strong>ammin</strong> (IUPAC)</li>
            <li>Koordinatsion son: <strong>2, 4 yoki 6</strong> (metallga qarab)</li>
            <li>Verner aynan kobalt ammiakatlarini o'rganib <strong>kompleks birikmalar nazariyasini</strong> yaratgan</li>
            <li>[Ag(NH₃)₂]OH — muhim <strong>Tollens reaktivi</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/akva" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Akvakomplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/atsido" 
            className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 transition-all text-white font-semibold"
          >
            Keyingi: Atsidokomplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}