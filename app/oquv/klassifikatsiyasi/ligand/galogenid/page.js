import Link from "next/link"

export default function GalogenidKomplekslar() {
  const misollar = [
    {
      formula: "K₂[PtCl₆]",
      nomi: "kaliy geksaxloroplatinat(IV)",
      ion: "Pt⁴⁺ (d⁶)",
      ligand: "Cl⁻",
      ks: "6",
      geometriya: "Oktaedrik",
      xususiyat: "Sariq kristall modda. Platina kimyosida muhim birikma."
    },
    {
      formula: "Na₃[AlF₆]",
      nomi: "natriy geksaftoroalyuminat(III) — KRIOLIT",
      ion: "Al³⁺ (d⁰)",
      ligand: "F⁻",
      ks: "6",
      geometriya: "Oktaedrik",
      xususiyat: "Alyuminiy sanoatida elektrolit sifatida. Tabiiy mineral — kriolit."
    },
    {
      formula: "K₂[HgI₄]",
      nomi: "kaliy tetraiodomerkurat(II)",
      ion: "Hg²⁺ (d¹⁰)",
      ligand: "I⁻",
      ks: "4",
      geometriya: "Tetraedrik",
      xususiyat: "Nessler reaktivi — NH₃/NH₄⁺ ni sifat aniqlashda."
    },
    {
      formula: "H[AuCl₄]",
      nomi: "tetraxloroaurat(III) kislota",
      ion: "Au³⁺ (d⁸)",
      ligand: "Cl⁻",
      ks: "4",
      geometriya: "Tekis kvadrat",
      xususiyat: "Zar suvi tarkibida. Oltin qazib olishda muhim."
    },
    {
      formula: "[CoCl₄]²⁻",
      nomi: "tetraxlorokobaltat(II) ioni",
      ion: "Co²⁺ (d⁷)",
      ligand: "Cl⁻",
      ks: "4",
      geometriya: "Tetraedrik",
      xususiyat: "Ko'k rangli. Suvsiz muhitda barqaror. Suv qo'shilsa pushti rangga o'tadi."
    },
    {
      formula: "[FeCl₄]⁻",
      nomi: "tetraxloroferrat(III) ioni",
      ion: "Fe³⁺ (d⁵)",
      ligand: "Cl⁻",
      ks: "4",
      geometriya: "Tetraedrik",
      xususiyat: "Sariq-jigarrang. Organik sintezda katalizator."
    }
  ]

  const ligandKuchi = [
    { ligand: "I⁻", nomi: "iodo", kuch: "Eng kuchsiz", rang: "text-gray-400" },
    { ligand: "Br⁻", nomi: "bromo", kuch: "Kuchsiz", rang: "text-red-400" },
    { ligand: "Cl⁻", nomi: "xloro", kuch: "O'rtacha kuchsiz", rang: "text-green-400" },
    { ligand: "F⁻", nomi: "ftoro", kuch: "O'rtacha", rang: "text-yellow-400" }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧂 Galogenid komplekslar</h1>
          <p className="text-purple-400 text-sm">Ligand: F⁻, Cl⁻, Br⁻, I⁻ • Eng sodda anion komplekslar • Kuchsiz maydonli ligandlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Galogenid komplekslar haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Galogenid komplekslar</strong> — ligand sifatida 
              <strong className="text-yellow-400"> galogenid ionlari</strong> (F⁻, Cl⁻, Br⁻, I⁻) qatnashgan 
              eng sodda anion komplekslardir. Ular atsidokomplekslarning eng ko'p uchraydigan vakillaridir. 
              Galogenidlar <strong className="text-yellow-400">kuchsiz maydonli</strong> ligandlar bo'lib, 
              spektrokimyoviy qatorning boshida joylashgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• F⁻ — ftoro (eng kichik, eng kuchli galogenid)</li>
                <li>• Cl⁻ — xloro (eng ko'p tarqalgan)</li>
                <li>• Br⁻ — bromo</li>
                <li>• I⁻ — iodo (eng katta, eng kuchsiz)</li>
                <li>• Hammasi monodentat, anion</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Barchasi <strong>yuqori spinli</strong> komplekslar</li>
                <li>• Rangi ligandga va metallga bog'liq</li>
                <li>• Ko'pchiligi suvda yaxshi eriydi</li>
                <li>• Sanoatda keng qo'llaniladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. LIGAND KUCHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Galogenid ligandlarning kuchi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Galogenidlar orasida ligand maydon kuchi <strong>F⁻ dan I⁻ ga qarab kamayib boradi</strong>. 
            F⁻ — eng kuchli galogenid ligand, I⁻ — eng kuchsiz.
          </p>
          
          <div className="space-y-3">
            {ligandKuchi.map((l, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-center gap-4">
                <span className="text-2xl">{["4️⃣","3️⃣","2️⃣","1️⃣"][i]}</span>
                <div className="flex-1">
                  <h3 className="text-white font-bold">
                    <span className="font-mono text-lg text-yellow-400">{l.ligand}</span> — {l.nomi}
                  </h3>
                  <p className={`${l.rang} text-sm font-semibold`}>{l.kuch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ASOSIY MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim galogenid komplekslar</h2>
          
          <div className="space-y-6">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 hover:border-green-400/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono">{m.formula}</h3>
                  <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    KS = {m.ks}
                  </span>
                </div>
                <p className="text-purple-200 font-semibold mb-3">{m.nomi}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="text-purple-300">
                    <span className="text-purple-400">Markaziy ion:</span> <strong className="text-yellow-400">{m.ion}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Ligand:</span> <strong className="text-green-400">{m.ligand}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Geometriya:</span> <strong>{m.geometriya}</strong>
                  </div>
                  <div className="text-purple-300 md:col-span-2 mt-2">
                    <span className="text-yellow-400">💡</span> {m.xususiyat}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. AMALIY AHAMIYATI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🏭 Sanoat</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Na₃[AlF₆] — alyuminiy ishlab chiqarish</li>
                <li>• H[AuCl₄] — oltin qazib olish</li>
                <li>• Pt komplekslari — katalizatorlar</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">🔬 Analitik kimyo</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• K₂[HgI₄] — Nessler reaktivi</li>
                <li>• [CoCl₄]²⁻ — suvni aniqlash</li>
                <li>• FeCl₄⁻ — fenollar bilan rang reaksiyasi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Galogenid komplekslar — <strong className="text-yellow-400">eng sodda anion komplekslar</strong></li>
            <li>Ligandlar: F⁻, Cl⁻, Br⁻, I⁻ — <strong>kuchsiz maydonli</strong></li>
            <li>Ligand kuchi: <strong>F⁻ &gt; Cl⁻ &gt; Br⁻ &gt; I⁻</strong></li>
            <li>Barchasi <strong>yuqori spinli</strong> komplekslar hosil qiladi</li>
            <li>Na₃[AlF₆] — alyuminiy sanoatining asosi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/sianid" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Sianid komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/nitrit" 
            className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 transition-all text-white font-semibold"
          >
            Keyingi: Nitrit komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}