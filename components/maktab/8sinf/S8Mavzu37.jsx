'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 37-PARAGRAF
// "Azotning vodorodli birikmalari" (Darslik 159-163 & 170-172-bet)
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
function KorgazmaNH3TuzilishFizik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Ammiak (NH₃) tuzilishi & fizikasi"
      ikon="atom"
      variantlar={[
        {
          id: 'tuzilish',
          tugma: 'Molekula tuzilishi',
          formula: 'NH₃ • Trigonal piramida (107°) • Qutbli • Mr = 17',
          tur: 'molekula',
          cfg: {
            sarlavha: 'NH₃: 3 kovalent bog\' + 1 bo\'linmagan ē jufti',
            tenglama: 'H−N−H (107°)  |  N da xususiy juft (••)',
            rejim: 'molekula',
            markaz: { belgi: 'N', rang: '#38bdf8', r: 27 },
            atomlar: [
              { belgi: 'H', rang: '#e2e8f0', r: 15, masofa: 72, burchak: 0.45 },
              { belgi: 'H', rang: '#e2e8f0', r: 15, masofa: 72, burchak: 1.57 },
              { belgi: 'H', rang: '#e2e8f0', r: 15, masofa: 72, burchak: 2.68 },
            ],
            metrikalar: [
              { nom: 'Suvda erishi (1 H₂O)', qiymat: '700 hajm NH₃', foiz: 100, rang: '#34d399' },
              { nom: 'Havodan yengilligi', qiymat: '29 / 17 = 1,7x', foiz: 58, rang: '#fde047' },
              { nom: 'Qaynash harorati (Tq)', qiymat: '-33,4°C', foiz: 32, rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Shakl', v: 'Qutbli trigonal piramida', rang: '#a855f7' }],
          },
          pastki: ['Mr = 17 (havodan 1,7x yengil)', '1 H₂O da 700 hajm eriydi', 'N da bo\'linmagan ē jufti'],
        },
        {
          id: 'fizik',
          tugma: 'Suvda erishi (Nashatir)',
          formula: 'NH₃ + H₂O ⇄ NH₄⁺ + OH⁻ (ishqoriy • fenolftalein → malina)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Ammiak suvda erib ishqoriy muhit beradi',
            tenglama: 'NH₃ + H₂O ⇄ NH₄⁺ + OH⁻  (700 hajm / 1 H₂O)',
            suyuqlikRang: '#ec4899',
            stakanBelgi: 'NH₄OH (malina)',
            stakanSarlavha: 'Fenolftalein',
            gazRang: '#38bdf8',
            gazBelgi: 'NH₃ yutilishi',
            reagentlar: [
              { belgi: 'NH₄⁺', rang: '#38bdf8' },
              { belgi: 'OH⁻', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Eruvchanlik', v: '1 H₂O : 700 hajm NH₃', rang: '#38bdf8' },
              { k: 'Indikator', v: 'Fenolftalein → malina', rang: '#ec4899' },
              { k: 'Muhit', v: 'Ishqoriy (OH⁻)', rang: '#34d399' },
            ],
          },
          pastki: ['Nashatir spirti = NH₃ suvda', 'Lakmus → ko\'k', 'Fenolftalein → malina'],
        },
      ]}
    />
  );
}

function KorgazmaNH3Olinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Ammiak olinishi (160-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab',
          tugma: 'Lab: NH₄Cl + Ca(OH)₂',
          formula: '2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2H₂O + 2NH₃↑ (og\'zi pastga)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Laboratoriyada ammiak olish va yig\'ish',
            tenglama: '2NH₄Cl + Ca(OH)₂ →(t°) CaCl₂ + 2H₂O + 2NH₃↑',
            ikkiIdish: true,
            qizdir: true,
            tempC: 180,
            suyuqlikRang: '#cbd5e1',
            stakanBelgi: 'NH₄Cl+Ca(OH)₂',
            gazRang: '#38bdf8',
            gazBelgi: 'NH₃↑ (yengil!)',
            ikkinchiSuyuqlikRang: '#1e3a8a',
            ikkinchiBelgi: 'Og\'zi pastga',
            ikkinchiSarlavha: 'Quruq probirka',
            belgilar: [
              { k: 'Yig\'ish', v: 'Probirka og\'zi PASTGA', rang: '#fde047' },
              { k: 'Nega suv emas?', v: '700 hajm erib ketadi!', rang: '#fb7185' },
              { k: 'Zichlik', v: 'Havodan 1,7 marta yengil', rang: '#34d399' },
            ],
          },
          pastki: ['2NH₄Cl+Ca(OH)₂ → CaCl₂+2H₂O+2NH₃↑', 'Probirka og\'zi pastga!', 'Paxta tiqin qo\'yiladi'],
        },
        {
          id: 'sanoat',
          tugma: 'Sanoat (Gaber sintezi)',
          formula: 'N₂ + 3H₂ ⇄ 2NH₃ + Q  •  Katalizator: Fe + Al₂O₃ + K₂O',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Sanoatda N₂ va H₂ dan ammiak sintezi',
            tenglama: 'N₂ + 3H₂ ⇄ 2NH₃ + Q  (P↑, t° = 450–500°C)',
            bosqichlar: [
              { nom: '1. Siqish', tur: 'sovutkich', ichi: '20–30 MPa', mahsulot: 'N₂ + 3H₂', rang: '#38bdf8' },
              { nom: '2. Kolonna', tur: 'kataliz', ichi: 'Fe+Al₂O₃+K₂O', mahsulot: 'NH₃ bug\'', rang: '#fde047' },
              { nom: '3. Ajratish', tur: 'minora', ichi: 'Sovitish', mahsulot: 'Suyuq NH₃', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Bosim (P↑)', v: '4 mol → 2 mol (o\'ngga)', rang: '#38bdf8' },
              { k: 'Katalizator', v: 'G\'ovak Fe + Al₂O₃ + K₂O', rang: '#fde047' },
              { k: 'Harorat', v: 'Ekzotermik (+Q)', rang: '#34d399' },
            ],
          },
          pastki: ['N₂ + 3H₂ ⇄ 2NH₃ + Q', 'Katalizator: Fe + Al₂O₃ + K₂O', 'P↑ o\'ngga siljitadi'],
        },
      ]}
    />
  );
}

function KorgazmaDonorAkseptor() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Donor-akseptor bog' & Tuzlar (161-bet)"
      ikon="nurlar"
      variantlar={[
        {
          id: 'donor',
          tugma: 'Donor-akseptor (NH₄⁺)',
          formula: 'NH₃ (donor) + H⁺ (akseptor) → NH₄⁺ (IV valent, OD = -3)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Ammoniy ioni (NH₄⁺) hosil bo\'lish mexanizmi',
            tenglama: 'H₃N: + □H⁺ → [NH₄]⁺  (4 ta teng N−H bog\')',
            rejim: 'bog',
            bogJuft: { chap: 'NH₃', ong: 'H⁺', siljish: -0.15, chapRang: '#38bdf8', ongRang: '#fde047' },
            metrikalar: [
              { nom: 'Azot valentligi (NH₄⁺)', qiymat: 'IV valentli', foiz: 80, rang: '#34d399' },
              { nom: 'Oksidlanish darajasi', qiymat: 'OD = -3', foiz: 60, rang: '#fde047' },
              { nom: 'Bog\'lar soni', qiymat: '3 kovalent + 1 donor', foiz: 100, rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Muhim!', v: 'Valentlik IV ≠ OD (-3)', rang: '#fb7185' }],
          },
          pastki: ['NH₃ — donor; H⁺ — akseptor', 'NH₄⁺: N IV valentli, OD = -3', '4 ta teng qiymatli bog\''],
        },
        {
          id: 'tuz',
          tugma: 'Kislotalar bilan (oq tutun)',
          formula: 'NH₃+HCl = NH₄Cl • NH₃+H₂SO₄ = NH₄HSO₄ / (NH₄)₂SO₄',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Ammiak + kislota → ammoniy tuzlari',
            tenglama: 'NH₃ + HCl = NH₄Cl↓ (tutun)  |  NH₃ + HNO₃ = NH₄NO₃',
            suyuqlikRang: '#0f172a',
            stakanBelgi: 'NH₃ + HCl',
            gazRang: '#f8fafc',
            gazBelgi: 'Oq tutun: NH₄Cl',
            chokmaRang: '#e2e8f0',
            chokmaBelgi: 'NH₄Cl kristall',
            reagentlar: [
              { belgi: 'NH₄⁺', rang: '#38bdf8' },
              { belgi: 'Cl⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: '1:1 +H₂SO₄', v: 'NH₄HSO₄ (nordon tuz)', rang: '#fde047' },
              { k: '2:1 +H₂SO₄', v: '(NH₄)₂SO₄ (o\'rta tuz)', rang: '#34d399' },
              { k: '+HNO₃', v: 'NH₄NO₃ (selitra)', rang: '#38bdf8' },
            ],
          },
          pastki: ['NH₃ + HCl = NH₄Cl (oq tutun)', '1:1 H₂SO₄ → NH₄HSO₄', '2:1 H₂SO₄ → (NH₄)₂SO₄'],
        },
      ]}
    />
  );
}

function KorgazmaNH3Yonishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Ammiak yonishi: 2N₂ vs 4NO (162-bet)"
      ikon="harorat"
      variantlar={[
        {
          id: 'pt',
          tugma: 'Pt katalizator (→ 4NO)',
          formula: '4NH₃ + 5O₂ →(Pt) 4NO↑ + 6H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Platina katalizatorida katalitik oksidlanish',
            tenglama: '4NH₃ + 5O₂ →(Pt, 800°C) 4NO↑ + 6H₂O',
            qizdir: true,
            olovRang: '#fb923c',
            tempC: 270,
            suyuqlikRang: '#334155',
            stakanBelgi: 'Pt to\'ri + O₂',
            gazRang: '#38bdf8',
            gazBelgi: '4NO↑',
            elektronJuft: { chap: 'N⁻³', ong: 'N⁺²', e: '5ē' },
            belgilar: [
              { k: 'Katalizator', v: 'Platina (Pt) / Cr₂O₃', rang: '#fb923c' },
              { k: 'O₂ koeffitsiyent', v: '4NH₃ : 5O₂ → 4NO', rang: '#fde047' },
              { k: 'Ahamiyati', v: 'HNO₃ ishlab chiqarish', rang: '#34d399' },
            ],
          },
          pastki: ['4NH₃ + 5O₂ →(Pt) 4NO + 6H₂O', 'N⁻³ → N⁺² (+5ē beradi)', 'HNO₃ sanoati 1-bosqichi'],
        },
        {
          id: 'oddiy',
          tugma: 'Katalizatorsiz (→ 2N₂)',
          formula: '4NH₃ + 3O₂ = 2N₂↑ + 6H₂O  •  2NH₃ →(t°) N₂ + 3H₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Sof kislorodda katalizatorsiz yonish va parchalanish',
            tenglama: '4NH₃ + 3O₂ = 2N₂↑ + 6H₂O  |  2NH₃ →(t°) N₂ + 3H₂',
            qizdir: true,
            olovRang: '#facc15',
            suyuqlikRang: '#1e293b',
            stakanBelgi: 'NH₃ + O₂',
            gazRang: '#94a3b8',
            gazBelgi: '2N₂↑',
            elektronJuft: { chap: 'N⁻³', ong: 'N₂⁰', e: '3ē' },
            belgilar: [
              { k: 'Yonish', v: '4NH₃ + 3O₂ = 2N₂↑ + 6H₂O', rang: '#fde047' },
              { k: 'Termik', v: '2NH₃ →(t°) N₂ + 3H₂', rang: '#38bdf8' },
              { k: 'N holati', v: 'N⁻³ → N₂⁰ (erkin azot)', rang: '#34d399' },
            ],
          },
          pastki: ['4NH₃ + 3O₂ = 2N₂ + 6H₂O', 'Termik: 2NH₃ → N₂ + 3H₂', '3O₂ → N₂ vs 5O₂ → NO'],
        },
      ]}
    />
  );
}

function KorgazmaAmmoniyTuzlari() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Ammoniy tuzlari & NH₄⁺ sifat (162–163-bet)"
      ikon="filtr"
      variantlar={[
        {
          id: 'sifat',
          tugma: 'NH₄⁺ sifat reaksiyasi',
          formula: 'NH₄⁺ + OH⁻ → NH₃↑ + H₂O (qizil lakmus → ko\'k)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Ammoniy ioniga sifat reaksiyasi (+ ishqor, qizdirish)',
            tenglama: '(NH₄)₂SO₄ + 2NaOH = Na₂SO₄ + 2NH₃↑ + 2H₂O',
            qizdir: true,
            suyuqlikRang: '#0284c7',
            stakanBelgi: 'NH₄⁺ + OH⁻',
            gazRang: '#38bdf8',
            gazBelgi: 'NH₃↑ (lakmus → ko\'k)',
            reagentlar: [
              { belgi: 'NH₄⁺', rang: '#fde047' },
              { belgi: 'OH⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Reagent', v: 'NaOH yoki KOH (+ t°)', rang: '#fde047' },
              { k: 'Belgi', v: 'O\'tkir hidli NH₃↑', rang: '#38bdf8' },
              { k: 'Indikator', v: 'Qizil lakmus → KO\'K', rang: '#60a5fa' },
            ],
          },
          pastki: ['NH₄⁺ + OH⁻ → NH₃↑ + H₂O', 'Ho\'l qizil lakmus → ko\'k', 'Barcha NH₄⁺ tuzlari eriydi'],
        },
        {
          id: 'parcha',
          tugma: 'Termik parchalanish',
          formula: '(NH₄)₂CO₃ → 2NH₃+CO₂+H₂O • NH₄Cl ⇄ NH₃+HCl • NH₄NO₃ → N₂O+2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Ammoniy tuzlarining qizdirilganda parchalanishi',
            tenglama: '(NH₄)₂CO₃ →(t°) 2NH₃↑ + H₂O↑ + CO₂↑',
            qizdir: true,
            olovRang: '#fb923c',
            tempC: 210,
            suyuqlikRang: '#475569',
            stakanBelgi: 'Ammoniy tuzi',
            gazRang: '#fde047',
            gazBelgi: 'NH₃ + CO₂ / N₂O↑',
            belgilar: [
              { k: 'NH₄Cl', v: '⇄ NH₃↑ + HCl↑ (sublimatsiya)', rang: '#e2e8f0' },
              { k: 'NH₄NO₃', v: '→ N₂O↑ + 2H₂O', rang: '#38bdf8' },
              { k: 'Agromaslahat', v: 'Ohak bilan aralashtirmang!', rang: '#fb7185' },
            ],
          },
          pastki: ['(NH₄)₂CO₃ → 2NH₃+H₂O+CO₂', 'NH₄Cl ⇄ NH₃ + HCl', 'NH₄NO₃ → N₂O + 2H₂O'],
        },
      ]}
    />
  );
}

function Korgazma37Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Ammiak & Selitra masalalari (163, 171-bet)"
      ikon="formula"
      variantlar={[
        {
          id: 's3',
          tugma: '5,6 l NH₃ + O₂ (Pt)',
          formula: '4NH₃ + 5O₂ → 4NO + 6H₂O  •  V(O₂) = 7 l, V(NO) = 5,6 l',
          tur: 'hisob',
          cfg: {
            sarlavha: '163-bet 3-savol: 5,6 l NH₃ (Pt) → O₂ va NO hajmi',
            tenglama: '5,6 l NH₃  →  5,6 · (5/4) = 7 l O₂  →  5,6 l NO',
            qadamlar: [
              { belgi: 'Berilgan', natija: '5,6 l NH₃', izoh: 'n = 0,25 mol', rang: '#38bdf8' },
              { belgi: 'V(O₂) = 5,6·5/4', natija: '7 litr O₂', izoh: 'n = 0,3125 mol', rang: '#fde047' },
              { belgi: 'V(NO) = 5,6·4/4', natija: '5,6 l NO', izoh: 'n = 0,25 mol', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'NH₃ (4 hajm)', foiz: 80, qiymat: '5,6 l', rang: '#38bdf8' },
              { nom: 'O₂ (5 hajm)', foiz: 100, qiymat: '7,0 l', rang: '#fde047' },
              { nom: 'NO (4 hajm)', foiz: 80, qiymat: '5,6 l', rang: '#34d399' },
            ],
            javobBadge: 'Javob: V(O₂) = 7 l  |  V(NO) = 5,6 l',
          },
          pastki: ['Nisbat 4 : 5 : 4', 'V(O₂) = 7 litr', 'V(NO) = 5,6 litr'],
        },
        {
          id: 'm1',
          tugma: '156,8 m³ NH₃ + HNO₃',
          formula: '156,8 m³ NH₃ (7000 mol) + 1 t 44,982% HNO₃ (7140 mol) → 560 kg NH₄NO₃',
          tur: 'hisob',
          cfg: {
            sarlavha: '171–172-bet 1-misol: Ortib qolish masalasi',
            tenglama: 'NH₃ + HNO₃ = NH₄NO₃  (7000 mol + 7140 mol)',
            qadamlar: [
              { belgi: 'n(NH₃) = 156,8/22,4', natija: '7 kmol', izoh: 'Kam (to\'liq sarf)', rang: '#38bdf8' },
              { belgi: 'n(HNO₃) = 449,82/63', natija: '7,14 kmol', izoh: '0,14 kmol ortadi', rang: '#fb7185' },
              { belgi: 'm(NH₄NO₃) = 7·80', natija: '560 kg', izoh: '8,82 kg HNO₃ ortdi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'NH₃ sarf (7 kmol)', foiz: 98, qiymat: '100% sarf', rang: '#38bdf8' },
              { nom: 'HNO₃ ortdi', foiz: 12, qiymat: '8,82 kg', rang: '#fb7185' },
              { nom: 'NH₄NO₃ tuz', foiz: 100, qiymat: '560 kg', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 560 kg NH₄NO₃ • 8,82 kg HNO₃ ortib qoldi',
          },
          pastki: ['7000 mol NH₃ to\'liq sarf', '140 mol HNO₃ (8,82 kg) ortdi', '560 kg NH₄NO₃ olindi'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (36-§) VA O'YINLAR (37-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Havoda azotning hajm va massa ulushi qancha?',
    variantlar: [
      { matn: '50% va 50%', togri: false },
      { matn: '21% va 23%', togri: false },
      { matn: '78% hajm va 75,5% massa', togri: true },
      { matn: '90% va 85%', togri: false },],
    izoh: 'Havoning 78% hajmi, 75,5% massasi N₂.',
  },
  {
    id: 't2',
    savol: 'Suyuq havoni haydashda qaysi gaz avval uchadi?',
    variantlar: [
      { matn: 'Azot (-196°C)', togri: true },
      { matn: 'Kislorod (-183°C)', togri: false },
      { matn: 'Argon', togri: false },
      { matn: 'Karbonat angidrid', togri: false },],
    izoh: 'Tq(N₂) = -196°C < Tq(O₂) = -183°C.',
  },
  {
    id: 't3',
    savol: '3CuO + 2NH₃ = ? reaksiyasida nima ajraladi?',
    variantlar: [
      { matn: 'NO₂', togri: false },
      { matn: 'H₂', togri: false },
      { matn: 'O₂', togri: false },
      { matn: 'Toza azot (3Cu + 3H₂O + N₂↑)', togri: true },],
    izoh: 'Laboratoriyada toza N₂ olinadi.',
  },
  {
    id: 't4',
    savol: 'Azot xona haroratida qaysi metall bilan birikadi?',
    variantlar: [
      { matn: 'Temir', togri: false },
      { matn: 'Litiy (6Li + N₂ = 2Li₃N)', togri: true },
      { matn: 'Mis', togri: false },
      { matn: 'Magniy', togri: false },],
    izoh: 'Odatda faqat litiy bilan nitrid beradi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'olish', nom: 'Olinish & Fizik', tavsif: 'NH₄Cl+Ca(OH)₂, 700x, Fe' },
    { id: 'donor', nom: 'Donor-akseptor', tavsif: 'NH₄⁺, IV valent, +HCl' },
    { id: 'yonish', nom: 'Yonish & Sifat', tavsif: 'Pt→NO, +OH⁻→NH₃↑' },
  ],
  topshiriqlar: [
    { nom: '1 H₂O da 700 hajm NH₃', qisqa: 'Havodan 1,7x yengil', guruh: 'olish', izoh: 'Suvda juda yaxshi eriydi.' },
    { nom: '2NH₄Cl + Ca(OH)₂ → NH₃↑', qisqa: 'Probirka og\'zi pastga!', guruh: 'olish', izoh: 'Lab olish reaksiyasi.' },
    { nom: 'Fe + Al₂O₃ + K₂O', qisqa: 'Sanoat katalizatori', guruh: 'olish', izoh: 'N₂ + 3H₂ ⇄ 2NH₃ + Q.' },
    { nom: 'NH₃ (donor) + H⁺ (akseptor)', qisqa: 'NH₄⁺ hosil bo\'lishi', guruh: 'donor', izoh: 'Azotning xususiy ē jufti.' },
    { nom: 'NH₄⁺: IV valent, OD = -3', qisqa: '4 ta teng kovalent bog\'', guruh: 'donor', izoh: 'Valentlik va OD farqli!' },
    { nom: 'NH₃ + HCl = NH₄Cl', qisqa: 'Tutunsiz oq tutun', guruh: 'donor', izoh: 'Mayda tuz kristallari.' },
    { nom: '4NH₃ + 5O₂ →(Pt) 4NO + 6H₂O', qisqa: 'Katalitik oksidlanish', guruh: 'yonish', izoh: 'HNO₃ ishlab chiqarish.' },
    { nom: 'NH₄⁺ + OH⁻ → NH₃↑ + H₂O', qisqa: 'Qizil lakmus → ko\'k', guruh: 'yonish', izoh: 'NH₄⁺ ga sifat reaksiyasi.' },
    { nom: '5,6 l NH₃ + 7 l O₂ → 5,6 l NO', qisqa: '163-bet 3-savol yechimi', guruh: 'yonish', izoh: '4 : 5 : 4 nisbat.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Lab usul',
    savol: 'Labda NH₃ yig\'ishda probirka og\'zi qayerga qaratiladi?',
    variantlar: ['Suv ostiga', 'Yuqoriga', 'Pastga (havodan 1,7x yengil)', 'Yon tomonga'],
    togri: 2,
    izoh: 'NH₃ havodan yengil, suvda 700 hajm eriydi.',
  },
  {
    belgi: 'NH₄⁺',
    savol: 'NH₄⁺ ionida azotning valentligi va OD qancha?',
    variantlar: ['IV valentli, OD = -3', 'III valent, -3', 'V valent, +5', 'IV valent, +4'],
    togri: 0,
    izoh: 'Donor-akseptor bog\': valentlik IV, OD = -3.',
  },
  {
    belgi: 'Pt kataliz',
    savol: 'Pt ishtirokida 4NH₃ + 5O₂ → ? hosil bo\'ladi:',
    variantlar: ['2N₂ + 6H₂O', '4HNO₃', '4NH₄OH', '4NO + 6H₂O'],
    togri: 3,
    izoh: 'Katalizatorsiz N₂, Pt bilan NO chiqadi.',
  },
  {
    belgi: 'Eruvchanlik',
    savol: '1 hajm suvda necha hajm NH₃ eriydi?',
    variantlar: ['0,015 hajm', '700 hajm', '50 hajm', '2,5 hajm'],
    togri: 1,
    izoh: 'Vodorod bog\'i tufayli 700 hajm eriydi.',
  },
  {
    belgi: 'Sifat reaksiya',
    savol: 'NH₄⁺ ionini qaysi modda bilan aniqlaymiz?',
    variantlar: ['AgNO₃', 'Ishqor (NaOH) + qizdirish → NH₃↑', 'BaCl₂', 'HCl'],
    togri: 1,
    izoh: 'NH₃↑ chiqadi va qizil lakmus ko\'karadi.',
  },
  {
    belgi: 'Gaber',
    savol: 'Sanoatda NH₃ sintezida qaysi katalizator ishlatiladi?',
    variantlar: ['V₂O₅', 'Cu', 'MnO₂', 'Fe + Al₂O₃ + K₂O'],
    togri: 3,
    izoh: 'G\'ovak temir + aktivatorlar (Al₂O₃, K₂O).',
  },
  {
    belgi: 'Parchalanish',
    savol: '(NH₄)₂CO₃ qizdirilganda nima hosil bo\'ladi?',
    variantlar: ['2NH₃↑ + H₂O + CO₂↑', 'NH₄OH', '(NH₄)₂O + CO₂', 'N₂ + H₂'],
    togri: 0,
    izoh: 'To\'liq gaz/bug\' holida uchib ketadi.',
  },
  {
    belgi: 'Ortib qolish',
    savol: '7000 mol NH₃ + 7140 mol HNO₃ dan qancha NH₄NO₃ olinadi?',
    variantlar: ['571,2 kg', '80 kg', '560 kg (8,82 kg HNO₃ ortadi)', '8,82 kg'],
    togri: 2,
    izoh: '7000 × 80 = 560 000 g = 560 kg.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'N₂ → (NH₄)₂SO₄ zanjiri',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. N₂ + 3H₂ ⇄(Fe) 2NH₃ + Q',
      '2. NH₃ + H₂O ⇄ NH₄⁺ + OH⁻',
      '3. 2NH₃ + H₂SO₄ = (NH₄)₂SO₄',
      '4. (NH₄)₂SO₄ + 2NaOH → 2NH₃↑ + Na₂SO₄ + 2H₂O',
    ],
    variantlar: [
      '3. 2NH₃ + H₂SO₄ = (NH₄)₂SO₄',
      '1. N₂ + 3H₂ ⇄(Fe) 2NH₃ + Q',
      '4. (NH₄)₂SO₄ + 2NaOH → 2NH₃↑ + Na₂SO₄ + 2H₂O',
      '2. NH₃ + H₂O ⇄ NH₄⁺ + OH⁻',
    ],
  },
  {
    tur: '560 kg NH₄NO₃ hisobi',
    vazifa: 'Qadamlarni tartiblang:',
    tartib: [
      '1. n(NH₃) = 156 800 / 22,4 = 7000 mol',
      '2. n(HNO₃) = 449 820 / 63 = 7140 mol',
      '3. NH₃ to\'liq sarf (7000 mol), 140 mol HNO₃ ortdi',
      '4. m(NH₄NO₃) = 7000 · 80 = 560 kg',
    ],
    variantlar: [
      '2. n(HNO₃) = 449 820 / 63 = 7140 mol',
      '4. m(NH₄NO₃) = 7000 · 80 = 560 kg',
      '1. n(NH₃) = 156 800 / 22,4 = 7000 mol',
      '3. NH₃ to\'liq sarf (7000 mol), 140 mol HNO₃ ortdi',
    ],
  },
  {
    tur: 'Donor-akseptor mexanizm',
    vazifa: 'NH₄⁺ hosil bo\'lishini tartiblang:',
    tartib: [
      '1. NH₃ da azotning bo\'linmagan ē jufti (donor)',
      '2. H⁺ ionida bo\'sh orbital bor (akseptor)',
      '3. Donor-akseptor bog\' bilan NH₄⁺ (IV valent)',
      '4. Eritmada OH⁻ ko\'payib ishqoriy muhit beradi',
    ],
    variantlar: [
      '3. Donor-akseptor bog\' bilan NH₄⁺ (IV valent)',
      '4. Eritmada OH⁻ ko\'payib ishqoriy muhit beradi',
      '1. NH₃ da azotning bo\'linmagan ē jufti (donor)',
      '2. H⁺ ionida bo\'sh orbital bor (akseptor)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '4NH₃ + 5O₂ →(Pt) ? mahsuloti:',
    variantlar: ['2N₂ + 6H₂O', '4NO + 6H₂O', '4NH₄OH', '2N₂O + H₂O'],
    togri: 1,
    izoh: 'Platina katalizida 4NO + 6H₂O.',
  },
  {
    savol: 'NH₃ + HCl uchrashganda nima ko\'rinadi?',
    variantlar: ['Portlaydi', 'Ko\'k eritma', 'Qora cho\'kma', 'Oq tutun (NH₄Cl kristallari)'],
    togri: 3,
    izoh: 'NH₃ + HCl = NH₄Cl (oq tutun).',
  },
  {
    savol: '(NH₄)₂CO₃ qizdirilganda:',
    variantlar: ['2NH₃ + H₂O + CO₂', 'NH₄OH + C', '(NH₄)₂O + CO₂', 'N₂ + H₂ + C'],
    togri: 0,
    izoh: 'Uchala mahsulot ham uchib ketadi.',
  },
  {
    savol: 'NH₃ suvli eritmasida fenolftalein rangi:',
    variantlar: ['Rangsiz', 'Sariq', 'Malina (qizil) rang', 'Ko\'k'],
    togri: 2,
    izoh: 'NH₄⁺ + OH⁻ ishqoriy muhit beradi.',
  },
  {
    savol: '5,6 l NH₃ (Pt bilan) uchun necha litr O₂ kerak?',
    variantlar: ['2,8 l O₂', '5,6 l O₂', '7 l O₂', '22,4 l O₂'],
    togri: 2,
    izoh: '5,6 × 5/4 = 7 l O₂.',
  },
  {
    savol: 'NH₃ + H₂SO₄ (1:1 mol) dan qaysi tuz olinadi?',
    variantlar: ['NH₄HSO₄ (nordon)', '(NH₄)₂SO₄', 'NH₄Cl', 'NH₄NO₃'],
    togri: 0,
    izoh: 'Ammoniy gidrosulfat — NH₄HSO₄.',
  },
  {
    savol: 'NH₃ + H⁺ → NH₄⁺ da qaysi zarracha DONOR?',
    variantlar: ['H⁺ ioni', 'NH₃ (xususiy ē jufti)', 'OH⁻ ioni', 'Suv'],
    togri: 1,
    izoh: 'NH₃ donor, H⁺ akseptor.',
  },
  {
    savol: 'N₂ + 3H₂ ⇄ 2NH₃ + Q uchun bosim nima qilinadi?',
    variantlar: ['Pasaytiriladi', 'O\'zgarmaydi', 'Vakuum', 'Orttiriladi (4 → 2 mol)'],
    togri: 3,
    izoh: 'Bosimni orttirish o\'ngga siljitadi.',
  },
];

export default function S8Mavzu37() {
  const korgazmalar = [
    { nom: '1. NH₃ tuzilish & 700x', ikon: 'atom', komponent: <KorgazmaNH3TuzilishFizik /> },
    { nom: '2. Lab & Sanoat sintez', ikon: 'kolba', komponent: <KorgazmaNH3Olinishi /> },
    { nom: '3. Donor-akseptor & Tuz', ikon: 'nurlar', komponent: <KorgazmaDonorAkseptor /> },
    { nom: '4. Yonish: 2N₂ vs 4NO', ikon: 'harorat', komponent: <KorgazmaNH3Yonishi /> },
    { nom: '5. NH₄⁺ tuz & sifat', ikon: 'filtr', komponent: <KorgazmaAmmoniyTuzlari /> },
    { nom: '6. 163 & 171-bet masala', ikon: 'formula', komponent: <Korgazma37Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-37"
          nom="NH₃ va NH₄⁺ ni guruhlang"
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
          key="tezkor-37"
          nom="37-§: Ammiak"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Zanjir',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-37"
          nom="Ammiak o'zgarish va hisob zanjiri"
          ikon="filtr"
          missiyalar={ZANJIR_MISSIYALAR}
        />
      ),
    },
    {
      nom: '4. Duel',
      ikon: 'kubok',
      komponent: (
        <JamoalarDueliPanel
          key="duel-37"
          sarlavha="37-§: Ammiak dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="37-§"
      mavzuNom="Azotning vodorodli birikmalari"
      oldingiRaqam="36-§"
      oldingiNom="Azot"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
