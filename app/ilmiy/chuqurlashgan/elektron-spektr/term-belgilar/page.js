import Link from "next/link"

export default function TermBelgilar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🏷️ Term belgilar</h1>
          <p className="text-purple-400 text-sm">Russell-Saunders bog&apos;lanishi • ²S+¹L holatlar • d¹-d⁹ asosiy termlar • Mikroholatlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Term belgilar haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Term belgisi (spektral term)</strong> — erkin ion yoki atomning 
              berilgan elektron konfiguratsiyaga mos keladigan energetik holatini ifodalovchi belgi.
              Term belgisi <strong className="text-yellow-400">²S+¹L</strong> ko&apos;rinishida yoziladi, bu yerda:
              <strong> S</strong> — umumiy spin kvant soni, <strong>L</strong> — umumiy orbital kvant soni.
              Kompleks birikmalarning elektron spektrlarini tushunish uchun term belgilarini bilish shart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">S — Spin</h3>
              <p className="text-purple-200 text-sm">Umumiy spin kvant soni</p>
              <p className="text-white font-bold text-lg mt-2">S = Σ m<sub>s</sub></p>
              <p className="text-purple-400 text-xs mt-1">Har bir e⁻ uchun m<sub>s</sub> = ±½</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">L — Orbital</h3>
              <p className="text-purple-200 text-sm">Umumiy orbital kvant soni</p>
              <p className="text-white font-bold text-lg mt-2">L = Σ m<sub>l</sub></p>
              <p className="text-purple-400 text-xs mt-1">d-elektronlar uchun m<sub>l</sub> = +2, +1, 0, −1, −2</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">J — To&apos;liq moment</h3>
              <p className="text-purple-200 text-sm">Spin-orbital bog&apos;lanish</p>
              <p className="text-white font-bold text-lg mt-2">J = |L ± S|</p>
              <p className="text-purple-400 text-xs mt-1">Og&apos;ir atomlarda muhim</p>
            </div>
          </div>
        </div>

        {/* ── 2. RUSSELL-SAUNDERS BOG'LANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Russell-Saunders (LS) bog&apos;lanishi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Russell-Saunders bog&apos;lanishi</strong> — yengil va o&apos;rta 
              atomlar (shu jumladan 3d-metallar) uchun qo&apos;llaniladigan bog&apos;lanish sxemasi.
              Bunda avval barcha elektronlarning spin momentlari o&apos;zaro bog&apos;lanib umumiy 
              <strong> S</strong> ni, orbital momentlari o&apos;zaro bog&apos;lanib umumiy <strong>L</strong> ni hosil qiladi.
              Keyin S va L o&apos;zaro ta&apos;sirlashib <strong>J</strong> ni beradi.
              3d-metall komplekslari uchun aynan LS bog&apos;lanish sxemasi ishlatiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">L qiymati</th>
                <th className="py-3 px-4 text-purple-300">Belgi</th>
                <th className="py-3 px-4 text-purple-300">L qiymati</th>
                <th className="py-3 px-4 text-purple-300">Belgi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["0", "S", "5", "H"],
                  ["1", "P", "6", "I"],
                  ["2", "D", "7", "K"],
                  ["3", "F", "8", "L"],
                  ["4", "G", "—", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4">{r[0]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Multipliklik (2S+1)</h3>
            <p className="text-purple-200 text-sm">
              Term belgisining chap yuqori burchagida yoziladigan <strong>2S+1</strong> soni 
              <strong>spin multiplikligi</strong> deb ataladi va u holatning nechta spin mikrosathga 
              ajralishini ko&apos;rsatadi. Masalan:<br/>
              • S = 0 → 2S+1 = 1 → <strong>singlet</strong><br/>
              • S = ½ → 2S+1 = 2 → <strong>dublet</strong><br/>
              • S = 1 → 2S+1 = 3 → <strong>triplet</strong><br/>
              • S = 3/2 → 2S+1 = 4 → <strong>kvartet</strong><br/>
              • S = 2 → 2S+1 = 5 → <strong>kvintet</strong><br/>
              • S = 5/2 → 2S+1 = 6 → <strong>sekstet</strong>
            </p>
          </div>
        </div>

        {/* ── 3. MIKROHOLATLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Mikroholatlar soni</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            d<sup>n</sup> konfiguratsiya uchun umumiy mikroholatlar soni <strong>kombinatorik formula</strong> orqali aniqlanadi.
            Har bir d-orbitalda 2 tagacha elektron bo&apos;lishi mumkin (Pauli prinsipi). 5 ta d-orbital — jami 10 ta spin-orbital.
            n ta elektronni 10 ta spin-orbitalga joylashtirish usullari soni:
          </p>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Mikroholatlar soni = C(10, n) = 10! / [n! × (10−n)!]
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">Mikroholatlar</th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">Mikroholatlar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹ (d⁹)", "10", "d² (d⁸)", "45"],
                  ["d³ (d⁷)", "120", "d⁴ (d⁶)", "210"],
                  ["d⁵", "252", "d¹⁰", "1"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Teshiklar ekvivalentligi</h3>
            <p className="text-purple-200 text-sm">
              d<sup>n</sup> va d<sup>10−n</sup> konfiguratsiyalar bir xil term belgilarga ega (teshik formalizmi).
              Masalan: d¹ va d⁹ bir xil term belgiga ega (²D). d² va d⁸ ham bir xil term belgilar beradi.
              Bu — <strong>elektron-teshik simmetriyasi</strong> deb ataladi.
            </p>
          </div>
        </div>

        {/* ── 4. HUND QOIDALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Hund qoidalari — asosiy termni topish</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Erkin ionning <strong className="text-yellow-400">eng past energiyali (asosiy) term</strong>ini 
            topish uchun Hund qoidalaridan foydalaniladi. Bu qoidalar faqat erkin ion uchun 
            to&apos;g&apos;ri; kompleksda ligand maydoni ta&apos;sirida tartib o&apos;zgarishi mumkin.
          </p>

          <div className="space-y-4">
            {[
              {
                nomi: "1-Hund qoidasi",
                mazmuni: "Eng past energiyali term — maksimal S (spin multiplikligi) ga ega bo&apos;lgan termdir. Elektronlar iloji boricha juftlanmay, parallel spin bilan joylashadi.",
                misol: "d³ da S = 3/2 (maksimal) → kvartet termlar eng past",
              },
              {
                nomi: "2-Hund qoidasi",
                mazmuni: "Agar bir nechta term bir xil S ga ega bo&apos;lsa, eng katta L ga ega bo&apos;lgan term eng past energiyalidir.",
                misol: "d² da ³F va ³P — ikkalasi ham triplet, lekin L=3 (³F) &gt; L=1 (³P), shuning uchun ³F pastroq",
              },
              {
                nomi: "3-Hund qoidasi",
                mazmuni: "Agar qobiq yarimdan kam to&apos;lgan bo&apos;lsa (n &lt; 5), eng kichik J li holat past; yarimdan ko&apos;p to&apos;lgan bo&apos;lsa (n &gt; 5), eng katta J li holat past.",
                misol: "d² (n=2 &lt; 5): ³F₂ eng past. d⁸ (n=8 &gt; 5): ³F₄ eng past",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.nomi}</h3>
                <p className="text-purple-200 text-sm mb-2">{r.mazmuni}</p>
                <p className="text-purple-400 text-xs">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. d¹-d⁹ ASOSIY TERMLAR JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 d<sup>n</sup> konfiguratsiyalar uchun termlar</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Quyidagi jadvalda har bir d<sup>n</sup> konfiguratsiya uchun barcha term belgilar, 
            shuningdek asosiy (eng past energiyali) term keltirilgan. Jadval kompleks birikmalarning 
            elektron spektrlarini tahlil qilishda <strong className="text-yellow-400">boshlang&apos;ich nuqta</strong> hisoblanadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">Barcha termlar</th>
                <th className="py-3 px-4 text-purple-300">Asosiy term</th>
                <th className="py-3 px-4 text-purple-300">S</th>
                <th className="py-3 px-4 text-purple-300">2S+1</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "Ti³⁺, V⁴⁺", "²D", "²D", "½", "2 (dublet)"],
                  ["d²", "V³⁺, Cr⁴⁺", "³F, ³P, ¹G, ¹D, ¹S", "³F", "1", "3 (triplet)"],
                  ["d³", "Cr³⁺, Mn⁴⁺", "⁴F, ⁴P, ²G, ²F, ²D, ²P, ²H", "⁴F", "3/2", "4 (kvartet)"],
                  ["d⁴", "Cr²⁺, Mn³⁺", "⁵D, ³H, ³G, ³F, ³D, ³P, ¹I, ¹G, ¹F, ¹D, ¹S", "⁵D", "2", "5 (kvintet)"],
                  ["d⁵", "Fe³⁺, Mn²⁺", "⁶S, ⁴G, ⁴F, ⁴D, ⁴P, ²I, ²H, ²G, ²F, ²D, ²P, ²S", "⁶S", "5/2", "6 (sekstet)"],
                  ["d⁶", "Fe²⁺, Co³⁺", "⁵D, ³H, ³G, ³F, ³D, ³P, ¹I, ¹G, ¹F, ¹D, ¹S", "⁵D", "2", "5 (kvintet)"],
                  ["d⁷", "Co²⁺, Ni³⁺", "⁴F, ⁴P, ²G, ²F, ²D, ²P, ²H", "⁴F", "3/2", "4 (kvartet)"],
                  ["d⁸", "Ni²⁺, Cu³⁺", "³F, ³P, ¹G, ¹D, ¹S", "³F", "1", "3 (triplet)"],
                  ["d⁹", "Cu²⁺, Ag²⁺", "²D", "²D", "½", "2 (dublet)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Muhim eslatma</h3>
            <p className="text-purple-200 text-sm">
              Erkin ion term belgilari kompleksga o&apos;tganda <strong>oktaedrik yoki tetraedrik 
              ligand maydoni ta&apos;sirida ajraladi</strong>. Ajralgan term belgilar 
              Orgel va Tanabe-Sugano diagrammalarida ko&apos;rsatilgan. 
              Masalan: erkin ion ⁵D termi oktaedrik maydonda ⁵T₂<sub>g</sub> va ⁵E<sub>g</sub> larga ajraladi.
            </p>
          </div>
        </div>

        {/* ── 6. TERM BELGILARINI ANIQLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 Term belgilarini amaliy aniqlash</h2>
          
          <div className="space-y-4">
            {[
              {
                qadam: "1-qadam: m<sub>l</sub> va m<sub>s</sub> jadvalini tuzish",
                izoh: "Har bir elektron uchun m<sub>l</sub> (+2 dan −2 gacha) va m<sub>s</sub> (+½ yoki −½) qiymatlarini yozib chiqing. Barcha elektronlar uchun alohida qator.",
              },
              {
                qadam: "2-qadam: M<sub>L</sub> va M<sub>S</sub> ni hisoblash",
                izoh: "Har bir mikroholat uchun M<sub>L</sub> = Σ m<sub>l</sub> va M<sub>S</sub> = Σ m<sub>s</sub> ni hisoblang. Pauli prinsipiga zid keluvchi holatlarni chiqarib tashlang.",
              },
              {
                qadam: "3-qadam: Eng katta M<sub>L</sub> va M<sub>S</sub> ni ajratish",
                izoh: "Mavjud bo&apos;lgan eng katta M<sub>L</sub> va unga mos M<sub>S</sub> qiymatini toping. Bu juftlik birinchi term belgisini beradi. M<sub>L(max)</sub> = L, M<sub>S(max)</sub> = S.",
              },
              {
                qadam: "4-qadam: Topilgan termning barcha mikroholatlarini olib tashlash",
                izoh: "Topilgan L va S ga mos keluvchi barcha M<sub>L</sub> (L dan −L gacha) va M<sub>S</sub> (S dan −S gacha) juftliklarini ro&apos;yxatdan o&apos;chiring.",
              },
              {
                qadam: "5-qadam: Qolgan mikroholatlar bilan takrorlash",
                izoh: "Qolgan mikroholatlar ichidan yana eng katta M<sub>L</sub> va M<sub>S</sub> ni toping — bu navbatdagi term belgisi. Barcha mikroholatlar tugaguncha davom ettiring.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Misol: d² konfiguratsiya</h3>
            <p className="text-purple-200 text-sm">
              d² konfiguratsiya uchun jami 45 ta mikroholat mavjud. Eng katta M<sub>L</sub> = 4 
              (ikkala elektron m<sub>l</sub> = +2 da) va M<sub>S</sub> = 1 (ikkala spin parallel) — 
              bu <strong>³F</strong> termiga mos keladi (L=3, S=1). ³F term 21 ta mikroholatni 
              (7 × 3 = 21) oladi. Qolgan 24 mikroholatdan navbatdagi termlar topiladi: ³P, ¹G, ¹D, ¹S.
            </p>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Term belgisi = ²S+¹L</strong> — erkin ion energetik holatini ifodalaydi</li>
            <li><strong className="text-yellow-400">Russell-Saunders (LS) bog&apos;lanishi</strong> — 3d-metallar uchun asosiy sxema</li>
            <li><strong className="text-yellow-400">Hund qoidalari</strong> — asosiy termni topish: maksimal S, keyin maksimal L</li>
            <li><strong className="text-yellow-400">d<sup>n</sup> va d<sup>10−n</sup></strong> bir xil term belgilarga ega (teshik simmetriyasi)</li>
            <li>Term belgilari kompleksda <strong>ligand maydoni ta&apos;sirida ajraladi</strong> — bu keyingi bo&apos;limlarda</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Elektron spektrlari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/tanlash-qoidalari" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Tanlash qoidalari →
          </Link>
        </div>

      </section>
    </main>
  )
}