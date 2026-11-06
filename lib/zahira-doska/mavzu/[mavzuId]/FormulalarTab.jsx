// app/doska/mavzu/[mavzuId]/FormulalarTab.jsx
//
// Smart Doska — Interaktiv Formulalar va Jonli Animatsiyalar Paneli.
// Har bir modul:
// 1. Asosiy Formula (KaTeX)
// 2. Formuladagi har bir belgining aniq ma'nosi va o'lchov birliklari
// 3. Formulani tushuntiradigan qiziqarli jonli interaktiv animatsiya va slayderlar
// 4. Tajriba jadvali va Chiziqli regressiya (Eksperiment)
"use client";

import React, { useState, useMemo, useEffect } from "react";
import LatexMatn from "@/components/LatexMatn";
import Ikon from "@/components/Ikon";
import MolekulyarKinetikaCanvas from "./MolekulyarKinetikaCanvas";
import {
  LENGMYUR_PRESETLARI,
  FREYNDLIX_PRESETLARI,
  LengmyurIzotermaGrafik,
  FreyndlixIzotermaGrafik,
  BetIzotermaGrafik,
  KelvinGisterezisGrafik,
  TermodinamikaIzosterikGrafik,
  TraubeIzotermaGrafik,
  TRAUBE_KISLOTALAR,
} from "./IzotermaGrafiklar";

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
  const modullar = mavzu?.formulalar || [];
  const [faolModulId, setFaolModulId] = useState(modullar[0]?.id || "lengmyur-regressiya");
  const [rejim, setRejim] = useState("animatsiya"); // "animatsiya" | "regressiya"

  const faolModul = modullar.find((m) => m.id === faolModulId) || modullar[0];

  // ─── 1. LENGMYUR HOLATLARI ───
  const [lengmyurC, setLengmyurC] = useState(0.08); // mol/L
  const [lengmyurAm, setLengmyurAm] = useState(4.5); // mmol/g
  const [lengmyurK, setLengmyurK] = useState(35); // L/mol
  const [lengmyurT, setLengmyurT] = useState(298); // K
  const [lengmyurTransformatsiya, setLengmyurTransformatsiya] = useState("hanes");

  const lengmyurTheta = useMemo(() => {
    const baza = (lengmyurK * lengmyurC) / (1 + lengmyurK * lengmyurC);
    return Math.min(1, Math.max(0, baza));
  }, [lengmyurK, lengmyurC]);

  const lengmyurA = useMemo(() => {
    return lengmyurAm * lengmyurTheta;
  }, [lengmyurAm, lengmyurTheta]);

  const lengmyurVads = useMemo(() => (40 * lengmyurC * (1 - lengmyurTheta)).toFixed(1), [lengmyurC, lengmyurTheta]);
  const lengmyurVdes = useMemo(() => ((40 / (lengmyurK || 1)) * (lengmyurT / 298) * lengmyurTheta).toFixed(1), [lengmyurK, lengmyurT, lengmyurTheta]);

  // ─── 2. FREYNDLIX HOLATLARI ───
  const [freyndlixC, setFreyndlixC] = useState(0.06); // mol/L
  const [freyndlixKf, setFreyndlixKf] = useState(2.8); // K_F
  const [freyndlixNInv, setFreyndlixNInv] = useState(0.45); // 1/n (0.1..1.0)
  const [freyndlixTaqqosla, setFreyndlixTaqqosla] = useState(false);

  const freyndlixA = useMemo(() => {
    return freyndlixKf * Math.pow(Math.max(0.0001, freyndlixC), freyndlixNInv);
  }, [freyndlixKf, freyndlixC, freyndlixNInv]);

  const freyndlixMarkazlar = useMemo(() => {
    const n = freyndlixNInv > 0 ? 1 / freyndlixNInv : 2.0;
    return Array.from({ length: 16 }).map((_, idx) => {
      const ulush = idx / 15;
      const energiya = Math.round(65 - Math.pow(ulush, 1 / n) * 50);
      const bandChegara = Math.min(1, freyndlixA / (freyndlixKf * 1.5));
      const band = ulush <= bandChegara;
      return { id: idx, energiya, band };
    });
  }, [freyndlixNInv, freyndlixA, freyndlixKf]);

  // ─── 3. BET HOLATLARI ───
  const [betPnisbiy, setBetPnisbiy] = useState(0.20);
  const [betCParam, setBetCParam] = useState(100);
  const [betAm, setBetAm] = useState(2.2);

  const betTheta = useMemo(() => {
    const x = Math.min(0.95, Math.max(0.01, betPnisbiy));
    const C = Math.max(2, betCParam);
    return (C * x) / ((1 - x) * (1 + (C - 1) * x));
  }, [betPnisbiy, betCParam]);

  const betSolishtirmaSirt = useMemo(() => {
    return (betAm * 97.556).toFixed(1); // m^2/g
  }, [betAm]);

  // ─── 4. GIBBS HOLATLARI ───
  const [gibbsC, setGibbsC] = useState(0.025); // mol/L
  const [gibbsB, setGibbsB] = useState(14.5); // mN/m
  const [gibbsA, setGibbsA] = useState(65);

  const gibbsNatija = useMemo(() => {
    const R = 8.314;
    const T = 298;
    const B_SI = gibbsB * 1e-3; // N/m
    const sigma = Math.max(20, 72.8 - gibbsB * Math.log(1 + gibbsA * gibbsC));
    const hosila = -(B_SI * gibbsA) / (1 + gibbsA * gibbsC);
    const gamma = -((gibbsC / (R * T)) * hosila);
    const gammaMkmol = gamma * 1e6;
    const s0 = gamma > 0 ? (1 / (gamma * 6.022e23)) * 1e18 : 0.35;
    return { sigma, gammaMkmol, s0 };
  }, [gibbsC, gibbsB, gibbsA]);

  // ─── 5. KELVIN HOLATLARI ───
  const [kelvinR, setKelvinR] = useState(4.0); // nm
  const [kelvinT, setKelvinT] = useState(298); // K

  const kelvinNatija = useMemo(() => {
    const R = 8.314;
    const sigma = 72.8e-3;
    const Vm = 18e-6;
    const rMetr = kelvinR * 1e-9;
    const lnNisbiy = -((2 * sigma * Vm) / (rMetr * R * kelvinT));
    const pNisbiy = Math.exp(lnNisbiy);
    return { pNisbiy: Math.min(1, Math.max(0.01, pNisbiy)) };
  }, [kelvinR, kelvinT]);

  // ─── 6. TERMODINAMIKA HOLATLARI ───
  const [termoT1, setTermoT1] = useState(273); // K
  const [termoT2, setTermoT2] = useState(298); // K

  const termoNatija = useMemo(() => {
    const qstBazaviy = 32400; // J/mol
    const R = 8.314;
    const k1 = 0.0148 * Math.exp((qstBazaviy / R) * (1 / termoT1 - 1 / 298));
    const k2 = 0.0148 * Math.exp((qstBazaviy / R) * (1 / termoT2 - 1 / 298));
    const p1 = 2.0 / (3.5 * Math.max(0.0001, k1));
    const p2 = 2.0 / (3.5 * Math.max(0.0001, k2));
    const deltaT = Math.max(1, termoT2 - termoT1);
    const qst = (R * ((termoT1 * termoT2) / deltaT) * Math.log(Math.max(1.01, p2 / p1))) / 1000;
    const deltaH = -qst;
    const T_avg = (termoT1 + termoT2) / 2;
    const deltaS = -48.5; // J/(mol·K)
    const deltaG = deltaH - (T_avg * deltaS) / 1000;
    return { p1, p2, qst, deltaH, deltaG, deltaS };
  }, [termoT1, termoT2]);

  // ─── 7. TRAUBE HOLATLARI ───
  const [traubeKislotaIdx, setTraubeKislotaIdx] = useState(2); // Propion kislota
  const [traubeC, setTraubeC] = useState(0.04);
  const [traubeTomchilarSoni, setTraubeTomchilarSoni] = useState(28);
  const [traubeAvtoTomizish, setTraubeAvtoTomizish] = useState(true);

  const traubeNatija = useMemo(() => {
    const k = TRAUBE_KISLOTALAR[traubeKislotaIdx] || TRAUBE_KISLOTALAR[2];
    const sigma = Math.max(20, 72.8 - k.b * Math.log(1 + k.d * traubeC));
    const faollik = k.b * k.d;
    return { sigma, faollik, kislota: k };
  }, [traubeKislotaIdx, traubeC]);

  useEffect(() => {
    if (!traubeAvtoTomizish || faolModul?.id !== "dyuklo-traube-qoidasi") return;
    const sigma = traubeNatija?.sigma || 72.8;
    const intervalMs = Math.max(280, Math.round((sigma / 72.8) * 1000));
    const timer = setInterval(() => {
      setTraubeTomchilarSoni((s) => s + 1);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [traubeAvtoTomizish, faolModul?.id, traubeNatija?.sigma]);

  // ─── TAJRIBA JADVALI VA REGRESSIYA HISOB-KITOBLARI ───
  const [jadvalMalumotlar, setJadvalMalumotlar] = useState(() => {
    const dastlabki = {};
    modullar.forEach((m) => {
      if (m.tajribaNamunasi) {
        dastlabki[m.id] = m.tajribaNamunasi.map((q) => ({ ...q }));
      }
    });
    return dastlabki;
  });

  const namunaniTikla = (modulId) => {
    const modul = modullar.find((m) => m.id === modulId);
    if (modul?.tajribaNamunasi) {
      setJadvalMalumotlar((eski) => ({
        ...eski,
        [modulId]: modul.tajribaNamunasi.map((q) => ({ ...q })),
      }));
    }
  };

  const qatorOzgartir = (modulId, index, kalit, yangiQiymat) => {
    setJadvalMalumotlar((eski) => {
      const qatorlar = (eski[modulId] || []).map((q, idx) => {
        if (idx !== index) return q;
        return { ...q, [kalit]: parseFloat(yangiQiymat) || 0 };
      });
      return { ...eski, [modulId]: qatorlar };
    });
  };

  const regressiyaNatijasi = useMemo(() => {
    if (!faolModul || !faolModul.tajribaNamunasi) return null;
    const qatorlar = jadvalMalumotlar[faolModul.id] || faolModul.tajribaNamunasi;

    let getX = faolModul.regressiyaX;
    let getY = faolModul.regressiyaY;
    let xNomi = faolModul.regressiyaXNomi;
    let yNomi = faolModul.regressiyaYNomi;
    let doimiylarFn = faolModul.doimiylarniTop;

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

    const avgY = sumY / N;
    let ssTot = 0, ssRes = 0;
    nuqtalar.forEach((p) => {
      const yBashorat = qiyalik * p.x + kesim;
      ssTot += Math.pow(p.y - avgY, 2);
      ssRes += Math.pow(p.y - yBashorat, 2);
    });
    const r2 = ssTot > 1e-12 ? Math.max(0, Math.min(1, 1 - ssRes / ssTot)) : 1.0;
    const doimiylar = doimiylarFn ? doimiylarFn(qiyalik, kesim) : [];

    return { nuqtalar, qiyalik, kesim, r2, doimiylar, xNomi, yNomi, getX, getY };
  }, [faolModul, jadvalMalumotlar, lengmyurTransformatsiya]);

  if (!faolModul) {
    return <div className="text-slate-400 p-8 text-center">Modul mavjud emas</div>;
  }

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
                setRejim("animatsiya");
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

      {/* ═══ 2. ASOSIY FORMULA PANELI (HERO BANNER) ═══ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
              {faolModul.nomi}
            </span>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {faolModul.tavsif}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRejim("animatsiya")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                rejim === "animatsiya"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Ikon nom="chaqmoq" olcham={14} />
              <span>Jonli Simulyator</span>
            </button>
            <button
              onClick={() => setRejim("regressiya")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                rejim === "regressiya"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              <Ikon nom="grafik" olcham={14} />
              <span>Regressiya & Tajriba</span>
            </button>
          </div>
        </div>

        {/* Katta KaTeX Formulaning O'zi */}
        <div className="py-6 text-center">
          <div className="inline-block p-4 sm:p-6 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-xl">
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-white text-center">
              <LatexMatn matn={`$$${faolModul.formulaLatex || faolModul.belgi}$$`} />
            </div>
          </div>
        </div>

        {/* ═══ 3. FORMULADAGI HAR BIR BELGINING MA'NOSI (INTERAKTIV KARTALAR) ═══ */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Ikon nom="kitob" olcham={14} className="text-emerald-400" />
            <span>Formuladagi belgilar va ularning fizik ma&apos;nosi:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(faolModul.belgilar || []).map((b, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/50 transition-colors flex items-start gap-3"
              >
                <span className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-sm font-bold shrink-0">
                  <LatexMatn matn={`$${b.belgi}$`} inline />
                </span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{b.nom}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">({b.birlik})</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {b.izoh}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 4. JONLI INTERAKTIV ANIMATSIYA & SIMULYATOR REJIMI ═══ */}
      {rejim === "animatsiya" && (
        <div className="space-y-6">
          {/* ─── MODUL 1: LENGMYUR SIMULYATORI ─── */}
          {faolModul.id === "lengmyur-regressiya" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-amber-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setLengmyurC(0.01); setLengmyurK(35); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white transition"
                >
                  1. Genri sohasi (C=0.01M)
                </button>
                <button
                  onClick={() => { setLengmyurC(0.03); setLengmyurK(35); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white transition"
                >
                  2. Yarim bandlik (θ=50%)
                </button>
                <button
                  onClick={() => { setLengmyurC(0.20); setLengmyurK(60); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white transition"
                >
                  3. To&apos;yinish platosi (θ→95%)
                </button>
                <button
                  onClick={() => { setLengmyurT(350); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 hover:text-white transition"
                >
                  4. Termik Desorbsiya (T=350K)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="lengmyur-regressiya"
                konsentratsiya={lengmyurC}
                harorat={lengmyurT}
                qoplanishUlishi={lengmyurTheta}
                am={lengmyurAm}
                nom="Lengmyur Monomolekulyar Kinetikasi"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Konsentratsiya (C):</span>
                    <span className="font-mono text-emerald-400">{lengmyurC} mol/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.25"
                    step="0.01"
                    value={lengmyurC}
                    onChange={(e) => setLengmyurC(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.01 (Suyultirilgan)</span>
                    <span>0.25 (To&apos;yingan)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Adsorbsiya doimiysi (K):</span>
                    <span className="font-mono text-cyan-400">{lengmyurK} L/mol</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="1"
                    value={lengmyurK}
                    onChange={(e) => setLengmyurK(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>5 (Kuchsiz affinitet)</span>
                    <span>80 (Kuchli tortishuv)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Maksimal sig&apos;im (a_m):</span>
                    <span className="font-mono text-amber-400">{lengmyurAm} mmol/g</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="10.0"
                    step="0.5"
                    value={lengmyurAm}
                    onChange={(e) => setLengmyurAm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1.5 mmol/g</span>
                    <span>10.0 mmol/g</span>
                  </div>
                </div>
              </div>

              {/* Jonli SVG Grafigi */}
              <LengmyurIzotermaGrafik
                am={lengmyurAm}
                K={lengmyurK}
                joriyC={lengmyurC}
                joriyA={lengmyurA}
                theta={lengmyurTheta}
              />

              {/* Sirt markazlari kinetikasi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Qoplanish darajasi (θ)</div>
                  <div className="text-2xl font-mono font-black text-emerald-400 my-1">
                    {(lengmyurTheta * 100).toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-slate-400">θ = K·C / (1 + K·C)</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Adsorbsiya tezligi (v_ads)</div>
                  <div className="text-2xl font-mono font-black text-cyan-400 my-1">
                    {lengmyurVads}
                  </div>
                  <div className="text-[10px] text-slate-400">v_ads = k_a · C · (1 - θ)</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Desorbsiya tezligi (v_des)</div>
                  <div className="text-2xl font-mono font-black text-rose-400 my-1">
                    {lengmyurVdes}
                  </div>
                  <div className="text-[10px] text-slate-400">v_des = k_d · θ</div>
                </div>
              </div>

              {/* 2D MIKROSKOPIK SIRT KINETIKASI (20 TA MARKAZNING BANDLIGI) */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>2D Mikroskopik Sirt Qatlami (Lengmyur Markazlari):</span>
                  </span>
                  <span className="font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Band markazlar: {Math.round(lengmyurTheta * 20)} / 20 ta (θ = {(lengmyurTheta * 100).toFixed(0)}%)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-24" viewBox="0 0 600 100">
                    <defs>
                      <linearGradient id="sirt-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Adsorbent qattiq fazasi (taglik) */}
                    <rect x="10" y="65" width="580" height="30" rx="6" fill="url(#sirt-gradient)" stroke="#475569" strokeWidth="1.5" />
                    <text x="300" y="85" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">
                      ADSORBENT QATTIQ SIRTI (ENERGETIK BIR JINSLI MARKAZLAR)
                    </text>

                    {/* 20 ta faol markaz va molekulalar */}
                    {Array.from({ length: 20 }).map((_, i) => {
                      const cx = 35 + i * 28;
                      const bandSoni = Math.round(lengmyurTheta * 20);
                      const band = i < bandSoni;

                      return (
                        <g key={i}>
                          {/* Sirt faol o'rni (chuqurcha) */}
                          <line x1={cx} y1="65" x2={cx} y2="58" stroke="#64748b" strokeWidth="2" strokeDasharray={band ? "none" : "2,2"} />
                          <circle cx={cx} cy="58" r="4" fill={band ? "#10b981" : "#1e293b"} stroke={band ? "#34d399" : "#475569"} strokeWidth="1.5" />

                          {/* Adsorbsiyalangan molekula */}
                          {band ? (
                            <g filter="url(#glow-emerald)">
                              <circle cx={cx} cy="42" r="9" fill="#10b981" stroke="#a7f3d0" strokeWidth="2" />
                              <circle cx={cx - 3} cy="39" r="2.5" fill="#ffffff" opacity="0.8" />
                            </g>
                          ) : (
                            /* Bo'sh markaz ustida erkin uchib yurgan molekula (gaz fazasi) */
                            <g opacity="0.4">
                              <circle cx={cx} cy={20 + (i % 3) * 6} r="5" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="2,2" />
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🟢 Yashil doiralar: Birikkan monoqavat molekulalari (θ)</span>
                  <span>⚪ Ochiq markazlar: Erkin sirt (1 − θ)</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 2: FREYNDLIX SIMULYATORI ─── */}
          {faolModul.id === "freyndlix-regressiya" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-amber-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setFreyndlixC(0.02); setFreyndlixNInv(0.45); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition"
                >
                  1. Chuqur o&apos;ralar to&apos;lishi (E=65 kJ)
                </button>
                <button
                  onClick={() => { setFreyndlixC(0.08); setFreyndlixNInv(0.45); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-white transition"
                >
                  2. O&apos;rta faol markazlar
                </button>
                <button
                  onClick={() => { setFreyndlixC(0.14); setFreyndlixNInv(0.25); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 hover:text-white transition"
                >
                  3. Kuchli geterogenlik (1/n=0.25)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="freyndlix-regressiya"
                konsentratsiya={freyndlixC}
                harorat={298}
                qoplanishUlishi={Math.min(1, freyndlixA / 10)}
                nom="Freyndlix Geterogen Sirt Kinetikasi"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Konsentratsiya (C):</span>
                    <span className="font-mono text-amber-400">{freyndlixC} mol/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.15"
                    step="0.01"
                    value={freyndlixC}
                    onChange={(e) => setFreyndlixC(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Geterogenlik ko&apos;rsatkichi (1/n):</span>
                    <span className="font-mono text-emerald-400">{freyndlixNInv}</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="0.9"
                    step="0.05"
                    value={freyndlixNInv}
                    onChange={(e) => setFreyndlixNInv(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>0.2 (Katta nobirjinslilik)</span>
                    <span>0.9 (Idealga yaqin)</span>
                  </div>
                </div>
              </div>

              <FreyndlixIzotermaGrafik
                kf={freyndlixKf}
                nInv={freyndlixNInv}
                joriyC={freyndlixC}
                joriyA={freyndlixA}
                taqqosla={freyndlixTaqqosla}
              />

              {/* Energetik relyef markazlari va 2D Potensial O'ralar */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>2D Geterogen Energetik Relyef (Avval chuqur o&apos;ralar to&apos;ladi):</span>
                  </span>
                  <span className="text-amber-400 font-mono bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    {freyndlixMarkazlar.filter((m) => m.band).length} / 16 markaz to&apos;ldi
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-28" viewBox="0 0 600 110">
                    <defs>
                      <linearGradient id="well-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#451a03" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </linearGradient>
                      <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Energetik relyef konturi */}
                    {freyndlixMarkazlar.map((m, i) => {
                      const cx = 35 + i * 35;
                      const chuqurlik = (m.energiya / 65) * 55; // 15..55 px
                      const yBottom = 25 + chuqurlik;

                      return (
                        <g key={m.id}>
                          {/* Potensial o'ra U-shakli */}
                          <path
                            d={`M ${cx - 14},25 Q ${cx},${yBottom + 10} ${cx + 14},25`}
                            fill="none"
                            stroke={m.band ? "#f59e0b" : "#475569"}
                            strokeWidth={m.band ? "2.5" : "1.5"}
                            strokeDasharray={m.band ? "none" : "2,2"}
                          />
                          {/* O'ra ichidagi molekula */}
                          {m.band ? (
                            <g filter="url(#glow-amber)">
                              <circle cx={cx} cy={yBottom - 2} r="8" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
                              <circle cx={cx - 2} cy={yBottom - 5} r="2" fill="#ffffff" />
                              <text x={cx} y={yBottom + 20} textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="bold">
                                {m.energiya}kJ
                              </text>
                            </g>
                          ) : (
                            <text x={cx} y={yBottom + 20} textAnchor="middle" fill="#64748b" fontSize="9">
                              {m.energiya}kJ
                            </text>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🔴 Chap tomonda: Yuqori energiyali chuqur markazlar (E ≈ 65 kJ/mol)</span>
                  <span>🟡 O&apos;ng tomonda: Kuchsiz sayoz markazlar (E ≈ 15 kJ/mol)</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 3: BET KO'P QATLAMLI SIMULYATORI ─── */}
          {faolModul.id === "bet-modeli" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-cyan-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setBetPnisbiy(0.12); setBetCParam(100); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition"
                >
                  1. BET Chiziqli sohasi (p/p₀ = 0.12, B nuqta)
                </button>
                <button
                  onClick={() => { setBetPnisbiy(0.35); setBetCParam(100); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white transition"
                >
                  2. 2-qatlam kondensatsiyasi (p/p₀ = 0.35)
                </button>
                <button
                  onClick={() => { setBetPnisbiy(0.75); setBetCParam(100); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-sky-300 hover:text-white transition"
                >
                  3. Cheksiz poliqatlam (p/p₀ = 0.75)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="bet-modeli"
                konsentratsiya={betPnisbiy}
                harorat={77}
                qoplanishUlishi={Math.min(1, betTheta / 3)}
                nom="BET Ko'p Qatlamli Kinetika"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Nisbiy bosim (p / p₀):</span>
                    <span className="font-mono text-cyan-400">{betPnisbiy}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.85"
                    step="0.02"
                    value={betPnisbiy}
                    onChange={(e) => setBetPnisbiy(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>BET doimiysi (C_BET):</span>
                    <span className="font-mono text-emerald-400">{betCParam}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="250"
                    step="10"
                    value={betCParam}
                    onChange={(e) => setBetCParam(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Monoqavat sig&apos;imi (a_m):</span>
                    <span className="font-mono text-amber-400">{betAm} mmol/g</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={betAm}
                    onChange={(e) => setBetAm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <BetIzotermaGrafik
                betPnisbiy={betPnisbiy}
                betCParam={betCParam}
                betTheta={betTheta}
              />

              {/* 2D KO'P QATLAMLI POLIMOLEKULYAR ADSORBSIYA ANIMATSIYASI */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>2D Polimolekulyar Qatlamlar (BET Piramidasi):</span>
                  </span>
                  <span className="font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Nisbiy bandlik: θ = {betTheta.toFixed(2)} qavat
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                    <defs>
                      <linearGradient id="bet-sirt-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                    </defs>

                    {/* Qattiq sirt */}
                    <rect x="20" y="90" width="560" height="25" rx="5" fill="url(#bet-sirt-grad)" stroke="#475569" strokeWidth="1.5" />
                    <text x="300" y="107" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                      ADSORBENTNING G&apos;OVAKSIZ SIRTI (QATTIQ FAZA)
                    </text>

                    {/* 14 ta ustun bo'yicha ko'p qatlamli molekulalar */}
                    {Array.from({ length: 14 }).map((_, colIdx) => {
                      const cx = 50 + colIdx * 38;
                      // Har bir ustundagi qatlamlar soni p/p0 ga qarab tasodifiy/reallik bilan o'sadi
                      const bazaQatlam = Math.floor(betTheta);
                      const qoldiq = betTheta - bazaQatlam;
                      const qatlamSoni = Math.min(
                        4,
                        Math.max(
                          0,
                          bazaQatlam + ((colIdx + Math.floor(betPnisbiy * 10)) % 3 < qoldiq * 3 ? 1 : 0)
                        )
                      );

                      return (
                        <g key={colIdx}>
                          {Array.from({ length: qatlamSoni }).map((_, layerIdx) => {
                            const cy = 76 - layerIdx * 18;
                            const birinchiQavat = layerIdx === 0;

                            return (
                              <g key={layerIdx}>
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r="8"
                                  fill={birinchiQavat ? "#10b981" : "#0ea5e9"}
                                  stroke={birinchiQavat ? "#34d399" : "#7dd3fc"}
                                  strokeWidth="1.5"
                                />
                                <circle cx={cx - 2} cy={cy - 2} r="2" fill="#ffffff" opacity="0.7" />
                              </g>
                            );
                          })}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🟢 Yashil: 1-monoqavat (Adsorbent bilan mustahkam bog&apos;lanish, E₁)</span>
                  <span>🔵 Moviy: 2-, 3-, 4-qatlamlar (Suyuqlik kondensatsiyasi, E_L)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    S_BET
                  </span>
                  <div>
                    <div className="text-xs text-slate-400 font-bold">Haqiqiy solishtirma sirt maydoni (ISO 9277):</div>
                    <div className="text-xl font-mono font-black text-cyan-300">
                      {betSolishtirmaSirt} m²/g
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  S = a_m · N_A · ω (N₂ uchun ω = 0.162 nm²)
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 4: GIBBS SIRT TARANGLIK SIMULYATORI ─── */}
          {faolModul.id === "gibbs-sirt-taranglik" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-emerald-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setGibbsC(0.002); setGibbsB(14.5); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white transition"
                >
                  1. Sof suvga yaqin (σ ≈ 71 mN/m)
                </button>
                <button
                  onClick={() => { setGibbsC(0.030); setGibbsB(14.5); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 hover:text-white transition"
                >
                  2. SFM Monooqavati (σ ≈ 45 mN/m)
                </button>
                <button
                  onClick={() => { setGibbsC(0.090); setGibbsB(18.0); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 hover:text-white transition"
                >
                  3. Zich to&apos;yingan qatlam (σ ≈ 22 mN/m)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="gibbs-sirt-taranglik"
                konsentratsiya={gibbsC}
                harorat={298}
                qoplanishUlishi={Math.min(1, gibbsNatija.gammaMkmol / 8)}
                nom="Gibbs SFM Sirt Kinetikasi"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>SFM konsentratsiyasi (C):</span>
                    <span className="font-mono text-emerald-400">{gibbsC} mol/L</span>
                  </div>
                  <input
                    type="range"
                    min="0.001"
                    max="0.100"
                    step="0.002"
                    value={gibbsC}
                    onChange={(e) => setGibbsC(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Shishkovskiy B parametri:</span>
                    <span className="font-mono text-cyan-400">{gibbsB} mN/m</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="22"
                    step="0.5"
                    value={gibbsB}
                    onChange={(e) => setGibbsB(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              {/* 2D SUV-HAVO CHEGARASI VA SFM ORIENTATSIYASI */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>2D Suv-Havo Chegarasi (Gidrofil Boshcha + Gidrofob Dumcha):</span>
                  </span>
                  <span className="font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Sirt taranglik: σ = {gibbsNatija.sigma.toFixed(1)} mN/m
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                    <defs>
                      <linearGradient id="suv-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#082f49" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {/* Havo qatlami (yuqorida) */}
                    <rect x="10" y="5" width="580" height="50" fill="#0f172a" opacity="0.4" rx="4" />
                    <text x="35" y="22" fill="#64748b" fontSize="10" fontWeight="bold">HAVO FAZASI</text>

                    {/* Suv fazasi (pastda) */}
                    <rect x="10" y="55" width="580" height="60" fill="url(#suv-grad)" stroke="#0284c7" strokeWidth="1" rx="4" />
                    <text x="35" y="105" fill="#38bdf8" fontSize="10" fontWeight="bold">SUV HAVZASI (QUTBLI FAZA)</text>

                    {/* Fazalar chegarasi chizig'i */}
                    <line x1="10" y1="55" x2="590" y2="55" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,2" />

                    {/* SFM molekulalari: qanchalik ko'p konsentratsiya bo'lsa shunchalik zich o'tiradi */}
                    {Array.from({ length: 18 }).map((_, idx) => {
                      const cx = 50 + idx * 29;
                      const bandSoni = Math.min(18, Math.max(3, Math.round((gibbsC / 0.10) * 18)));
                      const bor = idx < bandSoni;

                      if (!bor) return null;

                      return (
                        <g key={idx}>
                          {/* Gidrofob uglevodorod dumcha (havoda) */}
                          <path
                            d={`M ${cx},55 Q ${cx + 3},42 ${cx - 2},32 Q ${cx + 2},22 ${cx},14`}
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {/* Gidrofil qutbli boshcha (suv ichida) */}
                          <circle cx={cx} cy="58" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🟡 Sariq dumcha: Gidrofob uglevodorod zanjiri (havoga qaraydi)</span>
                  <span>🔵 Moviy boshcha: Gidrofil qutbli guruh (suvga botadi)</span>
                </div>
              </div>

              {/* Gibbs Natijalari */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt taranglik (σ)</div>
                  <div className="text-2xl font-mono font-black text-rose-400 my-1">
                    {gibbsNatija.sigma.toFixed(1)} <span className="text-xs text-slate-400 font-normal">mN/m</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Toza suvda 72.8 mN/m</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Sirt ortiqchaligi (Γ)</div>
                  <div className="text-2xl font-mono font-black text-emerald-400 my-1">
                    {gibbsNatija.gammaMkmol.toFixed(2)} <span className="text-xs text-slate-400 font-normal">µmol/m²</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Γ = −(C/RT)·(dσ/dC)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Bitta molekula maydoni (s₀)</div>
                  <div className="text-2xl font-mono font-black text-cyan-400 my-1">
                    {gibbsNatija.s0.toFixed(2)} <span className="text-xs text-slate-400 font-normal">nm²</span>
                  </div>
                  <div className="text-[10px] text-slate-400">s₀ = 1 / (Γ_∞ · N_A)</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 5: KELVIN KAPILLYAR KONDENSATSIYA SIMULYATORI ─── */}
          {faolModul.id === "kelvin-kapillyar" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-purple-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setKelvinR(2.0); setKelvinT(298); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-purple-300 hover:text-white transition"
                >
                  1. Kichik mezog&apos;ovak (r = 2 nm, p/p₀ ≈ 0.35)
                </button>
                <button
                  onClick={() => { setKelvinR(8.0); setKelvinT(298); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 hover:text-white transition"
                >
                  2. O&apos;rta mezog&apos;ovak (r = 8 nm, p/p₀ ≈ 0.77)
                </button>
                <button
                  onClick={() => { setKelvinR(20.0); setKelvinT(298); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 hover:text-white transition"
                >
                  3. Makrog&apos;ovakka yaqin (r = 20 nm, p/p₀ ≈ 0.90)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="kelvin-kapillyar"
                konsentratsiya={kelvinNatija.pNisbiy}
                harorat={kelvinT}
                qoplanishUlishi={kelvinNatija.pNisbiy}
                nom="Kelvin Kapillyar Kinetikasi"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Mezog&apos;ovak radiusi (r):</span>
                    <span className="font-mono text-purple-400">{kelvinR} nm</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="20.0"
                    step="0.5"
                    value={kelvinR}
                    onChange={(e) => setKelvinR(Number(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>1.5 nm (Kichik g&apos;ovak)</span>
                    <span>20 nm (Katta g&apos;ovak)</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Harorat (T):</span>
                    <span className="font-mono text-cyan-400">{kelvinT} K ({kelvinT - 273} °C)</span>
                  </div>
                  <input
                    type="range"
                    min="273"
                    max="353"
                    step="5"
                    value={kelvinT}
                    onChange={(e) => setKelvinT(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <KelvinGisterezisGrafik
                rNm={kelvinR}
                harorat={kelvinT}
                pNisbiy={kelvinNatija.pNisbiy}
              />

              {/* 2D NANOG'OVAK KAPILLYAR MENISKI VA KONDENSATSIYA ANIMATSIYASI */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
                    <span>2D Nanog&apos;ovak Kapillyar Meniski (Kelvin Botiq Sirti):</span>
                  </span>
                  <span className="font-mono text-purple-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Kondensatsiya bosimi: p/p₀ = {kelvinNatija.pNisbiy.toFixed(3)}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                    <defs>
                      <linearGradient id="kelvin-devor-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4c1d95" />
                        <stop offset="100%" stopColor="#1e1b4b" />
                      </linearGradient>
                      <linearGradient id="kelvin-suv-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" />
                        <stop offset="100%" stopColor="#312e81" />
                      </linearGradient>
                    </defs>

                    {/* Kapillyar devorlari (chap va o'ng) */}
                    <rect x="180" y="10" width="30" height="100" rx="4" fill="url(#kelvin-devor-grad)" stroke="#6d28d9" strokeWidth="1.5" />
                    <rect x="390" y="10" width="30" height="100" rx="4" fill="url(#kelvin-devor-grad)" stroke="#6d28d9" strokeWidth="1.5" />

                    <text x="195" y="65" textAnchor="middle" fill="#c4b5fd" fontSize="9" transform="rotate(-90 195,65)" fontWeight="bold">
                      G&apos;OVAK DEVORI
                    </text>
                    <text x="405" y="65" textAnchor="middle" fill="#c4b5fd" fontSize="9" transform="rotate(90 405,65)" fontWeight="bold">
                      G&apos;OVAK DEVORI
                    </text>

                    {/* Kapillyar ichidagi suyuqlik ustuni */}
                    <rect x="210" y="65" width="180" height="45" fill="url(#kelvin-suv-grad)" stroke="#818cf8" strokeWidth="1" />

                    {/* Botiq menisk (Laplas egriligi) */}
                    {/* Radiusi r ga qarab botiqlik chuqurlashadi */}
                    <path
                      d={`M 210,65 Q 300,${65 + Math.min(30, 60 / Math.max(1.5, kelvinR))} 390,65`}
                      fill="url(#kelvin-suv-grad)"
                      stroke="#a5b4fc"
                      strokeWidth="2.5"
                    />

                    {/* Bug' molekulalari botiq menisk ustida */}
                    <circle cx="260" cy="35" r="4" fill="#a5b4fc" opacity="0.8" />
                    <circle cx="340" cy="28" r="4" fill="#a5b4fc" opacity="0.8" />
                    <circle cx="300" cy="45" r="3.5" fill="#c4b5fd" opacity="0.9" />

                    {/* Radiusi o'lchov strelkasi */}
                    <line x1="215" y1="20" x2="385" y2="20" stroke="#f472b6" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <text x="300" y="16" textAnchor="middle" fill="#f472b6" fontSize="10" fontMono="true" fontWeight="bold">
                      2r = {(kelvinR * 2).toFixed(1)} nm
                    </text>
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🟣 Botiq menisk ustida to&apos;yingan bug&apos; bosimi past bo&apos;ladi (p &lt; p₀)</span>
                  <span>📉 Radiusi (r) qanchalik kichik bo&apos;lsa, kondensatsiya shunchalik erta boshlanadi</span>
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 6: ADSORBSIYA TERMODINAMIKASI SIMULYATORI ─── */}
          {faolModul.id === "termodinamika-izosterik" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-rose-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setTermoT1(273); setTermoT2(298); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition"
                >
                  1. Standart oraliq (0°C va 25°C, ΔT=25K)
                </button>
                <button
                  onClick={() => { setTermoT1(293); setTermoT2(333); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-300 hover:text-white transition"
                >
                  2. Katta harorat farqi (ΔT=40K)
                </button>
                <button
                  onClick={() => { setTermoT1(260); setTermoT2(275); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 hover:text-white transition"
                >
                  3. Past haroratli adsorbsiya (T₁ = −13°C)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="termodinamika-izosterik"
                konsentratsiya={0.06}
                harorat={(termoT1 + termoT2) / 2}
                qoplanishUlishi={0.5}
                nom="Adsorbsiya Termodinamik Kinetikasi"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
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

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
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

              <TermodinamikaIzosterikGrafik
                t1={termoT1}
                t2={termoT2}
                qst={termoNatija.qst}
                p1={termoNatija.p1}
                p2={termoNatija.p2}
              />

              {/* 2D KALORIMETRIYA VA TERMAL RADIATSIYA ANIMATSIYASI */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>2D Dinamik Kalorimetr Ampulasi (Adsorbsiya Issiqligi Ajralishi):</span>
                  </span>
                  <span className="font-mono text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Ajralgan issiqlik: q_st = {termoNatija.qst.toFixed(1)} kJ/mol
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                    <defs>
                      <linearGradient id="termo-kolba" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1e293b" />
                      </linearGradient>
                      <filter id="glow-heat" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Kalorimetr ampulasi (shisha idish) */}
                    <rect x="230" y="10" width="140" height="100" rx="16" fill="url(#termo-kolba)" stroke="#f59e0b" strokeWidth="2" />
                    <text x="300" y="26" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontWeight="bold">
                      KALORIMETR AMPULASI
                    </text>

                    {/* Adsorbent qatlami (idish tubida) */}
                    <rect x="240" y="70" width="120" height="30" rx="8" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                    <text x="300" y="88" textAnchor="middle" fill="#f8fafc" fontSize="9" fontWeight="bold">
                      ADSORBENT QATLAMI
                    </text>

                    {/* Ajralayotgan issiqlik to'lqinlari (Q_ads) */}
                    <g filter="url(#glow-heat)">
                      <path d="M 270,62 Q 260,45 270,35" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 300,62 Q 290,45 300,35" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 330,62 Q 320,45 330,35" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                    <text x="300" y="52" textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="black">
                      +Q (q_st = {termoNatija.qst.toFixed(1)} kJ)
                    </text>

                    {/* T1 va T2 ko'rsatkichlari */}
                    <rect x="50" y="25" width="120" height="70" rx="10" fill="#0f172a" stroke="#0ea5e9" strokeWidth="1.5" />
                    <text x="110" y="45" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                      1-Izoterma (T₁)
                    </text>
                    <text x="110" y="65" textAnchor="middle" fill="#ffffff" fontSize="13" fontMono="true" fontWeight="black">
                      {termoT1} K ({termoT1 - 273}°C)
                    </text>
                    <text x="110" y="82" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      p₁ = {termoNatija.p1.toFixed(1)} Pa
                    </text>

                    <rect x="430" y="25" width="120" height="70" rx="10" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                    <text x="490" y="45" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="bold">
                      2-Izoterma (T₂)
                    </text>
                    <text x="490" y="65" textAnchor="middle" fill="#ffffff" fontSize="13" fontMono="true" fontWeight="black">
                      {termoT2} K ({termoT2 - 273}°C)
                    </text>
                    <text x="490" y="82" textAnchor="middle" fill="#94a3b8" fontSize="9">
                      p₂ = {termoNatija.p2.toFixed(1)} Pa
                    </text>
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>🔥 Ekzotermik jarayon: gaz bog&apos;langanda q_st issiqlik ajraladi (ΔH = −q_st)</span>
                  <span>📈 Klapeiron-Klauzius: Harorat T₁ dan T₂ ga ko&apos;tarilganda bosim p₁ dan p₂ ga ortadi</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Izosterik Issiqlik (q_st)</div>
                  <div className="text-xl font-mono font-black text-amber-400 my-1">
                    {termoNatija.qst.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                  </div>
                  <div className="text-[10px] text-emerald-400">Har doim &gt; 0</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Entalpiya (ΔH)</div>
                  <div className="text-xl font-mono font-black text-rose-400 my-1">
                    {termoNatija.deltaH.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Ekzotermik (ΔH &lt; 0)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Erkin energiya (ΔG)</div>
                  <div className="text-xl font-mono font-black text-purple-400 my-1">
                    {termoNatija.deltaG.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kJ/mol</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Spontan (ΔG &lt; 0)</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Entropiya (ΔS)</div>
                  <div className="text-xl font-mono font-black text-sky-400 my-1">
                    {termoNatija.deltaS.toFixed(1)} <span className="text-xs text-slate-400 font-normal">J/(mol·K)</span>
                  </div>
                  <div className="text-[10px] text-slate-400">Gaz bog&apos;lanadi (ΔS &lt; 0)</div>
                </div>
              </div>
            </div>
          )}

          {/* ─── MODUL 7: DYUKLO-TRAUBE STALAGMOMETR SIMULYATORI ─── */}
          {faolModul.id === "dyuklo-traube-qoidasi" && (
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
              {/* USTOZ TEZKOR SSENARIYLARI */}
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold flex items-center gap-1.5 mr-1">
                  <Ikon nom="chaqmoq" olcham={13} className="text-amber-400" />
                  <span>Ustoz Ssenariylari:</span>
                </span>
                <button
                  onClick={() => { setTraubeKislotaIdx(0); setTraubeC(0.02); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-400 text-slate-300 hover:text-white transition"
                >
                  1. Chumoli kislota (n=1, Kuchsiz faollik 1.0x)
                </button>
                <button
                  onClick={() => { setTraubeKislotaIdx(2); setTraubeC(0.04); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 hover:text-white transition"
                >
                  2. Propion kislota (n=3, O&apos;rta faollik 10.2x)
                </button>
                <button
                  onClick={() => { setTraubeKislotaIdx(4); setTraubeC(0.06); }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 hover:text-white transition"
                >
                  3. Valerian kislota (n=5, Juda yuqori faollik 105x)
                </button>
              </div>

              {/* 60 FPS HTML5 CANVAS MOLEKULYAR KINETIKA */}
              <MolekulyarKinetikaCanvas
                modulId="dyuklo-traube-qoidasi"
                konsentratsiya={traubeC}
                harorat={298}
                qoplanishUlishi={Math.min(1, traubeNatija.faollik / 2000)}
                nom="Dyuklo-Traube Kinetikasi"
              />

              <div className="flex flex-wrap gap-2">
                {TRAUBE_KISLOTALAR.map((k, idx) => (
                  <button
                    key={k.formula}
                    onClick={() => setTraubeKislotaIdx(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                      traubeKislotaIdx === idx
                        ? "bg-amber-600 border-amber-400 text-white shadow-lg"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{k.nom.split(" ")[0]}</span>
                    <span className="font-mono text-[10px] ml-1.5 opacity-80">(n={k.n})</span>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Konsentratsiya (C):</span>
                  <span className="font-mono text-emerald-400">{traubeC} mol/L</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.100"
                  step="0.005"
                  value={traubeC}
                  onChange={(e) => setTraubeC(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <TraubeIzotermaGrafik
                faolKislotaIdx={traubeKislotaIdx}
                cVal={traubeC}
                tomchilarSoni={traubeTomchilarSoni}
                avtoTomizish={traubeAvtoTomizish}
                onTomizishToggle={() => setTraubeAvtoTomizish(!traubeAvtoTomizish)}
              />

              {/* 2D STALAGMOMETR VA TRAUBE KOEFFITSIYENTI ZANJIRI */}
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-300 gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>2D Stalagmometr Tomchilari va Gomologik Qator (β ≈ 3.2×):</span>
                  </span>
                  <span className="font-mono text-amber-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                    Sirt faolligi: G₀ = {traubeNatija.faollik} ({traubeNatija.kislota.beta})
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <svg className="w-full h-32" viewBox="0 0 600 120">
                    <defs>
                      <linearGradient id="shisha-grad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#cbd5e1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                    </defs>

                    {/* Stalagmometr kapillyar naychasi */}
                    <rect x="75" y="5" width="20" height="50" fill="url(#shisha-grad)" stroke="#94a3b8" strokeWidth="1" />
                    <rect x="78" y="5" width="14" height="48" fill="#38bdf8" opacity="0.6" />
                    <path d="M 75,55 L 83,75 L 87,75 L 95,55 Z" fill="url(#shisha-grad)" stroke="#94a3b8" strokeWidth="1" />

                    {/* Kapillyar uchidagi tomchi */}
                    {/* Sirt taranglik qanchalik katta bo'lsa tomchi shunchalik yirik */}
                    <ellipse
                      cx="85"
                      cy="86"
                      rx={Math.max(4, (traubeNatija.sigma / 72.8) * 9)}
                      ry={Math.max(6, (traubeNatija.sigma / 72.8) * 12)}
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      opacity="0.9"
                    />

                    {/* Pastga tushayotgan tomchi */}
                    <circle cx="85" cy="110" r="3.5" fill="#38bdf8" opacity="0.7" />

                    {/* Tomchilar hisoblagichi stakani */}
                    <text x="140" y="45" fill="#e2e8f0" fontSize="12" fontWeight="bold">
                      Stalagmometr Tomizgichi
                    </text>
                    <text x="140" y="65" fill="#94a3b8" fontSize="10">
                      Sirt taranglik: <tspan fill="#fb7185" fontWeight="bold">{traubeNatija.sigma.toFixed(1)} mN/m</tspan>
                    </text>
                    <text x="140" y="85" fill="#94a3b8" fontSize="10">
                      Uchish chastotasi: <tspan fill="#34d399" fontWeight="bold">{(72.8 / traubeNatija.sigma).toFixed(1)}x tezroq</tspan>
                    </text>

                    {/* 5 ta kislota zanjiri (Traube zinapoyasi) */}
                    <g transform="translate(320, 15)">
                      <rect x="0" y="0" width="260" height="90" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                      <text x="130" y="18" textAnchor="middle" fill="#fde68a" fontSize="10" fontWeight="bold">
                        GOMOLOGIK ZANJIRDA FAOLIKNING 3.2x ORTISHI
                      </text>

                      {TRAUBE_KISLOTALAR.map((k, i) => {
                        const faol = traubeKislotaIdx === i;
                        const y = 34 + i * 11;
                        return (
                          <g key={k.formula}>
                            <text x="12" y={y} fill={faol ? "#ffffff" : "#94a3b8"} fontSize="9" fontWeight={faol ? "bold" : "normal"}>
                              {k.formula} (n={k.n})
                            </text>
                            <rect
                              x="95"
                              y={y - 7}
                              width={Math.min(100, Math.pow(3.2, i) * 1.5)}
                              height="7"
                              rx="3"
                              fill={k.rang}
                              opacity={faol ? 1 : 0.6}
                            />
                            <text x="210" y={y} fill={k.rang} fontSize="9" fontWeight="bold" fontFamily="monospace">
                              {k.beta}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400 px-1">
                  <span>💧 Sirt taranglik (σ) qancha kichik bo&apos;lsa, tomchi shuncha mayda bo&apos;lib, tomizgichdan tez-tez uziladi</span>
                  <span>📐 Traube qoidasi: Har bir qo&apos;shimcha −CH₂− guruhi sirt faolligini o&apos;rtacha 3.2 karra oshiradi</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ 5. TAJRIBA JADVALI VA REGRESSIYA REJIMI ═══ */}
      {rejim === "regressiya" && (
        <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">
                Tajriba ma&apos;lumotlari va Chiziqli Regressiya ($R^2$)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Katakchalarni tahrirlashingiz mumkin — qiyalik va doimiylar avtomatik hisoblanadi.
              </p>
            </div>
            <button
              onClick={() => namunaniTikla(faolModul.id)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Ikon nom="yangilash" olcham={13} />
              <span>Namunani tiklash</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-sans">
                  <th className="p-3">№</th>
                  <th className="p-3">{faolModul.xNomi} ({faolModul.xBirlik})</th>
                  <th className="p-3">{faolModul.yNomi} ({faolModul.yBirlik})</th>
                  <th className="p-3 text-emerald-400 font-mono">Regressiya X ({regressiyaNatijasi?.xNomi})</th>
                  <th className="p-3 text-emerald-400 font-mono">Regressiya Y ({regressiyaNatijasi?.yNomi})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(jadvalMalumotlar[faolModul.id] || faolModul.tajribaNamunasi || []).map((qator, idx) => {
                  const { xKey, yKey } = getMaydonlar(qator);
                  const xVal = qator[xKey];
                  const yVal = qator[yKey];
                  const regX = regressiyaNatijasi?.getX ? regressiyaNatijasi.getX(xVal, yVal) : null;
                  const regY = regressiyaNatijasi?.getY ? regressiyaNatijasi.getY(xVal, yVal) : null;

                  return (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3 text-slate-500 font-bold font-sans">{idx + 1}</td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="any"
                          value={xVal}
                          onChange={(e) => qatorOzgartir(faolModul.id, idx, xKey, e.target.value)}
                          className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          step="any"
                          value={yVal}
                          onChange={(e) => qatorOzgartir(faolModul.id, idx, yKey, e.target.value)}
                          className="w-24 px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:border-emerald-500"
                        />
                      </td>
                      <td className="p-3 text-slate-300 font-semibold">{regX != null ? regX.toFixed(3) : "—"}</td>
                      <td className="p-3 text-emerald-400 font-bold">{regY != null ? regY.toFixed(3) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {regressiyaNatijasi && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-bold">Determinatsiya koeffitsiyenti:</span>
                  <span className="text-sm font-mono font-black text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40">
                    R² = {regressiyaNatijasi.r2.toFixed(4)} ({regressiyaNatijasi.r2 >= 0.95 ? "A'lo chiziqlilik" : "Qoniqarli"})
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300">
                  y = {regressiyaNatijasi.qiyalik.toFixed(4)} · x + {regressiyaNatijasi.kesim.toFixed(4)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {regressiyaNatijasi.doimiylar.map((d, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{d.nom}</div>
                    <div className="text-lg font-mono font-black text-emerald-400 my-1">
                      {typeof d.qiymat === "number" ? d.qiymat.toFixed(3) : d.qiymat} <span className="text-xs text-slate-400 font-normal">{d.birlik}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{d.izoh}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
