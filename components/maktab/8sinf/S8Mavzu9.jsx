'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 9-PARAGRAF
// "Atom elektron qavatlarining tuzilishi" (Darslik 41-44-betlar)
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
   1-KO'RGAZMA: ELEKTRON BULUT VA KUCHLAR MUVOZANATI (41-42-BET)
═══════════════════════════════════════════════════════════════ */
const BULUT_MODES = [
  { id: 'bulut', nom: 'H elektron buluti', izoh: 'H elektroni r = 0,53·10⁻¹⁰ m sharsimon bulut hosil qiladi.' },
  { id: 'kuchlar', nom: 'Kuchlar muvozanati', izoh: 'Tortishish kuchi markazdan qochma kuchga tenglashadi.' },
  { id: 'energiya', nom: 'Energiya va masofa', izoh: 'Kichik energiyali ē yaqinda, kattasi uzoqda joylashadi.' },
];

function KorgazmaElektronBulut() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('bulut');
  const faol = BULUT_MODES.find((m) => m.id === mode) || BULUT_MODES[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = BULUT_MODES.find((m) => m.id === mode) || BULUT_MODES[0];
    let kadr;
    let t = 0;

    const nuqtalar = Array.from({ length: 120 }, (_, i) => {
      const ang = i * 2.39996;
      const dist = Math.pow((i % 37) / 37, 0.6) * 86 + 12;
      return { ang, dist };
    });

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.04;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Atom elektron buluti: ${faol.nom}`, 24, 34);

      const cx = w * 0.34;
      const cy = h * 0.55;

      // Sferik elektron bulut nuqtalari
      nuqtalar.forEach((p, idx) => {
        const j = mode === 'bulut' ? Math.sin(t * 3 + idx) * 4 : 0;
        const px = cx + Math.cos(p.ang + t * 0.2) * (p.dist + j);
        const py = cy + Math.sin(p.ang + t * 0.2) * (p.dist + j);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.52)';
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 88, 0, Math.PI * 2);
      ctx.stroke();
      if (mode === 'energiya') {
        ctx.beginPath();
        ctx.arc(cx, cy, 52, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      chizZarracha(ctx, cx, cy, 14, '#ef4444', '+1');

      const ex = cx + Math.cos(t * 1.6) * 88;
      const ey = cy + Math.sin(t * 1.6) * 88;
      chizZarracha(ctx, ex, ey, 8, '#38bdf8', 'e⁻');

      if (mode === 'kuchlar') {
        const vx = Math.cos(t * 1.6);
        const vy = Math.sin(t * 1.6);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - vx * 42, ey - vy * 42);
        ctx.stroke();

        ctx.strokeStyle = '#34d399';
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + vx * 42, ey + vy * 42);
        ctx.stroke();
      }

      const rx = w * 0.58;
      const rw = w * 0.38;
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
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.nom, rx + 20, ry + 38);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px "Times New Roman", serif';
      ctx.fillText(faol.izoh, rx + 20, ry + 78);

      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText('Vodorod buluti radiusi: r = 0,53·10⁻¹⁰ m', rx + 20, ry + rh - 30);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [mode]);

  return (
    <KorgazmaRamka
      sarlavha="1. Elektron bulut va kuchlar muvozanati (41-42-bet)"
      qisqaFormula="Tortishish kuchi = Markazdan qochma kuch • r(H bulut) = 0,53·10⁻¹⁰ m"
      ikon="atom"
      boshqaruv={
        <>
          {BULUT_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                mode === m.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
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
            H atomida 1 ta elektron sferik elektron bulut hosil qiladi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Yadroga yaqin elektronlar kichikroq energiyaga ega
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
   2-KO'RGAZMA: 8-JADVAL — N = 2n² VA K–P QAVATLARI (42-BET)
═══════════════════════════════════════════════════════════════ */
const QAVATLAR_8JADVAL = [
  { n: 1, harf: 'K', max: 2, rang: '#38bdf8' },
  { n: 2, harf: 'L', max: 8, rang: '#34d399' },
  { n: 3, harf: 'M', max: 18, rang: '#a3e635' },
  { n: 4, harf: 'N', max: 32, rang: '#fbbf24' },
  { n: 5, harf: 'O', max: 50, rang: '#fb923c' },
  { n: 6, harf: 'P', max: 72, rang: '#f472b6' },
];

function KorgazmaQavatSigimi() {
  const canvasRef = useRef(null);
  const [nVal, setNVal] = useState(3);
  const faol = QAVATLAR_8JADVAL.find((q) => q.n === nVal) || QAVATLAR_8JADVAL[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = QAVATLAR_8JADVAL.find((q) => q.n === nVal) || QAVATLAR_8JADVAL[0];
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
      ctx.fillText(`8-jadval: N = 2n² • n = ${faol.n} (${faol.harf}) → ${faol.max} ē`, 24, 34);

      const cx = w * 0.28;
      const cy = h * 0.56;
      QAVATLAR_8JADVAL.forEach((q, idx) => {
        const rad = 24 + idx * 18;
        const active = q.n === nVal;
        ctx.strokeStyle = active ? q.rang : 'rgba(148, 163, 184, 0.28)';
        ctx.lineWidth = active ? 3 : 1;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        if (active) {
          const drawCount = Math.min(q.max, 24);
          for (let i = 0; i < drawCount; i++) {
            const ang = t * 0.8 + (i * Math.PI * 2) / drawCount;
            chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4, q.rang, '');
          }
        }
      });
      chizZarracha(ctx, cx, cy, 12, '#ef4444', '+Z');

      const gx = w * 0.54;
      const gw = w * 0.42;
      const gy = 68;
      const gh = h - 104;
      const bazY = gy + gh;
      const step = gw / QAVATLAR_8JADVAL.length;

      QAVATLAR_8JADVAL.forEach((q, idx) => {
        const bx = gx + idx * step + 6;
        const bw = step - 12;
        const bh = (q.max / 76) * (gh - 28);
        const sel = q.n === nVal;

        ctx.fillStyle = sel ? q.rang : `${q.rang}66`;
        ctx.strokeStyle = sel ? '#ffffff' : q.rang;
        ctx.lineWidth = sel ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(bx, bazY - bh, bw, bh, [6, 6, 0, 0]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${q.harf}(${q.n})`, bx + bw / 2, bazY + 18);
        ctx.fillStyle = '#fde047';
        ctx.fillText(`${q.max}`, bx + bw / 2, bazY - bh - 6);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [nVal]);

  return (
    <KorgazmaRamka
      sarlavha="2. 8-jadval: Qavatlar sig'imi (42-b)"
      qisqaFormula="N = 2n² → K(2), L(8), M(18), N(32), O(50), P(72)"
      ikon="formula"
      boshqaruv={
        <>
          {QAVATLAR_8JADVAL.map((q) => (
            <button
              key={q.n}
              type="button"
              onClick={() => {
                setNVal(q.n);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                nVal === q.n
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              n={q.n} ({q.harf}: {q.max} ē)
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            {faol.harf}-qavat (n={faol.n}): N = 2 · {faol.n}² = {faol.max} elektron
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Harflar tartibi: K, L, M, N, O, P, Q
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Yadroga eng yaqin K qavatga ko&apos;pi bilan 2 ta elektron sig&apos;adi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: Z = 1..18 ELEMENTLARINING QAVATLARGA TAQSIMOTI (43-BET)
═══════════════════════════════════════════════════════════════ */
const QAVAT_ELEMENTLAR = [
  { z: 1, belgi: 'H', nom: 'Vodorod', qavatlar: [1], davr: 1, guruh: 'I', rang: '#38bdf8' },
  { z: 2, belgi: 'He', nom: 'Geliy', qavatlar: [2], davr: 1, guruh: 'VIII', rang: '#a855f7' },
  { z: 3, belgi: 'Li', nom: 'Litiy', qavatlar: [2, 1], davr: 2, guruh: 'I', rang: '#f472b6' },
  { z: 6, belgi: 'C', nom: 'Uglerod', qavatlar: [2, 4], davr: 2, guruh: 'IV', rang: '#34d399' },
  { z: 8, belgi: 'O', nom: 'Kislorod', qavatlar: [2, 6], davr: 2, guruh: 'VI', rang: '#fbbf24' },
  { z: 10, belgi: 'Ne', nom: 'Neon', qavatlar: [2, 8], davr: 2, guruh: 'VIII', rang: '#a855f7' },
  { z: 11, belgi: 'Na', nom: 'Natriy', qavatlar: [2, 8, 1], davr: 3, guruh: 'I', rang: '#f472b6' },
  { z: 13, belgi: 'Al', nom: 'Alyuminiy', qavatlar: [2, 8, 3], davr: 3, guruh: 'III', rang: '#34d399' },
  { z: 17, belgi: 'Cl', nom: 'Xlor', qavatlar: [2, 8, 7], davr: 3, guruh: 'VII', rang: '#2dd4bf' },
  { z: 18, belgi: 'Ar', nom: 'Argon', qavatlar: [2, 8, 8], davr: 3, guruh: 'VIII', rang: '#a855f7' },
];

function KorgazmaBirOnSakkiz() {
  const canvasRef = useRef(null);
  const [zVal, setZVal] = useState(11);
  const faol = QAVAT_ELEMENTLAR.find((e) => e.z === zVal) || QAVAT_ELEMENTLAR[6];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = QAVAT_ELEMENTLAR.find((e) => e.z === zVal) || QAVAT_ELEMENTLAR[6];
    let kadr;
    let t = 0;
    const harflar = ['K', 'L', 'M'];

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `${faol.nom} (${faol.belgi}, Z=${faol.z}): ${faol.davr} qavat, tashqida ${faol.qavatlar[faol.qavatlar.length - 1]} ē`,
        24,
        34
      );

      const cx = w * 0.32;
      const cy = h * 0.56;
      faol.qavatlar.forEach((soni, idx) => {
        const rad = 42 + idx * 34;
        const tashqimi = idx === faol.qavatlar.length - 1;
        ctx.strokeStyle = tashqimi ? '#fde047' : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = tashqimi ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < soni; i++) {
          const ang = t * (1.1 - idx * 0.25) + (i * Math.PI * 2) / soni;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 5.5, tashqimi ? '#fde047' : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 18, '#ef4444', `+${faol.z}`);

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

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.fillText(`Elektron konfiguratsiya qisqa sxemasi:`, rx + 20, ry + 36);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 24px "Times New Roman", serif';
      ctx.fillText(`+${faol.z} ) ${faol.qavatlar.join(' ) ')}`, rx + 20, ry + 76);

      faol.qavatlar.forEach((soni, idx) => {
        const py = ry + 112 + idx * 42;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px "Times New Roman", serif';
        ctx.fillText(`${idx + 1}-qavat (${harflar[idx]}):`, rx + 20, py);
        ctx.fillStyle = '#6ee7b7';
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.fillText(`${soni} ta elektron`, rx + 145, py);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zVal]);

  return (
    <KorgazmaRamka
      sarlavha="3. 1–18 elementlar qavat sxemasi (42–43-b)"
      qisqaFormula="Qavatlar = davr raqami • Tashqi ē = A-guruh raqami"
      ikon="yadro"
      boshqaruv={
        <>
          {QAVAT_ELEMENTLAR.map((el) => (
            <button
              key={el.z}
              type="button"
              onClick={() => {
                setZVal(el.z);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3 py-2 text-sm font-bold border transition ${
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
            Sxema: +{faol.z} ) {faol.qavatlar.join(' ) ')}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Davr = {faol.davr} ({faol.qavatlar.length} qavat) • Guruh = {faol.guruh}A
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            He(2), Ne(2,8) va Ar(2,8,8) — barqaror tugallangan qavatli inert gazlar
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: SPIN VA PAULI PRINSIPI — O'Z O'QI AYLANISHI (43-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaSpinPauli() {
  const canvasRef = useRef(null);
  const [holat, setHolat] = useState('he');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.05;

      const isLi = holat === 'li';
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        isLi
          ? 'Litiy (Z=3): 1-qavatga faqat qarama-qarshi spinli 2 ē sig\'adi, 3-elektron 2-qavatga o\'tadi'
          : 'Geliy (Z=2): bitta orbitalda qarama-qarshi yo\'nalishda aylanuvchi ko\'pi bilan 2 ta elektron bo\'ladi',
        24,
        34
      );

      const box1X = 56;
      const boxY = 76;
      const boxW = w * 0.44;
      const boxH = h - 108;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(box1X, boxY, boxW, boxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('1-qavat (K-orbital: maksimal 2 ē)', box1X + boxW / 2, boxY + 30);

      // Ikkita qarama-qarshi aylanuvchi elektron
      [
        { x: box1X + boxW * 0.3, dir: 1, label: '↑ Soat bo\'yicha', col: '#34d399' },
        { x: box1X + boxW * 0.7, dir: -1, label: '↓ Qarama-qarshi', col: '#f472b6' },
      ].forEach((sp) => {
        const ey = boxY + boxH * 0.5;
        chizZarracha(ctx, sp.x, ey, 26, sp.col, sp.dir > 0 ? '↑' : '↓');
        const ax = sp.x + Math.cos(t * sp.dir * 2.2) * 38;
        const ay = ey + Math.sin(t * sp.dir * 2.2) * 38;
        chizZarracha(ctx, ax, ay, 5, '#fde047', '');
        ctx.fillStyle = sp.col;
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(sp.label, sp.x, ey + 64);
      });

      const rx = box1X + boxW + 24;
      const rw = w - rx - 36;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = isLi ? '#fbbf24' : '#a855f7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, boxY, rw, boxH, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(isLi ? '3-elektron: L (2-qavat) ga!' : 'He: 1-qavat to\'liq to\'lgan', rx + 20, boxY + 34);

      if (isLi) {
        chizZarracha(ctx, rx + rw / 2, boxY + boxH * 0.5, 22, '#fbbf24', '3-ē (↑)');
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px "Times New Roman", serif';
        ctx.fillText('1 qavatda bir xil spinli 2 ē bo\'lmaydi → Li = 2, 1.', rx + 20, boxY + boxH - 46);
      } else {
        chizZarracha(ctx, rx + rw / 2, boxY + boxH * 0.5, 26, '#a855f7', 'He (2)');
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '14px "Times New Roman", serif';
        ctx.fillText('Qarama-qarshi aylanuvchi 2 ē juft (↑↓) hosil qiladi.', rx + 20, boxY + boxH - 46);
      }

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [holat]);

  return (
    <KorgazmaRamka
      sarlavha="4. Elektronning o'z o'qi atrofida aylanishi (spin) va juftlashishi (43-bet)"
      qisqaFormula="Bir orbitalda faqat qarama-qarshi aylanuvchi 2 ta elektron (↑↓) bo'lishi mumkin"
      ikon="uchqun"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setHolat('he');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              holat === 'he'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Geliy (Z=2): ↑↓ juftlik
          </button>
          <button
            type="button"
            onClick={() => {
              setHolat('li');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              holat === 'li'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Litiy (Z=3): 3-elektron keyingi qavatda
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            1-elektron: o&apos;z o&apos;qi atrofida soat strelkasi bo&apos;yicha (↑)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            2-elektron: qarama-qarshi yo&apos;nalishda (↓)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Uchinchi elektron K-qavatga sig&apos;maydi va L-qavatni boshlaydi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: GOMOLOGLARDA TASHQI QAVAT O'XSHASHLIGI (43-44-BET)
═══════════════════════════════════════════════════════════════ */
const GOMOLOG_JUFTLAR = [
  { id: 'IA', nom: 'IA: Li (2,1) ↔ Na (2,8,1)', e1: { b: 'Li', q: [2, 1] }, e2: { b: 'Na', q: [2, 8, 1] }, tashqi: 1, rang: '#f472b6', izoh: 'Tashqida 1 ē → I valentli ishqoriy metallar.' },
  { id: 'IIA', nom: 'IIA: Be (2,2) ↔ Mg (2,8,2)', e1: { b: 'Be', q: [2, 2] }, e2: { b: 'Mg', q: [2, 8, 2] }, tashqi: 2, rang: '#fbbf24', izoh: 'Tashqida 2 ē → II valentli metallar.' },
  { id: 'IVA', nom: 'IVA: C (2,4) ↔ Si (2,8,4)', e1: { b: 'C', q: [2, 4] }, e2: { b: 'Si', q: [2, 8, 4] }, tashqi: 4, rang: '#38bdf8', izoh: 'Tashqida 4 ē → IV valentli (CO₂, SiO₂).' },
  { id: 'VIIA', nom: 'VIIA: F (2,7) ↔ Cl (2,8,7)', e1: { b: 'F', q: [2, 7] }, e2: { b: 'Cl', q: [2, 8, 7] }, tashqi: 7, rang: '#2dd4bf', izoh: 'Tashqida 7 ē → faol galogenlar.' },
];

function KorgazmaGomologlar() {
  const canvasRef = useRef(null);
  const [juftId, setJuftId] = useState('IA');
  const faol = GOMOLOG_JUFTLAR.find((j) => j.id === juftId) || GOMOLOG_JUFTLAR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = GOMOLOG_JUFTLAR.find((j) => j.id === juftId) || GOMOLOG_JUFTLAR[0];
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
      ctx.fillText(`O'xshash xossa sababi: tashqi qavat bir xil (${faol.tashqi} ē)`, 24, 34);

      const cw = (w - 92) / 2;
      [faol.e1, faol.e2].forEach((atom, aIdx) => {
        const px = 34 + aIdx * (cw + 24);
        const cx = px + cw / 2;
        const cy = 174;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = faol.rang;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(px, 64, cw, h - 96, 16);
        ctx.fill();
        ctx.stroke();

        atom.q.forEach((cnt, qIdx) => {
          const rad = 30 + qIdx * 24;
          const isOuter = qIdx === atom.q.length - 1;
          ctx.strokeStyle = isOuter ? '#fde047' : 'rgba(148, 163, 184, 0.45)';
          ctx.lineWidth = isOuter ? 2.5 : 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();

          for (let i = 0; i < cnt; i++) {
            const ang = t + (i * Math.PI * 2) / cnt;
            chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4.5, isOuter ? '#fde047' : '#38bdf8', '');
          }
        });
        chizZarracha(ctx, cx, cy, 14, faol.rang, atom.b);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${atom.b}: ) ${atom.q.join(' ) ')}   (${atom.q.length} qavat)`, cx, h - 46);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [juftId]);

  return (
    <KorgazmaRamka
      sarlavha="5. Guruhcha o'xshashligi: tashqi qavat (43–44-b)"
      qisqaFormula="Davriylik sababi — tashqi elektron qavatning takrorlanishi"
      ikon="qidiruv"
      boshqaruv={
        <>
          {GOMOLOG_JUFTLAR.map((j) => (
            <button
              key={j.id}
              type="button"
              onClick={() => {
                setJuftId(j.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                juftId === j.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {j.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Tashqi qavatda ikkalasida ham {faol.tashqi} ta elektron
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            2-davrda 2 ta, 3-davrda 3 ta energetik qavat bor
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
   6-KO'RGAZMA: TASHQI QAVAT TO'LGANLIGI — METALL, METALLMAS, INERT
═══════════════════════════════════════════════════════════════ */
const QAVAT_TOIFA_VARIANTLAR = [
  {
    id: 'metall',
    tugma: 'Metall (1–3 ē)',
    formula: 'Na (2, 8, 1) • Mg (2, 8, 2) • Al (2, 8, 3)',
    tur: 'molekula',
    cfg: {
      sarlavha: 'Metall atomi (tashqi qavatda 1–3 ē)',
      tenglama: 'Na (Z=11): ) 2 ) 8 ) 1 → 1 ē beradi (Na⁺)',
      rejim: 'atom',
      qavatlar: [2, 8, 1],
      markaz: { belgi: 'Na', zaryad: '+11', rang: '#f472b6' },
      metrikalar: [
        { nom: 'Tashqi elektronlar', qiymat: '1 ē (oson beradi)', foiz: 15, rang: '#f472b6' },
        { nom: 'Qaytaruvchanlik', qiymat: 'Yuqori', foiz: 88, rang: '#fbbf24' },
      ],
      belgilar: [
        { k: 'Ion', v: 'Na⁺, Mg²⁺, Al³⁺', rang: '#f472b6' },
        { k: 'Guruh', v: 'IA–IIIA metallar', rang: '#38bdf8' },
      ],
    },
    pastki: [
      'Misollar: Na (2,8,1), Mg (2,8,2), Al (2,8,3)',
      'Tashqi elektronlarni berib musbat ion (+) hosil qiladi',
      'Har davr inert gazning tugallangan qavati bilan tugaydi',
    ],
  },
  {
    id: 'metallmas',
    tugma: 'Metallmas (4–7 ē)',
    formula: 'C (2, 4) • P (2, 8, 5) • Cl (2, 8, 7)',
    tur: 'molekula',
    cfg: {
      sarlavha: 'Metallmas atomi (tashqi qavatda 4–7 ē)',
      tenglama: 'Cl (Z=17): ) 2 ) 8 ) 7 → 1 ē oladi (Cl⁻)',
      rejim: 'atom',
      qavatlar: [2, 8, 7],
      markaz: { belgi: 'Cl', zaryad: '+17', rang: '#38bdf8' },
      metrikalar: [
        { nom: 'Oktetga yetishish', qiymat: '8 ē ga intiladi', foiz: 87, rang: '#38bdf8' },
        { nom: 'Oksidlovchanlik', qiymat: 'Yuqori', foiz: 85, rang: '#34d399' },
      ],
      belgilar: [
        { k: 'Misollar', v: 'C, P, S, Cl', rang: '#38bdf8' },
        { k: 'Jarayon', v: 'ē oladi / umumlashtiradi', rang: '#fbbf24' },
      ],
    },
    pastki: [
      'Misollar: C (2,4), P (2,8,5), S (2,8,6), Cl (2,8,7)',
      'Sakkiztali barqaror oktet uchun elektron oladi',
      'Har davr inert gazning tugallangan qavati bilan tugaydi',
    ],
  },
  {
    id: 'inert',
    tugma: 'Inert gaz (2 / 8 ē)',
    formula: 'He (2) • Ne (2, 8) • Ar (2, 8, 8)',
    tur: 'molekula',
    cfg: {
      sarlavha: 'Inert gaz atomi (tugallangan oktet/duplet)',
      tenglama: 'Ne (Z=10): ) 2 ) 8 → barqaror tashqi qavat',
      rejim: 'atom',
      qavatlar: [2, 8],
      markaz: { belgi: 'Ne', zaryad: '+10', rang: '#a855f7' },
      metrikalar: [
        { nom: 'Qavat to\'lganligi', qiymat: '100% (duplet/oktet)', foiz: 100, rang: '#a855f7' },
        { nom: 'Kimyoviy barqarorlik', qiymat: 'Maksimal', foiz: 96, rang: '#34d399' },
      ],
      belgilar: [
        { k: 'He (K)', v: '2 ē (duplet)', rang: '#a855f7' },
        { k: 'Ne, Ar', v: '8 ē (oktet)', rang: '#34d399' },
      ],
    },
    pastki: [
      'Misollar: He (2), Ne (2,8), Ar (2,8,8)',
      'Tashqi qavati tugallangan — kimyoviy barqaror',
      'Har davr inert gazning tugallangan qavati bilan tugaydi',
    ],
  },
];

function KorgazmaTashqiQavatToifa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Tashqi qavat va kimyoviy faollik (43–44-b)"
      ikon="grafik"
      variantlar={QAVAT_TOIFA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (8-§) VA O'YINLAR (9-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '¹₁H, ²₁H, ³₁H izotoplari nimasi bilan farqlanadi?',
    variantlar: [
      { matn: 'Protonlar soni', togri: false },
      { matn: 'Elektronlar soni', togri: false },
      { matn: 'Neytronlar soni (0, 1, 2) va A', togri: true },
      { matn: 'Jadvaldagi o\'rni', togri: false },
    ],
    izoh: 'Z=1 bir xil, neytronlar 0, 1, 2 ta.',
  },
  {
    id: 't2',
    savol: 'Tabiiy bor (Ar = 10,81) da ¹⁰B va ¹¹B ulushi?',
    variantlar: [
      { matn: '19% ¹⁰B va 81% ¹¹B', togri: true },
      { matn: '81% ¹⁰B va 19% ¹¹B', togri: false },
      { matn: '50% ¹⁰B va 50% ¹¹B', togri: false },
      { matn: '25% ¹⁰B va 75% ¹¹B', togri: false },
    ],
    izoh: '(10x + 11(100−x))/100 = 10,81 → 19% ¹⁰B.',
  },
  {
    id: 't3',
    savol: '⁴⁰₁₈Ar/⁴⁰₂₀Ca va ²⁶₁₂Mg/²⁷₁₃Al juftliklari nima?',
    variantlar: [
      { matn: 'Ikkalasi ham izotop', togri: false },
      { matn: 'Izoton va izotop', togri: false },
      { matn: 'Allotroplar', togri: false },
      { matn: 'Izobarlar (A=40) va Izotonlar (N=14)', togri: true },
    ],
    izoh: 'Ar/Ca: A=40 (izobar); Mg/Al: N=14 (izoton).',
  },
  {
    id: 't4',
    savol: '93% ³⁹K va 7% ⁴⁰K aralashmada Ar(K) nechaga teng?',
    variantlar: [
      { matn: '39,50', togri: false },
      { matn: '39,07', togri: true },
      { matn: '39,93', togri: false },
      { matn: '40,00', togri: false },
    ],
    izoh: '0,93 · 39 + 0,07 · 40 = 39,07.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: '1qavat', nom: '1 qavat (K)', tavsif: '1-davr: H, He' },
    { id: '2qavat', nom: '2 qavat (K, L)', tavsif: '2-davr: Li–Ne' },
    { id: '3qavat', nom: '3 qavat (K, L, M)', tavsif: '3-davr: Na–Ar' },
  ],
  topshiriqlar: [
    { nom: 'H (Z=1)', qisqa: ') 1', guruh: '1qavat', izoh: '1-davr, K=1.' },
    { nom: 'He (Z=2)', qisqa: ') 2 (to\'liq)', guruh: '1qavat', izoh: 'K-qavat 2 ē bilan tugallangan.' },
    { nom: 'Li (Z=3)', qisqa: ') 2 ) 1', guruh: '2qavat', izoh: '2-davr: K=2, L=1.' },
    { nom: 'C (Z=6)', qisqa: ') 2 ) 4', guruh: '2qavat', izoh: '2 qavat: K=2, L=4.' },
    { nom: 'O (Z=8)', qisqa: ') 2 ) 6', guruh: '2qavat', izoh: '2-davr, VI guruh: tashqi 6 ē.' },
    { nom: 'Ne (Z=10)', qisqa: ') 2 ) 8', guruh: '2qavat', izoh: '2-davr inert gazi (2, 8).' },
    { nom: 'Na (Z=11)', qisqa: ') 2 ) 8 ) 1', guruh: '3qavat', izoh: '3-davr: K=2, L=8, M=1.' },
    { nom: 'P (Z=15)', qisqa: ') 2 ) 8 ) 5', guruh: '3qavat', izoh: '3-davr, V guruh: tashqi 5 ē.' },
    { nom: 'Cl (Z=17)', qisqa: ') 2 ) 8 ) 7', guruh: '3qavat', izoh: '3-davr, VII guruh: tashqi 7 ē.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'N = 2n²',
    savol: 'n = 1, 2, 3, 4 qavatlar (K, L, M, N) maksimal sig\'imi?',
    variantlar: ['2, 6, 10, 14 ta', '4, 8, 12, 16 ta', '2, 8, 18, 32 ta', '8, 16, 32, 64 ta'],
    togri: 2,
    izoh: '8-jadval: N = 2n² → 2, 8, 18, 32, 50, 72.',
  },
  {
    belgi: 'Spin',
    savol: 'Bitta orbitalda ko\'pi bilan nechta va qanday ē bo\'ladi?',
    variantlar: ['Qarama-qarshi spinli (↑↓) 2 ē', '1 ta elektron', 'Bir xil spinli 3 ē', '8 ta elektron'],
    togri: 0,
    izoh: 'Qarama-qarshi yo\'nalishda aylanuvchi 2 ē juftlashadi.',
  },
  {
    belgi: 'Bulut',
    savol: 'Vodorod elektron buluti shakli va radiusi?',
    variantlar: ['Kub, 10 m', 'Chiziq, 1 sm', 'Silindr', 'Sharsimon, r ≈ 0,53·10⁻¹⁰ m'],
    togri: 3,
    izoh: '42-bet: H elektron buluti sharsimon, r = 0,53·10⁻¹⁰ m.',
  },
  {
    belgi: 'Davr = ?',
    savol: 'Elektron qavatlar soni Davriy sistemada nimaga teng?',
    variantlar: ['Guruh raqamiga', 'Davr raqamiga', 'Neytron soniga', 'Atom massasiga'],
    togri: 1,
    izoh: '1-davr → 1 qavat, 2-davr → 2 qavat, 3-davr → 3 qavat.',
  },
  {
    belgi: 'Taqsimot',
    savol: 'S (Z=16) va Ar (Z=18) qavat taqsimoti?',
    variantlar: ['S: 2, 6, 8 va Ar: 2, 8, 8', 'S: 2, 8, 6 va Ar: 2, 8, 8', 'S: 2, 8, 8 va Ar: 2, 8, 6', 'S: 8, 8 va Ar: 9, 9'],
    togri: 1,
    izoh: 'Z=16: 2+8+6=16; Z=18: 2+8+8=18.',
  },
  {
    belgi: 'Energiya',
    savol: 'Yadrodan uzoqlashganda elektron energiyasi qanday o\'zgaradi?',
    variantlar: ['Kamayadi', 'Nol bo\'ladi', 'O\'zgarmaydi', 'Ortadi (kichigi yadroga yaqin)'],
    togri: 3,
    izoh: '42-bet: kichik energiyali ē yaqin, kattasi uzoq qavatda.',
  },
  {
    belgi: 'O-qavat',
    savol: 'O (n=5) va P (n=6) qavatlarining maksimal sig\'imi?',
    variantlar: ['50 va 72 ta', '18 va 32 ta', '25 va 36 ta', '32 va 50 ta'],
    togri: 0,
    izoh: 'N(O) = 2·5² = 50; N(P) = 2·6² = 72.',
  },
  {
    belgi: 'Sabab',
    savol: 'Nima uchun elektron yadroga qulamaydi?',
    variantlar: ['Yadro itaradi', 'Massasi yo\'q', 'Tortishish markazdan qochma kuchga teng', 'Harakatlanmaydi'],
    togri: 2,
    izoh: '41-bet: katta tezlikdagi aylanish kuchlarni muvozanatlaydi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'K–N qavat sig\'imi',
    vazifa: 'Qavatlarni 2n² sig\'imi ORTISHI bo\'yicha joylang:',
    tartib: ['K (n=1 → 2 ē)', 'L (n=2 → 8 ē)', 'M (n=3 → 18 ē)', 'N (n=4 → 32 ē)'],
    variantlar: ['M (n=3 → 18 ē)', 'K (n=1 → 2 ē)', 'N (n=4 → 32 ē)', 'L (n=2 → 8 ē)'],
  },
  {
    tur: 'Tashqi elektronlar',
    vazifa: '3-davrni tashqi ē soni ORTISHI bo\'yicha joylang:',
    tartib: ['Na (2, 8, 1)', 'Al (2, 8, 3)', 'P (2, 8, 5)', 'Ar (2, 8, 8)'],
    variantlar: ['P (2, 8, 5)', 'Na (2, 8, 1)', 'Ar (2, 8, 8)', 'Al (2, 8, 3)'],
  },
  {
    tur: 'Qavatlar soni',
    vazifa: 'Ishqoriy metallarni qavat soni ORTISHI bo\'yicha tartiblang:',
    tartib: ['Li (2 qavat)', 'Na (3 qavat)', 'K (4 qavat)', 'Rb (5 qavat)'],
    variantlar: ['K (4 qavat)', 'Li (2 qavat)', 'Rb (5 qavat)', 'Na (3 qavat)'],
  },
  {
    tur: 'Litiy atomi to\'lishi',
    vazifa: 'H → He → Li qavat to\'lishini tartiblang:',
    tartib: ['H (K: 1 ē)', 'He (K: 2 ē, ↑↓)', 'K-qavat to\'ldi', 'Li (L: 3-ē)'],
    variantlar: ['K-qavat to\'ldi', 'H (K: 1 ē)', 'Li (L: 3-ē)', 'He (K: 2 ē, ↑↓)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Xossalarning davriy takrorlanish sababi nima?',
    variantlar: ['Neytron ortishi', 'Tashqi qavat tuzilishining takrorlanishi', 'Kasr massa', 'Harorat'],
    togri: 1,
    izoh: 'Li(2,1), Na(2,8,1), K(2,8,8,1) — tashqi qavat takrorlanadi.',
  },
  {
    savol: ') 2 ) 8 ) 4 tuzilishli element qaysi?',
    variantlar: ['C (Z=6)', 'P (Z=15)', 'Mg (Z=12)', 'Si (Z=14)'],
    togri: 3,
    izoh: '2 + 8 + 4 = 14 → Kremniy (3-davr, IV guruh).',
  },
  {
    savol: 'Inert gazlar tashqi qavatida nechtadan ē bor?',
    variantlar: ['He da 2 ē; Ne, Ar da 8 ē', 'He da 8, Ne da 2', 'Ar da 2, Ne da 8', 'Barchada 2 ta'],
    togri: 0,
    izoh: 'He (duplet 2 ē); Ne (2,8) va Ar (2,8,8) oktet.',
  },
  {
    savol: 'N (Z=7) va F (Z=9) qavat taqsimoti?',
    variantlar: ['N(2,7), F(2,5)', 'N(2,8,1), F(2,7)', 'N(2,5), F(2,7)', 'N(1,6), F(1,8)'],
    togri: 2,
    izoh: '2-davr: N = 2,5 (7); F = 2,7 (9).',
  },
  {
    savol: 'n = 1, 2, 3, 4 qavatlar qaysi harflar bilan belgilanadi?',
    variantlar: ['A, B, C, D', 'S, P, D, F', 'K, L, M, N', 'X, Y, Z, W'],
    togri: 2,
    izoh: '42-bet: n = 1..6 → K, L, M, N, O, P.',
  },
  {
    savol: 'Qaysi juftlikning tashqi qavatida ē soni bir xil?',
    variantlar: ['Be (2,2) va Mg (2,8,2)', 'B va C', 'Na va Cl', 'He va Li'],
    togri: 0,
    izoh: 'Be va Mg — IIA guruhcha (tashqida 2 ē).',
  },
  {
    savol: 'Li (Z=3) da 3-elektron nega K-qavatga kirmaydi?',
    variantlar: ['Yadro itaradi', 'K-qavat sig\'imi 2 ē (↑↓)', 'K-qavat bo\'sh', 'Li inert gaz'],
    togri: 1,
    izoh: 'N = 2·1² = 2 → K-qavat faqat 2 ē sig\'diradi.',
  },
  {
    savol: 'Alyuminiy (Z=13) tashqi qavatida nechta ē bor?',
    variantlar: ['1 ta', '2 ta', '8 ta', '3 ta (2, 8, 3)'],
    togri: 3,
    izoh: 'Z = 13: K=2, L=8, M=3.',
  },
];

export default function S8Mavzu9() {
  const korgazmalar = [
    { nom: '1. Elektron bulut', ikon: 'atom', komponent: <KorgazmaElektronBulut /> },
    { nom: '2. 8-jadval: N = 2n²', ikon: 'formula', komponent: <KorgazmaQavatSigimi /> },
    { nom: '3. 1–18 element sxemasi', ikon: 'yadro', komponent: <KorgazmaBirOnSakkiz /> },
    { nom: '4. Spin (↑↓) va qoidalar', ikon: 'uchqun', komponent: <KorgazmaSpinPauli /> },
    { nom: '5. Gomologlar o\'xshashligi', ikon: 'qidiruv', komponent: <KorgazmaGomologlar /> },
    { nom: '6. Tashqi qavat va xossa', ikon: 'grafik', komponent: <KorgazmaTashqiQavatToifa /> },
  ];

  const oyinlar = [
    {
      nom: '1. Qavatlar soni',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-9"
          nom="Elementlarni elektron qavatlar soniga qarab guruhlash"
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
          key="tezkor-9"
          nom="9-§: Elektron qavatlar tuzilishi viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Qavat zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-9"
          nom="Qavat sig'imi va elektron taqsimoti zanjiri"
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
          key="duel-9"
          sarlavha="9-§: Atom elektron qavatlari dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="9-§"
      mavzuNom="Atom elektron qavatlarining tuzilishi"
      oldingiRaqam="8-§"
      oldingiNom="Izotoplar. Izobarlar"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
