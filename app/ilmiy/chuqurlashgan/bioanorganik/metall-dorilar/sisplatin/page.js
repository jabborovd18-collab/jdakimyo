"use client"

import Link from "next/link"
import { useState } from "react"

function SisplatinSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "aktivatsiya", label: "💧 Aktivatsiya" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "analoglar", label: "🧪 Analoglar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-yellow-600/80 text-white" 
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
            <h4 className="text-yellow-400 font-bold">DNK cross-link — apoptoz mexanizmi</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Ta'sir mexanizmi ketma-ketligi:</p>
              <ol className="text-xs space-y-2 list-decimal list-inside">
                <li><strong>Hujayraga kirish:</strong> Sisplatin passiv diffuziya yoki CTR1 mis transporteri orqali kiradi</li>
                <li><strong>Aktivatsiya:</strong> Cl⁻ konsentratsiyasi past hujayra ichida — gidroliz sodir bo'ladi</li>
                <li><strong>DNK bilan bog'lanish:</strong> Faol [Pt(NH₃)₂(H₂O)₂]²⁺ DNK dagi guanin N7 atomiga bog'lanadi</li>
                <li><strong>Cross-link hosil bo'lishi:</strong> Asosan <strong>1,2-intrastrend cross-link</strong> (qo'shni guaninlar orasida, ~65%)</li>
                <li><strong>DNK egilishi:</strong> DNK 30-40° ga egiladi, katta truba ochiladi</li>
                <li><strong>Oqsillar bog'lanishi:</strong> HMG-domain oqsillari Pt-DNK adduktini taniydi va bog'lanadi</li>
                <li><strong>DNK reparatsiyasi bloklanadi:</strong> NER (nukleotid eksizion reparatsiya) ingibirlanadi</li>
                <li><strong>Apoptoz:</strong> p53 faollashadi → sitoxrom c ajraladi → kaspazalar → hujayra o'limi</li>
              </ol>
            </div>
          </div>
        )}

        {tab === "aktivatsiya" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Aktivatsiya — gidroliz orqali faollashish</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Qonda (barqaror)</p>
                <p className="text-xs font-mono mb-1">[PtCl₂(NH₃)₂] — sisplatin</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Cl⁻ konsentratsiyasi: <strong>~100 mM</strong> (yuqori)</li>
                  <li>• Gidroliz <strong>deyarli sodir bo'lmaydi</strong></li>
                  <li>• Sisplatin <strong>neytral holda</strong> qoldi — hujayra membranasidan o'tadi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Hujayra ichida (faollashadi)</p>
                <p className="text-xs font-mono mb-1">[PtCl₂(NH₃)₂] + 2H₂O → [Pt(NH₃)₂(H₂O)₂]²⁺ + 2Cl⁻</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Cl⁻ konsentratsiyasi: <strong>~4 mM</strong> (past)</li>
                  <li>• <strong>Gidroliz sodir bo'ladi</strong> — Cl⁻ H₂O ga almashadi</li>
                  <li>• <strong>[Pt(NH₃)₂(H₂O)₂]²⁺</strong> — musbat zaryadli, faol shakl!</li>
                  <li>• DNK (manfiy) bilan <strong>elektrostatik tortiladi</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Pt²⁺ — d⁸, kvadrat tekislik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁸ konfiguratsiya:</strong> 4 ta d-orbitallar to'lgan, d_x²_y² bo'sh</li>
                  <li>• <strong>Kvadrat tekislik</strong> — d⁸ uchun xarakterli (kuchli maydon ligandlar)</li>
                  <li>• <strong>CFSE katta</strong> — barqaror geometriya</li>
                  <li>• <strong>Kinetik inertlik:</strong> d⁸ — ligand almashinishi juda sekin</li>
                  <li>• <strong>Trans-effekt:</strong> Cl⁻ trans- Cl⁻ ni labillashtiradi (sintezda muhim)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sis- va trans- izomeriya</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Sisplatin:</strong> [PtCl₂(NH₃)₂] — Cl va NH₃ lar <strong>yonma-yon</strong></li>
                  <li>• <strong>Transplatin:</strong> Cl va NH₃ lar <strong>qarama-qarshi</strong></li>
                  <li>• <strong>Faqat sisplatin faol!</strong> Transplatin DNK bilan cross-link hosil qila olmaydi</li>
                  <li>• <strong>Stereospesifiklik:</strong> geometriya biologik faollikni belgilaydi</li>
                  <li>• Bu — <strong>koordinatsion izomeriya</strong> ning farmakologik ahamiyati!</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ligand almashinishi kinetikasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Cl⁻ almashinishi:</strong> t₁/₂ ~2-3 soat (sekin)</li>
                  <li>• <strong>NH₃ almashinishi:</strong> deyarli sodir bo'lmaydi (inert)</li>
                  <li>• <strong>Nima uchun NH₃?</strong> Kuchli σ-donor, trans-ta'sir kuchsiz — kerakli geometriyani saqlaydi</li>
                  <li>• DNK N7 (guanin) bilan bog'lanish: t₁/₂ ~minutlar</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">HSAB va selektivlik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Pt²⁺ — <strong>yumshoq kislota</strong> (katta radius, qutblanuvchan)</li>
                  <li>• Guanin N7 — <strong>chegaraviy asos</strong></li>
                  <li>• Pt−N7 (guanin) — <strong>yumshoq-chegaraviy o'zaro ta'sir</strong>, selektiv</li>
                  <li>• S-donorlar (GSH, metallotionein) bilan bog'lanish — <strong>rezistentlik mexanizmi</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "analoglar" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Platina analoglari — ikkinchi va uchinchi avlod</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Dori</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Formula</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Yil</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Afzalligi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Kamchiligi</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Sisplatin", "[PtCl₂(NH₃)₂]", "1978", "Yuqori samaradorlik (moyak saratoni — 90%)", "Nefrotoksiklik, neyrotoksiklik"],
                    ["Karboplatin", "[Pt(CBDCA-κ²O,O')(NH₃)₂]", "1989", "Kam nefrotoksiklik", "Miyelosupressiya, kamroq samaradorlik"],
                    ["Oksaliplatin", "[Pt(oxalato-κ²O,O')(DACH)]", "2002", "Kolorektal saratonda faol, boshqa rezistentlik profili", "Neyrotoksiklik (sovuqqa sezgirlik)"],
                    ["Pikoplatin", "[PtCl₂(NH₃)(2-pikolin)]", "Klinik sinov", "Sisplatinga rezistent o'smalarda faol", "Hali tasdiqlanmagan"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-yellow-400">{row[0]}</strong></td>
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
      </div>
    </div>
  )
}

export default function Sisplatin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar" className="text-purple-400 hover:text-purple-300 text-lg">← Metall-dorilar</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">💎 Sisplatin</h1>
          <p className="text-purple-400 text-sm">Pt²⁺ • Kvadrat tekislik • DNK cross-link • Saratonga qarshi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Sisplatin — eng mashhur metall-dori</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Sisplatin — [PtCl₂(NH₃)₂]</strong> — 
              zamonaviy kimyoterapiyaning <strong>asosiy dorilaridan biri</strong>.
              1978-yilda FDA tomonidan tasdiqlangan birinchi platina asosidagi dori.
              Sisplatin <strong>moyak saratonida</strong> davolash ko'rsatkichini 
              10% dan <strong>90% gacha</strong> ko'targan! Ta'sir mexanizmi: 
              hujayra ichida <strong>gidrolizlanib faollashadi</strong> va 
              <strong> DNK bilan 1,2-intrastrend cross-link</strong> hosil qilib, 
              DNK replikatsiyasi va transkripsiyasini bloklaydi, natijada <strong>apoptoz</strong>.
              Sisplatin — <strong className="text-yellow-400">koordinatsion birikma</strong> sifatida
              geometriya, izomeriya va ligand almashinishi kabi KB tushunchalarining 
              farmakologik ahamiyatini ko'rsatadigan eng yorqin misoldir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Pt²⁺ (d⁸)</p>
              <p className="text-purple-300">Kvadrat tekislik</p>
              <p className="text-purple-400 mt-1">
                d⁸ konfiguratsiya — kinetik inertlik. Cl⁻ almashinishi sekin (soatlar).
                NH₃ deyarli almashinmaydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Sis-izo mer</p>
              <p className="text-purple-300">Geometrik izomeriya</p>
              <p className="text-purple-400 mt-1">
                Faqat sis-izomer faol! Transplatin DNK bilan cross-link hosil qila olmaydi.
                Stereospesifiklik.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">90%</p>
              <p className="text-purple-300">Moyak saratoni davolash</p>
              <p className="text-purple-400 mt-1">
                Sisplatingacha: ~10% omon qolish. Sisplatin bilan: ~90%.
                Onkologiyadagi eng katta muvaffaqiyatlardan biri.
              </p>
            </div>
          </div>
        </div>

        {/* TARIXIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📜 Sisplatin kashfiyoti — tasodifiy ochilish</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <div className="space-y-3 text-sm text-purple-200">
              {[
                { year: "1845", text: "Peyrone — sisplatin birinchi sintez qilindi (Peyrone xloridi)" },
                { year: "1893", text: "Werner — koordinatsion nazariya, sis- va trans- izomerlar farqi tushuntirildi" },
                { year: "1965", text: "Barnett Rosenberg — E. coli bakteriyasiga elektr maydon ta'sirini o'rgandi. Pt elektrodlaridan sisplatin hosil bo'lib, bakteriya bo'linishini ingibirladi!" },
                { year: "1969", text: "Rosenberg — sisplatin sichqonlarda saratonni davolashini ko'rsatdi" },
                { year: "1978", text: "FDA — sisplatinni moyak va tuxumdon saratoni uchun tasdiqladi" },
                { year: "hozir", text: "Sisplatin — JSST asosiy dorilar ro'yxatida. 80%+ moyak saratoni bemorlari davolanadi" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-yellow-400 font-mono text-sm w-16 shrink-0">{item.year}</span>
                  <span className="text-purple-200 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DNK BILAN BOG'LANISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 DNK bilan bog'lanish — koordinatsion kimyoning nozik tomonlari</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Sisplatin DNK dagi <strong className="text-yellow-400">guanin N7 atomiga</strong> 
              selektiv bog'lanadi. Asosiy mahsulot — <strong>1,2-intrastrend cross-link</strong>:
              ikkita qo'shni guanin asosi Pt orqali bog'lanadi. Bu DNK ni 
              <strong> 30-40° ga egadi</strong> va katta truba tomon ochiladi.
              HMG-domain oqsillari bu egilgan DNK ni <strong>"taniydi"</strong> va bog'lanib,
              NER reparatsiya tizimini bloklaydi — hujayra <strong>apoptozga</strong> uchraydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-bold text-lg">~65%</p>
              <p className="text-purple-300">1,2-intrastrend (GpG)</p>
              <p className="text-purple-400 mt-1">Qo'shni guaninlar orasidagi cross-link — asosiy mahsulot</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-bold text-lg">~25%</p>
              <p className="text-purple-300">1,2-intrastrend (ApG)</p>
              <p className="text-purple-400 mt-1">Adenin-guanin cross-link — ikkinchi darajali mahsulot</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4 text-center">
              <p className="text-yellow-400 font-bold text-lg">~5-10%</p>
              <p className="text-purple-300">Interstrend + boshqa</p>
              <p className="text-purple-400 mt-1">Zanjirlararo cross-link, monoadduktlar, oqsil-DNK cross-link</p>
            </div>
          </div>
        </div>

        {/* REZISTENTLIK */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🛡️ Rezistentlik — asosiy muammo</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-5">
            <p className="text-purple-200 text-sm mb-3">
              Sisplatinga <strong className="text-yellow-400">rezistentlik</strong> — 
              kimyoterapiyaning asosiy muammosi. Hujayralar bir necha mexanizm orqali 
              sisplatinga chidamli bo'lib qoladi:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">1. DNK reparatsiyasi kuchayishi</p>
                <p className="text-purple-200">NER (ERCC1) — Pt-DNK adduktlarini kesib tashlaydi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">2. Detoksifikatsiya</p>
                <p className="text-purple-200">Glutation (GSH), metallotionein — Pt ni bog'lab nofaollashtiradi (Pt−S bog').</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">3. Chiqarib yuborish</p>
                <p className="text-purple-200">ATP7B, MRP2 — Pt ni hujayradan tashqariga pompalaydi.</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold mb-1">4. Apoptozdan qochish</p>
                <p className="text-purple-200">p53 mutatsiyasi, Bcl-2 yuqori ekspressiyasi — apoptoz signali bloklanadi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SisplatinSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Sisplatin — <strong className="text-yellow-400">[PtCl₂(NH₃)₂], Pt²⁺ (d⁸) kvadrat tekislik</strong> — eng muhim metall-dori</li>
            <li><strong className="text-yellow-400">Prodori → faol shakl:</strong> Cl⁻ gidrolizi orqali [Pt(NH₃)₂(H₂O)₂]²⁺ — faqat hujayra ichida</li>
            <li>DNK da <strong className="text-yellow-400">1,2-intrastrend cross-link</strong> — guanin N7 atomlari orasida, DNK egiladi</li>
            <li><strong className="text-yellow-400">Sis- vs trans- izomeriya</strong> — faqat sisplatin faol, geometriya hal qiluvchi!</li>
            <li>Asosiy muammo — <strong className="text-yellow-400">rezistentlik</strong> (DNK reparatsiyasi, GSH detoksifikatsiyasi)</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Metall-dorilar</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/ruteniy" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Ruteniy →</Link>
        </div>

      </section>
    </main>
  )
}