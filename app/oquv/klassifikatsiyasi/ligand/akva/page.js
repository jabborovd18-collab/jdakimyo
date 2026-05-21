import Link from "next/link"

export default function Akvakomplekslar() {
  const misollar = [
    { formula: "[Cu(H₂O)₆]²⁺", nomi: "geksaakvamis(II) ioni", ion: "Cu²⁺ (d⁹)", rang: "Havorang", rangCode: "text-cyan-400" },
    { formula: "[Co(H₂O)₆]²⁺", nomi: "geksaakvakobalt(II) ioni", ion: "Co²⁺ (d⁷)", rang: "Pushti", rangCode: "text-pink-400" },
    { formula: "[Ni(H₂O)₆]²⁺", nomi: "geksaakvanikel(II) ioni", ion: "Ni²⁺ (d⁸)", rang: "Yashil", rangCode: "text-green-400" },
    { formula: "[Cr(H₂O)₆]³⁺", nomi: "geksaakvaxrom(III) ioni", ion: "Cr³⁺ (d³)", rang: "Binafsha", rangCode: "text-purple-400" },
    { formula: "[Fe(H₂O)₆]²⁺", nomi: "geksaakvatemir(II) ioni", ion: "Fe²⁺ (d⁶)", rang: "Och yashil", rangCode: "text-green-300" },
    { formula: "[Fe(H₂O)₆]³⁺", nomi: "geksaakvatemir(III) ioni", ion: "Fe³⁺ (d⁵)", rang: "Sariq-jigarrang", rangCode: "text-yellow-400" },
    { formula: "[Ti(H₂O)₆]³⁺", nomi: "geksaakvatitan(III) ioni", ion: "Ti³⁺ (d¹)", rang: "Binafsha-qizg'ish", rangCode: "text-pink-400" },
    { formula: "[Mn(H₂O)₆]²⁺", nomi: "geksaakvamarganes(II) ioni", ion: "Mn²⁺ (d⁵)", rang: "Och pushti (deyarli rangsiz)", rangCode: "text-gray-400" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💧 Akvakomplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: H₂O (suv) • Koordinatsion son: asosan 6 • Eng ko'p tarqalgan tur</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Akvakomplekslar haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Akvakomplekslar</strong> — ligandi 
              <strong className="text-yellow-400"> suv molekulasi (H₂O)</strong> bo'lgan kompleks birikmalardir. 
              Suv molekulasi kislorod atomidagi taqsimlanmagan elektron jufti orqali markaziy metall ioniga 
              koordinatsion bog' hosil qiladi. Bu <strong className="text-yellow-400">eng ko'p tarqalgan</strong> kompleks birikmalar turidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Ligand:</strong> H₂O — akva (IUPAC)</li>
                <li>• <strong>Donor atom:</strong> Kislorod (O)</li>
                <li>• <strong>Turi:</strong> Monodentat, neytral</li>
                <li>• <strong>Koordinatsion son:</strong> Ko'pincha 6</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Deyarli barcha d-metall ionlari suvda akvakompleks holida</li>
                <li>• H₂O — kuchsiz maydonli ligand</li>
                <li>• Ko'pchiligi yuqori spinli</li>
                <li>• Rangli birikmalar hosil qiladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim akvakomplekslar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Formula</th>
                  <th className="py-3 px-4 text-purple-300">Nomi</th>
                  <th className="py-3 px-4 text-purple-300">Markaziy ion</th>
                  <th className="py-3 px-4 text-purple-300">Rangi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {misollar.map((m, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-blue-400">{m.formula}</td>
                    <td className="py-3 px-4">{m.nomi}</td>
                    <td className="py-3 px-4 text-yellow-400">{m.ion}</td>
                    <td className={`py-3 px-4 ${m.rangCode} font-semibold`}>{m.rang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. GIDRAT IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Gidrat izomeriya</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Akvakomplekslar <strong className="text-yellow-400">gidrat izomeriya</strong> hodisasi bilan chambarchas bog'liq. 
            CrCl₃·6H₂O ning 3 ta gidrat izomeri mavjud bo'lib, ular suv molekulalarining ichki yoki tashqi sferada joylashishi bilan farq qiladi.
          </p>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">1️⃣</span>
                <h3 className="text-white font-bold">[Cr(H₂O)₆]Cl₃</h3>
              </div>
              <p className="text-purple-300 text-sm">
                <strong>geksaakvaxrom(III) xlorid</strong> — binafsha rang<br/>
                6 ta suv ichki sferada, 3 ta Cl⁻ tashqi sferada<br/>
                AgNO₃ bilan → <strong>3 mol AgCl</strong> cho'kmasi
              </p>
            </div>
            
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">2️⃣</span>
                <h3 className="text-white font-bold">[CrCl(H₂O)₅]Cl₂·H₂O</h3>
              </div>
              <p className="text-purple-300 text-sm">
                <strong>xloropentaakvaxrom(III) xlorid monogidrat</strong> — och yashil rang<br/>
                5 ta suv ichki sferada, 1 ta tashqi sferada<br/>
                AgNO₃ bilan → <strong>2 mol AgCl</strong> cho'kmasi
              </p>
            </div>
            
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">3️⃣</span>
                <h3 className="text-white font-bold">[CrCl₂(H₂O)₄]Cl·2H₂O</h3>
              </div>
              <p className="text-purple-300 text-sm">
                <strong>dixlorotetraakvaxrom(III) xlorid digidrat</strong> — to'q yashil rang<br/>
                4 ta suv ichki sferada, 2 ta tashqi sferada<br/>
                AgNO₃ bilan → <strong>1 mol AgCl</strong> cho'kmasi
              </p>
            </div>
          </div>
        </div>

        {/* 4. SPEKTROKIMYOVIY QATOR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📊 Spektrokimyoviy qatorda o'rni</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm text-center leading-relaxed break-all">
              I⁻ &lt; Br⁻ &lt; S²⁻ &lt; SCN⁻ &lt; Cl⁻ &lt; NO₂⁻ &lt; F⁻ &lt; OH⁻ &lt; ox &lt; 
              <strong className="text-blue-400 text-base"> H₂O </strong> &lt; 
              NCS⁻ &lt; py &lt; NH₃ &lt; en &lt; bpy &lt; phen &lt; NO₂⁻ &lt; PPh₃ &lt; CN⁻ &lt; CO
            </p>
          </div>
          
          <p className="text-purple-200 text-sm">
            H₂O — <strong className="text-yellow-400">kuchsiz maydonli ligand</strong>. Shuning uchun ko'pchilik 
            akvakomplekslar yuqori spinli bo'ladi.
          </p>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Akvakomplekslar — <strong className="text-yellow-400">eng ko'p tarqalgan</strong> komplekslar turi</li>
            <li>Ligand: <strong>H₂O — akva</strong>, donor atom: kislorod</li>
            <li>Koordinatsion son asosan <strong>6</strong> (geksaakva)</li>
            <li>H₂O — <strong>kuchsiz maydonli</strong> ligand, yuqori spinli komplekslar</li>
            <li>Gidrat izomeriya — akvakomplekslarning muhim xususiyati</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Ligandlar bo'limi
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/ammin" 
            className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 transition-all text-white font-semibold"
          >
            Keyingi: Ammiakatlar →
          </Link>
        </div>

      </section>

    </main>
  )
}