'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 11-PARAGRAF
// "Kichik davr elementlarining atom tuzilishi" (Darslik 48-51-betlar)
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
   1-KO'RGAZMA: 1-DAVR ELEMENTLARI — VODOROD VA GELIY (48-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaBirinchiDavr() {
  const canvasRef = useRef(null);
  const [tanlov, setTanlov] = useState('ikkalasi');

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
      ctx.fillText('1-davr (eng qisqa kichik davr): N = 2·1² = 2 tagacha elektron — H va He (11–12-rasm)', 24, 34);

      const cw = (w - 92) / 2;
      const cards = [
        {
          id: 'H',
          x: 34,
          belgi: 'H',
          nom: 'Vodorod (Z=1)',
          formula: '1s¹',
          sxema: '+1 ) 1',
          rang: '#38bdf8',
          izoh: '1 proton, K=1 toq ē (↑). Faol, H₂ hosil qiladi.',
          soni: 1,
        },
        {
          id: 'He',
          x: 34 + cw + 24,
          belgi: 'He',
          nom: 'Geliy (Z=2)',
          formula: '1s²',
          sxema: '+2 ) 2',
          rang: '#a855f7',
          izoh: '2 proton, K=2 juft ē (↑↓). Tugallangan — inert gaz.',
          soni: 2,
        },
      ];

      cards.forEach((c, idx) => {
        const faolmi = tanlov === 'ikkalasi' || tanlov === c.id;
        ctx.fillStyle = faolmi ? 'rgba(15, 23, 42, 0.92)' : 'rgba(15, 23, 42, 0.45)';
        ctx.strokeStyle = faolmi ? c.rang : '#334155';
        ctx.lineWidth = faolmi ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(c.x, 66, cw, h - 98, 16);
        ctx.fill();
        ctx.stroke();

        const ax = c.x + cw / 2;
        const ay = 148;
        ctx.fillStyle = `${c.rang}22`;
        ctx.strokeStyle = c.rang;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ax, ay, 54, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        chizZarracha(ctx, ax, ay, 15, '#ef4444', `+${idx + 1}`);
        for (let i = 0; i < c.soni; i++) {
          const ang = t * 1.4 + i * Math.PI;
          chizZarracha(ctx, ax + Math.cos(ang) * 54, ay + Math.sin(ang) * 54, 6.5, c.rang, '-');
        }

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 16px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${c.nom}  •  ${c.formula}  •  ${c.sxema}`, ax, 224);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(c.izoh, c.x + 20, 254);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlov]);

  return (
    <KorgazmaRamka
      sarlavha="1. 1-davr: Vodorod (1s¹) va Geliy (1s²) (48-b)"
      qisqaFormula="H: +1 ) 1 (1s¹) • He: +2 ) 2 (1s², inert gaz)"
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setTanlov('ikkalasi');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              tanlov === 'ikkalasi'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            H ↔ He taqqoslash
          </button>
          <button
            type="button"
            onClick={() => {
              setTanlov('H');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              tanlov === 'H'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Vodorod (1s¹)
          </button>
          <button
            type="button"
            onClick={() => {
              setTanlov('He');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              tanlov === 'He'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Geliy (1s²)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            O&apos;xshashligi: ikkalasida 1 ta K-qavat va faqat 1s qavatcha bor
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Farqi: H faol (1 toq ē), He esa tugallangan (2 juft ē — inert)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            H va He ham s-elementlar oilasiga mansub
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 10-JADVAL — 2-DAVR ELEMENTLARI (Li → Ne, 49-BET)
═══════════════════════════════════════════════════════════════ */
const IKKINCHI_DAVR = [
  { z: 3, belgi: 'Li', nom: 'Litiy', lS: 2, lP: 0, q2: 1, formula: '1s² 2s¹', oila: 's-element', rang: '#f472b6' },
  { z: 4, belgi: 'Be', nom: 'Berilliy', lS: 2, lP: 0, q2: 2, formula: '1s² 2s²', oila: 's-element', rang: '#fbbf24' },
  { z: 5, belgi: 'B', nom: 'Bor', lS: 2, lP: 1, q2: 3, formula: '1s² 2s² 2p¹', oila: 'p-element', rang: '#34d399' },
  { z: 6, belgi: 'C', nom: 'Uglerod', lS: 2, lP: 2, q2: 4, formula: '1s² 2s² 2p²', oila: 'p-element', rang: '#38bdf8' },
  { z: 7, belgi: 'N', nom: 'Azot', lS: 2, lP: 3, q2: 5, formula: '1s² 2s² 2p³', oila: 'p-element', rang: '#60a5fa' },
  { z: 8, belgi: 'O', nom: 'Kislorod', lS: 2, lP: 4, q2: 6, formula: '1s² 2s² 2p⁴', oila: 'p-element', rang: '#fb923c' },
  { z: 9, belgi: 'F', nom: 'Ftor', lS: 2, lP: 5, q2: 7, formula: '1s² 2s² 2p⁵', oila: 'p-element', rang: '#2dd4bf' },
  { z: 10, belgi: 'Ne', nom: 'Neon', lS: 2, lP: 6, q2: 8, formula: '1s² 2s² 2p⁶', oila: 'p-element (inert)', rang: '#a855f7' },
];

function KorgazmaIkkinchiDavr() {
  const canvasRef = useRef(null);
  const [zVal, setZVal] = useState(7);
  const faol = IKKINCHI_DAVR.find((e) => e.z === zVal) || IKKINCHI_DAVR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = IKKINCHI_DAVR.find((e) => e.z === zVal) || IKKINCHI_DAVR[0];
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
      ctx.fillText(`10-jadval (49-b): ${faol.nom} (${faol.belgi}, Z=${faol.z}) — +${faol.z} ) 2 ) ${faol.q2} (${faol.formula})`, 24, 34);

      const cx = w * 0.28;
      const cy = h * 0.56;
      [2, faol.q2].forEach((cnt, idx) => {
        const rad = 46 + idx * 42;
        ctx.strokeStyle = idx === 1 ? '#fde047' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = idx === 1 ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < cnt; i++) {
          const ang = t * (1.1 - idx * 0.2) + (i * Math.PI * 2) / cnt;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 5.5, idx === 1 ? faol.rang : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 18, '#ef4444', `+${faol.z}`);

      const rx = w * 0.54;
      const rw = w * 0.42;
      const ry = 68;
      const rh = h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.formula, rx + 20, ry + 38);

      const s2Val = faol.q2 >= 2 ? 2 : 1;
      const p2Val = Math.max(0, faol.q2 - 2);

      const qator = [
        { nom: '1s (K-qavat):', cnt: 2, box: 1, col: '#38bdf8' },
        { nom: '2s (L-qavat):', cnt: s2Val, box: 1, col: '#f472b6' },
        { nom: '2p (L-qavat):', cnt: p2Val, box: 3, col: faol.rang },
      ];
      qator.forEach((row, rIdx) => {
        const y0 = ry + 78 + rIdx * 48;
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(row.nom, rx + 20, y0 + 20);
        for (let k = 0; k < row.box; k++) {
          const bx = rx + 145 + k * 38;
          ctx.strokeStyle = row.col;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, y0, 32, 28);
          let txt = '';
          if (row.cnt >= k + 1 + row.box) txt = '↑↓';
          else if (row.cnt >= k + 1) txt = '↑';
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 14px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(txt, bx + 16, y0 + 19);
        }
      });

      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Oila: ${faol.oila} • 2-qavatda jami ${faol.q2} ē`, rx + 20, ry + rh - 24);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zVal]);

  return (
    <KorgazmaRamka
      sarlavha="2. 10-jadval: 2-davr (Li → Ne, 49-b)"
      qisqaFormula="2 qavat (K=2, L=1..8) • Li, Be (s) → B..Ne (p)"
      ikon="yadro"
      boshqaruv={
        <>
          {IKKINCHI_DAVR.map((el) => (
            <button
              key={el.z}
              type="button"
              onClick={() => {
                setZVal(el.z);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                zVal === el.z
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {el.belgi} ({el.z})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Formula: {faol.formula}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Qavat sxemasi: +{faol.z} ) 2 ) {faol.q2}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Turi: {faol.oila}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 11-JADVAL — 3-DAVR ELEMENTLARI VA 3d⁰ SABABI (50-BET)
═══════════════════════════════════════════════════════════════ */
const UCHINCHI_DAVR_11 = [
  { z: 11, belgi: 'Na', nom: 'Natriy', m: 1, formula: '1s² 2s² 2p⁶ 3s¹', qisqa: '+11 ) 2 ) 8 ) 1', oila: 's-element', rang: '#f472b6' },
  { z: 12, belgi: 'Mg', nom: 'Magniy', m: 2, formula: '1s² 2s² 2p⁶ 3s²', qisqa: '+12 ) 2 ) 8 ) 2', oila: 's-element', rang: '#fbbf24' },
  { z: 13, belgi: 'Al', nom: 'Alyuminiy', m: 3, formula: '1s² 2s² 2p⁶ 3s² 3p¹', qisqa: '+13 ) 2 ) 8 ) 3', oila: 'p-element', rang: '#34d399' },
  { z: 14, belgi: 'Si', nom: 'Kremniy', m: 4, formula: '1s² 2s² 2p⁶ 3s² 3p²', qisqa: '+14 ) 2 ) 8 ) 4', oila: 'p-element', rang: '#38bdf8' },
  { z: 15, belgi: 'P', nom: 'Fosfor', m: 5, formula: '1s² 2s² 2p⁶ 3s² 3p³', qisqa: '+15 ) 2 ) 8 ) 5', oila: 'p-element', rang: '#60a5fa' },
  { z: 16, belgi: 'S', nom: 'Oltingugurt', m: 6, formula: '1s² 2s² 2p⁶ 3s² 3p⁴', qisqa: '+16 ) 2 ) 8 ) 6', oila: 'p-element', rang: '#facc15' },
  { z: 17, belgi: 'Cl', nom: 'Xlor', m: 7, formula: '1s² 2s² 2p⁶ 3s² 3p⁵', qisqa: '+17 ) 2 ) 8 ) 7', oila: 'p-element', rang: '#2dd4bf' },
  { z: 18, belgi: 'Ar', nom: 'Argon', m: 8, formula: '1s² 2s² 2p⁶ 3s² 3p⁶', qisqa: '+18 ) 2 ) 8 ) 8', oila: 'p-element (inert)', rang: '#a855f7' },
];

function KorgazmaUchinchiDavr() {
  const canvasRef = useRef(null);
  const [zVal, setZVal] = useState(17);
  const faol = UCHINCHI_DAVR_11.find((e) => e.z === zVal) || UCHINCHI_DAVR_11[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = UCHINCHI_DAVR_11.find((e) => e.z === zVal) || UCHINCHI_DAVR_11[0];
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
      ctx.fillText(`11-jadval (50-b): ${faol.nom} (${faol.belgi}) — ${faol.qisqa} • 3d⁰ bo'sh!`, 24, 34);

      const cx = w * 0.28;
      const cy = h * 0.56;
      [2, 8, faol.m].forEach((cnt, idx) => {
        const rad = 36 + idx * 28;
        ctx.strokeStyle = idx === 2 ? '#fde047' : 'rgba(56, 189, 248, 0.42)';
        ctx.lineWidth = idx === 2 ? 2.5 : 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < cnt; i++) {
          const ang = t * (1.0 - idx * 0.18) + (i * Math.PI * 2) / cnt;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 5, idx === 2 ? faol.rang : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 16, '#ef4444', `+${faol.z}`);

      const rx = w * 0.53;
      const rw = w * 0.43;
      const ry = 68;
      const rh = h - 100;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${faol.formula} 3d⁰`, rx + 20, ry + 36);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText('3-qavat tashqi bo\'lganda max 8 ē sig\'adi (3d⁰ bo\'sh).', rx + 20, ry + 76);

      const s3 = faol.m >= 2 ? 2 : 1;
      const p3 = Math.max(0, faol.m - 2);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.fillText(`M-qavat: 3s${s3} 3p${p3} 3d⁰ (${faol.oila})`, rx + 20, ry + rh - 30);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zVal]);

  return (
    <KorgazmaRamka
      sarlavha="3. 11-jadval: 3-davr va 3d⁰ sababi (49–50-b)"
      qisqaFormula="3-qavat tashqi bo'lganda max 8 ē sig'adi → 3d⁰ bo'sh"
      ikon="formula"
      boshqaruv={
        <>
          {UCHINCHI_DAVR_11.map((el) => (
            <button
              key={el.z}
              type="button"
              onClick={() => {
                setZVal(el.z);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                zVal === el.z
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {el.belgi} ({el.z})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Sxema: {faol.qisqa}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Formula: {faol.formula} 3d⁰
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Na, Mg — s-element; Al..Ar — p-elementlar
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: KICHIK DAVRLARDA s VA p OILALARI (50-BET)
═══════════════════════════════════════════════════════════════ */
const SP_OILALAR_VARIANTLAR = [
  {
    id: 'barchasi',
    tugma: 'Barcha kichik davrlar (18)',
    formula: 's: H, He, Li, Be, Na, Mg (6 ta) • p: B..Ne, Al..Ar (12 ta)',
    tur: 'muvozanat',
    cfg: {
      sarlavha: '1–3-davrlarda 6 ta s va 12 ta p element (50-bet)',
      tenglama: '1-davr (2s) + 2-davr (2s + 6p) + 3-davr (2s + 6p) = 18 ta',
      turi: 'ustunlar',
      ustunlar: [
        { nom: '1-davr (s)', qiymat: 2, yorliq: '2 ta (H,He)', rang: '#f472b6' },
        { nom: '2-davr (s)', qiymat: 2, yorliq: '2 ta (Li,Be)', rang: '#f472b6' },
        { nom: '2-davr (p)', qiymat: 6, yorliq: '6 ta (B..Ne)', rang: '#38bdf8' },
        { nom: '3-davr (s)', qiymat: 2, yorliq: '2 ta (Na,Mg)', rang: '#f472b6' },
        { nom: '3-davr (p)', qiymat: 6, yorliq: '6 ta (Al..Ar)', rang: '#38bdf8' },
      ],
    },
    pastki: [
      's-elementlar: H, He, Li, Be, Na, Mg (6 ta)',
      'p-elementlar: B..Ne (6) + Al..Ar (6) = 12 ta',
      'Kichik davrlarda d va f elementlar yo\'q',
    ],
  },
  {
    id: 'd1',
    tugma: '1-davr (2 ta)',
    formula: 'H (1s¹), He (1s²) — faqat s-elementlar',
    tur: 'molekula',
    cfg: {
      sarlavha: '1-davr: H va He (1 ta K-qavat)',
      tenglama: 'H: 1s¹ • He: 1s² → faqat 2 ta s-element',
      rejim: 'atom',
      qavatlar: [2],
      markaz: { belgi: 'He', zaryad: '+2', rang: '#a855f7' },
      metrikalar: [
        { nom: 's-elementlar', qiymat: 'H, He (2 ta)', foiz: 100, rang: '#f472b6' },
        { nom: 'p-elementlar', qiymat: '0 ta', foiz: 5, rang: '#64748b' },
      ],
      belgilar: [
        { k: 'K-qavat', v: 'Max 2 ē (1s²)', rang: '#f472b6' },
        { k: 'Oila', v: 'Faqat s-blok', rang: '#a855f7' },
      ],
    },
    pastki: [
      '1-davrda atigi 2 ta s-element bor',
      '1s-qavatcha bilan cheklangan',
      'He inert gaz bilan tugallanadi',
    ],
  },
  {
    id: 'd2',
    tugma: '2-davr (8 ta)',
    formula: '2s: Li, Be (2 ta) • 2p: B, C, N, O, F, Ne (6 ta)',
    tur: 'hisob',
    cfg: {
      sarlavha: '2-davr elementlari taqsimoti (8 ta)',
      tenglama: 'Li, Be (2s¹⁻²) + B..Ne (2p¹⁻⁶) = 8 ta element',
      qadamlar: [
        { belgi: '2s-blok', natija: 'Li, Be', izoh: '2 ta metall', rang: '#f472b6' },
        { belgi: '2p-blok', natija: 'B..Ne', izoh: '6 ta element', rang: '#38bdf8' },
        { belgi: 'Jami', natija: '8 ta', izoh: 'K=2, L=1..8', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 's (2 ta)', foiz: 25, qiymat: 'Li, Be', rang: '#f472b6' },
        { nom: 'p (6 ta)', foiz: 75, qiymat: 'B..Ne', rang: '#38bdf8' },
      ],
      javobBadge: '2-davr: 2 ta s + 6 ta p = 8 element (2 qavat)',
    },
    pastki: [
      's-elementlar: Li, Be (IA, IIA)',
      'p-elementlar: B, C, N, O, F, Ne',
      'Barchasida 2 ta qavat (K, L) bor',
    ],
  },
  {
    id: 'd3',
    tugma: '3-davr (8 ta)',
    formula: '3s: Na, Mg (2 ta) • 3p: Al, Si, P, S, Cl, Ar (6 ta)',
    tur: 'hisob',
    cfg: {
      sarlavha: '3-davr elementlari taqsimoti (8 ta)',
      tenglama: 'Na, Mg (3s¹⁻²) + Al..Ar (3p¹⁻⁶ 3d⁰) = 8 ta element',
      qadamlar: [
        { belgi: '3s-blok', natija: 'Na, Mg', izoh: '2 ta metall', rang: '#f472b6' },
        { belgi: '3p-blok', natija: 'Al..Ar', izoh: '6 ta element', rang: '#38bdf8' },
        { belgi: '3d⁰', natija: 'Bo\'sh', izoh: '4s dan keyin to\'ladi', rang: '#fbbf24' },
      ],
      taqqosBars: [
        { nom: 's (2 ta)', foiz: 25, qiymat: 'Na, Mg', rang: '#f472b6' },
        { nom: 'p (6 ta)', foiz: 75, qiymat: 'Al..Ar', rang: '#38bdf8' },
      ],
      javobBadge: '3-davr: 2 ta s + 6 ta p = 8 element (3d⁰ bo\'sh)',
    },
    pastki: [
      's-elementlar: Na, Mg (3s¹⁻²)',
      'p-elementlar: Al..Ar (3p¹⁻⁶)',
      '3d-qavatcha bo\'sh qoladi',
    ],
  },
];

function KorgazmaSpOilalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Kichik davrlarda s va p oilalari (50-b)"
      ikon="qidiruv"
      variantlar={SP_OILALAR_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: 51-BET 2–3-MASHQ (Z = 5, 9, 3, 11)
═══════════════════════════════════════════════════════════════ */
const TOPSHIRIQ_2_3_VARIANTLAR = [
  {
    id: '3_11',
    tugma: 'Z=3 (Li) ↔ Z=11 (Na)',
    formula: 'Li (2, 1) vs Na (2, 8, 1) — Na ning metallik xossasi kuchli',
    tur: 'hisob',
    cfg: {
      sarlavha: '51-bet 3-topshiriq: Li (Z=3) vs Na (Z=11)',
      tenglama: 'Li: 1s² 2s¹ (2 qavat) < Na: 1s² 2s² 2p⁶ 3s¹ (3 qavat)',
      qadamlar: [
        { belgi: 'Li (+3)', natija: '2, 1', izoh: '2 qavat (radius kichik)', rang: '#fbbf24' },
        { belgi: 'Na (+11)', natija: '2, 8, 1', izoh: '3 qavat (radius katta)', rang: '#f472b6' },
        { belgi: 'Natija', natija: 'Na faolroq', izoh: 'Tashqi ē oson beriladi', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Li metallik', foiz: 55, qiymat: '2 qavat', rang: '#fbbf24' },
        { nom: 'Na metallik', foiz: 88, qiymat: '3 qavat', rang: '#f472b6' },
      ],
      javobBadge: 'Na da qavat va radius katta → metallik xossasi Li dan kuchli',
    },
    pastki: [
      'Li: 1s² 2s¹ (2 qavat)',
      'Na: 1s² 2s² 2p⁶ 3s¹ (3 qavat)',
      'Na elektronni oson beradi — faolroq metall',
    ],
  },
  {
    id: '5',
    tugma: 'Z = 5 (Bor)',
    formula: 'B (Z=5): +5 ) 2 ) 3 • 1s² 2s² 2p¹',
    tur: 'molekula',
    cfg: {
      sarlavha: '51-bet 2-topshiriq: Bor (Z = 5)',
      tenglama: '1s² 2s² 2p¹ → 2-davr, IIIA guruh (p-element)',
      rejim: 'atom',
      qavatlar: [2, 3],
      markaz: { belgi: 'B', zaryad: '+5', rang: '#34d399' },
      metrikalar: [
        { nom: 'K-qavat (1s²)', qiymat: '2 ē', foiz: 40, rang: '#38bdf8' },
        { nom: 'L-qavat (2s² 2p¹)', qiymat: '3 ē', foiz: 60, rang: '#34d399' },
      ],
      belgilar: [
        { k: 'O\'rni', v: '2-davr, IIIA', rang: '#34d399' },
        { k: 'Oila', v: 'p-element', rang: '#38bdf8' },
      ],
    },
    pastki: [
      'Qavat sxemasi: +5 ) 2 ) 3',
      'Formula: 1s² 2s² 2p¹',
      '2-davr, IIIA guruh p-elementi',
    ],
  },
  {
    id: '9',
    tugma: 'Z = 9 (Ftor)',
    formula: 'F (Z=9): +9 ) 2 ) 7 • 1s² 2s² 2p⁵',
    tur: 'molekula',
    cfg: {
      sarlavha: '51-bet 2-topshiriq: Ftor (Z = 9)',
      tenglama: '1s² 2s² 2p⁵ → 2-davr, VIIA guruh (eng faol metallmas)',
      rejim: 'atom',
      qavatlar: [2, 7],
      markaz: { belgi: 'F', zaryad: '+9', rang: '#2dd4bf' },
      metrikalar: [
        { nom: 'Tashqi L-qavat', qiymat: '7 ē (1 ē yetmaydi)', foiz: 88, rang: '#2dd4bf' },
        { nom: 'Elektrmanfiylik', qiymat: 'Eng yuqori (3,98)', foiz: 99, rang: '#f472b6' },
      ],
      belgilar: [
        { k: 'O\'rni', v: '2-davr, VIIA', rang: '#2dd4bf' },
        { k: 'Oila', v: 'p-element (galogen)', rang: '#38bdf8' },
      ],
    },
    pastki: [
      'Qavat sxemasi: +9 ) 2 ) 7',
      'Formula: 1s² 2s² 2p⁵',
      '2-davr, VIIA guruh p-elementi',
    ],
  },
];

function KorgazmaTopshiriqIkkiUch() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 51-bet topshiriqlari: Z = 5, 9, 3 va 11"
      ikon="uchqun"
      variantlar={TOPSHIRIQ_2_3_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 4-MASHQ (51-BET) — D(H₂) = 22 YUQORI OKSID
═══════════════════════════════════════════════════════════════ */
const MASALA_TORT_VARIANTLAR = [
  {
    id: 'CO2',
    tugma: 'CO₂ (D=22 ✓)',
    formula: 'M = 22 · 2 = 44 g/mol → CO₂ (12 + 32 = 44) → C (Z=6)',
    tur: 'hisob',
    cfg: {
      sarlavha: '4-masala (51-bet): D(H₂) = 22 bo\'lgan yuqori oksid',
      tenglama: 'M(EO₂) = 22·2 = 44 → Ar(E) = 44 − 32 = 12 → Uglerod (C)',
      qadamlar: [
        { belgi: '1-qadam', natija: 'M = 44', izoh: '22 · M(H₂) = 44', rang: '#38bdf8' },
        { belgi: '2-qadam', natija: 'Ar = 12', izoh: '44 − 2·16(O) = 12', rang: '#fbbf24' },
        { belgi: '3-qadam', natija: 'Uglerod (C)', izoh: '1s² 2s² 2p² (IVA)', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'C ulushi (12)', foiz: 27, qiymat: '27,3%', rang: '#fbbf24' },
        { nom: '2O ulushi (32)', foiz: 73, qiymat: '72,7%', rang: '#38bdf8' },
      ],
      javobBadge: 'To\'g\'ri javob: CO₂ → Uglerod (C, Z=6), D(H₂) = 22',
    },
    pastki: [
      'Shart: M(oksid) = 22 · 2 = 44 g/mol',
      'Yuqori oksidi: CO₂ (12 + 32 = 44)',
      'Element: Uglerod (C, Z=6)',
    ],
  },
  {
    id: 'NO2',
    tugma: 'NO₂ (D=23)',
    formula: 'M(NO₂) = 46 → D(H₂) = 23 (Azotning yuqori oksidi N₂O₅)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Tekshiruv: NO₂ ning H₂ ga nisbatan zichligi',
      tenglama: 'M(NO₂) = 14 + 32 = 46 → D(H₂) = 46 / 2 = 23 ≠ 22',
      qadamlar: [
        { belgi: 'M(NO₂)', natija: '46 g/mol', izoh: '14 + 32 = 46', rang: '#fbbf24' },
        { belgi: 'D(H₂)', natija: '23', izoh: '22 ga teng emas', rang: '#f43f5e' },
        { belgi: 'Yuqori oksid', natija: 'N₂O₅', izoh: 'M = 108 g/mol', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: 'CO₂ (D=22 ✓)', foiz: 69, qiymat: 'D = 22', rang: '#34d399' },
        { nom: 'NO₂ (D=23 ✗)', foiz: 72, qiymat: 'D = 23', rang: '#f43f5e' },
      ],
      javobBadge: 'NO₂ mos emas: D(H₂) = 23 va oraliq oksid',
    },
    pastki: [
      'M(NO₂) = 46 g/mol → D(H₂) = 23',
      'Azotning yuqori oksidi: N₂O₅ (M=108)',
      'To\'g\'ri javob: Uglerod (CO₂)',
    ],
  },
  {
    id: 'SiO2',
    tugma: 'SiO₂ (D=30)',
    formula: 'M(SiO₂) = 28 + 32 = 60 g/mol (qattiq kristall modda)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Tekshiruv: SiO₂ molar massasi',
      tenglama: 'M(SiO₂) = 28 + 32 = 60 g/mol ≠ 44 g/mol',
      qadamlar: [
        { belgi: 'M(SiO₂)', natija: '60 g/mol', izoh: '28 + 32 = 60', rang: '#fbbf24' },
        { belgi: 'Holati', natija: 'Qattiq', izoh: 'Atom panjarali', rang: '#a855f7' },
        { belgi: 'Nazariy D', natija: '30', izoh: '22 ga teng emas', rang: '#f43f5e' },
      ],
      taqqosBars: [
        { nom: 'CO₂ (M=44 ✓)', foiz: 69, qiymat: '44 g/mol', rang: '#34d399' },
        { nom: 'SiO₂ (M=60 ✗)', foiz: 94, qiymat: '60 g/mol', rang: '#fbbf24' },
      ],
      javobBadge: 'SiO₂ mos emas: M = 60 ≠ 44',
    },
    pastki: [
      'M(SiO₂) = 60 g/mol',
      'IV guruh elementi, ammo massasi 60',
      'To\'g\'ri javob: Uglerod (CO₂)',
    ],
  },
  {
    id: 'SO2',
    tugma: 'SO₂ (D=32)',
    formula: 'M(SO₂) = 64 → D(H₂) = 32 (Oltingugurtning yuqori oksidi SO₃)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Tekshiruv: SO₂ zichligi va yuqori oksidi',
      tenglama: 'M(SO₂) = 32 + 32 = 64 → D(H₂) = 32 ≠ 22',
      qadamlar: [
        { belgi: 'M(SO₂)', natija: '64 g/mol', izoh: '32 + 32 = 64', rang: '#fbbf24' },
        { belgi: 'D(H₂)', natija: '32', izoh: '22 ga teng emas', rang: '#f43f5e' },
        { belgi: 'Yuqori oksid', natija: 'SO₃', izoh: 'M = 80 g/mol', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: 'CO₂ (D=22 ✓)', foiz: 69, qiymat: 'D = 22', rang: '#34d399' },
        { nom: 'SO₂ (D=32 ✗)', foiz: 100, qiymat: 'D = 32', rang: '#f43f5e' },
      ],
      javobBadge: 'SO₂ mos emas: D(H₂) = 32 va yuqori oksidi SO₃',
    },
    pastki: [
      'M(SO₂) = 64 g/mol → D(H₂) = 32',
      'S ning yuqori oksidi SO₃ (M=80)',
      'To\'g\'ri javob: Uglerod (CO₂)',
    ],
  },
];

function KorgazmaMasalaTort() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 4-topshiriq (51-b): D(H₂) = 22 yuqori oksid"
      ikon="kolba"
      variantlar={MASALA_TORT_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (10-§) VA O'YINLAR (11-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 's, p, d, f qavatchalarda maksimal nechta ē bo\'ladi?',
    variantlar: [
      { matn: '1, 2, 3, 4 ta', togri: false },
      { matn: '2, 6, 10, 14 ta', togri: true },
      { matn: '2, 8, 18, 32 ta', togri: false },
      { matn: '4, 8, 12, 16 ta', togri: false },
    ],
    izoh: '2(2l+1) qoidasi: s=2, p=6, d=10, f=14.',
  },
  {
    id: 't2',
    savol: '9-jadvalga ko\'ra n=3 (M) qavatda nechta qavatcha bor?',
    variantlar: [
      { matn: '3 ta: 3s, 3p, 3d', togri: true },
      { matn: '2 ta: 3s, 3p', togri: false },
      { matn: '4 ta: 3s, 3p, 3d, 3f', togri: false },
      { matn: 'Faqat 1 ta: 3s', togri: false },
    ],
    izoh: 'n = 3 da 3 ta qavatcha: 3s, 3p, 3d.',
  },
  {
    id: 't3',
    savol: '118 ta element s, p, d, f bloklarga qanday bo\'linadi?',
    variantlar: [
      { matn: '28 s, 40 p, 36 d, 14 f', togri: false },
      { matn: '10 s, 30 p, 50 d, 28 f', togri: false },
      { matn: '20 s, 30 p, 40 d, 28 f', togri: false },
      { matn: '14 ta s, 36 ta p, 40 ta d, 28 ta f', togri: true },
    ],
    izoh: '47-bet: 14 + 36 + 40 + 28 = 118 element.',
  },
  {
    id: 't4',
    savol: 'Bor (Z=5) atomining elektron formulasi qaysi?',
    variantlar: [
      { matn: '1s² 2s³', togri: false },
      { matn: '1s² 2s¹ 2p²', togri: false },
      { matn: '1s² 2s² 2p¹', togri: true },
      { matn: '1s² 2p³', togri: false },
    ],
    izoh: '46-bet: 2 ē 1s da, 2 ē 2s da, 1 ē 2p da.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: '1davr', nom: '1-davr (1 qavat)', tavsif: '1s¹, 1s²' },
    { id: '2davr', nom: '2-davr (2 qavat)', tavsif: 'Li (2,1) – Ne (2,8)' },
    { id: '3davr', nom: '3-davr (3 qavat)', tavsif: 'Na (2,8,1) – Ar (2,8,8)' },
  ],
  topshiriqlar: [
    { nom: 'H (1s¹)', qisqa: '1 ē, 1 qavat', guruh: '1davr', izoh: '1-davr s-elementi.' },
    { nom: 'He (1s²)', qisqa: 'To\'liq K-qavat', guruh: '1davr', izoh: '1-davr inert gazi.' },
    { nom: 'Li (1s² 2s¹)', qisqa: '+3 ) 2 ) 1', guruh: '2davr', izoh: '2-davr s-elementi.' },
    { nom: 'N (1s² 2s² 2p³)', qisqa: '+7 ) 2 ) 5', guruh: '2davr', izoh: '2-davr p-elementi.' },
    { nom: 'F (1s² 2s² 2p⁵)', qisqa: '+9 ) 2 ) 7', guruh: '2davr', izoh: '2-davr VIIA galogen.' },
    { nom: 'Ne (1s² 2s² 2p⁶)', qisqa: '+10 ) 2 ) 8', guruh: '2davr', izoh: '2-davr inert gazi.' },
    { nom: 'Na (...3s¹)', qisqa: '+11 ) 2 ) 8 ) 1', guruh: '3davr', izoh: '3-davr s-elementi.' },
    { nom: 'P (...3s² 3p³)', qisqa: '+15 ) 2 ) 8 ) 5', guruh: '3davr', izoh: '3-davr p-element, 3d⁰ bo\'sh.' },
    { nom: 'Ar (...3s² 3p⁶)', qisqa: '+18 ) 2 ) 8 ) 8', guruh: '3davr', izoh: '3-davr inert gazi, 3d⁰.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '3d⁰ sababi',
    savol: 'Nega 3-davr elementlarida 3d qavatcha bo\'sh qoladi?',
    variantlar: ['3-qavatda d-qavatcha yo\'q', '3-davrda faqat metallar bor', '3-qavat tashqi bo\'lganda max 8 ē sig\'adi', 'K-qavat to\'lmagan'],
    togri: 2,
    izoh: '50-bet: tashqi qavat ko\'pi bilan 8 ē oladi → 3d⁰.',
  },
  {
    belgi: 's-elementlar',
    savol: '2- va 3-davrlarda qaysi elementlar s-elementdir?',
    variantlar: ['Li, Be va Na, Mg (ilk 2 tadan)', 'B, C va Al, Si', 'F, Ne va Cl, Ar', 'O, F va S, Cl'],
    togri: 0,
    izoh: '50-bet: davrning dastlabki 2 elementi s-element.',
  },
  {
    belgi: '10-jadval',
    savol: 'Kislorod (O, Z=8) elektron formulasi qaysi?',
    variantlar: ['1s² 2s² 2p⁶', '1s² 2s² 2p²', '1s² 2s² 2p⁵', '1s² 2s² 2p⁴'],
    togri: 3,
    izoh: 'Z = 8 → 2 + 2 + 4 = 8 → 1s² 2s² 2p⁴.',
  },
  {
    belgi: '11-jadval',
    savol: 'Si (Z=14) va S (Z=16) ning 3-qavat elektronlari?',
    variantlar: ['Si: 3s² 3p⁴; S: 3s² 3p²', 'Si: 3s² 3p² 3d⁰; S: 3s² 3p⁴ 3d⁰', 'Si: 3s² 3p⁶; S: 3s² 3p⁵', 'Si: 3s¹ 3p³; S: 3s¹ 3p⁵'],
    togri: 1,
    izoh: '11-jadval: Si (...3s² 3p² 3d⁰), S (...3s² 3p⁴ 3d⁰).',
  },
  {
    belgi: '51-b 3-savol',
    savol: 'Z=3 (Li) va Z=11 (Na) dan qaysisida metallik kuchli?',
    variantlar: ['Litiyda (yengil)', 'Natriyda (3 qavat, radius katta)', 'Bir xil', 'Yo\'q'],
    togri: 1,
    izoh: 'Na (2,8,1) da radius katta — elektron oson beriladi.',
  },
  {
    belgi: '51-b 4-savol',
    savol: 'Yuqori oksidining D(H₂) = 22 bo\'lgan element?',
    variantlar: ['Oltingugurt (SO₂)', 'Azot (N₂O)', 'Kremniy (SiO₂)', 'Uglerod (CO₂: M = 44)'],
    togri: 3,
    izoh: 'M = 22 · 2 = 44 → CO₂ (12 + 32) → Uglerod.',
  },
  {
    belgi: 'p-elementlar',
    savol: '2- va 3-davrlarda qaysilar p-elementlar?',
    variantlar: ['B–Ne va Al–Ar', 'H–He', 'Li–Be va Na–Mg', 'Faqat F va Cl'],
    togri: 0,
    izoh: '50-bet: B..Ne (6 ta) va Al..Ar (6 ta).',
  },
  {
    belgi: 'Argon',
    savol: 'Argon (+18) formulasining oxiri qanday tugaydi?',
    variantlar: ['...3s² 3p⁵', '...3s² 3d⁸', '...3s² 3p⁶ 3d⁰', '...2s² 2p⁶'],
    togri: 2,
    izoh: '11-jadval: Ar (+18 ) 2 ) 8 ) 8) — ...3s² 3p⁶ 3d⁰.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '2-davr to\'lishi',
    vazifa: '2-davrni elektron soni ORTISHI bo\'yicha joylang:',
    tartib: ['Li (1s² 2s¹)', 'B (1s² 2s² 2p¹)', 'N (1s² 2s² 2p³)', 'Ne (1s² 2s² 2p⁶)'],
    variantlar: ['N (1s² 2s² 2p³)', 'Li (1s² 2s¹)', 'Ne (1s² 2s² 2p⁶)', 'B (1s² 2s² 2p¹)'],
  },
  {
    tur: '3-davr (11-jadval)',
    vazifa: '3-davrni M-qavat elektronlari ORTISHI bo\'yicha joylang:',
    tartib: ['Na (3s¹)', 'Al (3s² 3p¹)', 'S (3s² 3p⁴)', 'Ar (3s² 3p⁶)'],
    variantlar: ['S (3s² 3p⁴)', 'Na (3s¹)', 'Ar (3s² 3p⁶)', 'Al (3s² 3p¹)'],
  },
  {
    tur: '4-masala yechimi',
    vazifa: 'D(H₂)=22 yuqori oksidni topish bosqichlari:',
    tartib: ['D(H₂) = 22', 'M(oksid) = 44', '44 − 32(O₂) = 12', 'Uglerod (CO₂)'],
    variantlar: ['44 − 32(O₂) = 12', 'D(H₂) = 22', 'Uglerod (CO₂)', 'M(oksid) = 44'],
  },
  {
    tur: 'Tashqi qavat 1→7 ē',
    vazifa: 'Tashqi elektronlar soni ORTISHI bo\'yicha joylang:',
    tartib: ['H (1 ē)', 'Be (2 ē)', 'C (4 ē)', 'Cl (7 ē)'],
    variantlar: ['C (4 ē)', 'H (1 ē)', 'Cl (7 ē)', 'Be (2 ē)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'H (Z=1) va He (Z=2) o\'rtasidagi asosiy farq?',
    variantlar: ['H da 2 qavat, He da 1', 'H 1s¹ faol; He 1s² to\'liq (inert)', 'He metall', 'Ikkisi 2-davrda'],
    togri: 1,
    izoh: 'H (1s¹) faol, He (1s²) K-qavati to\'liq inert gaz.',
  },
  {
    savol: 'Ftor (Z=9) formulasi va tashqi ē soni?',
    variantlar: ['1s² 2s² 2p⁴ (6 ē)', '1s² 2s² 2p⁶ (8 ē)', '1s² 2s² 2p³ (5 ē)', '1s² 2s² 2p⁵ (7 ē)'],
    togri: 3,
    izoh: '10-jadval: F = 1s² 2s² 2p⁵ (tashqisida 7 ē).',
  },
  {
    savol: 'Al (+13) va Cl (+17) qavat sxemasi qaysi?',
    variantlar: ['Al: 2, 8, 3 va Cl: 2, 8, 7', 'Al: 2, 8, 5 va Cl: 2, 8, 3', 'Al: 2, 3, 8 va Cl: 2, 7, 8', 'Al: 2, 8, 1 va Cl: 2, 8, 8'],
    togri: 0,
    izoh: '11-jadval: Al (+13 ) 2,8,3), Cl (+17 ) 2,8,7).',
  },
  {
    savol: '1-, 2-, 3-davrlarda nechta qavat bor?',
    variantlar: ['Hammasi 1 ta', 'Hammasi 4 ta', '1-davr 1, 2-davr 2, 3-davr 3 qavat', '3, 4, 5 ta'],
    togri: 2,
    izoh: 'Energetik pog\'ona soni davr raqamiga teng.',
  },
  {
    savol: 'Magniy (Z=12) qaysi oilaga kiradi?',
    variantlar: ['p-element', 'd-element', 's-element (1s² 2s² 2p⁶ 3s²)', 'f-element'],
    togri: 2,
    izoh: '3-davrning dastlabki 2 elementi Na, Mg — s-element.',
  },
  {
    savol: '2-davrda nechta s va nechta p element bor?',
    variantlar: ['2 ta s (Li, Be) va 6 ta p (B–Ne)', '6 ta s, 2 ta p', '4 ta s, 4 ta p', 'Hammasi p'],
    togri: 0,
    izoh: 'Li, Be (2s¹⁻²) — 2s; B..Ne (2p¹⁻⁶) — 6p.',
  },
  {
    savol: 'Azot (Z=7) da 2p-qavatchada nechta ē bor?',
    variantlar: ['1 ta', '3 ta (1s² 2s² 2p³)', '2 ta', '5 ta'],
    togri: 1,
    izoh: '10-jadval: N — 1s² 2s² 2p³.',
  },
  {
    savol: 'Ar da 3-qavatda nega 8 ē dan ortiq emas?',
    variantlar: ['Proton yetmaydi', '3s va 3p yo\'q', '3d da 1 ē bor', '3-qavat tashqi bo\'lgani uchun (max 8 ē → 3d⁰)'],
    togri: 3,
    izoh: '49-bet: tashqi qavat 8 ē bilan cheklanadi.',
  },
];

export default function S8Mavzu11() {
  const korgazmalar = [
    { nom: '1. 1-davr: H va He', ikon: 'atom', komponent: <KorgazmaBirinchiDavr /> },
    { nom: '2. 10-jadval: 2-davr', ikon: 'yadro', komponent: <KorgazmaIkkinchiDavr /> },
    { nom: '3. 11-jadval: 3-davr', ikon: 'formula', komponent: <KorgazmaUchinchiDavr /> },
    { nom: '4. s- va p-oilalar', ikon: 'qidiruv', komponent: <KorgazmaSpOilalar /> },
    { nom: '5. Z = 5, 9, 3, 11 tahlili', ikon: 'uchqun', komponent: <KorgazmaTopshiriqIkkiUch /> },
    { nom: '6. 4-masala (D=22)', ikon: 'kolba', komponent: <KorgazmaMasalaTort /> },
  ];

  const oyinlar = [
    {
      nom: '1. Davrlarga ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-11"
          nom="Kichik davr elementlarini qavat soni bo'yicha ajratish"
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
          key="tezkor-11"
          nom="11-§: Kichik davr elementlari viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Konfiguratsiya zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-11"
          nom="Elektron formulalar va masalalar zanjiri"
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
          key="duel-11"
          sarlavha="11-§: Kichik davr elementlari dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="11-§"
      mavzuNom="Kichik davr elementlarining atom tuzilishi"
      oldingiRaqam="10-§"
      oldingiNom="Energetik pog'onachalar"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
