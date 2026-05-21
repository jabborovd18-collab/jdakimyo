import Link from "next/link"

export default function CoNH36Cl3() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧪 [Co(NH₃)₆]Cl₃</h1>
          <p className="text-purple-400 text-sm">geksaamminkobalt(III) xlorid • "Verner klassikasi" • Hexaamminecobalt(III) chloride</p>
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
              <div className="text-white font-bold">geksaamminkobalt(III) xlorid</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🏷️</div>
              <div className="text-purple-400 text-xs mb-1">Tarixiy ahamiyati</div>
              <div className="text-orange-400 font-bold">Verner klassikasi</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">267.48 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Zarg&apos;aldoq-sariq"],
              ["Holati", "Qattiq kristall"],
              ["CAS raqami", "10534-89-1"],
              ["Zichlik", "1.71 g/cm³"],
              ["Eruvchanlik (suv)", "Yaxshi eriydi"],
              ["Eruvchanlik (etanol)", "Erimaydi"],
              ["Sistema", "Monoklinik"],
              ["Barqarorlik", "Yuqori (inert)"],
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
          <h2 className="text-xl font-bold text-white mb-6">🏆 Tarixiy ahamiyati — Verner va Nobel mukofoti</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[Co(NH₃)₆]Cl₃</strong> — koordinatsion kimyoning 
              <strong> eng muhim tarixiy birikmalaridan biri</strong>. Aynan shu birikma va uning hosilalari 
              yordamida <strong>Alfred Verner</strong> 1893 yilda o&apos;zining mashhur 
              <strong> koordinatsion nazariyasini</strong> yaratdi. Verner bu ishi uchun 
              <strong> 1913 yilda Nobel mukofoti</strong>ga sazovor bo&apos;ldi — bu noorganik kimyoda 
              berilgan <strong>birinchi Nobel mukofoti</strong> edi.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Verner [Co(NH₃)₆]Cl₃ ning elektr o&apos;tkazuvchanligini o&apos;lchab, 4 ta ionga dissotsilanishini aniqladi: [Co(NH₃)₆]³⁺ + 3Cl⁻",
              "Bu kuzatish &quot;geksaammin&quot; formulasi to&apos;g&apos;ri ekanligini isbotladi — 6 ta NH₃ bevosita Co ga bog&apos;langan",
              "Verner, shuningdek, [Co(NH₃)₅Cl]Cl₂ (5 ion) va [Co(NH₃)₄Cl₂]Cl (4 ion) kabi hosilalarni sintez qildi",
              "Bu kashfiyotlar <strong>koordinatsion son, ichki va tashqi sfera</strong> tushunchalarining asosini yaratdi",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — nega diamagnit?</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Co³⁺ erkin ioni",
                matn: "Co: [Ar] 3d⁷4s². Co³⁺: [Ar] 3d⁶. 6 ta d-elektron. Oktaedrik maydonda yuqori spin (t₂g⁴ eg², n=4, paramagnit) yoki quyi spin (t₂g⁶ eg⁰, n=0, diamagnit) bo&apos;lishi mumkin.",
              },
              {
                sarlavha: "NH₃ — kuchli maydonli ligand",
                matn: "NH₃ spektrokimyoviy qatorda H₂O dan yuqorida, lekin CN⁻ dan pastda. Co³⁺ uchun Δ<sub>o</sub> ≈ 23,000 cm⁻¹. Juflanish energiyasi P ≈ 21,000 cm⁻¹. Δ<sub>o</sub> &gt; P → <strong>quyi spinli</strong>. Barcha 6 ta elektron t₂g orbitallarda juftlashgan.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "t₂g⁶ eg⁰ — n = 0, μ<sub>eff</sub> = 0. <strong>Diamagnit!</strong> Bu — Co³⁺ uchun eng barqaror holat. Gui tarozisi bilan tekshirilganda namuna itariladi.",
              },
              {
                sarlavha: "KMBE",
                matn: "KMBE = 6 × (−0.4Δ<sub>o</sub>) + 0 × (+0.6Δ<sub>o</sub>) = <strong>−2.4Δ<sub>o</sub></strong>. Bu — d⁶(QS) konfiguratsiya uchun maksimal KMBE. Shuning uchun [Co(NH₃)₆]³⁺ <strong>juda barqaror va juda inert</strong> — ligand almashinishi xona haroratida deyarli bormaydi.",
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
                <strong>Geometriya:</strong> Oktaedrik<br/>
                <strong>Nuqtali guruh:</strong> O<sub>h</sub><br/>
                <strong>Co−N masofa:</strong> 1.96 Å<br/>
                <strong>N−H masofa:</strong> 1.01 Å<br/>
                <strong>Co−N−H burchak:</strong> ≈ 109.5° (sp³ gibridlangan N)<br/>
                <strong>N−Co−N burchak:</strong> 90° va 180°
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kristall tuzilishi</h3>
              <p className="text-purple-200 text-sm">
                <strong>Sistema:</strong> Monoklinik<br/>
                <strong>Fazoviy guruh:</strong> C2/m<br/>
                <strong>a =</strong> 10.9 Å, <strong>b =</strong> 10.9 Å<br/>
                <strong>c =</strong> 15.3 Å, <strong>β =</strong> 96°<br/>
                <strong>Tashqi sfera:</strong> 3 ta Cl⁻ ionlari<br/>
                <strong>Vodorod bog&apos;lar:</strong> N−H···Cl
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. SPEKTROSKOPIK XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Spektroskopik xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "UB-Vis spektroskopiya",
                matn: "d⁶ quyi spin — t₂g⁶ eg⁰. d-d o&apos;tish: t₂g⁶ → t₂g⁵ eg¹. Ikkita spin-ruxsat o&apos;tish: ¹A₁<sub>g</sub> → ¹T₁<sub>g</sub> (λ=475 nm, ε≈80) va ¹A₁<sub>g</sub> → ¹T₂<sub>g</sub> (λ=340 nm, ε≈60). <strong>Rangi:</strong> zarg&apos;aldoq-sariq (ko&apos;k-binafsha nurlarni yutadi).",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(N−H):</strong> 3200−3300 cm⁻¹. <strong>δ(H−N−H):</strong> 1600−1650 cm⁻¹. <strong>ν(Co−N):</strong> 495 cm⁻¹. <strong>ρ(NH₃):</strong> 830 cm⁻¹. NH₃ ligandlarining ichki tebranishlari va Co−N valent tebranishi.",
              },
              {
                usul: "Kinetik inertlik",
                matn: "[Co(NH₃)₆]³⁺ <strong>juda inert</strong> — ligand almashinishi xona haroratida deyarli bormaydi. t<sub>½</sub> &gt; bir necha kun. Sababi: yuqori KMBE (2.4Δ<sub>o</sub>). Izotop almashinuvi (¹⁵NH₃ bilan) kunlar davomida kuzatiladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 6. OLINISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Olinishi</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "Co²⁺ dan oksidlovchi sintez",
                reaksiya: "4CoCl₂ + 4NH₄Cl + 20NH₃ + O₂ → 4[Co(NH₃)₆]Cl₃ + 2H₂O",
                izoh: "Co²⁺ tuzi suvli ammiak eritmasida havo kislorodi yordamida Co³⁺ gacha oksidlanadi. Ko&apos;mir katalizatori (faollangan ko&apos;mir) reaksiyani tezlashtiradi. Eritma bug&apos;latilgach, zarg&apos;aldoq-sariq kristallar hosil bo&apos;ladi. Bu — eng oddiy laboratoriya usuli.",
              },
              {
                usul: "H₂O₂ bilan oksidlash",
                reaksiya: "2CoCl₂ + 2NH₄Cl + 10NH₃ + H₂O₂ → 2[Co(NH₃)₆]Cl₃ + 2H₂O",
                izoh: "Vodorod peroksid kuchli oksidlovchi sifatida ishlatiladi. Reaksiya tez va toza boradi. Ko&apos;mir katalizatori kerak emas.",
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

        {/* ── 7. XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari</h2>
          
          <div className="space-y-3">
            {[
              "Suvda yaxshi eriydi — [Co(NH₃)₆]³⁺ va 3Cl⁻ ionlariga dissotsilanadi. Elektr o&apos;tkazuvchanligi 4-ionli elektrolitga mos.",
              "Ishqoriy muhitda barqaror, kislotali muhitda NH₃ protonlanadi, lekin ichki sfera sekin buziladi.",
              "Qizdirilganda NH₃ molekulalarini yo&apos;qotadi: [Co(NH₃)₆]Cl₃ → CoCl₂ + NH₃ + NH₄Cl (300°C dan yuqori).",
              "Boshqa ligandlar bilan almashinish juda sekin — inert kompleks. Faqat yuqori haroratda yoki katalizator ishtirokida.",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-orange-600/10 to-purple-600/10 border border-orange-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Co(NH₃)₆]Cl₃ — <strong className="text-yellow-400">Verner klassikasi</strong>, koordinatsion kimyoning asoschisi</li>
            <li>Co³⁺ (d⁶) — <strong>quyi spinli</strong>, barcha elektronlar juftlashgan — diamagnit</li>
            <li><strong>KMBE = −2.4Δ<sub>o</sub></strong> — maksimal barqarorlik, juda inert</li>
            <li>Oktaedrik geometriya (O<sub>h</sub>), Co−N = 1.96 Å</li>
            <li>Co²⁺ dan havo kislorodi yoki H₂O₂ bilan oksidlab olinadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/sisplatin" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            sis-[PtCl₂(NH₃)₂] →
          </Link>
        </div>

      </section>
    </main>
  )
}