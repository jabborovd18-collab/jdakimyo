'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 15-PARAGRAF
// "Kimyoviy bog'lanish turlari. Qutbli va qutbsiz kovalent bog'lanish"
// (+ Donor-akseptor bog'lanish, Darslik 66-71-betlar)
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
   1-KO'RGAZMA: NEM FARQIGA KO'RA 3 GURUH VA BOG'LANISH TURLARI (66-67-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaUchGuruhBoglanish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Bog'lanishning 3 asosiy guruhi (66–67-b)"
      ikon="atom"
      variantlar={[
        {
          id: 'qutbsiz',
          tugma: '1. Bir xil NEM (ΔEM=0)',
          formula: 'H₂, F₂, Cl₂, Br₂, I₂, O₂, N₂ (qutbsiz) • Metallar (metall bog\')',
          tur: 'molekula',
          cfg: {
            sarlavha: '1-guruh: ΔEM = 0 — qutbsiz kovalent va metall bog\'',
            tenglama: 'Cl (3,16) — Cl (3,16) • Umumiy elektron juft markazda',
            rejim: 'bog',
            bogJuft: { chap: 'Cl', chapRang: '#38bdf8', ong: 'Cl', ongRang: '#38bdf8', siljish: 0 },
            metrikalar: [
              { nom: 'EM farqi (ΔEM)', qiymat: '0', foiz: 8, rang: '#38bdf8' },
              { nom: 'Simmetriya', qiymat: '100% teng', foiz: 100, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Oddiy modda', v: 'H₂, Cl₂, O₂, N₂', rang: '#38bdf8' },
              { k: 'Metallar', v: 'Li..Zn (metall)', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'Qutbsiz: H₂, Cl₂, O₂, N₂, Br₂, I₂',
            'Umumiy juft hech qayerga siljimaydi',
            'Metallar orasida metall bog\'lanish',
          ],
        },
        {
          id: 'qutbli',
          tugma: '2. Kichik NEM farqi',
          formula: 'Har xil metalmaslar → qutbli kovalent bog\' (juft siljiydi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '2-guruh: kichik NEM farqi — qutbli kovalent bog\'',
            tenglama: 'δ⁺H (2,20) → Clδ⁻ (3,16) • HCl, H₂O, NH₃, H₂S, CH₄',
            rejim: 'bog',
            bogJuft: { chap: 'H δ⁺', chapRang: '#38bdf8', ong: 'Cl δ⁻', ongRang: '#34d399', siljish: 0.55 },
            metrikalar: [
              { nom: 'NEM (H)', qiymat: '2,20', foiz: 55, rang: '#38bdf8' },
              { nom: 'NEM (Cl)', qiymat: '3,16', foiz: 79, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Qutb', v: 'δ⁺ va δ⁻', rang: '#fbbf24' },
              { k: 'Misollar', v: 'HCl, H₂O, NH₃', rang: '#34d399' },
            ],
          },
          pastki: [
            'Qutbli: HCl, H₂O, NH₃, H₂S, CH₄, PCl₃',
            'Juft katta NEM atomiga siljiydi',
            'To\'liq ionlar emas, qisman δ⁺/δ⁻',
          ],
        },
        {
          id: 'ionli',
          tugma: '3. Keskin NEM farqi',
          formula: 'Metall + faol metalmas → ionli bog\' (NaCl, K₂S, CaF₂, MgO)',
          tur: 'molekula',
          cfg: {
            sarlavha: '3-guruh: keskin NEM farqi — ionli bog\'lanish',
            tenglama: 'Na (0,93) → Cl (3,16): ē to\'liq o\'tib Na⁺ va Cl⁻ beradi',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'EM farqi (ΔEM)', qiymat: '> 2,0 keskin', foiz: 95, rang: '#f472b6' },
              { nom: 'Tuzilish', qiymat: 'Ion kristall', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Kation (+)', v: 'Metall (Na⁺)', rang: '#38bdf8' },
              { k: 'Anion (-)', v: 'Metalmas (Cl⁻)', rang: '#f472b6' },
              { k: 'Misollar', v: 'NaCl, K₂S, MgO', rang: '#34d399' },
            ],
          },
          pastki: [
            'Ionli: NaCl, K₂S, BaCl₂, CaF₂, MgO',
            'Elektron bir atomdan ikkinchisiga o\'tadi',
            'Qarama-qarshi ionlar tortiladi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: H₂, O₂, N₂ KOVALENT BOG'LANISH MEXANIZMI (67-68-BET)
═══════════════════════════════════════════════════════════════ */
const MOLEKULA_JUFTLARI = {
  H2: {
    formula: 'H₂ (Vodorod)',
    juft: 1,
    tenglama: 'H·  +  ·H   →   H : H   (H — H)',
    valent: 'I valentli (1 ta umumiy elektron juft = 1 ta yakka σ-bog\')',
    erkin: 0,
    izoh: '2 ta H ning 1s¹ toq elektronlari juftlashib, 1s² qobiq beradi.',
  },
  O2: {
    formula: 'O₂ (Kislorod)',
    juft: 2,
    tenglama: ':Ö·  +  ·Ö:   →   :O :: O:   (O = O)',
    valent: 'II valentli (2 ta umumiy elektron juft = qo\'sh bog\')',
    erkin: 2,
    izoh: 'O ning 2p⁴ dagi 2 tadan toq elektroni juftlashib O=O beradi.',
  },
  N2: {
    formula: 'N₂ (Azot)',
    juft: 3,
    tenglama: ':N⋮  +  ⋮N:   →   :N ⋮⋮ N:   (N ≡ N)',
    valent: 'III valentli (3 ta umumiy elektron juft = uchbog\')',
    erkin: 1,
    izoh: 'N ning 2p³ dagi 3 toq elektroni mustahkam N≡N uchbog\' beradi.',
  },
};

function KorgazmaKovalentJuftlar() {
  const canvasRef = useRef(null);
  const [mol, setMol] = useState('O2');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = MOLEKULA_JUFTLARI[mol];
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
      ctx.fillText(`67-68-bet: ${faol.formula} molekulasida kovalent bog' hosil bo'lishi`, 24, 34);

      const cx1 = w * 0.36;
      const cx2 = w * 0.64;
      const cy = h * 0.44;
      const belgi = mol === 'H2' ? 'H' : mol === 'O2' ? 'O' : 'N';

      // Qoplangan elektron bulutlari
      ctx.fillStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx1, cy, 68, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(52, 211, 153, 0.14)';
      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(cx2, cy, 68, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Umumiy elektron juftlar markazda
      for (let j = 0; j < faol.juft; j++) {
        const yOff = (j - (faol.juft - 1) / 2) * 26;
        const xJit = Math.sin(t * 2 + j) * 3;
        chizZarracha(ctx, w * 0.50 - 9 + xJit, cy + yOff, 6, '#fde047', '');
        chizZarracha(ctx, w * 0.50 + 9 - xJit, cy + yOff, 6, '#fde047', '');
      }

      chizZarracha(ctx, cx1 - 24, cy, 24, '#38bdf8', belgi);
      chizZarracha(ctx, cx2 + 24, cy, 24, '#34d399', belgi);

      // Pastki formula qutisi
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      ctx.roundRect(28, h - 108, w - 56, 82, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.tenglama, w / 2, h - 80);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 13px "Times New Roman", serif';
      ctx.fillText(faol.valent, w / 2, h - 58);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.izoh, w / 2, h - 36, w - 88);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [mol]);

  return (
    <KorgazmaRamka
      sarlavha="2. Umumiy elektron juftlar: H₂, O₂, N₂ (67–68-b)"
      qisqaFormula="H—H (1 juft, I val) • O=O (2 juft, II val) • N≡N (3 juft, III val)"
      ikon="formula"
      boshqaruv={
        <>
          {Object.entries(MOLEKULA_JUFTLARI).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setMol(k);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-sm font-bold border transition ${
                mol === k
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
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-sky-300">
            Umumiy juftlar soni = Kovalentlik (valentlik)
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            N≡N bog&apos;i 3 ta juft tufayli juda mustahkam
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            O=O va N≡N — qutbsiz kovalent bog&apos;lar
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: QUTBSIZ VA QUTBLI KOVALENT BOG'LANISH (68-69-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaQutbsizVaQutbli() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Qutbsiz va qutbli kovalent bog'lanish (68–69-b)"
      ikon="magnit"
      variantlar={[
        {
          id: 'qutbli',
          tugma: 'Qutbli (HCl)',
          formula: 'H (2,20) → Cl (3,16): dipol δ⁺H—Clδ⁻',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Qutbli kovalent bog\' (HCl): juft Xlor tomonga siljigan',
            tenglama: 'δ⁺ H  →  Cl δ⁻   (NEM: H = 2,20 < Cl = 3,16)',
            rejim: 'bog',
            bogJuft: { chap: 'H δ⁺', chapRang: '#38bdf8', ong: 'Cl δ⁻', ongRang: '#f472b6', siljish: 0.55 },
            metrikalar: [
              { nom: 'NEM (H)', qiymat: '2,20 (δ⁺)', foiz: 55, rang: '#38bdf8' },
              { nom: 'NEM (Cl)', qiymat: '3,16 (δ⁻)', foiz: 79, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'Molekula', v: 'Dipol (2 qutb)', rang: '#fbbf24' },
              { k: 'Bulut', v: 'Cl ga siljigan', rang: '#f472b6' },
            ],
          },
          pastki: [
            'δ⁺ / δ⁻ — qisman zaryadlar',
            'Dipol — ikki qutbli molekula (HCl)',
            'Elektron bulut katta NEM tomon siljiydi',
          ],
        },
        {
          id: 'qutbsiz',
          tugma: 'Qutbsiz (Cl₂, H₂)',
          formula: 'Cl (3,16) — Cl (3,16): ΔEM = 0 • simmetrik juft',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Qutbsiz kovalent bog\' (Cl₂, H₂): simmetrik elektron bulut',
            tenglama: 'Cl (3,16) — Cl (3,16) • ΔEM = 0 (qutblar yo\'q)',
            rejim: 'bog',
            bogJuft: { chap: 'Cl', chapRang: '#38bdf8', ong: 'Cl', ongRang: '#38bdf8', siljish: 0 },
            metrikalar: [
              { nom: 'EM farqi', qiymat: 'ΔEM = 0', foiz: 5, rang: '#38bdf8' },
              { nom: 'Taqsimot', qiymat: 'Simmetrik', foiz: 100, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Zaryad', v: 'Qutbsiz (0)', rang: '#34d399' },
              { k: 'Misollar', v: 'H₂, Cl₂, O₂, N₂', rang: '#38bdf8' },
            ],
          },
          pastki: [
            'Bir xil element atomlari orasida',
            'Umumiy juft ikkala yadrodan teng uzoqda',
            'Qisman zaryad hosil bo\'lmaydi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: 71-BET 5-MASHQ — Cl₂, HF, H₂S, PH₃ TAHLILI
═══════════════════════════════════════════════════════════════ */
function KorgazmaMashq5Molekulalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 71-bet 5-mashq: Cl₂, HF, H₂S, PH₃ tahlili"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'HF',
          tugma: 'HF',
          formula: 'HF: kuchli qutbli kovalent (H 2,20 → F 4,00, ΔEM = 1,80)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'HF: H : F: (H → F) — eng kuchli qutbli bog\'',
            tenglama: 'H (2,20) → F (4,00) • ΔEM = 1,80',
            rejim: 'bog',
            bogJuft: { chap: 'H δ⁺', chapRang: '#38bdf8', ong: 'F δ⁻', ongRang: '#a855f7', siljish: 0.72 },
            metrikalar: [
              { nom: 'ΔEM farqi', qiymat: '1,80 (yuqori)', foiz: 90, rang: '#a855f7' },
              { nom: 'Bog\' juft', qiymat: '1 ta (H—F)', foiz: 33, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Nuqtali', v: 'H : F:', rang: '#fde047' },
              { k: 'F da erkin', v: '3 juft', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Eng qutblisi: HF (ΔEM = 1,80)',
            'Elektron juft F (4,00) ga tortilgan',
            'H δ⁺ — F δ⁻ kuchli dipol',
          ],
        },
        {
          id: 'Cl2',
          tugma: 'Cl₂',
          formula: 'Cl₂ (:Cl : Cl:) — qutbsiz kovalent bog\' (ΔEM = 0)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Cl₂: Cl — Cl (:Cl : Cl:) — qutbsiz kovalent',
            tenglama: 'Cl (3,16) — Cl (3,16) • Siljish yo\'q (ΔEM = 0)',
            rejim: 'bog',
            bogJuft: { chap: 'Cl', chapRang: '#38bdf8', ong: 'Cl', ongRang: '#38bdf8', siljish: 0 },
            metrikalar: [
              { nom: 'ΔEM farqi', qiymat: '0', foiz: 5, rang: '#38bdf8' },
              { nom: 'Erkin juftlar', qiymat: '3 + 3 = 6 ta', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Nuqtali', v: ':Cl : Cl:', rang: '#38bdf8' },
              { k: 'Qutblilik', v: 'Qutbsiz', rang: '#34d399' },
            ],
          },
          pastki: [
            'Eng qutbsizi: Cl₂ (ΔEM = 0)',
            '1 ta bog\'lovchi juft (yakka bog\')',
            'Har bir Cl da 3 tadan erkin juft',
          ],
        },
        {
          id: 'H2S',
          tugma: 'H₂S',
          formula: 'H₂S (H → S ← H): qutbli kovalent (H 2,20 → S 2,58, ΔEM=0,38)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'H₂S: burchakli tuzilish, 2 bog\' + 2 erkin juft',
            tenglama: 'H : S : H (S = 2,58 > H = 2,20 → juft S ga siljiydi)',
            markaz: { belgi: 'S δ⁻', rang: '#34d399', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.45, masofa: 76, bog: 1, rang: '#38bdf8', r: 15 },
              { belgi: 'H', burchak: 2.25, masofa: 76, bog: 1, rang: '#38bdf8', r: 15 },
            ],
            metrikalar: [
              { nom: 'ΔEM farqi', qiymat: '0,38 (qutbli)', foiz: 35, rang: '#34d399' },
              { nom: 'Erkin juft (S)', qiymat: '2 ta juft', foiz: 66, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Tuzilish', v: 'Burchakli', rang: '#34d399' },
              { k: 'S da erkin', v: '2 ta juft', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'H₂S da S da 2 ta erkin juft bor',
            'Juftlar H (2,20) dan S (2,58) ga siljiydi',
            'Burchakli qutbli molekula',
          ],
        },
        {
          id: 'PH3',
          tugma: 'PH₃',
          formula: 'PH₃: deyarli qutbsiz kovalent (P 2,19 ≈ H 2,20, ΔEM = 0,01)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'PH₃: P (2,19) va H (2,20) — deyarli qutbsiz bog\'',
            tenglama: 'H : P(H) : H • NEM deyarli teng (ΔEM = 0,01)',
            markaz: { belgi: 'P', rang: '#fbbf24', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.4, masofa: 76, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 2.4, masofa: 76, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 4.5, masofa: 76, bog: 1, rang: '#38bdf8', r: 14 },
            ],
            metrikalar: [
              { nom: 'ΔEM (H-P)', qiymat: '0,01 (~0)', foiz: 10, rang: '#fbbf24' },
              { nom: 'Bog\' juft', qiymat: '3 ta (1 erkin)', foiz: 75, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'NEM(P)', v: '2,19', rang: '#fbbf24' },
              { k: 'NEM(H)', v: '2,20', rang: '#38bdf8' },
            ],
          },
          pastki: [
            'P (2,19) va H (2,20) deyarli teng',
            'P atrofida 3 bog\' + 1 erkin juft',
            'Qutbliligi: Cl₂ < PH₃ < H₂S < HF',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: DONOR-AKSEPTOR BOG'LANISH (NH₄⁺ VA H₃O⁺, 69-70-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaDonorAkseptor() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Donor-akseptor bog'lanish (69–70-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'NH4',
          tugma: 'NH₄⁺ (Ammoniy)',
          formula: 'NH₃ (donor N:) + H⁺ (akseptor □) → NH₄⁺ (N — IV valentli)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Ammoniy ioni (NH₄⁺): 3 oddiy + 1 donor-akseptor',
            tenglama: 'NH₃ (donor : juft) + H⁺ (akseptor □) → [NH₄]⁺',
            markaz: { belgi: 'N⁺', rang: '#34d399', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 1.57, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 3.14, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H→', burchak: 4.71, masofa: 74, bog: 1, rang: '#fde047', r: 15 },
            ],
            metrikalar: [
              { nom: 'N kovalentligi', qiymat: 'III → IV', foiz: 100, rang: '#34d399' },
              { nom: '4 bog\' kuchi', qiymat: 'Teng kuchli', foiz: 100, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Donor', v: 'NH₃ (N: juft)', rang: '#34d399' },
              { k: 'Akseptor', v: 'H⁺ (1s⁰ □)', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Donor: erkin elektron juft beruvchi (N)',
            'Akseptor: bo\'sh orbital beruvchi (H⁺)',
            'NH₄⁺ da barcha 4 bog\' teng kuchli!',
          ],
        },
        {
          id: 'H3O',
          tugma: 'H₃O⁺ (Gidroksoniy)',
          formula: 'H₂O (donor :O:) + H⁺ (akseptor □) → H₃O⁺ (O — III valentli)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Gidroksoniy ioni (H₃O⁺): O kovalentligi II → III',
            tenglama: 'H₂O (donor :: juft) + H⁺ (akseptor □) → [H₃O]⁺',
            markaz: { belgi: 'O⁺', rang: '#38bdf8', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.4, masofa: 74, bog: 1, rang: '#34d399', r: 14 },
              { belgi: 'H', burchak: 2.5, masofa: 74, bog: 1, rang: '#34d399', r: 14 },
              { belgi: 'H→', burchak: 4.6, masofa: 74, bog: 1, rang: '#fde047', r: 15 },
            ],
            metrikalar: [
              { nom: 'O kovalentligi', qiymat: 'II → III', foiz: 75, rang: '#38bdf8' },
              { nom: 'Qolgan erkin', qiymat: '1 juft (O da)', foiz: 50, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Donor', v: 'H₂O (:O:)', rang: '#38bdf8' },
              { k: 'Akseptor', v: 'H⁺ (1s⁰ □)', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Kislorod 2 ta erkin juftidan 1 tasini beradi',
            'O ning kovalentligi II dan III ga ortadi',
            'Koordinatsion bog\' ham kovalentdir',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 71-BET 4-MASHQ — BOG'LOVCHI VA TAQSIMLANMAGAN JUFTLAR
═══════════════════════════════════════════════════════════════ */
function KorgazmaTaqsimlanmaganJuft() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 71-bet 4-mashq: Bog'lovchi va erkin juftlar"
      ikon="kolba"
      variantlar={[
        {
          id: 'HCl',
          tugma: 'HCl (4-mashq)',
          formula: 'HCl: 1 ta bog\'lovchi juft • Cl atrofida 3 ta taqsimlanmagan juft',
          tur: 'molekula',
          cfg: {
            sarlavha: 'HCl (71-b 4-mashq): Cl da 3 ta taqsimlanmagan juft',
            tenglama: 'H : Cl :: (Cl da 7 ē → 1 bog\'da, 6 ē = 3 erkin juft)',
            rejim: 'bog',
            bogJuft: { chap: 'H', chapRang: '#38bdf8', ong: 'Cl :::', ongRang: '#fbbf24', siljish: 0.5 },
            metrikalar: [
              { nom: 'Bog\'lovchi juft', qiymat: '1 ta (2 ē)', foiz: 25, rang: '#34d399' },
              { nom: 'Taqsimlanmagan', qiymat: '3 ta (6 ē)', foiz: 75, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Cl tashqi', v: '7 ē', rang: '#38bdf8' },
              { k: 'Erkin juft', v: '3 ta', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'HCl: Cl da 3 ta taqsimlanmagan juft',
            'Bog\'da faqat 1 ta elektron juft',
            'Jami Cl atrofida 4 juft (oktet)',
          ],
        },
        {
          id: 'H2O',
          tugma: 'H₂O (Suv)',
          formula: 'H₂O: 2 ta bog\'lovchi juft • O atrofida 2 ta taqsimlanmagan juft',
          tur: 'molekula',
          cfg: {
            sarlavha: 'H₂O: Kislorodda 2 ta bog\' + 2 ta taqsimlanmagan juft',
            tenglama: 'O da 6 ē → 2 bog\' (H bilan) + 4 ē = 2 ta erkin juft',
            markaz: { belgi: 'O ::', rang: '#38bdf8', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.45, masofa: 74, bog: 1, rang: '#34d399', r: 14 },
              { belgi: 'H', burchak: 2.25, masofa: 74, bog: 1, rang: '#34d399', r: 14 },
            ],
            metrikalar: [
              { nom: 'Bog\'lovchi juft', qiymat: '2 ta (4 ē)', foiz: 50, rang: '#34d399' },
              { nom: 'Taqsimlanmagan', qiymat: '2 ta (4 ē)', foiz: 50, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'O tashqi', v: '6 ē', rang: '#38bdf8' },
              { k: 'H₃O⁺ uchun', v: 'donor juft', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'H₂O: O da 2 ta erkin juft',
            'Shu sababli suv H₃O⁺ hosil qiladi',
            'Jami O atrofida 4 juft (oktet)',
          ],
        },
        {
          id: 'NH3',
          tugma: 'NH₃ (Ammiak)',
          formula: 'NH₃: 3 ta bog\'lovchi juft • N atrofida 1 ta taqsimlanmagan juft',
          tur: 'molekula',
          cfg: {
            sarlavha: 'NH₃: Azotda 3 ta bog\' + 1 ta taqsimlanmagan juft',
            tenglama: 'N da 5 ē → 3 bog\' (H bilan) + 2 ē = 1 ta erkin juft',
            markaz: { belgi: 'N :', rang: '#34d399', r: 24 },
            atomlar: [
              { belgi: 'H', burchak: 0.3, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 2.3, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
              { belgi: 'H', burchak: 4.4, masofa: 74, bog: 1, rang: '#38bdf8', r: 14 },
            ],
            metrikalar: [
              { nom: 'Bog\'lovchi juft', qiymat: '3 ta (6 ē)', foiz: 75, rang: '#34d399' },
              { nom: 'Taqsimlanmagan', qiymat: '1 ta (2 ē)', foiz: 25, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'N tashqi', v: '5 ē', rang: '#34d399' },
              { k: 'NH₄⁺ uchun', v: 'donor juft', rang: '#fbbf24' },
            ],
          },
          pastki: [
            'NH₃: N da 1 ta erkin juft',
            'H⁺ ni biriktirib NH₄⁺ beradi',
            'Jami N atrofida 4 juft (oktet)',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (14-§) VA O'YINLAR (15-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '13-jadval bo\'yicha eng yuqori va eng past NEM:',
    variantlar: [
      { matn: 'Yuqori: O (3,44); past: Li (0,98)', togri: false },
      { matn: 'Yuqori: F (4,0); past: Cs (0,79)', togri: true },
      { matn: 'Yuqori: Cl (3,16); past: Na (0,93)', togri: false },
      { matn: 'Yuqori: N (3,04); past: K (0,82)', togri: false },
    ],
    izoh: '65-b (13-jadval): F = 4,0 eng katta, Cs = 0,79 eng kichik.',
  },
  {
    id: 't2',
    savol: '66-b 4-mashq: CO₂ va Cl₂O₇ da elektron juft siljishi:',
    variantlar: [
      { matn: 'C va Cl ga', togri: false },
      { matn: 'Hech qayerga', togri: false },
      { matn: 'CO₂ da O ga, Cl₂O₇ da Cl ga', togri: false },
      { matn: 'Ikkalasida Kislorodga (O=3,44 > C, Cl)', togri: true },
    ],
    izoh: 'O (3,44) uglerod (2,55) va xlordan (3,16) yuqori.',
  },
  {
    id: 't3',
    savol: 'Davr va guruhda NEM qanday o\'zgaradi?',
    variantlar: [
      { matn: 'Davrda (→) ortadi, guruhda (↓) kamayadi', togri: true },
      { matn: 'Davrda kamayadi, guruhda ortadi', togri: false },
      { matn: 'O\'zgarmaydi', togri: false },
      { matn: 'Faqat metallarda ortadi', togri: false },
    ],
    izoh: '65-b: davrda radius ↓ → NEM ↑; guruhda radius ↑ → NEM ↓.',
  },
  {
    id: 't4',
    savol: 'Metall atomi (Na) reaksiyada qanday qobiqqa intiladi?',
    variantlar: [
      { matn: 'Anion bo\'lishga', togri: false },
      { matn: 'Proton sonini o\'zgartirishga', togri: false },
      { matn: 'Elektron berib oktetga (Ne: 2, 8) o\'tishga', togri: true },
      { matn: 'Tashqi qavatga 18 ē to\'ldirishga', togri: false },
    ],
    izoh: '63-b: Na 3s¹ elektronni berib Ne (2, 8) qobig\'iga o\'tadi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'qutbsiz', nom: 'Qutbsiz kovalent', tavsif: 'Bir xil NEM (ΔEM = 0)' },
    { id: 'qutbli', nom: 'Qutbli kovalent', tavsif: 'Har xil metalmaslar' },
    { id: 'donor', nom: 'Donor-akseptor', tavsif: 'Erkin juft + bo\'sh orbital' },
  ],
  topshiriqlar: [
    { nom: 'H₂ (H—H) va Cl₂ (Cl—Cl)', qisqa: '1 juft, simmetrik', guruh: 'qutbsiz', izoh: '67–68-b: ΔEM = 0.' },
    { nom: 'O₂ (O=O) va N₂ (N≡N)', qisqa: '2 va 3 juft', guruh: 'qutbsiz', izoh: 'Bir xil atomlar qo\'sh/uchbog\'i.' },
    { nom: 'Br₂ va I₂ moddalari', qisqa: 'Bir xil galogen', guruh: 'qutbsiz', izoh: 'Juft markazda turadi.' },
    { nom: 'HCl (δ⁺H→Clδ⁻) va HF', qisqa: 'Galogenvodorod', guruh: 'qutbli', izoh: 'Katta EM halogen juftni tortadi.' },
    { nom: 'H₂O, H₂S va NH₃', qisqa: 'Suv, H₂S, ammiak', guruh: 'qutbli', izoh: 'O, S, N vodoroddan elektrmanfiyroq.' },
    { nom: 'CH₄, PCl₃ va PCl₅', qisqa: 'Metalmas birikmalar', guruh: 'qutbli', izoh: '67-b: kichik NEM farqli moddalar.' },
    { nom: 'NH₄⁺ (NH₃ + H⁺)', qisqa: 'Ammoniy kationi', guruh: 'donor', izoh: 'Azot donor, H⁺ akseptor.' },
    { nom: 'H₃O⁺ (H₂O + H⁺)', qisqa: 'Gidroksoniy ioni', guruh: 'donor', izoh: 'Kislorod donor, H⁺ akseptor.' },
    { nom: 'Erkin juft → bo\'sh orbital', qisqa: 'Koordinatsion bog\'', guruh: 'donor', izoh: '69–70-b: tayyor juft beriladi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Qutbsiz bog\'',
    savol: 'Faqat QUTBSIZ kovalent bog\'li moddalar qatori:',
    variantlar: ['HCl, H₂O, NH₃', 'NaCl, K₂S, MgO', 'H₂, Cl₂, O₂, N₂', 'HF, H₂S, CH₄'],
    togri: 2,
    izoh: '67–68-b: bir xil metalmas atomlaridan iborat.',
  },
  {
    belgi: 'HCl (4-mashq)',
    savol: '71-b: HCl da xlorning taqsimlanmagan juftlari soni:',
    variantlar: ['3 ta (6 ta elektron)', '1 ta', '2 ta', '4 ta'],
    togri: 0,
    izoh: '7 ē dan 1 tasi bog\'da, 6 ē = 3 juft erkin.',
  },
  {
    belgi: 'Ammoniy NH₄⁺',
    savol: 'NH₃ + H⁺ → NH₄⁺ da donor va akseptor:',
    variantlar: ['H⁺ donor, N akseptor', 'Ikkalasi donor', 'Ikkalasi akseptor', 'Azot (N:) donor, H⁺ akseptor'],
    togri: 3,
    izoh: '69–70-b: N(:) juft beradi, H⁺ (1s⁰) oladi.',
  },
  {
    belgi: 'Azot N₂',
    savol: 'N₂ molekulasida umumiy elektron juftlar soni:',
    variantlar: ['1 ta (N—N)', '3 ta (uchbog\' N≡N)', '2 ta (N=N)', '4 ta'],
    togri: 1,
    izoh: '68-b: N da 3 ta toq 2p-elektron bor.',
  },
  {
    belgi: '71-b 5-mashq',
    savol: 'Cl₂, HF, H₂S, PH₃ dan eng KUCHLI qutblisi:',
    variantlar: ['Cl₂ (ΔEM=0)', 'HF (ΔEM = 1,80)', 'PH₃ (ΔEM=0,01)', 'H₂S (ΔEM=0,38)'],
    togri: 1,
    izoh: 'F = 4,0 eng katta bo\'lgani uchun HF eng qutbli.',
  },
  {
    belgi: 'Kislorod O₂',
    savol: 'O₂ da umumiy juftlar soni va valentlik:',
    variantlar: ['1 juft, I valent', '3 juft, III valent', '4 juft, IV valent', '2 juft (O=O), II valent'],
    togri: 3,
    izoh: '68-b: 2 tadan toq elektron qo\'sh bog\' beradi.',
  },
  {
    belgi: 'Gidroksoniy H₃O⁺',
    savol: 'H₂O + H⁺ → H₃O⁺ da donor-akseptor bog\' asosi:',
    variantlar: ['O ning erkin jufti + H⁺ bo\'sh orbitali', 'H⁺ ning 2 elektroni', 'Suv H elektroni', 'Ion almashinish'],
    togri: 0,
    izoh: '70-b: O erkin juftini H⁺ ga taqdim etadi.',
  },
  {
    belgi: '3-guruh (ionli)',
    savol: 'Keskin NEM farqli (ionli) moddalar (67-b):',
    variantlar: ['H₂, O₂, N₂', 'HCl, H₂O, NH₃', 'NaCl, K₂S, BaCl₂, CaF₂, MgO', 'PCl₃, CH₄, H₂S'],
    togri: 2,
    izoh: '67-b: metall va tipik metalmaslar birikmalari.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Bog\' qutbliligi',
    vazifa: '5-mashq: Qutblilik ortishi bo\'yicha tering:',
    tartib: ['Cl₂ (ΔEM = 0)', 'PH₃ (ΔEM = 0,01)', 'H₂S (ΔEM = 0,38)', 'HF (ΔEM = 1,80)'],
    variantlar: ['H₂S (ΔEM = 0,38)', 'Cl₂ (ΔEM = 0)', 'HF (ΔEM = 1,80)', 'PH₃ (ΔEM = 0,01)'],
  },
  {
    tur: 'Bog\' tartibi',
    vazifa: 'Umumiy elektron juftlar soni ortishida joylang:',
    tartib: ['H₂ (1 juft: H—H)', 'O₂ (2 juft: O=O)', 'N₂ (3 juft: N≡N)', 'NH₄⁺ (4 ta bog\')'],
    variantlar: ['N₂ (3 juft: N≡N)', 'H₂ (1 juft: H—H)', 'NH₄⁺ (4 ta bog\')', 'O₂ (2 juft: O=O)'],
  },
  {
    tur: 'Donor-akseptor',
    vazifa: 'Ammoniy ioni hosil bo\'lish bosqichlari:',
    tartib: ['NH₃ da erkin juft (:)', 'H⁺ da bo\'sh orbital (□)', 'N(:) → H⁺ juft beradi', '4 teng bog\'li NH₄⁺'],
    variantlar: ['N(:) → H⁺ juft beradi', 'NH₃ da erkin juft (:)', '4 teng bog\'li NH₄⁺', 'H⁺ da bo\'sh orbital (□)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Ammoniy NH₄⁺ da azotning kovalentligi:',
    variantlar: ['I valentli', 'IV valentli (3 oddiy + 1 donor)', 'II valentli', 'V valentli'],
    togri: 1,
    izoh: '70-b: NH₄⁺ da azot 4 ta kovalent bog\' beradi.',
  },
  {
    savol: 'HCl da qisman δ⁺ va δ⁻ zaryadlar:',
    variantlar: ['H δ⁻, Cl δ⁺', 'Ikkalasida 0', 'Ikkalasida δ⁺', 'H da δ⁺, Cl da δ⁻ (EM=3,16)'],
    togri: 3,
    izoh: '69-b: umumiy juft Xlor tomonga siljiydi.',
  },
  {
    savol: 'Faqat QUTBLI kovalent moddalar qatori (67-b):',
    variantlar: ['HCl, H₂O, H₂S, NH₃, CH₄', 'NaCl, MgO, CaF₂', 'H₂, F₂, Cl₂, N₂', 'K₂S, BaCl₂, Li₂O'],
    togri: 0,
    izoh: '67-b: har xil metalmaslar birikmalari.',
  },
  {
    savol: 'Kovalent bog\'lanish qanday hosil bo\'ladi?',
    variantlar: ['Proton almashinuvi bilan', 'Elektron to\'liq o\'tishi bilan', 'Umumiy elektron juftlar hisobiga', 'Yadro qo\'shilishi bilan'],
    togri: 2,
    izoh: '67-b: atomlar orasida umumiy juft hosil bo\'ladi.',
  },
  {
    savol: 'Vodorod (H₂) molekulasidagi umumiy juft:',
    variantlar: ['2 juft (H=H)', '3 juft', '1 ta umumiy juft (H—H)', '0 ta'],
    togri: 2,
    izoh: '68-b: H· + ·H → H:H (H—H).',
  },
  {
    savol: 'Suv (H₂O) da O ning taqsimlanmagan juftlari:',
    variantlar: ['2 ta (shuning uchun H₃O⁺ beradi)', '0 ta', '1 ta', '4 ta'],
    togri: 0,
    izoh: 'O da 6 ē → 2 bog\'da, 4 ē = 2 juft erkin.',
  },
  {
    savol: 'Donor-akseptor bog\' oddiy kovalentdan farqi:',
    variantlar: ['Juda kuchsiz', 'Faqat hosil bo\'lish usulida', 'Faqat metallarda', 'Juft bo\'lmaydi'],
    togri: 1,
    izoh: '70-b: hosil bo\'lgach kuchliligi bir xil.',
  },
  {
    savol: '71-b 5-mashq: PH₃ bog\' xarakteri (P=2,19, H=2,20):',
    variantlar: ['Ionli bog\'', 'Metall bog\'', 'Kuchli qutbli', 'Deyarli qutbsiz kovalent'],
    togri: 3,
    izoh: 'NEMlari deyarli teng bo\'lgani uchun deyarli qutbsiz.',
  },
];

export default function S8Mavzu15() {
  const korgazmalar = [
    { nom: '1. Bog\'lanishning 3 guruhi', ikon: 'atom', komponent: <KorgazmaUchGuruhBoglanish /> },
    { nom: '2. H₂, O₂, N₂ juftlari', ikon: 'formula', komponent: <KorgazmaKovalentJuftlar /> },
    { nom: '3. Qutbsiz vs Qutbli', ikon: 'magnit', komponent: <KorgazmaQutbsizVaQutbli /> },
    { nom: '4. 5-mashq: Cl₂, HF, H₂S, PH₃', ikon: 'qidiruv', komponent: <KorgazmaMashq5Molekulalar /> },
    { nom: '5. Donor-akseptor (NH₄⁺)', ikon: 'uchqun', komponent: <KorgazmaDonorAkseptor /> },
    { nom: '6. Erkin juftlar (4-mashq)', ikon: 'kolba', komponent: <KorgazmaTaqsimlanmaganJuft /> },
  ];

  const oyinlar = [
    {
      nom: '1. Bog\'lanish turlari',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-15"
          nom="Moddalarni qutbsiz, qutbli va donor-akseptor bog'lanishga ajratish"
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
          key="tezkor-15"
          nom="15-§: Kovalent va donor-akseptor bog'lanish viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Qutblilik zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-15"
          nom="Bog'lanish tartibi va donor-akseptor bosqichlari"
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
          key="duel-15"
          sarlavha="15-§: Kovalent bog'lanish dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="15-§"
      mavzuNom="Kimyoviy bog'lanish turlari. Qutbli va qutbsiz kovalent bog'lanish"
      oldingiRaqam="14-§"
      oldingiNom="Kimyoviy elementlarning nisbiy elektromanfiyligi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
