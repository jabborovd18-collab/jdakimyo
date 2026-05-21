import Link from "next/link"

export default function Sezgirlik() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/magnit" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Magnit xossalari
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">⚖️ Magnit sezgirlik va Gui usuli</h1>
          <p className="text-purple-400 text-sm">Magnit sezgirlik (χ) • Gui va Faraday usullari • Kyuri va Kyuri-Veys qonunlari • Komplekslarda χ<sub>M</sub></p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Magnit sezgirlik tushunchasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Magnit sezgirlik (χ)</strong> — moddaning tashqi magnit maydonda 
              magnitlanish qobiliyatini xarakterlovchi asosiy fizik kattalik. Bu <strong>o&apos;lchovsiz proporsionallik 
              koeffitsiyenti</strong> bo&apos;lib, moddadagi magnit momentining tashqi maydon kuchlanganligiga nisbatini 
              ifodalaydi. Kompleks birikmalar uchun magnit sezgirlikni o&apos;lchash orqali 
              <strong className="text-yellow-400"> μ<sub>eff</sub>, spin holati, almashinuv parametrlari (J)</strong> 
              va boshqa muhim kattaliklar aniqlanadi. Magnit sezgirlik <strong>haroratga bog&apos;liq</strong> 
              bo&apos;lib, bu bog&apos;liqlik moddaning magnit tabiati haqida qo&apos;shimcha ma&apos;lumot beradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Hajmiy sezgirlik</h3>
              <p className="text-purple-200 text-sm">Birlik hajmdagi magnitlanish</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">χ<sub>v</sub> = M / H</p>
              <p className="text-purple-400 text-xs">M — magnitlanish, H — maydon kuchlanganligi</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Massaviy sezgirlik</h3>
              <p className="text-purple-200 text-sm">Birlik massadagi magnitlanish</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">χ<sub>g</sub> = χ<sub>v</sub> / ρ</p>
              <p className="text-purple-400 text-xs">ρ — zichlik (g/cm³)</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">Molyar sezgirlik</h3>
              <p className="text-purple-200 text-sm">1 mol modda uchun</p>
              <p className="text-yellow-400 font-bold text-lg mt-2">χ<sub>M</sub> = χ<sub>g</sub> × M</p>
              <p className="text-purple-400 text-xs">M — molyar massa (g/mol)</p>
            </div>
          </div>
        </div>

        {/* ── 2. MAGNIT SEZGIRLIK TURLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Magnit sezgirlikning turlari va komplekslar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Magnit sezgirlik qiymati va ishorasiga qarab moddalar <strong className="text-yellow-400">uch asosiy 
              turga</strong> ajratiladi. Kompleks birikmalar asosan <strong>paramagnit</strong> (juftlanmagan 
              elektronlar mavjud) yoki <strong>diamagnit</strong> (barcha elektronlar juftlashgan) bo&apos;ladi.
              Kamdan-kam hollarda ko&apos;p yadroli komplekslarda <strong>ferromagnit yoki antiferromagnit</strong> 
              tartiblanish kuzatiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Tur</th>
                <th className="py-3 px-4 text-purple-300">χ ishorasi</th>
                <th className="py-3 px-4 text-purple-300">χ qiymati (CGS)</th>
                <th className="py-3 px-4 text-purple-300">Haroratga bog&apos;liqlik</th>
                <th className="py-3 px-4 text-purple-300">Kompleks misoli</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Diamagnit", "Manfiy (−)", "~ −10⁻⁶", "Bog&apos;liq emas", "[Co(NH₃)₆]³⁺, [Zn(H₂O)₆]²⁺"],
                  ["Paramagnit", "Musbat (+)", "~ +10⁻³ − 10⁻²", "χ ∝ 1/T (Kyuri)", "[Fe(H₂O)₆]²⁺, [Cr(H₂O)₆]³⁺"],
                  ["Ferromagnit", "Musbat (+), katta", "~ +10¹ − 10⁵", "Kyuri temperaturasigacha", "[Fe(Cp*)₂]⁺"],
                  ["Antiferromagnit", "Musbat (+), kichik", "~ +10⁻³", "Neel temperaturasida maksimum", "[Cu₂(OAc)₄]"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 text-sm">{r[2]}</td>
                    <td className="py-3 px-4 text-sm">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 3. KYURI VA KYURI-VEYS QONUNLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Kyuri va Kyuri-Veys qonunlari</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kyuri qonuni</strong> — ideal paramagnit moddalar uchun asosiy qonun.
              Magnit sezgirlik absolyut haroratga teskari proporsional: <strong>χ = C/T</strong>.
              <strong className="text-yellow-400">Kyuri-Veys qonuni</strong> esa magnit ionlari orasidagi 
              o&apos;zaro ta&apos;sirni hisobga oladi: <strong>χ = C/(T−θ)</strong>, bu yerda θ — Veys konstantasi.
              Kompleks birikmalarda θ qiymati <strong>almashinuv ta&apos;siri (J)</strong> bilan bevosita bog&apos;liq.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kyuri qonuni</h3>
              <p className="text-purple-200 text-sm">
                <strong>Formula:</strong> χ = C / T<br/>
                <strong>Kyuri konstantasi:</strong> C = Nμ²/3k<br/>
                <strong>C orqali μ<sub>eff</sub>:</strong> μ<sub>eff</sub> = √(3kC/N) ≈ 2.828√C<br/>
                <strong>Shart:</strong> ionlar orasida ta&apos;sir yo&apos;q (juda suyultirilgan eritmalar)<br/>
                <strong>Grafik:</strong> 1/χ vs T — koordinata boshidan o&apos;tuvchi to&apos;g&apos;ri chiziq
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kyuri-Veys qonuni</h3>
              <p className="text-purple-200 text-sm">
                <strong>Formula:</strong> χ = C / (T−θ)<br/>
                <strong>Veys konstantasi θ:</strong> ionlar orasidagi o&apos;zaro ta&apos;sir kuchi<br/>
                <strong>θ &gt; 0:</strong> ferromagnit almashinuv (parallel spinlar afzal)<br/>
                <strong>θ &lt; 0:</strong> antiferromagnit almashinuv (antiparallel spinlar)<br/>
                <strong>Grafik:</strong> 1/χ vs T — T o&apos;qini θ nuqtada kesadi
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Komplekslar uchun Kyuri-Veys tahlili</h3>
            <p className="text-purple-200 text-sm">
              <strong>[Cr(H₂O)₆]³⁺:</strong> Suyultirilgan eritmada Kyuri qonuniga bo&apos;ysunadi, θ ≈ 0 K.
              μ<sub>eff</sub> = √(3kC/N) ≈ 3.87 μ<sub>B</sub>.<br/>
              <strong>[Cu₂(OAc)₄]:</strong> Kyuri-Veys qonuni, θ ≈ −175 K (kuchli antiferromagnit almashinuv).
              Xona haroratida μ<sub>eff</sub> ≈ 1.4 μ<sub>B</sub> (spin-only 1.73 dan kichik).<br/>
              <strong>[Fe(Cp*)₂]⁺:</strong> Past haroratda ferromagnit tartiblanish, θ ≈ +3 K.
            </p>
          </div>
        </div>

        {/* ── 4. GUI USULI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Gui usuli — klassik magnit o&apos;lchash metodi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Gui usuli (Gouy balance)</strong> — 1889 yilda Louis Georges Gui 
              tomonidan taklif qilingan va hozirgacha <strong>o&apos;quv laboratoriyalarida keng qo&apos;llaniladigan</strong> 
              magnit sezgirlikni o&apos;lchash usuli. Usul <strong>bir jinsli bo&apos;lmagan magnit maydonda</strong> 
              namunaga ta&apos;sir qiluvchi kuchni o&apos;lchashga asoslangan.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                qadam: "Qurilma tuzilishi",
                izoh: "Gui tarozisi kuchli elektromagnit (0.5−2 Tesla), analitik tarozi va uzun tor silindrsimon kyuvetadan iborat. Kyuveta magnit qutblari orasiga shunday joylashtiriladiki, namunaning bir uchi kuchli maydonda, ikkinchi uchi kuchsiz maydonda bo&apos;ladi.",
              },
              {
                qadam: "O&apos;lchash prinsipi",
                izoh: "Namuna bir jinsli bo&apos;lmagan magnit maydonga kiritilganda unga <strong>F = ½(χ<sub>v</sub> − χ<sub>v,muhit</sub>)A(H² − H₀²)</strong> kuch ta&apos;sir qiladi. Bu kuch tarozi yordamida og&apos;irlik o&apos;zgarishi sifatida qayd etiladi. Paramagnit namuna maydon ichiga tortiladi (og&apos;irlik ortadi), diamagnit namuna itariladi.",
              },
              {
                qadam: "Kalibrlash va hisoblash",
                izoh: "Qurilma standart modda (odatda Hg[Co(SCN)₄] yoki [Ni(en)₃]S₂O₃) yordamida kalibrlanadi. Namunaning χ<sub>g</sub> qiymati quyidagi formula orqali hisoblanadi: χ<sub>g</sub> = χ<sub>g,stand</sub> × (Δm<sub>namuna</sub> × m<sub>stand</sub>) / (Δm<sub>stand</sub> × m<sub>namuna</sub>).",
              },
              {
                qadam: "Diamagnit tuzatma",
                izoh: "O&apos;lchangan χ<sub>M</sub> qiymatiga ligandlar va qarshi ionlarning diamagnit hissasi uchun <strong>Paskal konstantalari</strong> yordamida tuzatma kiritiladi. χ<sub>M,paramagnit</sub> = χ<sub>M,o&apos;lchangan</sub> − Σχ<sub>diamagnit</sub>. Bu tuzatma, ayniqsa, katta organik ligandli komplekslarda muhim.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. ZAMONAVIY USULLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 Zamonaviy magnit o&apos;lchash usullari</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                metod: "Faraday usuli",
                prinsip: "Kichik namuna (1−10 mg) bir jinsli bo&apos;lmagan maydonda. Gui usulidan farqli ravishda namuna butunlay bir xil maydon gradientida joylashadi. Aniqligi yuqori.",
                afzallik: "Kichik namuna, yuqori sezgirlik",
                kamchilik: "Murakkab kalibrlash, qimmat qurilma",
              },
              {
                metod: "SQUID magnetometriya",
                prinsip: "O&apos;ta o&apos;tkazuvchan kvant interferension qurilma (SQUID). 10⁻¹² A·m² gacha bo&apos;lgan magnit momentlarni o&apos;lchay oladi. Harorat diapazoni: 1.8−400 K. Maydon: 0−7 Tesla.",
                afzallik: "Eng yuqori sezgirlik, keng harorat diapazoni",
                kamchilik: "Juda qimmat, suyuq geliy kerak",
              },
              {
                metod: "VSM (tebranuvchi namuna magnetometri)",
                prinsip: "Namuna magnit maydonda tebrantiriladi. Hosil bo&apos;lgan o&apos;zgaruvchan magnit oqimi qabul qiluvchi g&apos;altaklarda EYK hosil qiladi. Signal amplitudasi magnit momentga proporsional.",
                afzallik: "Tez o&apos;lchash, oddiy konstruksiya",
                kamchilik: "SQUID dan kam sezgir, kattaroq namuna kerak",
              },
              {
                metod: "Evans usuli (YaMR)",
                prinsip: "Eritmadagi kompleksning magnit sezgirligi YaMR spektrometr yordamida o&apos;lchanadi. Erituvchi signallarining siljishi orqali χ<sub>M</sub> aniqlanadi. 0.01−0.05 M konsentratsiyali eritmalar yetarli.",
                afzallik: "Kichik namuna, eritmada o&apos;lchash, oddiy YaMR kerak",
                kamchilik: "Aniqligi cheklangan (±5−10%), kuchsiz paramagnitlar uchun",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-2">{r.metod}</h3>
                <p className="text-purple-200 text-sm"><strong>Prinsip:</strong> {r.prinsip}</p>
                <div className="flex gap-4 mt-2 text-xs">
                  <span className="text-green-400">✓ {r.afzallik}</span>
                  <span className="text-red-400">✗ {r.kamchilik}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. PASKAL KONSTANTALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Paskal konstantalari — diamagnit tuzatma</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Paskal konstantalari</strong> — atomlar, ionlar va bog&apos;larning 
              diamagnit sezgirlikka qo&apos;shadigan empirik hissalar jadvali. Kompleksning 
              <strong>sof paramagnit sezgirligini</strong> topish uchun o&apos;lchangan umumiy χ<sub>M</sub> dan 
              barcha atomlarning Paskal konstantalari yig&apos;indisi ayriladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Atom/ion</th>
                <th className="py-3 px-4 text-purple-300">χ<sub>dia</sub> (×10⁻⁶ CGS)</th>
                <th className="py-3 px-4 text-purple-300">Atom/ion</th>
                <th className="py-3 px-4 text-purple-300">χ<sub>dia</sub> (×10⁻⁶ CGS)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["H", "−2.93", "H₂O", "−13"],
                  ["C", "−6.00", "NH₃", "−18"],
                  ["N (amin)", "−5.57", "Cl⁻", "−23.4"],
                  ["O (sp³)", "−4.61", "Br⁻", "−34.6"],
                  ["F⁻", "−9.1", "I⁻", "−50.6"],
                  ["CN⁻", "−13", "C≡C", "+0.8"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mt-4">
            <h3 className="text-yellow-400 font-bold mb-2">Hisoblash misoli: [Cr(en)₃]Cl₃</h3>
            <p className="text-purple-200 text-sm">
              <strong>Formula:</strong> [Cr(C₂H₈N₂)₃]Cl₃ = Cr + 6C + 24H + 6N + 3Cl<br/>
              <strong>Diamagnit tuzatma:</strong> Σχ<sub>dia</sub> = Cr³⁺ (−11) + 6×C(−6.00) + 24×H(−2.93) + 6×N(amin)(−5.57) + 3×Cl⁻(−23.4)<br/>
              = −11 − 36.00 − 70.32 − 33.42 − 70.2 = <strong>−220.94 × 10⁻⁶ CGS</strong><br/>
              Agar χ<sub>M,o&apos;lchangan</sub> = +6,280 × 10⁻⁶ bo&apos;lsa,<br/>
              χ<sub>M,paramagnit</sub> = 6,280 − (−220.94) = <strong>+6,501 × 10⁻⁶ CGS</strong><br/>
              μ<sub>eff</sub> = 2.828√(χ<sub>M,para</sub> × T) = 2.828√(6501×10⁻⁶ × 298) ≈ <strong>3.84 μ<sub>B</sub></strong>
            </p>
          </div>
        </div>

        {/* ── 7. χ DAN μeff NI HISOBLASH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧮 χ<sub>M</sub> dan μ<sub>eff</sub> ni hisoblash</h2>
          
          <div className="space-y-4">
            {[
              {
                qadam: "1-qadam: χ<sub>M</sub> ni o&apos;lchash",
                izoh: "Gui tarozisi yoki boshqa usul yordamida xona haroratida (T = 298 K) namunaning molyar magnit sezgirligi o&apos;lchanadi. CGS birliklar tizimida: χ<sub>M</sub> (cm³/mol).",
              },
              {
                qadam: "2-qadam: Diamagnit tuzatma kiritish",
                izoh: "Paskal konstantalari yordamida barcha atomlar va ionlarning diamagnit hissalari yig&apos;indisi hisoblanadi va χ<sub>M,o&apos;lchangan</sub> dan ayriladi: χ<sub>M,para</sub> = χ<sub>M,o&apos;lch</sub> − Σχ<sub>dia</sub>.",
              },
              {
                qadam: "3-qadam: μ<sub>eff</sub> ni hisoblash",
                izoh: "Asosiy formula (CGS): <strong>μ<sub>eff</sub> = 2.828√(χ<sub>M,para</sub> × T)</strong>. Bu yerda T — Kelvin harorati. SI birliklarida: μ<sub>eff</sub> = 798√(χ<sub>M,para</sub> × T).",
              },
              {
                qadam: "4-qadam: n (juftlanmagan e⁻ soni) ni topish",
                izoh: "Hisoblangan μ<sub>eff</sub> ni spin-only qiymatlar bilan solishtiring: 1.73 (n=1), 2.83 (n=2), 3.87 (n=3), 4.90 (n=4), 5.92 (n=5). Orbital hissa tufayli chetlanishlarni hisobga oling.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.qadam}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Magnit sezgirlik χ</strong> — moddaning magnitlanish qobiliyatini xarakterlovchi asosiy kattalik</li>
            <li><strong className="text-yellow-400">Kyuri qonuni:</strong> χ = C/T — ideal paramagnitlar uchun; Kyuri-Veys: χ = C/(T−θ) — o&apos;zaro ta&apos;sirli sistemalar</li>
            <li><strong className="text-yellow-400">Gui usuli</strong> — bir jinsli bo&apos;lmagan maydonda kuch o&apos;lchashga asoslangan klassik metod</li>
            <li><strong className="text-yellow-400">Zamonaviy usullar:</strong> SQUID (eng sezgir), VSM (tez), Evans YaMR (eritmada, oddiy)</li>
            <li><strong className="text-yellow-400">μ<sub>eff</sub> = 2.828√(χ<sub>M,para</sub> × T)</strong> — magnit sezgirlikdan effektiv magnit momentni hisoblash</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/magnit/magnit-moment" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Magnit moment nazariyasi
          </Link>
          <Link href="/ilmiy/chuqurlashgan/magnit/spin-orbit" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            Spin-orbit bog&apos;lanish →
          </Link>
        </div>

      </section>
    </main>
  )
}