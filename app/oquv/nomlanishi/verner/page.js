import Link from "next/link"

export default function VernerNazariyasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* Header */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/nomlanishi" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🏛️ Verner nazariyasi</h1>
          <p className="text-purple-400 text-sm">Alfred Verner (1866–1919) • Koordinatsion birikmalar asoslari</p>
        </div>
      </header>

      {/* Kontent */}
      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. Kirish */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📋 Kompleks birikmalar haqida</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-yellow-400">Koordinatsion birikmalar</strong> — tarkibida metall atomi (yoki ioni) 
            bilan bog'langan ligand tutgan kompleks tuzilishga ega moddalardir.
          </p>
          <p className="text-purple-200 leading-relaxed">
            Dastlabki kompleks birikmalar <strong className="text-yellow-400">XVIII asr</strong> boshlarida ma'lum bo'lsa, 
            ular haqidagi nazariya keyinroq paydo bo'ldi. <strong className="text-yellow-400">1893 yili</strong> shveytsariyalik 
            kimyogar <strong className="text-yellow-400">Alfred Verner</strong> kobalt(III) tuzlarining ammiak bilan 
            birikmalarini o'rganadi va fanga kompleks birikmalar tushunchasini kiritadi.
          </p>
        </div>

        {/* 2. Kobalt birikmalari */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🔬 Verner o'rgangan kobalt birikmalari</h2>
          
          {/* Jadval */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300 font-semibold">Formula</th>
                  <th className="py-3 px-4 text-purple-300 font-semibold">Rangi</th>
                  <th className="py-3 px-4 text-purple-300 font-semibold">AgCl cho'kmasi</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/50 hover:bg-purple-800/30">
                  <td className="py-3 px-4 font-mono">[Co(NH₃)₆]Cl₃</td>
                  <td className="py-3 px-4">🟠 Zarg'aldoq-sariq</td>
                  <td className="py-3 px-4">3 mol</td>
                </tr>
                <tr className="border-b border-purple-800/50 hover:bg-purple-800/30">
                  <td className="py-3 px-4 font-mono">[Co(NH₃)₅Cl]Cl₂</td>
                  <td className="py-3 px-4">🩷 Pushti</td>
                  <td className="py-3 px-4">2 mol</td>
                </tr>
                <tr className="border-b border-purple-800/50 hover:bg-purple-800/30">
                  <td className="py-3 px-4 font-mono">[Co(NH₃)₄Cl₂]Cl</td>
                  <td className="py-3 px-4">🟢 Yashil</td>
                  <td className="py-3 px-4">1 mol</td>
                </tr>
                <tr className="hover:bg-purple-800/30">
                  <td className="py-3 px-4 font-mono">[CoCl₃(NH₃)₃]</td>
                  <td className="py-3 px-4">🟢 Yashil</td>
                  <td className="py-3 px-4">0 mol</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-purple-200 leading-relaxed">
            Verner shundan keyin <strong className="text-yellow-400">2 xil valentlik</strong> namoyon qilishini aytadi — 
            <strong className="text-yellow-400">asosiy</strong> va <strong className="text-yellow-400">qo'shimcha valentlik</strong>.
          </p>
        </div>

        {/* 3. Verner nazariyasi */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Verner nazariyasining asosiy holatlari</h2>
          
          <div className="space-y-4">
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Ikki xil valentlik</h3>
                <p className="text-purple-300">Ayrim elementlar o'zining asosiy valentliklaridan tashqari <strong className="text-yellow-400">qo'shimcha valentlikni</strong> namoyon qiladi.</p>
              </div>
            </div>
            
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Valentliklarni to'yintirish</h3>
                <p className="text-purple-300">Har qaysi element o'zining asosiy hamda qo'shimcha valentliklarini to'yintirishga harakat qiladi (energetik jihatdan barqarorlikka erishish uchun).</p>
              </div>
            </div>
            
            <div className="flex gap-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <div className="w-10 h-10 bg-red-600/30 rounded-full flex items-center justify-center text-red-400 font-bold text-lg flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Fazoviy yo'nalish</h3>
                <p className="text-purple-300">Markaziy atomning qo'shimcha valentligi fazoda <strong className="text-yellow-400">ma'lum yo'nalishga</strong> ega bo'ladi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Asosiy tushunchalar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏗️ Asosiy tushunchalar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligandlar</h3>
              <p className="text-purple-300 text-sm">Metalga bog'langan molekula yoki ionlar. Ularda taqsimlanmagan elektron jufti bo'lishi kerak — <strong>Luis asosi</strong>.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Markaziy atom</h3>
              <p className="text-purple-300 text-sm">Kompleks hosil qiluvchi metall — <strong>Luis kislotasi</strong> (elektron jufti akseptori).</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Koordinatsion bog'</h3>
              <p className="text-purple-300 text-sm">Markaziy atom va ligand orasidagi bog' — <strong>donor-akseptor bog'</strong>.</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ichki sfera</h3>
              <p className="text-purple-300 text-sm">Kompleksning <strong>kvadrat qavs [ ]</strong> ichidagi qismi. Mustahkam bog'langan.</p>
            </div>
          </div>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/nomlanishi" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Nomlanishi bo'limi
          </Link>
          <Link 
            href="/oquv/nomlanishi/formula" 
            className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 transition-all text-white font-semibold"
          >
            Keyingi: Formula yozish →
          </Link>
        </div>

      </section>

    </main>
  )
}