'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 7-PARAGRAF
// "Atom yadrosi tarkibi" (Darslik 34-37-betlar)
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
   1-KO'RGAZMA: REZERFORD (1911) ALFA-ZARRALAR TAJRIBASI (35-BET)
═══════════════════════════════════════════════════════════════ */
const REZ_REJIMLAR = [
  { id: 'barchasi', nom: 'Barcha nurlar', izoh: 'Aksariyat α-zarralar to\'g\'ri o\'tadi, ayrimlari og\'adi, ~8000 tadan 1 tasi orqaga qaytadi.' },
  { id: 'togri', nom: "To'g'ri o'tish", izoh: 'Atom hajmining katta qismi bo\'shliq (elektronlar siyrak joylashgan).' },
  { id: 'ogish', nom: "Burchakka og'ish", izoh: 'Musbat zaryadli α-zarralar musbat yadro yonidan o\'tganda elektrostatik itariladi.' },
  { id: 'qaytish', nom: 'Orqaga qaytish (~1/8000)', izoh: 'Markazda og\'ir, zich va musbat zaryadli kichik yadro borligini isbotladi.' },
];

function KorgazmaRezerford() {
  const canvasRef = useRef(null);
  const [rejim, setRejim] = useState('barchasi');
  const faol = REZ_REJIMLAR.find((r) => r.id === rejim) || REZ_REJIMLAR[0];

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
      ctx.fillText('E. Rezerford tajribasi (1911): oltin folga orqali α-zarralar sochilishi', 24, 34);

      const nucX = w * 0.56;
      const nucY = h * 0.54;

      // Manba qutisi
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(28, nucY - 36, 92, 72, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText('α-manba', 74, nucY - 4);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '11px "Times New Roman", serif';
      ctx.fillText('(Ra / Po)', 74, nucY + 14);

      // Oltin atomi chegarasi va musbat yadro
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(nucX, nucY, 96, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      chizZarracha(ctx, nucX, nucY, 19, '#ef4444', '+Ze');
      ctx.fillStyle = '#fda4af';
      ctx.font = 'bold 12px "Times New Roman", serif';
      ctx.fillText('Yadro', nucX, nucY + 34);

      // Ekran detektori (yarim doira)
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(nucX, nucY, 138, -Math.PI * 0.72, Math.PI * 0.72);
      ctx.stroke();

      const yOffsets = [
        { dy: -72, type: 'togri' },
        { dy: -52, type: 'togri' },
        { dy: -26, type: 'ogish', angle: -0.52 },
        { dy: 0, type: 'qaytish' },
        { dy: 26, type: 'ogish', angle: 0.52 },
        { dy: 52, type: 'togri' },
        { dy: 72, type: 'togri' },
      ];

      yOffsets.forEach((tr, i) => {
        if (rejim !== 'barchasi' && rejim !== tr.type) return;
        const p = (t * 0.65 + i * 0.14) % 1;
        const sy = nucY + tr.dy;

        ctx.strokeStyle =
          tr.type === 'qaytish'
            ? 'rgba(244, 63, 94, 0.55)'
            : tr.type === 'ogish'
            ? 'rgba(251, 191, 36, 0.55)'
            : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(124, sy);
        if (tr.type === 'togri') {
          ctx.lineTo(w - 52, sy);
        } else if (tr.type === 'ogish') {
          ctx.lineTo(nucX - 18, sy);
          ctx.lineTo(nucX + 122, sy + Math.tan(tr.angle) * 140);
        } else {
          ctx.lineTo(nucX - 24, sy);
          ctx.lineTo(136, sy - 22);
        }
        ctx.stroke();

        let px;
        let py;
        if (tr.type === 'togri') {
          px = 124 + p * (w - 176);
          py = sy;
        } else if (tr.type === 'ogish') {
          const mid = (nucX - 142) / (w - 176);
          if (p < mid) {
            px = 124 + (p / mid) * (nucX - 142);
            py = sy;
          } else {
            const q = (p - mid) / (1 - mid);
            px = nucX - 18 + q * 140;
            py = sy + q * Math.tan(tr.angle) * 140;
          }
        } else {
          if (p < 0.5) {
            px = 124 + (p * 2) * (nucX - 148);
            py = sy;
          } else {
            const q = (p - 0.5) * 2;
            px = nucX - 24 - q * (nucX - 160);
            py = sy - q * 22;
          }
        }
        chizZarracha(
          ctx,
          px,
          py,
          6,
          tr.type === 'qaytish' ? '#fb7185' : tr.type === 'ogish' ? '#fde047' : '#38bdf8',
          'α'
        );
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [rejim]);

  return (
    <KorgazmaRamka
      sarlavha="1. Rezerford (1911) α-zarralar sochilish tajribasi (35-bet)"
      qisqaFormula="~8000 tadan 1 tasi orqaga qaytadi → atomda og'ir, musbat, kichik yadro mavjud"
      ikon="nurlar"
      boshqaruv={
        <>
          {REZ_REJIMLAR.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setRejim(r.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                rejim === r.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {r.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Atom o&apos;lchami: ~10⁻¹⁰ m • Yadro o&apos;lchami: ~10⁻¹⁵ m
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Yadro diametri atomdan ~100 000 marta kichik
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
   2-KO'RGAZMA: ATOMNING PLANETAR MODELI (35-BET)
═══════════════════════════════════════════════════════════════ */
const PLANETAR_ATOMLAR = [
  { belgi: 'H', nom: 'Vodorod', z: 1, ar: 1, p: 1, n: 0, e: 1, qavatlar: [1], rang: '#38bdf8' },
  { belgi: 'He', nom: 'Geliy', z: 2, ar: 4, p: 2, n: 2, e: 2, qavatlar: [2], rang: '#a855f7' },
  { belgi: 'C', nom: 'Uglerod', z: 6, ar: 12, p: 6, n: 6, e: 6, qavatlar: [2, 4], rang: '#34d399' },
  { belgi: 'Al', nom: 'Alyuminiy', z: 13, ar: 27, p: 13, n: 14, e: 13, qavatlar: [2, 8, 3], rang: '#fbbf24' },
];

function KorgazmaPlanetarModel() {
  const canvasRef = useRef(null);
  const [belgi, setBelgi] = useState('Al');
  const faol = PLANETAR_ATOMLAR.find((a) => a.belgi === belgi) || PLANETAR_ATOMLAR[3];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = PLANETAR_ATOMLAR.find((a) => a.belgi === belgi) || PLANETAR_ATOMLAR[3];
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
      ctx.fillText(`Planetar model: +${faol.z} yadro atrofida ${faol.e} ta elektron aylanmoqda`, 24, 34);

      const cx = w * 0.34;
      const cy = h * 0.54;

      faol.qavatlar.forEach((elSoni, qIdx) => {
        const rad = 46 + qIdx * 36;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < elSoni; i++) {
          const ang = t * (1.2 - qIdx * 0.25) + (i * Math.PI * 2) / elSoni;
          const ex = cx + Math.cos(ang) * rad;
          const ey = cy + Math.sin(ang) * rad;
          chizZarracha(ctx, ex, ey, 5.5, '#38bdf8', '-');
        }
      });

      chizZarracha(ctx, cx, cy, 20, '#ef4444', `+${faol.z}`);

      const rx = w * 0.58;
      const rw = w * 0.38;
      const ry = 66;
      const rh = h - 98;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      const info = [
        ['Element:', `${faol.nom} (${faol.belgi})`],
        ['Tartib raqami Z:', `${faol.z} (yadro zaryadi +${faol.z})`],
        ['Protonlar (¹₁p):', `${faol.p} ta`],
        ['Neytronlar (¹₀n):', `${faol.n} ta (Ar - Z)`],
        ['Elektronlar (⁰₋₁e):', `${faol.e} ta (neytral atomda p = e)`],
      ];
      info.forEach(([k, v], i) => {
        const y0 = ry + 38 + i * 38;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(k, rx + 18, y0);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(v, rx + 150, y0);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [belgi]);

  return (
    <KorgazmaRamka
      sarlavha="2. Planetar model: +Z va elektron balansi (35–36-b)"
      qisqaFormula="Yadro zaryadi = +Z = protonlar soni = elektronlar soni"
      ikon="atom"
      boshqaruv={
        <>
          {PLANETAR_ATOMLAR.map((a) => (
            <button
              key={a.belgi}
              type="button"
              onClick={() => {
                setBelgi(a.belgi);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                belgi === a.belgi
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {a.nom} ({a.belgi}, Z={a.z})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Yadro zaryadi: +{faol.z} ({faol.p} ta proton)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Elektron qobiq: {faol.e} ta elektron ({faol.qavatlar.join(', ')})
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Atom massasi deyarli to&apos;liq yadroda jamlangan
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: ELEMENTAR ZARRALAR — PROTON, NEYTRON, ELEKTRON
═══════════════════════════════════════════════════════════════ */
const ZARRALAR = [
  { id: 'p', nom: 'Proton', belgi: '¹₁p', zaryad: '+1', massa: '1 m.a.b.', orni: 'Yadroda', rang: '#ef4444', izoh: 'Protonlar soni Z ga teng (¹₁H = 1p).' },
  { id: 'n', nom: 'Neytron', belgi: '¹₀n', zaryad: '0', massa: '1 m.a.b.', orni: 'Yadroda', rang: '#94a3b8', izoh: 'N = Ar − Z; faqat ¹₁H da N = 0.' },
  { id: 'e', nom: 'Elektron', belgi: '⁰₋₁e', zaryad: '−1', massa: '1/1836 m.a.b.', orni: 'Qobiqda', rang: '#38bdf8', izoh: 'Protondan ~1836 marta yengil, zaryadi −1.' },
];

function KorgazmaZarralar() {
  const canvasRef = useRef(null);
  const [tanlov, setTanlov] = useState('p');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = ZARRALAR.find((z) => z.id === tanlov) || ZARRALAR[0];
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
      ctx.fillText('Asosiy zarralar: ¹₁p, ¹₀n, ⁰₋₁e (36-b)', 24, 34);

      const cw = (w - 96) / 3;
      ZARRALAR.forEach((z, idx) => {
        const cx = 36 + idx * (cw + 12);
        const sel = z.id === tanlov;
        ctx.fillStyle = sel ? 'rgba(15, 23, 42, 0.94)' : 'rgba(15, 23, 42, 0.72)';
        ctx.strokeStyle = sel ? '#fde047' : z.rang;
        ctx.lineWidth = sel ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.roundRect(cx, 66, cw, 162, 16);
        ctx.fill();
        ctx.stroke();

        const r = z.id === 'e' ? 12 : 24;
        chizZarracha(ctx, cx + cw / 2, 114 + (sel ? Math.sin(t * 2) * 3 : 0), r, z.rang, z.belgi);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 16px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(z.nom, cx + cw / 2, 166);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(`Zaryad: ${z.zaryad}`, cx + cw / 2, 190);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Times New Roman", serif';
        ctx.fillText(z.massa, cx + cw / 2, 212);
      });

      const py = 248;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(36, py, w - 72, h - py - 20, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${faol.nom} (${faol.belgi}) • ${faol.orni} • ${faol.massa}`, 56, py + 32);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px "Times New Roman", serif';
      ctx.fillText(faol.izoh, 56, py + 62);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlov]);

  return (
    <KorgazmaRamka
      sarlavha="3. ¹₁p, ¹₀n, ⁰₋₁e zarrachalari (36-b)"
      qisqaFormula="m(¹₁p)≈1 • m(¹₀n)≈1 • m(⁰₋₁e)≈1/1836 • p + n = nuklon"
      ikon="yadro"
      boshqaruv={
        <>
          {ZARRALAR.map((z) => (
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
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Proton (¹₁p): zaryad +1, massa 1 m.a.b.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-slate-300">
            Neytron (¹₀n): zaryad 0, massa 1 m.a.b.
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Elektron (⁰₋₁e): zaryad −1, massa ~1836 marta yengil
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: NUKLON HISOBLAGICH VA 4-MASHQ (Na, P, Ar, Al, Fe, Pb)
═══════════════════════════════════════════════════════════════ */
const MASHQ_YADROLAR = [
  { belgi: 'H', nom: 'Vodorod', z: 1, ar: 1, rang: '#38bdf8' },
  { belgi: 'Na', nom: 'Natriy', z: 11, ar: 23, rang: '#f472b6' },
  { belgi: 'Al', nom: 'Alyuminiy', z: 13, ar: 27, rang: '#34d399' },
  { belgi: 'P', nom: 'Fosfor', z: 15, ar: 31, rang: '#60a5fa' },
  { belgi: 'Ar', nom: 'Argon', z: 18, ar: 40, rang: '#a855f7' },
  { belgi: 'Fe', nom: 'Temir', z: 26, ar: 56, rang: '#fbbf24' },
  { belgi: 'Pb', nom: "Qo'rg'oshin", z: 82, ar: 207, rang: '#f87171' },
];

function KorgazmaYadroKalkulyator() {
  const canvasRef = useRef(null);
  const [belgi, setBelgi] = useState('Al');
  const faol = MASHQ_YADROLAR.find((e) => e.belgi === belgi) || MASHQ_YADROLAR[2];
  const neytron = faol.ar - faol.z;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = MASHQ_YADROLAR.find((e) => e.belgi === belgi) || MASHQ_YADROLAR[2];
    const neytron = faol.ar - faol.z;
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
      ctx.fillText(`4-mashq (37-bet): ${faol.nom} yadrosi — N = Ar − Z = ${faol.ar} − ${faol.z} = ${neytron} ta neytron`, 24, 34);

      const cx = w * 0.27;
      const cy = h * 0.56;
      const maxDraw = Math.min(faol.ar, 44);
      for (let i = 0; i < maxDraw; i++) {
        const ang = i * 2.39996 + t * 0.15;
        const rad = Math.sqrt(i + 0.5) * 8.2;
        const isProton = i % 2 === 0 && i / 2 < faol.z;
        chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 7, isProton ? '#ef4444' : '#94a3b8', '');
      }

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${faol.ar}`, cx - 38, cy - 68);
      ctx.fillText(`${faol.z}`, cx - 38, cy - 46);
      ctx.font = 'bold 26px "Times New Roman", serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(faol.belgi, cx, cy - 52);

      const rx = w * 0.52;
      const rw = w * 0.44;
      const ry = 66;
      const rh = h - 98;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      const cards = [
        { k: 'Protonlar soni (p = Z)', v: `${faol.z} ta (+${faol.z})`, r: '#ef4444' },
        { k: 'Neytronlar soni (N = Ar − Z)', v: `${neytron} ta (${faol.ar} − ${faol.z})`, r: '#cbd5e1' },
        { k: 'Elektronlar soni (e = Z)', v: `${faol.z} ta`, r: '#38bdf8' },
        { k: 'Nuklonlar (Ar = p + n)', v: `${faol.ar} ta`, r: '#fde047' },
      ];
      cards.forEach((c, i) => {
        const y0 = ry + 26 + i * 58;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
        ctx.beginPath();
        ctx.roundRect(rx + 18, y0, rw - 36, 46, 10);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(c.k, rx + 28, y0 + 18);

        ctx.fillStyle = c.r;
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.fillText(c.v, rx + 28, y0 + 38);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [belgi]);

  return (
    <KorgazmaRamka
      sarlavha="4. Yadro: Ar = Z + N va 4-mashq (36–37-b)"
      qisqaFormula="N = Ar − Z • H (1p, 0n) • Na (11p, 12n) • Ar (18p, 22n) • Pb (82p, 125n)"
      ikon="formula"
      boshqaruv={
        <>
          {MASHQ_YADROLAR.map((el) => (
            <button
              key={el.belgi}
              type="button"
              onClick={() => {
                setBelgi(el.belgi);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                belgi === el.belgi
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {el.belgi} ({el.z}/{el.ar})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-rose-300">
            Protonlar = {faol.z} • Elektronlar = {faol.z}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-slate-200">
            Neytronlar: N = {faol.ar} − {faol.z} = {neytron}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            {faol.belgi === 'H' ? 'Faqat oddiy vodorod yadrosida neytron yo\'q (N=0)' : `Yadroda jami ${faol.ar} ta nuklon bor`}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: YENGIL VA OG'IR YADROLARDA N/Z NISBATI GRAFIGI
═══════════════════════════════════════════════════════════════ */
const NZ_VARIANTLAR = [
  {
    id: 'yengil',
    tugma: 'Yengil yadrolar (N ≈ Z)',
    formula: 'Na (11p, 12n) • Al (13p, 14n) • P (15p, 16n)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Yengil elementlarda neytronlar va protonlar',
      tenglama: 'N = Ar − Z  (yengil yadrolarda N ≈ Z)',
      qadamlar: [
        { belgi: 'Na (Z=11)', natija: 'N = 23 − 11 = 12', izoh: '11p + 12n = 23', rang: '#f472b6' },
        { belgi: 'Al (Z=13)', natija: 'N = 27 − 13 = 14', izoh: '13p + 14n = 27', rang: '#34d399' },
        { belgi: 'P (Z=15)', natija: 'N = 31 − 15 = 16', izoh: '15p + 16n = 31', rang: '#60a5fa' },
      ],
      taqqosBars: [
        { nom: '¹₁H (N=0)', foiz: 5, qiymat: '1p, 0n', rang: '#38bdf8' },
        { nom: '²³Na (N=12)', foiz: 52, qiymat: '11p, 12n', rang: '#f472b6' },
        { nom: '²⁷Al (N=14)', foiz: 54, qiymat: '13p, 14n', rang: '#34d399' },
        { nom: '³¹P (N=16)', foiz: 56, qiymat: '15p, 16n', rang: '#60a5fa' },
      ],
      javobBadge: 'Yengil yadro: N ≈ Z',
    },
    pastki: ['¹₁H yadrosida N = 0', 'Na, Al, P da N = Z + 1', 'Ar = p⁺ + n⁰'],
  },
  {
    id: 'ogir',
    tugma: "Og'ir yadrolar (N > Z)",
    formula: 'Ar (18p, 22n) • Fe (26p, 30n) • Pb (82p, 125n)',
    tur: 'hisob',
    cfg: {
      sarlavha: "Og'ir yadrolarda neytronlar protondan ko'p (N > Z)",
      tenglama: 'Pb (Z=82, Ar=207) → N = 125 > Z = 82',
      qadamlar: [
        { belgi: 'Ar (Z=18)', natija: 'N = 40 − 18 = 22', izoh: '22n > 18p', rang: '#a78bfa' },
        { belgi: 'Fe (Z=26)', natija: 'N = 56 − 26 = 30', izoh: '30n > 26p', rang: '#fbbf24' },
        { belgi: 'Pb (Z=82)', natija: 'N = 207 − 82 = 125', izoh: '125n >> 82p', rang: '#fb923c' },
      ],
      taqqosBars: [
        { nom: '⁴⁰Ar (22n)', foiz: 55, qiymat: '18p / 22n', rang: '#a78bfa' },
        { nom: '⁵⁶Fe (30n)', foiz: 65, qiymat: '26p / 30n', rang: '#fbbf24' },
        { nom: '²⁰⁷Pb (125n)', foiz: 92, qiymat: '82p / 125n', rang: '#fb923c' },
      ],
      javobBadge: "Og'ir yadro: N >> Z",
    },
    pastki: ['Z ortgan sari N/Z ortadi', 'Pb da 125 n va 82 p', 'Barqarorlik uchun N ko\'p'],
  },
];

function KorgazmaNzGrafik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Proton (Z) va neytron (N) nisbati (36–37-b)"
      ikon="grafik"
      variantlar={NZ_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: ATOM TUZILISHI HAQIDAGI QARASHLAR RIVOJI (34-36-BET)
═══════════════════════════════════════════════════════════════ */
const TARIX_VARIANTLAR = [
  {
    id: 'sharq',
    tugma: '1. Demokrit & Beruniy',
    formula: 'Mil. avv. V asr – XI asr: "atomos" va bo\'linish g\'oyasi',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: 'Demokrit (bo\'linmas) → Beruniy / Ar-Roziy',
      markaz: { belgi: 'Atom', zaryad: 'XI asr', rang: '#f472b6', r: 30 },
      qavatlar: [],
      metrikalar: [{ nom: 'Beruniy fikri', qiymat: 'Bo\'linishi mumkin', foiz: 45, rang: '#f472b6' }],
      belgilar: [{ k: 'Demokrit', v: 'Atomos (bo\'linmas)', rang: '#94a3b8' }, { k: 'Sharq', v: 'Mayda bo\'lakli tuzilish', rang: '#fde047' }],
    },
    pastki: ['Demokrit: "atomos" g\'oyasi', 'Ar-Roziy & Beruniy: bo\'linadi', 'Darslik 34-bet'],
  },
  {
    id: 'tomson',
    tugma: '2. J. Tomson (1897)',
    formula: 'Elektron (⁻) kashfi: musbat shar ichida elektronlar',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: '1897–1904: Tomsonning "keks" modeli',
      markaz: { belgi: '+', zaryad: '+Shar', rang: '#38bdf8', r: 32 },
      qavatlar: [4],
      metrikalar: [{ nom: 'Yangi zarra', qiymat: 'Elektron (⁰₋₁e)', foiz: 65, rang: '#38bdf8' }],
      belgilar: [{ k: 'Kashfiyot', v: 'Elektron (−)', rang: '#38bdf8' }, { k: 'Kamchilik', v: 'Markaziy yadro yo\'q', rang: '#f43f5e' }],
    },
    pastki: ['Elektron kashf etildi', 'Musbat shar + manfiy ē', 'Yadro hali ochilmagan'],
  },
  {
    id: 'rezerford',
    tugma: '3. Rezerford (1911)',
    formula: 'α-zarralar tajribasi → kichik musbat yadro (+Z)',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: '1911: Planetar model (+Z markaziy yadro)',
      markaz: { belgi: '+Z', zaryad: '10⁻¹⁵ m', rang: '#fbbf24', r: 22 },
      qavatlar: [2, 6],
      metrikalar: [{ nom: 'Tajriba', qiymat: '1/8000 α qaytdi', foiz: 85, rang: '#fbbf24' }],
      belgilar: [{ k: 'Yadro', v: '~10⁻¹⁵ m (zich)', rang: '#fbbf24' }, { k: 'Atom', v: '~10⁻¹⁰ m (bo\'shliq)', rang: '#38bdf8' }],
    },
    pastki: ['1911-yil oltin folga tajribasi', 'Musbat og\'ir yadro kashfi', 'Elektronlar orbitada aylanadi'],
  },
  {
    id: 'yadro1932',
    tugma: '4. Proton-neytron (1932)',
    formula: 'Ivanenko va Geyzenberg: yadro = proton (p⁺) + neytron (n⁰)',
    tur: 'molekula',
    cfg: {
      rejim: 'atom',
      sarlavha: '1932: Proton-neytron yadro nazariyasi',
      markaz: { belgi: 'p+n', zaryad: 'Nuklon', rang: '#34d399', r: 25 },
      qavatlar: [2, 8, 3],
      metrikalar: [{ nom: 'Yadro tarkibi', qiymat: 'Ar = Z(p) + N(n)', foiz: 100, rang: '#34d399' }],
      belgilar: [{ k: 'Chedvik', v: 'Neytron ¹₀n (1932)', rang: '#94a3b8' }, { k: 'Nazariya', v: 'Ivanenko–Geyzenberg', rang: '#34d399' }],
    },
    pastki: ['Chedvik: neytron (1932)', 'Ivanenko & Geyzenberg', 'Ar = Z(p) + N(n)'],
  },
];

function KorgazmaAtomTarixi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Atom modellari evolyutsiyasi (34–36-b)"
      ikon="vaqt"
      variantlar={TARIX_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (6-§) VA O'YINLAR (7-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Katta davrlar qaysilar va necha qatordan iborat?',
    variantlar: [
      { matn: '1, 2, 3-davrlar; 1 qatordan', togri: false },
      { matn: 'Faqat 7-davr; 3 qatordan', togri: false },
      { matn: '4, 5, 6, 7-davrlar; juft va toq 2 qator', togri: true },
      { matn: '2 va 3-davrlar; 18 tadan', togri: false },
    ],
    izoh: '1–3 kichik (2, 8, 8), 4–7 katta (18, 18, 32, 32).',
  },
  {
    id: 't2',
    savol: 'Eng kuchli metall va eng kuchli metallmas?',
    variantlar: [
      { matn: 'Fransiy (Fr) va Ftor (F)', togri: true },
      { matn: 'Litiy (Li) va Yod (I)', togri: false },
      { matn: 'Oltin (Au) va Kislorod (O)', togri: false },
      { matn: 'Vodorod (H) va Neon (Ne)', togri: false },
    ],
    izoh: 'Pastki chap — Fr, yuqori o\'ng — F.',
  },
  {
    id: 't3',
    savol: "Bosh (A) va qo'shimcha (B) guruhcha farqi?",
    variantlar: [
      { matn: 'Bosh guruhchada faqat gazlar', togri: false },
      { matn: "Qo'shimcha faqat kichik davrda", togri: false },
      { matn: 'Ikkalasi ham metallmas', togri: false },
      { matn: "A — kichik+katta; B — faqat katta davr metallari", togri: true },
    ],
    izoh: 'Cu, Ag, Au (IB) kabi B elementlar faqat katta davrda.',
  },
  {
    id: 't4',
    savol: 'E₂O₅ da w(E) = 65,2% bo\'lsa, bu qaysi element?',
    variantlar: [
      { matn: 'Fosfor (P, 31)', togri: false },
      { matn: 'Mishyak (As, Ar=75, Z=33)', togri: true },
      { matn: 'Azot (N, 14)', togri: false },
      { matn: 'Vismut (Bi, 209)', togri: false },
    ],
    izoh: '2Ar/(2Ar+80) = 0,652 → Ar = 75 → As.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'proton', nom: 'Proton (¹₁p)', tavsif: 'Yadroda, +1 zaryad' },
    { id: 'neytron', nom: 'Neytron (¹₀n)', tavsif: 'Yadroda, 0 zaryad, Ar − Z' },
    { id: 'elektron', nom: 'Elektron (⁰₋₁e)', tavsif: 'Qobiqda, −1 zaryad, ~0 massa' },
  ],
  topshiriqlar: [
    { nom: 'Zaryad +1, massa 1', qisqa: 'Tartib raqami Z', guruh: 'proton', izoh: 'Proton soni Z ni beradi.' },
    { nom: '¹₁H (protiy) yadrosi', qisqa: '1 ta nuklon', guruh: 'proton', izoh: 'Oddiy H yadrosida 1p, 0n.' },
    { nom: 'Al da 13 ta (+13)', qisqa: 'Yadro zaryadi', guruh: 'proton', izoh: 'Al yadrosida 13 ta proton bor.' },
    { nom: 'Zaryad 0, massa 1', qisqa: 'Neytral zarra', guruh: 'neytron', izoh: 'Neytron zaryadi 0.' },
    { nom: 'Al da 14 ta (27−13)', qisqa: 'Ar − Z natija', guruh: 'neytron', izoh: '27 − 13 = 14 ta neytron.' },
    { nom: 'Pb da 125 ta (207−82)', qisqa: "Og'ir yadro", guruh: 'neytron', izoh: '207 − 82 = 125 ta neytron.' },
    { nom: 'Massa ~1/1836 m.a.b.', qisqa: 'Eng yengil', guruh: 'elektron', izoh: 'Protondan 1836 marta yengil.' },
    { nom: 'Zaryad −1, qobiqda', qisqa: "Bog' tashuvchi", guruh: 'elektron', izoh: 'Yadro atrofida aylanadi.' },
    { nom: 'Tomson ochgan (1897)', qisqa: '⁰₋₁e zarra', guruh: 'elektron', izoh: 'Birinchi ochilgan elementar zarra.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '1911-yil',
    savol: 'Atom markazida kichik musbat yadro borligini kim isbotladi?',
    variantlar: ['Dmitriy Mendeleyev', 'Ernest Rezerford', 'Jon Dalton', 'Yakov Berselius'],
    togri: 1,
    izoh: '1911-yil oltin folga tajribasida Rezerford isbotladi.',
  },
  {
    belgi: '1 / 8000',
    savol: 'Tajribada α-zarralarning qanchasi orqaga qaytdi?',
    variantlar: ['Yarmi (50%)', 'Hammasi (100%)', 'Har 8000 tadan ~1 tasi', 'Hech qaysi'],
    togri: 2,
    izoh: 'Yadro atom hajmiga nisbatan juda kichik.',
  },
  {
    belgi: 'Vodorod',
    savol: 'Oddiy vodorod (¹₁H) yadrosida nechta proton va neytron bor?',
    variantlar: ['1p, 0n', '1p, 1n', '0p, 1n', '2p, 2n'],
    togri: 0,
    izoh: 'Z=1, Ar=1 → N = 1 − 1 = 0.',
  },
  {
    belgi: '4-mashq',
    savol: '²⁷₁₃Al va ⁴⁰₁₈Ar yadrolarida nechtadan neytron bor?',
    variantlar: ['13 va 18', '27 va 40', '12 va 16', '14 va 22'],
    togri: 3,
    izoh: 'Al: 27−13=14; Ar: 40−18=22.',
  },
  {
    belgi: "O'lcham",
    savol: 'Yadro diametri atom diametridan necha marta kichik?',
    variantlar: ['2 marta', '10 marta', '~100 000 marta', 'Teng'],
    togri: 2,
    izoh: 'Atom ~10⁻¹⁰ m, yadro ~10⁻¹⁵ m.',
  },
  {
    belgi: 'Massa',
    savol: 'Elektron massasi protondan necha marta kichik?',
    variantlar: ['2 marta', '100 marta', "Protondan og'ir", '~1836 marta'],
    togri: 3,
    izoh: 'm(e) ≈ 1/1836,1 m.a.b.',
  },
  {
    belgi: '4-mashq Pb',
    savol: '²⁰⁷₈₂Pb atomida proton, neytron, elektron soni?',
    variantlar: ['82 p, 125 n, 82 e', '82 p, 82 n, 125 e', '125 p, 82 n, 82 e', '207 p, 82 n, 82 e'],
    togri: 0,
    izoh: 'Z=82 (p=e=82), N=207−82=125.',
  },
  {
    belgi: 'Zaryad',
    savol: 'Atom nega elektroneytral?',
    variantlar: ['Yadroda zaryad yo\'q', 'Proton (+Z) = elektron (−Z)', 'Elektronlar musbat', 'Neytronlar manfiy'],
    togri: 1,
    izoh: '+Z + (−Z) = 0.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Neytronlar soni',
    vazifa: 'Yadrolarni neytron soni ORTISHIGA ko\'ra tartiblang:',
    tartib: ['Na (12 n)', 'Al (14 n)', 'P (16 n)', 'Ar (22 n)'],
    variantlar: ['P (16 n)', 'Na (12 n)', 'Ar (22 n)', 'Al (14 n)'],
  },
  {
    tur: 'Atom modellari',
    vazifa: 'Modellarni tarixiy tartibda joylang:',
    tartib: ['Demokrit / Beruniy', 'Tomson (ē)', 'Rezerford (1911)', 'Ivanenko–Geyzenberg (1932)'],
    variantlar: ['Rezerford (1911)', 'Demokrit / Beruniy', 'Ivanenko–Geyzenberg (1932)', 'Tomson (ē)'],
  },
  {
    tur: 'Massa taqqoslash',
    vazifa: 'Zarralarni massasi KICHIGIdan KATTAsiga tartiblang:',
    tartib: ['Elektron (1/1836)', 'Proton (1)', '⁴₂He yadrosi (4)', '²⁷₁₃Al atomi (27)'],
    variantlar: ['⁴₂He yadrosi (4)', 'Elektron (1/1836)', '²⁷₁₃Al atomi (27)', 'Proton (1)'],
  },
  {
    tur: 'Yadro zaryadi (Z)',
    vazifa: 'Atomlarni yadro zaryadi (+Z) ORTISHIGA ko\'ra joylang:',
    tartib: ['Na (+11)', 'P (+15)', 'Fe (+26)', 'Pb (+82)'],
    variantlar: ['Fe (+26)', 'Na (+11)', 'Pb (+82)', 'P (+15)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '²³₁₁Na va ⁵⁶₂₆Fe yadrolaridagi neytronlar soni?',
    variantlar: ['11 va 26', '12 (Na) va 30 (Fe)', '23 va 56', '14 va 22'],
    togri: 1,
    izoh: 'Na: 23−11=12; Fe: 56−26=30.',
  },
  {
    savol: 'Proton-neytron yadro nazariyasini kimlar yaratgan?',
    variantlar: ['Dalton va Prust', 'Debereyner va Nyulends', 'Beruniy va Ibn Sino', 'Ivanenko va Geyzenberg'],
    togri: 3,
    izoh: '1932-yilda Chedvik neytronni ochgach asoslangan.',
  },
  {
    savol: '15 proton va 16 neytronli atomning Z va Ar qiymati?',
    variantlar: ['Z=15, Ar=31 (P)', 'Z=16, Ar=31', 'Z=31, Ar=15', 'Z=15, Ar=16'],
    togri: 0,
    izoh: 'Z=15 (Fosfor), Ar=15+16=31.',
  },
  {
    savol: "Rezerford tajribasida α-zarralar og'may o'tishi nimani anglatdi?",
    variantlar: ['Folga teshik', 'α-zarra zaryadsiz', "Atom asosan bo'shliq, yadro juda kichik", 'Atom qattiq shar'],
    togri: 2,
    izoh: 'Yadro diametri atomdan ~100 000 marta kichik.',
  },
  {
    savol: '¹₁p, ¹₀n, ⁰₋₁e yozuvida pastki indeks nima?',
    variantlar: ['Tezlik', 'Zichlik', 'Elektr zaryadi (+1, 0, −1)', 'Harorat'],
    togri: 2,
    izoh: 'Yuqori indeks — massa, pastki — elektr zaryad.',
  },
  {
    savol: 'Yadro tarkibiga qaysi zarra KIRMAYDI?',
    variantlar: ['Elektron', 'Proton', 'Neytron', 'Nuklon'],
    togri: 0,
    izoh: 'Elektron yadro tashqarisidagi qobiqda bo\'ladi.',
  },
  {
    savol: "Beruniy va Ar-Roziy Demokritdan farqli nima degan?",
    variantlar: ["Modda suvdan iborat", "Atomlar bo'linishi mumkin", "Atomlar yo'q", "Hamma atom bir xil"],
    togri: 1,
    izoh: '34-bet: atomlarning mayda bo\'laklari va bo\'linishi.',
  },
  {
    savol: '⁴⁰₂₀Ca atomidagi jami zarralar (p + n + e) soni?',
    variantlar: ['40 ta', '20 ta', '80 ta', '60 ta (20p+20n+20e)'],
    togri: 3,
    izoh: '20 proton + 20 neytron + 20 elektron = 60.',
  },
];

export default function S8Mavzu7() {
  const korgazmalar = [
    { nom: '1. Rezerford tajribasi', ikon: 'nurlar', komponent: <KorgazmaRezerford /> },
    { nom: '2. Planetar model', ikon: 'atom', komponent: <KorgazmaPlanetarModel /> },
    { nom: '3. ¹₁p, ¹₀n, ⁰₋₁e zarralari', ikon: 'yadro', komponent: <KorgazmaZarralar /> },
    { nom: '4. 4-mashq kalkulyatori', ikon: 'formula', komponent: <KorgazmaYadroKalkulyator /> },
    { nom: '5. N va Z grafigi', ikon: 'grafik', komponent: <KorgazmaNzGrafik /> },
    { nom: '6. Tarixiy qarashlar', ikon: 'vaqt', komponent: <KorgazmaAtomTarixi /> },
  ];

  const oyinlar = [
    {
      nom: '1. Zarralar guruhi',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-7"
          nom="Atom zarralarini tavsifi bo'yicha guruhlash"
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
          key="tezkor-7"
          nom="7-§: Atom yadrosi tarkibi viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Yadro zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-7"
          nom="Neytronlar va modellar tarixi zanjiri"
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
          key="duel-7"
          sarlavha="7-§: Atom yadrosi tarkibi dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="7-§"
      mavzuNom="Atom yadrosi tarkibi"
      oldingiRaqam="6-§"
      oldingiNom="Kimyoviy elementlar davriy sistemasi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
