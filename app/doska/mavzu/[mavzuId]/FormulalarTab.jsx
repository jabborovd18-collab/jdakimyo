// app/doska/mavzu/[mavzuId]/FormulalarTab.jsx
//
// Smart Doska — Chuqur Ilmiy Laboratoriya & Formulalar Tahlili (Premium Universitet Standarti).
// 7 ta fundamental ilmiy modul:
// 1. Lengmyur & Chiziqli Regressiya (Hanes-Woolf, Lineweaver-Burk, Eadie-Hofstee)
// 2. Freyndlix & Logarifmik Regressiya (1/n Geterogenlik tahlili)
// 3. BET Ko'p Qatlamli Modeli & N₂ (77 K) Solishtirma Sirti (S_BET)
// 4. Gibbs Adsorbsiya Tenglamasi & Shishkovskiy Sirt Tarangligi (s₀ molekula maydoni)
// 5. Kelvin Tenglamasi & Mezog'ovaklar Kapillyar Gisterezisi (IUPAC IV tur)
// 6. Adsorbsiya Termodinamikasi & Izosterik Issiqlik (q_st, ΔH, ΔG, ΔS)
// 7. Dyuklo-Traube Qoidasi & Gomologik Qator Sirt Faolligi (β ≈ 3.2)
"use client";

import { useState, useMemo } from "react";
import LatexMatn from "@/components/LatexMatn";

// Turli modullarning ob'ekt kalitlarini aniqlash (universitet darajasidagi barqarorlik)
function getMaydonlar(qator) {
  if (!qator) return { xKey: "x", yKey: "y" };
  if (qator.ce !== undefined) return { xKey: "ce", yKey: "a" };
  if (qator.pNisbiy !== undefined && qator.a !== undefined) return { xKey: "pNisbiy", yKey: "a" };
  if (qator.c !== undefined) return { xKey: "c", yKey: "sigma" };
  if (qator.r !== undefined) return { xKey: "r", yKey: "pNisbiy" };
  if (qator.tK !== undefined) return { xKey: "tK", yKey: "p" };
  if (qator.n !== undefined) return { xKey: "n", yKey: "g" };
  const keys = Object.keys(qator);
  return { xKey: keys[0] || "x", yKey: keys[1] || "y" };
}

export default function FormulalarTab({ mavzu }) {
  const modullar = mavzu.chuqurModullar || [];
  const [faolModulId, setFaolModulId] = useState(modullar[0]?.id || "");
  const [ichkiRejim, setIchkiRejim] = useState("animatsiya"); // "animatsiya" | "jadval" | "regressiya" | "nazariya"

  const faolModul = modullar.find((m) => m.id === faolModulId) || modullar[0];

  // Tajriba jadvali holati (foydalanuvchi tahrirlashi mumkin)
  const [jadvalMalumotlar, setJadvalMalumotlar] = useState(() => {
    const boshlangich = {};
    modullar.forEach((m) => {
      if (m.tajribaNamunasi) {
        boshlangich[m.id] = JSON.parse(JSON.stringify(m.tajribaNamunasi));
      }
    });
    return boshlangich;
  });

  // Simulyatsiya slayderlari va sozlamalari
  const [lengmyurTransformatsiya, setLengmyurTransformatsiya] = useState("hanes"); // "hanes" | "lineweaver" | "eadie"
  const [gibbsC, setGibbsC] = useState(0.02); // mol/L
  const [kelvinR, setKelvinR] = useState(4); // nm
  const [termoT1, setTermoT1] = useState(273); // K
  const [termoT2, setTermoT2] = useState(298); // K
  const [traubeKislotaIdx, setTraubeKislotaIdx] = useState(2); // Propion kislota
  const [traubeC, setTraubeC] = useState(0.02); // mol/L

  // Tajriba jadvalini o'zgartirish
  const qatorOzgartir = (modulId, index, maydon, yangiQiymat) => {
    setJadvalMalumotlar((old) => {
      const nusxa = [...(old[modulId] || [])];
      if (nusxa[index]) {
        nusxa[index] = {
          ...nusxa[index],
          [maydon]: Number(yangiQiymat) || 0,
        };
      }
      return { ...old, [modulId]: nusxa };
    });
  };

  // Namuna tajribani qayta tiklash
  const namunaniTikla = (modulId) => {
    const modul = modullar.find((m) => m.id === modulId);
    if (modul && modul.tajribaNamunasi) {
      setJadvalMalumotlar((old) => ({
        ...old,
        [modulId]: JSON.parse(JSON.stringify(modul.tajribaNamunasi)),
      }));
    }
  };

  // ─── ENG KICHIK KVADRATLAR REGRESSIYASI (LEAST SQUARES) ───
  const regressiyaNatijasi = useMemo(() => {
    if (!faolModul) return null;

    const qatorlar = jadvalMalumotlar[faolModul.id] || [];
    if (qatorlar.length < 2) return null;

    let getX = faolModul.regressiyaX;
    let getY = faolModul.regressiyaY;
    let xNomi = faolModul.regressiyaXNomi;
    let yNomi = faolModul.regressiyaYNomi;
    let doimiylarFn = faolModul.doimiylarniTop;

    // Lengmyur uchun transformatsiya almashtirish
    if (faolModul.id === "lengmyur-regressiya") {
      if (lengmyurTransformatsiya === "lineweaver") {
        getX = (ce) => (ce > 0 ? 1 / ce : 0);
        getY = (ce, a) => (a > 0 ? 1 / a : 0);
        xNomi = "1 / C_e";
        yNomi = "1 / a";
        doimiylarFn = (qiyalik, kesim) => {
          const am = kesim > 0 ? 1 / kesim : 0;
          const k = am > 0 && qiyalik > 0 ? kesim / qiyalik : 0;
          return [
            { nom: "Maksimal monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = 1 / kesim" },
            { nom: "Lengmyur doimiysi (K)", qiymat: k, birlik: "L/mmol", izoh: "K = kesim / qiyalik" },
          ];
        };
      } else if (lengmyurTransformatsiya === "eadie") {
        getX = (ce, a) => (ce > 0 ? a / ce : 0);
        getY = (ce, a) => a;
        xNomi = "a / C_e";
        yNomi = "a";
        doimiylarFn = (qiyalik, kesim) => {
          const am = kesim;
          const k = qiyalik < 0 ? -1 / qiyalik : 0;
          return [
            { nom: "Maksimal monoqavat sig'imi (a_m)", qiymat: am, birlik: "mmol/g", izoh: "a_m = kesim" },
            { nom: "Lengmyur doimiysi (K)", qiymat: k, birlik: "L/mmol", izoh: "K = -1 / qiyalik" },
          ];
        };
      }
    }

    if (!getX || !getY) return null;

    const nuqtalar = qatorlar
      .map((q) => {
        const { xKey, yKey } = getMaydonlar(q);
        const xXom = q[xKey];
        const yXom = q[yKey];
        const x = getX(xXom, yXom);
        const y = getY(xXom, yXom);
        return { x, y, xXom, yXom };
      })
      .filter((n) => isFinite(n.x) && isFinite(n.y) && !isNaN(n.x) && !isNaN(n.y));

    if (nuqtalar.length < 2) return null;

    const N = nuqtalar.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    nuqtalar.forEach((p) => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
    });

    const maxraj = N * sumX2 - sumX * sumX;
    if (Math.abs(maxraj) < 1e-12) return null;

    const qiyalik = (N * sumXY - sumX * sumY) / maxraj;
    const kesim = (sumY - qiyalik * sumX) / N;

    // R^2 (determinatsiya koeffitsiyenti)
    const avgY = sumY / N;
    let ssTot = 0, ssRes = 0;
    nuqtalar.forEach((p) => {
      const yBashorat = qiyalik * p.x + kesim;
      ssTot += Math.pow(p.y - avgY, 2);
      ssRes += Math.pow(p.y - yBashorat, 2);
    });
    const r2 = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1;

    // Doimiylarni hisoblash
    const doimiylar = doimiylarFn ? doimiylarFn(qiyalik, kesim) : [];

    return {
      nuqtalar,
      qiyalik,
      kesim,
      r2,
      doimiylar,
      xNomi,
      yNomi,
      getX,
      getY,
    };
  }, [faolModul, jadvalMalumotlar, lengmyurTransformatsiya]);

  if (!faolModul) {
    return <div className="text-slate-400 p-8 text-center">Modul mavjud emas</div>;
  }

  // Gibbs hisobi
  const gibbsNatija = faolModul.id === "gibbs-sirt-taranglik" ? faolModul.hisobla(gibbsC) : null;
  // Kelvin hisobi
  const kelvinNatija = faolModul.id === "kelvin-kapillyar" ? faolModul.hisobla(kelvinR) : null;
  // Termodinamika hisobi (273 K va 298 K dagi p1 va p2)
  const termoNatija = faolModul.id === "termodinamika-izosterik"
    ? faolModul.hisobla(12.4, 38.6, termoT1, termoT2)
    : null;
  // Traube hisobi
  const traubeNatija = faolModul.id === "dyuklo-traube-qoidasi"
    ? faolModul.hisobla(traubeKislotaIdx, traubeC)
    : null;

  return (
    <div className="space-y-6">
      {/* ═══ 1. 7 TA CHUQUR ILMIY MODUL NAVIGATSIYASI ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {modullar.map((m, idx) => {
          const faol = m.id === faolModul.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                setFaolModulId(m.id);
                setIchkiRejim("animatsiya");
              }}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                faol
                  ? "bg-emerald-950/60 border-emerald-500 text-white shadow-xl shadow-emerald-950/60 ring-2 ring-emerald-500/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center justify-between">
                <span>Modul {idx + 1}</span>
                {faol && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              </div>
              <div className="font-bold text-xs text-white line-clamp-1 mb-0.5">
                {m.nomi.split(" ")[0]} {m.nomi.split(" ")[1] || ""}
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                {m.belgi}
              </div>
            </button>
          );
        })}
      </div>

      {/* ═══ 2. TANLANGAN MODUL KARTASI ═══ */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* MODUL SARLAVHASI VA FORMULA */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800 mb-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Chuqur Ilmiy Laboratoriya Moduli
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {faolModul.nomi}
            </h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              {faolModul.tavsif}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 shadow-inner flex items-center justify-center shrink-0">
            <LatexMatn matn={faolModul.formulaLatex} inline={false} className="text-emerald-300 text-base sm:text-lg font-bold" />
          </div>
        </div>

        {/* ═══ 3. ICHKI REJIMLAR (ANIMATSIYA, JADVAL, REGRESSIYA, NAZARIYA) ═══ */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 w-fit mb-8">
          <button
            onClick={() => setIchkiRejim("animatsiya")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              ichkiRejim === "animatsiya"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🔬 Molekulyar Animatsiya & Simulyator</span>
          </button>

          {faolModul.tajribaNamunasi && (
            <button
              onClick={() => setIchkiRejim("jadval")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                ichkiRejim === "jadval"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📋 Tajriba Jadvali</span>
            </button>
          )}

          {faolModul.regressiyaX && (
            <button
              onClick={() => setIchkiRejim("regressiya")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                ichkiRejim === "regressiya"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>📈 Chiziqli Regressiya (R²)</span>
            </button>
          )}

          <button
            onClick={() => setIchkiRejim("nazariya")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              ichkiRejim === "nazariya"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/60"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📖 Ilmiy Farazlar & Tahlil</span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 1: MOLEKULYAR ANIMATSIYA & SIMULYATOR
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "animatsiya" && (
          <div className="space-y-6">
            {/* 1 & 2: LENGMYUR VA FREYNDLIX ANIMATSIYASI */}
            {(faolModul.id === "lengmyur-regressiya" || faolModul.id === "freyndlix-regressiya") && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    {faolModul.id === "lengmyur-regressiya"
                      ? "Energetik bir jinsli sirtda monoqavat hosil bo'lishi"
                      : "Geterogen sirtda turli chuqurlikdagi markazlar to'lishi"}
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/40">
                    {faolModul.id === "lengmyur-regressiya" ? "1 Markaz = 1 Molekula" : "Chuqur → Sayoz markazlar"}
                  </span>
                </div>

                {/* Sirt animatsiyasi (2D mikroskopik kataklar) */}
                <div className="relative w-full aspect-[16/7] bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden p-6 flex flex-col justify-end">
                  {/* Gaz / Eritma fazasidagi erkin molekulalar */}
                  <div className="absolute inset-x-0 top-3 h-28 overflow-hidden pointer-events-none">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute w-3.5 h-3.5 rounded-full bg-sky-400/80 shadow-lg shadow-sky-400/50 animate-bounce"
                        style={{
                          left: `${i * 6.2 + 3}%`,
                          top: `${(i % 3) * 24 + 10}px`,
                          animationDuration: `${1.4 + (i % 5) * 0.3}s`,
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Qattiq adsorbent sirti va faol markazlar */}
                  <div className="relative z-10">
                    <div className="text-[11px] font-bold text-slate-400 mb-2 flex justify-between">
                      <span>Adsorbent kristalli sirti (Faol markazlar):</span>
                      <span className="text-emerald-400 font-mono">
                        {faolModul.id === "lengmyur-regressiya" ? "Monoqavat to'yinishi (θ = a/a_m)" : "Geterogen taqsimot"}
                      </span>
                    </div>

                    <div className="grid grid-cols-8 gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const band = i < 11;
                        return (
                          <div
                            key={i}
                            className={`h-14 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-500 ${
                              band
                                ? "bg-gradient-to-t from-emerald-600 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300"
                                : "bg-slate-900 text-slate-400 border border-dashed border-slate-700"
                            }`}
                          >
                            <span className="text-base">{band ? "●" : "○"}</span>
                            <span className="text-[9px] font-mono mt-0.5 opacity-80">
                              {band ? "Band" : "Bo'sh"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-xs text-slate-300 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <b className="text-white block mb-1">Lengmyur izohi:</b>
                    Har bir markaz band bo&apos;lgach, konsentratsiyani qancha oshirmang, yangi molekula yopisha olmaydi (gorizontal plato $\Gamma_\infty$).
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <b className="text-white block mb-1">Freyndlix izohi:</b>
                    Sirt nobirjinsli bo&apos;lgani uchun avval eng yuqori adsorbsiya issiqligiga ega markazlar to&apos;ladi, keyin sekin-asta zaif markazlar band bo&apos;ladi.
                  </div>
                </div>
              </div>
            )}

            {/* 3: BET KO'P QATLAMLI ANIMATSIYASI */}
            {faolModul.id === "bet-modeli" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    Azot gazi (77 K) ko&apos;p qatlamli fizik kondensatsiyasi
                  </h4>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/40">
                    1-qavat → 2-qavat → n-qavat
                  </span>
                </div>

                <div className="relative w-full aspect-[16/7] bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-end">
                  <div className="space-y-2">
                    {/* 3-qavat */}
                    <div className="flex justify-center gap-3 opacity-60">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-10 h-8 rounded-lg bg-sky-300 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow">
                          N₂
                        </div>
                      ))}
                    </div>
                    {/* 2-qavat */}
                    <div className="flex justify-center gap-3 opacity-80">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-10 h-8 rounded-lg bg-sky-400 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow">
                          N₂
                        </div>
                      ))}
                    </div>
                    {/* 1-monoqavat */}
                    <div className="flex justify-center gap-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="w-10 h-8 rounded-lg bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-slate-950 shadow-lg ring-2 ring-emerald-300">
                          N₂ (1)
                        </div>
                      ))}
                    </div>
                    {/* Adsorbent sirti */}
                    <div className="h-4 bg-slate-950 border-t-2 border-slate-700 rounded text-center text-[10px] text-slate-400 font-mono">
                      Adsorbent qattiq yuzasi
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed text-center">
                  BET modelida birinchi qatlamdan keyingi qatlamlar adsorbatning o&apos;zaro tortishishi (kondensatsiya) hisobiga yig&apos;iladi va g&apos;ovaklar to&apos;ladi.
                </p>
              </div>
            )}

            {/* 4: GIBBS SIRT TARANGLIK VA SFM ANIMATSIYASI */}
            {faolModul.id === "gibbs-sirt-taranglik" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        SFM Konsentratsiyasi (C):
                      </label>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {gibbsC} mol/L
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.001"
                      max="0.1"
                      step="0.002"
                      value={gibbsC}
                      onChange={(e) => setGibbsC(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />

                    <div className="grid grid-cols-3 gap-2.5 pt-3">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt taranglik (σ)</div>
                        <div className="text-xl font-mono font-black text-amber-400 my-1">
                          {gibbsNatija?.sigma.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">mN/m</span>
                        </div>
                        <div className="text-[9px] text-slate-400">Suv: 72.8 mN/m</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt bosimi (π)</div>
                        <div className="text-xl font-mono font-black text-sky-400 my-1">
                          {(72.8 - (gibbsNatija?.sigma || 72.8)).toFixed(1)} <span className="text-[10px] font-normal text-slate-400">mN/m</span>
                        </div>
                        <div className="text-[9px] text-slate-400">π = σ₀ − σ</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt ortiqchaligi (Γ)</div>
                        <div className="text-xl font-mono font-black text-emerald-400 my-1">
                          {gibbsNatija?.gammaMkmol.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">µmol/m²</span>
                        </div>
                        <div className="text-[9px] text-slate-400">s = {gibbsNatija?.s0.toFixed(2)} nm²</div>
                      </div>
                    </div>
                  </div>

                  {/* SFM molekulalari sirtga terilishi vizuali */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-400 mb-4">
                      Suv sirti va Sirt Faol Modda (Gidrofil boshcha + Gidrofob dumcha):
                    </div>

                    <div className="relative w-full h-36 bg-blue-900/30 border-t-2 border-blue-400 rounded-b-2xl overflow-hidden flex items-start justify-center gap-2 pt-1">
                      {Array.from({ length: 12 }).map((_, i) => {
                        return (
                          <div
                            key={i}
                            className="flex flex-col items-center transition-all duration-300"
                            style={{ opacity: i / 12 < (gibbsC / 0.1) * 1.2 ? 1 : 0.2 }}
                          >
                            <div className="w-1 h-8 bg-amber-400 rounded" />
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-400 border border-white shadow" />
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-2">
                      Konsentratsiya oshgani sari SFM sirtni to&apos;liq qoplab, suvning sirt tarangligini keskin pasaytiradi.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5: KELVIN KAPILYAR KONDENSATSIYA */}
            {faolModul.id === "kelvin-kapillyar" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Mezog&apos;ovak radiusi (r):
                      </label>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {kelvinR} nm (Mezog&apos;ovak 2–50 nm)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.5"
                      max="20"
                      step="0.5"
                      value={kelvinR}
                      onChange={(e) => setKelvinR(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 uppercase font-bold">
                        Kondensatsiya boshlanadigan nisbiy bosim (p / p₀):
                      </div>
                      <div className="text-4xl font-mono font-black text-emerald-400 my-2">
                        {kelvinNatija?.pNisbiy.toFixed(3)}
                      </div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        Botiq menisk tufayli bug&apos; {kelvinNatija?.pNisbiy.toFixed(2)} nisbiy bosimdayoq suyuqlikka aylanadi!
                      </div>
                    </div>
                  </div>

                  {/* Kapillyar trubka vizuali */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-400 mb-3">
                      Botiq meniskli silindrsimon mezog&apos;ovak:
                    </div>
                    <div className="w-32 h-44 mx-auto border-x-4 border-slate-600 bg-slate-950 relative rounded-b-xl overflow-hidden flex flex-col justify-end">
                      <div className="h-28 bg-blue-600/80 relative">
                        <div className="absolute -top-3 inset-x-0 h-6 bg-slate-950 rounded-b-[100%]" />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-3">
                      Botiq menisk ustida bug&apos; bosimi past bo&apos;lgani sababli kapillyar kondensatsiya yuz beradi (IUPAC IV tur).
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6: TERMODINAMIKA & IZOSTERIK ISSIQLIK */}
            {faolModul.id === "termodinamika-izosterik" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    Klapeiron-Klauzius analogi: q_st va termodinamik energetik balans
                  </h4>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/40">
                    Ekzotermik: ΔH &lt; 0, q_st &gt; 0
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>1-Izoterma harorati (T₁):</span>
                        <span className="font-mono text-cyan-400">{termoT1} K ({termoT1 - 273} °C)</span>
                      </div>
                      <input
                        type="range"
                        min="250"
                        max="310"
                        value={termoT1}
                        onChange={(e) => setTermoT1(Math.min(termoT2 - 5, Number(e.target.value)))}
                        className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                        <span>2-Izoterma harorati (T₂):</span>
                        <span className="font-mono text-rose-400">{termoT2} K ({termoT2 - 273} °C)</span>
                      </div>
                      <input
                        type="range"
                        min="280"
                        max="360"
                        value={termoT2}
                        onChange={(e) => setTermoT2(Math.max(termoT1 + 5, Number(e.target.value)))}
                        className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Natijaviy Energetik Kartalar */}
                  <div className="lg:col-span-6 grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Izosterik Issiqlik (q_st)</div>
                      <div className="text-2xl font-mono font-black text-amber-400 my-1">
                        {termoNatija?.qst.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40">
                        {termoNatija?.qst < 42 ? "Fizisorbtsiya (Van-der-Vaals)" : "Ximisorbtsiya (Kimyoviy)"}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Entalpiya o&apos;zgarishi (ΔH)</div>
                      <div className="text-2xl font-mono font-black text-rose-400 my-1">
                        {termoNatija?.deltaH.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                      </div>
                      <div className="text-[10px] text-slate-400">ΔH = -q_st (Ekzotermik)</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Erkin energiya (ΔG)</div>
                      <div className="text-2xl font-mono font-black text-purple-400 my-1">
                        {termoNatija?.deltaG.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                      </div>
                      <div className="text-[10px] text-slate-400">&lt; 0 (O&apos;z-o&apos;zidan boradi)</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Entropiya o&apos;zgarishi (ΔS)</div>
                      <div className="text-2xl font-mono font-black text-sky-400 my-1">
                        {termoNatija?.deltaS.toFixed(1)} <span className="text-xs text-slate-400 font-normal">J/(mol·K)</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Erkinlik darajasi pasayadi</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  💡 <b>Le Shatelye printsipi:</b> Adsorbsiya ekzotermik bo&apos;lgani sababli, harorat T₁={termoT1} K dan T₂={termoT2} K ga ko&apos;tarilganda adsorbent sirtidagi moddalar desorbsiyalanadi.
                </div>
              </div>
            )}

            {/* 7: DYUKLO-TRAUBE QOIDASI & GOMOLOGIK QATOR */}
            {faolModul.id === "dyuklo-traube-qoidasi" && (
              <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    Yog&apos; kislotalari gomologik qatori: Har bir -CH₂- guruhi sirt faolligini 3.2 barobar oshiradi
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/40">
                    β ≈ 3.0 – 3.5
                  </span>
                </div>

                {/* Kislotani tanlash */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(faolModul.kislotalar || []).map((k, idx) => {
                    const faol = traubeKislotaIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setTraubeKislotaIdx(idx)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          faol
                            ? "bg-emerald-950 border-emerald-500 text-white ring-2 ring-emerald-500/50"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="text-[10px] text-emerald-400 font-bold uppercase">n = {k.n}</div>
                        <div className="font-bold text-xs text-white truncate">{k.nom.split(" ")[0]}</div>
                        <div className="text-[10px] font-mono text-slate-400">β = {k.betaDaraja}×</div>
                      </button>
                    );
                  })}
                </div>

                {/* Slayder va hisob-kitob */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                      <span>Konsentratsiya (C):</span>
                      <span className="font-mono text-emerald-400 text-sm">{traubeC} mol/L</span>
                    </div>
                    <input
                      type="range"
                      min="0.002"
                      max="0.08"
                      step="0.002"
                      value={traubeC}
                      onChange={(e) => setTraubeC(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                    />

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt taranglik (σ)</div>
                        <div className="text-2xl font-mono font-black text-amber-400 my-1">
                          {traubeNatija?.sigma.toFixed(1)} <span className="text-xs font-normal text-slate-400">mN/m</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Toza suv: 72.8 mN/m</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Boshlang&apos;ich Sirt Faolligi (G₀)</div>
                        <div className="text-2xl font-mono font-black text-emerald-400 my-1">
                          {traubeNatija?.faollik} <span className="text-xs font-normal text-slate-400">mN·L/(m·mol)</span>
                        </div>
                        <div className="text-[10px] text-slate-400">G = -dσ/dC (C→0)</div>
                      </div>
                    </div>
                  </div>

                  {/* Ko'p egri chiziqli taqqoslash grafigi (SVG) */}
                  <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-4 border border-slate-800">
                    <div className="text-xs font-bold text-slate-400 mb-2 flex justify-between">
                      <span>Gomologik qatorda σ(C) ning pasayishi:</span>
                      <span className="text-emerald-400 font-mono">Traube qoidasi</span>
                    </div>

                    <div className="relative w-full aspect-[16/10]">
                      <svg className="w-full h-full" viewBox="0 0 450 250">
                        <line x1="45" y1="20" x2="45" y2="210" stroke="#334155" strokeWidth="1.5" />
                        <line x1="45" y1="210" x2="430" y2="210" stroke="#334155" strokeWidth="1.5" />

                        {[
                          { b: 12.0, d: 8, rang: "#64748b", nom: "HCOOH" },
                          { b: 13.0, d: 25, rang: "#38bdf8", nom: "CH₃COOH" },
                          { b: 14.0, d: 80, rang: "#10b981", nom: "C₂H₅COOH" },
                          { b: 14.5, d: 256, rang: "#f59e0b", nom: "C₃H₇COOH" },
                          { b: 15.0, d: 820, rang: "#ef4444", nom: "C₄H₉COOH" },
                        ].map((k, i) => {
                          const pts = [];
                          for (let step = 0; step <= 20; step++) {
                            const cVal = (step / 20) * 0.08;
                            const sVal = Math.max(20, 72.8 - k.b * Math.log(1 + k.d * cVal));
                            const svgX = 45 + (cVal / 0.08) * 370;
                            const svgY = 210 - ((sVal - 20) / (72.8 - 20)) * 180;
                            pts.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
                          }
                          const faol = traubeKislotaIdx === i;
                          return (
                            <g key={i}>
                              <polyline
                                fill="none"
                                stroke={k.rang}
                                strokeWidth={faol ? "3.5" : "1.8"}
                                strokeOpacity={faol ? 1 : 0.45}
                                points={pts.join(" ")}
                              />
                            </g>
                          );
                        })}

                        <text x="390" y="235" fill="#94a3b8" fontSize="10" fontWeight="bold">C (mol/L)</text>
                        <text x="10" y="25" fill="#94a3b8" fontSize="10" fontWeight="bold">σ</text>
                      </svg>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] font-bold justify-center pt-2 border-t border-slate-800">
                      <span className="text-slate-400">● HCOOH</span>
                      <span className="text-sky-400">● CH₃COOH</span>
                      <span className="text-emerald-400">● C₂H₅COOH</span>
                      <span className="text-amber-400">● C₃H₇COOH</span>
                      <span className="text-rose-400">● C₄H₉COOH</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 2: INTERAKTIV TAJRIBA JADVALI (EKSPERIMENT)
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "jadval" && faolModul.tajribaNamunasi && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tajriba ma&apos;lumotlari jadvali (Tahrirlash mumkin):
              </h4>
              <button
                onClick={() => namunaniTikla(faolModul.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <span>🔄 Namunaviy qiymatlarni tiklash</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                    <th className="p-3">№</th>
                    <th className="p-3">{faolModul.xNomi} ({faolModul.xBirlik})</th>
                    <th className="p-3">{faolModul.yNomi} ({faolModul.yBirlik})</th>
                    {faolModul.regressiyaX && (
                      <>
                        <th className="p-3 font-mono text-emerald-400">Regressiya X ({regressiyaNatijasi?.xNomi || faolModul.regressiyaXNomi})</th>
                        <th className="p-3 font-mono text-emerald-400">Regressiya Y ({regressiyaNatijasi?.yNomi || faolModul.regressiyaYNomi})</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(jadvalMalumotlar[faolModul.id] || []).map((qator, idx) => {
                    const { xKey, yKey } = getMaydonlar(qator);
                    const xVal = qator[xKey];
                    const yVal = qator[yKey];

                    const getX = regressiyaNatijasi?.getX || faolModul.regressiyaX;
                    const getY = regressiyaNatijasi?.getY || faolModul.regressiyaY;

                    const regX = getX ? getX(xVal, yVal) : null;
                    const regY = getY ? getY(xVal, yVal) : null;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/40">
                        <td className="p-3 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="any"
                            value={xVal}
                            onChange={(e) => qatorOzgartir(faolModul.id, idx, xKey, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="any"
                            value={yVal}
                            onChange={(e) => qatorOzgartir(faolModul.id, idx, yKey, e.target.value)}
                            className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono focus:border-emerald-500"
                          />
                        </td>
                        {faolModul.regressiyaX && (
                          <>
                            <td className="p-3 text-slate-300 font-semibold">{regX != null ? regX.toFixed(3) : "—"}</td>
                            <td className="p-3 text-emerald-400 font-bold">{regY != null ? regY.toFixed(3) : "—"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 pt-2">
              💡 Jadvaldagi istalgan katakchani o&apos;zgartirishingiz mumkin — chiziqli regressiya grafigi va fizik doimiylar avtomatik qayta hisoblanadi!
            </p>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 3: CHIZIQLI REGRESSIYA GRAFIGI & DOIMIYLARNI TOPISH
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "regressiya" && regressiyaNatijasi && (
          <div className="space-y-6">
            {/* LENGMYUR TRANSFORMASIYA TANLOVCHI (HANES-WOOLF / LINEWEAVER-BURK / EADIE-HOFSTEE) */}
            {faolModul.id === "lengmyur-regressiya" && (
              <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-400 px-2">Chiziqlashtirish usuli:</span>
                <button
                  onClick={() => setLengmyurTransformatsiya("hanes")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "hanes"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Hanes-Woolf (C_e/a vs C_e) ★ Tavsiya etiladi
                </button>
                <button
                  onClick={() => setLengmyurTransformatsiya("lineweaver")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "lineweaver"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Lineweaver-Burk (1/a vs 1/C_e)
                </button>
                <button
                  onClick={() => setLengmyurTransformatsiya("eadie")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    lengmyurTransformatsiya === "eadie"
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  Eadie-Hofstee (a vs a/C_e)
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* SVG REGRESSIYA CHIZMASI */}
              <div className="lg:col-span-7 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-inner">
                <div className="relative w-full aspect-[16/11]">
                  <svg className="w-full h-full" viewBox="0 0 500 320">
                    <line x1="50" y1="20" x2="50" y2="280" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="50" y1="280" x2="480" y2="280" stroke="#1e293b" strokeWidth="1.5" />
                    <line x1="50" y1="150" x2="480" y2="150" stroke="#1e293b" strokeDasharray="4" />
                    <line x1="265" y1="20" x2="265" y2="280" stroke="#1e293b" strokeDasharray="4" />

                    {(() => {
                      const pts = regressiyaNatijasi.nuqtalar;
                      const minX = Math.min(...pts.map((p) => p.x));
                      const maxX = Math.max(...pts.map((p) => p.x));
                      const y1_line = regressiyaNatijasi.qiyalik * minX + regressiyaNatijasi.kesim;
                      const y2_line = regressiyaNatijasi.qiyalik * maxX + regressiyaNatijasi.kesim;

                      const allY = [...pts.map((p) => p.y), y1_line, y2_line].filter(isFinite);
                      const minY = Math.min(...allY);
                      const maxY = Math.max(...allY);

                      const spanX = Math.max(0.001, maxX - minX);
                      const spanY = Math.max(0.001, maxY - minY);

                      const toSvg = (x, y) => ({
                        cx: 60 + ((x - minX) / spanX) * 400,
                        cy: 260 - ((y - minY) / spanY) * 220,
                      });

                      const p1 = toSvg(minX, y1_line);
                      const p2 = toSvg(maxX, y2_line);

                      return (
                        <>
                          <line
                            x1={p1.cx}
                            y1={p1.cy}
                            x2={p2.cx}
                            y2={p2.cy}
                            stroke="#10b981"
                            strokeWidth="3"
                          />

                          {pts.map((p, i) => {
                            const { cx, cy } = toSvg(p.x, p.y);
                            return (
                              <g key={i}>
                                <circle cx={cx} cy={cy} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}

                    <text x="475" y="305" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">
                      {regressiyaNatijasi.xNomi}
                    </text>
                    <text x="15" y="25" fill="#94a3b8" fontSize="11" fontWeight="bold">
                      {regressiyaNatijasi.yNomi}
                    </text>
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 px-2 border-t border-slate-900">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Eksperimental nuqtalar
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-4 h-1 bg-emerald-400 rounded" /> Eng kichik kvadratlar to&apos;g&apos;ri chizig&apos;i
                  </span>
                </div>
              </div>

              {/* HISOBLANGAN FIZIKAVIY DOIMIYLAR KARTASI */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    To&apos;g&apos;ri chiziq tenglamasi: y = m·x + b
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block">Qiyalik (m):</span>
                      <span className="text-base font-mono font-bold text-white">
                        {regressiyaNatijasi.qiyalik.toFixed(4)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block">Erkin had (b):</span>
                      <span className="text-base font-mono font-bold text-white">
                        {regressiyaNatijasi.kesim.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Ishonchlilik (R²):</span>
                    <span className="text-emerald-400 font-bold">{(regressiyaNatijasi.r2 * 100).toFixed(2)}% ({regressiyaNatijasi.r2.toFixed(4)})</span>
                  </div>
                </div>

                {/* DOIMIYLAR */}
                <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Keltirib chiqarilgan fizik doimiylar:
                  </div>

                  {regressiyaNatijasi.doimiylar.map((d, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
                      <div className="text-[11px] text-slate-300 font-medium">{d.nom}:</div>
                      <div className="text-xl font-mono font-black text-white my-0.5">
                        {typeof d.qiymat === "number" ? d.qiymat.toFixed(3) : d.qiymat} <span className="text-xs font-normal text-slate-400">{d.birlik}</span>
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">💡 {d.izoh}</div>
                    </div>
                  ))}

                  {/* FREYNDLIX INTERPRETATSIYA INDIKATORI */}
                  {faolModul.id === "freyndlix-regressiya" && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs leading-relaxed">
                      {regressiyaNatijasi.qiyalik >= 0.1 && regressiyaNatijasi.qiyalik <= 0.5 ? (
                        <span className="text-emerald-300">
                          ✨ <b>Optimal adsorbsiya (0.1 &lt; 1/n &lt; 0.5):</b> Sirt yuqori geterogenlikka ega, jarayon juda samarali va qulay kechadi.
                        </span>
                      ) : regressiyaNatijasi.qiyalik <= 1.0 ? (
                        <span className="text-sky-300">
                          📊 <b>O&apos;rtacha adsorbsiya (0.5 &lt; 1/n ≤ 1.0):</b> Psevdo-chiziqli oraliq, Genri qonuniga yaqin.
                        </span>
                      ) : (
                        <span className="text-rose-300">
                          ⚠️ <b>Noqulay adsorbsiya (1/n &gt; 1):</b> Kooperativ ta&apos;sir mavjud.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            REJIM 4: ILMIY FARAZLAR VA METODIK TAHLIL
           ═══════════════════════════════════════════════════════════════════ */}
        {ichkiRejim === "nazariya" && (
          <div className="space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800">
              <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4">
                Modelning Nazariy Farazlari va Cheklovlari:
              </h4>

              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                {faolModul.farazlar.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {i + 1}
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <b className="text-white block mb-1">Amaliyotda qo&apos;llanishi:</b>
                Sanoatda gazlarni tozalash, qon plazmasi gemosorbsiyasi, gaz niqoblari va xromatografiya ustunlarida aynan ushbu tenglamalardan foydalaniladi.
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <b className="text-white block mb-1">IUPAC Izoterma tasnifi:</b>
                Mikrog&apos;ovaklar uchun I tur, mezog&apos;ovaklar (kapillyar gisterezis) uchun IV tur, ko&apos;p qatlamli gaz adsorbsiyasi uchun esa II va VI tur izotermalar mos keladi.
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <b className="text-white block mb-1">O&apos;qituvchiga metodik tavsiya:</b>
                Dars vaqtida doskaga chiqib, tajriba jadvalidagi sonlarni o&apos;zgartiring — o&apos;quvchilar burchak tangensi qanday siljishini o&apos;z ko&apos;zlari bilan ko&apos;radi.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
