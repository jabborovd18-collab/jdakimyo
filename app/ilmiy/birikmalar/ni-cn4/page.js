import Link from "next/link"

export default function NiCN4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧪 [Ni(CN)₄]²⁻</h1>
          <p className="text-purple-400 text-sm">tetrasiyanonikkolat(II) ioni • Tetracyanonickelate(II) • Kvadrat-planar d⁸ kompleks</p>
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
              <div className="text-white font-bold">tetrasiyanonikkolat(II) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⬛</div>
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-green-400 font-bold">Tekis kvadrat</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">162.78 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Sariq (eritmada)"],
              ["Holati", "Kristall (tuzlar)"],
              ["Koordinatsion son", "4"],
              ["Nuqtali guruh", "D<sub>4h</sub>"],
              ["Metall ioni", "Ni²⁺ (d⁸)"],
              ["Ligand", "CN⁻ (sianido)"],
              ["Barqarorlik", "Juda yuqori (log β₄≈30)"],
              ["Magnit xossasi", "Diamagnit"],
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
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — diamagnit kvadrat-planar d⁸</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Ni²⁺ — d⁸ konfiguratsiya",
                matn: "Ni: [Ar] 3d⁸4s². Ni²⁺: [Ar] 3d⁸. 8 ta d-elektron. Oktaedrik maydonda yuqori spinli (t₂g⁶ eg², n=2, paramagnit). Kvadrat-planar maydonda esa <strong>barcha elektronlar juftlashgan</strong> (n=0, diamagnit).",
              },
              {
                sarlavha: "Kvadrat-planar maydonda d-orbital ajralishi",
                matn: "D<sub>4h</sub> simmetriyada 5 ta d-orbital 4 ta energetik sathga ajraladi:<br/><strong>d<sub>xy</sub></strong> (b₂<sub>g</sub>) — eng past (to&apos;lgan, 2e⁻)<br/><strong>d<sub>xz</sub>, d<sub>yz</sub></strong> (e<sub>g</sub>) — 4e⁻<br/><strong>d<sub>z²</sub></strong> (a₁<sub>g</sub>) — 2e⁻<br/><strong>d<sub>x²−y²</sub></strong> (b₁<sub>g</sub>) — bo&apos;sh! (eng yuqori)",
              },
              {
                sarlavha: "Nima uchun kvadrat-planar?",
                matn: "CN⁻ — kuchli maydonli ligand. Kuchli σ-donor va kuchli π-akseptor. d<sub>x²−y²</sub> orbitalni yuqori energiyaga ko&apos;taradi — bu orbital bo&apos;sh qoladi. Qolgan 4 ta d-orbital (d<sub>xy</sub>, d<sub>xz</sub>, d<sub>yz</sub>, d<sub>z²</sub>) to&apos;liq to&apos;lgan. Natija: <strong>energetik jihatdan kvadrat-planar geometriya oktaedrikdan afzal.</strong>",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "Barcha 8 ta d-elektron juftlashgan. n = 0, μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong> Bu — [Ni(CN)₄]²⁻ ni [NiCl₄]²⁻ (tetraedrik, paramagnit, μ≈3.5 μ<sub>B</sub>) va [Ni(H₂O)₆]²⁺ (oktaedrik, paramagnit, μ≈2.8−3.3 μ<sub>B</sub>) dan farqlashning eng oson usuli.",
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
                <strong>Geometriya:</strong> Muntazam tekis kvadrat<br/>
                <strong>Nuqtali guruh:</strong> D<sub>4h</sub><br/>
                <strong>Ni−C masofa:</strong> 1.86 Å<br/>
                <strong>C≡N masofa:</strong> 1.15 Å<br/>
                <strong>Ni−C≡N burchak:</strong> 180° (chiziqli)<br/>
                <strong>C−Ni−C burchak:</strong> 90° va 180°<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> D<sub>4h</sub><br/>
                <strong>Asosiy o&apos;q:</strong> C₄ (tekislikka perpendikulyar)<br/>
                <strong>Perpendikulyar C₂:</strong> 4 ta<br/>
                <strong>σ<sub>h</sub>:</strong> Molekula tekisligi<br/>
                <strong>σ<sub>v</sub>:</strong> 2 ta (Ni−C orqali)<br/>
                <strong>σ<sub>d</sub>:</strong> 2 ta (C−Ni−C bissektrisasi)<br/>
                <strong>Inversiya markazi:</strong> Ha (Ni atomida)
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
                matn: "d⁸ kvadrat-planar — d-d o&apos;tishlar mavjud. λ<sub>max</sub> ≈ 420 nm (d-d, ε≈10), 320 nm (MLCT, ε≈1000). <strong>Rangi:</strong> sariq (binafsha-ko&apos;k nurlarni yutadi). Oktaedrik [Ni(H₂O)₆]²⁺ yashil rangda — geometriya o&apos;zgarishi bilan rang o&apos;zgaradi.",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(C≡N):</strong> 2128 cm⁻¹. Erkin CN⁻ da 2080 cm⁻¹ — yuqori chastotaga siljigan. Bu Ni→CN π-akseptor bog&apos;lanishni ko&apos;rsatadi. <strong>ν(Ni−C):</strong> 417 cm⁻¹. <strong>δ(Ni−C≡N):</strong> 540 cm⁻¹. D<sub>4h</sub> simmetriya tufayli IQ va Raman faol modlar farq qiladi.",
              },
              {
                usul: "¹³C YaMR",
                matn: "¹³C YaMR: δ = 135 ppm (C≡N). Erkin CN⁻ da δ = 165 ppm — past maydonga siljigan. Bu metall-ligand bog&apos;lanishining kovalent xarakterini ko&apos;rsatadi.",
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
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Olinishi</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "Ni²⁺ tuzidan KCN bilan",
                reaksiya: "NiSO₄ + 4KCN → K₂[Ni(CN)₄] + K₂SO₄",
                izoh: "Ni²⁺ tuzi eritmasiga stexiometrik miqdorda KCN qo&apos;shiladi. Dastlab Ni(CN)₂ cho&apos;kmasi tushadi, so&apos;ng ortiqcha CN⁻ da erib, [Ni(CN)₄]²⁻ hosil bo&apos;ladi. Eritma to&apos;q sariq rangga kiradi.",
              },
              {
                usul: "Ni(CN)₂ dan ortiqcha KCN bilan",
                reaksiya: "Ni(CN)₂ + 2KCN → K₂[Ni(CN)₄]",
                izoh: "Avval NiSO₄ + 2KCN → Ni(CN)₂↓ + K₂SO₄. Cho&apos;kma filtrlanadi, yuviladi, so&apos;ng 2 ekvivalent KCN eritmasida eritiladi. Toza mahsulot olish uchun qulay usul.",
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

        {/* ── 6. KIMYOVIY XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari</h2>
          
          <div className="space-y-3">
            {[
              {
                reaksiya: "Barqarorlik konstantasi",
                matn: "[Ni(CN)₄]²⁻ ning umumiy barqarorlik konstantasi log β₄ ≈ 30. Bu — eng barqaror komplekslardan biri. Termodinamik jihatdan juda barqaror. Ammo kinetik jihatdan <strong>labil</strong> — CN⁻ almashinuvi tez boradi (Ni²⁺ d⁸ — labil). Bu — termodinamik va kinetik barqarorlik farqining klassik misoli.",
              },
              {
                reaksiya: "Kislotalar bilan",
                matn: "Kislotali muhitda CN⁻ protonlanib HCN ga aylanadi: [Ni(CN)₄]²⁻ + 4H⁺ → Ni²⁺ + 4HCN↑. <strong>Zaharli HCN gazi ajraladi!</strong> Kislotalar bilan ishlash qat&apos;iyan taqiqlanadi.",
              },
              {
                reaksiya: "Oksidlanish",
                matn: "Kuchli oksidlovchilar ta&apos;sirida Ni²⁺ Ni³⁺ gacha oksidlanishi mumkin: 2[Ni(CN)₄]²⁻ + S₂O₈²⁻ → 2[Ni(CN)₄]⁻ + 2SO₄²⁻. [Ni(CN)₄]⁻ — Ni³⁺ kompleksi, beqaror.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Ni(CN)₄]²⁻ — <strong className="text-yellow-400">tetrasiyanonikkolat(II)</strong>, klassik kvadrat-planar d⁸ kompleks</li>
            <li>Ni²⁺ (d⁸) — <strong>diamagnit</strong> (barcha elektronlar juftlashgan)</li>
            <li>CN⁻ kuchli maydoni d<sub>x²−y²</sub> orbitalni bo&apos;sh qoldiradi — <strong>kvadrat-planar geometriya</strong></li>
            <li><strong>Termodinamik barqaror</strong> (log β₄≈30), lekin <strong>kinetik labil</strong></li>
            <li>Kislotalarda <strong>zaharli HCN ajraladi</strong> — ehtiyot choralari zarur</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/cu-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Cu(H₂O)₆]²⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}