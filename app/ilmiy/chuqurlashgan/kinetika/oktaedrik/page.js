import Link from "next/link"

export default function Oktaedrik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">💎 Oktaedrik komplekslarda almashinish</h1>
          <p className="text-purple-400 text-sm">[ML₅X] + Y → [ML₅Y] + X • Suv almashinish tezligi • d⁸ Ni²⁺ vs d³ Cr³⁺ • KMBE ta&apos;siri</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oktaedrik komplekslarda ligand almashinish — umumiy qonuniyatlar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Oktaedrik komplekslar</strong> — koordinatsion kimyoda 
              <strong> eng ko&apos;p uchraydigan geometriya</strong>. Ularda ligand almashinish reaksiyalari 
              asosan <strong>I<sub>d</sub> (dissotsiativ almashinish)</strong> yoki 
              <strong>I<sub>a</sub> (assotsiativ almashinish)</strong> mexanizmlar bo&apos;yicha boradi.
              Almashinish tezligi <strong>metall ionining elektron konfiguratsiyasi, KMBE, 
              ion radiusi va zaryadi</strong>ga bog&apos;liq.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              [ML₅X] + Y → [ML₅Y] + X
            </p>
            <p className="text-purple-300 text-sm mt-2">
              Oktaedrik komplekslarda ligand almashinishining umumiy sxemasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Labil (tez almashinuvchi)</h3>
              <p className="text-purple-200 text-sm">d¹, d², d⁴(YS), d⁵(YS), d⁶(YS), d⁷(YS), d⁸, d⁹, d¹⁰</p>
              <p className="text-purple-400 text-xs mt-1">k &gt; 10⁻² s⁻¹</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">O&apos;rtacha labil</h3>
              <p className="text-purple-200 text-sm">d⁸ Ni²⁺ — KMBE=1.2Δ<sub>o</sub>, lekin labil</p>
              <p className="text-purple-400 text-xs mt-1">k ≈ 10³−10⁵ s⁻¹</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Inert (sekin almashinuvchi)</h3>
              <p className="text-purple-200 text-sm">d³, d⁶(QS), d⁸(kvadrat-planar)</p>
              <p className="text-purple-400 text-xs mt-1">k &lt; 10⁻² s⁻¹</p>
            </div>
          </div>
        </div>

        {/* ── 2. SUV ALMASHINISH — FUNDAMENTAL REAKSIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Suv almashinish reaksiyasi — fundamental jarayon</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[M(H₂O)₆]<sup>n+</sup> + H₂O* → [M(H₂O)₅(H₂O*)]<sup>n+</sup> + H₂O</strong> —
              bu <strong>eng oddiy ligand almashinish reaksiyasi</strong> bo&apos;lib, 
              barcha boshqa ligand almashinish reaksiyalari uchun <strong>etalon</strong> hisoblanadi.
              Suv almashinish tezlik konstantasi (k<sub>H₂O</sub>) metall ionining 
              <strong>labillik darajasini</strong> ko&apos;rsatadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall ioni</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">k<sub>H₂O</sub> (s⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
                <th className="py-3 px-4 text-purple-300">ΔV<sup>‡</sup> (cm³/mol)</th>
                <th className="py-3 px-4 text-purple-300">E<sub>a</sub> (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Izoh</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cr³⁺", "d³", "2.4×10⁻⁶", "I<sub>a</sub>", "−9.3", "110", "Eng inert 3d (t₁₂≈80 soat)"],
                  ["Co³⁺(QS)", "d⁶(QS)", "~10⁻¹⁰", "I<sub>d</sub>", "+1.2", "130", "Eng inert (t₁₂≈200 yil!)"],
                  ["Fe³⁺(YS)", "d⁵(YS)", "1.6×10²", "I<sub>d</sub>", "+5.4", "64", "Labil"],
                  ["Fe²⁺(YS)", "d⁶(YS)", "4.4×10⁶", "I<sub>d</sub>", "+3.8", "32", "Juda labil"],
                  ["Co²⁺(YS)", "d⁷(YS)", "3.2×10⁶", "I<sub>d</sub>", "+6.1", "47", "Juda labil"],
                  ["Ni²⁺", "d⁸", "3.2×10⁴", "I<sub>d</sub>", "+7.2", "57", "Labil (KMBE=1.2!)"],
                  ["Cu²⁺", "d⁹", "4.4×10⁹", "I<sub>d</sub>", "+6.0", "25", "Eng labil (Yan-Teller)"],
                  ["Zn²⁺", "d¹⁰", "~10⁸", "I<sub>d</sub>", "+5.0", "30", "Juda labil (KMBE=0)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-cyan-400">{r[5]}</td>
                    <td className="py-3 px-4 text-xs">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Qiziqarli fakt:</strong> Cu²⁺ akva kompleksida suv almashinish tezligi 4.4×10⁹ s⁻¹ — 
              bu Cr³⁺ dan <strong>~10¹⁵ marta tezroq!</strong> Yan-Teller buzilishi tufayli Cu²⁺ ning 
              aksial suv molekulalari juda zaif bog&apos;langan va deyarli to&apos;siqsiz almashadi.
            </p>
          </div>
        </div>

        {/* ── 3. KMBE VA ALMASHINISH TEZLIGI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 KMBE va almashinish mexanizmi orasidagi bog&apos;liqlik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Oktaedrik kompleksda ligand almashinishi vaqtida <strong className="text-yellow-400">oraliq geometriya</strong> 
              hosil bo&apos;ladi. Bu geometriyada KMBE asosiy holatdagidan farq qiladi.
              <strong> ΔKMBE = KMBE<sub>oraliq</sub> − KMBE<sub>asosiy</sub></strong>. 
              ΔKMBE qancha katta manfiy bo&apos;lsa, aktivatsiya energiyasi shuncha yuqori.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">I<sub>d</sub> mexanizm (oraliq KS=5)</h3>
              <p className="text-purple-200 text-sm">
                <strong>d³ (Cr³⁺):</strong> t₂g³ → oraliqda KMBE keskin kamayadi → inert<br/>
                <strong>d⁶(QS) (Co³⁺):</strong> t₂g⁶ → oraliqda KMBE yo&apos;qoladi → juda inert<br/>
                <strong>d⁸ (Ni²⁺):</strong> t₂g⁶eg² → oraliqda KMBE biroz kamayadi → labil<br/>
                <strong>d⁹ (Cu²⁺):</strong> t₂g⁶eg³ → Yan-Teller, aksial bog&apos;lar zaif → juda labil
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">I<sub>a</sub> mexanizm (oraliq KS=7)</h3>
              <p className="text-purple-200 text-sm">
                <strong>d³ (Cr³⁺):</strong> KS=7 pentagonal-bipiramida — KMBE yetarli → I<sub>a</sub> afzal<br/>
                <strong>d⁶(QS) (Co³⁺):</strong> KS=7 da ham yuqori KMBE → I<sub>a</sub> afzal<br/>
                <strong>d⁸ (Ni²⁺):</strong> KS=7 da KMBE past → I<sub>a</sub> noqulay, I<sub>d</sub> afzal<br/>
                <strong>Sterik omil:</strong> 7 ta ligand fazoviy to&apos;siq yaratadi
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Nima uchun Ni²⁺ (KMBE=1.2Δ<sub>o</sub>) labil, Cr³⁺ (KMBE=1.2Δ<sub>o</sub>) inert?</h3>
            <p className="text-purple-200 text-sm">
              Ikkalasida ham KMBE bir xil (1.2Δ<sub>o</sub>), lekin:<br/>
              <strong>Cr³⁺ (d³):</strong> t₂g³ — yarim to&apos;lgan barqaror konfiguratsiya. 
              I<sub>d</sub> oraliqda (KS=5) KMBE 0.6Δ<sub>o</sub> gacha tushadi — ΔKMBE = −0.6Δ<sub>o</sub>.<br/>
              <strong>Ni²⁺ (d⁸):</strong> t₂g⁶eg² — I<sub>d</sub> oraliqda (KS=5) KMBE ~1.1Δ<sub>o</sub> — 
              ΔKMBE = −0.1Δ<sub>o</sub> (kichik).<br/>
              <strong>Asosiy farq:</strong> Cr³⁺ da t₂g orbitallar yarim to&apos;lgan — bu qo&apos;shimcha barqarorlik 
              (almashinuv energiyasi) beradi, Ni²⁺ da esa yo&apos;q.
            </p>
          </div>
        </div>

        {/* ── 4. REAKSIYA TARTIBI VA TEZLIK QONUNI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Reaksiya tartibi va tezlik qonuni</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Oktaedrik komplekslarda ligand almashinish reaksiyalarining <strong className="text-yellow-400">tezlik qonuni</strong> 
              mexanizmga qarab turlicha bo&apos;ladi. Ko&apos;pchilik hollarda 
              <strong>psevdo-birinchi tartibli</strong> sharoitda o&apos;rganiladi (kiruvchi ligand katta ortiqcha miqdorda).
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                mexanizm: "I<sub>d</sub> (dissotsiativ almashinish)",
                tezlik: "v = k<sub>1</sub>[ML₅X] (kiruvchi Y konsentratsiyasiga bog&apos;liq emas)",
                izoh: "Tezlikni belgilovchi bosqich — X ligandining chiqishi. Y konsentratsiyasi oshirilsa ham tezlik o&apos;zgarmaydi. Psevdo-birinchi tartibli sharoitda k<sub>kuz</sub> = k<sub>1</sub>.",
                misol: "[Ni(H₂O)₆]²⁺ + NH₃ → [Ni(NH₃)(H₂O)₅]²⁺ + H₂O. k<sub>kuz</sub> = 3.2×10⁴ s⁻¹, Y konsentratsiyasiga bog&apos;liq emas.",
              },
              {
                mexanizm: "I<sub>a</sub> (assotsiativ almashinish)",
                tezlik: "v = k<sub>1</sub>[ML₅X][Y] (ikkala reagentga nisbatan birinchi tartibli)",
                izoh: "Tezlikni belgilovchi bosqich — Y ligandining kirishi va oraliq hosil bo&apos;lishi. Psevdo-birinchi tartibli sharoitda k<sub>kuz</sub> = k<sub>1</sub>[Y].",
                misol: "[Cr(H₂O)₆]³⁺ + SCN⁻ → [Cr(SCN)(H₂O)₅]²⁺ + H₂O. k<sub>kuz</sub> SCN⁻ konsentratsiyasiga bog&apos;liq.",
              },
              {
                mexanizm: "D (sof dissotsiativ)",
                tezlik: "v = k₁k₂[ML₅X][Y] / (k₋₁[X] + k₂[Y])",
                izoh: "Murakkab ifoda. Past Y konsentratsiyasida v ≈ k₁[ML₅X], yuqori Y konsentratsiyasida v ≈ k₁k₂[ML₅X][Y]/k₋₁[X]. X chiqishi tezlikni belgilaydi.",
                misol: "[Co(NH₃)₅Cl]²⁺ + H₂O → [Co(NH₃)₅(H₂O)]³⁺ + Cl⁻. X = Cl⁻ chiqishi sekin bosqich.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.mexanizm}</h3>
                <p className="text-purple-200 text-sm"><strong>Tezlik qonuni:</strong> {r.tezlik}</p>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Oktaedrik almashinishning amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Sintezda selektivlik",
                matn: "Inert komplekslar ([Co(NH₃)₆]³⁺, [Cr(H₂O)₆]³⁺) sintezda yuqori harorat va katalizator talab qiladi. Labil komplekslar (Ni²⁺, Cu²⁺) xona haroratida tez almashadi — ularni to&apos;g&apos;ridan-to&apos;g&apos;ri aralashtirish bilan sintez qilish mumkin.",
              },
              {
                soha: "Biologik sistemalar",
                matn: "Metallofermentlarda metall markazi ko&apos;pincha labil bo&apos;lishi kerak — substrat tez koordinatsiyalanadi va mahsulot tez ajraladi. Zn²⁺ (labil) karbonangidrazada, Mg²⁺ (labil) ATF gidrolizida. Inert metallar (Cr³⁺) biologik sistemalarda deyarli uchramaydi.",
              },
              {
                soha: "Kontrast moddalar (MRI)",
                matn: "[Gd(H₂O)₈]³⁺ — labil (Gd³⁺ — f⁷, KMBE=0). Suv almashinish tezligi yuqori — proton relaksatsiyasini tezlashtiradi. MRI da kontrast modda sifatida ishlatiladi. Inert komplekslar kontrast bermaydi.",
              },
              {
                soha: "Zaharlanish va antidotlar",
                matn: "Og&apos;ir metallarning toksikligi ularning biologik ligandlar bilan almashinish tezligiga bog&apos;liq. Hg²⁺ (labil) — fermentlardagi S-guruhlar bilan tez bog&apos;lanadi. Antidotlar (BAL, DMSA) yanada tezroq almashinishi kerak.",
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
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Oktaedrik almashinish:</strong> asosan I<sub>d</sub> yoki I<sub>a</sub> mexanizm</li>
            <li><strong className="text-yellow-400">Suv almashinish tezligi:</strong> Cu²⁺ (10⁹ s⁻¹) dan Co³⁺(QS) (10⁻¹⁰ s⁻¹) gacha — 10¹⁹ marta farq!</li>
            <li><strong className="text-yellow-400">Cr³⁺ vs Ni²⁺:</strong> bir xil KMBE (1.2Δ<sub>o</sub>), lekin Cr³⁺ inert (t₂g³ almashinuv energiyasi), Ni²⁺ labil</li>
            <li><strong className="text-yellow-400">Tezlik qonuni:</strong> I<sub>d</sub> — faqat kompleksga bog&apos;liq; I<sub>a</sub> — kompleks va kiruvchi ligandga bog&apos;liq</li>
            <li><strong className="text-yellow-400">Amaliyot:</strong> sintez, biologik sistemalar, MRI kontrast, toksikologiya</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika/mexanizmlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Almashinish mexanizmlari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/kvadrat-planar" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Kvadrat-planar almashinish →
          </Link>
        </div>

      </section>
    </main>
  )
}