import Link from "next/link"

export default function NuqtaliGuruhlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🏷️ Nuqtali guruhlar</h1>
          <p className="text-purple-400 text-sm">Schoenflies belgilari • O<sub>h</sub>, T<sub>d</sub>, D<sub>4h</sub>, D<sub>3h</sub> • Guruhni aniqlash algoritmi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Nuqtali guruhlar — simmetriya klassifikatsiyasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Nuqtali guruh</strong> — molekulaning barcha simmetriya 
              amallarining matematik to&apos;plami. &quot;Nuqtali&quot; deyilishining sababi — 
              barcha simmetriya elementlari <strong>kamida bitta nuqtada kesishadi</strong> 
              (molekulaning massa markazi). Kompleks birikmalar uchun 
              <strong className="text-yellow-400"> eng muhim 6 ta nuqtali guruh</strong> mavjud:
              O<sub>h</sub>, T<sub>d</sub>, D<sub>4h</sub>, D<sub>3h</sub>, C<sub>4v</sub>, C<sub>2v</sub>.
              Schoenflies belgilari — nemis matematigi Artur Schoenflies tomonidan taklif qilingan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">C — siklik</h3>
              <p className="text-purple-200 text-sm">Faqat C<sub>n</sub> o&apos;qi bor</p>
              <p className="text-purple-400 text-xs mt-1">C<sub>2v</sub>, C<sub>3v</sub>, C<sub>4v</sub></p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">D — diedral</h3>
              <p className="text-purple-200 text-sm">C<sub>n</sub> + n ta C<sub>2</sub> ⊥</p>
              <p className="text-purple-400 text-xs mt-1">D<sub>3h</sub>, D<sub>4h</sub>, D<sub>6h</sub></p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Maxsus guruhlar</h3>
              <p className="text-purple-200 text-sm">Yuqori simmetriyali</p>
              <p className="text-purple-400 text-xs mt-1">O<sub>h</sub>, T<sub>d</sub>, I<sub>h</sub></p>
            </div>
          </div>
        </div>

        {/* ── 2. KOMPLEKSLAR UCHUN ASOSIY GURUHLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Kompleks birikmalar uchun eng muhim nuqtali guruhlar</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Guruh</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">KS</th>
                <th className="py-3 px-4 text-purple-300">Asosiy elementlar</th>
                <th className="py-3 px-4 text-purple-300">Inversiya markazi</th>
                <th className="py-3 px-4 text-purple-300">Kompleks misoli</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["O<sub>h</sub>", "Oktaedrik", "6", "3C₄, 4C₃, 6C₂, i, 3σ<sub>h</sub>, 6σ<sub>d</sub>", "Ha", "[Co(NH₃)₆]³⁺"],
                  ["T<sub>d</sub>", "Tetraedrik", "4", "4C₃, 3S₄, 6σ<sub>d</sub>", "Yo&apos;q", "[CoCl₄]²⁻"],
                  ["D<sub>4h</sub>", "Kvadrat-planar", "4", "C₄, 4C₂, i, σ<sub>h</sub>, 2σ<sub>v</sub>, 2σ<sub>d</sub>", "Ha", "[PtCl₄]²⁻"],
                  ["D<sub>3h</sub>", "Trigonal-bipiramida", "5", "C₃, 3C₂, σ<sub>h</sub>, 3σ<sub>v</sub>", "Yo&apos;q", "[Fe(CO)₅]"],
                  ["C<sub>4v</sub>", "Kvadrat-piramida", "5", "C₄, 4σ<sub>v</sub>", "Yo&apos;q", "[VO(acac)₂]"],
                  ["C<sub>2v</sub>", "Burchakli", "4", "C₂, 2σ<sub>v</sub>", "Yo&apos;q", "cis-[Pt(NH₃)₂Cl₂]"],
                  ["C<sub>3v</sub>", "Trigonal-piramida", "4", "C₃, 3σ<sub>v</sub>", "Yo&apos;q", "[NH₄]⁺ (erkin)"],
                  ["D<sub>5d</sub>", "Sendvich (staggered)", "6", "C₅, 5C₂, i, S₁₀", "Ha", "[Fe(Cp)₂]"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }}></td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4">
                      {r[4] === "Ha" ? <span className="text-green-400">✓ Ha</span> : <span className="text-red-400">✗ Yo&apos;q</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. O<sub>h</sub> GURUH TAHLILI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 O<sub>h</sub> — oktaedrik guruh (eng muhim)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">O<sub>h</sub></strong> — kompleks birikmalar kimyosidagi 
              <strong> eng muhim nuqtali guruh</strong>. Barcha muntazam oktaedrik komplekslar 
              ([ML₆] tipidagi) O<sub>h</sub> guruhiga kiradi. Guruh <strong>48 ta simmetriya amalini</strong> 
              o&apos;z ichiga oladi — bu eng katta nuqtali guruhlardan biri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari (48 amal)</h3>
              <p className="text-purple-200 text-sm">
                <strong>E:</strong> 1 ta (identifikatsiya)<br/>
                <strong>C₃:</strong> 8 ta (4 o&apos;q × 2 amal)<br/>
                <strong>C₄:</strong> 6 ta (3 o&apos;q × 1 amal C₄¹, C₄³)<br/>
                <strong>C₂:</strong> 6 ta (C₄² = C₂ — 3 ta; qo&apos;shimcha 6 ta C₂)<br/>
                <strong>i:</strong> 1 ta (inversiya)<br/>
                <strong>S₄:</strong> 6 ta (3 o&apos;q × 2)<br/>
                <strong>S₆:</strong> 8 ta (4 o&apos;q × 2)<br/>
                <strong>σ<sub>h</sub>:</strong> 3 ta<br/>
                <strong>σ<sub>d</sub>:</strong> 6 ta
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kompleks misollari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Geksaamminlar:</strong> [Co(NH₃)₆]³⁺, [Cr(NH₃)₆]³⁺<br/>
                <strong>Geksaakvalar:</strong> [Ni(H₂O)₆]²⁺, [Fe(H₂O)₆]²⁺<br/>
                <strong>Sianidlar:</strong> [Fe(CN)₆]⁴⁻, [Cr(CN)₆]³⁻<br/>
                <strong>Galogenidlar:</strong> [PtCl₆]²⁻, [IrCl₆]²⁻<br/>
                <strong>Shart:</strong> barcha 6 ta ligand bir xil bo&apos;lishi kerak
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-yellow-400 font-bold mb-2">O<sub>h</sub> ning past simmetriyali hosilalari</h3>
            <p className="text-purple-200 text-sm">
              Agar ligandlar bir xil bo&apos;lmasa, simmetriya pasayadi:<br/>
              • [ML₅X] — C<sub>4v</sub> (48 → 8 amal)<br/>
              • trans-[ML₄X₂] — D<sub>4h</sub> (48 → 16 amal)<br/>
              • cis-[ML₄X₂] — C<sub>2v</sub> (48 → 4 amal)<br/>
              • fac-[ML₃X₃] — C<sub>3v</sub> (48 → 6 amal)<br/>
              • mer-[ML₃X₃] — C<sub>2v</sub> (48 → 4 amal)
            </p>
          </div>
        </div>

        {/* ── 4. T<sub>d</sub> GURUH TAHLILI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 T<sub>d</sub> — tetraedrik guruh</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">T<sub>d</sub></strong> — tetraedrik komplekslarning nuqtali guruhi.
              <strong> 24 ta simmetriya amalini</strong> o&apos;z ichiga oladi. 
              <strong className="text-red-400">Inversiya markazi YO&apos;Q!</strong> — 
              bu tetraedrik va oktaedrik komplekslarni farqlashning eng muhim simmetriya belgisidir.
              T<sub>d</sub> guruhi O<sub>h</sub> ning ichki guruhi (pastki guruhi) hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari (24 amal)</h3>
              <p className="text-purple-200 text-sm">
                <strong>E:</strong> 1 ta<br/>
                <strong>C₃:</strong> 8 ta (4 o&apos;q × 2)<br/>
                <strong>C₂:</strong> 3 ta (S₄² = C₂)<br/>
                <strong>S₄:</strong> 6 ta (3 o&apos;q × 2)<br/>
                <strong>σ<sub>d</sub>:</strong> 6 ta<br/>
                <strong>i:</strong> YO&apos;Q!<br/>
                <strong>C₄:</strong> YO&apos;Q! (S₄ bor, lekin C₄ yo&apos;q)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kompleks misollari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tetragalogenidlar:</strong> [CoCl₄]²⁻, [FeCl₄]⁻<br/>
                <strong>Tetrakarbonil:</strong> [Ni(CO)₄]<br/>
                <strong>Tetraamminlar:</strong> [Zn(NH₃)₄]²⁺<br/>
                <strong>Tetragidridlar:</strong> [AlH₄]⁻, [BH₄]⁻<br/>
                <strong>Oksoanionlar:</strong> MnO₄⁻, CrO₄²⁻, SO₄²⁻
              </p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>T<sub>d</sub> vs O<sub>h</sub> diagnostikasi:</strong> Agar kompleksda inversiya markazi 
              va C₄ o&apos;qi bo&apos;lsa — O<sub>h</sub>. Agar S₄ o&apos;qi bor, lekin C₄ yo&apos;q, 
              va inversiya markazi yo&apos;q bo&apos;lsa — T<sub>d</sub>. Tetraedrik komplekslarning 
              d-d spektrlari oktaedriklarga nisbatan ancha intensiv (Laport-ruxsat etilgan).
            </p>
          </div>
        </div>

        {/* ── 5. GURUHNI ANIQLASH ALGORITMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🗺️ Nuqtali guruhni aniqlash algoritmi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Kompleks birikmaning nuqtali guruhini aniqlash uchun 
              <strong className="text-yellow-400"> qat&apos;iy ketma-ketlik</strong> bo&apos;yicha 
              simmetriya elementlari tekshiriladi. Quyidagi algoritm 
              <strong> barcha komplekslar uchun universal</strong> ishlaydi.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                qadam: "1-qadam: Maxsus guruhlarni tekshirish",
                izoh: "Avval yuqori simmetriyali guruhlar tekshiriladi. Agar molekula chiziqli bo&apos;lsa — C<sub>∞v</sub> yoki D<sub>∞h</sub>. Agar oktaedrik [ML₆] — O<sub>h</sub>. Agar tetraedrik [ML₄] — T<sub>d</sub>. Agar ikosaedrik — I<sub>h</sub>.",
              },
              {
                qadam: "2-qadam: Aylanish o&apos;qlarini aniqlash",
                izoh: "Eng yuqori tartibli aylanish o&apos;qi C<sub>n</sub> topiladi. Bu — bosh o&apos;q. Agar C<sub>n</sub> dan boshqa simmetriya elementi bo&apos;lmasa — C<sub>n</sub> guruh.",
              },
              {
                qadam: "3-qadam: Perpendikulyar C₂ o&apos;qlarini tekshirish",
                izoh: "Bosh o&apos;qqa perpendikulyar C₂ o&apos;qlari mavjudmi? Ha bo&apos;lsa — D guruh (diedral). Yo&apos;q bo&apos;lsa — C guruh (siklik).",
              },
              {
                qadam: "4-qadam: Gorizontal aks tekisligi σ<sub>h</sub>",
                izoh: "Bosh o&apos;qqa perpendikulyar σ<sub>h</sub> mavjudmi? Ha bo&apos;lsa — C<sub>nh</sub> yoki D<sub>nh</sub>. Yo&apos;q bo&apos;lsa — 5-qadamga.",
              },
              {
                qadam: "5-qadam: Vertikal/diagonal aks tekisliklari",
                izoh: "Bosh o&apos;qni o&apos;z ichiga olgan σ<sub>v</sub> yoki σ<sub>d</sub> mavjudmi? Ha bo&apos;lsa — C<sub>nv</sub> yoki D<sub>nd</sub>. Yo&apos;q bo&apos;lsa — C<sub>n</sub> yoki D<sub>n</sub>.",
              },
              {
                qadam: "6-qadam: Inversiya markazi va S<sub>n</sub>",
                izoh: "Agar yuqoridagilardan hech biri topilmasa, i yoki S<sub>n</sub> tekshiriladi. S₂ = i mavjud bo&apos;lsa — C<sub>i</sub>. S<sub>n</sub> mavjud bo&apos;lsa — S<sub>n</sub> guruh. Agar hech qanday simmetriya topilmasa — C₁ (faqat E).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Amaliy misol: [PtCl₄]²⁻ guruhini aniqlash</h3>
            <p className="text-purple-200 text-sm">
              <strong>1.</strong> Maxsus guruh emas (oktaedrik ham, tetraedrik ham emas).<br/>
              <strong>2.</strong> C₄ o&apos;qi bor (tekislikka perpendikulyar) → n=4.<br/>
              <strong>3.</strong> 4 ta C₂ o&apos;qi C₄ ga perpendikulyar (Pt−Cl orqali va Cl−Cl orasidan) → D guruh.<br/>
              <strong>4.</strong> σ<sub>h</sub> bor (molekula tekisligi) → D<sub>4h</sub>.<br/>
              <strong>Natija: D<sub>4h</sub> — kvadrat-planar kompleks.</strong>
            </p>
          </div>
        </div>

        {/* ── 6. GURUH VA XOSSALAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Nuqtali guruh va kompleks xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                xossa: "Dipol moment",
                matn: "Agar kompleksda inversiya markazi (i) bo&apos;lsa, dipol moment aniq <strong>nolga teng</strong>. O<sub>h</sub> va D<sub>4h</sub> — dipol moment yo&apos;q. T<sub>d</sub> — dipol moment yo&apos;q (simmetriya tufayli). C<sub>2v</sub> va C<sub>4v</sub> — dipol moment noldan farqli bo&apos;lishi mumkin.",
              },
              {
                xossa: "Optik faollik (xirallik)",
                matn: "Agar kompleksda S<sub>n</sub> o&apos;qi (shu jumladan i=S₂ yoki σ=S₁) bo&apos;lmasa — molekula <strong>xiral (optik faol)</strong>. D<sub>3</sub>, C<sub>3</sub> — xiral guruhlar. O<sub>h</sub>, T<sub>d</sub>, D<sub>4h</sub> — xiral emas (S<sub>n</sub> mavjud). tris(xelat) komplekslar [M(AA)₃] — D<sub>3</sub>, xiral!",
              },
              {
                xossa: "IQ va Raman faollik",
                matn: "Inversiya markazi bo&apos;lsa (O<sub>h</sub>, D<sub>4h</sub>) — <strong>alternativ taqiq</strong>: IQ-faol tebranishlar Raman-faol emas va aksincha. T<sub>d</sub> da inversiya markazi yo&apos;q — ayrim tebranishlar ham IQ, ham Raman faol bo&apos;lishi mumkin.",
              },
              {
                xossa: "d-orbital ajralishi",
                matn: "O<sub>h</sub>: d → t₂<sub>g</sub> + e<sub>g</sub>. T<sub>d</sub>: d → e + t₂ (teskari tartib). D<sub>4h</sub>: d → a₁<sub>g</sub> + b₁<sub>g</sub> + b₂<sub>g</sub> + e<sub>g</sub> (4 ta sath). Guruh simmetriyasi orbitallarning ajralish sxemasini to&apos;liq belgilaydi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.xossa}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Nuqtali guruh</strong> — molekulaning barcha simmetriya amallari to&apos;plami, Schoenflies belgilari</li>
            <li><strong className="text-yellow-400">O<sub>h</sub> (48 amal):</strong> oktaedrik [ML₆] — eng muhim kompleks guruhi, inversiya markazi bor</li>
            <li><strong className="text-yellow-400">T<sub>d</sub> (24 amal):</strong> tetraedrik [ML₄] — inversiya markazi YO&apos;Q, S₄ bor, C₄ yo&apos;q</li>
            <li><strong className="text-yellow-400">D<sub>4h</sub>:</strong> kvadrat-planar, D<sub>3h</sub>: trigonal-bipiramida, C<sub>4v</sub>: kvadrat-piramida</li>
            <li><strong className="text-yellow-400">Guruh → xossalar:</strong> dipol moment, optik faollik, IQ/Raman, d-orbital ajralishi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/elementlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Simmetriya elementlari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/xarakterlar" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Xarakterlar jadvali →
          </Link>
        </div>

      </section>
    </main>
  )
}