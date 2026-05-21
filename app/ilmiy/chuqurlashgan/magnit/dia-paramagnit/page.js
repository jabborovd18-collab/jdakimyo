import Link from "next/link"

export default function DiaParamagnit() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧲 Diamagnit va paramagnit komplekslar</h1>
          <p className="text-purple-400 text-sm">Diamagnetizm • Paramagnetizm • Haroratga bog&apos;liqlik • Spin holatini aniqlash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Diamagnetizm va paramagnetizm asoslari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Diamagnetizm</strong> — barcha moddalarga xos bo&apos;lgan universal xossa.
              Tashqi magnit maydon atomlarning elektron qobiqlarida <strong>induksion tok</strong> hosil qiladi,
              bu tok Lens qoidasiga ko&apos;ra tashqi maydonga qarama-qarshi yo&apos;nalgan magnit maydon yaratadi.
              <strong className="text-yellow-400">Paramagnetizm</strong> esa faqat <strong>juftlanmagan elektronlarga</strong> 
              ega bo&apos;lgan moddalarda kuzatiladi. Kompleks birikmalarda paramagnit hissa diamagnit hissadan 
              bir necha tartibga katta bo&apos;lgani uchun, juftlanmagan elektronlar mavjud bo&apos;lsa, 
              kompleks paramagnit bo&apos;ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Diamagnit komplekslar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Shart:</strong> Barcha elektronlar juftlashgan (n = 0)<br/>
                <strong>μ<sub>eff</sub>:</strong> 0 μ<sub>B</sub><br/>
                <strong>χ<sub>M</sub>:</strong> manfiy, ~−10⁻⁴ − −10⁻⁶ CGS<br/>
                <strong>Magnit maydonda:</strong> kuchsiz itariladi<br/>
                <strong>Haroratga bog&apos;liqlik:</strong> deyarli yo&apos;q
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">Paramagnit komplekslar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Shart:</strong> Juftlanmagan elektronlar mavjud (n ≥ 1)<br/>
                <strong>μ<sub>eff</sub>:</strong> 1.73−5.92 μ<sub>B</sub> (spin-only)<br/>
                <strong>χ<sub>M</sub>:</strong> musbat, ~+10⁻³ − +10⁻² CGS<br/>
                <strong>Magnit maydonda:</strong> kuchli tortiladi<br/>
                <strong>Haroratga bog&apos;liqlik:</strong> χ ∝ 1/T (Kyuri qonuni)
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. DIAMAGNIT KOMPLEKSLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚪ Diamagnit komplekslar — qachon va nima uchun?</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks birikma <strong className="text-yellow-400">diamagnit bo&apos;lishi uchun</strong> 
              metall ionida <strong>juftlanmagan elektronlar bo&apos;lmasligi kerak</strong>.
              Bu quyidagi holatlarda kuzatiladi:
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                holat: "1. d⁰ konfiguratsiya — d-orbitallar bo&apos;sh",
                izoh: "Ti⁴⁺ (3d⁰), Zr⁴⁺ (4d⁰), V⁵⁺ (3d⁰), Cr⁶⁺ (3d⁰), Mn⁷⁺ (3d⁰). d-elektronlar umuman yo&apos;q — magnit moment nolga teng. Misollar: TiO²⁺ komplekslari, [VO₂]⁺, MnO₄⁻ (diamagnit, rangi LMCT dan).",
                misol: "[TiF₆]²⁻ — rangsiz, diamagnit. TiO²⁺ porfirin komplekslari — diamagnit, lekin rangli (LMCT).",
              },
              {
                holat: "2. d¹⁰ konfiguratsiya — d-orbitallar to&apos;liq to&apos;lgan",
                izoh: "Zn²⁺ (3d¹⁰), Cd²⁺ (4d¹⁰), Hg²⁺ (5d¹⁰), Cu⁺ (3d¹⁰), Ag⁺ (4d¹⁰), Au⁺ (5d¹⁰). Barcha d-orbitallar juftlashgan elektronlar bilan to&apos;lgan. Bu eng ko&apos;p uchraydigan diamagnit komplekslar guruhi.",
                misol: "[Zn(H₂O)₆]²⁺, [Zn(NH₃)₄]²⁺, [Cd(CN)₄]²⁻ — barchasi rangsiz va diamagnit.",
              },
              {
                holat: "3. Quyi spinli d⁶ konfiguratsiya",
                izoh: "Kuchli maydonli ligandlar (CN⁻, CO, bpy, phen) ta&apos;sirida d⁶ konfiguratsiya quyi spinli holatga o&apos;tadi: t₂g⁶ eg⁰. Barcha elektronlar t₂g orbitallarda juftlashgan — S = 0, diamagnit. Bu Co³⁺, Fe²⁺, Ru²⁺, Os²⁺, Ir³⁺, Pt⁴⁺ uchun xos.",
                misol: "[Co(NH₃)₆]³⁺ (diamagnit, sariq), [Fe(CN)₆]⁴⁻ (diamagnit, sariq), [Ru(bpy)₃]²⁺ (diamagnit, qizil — MLCT).",
              },
              {
                holat: "4. Quyi spinli d⁴ va d⁸ (kvadrat-planar)",
                izoh: "d⁴ quyi spin: t₂g⁴ eg⁰ — S = 0 (Mn³⁺, Cr²⁺ kuchli maydonda). d⁸ kvadrat-planar: kuchli maydonda dx²−y² orbital yuqori energiyaga chiqib ketadi, qolgan 4 ta d-orbital to&apos;liq to&apos;ladi. Ni²⁺, Pd²⁺, Pt²⁺, Au³⁺.",
                misol: "[Ni(CN)₄]²⁻ (kvadrat-planar, diamagnit, sariq), [Pt(NH₃)₄]²⁺ (diamagnit, rangsiz).",
              },
              {
                holat: "5. Metall-metal bog&apos;lanishli klasterlar",
                izoh: "Ikki yadroli komplekslarda metall atomlari orasida to&apos;g&apos;ridan-to&apos;g&apos;ri bog&apos; hosil bo&apos;lganda, juftlanmagan elektronlar juftlashib ketishi mumkin. Masalan, [Mo₂(OAc)₄] — Mo⁴⁺ (d²), lekin Mo≡Mo to&apos;rt karra bog&apos; elektronlarni juftlashtiradi.",
                misol: "[Mo₂(OAc)₄] (diamagnit, sariq), [Re₂Cl₈]²⁻ (diamagnit, ko&apos;k).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.holat}</h3>
                <p className="text-purple-200 text-sm mb-1">{r.izoh}</p>
                <p className="text-green-400 text-xs">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. PARAMAGNIT KOMPLEKSLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🟠 Paramagnit komplekslar — juftlanmagan elektronlar olami</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Paramagnit komplekslar <strong className="text-yellow-400">bir yoki bir nechta juftlanmagan elektronga</strong> ega.
              Magnit moment qiymati juftlanmagan elektronlar soniga va orbital hissaga bog&apos;liq.
              Paramagnit komplekslar <strong>Kyuri yoki Kyuri-Veys qonuniga</strong> bo&apos;ysunadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">n (YS)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub> (YS)</th>
                <th className="py-3 px-4 text-purple-300">n (QS)</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>SO</sub> (QS)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks (YS)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks (QS)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "1", "1.73", "—", "—", "[Ti(H₂O)₆]³⁺", "—"],
                  ["d²", "2", "2.83", "—", "—", "[V(H₂O)₆]³⁺", "—"],
                  ["d³", "3", "3.87", "—", "—", "[Cr(H₂O)₆]³⁺", "—"],
                  ["d⁴", "4", "4.90", "2", "2.83", "[Cr(H₂O)₆]²⁺", "[Mn(CN)₆]³⁻"],
                  ["d⁵", "5", "5.92", "1", "1.73", "[Fe(H₂O)₆]³⁺", "[Fe(CN)₆]³⁻"],
                  ["d⁶", "4", "4.90", "0", "0 (diamagnit)", "[Fe(H₂O)₆]²⁺", "[Co(NH₃)₆]³⁺"],
                  ["d⁷", "3", "3.87", "1", "1.73", "[Co(H₂O)₆]²⁺", "[Co(CN)₆]⁴⁻"],
                  ["d⁸", "2", "2.83", "—", "—", "[Ni(H₂O)₆]²⁺", "—"],
                  ["d⁹", "1", "1.73", "—", "—", "[Cu(H₂O)₆]²⁺", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                    <td className="py-3 px-4 text-sm">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Muhim:</strong> d⁴−d⁷ konfiguratsiyalar <strong>ikkita spin holatida</strong> mavjud bo&apos;la oladi.
              Magnit moment o&apos;lchash orqali YS va QS holatlarini bir-biridan ishonchli farqlash mumkin.
              Masalan: d⁶ — YS holatda μ = 4.90, QS holatda μ = 0 (diamagnit).
            </p>
          </div>
        </div>

        {/* ── 4. SPIN HOLATINI ANIQLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Magnit moment orqali spin holatini aniqlash</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Magnit o&apos;lchashlar <strong className="text-yellow-400">spin holatini aniqlashning eng ishonchli 
              eksperimental usulidir</strong>. Yuqori spin (YS) va quyi spin (QS) holatlar magnit moment qiymatlari 
              keskin farq qilgani uchun, hatto oddiy Gui tarozisi bilan ham ularni farqlash mumkin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                ion: "Fe²⁺ (d⁶) — spin holatini aniqlash",
                ys: "[Fe(H₂O)₆]²⁺ — t₂g⁴ eg², n=4, μ = 5.1−5.5 μ<sub>B</sub> (paramagnit)",
                qs: "[Fe(CN)₆]⁴⁻ — t₂g⁶ eg⁰, n=0, μ = 0 (diamagnit)",
                xulosa: "μ qiymati 0 yoki ~5.3 ekanligi darhol spin holatini ko&apos;rsatadi. Kuchsiz maydonli ligandlar (H₂O) — YS, kuchli maydonli (CN⁻) — QS.",
              },
              {
                ion: "Co²⁺ (d⁷) — spin holatini aniqlash",
                ys: "[Co(H₂O)₆]²⁺ — t₂g⁵ eg², n=3, μ = 4.7−5.2 μ<sub>B</sub> (kuchli orbital hissa)",
                qs: "[Co(CN)₆]⁴⁻ — t₂g⁶ eg¹, n=1, μ = 1.8−2.2 μ<sub>B</sub>",
                xulosa: "μ ≈ 5.0 (YS) va μ ≈ 2.0 (QS) — katta farq, ishonchli aniqlash. [Co(NH₃)₆]²⁺ — YS (μ ≈ 5.0), [Co(CN)₆]⁴⁻ — QS (μ ≈ 2.0).",
              },
              {
                ion: "Fe³⁺ (d⁵) — spin holatini aniqlash",
                ys: "[Fe(H₂O)₆]³⁺ — t₂g³ eg², n=5, μ = 5.8−5.95 μ<sub>B</sub> (A₁<sub>g</sub>)",
                qs: "[Fe(CN)₆]³⁻ — t₂g⁵ eg⁰, n=1, μ = 2.0−2.5 μ<sub>B</sub> (T₂<sub>g</sub>, orbital hissa bor)",
                xulosa: "μ ≈ 5.9 vs μ ≈ 2.3 — keskin farq. [Fe(CN)₆]³⁻ da orbital hissa tufayli μ spin-only 1.73 dan katta.",
              },
              {
                ion: "Mn³⁺ (d⁴) — kam uchraydigan QS",
                ys: "[Mn(H₂O)₆]³⁺ — t₂g³ eg¹, n=4, μ ≈ 4.8−5.0 μ<sub>B</sub> (Yan-Teller buzilgan)",
                qs: "[Mn(CN)₆]³⁻ — t₂g⁴ eg⁰, n=2, μ = 2.8−3.2 μ<sub>B</sub>",
                xulosa: "Mn³⁺ odatda YS, lekin CN⁻ bilan QS hosil qiladi. μ ≈ 4.9 (YS) vs μ ≈ 3.0 (QS) — ishonchli farq.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.ion}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-orange-400 font-semibold">YS:</span>
                    <p className="text-purple-200" dangerouslySetInnerHTML={{ __html: r.ys }}></p>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-semibold">QS:</span>
                    <p className="text-purple-200" dangerouslySetInnerHTML={{ __html: r.qs }}></p>
                  </div>
                  <p className="text-green-400 text-xs">📌 {r.xulosa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. HARORATGA BOG'LIQLIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌡️ Magnit xossalarining haroratga bog&apos;liqligi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Magnit sezgirlikning haroratga bog&apos;liqligi <strong className="text-yellow-400">magnit turini 
              aniqlashning asosiy diagnostik belgisidir</strong>. 1/χ vs T grafigi orqali moddaning 
              diamagnit, paramagnit, ferromagnit yoki antiferromagnit ekanligini aniqlash mumkin.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Magnit turi</th>
                <th className="py-3 px-4 text-purple-300">χ(T) bog&apos;liqlik</th>
                <th className="py-3 px-4 text-purple-300">1/χ vs T grafigi</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub>(T)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks misoli</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Diamagnit", "χ = const (&lt; 0)", "Gorizontal chiziq", "0", "[Co(NH₃)₆]³⁺"],
                  ["Ideal paramagnit", "χ = C/T", "Koordinata boshidan to&apos;g&apos;ri chiziq", "Const", "[Cr(H₂O)₆]³⁺ (suyultirilgan)"],
                  ["Paramagnit (Veys)", "χ = C/(T−θ)", "T o&apos;qini θ da kesadi", "Const", "[Cu₂(OAc)₄] (θ=−175 K)"],
                  ["Ferromagnit", "χ = C/(T−T<sub>C</sub>)", "T<sub>C</sub> da kesadi, yuqorida katta", "T ↓ da ortadi", "[Fe(Cp*)₂]⁺ (T<sub>C</sub>≈3 K)"],
                  ["Antiferromagnit", "χ = C/(T+θ)", "T<sub>N</sub> da maksimum", "T ↓ da kamayadi", "[Mn(acac)₃]₂ (dimer)"],
                  ["Spin-krossover", "Murakkab", "S-shaklli egri chiziq", "T da keskin o&apos;zgaradi", "[Fe(phen)₂(NCS)₂]"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Spin-krossover (SCO) hodisasi</h3>
            <p className="text-purple-200 text-sm">
              d⁴−d⁷ konfiguratsiyali ayrim komplekslarda (ayniqsa Fe²⁺, Fe³⁺, Co²⁺) harorat o&apos;zgarishi bilan 
              <strong>yuqori spin ↔ quyi spin o&apos;tishi</strong> kuzatiladi. Bu — <strong>spin-krossover (SCO)</strong>.
              Past haroratda — quyi spin (diamagnit yoki kuchsiz paramagnit), yuqori haroratda — yuqori spin.
              Misol: [Fe(phen)₂(NCS)₂] — 180 K da YS (μ≈5.3) dan QS (μ≈0) ga o&apos;tadi. 
              SCO materiallari <strong>molekulyar termometrlar va xotira qurilmalari</strong> uchun istiqbolli.
            </p>
          </div>
        </div>

        {/* ── 6. AMALIY DIAGNOSTIKA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Magnit diagnostika — kompleks tuzilishini aniqlash</h2>
          
          <div className="space-y-4">
            {[
              {
                masala: "Oksidlanish darajasini aniqlash",
                metod: "μ<sub>eff</sub> o&apos;lchanadi → n topiladi → d-elektronlar soni → oksidlanish darajasi.",
                misol: "Fe kompleksi: μ = 5.9 → n=5 → d⁵ → Fe³⁺. Agar μ ≈ 5.3 bo&apos;lsa → n=4 → d⁶ → Fe²⁺ (YS).",
              },
              {
                masala: "Geometriyani farqlash (O<sub>h</sub> vs T<sub>d</sub>)",
                metod: "Oktaedrik va tetraedrik komplekslarda orbital hissa turlicha. Co²⁺: O<sub>h</sub> da μ ≈ 4.7−5.2, T<sub>d</sub> da μ ≈ 4.3−4.8.",
                misol: "[Co(H₂O)₆]²⁺ (O<sub>h</sub>, pushti) μ ≈ 5.0; [CoCl₄]²⁻ (T<sub>d</sub>, ko&apos;k) μ ≈ 4.6. Farq ~0.4 μ<sub>B</sub>.",
              },
              {
                masala: "Ko&apos;p yadroli komplekslarni aniqlash",
                metod: "Xona haroratida μ<sub>eff</sub> spin-only dan kichik bo&apos;lsa — antiferromagnit almashinuv. Bu ko&apos;p yadrolilik belgisi.",
                misol: "[Cu₂(OAc)₄] — har bir Cu²⁺ uchun n=1, lekin μ<sub>eff</sub> ≈ 1.4 μ<sub>B</sub> (spin-only 1.73 dan kichik) — dimer.",
              },
              {
                masala: "Ligand maydon kuchini baholash",
                metod: "μ<sub>eff</sub> ning spin-only dan chetlanishi orbital hissa haqida, bu esa Δ<sub>o</sub> haqida ma&apos;lumot beradi.",
                misol: "Co²⁺: kuchsiz maydon (H₂O) — μ ≈ 5.0; kuchli maydon (CN⁻) — QS, μ ≈ 2.0. Oraliq maydon — oraliq μ.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.masala}</h3>
                <p className="text-purple-200 text-sm">{r.metod}</p>
                <p className="text-green-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Diamagnit:</strong> d⁰, d¹⁰, d⁶(QS), d⁴(QS), d⁸(kvadrat-planar) — n=0, μ=0</li>
            <li><strong className="text-yellow-400">Paramagnit:</strong> n≥1 — μ = 1.73−5.92 μ<sub>B</sub>, Kyuri qonuniga bo&apos;ysunadi</li>
            <li><strong className="text-yellow-400">Spin holatini aniqlash:</strong> YS va QS magnit momentlari keskin farq qiladi — ishonchli diagnostika</li>
            <li><strong className="text-yellow-400">Haroratga bog&apos;liqlik:</strong> 1/χ vs T grafigi magnit turini aniqlaydi, SCO hodisasi</li>
            <li><strong className="text-yellow-400">Magnit diagnostika:</strong> μ<sub>eff</sub> → oksidlanish darajasi, geometriya, ko&apos;p yadrolilik, ligand maydon kuchi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit/spin-orbit" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Spin-orbit bog&apos;lanish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/magnit/almashinuv" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Ko&apos;p yadroli komplekslar →
          </Link>
        </div>

      </section>
    </main>
  )
}