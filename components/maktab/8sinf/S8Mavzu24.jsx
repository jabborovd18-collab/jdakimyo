'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 24-PARAGRAF
// "Vodorod xlorid" (Darslik 100-103-betlar)
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
function KorgazmaHClTuzilish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. HCl tuzilishi va fizik xossasi (100-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'bog',
          tugma: 'H–Cl qutbli bog\'',
          formula: 'H⁺δ — Cl⁻δ • qutbli kovalent • Mr = 36,5',
          tur: 'molekula',
          cfg: {
            sarlavha: 'HCl: elektron juft Cl tomonga kuchli siljigan',
            tenglama: 'D_havo = 36,5 / 29 = 1,259   •   D_H2 = 36,5 / 2 = 18,25',
            rejim: 'bog',
            bogJuft: { chap: 'H⁺δ', chapRang: '#38bdf8', ong: 'Cl⁻δ', ongRang: '#34d399', siljish: 0.72 },
            metrikalar: [
              { nom: 'D_havo (havodan og\'ir)', qiymat: '1,259', foiz: 65, rang: '#34d399' },
              { nom: 'D_H2 (vodorodga nisb.)', qiymat: '18,25', foiz: 75, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Ko\'rinishi', v: 'Rangsiz, o\'tkir hidli gaz', rang: '#fde047' },
              { k: 'Nam havoda', v: 'Oq tuman (tutaydi)', rang: '#e2e8f0' },
            ],
          },
          pastki: ['Qutbli kovalent bog\' (H–Cl)', 'Mr = 36,5; havodan 1,259× og\'ir', 'Nam havoda tuman hosil qiladi'],
        },
        {
          id: 'mol',
          tugma: 'HCl molekulasi',
          formula: 'H—Cl • D_H2 = 18,25 • D_He = 9,125',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Vodorod xlorid (HCl) molekulasi aylanishi',
            tenglama: 'Mr(HCl) = 1 + 35,5 = 36,5   |   Qutbli molekula',
            markaz: { belgi: 'Cl', rang: '#34d399', r: 26 },
            atomlar: [{ belgi: 'H', rang: '#38bdf8', r: 15, masofa: 72, bog: 1, burchak: 0 }],
            metrikalar: [
              { nom: 'Molyar massa M', qiymat: '36,5 g/mol', foiz: 72, rang: '#38bdf8' },
              { nom: 'D_He (geliyga nisb.)', qiymat: '9,125', foiz: 55, rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Suvda erishi', v: 'Juda yaxshi (favvora)', rang: '#34d399' }],
          },
          pastki: ['M(HCl) = 36,5 g/mol', 'D_He = 36,5 / 4 = 9,125', 'O\'tkir bo\'g\'uvchi rangsiz gaz'],
        },
      ]}
    />
  );
}

function KorgazmaHClOlinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Olinishi: lab va sanoat (17–18-rasm, 101-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab',
          tugma: 'Lab (kuchsiz / kuchli t°)',
          formula: 'NaCl(q) + H₂SO₄(kons) → NaHSO₄ / Na₂SO₄ + HCl↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '17-rasm: qattiq NaCl + kons. H₂SO₄ dan HCl olish',
            tenglama: 'Kuchsiz t°: NaHSO₄ + HCl↑   |   Kuchli t°: Na₂SO₄ + 2HCl↑',
            ikkiIdish: true,
            qizdir: true,
            suyuqlikRang: '#fbbf24',
            stakanBelgi: 'NaCl+H₂SO₄',
            stakanSarlavha: '1-kolba (t°)',
            ikkinchiSuyuqlikRang: '#38bdf8',
            ikkinchiBelgi: 'HCl↑ yig\'ish',
            ikkinchiSarlavha: 'Quruq bank',
            reagentlar: [
              { belgi: 'Na⁺', rang: '#fbbf24' },
              { belgi: 'Cl⁻', rang: '#34d399' },
            ],
            gazRang: '#e2e8f0',
            gazBelgi: 'HCl↑',
            belgilar: [
              { k: 'Kuchsiz t°', v: 'NaCl + H₂SO₄ = NaHSO₄ + HCl↑', rang: '#38bdf8' },
              { k: 'Kuchli t°', v: '2NaCl + H₂SO₄ = Na₂SO₄ + 2HCl↑', rang: '#fde047' },
              { k: 'Shart', v: 'NaCl qattiq, H₂SO₄ kons.', rang: '#34d399' },
            ],
          },
          pastki: ['Qattiq NaCl + kons. H₂SO₄ ishlatiladi', 'Kuchsiz t° da nordon tuz NaHSO₄', 'Kuchli t° da o\'rta tuz Na₂SO₄'],
        },
        {
          id: 'sanoat',
          tugma: 'Sanoat (18-rasm) & Teskari',
          formula: 'H₂ + Cl₂ → 2HCl (gorelka) • MnO₂ + 4HCl → Cl₂↑',
          tur: 'sanoat',
          cfg: {
            sarlavha: '18-rasm: sanoat sintezi (H₂ + Cl₂) va HCl oksidlanishi',
            tenglama: 'H₂ + Cl₂ = 2HCl (alanga)   |   Teskari: MnO₂ + 4HCl = MnCl₂ + Cl₂↑ + 2H₂O',
            bosqichlar: [
              { nom: '1. Gorelka (18-rasm)', tur: 'pech', ichi: 'H₂ + Cl₂ alanga', mahsulot: 'HCl gazi', rang: '#f97316' },
              { nom: '2. Yutgich minora', tur: 'minora', ichi: 'HCl + H₂O', mahsulot: '37% xlorid kisl.', rang: '#38bdf8' },
              { nom: '3. Teskari (lab)', tur: 'kataliz', ichi: 'MnO₂ + 4HCl', mahsulot: 'MnCl₂ + Cl₂↑', rang: '#a3e635' },
            ],
            belgilar: [
              { k: 'Sintez', v: 'H₂ + Cl₂ = 2HCl + Q', rang: '#f97316' },
              { k: 'Teskari', v: 'MnO₂ + 4HCl → Cl₂↑', rang: '#a3e635' },
            ],
          },
          pastki: ['Sanoatda Cl₂ oqimida H₂ yoqiladi', 'Suvga yuttirib 37% HCl olinadi', 'MnO₂ bilan Cl₂ qayta olinadi'],
        },
      ]}
    />
  );
}

function KorgazmaHClFavvora() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Favvora tajribasi va eruvchanlik (19-rasm, 102-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'favvora',
          tugma: '0°C: ~500 hajm HCl/suv',
          formula: '1 hajm H₂O (0°C) da ~500 hajm HCl eriydi • lakmus → qizil',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '19-rasm: HCl ning suvda juda tez erishi (vakuum favvorasi)',
            tenglama: '1 hajm suvda ~500 hajm HCl eriydi   |   Bosim ↓ → suv kolbaga otiladi',
            suyuqlikRang: '#ef4444',
            tolish: 0.74,
            stakanBelgi: 'Qizil favvora',
            stakanSarlavha: 'Ko\'k lakmus → Qizil',
            reagentlar: [
              { belgi: 'H⁺', rang: '#fb7185' },
              { belgi: 'Cl⁻', rang: '#34d399' },
              { belgi: 'H⁺', rang: '#fde047' },
            ],
            gazRang: '#38bdf8',
            gazBelgi: 'Vakuum tortishi',
            belgilar: [
              { k: 'Eruvchanlik (0°C)', v: '1 V suvda ~500 V HCl', rang: '#38bdf8' },
              { k: 'Sababi', v: 'Kolbada keskin vakuum', rang: '#fde047' },
              { k: 'Indikator', v: 'Ko\'k lakmus → qizil rang', rang: '#ef4444' },
            ],
          },
          pastki: ['0°C da 1 hajm suv ~500 hajm HCl yutadi', 'Gaz tez erib kolbada vakuum yaratadi', 'Ko\'k lakmus eritmasi qizaradi'],
        },
        {
          id: 'kislota_ph',
          tugma: 'Suvda ionlanish (pH)',
          formula: 'HCl → H⁺ + Cl⁻ (100% dissotsiatsiya, kuchli kislota)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'HCl suvli eritmasida to\'liq H⁺ va Cl⁻ ionlariga ajraladi',
            tenglama: 'HCl (suv) → H⁺ + Cl⁻   |   pH < 2 (kuchli kislota muhiti)',
            turi: 'ph',
            ph: 1,
            belgilar: [
              { k: 'Dissotsiatsiya', v: 'H⁺ + Cl⁻ (to\'liq)', rang: '#fb7185' },
              { k: 'Kons. eritma', v: '37%, ρ = 1,19 g/cm³', rang: '#fde047' },
              { k: 'Kislota kuchi', v: 'Kuchli 1-negizli kislota', rang: '#34d399' },
            ],
          },
          pastki: ['Suvda H⁺ va Cl⁻ ionlariga to\'liq ajraladi', 'Kons. HCl ≈ 37%, ρ = 1,19 g/cm³', 'pH keskin kislotali (pH ≈ 1)'],
        },
      ]}
    />
  );
}

function KorgazmaQuruqVaSuvliHCl() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Quruq HCl gazi vs Suvli eritma (102-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'quruq',
          tugma: 'Quruq HCl (H⁺ yo\'q)',
          formula: 'Quruq HCl: H⁺ ioni yo\'q → Fe, Zn, oksidlar bilan BORMAYDI',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Quruq HCl gazi: kovalent molekula, kislota xossasi yo\'q!',
            tenglama: 'Ionlar yo\'q → Fe, Zn, asosli oksidlar va lakmusga ta\'sir etmaydi',
            markaz: { belgi: 'Cl', rang: '#94a3b8', r: 24 },
            atomlar: [{ belgi: 'H', rang: '#cbd5e1', r: 14, masofa: 68, bog: 1 }],
            metrikalar: [
              { nom: 'Erkin H⁺ ionlari', qiymat: '0% (molekula)', foiz: 6, rang: '#94a3b8' },
              { nom: 'Fe / Zn / oksid bilan', qiymat: 'Reaksiya yo\'q', foiz: 8, rang: '#f43f5e' },
            ],
            belgilar: [{ k: 'Xulosa', v: 'Suvsiz kislota xossasi chiqmaydi', rang: '#fde047' }],
          },
          pastki: ['Quruq HCl da erkin H⁺ ioni yo\'q', 'Fe, Zn va asosli oksidlar bilan bormaydi', 'Quruq lakmus qog\'ozni o\'zgartirmaydi'],
        },
        {
          id: 'suvli',
          tugma: 'Suvli eritma (H⁺ + Cl⁻)',
          formula: 'HCl + H₂O → H₃O⁺ + Cl⁻ → barcha kislota reaksiyalari!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Suvli HCl eritmasi: faol H⁺ ionlari metallar va oksidlarni eritadi',
            tenglama: 'HCl → H⁺ + Cl⁻   |   Zn + 2H⁺ = Zn²⁺ + H₂↑',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'HCl(er)',
            stakanSarlavha: 'Faol H⁺ + Cl⁻',
            reagentlar: [
              { belgi: 'H⁺', rang: '#fb7185' },
              { belgi: 'Cl⁻', rang: '#34d399' },
              { belgi: 'Zn²⁺', rang: '#38bdf8' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂↑',
            belgilar: [
              { k: 'Faol ion', v: 'H⁺ (oksoniy H₃O⁺)', rang: '#fb7185' },
              { k: 'Metallar', v: 'Zn, Fe, Mg bilan H₂↑', rang: '#34d399' },
            ],
          },
          pastki: ['Suv ta\'sirida H⁺ + Cl⁻ ga ajraladi', 'Metallar, oksidlar, asoslar bilan kirishadi', 'Kuchli kislota xossasi suvda namoyon'],
        },
      ]}
    />
  );
}

function KorgazmaHClKimyoviyXossa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Kislota reaksiyalari va Cl⁻ sifat testi"
      ikon="kolba"
      variantlar={[
        {
          id: 'metall',
          tugma: 'Fe+2HCl vs Cu & Cl₂',
          formula: 'Fe + 2HCl = FeCl₂ + H₂↑ (Cl₂ bilan FeCl₃!) • Cu bormaydi',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Temir HCl da FeCl₂ (+2), Cl₂ da esa FeCl₃ (+3) beradi!',
            tenglama: 'Fe + 2HCl = Fe⁺²Cl₂ + H₂↑   |   2Fe + 3Cl₂ = 2Fe⁺³Cl₃   |   Cu + HCl ≠',
            suyuqlikRang: '#34d399',
            stakanBelgi: 'FeCl₂ (yashil)',
            stakanSarlavha: 'Fe + 2HCl',
            reagentlar: [
              { belgi: 'Fe²⁺', rang: '#34d399' },
              { belgi: 'Cl⁻', rang: '#38bdf8' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂↑',
            belgilar: [
              { k: 'Fe + HCl', v: 'FeCl₂ (+2, och yashil)', rang: '#34d399' },
              { k: 'Fe + Cl₂', v: 'FeCl₃ (+3, qo\'ng\'ir)', rang: '#f97316' },
              { k: 'Mis (Cu)', v: 'H dan keyin → bormaydi!', rang: '#f43f5e' },
            ],
          },
          pastki: ['Fe + 2HCl → FeCl₂ + H₂↑ (Fe⁺²!)', 'Cl₂ bilan esa FeCl₃ (+3) hosil bo\'ladi', 'Cu vodoroddan keyin — HCl da erimaydi'],
        },
        {
          id: 'zang_agcl',
          tugma: 'Zang tozalash & AgCl↓',
          formula: 'Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O • HCl + AgNO₃ = AgCl↓ + HNO₃',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Zangni tozalash va kumush nitrat bilan oq AgCl↓ cho\'kma',
            tenglama: 'Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O   |   Ag⁺ + Cl⁻ = AgCl↓ (oq)',
            suyuqlikRang: '#fbbf24',
            stakanBelgi: 'AgNO₃ + HCl',
            stakanSarlavha: 'Sifat reaksiyasi',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'AgCl↓ (oq)',
            reagentlar: [
              { belgi: 'Ag⁺', rang: '#e2e8f0' },
              { belgi: 'Cl⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Zang tozalash', v: 'Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O', rang: '#f97316' },
              { k: 'Sifat testi', v: 'HCl + AgNO₃ = AgCl↓ + HNO₃', rang: '#f8fafc' },
              { k: 'AgCl↓', v: 'Oq pag\'a, HNO₃ da erimaydi', rang: '#38bdf8' },
            ],
          },
          pastki: ['Temir zangi Fe₂O₃ ni HCl eritib tozalaydi', 'AgNO₃ bilan oq AgCl↓ cho\'kma beradi', 'AgCl↓ nitrat kislotada erimaydi'],
        },
      ]}
    />
  );
}

function Korgazma24Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Darslik masalalari (102–103-betlar)"
      ikon="formula"
      variantlar={[
        {
          id: 'm_nacl',
          tugma: '2,22 g NaCl & 56 m³ Cl₂',
          formula: '2,22 g NaCl → 0,85 l HCl • 56 m³ Cl₂ → 292,5 kg NaCl',
          tur: 'hisob',
          cfg: {
            sarlavha: '102–103-bet masalalari: HCl hajmi va NaCl massasi',
            tenglama: '1) 2,22/58,5 = 0,0379 mol → 0,85 l HCl   |   2) 56/22,4 = 2,5 kmol Cl₂ → 5 kmol NaCl',
            qadamlar: [
              { belgi: '1-m: n(NaCl) = 2,22/58,5', natija: '0,0379 mol', izoh: 'V = 0,0379·22,4', rang: '#38bdf8' },
              { belgi: 'V(HCl) natija', natija: '0,85 litr HCl', izoh: '1 : 1 nisbat', rang: '#34d399' },
              { belgi: '2-m: 56 m³ Cl₂ → NaCl', natija: '292,5 kg NaCl', izoh: '5 kmol · 58,5', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: '2,22 g NaCl → HCl', foiz: 55, qiymat: '0,85 litr HCl', rang: '#38bdf8' },
              { nom: '56 m³ Cl₂ → NaCl', foiz: 100, qiymat: '292,5 kg NaCl', rang: '#fbbf24' },
            ],
            javobBadge: 'Javoblar: 0,85 litr HCl;  292,5 kg NaCl',
          },
          pastki: ['2,22 g NaCl (0,0379 mol) → 0,85 l HCl', '56 m³ Cl₂ = 2,5 kmol → 5 kmol NaCl', '5 × 58,5 = 292,5 kg NaCl kerak'],
        },
        {
          id: 'm_eritma',
          tugma: '100 ml suv + 5,6 l HCl',
          formula: '5,6 l HCl = 0,25 mol = 9,125 g → ω = 9,125 / 109,125 = 8,36%',
          tur: 'hisob',
          cfg: {
            sarlavha: '103-bet masalasi: HCl eritmasining massa ulushini topish',
            tenglama: 'm(eritma) = 100 + 9,125 = 109,125 g   →   ω(HCl) = 9,125 / 109,125 = 8,36%',
            qadamlar: [
              { belgi: 'n(HCl) = 5,6 / 22,4', natija: '0,25 mol HCl', izoh: 'n.sh. da', rang: '#38bdf8' },
              { belgi: 'm(HCl) = 0,25 · 36,5', natija: '9,125 g HCl', izoh: 'M(HCl) = 36,5', rang: '#fde047' },
              { belgi: 'ω = 9,125 / 109,125', natija: '8,36% HCl', izoh: 'm(er)=100+9,125', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Suv (100 ml)', foiz: 91.6, qiymat: '100 g (91,64%)', rang: '#38bdf8' },
              { nom: 'HCl (0,25 mol)', foiz: 8.4, qiymat: '9,125 g (8,36%)', rang: '#34d399' },
            ],
            javobBadge: 'Javob: ω(HCl) = 8,36% (109,125 g eritmada 9,125 g HCl)',
          },
          pastki: ['5,6 l HCl = 0,25 mol; m = 0,25·36,5 = 9,125 g', 'Eritma massasi = 100 + 9,125 = 109,125 g', 'ω = 9,125 / 109,125 = 8,36%'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (23-§) VA O'YINLAR (24-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Qaynoq KOH (>50°C) dan Cl₂ o\'tkazilsa KCl bilan birga nima hosil bo\'ladi?',
    variantlar: [
      { matn: 'KClO₄', togri: false },
      { matn: 'Faqat KClO', togri: false },
      { matn: 'KClO₃ + 5KCl + 3H₂O (Bertole tuzi)', togri: true },
      { matn: 'HCl gazi', togri: false },],
    izoh: '3Cl₂ + 6KOH(>50°C) → KClO₃ + 5KCl + 3H₂O.',
  },
  {
    id: 't2',
    savol: 'Karnallit va Silvinit minerallarining formulalari:',
    variantlar: [
      { matn: 'KCl·MgCl₂·6H₂O va KCl·NaCl', togri: true },
      { matn: 'CaF₂ va NaCl', togri: false },
      { matn: 'KCl va MgSO₄', togri: false },
      { matn: 'FeS₂ va ZnS', togri: false },],
    izoh: '96-bet 23-§: Karnallit va Silvinit xlorli minerallar.',
  },
  {
    id: 't3',
    savol: 'Xlorli suvda (20°C) erigan xlornng massa ulushi:',
    variantlar: [
      { matn: '37%', togri: false },
      { matn: '10%', togri: false },
      { matn: '50%', togri: false },
      { matn: '0,63% (6,34 / 1006,34)', togri: true },],
    izoh: '97-bet hisobi: 6,34 g Cl₂ / 1006,34 g = 0,63%.',
  },
  {
    id: 't4',
    savol: '3,36 l xlor (0,15 mol) qancha temir bilan reaksiyaga kirishib FeCl₃ beradi?',
    variantlar: [
      { matn: '11,2 g Fe', togri: false },
      { matn: '5,6 g Fe (0,1 mol)', togri: true },
      { matn: '16,8 g Fe', togri: false },
      { matn: '2,8 g Fe', togri: false },],
    izoh: '2Fe + 3Cl₂ = 2FeCl₃ → 0,15 · 2/3 = 0,1 mol Fe = 5,6 g.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tuzilish_olish', nom: 'Tuzilish & Olish', tavsif: 'Mr=36,5, 17–18-rasmlar' },
    { id: 'reaksiya', nom: 'Xossa & Reaksiya', tavsif: 'Quruq vs suvli, FeCl₂, AgCl↓' },
    { id: 'masala', nom: 'Favvora & Masalalar', tavsif: '500 hajm, 8,36%, 292,5 kg' },
  ],
  topshiriqlar: [
    { nom: 'H–Cl qutbli kovalent (Mr = 36,5)', qisqa: 'D_havo=1,259; D_H2=18,25', guruh: 'tuzilish_olish', izoh: 'Nam havoda tutovchi gaz.' },
    { nom: 'NaCl(q) + H₂SO₄(kons) → NaHSO₄ + HCl↑', qisqa: 'Lab usuli (kuchsiz t°)', guruh: 'tuzilish_olish', izoh: 'Kuchli t° da Na₂SO₄ + 2HCl↑.' },
    { nom: 'H₂ + Cl₂ → 2HCl; MnO₂ + 4HCl → Cl₂↑', qisqa: '18-rasm sanoat & teskari', guruh: 'tuzilish_olish', izoh: '101-bet olish va oksidlanish.' },
    { nom: 'Quruq HCl da H⁺ yo\'q → Fe/Zn bormaydi', qisqa: 'Suvli: H⁺ + Cl⁻ faol', guruh: 'reaksiya', izoh: 'Kislota xossasi suvda chiqadi.' },
    { nom: 'Fe + 2HCl = FeCl₂ + H₂↑ (Cu bormaydi)', qisqa: 'Cl₂ bilan esa FeCl₃!', guruh: 'reaksiya', izoh: '102-bet muhim farq.' },
    { nom: 'Fe₂O₃ + 6HCl; HCl + AgNO₃ = AgCl↓', qisqa: 'Zang tozalash & oq cho\'kma', guruh: 'reaksiya', izoh: 'AgCl↓ HNO₃ da erimaydi.' },
    { nom: '0°C 1 V suvda ~500 V HCl (favvora)', qisqa: '19-rasm: lakmus → qizil', guruh: 'masala', izoh: 'Vakuum tufayli favvora otiladi.' },
    { nom: '2,22 g NaCl → 0,85 l HCl; 56 m³ → 292,5 kg', qisqa: '102–103-bet masalalari', guruh: 'masala', izoh: '0,0379 mol va 5 kmol NaCl.' },
    { nom: '100 ml suv + 5,6 l HCl → ω = 8,36%', qisqa: '9,125 / 109,125 = 8,36%', guruh: 'masala', izoh: '5,6 l = 0,25 mol = 9,125 g.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Favvora',
    savol: '0°C da 1 hajm suvda necha hajm HCl gazi eriydi?',
    variantlar: ['22,4 hajm', '2 hajm', '~500 hajm', '100 hajm'],
    togri: 2,
    izoh: '102-bet 19-rasm: ~500 hajm HCl erib vakuum hosil qiladi.',
  },
  {
    belgi: 'Kuchli qizdirish',
    savol: '2NaCl + H₂SO₄(kons) kuchli qizdirilganda qaysi tuz hosil bo\'ladi?',
    variantlar: ['Na₂SO₄ + 2HCl↑', 'NaHSO₄', 'Na₂SO₃', 'NaClO'],
    togri: 0,
    izoh: 'Kuchsiz qizdirishda NaHSO₄, kuchlida Na₂SO₄.',
  },
  {
    belgi: 'Quruq HCl',
    savol: 'Nima uchun quruq HCl gazi rux va temir bilan reaksiyaga kirishmaydi?',
    variantlar: ['Zichligi kichik', 'Qutbsiz molekula', 'Kislorod ko\'p', 'Erkin H⁺ ionlari yo\'q'],
    togri: 3,
    izoh: 'Kislota xossasi faqat suvda H⁺ ioniga ajralganda chiqadi.',
  },
  {
    belgi: 'Fe + HCl',
    savol: 'Temir xlorid kislotada eriganda qaysi temir xloridi hosil bo\'ladi?',
    variantlar: ['FeCl₃', 'FeCl₂ + H₂↑', 'Reaksiya bormaydi', 'Fe(ClO)₂'],
    togri: 1,
    izoh: 'H⁺ kuchsizroq oksidlovchi — temirni +2 gacha oksidlaydi.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'HCl + AgNO₃ reaksiyasida tushadigan cho\'kma va rangi:',
    variantlar: ['Ag₂O↓ — qora', 'AgCl↓ — oq pag\'asimon cho\'kma', 'S↓ — sariq', 'AgClO — yashil'],
    togri: 1,
    izoh: 'AgCl↓ HNO₃ da erimaydi (Cl⁻ sifat reaksiyasi).',
  },
  {
    belgi: 'Zichlik',
    savol: 'HCl (Mr = 36,5) ning havo va H₂ ga nisbatan zichligi:',
    variantlar: ['0,5 va 36,5', '1,0 va 10', '2,45 va 35,5', '1,259 (havo) va 18,25 (H₂)'],
    togri: 3,
    izoh: '36,5 / 29 = 1,259; 36,5 / 2 = 18,25.',
  },
  {
    belgi: '103-bet',
    savol: '100 ml suvda 5,6 l HCl (0,25 mol) eritilsa massa ulush ω(HCl):',
    variantlar: ['8,36% (9,125 / 109,125)', '37%', '5,6%', '18,25%'],
    togri: 0,
    izoh: 'm(HCl) = 9,125 g; m(er) = 109,125 g → 8,36%.',
  },
  {
    belgi: 'Masala',
    savol: '56 m³ Cl₂ dan HCl olish uchun necha kg NaCl kerak?',
    variantlar: ['58,5 kg', '117 kg', '292,5 kg (5 kmol NaCl)', '146,25 kg'],
    togri: 2,
    izoh: '2,5 kmol Cl₂ → 5 kmol HCl → 5 kmol NaCl = 292,5 kg.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Labda HCl olish va favvora',
    vazifa: '17-rasmdan 19-rasmgacha tajriba bosqichlarini tartiblang:',
    tartib: [
      '1. NaCl(q) + H₂SO₄(kons) → NaHSO₄ + HCl↑',
      '2. Quruq HCl gazi havodan 1,259× og\'ir yig\'iladi',
      '3. 0°C suvda ~500 hajm erib vakuum yaratadi',
      '4. Ko\'k lakmus qizil favvora beradi',
    ],
    variantlar: [
      '3. 0°C suvda ~500 hajm erib vakuum yaratadi',
      '1. NaCl(q) + H₂SO₄(kons) → NaHSO₄ + HCl↑',
      '4. Ko\'k lakmus qizil favvora beradi',
      '2. Quruq HCl gazi havodan 1,259× og\'ir yig\'iladi',
    ],
  },
  {
    tur: '103-bet: 100 ml suv + 5,6 l HCl → ω',
    vazifa: 'Massa ulushini hisoblash tartibini tuzing:',
    tartib: [
      '1. n(HCl) = 5,6 / 22,4 = 0,25 mol',
      '2. m(HCl) = 0,25 · 36,5 = 9,125 g',
      '3. m(eritma) = 100 + 9,125 = 109,125 g',
      '4. ω(HCl) = 9,125 / 109,125 = 8,36%',
    ],
    variantlar: [
      '2. m(HCl) = 0,25 · 36,5 = 9,125 g',
      '4. ω(HCl) = 9,125 / 109,125 = 8,36%',
      '1. n(HCl) = 5,6 / 22,4 = 0,25 mol',
      '3. m(eritma) = 100 + 9,125 = 109,125 g',
    ],
  },
  {
    tur: 'Kislotali xossalar zanjiri',
    vazifa: 'Quruq gazdan oq cho\'kma hosil bo\'lishigacha tartiblang:',
    tartib: [
      '1. Quruq HCl: H⁺ yo\'q, Fe bilan bormaydi',
      '2. HCl + H₂O → H⁺ + Cl⁻ (ionlanish)',
      '3. Fe + 2HCl = FeCl₂ + H₂↑',
      '4. HCl + AgNO₃ = AgCl↓ + HNO₃ (oq)',
    ],
    variantlar: [
      '3. Fe + 2HCl = FeCl₂ + H₂↑',
      '1. Quruq HCl: H⁺ yo\'q, Fe bilan bormaydi',
      '4. HCl + AgNO₃ = AgCl↓ + HNO₃ (oq)',
      '2. HCl + H₂O → H⁺ + Cl⁻ (ionlanish)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'HCl molekulasidagi kimyoviy bog\' turi:',
    variantlar: ['Qutbsiz kovalent', 'Qutbli kovalent (H–Cl)', 'Ion bog\'', 'Metall bog\''],
    togri: 1,
    izoh: 'Cl elektron juftni kuchli tortadi.',
  },
  {
    savol: 'Qattiq NaCl + kons. H₂SO₄ dan kuchli qizdirib olinadigan tuz:',
    variantlar: ['NaHSO₄', 'Na₂S', 'NaClO₃', 'Na₂SO₄'],
    togri: 3,
    izoh: '2NaCl + H₂SO₄ → Na₂SO₄ + 2HCl↑.',
  },
  {
    savol: 'Qaysi modda HCl eritmasi bilan reaksiyaga KIRISHMAYDI?',
    variantlar: ['Cu (mis)', 'Fe₂O₃', 'Fe', 'AgNO₃'],
    togri: 0,
    izoh: 'Mis aktivlik qatorida vodoroddan keyin turadi.',
  },
  {
    savol: '18-rasm sanoat usulida HCl qanday olinadi?',
    variantlar: ['AgCl ni qizdirib', 'NaCl ni eritib', 'H₂ + Cl₂ = 2HCl (gorelkada yoqib)', 'MnO₂ + HCl'],
    togri: 2,
    izoh: 'Xlor oqimida vodorod yoqib sintez qilinadi.',
  },
  {
    savol: 'Zangni (Fe₂O₃) tozalashda HCl bilan hosil bo\'ladigan tuz:',
    variantlar: ['FeSO₄', 'FeCl₂', 'FeCl₃ + H₂O', 'Reaksiya bormaydi'],
    togri: 2,
    izoh: 'Fe₂O₃ + 6HCl = 2FeCl₃ + 3H₂O.',
  },
  {
    savol: 'Teskari reaksiya: MnO₂ + 4HCl → MnCl₂ + 2H₂O + ...:',
    variantlar: ['Cl₂↑', 'H₂↑', 'O₂↑', 'SO₂↑'],
    togri: 0,
    izoh: '101-bet: labda xlor olish usuli.',
  },
  {
    savol: '2,22 g NaCl dan nazariy olinadigan HCl hajmi (n.sh.):',
    variantlar: ['2,24 l', '0,85 litr (0,0379 mol)', '5,6 l', '22,4 l'],
    togri: 1,
    izoh: '2,22 / 58,5 = 0,0379 mol · 22,4 = 0,85 l.',
  },
  {
    savol: '19-rasm favvora tajribasida qanday indikator ishlatiladi?',
    variantlar: ['Fenolftalein → ko\'k', 'Metil → sariq', 'Yod → qora', 'Ko\'k lakmus → qizil favvora'],
    togri: 3,
    izoh: 'H⁺ ionlari lakmusni qizartiradi.',
  },
];

export default function S8Mavzu24() {
  const korgazmalar = [
    { nom: '1. Tuzilish & Mr=36,5', ikon: 'atom', komponent: <KorgazmaHClTuzilish /> },
    { nom: '2. Olish (17–18-rasm)', ikon: 'kolba', komponent: <KorgazmaHClOlinishi /> },
    { nom: '3. Favvora (500 V)', ikon: 'tomchi', komponent: <KorgazmaHClFavvora /> },
    { nom: '4. Quruq vs Suvli', ikon: 'uchqun', komponent: <KorgazmaQuruqVaSuvliHCl /> },
    { nom: '5. FeCl₂, Zang, AgCl↓', ikon: 'kolba', komponent: <KorgazmaHClKimyoviyXossa /> },
    { nom: '6. 102–103-bet masala', ikon: 'formula', komponent: <Korgazma24Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-24"
          nom="HCl xossalarini guruhlang"
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
          key="tezkor-24"
          nom="24-§: Vodorod xlorid"
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
          key="zanjir-24"
          nom="HCl olish va masalalar"
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
          key="duel-24"
          sarlavha="24-§: Vodorod xlorid dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="24-§"
      mavzuNom="Vodorod xlorid"
      oldingiRaqam="23-§"
      oldingiNom="Xlor"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
