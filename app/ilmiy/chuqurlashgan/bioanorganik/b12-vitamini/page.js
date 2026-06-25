"use client"

import Link from "next/link"
import { useState } from "react"

function B12Slayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "struktura", label: "🧬 Struktura" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "fermentlar", label: "🧪 B₁₂-fermentlar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-purple-600/80 text-white" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {tab === "mexanizm" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-purple-400 font-bold">Co−C bog'i — biologik organometallik kimyoning yagona vakili</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">B₁₂ ning faol shakllari:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-800/30 rounded p-2">
                  <p><strong className="text-purple-400">Metilkobalamin (MeCbl):</strong> Co³⁺−CH₃</p>
                  <p className="text-purple-300">Metil guruh ko'chirish reaksiyalari. Metionin sintezida ishtirok etadi.</p>
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <p><strong className="text-purple-400">5'-Deoksiadenozilkobalamin (AdoCbl):</strong> Co³⁺−C5' (adenozil)</p>
                  <p className="text-purple-300">Radikal mexanizmli qayta guruhlanish reaksiyalari. Co−C bog'i gomolitik ajraladi.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 font-bold text-xs mb-2">Gomolitik ajralish (AdoCbl)</p>
                <p className="text-xs font-mono mb-1">Co³⁺−CH₂R → Co²⁺ + •CH₂R</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Co³⁺ (d⁶, LS) → <strong>Co²⁺ (d⁷, radikal)</strong></li>
                  <li>• <strong>5'-deoksiadenozil radikali</strong> (•CH₂R) hosil bo'ladi</li>
                  <li>• B₁₂ — <strong>"radikal ombori"</strong> sifatida ishlaydi</li>
                  <li>• Bog' energiyasi: ~130 kJ/mol (oson ajraladi)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-purple-400 font-bold text-xs mb-2">Geterolitik ajralish (MeCbl)</p>
                <p className="text-xs font-mono mb-1">Co³⁺−CH₃ → Co⁺ + ⁺CH₃</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Co³⁺ (d⁶) → <strong>Co⁺ (d⁸, supernukleofil)</strong></li>
                  <li>• <strong>Metil kationi</strong> (⁺CH₃) hosil bo'ladi</li>
                  <li>• Co⁺ — <strong>eng kuchli biologik nukleofil</strong></li>
                  <li>• Metionin sintezida CH₃ guruhini ko'chiradi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-purple-400 font-bold">Korrin halqasi — porfirinning "egilgan" analogi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Korrin vs Porfirin</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Porfirin:</strong> 4 ta pirrol, barchasi metin (=CH−) ko'priklar bilan bog'langan, <strong>tekis</strong></li>
                  <li>• <strong>Korrin:</strong> 4 ta pirrol, lekin <strong>bitta metin ko'prik yo'q</strong> — A va D halqalar to'g'ridan-to'g'ri bog'langan</li>
                  <li>• Korrin — <strong>egilgan</strong> (buklangan) makrotsikl</li>
                  <li>• <strong>Kichikroq bo'shliq</strong> — Co uchun ideal (~1.9 Å radius)</li>
                  <li>• Porfirinda Fe−N ~2.0 Å, korrinda Co−N ~1.9 Å</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Aksial ligandlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Pastki (α) ligand:</strong> 5,6-dimetilbenzimidazol (DMB) — N-donor</li>
                  <li>• <strong>Yuqori (β) ligand:</strong> CH₃ (MeCbl) yoki 5'-deoksiadenozil (AdoCbl)</li>
                  <li>• <strong>Geometriya:</strong> buzilgan oktaedr (4N + DMB + R)</li>
                  <li>• DMB <strong>nukleotid dumi</strong> orqali korrin halqasiga bog'langan</li>
                  <li>• "Tayanch-off" (base-off) holat: DMB Co dan ajralgan — fermentda faol holat</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-purple-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Co³⁺ — past spinli d⁶</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁶ konfiguratsiya:</strong> barcha elektronlar juftlashgan (LS)</li>
                  <li>• <strong>S = 0</strong> — diamagnit (Co³⁺ dam olish holatida)</li>
                  <li>• <strong>Oktaedrik geometriya</strong> — 4N (korrin) + N (DMB) + C (R)</li>
                  <li>• Korrin — <strong>kuchli maydon ligand</strong>, Δ₀ katta</li>
                  <li>• <strong>CFSE katta</strong> — barqaror past spinli holat</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Co−C bog'i — organometallik KB</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>M−C σ-bog'</strong> — organometallik birikmalarning klassik belgisi</li>
                  <li>• <strong>Co−CH₃:</strong> ~2.0 Å — oddiy kovalent bog'</li>
                  <li>• <strong>Co−C5' (adenozil):</strong> ~2.0-2.1 Å</li>
                  <li>• Bog' energiyasi: ~130 kJ/mol — <strong>oson ajraladi</strong> (radikal mexanizm)</li>
                  <li>• <strong>Sun'iy analoglar:</strong> [Co(dmgH)₂(py)(R)] — model komplekslar</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Co³⁺/Co²⁺/Co⁺ — uchta oksidlanish darajasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Co³⁺ (d⁶, LS):</strong> dam olish holati, diamagnit</li>
                  <li>• <strong>Co²⁺ (d⁷, LS):</strong> radikal mexanizmda, S=1/2, EPR faol</li>
                  <li>• <strong>Co⁺ (d⁸):</strong> supernukleofil, metionin sintezida</li>
                  <li>• Redoks potensiallar: Co³⁺/Co²⁺ ~0 V, Co²⁺/Co⁺ ~−0.6 V</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Makrotsikl effekti va barqarorlik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Korrin — <strong>makrotsiklik ligand</strong>, xelat effekti</li>
                  <li>• Co korrin ichida <strong>mustahkam ushlangan</strong></li>
                  <li>• Korrin sintezi — <strong>murakkab biosintetik yo'l</strong> (30+ bosqich)</li>
                  <li>• Faqat <strong>ba'zi bakteriyalar</strong> sintez qila oladi</li>
                  <li>• Hayvonlar B₁₂ ni <strong>ovqatdan</strong> olishi kerak</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "fermentlar" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-purple-400 font-bold">B₁₂-ga bog'liq fermentlar</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Ferment</th>
                    <th className="text-left py-2 px-3 text-yellow-400">B₁₂ shakli</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Mexanizm</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Reaksiya</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Metionin sintaza", "MeCbl", "Geterolitik (Co⁺)", "Homosistein + CH₃-THF → Metionin + THF"],
                    ["Metilmalonil-KoA mutaza", "AdoCbl", "Gomolitik (radikal)", "Metilmalonil-KoA → Suksinil-KoA"],
                    ["Diol dehidrataza", "AdoCbl", "Gomolitik (radikal)", "1,2-diol → Aldegid + H₂O"],
                    ["Ribonukleotid reduktaza (ba'zi turlari)", "AdoCbl", "Gomolitik (radikal)", "RN → dRN (DNK sintezi)"],
                    ["Glutamat mutaza", "AdoCbl", "Gomolitik (radikal)", "Glutamat → Metilaspartat"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-purple-400">{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function B12Vitamini() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/sitoxrom-p450" className="text-purple-400 hover:text-purple-300 text-lg">← P450</Link>
        <div>
          <h1 className="text-2xl font-bold text-purple-400">💎 B₁₂ vitamini (Kobalamin)</h1>
          <p className="text-purple-400 text-sm">Co−C bog'i • Korrin halqasi • Yagona tabiiy organometallik biomolekula</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 B₁₂ vitamini — tabiatdagi yagona organometallik biomolekula</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-purple-400">B₁₂ vitamini (kobalamin)</strong> — 
              <strong> Co−C bog'i</strong> saqlovchi yagona tabiiy biomolekula.
              Bu — <strong className="text-yellow-400">organometallik birikma</strong>.
              Markazida <strong>Co³⁺ ioni</strong>, korrin makrotsiklik ligand bilan 
              koordinatsiyalangan. Ikki faol shakli: 
              <strong> metilkobalamin (MeCbl, Co−CH₃)</strong> va 
              <strong> 5'-deoksiadenozilkobalamin (AdoCbl, Co−C5')</strong>.
              B₁₂ — <strong>radikal mexanizmli</strong> fermentlar uchun kofaktor.
              Dorothy Hodgkin 1964-yilda B₁₂ ning rentgen strukturasi uchun 
              <strong> Nobel mukofotiga</strong> sazovor bo'lgan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Co−C</p>
              <p className="text-purple-300">Organometallik bog'</p>
              <p className="text-purple-400 mt-1">
                Yagona biologik M−C bog'i. Bog' energiyasi ~130 kJ/mol.
                Gomolitik yoki geterolitik ajraladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Korrin</p>
              <p className="text-purple-300">Makrotsiklik ligand</p>
              <p className="text-purple-400 mt-1">
                Porfirinning "egilgan" analogi. Bir metin ko'prik yo'q.
                Co uchun ideal o'lchamdagi bo'shliq.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-purple-400 font-bold text-lg">Nobel 1964</p>
              <p className="text-purple-300">Dorothy Hodgkin</p>
              <p className="text-purple-400 mt-1">
                B₁₂ rentgen strukturasi — birinchi marta organometallik biomolekula aniqlandi.
              </p>
            </div>
          </div>
        </div>

        {/* STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 Korrin halqasi va Co markazi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              B₁₂ ning strukturasi <strong className="text-yellow-400">4 qismdan</strong> iborat:
              <strong> (1) Korrin halqasi</strong> — 4 ta pirrol, bitta metin ko'prik yo'qligi sababli egilgan.
              <strong> (2) Markaziy Co ioni</strong> — 4N bilan ekvatorial koordinatsiyalangan.
              <strong> (3) DMB (5,6-dimetilbenzimidazol)</strong> — pastki aksial ligand (α-pozitsiya).
              <strong> (4) Yuqori aksial ligand (β-pozitsiya)</strong> — CH₃ (MeCbl) yoki adenozil (AdoCbl) —
              <strong> Co−C bog'i</strong> aynan shu yerda!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-400 font-bold mb-2">Korrin vs Porfirin — solishtirish</p>
              <ul className="space-y-0.5">
                <li>• <strong>Porfirin:</strong> 4 pirrol, 4 metin (=CH−) ko'prik — tekis, simmetrik</li>
                <li>• <strong>Korrin:</strong> 4 pirrol, 3 metin ko'prik — egilgan, bukilgan</li>
                <li>• Korrinda <strong>A va D halqalar to'g'ridan-to'g'ri</strong> bog'langan</li>
                <li>• Korrin bo'shlig'i <strong>kichikroq</strong> — Co uchun ideal</li>
                <li>• Korrin sintezi — <strong>30+ fermentativ bosqich</strong> (murakkab!)</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-400 font-bold mb-2">Co³⁺ — koordinatsion muhit</p>
              <ul className="space-y-0.5">
                <li>• <strong>Ekvatorial:</strong> 4×N (korrin) — kuchli maydon</li>
                <li>• <strong>Pastki aksial (α):</strong> N (DMB) — imidazol tipidagi azot</li>
                <li>• <strong>Yuqori aksial (β):</strong> C (CH₃ yoki adenozil) — <strong>Co−C bog'i!</strong></li>
                <li>• <strong>Geometriya:</strong> buzilgan oktaedr</li>
                <li>• <strong>Co³⁺ (d⁶, LS):</strong> diamagnit, barqaror</li>
              </ul>
            </div>
          </div>
        </div>

        {/* RADIKAL MEXANIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Radikal mexanizm — B₁₂ ning noyob kimyosi</h2>
          
          <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              B₁₂ ning <strong className="text-yellow-400">eng muhim kimyoviy xususiyati</strong> — 
              Co−C bog'ining <strong>oson gomolitik ajralishi</strong>. Bu 
              <strong> radikal jufti</strong> hosil qiladi: Co²⁺ + •CH₂R (5'-deoksiadenozil radikali).
              Hosil bo'lgan radikal keyin <strong>1,2-qayta guruhlanish</strong> reaksiyalarini 
              boshlab beradi. Bu — biologik tizimdagi <strong>yagona radikal mexanizm</strong> 
              hisoblanadi (ribonukleotid reduktazadan tashqari).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-400 font-bold mb-2">Radikal jufti mexanizmi (AdoCbl)</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li><strong>Co³⁺−C5' → Co²⁺ + •CH₂R</strong> (gomolitik ajralish)</li>
                <li>•CH₂R substratdan H atomini tortib oladi → substrat radikali</li>
                <li>Substrat radikali <strong>1,2-qayta guruhlanadi</strong></li>
                <li>Yangi radikal •CH₂R dan H atomini qaytarib oladi</li>
                <li><strong>Co²⁺ + •CH₂R → Co³⁺−C5'</strong> (qayta birikish)</li>
              </ol>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-purple-400 font-bold mb-2">Geterolitik mexanizm (MeCbl)</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li><strong>Co³⁺−CH₃ → Co⁺ + ⁺CH₃</strong> (geterolitik ajralish)</li>
                <li>Co⁺ — <strong>supernukleofil</strong> (d⁸)</li>
                <li>Co⁺ homosisteinning S atomiga hujum qiladi</li>
                <li>CH₃ guruhi <strong>N⁵-metil-THF</strong> dan Co ga o'tadi</li>
                <li>Co³⁺−CH₃ qayta tiklanadi</li>
              </ol>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <B12Slayder />
        </div>

        {/* TARIXIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 B₁₂ kashfiyoti tarixi</h2>
          
          <div className="space-y-3">
            {[
              { year: "1926", text: "Minot va Murphy — jigar ekstrakti pernisioz anemiyani davolaydi (Nobel 1934)" },
              { year: "1948", text: "Rickes va boshqalar — B₁₂ kristall holda ajratib olindi" },
              { year: "1956", text: "Dorothy Hodgkin — B₁₂ rentgen strukturasi (3D tuzilish)" },
              { year: "1961", text: "Lenhert va Hodgkin — Co−C bog'i mavjudligi isbotlandi. B₁₂ — birinchi organometallik biomolekula!" },
              { year: "1964", text: "Hodgkin — Nobel mukofoti (B₁₂ strukturasi uchun)" },
              { year: "1970-yillar", text: "B₁₂-ga bog'liq ferment mexanizmlari ochildi (radikal kimyo)" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-purple-400 font-mono text-sm w-16 shrink-0">{item.year}</span>
                <span className="text-purple-200 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>B₁₂ — <strong className="text-purple-400">yagona tabiiy organometallik biomolekula</strong>, Co−C bog'i saqlaydi</li>
            <li>Faol shakllari: <strong className="text-purple-400">MeCbl (Co−CH₃)</strong> — metil ko'chirish, <strong className="text-purple-400">AdoCbl (Co−C5')</strong> — radikal reaksiyalar</li>
            <li>Co−C bog'i <strong className="text-purple-400">oson gomolitik ajraladi</strong> — biologik radikal manbai</li>
            <li>Korrin halqasi — <strong className="text-purple-400">porfirinning egilgan analogi</strong>, Co uchun ideal</li>
            <li>B₁₂ — <strong className="text-purple-400">koordinatsion va organometallik kimyo</strong> ning biologik tatbiqi uchun mukammal namuna</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/sitoxrom-p450" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← P450</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar" className="px-6 py-3 bg-purple-600/80 rounded-xl hover:bg-purple-500 text-white font-semibold">Metall-dorilar →</Link>
        </div>

      </section>
    </main>
  )
}