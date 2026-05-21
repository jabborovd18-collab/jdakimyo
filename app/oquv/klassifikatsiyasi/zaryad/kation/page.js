import Link from "next/link"

export default function KationKomplekslar() {
  const misollar = [
    {
      formula: "[Co(NH₃)₆]Cl₃",
      nomi: "geksaamminkobalt(III) xlorid",
      ichki: "[Co(NH₃)₆]³⁺",
      tashqi: "3Cl⁻",
      zaryad: "+3",
      rang: "Zarg'aldoq-sariq",
      izoh: "Verner klassikasi. 6 ta NH₃ — ichki sfera musbat."
    },
    {
      formula: "[Zn(NH₃)₄]Cl₂",
      nomi: "tetraamminrux(II) xlorid",
      ichki: "[Zn(NH₃)₄]²⁺",
      tashqi: "2Cl⁻",
      zaryad: "+2",
      rang: "Rangsiz",
      izoh: "Rux ammiakati. KS = 4, tetraedrik."
    },
    {
      formula: "[Cr(H₂O)₆]Cl₃",
      nomi: "geksaakvaxrom(III) xlorid",
      ichki: "[Cr(H₂O)₆]³⁺",
      tashqi: "3Cl⁻",
      zaryad: "+3",
      rang: "Binafsha",
      izoh: "Gidrat izomeriyaga misol. 3 ta izomeri mavjud."
    },
    {
      formula: "[Ag(NH₃)₂]Cl",
      nomi: "diamminkumush(I) xlorid",
      ichki: "[Ag(NH₃)₂]⁺",
      tashqi: "Cl⁻",
      zaryad: "+1",
      rang: "Rangsiz",
      izoh: "Chiziqli kompleks. KS = 2. Tollens reaktivi uchun asos."
    },
    {
      formula: "[Cu(NH₃)₄]SO₄",
      nomi: "tetraamminmis(II) sulfat",
      ichki: "[Cu(NH₃)₄]²⁺",
      tashqi: "SO₄²⁻",
      zaryad: "+2",
      rang: "To'q ko'k",
      izoh: "Mis ammiakati. Shveytser reaktivi."
    },
    {
      formula: "[Al(H₂O)₆]Cl₃",
      nomi: "geksaakvaalyuminiy xlorid",
      ichki: "[Al(H₂O)₆]³⁺",
      tashqi: "3Cl⁻",
      zaryad: "+3",
      rang: "Rangsiz",
      izoh: "Alyuminiy akvakompleksi. KS = 6, oktaedrik."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/zaryad" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">➕ Kation komplekslar</h1>
          <p className="text-purple-400 text-sm">Ichki sfera musbat zaryadli • Tashqi sferada anionlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kation komplekslar haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kation komplekslar</strong> — ichki sferaning umumiy zaryadi 
              <strong className="text-yellow-400"> musbat</strong> bo'lgan komplekslardir. 
              Tashqi sferada anionlar (Cl⁻, SO₄²⁻, NO₃⁻ va h.k.) bo'ladi.
              Markaziy atom nomi <strong>o'zgarmaydi</strong> — oddiy element nomi bilan ataladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Ichki sfera zaryadi: <strong className="text-blue-400">+1, +2, +3, +4</strong></li>
                <li>• Tashqi sfera: anionlar</li>
                <li>• Nomlashda o'zgarish yo'q</li>
                <li>• Suvda dissotsilanadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Dissotsilanish</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Tashqi sfera anionlari ajraladi</li>
                <li>• Ichki sfera butunligicha qoladi</li>
                <li>• Elektr o'tkazuvchanlikka ega</li>
                <li>• Ko'pchiligi suvda yaxshi eriydi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim kation komplekslar</h2>
          
          <div className="space-y-6">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 hover:border-blue-400/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-yellow-400 font-mono">{m.formula}</h3>
                  <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs font-semibold">
                    Z = {m.zaryad}
                  </span>
                </div>
                <p className="text-purple-200 font-semibold mb-3">{m.nomi}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div className="text-purple-300">
                    <span className="text-purple-400">Ichki:</span> <strong className="text-blue-400">{m.ichki}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Tashqi:</span> <strong className="text-yellow-400">{m.tashqi}</strong>
                  </div>
                  <div className="text-purple-300">
                    <span className="text-purple-400">Rangi:</span> <strong>{m.rang}</strong>
                  </div>
                </div>
                <p className="text-purple-400 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. DISSOTSILANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Dissotsilanish reaksiyalari</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                [Co(NH₃)₆]Cl₃ → <strong className="text-blue-400">[Co(NH₃)₆]³⁺</strong> + 3Cl⁻
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                [Cr(H₂O)₆]Cl₃ → <strong className="text-blue-400">[Cr(H₂O)₆]³⁺</strong> + 3Cl⁻
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="font-mono text-purple-200">
                [Ag(NH₃)₂]Cl → <strong className="text-blue-400">[Ag(NH₃)₂]⁺</strong> + Cl⁻
              </p>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Muhim:</strong> Ichki sfera mustahkam bog'langan. Dissotsilanishda faqat tashqi sfera ionlari ajraladi.
            </p>
          </div>
        </div>

        {/* 4. XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kation komplekslar — <strong className="text-yellow-400">ichki sfera musbat zaryadli</strong></li>
            <li>Tashqi sferada <strong>anionlar</strong> joylashgan</li>
            <li>Markaziy atom nomi <strong>o'zgarmaydi</strong></li>
            <li>Suvda dissotsilanganda <strong>faqat tashqi sfera ionlari ajraladi</strong></li>
            <li>Eng ko'p uchraydigan komplekslar turi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Zaryad bo'limi
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/zaryad/anion" 
            className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 transition-all text-white font-semibold"
          >
            Keyingi: Anion komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}