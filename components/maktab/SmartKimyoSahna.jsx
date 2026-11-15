'use client';
// ============================================================
// JDA KIMYO - REUSABLE 60FPS ANIMATSIYA SAHNALARI ("KAM GAP, KO'P ANIMATSIYA")
// Smartboard 8-sinf ko'rgazmalari uchun umumiy dinamik Canvas sahnalar
// ============================================================

import { useState, useEffect, useRef } from 'react';
import {
  kadrSora,
  kadrniBekorQil,
  canvasOlchami,
} from '@/lib/maktab-animatsiya';
import { tovushChiqar } from '@/components/maktab/SmartDoskaYordamchi';
import {
  KorgazmaRamka,
  chizFonSetka,
  chizStakan,
  chizZarracha,
  chizTermometr,
} from '@/components/maktab/SmartOyinYordamchi';

function yumaloqKarta(ctx, x, y, w, h, stroke, fill = 'rgba(15, 23, 42, 0.88)', r = 12) {
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
  ctx.stroke();
}

function chizSarlavhaBoshi(ctx, w, sarlavha, tenglama) {
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 16px "Times New Roman", serif';
  if (sarlavha) ctx.fillText(sarlavha, 20, 28, w - 40);

  if (tenglama) {
    const bw = Math.min(w - 40, Math.max(220, ctx.measureText(tenglama).width + 36));
    yumaloqKarta(ctx, 20, 38, bw, 30, 'rgba(56, 189, 248, 0.55)', 'rgba(8, 20, 56, 0.92)', 9);
    ctx.fillStyle = '#e0f2fe';
    ctx.font = 'bold 14px "Times New Roman", serif';
    ctx.fillText(tenglama, 32, 58, bw - 24);
  }
}

function chizQisqaPillar(ctx, x, y, w, h, belgilar = []) {
  if (!belgilar.length) return;
  const count = belgilar.length;
  const pillH = Math.min(54, Math.max(38, (h - (count - 1) * 10) / count));
  belgilar.slice(0, 4).forEach((b, i) => {
    const py = y + i * (pillH + 10);
    const rang = b.rang || '#38bdf8';
    yumaloqKarta(ctx, x, py, w, pillH, rang, 'rgba(10, 19, 48, 0.9)', 11);

    ctx.fillStyle = rang;
    ctx.beginPath();
    ctx.arc(x + 14, py + pillH / 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px "Times New Roman", serif';
    ctx.fillText(String(b.k || ''), x + 26, py + 17, w - 36);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 14px "Times New Roman", serif';
    ctx.fillText(String(b.v || ''), x + 26, py + pillH - 11, w - 36);
  });
}

function chizOlov(ctx, cx, y, t, rang = '#f97316') {
  for (let i = 0; i < 3; i++) {
    const flick = Math.sin(t * 7 + i * 1.9) * 3.5;
    const h = 24 - i * 5 + Math.cos(t * 5 + i) * 3;
    const w = 15 - i * 4;
    ctx.fillStyle = i === 0 ? rang : i === 1 ? '#facc15' : '#fef9c3';
    ctx.beginPath();
    ctx.moveTo(cx - w, y);
    ctx.quadraticCurveTo(cx - w * 0.4, y - h * 0.6, cx + flick, y - h);
    ctx.quadraticCurveTo(cx + w * 0.4, y - h * 0.6, cx + w, y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = '#475569';
  ctx.fillRect(cx - 18, y, 36, 7);
}

function chizOqimNuqta(ctx, x1, y1, x2, y2, t, rang = '#38bdf8', son = 4) {
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.55)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  for (let i = 0; i < son; i++) {
    const p = ((t * 0.55 + i / son) % 1);
    const px = x1 + (x2 - x1) * p;
    const py = y1 + (y2 - y1) * p;
    ctx.fillStyle = rang;
    ctx.beginPath();
    ctx.arc(px, py, 4.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 1. REAKSIYA SAHNASI: Kolba/stakan, pufakcha, gaz buluti, cho'kma, alanga va elektron ko'chishi.
 */
export function chizReaksiyaSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const stX = cfg.ikkiIdish ? w * 0.08 : w * 0.14;
  const stY = 92;
  const stW = cfg.ikkiIdish ? 112 : 138;
  const stH = Math.min(182, h - (cfg.qizdir ? 148 : 118));
  const suyuqlikRang = cfg.suyuqlikRang || '#38bdf8';

  chizStakan(ctx, stX, stY, stW, stH, {
    suyuqlikRang,
    tolish: cfg.tolish || 0.62,
    yorliq: cfg.stakanBelgi || 'Eritma',
    sarlavha: cfg.qizdir ? 'Qizdirish' : cfg.stakanSarlavha || 'Reaksiya',
  });

  // Suyuqlik ichida suzuvchi ionlar / reagent zarrachalar
  const reagentlar = cfg.reagentlar || [];
  reagentlar.forEach((z, idx) => {
    const zx = stX + 20 + ((idx * 31 + Math.sin(t * 2 + idx) * 18 + stW - 44) % (stW - 38));
    const syTop = stY + stH * (1 - (cfg.tolish || 0.62)) + 16;
    const zy = syTop + ((idx * 23 + Math.cos(t * 1.7 + idx * 1.4) * 14 + stH * 0.45) % Math.max(24, stH * 0.45));
    chizZarracha(ctx, zx, zy, 10, z.rang || '#fde047', z.belgi || '');
  });

  // Cho'kma qatlam va tushuvchi kristallar
  if (cfg.chokmaRang) {
    const cRang = cfg.chokmaRang;
    for (let i = 0; i < 8; i++) {
      const f = ((t * 0.35 + i * 0.13) % 1);
      const px = stX + 18 + ((i * 19) % (stW - 36));
      const py = stY + stH * 0.48 + f * (stH * 0.44);
      ctx.fillStyle = cRang;
      ctx.beginPath();
      ctx.arc(px, py, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = cRang;
    ctx.beginPath();
    ctx.roundRect(stX + 8, stY + stH - 18, stW - 16, 13, 6);
    ctx.fill();
    if (cfg.chokmaBelgi) {
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.chokmaBelgi, stX + stW / 2, stY + stH - 8);
    }
  }

  // Ko'tariluvchi gaz pufakchalari va yuqoridagi gaz buluti
  if (cfg.gazRang) {
    const gRang = cfg.gazRang;
    for (let i = 0; i < 9; i++) {
      const p = ((t * 0.65 + i * 0.11) % 1);
      const bx = stX + 20 + ((i * 21) % (stW - 40)) + Math.sin(t * 4 + i) * 4;
      const by = stY + stH - 22 - p * (stH + 22);
      ctx.fillStyle = gRang;
      ctx.globalAlpha = 0.85 - p * 0.35;
      ctx.beginPath();
      ctx.arc(bx, by, 3.2 + (i % 3), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (cfg.gazBelgi) {
      ctx.fillStyle = gRang;
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(cfg.gazBelgi, stX + stW / 2, stY - 8 + Math.sin(t * 3) * 2);
    }
  }

  // Gorelka alangasi
  if (cfg.qizdir) {
    chizOlov(ctx, stX + stW / 2, stY + stH + 34, t, cfg.olovRang || '#f97316');
  }

  // Termometr
  if (typeof cfg.tempC === 'number') {
    chizTermometr(ctx, stX - 28, stY + 8, stH - 16, cfg.tempC, cfg.maxTemp || 300, '#ef4444');
  }

  // Ikkinchi idish + tutashtiruvchi gaz naychasi
  if (cfg.ikkiIdish) {
    const st2X = stX + stW + 54;
    const st2W = 112;
    const syTop = stY + 4;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(stX + stW / 2, syTop);
    ctx.lineTo(stX + stW / 2, syTop - 16);
    ctx.lineTo(st2X + st2W / 2, syTop - 16);
    ctx.lineTo(st2X + st2W / 2, stY + stH * 0.65);
    ctx.stroke();

    const gRang = cfg.gazRang || '#38bdf8';
    for (let i = 0; i < 6; i++) {
      const p = ((t * 0.5 + i / 6) % 1);
      const px = p < 0.7
        ? stX + stW / 2 + ((st2X + st2W / 2 - (stX + stW / 2)) * (p / 0.7))
        : st2X + st2W / 2;
      const py = p < 0.7 ? syTop - 16 : syTop - 16 + ((p - 0.7) / 0.3) * (stH * 0.68);
      ctx.fillStyle = gRang;
      ctx.beginPath();
      ctx.arc(px, py, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }

    chizStakan(ctx, st2X, stY, st2W, stH, {
      suyuqlikRang: cfg.ikkinchiSuyuqlikRang || '#34d399',
      tolish: 0.56,
      yorliq: cfg.ikkinchiBelgi || 'Mahsulot',
      sarlavha: cfg.ikkinchiSarlavha || 'Yig\'ish',
    });
  }

  // Elektron o'tish yoyi (OQR uchun)
  if (cfg.elektronJuft) {
    const ej = cfg.elektronJuft;
    const ey = stY + stH + 18;
    const x1 = stX + 12;
    const x2 = stX + stW - 12;
    chizZarracha(ctx, x1, ey, 14, '#f43f5e', ej.chap);
    chizZarracha(ctx, x2, ey, 14, '#34d399', ej.ong);
    const ep = ((t * 0.7) % 1);
    const ex = x1 + (x2 - x1) * ep;
    const eyArc = ey - Math.sin(ep * Math.PI) * 18;
    chizZarracha(ctx, ex, eyArc, 6, '#fde047', ej.e || 'ē');
  }

  const panelX = cfg.ikkiIdish ? w * 0.58 : w * 0.48;
  const panelW = w - panelX - 20;
  chizQisqaPillar(ctx, panelX, 82, panelW, h - 98, cfg.belgilar || []);
}

/**
 * 2. MOLEKULA, ATOM, KRISTALL PANJARA VA KIMYOVIY BOG' SAHNASI
 */
export function chizMolekulaSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const cx = w * 0.29;
  const cy = h * 0.56;
  const rejim = cfg.rejim || 'molekula';

  if (rejim === 'atom' && Array.isArray(cfg.qavatlar)) {
    const ranglar = ['#38bdf8', '#34d399', '#fbbf24', '#f472b6', '#a855f7'];
    cfg.qavatlar.forEach((cnt, idx) => {
      const rad = 28 + idx * 21;
      ctx.strokeStyle = ranglar[idx % ranglar.length];
      ctx.globalAlpha = idx === cfg.qavatlar.length - 1 ? 0.9 : 0.45;
      ctx.lineWidth = idx === cfg.qavatlar.length - 1 ? 2.4 : 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rad, rad * (0.72 + (idx % 2) * 0.22), Math.sin(t * 0.4 + idx) * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      const drawN = Math.min(cnt, 12);
      for (let i = 0; i < drawN; i++) {
        const ang = t * (0.85 - idx * 0.1) + (i * Math.PI * 2) / drawN;
        const ex = cx + Math.cos(ang) * rad;
        const ey = cy + Math.sin(ang) * rad * (0.72 + (idx % 2) * 0.22);
        chizZarracha(ctx, ex, ey, 3.8, ranglar[idx % ranglar.length], '');
      }
    });
    const m = cfg.markaz || { belgi: 'E', rang: '#ef4444' };
    chizZarracha(ctx, cx, cy, 17, m.rang || '#ef4444', m.zaryad || m.belgi);
  } else if (rejim === 'kristall') {
    const tur = cfg.kristallTuri || 'ion';
    const step = 36;
    const rot = Math.sin(t * 0.8) * 10;
    for (let gx = -1; gx <= 1; gx++) {
      for (let gy = -1; gy <= 1; gy++) {
        for (let gz = 0; gz <= 1; gz++) {
          const px = cx + gx * step + gz * (18 + rot * 0.4);
          const py = cy + gy * step - gz * 16 + Math.sin(t * 3 + gx + gy) * 1.8;
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
          ctx.lineWidth = 1.4;
          if (gx < 1) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + step, py);
            ctx.stroke();
          }
          if (gy < 1) {
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px, py + step);
            ctx.stroke();
          }
          const isAlt = (gx + gy + gz) % 2 === 0;
          const rCol = tur === 'metall' ? '#fbbf24' : tur === 'atom' ? '#a855f7' : isAlt ? '#38bdf8' : '#34d399';
          const lbl = tur === 'metall' ? 'M⁺' : tur === 'ion' ? (isAlt ? '+' : '−') : '';
          chizZarracha(ctx, px, py, gz ? 7 : 9.5, rCol, lbl);
        }
      }
    }
    if (tur === 'metall') {
      for (let i = 0; i < 8; i++) {
        const ex = cx + Math.cos(t * 2.2 + i) * 52;
        const ey = cy + Math.sin(t * 2.8 + i * 1.3) * 44;
        chizZarracha(ctx, ex, ey, 3.2, '#fde047', '');
      }
    }
  } else if (rejim === 'bog' && cfg.bogJuft) {
    const bj = cfg.bogJuft;
    const x1 = cx - 68;
    const x2 = cx + 68;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x1, cy);
    ctx.lineTo(x2, cy);
    ctx.stroke();
    chizZarracha(ctx, x1, cy, 26, bj.chapRang || '#38bdf8', bj.chap);
    chizZarracha(ctx, x2, cy, 26, bj.ongRang || '#34d399', bj.ong);
    const midX = (x1 + x2) / 2 + (bj.siljish || 0) * 32 + Math.sin(t * 4) * 4;
    chizZarracha(ctx, midX, cy - 8, 5, '#fde047', 'ē');
    chizZarracha(ctx, midX, cy + 8, 5, '#fde047', 'ē');
  } else {
    // 3D-aylanuvchi molekula
    const m = cfg.markaz || { belgi: 'X', rang: '#a855f7', r: 24 };
    const atomlar = cfg.atomlar || [];
    atomlar.forEach((a, i) => {
      const ang = (a.burchak !== undefined ? a.burchak : (i * Math.PI * 2) / Math.max(1, atomlar.length)) + t * 0.55;
      const dist = a.masofa || 78;
      const ax = cx + Math.cos(ang) * dist;
      const ay = cy + Math.sin(ang) * dist * 0.78;
      const bog = a.bog || 1;
      for (let b = 0; b < bog; b++) {
        const off = (b - (bog - 1) / 2) * 5;
        ctx.strokeStyle = a.rang || '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy + off);
        ctx.lineTo(ax, ay + off);
        ctx.stroke();
      }
      chizZarracha(ctx, ax, ay, a.r || 15, a.rang || '#38bdf8', a.belgi || '');
    });
    chizZarracha(ctx, cx, cy, m.r || 24, m.rang || '#a855f7', m.belgi);
  }

  // O'ng taraf: progress barlar + qisqa pillar
  const rx = w * 0.52;
  const rw = w - rx - 20;
  let py = 82;
  (cfg.metrikalar || []).slice(0, 3).forEach((m) => {
    yumaloqKarta(ctx, rx, py, rw, 36, m.rang || '#38bdf8', 'rgba(10, 19, 48, 0.85)', 8);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px "Times New Roman", serif';
    ctx.textAlign = 'left';
    ctx.fillText(m.nom, rx + 10, py + 14, rw - 72);
    ctx.textAlign = 'right';
    ctx.fillStyle = m.rang || '#fde047';
    ctx.fillText(String(m.qiymat || ''), rx + rw - 10, py + 14);
    const barW = ((rw - 20) * Math.min(100, Math.max(8, m.foiz || 50))) / 100;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.fillRect(rx + 10, py + 21, rw - 20, 7);
    ctx.fillStyle = m.rang || '#38bdf8';
    ctx.fillRect(rx + 10, py + 21, barW, 7);
    py += 44;
  });

  chizQisqaPillar(ctx, rx, py + 2, rw, h - py - 16, cfg.belgilar || []);
}

/**
 * 3. SANOAT REAKTORLARI VA TEXNOLOGIK OQIM SAHNASI
 */
export function chizSanoatMinoraSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const bosqichlar = cfg.bosqichlar || [];
  const count = Math.max(1, bosqichlar.length);
  const gap = 28;
  const totalW = w - 40;
  const boxW = Math.min(165, (totalW - (count - 1) * gap) / count);
  const startX = (w - (count * boxW + (count - 1) * gap)) / 2;
  const boxY = 86;
  const boxH = Math.min(162, h - 166);

  bosqichlar.forEach((b, i) => {
    const bx = startX + i * (boxW + gap);
    const rang = b.rang || '#38bdf8';
    if (i < count - 1) {
      chizOqimNuqta(ctx, bx + boxW, boxY + boxH / 2, bx + boxW + gap, boxY + boxH / 2, t, rang, 3);
    }

    yumaloqKarta(ctx, bx, boxY, boxW, boxH, rang, 'rgba(11, 22, 52, 0.94)', 14);

    // Sarlavha va tag yorliq
    ctx.textAlign = 'center';
    ctx.fillStyle = rang;
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.fillText(b.nom, bx + boxW / 2, boxY + 20, boxW - 12);

    // Ichki jonli animatsiya
    const cx = bx + boxW / 2;
    const cy = boxY + boxH * 0.54;
    if (b.tur === 'pech') {
      chizOlov(ctx, cx, cy + 28, t, '#f97316');
    } else if (b.tur === 'kataliz') {
      for (let r = -1; r <= 1; r++) {
        ctx.strokeStyle = Math.sin(t * 4 + r) > 0 ? '#fde047' : rang;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx + 18, cy + r * 14);
        ctx.lineTo(bx + boxW - 18, cy + r * 14);
        ctx.stroke();
      }
    } else if (b.tur === 'elektroliz') {
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(cx - 26, cy - 22, 7, 44);
      ctx.fillStyle = '#34d399';
      ctx.fillRect(cx + 19, cy - 22, 7, 44);
      for (let k = 0; k < 4; k++) {
        const p = ((t * 0.8 + k * 0.25) % 1);
        ctx.fillStyle = k % 2 === 0 ? '#a3e635' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(k % 2 === 0 ? cx - 15 : cx + 15, cy + 20 - p * 40, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Minora / yutgich: tushayotgan tomchilar
      for (let k = 0; k < 5; k++) {
        const p = ((t * 0.7 + k * 0.2) % 1);
        ctx.fillStyle = rang;
        ctx.beginPath();
        ctx.arc(bx + 26 + k * ((boxW - 52) / 4), cy - 24 + p * 46, 3.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.fillText(b.ichi || '', cx, boxY + boxH - 28, boxW - 12);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.fillText(b.mahsulot || '', cx, boxY + boxH - 10, boxW - 12);
  });

  // Pastki ixcham faktlar qatori
  const belgilar = cfg.belgilar || [];
  if (belgilar.length) {
    const pw = (w - 40 - (belgilar.length - 1) * 10) / belgilar.length;
    belgilar.slice(0, 3).forEach((b, i) => {
      const px = 20 + i * (pw + 10);
      yumaloqKarta(ctx, px, h - 58, pw, 44, b.rang || '#38bdf8', 'rgba(10, 19, 48, 0.92)', 10);
      ctx.textAlign = 'center';
      ctx.fillStyle = b.rang || '#38bdf8';
      ctx.font = 'bold 11px "Times New Roman", serif';
      ctx.fillText(String(b.k || ''), px + pw / 2, h - 41, pw - 12);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(String(b.v || ''), px + pw / 2, h - 22, pw - 12);
    });
  }
}

/**
 * 4. MUVOZANAT, KINETIKA, pH VA DAVRIY GRAFIKLAR SAHNASI
 */
export function chizMuvozanatKinetikaSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const turi = cfg.turi || 'muvozanat';
  const lx = 20;
  const ly = 82;
  const lw = w * 0.48;
  const lh = h - 98;

  if (turi === 'ustunlar' && Array.isArray(cfg.ustunlar)) {
    yumaloqKarta(ctx, lx, ly, w - 40, lh, '#334155', 'rgba(8, 17, 44, 0.85)', 14);
    const items = cfg.ustunlar;
    const maxV = Math.max(...items.map((x) => Number(x.qiymat) || 1), 1);
    const uw = (w - 84) / items.length;
    items.forEach((u, idx) => {
      const ratio = (Number(u.qiymat) || 0) / maxV;
      const barMaxH = lh - 72;
      const bh = Math.max(12, barMaxH * ratio * (0.92 + Math.sin(t * 2.5 + idx) * 0.04));
      const bx = 42 + idx * uw + uw * 0.18;
      const bw = uw * 0.64;
      const by = ly + lh - 32 - bh;

      ctx.fillStyle = u.rang || '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, bh, [8, 8, 2, 2]);
      ctx.fill();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(u.yorliq || String(u.qiymat), bx + bw / 2, by - 7, uw - 6);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px "Times New Roman", serif';
      ctx.fillText(u.nom, bx + bw / 2, ly + lh - 12, uw - 4);
    });
    return;
  }

  if (turi === 'ph') {
    const phVal = Math.max(0, Math.min(14, Number(cfg.ph || 7)));
    yumaloqKarta(ctx, lx, ly, lw, lh, '#38bdf8', 'rgba(8, 17, 44, 0.88)', 14);
    const barX = lx + 18;
    const barW = lw - 36;
    const grad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    grad.addColorStop(0, '#ef4444');
    grad.addColorStop(0.5, '#22c55e');
    grad.addColorStop(1, '#6366f1');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX, ly + 42, barW, 28, 8);
    ctx.fill();

    const indX = barX + (phVal / 14) * barW;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(indX, ly + 36);
    ctx.lineTo(indX - 7, ly + 22);
    ctx.lineTo(indX + 7, ly + 22);
    ctx.closePath();
    ctx.fill();
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`pH = ${phVal}`, indX, ly + 92);

    // Ionlar harakati
    const ionRang = phVal < 6.5 ? '#fb7185' : phVal > 7.5 ? '#38bdf8' : '#34d399';
    const ionTxt = phVal < 6.5 ? 'H⁺' : phVal > 7.5 ? 'OH⁻' : 'H₂O';
    for (let i = 0; i < 10; i++) {
      const ix = barX + 18 + ((i * 41 + Math.sin(t * 2 + i) * 18 + barW - 36) % Math.max(40, barW - 36));
      const iy = ly + 116 + Math.abs(Math.cos(t * 1.8 + i * 1.3)) * (lh - 140);
      chizZarracha(ctx, ix, iy, 11, ionRang, ionTxt);
    }
  } else {
    // Jonli to'qnashuv kamerasi + pastda dinamik muvozanat/kinetika egri chizig'i
    yumaloqKarta(ctx, lx, ly, lw, lh, cfg.rang || '#38bdf8', 'rgba(8, 17, 44, 0.9)', 14);
    const speed = cfg.tezlik || 2.2;
    const chamH = lh * 0.56;
    const count = 10;
    for (let i = 0; i < count; i++) {
      const px = lx + 20 + ((i * 37 + Math.sin(t * speed + i * 1.7) * (lw * 0.32) + lw * 0.42) % (lw - 40));
      const py = ly + 28 + ((i * 29 + Math.cos(t * speed * 0.9 + i * 2.1) * (chamH * 0.34) + chamH * 0.42) % Math.max(32, chamH - 36));
      chizZarracha(ctx, px, py, 6.5, i % 2 === 0 ? '#38bdf8' : '#34d399', i % 2 === 0 ? 'A' : 'B');
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 12px "Times New Roman", serif';
    ctx.fillText(cfg.kameraNom || 'Zarrachalar harakati', lx + lw / 2, ly + 19, lw - 16);

    // Kinetika / Muvozanat egri chiziqlari (pastki qismda)
    const gx = lx + 18;
    const gy = ly + chamH + 10;
    const gw = lw - 36;
    const gh = Math.max(46, lh - chamH - 22);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + gh);
    ctx.lineTo(gx + gw, gy + gh);
    ctx.stroke();

    const silj = cfg.siljish === 'ong' ? -0.22 : cfg.siljish === 'chap' ? 0.22 : 0;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let k = 0; k <= 30; k++) {
      const p = k / 30;
      const vx = gx + p * gw;
      const vy = gy + gh * (0.2 + 0.35 * (1 - Math.exp(-p * 3.5)) + silj * 0.35);
      if (k === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.stroke();

    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let k = 0; k <= 30; k++) {
      const p = k / 30;
      const vx = gx + p * gw;
      const vy = gy + gh * (0.88 - 0.33 * (1 - Math.exp(-p * 3.5)) - silj * 0.35);
      if (k === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.stroke();

    const dotP = (t * 0.35) % 1;
    const dotX = gx + dotP * gw;
    const dotY = gy + gh * (0.55 - silj * 0.1);
    chizZarracha(ctx, dotX, dotY, 4.5, '#fde047', '');
  }

  // O'ng taraf: qisqa pillar + grafik chizig'i
  const rx = lx + lw + 14;
  const rw = w - rx - 20;
  chizQisqaPillar(ctx, rx, ly, rw, lh, cfg.belgilar || []);
}

/**
 * 5. HISOBLASH KONVEYERI VA NISBAT STOLBIKLARI SAHNASI
 */
export function chizHisobKonveyerSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const qadamlar = cfg.qadamlar || [];
  const count = Math.max(1, qadamlar.length);
  const gap = 22;
  const qW = Math.min(200, (w - 40 - (count - 1) * gap) / count);
  const startX = (w - (count * qW + (count - 1) * gap)) / 2;
  const qY = 86;
  const qH = 92;

  qadamlar.forEach((q, i) => {
    const x = startX + i * (qW + gap);
    const rang = q.rang || '#38bdf8';
    const pulse = Math.sin(t * 3 - i * 1.2) > 0.35;
    if (i < count - 1) {
      chizOqimNuqta(ctx, x + qW, qY + qH / 2, x + qW + gap, qY + qH / 2, t, rang, 3);
    }
    yumaloqKarta(ctx, x, qY, qW, qH, pulse ? '#fde047' : rang, 'rgba(11, 22, 52, 0.92)', 13);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px "Times New Roman", serif';
    ctx.fillText(q.belgi || '', x + qW / 2, qY + 26, qW - 12);

    ctx.fillStyle = rang;
    ctx.font = 'bold 16px "Times New Roman", serif';
    ctx.fillText(q.natija || '', x + qW / 2, qY + 58, qW - 12);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px "Times New Roman", serif';
    ctx.fillText(q.izoh || '', x + qW / 2, qY + 80, qW - 12);
  });

  // Nisbat / ulush animatsion o'lchagichlari
  const bars = cfg.taqqosBars || [];
  let by = 194;
  bars.slice(0, 3).forEach((b, i) => {
    const fillRatio = Math.min(1, Math.max(0.05, (Number(b.foiz) || 50) / 100));
    const animW = (w - 190) * fillRatio * (0.94 + Math.sin(t * 2.5 + i) * 0.04);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 13px "Times New Roman", serif';
    ctx.fillText(b.nom || '', 24, by + 16, 145);

    ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
    ctx.beginPath();
    ctx.roundRect(172, by + 3, w - 265, 16, 8);
    ctx.fill();

    ctx.fillStyle = b.rang || '#34d399';
    ctx.beginPath();
    ctx.roundRect(172, by + 3, Math.max(12, animW), 16, 8);
    ctx.fill();

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fde047';
    ctx.fillText(b.qiymat || `${b.foiz}%`, w - 24, by + 16);
    by += 28;
  });

  if (cfg.javobBadge) {
    yumaloqKarta(ctx, 24, h - 46, w - 48, 34, '#34d399', 'rgba(16, 185, 129, 0.18)', 10);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 15px "Times New Roman", serif';
    ctx.fillText(cfg.javobBadge, w / 2, h - 24, w - 68);
  }
}

/**
 * 6. BIOGEN SIKLLAR, NPK VA TIZIMLI BOG'LANISH HALQASI SAHNASI
 */
export function chizBiogenSikllarSahna(ctx, w, h, t, cfg = {}) {
  chizFonSetka(ctx, w, h);
  chizSarlavhaBoshi(ctx, w, cfg.sarlavha, cfg.tenglama);

  const cx = w * 0.31;
  const cy = h * 0.57;
  const rad = Math.min(w * 0.21, h * 0.31, 96);
  const tugunlar = cfg.tugunlar || [];

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.32)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, Math.PI * 2);
  ctx.stroke();

  // Halqa bo'ylab yuguruvchi zarracha
  for (let p = 0; p < 3; p++) {
    const a = t * 0.9 + (p * Math.PI * 2) / 3;
    chizZarracha(ctx, cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 5, '#fde047', '');
  }

  tugunlar.forEach((tg, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI * 2) / Math.max(1, tugunlar.length);
    const nx = cx + Math.cos(ang) * rad;
    const ny = cy + Math.sin(ang) * rad;
    chizZarracha(ctx, nx, ny, 20, tg.rang || '#34d399', tg.belgi || '');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 11px "Times New Roman", serif';
    ctx.fillText(tg.nom || '', nx, ny + 32, 95);
  });

  chizZarracha(ctx, cx, cy, 26, cfg.markazRang || '#a855f7', cfg.markazBelgi || 'Sikl');

  const rx = w * 0.56;
  const rw = w - rx - 20;
  chizQisqaPillar(ctx, rx, 82, rw, h - 98, cfg.belgilar || []);
}

const SAHNA_XARITA = {
  reaksiya: chizReaksiyaSahna,
  molekula: chizMolekulaSahna,
  sanoat: chizSanoatMinoraSahna,
  muvozanat: chizMuvozanatKinetikaSahna,
  hisob: chizHisobKonveyerSahna,
  biogen: chizBiogenSikllarSahna,
};

/**
 * 60fps Canvas komponenti: berilgan sahna turi va konfiguratsiyani uzluksiz chizadi.
 */
export function SahnaCanvas({ tur = 'reaksiya', cfg = {}, className = 'w-full h-full block' }) {
  const canvasRef = useRef(null);
  const holatRef = useRef({ tur, cfg });

  useEffect(() => {
    holatRef.current = { tur, cfg };
  }, [tur, cfg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let kadr;
    let t = 0;

    const chiz = () => {
      t += 0.03;
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      const { tur: faolTur, cfg: faolCfg } = holatRef.current;
      const chizuvchi = SAHNA_XARITA[faolTur] || chizReaksiyaSahna;
      chizuvchi(ctx, w, h, t, faolCfg);
      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, []);

  return <canvas ref={canvasRef} className={className} />;
}

/**
 * Interaktiv ko'p-variantli ko'rgazma komponenti:
 * tugmalar orqali turli kimyoviy holat/misollar orasida almashadi.
 */
export function InteraktivSahnaKorgazma({ sarlavha, ikon = 'atom', variantlar = [] }) {
  const [faolId, setFaolId] = useState(variantlar[0]?.id || '');
  const faol = variantlar.find((v) => v.id === faolId) || variantlar[0];
  if (!faol) return null;

  return (
    <KorgazmaRamka
      sarlavha={sarlavha}
      qisqaFormula={faol.formula}
      ikon={ikon}
      boshqaruv={
        variantlar.length > 1 ? (
          <>
            {variantlar.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setFaolId(v.id);
                  tovushChiqar('bosish');
                }}
                className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold border transition ${
                  faol.id === v.id
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
                }`}
              >
                {v.tugma}
              </button>
            ))}
          </>
        ) : null
      }
      pastkiKorinish={
        <>
          {(faol.pastki || []).map((matn, idx) => (
            <div
              key={`${faol.id}-${idx}`}
              className={`p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold ${
                idx === 0 ? 'text-sky-300' : idx === 1 ? 'text-amber-300' : 'text-emerald-300'
              }`}
            >
              {matn}
            </div>
          ))}
        </>
      }
    >
      <SahnaCanvas tur={faol.tur || 'reaksiya'} cfg={faol.cfg || {}} />
    </KorgazmaRamka>
  );
}
