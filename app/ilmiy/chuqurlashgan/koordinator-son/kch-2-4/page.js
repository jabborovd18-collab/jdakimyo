import Link from "next/link"

export default function KCh2_4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-violet-400">🔷 KCh = 2−4: Past koordinator sonlar</h1>
          <p className="text-purple-400 text-sm">Chiziqli • Uchburchak • Tetraedrik • Kvadrat planar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KCh = 2 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 KCh = 2 — Chiziqli geometriya (D∞h)</h2>
          
          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-violet-400">KCh = 2</strong> — eng sodda koordinator son. Ikkita ligand metall markaziga 
              <strong className="text-violet-400"> 180° burchak ostida</strong> joylashgan. Faqat <strong className="text-violet-400">d¹⁰ 
              konfiguratsiyali</strong> metall ionlarida (Cu⁺, Ag⁺, Au⁺, Hg²⁺) uchraydi. 
              sp gibridlanish — ikkita σ-bog' hosil bo'ladi. d-orbitallar to'liq to'lganligi sababli 
              <strong>KMN stabilizatsiyasi nolga teng</strong> — geometriya faqat sterik omillar bilan belgilanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">Xarakteristikalar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gibridlanish:</strong> sp (2 ta σ-bog')</li>
                <li>• <strong>Simmetriya:</strong> D∞h</li>
                <li>• <strong>Bog' burchagi:</strong> 180°</li>
                <li>• <strong>Elektron konfiguratsiya:</strong> d¹⁰</li>
                <li>• <strong>KMN stabilizatsiyasi:</strong> 0 (nol)</li>
                <li>• <strong>π-bog'lanish:</strong> Mumkin (dπ−pπ)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">Kompleks misollar</h3>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 px-3 text-purple-400">Kompleks</th><th className="text-left py-2 px-3 text-purple-400">M−L (Å)</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["[Ag(NH₃)₂]⁺", "Ag−N: 2.12"],["[CuCl₂]⁻", "Cu−Cl: 2.09"],["[Au(CN)₂]⁻", "Au−C: 1.98"],["[Hg(CH₃)₂]", "Hg−C: 2.08"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[0]}</td><td className="py-2 px-3 text-xs">{r[1]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">Nima uchun faqat d¹⁰?</h3>
            <p className="text-purple-200 text-sm">
              d¹⁰ konfiguratsiyada barcha d-orbitallar to'liq to'lgan — KMN stabilizatsiya energiyasi = 0. 
              Geometriya faqat ligandlar orasidagi sterik itarilish bilan belgilanadi. Ikkita ligand uchun 
              eng katta masofa — 180° burchak ostida. Qisman to'lgan d-qobiqli metallar (d¹−d⁹) KCh=2 ni 
              deyarli hosil qilmaydi — ular KMN stabilizatsiyasidan foyda olish uchun yuqori KCh ga intiladi.
            </p>
          </div>
        </div>

        {/* KCh = 3 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 KCh = 3 — Uchburchak (D₃h) va T-simon</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-violet-400">KCh = 3</strong> — kam uchraydigan koordinator son. 
            Uchta ligand 120° burchak ostida trigonal planar (D₃h) yoki T-simon geometriyada joylashgan.
            Asosan <strong>katta sterik hajmli ligandlar</strong> bilan barqarorlashadi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">Trigonal planar (D₃h)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Gibridlanish:</strong> sp²</li>
                <li>• <strong>Bog' burchagi:</strong> 120°</li>
                <li>• <strong>Misollar:</strong> [Pt(PPh₃)₃], [Fe(N(SiMe₃)₂)₃]</li>
                <li>• <strong>Metallar:</strong> Pt⁰, Pd⁰, Ni⁰ (d¹⁰)</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-violet-400 font-bold mb-2">T-simon (C₂v)</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Bog' burchagi:</strong> 90° va 180°</li>
                <li>• <strong>Misollar:</strong> [Rh(PPh₃)₃]⁺, [Pt(PR₃)₂Cl]</li>
                <li>• <strong>Sababi:</strong> d⁸ konfiguratsiyada kvadrat planar fragment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KCh = 4 — Tetraedrik */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 KCh = 4 — Tetraedrik geometriya (Td)</h2>
          
          <div className="bg-violet-600/10 border border-violet-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-violet-400">Tetraedrik (Td)</strong> — KCh=4 uchun eng keng tarqalgan geometriya.
              To'rtta ligand <strong>109.5°</strong> burchak ostida joylashgan. sp³ gibridlanish. 
              <strong className="text-violet-400">Kuchsiz maydon ligandlari</strong> (Cl⁻, Br⁻, I⁻, OH⁻) va 
              <strong className="text-violet-400">d¹⁰ konfiguratsiyali</strong> metallar (Zn²⁺, Cd²⁺, Hg²⁺) uchun xarakterli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { compound: "[CoCl₄]²⁻", d: "d⁷", spin: "HS (S=3/2)", color: "Ko'k", vMCl: "300 sm⁻¹" },
              { compound: "[Zn(OH)₄]²⁻", d: "d¹⁰", spin: "Diamagnit", color: "Rangsiz", vMO: "480 sm⁻¹" },
              { compound: "[Ni(CO)₄]", d: "d¹⁰ (Ni⁰)", spin: "Diamagnit", color: "Rangsiz", vMC: "422 sm⁻¹" },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <p className="text-yellow-400 font-mono font-bold">{r.compound}</p>
                <p className="text-purple-300 text-xs mt-1">Konfig: {r.d} | Spin: {r.spin}</p>
                <p className="text-purple-300 text-xs">Rang: {r.color} | ν: {r.vMCl || r.vMO || r.vMC}</p>
              </div>
            ))}
          </div>
        </div>

        {/* KCh = 4 — Kvadrat planar */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">◻️ KCh = 4 — Kvadrat planar geometriya (D₄h)</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">Kvadrat planar (D₄h)</strong> — KCh=4 uchun ikkinchi muhim geometriya.
              To'rtta ligand bir tekislikda <strong>90°</strong> burchak ostida joylashgan. dsp² gibridlanish. 
              <strong className="text-blue-400">d⁸ konfiguratsiyali metallar + kuchli maydon ligandlari</strong> (CN⁻, CO, PR₃) 
              uchun xarakterli. KMN bo'yicha: dx²−y² orbital bo'sh qoladi — bu energetik jihatdan juda qulay.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">dⁿ</th>
                <th className="py-3 px-4 text-purple-300">M−L (Å)</th>
                <th className="py-3 px-4 text-purple-300">Rang</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ni(CN)₄]²⁻", "Ni²⁺", "d⁸", "Ni−C: 1.86", "Sariq"],
                  ["[PtCl₂(NH₃)₂]", "Pt²⁺", "d⁸", "Pt−Cl: 2.33", "Sariq"],
                  ["[PdCl₄]²⁻", "Pd²⁺", "d⁸", "Pd−Cl: 2.31", "Qizil-jigarrang"],
                  ["[AuCl₄]⁻", "Au³⁺", "d⁸", "Au−Cl: 2.28", "Sariq"],
                  ["[Rh(PPh₃)₃]⁺", "Rh⁺", "d⁸", "Rh−P: 2.30", "Sariq"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
              <h3 className="text-yellow-400 font-bold mb-2">Tetraedrik vs Kvadrat planar</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Ni(CN)₄]²⁻ (kv. planar)</strong> va <strong>[NiCl₄]²⁻ (tetraedrik)</strong> — 
                ikkalasi ham d⁸, lekin CN⁻ kuchli maydoni dx²−y² orbitalni bo'sh qoldirib, kvadrat planar 
                geometriyani energetik qulay qiladi. Cl⁻ kuchsiz maydoni tetraedrik geometriyaga olib keladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4">
              <h3 className="text-violet-400 font-bold mb-2">d⁸ konfiguratsiya energetikasi</h3>
              <p className="text-purple-200 text-sm">
                Kvadrat planar maydonda d⁸: (dxz,dyz)⁴(dz²)²(dxy)²(dx²−y²)⁰ — past spinli, diamagnit.
                Tetraedrik maydonda d⁸: e⁴t₂⁴ — 2 ta toq elektron, paramagnit.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>KCh=2 — faqat <strong className="text-violet-400">d¹⁰ metallar</strong> (Ag⁺, Cu⁺, Au⁺, Hg²⁺)</li>
            <li>KCh=3 — kam uchraydi, <strong className="text-violet-400">katta sterik ligandlar</strong> bilan barqaror</li>
            <li>Tetraedrik — <strong className="text-violet-400">kuchsiz maydon ligandlari</strong> (Cl⁻, Br⁻, OH⁻) + har qanday dⁿ</li>
            <li>Kvadrat planar — <strong className="text-violet-400">d⁸ + kuchli maydon ligandlari</strong> (CN⁻, CO)</li>
            <li>Geometriya tanlovi = <strong className="text-violet-400">KMN + sterik omillar + elektron konfiguratsiya</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Koordinator son</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kch-5-6" className="px-6 py-3 bg-violet-600/80 rounded-xl hover:bg-violet-500 text-white font-semibold">KCh = 5−6 →</Link>
        </div>

      </section>
    </main>
  )
}