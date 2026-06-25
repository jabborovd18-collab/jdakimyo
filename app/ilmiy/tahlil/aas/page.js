// app/ilmiy/tahlil/aas/page.jsx
import Link from "next/link"

export default function AAS() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/tahlil" className="text-purple-400 hover:text-purple-300 text-lg">← Tahlil usullari</Link>
        <div>
          <h1 className="text-2xl font-bold text-red-300">🧯 AAS — Atom-Absorbsion Spektroskopiya</h1>
          <p className="text-purple-400 text-sm">Metall miqdoriy tahlili • Alanga/Grafit pechi • ppb−ppm • Gidrid usuli</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        <Link 
          href="/ilmiy/tahlil/aas/birikmalar"
          className="group block bg-gradient-to-r from-red-900/40 to-purple-900/40 border border-red-700/50 rounded-2xl p-6 hover:bg-red-900/60 hover:border-red-500/60 transition-all transform hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/10"
        >
          <div className="flex items-center gap-4">
            <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🧯</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-300 group-hover:text-red-200 transition-colors">
                Birikmalarning AAS tahlili
              </h3>
              <p className="text-purple-300 text-sm mt-1 group-hover:text-purple-200 transition-colors">
                Kompleks birikmalardagi metall ionlarining miqdoriy AAS tahlili. Metall foizi,
                konsentratsiya, standart og'ish, LOD/LOQ, atomlashtirish usuli har bir birikma uchun batafsil.
              </p>
            </div>
            <div className="text-3xl text-red-300 group-hover:translate-x-1 transition-transform">→</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-red-600/20 text-red-300 border border-red-600/30 px-3 py-1 rounded-full text-xs">12 ta birikma</span>
            <span className="bg-purple-600/20 text-purple-400 border border-purple-600/30 px-3 py-1 rounded-full text-xs">Metall foizi %M</span>
            <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-3 py-1 rounded-full text-xs">LOD / LOQ</span>
            <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full text-xs">Atomlashtirish usuli</span>
            <span className="bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 px-3 py-1 rounded-full text-xs">RSD (%)</span>
          </div>
        </Link>

        {/* 1. ASOSIY MA'LUMOT */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Atom-Absorbsion Spektroskopiya haqida</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-red-300">Atom-Absorbsion Spektroskopiya (AAS)</strong> — erkin metall atomlarining 
              <strong className="text-red-300"> o'ziga xos to'lqin uzunligidagi yorug'likni yutishi</strong>ga asoslangan 
              miqdoriy tahlil usuli. 1955-yilda Alan Walsh tomonidan taklif qilingan. Kompleks birikmalarda 
              <strong className="text-red-300"> metall markazining foiz miqdorini</strong> aniqlash, 
              formula validatsiyasi, tozalikni baholash va qo'shimcha metallarning yo'qligini tekshirish uchun qo'llaniladi.
              AAS <strong className="text-red-300">arzon, yuqori sezgirlikdagi va matritsa effektlariga chidamli</strong> usul bo'lib,
              hozirgacha ko'plab analitik laboratoriyalarda asosiy metall tahlil vositasi hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-300 font-bold mb-2">Nimani aniqlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• <strong>Metall konsentratsiyasi</strong> — eritmadagi metall ionining aniq miqdori (mg/L, ppb)</li>
                <li>• <strong>Metall foizi (%M)</strong> — kompleks tarkibidagi metallning massa ulushi</li>
                <li>• <strong>Nazariy foiz bilan taqqoslash</strong> — taklif qilingan formulani tasdiqlash</li>
                <li>• <strong>Tozalik darajasi</strong> — qo'shimcha metallarning mavjudligi yoki yo'qligi</li>
                <li>• <strong>Gidrat/solvat miqdori</strong> — %M qiymatiga qarab bilvosita baholanadi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-red-300 font-bold mb-2">Qanday ishlaydi?</h3>
              <ul className="text-purple-200 space-y-1 text-sm">
                <li>• Suyuq namuna <strong>atomlashtirgichga</strong> purkaladi</li>
                <li>• Erituvchi bug'lanadi, tuzlar <strong>erkin atomlarga</strong> ajraladi</li>
                <li>• <strong>Katod lampasi</strong> (HCL — Hollow Cathode Lamp) elementga xos monoxromatik yorug'lik chiqaradi</li>
                <li>• Atomlar yorug'likni <strong>yutadi</strong> — Lambert-Ber qonuni: <strong>A = ε·l·c</strong></li>
                <li>• Yutilish <strong>konsentratsiyaga to'g'ri proporsional</strong></li>
                <li>• Kalibrlash egri chizig'i orqali noma'lum konsentratsiya aniqlanadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. ATOMLASHTIRISH USULLARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔥 Atomlashtirish usullari — uchta asosiy texnika</h2>
          
          <p className="text-purple-200 mb-6 leading-relaxed">
            AAS da namunani <strong className="text-red-300">erkin atomlarga aylantirish</strong> usuli 
            sezgirlik va aniqlash chegarasini belgilaydi. Uchta asosiy atomlashtirish texnikasi mavjud.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-300 font-bold mb-3">Alanga AAS (FAAS)</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li><strong>Harorat:</strong> 2000−3000°C</li>
                <li><strong>Alanga:</strong> Havo-atsetilen, N₂O-atsetilen</li>
                <li><strong>LOD:</strong> 0.01−1 mg/L (ppm)</li>
                <li><strong>Namuna hajmi:</strong> 1−5 mL</li>
                <li><strong>Afzalligi:</strong> Tez, arzon, oddiy</li>
                <li><strong>Kamchiligi:</strong> Past sezgirlik, ko'p namuna</li>
              </ul>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-3">Grafit pechi AAS (GFAAS)</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li><strong>Harorat:</strong> 2500−3000°C (dasturlanadigan)</li>
                <li><strong>Muhit:</strong> Grafit trubka, argon gazi</li>
                <li><strong>LOD:</strong> 0.01−1 μg/L (ppb)</li>
                <li><strong>Namuna hajmi:</strong> 10−50 μL</li>
                <li><strong>Afzalligi:</strong> Yuqori sezgirlik (100× FAAS)</li>
                <li><strong>Kamchiligi:</strong> Sekinroq, qimmatroq</li>
              </ul>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
              <h3 className="text-yellow-300 font-bold mb-3">Gidrid usuli (HGAAS)</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li><strong>Elementlar:</strong> As, Se, Sb, Bi, Sn, Te, Ge, Pb</li>
                <li><strong>Reaksiya:</strong> NaBH₄ + HCl → MH₃ (gidrid gazi)</li>
                <li><strong>LOD:</strong> 0.001−0.1 μg/L (ppt darajasi)</li>
                <li><strong>Afzalligi:</strong> Juda yuqori sezgirlik, matritsadan ajratish</li>
                <li><strong>Kamchiligi:</strong> Faqat gidrid hosil qiluvchi elementlar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. KOMPLEKSLAR UCHUN PARAMETRLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📐 Komplekslar tarkibidagi metallar uchun AAS parametrlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            Har bir metall elementi uchun <strong className="text-red-300">maxsus katod lampasi (HCL)</strong> 
            talab qilinadi. Quyida kompleks birikmalarda eng ko'p uchraydigan metallar uchun 
            optimal AAS parametrlari keltirilgan.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">Element</th>
                <th className="py-3 px-4 text-purple-300">λ (nm)</th>
                <th className="py-3 px-4 text-purple-300">Alanga turi</th>
                <th className="py-3 px-4 text-purple-300">LOD FAAS (mg/L)</th>
                <th className="py-3 px-4 text-purple-300">LOD GFAAS (μg/L)</th>
                <th className="py-3 px-4 text-purple-300">Xar. kons. (mg/L)</th>
                <th className="py-3 px-4 text-purple-300">RSD (%)</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["Fe", "248.3", "Havo-atsetilen", "0.005", "0.05", "0.06", "0.5−2"],
                  ["Cu", "324.8", "Havo-atsetilen", "0.002", "0.02", "0.04", "0.5−2"],
                  ["Co", "240.7", "Havo-atsetilen", "0.007", "0.08", "0.08", "0.5−2"],
                  ["Ni", "232.0", "Havo-atsetilen", "0.006", "0.07", "0.07", "0.5−2"],
                  ["Cr", "357.9", "N₂O-atsetilen", "0.003", "0.03", "0.05", "1−3"],
                  ["Pt", "265.9", "Havo-atsetilen", "0.050", "0.50", "1.0", "1−3"],
                  ["Ag", "328.1", "Havo-atsetilen", "0.001", "0.01", "0.02", "0.3−1"],
                  ["Zn", "213.9", "Havo-atsetilen", "0.001", "0.005", "0.01", "0.3−1"],
                  ["Mn", "279.5", "Havo-atsetilen", "0.002", "0.02", "0.03", "0.5−2"],
                  ["Cd", "228.8", "Havo-atsetilen", "0.001", "0.005", "0.02", "0.5−2"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-2 px-3 font-bold text-red-300">{r[0]}</td>
                    <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[1]}</td>
                    <td className="py-2 px-3 text-xs">{r[2]}</td>
                    <td className="py-2 px-3 text-xs">{r[3]}</td>
                    <td className="py-2 px-3 text-xs">{r[4]}</td>
                    <td className="py-2 px-3 text-xs">{r[5]}</td>
                    <td className="py-2 px-3 text-xs">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-purple-400 text-xs mt-3">
            * LOD — aniqlash chegarasi (S/N=3), LOQ — miqdoriy aniqlash chegarasi (S/N=10) ≈ 3.3 × LOD.
            RSD — nisbiy standart og'ish (5 ta parallel o'lchash uchun). N₂O-atsetilen alangasi (~2900°C) 
            qiyin atomlashtiriladigan elementlar (Cr, Al, Si) uchun qo'llaniladi.
          </p>
        </div>

        {/* 4. MISOL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⭐ Misol: K₃[Fe(CN)₆] da temirning AAS tahlili</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            K₃[Fe(CN)₆] (M = 329.24 g/mol) tarkibidagi temirning nazariy foizi: 
            <strong className="text-red-300"> %Fe = (55.845 / 329.24) × 100 = 16.96%</strong>.
            Quyida AAS yordamida aniqlangan eksperimental qiymatlar keltirilgan.
          </p>

          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <h3 className="text-red-300 font-bold mb-3">AAS tahlil natijalari (Fe, λ = 248.3 nm, FAAS):</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead><tr className="border-b border-purple-700">
                  <th className="py-3 px-4 text-purple-300">Parametr</th>
                  <th className="py-3 px-4 text-purple-300">Qiymat</th>
                  <th className="py-3 px-4 text-purple-300">Izoh</th>
                </tr></thead>
                <tbody className="text-purple-200">
                  {[
                    ["Namuna massasi", "25.0 mg", "Analitik tarozida tortilgan"],
                    ["Eritma hajmi", "100.0 mL", "0.1 M HNO₃ da eritilgan"],
                    ["Suyultirish faktori", "10×", "O'lchash uchun optimal diapazonga keltirilgan"],
                    ["O'lchangan konsentratsiya", "4.24 mg/L", "5 ta parallel o'lchash o'rtachasi"],
                    ["RSD", "1.2%", "5 ta o'lchash uchun"],
                    ["Aniqlangan Fe massasi", "4.24 mg", "Suyultirish hisobga olingan"],
                    ["Eksperimental %Fe", "16.96%", "(4.24/25.0) × 100"],
                    ["Nazariy %Fe", "16.96%", "FeC₆N₆K₃ formulasi bo'yicha"],
                    ["Δ (%Fe)", "0.00%", "Mukammal moslik — yuqori tozalik"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3 text-red-300 text-xs">{r[0]}</td>
                      <td className="py-2 px-3 font-mono text-yellow-400 text-xs">{r[1]}</td>
                      <td className="py-2 px-3 text-xs">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. QO'LLANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧪 Kompleks birikmalarda AAS qo'llanishi</h2>
          
          <div className="space-y-4">
            {[
              {
                title: "1. Sintez qilingan kompleks formulasini metall tarkibi orqali tasdiqlash",
                desc: "Taklif qilingan formula bo'yicha metallning nazariy foizi hisoblanadi va AAS orqali eksperimental foiz bilan taqqoslanadi. Farq ±0.5% dan oshmasligi kerak. Bu element analiz (CHNS) bilan birgalikda to'liq formula validatsiyasini ta'minlaydi."
              },
              {
                title: "2. Kompleks tozaligini baholash",
                desc: "Sintez jarayonida ishlatilgan boshqa metallarning (katalizator, boshlang'ich modda) qoldiq miqdori AAS orqali tekshiriladi. Masalan, Co kompleksida Ni qoldig'i, Pt kompleksida Pd qoldig'i ppb darajasida aniqlanadi."
              },
              {
                title: "3. Gidrat va solvat molekulalari sonini bilvosita aniqlash",
                desc: "Agar kompleks tarkibida kristallanish suvi bo'lsa, metall foizi suvsiz namunaga nisbatan pastroq bo'ladi. %M qiymatiga qarab gidrat suvlari sonini hisoblash mumkin: [MLₙ]·xH₂O formulada x soni."
              },
              {
                title: "4. Aralash valentli va ko'p metalli komplekslarda metall nisbatini aniqlash",
                desc: "Aralash metalli komplekslarda (masalan, Fe/Co, Cu/Zn) AAS har bir metallning alohida konsentratsiyasini aniqlab, ularning nisbatini beradi. Bu kompleksning aniq stoxiometriyasini tasdiqlash uchun muhim."
              },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
                <h3 className="text-red-300 font-bold mb-2">{item.title}</h3>
                <p className="text-purple-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. SPEKTRAL INTERFERENSIYA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚠️ Spektral interferensiya va matritsa effektlari</h2>
          
          <p className="text-purple-200 mb-4 leading-relaxed">
            AAS tahlilida <strong className="text-red-300">ikki turdagi interferensiya</strong> kuzatiladi. 
            Ularni tushunish va bartaraf etish to'g'ri natijalar olish uchun muhim.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5">
              <h3 className="text-red-300 font-bold mb-2">Spektral interferensiya</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Chiziqlar ustma-ust tushishi</strong> — yaqin to'lqin uzunlikdagi boshqa element</li>
                <li>• <strong>Fon yutilishi</strong> — molekulyar turlar va tuz zarrachalari</li>
                <li>• <strong>Bartaraf etish:</strong> Zeyman yoki deuteriy fon korrektori</li>
                <li>• <strong>Alternativ λ tanlash:</strong> Fe 248.3 nm o'rniga 372.0 nm (sezgirlik pastroq)</li>
              </ul>
            </div>
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-xl p-5">
              <h3 className="text-orange-300 font-bold mb-2">Kimyoviy (matritsa) interferensiya</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Fosfat effekti:</strong> PO₄³⁻ Ca bilan barqaror birikma hosil qiladi</li>
                <li>• <strong>Ionlanish interferensiyasi:</strong> Ishqoriy metallar oson ionlanadi</li>
                <li>• <strong>Bartaraf etish:</strong> Matritsa modifikatori (La³⁺, NH₄NO₃), standart qo'shish metodi</li>
                <li>• <strong>GFAAS da:</strong> Mg(NO₃)₂ + Pd modifikatori ko'p elementlar uchun universal</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-600/10 to-purple-600/10 border border-red-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>AAS — <strong className="text-red-300">metall ionlarining miqdoriy tahlili</strong> uchun klassik, arzon va ishonchli usul</li>
            <li>Uchta atomlashtirish usuli: <strong className="text-red-300">FAAS (ppm), GFAAS (ppb), HGAAS (ppt)</strong></li>
            <li>Har bir metall uchun <strong className="text-red-300">maxsus katod lampasi (HCL)</strong> talab qilinadi — ko'p elementli tahlil sekin</li>
            <li>Element analiz (CHNS) bilan birgalikda <strong className="text-red-300">to'liq formula validatsiyasi</strong> uchun ishlatiladi</li>
            <li>Matritsa effektlari — <strong className="text-red-300">standart qo'shish metodi yoki modifikatorlar</strong> bilan bartaraf etiladi</li>
            <li>ICP-MS ga nisbatan arzon, lekin <strong className="text-red-300">bir vaqtda faqat bitta element</strong> aniqlanadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/tahlil/exafs" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← EXAFS/XANES</Link>
          <Link href="/ilmiy/tahlil/icp" className="px-6 py-3 bg-red-700/80 rounded-xl hover:bg-red-600 text-white font-semibold">ICP-OES/ICP-MS →</Link>
        </div>

      </section>
    </main>
  )
}