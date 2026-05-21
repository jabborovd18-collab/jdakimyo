import Link from "next/link"

export default function SpinOrbit() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔗 Spin-orbit bog&apos;lanish</h1>
          <p className="text-purple-400 text-sm">ζ konstantasi • λ va Δ<sub>o</sub> raqobati • 3d/4d/5d farqlari • Orbital hissa mexanizmi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Spin-orbit bog&apos;lanish nazariyasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Spin-orbit bog&apos;lanish (SOC)</strong> — elektronning xususiy spini 
              va orbital harakati orasidagi <strong>relativistik kvant-mexanik ta&apos;sir</strong>. 
              Klassik analog: yadro atrofida aylanayotgan elektron &quot;ko&apos;rgan&quot; magnit maydon 
              elektron spini bilan ta&apos;sirlashadi. Kompleks birikmalarda spin-orbit bog&apos;lanish 
              <strong className="text-yellow-400"> orbital magnit momentining qo&apos;shilishiga</strong>, 
              <strong className="text-yellow-400"> EPR spektrlarining anizotropiyasiga</strong> va 
              <strong className="text-yellow-400"> spin-taqiqlangan o&apos;tishlarning intensivligiga</strong> 
              bevosita ta&apos;sir ko&apos;rsatadi. SOC kuchi <strong>atom raqami ortishi bilan keskin oshadi</strong> 
              (Z⁴ ga proporsional).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Mikroskopik mexanizm</h3>
              <p className="text-purple-200 text-sm">
                Yadro atrofida harakatlanayotgan elektron o&apos;z sanoq sistemasida 
                <strong>zaryadlangan yadroning aylanma harakatini</strong> &quot;ko&apos;radi&quot;. 
                Bu harakat elektr tokini va demak, <strong>magnit maydon (B<sub>int</sub>)</strong> hosil qiladi. 
                Elektron spini shu ichki magnit maydon bilan ta&apos;sirlashadi. 
                Ta&apos;sir energiyasi: <strong>H<sub>SO</sub> = ζ(r) L·S</strong>.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Atom raqamiga bog&apos;liqlik</h3>
              <p className="text-purple-200 text-sm">
                Spin-orbit bog&apos;lanish konstantasi <strong>ζ ∝ Z<sub>eff</sub>⁴</strong>. 
                Og&apos;ir atomlarda yadro zaryadi katta — elektronlar katta tezlikda harakatlanadi 
                (relyativistik effekt). Natijada:<br/>
                • 3d (Ti→Cu): ζ ≈ 50−850 cm⁻¹<br/>
                • 4d (Zr→Ag): ζ ≈ 300−1800 cm⁻¹<br/>
                • 5d (Hf→Au): ζ ≈ 1000−5000 cm⁻¹
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. ζ KONSTANTASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Spin-orbit bog&apos;lanish konstantasi (ζ)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Spin-orbit bog&apos;lanish konstantasi ζ</strong> (dzeta) — 
              berilgan atom yoki ion uchun SOC kuchini xarakterlovchi asosiy parametr.
              Erkin ion uchun ζ<sub>erkin</sub> qiymatlari spektroskopik ma&apos;lumotlardan aniqlangan.
              <strong className="text-yellow-400">Kompleksda ζ kamayadi</strong> — bu 
              <strong> nefelauksetrik effektning magnit analogi</strong> (kovalentlik ta&apos;siri).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">ζ<sub>erkin</sub> (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">ζ<sub>kompleks</sub> (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">λ = ±ζ/2S</th>
                <th className="py-3 px-4 text-purple-300">SOC ta&apos;siri</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ti³⁺", "d¹", "154", "~120", "+154 (T₂<sub>g</sub>)", "Kuchsiz"],
                  ["V³⁺", "d²", "210", "~170", "+105", "O&apos;rtacha"],
                  ["Cr³⁺", "d³", "275", "~230", "+92", "O&apos;rtacha-kuchsiz"],
                  ["Mn²⁺", "d⁵(YS)", "300", "~260", "— (L=0)", "Juda kuchsiz"],
                  ["Fe²⁺", "d⁶(YS)", "410", "~340", "−102 (T₂<sub>g</sub>)", "Katta"],
                  ["Fe³⁺", "d⁵(YS)", "460", "~400", "— (L=0)", "Juda kuchsiz"],
                  ["Co²⁺", "d⁷(YS)", "530", "~430", "−177 (T₁<sub>g</sub>)", "Juda katta"],
                  ["Ni²⁺", "d⁸", "650", "~550", "+325", "Katta"],
                  ["Cu²⁺", "d⁹", "830", "~700", "−830", "Juda katta"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-blue-400">{r[3]}</td>
                    <td className="py-3 px-4 text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">ζ va λ orasidagi bog&apos;liqlik</h3>
            <p className="text-purple-200 text-sm">
              <strong>λ = ±ζ / 2S</strong> — ko&apos;p elektronli atomlar uchun effektiv SOC konstantasi.
              Ishorasi qobiqning to&apos;lish darajasiga bog&apos;liq:<br/>
              • n &lt; 5 (qobiq yarimdan kam to&apos;lgan): λ musbat — J = |L−S| asosiy<br/>
              • n &gt; 5 (qobiq yarimdan ko&apos;p to&apos;lgan): λ manfiy — J = L+S asosiy<br/>
              • n = 5 (yarim to&apos;lgan): L = 0, SOC yo&apos;q (birinchi yaqinlashishda)
            </p>
          </div>
        </div>

        {/* ── 3. SOC VA LIGAND MAYDONI RAQOBATI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚔️ Spin-orbit bog&apos;lanish vs Ligand maydoni</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks birikmalarda magnit xossalarini belgilovchi <strong className="text-yellow-400">ikkita asosiy 
              raqobatlashuvchi kuch</strong> mavjud: ligand maydoni (Δ<sub>o</sub>) va spin-orbit bog&apos;lanish (ζ).
              Ularning nisbiy kuchiga qarab <strong>uch xil rejim</strong> farqlanadi. Bu raqobat 
              orbital magnit momentining qanchalik so&apos;ndirilishini belgilaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kuchsiz maydon: Δ<sub>o</sub> &lt; ζ</h3>
              <p className="text-purple-200 text-sm">
                <strong>Holat:</strong> 5d, lantanoidlar, ayrim 4d komplekslar.<br/>
                <strong>Natija:</strong> SOC ligand maydonidan kuchli — J yaxshi kvant soni.<br/>
                <strong>Magnit moment:</strong> μ = g√[J(J+1)] formulasi.<br/>
                <strong>Misol:</strong> [IrCl₆]²⁻, lantanoid komplekslari.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">O&apos;rtacha maydon: Δ<sub>o</sub> ≈ ζ</h3>
              <p className="text-purple-200 text-sm">
                <strong>Holat:</strong> Ayrim 3d (Co²⁺, Fe²⁺) va 4d komplekslar.<br/>
                <strong>Natija:</strong> SOC va ligand maydoni raqobatlashadi.<br/>
                <strong>Magnit moment:</strong> Spin-only va J-formula orasida.<br/>
                <strong>Misol:</strong> [Co(H₂O)₆]²⁺, [Fe(H₂O)₆]²⁺.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kuchli maydon: Δ<sub>o</sub> &gt; ζ</h3>
              <p className="text-purple-200 text-sm">
                <strong>Holat:</strong> Ko&apos;pchilik 3d komplekslar.<br/>
                <strong>Natija:</strong> Ligand maydoni dominant — orbital moment &quot;muzlaydi&quot;.<br/>
                <strong>Magnit moment:</strong> Spin-only formula, kichik tuzatma.<br/>
                <strong>Misol:</strong> [Cr(H₂O)₆]³⁺, [Ni(H₂O)₆]²⁺.
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">3d, 4d, 5d metallar uchun raqobat xarakteri</h3>
            <p className="text-purple-200 text-sm">
              <strong>3d:</strong> ζ ≈ 150−850 cm⁻¹, Δ<sub>o</sub> ≈ 8,000−35,000 cm⁻¹ → <strong>Δ<sub>o</sub> &gt;&gt; ζ</strong>. 
              Ligand maydoni dominant. Spin-only formula yaxshi ishlaydi, orbital hissa kichik tuzatma sifatida qo&apos;shiladi.<br/>
              <strong>4d:</strong> ζ ≈ 300−1800 cm⁻¹, Δ<sub>o</sub> ≈ 20,000−40,000 cm⁻¹ → <strong>Δ<sub>o</sub> &gt; ζ</strong>, 
              lekin farq kamroq. Orbital hissa sezilarli. Spin-only formuladan chetlanishlar mavjud.<br/>
              <strong>5d:</strong> ζ ≈ 1000−5000 cm⁻¹, Δ<sub>o</sub> ≈ 25,000−45,000 cm⁻¹ → <strong>Δ<sub>o</sub> ≈ ζ yoki ζ &gt; Δ<sub>o</sub></strong>. 
              SOC kuchli. Spin-only formula ishlamaydi. J-formula qo&apos;llaniladi.
            </p>
          </div>
        </div>

        {/* ── 4. ORBITAL HISSA VA SOC ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Orbital hissa qo&apos;shilishining SOC mexanizmi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Spin-orbit bog&apos;lanish <strong className="text-yellow-400">orbital magnit momentining qo&apos;shilishiga</strong> 
              olib keladi. SOC orqali qo&apos;zg&apos;algan holatlar (orbital momentga ega) asosiy holat bilan 
              aralashadi. Bu aralashish <strong>λ/Δ<sub>o</sub></strong> parametrga proporsional. 
              λ katta, Δ<sub>o</sub> kichik bo&apos;lsa — orbital hissa kuchli.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                term: "A va E termlar (orbital singlet)",
                mexanizm: "A₁<sub>g</sub>, A₂<sub>g</sub>, E<sub>g</sub> — orbital degeneratlik yo&apos;q. SOC orqali qo&apos;zg&apos;algan T termlar bilan aralashish mavjud, lekin bu ikkinchi tartibli effekt. Natijada orbital hissa juda kichik: μ<sub>eff</sub> ≈ μ<sub>SO</sub> × (1 − 4λ/Δ<sub>o</sub>). Misol: d³ (⁴A₂<sub>g</sub>) — λ/Δ<sub>o</sub> ≈ 0.01, tuzatma ~4%.",
              },
              {
                term: "T termlar (orbital triplet)",
                mexanizm: "T₁<sub>g</sub>, T₂<sub>g</sub> — uch karra orbital degeneratlik. SOC birinchi tartibli effekt beradi. Orbital moment qisman saqlanadi. μ<sub>eff</sub> = μ<sub>SO</sub> × (1 + αλ/Δ<sub>o</sub>), bu yerda α — term turiga bog&apos;liq koeffitsiyent. Misol: d⁷(YS) (⁴T₁<sub>g</sub>) — λ/Δ<sub>o</sub> ≈ 0.06, tuzatma ~20−35%.",
              },
              {
                term: "T₂<sub>g</sub> vs T₁<sub>g</sub> farqi",
                mexanizm: "T₂<sub>g</sub> (t₂g orbitallardan kelib chiqqan) — SOC orqali faqat t₂g orbitallar ichida aralashish. T₁<sub>g</sub> (t₂g va eg aralashgan) — kuchliroq SOC, chunki eg orbitallar ham ishtirok etadi. Shuning uchun d⁷(YS) (T₁<sub>g</sub>) da orbital hissa d⁶(YS) (T₂<sub>g</sub>) ga nisbatan kattaroq.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.term}</h3>
                <p className="text-purple-200 text-sm">{r.mexanizm}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. SOC VA EPR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📡 Spin-orbit bog&apos;lanish va EPR spektroskopiya</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">EPR (elektron paramagnit rezonans)</strong> spektroskopiyada 
              spin-orbit bog&apos;lanish <strong>g-faktor anizotropiyasi</strong> sifatida namoyon bo&apos;ladi.
              Erkin elektron uchun g = 2.0023, lekin komplekslarda SOC tufayli g-faktor bu qiymatdan 
              farq qiladi va <strong>yo&apos;nalishga bog&apos;liq</strong> bo&apos;lib qoladi (g<sub>∥</sub> ≠ g<sub>⊥</sub>).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">g<sub>∥</sub></th>
                <th className="py-3 px-4 text-purple-300">g<sub>⊥</sub></th>
                <th className="py-3 px-4 text-purple-300">g<sub>o&apos;rtacha</sub></th>
                <th className="py-3 px-4 text-purple-300">Δg = g − 2.0023</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cu²⁺ (O<sub>h</sub> cho&apos;zilgan)", "d⁹", "2.30−2.40", "2.06−2.08", "2.15−2.20", "+0.15"],
                  ["Cr³⁺ (O<sub>h</sub>)", "d³", "1.97−1.99", "1.97−1.99", "1.98", "−0.02"],
                  ["Fe³⁺ (YS, O<sub>h</sub>)", "d⁵", "2.00", "2.00", "2.00", "≈ 0"],
                  ["Co²⁺ (YS, O<sub>h</sub>)", "d⁷", "4.3−5.0", "2.0−2.5", "3.0−3.5", "+1.0−1.5"],
                  ["Ni²⁺ (O<sub>h</sub>)", "d⁸", "2.15−2.25", "2.15−2.25", "2.18", "+0.18"],
                  ["V⁴⁺ (O<sub>h</sub>)", "d¹", "1.93−1.96", "1.93−1.96", "1.95", "−0.05"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-semibold">{r[4]}</td>
                    <td className="py-3 px-4">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">g-faktor va SOC orasidagi bog&apos;liqlik</h3>
            <p className="text-purple-200 text-sm">
              SOC kuchli bo&apos;lganda g-faktor erkin elektron qiymatidan sezilarli farq qiladi:<br/>
              • <strong>g &gt; 2.0023:</strong> qobiq yarimdan ko&apos;p to&apos;lgan (n &gt; 5) — Cu²⁺ (d⁹), Ni²⁺ (d⁸)<br/>
              • <strong>g &lt; 2.0023:</strong> qobiq yarimdan kam to&apos;lgan (n &lt; 5) — Ti³⁺ (d¹), V⁴⁺ (d¹), Cr³⁺ (d³)<br/>
              • <strong>g ≈ 2.0023:</strong> L = 0 holatlar — Fe³⁺ (d⁵, ⁶A₁<sub>g</sub>), Mn²⁺ (d⁵)<br/>
              Co²⁺ (d⁷, ⁴T₁<sub>g</sub>) eng katta anizotropiyaga ega — g<sub>∥</sub> va g<sub>⊥</sub> orasidagi farq 2−3 gacha yetadi.
            </p>
          </div>
        </div>

        {/* ── 6. SOC NING SPEKTROSKOPIK OQIBATLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 SOC ning spektroskopik va magnit oqibatlari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                oqibat: "Spin-taqiqlangan o&apos;tishlarning kuchayishi",
                izoh: "SOC turli spinli holatlarni aralashtiradi. Natijada ΔS ≠ 0 bo&apos;lgan o&apos;tishlar qisman ruxsat etilgan bo&apos;lib qoladi. Og&apos;ir atomlarda (4d, 5d) spin-taqiqlangan polosalar ancha intensiv. Misol: Mn²⁺ (d⁵) komplekslarining och pushti rangi.",
              },
              {
                oqibat: "Nolinchi maydon ajralishi (ZFS)",
                izoh: "S ≥ 1 bo&apos;lgan komplekslarda SOC orqali spin sathlari tashqi magnit maydonsiz ham ajraladi. Bu ajralish D parametri bilan xarakterlanadi. Misol: Ni²⁺ (S=1) — ZFS ≈ 1−10 cm⁻¹; Co²⁺ (S=3/2) — ZFS ≈ 10−100 cm⁻¹.",
              },
              {
                oqibat: "Magnit anizotropiya",
                izoh: "SOC kompleksning turli yo&apos;nalishlarda turlicha magnitlanishiga olib keladi. Bu — yagona molekula magnitlari (SMM) asosidagi effekt. Misol: [Mn₁₂O₁₂(OAc)₁₆(H₂O)₄] — kuchli magnit anizotropiya, past haroratda magnitlanishni &quot;muzlatadi&quot;.",
              },
              {
                oqibat: "Fosforessensiya va lyuminessensiya",
                izoh: "Kuchli SOC singlet→triplet o&apos;tishlarni ruxsat etadi, bu esa fosforessensiyaga olib keladi. Ir³⁺ va Pt²⁺ komplekslari kuchli SOC tufayli samarali fosforessensiya beradi — OLED qurilmalarida ishlatiladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.oqibat}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-yellow-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Spin-orbit bog&apos;lanish (SOC)</strong> — relativistik effekt, ζ ∝ Z⁴, og&apos;ir atomlarda kuchli</li>
            <li><strong className="text-yellow-400">3d:</strong> Δ<sub>o</sub> &gt;&gt; ζ — spin-only formula yetarli; <strong>5d:</strong> ζ ≈ Δ<sub>o</sub> — J-formula kerak</li>
            <li><strong className="text-yellow-400">T termlar</strong> (T₁<sub>g</sub>, T₂<sub>g</sub>) — SOC orqali kuchli orbital hissa; A/E termlar — kuchsiz</li>
            <li><strong className="text-yellow-400">EPR g-faktori:</strong> SOC tufayli anizotrop, g<sub>∥</sub> ≠ g<sub>⊥</sub>; Co²⁺ da eng katta farq</li>
            <li><strong className="text-yellow-400">SOC oqibatlari:</strong> spin-taqiq o&apos;tishlar, ZFS, magnit anizotropiya, fosforessensiya</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit/sezgirlik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Magnit sezgirlik
          </Link>
          <Link href="/ilmiy/chuqurlashgan/magnit/dia-paramagnit" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Dia/paramagnit komplekslar →
          </Link>
        </div>

      </section>
    </main>
  )
}