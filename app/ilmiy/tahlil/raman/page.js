import Link from "next/link"

export const metadata = {
  alternates: { canonical: '/ilmiy/tahlil/raman' },
  title: "Raman spektroskopiya",
  description:
    "Noelastik yorug'lik sochilishiga asoslangan tebranish spektroskopiyasi: metall-ligand dinamikasi va IQ bilan o'zaro to'ldiruvchanlik.",
}

export default function RamanSpektroskopiya() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">

      {/* ============ HEADER ============ */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50 sticky top-0 backdrop-blur-md bg-purple-950/70 z-10">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-sky-400">🔆 Raman spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Noelastik yorug'lik sochilishi • Tebranish spektroskopiyasi • Metall-ligand dinamikasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ============ HERO / KIRISH ============ */}
        <div className="bg-gradient-to-br from-sky-900/40 via-purple-900/40 to-blue-900/40 border border-sky-700/40 rounded-2xl p-8 shadow-xl shadow-sky-500/5">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl">🔆</div>
            <div>
              <h2 className="text-3xl font-bold text-sky-300 mb-2">Raman spektroskopiyasi</h2>
              <p className="text-purple-300 text-sm">Chandrasekhara Venkata Raman • 1928 • Nobel mukofoti (1930)</p>
            </div>
          </div>
          <p className="text-purple-200 text-lg leading-relaxed">
            <strong className="text-sky-400">Raman spektroskopiyasi</strong> — moddaning
            <strong className="text-sky-400"> monoxromatik yorug'likni noelastik sochishi</strong> (inelastic scattering)
            hodisasiga asoslangan tebranish-aylanma spektroskopiya usuli. 1928-yilda hind fizigi
            <em className="text-sky-300"> C.V. Raman</em> tomonidan kashf etilgan bo'lib, 1930-yilda ushbu ish
            uchun Nobel mukofoti berilgan. Kompleks birikmalar kimyosida bu usul <strong className="text-sky-400">
            simmetrik tebranishlar, metall–metall bog'lar, metall–ligand tebranishlari</strong> va
            <strong className="text-sky-400"> suvli eritmalardagi koordinatsion muvozanatlar</strong>ni tekshirishda
            IQ spektroskopiyaga zaruriy va bir-birini to'ldiruvchi juftlik hisoblanadi.
          </p>
        </div>

        {/* ============ NAVIGATSIYA — BIRIKMALAR ============ */}
        <Link
          href="/ilmiy/tahlil/raman/birikmalar"
          className="group block bg-gradient-to-r from-sky-900/40 to-purple-900/40 border border-sky-700/50 rounded-2xl p-6 hover:bg-sky-900/60 hover:border-sky-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🧪</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors">
                Kompleks birikmalarning Raman spektroskopik tahlili →
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                K₃[Fe(CN)₆], [Co(NH₃)₆]Cl₃, [Ru(bpy)₃]²⁺, ferrosen va boshqa 12 ta klassik
                kompleks birikmaning Raman spektrlari batafsil talqini.
              </p>
            </div>
            <div className="text-3xl text-sky-400 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-sky-600/20 text-sky-400 border border-sky-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">M–L tebranishlar</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">Simmetriya tahlili</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Suvli eritmalar</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">Rezonans Raman</span>
          </div>
        </Link>

        {/* ============ MUNDARIJA ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">📚 Sahifa mundarijasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              ["1", "Tarixiy asos va kashfiyot"],
              ["2", "Raman effektining fizik mohiyati"],
              ["3", "Stokes va anti-Stokes sochilishi"],
              ["4", "Kvant-mexanik talqin"],
              ["5", "Qutblanuvchanlik va tanlash qoidalari"],
              ["6", "IQ va Raman: o'zaro istisno prinsipi"],
              ["7", "Raman spektroskopiyasining turlari"],
              ["8", "Instrumentatsiya va lazer manbalari"],
              ["9", "Komplekslar uchun chastotalar jadvali"],
              ["10", "Guruhli-nazariy simmetriya tahlili"],
              ["11", "Cheklovlar va xatolik manbalari"],
              ["12", "Amaliy xulosalar"],
            ].map(([n, t]) => (
              <div key={n} className="flex items-center gap-2 text-purple-200 hover:text-sky-300 transition-colors">
                <span className="w-6 h-6 flex items-center justify-center bg-sky-600/30 text-sky-300 rounded-full text-xs font-bold">{n}</span>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* ============ 1. TARIXIY ASOS ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">1️⃣ Tarixiy asos va kashfiyot</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            1923-yilda avstriyalik fizik <strong className="text-sky-400">Adolf Smekal</strong> nazariy jihatdan
            fotonlarning atom va molekulalardan noelastik sochilishi imkoniyatini bashorat qilgan edi
            (<em>Smekal-Raman effekti</em>). Amaliy tasdiqni esa 1928-yil 28-fevralda Kalkuttada
            <strong className="text-sky-400"> C.V. Raman va K.S. Krishnan</strong> quyosh nurini benzol,
            toluol, glitserin va boshqa suyuqliklardan o'tkazib, sochilgan yorug'likda
            <strong> yangi, tushuvchi nurga qaraganda uzunroq to'lqinli chiziqlar</strong> mavjudligini
            ko'rsatib berdi. Bir vaqtning o'zida sovet fiziklari
            <strong className="text-sky-400"> G.S. Landsberg va L.I. Mandelshtam</strong> Moskvada kvarts
            kristallarida xuddi shu effektni kashf etishdi (shu sababli rus adabiyotida bu hodisa
            "kombinatsion sochilish" — <em>комбинационное рассеяние</em> deb ataladi).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-1">📅 1923</div>
              <p className="text-purple-200 text-xs">Smekal — nazariy bashorat</p>
            </div>
            <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-1">🔬 1928</div>
              <p className="text-purple-200 text-xs">Raman & Krishnan — eksperimental tasdiq</p>
            </div>
            <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
              <div className="text-sky-400 font-bold text-sm mb-1">🏆 1930</div>
              <p className="text-purple-200 text-xs">Nobel mukofoti — C.V. Raman</p>
            </div>
          </div>
          <p className="text-purple-300 text-sm mt-4 italic">
            💡 Zamonaviy Raman spektroskopiyasi 1962-yilda lazer ixtirosidan keyingina keng qo'llanila boshladi —
            lazer monoxromatik, kogerent va yuqori intensivlikdagi manba sifatida noelastik sochilishning
            juda kuchsiz signalini (10⁻⁶−10⁻⁸ tushuvchi intensivlikdan) qayd etishga imkon berdi.
          </p>
        </div>

        {/* ============ 2. FIZIK MOHIYAT ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">2️⃣ Raman effektining fizik mohiyati</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Molekulaga <strong className="text-sky-400">ν₀ chastotali</strong> monoxromatik yorug'lik tushirilganda,
            fotonlarning katta qismi molekula bilan <strong>elastik to'qnashadi</strong> — chiquvchi foton energiyasi
            aynan ν₀ ga teng bo'ladi. Bu <strong className="text-sky-400">Reley sochilishi</strong> deb ataladi
            (~1 foton 10⁴ dan). Ammo juda kam qismi (~1 foton 10⁶–10⁸ dan)
            <strong className="text-sky-400"> molekula bilan energiya almashadi</strong> — sochilgan fotonning
            energiyasi molekulaning tebranish yoki aylanish holatining o'zgarishi hisobiga
            <strong>ortadi yoki kamayadi</strong>. Aynan shu <em>noelastik</em> sochilish
            Raman sochilishidir.
          </p>

          <div className="bg-gradient-to-r from-sky-900/30 to-purple-900/30 border border-sky-500/30 rounded-xl p-6 my-6">
            <h3 className="text-sky-400 font-bold mb-3">📐 Asosiy energetik munosabat</h3>
            <div className="font-mono text-yellow-300 text-center text-lg py-2">
              hν<sub>sochilgan</sub> = hν₀ ± hν<sub>tebranish</sub>
            </div>
            <div className="font-mono text-yellow-200 text-center text-sm py-1">
              Δν = ν₀ − ν<sub>sochilgan</sub>  (Raman siljishi, sm⁻¹)
            </div>
            <p className="text-purple-300 text-xs text-center mt-2">
              Raman siljishi tushuvchi lazer to'lqin uzunligiga bog'liq emas — bu molekulaning ichki xususiyati.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-800/30 rounded-xl p-4 border border-blue-600/40">
              <div className="text-blue-300 font-bold mb-2">🔵 Reley sochilishi</div>
              <p className="text-purple-200 text-xs">Elastik. hν<sub>chiquvchi</sub> = hν₀. Intensivlik ~ ν⁴ (shuning uchun osmon ko'k). Raman spektrida markazdagi kuchli chiziq.</p>
            </div>
            <div className="bg-red-800/30 rounded-xl p-4 border border-red-600/40">
              <div className="text-red-300 font-bold mb-2">🔴 Stokes sochilishi</div>
              <p className="text-purple-200 text-xs">Noelastik. Molekula energiya <em>yutadi</em>: hν₀ − hν<sub>teb</sub>. Foton energiyasi kamayadi (qizilroq). Xona haroratida <strong>ustun</strong>.</p>
            </div>
            <div className="bg-emerald-800/30 rounded-xl p-4 border border-emerald-600/40">
              <div className="text-emerald-300 font-bold mb-2">🟢 Anti-Stokes sochilishi</div>
              <p className="text-purple-200 text-xs">Noelastik. Molekula energiya <em>beradi</em>: hν₀ + hν<sub>teb</sub>. Foton energiyasi ortadi (ko'kroq). Faqat qizigan holatdan yuz beradi — intensivligi kam.</p>
            </div>
          </div>
        </div>

        {/* ============ 3. STOKES / ANTI-STOKES ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">3️⃣ Stokes va anti-Stokes chiziqlar intensivligi</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Xona haroratida molekulalarning katta qismi asosiy tebranish sathida (v=0) bo'ladi,
            shuning uchun <strong className="text-sky-400">Stokes chiziqlari anti-Stokesdan ancha kuchli</strong>.
            Ularning intensivlik nisbati <strong>Boltsman taqsimoti</strong> bilan aniqlanadi:
          </p>

          <div className="bg-gradient-to-r from-sky-900/30 to-purple-900/30 border border-sky-500/30 rounded-xl p-6 my-4">
            <div className="font-mono text-yellow-300 text-center text-lg py-2">
              I<sub>anti-Stokes</sub> / I<sub>Stokes</sub> = [(ν₀ + ν<sub>teb</sub>)/(ν₀ − ν<sub>teb</sub>)]⁴ · exp(−hν<sub>teb</sub>/k<sub>B</sub>T)
            </div>
            <p className="text-purple-300 text-xs text-center mt-2">
              Bu munosabat orqali <strong>haroratni masofadan aniqlash</strong> mumkin (yong'in monitoringida qo'llaniladi).
            </p>
          </div>

          <div className="bg-yellow-900/20 border-l-4 border-yellow-500 rounded-r-xl p-4 my-4">
            <p className="text-purple-200 text-sm">
              <strong className="text-yellow-400">Amalda:</strong> Raman spektrida odatda faqat <strong>Stokes qismi</strong>
              chizmalanadi (0–4000 sm⁻¹ oralig'ida), chunki u informativroq va intensivroq. Anti-Stokes
              qismi esa fluoressensiyani chetlab o'tish yoki harorat o'lchash uchun ishlatiladi.
            </p>
          </div>
        </div>

        {/* ============ 4. KVANT TALQIN ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">4️⃣ Kvant-mexanik talqin: virtual holat</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Raman sochilishi ikki bosqichli jarayon sifatida qaraladi:
            <br />1) Molekula fotonni yutib, <strong className="text-sky-400">virtual (haqiqiy bo'lmagan) energetik holatga</strong> o'tadi;
            <br />2) Bu virtual holat juda qisqa (~10⁻¹⁴ s) yashaydi va molekula darhol asos yoki
            qo'zg'algan tebranish sathiga foton chiqarib qaytadi.
          </p>
          <p className="text-purple-200 leading-relaxed mb-4">
            Virtual holat <strong className="text-sky-400">haqiqiy elektron holat emas</strong> — u molekulaning
            biror kvant sathiga to'g'ri kelmasligi mumkin. Agar tushuvchi foton energiyasi haqiqiy elektron
            o'tishga yaqin bo'lsa, virtual holat haqiqiy holatga aylanadi va bu
            <strong className="text-sky-400"> Rezonans Raman effekti</strong>ni beradi (bo'lim 7).
          </p>

          <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-6 my-4">
            <h3 className="text-sky-400 font-bold mb-3">📊 Jarayonlarning kvant sxemasi</h3>
            <div className="font-mono text-purple-200 text-xs md:text-sm space-y-1 leading-relaxed">
              <div className="text-yellow-300">━━━━━━━━━━━━━━━━━━━━━━━━ virtual holat</div>
              <div className="pl-4">↑ hν₀   ↓ hν₀      ↑ hν₀   ↓ hν₀−hν<sub>teb</sub>   ↑ hν₀   ↓ hν₀+hν<sub>teb</sub></div>
              <div className="text-sky-300">━━━━━━━━━━━━━━━━━━━━━━━━ v=1 (tebranish holati)</div>
              <div className="text-sky-300">━━━━━━━━━━━━━━━━━━━━━━━━ v=0 (asos holat)</div>
              <div className="pt-2 text-purple-300 text-xs">
                Reley  →  Stokes  →  anti-Stokes
              </div>
            </div>
          </div>
        </div>

        {/* ============ 5. QUTBLANUVCHANLIK ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">5️⃣ Qutblanuvchanlik va Raman tanlash qoidasi</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            IQ spektroskopiyada tebranish faol bo'lishi uchun <strong>dipol moment o'zgarishi</strong> talab qilinadi.
            Raman da esa <strong className="text-sky-400">qutblanuvchanlik (polarizability, α) o'zgarishi</strong>
            zarur. Molekulaga tashqi elektr maydon <strong>E</strong> ta'sir etganda induktsiyalangan dipol moment
            <strong> μ<sub>ind</sub> = α · E</strong> yuzaga keladi. Molekula tebranganda α ning qiymati
            davriy o'zgaradi va shu tufayli sochilgan yorug'likda yangi chastotalar paydo bo'ladi.
          </p>

          <div className="bg-gradient-to-r from-sky-900/30 to-purple-900/30 border border-sky-500/30 rounded-xl p-6 my-4">
            <h3 className="text-sky-400 font-bold mb-3">📐 Raman tanlash qoidasi</h3>
            <div className="font-mono text-yellow-300 text-center text-base py-2">
              (∂α/∂Q)<sub>Q=0</sub> ≠ 0
            </div>
            <p className="text-purple-300 text-sm text-center">
              Tebranish Raman-faol bo'lishi uchun normal koordinata <em>Q</em> bo'yicha qutblanuvchanlik
              tenzorining <strong>hosilasi nolga teng bo'lmasligi</strong> shart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-emerald-900/20 border border-emerald-600/40 rounded-xl p-5">
              <h3 className="text-emerald-400 font-bold mb-2">✅ Raman-faol tebranishlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Simmetrik cho'zilish</strong> — CO₂ da ν<sub>s</sub>(1330 sm⁻¹)</li>
                <li>• <strong>Gomoyadro bog'lar</strong> — N₂, O₂, H₂, M–M</li>
                <li>• Aromatik halqa "nafas olishi" (benzol, Cp)</li>
                <li>• S–S, C–C, C=C bog'lari</li>
              </ul>
            </div>
            <div className="bg-rose-900/20 border border-rose-600/40 rounded-xl p-5">
              <h3 className="text-rose-400 font-bold mb-2">❌ Raman-nofaol tebranishlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• Markazi-simmetrik molekulalarda dipol o'zgarmaydigan asimmetrik teb.</li>
                <li>• Toza aylanma o'tishlar (ba'zi gazlarda)</li>
                <li>• Fluoressensiya bilan bosilib qolgan tebranishlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============ 6. MUTUAL EXCLUSION ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">6️⃣ O'zaro istisno prinsipi (Mutual Exclusion)</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            <strong className="text-sky-400">Markaziy simmetriyaga ega molekulalar</strong> uchun
            (masalan, oktaedrik <em>O<sub>h</sub></em>, kvadrat-planar <em>D<sub>4h</sub></em>, tekis kvadrat
            <em>D<sub>∞h</sub></em>) mavjud bo'lgan
            <strong className="text-sky-400"> "mutual exclusion" qoidasi</strong>ga ko'ra:
          </p>

          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border-2 border-yellow-500/40 rounded-xl p-5 my-4">
            <p className="text-yellow-200 text-lg text-center leading-relaxed">
              <strong>IQ da faol tebranish</strong> — Raman da <strong>faol emas</strong>.
              <br />
              <strong>Raman da faol tebranish</strong> — IQ da <strong>faol emas</strong>.
            </p>
          </div>

          <p className="text-purple-200 mb-4">
            Bu qoida <em>markaziy simmetriyaga ega bo'lmagan</em> molekulalarga tegishli emas —
            ular ko'p hollarda ham IQ, ham Raman-faol tebranishlarga ega bo'ladi.
            Amaliyotda bu qoida <strong className="text-sky-400">geometrik izomerlarni farqlash</strong>da
            juda foydali:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
              <h3 className="text-sky-400 font-bold mb-2">🟦 <em>trans</em>-[PtCl₂(NH₃)₂]</h3>
              <p className="text-purple-200 text-sm">
                <em>D<sub>2h</sub></em> simmetriya — markaz-simmetrik.
                <br />ν<sub>as</sub>(Pt–Cl) faqat IQ da (~320 sm⁻¹),
                <br />ν<sub>s</sub>(Pt–Cl) faqat Raman da (~330 sm⁻¹).
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-600/40 rounded-xl p-5">
              <h3 className="text-purple-400 font-bold mb-2">🟪 <em>cis</em>-[PtCl₂(NH₃)₂]</h3>
              <p className="text-purple-200 text-sm">
                <em>C<sub>2v</sub></em> simmetriya — markaz-simmetrik <em>emas</em>.
                <br />Ikkala ν(Pt–Cl) tebranishi <strong>ham IQ, ham Raman</strong> da faol.
                <br />Bu izomerni ajratish uchun asosiy usul!
              </p>
            </div>
          </div>
        </div>

        {/* ============ 7. RAMAN TURLARI ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">7️⃣ Raman spektroskopiyasining zamonaviy turlari</h2>
          <div className="space-y-4">
            {[
              {
                nom: "Klassik (spontan) Raman",
                qisqa: "Oddiy lazer — noelastik sochilish",
                tavsif: "Eng keng tarqalgan usul. 532, 633, 785 yoki 1064 nm lazerlar. Fluoressensiya bo'lmagan namunalar uchun.",
                rang: "sky"
              },
              {
                nom: "Rezonans Raman (RR)",
                qisqa: "Lazer chastotasi elektron o'tishga to'g'ri kelganda",
                tavsif: "Intensivlik 10³–10⁵ marta ortadi. Faqat xromofor yaqinidagi tebranishlar kuchayadi — [Ru(bpy)₃]²⁺, gem-porfirinlar, [Fe(CN)₆]³⁻ uchun ideal.",
                rang: "purple"
              },
              {
                nom: "SERS — Surface Enhanced Raman",
                qisqa: "Au/Ag nanozarrachalar sirtida — 10⁶–10¹⁴ marta kuchayish",
                tavsif: "Plazmonik kuchayish. Bitta molekulani ham qayd etish mumkin! Bioimaging, sensor, forensika.",
                rang: "yellow"
              },
              {
                nom: "TERS — Tip Enhanced Raman",
                qisqa: "AFM/STM ignasi + plazmon — nanometrik ruxsat",
                tavsif: "Fazoviy ruxsati ~10 nm. Yakka molekula, sirt tuzilishini o'rganish.",
                rang: "emerald"
              },
              {
                nom: "SRS — Stimulated Raman Scattering",
                qisqa: "Ikki lazer — stimulyatsiyalangan sochilish",
                tavsif: "Klassik Raman dan 10⁴–10⁷ marta sezgir. Tirik hujayralarda kimyoviy tasvirlash (label-free imaging).",
                rang: "rose"
              },
              {
                nom: "CARS — Coherent Anti-Stokes Raman",
                qisqa: "Nochiziqli optika — kogerent anti-Stokes",
                tavsif: "Uch to'lqinli aralashtirish. Yuqori vaqtli ruxsat (fs). Biomedical imaging, yuqori haroratli gazlar tashxisi.",
                rang: "blue"
              },
            ].map((r, i) => (
              <div key={i} className={`bg-${r.rang}-900/20 border border-${r.rang}-500/40 rounded-xl p-5`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className={`text-${r.rang}-300 font-bold text-lg`}>{r.nom}</h3>
                  <span className={`text-${r.rang}-400 text-xs bg-${r.rang}-900/40 px-2 py-1 rounded whitespace-nowrap`}>{r.qisqa}</span>
                </div>
                <p className="text-purple-200 text-sm leading-relaxed">{r.tavsif}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ============ 8. INSTRUMENTATSIYA ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">8️⃣ Raman spektrometrining tuzilishi</h2>
          <p className="text-purple-200 mb-4">
            Zamonaviy dispersion Raman spektrometri quyidagi asosiy qismlardan iborat:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                nom: "1. Lazer manbai",
                tavsif: "Monoxromatik, kogerent. Ko'p ishlatiladi: 785 nm (fluoressensiya kam), 532 nm (yuqori sezgirlik), 1064 nm (FT-Raman, biologik namuna), 244/325 nm (UV rezonans)."
              },
              {
                nom: "2. Namunali kamera",
                tavsif: "180° yoki 90° geometriyada — mikroskop ostida (Raman mikroskopiyasi), suyuqlik kyuvetasi yoki qattiq holat holderi."
              },
              {
                nom: "3. Reley filtri",
                tavsif: "Notch yoki edge filtr — kuchli Reley chizig'ini bostirish. Zamonaviy volume Bragg gratings 5 sm⁻¹ gacha yaqinlashish imkonini beradi."
              },
              {
                nom: "4. Monoxromator",
                tavsif: "Difraksion panjara (600/1200/1800/2400 chiziq/mm). Yuqori chiziqlar zichligi — yaxshi ruxsat, ammo tor spektral oraliq."
              },
              {
                nom: "5. Detektor",
                tavsif: "CCD kamerasi (silikon, Peltier sovutilgan −70°C gacha) yoki InGaAs (NIR uchun). Kvant samaradorligi 90% ga yaqin."
              },
              {
                nom: "6. Kalibrovka",
                tavsif: "Neon lampa (chastota), silikon 520.7 sm⁻¹ chiziq (standart), sikloheksan yoki paratsetamol (ASTM standartlari)."
              }
            ].map((k, i) => (
              <div key={i} className="bg-purple-800/30 border border-purple-600/40 rounded-xl p-4">
                <h3 className="text-sky-400 font-bold mb-2">{k.nom}</h3>
                <p className="text-purple-200 text-xs leading-relaxed">{k.tavsif}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
            <h3 className="text-sky-400 font-bold mb-2">💡 Lazer to'lqin uzunligini tanlash</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Raman intensivligi <strong>ν⁴</strong> ga proportsional — qisqa to'lqin uzunlik yuqori signal beradi.
              Ammo qisqa to'lqinlarda <strong className="text-yellow-400">fluoressensiya</strong> ham kuchayadi va
              foydali Raman signalini bekitib qo'yishi mumkin. Amalda: rangli/organik namunalar uchun 785 yoki
              1064 nm, oq/anorganik namunalar uchun 532 nm optimal.
            </p>
          </div>
        </div>

        {/* ============ 9. CHASTOTALAR JADVALI ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">9️⃣ Kompleks birikmalar uchun kengaytirilgan Raman chastotalari jadvali</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-800/40">
                  <th className="py-3 px-3 text-purple-300">Tebranish</th>
                  <th className="py-3 px-3 text-purple-300">Diapazon (sm⁻¹)</th>
                  <th className="py-3 px-3 text-purple-300">Xarakterli misol</th>
                  <th className="py-3 px-3 text-purple-300">Raman int.</th>
                  <th className="py-3 px-3 text-purple-300">IQ int.</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["ν(M−O)", "200−600", "[Cu(H₂O)₆]²⁺: 440 sm⁻¹", "O'rt.", "O'rt."],
                  ["ν(M−N) amin", "300−600", "[Co(NH₃)₆]³⁺: 500 sm⁻¹", "O'rt.", "O'rt."],
                  ["ν(M−N) piridin", "200−300", "[Fe(py)₄Cl₂]: 240 sm⁻¹", "O'rt.", "Kuchsiz"],
                  ["ν(M−C) siyanid", "350−500", "[Fe(CN)₆]⁴⁻: 390 sm⁻¹", "Kuchli", "Kuchsiz"],
                  ["ν(M−Cl) term.", "250−400", "[CoCl₄]²⁻: 300 sm⁻¹", "Juda kuchli", "Kuchli"],
                  ["ν(M−Br) term.", "150−280", "[CoBr₄]²⁻: 190 sm⁻¹", "Juda kuchli", "Kuchli"],
                  ["ν(M−I) term.", "100−200", "[HgI₄]²⁻: 145 sm⁻¹", "Juda kuchli", "Kuchli"],
                  ["ν(C≡N)", "2000−2200", "K₃[Fe(CN)₆]: 2130 sm⁻¹", "Kuchli", "O'rt."],
                  ["ν(C≡O) karbonil", "1800−2100", "[Fe(CO)₅]: 2014 sm⁻¹", "Juda kuchli", "Juda kuchli"],
                  ["ν(N=O) nitrozil", "1500−1900", "[Fe(NO)(CN)₅]²⁻: 1935", "Kuchli", "Kuchli"],
                  ["ν(M=O) oksi", "800−1000", "MnO₄⁻: 846 sm⁻¹", "Juda kuchli", "Kuchli"],
                  ["ν(M−M)", "100−300", "[Re₂Cl₈]²⁻: 275 sm⁻¹", "Juda kuchli", "Faol emas"],
                  ["ν(M=M) quadruple", "250−350", "Mo₂(O₂CR)₄: 400 sm⁻¹", "Juda kuchli", "Faol emas"],
                  ["ν(C=C) alken", "1500−1700", "Zeise tuzi: 1516 sm⁻¹", "Kuchli", "O'rt."],
                  ["ν(C−C) Cp halqa", "1100−1450", "Ferrosen: 1105 sm⁻¹", "Kuchli", "Faol emas"],
                  ["ν(S−S)", "400−550", "Cistin komplekslari: 500", "Kuchli", "Faol emas"],
                  ["δ(O−M−O)", "200−400", "Xelatlarda", "O'rt.", "O'rt."],
                  ["Halqa nafasi", "1000", "Benzol: 992 sm⁻¹", "Juda kuchli", "Faol emas"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20 transition-colors">
                    <td className="py-2 px-3 font-bold text-sky-400 whitespace-nowrap">{r[0]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400 whitespace-nowrap">{r[1]}</td>
                    <td className="py-2 px-3 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 text-xs text-purple-300">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-300 text-xs mt-4 italic">
            📘 Manba: Nakamoto K. <em>"Infrared and Raman Spectra of Inorganic and Coordination Compounds"</em>, 6th ed., Wiley, 2009.
          </p>
        </div>

        {/* ============ 10. SIMMETRIYA TAHLILI ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔟 Guruhli-nazariy simmetriya tahlili</h2>
          <p className="text-purple-200 leading-relaxed mb-4">
            Kompleksning Raman spektrini oldindan bashorat qilish uchun
            <strong className="text-sky-400"> guruhli nazariya</strong> (group theory) qo'llaniladi.
            Molekulaning nuqtaviy simmetriya guruhi aniqlangach, tebranish tasvirlari mos xarakter jadvalidan
            reduksiya qilinadi va har bir tasvirning Raman/IQ faolligi belgilanadi.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b-2 border-purple-700 bg-purple-800/40">
                  <th className="py-3 px-3 text-purple-300">Geometriya</th>
                  <th className="py-3 px-3 text-purple-300">Nuqtaviy guruh</th>
                  <th className="py-3 px-3 text-purple-300">ML₆ tebranishlari</th>
                  <th className="py-3 px-3 text-purple-300">Raman faol</th>
                  <th className="py-3 px-3 text-purple-300">IQ faol</th>
                </tr>
              </thead>
              <tbody className="text-purple-200">
                {[
                  ["Oktaedrik ML₆", "O_h", "A₁g + E_g + 2T₁u + T₂g + T₂u", "A₁g, E_g, T₂g", "T₁u"],
                  ["Kvadrat-planar ML₄", "D_4h", "A₁g + B₁g + E_u + ...", "A₁g, B₁g, B₂g", "E_u, A₂u"],
                  ["Tetraedrik ML₄", "T_d", "A₁ + E + 2T₂", "Barchasi (A₁,E,T₂)", "T₂ (faqat)"],
                  ["Trigonal-piramidal", "C_3v", "2A₁ + 2E", "Barchasi", "Barchasi"],
                  ["Chiziqli ML₂", "D_∞h", "Σ_g⁺ + Σ_u⁺ + Π_u", "Σ_g⁺ (faqat)", "Σ_u⁺, Π_u"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-semibold text-sky-400">{r[0]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400">{r[1]}</td>
                    <td className="py-2 px-3 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 text-emerald-300 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 text-rose-300 text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-sky-600/10 border border-sky-500/30 rounded-xl p-5">
            <h3 className="text-sky-400 font-bold mb-2">📝 Amaliy misol: [Co(NH₃)₆]³⁺ (O_h)</h3>
            <p className="text-purple-200 text-sm leading-relaxed">
              Oktaedrik ML₆ tipidagi kompleks 6 ta Co–N cho'zilish tebranishiga ega. Bu tebranishlar
              <strong className="text-sky-400"> A₁g + E_g + T₁u</strong> tasvirlariga bo'linadi:
              <br />• <strong>A₁g</strong> (500 sm⁻¹) — <em>simmetrik "nafas olish"</em>, faqat Raman-faol;
              <br />• <strong>E_g</strong> (475 sm⁻¹) — Raman-faol;
              <br />• <strong>T₁u</strong> (449 sm⁻¹) — faqat IQ-faol.
              <br />Raman va IQ spektrlarni birgalikda ko'rish ML₆ ning oktaedrik ekanligini tasdiqlaydi.
            </p>
          </div>
        </div>

        {/* ============ 11. CHEKLOVLAR ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">1️⃣1️⃣ Cheklovlar va xatolik manbalari</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-rose-900/20 border border-rose-500/40 rounded-xl p-5">
              <h3 className="text-rose-300 font-bold mb-2">⚠️ Fluoressensiya</h3>
              <p className="text-purple-200 text-sm">
                Ko'p rangli komplekslarda (masalan, Cu²⁺, Fe³⁺, lantanoidlar) fluoressensiya Raman signalini
                yuz-ming marta kuchaytirib bekitib qo'yadi. Yechim: 785 yoki 1064 nm NIR lazer, FT-Raman,
                yoki vaqt-ajratilgan Raman.
              </p>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/40 rounded-xl p-5">
              <h3 className="text-yellow-300 font-bold mb-2">🔥 Namunaning qizishi/parchalanishi</h3>
              <p className="text-purple-200 text-sm">
                Yuqori lazer quvvati (&gt;50 mW) da rangli namuna qizib parchalanishi mumkin. Yechim:
                pasaytirilgan quvvat, aylanuvchi kyuveta, past haroratli kriostat.
              </p>
            </div>
            <div className="bg-blue-900/20 border border-blue-500/40 rounded-xl p-5">
              <h3 className="text-blue-300 font-bold mb-2">💧 Suvli eritmalar</h3>
              <p className="text-purple-200 text-sm">
                Suv Raman da kuchsiz sochsa-da, kation-anion o'zaro ta'siri, ion juftlashuvi chastotani
                siljitishi mumkin. Kontsentratsiya bog'liqligini tekshirish shart.
              </p>
            </div>
            <div className="bg-purple-800/30 border border-purple-500/40 rounded-xl p-5">
              <h3 className="text-purple-300 font-bold mb-2">📉 Past sezgirlik</h3>
              <p className="text-purple-200 text-sm">
                Klassik Raman ~10⁻²−10⁻¹ M darajada ishlaydi. Past kontsentratsiyalar uchun rezonans Raman
                yoki SERS zarur. IQ dan ~10⁴ marta zaifroq signal.
              </p>
            </div>
          </div>
        </div>

        {/* ============ 12. XULOSALAR ============ */}
        <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">✅ 1️⃣2️⃣ Amaliy xulosalar</h2>
          <ol className="space-y-3 text-purple-200 list-decimal list-inside leading-relaxed">
            <li>Raman — <strong className="text-sky-400">yorug'likning noelastik sochilishi</strong>ga asoslangan
              tebranish spektroskopiya usuli; IQ ni bir-birini to'ldiruvchi juftlik hisoblanadi.</li>
            <li>Tanlash qoidasi: tebranish davomida <strong className="text-sky-400">qutblanuvchanlik (α)</strong>
              o'zgarishi shart, IQ da esa dipol moment o'zgarishi.</li>
            <li>Markaz-simmetrik molekulalarda <strong className="text-sky-400">o'zaro istisno qoidasi</strong>
              amal qiladi: IQ-faol ↔ Raman-faol emas.</li>
            <li>Simmetrik cho'zilishlar, <strong className="text-sky-400">gomoyadro bog'lar</strong> (M–M, C–C,
              S–S) faqat Raman da qayd etiladi.</li>
            <li>Metall-ligand tebranishlari <strong className="text-sky-400">50–600 sm⁻¹</strong> oralig'ida
              yotadi va koordinatsion kimyoning <em>"barmoq izlari"</em> hisoblanadi.</li>
            <li>Suvli eritmalarda IQ dan afzal — <strong className="text-sky-400">suv kuchsiz Raman
              sochuvchi</strong>; biologik va elektrokimyoviy tizimlar uchun ideal.</li>
            <li><strong className="text-sky-400">Rezonans Raman</strong> — xromofor komplekslarda intensivlikni
              10³–10⁵ marta oshirib, past kontsentratsiyalarda ishlash imkonini beradi.</li>
            <li><strong className="text-sky-400">SERS/TERS</strong> — nanoplazmonik kuchayish orqali yakka
              molekula darajasidagi sezgirlikni ta'minlaydi.</li>
            <li>Zamonaviy Raman mikroskopiyasi <strong className="text-sky-400">1 μm ruxsat</strong> bilan qattiq,
              suyuq va gaz namunalarda ishlaydi.</li>
            <li>Kompleks birikmalar geometriyasi <strong className="text-sky-400">Raman + IQ</strong> ni
              birgalikda taqqoslash orqali aniq belgilanadi.</li>
          </ol>
        </div>

        {/* ============ ADABIYOTLAR ============ */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">📚 Foydalanilgan adabiyotlar</h2>
          <ul className="text-purple-200 text-sm space-y-2 leading-relaxed">
            <li>1. Nakamoto K. <em>Infrared and Raman Spectra of Inorganic and Coordination Compounds</em>. 6th ed., Wiley, 2009.</li>
            <li>2. Ferraro J.R., Nakamoto K., Brown C.W. <em>Introductory Raman Spectroscopy</em>. 2nd ed., Academic Press, 2003.</li>
            <li>3. Smith E., Dent G. <em>Modern Raman Spectroscopy: A Practical Approach</em>. Wiley, 2019.</li>
            <li>4. Long D.A. <em>The Raman Effect: A Unified Treatment of the Theory of Raman Scattering by Molecules</em>. Wiley, 2002.</li>
            <li>5. Raman C.V., Krishnan K.S. <em>A New Type of Secondary Radiation</em>. Nature <strong>121</strong>, 501–502 (1928).</li>
            <li>6. Housecroft C.E., Sharpe A.G. <em>Inorganic Chemistry</em>. 5th ed., Pearson, 2018 — 4-bob.</li>
          </ul>
        </div>

        {/* ============ NAVIGATSIYA ============ */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6">
          <Link href="/ilmiy/tahlil/iq" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 text-center transition-all">← IQ spektroskopiya</Link>
          <Link href="/ilmiy/tahlil/raman/birikmalar" className="px-6 py-3 bg-gradient-to-r from-sky-700 to-sky-600 rounded-xl hover:from-sky-600 hover:to-sky-500 text-white font-semibold text-center transition-all">🧪 Birikmalar tahlili →</Link>
          <Link href="/ilmiy/tahlil/nmr" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-semibold text-center transition-all">YaMR spektroskopiya →</Link>
        </div>

      </section>
    </main>
  )
}
