import Link from "next/link"

export default function GidratIzomeriyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">💧 Gidrat izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Suv molekulalarining ichki yoki tashqi sferada joylashishi bilan farq qiladi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Gidrat izomeriyasi haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Gidrat izomeriya</strong> — molekula tarkibidagi 
              <strong className="text-yellow-400"> suv molekulalarining ichki yoki tashqi sferada joylashishi</strong> bilan farq qiladigan izomeriya turi.
              Bu akvakomplekslar uchun xarakterli bo'lib, bir xil yalpi formulaga ega moddalar suvning joylashuviga qarab har xil bo'ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday hosil bo'ladi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Suv molekulalari <strong>ichki sferada</strong> ligand sifatida</li>
                <li>• Suv molekulalari <strong>tashqi sferada</strong> kristallizatsion suv</li>
                <li>• Suvning joylashuvi o'zgarishi bilan <strong>yangi izomer</strong></li>
                <li>• Yalpi formula <strong>bir xil</strong> bo'ladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday farqlanadi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Rangi:</strong> suvning joylashuviga qarab o'zgaradi</li>
                <li>• <strong>AgNO₃ bilan:</strong> har xil miqdorda AgCl cho'kmasi</li>
                <li>• <strong>Qizdirish:</strong> suv har xil haroratda ajraladi</li>
                <li>• <strong>Elektr o'tkazuvchanlik:</strong> ionlar soni har xil</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOL: CrCl₃·6H₂O */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol: CrCl₃·6H₂O</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Xrom(III) xlorid geksagidrat — gidrat izomeriyaning <strong className="text-yellow-400">eng mashhur misoli</strong>.
              Bir xil yalpi formulaga ega <strong className="text-yellow-400">3 ta turli modda</strong> mavjud.
              Ular rangi, AgNO₃ bilan reaksiyasi va elektr o'tkazuvchanligi bilan farqlanadi.
            </p>
          </div>

          {/* Izomer 1 */}
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-purple-300">Izomer 1</h3>
              <span className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">Binafsha</span>
            </div>
            <p className="font-mono text-yellow-400 text-lg mb-3">[Cr(H₂O)₆]Cl₃</p>
            <p className="text-purple-200 mb-4"><strong>geksaakvaxrom(III) xlorid</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Tarkibi</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Ichki sfera:</strong> [Cr(H₂O)₆]³⁺</li>
                  <li>• <strong>Tashqi sfera:</strong> 3Cl⁻</li>
                  <li>• <strong>6 ta suv</strong> — hammasi ichki sferada</li>
                  <li>• <strong>0 ta suv</strong> — tashqi sferada</li>
                  <li>• KS = <strong>6</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Xossalari</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Rangi:</strong> Binafsha</li>
                  <li>• <strong>AgNO₃ bilan:</strong> 3 mol AgCl ↓</li>
                  <li>• <strong>Elektr o'tkazuvchanlik:</strong> Yuqori (4 ion)</li>
                  <li>• <strong>Qizdirish:</strong> barcha suv bir xil ajraladi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Izomer 2 */}
          <div className="bg-green-600/10 rounded-xl p-6 border border-green-700/30 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-green-400">Izomer 2</h3>
              <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold">Och yashil</span>
            </div>
            <p className="font-mono text-yellow-400 text-lg mb-3">[CrCl(H₂O)₅]Cl₂·H₂O</p>
            <p className="text-purple-200 mb-4"><strong>xloropentaakvaxrom(III) xlorid monogidrat</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Tarkibi</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Ichki sfera:</strong> [CrCl(H₂O)₅]²⁺</li>
                  <li>• <strong>Tashqi sfera:</strong> 2Cl⁻ + 1H₂O</li>
                  <li>• <strong>5 ta suv</strong> — ichki sferada</li>
                  <li>• <strong>1 ta suv</strong> — tashqi sferada</li>
                  <li>• KS = <strong>6</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Xossalari</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Rangi:</strong> Och yashil</li>
                  <li>• <strong>AgNO₃ bilan:</strong> 2 mol AgCl ↓</li>
                  <li>• <strong>Elektr o'tkazuvchanlik:</strong> O'rtacha (3 ion)</li>
                  <li>• <strong>Qizdirish:</strong> tashqi suv osonroq ajraladi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Izomer 3 */}
          <div className="bg-emerald-600/10 rounded-xl p-6 border border-emerald-700/30">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-emerald-400">Izomer 3</h3>
              <span className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">To'q yashil</span>
            </div>
            <p className="font-mono text-yellow-400 text-lg mb-3">[CrCl₂(H₂O)₄]Cl·2H₂O</p>
            <p className="text-purple-200 mb-4"><strong>dixlorotetraakvaxrom(III) xlorid digidrat</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Tarkibi</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Ichki sfera:</strong> [CrCl₂(H₂O)₄]⁺</li>
                  <li>• <strong>Tashqi sfera:</strong> 1Cl⁻ + 2H₂O</li>
                  <li>• <strong>4 ta suv</strong> — ichki sferada</li>
                  <li>• <strong>2 ta suv</strong> — tashqi sferada</li>
                  <li>• KS = <strong>6</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Xossalari</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Rangi:</strong> To'q yashil</li>
                  <li>• <strong>AgNO₃ bilan:</strong> 1 mol AgCl ↓</li>
                  <li>• <strong>Elektr o'tkazuvchanlik:</strong> Past (2 ion)</li>
                  <li>• <strong>Qizdirish:</strong> 2 ta suv oson ajraladi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TAQQOSLASH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Uchala izomerni taqqoslash</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Xususiyat</th>
                <th className="py-3 px-4 text-purple-300">[Cr(H₂O)₆]Cl₃</th>
                <th className="py-3 px-4 text-purple-300">[CrCl(H₂O)₅]Cl₂·H₂O</th>
                <th className="py-3 px-4 text-purple-300">[CrCl₂(H₂O)₄]Cl·2H₂O</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Rangi</td>
                  <td className="py-3 px-4 text-purple-400">Binafsha</td>
                  <td className="py-3 px-4 text-green-400">Och yashil</td>
                  <td className="py-3 px-4 text-emerald-400">To'q yashil</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ichki H₂O</td>
                  <td className="py-3 px-4">6 ta</td><td className="py-3 px-4">5 ta</td><td className="py-3 px-4">4 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Tashqi H₂O</td>
                  <td className="py-3 px-4">0 ta</td><td className="py-3 px-4">1 ta</td><td className="py-3 px-4">2 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">Ichki Cl⁻</td>
                  <td className="py-3 px-4">0 ta</td><td className="py-3 px-4">1 ta</td><td className="py-3 px-4">2 ta</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">AgCl cho'kmasi</td>
                  <td className="py-3 px-4 text-yellow-400 font-bold">3 mol</td><td className="py-3 px-4 text-yellow-400 font-bold">2 mol</td><td className="py-3 px-4 text-yellow-400 font-bold">1 mol</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Ionlar soni</td>
                  <td className="py-3 px-4">4 ta</td><td className="py-3 px-4">3 ta</td><td className="py-3 px-4">2 ta</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. UMUMIY QOIDALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📝 Umumiy qoidalar va ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Gidrat izomeriya shartlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Kompleks tarkibida <strong>suv molekulalari</strong> bo'lishi kerak</li>
                <li>• Suv <strong>ham ichki, ham tashqi sferada</strong> bo'lishi mumkin</li>
                <li>• Tashqi sferada <strong>anionlar</strong> bo'lishi kerak</li>
                <li>• Suv va anion <strong>o'rin almashishi</strong> kerak</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Amaliy ahamiyati</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Analitik kimyo:</strong> AgNO₃ bilan farqlash</li>
                <li>• <strong>Koordinatsion kimyo:</strong> ichki/tashqi sfera tushunchasi</li>
                <li>• <strong>Termogravimetriya:</strong> suvning ajralish harorati</li>
                <li>• <strong>Farmatsevtika:</strong> dori moddalarining gidrat shakllari</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gidrat izomeriya — <strong className="text-yellow-400">suvning ichki yoki tashqi sferada joylashishi</strong></li>
            <li>CrCl₃·6H₂O — <strong>3 ta izomer</strong> (binafsha, och yashil, to'q yashil)</li>
            <li>AgNO₃ bilan <strong>har xil miqdorda AgCl</strong> cho'kmasi (3, 2, 1 mol)</li>
            <li>Rang farqi — suvning joylashuviga bog'liq</li>
            <li>Akvakomplekslar uchun <strong>xarakterli</strong> izomeriya turi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/ionlanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ionlanish izomeriyasi</Link>
          <Link href="/oquv/izomeriyasi/tuzilish/boglanish" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">Bog'lanish izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}