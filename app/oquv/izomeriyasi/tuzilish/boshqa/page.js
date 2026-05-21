import Link from "next/link"

export default function BoshqaTurlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/izomeriyasi/tuzilish" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Orqaga</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">📚 Qolgan tuzilish izomeriyasi turlari</h1>
          <p className="text-purple-400 text-sm">6 ta qo'shimcha tur • Kam uchraydigan izomeriyalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. O'RINBOSAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">1️⃣ O'rinbosar izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Ligand izomeriyasi</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">O'rinbosar izomeriya</strong> — ligandning o'rinbosar guruhlari 
              har xil joylashganda kuzatiladi. Ligandning o'zi izomer holida bo'ladi va bu kompleksning 
              umumiy tuzilishiga ta'sir qiladi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-2">
              <strong>Diaminobenzol</strong> — orto, meta, para izomerlari ligand sifatida.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-blue-400 font-bold">orto</p>
                <p className="text-purple-300">NH₂ guruhlar yonma-yon</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-green-400 font-bold">meta</p>
                <p className="text-purple-300">NH₂ guruhlar bitta C oraliq</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-pink-400 font-bold">para</p>
                <p className="text-purple-300">NH₂ guruhlar qarama-qarshi</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. KONFORMATSION */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">2️⃣ Konformatsion izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Aylanish izomeriyasi</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Konformatsion izomeriya</strong> — ligandning konformatsiyasi 
              (masalan, xelat halqasining bukilishi) farq qilganda kuzatiladi. Bunda bog'lar uzilmaydi, 
              faqat molekulaning fazoviy shakli o'zgaradi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-2">
              <strong>Etilendiamin (en)</strong> — xelat halqasi ikki xil konformatsiyada bo'lishi mumkin.
            </p>
            <ul className="text-purple-300 text-sm space-y-1">
              <li>• <strong>δ (delta)</strong> — halqa bir tomonga bukilgan</li>
              <li>• <strong>λ (lambda)</strong> — halqa boshqa tomonga bukilgan</li>
              <li>• Bu <strong>xirallik</strong> bilan bog'liq (optik izomeriyaga olib kelishi mumkin)</li>
            </ul>
          </div>
        </div>

        {/* 3. HOLAT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">3️⃣ Holat izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Spin holati izomeriyasi</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Holat izomeriya</strong> — markaziy atomning oksidlanish darajasi 
              yoki spin holati farq qilganda kuzatiladi. Bir xil tarkibli kompleks turli spin holatlarida mavjud bo'ladi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-yellow-400 font-bold mb-2">Yuqori spinli</h4>
              <p className="text-purple-200 text-sm">[Fe(H₂O)₆]²⁺ — 4 ta toq elektron, paramagnit, μeff = 4.89 μB</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h4 className="text-green-400 font-bold mb-2">Quyi spinli</h4>
              <p className="text-purple-200 text-sm">[Fe(CN)₆]⁴⁻ — 0 ta toq elektron, diamagnit, μeff = 0</p>
            </div>
          </div>
          <p className="text-purple-300 text-sm mt-3">
            <strong className="text-yellow-400">Sababi:</strong> Ligand maydon kuchi. CN⁻ kuchli maydon (Δo &gt; P), H₂O kuchsiz maydon (Δo &lt; P).
          </p>
        </div>

        {/* 4. ELEKTRON */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">4️⃣ Elektron izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Redoks izomeriya</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Elektron izomeriya</strong> — elektronlarning orbitallar bo'yicha 
              taqsimlanishi farq qilganda kuzatiladi. Metall va ligand o'rtasida elektron ko'chishi natijasida 
              turli elektron konfiguratsiyali izomerlar hosil bo'ladi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-2">
              [Co(NH₃)₅NO₂]²⁺ kompleksida ikki xil elektron holat:
            </p>
            <ul className="text-purple-300 text-sm space-y-1">
              <li>• <strong>Co³⁺-NO₂⁻:</strong> metall +3, ligand -1</li>
              <li>• <strong>Co²⁺-NO₂:</strong> metall +2, ligand neytral (kam uchraydi)</li>
            </ul>
          </div>
        </div>

        {/* 5. TRANSFORMATSION */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">5️⃣ Transformatsion izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Fazoviy qayta tuzilish</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Transformatsion izomeriya</strong> — ligandning bir shakldan 
              ikkinchi shaklga o'tishi bilan bog'liq. Bu ko'pincha yorug'lik, issiqlik yoki erituvchi ta'sirida sodir bo'ladi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-2">
              <strong>Nitrito → Nitro qayta tuzilishi:</strong>
            </p>
            <p className="text-purple-300 text-sm">
              [Co(NH₃)₅ONO]²⁺ — yorug'lik ta'sirida [Co(NH₃)₅NO₂]²⁺ ga o'tadi. 
              O orqali bog'lanish N orqali bog'lanishga almashadi.
            </p>
          </div>
        </div>

        {/* 6. FORMAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">6️⃣ Formal izomeriya</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">An'anaviy izomeriya</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Formal izomeriya</strong> — bir xil tarkibli, lekin har xil 
              kimyoviy bog'lanish strukturasiga ega moddalar uchun qo'llaniladi. Bu eng keng ma'nodagi izomeriya turi.
            </p>
          </div>

          <h3 className="text-lg font-bold text-white mb-3">Misol:</h3>
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm">
              Ba'zi komplekslar turli izomeriya turlariga bir vaqtning o'zida misol bo'la oladi. 
              Masalan, CrCl₃·6H₂O — ham gidrat, ham ionlanish izomeriyasi.
            </p>
          </div>
        </div>

        {/* JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Barcha tuzilish izomeriyasi turlari</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">#</th>
                <th className="py-3 px-4 text-purple-300">Tur nomi</th>
                <th className="py-3 px-4 text-purple-300">Farqi nimada?</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 text-yellow-400 font-bold">1</td><td className="py-3 px-4">Ionlanish</td><td className="py-3 px-4 text-sm">Ligand va tashqi sfera ioni almashadi</td><td className="py-3 px-4 text-sm">[CoBr(NH₃)₅]SO₄ / [Co(NH₃)₅SO₄]Br</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 text-yellow-400 font-bold">2</td><td className="py-3 px-4">Gidrat</td><td className="py-3 px-4 text-sm">Suv molekulalari ichki/tashqi sferada</td><td className="py-3 px-4 text-sm">CrCl₃·6H₂O — 3 ta izomer</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 text-yellow-400 font-bold">3</td><td className="py-3 px-4">Bog'lanish</td><td className="py-3 px-4 text-sm">Ambidentat ligand har xil atom orqali</td><td className="py-3 px-4 text-sm">[Co(NH₃)₅NO₂]²⁺ / [Co(NH₃)₅ONO]²⁺</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 text-yellow-400 font-bold">4</td><td className="py-3 px-4">Koordinatsion</td><td className="py-3 px-4 text-sm">Kation va anion kompleks ligand almashadi</td><td className="py-3 px-4 text-sm">[Cr(NH₃)₆][Fe(CN)₆] / [Fe(NH₃)₆][Cr(CN)₆]</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">5</td><td className="py-3 px-4">O'rinbosar</td><td className="py-3 px-4 text-sm">Ligandning o'rinbosar guruhlari har xil</td><td className="py-3 px-4 text-sm">orto/meta/para diaminobenzol</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">6</td><td className="py-3 px-4">Konformatsion</td><td className="py-3 px-4 text-sm">Ligand konformatsiyasi farqi</td><td className="py-3 px-4 text-sm">δ/λ etilendiamin xelat halqasi</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">7</td><td className="py-3 px-4">Holat</td><td className="py-3 px-4 text-sm">Spin holati yoki oksidlanish darajasi</td><td className="py-3 px-4 text-sm">Yuqori/quyi spinli Fe²⁺ komplekslari</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">8</td><td className="py-3 px-4">Elektron</td><td className="py-3 px-4 text-sm">Elektron taqsimlanishi farqi</td><td className="py-3 px-4 text-sm">Co³⁺-NO₂⁻ / Co²⁺-NO₂</td></tr>
                <tr className="border-b border-purple-800/30"><td className="py-3 px-4 font-bold">9</td><td className="py-3 px-4">Transformatsion</td><td className="py-3 px-4 text-sm">Ligand bir shakldan ikkinchisiga o'tadi</td><td className="py-3 px-4 text-sm">Nitrito → Nitro (yorug'lik ta'sirida)</td></tr>
                <tr><td className="py-3 px-4 font-bold">10</td><td className="py-3 px-4">Formal</td><td className="py-3 px-4 text-sm">Har xil kimyoviy bog'lanish strukturasi</td><td className="py-3 px-4 text-sm">Umumiy tushuncha</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Tuzilish izomeriyasi — <strong className="text-yellow-400">10 ta tur</strong> mavjud</li>
            <li>Asosiy 4 ta tur: <strong>ionlanish, gidrat, bog'lanish, koordinatsion</strong></li>
            <li>Qo'shimcha 6 ta tur nisbatan <strong>kam uchraydi</strong></li>
            <li>Barcha tuzilish izomerlarida <strong>formulalar har xil yoziladi</strong></li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link href="/oquv/izomeriyasi/tuzilish/koordinatsion" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Koordinatsion izomeriya</Link>
          <Link href="/oquv/izomeriyasi/tuzilish" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Tuzilish izomeriyasi →</Link>
        </div>

      </section>
    </main>
  )
}