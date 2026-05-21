import Link from "next/link"

export default function Ferrosen() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🧪 [Fe(C₅H₅)₂] — Ferrosen</h1>
          <p className="text-purple-400 text-sm">bis(siklopentadienil)temir(II) • Ferrocene • &quot;Sendvich&quot; kompleks</p>
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
              <div className="text-white font-bold text-sm">bis(η⁵-siklopentadienil)temir(II)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🥪</div>
              <div className="text-purple-400 text-xs mb-1">Struktura turi</div>
              <div className="text-orange-400 font-bold">&quot;Sendvich&quot; kompleks</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">186.04 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "To&apos;q sariq kristall"],
              ["Holati", "Qattiq modda"],
              ["CAS raqami", "102-54-5"],
              ["Sublimatsiya", "100°C (vakuumda)"],
              ["Suyuqlanish T", "172−174°C"],
              ["Qaynash T", "249°C"],
              ["Eruvchanlik (suv)", "Erimaydi"],
              ["Eruvchanlik (organik)", "Yaxshi eriydi"],
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
          <h2 className="text-xl font-bold text-white mb-6">🏆 Tarixiy ahamiyati — metallorganik kimyoning boshlanishi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Ferrosen</strong> — <strong>metallorganik kimyoning eng muhim 
              birikmasi</strong>. 1951 yilda <strong>ikki mustaqil guruh</strong> tomonidan tasodifan kashf 
              etilgan: Tom Kealy va Peter Pauson (Angliya), hamda Samuel Miller va uning hamkasblari (AQSh).
              Uning haqiqiy &quot;sendvich&quot; tuzilishi <strong>1952 yilda Geoffrey Wilkinson, 
              Robert Woodward va Ernst Otto Fischer</strong> tomonidan aniqlangan. 
              Wilkinson va Fischer 1973 yilda <strong>Nobel mukofoti</strong>ga sazovor bo&apos;lishdi.
              Ferrosen kashfiyoti <strong>butunlay yangi fan sohasi — metallorganik kimyoni</strong> yaratdi.
            </p>
          </div>

          <div className="space-y-2 text-sm">
            {[
              "1951 — Kealy & Pauson, Miller — tasodifiy sintez (CpMgBr + FeCl₃)",
              "1952 — Wilkinson, Woodward, Fischer — &quot;sendvich&quot; tuzilishini aniqlash",
              "1973 — Wilkinson va Fischer — Nobel mukofoti (metallorganik kimyo)",
              "Hozirda — 50,000 dan ortiq ferrosen hosilalari sintez qilingan",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold text-xs">{i + 1}.</span>
                <p className="text-purple-200 text-xs">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🥪 Sendvich tuzilishi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Geometrik parametrlar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Struktura:</strong> Ikki parallel Cp halqasi orasida Fe atomi<br/>
                <strong>Nuqtali guruh (staggered):</strong> D<sub>5d</sub><br/>
                <strong>Nuqtali guruh (eclipsed):</strong> D<sub>5h</sub><br/>
                <strong>Fe−C masofa:</strong> 2.04 Å (barcha 10 ta C bir xil)<br/>
                <strong>C−C masofa (halqada):</strong> 1.40 Å<br/>
                <strong>C−H masofa:</strong> 1.08 Å<br/>
                <strong>Halqalar orasidagi masofa:</strong> 3.32 Å
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Konformatsiyalar</h3>
              <p className="text-purple-200 text-sm">
                <strong>Staggered (D<sub>5d</sub>):</strong><br/>
                • Halqalar bir-biriga nisbatan 36° burilgan<br/>
                • Kristall holatda asosiy konformatsiya<br/>
                • Energiyasi pastroq<br/>
                <strong>Eclipsed (D<sub>5h</sub>):</strong><br/>
                • Halqalar bir xil orientatsiyada<br/>
                • Energiyasi ~4 kJ/mol yuqori<br/>
                • Erkin aylanish — xona haroratida tez almashadi
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — 18-elektron qoidasi</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Fe²⁺ va Cp⁻ ligandlar",
                matn: "Fe²⁺: [Ar] 3d⁶ — 6 ta d-elektron. Har bir Cp⁻ (siklopentadienil anioni) 6 ta π-elektron beradi (η⁵-koordinatsiya). Ikki Cp⁻ — 12 ta elektron. <strong>Jami: 6 + 12 = 18 ta valent elektron!</strong> Bu — 18-elektron qoidasiga to&apos;liq mos keladigan eng klassik misol.",
              },
              {
                sarlavha: "Molekulyar orbitallar",
                matn: "Ferrosenda 10 ta d-orbital (Fe) va 10 ta π-orbital (2×Cp) o&apos;zaro ta&apos;sirlashadi. Eng muhim MO lar: e<sub>1g</sub> (bog&apos;lovchi, Cp→Fe), e<sub>2g</sub> (bog&apos;lanmagan, asosan Fe d-orbitallari), e<sub>1u</sub> (antibog&apos;lovchi, bo&apos;sh). HOMO = e<sub>2g</sub>, LUMO = e<sub>1u</sub>.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "18 ta elektron — barcha MO lar to&apos;liq to&apos;lgan yoki bo&apos;sh. Juftlanmagan elektronlar yo&apos;q. n = 0, μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong> Bu — ferrosenning eng muhim xossalaridan biri.",
              },
              {
                sarlavha: "Nima uchun barqaror?",
                matn: "1) 18-elektron qoidasi to&apos;liq qanoatlantirilgan. 2) Cp⁻ aromatik (6π-elektron, Hyukkel qoidasi). 3) Kuchli kovalent Fe−Cp bog&apos;lanish. 4) Termodinamik barqarorlik (ΔG°<sub>hosil</sub> &lt; 0). Ferrosen 400°C gacha parchalanishsiz qizdi.",
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
                usul: "UB-Vis spektroskopiya",
                matn: "λ<sub>max</sub> = 325 nm (ε ≈ 50), 440 nm (ε ≈ 90). d-d o&apos;tishlar va Cp→Fe zaryad ko&apos;chishi. <strong>Rangi:</strong> to&apos;q sariq. Ferrosenning rangi konsentratsiyaga bog&apos;liq — suyultirilgan eritmalari och sariq.",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(C−H):</strong> 3085 cm⁻¹ (aromatik C−H). <strong>ν(C=C):</strong> 1410 cm⁻¹. <strong>δ(C−H):</strong> 1000, 815 cm⁻¹. <strong>ν(Fe−Cp):</strong> 478 cm⁻¹. <strong>Xarakterli polosa:</strong> 1105 cm⁻¹ (Cp halqasi nafas olish tebranishi). IQ spektri juda xarakterli — &quot;barmoq izi&quot; sifatida ishlatiladi.",
              },
              {
                usul: "¹H YaMR spektroskopiya",
                matn: "<strong>Bitta signal:</strong> δ = 4.15 ppm (10 ta ekvivalent proton). Bu — ferrosenning yuqori simmetriyasini ko&apos;rsatadi! Barcha 10 ta proton magnit jihatdan ekvivalent. Halqalar erkin aylanadi (xona haroratida). <strong>¹³C YaMR:</strong> δ = 68 ppm (5 ta ekvivalent uglerod).",
              },
              {
                usul: "Mass-spektrometriya",
                matn: "M⁺ = 186 m/z (molekulyar ion, 100% intensivlik). Fragmentlanish: [Fe(C₅H₅)₂]⁺ → [Fe(C₅H₅)]⁺ (121 m/z) → Fe⁺ (56 m/z). Izotop taqsimoti: ¹⁵⁴Fe (5.8%), ¹⁵⁶Fe (91.7%) — temirning izotop namunasi kuzatiladi.",
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
                usul: "Klassik usul — CpMgBr + FeCl₂",
                reaksiya: "2C₅H₅MgBr + FeCl₂ → [Fe(C₅H₅)₂] + 2MgBrCl",
                izoh: "Siklopentadienilmagniy bromid (Grignard reaktivi) suvsiz FeCl₂ bilan reaksiyaga kirishadi. Reaksiya inert atmosferada (N₂ yoki Ar) olib boriladi. Mahsulot sublimatsiya orqali tozalanadi. Eng birinchi ishlatilgan usul (1951).",
              },
              {
                usul: "Zamonaviy usul — KOH/DMSO",
                reaksiya: "2C₅H₆ + 2KOH + FeCl₂ → [Fe(C₅H₅)₂] + 2KCl + 2H₂O",
                izoh: "Siklopentadien (C₅H₆) KOH ishtirokida DMSO da deprotonlanib, Cp⁻ hosil qiladi. Keyin FeCl₂ qo&apos;shiladi. Bu — laboratoriyada eng qulay va xavfsiz usul. Havo kislorodidan himoya qilish kerak.",
              },
              {
                usul: "To&apos;g&apos;ridan sintez — Fe + C₅H₆ (yuqori harorat)",
                reaksiya: "Fe + 2C₅H₆ → [Fe(C₅H₅)₂] + H₂ (300°C, N₂ atmosferasi)",
                izoh: "Metallik temir va siklopentadien bug&apos;lari yuqori haroratda reaksiyaga kirishadi. Sanoat usuli. Katalizator kerak emas, lekin chiqish unumi past.",
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
                reaksiya: "Oksidlanish — ferroseniy kationi",
                tenglama: "[Fe(C₅H₅)₂] → [Fe(C₅H₅)₂]⁺ + e⁻ (E° = +0.40 V vs NHE)",
                izoh: "Ferrosen oson va qaytar oksidlanib, ko&apos;k rangli ferroseniy ioni ([Fe(C₅H₅)₂]⁺) hosil qiladi. Bu — qaytar oksidlanish-qaytarilish jufti. Ferrosen/ferroseniy jufti <strong>elektrokimyoviy standart</strong> sifatida ishlatiladi.",
              },
              {
                reaksiya: "Elektrofil almashinish — Fridel-Krafts",
                tenglama: "[Fe(C₅H₅)₂] + CH₃COCl → [Fe(C₅H₄COCH₃)(C₅H₅)] + HCl (AlCl₃ katalizator)",
                izoh: "Ferrosen benzoldan 3×10⁶ marta faolroq elektrofil almashinishda! Sababi: Cp halqasi manfiy zaryadlangan — elektrofillarni kuchli tortadi. Asetilferrosen, ferrosenkarboksil kislota kabi hosilalar sintez qilingan.",
              },
              {
                reaksiya: "Metallatsiya — n-BuLi bilan",
                tenglama: "[Fe(C₅H₅)₂] + n-BuLi → [Fe(C₅H₄Li)(C₅H₅)] + C₄H₁₀",
                izoh: "n-Butillitiy ferrosenni metallaydi. Hosil bo&apos;lgan litiyli hosila turli elektrofillar bilan reaksiyaga kirishib, keng doiradagi ferrosen hosilalarini olish imkonini beradi.",
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

        {/* ── 8. QO'LLANISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💡 Amaliy qo&apos;llanishi</h2>
          
          <div className="space-y-3">
            {[
              "Elektrokimyoviy standart — ferrosen/ferroseniy jufti ichki standart sifatida (IUPAC tavsiyasi)",
              "Katalizatorlar — xiral ferrosenilfosfinlar asimmetrik sintezda (Nobel mukofoti 2001, Noyori)",
              "Materialshunoslik — ferrosen saqlovchi polimerlar (redoks-aktiv materiallar)",
              "Tibbiyot — ferrosen saqlovchi dorilar (ferroken, tamoksifen analogi — saratonga qarshi)",
              "Yoqilg&apos;i qo&apos;shimchalari — benzinga qo&apos;shilib, oktan sonini oshiradi va dvigatelni tozalaydi",
              "Sensorlar — glyukoza sensorlarida mediator sifatida (ferrosen/ferroseniy redoks jufti)",
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
            <li>[Fe(C₅H₅)₂] — <strong className="text-yellow-400">ferrosen</strong>, birinchi va eng mashhur sendvich kompleks</li>
            <li>Fe²⁺ (d⁶) + 2Cp⁻ (12e⁻) = <strong>18 ta valent elektron</strong> — 18-elektron qoidasining klassik namunasi</li>
            <li><strong>Diamagnit</strong>, juda barqaror (400°C gacha chidaydi), oson oksidlanadi (E° = +0.40 V)</li>
            <li><strong>¹H YaMR da bitta signal</strong> (δ = 4.15 ppm) — yuqori simmetriya (D<sub>5d</sub>/D<sub>5h</sub>)</li>
            <li>Benzoldan <strong>3×10⁶ marta faolroq</strong> elektrofil almashinishda — ko&apos;plab hosilalari sintez qilingan</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/ni-cn4" className="px-6 py-3 bg-orange-600/80 rounded-xl hover:bg-orange-500 text-white font-semibold transition-all">
            [Ni(CN)₄]²⁻ →
          </Link>
        </div>

      </section>
    </main>
  )
}