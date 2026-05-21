import Link from "next/link"

export default function CoCl4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧪 [CoCl₄]²⁻</h1>
          <p className="text-purple-400 text-sm">tetraxlorokobaltat(II) ioni • Tetrachlorocobaltate(II) • Tetraedrik d⁷ kompleks</p>
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
              <div className="text-white font-bold">tetraxlorokobaltat(II) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔺</div>
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-blue-400 font-bold">Tetraedrik</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">200.75 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "To&apos;q ko&apos;k (eritmada)"],
              ["Holati", "Kristall (tuzlar)"],
              ["Koordinatsion son", "4"],
              ["Nuqtali guruh", "T<sub>d</sub>"],
              ["Metall ioni", "Co²⁺ (d⁷)"],
              ["Ligand", "Cl⁻ (xlorido) — 4 ta"],
              ["Barqarorlik", "O&apos;rtacha (log β₄≈6)"],
              ["Magnit xossasi", "Paramagnit (n=3)"],
              ["Δ<sub>t</sub>", "~3,300 cm⁻¹"],
              ["μ<sub>eff</sub>", "4.3−4.8 μ<sub>B</sub>"],
              ["Gibridlanish", "sp³"],
              ["Cl−Co−Cl burchak", "109.5°"],
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
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — d⁷ tetraedrik maydonda</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Co²⁺ erkin ioni — d⁷ konfiguratsiya",
                matn: "Co: [Ar] 3d⁷4s². Co²⁺: [Ar] 3d⁷. 7 ta d-elektron. Tetraedrik maydonda yuqori spinli holat barqaror (Δ<sub>t</sub> kichik — juflanish energiyasidan past). Konfiguratsiya: e⁴ t₂³.",
              },
              {
                sarlavha: "Tetraedrik maydonda d-orbital ajralishi",
                matn: "T<sub>d</sub> simmetriyada 5 ta d-orbital 2 ta sathga ajraladi:<br/><strong>e (pastki):</strong> d<sub>z²</sub>, d<sub>x²−y²</sub> — 4 ta elektron<br/><strong>t₂ (yuqori):</strong> d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub> — 3 ta elektron<br/><strong>Oktaedrikka teskari tartibda!</strong> Tetraedrik maydonda e orbitallar pastda, t₂ orbitallar yuqorida.",
              },
              {
                sarlavha: "Magnit xossalari — nima uchun 4.3−4.8 μ<sub>B</sub>?",
                matn: "e⁴ t₂³ — 3 ta toq elektron t₂ orbitallarda. Spin-only: μ<sub>SO</sub> = √3(3+2) = √15 = <strong>3.87 μ<sub>B</sub></strong>. Eksperimental: μ<sub>eff</sub> = <strong>4.3−4.8 μ<sub>B</sub></strong>. Orbital hissa tufayli spin-only dan kattaroq (T<sub>d</sub> da A₂ asosiy term — orbital hissa kuchsiz, lekin mavjud).",
              },
              {
                sarlavha: "Nima uchun tetraedrik?",
                matn: "Cl⁻ — kuchsiz maydonli ligand (spektrokimyoviy qatorning chap tomonida). Kuchsiz maydonda KMBE past — oktaedrik geometriya uchun yetarli emas. Tetraedrik geometriyada ligandlar orasidagi itarilish kichikroq (4 ta ligand vs 6 ta). Kuchsiz maydonli ligandlar bilan Co²⁺ tetraedrik geometriyani afzal ko&apos;radi.",
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
                <strong>Geometriya:</strong> Muntazam tetraedr<br/>
                <strong>Nuqtali guruh:</strong> T<sub>d</sub><br/>
                <strong>Co−Cl masofa:</strong> 2.25 Å<br/>
                <strong>Cl−Co−Cl burchak:</strong> 109.5°<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)<br/>
                <strong>Koordinatsion poliedr:</strong> muntazam tetraedr
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> T<sub>d</sub><br/>
                <strong>Simmetriya elementlari:</strong><br/>
                • 4C₃ (Co−Cl orqali)<br/>
                • 3S₄ (qirralar orqali)<br/>
                • 6σ<sub>d</sub> (qirralar orqali)<br/>
                • Jami amallar: 24 ta<br/>
                <strong>Inversiya markazi:</strong> YO&apos;Q! (T<sub>d</sub> da i yo&apos;q)<br/>
                Bu — tetraedrik va oktaedrik komplekslarni farqlashning eng muhim simmetriya belgisi.
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. RANGI VA SPEKTRI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎨 Rangi va elektron spektri — nega to&apos;q ko&apos;k?</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "UB-Vis spektri — intensiv d-d polosalar",
                matn: "Tetraedrik komplekslarda inversiya markazi yo&apos;q — <strong>d-d o&apos;tishlar Laport-ruxsat etilgan!</strong> ε ≈ 300−1000 L·mol⁻¹·cm⁻¹ (oktaedrikdan 10−100 marta kuchli). λ<sub>max</sub> ≈ 660 nm (ko&apos;rinadigan soha). <strong>Rangi:</strong> to&apos;q ko&apos;k (sariq-qizil nurlarni yutadi).",
              },
              {
                sarlavha: "Oktaedrik [Co(H₂O)₆]²⁺ bilan taqqoslash",
                matn: "[Co(H₂O)₆]²⁺ (oktaedrik, O<sub>h</sub>): λ<sub>max</sub> ≈ 510 nm, ε ≈ 5, rangi — pushti.<br/>[CoCl₄]²⁻ (tetraedrik, T<sub>d</sub>): λ<sub>max</sub> ≈ 660 nm, ε ≈ 600, rangi — to&apos;q ko&apos;k.<br/><strong>Farq:</strong> geometriya o&apos;zgarishi bilan rang va intensivlik keskin o&apos;zgaradi! Bu — Co²⁺ komplekslari uchun xos xususiyat.",
              },
              {
                sarlavha: "Spektrdagi polosalar soni",
                matn: "Tetraedrik maydonda d⁷ — 3 ta spin-ruxsat d-d o&apos;tish kutiladi. Amalda 2−3 ta keng polosa kuzatiladi. UB sohada LMCT (Cl→Co) polosalari mavjud (ε ≈ 10³−10⁴).",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. SPEKTROSKOPIK XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Spektroskopik xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(Co−Cl):</strong> 300 cm⁻¹ (uzoq IQ soha). T<sub>d</sub> simmetriyada faqat T₂ simmetriyali tebranish IQ-faol. <strong>IQ+Raman:</strong> inversiya markazi yo&apos;qligi tufayli ayrim tebranishlar ham IQ, ham Raman faol (alternativ taqiq yo&apos;q).",
              },
              {
                usul: "Magnit o&apos;lchashlar",
                matn: "μ<sub>eff</sub> = 4.3−4.8 μ<sub>B</sub> (xona haroratida). Gui usuli bilan oson aniqlanadi. Kyuri-Veys qonuniga bo&apos;ysunadi (θ ≈ −5 K — kuchsiz antiferromagnit almashinuv).",
              },
              {
                usul: "EPR spektroskopiya",
                matn: "Co²⁺ (d⁷, S=3/2) — EPR signali kuzatiladi. g-faktor anizotropiyasi mavjud (g<sub>∥</sub> ≈ 2.3, g<sub>⊥</sub> ≈ 2.1). Kuchsiz nolinchi maydon ajralishi (ZFS ≈ 5−15 cm⁻¹).",
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
                usul: "CoCl₂ dan konsentrlangan HCl da",
                reaksiya: "CoCl₂ + 2HCl → H₂[CoCl₄] (yoki CoCl₂ + 2KCl → K₂[CoCl₄])",
                izoh: "CoCl₂ konsentrlangan HCl da eritilganda eritma rangi pushtidan (oktaedrik [Co(H₂O)₆]²⁺) to&apos;q ko&apos;kka (tetraedrik [CoCl₄]²⁻) o&apos;zgaradi. Bu — Co²⁺ komplekslari uchun xos rang o&apos;zgarishi. Suv qo&apos;shilsa, rang qaytadan pushtiga o&apos;tadi.",
              },
              {
                usul: "Suvsiz muhitda — CoCl₂ + KCl",
                reaksiya: "CoCl₂ + 2KCl → K₂[CoCl₄] (suvsiz etanol yoki atsetonda)",
                izoh: "Suvsiz muhitda CoCl₂ va KCl aralashmasi qizdirilsa, K₂[CoCl₄] hosil bo&apos;ladi. Suv ishtirokida [Co(H₂O)₆]²⁺ hosil bo&apos;lishi tufayli reaksiya bormaydi.",
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

        {/* ── 7. KIMYOVIY XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari</h2>
          
          <div className="space-y-3">
            {[
              {
                reaksiya: "Suv qo&apos;shilsa — rang o&apos;zgarishi",
                matn: "[CoCl₄]²⁻ + 6H₂O → [Co(H₂O)₆]²⁺ + 4Cl⁻. Ko&apos;k rang pushtiga o&apos;zgaradi. Bu reaksiya <strong>qaytar</strong> — suvni bug&apos;latib, HCl qo&apos;shilsa, yana ko&apos;k rang qaytadi. Co²⁺ uchun &quot;rangli indikator&quot; xossasi.",
              },
              {
                reaksiya: "Kation almashinuvi — turli tuzlar",
                matn: "H₂[CoCl₄] + 2NaCl → Na₂[CoCl₄] + 2HCl. Turli kationli tuzlar sintez qilish mumkin: K⁺ (pushti kristall), Cs⁺ (ko&apos;k kristall), [N(n-Bu)₄]⁺ (yashil — tetraedrik buzilgan).",
              },
              {
                reaksiya: "Oksidlanish",
                matn: "[CoCl₄]²⁻ oson oksidlanib Co³⁺ birikmalariga o&apos;tadi: 2[CoCl₄]²⁻ + Cl₂ → 2[CoCl₄]⁻ + 2Cl⁻. [CoCl₄]⁻ — Co³⁺ tetraedrik kompleksi, beqaror.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-3">
            {[
              "Namlik indikatori sifatida — CoCl₂ namlanganda pushti, quruq holda ko&apos;k rangda (silikagel indikatorlari)",
              "Analitik kimyoda xlorid ionlarini aniqlashda — Co²⁺ + Cl⁻ + HCl → ko&apos;k rang",
              "Kobaltni qayta ishlash texnologiyalarida — Co ni eritmaga o&apos;tkazish va ajratish",
              "Tetraedrik komplekslarning model birikmasi sifatida ilmiy tadqiqotlarda",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[CoCl₄]²⁻ — <strong className="text-yellow-400">tetraxlorokobaltat(II)</strong>, klassik tetraedrik Co²⁺ kompleks</li>
            <li>Co²⁺ (d⁷) — yuqori spinli (e⁴ t₂³), <strong>3 ta toq elektron</strong> — paramagnit (μ≈4.5 μ<sub>B</sub>)</li>
            <li>T<sub>d</sub> simmetriya — <strong>inversiya markazi YO&apos;Q</strong>, d-d o&apos;tishlar Laport-ruxsat (ε≈600)</li>
            <li>To&apos;q ko&apos;k rang — λ<sub>max</sub>≈660 nm, oktaedrik [Co(H₂O)₆]²⁺ pushtisidan keskin farq qiladi</li>
            <li>Namlik indikatori — suv bilan pushti, quruq holda ko&apos;k (qaytar reaksiya)</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/fe-co5" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [Fe(CO)₅] →
          </Link>
        </div>

      </section>
    </main>
  )
}