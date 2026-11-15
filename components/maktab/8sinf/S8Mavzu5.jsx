'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 5-PARAGRAF
// "Kimyoviy elementlarning davriy qonuni" (Darslik 25-31-betlar)
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
   1-KO'RGAZMA: 6-JADVAL (Na → Ar) VA VALENTLIK DAVRIYLIGI
═══════════════════════════════════════════════════════════════ */
const UCHINCHI_DAVR = [
  {
    z: 11,
    belgi: 'Na',
    nom: 'Natriy',
    ar: '23',
    oVal: 1,
    hVal: 0,
    oksid: 'Na₂O',
    gidrid: '—',
    gidroksid: 'NaOH (kuchli asos)',
    xossa: 'Ishqoriy metall',
    rang: '#f472b6',
  },
  {
    z: 12,
    belgi: 'Mg',
    nom: 'Magniy',
    ar: '24',
    oVal: 2,
    hVal: 0,
    oksid: 'MgO',
    gidrid: '—',
    gidroksid: 'Mg(OH)₂ (kuchsiz asos)',
    xossa: 'Metall',
    rang: '#fbbf24',
  },
  {
    z: 13,
    belgi: 'Al',
    nom: 'Alyuminiy',
    ar: '27',
    oVal: 3,
    hVal: 0,
    oksid: 'Al₂O₃',
    gidrid: '—',
    gidroksid: 'Al(OH)₃ / HAlO₂ (amfoter)',
    xossa: 'Amfoter metall',
    rang: '#34d399',
  },
  {
    z: 14,
    belgi: 'Si',
    nom: 'Kremniy',
    ar: '28',
    oVal: 4,
    hVal: 4,
    oksid: 'SiO₂',
    gidrid: 'SiH₄ (IV)',
    gidroksid: 'H₂SiO₃ (juda kuchsiz kislota)',
    xossa: 'Metallmas',
    rang: '#38bdf8',
  },
  {
    z: 15,
    belgi: 'P',
    nom: 'Fosfor',
    ar: '31',
    oVal: 5,
    hVal: 3,
    oksid: 'P₂O₅',
    gidrid: 'PH₃ (III)',
    gidroksid: "H₃PO₄ (o'rta kuchli kislota)",
    xossa: 'Metallmas',
    rang: '#60a5fa',
  },
  {
    z: 16,
    belgi: 'S',
    nom: 'Oltingugurt',
    ar: '32',
    oVal: 6,
    hVal: 2,
    oksid: 'SO₃',
    gidrid: 'H₂S (II)',
    gidroksid: 'H₂SO₄ (kuchli kislota)',
    xossa: 'Metallmas',
    rang: '#facc15',
  },
  {
    z: 17,
    belgi: 'Cl',
    nom: 'Xlor',
    ar: '35,5',
    oVal: 7,
    hVal: 1,
    oksid: 'Cl₂O₇',
    gidrid: 'HCl (I)',
    gidroksid: 'HClO₄ (juda kuchli kislota)',
    xossa: 'Galogen',
    rang: '#2dd4bf',
  },
  {
    z: 18,
    belgi: 'Ar',
    nom: 'Argon',
    ar: '40',
    oVal: 0,
    hVal: 0,
    oksid: '—',
    gidrid: '—',
    gidroksid: 'Birikma bermaydi',
    xossa: 'Inert gaz',
    rang: '#a855f7',
  },
];

function KorgazmaOltinchiJadval() {
  const canvasRef = useRef(null);
  const [tanlangan, setTanlangan] = useState('Na');

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

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('6-jadval: Na → Ar (O: I→VII, H: IV→I)', 24, 34);

      const chartX = 36;
      const chartY = 64;
      const chartW = w * 0.57;
      const chartH = h - 104;
      const bazY = chartY + chartH;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chartX, chartY);
      ctx.lineTo(chartX, bazY);
      ctx.lineTo(chartX + chartW, bazY);
      ctx.stroke();

      const step = chartW / UCHINCHI_DAVR.length;
      UCHINCHI_DAVR.forEach((el, idx) => {
        const bx = chartX + idx * step + 8;
        const bw = step - 16;
        const isSel = el.belgi === tanlangan;
        const barH = el.oVal > 0 ? (el.oVal / 7.5) * (chartH - 36) : 14;
        const by = bazY - barH;

        ctx.fillStyle = isSel ? el.rang : `${el.rang}77`;
        ctx.strokeStyle = isSel ? '#ffffff' : el.rang;
        ctx.lineWidth = isSel ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, barH, [8, 8, 0, 0]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.belgi, bx + bw / 2, bazY + 20);

        if (el.oVal > 0) {
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 12px "Times New Roman", serif';
          ctx.fillText(`${el.oVal}`, bx + bw / 2, by - 8);
        } else {
          ctx.fillStyle = '#c084fc';
          ctx.font = 'bold 11px "Times New Roman", serif';
          ctx.fillText('0', bx + bw / 2, by - 8);
        }

        if (el.hVal > 0) {
          const hy = bazY - (el.hVal / 7.5) * (chartH - 36);
          chizZarracha(ctx, bx + bw / 2, hy, isSel ? 8 : 5.5, '#38bdf8', `H${el.hVal}`);
        }
      });

      const faol = UCHINCHI_DAVR.find((e) => e.belgi === tanlangan) || UCHINCHI_DAVR[0];
      const ix = w * 0.65;
      const iw = w * 0.32;
      const iy = 64;
      const ih = h - 94;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ix, iy, iw, ih, 16);
      ctx.fill();
      ctx.stroke();

      const puls = 1 + Math.sin(t * 2) * 0.05;
      chizZarracha(ctx, ix + 44, iy + 44, 20 * puls, faol.rang, faol.belgi);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${faol.nom} (Z=${faol.z})`, ix + 78, iy + 40);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(`Ar = ${faol.ar} • ${faol.xossa}`, ix + 78, iy + 60);

      const qator = [
        ['Yuqori oksidi:', `${faol.oksid} ${faol.oVal ? `(${faol.oVal})` : ''}`],
        ['H birikmasi:', faol.gidrid],
        ['Gidroksid:', faol.gidroksid],
      ];
      qator.forEach(([k, v], i) => {
        const y0 = iy + 102 + i * 54;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '12px "Times New Roman", serif';
        ctx.fillText(k, ix + 18, y0);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(v, ix + 18, y0 + 20);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlangan]);

  return (
    <KorgazmaRamka
      sarlavha="1. 6-jadval: Na → Ar elementlari xossalari va valentlik o'zgarishi (28-29-bet)"
      qisqaFormula="Na₂O (I) → MgO (II) → Al₂O₃ (III) → SiO₂ (IV) → P₂O₅ (V) → SO₃ (VI) → Cl₂O₇ (VII)"
      ikon="grafik"
      boshqaruv={
        <>
          {UCHINCHI_DAVR.map((el) => (
            <button
              key={el.belgi}
              type="button"
              onClick={() => {
                setTanlangan(el.belgi);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                tanlangan === el.belgi
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
            Kislorod valentligi: Na(I) dan Cl(VII) gacha ortadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Vodorod valentligi: SiH₄(IV) → PH₃(III) → H₂S(II) → HCl(I)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Ar = 40 inert gaz bo&apos;lib, Na(Z=11)..Cl(Z=17) qatorini yakunlaydi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 7-JADVAL — QATORLARNING DAVRIY TAKRORLANISHI
═══════════════════════════════════════════════════════════════ */
const IKKI_QATOR = [
  { ustun: 0, oila: 'Ishqoriy metall (I)', q2: 'Li (7)', q3: 'Na (23)', oksid: 'E₂O', gidrid: '—', rang: '#f472b6' },
  { ustun: 1, oila: 'Ishqoriy-yer (II)', q2: 'Be (9)', q3: 'Mg (24)', oksid: 'EO', gidrid: '—', rang: '#fbbf24' },
  { ustun: 2, oila: 'Bor/Alyuminiy (III)', q2: 'B (11)', q3: 'Al (27)', oksid: 'E₂O₃', gidrid: '—', rang: '#34d399' },
  { ustun: 3, oila: 'Uglerod/Kremniy (IV)', q2: 'C (12)', q3: 'Si (28)', oksid: 'EO₂', gidrid: 'EH₄ (IV)', rang: '#38bdf8' },
  { ustun: 4, oila: 'Azot/Fosfor (V)', q2: 'N (14)', q3: 'P (31)', oksid: 'E₂O₅', gidrid: 'EH₃ (III)', rang: '#60a5fa' },
  { ustun: 5, oila: 'Kislorod/S (VI)', q2: 'O (16)', q3: 'S (32)', oksid: 'EO₃ (S)', gidrid: 'H₂E (II)', rang: '#a78bfa' },
  { ustun: 6, oila: 'Galogen (VII)', q2: 'F (19)', q3: 'Cl (35,5)', oksid: 'Cl₂O₇', gidrid: 'HE (I)', rang: '#2dd4bf' },
];

function KorgazmaYettinchiJadval() {
  const canvasRef = useRef(null);
  const [ustun, setUstun] = useState(0);
  const juft = IKKI_QATOR[ustun] || IKKI_QATOR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const juft = IKKI_QATOR[ustun] || IKKI_QATOR[0];
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.04;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText('7-jadval: Li→F va Na→Cl qatorlarida xossalar har 8 elementdan so\'ng takrorlanadi', 24, 34);

      const leftX = 28;
      const colW = (w - 56) / 7;
      const y1 = 80;
      const y2 = 176;
      const cardH = 66;

      IKKI_QATOR.forEach((item, idx) => {
        const cx = leftX + idx * colW + 4;
        const cw = colW - 8;
        const faolmi = idx === ustun;

        [
          { y: y1, label: item.q2, qator: '2-davr' },
          { y: y2, label: item.q3, qator: '3-davr' },
        ].forEach((b) => {
          ctx.fillStyle = faolmi ? `${item.rang}44` : 'rgba(15, 23, 42, 0.8)';
          ctx.strokeStyle = faolmi ? '#fde047' : item.rang;
          ctx.lineWidth = faolmi ? 2.5 : 1.2;
          ctx.beginPath();
          ctx.roundRect(cx, b.y, cw, cardH, 12);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(b.qator, cx + cw / 2, b.y + 18);

          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 15px "Times New Roman", serif';
          ctx.fillText(b.label, cx + cw / 2, b.y + 44);
        });

        if (faolmi) {
          const arrowY = y1 + cardH + 6 + Math.sin(t * 2) * 3;
          ctx.strokeStyle = '#fde047';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(cx + cw / 2, y1 + cardH + 2);
          ctx.lineTo(cx + cw / 2, y2 - 4);
          ctx.stroke();
          chizZarracha(ctx, cx + cw / 2, arrowY + 8, 5, '#fde047', '');
        }
      });

      const py = 266;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = juft.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(28, py, w - 56, h - py - 20, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        `O'xshash juftlik: ${juft.q2}  ↔  ${juft.q3}  (${juft.oila})`,
        46,
        py + 30
      );
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '14px "Times New Roman", serif';
      ctx.fillText(
        `Yuqori oksid tipi: ${juft.oksid}   •   Vodorodli birikma: ${juft.gidrid}   (Eslatma: N₂O₅ da azot V valentli)`,
        46,
        py + 56
      );

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [ustun]);

  return (
    <KorgazmaRamka
      sarlavha="2. 7-jadval: Elementlar xossalari davriyligi (30-b)"
      qisqaFormula="Li~Na • Be~Mg • B~Al • C~Si • N~P • O~S • F~Cl"
      ikon="formula"
      boshqaruv={
        <>
          {IKKI_QATOR.map((item) => (
            <button
              key={item.ustun}
              type="button"
              onClick={() => {
                setUstun(item.ustun);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                ustun === item.ustun
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {item.q2.split(' ')[0]} ~ {item.q3.split(' ')[0]}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Juft: {juft.q2} va {juft.q3} — {juft.oila}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Umumiy yuqori oksid: {juft.oksid}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Inert gaz (Ne va Ar) dan keyin xossalar qaytadan boshlanadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: OLIMLAR HISSASI XRONOLOGIYASI (25-28-BET)
═══════════════════════════════════════════════════════════════ */
const XRONOLOGIYA_VARIANTLAR = [
  {
    id: 'triada',
    tugma: 'Qadimgi → Triadalar (1829)',
    formula: 'Demokrit, Ar-Roziy, Beruniy → Dalton → Berselius → Debereyner',
    tur: 'biogen',
    cfg: {
      sarlavha: 'Atom g\'oyasi, element tushunchasi va Debereyner triadasi (25–26-b)',
      tenglama: 'Li(7)+K(39) = 46/2 = Na(23)  •  Ca-Sr-Ba  •  Cl-Br-I',
      markazBelgi: '1829',
      markazRang: '#fbbf24',
      tugunlar: [
        { nom: 'Demokrit, Beruniy', belgi: 'Atom g\'oyasi', rang: '#f472b6' },
        { nom: 'Boyl, Lomonosov, Dalton', belgi: 'Massa va Ar', rang: '#fbbf24' },
        { nom: 'Berselius (1814)', belgi: '46 element', rang: '#34d399' },
        { nom: 'Debereyner (1817)', belgi: 'Triadalar (3×)', rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'Allomalar', v: 'Ar-Roziy, Beruniy, Ibn Sino', rang: '#f472b6' },
        { k: 'Triadalar', v: 'Li-Na-K, Ca-Sr-Ba, Cl-Br-I', rang: '#34d399' },
        { k: 'Kamchiligi', v: 'Barcha elementlar sig\'madi', rang: '#fb7185' },
      ],
    },
    pastki: ['Dalton (1803), Prust (1808)', 'Berselius 46 element jadvali', 'Debereyner triadalar qoidasi'],
  },
  {
    id: 'oktava_qonun',
    tugma: 'Oktavalar → Mendeleyev (1869)',
    formula: 'Franklend, Kekule, Butlerov → Shankurtua, Meyer, Nyulends → Mendeleyev',
    tur: 'biogen',
    cfg: {
      sarlavha: 'Valentlik ta\'limoti, oktavalar va Davriy qonun (26–28-bet)',
      tenglama: '1865: Nyulends oktavasi (8-element) → 1869: Mendeleyev (63 element)',
      markazBelgi: '1869',
      markazRang: '#34d399',
      tugunlar: [
        { nom: 'Kekule, Butlerov', belgi: 'Valentlik (1858)', rang: '#38bdf8' },
        { nom: 'Shankurtua, Meyer', belgi: 'Spiral / 6 guruh', rang: '#a855f7' },
        { nom: 'Nyulends (1865)', belgi: 'Oktava (7+1)', rang: '#fbbf24' },
        { nom: 'Mendeleyev (1869)', belgi: 'Davriy qonun (63)', rang: '#34d399' },
      ],
      belgilar: [
        { k: 'Oktavalar', v: 'Har 8-element takrorlanadi', rang: '#fbbf24' },
        { k: '1869-yil', v: '63 ta element tizimlandi', rang: '#34d399' },
        { k: 'Zamonaviy', v: 'Mozli (Z) bilan tasdiqlandi', rang: '#38bdf8' },
      ],
    },
    pastki: ['Franklend, Kekule, Butlerov', 'Nyulends (1865) oktava qonuni', 'Mendeleyev (1869) — 63 element'],
  },
];

function KorgazmaXronologiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Davriy qonungacha ilmiy bosqichlar (25–28-b)"
      ikon="vaqt"
      variantlar={XRONOLOGIYA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: MENDELEYEV TUZATISHLARI VA BASHORATLARI (29-30-BET)
═══════════════════════════════════════════════════════════════ */
const BASHORAT_VARIANTLAR = [
  {
    id: 'berilliy',
    tugma: 'Be: 13,5 → 9',
    formula: 'Be: Ar=13,5 (III) emas → Ar=9 (II) → Li(7) < Be(9) < B(11)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Berilliy atom massasi va valentligini tuzatish (29-bet)',
      tenglama: 'Li(7) < Be(9, II) < B(11)   (eski: Ar=13,5 noto\'g\'ri edi!)',
      qadamlar: [
        { belgi: 'Eski xato', natija: 'Ar = 13,5 (III)', izoh: 'C va N orasiga tushar edi', rang: '#fb7185' },
        { belgi: 'Mendeleyev', natija: 'Ar = 9 (II)', izoh: 'Li va B orasiga qo\'yildi', rang: '#fde047' },
        { belgi: 'Tasdiq', natija: '9,012 (II)', izoh: 'Tajriba tasdiqladi', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Eski xato (Ar)', foiz: 90, qiymat: '13,5', rang: '#fb7185' },
        { nom: 'Haqiqiy (Ar)', foiz: 60, qiymat: '9,0', rang: '#34d399' },
      ],
      javobBadge: 'Be: Ar=9, II valentli',
    },
    pastki: ['Li(7) — Be(9) — B(11)', 'Valentlik III → II tuzatildi', 'Oksidi: BeO (amfoter)'],
  },
  {
    id: 'anomaliya',
    tugma: 'Ar ↔ K, Te ↔ I',
    formula: 'Ar(39,9; Z=18) < K(39,1; Z=19)  •  Co(Z=27) < Ni(Z=28)  •  Te(Z=52) < I(Z=53)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Atom massasiga zid juftliklar: yadro zaryadi Z hal qiladi (30-bet)',
      tenglama: 'Ar (Z=18, Ar=39,9) → K (Z=19, Ar=39,1)  |  Te (Z=52) → I (Z=53)',
      qadamlar: [
        { belgi: 'Ar (Z=18)', natija: 'Ar = 39,9', izoh: 'Inert gaz (Ne tagida)', rang: '#a855f7' },
        { belgi: 'K (Z=19)', natija: 'Ar = 39,1', izoh: 'Ishqoriy metall (Na tagida)', rang: '#38bdf8' },
        { belgi: 'Te↔I, Co↔Ni', natija: 'Z = 52 < 53', izoh: 'Xossa Z ga bog\'liq', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Ar (Z=18)', foiz: 75, qiymat: 'Z=18 (39,9)', rang: '#a855f7' },
        { nom: 'K (Z=19)', foiz: 85, qiymat: 'Z=19 (39,1)', rang: '#38bdf8' },
      ],
      javobBadge: 'Tartibni Z belgilaydi!',
    },
    pastki: ['3 juft: Ar–K, Co–Ni, Te–I', 'Ar inert gaz → 18-katak', 'K ishqoriy metall → 19-katak'],
  },
  {
    id: 'kataklar',
    tugma: 'Ga, Sc, Ge bashorati',
    formula: 'Eka-bor → Sc (1879) • Eka-alyuminiy → Ga (1875) • Eka-kremniy → Ge (1886)',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Bo\'sh kataklar uchun bashorat qilingan elementlar (30-bet)',
      tenglama: 'Ga (68 ≈ 69,7)  •  Sc (44 ≈ 45,0)  •  Ge (72 ≈ 72,6)',
      qadamlar: [
        { belgi: 'Eka-Al → Ga', natija: '1875-yil (68≈69,7)', izoh: 'Zichlik 5,9 ≈ 5,94', rang: '#38bdf8' },
        { belgi: 'Eka-B → Sc', natija: '1879-yil (44≈45,0)', izoh: 'Oksidi Sc₂O₃', rang: '#34d399' },
        { belgi: 'Eka-Si → Ge', natija: '1886-yil (72≈72,6)', izoh: 'Oksidi GeO₂', rang: '#fde047' },
      ],
      taqqosBars: [
        { nom: 'Bashorat Ge', foiz: 72, qiymat: 'Ar = 72', rang: '#38bdf8' },
        { nom: 'Haqiqiy Ge', foiz: 73, qiymat: 'Ar = 72,6', rang: '#34d399' },
      ],
      javobBadge: '3 bashorat to\'liq tasdiqlandi',
    },
    pastki: ['1875: Galliy (Ga)', '1879: Skandiy (Sc)', '1886: Germaniy (Ge)'],
  },
];

function KorgazmaBashoratlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Mendeleyev tuzatishlari va bashoratlari (29–30-b)"
      ikon="qidiruv"
      variantlar={BASHORAT_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: OKSID VA GIDROKSIDLARNING ASOS-KISLOTA O'TISHI
═══════════════════════════════════════════════════════════════ */
const ASOS_KISLOTA_VARIANTLAR = [
  {
    id: 'ph_oqi',
    tugma: 'NaOH → Al(OH)₃ → HClO₄',
    formula: 'NaOH (asos) → Mg(OH)₂ → Al(OH)₃ (amfoter) → H₂SiO₃ → H₃PO₄ → H₂SO₄ → HClO₄',
    tur: 'muvozanat',
    cfg: {
      sarlavha: '3-davr gidroksidlarida asosli xossadan kislotaliga o\'tish (29-bet)',
      tenglama: 'NaOH (pH≈14) → Mg(OH)₂ → Al(OH)₃ (amfoter) → H₂SiO₃ → H₃PO₄ → H₂SO₄ → HClO₄',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 'NaOH', qiymat: 100, yorliq: 'Kuchli asos', rang: '#ec4899' },
        { nom: 'Mg(OH)₂', qiymat: 72, yorliq: 'Kuchsiz asos', rang: '#f472b6' },
        { nom: 'Al(OH)₃', qiymat: 52, yorliq: 'Amfoter', rang: '#34d399' },
        { nom: 'H₂SiO₃', qiymat: 35, yorliq: 'Kuchsiz kisl.', rang: '#38bdf8' },
        { nom: 'H₃PO₄', qiymat: 62, yorliq: 'O\'rta kisl.', rang: '#60a5fa' },
        { nom: 'H₂SO₄', qiymat: 86, yorliq: 'Kuchli kisl.', rang: '#fbbf24' },
        { nom: 'HClO₄', qiymat: 100, yorliq: 'Eng kuchli', rang: '#ef4444' },
      ],
    },
    pastki: ['NaOH, Mg(OH)₂ — asosli', 'Al(OH)₃ — amfoter chegara', 'H₂SiO₃ → HClO₄ kislota kuchayadi'],
  },
  {
    id: 'amfoter_al',
    tugma: 'Al(OH)₃ amfoter sinovi',
    formula: 'Al(OH)₃ + 3HCl = AlCl₃ + 3H₂O  •  Al(OH)₃ + NaOH = NaAlO₂ + 2H₂O',
    tur: 'reaksiya',
    cfg: {
      sarlavha: 'Al₂O₃ va Al(OH)₃ — asos va kislota orasidagi amfoter ko\'prik',
      tenglama: 'Al(OH)₃ + 3HCl = AlCl₃ + 3H₂O   |   Al(OH)₃ + NaOH = NaAlO₂ + 2H₂O',
      ikkiIdish: true,
      suyuqlikRang: '#34d399',
      tolish: 0.7,
      stakanBelgi: '+ HCl',
      stakanSarlavha: 'Asosdek: AlCl₃',
      ikkinchiSuyuqlikRang: '#38bdf8',
      ikkinchiBelgi: '+ NaOH',
      ikkinchiSarlavha: 'Kislotadek: NaAlO₂',
      reagentlar: [
        { belgi: 'Al³⁺', rang: '#34d399' },
        { belgi: 'AlO₂⁻', rang: '#38bdf8' },
      ],
      elektronJuft: { chap: 'HCl (kisl.)', ong: 'NaOH (ishq.)', e: 'Al(OH)₃' },
      belgilar: [
        { k: 'Kislotada', v: 'AlCl₃ tuzi beradi', rang: '#34d399' },
        { k: 'Ishqorda', v: 'NaAlO₂ alyuminat', rang: '#38bdf8' },
      ],
    },
    pastki: ['Metallik chap → o\'ngga kamayadi', 'Amfoter chegara — Al₂O₃, Al(OH)₃', 'HClO₄ — eng kuchli kislorodli kislota'],
  },
];

function KorgazmaAsosKislota() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Oksid va gidroksidlar xossa o'tishi (29-b)"
      ikon="kolba"
      variantlar={ASOS_KISLOTA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: DAVRIY QONUN TA'RIFINING EVOLYUTSIYASI (29-31-BET)
═══════════════════════════════════════════════════════════════ */
const EVOLYUTSIYA_VARIANTLAR = [
  {
    id: 'zamonaviy',
    tugma: 'Zamonaviy (Yadro zaryadi Z)',
    formula: 'Element va birikmalar xossalari atom yadrosi zaryadi Z ga davriy bog\'liq',
    tur: 'molekula',
    cfg: {
      sarlavha: 'Zamonaviy ta\'rif: Asosiy belgi — atom yadrosi zaryadi (Z)',
      rejim: 'atom',
      markaz: { belgi: '+19', zaryad: 'K (Z=19)', rang: '#34d399', r: 30 },
      qavatlar: [2, 8, 8, 1],
      metrikalar: [
        { nom: 'Ar (Z=18)', qiymat: '2,8,8', foiz: 65, rang: '#a855f7' },
        { nom: 'K (Z=19)', qiymat: '2,8,8,1', foiz: 95, rang: '#34d399' },
      ],
      belgilar: [
        { k: 'Ar (Z=18)', v: 'Ar = 39,9 (inert)', rang: '#a855f7' },
        { k: 'K (Z=19)', v: 'Ar = 39,1 (metall)', rang: '#34d399' },
        { k: 'Sababi', v: 'Tartibni Z belgilaydi!', rang: '#fde047' },
      ],
    },
    pastki: ['1869: Ar massaga asoslandi', 'Istisno: Ar–K, Co–Ni, Te–I', 'Zamonaviy: yadro zaryadi Z'],
  },
  {
    id: '1869_taqqos',
    tugma: '1869 (Ar) vs Zamonaviy (Z)',
    formula: 'Ar(Z=18, 39,9) → K(Z=19, 39,1) • Co(27, 58,9) → Ni(28, 58,7) • Te(52) → I(53)',
    tur: 'muvozanat',
    cfg: {
      sarlavha: '3 ta anomaliya juftligida yadro zaryadi Z ortishi',
      tenglama: 'Ar(Z=18) < K(Z=19)  •  Co(Z=27) < Ni(Z=28)  •  Te(Z=52) < I(Z=53)',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 'Ar(18)', qiymat: 35, yorliq: '39,9', rang: '#a855f7' },
        { nom: 'K(19)', qiymat: 40, yorliq: '39,1', rang: '#34d399' },
        { nom: 'Co(27)', qiymat: 54, yorliq: '58,9', rang: '#38bdf8' },
        { nom: 'Ni(28)', qiymat: 58, yorliq: '58,7', rang: '#fbbf24' },
        { nom: 'Te(52)', qiymat: 92, yorliq: '127,6', rang: '#f472b6' },
        { nom: 'I(53)', qiymat: 96, yorliq: '126,9', rang: '#fb7185' },
      ],
    },
    pastki: ['1869-yil: atom massasi Ar', '3 ta massa teskari juft', 'Z ortishi bilan tartib to\'g\'ri!'],
  },
];

function KorgazmaTarifEvolyutsiyasi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 1869-yil vs zamonaviy davriy qonun (29–31-b)"
      ikon="atom"
      variantlar={EVOLYUTSIYA_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (4-§) VA O'YINLAR (5-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Ishqoriy metallar valentligi va H₂O bilan reaksiyasi?',
    variantlar: [
      { matn: 'II valentli; cho\'kma beradi', togri: false },
      { matn: 'I–VII; kislota beradi', togri: false },
      { matn: 'I valentli; MOH ishqori va H₂↑', togri: true },
      { matn: 'Reaksiyaga kirishmaydi', togri: false },
    ],
    izoh: '2M + 2H₂O = 2MOH + H₂↑.',
  },
  {
    id: 't2',
    savol: 'Galogenlar (F₂ → I₂) agregat holati va T_qayn?',
    variantlar: [
      { matn: 'Gaz → suyuq → qattiq; T_qayn ortadi', togri: true },
      { matn: 'Barchasi qattiq kristall', togri: false },
      { matn: 'Pastga tushgan sari T_qayn kamayadi', togri: false },
      { matn: 'Faqat ftor suyuq holatda', togri: false },
    ],
    izoh: '5-jadval: F₂ (-188°C), Cl₂ (-34°C), Br₂ (+58°C), I₂ (+186°C).',
  },
  {
    id: 't3',
    savol: 'Oksid bermaydigan eng faol galogen (H₂ bilan +552 kJ)?',
    variantlar: [
      { matn: 'Yod (I₂)', togri: false },
      { matn: 'Brom (Br₂)', togri: false },
      { matn: 'Xlor (Cl₂)', togri: false },
      { matn: 'Ftor (F₂)', togri: true },
    ],
    izoh: 'Ftor O bilan oksid bermaydi, H₂ bilan qorong\'uda portlaydi.',
  },
  {
    id: 't4',
    savol: 'Inert gazlar (He, Ne, Ar...) molekulasi qanday?',
    variantlar: [
      { matn: '2 atomli kislota', togri: false },
      { matn: '1 atomli faolsiz gazlar', togri: true },
      { matn: 'Suvda portlovchi metall', togri: false },
      { matn: 'Doim IV valentli oksid', togri: false },
    ],
    izoh: '4-§: inert gazlar 1 atomlidir.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'asosli', nom: 'Asosli xossa (Na, Mg)', tavsif: 'Ishqor va asosli oksid beradi' },
    { id: 'amfoter', nom: 'Amfoter (Al, Be)', tavsif: 'Kislota ham, ishqor bilan ham ta\'sir' },
    { id: 'kislotali', nom: 'Kislotali xossa (Si..Cl)', tavsif: 'Kislotali oksid va kislota' },
  ],
  topshiriqlar: [
    { nom: 'Na₂O va NaOH', qisqa: 'I valentli, kuchli asos', guruh: 'asosli', izoh: 'Natriy kuchli asosli oksid va ishqor beradi.' },
    { nom: 'MgO va Mg(OH)₂', qisqa: 'II valentli asos', guruh: 'asosli', izoh: 'Magniy asosli oksid va kuchsiz asos hosil qiladi.' },
    { nom: 'Na (Z=11)', qisqa: '3-davr boshi', guruh: 'asosli', izoh: 'Na — tipik ishqoriy metall.' },
    { nom: 'Al₂O₃ va Al(OH)₃', qisqa: 'III valentli, ikki xossa', guruh: 'amfoter', izoh: 'Al(OH)₃ ham kislota, ham asos bilan reaksiyaga kirishadi.' },
    { nom: 'HAlO₂ (AlO₂⁻)', qisqa: 'Alyuminat shakli', guruh: 'amfoter', izoh: 'Alyuminiy gidroksidi ishqorlarda kislota sifatida erib tuz beradi.' },
    { nom: 'BeO (Be, Ar=9)', qisqa: 'II valentli tuzatilgan', guruh: 'amfoter', izoh: 'Berilliy oksidi va gidroksidi amfoter xossali.' },
    { nom: 'SO₃ va H₂SO₄', qisqa: 'S (VI), kuchli kislota', guruh: 'kislotali', izoh: 'Oltingugurt(VI)-oksidi va sulfat kislotasi kislotali.' },
    { nom: 'Cl₂O₇ va HClO₄', qisqa: 'Cl (VII), eng kuchli', guruh: 'kislotali', izoh: 'Xlor(VII)-oksidiga juda kuchli perxlorat kislota mos keladi.' },
    { nom: 'P₂O₅ va H₃PO₄', qisqa: 'P (V), H bilan PH₃ (III)', guruh: 'kislotali', izoh: 'Fosfor kislotali oksid va fosfat kislota hosil qiladi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '1869-yil',
    savol: '1869-yilda Mendeleyev Davriy qonunni ochganda nechta element ma\'lum edi?',
    variantlar: ['92 ta element', '30 ta element', '63 ta element', '118 ta element'],
    togri: 2,
    izoh: '1869-yilda 63 ta element ma\'lum edi.',
  },
  {
    belgi: '6-jadval',
    savol: 'Na → Cl qatorida kislorodga nisbatan yuqori valentlik:',
    variantlar: ['I → VII ortadi', 'VII → I kamayadi', 'Doim II', 'IV → I tushadi'],
    togri: 0,
    izoh: 'Na₂O(I), MgO(II)..SO₃(VI), Cl₂O₇(VII).',
  },
  {
    belgi: 'Gidridlar',
    savol: 'SiH₄ → PH₃ → H₂S → HCl vodorodli valentligi:',
    variantlar: ['I → II → III → IV', 'Doim VI', 'O\'zgarmaydi', 'IV → III → II → I kamayadi'],
    togri: 3,
    izoh: '6-jadval: Si(IV) → P(III) → S(II) → Cl(I).',
  },
  {
    belgi: 'Tuzatish',
    savol: 'Mendeleyev Be massasi va valentligini qanday tuzatdi?',
    variantlar: ['Ar=27 (III)', '13,5 (III) → Ar=9 (II)', 'Ar=16 (VI)', 'Ar=7 (I)'],
    togri: 1,
    izoh: 'Li(7) va B(11) orasida Be: Ar=9, II valentli.',
  },
  {
    belgi: 'Anomaliya',
    savol: 'Massasi katta bo\'lishiga qaramay oldin qo\'yilgan juft:',
    variantlar: ['Na (23) ni Ne (20) dan', 'Ar (40) ni K (39) dan oldin', 'Li (7) ni He (4) dan', 'B (11) ni Be (9) dan'],
    togri: 1,
    izoh: 'Ar (Z=18, inert) < K (Z=19); ham Co/Ni, Te/I.',
  },
  {
    belgi: 'Zamonaviy',
    savol: 'Zamonaviy ta\'rifda element xossalari nimaga bog\'liq?',
    variantlar: ['Atom radiusiga', 'Neytron soniga', 'Zichlikka', 'Yadro zaryadiga (Z)'],
    togri: 3,
    izoh: 'Xossalar atom yadrosi zaryadi Z ga bog\'liq.',
  },
  {
    belgi: 'Oktavalar',
    savol: '1865-yil "oktavalar qonuni" muallifi:',
    variantlar: ['J. Nyulends', 'Y. Berselius', 'I. Debereyner', 'R. Boyl'],
    togri: 0,
    izoh: 'J. Nyulends — har 8-element o\'xshash (oktava).',
  },
  {
    belgi: 'Bashorat',
    savol: 'Eka-alyuminiy, eka-kremniy va eka-bor elementlari:',
    variantlar: ['Li, Na, K', 'F, Cl, Br', 'Galliy (Ga), Germaniy (Ge), Skandiy (Sc)', 'He, Ne, Ar'],
    togri: 2,
    izoh: '1875 Ga, 1879 Sc, 1886 Ge — hammasi tasdiqlandi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Kislorod valentligi',
    vazifa: '3-davr oksidlari valentligi ORTISHI:',
    tartib: ['Na₂O (I)', 'MgO (II)', 'Al₂O₃ (III)', 'SO₃ (VI)'],
    variantlar: ['Al₂O₃ (III)', 'Na₂O (I)', 'SO₃ (VI)', 'MgO (II)'],
  },
  {
    tur: 'Asosdan kislotaga',
    vazifa: 'Asosli xossadan kislotaligacha tartiblang:',
    tartib: ['NaOH (kuchli asos)', 'Mg(OH)₂ (kuchsiz)', 'Al(OH)₃ (amfoter)', 'H₂SO₄ (kislota)'],
    variantlar: ['Al(OH)₃ (amfoter)', 'NaOH (kuchli asos)', 'H₂SO₄ (kislota)', 'Mg(OH)₂ (kuchsiz)'],
  },
  {
    tur: 'Ilmiy xronologiya',
    vazifa: 'Tasniflash tarixiy bosqichlari:',
    tartib: ['Berselius (1814)', 'Debereyner (1817)', 'Nyulends (1865)', 'Mendeleyev (1869)'],
    variantlar: ['Nyulends (1865)', 'Berselius (1814)', 'Mendeleyev (1869)', 'Debereyner (1817)'],
  },
  {
    tur: 'Vodorod valentligi',
    vazifa: 'Gidridlarda valentlik KAMAYISHI:',
    tartib: ['SiH₄ (IV)', 'PH₃ (III)', 'H₂S (II)', 'HCl (I)'],
    variantlar: ['PH₃ (III)', 'HCl (I)', 'SiH₄ (IV)', 'H₂S (II)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '3-davr (Na → Cl) da xossalar qanday o\'zgaradi?',
    variantlar: ['Galogendan metallga', 'Ishqoriy metall → amfoter → galogen', 'Barchasi metall', 'Faqat inert gaz'],
    togri: 1,
    izoh: 'Na (metall) → Al (amfoter) → Cl (galogen).',
  },
  {
    savol: 'Debereyner triadalariga misol:',
    variantlar: ['H, He, Li', 'Na, Al, Cl', 'C, N, O', 'Li, Na, K va Ca, Sr, Ba'],
    togri: 3,
    izoh: 'Li(7)+K(39) = 46/2 = 23 (Na).',
  },
  {
    savol: 'Mendeleyev 1869-yilgi ta\'rifda asos qilgan kattalik:',
    variantlar: ['Atom massasi qiymati', 'Zichlik', 'Neytron soni', 'Erish harorati'],
    togri: 0,
    izoh: '1869: atom massasi; zamonaviy: zaryad Z.',
  },
  {
    savol: '7-jadvalda o\'xshash takrorlanuvchi juftlar:',
    variantlar: ['Na va F', 'Be va S', 'Li~Na, C~Si, F~Cl', 'C va Cl'],
    togri: 2,
    izoh: 'Har 8 ta elementdan so\'ng takrorlanadi.',
  },
  {
    savol: 'Gidrid valentligi IV → I kamayish qatori:',
    variantlar: ['HCl → H₂S → PH₃', 'Na → Mg → Al', 'SiH₄ → PH₃ → H₂S → HCl', 'Li → Be → B → C'],
    togri: 2,
    izoh: '6-jadval: Si(IV) → P(III) → S(II) → Cl(I).',
  },
  {
    savol: 'Ar (40) dan keyin K (39) kelishining sababi:',
    variantlar: ['Yadro zaryadi Z(Ar)=18 < Z(K)=19', 'Massa xato', 'Ar metall', 'K inert gaz'],
    togri: 0,
    izoh: 'O\'rinni massa emas, yadro zaryadi Z belgilaydi.',
  },
  {
    savol: 'Ham kislota, ham ishqor bilan kirishuvchi amfoter gidroksid:',
    variantlar: ['NaOH', 'Al(OH)₃', 'HClO₄', 'MgO'],
    togri: 1,
    izoh: 'Al₂O₃ va Al(OH)₃ — amfoter.',
  },
  {
    savol: 'N₂O₅ va P₂O₅ da azot va fosfor valentligi:',
    variantlar: ['II valentli', 'III valentli', 'IV valentli', 'V valentli'],
    togri: 3,
    izoh: 'O₅ = 10 birlik → N₂ / P₂ = V valentli.',
  },
];

export default function S8Mavzu5() {
  const korgazmalar = [
    { nom: '1. 6-jadval (Na→Ar)', ikon: 'grafik', komponent: <KorgazmaOltinchiJadval /> },
    { nom: '2. 7-jadval takrori', ikon: 'formula', komponent: <KorgazmaYettinchiJadval /> },
    { nom: '3. Olimlar xronologiyasi', ikon: 'vaqt', komponent: <KorgazmaXronologiya /> },
    { nom: '4. Bashorat va tuzatish', ikon: 'qidiruv', komponent: <KorgazmaBashoratlar /> },
    { nom: '5. Asos → kislota', ikon: 'kolba', komponent: <KorgazmaAsosKislota /> },
    { nom: "6. Ta'rif evolyutsiyasi", ikon: 'atom', komponent: <KorgazmaTarifEvolyutsiyasi /> },
  ];

  const oyinlar = [
    {
      nom: '1. Xossa guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-5"
          nom="3-davr birikmalarini xossasiga ko'ra ajratish"
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
          key="tezkor-5"
          nom="5-§: Davriy qonun viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Qonun zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-5"
          nom="Valentlik va tarixiy bosqichlar zanjiri"
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
          key="duel-5"
          sarlavha="5-§: Kimyoviy elementlarning davriy qonuni dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="5-§"
      mavzuNom="Kimyoviy elementlarning davriy qonuni"
      oldingiRaqam="4-§"
      oldingiNom="Kimyoviy elementlarning tabiiy oilalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
