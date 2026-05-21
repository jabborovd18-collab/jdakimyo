import Link from "next/link"

export default function AtomModellari() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="text-purple-400 hover:text-purple-300 text-lg">← Atom tuzilishi</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧪 Atom tuzilishi modellari</h1>
          <p className="text-purple-400 text-sm">Tomson • Rezerford • Bor • Kvant-mexanik model</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Atom tuzilishi haqidagi tasavvurlarning rivojlanishi</h2>
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
            <p className="text-purple-200 leading-relaxed">
              Atom tuzilishi haqidagi bilimlar <strong className="text-yellow-400">asrlar davomida</strong> rivojlanib kelgan.
              Har bir yangi model oldingisining kamchiliklarini tuzatgan va yangi kashfiyotlar asosida takomillashgan.
              Kompleks birikmalarning xossalarini tushunish uchun atomning <strong className="text-yellow-400">kvant-mexanik modeli</strong> eng muhim ahamiyatga ega.
            </p>
          </div>
        </div>

        {/* 2. TOMSON MODELI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">1️⃣ Tomson modeli (1897)</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">"Pudingdagi mayiz" modeli</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-3">Asosiy g'oyalari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Atom — <strong>musbat zaryadlangan shar</strong></li>
                <li>• Elektronlar <strong>shar ichida</strong> tarqalgan</li>
                <li>• Pudingdagi mayiz kabi</li>
                <li>• Atom <strong>neytral</strong> — musbat va manfiy zaryadlar teng</li>
                <li>• Elektron kashf etilgandan keyin taklif qilingan</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-3">Kamchiliklari</h3>
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• <strong>Yadro</strong> tushunchasi yo'q</li>
                <li>• Rezerford tajribasini tushuntirib <strong>bera olmadi</strong></li>
                <li>• α-zarrachalarning katta burchakka og'ishini izohlay olmaydi</li>
                <li>• Spektral chiziqlarni tushuntirmaydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. REZERFORD MODELI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">2️⃣ Rezerford modeli (1911)</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">"Planetar" model • α-zarrachalarning sochilishi</p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Oltin folga tajribasi</h3>
            <p className="text-purple-200 text-sm">
              Rezerford α-zarrachalarni yupqa oltin folgadan o'tkazganda, ko'pchiligi to'g'ri o'tgan, 
              lekin ba'zilari <strong className="text-yellow-400">katta burchakka og'gan</strong> (hatto orqaga qaytgan).
              Bu atomning asosiy massasi <strong>juda kichik yadroda</strong> jamlanganligini ko'rsatdi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Yutuqlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Yadro</strong> kashf etildi</li>
                <li>• Atomning asosiy massasi yadroda</li>
                <li>• Elektronlar yadro atrofida aylanadi</li>
                <li>• Atom asosan <strong>bo'shliqdan</strong> iborat</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Kamchiliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Klassik fizikaga ko'ra elektron <strong>nurlanish</strong> kerak</li>
                <li>• Nurlanish natijasida elektron <strong>yadroga tushishi</strong> kerak</li>
                <li>• <strong>Chiziqli spektrlarni</strong> tushuntirmaydi</li>
                <li>• Atom <strong>barqaror emas</strong> bo'lishi kerak edi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. BOR MODELI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">3️⃣ Bor modeli (1913)</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Kvant postulatlari • Vodorod spektri</p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Bor postulatlari</h3>
            <div className="space-y-3">
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold text-sm">1-postulat:</p>
                <p className="text-purple-200 text-sm">Elektron yadro atrofida <strong>faqat ma'lum (statsionar) orbitalarda</strong> aylanadi. Bu orbitalarda u nurlanmaydi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold text-sm">2-postulat:</p>
                <p className="text-purple-200 text-sm">Elektron bir orbitadan ikkinchisiga o'tganda <strong>energiya farqi</strong> yorug'lik kvanti (foton) sifatida chiqariladi yoki yutiladi.</p>
                <p className="font-mono text-purple-300 text-sm mt-1">ΔE = hν = E₂ − E₁</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <p className="text-yellow-400 font-bold text-sm">3-postulat:</p>
                <p className="text-purple-200 text-sm">Elektronning <strong>harakat miqdori momenti</strong> kvantlangan: mvr = n·h/2π (n = 1, 2, 3...)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Yutuqlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Vodorod atomining <strong>chiziqli spektrini</strong> tushuntirdi</li>
                <li>• <strong>Kvant tushunchasini</strong> atomga tatbiq etdi</li>
                <li>• Bor radiusi: a₀ = 0.529 Å</li>
                <li>• Ridberg formulasi bilan mos keladi</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Kamchiliklari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Ko'p elektronli</strong> atomlar uchun ishlamaydi</li>
                <li>• Spektral chiziqlarning <strong>intensivligini</strong> tushuntirmaydi</li>
                <li>• <strong>Noaniqlik prinsipi</strong> bilan zid</li>
                <li>• Elektron orbitasi — noto'g'ri tushuncha</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. KVANT-MEXANIK MODEL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">4️⃣ Kvant-mexanik model (1926)</h2>
          <p className="text-yellow-400 font-semibold text-lg mb-6">Shredinger tenglamasi • Orbitallar • Hozirgi zamon modeli</p>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-6">
            <h3 className="text-yellow-400 font-bold mb-3">Asosiy farqlari</h3>
            <ul className="text-purple-200 space-y-2 text-sm">
              <li>• Elektron aniq <strong>orbita</strong> bo'ylab harakatlanmaydi — <strong>orbital</strong> (ehtimollik buluti) mavjud</li>
              <li>• <strong>Geyzenberg noaniqlik prinsipi:</strong> elektronning bir vaqtda ham o'rnini, ham tezligini aniq bilish mumkin emas</li>
              <li>• <strong>Shredinger tenglamasi:</strong> Ĥψ = Eψ — to'lqin funksiyasi orqali elektron holati aniqlanadi</li>
              <li>• 4 ta <strong>kvant son</strong> (n, l, mₗ, mₛ) elektron holatini to'liq tavsiflaydi</li>
              <li>• <strong>Kompleks birikmalar</strong> uchun aynan shu model asosiy hisoblanadi</li>
            </ul>
          </div>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
            <p className="text-green-300 text-sm">
              <strong>✅ Kompleks birikmalar uchun ahamiyati:</strong> Kvant-mexanik model d-orbitallarning shakli, 
              energiyasi va elektron konfiguratsiyalarini tushunishga imkon beradi. 
              Kristall maydon nazariyasi, MO nazariyasi — hammasi shu model asosida qurilgan.
            </p>
          </div>
        </div>

        {/* 6. TAQQOSLASH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Modellarni taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Model</th><th className="py-3 px-4 text-purple-300">Yil</th><th className="py-3 px-4 text-purple-300">Asosiy g'oya</th><th className="py-3 px-4 text-purple-300">Holati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Tomson", "1897", "Musbat shar + elektronlar", "❌ Eskirgan"],
                  ["Rezerford", "1911", "Yadro + elektronlar", "❌ Eskirgan"],
                  ["Bor", "1913", "Statsionar orbitalar", "⚠️ Cheklangan (faqat H)"],
                  ["Kvant-mexanik", "1926", "Orbitallar + ehtimollik", "✅ Hozirgi model"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Atom modellari <strong>Tomson → Rezerford → Bor → Kvant-mexanik</strong> yo'nalishida rivojlangan</li>
            <li>Har bir model oldingisining <strong>kamchiliklarini</strong> tuzatgan</li>
            <li>Kompleks birikmalar uchun <strong>kvant-mexanik model</strong> asosiy ahamiyatga ega</li>
            <li>Orbitallar (ehtimollik buluti) — elektronning aniq orbitasi emas</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Atom tuzilishi</Link>
          <Link href="/ilmiy/chuqurlashgan/atom-tuzilishi/kvant-sonlar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Kvant sonlar →</Link>
        </div>

      </section>
    </main>
  )
}