'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 10-PARAGRAF
// "Energetik pog'onachalar" (Darslik 44-47-betlar)
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
   1-KO'RGAZMA: s, p, d, f ELEKTRON BULUT SHAKLLARI (44-45-BET)
═══════════════════════════════════════════════════════════════ */
const QAVATCHA_SHAKLLAR = [
  { id: 's', nom: 's-qavatcha (l = 0)', shakl: 'Sharsimon (sfera)', orbSoni: 1, maxEl: 2, rang: '#f472b6', izoh: 'Sharsimon sfera: 1 orbital, ko\'pi bilan 2 ē.' },
  { id: 'p', nom: 'p-qavatcha (l = 1)', shakl: 'Gantelsimon (px, py, pz)', orbSoni: 3, maxEl: 6, rang: '#38bdf8', izoh: 'X, Y, Z o\'qlarda 3 ta gantel orbital (max 6 ē).' },
  { id: 'd', nom: 'd-qavatcha (l = 2)', shakl: 'To\'rt bargli (5 orbital)', orbSoni: 5, maxEl: 10, rang: '#fbbf24', izoh: 'dxy..dz²: 5 ta orbital, max 10 ē sig\'adi.' },
  { id: 'f', nom: 'f-qavatcha (l = 3)', shakl: 'Murakkab (7 orbital)', orbSoni: 7, maxEl: 14, rang: '#a855f7', izoh: '7 xil murakkab orbital, max 14 ē sig\'adi.' },
];

function KorgazmaBulutShakllari() {
  const canvasRef = useRef(null);
  const [tur, setTur] = useState('p');
  const faol = QAVATCHA_SHAKLLAR.find((q) => q.id === tur) || QAVATCHA_SHAKLLAR[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = QAVATCHA_SHAKLLAR.find((q) => q.id === tur) || QAVATCHA_SHAKLLAR[1];
    let kadr;
    let t = 0;

    const chizBarg = (ctx, cx, cy, angle, len, wid, color) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.fillStyle = `${color}55`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(len / 2, 0, len / 2, wid, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Energetik qavatcha shakli: ${faol.nom} — ${faol.shakl}`, 24, 34);

      const cx = w * 0.32;
      const cy = h * 0.56;

      // Koordinata o'qlari
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 105, cy);
      ctx.lineTo(cx + 105, cy);
      ctx.moveTo(cx, cy - 95);
      ctx.lineTo(cx, cy + 95);
      ctx.stroke();

      const rot = Math.sin(t) * 0.12;
      if (tur === 's') {
        ctx.fillStyle = `${faol.rang}44`;
        ctx.strokeStyle = faol.rang;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 72 + Math.sin(t * 2) * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (tur === 'p') {
        chizBarg(ctx, cx, cy, rot, 88, 24, '#38bdf8');
        chizBarg(ctx, cx, cy, Math.PI + rot, 88, 24, '#38bdf8');
        chizBarg(ctx, cx, cy, Math.PI / 2 + rot, 82, 20, '#34d399');
        chizBarg(ctx, cx, cy, -Math.PI / 2 + rot, 82, 20, '#34d399');
      } else if (tur === 'd') {
        for (let k = 0; k < 4; k++) {
          chizBarg(ctx, cx, cy, (k * Math.PI) / 2 + Math.PI / 4 + rot, 86, 20, faol.rang);
        }
      } else {
        for (let k = 0; k < 6; k++) {
          chizBarg(ctx, cx, cy, (k * Math.PI) / 3 + rot, 84, 15, faol.rang);
        }
      }

      chizZarracha(ctx, cx, cy, 8, '#fde047', '');

      const rx = w * 0.56;
      const rw = w * 0.4;
      const ry = 68;
      const rh = h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = faol.rang;
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.fillText(faol.nom, rx + 20, ry + 36);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.fillText(`Shakli: ${faol.shakl}`, rx + 20, ry + 68);
      ctx.fillText(`Orbitallar soni (2l+1): ${faol.orbSoni} ta`, rx + 20, ry + 96);
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText(`Maksimal elektron 2(2l+1): ${faol.maxEl} ē`, rx + 20, ry + 124);

      // Orbital katakchalar [↑↓]
      const boxStart = rx + 20;
      const boxY = ry + 148;
      for (let i = 0; i < faol.orbSoni; i++) {
        const bx = boxStart + i * 38;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = faol.rang;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, boxY, 32, 32);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('↑↓', bx + 16, boxY + 21);
      }

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.izoh, rx + 20, ry + 208);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tur]);

  return (
    <KorgazmaRamka
      sarlavha="1. Elektron bulut shakllari: s, p, d, f (44–45-b)"
      qisqaFormula="s (1 orb, 2 ē) • p (3 orb, 6 ē) • d (5 orb, 10 ē) • f (7 orb, 14 ē)"
      ikon="atom"
      boshqaruv={
        <>
          {QAVATCHA_SHAKLLAR.map((q) => (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setTur(q.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                tur === q.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {q.id}-qavatcha (max {q.maxEl} ē)
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Shakli: {faol.shakl}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Orbitallar: {faol.orbSoni} ta → sig&apos;im: {faol.maxEl} ta elektron
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Har bir orbital katakchaga qarama-qarshi spinli 2 ē (↑↓) sig&apos;adi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 9-JADVAL — n POG'ONALAR VA QAVATCHALAR (45-46-BET)
═══════════════════════════════════════════════════════════════ */
const JADVAL_9_VARIANTLAR = [
  {
    id: 'n1',
    tugma: 'n = 1 (K: 1s)',
    formula: 'n = 1 → 1s (max 2 ē = 2·1²)',
    tur: 'hisob',
    cfg: {
      sarlavha: '9-jadval (45-bet): n = 1 (K-qavat)',
      tenglama: '1 ta qavatcha: 1s (1 orbital) → jami 2 ē',
      qadamlar: [
        { belgi: '1s-qavatcha', natija: '2 ē', izoh: '1 ta sharsimon orbital', rang: '#f472b6' },
        { belgi: 'Sig\'im (2n²)', natija: '2 ē', izoh: '2 · 1² = 2', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '1s ulushi', foiz: 100, qiymat: '2 / 2 ē', rang: '#f472b6' },
      ],
      javobBadge: 'K (n=1): 1s² → max 2 elektron',
    },
    pastki: [
      'Qavatchalar soni = n = 1 (faqat 1s)',
      '1s: 1 orbital, max 2 ē',
      'Umumiy sig\'im: 2 ē (2·1²)',
    ],
  },
  {
    id: 'n2',
    tugma: 'n = 2 (L: 2s, 2p)',
    formula: 'n = 2 → 2s (2) + 2p (6) = 8 ē',
    tur: 'hisob',
    cfg: {
      sarlavha: '9-jadval (45-bet): n = 2 (L-qavat)',
      tenglama: '2 ta qavatcha: 2s (2 ē) + 2p (6 ē) = 8 ē',
      qadamlar: [
        { belgi: '2s', natija: '2 ē', izoh: '1 orbital (↑↓)', rang: '#f472b6' },
        { belgi: '2p', natija: '6 ē', izoh: '3 gantel orbital', rang: '#38bdf8' },
        { belgi: 'Jami L', natija: '8 ē', izoh: '2 · 2² = 8', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '2s', foiz: 25, qiymat: '2 ē', rang: '#f472b6' },
        { nom: '2p', foiz: 75, qiymat: '6 ē', rang: '#38bdf8' },
      ],
      javobBadge: 'L (n=2): 2 + 6 = 8 = 2·2²',
    },
    pastki: [
      'Qavatchalar soni = n = 2 (2s, 2p)',
      'Tarkibi: 2s(2) + 2p(6)',
      'Umumiy sig\'im: 8 elektron (oktet)',
    ],
  },
  {
    id: 'n3',
    tugma: 'n = 3 (M: 3s, 3p, 3d)',
    formula: 'n = 3 → 3s (2) + 3p (6) + 3d (10) = 18 ē',
    tur: 'hisob',
    cfg: {
      sarlavha: '9-jadval (45-bet): n = 3 (M-qavat)',
      tenglama: '3 ta qavatcha: 3s(2) + 3p(6) + 3d(10) = 18 ē',
      qadamlar: [
        { belgi: '3s', natija: '2 ē', izoh: '1 orbital', rang: '#f472b6' },
        { belgi: '3p', natija: '6 ē', izoh: '3 orbital', rang: '#38bdf8' },
        { belgi: '3d', natija: '10 ē', izoh: '5 orbital', rang: '#fbbf24' },
      ],
      taqqosBars: [
        { nom: '3s', foiz: 11, qiymat: '2 ē', rang: '#f472b6' },
        { nom: '3p', foiz: 33, qiymat: '6 ē', rang: '#38bdf8' },
        { nom: '3d', foiz: 56, qiymat: '10 ē', rang: '#fbbf24' },
      ],
      javobBadge: 'M (n=3): 2 + 6 + 10 = 18 = 2·3²',
    },
    pastki: [
      'Qavatchalar soni = n = 3 (3s, 3p, 3d)',
      'Tarkibi: 3s(2) + 3p(6) + 3d(10)',
      'Umumiy sig\'im: 18 elektron (2·3²)',
    ],
  },
  {
    id: 'n4',
    tugma: 'n = 4 (N: 4s..4f)',
    formula: 'n = 4 → 4s(2) + 4p(6) + 4d(10) + 4f(14) = 32 ē',
    tur: 'hisob',
    cfg: {
      sarlavha: '9-jadval (45-bet): n = 4 (N-qavat)',
      tenglama: '4 ta qavatcha: 2 + 6 + 10 + 14 = 32 ē',
      qadamlar: [
        { belgi: '4s / 4p', natija: '2 + 6', izoh: 'Jami 8 ē', rang: '#38bdf8' },
        { belgi: '4d', natija: '10 ē', izoh: '5 orbital', rang: '#fbbf24' },
        { belgi: '4f', natija: '14 ē', izoh: '7 orbital', rang: '#a855f7' },
      ],
      taqqosBars: [
        { nom: '4p (6)', foiz: 19, qiymat: '6 ē', rang: '#38bdf8' },
        { nom: '4d (10)', foiz: 31, qiymat: '10 ē', rang: '#fbbf24' },
        { nom: '4f (14)', foiz: 44, qiymat: '14 ē', rang: '#a855f7' },
      ],
      javobBadge: 'N (n=4): 2 + 6 + 10 + 14 = 32 = 2·4²',
    },
    pastki: [
      'Qavatchalar soni = n = 4 (4s, 4p, 4d, 4f)',
      'Tarkibi: 2 + 6 + 10 + 14',
      'Umumiy sig\'im: 32 elektron (2·4²)',
    ],
  },
];

function KorgazmaToqqizinchiJadval() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 9-jadval: Qavatlarning qavatchalarga bo'linishi (45–46-b)"
      ikon="formula"
      variantlar={JADVAL_9_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: BOR (Z=5) VA 1–10 ELEMENTLAR KONFIGURATSIYASI (46-BET)
═══════════════════════════════════════════════════════════════ */
const KONFIG_ATOMLAR = [
  { z: 1, belgi: 'H', nom: 'Vodorod', formula: '1s¹', blok: 's-element', s1: 1, s2: 0, p2: 0, izoh: '1 ē sharsimon 1s-orbitalda joylashadi.' },
  { z: 2, belgi: 'He', nom: 'Geliy', formula: '1s²', blok: 's-element', s1: 2, s2: 0, p2: 0, izoh: '2 ē 1s-orbitalni to\'ldiradi (↑↓).' },
  { z: 3, belgi: 'Li', nom: 'Litiy', formula: '1s² 2s¹', blok: 's-element', s1: 2, s2: 1, p2: 0, izoh: '3-elektron 2s-qavatchaga tushadi.' },
  { z: 5, belgi: 'B', nom: 'Bor (darslik)', formula: '1s² 2s² 2p¹', blok: 'p-element', s1: 2, s2: 2, p2: 1, izoh: '46-b: 1s da 2, 2s da 2, 2p gantelda 1 ē.' },
  { z: 6, belgi: 'C', nom: 'Uglerod', formula: '1s² 2s² 2p²', blok: 'p-element', s1: 2, s2: 2, p2: 2, izoh: '2p dagi 2 ē bo\'sh orbitallarga tarqaladi.' },
  { z: 8, belgi: 'O', nom: 'Kislorod', formula: '1s² 2s² 2p⁴', blok: 'p-element', s1: 2, s2: 2, p2: 4, izoh: '2p da 4 ē: 1 juft va 2 toq elektron.' },
  { z: 10, belgi: 'Ne', nom: 'Neon', formula: '1s² 2s² 2p⁶', blok: 'p-element', s1: 2, s2: 2, p2: 6, izoh: '2s va 2p to\'liq to\'lgan (oktet 8 ē).' },
];

function KorgazmaBorVaKonfig() {
  const canvasRef = useRef(null);
  const [zVal, setZVal] = useState(5);
  const faol = KONFIG_ATOMLAR.find((a) => a.z === zVal) || KONFIG_ATOMLAR[3];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = KONFIG_ATOMLAR.find((a) => a.z === zVal) || KONFIG_ATOMLAR[3];
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
      ctx.fillText(`${faol.nom} (Z=${faol.z}): elektron formulasi ${faol.formula} (${faol.blok})`, 24, 34);

      const cx = w * 0.28;
      const cy = h * 0.56;

      // 1s sfera
      ctx.fillStyle = 'rgba(244, 114, 182, 0.2)';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2s sfera
      if (faol.s2 > 0) {
        ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
        ctx.strokeStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(cx, cy, 78, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // 2p gantel (gorizontal va vertikal)
      if (faol.p2 > 0) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.28)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(-52, 0, 48, 22, 0, 0, Math.PI * 2);
        ctx.ellipse(52, 0, 48, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      chizZarracha(ctx, cx, cy, 13 + Math.sin(t * 2), '#ef4444', `+${faol.z}`);

      const rx = w * 0.54;
      const rw = w * 0.42;
      const ry = 68;
      const rh = h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.formula, rx + 22, ry + 42);

      const qatorlar = [
        { nom: '1s orbital (1 ta):', cnt: faol.s1, katak: 1, rang: '#f472b6' },
        { nom: '2s orbital (1 ta):', cnt: faol.s2, katak: 1, rang: '#fbbf24' },
        { nom: '2p orbitallar (3 ta):', cnt: faol.p2, katak: 3, rang: '#38bdf8' },
      ];
      qatorlar.forEach((q, rIdx) => {
        const y0 = ry + 78 + rIdx * 48;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(q.nom, rx + 22, y0 + 20);

        for (let k = 0; k < q.katak; k++) {
          const bx = rx + 158 + k * 36;
          ctx.strokeStyle = q.rang;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, y0, 30, 28);
          let txt = '';
          if (q.cnt >= k + 1 + q.katak) txt = '↑↓';
          else if (q.cnt >= k + 1) txt = '↑';
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 14px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(txt, bx + 15, y0 + 19);
        }
      });

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.izoh, rx + 22, ry + rh - 34);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zVal]);

  return (
    <KorgazmaRamka
      sarlavha="3. Bor (Z=5) va 1–10 elementlar s/p sxemasi (46-b)"
      qisqaFormula="Bor (Z=5): 1s² 2s² 2p¹ — 1s, 2s sferalari va 2p ganteli"
      ikon="yadro"
      boshqaruv={
        <>
          {KONFIG_ATOMLAR.map((a) => (
            <button
              key={a.z}
              type="button"
              onClick={() => {
                setZVal(a.z);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                zVal === a.z
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {a.belgi} ({a.z})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Elektron formulasi: {faol.formula}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Oila turi: {faol.blok}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
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
   4-KO'RGAZMA: 2l + 1 ORBITALLAR VA 2(2l + 1) SIG'IM FORMULASI
═══════════════════════════════════════════════════════════════ */
const L_QIYMAT_VARIANTLAR = [
  {
    id: 'l2',
    tugma: 'l = 2 (d: 5 orb / 10 ē)',
    formula: 's: 1→2 • p: 3→6 • d: 5→10 • f: 7→14',
    tur: 'muvozanat',
    cfg: {
      sarlavha: 'Qavatcha sig\'imi: 2l+1 orbital va 2(2l+1) ē',
      tenglama: 'l = 2 (d-qavatcha): 5 orbital × 2 = 10 elektron',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's (l=0)', qiymat: 2, yorliq: '1 orb → 2 ē', rang: '#f472b6' },
        { nom: 'p (l=1)', qiymat: 6, yorliq: '3 orb → 6 ē', rang: '#38bdf8' },
        { nom: 'd (l=2, faol)', qiymat: 10, yorliq: '5 orb → 10 ē', rang: '#fde047' },
        { nom: 'f (l=3)', qiymat: 14, yorliq: '7 orb → 14 ē', rang: '#a855f7' },
      ],
    },
    pastki: [
      'l = 2 (d) → 2l + 1 = 5 ta orbital',
      'Maksimal sig\'im: 2 · 5 = 10 ta elektron',
      'Orbitallar qatori toq sonlar: 1, 3, 5, 7',
    ],
  },
  {
    id: 'l0',
    tugma: 'l = 0 (s: 1 orb / 2 ē)',
    formula: 'l = 0 → 2l+1 = 1 orbital → max 2 ē',
    tur: 'muvozanat',
    cfg: {
      sarlavha: 's-qavatcha (l = 0): sharsimon 1 orbital',
      tenglama: '1 orbital × 2 spin (↑↓) = 2 elektron',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's (l=0, faol)', qiymat: 2, yorliq: '1 orb → 2 ē', rang: '#fde047' },
        { nom: 'p (l=1)', qiymat: 6, yorliq: '3 orb → 6 ē', rang: '#38bdf8' },
        { nom: 'd (l=2)', qiymat: 10, yorliq: '5 orb → 10 ē', rang: '#fbbf24' },
        { nom: 'f (l=3)', qiymat: 14, yorliq: '7 orb → 14 ē', rang: '#a855f7' },
      ],
    },
    pastki: [
      'l = 0 (s) → 1 ta sferik orbital',
      'Maksimal sig\'im: 2 · 1 = 2 elektron',
      'Har pog\'onani (1s, 2s, 3s...) boshlaydi',
    ],
  },
  {
    id: 'l1',
    tugma: 'l = 1 (p: 3 orb / 6 ē)',
    formula: 'l = 1 → 2l+1 = 3 orbital → max 6 ē',
    tur: 'muvozanat',
    cfg: {
      sarlavha: 'p-qavatcha (l = 1): px, py, pz gantel orbitallari',
      tenglama: '3 orbital × 2 = 6 elektron (IIIA–VIIIA)',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's (l=0)', qiymat: 2, yorliq: '1 orb → 2 ē', rang: '#f472b6' },
        { nom: 'p (l=1, faol)', qiymat: 6, yorliq: '3 orb → 6 ē', rang: '#fde047' },
        { nom: 'd (l=2)', qiymat: 10, yorliq: '5 orb → 10 ē', rang: '#fbbf24' },
        { nom: 'f (l=3)', qiymat: 14, yorliq: '7 orb → 14 ē', rang: '#a855f7' },
      ],
    },
    pastki: [
      'l = 1 (p) → px, py, pz (3 orbital)',
      'Maksimal sig\'im: 2 · 3 = 6 ta elektron',
      '2-pog\'onadan (n ≥ 2) boshlab uchraydi',
    ],
  },
  {
    id: 'l3',
    tugma: 'l = 3 (f: 7 orb / 14 ē)',
    formula: 'l = 3 → 2l+1 = 7 orbital → max 14 ē',
    tur: 'muvozanat',
    cfg: {
      sarlavha: 'f-qavatcha (l = 3): 7 murakkab orbital',
      tenglama: '7 orbital × 2 = 14 elektron (lantanoid/aktinoid)',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's (l=0)', qiymat: 2, yorliq: '1 orb → 2 ē', rang: '#f472b6' },
        { nom: 'p (l=1)', qiymat: 6, yorliq: '3 orb → 6 ē', rang: '#38bdf8' },
        { nom: 'd (l=2)', qiymat: 10, yorliq: '5 orb → 10 ē', rang: '#fbbf24' },
        { nom: 'f (l=3, faol)', qiymat: 14, yorliq: '7 orb → 14 ē', rang: '#fde047' },
      ],
    },
    pastki: [
      'l = 3 (f) → 2·3 + 1 = 7 ta orbital',
      'Maksimal sig\'im: 2 · 7 = 14 elektron',
      '4f va 5f oilalarida 14 tadan element bor',
    ],
  },
];

function KorgazmaFormulaSigim() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Orbitallar (2l+1) va sig'im 2(2l+1)"
      ikon="grafik"
      variantlar={L_QIYMAT_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: DAVRIY SISTEMADAGI s, p, d, f BLOKLAR (14+36+40+28=118)
═══════════════════════════════════════════════════════════════ */
const BLOKLAR_VARIANTLAR = [
  {
    id: 'barchasi',
    tugma: 'Barchasi (118 ta)',
    formula: '14 ta s + 36 ta p + 40 ta d + 28 ta f = 118 ta element',
    tur: 'muvozanat',
    cfg: {
      sarlavha: 'Davriy sistemadagi 118 ta element bloklari (47-bet)',
      tenglama: 's (14) + p (36) + d (40) + f (28) = 118',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's-blok', qiymat: 14, yorliq: '14 ta', rang: '#f472b6' },
        { nom: 'p-blok', qiymat: 36, yorliq: '36 ta', rang: '#38bdf8' },
        { nom: 'd-blok', qiymat: 40, yorliq: '40 ta', rang: '#fbbf24' },
        { nom: 'f-blok', qiymat: 28, yorliq: '28 ta', rang: '#a855f7' },
      ],
    },
    pastki: [
      's (14) + p (36) = 50 ta asosiy guruhcha',
      'd (40) + f (28) = 68 ta oraliq va f-metallar',
      'Jami tasdiqlangan elementlar: 118 ta',
    ],
  },
  {
    id: 's',
    tugma: 's-elementlar (14)',
    formula: 'H, He va IA, IIA bosh guruhchalar (14 ta)',
    tur: 'hisob',
    cfg: {
      sarlavha: 's-elementlar oilasi: 14 ta element',
      tenglama: 'H, He (2) + IA (6) + IIA (6) = 14 ta s-element',
      qadamlar: [
        { belgi: '1-davr', natija: 'H, He', izoh: '2 ta element', rang: '#f472b6' },
        { belgi: 'IA–IIA', natija: '12 ta', izoh: '6 + 6 metallar', rang: '#fbbf24' },
        { belgi: 'Jami s', natija: '14 ta', izoh: '11,9% jadvaldan', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 's ulushi', foiz: 12, qiymat: '14 / 118', rang: '#f472b6' },
      ],
      javobBadge: 'Oxirgi elektroni s-qavatchaga tushadi (14 ta)',
    },
    pastki: [
      'Davrni boshlab beruvchi 1- va 2-elementlar',
      'H, He hamda ishqoriy va ishqoriy-yer metallar',
      'Jami: 14 ta s-element',
    ],
  },
  {
    id: 'p',
    tugma: 'p-elementlar (36)',
    formula: 'IIIA–VIIIA guruhchalar (2–7-davrlarda 6 tadan = 36 ta)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'p-elementlar oilasi: 36 ta element',
      tenglama: '6 ta davr (2–7) × 6 element = 36 ta p-element',
      qadamlar: [
        { belgi: 'Har davrda', natija: '6 ta', izoh: 'IIIA–VIIIA', rang: '#38bdf8' },
        { belgi: 'Davrlar', natija: '2–7-davr', izoh: '6 qator (He siz)', rang: '#fbbf24' },
        { belgi: 'Jami p', natija: '36 ta', izoh: '30,5% jadvaldan', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'p ulushi', foiz: 31, qiymat: '36 / 118', rang: '#38bdf8' },
      ],
      javobBadge: 'Barcha metallmaslar (H, He dan tashqari) va inert gazlar (36 ta)',
    },
    pastki: [
      '2–7-davr oxiridagi 6 tadan element',
      'IIIA–VIIIA guruhcha elementlari (He mustasno)',
      'Jami: 36 ta p-element',
    ],
  },
  {
    id: 'df',
    tugma: 'd (40) va f (28)',
    formula: '4 qator × 10 d-metall = 40 ta • 2 × 14 f-metall = 28 ta',
    tur: 'hisob',
    cfg: {
      sarlavha: 'd-elementlar (40) va f-elementlar (28)',
      tenglama: 's va p orasidagi 40 ta d-metall + pastdagi 28 ta f-metall',
      qadamlar: [
        { belgi: 'd-metallar', natija: '40 ta', izoh: '4–7-davrda 10 tadan', rang: '#fbbf24' },
        { belgi: 'Lantanoid', natija: '14 ta', izoh: '4f-qavatcha', rang: '#a855f7' },
        { belgi: 'Aktinoid', natija: '14 ta', izoh: '5f-qavatcha', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: 'd-elementlar', foiz: 34, qiymat: '40 ta', rang: '#fbbf24' },
        { nom: 'f-elementlar', foiz: 24, qiymat: '28 ta', rang: '#a855f7' },
      ],
      javobBadge: 'd (40) + f (28) = 68 ta metall',
    },
    pastki: [
      'Sc–Zn, Y–Cd, La–Hg, Ac–Cn: 40 ta d-element',
      '14 lantanoid + 14 aktinoid = 28 ta f-element',
      'Barchasi metallik xossasiga ega',
    ],
  },
];

function KorgazmaBloklar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Davriy sistemada s, p, d, f bloklari (47-b)"
      ikon="qidiruv"
      variantlar={BLOKLAR_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 47-BET SAVOL VA TOPSHIRIQLARI YECHIMI
═══════════════════════════════════════════════════════════════ */
const DARSLIK_10_VARIANTLAR = [
  {
    id: 's1',
    tugma: '1-savol (n=1, 2)',
    formula: '1-qavat: max 2 ē (1s²) • 2-qavat: max 8 ē (2s² 2p⁶)',
    tur: 'molekula',
    cfg: {
      sarlavha: '1-savol (47-bet): 1- va 2-qavat sig\'imi',
      tenglama: 'K(n=1): 2·1² = 2 ē • L(n=2): 2·2² = 8 ē',
      rejim: 'atom',
      qavatlar: [2, 8],
      markaz: { belgi: 'L', zaryad: '2 / 8', rang: '#38bdf8' },
      metrikalar: [
        { nom: '1-qavat (1s²)', qiymat: '2 ta ē', foiz: 25, rang: '#f472b6' },
        { nom: '2-qavat (2s² 2p⁶)', qiymat: '8 ta ē', foiz: 100, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'K (n=1)', v: '1s → 2 ē', rang: '#f472b6' },
        { k: 'L (n=2)', v: '2s + 2p → 8 ē', rang: '#38bdf8' },
      ],
    },
    pastki: [
      '1-qavat (K): max 2 ē (1s²)',
      '2-qavat (L): max 8 ē (2s² 2p⁶)',
      'Formula: N = 2n²',
    ],
  },
  {
    id: 's2',
    tugma: '2-savol (L-qavat)',
    formula: '2-qavatda 2 ta qavatcha: 2s (2 ē) va 2p (6 ē)',
    tur: 'hisob',
    cfg: {
      sarlavha: '2-savol (47-bet): Ikkinchi qavat qavatchalari',
      tenglama: 'n = 2 → 2s (max 2 ē) + 2p (max 6 ē)',
      qadamlar: [
        { belgi: '2s-qavatcha', natija: 'max 2 ē', izoh: '1 orbital', rang: '#f472b6' },
        { belgi: '2p-qavatcha', natija: 'max 6 ē', izoh: '3 orbital (x,y,z)', rang: '#38bdf8' },
        { belgi: 'Jami (L)', natija: '8 ē', izoh: '2 + 6 = 8', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '2s (25%)', foiz: 25, qiymat: '2 ē', rang: '#f472b6' },
        { nom: '2p (75%)', foiz: 75, qiymat: '6 ē', rang: '#38bdf8' },
      ],
      javobBadge: 'L-qavat: 2 ta qavatcha → 2s (2 ē) va 2p (6 ē)',
    },
    pastki: [
      '2 ta qavatcha mavjud: s va p',
      '2s da max 2 ē, 2p da max 6 ē',
      'Jami sig\'imi: 8 elektron',
    ],
  },
  {
    id: 's3',
    tugma: '3-savol (M-qavat)',
    formula: 'n = 3 (M) → 3 ta qavatcha: 3s (2), 3p (6), 3d (10)',
    tur: 'hisob',
    cfg: {
      sarlavha: '3-savol (47-bet): Uchinchi qavat qavatchalari',
      tenglama: 'n = 3 → 3s (2) + 3p (6) + 3d (10) = 18 ē',
      qadamlar: [
        { belgi: '3s', natija: '2 ē', izoh: '1 orbital', rang: '#f472b6' },
        { belgi: '3p', natija: '6 ē', izoh: '3 orbital', rang: '#38bdf8' },
        { belgi: '3d', natija: '10 ē', izoh: '5 orbital', rang: '#fbbf24' },
      ],
      taqqosBars: [
        { nom: '3s', foiz: 11, qiymat: '2 ē', rang: '#f472b6' },
        { nom: '3p', foiz: 33, qiymat: '6 ē', rang: '#38bdf8' },
        { nom: '3d', foiz: 56, qiymat: '10 ē', rang: '#fbbf24' },
      ],
      javobBadge: 'M-qavat (n=3): 3s, 3p, 3d → jami 18 ē',
    },
    pastki: [
      '3 ta qavatcha: 3s, 3p, 3d',
      'Sig\'imlari: 2, 6 va 10 elektron',
      'Jami: 2 + 6 + 10 = 18 ē',
    ],
  },
];

function KorgazmaDarslikSavollari() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 47-bet savollarining animatsion tahlili"
      ikon="uchqun"
      variantlar={DARSLIK_10_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (9-§) VA O'YINLAR (10-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'K, L, M, N qavatlarida maksimal nechtagacha ē bo\'ladi?',
    variantlar: [
      { matn: '2, 8, 18, 32 ta (N = 2n²)', togri: true },
      { matn: '1, 2, 3, 4 ta', togri: false },
      { matn: '2, 6, 10, 14 ta', togri: false },
      { matn: '8, 8, 18, 18 ta', togri: false },
    ],
    izoh: '8-jadval: K=2, L=8, M=18, N=32.',
  },
  {
    id: 't2',
    savol: 'Bitta orbitalda ko\'pi bilan nechta va qanday ē joylashadi?',
    variantlar: [
      { matn: 'Bir xil spinli 3 ta ē', togri: false },
      { matn: 'Faqat 1 ta ē', togri: false },
      { matn: 'Qarama-qarshi spinli (↑↓) 2 ē', togri: true },
      { matn: '8 ta ē', togri: false },
    ],
    izoh: '9-§: bitta orbitalda qarama-qarshi spinli 2 ē bo\'ladi.',
  },
  {
    id: 't3',
    savol: 'Vodorod elektron bulutining shakli va radiusi?',
    variantlar: [
      { matn: 'Kubik, 10 m', togri: false },
      { matn: 'Sharsimon, r = 0,53·10⁻¹⁰ m', togri: true },
      { matn: 'Gantel, 1 sm', togri: false },
      { matn: 'Tekis doira', togri: false },
    ],
    izoh: 'Vodorod elektron buluti sharsimon (r = 0,53·10⁻¹⁰ m).',
  },
  {
    id: 't4',
    savol: 'P (Z=15) va Cl (Z=17) qavat taqsimoti qaysi?',
    variantlar: [
      { matn: 'P: 2, 5, 8 va Cl: 2, 7, 8', togri: false },
      { matn: 'P: 2, 8, 7 va Cl: 2, 8, 5', togri: false },
      { matn: 'P: 2, 8, 5 va Cl: 2, 8, 8', togri: false },
      { matn: 'P: 2, 8, 5 va Cl: 2, 8, 7', togri: true },
    ],
    izoh: '3-davr: K=2, L=8, M da qolgan ē joylashadi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 's', nom: 's-elementlar (14)', tavsif: 'H, He, IA, IIA' },
    { id: 'p', nom: 'p-elementlar (36)', tavsif: 'IIIA–VIIIA (6 tadan)' },
    { id: 'df', nom: 'd / f-elementlar', tavsif: 'Oraliq (40) va f (28)' },
  ],
  topshiriqlar: [
    { nom: 'H va He', qisqa: '1s¹, 1s²', guruh: 's', izoh: '1-davr s-elementlar.' },
    { nom: 'Li, Na, K (IA)', qisqa: 'Ishqoriy metallar', guruh: 's', izoh: 'Oxirgi ē s-qavatchada.' },
    { nom: 'Mg, Ca (IIA)', qisqa: 'Ishqoriy-yer', guruh: 's', izoh: 'IIA metallar s-element.' },
    { nom: 'Bor (B, 1s² 2s² 2p¹)', qisqa: '2p boshlanadi', guruh: 'p', izoh: '46-b misoli: Bor p-element.' },
    { nom: 'C, N, O', qisqa: '2p², 2p³, 2p⁴', guruh: 'p', izoh: 'Davr oxiridagi p-blok.' },
    { nom: 'F, Cl, Ne, Ar', qisqa: 'Galogen / inert gaz', guruh: 'p', izoh: 'He dan tashqari inertlar p.' },
    { nom: 'Fe, Cu, Zn', qisqa: '4-davr 10 talik', guruh: 'df', izoh: 'Oraliq metallar — d-blok (40 ta).' },
    { nom: 'Lantanoidlar (14)', qisqa: '4f to\'lishi', guruh: 'df', izoh: 'f-elementlar oilasi.' },
    { nom: 'Aktinoidlar (14)', qisqa: '5f to\'lishi', guruh: 'df', izoh: 'f-elementlar 2-qatori.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Shakllar',
    savol: 's, p, d bulutlarining shakli va orbitallar soni?',
    variantlar: ['Hammasi kub', 's: gantel (3), p: sfera (1)', 's: sfera (1), p: gantel (3), d: 4 bargli (5)', 'p: 1, s: 5 orbital'],
    togri: 2,
    izoh: 's — 1 sferik; p — 3 gantel (px,py,pz); d — 5 orbital.',
  },
  {
    belgi: '9-jadval',
    savol: '3-energetik qavat (n = 3, M) tarkibi qanday?',
    variantlar: ['3s, 3p va 3d (3 qavatcha)', '3s va 3p', 'Faqat 3d, 3f', '3s, 3p, 3d, 3f'],
    togri: 0,
    izoh: '9-jadval va 47-b: n=3 da 3s, 3p, 3d bo\'ladi.',
  },
  {
    belgi: 'Sig\'im',
    savol: 's, p, d, f qavatchalarda maksimal nechtadan ē bo\'ladi?',
    variantlar: ['1, 3, 5, 7 ta', '4, 8, 12, 16 ta', '2, 8, 18, 32 ta', '2, 6, 10, 14 ta'],
    togri: 3,
    izoh: '2(2l+1) qoidasi bo\'yicha: s=2, p=6, d=10, f=14.',
  },
  {
    belgi: 'Bor (Z=5)',
    savol: 'Bor atomida (Z=5) elektronlar qanday joylashadi (46-b)?',
    variantlar: ['5 tasi 1s da', '1s² 2s² 2p¹ (2+2+1 ē)', '3 ta 1s va 2 ta 2s', '2 ta 1s va 3 ta 2p'],
    togri: 1,
    izoh: '46-bet: 2 ē 1s da, 2 ē 2s da, 1 ē 2p gantelida.',
  },
  {
    belgi: '118 ta',
    savol: '118 element s, p, d, f bloklarga qanday bo\'linadi (47-b)?',
    variantlar: ['28 s, 40 p, 36 d, 14 f', '14 s, 36 p, 40 d, 28 f', '10 s, 30 p, 50 d, 28 f', '20 s, 40 p, 40 d, 18 f'],
    togri: 1,
    izoh: '47-bet: 14 + 36 + 40 + 28 = 118 ta element.',
  },
  {
    belgi: '4-qavat',
    savol: 'N (n=4) pog\'onada nechta qavatcha va ē bo\'ladi?',
    variantlar: ['3 qavatcha (18 ē)', '2 qavatcha (8 ē)', '5 qavatcha (50 ē)', '4 qavatcha: 4s, 4p, 4d, 4f (32 ē)'],
    togri: 3,
    izoh: '9-jadval: 4s(2)+4p(6)+4d(10)+4f(14) = 32 ē.',
  },
  {
    belgi: 'p-orbitallar',
    savol: 'p-qavatchadagi 3 gantel orbital fazoda qanday joylashadi?',
    variantlar: ['X, Y, Z o\'qlarga perpendikulyar', 'Bir to\'g\'ri chiziqda', 'Parallel holda', 'Aylana shaklda'],
    togri: 0,
    izoh: '45-bet: px, py, pz o\'zaro perpendikulyar.',
  },
  {
    belgi: 'f-elementlar',
    savol: 'Qaysi elementlar f-oilani tashkil qiladi?',
    variantlar: ['Ishqoriy metallar', 'Galogenlar', 'Lantanoidlar (14) va aktinoidlar (14)', 'Inert gazlar'],
    togri: 2,
    izoh: '47-bet: jami 28 ta f-element mavjud.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Qavatchalar sig\'imi',
    vazifa: 'Qavatchalarni sig\'imi ORTISHI bo\'yicha joylang:',
    tartib: ['s (2 ē)', 'p (6 ē)', 'd (10 ē)', 'f (14 ē)'],
    variantlar: ['d (10 ē)', 's (2 ē)', 'f (14 ē)', 'p (6 ē)'],
  },
  {
    tur: 'Bloklar soni',
    vazifa: 'Bloklarni element soni ORTISHI bo\'yicha tartiblang:',
    tartib: ['s-blok (14)', 'f-blok (28)', 'p-blok (36)', 'd-blok (40)'],
    variantlar: ['p-blok (36)', 's-blok (14)', 'd-blok (40)', 'f-blok (28)'],
  },
  {
    tur: '4-qavat tarkibi',
    vazifa: 'n = 4 qavatchalarni l qiymati ORTISHI bo\'yicha joylang:',
    tartib: ['4s (l=0, 2 ē)', '4p (l=1, 6 ē)', '4d (l=2, 10 ē)', '4f (l=3, 14 ē)'],
    variantlar: ['4d (l=2, 10 ē)', '4s (l=0, 2 ē)', '4f (l=3, 14 ē)', '4p (l=1, 6 ē)'],
  },
  {
    tur: 'Bor konfiguratsiyasi',
    vazifa: 'Bor (Z=5) to\'lish bosqichlarini tartiblang:',
    tartib: ['1s² (2 ē, sfera)', '2s² (2 ē, sfera)', '2p¹ (1 ē, gantel)', 'p-element oilasi'],
    variantlar: ['2p¹ (1 ē, gantel)', '1s² (2 ē, sfera)', 'p-element oilasi', '2s² (2 ē, sfera)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '47-b 2-savol: 2-qavatda nechta qavatcha va max ē bor?',
    variantlar: ['1 qavatcha: 2s (8 ē)', '2 qavatcha: 2s (2) va 2p (6)', '3 qavatcha: s, p, d', '4 qavatcha'],
    togri: 1,
    izoh: 'n = 2 da 2s (2 ē) va 2p (6 ē) → 8 ē.',
  },
  {
    savol: 'd-qavatchada nechta orbital va max elektron bor?',
    variantlar: ['3 orbital, 6 ē', '7 orbital, 14 ē', '1 orbital, 2 ē', '5 orbital, 10 ē'],
    togri: 3,
    izoh: 'l = 2 → 2l+1 = 5 orbital, 2·5 = 10 ē.',
  },
  {
    savol: 'H, He, Li, Be, Na, Mg qaysi blokka kiradi?',
    variantlar: ['s-elementlarga (14 ta)', 'd-elementlarga', 'p-elementlarga', 'f-elementlarga'],
    togri: 0,
    izoh: '47-bet: H, He va IA, IIA — s-elementlar.',
  },
  {
    savol: 'Davr oxiridagi 6 element (He siz) qaysi oilaga kiradi?',
    variantlar: ['s-elementlar (14)', 'd-elementlar (40)', 'p-elementlar (36)', 'f-elementlar (28)'],
    togri: 2,
    izoh: 'IIIA–VIIIA guruhcha (6 × 6 = 36) — p-elementlar.',
  },
  {
    savol: '1-energetik qavat (n=1, K) qaysi qavatchadan iborat?',
    variantlar: ['1p (max 6 ē)', '1d (max 10 ē)', '1s (max 2 ē)', '1s va 1p'],
    togri: 2,
    izoh: 'n=1 da l=0 → faqat 1s-qavatcha.',
  },
  {
    savol: '47-b 3-savol: n=3 dagi qavatchalar ifodalanishi?',
    variantlar: ['3s, 3p, 3d', '3a, 3b, 3c', '3s va 3f', '1s, 2p, 3d'],
    togri: 0,
    izoh: 'n = 3 da 3s, 3p, 3d qavatchalari bo\'ladi.',
  },
  {
    savol: 'Nega s, p, d, f sig\'imlari 2, 6, 10, 14 ga teng?',
    variantlar: ['1 orbitalda 4 ē bor', 'Orbitallar 1,3,5,7 × 2 ē = 2,6,10,14', 'Orbitallar 2,4,6,8 ta', 'Massaga bog\'liq'],
    togri: 1,
    izoh: 'Har orbitalda qarama-qarshi spinli 2 ē (↑↓) bo\'ladi.',
  },
  {
    savol: '40 ta d-element jadvalda qayerda joylashgan?',
    variantlar: ['1–2-davrda', 'Eng pastki 2 qatorda', 'Inert gazdan keyin', 's va p blok orasida (10 tadan metall)'],
    togri: 3,
    izoh: '47-bet: 4–7-davrlarda 10 tadan oraliq d-metallar.',
  },
];

export default function S8Mavzu10() {
  const korgazmalar = [
    { nom: '1. s, p, d, f bulutlari', ikon: 'atom', komponent: <KorgazmaBulutShakllari /> },
    { nom: '2. 9-jadval (n va l)', ikon: 'formula', komponent: <KorgazmaToqqizinchiJadval /> },
    { nom: '3. Bor (Z=5) va 1s/2s/2p', ikon: 'yadro', komponent: <KorgazmaBorVaKonfig /> },
    { nom: '4. 2(2l+1) qonuni', ikon: 'grafik', komponent: <KorgazmaFormulaSigim /> },
    { nom: '5. 118 element bloklari', ikon: 'qidiruv', komponent: <KorgazmaBloklar /> },
    { nom: '6. 47-bet savollar tahlili', ikon: 'uchqun', komponent: <KorgazmaDarslikSavollari /> },
  ];

  const oyinlar = [
    {
      nom: '1. s, p, d, f bloklari',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-10"
          nom="Elementlarni s, p va d/f elektron oilalariga ajratish"
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
          key="tezkor-10"
          nom="10-§: Energetik pog'onachalar viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Qavatcha zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-10"
          nom="Qavatcha sig'imi va bloklar zanjiri"
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
          key="duel-10"
          sarlavha="10-§: Energetik pog'onachalar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="10-§"
      mavzuNom="Energetik pog'onachalar"
      oldingiRaqam="9-§"
      oldingiNom="Atom elektron qavatlarining tuzilishi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
