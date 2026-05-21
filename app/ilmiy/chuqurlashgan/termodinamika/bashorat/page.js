import Link from "next/link"

export default function Bashorat() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/termodinamika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Termodinamika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🧮 Barqarorlikni bashorat qilish (HSAB)</h1>
          <p className="text-purple-400 text-sm">Pearson nazariyasi • Qattiq va yumshoq kislota/asoslar • Kompleks barqarorligini oldindan aytish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 HSAB nazariyasi — Pearson prinsipi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">HSAB (Hard and Soft Acids and Bases)</strong> — 
              Ralf Pearson tomonidan 1963 yilda taklif qilingan <strong>sifat nazariyasi</strong>.
              Asosiy qoida: <strong className="text-yellow-400">&quot;Qattiq kislotalar qattiq asoslar bilan, 
              yumshoq kislotalar yumshoq asoslar bilan barqaror kompleks hosil qiladi&quot;</strong>.
              Bu — kompleks barqarorligini <strong>oldindan bashorat qilishning eng oddiy va samarali usuli</strong>.
              HSAB — bu termodinamik emas, balki <strong>empirik klassifikatsiya</strong>.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              &quot;Qattiq + Qattiq → Barqaror (ion bog&apos;)<br/>
              Yumshoq + Yumshoq → Barqaror (kovalent bog&apos;)<br/>
              Qattiq + Yumshoq → Beqaror (mos kelmaydi)&quot;
            </p>
            <p className="text-purple-300 text-sm mt-2">— R.G. Pearson, 1963</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qattiq kislotalar (metall ionlari)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Xususiyatlari:</strong> kichik ion radiusi, yuqori zaryad, past qutblanuvchanlik.<br/>
                <strong>Misollar:</strong> H⁺, Li⁺, Na⁺, K⁺, Mg²⁺, Ca²⁺, Al³⁺, Cr³⁺, Fe³⁺, Co³⁺, Ti⁴⁺, Mn²⁺.<br/>
                <strong>Afzal ligandlar:</strong> F⁻, OH⁻, H₂O, NH₃, RCOO⁻, ROH, R₂O.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Yumshoq kislotalar (metall ionlari)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Xususiyatlari:</strong> katta ion radiusi, past zaryad, yuqori qutblanuvchanlik.<br/>
                <strong>Misollar:</strong> Cu⁺, Ag⁺, Au⁺, Hg²⁺, Pd²⁺, Pt²⁺, Cd²⁺, Tl⁺, Hg₂²⁺.<br/>
                <strong>Afzal ligandlar:</strong> I⁻, S²⁻, RSH, R₂S, CN⁻, CO, PR₃, C₂H₄.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. KLASSIFIKATSIYA JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Pearson klassifikatsiyasi — to&apos;liq jadval</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Turkum</th>
                <th className="py-3 px-4 text-purple-300">Kislotalar (Metall ionlari)</th>
                <th className="py-3 px-4 text-purple-300">Asoslar (Ligandlar)</th>
                <th className="py-3 px-4 text-purple-300">Kompleks turi</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  [
                    "Qattiq",
                    "H⁺, Li⁺, Na⁺, K⁺, Be²⁺, Mg²⁺, Ca²⁺, Sr²⁺, Al³⁺, Ga³⁺, Cr³⁺, Fe³⁺, Co³⁺, Mn²⁺, Ti⁴⁺, Zr⁴⁺",
                    "F⁻, OH⁻, H₂O, NH₃, N₂H₄, ROH, R₂O, CH₃COO⁻, CO₃²⁻, NO₃⁻, PO₄³⁻, SO₄²⁻, ClO₄⁻",
                    "Ion bog&apos;lanishli"
                  ],
                  [
                    "Oraliq",
                    "Fe²⁺, Co²⁺, Ni²⁺, Cu²⁺, Zn²⁺, Pb²⁺, Sn²⁺, Sb³⁺, Bi³⁺",
                    "Cl⁻, Br⁻, N₃⁻, NO₂⁻, SO₃²⁻, piridin, anilin, imidazol",
                    "Oraliq xarakterli"
                  ],
                  [
                    "Yumshoq",
                    "Cu⁺, Ag⁺, Au⁺, Hg²⁺, Hg₂²⁺, Pd²⁺, Pt²⁺, Cd²⁺, Tl⁺, CH₃Hg⁺",
                    "I⁻, S²⁻, RSH, R₂S, S₂O₃²⁻, CN⁻, CO, C₂H₄, C₆H₆, PR₃, AsR₃",
                    "Kovalent bog&apos;lanishli"
                  ],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Muhim eslatma: 3d-metallar — oraliq kislotalar</h3>
            <p className="text-purple-200 text-sm">
              Ko&apos;pchilik 3d-metall ionlari (Fe²⁺, Co²⁺, Ni²⁺, Cu²⁺, Zn²⁺) <strong>oraliq kislotalar</strong> 
              toifasiga kiradi. Ular qattiq va yumshoq asoslar bilan ham kompleks hosil qila oladi.
              Oksidlanish darajasi oshishi bilan metall ioni &quot;qattiqroq&quot; bo&apos;ladi:
              Fe²⁺ (oraliq) → Fe³⁺ (qattiq); Co²⁺ (oraliq) → Co³⁺ (qattiq); Cu⁺ (yumshoq) → Cu²⁺ (oraliq).
            </p>
          </div>
        </div>

        {/* ── 3. HSAB ASOSIDA BARQARORLIKNI BASHORAT QILISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔮 HSAB asosida barqarorlikni bashorat qilish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              HSAB nazariyasi orqali <strong className="text-yellow-400">qaysi ligand qaysi metall bilan 
              barqarorroq kompleks hosil qilishini</strong> oldindan aytish mumkin.
              Bu — <strong>sifat bashorat</strong>, aniq sonli qiymatlarni bermaydi, lekin 
              <strong>tartibni to&apos;g&apos;ri ko&apos;rsatadi</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                bashorat: "Bashorat 1: Ag⁺ — galogenid komplekslari barqarorligi",
                qoida: "Ag⁺ — yumshoq kislota. Ligandlar qatori: F⁻ (qattiq) &lt; Cl⁻ (oraliq) &lt; Br⁻ (oraliq-yumshoq) &lt; I⁻ (yumshoq).",
                natija: "Barqarorlik: [AgF] (beqaror, log K≈0) &lt; [AgCl₂]⁻ (log β≈5) &lt; [AgBr₂]⁻ (log β≈7) &lt; [AgI₂]⁻ (log β≈11). HSAB bashorati to&apos;g&apos;ri!",
              },
              {
                bashorat: "Bashorat 2: Al³⁺ — galogenid komplekslari barqarorligi",
                qoida: "Al³⁺ — qattiq kislota. Ligandlar qatori: F⁻ (qattiq) &gt; Cl⁻ (oraliq) &gt; Br⁻ (oraliq-yumshoq) &gt; I⁻ (yumshoq).",
                natija: "Barqarorlik: [AlF₆]³⁻ (log β≈20) &gt; [AlCl₄]⁻ (log β≈8) &gt; [AlBr₄]⁻ (beqaror) &gt; [AlI₄]⁻ (hosil bo&apos;lmaydi). HSAB bashorati to&apos;g&apos;ri — Ag⁺ ga teskari tartib!",
              },
              {
                bashorat: "Bashorat 3: Hg²⁺ — galogenid vs sianid",
                qoida: "Hg²⁺ — yumshoq kislota. CN⁻ (yumshoq) ligand F⁻ (qattiq) dan ancha barqarorroq kompleks berishi kerak.",
                natija: "[Hg(CN)₄]²⁻: log β=41.5 (ekstremal barqaror). [HgF]⁺: log K₁≈1.0 (juda beqaror). Farq ~10⁴⁰ marta! HSAB bashorati mutlaqo to&apos;g&apos;ri.",
              },
              {
                bashorat: "Bashorat 4: Ni²⁺ — donor atom tanlash",
                qoida: "Ni²⁺ — oraliq kislota. Har xil donor atomli ligandlar: O (qattiq), N (oraliq), S (yumshoq). Barqarorlik: N ≈ S &gt; O.",
                natija: "[Ni(NH₃)₆]²⁺ (N-donor): log β=8.7; [Ni(SR)₄]²⁻ (S-donor): log β≈10; [Ni(H₂O)₆]²⁺ (O-donor): log β₁≈0.6. HSAB: oraliq metall oraliq va yumshoq donorlarni afzal ko&apos;radi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.bashorat}</h3>
                <p className="text-purple-200 text-sm"><strong>Qoida:</strong> {r.qoida}</p>
                <p className="text-green-400 text-xs mt-1">✅ {r.natija}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. HSAB NAZARIYASINING ASOSI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 HSAB nazariyasining fizik asoslari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              HSAB — empirik qoida bo&apos;lsa-da, uning zamirida <strong className="text-yellow-400">aniq fizik 
              sabablar</strong> yotadi. Qattiq-qattiq o&apos;zaro ta&apos;sir asosan 
              <strong> elektrostatik (ion)</strong>, yumshoq-yumshoq esa <strong>kovalent (orbital)</strong> 
              xarakterga ega. Bu — <strong>Klopman-Salem tenglamasi</strong> orqali miqdoriy ifodalanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Qattiq kislota + Qattiq asos</h3>
              <p className="text-purple-200 text-sm">
                <strong>Mexanizm:</strong> asosan elektrostatik (ion) ta&apos;sir.<br/>
                <strong>HOMO-LUMO farqi:</strong> katta (ΔE &gt;&gt; 0).<br/>
                <strong>Zaryad nazorati:</strong> dominant — Klopman-Salem tenglamasida birinchi had.<br/>
                <strong>Misol:</strong> Al³⁺ + F⁻ → AlF₆³⁻. Kichik radiusli, yuqori zaryadli ionlar — kuchli Kulon tortishishi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Yumshoq kislota + Yumshoq asos</h3>
              <p className="text-purple-200 text-sm">
                <strong>Mexanizm:</strong> asosan kovalent (orbital) ta&apos;sir.<br/>
                <strong>HOMO-LUMO farqi:</strong> kichik (ΔE → 0).<br/>
                <strong>Orbital nazorati:</strong> dominant — Klopman-Salem tenglamasida ikkinchi had.<br/>
                <strong>Misol:</strong> Hg²⁺ + I⁻ → HgI₄²⁻. Katta radiusli, qutblanuvchan ionlar — orbital qoplashishi.
              </p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Klopman-Salem tenglamasi (soddalashtirilgan):
            </p>
            <p className="text-purple-200 text-sm mt-2">
              ΔE = −Q<sub>A</sub>Q<sub>B</sub>/(εR) + 2Σ(c<sub>A</sub>c<sub>B</sub>β)²/(E<sub>HOMO</sub>−E<sub>LUMO</sub>)
            </p>
            <p className="text-purple-400 text-xs mt-1">
              Birinchi had — elektrostatik (qattiq-qattiq), ikkinchi had — kovalent (yumshoq-yumshoq)
            </p>
          </div>
        </div>

        {/* ── 5. HSAB QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 HSAB nazariyasining amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-4">
            {[
              {
                soha: "Selektiv ekstraksiya va ajratish",
                matn: "Yumshoq metallarni (Ag⁺, Au⁺, Hg²⁺) yumshoq ligandlar (S²⁻, CN⁻, RSH) yordamida qattiq metallardan (Na⁺, K⁺, Mg²⁺) selektiv ajratish. Oltin qazib olish: Au + 2CN⁻ → [Au(CN)₂]⁻ (yumshoq+yumshoq — barqaror).",
              },
              {
                soha: "Toksikologiya va antidotlar",
                matn: "Og&apos;ir metallar (yumshoq kislotalar) bilan zaharlanganda yumshoq asosli antidotlar ishlatiladi: Hg²⁺ uchun BAL (S-donor), As³⁺ uchun DMSA (S-donor). Qattiq asoslar (EDTA) yumshoq metallarni samarali bog&apos;lay olmaydi.",
              },
              {
                soha: "Katalizatorlar dizayni",
                matn: "Gomogen katalizda metall-ligand juftligini HSAB bo&apos;yicha tanlash: Pd⁰ (yumshoq) — PR₃ (yumshoq) ligandlar; Ti⁴⁺ (qattiq) — RO⁻ (qattiq) ligandlar. Noto&apos;g&apos;ri juftlik katalizatorni beqaror qiladi.",
              },
              {
                soha: "Koordinatsion kimyoda sintez strategiyasi",
                matn: "Yangi kompleks sintez qilishda HSAB qoidasi bo&apos;yicha optimal ligand tanlash. Masalan, Cu⁺ (yumshoq) stabilizatsiya qilish uchun yumshoq ligandlar (CN⁻, PR₃) kerak. Cu²⁺ (oraliq) uchun N-donor ligandlar (NH₃, en) optimal.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.soha}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. CHEKLOVLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ HSAB nazariyasining cheklovlari</h2>
          
          <div className="space-y-3">
            {[
              {
                cheklov: "Faqat sifat bashorati",
                izoh: "HSAB nazariyasi barqarorlik konstantalarining aniq sonli qiymatlarini bermaydi. U faqat &quot;qaysi kompleks barqarorroq&quot; degan savolga sifat jihatdan javob beradi. Miqdoriy bashorat uchun termodinamik hisoblashlar kerak.",
              },
              {
                cheklov: "Oraliq kislotalar noaniqligi",
                izoh: "Ko&apos;pchilik 3d-metall ionlari (Fe²⁺, Co²⁺, Ni²⁺, Cu²⁺, Zn²⁺) oraliq kislotalar. Ular qattiq va yumshoq asoslar bilan ham kompleks hosil qiladi. Bunday hollarda boshqa omillar (KMBE, xelat effekti) dominant bo&apos;lishi mumkin.",
              },
              {
                cheklov: "Sterik omillar hisobga olinmaydi",
                izoh: "HSAB nazariyasi faqat elektron omillarni hisobga oladi. Katta hajmli ligandlarning sterik to&apos;siqi kompleks barqarorligini HSAB bashoratiga zid ravishda o&apos;zgartirishi mumkin.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.cheklov}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">HSAB prinsipi:</strong> qattiq+qattiq (ion bog&apos;), yumshoq+yumshoq (kovalent bog&apos;) — barqaror; qattiq+yumshoq — beqaror</li>
            <li><strong className="text-yellow-400">Qattiq kislotalar:</strong> kichik radius, yuqori zaryad — Al³⁺, Fe³⁺, Cr³⁺; afzal ligandlar: F⁻, OH⁻, H₂O</li>
            <li><strong className="text-yellow-400">Yumshoq kislotalar:</strong> katta radius, past zaryad — Ag⁺, Hg²⁺, Pt²⁺; afzal ligandlar: I⁻, CN⁻, S²⁻</li>
            <li><strong className="text-yellow-400">Oraliq kislotalar:</strong> ko&apos;pchilik 3d M²⁺ — har ikkala turdagi ligandlar bilan kompleks hosil qiladi</li>
            <li><strong className="text-yellow-400">Cheklov:</strong> sifat bashorati, oraliq kislotalar noaniqligi, sterik omillar hisobga olinmaydi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/termodinamika/omillar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Barqarorlik omillari
          </Link>
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            Chuqurlashgan mavzular →
          </Link>
        </div>

      </section>
    </main>
  )
}