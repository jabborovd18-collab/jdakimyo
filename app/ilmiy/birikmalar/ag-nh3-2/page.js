import Link from "next/link"

export default function AgNH32() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🧪 [Ag(NH₃)₂]⁺</h1>
          <p className="text-purple-400 text-sm">diamminkumush(I) ioni • Tollens reaktivi • Chiziqli d¹⁰ kompleks</p>
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
              <div className="text-white font-bold">diamminkumush(I) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔬</div>
              <div className="text-purple-400 text-xs mb-1">Tarixiy nomi</div>
              <div className="text-cyan-400 font-bold">Tollens reaktivi</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">141.94 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Rangsiz"],
              ["Holati", "Eritmada mavjud"],
              ["Koordinatsion son", "2"],
              ["Nuqtali guruh", "D<sub>∞h</sub>"],
              ["Metall ioni", "Ag⁺ (d¹⁰)"],
              ["Geometriya", "Chiziqli"],
              ["Barqarorlik", "log β₂ = 7.2"],
              ["Magnit xossasi", "Diamagnit"],
              ["Gibridlanish", "sp"],
              ["Bog&apos; burchagi", "180°"],
              ["Ag−N masofa", "2.12 Å"],
              ["Eruvchanlik", "Suvda yaxshi"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/20 rounded-xl p-3 text-center">
                <div className="text-purple-400 text-xs">{r[0]}</div>
                <div className="text-white font-semibold text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — d¹⁰ chiziqli kompleks</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Ag⁺ — d¹⁰ konfiguratsiya",
                matn: "Ag: [Kr] 4d¹⁰5s¹. Ag⁺: [Kr] 4d¹⁰. Barcha 10 ta d-elektron to&apos;liq juftlashgan — d-orbitallar to&apos;liq to&apos;lgan. Juftlanmagan elektronlar yo&apos;q.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "d¹⁰ konfiguratsiya — barcha elektronlar juftlashgan, n = 0. μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong> Bu barcha d¹⁰ komplekslar uchun xos xususiyat (Cu⁺, Ag⁺, Au⁺, Zn²⁺, Cd²⁺, Hg²⁺).",
              },
              {
                sarlavha: "Nima uchun chiziqli geometriya?",
                matn: "Ag⁺ da d-orbitallar to&apos;liq to&apos;lgan — KMBE = 0. Geometriya faqat <strong>sterik va elektrostatik omillar</strong> bilan belgilanadi. Ikkita NH₃ ligandi bir-biridan iloji boricha uzoqroq joylashadi — chiziqli geometriya (180°). KS=2 uchun bu — optimal geometriya.",
              },
              {
                sarlavha: "sp-Gibridlanish",
                matn: "Ag⁺ ning 5s va 5p orbitallari sp-gibridlanadi. Hosil bo&apos;lgan ikkita sp-gibrid orbital 180° burchak ostida joylashgan — har biri bittadan NH₃ ligandi bilan σ-bog&apos; hosil qiladi. Gibridlanish sxemasi: sp (chiziqli) — bu KS=2 uchun xos.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. GEOMETRIYA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 Geometriya va simmetriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geometrik parametrlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Geometriya:</strong> Chiziqli<br/>
                <strong>Nuqtali guruh:</strong> D<sub>∞h</sub><br/>
                <strong>Ag−N masofa:</strong> 2.12 Å<br/>
                <strong>N−H masofa:</strong> 1.01 Å<br/>
                <strong>N−Ag−N burchak:</strong> 180°<br/>
                <strong>Ag−N−H burchak:</strong> ≈ 109.5°<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> D<sub>∞h</sub><br/>
                <strong>Asosiy o&apos;q:</strong> C<sub>∞</sub> (N−Ag−N chizig&apos;i bo&apos;ylab)<br/>
                <strong>Perpendikulyar C₂:</strong> Cheksiz ko&apos;p<br/>
                <strong>σ<sub>h</sub>:</strong> Ag atomi orqali, o&apos;qqa perpendikulyar<br/>
                <strong>σ<sub>v</sub>:</strong> Cheksiz ko&apos;p<br/>
                <strong>Inversiya markazi:</strong> Ha (Ag atomida)<br/>
                <strong>Jami amallar:</strong> Cheksiz
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. SPEKTROSKOPIK XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Spektroskopik xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "UB-Vis spektroskopiya",
                matn: "d¹⁰ konfiguratsiya — d-d o&apos;tishlar mavjud emas (d-orbitallar to&apos;liq to&apos;lgan). Zaryad ko&apos;chishi (MLCT yoki LMCT) UB sohada kuzatiladi (&lt; 300 nm). <strong>Rangi:</strong> rangsiz. Barcha d¹⁰ komplekslari rangsiz bo&apos;ladi (d-d o&apos;tishlar yo&apos;qligi tufayli).",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(N−H):</strong> 3300−3400 cm⁻¹ (koordinatsiyalangan NH₃ uchun xos). <strong>δ(H−N−H):</strong> 1600−1650 cm⁻¹. <strong>ν(Ag−N):</strong> 450 cm⁻¹ (past chastotali — og&apos;ir Ag atomi tufayli). <strong>ρ(NH₃):</strong> 750 cm⁻¹.",
              },
              {
                usul: "¹⁰⁷Ag/¹⁰⁹Ag YaMR",
                matn: "¹⁰⁷Ag (I=½, tabiiy miqdori 51.8%) va ¹⁰⁹Ag (I=½, 48.2%). Kimyoviy siljish δ ≈ −50 dan +200 ppm gacha (ligandga bog&apos;liq). [Ag(NH₃)₂]⁺ uchun δ ≈ +50 ppm (AgNO₃ standartiga nisbatan).",
              },
              {
                usul: "Mass-spektrometriya (ESI-MS)",
                matn: "Musbat ion rejimida: [Ag(NH₃)₂]⁺ — 142 m/z (¹⁰⁷Ag). Izotop namunasi: 142 (¹⁰⁷Ag) va 144 (¹⁰⁹Ag) — intensivlik nisbati ~1:1. Fragmentlanish: [Ag(NH₃)₂]⁺ → [Ag(NH₃)]⁺ (125 m/z) → Ag⁺ (108 m/z).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. OLINISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Olinishi — Tollens reaktivi</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "AgNO₃ dan NH₃ bilan — Tollens reaktivi",
                reaksiya: "AgNO₃ + 2NH₃ → [Ag(NH₃)₂]NO₃ (Tollens reaktivi)",
                izoh: "Kumush nitrat eritmasiga asta-sekin ammiak qo&apos;shiladi. Dastlab Ag₂O cho&apos;kmasi tushadi (jigarrang), so&apos;ng ortiqcha NH₃ da erib, rangsiz [Ag(NH₃)₂]⁺ eritmasi hosil bo&apos;ladi. <strong>Ehtiyot!</strong> Eritma uzoq vaqt saqlansa, Ag₃N (portlovchi modda) hosil bo&apos;lishi mumkin.",
              },
              {
                usul: "AgCl dan NH₃ bilan",
                reaksiya: "AgCl↓ + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻",
                izoh: "Kumush xlorid cho&apos;kmasi ammiak eritmasida eriydi. Bu reaksiya AgCl ni boshqa galogenidlardan (AgBr, AgI) farqlash uchun ishlatiladi — AgBr va AgI ammiakda erimaydi.",
              },
              {
                usul: "Ag₂O dan NH₃ bilan",
                reaksiya: "Ag₂O + 4NH₃ + H₂O → 2[Ag(NH₃)₂]⁺ + 2OH⁻",
                izoh: "Kumush oksid ammiak eritmasida erib, Tollens reaktivi hosil qiladi. Bu reaksiya ammiakning Ag⁺ bilan kompleks hosil qilish qobiliyatini ko&apos;rsatadi.",
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

        {/* ── 6. TOLLENS REAKSIYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🥈 Tollens reaksiyasi — &quot;kumush ko&apos;zgu&quot;</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Tollens reaksiyasi</strong> — aldegidlarni aniqlashning 
              klassik sifatiy reaksiyasi. <strong>Tollens reaktivi</strong> ([Ag(NH₃)₂]OH) aldegidlar bilan 
              reaksiyaga kirishib, <strong>metallik kumush</strong>ni qaytaradi. Kumush probirka devorida 
              yupqa qatlam hosil qiladi — &quot;kumush ko&apos;zgu&quot; effekti.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                reaksiya: "Aldegid bilan — kumush ko&apos;zgu",
                tenglama: "RCHO + 2[Ag(NH₃)₂]⁺ + 3OH⁻ → RCOO⁻ + 2Ag↓ + 4NH₃ + 2H₂O",
                izoh: "Aldegid oksidlanib karbon kislotaga aylanadi, Ag⁺ esa metallik kumushgacha qaytariladi. Bu reaksiya <strong>faqat aldegidlar</strong> uchun xos — ketonlar reaksiyaga kirishmaydi. Formaldegid, glyukoza va boshqa qaytaruvchi qandlar ham musbat reaksiya beradi.",
              },
              {
                reaksiya: "Spirtlar bilan — reaksiya bermaydi",
                izoh: "Spirtlar Tollens reaktivi bilan reaksiyaga kirishmaydi. Bu aldegidlarni spirtlardan farqlash imkonini beradi. Birlamchi va ikkilamchi spirtlar reaksiyaga kirishmaydi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                {r.tenglama && <p className="text-green-400 text-sm font-semibold mb-1">{r.tenglama}</p>}
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. BARQARORLIK ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Barqarorlik va dissotsilanish</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Bosqichli barqarorlik konstantalari",
                matn: "<strong>Ag⁺ + NH₃ ⇌ [Ag(NH₃)]⁺:</strong> log K₁ = 3.3<br/><strong>[Ag(NH₃)]⁺ + NH₃ ⇌ [Ag(NH₃)₂]⁺:</strong> log K₂ = 3.9<br/><strong>Umumiy:</strong> log β₂ = 7.2. K₂ &gt; K₁ — bu noodatiy holat! (odatda K₁ &gt; K₂). Sababi: birinchi NH₃ birikkandan keyin Ag⁺ yumshoqroq kislota bo&apos;lib qoladi.",
              },
              {
                sarlavha: "Kislotali muhitda parchalanish",
                matn: "Kislota qo&apos;shilganda NH₃ protonlanadi: [Ag(NH₃)₂]⁺ + 2H⁺ → Ag⁺ + 2NH₄⁺. Kompleks buziladi, Ag⁺ erkin holatga o&apos;tadi. Bu reaksiya Tollens reaktividan keyin ortiqcha kumushni yo&apos;qotish uchun ishlatiladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-3">
            {[
              "Analitik kimyoda aldegidlarni aniqlash — Tollens reaksiyasi (&quot;kumush ko&apos;zgu&quot; testi)",
              "Organik sintezda oksidlovchi sifatida — aldegidlarni karbon kislotalargacha oksidlash",
              "Galogenidlarni farqlash — AgCl ammiakda eriydi, AgBr va AgI erimaydi",
              "Kumushni qayta ishlash — AgCl va Ag₂O ni ammiakda eritib, elektroliz orqali toza kumush olish",
              "Nanozarralar sintezi — [Ag(NH₃)₂]⁺ qaytarilganda nanoserebro hosil bo&apos;ladi",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 9. XAVFSIZLIK ── */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">⚠️ Xavfsizlik</h2>
          <p className="text-purple-200 text-sm">
            <strong>Tollens reaktivi uzoq vaqt saqlanmasligi kerak!</strong> Eritmada Ag₃N (kumush nitrid) 
            hosil bo&apos;lishi mumkin — bu modda juda portlovchi! Reaktiv ishlatilishdan oldin tayyorlanadi 
            va ishlatilgandan keyin darhol HNO₃ bilan neytrallanadi. Quruq Ag₃N zarba va ishqalanishdan 
            portlashi mumkin.
          </p>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Ag(NH₃)₂]⁺ — <strong className="text-yellow-400">Tollens reaktivi</strong>, chiziqli d¹⁰ kompleks</li>
            <li>Ag⁺ (d¹⁰) — <strong>diamagnit</strong>, rangsiz, d-d o&apos;tishlar yo&apos;q</li>
            <li><strong>Chiziqli geometriya</strong> (sp-gibridlanish), N−Ag−N = 180°</li>
            <li><strong>Tollens reaksiyasi:</strong> aldegidlarni aniqlash — &quot;kumush ko&apos;zgu&quot;</li>
            <li>K₂ &gt; K₁ — noodatiy holat, sababi yumshoq kislota xossasining kuchayishi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/co-cl4" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold transition-all">
            [CoCl₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}