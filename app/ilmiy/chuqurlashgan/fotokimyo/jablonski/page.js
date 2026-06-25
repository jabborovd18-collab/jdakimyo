import Link from "next/link"

export default function JablonskiDiagrammasi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="text-purple-400 hover:text-purple-300 text-lg">← Fotokimyo</Link>
        <div>
          <h1 className="text-2xl font-bold text-sky-400">📊 Jablonski diagrammasi</h1>
          <p className="text-purple-400 text-sm">Yutilish • Fluoressensiya • Fosforessensiya • ISC • IC • Kasha qoidasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Jablonski diagrammasi haqida</h2>
          
          <div className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-sky-400">Jablonski diagrammasi</strong> — Aleksandr Jablonski tomonidan 
              1933-yilda taklif qilingan, molekulalarning <strong className="text-sky-400">elektron qo'zg'algan 
              holatlari va ular orasidagi o'tishlarni</strong> tasvirlovchi energetik diagramma.
              Bu diagramma <strong className="text-sky-400">fotofizik jarayonlarning barcha asosiy yo'llarini</strong> 
              ko'rsatadi: yutilish (absorbsiya), fluoressensiya, fosforessensiya, ichki konversiya (IC), 
              interkombinatsion konversiya (ISC) va tebranish relaksatsiyasi.
              Kompleks birikmalarda <strong className="text-sky-400">MLCT va MC (metal-markazlashgan) holatlar</strong> 
              qo'shimcha o'tish yo'llarini ta'minlaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-2">Singlet va triplet holatlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Singlet (S):</strong> Barcha elektron spinlari juftlashgan (↑↓), S=0, 2S+1=1</li>
                <li>• <strong>Triplet (T):</strong> Ikkita toq elektron spinlari parallel (↑↑), S=1, 2S+1=3</li>
                <li>• <strong>S₀:</strong> Asosiy singlet holat — eng past energiyali</li>
                <li>• <strong>S₁, S₂:</strong> Qo'zg'algan singlet holatlar</li>
                <li>• <strong>T₁, T₂:</strong> Qo'zg'algan triplet holatlar (S₁ dan pastroq energiyada)</li>
                <li>• <strong>Energiya:</strong> E(S₁) {'>'} E(T₁) — Hund qoidasi bo'yicha</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-sky-400 font-bold mb-2">O'tish turlari va vaqt shkalalari</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Jarayon</th><th className="text-left py-2 text-sky-400">O'tish</th><th className="text-left py-2 text-yellow-400">Vaqt shkalasi</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Yutilish","S₀ → S₁/S₂","10⁻¹⁵ s (femtosekund)"],["Tebranish relaksatsiyasi (VR)","S₁(v=n) → S₁(v=0)","10⁻¹²−10⁻¹⁰ s"],["Ichki konversiya (IC)","S₂ → S₁, S₁ → S₀","10⁻¹²−10⁻⁹ s"],["Fluoressensiya","S₁ → S₀ + hν","10⁻⁹−10⁻⁶ s (nanosekund)"],["Interkombinatsion konversiya (ISC)","S₁ → T₁","10⁻¹⁰−10⁻⁶ s"],["Fosforessensiya","T₁ → S₀ + hν","10⁻⁶−10² s (mikro/sekund)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5">{r[0]}</td><td className="py-1.5 font-mono text-sky-300">{r[1]}</td><td className="py-1.5 text-yellow-300">{r[2]}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. KASHA QOIDASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Kasha qoidasi va uning komplekslarda buzilishi</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-yellow-400">Kasha qoidasi (1950):</strong> "Ko'p atomli molekulalarda 
              lyuminestsensiya faqat <strong>eng past qo'zg'algan holatdan</strong> (S₁ yoki T₁) kuzatiladi."
              Sababi: yuqori qo'zg'algan holatlar (S₂, S₃...) juda tez (10⁻¹²−10⁻¹⁰ s) ichki konversiya orqali 
              S₁ ga o'tadi — nurlanishga ulgurmaydi. <strong className="text-yellow-400">Kompleks birikmalarda 
              bu qoida buzilishi mumkin</strong> — ba'zi hollarda S₂ dan ham fluoressensiya kuzatiladi 
              (masalan, [Ru(bpy)₃]²⁺ da ¹MLCT dan kuchsiz fluoressensiya).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Kasha qoidasi bajarilganda</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• Organik molekulalar — deyarli har doim</li>
                <li>• Lantanid komplekslari — f−f o'tishlar</li>
                <li>• [Cr(NH₃)₆]³⁺ — ²E_g → ⁴A₂g fosforessensiya</li>
                <li>• Emission spektr qo'zg'atish to'lqin uzunligiga bog'liq emas</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Kasha qoidasi buzilganda</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• [Ru(bpy)₃]²⁺ — S₂ dan kuchsiz fluoressensiya</li>
                <li>• Azulen — S₂ → S₀ fluoressensiya (S₁ → S₀ juda sekin)</li>
                <li>• Katta energiya farqi S₂−S₁ bo'lganda</li>
                <li>• IC sekinlashganda (katta strukturaviy o'zgarish)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. OG'IR ATOM EFFEKTI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚛️ Og'ir atom effekti — ISC ni tezlashtirish</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-sky-400">Og'ir atom effekti</strong> — katta Z (yadro zaryadi) ga ega 
            atomlar mavjudligida <strong>spin-orbit bog'lanish</strong> kuchayadi. Bu singlet va triplet 
            holatlarni aralashtiradi va <strong>taqiqlangan S₁ → T₁ (ISC) o'tishni ruxsat etilgan</strong> 
            qiladi. Kompleks birikmalarda <strong>Ru, Os, Ir, Pt, Au</strong> kabi og'ir metallar 
            ISC ni juda tezlashtiradi (k_ISC ≈ 10¹²−10¹⁴ s⁻¹).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Metall</th>
                <th className="py-3 px-4 text-purple-300">Z</th>
                <th className="py-3 px-4 text-purple-300">ζ (sm⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">k_ISC (s⁻¹)</th>
                <th className="py-3 px-4 text-purple-300">Φ_fosforessensiya</th>
                <th className="py-3 px-4 text-purple-300">τ_fosforessensiya</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Organik (C)", "6", "~30", "~10⁶−10⁸", "~0.01", "~10⁻³−10 s"],
                  ["Cu⁺ (d¹⁰)", "29", "~600", "~10⁹−10¹⁰", "~0.10", "~10⁻⁴−10⁻³ s"],
                  ["Ru²⁺ (d⁶)", "44", "~1000", "~10¹²", "~0.06", "~10⁻⁶ s"],
                  ["Ir³⁺ (d⁶)", "77", "~4000", "~10¹³−10¹⁴", "~0.95", "~10⁻⁶ s"],
                  ["Pt²⁺ (d⁸)", "78", "~4500", "~10¹⁴", "~0.50", "~10⁻⁵ s"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-sky-400 text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * ζ — spin-orbit bog'lanish konstantasi. Z oshgan sari ζ keskin ortadi (~Z⁴ qonuniyat).
            Og'ir metallarda ISC shunchalik tezki, <strong>fluoressensiya butunlay yo'qoladi</strong> — 
            faqat fosforessensiya kuzatiladi.
          </p>
        </div>

        {/* 4. FRANCK-CONDON PRINSIPI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📏 Franck-Condon prinsipi va Stokes siljishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-sky-400">Franck-Condon prinsipi:</strong> elektron o'tishlar 
            <strong>yadrolar harakatiga nisbatan juda tez</strong> sodir bo'ladi (~10⁻¹⁵ s). 
            Shuning uchun o'tish vertikal ravishda (yadrolar koordinatalari o'zgarmagan holda) boradi.
            Natijada <strong>yutilish va nurlanish maksimumlari orasida farq</strong> — Stokes siljishi yuzaga keladi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
            {[
              { label: "Stokes siljishi", formula: "Δν = ν_abs − ν_em", note: "Odatda 1000−10 000 sm⁻¹" },
              { label: "Yutilish", formula: "S₀(v=0) → S₁(v'=n)", note: "Vertikal o'tish — Franck-Condon" },
              { label: "Nurlanish", formula: "S₁(v'=0) → S₀(v=n)", note: "Vertikal o'tish — termal relaksatsiyadan so'ng" },
            ].map((r, i) => (
              <div key={i} className="bg-sky-600/10 border border-sky-500/30 rounded-xl p-4">
                <p className="text-sky-400 font-bold text-sm">{r.label}</p>
                <p className="text-yellow-400 font-mono text-xs mt-2">{r.formula}</p>
                <p className="text-purple-400 text-xs mt-2">{r.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-sky-400 font-bold mb-2">Komplekslarda Stokes siljishi</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• <strong>[Ru(bpy)₃]²⁺:</strong> Δν ≈ 5860 sm⁻¹ — katta Stokes siljishi (³MLCT holatda geometriya o'zgarishi)</li>
              <li>• <strong>Lantanid komplekslari:</strong> Δν juda kichik — f−f o'tishlar, geometriya deyarli o'zgarmaydi</li>
              <li>• <strong>d−d o'tishlar:</strong> O'rtacha Stokes siljishi — oktaedrik geometriyada kichik o'zgarish</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-600/10 to-purple-600/10 border border-sky-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Jablonski diagrammasi — <strong className="text-sky-400">barcha fotofizik jarayonlarni</strong> bir vaqtda ko'rsatadi</li>
            <li>Kasha qoidasi: lyuminestsensiya faqat <strong className="text-sky-400">eng past qo'zg'algan holatdan</strong> (S₁ yoki T₁)</li>
            <li>Og'ir atom effekti — ISC ni <strong className="text-sky-400">10⁶−10⁸ marta tezlashtiradi</strong></li>
            <li>Franck-Condon prinsipi — <strong className="text-sky-400">Stokes siljishini</strong> tushuntiradi</li>
            <li>Komplekslarda MLCT va MC holatlar <strong className="text-sky-400">qo'shimcha o'tish yo'llari</strong> yaratadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Fotokimyo</Link>
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/mlct-holati" className="px-6 py-3 bg-sky-600/80 rounded-xl hover:bg-sky-500 text-white font-semibold">MLCT qo'zg'algan holat →</Link>
        </div>

      </section>
    </main>
  )
}