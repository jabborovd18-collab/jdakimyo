import Link from "next/link"

export default function K4FeCN6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Birikmalar bazasi
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧪 K₄[Fe(CN)₆] — Sariq qon tuzi</h1>
          <p className="text-purple-400 text-sm">kaliy geksasiyanoferrat(II) • Potassium hexacyanoferrate(II) • Yellow prussiate of potash</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. UMUMIY MA'LUMOT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Umumiy ma&apos;lumot</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <tbody className="text-purple-200">
                {[
                  ["Molekulyar formula", "K₄[Fe(CN)₆]"],
                  ["IUPAC nomi", "kaliy geksasiyanoferrat(II)"],
                  ["An&apos;anaviy nomi", "Sariq qon tuzi (Yellow prussiate of potash)"],
                  ["Molekulyar massa", "368.35 g/mol (suvsiz), 422.39 g/mol (trihidrat)"],
                  ["Rangi", "Sariq kristall (suvsiz), och sariq (trihidrat)"],
                  ["Koordinatsion son", "6"],
                  ["Geometriya", "Oktaedrik"],
                  ["Nuqtali guruh", "O<sub>h</sub>"],
                  ["Metall ioni", "Fe²⁺ (temir(II))"],
                  ["Ligand", "CN⁻ (sianido) — 6 ta"],
                  ["Eruvchanligi", "Suvda yaxshi eriydi (28.9 g/100 mL, 20°C)"],
                  ["Zichligi", "1.85 g/cm³ (trihidrat)"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30">
                    <td className="py-3 px-4 font-bold text-yellow-400 w-1/3">{r[0]}</td>
                    <td className="py-3 px-4" dangerouslySetInnerHTML={{ __html: r[1] }}></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 2. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Fe²⁺ erkin ioni",
                matn: "Elektron konfiguratsiyasi: [Ar] 3d⁶. 6 ta d-elektron, oktaedrik maydonda yuqori spinli (t₂g⁴ eg²) yoki quyi spinli (t₂g⁶ eg⁰) holatda bo&apos;lishi mumkin.",
              },
              {
                sarlavha: "Kuchli maydon — quyi spin",
                matn: "CN⁻ — kuchli maydonli ligand (spektrokimyoviy qatorning o&apos;ng tomonida). Δ<sub>o</sub> &gt; P (juflanish energiyasi). Elektronlar t₂g orbitallarda juflanishni afzal ko&apos;radi: <strong>t₂g⁶ eg⁰</strong>. Barcha elektronlar juftlashgan.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "t₂g⁶ eg⁰ — barcha elektronlar juftlashgan, n = 0. μ<sub>eff</sub> = 0 — <strong>diamagnit</strong>. Bu — Fe²⁺ uchun noodatiy holat (odatda Fe²⁺ paramagnit, n=4).",
              },
              {
                sarlavha: "Kristall maydon barqarorlashish energiyasi (KMBE)",
                matn: "KMBE = 6 × (−0.4Δ<sub>o</sub>) + 0 × (+0.6Δ<sub>o</sub>) = <strong>−2.4Δ<sub>o</sub></strong>. Bu oktaedrik komplekslar orasida <strong>eng yuqori KMBE</strong>! Shuning uchun [Fe(CN)₆]⁴⁻ juda barqaror va inert.",
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
                <strong>Geometriya:</strong> Oktaedrik (O<sub>h</sub>)<br/>
                <strong>Fe−C masofa:</strong> 1.91 Å<br/>
                <strong>C≡N masofa:</strong> 1.16 Å<br/>
                <strong>Fe−C≡N burchak:</strong> 180° (chiziqli)<br/>
                <strong>C−Fe−C burchak:</strong> 90° va 180°<br/>
                <strong>Koordinatsion poliedr:</strong> muntazam oktaedr
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> O<sub>h</sub><br/>
                <strong>Simmetriya elementlari:</strong> 3C₄, 4C₃, 6C₂, i, 3σ<sub>h</sub>, 6σ<sub>d</sub><br/>
                <strong>Jami amallar:</strong> 48 ta<br/>
                <strong>Inversiya markazi:</strong> Ha (Fe atomida)<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya tufayli)
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
                matn: "d⁶ quyi spin — barcha t₂g orbitallar to&apos;lgan. d-d o&apos;tishlar faqat t₂g⁶ eg⁰ → t₂g⁵ eg¹ bo&apos;lishi mumkin, bu yuqori energiyali (UB sohada). Spektrda <strong>kuchsiz sariq rang</strong> — MLCT (Fe→CN π*) o&apos;tish tufayli. λ<sub>max</sub> ≈ 320 nm (UB).",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(C≡N):</strong> 2044 cm⁻¹ (erkin CN⁻ da 2080 cm⁻¹). Fe²⁺ ga koordinatsiyalanganda past chastotaga siljiydi — bu metall-ligand π-bog&apos;lanishini ko&apos;rsatadi (Fe→CN π-akseptor). <strong>ν(Fe−C):</strong> 416 cm⁻¹. <strong>δ(Fe−C≡N):</strong> 585 cm⁻¹.",
              },
              {
                usul: "Magnit xossalari",
                matn: "<strong>μ<sub>eff</sub> = 0</strong> — diamagnit. Gui tarozisi bilan tekshirilganda namuna itariladi. Bu — Fe²⁺ ning quyi spinli ekanligini va CN⁻ ning kuchli maydonli ligand ekanligini isbotlaydi.",
              },
              {
                usul: "Mössbauer spektroskopiya",
                matn: "⁵⁷Fe Mössbauer spektrida izomer siljish (IS) ≈ 0.00 mm/s (Fe²⁺(QS) uchun xos). Kvadrupol ajralishi (QS) ≈ 0 mm/s — yuqori simmetriya (O<sub>h</sub>) tufayli elektr maydon gradienti nolga teng.",
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
                usul: "Sanoat usuli — ko&apos;mir va azotdan",
                reaksiya: "FeSO₄ + 6KCN → K₄[Fe(CN)₆] + K₂SO₄",
                izoh: "Sanoatda asosan ko&apos;mir, azot va temir qirindilaridan yuqori haroratda olinadi. Oraliq mahsulot sifatida CaCN₂ va NaCN hosil bo&apos;ladi. Keyin FeSO₄ va KCl qo&apos;shiladi.",
              },
              {
                usul: "Laboratoriya usuli",
                reaksiya: "FeSO₄ + 6KCN → K₄[Fe(CN)₆] + K₂SO₄ (inert atmosferada)",
                izoh: "Eritmada Fe²⁺ tuziga KCN qo&apos;shiladi. Havo kislorodi Fe²⁺ ni Fe³⁺ ga oksidlamasligi uchun inert atmosfera (N₂ yoki Ar) kerak. Eritma bug&apos;latilgach, sariq kristallar hosil bo&apos;ladi.",
              },
              {
                usul: "Qizil qon tuzidan qaytarish",
                reaksiya: "2K₃[Fe(CN)₆] + H₂O₂ + 2KOH → 2K₄[Fe(CN)₆] + 2H₂O + O₂",
                izoh: "Qizil qon tuzi (K₃[Fe(CN)₆]) ishqoriy muhitda vodorod peroksid bilan qaytariladi. Bu — laboratoriyada qulay usul.",
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
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari va reaksiyalari</h2>
          
          <div className="space-y-4">
            {[
              {
                reaksiya: "Fe³⁺ bilan — Berlin ko&apos;ki (Prussiya ko&apos;ki)",
                tenglama: "3K₄[Fe(CN)₆] + 4FeCl₃ → Fe₄[Fe(CN)₆]₃↓ + 12KCl",
                izoh: "Fe³⁺ ionlari bilan to&apos;q ko&apos;k rangli cho&apos;kma — Berlin ko&apos;ki (Prussiya ko&apos;ki) hosil qiladi. Bu — Fe³⁺ ionlarini aniqlashning klassik sifatiy reaksiyasi. Cho&apos;kma aslida Fe₄[Fe(CN)₆]₃ tarkibiga ega.",
              },
              {
                reaksiya: "Oksidlanish — qizil qon tuziga o&apos;tish",
                tenglama: "2K₄[Fe(CN)₆] + Cl₂ → 2K₃[Fe(CN)₆] + 2KCl",
                izoh: "Xlor yoki boshqa oksidlovchilar ta&apos;sirida Fe²⁺ Fe³⁺ gacha oksidlanadi va qizil qon tuzi (K₃[Fe(CN)₆]) hosil bo&apos;ladi. Eritma rangi sariqdan qizilga o&apos;zgaradi.",
              },
              {
                reaksiya: "Og&apos;ir metallar bilan cho&apos;kmalar",
                tenglama: "2CuSO₄ + K₄[Fe(CN)₆] → Cu₂[Fe(CN)₆]↓ + 2K₂SO₄",
                izoh: "Cu²⁺, Zn²⁺, Cd²⁺, Pb²⁺ kabi og&apos;ir metall ionlari bilan rangli cho&apos;kmalar hosil qiladi. Cu²⁺ bilan qizil-jigarrang, Zn²⁺ bilan oq cho&apos;kma.",
              },
              {
                reaksiya: "Kislotalar bilan",
                tenglama: "K₄[Fe(CN)₆] + 4HCl → H₄[Fe(CN)₆] + 4KCl",
                izoh: "Kuchli kislotalar ta&apos;sirida geksasiyanoferrat(II) kislota (H₄[Fe(CN)₆]) hosil bo&apos;ladi. Bu kislota beqaror — qizdirilganda parchalanadi. Zaharli HCN gazi ajralib chiqishi mumkin!",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                <p className="text-green-400 text-sm font-semibold mb-1">{r.tenglama}</p>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-3">
            {[
              "Oziq-ovqat sanoatida antiaglomerant (E536) sifatida — tuz va shakar kristallarining yopishib qolishini oldini oladi",
              "Analitik kimyoda Fe³⁺ ionlarini sifatiy va miqdoriy aniqlash uchun (Berlin ko&apos;ki reaksiyasi)",
              "Metallurgiyada po&apos;lat sirtini mustahkamlash (sementatsiya) uchun",
              "Bo&apos;yoq sanoatida pigment sifatida (Berlin ko&apos;ki)",
              "Fotografiyada yorug&apos;lik sezgir materiallar tayyorlashda",
              "Sharob ishlab chiqarishda og&apos;ir metallarni cho&apos;ktirish uchun",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. XAVFSIZLIK ── */}
        <div className="bg-red-600/10 border border-red-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">⚠️ Xavfsizlik</h2>
          <p className="text-purple-200 text-sm">
            K₄[Fe(CN)₆] nisbatan <strong>kam zaharli</strong> (LD₅₀ ≈ 1600 mg/kg, kalamush).
            Ammo kuchli kislotalar bilan ta&apos;sirlashganda <strong>zaharli HCN gazi</strong> ajralib chiqadi!
            Kislotali muhitda ishlatish taqiqlanadi. Qizdirilganda ham HCN ajralishi mumkin.
            Ko&apos;z va teriga tushganda suv bilan yuvish kerak.
          </p>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/co-nh3-6-cl3" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Co(NH₃)₆]Cl₃ →
          </Link>
        </div>

      </section>
    </main>
  )
}