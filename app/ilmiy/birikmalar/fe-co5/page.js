import Link from "next/link"

export default function FeCO5() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧪 [Fe(CO)₅]</h1>
          <p className="text-purple-400 text-sm">pentakarboniltemir(0) • Iron pentacarbonyl • Trigonal-bipiramidal d⁸ kompleks</p>
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
              <div className="text-white font-bold">pentakarboniltemir(0)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔷</div>
              <div className="text-purple-400 text-xs mb-1">Geometriya</div>
              <div className="text-yellow-400 font-bold">Trigonal bipiramida</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">195.90 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Sariq suyuqlik"],
              ["Holati", "Suyuq (25°C)"],
              ["Suyuqlanish T", "−20°C"],
              ["Qaynash T", "103°C"],
              ["Koordinatsion son", "5"],
              ["Nuqtali guruh", "D<sub>3h</sub>"],
              ["Metall ioni", "Fe⁰ (d⁸)"],
              ["Ligand", "CO (karbonil) — 5 ta"],
              ["Magnit xossasi", "Diamagnit"],
              ["Gibridlanish", "dsp³"],
              ["Eruvchanlik (suv)", "Erimaydi"],
              ["Zichlik", "1.45 g/cm³"],
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
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — 18-elektron qoidasi</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Fe⁰ — nolinchi oksidlanish darajasi",
                matn: "Fe: [Ar] 3d⁶4s². Fe⁰ — 8 ta valent elektron (3d⁶4s²). CO — kuchli maydonli ligand, kuchli π-akseptor. 5 ta CO ligand — har biri 2 ta elektron beradi = 10 ta elektron. <strong>Jami: 8 + 10 = 18 ta valent elektron!</strong> 18-elektron qoidasi to&apos;liq qanoatlantirilgan.",
              },
              {
                sarlavha: "Trigonal-bipiramidal maydonda d-orbital ajralishi",
                matn: "D<sub>3h</sub> simmetriyada 5 ta d-orbital 3 ta energetik sathga ajraladi. Barcha bog&apos;lovchi MO lar to&apos;lgan, antibog&apos;lovchi MO lar bo&apos;sh. 18-elektron konfiguratsiya — barcha elektronlar juftlashgan.",
              },
              {
                sarlavha: "Magnit xossalari — diamagnit",
                matn: "18 ta valent elektron — barchasi juftlashgan. n = 0, μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong> Bu — Fe⁰ ning nolinchi oksidlanish darajasidagi barqaror birikmasi ekanligini ko&apos;rsatadi.",
              },
              {
                sarlavha: "CO — noyob ligand",
                matn: "CO — <strong>kuchli σ-donor va kuchli π-akseptor</strong>. σ-donorlik — CO ning 5σ orbitali orqali (uglerodning erkin elektron jufti). π-akseptorlik — CO ning bo&apos;sh 2π* orbitallari orqali. Bu <strong>sinergik bog&apos;lanish</strong> — metallning elektron zichligi CO ga qaytadi (π-qaytish). Sinergik bog&apos;lanish M−C bog&apos;ini mustahkamlaydi va C≡O bog&apos;ini zaiflashtiradi.",
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
                <strong>Geometriya:</strong> Trigonal bipiramida<br/>
                <strong>Nuqtali guruh:</strong> D<sub>3h</sub><br/>
                <strong>Fe−C (ekvatorial):</strong> 1.83 Å (3 ta)<br/>
                <strong>Fe−C (aksial):</strong> 1.81 Å (2 ta)<br/>
                <strong>C≡O masofa:</strong> 1.15 Å<br/>
                <strong>Fe−C≡O burchak:</strong> 180° (chiziqli)<br/>
                <strong>C<sub>ekv</sub>−Fe−C<sub>ekv</sub>:</strong> 120°<br/>
                <strong>C<sub>aks</sub>−Fe−C<sub>aks</sub>:</strong> 180°
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> D<sub>3h</sub><br/>
                <strong>Simmetriya elementlari:</strong><br/>
                • C₃ o&apos;qi (aksial CO orqali)<br/>
                • 3C₂ (C₃ ga perpendikulyar)<br/>
                • σ<sub>h</sub> (ekvatorial tekislik)<br/>
                • 3σ<sub>v</sub> (C₂ o&apos;qlari orqali)<br/>
                <strong>Inversiya markazi:</strong> Yo&apos;q<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)
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
                usul: "IQ spektroskopiya — asosiy diagnostik usul",
                matn: "ν(C≡O) — 2 ta intensiv polosa: <strong>2025 cm⁻¹ va 1995 cm⁻¹</strong> (eritmada). Erkin CO da ν(C≡O)=2143 cm⁻¹. Past chastotaga siljigan — bu Fe→CO π-qaytishini ko&apos;rsatadi (C≡O bog&apos;i zaiflashgan). D<sub>3h</sub> simmetriya tufayli 2 ta IQ-faol CO valent tebranish modi kuzatiladi.",
              },
              {
                usul: "¹³C YaMR spektroskopiya",
                matn: "Xona haroratida <strong>bitta signal</strong> δ ≈ 210 ppm — barcha 5 ta CO guruhi tez almashinadi (Berry psevdorotatsiyasi). Past haroratda (−100°C) ikkita signal: aksial CO (δ≈208) va ekvatorial CO (δ≈212). Bu — trigonal-bipiramidal geometriyaning isboti.",
              },
              {
                usul: "UB-Vis spektroskopiya",
                matn: "λ<sub>max</sub> ≈ 280 nm (UB soha). d-d o&apos;tishlar mavjud emas (barcha elektronlar juftlashgan). MLCT (Fe→CO π*) o&apos;tishlari UB sohada kuzatiladi. <strong>Rangi:</strong> sariq (ko&apos;rinadigan soha chegarasidagi yutilish tufayli).",
              },
              {
                usul: "Mass-spektrometriya",
                matn: "Molekulyar ion: [Fe(CO)₅]⁺ = 196 m/z. Fragmentlanish: ketma-ket CO molekulalarining yo&apos;qolishi: [Fe(CO)₅]⁺ → [Fe(CO)₄]⁺ (168) → [Fe(CO)₃]⁺ (140) → [Fe(CO)₂]⁺ (112) → [FeCO]⁺ (84) → Fe⁺ (56). Har bir fragment orasidagi farq 28 m/z — CO massasi.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 5. BERRY PSEVDOROTATSIYASI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Berry psevdorotatsiyasi — aksial-ekvatorial almashinuv</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[Fe(CO)₅] — Berry psevdorotatsiyasi kuzatiladigan klassik molekula!</strong>
              Xona haroratida aksial va ekvatorial CO ligandlari <strong>juda tez</strong> o&apos;rin almashadi.
              Bu jarayon <strong>Berry psevdorotatsiyasi</strong> deb ataladi. Natijada barcha 5 ta CO guruhi
              magnit jihatdan ekvivalent bo&apos;lib qoladi — ¹³C YaMR da bitta signal.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Berry psevdorotatsiyasi — trigonal-bipiramidadan kvadrat-piramida orqali o&apos;tib, yana trigonal-bipiramidadga qaytish",
              "Jarayon tezligi: k ≈ 10⁵−10⁷ s⁻¹ (xona haroratida). Past haroratda (−100°C) sekinlashadi",
              "Bu — molekulyar dinamikaning eng yorqin namunalaridan biri",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
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
                usul: "Sanoat usuli — temir va CO yuqori bosimda",
                reaksiya: "Fe + 5CO → [Fe(CO)₅] (200°C, 100−200 atm)",
                izoh: "Mayda disperslangan temir CO bilan yuqori harorat va bosimda reaksiyaga kirishadi. Suyuq mahsulot haydash orqali tozalanadi. Bu — sanoatda eng ko&apos;p qo&apos;llaniladigan usul.",
              },
              {
                usul: "Laboratoriya usuli — FeCl₂ dan qaytarish",
                reaksiya: "FeCl₂ + 5CO + 2Na → [Fe(CO)₅] + 2NaCl (THF da, yuqori bosim)",
                izoh: "FeCl₂ natriy yordamida qaytariladi va CO bilan reaksiyaga kirishadi. Inert atmosfera va suvsiz muhit talab qilinadi.",
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
                reaksiya: "Fotokimyoviy parchalanish",
                tenglama: "[Fe(CO)₅] + hν → [Fe(CO)₄] + CO (yorug&apos;lik ta&apos;sirida)",
                izoh: "Yorug&apos;lik ta&apos;sirida CO ajralib chiqadi va [Fe(CO)₄] oraliq mahsulot hosil bo&apos;ladi. Bu oraliq mahsulot juda faol — turli ligandlar bilan reaksiyaga kirishib, Fe(CO)₄L komplekslarini hosil qiladi.",
              },
              {
                reaksiya: "Termik parchalanish",
                tenglama: "2[Fe(CO)₅] → Fe₂(CO)₉ + CO (qizdirish bilan)",
                izoh: "100°C dan yuqori haroratda [Fe(CO)₅] dimerlanib, Fe₂(CO)₉ hosil qiladi. Fe₂(CO)₉ — sariq kristall modda. Keyingi qizdirishda Fe₃(CO)₁₂ va oxir-oqibat metallik temir hosil bo&apos;ladi.",
              },
              {
                reaksiya: "Ligand almashinishi",
                tenglama: "[Fe(CO)₅] + PR₃ → [Fe(CO)₄(PR₃)] + CO",
                izoh: "CO ligandlari boshqa ligandlar (PR₃, alkenlar, alkinlar) bilan almashinishi mumkin. Reaksiya D mexanizm bo&apos;yicha boradi — avval CO ajraladi, keyin yangi ligand birikadi.",
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

        {/* ── 8. QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-3">
            {[
              "Kukun metallurgiyasida — yuqori toza temir kukuni ishlab chiqarish ([Fe(CO)₅] parchalanishi orqali)",
              "Organik sintezda — CO manbai sifatida va katalizator prekursori",
              "Benzin antidetonatsion qo&apos;shimchasi — Fe(CO)₅ benzinga qo&apos;shilsa, oktan sonini oshiradi (hozir taqiqlangan)",
              "Ilmiy tadqiqotlarda — metall karbonillar kimyosining model birikmasi",
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
            [Fe(CO)₅] — <strong>juda zaharli!</strong> Uchuvchan suyuqlik, bug&apos;lari nafas yo&apos;llariga 
            zarar yetkazadi. Organizmda CO ajratib, karboksigemoglobin hosil qiladi. LD₅₀ ≈ 40 mg/kg 
            (kalamush, og&apos;iz orqali). Havoda ruxsat etilgan konsentratsiyasi (PEL): 0.1 ppm. 
            Yorug&apos;lik ta&apos;sirida CO ajratadi — qorong&apos;i idishda saqlanadi. 
            Ishlaganda <strong>tortish shkafi va shaxsiy himoya vositalari</strong> majburiy!
          </p>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Fe(CO)₅] — <strong className="text-yellow-400">pentakarboniltemir(0)</strong>, suyuq metall karbonil</li>
            <li>Fe⁰ (d⁸) + 5CO (10e⁻) = <strong>18 ta valent elektron</strong> — 18-elektron qoidasi</li>
            <li><strong>Trigonal-bipiramidal</strong> geometriya (D<sub>3h</sub>), diamagnit</li>
            <li>ν(C≡O) 2025, 1995 cm⁻¹ — erkin CO dan past (π-qaytish), Berry psevdorotatsiyasi</li>
            <li><strong>Juda zaharli!</strong> Uchuvchan, CO ajratadi — maxsus ehtiyot choralari zarur</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/zn-oh4" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold transition-all">
            [Zn(OH)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}