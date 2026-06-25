"use client"

import Link from "next/link"
import { useState } from "react"

function KASlayder() {
  const [tab, setTab] = useState("mexanizm")

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "mexanizm", label: "⚡ Mexanizm" },
          { key: "struktura", label: "🧬 Tuzilish" },
          { key: "kb", label: "⚛️ KB aloqasi" },
          { key: "ingibitor", label: "💊 Ingibitorlar" },
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
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Katalitik mexanizm — Zn−OH nukleofil hujumi</h4>
            <div className="bg-purple-900/50 rounded-lg p-4">
              <p className="text-yellow-400 font-bold text-xs mb-2">To'liq katalitik sikl (4 bosqich):</p>
              <ol className="text-xs space-y-2 list-decimal list-inside">
                <li>
                  <strong>Zn−OH₂ → Zn−OH⁻ + H⁺</strong>
                  <br/><span className="text-purple-400">Zn²⁺ suvni ionlashtiradi — pK_a ~7 (erkin suvda 15.7!). Metall Lyuis kislotasi sifatida suvning protonini oson ajratadi.</span>
                </li>
                <li>
                  <strong>Zn−OH⁻ + CO₂ → Zn−HCO₃⁻</strong>
                  <br/><span className="text-purple-400">Zn−OH nukleofili CO₂ markazidagi C atomiga hujum qiladi. HCO₃⁻ Zn ga bog'lanadi.</span>
                </li>
                <li>
                  <strong>Zn−HCO₃⁻ + H₂O → Zn−OH₂ + HCO₃⁻</strong>
                  <br/><span className="text-purple-400">H₂O molekulasi bikarbonatni siqib chiqaradi — ligand almashinish reaksiyasi.</span>
                </li>
                <li>
                  <strong>His64 — proton tashuvchi:</strong> Faol markazdan protonni olib, buferga uzatadi. Bu <strong>proton o'tkazish yo'li</strong> orqali sodir bo'ladi.
                </li>
              </ol>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 mt-2">
              <p className="text-amber-400 font-bold text-xs mb-1">Asosiy ko'rsatkichlar:</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div><strong className="text-yellow-400">k_cat</strong><br/>~10⁶ s⁻¹</div>
                <div><strong className="text-yellow-400">K_M</strong><br/>~10 mM (CO₂)</div>
                <div><strong className="text-yellow-400">k_cat/K_M</strong><br/>~10⁸ M⁻¹s⁻¹ — diffuziya chegarasida!</div>
              </div>
            </div>
          </div>
        )}

        {tab === "struktura" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Zn²⁺ faol markazi — tetraedrik geometriya</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ligandlar:</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>His94</strong> — N-donor (imidazol)</li>
                  <li>• <strong>His96</strong> — N-donor (imidazol)</li>
                  <li>• <strong>His119</strong> — N-donor (imidazol)</li>
                  <li>• <strong>H₂O / OH⁻</strong> — 4-koordinatsion o'rin (katalitik suv)</li>
                  <li>• <strong>Geometriya:</strong> buzilgan tetraedr</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Nima uchun aynan Zn²⁺?</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d¹⁰ konfiguratsiya</strong> — CFSE = 0, geometriya erkin</li>
                  <li>• <strong>Redoks faol emas</strong> — faqat Lyuis kislotasi</li>
                  <li>• <strong>Kuchli Lyuis kislotasi</strong> — suvni ionlashtiradi</li>
                  <li>• <strong>Labillik:</strong> ligand almashinishi tez (d¹⁰ — inertlik yo'q)</li>
                  <li>• Boshqa metallar: Co²⁺ — faol, lekin sekinroq; Cd²⁺ — zaharl i</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "kb" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Koordinatsion birikmalar nuqtai nazaridan</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Tetraedrik Zn²⁺ — nima uchun?</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>d¹⁰:</strong> barcha d-orbitallar to'lgan — CFSE = 0</li>
                  <li>• <strong>Geometriya:</strong> ligandlar orasidagi itarilish minimal → tetraedr</li>
                  <li>• <strong>4-koordinatsion:</strong> Zn²⁺ uchun optimal (oktaedrikdan ko'ra barqaror)</li>
                  <li>• <strong>Xelat effekti yo'q:</strong> 3 ta His alohida ligandlar</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Lyuis kislotasi sifatida Zn²⁺</p>
                <ul className="text-xs space-y-0.5">
                  <li>• Zn²⁺ — <strong>chegaraviy kislota</strong> (HSAB: qattiq va yumshoq orasida)</li>
                  <li>• His (N-donor) — <strong>chegaraviy asos</strong> — mos keladi</li>
                  <li>• H₂O — <strong>qattiq asos</strong>, lekin Zn²⁺ bog'lay oladi</li>
                  <li>• Zn²⁺ suvning pK_a sini <strong>15.7 dan ~7 ga tushiradi</strong></li>
                  <li>• Zn−OH⁻ — <strong>kuchli nukleofil</strong>, CO₂ ga hujum qiladi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Ligand almashinish kinetikasi</p>
                <ul className="text-xs space-y-0.5">
                  <li>• d¹⁰ — <strong>labillik</strong> (CFSE=0, o'tish holati energiyasi past)</li>
                  <li>• Suv almashinish tezligi: <strong>~10⁷ s⁻¹</strong> (juda tez)</li>
                  <li>• d⁸ (Ni²⁺), d⁶ (Fe²⁺ LS) — <strong>inert</strong>, sekin almashinadi</li>
                  <li>• <strong>Tabiat Zn ni tanlagan</strong> — tez almashinish + Lyuis kislotaligi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sun'iy modellar — biomimetik KB</p>
                <ul className="text-xs space-y-0.5">
                  <li>• [Zn(L)₃(OH)]⁺ — tris(pirazolil)borat ligandli modellar</li>
                  <li>• Sun'iy analoglar k_cat ~10³-10⁴ s⁻¹ — tabiiydan sekinroq</li>
                  <li>• <strong>Oqsil muhitining roli:</strong> proton o'tkazish yo'li, gidrofob cho'ntak</li>
                  <li>• Ikkinchi koordinatsion sfera — <strong>His64 proton tashuvchi</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {tab === "ingibitor" && (
          <div className="space-y-3 text-sm text-purple-200">
            <h4 className="text-amber-400 font-bold">Karboangidraza ingibitorlari — dori vositalari</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Sulfanilamidlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• R−SO₂NH₂ — Zn²⁺ ga <strong>SO₂NH⁻</strong> sifatida bog'lanadi</li>
                  <li>• <strong>Koordinatsion bog':</strong> Zn−N (sulfanilamid anion)</li>
                  <li>• <strong>Tetraedrik geometriya</strong> saqlanadi</li>
                  <li>• <strong>Dori misollari:</strong> atsetazolamid (Diamox) — glaukoma, tog' kasalligi</li>
                </ul>
              </div>
              <div className="bg-purple-900/50 rounded-lg p-3">
                <p className="text-yellow-400 font-bold text-xs mb-1">Boshqa ingibitorlar</p>
                <ul className="text-xs space-y-0.5">
                  <li>• <strong>Anionlar:</strong> CN⁻, N₃⁻, SCN⁻ — Zn ga bevosita bog'lanadi</li>
                  <li>• <strong>Hg²⁺, Cu²⁺:</strong> Cys qoldiqlariga bog'lanib fermentni denaturatsiyalaydi</li>
                  <li>• <strong>Sulfamidlar:</strong> topiramat (Epilepsiyaga qarshi)</li>
                  <li>• <strong>Selektivlik:</strong> 15 ta KA izoformasi — turli to'qimalarda</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Karboangidraza() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-950 to-blue-950 text-white">
      
      <header className="flex items-center gap-4 px-6 py-4 border-b border-purple-800/50">
        <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar" className="text-purple-400 hover:text-purple-300 text-lg">← Metallofermentlar</Link>
        <div>
          <h1 className="text-2xl font-bold text-amber-400">🫁 Karboangidraza (KA)</h1>
          <p className="text-purple-400 text-sm">Zn²⁺ • Tetraedrik • CO₂ ↔ HCO₃⁻ • Proton tashish</p>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* KIRISH */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">📋 Karboangidraza — Zn²⁺ fermenti</h2>
          
          <div className="bg-amber-600/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <p className="text-purple-200 text-lg leading-relaxed">
              <strong className="text-amber-400">Karboangidraza (KA)</strong> — 
              <strong> Zn²⁺ ioni</strong> saqlovchi metalloferment. 
              Asosiy reaksiyasi: <strong>CO₂ + H₂O ⇌ HCO₃⁻ + H⁺</strong>.
              Bu — <strong>eng tezkor fermentlardan biri</strong> (k_cat ~10⁶ s⁻¹).
              KA inson organizmida nafas olish, pH muvozanati, ko'z suyuqligi ishlab 
              chiqarish va ko'plab boshqa jarayonlarda ishtirok etadi.
              Zn²⁺ — <strong className="text-yellow-400">d¹⁰ konfiguratsiyali</strong> metall, 
              geometriyasi <strong>tetraedrik</strong>, redoks faol emas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Umumiy xususiyatlar</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Metall:</strong> Zn²⁺ (d¹⁰, S=0, diamagnit)</li>
                <li>• <strong>Koordinatsion son:</strong> 4 (tetraedrik)</li>
                <li>• <strong>Ligandlar:</strong> 3×His (imidazol) + H₂O/OH⁻</li>
                <li>• <strong>Molekulyar massa:</strong> ~29 kDa (monomer)</li>
                <li>• <strong>Izoformalar:</strong> 15 ta (inson) — turli to'qimalarda</li>
              </ul>
            </div>
            <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
              <h3 className="text-amber-400 font-bold mb-2">Fiziologik ahamiyati</h3>
              <ul className="text-purple-200 text-sm space-y-1">
                <li>• <strong>Nafas olish:</strong> Qonda CO₂ ni HCO₃⁻ ga aylantiradi</li>
                <li>• <strong>pH muvozanati:</strong> HCO₃⁻/CO₂ bufer tizimi</li>
                <li>• <strong>Ko'z:</strong> Ko'z ichi suyuqligi sekretsiyasi</li>
                <li>• <strong>Buyrak:</strong> Kislota-asos muvozanati</li>
                <li>• <strong>Oshqozon:</strong> HCl sekretsiyasi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* KATALITIK MEXANIZM */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">⚡ Katalitik mexanizm — Zn−OH nukleofil hujumi</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30 mb-4">
            <p className="text-purple-200 text-sm leading-relaxed">
              Karboangidraza mexanizmi <strong className="text-yellow-400">koordinatsion kimyo</strong> 
              nuqtai nazaridan juda chiroyli. Zn²⁺ ioni 
              <strong> Lyuis kislotasi</strong> sifatida bog'langan suv molekulasining 
              pK_a sini <strong>15.7 dan ~7 gacha</strong> pasaytiradi. Hosil bo'lgan 
              <strong> Zn−OH⁻</strong> — kuchli nukleofil — CO₂ molekulasiga hujum qilib, 
              <strong> Zn−HCO₃⁻</strong> hosil qiladi. Keyin suv molekulasi bikarbonatni 
              almashlab, sikl takrorlanadi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold text-lg">pK_a ~7</p>
              <p className="text-purple-300">Zn−OH₂ ning kislotaligi</p>
              <p className="text-purple-400 mt-1">Erkin suvda pK_a = 15.7 — Zn uni 10⁸ marta kuchliroq kislota qilgan!</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold text-lg">~10⁶ s⁻¹</p>
              <p className="text-purple-300">k_cat — aylanish soni</p>
              <p className="text-purple-400 mt-1">Har sekundda 1 million CO₂ molekulasi qayta ishlanadi</p>
            </div>
            <div className="bg-purple-900/50 rounded-lg p-3 text-center">
              <p className="text-amber-400 font-bold text-lg">15.7 → 7</p>
              <p className="text-purple-300">pK_a pasayishi</p>
              <p className="text-purple-400 mt-1">Zn²⁺ Lyuis kislotasi effekti — suvning protonini tortib oladi</p>
            </div>
          </div>
        </div>

        {/* INTERAKTIV SLAYDER */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <KASlayder />
        </div>

        {/* PROTON O'TKAZISH YO'LI */}
        <div className="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">💧 Proton o'tkazish yo'li — ikkinchi koordinatsion sfera</h2>
          
          <div className="bg-purple-800/30 rounded-xl p-5 border border-purple-700/30">
            <p className="text-purple-200 text-sm mb-3">
              <strong className="text-yellow-400">KB tushunchasi:</strong> Faqat birinchi koordinatsion sfera 
              emas, <strong>ikkinchi koordinatsion sfera</strong> ham katalizda muhim rol o'ynaydi.
              His64 qoldig'i <strong>proton tashuvchi</strong> sifatida ishlaydi.
            </p>
            <div className="bg-purple-900/50 rounded-lg p-4 text-xs text-purple-200">
              <p className="text-amber-400 font-bold mb-2">Proton yo'li ketma-ketligi:</p>
              <p>
                Zn−OH₂ → Zn−OH⁻ + <strong>H⁺</strong> → 
                <span className="text-yellow-400"> His64-H⁺</span> → 
                <span className="text-purple-400"> H₂O ko'prigi (2-3 molekula)</span> → 
                <span className="text-green-400"> bufer (HCO₃⁻, fosfat)</span>
              </p>
              <p className="mt-2">
                Bu — <strong>Grotthuss mexanizmi</strong> bo'yicha proton uzatish. 
                Suv molekulalari zanjiri orqali proton "sakrab" o'tadi. 
                His64 bu zanjirni boshlaydi va tugatadi.
              </p>
            </div>
          </div>
        </div>

        {/* XULOSA */}
        <div className="bg-gradient-to-r from-amber-600/10 to-purple-600/10 border border-amber-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">✅ Asosiy xulosalar</h2>
          <ol className="space-y-2 text-purple-200 list-decimal list-inside">
            <li>Karboangidraza — <strong className="text-amber-400">Zn²⁺ saqlovchi metalloferment</strong>, CO₂ ni HCO₃⁻ ga aylantiradi</li>
            <li>Zn²⁺ — <strong className="text-amber-400">d¹⁰, tetraedrik, redoks faol emas</strong> — ideal Lyuis kislotasi</li>
            <li>Zn²⁺ suvning pK_a sini <strong className="text-amber-400">15.7 dan ~7 ga tushiradi</strong> — Zn−OH kuchli nukleofil</li>
            <li>Reaksiya <strong className="text-amber-400">diffuziya chegarasida</strong> — k_cat ~10⁶ s⁻¹</li>
            <li>Ingibitorlar (sulfanilamidlar) <strong className="text-amber-400">Zn ga bevosita bog'lanadi</strong> — dori vositasi sifatida</li>
          </ol>
        </div>

        <div className="flex justify-between pt-6">
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar" className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-800/50 text-purple-300">← Metallofermentlar</Link>
          <Link href="/ilmiy/chuqurlashgan/bioanorganik/metallofermentlar/superoksid-dismutaza" className="px-6 py-3 bg-amber-600/80 rounded-xl hover:bg-amber-500 text-white font-semibold">SOD →</Link>
        </div>

      </section>
    </main>
  )
}