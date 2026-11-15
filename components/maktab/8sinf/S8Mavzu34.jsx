'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 34-PARAGRAF
// "Kimyoviy muvozanat" (Darslik 144-147 & 152, 154-betlar)
// ============================================================

import {
  SmartDarsQobiq,
  GuruhlashOyini,
  TezkorTanlovOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi';
import { InteraktivSahnaKorgazma } from '@/components/maktab/SmartKimyoSahna';

/* ═══════════════════════════════════════════════════════════════
   1–6-KO'RGAZMALAR ("KAM GAP, KO'P ANIMATSIYA")
═══════════════════════════════════════════════════════════════ */
function KorgazmaQaytarVaQaytmas() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Qaytmas (→) va Qaytar (⇄) reaksiyalar (144–145-b)"
      ikon="filtr"
      variantlar={[
        {
          id: 'qaytar',
          tugma: 'Qaytar (⇄) vs Qaytmas (→)',
          formula: 'Qaytmas: AgCl↓, H₂↑, CO₂↑, H₂O • Qaytar: SO₂+H₂O⇄H₂SO₃, N₂+3H₂⇄2NH₃, 2SO₂+O₂⇄2SO₃',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Qaytmas reaksiyalar oxirigacha boradi; qaytar (⇄) ikki tomonga boradi',
            tenglama: 'Qaytmas: AgNO₃+NaCl=AgCl↓+NaNO₃  |  Qaytar: 2SO₂+O₂ ⇄ 2SO₃+Q; CO₂+H₂ ⇄ H₂O+CO',
            kameraNom: 'To\'g\'ri (→) va teskari (←) oqimlar',
            tezlik: 2.2,
            rang: '#34d399',
            belgilar: [
              { k: 'Qaytmas sharti', v: 'Cho\'kma (AgCl↓), gaz (H₂↑, CO₂↑), H₂O, KClO₃', rang: '#fb7185' },
              { k: 'Qaytar (⇄)', v: 'SO₂+H₂O⇄H₂SO₃; N₂+3H₂⇄2NH₃+Q', rang: '#34d399' },
              { k: 'Sanoat asosi', v: '2SO₂+O₂ ⇄ 2SO₃ + Q; CO₂+H₂ ⇄ H₂O+CO', rang: '#fde047' },
            ],
          },
          pastki: ['Qaytmas: AgCl↓, H₂↑, CO₂↑, H₂O, 2KClO₃→2KCl+3O₂', 'Qaytar: SO₂+H₂O⇄H₂SO₃; N₂+3H₂⇄2NH₃+Q', '2SO₂+O₂ ⇄ 2SO₃+Q; CO₂+H₂ ⇄ H₂O+CO'],
        },
      ]}
    />
  );
}

function KorgazmaMuvozanatHolatVaK() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Dinamik muvozanat (υ₁ = υ₂), Katalizator va K (145–146-b)"
      ikon="grafik"
      variantlar={[
        {
          id: 'dinamik',
          tugma: 'υ₁ = υ₂ & Katalizator roli',
          formula: 'υ₁ = υ₂ → dinamik muvozanat • Katalizator muvozanatni SILJITMAYDI!',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'υ₁ ↓ va υ₂ ↑ kelib υ₁ = υ₂ tenglashganda dinamik muvozanat qaror topadi',
            tenglama: 'υ₁ = υ₂ (harakatchan muvozanat)   |   Katalizator: υ₁ va υ₂ ni teng oshiradi, SILJITMAYDI!',
            kameraNom: 'υ₁ = υ₂ muvozanat holati',
            tezlik: 2.0,
            rang: '#38bdf8',
            belgilar: [
              { k: 'Dinamik holat', v: 'Ikkala reaksiya teng tezlikda davom etadi', rang: '#38bdf8' },
              { k: 'Katalizator', v: 'Muvozanatni siljitmaydi, tezroq yetkazadi!', rang: '#fde047' },
              { k: 'Konstanta K', v: 'K faqat haroratga bog\'liq (P, c ga emas!)', rang: '#34d399' },
            ],
          },
          pastki: ['υ₁ = υ₂ — harakatchan (dinamik) muvozanat', 'Katalizator muvozanatni SILJITMAYDI', 'K faqat haroratga bog\'liq, P va c ga emas'],
        },
        {
          id: 'k1',
          tugma: '152-bet 3-misol: K = 1',
          formula: 'CO + H₂O ⇄ CO₂ + H₂: K = (0,016·0,016) / (0,004·0,064) = 1',
          tur: 'hisob',
          cfg: {
            sarlavha: '152-bet 3-misol: CO + H₂O ⇄ CO₂ + H₂ da muvozanat konstantasi K',
            tenglama: 'K = ([CO₂] · [H₂]) / ([CO] · [H₂O]) = (0,016 · 0,016) / (0,004 · 0,064)',
            qadamlar: [
              { belgi: 'Mahsulotlar [CO₂]·[H₂]', natija: '0,000256', izoh: '0,016 · 0,016', rang: '#34d399' },
              { belgi: 'Reagentlar [CO]·[H₂O]', natija: '0,000256', izoh: '0,004 · 0,064', rang: '#38bdf8' },
              { belgi: 'Konstanta K', natija: 'K = 1', izoh: '0,000256 / 0,000256', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Surat ([CO₂]·[H₂])', foiz: 100, qiymat: '0,000256', rang: '#34d399' },
              { nom: 'Maxraj ([CO]·[H₂O])', foiz: 100, qiymat: '0,000256 → K=1', rang: '#38bdf8' },
            ],
            javobBadge: 'Javob: Muvozanat konstantasi K = 1',
          },
          pastki: ['K = ([CO₂]·[H₂]) / ([CO]·[H₂O])', 'Surat = 0,000256; Maxraj = 0,000256', 'K = 0,000256 / 0,000256 = 1'],
        },
      ]}
    />
  );
}

function KorgazmaKonsentratsiyaSiljish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Le Shatelye: Konsentratsiya ta'siri (146-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'ongga',
          tugma: 'Reagent ↑ yoki Mahsulot ↓ → O\'ngga',
          formula: '2SO₂ + O₂ ⇄ 2SO₃: O₂/SO₂ qo\'shish yoki SO₃ ni chiqarish → O\'NGGA!',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Le Shatelye: ortiqcha modda sarflanuvchi tomonga siljiydi',
            tenglama: 'O₂ / SO₂ ↑  yoki  SO₃ ↓  ⇒  muvozanat O\'NGGA (SO₃ unumi ↑)',
            siljish: 'ong',
            kameraNom: 'Siljish: O\'NGGA (→ 2SO₃)',
            tezlik: 2.8,
            rang: '#34d399',
            belgilar: [
              { k: 'O\'ngga shart 1', v: 'Reagent (SO₂ yoki O₂) konsentratsiyasi ↑', rang: '#34d399' },
              { k: 'O\'ngga shart 2', v: 'Mahsulot (SO₃) ni yuttirib chiqarish ↓', rang: '#38bdf8' },
            ],
          },
          pastki: ['Reagent konsentratsiyasi ortsa → O\'ngga', 'Mahsulot chiqarib olinsa → O\'ngga (SO₃ ↑)', 'Sistema tashqi ta\'sirni kamaytirishga intiladi'],
        },
        {
          id: 'chapga',
          tugma: 'Mahsulot ↑ yoki Reagent ↓ → Chapga',
          formula: 'SO₃ ko\'paytirilsa yoki O₂/SO₂ kamaytirilsa → CHAPGA siljiydi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Mahsulot qo\'shilsa yoki reagent kamaysa → teskari (CHAPGA) siljiydi',
            tenglama: 'SO₃ ↑  yoki  O₂ / SO₂ ↓  ⇒  muvozanat CHAPGA (SO₃ parchalanishi)',
            siljish: 'chap',
            kameraNom: 'Siljish: CHAPGA (← SO₂ + O₂)',
            tezlik: 2.6,
            rang: '#fb7185',
            belgilar: [
              { k: 'Chapga shart 1', v: 'Mahsulot (SO₃) konsentratsiyasi ↑', rang: '#fb7185' },
              { k: 'Chapga shart 2', v: 'Reagent (SO₂ / O₂) ni kamaytirish ↓', rang: '#fbbf24' },
            ],
          },
          pastki: ['Mahsulot (SO₃) orttirilsa → Chapga', 'Boshlang\'ich modda kamaysa → Chapga', 'Teskari reaksiya tezlashib SO₃ parchalanadi'],
        },
      ]}
    />
  );
}

function KorgazmaHaroratSiljish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Haroratning muvozanatga ta'siri: +Q vs -Q (146–147-b)"
      ikon="harorat"
      variantlar={[
        {
          id: 't_past',
          tugma: 'Harorat ↓ → Ekzotermik (+Q) tomonga',
          formula: 't° ↓ → +Q tomonga: 2NO+O₂⇄2NO₂+Q (O\'ngga) • CO₂+C⇄2CO-Q (Chapga)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Harorat pasaysa sistema issiqlik chiqaruvchi (+Q) tomonga siljiydi',
            tenglama: 't° ↓: 2SO₂+O₂⇄2SO₃+Q (O\'ngga) • 2NO+O₂⇄2NO₂+Q (O\'ngga) • CO₂+C⇄2CO-Q (Chapga)',
            siljish: 'ong',
            kameraNom: 'Sovitish (t° ↓) → +Q tomonga!',
            tezlik: 1.8,
            rang: '#38bdf8',
            belgilar: [
              { k: '2NO+O₂⇄2NO₂+Q', v: 't° ↓ → O\'NGGA (NO₂ unumi ↑)', rang: '#34d399' },
              { k: 'CO₂+C⇄2CO-Q', v: 'Teskari +Q → t° ↓ da CHAPGA!', rang: '#fb7185' },
            ],
          },
          pastki: ['Harorat pasaysa → ekzotermik (+Q) tomonga', '2NO + O₂ ⇄ 2NO₂ + Q (t° ↓) → O\'ngga', 'CO₂ + C ⇄ 2CO - Q (t° ↓) → Chapga!'],
        },
        {
          id: 't_yuqori',
          tugma: 'Harorat ↑ → Endotermik (-Q) tomonga',
          formula: 't° ↑ → -Q tomonga: N₂+O₂⇄2NO-Q (O\'ngga) • CO₂+C⇄2CO-Q (O\'ngga)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Harorat ko\'tarilsa sistema issiqlik yutuvchi (-Q) tomonga siljiydi',
            tenglama: 't° ↑: N₂+O₂⇄2NO-Q (O\'ngga) • CO₂+C⇄2CO-Q (O\'ngga) • 2SO₂+O₂⇄2SO₃+Q (Chapga)',
            siljish: 'chap',
            kameraNom: 'Qizdirish (t° ↑) → -Q tomonga!',
            tezlik: 3.4,
            rang: '#f97316',
            belgilar: [
              { k: 'N₂+O₂⇄2NO-Q', v: 't° ↑ → O\'NGGA (2NO hosil ↑)', rang: '#fde047' },
              { k: '2SO₂+O₂⇄2SO₃+Q', v: 'Haddan t° ↑ → CHAPGA (parchalanadi!)', rang: '#fb7185' },
            ],
          },
          pastki: ['Harorat oshsa → endotermik (-Q) tomonga', 'N₂ + O₂ ⇄ 2NO - Q (t° ↑) → O\'ngga', '2SO₂ + O₂ ⇄ 2SO₃ + Q da haddan t° ↑ → Chapga'],
        },
      ]}
    />
  );
}

function KorgazmaBosimSiljish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Bosim ta'siri: gaz hajmlari vs ΔV = 0 (146 & 154-b)"
      ikon="grafik"
      variantlar={[
        {
          id: 'bosim_farq',
          tugma: '67,2 l → 44,8 l (P↑ → O\'ngga)',
          formula: '2SO₂+O₂⇄2SO₃ (3→2 mol); 3O₂⇄2O₃; 3H₂+N₂⇄2NH₃ (4→2 mol): P ↑ → O\'NGGA',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Bosim ↑ → gaz mol soni (hajmi) KAMAYADIGAN tomonga siljiydi',
            tenglama: '2SO₂ + O₂ (67,2 l, 3 mol)  ⇄  2SO₃ (44,8 l, 2 mol)   ⇒   P ↑ da O\'NGGA!',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'SO₂+O₂ (67,2 l)', qiymat: 67.2, yorliq: '3 mol (67,2 l)', rang: '#fbbf24' },
              { nom: '2SO₃ (44,8 l)', qiymat: 44.8, yorliq: '2 mol (44,8 l)', rang: '#34d399' },
              { nom: '3H₂+N₂ (4 mol)', qiymat: 89.6, yorliq: '4 mol (89,6 l)', rang: '#38bdf8' },
              { nom: '2NH₃ (2 mol)', qiymat: 44.8, yorliq: '2 mol (44,8 l)', rang: '#a855f7' },
            ],
          },
          pastki: ['67,2 l → 44,8 l (P ↑ → O\'ngga)', '3O₂⇄2O₃ (3→2) va 3H₂+N₂⇄2NH₃ (4→2): P↑ → O\'ngga', 'Bosim pasaysa gaz hajmi ko\'p tomonga siljiydi'],
        },
        {
          id: 'bosim_teng',
          tugma: 'Teng hajmlar (2 mol = 2 mol): P ≠',
          formula: 'N₂+O₂ ⇄ 2NO • H₂+Cl₂ ⇄ 2HCl • CO₂+H₂ ⇄ H₂O(b)+CO: P SILJITMAYDI!',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Gaz mol soni chapda va o\'ngda TENG (44,8 l = 44,8 l) → bosim ta\'sir etmaydi!',
            tenglama: 'N₂ + O₂ ⇄ 2NO (2 = 2)  •  H₂ + Cl₂ ⇄ 2HCl (2 = 2)  •  CO₂ + H₂ ⇄ H₂O(b) + CO (2 = 2)',
            kameraNom: '2 mol = 2 mol (ΔV = 0) → Bosim siljitmaydi!',
            tezlik: 2.0,
            rang: '#94a3b8',
            belgilar: [
              { k: 'N₂ + O₂ ⇄ 2NO', v: '44,8 l = 44,8 l → Bosim ta\'sir etmaydi', rang: '#fde047' },
              { k: 'H₂ + Cl₂ ⇄ 2HCl', v: '2 mol gaz = 2 mol gaz (ΔV = 0)', rang: '#38bdf8' },
              { k: 'CO₂+H₂⇄H₂O(b)+CO', v: '2 mol gaz = 2 mol gaz (ΔV = 0)', rang: '#34d399' },
            ],
          },
          pastki: ['N₂ + O₂ ⇄ 2NO: 2 mol = 2 mol → P siljitmaydi', 'H₂ + Cl₂ ⇄ 2HCl: 2 mol = 2 mol (ΔV = 0)', 'CO₂ + H₂ ⇄ H₂O(bug\') + CO: P ta\'sir etmaydi'],
        },
      ]}
    />
  );
}

function Korgazma34Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 147, 152, 154-bet darslik masalalari"
      ikon="formula"
      variantlar={[
        {
          id: 'masala_set',
          tugma: 'K = 1, 5-misol (Bosim) & 4-savol (t°)',
          formula: '152-b: K=1 • 154-b 5-m: 3O₂⇄2O₃, 3H₂+N₂⇄2NH₃ (O\'ngga), N₂+O₂⇄2NO (≠)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Darslik masalalari yig\'indisi: K konstantasi, bosim va harorat siljishi',
            tenglama: 'K = (0,016·0,016)/(0,004·0,064) = 1   |   5-m: P ↑ (O\'ngga, O\'ngga, Siljimaydi)',
            qadamlar: [
              { belgi: '152-b 3-m: K konstantasi', natija: 'K = 1', izoh: '0,000256 / 0,000256', rang: '#fde047' },
              { belgi: '154-b 5-m (P ↑)', natija: 'O₃↑, NH₃↑, NO (≠)', izoh: '3→2, 4→2, 2=2 mol', rang: '#34d399' },
              { belgi: '147-b 4-s (t° ↓)', natija: 'NO₂ (O\'ngga), CO (Chapga)', izoh: '+Q tomonga siljiydi', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'K konstantasi (CO+H₂O)', foiz: 100, qiymat: 'K = 1', rang: '#fde047' },
              { nom: '3H₂+N₂ → 2NH₃ (P ↑)', foiz: 50, qiymat: '4 mol → 2 mol (O\'ngga)', rang: '#34d399' },
            ],
            javobBadge: 'K = 1;  P↑: 3O₂/3H₂+N₂ O\'ngga, N₂+O₂ siljimaydi;  t°↓: NO₂ O\'ngga, CO Chapga',
          },
          pastki: ['K = (0,016·0,016)/(0,004·0,064) = 1', '154-b 5-m: 3O₂ & 3H₂+N₂ O\'ngga; N₂+O₂ siljimaydi', '147-b 4-s (t°↓): 2NO₂ O\'ngga (+Q), CO₂+C Chapga'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (33-§) VA O'YINLAR (34-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '33-§ (142-bet): 10 s da c 1 mol/l dan 0,4 mol/l ga kamaysa tezlik υ:',
    variantlar: [
      { matn: '0,04 mol/(l·s)', togri: false },
      { matn: '0,6 mol/(l·s)', togri: false },
      { matn: '0,06 mol/(l·s)', togri: true },
      { matn: '6 mol/(l·s)', togri: false },],
    izoh: 'υ = (1 - 0,4) / 10 = 0,06 mol/(l·s).',
  },
  {
    id: 't2',
    savol: '50°C da 135 s da tugagan reaksiya 70°C da (γ = 3) necha s da tugaydi?',
    variantlar: [
      { matn: '15 s (9 marta tez)', togri: true },
      { matn: '45 s', togri: false },
      { matn: '27 s', togri: false },
      { matn: '5 s', togri: false },],
    izoh: '3² = 9× tez → 135 / 9 = 15 s.',
  },
  {
    id: 't3',
    savol: '2NO + O₂ = 2NO₂ sistemada bosim 3 marta oshsa tezlik necha marta ortadi?',
    variantlar: [
      { matn: '3 marta', togri: false },
      { matn: '9 marta', togri: false },
      { matn: '6 marta', togri: false },
      { matn: '27 marta (3² · 3)', togri: true },],
    izoh: 'υ = k·[NO]²·[O₂] → 3² · 3 = 27 marta.',
  },
  {
    id: 't4',
    savol: 'Kimyoviy reaksiyalarni sekinlashtiruvchi moddalar nima deyiladi?',
    variantlar: [
      { matn: 'Katalizatorlar', togri: false },
      { matn: 'Ingibitorlar', togri: true },
      { matn: 'Indikatorlar', togri: false },
      { matn: 'Fermentlar', togri: false },],
    izoh: '143-bet: ingibitorlar zararli reaksiyalarni sekinlashtiradi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'qaytar_muv', nom: 'Qaytar & Dinamik', tavsif: 'AgCl↓ vs ⇄, υ₁=υ₂, K=1' },
    { id: 'kons_temp', nom: 'Konsentratsiya & t°', tavsif: 'SO₃↓, +Q vs -Q, 4-savol' },
    { id: 'bosim_mas', nom: 'Bosim & 5-misol', tavsif: '67,2→44,8 l, ΔV=0, Kataliz.' },
  ],
  topshiriqlar: [
    { nom: 'Qaytmas: AgCl↓, H₂↑, CO₂↑, H₂O, 2KClO₃', qisqa: 'Qaytar: ⇄ (2SO₂+O₂, NH₃)', guruh: 'qaytar_muv', izoh: '144–145-betlar.' },
    { nom: 'Dinamik muvozanat (υ₁=υ₂); Katalizator siljitmaydi', qisqa: 'K faqat haroratga bog\'liq', guruh: 'qaytar_muv', izoh: '145–146-betlar.' },
    { nom: 'K = (0,016·0,016)/(0,004·0,064) = 1', qisqa: 'CO + H₂O ⇄ CO₂ + H₂', guruh: 'qaytar_muv', izoh: '152-bet 3-misol.' },
    { nom: 'O₂/SO₂ ↑ yoki SO₃ chiqarish → O\'NGGA', qisqa: 'SO₃ ↑ yoki O₂ ↓ → Chapga', guruh: 'kons_temp', izoh: '146-bet Le Shatelye.' },
    { nom: 't° ↓ → +Q tomonga: 2NO+O₂⇄2NO₂+Q (O\'ngga)', qisqa: 'CO₂+C⇄2CO-Q (t° ↓ → Chapga)', guruh: 'kons_temp', izoh: '147-bet 4-savol.' },
    { nom: 't° ↑ → -Q tomonga: N₂+O₂⇄2NO-Q (O\'ngga)', qisqa: '2SO₂+O₂⇄2SO₃+Q (t° ↑ → Chapga)', guruh: 'kons_temp', izoh: '146-bet endotermik siljish.' },
    { nom: '2SO₂+O₂⇄2SO₃ (67,2→44,8 l): P↑ → O\'ngga', qisqa: '3 mol → 2 mol (hajm ↓)', guruh: 'bosim_mas', izoh: '146-bet bosim qoidasi.' },
    { nom: '3O₂⇄2O₃; 3H₂+N₂⇄2NH₃: P ↑ → O\'ngga', qisqa: '154-bet 5-misol a va b', guruh: 'bosim_mas', izoh: 'Mol soni kamayadigan tomon.' },
    { nom: 'N₂+O₂⇄2NO; H₂+Cl₂⇄2HCl; CO₂+H₂ (ΔV=0)', qisqa: '2 mol = 2 mol → P siljitmaydi!', guruh: 'bosim_mas', izoh: '146 & 154-betlar.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '152-b 3-m',
    savol: 'CO+H₂O⇄CO₂+H₂ da [CO]=0,004, [H₂O]=0,064, [CO₂]=0,016, [H₂]=0,016 → K:',
    variantlar: ['K = 0,25', 'K = 4', 'K = 1', 'K = 16'],
    togri: 2,
    izoh: '(0,016·0,016) / (0,004·0,064) = 0,000256/0,000256 = 1.',
  },
  {
    belgi: 'Katalizator',
    savol: 'Katalizator qaytar reaksiya muvozanatiga qanday ta\'sir ko\'rsatadi?',
    variantlar: ['SILJITMAYDI (υ₁ va υ₂ ni teng tezlashtiradi)', 'O\'ngga siljitadi', 'Chapga siljitadi', 'K ni o\'zgartiradi'],
    togri: 0,
    izoh: '146-bet: faqat muvozanat qaror topishini tezlashtiradi.',
  },
  {
    belgi: '147-b 4-s',
    savol: 'Harorat pasayganda 2NO+O₂⇄2NO₂+Q va CO₂+C⇄2CO-Q qayerga siljiydi?',
    variantlar: ['Ikkalasi o\'ngga', 'Ikkalasi chapga', 'Siljimaydi', 'NO₂ o\'ngga (+Q), CO chapga (+Q)'],
    togri: 3,
    izoh: 'Harorat pasaysa har doim +Q (ekzotermik) tomonga.',
  },
  {
    belgi: 'Bosim (ΔV=0)',
    savol: 'Qaysi reaksiyada bosimni o\'zgartirish muvozanatni SILJITMAYDI?',
    variantlar: ['2SO₂ + O₂ ⇄ 2SO₃', 'N₂ + O₂ ⇄ 2NO (2 mol = 2 mol)', '3O₂ ⇄ 2O₃', '3H₂ + N₂ ⇄ 2NH₃'],
    togri: 1,
    izoh: 'Shuningdek H₂+Cl₂⇄2HCl va CO₂+H₂⇄H₂O(b)+CO da ΔV = 0.',
  },
  {
    belgi: '154-b 5-m',
    savol: 'Bosim oshganda 3H₂ + N₂ ⇄ 2NH₃ + Q muvozanati qayerga siljiydi?',
    variantlar: ['Chapga (2 → 4 mol)', 'O\'ngga (4 mol → 2 mol gaz)', 'Siljimaydi', 'Teskari to\'xtaydi'],
    togri: 1,
    izoh: 'Bosim ↑ → gaz molekulasi kam tomonga.',
  },
  {
    belgi: 'Konstanta K',
    savol: 'Muvozanat konstantasi K qaysi omilga bog\'liq?',
    variantlar: ['Bosimga', 'Konsentratsiyaga', 'Katalizatorga', 'Faqat haroratga (t°)'],
    togri: 3,
    izoh: '146-bet: K faqat harorat o\'zgarganda o\'zgaradi.',
  },
  {
    belgi: 'SO₃ unumi',
    savol: '2SO₂+O₂⇄2SO₃+Q da hosil bo\'lgan SO₃ ni chiqarib olsak muvozanat qayerga ketadi?',
    variantlar: ['O\'ngga (ko\'proq SO₃ hosil bo\'ladi)', 'O\'zgarmaydi', 'Chapga', 'To\'xtaydi'],
    togri: 0,
    izoh: 'Le Shatelye: kamaygan mahsulotni to\'ldirishga siljiydi.',
  },
  {
    belgi: 'Qaytmas sharti',
    savol: 'Qaysi reaksiya QAYTMAS (→) reaksiya hisoblanadi?',
    variantlar: ['N₂ + 3H₂ ⇄ 2NH₃', 'SO₂ + H₂O ⇄ H₂SO₃', 'AgNO₃ + NaCl = AgCl↓ + NaNO₃', '2SO₂ + O₂ ⇄ 2SO₃'],
    togri: 2,
    izoh: '144-bet: cho\'kma, gaz yoki H₂O chiqsa qaytmas.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '152-bet 3-misol: K = 1 hisobi',
    vazifa: 'CO + H₂O ⇄ CO₂ + H₂ uchun K ni topish tartibi:',
    tartib: [
      '1. K = ([CO₂] · [H₂]) / ([CO] · [H₂O])',
      '2. Qiymatlar: (0,016 · 0,016) / (0,004 · 0,064)',
      '3. Surat = 0,000256; Maxraj = 0,000256',
      '4. K = 0,000256 / 0,000256 = 1',
    ],
    variantlar: [
      '3. Surat = 0,000256; Maxraj = 0,000256',
      '1. K = ([CO₂] · [H₂]) / ([CO] · [H₂O])',
      '4. K = 0,000256 / 0,000256 = 1',
      '2. Qiymatlar: (0,016 · 0,016) / (0,004 · 0,064)',
    ],
  },
  {
    tur: '145–146-bet: Muvozanat qaror topishi',
    vazifa: 'Muvozanat qaror topish bosqichlarini tartiblang:',
    tartib: [
      '1. Boshlanishda reagent ko\'p: υ₁ maksimal, υ₂ = 0',
      '2. υ₁ pasayadi, mahsulot ortib υ₂ o\'sadi',
      '3. υ₁ = υ₂ — dinamik muvozanat qaror topadi',
      '4. Tashqi omil o\'zgarsa Le Shatelye bo\'yicha siljiydi',
    ],
    variantlar: [
      '2. υ₁ pasayadi, mahsulot ortib υ₂ o\'sadi',
      '4. Tashqi omil o\'zgarsa Le Shatelye bo\'yicha siljiydi',
      '1. Boshlanishda reagent ko\'p: υ₁ maksimal, υ₂ = 0',
      '3. υ₁ = υ₂ — dinamik muvozanat qaror topadi',
    ],
  },
  {
    tur: '146-bet: 2SO₂ + O₂ ⇄ 2SO₃ + Q tahlili',
    vazifa: 'SO₃ unumini oshirishning 4 omilini joylang:',
    tartib: [
      '1. Konsentratsiya: O₂/SO₂ ↑ yoki SO₃ ni yuttirish → O\'ngga',
      '2. Harorat: +Q uchun t° haddan oshirmaslik → O\'ngga',
      '3. Bosim: 67,2 l → 44,8 l (3→2 mol) → bosim ↑ → O\'ngga',
      '4. Katalizator (V₂O₅): siljitmaydi, tezroq yetkazadi',
    ],
    variantlar: [
      '3. Bosim: 67,2 l → 44,8 l (3→2 mol) → bosim ↑ → O\'ngga',
      '4. Katalizator (V₂O₅): siljitmaydi, tezroq yetkazadi',
      '1. Konsentratsiya: O₂/SO₂ ↑ yoki SO₃ ni yuttirish → O\'ngga',
      '2. Harorat: +Q uchun t° haddan oshirmaslik → O\'ngga',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Dinamik (harakatchan) muvozanatda υ₁ va υ₂ tezliklar munosabati:',
    variantlar: ['υ₁ > υ₂', 'υ₁ = υ₂ (teng va noldan farqli)', 'υ₁ = υ₂ = 0', 'υ₂ = 0'],
    togri: 1,
    izoh: '145-bet: ikkala reaksiya bir xil tezlikda davom etaveradi.',
  },
  {
    savol: 'N₂ + O₂ ⇄ 2NO - Q reaksiyasida harorat oshirilganda muvozanat:',
    variantlar: ['Chapga', 'To\'xtaydi', 'Siljimaydi', 'O\'ngga (NO hosil bo\'lishi ↑)'],
    togri: 3,
    izoh: 'Endotermik (-Q) tomonga siljiydi.',
  },
  {
    savol: '2SO₂ + O₂ ⇄ 2SO₃ da chap va o\'ngdagi gazlar molyar hajmi (n.sh.):',
    variantlar: ['67,2 l (3 mol) → 44,8 l (2 mol)', '44,8 l → 67,2 l', '22,4 l → 22,4 l', '89,6 l → 44,8 l'],
    togri: 0,
    izoh: '146-bet: 3 mol gazdan 2 mol gaz hosil bo\'ladi.',
  },
  {
    savol: 'Qaysi 3 belgi reaksiyaning QAYTMAS (→) ekanligini ko\'rsatadi?',
    variantlar: ['Rang, hid, shakl', 'Bosim, harorat, V', 'Cho\'kma, gaz yoki kam dissotsiyalanuvchi H₂O', 'Katalizator, tezlik, mol'],
    togri: 2,
    izoh: '144-bet: AgCl↓, H₂↑, CO₂↑, H₂O.',
  },
  {
    savol: 'CO₂ + H₂ ⇄ H₂O(bug\') + CO da bosim kamaytirilsa:',
    variantlar: ['Chapga', 'O\'ngga', 'Muvozanat SILJITMAYDI (2 mol = 2 mol)', 'Gaz chiqadi'],
    togri: 2,
    izoh: 'Har ikkala tomonda 2 moldan gaz bor.',
  },
  {
    savol: 'Le Shatelye prinsipiga ko\'ra bosim kamaytirilsa muvozanat qayerga siljiydi?',
    variantlar: ['Gaz mol soni (hajmi) KO\'P tomonga', 'Gaz mol soni kam tomonga', 'Siljimaydi', 'Katalizator tomonga'],
    togri: 0,
    izoh: 'Tashqi ta\'sirga qarshi hajm kengayish tomonga.',
  },
  {
    savol: '2KClO₃ → 2KCl + 3O₂↑ reaksiyasi qaysi turdagi reaksiya?',
    variantlar: ['Qaytar (⇄)', 'Qaytmas (→)', 'Neytrallanish', 'Allotropiya'],
    togri: 1,
    izoh: '144-bet: kislorod gazi chiqib ketgani uchun qaytmas.',
  },
  {
    savol: '3O₂ ⇄ 2O₃ + Q da bosim oshirilganda qaysi gaz miqdori ortadi?',
    variantlar: ['O₂ ortadi', 'Teng qoladi', 'Ikkalasi nol', 'Ozon O₃ (3 mol → 2 mol, o\'ngga)'],
    togri: 3,
    izoh: '154-bet 5-misol: P ↑ da O\'ngga siljiydi.',
  },
];

export default function S8Mavzu34() {
  const korgazmalar = [
    { nom: '1. Qaytmas (→) & Qaytar (⇄)', ikon: 'filtr', komponent: <KorgazmaQaytarVaQaytmas /> },
    { nom: '2. υ₁=υ₂, Kataliz. & K=1', ikon: 'grafik', komponent: <KorgazmaMuvozanatHolatVaK /> },
    { nom: '3. Konsentratsiya (Le Shat.)', ikon: 'uchqun', komponent: <KorgazmaKonsentratsiyaSiljish /> },
    { nom: '4. Harorat (+Q vs -Q)', ikon: 'harorat', komponent: <KorgazmaHaroratSiljish /> },
    { nom: '5. Bosim (67,2→44,8 & ΔV=0)', ikon: 'grafik', komponent: <KorgazmaBosimSiljish /> },
    { nom: '6. 147, 152, 154-b masalalar', ikon: 'formula', komponent: <Korgazma34Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-34"
          nom="Kimyoviy muvozanatni guruhlang"
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
          key="tezkor-34"
          nom="34-§: Kimyoviy muvozanat"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Bosqichli zanjir',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-34"
          nom="Le Shatelye zanjirlari"
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
          key="duel-34"
          sarlavha="34-§: Muvozanat dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="34-§"
      mavzuNom="Kimyoviy muvozanat"
      oldingiRaqam="33-§"
      oldingiNom="Kimyoviy reaksiyalarning tezligi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
