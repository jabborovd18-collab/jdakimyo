"use client"

import Link from "next/link"
import { useState } from "react"

function OltinSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "turlari", label: "📋 Turlari" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "yangi", label: "🆕 Yangi avlod" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              tab === t.key 
                ? "bg-yellow-500/80 text-white" 
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
            <h4 className="text-yellow-400 font-bold">Tioredoksinreduktaza (TrxR) ingibitori</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Asosiy target — TrxR:</p>
              <p className="text-xs mb-2">
                Oltin dorilarining asosiy molekulyar targeti — <strong>tioredoksinreduktaza (TrxR)</strong>.
                Bu ferment hujayra ichidagi <strong>redoks muvozanatini</strong> boshqaradi.
                Saraton hujayralarida TrxR <strong>yuqori ekspressiyalangan</strong> — 
                oksidativ stressdan himoyalanish uchun.
              </p>
            </div>

            <div className="bg-purple-900/50 rounded-lg p-3">
              <p className="text-yellow-400 font-bold text-xs mb-2">Ta'sir mexanizmi ketma-ketligi:</p>
              <ol className="text-xs space-y-2 list-decimal list-inside">
                <li><strong>Hujayraga kirish:</strong> Au kompleksi membranadan o'tadi</li>
                <li><strong>Ligand almashinishi:</strong> Au−PR₃ + TrxR−(Se⁻) → Au−Se(TrxR) + PR₃</li>
                <li><strong>TrxR ingibirlanishi:</strong> Au selenosistein (Sec) qoldig'iga <strong>qaytmas bog'lanadi</strong></li>
                <li><strong>Redoks muvozanat buziladi:</strong> Tioredoksin qaytarilmaydi → oksidativ stress</li>
                <li><strong>ROS to'planadi:</strong> H₂O₂, O₂⁻ miqdori oshadi</li>
                <li><strong>Apoptoz:</strong> Mitoxondriya membranasi buziladi → sitoxrom c ajraladi</li>
              </ol>
            </div>
          </div>
        )}

        {tab === "turlari" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Oltin dorilarining avlodlari</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-purple-700/50">
                    <th className="text-left py-2 px-3 text-yellow-400">Dori</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Formula / Tarkibi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Au oksidlanish darajasi</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Geometriya</th>
                    <th className="text-left py-2 px-3 text-yellow-400">Qo'llanilishi</th>
                  </tr>
                </thead>
                <tbody className="text-purple-200">
                  {[
                    ["Auronofin", "[Au(PEt₃)(SR)] — SR = tioglyukoza", "Au⁺ (d¹⁰)", "Chiziqli", "Revmatoid artrit (1985), saraton (klinik sinov)"],
                    ["Natriy aurotiomalat", "Na₂[Au(SR)₂] — polimer", "Au⁺ (d¹⁰)", "Chiziqli", "Revmatoid artrit (in'eksiya)"],
                    ["Aurotioglyukoza", "Au(SR) — SR = tioglyukoza", "Au⁺ (d¹⁰)", "Chiziqli/Polimer", "Revmatoid artrit"],
                    ["Au-NHC", "[Au(NHC)Cl] — NHC = N-geterotsiklik karben", "Au⁺ (d¹⁰)", "Chiziqli", "Saraton (preklinik)"],
                    ["Au(III)-porfirin", "[Au(porfirin)Cl]", "Au³⁺ (d⁸)", "Kvadrat tekislik", "Saraton (preklinik)"],
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

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Au⁺ — d¹⁰, chiziqli geometriya</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d¹⁰ konfiguratsiya:</strong> barcha d-orbitallar to'lgan — CFSE = 0</li>
                  <li>• <strong>Chiziqli geometriya:</strong> sp-gibridlanish, 2-koordinatsion</li>
                  <li>• <strong>2 ta ligand:</strong> L−Au−X (odatda fosfin + tiolat)</li>
                  <li>• <strong>Relativistik effekt:</strong> Au uchun kuchli — 6s/6p orbitallar yaqinlashadi</li>
                  <li>• <strong>Au−S bog'i:</strong> kuchli kovalent xarakter — selektiv tiolga bog'lanish</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Au³⁺ — d⁸, kvadrat tekislik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d⁸ konfiguratsiya:</strong> Pt²⁺ izoelektronik — o'xshash geometriya</li>
                  <li>• <strong>Kvadrat tekislik</strong> — d⁸ uchun xarakterli</li>
                  <li>• <strong>Kinetik inertlik:</strong> d⁸ — ligand almashinishi sekin</li>
                  <li>• <strong>Au(III)-porfirin:</strong> sisplatinga o'xshash DNK cross-link</li>
                  <li>• <strong>Redoks:</strong> Au³⁺ → Au⁺ → Au⁰ — hujayra ichida qaytarilishi mumkin</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">HSAB va selektivlik</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Au⁺ — o'ta yumshoq kislota</strong> (relativistik effekt tufayli)</li>
                  <li>• <strong>Se⁻ (selenolat) — yumshoq asos</strong> — TrxR faol markazida</li>
                  <li>• <strong>Au−Se bog'i</strong> — juda mustahkam (HSAB bo'yicha ideal)</li>
                  <li>• <strong>S-donorlar (Cys, GSH):</strong> Au−S ham kuchli — lekin Au−Se kuchliroq</li>
                  <li>• <strong>Selektivlik:</strong> TrxR Sec qoldig'i — kam uchraydigan aminokislota</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Organometallik Au−C (karben) bog'i</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Au−NHC:</strong> N-geterotsiklik karben — kuchli σ-donor</li>
                  <li>• <strong>Au−C bog'i:</strong> ~2.0 Å, kuchli kovalent</li>
                  <li>• <strong>Barqarorlik:</strong> Au−NHC tiolatlarga nisbatan barqarorroq (almashinmaydi)</li>
                  <li>• <strong>Lipofillik:</strong> NHC ligandlari — membranadan o'tishni yaxshilaydi</li>
                  <li>• <strong>Organometallik dorilar:</strong> Au−C bog'i — yangi avlod xususiyati</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "yangi" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-yellow-400 font-bold">Yangi avlod oltin dorilari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Au-NHC komplekslari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Organometallik Au−C bog'i</strong> — barqaror, almashinmaydi</li>
                  <li>• <strong>TrxR ingibitori</strong> — Au fosfinlarga nisbatan faolroq</li>
                  <li>• <strong>Mitoxondriyaga yo'naltirilgan:</strong> lipofil kationlar mitoxondriyada to'planadi</li>
                  <li>• <strong>Selektivlik yuqori:</strong> sog'lom hujayralarga kam ta'sir</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Au(III) komplekslari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Pt²⁺ analogi:</strong> d⁸, kvadrat tekislik — DNK cross-link</li>
                  <li>• <strong>Sisplatinga rezistent</strong> o'smalarda faol</li>
                  <li>• <strong>Muammo:</strong> Au³⁺ hujayra ichida Au⁺/Au⁰ ga qaytariladi</li>
                  <li>• <strong>Yechim:</strong> makrotsiklik ligandlar (porfirin) — barqarorlashtiradi</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Oltin() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/ruteniy" className="text-purple-400 hover:text-purple-300 text-lg">← Ruteniy</Link>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">✨ Oltin komplekslari</h1>
          <p className="text-purple-400 text-sm">Auronofin • Au-NHC • TrxR ingibitori • Revmatoid artrit • Saraton</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Oltin dorilari — qadimgi metall, zamonaviy tibbiyot</h2>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-yellow-400">Oltin (Au) komplekslari</strong> — 
              tibbiyotda <strong>1929-yildan beri</strong> qo'llaniladi (revmatoid artrit).
              Asosiy mexanizm: <strong>tioredoksinreduktaza (TrxR)</strong> fermentini 
              ingibirlash — Au atomi TrxR faol markazidagi 
              <strong> selenosistein (Sec) qoldig'iga</strong> qaytmas bog'lanadi.
              <strong> Au⁺ (d¹⁰)</strong> — chiziqli geometriya, yumshoq kislota, 
              S va Se donorlarga yuqori yaqinlik.
              <strong className="text-yellow-400">Auronofin</strong> — 1985-yilda 
              tasdiqlangan, hozirda <strong>saraton kasalligiga qarshi</strong> 
              klinik sinovlarda qayta kashf etilmoqda. Yangi avlod 
              <strong> Au-NHC (organometallik) komplekslari</strong> — 
              kuchli antikanser faollikka ega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Au⁺ (d¹⁰)</p>
              <p className="text-purple-300">Chiziqli geometriya</p>
              <p className="text-purple-400 mt-1">
                d¹⁰ — barcha orbitallar to'lgan. sp-gibridlanish, 2-koordinatsion.
                Relativistik effekt kuchli.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">TrxR</p>
              <p className="text-purple-300">Asosiy molekulyar target</p>
              <p className="text-purple-400 mt-1">
                Tioredoksinreduktaza — selenosistein (Sec) faol markazi.
                Au−Se bog'i — HSAB bo'yicha ideal.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-yellow-400 font-bold text-lg">Au−C</p>
              <p className="text-purple-300">Organometallik bog'</p>
              <p className="text-purple-400 mt-1">
                Au-NHC — kuchli kovalent bog'. Barqaror, almashinmaydi.
                Yangi avlod dorilari.
              </p>
            </div>
          </div>
        </div>

        {/* AURONOFIN */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💊 Auronofin — revmatoid artritdan saratongacha</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-yellow-400">Auronofin — [Au(PEt₃)(SR)]</strong> 
              (SR = 2,3,4,6-tetra-O-asetil-1-tio-β-D-glyukopiranoza).
              <strong> Au⁺ (d¹⁰), chiziqli geometriya</strong>: P−Au−S burchagi ~176°.
              <strong> Og'iz orqali qabul qilinadigan</strong> yagona oltin dori.
              1985-yilda revmatoid artrit uchun tasdiqlangan. So'nggi yillarda
              <strong> saraton kasalligiga qarshi</strong> qayta kashf etildi — 
              TrxR ingibitori sifatida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold mb-2">Strukturaviy xususiyatlar</p>
              <ul className="space-y-0.5">
                <li>• <strong>PEt₃ (trietilfosfin):</strong> lipofil ligand — membranadan o'tish</li>
                <li>• <strong>Tioglyukoza (SR):</strong> gidrofil "dum" — suvda eruvchanlik</li>
                <li>• <strong>Chiziqli P−Au−S:</strong> ~176°</li>
                <li>• <strong>Au−P:</strong> ~2.26 Å, <strong>Au−S:</strong> ~2.30 Å</li>
                <li>• <strong>Molekulyar massa:</strong> 678.5 g/mol</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold mb-2">Farmakologik xususiyatlar</p>
              <ul className="space-y-0.5">
                <li>• <strong>Qabul:</strong> Og'iz orqali (biodostupligi ~20-25%)</li>
                <li>• <strong>Yarim umri:</strong> ~17-26 kun (uzoq — oqsillar bilan bog'lanadi)</li>
                <li>• <strong>Target:</strong> TrxR (IC₅₀ ~10-50 nM)</li>
                <li>• <strong>Saraton turlari:</strong> Tuxumdon, ko'krak, o'pka, leykemiya</li>
                <li>• <strong>Sinergizm:</strong> Sisplatin bilan birgalikda kuchliroq ta'sir</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <OltinSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-purple-600/10 border border-yellow-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Oltin dorilari — <strong className="text-yellow-400">Au⁺ (d¹⁰), chiziqli geometriya</strong>, 1929-yildan beri qo'llaniladi</li>
            <li>Asosiy target — <strong className="text-yellow-400">TrxR selenosistein (Sec)</strong>: Au−Se qaytmas bog' — redoks muvozanat buziladi</li>
            <li><strong className="text-yellow-400">Auronofin</strong> — og'iz orqali qabul qilinadi, revmatoid artrit + saraton (qayta kashf etilgan)</li>
            <li><strong className="text-yellow-400">Au-NHC</strong> — organometallik Au−C bog'i, barqaror, yangi avlod antikanser dorilari</li>
            <li><strong className="text-yellow-400">HSAB:</strong> Au⁺ o'ta yumshoq kislota, Se⁻/S⁻ yumshoq asoslar — selektiv bog'lanish</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/ruteniy" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Ruteniy</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metall-dorilar/boshqa" className="px-6 py-3 bg-yellow-500/80 rounded-xl hover:bg-yellow-400 text-white font-semibold">Boshqa metallar →</Link>
        </div>

      </section>
    </main>
  )
}