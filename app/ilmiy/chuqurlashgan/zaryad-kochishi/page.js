"use client"

import Link from "next/link"
import { useState } from "react"

// ============================================================================
// INTERAKTIV CT TANISHTIRUV SLAYDERI
// ============================================================================
function CTTanishuv() {
  const [tab, setTab] = useState("umumiy")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "umumiy", label: "📋 Umumiy" },
          { key: "turlari", label: "🔬 Turlari" },
          { key: "energetika", label: "📊 Energetika" },
          { key: "tarix", label: "📜 Tarix" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-lime-600/80 text-white" 
                : "bg-purple-800/40 text-purple-300 hover:bg-purple-700/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        {tab === "umumiy" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold">Zaryad ko'chishi (CT) — asosiy tushuncha</h4>
            <p>
              <strong className="text-yellow-400">Zaryad ko'chishi (Charge Transfer, CT)</strong> — 
              koordinatsion birikmalarda elektronning bir molekulyar orbitaldan boshqasiga 
              ko'chishi natijasida yuzaga keladigan elektron o'tish. CT o'tishlar 
              <strong> d−d o'tishlardan tubdan farq qiladi</strong> — ular Laporte bo'yicha 
              ruxsat etilgan, intensivligi yuqori (ε ≈ 10³−10⁵) va erituvchi qutbliligiga kuchli bog'liq.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center text-xs mt-3">
              <div className="bg-purple-900/50 rounded p-3">
                <p className="text-lime-400 font-bold text-lg">10³−10⁵</p>
                <p className="text-purple-300">Molyar so'nish (ε)</p>
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <p className="text-lime-400 font-bold text-lg">UV-Vis-NIR</p>
                <p className="text-purple-300">Spektral soha</p>
              </div>
              <div className="bg-purple-900/50 rounded p-3">
                <p className="text-lime-400 font-bold text-lg">100-1000×</p>
                <p className="text-purple-300">d−d dan intensivroq</p>
              </div>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold">CT o'tish turlari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { code: "LMCT", name: "Ligand → Metall", desc: "π/σ-donor ligandlardan yuqori oksidlanish darajasidagi metall d-orbitallariga", color: "text-red-400", link: "/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" },
                { code: "MLCT", name: "Metall → Ligand", desc: "To'ldirilgan metall d-orbitallardan π-akseptor ligand π* orbitallariga", color: "text-blue-400", link: "/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" },
                { code: "MMCT", name: "Metall → Metall", desc: "Ko'prik ligand orqali bir metall markazidan ikkinchisiga", color: "text-purple-400", link: "/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" },
                { code: "IVCT", name: "Intervalent CT", desc: "Aralash valentli komplekslarda Mⁿ⁺ → M⁽ⁿ⁺¹⁾⁺ ko'chishi", color: "text-pink-400", link: "/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" },
                { code: "XLCT", name: "Ligand → Ligand", desc: "Ditiolen/diimin komplekslarida L₁(π) → L₂(π*) ko'chishi", color: "text-green-400" },
              ].map((item, i) => (
                <Link key={i} href={item.link || "#"} className="bg-purple-900/50 rounded-lg p-3 hover:bg-purple-800/50 transition-colors">
                  <p className={`font-bold ${item.color}`}>{item.code} — {item.name}</p>
                  <p className="text-xs text-purple-400 mt-1">{item.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {tab === "energetika" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold">CT energetik diagrammasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4 text-center">
                <p className="text-red-400 font-bold">LMCT</p>
                <p className="text-purple-300 mt-2">Ligand π/σ → Metall d</p>
                <p className="text-purple-400 mt-1">hν = E(d) − E(L)</p>
                <p className="text-purple-400">Oksidlanish darajasi ↑ → E↓</p>
              </div>
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-blue-400 font-bold">MLCT</p>
                <p className="text-purple-300 mt-2">Metall d → Ligand π*</p>
                <p className="text-purple-400 mt-1">hν = E(π*) − E(d)</p>
                <p className="text-purple-400">Oksidlanish darajasi ↓ → E↓</p>
              </div>
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
                <p className="text-purple-400 font-bold">IVCT</p>
                <p className="text-purple-300 mt-2">M₁(d) → M₂(d)</p>
                <p className="text-purple-400 mt-1">hν = λ (qayta tashkilanish)</p>
                <p className="text-purple-400">H_ab kuchli → E↓</p>
              </div>
            </div>
          </div>
        )}

        {tab === "tarix" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-lime-400 font-bold">CT spektroskopiyasi tarixi</h4>
            <div className="space-y-2 text-xs">
              {[
                { year: "1940-yillar", text: "CT tushunchasi birinchi marta Mulliken tomonidan taklif qilindi (Nobel 1966)" },
                { year: "1954", text: "Taube — Creutz-Taube ioni sintezi, IVCT kashfiyoti (Nobel 1983)" },
                { year: "1967", text: "Robin va Day — aralash valentli komplekslar klassifikatsiyasi (I, II, III sinf)" },
                { year: "1970-yillar", text: "[Ru(bpy)₃]²⁺ MLCT fotofizikasi — quyosh energiyasi konversiyasi uchun asos" },
                { year: "1990-yillar", text: "DSSC (Grätzel yacheykasi) — MLCT orqali TiO₂ ga elektron injeksiyasi" },
                { year: "2010+", text: "TADF, OLED, fotoredoks kataliz — MLCT qo'zg'algan holatlarning yangi qo'llanilishi" },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-lime-400 font-mono w-20 shrink-0">{item.year}</span>
                  <span className="text-purple-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// CT vs d-d TAQQOSLASH INTERAKTIV JADVALI
// ============================================================================
function CTvsDD() {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">⚖️ CT vs d−d o'tishlar — batafsil taqqoslash</h3>
      
      <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-purple-700/50">
                <th className="text-left py-3 px-3 text-yellow-400">Parametr</th>
                <th className="text-left py-3 px-3 text-lime-400">CT o'tishlar</th>
                <th className="text-left py-3 px-3 text-amber-400">d−d o'tishlar</th>
              </tr>
            </thead>
            <tbody className="text-purple-200">
              {[
                ["Intensivlik (ε, M⁻¹sm⁻¹)", "10³ − 10⁵", "0.1 − 100 (ba'zan 500)"],
                ["Laporte ruxsati", "Ruxsat etilgan", "Taqiqlangan (vibronik)"],
                ["Yarim kenglik (Δν₁/₂, sm⁻¹)", "3 000 − 5 000 (keng)", "1 000 − 2 000 (tor)"],
                ["Erituvchi ta'siri", "Kuchli (solvatoxromizm)", "Juda kuchsiz"],
                ["Temperatura ta'siri", "Kuchsiz (keng polosa)", "Kuchli (termal kengayish, tor polosa)"],
                ["O'tish mexanizmi", "Bir markazlararo (LMCT/MLCT) yoki markazlararo (IVCT)", "Faqat bir markaz ichida"],
                ["O'tish ehtimoli (f)", "~0.1 − 1", "~10⁻³ − 10⁻⁵"],
                ["Molar so'nish (ε_max)", "~10⁴", "~10"],
                ["Energiya sohasi", "UB − Vis (ba'zan NIR)", "Vis − NIR"],
                ["Molekulyar orbital nazariyasi", "Asosiy tushuntirish", "Ligand maydon nazariyasi"],
                ["O'tishga sabab", "Elektron zichlikning fazoviy qayta taqsimlanishi", "d-orbitallar orasidagi energiya farqi"],
                ["Qo'llanilishi", "Fotokataliz, OLED, sensorlar, DSSC", "Rang, magnitlik, geometriya"],
              ].map((row, i) => (
                <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                  <td className="py-2 px-3"><strong>{row[0]}</strong></td>
                  <td className="py-2 px-3 text-lime-300">{row[1]}</td>
                  <td className="py-2 px-3 text-amber-300">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// ASOSIY SAHIFA
// ============================================================================
export default function ZaryadKochishi() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex flex-col gap-2 px-6 py-4 border-b border-purple-800/50">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-purple-400 hover:text-purple-300">🏠</Link>
          <span className="text-purple-600">›</span>
          <Link href="/ilmiy/chuqurlashgan" className="text-purple-400 hover:text-purple-300">Chuqurlashgan</Link>
          <span className="text-purple-600">›</span>
          <span className="text-purple-300">Zaryad ko'chishi</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-lime-400">💫 Zaryad ko'chishi spektrlari</h1>
          <p className="text-purple-400 text-sm">MLCT • LMCT • MMCT • IVCT • XLCT • Solvatoxromizm</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Zaryad ko'chishi spektrlari haqida</h2>
          
          <div className="bg-lime-600/10 border border-lime-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-lime-400">Zaryad ko'chishi (Charge Transfer, CT) spektrlari</strong> — 
              koordinatsion birikmalarda elektronning <strong className="text-lime-400">metall va ligand o'rtasida</strong> yoki 
              <strong className="text-lime-400">ikki metall markazi o'rtasida</strong> ko'chishi natijasida 
              yuzaga keladigan yutilish spektrlari. CT o'tishlar <strong>d−d o'tishlardan ancha intensiv</strong> 
              (ε ≈ 10³−10⁵ M⁻¹sm⁻¹) bo'lib, ular kompleksning <strong>yorqin rangini</strong> ta'minlaydi.
              CT spektrlari <strong>ruxsat etilgan</strong> (Laporte ruxsati) o'tishlardir — shuning uchun 
              ular d−d o'tishlarga nisbatan 100−1000 marta intensivroq. CT o'tishlar 
              <strong>erituvchi qutbliligiga kuchli bog'liq</strong> (solvatoxromizm) — 
              bu ularni d−d o'tishlardan ajratib turadigan muhim diagnostik belgidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-lime-400 font-bold mb-3">CT o'tish turlari</h3>
              <div className="space-y-2 text-xs">
                {[
                  { code: "LMCT", desc: "Ligand → Metall. Yuqori oksidlanish darajasidagi metallar (MnO₄⁻, CrO₄²⁻)", color: "text-red-400" },
                  { code: "MLCT", desc: "Metall → Ligand. Past oksidlanish darajasi + π-akseptorlar ([Ru(bpy)₃]²⁺)", color: "text-blue-400" },
                  { code: "MMCT", desc: "Metall → Metall. Ko'prik ligand orqali, ko'p yadroli komplekslar", color: "text-purple-400" },
                  { code: "IVCT", desc: "Intervalent CT. Aralash valentli komplekslar (Prussiya ko'ki)", color: "text-pink-400" },
                  { code: "XLCT", desc: "Ligand → Ligand. Ditiolen/diimin komplekslarida", color: "text-green-400" },
                ].map((item, i) => (
                  <div key={i} className="bg-purple-900/50 rounded p-2">
                    <span className={`font-bold ${item.color}`}>{item.code}:</span>{" "}
                    <span className="text-purple-300">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-lime-400 font-bold mb-3">Nima uchun CT muhim?</h3>
              <ul className="text-purple-200 text-sm space-y-2">
                <li>• <strong>Rang manbai:</strong> Ko'pchilik yorqin rangli komplekslarning rangi CT o'tishlardan (MnO₄⁻, [Ru(bpy)₃]²⁺)</li>
                <li>• <strong>Fotokataliz:</strong> MLCT qo'zg'algan holat — quyosh energiyasini kimyoviy energiyaga aylantiradi</li>
                <li>• <strong>Sensorlar:</strong> CT o'tishlarning analitga sezgirligi</li>
                <li>• <strong>OLED:</strong> Ir, Pt komplekslarda MLCT — yorug'lik emissiyasi</li>
                <li>• <strong>Elektron tashish:</strong> IVCT — molekulyar simlar va qurilmalar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* MAVZULAR KARTALARI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📂 Bo'limlar</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" 
              className="bg-purple-800/40 border border-red-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🔴</div>
              <h3 className="text-red-400 font-bold group-hover:text-red-300">LMCT — Ligand → Metall</h3>
              <p className="text-purple-300 text-xs mt-2">
                π-donor ligandlar • Yuqori oksidlanish darajasi • Tetraedrik vs oktaedrik • Donor kuchi qatori
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct" 
              className="bg-purple-800/40 border border-blue-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🔵</div>
              <h3 className="text-blue-400 font-bold group-hover:text-blue-300">MLCT — Metall → Ligand</h3>
              <p className="text-purple-300 text-xs mt-2">
                π-akseptor ligandlar • Past oksidlanish darajasi • Fotofizika • Fotokataliz
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/ivct" 
              className="bg-purple-800/40 border border-purple-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🟣</div>
              <h3 className="text-purple-400 font-bold group-hover:text-purple-300">IVCT & MMCT</h3>
              <p className="text-purple-300 text-xs mt-2">
                Aralash valentli komplekslar • Robin-Day • Prussiya ko'ki • Creutz-Taube ioni
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/solvatoxromizm" 
              className="bg-purple-800/40 border border-cyan-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🧪</div>
              <h3 className="text-cyan-400 font-bold group-hover:text-cyan-300">Solvatoxromizm</h3>
              <p className="text-purple-300 text-xs mt-2">
                Erituvchi ta'siri • Gipsoxrom vs batroxrom • Diagnostik ahamiyati • DSSC
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/d-d-vs-ct" 
              className="bg-purple-800/40 border border-amber-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">⚖️</div>
              <h3 className="text-amber-400 font-bold group-hover:text-amber-300">d−d vs CT taqqoslash</h3>
              <p className="text-purple-300 text-xs mt-2">
                12 parametr bo'yicha solishtirish • Laporte ruxsati • Tanlash qoidalari
              </p>
            </Link>

            <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/mlct/fotofizika" 
              className="bg-purple-800/40 border border-green-700/30 rounded-xl p-5 hover:bg-purple-700/50 transition-colors group">
              <div className="text-3xl mb-2">🌈</div>
              <h3 className="text-green-400 font-bold group-hover:text-green-300">MLCT Fotofizikasi</h3>
              <p className="text-purple-300 text-xs mt-2">
                Qo'zg'algan holatlar • Lyuminessensiya • SOC • TADF • Quyosh energetikasi
              </p>
            </Link>
          </div>
        </div>

        {/* INTERAKTIV SLAYDERLAR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CTTanishuv />
        </div>

        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <CTvsDD />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-lime-600/10 to-purple-600/10 border border-lime-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>CT o'tishlar — <strong className="text-lime-400">d−d o'tishlardan 100−1000 marta intensivroq</strong>, Laporte ruxsat etilgan</li>
            <li>5 ta asosiy tur: <strong className="text-lime-400">LMCT, MLCT, MMCT, IVCT, XLCT</strong></li>
            <li>CT spektrlari <strong className="text-lime-400">erituvchi qutbliligiga kuchli bog'liq</strong> (solvatoxromizm) — diagnostik belgi</li>
            <li>MLCT qo'zg'algan holatlari — <strong className="text-lime-400">fotokataliz, OLED, quyosh energetikasi</strong> uchun asos</li>
            <li>IVCT — <strong className="text-lime-400">Robin-Day klassifikatsiyasi</strong> bo'yicha elektron delokalizatsiyasi darajasini aniqlaydi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Chuqurlashgan</Link>
          <Link href="/ilmiy/chuqurlashgan/zaryad-kochishi/lmct" className="px-6 py-3 bg-lime-600/80 rounded-xl hover:bg-lime-500 text-white font-semibold">LMCT →</Link>
        </div>

      </section>
    </main>
  )
}