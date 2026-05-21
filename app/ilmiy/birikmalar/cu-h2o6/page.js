import Link from "next/link"

export default function CuH2O6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🧪 [Cu(H₂O)₆]²⁺</h1>
          <p className="text-purple-400 text-sm">geksaakvamis(II) ioni • Hexaaquacopper(II) • Yan-Teller effektining klassik namunasi</p>
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
              <div className="text-white font-bold">geksaakvamis(II) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-purple-400 text-xs mb-1">Ligand</div>
              <div className="text-blue-400 font-bold">6 ta H₂O (akva)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">171.66 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Havorang (och ko&apos;k)"],
              ["Holati", "Eritmada mavjud"],
              ["Koordinatsion son", "6 (4+2)"],
              ["Nuqtali guruh", "D<sub>4h</sub> (cho&apos;zilgan O<sub>h</sub>)"],
              ["Metall ioni", "Cu²⁺ (d⁹)"],
              ["Geometriya", "Cho&apos;zilgan oktaedr"],
              ["Magnit xossasi", "Paramagnit (n=1)"],
              ["Barqarorlik", "O&apos;rtacha (log β₁≈6.3)"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/20 rounded-xl p-3 text-center">
                <div className="text-purple-400 text-xs">{r[0]}</div>
                <div className="text-white font-semibold text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. YAN-TELLER EFFEKTI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Yan-Teller effekti — nega 4+2?</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[Cu(H₂O)₆]²⁺ — Yan-Teller effektining eng klassik namunasi!</strong>
              Cu²⁺ (d⁹) konfiguratsiyada eg orbitallarda 3 ta elektron (eg³) — bir elektron degeneratlik.
              Teorema: degenerat elektron konfiguratsiyali molekula simmetriyani buzadi.
              Natija: <strong>oktaedr Z o&apos;qi bo&apos;yicha cho&apos;ziladi — 4+2 geometriya</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Elektron konfiguratsiya</h3>
              <p className="text-purple-200 text-sm">
                <strong>Cu²⁺:</strong> [Ar] 3d⁹<br/>
                <strong>Oktaedrik maydonda:</strong> t₂g⁶ eg³<br/>
                <strong>eg³:</strong> dx²−y² (2e⁻), dz² (1e⁻)<br/>
                <strong>Degeneratlik:</strong> dz² dagi 1 ta elektron dx²−y² ga o&apos;tishi mumkin — energiya bir xil!<br/>
                <strong>Yan-Teller:</strong> degeneratlikni yo&apos;qotish uchun oktaedr cho&apos;ziladi
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">4+2 tuzilish</h3>
              <p className="text-purple-200 text-sm">
                <strong>Ekvatorial (4 ta):</strong><br/>
                • Cu−O = 1.97 Å (qisqa, kuchli bog&apos;)<br/>
                • dx²−y² orbital to&apos;lgan — ligandlarni kuchli itaradi<br/>
                <strong>Aksial (2 ta):</strong><br/>
                • Cu−O = 2.28 Å (uzun, zaif bog&apos;)<br/>
                • dz² orbital yarim to&apos;lgan — ligandlarni kuchsiz itaradi<br/>
                <strong>Farq:</strong> 0.31 Å (~16% uzunroq)
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
            <h3 className="text-blue-400 font-bold mb-2">Dinamik Yan-Teller effekti</h3>
            <p className="text-purple-200 text-sm">
              Xona haroratida cho&apos;zilish o&apos;qi <strong>3 ta ekvivalent o&apos;q orasida tebranadi</strong> 
              (dinamik Yan-Teller). Rentgen difraksiyasida oktaedr simmetrik ko&apos;rinadi, lekin spektroskopiya 
              buzilish mavjudligini ko&apos;rsatadi. Past haroratda (77 K) statik Yan-Teller — 
              cho&apos;zilish bir o&apos;qda doimiy.
            </p>
          </div>
        </div>

        {/* ── 3. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi va magnit xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "d⁹ konfiguratsiya — 1 ta toq elektron",
                matn: "t₂g⁶ eg³ — jami 9 ta d-elektron. t₂g orbitallarda 6 ta elektron to&apos;liq juftlashgan. eg orbitallarda 3 ta elektron — 2 tasi dx²−y² da juftlashgan, 1 tasi dz² da toq. <strong>n = 1 ta toq elektron.</strong>",
              },
              {
                sarlavha: "Magnit moment",
                matn: "Spin-only: μ<sub>SO</sub> = √1(1+2) = <strong>1.73 μ<sub>B</sub></strong>. Eksperimental: μ<sub>eff</sub> = <strong>1.7−2.2 μ<sub>B</sub></strong>. Orbital hissa tufayli biroz kattaroq. <strong>Paramagnit.</strong> EPR spektrida aniq signal (I=3/2, ⁶³Cu va ⁶⁵Cu gipernozik struktura).",
              },
              {
                sarlavha: "KMBE",
                matn: "KMBE = 6×(−0.4Δ<sub>o</sub>) + 3×(+0.6Δ<sub>o</sub>) = −2.4Δ<sub>o</sub> + 1.8Δ<sub>o</sub> = <strong>−0.6Δ<sub>o</sub></strong>. Yan-Teller barqarorlashishi qo&apos;shimcha ~0.1−0.3Δ<sub>o</sub> beradi.",
              },
              {
                sarlavha: "Suv almashinish tezligi",
                matn: "Aksial suv molekulalari <strong>juda tez almashadi</strong> — k ≈ 4.4×10⁹ s⁻¹ (eng tez almashinuvchi akva kompleks!). Ekvatorial suv molekulalari sekinroq almashadi (k ≈ 10⁷ s⁻¹). Yan-Teller buzilishi tufayli aksial bog&apos;lar zaif.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. RANGI VA SPEKTRI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎨 Rangi va elektron spektri</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Nega havorang (och ko&apos;k)?",
                matn: "Cu²⁺ eritmalari xarakterli havorangda bo&apos;ladi. λ<sub>max</sub> ≈ 800 nm (yaqin IQ soha) — qizil-sariq nurlarni yutadi. Komplementar rang — <strong>havorang/ko&apos;k</strong>. ε ≈ 10−15 L·mol⁻¹·cm⁻¹ (Laport-taqiqlangan d-d o&apos;tish).",
              },
              {
                sarlavha: "UB-Vis spektri — keng assimmetrik polosa",
                matn: "Oddiy oktaedrda 1 ta d-d o&apos;tish kutiladi. Cho&apos;zilgan oktaedrda (D<sub>4h</sub>) energetik sathlar qo&apos;shimcha ajraladi — <strong>2-3 ta polosa</strong> kuzatilishi kerak. Xona haroratida polosalar keng va birlashgan — bitta assimmetrik polosa ko&apos;rinadi. 77 K da esa polosalar aniq ajraladi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. KIMYOVIY XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari</h2>
          
          <div className="space-y-3">
            {[
              {
                reaksiya: "NH₃ bilan — rang o&apos;zgarishi",
                matn: "[Cu(H₂O)₆]²⁺ + 4NH₃ → [Cu(NH₃)₄(H₂O)₂]²⁺ + 4H₂O. Eritma rangi havorangdan <strong>to&apos;q ko&apos;k</strong> rangga o&apos;zgaradi. NH₃ H₂O dan kuchliroq ligand — Δ<sub>o</sub> ortadi, yutilish ko&apos;k siljiydi.",
              },
              {
                reaksiya: "Cl⁻ bilan — tetraedrik kompleks",
                matn: "[Cu(H₂O)₆]²⁺ + 4Cl⁻ → [CuCl₄]²⁻ + 6H₂O (konsentrlangan HCl da). Rangi ko&apos;kdan <strong>sariq-yashil</strong>ga o&apos;zgaradi. Geometriya oktaedrikdan tetraedrikka o&apos;tadi.",
              },
              {
                reaksiya: "Gidroliz — kislotalilik",
                matn: "[Cu(H₂O)₆]²⁺ + H₂O ⇌ [Cu(H₂O)₅(OH)]⁺ + H₃O⁺ (pK<sub>a</sub> ≈ 7.5). Cu²⁺ akva kompleksi kuchsiz kislota xossasini namoyon qiladi. Ishqoriy muhitda Cu(OH)₂ cho&apos;kmasi tushadi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Cu(H₂O)₆]²⁺ — <strong className="text-yellow-400">geksaakvamis(II)</strong>, havorang eritma</li>
            <li>Cu²⁺ (d⁹) — <strong>Yan-Teller effekti</strong> tufayli cho&apos;zilgan oktaedr (4+2)</li>
            <li>Ekvatorial Cu−O = 1.97 Å, aksial Cu−O = 2.28 Å — <strong>0.31 Å farq</strong></li>
            <li><strong>Paramagnit</strong> (n=1, μ≈1.73−2.2 μ<sub>B</sub>), eng tez suv almashinuvi (10⁹ s⁻¹)</li>
            <li>Rangi — havorang, λ<sub>max</sub>≈800 nm, keng assimmetrik polosa</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/ag-nh3-2" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold transition-all">
            [Ag(NH₃)₂]⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}