"use client"

import Link from "next/link"
import { useState } from "react"

function SODSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "turlari", label: "🧬 Turlari" },
          { key: "struktura", label: "🔬 Struktura" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "kasallik", label: "🏥 Kasalliklar" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-blue-600/80 text-white" 
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
            <h4 className="text-blue-400 font-bold">Ping-pong mexanizmi — ikki bosqichli dismutatsiya</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-3">Umumiy reaksiya:</p>
              <p className="text-xs font-mono text-center mb-3">2O₂⁻ + 2H⁺ → H₂O₂ + O₂</p>
              <p className="text-xs">
                SOD — <strong>antioksidant himoyaning birinchi chizig'i</strong>. 
                Superoksid radikali (O₂⁻) — nafas olish zanjirida hosil bo'ladigan 
                zararli radikal. SOD uni <strong>vodorod peroksidga</strong> aylantiradi,
                keyin katalaza yoki peroksidaza H₂O₂ ni suvga parchalaydi.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-blue-400 font-bold text-xs mb-2">1-bosqich: Oksidlanish</p>
                <p className="text-xs font-mono mb-1">Cu²⁺ + O₂⁻ → Cu⁺ + O₂</p>
                <ul className="text-xs space-y-0.5 text-purple-300">
                  <li>• Cu²⁺ <strong>qaytariladi</strong> — Cu⁺ ga o'tadi</li>
                  <li>• O₂⁻ <strong>oksidlanadi</strong> — O₂ ga aylanadi</li>
                  <li>• Cu²⁺/Cu⁺ redoks juftligi: E° ≈ +0.4 V</li>
                  <li>• O₂⁻/O₂ juftligi: E° ≈ −0.33 V</li>
                  <li>• ΔE ≈ 0.73 V — <strong>termodinamik qulay</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-blue-400 font-bold text-xs mb-2">2-bosqich: Qaytarilish</p>
                <p className="text-xs font-mono mb-1">Cu⁺ + O₂⁻ + 2H⁺ → Cu²⁺ + H₂O₂</p>
                <ul className="text-xs space-y-0.5 text-purple-300">
                  <li>• Cu⁺ <strong>oksidlanadi</strong> — Cu²⁺ ga qaytadi</li>
                  <li>• O₂⁻ <strong>qaytariladi</strong> — H₂O₂ ga aylanadi</li>
                  <li>• 2 ta proton kerak (muhitdan)</li>
                  <li>• Katalitik sikl <strong>yopiladi</strong></li>
                  <li>• Cu²⁺ qayta tiklanadi — navbatdagi O₂⁻ ni kutadi</li>
                </ul>
              </div>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-1">Nima uchun Cu? Redoks potensial muhim!</p>
              <p className="text-xs">
                Cu²⁺/Cu⁺ redoks juftligining potensiali (+0.4 V) O₂⁻/O₂ (−0.33 V) va 
                O₂⁻/H₂O₂ (+0.89 V) orasida joylashgan. Bu — <strong>"redoks oynasi"</strong> —
                Cu ikkala reaksiyani ham katalizlay oladi. Zn²⁺ esa redoks faol emas —
                u faqat <strong>strukturaviy rol</strong> o'ynaydi.
              </p>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-blue-400 font-bold">SOD turlari — metallga qarab klassifikatsiya</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Turi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Metall</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Geometriya</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Rangi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Uchrashi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Xususiyati</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Cu,Zn-SOD", "Cu²⁺, Zn²⁺", "Oktaedr (Cu), Tetraedr (Zn)", "Moviy-yashil", "Sitoplazma (eukariotlar)", "Dimer, ~32 kDa, eng ko'p tarqalgan"],
                    ["Mn-SOD", "Mn³⁺", "Trigonal bipiramida", "Qizil-binafsha", "Mitoxondriya, bakteriyalar", "Tetramer, ~88 kDa, O₂⁻ ni mitoxondriyada yo'qotadi"],
                    ["Fe-SOD", "Fe³⁺", "Trigonal bipiramida", "Sariq", "Bakteriyalar, o'simliklar", "Dimer/tetramer, Mn-SOD ga strukturaviy o'xshash"],
                    ["Ni-SOD", "Ni²⁺/Ni³⁺", "Kvadrat piramida", "Yashil", "Ba'zi bakteriyalar", "Noyob — Ni redoks faol! Okean sianobakteriyalari"],
                    ["Fe,Zn-SOD", "Fe³⁺, Zn²⁺", "Oktaedr (Fe), Tetraedr (Zn)", "Qizil", "Ba'zi bakteriyalar", "Kambialistik — Fe va Zn almashinishi mumkin"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-purple-800/30 hover:bg-purple-800/20">
                      <td className="py-2 px-3"><strong className="text-blue-400">{row[0]}</strong></td>
                      <td className="py-2 px-3">{row[1]}</td>
                      <td className="py-2 px-3">{row[2]}</td>
                      <td className="py-2 px-3">{row[3]}</td>
                      <td className="py-2 px-3">{row[4]}</td>
                      <td className="py-2 px-3">{row[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-blue-400 font-bold">Cu,Zn-SOD — ikki metall markazi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-2">Cu markazi — katalitik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ligandlar:</strong> 4×His (imidazol) — buzilgan kvadrat tekislik</li>
                  <li>• <strong>5-koordinatsion:</strong> H₂O yoki O₂⁻ (substrat)</li>
                  <li>• <strong>Geometriya:</strong> kvadrat piramida (oktaedrga yaqin)</li>
                  <li>• His61 — Cu va Zn o'rtasida <strong>ko'prik ligand</strong></li>
                  <li>• Cu²⁺ — d⁹, <strong>Yan-Teller faol</strong></li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-2">Zn markazi — strukturaviy</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ligandlar:</strong> 3×His + 1×Asp (karboksilat)</li>
                  <li>• <strong>Geometriya:</strong> buzilgan tetraedr</li>
                  <li>• d¹⁰ — <strong>CFSE = 0</strong>, redoks faol emas</li>
                  <li>• Strukturani <strong>stabillashtiradi</strong></li>
                  <li>• Cu-Zn masofasi: ~6 Å (His61 ko'prigi orqali)</li>
                </ul>
              </div>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
              <p className="text-yellow-400 font-bold text-xs mb-1">Dimer tuzilish — oqsil arxitekturasi</p>
              <p className="text-xs">
                Cu,Zn-SOD — <strong>gomodimer</strong>. Har bir monomer ~16 kDa, 
                8 ta β-qavat (β-barrel) dan iborat. Ikki monomer <strong>gidrofob o'zaro ta'sir</strong> 
                orqali bog'langan. Faol markaz kanali <strong>elektrostatik yo'naltiruvchi</strong> 
                vazifasini bajaradi — manfiy zaryadlangan O₂⁻ ni Cu²⁺ ga tortadi.
              </p>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-blue-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Cu²⁺ — Yan-Teller effekti</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁹ konfiguratsiya:</strong> e_g da 3 ta elektron — buzilish muqarrar</li>
                  <li>• <strong>Yan-Teller faol:</strong> geometriya buzilgan oktaedr</li>
                  <li>• Aksial bog'lar <strong>cho'zilgan</strong> (odatda 2.3-2.8 Å vs ekvatorial 2.0 Å)</li>
                  <li>• <strong>Funksional ahamiyati:</strong> buzilgan geometriya — entatik holat!</li>
                  <li>• Substrat (O₂⁻) oson bog'lanadi va ajraladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Redoks potensial sozlanishi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Cu²⁺/Cu⁺ erkin holda:</strong> +0.16 V (suvda)</li>
                  <li>• <strong>SOD da:</strong> ~+0.4 V — 240 mV ga oshgan!</li>
                  <li>• <strong>Sababi:</strong> oqsil muhiti — His ligandlari, gidrofob cho'ntak</li>
                  <li>• His — <strong>π-akseptor</strong>, Cu⁺ ni stabillashtirmaydi</li>
                  <li>• Oqsil Cu²⁺ ni <strong>afzal ko'radi</strong> — potensial oshadi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">His61 — ko'prik ligand</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Imidazol halqasi <strong>Cu va Zn ni bog'laydi</strong></li>
                  <li>• Cu−N−Zn — <strong>ko'prik koordinatsion bog'</strong></li>
                  <li>• Bu — <strong>ko'p yadroli KB</strong> elementidir</li>
                  <li>• Zn strukturaviy, Cu katalitik — <strong>funksional ajralish</strong></li>
                  <li>• His61 ko'prigi elektron almashinishga yordam bermaydi (masofa katta)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Elektrostatik yo'naltirish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Faol markaz kanali <strong>musbat zaryadlangan</strong></li>
                  <li>• Arg143, Lys134 — Cu²⁺ yaqinida</li>
                  <li>• O₂⁻ (manfiy) — <strong>elektrostatik tortiladi</strong></li>
                  <li>• Diffuziya tezligini <strong>10-100 marta oshiradi</strong></li>
                  <li>• k_cat/K_M ≈ 2×10⁹ M⁻¹s⁻¹ — <strong>diffuziya chegarasida!</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kasallik" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-blue-400 font-bold">SOD va kasalliklar — oksidativ stress</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">ALS (Lou Gehrig kasalligi)</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>SOD1 geni mutatsiyasi</strong> — oilaviy ALS</li>
                  <li>• Cu,Zn-SOD strukturaviy beqaror bo'ladi</li>
                  <li>• Zn ajraladi → Cu noto'g'ri qaytarilish reaksiyalari</li>
                  <li>• <strong>Oqsillar agregatsiyasi</strong> — motor neyronlar nobud bo'ladi</li>
                  <li>• 150+ xil mutatsiya aniqlangan</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">SOD ning terapevtik qo'llanilishi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Orgotein (bovine Cu,Zn-SOD):</strong> yallig'lanishga qarshi</li>
                  <li>• <strong>SOD mimikalari:</strong> Mn-porfirin, Mn-salen komplekslari</li>
                  <li>• <strong>Antioksidant terapiya:</strong> saraton, yurak kasalliklari</li>
                  <li>• <strong>Kosmetika:</strong> qarishga qarshi kremlar (SOD + katalaza)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuperoksidDismutaza() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/karboangidraza" className="text-purple-400 hover:text-purple-300 text-lg">← Karboangidraza</Link>
        <div>
          <h1 className="text-2xl font-bold text-blue-400">🛡️ Superoksid Dismutaza (SOD)</h1>
          <p className="text-purple-400 text-sm">Cu,Zn / Mn / Fe / Ni • O₂⁻ dismutatsiyasi • Antioksidant himoya</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 SOD — superoksid radikaliga qarshi himoya</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-blue-400">Superoksid dismutaza (SOD)</strong> — 
              organizmni <strong>superoksid radikali (O₂⁻)</strong> dan himoya qiluvchi 
              muhim antioksidant ferment. O₂⁻ — nafas olish zanjirida elektronlarning 
              <strong> "sizib chiqishi"</strong> natijasida hosil bo'ladigan zararli radikal. 
              SOD uni <strong>vodorod peroksid (H₂O₂)</strong> va kislorodga aylantiradi. 
              SOD — <strong className="text-yellow-400">eng tezkor ferment</strong> 
              (k_cat/K_M ≈ 2×10⁹ M⁻¹s⁻¹ — diffuziya chegarasida!). Metall turiga qarab 
              <strong> 4 xil</strong> SOD mavjud: Cu,Zn-SOD, Mn-SOD, Fe-SOD va Ni-SOD.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-blue-400 font-bold text-lg">O₂⁻</p>
              <p className="text-purple-300">Superoksid radikal — zararli</p>
              <p className="text-purple-400 mt-1">
                Yarim umri ~ms. Lipidlar, DNK, oqsillarni oksidlaydi.
                Nafas olish zanjirida O₂ ning 1-2% i O₂⁻ ga aylanadi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-blue-400 font-bold text-lg">2O₂⁻ → H₂O₂ + O₂</p>
              <p className="text-purple-300">Dismutatsiya reaksiyasi</p>
              <p className="text-purple-400 mt-1">
                Ikki superoksid — biri oksidlanadi (O₂), biri qaytariladi (H₂O₂).
                Metall markazi ping-pong mexanizmi bilan ishlaydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 text-center">
              <p className="text-blue-400 font-bold text-lg">~2×10⁹</p>
              <p className="text-purple-300">k_cat/K_M (M⁻¹s⁻¹)</p>
              <p className="text-purple-400 mt-1">
                Diffuziya chegarasida — har bir to'qnashuv reaksiyaga olib keladi!
                Eng tezkor fermentlardan biri.
              </p>
            </div>
          </div>
        </div>

        {/* PING-PONG MEXANIZMI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Ping-pong mexanizmi — ikki bosqichli redoks sikli</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              SOD <strong className="text-yellow-400">ping-pong mexanizmi</strong> orqali 
              ishlaydi. Bu — <strong>ikki bosqichli redoks reaksiyasi</strong>:
              birinchi O₂⁻ Cu²⁺ ni Cu⁺ ga qaytaradi (o'zi O₂ ga oksidlanadi),
              ikkinchi O₂⁻ Cu⁺ ni Cu²⁺ ga oksidlaydi (o'zi H₂O₂ ga qaytariladi).
              Cu²⁺/Cu⁺ redoks juftligi potensiali (+0.4 V) ikkala yarim reaksiya 
              uchun ham <strong>termodinamik jihatdan qulay</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold text-sm mb-3">1-bosqich: Cu²⁺ qaytarilishi</h3>
              <div className="bg-purple-800/30 rounded-lg p-4 mb-2">
                <p className="text-xs font-mono text-center">Cu²⁺ + O₂⁻ → Cu⁺ + O₂</p>
              </div>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• O₂⁻ Cu²⁺ ga yaqinlashadi va <strong>tashqi sfera mexanizmi</strong> orqali elektron beradi</li>
                <li>• Cu²⁺ (d⁹) → Cu⁺ (d¹⁰) — <strong>bir elektronli qaytarilish</strong></li>
                <li>• O₂⁻ → O₂ + e⁻ (oksidlanish)</li>
                <li>• Cu⁺ hosil bo'ladi — rang o'zgaradi (ko'k → rangsiz)</li>
                <li>• His61 ko'prigi orqali Zn bilan bog'lanish saqlanadi</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-blue-400 font-bold text-sm mb-3">2-bosqich: Cu⁺ oksidlanishi</h3>
              <div className="bg-purple-800/30 rounded-lg p-4 mb-2">
                <p className="text-xs font-mono text-center">Cu⁺ + O₂⁻ + 2H⁺ → Cu²⁺ + H₂O₂</p>
              </div>
              <ul className="text-xs text-purple-200 space-y-1">
                <li>• Ikkinchi O₂⁻ Cu⁺ ga elektron beradi (Cu⁺ oksidlanadi)</li>
                <li>• Cu⁺ (d¹⁰) → Cu²⁺ (d⁹) — <strong>dastlabki holatga qaytish</strong></li>
                <li>• O₂⁻ + 2H⁺ + e⁻ → H₂O₂ (qaytarilish)</li>
                <li>• Protonlar Arg143 qoldig'idan keladi</li>
                <li>• Katalitik sikl yopiladi — Cu²⁺ keyingi O₂⁻ ni kutadi</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-600/10 border border-amber-500/30 rounded-lg p-4 mt-4">
            <p className="text-yellow-400 font-bold text-xs mb-2">Redoks potensial tahlili:</p>
            <div className="space-y-1 text-xs text-purple-200">
              <p>• <strong>Cu²⁺/Cu⁺ (SOD da):</strong> +0.40 V — oqsil muhiti bilan sozlangan</p>
              <p>• <strong>O₂⁻/O₂:</strong> −0.33 V — SOD ning Cu²⁺/Cu⁺ juftligi bundan yuqori → Cu²⁺ qaytariladi (1-bosqich)</p>
              <p>• <strong>O₂⁻/H₂O₂:</strong> +0.89 V — SOD ning Cu²⁺/Cu⁺ juftligi bundan past → Cu⁺ oksidlanadi (2-bosqich)</p>
              <p>• <strong className="text-yellow-400">+0.40 V — ideal "redoks oynasi"da!</strong></p>
            </div>
          </div>
        </div>

        {/* STRUKTURA */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 Cu,Zn-SOD — ikki metall markazi va oqsil arxitekturasi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Cu,Zn-SOD — <strong className="text-yellow-400">gomodimer</strong> (har bir monomer ~16 kDa).
              Har bir monomer <strong>8 ta antiparallel β-qavat</strong> dan iborat 
              <strong> yunon kaliti (Greek key) β-barrel</strong> motifiga ega.
              Faol markazda <strong>Cu va Zn ionlari</strong> His61 imidazol halqasi orqali 
              <strong> ko'prik bog'langan</strong>. Cu — katalitik markaz, 
              Zn — strukturaviy stabilizator. Bu — 
              <strong className="text-blue-400">ko'p yadroli koordinatsion birikma</strong> ning 
              biologik namunasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-blue-400 font-bold mb-2">Cu²⁺ markazi — katalitik</p>
              <ul className="space-y-0.5">
                <li>• <strong>Ligandlar:</strong> His46, His48, His61 (ko'prik), His118</li>
                <li>• <strong>5-koordinatsion o'rin:</strong> H₂O yoki O₂⁻ (substrat)</li>
                <li>• <strong>Geometriya:</strong> buzilgan kvadrat piramida</li>
                <li>• <strong>Yan-Teller:</strong> aksial bog' cho'zilgan (~2.5 Å)</li>
                <li>• <strong>Cu−N masofalari:</strong> ekvatorial ~2.0-2.1 Å</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-blue-400 font-bold mb-2">Zn²⁺ markazi — strukturaviy</p>
              <ul className="space-y-0.5">
                <li>• <strong>Ligandlar:</strong> His61 (ko'prik), His69, His78, Asp81</li>
                <li>• <strong>Geometriya:</strong> buzilgan tetraedr</li>
                <li>• <strong>d¹⁰:</strong> CFSE=0, redoks faol emas</li>
                <li>• <strong>Zn−N/O masofalari:</strong> ~2.0-2.2 Å</li>
                <li>• Cu-Zn masofasi: ~6.3 Å</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <SODSlayder />
        </div>

        {/* ELEKTROSTATIK YO'NALTIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🧲 Elektrostatik yo'naltirish — diffuziya chegarasida ishlash siri</h2>
          
          <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              SOD qanday qilib diffuziya chegarasida ishlaydi? Javob — 
              <strong className="text-yellow-400"> elektrostatik yo'naltirish</strong>.
              Faol markaz atrofidagi <strong>musbat zaryadlangan aminokislotalar</strong> 
              (Arg143, Lys134) manfiy zaryadlangan O₂⁻ ni <strong>elektrostatik tortadi</strong>.
              Bu — "molekulyar voronka" effekti. O₂⁻ kanalga kirib, to'g'ri 
              Cu²⁺ ga yo'naladi. Natijada har bir to'qnashuv deyarli 
              <strong> 100% mahsuldor</strong> bo'ladi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-blue-400 font-bold text-lg mb-1">Arg143</p>
              <p className="text-purple-300">
                Faol markaz kanalining "og'zida" joylashgan.
                Guanidin guruhi — musbat zaryadli.
                O₂⁻ ni <strong>tortib, yo'naltiradi</strong>.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-blue-400 font-bold text-lg mb-1">Lys134</p>
              <p className="text-purple-300">
                Ikkinchi musbat zaryadli qoldiq.
                Arg143 bilan birgalikda <strong>elektrostatik maydon</strong> yaratadi.
              </p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-blue-400 font-bold text-lg mb-1">Kanal diametri</p>
              <p className="text-purple-300">
                ~4 Å — O₂⁻ o'tishi uchun ideal.
                <strong>Selektiv filtr</strong> — faqat kichik anionlar kiradi.
              </p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>SOD — <strong className="text-blue-400">antioksidant himoyaning birinchi chizig'i</strong>, O₂⁻ ni H₂O₂ + O₂ ga aylantiradi</li>
            <li>Cu,Zn-SOD — <strong className="text-blue-400">ko'p yadroli KB</strong>: Cu (katalitik, d⁹, Yan-Teller faol) + Zn (strukturaviy, d¹⁰)</li>
            <li><strong className="text-blue-400">Ping-pong mexanizmi</strong> — Cu²⁺/Cu⁺ redoks sikli, ikkala yarim reaksiya ham termodinamik qulay</li>
            <li><strong className="text-blue-400">Elektrostatik yo'naltirish</strong> — k_cat/K_M ≈ 2×10⁹ M⁻¹s⁻¹, diffuziya chegarasida!</li>
            <li>SOD1 mutatsiyalari — <strong className="text-blue-400">ALS kasalligi</strong> sababchisi, KB barqarorligining buzilishi</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/karboangidraza" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Karboangidraza</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/katalaza" className="px-6 py-3 bg-blue-600/80 rounded-xl hover:bg-blue-500 text-white font-semibold">Katalaza →</Link>
        </div>

      </section>
    </main>
  )
}