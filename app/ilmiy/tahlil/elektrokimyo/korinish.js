"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const ELEKTROKIMYO_NAMUNALARI = [
  {
    kompleks: "[Fe(C₅H₅)₂] (Ferrosen)",
    redoksJuft: "Fc⁺ / Fc⁰",
    e12: "+0.400 V (vs NHE)",
    deltaEp: "59 mV",
    reversivlik: "Qaytar (Reversible, 1e⁻)",
    ahamiyat: "IUPAC xalqaro elektrokimyoviy redoks standarti",
  },
  {
    kompleks: "[Fe(CN)₆]³⁻ / [Fe(CN)₆]⁴⁻",
    redoksJuft: "Fe(III) / Fe(II)",
    e12: "+0.360 V (vs NHE)",
    deltaEp: "60 mV",
    reversivlik: "Qaytar (Reversible, 1e⁻)",
    ahamiyat: "Standart anorganik bitta elektronli redoks mediator",
  },
  {
    kompleks: "[Ru(bpy)₃]³⁺ / [Ru(bpy)₃]²⁺",
    redoksJuft: "Ru(III) / Ru(II)",
    e12: "+1.260 V (vs NHE)",
    deltaEp: "62 mV",
    reversivlik: "Qaytar (Reversible, 1e⁻)",
    ahamiyat: "Fotoredoks kataliz va quyosh batareyalari",
  },
  {
    kompleks: "[Co(NH₃)₆]³⁺ / [Co(NH₃)₆]²⁺",
    redoksJuft: "Co(III) / Co(II)",
    e12: "+0.100 V (vs NHE)",
    deltaEp: "> 200 mV",
    reversivlik: "Qaytmas (Irreversible — t₂g⁶ vs t₂g⁵eg²)",
    ahamiyat: "Kuchli fazoviy va spin qayta tashkillanish energiyasi (λ)",
  },
  {
    kompleks: "[Cu(en)₂]²⁺ / [Cu(en)₂]⁺",
    redoksJuft: "Cu(II) / Cu(I)",
    e12: "-0.380 V (vs NHE)",
    deltaEp: "120 mV",
    reversivlik: "Kvazi-qaytar (Kvadrat planar → Tetraedr)",
    ahamiyat: "Geometriya o'zgarishi tufayli kinetik to'siq",
  },
  {
    kompleks: "sis-[PtCl₂(NH₃)₂] (Sisplatin)",
    redoksJuft: "Pt(IV) / Pt(II)",
    e12: "+0.850 V (vs NHE)",
    deltaEp: "> 350 mV",
    reversivlik: "Qaytmas (2e⁻ ajralish va ligand yo'qotish)",
    ahamiyat: "Saraton hujayralarida bio-reduksiya faollashuvi",
  },
];

export default function ElektrokimyoKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Siklik Voltamperometriya (CV) Kalkulyatori
  const [eOksidlanish, setEOksidlanish] = useState(0.43); // Epa (V)
  const [eQaytarilish, setEQaytarilish] = useState(0.37); // Epc (V)
  const [skanerTezligi, setSkanerTezligi] = useState(100); // mV/s

  const eYarim = ((eOksidlanish + eQaytarilish) / 2).toFixed(3);
  const deltaEpMV = (Math.abs(eOksidlanish - eQaytarilish) * 1000).toFixed(1);
  const qaytuvchanmi = Math.abs(Number(deltaEpMV) - 59) <= 15;

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
              <Ikon nom="chaqmoq" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Siklik Voltamperometriya (CV)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Redoks potensiallar (E1/2), elektron ko{"'"}chish kinetikasi va qaytuvchanlik mezoni
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
        {/* BIRIKMALAR ELEKTROKIMYOVIY BAZASIGA O'TISH KARTASI */}
        <Link
          href="/ilmiy/tahlil/elektrokimyo/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="chaqmoq" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning Elektrokimyoviy Tahlili Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Ferrosen, [Fe(CN)₆]³⁻/⁴⁻, [Ru(bpy)₃]²⁺, [Co(NH₃)₆]³⁺ va boshqa komplekslarning redoks potensiallari,
                siklik voltammogrammalari, diffuziya koeffitsientlari hamda qaytuvchanlik parametrlari.
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
              <span>Siklik Voltamperometriyaning Fizik-Kimyoviy Asoslari</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">Siklik voltamperometriya (CV)</strong> — kompleks birikmalarning
            <strong> elektron qabul qilish (qaytarilish)</strong> va <strong>elektron berish (oksidlanish)</strong>
            qobiliyatini dinamik potensial o{"'"}zgarishi sharoitida o{"'"}rganuvchi asosiy elektrokimyoviy metoddir.
            Ushbu usul yordamida standart redoks potensial (E1/2), elektronlar soni (n),
            reversivlik (ΔEp = 59 mV/n) va oraliq radikal ionlar barqarorligi aniqlanadi.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-[var(--v3-urgu)]">E1/2 = (Epa + Epc)/2</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Yarim To{"'"}lqin Potensiali</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-cyan-400">ΔEp = 59 mV / n</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Nernst Qaytuvchanlik Mezoni</div>
            </div>
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1">
              <div className="text-lg font-bold text-emerald-400">Ip ∝ v^(1/2)</div>
              <div className="text-[10px] text-[var(--v3-xira)] uppercase">Randles-Sevcik Diffuziyasi</div>
            </div>
          </div>
        </div>

        {/* 2. INTERAKTIV CV KALKULYATORI VA VOLTAMMOGRAMMA TAHLILI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Interaktiv Simulyator</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Nernst Reversivlik va Redoks Potensial Kalkulyatori</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] block">Anod piki Epa (V):</label>
              <input
                type="number"
                step="0.01"
                value={eOksidlanish}
                onChange={(e) => setEOksidlanish(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] block">Katod piki Epc (V):</label>
              <input
                type="number"
                step="0.01"
                value={eQaytarilish}
                onChange={(e) => setEQaytarilish(Number(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] block">Skaner tezligi (mV/s):</label>
              <select
                value={skanerTezligi}
                onChange={(e) => setSkanerTezligi(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              >
                <option value={20}>20 mV/s</option>
                <option value={50}>50 mV/s</option>
                <option value={100}>100 mV/s (Standart)</option>
                <option value={200}>200 mV/s</option>
                <option value={500}>500 mV/s</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Formal Redoks Potensiali:</div>
              <div className="text-2xl font-black text-[var(--v3-urgu)]">
                E1/2 = {eYarim} V
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Piklar orasidagi masofa (ΔEp):</div>
              <div className={`text-lg font-bold ${qaytuvchanmi ? "text-emerald-400" : "text-amber-400"}`}>
                ΔEp = {deltaEpMV} mV {qaytuvchanmi ? "(Qaytar — 1e⁻ Reversible)" : "(Kvazi-qaytar / Qaytmas)"}
              </div>
            </div>
          </div>
        </div>

        {/* 3. KOMPLEKSLAR REDOKS JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Eksperimental Ma{"'"}lumotlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Etalon Komplekslarning Siklik Voltamperometriya Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Redoks Juft</th>
                  <th className="py-2.5 px-3">E1/2 (V vs NHE)</th>
                  <th className="py-2.5 px-3">ΔEp (mV)</th>
                  <th className="py-2.5 px-3">Reversivlik Turi</th>
                  <th className="py-2.5 px-3">Ilmiy Ahamiyati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {ELEKTROKIMYO_NAMUNALARI.map((k, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)] whitespace-nowrap">
                      {k.kompleks}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400">{k.redoksJuft}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{k.e12}</td>
                    <td className="py-2.5 px-3 text-amber-400">{k.deltaEp}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{k.reversivlik}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{k.ahamiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/magnit"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>Magnitometriya</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/termik"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>Termik tahlil (TGA / DSC)</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
