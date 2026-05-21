import Link from "next/link"

export default function AralashLigandli() {
  const misollar = [
    {
      formula: "[Co(NH₃)₄Br(H₂O)](NO₃)₂",
      nomi: "bromoakvatetraamminkobalt(III) nitrat",
      ligandlar: "NH₃, Br⁻, H₂O",
      turi: "3 xil ligand",
      izoh: "Anion, neytral va kation ligandlar birgalikda. Nomlashda alfavit tartibi muhim."
    },
    {
      formula: "sis-[PtCl₂(NH₃)₂]",
      nomi: "sis-diammindixloroplatina(II) — SISPLATIN",
      ligandlar: "Cl⁻, NH₃",
      turi: "2 xil ligand",
      izoh: "Saraton kasalligini davolashda ishlatiladigan eng mashhur kompleks."
    },
    {
      formula: "[Co(NH₃)₅SO₄]Br",
      nomi: "sulfatopentaamminkobalt(III) bromid",
      ligandlar: "NH₃, SO₄²⁻",
      turi: "2 xil ligand",
      izoh: "Ionlanish izomeriyasiga misol. SO₄²⁻ ichki sferada."
    },
    {
      formula: "[CrCl₂(H₂O)₄]Cl·2H₂O",
      nomi: "dixlorotetraakvaxrom(III) xlorid digidrat",
      ligandlar: "Cl⁻, H₂O",
      turi: "2 xil ligand",
      izoh: "Gidrat izomeriyaga misol. To'q yashil rangli."
    },
    {
      formula: "[Fe(CO)₃(NO)]⁻",
      nomi: "trikarbonilnitrozilferrat(0)",
      ligandlar: "CO, NO",
      turi: "2 xil ligand",
      izoh: "CO va NO — ikkalasi ham kuchli maydonli neytral ligandlar."
    },
    {
      formula: "fac-[Co(NH₃)₃Cl₃]",
      nomi: "fac-trixlorotriaminkobalt(III)",
      ligandlar: "NH₃, Cl⁻",
      turi: "2 xil ligand",
      izoh: "Fac-mer izomeriyaga misol. 3 ta Cl bir yuzda joylashgan."
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/oquv/klassifikatsiyasi/ligand" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🎨 Aralash ligandli komplekslar</h1>
          <p className="text-purple-400 text-sm">Bir necha turdagi ligandlar tutgan komplekslar • Eng amaliy ahamiyatga ega guruh</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. TA'RIF */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Aralash ligandli komplekslar haqida</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Aralash ligandli komplekslar</strong> — ichki sferada 
              <strong className="text-yellow-400"> bir necha turdagi ligandlar</strong> tutgan kompleks birikmalardir. 
              Bu eng ko'p uchraydigan va <strong className="text-yellow-400">eng amaliy ahamiyatga ega</strong> guruhdir. 
              Aksariyat kompleks birikmalar aynan aralash ligandli bo'ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xususiyatlari</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Bir necha turdagi ligandlar</li>
                <li>• Ko'pincha geometrik izomeriya mavjud</li>
                <li>• Nomlashda alfavit tartibi muhim</li>
                <li>• Tabiatda eng ko'p tarqalgan</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Muhim faktlar</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Sisplatin — eng mashhur vakil</li>
                <li>• Izomeriya turlari ko'p uchraydi</li>
                <li>• Farmatsevtikada keng qo'llaniladi</li>
                <li>• Katalizator sifatida muhim</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. ASOSIY MISOLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Eng muhim aralash ligandli komplekslar</h2>
          
          <div className="space-y-6">
            {misollar.map((m, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-6 border border-purple-700/30 hover:border-pink-400/30 transition-all">
                <h3 className="text-xl font-bold text-yellow-400 font-mono mb-2">{m.formula}</h3>
                <p className="text-purple-200 font-semibold mb-3">{m.nomi}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-pink-600/20 text-pink-400 border border-pink-600/30 px-3 py-1 rounded-full text-xs">
                    {m.turi}
                  </span>
                  {m.ligandlar.split(", ").map((l, j) => (
                    <span key={j} className="bg-purple-600/20 text-purple-300 border border-purple-600/30 px-3 py-1 rounded-full text-xs">
                      {l}
                    </span>
                  ))}
                </div>
                <p className="text-purple-300 text-sm">💡 {m.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. SISPLATIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Sisplatin — aralash ligandli komplekslarning eng muhim vakili</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">sis-[PtCl₂(NH₃)₂]</strong> — sisplatin — 
              aralash ligandli komplekslarning eng yorqin amaliy misoli. Bu kompleks 
              <strong className="text-yellow-400"> saraton kasalliklarini davolashda</strong> keng qo'llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ta'sir mexanizmi</h3>
              <p className="text-purple-200 text-sm">
                Sisplatin DNK molekulasiga kirib, qo'shni guanin asoslari bilan o'zaro bog'lanib (cross-linking), 
                DNK replikatsiyasini to'xtatadi va saraton hujayralarining bo'linishini oldini oladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nega faqat sis-izomer?</h3>
              <p className="text-purple-200 text-sm">
                Trans-izomer DNK bilan bunday bog'lanishni hosil qila olmaydi. Shuning uchun 
                faqat sis-izomer biologik faol, trans-izomer esa ta'sirsiz. Bu geometrik izomeriyaning 
                tibbiyotdagi eng muhim misoli!
              </p>
            </div>
          </div>
        </div>

        {/* 4. IZOMERIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Aralash ligandli komplekslarda izomeriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geometrik izomeriya</h3>
              <p className="text-purple-200 text-sm">
                Har xil ligandlar turlicha joylashishi mumkin — sis-trans, fac-mer izomerlar hosil bo'ladi. 
                Bu ko'pchilik aralash ligandli komplekslar uchun xarakterli.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ionlanish izomeriyasi</h3>
              <p className="text-purple-200 text-sm">
                Tashqi va ichki sfera o'rtasida ligand almashinishi natijasida ionlanish izomerlari hosil bo'ladi. 
                Masalan: [CoBr(NH₃)₅]SO₄ va [Co(NH₃)₅SO₄]Br.
              </p>
            </div>
          </div>
        </div>

        {/* 5. XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Aralash ligandli komplekslar — <strong className="text-yellow-400">eng ko'p tarqalgan</strong> guruh</li>
            <li>Ichki sferada <strong>bir necha turdagi ligandlar</strong> mavjud</li>
            <li>Sisplatin — <strong>eng muhim aralash ligandli kompleks</strong></li>
            <li>Ko'pincha <strong>izomeriya</strong> kuzatiladi</li>
            <li>Tibbiyot va farmatsevtikada keng qo'llaniladi</li>
          </ol>
        </div>

        {/* Pastki navigatsiya */}
        <div className="flex justify-between pt-6">
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/nitrit" 
            className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 transition-all text-purple-300"
          >
            ← Nitrit komplekslar
          </Link>
          <Link 
            href="/oquv/klassifikatsiyasi/ligand/xelat" 
            className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 transition-all text-white font-semibold"
          >
            Keyingi: Xelat komplekslar →
          </Link>
        </div>

      </section>

    </main>
  )
}