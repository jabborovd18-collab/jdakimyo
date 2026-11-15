'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 6-PARAGRAF
// "Kimyoviy elementlar davriy sistemasi" (Darslik 31-33-betlar)
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
   1-KO'RGAZMA: 7 DAVR — KICHIK VA KATTA DAVRLAR (31-32-BET)
═══════════════════════════════════════════════════════════════ */
const DAVRLAR = [
  { num: 1, turi: 'Kichik', qatorlar: '1 qator', soni: 2, boshi: 'H (1)', oxiri: 'He (2)', eslatma: 'Eng qisqa davr: H va He.', rang: '#38bdf8' },
  { num: 2, turi: 'Kichik', qatorlar: '1 qator', soni: 8, boshi: 'Li (3)', oxiri: 'Ne (10)', eslatma: 'Li dan Ne gacha 8 element.', rang: '#34d399' },
  { num: 3, turi: 'Kichik', qatorlar: '1 qator', soni: 8, boshi: 'Na (11)', oxiri: 'Ar (18)', eslatma: 'Na dan Ar gacha 8 element.', rang: '#a3e635' },
  { num: 4, turi: 'Katta', qatorlar: '2 qator', soni: 18, boshi: 'K (19)', oxiri: 'Kr (36)', eslatma: 'Sc–Ni oraliq metallari bor.', rang: '#fbbf24' },
  { num: 5, turi: 'Katta', qatorlar: '2 qator', soni: 18, boshi: 'Rb (37)', oxiri: 'Xe (54)', eslatma: 'Y–Pd oraliq metallari kiradi.', rang: '#fb923c' },
  { num: 6, turi: 'Katta', qatorlar: '2 qator (+14 La*)', soni: 32, boshi: 'Cs (55)', oxiri: 'Rn (86)', eslatma: '14 ta lantanoid pastda berilgan.', rang: '#f472b6' },
  { num: 7, turi: 'Tugallangan', qatorlar: '2 qator (+14 Ac*)', soni: 32, boshi: 'Fr (87)', oxiri: 'Og (118)', eslatma: '14 ta aktinoid (Z=87..118).', rang: '#c084fc' },
];

function KorgazmaDavrlar() {
  const canvasRef = useRef(null);
  const [davrNum, setDavrNum] = useState(4);
  const faol = DAVRLAR.find((d) => d.num === davrNum) || DAVRLAR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = DAVRLAR.find((d) => d.num === davrNum) || DAVRLAR[0];
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
      ctx.fillText('Davriy sistemada 7 ta davr: 1–3 kichik (1 qator), 4–7 katta (2 qator)', 24, 34);

      const startX = 36;
      const startY = 62;
      const barMaxW = w * 0.56;
      const rowH = (h - 94) / 7;

      DAVRLAR.forEach((d, idx) => {
        const y = startY + idx * rowH;
        const barW = Math.max(46, (d.soni / 32) * barMaxW);
        const sel = d.num === davrNum;

        ctx.fillStyle = sel ? d.rang : `${d.rang}66`;
        ctx.strokeStyle = sel ? '#ffffff' : d.rang;
        ctx.lineWidth = sel ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(startX, y + 4, barW, rowH - 10, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${d.num}-davr (${d.soni})`, startX + 10, y + rowH / 2 + 4);
      });

      const rx = w * 0.63;
      const rw = w * 0.34;
      const ry = 62;
      const rh = h - 94;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 16);
      ctx.fill();
      ctx.stroke();

      chizZarracha(ctx, rx + 42, ry + 42, 18 + Math.sin(t * 2) * 1.5, faol.rang, `${faol.num}`);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.fillText(`${faol.num}-davr`, rx + 72, ry + 38);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(`${faol.turi} • ${faol.soni} ta element`, rx + 72, ry + 58);

      const qatorlar = [
        ['Qator tuzilishi:', faol.qatorlar],
        ['Boshlanishi:', faol.boshi],
        ['Tugashi:', faol.oxiri],
      ];
      qatorlar.forEach(([k, v], i) => {
        const qy = ry + 96 + i * 38;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Times New Roman", serif';
        ctx.fillText(k, rx + 18, qy);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(v, rx + 125, qy);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(faol.eslatma, rx + 18, ry + 220);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [davrNum]);

  return (
    <KorgazmaRamka
      sarlavha="1. 7 ta davr tuzilishi (31–32-b)"
      qisqaFormula="Ishqoriy metall (H) → Inert gaz • 2, 8, 8, 18, 18, 32, 32"
      ikon="grafik"
      boshqaruv={
        <>
          {DAVRLAR.map((d) => (
            <button
              key={d.num}
              type="button"
              onClick={() => {
                setDavrNum(d.num);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                davrNum === d.num
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {d.num}-davr ({d.soni})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Kichik (1–3): 1 qator (2, 8, 8)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Katta (4–7): 2 qator (18, 18, 32, 32)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            6–7-davrda 14 tadan La* va Ac*
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 8 GURUH — BOSH (A) VA QO'SHIMCHA (B) GURUHLAR
═══════════════════════════════════════════════════════════════ */
const GURUHLAR_DATA = [
  { rim: 'I', nom: 'I guruh', bosh: ['H*', 'Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'], qoshimcha: ['Cu', 'Ag', 'Au'], oksid: 'R₂O', gidrid: '—', rang: '#f472b6', izoh: 'Ishqoriy metallar + mis oilasi.' },
  { rim: 'II', nom: 'II guruh', bosh: ['Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Ra'], qoshimcha: ['Zn', 'Cd', 'Hg'], oksid: 'RO', gidrid: '—', rang: '#fbbf24', izoh: 'Ishqoriy-yer + rux oilasi.' },
  { rim: 'III', nom: 'III guruh', bosh: ['B', 'Al', 'Ga', 'In', 'Tl'], qoshimcha: ['Sc', 'Y', 'La*', 'Ac*'], oksid: 'R₂O₃', gidrid: '—', rang: '#34d399', izoh: 'La* va Ac* ham IIIB ga kiradi.' },
  { rim: 'IV', nom: 'IV guruh', bosh: ['C', 'Si', 'Ge', 'Sn', 'Pb'], qoshimcha: ['Ti', 'Zr', 'Hf'], oksid: 'RO₂', gidrid: 'RH₄', rang: '#38bdf8', izoh: 'Oksid RO₂, gidrid RH₄.' },
  { rim: 'V', nom: 'V guruh', bosh: ['N', 'P', 'As', 'Sb', 'Bi'], qoshimcha: ['V', 'Nb', 'Ta'], oksid: 'R₂O₅', gidrid: 'RH₃', rang: '#60a5fa', izoh: 'O bilan V, H bilan III valentli.' },
  { rim: 'VI', nom: 'VI guruh', bosh: ['O', 'S', 'Se', 'Te', 'Po'], qoshimcha: ['Cr', 'Mo', 'W'], oksid: 'RO₃', gidrid: 'H₂R', rang: '#a78bfa', izoh: 'O VI oksid bermaydi; Cr oilasi.' },
  { rim: 'VII', nom: 'VII guruh', bosh: ['F', 'Cl', 'Br', 'I', 'At'], qoshimcha: ['Mn', 'Tc', 'Re'], oksid: 'R₂O₇', gidrid: 'HR', rang: '#2dd4bf', izoh: 'Galogenlar (F bundan mustasno).' },
  { rim: 'VIII', nom: 'VIII guruh', bosh: ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn'], qoshimcha: ['Fe, Co, Ni', 'Ru, Rh, Pd', 'Os, Ir, Pt'], oksid: 'RO₄', gidrid: '—', rang: '#c084fc', izoh: 'Inert gazlar + 3 ta metall triadasi.' },
];

function KorgazmaGuruhlar() {
  const canvasRef = useRef(null);
  const [rim, setRim] = useState('I');
  const faol = GURUHLAR_DATA.find((g) => g.rim === rim) || GURUHLAR_DATA[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = GURUHLAR_DATA.find((g) => g.rim === rim) || GURUHLAR_DATA[0];
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
      ctx.fillText(`8 ta guruh: har biri bosh (A) va qo'shimcha (B) guruhchalarga bo'linadi`, 24, 34);

      const leftX = 34;
      const boxW = w * 0.43;
      const boxY = 66;
      const boxH = h - 98;

      [
        { x: leftX, title: `Bosh guruhcha (${faol.rim}A)`, items: faol.bosh, color: faol.rang },
        { x: leftX + boxW + 20, title: `Qo'shimcha guruhcha (${faol.rim}B)`, items: faol.qoshimcha, color: '#94a3b8' },
      ].forEach((panel, pIdx) => {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = panel.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(panel.x, boxY, boxW, boxH, 16);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = panel.color;
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(panel.title, panel.x + boxW / 2, boxY + 28);

        const cols = panel.items.length > 4 ? 4 : 3;
        panel.items.forEach((el, idx) => {
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const cellW = (boxW - 36) / cols;
          const cx = panel.x + 22 + c * cellW + cellW / 2 - 4;
          const cy = boxY + 76 + r * 66 + (pIdx === 0 ? Math.sin(t * 2 + idx) * 2 : 0);
          chizZarracha(ctx, cx, cy, el.length > 3 ? 25 : 21, pIdx === 0 ? faol.rang : '#475569', el);
        });

        if (pIdx === 0) {
          ctx.fillStyle = '#fde047';
          ctx.font = '13px "Times New Roman", serif';
          ctx.textAlign = 'left';
          ctx.fillText(`Oksid: ${faol.oksid} • Gidrid: ${faol.gidrid}`, panel.x + 18, boxY + boxH - 40);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '12px "Times New Roman", serif';
          ctx.fillText(faol.izoh, panel.x + 18, boxY + boxH - 18);
        } else {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '13px "Times New Roman", serif';
          ctx.textAlign = 'left';
          ctx.fillText('Faqat 4–7-davr metallari (B guruhcha)', panel.x + 18, boxY + boxH - 28);
        }
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [rim]);

  return (
    <KorgazmaRamka
      sarlavha="2. Bosh (A) va qo'shimcha (B) guruhchalar (32-b)"
      qisqaFormula="A — kichik/katta davr • B — faqat katta davr metallari"
      ikon="atom"
      boshqaruv={
        <>
          {GURUHLAR_DATA.map((g) => (
            <button
              key={g.rim}
              type="button"
              onClick={() => {
                setRim(g.rim);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                rim === g.rim
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {g.rim} guruh
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            {faol.nom}: bosh guruhcha ({faol.bosh.join(', ')})
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Qo&apos;shimcha guruhcha: {faol.qoshimcha.join(', ')}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Yuqori oksid: {faol.oksid} • Gidrid: {faol.gidrid}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: DAVR VA GURUHLARDA XOSSALAR O'ZGARISHI (32-33-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaTendensiyaVektor() {
  const canvasRef = useRef(null);
  const [yonalish, setYonalish] = useState('davr');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.04;

      const isDavr = yonalish === 'davr';
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        isDavr
          ? "Davrda chapdan o'ngga: metallik kamayadi, metallmaslik ortadi"
          : 'Bosh guruhchada yuqoridan pastga: metallik ortadi, metallmaslik kamayadi',
        24,
        34
      );

      const gx = 48;
      const gy = 68;
      const gw = w * 0.52;
      const gh = h - 104;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(gx, gy, gw, gh, 16);
      ctx.fill();
      ctx.stroke();

      const matrix = [
        ['Li', 'Be', 'B', 'C', 'N', 'O', 'F'],
        ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl'],
        ['K', 'Ca', 'Ga', 'Ge', 'As', 'Se', 'Br'],
        ['Rb', 'Sr', 'In', 'Sn', 'Sb', 'Te', 'I'],
        ['Cs', 'Ba', 'Tl', 'Pb', 'Bi', 'Po', 'At'],
        ['Fr', 'Ra', '—', '—', '—', '—', '—'],
      ];
      const cw = (gw - 36) / 7;
      const ch = (gh - 42) / 6;

      matrix.forEach((row, r) => {
        row.forEach((sym, c) => {
          const cx = gx + 18 + c * cw;
          const cy = gy + 24 + r * ch;
          const metalScore = (5 - r) * -1 + (6 - c);
          const bg =
            sym === '—'
              ? 'rgba(30,41,59,0.4)'
              : sym === 'Fr'
              ? '#ec4899'
              : sym === 'F'
              ? '#2dd4bf'
              : metalScore > 2
              ? 'rgba(244, 114, 182, 0.35)'
              : 'rgba(56, 189, 248, 0.3)';
          ctx.fillStyle = bg;
          ctx.strokeStyle = sym === 'Fr' || sym === 'F' ? '#fde047' : 'rgba(148,163,184,0.35)';
          ctx.lineWidth = sym === 'Fr' || sym === 'F' ? 2 : 1;
          ctx.beginPath();
          ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 12px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(sym, cx + cw / 2, cy + ch / 2 + 4);
        });
      });

      const pulse = (Math.sin(t * 2) + 1) * 0.5;
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 3;
      ctx.beginPath();
      if (isDavr) {
        const ay = gy + 24 + ch * 1.5;
        ctx.moveTo(gx + 26, ay);
        ctx.lineTo(gx + gw - 26, ay);
        chizZarracha(ctx, gx + 26 + pulse * (gw - 52), ay, 6, '#fde047', '');
      } else {
        const ax = gx + 18 + cw * 0.5;
        ctx.moveTo(ax, gy + 30);
        ctx.lineTo(ax, gy + gh - 24);
        chizZarracha(ctx, ax, gy + 30 + pulse * (gh - 54), 6, '#fde047', '');
      }
      ctx.stroke();

      const rx = gx + gw + 22;
      const rw = w - rx - 30;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = isDavr ? '#38bdf8' : '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, gy, rw, gh, 16);
      ctx.fill();
      ctx.stroke();

      const matnlar = isDavr
        ? [
            '1. Metallik SUSAYADI',
            '2. Metallmaslik KUCHAYADI',
            '3. O-valentlik: I → VII ortadi',
            '4. H-valentlik: IV → I kamayadi',
            '5. Asos → amfoter → kislota',
          ]
        : [
            '1. Metallik KUCHAYADI',
            '2. Eng kuchli metall — Fr (IA)',
            '3. Eng faol metallmas — F (VIIA)',
            '4. Tashqi elektronlar soni teng',
            '5. Oksid va gidrid tipi saqlanadi',
          ];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(isDavr ? "Davr bo'yicha (→):" : 'Guruhda (↓):', rx + 18, gy + 34);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '13px "Times New Roman", serif';
      matnlar.forEach((m, i) => {
        ctx.fillText(m, rx + 18, gy + 70 + i * 38);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [yonalish]);

  return (
    <KorgazmaRamka
      sarlavha="3. Xossalar o'zgarish vektori: Fr va F (32–33-b)"
      qisqaFormula="Kuchli metall — Fr (↙) • Kuchli metallmas — F (↗)"
      ikon="qidiruv"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setYonalish('davr');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              yonalish === 'davr'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Davr bo&apos;yicha (chap → o&apos;ng)
          </button>
          <button
            type="button"
            onClick={() => {
              setYonalish('guruh');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              yonalish === 'guruh'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Bosh guruhcha bo&apos;yicha (yuqori → past)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Fransiy (Fr) — eng kuchli metallik xossali element
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-teal-300">
            Ftor (F) — eng kuchli metallmas element
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Bosh guruhchadagi barcha elementlar o&apos;xshash xossali
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: VODORODNING IKKI XIL O'RNI (I VA VII GURUHLAR)
═══════════════════════════════════════════════════════════════ */
const VODOROD_VARIANTLAR = [
  {
    id: 'i-guruh',
    tugma: 'I guruh (IA)',
    formula: '1 ē beradi → H⁺ (H₂O ↔ Na₂O)',
    tur: 'molekula',
    cfg: {
      rejim: 'bog',
      sarlavha: 'I guruhda H (Na kabi I valentli)',
      bogJuft: { chap: 'H', chapRang: '#f472b6', ong: 'Cl', ongRang: '#34d399', siljish: 0.72 },
      metrikalar: [
        { nom: 'Oksid analogi', qiymat: 'H₂O ↔ Na₂O', foiz: 55, rang: '#f472b6' },
        { nom: 'Xlorid analogi', qiymat: 'HCl ↔ NaCl', foiz: 72, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'Tashqi', v: '1s¹ (1 ē beradi)', rang: '#fde047' },
        { k: 'Valentlik', v: 'I', rang: '#f472b6' },
      ],
    },
    pastki: ['Tashqi qavatda 1 ta ē', 'H₂O ↔ Na₂O analogiyasi', 'H⁺ kationi hosil qiladi'],
  },
  {
    id: 'vii-guruh',
    tugma: 'VII guruh (H)',
    formula: '1 ē oladi → H⁻ (H₂ ↔ Cl₂, NaH)',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'VII guruhda (H): galogen analogi',
      markaz: { belgi: 'H', rang: '#2dd4bf', r: 22 },
      atomlar: [{ belgi: 'H', rang: '#38bdf8', r: 22, masofa: 86, bog: 1, burchak: 0 }],
      metrikalar: [
        { nom: 'Gaz molekulasi', qiymat: 'H₂ ↔ F₂, Cl₂', foiz: 80, rang: '#2dd4bf' },
        { nom: 'Tuzli gidrid', qiymat: 'NaH ↔ NaCl', foiz: 85, rang: '#fde047' },
      ],
      belgilar: [
        { k: 'He qavati', v: '1 ē yetishmaydi', rang: '#2dd4bf' },
        { k: 'Molekula', v: '2 atomli H₂ gazi', rang: '#38bdf8' },
      ],
    },
    pastki: ['He gacha 1 ē yetishmaydi', 'NaH gidrid ↔ NaCl tuzi', 'VII guruhda qavsda (H)'],
  },
];

function KorgazmaVodorodOrni() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Vodorodning ikki xil o'rni: IA va VIIA (32-b)"
      ikon="uchqun"
      variantlar={VODOROD_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: YUQORI OKSID VA UCHUVCHAN GIDRID FORMULALARI (32-33-BET)
═══════════════════════════════════════════════════════════════ */
const FORMULA_VARIANTLAR = [
  {
    id: 'g1',
    tugma: 'I: R₂O',
    formula: 'Oksid: R₂O (Li₂O, Na₂O) • Gidrid: —',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'I guruh: R₂O oksidi',
      markaz: { belgi: 'O', rang: '#f43f5e', r: 24 },
      atomlar: [
        { belgi: 'R', rang: '#f472b6', r: 20, masofa: 92, bog: 1, burchak: -2.5 },
        { belgi: 'R', rang: '#f472b6', r: 20, masofa: 92, bog: 1, burchak: -0.6 },
      ],
      belgilar: [{ k: 'Misol', v: 'Li₂O, Na₂O', rang: '#fde047' }, { k: 'Tuzli', v: 'NaH', rang: '#38bdf8' }],
    },
    pastki: ['Valentlik: I', 'Oksid: R₂O', 'NaH tuzsimon gidrid'],
  },
  {
    id: 'g2',
    tugma: 'II: RO',
    formula: 'Oksid: RO (MgO, CaO) • Gidrid: —',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'II guruh: RO oksidi',
      markaz: { belgi: 'R', rang: '#fbbf24', r: 24 },
      atomlar: [{ belgi: 'O', rang: '#f43f5e', r: 22, masofa: 92, bog: 2, burchak: 0 }],
      belgilar: [{ k: 'Misol', v: 'BeO, CaO', rang: '#fde047' }, { k: 'Gidrid', v: 'CaH₂', rang: '#38bdf8' }],
    },
    pastki: ['Valentlik: II', 'Oksid: RO', 'Asosli oksidlar'],
  },
  {
    id: 'g3',
    tugma: 'III: R₂O₃',
    formula: 'Oksid: R₂O₃ (B₂O₃, Al₂O₃) • Gidrid: —',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'III guruh: R₂O₃ oksidi',
      markaz: { belgi: 'Al', rang: '#34d399', r: 25 },
      atomlar: [
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 2, burchak: -2.1 },
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 2, burchak: -1.0 },
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 1, burchak: 1.57 },
      ],
      belgilar: [{ k: 'Misol', v: 'B₂O₃, Al₂O₃', rang: '#fde047' }, { k: 'Xossa', v: 'Amfoter', rang: '#34d399' }],
    },
    pastki: ['Valentlik: III', 'Oksid: R₂O₃', 'Uchuvchan gidrid yo\'q'],
  },
  {
    id: 'g4',
    tugma: 'IV: RO₂ / RH₄',
    formula: 'Oksid: RO₂ (CO₂) • Gidrid: RH₄ (CH₄, SiH₄)',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'IV guruh: CO₂ / CH₄',
      markaz: { belgi: 'C', rang: '#38bdf8', r: 24 },
      atomlar: [
        { belgi: 'O', rang: '#f43f5e', r: 20, masofa: 92, bog: 2, burchak: 0 },
        { belgi: 'O', rang: '#f43f5e', r: 20, masofa: 92, bog: 2, burchak: Math.PI },
      ],
      belgilar: [{ k: 'O-valent', v: 'IV (RO₂)', rang: '#fde047' }, { k: 'H-valent', v: '8−4=IV (RH₄)', rang: '#38bdf8' }],
    },
    pastki: ['Oksid: RO₂ (CO₂, SiO₂)', 'Gidrid: RH₄ (CH₄)', 'IV valentli birikmalar'],
  },
  {
    id: 'g5',
    tugma: 'V: R₂O₅ / RH₃',
    formula: 'Oksid: R₂O₅ (P₂O₅) • Gidrid: RH₃ (NH₃, PH₃)',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'V guruh: R₂O₅ / RH₃',
      markaz: { belgi: 'N', rang: '#60a5fa', r: 24 },
      atomlar: [
        { belgi: 'H', rang: '#e2e8f0', r: 16, masofa: 86, bog: 1, burchak: -2.4 },
        { belgi: 'H', rang: '#e2e8f0', r: 16, masofa: 86, bog: 1, burchak: -0.7 },
        { belgi: 'H', rang: '#e2e8f0', r: 16, masofa: 86, bog: 1, burchak: 1.57 },
      ],
      belgilar: [{ k: 'Oksid', v: 'N₂O₅, P₂O₅', rang: '#fde047' }, { k: 'Gidrid', v: 'NH₃, PH₃', rang: '#38bdf8' }],
    },
    pastki: ['Oksid: R₂O₅ (V)', 'Gidrid: RH₃ (III)', '8 − 5 = III valent'],
  },
  {
    id: 'g6',
    tugma: 'VI: RO₃ / H₂R',
    formula: 'Oksid: RO₃ (SO₃) • Gidrid: H₂R (H₂O, H₂S)',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'VI guruh: SO₃ / H₂S',
      markaz: { belgi: 'S', rang: '#a78bfa', r: 24 },
      atomlar: [
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 2, burchak: -1.57 },
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 2, burchak: 0.52 },
        { belgi: 'O', rang: '#f43f5e', r: 19, masofa: 92, bog: 2, burchak: 2.62 },
      ],
      belgilar: [{ k: 'Oksid', v: 'SO₃ (O istisno)', rang: '#fde047' }, { k: 'Gidrid', v: 'H₂O, H₂S', rang: '#38bdf8' }],
    },
    pastki: ['Oksid: RO₃ (O mustasno)', 'Gidrid: H₂R (II)', '8 − 6 = II valent'],
  },
  {
    id: 'g7',
    tugma: 'VII: R₂O₇ / HR',
    formula: 'Oksid: R₂O₇ (Cl₂O₇) • Gidrid: HR (HF, HCl)',
    tur: 'molekula',
    cfg: {
      rejim: 'bog',
      sarlavha: 'VII guruh: R₂O₇ / HR',
      bogJuft: { chap: 'H', chapRang: '#38bdf8', ong: 'Cl', ongRang: '#2dd4bf', siljish: 0.78 },
      belgilar: [{ k: 'Oksid', v: 'Cl₂O₇ (F istisno)', rang: '#fde047' }, { k: 'Gidrid', v: 'HF, HCl, HBr', rang: '#2dd4bf' }],
    },
    pastki: ['Oksid: R₂O₇ (F mustasno)', 'Gidrid: HR (I)', '8 − 7 = I valent'],
  },
  {
    id: 'g8',
    tugma: 'VIII: RO₄',
    formula: 'Oksid: RO₄ (OsO₄, RuO₄, XeO₄) • Gidrid: —',
    tur: 'molekula',
    cfg: {
      rejim: 'molekula',
      sarlavha: 'VIII guruh: RO₄ oksidi',
      markaz: { belgi: 'Os', rang: '#c084fc', r: 24 },
      atomlar: [
        { belgi: 'O', rang: '#f43f5e', r: 18, masofa: 92, bog: 2, burchak: -2.35 },
        { belgi: 'O', rang: '#f43f5e', r: 18, masofa: 92, bog: 2, burchak: -0.78 },
        { belgi: 'O', rang: '#f43f5e', r: 18, masofa: 92, bog: 2, burchak: 0.78 },
        { belgi: 'O', rang: '#f43f5e', r: 18, masofa: 92, bog: 2, burchak: 2.35 },
      ],
      belgilar: [{ k: 'Misol', v: 'OsO₄, RuO₄', rang: '#fde047' }, { k: 'Gidrid', v: 'Hosila yo\'q', rang: '#94a3b8' }],
    },
    pastki: ['Oksid: RO₄ (VIII)', 'Inert gaz + triada', 'Uchuvchan gidrid yo\'q'],
  },
];

function KorgazmaFormulalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Yuqori oksid va uchuvchan gidridlar (32–33-b)"
      ikon="formula"
      variantlar={FORMULA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 3-MASHQ — E₂O₅ OKSIDIDAGI ELEMENTNI TOPISH (33-BET)
═══════════════════════════════════════════════════════════════ */
const MASHQ3_VARIANTLAR = [
  {
    id: 'as',
    tugma: 'As (Ar=75) — To\'g\'ri',
    formula: '2·75 / (150 + 80) = 65,2% → As (Z=33)',
    tur: 'hisob',
    cfg: {
      sarlavha: '3-mashq (33-b): V valentli oksid, w(E)=65,2%',
      tenglama: '2·Ar / (2·Ar + 5·16) = 0,652',
      qadamlar: [
        { belgi: '1) Oksid', natija: 'E₂O₅', izoh: 'M(O₅) = 80 g/mol', rang: '#38bdf8' },
        { belgi: '2) Tenglama', natija: '0,696·Ar = 52,16', izoh: '2Ar = 1,304Ar + 52,16', rang: '#fbbf24' },
        { belgi: '3) Natija', natija: 'Ar = 75 (As)', izoh: 'Z=33, IV davr, VA', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'w(N) N₂O₅', foiz: 25.9, qiymat: '25,9%', rang: '#38bdf8' },
        { nom: 'w(P) P₂O₅', foiz: 43.7, qiymat: '43,7%', rang: '#60a5fa' },
        { nom: 'w(As) As₂O₅', foiz: 65.2, qiymat: '65,2%', rang: '#34d399' },
        { nom: 'w(Sb) Sb₂O₅', foiz: 75.3, qiymat: '75,3%', rang: '#fbbf24' },
      ],
      javobBadge: 'As (Mishyak, Z=33)',
    },
    pastki: ['Oksid: E₂O₅, M(O₅)=80', '2Ar/(2Ar+80) = 0,652', 'Ar = 75 → Mishyak (As)'],
  },
  {
    id: 'p',
    tugma: 'P (Ar=31)',
    formula: 'P₂O₅: 62 / 142 = 43,7% ≠ 65,2%',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Solishtirish: Fosfor (P, Ar=31)',
      tenglama: 'M(P₂O₅) = 2·31 + 80 = 142 g/mol',
      qadamlar: [
        { belgi: '1) Formula', natija: 'P₂O₅', izoh: '3-davr, VA', rang: '#60a5fa' },
        { belgi: '2) Ulush', natija: '62 / 142 = 43,7%', izoh: '65,2% dan kichik', rang: '#f43f5e' },
      ],
      taqqosBars: [
        { nom: 'w(P) P₂O₅', foiz: 43.7, qiymat: '43,7%', rang: '#60a5fa' },
        { nom: 'Shart w(E)', foiz: 65.2, qiymat: '65,2%', rang: '#fde047' },
      ],
      javobBadge: '43,7% ≠ 65,2%',
    },
    pastki: ['P₂O₅: M = 142 g/mol', 'w(P) = 43,7% (kichik)', 'Shartga mos emas'],
  },
  {
    id: 'sb',
    tugma: 'Sb (Ar=122)',
    formula: 'Sb₂O₅: 244 / 324 = 75,3% ≠ 65,2%',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Solishtirish: Surma (Sb, Ar=122)',
      tenglama: 'M(Sb₂O₅) = 2·122 + 80 = 324 g/mol',
      qadamlar: [
        { belgi: '1) Formula', natija: 'Sb₂O₅', izoh: '5-davr, VA', rang: '#fbbf24' },
        { belgi: '2) Ulush', natija: '244 / 324 = 75,3%', izoh: '65,2% dan katta', rang: '#f43f5e' },
      ],
      taqqosBars: [
        { nom: 'Shart w(E)', foiz: 65.2, qiymat: '65,2%', rang: '#fde047' },
        { nom: 'w(Sb) Sb₂O₅', foiz: 75.3, qiymat: '75,3%', rang: '#fbbf24' },
      ],
      javobBadge: '75,3% ≠ 65,2%',
    },
    pastki: ['Sb₂O₅: M = 324 g/mol', 'w(Sb) = 75,3% (katta)', 'Shartga mos emas'],
  },
];

function KorgazmaMashqUch() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 3-mashq: E₂O₅ oksidida w(E)=65,2% (33-b)"
      ikon="kolba"
      variantlar={MASHQ3_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (5-§) VA O'YINLAR (6-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Davriy qonun 1869-yilda va hozir nimaga asoslanadi?',
    variantlar: [
      { matn: 'Neytronlar soniga', togri: false },
      { matn: 'Massaga (1869) va yadro zaryadi Z ga', togri: true },
      { matn: 'Zichlik va qaynashga', togri: false },
      { matn: 'Metallmaslikka', togri: false },
    ],
    izoh: 'Hozirda xossalar yadro zaryadi Z ga davriy bog\'liq.',
  },
  {
    id: 't2',
    savol: '3-davrda (Na → Cl) O-valentlik va gidroksidlar?',
    variantlar: [
      { matn: 'VII → I, asosga aylanadi', togri: false },
      { matn: 'Doim III valentli', togri: false },
      { matn: 'Faqat amfoter oksidlar', togri: false },
      { matn: 'I → VII; NaOH → Al(OH)₃ → HClO₄', togri: true },
    ],
    izoh: 'Na₂O(I) → Cl₂O₇(VII): asosdan kislotaga o\'tadi.',
  },
  {
    id: 't3',
    savol: 'Mendeleyev Be massasi va valentligini qanday tuzatdi?',
    variantlar: [
      { matn: 'Ar=13,5 (III) → Ar=9 (II)', togri: true },
      { matn: 'Ar=9 (II) → Ar=27 (III)', togri: false },
      { matn: 'Ar=7 (I) qoldirgan', togri: false },
      { matn: 'Jadvalga kiritmagan', togri: false },
    ],
    izoh: 'Li(7) va B(11) orasiga Ar=9, II valentli qilib tuzatildi.',
  },
  {
    id: 't4',
    savol: 'Nega Ar (≈40) Kaliy (≈39) dan oldin turadi?',
    variantlar: [
      { matn: 'Argon qattiq metall', togri: false },
      { matn: 'Kaliy gaz bo\'lgani uchun', togri: false },
      { matn: 'Z(Ar)=18 < Z(K)=19 va xossasi mos', togri: true },
      { matn: 'Zichligi nolga teng', togri: false },
    ],
    izoh: 'O\'rin atom massasi bilan emas, Z bilan belgilanadi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'kichik', nom: 'Kichik davr (1–3)', tavsif: '1 qator: 2, 8, 8' },
    { id: 'bosh', nom: 'Bosh guruhcha (A)', tavsif: 'Kichik + katta davr' },
    { id: 'qoshimcha', nom: "Qo'shimcha (B)", tavsif: 'Faqat katta davr metallari' },
  ],
  topshiriqlar: [
    { nom: '1-davr (H, He)', qisqa: '2 element', guruh: 'kichik', izoh: '2 elementli kichik davr.' },
    { nom: '2-davr (Li–Ne)', qisqa: '8 element', guruh: 'kichik', izoh: '1 qatorli kichik davr.' },
    { nom: '3-davr (Na–Ar)', qisqa: '8 element', guruh: 'kichik', izoh: '1 qatorli kichik davr.' },
    { nom: 'Galogenlar (F..At)', qisqa: 'VIIA', guruh: 'bosh', izoh: 'VII bosh guruhcha.' },
    { nom: 'Inert gazlar', qisqa: 'VIIIA', guruh: 'bosh', izoh: 'VIII bosh guruhcha.' },
    { nom: 'Azot oilasi (N..Bi)', qisqa: 'VA', guruh: 'bosh', izoh: 'V bosh guruhcha.' },
    { nom: 'Cu, Ag, Au', qisqa: 'IB', guruh: 'qoshimcha', izoh: 'IB katta davr metallari.' },
    { nom: 'Fe, Co, Ni triadasi', qisqa: 'VIIIB', guruh: 'qoshimcha', izoh: 'VIIIB metall triadasi.' },
    { nom: 'Mn, Tc, Re', qisqa: 'VIIB', guruh: 'qoshimcha', izoh: 'VIIB metallari.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Davrlar',
    savol: 'Nechta davr bor va kichiklari qaysi?',
    variantlar: ['8 davr; 1–4', '6 davr; faqat 1', '7 davr; 1, 2, 3-davrlar', '10 davr; 1–5'],
    togri: 2,
    izoh: '1–3 kichik (1 qator), 4–7 katta (2 qator).',
  },
  {
    belgi: 'Katta davr',
    savol: '4, 5, 6, 7-davrlarda nechtadan element bor?',
    variantlar: ['18, 18, 32, 32', '8, 8, 18, 18', '2, 8, 18, 32', '10, 14, 18, 32'],
    togri: 0,
    izoh: 'Sig\'im: 2, 8, 8, 18, 18, 32, 32.',
  },
  {
    belgi: 'Qutblar',
    savol: 'Eng kuchli metall va metallmas?',
    variantlar: ['Li va I', 'Na va O', 'K va Ne', 'Fr va F'],
    togri: 3,
    izoh: 'Pastki chap Fr (metall), yuqori o\'ng F (metallmas).',
  },
  {
    belgi: 'Vodorod',
    savol: 'H nega VII guruhda ham (qavsda) ko\'rsatiladi?',
    variantlar: ['VII valentli oksid beradi', 'He gacha 1 ē yetmaydi, NaH beradi', '14 lantanoidga o\'xshaydi', 'Qattiq metall'],
    togri: 1,
    izoh: 'NaH (NaCl analogi) va H₂ gazi hosil qiladi.',
  },
  {
    belgi: 'Formulalar',
    savol: 'VI guruh yuqori oksidi va gidridi?',
    variantlar: ['R₂O₅ va RH₃', 'RO₃ va H₂R', 'RO₂ va RH₄', 'R₂O₇ va HR'],
    togri: 1,
    izoh: 'VI guruh: SO₃ va H₂S.',
  },
  {
    belgi: "Qo'shimcha",
    savol: "Qo'shimcha (B) guruhchada qanday elementlar bor?",
    variantlar: ['Faqat gazlar', '1–2-davr elementlari', 'Inert gazlar', 'Faqat katta davr metallari'],
    togri: 3,
    izoh: 'B guruhcha — faqat 4–7-davr metallari.',
  },
  {
    belgi: 'Mustasno',
    savol: 'Qaysi ikki element guruh raqamicha oksid bermaydi?',
    variantlar: ['O va F', 'C va Si', 'S va Cl', 'P va N'],
    togri: 0,
    izoh: 'O (VI) va F (VII) bundan mustasno.',
  },
  {
    belgi: '3-mashq',
    savol: 'E₂O₅ da w(E) = 65,2% bo\'lsa, qaysi element?',
    variantlar: ['P (31)', 'N (14)', 'As (75, Z=33)', 'Sb (122)'],
    togri: 2,
    izoh: '2Ar/(2Ar+80)=0,652 → Ar=75 → Mishyak (As).',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: "Davr sig'imi",
    vazifa: 'Davrlarni elementlar soni ORTISHIGA ko\'ra joylang:',
    tartib: ['1-davr (2)', '2-davr (8)', '4-davr (18)', '6-davr (32)'],
    variantlar: ['4-davr (18)', '1-davr (2)', '6-davr (32)', '2-davr (8)'],
  },
  {
    tur: 'Yuqori oksidlar',
    vazifa: 'Oksidlarni I → VII guruh bo\'yicha joylang:',
    tartib: ['I: R₂O', 'III: R₂O₃', 'V: R₂O₅', 'VII: R₂O₇'],
    variantlar: ['V: R₂O₅', 'I: R₂O', 'VII: R₂O₇', 'III: R₂O₃'],
  },
  {
    tur: 'Metallik',
    vazifa: 'IA metallarini metallik ORTISHI bo\'yicha joylang:',
    tartib: ['Li (2-davr)', 'Na (3-davr)', 'K (4-davr)', 'Fr (7-davr)'],
    variantlar: ['K (4-davr)', 'Fr (7-davr)', 'Li (2-davr)', 'Na (3-davr)'],
  },
  {
    tur: '3-mashq yechimi',
    vazifa: 'E₂O₅ (w=65,2%) yechim bosqichlarini tartiblang:',
    tartib: ['Oksid: E₂O₅', 'M(O₅) = 80', '2Ar/(2Ar+80)=0,652', 'Ar = 75 (As)'],
    variantlar: ['2Ar/(2Ar+80)=0,652', 'Oksid: E₂O₅', 'Ar = 75 (As)', 'M(O₅) = 80'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Har bir davr (1-dan tashqari) nima bilan boshlanib tugaydi?',
    variantlar: ['Galogen → metall', 'Inert gaz → metall', 'Ishqoriy metall → inert gaz', 'Lantanoid → aktinoid'],
    togri: 2,
    izoh: 'Ishqoriy metall (1-da H) dan inert gazgacha.',
  },
  {
    savol: 'IV–VII guruh gidridlari qanday tartibda o\'zgaradi?',
    variantlar: ['RH₄ → RH₃ → H₂R → HR', 'HR → H₂R → RH₃ → RH₄', 'R₂H → RH → RH₅ → RH₆', 'Faqat R₂O'],
    togri: 0,
    izoh: 'CH₄, NH₃, H₂S, HCl.',
  },
  {
    savol: 'Lantanoidlar va aktinoidlar nechtadan element?',
    variantlar: ['6 tadan', '10 tadan', '18 tadan', '14 tadan'],
    togri: 3,
    izoh: '6-davrda 14 lantanoid, 7-davrda 14 aktinoid.',
  },
  {
    savol: 'VIIIA va VIIIB guruhchalar juftligini toping:',
    variantlar: ['Li, Na va Cu, Ag', 'He, Ne, Ar va Fe, Co, Ni', 'F, Cl va Mn, Re', 'C, Si va Ti, Zr'],
    togri: 1,
    izoh: 'VIIIA — inert gazlar; VIIIB — metall triadasi.',
  },
  {
    savol: 'Bosh guruhcha tashqi qavat elektronlari soni:',
    variantlar: ['Davr raqamiga', 'Guruh raqamiga', 'Neytron soniga', 'Doim 2 ga'],
    togri: 1,
    izoh: 'Guruh raqamiga teng (He mustasno).',
  },
  {
    savol: 'Katta davrlarning asosiy belgisi nima?',
    variantlar: ['Faqat gazlar', '1 qatordan iborat', '2 qatorli (18 yoki 32 ta)', 'Faqat 2 ta element'],
    togri: 2,
    izoh: '4–7-davrlar juft va toq 2 qatorlidir.',
  },
  {
    savol: 'VIIA da F → At tomonga metallmaslik qanday o\'zgaradi?',
    variantlar: ['Susayadi', 'Kuchayadi', 'O\'zgarmaydi', 'Tugamaydi'],
    togri: 0,
    izoh: 'Pastga tushgan sari metallmaslik susayadi.',
  },
  {
    savol: 'Cu, Ag, Au qaysi guruhchaga kiradi?',
    variantlar: ['IA', 'IIA', 'VIIIA', 'IB (qo\'shimcha)'],
    togri: 3,
    izoh: 'Mis oilasi — I qo\'shimcha guruhcha.',
  },
];

export default function S8Mavzu6() {
  const korgazmalar = [
    { nom: '1. 7 ta davr', ikon: 'grafik', komponent: <KorgazmaDavrlar /> },
    { nom: '2. 8 ta guruh (A/B)', ikon: 'atom', komponent: <KorgazmaGuruhlar /> },
    { nom: '3. Xossa vektori', ikon: 'qidiruv', komponent: <KorgazmaTendensiyaVektor /> },
    { nom: "4. Vodorod o'rni", ikon: 'uchqun', komponent: <KorgazmaVodorodOrni /> },
    { nom: '5. Oksid va gidridlar', ikon: 'formula', komponent: <KorgazmaFormulalar /> },
    { nom: '6. 3-mashq (E₂O₅)', ikon: 'kolba', komponent: <KorgazmaMashqUch /> },
  ];

  const oyinlar = [
    {
      nom: '1. Davr va guruhcha',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-6"
          nom="Elementlarni kichik davr, bosh va qo'shimcha guruhchaga ajratish"
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
          key="tezkor-6"
          nom="6-§: Davriy sistema tuzilishi viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Tizim zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-6"
          nom="Davr sig'imi va yuqori oksid zanjiri"
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
          key="duel-6"
          sarlavha="6-§: Kimyoviy elementlar davriy sistemasi dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="6-§"
      mavzuNom="Kimyoviy elementlar davriy sistemasi"
      oldingiRaqam="5-§"
      oldingiNom="Kimyoviy elementlarning davriy qonuni"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
