import Link from "next/link"

export default function Xarakterlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">📊 Xarakterlar jadvali</h1>
          <p className="text-purple-400 text-sm">Guruh nazariyasi • Mulliken belgilari • Qaytarilmas tasvirlar • O<sub>h</sub> va T<sub>d</sub> jadvallari</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Guruh nazariyasi va xarakterlar jadvali</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Xarakterlar jadvali</strong> — har bir nuqtali guruh uchun 
              uning barcha <strong>qaytarilmas tasvirlari (irreducible representations)</strong> va ularning 
              simmetriya amallaridagi <strong>xarakterlarini</strong> (izlarini) o&apos;z ichiga olgan 
              fundamental jadval. Xarakterlar jadvali orqali <strong>orbitallarning simmetriyasini, 
              tebranish modlarining faolligini, elektron o&apos;tishlarning ruxsat etilganligini</strong> 
              aniqlash mumkin. Bu — kompleks birikmalarning spektroskopik xossalarini bashorat qilishning 
              <strong> eng kuchli nazariy vositasi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Qaytarilmas tasvir</h3>
              <p className="text-purple-200 text-sm">Simmetriya bo&apos;yicha eng oddiy &quot;blok&quot;</p>
              <p className="text-purple-400 text-xs mt-1">A, B, E, T (Mulliken belgilari)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Xarakter (χ)</h3>
              <p className="text-purple-200 text-sm">Matritsaning izi (diagonal elementlar yig&apos;indisi)</p>
              <p className="text-purple-400 text-xs mt-1">Har bir simmetriya amali uchun son</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Bazis funksiyalar</h3>
              <p className="text-purple-200 text-sm">Har bir tasvirga mos keluvchi funksiyalar</p>
              <p className="text-purple-400 text-xs mt-1">x, y, z, xy, xz, d<sub>z²</sub> va h.k.</p>
            </div>
          </div>
        </div>

        {/* ── 2. MULLIKEN BELGILARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏷️ Mulliken belgilari — qaytarilmas tasvirlarning nomlanishi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Robert S. Mulliken</strong> tomonidan taklif qilingan belgilar tizimi.
              Har bir qaytarilmas tasvir o&apos;zining <strong>simmetriya xususiyatlarini</strong> aks ettiruvchi 
              maxsus belgiga ega. Bu belgilar orqali orbitallar, tebranish modlari va elektron holatlar klassifikatsiyalanadi.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                belgi: "A va B — bir o&apos;lchovli tasvirlar (degeneratlik = 1)",
                izoh: "<strong>A:</strong> bosh o&apos;q atrofida aylantirishga nisbatan simmetrik (χ(C<sub>n</sub>) = +1). <strong>B:</strong> antisimmetrik (χ(C<sub>n</sub>) = −1). Misol: O<sub>h</sub> da A<sub>1g</sub> — to&apos;liq simmetrik tasvir (barcha χ = +1).",
              },
              {
                belgi: "E — ikki o&apos;lchovli tasvir (degeneratlik = 2)",
                izoh: "Ikkita bir xil energiyali holat/funksiya. E<sub>g</sub> — oktaedrik maydonda d<sub>z²</sub> va d<sub>x²−y²</sub> orbitallar. E — tetraedrik maydonda pastki energetik sath. E harfi nemischa &quot;entartet&quot; (degenerat) so&apos;zidan.",
              },
              {
                belgi: "T — uch o&apos;lchovli tasvir (degeneratlik = 3)",
                izoh: "Uchta bir xil energiyali holat/funksiya. T<sub>2g</sub> — oktaedrik maydonda d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> orbitallar. T<sub>1u</sub> — dipol moment operatorining simmetriyasi (IQ-faollik sharti). T harfi nemischa &quot;dreifach&quot; (uch karra) so&apos;zidan.",
              },
              {
                belgi: "Pastki indekslar: g, u, 1, 2",
                izoh: "<strong>g (gerade — juft):</strong> inversiyaga nisbatan simmetrik, χ(i) = +1. <strong>u (ungerade — toq):</strong> inversiyaga nisbatan antisimmetrik, χ(i) = −1. <strong>1 va 2:</strong> C<sub>n</sub> yoki σ ga nisbatan simmetrik/antisimmetrikligini ko&apos;rsatadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.belgi}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. O<sub>h</sub> XARAKTERLAR JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 O<sub>h</sub> nuqtali guruh — xarakterlar jadvali</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              O<sub>h</sub> guruhi — kompleks birikmalar kimyosidagi <strong>eng muhim xarakterlar jadvali</strong>.
              10 ta qaytarilmas tasvir (5 ta g + 5 ta u), 48 ta simmetriya amali 
              <strong>10 ta sinfga</strong> birlashtirilgan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b border-purple-700">
                <th className="py-2 px-2 text-purple-300">Tasvir</th>
                <th className="py-2 px-2 text-purple-300">E</th>
                <th className="py-2 px-2 text-purple-300">8C₃</th>
                <th className="py-2 px-2 text-purple-300">6C₂</th>
                <th className="py-2 px-2 text-purple-300">6C₄</th>
                <th className="py-2 px-2 text-purple-300">3C₂</th>
                <th className="py-2 px-2 text-purple-300">i</th>
                <th className="py-2 px-2 text-purple-300">6S₄</th>
                <th className="py-2 px-2 text-purple-300">8S₆</th>
                <th className="py-2 px-2 text-purple-300">3σ<sub>h</sub></th>
                <th className="py-2 px-2 text-purple-300">6σ<sub>d</sub></th>
                <th className="py-2 px-2 text-purple-300">Bazis</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["A<sub>1g</sub>", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "s, x²+y²+z²"],
                  ["A<sub>2g</sub>", "1", "1", "−1", "−1", "1", "1", "−1", "1", "1", "−1", "—"],
                  ["E<sub>g</sub>", "2", "−1", "0", "0", "2", "2", "0", "−1", "2", "0", "d<sub>z²</sub>, d<sub>x²−y²</sub>"],
                  ["T<sub>1g</sub>", "3", "0", "−1", "1", "−1", "3", "1", "0", "−1", "−1", "R<sub>x</sub>,R<sub>y</sub>,R<sub>z</sub>"],
                  ["T<sub>2g</sub>", "3", "0", "1", "−1", "−1", "3", "−1", "0", "−1", "1", "d<sub>xy</sub>,d<sub>xz</sub>,d<sub>yz</sub>"],
                  ["A<sub>1u</sub>", "1", "1", "1", "1", "1", "−1", "−1", "−1", "−1", "−1", "—"],
                  ["A<sub>2u</sub>", "1", "1", "−1", "−1", "1", "−1", "1", "−1", "−1", "1", "—"],
                  ["E<sub>u</sub>", "2", "−1", "0", "0", "2", "−2", "0", "1", "−2", "0", "—"],
                  ["T<sub>1u</sub>", "3", "0", "−1", "1", "−1", "−3", "−1", "0", "1", "1", "x, y, z (dipol)"],
                  ["T<sub>2u</sub>", "3", "0", "1", "−1", "−1", "−3", "1", "0", "1", "−1", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-2 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }}></td>
                    <td className="py-2 px-2 text-center">{r[1]}</td>
                    <td className="py-2 px-2 text-center">{r[2]}</td>
                    <td className="py-2 px-2 text-center">{r[3]}</td>
                    <td className="py-2 px-2 text-center">{r[4]}</td>
                    <td className="py-2 px-2 text-center">{r[5]}</td>
                    <td className="py-2 px-2 text-center">{r[6]}</td>
                    <td className="py-2 px-2 text-center">{r[7]}</td>
                    <td className="py-2 px-2 text-center">{r[8]}</td>
                    <td className="py-2 px-2 text-center">{r[9]}</td>
                    <td className="py-2 px-2 text-center">{r[10]}</td>
                    <td className="py-2 px-2 text-xs" dangerouslySetInnerHTML={{ __html: r[11] }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">O<sub>h</sub> jadvalining eng muhim qatorlari</h3>
            <p className="text-purple-200 text-sm">
              <strong>T<sub>2g</sub>:</strong> d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> — pastki energetik sath (t₂<sub>g</sub>)<br/>
              <strong>E<sub>g</sub>:</strong> d<sub>z²</sub>, d<sub>x²−y²</sub> — yuqori energetik sath (e<sub>g</sub>)<br/>
              <strong>T<sub>1u</sub>:</strong> dipol moment operatori (x, y, z) — IQ-faollik sharti<br/>
              <strong>A<sub>1g</sub>:</strong> to&apos;liq simmetrik tasvir — Raman-faollik (α<sub>xx</sub>+α<sub>yy</sub>+α<sub>zz</sub>)
            </p>
          </div>
        </div>

        {/* ── 4. T<sub>d</sub> XARAKTERLAR JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔺 T<sub>d</sub> nuqtali guruh — xarakterlar jadvali</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              T<sub>d</sub> guruhi — tetraedrik komplekslar uchun. 5 ta qaytarilmas tasvir, 
              24 ta amal <strong>5 ta sinfga</strong> birlashtirilgan. 
              Inversiya markazi yo&apos;qligi tufayli <strong>g/u belgilari yo&apos;q</strong>.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Tasvir</th>
                <th className="py-3 px-4 text-purple-300">E</th>
                <th className="py-3 px-4 text-purple-300">8C₃</th>
                <th className="py-3 px-4 text-purple-300">3C₂</th>
                <th className="py-3 px-4 text-purple-300">6S₄</th>
                <th className="py-3 px-4 text-purple-300">6σ<sub>d</sub></th>
                <th className="py-3 px-4 text-purple-300">Bazis funksiyalar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["A<sub>1</sub>", "1", "1", "1", "1", "1", "s, x²+y²+z²"],
                  ["A<sub>2</sub>", "1", "1", "1", "−1", "−1", "—"],
                  ["E", "2", "−1", "2", "0", "0", "d<sub>z²</sub>, d<sub>x²−y²</sub>"],
                  ["T<sub>1</sub>", "3", "0", "−1", "1", "−1", "R<sub>x</sub>,R<sub>y</sub>,R<sub>z</sub>"],
                  ["T<sub>2</sub>", "3", "0", "−1", "−1", "1", "x,y,z; d<sub>xy</sub>,d<sub>xz</sub>,d<sub>yz</sub>"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }}></td>
                    <td className="py-3 px-4 text-center">{r[1]}</td>
                    <td className="py-3 px-4 text-center">{r[2]}</td>
                    <td className="py-3 px-4 text-center">{r[3]}</td>
                    <td className="py-3 px-4 text-center">{r[4]}</td>
                    <td className="py-3 px-4 text-center">{r[5]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[6] }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">T<sub>d</sub> da d-orbital ajralishi</h3>
            <p className="text-purple-200 text-sm">
              T<sub>d</sub> jadvalidan: d<sub>z²</sub>, d<sub>x²−y²</sub> → <strong>E</strong> (pastki sath!),
              d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> → <strong>T<sub>2</sub></strong> (yuqori sath!).
              Bu O<sub>h</sub> dagiga <strong>teskari</strong>: tetraedrik maydonda e orbitallar pastda, 
              t₂ orbitallar yuqorida joylashgan. Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub>.
            </p>
          </div>
        </div>

        {/* ── 5. QAYTARILUVCHAN TASVIRNI AJRATISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 Qaytariluvchan tasvirni qaytarilmaslarga ajratish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Qaytariluvchan tasvir (Γ)</strong> — bir nechta qaytarilmas 
              tasvirlarning yig&apos;indisidan iborat bo&apos;lgan murakkab tasvir. Uni qaytarilmas 
              komponentlarga ajratish uchun <strong>maxsus formula</strong> qo&apos;llaniladi.
              Bu — <strong>tebranish modlari, elektron holatlar va MO energiya sathlarining 
              simmetriyasini</strong> aniqlashning asosiy matematik usuli.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              a<sub>i</sub> = (1/h) × Σ [χ<sub>Γ</sub>(R) × χ<sub>i</sub>(R) × N<sub>R</sub>]
            </p>
            <p className="text-purple-300 text-sm mt-2">
              a<sub>i</sub> — i-qaytarilmas tasvirning necha marta uchrashi, h — guruh tartibi (amallar soni),
              χ<sub>Γ</sub> — qaytariluvchan tasvirning xarakteri, χ<sub>i</sub> — i-qaytarilmas tasvirning xarakteri,
              N<sub>R</sub> — sinfdagi amallar soni
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                qadam: "1-qadam: Γ xarakterlarini topish",
                izoh: "Tebranish tasviri uchun: har bir simmetriya amali ta&apos;sirida o&apos;rnini o&apos;zgartirmaydigan atomlar soni × amalning xarakteri. Elektron holatlar uchun: bevosita bazis orbitallarning xarakterlari yig&apos;indisi.",
              },
              {
                qadam: "2-qadam: Har bir qaytarilmas tasvir uchun a<sub>i</sub> ni hisoblash",
                izoh: "Yuqoridagi formula bo&apos;yicha har bir qaytarilmas tasvir (A₁, A₂, B₁, ...) uchun a<sub>i</sub> koeffitsiyenti hisoblanadi. a<sub>i</sub> butun son yoki nol chiqishi kerak.",
              },
              {
                qadam: "3-qadam: Natijani yozish",
                izoh: "Γ = Σ a<sub>i</sub> × Γ<sub>i</sub>. Masalan: Γ<sub>teb</sub> = A<sub>1g</sub> + E<sub>g</sub> + 2T<sub>1u</sub> + T<sub>1g</sub> + T<sub>2g</sub> + T<sub>2u</sub> (oktaedrik [ML₆] uchun 15 ta tebranish modi).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. AMALIY QO'LLANISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Xarakterlar jadvalining amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-4">
            {[
              {
                qollanish: "IQ-faol tebranishlarni aniqlash",
                matn: "Tebranish modi IQ-faol bo&apos;lishi uchun uning simmetriyasi <strong>dipol moment operatori (T<sub>1u</sub> O<sub>h</sub> da, T<sub>2</sub> T<sub>d</sub> da) bilan bir xil</strong> bo&apos;lishi kerak. O<sub>h</sub> da faqat T<sub>1u</sub> tebranishlar IQ-faol. Demak, oktaedrik [ML₆] spektrida faqat 2 ta IQ polosa kutiladi (aslida 1 ta, ikkinchisi kuchsiz).",
              },
              {
                qollanish: "Raman-faol tebranishlarni aniqlash",
                matn: "Raman-faollik sharti — tebranish simmetriyasi <strong>qutblanuvchanlik tenzori komponentlari (A<sub>1g</sub>, E<sub>g</sub>, T<sub>2g</sub>) bilan bir xil</strong> bo&apos;lishi. O<sub>h</sub> da A<sub>1g</sub>, E<sub>g</sub>, T<sub>2g</sub> tebranishlar Raman-faol. <strong>Alternativ taqiq:</strong> O<sub>h</sub> da hech qaysi tebranish ham IQ, ham Raman faol emas!",
              },
              {
                qollanish: "Elektron o&apos;tishlarning ruxsat etilganligi",
                matn: "O&apos;tish ruxsat etilgan bo&apos;lishi uchun Γ(boshl.) ⊗ Γ(dipol) ⊗ Γ(oxirgi) ⊇ A<sub>1g</sub>. O<sub>h</sub> da dipol = T<sub>1u</sub>. d-d o&apos;tish (T<sub>2g</sub> → E<sub>g</sub>): T<sub>2g</sub> ⊗ T<sub>1u</sub> ⊗ E<sub>g</sub> — A<sub>1g</sub> yo&apos;q → <strong>taqiqlangan</strong>.",
              },
              {
                qollanish: "MO energiya diagrammasini qurish",
                matn: "Ligand orbitallarining simmetriyasini xarakterlar jadvali yordamida aniqlab, metall orbitallari bilan mos keluvchi kombinatsiyalar topiladi. Simmetriyasi bir xil bo&apos;lgan orbitallar o&apos;zaro ta&apos;sirlashib, bog&apos;lovchi va antibog&apos;lovchi MO larni hosil qiladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qollanish}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Xarakterlar jadvali</strong> — har bir nuqtali guruh uchun qaytarilmas tasvirlar va ularning xarakterlari</li>
            <li><strong className="text-yellow-400">Mulliken belgilari:</strong> A/B (1D), E (2D), T (3D); g/u — inversiyaga nisbatan juft/toq</li>
            <li><strong className="text-yellow-400">O<sub>h</sub> jadvali:</strong> 10 ta tasvir, d-orbitalar T<sub>2g</sub>+E<sub>g</sub>, dipol T<sub>1u</sub></li>
            <li><strong className="text-yellow-400">T<sub>d</sub> jadvali:</strong> 5 ta tasvir, d-orbitallar E+T<sub>2</sub> (O<sub>h</sub> ga teskari tartibda)</li>
            <li><strong className="text-yellow-400">Γ ni ajratish:</strong> a<sub>i</sub> = (1/h)Σχ<sub>Γ</sub>χ<sub>i</sub>N<sub>R</sub> — IQ/Raman faollik va elektron o&apos;tishlarni aniqlash</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Nuqtali guruhlar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/tebranish" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Tebranish spektrlari →
          </Link>
        </div>

      </section>
    </main>
  )
}