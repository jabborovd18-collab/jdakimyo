import Link from "next/link"

export default function MLCTHolati() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="text-purple-400 hover:text-purple-300 text-lg">← Fotokimyo</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">⭐ MLCT qo'zg'algan holat</h1>
          <p className="text-purple-400 text-sm">[Ru(bpy)₃]²⁺ • ³MLCT • Yashash vaqti • So'ndirish mexanizmlari • DSSC</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 MLCT qo'zg'algan holat haqida</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">MLCT (Metal-to-Ligand Charge Transfer)</strong> qo'zg'algan holat — 
              elektronning <strong className="text-blue-400">metall d-orbitallaridan ligand π* orbitallariga</strong> 
              ko'chishi natijasida hosil bo'ladi. Bu holat <strong className="text-blue-400">fotokimyoviy 
              reaksiyalarning asosiy harakatlantiruvchi kuchi</strong> hisoblanadi. 
              <strong className="text-blue-400">[Ru(bpy)₃]²⁺</strong> — MLCT fotokimyosining eng klassik 
              va ko'p o'rganilgan namunasi bo'lib, uning ³MLCT qo'zg'algan holati 
              <strong>~1 μs yashaydi</strong> va <strong>kuchli oksidlovchi ham, qaytaruvchi ham</strong> 
              bo'la oladi — bu uni universal fotosensibilizator qiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">[Ru(bpy)₃]²⁺ — asosiy fotofizik parametrlar</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-purple-700/50"><th className="text-left py-2 text-purple-400">Parametr</th><th className="text-left py-2 text-blue-400">Qiymat</th></tr></thead>
                <tbody className="text-purple-200">
                  {[["Yutilish λ_max (¹MLCT)","452 nm (ε ≈ 14 600 M⁻¹sm⁻¹)"],["Emission λ_max (³MLCT)","615 nm (to'q sariq)"],["Stokes siljishi","5860 sm⁻¹"],["Kvant unumi Φ (H₂O, havoda)","0.028 (kislorod so'ndiradi)"],["Kvant unumi Φ (N₂ atmosferasi)","0.062"],["Yashash vaqti τ (N₂)","1.1 μs"],["Yashash vaqti τ (havoda)","0.6 μs"],["³MLCT energiyasi","2.12 eV (205 kJ/mol)"],["E°(Ru³⁺/²⁺) asosiy holat","+1.26 V (NHE)"],["E°(*Ru³⁺/²⁺) qo'zg'algan","−0.86 V (kuchli qaytaruvchi!)"],["E°(Ru²⁺/⁺) qo'zg'algan","+0.84 V (kuchli oksidlovchi!)"]].map((r,i)=>(<tr key={i} className="border-b border-purple-800/30"><td className="py-1.5">{r[0]}</td><td className="py-1.5 font-mono text-yellow-400">{r[1]}</td></tr>))}
                </tbody>
              </table>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold mb-2">MLCT holat energetik diagrammasi</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• <strong>¹MLCT:</strong> Singlet — yutilish (452 nm, ruxsat etilgan)</li>
                <li>• <strong>¹MLCT → ³MLCT:</strong> ISC — juda tez (~40 fs, og'ir atom effekti)</li>
                <li>• <strong>³MLCT:</strong> Triplet — nurlanish (615 nm, fosforessensiya)</li>
                <li>• <strong>³MC:</strong> Metall-markazlashgan triplet — termal aktivatsiya orqali (ΔE ≈ 3600 sm⁻¹)</li>
                <li>• <strong>³MC → S₀:</strong> Nurlanishsiz relaksatsiya — fotoparchalanish yo'li!</li>
                <li>• <strong>³MLCT va ³MC raqobati</strong> — haroratga kuchli bog'liq</li>
              </ul>
              <div className="mt-3 bg-red-600/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-xs">
                  <strong>⚠ Fotoparchalanish:</strong> ³MC holatga o'tish Ru−N bog'larining uzilishiga va 
                  bpy ligandlarining yo'qolishiga olib keladi. Bu [Ru(bpy)₃]²⁺ ning asosiy fotokimyoviy 
                  beqarorlik yo'lidir. Past haroratda bu jarayon sekinlashadi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SO'NDIRISH MEXANIZMLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 So'ndirish mexanizmlari — Stern-Volmer tenglamasi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">So'ndirish (quenching)</strong> — qo'zg'algan holatning 
            boshqa molekula (so'ndiruvchi) bilan o'zaro ta'siri natijasida nurlanishsiz relaksatsiyasi.
            <strong className="text-blue-400">Stern-Volmer tenglamasi:</strong> 
            τ₀/τ = 1 + k_q·τ₀·[Q] — bu yerda k_q — so'ndirish tezligi konstantasi, [Q] — so'ndiruvchi konsentratsiyasi.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-5">
              <h3 className="text-green-400 font-bold mb-2">Oksidlovchi so'ndirish (oxidative quenching)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• *Ru²⁺ + Q → Ru³⁺ + Q⁻ (elektron beradi)</li>
                <li>• <strong>So'ndiruvchilar:</strong> MV²⁺ (metilviologen), O₂, Fe³⁺</li>
                <li>• Hosil bo'lgan Ru³⁺ kuchli oksidlovchi</li>
                <li>• Suvning oksidlanishi uchun ishlatiladi</li>
                <li>• k_q ≈ 10⁹−10¹⁰ M⁻¹s⁻¹ (diffuziya chegarasi)</li>
              </ul>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-2">Qaytaruvchi so'ndirish (reductive quenching)</h3>
              <ul className="text-purple-200 text-xs space-y-1">
                <li>• *Ru²⁺ + Q → Ru⁺ + Q⁺ (elektron oladi)</li>
                <li>• <strong>So'ndiruvchilar:</strong> TEOA, askorbat, NADH</li>
                <li>• Hosil bo'lgan Ru⁺ kuchli qaytaruvchi</li>
                <li>• CO₂ reduksiyasi uchun ishlatiladi</li>
                <li>• k_q ≈ 10⁸−10⁹ M⁻¹s⁻¹</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-2">Energiya uzatish (energy transfer)</h3>
            <p className="text-purple-200 text-sm">
              *Ru²⁺ + A → Ru²⁺ + *A — qo'zg'algan holat energiyasi boshqa molekulaga uzatiladi.
              <strong>Dexter (almashinuv) va Förster (dipol-dipol)</strong> mexanizmlari.
              Singlet kislorod hosil qilish: *Ru²⁺ + O₂ → Ru²⁺ + ¹O₂ — fotodinamik terapiya uchun muhim.
            </p>
          </div>
        </div>

        {/* 3. DSSC */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">☀️ DSSC — Bo'yoq-sezgir quyosh elementlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-blue-400">DSSC (Dye-Sensitized Solar Cells)</strong> — Michael Grätzel 
            tomonidan 1991-yilda ixtiro qilingan. [Ru(bpy)₃]²⁺ va uning hosilalari (masalan, N3, N719, 
            "black dye") TiO₂ yuzasiga biriktirilib, <strong>quyosh nurini elektr energiyasiga</strong> 
            aylantiradi. Samaradorlik 11−13% gacha yetgan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-blue-400 font-bold mb-3">DSSC ishlash prinsipi (5 bosqich):</h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p><strong className="text-blue-400">1. Yutilish:</strong> Bo'yoq + hν → *Bo'yoq (MLCT qo'zg'alish)</p>
              <p><strong className="text-blue-400">2. Elektron injeksiyasi:</strong> *Bo'yoq → TiO₂ (o'tkazuvchanlik zonasi) — ~50 fs!</p>
              <p><strong className="text-blue-400">3. Bo'yoq regeneratsiyasi:</strong> Bo'yoq⁺ + I⁻ → Bo'yoq + I₃⁻ (redoks jufti)</p>
              <p><strong className="text-blue-400">4. Elektron tashilishi:</strong> TiO₂ → FTO elektrod → tashqi zanjir</p>
              <p><strong className="text-blue-400">5. Qarshi elektrod:</strong> I₃⁻ + 2e⁻ → 3I⁻ (Pt katalizatorida)</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>³MLCT holat — <strong className="text-blue-400">~1 μs yashaydi</strong>, ham oksidlovchi, ham qaytaruvchi</li>
            <li>Og'ir atom effekti — <strong className="text-blue-400">ISC ni ~40 fs gacha tezlashtiradi</strong></li>
            <li>Stern-Volmer tenglamasi — <strong className="text-blue-400">so'ndirish kinetikasini</strong> miqdoriy tavsiflaydi</li>
            <li>DSSC — <strong className="text-blue-400">MLCT fotokimyosining amaliy qo'llanishi</strong></li>
            <li>³MC holat — <strong className="text-blue-400">fotoparchalanish yo'li</strong>, past haroratda sekinlashadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/jablonski" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Jablonski diagrammasi</Link>
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/lantanidlar" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Lantanid komplekslari →</Link>
        </div>

      </section>
    </main>
  )
}