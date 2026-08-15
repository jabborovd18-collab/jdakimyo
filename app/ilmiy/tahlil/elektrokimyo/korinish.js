"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

// ═══════════════════════════════════════════════════════════════════════════════
// SIKLIK VOLTAMPEROMETRIYA VA ELEKTROKIMYOVIY TAHLIL (V3 ENSIKLOPEDIYA)
// ═══════════════════════════════════════════════════════════════════════════════

const ELEKTROKIMYO_NAMUNALARI = [
  { komplek: "Ferrosen [Fe(C₅H₅)₂]", juftlik: "Fe(II) / Fe(III)", eYarim: "+0.40 V (vs SCE)", deltaEp: "59 mV", xususiyat: "IUPAC xalqaro ichki etaloni, ideal qaytar 1e⁻ jarayon" },
  { komplek: "[Fe(CN)₆]³⁻ / [Fe(CN)₆]⁴⁻", juftlik: "Fe(III) / Fe(II)", eYarim: "+0.36 V (vs NHE)", deltaEp: "60 mV", xususiyat: "Klassik anorganik redoks standarti (suvli eritmada)" },
  { komplek: "[Ru(bpy)₃]²⁺", juftlik: "Ru(II) / Ru(III)", eYarim: "+1.26 V (vs SCE)", deltaEp: "62 mV", xususiyat: "Fotokimyoviy redoks markaz, quyosh batareyalarida" },
  { komplek: "[Co(NH₃)₆]³⁺ / [Co(NH₃)₆]²⁺", juftlik: "Co(III) / Co(II)", eYarim: "+0.11 V (vs NHE)", deltaEp: "120 mV", xususiyat: "Kvazi-qaytar (t₂g⁶ LS → t₂g⁵eg² HS elektron qayta guruhlanishi)" },
  { komplek: "[Co(en)₃]³⁺ / [Co(en)₃]²⁺", juftlik: "Co(III) / Co(II)", eYarim: "-0.26 V (vs NHE)", deltaEp: "110 mV", xususiyat: "Xelat effekti hisobiga potensial manfiy tomonga siljigan" },
  { komplek: "[Ni(CN)₄]²⁻", juftlik: "Ni(II) / Ni(I) / Ni(III)", eYarim: "-1.45 V (qaytarilish)", deltaEp: "—", xususiyat: "Kvadrat tekislikda qaytmas ko'p bosqichli elektron uzatilishi" }
];

export default function ElektrokimyoKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Interaktiv Randles-Sevcik Tok Simulyatori
  const [skanerTezligiNu, setSkanerTezligiNu] = useState(100); // mV/s
  const [elektronlarN, setElektronlarN] = useState(1);
  const [konsentratsiyaMmol, setKonsentratsiyaMmol] = useState(1.0); // mM

  // ip = 2.69e5 * n^(3/2) * A * D^(1/2) * C * nu^(1/2)
  // A = 0.07 cm2, D = 1e-5 cm2/s
  const hisoblanganTokIp = (
    2.69 * Math.pow(elektronlarN, 1.5) * 0.07 * Math.sqrt(1e-5) * (konsentratsiyaMmol * 1e-3) * Math.sqrt(skanerTezligiNu * 1e-3) * 1e6
  ).toFixed(2);

  const deltaEpNazariy = (59 / elektronlarN).toFixed(0);

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
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ikon nom="alanga" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Siklik Voltamperometriya (CV)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                Redoks potensiallar (E_1/2), Randles-Sevcik tenglamasi va HOMO/LUMO energetik zonalari
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
          href="/ilmiy/tahlil/elektrokimyo/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-amber-500 group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="alanga" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono text-amber-400">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-amber-400 transition-colors">
                Birikmalarning Elektrokimyoviy Bazasini Ko{"'"}rish
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Siklik voltamperogrammalar (CV), redoks potensiallari (E_1/2), qaytarlik mezonlari (ΔE_p)
                va diffuziya koeffitsientlari.
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
            <div className="v3-nishon text-amber-400">Fundamental Elektrokimyo</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="kitob" olcham={20} className="text-amber-400" />
              <span>1. Siklik Voltamperometriya Metodologiyasi</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] leading-relaxed text-xs sm:text-sm text-[var(--v3-matn)]">
            <strong className="text-amber-400">Siklik voltamperometriya (CV)</strong> — ishchi elektrodga (shisha uglerod, Pt, Au) 
            chiziqli o{"'"}zgaruvchan potensial berilib, hosil bo{"'"}lgan tokning potensialga bog{"'"}liqligi o{"'"}lchanadigan 
            eng muhim elektrokimyoviy usul. Kompleks birikmalarda <strong className="text-amber-400">oksidlanish-qaytarilish 
            potensiallarini (E₁/₂), elektron ko{"'"}chish kinetikasini, oraliq radikallarning barqarorligini va 
            HOMO/LUMO energetik sathlarini</strong> aniqlashda qo{"'"}llaniladi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-amber-400">Elektrod Tizimi (3 Elektrodli)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Ishchi elektrod (WE):</strong> Shisha uglerod (Glassy carbon), Pt diski</li>
                <li><strong>Taqqoslash elektrod (RE):</strong> Ag/AgCl, SCE yoki Ferrosen ichki etaloni</li>
                <li><strong>Yordamchi elektrod (CE):</strong> Pt simi yoki spiral</li>
                <li><strong>Fon elektrolit:</strong> 0.1 M TBAPF₆ (tetrabutilammoniy geksaftorfosfat)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <h3 className="font-bold text-cyan-400">Qaytarlik Mezonlari (Nernstian)</h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Cho{"'"}qqilar farqi:</strong> ΔE_p = E_pa − E_pc = 59/n mV (25°C da)</li>
                <li><strong>Toklar nisbati:</strong> i_pa / i_pc ≈ 1.0 (to{"'"}liq qaytar)</li>
                <li><strong>Potensial mustaqilligi:</strong> E_1/2 skanerlash tezligiga (ν) bog{"'"}liq emas</li>
                <li><strong>Randles-Sevcik:</strong> i_p chiziqli ravishda √ν ga proportsional</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. RANDLES-SEVCIK TENGLAMASI VA KALKULYATOR */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-amber-400">Diffuziya Kinetikasi</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-amber-400" />
              <span>2. Randles-Sevcik Cho{"'"}qqi Toki Kalkulyatori</span>
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-2">
            <div className="text-xl sm:text-2xl font-mono font-black text-amber-400">
              i_p = 2.69 × 10⁵ · n^(3/2) · A · D^(1/2) · C · ν^(1/2)
            </div>
            <div className="text-xs text-[var(--v3-xira)]">
              Diffuziya bilan boshqariladigan qaytar elektrokimyoviy jarayonlar uchun
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Skaner tezligi (ν):</span>
                <strong className="text-amber-400 font-mono">{skanerTezligiNu} mV/s</strong>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={skanerTezligiNu}
                onChange={(e) => setSkanerTezligiNu(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Elektronlar soni (n):</span>
                <strong className="text-cyan-400 font-mono">{elektronlarN} e⁻</strong>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={elektronlarN}
                onChange={(e) => setElektronlarN(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2">
              <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                <span>Konsentratsiya (C):</span>
                <strong className="text-emerald-400 font-mono">{konsentratsiyaMmol} mM</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={konsentratsiyaMmol}
                onChange={(e) => setKonsentratsiyaMmol(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
            <div>
              <div className="text-[11px] text-[var(--v3-xira)]">Nazariy Cho{"'"}qqi Toki (i_p):</div>
              <div className="text-2xl font-black text-amber-400">{hisoblanganTokIp} μA</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[var(--v3-xira)]">Nazariy Cho{"'"}qqilar Farqi (ΔE_p):</div>
              <div className="text-lg font-bold text-cyan-400">ΔE_p = {deltaEpNazariy} mV</div>
            </div>
          </div>
        </div>

        {/* 3. ETALON KOMPLEKSLAR REDOKS JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-amber-400">Eksperimental Redoks Baza</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-amber-400" />
              <span>3. Etalon Komplekslarning Redoks Potensiallari (E_1/2)</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Redoks Juftlik</th>
                  <th className="py-2.5 px-3">E₁/₂ Potensial</th>
                  <th className="py-2.5 px-3">ΔE_p (mV)</th>
                  <th className="py-2.5 px-3">Xususiyati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {ELEKTROKIMYO_NAMUNALARI.map((m, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-amber-400">{m.komplek}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{m.juftlik}</td>
                    <td className="py-2.5 px-3 text-emerald-400">{m.eYarim}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-urgu)]">{m.deltaEp}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{m.xususiyat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
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
            <span>Termik Tahlil (TGA/DSC)</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
