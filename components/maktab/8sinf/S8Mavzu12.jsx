'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 12-PARAGRAF
// "Katta davr elementlarining atom tuzilishi" (Darslik 51-53-betlar)
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
   1-KO'RGAZMA: 4-DAVR TO'LISHI (K, Ca, Sc, Zn, Ga, Kr — 51-52-BET)
═══════════════════════════════════════════════════════════════ */
const TORTINCHI_DAVR_BOSQICH = [
  { z: 19, belgi: 'K', nom: 'Kaliy', qavat: [2, 8, 8, 1], oxiri: '4s¹', oila: 's-element', rang: '#f472b6', izoh: '4-davr boshlanishi: 19-ē 4s-qavatchaga tushadi.' },
  { z: 20, belgi: 'Ca', nom: 'Kalsiy', qavat: [2, 8, 8, 2], oxiri: '4s²', oila: 's-element', rang: '#fbbf24', izoh: 'Kalsiyda tashqi 4s-qavatcha to\'liq to\'ladi.' },
  { z: 21, belgi: 'Sc', nom: 'Skandiy', qavat: [2, 8, 9, 2], oxiri: '4s² 3d¹', oila: 'd-element', rang: '#34d399', izoh: 'Skandiyda ē 3-qavatdagi 3d-qavatchaga tushadi!' },
  { z: 30, belgi: 'Zn', nom: 'Rux', qavat: [2, 8, 18, 2], oxiri: '4s² 3d¹⁰', oila: 'd-element', rang: '#38bdf8', izoh: 'Ruxda 3d¹⁰ to\'lib, 3-qavat (18 ē) yakunlanadi.' },
  { z: 31, belgi: 'Ga', nom: 'Galliy', qavat: [2, 8, 18, 3], oxiri: '4s² 3d¹⁰ 4p¹', oila: 'p-element', rang: '#60a5fa', izoh: 'Galliydan boshlab ē tashqi 4p-qavatchaga tushadi.' },
  { z: 36, belgi: 'Kr', nom: 'Kripton', qavat: [2, 8, 18, 8], oxiri: '4s² 3d¹⁰ 4p⁶', oila: 'p-element (inert)', rang: '#a855f7', izoh: 'Kriptonda tashqi 4-qavat 8 ē bilan tugaydi.' },
];

function KorgazmaTortinchiDavr() {
  const canvasRef = useRef(null);
  const [zVal, setZVal] = useState(21);
  const faol = TORTINCHI_DAVR_BOSQICH.find((e) => e.z === zVal) || TORTINCHI_DAVR_BOSQICH[2];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = TORTINCHI_DAVR_BOSQICH.find((e) => e.z === zVal) || TORTINCHI_DAVR_BOSQICH[2];
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
      ctx.fillText(`4-davr to'lish bosqichi: ${faol.nom} (+${faol.z}) — ${faol.qavat.join(' ē, ')} ē (${faol.oila})`, 24, 34);

      const cx = w * 0.28;
      const cy = h * 0.56;
      const harf = ['K', 'L', 'M', 'N'];

      faol.qavat.forEach((cnt, idx) => {
        const rad = 32 + idx * 24;
        const highlight = idx === 2 || idx === 3;
        ctx.strokeStyle = idx === 2 ? '#34d399' : idx === 3 ? '#fde047' : 'rgba(56, 189, 248, 0.38)';
        ctx.lineWidth = highlight ? 2.4 : 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        const drawDots = Math.min(cnt, 18);
        for (let i = 0; i < drawDots; i++) {
          const ang = t * (0.9 - idx * 0.12) + (i * Math.PI * 2) / drawDots;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4, idx === 2 ? '#34d399' : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 16, '#ef4444', `+${faol.z}`);

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
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText(`1s² 2s² 2p⁶ 3s² 3p⁶ ${faol.oxiri}`, rx + 20, ry + 36);

      faol.qavat.forEach((cnt, i) => {
        const qy = ry + 72 + i * 32;
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "Times New Roman", serif';
        ctx.fillText(`${i + 1}-qavat (${harf[i]}):`, rx + 20, qy);
        ctx.fillStyle = i === 2 ? '#6ee7b7' : '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(`${cnt} ē  (max ${2 * (i + 1) * (i + 1)} ē)`, rx + 132, qy);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(faol.izoh, rx + 20, ry + 206);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zVal]);

  return (
    <KorgazmaRamka
      sarlavha="1. 4-davrda 4s → 3d → 4p to'lishi (51–52-b)"
      qisqaFormula="K(4s¹) → Ca(4s²) → Sc..Zn(3d¹..3d¹⁰) → Ga..Kr(4p¹..4p⁶)"
      ikon="atom"
      boshqaruv={
        <>
          {TORTINCHI_DAVR_BOSQICH.map((el) => (
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
            Oxiri: ...{faol.oxiri} ({faol.oila})
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            3-qavat: {faol.qavat[2]} ē (Sc dan Zn gacha 8 → 18 gacha to&apos;ladi)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Tashqi 4-qavat: {faol.qavat[3]} ē (Kr da 8 ē bilan tugaydi)
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 4-DAVRNING 18 TA ELEMENTI — 2s + 10d + 6p (52-BET)
═══════════════════════════════════════════════════════════════ */
const ON_SAKKIZ_VARIANTLAR = [
  {
    id: 'barchasi',
    tugma: 'Hammasi (18 ta)',
    formula: '4-davr (K..Kr): 2 ta s + 10 ta d + 6 ta p = 18 ta',
    tur: 'muvozanat',
    cfg: {
      sarlavha: '4- va 5-katta davrda 18 ta element tarkibi (52-bet)',
      tenglama: 'K, Ca (2s) + Sc..Zn (10d) + Ga..Kr (6p) = 18 ta',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 's (K, Ca)', qiymat: 2, yorliq: '2 ta (4s)', rang: '#f472b6' },
        { nom: 'd (Sc–Zn)', qiymat: 10, yorliq: '10 ta (3d)', rang: '#fbbf24' },
        { nom: 'p (Ga–Kr)', qiymat: 6, yorliq: '6 ta (4p)', rang: '#38bdf8' },
      ],
    },
    pastki: [
      's-elementlar (K, Ca): tashqi 4s to\'ladi',
      'd-elementlar (Sc..Zn): 3d to\'ladi',
      'p-elementlar (Ga..Kr): tashqi 4p to\'ladi',
    ],
  },
  {
    id: 's',
    tugma: '2 s-element (K, Ca)',
    formula: 'K (2,8,8,1) • Ca (2,8,8,2) — 4s¹⁻² to\'lishi',
    tur: 'molekula',
    cfg: {
      sarlavha: '4-davr s-elementlari: Kaliy va Kalsiy',
      tenglama: 'Ca (+20): ) 2 ) 8 ) 8 ) 2 ([Ar] 4s²)',
      rejim: 'atom',
      qavatlar: [2, 8, 8, 2],
      markaz: { belgi: 'Ca', zaryad: '+20', rang: '#f472b6' },
      metrikalar: [
        { nom: 'Tashqi 4s-qavatcha', qiymat: '2 ē (tugallandi)', foiz: 100, rang: '#f472b6' },
        { nom: '3-qavat (M)', qiymat: '8 ē (hali to\'lmagan)', foiz: 44, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'K (+19)', v: '...4s¹', rang: '#f472b6' },
        { k: 'Ca (+20)', v: '...4s²', rang: '#fbbf24' },
      ],
    },
    pastki: [
      'Tashqi 4s-qavatcha to\'ladi (K, Ca)',
      '3d-qavatcha hali bo\'sh (3d⁰)',
      'Juft qator boshi — ishqoriy/ishqoriy-yer metallar',
    ],
  },
  {
    id: 'd',
    tugma: '10 d-element (Sc..Zn)',
    formula: 'Sc (3d¹) → Zn (3d¹⁰) — 3-qavat 8 dan 18 ga to\'ladi',
    tur: 'molekula',
    cfg: {
      sarlavha: '4-davr d-metallari: Skandiydan Ruxgacha (10 ta)',
      tenglama: 'Zn (+30): ) 2 ) 8 ) 18 ) 2 ([Ar] 3d¹⁰ 4s²)',
      rejim: 'atom',
      qavatlar: [2, 8, 18, 2],
      markaz: { belgi: 'Zn', zaryad: '+30', rang: '#fbbf24' },
      metrikalar: [
        { nom: 'Ichki 3-qavat (M)', qiymat: '18 ē (to\'ldi!)', foiz: 100, rang: '#fbbf24' },
        { nom: 'Tashqi 4-qavat', qiymat: '2 ē (4s²)', foiz: 25, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'Sc (+21)', v: '2,8,9,2', rang: '#34d399' },
        { k: 'Zn (+30)', v: '2,8,18,2', rang: '#fbbf24' },
      ],
    },
    pastki: [
      'Qo\'shimcha B-guruh metallari (Sc..Zn)',
      '3-qavatning 3d-qavatchasi 1→10 ē to\'ladi',
      'Zn da 1-, 2-, 3-qavatlar to\'liq yakunlanadi',
    ],
  },
  {
    id: 'p',
    tugma: '6 p-element (Ga..Kr)',
    formula: 'Ga (4p¹) → Kr (4p⁶) — tashqi 4-qavat 8 ē bilan tugaydi',
    tur: 'molekula',
    cfg: {
      sarlavha: '4-davr p-elementlari: Galliydan Kriptongacha (6 ta)',
      tenglama: 'Kr (+36): ) 2 ) 8 ) 18 ) 8 ([Ar] 3d¹⁰ 4s² 4p⁶)',
      rejim: 'atom',
      qavatlar: [2, 8, 18, 8],
      markaz: { belgi: 'Kr', zaryad: '+36', rang: '#a855f7' },
      metrikalar: [
        { nom: 'Tashqi 4p-qavatcha', qiymat: '6 ē (oktet 8 ē)', foiz: 100, rang: '#38bdf8' },
        { nom: '3-qavat (M)', qiymat: '18 ē', foiz: 100, rang: '#fbbf24' },
      ],
      belgilar: [
        { k: 'Ga (+31)', v: '2,8,18,3', rang: '#38bdf8' },
        { k: 'Kr (+36)', v: '2,8,18,8', rang: '#a855f7' },
      ],
    },
    pastki: [
      'Tashqi 4p-qavatcha to\'ladi (Ga, Ge, As, Se, Br, Kr)',
      'Toq qator oxiridagi 6 element',
      'Kr inert gazi 4-davrni yakunlaydi',
    ],
  },
];

function KorgazmaOnSakkizTaqsimot() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Katta davrda 2s + 10d + 6p = 18 ta (52-b)"
      ikon="grafik"
      variantlar={ON_SAKKIZ_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 6-DAVR, f-ELEMENTLAR VA QISQA YOZUV: Ce VA Cs (52-53-BET)
═══════════════════════════════════════════════════════════════ */
const OLTINCHI_DAVR_VARIANTLAR = [
  {
    id: 'Ce',
    tugma: 'Seriy (+58 Ce)',
    formula: '+58 Ce: 2, 8, 18, 20, 8, 2 • [Xe] 6s² 4f²',
    tur: 'hisob',
    cfg: {
      sarlavha: '6-davr va f-element: Seriy (+58 Ce, 52-bet)',
      tenglama: '[Xe] (54 ē) + 6s² + 4f² = 58 ē (4f-qavatcha to\'ladi)',
      qadamlar: [
        { belgi: '[Xe] yadro', natija: '54 ē', izoh: '2, 8, 18, 18, 8', rang: '#38bdf8' },
        { belgi: '6s²', natija: '2 ē', izoh: 'Tashqi 6-qavatda', rang: '#f472b6' },
        { belgi: '4f²', natija: '2 ē', izoh: '4-qavat: 18→20 ē', rang: '#a855f7' },
      ],
      taqqosBars: [
        { nom: '4f to\'lishi (2/14)', foiz: 14, qiymat: '4f² (max 14)', rang: '#a855f7' },
        { nom: '6 ta qavat', foiz: 100, qiymat: '2,8,18,20,8,2', rang: '#34d399' },
      ],
      javobBadge: 'Ce (+58): [Xe] 6s² 4f² (f-element, lantanoid)',
    },
    pastki: [
      'Qisqa yozuv: [Xe] 6s² 4f²',
      'Qavatlar: 2, 8, 18, 20, 8, 2',
      '4f-qavatchaga 14 tagacha ē sig\'adi',
    ],
  },
  {
    id: 'Cs',
    tugma: 'Seziy (+55 Cs)',
    formula: '+55 Cs: 2, 8, 18, 18, 8, 1 • [Xe] 6s¹',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Qisqartirilgan elektron formula: Seziy (+55 Cs, 53-bet)',
      tenglama: '1s²..5p⁶ o\'rniga [Xe] yoziladi → [Xe] 6s¹',
      qadamlar: [
        { belgi: '[Xe] qobig\'i', natija: '54 ē', izoh: '2, 8, 18, 18, 8', rang: '#38bdf8' },
        { belgi: '6s¹ valent', natija: '1 ē', izoh: 'Tashqi 6-qavat', rang: '#f472b6' },
        { belgi: 'Oila', natija: 's-element', izoh: '6-davr IA guruh', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '[Xe] asos (54)', foiz: 98, qiymat: '54 ē', rang: '#38bdf8' },
        { nom: '6s¹ valent (1)', foiz: 15, qiymat: '1 ē', rang: '#f472b6' },
      ],
      javobBadge: 'Cs (+55): [Xe] 6s¹ — qulay qisqartirilgan yozuv',
    },
    pastki: [
      'Qisqa yozuv: [Xe] 6s¹',
      'Qavatlar: 2, 8, 18, 18, 8, 1',
      '6-davr s-elementi (ishqoriy metall)',
    ],
  },
];

function KorgazmaOltinchiDavr() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 6-davr (4f) va qisqa yozuv: Ce, Cs (52–53-b)"
      ikon="formula"
      variantlar={OLTINCHI_DAVR_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: 53-BET 1-TOPSHIRIQ — Z = 22 (Ti) VA Z = 33 (As)
═══════════════════════════════════════════════════════════════ */
const TITAN_MISHYAK_VARIANTLAR = [
  {
    id: '22',
    tugma: 'Titan (Z = 22)',
    formula: 'Ti (22): 2, 8, 10, 2 • [Ar] 4s² 3d² (d-element)',
    tur: 'molekula',
    cfg: {
      sarlavha: '53-bet 1-topshiriq: Titan (+22 Ti)',
      tenglama: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d² (IVB d-element)',
      rejim: 'atom',
      qavatlar: [2, 8, 10, 2],
      markaz: { belgi: 'Ti', zaryad: '+22', rang: '#fbbf24' },
      metrikalar: [
        { nom: '3d² elektronlar', qiymat: '2 ta (M=10 ē)', foiz: 20, rang: '#fbbf24' },
        { nom: 'Tashqi 4s²', qiymat: '2 ē', foiz: 25, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'Qisqa', v: '[Ar] 4s² 3d²', rang: '#fbbf24' },
        { k: 'Oila', v: 'd-element (IVB)', rang: '#34d399' },
      ],
    },
    pastki: [
      'Formula: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d²',
      'Qavatlar: 2, 8, 10, 2',
      'd-element (4-davr, IVB guruh)',
    ],
  },
  {
    id: '33',
    tugma: 'Mishyak (Z = 33)',
    formula: 'As (33): 2, 8, 18, 5 • [Ar] 4s² 3d¹⁰ 4p³ (p-element)',
    tur: 'molekula',
    cfg: {
      sarlavha: '53-bet 1-topshiriq: Mishyak (+33 As)',
      tenglama: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p³ (VA p-element)',
      rejim: 'atom',
      qavatlar: [2, 8, 18, 5],
      markaz: { belgi: 'As', zaryad: '+33', rang: '#38bdf8' },
      metrikalar: [
        { nom: 'Ichki 3d¹⁰', qiymat: 'To\'liq (M=18)', foiz: 100, rang: '#fbbf24' },
        { nom: 'Tashqi 4p³', qiymat: '3 toq ē (N=5)', foiz: 50, rang: '#38bdf8' },
      ],
      belgilar: [
        { k: 'Qisqa', v: '[Ar] 4s² 3d¹⁰ 4p³', rang: '#38bdf8' },
        { k: 'Oila', v: 'p-element (VA)', rang: '#34d399' },
      ],
    },
    pastki: [
      'Formula: 1s²..3p⁶ 4s² 3d¹⁰ 4p³',
      'Qavatlar: 2, 8, 18, 5',
      'p-element (4-davr, VA guruh)',
    ],
  },
];

function KorgazmaTitanMishyak() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 53-b 1-topshiriq: Z = 22 (Ti) va Z = 33 (As)"
      ikon="yadro"
      variantlar={TITAN_MISHYAK_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: d VA f BOSHLANISHI HAMDA YONAKI GURUHLAR (53-BET)
═══════════════════════════════════════════════════════════════ */
const D_BOSHLARI_VARIANTLAR = [
  {
    id: 'd4',
    tugma: '4-davr: Sc (21)',
    formula: 'Sc (3d¹ 4s²) → Zn (3d¹⁰ 4s²) • Yonaki B-guruhlar',
    tur: 'hisob',
    cfg: {
      sarlavha: '4-davr d-elementlari: Skandiydan Ruxgacha',
      tenglama: '3d-qavatcha Sc (Z=21) dan boshlanib Zn (Z=30) da to\'ladi',
      qadamlar: [
        { belgi: 'Boshlanish', natija: 'Sc (Z=21)', izoh: '3d¹ 4s²', rang: '#fbbf24' },
        { belgi: 'Oraliq soni', natija: '10 ta', izoh: 'IB–VIIIB guruhcha', rang: '#38bdf8' },
        { belgi: 'Tugashi', natija: 'Zn (Z=30)', izoh: '3d¹⁰ 4s²', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '3d to\'lishi (1→10)', foiz: 100, qiymat: '10 ta d-metall', rang: '#fbbf24' },
      ],
      javobBadge: 'Yonaki guruhchalar faqat 4-, 5-, 6-, 7-katta davrlarda bo\'ladi',
    },
    pastki: [
      'Boshlanishi: Sc (Z=21, 3d¹ 4s²)',
      '10 ta oraliq metall: Sc–Zn',
      'Yonaki guruhchalar 4–7 davrlarda joylashadi',
    ],
  },
  {
    id: 'd5',
    tugma: '5-davr: Y (39)',
    formula: 'Y (4d¹ 5s²) → Cd (4d¹⁰ 5s²) • 5-davr d-qatori',
    tur: 'hisob',
    cfg: {
      sarlavha: '5-davr d-elementlari: Ittriydan Kadmiygacha',
      tenglama: '4d-qavatcha Y (Z=39) dan Cd (Z=48) gacha to\'ladi',
      qadamlar: [
        { belgi: 'Boshlanish', natija: 'Y (Z=39)', izoh: '4d¹ 5s²', rang: '#38bdf8' },
        { belgi: 'Oraliq soni', natija: '10 ta', izoh: 'Y–Cd metallari', rang: '#fbbf24' },
        { belgi: 'Tugashi', natija: 'Cd (Z=48)', izoh: '4d¹⁰ 5s²', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '4d to\'lishi (1→10)', foiz: 100, qiymat: '10 ta d-metall', rang: '#38bdf8' },
      ],
      javobBadge: '5-davr (18 ta): 2 s + 10 d + 6 p',
    },
    pastki: [
      'Boshlanishi: Y (Z=39, 4d¹ 5s²)',
      '4d-qavatcha 10 ē bilan to\'ladi',
      'Lantanoid (4f) hali boshlanmagan',
    ],
  },
  {
    id: 'd6',
    tugma: '6-davr: La (57)',
    formula: 'La (5d¹ 6s²) + 14 lantanoid (4f) → Hg (5d¹⁰)',
    tur: 'hisob',
    cfg: {
      sarlavha: '6-davr d va 4f lantanoidlar (32 ta element)',
      tenglama: 'La (5d¹) → 14 lantanoid (4f) → Hf..Hg (5d²..¹⁰)',
      qadamlar: [
        { belgi: '5d boshi', natija: 'La (Z=57)', izoh: '5d¹ 6s²', rang: '#f472b6' },
        { belgi: '4f oila', natija: '14 ta', izoh: 'Ce..Lu lantanoidlar', rang: '#a855f7' },
        { belgi: '5d oxiri', natija: 'Hg (Z=80)', izoh: '5d¹⁰ 6s²', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: '5d (10) + 4f (14)', foiz: 75, qiymat: '24 element', rang: '#f472b6' },
      ],
      javobBadge: 'Lantanoidlar — 4f-qavatchani to\'ldiruvchi f-elementlar',
    },
    pastki: [
      'Boshlanishi: La (Z=57, 5d¹ 6s²)',
      '14 ta lantanoid (4f¹..¹⁴)',
      'Jami 6-davrda 32 element bor',
    ],
  },
  {
    id: 'd7',
    tugma: '7-davr: Ac (89)',
    formula: 'Ac (6d¹ 7s²) + 14 aktinoid (5f) → Cn (6d¹⁰)',
    tur: 'hisob',
    cfg: {
      sarlavha: '7-davr d va 5f aktinoidlar (32 ta element)',
      tenglama: 'Ac (6d¹) → 14 aktinoid (5f) → Rf..Cn (6d²..¹⁰)',
      qadamlar: [
        { belgi: '6d boshi', natija: 'Ac (Z=89)', izoh: '6d¹ 7s²', rang: '#a855f7' },
        { belgi: '5f oila', natija: '14 ta', izoh: 'Th..Lr aktinoidlar', rang: '#f472b6' },
        { belgi: '6d oxiri', natija: 'Cn (112)', izoh: '6d¹⁰ 7s²', rang: '#38bdf8' },
      ],
      taqqosBars: [
        { nom: '6d (10) + 5f (14)', foiz: 75, qiymat: '24 element', rang: '#a855f7' },
      ],
      javobBadge: 'Aktinoidlar — 5f-qavatchani to\'ldiruvchi f-elementlar',
    },
    pastki: [
      'Boshlanishi: Ac (Z=89, 6d¹ 7s²)',
      '14 ta aktinoid (5f¹..¹⁴)',
      'Yonaki guruhlar 4–7 davrlarda joylashgan',
    ],
  },
];

function KorgazmaDBoshlanishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. d-qavatcha boshlanishi va B-guruhlar (53-b)"
      ikon="qidiruv"
      variantlar={D_BOSHLARI_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 53-BET 5-SAVOL — 4-DAVRDA TOQ ELEKTRONLAR SONI
═══════════════════════════════════════════════════════════════ */
const TOQ_EL_VARIANTLAR = [
  {
    id: 'Cr',
    tugma: 'Cr (6 toq ✓)',
    formula: 'Cr (3d⁵ 4s¹): 6 toq • Mn (3d⁵ 4s²): 5 toq • Fe: 4 toq',
    tur: 'muvozanat',
    cfg: {
      sarlavha: '53-b 5-savol: 4-davrda eng ko\'p toq ē (Cr = 6)',
      tenglama: 'Elektron sakrashi (4s² 3d⁴ → 3d⁵ 4s¹) → 6 ta toq elektron!',
      turi: 'ustunlar',
      ustunlar: [
        { nom: 'Cr (3d⁵ 4s¹)', qiymat: 6, yorliq: '6 ta toq ★', rang: '#f472b6' },
        { nom: 'Mn (3d⁵ 4s²)', qiymat: 5, yorliq: '5 ta toq', rang: '#fbbf24' },
        { nom: 'Fe (3d⁶ 4s²)', qiymat: 4, yorliq: '4 ta toq', rang: '#34d399' },
        { nom: 'V (3d³ 4s²)', qiymat: 3, yorliq: '3 ta toq', rang: '#38bdf8' },
        { nom: 'As (4p³)', qiymat: 3, yorliq: '3 ta toq', rang: '#60a5fa' },
      ],
    },
    pastki: [
      'Rekord Xrom (Cr): 3d⁵ 4s¹ = 6 ta toq ē',
      'Marganes (Mn): 3d⁵ 4s² = 5 ta toq ē',
      'Sabab: 4s dan 1 ē 3d ga sakraydi',
    ],
  },
  {
    id: 'Mn',
    tugma: 'Mn (5 toq)',
    formula: 'Marganes (Z=25): [Ar] 3d⁵ 4s² → 5 ta toq elektron',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Marganes (+25 Mn): 3d⁵ 4s² — 5 ta toq elektron',
      tenglama: '5 ta 3d orbitalda 1 tadan (↑ ↑ ↑ ↑ ↑), 4s da 1 juft (↑↓)',
      qadamlar: [
        { belgi: '3d⁵ kataklari', natija: '5 toq', izoh: 'Har orbitalda ↑', rang: '#fbbf24' },
        { belgi: '4s² katagi', natija: '0 toq', izoh: 'Juftlashgan (↑↓)', rang: '#38bdf8' },
        { belgi: 'Jami toq ē', natija: '5 ta', izoh: 'Cr dan keyin 2-o\'rin', rang: '#34d399' },
      ],
      taqqosBars: [
        { nom: 'Cr (3d⁵ 4s¹)', foiz: 100, qiymat: '6 toq', rang: '#f472b6' },
        { nom: 'Mn (3d⁵ 4s²)', foiz: 83, qiymat: '5 toq', rang: '#fbbf24' },
      ],
      javobBadge: 'Mn: [Ar] 3d⁵ 4s² → 5 ta toq elektron',
    },
    pastki: [
      'Konfiguratsiya: [Ar] 3d⁵ 4s²',
      '3d da 5 ta toq elektron mavjud',
      'Eng ko\'pi esa Cr (6 ta) da',
    ],
  },
  {
    id: 'Fe',
    tugma: 'Fe (4 toq)',
    formula: 'Temir (Z=26): [Ar] 3d⁶ 4s² → 4 ta toq elektron',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Temir (+26 Fe): 3d⁶ 4s² — 4 ta toq elektron',
      tenglama: '3d⁶ = 1 ta juft (↑↓) + 4 ta toq (↑ ↑ ↑ ↑)',
      qadamlar: [
        { belgi: '3d⁶ holati', natija: '1 juft + 4 toq', izoh: '4 orbitalda ↑', rang: '#34d399' },
        { belgi: '4s² katagi', natija: '↑↓', izoh: 'Toq ē yo\'q', rang: '#38bdf8' },
        { belgi: 'Jami toq ē', natija: '4 ta', izoh: 'Ferromagnetik xossa', rang: '#fbbf24' },
      ],
      taqqosBars: [
        { nom: 'Fe toq ē', foiz: 67, qiymat: '4 / 6', rang: '#34d399' },
      ],
      javobBadge: 'Fe: [Ar] 3d⁶ 4s² → 4 ta toq elektron',
    },
    pastki: [
      'Konfiguratsiya: [Ar] 3d⁶ 4s²',
      '3d da 1 juft va 4 toq elektron bor',
      'Rekord esa Cr (6 ta) da',
    ],
  },
  {
    id: 'V_As',
    tugma: 'V va As (3 toq)',
    formula: 'Vanadiy (3d³) va Mishyak (4p³) — 3 tadan toq elektron',
    tur: 'hisob',
    cfg: {
      sarlavha: 'Vanadiy (3d³) va Mishyak (4p³): 3 tadan toq elektron',
      tenglama: 'V: [Ar] 3d³ 4s² (3 toq) • As: [Ar] 3d¹⁰ 4s² 4p³ (3 toq)',
      qadamlar: [
        { belgi: 'V (+23)', natija: '3 toq ē', izoh: '3 ta 3d orbitalda', rang: '#38bdf8' },
        { belgi: 'As (+33)', natija: '3 toq ē', izoh: '3 ta 4p orbitalda', rang: '#60a5fa' },
        { belgi: 'Solishtirish', natija: 'Cr = 6 ta', izoh: 'Eng ko\'pi Xromda', rang: '#f472b6' },
      ],
      taqqosBars: [
        { nom: 'Cr (maksimal)', foiz: 100, qiymat: '6 toq', rang: '#f472b6' },
        { nom: 'V / As', foiz: 50, qiymat: '3 toq', rang: '#38bdf8' },
      ],
      javobBadge: 'V va As da 3 tadan toq elektron bor',
    },
    pastki: [
      'Vanadiy: [Ar] 3d³ 4s² (3 toq)',
      'Mishyak: [Ar] 3d¹⁰ 4s² 4p³ (3 toq)',
      'Eng ko\'pi: Cr (6) va Mn (5)',
    ],
  },
];

function KorgazmaToqElektronlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 53-b 5-savol: Toq elektronlar (Cr=6, Mn=5)"
      ikon="uchqun"
      variantlar={TOQ_EL_VARIANTLAR}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (11-§) VA O'YINLAR (12-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '3-davrda (Na → Ar) 3d-qavatcha nega bo\'sh qoladi?',
    variantlar: [
      { matn: '3d-qavatcha umuman yo\'q', togri: false },
      { matn: 'K-qavatda 8 ē bor', togri: false },
      { matn: '3-qavat tashqi bo\'lgani uchun max 8 ē sig\'adi', togri: true },
      { matn: 'Hammasi inert gazlar', togri: false },
    ],
    izoh: '49-bet: 3-qavat tashqi bo\'lganda ko\'pi bilan 8 ē oladi (3d⁰).',
  },
  {
    id: 't2',
    savol: '2-davrda qaysilar s-element, qaysilar p-element?',
    variantlar: [
      { matn: 'Li, Be — s-element; B–Ne — p-elementlar', togri: true },
      { matn: 'Barchasi p-element', togri: false },
      { matn: 'F, Ne — s-element', togri: false },
      { matn: 'C, N, O — d-elementlar', togri: false },
    ],
    izoh: '50-bet: Li, Be (2s¹⁻²), B..Ne (2p¹⁻⁶).',
  },
  {
    id: 't3',
    savol: 'Z = 3 (Li) va Z = 11 (Na) dan qaysisida metallik kuchli?',
    variantlar: [
      { matn: 'Litiyda (Z=3)', togri: false },
      { matn: 'Ikkalasida teng', togri: false },
      { matn: 'Na metallmas', togri: false },
      { matn: 'Natriyda (Z=11): 3 qavat va radiusi katta', togri: true },
    ],
    izoh: '51-bet 3-topshiriq: Na (2,8,1) tashqi elektronini oson beradi.',
  },
  {
    id: 't4',
    savol: 'Yuqori oksidining D(H₂) = 22 bo\'lgan element qaysi?',
    variantlar: [
      { matn: 'Oltingugurt (S)', togri: false },
      { matn: 'Uglerod (C: CO₂, M = 44)', togri: true },
      { matn: 'Azot (N)', togri: false },
      { matn: 'Kremniy (Si)', togri: false },
    ],
    izoh: '51-bet: M = 22·2 = 44 → CO₂.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 's', nom: 'Katta davr s-elementi', tavsif: 'K, Ca, Cs' },
    { id: 'd', nom: 'd-element', tavsif: 'Sc..Zn (4–7-davr)' },
    { id: 'pf', nom: 'p- yoki f-element', tavsif: 'Ga..Kr va Ce..' },
  ],
  topshiriqlar: [
    { nom: 'K (+19: ...4s¹)', qisqa: '2, 8, 8, 1', guruh: 's', izoh: '4-davr 1-s-element.' },
    { nom: 'Ca (+20: ...4s²)', qisqa: '2, 8, 8, 2', guruh: 's', izoh: '4s-qavatcha to\'ladi.' },
    { nom: 'Cs (+55: [Xe] 6s¹)', qisqa: '2,8,18,18,8,1', guruh: 's', izoh: '6-davr ishqoriy metall.' },
    { nom: 'Sc (+21: ...4s² 3d¹)', qisqa: '2, 8, 9, 2', guruh: 'd', izoh: '3d-qavatcha boshlanishi.' },
    { nom: 'Ti (+22: ...4s² 3d²)', qisqa: '2, 8, 10, 2', guruh: 'd', izoh: '53-b 1-topshiriq d-element.' },
    { nom: 'Zn (+30: ...4s² 3d¹⁰)', qisqa: '2, 8, 18, 2', guruh: 'd', izoh: '3d¹⁰ bilan 3-qavat to\'ladi.' },
    { nom: 'Ga (+31: ...4p¹)', qisqa: '2, 8, 18, 3', guruh: 'pf', izoh: '4p-qavatcha boshlanishi.' },
    { nom: 'As (+33: ...4p³)', qisqa: '2, 8, 18, 5', guruh: 'pf', izoh: '53-b 1-topshiriq p-element.' },
    { nom: 'Ce (+58: [Xe] 6s² 4f²)', qisqa: '2,8,18,20,8,2', guruh: 'pf', izoh: '4f lantanoid (f-element).' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '4-davr soni',
    savol: '4- va 5-katta davrlarda necha qator va element bor?',
    variantlar: ['1 qator, 8 ta', '2 qator, 32 ta', '2 qator, 18 tadan element', '4 qator, 10 ta'],
    togri: 2,
    izoh: '51-bet: 4- va 5-davrlarda 2 qator, 18 tadan element.',
  },
  {
    belgi: 'Skandiy',
    savol: '+20 Ca dan keyin +21 Sc da elektron qayerga tushadi?',
    variantlar: ['3-qavatdagi 3d-qavatchaga', '4p-qavatchaga', '5s-qavatchaga', '4f-qavatchaga'],
    togri: 0,
    izoh: '52-bet: Skandiydan 3d-qavatcha to\'la boshlaydi (...4s² 3d¹).',
  },
  {
    belgi: 'Rux',
    savol: 'Rux (+30 Zn) qavat elektronlari taqsimoti?',
    variantlar: ['2, 8, 10, 10', '2, 8, 8, 12', '2, 8, 16, 4', '2, 8, 18, 2'],
    togri: 3,
    izoh: '52-bet: +30 Zn → 2, 8, 18, 2 (...4s² 3d¹⁰).',
  },
  {
    belgi: '53-b 1-savol',
    savol: 'Z=22 (Ti) va Z=33 (As) oxirgi qavatchalari?',
    variantlar: ['Ti: ...3p⁶ 4s⁴; As: ...4p⁵', 'Ti: ...4s² 3d² (d); As: ...4s² 3d¹⁰ 4p³ (p)', 'Ti: ...4p²; As: ...3d¹⁰ 4s³', 'Ti: ...4f²; As: ...5s¹'],
    togri: 1,
    izoh: 'Z=22 Titan (d), Z=33 Mishyak (p-element).',
  },
  {
    belgi: 'Qisqa yozuv',
    savol: 'Seziy (+55 Cs) qisqartirilgan formulasi (53-b)?',
    variantlar: ['[Kr] 5s¹', '[Xe] 6s¹', '[Ar] 4s¹', '[Rn] 7s¹'],
    togri: 1,
    izoh: '53-bet: +55 Cs = [Xe] 6s¹ (2,8,18,18,8,1).',
  },
  {
    belgi: '53-b 5-savol',
    savol: '4-davrda qaysi elementlarda toq ē eng ko\'p?',
    variantlar: ['K va Kr', 'Ca va Zn', 'Ga va Br', 'Cr (6 toq: 3d⁵ 4s¹) va Mn (5 toq: 3d⁵ 4s²)'],
    togri: 3,
    izoh: 'Cr da 6 ta toq ē, Mn da 5 ta toq ē.',
  },
  {
    belgi: 'Seriy',
    savol: '+58 Ce atomida 58 ē qanday joylashadi (52-b)?',
    variantlar: ['2, 8, 18, 20, 8, 2 (...6s² 4f²)', '2, 8, 18, 18, 10, 2', '2, 8, 18, 22, 6, 2', '2, 8, 18, 18, 8, 4'],
    togri: 0,
    izoh: '52-bet: +58 Ce — 2, 8, 18, 20, 8, 2 (4f²).',
  },
  {
    belgi: 'Kripton',
    savol: 'Kripton (+36 Kr) qavatlari va 4-davr tarkibi?',
    variantlar: ['2, 8, 8, 18', '2, 8, 18, 6', '2, 8, 18, 8 (2 s + 10 d + 6 p)', '2, 18, 8, 8'],
    togri: 2,
    izoh: '52-bet: +36 Kr (2, 8, 18, 8) 4-davrni tugatadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '4-davr bosqichlari',
    vazifa: '4-davrda s → d → p o\'tishini tartiblang:',
    tartib: ['K, Ca (4s¹⁻²)', 'Sc (3d¹ boshi)', 'Zn (3d¹⁰ to\'lishi)', 'Ga–Kr (4p¹⁻⁶)'],
    variantlar: ['Zn (3d¹⁰ to\'lishi)', 'K, Ca (4s¹⁻²)', 'Ga–Kr (4p¹⁻⁶)', 'Sc (3d¹ boshi)'],
  },
  {
    tur: 'd-element boshlanishi',
    vazifa: 'd-elementlar boshlanishini 4→7 davrda joylang:',
    tartib: ['4-davr: Sc (21)', '5-davr: Y (39)', '6-davr: La (57)', '7-davr: Ac (89)'],
    variantlar: ['6-davr: La (57)', '4-davr: Sc (21)', '7-davr: Ac (89)', '5-davr: Y (39)'],
  },
  {
    tur: 'Toq elektronlar soni',
    vazifa: '4-davrni toq ē soni ORTISHI bo\'yicha joylang:',
    tartib: ['Ca (0 toq)', 'V (3 toq)', 'Mn (5 toq)', 'Cr (6 toq)'],
    variantlar: ['Mn (5 toq)', 'Ca (0 toq)', 'Cr (6 toq)', 'V (3 toq)'],
  },
  {
    tur: '3-qavat to\'lishi',
    vazifa: '4-davrda M-qavat to\'lishini joylang:',
    tartib: ['Ca (M = 8 ē)', 'Sc (M = 9 ē)', 'Ti (M = 10 ē)', 'Zn (M = 18 ē)'],
    variantlar: ['Ti (M = 10 ē)', 'Ca (M = 8 ē)', 'Zn (M = 18 ē)', 'Sc (M = 9 ē)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '4-davr (Kr gacha) da nechta s-, d-, p-element bor?',
    variantlar: ['6 s, 2 d, 10 p', '2 s, 10 d, 6 p', '10 s, 6 d, 2 p', '18 d-element'],
    togri: 1,
    izoh: '52-bet: K, Ca (2 s), Sc–Zn (10 d), Ga–Kr (6 p).',
  },
  {
    savol: '53-b 3-savol: Lantanoid va aktinoidlar nega f-element?',
    variantlar: ['Tashqi s to\'lgan', 'Inert gaz', '3-davrda joylashgan', 'Ichki 4f va 5f qavatchalar to\'ladi'],
    togri: 3,
    izoh: '52-bet: 6- va 7-davrlarda 4f/5f (14 tadan) to\'ladi.',
  },
  {
    savol: '53-b 4-savol: Yonaki guruhcha qaysi davrlarda bo\'ladi?',
    variantlar: ['4-, 5-, 6- va 7-katta davrlarda', '1–3 kichik davrlarda', 'Faqat 2-davrda', 'Faqat 7-davrda'],
    togri: 0,
    izoh: 'B-guruhcha d/f metallari faqat 4–7 katta davrlarda.',
  },
  {
    savol: 'Galliy (+31 Ga) qavat elektronlari taqsimoti?',
    variantlar: ['2, 8, 8, 13', '2, 8, 10, 11', '2, 8, 18, 3 (...4s² 3d¹⁰ 4p¹)', '2, 8, 18, 2'],
    togri: 2,
    izoh: '52-bet: +31 Ga → 2, 8, 18, 3.',
  },
  {
    savol: 'Nega Xromda (Z=24) 6 ta toq elektron bor?',
    variantlar: ['Cr p-element', '3-qavatda 18 ē bor', '4s → 3d sakrash: 3d⁵ 4s¹', '4f to\'ladi'],
    togri: 2,
    izoh: '5 ta 3d + 1 ta 4s toq elektron = 6 ta.',
  },
  {
    savol: '4-qavatda (n=4) nazariy maksimal nechta ē bo\'ladi?',
    variantlar: ['32 ta (2·4²)', '18 ta', '50 ta', '8 ta'],
    togri: 0,
    izoh: '51-bet: N = 2·4² = 32 ta elektron.',
  },
  {
    savol: 'Ca (+20) va Sc (+21) orasidagi asosiy farq?',
    variantlar: ['Ca da 5 qavat bor', 'Sc da 21-ē 3-qavatga tushadi (8 → 9)', 'Sc da 4-qavat 3 ga oshadi', 'Farqi yo\'q'],
    togri: 1,
    izoh: '+20 Ca: 2,8,8,2 → +21 Sc: 2,8,9,2.',
  },
  {
    savol: 'Qaysi elementda 1-, 2-, 3-qavatlar (2, 8, 18) to\'lib bo\'ladi?',
    variantlar: ['Ca (Z=20)', 'Sc (Z=21)', 'Kr (Z=36)', 'Zn (Z=30: 2, 8, 18, 2)'],
    togri: 3,
    izoh: '52-bet: Ruxda (+30 Zn) 3-qavat 18 ē bilan to\'ladi.',
  },
];

export default function S8Mavzu12() {
  const korgazmalar = [
    { nom: '1. 4-davr to\'lishi (K..Kr)', ikon: 'atom', komponent: <KorgazmaTortinchiDavr /> },
    { nom: '2. 2s + 10d + 6p = 18', ikon: 'grafik', komponent: <KorgazmaOnSakkizTaqsimot /> },
    { nom: '3. 6-davr: Cs va Ce (f)', ikon: 'formula', komponent: <KorgazmaOltinchiDavr /> },
    { nom: '4. 1-topshiriq: Ti va As', ikon: 'yadro', komponent: <KorgazmaTitanMishyak /> },
    { nom: '5. d-qavatcha boshlanishi', ikon: 'qidiruv', komponent: <KorgazmaDBoshlanishi /> },
    { nom: '6. 5-savol: Toq elektronlar', ikon: 'uchqun', komponent: <KorgazmaToqElektronlar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Katta davr oilalari',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-12"
          nom="Katta davr elementlarini s, d va p/f oilalariga ajratish"
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
          key="tezkor-12"
          nom="12-§: Katta davr elementlari viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Katta davr zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-12"
          nom="4-davr to'lishi va d-elementlar zanjiri"
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
          key="duel-12"
          sarlavha="12-§: Katta davr elementlari dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="12-§"
      mavzuNom="Katta davr elementlarining atom tuzilishi"
      oldingiRaqam="11-§"
      oldingiNom="Kichik davr elementlarining atom tuzilishi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
