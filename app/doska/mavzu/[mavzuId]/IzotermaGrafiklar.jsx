// app/doska/mavzu/[mavzuId]/IzotermaGrafiklar.jsx
//
// Smart Doska — Interaktiv Izotermalar va Model Solishtirish Grafiklari (SVG).
// Haqiqiy laboratoriya namunalari (BAU-A, KSKG, NaX, tuproq gumusi),
// real vaqtda harakatlanuvchi operatsion nuqta (C, a) va IUPAC zonalari.
"use client";

import React from "react";

/** Haqiqiy laboratoriya tizimlari (Adsorbent + Adsorbat) */
export const LENGMYUR_PRESETLARI = [
  {
    id: "bau-benzol",
    nom: "Faol ko'mir (BAU-A) + Benzol",
    am: 3.8, // mmol/g
    K: 48, // L/mol
    C: 0.05,
    tavsif: "Gaz niqoblari va xonadagi organik bug'larni tozalashda ishlatiladi",
  },
  {
    id: "kskg-suv",
    nom: "Silikagel (KSKG) + Suv bug'i",
    am: 5.6,
    K: 26,
    C: 0.08,
    tavsif: "Sanoat quritgichi: g'ovakli qutbli sirtga ega gidrofil adsorbent",
  },
  {
    id: "nax-co2",
    nom: "Tseolit (NaX) + CO₂ gazi",
    am: 4.5,
    K: 75,
    C: 0.03,
    tavsif: "Molekulyar elak: kuchli kation markazlari CO₂ ni tez tutadi",
  },
  {
    id: "bentonit-metilen",
    nom: "Bentonit gil + Metilen ko'ki",
    am: 2.2,
    K: 18,
    C: 0.12,
    tavsif: "To'qimachilik oqova suvlarini bo'yoqdan tozalash (montmorillonit)",
  },
];

export const FREYNDLIX_PRESETLARI = [
  {
    id: "tuproq-fosfat",
    nom: "Qora tuproq gumusi + Fosfatlar",
    Kf: 2.4,
    nInv: 0.42, // 1/n
    C: 0.04,
    tavsif: "Qishloq xo'jaligida o'g'it ionlarining tuproq donalariga fiksatsiyasi",
  },
  {
    id: "loyqa-pb",
    nom: "Faollashgan loyqa + Pb²⁺ og'ir metall",
    Kf: 3.8,
    nInv: 0.32,
    C: 0.06,
    tavsif: "Sanoat oqova suvlaridan zaharli qo'rg'oshin ionlarini biologik tozalash",
  },
  {
    id: "torf-fenol",
    nom: "Torf qatlami + Fenol birikmalari",
    Kf: 1.9,
    nInv: 0.58,
    C: 0.09,
    tavsif: "Tabiiy biosorbent filtrlari: aromatik halqalarni poliaralash yutishi",
  },
  {
    id: "qum-pestitsid",
    nom: "Daryo tubi loyqasi + Pestitsidlar",
    Kf: 1.1,
    nInv: 0.75,
    C: 0.11,
    tavsif: "Geterogen daryo yotqiziqlarida zaharli agrokimyoviy moddalar migratsiyasi",
  },
];

/** 1. LENGMYUR JONLI SVG IZOTERMASI VA FREYNDLIX OVERLAY */
export function LengmyurIzotermaGrafik({
  am = 3.8,
  K = 48,
  joriyC = 0.05,
  joriyA = 2.68,
  theta = 0.7,
  taqqosla = false,
  nInv = 0.5,
}) {
  const maxC = 0.25;
  const maxA = Math.max(0.1, am * 1.18);
  const toX = (c) => 55 + (Math.max(0, Math.min(maxC, c)) / maxC) * 440;
  const toY = (a) => 180 - (Math.max(0, Math.min(maxA, a)) / maxA) * 150;

  // Lengmyur egri chizig'i (40 qadam)
  const qadamlar = 40;
  const nuqtalar = [];
  for (let i = 0; i <= qadamlar; i++) {
    const cVal = (i / qadamlar) * maxC;
    const aVal = (am * K * cVal) / (1 + K * cVal);
    nuqtalar.push(`${toX(cVal).toFixed(1)},${toY(aVal).toFixed(1)}`);
  }
  const dPath = `M ${nuqtalar.join(" L ")}`;

  // Freyndlix solishtirish egrisi (agar taqqoslash yoqilgan bo'lsa)
  let freyPath = "";
  if (taqqosla) {
    const freyNuqtalar = [];
    // Taqqoslash uchun C=0.08 nuqtada mos keladigan shartli Kf
    const kfEff = am / Math.pow(0.14, nInv || 0.45);
    for (let i = 0; i <= qadamlar; i++) {
      const cVal = (i / qadamlar) * maxC;
      const aVal = kfEff * Math.pow(Math.max(0.0005, cVal), nInv || 0.45);
      freyNuqtalar.push(`${toX(cVal).toFixed(1)},${toY(aVal).toFixed(1)}`);
    }
    freyPath = `M ${freyNuqtalar.join(" L ")}`;
  }

  const joriyX = toX(joriyC);
  const joriyY = toY(joriyA);
  const platoY = toY(am);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            Jonli Lengmyur Izotermasi: a(C) = (a_m · K · C) / (1 + K · C)
          </h5>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Joriy nuqta:</span>
          <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
            C = {joriyC} M, a = {joriyA.toFixed(2)} mmol/g (θ = {(theta * 100).toFixed(0)}%)
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          <defs>
            <linearGradient id="genriGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="platoGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.22" />
            </linearGradient>
          </defs>

          {/* Fon zonalari */}
          <rect x={toX(0)} y="30" width={toX(0.035) - toX(0)} height="150" fill="url(#genriGrad)" />
          <text x={toX(0.005)} y="46" fill="#38bdf8" fontSize="9" fontWeight="bold">
            Genri sohasi (Chiziqli)
          </text>

          <rect x={toX(0.16)} y="30" width={toX(maxC) - toX(0.16)} height="150" fill="url(#platoGrad)" />
          <text x={toX(0.17)} y="46" fill="#34d399" fontSize="9" fontWeight="bold">
            To&apos;yinish platosi (Monosoy to&apos;ldi)
          </text>

          {/* O'q to'rlari (Grid) */}
          {[0.05, 0.10, 0.15, 0.20, 0.25].map((c) => (
            <g key={c}>
              <line x1={toX(c)} y1="30" x2={toX(c)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(c)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {c}
              </text>
            </g>
          ))}
          {[0.25, 0.5, 0.75, 1.0].map((fr) => {
            const val = am * fr;
            return (
              <g key={fr}>
                <line x1="55" y1={toY(val)} x2="495" y2={toY(val)} stroke="#1e293b" strokeDasharray="3 3" />
                <text x="48" y={toY(val) + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            C (mol/L) →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ a (mmol/g)
          </text>

          {/* Gorizontal Plato chizig'i */}
          <line x1="55" y1={platoY} x2="495" y2={platoY} stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 4" />
          <text x="490" y={platoY - 5} fill="#10b981" fontSize="9" textAnchor="end" fontWeight="bold">
            To&apos;yinish platosi a_m = {am} mmol/g
          </text>

          {/* Freyndlix solishtirish egrisi (agar tanlangan bo'lsa) */}
          {taqqosla && (
            <>
              <path d={freyPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 3" />
              <text x="360" y={toY(am * 0.75) - 6} fill="#f59e0b" fontSize="9" fontWeight="bold">
                Freyndlix: a = K_F · C^(1/n) (Platoga ega emas)
              </text>
            </>
          )}

          {/* Asosiy Lengmyur egri chizig'i */}
          <path d={dPath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

          {/* Joriy nuqta */}
          <circle cx={joriyX} cy={joriyY} r="7" fill="#10b981" opacity="0.3" className="animate-ping" />
          <circle cx={joriyX} cy={joriyY} r="5" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 Genri sohasida ($K C \ll 1$) adsorbsiya chiziqli o&apos;sadi; yuqori konsentratsiyada ($K C \gg 1$) platoga chiqadi.</span>
        <span className="font-mono text-emerald-400 font-bold">1/a = 1/a_m + 1/(a_m·K·C)</span>
      </div>
    </div>
  );
}

/** 2. FREYNDLIX JONLI SVG IZOTERMASI VA LENGMYUR OVERLAY */
export function FreyndlixIzotermaGrafik({
  kf = 2.4,
  nInv = 0.42,
  joriyC = 0.05,
  joriyA = 0.68,
  taqqosla = false,
}) {
  const maxC = 0.15;
  const maxA = Math.max(0.1, kf * Math.pow(maxC, nInv) * 1.25);
  const toX = (c) => 55 + (Math.max(0, Math.min(maxC, c)) / maxC) * 440;
  const toY = (a) => 180 - (Math.max(0, Math.min(maxA, a)) / maxA) * 150;

  const qadamlar = 40;
  const nuqtalar = [];
  for (let i = 0; i <= qadamlar; i++) {
    const cVal = (i / qadamlar) * maxC;
    const aVal = kf * Math.pow(Math.max(0.0001, cVal), nInv);
    nuqtalar.push(`${toX(cVal).toFixed(1)},${toY(aVal).toFixed(1)}`);
  }
  const dPath = `M ${nuqtalar.join(" L ")}`;

  let lengPath = "";
  if (taqqosla) {
    const lengNuqtalar = [];
    const amEff = kf * Math.pow(0.08, nInv) * 1.25;
    const kEff = 45;
    for (let i = 0; i <= qadamlar; i++) {
      const cVal = (i / qadamlar) * maxC;
      const aVal = (amEff * kEff * cVal) / (1 + kEff * cVal);
      lengNuqtalar.push(`${toX(cVal).toFixed(1)},${toY(aVal).toFixed(1)}`);
    }
    lengPath = `M ${lengNuqtalar.join(" L ")}`;
  }

  const joriyX = toX(joriyC);
  const joriyY = toY(joriyA);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            Jonli Freyndlix Izotermasi: a = K_F · C^(1/n) (Nobirjinsli sirt)
          </h5>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Joriy nuqta:</span>
          <span className="text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
            C = {joriyC} M, a = {joriyA.toFixed(2)} mmol/g (1/n = {nInv})
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          {/* O'q to'rlari */}
          {[0.03, 0.06, 0.09, 0.12, 0.15].map((c) => (
            <g key={c}>
              <line x1={toX(c)} y1="30" x2={toX(c)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(c)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {c}
              </text>
            </g>
          ))}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            C (mol/L) →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ a (mmol/g)
          </text>

          {/* Lengmyur solishtirish chizig'i */}
          {taqqosla && (
            <>
              <path d={lengPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="5 3" />
              <text x="350" y={toY(maxA * 0.45)} fill="#10b981" fontSize="9" fontWeight="bold">
                Lengmyur: Platoga ega
              </text>
            </>
          )}

          {/* Asosiy Freyndlix egri chizig'i */}
          <path d={dPath} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />

          {/* Joriy nuqta */}
          <circle cx={joriyX} cy={joriyY} r="7" fill="#f59e0b" opacity="0.3" className="animate-ping" />
          <circle cx={joriyX} cy={joriyY} r="5" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 1/n &lt; 1 bo&apos;lganda qabariq profil: avval chuqur faol markazlar, so&apos;ng sayoz markazlar to&apos;ladi.</span>
        <span className="font-mono text-amber-400 font-bold">ln a = ln K_F + (1/n) · ln C</span>
      </div>
    </div>
  );
}

/** 3. BET KO'P QATLAMLI JONLI SVG IZOTERMASI (IUPAC II TUR & ISO 9277) */
export function BetIzotermaGrafik({ betPnisbiy = 0.18, betCParam = 120, betTheta = 1.45 }) {
  const toX = (x) => 55 + (Math.max(0, Math.min(0.95, x)) / 0.95) * 440;
  const toY = (th) => 180 - (Math.max(0, Math.min(6, th)) / 6) * 150;

  const nuqtalar = [];
  const qadamlar = 50;
  for (let i = 1; i <= qadamlar; i++) {
    const xVal = (i / qadamlar) * 0.92;
    const thVal = (betCParam * xVal) / ((1 - xVal) * (1 + (betCParam - 1) * xVal));
    nuqtalar.push(`${toX(xVal).toFixed(1)},${toY(thVal).toFixed(1)}`);
  }
  const dPath = `M ${nuqtalar.join(" L ")}`;

  const joriyX = toX(betPnisbiy);
  const joriyY = toY(betTheta);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            IUPAC II Tur S-simon Izoterma & ISO 9277 O&apos;lchov Zonasi
          </h5>
        </div>
        <div className="font-mono text-[11px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
          p/p₀ = {betPnisbiy}, θ = {betTheta.toFixed(2)} qatlam
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          <defs>
            <linearGradient id="isoGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* ISO 9277 Chiziqli o'lchov darchasi (0.05 <= p/p0 <= 0.35) */}
          <rect
            x={toX(0.05)}
            y="30"
            width={toX(0.35) - toX(0.05)}
            height="150"
            fill="url(#isoGrad)"
            stroke="#10b981"
            strokeDasharray="3 3"
          />
          <text x={toX(0.20)} y="45" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle">
            ✓ ISO 9277 Standart O&apos;lchov Zonasi (0.05 ≤ p/p₀ ≤ 0.35)
          </text>

          {/* O'q to'rlari */}
          {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((p) => (
            <g key={p}>
              <line x1={toX(p)} y1="30" x2={toX(p)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(p)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {p}
              </text>
            </g>
          ))}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            p / p₀ →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ θ = a / a_m
          </text>

          {/* B Nuqtasi (Monoqavat to'lgan burilish tirsagi) */}
          <circle cx={toX(0.12)} cy={toY(1.0)} r="4" fill="#38bdf8" />
          <text x={toX(0.12) + 8} y={toY(1.0) + 3} fill="#38bdf8" fontSize="9" fontWeight="bold">
            B nuqta (Monoqavat θ=1 to&apos;ldi)
          </text>

          {/* S-simon BET Izotermasi */}
          <path d={dPath} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />

          {/* Joriy nuqta */}
          <circle cx={joriyX} cy={joriyY} r="7" fill="#06b6d4" opacity="0.3" className="animate-ping" />
          <circle cx={joriyX} cy={joriyY} r="5" fill="#22d3ee" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 B nuqtadan keyin adsorbat molekulalari bir-biri ustiga minib, ko&apos;p qatlamli fizik kondensatsiyani boshlaydi.</span>
        <span className="font-mono text-cyan-400 font-bold">S_BET = a_m · N_A · σ_N2</span>
      </div>
    </div>
  );
}

/** 4. KELVIN KAPILLYAR KONDENSATSIYA JONLI SVG GISTEREZIS SIRTMOG'I (IUPAC IV TUR) */
export function KelvinGisterezisGrafik({ r = 4, pNisbiy = 0.58, govakTuri = "silindr" }) {
  const toX = (p) => 55 + (Math.max(0, Math.min(1.0, p)) / 1.0) * 440;
  const toY = (v) => 180 - (Math.max(0, Math.min(100, v)) / 100) * 150;

  // Desorbsiya (yuqori egrisi) va Adsorbsiya (pastki egrisi)
  const adsD = `M ${toX(0.05)},${toY(10)} Q ${toX(0.4)},${toY(25)} ${toX(0.65)},${toY(50)} T ${toX(0.85)},${toY(90)} L ${toX(0.95)},${toY(96)}`;
  const desD = `M ${toX(0.95)},${toY(96)} L ${toX(0.85)},${toY(90)} Q ${toX(0.55)},${toY(75)} ${toX(0.42)},${toY(30)} L ${toX(0.05)},${toY(10)}`;

  const joriyX = toX(pNisbiy);
  const joriyY = toY(Math.min(92, Math.max(20, (1 - pNisbiy) * 90 + 20)));

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            IUPAC IV Tur: Kapillyar Kondensatsiya & Gisterezis Sirtmog&apos;i
          </h5>
        </div>
        <div className="font-mono text-[11px] text-sky-400 font-bold bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
          r = {r} nm, p/p₀ = {pNisbiy.toFixed(3)} ({govakTuri})
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          <defs>
            <linearGradient id="gistGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.32" />
            </linearGradient>
          </defs>

          {/* Gisterezis sohasi */}
          <path
            d={`M ${toX(0.42)},${toY(30)} Q ${toX(0.55)},${toY(75)} ${toX(0.85)},${toY(90)} L ${toX(0.85)},${toY(90)} Q ${toX(0.65)},${toY(50)} ${toX(0.42)},${toY(30)} Z`}
            fill="url(#gistGrad)"
          />

          {/* O'q to'rlari */}
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((p) => (
            <g key={p}>
              <line x1={toX(p)} y1="30" x2={toX(p)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(p)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {p}
              </text>
            </g>
          ))}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            p / p₀ →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ Adsorbsiyalangan hajm V
          </text>

          {/* Desorbsiya va Adsorbsiya shoxlari */}
          <path d={desD} fill="none" stroke="#f43f5e" strokeWidth="2.5" />
          <text x={toX(0.55)} y={toY(78) - 6} fill="#fb7185" fontSize="9" fontWeight="bold">
            ← Desorbsiya (Botiq menisk)
          </text>

          <path d={adsD} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          <text x={toX(0.65)} y={toY(45) + 14} fill="#38bdf8" fontSize="9" fontWeight="bold">
            Adsorbsiya (Silindr plyonka) →
          </text>

          {/* Joriy nuqta */}
          <circle cx={joriyX} cy={joriyY} r="7" fill="#38bdf8" opacity="0.3" className="animate-ping" />
          <circle cx={joriyX} cy={joriyY} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 Botiq menisk ustida to&apos;yingan bug&apos; bosimi past bo&apos;lgani sababli g&apos;ovak p/p₀ &lt; 1 da to&apos;ladi.</span>
        <span className="font-mono text-sky-400 font-bold">ln(p/p₀) = −(2·γ·V_m) / (r·R·T)</span>
      </div>
    </div>
  );
}

/** 5. ADSORBSIYA TERMODINAMIKASI: KLAPEYRON-KLAUZIUS IKKITA IZOTERMA GRAFIGI (T1 vs T2) */
export function TermodinamikaIzosterikGrafik({
  t1 = 273,
  t2 = 298,
  qst = 32.4,
  p1 = 12.4,
  p2 = 38.6,
}) {
  const maxP = 80;
  const maxA = 6.0;
  const toX = (p) => 55 + (Math.max(0, Math.min(maxP, p)) / maxP) * 440;
  const toY = (a) => 180 - (Math.max(0, Math.min(maxA, a)) / maxA) * 150;

  // T1 dagi izoterma (sovuqroq -> kuchliroq adsorbsiya, K kattaroq)
  const qadamlar = 35;
  const t1Nuqtalar = [];
  const t2Nuqtalar = [];
  const k1 = 0.18 * Math.exp(3000 / t1);
  const k2 = 0.18 * Math.exp(3000 / t2);

  for (let i = 0; i <= qadamlar; i++) {
    const pVal = (i / qadamlar) * maxP;
    const a1 = (5.5 * k1 * pVal) / (1 + k1 * pVal);
    const a2 = (5.5 * k2 * pVal) / (1 + k2 * pVal);
    t1Nuqtalar.push(`${toX(pVal).toFixed(1)},${toY(a1).toFixed(1)}`);
    t2Nuqtalar.push(`${toX(pVal).toFixed(1)},${toY(a2).toFixed(1)}`);
  }

  const dPathT1 = `M ${t1Nuqtalar.join(" L ")}`;
  const dPathT2 = `M ${t2Nuqtalar.join(" L ")}`;

  // Izosterik chiziq (a = 2.0 mmol/g darajasidagi gorizontal kesim)
  const aIzostera = 2.0;
  const yIzostera = toY(aIzostera);
  const xP1 = toX(p1);
  const xP2 = toX(p2);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            Klapeyron-Klauzius Izosterasi: q_st = R · [T₁·T₂ / (T₂−T₁)] · ln(p₂/p₁)
          </h5>
        </div>
        <div className="font-mono text-[11px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
          q_st = {qst.toFixed(1)} kJ/mol (ΔT = {t2 - t1} K)
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          {/* O'q to'rlari */}
          {[20, 40, 60, 80].map((p) => (
            <g key={p}>
              <line x1={toX(p)} y1="30" x2={toX(p)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(p)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {p}
              </text>
            </g>
          ))}
          {[1, 2, 3, 4, 5].map((a) => (
            <g key={a}>
              <line x1="55" y1={toY(a)} x2="495" y2={toY(a)} stroke="#1e293b" strokeDasharray="3 3" />
              <text x="48" y={toY(a) + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                {a}
              </text>
            </g>
          ))}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            p (kPa) →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ a (mmol/g)
          </text>

          {/* Izosterik gorizontal kesim chizig'i (a = const) */}
          <line x1={xP1} y1={yIzostera} x2={xP2} y2={yIzostera} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 2" />
          <line x1={xP1} y1={yIzostera} x2={xP1} y2="180" stroke="#0ea5e9" strokeWidth="1.2" strokeDasharray="2 2" />
          <line x1={xP2} y1={yIzostera} x2={xP2} y2="180" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="2 2" />

          {/* T1 va T2 izotermalari */}
          <path d={dPathT1} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <text x="370" y={toY(4.9)} fill="#38bdf8" fontSize="9" fontWeight="bold">
            T₁ = {t1} K (Kuchli adsorbsiya)
          </text>

          <path d={dPathT2} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
          <text x="400" y={toY(3.4)} fill="#fb7185" fontSize="9" fontWeight="bold">
            T₂ = {t2} K (Desorbsiya)
          </text>

          {/* Izostera kesimi nishonlari */}
          <circle cx={xP1} cy={yIzostera} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          <circle cx={xP2} cy={yIzostera} r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          <text x={xP1 - 4} y={yIzostera - 8} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">
            p₁ = {p1} kPa
          </text>
          <text x={xP2 + 4} y={yIzostera - 8} fill="#fb7185" fontSize="9" fontWeight="bold" textAnchor="start">
            p₂ = {p2} kPa
          </text>
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 Harorat T₁ dan T₂ ga oshirilganda Le Shatelye printsipiga binoan a = const saqlash uchun bosim p₁ dan p₂ ga ortadi.</span>
        <span className="font-mono text-amber-400 font-bold">ΔH = −q_st &lt; 0 (Ekzotermik)</span>
      </div>
    </div>
  );
}

/** 6. DYUKLO-TRAUBE QOIDASI JONLI SVG GRAFIGI (5 TA KISLOTA VA ISHCHI NUQTA) */
export const TRAUBE_KISLOTALAR = [
  { nom: "Chumoli kislota", formula: "HCOOH", n: 1, b: 12.0, d: 8, rang: "#94a3b8", beta: "1.0×" },
  { nom: "Sirka kislota", formula: "CH₃COOH", n: 2, b: 13.0, d: 25, rang: "#38bdf8", beta: "3.2×" },
  { nom: "Propion kislota", formula: "C₂H₅COOH", n: 3, b: 14.0, d: 80, rang: "#10b981", beta: "10.2×" },
  { nom: "Moy kislota", formula: "C₃H₇COOH", n: 4, b: 14.5, d: 256, rang: "#f59e0b", beta: "32.8×" },
  { nom: "Valerian kislota", formula: "C₄H₉COOH", n: 5, b: 15.0, d: 820, rang: "#ef4444", beta: "105.0×" },
];

export function TraubeIzotermaGrafik({
  kislotaIndex = 2,
  joriyC = 0.02,
  joriySigma = 47.8,
  faollik = 1120,
}) {
  const maxC = 0.08;
  const minSigma = 20;
  const maxSigma = 75;
  const toX = (c) => 55 + (Math.max(0, Math.min(maxC, c)) / maxC) * 440;
  const toY = (s) => 180 - (Math.max(0, Math.min(maxSigma - minSigma, s - minSigma)) / (maxSigma - minSigma)) * 150;

  const faolKislota = TRAUBE_KISLOTALAR[kislotaIndex] || TRAUBE_KISLOTALAR[2];
  const joriyX = toX(joriyC);
  const joriyY = toY(joriySigma);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
            Dyuklo-Traube Sirt Taranglik Grafigi: σ = σ₀ − b · ln(1 + d · C)
          </h5>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-400">Ishchi nuqta:</span>
          <span
            className="font-bold px-2 py-0.5 rounded border"
            style={{
              color: faolKislota.rang,
              backgroundColor: `${faolKislota.rang}15`,
              borderColor: `${faolKislota.rang}40`,
            }}
          >
            {faolKislota.formula}: C = {joriyC} M, σ = {joriySigma.toFixed(1)} mN/m (G₀ = {faollik})
          </span>
        </div>
      </div>

      <div className="relative w-full aspect-[2.4/1] bg-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden">
        <svg viewBox="0 0 520 220" className="w-full h-full select-none">
          {/* Sof suv gorizontal chizig'i (sigma = 72.8) */}
          <line x1="55" y1={toY(72.8)} x2="495" y2={toY(72.8)} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.6" />
          <text x="490" y={toY(72.8) - 4} fill="#38bdf8" fontSize="9" textAnchor="end" fontWeight="bold" opacity="0.8">
            Sof suv: σ₀ = 72.8 mN/m
          </text>

          {/* O'q to'rlari */}
          {[0.02, 0.04, 0.06, 0.08].map((c) => (
            <g key={c}>
              <line x1={toX(c)} y1="30" x2={toX(c)} y2="180" stroke="#1e293b" strokeDasharray="3 3" />
              <text x={toX(c)} y="196" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                {c} M
              </text>
            </g>
          ))}
          {[30, 40, 50, 60, 70].map((s) => (
            <g key={s}>
              <line x1="55" y1={toY(s)} x2="495" y2={toY(s)} stroke="#1e293b" strokeDasharray="3 3" />
              <text x="48" y={toY(s) + 3} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">
                {s}
              </text>
            </g>
          ))}

          {/* Koordinata o'qlari */}
          <line x1="55" y1="30" x2="55" y2="180" stroke="#475569" strokeWidth="1.5" />
          <line x1="55" y1="180" x2="495" y2="180" stroke="#475569" strokeWidth="1.5" />
          <text x="495" y="174" fill="#94a3b8" fontSize="10" textAnchor="end" fontWeight="bold">
            Konsentratsiya C (mol/L) →
          </text>
          <text x="60" y="24" fill="#94a3b8" fontSize="10" fontWeight="bold">
            ↑ Sirt taranglik σ (mN/m)
          </text>

          {/* 5 ta kislota egri chiziqlari */}
          {TRAUBE_KISLOTALAR.map((k, i) => {
            const pts = [];
            const steps = 30;
            for (let step = 0; step <= steps; step++) {
              const cVal = (step / steps) * maxC;
              const sVal = Math.max(minSigma, 72.8 - k.b * Math.log(1 + k.d * cVal));
              pts.push(`${toX(cVal).toFixed(1)},${toY(sVal).toFixed(1)}`);
            }
            const faol = kislotaIndex === i;
            return (
              <g key={k.formula}>
                <polyline
                  fill="none"
                  stroke={k.rang}
                  strokeWidth={faol ? "3.5" : "1.8"}
                  strokeOpacity={faol ? 1 : 0.35}
                  strokeLinecap="round"
                  points={pts.join(" ")}
                />
              </g>
            );
          })}

          {/* Ishchi nuqta proyeksiyalari */}
          <line x1={joriyX} y1={joriyY} x2={joriyX} y2="180" stroke={faolKislota.rang} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
          <line x1="55" y1={joriyY} x2={joriyX} y2={joriyY} stroke={faolKislota.rang} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />

          {/* Ishchi nuqta */}
          <circle cx={joriyX} cy={joriyY} r="7" fill={faolKislota.rang} opacity="0.3" className="animate-ping" />
          <circle cx={joriyX} cy={joriyY} r="5" fill={faolKislota.rang} stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
        <span>💡 Zanjir qancha uzun bo&apos;lsa (n=1 dan n=5 ga), sirt taranglik shuncha kichik konsentratsiyadayoq keskin pasayadi (Traube qoidasi).</span>
        <span className="font-mono text-emerald-400 font-bold">G_(n+1) / G_n = β ≈ 3.2</span>
      </div>
    </div>
  );
}
