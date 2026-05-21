import Link from "next/link"

export default function IrvingUilyams() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">📊 Irving-Uilyams qatori</h1>
          <p className="text-purple-400 text-sm">d¹−d¹⁰ barqarorlik tartibi • KMN asosida tushuntirish • Ion radiusi va KS ta&apos;siri</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Irving-Uilyams qatori — empirik qonuniyat</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Irving-Uilyams qatori</strong> — 1953 yilda Harry Irving va 
              Robert Williams tomonidan kashf etilgan empirik qonuniyat. 
              <strong>Ikki valentli 3d-metall ionlarining ko&apos;pchilik ligandlar bilan hosil qilgan 
              komplekslarining barqarorligi</strong> quyidagi tartibda o&apos;zgaradi:
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-2xl">
              Mn²⁺ &lt; Fe²⁺ &lt; Co²⁺ &lt; Ni²⁺ &lt; Cu²⁺ &gt; Zn²⁺
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Barqarorlik d-elektronlar soni ortishi bilan oshadi, Cu²⁺ da maksimumga yetadi, so&apos;ng Zn²⁺ da keskin pasayadi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qatorning universalligi</h3>
              <p className="text-purple-200 text-sm">
                Irving-Uilyams qatori <strong>deyarli barcha ligandlar</strong> uchun amal qiladi:<br/>
                • N-donor ligandlar: NH₃, en, bpy, phen<br/>
                • O-donor ligandlar: H₂O, OH⁻, RCOO⁻<br/>
                • S-donor ligandlar: RSH, S²⁻<br/>
                • Aralash donorli ligandlar: EDTA, aminokislotalar<br/>
                Faqat ayrim kuchli π-akseptor ligandlar (CN⁻, CO) bundan mustasno.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun aynan shu tartib?</h3>
              <p className="text-purple-200 text-sm">
                Irving-Uilyams qatori <strong>ikkita asosiy omil</strong> bilan tushuntiriladi:<br/>
                <strong>1. Ion radiusi:</strong> d-elektronlar soni ortishi bilan ion radiusi kamayadi (Ca²⁺ &gt; Zn²⁺)<br/>
                <strong>2. KMN barqarorlashish energiyasi (KMBE):</strong> oktaedrik maydonda d-orbitallarning ajralishi<br/>
                Cu²⁺ da Yan-Teller effekti qo&apos;shimcha barqarorlik beradi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. EKSPERIMENTAL MA'LUMOTLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Eksperimental log K qiymatlari — turli ligandlar bilan</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">H₂O (log β₁)</th>
                <th className="py-3 px-4 text-purple-300">NH₃ (log βₙ)</th>
                <th className="py-3 px-4 text-purple-300">en (log βₙ)</th>
                <th className="py-3 px-4 text-purple-300">EDTA (log β)</th>
                <th className="py-3 px-4 text-purple-300">Oksalat (log β₁)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Mn²⁺", "d⁵(YS)", "−0.1", "~2 (β₁)", "5.7", "14.0", "3.9"],
                  ["Fe²⁺", "d⁶(YS)", "+0.3", "~2 (β₁)", "9.5", "14.3", "4.5"],
                  ["Co²⁺", "d⁷(YS)", "+0.5", "5.1 (β₆)", "13.9", "16.3", "5.2"],
                  ["Ni²⁺", "d⁸", "+0.6", "8.7 (β₆)", "18.3", "18.6", "6.5"],
                  ["Cu²⁺", "d⁹", "+0.7", "13.3 (β₄)", "20.0", "18.8", "6.7"],
                  ["Zn²⁺", "d¹⁰", "+0.4", "9.5 (β₄)", "11.1", "16.5", "5.0"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4">{r[5]}</td>
                    <td className="py-3 px-4">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Ya&apos;ni ko&apos;rinib turibdi:</strong> Har bir ligand uchun barqarorlik 
              Mn²⁺ dan Cu²⁺ gacha monoton ortadi, Cu²⁺ da maksimumga chiqadi, 
              Zn²⁺ da esa Cu²⁺ dan pastroq (lekin Mn²⁺ dan yuqori). 
              EDTA da Cu²⁺ va Ni²⁺ deyarli bir xil — bu Irving-Uilyams qatoridan kichik chetlanish.
            </p>
          </div>
        </div>

        {/* ── 3. ION RADIUSI TA'SIRI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Ion radiusi ta&apos;siri — elektrostatik omil</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Irving-Uilyams qatorining <strong className="text-yellow-400">birinchi asosiy sababi</strong> — 
              d-elektronlar soni ortishi bilan ion radiusining <strong>monoton kamayishi</strong>.
              Kichikroq ion kuchliroq elektrostatik maydon hosil qiladi → ligandlar kuchliroq bog&apos;lanadi.
              Bu effekt faqat ion bog&apos;lanishli komplekslarga ta&apos;lluqli.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Ion radiusi (pm)</th>
                <th className="py-3 px-4 text-purple-300">z/r (nm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Elektrmaydon kuchi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Mn²⁺", "d⁵", "83", "24.1", "Eng kuchsiz"],
                  ["Fe²⁺", "d⁶(YS)", "78", "25.6", "Kuchsiz"],
                  ["Co²⁺", "d⁷(YS)", "74.5", "26.8", "O&apos;rtacha"],
                  ["Ni²⁺", "d⁸", "69", "29.0", "Kuchli"],
                  ["Cu²⁺", "d⁹", "73", "27.4", "O&apos;rtacha-kuchli"],
                  ["Zn²⁺", "d¹⁰", "74", "27.0", "O&apos;rtacha"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-semibold text-green-400">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Nima uchun Cu²⁺ da radius kattaroq?</h3>
            <p className="text-purple-200 text-sm">
              Cu²⁺ (d⁹) da <strong>Yan-Teller effekti</strong> tufayli oktaedrik geometriya tetragonal 
              cho&apos;zilgan. O&apos;rtacha bog&apos; uzunligi ortadi — samarali ion radiusi Ni²⁺ dan 
              kattaroq chiqadi. Shunga qaramay, Cu²⁺ komplekslari eng barqaror — 
              bu <strong>KMBE va Yan-Teller barqarorlashishi</strong> hisobiga.
            </p>
          </div>
        </div>

        {/* ── 4. KMBE TA'SIRI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 Kristall maydon barqarorlashish energiyasi (KMBE)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Irving-Uilyams qatorining <strong className="text-yellow-400">ikkinchi asosiy sababi</strong> — 
              <strong>KMBE</strong>. Oktaedrik maydonda elektronlarning t₂<sub>g</sub> va e<sub>g</sub> 
              orbitallarga joylashishi natijasida hosil bo&apos;ladigan qo&apos;shimcha barqarorlik.
              KMBE = (n<sub>t₂g</sub> × 0.4Δ<sub>o</sub>) − (n<sub>eg</sub> × 0.6Δ<sub>o</sub>).
              KMBE qancha katta bo&apos;lsa, kompleks shuncha barqaror.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">t₂<sub>g</sub> to&apos;lishi</th>
                <th className="py-3 px-4 text-purple-300">e<sub>g</sub> to&apos;lishi</th>
                <th className="py-3 px-4 text-purple-300">KMBE (Δ<sub>o</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Barqarorlik hissasi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Mn²⁺", "d⁵(YS)", "3", "2", "3×0.4 − 2×0.6 = 0", "Nol — eng beqaror"],
                  ["Fe²⁺", "d⁶(YS)", "4", "2", "4×0.4 − 2×0.6 = 0.4", "Kichik"],
                  ["Co²⁺", "d⁷(YS)", "5", "2", "5×0.4 − 2×0.6 = 0.8", "O&apos;rtacha"],
                  ["Ni²⁺", "d⁸", "6", "2", "6×0.4 − 2×0.6 = 1.2", "Katta"],
                  ["Cu²⁺", "d⁹", "6", "3", "6×0.4 − 3×0.6 = 0.6", "O&apos;rtacha (+ Yan-Teller)"],
                  ["Zn²⁺", "d¹⁰", "6", "4", "6×0.4 − 4×0.6 = 0", "Nol"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Cu²⁺ — Yan-Teller qo&apos;shimcha barqarorligi</h3>
            <p className="text-purple-200 text-sm">
              Cu²⁺ (d⁹) da KMBE = 0.6Δ<sub>o</sub> — Ni²⁺ (1.2Δ<sub>o</sub>) dan past. Shunga qaramay, 
              Cu²⁺ komplekslari eng barqaror. Sababi: <strong>Yan-Teller buzilishi</strong> tufayli 
              Cu²⁺ qo&apos;shimcha <strong>0.1−0.3Δ<sub>o</sub></strong> barqarorlashadi. 
              Natijada samarali KMBE ≈ 0.7−0.9Δ<sub>o</sub> bo&apos;ladi. Bu ham yetarli emas —
              asosiy omil <strong>ion radiusining kichikligi va kovalent bog&apos;lanish</strong> hisoblanadi.
            </p>
          </div>
        </div>

        {/* ── 5. MO TUSHUNTIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 MO nazariyasi asosida tushuntirish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Molekulyar orbitallar nazariyasi Irving-Uilyams qatorini 
              <strong className="text-yellow-400"> yanada chuqurroq tushuntirish</strong> imkonini beradi.
              d-elektronlar soni ortishi bilan metall ionining <strong>elektromanfiyligi ortadi</strong>, 
              bu esa <strong>metall-ligand kovalent bog&apos;lanishining kuchayishiga</strong> olib keladi.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                omil: "Elektrmanfiylik ortishi",
                izoh: "Mn²⁺ (1.55) &lt; Fe²⁺ (1.83) &lt; Co²⁺ (1.88) &lt; Ni²⁺ (1.91) &lt; Cu²⁺ (2.00) — Pauling shkalasi bo&apos;yicha. Elektrmanfiylik ortishi bilan metall-ligand bog&apos;ining kovalentlik darajasi ortadi, bu esa bog&apos; energiyasini oshiradi.",
              },
              {
                omil: "d-orbital energiyasining pasayishi",
                izoh: "d-elektronlar soni ortishi bilan samarali yadro zaryadi (Z<sub>eff</sub>) ortadi. Natijada d-orbital energiyasi pasayadi va ligand orbitallari bilan yaxshiroq qoplashadi — kuchliroq kovalent bog&apos;.",
              },
              {
                omil: "σ-bog&apos;lovchi MO ning barqarorlashishi",
                izoh: "Metallning d-orbitallari va ligandning σ-orbitallari orasidagi energiya farqi kamaygan sari bog&apos;lovchi MO energiyasi pasayadi — bog&apos; barqarorligi ortadi. Bu ayniqsa Cu²⁺ da yaqqol namoyon bo&apos;ladi.",
              },
              {
                omil: "Zn²⁺ — keskin pasayish sababi",
                izoh: "Zn²⁺ (d¹⁰) da barcha bog&apos;lovchi va bog&apos;lanmagan MO lar to&apos;liq to&apos;lgan. Qo&apos;shimcha elektronlar antibog&apos;lovchi orbitallarga joylashishi kerak — bu esa bog&apos;ni kuchsizlantiradi. Shuning uchun Zn²⁺ komplekslari Cu²⁺ dan ancha beqaror.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. ISTISNOLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Irving-Uilyams qatoridan istisnolar</h2>
          
          <div className="space-y-4">
            {[
              {
                istisno: "π-Akseptor ligandlar (CN⁻, CO, bpy)",
                izoh: "Bu ligandlar metallning t₂<sub>g</sub> elektronlarini π-akseptor orbitallarga tortadi. Quyi spinli konfiguratsiyalar barqaror bo&apos;ladi. Masalan, [Fe(CN)₆]⁴⁻ (d⁶, QS) — juda barqaror (log β=35.4), Irving-Uilyams qatoridan yuqori.",
              },
              {
                istisno: "Ko&apos;p yadroli va ko&apos;prikli komplekslar",
                izoh: "Irving-Uilyams qatori faqat <strong>monoyadroli oddiy komplekslar</strong> uchun amal qiladi. Ko&apos;p yadroli komplekslarda metall-metall bog&apos;lanishi va ko&apos;prik ligandlar ta&apos;siri qatorni buzadi.",
              },
              {
                istisno: "Sterik to&apos;siq kuchli bo&apos;lganda",
                izoh: "Katta hajmli ligandlar (masalan, PPh₃) bilan sterik to&apos;siq tufayli barqarorlik ion radiusiga teskari bog&apos;liq bo&apos;lishi mumkin. Kichikroq ion (Ni²⁺) katta ligand bilan beqaror kompleks berishi mumkin.",
              },
              {
                istisno: "Noodatiy oksidlanish darajalari",
                izoh: "Irving-Uilyams qatori faqat <strong>M²⁺ ionlari</strong> uchun. M³⁺ (Fe³⁺, Co³⁺) yoki M⁺ (Cu⁺) ionlari bilan qator butunlay boshqacha. Masalan, Co³⁺ komplekslari Co²⁺ dan ancha barqaror (katta zaryad + quyi spin).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.istisno}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Irving-Uilyams qatori:</strong> Mn²⁺ &lt; Fe²⁺ &lt; Co²⁺ &lt; Ni²⁺ &lt; Cu²⁺ &gt; Zn²⁺</li>
            <li><strong className="text-yellow-400">Ion radiusi:</strong> d-elektronlar ortishi bilan radius kamayadi → kuchliroq elektrostatik bog&apos;</li>
            <li><strong className="text-yellow-400">KMBE:</strong> Ni²⁺ da maksimal (1.2Δ<sub>o</sub>), lekin Cu²⁺ da Yan-Teller qo&apos;shimcha barqarorlik</li>
            <li><strong className="text-yellow-400">MO tushuntirish:</strong> elektrmanfiylik ortishi → kovalent bog&apos; kuchayishi</li>
            <li><strong className="text-yellow-400">Istisnolar:</strong> π-akseptor ligandlar, ko&apos;p yadroli komplekslar, sterik to&apos;siq, M³⁺ ionlari</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika/parametrlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Termodinamik parametrlar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/termodinamika/xelat-effekti" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Xelat effekti →
          </Link>
        </div>

      </section>
    </main>
  )
}