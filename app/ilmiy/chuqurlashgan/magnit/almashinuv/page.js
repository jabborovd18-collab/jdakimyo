import Link from "next/link"

export default function Almashinuv() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-red-400">🔴 Ko&apos;p yadroli komplekslar magnit xossalari</h1>
          <p className="text-purple-400 text-sm">Almashinuv ta&apos;siri (J) • Ferromagnit va antiferromagnit juftliklar • [Cu₂(OAc)₄] • Magnit tartiblanish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ko&apos;p yadroli komplekslarda magnit almashinuv</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ko&apos;p yadroli komplekslar</strong> — ikki yoki undan ortiq metall 
              ionlarini o&apos;z ichiga olgan kompleks birikmalar. Metall ionlari orasidagi 
              <strong className="text-yellow-400"> magnit almashinuv ta&apos;siri (J)</strong> ularning spinlarini 
              parallel (ferromagnit) yoki antiparallel (antiferromagnit) yo&apos;nalishiga olib keladi.
              Almashinuv ta&apos;siri <strong>ko&apos;prik ligandlar</strong> orqali amalga oshadi va 
              <strong> Geyzenberg-Dirak-van Vlek (HDVV) modeli</strong> bilan tavsiflanadi.
              Ko&apos;p yadroli komplekslarning magnit xossalari <strong>yagona molekula magnitlari (SMM)</strong>,
              <strong> molekulyar magnitlar</strong> va <strong>katalizatorlar</strong> uchun fundamental ahamiyatga ega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geyzenberg-Dirak-van Vlek Hamiltoniani</h3>
              <p className="text-purple-200 text-sm">
                <strong>Ĥ = −2J Ŝ₁·Ŝ₂</strong><br/>
                <strong>J &gt; 0:</strong> ferromagnit almashinuv — spinlar parallel<br/>
                <strong>J &lt; 0:</strong> antiferromagnit almashinuv — spinlar antiparallel<br/>
                <strong>J = 0:</strong> almashinuv yo&apos;q — mustaqil paramagnit ionlar<br/>
                J qiymati <strong>ko&apos;prik tabiati, metall-ligand burchagi, masofa</strong>ga bog&apos;liq
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Almashinuv mexanizmlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>To&apos;g&apos;ridan almashinuv:</strong> metall orbitallari bevosita qoplashadi (kam uchraydi)<br/>
                <strong>O&apos;ta almashinuv:</strong> ko&apos;prik ligand orbitallari orqali (eng keng tarqalgan)<br/>
                <strong>Dipolyar almashinuv:</strong> magnit dipol-dipol ta&apos;sir (kuchsiz, uzoq masofali)<br/>
                <strong>Er-xotin almashinuv:</strong> aralash valentli sistemalarda
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. IKKI YADROLI KOMPLEKSLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Ikki yadroli komplekslar va Bleaney-Bauers tenglamasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ikki yadroli kompleks</strong> — eng oddiy ko&apos;p yadroli sistema.
              Har bir metall ioni S₁ va S₂ spinlarga ega. Almashinuv ta&apos;siri natijasida umumiy spin 
              <strong> S<sub>T</sub> qiymatlari</strong> S₁+S₂ dan |S₁−S₂| gacha bo&apos;ladi.
              Magnit sezgirlikning haroratga bog&apos;liqligi <strong>Bleaney-Bauers tenglamasi</strong> bilan ifodalanadi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Bleaney-Bauers tenglamasi (S₁ = S₂ = ½ uchun):
            </p>
            <p className="text-purple-200 text-sm mt-2">
              χ<sub>M</sub> = (2Ng²μ<sub>B</sub>² / kT) × [3 + exp(−2J/kT)]⁻¹ + TIP
            </p>
            <p className="text-purple-400 text-xs mt-1">
              TIP — haroratga bog&apos;liq bo&apos;lmagan paramagnetizm
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">Metall ionlari</th>
                <th className="py-3 px-4 text-purple-300">S₁, S₂</th>
                <th className="py-3 px-4 text-purple-300">J (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Almashinuv turi</th>
                <th className="py-3 px-4 text-purple-300">μ<sub>eff</sub> (300 K)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Cu₂(OAc)₄(H₂O)₂]", "Cu²⁺−Cu²⁺", "½, ½", "−148", "Kuchli AF", "1.4"],
                  ["[Cr₂O(OAc)₆(H₂O)₃]⁺", "Cr³⁺−Cr³⁺", "3/2, 3/2", "−30", "AF", "~3.5"],
                  ["[Fe₂OCl₆]²⁻", "Fe³⁺−Fe³⁺", "5/2, 5/2", "−108", "Kuchli AF", "~2.0"],
                  ["[Mn₂O₂(bpy)₄]⁴⁺", "Mn³⁺−Mn⁴⁺", "2, 3/2", "−72", "AF", "~3.8"],
                  ["[Cu₂(OH)₂(tmen)₂]²⁺", "Cu²⁺−Cu²⁺", "½, ½", "+104", "Ferromagnit", "1.9"],
                  ["[VO(acac)₂]₂O", "V⁴⁺−V⁴⁺", "½, ½", "−130", "Kuchli AF", "0.8"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 font-semibold">
                      {r[3].startsWith("−") || r[3].startsWith("-") 
                        ? <span className="text-blue-400">{r[3]}</span> 
                        : <span className="text-red-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {r[4].includes("AF") 
                        ? <span className="text-blue-400">{r[4]}</span> 
                        : <span className="text-red-400">{r[4]}</span>}
                    </td>
                    <td className="py-3 px-4 text-cyan-400">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. [Cu₂(OAc)₄] — KLASSIK MISOL ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 [Cu₂(OAc)₄(H₂O)₂] — klassik antiferromagnit dimer</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Mis(II) atsetat dimeri</strong> — ko&apos;p yadroli komplekslar 
              magnit kimyosining <strong>eng mashhur va eng ko&apos;p o&apos;rganilgan namunasidir</strong>.
              Ikki Cu²⁺ ioni 4 ta atsetat ko&apos;prigi orqali bog&apos;langan. Cu−Cu masofasi ≈ 2.64 Å.
              Har bir Cu²⁺ (d⁹, S=½) — bitta juftlanmagan elektron. Kuchli antiferromagnit almashinuv (J = −148 cm⁻¹)
              natijasida <strong>asosiy holat singlet (S<sub>T</sub>=0)</strong>, qo&apos;zg&apos;algan holat triplet (S<sub>T</sub>=1).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Strukturaviy xususiyatlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>&quot;Xitoy fonari&quot; strukturasi.</strong><br/>
                • 4 ta atsetat ko&apos;prigi — σ va π yo&apos;llar<br/>
                • Cu−Cu = 2.64 Å (to&apos;g&apos;ridan bog&apos; yo&apos;q)<br/>
                • Aksial pozitsiyalarda H₂O molekulalari<br/>
                • Cu−O(ekv) ≈ 1.97 Å, Cu−O(aks) ≈ 2.16 Å<br/>
                • Har bir Cu — kvadrat-piramidal geometriya
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Magnit xossalari</h3>
              <p className="text-purple-200 text-sm">
                <strong>J = −148 cm⁻¹ (kuchli AF).</strong><br/>
                • Singlet-triplet ajralishi: ΔE = 2|J| ≈ 296 cm⁻¹<br/>
                • Xona haroratida (kT ≈ 207 cm⁻¹): qisman triplet<br/>
                • μ<sub>eff</sub>(300 K) ≈ 1.4 μ<sub>B</sub> (har Cu uchun)<br/>
                • 77 K da: μ<sub>eff</sub> ≈ 0.5 μ<sub>B</sub> (asosan singlet)<br/>
                • T → 0 da: μ<sub>eff</sub> → 0 (faqat singlet)
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-2">Nima uchun antiferromagnit?</h3>
            <p className="text-purple-200 text-sm">
              Ikki Cu²⁺ ionining dx²−y² orbitallari <strong>atsetat ko&apos;prigi orqali &quot;o&apos;ta almashinuv&quot;</strong> 
              mexanizmi bilan ta&apos;sirlashadi. Ko&apos;prik kislorod atomlarining p-orbitallari orqali 
              <strong>antiferromagnit almashinuv yo&apos;li</strong> hosil bo&apos;ladi. 
              Gudenaф-Kanamori qoidalariga ko&apos;ra: Cu−O−Cu burchagi 90° bo&apos;lsa — ferromagnit, 
              180° bo&apos;lsa — antiferromagnit almashinuv kutiladi. [Cu₂(OAc)₄] da Cu−O−Cu burchagi 
              ~120° — kuchli antiferromagnit almashinuv.
            </p>
          </div>
        </div>

        {/* ── 4. GUDENAF-KANAMORI QOIDALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Gudenaф-Kanamori qoidalari — almashinuv ishorasini bashorat qilish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Gudenaф-Kanamori (GK) qoidalari</strong> — ko&apos;prikli 
              ikki yadroli komplekslarda almashinuv ta&apos;sirining ishorasini 
              <strong> metall-ligand orbitallarining qoplashish simmetriyasiga</strong> qarab bashorat qilish 
              imkonini beradi. Bu qoidalar <strong>o&apos;ta almashinuv mexanizmi</strong> uchun asosiy 
              nazariy asos hisoblanadi. J musbat bo&apos;lsa ferromagnit, J manfiy bo&apos;lsa antiferromagnit almashinuv.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qoida: "1-qoida: Orbital qoplashish burchagi",
                izoh: "Agar metall ionlarining magnit orbitallari (juftlanmagan elektron joylashgan orbitallar) ko&apos;prik ligand orbitallari bilan <strong>to&apos;g&apos;ridan-to&apos;g&apos;ri qoplashsa</strong> (M−L−M burchagi ≈ 180°) — <strong>kuchli antiferromagnit</strong> almashinuv. Sababi: kuchli qoplashish → katta energiya ajralishi → antiparallel spinlar energetik qulay.",
              },
              {
                qoida: "2-qoida: Ortogonal orbitallar",
                izoh: "Agar magnit orbitallar ko&apos;prik ligand orbitallari bilan <strong>ortogonal bo&apos;lsa</strong> (qoplashish nolga teng, M−L−M burchagi ≈ 90°) — <strong>ferromagnit</strong> almashinuv. Sababi: Hund qoidasiga ko&apos;ra parallel spinlar energetik qulayroq.",
              },
              {
                qoida: "3-qoida: Turli simmetriyali orbitallar",
                izoh: "Agar ikki metall ioni <strong>turli simmetriyali magnit orbitallarga</strong> ega bo&apos;lsa (masalan, biri dx²−y², ikkinchisi dz²), ular orasidagi almashinuv <strong>ferromagnit</strong> bo&apos;lishi mumkin. Bu — &quot;qat&apos;iy ortogonallik&quot; prinsipi.",
              },
              {
                qoida: "4-qoida: Ko&apos;prik soni va turi",
                izoh: "Ko&apos;priklar soni ortishi bilan |J| ortadi. Ikki karra ko&apos;prik (2 ta OH⁻) bitta ko&apos;prikdan kuchliroq almashinuv beradi. Ko&apos;prik atomining elektrmanfiyligi ortishi bilan |J| odatda kamayadi: O²⁻ &gt; OH⁻ &gt; Cl⁻ &gt; Br⁻.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qoida}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>

          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-red-400 font-bold mb-2">Misol: Cu−O−Cu burchagi ta&apos;siri</h3>
            <p className="text-purple-200 text-sm">
              • <strong>θ = 180°:</strong> dx²−y² orbitallar O p-orbitallari orqali kuchli qoplashadi → AF, J ≈ −500 cm⁻¹ gacha<br/>
              • <strong>θ = 120°:</strong> qoplashish o&apos;rtacha → AF, J ≈ −100 − −200 cm⁻¹<br/>
              • <strong>θ = 90°:</strong> dx²−y² orbitallar O ning turli p-orbitallari bilan qoplashadi, ortogonal → FM, J ≈ +50 − +150 cm⁻¹<br/>
              [Cu₂(OAc)₄] da Cu−O−Cu ≈ 120° — kuchli AF (J = −148 cm⁻¹)
            </p>
          </div>
        </div>

        {/* ── 5. MAGNIT TARTIBLANISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 Ko&apos;p yadroli komplekslarda magnit tartiblanish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Ko&apos;p yadroli komplekslarda (3 va undan ortiq metall ioni) <strong className="text-yellow-400">murakkab magnit 
              tartiblanish</strong> kuzatilishi mumkin. Metall ionlarining spinlari fazoda muntazam joylashib,
              <strong>ferromagnit, antiferromagnit, ferrimagnit</strong> yoki <strong>spiral tartiblanish</strong> hosil qiladi.
              Bu xossalar <strong>yagona molekula magnitlari (SMM)</strong> va <strong>yagona zanjir magnitlari (SCM)</strong> 
              uchun asos bo&apos;lib xizmat qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                tur: "Yagona molekula magnitlari (SMM)",
                izoh: "Ko&apos;p yadroli kompleks (Mn₁₂, Fe₈, Mn₄, Dy₃) past haroratda tashqi maydonsiz magnitlanishni saqlaydi. Asosiy shart: <strong>katta asosiy spin (S)</strong> va <strong>kuchli magnit anizotropiya (D manfiy)</strong>. Magnitlanish relaksatsiyasi sekin — molekulyar darajadagi xotira effekti.",
                misol: "[Mn₁₂O₁₂(OAc)₁₆(H₂O)₄] (Mn12-ac) — S=10, D=−0.5 cm⁻¹. Bloklash harorati ~3 K.",
              },
              {
                tur: "Ferromagnit zanjirlar (SCM)",
                izoh: "Bir o&apos;lchovli zanjirli komplekslarda metall ionlari orasidagi ferromagnit almashinuv zanjir bo&apos;ylab spinlarning parallel joylashishiga olib keladi. Past haroratda zanjir &quot;yagona katta spin&quot; kabi harakat qiladi.",
                misol: "[Co(hfac)₂(NITPhOMe)] — Co²⁺ radikal zanjiri, ferromagnit, T<sub>C</sub> ≈ 5 K.",
              },
              {
                tur: "Ferrimagnit tartiblanish",
                izoh: "Ikki xil metall ioni (yoki metall+radikal) turli spin qiymatlarga ega bo&apos;lib, AF almashinuv natijasida spinlar to&apos;liq kompensatsiyalanmaydi — natijaviy magnit moment noldan farqli.",
                misol: "[MnCu(pba)(H₂O)₃] — Mn²⁺ (S=5/2) va Cu²⁺ (S=1/2) AF almashinuvi, S<sub>natija</sub>=2.",
              },
              {
                tur: "Spiral va murakkab tartiblanish",
                izoh: "Raqobatlashuvchi almashinuv ta&apos;sirlari (J₁, J₂ har xil ishorali) natijasida spinlar spiral yoki murakkab periodik tuzilmalar hosil qilishi mumkin. Bunday sistemalar <strong>multiferroiklar</strong> va <strong>skyrmionlar</strong> uchun asos.",
                misol: "[Fe₃O(O₂CPh)₆(H₂O)₃] — uchburchak Fe³⁺, spin frustratsiyasi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.tur}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-green-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. J ANIQLASH USULLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 Almashinuv parametri J ni eksperimental aniqlash</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "1. Magnit sezgirlikdan (χ<sub>M</sub> vs T)",
                izoh: "Eng keng tarqalgan usul. χ<sub>M</sub>(T) bog&apos;liqlik o&apos;lchanadi va Bleaney-Bauers (yoki uning umumlashgan) tenglamasiga fit qilinadi. Fit parametrlari: J, g, TIP. Fit sifati R-factor bilan baholanadi. Harorat diapazoni qancha keng bo&apos;lsa, J shuncha aniq topiladi.",
              },
              {
                usul: "2. Magnitlanishdan (M vs H)",
                izoh: "Past haroratda (2−10 K) magnitlanishning maydonga bog&apos;liqligi o&apos;lchanadi. M(H) egri chizig&apos;i Brilluen funksiyasiga fit qilinadi. To&apos;yingan magnitlanish qiymati asosiy spin S<sub>T</sub> ni beradi. S<sub>T</sub> orqali J aniqlanadi.",
              },
              {
                usul: "3. EPR spektroskopiyadan",
                izoh: "Ikki yadroli komplekslarda EPR spektrida almashinuv ta&apos;siri tufayli <strong>nozik struktura</strong> kuzatiladi. Singlet-triplet ajralishi (D, E parametrlari) va gipernozik struktura orqali J hisoblanadi. Bu usul, ayniqsa, kuchsiz almashinuvli sistemalar uchun sezgir.",
              },
              {
                usul: "4. DFT hisoblashlar (nazariy)",
                izoh: "Zichlik funksionali nazariyasi (DFT) yordamida &quot;buzilgan simmetriya&quot; (broken symmetry) yondashuvi bilan J hisoblanadi. J = (E<sub>BS</sub> − E<sub>HS</sub>)/(2S₁S₂). Zamonaviy funksionallar (B3LYP, PBE0) bilan xatolik ±20−30% atrofida.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-red-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Almashinuv ta&apos;siri J:</strong> J &gt; 0 — ferromagnit, J &lt; 0 — antiferromagnit. Ĥ = −2J Ŝ₁·Ŝ₂</li>
            <li><strong className="text-yellow-400">[Cu₂(OAc)₄]:</strong> klassik AF dimer, J = −148 cm⁻¹, &quot;xitoy fonari&quot; strukturasi</li>
            <li><strong className="text-yellow-400">Gudenaф-Kanamori qoidalari:</strong> M−L−M burchagi ~180° → AF; ~90° → FM</li>
            <li><strong className="text-yellow-400">SMM:</strong> katta S + magnit anizotropiya (D manfiy) — molekulyar xotira effekti</li>
            <li><strong className="text-yellow-400">J ni aniqlash:</strong> χ(T) fit, M(H), EPR, DFT hisoblashlar</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit/dia-paramagnit" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Dia/paramagnit komplekslar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/magnit/hisoblash" className="px-6 py-3 bg-red-600/80 rounded-xl hover:bg-red-500 text-white font-semibold transition-all">
            Magnit ma&apos;lumotlardan tahlil →
          </Link>
        </div>

      </section>
    </main>
  )
}