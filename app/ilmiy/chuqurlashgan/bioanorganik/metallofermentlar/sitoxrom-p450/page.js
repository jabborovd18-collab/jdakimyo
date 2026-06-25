"use client"

import Link from "next/link"
import { useState } from "react"

function P450Slayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "sikl", label: "🔄 Katalitik sikl" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "dori", label: "💊 Dori metabolizmi" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-pink-600/80 text-white" 
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
            <h4 className="text-pink-400 font-bold">Monooksigenaza reaksiyasi — O₂ aktivatsiyasi</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Umumiy reaksiya:</p>
              <p className="text-xs font-mono text-center mb-3">R−H + O₂ + NADPH + H⁺ → R−OH + H₂O + NADP⁺</p>
              <p className="text-xs">
                P450 — <strong>monooksigenaza</strong>: O₂ ning bir atomi substratga qo'shiladi, 
                ikkinchisi suvga aylanadi. Bu <strong>gidroksillanish</strong> reaksiyasi.
                P450 shuningdek <strong>epoksidlanish, N-oksidlanish, S-oksidlanish, 
                dealkillanish</strong> kabi 20+ turdagi reaksiyalarni ham katalizlaydi.
              </p>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-2">Nima uchun P450 maxsus?</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <p className="text-pink-400 font-bold">S⁻ ligand</p>
                  <p className="text-purple-300">Sisteinat (Cys−S⁻) — kuchli elektron donor, Fe³⁺/Fe²⁺ potensialini pasaytiradi</p>
                </div>
                <div>
                  <p className="text-pink-400 font-bold">I birikma</p>
                  <p className="text-purple-300">Por•⁺−Fe⁴⁺=O — o'ta reaktiv, C−H bog'ini (~100 kkal/mol) uzadi</p>
                </div>
                <div>
                  <p className="text-pink-400 font-bold">450 nm</p>
                  <p className="text-purple-300">CO-Fe²⁺ kompleksi — Sore tasmasi 450 nm da (nomi shundan)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "sikl" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-pink-400 font-bold">Katalitik sikl — 8 bosqich</h4>
            <div className="space-y-2">
              {[
                ["1", "Dam olish holati", "Fe³⁺ (LS, S=1/2), H₂O 6-koordinatsion ligand. Substrat (R−H) yaqinlashadi."],
                ["2", "Substrat bog'lanishi", "R−H faol markazga kiradi, H₂O siqib chiqariladi. Fe³⁺ 5-koordinatsion (kvadrat piramida). Spin holati o'zgaradi: LS→HS (S=5/2)."],
                ["3", "1-e⁻ qaytarilish", "Fe³⁺ + e⁻ (NADPH, P450 reduktaza orqali) → Fe²⁺ (HS, S=2)."],
                ["4", "O₂ bog'lanishi", "Fe²⁺ + O₂ → Fe²⁺−O₂ (oksi kompleks)."],
                ["5", "2-e⁻ qaytarilish", "Fe²⁺−O₂ + e⁻ + H⁺ → Fe³⁺−OOH (gidroperokso kompleks)."],
                ["6", "O−O ajralishi", "Fe³⁺−OOH + H⁺ → Por•⁺−Fe⁴⁺=O (I birikma) + H₂O. O−O geterolitik ajraladi."],
                ["7", "Substrat gidroksillanishi", "Por•⁺−Fe⁴⁺=O + R−H → Por−Fe³⁺ + R−OH. C−H bog'i uziladi, OH qo'shiladi. 'Kislorod rebound' mexanizmi."],
                ["8", "Mahsulot ajralishi", "R−OH ajraladi, H₂O qayta bog'lanadi → dastlabki holatga qaytish."],
              ].map(([num, title, desc]) => (
                <div key={num} className="bg-purple-900/50 rounded-lg p-3">
                  <p className="text-pink-400 font-bold text-xs">
                    {num}-bosqich: {title}
                  </p>
                  <p className="text-xs mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-pink-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Tiolat (S⁻) ligand — P450 ning siri</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Cys−S⁻</strong> — sisteinat, kuchli σ-donor va π-donor</li>
                  <li>• <strong>Boshqa gem oqsillaridan farqi:</strong> Hb/Mb da His (N), katalazada Tyr (O⁻), P450 da Cys (S⁻)</li>
                  <li>• S⁻ — <strong>yumshoq asos</strong>, Fe³⁺/Fe²⁺ — chegaraviy kislotalar</li>
                  <li>• S⁻ donorligi <strong>Fe³⁺/Fe²⁺ redoks potensialini −0.3 V gacha pasaytiradi</strong></li>
                  <li>• Erkin Fe³⁺/Fe²⁺: +0.77 V; P450 da: −0.3 V — <strong>1 V farq!</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">I birikma — o'ta reaktiv oraliq modda</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Por•⁺−Fe⁴⁺=O</strong> — porfirin π-kation radikali + oksoferril</li>
                  <li>• Fe⁴⁺=O — <strong>Fe−O masofasi ~1.65 Å</strong> (qo'sh bog')</li>
                  <li>• <strong>Reaktivlik:</strong> C−H bog'ini (~400 kJ/mol) uzishga qodir</li>
                  <li>• I birikma umri: <strong>~ms</strong> — juda qisqa</li>
                  <li>• S⁻ ligand <strong>elektron push effekti</strong> — O−O ajralishini tezlashtiradi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Spin holat o'zgarishlari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Fe³⁺ (dam olish):</strong> LS, S=1/2 — EPR signali g=2.41, 2.26, 1.91</li>
                  <li>• <strong>Fe³⁺ + substrat:</strong> HS, S=5/2 — EPR signali g=8, 4, 1.8</li>
                  <li>• <strong>Fe²⁺:</strong> HS, S=2 — EPR signali yo'q (butun sonli spin)</li>
                  <li>• <strong>I birikma:</strong> S=1 (Fe⁴⁺, d⁴) + radikal — umumiy S=1/2</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">"Kislorod rebound" mexanizmi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Fe⁴⁺=O C−H bog'idan <strong>H atomini tortib oladi</strong></li>
                  <li>• Hosil bo'ladi: <strong>Fe³⁺−OH + •R (radikal)</strong></li>
                  <li>• •R radikali <strong>qayta OH ga bog'lanadi</strong> → R−OH</li>
                  <li>• "Rebound" — qaytish, sakrash: radikal qafas ichida qayta birikadi</li>
                  <li>• Bu mexanizm <strong>stereospesifik gidroksillanishni</strong> ta'minlaydi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "dori" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-pink-400 font-bold">P450 va dori metabolizmi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Inson P450 izoformalari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>57 ta gen</strong> — insonda P450 fermentlari oilasi</li>
                  <li>• <strong>CYP3A4:</strong> eng ko'p uchraydi (~30% jigar P450) — dorilarning ~50% ini metabolizlaydi</li>
                  <li>• <strong>CYP2D6:</strong> ~25% dorilar — kodein, antidepresantlar</li>
                  <li>• <strong>CYP2C9:</strong> varfarin, ibuprofen</li>
                  <li>• <strong>CYP1A2:</strong> kofein, teofillin</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Genetik polimorfizm</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>CYP2D6:</strong> populyatsiyada 4 ta fenotip — kuchsiz, o'rta, normal, o'ta tez metabolizm</li>
                  <li>• <strong>Kodein:</strong> CYP2D6 orqali morfinga aylanadi. Kuchsiz metabolizmda — ta'sir yo'q, o'ta tezda — toksik!</li>
                  <li>• <strong>Varfarin:</strong> CYP2C9 variantlari — dozani individual tanlash kerak</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SitoxromP450() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/gidrogenaza" className="text-purple-400 hover:text-purple-300 text-lg">← Gidrogenaza</Link>
        <div>
          <h1 className="text-2xl font-bold text-pink-400">💊 Sitoxrom P450</h1>
          <p className="text-purple-400 text-sm">Fe³⁺-gem • Tiolat (S⁻) ligand • Monooksigenaza • Dori metabolizmi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Sitoxrom P450 — universal monooksigenaza</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-pink-400">Sitoxrom P450 (CYP)</strong> — 
              <strong> tiolat (Cys−S⁻) ligandli</strong> noyob gem oqsili. 
              Asosiy reaksiyasi: <strong>R−H + O₂ + NADPH + H⁺ → R−OH + H₂O + NADP⁺</strong>.
              P450 — <strong>monooksigenaza</strong>: O₂ ning bir atomi substratga qo'shiladi, 
              ikkinchisi suvga aylanadi. Nomining kelib chiqishi: CO bilan Fe²⁺ kompleksining 
              Sore tasmasi <strong>450 nm</strong> da yutiladi (oddiy gem oqsillarida ~420 nm).
              P450 oilasi <strong>barcha tirik organizmlarda</strong> uchraydi — 
              bakteriyalardan odamgacha. Insonda <strong>57 ta</strong> P450 geni mavjud.
              <strong className="text-yellow-400">Tiolat ligand</strong> — 
              P450 ni boshqa gem oqsillaridan ajratib turadigan asosiy xususiyat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">Cys−S⁻</p>
              <p className="text-purple-300">Tiolat proksimal ligand</p>
              <p className="text-purple-400 mt-1">
                Kuchli elektron donor — Fe³⁺/Fe²⁺ redoks potensialini −0.3 V gacha pasaytiradi.
                P450 ni noyob qiladigan asosiy omil.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">450 nm</p>
              <p className="text-purple-300">CO-Fe²⁺ Sore tasmasi</p>
              <p className="text-purple-400 mt-1">
                Oddiy gem oqsillarida ~420 nm. 30 nm siljish — tiolat ligandining kuchli donorlik effekti.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-pink-400 font-bold text-lg">~50%</p>
              <p className="text-purple-300">Dorilar P450 orqali metabolizlanadi</p>
              <p className="text-purple-400 mt-1">
                CYP3A4 — eng muhim izoforma. Dorilarning yarim umri P450 faolligiga bog'liq.
              </p>
            </div>
          </div>
        </div>

        {/* TIOLAT LIGANDI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔑 Tiolat (Cys−S⁻) ligand — P450 ning siri</h2>
          
          <div className="bg-pink-600/10 border border-pink-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              P450 ni boshqa gem oqsillaridan ajratib turadigan <strong className="text-yellow-400">asosiy farq</strong> —
              proksimal ligand <strong>sisteinat (Cys−S⁻, tiolat)</strong>. Gemoglobin va mioglobinda 
              proksimal ligand — <strong>His (imidazol, N-donor)</strong>, katalazada — 
              <strong> Tyr (fenolat, O⁻-donor)</strong>, P450 da — <strong>Cys (tiolat, S⁻-donor)</strong>.
              S⁻ — eng kuchli elektron donor (σ-donor + π-donor). Bu Fe³⁺/Fe²⁺ redoks potensialini 
              <strong> keskin pasaytiradi</strong> va O₂ aktivatsiyasi uchun zarur bo'lgan 
              yuqori reaktiv <strong>I birikma</strong> hosil bo'lishini ta'minlaydi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-pink-400 font-bold text-sm mb-2">Elektron donorlik kuchi</p>
              <p className="text-purple-200">
                <strong>His (N) {'<'} Tyr (O⁻) {'<'} Cys (S⁻)</strong> — donorlik kuchi oshib boradi.
                S⁻ ning 3p orbitallari Fe 3d orbitallari bilan yaxshi qoplanadi.
                π-donorlik — elektron juftini Fe ga uzatadi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-pink-400 font-bold text-sm mb-2">Redoks potensialga ta'siri</p>
              <p className="text-purple-200">
                Erkin Fe³⁺/Fe²⁺: <strong>+0.77 V</strong><br/>
                His ligand (Hb/Mb): <strong>+0.05 V</strong><br/>
                S⁻ ligand (P450): <strong>−0.30 V</strong><br/>
                <strong>1 V dan ortiq farq!</strong>
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-pink-400 font-bold text-sm mb-2">HSAB nazariyasi</p>
              <p className="text-purple-200">
                S⁻ — <strong>yumshoq asos</strong>. Fe³⁺/Fe²⁺ — 
                <strong>chegaraviy kislotalar</strong>. S⁻−Fe bog'i 
                kovalent xarakterga ega — elektron zichlik delokalizatsiyasi yuqori.
              </p>
            </div>
          </div>
        </div>

        {/* KATALITIK SIKL */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔄 Katalitik sikl — 8 bosqichli mexanizm</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              P450 ning katalitik sikli <strong className="text-yellow-400">8 ta aniq bosqichdan</strong> iborat.
              Siklda Fe <strong>turli oksidlanish va spin holatlaridan</strong> o'tadi.
              Eng muhim oraliq modda — <strong>I birikma (Por•⁺−Fe⁴⁺=O)</strong> — 
              o'ta reaktiv bo'lib, C−H bog'ini (~400 kJ/mol) uzishga qodir.
              Reaksiya "<strong>kislorod rebound</strong>" mexanizmi orqali boradi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold text-sm mb-3">Siklning birinchi yarmi (1-4 bosqichlar)</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">1.</span> Fe³⁺(LS) + H₂O — dam olish holati
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">2.</span> Substrat (R−H) kiradi, H₂O chiqadi, Fe³⁺(HS)
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">3.</span> 1-e⁻ qaytarilish: Fe³⁺ → Fe²⁺(HS)
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">4.</span> O₂ bog'lanadi: Fe²⁺−O₂ (oksi kompleks)
                </div>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-pink-400 font-bold text-sm mb-3">Siklning ikkinchi yarmi (5-8 bosqichlar)</h3>
              <div className="space-y-2 text-xs">
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">5.</span> 2-e⁻ + H⁺: Fe²⁺−OOH (gidroperokso)
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">6.</span> H⁺ → Por•⁺−Fe⁴⁺=O (I birikma) + H₂O
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">7.</span> R−H + I birikma → R−OH ("rebound")
                </div>
                <div className="bg-purple-800/30 rounded p-2">
                  <span className="text-pink-400 font-bold">8.</span> R−OH ajraladi, H₂O qaytadi → Fe³⁺(LS)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <P450Slayder />
        </div>

        {/* DORI METABOLIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 P450 va dori metabolizmi — farmakologik ahamiyati</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              P450 fermentlari <strong className="text-yellow-400">ksenobiotiklar</strong> (dorilar, zaharlar, 
              kanserogenlar) metabolizmida markaziy rol o'ynaydi. Jigarda joylashgan P450 izoformalari 
              dorilarni <strong>gidroksillab</strong>, ularni suvda eruvchan qiladi va 
              organizmdan chiqarilishini osonlashtiradi.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-pink-400 font-bold text-lg">CYP3A4</p>
                <p className="text-purple-300">Jigarda ~30% P450</p>
                <p className="text-purple-400 mt-1">Dorilarning ~50% ini metabolizlaydi: statinlar, immunosupresantlar, antigistaminlar</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-pink-400 font-bold text-lg">CYP2D6</p>
                <p className="text-purple-300">Genetik polimorfizm</p>
                <p className="text-purple-400 mt-1">Kodein → morfin, antidepresantlar, beta-blokatorlar. 4 ta fenotip!</p>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3 text-center">
                <p className="text-pink-400 font-bold text-lg">CYP2C9</p>
                <p className="text-purple-300">Varfarin metabolizmi</p>
                <p className="text-purple-400 mt-1">Antikoagulyant. Doza genetik test asosida individual tanlanadi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-pink-600/10 to-purple-600/10 border border-pink-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>P450 — <strong className="text-pink-400">tiolat (Cys−S⁻) ligandli noyob gem oqsili</strong>, monooksigenaza</li>
            <li>S⁻ ligand — <strong className="text-pink-400">kuchli elektron donor</strong>, Fe redoks potensialini −0.3 V gacha pasaytiradi</li>
            <li><strong className="text-pink-400">8 bosqichli katalitik sikl</strong> — I birikma (Por•⁺−Fe⁴⁺=O) C−H bog'ini uzadi</li>
            <li><strong className="text-pink-400">"Kislorod rebound" mexanizmi</strong> — stereospesifik gidroksillanish</li>
            <li><strong className="text-pink-400">57 ta inson izoformasi</strong> — dori metabolizmi, genetik polimorfizm, individual terapiya</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/gidrogenaza" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Gidrogenaza</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/b12-vitamini" className="px-6 py-3 bg-pink-600/80 rounded-xl hover:bg-pink-500 text-white font-semibold">B₁₂ vitamini →</Link>
        </div>

      </section>
    </main>
  )
}