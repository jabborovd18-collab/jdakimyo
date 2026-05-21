import Link from "next/link"

export default function KompleksTuzlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/sinf" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧂 Kompleks tuzlar</h1>
          <p className="text-purple-400 text-sm">Tarkibida H⁺ yoki OH⁻ bo'lmagan kompleks birikmalar • Eng ko'p tarqalgan sinf</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks tuzlar haqida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Kompleks tuzlar</strong> — eng ko'p tarqalgan kompleks birikmalar sinfi. 
              Ular tarkibida <strong className="text-yellow-400">H⁺ yoki OH⁻ bo'lmagan</strong> kompleks birikmalardir. 
              Tashqi sferasida metall kationlari yoki boshqa anionlar bo'lishi mumkin.
            </p>
          </div>

          <p className="text-purple-200 leading-relaxed">
            Kompleks tuzlar o'z navbatida <strong className="text-yellow-400">kation kompleksli</strong> (ichki sfera musbat) 
            va <strong className="text-yellow-400">anion kompleksli</strong> (ichki sfera manfiy) turlarga bo'linadi. 
            Ayrim hollarda ham kation, ham anion kompleks tutgan tuzlar ham uchraydi.
          </p>
        </div>

        {/* 2. ANION KOMPLEKSLI TUZ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-red-400">🔴</span> Anion kompleksli tuz
          </h2>
          <p className="text-purple-400 text-sm mb-6">Ichki sfera manfiy zaryadli</p>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">K₄[Fe(CN)₆]</h3>
              <p className="text-purple-300 mb-3">
                <strong>kaliy geksasiyanoferrat(II)</strong> — &quot;Sariq qon tuzi&quot;
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li>• Tashqi sfera: <strong className="text-yellow-400">4K⁺</strong></li>
                  <li>• Ichki sfera: <strong className="text-red-400">[Fe(CN)₆]⁴⁻</strong></li>
                  <li>• Markaziy atom: <strong>Fe²⁺ (temir)</strong></li>
                  <li>• Ligandlar: <strong>6 ta CN⁻</strong></li>
                  <li>• Koordinatsion son: <strong>6</strong></li>
                  <li>• Geometriya: <strong>Oktaedrik</strong></li>
                  <li>• Oziq-ovqat qo'shimchasi: <strong>E536</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">K₃[Fe(CN)₆]</h3>
              <p className="text-purple-300 mb-3">
                <strong>kaliy geksasiyanoferrat(III)</strong> — &quot;Qizil qon tuzi&quot;
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li>• Tashqi sfera: <strong className="text-yellow-400">3K⁺</strong></li>
                  <li>• Ichki sfera: <strong className="text-red-400">[Fe(CN)₆]³⁻</strong></li>
                  <li>• Markaziy atom: <strong>Fe³⁺ (temir)</strong></li>
                  <li>• Fe²⁺ → Fe³⁺ oksidlanish darajasi farqi</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 3. KATION KOMPLEKSLI TUZ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-blue-400">🔵</span> Kation kompleksli tuz
          </h2>
          <p className="text-purple-400 text-sm mb-6">Ichki sfera musbat zaryadli</p>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">[Cr(H₂O)₆]Cl₃</h3>
              <p className="text-purple-300 mb-3">
                <strong>geksaakvaxrom(III) xlorid</strong>
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li>• Ichki sfera: <strong className="text-blue-400">[Cr(H₂O)₆]³⁺</strong></li>
                  <li>• Tashqi sfera: <strong className="text-yellow-400">3Cl⁻</strong></li>
                  <li>• Markaziy atom: <strong>Cr³⁺ (xrom)</strong></li>
                  <li>• Ligandlar: <strong>6 ta H₂O</strong></li>
                  <li>• Rangi: <strong>Binafsha</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
              <h3 className="text-xl font-bold text-yellow-400 mb-3">[Co(NH₃)₆]Cl₃</h3>
              <p className="text-purple-300 mb-3">
                <strong>geksaamminkobalt(III) xlorid</strong> — Verner klassikasi
              </p>
              <div className="bg-purple-900/50 rounded-lg p-4">
                <ul className="text-purple-200 space-y-2 text-sm">
                  <li>• Ichki sfera: <strong className="text-blue-400">[Co(NH₃)₆]³⁺</strong></li>
                  <li>• Tashqi sfera: <strong className="text-yellow-400">3Cl⁻</strong></li>
                  <li>• Markaziy atom: <strong>Co³⁺ (kobalt)</strong></li>
                  <li>• Rangi: <strong>Zarg'aldoq-sariq</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 4. HAM KATION HAM ANION KOMPLEKSLI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">
            <span className="text-purple-400">🟣</span> Ham kation, ham anion kompleksli tuz
          </h2>
          <p className="text-purple-400 text-sm mb-6">Ikkala ion ham kompleks tuzilishga ega</p>
          
          <div className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">[Pt(NH₃)₄][PtCl₄]</h3>
            <p className="text-purple-300 mb-3">
              <strong>tetraamminplatina(II) tetraxloroplatinat(II)</strong> — &quot;Magnusning yashil tuzi&quot;
            </p>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <ul className="text-purple-200 space-y-2 text-sm">
                <li>• Kation kompleks: <strong className="text-blue-400">[Pt(NH₃)₄]²⁺</strong></li>
                <li>• Anion kompleks: <strong className="text-red-400">[PtCl₄]²⁻</strong></li>
                <li>• Ikkalasi ham <strong>Pt²⁺</strong> — bir xil metall!</li>
                <li>• Rangi: <strong>Yashil</strong></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. DISSOTSILANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Dissotsilanish xususiyatlari</h2>
          
          <div className="space-y-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Anion kompleksli tuz</h3>
              <p className="font-mono text-yellow-400">K₄[Fe(CN)₆] → 4K⁺ + [Fe(CN)₆]⁴⁻</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Kation kompleksli tuz</h3>
              <p className="font-mono text-yellow-400">[Cr(H₂O)₆]Cl₃ → [Cr(H₂O)₆]³⁺ + 3Cl⁻</p>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">Ham kation, ham anion kompleksli</h3>
              <p className="font-mono text-yellow-400">[Pt(NH₃)₄][PtCl₄] → [Pt(NH₃)₄]²⁺ + [PtCl₄]²⁻</p>
            </div>
          </div>
          
          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Muhim:</strong> Barcha kompleks tuzlarda ichki sfera mustahkam bog'langan. 
              Dissotsilanishda faqat tashqi sfera ionlari ajralib chiqadi.
            </p>
          </div>
        </div>

        {/* 6. XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Kompleks tuzlar <strong className="text-yellow-400">eng ko'p tarqalgan</strong> kompleks birikmalar sinfi</li>
            <li>Tarkibida <strong className="text-yellow-400">H⁺ yoki OH⁻ yo'q</strong></li>
            <li>3 turga bo'linadi: <strong>anion kompleksli, kation kompleksli, aralash</strong></li>
            <li>Sariq qon tuzi K₄[Fe(CN)₆] — anion kompleksli tuz</li>
            <li>Magnusning yashil tuzi — ham kation, ham anion kompleksli</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/sinf/asos" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Kompleks asoslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/sinf" 
            className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 transition-all text-white font-semibold"
          >
            Sinf bo'limi →
          </Link>
        </div>

      </section>

    </main>
  )
}