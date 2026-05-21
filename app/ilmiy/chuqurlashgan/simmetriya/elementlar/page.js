import Link from "next/link"

export default function Elementlar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/simmetriya" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Molekulalar simmetriyasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🪞 Simmetriya elementlari va amallari</h1>
          <p className="text-purple-400 text-sm">Aylanish o&apos;qi (C<sub>n</sub>) • Aks tekisligi (σ) • Inversiya markazi (i) • Aylanma-aks (S<sub>n</sub>)</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Simmetriya elementlari — molekulalar geometriyasining tili</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Simmetriya elementi</strong> — molekulada mavjud bo&apos;lgan 
              geometrik obyekt (o&apos;q, tekislik, nuqta) bo&apos;lib, unga nisbatan 
              <strong className="text-yellow-400"> simmetriya amali</strong> bajarilganda molekula 
              o&apos;zining dastlabki holatiga qaytadi. Kompleks birikmalarda 
              <strong> 5 ta asosiy simmetriya elementi</strong> mavjud. Har bir elementning mavjudligi 
              yoki yo&apos;qligi kompleksning <strong>fizik va kimyoviy xossalarini</strong> belgilaydi:
              dipol moment, optik faollik, IQ/Raman spektrlari, d-orbital ajralishi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-center">
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="text-yellow-400 font-bold text-sm">Aylanish o&apos;qi</h3>
              <p className="text-purple-300 text-xs">C<sub>n</sub></p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-3xl mb-2">🪞</div>
              <h3 className="text-yellow-400 font-bold text-sm">Aks tekisligi</h3>
              <p className="text-purple-300 text-xs">σ</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-3xl mb-2">◎</div>
              <h3 className="text-yellow-400 font-bold text-sm">Inversiya markazi</h3>
              <p className="text-purple-300 text-xs">i</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
              <div className="text-3xl mb-2">🔀</div>
              <h3 className="text-yellow-400 font-bold text-sm">Aylanma-aks</h3>
              <p className="text-purple-300 text-xs">S<sub>n</sub></p>
            </div>
          </div>
        </div>

        {/* ── 2. AYLANISH O'QI Cn ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Aylanish o&apos;qi — C<sub>n</sub></h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Aylanish o&apos;qi C<sub>n</sub></strong> — molekulani 
              shu o&apos;q atrofida <strong>360°/n burchakka</strong> aylantirganda molekula o&apos;zining 
              dastlabki konfiguratsiyasiga qaytadigan o&apos;q. n — <strong>butun son</strong> (1, 2, 3, 4, 5, 6, ∞).
              Eng yuqori tartibli aylanish o&apos;qi <strong>bosh o&apos;q</strong> deb ataladi.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                tur: "C₂ — ikkinchi tartibli o&apos;q (180°)",
                kompleks: "Oktaedrik [ML₆] — 3 ta C₂ o&apos;qi ligandlar orqali o&apos;tadi. Tetraedrik [ML₄] — 3 ta C₂ o&apos;qi qirralar o&apos;rtasidan o&apos;tadi. Kvadrat-planar [PtCl₄]²⁻ — C₂ o&apos;qi tekislikka perpendikulyar.",
              },
              {
                tur: "C₃ — uchinchi tartibli o&apos;q (120°)",
                kompleks: "Oktaedrik — 4 ta C₃ o&apos;qi qarama-qarshi uchburchak sirtlar orqali o&apos;tadi. [Co(NH₃)₆]³⁺ — C₃ atrofida 120° aylantirish uchta NH₃ ligandini almashtiradi.",
              },
              {
                tur: "C₄ — to&apos;rtinchi tartibli o&apos;q (90°)",
                kompleks: "Oktaedrik — 3 ta C₄ o&apos;qi qarama-qarshi ligandlar orqali. [Fe(CN)₆]⁴⁻ — C₄ atrofida 90° aylantirish to&apos;rtta ekvatorial CN⁻ ligandini siklik almashtiradi.",
              },
              {
                tur: "C₅, C₆, C∞ — yuqori tartibli o&apos;qlar",
                kompleks: "C₅: ferrotsen [Fe(Cp)₂] (Cp halqalari). C₆: benzol komplekslari [Cr(C₆H₆)₂]. C∞: chiziqli komplekslar [Ag(NH₃)₂]⁺, [Au(CN)₂]⁻ — cheksiz tartibli o&apos;q.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.tur}</h3>
                <p className="text-purple-200 text-sm">{r.kompleks}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">C₁ va identifikatsiya amali (E)</h3>
            <p className="text-purple-200 text-sm">
              <strong>C₁</strong> — 360° aylanish, molekulani o&apos;z holatiga qaytaradi. Bu — <strong>E (identifikatsiya)</strong> amali.
              Har bir molekula kamida C₁ o&apos;qiga ega (E amali). Asimmetrik molekulalar faqat C₁ ga ega —
              ular C₁ nuqtali guruhga kiradi. Komplekslar orasida bunday holat kam uchraydi (xiral ligandli komplekslar).
            </p>
          </div>
        </div>

        {/* ── 3. AKS TEKISLIGI σ ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🪞 Aks tekisligi — σ</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Aks tekisligi σ</strong> — molekulani shu tekislikka nisbatan 
              akslantirganda (ko&apos;zgudagi kabi) molekula o&apos;zining dastlabki holatiga qaytadi.
              Aks tekisliklari <strong>3 turga</strong> bo&apos;linadi: gorizontal (σ<sub>h</sub>), 
              vertikal (σ<sub>v</sub>) va diagonal (σ<sub>d</sub>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">σ<sub>h</sub> — gorizontal</h3>
              <p className="text-purple-200 text-sm">
                Bosh o&apos;qqa <strong>perpendikulyar</strong> tekislik.<br/>
                <strong>Misol:</strong> Kvadrat-planar [PtCl₄]²⁻ — molekula tekisligi σ<sub>h</sub>.<br/>
                Oktaedrik kompleksda ekvatorial ligandlar tekisligi σ<sub>h</sub> hisoblanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">σ<sub>v</sub> — vertikal</h3>
              <p className="text-purple-200 text-sm">
                Bosh o&apos;qni <strong>o&apos;z ichiga olgan</strong> tekislik.<br/>
                <strong>Misol:</strong> Oktaedrik [Co(NH₃)₆]³⁺ — qarama-qarshi ligandlar orqali o&apos;tuvchi 3 ta σ<sub>v</sub>.<br/>
                Ammiak NH₃ — 3 ta σ<sub>v</sub> tekisligi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">σ<sub>d</sub> — diagonal</h3>
              <p className="text-purple-200 text-sm">
                Bosh o&apos;qni o&apos;z ichiga olgan, C₂ o&apos;qlari orasidan o&apos;tuvchi tekislik.<br/>
                <strong>Misol:</strong> Tetraedrik [CoCl₄]²⁻ — S₄ o&apos;qi bo&apos;ylab σ<sub>d</sub> tekisliklari.<br/>
                Kvadrat-planar — qarama-qarshi ligandlar orasidan.
              </p>
            </div>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Komplekslarda σ tekisliklarining ahamiyati</h3>
            <p className="text-purple-200 text-sm">
              σ<sub>h</sub> mavjudligi kompleksda <strong>inversiya markazi yo&apos;qligini</strong> anglatmaydi 
              (masalan, C<sub>3v</sub> da σ<sub>v</sub> bor, lekin i yo&apos;q). σ<sub>h</sub> + C<sub>n</sub> 
              ko&apos;pincha S<sub>n</sub> ni keltirib chiqaradi. Aks tekisligining mavjudligi 
              <strong> molekulaning dipol momenti nolga teng bo&apos;lishiga</strong> olib kelishi mumkin 
              (dipol vektor tekislikka perpendikulyar bo&apos;la olmaydi).
            </p>
          </div>
        </div>

        {/* ── 4. INVERSIYA MARKAZI i ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">◎ Inversiya markazi — i</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Inversiya markazi i</strong> — molekuladagi shunday nuqtaki, 
              har bir atomni shu nuqtaga nisbatan inversiyalaganda (koordinatalar ishorasini o&apos;zgartirganda: 
              x,y,z → −x,−y,−z) molekula o&apos;zining dastlabki holatiga qaytadi.
              <strong className="text-yellow-400"> Inversiya markazining mavjudligi yoki yo&apos;qligi</strong> —
              oktaedrik va tetraedrik komplekslarni farqlashning asosiy simmetriya belgisidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Inversiya markazi BOR bo&apos;lgan komplekslar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Oktaedrik O<sub>h</sub>:</strong> metall markazida i mavjud.<br/>
                [Co(NH₃)₆]³⁺, [Fe(CN)₆]⁴⁻, [Cr(H₂O)₆]³⁺<br/>
                <strong>Kvadrat-planar D<sub>4h</sub>:</strong> markazda i.<br/>
                [PtCl₄]²⁻, [Ni(CN)₄]²⁻, [AuCl₄]⁻<br/>
                <strong>Oktaedrik trans-[ML₄X₂]:</strong> D<sub>4h</sub>, i bor.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Inversiya markazi YO&apos;Q komplekslar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Tetraedrik T<sub>d</sub>:</strong> inversiya markazi yo&apos;q!<br/>
                [CoCl₄]²⁻, [Ni(CO)₄], [Zn(NH₃)₄]²⁺<br/>
                <strong>Kvadrat-piramidal C<sub>4v</sub>:</strong> i yo&apos;q.<br/>
                [VO(acac)₂], [CuCl₅]³⁻<br/>
                <strong>cis-[ML₄X₂]:</strong> C<sub>2v</sub>, i yo&apos;q.
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Inversiya markazining spektroskopik ahamiyati</h3>
            <p className="text-purple-200 text-sm">
              <strong>Laport qoidasi:</strong> inversiya markazi bo&apos;lgan komplekslarda g→g o&apos;tishlar taqiqlangan.
              Shuning uchun oktaedrik komplekslarning d-d polosalari kuchsiz (ε ≈ 1−100), tetraedrik komplekslarda esa
              intensiv (ε ≈ 100−1000). <strong>IQ va Raman:</strong> inversiya markazi bo&apos;lsa, 
              <strong>alternativ taqiq</strong> qoidasi amal qiladi — IQ-faol tebranishlar Raman-faol emas va aksincha.
            </p>
          </div>
        </div>

        {/* ── 5. AYLANMA-AKS Sn ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔀 Aylanma-aks — S<sub>n</sub></h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Aylanma-aks S<sub>n</sub></strong> — ikkita ketma-ket amalning 
              kombinatsiyasi: avval C<sub>n</sub> atrofida 360°/n ga aylantirish, so&apos;ngra shu o&apos;qqa 
              perpendikulyar tekislikka nisbatan akslantirish (σ<sub>h</sub>).
              <strong> S₁ = σ</strong> (aylanish 360° + aks), <strong>S₂ = i</strong> (aylanish 180° + aks = inversiya).
              S<sub>n</sub> — ko&apos;pincha e&apos;tibordan chetda qoladigan, lekin muhim simmetriya elementi.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                tur: "S₄ — eng muhim aylanma-aks (komplekslarda)",
                izoh: "<strong>Tetraedrik komplekslar:</strong> [CoCl₄]²⁻, [Ni(CO)₄] — 3 ta S₄ o&apos;qi mavjud. S₄ amali: 90° aylantirish + perpendikulyar tekislikka akslantirish. <strong>S₄ mavjudligi tetraedrik simmetriyaning asosiy belgisidir!</strong> Oktaedrikda S₄ yo&apos;q (uning o&apos;rniga C₄ va i alohida mavjud).",
              },
              {
                tur: "S₆ — oktaedrik komplekslarda",
                izoh: "Oktaedrik [ML₆] — C₃ o&apos;qi bir vaqtning o&apos;zida S₆ hamdir (C₃ + perpendikulyar σ<sub>h</sub>). S₆ ning mavjudligi oktaedrik simmetriyani tasdiqlaydi. Ferrotsen [Fe(Cp)₂] (D<sub>5d</sub>) — S₁₀ o&apos;qi mavjud.",
              },
              {
                tur: "S₂ = i — inversiya markazi",
                izoh: "S₂ = C₂ × σ<sub>h</sub> = i. Agar molekulada C₂ o&apos;qi va unga perpendikulyar σ<sub>h</sub> tekisligi mavjud bo&apos;lsa, avtomatik ravishda inversiya markazi ham mavjud bo&apos;ladi. Bu — guruh nazariyasining muhim xulosasi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.tur}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. MOLEKULALAR UCHUN SIMETRIYA AMALLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔢 Simmetriya amallarining ko&apos;paytmasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Ikki yoki undan ortiq simmetriya amallarini <strong className="text-yellow-400">ketma-ket bajarish</strong> 
              natijasida yangi simmetriya amali hosil bo&apos;ladi. Bu — <strong>guruh nazariyasining asosi</strong>.
              Simmetriya amallarining to&apos;plami matematik <strong>guruh</strong> tashkil qiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Ko&apos;paytma</th>
                <th className="py-3 px-4 text-purple-300">Natija</th>
                <th className="py-3 px-4 text-purple-300">Kompleksda misol</th>
                <th className="py-3 px-4 text-purple-300">Ahamiyati</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["C₂ × C₂", "C₂ (yangi o&apos;q)", "Oktaedrik — ikki C₂ ko&apos;paytmasi uchinchi C₂ ni beradi", "Guruh yopiqligi"],
                  ["C₂ × σ<sub>h</sub>", "i (inversiya)", "Kvadrat-planar — C₂ va σ<sub>h</sub> birgalikda i ni beradi", "S₂ = i ekanligi"],
                  ["C₄ × σ<sub>h</sub>", "S₄", "Tetraedrik — S₄ mavjudligi sababi", "S<sub>n</sub> ta&apos;rifi"],
                  ["σ<sub>v</sub> × σ&apos;<sub>v</sub>", "C<sub>n</sub>", "Ikki σ<sub>v</sub> ko&apos;paytmasi C<sub>n</sub> ni beradi", "Guruh generatorlari"],
                  ["i × σ", "C₂", "Inversiya + aks = C₂ (tekislikka perpendikulyar)", "Simmetriya to&apos;liqligi"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-green-400">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">5 ta simmetriya elementi:</strong> E (identifikatsiya), C<sub>n</sub> (aylanish), σ (aks), i (inversiya), S<sub>n</sub> (aylanma-aks)</li>
            <li><strong className="text-yellow-400">Oktaedrik O<sub>h</sub>:</strong> 3C₄, 4C₃, 6C₂, 3σ<sub>h</sub>, 6σ<sub>v</sub>, i — eng yuqori simmetriya</li>
            <li><strong className="text-yellow-400">Tetraedrik T<sub>d</sub>:</strong> 4C₃, 3S₄, 6σ<sub>d</sub> — inversiya markazi YO&apos;Q!</li>
            <li><strong className="text-yellow-400">i mavjudligi:</strong> Laport qoidasi, IQ/Raman alternativ taqiqi, d-d o&apos;tish intensivligi</li>
            <li><strong className="text-yellow-400">Simmetriya amallari guruh tashkil qiladi</strong> — bu guruh nazariyasining asosi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/simmetriya" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Molekulalar simmetriyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/simmetriya/nuqtali-guruhlar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Nuqtali guruhlar →
          </Link>
        </div>

      </section>
    </main>
  )
}