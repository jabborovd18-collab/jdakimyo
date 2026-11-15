'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 32-PARAGRAF
// "Sulfat kislota" (Darslik 138-141-betlar)
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
function KorgazmaH2SO4FizikVaSuyultirish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Sulfat kislota fizikasi va suyultirish qoidasi (138–139-b)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'suyultirish',
          tugma: '96% (ρ=1,84) • Kislota → Suvga!',
          formula: 'Rangsiz moysimon suyuqlik • 96% H₂SO₄: ρ = 1,84 g/cm³ • Kislotani suvga quying!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Xavfsizlik: og\'ir H₂SO₄ (ρ=1,84) oz-ozdan suvga aralashtirib quyiladi!',
            tenglama: 'KISLOTA → SUVGA (to\'g\'ri!)   |   SUV → KISLOTAGA QAT\'IYAN TAQIQLANADI (sachraydi!)',
            suyuqlikRang: '#38bdf8',
            tolish: 0.72,
            stakanBelgi: 'Suv + ↑H₂SO₄',
            stakanSarlavha: 'Kislota → Suvga',
            reagentlar: [
              { belgi: 'H⁺', rang: '#fb7185' },
              { belgi: 'SO₄²⁻', rang: '#fde047' },
            ],
            tempC: 92,
            maxTemp: 120,
            belgilar: [
              { k: 'Zichlik (96%)', v: 'ρ = 1,84 g/cm³ (suvdan 1,84× og\'ir)', rang: '#fde047' },
              { k: 'To\'g\'ri qoida', v: 'Kislota oz-ozdan suvga quyiladi', rang: '#34d399' },
              { k: 'Sababi', v: 'Kuchli gidratlanib +Q issiqlik chiqadi', rang: '#fb7185' },
            ],
          },
          pastki: ['96% H₂SO₄ zichligi: ρ = 1,84 g/cm³', 'Kislota suvga oz-ozdan aralashtirib quyiladi', 'Suvni kislotaga quyish qat\'iyan taqiqlanadi!'],
        },
      ]}
    />
  );
}

function KorgazmaH2SO4Suyultirilgan() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Suyultirilgan sulfat kislota reaksiyalari (139-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'metall_asos',
          tugma: 'Metallar (H₂↑), Oksid, Asos',
          formula: 'Zn/Fe + H₂SO₄(suyul.) → FeSO₄/ZnSO₄ + H₂↑ • Cu/Ag/Au ≠ • CuO → CuSO₄ (ko\'k)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Suyultirilgan H₂SO₄ faol metallardan H₂↑ chiqaradi (Fe⁺² gacha!)',
            tenglama: 'Zn+H₂SO₄=ZnSO₄+H₂↑  •  Fe+H₂SO₄=FeSO₄(+2)+H₂↑  •  CuO+H₂SO₄=CuSO₄(ko\'k)+H₂O',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'H₂SO₄(suyul.)',
            stakanSarlavha: 'Tipik kislota',
            reagentlar: [
              { belgi: 'Zn²⁺', rang: '#38bdf8' },
              { belgi: 'Fe²⁺', rang: '#34d399' },
              { belgi: 'Cu²⁺', rang: '#0ea5e9' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂↑',
            belgilar: [
              { k: 'Metallar', v: 'Zn, Al, Fe (+2) → H₂↑; Cu/Ag/Au kirmaydi', rang: '#34d399' },
              { k: 'Oksid & Asos', v: 'CuO (qora) → CuSO₄ (ko\'k); Mg(OH)₂, NaOH', rang: '#38bdf8' },
            ],
          },
          pastki: ['Zn, Al, Fe bilan H₂↑ chiqadi (Cu, Ag, Au ≠)', 'Qora CuO erib havorang CuSO₄ beradi', '2NaOH + H₂SO₄ = Na₂SO₄ + 2H₂O'],
        },
        {
          id: 'tuz_fosforit',
          tugma: 'Tuzlar: Fosforit & NaCl',
          formula: 'Na₂CO₃ + H₂SO₄ → CO₂↑ • 3H₂SO₄ + Ca₃(PO₄)₂ = 3CaSO₄ + 2H₃PO₄ • NaCl → HCl↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Kuchsiz va uchuvchan kislotalarni siqib chiqarish (139-bet)',
            tenglama: '3H₂SO₄ + Ca₃(PO₄)₂ = 3CaSO₄ + 2H₃PO₄   |   Na₂CO₃ + H₂SO₄ = Na₂SO₄ + H₂O + CO₂↑',
            suyuqlikRang: '#fbbf24',
            stakanBelgi: 'Ca₃(PO₄)₂+H₂SO₄',
            stakanSarlavha: 'Sanoat reaksiyasi',
            reagentlar: [
              { belgi: 'Ca²⁺', rang: '#fde047' },
              { belgi: 'H₃PO₄', rang: '#34d399' },
            ],
            gazRang: '#e2e8f0',
            gazBelgi: 'CO₂↑ / HCl↑',
            belgilar: [
              { k: 'Fosforitdan', v: '3H₂SO₄ + Ca₃(PO₄)₂ = 3CaSO₄ + 2H₃PO₄', rang: '#34d399' },
              { k: 'Karbonat & Cl⁻', v: 'Na₂CO₃ → CO₂↑; NaCl(q)+H₂SO₄ → HCl↑', rang: '#38bdf8' },
            ],
          },
          pastki: ['Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂↑', 'Fosforit Ca₃(PO₄)₂ dan H₃PO₄ olinadi', 'Qattiq NaCl + kons. H₂SO₄ → HCl↑'],
        },
      ]}
    />
  );
}

function KorgazmaH2SO4Konsentrlangan() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Konsentrlangan H₂SO₄: oksidlovchi & suv tortuvchi (139–140-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'oksidlovchi',
          tugma: 'Cu, C, S bilan & Sovuq Fe (passiv)',
          formula: 'Cu+2H₂SO₄(kons)→SO₂↑ • C/S→SO₂↑ • ~100% sovuq H₂SO₄ Fe ga ta\'sir etmaydi!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Kons. H₂SO₄ S⁺⁶ hisobiga H₂ emas, SO₂/S/H₂S beradi; ~100% Fe ni passivlaydi',
            tenglama: 'Cu+2H₂SO₄(kons)=CuSO₄+SO₂↑+2H₂O   |   2H₂SO₄+C=CO₂↑+2SO₂↑+2H₂O   |   2H₂SO₄+S=3SO₂↑+2H₂O',
            qizdir: true,
            suyuqlikRang: '#0ea5e9',
            stakanBelgi: 'Kons. H₂SO₄ + Cu/C',
            stakanSarlavha: 'S⁺⁶ oksidlovchi',
            reagentlar: [
              { belgi: 'Cu²⁺', rang: '#38bdf8' },
              { belgi: 'S⁺⁶', rang: '#fde047' },
            ],
            gazRang: '#cbd5e1',
            gazBelgi: 'SO₂↑ / CO₂↑',
            elektronJuft: { chap: 'Cu/C/S', ong: 'S⁺⁶→S⁺⁴', e: '2ē' },
            belgilar: [
              { k: 'Mis bilan', v: 'Cu+2H₂SO₄(kons)=CuSO₄+SO₂↑+2H₂O (Ag,Au,Pt ≠)', rang: '#38bdf8' },
              { k: 'Sovuqda Fe', v: '~100% H₂SO₄ Fe ga ta\'sir etmaydi (sisterna!)', rang: '#34d399' },
              { k: 'C va S (t°)', v: '2H₂SO₄+C→CO₂+2SO₂; 2H₂SO₄+S→3SO₂', rang: '#fde047' },
            ],
          },
          pastki: ['~100% H₂SO₄ sovuqda Fe ga ta\'sir etmaydi (po\'lat sisterna)', 'Cu bilan SO₂↑; faollar bilan S↓ yoki H₂S↑', 'Ag, Au, Pt bilan ta\'sirlashmaydi'],
        },
        {
          id: 'gigroskopik',
          tugma: 'Suv tortish: Shakar → Ko\'mir (12C)',
          formula: 'C₁₂H₂₂O₁₁ + H₂SO₄(kons) → 12C (qora g\'ovak) + H₂SO₄·11H₂O • Eksikator',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Gigroskopik xossa: gazlarni quritadi va shakarni qora ko\'mirga aylantiradi!',
            tenglama: 'C₁₂H₂₂O₁₁ + H₂SO₄(kons) → 12C (qora g\'ovak ko\'mir) + H₂SO₄·11H₂O',
            suyuqlikRang: '#1e293b',
            stakanBelgi: 'Shakar + H₂SO₄',
            stakanSarlavha: 'Ko\'mirlanish (12C)',
            chokmaRang: '#0f172a',
            chokmaBelgi: '12C g\'ovak ko\'mir',
            reagentlar: [
              { belgi: 'H₂O', rang: '#38bdf8' },
              { belgi: '12C', rang: '#94a3b8' },
            ],
            gazRang: '#cbd5e1',
            gazBelgi: 'Bug\' + SO₂↑',
            belgilar: [
              { k: 'Shakar / Qog\'oz', v: 'C₁₂H₂₂O₁₁ → 12C + H₂SO₄·11H₂O', rang: '#fde047' },
              { k: 'Gaz quritish', v: 'SO₂, Cl₂, HCl, O₂ ni eksikatorda quritadi', rang: '#38bdf8' },
            ],
          },
          pastki: ['Shakar/sellyulozadan H va O ni tortib ko\'mirlaydi', 'Eksikator/minorada gazlarni (Cl₂, HCl, SO₂) quritadi', 'Teriga tushganda kuchli kuyish va qorayish!'],
        },
      ]}
    />
  );
}

function KorgazmaSO4SifatReaksiyasi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Sulfat kislota va SO₄²⁻ uchun sifat reaksiyasi (140-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'baso4',
          tugma: 'SO₄²⁻ + Ba²⁺ → BaSO₄↓ (oq)',
          formula: 'H₂SO₄ + BaCl₂ = BaSO₄↓ (oq, HNO₃ da erimaydi!) + 2HCl',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Sifat reaktivi BaCl₂ / Ba(NO₃)₂: qisqa ionli tenglama Ba²⁺ + SO₄²⁻ = BaSO₄↓',
            tenglama: 'Ba²⁺ + SO₄²⁻ = BaSO₄↓ (suvda va HNO₃ da erimaydi! BaSO₃ esa kislotada eriydi)',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'BaCl₂ + H₂SO₄',
            stakanSarlavha: 'Sifat reaksiyasi',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'BaSO₄↓ (oq)',
            reagentlar: [
              { belgi: 'Ba²⁺', rang: '#e2e8f0' },
              { belgi: 'SO₄²⁻', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Reaktivlar', v: 'BaCl₂ yoki Ba(NO₃)₂ (Ba²⁺ ionlari)', rang: '#38bdf8' },
              { k: 'Xossasi', v: 'BaSO₄↓ suvda va HNO₃ da MUTLAQO ERIMAYDI', rang: '#f8fafc' },
              { k: 'Farqi', v: 'BaSO₃↓ esa HNO₃ / HCl da eriydi!', rang: '#fde047' },
            ],
          },
          pastki: ['Ba²⁺ + SO₄²⁻ = BaSO₄↓ (oq cho\'kma)', 'Suvda ham, HNO₃ da ham erimaydi', 'BaSO₃↓ dan farqli kislotada erimaydi'],
        },
      ]}
    />
  );
}

function KorgazmaSulfatTuzlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Muhim sulfatlar va kristallogidratlar (140–141-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'kristallar',
          tugma: 'Glauber, Gips/Alebastr, Mis/Temir kuporosi',
          formula: 'Na₂SO₄·10H₂O • CaSO₄·2H₂O → CaSO₄·½H₂O (150–170°C) • CuSO₄·5H₂O (36%) • FeSO₄·7H₂O',
          tur: 'biogen',
          cfg: {
            sarlavha: 'To\'rtta muhim sulfat kristallogidrat va ularning xalq xo\'jaligidagi o\'rni',
            tenglama: '2(CaSO₄·2H₂O) —150–170°C→ 2CaSO₄·H₂O (CaSO₄·½H₂O, Alebastr) + 3H₂O',
            markazBelgi: 'SO₄²⁻',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Glauber tuzi', belgi: 'Na₂SO₄·10H₂O', rang: '#f8fafc' },
              { nom: 'Gips → Alebastr', belgi: 'CaSO₄·½H₂O', rang: '#fde047' },
              { nom: 'Mis kuporosi (ko\'k)', belgi: 'CuSO₄·5H₂O (36%)', rang: '#38bdf8' },
              { nom: 'Temir kup. (yashil)', belgi: 'FeSO₄·7H₂O', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Gips → Alebastr', v: '150–170°C da 3/4 suvini yo\'qotadi', rang: '#fde047' },
              { k: 'Mis kuporosi', v: 'To\'q ko\'k (M=250); suvsiz oq CuSO₄ (suv testi)', rang: '#38bdf8' },
              { k: 'Glauber & FeSO₄', v: 'Shisha/soda (Glauber); bo\'yoq/zararkun. (FeSO₄)', rang: '#34d399' },
            ],
          },
          pastki: ['Gips CaSO₄·2H₂O —150–170°C→ Alebastr CaSO₄·½H₂O', 'CuSO₄·5H₂O ko\'k (36% suv); suvsiz oq', 'Glauber Na₂SO₄·10H₂O; Temir kup. FeSO₄·7H₂O'],
        },
      ]}
    />
  );
}

function Korgazma32Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 141 & 155-bet masalalari: Al → 20% H₂SO₄ va CuSO₄·5H₂O"
      ikon="formula"
      variantlar={[
        {
          id: 'al_va_kuporos',
          tugma: '5,4 g Al → 147 g & Kuporos 36%',
          formula: '5,4 g Al (0,2 mol) → 0,3 mol H₂SO₄ = 29,4 g → 147 g 20% eritma • CuSO₄·5H₂O: 90/250 = 36%',
          tur: 'hisob',
          cfg: {
            sarlavha: '141-bet 4-masala (Al + H₂SO₄) va 155-bet (Mis kuporosi suv ulushi)',
            tenglama: '2Al + 3H₂SO₄ = Al₂(SO₄)₃ + 3H₂↑  |  w(H₂O) = 5·18 / (160+90) = 90 / 250 = 36%',
            qadamlar: [
              { belgi: '4-m: 5,4 g Al = 0,2 mol', natija: '0,3 mol H₂SO₄', izoh: 'm = 0,3·98 = 29,4 g', rang: '#38bdf8' },
              { belgi: '20% eritma: 29,4 / 0,20', natija: '147 g eritma', izoh: '141-bet 4-masala', rang: '#fde047' },
              { belgi: 'CuSO₄·5H₂O: 90 / 250', natija: '36% suv', izoh: '160 + 90 = 250 g/mol', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Suvsiz CuSO₄ (160)', foiz: 64, qiymat: '64% CuSO₄', rang: '#38bdf8' },
              { nom: '5 mol H₂O (90)', foiz: 36, qiymat: '36% suv', rang: '#34d399' },
            ],
            javobBadge: '141-b: 5,4 g Al → 147 g 20% H₂SO₄;  155-b: CuSO₄·5H₂O da 36% suv',
          },
          pastki: ['5,4 g Al → 0,3 mol H₂SO₄ = 29,4 g → 147 g (20%)', 'CuSO₄·5H₂O: M = 160 + 90 = 250 g/mol', 'w(H₂O) = 90 / 250 = 36%'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (31-§) VA O'YINLAR (32-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '31-§ (137–138-bet): SO₃ ning qaynash va oq kristallga aylanish haroratlari:',
    variantlar: [
      { matn: '-10°C va -73°C', togri: false },
      { matn: '100°C va 0°C', togri: false },
      { matn: '45°C da qaynaydi, 17°C da oq kristall bo\'ladi', togri: true },
      { matn: '444,5°C va 112,8°C', togri: false },],
    izoh: '137-bet: Tq(SO₃) = 45°C, Ts = 17°C.',
  },
  {
    id: 't2',
    savol: '50% S va 50% O li oksidning formulasi va havoga nisbatan zichligi:',
    variantlar: [
      { matn: 'SO₂ va D_havo = 64 / 29 ≈ 2,21', togri: true },
      { matn: 'SO₃ va 2,76', togri: false },
      { matn: 'SO va 1,65', togri: false },
      { matn: 'S₂O₃ va 3,86', togri: false },],
    izoh: '50/32 : 50/16 = 1 : 2 → SO₂ (Mr=64).',
  },
  {
    id: 't3',
    savol: 'SO₃ ni 98% kons. H₂SO₄ da eritishdan hosil bo\'ladigan modda:',
    variantlar: [
      { matn: 'Gips', togri: false },
      { matn: 'Sulfid', togri: false },
      { matn: 'Alebastr', togri: false },
      { matn: 'Oleum: H₂SO₄ + nSO₃ → H₂SO₄·nSO₃', togri: true },],
    izoh: '138-bet: tutovchi sulfat kislota — oleum.',
  },
  {
    id: 't4',
    savol: '5,6 litr SO₂ olish uchun necha gramm FeS₂ (M=120) kuydirish kerak?',
    variantlar: [
      { matn: '30 g', togri: false },
      { matn: '15 g FeS₂ (0,125 mol)', togri: true },
      { matn: '7,5 g', togri: false },
      { matn: '60 g', togri: false },],
    izoh: '0,25 mol SO₂ uchun 0,125 mol FeS₂ = 15 g.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'suyult_fiz', nom: 'Fizika & Suyultirilgan', tavsif: '1,84, Kislota→Suv, H₂↑, H₃PO₄' },
    { id: 'kons_sifat', nom: 'Kons. & BaSO₄↓', tavsif: 'SO₂↑, 100% Fe, 12C, BaSO₄↓' },
    { id: 'tuzlar_mas', nom: 'Kristallogidrat & Masala', tavsif: 'Alebastr, 36%, 147 g' },
  ],
  topshiriqlar: [
    { nom: '96% H₂SO₄ (ρ=1,84): Kislota → Suvga quyiladi', qisqa: 'Suvni kislotaga quyish taqiql.', guruh: 'suyult_fiz', izoh: '138–139-bet xavfsizlik qoidasi.' },
    { nom: 'Zn/Fe+H₂SO₄(suyul.) → ZnSO₄/FeSO₄(+2)+H₂↑', qisqa: 'Cu, Ag, Au kirmaydi', guruh: 'suyult_fiz', izoh: 'CuO(qora) → CuSO₄(ko\'k).' },
    { nom: '3H₂SO₄ + Ca₃(PO₄)₂ = 3CaSO₄ + 2H₃PO₄', qisqa: 'Na₂CO₃ → CO₂↑; NaCl → HCl↑', guruh: 'suyult_fiz', izoh: 'Fosforitdan ortofosfat kislota.' },
    { nom: 'Cu+2H₂SO₄(kons) → SO₂↑; C/S → SO₂↑ (t°)', qisqa: 'Ag, Au, Pt ta\'sirlashmaydi', guruh: 'kons_sifat', izoh: 'S⁺⁶ → S⁺⁴ oksidlovchi.' },
    { nom: '~100% sovuq H₂SO₄ Fe ni passivlaydi (sisterna)', qisqa: 'C₁₂H₂₂O₁₁ → 12C g\'ovak ko\'mir', guruh: 'kons_sifat', izoh: 'Eksikatorlarda gaz quritadi.' },
    { nom: 'Ba²⁺ + SO₄²⁻ = BaSO₄↓ (suv & HNO₃ da erimaydi)', qisqa: 'BaCl₂ / Ba(NO₃)₂ sifat testi', guruh: 'kons_sifat', izoh: 'BaSO₃↓ esa kislotada eriydi.' },
    { nom: 'Gips CaSO₄·2H₂O —150–170°C→ Alebastr CaSO₄·½H₂O', qisqa: '3/4 suvini yo\'qotadi', guruh: 'tuzlar_mas', izoh: 'Glauber Na₂SO₄·10H₂O.' },
    { nom: 'CuSO₄·5H₂O (ko\'k, M=250 → 36% H₂O); FeSO₄·7H₂O', qisqa: 'Suvsiz oq CuSO₄ suv testi', guruh: 'tuzlar_mas', izoh: '141 & 155-betlar.' },
    { nom: '5,4 g Al → 0,3 mol (29,4 g) → 147 g 20% H₂SO₄', qisqa: '141-bet 4-masala', guruh: 'tuzlar_mas', izoh: '2Al + 3H₂SO₄ nisbati.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Suyultirish',
    savol: 'Sulfat kislotani suv bilan suyultirishning qat\'iy xavfsizlik qoidasi:',
    variantlar: ['Baravar quyiladi', 'Suv kislotaga quyiladi', 'Kislota oz-ozdan suvga quyiladi', 'Qaynatib quyiladi'],
    togri: 2,
    izoh: '139-bet: suv kislota sirtida qaynab sachraydi.',
  },
  {
    belgi: 'Sovuq Fe',
    savol: '~100% li sovuq konsentrlangan H₂SO₄ temir (Fe) bilan qanday reaksiyaga kirishadi?',
    variantlar: ['Ta\'sir etmaydi (passivlashadi — po\'lat sisternada tashiladi)', 'Portlaydi', 'FeCl₂ beradi', 'H₂ chiqaradi'],
    togri: 0,
    izoh: '139-bet: po\'lat idishlarda bemalol tashiladi.',
  },
  {
    belgi: 'Shakar + H₂SO₄',
    savol: 'C₁₂H₂₂O₁₁ + H₂SO₄(kons) → ? natijasida qaysi modda hosil bo\'ladi?',
    variantlar: ['CO₂ gazi', 'H₂↑', 'Oq cho\'kma', '12C (qora g\'ovak ko\'mir) + H₂SO₄·11H₂O'],
    togri: 3,
    izoh: '140-bet: kuchli suv tortuvchi (gigroskopik) xossa.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'SO₄²⁻ ionining sifat reaktivi va HNO₃ da erimaydigan cho\'kmasi:',
    variantlar: ['AgNO₃ → AgCl↓', 'BaCl₂ → BaSO₄↓ (oq cho\'kma)', 'NaOH → Fe(OH)₃', 'Pb(NO₃)₂ → PbS↓'],
    togri: 1,
    izoh: '140-bet: BaSO₃ kislotada eriydi, BaSO₄ erimaydi.',
  },
  {
    belgi: 'Alebastr',
    savol: 'Gips (CaSO₄·2H₂O) 150–170°C da qizdirilganda hosil bo\'ladigan modda:',
    variantlar: ['Ohaktosh CaCO₃', 'Alebastr (CaSO₄·½H₂O / 2CaSO₄·H₂O)', 'Glauber tuzi', 'O\'lik gips'],
    togri: 1,
    izoh: '3/4 qism suvini yo\'qotib alebastr beradi.',
  },
  {
    belgi: 'Mis kuporosi',
    savol: 'Mis kuporosi (CuSO₄·5H₂O, M=250) tarkibidagi suvning massa ulushi (%):',
    variantlar: ['50%', '64%', '18%', '36% (90 / 250)'],
    togri: 3,
    izoh: '155-bet: 5·18 = 90; 90 / 250 = 36%.',
  },
  {
    belgi: '141-b 4-m',
    savol: '5,4 g Al ni eritish uchun 20% li H₂SO₄ eritmasidan necha g kerak?',
    variantlar: ['147 g eritma', '73,5 g', '29,4 g', '98 g'],
    togri: 0,
    izoh: '0,2 mol Al → 0,3 mol H₂SO₄ (29,4 g)/0,20 = 147 g.',
  },
  {
    belgi: 'Fosforit',
    savol: 'Sanoatda fosforit Ca₃(PO₄)₂ + 3H₂SO₄ dan qaysi kislota olinadi?',
    variantlar: ['HNO₃', 'HCl', '2H₃PO₄ (ortofosfat kislota)', 'H₂SO₃'],
    togri: 2,
    izoh: '139-bet: 3H₂SO₄ + Ca₃(PO₄)₂ = 3CaSO₄ + 2H₃PO₄.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '141-bet 4-masala: 5,4 g Al → 147 g 20% H₂SO₄',
    vazifa: '20% li sulfat kislota massasini topish tartibini tuzing:',
    tartib: [
      '1. 2Al + 3H₂SO₄ = Al₂(SO₄)₃ + 3H₂↑',
      '2. n(Al) = 5,4 / 27 = 0,2 mol → n(H₂SO₄) = 0,3 mol',
      '3. m(H₂SO₄) = 0,3 · 98 = 29,4 g',
      '4. m(eritma) = 29,4 / 0,20 = 147 g',
    ],
    variantlar: [
      '3. m(H₂SO₄) = 0,3 · 98 = 29,4 g',
      '1. 2Al + 3H₂SO₄ = Al₂(SO₄)₃ + 3H₂↑',
      '4. m(eritma) = 29,4 / 0,20 = 147 g',
      '2. n(Al) = 5,4 / 27 = 0,2 mol → n(H₂SO₄) = 0,3 mol',
    ],
  },
  {
    tur: '138–140-bet: Piritdan BaSO₄↓ sifatigacha',
    vazifa: 'Piritdan BaSO₄↓ cho\'kmasigacha o\'zgarishlarni tartiblang:',
    tartib: [
      '1. 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '2. 2SO₂ + O₂ ⇄ 2SO₃ (V₂O₅ ishtirokida)',
      '3. SO₃ + H₂O = H₂SO₄ (sulfat kislota)',
      '4. H₂SO₄ + BaCl₂ = BaSO₄↓ (oq cho\'kma) + 2HCl',
    ],
    variantlar: [
      '2. 2SO₂ + O₂ ⇄ 2SO₃ (V₂O₅ ishtirokida)',
      '4. H₂SO₄ + BaCl₂ = BaSO₄↓ (oq cho\'kma) + 2HCl',
      '1. 4FeS₂ + 11O₂ → 2Fe₂O₃ + 8SO₂',
      '3. SO₃ + H₂O = H₂SO₄ (sulfat kislota)',
    ],
  },
  {
    tur: '155-bet: CuSO₄·5H₂O da suv ulushi (36%)',
    vazifa: 'Mis kuporosida suv massa ulushini hisoblash tartibi:',
    tartib: [
      '1. M(CuSO₄) = 64 + 32 + 64 = 160 g/mol',
      '2. M(5H₂O) = 5 · 18 = 90 g/mol',
      '3. M(CuSO₄·5H₂O) = 160 + 90 = 250 g/mol',
      '4. w(H₂O) = (90 / 250) · 100% = 36%',
    ],
    variantlar: [
      '3. M(CuSO₄·5H₂O) = 160 + 90 = 250 g/mol',
      '4. w(H₂O) = (90 / 250) · 100% = 36%',
      '1. M(CuSO₄) = 64 + 32 + 64 = 160 g/mol',
      '2. M(5H₂O) = 5 · 18 = 90 g/mol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '96% li konsentrlangan sulfat kislotaning zichligi (138-bet):',
    variantlar: ['ρ = 1,19 g/cm³', 'ρ = 1,84 g/cm³', 'ρ = 1,00 g/cm³', 'ρ = 2,16 g/cm³'],
    togri: 1,
    izoh: 'Suvdan 1,84 marta og\'ir moysimon suyuqlik.',
  },
  {
    savol: 'Konsentrlangan H₂SO₄ + C (qizdirib) reaksiyasidan chiqadigan gazlar:',
    variantlar: ['CO + H₂', 'Faqat O₂', 'CH₄ + H₂S', 'CO₂↑ + 2SO₂↑ (+ 2H₂O)'],
    togri: 3,
    izoh: '139-bet: 2H₂SO₄(kons) + C = CO₂↑ + 2SO₂↑ + 2H₂O.',
  },
  {
    savol: 'Suvni aniqlashda ishlatiladigan oq suvsiz tuz (suv tegsa ko\'karadi):',
    variantlar: ['Suvsiz oq CuSO₄ (→ CuSO₄·5H₂O)', 'BaSO₄', 'Na₂SO₄', 'FeSO₄'],
    togri: 0,
    izoh: '140-bet: suvsiz oq CuSO₄ namlikni yutib ko\'karadi.',
  },
  {
    savol: 'Glauber tuzi va Temir kuporosining formulalari:',
    variantlar: ['CaSO₄·2H₂O va CuSO₄·5H₂O', 'MgSO₄·7H₂O va BaSO₄', 'Na₂SO₄·10H₂O va FeSO₄·7H₂O', 'NaCl va FeS₂'],
    togri: 2,
    izoh: '140–141-bet muhim kristallogidratlar.',
  },
  {
    savol: 'Qora CuO kukuni suyultirilgan H₂SO₄ da eriganda qanday eritma beradi?',
    variantlar: ['Sariq gaz', 'Qizil cho\'kma', 'Havorang CuSO₄ eritmasi (+ H₂O)', 'Rangsiz'],
    togri: 2,
    izoh: '139-bet: CuO + H₂SO₄ = CuSO₄ + H₂O.',
  },
  {
    savol: 'Qaysi metallar suyultirilgan H₂SO₄ dan vodorodni siqib chiqara OLMAYDI?',
    variantlar: ['Cu, Ag, Au (vodoroddan keyin)', 'Zn, Fe, Al', 'Mg, Ca, Na', 'Hammasi chiqaradi'],
    togri: 0,
    izoh: 'Cu faqat kons. H₂SO₄ bilan qizdirilganda SO₂ chiqaradi.',
  },
  {
    savol: 'Eksikator va minoralarda kons. H₂SO₄ qaysi gazlarni quritishda ishlatiladi?',
    variantlar: ['NH₃ va H₂S ni', 'SO₂, Cl₂, HCl, O₂ larni', 'Faqat H₂O ni', 'Hech qanday gazni'],
    togri: 1,
    izoh: '140-bet: H₂SO₄ bilan kirishmaydigan gazlarni quritadi.',
  },
  {
    savol: 'FeSO₄·7H₂O (temir kuporosi) qanday rangli kristall va qayerda qo\'llanadi?',
    variantlar: ['Oq; shisha', 'Ko\'k; metall qoplash', 'Qora; yoqilg\'i', 'To\'q-yashil; qishloq xo\'jaligi, bo\'yoq va siyoh'],
    togri: 3,
    izoh: '141-bet: o\'simlik zararkunandalari va zamburug\'ga qarshi.',
  },
];

export default function S8Mavzu32() {
  const korgazmalar = [
    { nom: '1. ρ=1,84 & Kislota→Suvga', ikon: 'tomchi', komponent: <KorgazmaH2SO4FizikVaSuyultirish /> },
    { nom: '2. Suyultirilgan & H₃PO₄', ikon: 'kolba', komponent: <KorgazmaH2SO4Suyultirilgan /> },
    { nom: '3. Kons. (Fe pass., 12C)', ikon: 'uchqun', komponent: <KorgazmaH2SO4Konsentrlangan /> },
    { nom: '4. BaSO₄↓ sifat testi', ikon: 'tomchi', komponent: <KorgazmaSO4SifatReaksiyasi /> },
    { nom: '5. Glauber, Alebastr, Kuporos', ikon: 'kristall', komponent: <KorgazmaSulfatTuzlar /> },
    { nom: '6. 5,4 g Al & 36% Kuporos', ikon: 'formula', komponent: <Korgazma32Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-32"
          nom="Sulfat kislota va tuzlarni guruhlang"
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
          key="tezkor-32"
          nom="32-§: Sulfat kislota"
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
          key="zanjir-32"
          nom="Sulfat kislota zanjirlari"
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
          key="duel-32"
          sarlavha="32-§: Sulfat kislota dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="32-§"
      mavzuNom="Sulfat kislota"
      oldingiRaqam="31-§"
      oldingiNom="Oltingugurtning kislorodli birikmalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
