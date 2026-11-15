'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 41-PARAGRAF
// "Fosforning kislorodli birikmalari" (Darslik 177-184-betlar)
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
function KorgazmaP2O5VaH3PO4() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. P₂O₅ gigroskopikligi va H₃PO₄ olinishi"
      ikon="kolba"
      variantlar={[
        {
          id: 'p2o5_suv',
          tugma: 'Sovuq vs Issiq suv',
          formula: 'Sovuq: HPO₃ (zaharli)  |  Issiq: H₃PO₄',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'P₂O₅ + suv: Haroratga qarab HPO₃ yoki H₃PO₄',
            tenglama: 'Sovuq: P₂O₅+H₂O = 2HPO₃   |   Issiq: P₂O₅+3H₂O = 2H₃PO₄',
            ikkiIdish: true,
            suyuqlikRang: '#93c5fd',
            tolish: 0.72,
            stakanBelgi: '2HPO₃',
            stakanSarlavha: 'Sovuq (zaharli)',
            ikkinchiSuyuqlikRang: '#fbbf24',
            ikkinchiBelgi: '2H₃PO₄',
            ikkinchiSarlavha: 'Issiq (ortofosfat)',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 95,
            maxTemp: 120,
            reagentlar: [{ belgi: 'P₂O₅(P₄O₁₀)', rang: '#f8fafc' }],
            belgilar: [{ k: 'Gigroskopik', v: 'Eng kuchli quritgich!', rang: '#38bdf8' }],
          },
          pastki: ['P₂O₅ (dimer P₄O₁₀) — oq qor kabi', 'Sovuq suvda metafosfat HPO₃', 'Issiq suvda ortofosfat H₃PO₄'],
        },
        {
          id: 'sanoat_h3po4',
          tugma: 'Ekstraksiya & H₄P₂O₇',
          formula: 'Ca₃(PO₄)₂ + 3H₂SO₄ → 3CaSO₄↓ + 2H₃PO₄',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Fosforitdan H₃PO₄ olish va qizdirib pirofosfatga o\'tish',
            tenglama: 'Ca₃(PO₄)₂+3H₂SO₄ = 3CaSO₄↓+2H₃PO₄  |  2H₃PO₄ →(250°C) H₄P₂O₇+H₂O',
            suyuqlikRang: '#e2e8f0',
            tolish: 0.75,
            stakanBelgi: 'H₃PO₄ (Ts=42,3°C)',
            stakanSarlavha: 'O\'rtacha kuchli, uchmaydi',
            chokmaRang: '#f8fafc',
            chokmaBelgi: '3CaSO₄↓',
            qizdir: true,
            olovRang: '#fb923c',
            tempC: 220,
            maxTemp: 300,
            belgilar: [{ k: '200–250°C', v: 'H₄P₂O₇ + H₂O', rang: '#fbbf24' }],
          },
          pastki: ['Ts = 42,3°C, rangsiz kristall', 'Hidsiz va uchuvchan emas', '2H₃PO₄ →(200–250°C) H₄P₂O₇'],
        },
      ]}
    />
  );
}

function KorgazmaTuzlarVaSifat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 3 qator tuzlar (23-jadval) va Ag₃PO₄↓"
      ikon="tomchi"
      variantlar={[
        {
          id: 'dissotsiatsiya',
          tugma: '3 bosqich & Tuzlar',
          formula: 'H₂PO₄⁻ (eriydi) • HPO₄²⁻ • PO₄³⁻',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'H₃PO₄ uch asosli kislota: 3 bosqichda dissotsiatsiyalanadi',
            tenglama: 'H₃PO₄ ⇄ H⁺+H₂PO₄⁻ (I)  →  HPO₄²⁻ (II)  →  PO₄³⁻ (III)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'I: H₂PO₄⁻', qiymat: 90, yorliq: 'Barchasi eriydi', rang: '#34d399' },
              { nom: 'II: HPO₄²⁻', qiymat: 40, yorliq: 'Ishqoriy eriydi', rang: '#38bdf8' },
              { nom: 'III: PO₄³⁻', qiymat: 18, yorliq: 'Na/K/NH₄⁺ eriydi', rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Ca(H₂PO₄)₂', v: 'Ca₃(PO₄)₂+4HNO₃ dan', rang: '#34d399' }],
          },
          pastki: ['Digidrofosfatlar (H₂PO₄⁻) barchasi eriydi', 'Fosfatlar: faqat ishqoriy va NH₄⁺ eriydi', 'Ca₃(PO₄)₂ + 4HNO₃ → Ca(H₂PO₄)₂'],
        },
        {
          id: 'sifat_ag',
          tugma: 'Ag₃PO₄↓ testi',
          formula: '3Ag⁺ + PO₄³⁻ → Ag₃PO₄↓ (sariq, HNO₃ da eriydi)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Fosfat ioniga sifat reaksiyasi (AgNO₃)',
            tenglama: 'Na₃PO₄ + 3AgNO₃ → Ag₃PO₄↓ (sariq) + 3NaNO₃',
            suyuqlikRang: '#fef08a',
            tolish: 0.74,
            stakanBelgi: 'Na⁺+NO₃⁻',
            stakanSarlavha: 'AgNO₃ + PO₄³⁻',
            chokmaRang: '#facc15',
            chokmaBelgi: 'Ag₃PO₄↓ (sariq)',
            reagentlar: [{ belgi: 'AgNO₃', rang: '#cbd5e1' }],
            belgilar: [{ k: 'AgI dan farqi', v: 'HNO₃ & NH₄OH da eriydi', rang: '#34d399' }],
          },
          pastki: ['Sariq Ag₃PO₄↓ cho\'kmasi tushadi', 'HNO₃ va NH₄OH da oson eriydi', 'AgI esa kislotada erimaydi'],
        },
      ]}
    />
  );
}

function KorgazmaH3PO4Kimyo() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. H₃PO₄ reaksiyalari, NaOH nisbati va gidroliz"
      ikon="filtr"
      variantlar={[
        {
          id: 'naoh_nisbat',
          tugma: 'NaOH 1:1 / 1:2 / 1:3',
          formula: '1:1 → NaH₂PO₄  |  1:2 → Na₂HPO₄  |  1:3 → Na₃PO₄',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Ishqor mol nisbatiga ko\'ra tuz hosil bo\'lishi va pH',
            tenglama: 'NaH₂PO₄ (pH<7 kuchsiz kislota)  |  Na₃PO₄ (pH>7 kuchli ishqor)',
            turi: 'ph',
            ph: 11.4,
            kameraNom: 'Na₃PO₄ gidrolizi (lakmus → ko\'k)',
            ustunlar: [
              { nom: '1:1 NaH₂PO₄', qiymat: 48, yorliq: 'pH ≈ 4,5', rang: '#fb7185' },
              { nom: '1:2 Na₂HPO₄', qiymat: 74, yorliq: 'pH ≈ 9,0', rang: '#38bdf8' },
              { nom: '1:3 Na₃PO₄', qiymat: 96, yorliq: 'pH ≈ 12', rang: '#3b82f6' },
            ],
            belgilar: [{ k: '3CaO+2H₃PO₄', v: 'Ca₃(PO₄)₂↓+3H₂O', rang: '#34d399' }],
          },
          pastki: ['1:1 → NaH₂PO₄; 1:2 → Na₂HPO₄', '1:3 → Na₃PO₄ (kuchli ishqoriy muhit)', '3CaO + 2H₃PO₄ = Ca₃(PO₄)₂↓ + 3H₂O'],
        },
        {
          id: 'reaksiyalar',
          tugma: 'Metall, oksid, tuz',
          formula: '3Mg+2H₃PO₄→H₂↑  |  3CaCO₃+2H₃PO₄→CO₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Fosfat kislota aktiv metall va karbonatlar bilan',
            tenglama: '3Mg + 2H₃PO₄ = Mg₃(PO₄)₂↓ + 3H₂↑  |  CaCO₃ + H₃PO₄ → CO₂↑',
            suyuqlikRang: '#dbeafe',
            tolish: 0.7,
            stakanBelgi: 'H₃PO₄',
            stakanSarlavha: 'O\'rtacha kislota',
            gazRang: '#e2e8f0',
            gazBelgi: 'H₂↑ / CO₂↑',
            chokmaRang: '#f1f5f9',
            chokmaBelgi: 'Mg₃(PO₄)₂↓',
            reagentlar: [{ belgi: 'Mg/CaCO₃', rang: '#94a3b8' }],
            belgilar: [{ k: 'H₂ ga qadar', v: 'Passiv metall bilan bormaydi', rang: '#fbbf24' }],
          },
          pastki: ['H dan chapdagi metallardan H₂↑ siqib chiqaradi', 'Karbonatlardan CO₂↑ chiqaradi', 'Asosli oksidlar bilan tuz + H₂O'],
        },
      ]}
    />
  );
}

function KorgazmaBiologiyaAylanish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Hayot elementi, ATF va tabiatda aylanish (29-rasm)"
      ikon="atom"
      variantlar={[
        {
          id: 'organizm',
          tugma: 'Fersman & Organizm',
          formula: '1,5 kg P • Suyak Ca₅(PO₄)₃OH • Tish Ca₅(PO₄)₃F',
          tur: 'biogen',
          cfg: {
            sarlavha: 'A.Yu.Fersman: "Fosfor — hayot va tafakkur elementi"',
            tenglama: 'Kunlik ehtiyoj: 1–1,6 g (1600 mg)  |  Manba: baliq, sut, tuxum, loviya',
            markazBelgi: '1,5 kg P',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'Suyak (600 g P)', belgi: 'Ca₅(PO₄)₃OH', rang: '#f1f5f9' },
              { nom: 'Tish emali', belgi: 'Ca₅(PO₄)₃F', rang: '#38bdf8' },
              { nom: 'Energiya (ATF)', belgi: 'ATF ↔ ADF', rang: '#fbbf24' },
              { nom: 'Mushak & Miya', belgi: 'DNK / RNK', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Kunlik me\'yor', v: '1–1,6 g / sutka', rang: '#34d399' }],
          },
          pastki: ['Inson tanasida ~1,5 kg fosfor bor', 'Suyak: Ca₅(PO₄)₃OH; Tish: Ca₅(PO₄)₃F', 'ATF hujayra energiyasi tashuvchisi'],
        },
        {
          id: 'sikl',
          tugma: '29-rasm: Tabiat sikli',
          formula: 'Tog\' jinsi → Tuproq → O\'simlik/Hayvon → Okean (Atmosfera YO\'Q!)',
          tur: 'biogen',
          cfg: {
            sarlavha: '29-rasm: Atmosferasiz geologik-biologik fosfor sikli',
            tenglama: 'Gazsimon birikmalari yo\'qligi uchun ATMOSFERA QATNASHMAYDI',
            markazBelgi: 'NO AIR',
            markazRang: '#ef4444',
            tugunlar: [
              { nom: 'Tog\' jinsi (Ca₃(PO₄)₂)', belgi: 'Nurash', rang: '#fbbf24' },
              { nom: 'Tuproq eritmasi', belgi: 'H₂PO₄⁻', rang: '#34d399' },
              { nom: 'O\'simlik → Hayvon', belgi: 'Ozuqa', rang: '#a3e635' },
              { nom: 'Daryo → Okean cho\'kindi', belgi: 'Cho\'kish', rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Farqi', v: 'N va C dan farqli havo yo\'q', rang: '#fb7185' }],
          },
          pastki: ['Atmosfera ishtirok etmaydi!', 'Tuproq → O\'simlik → Hayvon → Okean', 'Qaytish: guano (qush go\'ngi) va tektonika'],
        },
      ]}
    />
  );
}

function Korgazma41MasalalarA() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Masalalar (1): 19,6 g H₃PO₄ va 147 g 40% eritma"
      ikon="formula"
      variantlar={[
        {
          id: 'm1',
          tugma: '1-misol: 31 g / 29,4 g',
          formula: '19,6 g H₃PO₄ uchun m(Ca₃(PO₄)₂) va m(H₂SO₄)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ca₃(PO₄)₂ + 3H₂SO₄ → 3CaSO₄↓ + 2H₃PO₄',
            tenglama: 'n(H₃PO₄) = 19,6 / 98 = 0,2 mol   →   1 tuz : 3 kislota : 2 H₃PO₄',
            qadamlar: [
              { belgi: 'n(H₃PO₄)', natija: '0,2 mol', izoh: '19,6 / 98', rang: '#38bdf8' },
              { belgi: 'm(Ca₃(PO₄)₂)', natija: '31 g', izoh: '0,1 mol · 310', rang: '#a855f7' },
              { belgi: 'm(H₂SO₄)', natija: '29,4 g', izoh: '0,3 mol · 98', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Ca₃(PO₄)₂ (0,1 mol)', foiz: 100, qiymat: '31 g', rang: '#a855f7' },
              { nom: 'H₂SO₄ (0,3 mol)', foiz: 95, qiymat: '29,4 g', rang: '#fbbf24' },
              { nom: 'H₃PO₄ (0,2 mol)', foiz: 63, qiymat: '19,6 g', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 31 g fosforit va 29,4 g H₂SO₄',
          },
          pastki: ['M(H₃PO₄) = 98, M(Ca₃(PO₄)₂) = 310', '0,1 mol fosforit = 31 g', '0,3 mol H₂SO₄ = 29,4 g'],
        },
        {
          id: 'm2',
          tugma: '2-misol: 147 g (40%)',
          formula: '100 g 93% Ca₃(PO₄)₂ → ? g 40% H₃PO₄',
          tur: 'hisob',
          cfg: {
            sarlavha: '100 g 93% li fosforitdan 40% li H₃PO₄ eritmasi massasi',
            tenglama: 'm(tuz) = 93 g (0,3 mol)   →   n(H₃PO₄) = 0,6 mol',
            qadamlar: [
              { belgi: 'n(tuz) = 93/310', natija: '0,3 mol', izoh: '93% toza', rang: '#a855f7' },
              { belgi: 'm(H₃PO₄)', natija: '58,8 g', izoh: '0,6 mol · 98', rang: '#fbbf24' },
              { belgi: 'm_er = 58,8/0,4', natija: '147 g', izoh: '40% eritma', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Sof H₃PO₄ (40%)', foiz: 40, qiymat: '58,8 g', rang: '#fbbf24' },
              { nom: '40% li eritma', foiz: 100, qiymat: '147 g', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 147 g 40% li H₃PO₄ eritmasi',
          },
          pastki: ['100 · 0,93 = 93 g Ca₃(PO₄)₂ (0,3 mol)', '0,6 mol · 98 = 58,8 g H₃PO₄', '58,8 / 0,40 = 147 g eritma'],
        },
      ]}
    />
  );
}

function Korgazma41MasalalarB() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Masalalar (2): 21,2 g K₃PO₄ va KOH nisbati"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'zanjir_masala',
          tugma: '15,5 g → 21,2 g K₃PO₄',
          formula: '15,5 g Ca₃(PO₄)₂ → P → P₂O₅ + 16,8 g KOH → K₃PO₄',
          tur: 'hisob',
          cfg: {
            sarlavha: '15,5 g fosforit (0,05 mol) va 16,8 g KOH (0,3 mol) dan tuz',
            tenglama: 'n(P) = 0,1 mol   |   n(KOH) = 16,8 / 56 = 0,3 mol   →   KOH:P = 3:1',
            qadamlar: [
              { belgi: 'n(P) = 0,05·2', natija: '0,1 mol', izoh: '3,1 g P → 0,05 P₂O₅', rang: '#fbbf24' },
              { belgi: 'n(KOH) = 16,8/56', natija: '0,3 mol', izoh: 'P₂O₅+6KOH→2K₃PO₄', rang: '#38bdf8' },
              { belgi: 'm(K₃PO₄) = 0,1·212', natija: '21,2 g', izoh: 'M = 212 g/mol', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'KOH (0,3 mol)', foiz: 100, qiymat: '16,8 g', rang: '#38bdf8' },
              { nom: 'K₃PO₄ (0,1 mol)', foiz: 66.7, qiymat: '21,2 g', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 21,2 g K₃PO₄ (o\'rta tuz)',
          },
          pastki: ['n(tuz) = 15,5/310 = 0,05 mol → 0,1 mol P', 'n(KOH) = 16,8/56 = 0,3 mol (3:1)', '0,1 · 212 = 21,2 g K₃PO₄'],
        },
        {
          id: 'nisbatlar',
          tugma: 'Mol nisbat shkalasi',
          formula: '1 KOH → KH₂PO₄ • 2 KOH → K₂HPO₄ • 3 KOH → K₃PO₄',
          tur: 'hisob',
          cfg: {
            sarlavha: '0,1 mol H₃PO₄ ga qo\'shilgan KOH moliga qarab tuz turlari',
            tenglama: 'Nisbat n(KOH)/n(H₃PO₄) tuz tarkibini aniq belgilaydi',
            qadamlar: [
              { belgi: '0,1 mol KOH (1:1)', natija: '13,6 g KH₂PO₄', izoh: 'Nordon (M=136)', rang: '#fb7185' },
              { belgi: '0,2 mol KOH (2:1)', natija: '17,4 g K₂HPO₄', izoh: 'Gidrofosfat (M=174)', rang: '#38bdf8' },
              { belgi: '0,3 mol KOH (3:1)', natija: '21,2 g K₃PO₄', izoh: 'O\'rta fosfat (M=212)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '1:1 KH₂PO₄', foiz: 64, qiymat: '13,6 g', rang: '#fb7185' },
              { nom: '2:1 K₂HPO₄', foiz: 82, qiymat: '17,4 g', rang: '#38bdf8' },
              { nom: '3:1 K₃PO₄', foiz: 100, qiymat: '21,2 g', rang: '#34d399' },
            ],
            javobBadge: '3:1 nisbatda sof K₃PO₄ hosil bo\'ladi',
          },
          pastki: ['1:1 → KH₂PO₄ (136 g/mol)', '2:1 → K₂HPO₄ (174 g/mol)', '3:1 → K₃PO₄ (212 g/mol)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (40-§) VA O'YINLAR (41-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Fosfor atomining V valentlik holatiga o\'tgan elektron tuzilishi:',
    variantlar: [
      { matn: '2s¹ 2p³', togri: false },
      { matn: '3s² 3p³ 3d⁰', togri: false },
      { matn: '3s¹ 3p³ 3d¹ (5 ta toq ē)', togri: true },
      { matn: '3s² 3p⁵', togri: false },],
    izoh: '3s-orbitaldan 1 elektron bo\'sh 3d ga o\'tadi.',
  },
  {
    id: 't2',
    savol: 'Oq (P₄) va qizil (Pn) fosforning qaysi xossasi to\'g\'ri?',
    variantlar: [
      { matn: 'Oq zaharli va CS₂ da eriydi; qizil zaharsiz va erimaydi', togri: true },
      { matn: 'Oq zaharsiz, qizil 40°C da yonadi', togri: false },
      { matn: 'Ikkalasi suvda eriydi', togri: false },
      { matn: 'Qizil suyuq modda', togri: false },],
    izoh: '22-jadval: Oq P₄ zaharli, CS₂ da eriydi.',
  },
  {
    id: 't3',
    savol: 'Ca₃(PO₄)₂ + 5C + 3SiO₂ →(1500°C) shlak va mahsulot:',
    variantlar: [
      { matn: 'CaO + CO₂', togri: false },
      { matn: 'CaCO₃ + PH₃', togri: false },
      { matn: 'Ca₃P₂ + Si', togri: false },
      { matn: '3CaSiO₃ + 2P + 5CO↑', togri: true },],
    izoh: '1500°C elektr pechda P bug\'i chiqadi.',
  },
  {
    id: 't4',
    savol: 'Gugurtda Bertole tuzi bilan qaysi modda ta\'sirlashadi?',
    variantlar: [
      { matn: 'Oq P₄', togri: false },
      { matn: 'Qizil Pn (6P + 5KClO₃ → 5KCl + 3P₂O₅)', togri: true },
      { matn: 'Azot N₂', togri: false },
      { matn: 'Qora P', togri: false },],
    izoh: 'Xavfsiz gugurt qutisi yonida qizil fosfor bor.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'p2o5_h3po4', nom: 'P₂O₅ & H₃PO₄ olish', tavsif: 'HPO₃, H₄P₂O₇, 42,3°C' },
    { id: 'tuz_sifat', nom: 'Tuzlar & Ag₃PO₄↓', tavsif: 'H₂PO₄⁻, Na₃PO₄, sariq' },
    { id: 'bio_hisob', nom: 'Biologiya & 29-rasm', tavsif: 'ATF, suyak, atmosferasiz' },
  ],
  topshiriqlar: [
    { nom: 'Sovuqda P₂O₅+H₂O = 2HPO₃', qisqa: 'Zaharli metafosfat', guruh: 'p2o5_h3po4', izoh: 'Issiqda esa 2H₃PO₄ hosil bo\'ladi.' },
    { nom: 'Ca₃(PO₄)₂ + 3H₂SO₄ → 3CaSO₄↓', qisqa: 'Sanoatda H₃PO₄ olish', guruh: 'p2o5_h3po4', izoh: 'Ts=42,3°C, uchmaydigan kislota.' },
    { nom: '2H₃PO₄ →(250°C) H₄P₂O₇ + H₂O', qisqa: 'Pirofosfat kislota', guruh: 'p2o5_h3po4', izoh: 'Qizdirilganda suv ajraladi.' },
    { nom: 'H₂PO₄⁻ tuzlar barchasi eriydi', qisqa: 'Digidrofosfat (23-jadval)', guruh: 'tuz_sifat', izoh: 'Ca₃(PO₄)₂+4HNO₃ → Ca(H₂PO₄)₂.' },
    { nom: 'Na₃PO₄ + 3AgNO₃ → Ag₃PO₄↓', qisqa: 'Sariq cho\'kma (PO₄³⁻ testi)', guruh: 'tuz_sifat', izoh: 'HNO₃ va NH₄OH da eriydi.' },
    { nom: 'Na₃PO₄ eritmasida pH > 7', qisqa: 'Kuchli gidroliz', guruh: 'tuz_sifat', izoh: '1:3 mol NaOH dan olinadi.' },
    { nom: 'Suyak Ca₅(PO₄)₃OH; tish ...F', qisqa: 'Tanada ~1,5 kg P', guruh: 'bio_hisob', izoh: 'Kunlik ehtiyoj 1–1,6 g.' },
    { nom: 'Aylanishda atmosfera YO\'Q', qisqa: '29-rasm tabiat sikli', guruh: 'bio_hisob', izoh: 'Gazsimon P birikmalari yo\'q.' },
    { nom: 'ATF ↔ ADF + E', qisqa: 'Hayot va tafakkur elementi', guruh: 'bio_hisob', izoh: 'A.Yu.Fersman ta\'rifi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Harorat',
    savol: 'P₂O₅ sovuq va issiq suvda qaysi kislotalarni hosil qiladi?',
    variantlar: ['Sovuq: H₃PO₄; Issiq: H₄P₂O₇', 'Ikkalasida HPO₃', 'Sovuq: HPO₃; Issiq: H₃PO₄', 'H₃PO₃'],
    togri: 2,
    izoh: 'Sovuqda zaharli HPO₃, qaynatsa H₃PO₄.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'PO₄³⁻ ionini AgNO₃ bilan aniqlaganda nima tushadi?',
    variantlar: ['Sariq Ag₃PO₄↓ (HNO₃ da eriydi)', 'Oq AgCl↓', 'Qora Ag₂S↓', 'Gaz chiqadi'],
    togri: 0,
    izoh: 'AgI kislotada erimaydi, Ag₃PO₄↓ esa HNO₃ da eriydi.',
  },
  {
    belgi: '23-jadval',
    savol: 'Fosfat kislota tuzlaridan qaysi qatori BARCHA metallarda eriydi?',
    variantlar: ['O\'rta fosfatlar PO₄³⁻', 'Pirofosfatlar', 'Erimaydigan yo\'q', 'Digidrofosfatlar H₂PO₄⁻'],
    togri: 3,
    izoh: 'Barcha digidrofosfatlar suvda yaxshi eriydi.',
  },
  {
    belgi: 'Biologiya',
    savol: 'Inson suyak va tish emalining fosforli birikmalari:',
    variantlar: ['CaCO₃ va NaCl', 'Ca₅(PO₄)₃OH va Ca₅(PO₄)₃F', 'H₃PO₄', 'K₃PO₄ va MgO'],
    togri: 1,
    izoh: 'Gidroksiapatit (suyak) va ftorapatit (emall).',
  },
  {
    belgi: '29-rasm',
    savol: 'Fosfor aylanishida N va C dan farqli qaysi muhit qatnashmaydi?',
    variantlar: ['Okean', 'Atmosfera (havo)', 'Tuproq', 'Tirik organizm'],
    togri: 1,
    izoh: 'Tabiatda gazsimon P birikmalari deyarli yo\'q.',
  },
  {
    belgi: 'Nisbat',
    savol: '1 mol H₃PO₄ + 2 mol NaOH → qaysi tuz hosil bo\'ladi?',
    variantlar: ['NaH₂PO₄', 'NaPO₃', 'Na₃PO₄', 'Na₂HPO₄ (natriy gidrofosfat)'],
    togri: 3,
    izoh: '1:1 → NaH₂PO₄; 1:2 → Na₂HPO₄; 1:3 → Na₃PO₄.',
  },
  {
    belgi: 'Masala 1',
    savol: '100 g 93% Ca₃(PO₄)₂ dan necha gramm 40% H₃PO₄ eritmasi olinadi?',
    variantlar: ['147 g', '98 g', '58,8 g', '310 g'],
    togri: 0,
    izoh: '0,6 mol · 98 / 0,40 = 147 g.',
  },
  {
    belgi: 'Masala 2',
    savol: '15,5 g Ca₃(PO₄)₂ → P → P₂O₅ + 16,8 g KOH dan qancha tuz chiqadi?',
    variantlar: ['13,6 g KH₂PO₄', '17,4 g K₂HPO₄', '21,2 g K₃PO₄', '42,4 g'],
    togri: 2,
    izoh: '0,1 mol P + 0,3 mol KOH (1:3) → 0,1 mol K₃PO₄ = 21,2 g.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Sifat: P → H₃PO₄ → Ag₃PO₄↓',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. 4P + 5O₂ → 2P₂O₅',
      '2. P₂O₅ + 3H₂O(issiq) → 2H₃PO₄',
      '3. H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',
      '4. Na₃PO₄ + 3AgNO₃ → Ag₃PO₄↓ (sariq)',
    ],
    variantlar: [
      '3. H₃PO₄ + 3NaOH → Na₃PO₄ + 3H₂O',
      '1. 4P + 5O₂ → 2P₂O₅',
      '4. Na₃PO₄ + 3AgNO₃ → Ag₃PO₄↓ (sariq)',
      '2. P₂O₅ + 3H₂O(issiq) → 2H₃PO₄',
    ],
  },
  {
    tur: '1-misol: 19,6 g H₃PO₄ → 31 g / 29,4 g',
    vazifa: 'Hisob tartibini tuzing:',
    tartib: [
      '1. n(H₃PO₄) = 19,6 / 98 = 0,2 mol',
      '2. Ca₃(PO₄)₂ + 3H₂SO₄ → 3CaSO₄↓ + 2H₃PO₄',
      '3. m(Ca₃(PO₄)₂) = 0,1 · 310 = 31 g',
      '4. m(H₂SO₄) = 0,3 · 98 = 29,4 g',
    ],
    variantlar: [
      '2. Ca₃(PO₄)₂ + 3H₂SO₄ → 3CaSO₄↓ + 2H₃PO₄',
      '4. m(H₂SO₄) = 0,3 · 98 = 29,4 g',
      '1. n(H₃PO₄) = 19,6 / 98 = 0,2 mol',
      '3. m(Ca₃(PO₄)₂) = 0,1 · 310 = 31 g',
    ],
  },
  {
    tur: '2-misol: 100 g 93% → 147 g eritma',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. m(Ca₃(PO₄)₂) = 100 · 0,93 = 93 g',
      '2. n(tuz) = 93 / 310 = 0,3 mol → 0,6 mol H₃PO₄',
      '3. m(H₃PO₄) = 0,6 · 98 = 58,8 g',
      '4. m_er = 58,8 / 0,40 = 147 g',
    ],
    variantlar: [
      '3. m(H₃PO₄) = 0,6 · 98 = 58,8 g',
      '4. m_er = 58,8 / 0,40 = 147 g',
      '1. m(Ca₃(PO₄)₂) = 100 · 0,93 = 93 g',
      '2. n(tuz) = 93 / 310 = 0,3 mol → 0,6 mol H₃PO₄',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'P₂O₅ + H₂O(sovuq) = ?',
    variantlar: ['2H₃PO₄', '2HPO₃ (metafosfat)', 'H₄P₂O₇', 'H₃PO₃'],
    togri: 1,
    izoh: 'Sovuqda zaharli metafosfat kislota HPO₃.',
  },
  {
    savol: '2H₃PO₄ →(200–250°C) qanday kislota beradi?',
    variantlar: ['HPO₃', 'P₂O₅', 'H₃PO₂', 'H₄P₂O₇ + H₂O (pirofosfat)'],
    togri: 3,
    izoh: 'Difosfat (pirofosfat) kislota H₄P₂O₇.',
  },
  {
    savol: 'Ca₃(PO₄)₂ + 4HNO₃ → ?',
    variantlar: ['Ca(H₂PO₄)₂ + 2Ca(NO₃)₂', '3CaO + 4NO₂', 'Ca₃(PO₄)₂ eriymaydi', '3Ca(NO₃)₂ + H₂'],
    togri: 0,
    izoh: 'Eruvchan digidrofosfat Ca(H₂PO₄)₂ olinadi.',
  },
  {
    savol: 'Insonning sutkalik fosforga ehtiyoji:',
    variantlar: ['50 g', '0,01 mg', '1–1,6 g (1600 mg)', '100 g'],
    togri: 2,
    izoh: 'Tanada ~1,5 kg, kunlik ehtiyoj 1–1,6 g.',
  },
  {
    savol: 'Sariq Ag₃PO₄↓ va sariq AgI↓ farqi:',
    variantlar: ['Ag₃PO₄ ko\'k rangli', 'Ikkalasi eriydi', 'Ag₃PO₄ HNO₃ da eriydi, AgI erimaydi', 'Farqi yo\'q'],
    togri: 2,
    izoh: 'Ag₃PO₄ kislota va ammiakda oson eriydi.',
  },
  {
    savol: '3CaO + 2H₃PO₄ = ?',
    variantlar: ['Ca₃(PO₄)₂↓ + 3H₂O', 'CaHPO₄', 'Ca₃P₂ + H₂O', 'Ca(OH)₂'],
    togri: 0,
    izoh: 'Asosli oksid + kislota → tuz + suv.',
  },
  {
    savol: 'Qaysi birikma suv yutuvchi (quritgich) sifatida ishlatiladi?',
    variantlar: ['Na₃PO₄', 'P₂O₅ (P₄O₁₀)', 'Ca₃(PO₄)₂', 'H₃PO₄'],
    togri: 1,
    izoh: 'P₂O₅ kuchli gigroskopik modda.',
  },
  {
    savol: 'Na₃PO₄ eritmasida lakmus qaysi rangda bo\'ladi?',
    variantlar: ['Qizil', 'Rangsiz', 'Binafsha', 'Ko\'k (kuchli gidroliz)'],
    togri: 3,
    izoh: 'Kuchli asos + kuchsiz kislota tuzi → ishqoriy muhit.',
  },
];

export default function S8Mavzu41() {
  const korgazmalar = [
    { nom: '1. P₂O₅ + suv & H₃PO₄', ikon: 'kolba', komponent: <KorgazmaP2O5VaH3PO4 /> },
    { nom: '2. Tuzlar & Ag₃PO₄↓', ikon: 'tomchi', komponent: <KorgazmaTuzlarVaSifat /> },
    { nom: '3. H₃PO₄ & Gidroliz', ikon: 'filtr', komponent: <KorgazmaH3PO4Kimyo /> },
    { nom: '4. Hayot & 29-rasm', ikon: 'atom', komponent: <KorgazmaBiologiyaAylanish /> },
    { nom: '5. 19,6 g & 147 g eritma', ikon: 'formula', komponent: <Korgazma41MasalalarA /> },
    { nom: '6. 21,2 g K₃PO₄ & nisbat', ikon: 'qidiruv', komponent: <Korgazma41MasalalarB /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-41"
          nom="Fosfor birikmalarini guruhlang"
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
          key="tezkor-41"
          nom="41-§: Fosfor birikmalari"
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
          key="zanjir-41"
          nom="P → Ag₃PO₄↓ & Masalalar"
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
          key="duel-41"
          sarlavha="41-§: H₃PO₄ dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="41-§"
      mavzuNom="Fosforning kislorodli birikmalari"
      oldingiRaqam="40-§"
      oldingiNom="Fosfor"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
