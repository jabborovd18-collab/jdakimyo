import Link from "next/link"

export default function Sisplatin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧪 sis-[PtCl₂(NH₃)₂]</h1>
          <p className="text-purple-400 text-sm">sis-diammindixloroplatina(II) • Sisplatin • Saratonga qarshi dori</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. ASOSIY MA'LUMOTLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Asosiy ma&apos;lumotlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-purple-400 text-xs mb-1">IUPAC nomi</div>
              <div className="text-white font-bold">sis-diammindixloroplatina(II)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">💊</div>
              <div className="text-purple-400 text-xs mb-1">Tibbiy nomi</div>
              <div className="text-yellow-400 font-bold">SISPLATIN</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">300.05 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "To&apos;q sariq kristall"],
              ["Holati", "Qattiq modda"],
              ["CAS raqami", "15663-27-1"],
              ["Zichlik", "3.74 g/cm³"],
              ["Eruvchanlik (suv)", "1 mg/mL (25°C)"],
              ["Eruvchanlik (DMSO)", "Yaxshi eriydi"],
              ["Geometriya", "Tekis kvadrat"],
              ["Koordinatsion son", "4"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/20 rounded-xl p-3 text-center">
                <div className="text-purple-400 text-xs">{r[0]}</div>
                <div className="text-white font-semibold text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. TARIXIY AHAMIYATI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🏆 Tarixiy ahamiyati — tasodifiy kashfiyotdan Nobel mukofotigacha</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Sisplatin</strong> — saratonga qarshi eng samarali dorilardan biri.
              1845 yilda Michel Peyrone tomonidan sintez qilingan, lekin uning biologik faolligi faqat 
              <strong> 1965 yilda Barnett Rosenberg</strong> tomonidan kashf etilgan. Rosenberg 
              <strong> E. coli bakteriyalarining bo&apos;linishiga</strong> elektr maydon ta&apos;sirini 
              o&apos;rganayotganda, platina elektrodlaridan hosil bo&apos;lgan sisplatin 
              bakteriyalarning bo&apos;linishini to&apos;xtatishini aniqladi. 1978 yilda AQShda 
              saratonga qarshi dori sifatida tasdiqlangan. Hozirda <strong>saratonning 20 dan ortiq 
              turini</strong> davolashda qo&apos;llaniladi.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {[
              "1965 — Rosenberg tomonidan biologik faolligi kashf etilgan",
              "1971 — klinik sinovlar boshlangan",
              "1978 — FDA tomonidan tasdiqlangan birinchi platina asosidagi dori",
              "Hozirda — JSSTning &quot;Eng muhim dori vositalari&quot; ro&apos;yxatida",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-xs">{i + 1}.</span>
                <p className="text-purple-200 text-xs">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Pt²⁺ erkin ioni",
                matn: "Pt: [Xe] 4f¹⁴ 5d⁹ 6s¹. Pt²⁺: [Xe] 4f¹⁴ 5d⁸. 8 ta d-elektron. Kvadrat-planar geometriya d⁸ konfiguratsiya uchun eng barqaror.",
              },
              {
                sarlavha: "Kvadrat-planar maydonda d-orbital ajralishi",
                matn: "D<sub>4h</sub> simmetriyada 5 ta d-orbital 4 ta sathga ajraladi: d<sub>xy</sub> (b₂<sub>g</sub>), d<sub>xz</sub>,d<sub>yz</sub> (e<sub>g</sub>), d<sub>z²</sub> (a₁<sub>g</sub>), d<sub>x²−y²</sub> (b₁<sub>g</sub> — eng yuqori). d<sub>x²−y²</sub> orbital bo&apos;sh — ligand hujumi uchun ochiq.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "d⁸ kvadrat-planar — barcha elektronlar juftlashgan (yuqori energiyali d<sub>x²−y²</sub> bo&apos;sh). n = 0, μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong>",
              },
              {
                sarlavha: "18-elektron qoidasi",
                matn: "Pt²⁺ — 8 ta d-elektron. 4 ta ligand — 8 ta elektron. Jami: 16 ta valent elektron. 18-elektron qoidasiga erishish uchun 2 ta elektron yetishmaydi — bu aksial hujum uchun ochiq pozitsiya yaratadi. Shuning uchun A mexanizm.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. GEOMETRIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 Geometriya va simmetriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geometrik parametrlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Geometriya:</strong> Tekis kvadrat (D<sub>4h</sub> emas, C<sub>2v</sub>)<br/>
                <strong>Nuqtali guruh:</strong> C<sub>2v</sub> (sis-izomer)<br/>
                <strong>Pt−Cl masofa:</strong> 2.33 Å<br/>
                <strong>Pt−N masofa:</strong> 2.01 Å<br/>
                <strong>Cl−Pt−Cl burchak:</strong> 91.9°<br/>
                <strong>N−Pt−N burchak:</strong> 87.0°<br/>
                <strong>Dipol moment:</strong> ≈ 3.2 D (sis — qutbli!)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Sis vs Trans izomerlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>sis-izomer (C<sub>2v</sub>):</strong><br/>
                • Dipol moment: 3.2 D (qutbli)<br/>
                • Suvda oz eriydi (1 mg/mL)<br/>
                • <strong>Biologik faol!</strong><br/>
                <strong>trans-izomer (D<sub>2h</sub>):</strong><br/>
                • Dipol moment: 0 D (qutbsiz)<br/>
                • Suvda deyarli erimaydi<br/>
                • <strong>Biologik faol emas!</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. TA'SIR MEXANIZMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Ta&apos;sir mexanizmi — DNK bilan bog&apos;lanish</h2>
          
          <div className="space-y-4">
            {[
              {
                bosqich: "1. Sisplatin hujayraga kiradi",
                izoh: "Sisplatin neytral molekula sifatida hujayra membranasidan passiv diffuziya orqali o&apos;tadi. Hujayra ichida Cl⁻ konsentratsiyasi past (4 mM vs 100 mM tashqarida) — gidroliz boshlanadi.",
              },
              {
                bosqich: "2. Akvatsiya (gidroliz)",
                izoh: "sis-[PtCl₂(NH₃)₂] + H₂O → sis-[PtCl(H₂O)(NH₃)₂]⁺ + Cl⁻. Birinchi Cl⁻ suv molekulasiga almashadi. Hosil bo&apos;lgan musbat zaryadli kompleks DNK ga yaqinlashadi.",
              },
              {
                bosqich: "3. DNK bilan bog&apos;lanish",
                izoh: "Pt markazi DNK dagi guanin asosining N7 atomi bilan kovalent bog&apos; hosil qiladi. Ikkinchi Cl⁻ ham almashinib, DNK ning ikkinchi guaniniga bog&apos;lanadi. <strong>Ichki zanjirli kesishgan bog&apos;</strong> hosil bo&apos;ladi.",
              },
              {
                bosqich: "4. DNK replikatsiyasi bloklanadi",
                izoh: "Pt-DNK kesishgan bog&apos;i DNK spiralini bukadi (taxminan 35−40° ga). DNK polimeraza bu to&apos;siqdan o&apos;ta olmaydi — replikatsiya to&apos;xtaydi. Hujayra apoptoz (dasturlangan o&apos;lim) yo&apos;liga kiradi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.bosqich}</h3>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mt-4">
            <p className="text-yellow-300 text-sm">
              <strong>Nega trans izomer faol emas?</strong> Trans izomerda ikkala Cl⁻ qarama-qarshi tomonda 
              joylashgan — ular bir vaqtda DNKning ikkita guaniniga bog&apos;lana olmaydi (sterik to&apos;siq).
              Sis izomerda esa Cl⁻ lar yonma-yon — DNK bilan kesishgan bog&apos; hosil qilish uchun ideal joylashuv.
            </p>
          </div>
        </div>

        {/* ── 6. SPEKTROSKOPIK XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Spektroskopik xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "UB-Vis spektroskopiya",
                matn: "d⁸ kvadrat-planar — d-d o&apos;tishlar ko&apos;rinadigan sohada. λ<sub>max</sub> = 305 nm (ε ≈ 150). <strong>Rangi:</strong> to&apos;q sariq. Pt²⁺ da 5d orbitallar kuchli ligand maydoni ta&apos;sirida — yuqori energiyali d-d o&apos;tishlar.",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(N−H):</strong> 3280, 3200 cm⁻¹ (simmetrik va asimmetrik). <strong>δ(H−N−H):</strong> 1600 cm⁻¹. <strong>ν(Pt−N):</strong> 510 cm⁻¹. <strong>ν(Pt−Cl):</strong> 330, 320 cm⁻¹ (sis — ikkita polosa). Trans izomerda faqat bitta Pt−Cl polosa kuzatiladi!",
              },
              {
                usul: "¹⁹⁵Pt YaMR",
                matn: "¹⁹⁵Pt (I=½, tabiiy miqdori 33.8%). Kimyoviy siljish δ ≈ −2100 ppm (sis-izomer). Trans izomerda δ ≈ −1950 ppm. YaMR orqali sis/trans izomerlarni ishonchli farqlash mumkin.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. OLINISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Olinishi — trans-ta&apos;sir yordamida</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "K₂[PtCl₄] dan trans-ta&apos;sir yordamida",
                reaksiya: "K₂[PtCl₄] + 2NH₃ → sis-[PtCl₂(NH₃)₂] + 2KCl",
                izoh: "Cl⁻ — kuchsiz trans-ta&apos;sir. Birinchi NH₃ birikkandan keyin, unga trans Cl⁻ sekin almashadi. Ikkinchi NH₃ birinchi NH₃ ga sis holatda birikadi. <strong>Natija: sof sis izomer.</strong> Trans-ta&apos;sir qoidasi tufayli aynan sis izomer hosil bo&apos;ladi.",
              },
              {
                usul: "Trans izomerdan farqi",
                reaksiya: "[Pt(NH₃)₄]Cl₂ + 2HCl → trans-[PtCl₂(NH₃)₂] + 2NH₄Cl (qizdirish bilan)",
                izoh: "Trans izomer olish uchun [Pt(NH₃)₄]Cl₂ dan boshlanadi. NH₃ — kuchsiz trans-ta&apos;sir, Cl⁻ birikkandan keyin unga trans NH₃ almashadi. Natija: trans izomer.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-green-400 text-sm font-semibold mb-1">{r.reaksiya}</p>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. YON TA'SIRLARI ── */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">⚠️ Yon ta&apos;sirlari va kamchiliklari</h2>
          <div className="space-y-2 text-sm">
            {[
              "Nefrotoksiklik — buyrakka zarar yetkazadi (dozani cheklovchi asosiy omil)",
              "Neyrotoksiklik — periferik nerv sistemasi zararlanishi",
              "Otoksiklik — eshitish qobiliyatiga ta&apos;sir (quloqda shovqin, eshitish pasayishi)",
              "Kuchli ko&apos;ngil aynishi va qusish (antiemetiklar bilan birga qo&apos;llaniladi)",
              "Dori qarshiligi — ba&apos;zi saraton turlari sisplatinga chidamli bo&apos;lib qoladi",
              "Suvda kam eruvchanligi (1 mg/mL) — tomir ichiga yuborish uchun fiziologik eritmada eritiladi",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30 flex items-start gap-3">
                <span className="text-red-400 font-bold text-xs">{i + 1}.</span>
                <p className="text-purple-200 text-xs">{r}</p>
              </div>
            ))}
          </div>
          <p className="text-purple-300 text-sm mt-4">
            <strong>Zamonaviy analoglar:</strong> Karboplatin (kamroq nefrotoksik), Oksaliplatin (yo&apos;g&apos;on ichak saratonida).
            Bu dorilar sisplatindan keyingi avlod platina dorilari hisoblanadi.
          </p>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>sis-[PtCl₂(NH₃)₂] — <strong className="text-yellow-400">SISPLATIN</strong>, saratonga qarshi eng samarali dorilardan biri</li>
            <li>Pt²⁺ (d⁸) — <strong>kvadrat-planar</strong> geometriya (C<sub>2v</sub>), diamagnit</li>
            <li><strong>Faqat sis izomer biologik faol</strong> — trans izomer DNK bilan kesishgan bog&apos; hosil qila olmaydi</li>
            <li>Trans-ta&apos;sir qoidalari yordamida <strong>selektiv sintez qilinadi</strong></li>
            <li>DNK dagi ikkita guanin N7 atomi bilan bog&apos;lanib, <strong>replikatsiyani bloklaydi</strong></li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/ferrosen" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Fe(C₅H₅)₂] →
          </Link>
        </div>

      </section>
    </main>
  )
}