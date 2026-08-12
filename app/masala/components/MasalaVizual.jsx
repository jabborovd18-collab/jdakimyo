"use client";

import Ikon from "@/components/Ikon";

/**
 * 3-BOSQICH: DINAMIK ILMIY KIMYOVIY DIAGRAMM VA SXEMALAR VIZUALIZATORI.
 * Pearson Kresti, Stexiometriya sarf-xarajat balansi, Kristallogidrat nisbati.
 */
export default function MasalaVizual({ sxema }) {
  if (!sxema || !sxema.turi) return null;

  const { turi, nomi } = sxema;

  return (
    <div className="rounded-2xl border p-4 sm:p-5 shadow-lg bg-[var(--v3-fon)] border-[var(--v3-chiziq-2)] space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-2.5 border-b border-[var(--v3-chiziq)]">
        <div className="flex items-center gap-2">
          <Ikon nom="atom" olcham={18} className="text-[var(--v3-urgu)]" />
          <h4 className="text-xs sm:text-sm font-bold text-[var(--v3-matn)]">{nomi || "Ilmiy Vizual Sxema"}</h4>
        </div>
        <span className="v3-tag v3-tag-ochiq text-[10px] font-mono font-bold">
          {turi.toUpperCase()} SXEMASI
        </span>
      </div>

      {/* 1. PEARSON KRESTI (DIAGONAL QOIDA) */}
      {turi === "krest" && (
        <div className="space-y-3">
          <div className="relative flex flex-col items-center justify-center p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
            <div className="w-full max-w-sm grid grid-cols-3 gap-2 sm:gap-4 items-center text-center font-mono">
              {/* Dastlabki eritmalar */}
              <div className="space-y-6 text-left">
                <div className="p-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10">
                  <span className="text-[10px] text-[var(--v3-xira)] block">1-Eritma (ω₁)</span>
                  <strong className="text-sm sm:text-base text-cyan-400 font-bold">{sxema.w1}%</strong>
                </div>
                <div className="p-2.5 rounded-xl border border-blue-500/40 bg-blue-500/10">
                  <span className="text-[10px] text-[var(--v3-xira)] block">2-Modda/Suv (ω₂)</span>
                  <strong className="text-sm sm:text-base text-blue-400 font-bold">{sxema.w2}%</strong>
                </div>
              </div>

              {/* O'rtadagi maqsad */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative p-3 sm:p-4 rounded-2xl border-2 border-[var(--v3-urgu)] bg-[var(--v3-fon)] shadow-lg scale-105">
                  <span className="text-[10px] text-[var(--v3-xira)] uppercase block">Maqsad (ω)</span>
                  <strong className="text-base sm:text-lg text-[var(--v3-urgu)] font-black">
                    {sxema.w_maqsad}%
                  </strong>
                </div>
              </div>

              {/* Chiqqan qismlar (Nisbat) */}
              <div className="space-y-6 text-right">
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
                  <span className="text-[10px] text-[var(--v3-xira)] block">1-qism nisbati</span>
                  <strong className="text-sm sm:text-base text-emerald-400 font-bold">
                    |{sxema.w_maqsad} - {sxema.w2}| = {Math.abs(Number((sxema.w_maqsad - sxema.w2).toFixed(2)))} qism
                  </strong>
                </div>
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10">
                  <span className="text-[10px] text-[var(--v3-xira)] block">2-qism nisbati</span>
                  <strong className="text-sm sm:text-base text-emerald-400 font-bold">
                    |{sxema.w1} - {sxema.w_maqsad}| = {Math.abs(Number((sxema.w1 - sxema.w_maqsad).toFixed(2)))} qism
                  </strong>
                </div>
              </div>
            </div>

            {sxema.m1 && sxema.m2 && (
              <div className="mt-4 pt-3 border-t border-[var(--v3-chiziq)] w-full flex justify-between text-xs font-mono text-[var(--v3-xira)]">
                <span>Dastlabki: <strong className="text-[var(--v3-matn)]">{sxema.m1} g</strong> + <strong className="text-[var(--v3-matn)]">{sxema.m2} g</strong></span>
                <span>Jami eritma: <strong className="text-cyan-400">{sxema.jamiMassa || (sxema.m1 + sxema.m2)} g</strong></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. KRISTALLOGIDRAT NUTRITION-STYLE DONUT / COMPOSITION DIAGRAM */}
      {turi === "kristallogidrat" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1">
              <span className="text-[10px] text-[var(--v3-xira)] block">Formula:</span>
              <div className="text-base font-bold text-[var(--v3-urgu)]">{sxema.formula}</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  {sxema.suvsizTuzNomi || "Suvsiz tuz"}:
                </span>
                <strong className="text-[var(--v3-matn)]">{sxema.suvsizTuzFoiz}% ({sxema.mSofTuz || 0} g)</strong>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  Kristallizatsiya suvi (H₂O):
                </span>
                <strong className="text-[var(--v3-matn)]">{sxema.suvFoiz}%</strong>
              </div>
            </div>
          </div>

          {/* Visual Percentage Bar */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] text-center font-mono">
            <div className="text-[11px] text-[var(--v3-xira)] mb-1">Massa Tasimoti:</div>
            <div className="relative h-8 w-full rounded-xl overflow-hidden flex border border-[var(--v3-chiziq)]">
              <div
                style={{ width: `${sxema.suvsizTuzFoiz}%` }}
                className="h-full bg-cyan-500 flex items-center justify-center text-[10px] font-bold text-black"
                title="Suvsiz tuz"
              >
                {sxema.suvsizTuzFoiz}% Tuz
              </div>
              <div
                style={{ width: `${sxema.suvFoiz}%` }}
                className="h-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white"
                title="Kristallizatsiya suvi"
              >
                {sxema.suvFoiz}% Suv
              </div>
            </div>
            <span className="text-[10px] text-[var(--v3-xira)] mt-1">
              Eritilganda suv qismi to{"'"}liq erituvchiga o{"'"}tadi!
            </span>
          </div>
        </div>
      )}

      {/* 3. STEXIOMETRIYA VA REAGENTLAR BALANSI */}
      {turi === "stexiometriya" && sxema.moddalar && (
        <div className="space-y-3">
          <div className="space-y-2">
            {sxema.moddalar.map((m, i) => {
              const isCheklovchi = m.status?.includes("cheklovchi");
              const foiz = m.berilganMol > 0 ? Math.min(100, Math.round((m.sarflandiMol / m.berilganMol) * 100)) : 100;

              return (
                <div key={i} className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--v3-matn)] flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCheklovchi ? "bg-red-400" : "bg-emerald-400"}`} />
                      {m.nom}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isCheklovchi ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  <div className="flex justify-between text-[11px] text-[var(--v3-xira)]">
                    <span>Berilgan: <strong>{m.berilganMol} mol</strong></span>
                    <span>Sarflangan: <strong className="text-[var(--v3-matn)]">{m.sarflandiMol} mol</strong></span>
                    {m.ortdiMol > 0 && <span className="text-amber-400">Ortgan: <strong>+{m.ortdiMol} mol</strong></span>}
                  </div>

                  <div className="relative h-2 w-full bg-[var(--v3-fon)] rounded-full overflow-hidden border border-[var(--v3-chiziq)]">
                    <div
                      className={`h-full ${isCheklovchi ? "bg-red-500" : "bg-emerald-500"}`}
                      style={{ width: `${foiz}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {sxema.hosilBolganTuz && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-mono flex items-center justify-between">
              <span className="text-[var(--v3-xira)]">Hosil bo{"'"}lgan mahsulot:</span>
              <strong className="text-emerald-400 text-sm font-bold">{sxema.hosilBolganTuz}</strong>
            </div>
          )}
        </div>
      )}

      {/* 4. GAZLAR VA NORMAL SHAROIT */}
      {turi === "gaz" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs">
          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
            <span className="text-[10px] text-[var(--v3-xira)] block">Hajm (N.SH.)</span>
            <strong className="text-base text-cyan-400 font-bold">{sxema.hajmLitr} L</strong>
          </div>
          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
            <span className="text-[10px] text-[var(--v3-xira)] block">Modda Miqdori</span>
            <strong className="text-base text-[var(--v3-urgu)] font-bold">{sxema.mol} mol</strong>
          </div>
          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
            <span className="text-[10px] text-[var(--v3-xira)] block">Massa (m)</span>
            <strong className="text-base text-emerald-400 font-bold">{sxema.massa} g</strong>
          </div>
          <div className="p-3 rounded-xl border border-[var(--v3-chiziq)] bg-[var(--v3-yuza)]">
            <span className="text-[10px] text-[var(--v3-xira)] block">D(havo)</span>
            <strong className="text-base text-amber-400 font-bold">{sxema.dHavo}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
