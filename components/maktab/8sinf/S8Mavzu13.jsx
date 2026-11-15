'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 13-PARAGRAF
// "Elementlarning davriy sistemadagi o'rni va atom tuzilishiga qarab tavsiflash.
// Davriy qonunning ahamiyati" (Darslik 53-62-betlar)
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
   1-KO'RGAZMA: STRONSIY (+38 Sr) NI REJA BO'YICHA TAVSIFLASH (53-54-BET)
═══════════════════════════════════════════════════════════════ */
const SR_BOSQICHLAR = [
  {
    id: 1,
    nom: '1. Davriy sistemadagi o\'rni',
    sarlavha: '+38 Sr: 5-davr, juft qator, II guruh bosh (A) guruhchasi',
    rang: '#38bdf8',
    malumot: [
      'Tartib raqami: Z = 38',
      'Davr: 5-davr (5 ta energetik qavat), juft qator',
      'Guruh: II guruh bosh guruhcha (IIA, ishqoriy-yer metallar)',
      'Qo\'shnilari: chapda +37 Rb, o\'ngda +39 Y, tepada +20 Ca, pastda +56 Ba',
    ],
    izoh: 'Jadval o\'rni qavat va tashqi elektron sonini bildiradi.',
  },
  {
    id: 2,
    nom: '2. Xossalari va birikmalari',
    sarlavha: 'Metalllik xossasi va yuqori oksidi (SrO)',
    rang: '#fbbf24',
    malumot: [
      'Metall: Rb dan sustroq, Ca dan kuchliroq metall',
      'Kuchsizroq: +56 Ba dan metallik xossasi sustroq',
      'Oksidi: SrO (II valentli asosli oksid)',
      'Gidroksidi: Sr(OH)₂ — kuchli ishqor',
    ],
    izoh: 'IIA da pastga metallik ortadi: Be < Mg < Ca < Sr < Ba.',
  },
  {
    id: 3,
    nom: '3. Atom yadrosi tarkibi',
    sarlavha: 'Sr-88 izotopida proton va neytronlar soni',
    rang: '#f472b6',
    malumot: [
      'Nisbiy atom massasi: Ar(Sr) ≈ 88',
      'Protonlar soni: p⁺ = Z = 38 ta',
      'Neytronlar soni: n⁰ = A - Z = 88 - 38 = 50 ta',
      'Elektronlar soni: e⁻ = 38 ta (neytral atom)',
    ],
    izoh: 'Yadro zaryadi +38: element tabiatini 38 p⁺ belgilaydi.',
  },
  {
    id: 4,
    nom: '4. Qavatlar bo\'yicha taqsimot',
    sarlavha: '5 ta energetik qavat: 2, 8, 18, 8, 2',
    rang: '#34d399',
    malumot: [
      '1-qavat (K): 2 ē   |   2-qavat (L): 8 ē',
      '3-qavat (M): 18 ē  |   4-qavat (N): 8 ē',
      '5-qavat (O, tashqi): 2 ē (s-element)',
      'Jami: 2 + 8 + 18 + 8 + 2 = 38 elektron',
    ],
    izoh: 'Stronsiy IIA s-elementi: oxirgi 2 ē 5s-orbitalda.',
  },
  {
    id: 5,
    nom: '5. Elektron formulasi',
    sarlavha: 'To\'liq va qisqa elektron formula ([Kr] 5s²)',
    rang: '#a855f7',
    malumot: [
      'To\'liq: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶ 4d⁰ 5s²',
      'Qisqa formula: [Kr] 5s² (Kr = 36 ē)',
      'Tashqi 5s² elektronlarni berib Sr²⁺ ga aylanadi',
      'Oksidlanish darajasi birikmalarda doimiy +2',
    ],
    izoh: '4d-orbital Stronsiyda bo\'sh (4d⁰), +39 Y da to\'ladi.',
  },
];

function KorgazmaStronsiyTavsif() {
  const canvasRef = useRef(null);
  const [bosqichId, setBosqichId] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = SR_BOSQICHLAR.find((b) => b.id === bosqichId) || SR_BOSQICHLAR[0];
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.025;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Elementni reja bo'yicha tavsiflash: Stronsiy (+38 Sr) — ${faol.nom}`, 24, 34);

      // Chapda Sr ning 5 ta energetik qavati
      const cx = w * 0.25;
      const cy = h * 0.56;
      const qavatlar = [2, 8, 18, 8, 2];
      const nomlar = ['K', 'L', 'M', 'N', 'O'];

      qavatlar.forEach((cnt, idx) => {
        const rad = 28 + idx * 21;
        const ajrat = (bosqichId === 4 || bosqichId === 5) && idx === 4;
        ctx.strokeStyle = ajrat ? '#fde047' : 'rgba(56, 189, 248, 0.42)';
        ctx.lineWidth = ajrat ? 2.6 : 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        const korsat = Math.min(cnt, 14);
        for (let i = 0; i < korsat; i++) {
          const ang = t * (0.85 - idx * 0.1) + (i * Math.PI * 2) / korsat;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, idx === 4 ? 5 : 3.2, idx === 4 ? '#fde047' : '#38bdf8', '');
        }

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 11px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${nomlar[idx]}=${cnt}`, cx, cy - rad - 4);
      });
      chizZarracha(ctx, cx, cy, bosqichId === 3 ? 21 : 17, '#ef4444', '+38');

      // O'ngda reja kartasi
      const rx = w * 0.50;
      const rw = w * 0.46;
      const ry = 66;
      const rh = h - 98;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = faol.rang;
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(faol.sarlavha, rx + 20, ry + 34);

      faol.malumot.forEach((satr, i) => {
        const yy = ry + 72 + i * 38;
        ctx.fillStyle = 'rgba(30, 58, 138, 0.35)';
        ctx.beginPath();
        ctx.roundRect(rx + 18, yy - 22, rw - 36, 30, 8);
        ctx.fill();
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(satr, rx + 28, yy - 2);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(`Xulosa: ${faol.izoh}`, rx + 20, ry + 236, rw - 40);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [bosqichId]);

  return (
    <KorgazmaRamka
      sarlavha="1. +38 Sr ni 5 bosqichda tavsiflash (53–54-b)"
      qisqaFormula="+38 Sr: 5-davr, IIA • 38p⁺, 50n⁰, 38e⁻ • 2, 8, 18, 8, 2 • [Kr] 5s²"
      ikon="yadro"
      boshqaruv={
        <>
          {SR_BOSQICHLAR.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setBosqichId(b.id);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
                bosqichId === b.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {b.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Qo&apos;shni elementlar: Rb &lt; Sr &lt; Ba (metallik)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Oksidi: SrO (II valentli asosli oksid)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Neytronlar: 88 - 38 = 50 n⁰
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: DAVR VA GURUH BO'YICHA ATOM RADIUVSI VA XOSSALAR (54-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaRadiusVaXossa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Davr va guruhda atom radiusi (54-b)"
      ikon="grafik"
      variantlar={[
        {
          id: 'davr',
          tugma: 'Davrda (Li → F)',
          formula: 'Davrda: qavat = 2 • Z ortadi • r ↓ • EM ↑ • metallmas ↑',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '2-davrda chapdan o\'ngga (Li → F): radius ↓',
            tenglama: 'Li (0,155 nm) → F (0,064 nm) • Qavat = 2 (doimiy)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Li (+3)', qiymat: 100, yorliq: '0,155 nm', rang: '#f472b6' },
              { nom: 'Be (+4)', qiymat: 85, yorliq: '1→2 ē', rang: '#fb923c' },
              { nom: 'B (+5)', qiymat: 74, yorliq: '3 ē', rang: '#fbbf24' },
              { nom: 'C (+6)', qiymat: 65, yorliq: '4 ē', rang: '#38bdf8' },
              { nom: 'N (+7)', qiymat: 57, yorliq: '5 ē', rang: '#38bdf8' },
              { nom: 'O (+8)', qiymat: 50, yorliq: '6 ē', rang: '#34d399' },
              { nom: 'F (+9)', qiymat: 41, yorliq: '0,064 nm', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Li (0,155 nm) → F (0,064 nm)',
            'Tashqi ē: 1 → 8; valentlik 1→7/8',
            'Vodorodli valentlik: 4 → 1',
          ],
        },
        {
          id: 'guruh',
          tugma: 'Guruhda (Li → Cs)',
          formula: 'Guruhda (↓): qavat 2 → 6 • r ↑ • EM ↓ • metallik ↑',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'IA guruhda yuqoridan pastga (Li → Cs): radius ↑',
            tenglama: 'Tashqi = 1 ē • Qavat: Li(2) → Cs(6) • Tortilish ↓',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Li (+3)', qiymat: 35, yorliq: '2 qavat', rang: '#38bdf8' },
              { nom: 'Na (+11)', qiymat: 52, yorliq: '3 qavat', rang: '#34d399' },
              { nom: 'K (+19)', qiymat: 68, yorliq: '4 qavat', rang: '#fbbf24' },
              { nom: 'Rb (+37)', qiymat: 84, yorliq: '5 qavat', rang: '#fb923c' },
              { nom: 'Cs (+55)', qiymat: 100, yorliq: '6 qavat', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Qavatlar soni: 2 → 6 ortadi',
            'Tashqi 1 ē tortilishi susayadi',
            'Cs — eng kuchli metallardan biri',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: DAVRIY QONUN BASHORATI VA 12-JADVAL (55-57-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaBashoratJadval12() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Davriy qonun bashorati (55–57-b, 12-jadval)"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'Ge',
          tugma: 'Ekasilitsiy → Ge',
          formula: 'Mendeleyev (1871) vs K. Vinkler (1886): ~100% moslik',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ekasilitsiy (Es) → Germaniy (Ge, Z=32)',
            tenglama: '12-jadval: Ar 72 vs 72,6 • ρ 5,5 vs 5,32 g/cm³',
            qadamlar: [
              { belgi: 'Ar(Es/Ge)', natija: '72 vs 72,6', izoh: 'Nisbiy atom massa deyarli aniq', rang: '#fbbf24' },
              { belgi: 'ρ (modda)', natija: '5,5 vs 5,32', izoh: 'Zichlik g/cm³ (Vinkler, 1886)', rang: '#38bdf8' },
              { belgi: 'EO₂ / ECl₄', natija: '4,7 vs 4,703', izoh: 'Oksid ρ; ECl₄ qaynash 90 vs 86 °C', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Bashorat Ar', foiz: 99, qiymat: '72', rang: '#fbbf24' },
              { nom: 'Tajriba Ar', foiz: 100, qiymat: '72,6', rang: '#34d399' },
            ],
            javobBadge: 'ECl₄ ρ: 1,9 vs 1,887 g/cm³',
          },
          pastki: [
            'Ge: Ar 72 vs 72,6; ρ 5,5 vs 5,32',
            'ECl₄ t_qaynash: 90 vs 86 °C',
            'Qazilma & yarimo\'tkazgich izlash',
          ],
        },
        {
          id: 'Ga',
          tugma: 'Ekaalyuminiy → Ga',
          formula: 'Lekok de Buabodran (1875) • Z=31, IIIA (E₂O₃)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ekaalyuminiy (El) → Galliy (Ga, Z=31)',
            tenglama: '1875-yil: birinchi kashf etilgan bashorat element',
            qadamlar: [
              { belgi: 'O\'rni', natija: 'Z = 31 (IIIA)', izoh: 'Valentligi 3, oksidi E₂O₃', rang: '#38bdf8' },
              { belgi: 'Kashf', natija: '1875-yil', izoh: 'Lekok de Buabodran topgan', rang: '#fbbf24' },
              { belgi: 'Tuzatish', natija: 'ρ tuzatildi', izoh: 'Mendeleyev tajriba xatosini tuzatgan', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Bashorat val.', foiz: 100, qiymat: 'III (E₂O₃)', rang: '#fbbf24' },
              { nom: 'Tajriba Ga', foiz: 100, qiymat: 'III (Ga₂O₃)', rang: '#34d399' },
            ],
            javobBadge: 'Galliy (+31 Ga, 1875)',
          },
          pastki: [
            'Birinchi topilgan bashorat element',
            'IIIA guruh, oksidi Ga₂O₃',
            'Davriy qonun tajribani ham tuzatdi',
          ],
        },
        {
          id: 'Sc',
          tugma: 'Ekabor → Sc',
          formula: 'L. Nilson (1879) • Z=21, IIIB (Sc₂O₃)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ekabor (Eb) → Skandiy (Sc, Z=21)',
            tenglama: '1879-yil Shvetsiyada kashf etildi • IIIB guruh',
            qadamlar: [
              { belgi: 'O\'rni', natija: 'Z = 21 (IIIB)', izoh: '4-davr boshida d-element', rang: '#38bdf8' },
              { belgi: 'Oksidi', natija: 'Sc₂O₃ (III)', izoh: 'Bashorat bilan bir xil valentlik', rang: '#34d399' },
              { belgi: 'Nomi', natija: 'Skandinaviya', izoh: 'L. Nilson 1879-yilda nomladi', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Bashorat Z', foiz: 100, qiymat: '21', rang: '#fbbf24' },
              { nom: 'Oksid formula', foiz: 100, qiymat: 'Sc₂O₃', rang: '#34d399' },
            ],
            javobBadge: 'Skandiy (+21 Sc, 1879)',
          },
          pastki: [
            'Ekabor → Skandiy (Sc, 1879)',
            'L. Nilson kashfiyoti',
            'IIIB guruh, Sc₂O₃ oksid',
          ],
        },
        {
          id: 'Re',
          tugma: 'Dvimarganes → Re',
          formula: 'I. va V. Noddaklar (1925) • Z=75, VIIB (Re₂O₇)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Dvimarganes → Reniy (Re, Z=75)',
            tenglama: '1925-yil: Noddaklar davriy jadval asosida izlab topgan',
            qadamlar: [
              { belgi: 'O\'rni', natija: 'Z = 75 (VIIB)', izoh: 'Marganesning quyi analogi', rang: '#38bdf8' },
              { belgi: 'Oksidi', natija: 'Re₂O₇ (VII)', izoh: 'Maksimal valentligi VII', rang: '#34d399' },
              { belgi: 'Kashf', natija: '1925-yil', izoh: 'I. va V. Noddaklar topgan', rang: '#a855f7' },
            ],
            taqqosBars: [
              { nom: 'Guruh/Val.', foiz: 100, qiymat: 'VIIB (Re₂O₇)', rang: '#fbbf24' },
              { nom: 'Tartib Z', foiz: 100, qiymat: '75', rang: '#a855f7' },
            ],
            javobBadge: 'Reniy (+75 Re, 1925)',
          },
          pastki: [
            'Reniy (Re): Noddaklar, 1925',
            'VIIB guruh, Re₂O₇ oksid',
            'Atom energetikasi va izotoplar asosi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: MISHYAK (+33 As) VA SELEN (+34 Se) TAVSIFI (57-58-BET)
═══════════════════════════════════════════════════════════════ */
const AS_SE_PROFIL = {
  As: {
    nom: 'Mishyak (+33 As)',
    a: 75,
    z: 33,
    n: 42,
    davr: '4-davr, toq qator, VA bosh guruhcha (p-element)',
    qavat: '2, 8, 18, 5',
    formula: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p³  ([Ar] 3d¹⁰ 4s² 4p³)',
    birikma: 'AsH₃ (arsin, III valentli) • As₂O₅ (V valentli kislotali oksid)',
    xossa: 'Yaltiroq va o\'tkazuvchan, ammo mo\'rt; metallik Ga>As>Se.',
    rang: '#f472b6',
  },
  Se: {
    nom: 'Selen (+34 Se) — 58-bet 1-savol',
    a: 79,
    z: 34,
    n: 45,
    davr: '4-davr, toq qator, VIA bosh guruhcha (p-element)',
    qavat: '2, 8, 18, 6',
    formula: '1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁴  ([Ar] 3d¹⁰ 4s² 4p⁴)',
    birikma: 'H₂Se (II valentli) • SeO₃ (VI valentli kislotali oksid, H₂SeO₄)',
    xossa: 'Metalmasligi As dan kuchli; S va Te ning elektron analogi.',
    rang: '#34d399',
  },
};

function KorgazmaMishyakTavsif() {
  const canvasRef = useRef(null);
  const [belgi, setBelgi] = useState('As');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = AS_SE_PROFIL[belgi];
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.025;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`57-58-bet: ${faol.nom} — atom tuzilishi va xossalari`, 24, 34);

      const cx = w * 0.24;
      const cy = h * 0.54;
      const tashqi = belgi === 'As' ? 5 : 6;
      [2, 8, 18, tashqi].forEach((cnt, idx) => {
        const rad = 32 + idx * 24;
        ctx.strokeStyle = idx === 3 ? faol.rang : 'rgba(56, 189, 248, 0.42)';
        ctx.lineWidth = idx === 3 ? 2.5 : 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        const dots = Math.min(cnt, 14);
        for (let i = 0; i < dots; i++) {
          const ang = t * (0.9 - idx * 0.14) + (i * Math.PI * 2) / dots;
          chizZarracha(ctx, cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, idx === 3 ? 4.8 : 3.2, idx === 3 ? faol.rang : '#38bdf8', '');
        }
      });
      chizZarracha(ctx, cx, cy, 18, '#ef4444', `+${faol.z}`);

      const rx = w * 0.49;
      const rw = w * 0.47;
      const ry = 66;
      const rh = h - 98;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = faol.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, rw, rh, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = faol.rang;
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText(`${faol.davr}`, rx + 20, ry + 34);

      const satrlar = [
        `Yadro tarkibi: A = ${faol.a}, p⁺ = ${faol.z}, n⁰ = ${faol.n} (${faol.a} - ${faol.z})`,
        `Qavatlar: ${faol.qavat} (tashqi qavatda ${tashqi} ē)`,
        `Formula: ${faol.formula}`,
        `Birikmalari: ${faol.birikma}`,
      ];
      satrlar.forEach((s, idx) => {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(s, rx + 20, ry + 72 + idx * 34);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.fillText(faol.xossa, rx + 20, ry + 216, rw - 40);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [belgi]);

  return (
    <KorgazmaRamka
      sarlavha="4. p-elementlar: +33 As va +34 Se (57–58-b)"
      qisqaFormula="+33 As (VA, 75-33=42n, AsH₃/As₂O₅) • +34 Se (VIA, 79-34=45n, H₂Se/SeO₃)"
      ikon="atom"
      boshqaruv={
        <>
          <button
            type="button"
            onClick={() => {
              setBelgi('As');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              belgi === 'As'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Mishyak (+33 As)
          </button>
          <button
            type="button"
            onClick={() => {
              setBelgi('Se');
              tovushChiqar('bosish');
            }}
            className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
              belgi === 'Se'
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
            }`}
          >
            Selen (+34 Se, 1-savol)
          </button>
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            +33 As: Ga &gt; Ge &gt; As &gt; Se (metallik)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            58-bet 1-savol: Z=34 → Selen (Se)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Neytronlar: As (42), Se (45)
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: DARSLIKDAGI 1-5-MISOLLARNI YECHISH (58-59-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaMasalaYechgich() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 58–60-bet 1–5-masalalar yechimi"
      ikon="formula"
      variantlar={[
        {
          id: '1',
          tugma: '1-misol (Z=23 V)',
          formula: 'Z=23: ...3d³ 4s² → Vanadiy (V), d-element',
          tur: 'hisob',
          cfg: {
            sarlavha: '1-misol: Z = 23 element konfiguratsiyasi va oilasi',
            tenglama: '1s² 2s² 2p⁶ 3s² 3p⁶ 3d³ 4s² ([Ar] 3d³ 4s²)',
            qadamlar: [
              { belgi: '1–3 qavat', natija: '18 ē (1s²..3p⁶)', izoh: 'Dastlab 18 elektron joylashadi', rang: '#38bdf8' },
              { belgi: '4s va 3d', natija: '4s² + 3d³', izoh: '19–20 → 4s²; 21–23 → 3d³', rang: '#fbbf24' },
              { belgi: 'Oila', natija: 'Vanadiy (V)', izoh: 'Oxirgi ē 3d da → d-element', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'K+L+M', foiz: 78, qiymat: '18 ē', rang: '#38bdf8' },
              { nom: '3d³ + 4s²', foiz: 22, qiymat: '5 ē', rang: '#fbbf24' },
            ],
            javobBadge: 'Z=23: [Ar] 3d³ 4s² (d)',
          },
          pastki: [
            'Z=23 Vanadiy: ...3d³ 4s²',
            '4-davr, VB guruhcha',
            'Jami qavatlar: 2, 8, 11, 2',
          ],
        },
        {
          id: '2',
          tugma: '2-misol (EO₃/H₂E)',
          formula: 'EO₃ (VI) → H₂E (5,88% H) → Ar(E) = 32 (Oltingugurt S)',
          tur: 'hisob',
          cfg: {
            sarlavha: '2-misol: EO₃ va H₂E da 5,88% H — elementni topish',
            tenglama: '94,12% E / 5,88% H = 16 → 2·16 = 32 (S)',
            qadamlar: [
              { belgi: 'Formulalar', natija: 'EO₃ → H₂E', izoh: 'E VI valentli → vodorodli H₂E', rang: '#38bdf8' },
              { belgi: 'Nisbat', natija: '94,12 / 5,88 = 16', izoh: 'E va H massalari nisbati 16:1', rang: '#fbbf24' },
              { belgi: 'Hisob', natija: 'Ar = 16·2 = 32', izoh: 'Oltingugurt (S): SO₃, H₂S', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'E ulushi', foiz: 94, qiymat: '94,12%', rang: '#fbbf24' },
              { nom: 'H ulushi', foiz: 6, qiymat: '5,88%', rang: '#38bdf8' },
            ],
            javobBadge: 'Javob: Oltingugurt (S, Ar=32)',
          },
          pastki: [
            'H₂E da H valentligi I, E II',
            'SO₃ — kislotali oksid',
            'H₂S — uchuvchan H-birikma',
          ],
        },
        {
          id: '3',
          tugma: '3-misol (³⁷Cl/³⁵Cl)',
          formula: 'Ar(Cl) = 0,2423·37 + 0,7577·35 = 35,4846 ≈ 35,5',
          tur: 'hisob',
          cfg: {
            sarlavha: '3-misol: 24,23% ³⁷Cl va 75,77% ³⁵Cl dan Ar(Cl)',
            tenglama: 'Ar(Cl) = ω₁·A₁ + ω₂·A₂ = 8,9651 + 26,5195',
            qadamlar: [
              { belgi: '³⁷Cl hissa', natija: '0,2423·37 = 8,97', izoh: 'Og\'ir izotop ulushi', rang: '#a855f7' },
              { belgi: '³⁵Cl hissa', natija: '0,7577·35 = 26,52', izoh: 'Yengil izotop ulushi', rang: '#38bdf8' },
              { belgi: 'Yig\'indi', natija: '35,4846 ≈ 35,5', izoh: 'Jadvalda aniq qiymat 35,453', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '³⁵Cl', foiz: 76, qiymat: '75,77%', rang: '#38bdf8' },
              { nom: '³⁷Cl', foiz: 24, qiymat: '24,23%', rang: '#a855f7' },
            ],
            javobBadge: 'Ar(Cl) = 35,4846 ≈ 35,5',
          },
          pastki: [
            'Izotoplar o\'rtacha massasi',
            'Ar(Cl) ≈ 35,5',
            'Kasr massa — izotoplar natijasi',
          ],
        },
        {
          id: '4',
          tugma: '4-misol (¹⁰⁷Ag/¹⁰⁹Ag)',
          formula: '107x + 109(1-x) = 107,9 → x = 0,55 (55% / 45%)',
          tur: 'hisob',
          cfg: {
            sarlavha: '4-misol: ¹⁰⁷Ag va ¹⁰⁹Ag ulushlarini topish (Ar=107,9)',
            tenglama: '109 - 2x = 107,9 → 2x = 1,1 → x = 0,55 (55%)',
            qadamlar: [
              { belgi: 'Tenglama', natija: '107x + 109(1-x)', izoh: 'x = ¹⁰⁷Ag ulushi, (1-x) = ¹⁰⁹Ag', rang: '#38bdf8' },
              { belgi: 'Yechish', natija: '2x = 109 - 107,9', izoh: '2x = 1,1 → x = 0,55', rang: '#fbbf24' },
              { belgi: 'Natija', natija: '55% va 45%', izoh: '55% ¹⁰⁷Ag hamda 45% ¹⁰⁹Ag', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '¹⁰⁷Ag', foiz: 55, qiymat: '55%', rang: '#fbbf24' },
              { nom: '¹⁰⁹Ag', foiz: 45, qiymat: '45%', rang: '#38bdf8' },
            ],
            javobBadge: '55% ¹⁰⁷Ag • 45% ¹⁰⁹Ag',
          },
          pastki: [
            '107·0,55 + 109·0,45 = 107,9',
            'Yengil izotop biroz ko\'proq',
            'Tenglama usuli bilan topiladi',
          ],
        },
        {
          id: '5',
          tugma: '5-misol & GeO₂',
          formula: '...2p⁴ (O, 8) • ...3d¹ 4s² (Sc, 21) • Si = 28,107 • Ge = 73',
          tur: 'hisob',
          cfg: {
            sarlavha: '5-misol va mustaqil masalalar (Si, GeO₂)',
            tenglama: 'EO₂ (30,5% O): 32 / (Ar + 32) = 0,305 → Ar ≈ 73 (Ge)',
            qadamlar: [
              { belgi: '5-misol', natija: 'O (8), Sc (21)', izoh: '...2s²2p⁴=8 ē; ...3d¹4s²=21 ē', rang: '#38bdf8' },
              { belgi: 'Si (Ar)', natija: '28,107', izoh: '0,923·28 + 0,047·29 + 0,03·30', rang: '#fbbf24' },
              { belgi: 'EO₂ (30,5%)', natija: 'Ar ≈ 73 (Ge)', izoh: '32 / 0,305 - 32 ≈ 73 (Germaniy)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Ge ulushi', foiz: 69, qiymat: '69,5%', rang: '#34d399' },
              { nom: 'O ulushi', foiz: 31, qiymat: '30,5%', rang: '#38bdf8' },
            ],
            javobBadge: 'O (8), Sc (21), Si (28,1), Ge (73)',
          },
          pastki: [
            '...2s² 2p⁴ → O; ...3d¹ 4s² → Sc',
            'Ar(Si) = 28,107 (3 izotop)',
            'EO₂ (30,5% O) → Germaniy (Ge)',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: II BOB TEST TAHLILI (61-62-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaBobYakunTest() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. II bob yakuniy test qoidalari (61–62-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'cl3d',
          tugma: 'Cl bo\'sh 3d⁰',
          formula: '+17 Cl (1s²..3s² 3p⁵ 3d⁰): 5 ta bo\'sh 3d-orbital',
          tur: 'molekula',
          cfg: {
            sarlavha: '62-bet 4-test: +17 Cl da 5 ta bo\'sh 3d-orbital',
            tenglama: 'Cl: 1s² 2s² 2p⁶ 3s² 3p⁵ 3d⁰ (3d — 5 ta bo\'sh katakcha)',
            rejim: 'atom',
            qavatlar: [2, 8, 7],
            markaz: { belgi: 'Cl +17', zaryad: '3d⁰ (5 bo\'sh)', rang: '#38bdf8' },
            metrikalar: [
              { nom: 'Tashqi 3s/3p', qiymat: '7 ē', foiz: 70, rang: '#34d399' },
              { nom: 'Bo\'sh 3d', qiymat: '5 orbital', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: '3s² 3p⁵', v: '7 ē', rang: '#34d399' },
              { k: '3d⁰', v: '5 bo\'sh', rang: '#fbbf24' },
              { k: 'Toq ē', v: '1 ta', rang: '#f472b6' },
            ],
          },
          pastki: [
            '3-qavatda 3d-qavatcha mavjud',
            'Asosiy holatda 5 ta bo\'sh 3d⁰',
            'Cl: 3p⁵ (1 toq, 3 juftlangan)',
          ],
        },
        {
          id: 'p3',
          tugma: 'B, Al, Ga p-oilasi',
          formula: '62-bet 5-test: B, Al, Ga — tashqi 3 ē li p-elementlar',
          tur: 'molekula',
          cfg: {
            sarlavha: 'B, Al, Ga: IIIA guruh — tashqi 3 ē li p-elementlar',
            tenglama: 'B (2s²2p¹) • Al (3s²3p¹) • Ga (4s²3d¹⁰4p¹)',
            rejim: 'atom',
            qavatlar: [2, 8, 18, 3],
            markaz: { belgi: 'Ga +31', zaryad: 'IIIA (3 ē)', rang: '#34d399' },
            metrikalar: [
              { nom: 'Tashqi ē', qiymat: '3 ē (s²p¹)', foiz: 60, rang: '#34d399' },
              { nom: 'Oila', qiymat: 'p-element', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'B (+5)', v: '2s² 2p¹', rang: '#38bdf8' },
              { k: 'Al (+13)', v: '3s² 3p¹', rang: '#34d399' },
              { k: 'Ga (+31)', v: '4s² 4p¹', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'IIIA guruh: B, Al, Ga p-element',
            'Tashqi qavatda 3 ta elektron',
            'Metallmaslik: Na<Mg<Al<Si<P<S<Cl',
          ],
        },
        {
          id: 'ba81',
          tugma: '¹³⁷₅₆Ba (81 n⁰)',
          formula: '62-bet 2-test: ¹³⁷₅₆Ba yadrosida 81 ta neytron (137 - 56)',
          tur: 'molekula',
          cfg: {
            sarlavha: '¹³⁷₅₆Ba yadro tarkibi: 56 p⁺, 81 n⁰, 56 e⁻',
            tenglama: 'N = A - Z = 137 - 56 = 81 neytron',
            rejim: 'atom',
            qavatlar: [2, 8, 18, 18, 8, 2],
            markaz: { belgi: 'Ba +56', zaryad: '81 n⁰', rang: '#a855f7' },
            metrikalar: [
              { nom: 'Proton (Z)', qiymat: '56 p⁺', foiz: 56, rang: '#ef4444' },
              { nom: 'Neytron (N)', qiymat: '81 n⁰', foiz: 81, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'A (massa)', v: '137', rang: '#38bdf8' },
              { k: 'p⁺ / e⁻', v: '56', rang: '#34d399' },
              { k: 'n⁰ (137-56)', v: '81', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'N = A - Z = 137 - 56 = 81 n⁰',
            'Proton va elektronlar: 56 tadan',
            '6-davr, IIA guruh s-elementi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (12-§) VA O'YINLAR (13-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '4-davr elementlari oilalari (12-§):',
    variantlar: [
      { matn: '8 ta: 2 s va 6 p', togri: false },
      { matn: '18 ta: 2 s (K, Ca), 10 d, 6 p', togri: true },
      { matn: '32 ta: 14 f va 18 d', togri: false },
      { matn: '10 ta: faqat d', togri: false },
    ],
    izoh: '51–52-b: 4-davrda 2s + 10d + 6p = 18 ta.',
  },
  {
    id: 't2',
    savol: 'Rux (+30 Zn) qavatlar taqsimoti:',
    variantlar: [
      { matn: '2, 8, 18, 2 (...3d¹⁰ 4s²)', togri: true },
      { matn: '2, 8, 8, 12', togri: false },
      { matn: '2, 8, 10, 10', togri: false },
      { matn: '2, 8, 18, 3', togri: false },
    ],
    izoh: '52-b: 3d¹⁰ to\'lib, 3-qavat 18 ē bo\'ladi.',
  },
  {
    id: 't3',
    savol: 'Lantanoid va aktinoidlar qaysi oila?',
    variantlar: [
      { matn: 's-elementlar', togri: false },
      { matn: 'p-elementlar', togri: false },
      { matn: 'd-elementlar', togri: false },
      { matn: 'f-elementlar (4f / 5f)', togri: true },
    ],
    izoh: '52-b: tashqidan 2 oldingi 4f, 5f to\'ladi.',
  },
  {
    id: 't4',
    savol: '+24 Cr va +25 Mn toq elektronlari:',
    variantlar: [
      { matn: 'Cr 2 ta, Mn 3 ta', togri: false },
      { matn: 'Ikkalasida 0 ta', togri: false },
      { matn: 'Cr 6 ta (3d⁵4s¹), Mn 5 ta', togri: true },
      { matn: 'Cr 1 ta, Mn 7 ta', togri: false },
    ],
    izoh: '53-b: Cr da 6 ta toq elektron rekorddir.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'bashorat', nom: 'Bashorat → Element', tavsif: 'Eb, El, Es' },
    { id: 'tavsif', nom: 'Sr, As, Se tavsifi', tavsif: 'Qavat, n⁰, oksid' },
    { id: 'tendensiya', nom: 'Davr/guruh qoidasi', tavsif: 'Radius, orbital' },
  ],
  topshiriqlar: [
    { nom: 'Ekasilitsiy → Germaniy (Ge)', qisqa: 'Vinkler, 1886', guruh: 'bashorat', izoh: '12-jadval: Ar 72 vs 72,6.' },
    { nom: 'Ekaalyuminiy → Galliy (Ga)', qisqa: 'Buabodran, 1875', guruh: 'bashorat', izoh: '56-b: birinchi kashf etilgan.' },
    { nom: 'Ekabor → Skandiy (Sc)', qisqa: 'Nilson, 1879', guruh: 'bashorat', izoh: 'IIIB guruh, Sc₂O₃.' },
    { nom: '+38 Sr: 2, 8, 18, 8, 2', qisqa: '50 n⁰, SrO', guruh: 'tavsif', izoh: '5-davr, IIA s-element.' },
    { nom: '+33 As: 2, 8, 18, 5', qisqa: '42 n⁰, As₂O₅', guruh: 'tavsif', izoh: '4-davr, VA p-element.' },
    { nom: '+34 Se: 2, 8, 18, 6', qisqa: '45 n⁰, H₂Se', guruh: 'tavsif', izoh: '58-b 1-savol javobi.' },
    { nom: 'Davr (Li → F): radius ↓', qisqa: '0,155 → 0,064 nm', guruh: 'tendensiya', izoh: '54-b: yadro zaryadi ortadi.' },
    { nom: 'Guruh (Li → Cs): metallik ↑', qisqa: 'Qavat: 2 → 6', guruh: 'tendensiya', izoh: '54-b: tashqi ē uzoqlashadi.' },
    { nom: 'Cl (+17): 5 bo\'sh 3d-orbital', qisqa: '...3s² 3p⁵ 3d⁰', guruh: 'tendensiya', izoh: '62-b 4-test: 3d⁰ bo\'sh.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '+38 Sr',
    savol: '+38 Sr (A=88) tarkibi:',
    variantlar: ['50 p⁺, 38 n⁰, 38 e⁻', '38 p⁺, 88 n⁰, 38 e⁻', '38 p⁺, 50 n⁰, 38 e⁻', '38 p⁺, 42 n⁰, 38 e⁻'],
    togri: 2,
    izoh: '54-b: p⁺=38, N = 88 - 38 = 50 n⁰.',
  },
  {
    belgi: '12-jadval',
    savol: 'Ekasilitsiy qaysi element?',
    variantlar: ['Germaniy (Ge, 1886)', 'Skandiy (Sc, 1879)', 'Galliy (Ga, 1875)', 'Reniy (Re, 1925)'],
    togri: 0,
    izoh: '56-b: Vinkler topgan Germaniy (Ge).',
  },
  {
    belgi: 'Radius (54-b)',
    savol: '2-davrda Li → F o\'zgarishi:',
    variantlar: ['r ↑, metallik ↑', 'O\'zgarmaydi', 'r ↓, metallik ↑', 'r ↓ (0,155→0,064), metalmas ↑'],
    togri: 3,
    izoh: '54-b: 2 qavatda Z ortib r kichrayadi.',
  },
  {
    belgi: '2-misol (58-b)',
    savol: 'EO₃ va H₂E da 5,88% H — element?',
    variantlar: ['Uglerod (C)', 'Oltingugurt (S)', 'Azot (N)', 'Kremniy (Si)'],
    togri: 1,
    izoh: '58-b: 94,12/5,88 = 16; Ar = 32 (S).',
  },
  {
    belgi: '4-misol (59-b)',
    savol: 'Ar(Ag)=107,9: ¹⁰⁷Ag / ¹⁰⁹Ag ulushi?',
    variantlar: ['50% / 50%', '55% ¹⁰⁷Ag / 45% ¹⁰⁹Ag', '75% / 25%', '24% / 76%'],
    togri: 1,
    izoh: '59-b: 107x + 109(1-x) = 107,9 → 55%.',
  },
  {
    belgi: '58-b 1-savol',
    savol: '4-davr VIA, A=79, Z=34:',
    variantlar: ['Mishyak (As)', 'Brom (Br)', 'Germaniy (Ge)', 'Selen (Se, 45 n⁰)'],
    togri: 3,
    izoh: '58-b: Z=34 Selen, qavat 2, 8, 18, 6.',
  },
  {
    belgi: '62-b 4-test',
    savol: 'Cl (+17) da bo\'sh 3d-orbital soni:',
    variantlar: ['5 ta (...3p⁵ 3d⁰)', '0 ta', '3 ta', '7 ta'],
    togri: 0,
    izoh: '62-b: 3d-qavatcha 5 katakchasi bo\'sh.',
  },
  {
    belgi: '62-b 5-test',
    savol: 'Tashqi 3 ē li p-elementlar:',
    variantlar: ['Li, Na, K', 'Sc, Y, La', 'B, Al, Ga (IIIA)', 'Fe, Co, Ni'],
    togri: 2,
    izoh: '62-b: B, Al, Ga — IIIA p-elementlar.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Tavsiflash rejasi',
    vazifa: '53-b tavsiflash rejasini tartiblang:',
    tartib: ['1. Jadvaldagi o\'rni', '2. Xossa va birikmasi', '3. Yadro (p⁺, n⁰)', '4. Qavat va formula'],
    variantlar: ['3. Yadro (p⁺, n⁰)', '1. Jadvaldagi o\'rni', '4. Qavat va formula', '2. Xossa va birikmasi'],
  },
  {
    tur: 'Metalmaslik ortishi',
    vazifa: '62-b: Metalmaslik ortishi tartibi:',
    tartib: ['Na (metall)', 'Mg va Al', 'Si va P', 'S → Cl (metalmas)'],
    variantlar: ['Si va P', 'Na (metall)', 'S → Cl (metalmas)', 'Mg va Al'],
  },
  {
    tur: 'Kashf yillari',
    vazifa: 'Bashorat elementlarini kashf yiliga ko\'ra tuzing:',
    tartib: ['1875: Galliy (Ga)', '1879: Skandiy (Sc)', '1886: Germaniy (Ge)', '1925: Reniy (Re)'],
    variantlar: ['1886: Germaniy (Ge)', '1875: Galliy (Ga)', '1925: Reniy (Re)', '1879: Skandiy (Sc)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '58-b 2-misol: EO₃ da E valentligi va H-birikmasi?',
    variantlar: ['IV, EH₄', 'VI valentli, H₂E', 'V, EH₃', 'VII, HE'],
    togri: 1,
    izoh: '8 - 6 = 2 → H₂E (masalan H₂S).',
  },
  {
    savol: '57-b: +33 As (A=75) qavat va n⁰ soni:',
    variantlar: ['2,8,18,6 va 45 n⁰', '2,8,8,15 va 33 n⁰', '2,8,18,4 va 40 n⁰', '2,8,18,5 va 42 n⁰'],
    togri: 3,
    izoh: 'VA guruh: 2, 8, 18, 5; N = 75-33 = 42.',
  },
  {
    savol: '62-b 2-test: ¹³⁷₅₆Ba neytronlar soni:',
    variantlar: ['81 ta (137 - 56)', '56 ta', '137 ta', '193 ta'],
    togri: 0,
    izoh: 'N = A - Z = 137 - 56 = 81.',
  },
  {
    savol: '59-b 3-misol: 24,23% ³⁷Cl + 75,77% ³⁵Cl:',
    variantlar: ['36,00', '35,00', '35,4846 ≈ 35,5', '37,00'],
    togri: 2,
    izoh: '0,2423·37 + 0,7577·35 = 35,4846.',
  },
  {
    savol: '54-b: IIA metallik ortish qatori:',
    variantlar: ['Ba < Sr < Ca < Be', 'Ca < Mg < Sr < Be', 'Be < Mg < Ca < Sr < Ba', 'Sr < Ca < Ba < Mg'],
    togri: 2,
    izoh: 'Guruhda pastga radius va metallik ortadi.',
  },
  {
    savol: '59-b 5-misol: ...2s²2p⁴ va ...3d¹4s²:',
    variantlar: ['Kislorod (8) va Skandiy (21)', 'Azot va Titan', 'S va Vanadiy', 'Ftor va Rux'],
    togri: 0,
    izoh: '2p⁴ → Z=8 (O); 3d¹4s² → Z=21 (Sc).',
  },
  {
    savol: '12-jadval: Ekasilitsiy vs Ge zichligi (g/cm³):',
    variantlar: ['2,0 vs 7,8', '5,5 vs 5,32', '1,0 vs 10,0', '19,3 vs 11,3'],
    togri: 1,
    izoh: '12-jadval: ρ(Es)=5,5; ρ(Ge)=5,32.',
  },
  {
    savol: '58-b 1-misol: Z = 23 Vanadiy oilasi:',
    variantlar: ['s-element', 'p-element', 'f-element', 'd-element (...3d³ 4s²)'],
    togri: 3,
    izoh: 'Oxirgi elektron 3d da → d-element.',
  },
];

export default function S8Mavzu13() {
  const korgazmalar = [
    { nom: '1. +38 Sr ni tavsiflash', ikon: 'yadro', komponent: <KorgazmaStronsiyTavsif /> },
    { nom: '2. Radius va xossalar', ikon: 'grafik', komponent: <KorgazmaRadiusVaXossa /> },
    { nom: '3. Bashorat (12-jadval)', ikon: 'qidiruv', komponent: <KorgazmaBashoratJadval12 /> },
    { nom: '4. +33 As va +34 Se', ikon: 'atom', komponent: <KorgazmaMishyakTavsif /> },
    { nom: '5. 1-5-masalalar yechimi', ikon: 'formula', komponent: <KorgazmaMasalaYechgich /> },
    { nom: '6. II bob test qoidalari', ikon: 'uchqun', komponent: <KorgazmaBobYakunTest /> },
  ];

  const oyinlar = [
    {
      nom: '1. 13-§: Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-13"
          nom="Bashoratlar, Sr/As tavsifi va davriy o'zgarishlarni ajratish"
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
          key="tezkor-13"
          nom="13-§: Tavsiflash va masalalar viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Reja va xossa zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-13"
          nom="Element tavsifi va davriy tendensiyalar zanjiri"
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
          key="duel-13"
          sarlavha="13-§: II bob yakunlovchi dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="13-§"
      mavzuNom="Elementlarning davriy sistemadagi o'rni va atom tuzilishiga qarab tavsiflash. Davriy qonunning ahamiyati"
      oldingiRaqam="12-§"
      oldingiNom="Katta davr elementlarining atom tuzilishi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
