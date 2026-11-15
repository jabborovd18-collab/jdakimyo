'use client';
// ============================================================
// JDA KIMYO - 8-SINF, II BOB, 3-PARAGRAF
// "Kimyoviy elementlarning dastlabki toifalanishi" (Darslik 17-21-betlar)
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
  chizStakan,
  chizZarracha,
  GuruhlashOyini,
  TezkorTanlovOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi';
import { SahnaCanvas } from '@/components/maktab/SmartKimyoSahna';

/* ═══════════════════════════════════════════════════════════════
   1-KO'RGAZMA: ELEMENTLAR SONI TARIXI VA ALLOMALAR
═══════════════════════════════════════════════════════════════ */
const DAVRLAR_DATA = [
  {
    id: 'qadimgi',
    nom: 'Qadimgi davr',
    sarlavha: "Miloddan avvalgi atomistik g'oyalar",
    soni: '~10',
    rang: '#f59e0b',
    vakillar: ['Levkipp', 'Demokrit', 'Epikur'],
    izoh: "Moddalar bo'linmas mayda zarrachalar - atomlardan tuzilgani haqidagi dastlabki falsafiy ta'limot ilgari surilgan.",
  },
  {
    id: 'sharq',
    nom: 'VIII-XI asr allomalari',
    sarlavha: 'Markaziy Osiyo mutafakkirlarining hissasi',
    soni: 'Tasnif',
    rang: '#10b981',
    vakillar: [
      "Ahmad al-Farg'oniy",
      'Abu Bakr ar-Roziy',
      'Forobiy va Beruniy',
      'Abu Ali ibn Sino',
    ],
    izoh: "Ar-Roziy atom bo'linishi haqida fikr bildirgan; Forobiy va Beruniy ma'dan va qimmatbaho toshlarni sinflagan; Ibn Sino dorivor moddalarni toifalagan.",
  },
  {
    id: 'xviii',
    nom: 'XVIII-XIX asr (30 -> 63)',
    sarlavha: 'Ilmiy kimyo va dastlabki toifalash davri',
    soni: '30 -> 63',
    rang: '#38bdf8',
    vakillar: ['XVIII asr oxiri: ~30 element', 'XIX asr 60-yillari: 63 element'],
    izoh: "Elementlar soni keskin ortgach, ularni metallar, metallmaslar va o'xshash tabiiy oilalarga ajratish zaruriyati tug'ilgan.",
  },
  {
    id: 'hozir',
    nom: 'Hozirgi davr (118 ta)',
    sarlavha: 'Zamonaviy kimyoviy elementlar tizimi',
    soni: '118 ta',
    rang: '#a855f7',
    vakillar: ['Tabiiy elementlar', "Sun'iy sintez qilingan elementlar"],
    izoh: "Bugungi kunda jami 118 ta kimyoviy element ma'lum bo'lib, ularning barchasi davriy tizimda o'z o'rniga ega.",
  },
];

function KorgazmaTarix() {
  const canvasRef = useRef(null);
  const [davrId, setDavrId] = useState('sharq');
  const faol = DAVRLAR_DATA.find((d) => d.id === davrId) || DAVRLAR_DATA[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.025;

      const tanlangan = DAVRLAR_DATA.find((d) => d.id === davrId) || DAVRLAR_DATA[1];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(tanlangan.sarlavha, 24, 34);

      const ustunlar = [
        { yorliq: 'XVIII asr oxiri', soni: 30, rang: '#38bdf8' },
        { yorliq: 'XIX asr 60-y.', soni: 63, rang: '#10b981' },
        { yorliq: 'Hozirgi davr', soni: 118, rang: '#a855f7' },
      ];
      const baseX = 32;
      const baseY = h - 50;
      const maxH = h - 135;

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(w * 0.47, baseY);
      ctx.stroke();

      const barGap = Math.min(82, (w * 0.4) / 3);
      ustunlar.forEach((u, idx) => {
        const bw = Math.min(54, barGap * 0.68);
        const bx = baseX + 16 + idx * barGap;
        const bh = (u.soni / 118) * maxH * (0.95 + 0.03 * Math.sin(t + idx));
        const by = baseY - bh;

        const grad = ctx.createLinearGradient(bx, by, bx, baseY);
        grad.addColorStop(0, u.rang);
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.35)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(bx, by, bw, bh, [8, 8, 2, 2]);
        ctx.fill();

        ctx.strokeStyle = u.rang;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${u.soni} ta`, bx + bw / 2, by - 8);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Times New Roman", serif';
        ctx.fillText(u.yorliq, bx + bw / 2, baseY + 18);
      });

      const panelX = w * 0.51;
      const panelW = w * 0.45;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.strokeStyle = tanlangan.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(panelX, 54, panelW, h - 82, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tanlangan.rang;
      ctx.font = 'bold 15px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Davr: ${tanlangan.nom}`, panelX + 18, 84);

      tanlangan.vakillar.forEach((v, idx) => {
        const y = 108 + idx * 46;
        const siljish = 3 * Math.sin(t * 1.4 + idx);
        ctx.fillStyle = 'rgba(30, 41, 59, 0.88)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(panelX + 16, y + siljish * 0.4, panelW - 32, 36, 9);
        ctx.fill();
        ctx.stroke();

        chizZarracha(ctx, panelX + 34, y + 18 + siljish * 0.4, 7, tanlangan.rang, '');
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(v, panelX + 52, y + 23 + siljish * 0.4);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [davrId]);

  return (
    <KorgazmaRamka
      sarlavha="1. Kimyoviy elementlarning ochilish va toifalanish tarixi (17-bet)"
      qisqaFormula="XVIII asr (~30) → XIX asr 60-y. (63) → bugun (118)"
      ikon="kitob"
      boshqaruv={
        <>
          {DAVRLAR_DATA.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => {
                setDavrId(d.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                davrId === d.id
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-emerald-400/50'
              }`}
            >
              {d.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Tanlangan davr: {faol.nom} ({faol.soni})
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300 sm:col-span-2">
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
   2-KO'RGAZMA: METALLAR, METALLMASLAR VA ISTISNOLAR
═══════════════════════════════════════════════════════════════ */
const TOIFA_MODDALAR = [
  {
    id: 'metall',
    nom: 'Metallar',
    rang: '#38bdf8',
    belgilar: 'Na, K, Ca, Fe, Cu, Hg',
    xossalar: [
      'Metall yaltiroqligi, elektr o\'tkazadi',
      'Bolg\'alanuvchan; Hg dan boshqasi qattiq',
      'Asosli oksid va gidroksid beradi',
      'Qattiq gidridlar: NaH, CaH₂',
    ],
  },
  {
    id: 'metallmas',
    nom: 'Metallmaslar',
    rang: '#f59e0b',
    belgilar: 'O₂, H₂, Cl₂, S, C, Br₂, I₂',
    xossalar: [
      'Gaz (O₂, Cl₂), suyuq (Br₂), qattiq (S, I₂)',
      'Elektrni yomon o\'tkazadi, mo\'rt',
      'Kislotali oksidlar: SO₂ → H₂SO₃',
      'Uchuvchan gidridlar: HCl, H₂S, NH₃',
    ],
  },
  {
    id: 'istisno',
    nom: 'Muhim istisnolar',
    rang: '#ec4899',
    belgilar: 'Hg (suyuq) • Br₂ (suyuq) • I₂ (yaltiroq)',
    xossalar: [
      'Hg — yagona suyuq metall',
      'Br₂ — suyuq metallmas',
      'I₂ — yaltiroq, lekin metallmas',
      'Toifalash kimyoviy xossaga ko\'ra!',
    ],
  },
];

function KorgazmaMetallMetallmas() {
  const canvasRef = useRef(null);
  const [toifaId, setToifaId] = useState('metall');
  const faol = TOIFA_MODDALAR.find((x) => x.id === toifaId) || TOIFA_MODDALAR[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const tan = TOIFA_MODDALAR.find((x) => x.id === toifaId) || TOIFA_MODDALAR[0];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${tan.nom} - tuzilishi va o'ziga xos xossalari`, 24, 34);

      const cx = w * 0.26;
      const cy = h * 0.52;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.strokeStyle = tan.rang;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(24, 54, w * 0.44, h - 80, 16);
      ctx.fill();
      ctx.stroke();

      if (toifaId === 'metall') {
        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            chizZarracha(ctx, cx + c * 52, cy + r * 46, 15, '#38bdf8', 'M⁺');
          }
        }
        for (let e = 0; e < 6; e++) {
          const ex = cx - 75 + ((t * 44 + e * 36) % 150);
          const ey = cy + 34 * Math.sin(t * 2 + e);
          chizZarracha(ctx, ex, ey, 5, '#fbbf24', 'e⁻');
        }
        ctx.fillStyle = '#bae6fd';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Metall kristall panjarasi va erkin elektronlar', cx, h - 38);
      } else if (toifaId === 'metallmas') {
        const juftlar = [
          { dx: -48, dy: -32, belgi: 'Cl', r: '#fbbf24' },
          { dx: 46, dy: 24, belgi: 'O', r: '#f87171' },
          { dx: -8, dy: 52, belgi: 'H', r: '#34d399' },
        ];
        juftlar.forEach((j, idx) => {
          const x1 = cx + j.dx + Math.sin(t + idx) * 12;
          const y1 = cy + j.dy + Math.cos(t * 1.2 + idx) * 10;
          ctx.strokeStyle = 'rgba(248, 250, 252, 0.5)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x1 - 12, y1);
          ctx.lineTo(x1 + 12, y1);
          ctx.stroke();
          chizZarracha(ctx, x1 - 14, y1, 13, j.r, j.belgi);
          chizZarracha(ctx, x1 + 14, y1, 13, j.r, j.belgi);
        });
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('Ikki atomli molekulalar va uchuvchan gidridlar', cx, h - 38);
      } else {
        const span = Math.min(72, w * 0.12);
        const namunalar = [
          { yorliq: 'Hg (suyuq metall)', rang: '#94a3b8', x: cx - span },
          { yorliq: 'Br₂ (suyuq)', rang: '#b45309', x: cx },
          { yorliq: 'I₂ (yaltiroq)', rang: '#a855f7', x: cx + span },
        ];
        namunalar.forEach((n, idx) => {
          const y = cy + 5 * Math.sin(t * 1.8 + idx);
          chizStakan(ctx, n.x - 26, y - 48, 52, 86, {
            suyuqlikRang: n.rang,
            tolish: 0.55,
            yorliq: n.yorliq.split(' ')[0],
            sarlavha: idx === 2 ? 'Qattiq' : 'Suyuq',
          });
        });
        ctx.fillStyle = '#fbcfe8';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText('I₂ - yaltiroq metallmas; Hg - suyuq metall!', cx, h - 38);
      }

      const rx = w * 0.5;
      const rw = w * 0.47;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rx, 54, rw, h - 80, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tan.rang;
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`Misollar: ${tan.belgilar}`, rx + 16, 82);

      tan.xossalar.forEach((m, i) => {
        const y = 102 + i * 62;
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.beginPath();
        ctx.roundRect(rx + 14, y, rw - 28, 52, 9);
        ctx.fill();

        ctx.fillStyle = tan.rang;
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(`${i + 1}.`, rx + 24, y + 22);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 13px "Times New Roman", serif';
        ctx.fillText(m, rx + 44, y + 31);
      });

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [toifaId]);

  return (
    <KorgazmaRamka
      sarlavha="2. Metallar, metallmaslar va darslikdagi istisnolar (18-bet)"
      qisqaFormula="Hg - suyuq metall • Br₂ - suyuq metallmas • I₂ - yaltiroq metallmas"
      ikon="kristall"
      boshqaruv={
        <>
          {TOIFA_MODDALAR.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setToifaId(m.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                toifaId === m.id
                  ? 'bg-sky-400 text-slate-950 border-sky-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-sky-400/50'
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
            Vakillar: {faol.belgilar}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            {faol.xossalar[2]}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.xossalar[3]}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: 1-JADVAL - GENETIK ZANJIRLAR (Na, Zn, S)
═══════════════════════════════════════════════════════════════ */
const ZANJIRLAR = [
  {
    id: 'na',
    nom: 'Natriy (Asosli qator)',
    rang: '#38bdf8',
    bosqichlar: ['Na', 'Na₂O', 'NaOH', 'NaCl'],
    izohlar: ['Metall', 'Asosli oksid', 'Ishqor (asos)', 'Tuz (+HCl)'],
    tenglama: 'Na → Na₂O (+O₂) → NaOH (+H₂O) → NaCl (+HCl)',
  },
  {
    id: 'zn',
    nom: 'Rux (Amfoter qator)',
    rang: '#a855f7',
    bosqichlar: ['Zn', 'ZnO', 'Zn(OH)₂ / H₂ZnO₂', 'ZnCl₂ / Na₂ZnO₂'],
    izohlar: ['Amfoter metall', 'Amfoter oksid', 'Amfoter gidroksid', 'Ikki xil tuz'],
    tenglama: 'Zn → ZnO → Zn(OH)₂: +2HCl → ZnCl₂ + 2H₂O | +2NaOH → Na₂ZnO₂ + 2H₂O',
  },
  {
    id: 's',
    nom: 'Oltingugurt (Kislotali qator)',
    rang: '#f59e0b',
    bosqichlar: ['S', 'SO₂', 'H₂SO₃', 'Na₂SO₃'],
    izohlar: ['Metallmas', 'Kislotali oksid', 'Sulfit kislota', 'Tuz (+NaOH)'],
    tenglama: 'S → SO₂ (+O₂) → H₂SO₃ (+H₂O) → Na₂SO₃ (+NaOH)',
  },
];

function KorgazmaGenetikZanjir() {
  const canvasRef = useRef(null);
  const [zanjirId, setZanjirId] = useState('zn');
  const faol = ZANJIRLAR.find((item) => item.id === zanjirId) || ZANJIRLAR[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const z = ZANJIRLAR.find((item) => item.id === zanjirId) || ZANJIRLAR[1];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`1-jadval: ${z.nom} genetik bog'lanishi (19-bet)`, 24, 34);

      const gap = Math.min(34, w * 0.035);
      const boxW = Math.min(165, (w - 60 - 3 * gap) / 4);
      const startX = (w - (boxW * 4 + 3 * gap)) / 2;
      const cy = h * 0.48;

      z.bosqichlar.forEach((b, i) => {
        const bx = startX + i * (boxW + gap);
        const puls = 1 + 0.025 * Math.sin(t * 2 - i * 0.7);

        if (i < 3) {
          const ax1 = bx + boxW + 4;
          const ax2 = bx + boxW + gap - 4;
          ctx.strokeStyle = z.rang;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ax1, cy);
          ctx.lineTo(ax2, cy);
          ctx.lineTo(ax2 - 6, cy - 5);
          ctx.moveTo(ax2, cy);
          ctx.lineTo(ax2 - 6, cy + 5);
          ctx.stroke();

          const px = ax1 + ((t * 18) % Math.max(8, ax2 - ax1 - 4));
          chizZarracha(ctx, px, cy, 4, '#f8fafc', '');
        }

        ctx.save();
        ctx.translate(bx + boxW / 2, cy);
        ctx.scale(puls, puls);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = z.rang;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.roundRect(-boxW / 2, -52, boxW, 104, 14);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = z.rang;
        ctx.font = 'bold 11px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(z.izohlar[i], 0, -24);

        ctx.fillStyle = '#f8fafc';
        ctx.font = b.length > 13 ? 'bold 12px "Times New Roman", serif' : 'bold 16px "Times New Roman", serif';
        ctx.fillText(b, 0, 8);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px "Times New Roman", serif';
        ctx.fillText(`${i + 1}-bosqich`, 0, 34);
        ctx.restore();
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(z.tenglama, w / 2, h - 28);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [zanjirId]);

  return (
    <KorgazmaRamka
      sarlavha="3. 1-jadval: Metall, amfoter va metallmas genetik zanjirlari"
      qisqaFormula="Element → Oksid → Gidroksid / Kislota → Tuz"
      ikon="formula"
      boshqaruv={
        <>
          {ZANJIRLAR.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setZanjirId(item.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                zanjirId === item.id
                  ? 'bg-purple-400 text-slate-950 border-purple-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-purple-400/50'
              }`}
            >
              {item.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Qator: {faol.nom}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300 sm:col-span-2">
            {faol.tenglama}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: AMFOTER IKKI YOQLAMA XOSSA VA 5-MASHQ
═══════════════════════════════════════════════════════════════ */
const AMFOTER_TAJRIBA = [
  {
    id: 'hcl',
    nom: 'Zn(OH)₂ + 2HCl',
    reaksiya: 'Zn(OH)₂ + 2HCl = ZnCl₂ + 2H₂O',
    rol: 'Bu yerda Zn(OH)₂ ASOS sifatida kislota bilan reaksiyaga kirishdi',
    suyuqlikRang: 'rgba(56, 189, 248, 0.42)',
    natija: "Oq cho'kma to'liq eriydi → tiniq rux xlorid eritmasi (ZnCl₂)",
  },
  {
    id: 'naoh',
    nom: 'Zn(OH)₂ + 2NaOH',
    reaksiya: 'H₂ZnO₂ + 2NaOH = Na₂ZnO₂ + 2H₂O',
    rol: "Bu yerda Zn(OH)₂ (H₂ZnO₂) KISLOTA sifatida ishqor bilan ta'sirlashdi",
    suyuqlikRang: 'rgba(168, 85, 247, 0.42)',
    natija: "Oq cho'kma yana eriydi → natriy sinkat (Na₂ZnO₂)",
  },
  {
    id: 'be_mashq',
    nom: '5-mashq: 0,1 mol Be(OH)₂ + NaOH',
    reaksiya: 'Be(OH)₂ + 2NaOH = Na₂BeO₂ + 2H₂O',
    rol: 'M(Na₂BeO₂) = 2·23 + 9 + 2·16 = 87 g/mol • n = 0,1 mol',
    suyuqlikRang: 'rgba(16, 185, 129, 0.45)',
    natija: "Hosil bo'lgan natriy berillat massasi: m = 0,1 · 87 = 8,7 g",
  },
];

function KorgazmaAmfoter() {
  const canvasRef = useRef(null);
  const [tajribaId, setTajribaId] = useState('naoh');
  const faol = AMFOTER_TAJRIBA.find((x) => x.id === tajribaId) || AMFOTER_TAJRIBA[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const tan = AMFOTER_TAJRIBA.find((x) => x.id === tajribaId) || AMFOTER_TAJRIBA[1];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(tan.reaksiya, 24, 34);

      const sx1 = w * 0.14;
      const sx2 = w * 0.62;
      chizStakan(ctx, sx1, h * 0.24, 125, 165, {
        suyuqlikRang: 'rgba(226, 232, 240, 0.35)',
        tolish: 0.65,
        yorliq: tajribaId === 'be_mashq' ? '0,1 mol Be(OH)₂' : "Zn(OH)₂ cho'kma",
        sarlavha: '1. Amfoter gidroksid',
      });
      for (let i = 0; i < 6; i++) {
        chizZarracha(ctx, sx1 + 28 + i * 14, h * 0.24 + 145, 5, '#f8fafc', '');
      }

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 22px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tajribaId === 'hcl' ? '+ 2HCl →' : '+ 2NaOH →', (sx1 + 125 + sx2) / 2, h * 0.5);

      chizStakan(ctx, sx2, h * 0.24, 135, 165, {
        suyuqlikRang: tan.suyuqlikRang,
        tolish: 0.72,
        yorliq: tajribaId === 'hcl' ? 'ZnCl₂ (tiniq)' : tajribaId === 'naoh' ? 'Na₂ZnO₂ (tiniq)' : 'Na₂BeO₂ = 8,7 g',
        sarlavha: "2. Cho'kma erib tuz beradi",
      });

      for (let i = 0; i < 5; i++) {
        const ix = sx2 + 34 + i * 16 + Math.sin(t + i) * 5;
        const iy = h * 0.24 + 92 + Math.cos(t * 1.4 + i) * 20;
        chizZarracha(ctx, ix, iy, 6, '#34d399', '');
      }

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tan.rol, w / 2, h - 24);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [tajribaId]);

  return (
    <KorgazmaRamka
      sarlavha="4. Amfoter gidroksidlarning kislota va ishqorda erishi (21-bet 5-mashq)"
      qisqaFormula="Zn(OH)₂ ↔ H₂ZnO₂ • Be(OH)₂ + 2NaOH = Na₂BeO₂ + 2H₂O"
      ikon="kolba"
      boshqaruv={
        <>
          {AMFOTER_TAJRIBA.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTajribaId(item.id);
                tovushChiqar('togri');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                tajribaId === item.id
                  ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-emerald-400/50'
              }`}
            >
              {item.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Reaksiya: {faol.reaksiya}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            {faol.rol}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.natija}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: XROMNING O'ZGARUVCHAN VALENTLIKDAGI OKSIDLARI
═══════════════════════════════════════════════════════════════ */
const XROM_OKSIDLAR = [
  {
    id: 'cro',
    formula: 'CrO',
    valent: 'II valentli',
    xossa: 'Asosli oksid',
    rang: '#38bdf8',
    daraja: 2,
    tenglama: 'CrO + 2HCl = CrCl₂ + H₂O (faqat kislota bilan)',
  },
  {
    id: 'cr2o3',
    formula: 'Cr₂O₃',
    valent: 'III valentli',
    xossa: 'Amfoter oksid',
    rang: '#a855f7',
    daraja: 3,
    tenglama: 'Cr₂O₃ ham kislota (HCl), ham ishqor (NaOH) bilan reaksiyaga kirishadi',
  },
  {
    id: 'cro3',
    formula: 'CrO₃',
    valent: 'VI valentli',
    xossa: 'Kislotali oksid',
    rang: '#f43f5e',
    daraja: 6,
    tenglama: 'CrO₃ + H₂O = H₂CrO₄ (xromat kislota, ishqor bilan tuz beradi)',
  },
];

function KorgazmaXrom() {
  const canvasRef = useRef(null);
  const [oksidId, setOksidId] = useState('cr2o3');
  const faol = XROM_OKSIDLAR.find((o) => o.id === oksidId) || XROM_OKSIDLAR[1];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      const tan = XROM_OKSIDLAR.find((o) => o.id === oksidId) || XROM_OKSIDLAR[1];

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText("O'zgaruvchan valentlik - xossa o'zgarishi (Xrom oksidlari, 20-bet)", 24, 34);

      const cardW = Math.min(200, (w - 110) / 3);
      const startX = (w - (cardW * 3 + 44)) / 2;

      XROM_OKSIDLAR.forEach((o, i) => {
        const x = startX + i * (cardW + 22);
        const y = 172 - o.daraja * 15;
        const aktiv = o.id === oksidId;

        ctx.fillStyle = aktiv ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.72)';
        ctx.strokeStyle = aktiv ? o.rang : 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = aktiv ? 3 : 1.5;
        ctx.beginPath();
        ctx.roundRect(x, y, cardW, h - y - 54, 14);
        ctx.fill();
        ctx.stroke();

        chizZarracha(ctx, x + cardW / 2, y + 38 + (aktiv ? Math.sin(t * 2) * 3 : 0), 20, o.rang, o.formula);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 15px "Times New Roman", serif';
        ctx.textAlign = 'center';
        ctx.fillText(o.valent, x + cardW / 2, y + 78);

        ctx.fillStyle = o.rang;
        ctx.font = 'bold 14px "Times New Roman", serif';
        ctx.fillText(o.xossa, x + cardW / 2, y + 102);
      });

      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(tan.tenglama, w / 2, h - 22);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [oksidId]);

  return (
    <KorgazmaRamka
      sarlavha="5. Valentlik ortishi bilan oksid xossasining o'zgarishi (Cr)"
      qisqaFormula="CrO (II, asosli) → Cr₂O₃ (III, amfoter) → CrO₃ (VI, kislotali)"
      ikon="olov"
      boshqaruv={
        <>
          {XROM_OKSIDLAR.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOksidId(o.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                oksidId === o.id
                  ? 'bg-rose-400 text-slate-950 border-rose-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-rose-400/50'
              }`}
            >
              {o.formula} ({o.xossa})
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-cyan-300">
            Tanlangan: {faol.formula} ({faol.valent})
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            Sinfi: {faol.xossa}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.tenglama}
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: OKSID VA GIDROKSID REAKSIYA LABORATORIYASI
═══════════════════════════════════════════════════════════════ */
const LAB_OKSIDLAR = [
  { id: 'na2o', nom: 'Na₂O (Asosli)' },
  { id: 'zno', nom: 'ZnO (Amfoter)' },
  { id: 'so2', nom: 'SO₂ (Kislotali)' },
];
const LAB_REAKTIVLAR = [
  { id: 'hcl', nom: '+ HCl (Kislota)' },
  { id: 'naoh', nom: '+ NaOH (Ishqor)' },
];

const LAB_NATIJA = {
  'na2o:hcl': { ketadimi: true, tenglama: 'Na₂O + 2HCl = 2NaCl + H₂O', izoh: 'Asosli oksid + kislota → tuz + suv' },
  'na2o:naoh': { ketadimi: false, tenglama: 'Reaksiya ketmaydi!', izoh: 'Asosli oksid ishqorga kirmaydi' },
  'zno:hcl': { ketadimi: true, tenglama: 'ZnO + 2HCl = ZnCl₂ + H₂O', izoh: 'Amfoter oksid + kislota → tuz + suv' },
  'zno:naoh': { ketadimi: true, tenglama: 'ZnO + 2NaOH = Na₂ZnO₂ + H₂O', izoh: 'Amfoter oksid + ishqor → sinkat' },
  'so2:hcl': { ketadimi: false, tenglama: 'Reaksiya ketmaydi!', izoh: 'Kislotali oksid kislotaga kirmaydi' },
  'so2:naoh': { ketadimi: true, tenglama: 'SO₂ + 2NaOH = Na₂SO₃ + H₂O', izoh: 'Kislotali oksid + ishqor → tuz + suv' },
};

function KorgazmaLab() {
  const [oksidId, setOksidId] = useState('zno');
  const [reaktivId, setReaktivId] = useState('naoh');
  const faol = LAB_NATIJA[`${oksidId}:${reaktivId}`];
  const oksidNom = (LAB_OKSIDLAR.find((x) => x.id === oksidId) || LAB_OKSIDLAR[1]).nom;

  return (
    <KorgazmaRamka
      sarlavha="6. Oksidlarning kislota va ishqor bilan sinovi"
      qisqaFormula={faol.tenglama}
      ikon="mikroskop"
      boshqaruv={
        <>
          {LAB_OKSIDLAR.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setOksidId(o.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                oksidId === o.id
                  ? 'bg-sky-400 text-slate-950 border-sky-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-sky-400/50'
              }`}
            >
              {o.nom}
            </button>
          ))}
          {LAB_REAKTIVLAR.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => {
                setReaktivId(r.id);
                tovushChiqar('tasdiq');
              }}
              className={`rounded-xl px-3.5 py-2 text-sm font-bold border transition ${
                reaktivId === r.id
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
            Holat: {faol.ketadimi ? 'Reaksiya ketdi' : 'Reaksiya yo\'q'}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-yellow-300">
            {faol.tenglama}
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            {faol.izoh}
          </div>
        </>
      }
    >
      <SahnaCanvas
        tur="reaksiya"
        cfg={{
          sarlavha: `${oksidNom} + ${reaktivId === 'hcl' ? 'HCl' : 'NaOH'}`,
          tenglama: faol.tenglama,
          ikkiIdish: true,
          suyuqlikRang: faol.ketadimi ? '#10b981' : '#ef4444',
          tolish: 0.7,
          stakanBelgi: oksidNom.split(' ')[0],
          stakanSarlavha: 'Oksid',
          ikkinchiSuyuqlikRang: reaktivId === 'hcl' ? '#f43f5e' : '#38bdf8',
          ikkinchiBelgi: reaktivId === 'hcl' ? 'HCl' : 'NaOH',
          ikkinchiSarlavha: reaktivId === 'hcl' ? 'Kislota' : 'Ishqor',
          reagentlar: faol.ketadimi
            ? [{ belgi: 'Tuz', rang: '#34d399' }, { belgi: 'H₂O', rang: '#38bdf8' }]
            : [{ belgi: '≠', rang: '#ef4444' }],
          belgilar: [
            { k: 'Oksid', v: oksidNom, rang: '#38bdf8' },
            { k: 'Natija', v: faol.ketadimi ? 'Eriydi ✓' : 'Kirmaydi ✗', rang: faol.ketadimi ? '#34d399' : '#fb7185' },
          ],
        }}
      />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH VA O'YINLAR
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Faqat amfoter gidroksidlar qatori:',
    variantlar: [
      { matn: 'NaOH, KOH, Ca(OH)₂', togri: false },
      { matn: 'Zn(OH)₂, Al(OH)₃, Be(OH)₂', togri: true },
      { matn: 'Cu(OH)₂, Fe(OH)₂, Mg(OH)₂', togri: false },
      { matn: 'H₂SO₄, HCl, HNO₃', togri: false },
    ],
    izoh: 'Zn(OH)₂, Al(OH)₃, Be(OH)₂ kislota va ishqorda eriydi.',
  },
  {
    id: 't2',
    savol: 'Asos + kislota reaksiyasi mahsuloti:',
    variantlar: [
      { matn: 'Metall va H₂', togri: false },
      { matn: 'Asosli oksid va O₂', togri: false },
      { matn: 'Ikki yangi kislota', togri: false },
      { matn: 'Tuz va suv (neytrallanish)', togri: true },
    ],
    izoh: 'Asos + kislota → tuz + suv (neytrallanish).',
  },
  {
    id: 't3',
    savol: 'Zn(OH)₂ amfoterligini isbotlash reaktivlari:',
    variantlar: [
      { matn: 'Kislota (HCl) va ishqor (NaOH)', togri: true },
      { matn: 'Faqat toza suv', togri: false },
      { matn: 'NaCl va CH₄', togri: false },
      { matn: 'Osh tuzi va qum', togri: false },
    ],
    izoh: 'Ham HCl, ham NaOH da erib tuz hosil qiladi.',
  },
  {
    id: 't4',
    savol: 'Cu(OH)₂ ga mo\'l NaOH quyilsa nima bo\'ladi?',
    variantlar: [
      { matn: 'Cho\'kma qaynaydi', togri: false },
      { matn: 'Kupratga aylanadi', togri: false },
      { matn: 'Erimaydi (amfoter emas)', togri: true },
      { matn: 'Gaz ajraladi', togri: false },
    ],
    izoh: '1-Lab: Cu(OH)₂ oddiy asos — NaOH da erimaydi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'metall', nom: 'Metallar', tavsif: 'Asosli oksid / qattiq gidrid' },
    { id: 'amfoter', nom: 'Amfoterlar', tavsif: 'Ikki yoqlama xossali' },
    { id: 'metallmas', nom: 'Metallmaslar', tavsif: 'Kislotali / uchuvchan gidrid' },
  ],
  topshiriqlar: [
    { nom: 'Natriy (Na)', qisqa: 'Asosli Na₂O', guruh: 'metall', izoh: 'Tipik ishqoriy metall.' },
    { nom: 'Kalsiy (Ca)', qisqa: 'CaO → Ca(OH)₂', guruh: 'metall', izoh: 'Asosli birikmalar beradi.' },
    { nom: 'Simob (Hg)', qisqa: 'Suyuq metall', guruh: 'metall', izoh: 'Suyuq metall istisnosi.' },
    { nom: 'Rux (Zn)', qisqa: 'ZnO / Zn(OH)₂', guruh: 'amfoter', izoh: 'Kislota & ishqorga kirishadi.' },
    { nom: 'Alyuminiy (Al)', qisqa: 'Al₂O₃ / Al(OH)₃', guruh: 'amfoter', izoh: 'Amfoter element.' },
    { nom: 'Berilliy (Be)', qisqa: 'BeO / Be(OH)₂', guruh: 'amfoter', izoh: 'Amfoter gidroksid beradi.' },
    { nom: 'Oltingugurt (S)', qisqa: 'SO₂ → H₂SO₃', guruh: 'metallmas', izoh: 'Kislotali oksid beradi.' },
    { nom: 'Yod (I₂)', qisqa: 'Yaltiroq kristall', guruh: 'metallmas', izoh: 'Yaltiroq, lekin metallmas!' },
    { nom: 'Brom (Br₂)', qisqa: 'Suyuq metallmas', guruh: 'metallmas', izoh: 'Suyuq holatdagi metallmas.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Tarix',
    savol: 'XVIII asr oxiri va 1860-yillarda ma\'lum elementlar soni:',
    variantlar: ['~30 ta va 63 ta', '10 ta va 30 ta', '63 ta va 118 ta', '45 ta va 92 ta'],
    togri: 0,
    izoh: 'XVIII asr: ~30, XIX asr: 63, hozir: 118 ta.',
  },
  {
    belgi: 'Allomalar',
    savol: 'Ma\'danlarni sinflash asarlarini yozgan allomalar:',
    variantlar: ['Levkipp va Demokrit', 'Forobiy va Beruniy', 'Lomonosov va Pristli', 'Mendeleyev va Meyer'],
    togri: 1,
    izoh: 'VIII–XI asr: Farg\'oniy, Roziy, Forobiy, Beruniy, Ibn Sino.',
  },
  {
    belgi: 'Istisno',
    savol: 'Metallga o\'xshab yaltiraydigan metallmas:',
    variantlar: ['Simob (Hg)', 'Rux (Zn)', 'Yod (I₂)', 'Natriy (Na)'],
    togri: 2,
    izoh: 'I₂ yaltiroq, ammo galogen — metallmas.',
  },
  {
    belgi: 'Xrom',
    savol: 'Xromning qaysi oksidi amfoter xossali?',
    variantlar: ['CrO', 'CrO₃', 'Cr(OH)₆', 'Cr₂O₃'],
    togri: 3,
    izoh: 'CrO asosli, Cr₂O₃ amfoter, CrO₃ kislotali.',
  },
  {
    belgi: 'Amfoter',
    savol: 'Zn(OH)₂ + mo\'l NaOH dan qanday tuz olinadi?',
    variantlar: ['ZnCl₂', 'ZnSO₄', 'Na₂ZnO₂', 'NaZnO'],
    togri: 2,
    izoh: 'H₂ZnO₂ + 2NaOH = Na₂ZnO₂ + 2H₂O.',
  },
  {
    belgi: '5-mashq',
    savol: '0,1 mol Be(OH)₂ + mo\'l NaOH → Na₂BeO₂ massasi:',
    variantlar: ['8,7 g', '4,35 g', '17,4 g', '10,0 g'],
    togri: 0,
    izoh: 'M(Na₂BeO₂) = 87 g/mol → 0,1 · 87 = 8,7 g.',
  },
  {
    belgi: 'Suyuqlik',
    savol: 'Xona haroratida suyuq metall va metallmas jufti:',
    variantlar: ['Na va Cl₂', 'Al va S', 'Zn va I₂', 'Hg va Br₂'],
    togri: 3,
    izoh: 'Hg — suyuq metall, Br₂ — suyuq metallmas.',
  },
  {
    belgi: 'Gidrid',
    savol: 'Uchuvchan gidridlar (HCl, NH₃) hosil qiluvchi sinf:',
    variantlar: ['Ishqoriy metallar', 'Metallmaslar', 'Amfoter metallar', 'Nodir metallar'],
    togri: 1,
    izoh: 'Metallmaslar gaz/suyuq uchuvchan gidrid beradi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '1-jadval: Metall qatori',
    vazifa: 'Natriyning genetik qatorini tartiblang:',
    tartib: ['Na', 'Na₂O', 'NaOH', 'NaCl'],
    variantlar: ['NaOH', 'Na', 'NaCl', 'Na₂O'],
  },
  {
    tur: '1-jadval: Metallmas qatori',
    vazifa: 'Oltingugurtning genetik zanjirini tartiblang:',
    tartib: ['S', 'SO₂', 'H₂SO₃', 'Na₂SO₃'],
    variantlar: ['H₂SO₃', 'Na₂SO₃', 'S', 'SO₂'],
  },
  {
    tur: 'Xrom valentligi',
    vazifa: 'Xrom oksidlarini asoslidan kislotaligacha joylang:',
    tartib: ['CrO (asosli)', 'Cr₂O₃ (amfoter)', 'CrO₃ (kislotali)', 'H₂CrO₄ (kislota)'],
    variantlar: ['CrO₃ (kislotali)', 'CrO (asosli)', 'H₂CrO₄ (kislota)', 'Cr₂O₃ (amfoter)'],
  },
  {
    tur: 'Amfoter zanjir',
    vazifa: 'Ruxning amfoter zanjirini tartiblang:',
    tartib: ['Zn', 'ZnO', 'Zn(OH)₂', 'Na₂ZnO₂'],
    variantlar: ['Zn(OH)₂', 'Zn', 'Na₂ZnO₂', 'ZnO'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Hozir ma\'lum bo\'lgan jami kimyoviy elementlar soni:',
    variantlar: ['63 ta', '118 ta', '104 ta', '92 ta'],
    togri: 1,
    izoh: 'Bugungi kunda 118 ta element ma\'lum.',
  },
  {
    savol: 'Abu Bakr ar-Roziy qaysi g\'oyasi bilan mashhur?',
    variantlar: ['Oksidlanish nazariyasi', 'Davriy jadval', 'Yod kashfiyoti', 'Atomning bo\'linishi'],
    togri: 3,
    izoh: 'Ar-Roziy atom bo\'linishi haqida fikr bildirgan.',
  },
  {
    savol: 'Amfoter gidroksid hosil qiluvchi element:',
    variantlar: ['Be (berilliy)', 'K (kaliy)', 'S (oltingugurt)', 'Cl (xlor)'],
    togri: 0,
    izoh: 'Be(OH)₂, Zn(OH)₂, Al(OH)₃ — amfoter.',
  },
  {
    savol: 'Kislotali oksidlar qatori:',
    variantlar: ['Na₂O, CaO, CuO', 'ZnO, Al₂O₃, BeO', 'SO₂, CO₂, CrO₃', 'MgO, FeO, CrO'],
    togri: 2,
    izoh: 'SO₂, CO₂ va Cr(VI) oksidi CrO₃ kislotali.',
  },
  {
    savol: 'S → SO₂ → ? → Na₂SO₃ noma\'lum modda:',
    variantlar: ['H₂S', 'SO₃', 'NaOH', 'H₂SO₃'],
    togri: 3,
    izoh: 'SO₂ + H₂O = H₂SO₃ (sulfit kislota).',
  },
  {
    savol: 'Metallarga xos BO\'LMAGAN belgi:',
    variantlar: ['Elektr o\'tkazuvchanlik', 'Gazsimon holat', 'Yaltiroqlik', 'Bolg\'alanuvchanlik'],
    togri: 1,
    izoh: 'Metallar gaz bo\'lmaydi (Hg suyuq, qolgani qattiq).',
  },
  {
    savol: 'Zn(OH)₂ ning kislota shaklidagi formulasi:',
    variantlar: ['ZnO·H₂O', 'Zn₂OH', 'H₂ZnO₂', 'ZnH₂O₂'],
    togri: 2,
    izoh: 'Ishqor bilan H₂ZnO₂ (rux kislotasi) kabi kirishadi.',
  },
  {
    savol: '0,2 mol Zn(OH)₂ + NaOH → necha mol NaOH kerak?',
    variantlar: ['0,4 mol', '0,1 mol', '0,2 mol', '0,6 mol'],
    togri: 0,
    izoh: '1:2 nisbat: Zn(OH)₂ + 2NaOH → 0,4 mol.',
  },
];

export default function S8Mavzu3() {
  const korgazmalar = [
    { nom: '1. Tarix va allomalar', ikon: 'kitob', komponent: <KorgazmaTarix /> },
    { nom: '2. Metall va metallmas', ikon: 'kristall', komponent: <KorgazmaMetallMetallmas /> },
    { nom: '3. Genetik zanjir', ikon: 'formula', komponent: <KorgazmaGenetikZanjir /> },
    { nom: '4. Amfoter va 5-mashq', ikon: 'kolba', komponent: <KorgazmaAmfoter /> },
    { nom: '5. Xrom oksidlari', ikon: 'olov', komponent: <KorgazmaXrom /> },
    { nom: '6. Oksid sinovi', ikon: 'mikroskop', komponent: <KorgazmaLab /> },
  ];

  const oyinlar = [
    {
      nom: '1. Toifalash',
      ikon: 'kristall',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-3"
          nom="Moddalarni toifalash"
          ikon="kristall"
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
          key="tezkor-3"
          nom="3-§ tezkor savollar"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Genetik zanjir',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-3"
          nom="Genetik zanjir"
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
          key="duel-3"
          sarlavha="3-§ Jamoalar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="3-§"
      mavzuNom="Kimyoviy elementlarning dastlabki toifalanishi"
      oldingiRaqam="2-§"
      oldingiNom="Noorganik birikmalarning asosiy sinflari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
