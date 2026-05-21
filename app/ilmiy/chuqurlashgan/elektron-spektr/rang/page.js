import Link from "next/link"

export default function Rang() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/elektron-spektr" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Elektron spektrlari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">🌈 Komplekslarning rangi</h1>
          <p className="text-purple-400 text-sm">Rang nazariyasi • Yutilish va qaytarish • Rang g&apos;ildiragi • d-d, MLCT, LMCT o&apos;tishlar • Misollar galereyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Komplekslarning rangi haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kompleks birikmalarning rangi</strong> — bu ularning 
              <strong> ko&apos;rinadigan sohadagi (400-800 nm) yorug&apos;likni yutishi</strong> natijasidir.
              Ko&apos;zga ko&apos;rinadigan rang — <strong>yutilgan rangning qo&apos;shimcha rangi</strong>.
              Rangni keltirib chiqaradigan asosiy elektron o&apos;tish turlari: 
              <strong className="text-yellow-400"> d-d o&apos;tishlar, MLCT (metal→ligand), 
              LMCT (ligand→metal)</strong> va ligand ichidagi π→π* o&apos;tishlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun komplekslar rangli?</h3>
              <p className="text-purple-200 text-sm">
                Ko&apos;rinadigan yorug&apos;lik (400-800 nm) energiyasi d-orbitallar orasidagi 
                energiya farqi (Δ<sub>o</sub>) bilan bir xil tartibda (100-400 kJ/mol).
                Shuning uchun d-d o&apos;tishlar ko&apos;pincha ko&apos;rinadigan sohada sodir bo&apos;ladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Rang = yutilgan rangning komplementi</h3>
              <p className="text-purple-200 text-sm">
                Oq yorug&apos;likdan ma&apos;lum to&apos;lqin uzunligidagi nurlar yutilsa,
                qolgan nurlar ko&apos;zga rang sifatida ko&apos;rinadi. Masalan: 
                ko&apos;k rang (450 nm) yutilsa → sariq-to&apos;q sariq rang ko&apos;rinadi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. RANG G'ILDIRAGI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎨 Rang g&apos;ildiragi va komplementar ranglar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Komplementar ranglar</strong> — rang g&apos;ildiragida bir-biriga 
              qarama-qarshi joylashgan ranglar. Kompleks yutilgan rangning komplementar rangida ko&apos;rinadi.
              Masalan: Cu²⁺ komplekslari <strong>sariq-qizil</strong> nurlarni yutadi → <strong>ko&apos;k</strong> rangda ko&apos;rinadi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Yutilgan to&apos;lqin uzunligi (nm)</th>
                <th className="py-3 px-4 text-purple-300">Yutilgan rang</th>
                <th className="py-3 px-4 text-purple-300">Ko&apos;rinadigan rang</th>
                <th className="py-3 px-4 text-purple-300">Energiya (cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Misol</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["400-435", "Binafsha", "Sariq-yashil", "25,000-23,000", "[FeCl₄]⁻"],
                  ["435-480", "Ko&apos;k", "Sariq", "23,000-20,800", "[CrO₄]²⁻"],
                  ["480-490", "Yashil-ko&apos;k", "To&apos;q sariq", "20,800-20,400", "[Co(H₂O)₆]²⁺"],
                  ["490-500", "Ko&apos;k-yashil", "Qizil", "20,400-20,000", "[Cu(NH₃)₄]²⁺"],
                  ["500-560", "Yashil", "Binafsha-qizil", "20,000-17,900", "[Ti(H₂O)₆]³⁺"],
                  ["560-580", "Sariq-yashil", "Binafsha", "17,900-17,200", "[Cr(H₂O)₆]³⁺"],
                  ["580-595", "Sariq", "Ko&apos;k", "17,200-16,800", "[Cu(H₂O)₆]²⁺"],
                  ["595-650", "To&apos;q sariq", "Yashil-ko&apos;k", "16,800-15,400", "[Ni(H₂O)₆]²⁺"],
                  ["650-780", "Qizil", "Yashil", "15,400-12,800", "[CoCl₄]²⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4">{r[0]}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: r[2].includes("Sariq") ? "#FFD700" : r[2].includes("Ko'k") || r[2].includes("ko'k") ? "#4488FF" : r[2].includes("Qizil") || r[2].includes("qizil") ? "#FF4444" : r[2].includes("Yashil") || r[2].includes("yashil") ? "#44CC44" : r[2].includes("Binafsha") ? "#CC44CC" : "#FF8800" }}>{r[1]}</td>
                    <td className="py-3 px-4 font-bold" style={{ color: r[2].includes("Sariq") ? "#FFD700" : r[2].includes("Ko'k") || r[2].includes("ko'k") ? "#4488FF" : r[2].includes("Qizil") || r[2].includes("qizil") ? "#FF4444" : r[2].includes("Yashil") || r[2].includes("yashil") ? "#44CC44" : r[2].includes("Binafsha") ? "#CC44CC" : "#FF8800" }}>{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. d-d O'TISHLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 d-d o&apos;tishlar va rang</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">d-d o&apos;tishlar</strong> — kompleks birikmalar rangining eng keng 
              tarqalgan sababi. Elektron <strong>t₂g orbitallardan eg orbitallarga</strong> (yoki aksincha) o&apos;tadi.
              Oktaedrik komplekslarda d-d o&apos;tishlar <strong>Laport-taqiqlangan</strong> — intensivligi past 
              (ε ≈ 0.1−10² L·mol⁻¹·cm⁻¹). Tetraedrik komplekslarda esa Laport-ruxsat etilgan — intensivligi yuqori.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                sarlavha: "Oktaedrik komplekslarda d-d o&apos;tishlar",
                matn: "O<sub>h</sub> simmetriyada inversiya markazi bor — g→g o&apos;tish Laport-taqiqlangan. Intensivlik vibronik bog&apos;lanish orqali. ε odatda 0.1−100 oralig&apos;ida. Rang och, pastel tonlarda bo&apos;ladi.",
                misol: "[Ni(H₂O)₆]²⁺ — och yashil, ε ≈ 2−5",
              },
              {
                sarlavha: "Tetraedrik komplekslarda d-d o&apos;tishlar",
                matn: "T<sub>d</sub> simmetriyada inversiya markazi yo&apos;q — g→g taqiqi amal qilmaydi. d-d o&apos;tishlar Laport-ruxsat etilgan. ε odatda 100−1000 oralig&apos;ida. Rang to&apos;yingan, yorqin.",
                misol: "[CoCl₄]²⁻ — to&apos;q ko&apos;k, ε ≈ 600",
              },
              {
                sarlavha: "Kvadrat-planar komplekslarda d-d o&apos;tishlar",
                matn: "D<sub>4h</sub> simmetriya. Yan-Teller effekti tufayli energetik sathlar qo&apos;shimcha ajralgan. 2-3 ta polosa kuzatiladi. Rang oktaedrikdan to&apos;yinganroq, tetraedrikdan kamroq.",
                misol: "[Cu(NH₃)₄]²⁺ — to&apos;q ko&apos;k, ε ≈ 50−100",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
                <p className="text-purple-400 text-xs mt-1">📌 {r.misol}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. MLCT VA LMCT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Zaryad ko&apos;chishi o&apos;tishlari: MLCT va LMCT</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Zaryad ko&apos;chishi (CT) o&apos;tishlari</strong> — elektron 
              metall va ligand orasida ko&apos;chganda sodir bo&apos;ladigan o&apos;tishlar.
              CT o&apos;tishlar <strong>Laport-ruxsat etilgan</strong> va <strong>spin-ruxsat etilgan</strong> — 
              intensivligi juda yuqori (ε ≈ 10³−10⁵). Ko&apos;pincha UB sohada, lekin ba&apos;zida 
              ko&apos;rinadigan sohaga ham kiradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">MLCT (Metal → Ligand)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Elektron metalldan ligandga o&apos;tadi.</strong><br/>
                Metall — past oksidlanish darajasida (boy elektronlar).<br/>
                Ligand — π-akseptor (bo&apos;sh π* orbitallar).<br/>
                <strong>Misollar:</strong> [Ru(bpy)₃]²⁺ (to&apos;q qizil), [Fe(phen)₃]²⁺ (qizil).<br/>
                <strong>ε ≈ 10⁴−10⁵ L·mol⁻¹·cm⁻¹</strong>
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">LMCT (Ligand → Metal)</h3>
              <p className="text-purple-200 text-sm">
                <strong>Elektron liganddan metallga o&apos;tadi.</strong><br/>
                Metall — yuqori oksidlanish darajasida (elektron yetishmaydi).<br/>
                Ligand — π-donor (to&apos;lgan orbitallar).<br/>
                <strong>Misollar:</strong> MnO₄⁻ (binafsha), CrO₄²⁻ (sariq), [FeCl₄]⁻ (sariq).<br/>
                <strong>ε ≈ 10³−10⁴ L·mol⁻¹·cm⁻¹</strong>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">O&apos;tish turi</th>
                <th className="py-3 px-4 text-purple-300">λ<sub>max</sub> (nm)</th>
                <th className="py-3 px-4 text-purple-300">ε (L·mol⁻¹·cm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Rang</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ru(bpy)₃]²⁺", "MLCT (4d→π*)", "452", "14,600", "To&apos;q qizil"],
                  ["[Fe(phen)₃]²⁺", "MLCT (3d→π*)", "510", "11,100", "Qizil"],
                  ["MnO₄⁻", "LMCT (O→Mn)", "528", "2,400", "Binafsha"],
                  ["CrO₄²⁻", "LMCT (O→Cr)", "373", "4,800", "Sariq"],
                  ["[FeCl₄]⁻", "LMCT (Cl→Fe)", "360", "2,800", "Sariq"],
                  ["[PtCl₆]²⁻", "LMCT (Cl→Pt)", "262", "24,500", "Sariq (UB yaqin)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: r[4].includes("Qizil") ? "#FF4444" : r[4].includes("Binafsha") ? "#CC44CC" : r[4].includes("Sariq") ? "#FFD700" : "#FFFFFF" }}>{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 5. RANGSIZ KOMPLEKSLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚪ Nima uchun ba&apos;zi komplekslar rangsiz?</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Barcha komplekslar ham rangli bo&apos;lavermaydi. Kompleksning rangsiz bo&apos;lishi 
              <strong className="text-yellow-400"> bir necha sabablarga</strong> ko&apos;ra bo&apos;lishi mumkin:
              d-orbitallar to&apos;liq to&apos;lgan (d¹⁰), bo&apos;sh (d⁰), yoki d-d o&apos;tish energiyasi 
              ko&apos;rinadigan sohadan tashqarida (UB sohada).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d⁰ — bo&apos;sh d-orbitallar</h3>
              <p className="text-purple-200 text-sm">
                d-elektronlar yo&apos;q — d-d o&apos;tish amalga oshmaydi.<br/>
                <strong>Misollar:</strong> Ti⁴⁺, Zr⁴⁺, Sc³⁺, Zn²⁺ (d¹⁰ ham)<br/>
                <strong>Komplekslar:</strong> TiO₂ (oq), ZnO (oq)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">d¹⁰ — to&apos;liq to&apos;lgan</h3>
              <p className="text-purple-200 text-sm">
                Barcha d-orbitallar to&apos;lgan — d-d o&apos;tish imkonsiz.<br/>
                <strong>Misollar:</strong> Zn²⁺, Cd²⁺, Hg²⁺, Cu⁺, Ag⁺<br/>
                <strong>Komplekslar:</strong> [Zn(H₂O)₆]²⁺ (rangsiz)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Katta Δ<sub>o</sub> — UB sohada</h3>
              <p className="text-purple-200 text-sm">
                d-d o&apos;tish energiyasi juda katta — UB sohada yutiladi.<br/>
                <strong>Misollar:</strong> Ba&apos;zi quyi spinli d⁶ komplekslar<br/>
                <strong>Komplekslar:</strong> [Co(NH₃)₆]³⁺ (sariq — UB yaqin)
              </p>
            </div>
          </div>
        </div>

        {/* ── 6. MISOLAR GALEREYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🖼️ Komplekslar ranglari galereyasi</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            Quyida eng ko&apos;p uchraydigan kompleks birikmalarning ranglari, ularning elektron 
            konfiguratsiyasi va rang sababi keltirilgan. Ranglar <strong>spektrokimyoviy qator</strong> 
            bo&apos;yicha ligand maydon kuchi ortishi bilan o&apos;zgaradi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Kompleks</th>
                <th className="py-3 px-4 text-purple-300">d<sup>n</sup></th>
                <th className="py-3 px-4 text-purple-300">Rang</th>
                <th className="py-3 px-4 text-purple-300">λ<sub>yut</sub> (nm)</th>
                <th className="py-3 px-4 text-purple-300">O&apos;tish turi</th>
                <th className="py-3 px-4 text-purple-300">Δ<sub>o</sub> (cm⁻¹)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["[Ti(H₂O)₆]³⁺", "d¹", "Binafsha-qizil", "493", "d-d", "20,300"],
                  ["[V(H₂O)₆]³⁺", "d²", "Yashil", "580", "d-d", "17,200"],
                  ["[Cr(H₂O)₆]³⁺", "d³", "Binafsha", "575", "d-d", "17,400"],
                  ["[Cr(NH₃)₆]³⁺", "d³", "Sariq", "464", "d-d", "21,550"],
                  ["[Mn(H₂O)₆]²⁺", "d⁵(YS)", "Och pushti", "530", "d-d (taqiq)", "8,500"],
                  ["[Fe(H₂O)₆]²⁺", "d⁶(YS)", "Och yashil", "~1000", "d-d", "10,400"],
                  ["[Fe(CN)₆]⁴⁻", "d⁶(QS)", "Sariq", "420", "MLCT", "33,000"],
                  ["[Co(H₂O)₆]²⁺", "d⁷(YS)", "Pushti-qizil", "510", "d-d", "9,300"],
                  ["[CoCl₄]²⁻", "d⁷(YS)", "To&apos;q ko&apos;k", "660", "d-d (T<sub>d</sub>)", "~3,500"],
                  ["[Ni(H₂O)₆]²⁺", "d⁸", "Och yashil", "1170", "d-d", "8,500"],
                  ["[Cu(H₂O)₆]²⁺", "d⁹", "Och ko&apos;k", "~800", "d-d", "12,500"],
                  ["[Zn(H₂O)₆]²⁺", "d¹⁰", "Rangsiz", "—", "—", "—"],
                  ["MnO₄⁻", "d⁰", "Binafsha", "528", "LMCT", "—"],
                  ["[Fe(phen)₃]²⁺", "d⁶(QS)", "Qizil", "510", "MLCT", "—"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400 text-sm">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: r[2].includes("Qizil") ? "#FF4444" : r[2].includes("Ko'k") || r[2].includes("ko'k") ? "#4488FF" : r[2].includes("Yashil") ? "#44CC44" : r[2].includes("Binafsha") ? "#CC44CC" : r[2].includes("Sariq") ? "#FFD700" : r[2].includes("Pushti") ? "#FF88AA" : "#FFFFFF" }}>{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                    <td className="py-3 px-4 text-sm">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 mt-4">
            <p className="text-pink-300 text-sm">
              <strong>Qiziqarli fakt:</strong> Aleksandrit minerali (BeAl₂O₄:Cr³⁺) — tabiiy yorug&apos;likda 
              yashil, sun&apos;iy yorug&apos;likda qizil ko&apos;rinadi. Sababi: Cr³⁺ ning ikkita d-d 
              polosasi orasidagi nisbat yorug&apos;lik spektri o&apos;zgarishi bilan o&apos;zgaradi.
            </p>
          </div>
        </div>

        {/* ── 7. RANGNI BASHORAT QILISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔮 Rangni bashorat qilish qoidalari</h2>
          
          <div className="space-y-4">
            {[
              {
                qoida: "1. d-elektronlar soni",
                matn: "d⁰ va d¹⁰ — rangsiz (d-d o&apos;tish yo&apos;q). d⁵ (YS) — och rangli (barcha d-d o&apos;tishlar spin-taqiqlangan). d¹, d², d³, d⁴, d⁶, d⁷, d⁸, d⁹ — odatda rangli.",
              },
              {
                qoida: "2. Ligand maydon kuchi",
                matn: "Kuchsiz maydonli ligandlar (I⁻, Br⁻, Cl⁻) — past Δ<sub>o</sub> → past energiyali yutilish → qizil tomonga siljish. Kuchli maydonli ligandlar (CN⁻, CO) — katta Δ<sub>o</sub> → yuqori energiyali yutilish → ko&apos;k/binafsha tomonga siljish.",
              },
              {
                qoida: "3. Spektrokimyoviy qator",
                matn: "Ligandlar spektrokimyoviy qatorda chapdan o&apos;ngga borgan sari Δ<sub>o</sub> ortadi, yutilish to&apos;lqin uzunligi kamayadi, rang o&apos;zgaradi. I⁻ &lt; Br⁻ &lt; Cl⁻ &lt; F⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; CN⁻ &lt; CO.",
              },
              {
                qoida: "4. Geometriya",
                matn: "Oktaedrik → och, pastel ranglar (Laport-taqiq). Tetraedrik → to&apos;yingan, yorqin ranglar (Laport-ruxsat). Δ<sub>t</sub> ≈ (4/9)Δ<sub>o</sub> — tetraedrik komplekslarda yutilish qizilroq sohada.",
              },
              {
                qoida: "5. Metall ioni",
                matn: "3d metallar — ko&apos;rinadigan sohada. 4d va 5d metallar — katta Δ<sub>o</sub>, yutilish UB sohaga siljiydi, ko&apos;pincha och rangli yoki rangsiz. Lantanoidlar — och rangli (f-f o&apos;tishlar Laport-taqiqlangan).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qoida}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Rang = yutilgan rangning komplementi</strong> — kompleks qaysi rangni yutsa, uning aksi ko&apos;rinadi</li>
            <li><strong className="text-yellow-400">d-d o&apos;tishlar:</strong> O<sub>h</sub> da och (Laport-taqiq), T<sub>d</sub> da to&apos;yingan (Laport-ruxsat)</li>
            <li><strong className="text-yellow-400">CT o&apos;tishlar:</strong> MLCT va LMCT — juda intensiv (ε ≈ 10³−10⁵)</li>
            <li><strong className="text-yellow-400">d⁰, d¹⁰</strong> — rangsiz (d-d o&apos;tish yo&apos;q). d⁵(YS) — och (spin-taqiq)</li>
            <li><strong className="text-yellow-400">Spektrokimyoviy qator</strong> bo&apos;yicha ligand kuchi ortishi bilan rang ko&apos;k siljiydi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/tanabe-sugano" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Tanabe-Sugano diagrammalari
          </Link>
          <Link href="/ilmiy/chuqurlashgan/elektron-spektr/spektr-tahlil" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold transition-all">
            Spektrlarni tahlil qilish →
          </Link>
        </div>

      </section>
    </main>
  )
}