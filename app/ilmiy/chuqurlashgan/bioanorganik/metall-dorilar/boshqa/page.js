"use client"

import Link from "next/link"
import { useState } from "react"

function BoshqaMetallarSlayder() {
  const [tab, setTab] = useState("temir")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "temir", label: "🔴 Temir" },
          { key: "mis", label: "🟠 Mis" },
          { key: "galliy", label: "⚪ Galliy" },
          { key: "kumush", label: "⚪ Kumush" },
          { key: "vanadiy", label: "🟡 Vanadiy" },
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
        {tab === "temir" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-red-400 font-bold">Temir komplekslari — redoks faol dorilar</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Bleomitsin — Fe²⁺ kompleksi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Glikopeptid antibiotik</strong> — Fe²⁺ bilan kompleks hosil qiladi</li>
                  <li>• <strong>Fe²⁺ + O₂ → Fe³⁺−OOH</strong> — faol shakl</li>
                  <li>• <strong>DNK ni parchalaydi:</strong> erkin radikallar orqali C4'−H bog'ini uzadi</li>
                  <li>• <strong>Saraton:</strong> limfoma, moyak saratoni (sisplatin bilan birgalikda)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ferrosen — organometallik dori</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>[Fe(η⁵-Cp)₂]</strong> — sendvich kompleks, Fe²⁺ (d⁶)</li>
                  <li>• <strong>Ferrosenil tamoksifen:</strong> ko'krak saratoniga qarshi (preklinik)</li>
                  <li>• <strong>Afzalligi:</strong> Fe²⁺/Fe³⁺ redoks juftligi — ROS generatsiyasi</li>
                  <li>• <strong>Barqaror:</strong> 18 elektron qoidasi, suvda erimaydi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Temir xelatorlari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Deferoksamin:</strong> Fe³⁺ ni xelatlab chiqaradi — temir ortib ketishida</li>
                  <li>• <strong>Deferipron, Deferaziroks:</strong> og'iz orqali qabul qilinadigan xelatorlar</li>
                  <li>• <strong>Talassemiya:</strong> qon quyish natijasida temir to'planadi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "mis" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-orange-400 font-bold">Mis komplekslari — antioksidant va antikanser</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Cu-ATSM — gipoksiya-selektiv dori</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>[Cu(ATSM)]</strong> — ATSM = diasetil-bis(4-metiltiosemikarbazon)</li>
                  <li>• <strong>Cu²⁺ (d⁹)</strong> — gipoksik muhitda Cu⁺ ga qaytariladi</li>
                  <li>• <strong>PET tasvirlash:</strong> ⁶⁴Cu-ATSM — gipoksiya markeri</li>
                  <li>• <strong>Terapiya:</strong> Cu kompleksi DNK ni parchalaydi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Cu-xelatorlar — saratonga qarshi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Tetratiomolibdat (TM):</strong> Cu ni xelatlaydi — angiogenez ingibitori</li>
                  <li>• <strong>Disulfiram + Cu²⁺:</strong> alkogolizm dori + Cu — antikanser faollik</li>
                  <li>• <strong>Klokinolin:</strong> Cu²⁺ bilan kompleks — proteasoma ingibitori</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "galliy" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-gray-400 font-bold">Galliy — "temir troya oti"</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ga³⁺ — Fe³⁺ mimikasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ga³⁺ radiusi:</strong> 0.62 Å — Fe³⁺ (0.65 Å) ga juda yaqin</li>
                  <li>• <strong>Zaryad:</strong> 3+ — bir xil</li>
                  <li>• <strong>Koordinatsion son:</strong> 6 (oktaedrik) — Fe³⁺ kabi</li>
                  <li>• <strong>Asosiy farq:</strong> Ga³⁺ redoks faol emas (Ga²⁺ hosil bo'lmaydi)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ta'sir mexanizmi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Transferrin Ga³⁺ ni <strong>Fe³⁺ deb "o'ylab"</strong> tashiydi</li>
                  <li>• Saraton hujayralari Ga³⁺ ni <strong>ko'p qabul qiladi</strong> (TfR ko'p)</li>
                  <li>• Ga³⁺ ribonukleotid reduktaza Fe ni <strong>almashtiradi</strong> — ferment nofaollashadi</li>
                  <li>• <strong>DNK sintezi to'xtaydi</strong> — apoptoz</li>
                  <li>• <strong>Galliy nitrat:</strong> limfoma, siydik pufagi saratoni</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kumush" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-gray-400 font-bold">Kumush — antimikrob va yaraga qarshi</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Kumush sulfadiazin</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>[Ag(SDZ)]</strong> — SDZ = sulfadiazin, Ag⁺ (d¹⁰)</li>
                  <li>• <strong>Kuyish yaralari:</strong> 1% krem — Pseudomonas aeruginosa ga qarshi</li>
                  <li>• <strong>Ag⁺ ajraladi:</strong> bakteriya DNK si va fermentlariga bog'lanadi</li>
                  <li>• <strong>HSAB:</strong> Ag⁺ — yumshoq kislota, S-donor (Cys) — yumshoq asos</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ag-NHC — yangi avlod antimikroblari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Organometallik Ag−C bog'i</strong> — barqaror, sekin ajraladi</li>
                  <li>• <strong>Gram-manfiy va Gram-musbat</strong> bakteriyalarga qarshi</li>
                  <li>• <strong>Kam toksiklik:</strong> sog'lom hujayralarga ta'siri past</li>
                  <li>• <strong>Biofilm:</strong> kumush nanozarralardan farqli — biofilmga kiradi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "vanadiy" && (
          <div className="space-y-4 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Vanadiy — insulin-mimetik komplekslar</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Vanadil (VO²⁺) va vanadat (VO₄³⁻)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>VO²⁺ (vanadil):</strong> d¹, EPR faol, kvadrat piramida geometriya</li>
                  <li>• <strong>VO₄³⁻ (vanadat):</strong> fosfat (PO₄³⁻) analogi</li>
                  <li>• <strong>Insulin-mimetik:</strong> insulin retseptorini faollashtiradi</li>
                  <li>• <strong>Protein-tirozin fosfataza (PTP) ingibitori:</strong> VO₄³⁻ fosfat o'rnida bog'lanadi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">BMOV — diabetga qarshi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>[VO(malto lato)₂]</strong> — BMOV (bis(maltolato)oksovanadiy(IV))</li>
                  <li>• <strong>Og'iz orqali qabul:</strong> qandli diabet II turi uchun</li>
                  <li>• <strong>Klinik sinovlar:</strong> samaradorlik ko'rsatilgan</li>
                  <li>• <strong>Kamchilik:</strong> nefrotoksiklik — davomli qabulda muammo</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BoshqaMetallar() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/oltin" className="text-purple-400 hover:text-purple-300 text-lg">← Oltin</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">🧪 Boshqa metall asosidagi dorilar</h1>
          <p className="text-purple-400 text-sm">Temir • Mis • Galliy • Kumush • Vanadiy — turli terapevtik qo'llanilishlar</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Platina, ruteniy va oltindan tashqari metallar</h2>
          
          <div className="bg-yellow-600/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Ko'plab boshqa metallar</strong> ham 
              dorilar sifatida qo'llaniladi yoki tadqiqot bosqichida. Ular orasida:
              <strong> temir</strong> (bleomitsin, ferrosen, xelatorlar),
              <strong> mis</strong> (Cu-ATSM, xelatorlar),
              <strong> galliy</strong> (Ga³⁺ — Fe³⁺ mimikasi),
              <strong> kumush</strong> (antimikrob vositalar),
              <strong> vanadiy</strong> (insulin-mimetik komplekslar).
              Bu metallarning har biri <strong className="text-yellow-400">koordinatsion birikmalar</strong> 
              kimyosining o'ziga xos xususiyatlaridan foydalanadi: geometriya, 
              redoks faollik, HSAB selektivligi, ligand almashinishi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs text-center">
            {[
              { metal: "Fe", color: "text-red-400", desc: "Redoks faol\nROS generatsiyasi" },
              { metal: "Cu", color: "text-orange-400", desc: "Angiogenez\nGipoksiya targeting" },
              { metal: "Ga", color: "text-gray-400", desc: "Fe³⁺ mimikasi\nRedoks faol emas" },
              { metal: "Ag", color: "text-gray-300", desc: "Antimikrob\nHSAB selektiv" },
              { metal: "V", color: "text-yellow-400", desc: "Insulin-mimetik\nPTP ingibitori" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-800/30 rounded-xl p-3 border border-purple-700/30">
                <p className={`font-bold text-lg ${item.color}`}>{item.metal}</p>
                <p className="text-purple-400 mt-1 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TEMIR */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔴 Temir komplekslari — bleomitsin va ferrosen</h2>
          
          <div className="bg-red-600/10 border border-red-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-red-400">Bleomitsin</strong> — 
              Streptomyces verticillus dan ajratilgan glikopeptid antibiotik.
              Fe²⁺ bilan kompleks hosil qilib, O₂ ni faollashtiradi va 
              <strong> DNK ni erkin radikallar</strong> orqali parchalaydi.
              <strong className="text-yellow-400"> Ferrosen [Fe(η⁵-Cp)₂]</strong> — 
              klassik sendvich organometallik birikma (18 elektron).
              Ferrosenil tamoksifen — ko'krak saratoniga qarshi preklinik sinovlarda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold mb-2">Bleomitsin — Fe²⁺-O₂ aktivatsiyasi</p>
              <ul className="space-y-0.5">
                <li>• <strong>Fe²⁺ + bleomitsin → Fe²⁺-BLM</strong> (1:1 kompleks)</li>
                <li>• <strong>Fe²⁺-BLM + O₂ → Fe³⁺−OOH-BLM</strong> (faol shakl)</li>
                <li>• Fe³⁺−OOH DNK C4'−H bog'ini gomolitik uzadi</li>
                <li>• <strong>DNK fragmentatsiyasi</strong> — hujayra o'limi</li>
                <li>• <strong>Selektivlik:</strong> o'pka va terida bleomitsin gidrolaza kam — ta'sir yuqori</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-red-400 font-bold mb-2">Ferrosen — organometallik dori platformasi</p>
              <ul className="space-y-0.5">
                <li>• <strong>[Fe(η⁵-Cp)₂]:</strong> 18 e⁻, barqaror, suvda erimaydi</li>
                <li>• <strong>Fe²⁺/Fe³⁺:</strong> +0.4 V (qaytaruvchi muhitda ROS)</li>
                <li>• <strong>Ferrosenil tamoksifen:</strong> estradiol retseptoriga bog'lanadi</li>
                <li>• <strong>Ferrosen-xloroxin:</strong> bezgakka qarshi (preklinik)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* GALLIY */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚪ Galliy — "temir troya oti" strategiyasi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-gray-400">Galliy (Ga³⁺)</strong> — 
              davriy jadvalda temirning yonida joylashgan, lekin 
              <strong> redoks faol emas</strong>. Ga³⁺ radiusi (0.62 Å) Fe³⁺ (0.65 Å) ga 
              juda yaqin. Organizm Ga³⁺ ni <strong>Fe³⁺ deb "adashadi"</strong> — 
              transferrin orqali tashiydi, hujayra ichiga kiradi, fermentlarga bog'lanadi.
              <strong> Lekin Ga³⁺ qaytarilmaydi</strong> — Fe-ga bog'liq redoks fermentlari 
              ishlamay qoladi. Bu — <strong>"troya oti" strategiyasi</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-gray-400 font-bold text-lg">Ga³⁺ ≈ Fe³⁺</p>
              <p className="text-purple-300">Radius: 0.62 vs 0.65 Å</p>
              <p className="text-purple-400 mt-1">
                Zaryad bir xil (3+), geometriya oktaedrik. Transferrin "aldanadi".
                Saraton hujayralari ko'p qabul qiladi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-gray-400 font-bold text-lg">Ga²⁺ yo'q!</p>
              <p className="text-purple-300">Redoks faol emas</p>
              <p className="text-purple-400 mt-1">
                Ga³⁺ qaytarilmaydi — ribonukleotid reduktaza ishlamaydi.
                DNK sintezi to'xtaydi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-gray-400 font-bold text-lg">Galliy nitrat</p>
              <p className="text-purple-300">FDA tasdiqlangan</p>
              <p className="text-purple-400 mt-1">
                Limfoma, siydik pufagi saratoni. Giperkalsemiyaga qarshi.
                Vena ichiga yuboriladi.
              </p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <BoshqaMetallarSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-600/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li><strong className="text-red-400">Temir:</strong> Bleomitsin — Fe²⁺-O₂ aktivatsiyasi, DNK parchalanishi; Ferrosen — organometallik platforma</li>
            <li><strong className="text-orange-400">Mis:</strong> Cu-ATSM — gipoksiya-selektiv, angiogenez ingibitorlari (TM)</li>
            <li><strong className="text-gray-400">Galliy:</strong> Ga³⁺ — Fe³⁺ "troya oti", redoks faol emas, ribonukleotid reduktaza ingibitori</li>
            <li><strong className="text-gray-300">Kumush:</strong> Ag⁺ — antimikrob (Ag-SDZ), Ag-NHC — yangi avlod, biofilmga qarshi</li>
            <li><strong className="text-yellow-400">Vanadiy:</strong> VO²⁺/VO₄³⁻ — insulin-mimetik, PTP ingibitori, diabet II turi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/oltin" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Oltin</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/ion-tashish" className="px-6 py-3 bg-yellow-600/80 rounded-xl hover:bg-yellow-500 text-white font-semibold">Ion tashish →</Link>
        </div>

      </section>
    </main>
  )
}