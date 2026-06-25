import Link from "next/link"

export default function KislotaAsos() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="text-purple-400 hover:text-purple-300 text-lg">← Reaksiyalar</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🧪 Kislota-asos reaksiyalari</h1>
          <p className="text-purple-400 text-sm">Gidroliz • Protonlanish • Olatsiya • pKa • Brønsted/Lyuis kislota-asos</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Komplekslarning kislota-asos xossalari haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">Kompleks birikmalar</strong> kislota-asos reaksiyalariga 
              <strong className="text-purple-400">uch xil yo'l bilan</strong> kirishadi: (1) koordinatsiyalangan 
              suv molekulalarining <strong>gidrolizi</strong> (proton ajralishi), (2) ligandlarning 
              <strong>protonlanishi</strong> (asos xossasi), (3) <strong>olatsiya</strong> — 
              gidrokso ko'prik hosil bo'lishi. Metall ionining <strong>zaryadi va radiusi</strong> 
              koordinatsiyalangan suvning kislotaliligini keskin oshiradi — 
              [Fe(H₂O)₆]³⁺ ning pKa si ~2.2 (sirka kislotadan kuchliroq!).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Akvakomplekslarning gidrolizi</h3>
              <p className="text-purple-200 text-sm mb-2">
                <strong className="text-yellow-400">[M(H₂O)₆]ⁿ⁺ ⇌ [M(H₂O)₅(OH)]⁽ⁿ⁻¹⁾⁺ + H⁺</strong>
              </p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• Metall zaryadi <strong>oshgan sari</strong> pKa kamayadi (kislotalilik ortadi)</li>
                <li>• Metall radiusi <strong>kamaygan sari</strong> pKa kamayadi</li>
                <li>• pKa = −log(Ka), Ka = [M−OH][H⁺]/[M−OH₂]</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Protonlanish — ligand asos xossasi</h3>
              <p className="text-purple-200 text-sm mb-2">
                <strong className="text-yellow-400">[M−NH₃] + H⁺ ⇌ [M−NH₄]⁺</strong>
              </p>
              <ul className="text-purple-300 text-xs space-y-1">
                <li>• Koordinatsiyalangan NH₃ <strong>erkin NH₃ dan kuchsizroq asos</strong></li>
                <li>• Metall elektron zichligini tortadi → N−H bog'i qutblanadi</li>
                <li>• OH⁻, CN⁻ ligandlari ham protonlanadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. pKa JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Akvakomplekslarning pKa qiymatlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Metall ionining <strong>zaryad/zichlik nisbati</strong> (z/r) qancha katta bo'lsa, 
            koordinatsiyalangan suv shuncha kuchli kislota bo'ladi. Metall H₂O molekulasidan 
            elektron zichligini tortadi → O−H bog'i qutblanadi → proton oson ajraladi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">z/r (e/Å)</th>
                <th className="py-3 px-4 text-purple-300">pKa₁</th>
                <th className="py-3 px-4 text-purple-300">Kislotalilik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Fe(H₂O)₆]³⁺", "Fe³⁺ (d⁵ HS)", "~4.6", "2.2", "Sirka kislotadan kuchliroq!"],
                  ["[Cr(H₂O)₆]³⁺", "Cr³⁺ (d³)", "~4.3", "4.0", "Kuchsiz kislota"],
                  ["[Al(H₂O)₆]³⁺", "Al³⁺ (d⁰)", "~5.6", "5.0", "Kuchsiz kislota"],
                  ["[Co(H₂O)₆]³⁺", "Co³⁺ (d⁶ LS)", "~4.4", "1.7", "Juda kuchli kislota!"],
                  ["[Fe(H₂O)₆]²⁺", "Fe²⁺ (d⁶ HS)", "~2.6", "9.5", "Juda kuchsiz kislota"],
                  ["[Ni(H₂O)₆]²⁺", "Ni²⁺ (d⁸)", "~2.9", "9.9", "Juda kuchsiz kislota"],
                  ["[Cu(H₂O)₆]²⁺", "Cu²⁺ (d⁹)", "~2.8", "7.5", "Kuchsiz kislota"],
                  ["[Zn(H₂O)₆]²⁺", "Zn²⁺ (d¹⁰)", "~2.7", "9.0", "Juda kuchsiz kislota"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-purple-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * pKa₁ — birinchi proton ajralishi. Ikkinchi proton (pKa₂) odatda pKa₁ + 1.5−2 birlikka teng.
            [Fe(H₂O)₆]³⁺ ning pKa₁ ≈ 2.2 — bu CH₃COOH (pKa=4.76) dan kuchliroq kislota!
          </p>
        </div>

        {/* 3. OLATSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Olatsiya — gidrokso ko'prik hosil bo'lishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-purple-400">Olatsiya</strong> — ikki metal markazi o'rtasida 
            <strong>OH⁻ ko'prik ligand</strong> orqali bog'lanish. Gidroliz mahsuloti bo'lgan 
            gidrokso komplekslar dimerlanib, <strong>ko'p yadroli komplekslar</strong> hosil qiladi.
            Bu jarayon <strong>Fe³⁺, Cr³⁺, Al³⁺</strong> akvakomplekslarida ayniqsa muhim — 
            ularning suvli eritmalari vaqt o'tishi bilan kislotaliligi ortadi (qarish effekti).
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-purple-400 font-bold mb-3">Olatsiya bosqichlari:</h3>
            <div className="space-y-2 text-xs text-purple-200">
              <p><strong className="text-yellow-400">1. Gidroliz:</strong> [M(H₂O)₆]ⁿ⁺ ⇌ [M(H₂O)₅(OH)]⁽ⁿ⁻¹⁾⁺ + H⁺</p>
              <p><strong className="text-yellow-400">2. Olatsiya:</strong> 2[M(H₂O)₅(OH)]⁽ⁿ⁻¹⁾⁺ → [(H₂O)₄M(OH)₂M(H₂O)₄]²⁽ⁿ⁻¹⁾⁺ + 2H₂O</p>
              <p className="text-purple-300 mt-2">Ikki OH⁻ ko'prik — <strong>diol ko'prik</strong> — eng barqaror ko'prik turi</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-4">
              <h3 className="text-red-400 font-bold text-sm mb-2">Fe³⁺ gidrolizi va olatsiyasi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• pH {'>'} 2 da Fe³⁺ gidrolizlanadi</li>
                <li>• Dimer, trimer, oligomer → kolloid → cho'kma</li>
                <li>• <strong>Zang</strong> — FeO(OH) — olatsiya mahsuloti</li>
                <li>• Eritma rangi: sariq → to'q sariq → qizil-jigarrang</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4">
              <h3 className="text-blue-400 font-bold text-sm mb-2">Cr³⁺ gidrolizi va olatsiyasi</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Kinetik inert — olatsiya juda sekin</li>
                <li>• Qizdirilganda tezlashadi</li>
                <li>• Binafsha → yashil rang o'zgarishi</li>
                <li>• <strong>Oksolatsiya:</strong> OH⁻ → O²⁻ (proton yo'qolishi)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Metall zaryadi oshgan sari <strong className="text-purple-400">koordinatsiyalangan suvning kislotaliligi ortadi</strong></li>
            <li>[Fe(H₂O)₆]³⁺ (pKa≈2.2) — <strong className="text-purple-400">sirka kislotadan kuchliroq!</strong></li>
            <li>Olatsiya — <strong className="text-purple-400">OH⁻ ko'prik orqali ko'p yadroli komplekslar</strong> hosil bo'lishi</li>
            <li>pKa metallning z/r nisbatiga <strong className="text-purple-400">chiziqli bog'liq</strong></li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/fotokimyoviy" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Fotokimyoviy reaksiyalar</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar/templat-sintez" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Templat sintez →</Link>
        </div>

      </section>
    </main>
  )
}