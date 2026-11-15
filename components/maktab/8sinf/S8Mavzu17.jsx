'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 17-PARAGRAF
// "Kristall panjaralar" (Darslik 74-76-betlar)
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
   1-KO'RGAZMA: KRISTALL VA AMORF MODDALAR (74-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaAmorfVaKristall() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Qattiq moddalarning kristall va amorf tuzilishi (74-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'kristall',
          tugma: 'Kristall panjara',
          formula: 'Tartibli geometrik panjara • Aniq T_suyuq',
          tur: 'molekula',
          cfg: {
            sarlavha: '74-bet: Kristall — zarrachalari qat\'iy tartibda',
            tenglama: 'NaCl, olmos, grafit, muz, metallar → aniq T_suyuq',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Geometrik tartib', qiymat: '100% (qat\'iy)', foiz: 100, rang: '#38bdf8' },
              { nom: 'Suyuqlanish harorati', qiymat: 'Aniq (o\'zgarmas)', foiz: 92, rang: '#34d399' },
              { nom: 'Panjara turlari', qiymat: '4 xil', foiz: 80, rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Misol', v: 'NaCl, olmos, muz', rang: '#38bdf8' },
              { k: 'Xossa', v: 'Aniq T_suyuq', rang: '#34d399' },
              { k: 'Tuzilish', v: 'Kristall panjara', rang: '#fde047' },
            ],
          },
          pastki: [
            'Kristall: osh tuzi, olmos, grafit, metallar',
            'Zarrachalar fazoda qat\'iy tartibda joylashgan',
            'Panjara 4 xil: ionli, atomli, molekular, metall',
          ],
        },
        {
          id: 'amorf',
          tugma: 'Amorf tuzilish',
          formula: 'Tartibsiz joylashuv • Aniq T_suyuq yo\'q',
          tur: 'hisob',
          cfg: {
            sarlavha: '74-bet: Amorf moddalar qizdirilganda asta yumshaydi',
            tenglama: 'Shisha, mum, smola, plastmassa → tartibsiz',
            qadamlar: [
              { belgi: '1. Tuzilish', natija: 'Tartibsiz', izoh: 'Kristall panjara yo\'q', rang: '#f472b6' },
              { belgi: '2. Qizdirish', natija: 'Yumshaydi', izoh: 'Harorat oralig\'ida oquvchan', rang: '#fbbf24' },
              { belgi: '3. Misollar', natija: 'Shisha, mum', izoh: 'Smola, ba\'zi plastmassalar', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'Kristall (NaCl)', foiz: 96, qiymat: 'Aniq 801°C', rang: '#38bdf8' },
              { nom: 'Amorf (Shisha)', foiz: 52, qiymat: 'Asta yumshaydi', rang: '#f472b6' },
            ],
            javobBadge: 'Amorf: aniq suyuqlanish harorati yo\'q',
          },
          pastki: [
            'Amorf: shisha, mum, smola, plastmassa',
            'Qizdirilganda birdan erimay, yumshab oqadi',
            'Sindirilsa chig\'anoqsimon sirt hosil bo\'ladi',
          ],
        },
        {
          id: 'taqqos',
          tugma: 'Qattiqlik taqqosi',
          formula: '4 panjara va amorf moddalar taqqosi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '74-75-bet: Panjara turi → modda qattiqligi',
            tenglama: 'Atomli (eng qattiq) > Ionli > Metall > Molekular',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Atomli', qiymat: 98, yorliq: 'Eng qattiq', rang: '#fde047' },
              { nom: 'Ionli', qiymat: 78, yorliq: 'Qattiq/mo\'rt', rang: '#34d399' },
              { nom: 'Metall', qiymat: 64, yorliq: 'Bolg\'alanar', rang: '#38bdf8' },
              { nom: 'Molekular', qiymat: 26, yorliq: 'Yumshoq', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Xossa panjara tugunidagi zarra turiga bog\'liq',
            'Atomli eng mustahkam, molekular eng kuchsiz',
            'Har ikki holat ham qattiq agregat holatga kiradi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: IONLI KRISTALL PANJARA (NaCl 13a-RASM, 74-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaIonliPanjara() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Ionli kristall panjara va NaCl tuzilishi (74-bet, 13a-rasm)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kub',
          tugma: 'NaCl kubik panjarasi',
          formula: 'Na⁺ atrofida 6 ta Cl⁻ • Ulkan kristall',
          tur: 'molekula',
          cfg: {
            sarlavha: '74-bet (13a-rasm): Na⁺ va Cl⁻ kubik ionli panjara',
            tenglama: '1 Na⁺ ni 6 Cl⁻ va 1 Cl⁻ ni 6 Na⁺ o\'rab turadi',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Koordinatsion son', qiymat: '6 ta qo\'shni', foiz: 85, rang: '#34d399' },
              { nom: 'Suyuqlanish (NaCl)', qiymat: '801°C (yuqori)', foiz: 88, rang: '#fbbf24' },
              { nom: 'Uchuvchanlik', qiymat: '0 (hidsiz)', foiz: 5, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Tugunda', v: 'Na⁺ va Cl⁻ ionlar', rang: '#34d399' },
              { k: 'Molekula', v: 'Alohida NaCl yo\'q', rang: '#f472b6' },
              { k: 'Tok', v: 'Eritmada o\'tkazadi', rang: '#fde047' },
            ],
          },
          pastki: [
            'Alohida NaCl molekulasi yo\'q — ulkan kristall',
            'Eritma va suyuqlanmasi elektr tokini o\'tkazadi',
            'Hidsiz (uchuvchan emas) va qiyin suyuqlanuvchan',
          ],
        },
        {
          id: 'xossa',
          tugma: 'Xossa va misollar',
          formula: 'NaCl, KNO₃, CuSO₄, NaOH, CaO',
          tur: 'hisob',
          cfg: {
            sarlavha: '74-bet: Ionli panjarali moddalarning 4 belgisi',
            tenglama: 'Kation (+) + Anion (-) elektrostatik tortishuvi',
            qadamlar: [
              { belgi: '1. Qattiq/mo\'rt', natija: 'Ion siljishi', izoh: 'Bir xil ionlar itarishib sinadi', rang: '#f472b6' },
              { belgi: '2. Yuqori T', natija: 'Kuchli bog\'', izoh: 'Qiyin suyuqlanuvchan va hidsiz', rang: '#fbbf24' },
              { belgi: '3. Misollar', natija: 'Tuz, ishqor', izoh: 'NaCl, KNO₃, CuSO₄, NaOH, CaO', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Qattiq holda tok', foiz: 6, qiymat: 'O\'tkazmaydi', rang: '#94a3b8' },
              { nom: 'Eritmada tok', foiz: 95, qiymat: 'Yaxshi o\'tkazadi', rang: '#34d399' },
            ],
            javobBadge: 'Tuzlar, ishqorlar va ionli oksidlar = ionli panjara',
          },
          pastki: [
            'Qattiq holda ionlar qo\'zg\'almas, eritmada erkin',
            'Bir xil ishorali ionlar to\'qnashsa kristall sinadi',
            'Misollar: NaCl, KNO₃, CuSO₄, NaOH, KOH',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: ATOMLI KRISTALL PANJARA (OLMOS VA GRAFIT, 74-75-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaAtomliPanjara() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Atomli kristall panjara: Olmos va Grafit (74-75-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'olmos',
          tugma: 'Olmos (tetraedr)',
          formula: 'Har bir C atomi 4 qo\'shni bilan kovalent bog\'da',
          tur: 'molekula',
          cfg: {
            sarlavha: '74-75-bet (13d-rasm): Olmos — eng qattiq modda',
            tenglama: 'C — 4 ta teng masofali C (tetraedr) • T > 3500°C',
            rejim: 'kristall',
            kristallTuri: 'atom',
            metrikalar: [
              { nom: 'Qattiqlik (Moos)', qiymat: '10 / 10 (maksimal)', foiz: 100, rang: '#38bdf8' },
              { nom: 'Bog\' mustahkamligi', qiymat: 'Kovalent C-C', foiz: 98, rang: '#fde047' },
              { nom: 'Suvda eruvchanlik', qiymat: '0 (erimaydi)', foiz: 4, rang: '#94a3b8' },
            ],
            belgilar: [
              { k: 'Tugunda', v: 'Neytral C atomlar', rang: '#38bdf8' },
              { k: 'Shisha kesish', v: 'O\'ta qattiq', rang: '#fde047' },
              { k: 'Tok', v: 'O\'tkazmaydi', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Ikkisi ham uglerod, lekin panjara fazoviy tuzilishi har xil',
            'Olmos shisha kesadigan tabiatdagi eng qattiq modda',
            'Atomli panjara uchuvchan emas va suvda erimaydi',
          ],
        },
        {
          id: 'grafit',
          tugma: 'Grafit (qatlamli)',
          formula: 'Oltiburchak qatlamlar • Yumshoq va tok o\'tkazadi',
          tur: 'molekula',
          cfg: {
            sarlavha: '74-75-bet (13b-rasm): Grafit — sirpanuvchi qatlamlar',
            tenglama: 'Qatlam ichida C-C kuchli, qatlamlararo bog\' kuchsiz',
            markaz: { belgi: 'C', rang: '#34d399', r: 22 },
            atomlar: [
              { belgi: 'C', burchak: 0, masofa: 82, bog: 2, rang: '#38bdf8', r: 16 },
              { belgi: 'C', burchak: 120, masofa: 82, bog: 1, rang: '#38bdf8', r: 16 },
              { belgi: 'C', burchak: 240, masofa: 82, bog: 1, rang: '#38bdf8', r: 16 },
            ],
            metrikalar: [
              { nom: 'Qatlam ichi bog\'', qiymat: 'Juda kuchli (3 σ)', foiz: 92, rang: '#34d399' },
              { nom: 'Qatlamlararo kuch', qiymat: 'Kuchsiz → sirpanadi', foiz: 22, rang: '#fbbf24' },
              { nom: 'Elektr o\'tkazish', qiymat: 'Yaxshi (erkin ē)', foiz: 80, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Tuzilish', v: 'Oltiburchak qatlam', rang: '#34d399' },
              { k: 'Qo\'llanishi', v: 'Qalam, elektrod', rang: '#fbbf24' },
              { k: 'Xossa', v: 'Yumshoq, kulrang', rang: '#38bdf8' },
            ],
          },
          pastki: [
            'Qatlamlar oson sirpanadi → qalamda iz qoldiradi',
            '4-valent elektron harakatchan → tok o\'tkazadi',
            'Misollar: olmos, grafit, Si, B, kvars (SiO₂)',
          ],
        },
        {
          id: 'si_b',
          tugma: 'Si, B va kvars (SiO₂)',
          formula: 'Kremniy, bor, kvars — atomli panjaralar',
          tur: 'hisob',
          cfg: {
            sarlavha: '75-bet: Ugleroddan tashqari atomli moddalar',
            tenglama: 'Si, B, SiO₂ (kvars) — yuqori T_suyuq, hidsiz',
            qadamlar: [
              { belgi: 'Si (Kremniy)', natija: '1414°C', izoh: 'Olmosga o\'xshash tetraedrik', rang: '#38bdf8' },
              { belgi: 'B (Bor)', natija: '2075°C', izoh: 'Juda qattiq va qiyin suyuqlanar', rang: '#a855f7' },
              { belgi: 'SiO₂ (Kvars)', natija: '1710°C', izoh: 'Suvda erimaydi, mustahkam', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Olmos C', foiz: 100, qiymat: '>3500°C', rang: '#38bdf8' },
              { nom: 'Bor B', foiz: 78, qiymat: '2075°C', rang: '#a855f7' },
              { nom: 'Kremniy Si', foiz: 60, qiymat: '1414°C', rang: '#34d399' },
            ],
            javobBadge: 'Tugunda atomlar → eng mustahkam panjara',
          },
          pastki: [
            'Atomli moddalar erimaydi va hidsiz bo\'ladi',
            'Kovalent bog\'ni uzish uchun katta energiya kerak',
            'Misollar: olmos, grafit, Si, B, kvars (SiO₂)',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: MOLEKULAR KRISTALL PANJARA (75-BET)
═══════════════════════════════════════════════════════════════ */
const MOLEKULAR_MODDALAR = [
  { id: 'CO2', nom: 'Quruq muz (CO₂)', rasm: 'CO₂', izoh: 'Sublimatsiya: CO₂ suyuqlanmasdan gazga aylanadi.' },
  { id: 'H2O', nom: 'Muz (H₂O)', rasm: 'H₂O', izoh: 'Qutbli suv molekulalari — 0°C da oson suyuqlanadi.' },
  { id: 'I2', nom: 'Yod (I₂)', rasm: 'I₂', izoh: 'Kuchsiz bog\' — qizdirganda tez binafsha bug\' beradi.' },
  { id: 'S8', nom: 'S₈ va P₄', rasm: 'S₈', izoh: 'Oq fosfor P₄, rombik S₈, shakar, HCl — molekular.' },
];

function KorgazmaMolekularPanjara() {
  const canvasRef = useRef(null);
  const [mid, setMid] = useState('CO2');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = MOLEKULAR_MODDALAR.find((m) => m.id === mid) || MOLEKULAR_MODDALAR[0];
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
      ctx.fillText(`75-bet: Molekular panjara — ${faol.nom}`, 24, 34, w - 48);

      const ox = w * 0.26;
      const oy = h * 0.48;
      ctx.strokeStyle = `rgba(148, 163, 184, ${(0.3 + 0.12 * Math.sin(t * 2)).toFixed(2)})`;
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.6;
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const x = ox + c * 68;
          const y = oy + r * 58;
          if (c < 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 68, y);
            ctx.stroke();
          }
          if (r < 1) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 58);
            ctx.stroke();
          }
        }
      }
      ctx.setLineDash([]);

      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const x = ox + c * 68 + Math.sin(t + r + c) * 3;
          const y = oy + r * 58 + Math.cos(t + r) * 3;
          chizZarracha(ctx, x - 9, y, 8, '#38bdf8', '');
          chizZarracha(ctx, x + 9, y, 8, '#f472b6', '');
          ctx.fillStyle = '#f8fafc';
          ctx.font = 'bold 10px "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.fillText(faol.rasm, x, y + 20);
        }
      }

      const rx = w * 0.52;
      const rw = w * 0.44;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, 66, rw, h - 100, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText('Molekular panjara (75-bet):', rx + 20, 102, rw - 40);

      const xossalar = [
        '• Tugunda: qutbsiz yoki qutbli molekulalar',
        '• Ichida: kuchli kovalent bog\'',
        '• Orasida: kuchsiz tortishish kuchi',
        '• Past T_suyuq/T_qayn, uchuvchan (hidli)',
        '• Qattiqligi past, tez sublimatsiyalanadi',
      ];
      xossalar.forEach((s, i) => {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(s, rx + 20, 138 + i * 28, rw - 40);
      });

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(faol.izoh, rx + 20, 290, rw - 40);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [mid]);

  return (
    <KorgazmaRamka
      sarlavha="4. Molekular kristall panjara va oson uchuvchan moddalar (75-bet)"
      qisqaFormula="H₂, N₂, O₂, Cl₂, P₄, S₈, I₂, muz (H₂O), quruq muz (CO₂), shakar, HCl, H₂S"
      ikon="tomchi"
      boshqaruv={
        <>
          {MOLEKULAR_MODDALAR.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMid(m.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold border transition ${
                mid === m.id
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
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Tugunda: molekulalar (kuchsiz bog&apos;langan)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Sublimatsiya misoli: Quruq muz (CO₂) va I₂
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Shakar qizdirilganda tez suyuqlanadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: METALL KRISTALL PANJARA ("ELEKTRON GAZI", 75-BET)
═══════════════════════════════════════════════════════════════ */
const METALL_TURLAR = [
  { id: 'Cu', nom: 'Mis (Cu)', belgi: 'Cu⁺', izoh: 'Erkin elektronlar oqimi tufayli tokni a\'lo o\'tkazadi.' },
  { id: 'Al', nom: 'Alyuminiy (Al)', belgi: 'Al³⁺', izoh: 'Al³⁺ ionlari orasida 3 tadan erkin elektron uchadi.' },
  { id: 'Na', nom: 'Natriy (Na)', belgi: 'Na⁺', izoh: 'Bog\'da 1 tadan elektron — pichoqda kesiladigan yumshoq.' },
];

function KorgazmaMetallPanjara() {
  const canvasRef = useRef(null);
  const [met, setMet] = useState('Cu');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = METALL_TURLAR.find((m) => m.id === met) || METALL_TURLAR[0];
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
      ctx.fillText(`75-bet: Metall panjara ("elektron gazi") — ${faol.nom}`, 24, 34, w - 48);

      const ox = w * 0.28;
      const oy = h * 0.48;
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const x = ox + c * 68;
          const y = oy + r * 56;
          chizZarracha(ctx, x, y, 16, '#fbbf24', faol.belgi);
        }
      }

      for (let i = 0; i < 12; i++) {
        const ex = ox - 95 + ((t * 50 + i * 38) % 190);
        const ey = oy - 75 + ((i * 31 + Math.sin(t * 2 + i) * 18) % 150);
        chizZarracha(ctx, ex, ey, 4.5, '#38bdf8', '');
      }

      const rx = w * 0.54;
      const rw = w * 0.42;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, 66, rw, h - 100, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText('Metall panjara (75-bet):', rx + 20, 102, rw - 40);

      const satrlar = [
        '• Tugunda: metall atomlari va (+) ionlari',
        '• Orasida: erkin ko\'chuvchi elektronlar',
        '• Bog\' turi: metall bog\'lanish',
        '• Xossa: yaltiroq, bolg\'alanar, tok o\'tkazadi',
        '• Misollar: Na, Ba, Zn, Al, Cu, Au',
      ];
      satrlar.forEach((s, i) => {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(s, rx + 20, 138 + i * 28, rw - 40);
      });

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(faol.izoh, rx + 20, 290, rw - 40);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [met]);

  return (
    <KorgazmaRamka
      sarlavha="5. Metall kristall panjara va erkin elektronlar harakati (75-bet)"
      qisqaFormula="Tugunlarda: metall atomi va Mⁿ⁺ ionlari • Erkin elektronlar → tok va bolg'alanuvchanlik"
      ikon="chaqmoq"
      boshqaruv={
        <>
          {METALL_TURLAR.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMet(m.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                met === m.id
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
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Metall yaltiroqligi — erkin elektronlar tufayli
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Bolg&apos;alanganda qatlamlar uzilmasdan siljiydi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Issiqlik va elektr tokini a&apos;lo o&apos;tkazadi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 4 TA KRISTALL PANJARA TURINI QIYOSLASH (74-76-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaTortPanjaraQiyoslash() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Barcha kristall panjaralar bo'yicha yakuniy solishtirma (74-76-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'ionli',
          tugma: 'Ionli panjara',
          formula: 'NaCl, KNO₃, CuSO₄, NaOH, CaO',
          tur: 'hisob',
          cfg: {
            sarlavha: '74-bet: Ionli panjara (+ va - ionlar)',
            tenglama: 'Qattiq, mo\'rt • Yuqori T_suyuq • Eritmada tok o\'tkazadi',
            qadamlar: [
              { belgi: '1. Tugun', natija: '+ va - ion', izoh: 'NaCl da 6 ta qo\'shni', rang: '#34d399' },
              { belgi: '2. Xossa', natija: 'Mo\'rt, hidsiz', izoh: 'Qiyin suyuqlanuvchan', rang: '#fbbf24' },
              { belgi: '3. Misol', natija: 'Tuz, ishqor', izoh: 'NaCl, KNO₃, NaOH, CaO', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'Qattiqlik', foiz: 78, qiymat: 'Yuqori', rang: '#34d399' },
              { nom: 'T_suyuq', foiz: 85, qiymat: 'Yuqori', rang: '#fbbf24' },
            ],
            javobBadge: 'Tuz va ishqorlar → ionli kristall panjara',
          },
          pastki: [
            'Tugunda + kation va - anion joylashadi',
            'Hidsiz, uchuvchan emas, eritmasi tok o\'tkazadi',
            'Misol: NaCl, KNO₃, CuSO₄, NaOH, CaO',
          ],
        },
        {
          id: 'atomli',
          tugma: 'Atomli panjara',
          formula: 'Olmos, grafit, Si, B, kvars (SiO₂)',
          tur: 'hisob',
          cfg: {
            sarlavha: '74-75-bet: Atomli panjara (kovalent bog\')',
            tenglama: 'Eng qattiq, eng yuqori T_suyuq, suvda erimaydi',
            qadamlar: [
              { belgi: '1. Tugun', natija: 'Neytral atom', izoh: 'Kovalent bog\'langan', rang: '#38bdf8' },
              { belgi: '2. Xossa', natija: 'Eng qattiq', izoh: 'Uchuvchan emas, erimaydi', rang: '#fde047' },
              { belgi: '3. Misol', natija: 'Olmos, Si, B', izoh: 'Grafit, kvars (SiO₂)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Qattiqlik', foiz: 100, qiymat: 'Maksimal', rang: '#fde047' },
              { nom: 'T_suyuq', foiz: 100, qiymat: '>1400-3500°C', rang: '#38bdf8' },
            ],
            javobBadge: 'Eng qattiq va qiyin suyuqlanuvchan: Atomli',
          },
          pastki: [
            'Eng qattiq va eng yuqori T_suyuq: Atomli',
            'Uchuvchan emas, oddiy erituvchilarda erimaydi',
            'Misol: olmos, grafit, Si, B, SiO₂',
          ],
        },
        {
          id: 'molekular',
          tugma: 'Molekular panjara',
          formula: 'H₂, N₂, O₂, I₂, P₄, S₈, shakar, muz, CO₂',
          tur: 'hisob',
          cfg: {
            sarlavha: '75-bet: Molekular panjara (kuchsiz kuchlar)',
            tenglama: 'Yumshoq • Past T_suyuq • Oson uchuvchan (sublimatsiya)',
            qadamlar: [
              { belgi: '1. Tugun', natija: 'Molekula', izoh: 'Qutbli yoki qutbsiz', rang: '#f472b6' },
              { belgi: '2. Xossa', natija: 'Uchuvchan', izoh: 'Past T_suyuq, hidli', rang: '#fbbf24' },
              { belgi: '3. Misol', natija: 'Muz, I₂, CO₂', izoh: 'P₄, S₈, shakar, HCl', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'Qattiqlik', foiz: 24, qiymat: 'Yumshoq', rang: '#f472b6' },
              { nom: 'Uchuvchanlik', foiz: 95, qiymat: 'Yuqori', rang: '#fbbf24' },
            ],
            javobBadge: 'Eng yumshoq va uchuvchan: Molekular',
          },
          pastki: [
            'Eng yumshoq va oson uchuvchan: Molekular',
            'Sublimatsiya misoli: Quruq muz (CO₂) va I₂',
            'Misol: muz, shakar, I₂, P₄, S₈, HCl',
          ],
        },
        {
          id: 'metall',
          tugma: 'Metall panjara',
          formula: 'Na, Ba, Zn, Al, Cu, Au',
          tur: 'hisob',
          cfg: {
            sarlavha: '75-bet: Metall panjara ("elektron gazi")',
            tenglama: 'Yaltiroq • Bolg\'alanar • Tok/issiqlik o\'tkazuvchan',
            qadamlar: [
              { belgi: '1. Tugun', natija: 'Atom va Mⁿ⁺', izoh: 'Orasida erkin elektronlar', rang: '#fbbf24' },
              { belgi: '2. Xossa', natija: 'Tok o\'tkazar', izoh: 'Yaltiroq, bolg\'alanuvchan', rang: '#38bdf8' },
              { belgi: '3. Misol', natija: 'Cu, Al, Na', izoh: 'Ba, Zn, Fe, Au', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Tok o\'tkazish', foiz: 98, qiymat: 'A\'lo', rang: '#fbbf24' },
              { nom: 'Bolg\'alanish', foiz: 90, qiymat: 'Yuqori', rang: '#38bdf8' },
            ],
            javobBadge: 'Modda xossasi kristall panjara turiga bog\'liq',
          },
          pastki: [
            'Metall yaltiroqligi — erkin elektronlar tufayli',
            'Bolg\'alanganda qatlamlar uzilmay siljiydi',
            'Misol: Na, Ba, Zn, Al, Cu, Au',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (16-§) VA O'YINLAR (17-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Ionli bog\'lanish qanday zarralar orasida yuzaga keladi?',
    variantlar: [
      { matn: 'Bir xil metalmas atomlari orasida', togri: false },
      { matn: 'Inert gaz atomlari orasida', togri: false },
      { matn: 'Qarama-qarshi zaryadli kation (+) va anion (-) orasida', togri: true },
      { matn: 'Neytral H₂ molekulalari orasida', togri: false },
    ],
    izoh: '16-§ (72-bet): Elektron o\'tib (+) kation va (-) anion tortishadi.',
  },
  {
    id: 't2',
    savol: '15-jadval (73-bet): Cl⁻, Ar⁰ va K⁺ da nima bir xil (2, 8, 8)?',
    variantlar: [
      { matn: 'Elektron qobiqlari va umumiy 18 ē soni', togri: true },
      { matn: 'Protonlar soni', togri: false },
      { matn: 'Ion zaryadi', togri: false },
      { matn: 'Kimyoviy faolligi', togri: false },
    ],
    izoh: 'Uchala zarra 18 ta elektronli, lekin yadrolari +17, +18, +19.',
  },
  {
    id: 't3',
    savol: '73-bet 3-mashq: Mg²⁺ (+12) va F⁻ (+9) qaysi inert gazga o\'xshaydi?',
    variantlar: [
      { matn: 'Geliy (He: 2)', togri: false },
      { matn: 'Argon (Ar: 2, 8, 8)', togri: false },
      { matn: 'Kripton (Kr: 36)', togri: false },
      { matn: 'Neon (Ne: 2, 8 = 10 ē)', togri: true },
    ],
    izoh: 'Mg²⁺ (12-2=10 ē) va F⁻ (9+1=10 ē) — ikkisi ham Ne tuzilishli.',
  },
  {
    id: 't4',
    savol: 'NaOH va KNO₃ tarkibida qaysi bog\'lanishlar birga uchraydi?',
    variantlar: [
      { matn: 'Faqat qutbsiz kovalent', togri: false },
      { matn: 'Ionli (ionlararo) va kovalent (OH⁻, NO₃⁻ ichida)', togri: true },
      { matn: 'Faqat metall bog\'lanish', togri: false },
      { matn: 'Faqat vodorod bog\'lanish', togri: false },
    ],
    izoh: '72-bet: Ishqor va kislorodli tuzlarda ionli va kovalent bog\' bor.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'ionli', nom: 'Ionli panjara', tavsif: 'Tugunda: + va - ionlar' },
    { id: 'atomli', nom: 'Atomli panjara', tavsif: 'Tugunda: kovalent atomlar' },
    { id: 'molekular', nom: 'Molekular panjara', tavsif: 'Tugunda: molekulalar' },
  ],
  topshiriqlar: [
    { nom: 'Osh tuzi (NaCl) va KNO₃', qisqa: '6 ta qo\'shni ion', guruh: 'ionli', izoh: '74-bet: Na⁺ va Cl⁻ kubik ionli panjara tuzadi.' },
    { nom: 'Mis kuporosi (CuSO₄) va NaOH', qisqa: 'Tuz va ishqor', guruh: 'ionli', izoh: 'Ionli panjara — qattiq, uchuvchan emas.' },
    { nom: 'Kalsiy oksid (CaO) va KOH', qisqa: 'Ionli oksid/asos', guruh: 'ionli', izoh: 'Tugunlarida (+) va (-) ionlar navbatlashadi.' },
    { nom: 'Olmos va Grafit (C)', qisqa: 'C-C kovalent', guruh: 'atomli', izoh: '74-75-bet: Olmos tetraedr, grafit qatlamli.' },
    { nom: 'Kremniy (Si) va Bor (B)', qisqa: 'Qiyin suyuqlanar', guruh: 'atomli', izoh: '75-bet: Atomlar mustahkam kovalent bog\'da.' },
    { nom: 'Kvars (SiO₂)', qisqa: 'Qattiq, erimaydi', guruh: 'atomli', izoh: 'Atomli kristall panjarali modda.' },
    { nom: 'Muz (H₂O) va Quruq muz (CO₂)', qisqa: 'Sublimatsiya', guruh: 'molekular', izoh: '75-bet: Molekulalararo kuch kuchsiz.' },
    { nom: 'Yod (I₂), P₄ va S₈', qisqa: 'Oson uchuvchan', guruh: 'molekular', izoh: 'I₂ qizdirilganda tez sublimatsiyalanadi.' },
    { nom: 'Shakar, HCl, H₂S, N₂', qisqa: 'Molekulalardan', guruh: 'molekular', izoh: 'Yumshoq va past haroratda suyuqlanadi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '13a-rasm (NaCl)',
    savol: 'NaCl panjarasida har bir Na⁺ nechta Cl⁻ bilan o\'ralgan (74-bet)?',
    variantlar: ['2 ta Cl⁻ bilan', '4 ta Cl⁻ bilan', '6 ta Cl⁻ ioni bilan (kub)', '1 ta Cl⁻ bilan'],
    togri: 2,
    izoh: '74-bet: Har bir Na⁺ ni 6 ta Cl⁻ va Cl⁻ ni 6 ta Na⁺ o\'raydi.',
  },
  {
    belgi: 'Atomli panjara',
    savol: 'Qaysi qator BARCHA atomli kristall panjarali moddalardan iborat?',
    variantlar: ['Olmos, grafit, kremniy (Si), bor (B)', 'Osh tuzi, shakar, muz', 'Yod, oltingugurt, quruq muz', 'Natriy, mis, alyuminiy'],
    togri: 0,
    izoh: '75-bet: Olmos, grafit, Si, B atomli panjarali.',
  },
  {
    belgi: 'Molekular panjara',
    savol: 'Yod (I₂), muz va shakar nega past haroratda suyuqlanadi/uchadi?',
    variantlar: ['Ion bog\'i kuchli', 'Erkin elektron ko\'p', 'Yadrosi yengil', 'Molekulalararo tortishish kuchi kuchsiz'],
    togri: 3,
    izoh: '75-bet: Tugunlardagi molekulalar kuchsiz bog\'langan.',
  },
  {
    belgi: 'Metall panjara',
    savol: 'Metall panjara tugunida nima turadi va ularni nima tutadi?',
    variantlar: ['Neytral molekulalar', 'Atomlar va (+) ionlar + erkin elektronlar', 'Manfiy anionlar', 'Kovalent uglerod'],
    togri: 1,
    izoh: '75-bet: Musbat ionlar va erkin elektronlar metall bog\' hosil qiladi.',
  },
  {
    belgi: 'Amorf modda',
    savol: 'Amorf moddalar (shisha, mum, smola) kristalldan nimasi bilan farqli?',
    variantlar: ['Qat\'iy kubik shakl', 'Zarralar tartibsiz, aniq T_suyuq yo\'q (yumshaydi)', 'Elektron gazi bor', 'Har doim suvda eriydi'],
    togri: 1,
    izoh: '74-bet: Amorf moddada uzoq tartib yo\'q, asta yumshaydi.',
  },
  {
    belgi: 'Olmos tuzilishi',
    savol: 'Olmosda har bir C atomi nechta qo\'shni C bilan bog\'langan (13d-rasm)?',
    variantlar: ['2 ta', '6 ta', '8 ta', '4 ta (tetraedr)'],
    togri: 3,
    izoh: '74-75-bet: Har bir C atomi 4 ta qo\'shni C bilan bog\'da.',
  },
  {
    belgi: 'Quruq muz',
    savol: 'Qattiq karbonat angidrid (quruq muz CO₂) qaysi panjaraga kiradi?',
    variantlar: ['Molekular kristall panjara', 'Ionli panjara', 'Atomli panjara', 'Metall panjara'],
    togri: 0,
    izoh: '75-bet: Quruq muz CO₂, H₂O, I₂ molekular panjarali.',
  },
  {
    belgi: 'Yumshoq grafit',
    savol: 'Grafit nega yumshoq va elektr tokini o\'tkazadi (74-75-bet)?',
    variantlar: ['Ion bog\'li', 'Amorf tuzilishli', 'Qatlamlararo kuchsiz bog\' va harakatchan elektron', 'Tarkibida metall bor'],
    togri: 2,
    izoh: '13b-rasm: Oltiburchak qatlamlar oson sirpanadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'T_suyuq o\'sishi',
    vazifa: 'Moddalarni suyuqlanish harorati ortishi tartibida joylang:',
    tartib: ['Muz H₂O (0°C, molekular)', 'Natriy Na (yumshoq metall)', 'Osh tuzi NaCl (yuqori, ionli)', 'Olmos C (eng yuqori, atomli)'],
    variantlar: ['Osh tuzi NaCl (yuqori, ionli)', 'Muz H₂O (0°C, molekular)', 'Olmos C (eng yuqori, atomli)', 'Natriy Na (yumshoq metall)'],
  },
  {
    tur: '4 panjara misoli',
    vazifa: '4 ta kristall panjarani mos misollar bilan tartiblang:',
    tartib: ['1. Ionli: NaCl, KNO₃, NaOH', '2. Atomli: Olmos, Si, B', '3. Molekular: I₂, P₄, S₈, CO₂', '4. Metall: Na, Al, Cu, Au'],
    variantlar: ['3. Molekular: I₂, P₄, S₈, CO₂', '1. Ionli: NaCl, KNO₃, NaOH', '4. Metall: Na, Al, Cu, Au', '2. Atomli: Olmos, Si, B'],
  },
  {
    tur: '74-bet mantiq zanjiri',
    vazifa: 'Bog\'lanishdan modda xossasigacha bo\'lgan mantiq zanjirini tuzing:',
    tartib: ['Kimyoviy bog\'lanish turi', 'Tugundagi zarracha turi', 'Zarralararo tortishish kuchi', 'Fizik xossalar (T_suyuq, qattiqlik)'],
    variantlar: ['Zarralararo tortishish kuchi', 'Kimyoviy bog\'lanish turi', 'Fizik xossalar (T_suyuq, qattiqlik)', 'Tugundagi zarracha turi'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Qaysi panjarali moddalar eng qattiq va eng yuqori T_suyuq ga ega?',
    variantlar: ['Molekular (muz, shakar)', 'Atomli (olmos, kremniy, bor)', 'Amorf moddalar (smola)', 'Suyuq metallar'],
    togri: 1,
    izoh: '74-75-bet: Atomli panjarada mustahkam kovalent bog\' bor.',
  },
  {
    savol: '75-bet: Erkin elektronlar va (+) ionlardan iborat bog\' qaysi panjarada?',
    variantlar: ['Molekular panjara', 'Atomli panjara', 'Amorf shisha', 'Metall panjara (Na, Cu, Al, Au)'],
    togri: 3,
    izoh: 'Metall bog\'lanish yaltiroqlik va tok o\'tkazish beradi.',
  },
  {
    savol: 'Osh tuzi (NaCl), KNO₃ va NaOH qaysi panjara turiga kiradi?',
    variantlar: ['Ionli kristall panjara', 'Atomli', 'Molekular', 'Metall'],
    togri: 0,
    izoh: '74-bet: Tuzlar va ishqorlar ionli kristall panjarali.',
  },
  {
    savol: '75-bet: Oq fosfor (P₄), oltingugurt (S₈) va yod (I₂) qaysi panjarada?',
    variantlar: ['Atomli', 'Ionli', 'Molekular kristall panjara', 'Metall'],
    togri: 2,
    izoh: 'Tugunlarida alohida molekulalar joylashgan.',
  },
  {
    savol: 'Modda past T_suyuq ga ega, uchuvchan va hidli bo\'lsa u qaysi panjara?',
    variantlar: ['Atomli panjara', 'Ionli panjara', 'Molekular kristall panjara', 'Olmos panjara'],
    togri: 2,
    izoh: '75-bet: Molekular panjarali moddalar yumshoq va uchuvchan.',
  },
  {
    savol: '74-bet: Amorf moddalarga kiradigan qatorni toping:',
    variantlar: ['Shisha, mum, smola, plastmassalar', 'Olmos, tuz, muz', 'Mis, temir, rux', 'Yod, oltingugurt, kvars'],
    togri: 0,
    izoh: '74-bet: Amorf moddada zarralar tartibsiz joylashgan.',
  },
  {
    savol: 'Tugunlarida qarama-qarshi zaryadli ionlar turgan modda qanday?',
    variantlar: ['Oson uchuvchan, yumshoq', 'Qattiq, mo\'rt, qiyin suyuqlanar, hidsiz', 'Gazsimon holatda', 'Qattiq holda tokni a\'lo o\'tkazar'],
    togri: 1,
    izoh: '74-bet: Ionli moddalar yuqori T_suyuq li va hidsiz.',
  },
  {
    savol: 'Olmos juda qattiq, grafit esa nega yumshoq (74-75-bet)?',
    variantlar: ['C atom massasi har xil', 'Grafit ion bog\'li', 'Olmos molekular', 'Kristall panjara fazoviy tuzilishi turlicha'],
    togri: 3,
    izoh: '75-bet: Panjara tuzilishi modda fizik xossasini belgilaydi.',
  },
];

export default function S8Mavzu17() {
  const korgazmalar = [
    { nom: '1. Kristall va Amorf', ikon: 'kristall', komponent: <KorgazmaAmorfVaKristall /> },
    { nom: '2. Ionli panjara (NaCl)', ikon: 'uchqun', komponent: <KorgazmaIonliPanjara /> },
    { nom: '3. Atomli (Olmos/Grafit)', ikon: 'atom', komponent: <KorgazmaAtomliPanjara /> },
    { nom: '4. Molekular panjara', ikon: 'tomchi', komponent: <KorgazmaMolekularPanjara /> },
    { nom: '5. Metall panjara', ikon: 'chaqmoq', komponent: <KorgazmaMetallPanjara /> },
    { nom: '6. 4 panjara taqqoslovi', ikon: 'grafik', komponent: <KorgazmaTortPanjaraQiyoslash /> },
  ];

  const oyinlar = [
    {
      nom: '1. Panjaralarni ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-17"
          nom="Moddalarni ionli, atomli va molekular kristall panjaralarga ajratish"
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
          key="tezkor-17"
          nom="17-§: Kristall panjaralar viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Xossa va misol zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-17"
          nom="Suyuqlanish harorati va kristall panjara zanjiri"
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
          key="duel-17"
          sarlavha="17-§: Kristall panjaralar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="17-§"
      mavzuNom="Kristall panjaralar"
      oldingiRaqam="16-§"
      oldingiNom="Ionli bog'lanish"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
