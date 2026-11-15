'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 8-PARAGRAF
// "Izotoplar. Izobarlar" (Darslik 37-41-betlar)
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  kadrSora,
  kadrniBekorQil,
  canvasOlchami,
} from '@/lib/maktab-animatsiya';
import { tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi';
import {
  SmartDarsQobiq,
  KorgazmaRamka,
  chizFonSetka,
  chizZarracha,
  GuruhlashOyini,
  TezkorTanlovOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi';
import { InteraktivSahnaKorgazma } from '@/components/maktab/SmartKimyoSahna';

/* ═══════════════════════════════════════════════════════════════
   1-KO'RGAZMA: VODOROD IZOTOPLARI (¹₁H, ²₁H, ³₁H)
═══════════════════════════════════════════════════════════════ */
const VODOROD_IZO = [
  { id: '1H', belgi: '¹₁H', nom: 'Protiy (H)', p: 1, n: 0, e: 1, massa: 1, rang: '#38bdf8', izoh: '~99,98% • N = 0' },
  { id: '2H', belgi: '²₁H (D)', nom: 'Deyteriy (D)', p: 1, n: 1, e: 1, massa: 2, rang: '#34d399', izoh: "~0,02% • D₂O (og'ir suv)" },
  { id: '3H', belgi: '³₁H (T)', nom: 'Tritiy (T)', p: 1, n: 2, e: 1, massa: 3, rang: '#f472b6', izoh: 'Radioaktiv • 2 ta neytron' },
];

function KorgazmaVodorodIzotoplari() {
  const canvasRef = useRef(null);
  const [tanlov, setTanlov] = useState('all');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.035;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('Vodorod izotoplari: Z = 1 (bir xil), N = 0, 1, 2 (har xil) → kimyoviy xossalari bir xil', 24, 34);

      const cw = (w - 96) / 3;
      VODOROD_IZO.forEach((izo, idx) => {
        const cx = 36 + idx * (cw + 12);
        const sel = tanlov === 'all' || tanlov === izo.id;
        ctx.fillStyle = sel ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.45)';
        ctx.strokeStyle = sel ? izo.rang : '#334155';
        ctx.lineWidth = sel ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(cx, 66, cw, h - 98, 16);
        ctx.fill();
        ctx.stroke();

        const ax = cx + cw / 2;
        const ay = 146;

        ctx.strokeStyle = `${izo.rang}66`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(ax, ay, 48, 0, Math.PI * 2);
        ctx.stroke();

        // Elektron
        chizZarracha(ctx, ax + Math.cos(t + idx) * 48, ay + Math.sin(t + idx) * 48, 6, '#38bdf8', '-');

        // Yadro nuklonlari
        if (izo.n === 0) {
          chizZarracha(ctx, ax, ay, 11, '#ef4444', 'p');
        } else if (izo.n === 1) {
          chizZarracha(ctx, ax - 8, ay, 10, '#ef4444', 'p');
          chizZarracha(ctx, ax + 8, ay, 10, '#94a3b8', 'n');
        } else {
          chizZarracha(ctx, ax, ay - 8, 10, '#ef4444', 'p');
          chizZarracha(ctx, ax - 9, ay + 7, 10, '#94a3b8', 'n');
          chizZarracha(ctx, ax + 9, ay + 7, 10, '#94a3b8', 'n');
        }

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 16px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${izo.nom} — ${izo.belgi}`, ax, 222);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(`${izo.p} p⁺ • ${izo.n} n⁰ • ${izo.e} ē`, ax, 246);

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(izo.izoh, ax, 276);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlov]);

  return (
    <KorgazmaRamka
      sarlavha="1. Vodorod izotoplari: Protiy, Deyteriy, Tritiy (38–39-b)"
      qisqaFormula="¹₁H (1p, 0n) • ²₁H / D (1p, 1n) • ³₁H / T (1p, 2n)"
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setTanlov('all');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              tanlov === 'all'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Barchasini ko&apos;rish
          </button>
          {VODOROD_IZO.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => {
                setTanlov(z.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                tanlov === z.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {z.nom} ({z.belgi})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Z = 1 bir xil → kimyoviy xossalari bir xil
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            D₂O (og&apos;ir suv) M = 20 g/mol, oddiy H₂O = 18 g/mol
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Izotoplar bir-biridan neytronlar soni (N) va massasi bilan farq qiladi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: ARGON VA XLOR IZOTOPLARI (1-MASALA, 39-BET)
═══════════════════════════════════════════════════════════════ */
const AR_CL_LIST = [
  { id: '36Ar', belgi: '³⁶₁₈Ar', nom: 'Argon-36', z: 18, a: 36, n: 18, rang: '#a855f7', izoh: '1-masala: 18p, 18n, 18e.' },
  { id: '38Ar', belgi: '³⁸₁₈Ar', nom: 'Argon-38', z: 18, a: 38, n: 20, rang: '#8b5cf6', izoh: '1-masala: 18p, 20n, 18e.' },
  { id: '40Ar', belgi: '⁴⁰₁₈Ar', nom: 'Argon-40', z: 18, a: 40, n: 22, rang: '#6366f1', izoh: 'Havoda 99%; 22 ta neytron.' },
  { id: '35Cl', belgi: '³⁵₁₇Cl', nom: 'Xlor-35', z: 17, a: 35, n: 18, rang: '#2dd4bf', izoh: '~75,5% ulush; 17p, 18n.' },
  { id: '37Cl', belgi: '³⁷₁₇Cl', nom: 'Xlor-37', z: 17, a: 37, n: 20, rang: '#14b8a6', izoh: '~24,5% ulush; Ar(Cl)=35,453.' },
];

function KorgazmaArgonXlor() {
  const canvasRef = useRef(null);
  const [tanlov, setTanlov] = useState('40Ar');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = AR_CL_LIST.find((x) => x.id === tanlov) || AR_CL_LIST[2];
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.04;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('1-masala (39-b): Argon (Z=18) va Xlor (Z=17) izotoplari', 24, 34);

      const chartX = 36;
      const chartY = 68;
      const chartW = w * 0.56;
      const chartH = h - 104;
      const bazY = chartY + chartH;
      const step = chartW / AR_CL_LIST.length;

      AR_CL_LIST.forEach((item, idx) => {
        const bx = chartX + idx * step + 8;
        const bw = step - 16;
        const sel = item.id === tanlov;
        const pH = (item.z / 42) * (chartH - 36);
        const nH = (item.n / 42) * (chartH - 36);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(bx, bazY - pH, bw, pH);
        ctx.fillStyle = sel ? '#fde047' : '#94a3b8';
        ctx.fillRect(bx, bazY - pH - nH, bw, nH);

        if (sel) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(bx, bazY - pH - nH, bw, pH + nH);
        }

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.belgi, bx + bw / 2, bazY + 20);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 11px "Times New Roman", serif';
        ctx.fillText(`${item.z}p + ${item.n}n`, bx + bw / 2, bazY - pH - nH - 8);
      });

      const rx = w * 0.64;
      const rw = w * 0.33;
      const ry = 68;
      const rh = h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      chizZarracha(ctx, rx + 44, ry + 48, 22 + Math.sin(t * 2) * 1.5, faol.rang, faol.belgi);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.nom, rx + 78, ry + 44);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(`Massa soni A = ${faol.a}`, rx + 78, ry + 64);

      const qator = [
        `Protonlar (Z): ${faol.z} ta`,
        `Neytronlar (N): ${faol.a} − ${faol.z} = ${faol.n} ta`,
        `Elektronlar (ē): ${faol.z} ta`,
      ];
      qator.forEach((q, i) => {
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(q, rx + 20, ry + 108 + i * 30);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(faol.izoh, rx + 20, ry + 206);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlov]);

  return (
    <KorgazmaRamka
      sarlavha="2. Argon va Xlor izotoplari (37–39-b)"
      qisqaFormula="Kasr Ar (Cl = 35,453) — izotoplar aralashmasidan (Butlerov)"
      ikon="yadro"
      boshqaruv={
        <>
          {AR_CL_LIST.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTanlov(item.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                tanlov === item.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {item.belgi}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Qizil — protonlar soni bir xil (Ar da 18, Cl da 17)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Neytronlar farqi: ³⁶Ar (18n), ³⁸Ar (20n), ⁴⁰Ar (22n)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Butlerov kasr atom massalarni izotoplar bilan tushuntirgan
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 2-MASALA — DIAGONAL QOIDA VA BOR (Ar = 10,81)
═══════════════════════════════════════════════════════════════ */
const DIAGONAL_VARIANTLAR = [
  {
    id: 'B',
    tugma: '2-masala: Bor (10,81)',
    formula: '(10x + 11(100−x)) / 100 = 10,81 → ¹⁰B: 19%, ¹¹B: 81%',
    tur: 'hisob',
    cfg: {
      sarlavha: '2-masala (40-b): Bor izotoplari ulushi',
      tenglama: '10·x + 11·(100 − x) = 1081',
      qadamlar: [
        { belgi: '1) ¹⁰B ↔ 10,81', natija: 'Farq = 0,19', izoh: '11 − 10,81 = 0,19', rang: '#34d399' },
        { belgi: '2) ¹¹B ↔ 10,81', natija: 'Farq = 0,81', izoh: '10,81 − 10 = 0,81', rang: '#f472b6' },
        { belgi: '3) Ulushlar', natija: '19% va 81%', izoh: '¹⁰B: 19%, ¹¹B: 81%', rang: '#fde047' },
      ],
      taqqosBars: [
        { nom: '¹⁰B (19%)', foiz: 19, qiymat: '19%', rang: '#34d399' },
        { nom: '¹¹B (81%)', foiz: 81, qiymat: '81%', rang: '#f472b6' },
      ],
      javobBadge: '¹⁰B: 19% • ¹¹B: 81%',
    },
    pastki: ['¹⁰B ulushi: 19%', '¹¹B ulushi: 81%', 'Diagonal va algebraik usul bir'],
  },
  {
    id: 'Cl',
    tugma: 'Xlor (35,45)',
    formula: '³⁵Cl (~77,5%) va ³⁷Cl (~22,5%) → Ar = 35,45',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Xlor izotoplari ulushi (35,45)',
      tenglama: '35·x + 37·(100 − x) = 3545',
      qadamlar: [
        { belgi: '1) ³⁵Cl nisbat', natija: '1,55 / 2 = 77,5%', izoh: '37 − 35,45 = 1,55', rang: '#2dd4bf' },
        { belgi: '2) ³⁷Cl nisbat', natija: '0,45 / 2 = 22,5%', izoh: '35,45 − 35 = 0,45', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: '³⁵Cl', foiz: 77.5, qiymat: '77,5%', rang: '#2dd4bf' },
        { nom: '³⁷Cl', foiz: 22.5, qiymat: '22,5%', rang: '#38bdf8' },
      ],
      javobBadge: '³⁵Cl: 77,5% • ³⁷Cl: 22,5%',
    },
    pastki: ['³⁵Cl ulushi: 77,5%', '³⁷Cl ulushi: 22,5%', 'Farq: 37 − 35 = 2'],
  },
  {
    id: 'Cu',
    tugma: 'Mis (63,55)',
    formula: '⁶³Cu (72,5%) va ⁶⁵Cu (27,5%) → Ar = 63,55',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Mis izotoplari ulushi (63,55)',
      tenglama: '63·x + 65·(100 − x) = 6355',
      qadamlar: [
        { belgi: '1) ⁶³Cu nisbat', natija: '1,45 / 2 = 72,5%', izoh: '65 − 63,55 = 1,45', rang: '#fbbf24' },
        { belgi: '2) ⁶⁵Cu nisbat', natija: '0,55 / 2 = 27,5%', izoh: '63,55 − 63 = 0,55', rang: '#fb923c' },
      ],
      taqqosBars: [
        { nom: '⁶³Cu', foiz: 72.5, qiymat: '72,5%', rang: '#fbbf24' },
        { nom: '⁶⁵Cu', foiz: 27.5, qiymat: '27,5%', rang: '#fb923c' },
      ],
      javobBadge: '⁶³Cu: 72,5% • ⁶⁵Cu: 27,5%',
    },
    pastki: ['⁶³Cu ulushi: 72,5%', '⁶⁵Cu ulushi: 27,5%', 'O\'rtacha Ar = 63,55'],
  },
];

function KorgazmaDiagonalUsul() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 2-masala: Izotoplar ulushi (diagonal/algebraik, 40-b)"
      ikon="formula"
      variantlar={DIAGONAL_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: 3–4-MASHQ (K = 39,07 VA Ar = 39,974)
═══════════════════════════════════════════════════════════════ */
const ORTACHA_AR_VARIANTLAR = [
  {
    id: 'ar',
    tugma: '4-mashq: Argon (39,974)',
    formula: '0,99·40 + 0,007·38 + 0,003·36 = 39,974',
    tur: 'hisob',
    cfg: {
      sarlavha: '4-mashq (41-b): Argon o\'rtacha atom massasi',
      tenglama: 'Ar(Ar) = Σ(ωᵢ · Aᵢ) = 39,974',
      qadamlar: [
        { belgi: '⁴⁰Ar (99%)', natija: '0,99 · 40 = 39,600', izoh: 'Asosiy izotop', rang: '#a855f7' },
        { belgi: '³⁸Ar (0,7%)', natija: '0,007 · 38 = 0,266', izoh: 'Kam ulush', rang: '#38bdf8' },
        { belgi: '³⁶Ar (0,3%)', natija: '0,003 · 36 = 0,108', izoh: 'Jami = 39,974', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '⁴⁰Ar', foiz: 99, qiymat: '99%', rang: '#a855f7' },
        { nom: '³⁸Ar', foiz: 4, qiymat: '0,7%', rang: '#38bdf8' },
        { nom: '³⁶Ar', foiz: 2, qiymat: '0,3%', rang: '#34d399' },
      ],
      javobBadge: 'Ar(Ar) = 39,974',
    },
    pastki: ['99% ⁴⁰Ar + 0,7% ³⁸Ar + 0,3% ³⁶Ar', 'O\'rtacha Ar = 39,974', 'Ar(Ar) > Ar(K) sababi — ⁴⁰Ar ko\'p'],
  },
  {
    id: 'k',
    tugma: '3-mashq: Kaliy (39,07)',
    formula: '0,93·39 + 0,07·40 = 36,27 + 2,80 = 39,07',
    tur: 'hisob',
    cfg: {
      sarlavha: '3-mashq (41-b): Kaliy o\'rtacha atom massasi',
      tenglama: 'Ar(K) = 0,93·39 + 0,07·40 = 39,07',
      qadamlar: [
        { belgi: '³⁹K (93%)', natija: '0,93 · 39 = 36,27', izoh: 'Asosiy izotop', rang: '#f472b6' },
        { belgi: '⁴⁰K (7%)', natija: '0,07 · 40 = 2,80', izoh: 'Og\'irroq izotop', rang: '#fbbf24' },
        { belgi: 'Yig\'indi', natija: '39,07', izoh: '36,27 + 2,80', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '³⁹K', foiz: 93, qiymat: '93%', rang: '#f472b6' },
        { nom: '⁴⁰K', foiz: 7, qiymat: '7%', rang: '#fbbf24' },
      ],
      javobBadge: 'Ar(K) = 39,07',
    },
    pastki: ['93% ³⁹K + 7% ⁴⁰K', 'O\'rtacha Ar = 39,07', 'Z(Ar)=18 < Z(K)=19'],
  },
];

function KorgazmaOrtachaAr() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 3–4-mashqlar: K va Ar o'rtacha massasi (41-b)"
      ikon="grafik"
      variantlar={ORTACHA_AR_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: IZOBARLAR — ⁴⁰₁₈Ar VA ⁴⁰₂₀Ca (40-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaIzobarlar() {
  const canvasRef = useRef(null);
  const [aktiv, setAktiv] = useState('ikkalasi');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.035;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('Izobarlar ("teng og\'irlik"): massa soni A = 40 bir xil, yadro zaryadi Z va xossalari har xil', 24, 34);

      const cw = (w - 92) / 2;
      const cy = 68;
      const ch = h - 100;
      const juft = [
        { id: 'Ar', x: 34, belgi: '⁴⁰₁₈Ar', nom: 'Argon-40', p: 18, n: 22, e: 18, xossa: 'Inert gaz', rang: '#a855f7' },
        { id: 'Ca', x: 34 + cw + 24, belgi: '⁴⁰₂₀Ca', nom: 'Kalsiy-40', p: 20, n: 20, e: 20, xossa: 'Faol metall (CaO)', rang: '#fbbf24' },
      ];

      juft.forEach((j, jIdx) => {
        const sel = aktiv === 'ikkalasi' || aktiv === j.id;
        ctx.fillStyle = sel ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.45)';
        ctx.strokeStyle = sel ? j.rang : '#334155';
        ctx.lineWidth = sel ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(j.x, cy, cw, ch, 16);
        ctx.fill();
        ctx.stroke();

        chizZarracha(ctx, j.x + 54, cy + 56, 26 + Math.sin(t * 2 + jIdx) * 2, j.rang, j.belgi);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 17px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(j.nom, j.x + 92, cy + 48);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '13px "Times New Roman", serif';
        ctx.fillText(`A = ${j.p + j.n} (teng!)`, j.x + 92, cy + 70);

        const q = [
          `Proton (Z): ${j.p} ta (har xil)`,
          `Neytron (N): ${j.n} ta`,
          `Elektron: ${j.e} ta`,
          `Xossa: ${j.xossa}`,
        ];
        q.forEach((line, i) => {
          ctx.fillStyle = i === 0 ? '#fda4af' : '#cbd5e1';
          ctx.font = i === 0 ? 'bold 14px "Times New Roman", serif' : '13px "Times New Roman", serif';
          ctx.fillText(line, j.x + 22, cy + 114 + i * 32);
        });
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [aktiv]);

  return (
    <KorgazmaRamka
      sarlavha="5. Izobarlar: ⁴⁰₁₈Ar va ⁴⁰₂₀Ca (40-b)"
      qisqaFormula="⁴⁰Ar (18p, 22n) ↔ ⁴⁰Ca (20p, 20n) • A = 40 teng, Z har xil"
      ikon="qidiruv"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setAktiv('ikkalasi');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              aktiv === 'ikkalasi'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            ⁴⁰Ar ↔ ⁴⁰Ca taqqoslash
          </button>
          <button
            type="button"
            onClick={() => {
              setAktiv('Ar');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              aktiv === 'Ar'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            ⁴⁰₁₈Ar (inert gaz)
          </button>
          <button
            type="button"
            onClick={() => {
              setAktiv('Ca');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              aktiv === 'Ca'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            ⁴⁰₂₀Ca (faol metall)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Umumiy belgi: nuklonlar yig&apos;indisi A = 40 bir xil
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Farqi: proton soni Z = 18 (Ar) ≠ 20 (Ca)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Izobarlar turli elementlar bo&apos;lgani uchun jadvalda har xil katakda turadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: IZOTOP, IZOBAR VA IZOTONLAR MATRITSASI (40-41-BET)
═══════════════════════════════════════════════════════════════ */
const TOIFA_VARIANTLAR = [
  {
    id: 'izotop',
    tugma: 'Izotoplar (Z bir xil)',
    formula: 'Z teng, N va A har xil • ¹H, ²H, ³H • ³⁵Cl, ³⁷Cl',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: 'Izotop (Z=1): bir element, neytroni har xil',
      markaz: { belgi: '1p+n', zaryad: 'Z=1', rang: '#38bdf8', r: 24 },
      qavatlar: [1],
      metrikalar: [{ nom: 'Proton (Z)', qiymat: 'Bir xil → bitta katak', foiz: 95, rang: '#38bdf8' }],
      belgilar: [{ k: 'Misol', v: '¹H, ²H, ³H; ³⁵Cl, ³⁷Cl', rang: '#fde047' }, { k: 'Xossa', v: 'Kimyoviy xossa bir', rang: '#34d399' }],
    },
    pastki: ['Z bir xil → 1 ta katak', 'Neytronlar (N) har xil', '¹H, ²H, ³H; ³⁵Cl, ³⁷Cl'],
  },
  {
    id: 'izobar',
    tugma: 'Izobarlar (A bir xil)',
    formula: 'Massa soni A teng (40), Z har xil • ⁴⁰Ar va ⁴⁰Ca',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: 'Izobar (A=40): turli elementlar, teng massa',
      markaz: { belgi: 'A=40', zaryad: 'Z≠Z', rang: '#fbbf24', r: 24 },
      qavatlar: [2, 8, 8],
      metrikalar: [{ nom: 'Massa soni A', qiymat: 'Bir xil (40 = 40)', foiz: 90, rang: '#fbbf24' }],
      belgilar: [{ k: 'Misol', v: '⁴⁰₁₈Ar va ⁴⁰₂₀Ca', rang: '#fbbf24' }, { k: 'Xossa', v: 'Tubdan farq qiladi', rang: '#f43f5e' }],
    },
    pastki: ['Massa soni A bir xil (40)', 'Z turlicha (Ar=18, Ca=20)', 'Turli elementlar'],
  },
  {
    id: 'izoton',
    tugma: 'Izotonlar (N bir xil)',
    formula: 'Neytronlar N teng • ²⁶Mg/²⁷Al (14n) • ⁶²Cu/⁶³Zn (33n)',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: 'Izoton (N teng): neytron soni bir xil',
      markaz: { belgi: 'N=14', zaryad: 'p≠p', rang: '#34d399', r: 24 },
      qavatlar: [2, 8, 2],
      metrikalar: [{ nom: 'Neytron (N)', qiymat: 'Bir xil (14n; 33n)', foiz: 85, rang: '#34d399' }],
      belgilar: [{ k: 'N = 14', v: '²⁶₁₂Mg va ²⁷₁₃Al', rang: '#34d399' }, { k: 'N = 33', v: '⁶²₂₉Cu va ⁶³₃₀Zn', rang: '#fde047' }],
    },
    pastki: ['Neytronlar soni N bir xil', '²⁶Mg va ²⁷Al (N = 14)', '⁶²Cu va ⁶³Zn (N = 33)'],
  },
];

function KorgazmaUchToifa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Izotop, Izobar va Izotonlar (40–41-b)"
      ikon="kolba"
      variantlar={TOIFA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (7-§) VA O'YINLAR (8-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Rezerford (1911) tajribasidan qanday xulosa chiqdi?',
    variantlar: [
      { matn: "Markazda kichik, og'ir musbat yadro bor", togri: true },
      { matn: "Atom ichida bo'shliq yo'q", togri: false },
      { matn: 'Elektronlar musbat zaryadli', togri: false },
      { matn: 'Hamma α-zarralar yutiladi', togri: false },
    ],
    izoh: '~8000 tadan 1 ta α-zarra orqaga qaytgan.',
  },
  {
    id: 't2',
    savol: 'Proton, neytron, elektron zaryadlari?',
    variantlar: [
      { matn: '0, +1, −1', togri: false },
      { matn: '−1, 0, +1', togri: false },
      { matn: '+1, 0, −1', togri: true },
      { matn: '+1, +1, −1', togri: false },
    ],
    izoh: '¹₁p (+1), ¹₀n (0), ⁰₋₁e (−1).',
  },
  {
    id: 't3',
    savol: 'Qaysi yadroda neytron mavjud emas (N=0)?',
    variantlar: [
      { matn: 'Geliy (⁴₂He)', togri: false },
      { matn: 'Oddiy vodorod — protiy (¹₁H)', togri: true },
      { matn: 'Litiy (⁷₃Li)', togri: false },
      { matn: 'Uglerod (¹²₆C)', togri: false },
    ],
    izoh: '¹₁H: N = 1 − 1 = 0.',
  },
  {
    id: 't4',
    savol: '⁵⁶₂₆Fe yadrosida nechta proton va neytron bor?',
    variantlar: [
      { matn: '56p, 26n', togri: false },
      { matn: '30p, 26n', togri: false },
      { matn: '26p, 26n', togri: false },
      { matn: '26p va 30n', togri: true },
    ],
    izoh: 'Z=26, N = 56 − 26 = 30.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'izotop', nom: 'Izotoplar (Z=)', tavsif: 'Bir element, har xil A, N' },
    { id: 'izobar', nom: 'Izobarlar (A=)', tavsif: 'Turli element, teng A' },
    { id: 'izoton', nom: 'Izotonlar (N=)', tavsif: 'Turli element, teng N' },
  ],
  topshiriqlar: [
    { nom: '¹₁H, ²₁H, ³₁H', qisqa: 'Protiy, D, T', guruh: 'izotop', izoh: 'Hammasi Z=1 vodorod (N=0,1,2).' },
    { nom: '³⁶Ar, ³⁸Ar, ⁴⁰Ar', qisqa: 'Argon izotoplari', guruh: 'izotop', izoh: 'Hammasi Z=18, neytroni 18, 20, 22.' },
    { nom: '³⁵₁₇Cl va ³⁷₁₇Cl', qisqa: 'Xlor izotoplari', guruh: 'izotop', izoh: 'Ikkalasi Z=17.' },
    { nom: '⁴⁰₁₈Ar va ⁴⁰₂₀Ca', qisqa: 'A = 40', guruh: 'izobar', izoh: 'Massa soni 40, Z har xil.' },
    { nom: '⁴⁰₁₉K va ⁴⁰₂₀Ca', qisqa: 'Nuklon = 40', guruh: 'izobar', izoh: 'Teng massali har xil elementlar.' },
    { nom: '¹⁴₆C va ¹⁴₇N', qisqa: 'A = 14', guruh: 'izobar', izoh: 'Har ikkalasida A = 14.' },
    { nom: '²⁶₁₂Mg va ²⁷₁₃Al', qisqa: 'N = 14', guruh: 'izoton', izoh: '26−12 = 14 va 27−13 = 14.' },
    { nom: '⁶²₂₉Cu va ⁶³₃₀Zn', qisqa: 'N = 33', guruh: 'izoton', izoh: '62−29 = 33 va 63−30 = 33.' },
    { nom: '³₁H va ⁴₂He', qisqa: 'N = 2', guruh: 'izoton', izoh: '3−1 = 2 va 4−2 = 2 neytron.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: "Ta'rif",
    savol: 'Izotoplar deb nimaga aytiladi?',
    variantlar: ['A bir xil atomlar', 'Gazlar aralashmasi', 'Z bir xil, massasi har xil bir element atomlari', 'Neytroni 0 atomlar'],
    togri: 2,
    izoh: 'Proton (Z) bir xil, neytron (N) har xil.',
  },
  {
    belgi: 'Vodorod',
    savol: "Og'ir suv (D₂O) tarkibidagi vodorod izotopi?",
    variantlar: ['Deyteriy (²₁H: 1p, 1n)', 'Protiy (¹₁H)', 'Tritiy (³₁H)', 'Geliy (⁴₂He)'],
    togri: 0,
    izoh: 'Deyteriy D = ²₁H.',
  },
  {
    belgi: 'Butlerov',
    savol: 'Kasr Ar (Cl=35,453) sababini kim tushuntirgan?',
    variantlar: ['J. Nyulends', 'E. Rezerford', 'I. Debereyner', 'A.M. Butlerov'],
    togri: 3,
    izoh: 'Tabiiy element — izotoplar aralashmasidir.',
  },
  {
    belgi: '2-masala',
    savol: 'Ar(B)=10,81 da ¹⁰B va ¹¹B ulushi qancha?',
    variantlar: ['50% va 50%', '19% ¹⁰B va 81% ¹¹B', '81% ¹⁰B va 19% ¹¹B', '10% va 90%'],
    togri: 1,
    izoh: '10x + 11(100−x) = 1081 → x = 19%.',
  },
  {
    belgi: '3-mashq',
    savol: '93% ³⁹K va 7% ⁴⁰K aralashmasida Ar(K)=?',
    variantlar: ['39,50', '39,07', '40,00', '39,93'],
    togri: 1,
    izoh: '0,93·39 + 0,07·40 = 39,07.',
  },
  {
    belgi: '4-mashq',
    savol: '99% ⁴⁰Ar + 0,7% ³⁸Ar + 0,3% ³⁶Ar → Ar(Ar)=?',
    variantlar: ['38,0', '39,0', '36,5', '39,974'],
    togri: 3,
    izoh: '39,6 + 0,266 + 0,108 = 39,974.',
  },
  {
    belgi: 'Izobarlar',
    savol: '⁴⁰₁₈Ar va ⁴⁰₂₀Ca juftligi nima deyiladi?',
    variantlar: ['Izobarlar (A = 40 bir xil)', 'Izotoplar', 'Izotonlar', 'Allotropiya'],
    togri: 0,
    izoh: 'Massa soni A=40 teng, Z har xil.',
  },
  {
    belgi: 'Izotonlar',
    savol: '²⁶Mg/²⁷Al va ⁶²Cu/⁶³Zn juftliklarida nima teng?',
    variantlar: ['Proton soni', 'Elektron soni', 'Neytron soni (14 va 33)', 'Massa soni'],
    togri: 2,
    izoh: 'N teng → izotonlar.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Vodorod izotoplari',
    vazifa: 'Vodorod izotoplarini massa ORTISHIGA ko\'ra joylang:',
    tartib: ['¹₁H Protiy (0n)', '²₁H Deyteriy (1n)', '³₁H Tritiy (2n)', "D₂O og'ir suv (M=20)"],
    variantlar: ['³₁H Tritiy (2n)', '¹₁H Protiy (0n)', "D₂O og'ir suv (M=20)", '²₁H Deyteriy (1n)'],
  },
  {
    tur: 'Argon izotoplari',
    vazifa: '1-masala: Ar izotoplarini neytron ORTISHIGA ko\'ra joylang:',
    tartib: ['³⁶Ar (18n)', '³⁸Ar (20n)', '⁴⁰Ar (22n)', "Ar(o'rt) = 39,974"],
    variantlar: ['⁴⁰Ar (22n)', '³⁶Ar (18n)', "Ar(o'rt) = 39,974", '³⁸Ar (20n)'],
  },
  {
    tur: '2-masala qadamlari',
    vazifa: 'Bor (10,81) izotoplarini topish bosqichlari:',
    tartib: ['x% ¹⁰B, (100−x)% ¹¹B', '10x+11(100−x)=1081', 'x = 19% (¹⁰B)', '100−19 = 81% (¹¹B)'],
    variantlar: ['10x+11(100−x)=1081', 'x% ¹⁰B, (100−x)% ¹¹B', '100−19 = 81% (¹¹B)', 'x = 19% (¹⁰B)'],
  },
  {
    tur: 'Uchta toifa',
    vazifa: 'Z → A → N → Ar(o\'rt) tartibini bog\'lang:',
    tartib: ['Izotop (Z=)', 'Izobar (A=)', 'Izoton (N=)', "O'rtacha massa Ar"],
    variantlar: ['Izoton (N=)', 'Izotop (Z=)', "O'rtacha massa Ar", 'Izobar (A=)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Nega bir element izotoplari jadvalda bitta katakda turadi?',
    variantlar: ['Massasi teng', 'Yadro zaryadi Z va xossasi bir xil', 'Neytron yo\'q', 'Zichligi teng'],
    togri: 1,
    izoh: 'Z teng → elektron tuzilishi bir xil.',
  },
  {
    savol: '⁴⁰₁₈Ar va ⁴⁰₂₀Ca xossalari nega tubdan farq qiladi?',
    variantlar: ['Massalari har xil', 'Neytroni yo\'q', 'Ikkalasi inert gaz', 'Z (18 va 20) har xil element'],
    togri: 3,
    izoh: 'Izobarlarda Z turlicha.',
  },
  {
    savol: 'Qaysi H izotopi yadro reaksiyalaridan olinadi?',
    variantlar: ['Tritiy (³₁H)', 'Protiy (¹₁H)', 'Deyteriy (²₁H)', 'Hech biri'],
    togri: 0,
    izoh: '38-bet: tritiy radioaktiv.',
  },
  {
    savol: '²⁶₁₂Mg va ²⁷₁₃Al qanday juftlik va nechtadan neytroni bor?',
    variantlar: ['Izotoplar, 12', 'Izobarlar, 27', 'Izotonlar (14 ta neytron)', 'Allotroplar, 13'],
    togri: 2,
    izoh: '26−12=14 va 27−13=14.',
  },
  {
    savol: '³⁵₁₇Cl va ³⁷₁₇Cl da elektronlar soni?',
    variantlar: ['Ikkisida ham 17 tadan', '35 va 37', '18 va 20', '17 va 20'],
    togri: 0,
    izoh: 'Z=17 bir xil → 17 ē.',
  },
  {
    savol: 'Tabiiy elementlar Ar qiymati nega odatda kasr son bo\'ladi?',
    variantlar: ['Doim butun', 'Xatolik', 'Izotoplar aralashmasining o\'rtacha qiymati', 'Nolga teng'],
    togri: 2,
    izoh: '37-bet: masalan Cl = 35,453.',
  },
  {
    savol: '75% ³⁵Cl + 25% ³⁷Cl da o\'rtacha Ar=?',
    variantlar: ['36,0', '35,5', '35,0', '36,5'],
    togri: 1,
    izoh: '0,75·35 + 0,25·37 = 35,5.',
  },
  {
    savol: '⁶²₂₉Cu va ⁶³₃₀Zn yadrolarida nima teng?',
    variantlar: ['Proton soni', 'Massa soni', 'Kimyoviy xossa', 'Neytron soni (N=33)'],
    togri: 3,
    izoh: '62−29=33; 63−30=33 → izoton.',
  },
];

export default function S8Mavzu8() {
  const korgazmalar = [
    { nom: '1. H izotoplari (¹H, ²H, ³H)', ikon: 'atom', komponent: <KorgazmaVodorodIzotoplari /> },
    { nom: '2. Ar va Cl (1-masala)', ikon: 'yadro', komponent: <KorgazmaArgonXlor /> },
    { nom: '3. 2-masala: Diagonal usul', ikon: 'formula', komponent: <KorgazmaDiagonalUsul /> },
    { nom: '4. 3–4-mashq: Ar o\'rtacha', ikon: 'grafik', komponent: <KorgazmaOrtachaAr /> },
    { nom: '5. Izobarlar (⁴⁰Ar / ⁴⁰Ca)', ikon: 'qidiruv', komponent: <KorgazmaIzobarlar /> },
    { nom: '6. Izotop / Izobar / Izoton', ikon: 'kolba', komponent: <KorgazmaUchToifa /> },
  ];

  const oyinlar = [
    {
      nom: '1. Uch toifa guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-8"
          nom="Juftliklarni izotop, izobar va izotonlarga ajratish"
          ikon="magnit"
          guruhlar={GURUHLASH_DATA.guruhlar}
          topshiriqlar={GURUHLASH_DATA.topshiriqlar}
        />
      ),
    },
    {
      nom: '2. Tezkor viktorina',
      ikon: 'chaqmoq',
      komponent: (
        <TezkorTanlovOyini
          key="tezkor-8"
          nom="8-§: Izotoplar va izobarlar viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Izotop zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-8"
          nom="Izotoplar va hisoblash qadamlari zanjiri"
          ikon="filtr"
          missiyalar={ZANJIR_MISSIYALAR}
        />
      ),
    },
    {
      nom: '4. Jamoalar dueli',
      ikon: 'kubok',
      komponent: (
        <JamoalarDueliPanel
          key="duel-8"
          sarlavha="8-§: Izotoplar va izobarlar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="8-§"
      mavzuNom="Izotoplar. Izobarlar"
      oldingiRaqam="7-§"
      oldingiNom="Atom yadrosi tarkibi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
