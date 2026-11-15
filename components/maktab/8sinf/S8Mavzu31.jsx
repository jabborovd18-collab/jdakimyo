'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 31-PARAGRAF
// "Oltingugurtning kislorodli birikmalari" (Darslik 136-138-betlar)
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
function KorgazmaSO2TuzilishFizik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Oltingugurt(IV) oksid SO₂ tuzilishi & fizikasi (136-b)"
      ikon="atom"
      variantlar={[
        {
          id: 'so2',
          tugma: 'SO₂ (Mr=64, Tq=-10°C, 36 V)',
          formula: 'O=S=O burchakli qutbli • Tq=-10°C, Ts=-73°C • 1 hajm suvda 36 hajm • chegara 0,03–0,05 mg/l',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Sulfit angidrid SO₂: havodan 2,21× og\'ir, bo\'g\'uvchi zaharli gaz',
            tenglama: 'D_havo = 64/29 ≈ 2,21  •  Tq = -10°C  •  Ts = -73°C  •  1 V H₂O: 36 V SO₂',
            markaz: { belgi: 'S⁺⁴', rang: '#fde047', r: 24 },
            atomlar: [
              { belgi: 'O', rang: '#fb7185', r: 16, masofa: 72, bog: 2, burchak: -0.6 },
              { belgi: 'O', rang: '#fb7185', r: 16, masofa: 72, bog: 2, burchak: 0.6 },
            ],
            metrikalar: [
              { nom: 'Suvda erishi (1 hajmda)', qiymat: '36 hajm SO₂ (H₂SO₃)', foiz: 75, rang: '#38bdf8' },
              { nom: 'Chegara (ekologiya)', qiymat: '0,03–0,05 mg/l', foiz: 90, rang: '#fb7185' },
            ],
            belgilar: [
              { k: 'Haroratlar', v: 'Tq = -10°C (oson suyuq.), Ts = -73°C', rang: '#38bdf8' },
              { k: 'Ekologiya', v: 'Vulqon, ko\'mir tutuni → kislotali yomg\'ir', rang: '#fb7185' },
            ],
          },
          pastki: ['D_havo(SO₂) = 2,21; Tq=-10°C, Ts=-73°C', '1 hajm suvda 36 hajm erib H₂SO₃ beradi', 'Chegara: 0,03–0,05 mg/l (kislotali yomg\'ir)'],
        },
      ]}
    />
  );
}

function KorgazmaSO2Olinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. SO₂ ni laboratoriya va sanoatda olish (136–137-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab',
          tugma: 'Lab: Sulfit & Cu + H₂SO₄(kons)',
          formula: 'Na₂SO₃ + H₂SO₄ = Na₂SO₄ + H₂O + SO₂↑ • Cu + 2H₂SO₄(kons) = CuSO₄ + SO₂↑ + 2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '1-usul: Na₂SO₃ + H₂SO₄;  2-usul: Mis + kons. H₂SO₄ (qizdirib)',
            tenglama: 'Na₂SO₃ + H₂SO₄ = Na₂SO₄ + H₂O + SO₂↑   |   Cu + 2H₂SO₄(kons) = CuSO₄ + SO₂↑ + 2H₂O',
            ikkiIdish: true,
            qizdir: true,
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Cu + H₂SO₄',
            stakanSarlavha: 'S⁺⁶ → S⁺⁴',
            ikkinchiSuyuqlikRang: '#0ea5e9',
            ikkinchiBelgi: 'SO₂↑ yig\'ish',
            ikkinchiSarlavha: 'D_havo = 2,21',
            reagentlar: [
              { belgi: 'Cu²⁺', rang: '#38bdf8' },
              { belgi: 'SO₄²⁻', rang: '#fde047' },
            ],
            gazRang: '#cbd5e1',
            gazBelgi: 'SO₂↑',
            belgilar: [
              { k: '1-lab usul', v: 'Na₂SO₃ + H₂SO₄ = Na₂SO₄ + H₂O + SO₂↑', rang: '#38bdf8' },
              { k: '2-lab usul', v: 'Cu + 2H₂SO₄(kons) = CuSO₄ + SO₂↑ + 2H₂O', rang: '#fde047' },
            ],
          },
          pastki: ['Sulfit + kislota: sokin, toza SO₂ chiqadi', 'Mis + kons. H₂SO₄: S⁺⁶ → S⁺⁴ qaytariladi', 'Havodan 2,21× og\'ir → tik idishga yig\'iladi'],
        },
        {
          id: 'sanoat',
          tugma: 'Sanoat: Pirit (FeS₂), ZnS, S',
          formula: 'S + O₂ = SO₂ • 4FeS₂ + 11O₂ = 2Fe₂O₃ + 8SO₂ • 2ZnS + 3O₂ = 2ZnO + 2SO₂',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Sanoatda oltingugurt, pirit (FeS₂) va sulfid rudalarini kuydirish',
            tenglama: '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂   |   2ZnS + 3O₂ → 2ZnO + 2SO₂   |   S + O₂ = SO₂',
            bosqichlar: [
              { nom: '1. Oltingugurt', tur: 'pech', ichi: 'S + O₂', mahsulot: 'SO₂', rang: '#fde047' },
              { nom: '2. Pirit (FeS₂)', tur: 'pech', ichi: '4FeS₂ + 11O₂', mahsulot: '2Fe₂O₃ + 8SO₂', rang: '#f97316' },
              { nom: '3. Rux aldamasi', tur: 'minora', ichi: '2ZnS + 3O₂', mahsulot: '2ZnO + 2SO₂', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Pirit kuyd.', v: '1 mol FeS₂ → 2 mol SO₂ chiqaradi', rang: '#f97316' },
              { k: 'Metallurgiya', v: 'ZnS, CuS, PbS kuydirganda ham SO₂', rang: '#38bdf8' },
            ],
          },
          pastki: ['Toza oltingugurt yoqib: S + O₂ = SO₂', 'Pirit (FeS₂) kuydirish: 4FeS₂+11O₂ → 8SO₂', 'Rangli metallurgiya (ZnS, CuS) da qo\'shimcha gaz'],
        },
      ]}
    />
  );
}

function KorgazmaSO2KimyoviyXossa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. SO₂: kislotali oksid va ikki yoqlama OQR (137-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kislotali',
          tugma: 'Kislotali oksid & Tuzlar',
          formula: 'SO₂+H₂O⇄H₂SO₃ • CaO+SO₂=CaSO₃ • 2NaOH→Na₂SO₃; ortiqcha SO₂→NaHSO₃',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Sulfit angidrid H₂SO₃, o\'rta sulfit (Na₂SO₃) va nordon (NaHSO₃) tuz beradi',
            tenglama: 'SO₂ + H₂O ⇄ H₂SO₃   |   CaO + SO₂ = CaSO₃   |   NaOH + SO₂(ort.) = NaHSO₃',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'H₂SO₃ / NaHSO₃',
            stakanSarlavha: 'Kislotali oksid',
            reagentlar: [
              { belgi: 'SO₃²⁻', rang: '#38bdf8' },
              { belgi: 'HSO₃⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Suv & Oksid', v: 'SO₂+H₂O⇄H₂SO₃; CaO+SO₂=CaSO₃', rang: '#38bdf8' },
              { k: 'O\'rta tuz', v: '2NaOH + SO₂ = Na₂SO₃ + H₂O', rang: '#fde047' },
              { k: 'Nordon tuz', v: 'NaOH + SO₂(ortiqcha) = NaHSO₃', rang: '#34d399' },
            ],
          },
          pastki: ['SO₂ + H₂O ⇄ H₂SO₃ (kuchsiz, 2-negizli)', '2NaOH + SO₂ → o\'rta tuz Na₂SO₃', 'SO₂ ortiqcha bo\'lsa nordon NaHSO₃'],
        },
        {
          id: 'oqr',
          tugma: 'Ikki yoqlama OQR (V₂O₅ / H₂S)',
          formula: 'Qaytar.: 2SO₂+O₂⇄2SO₃; SO₂+Cl₂+2H₂O • Oksidl.: 2H₂S+SO₂ = 2H₂O + 3S↓',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'S⁺⁴ oraliq daraja: O₂/Cl₂ bilan qaytaruvchi, H₂S bilan oksidlovchi!',
            tenglama: '2SO₂ + O₂ ⇄(V₂O₅) 2SO₃ + Q  •  SO₂ + Cl₂ + 2H₂O = H₂SO₄ + 2HCl  •  2H₂S + SO₂ = 2H₂O + 3S↓',
            suyuqlikRang: '#fde047',
            stakanBelgi: '2H₂S + SO₂ → 3S↓',
            stakanSarlavha: 'Ikki yoqlama OQR',
            chokmaRang: '#fde047',
            chokmaBelgi: '3S↓ (sariq)',
            reagentlar: [
              { belgi: 'S⁺⁶', rang: '#34d399' },
              { belgi: 'S⁰', rang: '#fde047' },
            ],
            elektronJuft: { chap: 'S⁺⁴', ong: 'O₂ / H₂S', e: '2ē/4ē' },
            belgilar: [
              { k: 'Qaytaruvchi', v: '2SO₂+O₂⇄2SO₃ (V₂O₅); SO₂+Cl₂+2H₂O', rang: '#34d399' },
              { k: 'Oksidlovchi', v: '2H₂S + SO₂ = 2H₂O + 3S↓', rang: '#fde047' },
            ],
          },
          pastki: ['S⁺⁴ → S⁺⁶ (O₂, Cl₂ bilan qaytaruvchi)', '2SO₂ + O₂ ⇄ 2SO₃ + Q (V₂O₅ katalizator)', 'S⁺⁴ → S⁰ (H₂S bilan 3S↓ — oksidlovchi)'],
        },
      ]}
    />
  );
}

function KorgazmaSO2Qollanishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Oltingugurt(IV) oksidning qo'llanishi (137-bet)"
      ikon="filtr"
      variantlar={[
        {
          id: 'soha',
          tugma: 'Oqartirish, Meva dudlash, H₂SO₄',
          formula: 'Jun/ipak/somon oqartirish • Turshak/mayiz dudlash • Bochka dezinfeksiya • H₂SO₄',
          tur: 'biogen',
          cfg: {
            sarlavha: 'SO₂ — oqartirish, konservant va H₂SO₄ sanoati asosiy xomashyosi',
            tenglama: 'H₂SO₄ ishlab chiqarish  •  Neft tozalash  •  Qog\'oz Ca(HSO₃)₂  •  Meva quritish',
            markazBelgi: 'SO₂',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Oqartirish', belgi: 'Jun, ipak, somon', rang: '#fde047' },
              { nom: 'Meva dudlash', belgi: 'Turshak, mayiz', rang: '#fb923c' },
              { nom: 'Dezinfeksiya', belgi: 'Bochka, ombor', rang: '#34d399' },
              { nom: 'Sanoat', belgi: 'H₂SO₄, neft, qog\'oz', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Oqartirish', v: 'Bo\'yoqni rangsiz qiladi (quyoshda qaytishi mum.)', rang: '#fde047' },
              { k: 'Qishloq x.', v: 'Mog\'or va bakteriyaga qarshi dudlash', rang: '#34d399' },
              { k: 'Asosiy ulush', v: 'H₂SO₄ olish, neft tozalash, Ca(HSO₃)₂', rang: '#38bdf8' },
            ],
          },
          pastki: ['Jun, ipak, somonni oqartiradi (qaytar!)', 'Turshak/mayiz dudlash, bochka dezinfeksiyasi', 'H₂SO₄ olish, neft tozalash, qog\'oz Ca(HSO₃)₂'],
        },
      ]}
    />
  );
}

function KorgazmaSO3VaOleum() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. SO₃ (45°C / 17°C) va Oleum H₂SO₄·nSO₃ (137–138-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'so3_oleum',
          tugma: 'SO₃ sintezi (V₂O₅) & Oleum',
          formula: 'SO₃ (Mr=80): Tq=45°C, Ts=17°C • H₂SO₄(98%) + nSO₃ → H₂SO₄·nSO₃ (oleum / H₂S₂O₇)',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'SO₃ suv bilan quyuq tuman bergani uchun 98% H₂SO₄ da eritib oleum olinadi',
            tenglama: '2SO₂ + O₂ ⇄(400–450°C, V₂O₅) 2SO₃ + Q   |   H₂SO₄ + nSO₃ → H₂SO₄·nSO₃ (n=1: H₂S₂O₇)',
            bosqichlar: [
              { nom: '1. Kataliz (V₂O₅)', tur: 'kataliz', ichi: '2SO₂+O₂ (400–450°C)', mahsulot: 'SO₃ (Mr=80)', rang: '#fbbf24' },
              { nom: '2. SO₃ fizikasi', tur: 'sovutkich', ichi: 'Tq=45°C, Ts=17°C', mahsulot: 'Oq kristall (<17°)', rang: '#38bdf8' },
              { nom: '3. Oleum olish', tur: 'minora', ichi: '98% H₂SO₄ + nSO₃', mahsulot: 'H₂SO₄·nSO₃', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Kislotali oksid', v: 'SO₃+H₂O=H₂SO₄+Q; CaSO₄, Na₂SO₄', rang: '#38bdf8' },
              { k: 'Oleum (138-b)', v: 'H₂SO₄·nSO₃ (n=1 → pirosulfat H₂S₂O₇)', rang: '#34d399' },
            ],
          },
          pastki: ['SO₃: Tq=45°C suyuqlik, <17°C oq kristall', 'SO₃ + H₂O tuman beradi → 98% H₂SO₄ ga yutiladi', 'Oleum: H₂SO₄·nSO₃ (n=1 bo\'lsa H₂S₂O₇)'],
        },
      ]}
    />
  );
}

function Korgazma31Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 138-bet savol va masalalari (1, 3, 4-masalalar)"
      ikon="formula"
      variantlar={[
        {
          id: 'm1_3',
          tugma: '1-m (50% S → SO₂) & 3-m (15 g FeS₂)',
          formula: '50/32 : 50/16 = 1:2 → SO₂ (D=2,21) • 5,6 l SO₂ (0,25 mol) → 0,125 mol FeS₂ = 15 g',
          tur: 'hisob',
          cfg: {
            sarlavha: '1-savol (50% S + 50% O → SO₂) va 3-masala (5,6 l SO₂ uchun pirit FeS₂)',
            tenglama: '1) n(S):n(O) = 1,5625:3,125 = 1:2 → SO₂   |   3) 0,25 mol SO₂ / 2 · 120 = 15 g FeS₂',
            qadamlar: [
              { belgi: '1-s: 50/32 : 50/16', natija: '1 : 2 → SO₂', izoh: 'D_havo = 64/29 ≈ 2,21', rang: '#38bdf8' },
              { belgi: '3-m: n(SO₂) = 5,6/22,4', natija: '0,25 mol SO₂', izoh: 'n(FeS₂) = 0,25/2 = 0,125', rang: '#fbbf24' },
              { belgi: 'm(FeS₂) = 0,125 · 120', natija: '15 g pirit', izoh: 'M(FeS₂) = 120 g/mol', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '1-m: D_havo(SO₂)', foiz: 55, qiymat: 'SO₂ (D = 2,21)', rang: '#38bdf8' },
              { nom: '3-m: m(FeS₂)', foiz: 100, qiymat: '15 g pirit (0,125 mol)', rang: '#34d399' },
            ],
            javobBadge: '1-savol: SO₂ (D_havo=2,21);  3-masala: 15 g pirit (FeS₂)',
          },
          pastki: ['50% S + 50% O → 1,5625:3,125 = 1:2 → SO₂', 'D_havo(SO₂) = 64 / 29 ≈ 2,21', '5,6 l SO₂ → 0,125 mol FeS₂ · 120 = 15 g'],
        },
        {
          id: 'm4',
          tugma: '4-savol: Ca(OH)₂ + SO₂ & Oleum',
          formula: 'Ca(OH)₂ + SO₂ = CaSO₃↓ → ortiqcha SO₂ da Ca(HSO₃)₂ ga eriydi!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '138-bet 4-savol: ohakli suv bilan SO₂ hamda oleum farqi',
            tenglama: 'Ca(OH)₂ + SO₂ = CaSO₃↓ + H₂O   →(+H₂O+SO₂)→   Ca(HSO₃)₂ (eriydi!)',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Ohakli suv + SO₂',
            stakanSarlavha: 'Loyqa → Eruvchan',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'CaSO₃↓ (eriydi)',
            reagentlar: [
              { belgi: 'Ca²⁺', rang: '#38bdf8' },
              { belgi: 'HSO₃⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: '1-bosqich', v: 'Ca(OH)₂ + SO₂ = CaSO₃↓ + H₂O (loyqa)', rang: '#f8fafc' },
              { k: 'Ortiqcha SO₂', v: 'CaSO₃ + H₂O + SO₂ = Ca(HSO₃)₂ (eriydi)', rang: '#34d399' },
              { k: 'Oleum farqi', v: 'SO₃ + 98% H₂SO₄ → H₂SO₄·nSO₃', rang: '#fde047' },
            ],
          },
          pastki: ['Ca(OH)₂ + SO₂ → oq CaSO₃↓ cho\'kma', 'Ortiqcha SO₂ da eruvchan Ca(HSO₃)₂ ga o\'tadi', 'SO₃ esa 98% H₂SO₄ da oleum beradi'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (30-§) VA O'YINLAR (31-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '30-§ (134-bet): Laboratoriyada H₂S olish uchun qaysi reaktivlar ishlatiladi?',
    variantlar: [
      { matn: 'Na₂SO₄ + HCl', togri: false },
      { matn: 'Cu + HCl', togri: false },
      { matn: 'FeS + 2HCl = FeCl₂ + H₂S↑ (Kipp apparatida)', togri: true },
      { matn: 'Fe + H₂O', togri: false },],
    izoh: '134-bet: temir(II) sulfidga xlorid kislota ta\'sir ettiriladi.',
  },
  {
    id: 't2',
    savol: 'H₂S kislorod YETISHMAGANDA yonish tenglamasi:',
    variantlar: [
      { matn: '2H₂S + O₂ = 2S↓ (sariq cho\'kma) + 2H₂O', togri: true },
      { matn: '2H₂S + 3O₂ = 2SO₂ + 2H₂O', togri: false },
      { matn: 'H₂S + O₂ = H₂SO₄', togri: false },
      { matn: 'Reaksiya bormaydi', togri: false },],
    izoh: '134-bet: chala yonishda erkin S↓ cho\'kadi.',
  },
  {
    id: 't3',
    savol: 'H₂S va sulfidlar (S²⁻) uchun sifat reaktivi qaysi tuz?',
    variantlar: [
      { matn: 'AgNO₃', togri: false },
      { matn: 'BaCl₂', togri: false },
      { matn: 'NaOH', togri: false },
      { matn: 'Pb(NO₃)₂ — qora PbS↓ cho\'kma', togri: true },],
    izoh: '135-bet: S²⁻ + Pb²⁺ = PbS↓ (qora).',
  },
  {
    id: 't4',
    savol: 'Havoda H₂S ning zaharlanish konsentratsiyasi va ruxsat etilgan chegarasi:',
    variantlar: [
      { matn: '10% va 1 ml/l', togri: false },
      { matn: '0,1% zaharli; chegara 0,01 ml/l', togri: true },
      { matn: '1% va 0,1 ml/l', togri: false },
      { matn: '5% va 0,5 ml/l', togri: false },],
    izoh: '134-bet: 0,1% H₂S juda xavfli, chegara 0,01 ml/l.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'so2_olish', nom: 'SO₂ Fizika & Olish', tavsif: 'Tq=-10°C, 36 V, Cu, FeS₂' },
    { id: 'so2_xossa', nom: 'SO₂ Xossa & Qo\'llash', tavsif: 'NaHSO₃, 3S↓, Oqartirish' },
    { id: 'so3_masala', nom: 'SO₃, Oleum & Masalalar', tavsif: '45°/17°C, H₂S₂O₇, 15 g' },
  ],
  topshiriqlar: [
    { nom: 'Mr=64, D_havo=2,21; Tq=-10°C, Ts=-73°C', qisqa: '1 V suvda 36 V; chegara 0,03–0,05 mg/l', guruh: 'so2_olish', izoh: '136-bet SO₂ fizikasi.' },
    { nom: 'Na₂SO₃+H₂SO₄ → SO₂↑; Cu+2H₂SO₄(kons) → SO₂↑', qisqa: 'Laboratoriya olish usullari', guruh: 'so2_olish', izoh: 'S⁺⁶ dan S⁺⁴ gacha qaytadi.' },
    { nom: '4FeS₂+11O₂ → 8SO₂; 2ZnS+3O₂ → 2SO₂', qisqa: 'Pirit & ZnS kuydirish', guruh: 'so2_olish', izoh: '137-bet sanoat usullari.' },
    { nom: 'CaO+SO₂=CaSO₃; NaOH+SO₂(ort.)=NaHSO₃', qisqa: 'Ca(OH)₂→CaSO₃↓→Ca(HSO₃)₂', guruh: 'so2_xossa', izoh: 'Kislotali oksid va ortiqcha SO₂.' },
    { nom: '2SO₂+O₂⇄2SO₃ (V₂O₅); 2H₂S+SO₂=2H₂O+3S↓', qisqa: 'Ham qaytaruvchi, ham oksidlovchi', guruh: 'so2_xossa', izoh: 'SO₂ + Cl₂ + 2H₂O = H₂SO₄ + 2HCl.' },
    { nom: 'Jun/ipak/somon oqartirish, turshak dudlash', qisqa: 'Bochka dezinf., H₂SO₄, Ca(HSO₃)₂', guruh: 'so2_xossa', izoh: '137-bet qo\'llanishi.' },
    { nom: 'SO₃ (Mr=80): Tq=45°C, Ts=17°C oq kristall', qisqa: '400–450°C V₂O₅ katalizator', guruh: 'so3_masala', izoh: 'SO₃+CaO=CaSO₄.' },
    { nom: 'Oleum: H₂SO₄ + nSO₃ → H₂SO₄·nSO₃ (H₂S₂O₇)', qisqa: '98% H₂SO₄ ga yuttiriladi', guruh: 'so3_masala', izoh: 'Suv bilan quyuq tuman beradi.' },
    { nom: '50% S + 50% O → SO₂; 5,6 l SO₂ → 15 g FeS₂', qisqa: '0,125 mol · 120 = 15 g', guruh: 'so3_masala', izoh: '138-bet 1 va 3-masalalar.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'SO₂ fizikasi',
    savol: 'SO₂ ning qaynash va muzlash haroratlari, 1 hajm suvda eruvchanligi:',
    variantlar: ['-60°C, -82°C; 2,5 V', '0°C, 100°C; 2 V', 'Tq=-10°C, Ts=-73°C; 1 V suvda 36 V', '45°C, 17°C; 500 V'],
    togri: 2,
    izoh: '136-bet: SO₂ bosimsiz ham osongina suyuqlanadi.',
  },
  {
    belgi: 'Lab SO₂',
    savol: 'Mis (Cu) konsentrlangan sulfat kislota bilan qizdirilganda qaysi gaz chiqadi?',
    variantlar: ['SO₂↑ (+ CuSO₄ + 2H₂O)', 'H₂↑', 'H₂S↑', 'O₂↑'],
    togri: 0,
    izoh: 'Cu + 2H₂SO₄(kons) = CuSO₄ + SO₂↑ + 2H₂O.',
  },
  {
    belgi: 'Ortiqcha SO₂',
    savol: 'Ohakli suvdan (Ca(OH)₂) ortiqcha SO₂ o\'tkazilsa tushgan CaSO₃↓ nima bo\'ladi?',
    variantlar: ['Qorayadi', 'O\'zgarmaydi', 'Sariq bo\'ladi', 'Eriydi: Ca(HSO₃)₂ hosil bo\'ladi'],
    togri: 3,
    izoh: '138-bet 4-savol: CaSO₃ + H₂O + SO₂ = Ca(HSO₃)₂.',
  },
  {
    belgi: 'Ikki yoqlama',
    savol: 'SO₂ qaysi reaksiyada OKSIDLOVCHI rolini bajaradi?',
    variantlar: ['2SO₂ + O₂ ⇄ 2SO₃', '2H₂S + SO₂ = 2H₂O + 3S↓', 'SO₂ + 2NaOH', 'SO₂ + Cl₂ + 2H₂O'],
    togri: 1,
    izoh: 'S⁺⁴ → S⁰ gacha qaytariladi (S↓ cho\'kadi).',
  },
  {
    belgi: 'SO₃ fizikasi',
    savol: 'Oltingugurt(VI) oksid (SO₃) qaysi haroratda qaynaydi va oq kristallga aylanadi?',
    variantlar: ['Tq = -10°C va Ts = -73°C', 'Tq = 45°C va Ts = 17°C', '100°C va 0°C', '444,5°C va 112,8°C'],
    togri: 1,
    izoh: '137-bet: <17°C da oq ipaksimon kristall.',
  },
  {
    belgi: 'Oleum',
    savol: 'Nima uchun SO₃ suvga emas, 98% H₂SO₄ ga yuttiriladi va nima olinadi?',
    variantlar: ['Reaksiya bormaydi', 'Gaz chiqadi', 'Portlaydi', 'Tuman bermaslik uchun — oleum H₂SO₄·nSO₃ (H₂S₂O₇)'],
    togri: 3,
    izoh: '138-bet: n=1 bo\'lsa pirosulfat kislota H₂S₂O₇.',
  },
  {
    belgi: '138-b 1-savol',
    savol: '50% S va 50% O li oksid formulasi va havoga nisbatan zichligi:',
    variantlar: ['SO₂ va D_havo ≈ 2,21', 'SO va 1,65', 'SO₃ va 2,76', 'S₂O₃ va 3,86'],
    togri: 0,
    izoh: '50/32 : 50/16 = 1:2 → SO₂ (64/29 = 2,21).',
  },
  {
    belgi: '138-b 3-masala',
    savol: '5,6 litr SO₂ olish uchun necha gramm pirit (FeS₂, M=120) kuydiriladi?',
    variantlar: ['30 g', '60 g', '15 g (0,125 mol FeS₂)', '7,5 g'],
    togri: 2,
    izoh: '0,25 mol SO₂ uchun yarim miqdor 0,125 mol FeS₂ = 15 g.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '137–138-bet: Piritdan oleumgacha zanjir',
    vazifa: 'Piritdan oleum olish bosqichlarini tartiblang:',
    tartib: [
      '1. 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '2. 2SO₂ + O₂ ⇄ 2SO₃ + Q (V₂O₅ ishtirokida)',
      '3. H₂SO₄ + nSO₃ → H₂SO₄·nSO₃ (oleum)',
      '4. H₂SO₄·nSO₃ + nH₂O → (n+1)H₂SO₄',
    ],
    variantlar: [
      '3. H₂SO₄ + nSO₃ → H₂SO₄·nSO₃ (oleum)',
      '1. 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '4. H₂SO₄·nSO₃ + nH₂O → (n+1)H₂SO₄',
      '2. 2SO₂ + O₂ ⇄ 2SO₃ + Q (V₂O₅ ishtirokida)',
    ],
  },
  {
    tur: '138-bet 3-masala: 5,6 l SO₂ → FeS₂',
    vazifa: '5,6 l SO₂ olish uchun FeS₂ massasini hisoblash tartibi:',
    tartib: [
      '1. n(SO₂) = 5,6 / 22,4 = 0,25 mol',
      '2. 4FeS₂ → 8SO₂ dan n(FeS₂) = 0,25 / 2 = 0,125 mol',
      '3. M(FeS₂) = 56 + 64 = 120 g/mol',
      '4. m(FeS₂) = 0,125 · 120 = 15 g',
    ],
    variantlar: [
      '2. 4FeS₂ → 8SO₂ dan n(FeS₂) = 0,25 / 2 = 0,125 mol',
      '4. m(FeS₂) = 0,125 · 120 = 15 g',
      '1. n(SO₂) = 5,6 / 22,4 = 0,25 mol',
      '3. M(FeS₂) = 56 + 64 = 120 g/mol',
    ],
  },
  {
    tur: '138-bet 1-savol: 50% S + 50% O → D_havo',
    vazifa: 'Oksid formulasini va D_havo sini topish tartibini joylang:',
    tartib: [
      '1. n(S) : n(O) = 50/32 : 50/16 = 1,5625 : 3,125',
      '2. Eng kichik nisbat = 1 : 2 → Formula SO₂',
      '3. Mr(SO₂) = 32 + 2·16 = 64',
      '4. D_havo(SO₂) = 64 / 29 ≈ 2,21',
    ],
    variantlar: [
      '3. Mr(SO₂) = 32 + 2·16 = 64',
      '4. D_havo(SO₂) = 64 / 29 ≈ 2,21',
      '1. n(S) : n(O) = 50/32 : 50/16 = 1,5625 : 3,125',
      '2. Eng kichik nisbat = 1 : 2 → Formula SO₂',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Havodagi SO₂ ning ruxsat etilgan ekologik chegarasi (136-bet):',
    variantlar: ['10 mg/l', '0,03–0,05 mg/l', '1 g/l', '5%'],
    togri: 1,
    izoh: 'Kislotali yomg\'ir keltirib chiqaruvchi zaharli gaz.',
  },
  {
    savol: '2SO₂ + O₂ ⇄ 2SO₃ + Q reaksiyasining sharoiti (137-bet):',
    variantlar: ['Sovuqda, katalizatorsiz', 'Suvda eritmada', '1000°C, Fe katalizator', '400–450°C, katalizator V₂O₅'],
    togri: 3,
    izoh: 'Vanadiy(V) oksid katalizatori ishlatiladi.',
  },
  {
    savol: 'Qog\'oz ishlab chiqarishda SO₂ dan qaysi tuz tayyorlanadi (137-bet)?',
    variantlar: ['Ca(HSO₃)₂ sulfit eritmasi', 'CaSO₄', 'NaCl', 'K₂S'],
    togri: 0,
    izoh: 'Sellyuloza olishda sulfit eritmasi.',
  },
  {
    savol: 'SO₂ + Cl₂ + 2H₂O reaksiyasida qaysi kislotalar hosil bo\'ladi?',
    variantlar: ['H₂SO₃ + HClO', 'Faqat HCl', 'H₂SO₄ + 2HCl', 'H₂S + ClO₂'],
    togri: 2,
    izoh: 'SO₂ qaytaruvchi sifatida H₂SO₄ gacha oksidlanadi.',
  },
  {
    savol: 'Nima uchun SO₂ bilan oqartirilgan jun va somon vaqt o\'tgach sarg\'ayishi mumkin?',
    variantlar: ['Suv muzlaydi', 'Kislota bug\'lanadi', 'Yorug\'lik va O₂ ta\'sirida birikmalar parchalanadi', 'Oltingugurt cho\'kadi'],
    togri: 2,
    izoh: '137-bet: organik bo\'yoq bilan qaytar birikma hosil qiladi.',
  },
  {
    savol: 'Oleumdagi pirosulfat kislota (n=1) formulasi:',
    variantlar: ['H₂S₂O₇ (H₂SO₄·SO₃)', 'H₂SO₄', 'H₂SO₃', 'H₂S'],
    togri: 0,
    izoh: '138-bet: H₂SO₄ + nSO₃ → H₂SO₄·nSO₃.',
  },
  {
    savol: 'SO₃ + CaO reaksiyasida qaysi gips asosi tuzi hosil bo\'ladi?',
    variantlar: ['CaSO₃', 'CaSO₄', 'CaS', 'CaOCl₂'],
    togri: 1,
    izoh: 'SO₃ — tipik kuchli kislotali oksid.',
  },
  {
    savol: 'Meva-sabzavotlarni (turshak, mayiz) quritishda nima uchun SO₂ dudlanadi?',
    variantlar: ['Shirali qilish uchun', 'Og\'ir qilish uchun', 'Muzlatish uchun', 'Bakteriya, mog\'or va hasharotlarni yo\'qotish uchun'],
    togri: 3,
    izoh: '137-bet: konservant va dezinfeksiya xossasi.',
  },
];

export default function S8Mavzu31() {
  const korgazmalar = [
    { nom: '1. SO₂ (Tq=-10°, 36 V)', ikon: 'atom', komponent: <KorgazmaSO2TuzilishFizik /> },
    { nom: '2. Lab & Sanoat (FeS₂)', ikon: 'kolba', komponent: <KorgazmaSO2Olinishi /> },
    { nom: '3. Kislotali & 2 yoqlama OQR', ikon: 'uchqun', komponent: <KorgazmaSO2KimyoviyXossa /> },
    { nom: '4. Qo\'llanishi (Oqart., Meva)', ikon: 'filtr', komponent: <KorgazmaSO2Qollanishi /> },
    { nom: '5. SO₃ (45°/17°) & Oleum', ikon: 'kolba', komponent: <KorgazmaSO3VaOleum /> },
    { nom: '6. 138-b masalalari', ikon: 'formula', komponent: <Korgazma31Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-31"
          nom="SO₂ va SO₃ xossalarini guruhlang"
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
          key="tezkor-31"
          nom="31-§: SO₂, SO₃ va Oleum"
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
          key="zanjir-31"
          nom="Piritdan oleumgacha zanjir"
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
          key="duel-31"
          sarlavha="31-§: SO₂ va SO₃ dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="31-§"
      mavzuNom="Oltingugurtning kislorodli birikmalari"
      oldingiRaqam="30-§"
      oldingiNom="Oltingugurtning vodorodli birikmalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
