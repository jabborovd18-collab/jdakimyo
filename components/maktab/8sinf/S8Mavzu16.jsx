'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 16-PARAGRAF
// "Ionli bog'lanish" (Darslik 71-73-betlar)
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
   1-KO'RGAZMA: KESKIN NEM FARQI VA ION BOG' HOSIL BO'LISHI (71-72-BET)
═══════════════════════════════════════════════════════════════ */
const IONLI_MISOLLAR = {
  NaCl: {
    formula: 'NaCl (Osh tuzi)',
    met: 'Na⁰',
    emM: '0,93',
    nmet: 'Cl⁰',
    emN: '3,16',
    eSoni: '1 ē',
    kation: 'Na⁺ (2, 8)',
    anion: 'Cl⁻ (2, 8, 8)',
    izoh: 'Na 1 ē ni Cl ga to\'liq berib Na⁺ va Cl⁻ ionlari tortishadi.',
  },
  LiF: {
    formula: 'LiF (Litiy ftorid)',
    met: 'Li⁰',
    emM: '0,98',
    nmet: 'F⁰',
    emN: '4,00',
    eSoni: '1 ē',
    kation: 'Li⁺ (2)',
    anion: 'F⁻ (2, 8)',
    izoh: 'Li 2s¹ elektronni berib He (2) ga, F esa 1 ē olib Ne (2, 8) ga o\'tadi.',
  },
  CaO: {
    formula: 'CaO (Kalsiy oksid)',
    met: 'Ca⁰',
    emM: '1,00',
    nmet: 'O⁰',
    emN: '3,44',
    eSoni: '2 ē',
    kation: 'Ca²⁺ (2, 8, 8)',
    anion: 'O²⁻ (2, 8)',
    izoh: 'Ca tashqi 4s² dan 2 ē ni Kislorodga berib Ca²⁺ ↔ O²⁻ hosil qiladi.',
  },
  K2S: {
    formula: 'K₂S (Kaliy sulfid)',
    met: '2 K⁰',
    emM: '0,82',
    nmet: 'S⁰',
    emN: '2,58',
    eSoni: '2 × 1 ē',
    kation: '2 K⁺ (2, 8, 8)',
    anion: 'S²⁻ (2, 8, 8)',
    izoh: '2 ta K atomi 1 tadan elektronni S ga berib K⁺ va S²⁻ ionlari beradi.',
  },
};

function KorgazmaKeskinNEMIon() {
  const canvasRef = useRef(null);
  const [mid, setMid] = useState('NaCl');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = IONLI_MISOLLAR[mid];
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
      ctx.fillText(`71-72-bet: ${faol.formula} da elektronning to'liq o'tishi va ion bog'lanish`, 24, 34);

      const cy = h * 0.43;
      const x1 = w * 0.23;
      const x2 = w * 0.77;

      // Metall -> Kation
      chizZarracha(ctx, x1, cy, 38, '#f472b6', faol.kation.split(' ')[0]);
      // Metalmas -> Anion
      chizZarracha(ctx, x2, cy, 42, '#34d399', faol.anion.split(' ')[0]);

      // Uchib borayotgan elektron animatsiyasi
      const prog = (t % 2) / 2;
      const ex = x1 + 44 + prog * (x2 - x1 - 88);
      chizZarracha(ctx, ex, cy - 18, 9, '#fde047', 'e⁻');

      // O'rtadagi elektron o'tish va tortishuv ko'rsatkichi
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(x1 + 46, cy);
      ctx.lineTo(x2 - 48, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${faol.met} (${faol.emM})  —[ ${faol.eSoni} ]→  ${faol.nmet} (${faol.emN})`, w / 2, cy - 54);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Elektrostatik tortishish:  ${faol.kation}  ↔  ${faol.anion}`, w / 2, cy + 72);

      // Pastki quti
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      ctx.roundRect(28, h - 84, w - 56, 58, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.izoh, w / 2, h - 50, w - 88);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [mid]);

  return (
    <KorgazmaRamka
      sarlavha="1. Elektron o'tishi va ionli bog'lanish (71–72-b)"
      qisqaFormula="Kation (+) ↔ Anion (-) elektrostatik tortishishi • NaCl, LiF, CaO, K₂S"
      ikon="chaqmoq"
      boshqaruv={
        <>
          {Object.entries(IONLI_MISOLLAR).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setMid(k);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                mid === k
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {v.formula}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Metall atomi e⁻ beradi → Kation (+)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Metalmas e⁻ qabul qiladi → Anion (-)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Boshqa misollar: BaCl₂, CaF₂, KBr, CaI₂
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: 14- VA 15-JADVAL — Cl⁰/Cl⁻, Ar⁰, K⁰/K⁺ QIYOSLASH (72-73-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaJadval14Va15() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 14–15-jadval: Cl⁻, Ar⁰ va K⁺ tuzilishi (72–73-b)"
      ikon="yadro"
      variantlar={[
        {
          id: 'ion',
          tugma: '15-jadval: Cl⁻, Ar⁰, K⁺',
          formula: 'Qobiq bir xil (2, 8, 8 = 18 ē) • Yadro (+17, +18, +19) va zaryad har xil',
          tur: 'hisob',
          cfg: {
            sarlavha: '15-jadval: Cl⁻, Ar⁰ va K⁺ izoelektron zarrachalari',
            tenglama: 'Barchasida 18 ē (1s² 2s² 2p⁶ 3s² 3p⁶) • Yadro (+17, +18, +19)',
            qadamlar: [
              { belgi: 'Cl⁻ (-1)', natija: '2, 8, 8 (18 ē)', izoh: 'Yadro +17: Cl⁰ ga 1 ē qo\'shilgan', rang: '#34d399' },
              { belgi: 'Ar⁰ (0)', natija: '2, 8, 8 (18 ē)', izoh: 'Yadro +18: inert gaz atomi', rang: '#a855f7' },
              { belgi: 'K⁺ (+1)', natija: '2, 8, 8 (18 ē)', izoh: 'Yadro +19: K⁰ dan 1 ē ketgan', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Cl⁻ (17p,18e)', foiz: 85, qiymat: '+17 / -1', rang: '#34d399' },
              { nom: 'Ar⁰ (18p,18e)', foiz: 90, qiymat: '+18 / 0', rang: '#a855f7' },
              { nom: 'K⁺ (19p,18e)', foiz: 95, qiymat: '+19 / +1', rang: '#fbbf24' },
            ],
            javobBadge: 'Bir xil qobiq, har xil yadro → har xil xossa!',
          },
          pastki: [
            'Cl⁰ (+17: 2,8,7) + 1ē → Cl⁻ (2,8,8)',
            'K⁰ (+19: 2,8,8,1) - 1ē → K⁺ (2,8,8)',
            'Xossalar farqi yadro va zaryad tufayli!',
          ],
        },
        {
          id: 'atom',
          tugma: '14-jadval: Cl⁰, Ar⁰, K⁰',
          formula: 'Neytral atomlar: Cl⁰ (17 ē) • Ar⁰ (18 ē) • K⁰ (19 ē)',
          tur: 'hisob',
          cfg: {
            sarlavha: '14-jadval: Cl⁰, Ar⁰ va K⁰ neytral atomlari',
            tenglama: 'p⁺ = e⁻ (zaryad = 0): Cl(2,8,7) • Ar(2,8,8) • K(2,8,8,1)',
            qadamlar: [
              { belgi: 'Cl⁰ (+17)', natija: '2, 8, 7 (17 ē)', izoh: '...3s² 3p⁵ (oktetga 1 ē kam)', rang: '#38bdf8' },
              { belgi: 'Ar⁰ (+18)', natija: '2, 8, 8 (18 ē)', izoh: '...3s² 3p⁶ (tayyor oktet)', rang: '#a855f7' },
              { belgi: 'K⁰ (+19)', natija: '2, 8, 8, 1 (19 ē)', izoh: '...3p⁶ 4s¹ (ortiqcha 1 ē bor)', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'Cl⁰ elektron', foiz: 85, qiymat: '17 ē', rang: '#38bdf8' },
              { nom: 'Ar⁰ elektron', foiz: 90, qiymat: '18 ē', rang: '#a855f7' },
              { nom: 'K⁰ elektron', foiz: 95, qiymat: '19 ē', rang: '#f472b6' },
            ],
            javobBadge: 'Neytral atomlar Argon qobig\'iga intiladi',
          },
          pastki: [
            'Cl⁰ oktetga intilib 1 ē oladi',
            'K⁰ tashqi 4s¹ elektronini oson beradi',
            'Ar⁰ tayyor oktet (inert gaz)',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 73-BET 3-MASHQ — Mg²⁺, F⁻ VA Ne IZOELEKTRON ZARRACHALAR
═══════════════════════════════════════════════════════════════ */
const MASHQ3_IONLAR = [
  { b: 'Mg²⁺', nom: 'Magniy kationi', z: '+12', bosh: 'Mg⁰: 2, 8, 2 (- 2 ē)', oxir: '2, 8 (1s² 2s² 2p⁶)', e: 10, rang: '#fbbf24' },
  { b: 'Ne⁰', nom: 'Neon atomi', z: '+10', bosh: 'Inert gaz (o\'zgarmaydi)', oxir: '2, 8 (1s² 2s² 2p⁶)', e: 10, rang: '#a855f7' },
  { b: 'F⁻', nom: 'Ftorid anioni', z: '+9', bosh: 'F⁰: 2, 7 (+ 1 ē)', oxir: '2, 8 (1s² 2s² 2p⁶)', e: 10, rang: '#34d399' },
];

function KorgazmaMashq3Izoelektron() {
  const canvasRef = useRef(null);
  const [tanlov, setTanlov] = useState('Mg²⁺');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = MASHQ3_IONLAR.find((m) => m.b === tanlov) || MASHQ3_IONLAR[0];
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
      ctx.fillText(`73-bet 3-mashq: ${faol.b} (${faol.nom}) — Neon elektron qobig'i (2, 8)`, 24, 34);

      const cx = w * 0.27;
      const cy = h * 0.50;
      [2, 8].forEach((cnt, idx) => {
        const rad = 36 + idx * 32;
        ctx.strokeStyle = idx === 1 ? faol.rang : 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = idx === 1 ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 0; i < cnt; i++) {
          const ang = t * (0.9 - idx * 0.2) + (i * Math.PI * 2) / cnt;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, 4.5, idx === 1 ? faol.rang : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 19, '#ef4444', faol.z);

      const rx = w * 0.52;
      const rw = w * 0.44;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, 68, rw, h - 102, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = faol.rang;
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.fillText(`${faol.b}  (Yadro: ${faol.z}, Elektronlar: ${faol.e} ta)`, rx + 20, 106);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 13.5px "Times New Roman", serif';
      ctx.fillText(`Hosil bo'lishi: ${faol.bosh}`, rx + 20, 146);
      ctx.fillStyle = '#fde047';
      ctx.fillText(`Konfiguratsiya: ${faol.oxir}`, rx + 20, 180);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText('Izoelektron: uchalasi ham 10 ē (1s² 2s² 2p⁶).', rx + 20, 220, rw - 40);
      ctx.fillText('Lekin protonlari (+12, +10, +9) turlicha.', rx + 20, 244, rw - 40);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tanlov]);

  return (
    <KorgazmaRamka
      sarlavha="3. 73-bet 3-mashq: Mg²⁺, F⁻ va Ne tuzilishi"
      qisqaFormula="Mg²⁺ (+12, 10ē) • Ne⁰ (+10, 10ē) • F⁻ (+9, 10ē)  →  barchasi 1s² 2s² 2p⁶"
      ikon="atom"
      boshqaruv={
        <>
          {MASHQ3_IONLAR.map((m) => (
            <button
              key={m.b}
              type="button"
              onClick={() => {
                setTanlov(m.b);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                tanlov === m.b
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {m.b} ({m.nom})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Mg⁰ (2,8,2) - 2ē → Mg²⁺ (2,8)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            F⁰ (2,7) + 1ē → F⁻ (2,8)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-purple-300">
            Mos inert gaz: Neon (Ne, Z=10)
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: KATION VA ANIONLAR — IONLAR TURI (72-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaIonTaqsimot() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Kationlar (+) va anionlar (-) (72-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kation',
          tugma: 'Kationlar (+)',
          formula: 'Atom elektron yo\'qotsa musbat KATION hosil bo\'ladi (p⁺ > e⁻)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Kation (+): Li⁺, Na⁺, Mg²⁺, Al³⁺ — p⁺ > e⁻',
            tenglama: 'Na⁰ (+11, 11ē) - 1ē → Na⁺ (+11p⁺, 10e⁻)',
            rejim: 'atom',
            qavatlar: [2, 8],
            markaz: { belgi: 'Na⁺', zaryad: '+11p > 10e', rang: '#f472b6' },
            metrikalar: [
              { nom: 'Proton (p⁺)', qiymat: '+11', foiz: 100, rang: '#f472b6' },
              { nom: 'Elektron (e⁻)', qiymat: '10 ē (-1ē)', foiz: 91, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Li⁺ (+3)', v: '2 ē', rang: '#38bdf8' },
              { k: 'Mg²⁺ (+12)', v: '10 ē (2,8)', rang: '#fbbf24' },
              { k: 'Al³⁺ (+13)', v: '10 ē (2,8)', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Kationda protonlar elektrondan ko\'p (p⁺ > e⁻)',
            'Metall atomlari tashqi ē ni beradi',
            'Oktet/duplet qobiqqa erishadi',
          ],
        },
        {
          id: 'anion',
          tugma: 'Anionlar (-)',
          formula: 'Atom elektron qabul qilsa manfiy ANION hosil bo\'ladi (e⁻ > p⁺)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Anion (-): F⁻, Cl⁻, O²⁻, S²⁻ — e⁻ > p⁺',
            tenglama: 'Cl⁰ (+17, 17ē) + 1ē → Cl⁻ (+17p⁺, 18e⁻)',
            rejim: 'atom',
            qavatlar: [2, 8, 8],
            markaz: { belgi: 'Cl⁻', zaryad: '18e > +17p', rang: '#34d399' },
            metrikalar: [
              { nom: 'Proton (p⁺)', qiymat: '+17', foiz: 94, rang: '#38bdf8' },
              { nom: 'Elektron (e⁻)', qiymat: '18 ē (+1ē)', foiz: 100, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'F⁻ (+9)', v: '10 ē', rang: '#34d399' },
              { k: 'O²⁻ (+8)', v: '10 ē (2,8)', rang: '#38bdf8' },
              { k: 'S²⁻ (+16)', v: '18 ē (2,8,8)', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'Anionda elektronlar protondan ko\'p (e⁻ > p⁺)',
            'Metalmaslar tashqi qavatni 8 ē ga to\'ldiradi',
            'Ionlar orasida elektrostatik tortishish bor',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: TUZLAR VA ISHQORLARDA IONLI + KOVALENT BOG' (72-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaTuzVaIshqorIonli() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Tuz va ishqorlarda ionli + kovalent bog' (72-b)"
      ikon="kolba"
      variantlar={[
        {
          id: 'NaOH',
          tugma: 'NaOH (Ishqor)',
          formula: 'Na⁺ ↔ OH⁻ (ionli) • OH⁻ ichida O—H (qutbli kovalent)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'NaOH: Na⁺ bilan OH⁻ ionli, O—H esa qutbli kovalent',
            tenglama: 'Na⁺  ↔  [O — H]⁻   (ham ionli, ham kovalent)',
            rejim: 'bog',
            bogJuft: { chap: 'Na⁺', chapRang: '#f472b6', ong: 'OH⁻', ongRang: '#38bdf8', siljish: 0.7 },
            metrikalar: [
              { nom: 'Na⁺ ↔ OH⁻', qiymat: 'Ionli bog\'', foiz: 95, rang: '#f472b6' },
              { nom: 'O — H ichida', qiymat: 'Kovalent', foiz: 75, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Kation', v: 'Na⁺', rang: '#f472b6' },
              { k: 'Anion ichi', v: 'O — H kovalent', rang: '#34d399' },
            ],
          },
          pastki: [
            'Ionli: M⁺ va gidroksid OH⁻ orasida',
            'Kovalent: O—H atomlari orasida',
            'Binar tuzlarda (NaCl) faqat ionli bog\'',
          ],
        },
        {
          id: 'KNO3',
          tugma: 'KNO₃ (Tuz)',
          formula: 'K⁺ ↔ NO₃⁻ (ionli) • NO₃⁻ ichida N—O (kovalent)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'KNO₃: K⁺ ↔ NO₃⁻ (ionli), nitrat ichida N—O kovalent',
            tenglama: 'K⁺  ↔  [NO₃]⁻   (kislota qoldig\'ida kovalent bog\')',
            markaz: { belgi: 'N⁺', rang: '#38bdf8', r: 22 },
            atomlar: [
              { belgi: 'O', burchak: 0, masofa: 72, bog: 2, rang: '#f472b6', r: 15 },
              { belgi: 'O', burchak: 2.1, masofa: 72, bog: 1, rang: '#f472b6', r: 15 },
              { belgi: 'O⁻', burchak: 4.2, masofa: 72, bog: 1, rang: '#f472b6', r: 15 },
            ],
            metrikalar: [
              { nom: 'K⁺ ↔ NO₃⁻', qiymat: 'Ionli bog\'', foiz: 95, rang: '#fbbf24' },
              { nom: 'N — O ichida', qiymat: 'Kovalent', foiz: 80, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Tashqi', v: 'K⁺ va NO₃⁻ ionli', rang: '#fbbf24' },
              { k: 'Qoldiq ichi', v: 'N—O kovalent', rang: '#34d399' },
            ],
          },
          pastki: [
            'Kislorodli tuzlarda ikkala bog\' turi bor',
            'K⁺ ↔ NO₃⁻ orasida elektrostatik tortishish',
            'NO₃⁻ ichida umumiy elektron juftlar',
          ],
        },
        {
          id: 'CaCO3',
          tugma: 'CaCO₃ (Tuz)',
          formula: 'Ca²⁺ ↔ CO₃²⁻ (ionli) • CO₃²⁻ ichida C—O (kovalent)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'CaCO₃: Ca²⁺ ↔ CO₃²⁻ (ionli), karbonat ichida C—O kovalent',
            tenglama: 'Ca²⁺  ↔  [CO₃]²⁻   (ham ionli, ham kovalent)',
            markaz: { belgi: 'C', rang: '#fbbf24', r: 22 },
            atomlar: [
              { belgi: 'O', burchak: 0, masofa: 72, bog: 2, rang: '#38bdf8', r: 15 },
              { belgi: 'O⁻', burchak: 2.1, masofa: 72, bog: 1, rang: '#38bdf8', r: 15 },
              { belgi: 'O⁻', burchak: 4.2, masofa: 72, bog: 1, rang: '#38bdf8', r: 15 },
            ],
            metrikalar: [
              { nom: 'Ca²⁺ ↔ CO₃²⁻', qiymat: 'Ionli bog\'', foiz: 95, rang: '#f472b6' },
              { nom: 'C — O ichida', qiymat: 'Kovalent', foiz: 80, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Kation', v: 'Ca²⁺', rang: '#f472b6' },
              { k: 'Anion ichi', v: 'C—O kovalent', rang: '#34d399' },
            ],
          },
          pastki: [
            'CaCO₃: Ca²⁺ bilan CO₃²⁻ ionli bog\'langan',
            'Karbonat ichida C—O qutbli kovalent',
            'Sulfat va fosfatlar ham shunday tuzilgan',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: KOVALENT VA IONLI BOG'LANISHNI QIYOSLASH (71-73-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaKovalentVsIonli() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Kovalent va ionli bog'lanish farqlari (71–73-b)"
      ikon="grafik"
      variantlar={[
        {
          id: 'hammasi',
          tugma: 'Barchasini taqqoslash',
          formula: 'Kovalent: umumiy juft (δ⁺/δ⁻) • Ionli: to\'liq elektron o\'tishi (+ va - ion)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Kovalent va Ionli bog\'lanishning 3 asosiy farqi',
            tenglama: 'Metalmas+Metalmas (kovalent) vs Metall+Metalmas (ionli)',
            qadamlar: [
              { belgi: 'Atomlar', natija: 'NM+NM vs M+NM', izoh: 'Kovalent: metalmaslar; Ionli: keskin ΔEM', rang: '#38bdf8' },
              { belgi: 'Elektronlar', natija: 'Juft vs O\'tish', izoh: 'Umumiy elektron juft vs to\'liq berish/olish', rang: '#34d399' },
              { belgi: 'Zarrachalar', natija: '0/δ vs Ion (+/-)', izoh: 'Misollar: H₂O, NH₃ vs NaCl, CaO, K₂S', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'Kovalent ΔEM', foiz: 45, qiymat: '0 – 1,8', rang: '#34d399' },
              { nom: 'Ionli ΔEM', foiz: 95, qiymat: 'Keskin (>2)', rang: '#f472b6' },
            ],
            javobBadge: 'Yo\'nalgan (kovalent) vs Yo\'nalmagan (ionli)',
          },
          pastki: [
            'Kovalent: yo\'nalgan va to\'yinuvchi bog\'',
            'Ionli: yo\'nalmagan elektrostatik tortishish',
            'Binar metall + metalmas = ionli birikma',
          ],
        },
        {
          id: 'kovalent',
          tugma: 'Kovalentni ajratish',
          formula: 'H₂, Cl₂, O₂, HCl, H₂O, NH₃ — umumiy elektron juftlar hisobiga',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Kovalent bog\'lanish: umumiy elektron juft (H₂O, NH₃)',
            tenglama: 'Metalmas + Metalmas • Kichik yoki nol ΔEM farqi',
            markaz: { belgi: 'O', rang: '#34d399', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.45, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 2.25, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
            ],
            metrikalar: [
              { nom: 'Bog\' turi', qiymat: 'Umumiy juft', foiz: 85, rang: '#34d399' },
              { nom: 'Qutb zaryadi', qiymat: '0 yoki δ⁺/δ⁻', foiz: 55, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Qutbsiz', v: 'H₂, Cl₂, N₂', rang: '#38bdf8' },
              { k: 'Qutbli', v: 'HCl, H₂O, NH₃', rang: '#34d399' },
            ],
          },
          pastki: [
            'Molekula tuzilishini belgilaydi (yo\'nalgan)',
            'Bir xil NEM → qutbsiz; har xil → qutbli',
            'Oktet/duplet umumlashish orqali hosil bo\'ladi',
          ],
        },
        {
          id: 'ionli',
          tugma: 'Ionlini ajratish',
          formula: 'NaCl, K₂S, LiF, CaO, KBr, CaI₂ — to\'liq ionlar tortishishi',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Ionli bog\'lanish: kation (+) va anion (-) kristall panjarasi',
            tenglama: 'Metall + Metalmas • To\'liq elektron o\'tishi',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Bog\' kuchi', qiymat: 'Elektrostatik', foiz: 95, rang: '#f472b6' },
              { nom: 'Tarkibi', qiymat: 'Na⁺, Cl⁻ ionlar', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Xossasi', v: 'Qiyin suyuqlanadi', rang: '#f472b6' },
              { k: 'Misollar', v: 'NaCl, LiF, CaO', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'Alohida molekula yo\'q, ion kristall panjara',
            'Yo\'nalmagan va to\'yinmagan bog\'',
            'Qattiq, suvda eritma tok o\'tkazadi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (15-§) VA O'YINLAR (16-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Qaysi moddalarda QUTBSIZ kovalent bog\' bor?',
    variantlar: [
      { matn: 'HCl va H₂O', togri: false },
      { matn: 'NaCl va MgO', togri: false },
      { matn: 'H₂, Cl₂, O₂ va N₂ (ΔEM=0)', togri: true },
      { matn: 'NH₃ va CH₄', togri: false },
    ],
    izoh: '68-b: bir xil atomlar orasida juft siljimaydi.',
  },
  {
    id: 't2',
    savol: 'NH₃ + H⁺ → NH₄⁺ da donor va akseptor:',
    variantlar: [
      { matn: 'Azot (N:) donor, H⁺ akseptor', togri: true },
      { matn: 'H⁺ donor, Azot akseptor', togri: false },
      { matn: 'Ikkalasi akseptor', togri: false },
      { matn: 'Vodorod atomi donor', togri: false },
    ],
    izoh: '69–70-b: N(:) juft beradi, H⁺ bo\'sh orbital.',
  },
  {
    id: 't3',
    savol: '71-b 4-mashq: HCl da Cl ning taqsimlanmagan juftlari:',
    variantlar: [
      { matn: '1 ta', togri: false },
      { matn: '2 ta', togri: false },
      { matn: '4 ta', togri: false },
      { matn: '3 ta (6 ē erkin qoladi)', togri: true },
    ],
    izoh: 'Cl da 7 ē dan 1 tasi bog\'da, 6 ē = 3 juft.',
  },
  {
    id: 't4',
    savol: 'O₂ va N₂ dagi umumiy elektron juftlar soni:',
    variantlar: [
      { matn: 'Ikkalasida 1 ta', togri: false },
      { matn: 'O₂ da 2 (O=O), N₂ da 3 (N≡N)', togri: true },
      { matn: 'O₂ da 3, N₂ da 2', togri: false },
      { matn: 'Ikkalasida 4 ta', togri: false },
    ],
    izoh: '68-b: O₂ qo\'shbog\', N₂ esa uchbog\'ga ega.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'faqat_ion', nom: 'Sof ionli (binar)', tavsif: 'Metall + Metalmas (NaCl, CaO)' },
    { id: 'aralash', nom: 'Ionli + Kovalent', tavsif: 'Ishqor va kislorodli tuzlar' },
    { id: 'ion_zarracha', nom: 'Kation va anionlar', tavsif: 'Cl⁻, K⁺, Mg²⁺, F⁻' },
  ],
  topshiriqlar: [
    { nom: 'NaCl, LiF, KBr, CaI₂', qisqa: 'Galogenid tuzlar', guruh: 'faqat_ion', izoh: '71–72-b: metall + halogen ion bog\'i.' },
    { nom: 'CaO, Li₂O, MgO, K₂S', qisqa: 'Ion oksid/sulfid', guruh: 'faqat_ion', izoh: 'Keskin NEM farqi bilan ē to\'liq o\'tadi.' },
    { nom: 'BaCl₂ va CaF₂', qisqa: 'II valentli tuzlar', guruh: 'faqat_ion', izoh: 'Ba va Ca 2 tadan elektron beradi.' },
    { nom: 'NaOH va KOH (ishqor)', qisqa: 'M⁺ + OH⁻', guruh: 'aralash', izoh: '72-b: M⁺↔OH⁻ ionli, O—H kovalent.' },
    { nom: 'CaCO₃ va KNO₃', qisqa: 'Kislorodli tuzlar', guruh: 'aralash', izoh: 'Kation↔qoldiq ionli, qoldiq ichi kovalent.' },
    { nom: 'Na₂SO₄ va K₃PO₄', qisqa: 'Sulfat/fosfat', guruh: 'aralash', izoh: 'S—O va P—O ichida kovalent bog\'.' },
    { nom: 'Cl⁻ (2,8,8) va F⁻ (2,8)', qisqa: 'Manfiy anionlar', guruh: 'ion_zarracha', izoh: 'Elektron biriktirib olgan ionlar.' },
    { nom: 'K⁺ (2,8,8) va Mg²⁺ (2,8)', qisqa: 'Musbat kationlar', guruh: 'ion_zarracha', izoh: 'Tashqi elektron yo\'qotgan metall ionlari.' },
    { nom: 'Elektrostatik tortishish', qisqa: 'Kation ↔ Anion', guruh: 'ion_zarracha', izoh: 'Qarama-qarshi ionlar tortishishi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Ion bog\' ta\'rifi',
    savol: 'Ionli bog\'lanish qanday hosil bo\'ladi?',
    variantlar: [
      'Bir xil atom ē bo\'lishishi',
      'Inert gazlar orasida',
      'Qarama-qarshi ionlar tortishishidan',
      'Proton almashinishidan',
    ],
    togri: 2,
    izoh: '72-b: elektron o\'tishi → kation ↔ anion tortishadi.',
  },
  {
    belgi: '15-jadval (73-b)',
    savol: 'Cl⁻, Ar⁰ va K⁺ da bir xil va har xil jihatlar:',
    variantlar: [
      'Qobiq 2,8,8 (18ē); yadro +17,+18,+19 va zaryad -1,0,+1',
      'Yadro +18 bir xil, qobiq har xil',
      'Barcha xossalari bir xil',
      'Proton va elektron teng',
    ],
    togri: 0,
    izoh: '73-b: izoelektron (18 ē), lekin yadro va zaryad turlicha.',
  },
  {
    belgi: '73-b 3-mashq',
    savol: 'Mg²⁺ va F⁻ qaysi inert gaz qobig\'iga mos?',
    variantlar: ['Geliy (2 ē)', 'Argon (18 ē)', 'Kripton (36 ē)', 'Neon (2, 8 — 10 ē)'],
    togri: 3,
    izoh: '73-b: Mg²⁺ (10 ē) va F⁻ (10 ē) → Neon.',
  },
  {
    belgi: '72-b: Ishqor',
    savol: 'NaOH tarkibidagi bog\'lanish turlari:',
    variantlar: ['Faqat ionli', 'Ionli (Na⁺↔OH⁻) va kovalent (O—H)', 'Faqat kovalent', 'Faqat metall'],
    togri: 1,
    izoh: '72-b: M⁺ bilan OH⁻ ionli, O—H esa qutbli kovalent.',
  },
  {
    belgi: 'Kaliy +19 K',
    savol: 'K⁰ (2, 8, 8, 1) bitta elektron bersa qanday ion?',
    variantlar: ['K⁻ anioni', 'K⁺ kationi (2, 8, 8 — 18 ē)', 'Ar atomi', 'Ca²⁺ ioni'],
    togri: 1,
    izoh: '72-b: +19 K⁰ - 1 ē → K⁺ (19p⁺, 18e⁻).',
  },
  {
    belgi: 'Ionli moddalar',
    savol: 'BARCHASIDA ionli bog\' bo\'lgan qator:',
    variantlar: ['H₂, HCl, CH₄', 'CO₂, SO₂, H₂O', 'N₂, O₂, NH₃', 'LiF, CaO, K₂S, KBr, CaI₂'],
    togri: 3,
    izoh: '71–72-b: metall + faol metalmas birikmalari.',
  },
  {
    belgi: 'Kation & Anion',
    savol: 'O + 2ē → O²⁻ jarayonida qanday ion hosil bo\'ladi?',
    variantlar: ['Ikki manfiy zaryadli anion (O²⁻)', 'Musbat kation (O²⁺)', 'Neytral atom', 'Inert gaz'],
    togri: 0,
    izoh: 'Elektronlar protonlardan 2 ta ko\'p → O²⁻ anion.',
  },
  {
    belgi: 'Xossa farqi',
    savol: 'Cl⁻ nega 2, 8, 8 bo\'lsa-da Argonga o\'xshamaydi?',
    variantlar: ['4 qavatli bo\'lgani uchun', '18 p⁺ bo\'lgani uchun', 'Yadrosi +17, zaryadi -1 (Ar da +18, 0)', '20 ē bo\'lgani uchun'],
    togri: 2,
    izoh: '73-b: yadro zaryadi va ion zaryadi farq qiladi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'NaCl hosil bo\'lishi',
    vazifa: 'NaCl hosil bo\'lish bosqichlarini tartiblang:',
    tartib: ['Na⁰ va Cl⁰ yaqinlashadi', 'Na 3s¹ ē ni Cl ga beradi', 'Na⁺ (2,8) va Cl⁻ (2,8,8)', 'Ionlar tortishib NaCl beradi'],
    variantlar: ['Na⁺ (2,8) va Cl⁻ (2,8,8)', 'Na⁰ va Cl⁰ yaqinlashadi', 'Ionlar tortishib NaCl beradi', 'Na 3s¹ ē ni Cl ga beradi'],
  },
  {
    tur: '18 ē li qator',
    vazifa: '18 ē li zarrachalarni yadro zaryadi o\'sishida joylang:',
    tartib: ['S²⁻ (yadro +16)', 'Cl⁻ (yadro +17)', 'Ar⁰ (yadro +18)', 'K⁺ (+19) → Ca²⁺ (+20)'],
    variantlar: ['Ar⁰ (yadro +18)', 'S²⁻ (yadro +16)', 'K⁺ (+19) → Ca²⁺ (+20)', 'Cl⁻ (yadro +17)'],
  },
  {
    tur: '10 ē li qator',
    vazifa: '3-mashq: Ne (2,8) qobig\'ini proton o\'sishida tering:',
    tartib: ['F⁻ (Z = 9, 10 ē)', 'Ne⁰ (Z = 10, 10 ē)', 'Na⁺ (Z = 11, 10 ē)', 'Mg²⁺ (Z = 12, 10 ē)'],
    variantlar: ['Na⁺ (Z = 11, 10 ē)', 'F⁻ (Z = 9, 10 ē)', 'Mg²⁺ (Z = 12, 10 ē)', 'Ne⁰ (Z = 10, 10 ē)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '+17 Cl atomi 1 ē olsa nechta p⁺ va e⁻ li Cl⁻?',
    variantlar: ['18 p⁺, 17 e⁻', '17 p⁺, 18 e⁻ (2, 8, 8)', '17 p⁺, 17 e⁻', '18 p⁺, 18 e⁻'],
    togri: 1,
    izoh: '72–73-b: yadro (+17) o\'zgarmaydi, 17 + 1 = 18 ē.',
  },
  {
    savol: '+12 Mg²⁺ ionining elektron formulasi (73-b):',
    variantlar: ['1s² 2s² 2p⁶ 3s²', '1s² 2s² 2p⁵', '1s² 2s² 2p⁶ 3s¹', '1s² 2s² 2p⁶ (Neon qobig\'i)'],
    togri: 3,
    izoh: '73-b 3-mashq: tashqi 3s² ni berib (2, 8) bo\'ladi.',
  },
  {
    savol: 'HAM ionli, HAM kovalent bog\'li modda (72-b):',
    variantlar: ['KOH (kaliy gidroksid)', 'NaCl (osh tuzi)', 'O₂ (kislorod)', 'LiF (litiy ftorid)'],
    togri: 0,
    izoh: 'KOH da K⁺↔OH⁻ ionli, O—H esa kovalent.',
  },
  {
    savol: 'CaO da Ca dan O ga nechta elektron o\'tadi?',
    variantlar: ['1 ta ē', '3 ta ē', '2 ta ē (Ca²⁺ va O²⁻)', '4 ta ē'],
    togri: 2,
    izoh: 'Ca (4s²) ikkala elektronini O (2p⁴) ga beradi.',
  },
  {
    savol: 'CaI₂ va Li₂O dagi asosiy bog\'lanish (73-b):',
    variantlar: ['Qutbsiz kovalent', 'Donor-akseptor', 'Ionli bog\'lanish', 'Vodorod bog\'lanish'],
    togri: 2,
    izoh: '73-b 1-mashq: metall + faol metalmas → ionli.',
  },
  {
    savol: 'K⁰ (+19) va K⁺ xossalari nega tubdan farq qiladi?',
    variantlar: ['K⁰ (4s¹) faol; K⁺ (2,8,8) barqaror ion', 'Protonlari har xil', 'Massasi 2x kichik', 'Xossasi bir xil'],
    togri: 0,
    izoh: '72-b: elektron qobiq va zaryad har xil.',
  },
  {
    savol: 'Sulfid anioni S²⁻ (+16 S) da nechta elektron bor?',
    variantlar: ['14 ta', '18 ta (2, 8, 8)', '16 ta', '10 ta'],
    togri: 1,
    izoh: 'S (+16) + 2 ē = 18 ta elektron (Ar okteti).',
  },
  {
    savol: 'Kovalent va ionli birikma juftligini toping:',
    variantlar: ['NaCl va KBr', 'Li₂O va MgO', 'H₂ va HCl', 'CO₂ (kovalent) va BaCl₂ (ionli)'],
    togri: 3,
    izoh: 'CO₂ metalmaslar, BaCl₂ metall + halogen.',
  },
];

export default function S8Mavzu16() {
  const korgazmalar = [
    { nom: '1. Ion bog\' mexanizmi', ikon: 'chaqmoq', komponent: <KorgazmaKeskinNEMIon /> },
    { nom: '2. 14- va 15-jadval (Cl⁻/Ar/K⁺)', ikon: 'yadro', komponent: <KorgazmaJadval14Va15 /> },
    { nom: '3. 3-mashq: Mg²⁺, F⁻, Ne', ikon: 'atom', komponent: <KorgazmaMashq3Izoelektron /> },
    { nom: '4. Kation va anionlar', ikon: 'uchqun', komponent: <KorgazmaIonTaqsimot /> },
    { nom: '5. Tuz va ishqorlarda bog\'', ikon: 'kolba', komponent: <KorgazmaTuzVaIshqorIonli /> },
    { nom: '6. Kovalent vs Ionli', ikon: 'grafik', komponent: <KorgazmaKovalentVsIonli /> },
  ];

  const oyinlar = [
    {
      nom: '1. Ionli tuzilish guruhlari',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-16"
          nom="Binar ionli, aralash va zaryadli ionlarni ajratish"
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
          key="tezkor-16"
          nom="16-§: Ionli bog'lanish viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Ion zanjirlari',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-16"
          nom="Ion hosil bo'lishi va izoelektron qatorlar zanjiri"
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
          key="duel-16"
          sarlavha="16-§: Ionli bog'lanish dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="16-§"
      mavzuNom="Ionli bog'lanish"
      oldingiRaqam="15-§"
      oldingiNom="Kimyoviy bog'lanish turlari. Qutbli va qutbsiz kovalent bog'lanish"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
