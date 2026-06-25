"use client"

import Link from "next/link"

export default function MetallDorilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/b12-vitamini" className="text-purple-400 hover:text-purple-300 text-lg">← B₁₂ vitamini</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">💊 Metall asosidagi dorilar</h1>
          <p className="text-purple-400 text-sm">Sisplatin • Ru-aren • Oltin • Platina • Metall komplekslarning terapevtik qo'llanilishi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metall komplekslar — dorilar sifatida</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Metall asosidagi dorilar</strong> — 
              zamonaviy tibbiyotning ajralmas qismi. Ular <strong>saraton kasalligi</strong> dan 
              tortib <strong>revmatoid artrit</strong> va <strong>infeksion kasalliklargacha</strong> 
              bo'lgan keng spektrda qo'llaniladi. Metall komplekslarning afzalligi: 
              <strong> geometriyasi, oksidlanish darajasi va ligandlarining xilma-xilligi</strong>.
              Eng mashhur metall-dori — <strong>sisplatin</strong> — har yili millionlab 
              bemorlarning hayotini saqlab qoladi. Metall-dorilarning ta'sir mexanizmi 
              <strong className="text-yellow-400">koordinatsion birikmalar kimyosi</strong> 
              bilan bevosita bog'liq: ligand almashinishi, DNK bilan bog'lanish, 
              redoks reaksiyalar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun metallar?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Geometrik xilma-xillik:</strong> kvadrat tekislik (Pt²⁺), oktaedr (Ru²⁺), tetraedr (Au⁺)</li>
                <li>• <strong>Redoks faollik:</strong> Fe²⁺/Fe³⁺, Cu⁺/Cu²⁺ — hujayra ichida ROS generatsiyasi</li>
                <li>• <strong>Ligand almashinishi:</strong> prodori → faol kompleks, DNK bilan bog'lanish</li>
                <li>• <strong>Organometallik bog'lar:</strong> Au−C, Ru−aren — barqaror va funksional</li>
                <li>• <strong>Radiofarmatsevtika:</strong> ⁹⁹ᵐTc, ¹⁸⁶Re — diagnostika va terapiya</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">KB nazariyasi bilan bog'liqlik</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Termodinamik barqarorlik:</strong> Irving-Williams qatori, xelat effekti</li>
                <li>• <strong>Kinetik inertlik:</strong> Pt²⁺ (d⁸) — sekin almashinish (soatlar/kunlar)</li>
                <li>• <strong>Labillik:</strong> Ru²⁺ (d⁶, LS) — ligand almashinishi tezroq</li>
                <li>• <strong>HSAB:</strong> Pt²⁺ (yumshoq) — S-donor (glutation) bilan bog'lanish</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAVZULAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Metall-dorilar turlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/sisplatin" 
              className="bg-purple-800/40 border border-yellow-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">💎</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Platina komplekslari</h3>
              <p className="text-purple-300 text-xs mt-2">
                Sisplatin • Karboplatin • Oksaliplatin — saratonga qarshi. DNK bilan bog'lanib, apoptozni induksiyalaydi.
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/ruteniy" 
              className="bg-purple-800/40 border border-yellow-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🟤</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Ruteniy komplekslari</h3>
              <p className="text-purple-300 text-xs mt-2">
                Ru-aren • NAMI-A • KP1019 — saraton metastaziga qarshi. Transferrin orqali tashiladi.
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/oltin" 
              className="bg-purple-800/40 border border-yellow-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Oltin komplekslari</h3>
              <p className="text-purple-300 text-xs mt-2">
                Auronofin • Au-NHC • Au(I)-fosfin — revmatoid artrit, saraton, infeksiyalar.
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/boshqa" 
              className="bg-purple-800/40 border border-yellow-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-yellow-400 font-bold group-hover:text-yellow-300">Boshqa metallar</h3>
              <p className="text-purple-300 text-xs mt-2">
                Temir • Mis • Galliy • Kumush • Vanadiy — antimikrob, antikanser, insulin-mimetik.
              </p>
            </Link>
          </div>
        </div>

        {/* SOLISHTIRISH JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Asosiy metall-dorilar solishtirilishi</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-purple-700/50">
                  <th className="text-left py-3 px-3 text-yellow-400">Dori</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Metall</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Geometriya</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Kasallik</th>
                  <th className="text-left py-3 px-3 text-yellow-400">Mexanizm</th>
                </tr>
              </thead>
              <tbody className="text-purple-200 text-xs">
                {[
                  ["Sisplatin", "Pt²⁺ (d⁸)", "Kvadrat tekislik", "Saraton (moyak, tuxumdon)", "DNK cross-link → apoptoz"],
                  ["Karboplatin", "Pt²⁺ (d⁸)", "Kvadrat tekislik", "Saraton (o'pka, bosh-bo'yin)", "Sisplatin kabi, sekinroq"],
                  ["Oksaliplatin", "Pt²⁺ (d⁸)", "Kvadrat tekislik", "Kolorektal saraton", "DNK cross-link (boshqa turdagi)"],
                  ["NAMI-A", "Ru³⁺ (d⁵)", "Oktaedr", "Saraton metastazi", "Transferrin orqali tashiladi"],
                  ["KP1019", "Ru³⁺ (d⁵)", "Oktaedr", "Kolorektal saraton", "Mitoxondriyal yo'l"],
                  ["Auronofin", "Au⁺ (d¹⁰)", "Chiziqli", "Revmatoid artrit", "Tiol-redoks muvozanat"],
                  ["Auranofin", "Au⁺ (d¹⁰)", "Tetraedr", "Saraton (klinik sinov)", "Tioredoksinreduktaza ingibitori"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3"><strong className="text-yellow-400">{row[0]}</strong></td>
                    <td className="py-2 px-3">{row[1]}</td>
                    <td className="py-2 px-3">{row[2]}</td>
                    <td className="py-2 px-3">{row[3]}</td>
                    <td className="py-2 px-3">{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PRODORI STRATEGIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Aktivatsiya — "prodori" strategiyasi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Ko'pchilik metall-dorilar <strong className="text-yellow-400">prodori</strong> 
              sifatida yuboriladi — ular organizmda <strong>faollashadi</strong>.
              Bu <strong>koordinatsion birikmalar kimyosining</strong> klassik tamoyillariga 
              asoslangan: ligand almashinishi, oksidlanish-qaytarilish, pH-ga bog'liq gidroliz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-sm mb-2">Sisplatin aktivatsiyasi</p>
              <p className="text-purple-200">
                <strong>[PtCl₂(NH₃)₂]</strong> — qonga yuboriladi.<br/>
                Qonda Cl⁻ yuqori (~100 mM) — sisplatin barqaror.<br/>
                Hujayra ichida Cl⁻ past (~4 mM) — <strong>gidroliz</strong>:<br/>
                Pt−Cl + H₂O → <strong>Pt−OH₂⁺</strong> (faol shakl).<br/>
                DNK bilan bog'lanadi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-sm mb-2">Ru-aren aktivatsiyasi</p>
              <p className="text-purple-200">
                Ru³⁺ (inert) qonga yuboriladi.<br/>
                Saraton to'qimasida <strong>gipoksiya (O₂ kam)</strong> —<br/>
                Ru³⁺ → <strong>Ru²⁺ (labillashadi)</strong>.<br/>
                "Aktivatsiya qaytarilish orqali" —<br/>
                sog'lom to'qimalarda Ru³⁺ saqlanadi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-sm mb-2">Au prodorilari</p>
              <p className="text-purple-200">
                Au⁺-fosfin — barqaror kompleks.<br/>
                Hujayra ichida tiolar (GSH, Cys) bilan<br/>
                <strong>ligand almashinishi</strong>:<br/>
                Au−PR₃ + RSH → <strong>Au−SR + PR₃</strong>.<br/>
                Tioredoksinreduktazani ingibirlaydi.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/b12-vitamini" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← B₁₂ vitamini</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/sisplatin" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Sisplatin →</Link>
        </div>

      </section>
    </main>
  )
}