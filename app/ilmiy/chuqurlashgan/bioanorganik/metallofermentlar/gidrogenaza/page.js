"use client"

import Link from "next/link"
import { useState } from "react"

function GidrogenazaSlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "nife", label: "🔬 [NiFe]" },
          { key: "fefe", label: "⚡ [FeFe]" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "energiya", label: "🔋 Energiya" },
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
            <h4 className="text-cyan-400 font-bold">H₂ metabolizmi — qaytaruvchi ajralish va oksidlovchi qo'shilish</h4>
            
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">Asosiy reaksiya (reversibil):</p>
              <p className="text-xs font-mono text-center mb-3">H₂ ⇌ 2H⁺ + 2e⁻</p>
              <p className="text-xs">
                Gidrogenaza — <strong>reversibil</strong> ishlaydigan noyob ferment.
                H₂ ni oksidlab proton va elektronlarga ajratadi yoki proton va elektronlardan H₂ sintez qiladi.
                Yo'nalish <strong>hujayra ehtiyojiga</strong> qarab belgilanadi.
                Termodinamik jihatdan <strong>muvozanat potensiali −413 mV</strong> (pH=7 da).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-cyan-400 font-bold text-xs mb-2">H₂ oksidlanishi (H₂ → 2H⁺ + 2e⁻)</p>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>H₂ faol markazga yaqinlashadi</li>
                  <li>H−H bog'i <strong>geterolitik ajraladi</strong></li>
                  <li>H⁺ + H⁻ → H⁺ asosga o'tadi, H⁻ metallga bog'lanadi</li>
                  <li>H⁻ dan elektron metallga o'tadi → <strong>gidrid (M−H)</strong></li>
                  <li>Ikkinchi H ham ajraladi → 2H⁺ + 2e⁻</li>
                </ol>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-cyan-400 font-bold text-xs mb-2">H₂ sintezi (2H⁺ + 2e⁻ → H₂)</p>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>Metall markaz qaytariladi (e⁻ qabul qiladi)</li>
                  <li>Proton metallga bog'lanadi → <strong>M−H</strong></li>
                  <li>Ikkinchi proton va elektron → <strong>M−H₂</strong> yoki M(H)₂</li>
                  <li>Ikki gidrid birlashadi → <strong>H₂ ajraladi</strong></li>
                  <li>Metall markaz oksidlangan holatga qaytadi</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {tab === "nife" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-cyan-400 font-bold">[NiFe]-gidrogenaza — oksidlanishga chidamli</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Faol markaz tarkibi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Ni²⁺</strong> — 4 ta Cys(S) bilan bog'langan (2 tasi ko'prik)</li>
                  <li>• <strong>Fe²⁺</strong> — past spinli, <strong>2×CN⁻ + 1×CO</strong> ligandlar!</li>
                  <li>• Ni va Fe <strong>2 ta Cys(S⁻) ko'prik</strong> orqali bog'langan</li>
                  <li>• Ni−Fe masofasi: ~2.5-2.9 Å</li>
                  <li>• <strong>CO va CN⁻</strong> — kuchli maydon ligandlari, Fe ni past spinli qiladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">CO va CN⁻ — noyob biologik ligandlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>CO (karbonil):</strong> Fe−CO — ~1.7 Å, ν(CO) ~1940-2070 sm⁻¹ (IQ)</li>
                  <li>• <strong>2×CN⁻ (sianid):</strong> Fe−CN — ν(CN) ~2070-2090 sm⁻¹</li>
                  <li>• <strong>Nima uchun CO va CN⁻?</strong> Fe ni past spinli qiladi, elektron struktura nozik sozlanadi</li>
                  <li>• CO va CN⁻ — <strong>zaharl i</strong> erkin holda, lekin ferment ichida xavfsiz</li>
                  <li>• Bu — <strong>organometallik bog'lar</strong> (Fe−CO) biologik tizimda!</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "fefe" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-cyan-400 font-bold">[FeFe]-gidrogenaza — H₂ sintezi bo'yicha chempion</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Faol markaz — H-klaster</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>[2Fe] subklaster:</strong> 2 ta Fe + CO, CN⁻, S ko'prik</li>
                  <li>• <strong>[4Fe-4S] klaster:</strong> S orqali bog'langan</li>
                  <li>• <strong>Jami 6 ta Fe</strong> — murakkab klaster</li>
                  <li>• <strong>Fe−Fe masofasi:</strong> ~2.6 Å (to'g'ridan-to'g'ri bog'lanish)</li>
                  <li>• <strong>Ditiometilamin (azaditiolat)</strong> ko'prik ligand — NH guruhi proton tashuvchi!</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">[NiFe] dan farqlari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Faolligi yuqori:</strong> k_cat ~10⁴ s⁻¹ (H₂ sintezi) — [NiFe] dan ~10-100 marta tezroq</li>
                  <li>• <strong>O₂ ga sezgir:</strong> [NiFe] chidamli, [FeFe] qaytmas denaturatsiyalanadi</li>
                  <li>• <strong>Azaditiolat ko'prik:</strong> NH proton tashishda ishtirok etadi</li>
                  <li>• <strong>CO soni:</strong> [FeFe] da 3 ta CO, [NiFe] da 1 ta CO + 2 CN⁻</li>
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
                <p className="text-yellow-400 font-bold text-xs mb-1">Organometallik bog'lar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Fe−CO:</strong> π-akseptor ligand — metall elektron zichligini qaytaradi</li>
                  <li>• <strong>Fe−CN⁻:</strong> kuchli σ-donor + π-akseptor</li>
                  <li>• <strong>CO va CN⁻ birgalikda</strong> — Fe ning elektron holatini nozik sozlaydi</li>
                  <li>• <strong>ν(CO) IQ signali</strong> — elektron zichlik indikatori sifatida</li>
                  <li>• ν(CO) oksidlangan holatda yuqori (~2070 sm⁻¹), qaytarilganda past (~1940 sm⁻¹)</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ko'p yadroli klaster</p>
                <ul className="text-xs space-y-0.5">
                  <li>• [NiFe]: <strong>ikki yadroli</strong> (Ni−Fe) + [4Fe-4S] + [3Fe-4S]</li>
                  <li>• [FeFe]: <strong>olti yadroli</strong> ([2Fe] + [4Fe-4S])</li>
                  <li>• <strong>S²⁻ ko'prik ligandlar</strong> — klaster strukturasi asosi</li>
                  <li>• Metall-metall to'g'ridan-to'g'ri bog'lanish</li>
                  <li>• <strong>Aralash valentli:</strong> Fe²⁺/Fe⁺ turli oksidlanish darajalarida</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Elektron tuzilish va spin holatlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• [NiFe]: Ni²⁺ (d⁸), Fe²⁺ (d⁶, past spin) — <strong>EPR faol holatlar</strong></li>
                  <li>• <strong>Ni-A (noaktiv):</strong> Ni³⁺ + Fe²⁺ — oksidlangan, EPR signali bor</li>
                  <li>• <strong>Ni-C (faol):</strong> Ni³⁺/Ni⁺ + Fe²⁺ — gidrid bog'langan</li>
                  <li>• <strong>Ni-R (qaytarilgan):</strong> Ni²⁺ + Fe²⁺ — EPR signali yo'q</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Proton tashish yo'llari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Azaditiolat (NH):</strong> [FeFe] da — proton qabul qiluvchi/beruvchi</li>
                  <li>• <strong>Glu qoldig'i:</strong> [NiFe] da — proton o'tkazish yo'li</li>
                  <li>• Proton <strong>Grotthuss mexanizmi</strong> orqali suv zanjiri bo'ylab harakatlanadi</li>
                  <li>• Proton va elektron <strong>alohida yo'llar</strong> orqali uzatiladi</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "energiya" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-cyan-400 font-bold">Vodorod energetikasi — kelajak texnologiyasi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Gidrogenaza asosidagi bioyoqilg'i elementlari</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Gidrogenaza <strong>elektrodga</strong> immobilizatsiya qilinadi</li>
                  <li>• H₂ oksidlanishi → elektronlar <strong>tok manbai</strong> sifatida</li>
                  <li>• <strong>Afzallik:</strong> platina katalizatoriga nisbatan arzon</li>
                  <li>• <strong>Kamchilik:</strong> O₂ ga sezgirlik, barqarorlik past</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sun'iy fotosintez — H₂ ishlab chiqarish</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Gidrogenaza + fotosistema I — <strong>yorug'likdan H₂</strong></li>
                  <li>• Suv + yorug'lik → H₂ + O₂ (sun'iy fotosintez)</li>
                  <li>• <strong>Quyosh energiyasini saqlash</strong> — vodorod yoqilg'isi sifatida</li>
                  <li>• Hozirgi samaradorlik: ~5-10% (tabiiy fotosintez ~3-6%)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Gidrogenaza() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/nitrogenaza" className="text-purple-400 hover:text-purple-300 text-lg">← Nitrogenaza</Link>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">💧 Gidrogenaza</h1>
          <p className="text-purple-400 text-sm">[NiFe] • [FeFe] • H₂ ↔ 2H⁺ + 2e⁻ • CO/CN⁻ • Vodorod energetikasi</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Gidrogenaza — vodorod metabolizmi fermenti</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-cyan-400">Gidrogenaza</strong> — 
              <strong> H₂ ⇌ 2H⁺ + 2e⁻</strong> reversibil reaksiyasini katalizlaydigan metalloferment.
              Ikki asosiy turi mavjud: <strong>[NiFe]-gidrogenaza</strong> (oksidlanishga chidamli,
              asosan H₂ oksidlaydi) va <strong>[FeFe]-gidrogenaza</strong> (H₂ sintezi bo'yicha 
              ~100 marta faolroq, lekin O₂ ga o'ta sezgir). Faol markazda 
              <strong className="text-yellow-400">CO va CN⁻ kabi noyob biologik ligandlar</strong> mavjud — 
              bu organometallik bog'lar (Fe−CO) biologik tizimdagi kam uchraydigan namunalardan.
              Gidrogenaza <strong>vodorod energetikasi</strong> uchun muhim biologik ilhom manbaidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-center">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">H₂ ⇌ 2H⁺ + 2e⁻</p>
              <p className="text-purple-300">Reversibil reaksiya</p>
              <p className="text-purple-400 mt-1">
                E°' = −413 mV (pH=7). Yo'nalish hujayra metabolik holatiga bog'liq.
                Biologik vodorod almashinuvi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">Fe−CO</p>
              <p className="text-purple-300">Biologik organometallik bog'</p>
              <p className="text-purple-400 mt-1">
                Karbonil (CO) va sianid (CN⁻) — noyob biologik ligandlar.
                Faqat gidrogenazalarda uchraydi.
              </p>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <p className="text-cyan-400 font-bold text-lg">~10⁴ s⁻¹</p>
              <p className="text-purple-300">[FeFe] faolligi — k_cat</p>
              <p className="text-purple-400 mt-1">
                H₂ sintezi bo'yicha eng faol biologik katalizator.
                Sun'iy analoglar hali yetib kelmagan.
              </p>
            </div>
          </div>
        </div>

        {/* [NiFe] STRUKTURASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">🔬 [NiFe]-gidrogenaza — oksidlanishga chidamli</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-cyan-400">[NiFe]-gidrogenaza</strong> — 
              ko'proq H₂ oksidlanishiga ixtisoslashgan. Faol markazi:
              <strong> Ni²⁺ va Fe²⁺</strong> ionlari 2 ta sisteinat (Cys-S⁻) ko'prigi orqali
              bog'langan. Fe²⁺ ga <strong>2 ta CN⁻ va 1 ta CO</strong> ligand sifatida
              koordinatsiyalangan — bu noyob biologik organometallik bog'lar.
              Ni²⁺ ga 4 ta Cys(S) ligand (2 tasi ko'prik, 2 tasi terminal).
              <strong> O₂ ga nisbatan chidamliroq</strong> — [FeFe] dan farqli.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">Ni markazi</p>
              <ul className="space-y-0.5">
                <li>• <strong>4 ta Cys(S⁻)</strong> — 2 tasi ko'prik (Fe bilan), 2 tasi terminal</li>
                <li>• <strong>Ni²⁺ (d⁸)</strong> — kvadrat tekislik yoki kvadrat piramida</li>
                <li>• Ni−S masofalari: ~2.2-2.3 Å</li>
                <li>• Redoks faol: Ni²⁺/Ni³⁺/Ni⁺ o'tishlari</li>
                <li>• <strong>H₂ bog'lanadigan asosiy joy</strong></li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">Fe markazi</p>
              <ul className="space-y-0.5">
                <li>• <strong>2×CN⁻ + 1×CO</strong> — kuchli maydon ligandlari</li>
                <li>• <strong>Fe²⁺ (d⁶, past spin)</strong> — diamagnit</li>
                <li>• <strong>2 ta Cys(S⁻)</strong> — Ni bilan ko'prik</li>
                <li>• <strong>Oktaedrik geometriya</strong> (buzilgan)</li>
                <li>• Redoks faol emas (past spin, barqaror)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* [FeFe] STRUKTURASI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ [FeFe]-gidrogenaza — H₂ sintezi chempioni</h2>
          
          <div className="bg-cyan-600/10 border border-cyan-500/30 rounded-xl p-5 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              <strong className="text-cyan-400">[FeFe]-gidrogenaza</strong> — 
              H₂ sintezi bo'yicha eng faol biologik katalizator (k_cat ~10⁴ s⁻¹).
              Faol markazi — <strong>H-klaster</strong>: [2Fe] subklaster + [4Fe-4S] klaster.
              [2Fe] da <strong>azaditiolat ko'prik</strong> (S−CH₂−NH−CH₂−S) mavjud — 
              markaziy NH guruhi <strong>proton tashuvchi</strong> sifatida ishlaydi.
              <strong> O₂ ga o'ta sezgir</strong> — qaytmas denaturatsiyalanadi.
              Bu ferment <strong>yorug'lik yordamida H₂ ishlab chiqarish</strong> 
              (sun'iy fotosintez) uchun ilhom manbaidir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">[2Fe] subklaster</p>
              <ul className="space-y-0.5">
                <li>• <strong>2 ta Fe</strong> — har biriga CO + CN⁻ ligandlar</li>
                <li>• <strong>Azaditiolat ko'prik:</strong> S−CH₂−NH−CH₂−S</li>
                <li>• <strong>Fe−Fe masofasi:</strong> ~2.6 Å</li>
                <li>• <strong>3 ta CO</strong> — terminal + ko'prik holatda bo'lishi mumkin</li>
                <li>• <strong>2 ta CN⁻</strong> — terminal ligandlar</li>
              </ul>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-cyan-400 font-bold mb-2">[4Fe-4S] klaster</p>
              <ul className="space-y-0.5">
                <li>• <strong>Kuban tipidagi klaster</strong></li>
                <li>• 4 ta Fe + 4 ta S — almashinuvchi burchaklarda</li>
                <li>• <strong>1 ta S</strong> [2Fe] subklasterga ko'prik qiladi</li>
                <li>• Elektronlarni o'tkazish vazifasi</li>
                <li>• Oqsilga <strong>Cys(S⁻)</strong> orqali bog'langan</li>
              </ul>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <GidrogenazaSlayder />
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Gidrogenaza — <strong className="text-cyan-400">H₂ ⇌ 2H⁺ + 2e⁻</strong> reversibil katalizatori</li>
            <li><strong className="text-cyan-400">[NiFe]</strong> — oksidlanishga chidamli, H₂ oksidlaydi; <strong className="text-cyan-400">[FeFe]</strong> — H₂ sintezi chempioni (k_cat ~10⁴ s⁻¹)</li>
            <li>Faol markazda <strong className="text-cyan-400">CO va CN⁻ organometallik ligandlar</strong> — noyob biologik bog'lar</li>
            <li><strong className="text-cyan-400">Azaditiolat ko'prik</strong> [FeFe] da — proton tashish mexanizmi</li>
            <li><strong className="text-cyan-400">Vodorod energetikasi</strong> uchun ilhom manbai — sun'iy fotosintez, bioyoqilg'i elementlari</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/nitrogenaza" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Nitrogenaza</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/sitoxrom-p450" className="px-6 py-3 bg-cyan-600/80 rounded-xl hover:bg-cyan-500 text-white font-semibold">Sitoxrom P450 →</Link>
        </div>

      </section>
    </main>
  )
}