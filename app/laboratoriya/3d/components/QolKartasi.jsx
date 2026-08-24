"use client";

import Ikon from "@/components/Ikon";

// QO'LDAGI IDISH KARTASI — o'ng pastki burchakdagi HUD.
//
// `korinish.js` dan ajratildi (BRIF-05). Karta uchta holatni
// ko'rsatadi: qo'ldagi idish nomi va hajmi, spatuladagi kukun, va
// devor shishasi bo'lsa tezkor doza tugmalari.
//
// Ichida mantiq yo'q — har tugma tashqaridan kelgan funksiyani
// chaqiradi. Sabab: laboratoriya qoidalari `useNishonAmali` da
// yashaydi va ular ekranda ikkinchi marta takrorlanmasligi kerak
// (AGENTS.md 1-band).

export default function QolKartasi({
  fpsQolIdish,
  nishonIdishGroup,
  spatulaKukun,
  quyilganModdalar,
  quyilganKalitlar,
  jamiMl,
  aniqHajmQuy,
  javongaQaytar,
  qolgaOlYokiQoy,
  setFpsQolIdish,
}) {
  if (!fpsQolIdish) return null;

  return (
        <div className="absolute bottom-4 right-4 z-30 w-72 rounded-2xl border p-3.5 shadow-2xl backdrop-blur-xl bg-slate-950/90 border-slate-800/90 space-y-2 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Ikon nom="kolba" olcham={14} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                  Qo{"'"}lda ushlab turilgan:
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {fpsQolIdish.userData?.nom || fpsQolIdish.userData?.kalit}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {fpsQolIdish.userData?.devorShishasi ? (
                <button
                  type="button"
                  onClick={() => {
                    javongaQaytar();
                    setFpsQolIdish(null);
                  }}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
                  title="Shishani devor javoniga qaytarish [G]"
                >
                  [G] Javonga
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => qolgaOlYokiQoy("stolga_qoy")}
                  className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all"
                  title="Stolga qo'yish [G]"
                >
                  [G] Stolga
                </button>
              )}
            </div>
          </div>

          {/* Spatula yoki Shisha tayoqcha holati */}
          {fpsQolIdish.userData?.kalit === "spatula" && (
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono">
              {spatulaKukun ? (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>🧂</span> Spatulada: 1.0g {spatulaKukun} kukuni
                </span>
              ) : (
                <span className="text-slate-400">🧂 Spatula bo{"'"}sh (Tuz shishasidan kukun oling)</span>
              )}
            </div>
          )}

          {fpsQolIdish.userData?.kalit === "shisha-tayoqcha" && (
            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-400">
              🌀 Shisha tayoqcha (Probirkani aralashtirish uchun bosing)
            </div>
          )}

          {/* Agar devor reagent shishasi bo'lsa -> Tezkor doza klavishlari */}
          {fpsQolIdish.userData?.devorShishasi && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="text-[9px] font-mono text-slate-400 flex justify-between">
                <span>Aniq hajm quyish:</span>
                <span className="text-cyan-400 font-bold">Klavishlar: 1 - 5</span>
              </div>
              <div className="grid grid-cols-5 gap-1 font-mono text-[10px] text-center">
                {[
                  { ml: 1, k: "1" },
                  { ml: 5, k: "2" },
                  { ml: 10, k: "3" },
                  { ml: 25, k: "4" },
                  { ml: 50, k: "5" },
                ].map(({ ml, k }) => (
                  <button
                    key={ml}
                    type="button"
                    onClick={() => {
                      if (nishonIdishGroup) {
                        aniqHajmQuy(fpsQolIdish.userData?.kalit, nishonIdishGroup, ml);
                      }
                    }}
                    className="py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-all"
                  >
                    +{ml}ml
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Agar idishda moddalar bo'lsa */}
          {quyilganKalitlar.length > 0 && !fpsQolIdish.userData?.devorShishasi && (
            <div className="space-y-1 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-400">Tarkib:</span>
                <span className="text-emerald-400 font-bold">{jamiMl.toFixed(1)} ml</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {quyilganKalitlar.map((k) => (
                  <span
                    key={k}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    {k}: {quyilganModdalar[k]?.ml?.toFixed(1)}ml
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
  );
}
