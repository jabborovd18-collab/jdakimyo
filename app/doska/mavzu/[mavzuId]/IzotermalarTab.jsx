// app/doska/[mavzuId]/IzotermalarTab.jsx
//
// Smart Doska — Izotermalar va Grafik Simulyator (Premium).
// Lengmyur, Freyndlix va Genri modellarining grafik taqqoslanishi,
// KaTeX formulalari va sirtda zarrachalarning mikroskopik to'yinishi.
"use client";

import { useState, useMemo } from "react";
import LatexMatn from "@/components/LatexMatn";

export default function IzotermalarTab() {
  const [ce, setCe] = useState(5); // Muvozanat konsentratsiyasi (0..15)
  const [am, setAm] = useState(12); // Maksimal monoqavat sig'imi (5..20)
  const [k, setK] = useState(0.8); // Lengmyur doimiysi
  const [harorat, setHarorat] = useState(298); // Kelvin (293..353)
  const [korsatFreyndlix, setKorsatFreyndlix] = useState(true);
  const [korsatGenri, setKorsatGenri] = useState(true);

  // Harorat ta'siri koeffitsiyenti (Harorat oshganda ekzotermik adsorbsiya kamayadi - Slayd 34)
  const haroratFaktori = Math.exp(-0.015 * (harorat - 298));

  // Joriy nuqtadagi hisoblar
  const joriyLengmyur = (am * k * ce * haroratFaktori) / (1 + k * ce);
  const joriyFreyndlix = 3.5 * Math.pow(ce, 0.5) * haroratFaktori;
  const joriyGenri = am * k * ce * haroratFaktori * 0.4;

  // Sirt markazlari soni (12 ta)
  const jamiMarkazlar = 12;
  const bandMarkazlarSoni = Math.min(
    jamiMarkazlar,
    Math.round((joriyLengmyur / Math.max(0.1, am)) * jamiMarkazlar)
  );

  // SVG grafik uchun nuqtalar generatsiyasi (C = 0..15)
  const grafikNuqtalar = useMemo(() => {
    const qadamlar = 30;
    const lNuqtalar = [];
    const fNuqtalar = [];
    const gNuqtalar = [];

    const xMaks = 15;
    const yMaks = 20;

    for (let i = 0; i <= qadamlar; i++) {
      const cVal = (i / qadamlar) * xMaks;
      const lVal = (am * k * cVal * haroratFaktori) / (1 + k * cVal);
      const fVal = 3.5 * Math.pow(cVal, 0.5) * haroratFaktori;
      const gVal = am * k * cVal * haroratFaktori * 0.4;

      const svgX = 50 + (cVal / xMaks) * 420;
      const svgYL = 260 - (Math.min(yMaks, lVal) / yMaks) * 230;
      const svgYF = 260 - (Math.min(yMaks, fVal) / yMaks) * 230;
      const svgYG = 260 - (Math.min(yMaks, gVal) / yMaks) * 230;

      lNuqtalar.push(`${svgX.toFixed(1)},${svgYL.toFixed(1)}`);
      fNuqtalar.push(`${svgX.toFixed(1)},${svgYF.toFixed(1)}`);
      gNuqtalar.push(`${svgX.toFixed(1)},${svgYG.toFixed(1)}`);
    }

    const joriySvgX = 50 + (ce / xMaks) * 420;
    const joriySvgYL = 260 - (Math.min(yMaks, joriyLengmyur) / yMaks) * 230;

    return {
      lPath: lNuqtalar.join(" "),
      fPath: fNuqtalar.join(" "),
      gPath: gNuqtalar.join(" "),
      joriySvgX,
      joriySvgYL,
    };
  }, [am, k, ce, haroratFaktori, joriyLengmyur]);

  return (
    <div className="space-y-8">
      {/* ═══ ASOSIY GRAFIK VA SIMULYATOR PANELI ═══ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Adsorbsiya izotermalari
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Muvozanat egri chiziqlari va Sirt to&apos;yinishi
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              O&apos;zgarmas haroratda muvozanat adsorbsiya miqdorining konsentratsiyaga bog&apos;lanishi (Slayd 16–25).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setKorsatFreyndlix(!korsatFreyndlix)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                korsatFreyndlix
                  ? "bg-amber-950/70 border-amber-500/80 text-amber-300 shadow"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              Freyndlix egri chizig&apos;i
            </button>
            <button
              onClick={() => setKorsatGenri(!korsatGenri)}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold transition ${
                korsatGenri
                  ? "bg-sky-950/70 border-sky-500/80 text-sky-300 shadow"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
            >
              Genri to&apos;g&apos;ri chizig&apos;i
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* SVG GRAFIK CHIZMASI */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl p-4 border border-slate-800/80 shadow-inner">
            <div className="relative w-full aspect-[16/10]">
              <svg className="w-full h-full" viewBox="0 0 500 300">
                {/* To'r (Grid) */}
                <line x1="50" y1="30" x2="50" y2="260" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="50" y1="260" x2="480" y2="260" stroke="#1e293b" strokeWidth="1.5" />
                <line x1="50" y1="145" x2="480" y2="145" stroke="#1e293b" strokeDasharray="4" strokeWidth="1" />
                <line x1="265" y1="30" x2="265" y2="260" stroke="#1e293b" strokeDasharray="4" strokeWidth="1" />

                {/* To'yinish chegarasi (am chizig'i) */}
                <line
                  x1="50"
                  y1={260 - (am / 20) * 230}
                  x2="480"
                  y2={260 - (am / 20) * 230}
                  stroke="#10b981"
                  strokeDasharray="3 3"
                  strokeWidth="1.2"
                />
                <text x="390" y={252 - (am / 20) * 230} fill="#10b981" fontSize="11" fontWeight="bold">
                  a_m to&apos;yinish platosi
                </text>

                {/* Freyndlix egri chizig'i */}
                {korsatFreyndlix && (
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                    points={grafikNuqtalar.fPath}
                  />
                )}

                {/* Genri chizig'i */}
                {korsatGenri && (
                  <polyline
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="2"
                    points={grafikNuqtalar.gPath}
                  />
                )}

                {/* Lengmyur egri chizig'i */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3.5"
                  points={grafikNuqtalar.lPath}
                />

                {/* Joriy konsentratsiya nuqtasi */}
                <line
                  x1={grafikNuqtalar.joriySvgX}
                  y1="30"
                  x2={grafikNuqtalar.joriySvgX}
                  y2="260"
                  stroke="#ffffff"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />
                <circle
                  cx={grafikNuqtalar.joriySvgX}
                  cy={grafikNuqtalar.joriySvgYL}
                  r="7"
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* O'q yozuvlari */}
                <text x="430" y="285" fill="#94a3b8" fontSize="11" fontWeight="bold">
                  C_e (mmol/L)
                </text>
                <text x="15" y="25" fill="#94a3b8" fontSize="11" fontWeight="bold">
                  a (mmol/g)
                </text>
                <text x="40" y="275" fill="#64748b" fontSize="11">0</text>
                <text x="465" y="275" fill="#64748b" fontSize="11">15</text>
                <text x="25" y="35" fill="#64748b" fontSize="11">20</text>
              </svg>
            </div>

            {/* Afsona (Legend) */}
            <div className="flex flex-wrap items-center justify-center gap-5 pt-3 border-t border-slate-900 text-xs">
              <span className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-4 h-1 bg-emerald-500 rounded" /> Lengmyur: <LatexMatn matn="a = a_m \frac{KC}{1+KC}" inline={true} />
              </span>
              {korsatFreyndlix && (
                <span className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-4 h-1 bg-amber-500 rounded border-dashed" /> Freyndlix: <LatexMatn matn="a = K_F C^{1/n}" inline={true} />
                </span>
              )}
              {korsatGenri && (
                <span className="flex items-center gap-2 text-sky-400 font-bold">
                  <span className="w-4 h-1 bg-sky-500 rounded" /> Genri: <LatexMatn matn="a = K_H C" inline={true} />
                </span>
              )}
            </div>
          </div>

          {/* SLAYDERLAR VA SIRTNING BANDLIK ANIMATSIYASI */}
          <div className="lg:col-span-4 space-y-5">
            {/* Konsentratsiya slayderi */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-300">Muvozanat konsentratsiyasi (C_e):</span>
                <span className="font-mono text-emerald-400 font-bold">{ce} mmol/L</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="15"
                step="0.2"
                value={ce}
                onChange={(e) => setCe(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Harorat slayderi */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-300">Harorat (T):</span>
                <span className="font-mono text-amber-400 font-bold">{harorat} K ({(harorat - 273.15).toFixed(0)}°C)</span>
              </div>
              <input
                type="range"
                min="293"
                max="353"
                step="2"
                value={harorat}
                onChange={(e) => setHarorat(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Ekzotermik adsorbsiyada (ΔH &lt; 0) harorat oshsa, desorbsiya kuchayadi va adsorbsiya kamayadi (Slayd 34).
              </div>
            </div>

            {/* Sirt markazlarining to'lishi (Mikroskopik model) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Adsorbent sirti (12 ta markaz):
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {bandMarkazlarSoni} / {jamiMarkazlar} band
                </span>
              </div>

              {/* Katakchalar */}
              <div className="grid grid-cols-6 gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                {Array.from({ length: jamiMarkazlar }).map((_, i) => {
                  const band = i < bandMarkazlarSoni;
                  return (
                    <div
                      key={i}
                      className={`h-10 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                        band
                          ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40 scale-100 ring-2 ring-emerald-300"
                          : "bg-slate-800/80 text-slate-400 border border-dashed border-slate-700"
                      }`}
                    >
                      {band ? "●" : "○"}
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-slate-400 text-center mt-3">
                {bandMarkazlarSoni === jamiMarkazlar
                  ? "Sirt to'liq to'yindi (Monomolekulyar monoqavat)!"
                  : `Hozirgi bandlik: ${((bandMarkazlarSoni / jamiMarkazlar) * 100).toFixed(0)}%`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
