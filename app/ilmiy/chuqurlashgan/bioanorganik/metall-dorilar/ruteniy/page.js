"use client"

import Link from "next/link"
import { useState } from "react"

function RuteniySlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "turlari", label: "📋 Turlari" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "afzallik", label: "⭐ Afzalliklari" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-amber-600/80 text-white" 
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
            <h4 className="text-amber-400 font-bold">"Aktivatsiya qaytarilish orqali" — noyob mexanizm</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Ru³⁺ → Ru²⁺ aktivatsiyasi:</p>
              <ol className="text-xs space-y-2 list-decimal list-inside">
                <li><strong>Yuborilgan shakl:</strong> Ru³⁺ (d⁵, LS) — kinetik inert, barqaror</li>
                <li><strong>Qonda tashilishi:</strong> Transferrin oqsili bilan bog'lanadi (Fe³⁺ o'rniga Ru³⁺)</li>
                <li><strong>Saraton to'qimasida:</strong> Gipoksiya (O₂ kam) + yuqori GSH — <strong>qaytaruvchi muhit</strong></li>
                <li><strong>Ru³⁺ → Ru²⁺ qaytariladi:</strong> Ru²⁺ (d⁶, LS) — <strong>labillashadi</strong> (inertlik yo'qoladi)</li>
                <li><strong>Ligand almashinishi:</strong> Ru²⁺ DNK bilan bog'lanadi, oqsillar bilan reaksiyaga kirishadi</li>
                <li><strong>Sog'lom to'qimalarda:</strong> O₂ ko'p — Ru³⁺ holatda qoladi, nofaol!</li>
              </ol>
              <p className="text-xs mt-2 text-amber-300">
                <strong>Bu — "aktivatsiya qaytarilish orqali" strategiyasi.</strong> 
                Sisplatindan farqli: sisplatin gidroliz orqali, Ru komplekslari qaytarilish orqali faollashadi.
              </p>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Ru komplekslarining asosiy turlari</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Dori</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Formula</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Ru oksidlanish darajasi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Geometriya</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Holati</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["NAMI-A", "[ImH][RuCl₄(DMSO)(Im)]", "Ru³⁺ (d⁵)", "Oktaedr", "Klinik sinov (faza II)"],
                    ["KP1019", "[InH][RuCl₄(In)₂]", "Ru³⁺ (d⁵)", "Oktaedr", "Klinik sinov (faza I)"],
                    ["RM175 (RAED-C)", "[(η⁶-bifenil)Ru(en)Cl]⁺", "Ru²⁺ (d⁶)", "Piano-taburetka", "Preklinik"],
                    ["RAPTA-C", "[(η⁶-p-simen)Ru(PTA)Cl₂]", "Ru²⁺ (d⁶)", "Piano-taburetka", "Preklinik (antimetastatik)"],
                    ["TLD-1433", "[Ru(dppn)₂(bpy)]²⁺", "Ru²⁺ (d⁶)", "Oktaedr", "Fotodinamik terapiya (faza II)"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-amber-400">{row[0]}</strong></td>
                      <td className="py-2 px-3 font-mono">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                      <td className="py-2 px-3">{row[4]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ru³⁺ vs Ru²⁺ — inertlik farqi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ru³⁺ (d⁵, LS):</strong> t₂g⁵ — <strong>kinetik inert</strong>, ligand almashinishi sekin (soatlar/kunlar)</li>
                  <li>• <strong>Ru²⁺ (d⁶, LS):</strong> t₂g⁶ — <strong>kinetik labil</strong>, ligand almashinishi tez (minutlar)</li>
                  <li>• <strong>Sababi:</strong> d⁶ LS da t₂g to'lgan, CFSE katta — lekin d⁵ LS da ham CFSE katta</li>
                  <li>• <strong>Asl sabab:</strong> zaryad farqi — Ru³⁺ yuqori zaryad, M−L bog'i kuchliroq</li>
                  <li>• Ru³⁺/Ru²⁺ redoks potensiali: <strong>~0 V dan −0.5 V gacha</strong> (ligandga bog'liq)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">"Piano-taburetka" geometriyasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>RM175/RAPTA:</strong> Ru²⁺ ga <strong>η⁶-aren</strong> (π-bog'langan benzol/p-simen)</li>
                  <li>• <strong>3 ta "oyoq":</strong> 2×Cl⁻ + N (en/PTA) yoki 1×Cl⁻ + N + N</li>
                  <li>• <strong>Organometallik bog':</strong> Ru−aren (η⁶) — barqaror, gidrofob "qalpoq"</li>
                  <li>• <strong>Gidrofob aren:</strong> membranadan o'tishni osonlashtiradi, DNK bilan interkalyatsiya</li>
                  <li>• <strong>HSAB:</strong> Ru²⁺ — yumshoq kislota, aren (π) — yumshoq asos, barqaror bog'</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Transferrin orqali tashish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Transferrin (Tf):</strong> Fe³⁺ tashuvchi oqsil — 2 ta bog'lash joyi</li>
                  <li>• <strong>Ru³⁺ Fe³⁺ ni "taqlid qiladi":</strong> o'xshash radius, zaryad, geometriya</li>
                  <li>• <strong>Saraton hujayralari:</strong> Tf retseptorlari ko'p (Fe ga ehtiyoj yuqori) — <strong>selektiv!</strong></li>
                  <li>• <strong>Endotsitoz:</strong> Tf-Ru kompleksi hujayra ichiga kiradi</li>
                  <li>• <strong>Ru³⁺ ajraladi:</strong> endosoma ichida pH past → Ru ajraladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fotodinamik terapiya (FDT)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>TLD-1433:</strong> Ru²⁺-polipiridil kompleks — fotosensibilizator</li>
                  <li>• <strong>Yorug'lik yutilishi:</strong> MLCT tasma ~450-550 nm</li>
                  <li>• <strong>¹O₂ generatsiyasi:</strong> triplet holat → O₂ ga energiya uzatadi → singlet kislorod</li>
                  <li>• <strong>¹O₂</strong> — o'ta reaktiv, hujayrani nobud qiladi</li>
                  <li>• <strong>Selektivlik:</strong> faqat yorug'lik tushgan joyda (o'sma sohasida)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "afzallik" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Ru dorilarining Pt ga nisbatan afzalliklari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">1. Boshqa rezistentlik profili</p>
                <p className="text-xs">Sisplatinga rezistent o'smalarda faol. DNK reparatsiyasi orqali olib tashlanmaydi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">2. Kamroq nojo'ya ta'sir</p>
                <p className="text-xs">Transferrin orqali selektiv tashiladi — sog'lom to'qimalarga kam ta'sir.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">3. Antimetastatik faollik</p>
                <p className="text-xs">NAMI-A va RAPTA-C — metastazlarni ingibirlaydi (sisplatin faqat birlamchi o'smaga).</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">4. Ko'p funksiyalilik</p>
                <p className="text-xs">FDT, radio sensibilizatsiya, immun javob modulyatsiyasi — bir vaqtning o'zida bir necha mexanizm.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Ruteniy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/sisplatin" className="text-purple-400 hover:text-purple-300 text-lg">← Sisplatin</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">🟤 Ruteniy komplekslari</h1>
          <p className="text-purple-400 text-sm">Ru-aren • NAMI-A • KP1019 • Transferrin • Aktivatsiya qaytarilish orqali</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Ruteniy — platina dan keyingi avlod</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-amber-400">Ruteniy (Ru) komplekslari</strong> — 
              sisplatindan keyingi eng istiqbolli metall-dorilar. Ularning asosiy afzalligi:
              <strong> "aktivatsiya qaytarilish orqali"</strong> mexanizmi. 
              Ru³⁺ (inert) qonga yuboriladi, saraton to'qimasidagi gipoksik muhitda 
              <strong> Ru²⁺ ga qaytarilib faollashadi</strong>. 
              <strong> Transferrin oqsili</strong> orqali selektiv tashiladi — 
              saraton hujayralari transferrin retseptorlariga boy.
              <strong className="text-yellow-400">Organometallik Ru−aren (η⁶) bog'i</strong> — 
              "piano-taburetka" geometriyali komplekslar (RM175, RAPTA) 
              yangi avlod dorilari hisoblanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Ru³⁺ → Ru²⁺</p>
              <p className="text-purple-300">Aktivatsiya qaytarilish orqali</p>
              <p className="text-purple-400 mt-1">
                Ru³⁺ (inert) → Ru²⁺ (labil). Faqat gipoksik saraton to'qimasida faollashadi.
                Sog'lom to'qimalarda Ru³⁺ saqlanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">η⁶-aren</p>
              <p className="text-purple-300">Organometallik bog'</p>
              <p className="text-purple-400 mt-1">
                Ru−aren π-bog'i — gidrofob "qalpoq". Membranadan o'tishni osonlashtiradi.
                DNK interkalyatsiyasi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-amber-400 font-bold text-lg">Transferrin</p>
              <p className="text-purple-300">Selektiv tashish</p>
              <p className="text-purple-400 mt-1">
                Ru³⁺ Fe³⁺ ni taqlid qiladi. Saraton hujayralarida Tf retseptorlari ko'p.
                Tabiiy targeting!
              </p>
            </div>
          </div>
        </div>

        {/* NAMI-A */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 NAMI-A — birinchi Ru antimetastatik dori</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-amber-400">NAMI-A — [ImH][RuCl₄(DMSO)(Im)]</strong> 
              (imidazolium trans-tetraxlorido(dimetilsulfoksid)imidazolrutenat(III)).
              <strong> Ru³⁺ (d⁵, LS)</strong> — oktaedrik geometriya. 
              NAMI-A ning asosiy xususiyati — <strong>antimetastatik faollik</strong>:
              u birlamchi o'smani emas, balki <strong>metastazlarni</strong> ingibirlaydi.
              Bu — sisplatindan tubdan farq qiladigan yangi yondashuv.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-amber-400 font-bold mb-2">Ligandlar va geometriya</p>
              <ul className="space-y-0.5">
                <li>• <strong>4×Cl⁻</strong> — ekvatorial tekislikda (2 tasi labil)</li>
                <li>• <strong>DMSO (S-donor)</strong> — trans- Cl ga nisbatan (kuchli trans-ta'sir)</li>
                <li>• <strong>Imidazol (N-donor)</strong> — trans- DMSO ga</li>
                <li>• <strong>Oktaedrik</strong> — Ru³⁺, d⁵ LS, S=1/2, EPR faol</li>
                <li>• DMSO S-donor — trans- Cl⁻ ni labillashtiradi (faollashish uchun)</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-amber-400 font-bold mb-2">Ta'sir mexanizmi</p>
              <ul className="space-y-0.5">
                <li>• <strong>Gipoksiyada faollashadi:</strong> Ru³⁺ → Ru²⁺</li>
                <li>• <strong>Hujayra adgeziyasini bloklaydi:</strong> integrinlar bilan bog'lanadi</li>
                <li>• <strong>Angiogenez ingibitori:</strong> yangi qon tomirlar hosil bo'lishini to'xtatadi</li>
                <li>• <strong>DNK bilan bog'lanmaydi!</strong> (sisplatindan farq)</li>
                <li>• <strong>Oqsil-target:</strong> hujayra yuzasi va ekstrasellular matriks oqsillari</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <RuteniySlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Ru komplekslari — <strong className="text-amber-400">"aktivatsiya qaytarilish orqali"</strong>: Ru³⁺(inert) → Ru²⁺(labil) faqat saraton to'qimasida</li>
            <li><strong className="text-amber-400">Transferrin orqali tashish</strong> — Ru³⁺ Fe³⁺ ni taqlid qiladi, tabiiy selektivlik</li>
            <li><strong className="text-amber-400">Organometallik Ru−aren (η⁶)</strong> — "piano-taburetka" geometriyasi, gidrofob membranadan o'tish</li>
            <li>NAMI-A — <strong className="text-amber-400">antimetastatik</strong>, DNK bilan bog'lanmaydi (yangi mexanizm)</li>
            <li>TLD-1433 — <strong className="text-amber-400">fotodinamik terapiya</strong>, yorug'lik orqali faollashadi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/sisplatin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Sisplatin</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/oltin" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">Oltin →</Link>
        </div>

      </section>
    </main>
  )
}