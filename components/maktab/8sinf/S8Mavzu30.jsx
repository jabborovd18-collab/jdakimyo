'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 30-PARAGRAF
// "Oltingugurtning vodorodli birikmalari" (Darslik 134-136-betlar)
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
function KorgazmaH2STuzilishFizik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. H₂S tuzilishi, eruvchanligi va zahari (134-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'fizika',
          tugma: 'H–S–H & Eruvchanlik, Xavf',
          formula: 'Ts=-82,30°C • Tq=-60,28°C • 1 l suvda 2,536 l (3,85 g) • 0,1% zahar (chegara 0,01 ml/l)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Vodorod sulfid (H₂S, Mr=34): palag\'da tuxum hidli zaharli gaz',
            tenglama: 'D_havo = 34/29 = 1,17   |   Ts = -82,30°C   |   Tq = -60,28°C   |   1 l H₂O: 2,536 l (3,85 g)',
            markaz: { belgi: 'S', rang: '#fde047', r: 24 },
            atomlar: [
              { belgi: 'H', rang: '#38bdf8', r: 14, masofa: 68, bog: 1, burchak: -0.55 },
              { belgi: 'H', rang: '#38bdf8', r: 14, masofa: 68, bog: 1, burchak: 0.55 },
            ],
            metrikalar: [
              { nom: 'Zaharlanish chegarasi', qiymat: '0,1% (xavfsiz <0,01 ml/l)', foiz: 90, rang: '#fb7185' },
              { nom: 'Suvda erishi (1 l da)', qiymat: '2,536 l (3,85 g)', foiz: 60, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Ta\'siri', v: 'Gemoglobin Fe ni bog\'lab nafasni bo\'g\'adi', rang: '#fb7185' },
              { k: 'Shart', v: 'Tajriba faqat mo\'rili shkafda!', rang: '#fde047' },
            ],
          },
          pastki: ['Ts=-82,30°C, Tq=-60,28°C; D_havo=1,17', '1 l suvda 2,536 l (3,85 g) eriydi', '0,1% kuchli zahar; chegara: 0,01 ml/l'],
        },
      ]}
    />
  );
}

function KorgazmaH2SOlinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Laboratoriyada va sintez bilan olish (134-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab_sintez',
          tugma: 'Kipp (FeS+2HCl) & Sintez',
          formula: 'Lab: FeS + 2HCl = FeCl₂ + H₂S↑ • Sintez (200–350°C): H₂ + S = H₂S',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Kipp apparatida FeS + 2HCl dan va 200–350°C da suyuq S + H₂ sintezi',
            tenglama: 'FeS(q) + 2HCl = FeCl₂ + H₂S↑   |   H₂ + S(suyuq, 200–350°C) = H₂S',
            ikkiIdish: true,
            suyuqlikRang: '#34d399',
            stakanBelgi: 'FeS + 2HCl',
            stakanSarlavha: 'Kipp apparati',
            ikkinchiSuyuqlikRang: '#fde047',
            ikkinchiBelgi: 'H₂S↑ yig\'ish',
            ikkinchiSarlavha: 'D_havo = 1,17',
            reagentlar: [
              { belgi: 'Fe²⁺', rang: '#34d399' },
              { belgi: 'H₂S', rang: '#fde047' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂S↑',
            belgilar: [
              { k: 'Lab (Kipp)', v: 'FeS + 2HCl = FeCl₂ + H₂S↑', rang: '#34d399' },
              { k: 'Sintez', v: 'H₂ + S(suyuq) —200–350°C→ H₂S', rang: '#fde047' },
              { k: 'Yig\'ish', v: 'Havodan 1,17× og\'ir (tubida)', rang: '#38bdf8' },
            ],
          },
          pastki: ['Kipp apparati: FeS + 2HCl = FeCl₂ + H₂S↑', 'Sintez: 200–350°C suyuq S + H₂ = H₂S', 'Havodan og\'ir gaz (D_havo = 1,17)'],
        },
      ]}
    />
  );
}

function KorgazmaH2SYonish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Vodorod sulfidning to'liq va chala yonishi (134-bet)"
      ikon="olov"
      variantlar={[
        {
          id: 'toliq_chala',
          tugma: 'O₂ yetarli (SO₂) vs Chala (S↓)',
          formula: 'To\'liq: 2H₂S + 3O₂ = 2SO₂ + 2H₂O • Chala: 2H₂S + O₂ = 2S↓ + 2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'O₂ yetarli bo\'lsa SO₂↑ (+4), yetishmasa erkin sariq S↓ (0) cho\'kadi',
            tenglama: '2H₂S⁻² + 3O₂ = 2S⁺⁴O₂ + 2H₂O   |   2H₂S⁻² + O₂ = 2S⁰↓ + 2H₂O',
            qizdir: true,
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'H₂S + O₂',
            stakanSarlavha: 'Yonish rejimlari',
            chokmaRang: '#fde047',
            chokmaBelgi: 'Chala: S⁰↓',
            gazRang: '#38bdf8',
            gazBelgi: 'To\'liq: SO₂↑',
            reagentlar: [
              { belgi: 'SO₂', rang: '#38bdf8' },
              { belgi: 'S⁰', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'To\'liq yonish', v: '2H₂S + 3O₂ = 2SO₂ + 2H₂O (+4)', rang: '#38bdf8' },
              { k: 'Chala yonish', v: '2H₂S + O₂ = 2S↓ + 2H₂O (0)', rang: '#fde047' },
              { k: 'Sanoatda', v: 'Chala yonish — H₂S dan S olish!', rang: '#34d399' },
            ],
          },
          pastki: ['2H₂S + 3O₂ = 2SO₂ + 2H₂O (S⁻² → S⁺⁴)', '2H₂S + O₂ = 2S↓ + 2H₂O (S⁻² → S⁰)', 'Chala yonish — oltingugurt olishda muhim!'],
        },
      ]}
    />
  );
}

function KorgazmaH2SQaytaruvchi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Kuchli qaytaruvchilik: FeCl₃, Cl₂, H₂SO₄ bilan (135-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'qaytarish',
          tugma: 'FeCl₃, Galogen, H₂SO₄ bilan',
          formula: '2FeCl₃+H₂S=2FeCl₂+2HCl+S↓ • H₂S+Cl₂=2HCl+S↓ • 3H₂S+H₂SO₄=4S↓+4H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'S⁻² kuchli qaytaruvchi sifatida Fe³⁺, Cl₂ va H₂SO₄ (S⁺⁶) ni qaytaradi',
            tenglama: '2Fe⁺³Cl₃ + H₂S⁻² = 2Fe⁺²Cl₂ + 2HCl + S⁰↓   |   3H₂S⁻² + H₂S⁺⁶O₄ = 4S⁰↓ + 4H₂O',
            suyuqlikRang: '#34d399',
            stakanBelgi: 'FeCl₃/H₂SO₄+H₂S',
            stakanSarlavha: 'Fe⁺³→Fe⁺² (yashil)',
            chokmaRang: '#fde047',
            chokmaBelgi: 'S⁰↓ (sariq)',
            reagentlar: [
              { belgi: 'Fe²⁺', rang: '#34d399' },
              { belgi: 'S⁰', rang: '#fde047' },
            ],
            elektronJuft: { chap: 'S⁻²', ong: 'Fe³⁺/S⁺⁶', e: '2ē' },
            belgilar: [
              { k: 'FeCl₃ bilan', v: '2FeCl₃+H₂S = 2FeCl₂ (och yashil)+2HCl+S↓', rang: '#34d399' },
              { k: 'Galogen bilan', v: 'H₂S+Cl₂=2HCl+S↓; H₂S+Br₂=2HBr+S↓', rang: '#38bdf8' },
              { k: 'Sinproporsiya', v: '3H₂S⁻² + H₂S⁺⁶O₄ = 4S⁰↓ + 4H₂O', rang: '#fde047' },
            ],
          },
          pastki: ['Fe⁺³ → Fe⁺² och yashil + S↓ loyqasi', 'Galogenli suvni rangsizlantirib S↓ tushiradi', '3H₂S + H₂SO₄ = 4S↓ + 4H₂O (ikkisi ham S⁰!)'],
        },
      ]}
    />
  );
}

function KorgazmaSulfidKislotaVaSifat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Sulfid kislota va S²⁻ ga Pb(NO₃)₂ sifat testi (135-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'pbs',
          tugma: 'S²⁻ + Pb²⁺ = PbS↓ (QORA!)',
          formula: 'H₂S + Pb(NO₃)₂ = PbS↓ (qora!) + 2HNO₃ • CuCl₂ + H₂S = CuS↓ + 2HCl',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Sifat reaktivi Pb(NO₃)₂: qisqa ionli tenglama S²⁻ + Pb²⁺ = PbS↓ (qora)',
            tenglama: 'Na₂S + Pb(NO₃)₂ = PbS↓ (QORA) + 2NaNO₃   |   CuCl₂ + H₂S = CuS↓ (QORA, kisl. erimaydi)',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'S²⁻ + Pb(NO₃)₂',
            stakanSarlavha: 'Sifat reaksiyasi',
            chokmaRang: '#1e293b',
            chokmaBelgi: 'PbS↓ / CuS↓ QORA',
            reagentlar: [
              { belgi: 'Pb²⁺', rang: '#94a3b8' },
              { belgi: 'S²⁻', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Qisqa ionli', v: 'S²⁻ + Pb²⁺ = PbS↓ (qora cho\'kma)', rang: '#fde047' },
              { k: 'Kislota xossa', v: '2KOH+H₂S=K₂S+2H₂O; CaO+H₂S=CaS+H₂O', rang: '#38bdf8' },
              { k: 'Mis tuzi', v: 'CuCl₂+H₂S = CuS↓ (qora, kisl. erimaydi)', rang: '#fb7185' },
            ],
          },
          pastki: ['S²⁻ + Pb²⁺ = PbS↓ (qora cho\'kma sifat testi)', 'Ishqor/oksid: K₂S + 2H₂O; CaS + H₂O', 'CuS↓ qora cho\'kmasi kislotada erimaydi'],
        },
      ]}
    />
  );
}

function Korgazma30Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 135–136-bet savol va masalalari"
      ikon="formula"
      variantlar={[
        {
          id: 'm136',
          tugma: '1, 2, 4, 5-savollar (266,7 l havo)',
          formula: 'D_H2=17; D_havo=1,17 • Pb(NO₃)₂ qog\'oz → qora • 80 g S → 56 l O₂ → 266,7 l havo',
          tur: 'hisob',
          cfg: {
            sarlavha: '135–136-bet: H₂S zichligi, lab qog\'ozi va 80 g S → havo hajmi',
            tenglama: '80 g S = 2,5 mol → 2,5 mol O₂ = 56 l → V(havo) = 56 / 0,21 = 266,7 l',
            qadamlar: [
              { belgi: '1–2-s: H₂S (Mr=34)', natija: 'D_H2=17; D_havo=1,17', izoh: 'Pb(NO₃)₂ qog\'oz qorayadi', rang: '#fde047' },
              { belgi: '4-s: 80 g S (2,5 mol O₂)', natija: '56 l O₂ → 266,7 l havo', izoh: '56 / 0,21 = 266,7 l', rang: '#38bdf8' },
              { belgi: '5-s: CuSO₄ + H₂S', natija: 'CuS↓ (qora) + H₂SO₄', izoh: 'Mis(II) sulfid cho\'kmasi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Sof kislorod O₂', foiz: 21, qiymat: '56,0 litr (2,5 mol)', rang: '#34d399' },
              { nom: 'Havo hajmi (21% O₂)', foiz: 100, qiymat: '266,7 litr havo', rang: '#38bdf8' },
            ],
            javobBadge: 'D_H2=17; D_havo=1,17  •  80 g S → 266,7 l havo  •  CuS↓ (qora)',
          },
          pastki: ['D_H2(H₂S) = 17; D_havo(H₂S) = 1,17', 'Pb(NO₃)₂ shimdirilgan qog\'oz PbS ga qorayadi', '80 g S → 56 l O₂ → 266,7 l havo (21% O₂)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (29-§) VA O'YINLAR (30-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '29-§: Oltingugurt kukuni suvda ho\'llanmay qalqishi qaysi usulda qo\'llanadi?',
    variantlar: [
      { matn: 'Distillash', togri: false },
      { matn: 'Elektroliz', togri: false },
      { matn: 'Flotatsiya usuli (bekorchi jinsdan tozalash)', togri: true },
      { matn: 'Kristallash', togri: false },],
    izoh: '132-bet: ρ = 2 g/cm³ bo\'lsa ham ho\'llanmay qalqiydi.',
  },
  {
    id: 't2',
    savol: '444,5°C gacha qizdirilgan S sovuq suvga quyilganda olinadigan shakl:',
    variantlar: [
      { matn: 'Plastik oltingugurt (Sn)', togri: true },
      { matn: 'Rombik S₈', togri: false },
      { matn: 'Monoklinik S₈', togri: false },
      { matn: 'Oq fosfor', togri: false },],
    izoh: '132-bet: cho\'ziluvchan plastik massa olinadi.',
  },
  {
    id: 't3',
    savol: 'Taxir tuz va Glauber tuzining formulalari:',
    variantlar: [
      { matn: 'NaCl va CaSO₄', togri: false },
      { matn: 'FeS₂ va ZnS', togri: false },
      { matn: 'KCl va Cu₂S', togri: false },
      { matn: 'MgSO₄·7H₂O (Taxir) va Na₂SO₄·10H₂O (Glauber)', togri: true },],
    izoh: '131-bet: tabiiy sulfat kristallogidratlari.',
  },
  {
    id: 't4',
    savol: 'Oltingugurt qaysi element bilan maksimal +6 oksidlanish darajasini beradi?',
    variantlar: [
      { matn: 'Kislorod bilan (SO₂)', togri: false },
      { matn: 'Ftor bilan (S + 3F₂ = SF₆)', togri: true },
      { matn: 'Temir bilan (FeS)', togri: false },
      { matn: 'Xlor bilan (SCl₂)', togri: false },],
    izoh: '133-bet: S + 3F₂ = SF₆ (+6).',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'fizik_olish', nom: 'Fizika & Olish', tavsif: '-82,3°C, 2,536 l, FeS+HCl' },
    { id: 'yonish_oqr', nom: 'Yonish & Qaytaruvchi', tavsif: 'SO₂/S↓, FeCl₃, H₂SO₄' },
    { id: 'sifat_masala', nom: 'Sifat testi & Masala', tavsif: 'PbS↓, CuS↓, 266,7 l' },
  ],
  topshiriqlar: [
    { nom: 'Ts=-82,30°C, Tq=-60,28°C; D_havo=1,17', qisqa: '1 l suvda 2,536 l (3,85 g)', guruh: 'fizik_olish', izoh: 'Mr=34, palag\'da tuxum hidi.' },
    { nom: '0,1% zaharli; chegara 0,01 ml/l (gemoglobin)', qisqa: 'Faqat mo\'rili shkafda!', guruh: 'fizik_olish', izoh: '134-bet xavfsizlik qoidasi.' },
    { nom: 'FeS+2HCl = FeCl₂+H₂S↑; H₂+S(200–350°C)=H₂S', qisqa: 'Kipp va sintez usuli', guruh: 'fizik_olish', izoh: '134-bet olish usullari.' },
    { nom: '2H₂S+3O₂=2SO₂+2H₂O; 2H₂S+O₂=2S↓+2H₂O', qisqa: 'To\'liq va chala yonish', guruh: 'yonish_oqr', izoh: 'Chala yonishdan S olinadi.' },
    { nom: '2FeCl₃+H₂S=2FeCl₂+2HCl+S↓; H₂S+Cl₂/Br₂', qisqa: 'Fe⁺³ → Fe⁺² och yashil', guruh: 'yonish_oqr', izoh: 'Galogenli suv rangsizlanadi.' },
    { nom: '3H₂S⁻² + H₂S⁺⁶O₄ = 4S⁰↓ + 4H₂O', qisqa: 'Sinproporsiyalanish', guruh: 'yonish_oqr', izoh: '135-bet: ikkalasi S⁰ ga o\'tadi.' },
    { nom: 'S²⁻ + Pb²⁺ = PbS↓ (qora cho\'kma sifat testi)', qisqa: 'Pb(NO₃)₂ qog\'oz qorayadi', guruh: 'sifat_masala', izoh: '135-bet 2-savol ham.' },
    { nom: 'CuCl₂+H₂S = CuS↓ (qora, kisl. erimaydi)', qisqa: '2KOH+H₂S=K₂S; CaO→CaS', guruh: 'sifat_masala', izoh: 'CuSO₄+H₂S = CuS↓+H₂SO₄.' },
    { nom: '80 g S → 56 l O₂ → 266,7 l havo (21%)', qisqa: 'D_H2=17; D_havo=1,17', guruh: 'sifat_masala', izoh: '136-bet 1 va 4-masalalar.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Zahar & Eruvch.',
    savol: '1 l suvda necha litr H₂S eriydi va havodagi xavfsiz chegarasi qancha?',
    variantlar: ['1 l; 5%', '500 l; 10%', '2,536 l (3,85 g); chegara 0,01 ml/l', '100 l; 1%'],
    togri: 2,
    izoh: '134-bet: 0,1% kuchli zaharli, chegara 0,01 ml/l.',
  },
  {
    belgi: 'Lab & Sintez',
    savol: 'Kipp apparatida H₂S qanday olinadi va sintez harorati nechchi °C?',
    variantlar: ['FeS + 2HCl = FeCl₂ + H₂S↑; sintez 200–350°C', 'Cu + HCl; 50°C', 'NaCl + H₂SO₄; 800°C', 'MnO₂ + HCl; 20°C'],
    togri: 0,
    izoh: '134-bet: FeS + 2HCl va H₂ + S (200–350°C).',
  },
  {
    belgi: 'Chala yonish',
    savol: 'Kislorod yetishmaganda H₂S yonishidan qaysi mahsulot cho\'kadi?',
    variantlar: ['SO₂', 'SO₃', 'H₂SO₄', 'S↓ (erkin sariq oltingugurt)'],
    togri: 3,
    izoh: '2H₂S + O₂ = 2S↓ + 2H₂O.',
  },
  {
    belgi: 'Sinproporsiya',
    savol: '3H₂S + H₂SO₄ = ? reaksiyasida hosil bo\'ladigan mahsulotlar:',
    variantlar: ['2SO₂ + H₂O', '4S↓ + 4H₂O', 'H₂SO₃', 'FeS + H₂'],
    togri: 1,
    izoh: 'S⁻² va S⁺⁶ ikkalasi ham erkin S⁰ ga aylanadi.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'H₂S va S²⁻ ionlari uchun sifat reaktivi va cho\'kma rangi:',
    variantlar: ['AgNO₃ → oq', 'Pb(NO₃)₂ → PbS↓ (qora cho\'kma)', 'BaCl₂ → oq', 'KCl → qizil'],
    togri: 1,
    izoh: 'S²⁻ + Pb²⁺ = PbS↓ (qora).',
  },
  {
    belgi: 'CuS↓ xossasi',
    savol: 'CuCl₂ + H₂S = CuS↓ + 2HCl reaksiyasida tushgan CuS↓ rangi:',
    variantlar: ['Oq', 'Ko\'k', 'Sariq', 'Qora (va kislotada erimaydi!)'],
    togri: 3,
    izoh: '135-bet: CuS ham qora cho\'kma va kislotada erimaydi.',
  },
  {
    belgi: 'D_H2 va D_havo',
    savol: 'Vodorod sulfid (Mr = 34) ning H₂ va havoga nisbatan zichliklari:',
    variantlar: ['17 (H₂) va 1,17 (havo)', '2 va 29', '34 va 17', '64 va 2,21'],
    togri: 0,
    izoh: '34/2 = 17; 34/29 = 1,17.',
  },
  {
    belgi: '136-b 4-masala',
    savol: '80 g oltingugurtni yoqish uchun 21% O₂ tutgan havodan necha litr kerak?',
    variantlar: ['56 l', '112 l', '266,7 litr (56 / 0,21)', '224 l'],
    togri: 2,
    izoh: '2,5 mol S → 2,5 mol O₂ = 56 l → 56/0,21 = 266,7 l.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '134–135-bet: FeS dan PbS↓ gacha',
    vazifa: 'Temir(II) sulfiddan qora PbS↓ cho\'kmasigacha jarayonni tartiblang:',
    tartib: [
      '1. FeS + 2HCl = FeCl₂ + H₂S↑ (Kipp apparati)',
      '2. H₂S ni suvda eritish → sulfid kislota (2,536 l/l)',
      '3. 2KOH + H₂S = K₂S + 2H₂O (eruvchan sulfid)',
      '4. K₂S + Pb(NO₃)₂ = PbS↓ (qora) + 2KNO₃',
    ],
    variantlar: [
      '3. 2KOH + H₂S = K₂S + 2H₂O (eruvchan sulfid)',
      '1. FeS + 2HCl = FeCl₂ + H₂S↑ (Kipp apparati)',
      '4. K₂S + Pb(NO₃)₂ = PbS↓ (qora) + 2KNO₃',
      '2. H₂S ni suvda eritish → sulfid kislota (2,536 l/l)',
    ],
  },
  {
    tur: '134–135-bet: S ning -2 dan +6 gacha o\'tishi',
    vazifa: 'Oksidlanish darajasi ortishi bo\'yicha qadamlarni joylang:',
    tartib: [
      '1. H₂S (OD = -2 — faqat qaytaruvchi)',
      '2. 2H₂S + O₂ = 2S↓ + 2H₂O (OD = 0 ga)',
      '3. 2H₂S + 3O₂ = 2SO₂ + 2H₂O (OD = +4 ga)',
      '4. 2SO₂ + O₂ ⇄ 2SO₃ (OD = +6 ga)',
    ],
    variantlar: [
      '3. 2H₂S + 3O₂ = 2SO₂ + 2H₂O (OD = +4 ga)',
      '1. H₂S (OD = -2 — faqat qaytaruvchi)',
      '4. 2SO₂ + O₂ ⇄ 2SO₃ (OD = +6 ga)',
      '2. 2H₂S + O₂ = 2S↓ + 2H₂O (OD = 0 ga)',
    ],
  },
  {
    tur: '136-bet 4-masala: 80 g S → Havo hajmi',
    vazifa: '80 g S ni oksidlash uchun zarur havo hajmini topish tartibi:',
    tartib: [
      '1. n(S) = 80 / 32 = 2,5 mol',
      '2. S + O₂ = SO₂ dan n(O₂) = 2,5 mol',
      '3. V(O₂) = 2,5 · 22,4 = 56 l',
      '4. V(havo) = 56 / 0,21 = 266,7 l',
    ],
    variantlar: [
      '3. V(O₂) = 2,5 · 22,4 = 56 l',
      '4. V(havo) = 56 / 0,21 = 266,7 l',
      '1. n(S) = 80 / 32 = 2,5 mol',
      '2. S + O₂ = SO₂ dan n(O₂) = 2,5 mol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Vodorod sulfid (H₂S) ning suyuqlanish va qaynash haroratlari:',
    variantlar: ['0°C va 100°C', 'Ts = -82,30°C va Tq = -60,28°C', '-101°C va -34°C', '112,8°C va 444,5°C'],
    togri: 1,
    izoh: '134-bet: Ts = -82,30°C, Tq = -60,28°C.',
  },
  {
    savol: '2FeCl₃ + H₂S = ? tenglamasining mahsulotlari (135-bet):',
    variantlar: ['Fe₂S₃ + HCl', 'Reaksiya bormaydi', 'FeS + Cl₂', '2FeCl₂ + 2HCl + S↓'],
    togri: 3,
    izoh: 'Fe⁺³ och yashil Fe⁺² ga qaytadi va S↓ cho\'kadi.',
  },
  {
    savol: 'Maktab labi havosida H₂S ni aniqlash uchun qaysi qog\'oz ishlatiladi?',
    variantlar: ['Pb(NO₃)₂ yoki Pb(CH₃COO)₂ shimdirilgan qog\'oz (qorayadi)', 'Fenolftalein', 'Lakmus qog\'ozi', 'Kraxmal qog\'ozi'],
    togri: 0,
    izoh: '135-bet 2-savol: PbS hosil bo\'lib qorayadi.',
  },
  {
    savol: 'H₂S va H₂SO₄ sinproporsiyalanishida (3H₂S + H₂SO₄) nima tushadi?',
    variantlar: ['SO₂ gazi', 'H₂ gazi', '4S↓ (erkin oltingugurt) + 4H₂O', 'FeS'],
    togri: 2,
    izoh: '135-bet: S⁻² va S⁺⁶ ikkalasi S⁰ ga o\'tadi.',
  },
  {
    savol: 'H₂S odamni zaharlaganda qondagi qaysi modda bilan bog\'lanadi?',
    variantlar: ['Suv bilan', 'Kalsiy bilan', 'Gemoglobin tarkibidagi Fe bilan', 'Natriy bilan'],
    togri: 2,
    izoh: '134-bet: nafas olishni to\'xtatadi — faqat mo\'rili shkafda!',
  },
  {
    savol: '2KOH + H₂S reaksiyasidan olinadigan eruvchan tuz va asosli oksid (CaO):',
    variantlar: ['K₂S + 2H₂O va CaS + H₂O', 'K₂SO₃ va CaSO₃', 'K₂SO₄ va CaSO₄', 'Reaksiya bormaydi'],
    togri: 0,
    izoh: '135-bet: sulfidlar K₂S va CaS.',
  },
  {
    savol: '2H₂S + 3O₂ to\'liq yonganda qanday rangli alanga va mahsulot beradi?',
    variantlar: ['Sariq alanga; S↓', 'Havo rang alanga; 2SO₂ + 2H₂O', 'Qizil; H₂SO₄', 'Yashil; H₂'],
    togri: 1,
    izoh: '134-bet: havo rang alanga bilan SO₂ gazi chiqadi.',
  },
  {
    savol: 'H₂S + Br₂ reaksiyasi natijasida nima sodir bo\'ladi?',
    variantlar: ['Eritma qorayadi', 'Portlaydi', 'Hech narsa bo\'lmaydi', 'Bromli suv rangsizlanib S↓ cho\'kadi (+ 2HBr)'],
    togri: 3,
    izoh: '135-bet: H₂S galogenlarni qaytaradi.',
  },
];

export default function S8Mavzu30() {
  const korgazmalar = [
    { nom: '1. H₂S tuzilish & 0,1% xavf', ikon: 'atom', komponent: <KorgazmaH2STuzilishFizik /> },
    { nom: '2. Kipp & Sintez (200–350°)', ikon: 'kolba', komponent: <KorgazmaH2SOlinishi /> },
    { nom: '3. To\'liq & Chala yonish', ikon: 'olov', komponent: <KorgazmaH2SYonish /> },
    { nom: '4. FeCl₃, Cl₂, H₂SO₄ o\'zaro', ikon: 'uchqun', komponent: <KorgazmaH2SQaytaruvchi /> },
    { nom: '5. S²⁻ + Pb²⁺ = PbS↓ (qora)', ikon: 'tomchi', komponent: <KorgazmaSulfidKislotaVaSifat /> },
    { nom: '6. 135–136-b masalalari', ikon: 'formula', komponent: <Korgazma30Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-30"
          nom="Vodorod sulfidni guruhlang"
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
          key="tezkor-30"
          nom="30-§: Vodorod sulfid"
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
          key="zanjir-30"
          nom="H₂S o'zgarish zanjiri"
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
          key="duel-30"
          sarlavha="30-§: Vodorod sulfid dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="30-§"
      mavzuNom="Oltingugurtning vodorodli birikmalari"
      oldingiRaqam="29-§"
      oldingiNom="Kislorod guruhchasi elementlari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
