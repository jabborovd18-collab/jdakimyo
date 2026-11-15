'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 35-PARAGRAF
// "Sanoatda sulfat kislota ishlab chiqarish" (Darslik 147-155-betlar)
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
function KorgazmaXomashyoVa4Bosqich() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Kontakt usulining 4 bosqichi (20-rasm, 147–150-b)"
      ikon="filtr"
      variantlar={[
        {
          id: 'sxema4',
          tugma: '4 bosqich texnologik oqimi',
          formula: 'Pech (FeS₂→SO₂) → Siklon/Elektrofiltr/Quritish → Kontakt (V₂O₅, 400–450°C) → Oleum',
          tur: 'sanoat',
          cfg: {
            sarlavha: '20-rasm: Sulfat kislota ishlab chiqarish kontakt usulining 4 bosqichi',
            tenglama: 'Xomashyo: S, FeS₂, ZnS, CuS, PbS, H₂S  |  V₂O₅ (400–450°C)  |  Yuttiruvchi: 98% H₂SO₄',
            bosqichlar: [
              { nom: '1. Pech (SO₂)', tur: 'pech', ichi: '4FeS₂ + 11O₂', mahsulot: '8SO₂ + Fe₂O₃', rang: '#fb923c' },
              { nom: '2. Tozalash', tur: 'minora', ichi: 'Siklon + El.filtr', mahsulot: 'Quruq SO₂ + O₂', rang: '#38bdf8' },
              { nom: '3. Kontakt (V₂O₅)', tur: 'kataliz', ichi: '400–450°C', mahsulot: '2SO₃ + Q', rang: '#fde047' },
              { nom: '4. Yuttirish', tur: 'minora', ichi: '98% H₂SO₄', mahsulot: 'H₂SO₄·nSO₃', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Katalizator', v: 'V₂O₅ (400–450°C)', rang: '#fde047' },
              { k: 'Yuttiruvchi', v: '98% H₂SO₄ → Oleum (suv emas!)', rang: '#34d399' },
            ],
          },
          pastki: ['Xomashyo: S, pirit FeS₂, CuS, ZnS, PbS, H₂S', 'V₂O₅ katalizatorini chang zaharlamasligi uchun tozalanadi', 'Yuttirish minorasida 98% H₂SO₄ → Oleum olinadi'],
        },
      ]}
    />
  );
}

function Korgazma1BosqichQaynovchiPech() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 1-bosqich: Qaynovchi qatlam pechi (148-bet)"
      ikon="olov"
      variantlar={[
        {
          id: 'pech',
          tugma: '4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂ + Q',
          formula: 'Maydalangan pirit + qarshi oqim + O₂ boyitish • Fe₂O₃ kuyindisi metallurgiyaga!',
          tur: 'sanoat',
          cfg: {
            sarlavha: '"Qaynovchi qatlam" pechida kimyoviy kinetikaning 3 usuli qo\'llaniladi',
            tenglama: '4FeS₂ + 11O₂ = 2Fe₂O₃ (pirit kuyindisi → po\'latga!) + 8SO₂ + Q (bug\' qozoniga)',
            bosqichlar: [
              { nom: '1. Maydalash', tur: 'pech', ichi: 'Kukun FeS₂ (yuqoridan)', mahsulot: 'Tutash sirti ↑↑', rang: '#fde047' },
              { nom: '2. Qarshi oqim', tur: 'pech', ichi: 'Pastdan bosim havo', mahsulot: 'Muallaq "qaynash"', rang: '#fb923c' },
              { nom: '3. Kuyindi & Bug\'', tur: 'minora', ichi: 'Fe₂O₃ + Issiqlik +Q', mahsulot: 'Metallurg. / Bug\'', rang: '#34d399' },
            ],
            belgilar: [
              { k: '3 ta usul', v: '1) Maydalash  2) Qarshi oqim  3) O₂ boyitish', rang: '#fde047' },
              { k: 'Chiqindi yo\'q', v: 'Fe₂O₃ kuyindisi metallurgiyaga; +Q → bug\'ga', rang: '#34d399' },
            ],
          },
          pastki: ['Pirit yuqoridan, havo pastdan — qarshi oqim', 'Maydalash + O₂ boyitish yonishni tezlashtiradi', 'Fe₂O₃ kuyindi po\'lat eritishga, +Q bug\' qozoniga'],
        },
      ]}
    />
  );
}

function Korgazma2BosqichTozalash() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 2-bosqich: Siklon, Elektrofiltr va Quritish (148–149-b)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'tozalash',
          tugma: 'Chang & Namlikdan tozalash',
          formula: 'Siklon (yirik Fe₂O₃) → Elektrofiltr (mayda, As, Se) → Quritish (kons. H₂SO₄)',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Nega tozalanadi? Aralashmalar V₂O₅ ni zaharlaydi, namlik korroziya beradi!',
            tenglama: '1) Siklon (uyurma)  →  2) Elektrofiltr (zaryad)  →  3) Quritish minorasi (kons. H₂SO₄)',
            bosqichlar: [
              { nom: '1. Siklon', tur: 'minora', ichi: 'Tangensial uyurma', mahsulot: 'Yirik Fe₂O₃ chang', rang: '#38bdf8' },
              { nom: '2. Elektrofiltr', tur: 'elektroliz', ichi: 'Elektr maydoni', mahsulot: 'Mayda chang, As, Se', rang: '#fbbf24' },
              { nom: '3. Quritish', tur: 'minora', ichi: 'Kons. H₂SO₄ nasadka', mahsulot: 'H₂O bug\'i yutiladi', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Elektrofiltr', v: 'V₂O₅ katalizatorini zaharlanishdan asraydi', rang: '#fbbf24' },
              { k: 'Quritish', v: 'Korroziya va kislota tumanini oldini oladi', rang: '#34d399' },
            ],
          },
          pastki: ['Siklon: markazdan qochma kuch yirik changni tutadi', 'Elektrofiltr: mayda chang va As/Se ni cho\'ktiradi', 'Quritish minorasi: kons. H₂SO₄ namlikni yutadi'],
        },
      ]}
    />
  );
}

function Korgazma3BosqichKontaktV2O5() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 3-bosqich: Kontakt apparati, V₂O₅ va 400–450°C (149-b)"
      ikon="harorat"
      variantlar={[
        {
          id: 'v2o5',
          tugma: '400°C (99,2%) vs 600°C (73%) → Optimal',
          formula: '2SO₂ + O₂ ⇄ 2SO₃ + Q • V₂O₅ (arzon, chidamli) • Optimal 400–450°C + Issiq almashtirgich',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'V₂O₅ to\'rlari ("Kontakt usuli") + Issiq almashtirgichda energiya tejash',
            tenglama: '400°C: 99,2% unum   |   600°C: 73% unum   ⇒   Optimal rejim: 400–450°C (V₂O₅)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: '400°C (99,2%)', qiymat: 99.2, yorliq: '99,2% SO₃', rang: '#34d399' },
              { nom: '450°C (optimal)', qiymat: 96, yorliq: 'Tez + yuqori', rang: '#fde047' },
              { nom: '600°C (73%)', qiymat: 73, yorliq: '73% (parchal.)', rang: '#fb7185' },
            ],
          },
          pastki: ['V₂O₅ platina (Pt) dan arzon va chidamli', '400°C da unum 99,2%, 600°C da 73% ga tushadi', 'Issiq SO₃ kirayotgan sovuq gazni isitib beradi'],
        },
      ]}
    />
  );
}

function Korgazma4BosqichYuttirishOleum() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 4-bosqich: Yuttirish minorasi — nega 98% H₂SO₄? (150-b)"
      ikon="kolba"
      variantlar={[
        {
          id: 'oleum',
          tugma: '98% H₂SO₄ → Oleum (suv → tuman!)',
          formula: 'SO₃ + suv → tuman (yomon!) • SO₃ + 98% H₂SO₄ → Oleum (H₂SO₄·nSO₃) — to\'liq!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'SO₃ suv bilan bug\'da tuman hosil qiladi; 98% H₂SO₄ da tuman bo\'lmay to\'liq eriydi',
            tenglama: '98% H₂SO₄ + nSO₃ → H₂SO₄·nSO₃ (Oleum)   →(+H₂O)→   Tayyor tovar H₂SO₄',
            suyuqlikRang: '#34d399',
            stakanBelgi: '98% H₂SO₄ + SO₃',
            stakanSarlavha: 'Yuttirish minorasi',
            reagentlar: [
              { belgi: 'SO₃', rang: '#fde047' },
              { belgi: 'H₂S₂O₇', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'To\'g\'ri texnol.', v: '98% H₂SO₄ + nSO₃ → Oleum (H₂SO₄·nSO₃)', rang: '#34d399' },
              { k: 'Suv xatosi', v: 'SO₃+H₂O quyuq kislota tumani beradi (uchadi!)', rang: '#fb7185' },
            ],
          },
          pastki: ['SO₃ suvga yuttirilsa quyuq kislota tumani beradi', '98% H₂SO₄ da tumansiz to\'liq erib oleum beradi', 'Oleum keyin rezervuarlarda suv bilan suyultiriladi'],
        },
      ]}
    />
  );
}

function Korgazma35Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. V bob yakuniy sanoat masalalari (154–155-bet)"
      ikon="formula"
      variantlar={[
        {
          id: 'bob_masala',
          tugma: '687,27 m³ H₂S • 2,45% H₂SO₄ • 3,36 m³ O₂',
          formula: '3 t 90% FeS → 687,27 m³ H₂S • 11,65 g BaSO₄ (200 g) → 2,45% • 3,4 kg H₂S → 3,36 m³ O₂',
          tur: 'hisob',
          cfg: {
            sarlavha: '154–155-bet: 6-misol (FeS→H₂S), 7-misol (BaSO₄→%) va H₂S yonishi',
            tenglama: '2700/88·22,4 = 687,27 m³   |   (11,65/233·98)/200 = 2,45%   |   (3,4/34·1,5)·22,4 = 3,36 m³',
            qadamlar: [
              { belgi: '6-m: 3 t 90% FeS (2700 kg)', natija: '687,27 m³ H₂S', izoh: '30,6818 kmol · 22,4', rang: '#fbbf24' },
              { belgi: '7-m: 11,65 g BaSO₄ (200 g)', natija: '2,45% H₂SO₄', izoh: '0,05 mol = 4,9 g / 200', rang: '#38bdf8' },
              { belgi: '155-b: 3,4 kg H₂S + O₂', natija: '3,36 m³ O₂', izoh: '0,1 kmol · 1,5 · 22,4', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '6-m: 2700 kg FeS → H₂S', foiz: 100, qiymat: '687,27 m³ H₂S', rang: '#fbbf24' },
              { nom: '7-m: 4,9 g / 200 g', foiz: 30, qiymat: '2,45% H₂SO₄', rang: '#38bdf8' },
              { nom: '3,4 kg H₂S → O₂', foiz: 50, qiymat: '3,36 m³ (3360 l)', rang: '#34d399' },
            ],
            javobBadge: '6-m: 687,27 m³ H₂S;  7-m: 2,45% H₂SO₄;  3,4 kg H₂S → 3,36 m³ O₂',
          },
          pastki: ['3 t 90% FeS (30,6818 kmol) → 687,27 m³ H₂S', '11,65 g BaSO₄ (0,05 mol → 4,9 g)/200 = 2,45%', '3,4 kg H₂S (0,1 kmol → 0,15 O₂) → 3,36 m³ O₂'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (34-§) VA O'YINLAR (35-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '34-§ (146-bet): Katalizator qaytar reaksiya muvozanatiga qanday ta\'sir qiladi?',
    variantlar: [
      { matn: 'Chapga siljitadi', togri: false },
      { matn: 'O\'ngga siljitadi', togri: false },
      { matn: 'SILJITMAYDI (υ₁ va υ₂ ni teng tezlashtiradi)', togri: true },
      { matn: 'K ni oshiradi', togri: false },],
    izoh: '146-bet: katalizator faqat muvozanatni tezlashtiradi.',
  },
  {
    id: 't2',
    savol: '152-bet 3-misol: CO+H₂O⇄CO₂+H₂ da K = (0,016·0,016)/(0,004·0,064) nechaga teng?',
    variantlar: [
      { matn: 'K = 1', togri: true },
      { matn: 'K = 4', togri: false },
      { matn: 'K = 0,25', togri: false },
      { matn: 'K = 16', togri: false },],
    izoh: '0,000256 / 0,000256 = 1.',
  },
  {
    id: 't3',
    savol: '147-bet 4-savol: t° pasayganda 2NO+O₂⇄2NO₂+Q va CO₂+C⇄2CO-Q qayerga siljiydi?',
    variantlar: [
      { matn: 'Ikkalasi o\'ngga', togri: false },
      { matn: 'Ikkalasi chapga', togri: false },
      { matn: 'Siljimaydi', togri: false },
      { matn: 'Birinchisi o\'ngga (+Q), ikkinchisi chapga (+Q)', togri: true },],
    izoh: 'Harorat pasaysa ekzotermik (+Q) tomonga siljiydi.',
  },
  {
    id: 't4',
    savol: '154-bet 5-misol: Qaysi reaksiyada bosimni o\'zgartirish muvozanatga ta\'sir etmaydi?',
    variantlar: [
      { matn: '3O₂ ⇄ 2O₃', togri: false },
      { matn: 'N₂ + O₂ ⇄ 2NO - Q (2 mol = 2 mol)', togri: true },
      { matn: '2SO₂ + O₂ ⇄ 2SO₃', togri: false },
      { matn: '3H₂ + N₂ ⇄ 2NH₃', togri: false },],
    izoh: 'Chapda va o\'ngda 2 moldan gaz bor (ΔV = 0).',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'pech_tozalash', nom: '1–2-bosqich: Pech & Tozalash', tavsif: 'FeS₂, Qarshi oqim, Siklon, El.filtr' },
    { id: 'kontakt_oleum', nom: '3–4-bosqich: Kontakt & Oleum', tavsif: 'V₂O₅, 400–450°C, 98% H₂SO₄' },
    { id: 'yakuniy_mas', nom: '154–155-b Masalalar', tavsif: '687,27 m³, 2,45%, 3,36 m³' },
  ],
  topshiriqlar: [
    { nom: 'Qaynovchi qatlam pechi: 4FeS₂+11O₂→2Fe₂O₃+8SO₂', qisqa: 'Maydalash, qarshi oqim, O₂ boyit.', guruh: 'pech_tozalash', izoh: '148-bet: Fe₂O₃ po\'latga, +Q bug\'ga.' },
    { nom: 'Siklon (yirik chang) & Elektrofiltr (mayda, As/Se)', qisqa: 'V₂O₅ zaharlanishini oldini oladi', guruh: 'pech_tozalash', izoh: '148–149-bet tozalash.' },
    { nom: 'Quritish minorasi: kons. H₂SO₄ namlikni yutadi', qisqa: 'Korroziya va tuman oldini oladi', guruh: 'pech_tozalash', izoh: '2-bosqich yakuni.' },
    { nom: 'Kontakt apparati: V₂O₅ (arzon, chidamli)', qisqa: 'Pt dan afzal, issiq almashtirgich', guruh: 'kontakt_oleum', izoh: '149-bet: "Kontakt usuli".' },
    { nom: 'Optimal 400–450°C (400°: 99,2% vs 600°: 73%)', qisqa: '2SO₂ + O₂ ⇄ 2SO₃ + Q', guruh: 'kontakt_oleum', izoh: 'Tezlik va unum balansi.' },
    { nom: 'Yuttirish minorasi: 98% H₂SO₄ → Oleum (H₂SO₄·nSO₃)', qisqa: 'Suvda tuman hosil bo\'ladi!', guruh: 'kontakt_oleum', izoh: '150-bet 4-bosqich.' },
    { nom: '6-m: 3 t 90% FeS (2700 kg / 88) → 687,27 m³ H₂S', qisqa: '30,6818 kmol · 22,4', guruh: 'yakuniy_mas', izoh: '154-bet 6-misol.' },
    { nom: '7-m: 11,65 g BaSO₄ (200 g) → 2,45% H₂SO₄', qisqa: '0,05 mol = 4,9 g / 200', guruh: 'yakuniy_mas', izoh: '154–155-bet 7-misol.' },
    { nom: '155-b: 3,4 kg H₂S → 3,36 m³ O₂ (3360 l)', qisqa: '0,1 kmol · 1,5 · 22,4', guruh: 'yakuniy_mas', izoh: '2H₂S + 3O₂ = 2SO₂ + 2H₂O.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '1-bosqich',
    savol: 'Qaynovchi qatlam pechida pirit kuydirishni tezlashtirishning 3 texnologik usuli:',
    variantlar: ['Faqat katalizator', 'Sovutish, zichlash, bosim nol', 'Maydalash, qarshi oqim, havoni O₂ bilan boyitish', 'Suv quyish'],
    togri: 2,
    izoh: '148-bet: kinetika qonunlarining amalda qo\'llanishi.',
  },
  {
    belgi: 'Elektrofiltr',
    savol: 'Pechdan chiqqan gaz nima uchun siklon, elektrofiltr va quritgichdan o\'tkaziladi?',
    variantlar: ['V₂O₅ katalizatori zaharlanmasligi va korroziya bo\'lmasligi uchun', 'Harorat oshirish uchun', 'Oleum olish uchun', 'Piritni eritish uchun'],
    togri: 0,
    izoh: 'As/Se aralashmalari va namlik V₂O₅ ni ishdan chiqaradi.',
  },
  {
    belgi: 'Optimal t°',
    savol: 'Kontakt apparatida nega 400–450°C optimal hisoblanadi (600°C da 73%)?',
    variantlar: ['V₂O₅ eriydi', 'SO₂ muzlaydi', 'Suv qaynaydi', '400°C da 99,2% yuqori unum va yetarli tezlik ta\'minlanadi'],
    togri: 3,
    izoh: '149-bet: ekzotermik reaksiya uchun optimal muvozanat.',
  },
  {
    belgi: 'Yuttirish',
    savol: 'Nima uchun SO₃ suvda emas, 98% li H₂SO₄ da yuttiriladi?',
    variantlar: ['Suvda erimaydi', 'Suv bilan quyuq sulfat kislota tumani beradi; 98% H₂SO₄ da oleum beradi', 'Suv muzlaydi', 'Reaksiya bormaydi'],
    togri: 1,
    izoh: '150-bet: tuman yutilmasdan uchib havoni zaharlaydi.',
  },
  {
    belgi: '6-misol (154-b)',
    savol: '3 t 90% li FeS rudasidan (M=88) olinadigan H₂S hajmi (m³):',
    variantlar: ['224 m³', '687,27 m³ (30,6818 kmol)', '1000 m³', '68,7 m³'],
    togri: 1,
    izoh: '2700 / 88 = 30,6818 kmol · 22,4 = 687,27 m³.',
  },
  {
    belgi: '7-misol (155-b)',
    savol: '200 g H₂SO₄ eritmasidan 11,65 g BaSO₄↓ (M=233) cho\'ksa kislota foizi:',
    variantlar: ['4,9%', '10%', '5,8%', '2,45% (4,9 g / 200 g)'],
    togri: 3,
    izoh: '11,65 / 233 = 0,05 mol → 4,9 g / 200 · 100% = 2,45%.',
  },
  {
    belgi: '155-b H₂S+O₂',
    savol: '3,4 kg H₂S (M=34) to\'liq yonishi uchun zarur O₂ hajmi (m³):',
    variantlar: ['3,36 m³ (0,15 kmol O₂)', '6,72 m³', '2,24 m³', '1,12 m³'],
    togri: 0,
    izoh: '0,1 kmol H₂S → 0,15 kmol O₂ · 22,4 = 3,36 m³.',
  },
  {
    belgi: 'Katalizator',
    savol: 'Kontakt apparatida platinaga (Pt) qaraganda nima uchun V₂O₅ ishlatiladi?',
    variantlar: ['Pt ishlamaydi', 'V₂O₅ gaz', 'V₂O₅ arzon, chidamli va ko\'p yil zaharlanmay ishlaydi', 'Pt qattiq emas'],
    togri: 2,
    izoh: '149-bet: Pt juda qimmat va changga sezgir.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '147–150-bet (20-rasm): Zavoddagi 4 bosqich',
    vazifa: 'Sulfat kislota zavodining texnologik sxemasini tartiblang:',
    tartib: [
      '1. Qaynovchi qatlam pechi: 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '2. Siklon + Elektrofiltr + Quritish minorasi',
      '3. Kontakt apparati (V₂O₅, 400–450°C): 2SO₂ + O₂ ⇄ 2SO₃',
      '4. Yuttirish minorasi (98% H₂SO₄): oleum H₂SO₄·nSO₃ → H₂SO₄',
    ],
    variantlar: [
      '3. Kontakt apparati (V₂O₅, 400–450°C): 2SO₂ + O₂ ⇄ 2SO₃',
      '1. Qaynovchi qatlam pechi: 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '4. Yuttirish minorasi (98% H₂SO₄): oleum H₂SO₄·nSO₃ → H₂SO₄',
      '2. Siklon + Elektrofiltr + Quritish minorasi',
    ],
  },
  {
    tur: '154–155-bet 7-misol: BaSO₄↓ → 2,45%',
    vazifa: '11,65 g BaSO₄↓ dan H₂SO₄ massa ulushini topish bosqichlari:',
    tartib: [
      '1. n(BaSO₄) = 11,65 / 233 = 0,05 mol',
      '2. H₂SO₄ + BaCl₂ = BaSO₄↓ → n(H₂SO₄) = 0,05 mol',
      '3. m(H₂SO₄) = 0,05 · 98 = 4,9 g',
      '4. w(H₂SO₄) = (4,9 / 200) · 100% = 2,45%',
    ],
    variantlar: [
      '2. H₂SO₄ + BaCl₂ = BaSO₄↓ → n(H₂SO₄) = 0,05 mol',
      '4. w(H₂SO₄) = (4,9 / 200) · 100% = 2,45%',
      '1. n(BaSO₄) = 11,65 / 233 = 0,05 mol',
      '3. m(H₂SO₄) = 0,05 · 98 = 4,9 g',
    ],
  },
  {
    tur: '154-bet 6-misol: 3 t 90% FeS → 687,27 m³',
    vazifa: '3 t 90% FeS dan H₂S hajmini hisoblash bosqichlarini tartiblang:',
    tartib: [
      '1. Sof FeS massasi: 3000 · 0,90 = 2700 kg',
      '2. M(FeS) = 56 + 32 = 88 kg/kmol',
      '3. n(FeS) = n(H₂S) = 2700 / 88 = 30,6818 kmol',
      '4. V(H₂S) = 30,6818 · 22,4 = 687,27 m³',
    ],
    variantlar: [
      '3. n(FeS) = n(H₂S) = 2700 / 88 = 30,6818 kmol',
      '4. V(H₂S) = 30,6818 · 22,4 = 687,27 m³',
      '1. Sof FeS massasi: 3000 · 0,90 = 2700 kg',
      '2. M(FeS) = 56 + 32 = 88 kg/kmol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Pirit kuydirishda hosil bo\'ladigan Fe₂O₃ (kuyindi) va +Q issiqlik qayerga ketadi?',
    variantlar: ['Tashlab yuboriladi', 'Metallurgiya (po\'lat) va bug\' qozonlariga', 'O\'g\'itga', 'Shishaga'],
    togri: 1,
    izoh: '148-bet: chiqindisiz texnologiya.',
  },
  {
    savol: 'Kontakt apparatidagi issiq almashtirgichning vazifasi (149-bet):',
    variantlar: ['Kislotani muzlatish', 'Havo purkash', 'Chang tutish', 'Chiqayotgan issiq SO₃ hisobiga sovuq SO₂+O₂ ni isitish'],
    togri: 3,
    izoh: 'Yoqilg\'i va elektr energiyasini tejaydi.',
  },
  {
    savol: 'H₂SO₄ ishlab chiqarish uchun xomashyo bo\'la oladigan moddalar:',
    variantlar: ['Oltingugurt S, pirit FeS₂, CuS/ZnS/PbS va H₂S', 'NaCl va CaF₂', 'Faqat H₂O', 'KNO₃'],
    togri: 0,
    izoh: '147-bet: sulfid rudalari va gaz tozalashdagi H₂S.',
  },
  {
    savol: '400°C va 600°C da 2SO₂ + O₂ ⇄ 2SO₃ reaksiyasi bo\'yicha SO₃ unumlari:',
    variantlar: ['10% va 90%', '50% va 50%', '99,2% (400°C) va 73% (600°C)', '73% va 99,2%'],
    togri: 2,
    izoh: '149-bet: ekzotermik reaksiya t° oshganda unumni pasaytiradi.',
  },
  {
    savol: 'Quritish minorasida pech gazidan suv bug\'ini yutish uchun nima sepiladi?',
    variantlar: ['Ishqor', 'Oddiy suv', 'Konsentrlangan H₂SO₄', 'Spirt'],
    togri: 2,
    izoh: '149-bet: kislota tumani va korroziyani oldini oladi.',
  },
  {
    savol: 'Siklon apparati qaysi fizik prinsip asosida yirik Fe₂O₃ changini ushlaydi?',
    variantlar: ['Tangensial uyurma (markazdan qochma kuch)', 'Elektrostatik', 'Kimyoviy erish', 'Magnit'],
    togri: 0,
    izoh: '148-bet: yirik chang devorga urilib pastga tushadi.',
  },
  {
    savol: 'Oleumni (H₂SO₄·nSO₃) tayyor tovar H₂SO₄ ga aylantirish usuli:',
    variantlar: ['Qizdirish', 'Maxsus rezervuarlarda suv bilan suyultirish', 'Filtrlash', 'Elektroliz'],
    togri: 1,
    izoh: '150-bet: 4-bosqich yakuni.',
  },
  {
    savol: 'Nima uchun usul "Kontakt usuli" deb ataladi?',
    variantlar: ['Elektr toki bor', 'Suv tegadi', 'Kuyindi chiqadi', 'SO₂ va O₂ gazlari qattiq V₂O₅ katalizatori yuzasiga tegib (kontakt) boradi'],
    togri: 3,
    izoh: '149-bet: geterogen kataliz.',
  },
];

export default function S8Mavzu35() {
  const korgazmalar = [
    { nom: '1. Kontakt usuli 4 bosqich', ikon: 'filtr', komponent: <KorgazmaXomashyoVa4Bosqich /> },
    { nom: '2. Qaynovchi qatlam pechi', ikon: 'olov', komponent: <Korgazma1BosqichQaynovchiPech /> },
    { nom: '3. Siklon, El.filtr, Quritish', ikon: 'tomchi', komponent: <Korgazma2BosqichTozalash /> },
    { nom: '4. V₂O₅ & 400–450°C (99,2%)', ikon: 'harorat', komponent: <Korgazma3BosqichKontaktV2O5 /> },
    { nom: '5. 98% H₂SO₄ → Oleum', ikon: 'kolba', komponent: <Korgazma4BosqichYuttirishOleum /> },
    { nom: '6. 154–155-b masalalari', ikon: 'formula', komponent: <Korgazma35Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-35"
          nom="Sanoat bosqichlarini guruhlang"
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
          key="tezkor-35"
          nom="35-§: Sulfat kislota sanoati"
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
          key="zanjir-35"
          nom="Zavod sxemasi va masalalar"
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
          key="duel-35"
          sarlavha="35-§: Sulfat sanoati dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="35-§"
      mavzuNom="Sanoatda sulfat kislota ishlab chiqarish"
      oldingiRaqam="34-§"
      oldingiNom="Kimyoviy muvozanat"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
