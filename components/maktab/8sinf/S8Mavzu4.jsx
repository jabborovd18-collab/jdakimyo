'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 4-PARAGRAF
// "Kimyoviy elementlarning tabiiy oilalari" (Darslik 21-24-betlar)
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
  chizStakan,
  chizZarracha,
  chizTermometr,
  GuruhlashOyini,
  TezkorTanlovOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi';

/* ═══════════════════════════════════════════════════════════════
   1-KO'RGAZMA: ISHQORIY METALLAR VA SUV BILAN REAKSIYA
═══════════════════════════════════════════════════════════════ */
const ISHQORIY_METALLAR = [
  {
    belgi: 'Li',
    nom: 'Litiy',
    ar: '6,9',
    tsuy: 179,
    tqayn: 1370,
    zichlik: 0.53,
    faollik: 1,
    rang: '#f472b6',
    reaksiyaIzoh: 'Suv yuzasida suzib (ρ=0,53) sokinroq H₂ ajratadi; fenolftalein pushtiradi.',
  },
  {
    belgi: 'Na',
    nom: 'Natriy',
    ar: '23',
    tsuy: 97.8,
    tqayn: 883,
    zichlik: 0.92,
    faollik: 2,
    rang: '#fbbf24',
    reaksiyaIzoh: 'Suv yuzida shar kabi erib tez yuguradi: 2Na + 2H₂O = 2NaOH + H₂↑.',
  },
  {
    belgi: 'K',
    nom: 'Kaliy',
    ar: '39,1',
    tsuy: 63.6,
    tqayn: 760,
    zichlik: 0.85,
    faollik: 3,
    rang: '#a855f7',
    reaksiyaIzoh: 'Suv bilan darhol binafsha alanga chiqarib reaksiyaga kirishadi.',
  },
  {
    belgi: 'Rb',
    nom: 'Rubidiy',
    ar: '85,5',
    tsuy: 39,
    tqayn: 696,
    zichlik: 1.52,
    faollik: 4,
    rang: '#38bdf8',
    reaksiyaIzoh: "Suvdan og'ir (ρ=1,52) - cho'kadi va shiddatli portlash bilan reaksiyaga kirishadi.",
  },
  {
    belgi: 'Cs',
    nom: 'Seziy',
    ar: '132,9',
    tsuy: 28.6,
    tqayn: 685,
    zichlik: 1.87,
    faollik: 5,
    rang: '#ef4444',
    reaksiyaIzoh: 'Eng faol ishqoriy metall: 28,6 °C da eriydi, suvda chaqnash bilan parchalanadi.',
  },
];

function KorgazmaIshqoriySuv() {
  const canvasRef = useRef(null);
  const [metallBelgi, setMetallBelgi] = useState('Na');
  const faol = ISHQORIY_METALLAR.find((x) => x.belgi === metallBelgi) || ISHQORIY_METALLAR[1];

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

      const m = ISHQORIY_METALLAR.find((x) => x.belgi === metallBelgi) || ISHQORIY_METALLAR[1];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`2${m.belgi} + 2H₂O → 2${m.belgi}OH + H₂↑  (I valentli metall)`, 24, 34);

      const sx = w * 0.1;
      const sy = h * 0.24;
      const sw = w * 0.44;
      const sh = h * 0.56;
      const pushtiQadam = Math.min(0.75, 0.25 + 0.1 * m.faollik);
      chizStakan(ctx, sx, sy, sw, sh, {
        suyuqlikRang: `rgba(236, 72, 153, ${pushtiQadam})`,
        tolish: 0.72,
        yorliq: `${m.belgi}OH ishqori (fenolftalein pushti)`,
        sarlavha: 'Suv bilan tajriba',
      });

      const suvYuzasiY = sy + sh * (1 - 0.72);
      const metalY = m.zichlik < 1 ? suvYuzasiY + 4 : sy + sh - 22;
      const tezlik = m.faollik * 1.4;
      const metalX = sx + sw / 2 + Math.sin(t * tezlik) * (m.zichlik < 1 ? sw * 0.24 : 18);

      chizZarracha(ctx, metalX, metalY, 15, m.rang, m.belgi);

      for (let i = 0; i < m.faollik * 2 + 2; i++) {
        const px = metalX + Math.sin(t * 3 + i * 2) * 18;
        const py = metalY - 12 - ((t * 48 * (0.6 + m.faollik * 0.25) + i * 22) % 95);
        if (py > sy - 18) {
          chizZarracha(ctx, px, py, 4.5, i % 2 === 0 ? '#e2e8f0' : '#fbbf24', '');
        }
      }

      const rx = w * 0.58;
      const rw = w * 0.38;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      ctx.strokeStyle = m.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, sy, rw, sh, 16);
      ctx.fill();
      ctx.stroke();

      const qatorlar = [
        ['Element:', `${m.nom} (${m.belgi})`],
        ['Nisbiy atom massa:', `Ar = ${m.ar}`],
        ['Valentlik:', 'Barcha birikmada I'],
        ['Zichlik:', `${m.zichlik.toFixed(2)} g/cm³ ${m.zichlik < 1 ? '(yengil)' : "(og'ir)"}`],
        ['Suyuqlanish T:', `${m.tsuy} °C`],
        ['Qaynash T:', `${m.tqayn} °C`],
      ];
      qatorlar.forEach(([k, v], idx) => {
        const qy = sy + 36 + idx * 34;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(k, rx + 16, qy);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.fillText(v, rx + rw - 16, qy);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [metallBelgi]);

  return (
    <KorgazmaRamka
      sarlavha="1. Ishqoriy metallarning suv bilan reaksiyasi va zichlik farqi (21-22-bet)"
      qisqaFormula="2M + 2H₂O = 2MOH + H₂↑ • 2Na + O₂ = Na₂O₂"
      ikon="tomchi"
      boshqaruv={
        <>
          {ISHQORIY_METALLAR.map((m) => (
            <button
              key={m.belgi}
              type="button"
              onClick={() => {
                setMetallBelgi(m.belgi);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                metallBelgi === m.belgi
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {m.belgi} ({m.nom})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Ar({faol.belgi}) = {faol.ar} • ρ = {faol.zichlik.toFixed(2)} g/cm³
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            T_suy = {faol.tsuy} °C • T_qayn = {faol.tqayn} °C
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.reaksiyaIzoh}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 2-3-JADVAL ISHQORIY METALLAR GRAFIGI
═══════════════════════════════════════════════════════════════ */
const ISHQORIY_METRIK = [
  { id: 'tsuy', nom: 'Suyuqlanish T (°C)', max: 200, izoh: 'Li (179°C) dan Cs (28,6°C) gacha muntazam pasayadi.' },
  { id: 'tqayn', nom: 'Qaynash T (°C)', max: 1500, izoh: 'Li (1370°C) dan Cs (685°C) gacha pasayib boradi.' },
  { id: 'zichlik', nom: 'Zichlik (g/cm³)', max: 2.1, izoh: "Umuman ortadi (K da 0,85 ga biroz pasayish bor); Li, Na, K suvdan yengil." },
];

function KorgazmaIshqoriyGrafik() {
  const canvasRef = useRef(null);
  const [metrikId, setMetrikId] = useState('tsuy');
  const faol = ISHQORIY_METRIK.find((m) => m.id === metrikId) || ISHQORIY_METRIK[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.025;

      const metrik = ISHQORIY_METRIK.find((m) => m.id === metrikId) || ISHQORIY_METRIK[0];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`2-3-jadval: Ishqoriy metallarning ${metrik.nom} o'zgarishi`, 24, 34);

      const baseY = h - 60;
      const chartH = h - 145;
      const startX = 65;
      const stepX = (w - 130) / 5;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX - 18, baseY);
      ctx.lineTo(w - 40, baseY);
      ctx.stroke();

      if (metrikId === 'zichlik') {
        const suvY = baseY - (1.0 / metrik.max) * chartH;
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX - 18, suvY);
        ctx.lineTo(w - 40, suvY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.fillText('Suv zichligi = 1,0 g/cm³', w - 45, suvY - 8);
      }

      const nuqtalar = [];
      ISHQORIY_METALLAR.forEach((m, i) => {
        const val = m[metrikId];
        const barW = Math.min(68, stepX * 0.56);
        const bx = startX + i * stepX + (stepX - barW) / 2;
        const bh = (val / metrik.max) * chartH * (0.96 + 0.03 * Math.sin(t + i));
        const by = baseY - bh;
        nuqtalar.push({ x: bx + barW / 2, y: by });

        const grad = ctx.createLinearGradient(bx, by, bx, baseY);
        grad.addColorStop(0, m.rang);
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.3)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(bx, by, barW, bh, [8, 8, 2, 2]);
        ctx.fill();

        ctx.strokeStyle = m.rang;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${val}`, bx + barW / 2, by - 10);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(m.belgi, bx + barW / 2, baseY + 20);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Times New Roman", serif';
        ctx.fillText(`Ar=${m.ar}`, bx + barW / 2, baseY + 36);
      });

      ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      nuqtalar.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [metrikId]);

  return (
    <KorgazmaRamka
      sarlavha="2. 2-3-jadval: Li → Cs qatorida fizik xossalarning o'zgarishi"
      qisqaFormula="Ar ortadi (6,9 → 132,9) • Havoda oksidlanish va MOH eruvchanligi ortadi"
      ikon="grafik"
      boshqaruv={
        <>
          {ISHQORIY_METRIK.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMetrikId(m.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                metrikId === m.id
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-emerald-400/50'
              }`}
            >
              {m.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Ko&apos;rsatkich: {faol.nom}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300 sm:col-span-2">
            {faol.izoh}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: GALOGENLAR AGREGAT HOLATI, RANGI VA HARORATI
═══════════════════════════════════════════════════════════════ */
const GALOGENLAR = [
  {
    formula: 'F₂',
    nom: 'Ftor',
    ar: '19',
    rangNomi: 'Och-sariq gaz',
    rang: '#fde047',
    tsuy: -220,
    tqayn: -188,
    zichlik: '1,1 (suyuq)',
    qH2: '+552',
    oksid: 'Oksid hosil qilmaydi',
  },
  {
    formula: 'Cl₂',
    nom: 'Xlor',
    ar: '35,5',
    rangNomi: "Sarg'ish-yashil gaz",
    rang: '#a3e635',
    tsuy: -101,
    tqayn: -34,
    zichlik: '1,57 (suyuq)',
    qH2: '+184',
    oksid: 'Cl₂O₇',
  },
  {
    formula: 'Br₂',
    nom: 'Brom',
    ar: '79,9',
    rangNomi: "Qoramtir-qo'ng'ir suyuqlik",
    rang: '#b45309',
    tsuy: -7,
    tqayn: 58,
    zichlik: '3,12',
    qH2: '+72',
    oksid: 'Br₂O₇',
  },
  {
    formula: 'I₂',
    nom: 'Yod',
    ar: '126,9',
    rangNomi: "To'q-kulrang qattiq kristall",
    rang: '#9333ea',
    tsuy: 114,
    tqayn: 186,
    zichlik: '4,93',
    qH2: '-53',
    oksid: 'I₂O₇',
  },
];

function KorgazmaGalogenHolat() {
  const canvasRef = useRef(null);
  const [tanlangan, setTanlangan] = useState('Br₂');
  const [harorat, setHarorat] = useState(20);
  const faol = GALOGENLAR.find((x) => x.formula === tanlangan) || GALOGENLAR[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const g = GALOGENLAR.find((x) => x.formula === tanlangan) || GALOGENLAR[2];
      const gazmi = harorat >= g.tqayn;
      const qattiqmi = harorat < g.tsuy;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Galogenlar (5-jadval): ${g.nom} (${g.formula}) • T = ${harorat} °C`, 24, 34);

      chizTermometr(ctx, 48, 66, h - 110, harorat + 200, 420, gazmi ? '#ef4444' : '#38bdf8');
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 12px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${harorat}°C`, 60, h - 22);

      const ax = w * 0.2;
      const ay = 68;
      const aw = w * 0.34;
      const ah = h - 115;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = g.rang;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(ax, ay, aw, ah, 20);
      ctx.fill();
      ctx.stroke();

      if (gazmi) {
        for (let i = 0; i < 8; i++) {
          const mx = ax + 35 + ((t * 50 + i * 47) % Math.max(40, aw - 70));
          const my = ay + 40 + Math.abs(Math.sin(t * 1.6 + i) * Math.max(40, ah - 80));
          chizZarracha(ctx, mx - 8, my, 9, g.rang, '');
          chizZarracha(ctx, mx + 8, my, 9, g.rang, g.formula[0]);
        }
        ctx.fillStyle = g.rang;
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAZ HOLATI (T ≥ T_qayn)', ax + aw / 2, ay + ah - 18);
      } else if (qattiqmi) {
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 4; c++) {
            const kx = ax + aw * 0.25 + c * 28;
            const ky = ay + ah - 75 + r * 20;
            chizZarracha(ctx, kx, ky, 9, g.rang, '');
          }
        }
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('QATTIQ KRISTALL HOLAT', ax + aw / 2, ay + 34);
      } else {
        ctx.fillStyle = g.rang;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.roundRect(ax + 6, ay + ah * 0.56, aw - 12, ah * 0.42 - 6, 12);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('SUYUQ HOLAT (T_suy ≤ T < T_qayn)', ax + aw / 2, ay + 34);
      }

      const rx = w * 0.58;
      const rw = w * 0.38;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.84)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rx, ay, rw, ah, 16);
      ctx.fill();
      ctx.stroke();

      const rows = [
        ['20°C dagi holati:', g.rangNomi],
        ['Ar:', g.ar],
        ['Qaynash harorati:', `${g.tqayn} °C`],
        ['Zichlik (g/cm³):', g.zichlik],
        ['H₂ issiqlik effekti:', `${g.qH2} kJ`],
        ['Yuqori oksidi (VII):', g.oksid],
      ];
      rows.forEach(([k, v], i) => {
        const y = ay + 36 + i * 38;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(k, rx + 16, y);

        ctx.fillStyle = g.rang;
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.fillText(v, rx + rw - 16, y);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlangan, harorat]);

  return (
    <KorgazmaRamka
      sarlavha="3. Galogenlar: agregat holati, rangi va qaynash harorati (5-jadval)"
      qisqaFormula="F₂ (-188°C, gaz) → Cl₂ (-34°C, gaz) → Br₂ (58°C, suyuq) → I₂ (186°C, qattiq)"
      ikon="harorat"
      boshqaruv={
        <>
          {GALOGENLAR.map((g) => (
            <button
              key={g.formula}
              type="button"
              onClick={() => {
                setTanlangan(g.formula);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                tanlangan === g.formula
                  ? 'bg-purple-400 text-slate-950 border-purple-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-purple-400/50'
              }`}
            >
              {g.formula} ({g.nom})
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 rounded-xl border border-blue-800 bg-slate-900 px-3.5 py-2 text-sm font-bold text-blue-100">
            <span>T = {harorat}°C</span>
            <input
              type="range"
              min={-200}
              max={210}
              value={harorat}
              onChange={(e) => setHarorat(Number(e.target.value))}
              className="w-28 accent-purple-400"
            />
          </label>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            20 °C dagi holati: {faol.rangNomi}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            T_qayn = {faol.tqayn} °C • ρ = {faol.zichlik} g/cm³
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Yuqori oksidi: {faol.oksid}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: H2 + X2 ISSIQLIK EFFEKTI (5-JADVAL)
═══════════════════════════════════════════════════════════════ */
const ISSIQLIK_DATA = [
  { belgi: 'F₂', q: 552, rang: '#facc15', sharoit: "Qorong'ida ham portlash bilan (+552 kJ)" },
  { belgi: 'Cl₂', q: 184, rang: '#84cc16', sharoit: "Yorug'lik ta'sirida shiddatli (+184 kJ)" },
  { belgi: 'Br₂', q: 72, rang: '#d97706', sharoit: 'Qizdirilganda reaksiyaga kirishadi (+72 kJ)' },
  { belgi: 'I₂', q: -53, rang: '#a855f7', sharoit: 'Issiqlik yutadi - endotermik qaytar (-53 kJ)' },
];

function KorgazmaGalogenIssiqlik() {
  const canvasRef = useRef(null);
  const [aktiv, setAktiv] = useState('F₂');
  const faol = ISSIQLIK_DATA.find((d) => d.belgi === aktiv) || ISSIQLIK_DATA[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('H₂ + X₂ → 2HX reaksiyasi issiqlik effekti (kJ, 5-jadval)', 24, 34);

      const zeroY = h * 0.72;
      const scale = (h * 0.48) / 552;
      const startX = 75;
      const stepX = (w - 140) / 4;

      ctx.strokeStyle = 'rgba(248, 250, 252, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX - 20, zeroY);
      ctx.lineTo(w - 50, zeroY);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px "Times New Roman", serif';
      ctx.textAlign = 'right';
      ctx.fillText('0 kJ', startX - 26, zeroY + 4);

      ISSIQLIK_DATA.forEach((d, i) => {
        const bw = Math.min(76, stepX * 0.56);
        const bx = startX + i * stepX + (stepX - bw) / 2;
        const bh = Math.abs(d.q) * scale * (aktiv === d.belgi ? 1 + 0.03 * Math.sin(t * 2) : 1);
        const by = d.q >= 0 ? zeroY - bh : zeroY;

        ctx.fillStyle = d.rang;
        ctx.globalAlpha = aktiv === d.belgi ? 0.92 : 0.58;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, d.q >= 0 ? [8, 8, 2, 2] : [2, 2, 8, 8]);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = aktiv === d.belgi ? '#ffffff' : d.rang;
        ctx.lineWidth = aktiv === d.belgi ? 2.5 : 1.2;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.q > 0 ? '+' : ''}${d.q} kJ`, bx + bw / 2, d.q >= 0 ? by - 10 : by + bh + 18);

        ctx.fillStyle = d.rang;
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.fillText(`H₂ + ${d.belgi}`, bx + bw / 2, d.q >= 0 ? zeroY + 22 : zeroY - 12);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [aktiv]);

  return (
    <KorgazmaRamka
      sarlavha="4. Galogenlarning vodorod bilan birikish issiqlik effekti"
      qisqaFormula="F₂ (+552 kJ) → Cl₂ (+184 kJ) → Br₂ (+72 kJ) → I₂ (-53 kJ)"
      ikon="olov"
      boshqaruv={
        <>
          {ISSIQLIK_DATA.map((d) => (
            <button
              key={d.belgi}
              type="button"
              onClick={() => {
                setAktiv(d.belgi);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                aktiv === d.belgi
                  ? 'bg-rose-400 text-slate-950 border-rose-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-rose-400/50'
              }`}
            >
              {d.belgi} ({d.q > 0 ? `+${d.q}` : d.q} kJ)
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Reaksiya: H₂ + {faol.belgi} → 2H{faol.belgi[0]}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Tur: {faol.q > 0 ? 'Ekzotermik (+Q)' : 'Endotermik (-Q)'}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.sharoit}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: 4-JADVAL - GALOGEN VA ISHQORIY BIRIKMALAR
═══════════════════════════════════════════════════════════════ */
const OILA_BIRIKMALAR = [
  {
    id: 'galogen',
    nom: 'Galogenlar (4-jadval)',
    sarlavha: 'Gidrid va tuzlarda I valentli; yuqori oksidlarda VII valentli (Ftordan tashqari!)',
    rang: '#a855f7',
    ustunlar: ['Element', 'Yuqori oksid (VII)', 'Gidrid (I)', 'Natriyli tuz (I)'],
    qatorlar: [
      ['F (Ftor)', 'Oksid bermaydi!', 'HF', 'NaF'],
      ['Cl (Xlor)', 'Cl₂O₇', 'HCl', 'NaCl'],
      ['Br (Brom)', 'Br₂O₇', 'HBr', 'NaBr'],
      ['I (Yod)', 'I₂O₇', 'HI', 'NaI'],
    ],
  },
  {
    id: 'ishqoriy',
    nom: 'Ishqoriy metallar',
    sarlavha: 'Barcha birikmalarida faqat I valentli; gidroksidlari - kuchli ishqorlar',
    rang: '#38bdf8',
    ustunlar: ['Element', 'Oksid / Peroksid', 'Gidroksid', 'Xlorid tuzi'],
    qatorlar: [
      ['Li (Litiy)', 'Li₂O', 'LiOH', 'LiCl'],
      ['Na (Natriy)', 'Na₂O / Na₂O₂', 'NaOH', 'NaCl'],
      ['K (Kaliy)', 'K₂O', 'KOH', 'KCl'],
      ['Cs (Seziy)', 'Cs₂O', 'CsOH', 'CsCl'],
    ],
  },
];

function KorgazmaBirikmalar() {
  const canvasRef = useRef(null);
  const [oilaId, setOilaId] = useState('galogen');
  const faol = OILA_BIRIKMALAR.find((x) => x.id === oilaId) || OILA_BIRIKMALAR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const jad = OILA_BIRIKMALAR.find((x) => x.id === oilaId) || OILA_BIRIKMALAR[0];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(jad.sarlavha, 24, 34);

      const marginX = 28;
      const colW = (w - marginX * 2) / 4;
      const startY = 58;
      const rowH = Math.min(48, (h - 90) / 5);

      jad.ustunlar.forEach((u, c) => {
        const x = marginX + c * colW;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
        ctx.strokeStyle = jad.rang;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 3, startY, colW - 6, rowH - 4, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = jad.rang;
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(u, x + colW / 2, startY + rowH * 0.56);
      });

      jad.qatorlar.forEach((row, r) => {
        row.forEach((cell, c) => {
          const x = marginX + c * colW;
          const y = startY + (r + 1) * rowH;
          const highlight = cell.includes('Oksid bermaydi') || cell.includes('Na₂O₂');
          const alpha = highlight ? 0.25 + 0.1 * Math.sin(t * 2) : 0.72;

          ctx.fillStyle = highlight ? `rgba(244, 63, 94, ${alpha})` : 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = highlight ? '#f43f5e' : 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(x + 3, y, colW - 6, rowH - 5, 8);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = highlight ? '#fda4af' : '#f8fafc';
          ctx.font = c === 0 ? 'bold 13px "Times New Roman", serif' : '13px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(cell, x + colW / 2, y + rowH * 0.56);
        });
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [oilaId]);

  return (
    <KorgazmaRamka
      sarlavha="5. 4-jadval: Galogen va ishqoriy metallar birikmalari solishtirmasi"
      qisqaFormula="Galogenlar: E₂O₇ (F istisno!), HE • Ishqoriy metallar: faqat I valentli"
      ikon="formula"
      boshqaruv={
        <>
          {OILA_BIRIKMALAR.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOilaId(o.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                oilaId === o.id
                  ? 'bg-sky-400 text-slate-950 border-sky-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-sky-400/50'
              }`}
            >
              {o.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Oila: {faol.nom}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300 sm:col-span-2">
            {faol.sarlavha}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: INERT GAZLAR VA O'XSHASH ELEMENT JUFTLARI
═══════════════════════════════════════════════════════════════ */
const INERTLAR = [
  { belgi: 'He', nom: 'Geliy', rang: '#38bdf8' },
  { belgi: 'Ne', nom: 'Neon', rang: '#fb7185' },
  { belgi: 'Ar', nom: 'Argon', rang: '#a855f7' },
  { belgi: 'Kr', nom: 'Kripton', rang: '#10b981' },
  { belgi: 'Xe', nom: 'Ksenon', rang: '#f59e0b' },
];

const JUFTLAR = [
  { juft: 'Mg ~ Ca', izoh: 'II valentli ishqoriy-yer metallar', a: 'Mg', b: 'Ca', rang: '#38bdf8' },
  { juft: 'Al ~ B', izoh: 'III valentli (Al₂O₃, B₂O₃)', a: 'Al', b: 'B', rang: '#10b981' },
  { juft: 'C ~ Si', izoh: 'IV valentli: CO₂, SiO₂', a: 'C', b: 'Si', rang: '#f59e0b' },
  { juft: 'N ~ P', izoh: 'V valentli: N₂O₅, P₂O₅', a: 'N', b: 'P', rang: '#a855f7' },
];

function KorgazmaInertVaJuftlar() {
  const canvasRef = useRef(null);
  const [rejim, setRejim] = useState('inert');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.025;

      if (rejim === 'inert') {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 17px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText('Inert gazlar: 1 atomli — He, Ne, Ar, Kr, Xe', 24, 34);

        INERTLAR.forEach((g, i) => {
          const ax = w * 0.14 + i * ((w * 0.72) / 4);
          const ay = h * 0.47 + Math.sin(t * 1.8 + i * 1.1) * 28;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(ax, ay, 34, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);

          chizZarracha(ctx, ax, ay, 20, g.rang, g.belgi);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 12px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(g.nom, ax, ay + 50);
        });

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('H₂ va metallar bilan birikmaydi • Kr, Xe faqat O₂, F₂ bilan', w / 2, h - 28);
      } else {
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 17px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText('O\'xshash xossali juftliklar (24-bet)', 24, 34);

        const cw = (w - 84) / 2;
        const ch = (h - 106) / 2;
        JUFTLAR.forEach((j, idx) => {
          const x = 28 + (idx % 2) * (cw + 28);
          const y = 58 + Math.floor(idx / 2) * (ch + 16);

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.strokeStyle = j.rang;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(x, y, cw, ch, 14);
          ctx.fill();
          ctx.stroke();

          const oy = y + 36 + Math.sin(t * 2 + idx) * 3;
          chizZarracha(ctx, x + cw - 72, oy, 15, j.rang, j.a);
          chizZarracha(ctx, x + cw - 30, oy, 15, j.rang, j.b);

          ctx.fillStyle = j.rang;
          ctx.font = 'bold 19px "Times New Roman", serif';
          ctx.textAlign = 'left';
          ctx.fillText(j.juft, x + 20, y + 38);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 13px "Times New Roman", serif';
          ctx.fillText(j.izoh, x + 20, y + 72);
        });
      }

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [rejim]);

  return (
    <KorgazmaRamka
      sarlavha="6. Inert gazlar oilasi va o'xshash xossali element juftlari"
      qisqaFormula="He, Ne, Ar, Kr, Xe (1 atomli) • Mg~Ca, Al~B, C~Si, N~P"
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setRejim('inert');
              tovushChiqar('tasdiq');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              rejim === 'inert' ? 'bg-sky-400 text-slate-950 border-sky-300' : 'border-blue-800 bg-slate-900 text-blue-200'
            }`}
          >
            Inert gazlar (He → Xe)
          </button>
          <button
            type="button"
            onClick={() => {
              setRejim('juft');
              tovushChiqar('tasdiq');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              rejim === 'juft' ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'border-blue-800 bg-slate-900 text-blue-200'
            }`}
          >
            O&apos;xshash juftlar (Mg~Ca, C~Si...)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Inert gazlar: He, Ne, Ar, Kr, Xe (1 atomli)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Vodorod va metallar bilan birikmaydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            O&apos;xshash juftlar: Mg~Ca, Al~B, C~Si, N~P
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH VA O'YINLAR
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'XVIII asr oxiri va hozirda ma\'lum elementlar soni:',
    variantlar: [
      { matn: '10 va 63 ta', togri: false },
      { matn: '63 va 92 ta', togri: false },
      { matn: '~30 ta va 118 ta', togri: true },
      { matn: '30 va 100 ta', togri: false },
    ],
    izoh: 'XVIII asr: ~30, XIX asr: 63, hozir: 118 ta.',
  },
  {
    id: 't2',
    savol: 'Xrom oksidlarida asosli → kislotali o\'tish:',
    variantlar: [
      { matn: 'CrO → Cr₂O₃ (amf.) → CrO₃', togri: true },
      { matn: 'CrO₃ → Cr₂O₃ → CrO', togri: false },
      { matn: 'Cr₂O₃ → CrO → CrO₃', togri: false },
      { matn: 'Barchasi asosli', togri: false },
    ],
    izoh: 'Valentlik +2 → +3 → +6 ortganda kislotali xossa ortadi.',
  },
  {
    id: 't3',
    savol: 'Faqat amfoter gidroksid beruvchi elementlar:',
    variantlar: [
      { matn: 'Na, K, Li', togri: false },
      { matn: 'S, Cl, P', togri: false },
      { matn: 'Ca, Mg, Ba', togri: false },
      { matn: 'Zn, Al, Be', togri: true },
    ],
    izoh: 'Zn(OH)₂, Al(OH)₃, Be(OH)₂ — amfoter.',
  },
  {
    id: 't4',
    savol: '0,1 mol Be(OH)₂ + mo\'l NaOH → Na₂BeO₂ massasi:',
    variantlar: [
      { matn: '4,35 g', togri: false },
      { matn: '8,7 g', togri: true },
      { matn: '17,4 g', togri: false },
      { matn: '2,3 g', togri: false },
    ],
    izoh: 'M(Na₂BeO₂) = 87 g/mol → 0,1 · 87 = 8,7 g.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'ishqoriy', nom: 'Ishqoriy metallar', tavsif: 'Li, Na, K, Rb, Cs (I)' },
    { id: 'galogen', nom: 'Galogenlar', tavsif: 'F₂, Cl₂, Br₂, I₂' },
    { id: 'inert', nom: 'Inert gazlar', tavsif: 'He, Ne, Ar, Kr, Xe (1 at.)' },
  ],
  topshiriqlar: [
    { nom: 'Litiy (Li)', qisqa: 'ρ = 0,53 g/cm³', guruh: 'ishqoriy', izoh: 'Eng yengil ishqoriy metall.' },
    { nom: 'Natriy (Na)', qisqa: '2Na + O₂ = Na₂O₂', guruh: 'ishqoriy', izoh: 'Suvda suzuvchi faol metall.' },
    { nom: 'Seziy (Cs)', qisqa: 'T_suy = 28,6 °C', guruh: 'ishqoriy', izoh: 'Eng faol ishqoriy metall.' },
    { nom: 'Ftor (F₂)', qisqa: 'Och-sariq gaz', guruh: 'galogen', izoh: 'Oksid bermaydigan eng faol galogen.' },
    { nom: 'Brom (Br₂)', qisqa: 'Qo\'ng\'ir suyuqlik', guruh: 'galogen', izoh: 'T_qayn = 58 °C suyuq galogen.' },
    { nom: 'Yod (I₂)', qisqa: 'Kulrang kristall', guruh: 'galogen', izoh: 'H₂ bilan endotermik (-53 kJ).' },
    { nom: 'Geliy (He)', qisqa: '1 atomli gaz', guruh: 'inert', izoh: 'Inert gazlar vakili.' },
    { nom: 'Argon (Ar)', qisqa: 'H₂ ga kirmaydi', guruh: 'inert', izoh: 'Havodagi eng ko\'p inert gaz.' },
    { nom: 'Ksenon (Xe)', qisqa: 'F₂ bilan birikadi', guruh: 'inert', izoh: 'Ftorid va oksid bera oladi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '2-jadval',
    savol: 'Suvdan yengil (ρ < 1) ishqoriy metallar:',
    variantlar: ['Rb va Cs', 'Na, Rb, Cs', 'Li, Rb, Cs', 'Li, Na va K'],
    togri: 3,
    izoh: 'Li(0,53), Na(0,92), K(0,85) yengil; Rb, Cs og\'ir.',
  },
  {
    belgi: 'Peroksid',
    savol: 'Na kislorodda yonganda asosiy mahsulot:',
    variantlar: ['Na₂O₂ (peroksid)', 'Na₂O₃', 'NaOH', 'NaH'],
    togri: 0,
    izoh: '4-§: 2Na + O₂ = Na₂O₂.',
  },
  {
    belgi: '5-jadval',
    savol: 'F₂ → Cl₂ → Br₂ → I₂ qaynash harorati:',
    variantlar: ['Pasayadi', 'O\'zgarmaydi', '-188°C → +186°C ortadi', 'Faqat Br₂ da ortadi'],
    togri: 2,
    izoh: 'F₂(-188) → Cl₂(-34) → Br₂(58) → I₂(186 °C).',
  },
  {
    belgi: 'Endotermik',
    savol: 'H₂ bilan endotermik (-53 kJ) kirishuvchi galogen:',
    variantlar: ['F₂', 'I₂', 'Cl₂', 'Br₂'],
    togri: 1,
    izoh: 'H₂ + I₂ = 2HI - 53 kJ (qaytar).',
  },
  {
    belgi: '4-jadval',
    savol: 'VII valentli oksid (E₂O₇) HOSIL QILMAYDIGAN galogen:',
    variantlar: ['Xlor (Cl)', 'Brom (Br)', 'Ftor (F)', 'Yod (I)'],
    togri: 2,
    izoh: 'Cl₂O₇, Br₂O₇, I₂O₇ bor; F VII valentlik bermaydi.',
  },
  {
    belgi: 'Suyuqlanish',
    savol: 'Li → Cs qatorida suyuqlanish harorati:',
    variantlar: ['28°C → 179°C ortadi', 'Doim 100°C', 'Cs eng qiyin eriydi', '179°C → 28,6°C pasayadi'],
    togri: 3,
    izoh: '3-jadval: Li(179) → Na(97,8) → K(63,6) → Rb(39) → Cs(28,6 °C).',
  },
  {
    belgi: 'Inert gaz',
    savol: 'Inert gaz molekulasi necha atomli?',
    variantlar: ['1 atomli (He, Ne, Ar)', '2 atomli', '4 atomli', '8 atomli'],
    togri: 0,
    izoh: 'Inert gazlar bir atomli.',
  },
  {
    belgi: 'Juftlar',
    savol: 'Xossalari o\'xshash element juftlari (24-bet):',
    variantlar: ['Na~F, K~Cl', 'Mg~Ca, B~Al, C~Si, N~P', 'He~Na, Ar~Br', 'Li~I, Cs~F'],
    togri: 1,
    izoh: '24-bet: Mg~Ca, Al~B, C~Si, N~P.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Suv bilan faollik',
    vazifa: 'Suv bilan reaksiya faolligi ORTISHI:',
    tartib: ['Li', 'Na', 'K', 'Cs'],
    variantlar: ['K', 'Li', 'Cs', 'Na'],
  },
  {
    tur: 'Galogenlar qaynash T',
    vazifa: 'Qaynash harorati ORTISHI tartibi:',
    tartib: ['F₂ (-188°C)', 'Cl₂ (-34°C)', 'Br₂ (58°C)', 'I₂ (186°C)'],
    variantlar: ['Br₂ (58°C)', 'F₂ (-188°C)', 'I₂ (186°C)', 'Cl₂ (-34°C)'],
  },
  {
    tur: 'Issiqlik effekti',
    vazifa: 'H₂ + X₂ issiqlik effekti KAMAYISHI:',
    tartib: ['F₂ (+552 kJ)', 'Cl₂ (+184 kJ)', 'Br₂ (+72 kJ)', 'I₂ (-53 kJ)'],
    variantlar: ['Cl₂ (+184 kJ)', 'I₂ (-53 kJ)', 'F₂ (+552 kJ)', 'Br₂ (+72 kJ)'],
  },
  {
    tur: 'Zichlik tartibi',
    vazifa: 'Zichligi ortishi bo\'yicha tartiblang:',
    tartib: ['Li (0,53)', 'K (0,85)', 'Na (0,92)', 'Cs (1,87)'],
    variantlar: ['Na (0,92)', 'Li (0,53)', 'Cs (1,87)', 'K (0,85)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Faqat I valentli bo\'ladigan tabiiy oila:',
    variantlar: ['Galogenlar', 'Inert gazlar', 'Ishqoriy metallar', 'Xrom oilasi'],
    togri: 2,
    izoh: 'Ishqoriy metallar doim I valentli.',
  },
  {
    savol: '20 °C da qo\'ng\'ir suyuq galogen:',
    variantlar: ['F₂', 'Br₂', 'Cl₂', 'I₂'],
    togri: 1,
    izoh: 'Br₂ qaynash T = 58 °C (suyuqlik).',
  },
  {
    savol: 'Na va K + suv → ajraladigan gaz:',
    variantlar: ['O₂', 'N₂', 'Cl₂', 'H₂'],
    togri: 3,
    izoh: '2M + 2H₂O = 2MOH + H₂↑.',
  },
  {
    savol: 'Galogen gidridlari (HF, HCl) suvda eriganda:',
    variantlar: ['Kislota eritmasi', 'Ishqor', 'Cho\'kma', 'Peroksid'],
    togri: 0,
    izoh: 'Suvda erib kuchli kislotalar beradi.',
  },
  {
    savol: 'Inert gazlar qatori:',
    variantlar: ['Li..Cs', 'He, Ne, Ar, Kr, Xe', 'F..At', 'Mg..Ba'],
    togri: 1,
    izoh: 'He, Ne, Ar, Kr, Xe — nodir gazlar.',
  },
  {
    savol: 'Li → Cs da havoda oksidlanish:',
    variantlar: ['To\'xtaydi', 'O\'zgarmaydi', 'Kamayadi', 'Kuchayadi'],
    togri: 3,
    izoh: 'Li dan Cs gacha faollik ortadi.',
  },
  {
    savol: 'Galogen natriyli tuzlari formulasi:',
    variantlar: ['Na₂X', 'NaX₂', 'NaX (NaF, NaCl...)', 'NaXO₄'],
    togri: 2,
    izoh: 'Ikkisi ham I valentli → NaX.',
  },
  {
    savol: 'O\'xshash xossali juftlik:',
    variantlar: ['C va Si', 'Na va I', 'He va Ca', 'F va Cs'],
    togri: 0,
    izoh: '24-bet: C~Si o\'xshash juftlik.',
  },
];

export default function S8Mavzu4() {
  const korgazmalar = [
    { nom: '1. Suv bilan reaksiya', ikon: 'tomchi', komponent: <KorgazmaIshqoriySuv /> },
    { nom: '2. 2-3-jadval grafigi', ikon: 'grafik', komponent: <KorgazmaIshqoriyGrafik /> },
    { nom: '3. Galogenlar holati', ikon: 'harorat', komponent: <KorgazmaGalogenHolat /> },
    { nom: '4. Issiqlik effekti', ikon: 'olov', komponent: <KorgazmaGalogenIssiqlik /> },
    { nom: '5. 4-jadval birikmalar', ikon: 'formula', komponent: <KorgazmaBirikmalar /> },
    { nom: '6. Inert va juftlar', ikon: 'atom', komponent: <KorgazmaInertVaJuftlar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Oilalarga ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-4"
          nom="Tabiiy oilalarga ajratish"
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
          key="tezkor-4"
          nom="4-§ tezkor savollar"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Tendensiya zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-4"
          nom="Xossalar o'zgarish zanjiri"
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
          key="duel-4"
          sarlavha="4-§ Jamoalar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="4-§"
      mavzuNom="Kimyoviy elementlarning tabiiy oilalari"
      oldingiRaqam="3-§"
      oldingiNom="Kimyoviy elementlarning dastlabki toifalanishi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
