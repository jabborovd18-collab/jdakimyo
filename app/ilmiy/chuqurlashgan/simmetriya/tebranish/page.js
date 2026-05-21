import Link from "next/link"

export default function Tebranish() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">📈 Simmetriya va tebranish spektrlari</h1>
          <p className="text-purple-400 text-sm">3N−6 qoidasi • Normal koordinatalar • IQ va Raman faollik • Oktaedrik komplekslarda tebranish modlari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Tebranish spektroskopiyasi va simmetriya</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tebranish spektroskopiyasi (IQ va Raman)</strong> — 
              kompleks birikmalarning tuzilishini aniqlashning eng informativ usullaridan biri.
              Simmetriya nazariyasi yordamida <strong>qaysi tebranish modlari IQ-faol, qaysilari 
              Raman-faol</strong> ekanligini oldindan bashorat qilish mumkin. Oktaedrik kompleksda 
              <strong> 15 ta normal tebranish modi</strong> mavjud (3N−6 = 3×7−6 = 15), 
              lekin ularning faqat bir qismi spektrlarda kuzatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">IQ spektroskopiya</h3>
              <p className="text-purple-200 text-sm">Dipol moment o&apos;zgarishi kerak</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">Δμ ≠ 0</p>
              <p className="text-purple-400 text-xs">T<sub>1u</sub> simmetriya (O<sub>h</sub>)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Raman spektroskopiya</h3>
              <p className="text-purple-200 text-sm">Qutblanuvchanlik o&apos;zgarishi kerak</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">Δα ≠ 0</p>
              <p className="text-purple-400 text-xs">A<sub>1g</sub>, E<sub>g</sub>, T<sub>2g</sub> (O<sub>h</sub>)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Alternativ taqiq</h3>
              <p className="text-purple-200 text-sm">Inversiya markazi bo&apos;lsa</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">IQ ⊥ Raman</p>
              <p className="text-purple-400 text-xs">O<sub>h</sub> va D<sub>4h</sub> da amal qiladi</p>
            </div>
          </div>
        </div>

        {/* ── 2. NORMAL TEBRANISH MODLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Normal tebranish modlari — 3N−6 qoidasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Normal tebranish modi</strong> — molekuladagi barcha atomlarning 
              bir xil chastota bilan va <strong>fazada</strong> tebranadigan mustaqil tebranish turi.
              N atomli nochiziqli molekulada <strong>3N−6 ta</strong> normal tebranish modi mavjud 
              (3N ta erkinlik darajasi − 3 ta ilgarilanma − 3 ta aylanma).
              Chiziqli molekulada <strong>3N−5</strong> (aylanma 2 ta).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks turi</th>
                <th className="py-3 px-4 text-purple-300">Atomlar soni (N)</th>
                <th className="py-3 px-4 text-purple-300">Erkinlik darajasi (3N)</th>
                <th className="py-3 px-4 text-purple-300">Normal modlar (3N−6)</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Chiziqli [ML₂]", "3", "9", "4 (3×3−5)", "[Ag(NH₃)₂]⁺"],
                  ["Tetraedrik [ML₄]", "5", "15", "9", "[CoCl₄]²⁻"],
                  ["Kvadrat-planar [ML₄]", "5", "15", "9", "[PtCl₄]²⁻"],
                  ["Trigonal-bipiramida [ML₅]", "6", "18", "12", "[Fe(CO)₅]"],
                  ["Oktaedrik [ML₆]", "7", "21", "15", "[Co(NH₃)₆]³⁺"],
                  ["Oktaedrik [ML₆] ligand ichki", "7+N<sub>lig</sub>", "—", "15 + ligand ichki", "[Co(NH₃)₆]³⁺ (NH₃ ichki)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Oktaedrik [ML₆] — 15 ta normal mod</h3>
            <p className="text-purple-200 text-sm">
              <strong>3 ta ilgarilanma:</strong> molekula butunligicha x, y, z bo&apos;yicha siljiydi (T<sub>1u</sub>).<br/>
              <strong>3 ta aylanma:</strong> molekula butunligicha x, y, z o&apos;qlari atrofida aylanadi (T<sub>1g</sub>).<br/>
              <strong>15 ta tebranish:</strong> Γ<sub>teb</sub> = A<sub>1g</sub> + E<sub>g</sub> + T<sub>1g</sub> + T<sub>2g</sub> + 2T<sub>1u</sub> + T<sub>2u</sub>.<br/>
              Bulardan <strong>T<sub>1g</sub></strong> — Raman-faol emas, IQ-faol emas (&quot;jim&quot; moda).<br/>
              <strong>T<sub>2u</sub></strong> — ham jim (spektrda ko&apos;rinmaydi).
            </p>
          </div>
        </div>

        {/* ── 3. IQ VA RAMAN FAOLLIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 IQ va Raman faollikni simmetriya orqali aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">IQ-faollik sharti:</strong> tebranish simmetriyasi 
              dipol moment operatorining kamida bitta komponenti (x, y, z) simmetriyasi bilan bir xil bo&apos;lishi kerak.
              <strong className="text-yellow-400">Raman-faollik sharti:</strong> tebranish simmetriyasi 
              qutblanuvchanlik tenzorining kamida bitta komponenti (x², y², z², xy, xz, yz) simmetriyasi bilan bir xil.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Tebranish modi</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya (O<sub>h</sub>)</th>
                <th className="py-3 px-4 text-purple-300">IQ-faol</th>
                <th className="py-3 px-4 text-purple-300">Raman-faol</th>
                <th className="py-3 px-4 text-purple-300">Tebranish turi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["ν₁", "A<sub>1g</sub>", "✗ (taqiq)", "✓ (kuchli)", "To&apos;liq simmetrik valent"],
                  ["ν₂", "E<sub>g</sub>", "✗ (taqiq)", "✓ (o&apos;rtacha)", "Ekvatorial valent"],
                  ["ν₃", "T<sub>1u</sub>", "✓ (kuchli)", "✗ (taqiq)", "Asimmetrik valent"],
                  ["ν₄", "T<sub>1u</sub>", "✓ (o&apos;rtacha)", "✗ (taqiq)", "Deformatsion (burchak)"],
                  ["ν₅", "T<sub>2g</sub>", "✗ (taqiq)", "✓ (kuchsiz)", "Deformatsion"],
                  ["ν₆", "T<sub>2u</sub>", "✗ (taqiq)", "✗ (taqiq)", "&quot;Jim&quot; moda"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                    <td className="py-3 px-4">
                      {r[2].includes("✓") ? <span className="text-green-400">{r[2]}</span> : <span className="text-red-400">{r[2]}</span>}
                    </td>
                    <td className="py-3 px-4">
                      {r[3].includes("✓") ? <span className="text-green-400">{r[3]}</span> : <span className="text-red-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Alternativ taqiq qoidasi (O<sub>h</sub>)</h3>
            <p className="text-purple-200 text-sm">
              Inversiya markazi bo&apos;lgan molekulalarda <strong>hech qaysi tebranish modi bir vaqtda 
              ham IQ, ham Raman faol bo&apos;la olmaydi</strong>. Sababi: IQ-faol tebranishlar u-simmetriyali 
              (χ(i) = −1), Raman-faol tebranishlar g-simmetriyali (χ(i) = +1). Bu qoida oktaedrik 
              (O<sub>h</sub>) va kvadrat-planar (D<sub>4h</sub>) komplekslarni tetraedrik (T<sub>d</sub>) 
              komplekslardan farqlash imkonini beradi — T<sub>d</sub> da ayrim modlar ham IQ, ham Raman faol.
            </p>
          </div>
        </div>

        {/* ── 4. OKTAEDRIK KOMPLEKSLAR TEBRANISH MODLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Oktaedrik [ML₆] komplekslarda tebranish modlari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Oktaedrik kompleksning <strong className="text-yellow-400">6 ta asosiy normal tebranishi</strong>.
              ν₁, ν₂, ν₃ — <strong>valent (stretching)</strong> tebranishlar (M−L bog&apos; uzunligi o&apos;zgaradi).
              ν₄, ν₅, ν₆ — <strong>deformatsion (bending)</strong> tebranishlar (bog&apos; burchaklari o&apos;zgaradi).
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                mod: "ν₁ (A<sub>1g</sub>) — To&apos;liq simmetrik valent tebranish",
                tavsif: "Barcha 6 ta M−L bog&apos; bir vaqtda va bir xil amplitudada cho&apos;ziladi va qisqaradi. Molekulaning simmetriyasi o&apos;zgarmaydi. Eng yuqori chastotali tebranish. <strong>Faqat Raman spektrida</strong> kuzatiladi, juda kuchli polosa.",
                misol: "[Co(NH₃)₆]³⁺: ν₁ = 494 cm⁻¹ (Raman). [PtCl₆]²⁻: ν₁ = 344 cm⁻¹ (Raman).",
              },
              {
                mod: "ν₂ (E<sub>g</sub>) — Ekvatorial valent tebranish",
                tavsif: "4 ta ekvatorial M−L bog&apos; cho&apos;ziladi/qisqaradi, 2 ta aksial bog&apos; tinch turadi (yoki aksincha). Ikki karra degenerat (2 ta mustaqil mod). <strong>Faqat Raman spektrida</strong>.",
                misol: "[Co(NH₃)₆]³⁺: ν₂ = 440 cm⁻¹ (Raman). [IrCl₆]²⁻: ν₂ = 310 cm⁻¹.",
              },
              {
                mod: "ν₃ (T<sub>1u</sub>) — Asimmetrik valent tebranish",
                tavsif: "Qarama-qarshi M−L bog&apos;lari fazada tebranadi (biri cho&apos;zilganda ikkinchisi qisqaradi). Uch karra degenerat. Dipol moment kuchli o&apos;zgaradi. <strong>IQ spektrida eng kuchli polosa</strong>.",
                misol: "[Co(NH₃)₆]³⁺: ν₃ = 476 cm⁻¹ (IQ, kuchli). [Fe(CN)₆]⁴⁻: ν₃ = 584 cm⁻¹ (IQ).",
              },
              {
                mod: "ν₄ (T<sub>1u</sub>) — Deformatsion tebranish",
                tavsif: "Ligandlarning burchak harakati — L−M−L burchaklari o&apos;zgaradi. Uch karra degenerat. <strong>IQ spektrida kuzatiladi</strong>, lekin ν₃ dan kuchsizroq. Past chastotali (400 cm⁻¹ dan past).",
                misol: "[Co(NH₃)₆]³⁺: ν₄ = 330 cm⁻¹ (IQ). [Cr(H₂O)₆]³⁺: ν₄ = ~280 cm⁻¹.",
              },
              {
                mod: "ν₅ (T<sub>2g</sub>) — Deformatsion tebranish (Raman)",
                tavsif: "Burchak deformatsiyasi. Uch karra degenerat. <strong>Faqat Raman spektrida</strong> kuzatiladi. ν₄ bilan bir xil harakat turi, lekin simmetriyasi boshqacha (g vs u).",
                misol: "[Co(NH₃)₆]³⁺: ν₅ = ~290 cm⁻¹ (Raman, kuchsiz).",
              },
              {
                mod: "ν₆ (T<sub>2u</sub>) — &quot;Jim&quot; moda",
                tavsif: "Deformatsion tebranish. Na IQ, na Raman faol! Faqat noelastik neytron sochilishi yoki yuqori aniqlikdagi spektroskopiya orqali aniqlash mumkin.",
                misol: "[Co(NH₃)₆]³⁺: ν₆ ≈ 200 cm⁻¹ (hisoblangan).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1" dangerouslySetInnerHTML={{ __html: r.mod }}></h3>
                <p className="text-purple-200 text-sm mb-1">{r.tavsif}</p>
                <p className="text-purple-400 text-xs">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. TETRAEDRIK VA BOSHQA GEOMETRIYALAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 Tetraedrik va boshqa komplekslarda tebranishlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tetraedrik [ML₄] (T<sub>d</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>9 ta tebranish modi:</strong> A<sub>1</sub> + E + 2T<sub>2</sub>.<br/>
                <strong>A<sub>1</sub>:</strong> faqat Raman (simmetrik valent).<br/>
                <strong>E:</strong> faqat Raman (deformatsion).<br/>
                <strong>T<sub>2</sub>:</strong> <strong>ham IQ, ham Raman faol!</strong><br/>
                Alternativ taqiq YO&apos;Q (inversiya markazi yo&apos;q).<br/>
                <strong>Misol:</strong> [CoCl₄]²⁻ — ν₃(T₂) = 378 cm⁻¹ (IQ+Raman).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kvadrat-planar [ML₄] (D<sub>4h</sub>)</h3>
              <p className="text-purple-200 text-sm">
                <strong>9 ta tebranish modi:</strong> murakkab tasnif.<br/>
                <strong>IQ-faol:</strong> 3 ta (E<sub>u</sub> + 2A<sub>2u</sub>).<br/>
                <strong>Raman-faol:</strong> 3 ta (A<sub>1g</sub> + B<sub>1g</sub> + B<sub>2g</sub>).<br/>
                <strong>3 ta jim moda:</strong> A<sub>2g</sub> + B<sub>2u</sub> + E<sub>u</sub>(qisman).<br/>
                Alternativ taqiq AMAL QILADI (i bor).<br/>
                <strong>Misol:</strong> [PtCl₄]²⁻ — ν(Pt−Cl) IQ: 320 cm⁻¹.
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Metall-ligand tebranish chastotasiga ta&apos;sir qiluvchi omillar</h3>
            <p className="text-purple-200 text-sm">
              <strong>1. Metall massasi:</strong> og&apos;irroq metall → past chastota. ν(M−L) ∝ 1/√μ.<br/>
              <strong>2. Oksidlanish darajasi:</strong> yuqori zaryad → kuchli bog&apos; → yuqori chastota. Fe²⁺−CN: ~580 cm⁻¹, Fe³⁺−CN: ~600 cm⁻¹.<br/>
              <strong>3. Ligand:</strong> kuchli maydonli ligand → kuchli bog&apos; → yuqori chastota. CN⁻ &gt; NH₃ &gt; H₂O &gt; Cl⁻.<br/>
              <strong>4. Trans-ta&apos;sir:</strong> trans-ligand bog&apos;ni kuchsizlantirsa → past chastota. [PtCl₄]²⁻ da trans-Cl ta&apos;siri.
            </p>
          </div>
        </div>

        {/* ── 6. SPEKTRLARNI TAHLIL QILISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 IQ va Raman spektrlarni birgalikda tahlil qilish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              IQ va Raman spektrlarni <strong className="text-yellow-400">birgalikda tahlil qilish</strong> orqali 
              kompleksning <strong>geometriyasini ishonchli aniqlash</strong> mumkin. 
              Inversiya markazi bor/yo&apos;qligi, ligandlar soni va joylashuvi — 
              bularning barchasi spektrlarda yaqqol aks etadi.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                tahlil: "Inversiya markazi diagnostikasi",
                matn: "Agar IQ va Raman spektrlarida <strong>hech qaysi polosa bir-biriga mos kelmasa</strong> (alternativ taqiq) — inversiya markazi BOR (O<sub>h</sub> yoki D<sub>4h</sub>). Agar ayrim polosalar <strong>ham IQ, ham Raman da kuzatilsa</strong> — inversiya markazi YO&apos;Q (T<sub>d</sub>, C<sub>4v</sub>, C<sub>2v</sub>).",
              },
              {
                tahlil: "Geometriyani farqlash: O<sub>h</sub> vs D<sub>4h</sub>",
                matn: "O<sub>h</sub> [ML₆] — IQ da 2 ta polosa (ν₃, ν₄), Raman da 3 ta (ν₁, ν₂, ν₅). D<sub>4h</sub> [ML₄] — IQ da 3 ta, Raman da 3 ta. Polosalar soni va ularning chastotalari geometriyani bir qiymatli aniqlash imkonini beradi.",
              },
              {
                tahlil: "cis vs trans izomeriyani aniqlash",
                matn: "trans-[ML₄X₂] (D<sub>4h</sub>) — IQ da M−X valent tebranishi 1 ta polosa beradi. cis-[ML₄X₂] (C<sub>2v</sub>) — IQ da M−X valent tebranishi 2 ta polosa beradi (simmetrik + asimmetrik). Polosalar soni orqali izomeriyani aniqlash — klassik usul!",
              },
              {
                tahlil: "Ambidentat ligandlarni farqlash",
                matn: "NO₂⁻ — nitrito (M−ONO) va nitro (M−NO₂) komplekslar IQ spektrlari orqali oson farqlanadi. Nitro: ν<sub>as</sub>(NO₂) ≈ 1470−1370 cm⁻¹, ν<sub>s</sub>(NO₂) ≈ 1340−1300 cm⁻¹. Nitrito: ν(N=O) ≈ 1485−1400 cm⁻¹, ν(N−O) ≈ 1050−1000 cm⁻¹.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.tahlil}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">3N−6 qoida:</strong> oktaedrik [ML₆] — 15 ta tebranish, faqat 6 tasi spektral faol</li>
            <li><strong className="text-yellow-400">IQ-faol:</strong> T<sub>1u</sub> (O<sub>h</sub>), T<sub>2</sub> (T<sub>d</sub>); <strong>Raman-faol:</strong> A<sub>1g</sub>, E<sub>g</sub>, T<sub>2g</sub> (O<sub>h</sub>)</li>
            <li><strong className="text-yellow-400">Alternativ taqiq:</strong> inversiya markazi bo&apos;lsa, IQ va Raman polosalar bir-biriga mos kelmaydi</li>
            <li><strong className="text-yellow-400">ν(M−L) tartibi:</strong> CN⁻ &gt; CO &gt; NH₃ &gt; H₂O &gt; Cl⁻ &gt; Br⁻ &gt; I⁻</li>
            <li><strong className="text-yellow-400">Diagnostika:</strong> IQ+Raman → geometriya, izomeriya, ligand turi, koordinatsion son</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/xarakterlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Xarakterlar jadvali
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/elektron" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Simmetriya va elektron tuzilish →
          </Link>
        </div>

      </section>
    </main>
  )
}