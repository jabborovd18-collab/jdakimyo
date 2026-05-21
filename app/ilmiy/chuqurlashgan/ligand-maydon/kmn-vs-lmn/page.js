import Link from "next/link"

export default function KMNvsLMN() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="text-purple-400 hover:text-purple-300 text-lg">← Ligand maydon</Link>
        <div>
          <h1 className="text-2xl font-bold text-orange-400">🎯 KMN vs LMN — taqqoslash</h1>
          <p className="text-purple-400 text-sm">Ikkala nazariyani har tomonlama solishtirish • Afzalliklar va kamchiliklar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Nima uchun taqqoslash kerak?</h2>
          
          <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kristall maydon nazariyasi (KMN)</strong> va <strong className="text-yellow-400">Ligand maydon nazariyasi (LMN)</strong> — 
              kompleks birikmalar kimyosining <strong>ikkita asosiy nazariyasi</strong>. Ular bir-biriga raqib emas, 
              balki <strong>bir-birini to'ldiruvchi</strong> yondashuvlardir. KMN soddaligi bilan, LMN esa aniqligi bilan qadrlanadi.
              Quyida ularning batafsil taqqoslanishi keltirilgan.
            </p>
          </div>
        </div>

        {/* 2. ASOSIY FARQLAR JADVALI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 14 ta asosiy farq</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300 w-1/4">Xususiyat</th>
                <th className="py-3 px-4 text-purple-300 text-yellow-400 w-1/3">KMN</th>
                <th className="py-3 px-4 text-purple-300 text-green-400 w-1/3">LMN</th>
              </tr></thead>
              <tbody className="text-purple-200">
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Asosiy g'oya</td>
                  <td className="py-4 px-4 text-sm">Ligandlar nuqtaviy manfiy zaryad. Sof elektrostatik model.</td>
                  <td className="py-4 px-4 text-sm">Ligandlar orbitallarga ega. Metall va ligand orbitallari qoplashadi — kovalent bog' hosil bo'ladi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Hisobga oladigan orbitallar</td>
                  <td className="py-4 px-4 text-sm">Faqat metallning 5 ta d-orbitallari. s, p orbitallar umuman qaralmaydi.</td>
                  <td className="py-4 px-4 text-sm">Metallning barcha valent orbitallari (s, p, d) va ligandlarning orbitallari.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Parametrlar soni</td>
                  <td className="py-4 px-4 text-sm">Asosan 1 ta parametr — Δo (empirik, tajribada o'lchanadi).</td>
                  <td className="py-4 px-4 text-sm">Ko'p parametrli — qoplashish integrallari, energiya farqlari. Nazariy hisoblanadi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">π-bog'lanish</td>
                  <td className="py-4 px-4 text-sm text-red-400">Tushuntirmaydi. Umuman yo'q deb hisoblaydi.</td>
                  <td className="py-4 px-4 text-sm text-green-400">To'liq tushuntiradi: π-donor, π-akseptor, sinergik bog'lanish mexanizmi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Spektrokimyoviy qator</td>
                  <td className="py-4 px-4 text-sm">Empirik fakt. Sababini tushuntirmaydi — "shundayligicha qabul qilamiz".</td>
                  <td className="py-4 px-4 text-sm">π-xossalar orqali to'liq izohlaydi: nima uchun CO kuchli, Cl⁻ kuchsiz.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Zaryad ko'chishi (CT)</td>
                  <td className="py-4 px-4 text-sm text-red-400">Tushuntirmaydi.</td>
                  <td className="py-4 px-4 text-sm text-green-400">MLCT va LMCT — to'liq tushuntiradi. Intensiv ranglar sababi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Spektrlar</td>
                  <td className="py-4 px-4 text-sm">Rang mavjudligini tushuntiradi, lekin intensivlikni emas.</td>
                  <td className="py-4 px-4 text-sm">Tanlash qoidalari, ε qiymati, o'tish ehtimoli — hammasini hisoblaydi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Magnit momenti</td>
                  <td className="py-4 px-4 text-sm">Spin-only formula: μeff = √n(n+2). Yetarli, lekin taqribiy.</td>
                  <td className="py-4 px-4 text-sm">Spin-orbit hissasini qo'shadi. Tajribaga yaqinroq natija.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Barqarorlik</td>
                  <td className="py-4 px-4 text-sm">KMBE orqali sifat jihatdan baholaydi.</td>
                  <td className="py-4 px-4 text-sm">Bog' energiyasi orqali miqdoriy hisoblaydi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Geometriya</td>
                  <td className="py-4 px-4 text-sm">Bilvosita — gibridlanish orqali.</td>
                  <td className="py-4 px-4 text-sm">Bevosita — orbitallarning fazoviy yo'nalishidan.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Murakkabligi</td>
                  <td className="py-4 px-4 text-sm text-green-400">Oddiy — qo'lda hisoblash mumkin.</td>
                  <td className="py-4 px-4 text-sm text-red-400">Murakkab — kompyuter hisoblashlari talab qilinadi.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">O'qitish uchun</td>
                  <td className="py-4 px-4 text-sm text-green-400">Juda qulay — talabalar tez tushunadi. Ko'rgazmali.</td>
                  <td className="py-4 px-4 text-sm text-red-400">Qiyinroq — MO nazariyasi va simmetriyani bilish kerak.</td>
                </tr>
                <tr className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Hisoblash usuli</td>
                  <td className="py-4 px-4 text-sm">Qog'oz va qalam. Qo'lda hisoblash.</td>
                  <td className="py-4 px-4 text-sm">Kompyuter dasturlari (DFT, TD-DFT, ADF, ORCA).</td>
                </tr>
                <tr className="hover:bg-purple-800/20">
                  <td className="py-4 px-4 font-bold">Ilmiy maqolalar</td>
                  <td className="py-4 px-4 text-sm">O'quv qo'llanmalarida. Ilmiy maqolalarda kam.</td>
                  <td className="py-4 px-4 text-sm">Zamonaviy ilmiy maqolalarda asosiy nazariya.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. QACHON QAYSI NAZARIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🎯 Qachon qaysi nazariyani qo'llash kerak?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-xl mb-4">✅ KMN yetarli</h3>
              <div className="space-y-3">
                {[
                  "Geometriyani bashorat qilish (oktaedr, tetraedr, tekis kvadrat)",
                  "Spin holatini aniqlash (yuqori/quyi spin)",
                  "Magnit momentini hisoblash (μeff = √n(n+2))",
                  "KMBE hisoblash va barqarorlikni baholash",
                  "Rangni sifat jihatdan tushuntirish (d-d o'tishlar)",
                  "Oddiy ligandlar bilan ishlash (F⁻, Cl⁻, H₂O, NH₃)",
                  "Talabalarga o'rgatish — tushunish oson"
                ].map((t, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <p className="text-purple-200 text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-xl mb-4">🔬 LMN talab qilinadi</h3>
              <div className="space-y-3">
                {[
                  "π-bog'lanish mavjud bo'lganda (CO, CN⁻, PR₃, NO₂⁻)",
                  "Spektroskopik tahlil (UB-Vis intensivligi, IQ chastotalari)",
                  "Zaryad ko'chishi (MLCT, LMCT) bo'lganda",
                  "Δo ni aniq nazariy hisoblash kerak bo'lganda",
                  "Spektrokimyoviy qator sababini tushuntirish uchun",
                  "Ilmiy tadqiqot va jurnal maqolalari uchun",
                  "Kompyuter modellashtirish (DFT, TD-DFT)"
                ].map((t, i) => (
                  <div key={i} className="bg-purple-900/50 rounded-lg p-3">
                    <p className="text-purple-200 text-sm">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misol: [Fe(CN)₆]⁴⁻ — ikki nazariya tahlili</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h3 className="text-yellow-400 font-bold text-lg mb-4">KMN bo'yicha</h3>
              <div className="space-y-2 text-sm">
                <p className="text-purple-200">• Fe²⁺ — <strong>d⁶</strong> konfiguratsiya</p>
                <p className="text-purple-200">• CN⁻ — <strong>kuchli maydonli</strong> ligand</p>
                <p className="text-purple-200">• Δo ≈ 394 kJ/mol — juda katta</p>
                <p className="text-purple-200">• Δo &gt; P → <strong>quyi spin</strong></p>
                <p className="text-purple-200">• t₂g⁶ eg⁰ — barcha elektronlar juftlashgan</p>
                <p className="text-purple-200">• μeff = <strong>0 μB (diamagnit)</strong></p>
                <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-3 mt-3">
                  <p className="text-red-400 text-xs font-bold">❌ KMN javob bermaydi:</p>
                  <p className="text-purple-300 text-xs">Nega CN⁻ kuchli? Nega aynan 394 kJ/mol?</p>
                </div>
              </div>
            </div>

            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-green-400 font-bold text-lg mb-4">LMN bo'yicha</h3>
              <div className="space-y-2 text-sm">
                <p className="text-purple-200">• Fe²⁺ — d⁶, CN⁻ — <strong>σ-donor + π-akseptor</strong></p>
                <p className="text-purple-200">• CN⁻ bo'sh π*-orbitallari metall d-e⁻ larni qabul qiladi</p>
                <p className="text-purple-200">• π-orqaga donorlik → <strong>t₂g energiyasi pasayadi</strong></p>
                <p className="text-purple-200">• Δo = E(eg*) − E(t₂g) — <strong>kattalashadi</strong></p>
                <p className="text-purple-200">• t₂g⁶ — barcha elektronlar juftlashgan</p>
                <p className="text-purple-200">• μeff = <strong>0 μB (diamagnit)</strong></p>
                <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-3 mt-3">
                  <p className="text-green-400 text-xs font-bold">✅ LMN qo'shimcha:</p>
                  <p className="text-purple-300 text-xs">CN⁻ kuchli, chunki π-akseptor! IQ da ν(C≡N) pasayadi (orqaga donorlik). Boshqa ligandlar bilan solishtirish mumkin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. TARIX */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Tarixiy rivojlanish</h2>
          <div className="space-y-3">
            {[
              { yil: "1893", text: "Alfred Verner — koordinatsion birikmalar nazariyasi" },
              { yil: "1929", text: "Hans Bethe — kristall maydon nazariyasini taklif qildi" },
              { yil: "1932", text: "Van Vleck — KMN ni kompleks birikmalarga tatbiq etdi" },
              { yil: "1955", text: "Griffith va Orgel — ligand maydon nazariyasi (LMN) asoslari" },
              { yil: "1960", text: "LMN to'liq shakllandi — MO nazariyasi bilan birlashtirildi" },
              { yil: "Hozir", text: "DFT, TD-DFT — LMN asosida kompyuter hisoblashlari" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-4 bg-purple-800/30 rounded-xl p-4 border border-purple-700/30">
                <div className="w-16 text-center flex-shrink-0">
                  <span className="text-yellow-400 font-bold">{r.yil}</span>
                </div>
                <p className="text-purple-200 text-sm">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600/10 to-green-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Yakuniy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">KMN</strong> — sodda, tez, o'qitish uchun ideal</li>
            <li><strong className="text-green-400">LMN</strong> — aniq, to'liq, ilmiy tadqiqot uchun zarur</li>
            <li>Ikkala nazariya <strong>bir-birini to'ldiradi</strong>, raqobat qilmaydi</li>
            <li>Amalda: avval <strong>KMN</strong> bilan boshlanadi, kerak bo'lsa <strong>LMN</strong> ga o'tiladi</li>
            <li>Zamonaviy hisoblash kimyosi <strong>LMN asosida</strong> ishlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon/mo-diagramma" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← MO diagrammasi</Link>
          <Link href="/ilmiy/chuqurlashgan/ligand-maydon" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Ligand maydon →</Link>
        </div>

      </section>
    </main>
  )
}