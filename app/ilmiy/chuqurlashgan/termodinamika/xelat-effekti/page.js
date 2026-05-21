import Link from "next/link"

export default function XelatEffekti() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🔗 Xelat effekti</h1>
          <p className="text-purple-400 text-sm">Xelat komplekslarning anomal barqarorligi • Entropik omil • Halqa kattaligi • EDTA • Makrotsiklik effekt</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Xelat effekti — polidentat ligandlarning mo&apos;jizasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Xelat effekti</strong> — polidentat (ko&apos;p tishli) ligandlar 
              bilan hosil bo&apos;lgan komplekslarning <strong>xuddi shunday donor atomlarga ega monodentat 
              ligandlar komplekslariga nisbatan anomal yuqori barqarorligi</strong>. 
              &quot;Xelat&quot; — yunoncha &quot;chele&quot; (qisqichbaqa panjasi) so&apos;zidan.
              Xelat effektining asosiy sababi <strong>entropik omil</strong> — polidentat ligand 
              ko&apos;p sonli erituvchi molekulalarini siqib chiqaradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Klassik taqqoslash</h3>
              <p className="text-purple-200 text-sm">
                <strong>[Ni(H₂O)₆]²⁺ + 6NH₃ ⇌ [Ni(NH₃)₆]²⁺ + 6H₂O</strong><br/>
                log β₆ = 8.7, ΔG° = −49.6 kJ/mol<br/>
                <strong>[Ni(H₂O)₆]²⁺ + 3en ⇌ [Ni(en)₃]²⁺ + 6H₂O</strong><br/>
                log β₃ = 18.3, ΔG° = −104.5 kJ/mol<br/>
                <strong>Farq:</strong> ~10¹⁰ marta barqarorroq!
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Xelat effektining termodinamik sababi</h3>
              <p className="text-purple-200 text-sm">
                NH₃ va en ning donor atomi bir xil (N). Bog&apos; energiyasi deyarli bir xil (ΔH ≈ −60 kJ/mol).<br/>
                <strong>NH₃:</strong> ΔS = −15 J/mol·K (tartib ortadi)<br/>
                <strong>en:</strong> ΔS = +50 J/mol·K (tartib kamayadi!)<br/>
                <strong>Sabab:</strong> 3 ta en molekulasi 6 ta H₂O ni siqib chiqaradi → erkin suv molekulalari soni ortadi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. ENTROPIK VA ENTALPIK OMILLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎲 Entropik va entalpik omillar — xelat effektining ikki manbai</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Xelat effekti <strong className="text-yellow-400">ikkita mustaqil omil</strong> hisobiga yuzaga keladi.
              Asosiy hissa — <strong>entropik omil</strong> (desolvatatsiya), qo&apos;shimcha hissa — 
              <strong>entalpik omil</strong> (bog&apos; energiyasi farqi). Ko&apos;pchilik hollarda 
              entropik omil dominant (60−80% hissa).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Reaksiya</th>
                <th className="py-3 px-4 text-purple-300">ΔH° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔS° (J/mol·K)</th>
                <th className="py-3 px-4 text-purple-300">−TΔS° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">ΔG° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Entropik hissa</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Ni²⁺ + 6NH₃", "−60.2", "−15", "+4.5", "−55.7", "−8% (manfiy)"],
                  ["Ni²⁺ + 3en", "−56.0", "+50", "−14.9", "−70.9", "+21% (musbat!)"],
                  ["Cu²⁺ + 4NH₃", "−75.0", "+30", "−8.9", "−83.9", "+11%"],
                  ["Cu²⁺ + 2en", "−71.5", "+45", "−13.4", "−84.9", "+16%"],
                  ["Fe²⁺ + EDTA", "−24.0", "+155", "−46.2", "−70.2", "+66% (dominant!)"],
                  ["Co²⁺ + EDTA", "−20.0", "+180", "−53.6", "−73.6", "+73% (dominant!)"],
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

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Nima uchun ΔS musbat bo&apos;ladi? — Desolvatatsiya effekti</h3>
            <p className="text-purple-200 text-sm">
              Erkin metall ioni eritmada <strong>gidratlangan</strong> — atrofida 6 ta (yoki undan ko&apos;p) 
              suv molekulasi qat&apos;iy tartiblangan. Polidentat ligand (masalan, en) bu suv molekulalarini 
              siqib chiqaradi. Natijada <strong>ko&apos;p sonli suv molekulalari ozod bo&apos;ladi</strong> — 
              ularning erkinlik darajasi ortadi. Bu esa <strong>tartibsizlikning oshishiga (ΔS &gt; 0)</strong> olib keladi.
              Monodentat NH₃ da esa suv molekulalari soni o&apos;zgarmaydi (6 ta NH₃ 6 ta H₂O ni almashtiradi).
            </p>
          </div>
        </div>

        {/* ── 3. XELAT HALQASI KATTALIGI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭕ Xelat halqasi kattaligi — 5 &gt; 6 &gt; 4 qoidasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Xelat halqasidagi <strong className="text-yellow-400">atomlar soni barqarorlikka sezilarli 
              ta&apos;sir qiladi</strong>. Optimal halqa kattaligi — <strong>5 a&apos;zoli</strong> 
              (masalan, etilendiamin — 5 a&apos;zoli halqa: M−N−C−C−N). 
              6 a&apos;zoli halqalar biroz beqarorroq, 4 a&apos;zoli halqalar esa eng beqaror.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ligand</th>
                <th className="py-3 px-4 text-purple-300">Halqa kattaligi</th>
                <th className="py-3 px-4 text-purple-300">Donor atomlar</th>
                <th className="py-3 px-4 text-purple-300">Ni²⁺ log K</th>
                <th className="py-3 px-4 text-purple-300">Cu²⁺ log K</th>
                <th className="py-3 px-4 text-purple-300">Nisbiy barqarorlik</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Etilendiamin (en)", "5", "N,N", "7.5 (log β₁)", "10.7 (log β₁)", "★★★★★ Eng barqaror"],
                  ["Trimetilendiamin (tn)", "6", "N,N", "6.4 (log β₁)", "9.5 (log β₁)", "★★★★ Barqaror"],
                  ["Oksalat (ox²⁻)", "5", "O,O", "5.2 (log β₁)", "6.2 (log β₁)", "★★★★ Barqaror"],
                  ["Malonat (mal²⁻)", "6", "O,O", "3.2 (log β₁)", "5.0 (log β₁)", "★★★ O&apos;rtacha"],
                  ["Glikin (gly⁻)", "5 (glisinat)", "N,O", "5.8 (log β₁)", "8.2 (log β₁)", "★★★★ Barqaror"],
                  ["β-Alanin", "6", "N,O", "3.5 (log β₁)", "5.5 (log β₁)", "★★★ O&apos;rtacha"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">5 a&apos;zoli halqa — optimal</h3>
              <p className="text-purple-200 text-sm">
                Minimal kuchlanish burchagi. Bog&apos; burchaklari ideal qiymatga yaqin. 
                sp³ gibridlangan C atomlari uchun 109.5° — 5 a&apos;zoli halqada ≈108°. 
                <strong>Eng barqaror xelat halqasi.</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">6 a&apos;zoli halqa — biroz kuchsiz</h3>
              <p className="text-purple-200 text-sm">
                Kattaroq halqa — ko&apos;proq konformatsion erkinlik, lekin 
                <strong>entropik jihatdan kamroq afzal</strong>. Konformatsiyalar soni ortishi 
                bilan erkin energiya pasayadi. Barqarorlik 5 a&apos;zolidan 10−100 marta kichik.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">4 a&apos;zoli halqa — kuchlanish</h3>
              <p className="text-purple-200 text-sm">
                Kichik halqa — katta burchak kuchlanishi. Bog&apos; burchaklari 90° ga yaqin 
                (sp³ uchun ideal 109.5° dan uzoq). 
                <strong>Juda beqaror, kam uchraydi.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. EDTA VA POLIDENTAT LIGANDLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 EDTA — olti tishli &quot;qisqichbaqa panjasi&quot;</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">EDTA (etilendiamintetraatsetat)</strong> — 
              <strong> 6-dentat ligand</strong>, 4 ta O-donor (karboksilat) va 2 ta N-donor (amin).
              Deyarli barcha metall ionlari bilan <strong>1:1 kompleks</strong> hosil qiladi.
              Barqarorlik konstantalari juda yuqori (log K = 14−25). 
              <strong>Analitik kimyoda eng ko&apos;p qo&apos;llaniladigan ligand.</strong>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall ioni</th>
                <th className="py-3 px-4 text-purple-300">log K<sub>stab</sub></th>
                <th className="py-3 px-4 text-purple-300">ΔG° (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks formulasi</th>
                <th className="py-3 px-4 text-purple-300">Amaliy qo&apos;llanish</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Mg²⁺", "8.8", "−50.2", "[Mg(EDTA)]²⁻", "Suv qattiqligini aniqlash"],
                  ["Ca²⁺", "10.7", "−61.1", "[Ca(EDTA)]²⁻", "Suv qattiqligi, Ca²⁺ titrlash"],
                  ["Mn²⁺", "14.0", "−79.9", "[Mn(EDTA)]²⁻", "Maskirovkalash"],
                  ["Fe²⁺", "14.3", "−81.6", "[Fe(EDTA)]²⁻", "Temir ionlarini bog&apos;lash"],
                  ["Fe³⁺", "25.1", "−143.3", "[Fe(EDTA)]⁻", "Juda barqaror — o&apos;simlik oziqasi"],
                  ["Cu²⁺", "18.8", "−107.3", "[Cu(EDTA)]²⁻", "Mis ionlarini titrlash"],
                  ["Zn²⁺", "16.5", "−94.2", "[Zn(EDTA)]²⁻", "Rux yetishmovchiligini davolash"],
                  ["Hg²⁺", "21.8", "−124.5", "[Hg(EDTA)]²⁻", "Zaharlanishda antidot"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-green-400 font-bold">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Boshqa muhim polidentat ligandlar</h3>
            <p className="text-purple-200 text-sm">
              <strong>DTPA (dietilentriaminpentaatsetat):</strong> 8-dentat ligand, Gd³⁺ bilan kompleksi MRI kontrast modda.<br/>
              <strong>DOTA:</strong> 8-dentat makrotsiklik ligand, radiometallar bilan barqaror komplekslar (PET diagnostika).<br/>
              <strong>Kraun-efirlar:</strong> faqat O-donor, ishqoriy metallar uchun selektiv. 18-kraun-6 — K⁺ uchun ideal.<br/>
              <strong>Kriptandlar:</strong> 3D-bo&apos;shliqli, N va O donorlar. [2.2.2]-kriptand — K⁺ bilan log K ≈ 10.5.
            </p>
          </div>
        </div>

        {/* ── 5. MAKROTSIKLIK EFFEKT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">👑 Makrotsiklik effekt — xelatdan ham kuchliroq</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Makrotsiklik effekt</strong> — makrotsiklik (halqasimon) 
              polidentat ligandlarning <strong>xuddi shunday donor atomlarga ega ochiq zanjirli 
              analoglaridan ham barqarorroq</strong> komplekslar hosil qilishi.
              Sababi: makrotsikl oldindan &quot;tayyor&quot; bo&apos;shliqqa ega — 
              kompleks hosil bo&apos;lishida konformatsion o&apos;zgarishlar minimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ochiq zanjirli analog</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tetramin (2,3,2-tet)</strong><br/>
                4-dentat ochiq zanjirli amin<br/>
                Cu²⁺ bilan log K ≈ 21<br/>
                Konformatsion moslashish uchun ΔS yo&apos;qotiladi<br/>
                <span className="text-red-400">Nisbatan beqarorroq</span>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Makrotsiklik analog</h3>
              <p className="text-purple-200 text-sm">
                <strong>Siklam (1,4,8,11-tetraazasiklotetradekan)</strong><br/>
                4-dentat makrotsiklik amin<br/>
                Cu²⁺ bilan log K ≈ 27<br/>
                Konformatsiya oldindan tayyor — ΔS kichik yo&apos;qotish<br/>
                <span className="text-green-400">~10⁶ marta barqarorroq!</span>
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Tabiatdagi makrotsiklik komplekslar</h3>
            <p className="text-purple-200 text-sm">
              <strong>Gem:</strong> Fe²⁺ porfirin halqasida — makrotsiklik effekt gemoglobinni barqaror qiladi.<br/>
              <strong>Xlorofill:</strong> Mg²⁺ porfirin analogida — makrotsiklik effekt fotosintez uchun zarur.<br/>
              <strong>B₁₂ vitamini:</strong> Co³⁺ korrin halqasida — eng murakkab makrotsiklik komplekslardan biri.<br/>
              <strong>Sideroforlar:</strong> Fe³⁺ ni bog&apos;lovchi tabiiy makrotsiklik ligandlar (bakteriyalar tomonidan ishlab chiqariladi).
            </p>
          </div>
        </div>

        {/* ── 6. XELAT EFFEKTINING AMALIY QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Xelat effektining amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Kompleksonometrik titrlash",
                matn: "EDTA yordamida metall ionlarini miqdoriy aniqlash. Metall-xrom indikatorlari (erioxrom qora T, mureksid) ishlatiladi. Ca²⁺+Mg²⁺ (suv qattiqligi), Zn²⁺, Cu²⁺, Fe³⁺ va boshqalar.",
              },
              {
                soha: "Xelat terapiya (tibbiyot)",
                matn: "Og&apos;ir metallar bilan zaharlanganda: EDTA (Pb²⁺), DMSA (Hg²⁺, As³⁺), BAL (Hg²⁺, Au⁺). Talassemiyada deferoksamin (Fe³⁺ ni chiqarish). Wilson kasalligida penitsillamin (Cu²⁺ ni chiqarish).",
              },
              {
                soha: "Qishloq xo&apos;jaligi",
                matn: "Mikroelementlar yetishmovchiligini bartaraf etish: Fe-EDTA (temir xlorozi), Zn-EDTA (rux yetishmovchiligi), Cu-EDTA. Xelatlar o&apos;simliklarga tez va to&apos;liq o&apos;zlashtiriladi.",
              },
              {
                soha: "Sanoat va ekologiya",
                matn: "Galvanik ishlab chiqarishda metall ionlarini bog&apos;lash. Radioaktiv chiqindilarni tozalash (EDTA, DTPA). Katalizatorlar — xelat komplekslari yuqori selektivlikka ega.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.soha}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Xelat effekti:</strong> polidentat ligandlar anomal yuqori barqarorlik beradi — asosiy sabab entropik (ΔS &gt; 0)</li>
            <li><strong className="text-yellow-400">Halqa kattaligi:</strong> 5 a&apos;zoli &gt; 6 a&apos;zoli &gt; 4 a&apos;zoli — minimal burchak kuchlanishi</li>
            <li><strong className="text-yellow-400">EDTA:</strong> 6-dentat, universal ligand, log K = 14−25, kompleksonometriya asosi</li>
            <li><strong className="text-yellow-400">Makrotsiklik effekt:</strong> makrotsikllar ochiq zanjirli analoglardan 10³−10⁶ marta barqarorroq</li>
            <li><strong className="text-yellow-400">Amaliyot:</strong> titrlash, tibbiyot (xelat terapiya), qishloq xo&apos;jaligi, ekologiya</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika/irving-uilyams" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Irving-Uilyams qatori
          </Link>
          <Link href="/ilmiy/chuqurlashgan/termodinamika/omillar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Barqarorlik omillari →
          </Link>
        </div>

      </section>
    </main>
  )
}