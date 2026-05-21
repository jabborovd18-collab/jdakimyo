import Link from "next/link"

export default function Elektron() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🔬 Simmetriya va elektron tuzilish</h1>
          <p className="text-purple-400 text-sm">Orbitallar klassifikatsiyasi • d-orbital ajralishi • Proyeksion operator • MO diagrammalar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Simmetriya va orbitallar — fundamental bog&apos;liqlik</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Atom orbitallarining simmetriyasi</strong> — ularning 
              nuqtali guruhdagi qaytarilmas tasvirlar bo&apos;yicha klassifikatsiyasi.
              Bu klassifikatsiya <strong>d-orbital ajralishi, MO energiya diagrammalari va elektron 
              o&apos;tishlarning ruxsat etilganligini</strong> tushunish uchun asos bo&apos;lib xizmat qiladi.
              Har bir orbital o&apos;zining burchak qismi (Y<sub>l,m</sub>) simmetriyasiga ko&apos;ra 
              ma&apos;lum bir qaytarilmas tasvirga tegishli bo&apos;ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Orbitallar simmetriyasi O<sub>h</sub> da</h3>
              <p className="text-purple-200 text-sm">
                <strong>s-orbital:</strong> A<sub>1g</sub> — to&apos;liq simmetrik<br/>
                <strong>p-orbitallar (x,y,z):</strong> T<sub>1u</sub> — dipol moment simmetriyasi<br/>
                <strong>d<sub>z²</sub>, d<sub>x²−y²</sub>:</strong> E<sub>g</sub> — yuqori energetik sath<br/>
                <strong>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>:</strong> T<sub>2g</sub> — pastki energetik sath<br/>
                <strong>f-orbitallar:</strong> A<sub>2u</sub> + T<sub>1u</sub> + T<sub>2u</sub>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Orbitallar simmetriyasi T<sub>d</sub> da</h3>
              <p className="text-purple-200 text-sm">
                <strong>s-orbital:</strong> A<sub>1</sub><br/>
                <strong>p-orbitallar (x,y,z):</strong> T<sub>2</sub><br/>
                <strong>d<sub>z²</sub>, d<sub>x²−y²</sub>:</strong> E — pastki energetik sath!<br/>
                <strong>d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>:</strong> T<sub>2</sub> — yuqori sath!<br/>
                <strong>Eslatma:</strong> O<sub>h</sub> ga nisbatan teskari tartibda!
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. d-ORBITAL AJRALISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💎 d-Orbital ajralishi simmetriya asosida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-Orbitallarning ajralishi</strong> — ligand maydon nazariyasining 
              asosiy konsepsiyasi. Simmetriya nuqtai nazaridan, <strong>erkin iondagi 5 ta degenerat d-orbital</strong>
              ligandlar maydonida <strong>simmetriyasi pastroq bo&apos;lgan guruhchalarga</strong> ajraladi.
              Ajralish sxemasi faqat va faqat kompleksning nuqtali guruhiga bog&apos;liq.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">Guruh</th>
                <th className="py-3 px-4 text-purple-300">KS</th>
                <th className="py-3 px-4 text-purple-300">d-orbital ajralishi</th>
                <th className="py-3 px-4 text-purple-300">Sathlar soni</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Oktaedrik", "O<sub>h</sub>", "6", "t₂<sub>g</sub>(T<sub>2g</sub>) + e<sub>g</sub>(E<sub>g</sub>)", "2", "[Cr(H₂O)₆]³⁺"],
                  ["Tetraedrik", "T<sub>d</sub>", "4", "e(E) + t₂(T<sub>2</sub>)", "2", "[CoCl₄]²⁻"],
                  ["Kvadrat-planar", "D<sub>4h</sub>", "4", "b₂<sub>g</sub> + e<sub>g</sub> + a₁<sub>g</sub> + b₁<sub>g</sub>", "4", "[PtCl₄]²⁻"],
                  ["Trigonal-bipiramida", "D<sub>3h</sub>", "5", "e&apos; + e&apos;&apos; + a₁&apos;", "3", "[Fe(CO)₅]"],
                  ["Kvadrat-piramida", "C<sub>4v</sub>", "5", "b₂ + e + a₁ + b₁", "4", "[VO(acac)₂]"],
                  ["Oktaedrik (cho&apos;zilgan)", "D<sub>4h</sub>", "6", "b₂<sub>g</sub>+e<sub>g</sub>+a₁<sub>g</sub>+b₁<sub>g</sub>", "4", "[Cu(H₂O)₆]²⁺"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-center font-bold text-green-400">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">O<sub>h</sub> da ajralish mexanizmi</h3>
            <p className="text-purple-200 text-sm">
              Erkin ionda 5 ta d-orbital degenerat (D simmetriya). Oktaedrik ligand maydonida:<br/>
              • d<sub>z²</sub>, d<sub>x²−y²</sub> — E<sub>g</sub> simmetriya. To&apos;g&apos;ridan-to&apos;g&apos;ri ligandlarga qaragan → yuqori energiya.<br/>
              • d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> — T<sub>2g</sub> simmetriya. Ligandlar orasiga qaragan → past energiya.<br/>
              Ajralish energiyasi = <strong>Δ<sub>o</sub></strong> (10 Dq). Bu — d-orbital ajralishining simmetriya asosidagi tushuntirishi.
            </p>
          </div>
        </div>

        {/* ── 3. PROYEKSION OPERATOR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔧 Proyeksion operator — simmetriya moslashgan orbitallar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Proyeksion operator</strong> — guruh nazariyasining eng kuchli 
              vositalaridan biri. U <strong>ixtiyoriy bazis funksiyadan ma&apos;lum simmetriyaga ega bo&apos;lgan 
              simmetriya moslashgan chiziqli kombinatsiyalarni (SALC)</strong> hosil qilish imkonini beradi.
              SALC lar MO energiya diagrammalarini qurishda qo&apos;llaniladi.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              P<sup>Γ</sup> = (d<sub>Γ</sub>/h) × Σ χ<sub>Γ</sub>(R) × R
            </p>
            <p className="text-purple-300 text-sm mt-2">
              d<sub>Γ</sub> — qaytarilmas tasvir o&apos;lchami, h — guruh tartibi, χ<sub>Γ</sub>(R) — xarakter, R — simmetriya amali
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                qadam: "1. Bazis funksiyalarni tanlash",
                izoh: "Ligand orbitallari yoki atom orbitallari to&apos;plami tanlanadi. Masalan, oktaedrik [ML₆] da 6 ta ligand σ-orbitallari — bazis. Har bir ligand orbitali φ₁, φ₂, ..., φ₆ deb belgilanadi.",
              },
              {
                qadam: "2. Har bir simmetriya amali uchun bazisga ta&apos;sirni aniqlash",
                izoh: "Har bir R simmetriya amali bazis funksiyalarni qanday almashtirishini aniqlang. Qaytariluvchan tasvir Γ ning xarakteri = o&apos;rnida qolgan bazis funksiyalar soni × amalning xarakteri.",
              },
              {
                qadam: "3. Proyeksion operatorni qo&apos;llash",
                izoh: "Har bir qaytarilmas tasvir uchun proyeksion operator formulasi qo&apos;llaniladi. Natijada shu simmetriyaga ega bo&apos;lgan SALC lar (simmetriya moslashgan chiziqli kombinatsiyalar) hosil bo&apos;ladi.",
              },
              {
                qadam: "4. Hosil bo&apos;lgan SALC larni metall orbitallari bilan bog&apos;lash",
                izoh: "Simmetriyasi bir xil bo&apos;lgan metall orbitallari va ligand SALC lari o&apos;zaro ta&apos;sirlashib, bog&apos;lovchi va antibog&apos;lovchi molekulyar orbitallarni hosil qiladi. Har xil simmetriyali orbitallar o&apos;zaro ta&apos;sirlashmaydi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. MO DIAGRAMMASINI QURISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 MO energiya diagrammasini qurish — oktaedrik kompleks</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Oktaedrik [ML₆] kompleks uchun <strong className="text-yellow-400">σ-donor ligandlar</strong> 
              (masalan, NH₃, H₂O) bilan MO diagrammasi. Metallning 9 ta valent orbitali 
              (3d, 4s, 4p) + 6 ta ligand σ-orbitallari = jami 15 ta MO hosil bo&apos;ladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">MO simmetriyasi</th>
                <th className="py-3 px-4 text-purple-300">Metall orbitali</th>
                <th className="py-3 px-4 text-purple-300">Ligand SALC</th>
                <th className="py-3 px-4 text-purple-300">Bog&apos; turi</th>
                <th className="py-3 px-4 text-purple-300">Energiya</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["A<sub>1g</sub>", "4s", "σ<sub>1</sub> (A<sub>1g</sub>)", "Bog&apos;lovchi", "Eng past"],
                  ["E<sub>g</sub>", "d<sub>z²</sub>, d<sub>x²−y²</sub>", "σ<sub>2,3</sub> (E<sub>g</sub>)", "Bog&apos;lovchi", "Past"],
                  ["T<sub>1u</sub>", "4p<sub>x</sub>,4p<sub>y</sub>,4p<sub>z</sub>", "σ<sub>4,5,6</sub> (T<sub>1u</sub>)", "Bog&apos;lovchi", "O&apos;rta"],
                  ["T<sub>2g</sub>", "d<sub>xy</sub>,d<sub>xz</sub>,d<sub>yz</sub>", "— (π bog&apos; yo&apos;q)", "Bog&apos;lanmagan", "t₂<sub>g</sub> = HOMO"],
                  ["E<sub>g</sub>*", "d<sub>z²</sub>, d<sub>x²−y²</sub>", "σ<sub>2,3</sub> (E<sub>g</sub>)", "Antibog&apos;lovchi", "e<sub>g</sub>* = LUMO"],
                  ["A<sub>1g</sub>*", "4s", "σ<sub>1</sub> (A<sub>1g</sub>)", "Antibog&apos;lovchi", "Yuqori"],
                  ["T<sub>1u</sub>*", "4p<sub>x</sub>,4p<sub>y</sub>,4p<sub>z</sub>", "σ<sub>4,5,6</sub> (T<sub>1u</sub>)", "Antibog&apos;lovchi", "Eng yuqori"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400" dangerouslySetInnerHTML={{ __html: r[0] }}></td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4">
                      {r[3].includes("Bog&apos;lanmagan") 
                        ? <span className="text-cyan-400">{r[3]}</span>
                        : r[3].includes("Antibog")
                        ? <span className="text-red-400">{r[3]}</span>
                        : <span className="text-green-400">{r[3]}</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Δ<sub>o</sub> = HOMO-LUMO oralig&apos;i</h3>
            <p className="text-purple-200 text-sm">
              Oktaedrik kompleksda <strong>HOMO = T<sub>2g</sub> (bog&apos;lanmagan t₂<sub>g</sub>)</strong>,
              <strong> LUMO = E<sub>g</sub>* (antibog&apos;lovchi e<sub>g</sub>*)</strong>.
              Δ<sub>o</sub> = E(E<sub>g</sub>*) − E(T<sub>2g</sub>) — bu UB-Vis spektroskopiyada o&apos;lchanadigan 
              d-d o&apos;tish energiyasiga teng. Simmetriya qoidalariga ko&apos;ra T<sub>2g</sub> → E<sub>g</sub> 
              o&apos;tish <strong>Laport-taqiqlangan</strong> (g→g), shuning uchun intensivligi past.
            </p>
          </div>
        </div>

        {/* ── 5. π-BOG'LANISH VA MO ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 π-Bog&apos;lanishning MO diagrammasiga ta&apos;siri</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Agar ligandlar <strong className="text-yellow-400">π-orbitallarga</strong> ega bo&apos;lsa 
              (masalan, CN⁻, CO, Cl⁻), qo&apos;shimcha π-bog&apos;lanish hosil bo&apos;ladi.
              Bu <strong>Δ<sub>o</sub> qiymatini sezilarli o&apos;zgartiradi</strong>.
              π-donor ligandlar Δ<sub>o</sub> ni kamaytiradi, π-akseptor ligandlar oshiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">π-Donor ligandlar (Cl⁻, Br⁻, H₂O)</h3>
              <p className="text-purple-200 text-sm">
                Ligandning to&apos;lgan π-orbitallari t₂<sub>g</sub> simmetriyaga ega. Ular metallning 
                T<sub>2g</sub> (d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>) orbitallari bilan 
                ta&apos;sirlashib, <strong>t₂<sub>g</sub> energiyasini ko&apos;taradi</strong> → 
                <strong> Δ<sub>o</sub> kamayadi</strong>. Spektrokimyoviy qatorda chap tomonda.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">π-Akseptor ligandlar (CN⁻, CO, bpy)</h3>
              <p className="text-purple-200 text-sm">
                Ligandning bo&apos;sh π*-orbitallari t₂<sub>g</sub> simmetriyaga ega. Ular metallning 
                T<sub>2g</sub> orbitallari bilan ta&apos;sirlashib, <strong>t₂<sub>g</sub> energiyasini 
                pasaytiradi</strong> → <strong>Δ<sub>o</sub> ortadi</strong>. 
                Spektrokimyoviy qatorda o&apos;ng tomonda.
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Simmetriya asosida π-bog&apos;lanish tahlili</h3>
            <p className="text-purple-200 text-sm">
              T<sub>2g</sub> simmetriyali metall orbitallari faqat <strong>T<sub>2g</sub> simmetriyali ligand 
              kombinatsiyalari</strong> bilan ta&apos;sirlashadi. E<sub>g</sub> simmetriyali orbitallar esa 
              <strong> faqat E<sub>g</sub> simmetriyali ligand SALC lari</strong> bilan. Turli simmetriyadagi 
              orbitallar o&apos;zaro ta&apos;sirlashmaydi (ortogonal). Bu — guruh nazariyasining 
              <strong> eng muhim xulosalaridan biri</strong>.
            </p>
          </div>
        </div>

        {/* ── 6. AMALIY QO'LLANISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Simmetriya va elektron tuzilish — amaliy xulosalar</h2>
          
          <div className="space-y-4">
            {[
              {
                xulosa: "Spektrokimyoviy qatorni simmetriya asosida tushuntirish",
                matn: "I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; CN⁻ &lt; CO. Chap tomonda π-donorlar (Δ<sub>o</sub> kichik), o&apos;ng tomonda π-akseptorlar (Δ<sub>o</sub> katta). Simmetriya: barcha ligandlar T<sub>2g</sub> simmetriyali π-orbitallar orqali ta&apos;sir qiladi.",
              },
              {
                xulosa: "Yan-Teller effektini simmetriya orqali tushuntirish",
                matn: "E<sub>g</sub> simmetriyali degenerat holat (d⁴, d⁹, d⁷(QS)) — simmetriya pasayishi (O<sub>h</sub> → D<sub>4h</sub>) orqali degeneratlik yo&apos;qotiladi. Simmetriya pasayganda E<sub>g</sub> → A<sub>1g</sub> + B<sub>1g</sub> ajraladi. Bu — Yan-Teller teoremasining guruh-nazariy isboti.",
              },
              {
                xulosa: "Tanlash qoidalarini simmetriya orqali aniqlash",
                matn: "Elektron o&apos;tish ruxsat etilgan bo&apos;lishi uchun: Γ(boshl.) ⊗ Γ(dipol) ⊗ Γ(oxirgi) ⊇ A<sub>1g</sub>. Dipol moment operatori: T<sub>1u</sub> (O<sub>h</sub>), T<sub>2</sub> (T<sub>d</sub>). Bu — barcha tanlash qoidalarining simmetriya asosidagi matematik ifodasi.",
              },
              {
                xulosa: "MO energiya sathlarini sistematik qurish",
                matn: "Har qanday kompleks uchun: 1) Nuqtali guruhni aniqlash. 2) Metall orbitallarini simmetriya bo&apos;yicha klassifikatsiyalash. 3) Ligand SALC larini proyeksion operator orqali topish. 4) Bir xil simmetriyali orbitallarni bog&apos;lash. 5) Energiya diagrammasini qurish.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.xulosa}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-yellow-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Orbitallar simmetriyasi:</strong> s→A<sub>1g</sub>, p→T<sub>1u</sub>, d→E<sub>g</sub>+T<sub>2g</sub> (O<sub>h</sub>)</li>
            <li><strong className="text-yellow-400">d-orbital ajralishi</strong> nuqtali guruhga bog&apos;liq — O<sub>h</sub> da 2 ta, D<sub>4h</sub> da 4 ta sath</li>
            <li><strong className="text-yellow-400">Proyeksion operator</strong> — bazis funksiyalardan SALC lar hosil qilish vositasi</li>
            <li><strong className="text-yellow-400">MO diagrammasi:</strong> bir xil simmetriyali orbitallargina o&apos;zaro ta&apos;sirlashadi</li>
            <li><strong className="text-yellow-400">π-bog&apos;lanish:</strong> π-donorlar Δ<sub>o</sub> ni kamaytiradi, π-akseptorlar oshiradi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/simmetriya/tebranish" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Tebranish spektrlari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/3d" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            3D vizualizatsiya →
          </Link>
        </div>

      </section>
    </main>
  )
}