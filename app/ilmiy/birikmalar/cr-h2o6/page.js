import Link from "next/link"

export default function CrH2O6() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🧪 [Cr(H₂O)₆]³⁺</h1>
          <p className="text-purple-400 text-sm">geksaakvaxrom(III) ioni • Hexaaquachromium(III) • d³ inert kompleks</p>
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
              <div className="text-white font-bold">geksaakvaxrom(III) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🐢</div>
              <div className="text-purple-400 text-xs mb-1">Xususiyati</div>
              <div className="text-purple-400 font-bold">Inert (juda sekin almashinuvchi)</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">160.07 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Binafsha (eritmada)"],
              ["Holati", "Eritmada mavjud"],
              ["Koordinatsion son", "6"],
              ["Nuqtali guruh", "O<sub>h</sub>"],
              ["Metall ioni", "Cr³⁺ (d³)"],
              ["Ligand", "H₂O (akva) — 6 ta"],
              ["Barqarorlik", "log β₁ ≈ 10 (o&apos;rtacha)"],
              ["Magnit xossasi", "Paramagnit (n=3)"],
              ["μ<sub>eff</sub>", "3.7−3.9 μ<sub>B</sub>"],
              ["Δ<sub>o</sub>", "17,400 cm⁻¹"],
              ["Cr−O masofa", "1.97 Å"],
              ["Suv almashinuvi", "t<sub>½</sub> ≈ 80 soat!"],
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
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — d³ klassik misol</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Cr³⁺ — d³ konfiguratsiya",
                matn: "Cr: [Ar] 3d⁵4s¹. Cr³⁺: [Ar] 3d³. 3 ta d-elektron. Oktaedrik maydonda faqat <strong>yuqori spinli</strong> holat mavjud (t₂g³ eg⁰). d³ konfiguratsiya uchun past spin mavjud emas — 3 ta elektron t₂g orbitallarda parallel spin bilan joylashadi (Hund qoidasi).",
              },
              {
                sarlavha: "KMBE — eng yuqori barqarorlik",
                matn: "KMBE = 3 × (−0.4Δ<sub>o</sub>) + 0 × (+0.6Δ<sub>o</sub>) = <strong>−1.2Δ<sub>o</sub></strong>. Bu — oktaedrik komplekslar orasida eng yuqori KMBE lardan biri (d⁶(QS) 2.4Δ<sub>o</sub> bilan bir qatorda). Yuqori KMBE <strong>inertlikka</strong> sabab bo&apos;ladi.",
              },
              {
                sarlavha: "Magnit xossalari",
                matn: "t₂g³ — 3 ta toq elektron (Har bir t₂g orbitalda bittadan). Spin-only: μ<sub>SO</sub> = √3(3+2) = √15 = <strong>3.87 μ<sub>B</sub></strong>. Eksperimental: μ<sub>eff</sub> = <strong>3.7−3.9 μ<sub>B</sub></strong>. A₂<sub>g</sub> asosiy term — orbital hissa deyarli yo&apos;q. Spin-only formula juda yaxshi ishlaydi.",
              },
              {
                sarlavha: "Nima uchun inert?",
                matn: "d³ da t₂g orbitallar yarim to&apos;lgan (t₂g³) — <strong>almashinuv energiyasi</strong> qo&apos;shimcha barqarorlik beradi. Ligand almashinishi vaqtida (I<sub>d</sub> yoki I<sub>a</sub> mexanizm) bu barqarorlik yo&apos;qoladi — aktivatsiya energiyasi yuqori (E<sub>a</sub> ≈ 110 kJ/mol). Natija: <strong>t<sub>½</sub> ≈ 80 soat!</strong>",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sarlavha}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. RANGI VA SPEKTRI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎨 Rangi va elektron spektri — nega binafsha?</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "UB-Vis spektri — ikkita asosiy polosa",
                matn: "d³ oktaedrik — 3 ta spin-ruxsat d-d o&apos;tish kutiladi. Amalda 2 tasi ko&apos;rinadigan sohada:<br/><strong>ν₁ = 17,400 cm⁻¹ (575 nm):</strong> ⁴A₂<sub>g</sub> → ⁴T₂<sub>g</sub> — sariq nurni yutadi<br/><strong>ν₂ = 24,600 cm⁻¹ (407 nm):</strong> ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(F) — binafsha nurni yutadi<br/><strong>ν₃ = 37,800 cm⁻¹ (265 nm):</strong> ⁴A₂<sub>g</sub> → ⁴T₁<sub>g</sub>(P) — UB sohada",
              },
              {
                sarlavha: "Rang — binafsha",
                matn: "ν₁ sariq nurni (575 nm), ν₂ binafsha nurni (407 nm) yutadi. O&apos;rtacha qolgan rang — <strong>binafsha</strong>. ε ≈ 15−20 L·mol⁻¹·cm⁻¹ (Laport-taqiqlangan d-d o&apos;tishlar). Δ<sub>o</sub> = ν₁ = 17,400 cm⁻¹ — to&apos;g&apos;ridan-to&apos;g&apos;ri spektrdan aniqlanadi.",
              },
              {
                sarlavha: "Spektrdan Δ<sub>o</sub> va B hisoblash",
                matn: "ν₁ = Δ<sub>o</sub> = 17,400 cm⁻¹. ν₂/ν₁ = 24,600/17,400 = 1.414. Tanabe-Sugano diagrammasidan: Δ<sub>o</sub>/B ≈ 24.7. B = 17,400/24.7 = 704 cm⁻¹. Erkin Cr³⁺ uchun B = 1030 cm⁻¹. β = 704/1030 = 0.68 — kuchli nefelauksetrik effekt (kovalentlik yuqori).",
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
                <strong>Geometriya:</strong> Muntazam oktaedr<br/>
                <strong>Nuqtali guruh:</strong> O<sub>h</sub><br/>
                <strong>Cr−O masofa:</strong> 1.97 Å<br/>
                <strong>O−H masofa:</strong> 0.96 Å<br/>
                <strong>O−Cr−O burchak:</strong> 90° va 180°<br/>
                <strong>Cr−O−H burchak:</strong> ≈ 120° (sp² gibridlangan O)<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> O<sub>h</sub><br/>
                <strong>Simmetriya elementlari:</strong><br/>
                • 3C₄, 4C₃, 6C₂<br/>
                • Inversiya markazi (Cr atomida)<br/>
                • 3σ<sub>h</sub>, 6σ<sub>d</sub><br/>
                • Jami amallar: 48 ta<br/>
                <strong>Inversiya markazi:</strong> Ha<br/>
                <strong>Alternativ taqiq:</strong> Amal qiladi
              </p>
            </div>
          </div>
        </div>

        {/* ── 5. OLINISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚗️ Olinishi</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "Cr³⁺ tuzlarini suvda eritish",
                reaksiya: "CrCl₃·6H₂O + H₂O → [Cr(H₂O)₆]³⁺ + 3Cl⁻",
                izoh: "CrCl₃·6H₂O suvda eritilganda binafsha rangli [Cr(H₂O)₆]³⁺ eritmasi hosil bo&apos;ladi. Aslida CrCl₃·6H₂O bir nechta izomer shaklida mavjud: [Cr(H₂O)₆]Cl₃ (binafsha), [Cr(H₂O)₅Cl]Cl₂·H₂O (och yashil), [Cr(H₂O)₄Cl₂]Cl·2H₂O (to&apos;q yashil).",
              },
              {
                usul: "CrO₃ yoki K₂Cr₂O₇ dan qaytarish",
                reaksiya: "K₂Cr₂O₇ + 3SO₂ + H₂SO₄ + H₂O → 2[Cr(H₂O)₆]³⁺ + 3SO₄²⁻ + 2K⁺",
                izoh: "Cr(VI) birikmalari (K₂Cr₂O₇, CrO₃) kislotali muhitda SO₂, etanol yoki boshqa qaytaruvchilar bilan Cr(III) gacha qaytariladi. Eritma rangi to&apos;q sariqdan binafshaga o&apos;zgaradi.",
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
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kimyoviy xossalari — inert kompleks</h2>
          
          <div className="space-y-3">
            {[
              {
                reaksiya: "Suv almashinuvi — juda sekin",
                matn: "[Cr(H₂O)₆]³⁺ + H₂O* → [Cr(H₂O)₅(H₂O*)]³⁺ + H₂O. k<sub>H₂O</sub> = 2.4×10⁻⁶ s⁻¹ (25°C). <strong>t<sub>½</sub> ≈ 80 soat!</strong> Bu — eng inert akva komplekslardan biri. Sababi: yuqori KMBE va almashinuv energiyasi.",
              },
              {
                reaksiya: "Gidroliz — kislotalilik",
                matn: "[Cr(H₂O)₆]³⁺ + H₂O ⇌ [Cr(H₂O)₅(OH)]²⁺ + H₃O⁺ (pK<sub>a</sub> ≈ 4.0). Cr³⁺ akva kompleksi nisbatan kuchli kislota (Fe³⁺ dan kuchsizroq, Al³⁺ bilan taqqoslanuvchi). Ishqoriy muhitda Cr(OH)₃ cho&apos;kmasi tushadi.",
              },
              {
                reaksiya: "Ligand almashinishi — yuqori haroratda",
                matn: "[Cr(H₂O)₆]³⁺ + 6NH₃ → [Cr(NH₃)₆]³⁺ + 6H₂O (qizdirish, katalizator bilan). Xona haroratida almashinish deyarli bormaydi. Yuqori harorat va ko&apos;mir katalizatori talab qilinadi. Hosil bo&apos;lgan [Cr(NH₃)₆]³⁺ — sariq rangli.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.reaksiya}</h3>
                <p className="text-purple-200 text-sm">{r.matn}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. SPEKTROSKOPIK XOSSALARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Spektroskopik xossalari</h2>
          
          <div className="space-y-4">
            {[
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(O−H):</strong> 3100−3500 cm⁻¹ (keng polosa, H-bog&apos;lar). <strong>δ(H−O−H):</strong> 1600−1650 cm⁻¹. <strong>ν(Cr−O):</strong> 490 cm⁻¹. <strong>ρ(H₂O):</strong> 750−800 cm⁻¹. O<sub>h</sub> simmetriya tufayli alternativ taqiq amal qiladi.",
              },
              {
                usul: "EPR spektroskopiya",
                matn: "Cr³⁺ (d³, S=3/2) — EPR signali kuzatiladi. g-faktor ≈ 1.98 (izotrop, O<sub>h</sub> simmetriya). Nolinchi maydon ajralishi (ZFS) ≈ 0.5−1.0 cm⁻¹. ⁵³Cr (I=3/2, 9.5% tabiiy miqdor) gipernozik struktura kuzatilishi mumkin.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.usul}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.matn }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 8. IZOMERLARI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Gidrat izomeriyasi — klassik misol</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              CrCl₃·6H₂O — <strong>gidrat izomeriyasining klassik namunasi!</strong> 
              Bir xil empirik formulaga ega bo&apos;lgan uch xil izomer mavjud. Ular rangi, 
              elektr o&apos;tkazuvchanligi va kimyoviy xossalari bilan farq qiladi.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Izomer</th>
                <th className="py-3 px-4 text-purple-300">Tarkibi</th>
                <th className="py-3 px-4 text-purple-300">Rangi</th>
                <th className="py-3 px-4 text-purple-300">Eritmadagi ionlar soni</th>
                <th className="py-3 px-4 text-purple-300">AgNO₃ bilan cho&apos;kmaga tushadigan Cl⁻</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Binafsha", "[Cr(H₂O)₆]Cl₃", "Binafsha", "4 ta", "3 ta Cl⁻ (barchasi)"],
                  ["Och yashil", "[Cr(H₂O)₅Cl]Cl₂·H₂O", "Och yashil", "3 ta", "2 ta Cl⁻"],
                  ["To&apos;q yashil", "[Cr(H₂O)₄Cl₂]Cl·2H₂O", "To&apos;q yashil", "2 ta", "1 ta Cl⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-yellow-400">{r[0]}</td>
                    <td className="py-3 px-4 text-sm">{r[1]}</td>
                    <td className="py-3 px-4">{r[2]}</td>
                    <td className="py-3 px-4">{r[3]}</td>
                    <td className="py-3 px-4 text-sm">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Cr(H₂O)₆]³⁺ — <strong className="text-yellow-400">geksaakvaxrom(III)</strong>, binafsha rangli inert kompleks</li>
            <li>Cr³⁺ (d³) — t₂g³, <strong>3 ta toq elektron</strong>, paramagnit (μ≈3.87 μ<sub>B</sub>)</li>
            <li><strong>KMBE = −1.2Δ<sub>o</sub></strong> — yuqori barqarorlik, almashinuv energiyasi tufayli juda inert</li>
            <li>Δ<sub>o</sub> = 17,400 cm⁻¹, ν₂/ν₁ = 1.414, B = 704 cm⁻¹, β = 0.68</li>
            <li>CrCl₃·6H₂O — <strong>gidrat izomeriyasining klassik namunasi</strong> (3 ta izomer)</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold transition-all">
            Barcha birikmalar →
          </Link>
        </div>

      </section>
    </main>
  )
}