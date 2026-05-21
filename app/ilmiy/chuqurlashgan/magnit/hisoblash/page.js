import Link from "next/link"

export default function Hisoblash() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧮 Magnit ma&apos;lumotlardan tahlil</h1>
          <p className="text-purple-400 text-sm">μ<sub>eff</sub> dan n topish • Spin holatini aniqlash • Geometriya diagnostikasi • Oksidlanish darajasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Magnit ma&apos;lumotlardan strukturaviy tahlil</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Magnit o&apos;lchashlar</strong> — kompleks birikmaning tuzilishini 
              aniqlashning <strong>eng informativ eksperimental usullaridan biridir</strong>. 
              Bitta magnit sezgirlik o&apos;lchashidan quyidagi barcha parametrlarni aniqlash mumkin:
              <strong className="text-yellow-400"> juftlanmagan elektronlar soni (n), spin holati (YS/QS), 
              oksidlanish darajasi, geometriya (oktaedrik/tetraedrik/kvadrat-planar)</strong> va hatto 
              <strong className="text-yellow-400"> ko&apos;p yadroli komplekslarda almashinuv parametri (J)</strong>.
              Bu bo&apos;limda magnit ma&apos;lumotlardan kompleks tuzilishini aniqlashning 
              <strong> sistematik metodologiyasi</strong> bayon qilingan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">1-bosqich</h3>
              <p className="text-purple-200 text-sm">μ<sub>eff</sub> → n (juftlanmagan e⁻ soni)</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">μ = √n(n+2)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">2-bosqich</h3>
              <p className="text-purple-200 text-sm">n → d-elektronlar soni</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">d<sup>n</sup> konfiguratsiya</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-cyan-400 font-bold mb-2">3-bosqich</h3>
              <p className="text-purple-200 text-sm">d<sup>n</sup> → oksidlanish darajasi</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">M<sup>x+</sup> aniqlash</p>
            </div>
          </div>
        </div>

        {/* ── 2. μeff DAN n NI TOPISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 μ<sub>eff</sub> dan juftlanmagan elektronlar sonini topish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Birinchi va eng muhim qadam</strong> — eksperimental 
              μ<sub>eff</sub> qiymatidan juftlanmagan elektronlar soni (n) ni aniqlash.
              Buning uchun spin-only formula <strong>teskari yechiladi</strong> yoki 
              tayyor jadvaldan foydalaniladi. Orbital hissa mavjud bo&apos;lsa, 
              tuzatma kiritish kerak bo&apos;ladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> diapazoni (μ<sub>B</sub>)</th>
                <th className="py-3 px-4 text-purple-300">n (spin-only)</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup> (YS variantlar)</th>
                <th className="py-3 px-4 text-purple-300">Orbital hissa</th>
                <th className="py-3 px-4 text-purple-300">Eng ehtimolli ion</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["0.0−0.5", "0", "d⁰, d¹⁰, d⁶(QS), d⁴(QS)", "Yo&apos;q", "Zn²⁺, Co³⁺(QS), Ti⁴⁺"],
                  ["1.6−1.9", "1", "d¹, d⁹, d⁵(QS), d⁷(QS)", "Kichik", "Cu²⁺, Ti³⁺, Fe³⁺(QS)"],
                  ["2.7−3.3", "2", "d², d⁸, d⁴(QS)", "Kichik-o&apos;rtacha", "Ni²⁺, V³⁺, Mn³⁺(QS)"],
                  ["3.7−4.1", "3", "d³, d⁷(YS)", "Kichik (A termda)", "Cr³⁺, Mn⁴⁺"],
                  ["4.3−5.2", "3", "d⁷(YS) — T term!", "Katta (T termda)", "Co²⁺(YS)"],
                  ["4.7−5.0", "4", "d⁴(YS), d⁶(YS) — E/A term", "Kichik", "Cr²⁺, Mn³⁺(YS)"],
                  ["5.1−5.6", "4", "d⁶(YS) — T term!", "Katta (T termda)", "Fe²⁺(YS)"],
                  ["5.8−6.0", "5", "d⁵(YS) — A term", "Deyarli yo&apos;q", "Fe³⁺(YS), Mn²⁺(YS)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-cyan-400">{r[0]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm text-green-400">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-cyan-400 font-bold mb-2">Teskari formula: n ni μ dan hisoblash</h3>
            <p className="text-purple-200 text-sm">
              <strong>μ<sub>SO</sub> = √[n(n+2)]</strong> formulani n ga nisbatan yechish:<br/>
              n² + 2n − μ² = 0 → <strong>n = −1 + √(1 + μ²)</strong><br/>
              Masalan: μ = 5.92 → n = −1 + √(1+35.05) = −1 + √36.05 = −1 + 6.00 = <strong>5.00 ≈ 5</strong><br/>
              μ = 3.87 → n = −1 + √(1+14.98) = −1 + 3.998 = <strong>2.998 ≈ 3</strong><br/>
              Orbital hissa tufayli μ<sub>eff</sub> spin-only dan katta bo&apos;lsa, hisoblangan n haqiqiy n dan katta chiqadi.
            </p>
          </div>
        </div>

        {/* ── 3. SPIN HOLATINI ANIQLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Spin holatini magnit momentdan aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              d⁴−d⁷ konfiguratsiyalar <strong className="text-yellow-400">ikkita spin holatida</strong> mavjud bo&apos;la oladi.
              Magnit moment qiymati <strong>spin holatiga qarab keskin farq qiladi</strong>, 
              shuning uchun magnit o&apos;lchash spin holatini aniqlashning eng ishonchli usuli hisoblanadi.
              Quyida har bir konfiguratsiya uchun diagnostik jadval keltirilgan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Ion misoli</th>
                <th className="py-3 px-4 text-purple-300">YS — n</th>
                <th className="py-3 px-4 text-purple-300">YS — μ (μ<sub>B</sub>)</th>
                <th className="py-3 px-4 text-purple-300">QS — n</th>
                <th className="py-3 px-4 text-purple-300">QS — μ (μ<sub>B</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Diagnostik belgi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d⁴", "Cr²⁺, Mn³⁺", "4", "4.7−5.0", "2", "2.8−3.2", "μ≈4.9→YS, μ≈3.0→QS"],
                  ["d⁵", "Fe³⁺, Mn²⁺", "5", "5.8−5.95", "1", "2.0−2.5", "μ≈5.9→YS, μ≈2.3→QS"],
                  ["d⁶", "Fe²⁺, Co³⁺", "4", "5.1−5.6", "0", "0 (diamagnit)", "Paramagnit→YS, Diamagnit→QS"],
                  ["d⁷", "Co²⁺, Ni³⁺", "3", "4.3−5.2", "1", "1.8−2.2", "μ≈5.0→YS, μ≈2.0→QS"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-orange-400">{r[2]}</td>
                    <td className="py-3 px-4 text-orange-300">{r[3]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[4]}</td>
                    <td className="py-3 px-4 text-cyan-300">{r[5]}</td>
                    <td className="py-3 px-4 text-sm text-green-400">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Amaliy algoritm</h3>
            <p className="text-purple-200 text-sm">
              <strong>1.</strong> Metall ionini boshqa usullar bilan aniqlang (masalan, element tahlil, rentgen).<br/>
              <strong>2.</strong> μ<sub>eff</sub> ni Gui usuli yoki boshqa metod bilan o&apos;lchang.<br/>
              <strong>3.</strong> Yuqoridagi jadvaldan foydalanib, o&apos;lchangan μ qiymatiga mos spin holatini aniqlang.<br/>
              <strong>4.</strong> Agar μ qiymati YS va QS orasida bo&apos;lsa — <strong>spin-krossover (SCO)</strong> bo&apos;lishi mumkin.
              Bu holda haroratga bog&apos;liq o&apos;lchashlar o&apos;tkazing.
            </p>
          </div>
        </div>

        {/* ── 4. GEOMETRIYANI ANIQLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Magnit momentdan geometriyani aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Magnit moment qiymati <strong className="text-yellow-400">kompleksning geometriyasiga qarab 
              o&apos;zgaradi</strong>, chunki orbital hissa darajasi geometriya bilan belgilanadi.
              Ayniqsa, Co²⁺ va Ni²⁺ komplekslari uchun geometriya diagnostikasi juda ishonchli.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                ion: "Co²⁺ (d⁷, YS) — geometriya diagnostikasi",
                oktaedrik: "[Co(H₂O)₆]²⁺ — T₁<sub>g</sub> term, kuchli orbital hissa, μ = 4.7−5.2 μ<sub>B</sub>",
                tetraedrik: "[CoCl₄]²⁻ — A₂ term, orbital hissa kuchsizroq, μ = 4.3−4.8 μ<sub>B</sub>",
                kvadrat: "Kvadrat-planar Co²⁺ kam uchraydi, odatda quyi spinli (μ ≈ 2.0)",
                izoh: "Oktaedrik Co²⁺ da μ eng katta (5.0 atrofida). Tetraedrikda biroz kichikroq (4.5 atrofida). Agar μ ≈ 5.0 bo&apos;lsa — oktaedrik ehtimoli yuqori.",
              },
              {
                ion: "Ni²⁺ (d⁸) — geometriya diagnostikasi",
                oktaedrik: "[Ni(H₂O)₆]²⁺ — A₂<sub>g</sub> term, orbital hissa kichik, μ = 2.8−3.3 μ<sub>B</sub>",
                tetraedrik: "[NiCl₄]²⁻ — T₁ term, kuchli orbital hissa, μ = 3.5−4.1 μ<sub>B</sub>",
                kvadrat: "[Ni(CN)₄]²⁻ — diamagnit (μ = 0), barcha elektronlar juftlashgan",
                izoh: "Ni²⁺ uchun eng yaxshi diagnostika: kvadrat-planar → diamagnit (μ=0). Tetraedrik → μ ≈ 3.5−4.0. Oktaedrik → μ ≈ 3.0−3.3.",
              },
              {
                ion: "Cu²⁺ (d⁹) — geometriya diagnostikasi",
                oktaedrik: "[Cu(H₂O)₆]²⁺ — E<sub>g</sub> term, Yan-Teller buzilgan, μ = 1.8−2.2 μ<sub>B</sub>",
                tetraedrik: "[CuCl₄]²⁻ — T₂ term, orbital hissa, μ = 1.8−2.1 μ<sub>B</sub>",
                kvadrat: "[Cu(NH₃)₄]²⁺ — kvadrat-planar, Yan-Teller, μ = 1.7−1.9 μ<sub>B</sub>",
                izoh: "Cu²⁺ da geometriya bo&apos;yicha farq kichik (barcha holatlarda n=1). EPR spektroskopiya yaxshiroq diagnostika beradi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.ion}</h3>
                <div className="space-y-1 text-sm mb-2">
                  <p className="text-purple-200"><span className="text-green-400">Oktaedrik:</span> {r.oktaedrik}</p>
                  <p className="text-purple-200"><span className="text-blue-400">Tetraedrik:</span> {r.tetraedrik}</p>
                  <p className="text-purple-200"><span className="text-red-400">Kvadrat:</span> {r.kvadrat}</p>
                </div>
                <p className="text-orange-300 text-xs">💡 {r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. OKSIDLANISH DARAJASINI ANIQLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Oksidlanish darajasini magnit momentdan aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Bir xil metallning <strong className="text-yellow-400">turli oksidlanish darajalari</strong> 
              turli d-elektronlar soniga va demak, turli magnit momentga ega bo&apos;ladi.
              Magnit o&apos;lchash oksidlanish darajasini aniqlashning <strong>oddiy va ishonchli usulidir</strong>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Oksidlanish darajasi</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">n (spin)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub></th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> (eksp)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Temir", "Fe²⁺", "d⁶(YS)", "4", "4.90", "5.1−5.6"],
                  ["Temir", "Fe³⁺", "d⁵(YS)", "5", "5.92", "5.8−5.95"],
                  ["Temir", "Fe²⁺(QS)", "d⁶(QS)", "0", "0", "0 (diamagnit)"],
                  ["Marganes", "Mn²⁺", "d⁵(YS)", "5", "5.92", "5.8−5.95"],
                  ["Marganes", "Mn³⁺(YS)", "d⁴(YS)", "4", "4.90", "4.7−5.0"],
                  ["Marganes", "Mn⁴⁺", "d³", "3", "3.87", "3.7−3.9"],
                  ["Kobalt", "Co²⁺(YS)", "d⁷(YS)", "3", "3.87", "4.3−5.2"],
                  ["Kobalt", "Co³⁺(QS)", "d⁶(QS)", "0", "0", "0 (diamagnit)"],
                  ["Mis", "Cu⁺", "d¹⁰", "0", "0", "0 (diamagnit)"],
                  ["Mis", "Cu²⁺", "d⁹", "1", "1.73", "1.7−2.2"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Misol: Temir kompleksining oksidlanish darajasini aniqlash</h3>
            <p className="text-purple-200 text-sm">
              Tajribada temir kompleksining μ<sub>eff</sub> = 5.85 μ<sub>B</sub> o&apos;lchandi.<br/>
              <strong>Tahlil:</strong> 5.85 ≈ 5.92 → n = 5 → d⁵ → <strong>Fe³⁺</strong>.<br/>
              Agar μ<sub>eff</sub> ≈ 5.3 bo&apos;lganda edi → n = 4 → d⁶ → <strong>Fe²⁺ (YS)</strong>.<br/>
              Agar μ<sub>eff</sub> = 0 bo&apos;lganda edi → n = 0 → d⁶(QS) → <strong>Fe²⁺ (QS)</strong> yoki <strong>Fe³⁺ (QS)</strong>.<br/>
              Qo&apos;shimcha tekshirish: EPR signali (Fe³⁺ da bor, Fe²⁺(QS) da yo&apos;q).
            </p>
          </div>
        </div>

        {/* ── 6. TO'LIQ TAHLIL ALGORITMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🗺️ Magnit ma&apos;lumotlardan to&apos;liq tahlil algoritmi</h2>
          
          <div className="space-y-4">
            {[
              {
                qadam: "1-qadam: χ<sub>M</sub> ni o&apos;lchash va diamagnit tuzatma kiritish",
                izoh: "Gui usuli yoki SQUID yordamida xona haroratida (298 K) molyar magnit sezgirlik o&apos;lchanadi. Paskal konstantalari yordamida ligandlar va qarshi ionlarning diamagnit hissasi uchun tuzatma kiritiladi: χ<sub>M,para</sub> = χ<sub>M,o&apos;lch</sub> − Σχ<sub>dia</sub>.",
              },
              {
                qadam: "2-qadam: μ<sub>eff</sub> ni hisoblash",
                izoh: "μ<sub>eff</sub> = 2.828√(χ<sub>M,para</sub> × T). Xona haroratida (T=298 K) hisoblang. Agar μ<sub>eff</sub> ≈ 0 bo&apos;lsa — kompleks diamagnit. Agar μ<sub>eff</sub> &gt; 0 bo&apos;lsa — paramagnit, 3-qadamga o&apos;ting.",
              },
              {
                qadam: "3-qadam: n (juftlanmagan elektronlar soni) ni aniqlash",
                izoh: "n = −1 + √(1 + μ²) formula yoki yuqoridagi jadvaldan foydalaning. Agar hisoblangan n butun songa yaqin bo&apos;lmasa — orbital hissa mavjud. n qiymatini eng yaqin butun songa yaxlitlang.",
              },
              {
                qadam: "4-qadam: Mumkin bo&apos;lgan d<sup>n</sup> konfiguratsiyalarni ko&apos;rib chiqish",
                izoh: "n ga mos keluvchi barcha d<sup>n</sup> konfiguratsiyalarni (YS va QS variantlarni) ro&apos;yxatlang. Metall haqida qo&apos;shimcha ma&apos;lumotlar (element tahlil, sintez usuli) yordamida variantlarni toraytiring.",
              },
              {
                qadam: "5-qadam: Oksidlanish darajasi va spin holatini aniqlash",
                izoh: "Metall aniqlangach, d<sup>n</sup> → oksidlanish darajasi. Agar d⁴−d⁷ bo&apos;lsa, μ qiymatiga qarab YS yoki QS ekanligini aniqlang. Kerak bo&apos;lsa, haroratga bog&apos;liq o&apos;lchashlar o&apos;tkazing.",
              },
              {
                qadam: "6-qadam: Geometriyani baholash",
                izoh: "Orbital hissa darajasidan foydalanib, geometriyani baholang. Ayniqsa Co²⁺ va Ni²⁺ uchun ishonchli. Qo&apos;shimcha usullar: UB-Vis spektroskopiya, EPR.",
              },
              {
                qadam: "7-qadam: Agar ko&apos;p yadroli kompleks shubha qilinsa",
                izoh: "μ<sub>eff</sub> spin-only dan sezilarli kichik bo&apos;lsa — antiferromagnit almashinuv (ko&apos;p yadrolilik belgisi). Haroratga bog&apos;liq χ<sub>M</sub>(T) o&apos;lchab, Bleaney-Bauers tenglamasiga fit qiling va J ni toping.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. TO'LIQ TAHLIL MISOLI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 To&apos;liq tahlil namunasi — noma&apos;lum kompleks</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-blue-400">Masala:</strong> Noma&apos;lum metall kompleksining Gui usuli bilan 
              o&apos;lchangan molyar paramagnit sezgirligi χ<sub>M,para</sub> = 6,200 × 10⁻⁶ CGS (298 K).
              Element tahlil metall — kobalt ekanligini ko&apos;rsatdi. Kompleks tarkibida 6 ta ammiak ligand bor.
              Oksidlanish darajasi, spin holati va geometriyani aniqlang.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qadam: "1. μ<sub>eff</sub> ni hisoblash",
                hisob: "μ<sub>eff</sub> = 2.828√(6,200×10⁻⁶ × 298) = 2.828√(1.8476) = 2.828 × 1.359 = <strong>3.84 μ<sub>B</sub></strong>",
              },
              {
                qadam: "2. n ni topish",
                hisob: "n = −1 + √(1 + 3.84²) = −1 + √(1+14.75) = −1 + √15.75 = −1 + 3.97 = <strong>2.97 ≈ 3</strong>",
              },
              {
                qadam: "3. Kobalt uchun d<sup>n</sup> variantlar",
                hisob: "Co: [Ar] 3d⁷4s². Co³⁺: 3d⁶ (n=4 YS yoki n=0 QS). Co²⁺: 3d⁷ (n=3 YS yoki n=1 QS). n=3 → <strong>Co²⁺, yuqori spin</strong>. Co³⁺(YS) da n=4 bo&apos;lardi (μ≈4.9).",
              },
              {
                qadam: "4. Spin holatini tasdiqlash",
                hisob: "Co²⁺(YS): n=3, μ<sub>SO</sub>=3.87. O&apos;lchangan μ=3.84 — spin-only ga juda yaqin! Bu A yoki E termli bo&apos;lishi kerak. Co²⁺(QS): n=1, μ≈1.8−2.2 — mos kelmaydi.",
              },
              {
                qadam: "5. Geometriya va orbital hissa",
                hisob: "Oktaedrik Co²⁺(YS) — T₁<sub>g</sub> term, kuchli orbital hissa kutiladi (μ≈4.7−5.2). μ=3.84 spin-only ga yaqin! Demak, geometriya <strong>oktaedrik emas</strong>. Tetraedrik Co²⁺ — A₂ term, orbital hissa kuchsiz. μ≈4.3−4.8. μ=3.84 — <strong>tetraedrik ham emas</strong>.",
              },
              {
                qadam: "6. Yakuniy xulosa",
                hisob: "μ=3.84 ≈ 3.87 (spin-only n=3 uchun). Bu Co²⁺(YS) ning <strong>A yoki E simmetriyali term</strong>ga ega bo&apos;lishini ko&apos;rsatadi. [Co(NH₃)₆]²⁺ — oktaedrik, lekin T₁<sub>g</sub> term! μ kutilgandan kichik. Ehtimol: <strong>tetragonal buzilgan oktaedr</strong> yoki <strong>kvadrat-planar Co²⁺(QS)</strong>. Qo&apos;shimcha tekshirish: EPR, UB-Vis.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.hisob}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">μ<sub>eff</sub> → n:</strong> n = −1 + √(1+μ²) — juftlanmagan elektronlar sonini topish</li>
            <li><strong className="text-yellow-400">Spin holati:</strong> YS va QS magnit momentlari keskin farq qiladi — ishonchli diagnostika</li>
            <li><strong className="text-yellow-400">Geometriya:</strong> Co²⁺ (T₁<sub>g</sub>→katta μ, A₂→o&apos;rtacha μ), Ni²⁺ (kv-planar→diamagnit)</li>
            <li><strong className="text-yellow-400">Oksidlanish darajasi:</strong> bir metallning har xil oksidlanish darajalari turli μ beradi</li>
            <li><strong className="text-yellow-400">7 bosqichli algoritm</strong> — magnit ma&apos;lumotlardan to&apos;liq strukturaviy tahlil</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit/almashinuv" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Ko&apos;p yadroli komplekslar
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all">
            Chuqurlashgan mavzular →
          </Link>
        </div>

      </section>
    </main>
  )
}