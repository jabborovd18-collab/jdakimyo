import Link from "next/link"

export default function SpektrokimyoviyQator() {
  const qator = [
    { ligand: "I⁻", nomi: "iodo", kuch: "Eng kuchsiz", tur: "π-donor", rang: "text-gray-400", bg: "bg-gray-600/10 border-gray-500/30" },
    { ligand: "Br⁻", nomi: "bromo", kuch: "Kuchsiz", tur: "π-donor", rang: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
    { ligand: "S²⁻", nomi: "tio", kuch: "Kuchsiz", tur: "π-donor", rang: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30" },
    { ligand: "SCN⁻", nomi: "tiosianato", kuch: "Kuchsiz", tur: "π-donor", rang: "text-orange-400", bg: "bg-orange-600/10 border-orange-500/30" },
    { ligand: "Cl⁻", nomi: "xloro", kuch: "Kuchsiz", tur: "π-donor", rang: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
    { ligand: "NO₃⁻", nomi: "nitrato", kuch: "Kuchsiz", tur: "π-donor", rang: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
    { ligand: "F⁻", nomi: "ftoro", kuch: "O'rtacha-kuchsiz", tur: "π-donor", rang: "text-cyan-400", bg: "bg-cyan-600/10 border-cyan-500/30" },
    { ligand: "OH⁻", nomi: "gidrokso", kuch: "O'rtacha", tur: "π-donor", rang: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
    { ligand: "ox²⁻", nomi: "oksalato", kuch: "O'rtacha", tur: "π-donor", rang: "text-pink-400", bg: "bg-pink-600/10 border-pink-500/30" },
    { ligand: "H₂O", nomi: "akva", kuch: "O'rtacha", tur: "Kuchsiz π-donor", rang: "text-blue-300", bg: "bg-blue-600/10 border-blue-500/30" },
    { ligand: "NCS⁻", nomi: "izotiosianato", kuch: "O'rtacha-kuchli", tur: "π-akseptor", rang: "text-yellow-300", bg: "bg-yellow-600/10 border-yellow-500/30" },
    { ligand: "py", nomi: "piridin", kuch: "O'rtacha-kuchli", tur: "π-akseptor", rang: "text-green-300", bg: "bg-green-600/10 border-green-500/30" },
    { ligand: "NH₃", nomi: "ammin", kuch: "Kuchli", tur: "Faqat σ-donor", rang: "text-blue-400", bg: "bg-blue-600/10 border-blue-500/30" },
    { ligand: "en", nomi: "etilendiamin", kuch: "Kuchli", tur: "Faqat σ-donor", rang: "text-cyan-400", bg: "bg-cyan-600/10 border-cyan-500/30" },
    { ligand: "bpy", nomi: "2,2'-bipiridin", kuch: "Kuchli", tur: "π-akseptor", rang: "text-purple-400", bg: "bg-purple-600/10 border-purple-500/30" },
    { ligand: "phen", nomi: "1,10-fenantrolin", kuch: "Kuchli", tur: "π-akseptor", rang: "text-pink-400", bg: "bg-pink-600/10 border-pink-500/30" },
    { ligand: "NO₂⁻", nomi: "nitro", kuch: "Kuchli", tur: "π-akseptor", rang: "text-orange-400", bg: "bg-orange-600/10 border-orange-500/30" },
    { ligand: "PPh₃", nomi: "trifenilfosfin", kuch: "Juda kuchli", tur: "π-akseptor", rang: "text-yellow-400", bg: "bg-yellow-600/10 border-yellow-500/30" },
    { ligand: "CN⁻", nomi: "siyano", kuch: "Juda kuchli", tur: "π-akseptor", rang: "text-green-400", bg: "bg-green-600/10 border-green-500/30" },
    { ligand: "CO", nomi: "karbonil", kuch: "Eng kuchli", tur: "π-akseptor", rang: "text-red-400", bg: "bg-red-600/10 border-red-500/30" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kristall-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Kristall maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧪 Spektrokimyoviy qator</h1>
          <p className="text-purple-400 text-sm">Ligandlarning maydon kuchi bo'yicha to'liq joylashuvi • I⁻ dan CO gacha</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY TUSHUNCHA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spektrokimyoviy qator haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Spektrokimyoviy qator</strong> — ligandlarning 
              <strong className="text-yellow-400"> Δo ni oshirish qobiliyati</strong> bo'yicha empirik joylashuvi.
              Chap tomondagi ligandlar kuchsiz maydon (kichik Δo), o'ng tomondagilar kuchli maydon (katta Δo) hosil qiladi.
              Qator <strong className="text-yellow-400">spektroskopik tajribalar</strong> asosida tuzilgan.
            </p>
          </div>
        </div>

        {/* 2. TO'LIQ JADVAL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 To'liq spektrokimyoviy qator</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th><th className="py-3 px-4 text-purple-300">Nomi</th><th className="py-3 px-4 text-purple-300">Maydon kuchi</th><th className="py-3 px-4 text-purple-300">π-turi</th><th className="py-3 px-4 text-purple-300">Δo</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {qator.map((l, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className={`py-3 px-4 font-mono font-bold ${l.rang}`}>{l.ligand}</td>
                    <td className="py-3 px-4">{l.nomi}</td>
                    <td className="py-3 px-4 text-sm">{l.kuch}</td>
                    <td className="py-3 px-4 text-xs">{l.tur}</td>
                    <td className="py-3 px-4 text-xs">{i < 6 ? "Kichik" : i < 10 ? "O'rtacha" : i < 16 ? "Katta" : "Juda katta"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. UCHTA GURUH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Ligandlarning π-xossalari bo'yicha guruhlanishi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold text-lg mb-3">π-donorlar (kuchsiz)</h3>
              <p className="text-purple-200 text-sm mb-2">To'lgan π-orbitallardan metallga elektron beradi. Δo ↓</p>
              <p className="font-mono text-purple-300 text-xs">I⁻, Br⁻, S²⁻, SCN⁻, Cl⁻, NO₃⁻, F⁻</p>
            </div>
            <div className="bg-gray-600/10 border border-gray-500/30 rounded-xl p-5">
              <h3 className="text-gray-400 font-bold text-lg mb-3">Faqat σ-donorlar (o'rta)</h3>
              <p className="text-purple-200 text-sm mb-2">π-orbitallari yo'q yoki ishtirok etmaydi.</p>
              <p className="font-mono text-purple-300 text-xs">NH₃, en (etilendiamin)</p>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-lg mb-3">π-akseptorlar (kuchli)</h3>
              <p className="text-purple-200 text-sm mb-2">Bo'sh π*-orbitallarga metall elektronlarini qabul qiladi. Δo ↑↑</p>
              <p className="font-mono text-purple-300 text-xs">NCS⁻, py, bpy, phen, NO₂⁻, PPh₃, CN⁻, CO</p>
            </div>
          </div>
        </div>

        {/* 4. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Qatorning amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">[Fe(H₂O)₆]²⁺ vs [Fe(CN)₆]⁴⁻</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-200">H₂O — o'rtada (kuchsiz)</p>
                  <p className="text-purple-200">Δo kichik → <strong className="text-yellow-400">yuqori spin</strong></p>
                  <p className="text-purple-200">4 ta toq e⁻, paramagnit</p>
                </div>
                <div>
                  <p className="text-purple-200">CN⁻ — eng o'ngda (kuchli)</p>
                  <p className="text-purple-200">Δo katta → <strong className="text-green-400">quyi spin</strong></p>
                  <p className="text-purple-200">0 ta toq e⁻, diamagnit</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Spektrokimyoviy qator: <strong className="text-yellow-400">I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; H₂O &lt; NH₃ &lt; CN⁻ &lt; CO</strong></li>
            <li>π-donorlar Δo ni <strong>kamaytiradi</strong>, π-akseptorlar <strong>oshiradi</strong></li>
            <li>Qator <strong>yuqori/quyi spin bashorat qilishda</strong> asosiy vosita</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/ajralish-energiyasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Δo energiyasi</Link>
          <Link href="/ilmiy/chuqurlashgan/kristall-maydon/kmbe-hisoblash" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">KMBE hisoblash →</Link>
        </div>

      </section>
    </main>
  )
}