import Link from "next/link"

export default function Omillar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔬 Barqarorlikka ta&apos;sir qiluvchi omillar</h1>
          <p className="text-purple-400 text-sm">Metall ioni • Ligand tabiati • Sterik omillar • Erituvchi • pH • Termodinamik vs kinetik barqarorlik</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kompleks barqarorligiga ta&apos;sir qiluvchi omillar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks birikmaning barqarorligi <strong className="text-yellow-400">bir qancha omillar</strong> 
              bilan belgilanadi. Bu omillarni <strong>ikki katta guruhga</strong> bo&apos;lish mumkin:
              <strong className="text-yellow-400"> metall ioniga bog&apos;liq omillar</strong> (zaryad, radius, 
              elektron konfiguratsiya) va <strong className="text-yellow-400"> ligandga bog&apos;liq omillar</strong> 
              (asoslik, dentatlik, sterik omillar). Bundan tashqari, <strong>tashqi muhit omillari</strong> 
              (erituvchi, pH, ion kuchi, harorat) ham barqarorlikka sezilarli ta&apos;sir ko&apos;rsatadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Metall ioni</h3>
              <p className="text-purple-200 text-sm">Zaryad, radius, elektron tuzilish, KMBE, elektrmanfiylik</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ligand</h3>
              <p className="text-purple-200 text-sm">Asoslik, dentatlik, sterik hajm, donor atom turi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Tashqi muhit</h3>
              <p className="text-purple-200 text-sm">Erituvchi, pH, ion kuchi, harorat, bosim</p>
            </div>
          </div>
        </div>

        {/* ── 2. METALL IONI OMILLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Metall ioniga bog&apos;liq omillar</h2>
          
          <div className="space-y-4">
            {[
              {
                omil: "1. Ion zaryadi (z) va zaryad/radius nisbati (z/r)",
                izoh: "Metall ionining zaryadi qancha katta bo&apos;lsa, ligandlar bilan elektrostatik tortishish kuchi shuncha kuchli bo&apos;ladi. <strong>z/r nisbati</strong> — ion maydon kuchining o&apos;lchovi. Yuqori z/r → kuchli elektrostatik bog&apos; → yuqori barqarorlik. Misol: Fe³⁺ (z/r=46.5) komplekslari Fe²⁺ (z/r=25.6) dan 10³−10¹⁰ marta barqarorroq.",
                misol: "[Fe(EDTA)]⁻ (Fe³⁺): log K=25.1; [Fe(EDTA)]²⁻ (Fe²⁺): log K=14.3. Farq ~10¹¹ marta!",
              },
              {
                omil: "2. Ion radiusi",
                izoh: "Kichikroq ion — kuchliroq elektrostatik maydon — barqarorroq kompleks. Irving-Uilyams qatorining asosiy sabablaridan biri. Lantanoidlar qatorida ion radiusi kamayishi bilan barqarorlik ortadi (La³⁺ &lt; Ce³⁺ &lt; ... &lt; Lu³⁺).",
                misol: "Mg²⁺ (r=72 pm) komplekslari Ca²⁺ (r=100 pm) dan barqarorroq. [Mg(EDTA)]²⁻: log K=8.8; [Ca(EDTA)]²⁻: log K=10.7 (EDTA da sterik omil tufayli Ca barqarorroq — istisno).",
              },
              {
                omil: "3. Elektron konfiguratsiya va KMBE",
                izoh: "Oktaedrik maydonda KMBE qancha katta bo&apos;lsa, kompleks shuncha barqaror. d³ (Cr³⁺) va d⁸ (Ni²⁺) — eng yuqori KMBE. d⁵(YS) (Mn²⁺, Fe³⁺) va d¹⁰ (Zn²⁺) — KMBE=0, eng beqaror. Yan-Teller effekti qo&apos;shimcha barqarorlik beradi (Cu²⁺, Cr²⁺).",
                misol: "KMBE tartibi: Ni²⁺(1.2Δo) > Co²⁺(0.8Δo) > Fe²⁺(0.4Δo) > Mn²⁺(0). Barqarorlik ham shu tartibda: Irving-Uilyams qatori.",
              },
              {
                omil: "4. Elektrmanfiylik va kovalent bog&apos;lanish",
                izoh: "Metall ionining elektrmanfiyligi qancha yuqori bo&apos;lsa, ligand orbitallari bilan qoplashish shuncha yaxshi — kovalent bog&apos;lanish kuchli. Pauling shkalasi: Mn²⁺(1.55) &lt; Fe²⁺(1.83) &lt; Co²⁺(1.88) &lt; Ni²⁺(1.91) &lt; Cu²⁺(2.00). Yumshoq kislotalar (Cu⁺, Ag⁺, Hg²⁺) yumshoq asoslar (S²⁻, I⁻) bilan kuchli kovalent bog&apos; hosil qiladi.",
                misol: "Hg²⁺ (yumshoq kislota) + I⁻ (yumshoq asos): [HgI₄]²⁻ log β₄=29.8. Hg²⁺ + F⁻ (qattiq asos): [HgF]⁺ log K₁=1.0. Farq ~10²⁹ marta!",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. LIGAND OMILLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Ligandga bog&apos;liq omillar</h2>
          
          <div className="space-y-4">
            {[
              {
                omil: "1. Ligand asosligi (pK<sub>b</sub>)",
                izoh: "Ligand qancha kuchli asos bo&apos;lsa (pK<sub>b</sub> kichik), metall ioni bilan shuncha kuchli bog&apos;lanadi. Bu — <strong>Bronsted-Lourie asosligi va Lyuis asosligi orasidagi korrelyatsiya</strong>. N-donor ligandlar odatda O-donorlardan kuchliroq asos va yaxshiroq ligand. NH₃ (pK<sub>b</sub>=4.75) H₂O (pK<sub>b</sub>=15.7) dan kuchliroq ligand.",
                misol: "[Ni(NH₃)₆]²⁺: log β₆=8.7; [Ni(H₂O)₆]²⁺: log β₁≈0.6. NH₃ komplekslari suvli komplekslardan ancha barqaror.",
              },
              {
                omil: "2. Dentatlik (xelat effekti)",
                izoh: "Polidentat ligandlar monodentat analoglaridan ancha barqarorroq kompleks hosil qiladi. Dentatlik ortishi bilan barqarorlik keskin oshadi: monodentat &lt; bidentat &lt; tridentat &lt; tetradentat &lt; ... &lt; geksadentat. Asosiy sabab — entropik omil (desolvatatsiya).",
                misol: "Ni²⁺ bilan: 6NH₃ (log β=8.7) &lt; 3en (log β=18.3) &lt; EDTA (log K=18.6). EDTA bir molekulasi 6 ta NH₃ dan 10¹⁰ marta barqarorroq!",
              },
              {
                omil: "3. Donor atom tabiati",
                izoh: "Donor atomning elektrmanfiyligi va qutblanuvchanligi kompleks barqarorligini belgilaydi. Yumshoq donor atomlar (S, P, As, I⁻) yumshoq metallar bilan, qattiq donor atomlar (O, N, F⁻) qattiq metallar bilan barqaror kompleks hosil qiladi (HSAB prinsipi).",
                misol: "Ag⁺ (yumshoq kislota): barqarorlik I⁻ &gt; Br⁻ &gt; Cl⁻ &gt; F⁻. Al³⁺ (qattiq kislota): barqarorlik F⁻ &gt; Cl⁻ &gt; Br⁻ &gt; I⁻ (teskari tartib!).",
              },
              {
                omil: "4. Sterik omillar",
                izoh: "Katta hajmli ligandlar (tret-butil, fenil guruhlari) metall ioni atrofida fazoviy to&apos;siq yaratadi. Bu <strong>koordinatsion sonni cheklaydi</strong> va barqarorlikni pasaytiradi. Sterik to&apos;siq ayniqsa kichik ionlar (Ni²⁺, Cu²⁺) uchun sezilarli.",
                misol: "Ni²⁺ + NH₃ → [Ni(NH₃)₆]²⁺ (KS=6). Ni²⁺ + N(tret-Bu)₃ → kompleks hosil bo&apos;lmaydi (juda katta hajmli ligand).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. TASHQI MUHIT OMILLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 Tashqi muhit omillari</h2>
          
          <div className="space-y-4">
            {[
              {
                omil: "1. Erituvchi tabiati",
                izoh: "Erituvchining dielektrik o&apos;tkazuvchanligi, solvatatsiya qobiliyati va donor soni kompleks barqarorligiga ta&apos;sir qiladi. Suvda (ε=78.5) ion bog&apos;lanishli komplekslar beqarorroq (kuchli solvatatsiya), organik erituvchilarda (ε kichik) barqarorroq. Erituvchi o&apos;zi ham ligand sifatida raqobatlashishi mumkin.",
                misol: "[Fe(phen)₃]²⁺ suvda log β=21.3, atsetonda log β≈25 (suvning raqobatli ligandligi yo&apos;qligi tufayli).",
              },
              {
                omil: "2. pH va gidroliz",
                izoh: "pH kompleks barqarorligiga <strong>ikki yo&apos;l bilan</strong> ta&apos;sir qiladi: 1) ligand protonlanadi (asoslik xossasi yo&apos;qoladi); 2) metall ioni gidrolizlanadi (gidroksokomplekslar hosil bo&apos;ladi). Past pH da ligand protonlanadi — kompleks beqarorlashadi. Yuqori pH da metall gidroksid cho&apos;kmasi tushishi mumkin.",
                misol: "EDTA bilan titrlash optimal pH=10 da olib boriladi (NH₃/NH₄Cl bufer). pH&lt;7 da EDTA protonlanadi, pH&gt;12 da metall gidroksidlari cho&apos;kadi.",
              },
              {
                omil: "3. Ion kuchi",
                izoh: "Eritmaning ion kuchi oshishi bilan <strong>faollik koeffitsiyentlari</strong> o&apos;zgaradi. Yuqori ion kuchida ionlar orasidagi elektrostatik ta&apos;sirlar kuchayadi. Odatda ion kuchi oshishi bilan zaryadlangan zarralar orasidagi reaksiyalarda barqarorlik konstantasi kamayadi.",
                misol: "Fe³⁺ + SCN⁻ ⇌ [Fe(SCN)]²⁺. Ion kuchi 0 dan 1 M gacha oshganda K<sub>stab</sub> ~20% ga kamayadi.",
              },
              {
                omil: "4. Harorat",
                izoh: "Ko&apos;pchilik kompleks hosil bo&apos;lish reaksiyalari ekzotermik (ΔH&lt;0) — harorat oshishi bilan barqarorlik kamayadi (Le-Shatele prinsipi). Van&apos;t-Goff tenglamasi orqali harorat ta&apos;siri miqdoriy baholanadi. Ayrim hollarda ΔH&gt;0 — harorat oshishi barqarorlikni oshiradi.",
                misol: "[CoCl₄]²⁻ (tetraedrik): ΔH&gt;0, harorat oshishi bilan ko&apos;k rang kuchayadi (kompleks barqarorligi ortadi).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. TERMODINAMIK VS KINETIK BARQARORLIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚖️ Termodinamik vs kinetik barqarorlik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Termodinamik barqarorlik</strong> va 
              <strong className="text-yellow-400"> kinetik barqarorlik (inertlik/labillik)</strong> — 
              <strong> bir-biridan mustaqil tushunchalar</strong>! Termodinamik barqaror kompleks 
              kinetik labil bo&apos;lishi mumkin va aksincha. Termodinamika <strong>muvozanat holatini</strong>, 
              kinetika esa <strong>muvozanatga erishish tezligini</strong> belgilaydi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Termodinamik barqarorlik</th>
                <th className="py-3 px-4 text-purple-300">Kinetik barqarorlik</th>
                <th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Co(NH₃)₆]³⁺", "Juda yuqori (log β=35)", "Inert (t₁/₂≈kunlar)", "Termodinamik+kinetik barqaror"],
                  ["[Ni(CN)₄]²⁻", "Juda yuqori (log β=30)", "Labil (tez almashadi)", "Termodinamik barqaror, kinetik labil!"],
                  ["[Fe(H₂O)₆]³⁺", "O&apos;rtacha (log β≈11)", "Labil (juda tez)", "Termodinamik o&apos;rtacha, kinetik labil"],
                  ["[Cr(H₂O)₆]³⁺", "O&apos;rtacha (log β≈10)", "Inert (t₁/₂≈soatlar)", "Termodinamik o&apos;rtacha, kinetik inert!"],
                  ["[Hg(CN)₄]²⁻", "Ekstremal (log β=41.5)", "Labil (juda tez)", "Termodinamik ekstremal, kinetik labil"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Kinetik inertlik sabablari</h3>
            <p className="text-purple-200 text-sm">
              <strong>1. Katta KMBE:</strong> d³ (Cr³⁺) va quyi spinli d⁶ (Co³⁺) — yuqori KMBE, ligand almashinishi sekin.<br/>
              <strong>2. Katta Δ<sub>o</sub>:</strong> kuchli maydonli ligandlar (CN⁻, CO) — aktivatsiya energiyasi yuqori.<br/>
              <strong>3. Sterik to&apos;siq:</strong> katta hajmli ligandlar — almashinish mexanizmiga to&apos;sqinlik qiladi.<br/>
              <strong>4. Elektron konfiguratsiya:</strong> d⁸ kvadrat-planar (Pt²⁺) — aksial hujum bloklangan.
            </p>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-yellow-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Metall ioni:</strong> yuqori zaryad, kichik radius, yuqori KMBE, yuqori elektrmanfiylik → barqaror kompleks</li>
            <li><strong className="text-yellow-400">Ligand:</strong> kuchli asos, yuqori dentatlik, optimal donor atom, kichik sterik hajm → barqaror kompleks</li>
            <li><strong className="text-yellow-400">Erituvchi:</strong> kichik ε, past solvatatsiya, raqobatli ligandlik yo&apos;q → barqaror kompleks</li>
            <li><strong className="text-yellow-400">pH:</strong> optimal pH oralig&apos;i — ligand protonlanmaydi, metall gidrolizlanmaydi</li>
            <li><strong className="text-yellow-400">Termodinamik ≠ Kinetik:</strong> barqaror kompleks labil bo&apos;lishi mumkin ([Ni(CN)₄]²⁻) va aksincha ([Cr(H₂O)₆]³⁺)</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika/xelat-effekti" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Xelat effekti
          </Link>
          <Link href="/ilmiy/chuqurlashgan/termodinamika/bashorat" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            Barqarorlikni bashorat qilish →
          </Link>
        </div>

      </section>
    </main>
  )
}