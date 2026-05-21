import Link from "next/link"

export default function IonlanishIzomeriyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">⚡ Ionlanish izomeriyasi</h1>
          <p className="text-purple-400 text-sm">Ligand va tashqi sfera anionining o'rin almashishi natijasida hosil bo'ladi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ionlanish izomeriyasi haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ionlanish izomeriyasi</strong> — bir xil tarkibli, lekin suvda eriganda 
              <strong className="text-yellow-400"> boshqa-boshqa ionlarga dissotsilanadigan</strong> komplekslarda kuzatiladi.
              Ligand va tashqi sfera anionining o'rin almashishi natijasida hosil bo'ladi. 
              Ionlanish izomerlari bir-biridan <strong className="text-yellow-400">kimyoviy reaksiyalar</strong> orqali oson farqlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday hosil bo'ladi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Ichki sferadagi <strong>ligand tashqi sferaga chiqadi</strong></li>
                <li>• Tashqi sferadagi <strong>ion ichki sferaga kiradi</strong></li>
                <li>• Natijada <strong>turli ionlar</strong> ajralib chiqadi</li>
                <li>• Kimyoviy formulalar <strong>farq qiladi</strong></li>
                <li>• Suvli eritmada <strong>har xil ionlar</strong> mavjud bo'ladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qanday farqlanadi?</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Sifat reaksiyalari:</strong> har xil ionlar cho'kma beradi</li>
                <li>• <strong>Elektr o'tkazuvchanlik:</strong> ionlar soni har xil</li>
                <li>• <strong>Rangi:</strong> ba'zan farq qilishi mumkin</li>
                <li>• <strong>Eruvchanlik:</strong> har xil erituvchilarda turlicha</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. KLASSIK MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Klassik misol</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-center text-lg">
              <span className="font-mono text-yellow-400">[CoBr(NH₃)₅]SO₄</span> 
              &nbsp;va&nbsp; 
              <span className="font-mono text-yellow-400">[Co(NH₃)₅SO₄]Br</span>
            </p>
            <p className="text-purple-300 text-center mt-2">
              Bu ikki modda bir xil tarkibga ega, lekin <strong className="text-yellow-400">har xil ionlarga dissotsilanadi</strong>
            </p>
          </div>

          {/* Izomer 1 */}
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Izomer 1: [CoBr(NH₃)₅]SO₄</h3>
            <p className="text-purple-200 mb-4"><strong>bromopentaamminkobalt(III) sulfat</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Tarkibi</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Ichki sfera:</strong> <span className="text-blue-400">[CoBr(NH₃)₅]²⁺</span></li>
                  <li>• <strong>Tashqi sfera:</strong> <span className="text-yellow-400">SO₄²⁻</span></li>
                  <li>• Br⁻ <strong>ichki sferada</strong></li>
                  <li>• SO₄²⁻ <strong>tashqi sferada</strong></li>
                  <li>• Koordinatsion son: <strong>6</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Dissotsilanish</h4>
                <p className="font-mono text-blue-400 text-sm">
                  [CoBr(NH₃)₅]SO₄ → [CoBr(NH₃)₅]²⁺ + SO₄²⁻
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  3 ta ion hosil bo'ladi (1 kompleks kation + 1 sulfat anioni)
                </p>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <h4 className="text-green-400 font-bold mb-2">✅ Sifat reaksiyalari</h4>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>BaCl₂ qo'shilsa:</strong> BaSO₄ oq cho'kma tushadi</li>
                <li>• <strong>AgNO₃ qo'shilsa:</strong> cho'kma tushmaydi (Br⁻ ichki sferada)</li>
                <li>• <strong>Elektr o'tkazuvchanlik:</strong> yuqori (3 ta ion)</li>
              </ul>
            </div>
          </div>

          {/* Izomer 2 */}
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Izomer 2: [Co(NH₃)₅SO₄]Br</h3>
            <p className="text-purple-200 mb-4"><strong>sulfatopentaamminkobalt(III) bromid</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Tarkibi</h4>
                <ul className="text-purple-200 space-y-1 text-sm">
                  <li>• <strong>Ichki sfera:</strong> <span className="text-purple-400">[Co(NH₃)₅SO₄]⁺</span></li>
                  <li>• <strong>Tashqi sfera:</strong> <span className="text-yellow-400">Br⁻</span></li>
                  <li>• SO₄²⁻ <strong>ichki sferada</strong></li>
                  <li>• Br⁻ <strong>tashqi sferada</strong></li>
                  <li>• Koordinatsion son: <strong>6</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <h4 className="text-yellow-400 font-bold mb-2">Dissotsilanish</h4>
                <p className="font-mono text-purple-400 text-sm">
                  [Co(NH₃)₅SO₄]Br → [Co(NH₃)₅SO₄]⁺ + Br⁻
                </p>
                <p className="text-purple-300 text-xs mt-2">
                  2 ta ion hosil bo'ladi (1 kompleks kation + 1 bromid anioni)
                </p>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4 mt-4">
              <h4 className="text-green-400 font-bold mb-2">✅ Sifat reaksiyalari</h4>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>AgNO₃ qo'shilsa:</strong> AgBr och sariq cho'kma tushadi</li>
                <li>• <strong>BaCl₂ qo'shilsa:</strong> cho'kma tushmaydi (SO₄²⁻ ichki sferada)</li>
                <li>• <strong>Elektr o'tkazuvchanlik:</strong> pastroq (2 ta ion)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. KIMYOVIY FARQLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy farqlash jadvali</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Reagent</th>
                <th className="py-3 px-4 text-purple-300 text-blue-400">[CoBr(NH₃)₅]SO₄</th>
                <th className="py-3 px-4 text-purple-300 text-purple-400">[Co(NH₃)₅SO₄]Br</th>
                <th className="py-3 px-4 text-purple-300">Xulosa</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">BaCl₂</td>
                  <td className="py-3 px-4 text-green-400">✅ BaSO₄ ↓ oq</td>
                  <td className="py-3 px-4 text-red-400">❌ Cho'kma yo'q</td>
                  <td className="py-3 px-4 text-sm">SO₄²⁻ tashqi sferada ekanligini ko'rsatadi</td>
                </tr>
                <tr className="border-b border-purple-800/30">
                  <td className="py-3 px-4 font-bold">AgNO₃</td>
                  <td className="py-3 px-4 text-red-400">❌ Cho'kma yo'q</td>
                  <td className="py-3 px-4 text-green-400">✅ AgBr ↓ och sariq</td>
                  <td className="py-3 px-4 text-sm">Br⁻ tashqi sferada ekanligini ko'rsatadi</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">Elektr o'tkazuvchanlik</td>
                  <td className="py-3 px-4 text-blue-400">Yuqori</td>
                  <td className="py-3 px-4 text-purple-400">Past</td>
                  <td className="py-3 px-4 text-sm">Ionlar soni farqi (3 vs 2)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. BOSHQA MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Boshqa muhim misollar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Platina komplekslari</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Pt(NH₃)₄Cl₂]Br₂</span> &nbsp;va&nbsp; 
                <span className="font-mono text-pink-400">[Pt(NH₃)₄Br₂]Cl₂</span>
              </p>
              <p className="text-purple-300 text-sm">
                Birida Cl⁻ ichki sferada (tashqi Br⁻), ikkinchisida Br⁻ ichki sferada (tashqi Cl⁻).
                AgNO₃ va BaCl₂ orqali farqlanadi.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xrom komplekslari (ionlanish + gidrat)</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Cr(H₂O)₆]Cl₃</span> &nbsp;va&nbsp; 
                <span className="font-mono text-pink-400">[CrCl(H₂O)₅]Cl₂·H₂O</span>
              </p>
              <p className="text-purple-300 text-sm">
                Bu juftlik bir vaqtning o'zida ham ionlanish, ham gidrat izomeriyasiga misol bo'ladi.
              </p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Pd komplekslari</h3>
              <p className="text-purple-200 text-sm mb-2">
                <span className="font-mono text-pink-400">[Pd(NH₃)₄Cl₂]SO₄</span> &nbsp;va&nbsp; 
                <span className="font-mono text-pink-400">[Pd(NH₃)₄SO₄]Cl₂</span>
              </p>
              <p className="text-purple-300 text-sm">
                Palladiy komplekslarida ham xuddi shunday ionlanish izomeriyasi kuzatiladi.
              </p>
            </div>
          </div>
        </div>

        {/* 5. UMUMIY QOIDALAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📝 Umumiy qoidalar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ionlanish izomeriyasi shartlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Kompleksda <strong>kamida 2 xil anion</strong> bo'lishi kerak</li>
                <li>• Bir anion ichki sferada, biri tashqi sferada</li>
                <li>• Ular <strong>o'rin almashishi</strong> mumkin bo'lishi kerak</li>
                <li>• Natijada <strong>turli ionlar</strong> ajralib chiqadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Aniqlash usullari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Sifat reaksiyalari:</strong> cho'kma hosil qilish</li>
                <li>• <strong>Konduktometriya:</strong> elektr o'tkazuvchanlik</li>
                <li>• <strong>Potensiometriya:</strong> ion konsentratsiyasi</li>
                <li>• <strong>Spektroskopiya:</strong> UB-Vis, IQ</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ionlanish izomeriyasi — <strong className="text-yellow-400">ligand va tashqi sfera ioni o'rin almashadi</strong></li>
            <li>Natijada <strong>turli ionlar</strong> ajralib chiqadi</li>
            <li><strong>Kimyoviy reaksiyalar</strong> orqali oson farqlanadi</li>
            <li>Eng mashhur misol: <strong>[CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br</strong></li>
            <li>Ba²⁺ SO₄²⁻ ni, Ag⁺ esa Br⁻ (yoki Cl⁻) ni aniqlaydi</li>
            <li>Elektr o'tkazuvchanlik ham farqlashda yordam beradi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Tuzilish izomeriyasi</Link>
          <Link href="/oquv/izomeriyasi/tuzilish/gidrat" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Gidrat izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}