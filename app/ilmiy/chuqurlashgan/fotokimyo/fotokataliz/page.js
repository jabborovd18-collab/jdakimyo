import Link from "next/link"

export default function Fotokataliz() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/fotokimyo" className="text-purple-400 hover:text-purple-300 text-lg">← Fotokimyo</Link>
        <div>
          <h1 className="text-2xl font-bold text-green-400">⚡ Fotokatalitik sikllar</h1>
          <p className="text-purple-400 text-sm">Suvning parchalanishi • CO₂ reduksiyasi • Quyosh energiyasi konversiyasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Fotokataliz haqida</h2>
          
          <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-green-400">Fotokataliz</strong> — yorug'lik energiyasidan foydalanib 
              kimyoviy reaksiyalarni <strong>tezlashtirish yoki yo'naltirish</strong> jarayoni.
              Kompleks birikmalar, ayniqsa <strong className="text-green-400">[Ru(bpy)₃]²⁺ va uning hosilalari</strong>, 
              ko'rinadigan yorug'likni yutib, <strong>suvni H₂ va O₂ ga parchalash</strong>, 
              <strong>CO₂ ni yoqilg'iga aylantirish</strong> va boshqa muhim reaksiyalarni amalga oshiradi.
              Bu <strong>"sun'iy fotosintez"</strong> deb ataladi — tabiiy fotosintezdan ilhomlangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Fotokatalitik sikl talablari</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Fotosensibilizator (PS):</strong> Yorug'likni yutadi, qo'zg'algan holat hosil qiladi</li>
                <li>• <strong>Katalizator (Cat):</strong> Elektronlarni substratga uzatadi</li>
                <li>• <strong>Qurbon donor (SD):</strong> PS ni regeneratsiya qiladi (qaytaruvchi sikl)</li>
                <li>• <strong>Qurbon akseptor (SA):</strong> Oksidlovchi siklda PS ni regeneratsiya qiladi</li>
                <li>• <strong>Energiya manbai:</strong> Ko'rinadigan yorug'lik (400−700 nm) — quyosh spektri</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-green-400 font-bold mb-2">Asosiy fotokatalitik reaksiyalar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Suvning parchalanishi:</strong> 2H₂O + hν → 2H₂ + O₂ (ΔG = +237 kJ/mol)</li>
                <li>• <strong>CO₂ reduksiyasi:</strong> CO₂ + 2H⁺ + 2e⁻ → CO + H₂O</li>
                <li>• <strong>H₂ hosil qilish:</strong> 2H⁺ + 2e⁻ → H₂ (proton reduksiyasi)</li>
                <li>• <strong>O₂ hosil qilish:</strong> 2H₂O → O₂ + 4H⁺ + 4e⁻ (suv oksidlanishi)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. SUVNING PARCHALANISHI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Suvning fotokatalitik parchalanishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Suvning parchalanishi</strong> — "sun'iy fotosintez" ning 
            eng muhim maqsadi. <strong>2H₂O → 2H₂ + O₂</strong> reaksiyasi uchun 
            <strong>+237 kJ/mol</strong> (1.23 eV) energiya kerak. Bu jarayon <strong>ikkita yarim reaksiyadan</strong> 
            iborat: suvning oksidlanishi (O₂ ajralishi) va protonlarning qaytarilishi (H₂ ajralishi).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5">
              <h3 className="text-blue-400 font-bold mb-3">H₂ hosil qilish — qaytaruvchi sikl</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong>1.</strong> PS + hν → *PS (MLCT qo'zg'alish)</p>
                <p><strong>2.</strong> *PS + SD → PS⁻ + SD⁺ (qaytaruvchi so'ndirish)</p>
                <p><strong>3.</strong> PS⁻ + Cat → PS + Cat⁻ (elektron uzatish)</p>
                <p><strong>4.</strong> 2Cat⁻ + 2H⁺ → 2Cat + H₂ (katalitik proton reduksiyasi)</p>
                <p className="text-yellow-400 mt-2"><strong>Katalizatorlar:</strong> Pt nan zarrachalari, [Co(dmgH)₂], [FeFe]-gidrogenaza modellari</p>
                <p className="text-purple-400"><strong>Qurbon donorlar:</strong> TEOA (trietanolamin), TEA, EDTA</p>
              </div>
            </div>
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-400 font-bold mb-3">O₂ hosil qilish — oksidlovchi sikl</h3>
              <div className="space-y-2 text-xs text-purple-200">
                <p><strong>1.</strong> PS + hν → *PS (MLCT qo'zg'alish)</p>
                <p><strong>2.</strong> *PS + SA → PS⁺ + SA⁻ (oksidlovchi so'ndirish)</p>
                <p><strong>3.</strong> PS⁺ + Cat → PS + Cat⁺ (elektron teshigi uzatish)</p>
                <p><strong>4.</strong> 4Cat⁺ + 2H₂O → 4Cat + O₂ + 4H⁺ (katalitik suv oksidlanishi)</p>
                <p className="text-yellow-400 mt-2"><strong>Katalizatorlar:</strong> RuO₂, IrO₂, [Ru(bda)(pic)₂], Mn₄Ca klasteri</p>
                <p className="text-purple-400"><strong>Qurbon akseptorlar:</strong> [Co(NH₃)₅Cl]²⁺, Na₂S₂O₈</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. CO₂ REDUKSIYASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🌍 CO₂ fotokatalitik reduksiyasi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">CO₂ reduksiyasi</strong> — atmosferadagi CO₂ ni 
            foydali yoqilg'i va kimyoviy mahsulotlarga aylantirish. Bu jarayon <strong>bir nechta elektron 
            va proton talab qiladi</strong> — mahsulot turiga qarab 2, 4, 6 yoki 8 elektron.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Reaksiya</th>
                <th className="py-3 px-4 text-purple-300">Mahsulot</th>
                <th className="py-3 px-4 text-purple-300">e⁻ soni</th>
                <th className="py-3 px-4 text-purple-300">E° (V, NHE)</th>
                <th className="py-3 px-4 text-purple-300">Katalizator misoli</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["CO₂ + 2H⁺ + 2e⁻ → CO + H₂O", "CO (uglerod monoksid)", "2", "−0.53", "[Re(bpy)(CO)₃Cl]"],
                  ["CO₂ + 2H⁺ + 2e⁻ → HCOOH", "HCOOH (chumoli kislota)", "2", "−0.61", "[Ru(bpy)₂(CO)₂]²⁺"],
                  ["CO₂ + 8H⁺ + 8e⁻ → CH₄ + 2H₂O", "CH₄ (metan)", "8", "−0.24", "Cu nan zarrachalari"],
                  ["2CO₂ + 12H⁺ + 12e⁻ → C₂H₄ + 4H₂O", "C₂H₄ (etilen)", "12", "−0.34", "Cu asosidagi katalizatorlar"],
                  ["CO₂ + 4H⁺ + 4e⁻ → HCHO + H₂O", "HCHO (formaldegid)", "4", "−0.48", "[Fe(porfirin)]"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-mono text-xs">{r[0]}</td>
                    <td className="py-3 px-4 text-yellow-400 text-xs">{r[1]}</td>
                    <td className="py-3 px-4 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[3]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Z-SXEMA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔗 Z-sxema — to'liq suv parchalanishi</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            <strong className="text-green-400">Z-sxema</strong> — tabiiy fotosintezdan (PSII va PSI) 
            ilhomlangan, <strong>ikkita fotosensibilizator</strong> yordamida suvni to'liq parchalash 
            tizimi. Birinchi PS suvni oksidlaydi (O₂), ikkinchi PS protonlarni qaytaradi (H₂).
            O'rtada <strong>redoks mediator</strong> elektronlarni tashiydi.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-green-400 font-bold mb-3">Z-sxema bosqichlari:</h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p><strong className="text-green-400">1. PSII (O₂ ajratuvchi):</strong> PSII + hν → *PSII → PSII⁺ + e⁻; 4PSII⁺ + 2H₂O → 4PSII + O₂ + 4H⁺</p>
              <p><strong className="text-green-400">2. Redoks mediator:</strong> PSII dan elektronlarni qabul qiladi va PSI ga uzatadi (masalan, IO₃⁻/I⁻, [Co(bpy)₃]³⁺/²⁺)</p>
              <p><strong className="text-green-400">3. PSI (H₂ ajratuvchi):</strong> PSI + hν → *PSI; *PSI + Med(red) → PSI⁻ + Med(ox); PSI⁻ + Cat → PSI + Cat⁻; 2Cat⁻ + 2H⁺ → 2Cat + H₂</p>
            </div>
          </div>

          <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">Hozirgi holat va muammolar</h3>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• <strong>Eng yaxshi natija:</strong> STH (Solar-to-Hydrogen) samaradorlik ~1−3% (sanoat uchun 10% kerak)</li>
              <li>• <strong>Asosiy muammo:</strong> O₂ ajratish katalizatori — sekin, yuqori o'ta kuchlanish talab qiladi</li>
              <li>• <strong>Qurbon donorlar:</strong> Amaliy tizimlarda kerak emas — faqat suv va quyosh nuri!</li>
              <li>• <strong>Barqarorlik:</strong> Ko'pchilik katalizatorlar bir necha soat ichida parchalanadi</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-600/10 to-purple-600/10 border border-green-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Fotokataliz — <strong className="text-green-400">quyosh energiyasini kimyoviy energiyaga aylantirish</strong></li>
            <li>Suvning parchalanishi — <strong className="text-green-400">H₂ va O₂ ajratish</strong> uchun ikkita yarim reaksiya</li>
            <li>CO₂ reduksiyasi — <strong className="text-green-400">CO, HCOOH, CH₄, C₂H₄</strong> kabi mahsulotlar</li>
            <li>Z-sxema — <strong className="text-green-400">tabiiy fotosintezdan ilhomlangan</strong> to'liq tizim</li>
            <li>Asosiy muammo — <strong className="text-green-400">barqarorlik va samaradorlik</strong> (STH {'>'} 10% kerak)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/fotokimyo/oled" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← OLED materiallari</Link>
          <Link href="/ilmiy/chuqurlashgan/reaksiyalar" className="px-6 py-3 bg-green-600/80 rounded-xl hover:bg-green-500 text-white font-semibold">Komplekslar reaksiyalari →</Link>
        </div>

      </section>
    </main>
  )
}