import Link from "next/link"

export const metadata = {
  alternates: { canonical: '/ilmiy/birikmalar/zn-oh4' },
  title: "[Zn(OH)₄]²⁻ — tetragidroksosinkat(II)",
  description:
    "Ruxning amfoter xossasi: Zn(OH)₂ ning ishqorda erishi, tetraedrik d¹⁰ kompleks va rangsizligining sababi.",
}

export default function ZnOH4() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/birikmalar" className="text-purple-400 hover:text-purple-300 transition-all text-lg">← Birikmalar bazasi</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">🧪 [Zn(OH)₄]²⁻</h1>
          <p className="text-purple-400 text-sm">tetragidroksosinkat(II) ioni • Tetrahydroxozincate(II) • Amfoter rux kompleksi</p>
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
              <div className="text-white font-bold">tetragidroksosinkat(II) ioni</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">🔄</div>
              <div className="text-purple-400 text-xs mb-1">Xususiyati</div>
              <div className="text-green-400 font-bold">Amfoter kompleks</div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <div className="text-purple-400 text-xs mb-1">Molekulyar massa</div>
              <div className="text-white font-bold">133.41 g/mol</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ["Rangi", "Rangsiz"],
              ["Holati", "Eritmada mavjud"],
              ["Koordinatsion son", "4"],
              ["Nuqtali guruh", "T<sub>d</sub>"],
              ["Metall ioni", "Zn²⁺ (d¹⁰)"],
              ["Ligand", "OH⁻ (gidrokso) — 4 ta"],
              ["Barqarorlik", "log β₄ ≈ 15.5"],
              ["Magnit xossasi", "Diamagnit"],
              ["Gibridlanish", "sp³"],
              ["Zn−O masofa", "~1.97 Å"],
              ["O−Zn−O burchak", "109.5°"],
              ["Eruvchanlik", "Suvda yaxshi"],
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/20 rounded-xl p-3 text-center">
                <div className="text-purple-400 text-xs">{r[0]}</div>
                <div className="text-white font-semibold text-sm" dangerouslySetInnerHTML={{ __html: r[1] }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. AMFOTERLIK — ASOSIY XUSUSIYAT ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Amfoterlik — ruxning noyob xossasi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">[Zn(OH)₄]²⁻ — amfoterlikning klassik namunasi!</strong>
              Rux gidroksid Zn(OH)₂ <strong>ham kislotalarda, ham ishqoriylarda</strong> eriydi.
              Ishqoriy muhitda erib, <strong>tetragidroksosinkat(II) ioni</strong>ni hosil qiladi.
              Bu xossa ruxni boshqa metallardan (masalan, Fe, Cu) ajratishda qo&apos;llaniladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Kislotali muhitda</h3>
              <p className="text-purple-200 text-sm">
                <strong>Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O</strong><br/>
                Rux gidroksid kislotada erib, Zn²⁺ ioni hosil qiladi.<br/>
                Zn²⁺ — akva kompleks [Zn(H₂O)₆]²⁺<br/>
                Bu — asos xossasi (H⁺ ni biriktirib oladi).
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Ishqoriy muhitda</h3>
              <p className="text-purple-200 text-sm">
                <strong>Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻</strong><br/>
                Rux gidroksid ishqorda erib, tetragidroksosinkat ioni hosil qiladi.<br/>
                Bu — kislota xossasi (OH⁻ ni biriktirib oladi).<br/>
                <strong>Amfoterlik</strong> — ham kislota, ham asos xossasi!
              </p>
            </div>
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <p className="text-green-300 text-sm">
              <strong>Amaliy ahamiyati:</strong> Ruxni ajratishda ishlatiladi. Rux saqlovchi rudalar ishqorda 
              eritilganda, rux [Zn(OH)₄]²⁻ holatida eritmaga o&apos;tadi, boshqa metallar (Fe, Cu) 
              cho&apos;kmada qoladi. Keyin eritma neytrallanib, Zn(OH)₂ cho&apos;ktiriladi.
            </p>
          </div>
        </div>

        {/* ── 3. ELEKTRON TUZILISHI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Elektron tuzilishi — d¹⁰ tetraedrik kompleks</h2>
          
          <div className="space-y-4">
            {[
              {
                sarlavha: "Zn²⁺ — d¹⁰ konfiguratsiya",
                matn: "Zn: [Ar] 3d¹⁰4s². Zn²⁺: [Ar] 3d¹⁰. Barcha 10 ta d-elektron to&apos;liq juftlashgan — d-orbitallar to&apos;liq to&apos;lgan. Juftlanmagan elektronlar yo&apos;q. Bu — barcha d¹⁰ komplekslarga xos xususiyat.",
              },
              {
                sarlavha: "KMBE = 0 — geometriya erkin tanlanadi",
                matn: "d¹⁰ konfiguratsiyada KMBE = 0 (barcha orbitallar to&apos;lgan yoki bo&apos;sh). Geometriya faqat <strong>sterik va elektrostatik omillar</strong> bilan belgilanadi. To&apos;rtta ligand uchun optimal geometriya — <strong>tetraedrik</strong> (sp³ gibridlanish, 109.5° burchak). Oktaedrik geometriya (KS=6) ham mavjud — masalan, [Zn(H₂O)₆]²⁺.",
              },
              {
                sarlavha: "Magnit xossalari — diamagnit",
                matn: "d¹⁰ — barcha elektronlar juftlashgan, n = 0. μ<sub>eff</sub> = 0. <strong>Diamagnit.</strong> Rangsiz — d-d o&apos;tishlar mavjud emas. Barcha d¹⁰ komplekslari rangsiz va diamagnit bo&apos;ladi.",
              },
              {
                sarlavha: "Nima uchun aynan 4 ta OH⁻?",
                matn: "Zn²⁺ + 4OH⁻ ⇌ [Zn(OH)₄]²⁻ — log β₄ ≈ 15.5. Zn²⁺ + 6OH⁻ ⇌ [Zn(OH)₆]⁴⁻ — beqaror (sterik to&apos;siq, OH⁻ ligandlar orasidagi kuchli itarilish). Shuning uchun ishqoriy muhitda asosan [Zn(OH)₄]²⁻ hosil bo&apos;ladi.",
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
                <strong>Geometriya:</strong> Muntazam tetraedr<br/>
                <strong>Nuqtali guruh:</strong> T<sub>d</sub><br/>
                <strong>Zn−O masofa:</strong> ~1.97 Å<br/>
                <strong>O−H masofa:</strong> 0.96 Å<br/>
                <strong>O−Zn−O burchak:</strong> 109.5°<br/>
                <strong>Zn−O−H burchak:</strong> ~109.5° (sp³ O)<br/>
                <strong>Dipol moment:</strong> 0 D (simmetriya)
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Simmetriya elementlari</h3>
              <p className="text-purple-200 text-sm">
                <strong>Nuqtali guruh:</strong> T<sub>d</sub><br/>
                <strong>Simmetriya elementlari:</strong><br/>
                • 4C₃ o&apos;qi<br/>
                • 3S₄ o&apos;qi<br/>
                • 6σ<sub>d</sub> tekislik<br/>
                • Jami amallar: 24 ta<br/>
                <strong>Inversiya markazi:</strong> YO&apos;Q<br/>
                <strong>Dipol moment:</strong> 0 D
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
                matn: "d¹⁰ konfiguratsiya — <strong>d-d o&apos;tishlar mavjud emas</strong> (d-orbitallar to&apos;liq to&apos;lgan). Zaryad ko&apos;chishi (LMCT — O→Zn) UB sohada (&lt; 250 nm). <strong>Rangi:</strong> rangsiz. Barcha Zn²⁺ komplekslari rangsiz bo&apos;ladi.",
              },
              {
                usul: "IQ spektroskopiya",
                matn: "<strong>ν(O−H):</strong> 3400−3600 cm⁻¹ (keng polosa, vodorod bog&apos;lar tufayli). <strong>δ(Zn−O−H):</strong> 900−1000 cm⁻¹. <strong>ν(Zn−O):</strong> 450−500 cm⁻¹ (past chastotali — og&apos;ir Zn atomi tufayli).",
              },
              {
                usul: "Raman spektroskopiya",
                matn: "T<sub>d</sub> simmetriyada A₁ (simmetrik valent) tebranish Raman-faol. ν(Zn−O) Raman: ~470 cm⁻¹. Inversiya markazi yo&apos;qligi tufayli ayrim tebranishlar ham IQ, ham Raman faol.",
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
                usul: "Zn(OH)₂ ni ishqorda eritish",
                reaksiya: "Zn(OH)₂↓ + 2NaOH → Na₂[Zn(OH)₄] (yoki Zn(OH)₂ + 2OH⁻ → [Zn(OH)₄]²⁻)",
                izoh: "Yangi cho&apos;ktirilgan Zn(OH)₂ ortiqcha ishqor eritmasida oson eriydi. Eritma bug&apos;latilgach, Na₂[Zn(OH)₄] kristallari olinadi. Kristallarda [Zn(OH)₄]²⁻ tetraedrlari Na⁺ ionlari bilan o&apos;ralgan.",
              },
              {
                usul: "ZnO ni ishqorda eritish",
                reaksiya: "ZnO + 2NaOH + H₂O → Na₂[Zn(OH)₄]",
                izoh: "Rux oksidi konsentrlangan ishqor eritmasida qizdirilsa, erib ketadi. Sanoatda rux rudalarini qayta ishlashda qo&apos;llaniladi.",
              },
              {
                usul: "Metallik ruxdan",
                reaksiya: "Zn + 2NaOH + 2H₂O → Na₂[Zn(OH)₄] + H₂↑",
                izoh: "Metallik rux ishqor eritmasida erib, vodorod ajratib chiqaradi. Reaksiya sekin boradi — rux amfoter metall.",
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
                reaksiya: "Kislota qo&apos;shilsa — Zn(OH)₂ cho&apos;kmasi",
                matn: "[Zn(OH)₄]²⁻ + 2H⁺ → Zn(OH)₂↓ + 2H₂O. Neytrallanganda oq amorf Zn(OH)₂ cho&apos;kmasi tushadi. Ortiqcha kislotada: Zn(OH)₂ + 2H⁺ → Zn²⁺ + 2H₂O.",
              },
              {
                reaksiya: "Ammoniy tuzlari bilan — Zn(OH)₂ cho&apos;kmasi",
                matn: "[Zn(OH)₄]²⁻ + 2NH₄⁺ → Zn(OH)₂↓ + 2NH₃ + 2H₂O. Ammoniy xlorid qo&apos;shilganda Zn(OH)₂ cho&apos;kmasi tushadi. Ortiqcha NH₃ da: Zn(OH)₂ + 4NH₃ → [Zn(NH₃)₄]²⁺ + 2OH⁻.",
              },
              {
                reaksiya: "Karbonat angidrid bilan",
                matn: "[Zn(OH)₄]²⁻ + CO₂ → ZnCO₃↓ + 2OH⁻ + H₂O. Havodagi CO₂ ta&apos;sirida ZnCO₃ cho&apos;kmasi tushishi mumkin. Shuning uchun ishqoriy rux eritmalari germetik idishda saqlanadi.",
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
              "Ruxni boshqa metallardan ajratish — rudalarni ishqorda eritib, ruxni [Zn(OH)₄]²⁻ holatida eritmaga o&apos;tkazish",
              "Galvanik qoplamalar — ishqoriy ruxlash elektrolitlarida ([Zn(OH)₄]²⁻ asosiy komponent)",
              "Kimyoviy manbalar — rux-ishqor batareyalarida elektrolit sifatida",
              "Analitik kimyoda — Al³⁺ va Zn²⁺ ni farqlashda (Zn(OH)₂ ortiqcha ishqorda eriydi, Al(OH)₃ ham eriydi)",
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-4 border border-purple-700/30 flex items-start gap-3">
                <span className="text-yellow-400 font-bold">{i + 1}.</span>
                <p className="text-purple-200 text-sm">{r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>[Zn(OH)₄]²⁻ — <strong className="text-yellow-400">tetragidroksosinkat(II)</strong>, amfoter rux kompleksi</li>
            <li>Zn²⁺ (d¹⁰) — <strong>diamagnit, rangsiz</strong>, KMBE = 0</li>
            <li><strong>Tetraedrik geometriya</strong> (T<sub>d</sub>), sp³ gibridlanish</li>
            <li>Zn(OH)₂ + 2OH⁻ ⇌ [Zn(OH)₄]²⁻ — <strong>qaytar amfoter reaksiya</strong></li>
            <li>Rux rudalarini qayta ishlashda va galvanik qoplamalarda muhim ahamiyatga ega</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/birikmalar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Birikmalar bazasi
          </Link>
          <Link href="/ilmiy/birikmalar/cr-h2o6" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            [Cr(H₂O)₆]³⁺ →
          </Link>
        </div>

      </section>
    </main>
  )
}