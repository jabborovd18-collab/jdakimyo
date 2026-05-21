import Link from "next/link"

export default function KvadratPlanar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      {/* ── HEADER ── */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/kinetika" className="text-purple-400 hover:text-purple-300 transition-all text-lg">
          ← Kinetika
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">⬛ Kvadrat-planar komplekslarda almashinish</h1>
          <p className="text-purple-400 text-sm">Trans-ta&apos;sir qatori • Pt²⁺ komplekslari • Sintezda selektivlik • sis/trans izomerlarni olish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* ── 1. KIRISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Kvadrat-planar komplekslarda ligand almashinish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kvadrat-planar komplekslar</strong> — asosan d⁸ konfiguratsiyali 
              metall ionlari (Pt²⁺, Pd²⁺, Ni²⁺, Au³⁺, Rh⁺, Ir⁺) uchun xos geometriya.
              Oktaedrik komplekslardan farqli ravishda, kvadrat-planar komplekslarda ligand almashinishi 
              <strong className="text-yellow-400"> har doim assotsiativ (A yoki I<sub>a</sub>) mexanizm</strong> 
              bo&apos;yicha boradi. Buning sababi — kvadrat-planar geometriyada 
              <strong> aksial pozitsiyalar bo&apos;sh</strong> — beshinchi ligand oson birikadi.
              Eng muhim xususiyat — <strong className="text-yellow-400">trans-ta&apos;sir</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">Nima uchun A mexanizm?</h3>
              <p className="text-purple-200 text-sm">
                <strong>1. Bo&apos;sh aksial pozitsiyalar:</strong> kvadrat-planar kompleksda metall ionining 
                yuqori va past tomonlari bo&apos;sh — beshinchi ligand uchun joy bor.<br/>
                <strong>2. 16-elektron qobiq:</strong> kvadrat-planar d⁸ komplekslar 16 valent elektronga ega — 
                18-elektron qoidasiga erishish uchun qo&apos;shimcha ligand biriktirishga intiladi.<br/>
                <strong>3. ΔV<sup>‡</sup> &lt; 0:</strong> barcha kvadrat-planar almashinishlarda aktivatsiya hajmi manfiy.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">A mexanizm sxemasi</h3>
              <p className="text-purple-200 text-sm">
                <strong>1-bosqich (sekin):</strong> [ML₄] + Y → [ML₄Y] — oraliq trigonal-bipiramida (KS=5)<br/>
                <strong>2-bosqich (tez):</strong> [ML₄Y] → [ML₃Y] + L — ligand chiqishi<br/>
                <strong>Tezlik qonuni:</strong> v = k[ML₄][Y] (ikkala reagentga nisbatan birinchi tartibli)<br/>
                <strong>Oraliq:</strong> 18-elektron, trigonal-bipiramida yoki kvadrat-piramida
              </p>
            </div>
          </div>
        </div>

        {/* ── 2. TRANS-TA'SIR — ASOSIY TUSHUNCHA ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Trans-ta&apos;sir — kvadrat-planar komplekslarning noyob xususiyati</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Trans-ta&apos;sir</strong> — kvadrat-planar kompleksda 
              bir ligandning <strong>o&apos;ziga trans holatda joylashgan ligandning almashinish tezligini 
              oshirish yoki kamaytirish qobiliyati</strong>. Bu — <strong>kinetik hodisa</strong> 
              (asosiy holat barqarorligiga ta&apos;sir qilmaydi, faqat aktivatsiya energiyasini o&apos;zgartiradi).
              1926 yilda I.I. Chernyayev tomonidan kashf etilgan.
            </p>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-yellow-400 font-bold text-xl">
              Trans-ta&apos;sir qatori (kuchli → kuchsiz):
            </p>
            <p className="text-purple-200 text-sm mt-2">
              <strong>CO, CN⁻, C₂H₄ &gt; PR₃, H⁻ &gt; CH₃⁻ &gt; SC(NH₂)₂ &gt; NO₂⁻ &gt; I⁻ &gt; SCN⁻ &gt; Br⁻ &gt; Cl⁻ &gt; NH₃, piridin &gt; OH⁻ &gt; H₂O</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-400 font-bold mb-2">Kuchli trans-ta&apos;sir</h3>
              <p className="text-purple-200 text-sm">
                <strong>CO, CN⁻, C₂H₄, PR₃</strong><br/>
                Kuchli π-akseptor ligandlar<br/>
                Metallning elektron zichligini tortadi → trans bog&apos; zaiflashadi<br/>
                Almashinish 10³−10⁶ marta tezlashadi
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">O&apos;rtacha trans-ta&apos;sir</h3>
              <p className="text-purple-200 text-sm">
                <strong>I⁻, SCN⁻, NO₂⁻</strong><br/>
                Yumshoq donorlar, yuqori qutblanuvchanlik<br/>
                σ-donor + kuchsiz π-akseptor<br/>
                Almashinish 10¹−10³ marta tezlashadi
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Kuchsiz trans-ta&apos;sir</h3>
              <p className="text-purple-200 text-sm">
                <strong>NH₃, H₂O, OH⁻, Cl⁻</strong><br/>
                Qattiq donorlar, past qutblanuvchanlik<br/>
                Sof σ-donor ligandlar<br/>
                Almashinish tezlashmaydi (etalon)
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. TRANS-TA'SIR MEXANIZMI ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Trans-ta&apos;sir mexanizmi — σ-donor va π-akseptor nazariyalar</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Trans-ta&apos;sir <strong className="text-yellow-400">ikki asosiy mexanizm</strong> bilan tushuntiriladi.
              Kuchli σ-donor ligandlar asosiy holatda trans bog&apos;ni zaiflashtiradi (termodinamik omil).
              Kuchli π-akseptor ligandlar o&apos;tish holatini barqarorlashtiradi (kinetik omil).
              Ko&apos;pchilik kuchli trans-ta&apos;sirli ligandlar <strong>har ikkala mexanizm</strong> orqali ta&apos;sir qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">σ-Donor mexanizm (Grinberg, 1935)</h3>
              <p className="text-purple-200 text-sm">
                Kuchli σ-donor ligand T o&apos;zining elektron zichligini metallga beradi. 
                Metall markazidagi yuqori elektron zichlik <strong>trans bog&apos;ni zaiflashtiradi</strong> 
                (trans-ta&apos;sir — asosiy holat effekti). Trans ligandning chiqish energiyasi kamayadi.<br/>
                <strong>Misol:</strong> H⁻ (kuchli σ-donor) — trans ligandni zaiflashtiradi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-yellow-400 font-bold mb-2">π-Akseptor mexanizm (Chatt, Orgel, 1950)</h3>
              <p className="text-purple-200 text-sm">
                Kuchli π-akseptor ligand T metallning d-elektronlarini tortadi. 
                O&apos;tish holatida (trigonal-bipiramida) T ligand ekvatorial pozitsiyada — 
                π-akseptorlik qobiliyati <strong>o&apos;tish holatini barqarorlashtiradi</strong>, 
                aktivatsiya energiyasini pasaytiradi.<br/>
                <strong>Misol:</strong> CO, C₂H₄ (kuchli π-akseptorlar) — eng kuchli trans-ta&apos;sir.
              </p>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-blue-400 font-bold mb-2">Zamonaviy tushuncha: σ-donor + π-akseptor sinergizmi</h3>
            <p className="text-purple-200 text-sm">
              Eng kuchli trans-ta&apos;sirga ega ligandlar (CO, CN⁻) <strong>ham kuchli σ-donor, ham kuchli 
              π-akseptor</strong>. σ-donorlik asosiy holatda trans bog&apos;ni zaiflashtiradi, 
              π-akseptorlik esa o&apos;tish holatini barqarorlashtiradi. Bu ikki effekt birgalikda 
              trans-ta&apos;sirning maksimal kuchayishiga olib keladi.
            </p>
          </div>
        </div>

        {/* ── 4. SINTEZDA QO'LLANISH ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Trans-ta&apos;sir yordamida sis/trans izomerlarni sintez qilish</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              Trans-ta&apos;sir <strong className="text-yellow-400">sis va trans izomerlarni selektiv sintez qilish</strong> 
              imkonini beradi. Pt²⁺ komplekslari uchun bu — 
              <strong>klassik usul</strong>. Sintez yo&apos;nalishi <strong>boshlang&apos;ich kompleksdagi 
              ligandlarning trans-ta&apos;sir kuchiga</strong> bog&apos;liq.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                sintez: "sis-[Pt(NH₃)₂Cl₂] (sisplatin) sintezi",
                sxema: "[PtCl₄]²⁻ + 2NH₃ → sis-[Pt(NH₃)₂Cl₂] + 2Cl⁻",
                izoh: "Cl⁻ — kuchsiz trans-ta&apos;sir. Birinchi NH₃ birikkandan keyin, unga trans Cl⁻ sekin almashadi. Ikkinchi NH₃ birinchi NH₃ ga sis holatda (trans-Cl &gt; trans-NH₃ tezligi tufayli). Natija: <strong>sis izomer</strong>.",
              },
              {
                sintez: "trans-[Pt(NH₃)₂Cl₂] sintezi",
                sxema: "[Pt(NH₃)₄]²⁺ + 2Cl⁻ → trans-[Pt(NH₃)₂Cl₂] + 2NH₃",
                izoh: "NH₃ — kuchsiz trans-ta&apos;sir. Cl⁻ birikkandan keyin, unga trans NH₃ tez almashadi. Ikkinchi Cl⁻ birinchi Cl⁻ ga trans holatda (trans-NH₃ &lt; trans-Cl⁻ tezligi tufayli). Natija: <strong>trans izomer</strong>.",
              },
              {
                sintez: "Kuchsiz trans-ta&apos;sirli liganddan kuchliga o&apos;tish",
                sxema: "[PtCl₄]²⁻ → [PtCl₃(NO₂)]²⁻ → [PtCl₂(NO₂)₂]²⁻",
                izoh: "NO₂⁻ — o&apos;rtacha trans-ta&apos;sir (Cl⁻ dan kuchli). Birinchi NO₂⁻ kiritilgach, unga trans Cl⁻ tez almashadi. Ikkinchi NO₂⁻ birinchi NO₂⁻ ga trans holatda birikadi. <strong>Selektivlik — trans-ta&apos;sir farqi hisobiga.</strong>",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.sintez}</h3>
                <p className="text-purple-200 text-sm"><strong>Sxema:</strong> {r.sxema}</p>
                <p className="text-purple-200 text-sm">{r.izoh}</p>
              </div>
            ))}
          </div>

          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5 mt-4">
            <h3 className="text-green-400 font-bold mb-2">Sisplatin — trans-ta&apos;sir yordamida sintez qilingan eng mashhur dori</h3>
            <p className="text-purple-200 text-sm">
              sis-[Pt(NH₃)₂Cl₂] (sisplatin) — saratonga qarshi eng samarali dorilardan biri. 
              <strong>Faqat sis izomer faol, trans izomer faol emas!</strong> 
              Trans-ta&apos;sir qoidalari yordamida sis izomerni toza holda sintez qilish — 
              bu dorining klinik qo&apos;llanishiga yo&apos;l ochgan. Sintez sxemasi: 
              K₂[PtCl₄] + 2NH₃ → sis-[Pt(NH₃)₂Cl₂] (Cl⁻ kuchsiz trans-ta&apos;siri tufayli).
            </p>
          </div>
        </div>

        {/* ── 5. ALMASHINISH TEZLIGIGA TA'SIR QILUVCHI OMILLAR ── */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔍 Kvadrat-planar almashinish tezligiga ta&apos;sir qiluvchi omillar</h2>
          
          <div className="space-y-4">
            {[
              {
                omil: "1. Metall ioni tabiati",
                izoh: "Almashinish tezligi: <strong>Ni²⁺ (10³−10⁵ M⁻¹s⁻¹) &gt; Pd²⁺ (10⁰−10²) &gt; Pt²⁺ (10⁻²−10⁰)</strong>. 5d metallar (Pt²⁺) 3d metallardan (Ni²⁺) ancha inert. Sababi: 5d orbitallar kengroq — ligandlar bilan kuchliroq bog&apos;, yuqori aktivatsiya energiyasi.",
              },
              {
                omil: "2. Kiruvchi ligandning nukleofilligi",
                izoh: "Kvadrat-planar almashinish A mexanizm bo&apos;yicha boradi — kiruvchi ligandning nukleofilligi muhim. Nukleofillik qatori (Pt²⁺ uchun): PR₃ &gt; SC(NH₂)₂ &gt; I⁻ &gt; SCN⁻ &gt; Br⁻ &gt; Cl⁻ &gt; NH₃ &gt; H₂O. Yumshoq asoslar yaxshiroq nukleofillar.",
              },
              {
                omil: "3. Chiquvchi ligandning tabiati",
                izoh: "Chiquvchi ligandning bog&apos; energiyasi va trans-ta&apos;siri almashinish tezligiga ta&apos;sir qiladi. Kuchli bog&apos;langan ligandlar (CN⁻) sekin chiqadi. Trans-ta&apos;sir tufayli zaiflashgan ligandlar tez chiqadi.",
              },
              {
                omil: "4. Sterik omillar",
                izoh: "Katta hajmli ligandlar (PPh₃) oraliq trigonal-bipiramida hosil bo&apos;lishini qiyinlashtiradi — almashinish sekinlashadi. Kichik ligandlar (NH₃, Cl⁻) — tez almashadi. cis-holatdagi katta ligandlar trans almashinishni bloklashi mumkin.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-yellow-400 font-bold mb-1">{r.omil}</h3>
                <p className="text-purple-200 text-sm" dangerouslySetInnerHTML={{ __html: r.izoh }}></p>
              </div>
            ))}
          </div>
        </div>

        {/* ── XULOSA ── */}
        <div className="bg-gradient-to-r from-purple-600/10 to-green-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-yellow-400">Kvadrat-planar almashinish:</strong> har doim A yoki I<sub>a</sub> mexanizm — aksial pozitsiyalar bo&apos;sh</li>
            <li><strong className="text-yellow-400">Trans-ta&apos;sir qatori:</strong> CO, CN⁻ &gt; PR₃ &gt; I⁻ &gt; Cl⁻ &gt; NH₃ &gt; H₂O</li>
            <li><strong className="text-yellow-400">σ-donor + π-akseptor sinergizmi:</strong> eng kuchli trans-ta&apos;sirli ligandlar har ikkala mexanizm orqali ta&apos;sir qiladi</li>
            <li><strong className="text-yellow-400">Sintez:</strong> trans-ta&apos;sir yordamida sis/trans izomerlarni selektiv olish — sisplatin misoli</li>
            <li><strong className="text-yellow-400">Tezlik:</strong> Ni²⁺ &gt; Pd²⁺ &gt; Pt²⁺ — 3d &gt; 4d &gt; 5d labillik kamayadi</li>
          </ol>
        </div>

        {/* ── NAVIGATSIYA ── */}
        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/kinetika/oktaedrik" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300 transition-all">
            ← Oktaedrik almashinish
          </Link>
          <Link href="/ilmiy/chuqurlashgan/kinetika/elektron-kochish" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold transition-all">
            Elektron ko&apos;chish →
          </Link>
        </div>

      </section>
    </main>
  )
}