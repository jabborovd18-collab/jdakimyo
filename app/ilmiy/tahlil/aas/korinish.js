"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ═══════════════════════════════════════════════════════════════════════════════
// AAS — ATOM-ABSORBTSION SPEKTROSKOPIYA (V3 ENSIKLOPEDIYA)
// ═══════════════════════════════════════════════════════════════════════════════

const AAS_METALLARI = [
  { metall: "Cu (Mis)", chiziq: "324.75 nm", sezgirlik: "0.02 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "Klassik mis komplekslari ([Cu(NH₃)₄]²⁺, [Cu(H₂O)₆]²⁺)" },
  { metall: "Fe (Temir)", chiziq: "248.33 nm", sezgirlik: "0.05 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "Gemsimon, ferrosen va Fe(II)/Fe(III) komplekslari" },
  { metall: "Co (Kobalt)", chiziq: "240.73 nm", sezgirlik: "0.05 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "Werner kobalt komplekslari ([Co(NH₃)₆]³⁺, [Co(en)₃]³⁺)" },
  { metall: "Ni (Nikel)", chiziq: "232.00 nm", sezgirlik: "0.04 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "[Ni(CN)₄]²⁻, [Ni(en)₃]²⁺ komplekslari" },
  { metall: "Pt (Platina)", chiziq: "265.95 nm", sezgirlik: "0.002 mg/L", alanga: "Grafit pechi (2700°C)", usul: "GFAAS (Grafit)", izoh: "Sisplatin, oksaliplatin va Pt(II)/Pt(IV) dorilari" },
  { metall: "Ru (Ruteniy)", chiziq: "349.89 nm", sezgirlik: "0.005 mg/L", alanga: "N₂O-Asetilen (2900°C)", usul: "Yuqori harorat (N₂O)", izoh: "[Ru(bpy)₃]²⁺ fotokimyoviy komplekslari" },
  { metall: "Cr (Xrom)", chiziq: "357.87 nm", sezgirlik: "0.04 mg/L", alanga: "N₂O-Asetilen (2900°C)", usul: "Alanga AAS (FAAS)", izoh: "[Cr(H₂O)₆]³⁺, [Cr(acac)₃] komplekslari" },
  { metall: "Mn (Marganes)", chiziq: "279.48 nm", sezgirlik: "0.01 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "Mn(II) va bioanorganik klasterlar" },
  { metall: "Ag (Kumush)", chiziq: "328.07 nm", sezgirlik: "0.01 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "[Ag(NH₃)₂]⁺, kumush dori vositalari" },
  { metall: "Zn (Rux)", chiziq: "213.86 nm", sezgirlik: "0.005 mg/L", alanga: "Havo-Asetilen (2300°C)", usul: "Alanga AAS (FAAS)", izoh: "[Zn(OH)₄]²⁻, metallofermentlar" }
];

export default function AASKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // AAS Kalibrlash Simulyatori (A = k * C * l)
  const [konsentratsiyaPpm, setKonsentratsiyaPpm] = useState(2.5);
  const [kyuvaQalinligi, setKyuvaQalinligi] = useState(1.0);

  const kKoef = 0.085;
  const hisoblanganAbsorbsiya = (konsentratsiyaPpm * kyuvaQalinligi * kKoef).toFixed(3);
  const otkazuvchanlikFoiz = (Math.pow(10, -Number(hisoblanganAbsorbsiya)) * 100).toFixed(1);

  return (
    <div
      data-fon={fonKaliti}
      className="v3 min-h-screen flex flex-col text-[var(--v3-matn)] bg-[var(--v3-fon)] transition-colors duration-200"
    >
      {/* ─── YUQORI HEADER ─── */}
      <header className="sticky top-0 z-40 border-b px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-[var(--v3-fon-2)]/90 border-[var(--v3-chiziq)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ilmiy/tahlil"
            className="v3-tugma text-xs py-1.5 px-3 flex items-center gap-1.5"
            title="Tahlil usullari ro'yxatiga qaytish"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Tahlil Usullari</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)]">
              <Ikon nom="alanga" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                AAS (Atom-Absorbtsion Spektroskopiya)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Metall ionlarining miqdoriy tahlili, alanga/grafit atomizatsiyasi va kalibrlash
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FonTanlagich fon={fonKaliti} tanla={fonniOzgartir} />
        </div>
      </header>

      {/* ─── ASOSIY MAZMUN ─── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* BIRIKMALAR BAZASI LINKI */}
        <Link
          href="/ilmiy/tahlil/aas/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="alanga" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning AAS Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Kompleks birikmalardagi metall ionlarining miqdoriy AAS tahlili, metall foizi (%M),
                aniqlash chegarasi (LOD/LOQ) va atomlashtirish usullari.
              </p>
            </div>
          </div>

          <div className="v3-tugma v3-tugma-asosiy text-xs py-2.5 px-5 font-bold flex items-center gap-1.5 shrink-0 group-hover:shadow-lg">
            <span>Bazasini Ochish</span>
            <Ikon nom="ong" olcham={14} />
          </div>
        </Link>

        {/* 1. ASOSIY ILMIY NAZARIYA */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Fundamental Metodologiya</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>1. Atom-Absorbtsion Spektroskopiya Metodologiyasi</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-[var(--v3-urgu)]">Atom-Absorbsion Spektroskopiya (AAS)</strong> — erkin metall atomlarining 
            <strong className="text-[var(--v3-urgu)]"> o{"'"}ziga xos to{"'"}lqin uzunligidagi rezonans nurlanishni yutishi</strong>ga asoslangan 
            yuqori aniqlikdagi miqdoriy tahlil usuli. 1955-yilda Alan Walsh tomonidan taklif qilingan. Kompleks birikmalarda 
            <strong className="text-[var(--v3-urgu)]"> metall markazining foiz miqdorini (%M)</strong> aniqlash, 
            brutto-formula validatsiyasi, tozalikni baholash va qo{"'"}shimcha metall kationlarining yo{"'"}qligini tekshirish uchun qo{"'"}llaniladi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-[var(--v3-urgu)]">Nimani aniqlaydi?</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Metall konsentratsiyasi:</strong> mg/L (ppm) yoki μg/L (ppb)</li>
                <li><strong>Metall foizi (%M):</strong> Kompleksdagi aniq metall massasi</li>
                <li><strong>Gidrat/solvat soni:</strong> Bilvosita [MLₙ]·xH₂O formulani tekshirish</li>
                <li><strong>Aralash metall nisbati:</strong> Geterometallik komplekslarda Fe:Co, Pt:Pd</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">Qanday ishlaydi?</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li>Namunali eritma <strong>nebulizator orqali purkaladi</strong></li>
                <li>Alanga yoki grafit pechida <strong>erkin atomlar buluti</strong> hosil bo{"'"}ladi</li>
                <li><strong>Kovak katod lampasi (HCL)</strong> rezonans nur chiqaradi</li>
                <li>Atomlar nurni yutadi — <strong>Beer-Lambert qonuni (A = k·C)</strong> bo{"'"}yicha yutilish o{"'"}lchanadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. UCH XIL ATOMLASHTIRISH USULI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Asbob-Uskunalar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="alanga" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>2. Uch Xil Atomlashtirish Usuli (FAAS, GFAAS, HGAAS)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-amber-400">1. Alanga AAS (FAAS)</h3>
              <p className="text-[var(--v3-matn)]">
                Havo-asetilen (2300°C) yoki N₂O-asetilen (2900°C) alangasi. Tez, arzon va yuqori takrorlanuvchanlik.
              </p>
              <div className="text-[11px] font-mono text-[var(--v3-xira)] pt-2 border-t border-[var(--v3-chiziq)]">
                LOD: 0.01 — 1 ppm • Hajm: 1–5 mL
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">2. Grafit Pechi (GFAAS)</h3>
              <p className="text-[var(--v3-matn)]">
                Elektrotermik isitish (2000–3000°C). 1000 marta yuqori sezgirlik, qattiq va mikromiqdordagi namunalar uchun.
              </p>
              <div className="text-[11px] font-mono text-[var(--v3-xira)] pt-2 border-t border-[var(--v3-chiziq)]">
                LOD: 0.01 — 1 ppb • Hajm: 10–50 μL
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-emerald-400">3. Gidrid Generatsiyasi (HGAAS)</h3>
              <p className="text-[var(--v3-matn)]">
                NaBH₄ bilan reaksiyada uchuvchan gidridlar (AsH₃, SeH₂, SbH₃) hosil qilinadi va kvars kyuvetada o{"'"}lchanadi.
              </p>
              <div className="text-[11px] font-mono text-[var(--v3-xira)] pt-2 border-t border-[var(--v3-chiziq)]">
                LOD: 0.1 — 1 ppt • Sezgirlik maksimal
              </div>
            </div>
          </div>
        </div>

        {/* 3. INTERAKTIV AAS KALIBRATSIYA SIMULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Miqdoriy Kalibrlash</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>3. Interaktiv Kalibrlash va Optik Yutilish Simulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Metall konsentratsiyasi (C):</span>
                <strong className="text-[var(--v3-urgu)] font-mono">{konsentratsiyaPpm} mg/L (ppm)</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={konsentratsiyaPpm}
                onChange={(e) => setKonsentratsiyaPpm(Number(e.target.value) || 0.1)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Alanga optik yo{"'"}li (l):</span>
                <strong className="text-[var(--v3-matn)] font-mono">{kyuvaQalinligi} cm</strong>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={kyuvaQalinligi}
                onChange={(e) => setKyuvaQalinligi(Number(e.target.value) || 1.0)}
                className="w-full accent-[var(--v3-urgu)] cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">O{"'"}lchangan Absorbans (A):</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">A = {hisoblanganAbsorbsiya}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Nurning O{"'"}tkazuvchanligi (T%):</div>
              <div className="text-lg font-bold text-cyan-400">T = {otkazuvchanlikFoiz}%</div>
            </div>
          </div>
        </div>

        {/* 4. METALLAR REZONANS JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Spektral Chiziqlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>4. Asosiy Kompleks Metallarining Rezonans Chiziqlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Metall</th>
                  <th className="py-2.5 px-3">Rezonans λ</th>
                  <th className="py-2.5 px-3">LOD</th>
                  <th className="py-2.5 px-3">Alanga Turi</th>
                  <th className="py-2.5 px-3">Kompleks Namunasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {AAS_METALLARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)]">{m.metall}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{m.chiziq}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{m.sezgirlik}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{m.alanga}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.izoh}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. KOMPLEKSLARDA QO'LLANILISHI & INTERFERENSIYALAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="v3-panel-karta p-6 space-y-3">
            <h3 className="font-bold text-[var(--v3-urgu)] flex items-center gap-2">
              <Ikon nom="belgi" olcham={16} />
              <span>Kompleks Kimyoda 4 Asosiy Qo{"'"}llanish</span>
            </h3>
            <ul className="space-y-2 text-[var(--v3-matn)]">
              <li><strong>1. Brutto-Formula Tasdiqlash:</strong> Nazariy va eksperimental %M taqqoslash (farq &lt; 0.3%).</li>
              <li><strong>2. Tozalikni Baholash:</strong> Katalizator qoldiqlari (masalan, Pd, Ru) ppb darajada aniqlanadi.</li>
              <li><strong>3. Kristallogidrat Suvini Tekshirish:</strong> %M o{"'"}zgarishi orqali x H₂O sonini hisoblash.</li>
              <li><strong>4. Geterometallik Nisbat:</strong> Aralash Fe/Co yoki Pt/Pd klasterlarda stoxiometriyani isbotlash.</li>
            </ul>
          </div>

          <div className="v3-panel-karta p-6 space-y-3">
            <h3 className="font-bold text-cyan-400 flex items-center gap-2">
              <Ikon nom="sozlama" olcham={16} />
              <span>Interferensiyalarni Bartaraf Etish</span>
            </h3>
            <ul className="space-y-2 text-[var(--v3-matn)]">
              <li><strong>Spektral Fon:</strong> Zeyman effekti yoki D₂ (deuteriy) chirog{"'"}i bilan to{"'"}liq korreksiya.</li>
              <li><strong>Fosfat/Sulfat Ta{"'"}siri:</strong> Erish qiyin tuzlarni parchalash uchun La³⁺ (lantan) qo{"'"}shiladi.</li>
              <li><strong>Ionlanish:</strong> Ishqoriy metallar uchun CsCl yoki KCl ionizatsiya buferi solinadi.</li>
              <li><strong>Grafit Modifikator:</strong> Pd(NO₃)₂ + Mg(NO₃)₂ matritsa stabilizatori qo{"'"}llaniladi.</li>
            </ul>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/element-analiz"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Elementar (CHNOS) Tahlil</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/icp"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>ICP-OES / ICP-MS Plazma</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
