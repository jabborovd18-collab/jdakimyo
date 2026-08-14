"use client";

import Link from "next/link";
import { useState } from "react";
import FonTanlagich, { useFon } from "@/components/FonTanlagich";
import Ikon from "@/components/Ikon";

const KRISTALL_NAMUNALARI = [
  {
    formula: "K₃[Fe(CN)₆]",
    nom: "Kaliy geksatsianoferrat(III)",
    singoniya: "Monoklinik",
    fazoviyGuruh: "P2₁/c (№14)",
    a: 7.07,
    b: 10.38,
    c: 13.44,
    beta: 100.6,
    bog: "Fe−C: 1.93 Å, C≡N: 1.15 Å",
    geometriya: "Oktaedrik (Oh)",
  },
  {
    formula: "[Co(NH₃)₆]Cl₃",
    nom: "Geksammin-kobalt(III) xlorid",
    singoniya: "Monoklinik",
    fazoviyGuruh: "P2₁/n (№14)",
    a: 10.82,
    b: 10.82,
    c: 15.5,
    beta: 90.0,
    bog: "Co−N: 1.96 Å, N−H: 0.89 Å",
    geometriya: "Oktaedrik (Oh)",
  },
  {
    formula: "sis-[PtCl₂(NH₃)₂]",
    nom: "Sisplatin (Saraton dorisi)",
    singoniya: "Monoklinik",
    fazoviyGuruh: "P2₁/c (№14)",
    a: 6.05,
    b: 9.02,
    c: 12.54,
    beta: 97.2,
    bog: "Pt−Cl: 2.33 Å, Pt−N: 2.01 Å",
    geometriya: "Kvadrat planar (D4h)",
  },
  {
    formula: "[Ni(CN)₄]²⁻",
    nom: "Tetrasianonikelat(II)",
    singoniya: "Tetragonal",
    fazoviyGuruh: "P4/mmm (№123)",
    a: 10.2,
    b: 10.2,
    c: 8.9,
    beta: 90.0,
    bog: "Ni−C: 1.86 Å, C≡N: 1.14 Å",
    geometriya: "Kvadrat planar (D4h)",
  },
  {
    formula: "[Fe(C₅H₅)₂]",
    nom: "Ferrosen (Sendvich)",
    singoniya: "Monoklinik",
    fazoviyGuruh: "P2₁/c (№14)",
    a: 5.91,
    b: 7.59,
    c: 9.59,
    beta: 101.1,
    bog: "Fe−C: 2.06 Å, C−C: 1.42 Å",
    geometriya: "Sendvich (D5d)",
  },
  {
    formula: "[Cu(H₂O)₆]²⁺",
    nom: "Geksaakva-mis(II)",
    singoniya: "Monoklinik",
    fazoviyGuruh: "P2₁/c (№14)",
    a: 6.12,
    b: 10.69,
    c: 13.88,
    beta: 95.7,
    bog: "Cu−O(ekv): 1.97 Å, Cu−O(aks): 2.28 Å",
    geometriya: "Yan-Teller cho'zilgan oktaedr",
  },
];

export default function RentgenKorinish() {
  const [fonKaliti, fonniOzgartir] = useFon();

  // Bragg Kalkulyatori
  const [nTartib, setNTartib] = useState(1);
  const [lambda, setLambda] = useState(1.5418); // Cu Ka
  const [dMasofa, setDMasofa] = useState(2.82); // Angstrom

  const sinTheta = (nTartib * lambda) / (2 * Math.max(0.01, dMasofa));
  const thetaGradus = sinTheta <= 1 ? (Math.asin(sinTheta) * 180) / Math.PI : null;
  const twoTheta = thetaGradus !== null ? (thetaGradus * 2).toFixed(2) : null;

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
              <Ikon nom="kristall" olcham={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold tracking-wide text-[var(--v3-matn)]">
                Rentgen Difraksiyasi (XRD / RSAT)
              </h1>
              <p className="text-[11px] text-[var(--v3-xira)] hidden sm:block">
                3D Kristall tuzilishi, Bragg qonuni va atomlar koordinatalari
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
        {/* BIRIKMALAR KRISTALLOGRAFIK BAZASIGA O'TISH KARTASI */}
        <Link
          href="/ilmiy/tahlil/rentgen/birikmalar"
          className="v3-panel-karta p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[var(--v3-urgu)] group transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[var(--v3-urgu)]/15 border border-[var(--v3-urgu)]/30 flex items-center justify-center text-[var(--v3-urgu)] shrink-0 group-hover:scale-110 transition-transform">
              <Ikon nom="kristall" olcham={28} />
            </div>
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 v3-tag v3-tag-ochiq text-[10.5px] font-mono">
                <span>12 ta kompleks birikma</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--v3-matn)] group-hover:text-[var(--v3-urgu)] transition-colors">
                Birikmalarning Kristallografik Tahlili
              </h2>
              <p className="text-xs text-[var(--v3-xira)] leading-relaxed max-w-2xl">
                Sisplatin, Ferrosen, K₃[Fe(CN)₆], [Co(NH₃)₆]Cl₃ va boshqa komplekslarning rentgen difraksiyasi,
                kristall panjara parametrlari, fazoviy guruhlari, bog{"'"} uzunliklari va difraktogrammalari.
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
              <span>Rentgen Difraksiyasining Fizik Mohiyati</span>
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-xs sm:text-sm text-[var(--v3-matn)] leading-relaxed">
            <strong className="text-[var(--v3-urgu)]">Rentgen difraksiyasi (RSAT / SCXRD)</strong> — kompleks birikmalarning
            <strong> aniq 3D fazoviy tuzilishi</strong>ni to{"'"}g{"'"}ridan-to{"'"}g{"'"}ri isbotlovchi yagona bevosita fizik usul.
            Ushbu usul orqali barcha koordinatsion M−L bog{"'"} uzunliklari (0.001 Å aniqlikda), L−M−L valent burchaklari,
            fazoviy simmetriya guruhi va atomlarning aniq (x, y, z) koordinatalari aniqlanadi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2 text-xs">
              <h3 className="font-bold text-[var(--v3-urgu)] text-sm flex items-center gap-1.5">
                <Ikon nom="belgi" olcham={16} />
                <span>Nimani aniqlaydi?</span>
              </h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li><strong>Kristall panjara parametrlari:</strong> a, b, c va α, β, γ</li>
                <li><strong>Fazoviy guruh:</strong> masalan, P2₁/c, P4/mmm, Fm-3m</li>
                <li><strong>Bog{"'"} uzunliklari:</strong> M−L metall-ligand va L−L masofalari</li>
                <li><strong>Valent burchaklar:</strong> L−M−L fazoviy burchaklar</li>
                <li><strong>Geometrik izomeriya:</strong> sis/trans, fac/mer to{"'"}liq isboti</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-2 text-xs">
              <h3 className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
                <Ikon nom="atom" olcham={16} />
                <span>Qanday ishlaydi?</span>
              </h3>
              <ul className="space-y-1 text-[var(--v3-matn)] list-disc list-inside">
                <li>Monoxromatik rentgen nurlari (Cu Kα = 1.5418 Å, Mo Kα = 0.7107 Å) kristallga yo{"'"}naltiriladi</li>
                <li>Elektron qobiqlar nurni elastik sochadi</li>
                <li><strong>Bragg qonuni (nλ = 2d·sinθ)</strong> bo{"'"}yicha konstruktiv interferensiya yuz beradi</li>
                <li>Fure-qayta ishlash orqali <strong>3D elektron zichlik xaritasi</strong> olinadi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. BRAGG QONUNI INTERAKTIV KALKULYATORI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Matematik Qonuniyat</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="doska" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Bragg-Vulf Qonuni va Difraksiya Burchagi</span>
            </h2>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] text-center space-y-3">
            <div className="text-2xl sm:text-3xl font-mono font-black text-[var(--v3-urgu)] tracking-wider">
              n · λ = 2d · sin(θ)
            </div>
            <p className="text-xs text-[var(--v3-xira)] max-w-xl mx-auto">
              Parallel kristall tekisliklar orasidagi masofa ($d$) va rentgen to{"'"}lqin uzunligi ($\lambda$)
              orqali difraksiya piki burchagini ($2\theta$) aniqlash:
            </p>
          </div>

          {/* Interaktiv kalkulyator paneli */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] text-[11px] block">Difraksiya tartibi (n):</label>
              <input
                type="number"
                min="1"
                max="5"
                value={nTartib}
                onChange={(e) => setNTartib(Number(e.target.value) || 1)}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] text-[11px] block">To{"'"}lqin uzunligi λ (Å):</label>
              <select
                value={lambda}
                onChange={(e) => setLambda(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              >
                <option value={1.5418}>Cu Kα (1.5418 Å)</option>
                <option value={0.71073}>Mo Kα (0.71073 Å)</option>
                <option value={1.7889}>Co Kα (1.7889 Å)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-[var(--v3-yuza)] border border-[var(--v3-chiziq)] space-y-1.5">
              <label className="text-[var(--v3-xira)] text-[11px] block">Tekisliklar masofasi d (Å):</label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="20"
                value={dMasofa}
                onChange={(e) => setDMasofa(Number(e.target.value) || 1.0)}
                className="w-full px-3 py-1.5 rounded-lg border bg-[var(--v3-fon-2)] border-[var(--v3-chiziq)] text-[var(--v3-matn)]"
              />
            </div>
          </div>

          {/* Hisoblangan natija */}
          <div className="p-4 rounded-xl bg-[var(--v3-urgu)]/10 border border-[var(--v3-urgu)]/30 flex items-center justify-between font-mono">
            <span className="text-xs text-[var(--v3-matn)]">Hisoblangan difraksiya burchagi (2θ):</span>
            <span className="text-lg font-bold text-[var(--v3-urgu)]">
              {twoTheta ? `${twoTheta}° (θ = ${thetaGradus.toFixed(2)}°)` : "Difraksiya mavjud emas (sin θ > 1)"}
            </span>
          </div>
        </div>

        {/* 3. KOMPLEKSLAR KRISTALLOGRAFIK JADVALI */}
        <div className="v3-panel-karta p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <div className="v3-nishon text-[var(--v3-urgu)]">Eksperimental Ma{"'"}lumotlar</div>
            <h2 className="text-xl font-bold text-[var(--v3-matn)] flex items-center gap-2">
              <Ikon nom="fayl" olcham={20} className="text-[var(--v3-urgu)]" />
              <span>Etalon Komplekslarning Kristallografik Parametrlari</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--v3-chiziq)] text-[var(--v3-xira)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Kompleks</th>
                  <th className="py-2.5 px-3">Fazoviy Guruh</th>
                  <th className="py-2.5 px-3">Panjara: a, b, c (Å)</th>
                  <th className="py-2.5 px-3">β (°)</th>
                  <th className="py-2.5 px-3">Bog{"'"} Uzunliklari</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--v3-chiziq)]">
                {KRISTALL_NAMUNALARI.map((k, i) => (
                  <tr key={i} className="hover:bg-[var(--v3-yuza)] transition-colors">
                    <td className="py-2.5 px-3 font-bold text-[var(--v3-urgu)] whitespace-nowrap">
                      {k.formula}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-400">{k.fazoviyGuruh}</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">
                      {k.a}, {k.b}, {k.c}
                    </td>
                    <td className="py-2.5 px-3 text-[var(--v3-xira)]">{k.beta}°</td>
                    <td className="py-2.5 px-3 text-[var(--v3-matn)]">{k.bog}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. YAN-TELLER VA SIS/TRANS TAHLILI */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="v3-panel-karta p-6 space-y-3">
            <div className="text-xs font-bold font-mono text-amber-400 uppercase">
              ⚡ Yan-Teller Buzilishi (RSAT Isboti)
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
              [Cu(H₂O)₆]²⁺ (d⁹) kompleksida rentgen difraksiyasi aksial Cu−O bog{"'"}lari (2.28 Å)
              ekvatorial Cu−O bog{"'"}lariga (1.97 Å) nisbatan 0.31 Å ga cho{"'"}zilganligini
              ko{"'"}rsatadi. Bu eg orbitallari degeneratsiyasining buzilishi bilan izohlanadi.
            </p>
          </div>

          <div className="v3-panel-karta p-6 space-y-3">
            <div className="text-xs font-bold font-mono text-cyan-400 uppercase">
              🔄 Sis / Trans Izomeriya Farqlanishi
            </div>
            <p className="text-xs text-[var(--v3-matn)] leading-relaxed">
              sis-[PtCl₂(NH₃)₂] da Cl−Pt−Cl burchagi 91.2° (yonma-yon) bo{"'"}lsa,
              trans-[PtCl₂(NH₃)₂] da bu burchak 180.0° (qarama-qarshi) ekanligi
              rentgen difraksiyasi orqali aniq isbotlanadi.
            </p>
          </div>
        </div>

        {/* NAVIGATSIYA FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-[var(--v3-chiziq)] text-xs font-mono">
          <Link
            href="/ilmiy/tahlil/nmr"
            className="v3-tugma py-2 px-4 flex items-center gap-2 text-[var(--v3-xira)] hover:text-[var(--v3-matn)]"
          >
            <Ikon nom="chap" olcham={14} />
            <span>YaMR (NMR) Spektroskopiya</span>
          </Link>

          <Link
            href="/ilmiy/tahlil/mass"
            className="v3-tugma v3-tugma-asosiy py-2 px-4 font-bold flex items-center gap-2"
          >
            <span>Mass-spektrometriya</span>
            <Ikon nom="ong" olcham={14} />
          </Link>
        </div>
      </main>
    </div>
  );
}
