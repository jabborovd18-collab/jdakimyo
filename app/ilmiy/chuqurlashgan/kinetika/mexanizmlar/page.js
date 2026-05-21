import Link from "next/link"

export default function Mexanizmlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🔄 Ligand almashinish mexanizmlari</h1>
          <p className="text-purple-400 text-sm">Dissotsiativ (D) • Assotsiativ (A) • Almashinish (I, I<sub>d</sub>, I<sub>a</sub>) • Aktivatsiya parametrlari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ligand almashinish mexanizmlari — uch asosiy tur</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ligand almashinish reaksiyalari</strong> — kompleks birikmalarning 
              eng fundamental kimyoviy reaksiyalari. Mexanizmga ko&apos;ra <strong>uch asosiy turga</strong> 
              ajratiladi: <strong>dissotsiativ (D), assotsiativ (A) va almashinish (I)</strong>.
              Almashinish mexanizmi yana <strong>I<sub>d</sub> (dissotsiativ almashinish)</strong> va 
              <strong>I<sub>a</sub> (assotsiativ almashinish)</strong> turlarga bo&apos;linadi.
              Mexanizmni aniqlash uchun <strong>aktivatsiya parametrlari (ΔV<sup>‡</sup>, ΔS<sup>‡</sup>)</strong> 
              asosiy diagnostik vosita hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">D — Dissotsiativ</h3>
              <p className="text-purple-200 text-sm">Oldin ligand chiqadi, keyin yangisi kiradi</p>
              <p className="text-purple-400 text-xs mt-2">KS: 6 → 5 → 6</p>
              <p className="text-green-400 text-xs">ΔV<sup>‡</sup> &gt; 0, ΔS<sup>‡</sup> &gt; 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">A — Assotsiativ</h3>
              <p className="text-purple-200 text-sm">Oldin yangi ligand kiradi, keyin eskisi chiqadi</p>
              <p className="text-purple-400 text-xs mt-2">KS: 6 → 7 → 6</p>
              <p className="text-green-400 text-xs">ΔV<sup>‡</sup> &lt; 0, ΔS<sup>‡</sup> &lt; 0</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">I — Almashinish</h3>
              <p className="text-purple-200 text-sm">Bir vaqtda ligand kiradi va chiqadi</p>
              <p className="text-purple-400 text-xs mt-2">KS: 6 → 6 (o&apos;tish holati)</p>
              <p className="text-green-400 text-xs">ΔV<sup>‡</sup> ≈ 0, ΔS<sup>‡</sup> ≈ 0</p>
            </div>
          </div>
        </div>

        {/* ── 2. DISSOTSIATIV MEXANIZM (D) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔓 Dissotsiativ mexanizm (D) — &quot;avval chiq, keyin kir&quot;</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Dissotsiativ mexanizm (D)</strong> da <strong>birinchi bosqichda</strong> 
              chiquvchi ligand X kompleksdan ajralib, koordinatsion soni bittaga kamaygan <strong>oraliq kompleks</strong> 
              hosil bo&apos;ladi. <strong>Ikkinchi bosqichda</strong> kiruvchi ligand Y bu oraliq kompleksga birikadi.
              Birinchi bosqich <strong>sekin (tezlikni belgilovchi)</strong>, ikkinchi bosqich tez.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <h3 className="text-yellow-400 font-bold mb-2 text-center">D mexanizm sxemasi (oktaedrik kompleks)</h3>
            <div className="space-y-2 text-sm text-center">
              <p className="text-purple-200"><strong>1-bosqich (sekin):</strong> [ML₅X] → [ML₅] + X⁻</p>
              <p className="text-purple-300">Oraliq: kvadrat-piramidal yoki trigonal-bipiramidal (KS=5)</p>
              <p className="text-purple-200"><strong>2-bosqich (tez):</strong> [ML₅] + Y⁻ → [ML₅Y]</p>
            </div>
            <p className="text-purple-400 text-xs mt-3 text-center">
              <strong>Tezlik qonuni:</strong> v = k[ML₅X] (Y konsentratsiyasiga bog&apos;liq emas)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">D mexanizm belgilari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tezlik qonuni:</strong> birinchi tartibli (faqat kompleksga nisbatan)<br/>
                <strong>ΔV<sup>‡</sup> &gt; 0:</strong> hajm kattalashadi (bog&apos; uzilishi)<br/>
                <strong>ΔS<sup>‡</sup> &gt; 0:</strong> entropiya ortadi (zarralar soni ko&apos;payadi)<br/>
                <strong>Chiquvchi ligand ta&apos;siri:</strong> kuchli (bog&apos; energiyasi muhim)<br/>
                <strong>Kiruvchi ligand ta&apos;siri:</strong> kuchsiz yoki yo&apos;q
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">D mexanizm misollari</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Co(NH₃)₅X]²⁺ + H₂O:</strong> X = Cl⁻, Br⁻, NO₃⁻<br/>
                d⁶(QS) Co³⁺ — inert, D mexanizm xos<br/>
                <strong>[Ni(CO)₄] + PR₃:</strong> 18 e⁻ → 16 e⁻ oraliq<br/>
                <strong>[Fe(CO)₅] + PR₃:</strong> D mexanizm, CO chiqishi sekin
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. ASSOTSIATIV MEXANIZM (A) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔒 Assotsiativ mexanizm (A) — &quot;avval kir, keyin chiq&quot;</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Assotsiativ mexanizm (A)</strong> da <strong>birinchi bosqichda</strong> 
              kiruvchi ligand Y kompleksga birikib, koordinatsion soni bittaga ortgan <strong>oraliq kompleks</strong> 
              hosil bo&apos;ladi. <strong>Ikkinchi bosqichda</strong> chiquvchi ligand X ajralib chiqadi.
              Birinchi bosqich <strong>sekin</strong>, ikkinchi bosqich tez.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
            <h3 className="text-yellow-400 font-bold mb-2 text-center">A mexanizm sxemasi (oktaedrik kompleks)</h3>
            <div className="space-y-2 text-sm text-center">
              <p className="text-purple-200"><strong>1-bosqich (sekin):</strong> [ML₅X] + Y⁻ → [ML₅XY]</p>
              <p className="text-purple-300">Oraliq: pentagonal-bipiramida yoki &quot;qalpoqchali&quot; oktaedr (KS=7)</p>
              <p className="text-purple-200"><strong>2-bosqich (tez):</strong> [ML₅XY] → [ML₅Y] + X⁻</p>
            </div>
            <p className="text-purple-400 text-xs mt-3 text-center">
              <strong>Tezlik qonuni:</strong> v = k[ML₅X][Y] (ikkala reagentga nisbatan birinchi tartibli)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">A mexanizm belgilari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tezlik qonuni:</strong> ikkinchi tartibli<br/>
                <strong>ΔV<sup>‡</sup> &lt; 0:</strong> hajm kichiklashadi (yangi bog&apos; hosil bo&apos;ladi)<br/>
                <strong>ΔS<sup>‡</sup> &lt; 0:</strong> entropiya kamayadi (zarralar soni kamayadi)<br/>
                <strong>Chiquvchi ligand ta&apos;siri:</strong> kuchsiz<br/>
                <strong>Kiruvchi ligand ta&apos;siri:</strong> kuchli (nukleofillik muhim)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">A mexanizm misollari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Kvadrat-planar Pt²⁺:</strong> [PtCl₄]²⁻ + Y⁻ → [PtCl₃Y]⁻ + Cl⁻<br/>
                16 e⁻ → 18 e⁻ oraliq (trigonal-bipiramida)<br/>
                <strong>[Cr(H₂O)₆]³⁺ + Y:</strong> d³ — A mexanizmga moyil<br/>
                <strong>[Co(CN)₅]³⁻ + Y:</strong> 18 e⁻ → 20 e⁻ oraliq
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. ALMASHINISH MEXANIZMI (I) ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Almashinish mexanizmi (I) — bir vaqtda kirish va chiqish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Almashinish mexanizmi (I)</strong> — D va A mexanizmlar orasidagi 
              <strong> oraliq holat</strong>. Bunda <strong>bir vaqtning o&apos;zida</strong> kiruvchi ligand 
              yaqinlashadi va chiquvchi ligand uzoqlashadi. O&apos;tish holatida <strong>koordinatsion son 
              o&apos;zgarmaydi</strong>, lekin bog&apos;lar bir vaqtda uziladi va hosil bo&apos;ladi.
              I mexanizm <strong>I<sub>d</sub> (dissotsiativ almashinish)</strong> va 
              <strong>I<sub>a</sub> (assotsiativ almashinish)</strong> turlarga bo&apos;linadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Parametr</th>
                <th className="py-3 px-4 text-purple-300">I<sub>d</sub> (dissotsiativ almashinish)</th>
                <th className="py-3 px-4 text-purple-300">I (sof almashinish)</th>
                <th className="py-3 px-4 text-purple-300">I<sub>a</sub> (assotsiativ almashinish)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Chiquvchi ligand ta&apos;siri", "Kuchli", "O&apos;rtacha", "Kuchsiz"],
                  ["Kiruvchi ligand ta&apos;siri", "Kuchsiz", "O&apos;rtacha", "Kuchli"],
                  ["ΔV<sup>‡</sup>", "Musbat (+) — kichik", "≈ 0", "Manfiy (−) — kichik"],
                  ["ΔS<sup>‡</sup>", "Musbat (+) — kichik", "≈ 0", "Manfiy (−) — kichik"],
                  ["O&apos;tish holati", "Bog&apos; uzilishi oldinda", "Simmetrik", "Bog&apos; hosil bo&apos;lishi oldinda"],
                  ["Misol", "[Ni(H₂O)₆]²⁺ + NH₃", "Kam uchraydi", "[Cr(H₂O)₆]³⁺ + Y"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Ko&apos;pchilik oktaedrik komplekslar — I<sub>d</sub> yoki I<sub>a</sub></h3>
            <p className="text-purple-200 text-sm">
              Sof D va sof A mexanizmlar oktaedrik komplekslarda <strong>juda kam uchraydi</strong>.
              Aksariyat hollarda <strong>I<sub>d</sub></strong> (dissotsiativ almashinish) yoki 
              <strong>I<sub>a</sub></strong> (assotsiativ almashinish) mexanizmlar amalga oshadi.
              d³ (Cr³⁺) va d⁶(QS) (Co³⁺) — I<sub>a</sub> ga moyil (yuqori KMBE, oraliq KS=7 energiyasi past).
              d⁸ (Ni²⁺) va d⁹ (Cu²⁺) — I<sub>d</sub> ga moyil (past KMBE, oraliq KS=5 energiyasi past).
            </p>
          </div>
        </div>

        {/* ── 5. AKTIVATSIYA PARAMETRLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Aktivatsiya parametrlari — mexanizmni aniqlash kaliti</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">ΔV<sup>‡</sup> (aktivatsiya hajmi)</strong> — mexanizmni 
              aniqlashning <strong>eng ishonchli mezoni</strong>. Yuqori bosimda o&apos;lchangan tezlik 
              konstantasidan hisoblanadi. <strong>ΔS<sup>‡</sup> (aktivatsiya entropiyasi)</strong> — 
              Eyring tenglamasidan olingan qo&apos;shimcha mezon.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Reaksiya</th>
                <th className="py-3 px-4 text-purple-300">ΔV<sup>‡</sup> (cm³/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔS<sup>‡</sup> (J/mol·K)</th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₅Cl]²⁺", "+ H₂O", "+8.5", "+30", "D (sof dissotsiativ)"],
                  ["[Ni(H₂O)₆]²⁺", "+ NH₃", "+7.2", "+7", "I<sub>d</sub>"],
                  ["[Fe(H₂O)₆]²⁺", "+ H₂O*", "+3.8", "+5", "I<sub>d</sub>"],
                  ["[Cr(H₂O)₆]³⁺", "+ SCN⁻", "−9.3", "−15", "I<sub>a</sub>"],
                  ["[PtCl₄]²⁻", "+ NH₃", "−12", "−20", "A (sof assotsiativ)"],
                  ["[Co(CN)₅]³⁻", "+ I⁻", "−8.5", "−12", "I<sub>a</sub>"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 font-semibold">
                      {r[2].startsWith("+") || r[2].startsWith("−") === false && parseFloat(r[2]) > 0
                        ? <span className="text-red-400">{r[2]}</span>
                        : <span className="text-blue-400">{r[2]}</span>}
                    </td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <p className="text-green-300 text-sm">
              <strong>Asosiy qoida:</strong> ΔV<sup>‡</sup> &gt; +5 cm³/mol → D yoki I<sub>d</sub>. 
              ΔV<sup>‡</sup> &lt; −5 cm³/mol → A yoki I<sub>a</sub>. 
              −5 &lt; ΔV<sup>‡</sup> &lt; +5 → I (sof almashinish). 
              ΔS<sup>‡</sup> musbat → dissotsiativ xarakter, manfiy → assotsiativ xarakter.
            </p>
          </div>
        </div>

        {/* ── 6. FAKTORLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Mexanizmga ta&apos;sir qiluvchi omillar</h2>
          
          <div className="space-y-4">
            {[
              {
                omil: "1. Elektron konfiguratsiya va KMBE",
                izoh: "Yuqori KMBE (d³, d⁶(QS)) → I<sub>a</sub> yoki A mexanizm (oraliq KS=7 da KMBE yuqori). Past KMBE (d⁸, d⁹, d¹⁰) → I<sub>d</sub> yoki D mexanizm (oraliq KS=5 da KMBE nisbatan yuqori).",
              },
              {
                omil: "2. Metall ionining oksidlanish darajasi",
                izoh: "Yuqori oksidlanish darajasi → kichik ion radiusi → assotsiativ mexanizmga moyillik. [Co(NH₃)₆]³⁺ — I<sub>a</sub>, [Co(NH₃)₆]²⁺ — I<sub>d</sub>. Past oksidlanish darajasi → katta radius → dissotsiativ mexanizm.",
              },
              {
                omil: "3. Ligandlarning sterik omili",
                izoh: "Katta hajmli ligandlar → dissotsiativ mexanizm (sterik to&apos;siq tufayli 7-koordinatsion oraliq hosil bo&apos;la olmaydi). Kichik ligandlar → assotsiativ mexanizm mumkin. Masalan: [Co(NH₃)₅X] — D mexanizm, [Cr(H₂O)₆]³⁺ — I<sub>a</sub>.",
              },
              {
                omil: "4. Erituvchi",
                izoh: "Koordinatsiyalanuvchi erituvchilar (H₂O, DMSO) dissotsiativ mexanizmda oraliq kompleksni barqarorlashtiradi. Erkin ligand konsentratsiyasi past bo&apos;lganda dissotsiativ mexanizm ustunlik qiladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">D mexanizm:</strong> [ML₅X] → [ML₅] + X → [ML₅Y]; ΔV<sup>‡</sup> &gt; 0, ΔS<sup>‡</sup> &gt; 0</li>
            <li><strong className="text-yellow-400">A mexanizm:</strong> [ML₅X] + Y → [ML₅XY] → [ML₅Y] + X; ΔV<sup>‡</sup> &lt; 0, ΔS<sup>‡</sup> &lt; 0</li>
            <li><strong className="text-yellow-400">I mexanizm:</strong> bir vaqtda kirish va chiqish — eng ko&apos;p tarqalgan</li>
            <li><strong className="text-yellow-400">ΔV<sup>‡</sup></strong> — mexanizmni aniqlashning eng ishonchli mezoni</li>
            <li><strong className="text-yellow-400">Ko&apos;pchilik oktaedrik komplekslar:</strong> I<sub>d</sub> yoki I<sub>a</sub> mexanizm</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika/inert-labil" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Inert va labil komplekslar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/oktaedrik" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Oktaedrik almashinish →
          </Link>
        </div>

      </section>
    </main>
  )
}