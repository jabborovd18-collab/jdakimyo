import Link from "next/link"

export default function PiBoglanish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Ligand maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">⚡ π-bog'lanish LMN da</h1>
          <p className="text-purple-400 text-sm">π-donor va π-akseptor ligandlar • Δo ga ta'siri • Spektrokimyoviy qator sababi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 π-bog'lanish haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">π-bog'lanish</strong> — LMN ning KMN dan <strong>asosiy ustunligi</strong>.
              KMN faqat σ-bog'lanishni bilvosita hisobga oladi, lekin π-bog'lanishni umuman tushuntirmaydi.
              Aynan π-bog'lanish <strong className="text-yellow-400">spektrokimyoviy qatorni</strong> va 
              <strong className="text-yellow-400">ligandlarning maydon kuchini</strong> tushuntirib beradi.
            </p>
          </div>
        </div>

        {/* 2. UCH TUR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Ligandlarning uchta π turi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-red-400 font-bold text-xl mb-4">π-donor</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ligandning <strong>to'lgan π-orbitallari</strong> metallning t₂g orbitallari bilan ta'sirlashadi.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 mb-3 text-sm">
                <p className="text-purple-300">Ligand π → Metall t₂g</p>
                <p className="text-red-400 font-bold mt-1">Δo ↓ KICHIK</p>
              </div>
              <p className="text-purple-400 text-xs">Misollar: F⁻, Cl⁻, Br⁻, I⁻, OH⁻, H₂O</p>
            </div>

            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-6">
              <h3 className="text-gray-400 font-bold text-xl mb-4">Faqat σ-donor</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ligandda <strong>π-orbitallar yo'q</strong> yoki ular ishtirok etmaydi.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 mb-3 text-sm">
                <p className="text-purple-300">Faqat σ-bog' mavjud</p>
                <p className="text-gray-400 font-bold mt-1">Δo — O'RTACHA</p>
              </div>
              <p className="text-purple-400 text-xs">Misollar: NH₃, en (etilendiamin)</p>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-xl mb-4">π-akseptor</h3>
              <p className="text-purple-200 text-sm mb-3">
                Ligandning <strong>bo'sh π*-orbitallari</strong> metallning t₂g elektronlarini qabul qiladi.
              </p>
              <div className="bg-purple-900/50 rounded-lg p-3 mb-3 text-sm">
                <p className="text-purple-300">Metall t₂g → Ligand π*</p>
                <p className="text-green-400 font-bold mt-1">Δo ↑↑ KATTA</p>
              </div>
              <p className="text-purple-400 text-xs">Misollar: CO, CN⁻, NO₂⁻, PR₃, bpy, phen</p>
            </div>
          </div>
        </div>

        {/* 3. ENERGIYA TA'SIRI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 π-bog'lanishning Δo ga ta'siri</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 mb-6">
            <p className="text-purple-200 text-sm text-center mb-4">
              π-bog'lanish <strong>t₂g orbitallar energiyasini o'zgartiradi</strong>, eg* esa deyarli o'zgarmaydi.
              Shuning uchun <strong>Δo = E(eg*) − E(t₂g)</strong> o'zgaradi:
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-400 font-bold">π-donor</p>
                <p className="text-purple-200 text-sm">t₂g ↑</p>
                <p className="text-white font-bold text-lg">Δo ↓</p>
                <p className="text-purple-400 text-xs">Eng kichik</p>
              </div>
              <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-4">
                <p className="text-gray-400 font-bold">Faqat σ</p>
                <p className="text-purple-200 text-sm">t₂g —</p>
                <p className="text-white font-bold text-lg">Δo —</p>
                <p className="text-purple-400 text-xs">O'rtacha</p>
              </div>
              <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-400 font-bold">π-akseptor</p>
                <p className="text-purple-200 text-sm">t₂g ↓</p>
                <p className="text-white font-bold text-lg">Δo ↑↑</p>
                <p className="text-purple-400 text-xs">Eng katta</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SPEKTROKIMYOVIY QATOR SABABI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Spektrokimyoviy qator — LMN tushuntirishi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th><th className="py-3 px-4 text-purple-300">π turi</th><th className="py-3 px-4 text-purple-300">t₂g energiyasi</th><th className="py-3 px-4 text-purple-300">Δo</th><th className="py-3 px-4 text-purple-300">Spin</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["I⁻, Br⁻, Cl⁻, F⁻","π-donor","Ko'tariladi ↑","Kichik","Yuqori spin"],
                  ["H₂O, OH⁻","Kuchsiz π-donor","Biroz ko'tariladi","O'rtacha-kichik","Yuqori spin"],
                  ["NH₃, en","Faqat σ-donor","O'zgarmaydi","O'rtacha","Yuqori/quyi"],
                  ["CN⁻, CO","π-akseptor","Pasayadi ↓","Katta","Quyi spin"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 font-bold">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>π-bog'lanish <strong className="text-yellow-400">t₂g orbitallar energiyasini</strong> o'zgartiradi</li>
            <li><strong>π-donorlar:</strong> t₂g energiyasini ko'taradi → Δo ↓</li>
            <li><strong>π-akseptorlar:</strong> t₂g energiyasini pasaytiradi → Δo ↑↑</li>
            <li>Spektrokimyoviy qator <strong>π-xossalar</strong> bilan izohlanadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/sigma-boglanish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← σ-bog'lanish</Link>
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/mo-diagramma" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">MO diagrammasi →</Link>
        </div>

      </section>
    </main>
  )
}