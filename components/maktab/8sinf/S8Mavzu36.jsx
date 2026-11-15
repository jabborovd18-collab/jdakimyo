'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 36-PARAGRAF
// "Azot" (Darslik 156-159 & 174-betlar)
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
function KorgazmaVAGuruhVaN2() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Azot molekulasi (N≡N) va VA guruh"
      ikon="atom"
      variantlar={[
        {
          id: 'n2',
          tugma: 'N ≡ N tuzilishi',
          formula: 'N≡N • Mr = 28 • 2s²2p³ • 3 juft ē',
          tur: 'molekula',
          cfg: {
            sarlavha: 'N≡N — mustahkam uch karrali kovalent bog\'',
            tenglama: '1s² 2s² 2p³  |  3 toq ē → N≡N (inert)',
            rejim: 'molekula',
            markaz: { belgi: 'N', rang: '#38bdf8', r: 26 },
            atomlar: [{ belgi: 'N', rang: '#38bdf8', r: 26, masofa: 86, bog: 3, burchak: 0 }],
            metrikalar: [
              { nom: 'Bog\' energiyasi', qiymat: '945 kJ/mol', foiz: 95, rang: '#fde047' },
              { nom: 'Kovalent karralik', qiymat: '3 (σ + 2π)', foiz: 100, rang: '#38bdf8' },
              { nom: 'Reaksion faollik (20°C)', qiymat: 'Juda past', foiz: 12, rang: '#94a3b8' },
            ],
            belgilar: [{ k: 'Bog\' turi', v: 'Qutbsiz kovalent', rang: '#34d399' }],
          },
          pastki: ['N≡N (3 juft umumiy ē)', 'Tashqi qavat: 2s² 2p³', 'OD: -3, 0, +1..+5'],
        },
        {
          id: 'va',
          tugma: 'VA: N, P, As, Sb, Bi',
          formula: 'VA guruh: ns²np³ • N,P (metallmas) → Bi (metall)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Azot atomi (Z = 7) va VA guruhcha',
            tenglama: 'N(7) → P(15) → As(33) → Sb(51) → Bi(83)',
            rejim: 'atom',
            markaz: { belgi: 'N', zaryad: '+7', rang: '#ef4444' },
            qavatlar: [2, 5],
            metrikalar: [
              { nom: 'Atom radiusi (N → Bi)', qiymat: 'Ortadi', foiz: 88, rang: '#f472b6' },
              { nom: 'Metallmaslik (N → Bi)', qiymat: 'Kamayadi', foiz: 35, rang: '#38bdf8' },
              { nom: 'Valent elektron (ns²np³)', qiymat: '5 ē', foiz: 62, rang: '#fde047' },
            ],
            belgilar: [{ k: 'Yuqori oksid', v: 'E₂O₅ (EH₃)', rang: '#a855f7' }],
          },
          pastki: ['N, P — metallmas; As, Sb, Bi', 'Umumiy formula: ns² np³', 'Yuqori oksid: E₂O₅'],
        },
      ]}
    />
  );
}

function KorgazmaAzotTabiatda() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Azot tabiatda (157–158-bet)"
      ikon="yadro"
      variantlar={[
        {
          id: 'havo',
          tugma: 'Havo tarkibi (78%)',
          formula: 'Havoda N₂: 78% hajm • 75,5% massa',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Atmosfera havosidagi gazlar nisbati (%)',
            tenglama: 'N₂ (78% V)  |  O₂ (21% V)  |  Ar, CO₂ (1%)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'N₂ (hajm)', qiymat: 78, yorliq: '78%', rang: '#38bdf8' },
              { nom: 'N₂ (massa)', qiymat: 75.5, yorliq: '75,5%', rang: '#60a5fa' },
              { nom: 'O₂ (hajm)', qiymat: 21, yorliq: '21%', rang: '#f43f5e' },
              { nom: 'Ar + CO₂', qiymat: 1, yorliq: '1%', rang: '#34d399' },
            ],
          },
          pastki: ['Hajman 78% (≈ 4/5 qism)', 'Massa ulushi: 75,5%', 'Odatda O₂ bilan ta\'sir etmaydi'],
        },
        {
          id: 'birikma',
          tugma: 'Chili selitrasi & Oqsil',
          formula: 'NaNO₃ (Chili selitrasi) • Tuproq nitratlari • Oqsillar',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Tabiatda bog\'langan azot aylanishi',
            tenglama: 'NaNO₃ (Chili selitrasi) ↔ Tuproq ↔ Oqsil',
            markazBelgi: 'N',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Atmosfera N₂', belgi: 'N₂', rang: '#38bdf8' },
              { nom: 'Chili selitrasi', belgi: 'NaNO₃', rang: '#fde047' },
              { nom: 'Tirik oqsillar', belgi: 'Oqsil', rang: '#34d399' },
              { nom: 'Tuproq tuzlari', belgi: 'NO₃⁻', rang: '#a855f7' },
            ],
            belgilar: [
              { k: 'Mineral kon', v: 'Chili selitrasi: NaNO₃', rang: '#fde047' },
              { k: 'Bio-asos', v: 'Oqsillar, nuklein kislota', rang: '#34d399' },
              { k: 'Erkin N₂', v: '78% hajm (atmosfera)', rang: '#38bdf8' },
            ],
          },
          pastki: ['Chili selitrasi: NaNO₃', 'Tirik hujayra oqsillarida', 'Tuproqda mineral nitratlar'],
        },
      ]}
    />
  );
}

function KorgazmaAzotOlinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Azot olinishi (158-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'sanoat',
          tugma: 'Sanoat: Suyuq havo',
          formula: 'Tq(N₂) = -196°C (avval) • Tq(O₂) = -183°C (qoladi)',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Suyuq havoni fraksiyali haydash',
            tenglama: 'Havo → Tozalash → Sovitish → N₂↑(-196°C) / O₂(-183°C)',
            bosqichlar: [
              { nom: '1. Tozalash', tur: 'minora', ichi: 'CO₂, H₂O↓', mahsulot: 'Quruq havo', rang: '#38bdf8' },
              { nom: '2. Sovitish', tur: 'sovutkich', ichi: 'Siqish + t°↓', mahsulot: 'Suyuq havo', rang: '#60a5fa' },
              { nom: '3. Haydash', tur: 'kataliz', ichi: '-196°C N₂↑', mahsulot: '-183°C O₂', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Birinchi gaz', v: 'N₂ (-196°C)', rang: '#38bdf8' },
              { k: 'Suyuq qoldiq', v: 'O₂ (-183°C)', rang: '#f43f5e' },
              { k: 'Xomashyo', v: 'Atmosfera havosi', rang: '#fde047' },
            ],
          },
          pastki: ['Tq(N₂) = -196°C (avval uchadi)', 'Tq(O₂) = -183°C (suyuq qoladi)', 'Xomashyo: havo'],
        },
        {
          id: 'lab',
          tugma: 'Lab: 3CuO + 2NH₃',
          formula: '3CuO + 2NH₃ = 3Cu + 3H₂O + N₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Laboratoriyada qizdirilgan CuO bilan N₂ olish',
            tenglama: '3Cu⁺²O + 2N⁻³H₃ → 3Cu⁰ + 3H₂O + N₂⁰↑',
            ikkiIdish: true,
            qizdir: true,
            tempC: 240,
            suyuqlikRang: '#92400e',
            stakanBelgi: 'CuO + NH₃',
            stakanSarlavha: 'Qizdirish',
            gazRang: '#38bdf8',
            gazBelgi: 'N₂↑',
            ikkinchiSuyuqlikRang: '#0284c7',
            ikkinchiBelgi: 'Toza N₂',
            ikkinchiSarlavha: 'Yig\'ish',
            elektronJuft: { chap: 'N⁻³', ong: 'Cu⁺²', e: '2ē' },
            belgilar: [
              { k: 'Katalizatorsiz', v: '3CuO+2NH₃ → 3Cu+3H₂O+N₂↑', rang: '#fde047' },
              { k: 'Muqobil usul', v: 'NH₄NO₂ → N₂↑ + 2H₂O', rang: '#34d399' },
              { k: 'OQR turi', v: 'Cu⁺² → Cu⁰; N⁻³ → N₂⁰', rang: '#38bdf8' },
            ],
          },
          pastki: ['3CuO + 2NH₃ = 3Cu + 3H₂O + N₂↑', 'NH₄NO₂ →(t°) N₂↑ + 2H₂O', 'Toza azot ajraladi'],
        },
      ]}
    />
  );
}

function KorgazmaAzotFizik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Fizik xossalari (158-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'param',
          tugma: 'Konstantalar (-196°C)',
          formula: 'Ts = -210°C • Tq = -196°C • ρ = 1,25 g/l • 0,0154 hajm/H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Azot (N₂) ning fizik ko\'rsatkichlari',
            tenglama: 'Rangsiz, hidsiz gaz  |  D_havo = 0,966  |  D_H₂ = 14',
            tempC: 20,
            maxTemp: 250,
            suyuqlikRang: '#0284c7',
            stakanBelgi: 'H₂O + N₂',
            stakanSarlavha: 'Eruvchanlik',
            gazRang: '#e2e8f0',
            gazBelgi: '0,0154 hajm',
            reagentlar: [
              { belgi: 'N₂', rang: '#38bdf8' },
              { belgi: 'N₂', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Ts / Tq', v: '-210°C  /  -196°C', rang: '#fde047' },
              { k: 'Eruvchanlik', v: '1 H₂O : 0,0154 hajm N₂', rang: '#34d399' },
              { k: 'Zichlik', v: 'ρ = 1,25 g/l (D_havo 0,966)', rang: '#a855f7' },
            ],
          },
          pastki: ['Ts = -210°C, Tq = -196°C', '1 H₂O da 0,0154 hajm N₂', 'ρ = 1,25 g/l; D_H₂ = 14'],
        },
        {
          id: 'suyuq',
          tugma: 'Suyuq azot (-196°C)',
          formula: 'Suyuq N₂ (-196°C): kriogenika, tibbiyot, inert muhit',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Suyuq azotning qo\'llanilishi',
            tenglama: '-196°C sovuq muhit • Inert himoya • Ammiak sintezi',
            bosqichlar: [
              { nom: 'Kriogenika', tur: 'sovutkich', ichi: '-196°C', mahsulot: 'Tibbiyot / Biobank', rang: '#38bdf8' },
              { nom: 'Inert muhit', tur: 'minora', ichi: 'N₂ yostig\'i', mahsulot: 'Oksidlanish yo\'q', rang: '#34d399' },
              { nom: 'Kimyo sanoati', tur: 'kataliz', ichi: 'N₂ + 3H₂', mahsulot: 'NH₃ → O\'g\'itlar', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Harorat', v: '-196°C (suyuq)', rang: '#38bdf8' },
              { k: 'Xavfsizlik', v: 'Yonmaydi, inert', rang: '#34d399' },
              { k: 'Asosiy sarf', v: 'NH₃ va HNO₃ sintezi', rang: '#fde047' },
            ],
          },
          pastki: ['Suyuq N₂ = -196°C', 'Inert saqlash muhiti', 'Ammiak va o\'g\'it sintezi'],
        },
      ]}
    />
  );
}

function KorgazmaAzotKimyoNitrid() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Kimyoviy xossalari & Nitridlar (158–159-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'o2h2',
          tugma: '+O₂ (2000°C) va +H₂',
          formula: 'N₂+O₂ ⇄ 2NO−Q (2000°C) • N₂+3H₂ ⇄ 2NH₃+Q',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Kislorod va vodorod bilan qattiq sharoitda',
            tenglama: 'N₂ + O₂ ⇄(2000°C) 2NO − Q   |   N₂ + 3H₂ ⇄ 2NH₃ + Q',
            qizdir: true,
            olovRang: '#38bdf8',
            tempC: 290,
            suyuqlikRang: '#1e3a8a',
            stakanBelgi: '2000°C / Fe',
            gazRang: '#fde047',
            gazBelgi: 'NO / NH₃',
            elektronJuft: { chap: 'N₂⁰', ong: 'O₂⁰ / H₂⁰', e: 'ē' },
            belgilar: [
              { k: 'Chaqmoqda', v: 'N₂ + O₂ ⇄ 2NO − Q (2000°C)', rang: '#fde047' },
              { k: 'Kataliz (Fe)', v: 'N₂ + 3H₂ ⇄ 2NH₃ + Q', rang: '#34d399' },
              { k: 'N holati', v: 'NO da +2; NH₃ da -3', rang: '#38bdf8' },
            ],
          },
          pastki: ['Chaqmoqda: N₂+O₂ ⇄ 2NO − Q', 'Kataliz: N₂+3H₂ ⇄ 2NH₃ + Q', 'Odatda reaksiya bermaydi'],
        },
        {
          id: 'nitrid',
          tugma: 'Nitridlar: Li₃N, Mg₃N₂',
          formula: 'Odatda: 6Li+N₂ = 2Li₃N • Qizdirishda: 3Mg+N₂ = Mg₃N₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Metallar bilan nitridlar hosil bo\'lishi (N⁻³)',
            tenglama: '6Li + N₂ = 2Li₃N (20°C)  |  3Mg + N₂ →(t°) Mg₃N₂',
            suyuqlikRang: '#0f766e',
            stakanBelgi: 'Li / Mg + N₂',
            chokmaRang: '#34d399',
            chokmaBelgi: 'Li₃N / Mg₃N₂',
            reagentlar: [
              { belgi: 'Li', rang: '#f472b6' },
              { belgi: 'Mg', rang: '#fde047' },
              { belgi: 'N₂', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Xona t° (20°C)', v: 'Faqat 6Li + N₂ = 2Li₃N', rang: '#f472b6' },
              { k: 'Qizdirganda', v: '3Mg + N₂ = Mg₃N₂', rang: '#34d399' },
              { k: 'N ning OD', v: 'Nitridlarda -3', rang: '#fde047' },
            ],
          },
          pastki: ['Odatda faqat: 6Li + N₂ = 2Li₃N', 'Qizdirganda: 3Mg + N₂ = Mg₃N₂', 'Nitridlarda N ning OD = -3'],
        },
      ]}
    />
  );
}

function Korgazma36Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Zichlik & Ca(CN)₂ hisobi (159, 174-bet)"
      ikon="formula"
      variantlar={[
        {
          id: 'zichlik',
          tugma: 'N₂ zichligi (159-bet)',
          formula: 'D_H₂ = 14 • D_havo = 0,966 • ρ = 1,25 g/l',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Azot (Mr = 28) zichliklarini hisoblash',
            tenglama: 'D_H₂ = M/2  |  D_havo = M/29  |  ρ = M/22,4',
            qadamlar: [
              { belgi: 'Mr(N₂)', natija: '28 g/mol', izoh: '2 × 14', rang: '#38bdf8' },
              { belgi: 'D_H₂ = 28/2', natija: '14', izoh: 'H₂ dan 14x og\'ir', rang: '#fde047' },
              { belgi: 'D_havo = 28/29', natija: '0,966', izoh: 'ρ = 1,25 g/l', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'D_H₂(N₂)', foiz: 50, qiymat: '14', rang: '#38bdf8' },
              { nom: 'D_havo(N₂)', foiz: 96.6, qiymat: '0,966', rang: '#fde047' },
              { nom: 'ρ (g/l, n.sh.)', foiz: 62, qiymat: '1,25 g/l', rang: '#34d399' },
            ],
            javobBadge: 'Javob: D_H₂ = 14 • D_havo = 0,966 • ρ = 1,25 g/l',
          },
          pastki: ['D_H₂(N₂) = 28/2 = 14', 'D_havo(N₂) = 28/29 ≈ 0,966', 'ρ(n.sh.) = 28/22,4 = 1,25 g/l'],
        },
        {
          id: 'cacn2',
          tugma: 'Ca(CN)₂ ulushi (174-bet)',
          formula: 'w(N) = 28 / 92 · 100% = 30,43% (CaCN₂ da 35%)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ca(CN)₂ tarkibidagi azot massa ulushi',
            tenglama: 'M(Ca(CN)₂) = 40 + 2·(12 + 14) = 92 g/mol',
            qadamlar: [
              { belgi: 'M(Ca(CN)₂)', natija: '92 g/mol', izoh: '40 + 52', rang: '#38bdf8' },
              { belgi: 'm(2N)', natija: '28 g', izoh: '2 × 14', rang: '#fde047' },
              { belgi: 'w(N) = 28/92', natija: '30,43%', izoh: 'CaCN₂: 35%', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Ca (40/92)', foiz: 43.5, qiymat: '43,48%', rang: '#a855f7' },
              { nom: 'C (24/92)', foiz: 26.1, qiymat: '26,09%', rang: '#38bdf8' },
              { nom: 'N (28/92)', foiz: 30.4, qiymat: '30,43%', rang: '#34d399' },
            ],
            javobBadge: 'Javob: Ca(CN)₂ da w(N) = 30,43% (CaCN₂ da 35%)',
          },
          pastki: ['M(Ca(CN)₂) = 92 g/mol', 'm(2N) = 28 g', 'w(N) = 30,43%'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (35-§) VA O'YINLAR (36-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Kontakt apparatida SO₂ → SO₃ uchun katalizator va harorat?',
    variantlar: [
      { matn: 'Fe, 1000°C', togri: false },
      { matn: 'MnO₂, 100°C', togri: false },
      { matn: 'V₂O₅, 400–450°C', togri: true },
      { matn: 'Pt, 20°C', togri: false },],
    izoh: 'V₂O₅ va 400–450°C optimal sharoit.',
  },
  {
    id: 't2',
    savol: 'SO₃ nega suvga emas, 98% H₂SO₄ ga yuttiriladi?',
    variantlar: [
      { matn: 'Suvda cho\'kmaydigan kislota tumani hosil bo\'ladi', togri: true },
      { matn: 'Suv bilan ta\'sirlashmaydi', togri: false },
      { matn: '98% H₂SO₄ arzonroq', togri: false },
      { matn: 'Gazni sovitish uchun', togri: false },],
    izoh: '98% H₂SO₄ da tuman bermay oleum hosil bo\'ladi.',
  },
  {
    id: 't3',
    savol: 'Pech gazini katalizatordan oldin qaysi apparatlar tozalaydi?',
    variantlar: [
      { matn: 'Faqat sovutgich', togri: false },
      { matn: 'Distillyator', togri: false },
      { matn: 'Yuttirish minorasi', togri: false },
      { matn: 'Siklon → Elektrofiltr → Quritish minorasi', togri: true },],
    izoh: 'Katalizator zaharlanmasligi uchun chang va namlik tozalanadi.',
  },
  {
    id: 't4',
    savol: '3 t 90% FeS dan n.sh.da necha m³ H₂S olinadi?',
    variantlar: [
      { matn: '224 m³', togri: false },
      { matn: '687,27 m³', togri: true },
      { matn: '1000 m³', togri: false },
      { matn: '336 m³', togri: false },],
    izoh: '2700 / 88 × 22,4 = 687,27 m³.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tuzilish', nom: 'Tuzilish & Tabiat', tavsif: 'N≡N, ns²np³, 78%, NaNO₃' },
    { id: 'olish_fiz', nom: 'Olish & Fizika', tavsif: 'CuO+NH₃, -196°C, 0,0154' },
    { id: 'kimyo', nom: 'Kimyo & Nitrid', tavsif: 'NO, NH₃, Li₃N, Mg₃N₂' },
  ],
  topshiriqlar: [
    { nom: 'N ≡ N uch karrali bog\'', qisqa: 'Odatda inert molekula', guruh: 'tuzilish', izoh: '3 ta umumiy elektron jufti.' },
    { nom: '78% hajm / 75,5% massa', qisqa: 'Havodagi N₂ ulushi', guruh: 'tuzilish', izoh: 'Atmosferaning 4/5 qismi.' },
    { nom: 'NaNO₃ (Chili selitrasi)', qisqa: 'Tabiiy kon va oqsillar', guruh: 'tuzilish', izoh: 'Janubiy Amerikada koni bor.' },
    { nom: '3CuO + 2NH₃ → 3Cu + N₂↑', qisqa: 'Lab olish usuli', guruh: 'olish_fiz', izoh: '+3H₂O bilan toza N₂ beradi.' },
    { nom: '-196°C N₂ vs -183°C O₂', qisqa: 'Suyuq havo haydash', guruh: 'olish_fiz', izoh: 'N₂ birinchi bug\'lanadi.' },
    { nom: 'Ts = -210°C • 0,0154 hajm', qisqa: 'Fizik konstanta', guruh: 'olish_fiz', izoh: 'Suvda juda oz eriydi.' },
    { nom: 'N₂ + O₂ ⇄(2000°C) 2NO−Q', qisqa: 'Chaqmoqda oksidlanish', guruh: 'kimyo', izoh: 'Endotermik reaksiya.' },
    { nom: 'N₂ + 3H₂ ⇄ 2NH₃ + Q', qisqa: 'Ammiak sintezi', guruh: 'kimyo', izoh: 'Fe katalizatori ishtirokida.' },
    { nom: '6Li+N₂=2Li₃N; 3Mg+N₂=Mg₃N₂', qisqa: 'Metall nitridlari', guruh: 'kimyo', izoh: 'Li xona t°, Mg qizdirganda.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Sanoat',
    savol: 'Suyuq havoda N₂ va O₂ qaynash harorati qancha?',
    variantlar: ['0°C va 100°C', '-183°C va -196°C', '-196°C (N₂) va -183°C (O₂)', '-210°C va -10°C'],
    togri: 2,
    izoh: 'N₂ (-196°C) avval uchadi, O₂ (-183°C) qoladi.',
  },
  {
    belgi: 'Nitrid',
    savol: 'Xona haroratida N₂ qaysi metall bilan birikadi?',
    variantlar: ['Litiy (Li₃N)', 'Magniy (Mg)', 'Temir (Fe)', 'Mis (Cu)'],
    togri: 0,
    izoh: 'Odatda faqat Li (6Li + N₂ = 2Li₃N).',
  },
  {
    belgi: 'Atmosfera',
    savol: 'Havoda N₂ ning hajm va massa ulushi qancha?',
    variantlar: ['21% va 23%', '50% va 50%', '99% va 98%', '78% hajm va 75,5% massa'],
    togri: 3,
    izoh: 'Hajm 78%, massa 75,5%.',
  },
  {
    belgi: 'Bog\'lanish',
    savol: 'N₂ nega odatda juda inert?',
    variantlar: ['Ion bog\'li', 'Uch karrali N≡N bog\'i kuchli', 'Vodorod bog\'i', 'Suvda eriydi'],
    togri: 1,
    izoh: 'N≡N bog\'ini uzishga katta energiya kerak.',
  },
  {
    belgi: 'Mineral',
    savol: 'Chili selitrasi formulasi qaysi?',
    variantlar: ['KNO₃', 'NaNO₃', 'NH₄Cl', 'Ca₃(PO₄)₂'],
    togri: 1,
    izoh: 'NaNO₃ — natriy nitrat.',
  },
  {
    belgi: 'Lab usul',
    savol: '3CuO + 2NH₃ = ? reaksiyasi mahsulotlari:',
    variantlar: ['3CuOH + N₂', 'Cu(NO₃)₂ + H₂', 'Cu₃N₂ + 3H₂O', '3Cu + 3H₂O + N₂↑'],
    togri: 3,
    izoh: 'Toza N₂, mis va suv hosil bo\'ladi.',
  },
  {
    belgi: 'Zichlik',
    savol: 'N₂ (Mr=28) uchun D_H₂ va D_havo nechaga teng?',
    variantlar: ['14 va 0,966', '7 va 0,5', '28 va 1,25', '17 va 1,17'],
    togri: 0,
    izoh: '28/2 = 14; 28/29 ≈ 0,966.',
  },
  {
    belgi: 'Eruvchanlik',
    savol: '1 hajm suvda necha hajm N₂ eriydi?',
    variantlar: ['700 hajm', '36 hajm', '0,0154 hajm', '2,5 hajm'],
    togri: 2,
    izoh: 'Suvda juda oz — 0,0154 hajm.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Suyuq havodan N₂ olish',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. Havoni chang, CO₂, namdan tozalash',
      '2. Sovutib va siqib suyuq havo olish',
      '3. -196°C da N₂ ni avval bug\'latish',
      '4. -183°C li suyuq O₂ ni ajratish',
    ],
    variantlar: [
      '3. -196°C da N₂ ni avval bug\'latish',
      '1. Havoni chang, CO₂, namdan tozalash',
      '4. -183°C li suyuq O₂ ni ajratish',
      '2. Sovutib va siqib suyuq havo olish',
    ],
  },
  {
    tur: 'Azot zanjiri',
    vazifa: 'OD o\'zgarishini tartiblang:',
    tartib: [
      '1. N₂ (N≡N, OD = 0)',
      '2. N₂ + 3H₂ ⇄ 2NH₃ (OD = -3)',
      '3. 3CuO + 2NH₃ → 3Cu + 3H₂O + N₂',
      '4. N₂ + O₂ ⇄(2000°C) 2NO (OD = +2)',
    ],
    variantlar: [
      '2. N₂ + 3H₂ ⇄ 2NH₃ (OD = -3)',
      '4. N₂ + O₂ ⇄(2000°C) 2NO (OD = +2)',
      '1. N₂ (N≡N, OD = 0)',
      '3. 3CuO + 2NH₃ → 3Cu + 3H₂O + N₂',
    ],
  },
  {
    tur: 'Ca(CN)₂ da w(N) hisobi',
    vazifa: 'Hisob tartibini tuzing:',
    tartib: [
      '1. Ar: Ca=40, C=12, N=14',
      '2. M = 40 + 2·(12+14) = 92 g/mol',
      '3. m(2N) = 28 g',
      '4. w(N) = 28/92 · 100% = 30,43%',
    ],
    variantlar: [
      '3. m(2N) = 28 g',
      '4. w(N) = 28/92 · 100% = 30,43%',
      '1. Ar: Ca=40, C=12, N=14',
      '2. M = 40 + 2·(12+14) = 92 g/mol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'VA guruh tashqi elektron formulasi?',
    variantlar: ['ns² np⁴', 'ns² np³', 'ns² np⁵', 'ns² np¹'],
    togri: 1,
    izoh: 'N, P, As, Sb, Bi — barchasi ns² np³.',
  },
  {
    savol: '3Mg + N₂ = ? qachon boradi va mahsulot nima?',
    variantlar: ['Xona t° da MgN', 'Bormaydi', 'Suvda Mg(NO₃)₂', 'Qizdirilganda Mg₃N₂'],
    togri: 3,
    izoh: 'Qizdirganda magniy nitrid Mg₃N₂ hosil bo\'ladi.',
  },
  {
    savol: 'N₂ + O₂ ⇄ 2NO − Q qaysi sharoitda boradi?',
    variantlar: ['2000°C elektr yoyda', '100°C suvda', '0°C da', '-196°C da'],
    togri: 0,
    izoh: 'Chaqmoq va 2000°C elektr yoyda boradi.',
  },
  {
    savol: 'Azotning Ts va Tq haroratlari:',
    variantlar: ['-10°C / -73°C', '-101°C / -34°C', '-210°C / -196°C', '0°C / 100°C'],
    togri: 2,
    izoh: 'Ts = -210°C, Tq = -196°C.',
  },
  {
    savol: '3CuO + 2NH₃ dan qaysi gaz chiqadi?',
    variantlar: ['O₂', 'NO₂', 'Toza N₂↑', 'H₂'],
    togri: 2,
    izoh: 'Laboratoriyada toza azot olinadi.',
  },
  {
    savol: 'VA guruh elementlari yuqoridan pastga:',
    variantlar: ['N, P, As, Sb, Bi', 'O, S, Se, Te, Po', 'F, Cl, Br, I, At', 'C, Si, Ge, Sn, Pb'],
    togri: 0,
    izoh: 'Azot guruhchasi: N, P, As, Sb, Bi.',
  },
  {
    savol: 'N₂ ning n.sh.dagi zichligi (g/l):',
    variantlar: ['28 g/l', '1,25 g/l', '22,4 g/l', '0,76 g/l'],
    togri: 1,
    izoh: 'ρ = 28 / 22,4 = 1,25 g/l.',
  },
  {
    savol: 'Haydashda N₂ nega O₂ dan oldin uchadi?',
    variantlar: ['Og\'irroq', 'Suvda eriydi', 'O₂ gaz emas', 'Tq(-196°C) < Tq(-183°C)'],
    togri: 3,
    izoh: 'Qaynash harorati past komponent avval uchadi.',
  },
];

export default function S8Mavzu36() {
  const korgazmalar = [
    { nom: '1. VA guruh & N≡N', ikon: 'atom', komponent: <KorgazmaVAGuruhVaN2 /> },
    { nom: '2. Tabiatda (78% & NaNO₃)', ikon: 'yadro', komponent: <KorgazmaAzotTabiatda /> },
    { nom: '3. Lab & Sanoat (-196°C)', ikon: 'kolba', komponent: <KorgazmaAzotOlinishi /> },
    { nom: '4. Fizika (-210°/-196°)', ikon: 'tomchi', komponent: <KorgazmaAzotFizik /> },
    { nom: '5. Reaksiya & Nitrid', ikon: 'uchqun', komponent: <KorgazmaAzotKimyoNitrid /> },
    { nom: '6. Zichlik & Ca(CN)₂', ikon: 'formula', komponent: <Korgazma36Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-36"
          nom="Azot xossalarini guruhlang"
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
          key="tezkor-36"
          nom="36-§: Azot"
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
          key="zanjir-36"
          nom="Suyuq havo & hisob zanjiri"
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
          key="duel-36"
          sarlavha="36-§: Azot dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="36-§"
      mavzuNom="Azot"
      oldingiRaqam="35-§"
      oldingiNom="Sanoatda H₂SO₄"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
