'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 14-PARAGRAF
// "Kimyoviy elementlarning nisbiy elektromanfiyligi" (Darslik 63-66-betlar)
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
   1-KO'RGAZMA: OKTET VA DUPLET BARQARORLIKKA INTILISH (63-BET)
═══════════════════════════════════════════════════════════════ */
const BARQARORLIK_TURI = {
  metall: {
    nom: 'Metall atomi (Na → Na⁺)',
    sarlavha: 'Natriy (+11 Na): tashqi 3s¹ elektronni berib Ne (2, 8) qobig\'iga o\'tadi',
    chapQavat: [2, 8, 1],
    ongQavat: [2, 8],
    belgiChap: 'Na⁰ (+11)',
    belgiOng: 'Na⁺ (2, 8)',
    tenglama: 'Na (1s² 2s² 2p⁶ 3s¹)  - 1 ē  →  Na⁺ (1s² 2s² 2p⁶)',
    izoh: 'Metallar katta radius tufayli tashqi elektronini oson beradi.',
    rang: '#f472b6',
  },
  metalmas: {
    nom: 'Metalmas atomi (F → F⁻)',
    sarlavha: 'Ftor (+9 F): tashqi 7 ē ga 1 ē qo\'shib barqaror oktet (2, 8) oladi',
    chapQavat: [2, 7],
    ongQavat: [2, 8],
    belgiChap: 'F⁰ (+9)',
    belgiOng: 'F⁻ (2, 8)',
    tenglama: 'F (1s² 2s² 2p⁵)  + 1 ē  →  F⁻ (1s² 2s² 2p⁶)',
    izoh: 'Metalmaslar oktetga yetishmagan 1–3 ta elektronni biriktirib oladi.',
    rang: '#34d399',
  },
  inert: {
    nom: 'Inert gaz (Ne va He)',
    sarlavha: 'Inert gazlar tayyor duplet (He: 2 ē) yoki oktetga (Ne: 8 ē) ega',
    chapQavat: [2],
    ongQavat: [2, 8],
    belgiChap: 'He (+2: 2)',
    belgiOng: 'Ne (+10: 2, 8)',
    tenglama: 'He (1s² — duplet)   |   Ne (2s² 2p⁶ — oktet)   |   Ar (3s² 3p⁶)',
    izoh: 'Reaksiyada yadro o\'zgarmaydi; faqat tashqi elektronlar almashinadi.',
    rang: '#a855f7',
  },
};

function KorgazmaOktetBarqarorlik() {
  const canvasRef = useRef(null);
  const [holat, setHolat] = useState('metall');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = BARQARORLIK_TURI[holat];
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
      ctx.fillText(faol.sarlavha, 24, 34);

      const chizAtom = (cx, cy, qavatlar, label, color) => {
        qavatlar.forEach((cnt, idx) => {
          const rad = 28 + idx * 24;
          ctx.strokeStyle = idx === qavatlar.length - 1 ? color : 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = idx === qavatlar.length - 1 ? 2.4 : 1.3;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();

          for (let i = 0; i < cnt; i++) {
            const ang = t * (0.9 - idx * 0.15) + (i * Math.PI * 2) / cnt;
            chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4, idx === qavatlar.length - 1 ? color : '#38bdf8', '');
          }
        });
        chizZarracha(ctx, cx, cy, 16, '#ef4444', '');
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, cx, cy + 106);
      };

      chizAtom(w * 0.24, h * 0.44, faol.chapQavat, faol.belgiChap, faol.rang);
      chizAtom(w * 0.76, h * 0.44, faol.ongQavat, faol.belgiOng, '#38bdf8');

      // O'rtadagi strelka va o'tish
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(holat === 'inert' ? 'Barqaror qobiqlar' : holat === 'metall' ? '- 1 ē  →' : '+ 1 ē  →', w * 0.50, h * 0.44);

      // Pastki izoh
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = faol.rang;
      ctx.beginPath();
      ctx.roundRect(28, h - 102, w - 56, 76, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.tenglama, w / 2, h - 74);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.izoh, w / 2, h - 46, w - 88);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [holat]);

  return (
    <KorgazmaRamka
      sarlavha="1. Atomlarning oktet (8 ē) va duplet (2 ē) barqarorligi (63-b)"
      qisqaFormula="Yadro o'zgarmaydi • Tashqi 2 ē (duplet) yoki 8 ē (oktet) barqaror holat"
      ikon="atom"
      boshqaruv={
        <>
          {Object.entries(BARQARORLIK_TURI).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setHolat(k);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                holat === k
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {v.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Metall atomi elektron beradi (Na → Na⁺)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Metalmas atomi elektron oladi (F → F⁻)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-purple-300">
            Asosiy guruh: tashqi; Yonaki: tashqi + oldingi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: ELEKTROMANFIYLIK TA'RIFI VA ELEKTRON TORTISH KUCHI (64-BET)
═══════════════════════════════════════════════════════════════ */
const TORTISH_JUFTLIKLAR = [
  { id: 'HH', a: 'H', emA: 2.20, b: 'H', emB: 2.20, izoh: 'EM teng (ΔEM = 0): umumiy elektron juft qoq o\'rtada turadi.' },
  { id: 'HCl', a: 'H', emA: 2.20, b: 'Cl', emB: 3.16, izoh: 'Cl (3,16) > H (2,20): elektron juft Cl tomonga siljiydi.' },
  { id: 'CO', a: 'C', emA: 2.55, b: 'O', emB: 3.44, izoh: 'O (3,44) > C (2,55): elektron juft Kislorod tomonga siljiydi.' },
  { id: 'NaF', a: 'Na', emA: 0.93, b: 'F', emB: 4.0, izoh: 'Keskin farq (ΔEM = 3,07): F elektronni tortib oladi (Na⁺F⁻).' },
];

function KorgazmaEMTarifi() {
  const canvasRef = useRef(null);
  const [juftId, setJuftId] = useState('HCl');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = TORTISH_JUFTLIKLAR.find((j) => j.id === juftId) || TORTISH_JUFTLIKLAR[1];
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
      ctx.fillText(`Elektromanfiylik — bog'dagi elektron juftni o'ziga tortish qobiliyati (${faol.a} — ${faol.b})`, 24, 34);

      const ax = w * 0.25;
      const bx = w * 0.75;
      const cy = h * 0.46;

      // Elektron juft joylashuvi EM nisbatiga qarab
      const diff = faol.emB - faol.emA;
      const shift = Math.min(0.40, diff * 0.13);
      const ex = w * (0.50 + shift) + Math.sin(t * 2) * 3;

      // Tortish chizig'i
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ax, cy);
      ctx.lineTo(bx, cy);
      ctx.stroke();

      // Elektron buluti
      ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
      ctx.beginPath();
      ctx.ellipse(ex, cy, 48, 28, 0, 0, Math.PI * 2);
      ctx.fill();

      chizZarracha(ctx, ex, cy - 11, 7, '#fde047', 'e⁻');
      chizZarracha(ctx, ex, cy + 11, 7, '#fde047', 'e⁻');

      // Atomlar
      chizZarracha(ctx, ax, cy, 34, '#38bdf8', faol.a);
      chizZarracha(ctx, bx, cy, 38 + diff * 3, diff > 0 ? '#f472b6' : '#38bdf8', faol.b);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`NEM(${faol.a}) = ${faol.emA}`, ax, cy + 62);
      ctx.fillText(`NEM(${faol.b}) = ${faol.emB}`, bx, cy + 62);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`ΔEM = ${diff.toFixed(2)}`, w / 2, cy - 52);

      // Pastki quti
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(28, h - 88, w - 56, 62, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.izoh, w / 2, h - 52, w - 88);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [juftId]);

  return (
    <KorgazmaRamka
      sarlavha="2. Elektromanfiylik (EM) va juft siljishi (64-b)"
      qisqaFormula="EM — kimyoviy bog'lanishda atomning umumiy elektron juftlarni o'ziga tortish qobiliyati"
      ikon="magnit"
      boshqaruv={
        <>
          {TORTISH_JUFTLIKLAR.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => {
                setJuftId(j.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                juftId === j.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {j.a} — {j.b}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Etalon: Litiyning EM birligi ~1,0 (0,98)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Katta EM li atom umumiy juftni tortadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Inert gazlarda EM odatda qaralmaydi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 13-JADVAL — NISBIY ELEKTROMANFIYLIK QIYMATLARI (65-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaJadval13NEM() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 13-jadval: Nisbiy elektromanfiylik (65-b)"
      ikon="grafik"
      variantlar={[
        {
          id: 'davr2',
          tugma: '2-davr (Li → F)',
          formula: '2-davrda NEM Li (0,98) dan F (4,00) gacha muttasil ortadi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '65-bet, 13-jadval: 2-davr (Li → F)',
            tenglama: 'Li (0,98) < Be (1,57) < B (2,04) < C (2,55) < N (3,04) < O (3,44) < F (4,0)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Li', qiymat: 25, yorliq: '0,98', rang: '#f472b6' },
              { nom: 'Be', qiymat: 39, yorliq: '1,57', rang: '#fb923c' },
              { nom: 'B', qiymat: 51, yorliq: '2,04', rang: '#fbbf24' },
              { nom: 'C', qiymat: 64, yorliq: '2,55', rang: '#a3e635' },
              { nom: 'N', qiymat: 76, yorliq: '3,04', rang: '#34d399' },
              { nom: 'O', qiymat: 86, yorliq: '3,44', rang: '#38bdf8' },
              { nom: 'F', qiymat: 100, yorliq: '4,00', rang: '#a855f7' },
            ],
          },
          pastki: [
            'F (4,0) — eng elektrmanfiy element',
            'Li (0,98) ≈ 1,0 — etalon',
            'Davrda chapdan o\'ngga NEM ortadi',
          ],
        },
        {
          id: 'davr3',
          tugma: '3-davr (Na → Cl)',
          formula: '3-davrda NEM Na (0,93) dan Cl (3,16) gacha ortadi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '65-bet, 13-jadval: 3-davr (Na → Cl)',
            tenglama: 'Na (0,93) < Mg (1,31) < Al (1,61) < Si (1,90) < P (2,19) < S (2,58) < Cl (3,16)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Na', qiymat: 23, yorliq: '0,93', rang: '#f472b6' },
              { nom: 'Mg', qiymat: 33, yorliq: '1,31', rang: '#fb923c' },
              { nom: 'Al', qiymat: 40, yorliq: '1,61', rang: '#fbbf24' },
              { nom: 'Si', qiymat: 48, yorliq: '1,90', rang: '#a3e635' },
              { nom: 'P', qiymat: 55, yorliq: '2,19', rang: '#34d399' },
              { nom: 'S', qiymat: 65, yorliq: '2,58', rang: '#38bdf8' },
              { nom: 'Cl', qiymat: 79, yorliq: '3,16', rang: '#818cf8' },
            ],
          },
          pastki: [
            'Metallar (~0,8–1,9) < Metalmaslar (~2,1–4,0)',
            'Cl (3,16) < O (3,44) < F (4,00)',
            'Davrda r ↓ → elektron tortish ↑',
          ],
        },
        {
          id: 'muhim',
          tugma: 'Asosiy rekordchilar',
          formula: 'Eng kichik Cs = 0,79 • H = 2,20 • O = 3,44 • Eng katta F = 4,00',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '13-jadval rekordchilari: Cs (0,79) → F (4,00)',
            tenglama: 'Cs (0,79) < K (0,82) < Ca (1,00) < Fe (1,83) < H (2,20) < Br (2,96) < F (4,00)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Cs', qiymat: 20, yorliq: '0,79', rang: '#ef4444' },
              { nom: 'K', qiymat: 21, yorliq: '0,82', rang: '#f472b6' },
              { nom: 'Ba', qiymat: 22, yorliq: '0,89', rang: '#fb923c' },
              { nom: 'Ca', qiymat: 25, yorliq: '1,00', rang: '#fbbf24' },
              { nom: 'Fe', qiymat: 46, yorliq: '1,83', rang: '#a3e635' },
              { nom: 'H', qiymat: 55, yorliq: '2,20', rang: '#34d399' },
              { nom: 'Br', qiymat: 74, yorliq: '2,96', rang: '#38bdf8' },
              { nom: 'F', qiymat: 100, yorliq: '4,00', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Eng kichik NEM: Cs (0,79)',
            'Vodorod etaloni: H = 2,20',
            'Top-3: F (4,0) > O (3,44) > Cl (3,16)',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: DAVR VA GURUHDA NEM O'ZGARISHI (65-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaEMTendensiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Guruhlarda NEM o'zgarishi (65-b)"
      ikon="nurlar"
      variantlar={[
        {
          id: 'galogen',
          tugma: 'VIIA guruh (F → I)',
          formula: 'VIIA: F (4,00) > Cl (3,16) > Br (2,96) > I (2,66)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'VIIA (↓): qavat 2 → 5 ortib, NEM kamayadi',
            tenglama: 'F (4,00, 2 qavat) → I (2,66, 5 qavat)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F (2q)', qiymat: 100, yorliq: '4,00', rang: '#a855f7' },
              { nom: 'Cl (3q)', qiymat: 79, yorliq: '3,16', rang: '#38bdf8' },
              { nom: 'Br (4q)', qiymat: 74, yorliq: '2,96', rang: '#34d399' },
              { nom: 'I (5q)', qiymat: 67, yorliq: '2,66', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'F (4,0) — eng elektrmanfiy element',
            'Radius katta → elektron tortish ↓',
            'Guruhda pastga NEM kamayadi',
          ],
        },
        {
          id: 'ishqoriy',
          tugma: 'IA guruh (Li → Cs)',
          formula: 'IA: Li (0,98) > Na (0,93) > K (0,82) > Cs (0,79)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'IA (↓): metallik kuchayib, NEM kamayadi',
            tenglama: 'Li (0,98, 2 qavat) → Cs (0,79, 6 qavat)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Li (2q)', qiymat: 25, yorliq: '0,98', rang: '#f472b6' },
              { nom: 'Na (3q)', qiymat: 23, yorliq: '0,93', rang: '#fb923c' },
              { nom: 'K (4q)', qiymat: 21, yorliq: '0,82', rang: '#fbbf24' },
              { nom: 'Cs (6q)', qiymat: 20, yorliq: '0,79', rang: '#ef4444' },
            ],
          },
          pastki: [
            'Cs (0,79) — elektronni eng oson beradi',
            'Qavatlar: Li (2) → Cs (6)',
            'NEM ↓ → qaytaruvchanlik ↑',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: 66-BET 4-MASHQ — BIRIKMALARDA ELEKTRON JUFT SILJISHI
═══════════════════════════════════════════════════════════════ */
function KorgazmaElektronSiljish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 66-bet 4-mashq: Bog' elektron jufti siljishi"
      ikon="uchqun"
      variantlar={[
        {
          id: 'Cl2O7',
          tugma: 'Cl₂O₇ (→ O)',
          formula: 'Cl₂O₇ da O (3,44) > Cl (3,16) → elektron juft O ga siljiydi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Cl₂O₇: Xlor (3,16) dan Kislorod (3,44) ga siljish',
            tenglama: 'Cl (δ⁺, 3,16)  →  O (δ⁻, 3,44) • ΔEM = 0,28',
            rejim: 'bog',
            bogJuft: { chap: 'Cl δ⁺', chapRang: '#38bdf8', ong: 'O δ⁻', ongRang: '#f472b6', siljish: 0.45 },
            metrikalar: [
              { nom: 'NEM (Cl)', qiymat: '3,16', foiz: 79, rang: '#38bdf8' },
              { nom: 'NEM (O)', qiymat: '3,44', foiz: 86, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Siljish', v: 'Cl → O', rang: '#fde047' },
              { k: 'Manfiy (δ⁻)', v: 'O', rang: '#f472b6' },
            ],
          },
          pastki: [
            'O (3,44) > Cl (3,16) — juftlar O ga siljiydi',
            'Ikkalasi ham metalmas, lekin O kuchliroq',
            'Siljish har doim katta NEM tomonga!',
          ],
        },
        {
          id: 'AlBr3',
          tugma: 'AlBr₃ (→ Br)',
          formula: 'AlBr₃ da Br (2,96) > Al (1,61) → juftlar Bromga siljiydi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'AlBr₃: Alyuminiy (1,61) dan Brom (2,96) ga siljish',
            tenglama: 'Al (δ⁺, 1,61)  →  Br (δ⁻, 2,96) • ΔEM = 1,35',
            rejim: 'bog',
            bogJuft: { chap: 'Al δ⁺', chapRang: '#38bdf8', ong: 'Br δ⁻', ongRang: '#f472b6', siljish: 0.72 },
            metrikalar: [
              { nom: 'NEM (Al)', qiymat: '1,61', foiz: 40, rang: '#38bdf8' },
              { nom: 'NEM (Br)', qiymat: '2,96', foiz: 74, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Siljish', v: 'Al → Br', rang: '#fde047' },
              { k: 'Manfiy (δ⁻)', v: 'Br', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Br (2,96) > Al (1,61)',
            'Elektron zichlik Br atrofida to\'planadi',
            'Kichik NEM (δ⁺) → Katta NEM (δ⁻)',
          ],
        },
        {
          id: 'CO2',
          tugma: 'CO₂ (→ O)',
          formula: 'CO₂ da O (3,44) > C (2,55) → juftlar Kislorodga siljiydi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'CO₂: Uglerod (2,55) dan Kislorod (3,44) ga siljish',
            tenglama: 'C (δ⁺, 2,55)  →  O (δ⁻, 3,44) • ΔEM = 0,89',
            rejim: 'bog',
            bogJuft: { chap: 'C δ⁺', chapRang: '#38bdf8', ong: 'O δ⁻', ongRang: '#f472b6', siljish: 0.6 },
            metrikalar: [
              { nom: 'NEM (C)', qiymat: '2,55', foiz: 64, rang: '#38bdf8' },
              { nom: 'NEM (O)', qiymat: '3,44', foiz: 86, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Siljish', v: 'C → O', rang: '#fde047' },
              { k: 'Manfiy (δ⁻)', v: 'O', rang: '#f472b6' },
            ],
          },
          pastki: [
            'O (3,44) ugleroddan (2,55) kuchli tortadi',
            'O=C=O da juftlar ikki O tomonga siljigan',
            'Manfiy qutb O da joylashadi',
          ],
        },
        {
          id: 'NH3',
          tugma: 'NH₃ (→ N)',
          formula: 'NH₃ da N (3,04) > H (2,20) → juftlar Azotga siljiydi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'NH₃: Vodorod (2,20) dan Azot (3,04) ga siljish',
            tenglama: 'H (δ⁺, 2,20)  →  N (δ⁻, 3,04) • ΔEM = 0,84',
            rejim: 'bog',
            bogJuft: { chap: 'H δ⁺', chapRang: '#38bdf8', ong: 'N δ⁻', ongRang: '#f472b6', siljish: 0.58 },
            metrikalar: [
              { nom: 'NEM (H)', qiymat: '2,20', foiz: 55, rang: '#38bdf8' },
              { nom: 'NEM (N)', qiymat: '3,04', foiz: 76, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Siljish', v: 'H → N', rang: '#fde047' },
              { k: 'Manfiy (δ⁻)', v: 'N', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Ammiakda N (3,04) > H (2,20)',
            '3 ta bog\' elektronlari N tomonga siljiydi',
            'Azotda 1 ta erkin juft ham mavjud',
          ],
        },
        {
          id: 'H2S',
          tugma: 'H₂S (→ S)',
          formula: 'H₂S da S (2,58) > H (2,20) → juftlar Oltingugurtga siljiydi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'H₂S: Vodorod (2,20) dan Oltingugurt (2,58) ga siljish',
            tenglama: 'H (δ⁺, 2,20)  →  S (δ⁻, 2,58) • ΔEM = 0,38',
            rejim: 'bog',
            bogJuft: { chap: 'H δ⁺', chapRang: '#38bdf8', ong: 'S δ⁻', ongRang: '#f472b6', siljish: 0.48 },
            metrikalar: [
              { nom: 'NEM (H)', qiymat: '2,20', foiz: 55, rang: '#38bdf8' },
              { nom: 'NEM (S)', qiymat: '2,58', foiz: 65, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Siljish', v: 'H → S', rang: '#fde047' },
              { k: 'Manfiy (δ⁻)', v: 'S', rang: '#f472b6' },
            ],
          },
          pastki: [
            'S (2,58) > H (2,20) > P (2,19)',
            'Juftlar Oltingugurt atomiga siljiydi',
            'HCl, H₂O da ham H → δ⁺',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 66-BET 3-MASHQ — ELEMENTLARNI NEM ORTISHI BO'YICHA TIZISH
═══════════════════════════════════════════════════════════════ */
function KorgazmaMashq3Tartib() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 66-bet 3-mashq: NEM bo'yicha tartiblash"
      ikon="formula"
      variantlar={[
        {
          id: 'osish',
          tugma: 'O\'sish (K → F)',
          formula: 'K (0,82) < Ba < Li < Al < Cr < P < C < Br < N < O < F (4,0)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '66-bet 3-mashq: NEM ortib borishi (K → F)',
            tenglama: 'K(0,82) < Ba(0,89) < Li(0,98) < Al(1,61) < Cr(1,66) < P(2,19) < C(2,55) < Br < N < O < F(4,0)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'K', qiymat: 21, yorliq: '0,82', rang: '#f472b6' },
              { nom: 'Ba', qiymat: 22, yorliq: '0,89', rang: '#f472b6' },
              { nom: 'Li', qiymat: 25, yorliq: '0,98', rang: '#f472b6' },
              { nom: 'Al', qiymat: 40, yorliq: '1,61', rang: '#fb923c' },
              { nom: 'Cr', qiymat: 42, yorliq: '1,66', rang: '#fb923c' },
              { nom: 'P', qiymat: 55, yorliq: '2,19', rang: '#fbbf24' },
              { nom: 'C', qiymat: 64, yorliq: '2,55', rang: '#fbbf24' },
              { nom: 'Br', qiymat: 74, yorliq: '2,96', rang: '#38bdf8' },
              { nom: 'N', qiymat: 76, yorliq: '3,04', rang: '#34d399' },
              { nom: 'O', qiymat: 86, yorliq: '3,44', rang: '#34d399' },
              { nom: 'F', qiymat: 100, yorliq: '4,00', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Metallar (<1,8): K, Ba, Li, Al, Cr',
            'Oraliq metalmaslar: P (2,19), C (2,55)',
            'Yuqori NEM: Br < N < O < F (4,0)',
          ],
        },
        {
          id: 'kamayish',
          tugma: 'Kamayish (F → K)',
          formula: 'F (4,0) > O (3,44) > N (3,04) > Br > C > P > Cr > Al > Li > Ba > K (0,82)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '66-bet 3-mashq: NEM kamayib borishi (F → K)',
            tenglama: 'F (4,00) → O (3,44) → N (3,04) → Br (2,96) → ... → K (0,82)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F', qiymat: 100, yorliq: '4,00', rang: '#a855f7' },
              { nom: 'O', qiymat: 86, yorliq: '3,44', rang: '#34d399' },
              { nom: 'N', qiymat: 76, yorliq: '3,04', rang: '#34d399' },
              { nom: 'Br', qiymat: 74, yorliq: '2,96', rang: '#38bdf8' },
              { nom: 'C', qiymat: 64, yorliq: '2,55', rang: '#fbbf24' },
              { nom: 'P', qiymat: 55, yorliq: '2,19', rang: '#fbbf24' },
              { nom: 'Cr', qiymat: 42, yorliq: '1,66', rang: '#fb923c' },
              { nom: 'Al', qiymat: 40, yorliq: '1,61', rang: '#fb923c' },
              { nom: 'Li', qiymat: 25, yorliq: '0,98', rang: '#f472b6' },
              { nom: 'Ba', qiymat: 22, yorliq: '0,89', rang: '#f472b6' },
              { nom: 'K', qiymat: 21, yorliq: '0,82', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Eng yuqori: F (4,0) — oksidlovchi',
            'Eng past: K (0,82) — qaytaruvchi',
            'NEM ↓ → metallik xossa ↑',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (13-§) VA O'YINLAR (14-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '2-davrda chapdan o\'ngga (Li → F) radius:',
    variantlar: [
      { matn: 'Ortadi', togri: false },
      { matn: 'O\'zgarmaydi', togri: false },
      { matn: 'Kichrayadi (0,155 → 0,064 nm)', togri: true },
      { matn: 'Avval kichrayib ortadi', togri: false },
    ],
    izoh: '54-b: 2 qavatda yadro zaryadi ortib tortiladi.',
  },
  {
    id: 't2',
    savol: 'Vinkler (1886) topgan Ge ning eski bashorat nomi:',
    variantlar: [
      { matn: 'Ekasilitsiy (12-jadval)', togri: true },
      { matn: 'Ekabor (Sc)', togri: false },
      { matn: 'Ekaalyuminiy (Ga)', togri: false },
      { matn: 'Reniy (Re)', togri: false },
    ],
    izoh: '56-b 12-jadval: Ekasilitsiy → Germaniy (Ge).',
  },
  {
    id: 't3',
    savol: '+38 Sr (A=88) yadro va qavatlari:',
    variantlar: [
      { matn: '38p⁺, 38n⁰; 2, 8, 18, 10', togri: false },
      { matn: '50p⁺, 38n⁰; 2, 8, 18, 8, 2', togri: false },
      { matn: '38p⁺, 42n⁰; 2, 8, 18, 5', togri: false },
      { matn: '38p⁺, 50n⁰; 2, 8, 18, 8, 2', togri: true },
    ],
    izoh: '54-b: 5-davr, IIA guruh, 50 neytron.',
  },
  {
    id: 't4',
    savol: '58-b 2-misol: EO₃ va H₂E (5,88% H) elementi?',
    variantlar: [
      { matn: 'Azot (N)', togri: false },
      { matn: 'Oltingugurt (S, H₂S)', togri: true },
      { matn: 'Uglerod (C)', togri: false },
      { matn: 'Fosfor (P)', togri: false },
    ],
    izoh: '94,12 / 5,88 = 16; Ar = 16·2 = 32 → S.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'past', nom: 'Kichik NEM (< 1,7)', tavsif: 'Elektronini oson beruvchi metallar' },
    { id: 'ortacha', nom: 'O\'rtacha NEM (1,9–2,6)', tavsif: 'Si, P, H, C, S' },
    { id: 'yuqori', nom: 'Yuqori NEM (2,9–4,0)', tavsif: 'Elektron juftni kuchli tortuvchilar' },
  ],
  topshiriqlar: [
    { nom: 'Seziy (Cs: 0,79)', qisqa: 'Eng kichik NEM', guruh: 'past', izoh: '65-b 13-jadval: eng faol metall.' },
    { nom: 'K (0,82) va Na (0,93)', qisqa: 'Ishqoriy metallar', guruh: 'past', izoh: 'Tashqi 1 ē ni oson beradi.' },
    { nom: 'Li (0,98) va Al (1,61)', qisqa: 'Li etalon ~1,0', guruh: 'past', izoh: 'Litiy taqqoslash etaloni edi.' },
    { nom: 'Vodorod (H: 2,20)', qisqa: 'O\'rtacha NEM', guruh: 'ortacha', izoh: '65-b: oraliq metalmas qutbi.' },
    { nom: 'C (2,55) va S (2,58)', qisqa: '2,55 – 2,58', guruh: 'ortacha', izoh: 'Kislorod (3,44) ga elektron juft beradi.' },
    { nom: 'P (2,19) va Si (1,90)', qisqa: '1,90 – 2,19', guruh: 'ortacha', izoh: '3-davr o\'rta elementlari.' },
    { nom: 'Ftor (F: 4,0)', qisqa: 'Eng katta NEM!', guruh: 'yuqori', izoh: 'Barcha elementlardan juftni tortadi.' },
    { nom: 'O (3,44) va N (3,04)', qisqa: 'F dan keyingi yetakchi', guruh: 'yuqori', izoh: 'H₂O va NH₃ da δ⁻ qutb.' },
    { nom: 'Cl (3,16) va Br (2,96)', qisqa: 'Galogenlar', guruh: 'yuqori', izoh: 'VIIA da F > Cl > Br > I.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'EM ta\'rifi',
    savol: 'Elektromanfiylik (EM) nima?',
    variantlar: [
      'Neytronlar soni',
      'Modda zichligi',
      'Bog\'dagi umumiy ē juftni tortish kuchi',
      'Bo\'sh orbitallar soni',
    ],
    togri: 2,
    izoh: '64-b: atomning umumiy ē juftlarni tortish xossasi.',
  },
  {
    belgi: 'Rekordchilar',
    savol: 'Eng katta va eng kichik NEM jufti:',
    variantlar: ['F (4,0) va Cs (0,79)', 'O (3,44) va Li (0,98)', 'Cl (3,16) va Na (0,93)', 'N (3,04) va K (0,82)'],
    togri: 0,
    izoh: '65-b: F = 4,0; Cs = 0,79.',
  },
  {
    belgi: 'Etalon',
    savol: 'Qaysi element NEM shkalasi ~1,0 etaloni?',
    variantlar: ['Vodorod (2,20)', 'Ftor (4,0)', 'Natriy (0,93)', 'Litiy (Li = 0,98 ≈ 1)'],
    togri: 3,
    izoh: '64-b: dastlab Li etalon qilib olingan.',
  },
  {
    belgi: 'Cl₂O₇ (66-b)',
    savol: 'Cl₂O₇ da elektron juftlar qayerga siljiydi?',
    variantlar: ['Xlorga (Cl)', 'Kislorodga (O = 3,44 > Cl = 3,16)', 'Siljimaydi', 'Teng bo\'linadi'],
    togri: 1,
    izoh: '66-b 4-mashq: O (3,44) > Cl (3,16).',
  },
  {
    belgi: 'Oktet / Duplet',
    savol: 'Atomlar nega elektron beradi yoki oladi?',
    variantlar: [
      'Proton sonini o\'zgartirish',
      'Barqaror 2 ē yoki 8 ē qobiqqa intilish',
      'Yadroni parchalash',
      'Massani kamaytirish',
    ],
    togri: 1,
    izoh: '63-b: inert gaz qobig\'idek barqarorlik.',
  },
  {
    belgi: '66-b 2-mashq',
    savol: '3-davrda (Na → Cl) NEM o\'zgarishi:',
    variantlar: ['Kamayadi', 'O\'zgarmaydi', 'Avval ortib pasayadi', 'Ortadi: Na(0,93) < ... < Cl(3,16)'],
    togri: 3,
    izoh: '65-b: radius ↓ tufayli davrda NEM ortadi.',
  },
  {
    belgi: 'AlBr₃ va CO₂',
    savol: 'AlBr₃ va CO₂ da elektron juftlar siljishi:',
    variantlar: ['Br (2,96) va O (3,44) ga', 'Al va C ga', 'Al va O ga', 'Br va C ga'],
    togri: 0,
    izoh: '66-b 4-mashq: Br > Al; O > C.',
  },
  {
    belgi: 'Yadro',
    savol: 'Kimyoviy reaksiyada nima o\'zgarmaydi?',
    variantlar: ['Tashqi elektronlar', 'Bog\' uzunligi', 'Yadro tarkibi (p⁺ va n⁰)', 'Ion zaryadi'],
    togri: 2,
    izoh: '63-b: faqat elektron qobiqlar qayta taqsimlanadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '66-b 3-mashq',
    vazifa: 'Elementlarni NEM ortishi bo\'yicha joylang:',
    tartib: ['K (0,82) < Ba (0,89)', 'Li (0,98) < Al (1,61)', 'Cr < P (2,19) < C (2,55)', 'Br < N < O < F (4,0)'],
    variantlar: ['Cr < P (2,19) < C (2,55)', 'K (0,82) < Ba (0,89)', 'Br < N < O < F (4,0)', 'Li (0,98) < Al (1,61)'],
  },
  {
    tur: 'Galogenlar NEM',
    vazifa: 'VIIA guruhni NEM ortishi tartibida tering:',
    tartib: ['Iod (2,66)', 'Brom (2,96)', 'Xlor (3,16)', 'Ftor (4,00)'],
    variantlar: ['Xlor (3,16)', 'Iod (2,66)', 'Ftor (4,00)', 'Brom (2,96)'],
  },
  {
    tur: '2-davr NEM',
    vazifa: '2-davr elementlarini NEM o\'sishida tering:',
    tartib: ['Li (0,98) → Be (1,57)', 'B (2,04) → C (2,55)', 'N (3,04) → O (3,44)', 'F (4,00 — maksimum)'],
    variantlar: ['N (3,04) → O (3,44)', 'Li (0,98) → Be (1,57)', 'F (4,00 — maksimum)', 'B (2,04) → C (2,55)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '3-davrda eng yuqori NEM ga ega element:',
    variantlar: ['S (2,58)', 'Xlor (Cl = 3,16)', 'P (2,19)', 'Na (0,93)'],
    togri: 1,
    izoh: '65-b 13-jadval: Cl (3,16) 3-davrda eng yuqori.',
  },
  {
    savol: 'NH₃ va H₂S da δ⁻ qutb qaysi atomlarda?',
    variantlar: ['Ikkalasida H', 'Faqat N', 'Faqat H', 'N (3,04) va S (2,58)'],
    togri: 3,
    izoh: '66-b 4-mashq: N va S ning NEM > H (2,20).',
  },
  {
    savol: 'Guruhda yuqoridan pastga NEM nega kamayadi?',
    variantlar: ['Qavat va radius ortib, tortish sustlashadi', 'Yadro zaryadi kamayadi', 'Elektron ko\'payadi', 'Massa kamayadi'],
    togri: 0,
    izoh: '65-b: radius ↑ → yadro tashqi juftni kuchsiz tortadi.',
  },
  {
    savol: 'Vodorod (2,20) va Ftor (4,0) ΔEM farqi:',
    variantlar: ['6,20', '0,80', '1,80', '2,20'],
    togri: 2,
    izoh: '4,00 - 2,20 = 1,80.',
  },
  {
    savol: 'He va Ne nechta tashqi elektron bilan barqaror?',
    variantlar: ['4 tadan ē', 'He 8 ē, Ne 2 ē', 'He 2 ē (duplet), Ne 8 ē (oktet)', '18 tadan ē'],
    togri: 2,
    izoh: '63-b: duplet (2) va oktet (8) barqarordir.',
  },
  {
    savol: 'K (0,82), Ba (0,89), Ca (1,00), Al (1,61) — eng faol metall?',
    variantlar: ['Kaliy (K = 0,82)', 'Alyuminiy (1,61)', 'Kalsiy (1,00)', 'Bariy (0,89)'],
    togri: 0,
    izoh: 'NEM kichik metall elektronni osonroq beradi.',
  },
  {
    savol: '66-b 1-mashq: d-elementlarda valentlik nega eski qavatga ham bog\'liq?',
    variantlar: ['Ular inert gazlar', 'Tashqi s va oldingi d-qavatcha qatnashadi', 'Yadro zaryadi 0', 'Faqat 1-davrda'],
    togri: 1,
    izoh: '63-b: yonaki guruhchada d-elektronlar ham qatnashadi.',
  },
  {
    savol: 'Qaysi qator elementlarining NEM > C (2,55)?',
    variantlar: ['Li, Na, K', 'Si (1,90), P (2,19)', 'Al (1,61), Fe (1,83)', 'Br (2,96), N (3,04), Cl (3,16), O (3,44), F (4,0)'],
    togri: 3,
    izoh: '65-b 13-jadval: Br, N, Cl, O, F > 2,55.',
  },
];

export default function S8Mavzu14() {
  const korgazmalar = [
    { nom: '1. Oktet va duplet', ikon: 'atom', komponent: <KorgazmaOktetBarqarorlik /> },
    { nom: '2. EM ta\'rifi (tortish)', ikon: 'magnit', komponent: <KorgazmaEMTarifi /> },
    { nom: '3. 13-jadval NEMlar', ikon: 'grafik', komponent: <KorgazmaJadval13NEM /> },
    { nom: '4. Guruhda o\'zgarish', ikon: 'nurlar', komponent: <KorgazmaEMTendensiya /> },
    { nom: '5. Elektron juft siljishi', ikon: 'uchqun', komponent: <KorgazmaElektronSiljish /> },
    { nom: '6. 3-mashq: Tartiblash', ikon: 'formula', komponent: <KorgazmaMashq3Tartib /> },
  ];

  const oyinlar = [
    {
      nom: '1. NEM bo\'yicha ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-14"
          nom="Elementlarni NEM qiymatiga ko'ra guruhlash (13-jadval)"
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
          key="tezkor-14"
          nom="14-§: Nisbiy elektromanfiylik viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. NEM o\'sish zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-14"
          nom="NEM ortib borish zanjirlari (65-66-bet)"
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
          key="duel-14"
          sarlavha="14-§: Nisbiy elektromanfiylik dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="14-§"
      mavzuNom="Kimyoviy elementlarning nisbiy elektromanfiyligi"
      oldingiRaqam="13-§"
      oldingiNom="Elementlarning davriy sistemadagi o'rni va atom tuzilishiga qarab tavsiflash. Davriy qonunning ahamiyati"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
