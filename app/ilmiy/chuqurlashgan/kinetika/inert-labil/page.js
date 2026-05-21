import Link from "next/link"

export default function InertLabil() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🐢 Inert va labil komplekslar</h1>
          <p className="text-purple-400 text-sm">Taubes klassifikatsiyasi • t<sub>½</sub> • d³, d⁶(QS), d⁸ inert • KMBE va aktivatsiya energiyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kinetik barqarorlik — inertlik va labillik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kinetik barqarorlik (inertlik/labillik)</strong> — 
              kompleksning ligand almashinish reaksiyasiga kirishish <strong>tezligini</strong> xarakterlaydi.
              Bu <strong>termodinamik barqarorlikdan mustaqil</strong> tushuncha!
              Genri Taubes 1952 yilda komplekslarni <strong>inert (t<sub>½</sub> &gt; 1 minut)</strong> va 
              <strong>labil (t<sub>½</sub> &lt; 1 minut)</strong> guruhlarga ajratishni taklif qilgan.
              Inertlik — bu <strong>yuqori aktivatsiya energiyasi</strong> tufayli sekin boradigan reaksiya,
              labillik esa <strong>past aktivatsiya energiyasi</strong> tufayli tez boradigan reaksiya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">🐇 Labil komplekslar (tez almashinadi)</h3>
              <p className="text-purple-200 text-sm">
                <strong>t<sub>½</sub> &lt; 1 minut</strong> (xona haroratida)<br/>
                <strong>Aktivatsiya energiyasi:</strong> past (E<sub>a</sub> &lt; 50 kJ/mol)<br/>
                <strong>Tezlik konstantasi:</strong> k &gt; 10⁻² s⁻¹<br/>
                <strong>Misollar:</strong> [Ni(H₂O)₆]²⁺, [Cu(H₂O)₆]²⁺, [Fe(H₂O)₆]²⁺
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">🐢 Inert komplekslar (sekin almashinadi)</h3>
              <p className="text-purple-200 text-sm">
                <strong>t<sub>½</sub> &gt; 1 minut</strong> (xona haroratida)<br/>
                <strong>Aktivatsiya energiyasi:</strong> yuqori (E<sub>a</sub> &gt; 80 kJ/mol)<br/>
                <strong>Tezlik konstantasi:</strong> k &lt; 10⁻² s⁻¹<br/>
                <strong>Misollar:</strong> [Cr(H₂O)₆]³⁺, [Co(NH₃)₆]³⁺, [PtCl₄]²⁻
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. TAUBES KLASSIFIKATSIYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Taubes klassifikatsiyasi — elektron konfiguratsiya asosida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Genri Taubes <strong className="text-yellow-400">elektron konfiguratsiya va KMBE</strong> asosida 
              oktaedrik komplekslarni inert va labil guruhlarga ajratgan. Bu klassifikatsiya 
              <strong> Valent Bog&apos;lanish nazariyasi</strong> va keyinchalik 
              <strong> Kristall Maydon Nazariyasi</strong> bilan tasdiqlangan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Konfiguratsiya</th>
                <th className="py-3 px-4 text-purple-300">KMBE (Δ<sub>o</sub>)</th>
                <th className="py-3 px-4 text-purple-300">Klassifikatsiya</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">t<sub>½</sub> (25°C)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d¹", "t₂g¹", "0.4", "Labil", "[Ti(H₂O)₆]³⁺", "~10⁻⁵ s"],
                  ["d²", "t₂g²", "0.8", "Labil", "[V(H₂O)₆]³⁺", "~10⁻³ s"],
                  ["d³", "t₂g³", "1.2", "INERT", "[Cr(H₂O)₆]³⁺", "~40 soat"],
                  ["d⁴(YS)", "t₂g³ eg¹", "0.6", "Labil", "[Cr(H₂O)₆]²⁺", "~10⁻⁵ s"],
                  ["d⁵(YS)", "t₂g³ eg²", "0", "Labil", "[Fe(H₂O)₆]³⁺", "~10⁻³ s"],
                  ["d⁶(YS)", "t₂g⁴ eg²", "0.4", "Labil", "[Fe(H₂O)₆]²⁺", "~10⁻⁶ s"],
                  ["d⁶(QS)", "t₂g⁶ eg⁰", "2.4", "INERT", "[Co(NH₃)₆]³⁺", "~kunlar"],
                  ["d⁷(YS)", "t₂g⁵ eg²", "0.8", "Labil", "[Co(H₂O)₆]²⁺", "~10⁻⁶ s"],
                  ["d⁸", "t₂g⁶ eg²", "1.2", "O&apos;rtacha-labil", "[Ni(H₂O)₆]²⁺", "~10⁻⁴ s"],
                  ["d⁹", "t₂g⁶ eg³", "0.6", "Labil (tez)", "[Cu(H₂O)₆]²⁺", "~10⁻⁹ s"],
                  ["d¹⁰", "t₂g⁶ eg⁴", "0", "Labil (juda tez)", "[Zn(H₂O)₆]²⁺", "~10⁻⁸ s"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 font-bold">
                      {r[3].includes("INERT") 
                        ? <span className="text-red-400">{r[3]}</span> 
                        : <span className="text-green-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-cyan-400 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Inertlikning asosiy qoidalari</h3>
            <p className="text-purple-200 text-sm">
              <strong>1. d³ konfiguratsiya (Cr³⁺):</strong> t₂g³ — yarim to&apos;lgan t₂g, yuqori KMBE (1.2Δ<sub>o</sub>). 
              Ligand chiqishi yoki kirishi KMBE ni kamaytiradi — yuqori aktivatsiya energiyasi.<br/>
              <strong>2. d⁶ quyi spin (Co³⁺, Fe²⁺(QS)):</strong> t₂g⁶ eg⁰ — maksimal KMBE (2.4Δ<sub>o</sub>). 
              Eng inert komplekslar!<br/>
              <strong>3. d⁸ kvadrat-planar (Pt²⁺, Pd²⁺):</strong> yuqori energiyali dx²−y² orbital bo&apos;sh — 
              aksial hujum uchun yuqori aktivatsiya to&apos;siq.
            </p>
          </div>
        </div>

        {/* ── 3. KMBE VA AKTIVATSIYA ENERGIYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 KMBE va aktivatsiya energiyasi orasidagi bog&apos;liqlik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">KMBE ning o&apos;zgarishi</strong> — inertlik/labillikni 
              tushuntirishning asosiy omili. Ligand almashinishi vaqtida oraliq geometriya hosil bo&apos;ladi,
              bu geometriyada <strong>KMBE asosiy holatdagidan farq qiladi</strong>. 
              ΔKMBE = KMBE<sub>oraliq</sub> − KMBE<sub>asosiy</sub>. 
              ΔKMBE qancha katta bo&apos;lsa, aktivatsiya energiyasi shuncha yuqori — kompleks shuncha inert.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">KMBE (O<sub>h</sub>)</th>
                <th className="py-3 px-4 text-purple-300">KMBE (oraliq, KPi)</th>
                <th className="py-3 px-4 text-purple-300">ΔKMBE</th>
                <th className="py-3 px-4 text-purple-300">E<sub>a</sub> (kJ/mol)</th>
                <th className="py-3 px-4 text-purple-300">Xulosa</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cr³⁺", "d³", "1.2Δ<sub>o</sub>", "~0.6Δ<sub>o</sub>", "−0.6Δ<sub>o</sub>", "~110", "INERT"],
                  ["Co³⁺(QS)", "d⁶(QS)", "2.4Δ<sub>o</sub>", "~1.8Δ<sub>o</sub>", "−0.6Δ<sub>o</sub>", "~130", "JUDA INERT"],
                  ["Ni²⁺", "d⁸", "1.2Δ<sub>o</sub>", "~1.1Δ<sub>o</sub>", "−0.1Δ<sub>o</sub>", "~40", "LABIL"],
                  ["Cu²⁺", "d⁹", "0.6Δ<sub>o</sub>", "~0.5Δ<sub>o</sub>", "−0.1Δ<sub>o</sub>", "~25", "JUDA LABIL"],
                  ["Fe²⁺(YS)", "d⁶(YS)", "0.4Δ<sub>o</sub>", "~0.3Δ<sub>o</sub>", "−0.1Δ<sub>o</sub>", "~35", "LABIL"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-red-400">{r[4]}</td>
                    <td className="py-3 px-4 font-semibold text-cyan-400">{r[5]}</td>
                    <td className="py-3 px-4 text-sm font-bold">
                      {r[6].includes("INERT") 
                        ? <span className="text-red-400">{r[6]}</span> 
                        : <span className="text-green-400">{r[6]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5 mt-4">
            <p className="text-orange-300 text-sm">
              <strong>Xulosa:</strong> Agar ΔKMBE katta manfiy bo&apos;lsa (KMBE oraliq holatda keskin kamaysa) — 
              aktivatsiya energiyasi yuqori, kompleks INERT. Agar ΔKMBE kichik bo&apos;lsa — 
              aktivatsiya energiyasi past, kompleks LABIL. d³ va d⁶(QS) da ΔKMBE eng katta — ular eng inert.
            </p>
          </div>
        </div>

        {/* ── 4. SUV ALMASHINISH TEZLIKLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Akva komplekslarda suv almashinish tezligi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[M(H₂O)₆]<sup>n+</sup> + H₂O* → [M(H₂O)₅(H₂O*)]<sup>n+</sup> + H₂O</strong> —
              eng oddiy ligand almashinish reaksiyasi. Suv almashinish tezlik konstantalari 
              <strong> 10⁻⁹ dan 10⁹ s⁻¹ gacha</strong> — 18 tartibga farq qiladi!
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ion</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">k<sub>H₂O</sub> (s⁻¹, 25°C)</th>
                <th className="py-3 px-4 text-purple-300">t<sub>½</sub></th>
                <th className="py-3 px-4 text-purple-300">Mexanizm</th>
                <th className="py-3 px-4 text-purple-300">Klassifikatsiya</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Cr³⁺", "d³", "2.4 × 10⁻⁶", "~80 soat", "I<sub>a</sub>", "INERT"],
                  ["Co³⁺(QS)", "d⁶(QS)", "~10⁻¹⁰", "~200 yil", "I<sub>d</sub>", "JUDA INERT"],
                  ["Fe³⁺(YS)", "d⁵(YS)", "1.6 × 10²", "~4 ms", "I<sub>d</sub>", "Labil"],
                  ["Fe²⁺(YS)", "d⁶(YS)", "4.4 × 10⁶", "~160 ns", "I<sub>d</sub>", "JUDA LABIL"],
                  ["Co²⁺(YS)", "d⁷(YS)", "3.2 × 10⁶", "~220 ns", "I<sub>d</sub>", "JUDA LABIL"],
                  ["Ni²⁺", "d⁸", "3.2 × 10⁴", "~22 μs", "I<sub>d</sub>", "LABIL"],
                  ["Cu²⁺", "d⁹", "4.4 × 10⁹", "~160 ps", "I<sub>d</sub>", "JUDA LABIL"],
                  ["Zn²⁺", "d¹⁰", "~10⁸", "~7 ns", "I<sub>d</sub>", "JUDA LABIL"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-green-400">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-sm font-bold">
                      {r[5].includes("INERT") 
                        ? <span className="text-red-400">{r[5]}</span> 
                        : <span className="text-green-400">{r[5]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <p className="text-blue-300 text-sm">
              <strong>Eng inert:</strong> [Co(H₂O)₆]³⁺ — t<sub>½</sub> ≈ 200 yil! Faqat radioaktiv izotop almashinuvi orqali o&apos;lchangan.<br/>
              <strong>Eng labil:</strong> [Cu(H₂O)₆]²⁺ — t<sub>½</sub> ≈ 160 ps (pikosekund)! Yan-Teller buzilishi tufayli aksial suvlar juda tez almashadi.
            </p>
          </div>
        </div>

        {/* ── 5. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Inertlik/labillikning amaliy ahamiyati</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Sintez strategiyasi",
                matn: "Inert komplekslarni sintez qilish uchun yuqori harorat, katalizator yoki uzoq vaqt kerak. Labil komplekslar xona haroratida tez hosil bo&apos;ladi. [Co(NH₃)₆]³⁺ sintezi — Co²⁺ dan boshlab, so&apos;ng oksidlash (Co³⁺ labil kompleksini inertga aylantirish).",
              },
              {
                soha: "Tibbiyot",
                matn: "Platina komplekslari (sisplatin — [Pt(NH₃)₂Cl₂]) — inertligi tufayli organizmda yetib boradi va faqat DNK bilan reaksiyaga kirishadi. Labil komplekslar qonga yuborilsa, darhol boshqa ligandlar bilan almashinib ketadi.",
              },
              {
                soha: "Kataliz",
                matn: "Gomogen katalizda labil komplekslar afzal — substrat tez koordinatsiyalanadi. Inert komplekslar katalizator sifatida ishlamaydi, lekin ularni stoxiometrik reaksiyalarda ishlatish mumkin.",
              },
              {
                soha: "Tabiiy sistemalar",
                matn: "Metallofermentlarda metall markazi ko&apos;pincha labil — substrat tez almashinishi kerak. Mg²⁺ (labil) — ATF gidrolizida. Zn²⁺ (labil) — karbonangidrazada. Cr³⁺ (inert) — biologik sistemalarda deyarli uchramaydi.",
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
        <div className="bg-gradient-to-r from-purple-600/10 to-red-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Taubes qoidasi:</strong> t<sub>½</sub> &gt; 1 min — inert, t<sub>½</sub> &lt; 1 min — labil</li>
            <li><strong className="text-yellow-400">d³ (Cr³⁺) va d⁶(QS) (Co³⁺):</strong> yuqori KMBE, katta ΔKMBE — eng inert komplekslar</li>
            <li><strong className="text-yellow-400">d⁸ (Ni²⁺), d⁹ (Cu²⁺), d¹⁰ (Zn²⁺):</strong> past KMBE yoki KMBE=0 — labil komplekslar</li>
            <li><strong className="text-yellow-400">Suv almashinish tezligi:</strong> 10⁻¹⁰ dan 10⁹ s⁻¹ gacha — 18 tartibga farq!</li>
            <li><strong className="text-yellow-400">Termodinamik ≠ Kinetik:</strong> [Co(NH₃)₆]³⁺ — termodinamik barqaror (log β=35) VA kinetik inert</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Kinetika
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/mexanizmlar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Almashinish mexanizmlari →
          </Link>
        </div>

      </section>
    </main>
  )
}