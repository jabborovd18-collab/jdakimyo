import Link from "next/link"

export default function KCh7_12() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/koordinator-son" className="text-purple-400 hover:text-purple-300 text-lg">← Koordinator son</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">🪐 KCh = 7−12: Yuqori koordinator sonlar</h1>
          <p className="text-purple-400 text-sm">Pentagonal bipiramida • Antiprizma • Dodekaedr • Ikosaedr • 4d/5d/f-elementlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Kirish */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Yuqori koordinator sonlar haqida</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 leading-relaxed">
              <strong className="text-purple-400">Yuqori koordinator sonlar (KCh ≥ 7)</strong> — 
              <strong className="text-purple-400"> 4d va 5d metallar</strong> (Zr, Mo, W, Re) hamda 
              <strong className="text-purple-400"> f-elementlar</strong> (lantanidlar, aktinidlar) uchun xarakterli.
              Katta ion radiusi (r {'>'} 0.8 Å) va kichik ligandlar (F⁻, O²⁻, NO₃⁻) yuqori KCh ni barqarorlashtiradi.
              Geometriyalar orasidagi <strong>energetik farq juda kichik</strong> (~2−10 kJ/mol) — 
              ko'pincha bir nechta geometriya bir vaqtda kuzatiladi (fluxional behavior).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Nima uchun yuqori KCh?</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Katta ion radiusi</strong> — ko'proq ligand sig'dira oladi</li>
                <li>• <strong>Kichik ligandlar</strong> — F⁻ (r=1.33 Å), O²⁻ (r=1.40 Å), NO₃⁻ (bidentat)</li>
                <li>• <strong>d-orbitallarning diffuzligi</strong> — 4d/5d orbitallar kengroq, KMN hissasi kam</li>
                <li>• <strong>Yuqori zaryad</strong> — M⁴⁺, M⁵⁺ ko'proq ligand jalb qiladi</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Xarakterli metallar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>KCh=7:</strong> Zr⁴⁺, Hf⁴⁺, Mo⁴⁺, W⁴⁺, Re⁵⁺, U⁶⁺</li>
                <li>• <strong>KCh=8:</strong> Mo⁴⁺, W⁴⁺, Re⁵⁺, Zr⁴⁺, lantanidlar</li>
                <li>• <strong>KCh=9:</strong> Nd³⁺, Sm³⁺, Eu³⁺, Gd³⁺ (lantanidlar)</li>
                <li>• <strong>KCh=10−12:</strong> La³⁺, Ce³⁺, Th⁴⁺, U⁴⁺ (katta ionlar)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KCh = 7 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 KCh = 7 — Uchta asosiy geometriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Pentagonal bipiramida (D₅h)</h3>
              <p className="text-purple-300 text-xs mb-2">5 ta ekvatorial ligand (72° burchak) + 2 ta aksial (180°)</p>
              <p className="text-yellow-400 text-xs font-mono">[ZrF₇]³⁻, [UO₂F₅]³⁻</p>
              <p className="text-purple-400 text-xs mt-2">Aksial pozitsiyada odatda O²⁻ (uranil) — kuchli bog'</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Monokaprovli oktaedr (C₃v)</h3>
              <p className="text-purple-300 text-xs mb-2">Oktaedrning bir yoqi ustiga 7-ligand qo'shilgan</p>
              <p className="text-yellow-400 text-xs font-mono">[NbF₇]²⁻, [TaF₇]²⁻</p>
              <p className="text-purple-400 text-xs mt-2">C₃ o'qi bo'yicha — 3+3+1 ligand</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Monokaprovli trigonal prizma (C₂v)</h3>
              <p className="text-purple-300 text-xs mb-2">Trigonal prizmaning to'rtburchak yoqiga qo'shimcha ligand</p>
              <p className="text-yellow-400 text-xs font-mono">[MoF₇]⁻, [WF₇]⁻</p>
              <p className="text-purple-400 text-xs mt-2">Kam uchraydi — oraliq geometriya</p>
            </div>
          </div>

          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
            <h3 className="text-yellow-400 font-bold mb-2">KCh=7 uchun energetik manzara</h3>
            <p className="text-purple-200 text-sm">
              Uchala geometriya orasidagi energiya farqi ~2−8 kJ/mol. Kichik o'zgarishlar (qarshi ion, 
              erituvchi, harorat) geometriyani o'zgartirishi mumkin. Bu KCh=7 komplekslarini
              <strong> fluxional</strong> (oqishqoq) qiladi — NMR vaqt shkalasida ligandlar almashinib turadi.
            </p>
          </div>
        </div>

        {/* KCh = 8 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔶 KCh = 8 — To'rtta asosiy geometriya</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Kvadrat antiprizma (D₄d) — ENG BARQAROR</h3>
              <p className="text-purple-300 text-xs mb-2">Ikkita kvadrat bir-biriga nisbatan 45° ga burilgan. 8 ta teng bog'. Eng ko'p uchraydigan KCh=8 geometriyasi.</p>
              <p className="text-yellow-400 text-xs font-mono">[Zr(acac)₄], [Mo(CN)₈]⁴⁻, [ReF₈]²⁻</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Dodekaedrik (D₂d)</h3>
              <p className="text-purple-300 text-xs mb-2">8 ta cho'qqi — 2 turdagi ligand pozitsiyalari (A va B turlari).</p>
              <p className="text-yellow-400 text-xs font-mono">[Mo(CN)₈]⁴⁻ (ba'zi kationlar bilan), [Zr(C₂O₄)₄]⁴⁻</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Kub (O_h)</h3>
              <p className="text-purple-300 text-xs mb-2">8 ta cho'qqi — kub shaklida. Kam uchraydi — ligandlar juda yaqin (sterik itarilish).</p>
              <p className="text-yellow-400 text-xs font-mono">[UF₈]²⁻ (faqat katta U⁴⁺ bilan), [Sr(H₂O)₈]²⁺</p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Ikkikalanakli trigonal prizma (C₂v)</h3>
              <p className="text-purple-300 text-xs mb-2">Trigonal prizmaning 2 ta to'rtburchak yog'iga qo'shimcha ligandlar.</p>
              <p className="text-yellow-400 text-xs font-mono">[La(H₂O)₈]³⁺, [Ce(H₂O)₈]³⁺</p>
            </div>
          </div>
        </div>

        {/* KCh = 9 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔷 KCh = 9 — Uch kalanakli trigonal prizma (D₃h)</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm mb-3">
              <strong className="text-purple-400">KCh = 9</strong> — lantanid komplekslari uchun eng xarakterli koordinator son.
              Trigonal prizmaning 3 ta to'rtburchak yog'iga bittadan qo'shimcha ligand ("kalanak") joylashgan.
              <strong> [M(H₂O)₉]³⁺</strong> — lantanid akvakomplekslari uchun standart formula.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-yellow-400 font-semibold text-sm mb-2">Xarakterli misollar:</h4>
                <ul className="text-purple-200 text-xs space-y-1">
                  <li>• <strong>[Nd(H₂O)₉]³⁺</strong> — Nd−O: 2.45−2.55 Å</li>
                  <li>• <strong>[Sm(H₂O)₉]³⁺</strong> — Sm−O: 2.40−2.50 Å</li>
                  <li>• <strong>[Eu(H₂O)₉]³⁺</strong> — Eu−O: 2.38−2.48 Å</li>
                  <li>• <strong>[Gd(H₂O)₉]³⁺</strong> — Gd−O: 2.35−2.45 Å</li>
                </ul>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-300 text-xs">
                  <strong>Lantanid qisqarishi:</strong> La dan Lu gacha ion radiusi kamayadi 
                  (La³⁺: 1.03 Å → Lu³⁺: 0.86 Å). Og'ir lantanidlar KCh=8 ga o'tadi — 
                  [Ho(H₂O)₈]³⁺, [Er(H₂O)₈]³⁺.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KCh = 10−12 */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🪐 KCh = 10−12 — Eng yuqori koordinator sonlar</h2>
          
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">KCh = 10 — Ikkikalanakli kvadrat antiprizma (D₄d)</h3>
              <p className="text-purple-200 text-sm">
                Kvadrat antiprizmaning 2 ta kvadrat yog'iga bittadan qo'shimcha ligand. 
                Lantanidlar (La, Ce, Pr, Nd) uchun xarakterli.
              </p>
              <p className="text-yellow-400 text-xs font-mono mt-2">[La(NO₃)₅]²⁻, [Ce(NO₃)₅]²⁻, [Th(C₂O₄)₄]⁴⁻</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">KCh = 12 — Ikosaedr (I_h) — Eng yuqori simmetrik KCh!</h3>
              <p className="text-purple-200 text-sm">
                12 ta ligand mukammal simmetrik ikosaedr shaklida joylashgan. Faqat eng katta ionlar (La³⁺, Ce³⁺) 
                va kichik bidentat ligandlar (NO₃⁻) bilan hosil bo'ladi. Har bir NO₃⁻ 2 ta O atomi bilan koordinatsiyalanadi.
              </p>
              <p className="text-yellow-400 text-xs font-mono mt-2">[Ce(NO₃)₆]²⁻ (ikosaedr), [La(NO₃)₆]³⁻, [Th(NO₃)₆]²⁻</p>
            </div>

            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-purple-400 font-bold mb-2">Kuboktaedr (O_h) — KCh=12 alternativ</h3>
              <p className="text-purple-200 text-sm">
                Kuboktaedr — 8 ta uchburchak va 6 ta kvadrat yoqli poliedr. Metall klasterlarda va 
                qattiq fazada (metallar, qotishmalar) uchraydi. Kompleks birikmalarda kam — faqat 
                juda katta ionlar bilan.
              </p>
            </div>
          </div>
        </div>

        {/* Taqqoslash jadvali */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📊 Yuqori KCh geometriyalar taqqoslash</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b border-purple-700">
                <th className="py-3 px-4 text-purple-300">KCh</th>
                <th className="py-3 px-4 text-purple-300">Geometriya</th>
                <th className="py-3 px-4 text-purple-300">Simmetriya</th>
                <th className="py-3 px-4 text-purple-300">Shakl</th>
                <th className="py-3 px-4 text-purple-300">Xarakterli ionlar</th>
                <th className="py-3 px-4 text-purple-300">Misollar</th>
              </tr></thead>
              <tbody className="text-purple-200">
                {[
                  ["7", "Pentagonal bipiramida", "D₅h", "5 ekv + 2 aks", "Zr⁴⁺, U⁶⁺", "[ZrF₇]³⁻"],
                  ["7", "Monokaprovli oktaedr", "C₃v", "Oktaedr + 1", "Nb⁵⁺, Ta⁵⁺", "[NbF₇]²⁻"],
                  ["8", "Kvadrat antiprizma", "D₄d", "2 kv. 45° burilgan", "Mo⁴⁺, W⁴⁺, Zr⁴⁺", "[Mo(CN)₈]⁴⁻"],
                  ["8", "Dodekaedr", "D₂d", "8 cho'qqi", "Mo⁴⁺, Zr⁴⁺", "[Zr(C₂O₄)₄]⁴⁻"],
                  ["9", "Uch kal. trig. prizma", "D₃h", "Prizma + 3 kal.", "Nd³⁺, Sm³⁺", "[Nd(H₂O)₉]³⁺"],
                  ["10", "Ikki kal. kv. antiprizma", "D₄d", "Antiprizma + 2", "La³⁺, Ce³⁺", "[La(NO₃)₅]²⁻"],
                  ["12", "Ikosaedr", "Ih", "20 ta uchburchak", "Ce³⁺, Th⁴⁺", "[Ce(NO₃)₆]²⁻"],
                ].map((r, i) => (
                  <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                    <td className="py-3 px-4 font-bold text-purple-400">{r[0]}</td>
                    <td className="py-3 px-4">{r[1]}</td>
                    <td className="py-3 px-4 font-mono text-yellow-400 text-xs">{r[2]}</td>
                    <td className="py-3 px-4 text-xs">{r[3]}</td>
                    <td className="py-3 px-4 text-xs">{r[4]}</td>
                    <td className="py-3 px-4 font-mono text-xs">{r[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Yuqori KCh (7−12) — <strong className="text-purple-400">4d/5d metallar va f-elementlar</strong> uchun xarakterli</li>
            <li>KCh=7−8 geometriyalari orasidagi farq ~2−10 kJ/mol — <strong className="text-purple-400">fluxional</strong> harakat kuzatiladi</li>
            <li>KCh=8 uchun <strong className="text-purple-400">kvadrat antiprizma</strong> eng barqaror geometriya</li>
            <li>KCh=9 — <strong className="text-purple-400">lantanid akvakomplekslari</strong> uchun standart</li>
            <li>KCh=12 (ikosaedr) — <strong className="text-purple-400">bidentat NO₃⁻ ligandlari</strong> bilan hosil bo'ladi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kch-5-6" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← KCh = 5−6</Link>
          <Link href="/ilmiy/chuqurlashgan/koordinator-son/kepert-modeli" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Kepert modeli →</Link>
        </div>

      </section>
    </main>
  )
}