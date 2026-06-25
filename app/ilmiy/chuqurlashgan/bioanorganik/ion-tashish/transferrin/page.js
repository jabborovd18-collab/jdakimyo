"use client"

import Link from "next/link"
import { useState } from "react"

function TransferrinSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "struktura", label: "🧬 Struktura" },
          { key: "kb", label: "⚛️ KB aloqasi" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-cyan-600/80 text-white" 
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
            <h4 className="text-cyan-400 font-bold">Transferrin sikli — Fe³⁺ ni hujayraga yetkazish</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">To'liq sikl:</p>
              <ol className="text-xs space-y-2 list-decimal list-inside">
                <li><strong>Qonda:</strong> Apo-Tf (temirsiz) + 2Fe³⁺ + 2CO₃²⁻ → <strong>Holo-Tf (Fe³⁺ bog'langan)</strong></li>
                <li><strong>TfR bilan bog'lanish:</strong> Holo-Tf TfR1 ga bog'lanadi (K_d ~1 nM — yuqori yaqinlik)</li>
                <li><strong>Endotsitoz:</strong> Tf-TfR kompleksi klatrin qoplagan pufakchada hujayra ichiga kiradi</li>
                <li><strong>Endosoma:</strong> pH 7.4 → 5.5 pasayadi — <strong>Fe³⁺ ajraladi!</strong></li>
                <li><strong>Fe³⁺ reduksiyasi:</strong> STEAP3 reduktaza Fe³⁺ → <strong>Fe²⁺</strong> (DMT1 orqali sitoplazmaga)</li>
                <li><strong>Apo-Tf qaytadi:</strong> pH=5.5 da Apo-Tf TfR ga bog'lanib qoladi (qaytish uchun)</li>
                <li><strong>Eksotsitoz:</strong> Apo-Tf-TfR kompleksi membrana ga qaytadi</li>
                <li><strong>pH=7.4 da:</strong> Apo-Tf TfR dan ajraladi — <strong>yangi siklga tayyor!</strong></li>
              </ol>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-cyan-400 font-bold">Transferrin — "ikki lobli" oqsil</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Strukturaviy tuzilish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>~80 kDa</strong> — glikoprotein (679 aminokislota)</li>
                  <li>• <strong>Ikki lob:</strong> N-lob (N-terminal) + C-lob (C-terminal)</li>
                  <li>• <strong>Har bir lob:</strong> 1 ta Fe³⁺ bog'lash joyi</li>
                  <li>• <strong>Jami:</strong> 2 ta Fe³⁺ / 1 molekula Tf</li>
                  <li>• Loblar orasida <strong>~40 Å</strong> masofa</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe³⁺ bog'lash joyi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ligandlar:</strong> 2×Tyr (fenolat), 1×His (imidazol), 1×Asp (karboksilat)</li>
                  <li>• <strong>+ CO₃²⁻ (karbonat):</strong> bidentat ko'prik — <strong>sine qua non!</strong></li>
                  <li>• <strong>Geometriya:</strong> buzilgan oktaedr (6-koordinatsion)</li>
                  <li>• <strong>Karbonat bo'lmasa:</strong> Fe³⁺ <strong>umuman bog'lanmaydi!</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-cyan-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Fe³⁺ — d⁵, yuqori spinli</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁵ konfiguratsiya:</strong> S=5/2, paramagnit, EPR signali g≈4.3</li>
                  <li>• <strong>CFSE=0:</strong> geometriya ligandlar bilan belgilanadi</li>
                  <li>• <strong>Oktaedrik:</strong> 4 oqsil ligand + 2 karbonat O atomi</li>
                  <li>• <strong>Fe−O(Tyr) masofalari:</strong> ~1.9-2.0 Å</li>
                  <li>• <strong>Fe−O(CO₃²⁻) masofalari:</strong> ~2.0-2.1 Å</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Karbonat — "sinergik anion"</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>CO₃²⁻ — bidentat ligand:</strong> Fe³⁺ ga 2 ta O atomi bilan bog'lanadi</li>
                  <li>• <strong>Qattiq asos (HSAB):</strong> Fe³⁺ (qattiq kislota) — mos keladi</li>
                  <li>• <strong>Karbonatsiz:</strong> Fe³⁺ yaqinligi <strong>10⁶ marta kam!</strong></li>
                  <li>• <strong>Arg124, Thr120:</strong> karbonatni H-bog'lar bilan ushlab turadi</li>
                  <li>• <strong>Fiziologik ahamiyati:</strong> qonda HCO₃⁻ (~25 mM) — doimo mavjud</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">pH-sezgirlik — konformatsion o'zgarish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>pH=7.4 (qon):</strong> Fe³⁺ mustahkam bog'langan (K_d ~10⁻²² M!)</li>
                  <li>• <strong>pH=5.5 (endosoma):</strong> protonatsiya → Fe³⁺ ajraladi</li>
                  <li>• <strong>Tyr, His, Asp</strong> protonlanadi — ligandlar zaiflashadi</li>
                  <li>• Karbonat: CO₃²⁻ + H⁺ → HCO₃⁻ — endi bidentat bog'lay olmaydi</li>
                  <li>• <strong>Konformatsion o'zgarish:</strong> loblar ochiladi, Fe³⁺ chiqadi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Saraton targeting — "troya oti"</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>TfR1 retseptori:</strong> saraton hujayralarida <strong>100-1000× ko'p!</strong></li>
                  <li>• Fe ga ehtiyoj yuqori — DNK sintezi, ribonukleotid reduktaza</li>
                  <li>• <strong>Tf-dori konjugatlari:</strong> Tf ga dori bog'lanadi — selektiv targeting</li>
                  <li>• Ru³⁺, Ga³⁺ — Tf orqali saraton hujayralariga kiradi</li>
                  <li>• <strong>"Troya oti":</strong> Tf "sovg'a" — ichida dori yoki radioizotop</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Transferrin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/ca-nasos" className="text-purple-400 hover:text-purple-300 text-lg">← Ca²⁺ nasoslari</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">🩸 Transferrin</h1>
          <p className="text-purple-400 text-sm">Fe³⁺ tashish • Karbonat ko'prigi • Endotsitoz • Saraton targeting</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Transferrin — temir tashuvchi oqsil</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Transferrin (Tf)</strong> — 
              qon plazmasidagi <strong>asosiy Fe³⁺ tashuvchi oqsil</strong> 
              (~80 kDa, 679 aminokislota). Har bir Tf molekulasi 
              <strong> 2 ta Fe³⁺ ionini</strong> juda yuqori yaqinlik bilan bog'laydi 
              (K_d ~10⁻²² M — bu deyarli qaytmas!). 
              <strong className="text-yellow-400">Karbonat anioni (CO₃²⁻)</strong> 
              sinergik ligand sifatida <strong>majburiy ishtirok etadi</strong> — 
              karbonatsiz Fe³⁺ umuman bog'lanmaydi. Tf hujayra ichiga 
              <strong> TfR1 retseptori</strong> orqali <strong>endotsitoz</strong> bilan kiradi.
              Saraton hujayralarida TfR1 <strong>100-1000 marta ko'p</strong> — 
              bu <strong>dori targeting</strong> uchun ishlatiladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">10⁻²² M</p>
              <p className="text-purple-300">Fe³⁺ ga yaqinlik (K_d)</p>
              <p className="text-purple-400 mt-1">
                Deyarli qaytmas bog'lanish! pH=7.4 da Fe³⁺ mustahkam ushlanadi.
                pH=5.5 da ajraladi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">CO₃²⁻</p>
              <p className="text-purple-300">Sinergik anion</p>
              <p className="text-purple-400 mt-1">
                Karbonat — bidentat ko'prik ligand. Karbonatsiz Fe³⁺ bog'lanmaydi!
                Qonda HCO₃⁻ ~25 mM.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">100-1000×</p>
              <p className="text-purple-300">Saraton da TfR1 ko'payishi</p>
              <p className="text-purple-400 mt-1">
                Saraton hujayralari Fe ga o'ta muhtoj. TfR1 — dori targeting uchun target.
              </p>
            </div>
          </div>
        </div>

        {/* STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧬 Transferrin strukturasi — "ikki lobli" arxitektura</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Transferrin <strong className="text-yellow-400">ikkita gomolog lobdan</strong> iborat:
              N-lob (1-332 qoldiqlar) va C-lob (333-679 qoldiqlar). Har bir lob 
              <strong> ikkita domen</strong> ga bo'lingan (N1/N2 va C1/C2). 
              Fe³⁺ <strong>domenlararo yoriqda</strong> joylashgan. 
              Fe³⁺ bog'langanda loblar <strong>"yopiq" konformatsiyada</strong>,
              Fe³⁺ ajralganda — <strong>"ochiq"</strong>. Bu — 
              <strong> pH-ga bog'liq konformatsion o'zgarish</strong> mexanizmi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">Fe³⁺ koordinatsion muhiti</p>
              <ul className="space-y-0.5">
                <li>• <strong>2×Tyr (fenolat O⁻):</strong> Tyr95, Tyr188 — kuchli donor</li>
                <li>• <strong>1×His (imidazol N):</strong> His249 — N-donor</li>
                <li>• <strong>1×Asp (karboksilat O⁻):</strong> Asp63 — O-donor</li>
                <li>• <strong>CO₃²⁻ (bidentat):</strong> 2 ta O atomi — ko'prik ligand</li>
                <li>• <strong>Jami:</strong> 6-koordinatsion, buzilgan oktaedr</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">Karbonat — "sine qua non"</p>
              <ul className="space-y-0.5">
                <li>• <strong>CO₃²⁻</strong> Fe³⁺ ga bidentat bog'lanadi (2 O atomi)</li>
                <li>• <strong>Arg124, Thr120:</strong> karbonatni H-bog'lar bilan ushlaydi</li>
                <li>• <strong>Karbonatsiz:</strong> Fe³⁺ yaqinligi 10⁶ marta kamayadi</li>
                <li>• <strong>Fiziologik:</strong> HCO₃⁻ ~25 mM qonda — doimo mavjud</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <TransferrinSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Transferrin — <strong className="text-cyan-400">2 ta Fe³⁺ bog'laydi</strong>, K_d ~10⁻²² M (qaytmas!), TfR1 orqali endotsitoz</li>
            <li><strong className="text-cyan-400">Karbonat (CO₃²⁻) — sinergik anion:</strong> bidentat ko'prik, karbonatsiz Fe³⁺ bog'lanmaydi</li>
            <li><strong className="text-cyan-400">pH-sezgirlik:</strong> pH=7.4 da bog'lanadi, pH=5.5 (endosoma) da ajraladi — konformatsion o'zgarish</li>
            <li>Fe³⁺ koordinatsion muhiti: <strong className="text-cyan-400">2Tyr + 1His + 1Asp + CO₃²⁻</strong> — oktaedrik geometriya</li>
            <li><strong className="text-cyan-400">Saraton targeting:</strong> TfR1 100-1000× ko'p saraton hujayralarida — dori konjugatlari uchun</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish/ca-nasos" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ca²⁺ nasoslari</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/bioilhomlantirilgan" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Bioilhomlantirilgan →</Link>
        </div>

      </section>
    </main>
  )
}