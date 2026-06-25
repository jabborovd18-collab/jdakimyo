import Link from "next/link"

export default function Metallosupramolekulyar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/supramolekulyar" className="text-purple-400 hover:text-purple-300 text-lg">← Supramolekulyar</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔗 Metallosupramolekulyar ansambllar</h1>
          <p className="text-purple-400 text-sm">Fujita & Stang ansambllari • Helikatlar • Molekulyar kataklar • Panjaralar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Metallosupramolekulyar kimyo haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Metallosupramolekulyar kimyo</strong> — metall ionlari 
              va organik ligandlarning <strong>koordinatsion bog'lanish orqali o'z-o'zini yig'ishi</strong> 
              natijasida hosil bo'ladigan murakkab supramolekulyar tuzilmalarni o'rganadi.
              <strong className="text-green-400">Koordinatsion bog'ning yuqori yo'naltirilganligi va 
              mustahkamligi</strong> (100−400 kJ/mol) aniq geometriyali ansambllarni dasturlashtirish 
              imkonini beradi. <strong>Fujita (Yaponiya)</strong> va <strong>Stang (AQSh)</strong> 
              bu sohaning yetakchi olimlari — ular palladiy va platina asosidagi 
              <strong>molekulyar kataklar, panjaralar va nanokonteynerlarni</strong> yaratgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Nima uchun metall ioni?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Aniq geometriya:</strong> Pt²⁺ — kvadrat planar (90°), Pd²⁺ — kvadrat planar, Cu⁺ — tetraedrik (109°)</li>
                <li>• <strong>Kinetik inertlik:</strong> Pt²⁺, Ru²⁺ — mahsulot barqaror, "o'z-o'zini tuzatish" imkoniyati</li>
                <li>• <strong>Labil ligandlar:</strong> Pd²⁺ — tez almashinadi, termodinamik mahsulotga olib keladi</li>
                <li>• <strong>Redoks faollik:</strong> Cu⁺/Cu²⁺, Fe²⁺/Fe³⁺ — qo'shimcha funktsionallik</li>
                <li>• <strong>Spektroskopik zond:</strong> Metall markazi NMR, UV-Vis, lyuminestsensiya uchun</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Asosiy ansambl turlari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Helikatlar:</strong> Metall ioni atrofida ligand zanjirining spiral o'ralishi</li>
                <li>• <strong>Molekulyar kataklar:</strong> 3D yopiq tuzilmalar — ichki bo'shliqqa ega</li>
                <li>• <strong>Panjaralar (grids):</strong> 2D to'r shaklidagi tuzilmalar</li>
                <li>• <strong>Nanokonteynerlar:</strong> Katta bo'shliqqa ega — kimyoviy reaksiyalar uchun mikroreaktor</li>
                <li>• <strong>Metall-makrotsikllar:</strong> Siklik oligomerlar — molekulyar tanib olish</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. FUJITA ANSAMBLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Fujita ansambllari — Pd(II) molekulyar kataklar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            <strong className="text-green-400">Makoto Fujita (Tokio Universiteti)</strong> — Pd(II) ning 
            kvadrat planar geometriyasidan foydalanib, <strong>o'z-o'zini yig'ish</strong> orqali 
            murakkab 3D tuzilmalarni yaratgan. Uning eng mashhur ansambli — 
            <strong>Pd₁₂L₂₄ sferik katak</strong> (diametri ~3.5 nm). Bu katak ichida 
            <strong>kimyoviy reaksiyalar</strong> olib borish mumkin — u mikroreaktor vazifasini bajaradi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-3">Pd₁₂L₂₄ katak — "molekulyar flakon"</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>12 ta Pd²⁺</strong> — kvadrat planar tugunlar</li>
                <li>• <strong>24 ta ko'prik ligand</strong> — tris(piridin)triazin</li>
                <li>• <strong>Diametri:</strong> ~3.5 nm (ichki bo'shliq)</li>
                <li>• <strong>Zaryad:</strong> +24 (suvda eriydi)</li>
                <li>• <strong>Qo'llanish:</strong> Kataliz, molekulyar tanib olish, DNK bilan bog'lanish</li>
              </ul>
            </div>
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold text-sm mb-3">Fujita katagida kataliz</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Katak ichida <strong>Knoevenagel kondensatsiyasi</strong> — suvda!</li>
                <li>• <strong>Gidrofob effekt:</strong> Organik substratlar katak ichiga kiradi</li>
                <li>• <strong>Hajmiy selektivlik:</strong> Faqat katakka sig'adigan substratlar reaksiyaga kirishadi</li>
                <li>• <strong>Ferment mimetik:</strong> Fermentlarning faol markazini taqlid qiladi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. STANG ANSAMBLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Stang ansambllari — Pt(II) va Pd(II) makrotsikllar</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Peter Stang (Yuta Universiteti)</strong> — Pt(II) va Pd(II) 
            asosidagi <strong>metall-makrotsikllar va molekulyar panjaralar</strong> sintezi bo'yicha 
            yetakchi olim. Uning yondashuvi — <strong>directionality (yo'naltirilganlik) prinsipi</strong>: 
            donor va akseptor ligandlarning aniq burchak ostida joylashishi orqali kerakli geometriyani 
            dasturlash.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-2">Stang burchak prinsipi:</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-1 text-green-400">Donor burchagi</th><th className="text-left py-1 text-yellow-400">Akseptor burchagi</th><th className="text-left py-1 text-purple-300">Mahsulot</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["120°","120°","Rombsimon (C₂h)"],["90°","90°","Kvadrat (D₄h)"],["60°","60°","Uchburchak (D₃h)"],["0° (chiziqli)","60°","Uchburchak bipiramida"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/20"><td className="py-1">{r[0]}</td><td className="py-1">{r[1]}</td><td className="py-1">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold text-sm mb-2">Klassik Stang ansambllari:</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• <strong>Pt₂L₄ to'rtburchak:</strong> 2 ta Pt²⁺ (90° akseptor) + 4 ta 4,4'-bipy — molekulyar tanib olish</li>
                <li>• <strong>Pd₆L₁₂ oltiburchak:</strong> 6 ta Pd²⁺ (120° akseptor) — g'ovakli tuzilma</li>
                <li>• <strong>3D kataklar:</strong> Pt₆L₄ oktaedrik katak — fullerenni tanib oladi!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Metall ioni — <strong className="text-green-400">aniq geometriya va mustahkam bog'lanish</strong> orqali supramolekulyar ansambllarni barqarorlashtiradi</li>
            <li>Fujita kataklari — <strong className="text-green-400">Pd₁₂L₂₄</strong>, ichki bo'shliqda kataliz</li>
            <li>Stang burchak prinsipi — <strong className="text-green-400">donor + akseptor burchagi = ansambl geometriyasi</strong></li>
            <li>O'z-o'zini yig'ish — <strong className="text-green-400">termodinamik nazorat</strong> ostida (Pd — labil, Pt — inert)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/mof" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MOF</Link>
          <Link href="/ilmiy/chuqurlashgan/supramolekulyar/molekulyar-mashinalar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Molekulyar mashinalar →</Link>
        </div>

      </section>
    </main>
  )
}