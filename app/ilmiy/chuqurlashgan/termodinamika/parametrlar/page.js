import Link from "next/link"

export default function Parametrlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📐 Termodinamik parametrlar: ΔH, ΔG, ΔS</h1>
          <p className="text-purple-400 text-sm">Gibbs energiyasi • Entalpiya • Entropiya • Kalorimetrik o&apos;lchashlar • Van&apos;t-Goff tenglamasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks hosil bo&apos;lishining termodinamik asoslari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks birikmaning hosil bo&apos;lishi <strong className="text-yellow-400">uchta asosiy termodinamik parametr</strong> bilan 
              xarakterlanadi: <strong>Gibbs energiyasi o&apos;zgarishi (ΔG), entalpiya o&apos;zgarishi (ΔH) va 
              entropiya o&apos;zgarishi (ΔS)</strong>. Bu parametrlar o&apos;zaro 
              <strong className="text-yellow-400"> Gibbs-Gelmgols tenglamasi</strong> orqali bog&apos;langan:
              <strong> ΔG = ΔH − TΔS</strong>. Kompleks barqarorligi faqat K<sub>stab</sub> bilan emas, 
              balki <strong>entalpik va entropik omillarning nisbiy hissasi</strong> bilan ham belgilanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">ΔG — Gibbs energiyasi</h3>
              <p className="text-purple-200 text-sm">Jarayonning o&apos;z-o&apos;zidan borish mezoni</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">ΔG = −RT ln K</p>
              <p className="text-purple-400 text-xs">ΔG &lt; 0 → kompleks barqaror</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">ΔH — Entalpiya</h3>
              <p className="text-purple-200 text-sm">Bog&apos;lar hosil bo&apos;lishi/uzilishi energiyasi</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">ΔH = E<sub>bog&apos;</sub> − E<sub>gidrat</sub></p>
              <p className="text-purple-400 text-xs">ΔH &lt; 0 → ekzotermik (afzal)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">ΔS — Entropiya</h3>
              <p className="text-purple-200 text-sm">Tartibsizlik o&apos;zgarishi</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">ΔS = S<sub>kompleks</sub> − S<sub>reagent</sub></p>
              <p className="text-purple-400 text-xs">ΔS &gt; 0 → entropik afzal</p>
            </div>
          </div>
        </div>

        {/* ── 2. GIBBS ENERGIYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Gibbs energiyasi va barqarorlik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">ΔG° = −RT ln K<sub>stab</sub></strong> — 
              termodinamikaning eng muhim tenglamalaridan biri. Xona haroratida (298 K):
              <strong> RT = 2.478 kJ/mol</strong>. Shuning uchun log K<sub>stab</sub> ning har bir 
              birligi ΔG° ga <strong>−5.708 kJ/mol</strong> qo&apos;shadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">K<sub>stab</sub></th>
                <th className="py-3 px-4 text-purple-300">log K</th>
                <th className="py-3 px-4 text-purple-300">ΔG° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks barqarorligi</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["10³", "3", "−17.1", "Kuchsiz", "[Ni(NH₃)₆]²⁺ (log β=8.7→−49.6 kJ)"],
                  ["10⁶", "6", "−34.2", "O&apos;rtacha", "[Ag(NH₃)₂]⁺ (log β=7.2→−41.1 kJ)"],
                  ["10¹⁰", "10", "−57.1", "Yuqori", "[Cu(en)₂]²⁺ (log β=20→−114 kJ)"],
                  ["10²⁰", "20", "−114.2", "Juda yuqori", "[Fe(EDTA)]⁻ (log β=25→−143 kJ)"],
                  ["10³⁰", "30", "−171.2", "Ekstremal", "[Fe(CN)₆]³⁻ (log β=44→−251 kJ)"],
                  ["10⁴⁰", "40", "−228.3", "Ekstremal", "[Hg(CN)₄]²⁻ (log β=41.5→−237 kJ)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Muhim:</strong> ΔG° faqat <strong>boshlang&apos;ich va oxirgi holatlar</strong>ga bog&apos;liq, 
              oraliq bosqichlarga bog&apos;liq emas (Gess qonuni). Shuning uchun umumiy barqarorlik konstantasi 
              β<sub>n</sub> orqali hisoblangan ΔG° — bu umumiy jarayonning Gibbs energiyasi o&apos;zgarishi.
            </p>
          </div>
        </div>

        {/* ── 3. ENTALPIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Entalpiya o&apos;zgarishi (ΔH) — bog&apos; energetikasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">ΔH</strong> — kompleks hosil bo&apos;lishidagi issiqlik effekti.
              Ko&apos;pchilik kompleks hosil bo&apos;lish reaksiyalari <strong>ekzotermik</strong> (ΔH &lt; 0) — 
              metall-ligand bog&apos;larining hosil bo&apos;lishi energiya ajralishi bilan boradi.
              ΔH qiymati <strong>metall-ligand bog&apos; energiyasi bilan gidratatsiya energiyasi 
              orasidagi farq</strong> sifatida tushuniladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">ΔH° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔS° (J/mol·K)</th>
                <th className="py-3 px-4 text-purple-300">−TΔS° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔG° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Dominant omil</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ni(NH₃)₆]²⁺", "−60.2", "−15", "+4.5", "−55.7", "Entalpik"],
                  ["[Cu(NH₃)₄]²⁺", "−75.0", "+30", "−8.9", "−83.9", "Entalpik"],
                  ["[Cu(en)₂]²⁺", "−71.5", "+45", "−13.4", "−84.9", "Entalpik+Entropik"],
                  ["[Ni(en)₃]²⁺", "−56.0", "+50", "−14.9", "−70.9", "Entropik qo&apos;shimcha"],
                  ["[Fe(EDTA)]⁻", "−24.0", "+155", "−46.2", "−70.2", "Entropik (kuchli)"],
                  ["[Co(EDTA)]⁻", "−20.0", "+180", "−53.6", "−73.6", "Entropik (dominant)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-red-400">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 font-bold text-blue-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mt-4">
            <p className="text-red-300 text-sm">
              <strong>Qiziqarli holat:</strong> Ba&apos;zi komplekslarda ΔH &gt; 0 (endotermik), lekin ΔS &gt;&gt; 0 
              bo&apos;lgani uchun ΔG &lt; 0 bo&apos;ladi. Bunday komplekslar <strong>faqat entropik omil</strong> 
              hisobiga barqaror. Misol: [CdI₄]²⁻ — ΔH=+9.6 kJ/mol, lekin ΔS=+113 J/mol·K, ΔG=−24.1 kJ/mol.
            </p>
          </div>
        </div>

        {/* ── 4. ENTROPIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎲 Entropiya o&apos;zgarishi (ΔS) — tartibsizlik omili</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Entropiya o&apos;zgarishi</strong> — kompleks hosil bo&apos;lishida 
              zarralar soni va erkinlik darajalarining o&apos;zgarishi. 
              <strong className="text-yellow-400"> Monodentat ligandlar</strong> bilan kompleks hosil bo&apos;lishida 
              ΔS odatda <strong>manfiy</strong> (tartib ortadi — ligandlar erkin holatdan bog&apos;langan holatga o&apos;tadi).
              <strong className="text-yellow-400"> Polidentat (xelat) ligandlar</strong> bilan ΔS odatda 
              <strong> musbat</strong> (desolvatatsiya — ko&apos;p sonli erituvchi molekulalari ozod bo&apos;ladi).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Monodentat ligandlar: ΔS &lt; 0</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Ni(H₂O)₆]²⁺ + 6NH₃ → [Ni(NH₃)₆]²⁺ + 6H₂O</strong><br/>
                Zarralar soni: 7 → 7 (o&apos;zgarmaydi)<br/>
                NH₃ molekulalari erkin harakatdan bog&apos;langan holatga o&apos;tadi<br/>
                <strong>ΔS = −15 J/mol·K</strong> (kichik manfiy)<br/>
                Dominant omil: <strong>ΔH (entalpik barqarorlik)</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Polidentat ligandlar: ΔS &gt; 0</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Ni(H₂O)₆]²⁺ + 3en → [Ni(en)₃]²⁺ + 6H₂O</strong><br/>
                Zarralar soni: 7 → 7 (o&apos;zgarmaydi)<br/>
                Lekin 3 ta en 6 ta H₂O ni siqib chiqaradi — erkin suv molekulalari soni ortadi<br/>
                <strong>ΔS = +50 J/mol·K</strong> (katta musbat!)<br/>
                Bu — <strong>xelat effektining entropik tabiati!</strong>
              </p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <p className="text-green-300 text-sm">
              <strong>EDTA bilan:</strong> [Ni(H₂O)₆]²⁺ + EDTA⁴⁻ → [Ni(EDTA)]²⁻ + 6H₂O. 
              Zarralar soni: 7 → 7. Lekin EDTA — 6-dentat ligand, bitta molekula 6 ta H₂O ni almashtiradi.
              ΔS = +55 J/mol·K. Bu — entropik barqarorlikning eng yorqin namunasi.
            </p>
          </div>
        </div>

        {/* ── 5. VAN'T-GOFF TENGLAMASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📈 Van&apos;t-Goff tenglamasi — ΔH ni aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Van&apos;t-Goff tenglamasi</strong> — har xil haroratlarda 
              o&apos;lchangan K<sub>stab</sub> qiymatlaridan ΔH va ΔS ni hisoblash imkonini beradi.
              Bu usul <strong>kalorimetrik o&apos;lchashlarsiz</strong> termodinamik parametrlarni 
              aniqlashning klassik yo&apos;lidir.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              ln K = −ΔH°/R × (1/T) + ΔS°/R
            </p>
            <p className="text-purple-300 text-sm mt-2">
              ln K vs 1/T grafigi — to&apos;g&apos;ri chiziq. Nishab = −ΔH°/R, kesishish = ΔS°/R
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                qadam: "1-qadam: Turli haroratlarda K ni o&apos;lchash",
                izoh: "Kamida 4−5 xil haroratda (masalan, 15°C, 25°C, 35°C, 45°C, 55°C) kompleksning barqarorlik konstantasi aniqlanadi. Harorat oralig&apos;i qancha keng bo&apos;lsa, aniqlik shuncha yuqori.",
              },
              {
                qadam: "2-qadam: ln K vs 1/T grafigini qurish",
                izoh: "Abssissa: 1/T (K⁻¹). Ordinata: ln K. Nuqtalar chiziqli bog&apos;liqlik berishi kerak. Agar chiziqli bo&apos;lmasa — ΔH haroratga bog&apos;liq (ΔC<sub>p</sub> ≠ 0).",
              },
              {
                qadam: "3-qadam: ΔH° ni hisoblash",
                izoh: "Chiziq nishabi m = −ΔH°/R. ΔH° = −m × R. R = 8.314 J/mol·K. Agar nishab manfiy bo&apos;lsa — ΔH° musbat (endotermik), nishab musbat bo&apos;lsa — ΔH° manfiy (ekzotermik).",
              },
              {
                qadam: "4-qadam: ΔS° va ΔG° ni hisoblash",
                izoh: "Chiziqning ordinata bilan kesishgan nuqtasi b = ΔS°/R. ΔS° = b × R. So&apos;ng ΔG° = ΔH° − TΔS° formula orqali istalgan haroratdagi ΔG° hisoblanadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. KALORIMETRIK O'LCHASHLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Kalorimetrik o&apos;lchashlar — ΔH ni bevosita aniqlash</h2>
          
          <div className="space-y-4">
            {[
              {
                metod: "Izotermik titrlash kalorimetriyasi (ITC)",
                tavsif: "Eng zamonaviy va informativ usul. Titrant (ligand eritmasi) asta-sekin namunaga (metall ioni eritmasi) qo&apos;shiladi. Har bir qo&apos;shishda ajralgan yoki yutilgan issiqlik o&apos;lchanadi. <strong>Bir vaqtda K<sub>stab</sub>, ΔH, ΔS va n (stoxiometriya)</strong> aniqlanadi. Afzalligi: to&apos;liq termodinamik profil, kam namuna (1−2 mL). Kamchiligi: qimmat qurilma.",
                misol: "[Fe(EDTA)]⁻ kompleksi — ITC yordamida K<sub>stab</sub>=10²⁵, ΔH=−24 kJ/mol, ΔS=+155 J/mol·K aniqlangan.",
              },
              {
                metod: "Differensial skanirlovchi kalorimetriya (DSC)",
                tavsif: "Namuna va standart bir xil haroratda qizdiriladi. Namuna bilan sodir bo&apos;ladigan jarayonlar uchun kerak bo&apos;ladigan qo&apos;shimcha energiya o&apos;lchanadi. Qattiq komplekslarning termik barqarorligi, parchalanish harorati va entalpiyasini aniqlash uchun.",
                misol: "[Ni(NH₃)₆]Cl₂ — DSC yordamida NH₃ molekulalarining bosqichli ajralish haroratlari va entalpiyalari aniqlangan.",
              },
              {
                metod: "Eritma kalorimetriyasi",
                tavsif: "An&apos;anaviy usul. Reaksiya kalorimetrda olib boriladi va harorat o&apos;zgarishi o&apos;lchanadi. Oddiy va arzon. Issiqlik sig&apos;imini bilish kerak. Aniqligi ITC dan past, lekin ko&apos;pchilik komplekslar uchun yetarli.",
                misol: "Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺ — ΔH=−75 kJ/mol (eritma kalorimetriyasi bilan).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.metod}</h3>
                <p className="text-purple-200 text-sm">{r.tavsif}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">ΔG = ΔH − TΔS = −RT ln K</strong> — kompleks barqarorligining asosiy tenglamasi</li>
            <li><strong className="text-yellow-400">Monodentat ligandlar:</strong> ΔH dominant, ΔS kichik manfiy — entalpik barqarorlik</li>
            <li><strong className="text-yellow-400">Polidentat ligandlar:</strong> ΔS katta musbat — xelat effekti entropik tabiatga ega</li>
            <li><strong className="text-yellow-400">Van&apos;t-Goff:</strong> ln K vs 1/T grafigidan ΔH va ΔS hisoblanadi</li>
            <li><strong className="text-yellow-400">ITC:</strong> bir vaqtda K<sub>stab</sub>, ΔH, ΔS, n aniqlash — eng informativ usul</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika/barqarorlik-konstantasi" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Barqarorlik konstantasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/termodinamika/irving-uilyams" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Irving-Uilyams qatori →
          </Link>
        </div>

      </section>
    </main>
  )
}