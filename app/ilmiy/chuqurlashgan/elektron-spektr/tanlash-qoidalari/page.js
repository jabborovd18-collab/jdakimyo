import Link from "next/link"

export default function TanlashQoidalari() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">📏 Tanlash qoidalari</h1>
          <p className="text-purple-400 text-sm">Laport qoidasi • Spin qoidasi • Simmetriya qoidalari • Vibronik bog&apos;lanish • Qoidalarning yengilishi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Tanlash qoidalari haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tanlash qoidalari</strong> — elektron o&apos;tishlarning 
              qaysi biri ruxsat etilgan (intensiv) va qaysi biri taqiqlangan (kuchsiz yoki kuzatilmaydigan) 
              ekanligini belgilovchi kvant-mexanik qoidalardir. Kompleks birikmalarning UB-Vis spektrlarida 
              kuzatiladigan polosalar soni, intensivligi va holati aynan shu qoidalarga bo&apos;ysunadi.
              <strong className="text-yellow-400"> Asosiy 3 ta tanlash qoidasi</strong> mavjud: 
              Laport (paritet), Spin va Simmetriya qoidalari.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">🔒 Laport qoidasi</h3>
              <p className="text-purple-200 text-sm">Paritet o&apos;zgarishi kerak</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">g → u</p>
              <p className="text-purple-400 text-xs">g→g TAQIQLANGAN</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-orange-400 font-bold mb-2">🔄 Spin qoidasi</h3>
              <p className="text-purple-200 text-sm">Spin o&apos;zgarmasligi kerak</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">ΔS = 0</p>
              <p className="text-purple-400 text-xs">ΔS ≠ 0 TAQIQLANGAN</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">📐 Simmetriya qoidasi</h3>
              <p className="text-purple-200 text-sm">O&apos;tish integrali noldan farqli</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">Γ₁ ⊗ Γμ ⊗ Γ₂ ⊇ A₁</p>
              <p className="text-purple-400 text-xs">Simmetriya mosligi shart</p>
            </div>
          </div>
        </div>

        {/* ── 2. LAPORT QOIDASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔒 Laport (paritet) qoidasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Laport qoidasi</strong> — inversiya markaziga ega bo&apos;lgan 
              molekulalar (masalan, oktaedrik O<sub>h</sub> komplekslar) uchun asosiy tanlash qoidasi.
              Qoidaga ko&apos;ra: <strong className="text-yellow-400">bir xil paritetli holatlar orasidagi 
              o&apos;tishlar taqiqlangan</strong>. Ya&apos;ni g → g va u → u o&apos;tishlar taqiqlangan,
              faqat g → u (yoki u → g) o&apos;tishlar ruxsat etilgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Laport-ruxsat etilgan o&apos;tishlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Molar so&apos;ndirish:</strong> ε ≈ 10³−10⁵ L·mol⁻¹·cm⁻¹<br/>
                <strong>Misollar:</strong> MLCT (M→L), LMCT (L→M), π→π* ligand ichidagi o&apos;tishlar<br/>
                <strong>Sabab:</strong> paritet o&apos;zgaradi (g→u yoki u→g)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Laport-taqiqlangan o&apos;tishlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Molar so&apos;ndirish:</strong> ε ≈ 0.1−10² L·mol⁻¹·cm⁻¹<br/>
                <strong>Misollar:</strong> d-d o&apos;tishlar oktaedrik komplekslarda (g→g)<br/>
                <strong>Sabab:</strong> paritet o&apos;zgarmaydi — o&apos;tish dipol momenti nolga teng
              </p>
            </div>
          </div>

          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
            <h3 className="text-orange-400 font-bold mb-2">Nima uchun d-d o&apos;tishlar baribir kuzatiladi?</h3>
            <p className="text-purple-200 text-sm">
              d-d o&apos;tishlar Laport qoidasiga ko&apos;ra taqiqlangan, lekin ular baribir 
              (kuchsiz bo&apos;lsa ham) kuzatiladi. Sababi: <strong>vibronik bog&apos;lanish</strong> — 
              molekulaning tebranishlari simmetriyani buzadi va qisqa vaqtga inversiya markazini 
              yo&apos;qotadi. Shu vaqt ichida o&apos;tish amalga oshadi.
            </p>
          </div>
        </div>

        {/* ── 3. SPIN QOIDASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Spin qoidasi (ΔS = 0)</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Spin qoidasi</strong>ga ko&apos;ra: 
              <strong> elektron o&apos;tish vaqtida umumiy spin kvant soni o&apos;zgarmasligi kerak</strong> 
              (ΔS = 0). Bu shuni anglatadiki, spin-multipletligi bir xil bo&apos;lgan holatlar orasidagi 
              o&apos;tishlar ruxsat etilgan, har xil bo&apos;lganlari esa taqiqlangan.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O&apos;tish turi</th>
                <th className="py-3 px-4 text-purple-300">ΔS</th>
                <th className="py-3 px-4 text-purple-300">Intensivlik (ε)</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
                <th className="py-3 px-4 text-purple-300">Holat</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Spin-ruxsat etilgan", "0", "10¹−10⁵", "⁵T₂<sub>g</sub> → ⁵E<sub>g</sub> (d⁴ YS)", "KUCHLI"],
                  ["Spin-taqiqlangan", "≠ 0", "10⁻³−10⁻¹", "⁶A₁<sub>g</sub> → ⁴T₁<sub>g</sub> (d⁵)", "JUDA KUCHSIZ"],
                  ["Spin-ruxsat, Laport-taqiq", "0", "10⁰−10²", "d-d o&apos;tishlar (O<sub>h</sub>)", "O&apos;RTACHA"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4 text-sm" dangerouslySetInnerHTML={{ __html: r[3] }}></td>
                    <td className="py-3 px-4 font-bold">
                      {r[4].includes("KUCHLI") 
                        ? <span className="text-orange-400">{r[4]}</span> 
                        : r[4].includes("JUDA")
                        ? <span className="text-red-400">{r[4]}</span>
                        : <span className="text-green-400">{r[4]}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Spin qoidasi yengilishi</h3>
              <p className="text-purple-200 text-sm">
                Spin-taqiqlangan o&apos;tishlar <strong>spin-orbit bog&apos;lanish</strong> tufayli 
                kuchsiz bo&apos;lsa ham kuzatilishi mumkin. Og&apos;ir atomlarda (4d, 5d, lantanoidlar) 
                spin-orbit bog&apos;lanish kuchli — spin qoidasi sezilarli darajada yengillashadi.
                d⁵ (Mn²⁺, Fe³⁺) komplekslarining och rangli bo&apos;lishi ham shu sababli.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Og&apos;ir atom effekti</h3>
              <p className="text-purple-200 text-sm">
                3d → 4d → 5d qatorida spin-orbit bog&apos;lanish konstantasi (ζ) keskin ortadi:<br/>
                • Ti²⁺: ζ ≈ 120 cm⁻¹<br/>
                • Ru²⁺: ζ ≈ 1000 cm⁻¹<br/>
                • Os²⁺: ζ ≈ 3000 cm⁻¹<br/>
                Natijada 5d komplekslarda spin-taqiqlangan o&apos;tishlar ancha intensiv.
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. SIMMETRIYA QOIDASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Simmetriya (orbital) qoidasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Simmetriya qoidasi</strong> — o&apos;tish dipol momenti 
              integralining noldan farqli bo&apos;lish sharti. O&apos;tish faqat va faqat
              <strong> boshlang&apos;ich holat, dipol moment operatori va oxirgi holat simmetriyalarining 
              to&apos;g&apos;ri ko&apos;paytmasi to&apos;liq simmetrik (A₁) ko&apos;rinishni o&apos;z ichiga olsagina</strong> ruxsat etilgan.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-lg">
              Γ(ψ₁) ⊗ Γ(μ) ⊗ Γ(ψ₂) ⊇ A₁ (yoki A₁<sub>g</sub>)
            </p>
            <p className="text-purple-300 text-sm mt-2">Bu yerda Γ(μ) — dipol moment operatorining simmetriyasi (O<sub>h</sub> da T₁<sub>u</sub>)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">O<sub>h</sub> da ruxsat etilgan o&apos;tish</h3>
              <p className="text-purple-200 text-sm">
                <strong>Dipol operator:</strong> T₁<sub>u</sub><br/>
                <strong>Ruxsat sharti:</strong> Γ₁ ⊗ T₁<sub>u</sub> ⊗ Γ₂ ⊇ A₁<sub>g</sub><br/>
                <strong>Misol:</strong> A₁<sub>g</sub> → T₁<sub>u</sub> (Laport-ruxsat)<br/>
                <strong>d-d o&apos;tish:</strong> T₂<sub>g</sub> → E<sub>g</sub> — TAQIQLANGAN<br/>
                (T₂<sub>g</sub> ⊗ T₁<sub>u</sub> ⊗ E<sub>g</sub> da A₁<sub>g</sub> yo&apos;q)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">D<sub>4h</sub> da qo&apos;shimcha o&apos;tishlar</h3>
              <p className="text-purple-200 text-sm">
                Simmetriya pasayganda (Yan-Teller buzilishi) yangi ruxsat etilgan o&apos;tishlar paydo bo&apos;ladi.
                D<sub>4h</sub> da dipol operator: E<sub>u</sub> + A<sub>2u</sub> — bu O<sub>h</sub> dagiga 
                qaraganda ko&apos;proq o&apos;tishlarni ruxsat etadi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. VIBRONIK BOG'LANISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🫨 Vibronik bog&apos;lanish — qoidalarning yengilishi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Vibronik bog&apos;lanish</strong> — elektron va tebranish 
              holatlarining o&apos;zaro ta&apos;siri. Molekula tebranganda simmetriyasi oniy ravishda o&apos;zgaradi, 
              bu esa <strong>tanlash qoidalarining qisman yengilishiga</strong> olib keladi.
              Aynan vibronik bog&apos;lanish tufayli oktaedrik komplekslarda d-d o&apos;tishlar (Laport-taqiqlangan) 
              kuzatiladi. O&apos;tish intensivligi ε ≈ 5−500 L·mol⁻¹·cm⁻¹.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                mexanizm: "Tebranish orqali paritet buzilishi",
                tavsif: "Oktaedrik kompleksning antisimmetrik tebranishlari (masalan, T₁<sub>u</sub> yoki T₂<sub>u</sub> moda) inversiya markazini oniy ravishda yo&apos;qotadi. Shu lahzada molekula paritetga ega bo&apos;lmaydi va d-d o&apos;tish amalga oshadi.",
              },
              {
                mexanizm: "Gersberg-Teller effekti",
                tavsif: "Elektron o&apos;tish vaqtida tebranish kvant soni o&apos;zgaradi (Δv ≠ 0). Bu o&apos;tishning tebranish takrorlanishida (vibronik progressiya) namoyon bo&apos;ladi. Spektrda asosiy polosa + tebranish yo&apos;ldoshlari kuzatiladi.",
              },
              {
                mexanizm: "Intensivlikni oshirish mexanizmlari",
                tavsif: "1) Ligandning π-sistemasi bilan aralashish (d-p aralashish). 2) Metall-ligand kovalent bog&apos;lanishi — d-orbitallar ligand orbitallari bilan aralashib, &apos;sof d&apos; xarakterini yo&apos;qotadi. 3) Tetraedrik komplekslarda inversiya markazi yo&apos;q — d-d o&apos;tishlar Laport-ruxsat etilgan (ε ≈ 10²−10³).",
              },
              {
                mexanizm: "Past harorat effekti",
                tavsif: "Harorat pasayganda tebranishlar kamayadi → vibronik bog&apos;lanish kuchsizlanadi → d-d polosalar intensivligi pasayadi va torayadi. 77 K da spektrlarda nozik struktura (vibronik progressiya) aniq ko&apos;rinadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.mexanizm}</h3>
                <p className="text-purple-200 text-sm">{r.tavsif}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. QOIDALARNING UMUMIY JADVALI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Tanlash qoidalari: umumiy xulosa jadvali</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">O&apos;tish turi</th>
                <th className="py-3 px-4 text-purple-300">Laport</th>
                <th className="py-3 px-4 text-purple-300">Spin</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">ε (L·mol⁻¹·cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["d-d (O<sub>h</sub>)", "Taqiq", "Ruxsat", "Taqiq", "0.1−10²", "[Ti(H₂O)₆]³⁺: ~5"],
                  ["d-d (T<sub>d</sub>)", "Ruxsat", "Ruxsat", "Ruxsat", "10²−10³", "[CoCl₄]²⁻: ~600"],
                  ["d-d (D<sub>4h</sub>)", "Taqiq", "Ruxsat", "Qisman", "10¹−10²", "[Cu(H₂O)₆]²⁺: ~12"],
                  ["MLCT", "Ruxsat", "Ruxsat", "Ruxsat", "10³−10⁵", "[Ru(bpy)₃]²⁺: ~14,000"],
                  ["LMCT", "Ruxsat", "Ruxsat", "Ruxsat", "10³−10⁵", "[FeCl₄]⁻: ~3,000"],
                  ["Spin-taqiq (d⁵)", "Taqiq", "Taqiq", "Taqiq", "10⁻³−10⁻¹", "[Mn(H₂O)₆]²⁺: ~0.02"],
                  ["f-f (Ln³⁺)", "Taqiq", "Ruxsat", "Taqiq", "0.1−10", "[Eu(H₂O)₉]³⁺: ~3"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">
                      {r[1] === "Ruxsat" 
                        ? <span className="text-green-400">✓</span> 
                        : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-3 px-4">
                      {r[2] === "Ruxsat" 
                        ? <span className="text-green-400">✓</span> 
                        : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-3 px-4">
                      {r[3] === "Ruxsat" 
                        ? <span className="text-green-400">✓</span> 
                        : r[3] === "Qisman"
                        ? <span className="text-yellow-400">◐</span>
                        : <span className="text-red-400">✗</span>}
                    </td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 7. AMALIY AHAMIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy ahamiyati</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                sarlavha: "Spektrni bashorat qilish",
                matn: "Tanlash qoidalarini bilgan holda, berilgan kompleksning nechta d-d polosa berishini va ularning taxminiy intensivligini oldindan aytish mumkin.",
              },
              {
                sarlavha: "Geometriyani aniqlash",
                matn: "Spektrdagi polosalar soni va intensivligi kompleksning geometriyasi haqida ma&apos;lumot beradi. Tetraedrik komplekslar oktaedriklarga nisbatan ancha intensiv polosalar beradi.",
              },
              {
                sarlavha: "Spin holatini aniqlash",
                matn: "Spin-taqiqlangan o&apos;tishlar mavjudligi yoki yo&apos;qligi kompleksning yuqori yoki quyi spinli ekanligini ko&apos;rsatadi.",
              },
              {
                sarlavha: "Rangni tushuntirish",
                matn: "Kompleksning rangi aynan qaysi o&apos;tishlar ruxsat etilganiga bog&apos;liq. d⁵ (YS) komplekslarning och rangli bo&apos;lishi — barcha o&apos;tishlar spin-taqiqlangani uchun.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-orange-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Laport qoidasi:</strong> g→g taqiqlangan. d-d o&apos;tishlar vibronik bog&apos;lanish orqali kuzatiladi (ε ≈ 0.1−10²)</li>
            <li><strong className="text-yellow-400">Spin qoidasi:</strong> ΔS = 0. Spin-orbit bog&apos;lanish og&apos;ir atomlarda qoidani yengillashtiradi</li>
            <li><strong className="text-yellow-400">Simmetriya qoidasi:</strong> Γ₁ ⊗ Γμ ⊗ Γ₂ ⊇ A₁. Simmetriya pasayganda yangi o&apos;tishlar ruxsat etiladi</li>
            <li><strong className="text-yellow-400">Vibronik bog&apos;lanish:</strong> tebranishlar simmetriyani buzib, d-d o&apos;tishlarni qisman ruxsat etadi</li>
            <li><strong className="text-yellow-400">T<sub>d</sub> da:</strong> inversiya markazi yo&apos;q — d-d o&apos;tishlar Laport-ruxsat etilgan, intensivligi yuqori</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/term-belgilar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Term belgilar
          </Link>
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/orgel-diagrammalari" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            Orgel diagrammalari →
          </Link>
        </div>

      </section>
    </main>
  )
}