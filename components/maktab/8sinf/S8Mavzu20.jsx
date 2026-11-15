'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 20-PARAGRAF
// "Oksidlanish-qaytarilish reaksiyalari tenglamalarini tuzish" (83-88-betlar)
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
function KorgazmaBalansQadamlari() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Elektron-balans usulining 4 ta oltin qadami"
      ikon="formula"
      variantlar={[
        {
          id: 'algoritm',
          tugma: '4 bosqichli balans',
          formula: '∑ ē (berilgan) = ∑ ē (olingan)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'OQR tenglamasini elektron-balans bilan tenglash algoritmi',
            tenglama: 'OD belgilash → Yarim reaksiya (-ē / +ē) → Ko\'paytuvchi (EKUK) → Suvni tenglash',
            qadamlar: [
              { belgi: '1. OD qo\'yish', natija: 'O\'zgargan elementlar', izoh: 'Chap va o\'ng tomon', rang: '#38bdf8' },
              { belgi: '2. Yarim reaksiya', natija: '-ē (qayt.) / +ē (oks.)', izoh: 'Atomlar soni teng', rang: '#fbbf24' },
              { belgi: '3–4. EKUK & H₂O', natija: 'Koeffitsiyent & O', izoh: 'Kislorod bilan tekshirish', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Berilgan ē', foiz: 100, qiymat: 'n ta ē (qaytaruvchi)', rang: '#fbbf24' },
              { nom: 'Olingan ē', foiz: 100, qiymat: 'n ta ē (oksidlovchi)', rang: '#34d399' },
            ],
            javobBadge: 'Asosiy shart: ∑ ē(berilgan) = ∑ ē(olingan)',
          },
          pastki: ['Avval o\'zgargan element OD sini yozing', 'Berilgan va olingan ē soni tenglanadi', 'Oxirida H va O atomlari tekshiriladi'],
        },
        {
          id: 'al_hcl',
          tugma: '1-misol: 2Al + 6HCl',
          formula: '2Al⁰ + 6H⁺¹Cl → 2Al⁺³Cl₃ + 3H₂⁰↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '2 · | Al⁰ - 3ē → Al⁺³ |   va   3 · | 2H⁺¹ + 2ē → H₂⁰ |',
            tenglama: '2Al + 6HCl = 2AlCl₃ + 3H₂↑  (umumiy 6 ta elektron almashinadi)',
            suyuqlikRang: '#e2e8f0',
            tolish: 0.72,
            stakanBelgi: 'AlCl₃ (aq)',
            stakanSarlavha: '2Al + 6HCl',
            gazRang: '#bae6fd',
            gazBelgi: '3H₂↑',
            reagentlar: [{ belgi: 'Al', rang: '#cbd5e1' }],
            elektronJuft: { chap: 'Al⁰', ong: '2H⁺¹', e: '6ē' },
            belgilar: [{ k: 'EKUK(3, 2)', v: '6 → Al: 2, H₂: 3', rang: '#34d399' }],
          },
          pastki: ['Al⁰ → Al⁺³ (-3ē) — qaytaruvchi', '2H⁺¹ → H₂⁰ (+2ē) — oksidlovchi', 'Koeffitsiyentlar: 2, 6, 2, 3'],
        },
      ]}
    />
  );
}

function KorgazmaNitratOQR() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Metall + HNO₃ tenglamalari (84 va 87-betlar)"
      ikon="kolba"
      variantlar={[
        {
          id: 'al_n2o',
          tugma: 'Al + HNO₃(suyul.)',
          formula: '8Al + 30HNO₃ = 8Al(NO₃)₃ + 3N₂O↑ + 15H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '84-bet 2-misol: Suyultirilgan HNO₃ dan N₂O↑ chiqishi',
            tenglama: '8 | Al⁰-3ē→Al⁺³   va   3 | 2N⁺⁵+8ē→2N⁺¹   (24 + 6 = 30 HNO₃!)',
            suyuqlikRang: '#dbeafe',
            tolish: 0.75,
            stakanBelgi: '8Al(NO₃)₃',
            stakanSarlavha: 'Tuzda 24 ta N + gazda 6 ta N',
            gazRang: '#bae6fd',
            gazBelgi: '3N₂O↑',
            reagentlar: [{ belgi: '8Al', rang: '#cbd5e1' }],
            elektronJuft: { chap: 'Al⁰', ong: 'N⁺⁵', e: '24ē' },
            belgilar: [{ k: 'HNO₃ roli', v: '6 ta oksidlovchi, 24 ta muhit', rang: '#fbbf24' }],
          },
          pastki: ['Al(NO₃)₃ da 8·3=24 ta N, 3N₂O da 6 ta N', 'Jami 24+6 = 30 ta HNO₃ sarflanadi', '30 ta H dan 15H₂O hosil bo\'ladi'],
        },
        {
          id: 'zn_no2',
          tugma: 'Zn + HNO₃(kons.)',
          formula: 'Zn + 4HNO₃ = Zn(NO₃)₂ + 2NO₂↑ + 2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '87–88-bet 3-misol: Konsentrlangan HNO₃ dan qo\'ng\'ir NO₂↑',
            tenglama: '1 | Zn⁰-2ē→Zn⁺²   va   2 | N⁺⁵+1ē→N⁺⁴   (tuz 2N + gaz 2N = 4HNO₃)',
            suyuqlikRang: '#cbd5e1',
            tolish: 0.72,
            stakanBelgi: 'Zn(NO₃)₂',
            stakanSarlavha: 'Zn + 4HNO₃(kons.)',
            gazRang: '#b45309',
            gazBelgi: '2NO₂↑',
            reagentlar: [{ belgi: 'Zn', rang: '#94a3b8' }],
            elektronJuft: { chap: 'Zn⁰', ong: 'N⁺⁵', e: '2ē' },
            belgilar: [{ k: 'Suv', v: '4H → 2H₂O', rang: '#38bdf8' }],
          },
          pastki: ['Zn⁰ → Zn⁺² (-2ē); N⁺⁵ → N⁺⁴ (+1ē)', '1 mol Zn 2 ta N⁺⁵ ni qaytaradi', 'Jami 4HNO₃ → 2NO₂↑ + 2H₂O'],
        },
      ]}
    />
  );
}

function KorgazmaPermanganatParchalanish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Ichki OQR: KMnO₄ parchalanishi (84–85-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kmno4',
          tugma: '2KMnO₄ → O₂↑',
          formula: '2KMnO₄ = K₂MnO₄ + MnO₂ + O₂↑ (∑ koef. = 5)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '84–85-bet 3-misol: Ichki OQR (Mn⁺⁷ → +6 va +4; O⁻² → O⁰)',
            tenglama: 'Mn⁺⁷+1ē→Mn⁺⁶ va Mn⁺⁷+3ē→Mn⁺⁴ (jami +4ē)  |  2O⁻²-4ē→O₂⁰',
            suyuqlikRang: '#7e22ce',
            tolish: 0.52,
            stakanBelgi: 'K₂MnO₄ + MnO₂',
            stakanSarlavha: 'Qizdirilmoqda',
            gazRang: '#38bdf8',
            gazBelgi: 'O₂↑',
            chokmaRang: '#334155',
            chokmaBelgi: 'MnO₂',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 240,
            maxTemp: 350,
            elektronJuft: { chap: '2O⁻²', ong: '2Mn⁺⁷', e: '4ē' },
            belgilar: [{ k: '∑ koef.', v: '2+1+1+1 = 5', rang: '#fde047' }],
          },
          pastki: ['Bitta Mn⁺⁷ → +6; ikkinchisi → +4 (+4ē)', '2 ta O⁻² → O₂⁰ (-4ē)', 'Koeffitsiyentlar yig\'indisi: 2+1+1+1 = 5'],
        },
        {
          id: 'yigindi',
          tugma: 'Koeffitsiyentlar (5)',
          formula: '2(KMnO₄) + 1(K₂MnO₄) + 1(MnO₂) + 1(O₂) = 5',
          tur: 'hisob',
          cfg: {
            sarlavha: '2KMnO₄ = K₂MnO₄ + MnO₂ + O₂↑ koeffitsiyentlar yig\'indisi',
            tenglama: 'Chapda 2, o\'ngda 1 + 1 + 1 = 3  →  Jami = 5',
            qadamlar: [
              { belgi: 'KMnO₄ (chap)', natija: '2', izoh: '2 mol KMnO₄', rang: '#a855f7' },
              { belgi: 'K₂MnO₄ + MnO₂', natija: '1 + 1 = 2', izoh: 'Qattiq qoldiq', rang: '#38bdf8' },
              { belgi: 'O₂ (o\'ng gaz)', natija: '1 (jami = 5)', izoh: '2+1+1+1 = 5', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'KMnO₄', foiz: 100, qiymat: '2', rang: '#a855f7' },
              { nom: 'K₂MnO₄ / MnO₂ / O₂', foiz: 50, qiymat: '1 + 1 + 1', rang: '#34d399' },
            ],
            javobBadge: 'Koeffitsiyentlar yig\'indisi = 5',
          },
          pastki: ['2 mol KMnO₄ → 1 mol O₂ gaz', 'K₂MnO₄ (yashil) + MnO₂ (qo\'ng\'ir)', 'Barcha koeffitsiyentlar yig\'indisi = 5'],
        },
      ]}
    />
  );
}

function KorgazmaPeroksidDisprop() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Disproporsiyalanish: H₂O₂ va Cl₂ (85-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'h2o2',
          tugma: '2H₂O₂ → 2H₂O + O₂↑',
          formula: 'O⁻¹ ham oksidlovchi (O⁻²), ham qaytaruvchi (O⁰)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '85-bet 4-misol: Vodorod peroksidning o\'z-o\'zidan OQR i',
            tenglama: 'O⁻¹+1ē → O⁻² (H₂O)   va   2O⁻¹-2ē → O₂⁰   (MnO₂ katalizator)',
            suyuqlikRang: '#e0f2fe',
            tolish: 0.72,
            stakanBelgi: '2H₂O₂ → 2H₂O',
            stakanSarlavha: 'O⁻¹ → O⁻² va O⁰',
            gazRang: '#38bdf8',
            gazBelgi: 'O₂↑',
            elektronJuft: { chap: 'O⁻¹', ong: 'O⁻¹', e: '2ē' },
            belgilar: [{ k: 'Turi', v: 'Disproporsiyalanish', rang: '#fbbf24' }],
          },
          pastki: ['H₂O₂ da kislorod OD = -1', 'O⁻¹ ning yarmi -2 ga, yarmi 0 ga o\'tadi', 'MnO₂ jarayonni tezlashtiradi'],
        },
        {
          id: 'disprop_cl2',
          tugma: 'Cl₂ + KOH disprop.',
          formula: '3Cl₂⁰ + 6KOH → KCl⁺⁵O₃ + 5KCl⁻¹ + 3H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Qaynoq ishqorda xlorning o\'z-o\'zidan oksidlanib-qaytarilishi',
            tenglama: '1 | Cl⁰-5ē→Cl⁺⁵   va   5 | Cl⁰+1ē→Cl⁻¹   (1 : 5 nisbat)',
            suyuqlikRang: '#fef08a',
            tolish: 0.7,
            stakanBelgi: 'KClO₃ + 5KCl',
            stakanSarlavha: '3Cl₂ + 6KOH (>50°C)',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 70,
            maxTemp: 100,
            elektronJuft: { chap: 'Cl⁰', ong: '5Cl⁰', e: '5ē' },
            belgilar: [{ k: 'Sovuqda', v: 'Cl₂+2KOH → KClO+KCl', rang: '#38bdf8' }],
          },
          pastki: ['Bitta element (Cl⁰) ikki darajaga ajraladi', '5 ta Cl atomi qaytariladi (-1), 1 tasi oksidlanadi (+5)', 'Sovuqda KClO, qaynoqda KClO₃'],
        },
      ]}
    />
  );
}

function KorgazmaMashqTenglamalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 86-bet murakkab mashq tenglamalari"
      ikon="filtr"
      variantlar={[
        {
          id: 'kclo3_mno2',
          tugma: 'KClO₃ & MnO₂ + HCl',
          formula: '2KClO₃→2KCl+3O₂↑  |  MnO₂+4HCl=MnCl₂+Cl₂↑+2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Kislorod va Xlor olish tenglamalarini elektron-balansda tenglash',
            tenglama: '2KCl⁺⁵O₃⁻² → 2KCl⁻¹ + 3O₂⁰   |   Mn⁺⁴O₂ + 4HCl⁻¹ → Mn⁺²Cl₂ + Cl₂⁰ + 2H₂O',
            ikkiIdish: true,
            suyuqlikRang: '#cbd5e1',
            tolish: 0.55,
            stakanBelgi: '2KClO₃',
            stakanSarlavha: 'Cl⁺⁵→Cl⁻¹, 3O⁻²→O₂⁰',
            ikkinchiSuyuqlikRang: '#d9f99d',
            ikkinchiBelgi: 'MnCl₂ + Cl₂↑',
            ikkinchiSarlavha: 'MnO₂ + 4HCl',
            gazRang: '#a3e635',
            gazBelgi: 'O₂↑ / Cl₂↑',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 250,
            maxTemp: 400,
            belgilar: [{ k: '4 mol HCl', v: '2 moli Cl₂ ga, 2 moli tuzga', rang: '#fbbf24' }],
          },
          pastki: ['KClO₃: 1 | Cl⁺⁵+6ē→Cl⁻¹ (×2); 3 | 2O⁻²-4ē→O₂⁰', 'MnO₂+4HCl: faqat 2 mol HCl oksidlanadi', '2KClO₃ dan 3 mol O₂ chiqadi'],
        },
        {
          id: 'fes2_cr2o7',
          tugma: '4FeS₂ + 11O₂ (Pirit)',
          formula: '4FeS₂ + 11O₂ = 2Fe₂O₃ + 8SO₂↑  |  H₂SO₃ + K₂Cr₂O₇',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '86-bet: Ikki element oksidlanadigan pirit va bixromat tenglamasi',
            tenglama: 'Fe⁺²-1ē→Fe⁺³ va 2S⁻¹-10ē→2S⁺⁴ (jami -11ē!)  |  O₂⁰+4ē→2O⁻²',
            suyuqlikRang: '#f97316',
            tolish: 0.55,
            stakanBelgi: '2Fe₂O₃',
            stakanSarlavha: '4 | -11ē  vs  11 | +4ē',
            gazRang: '#fbbf24',
            gazBelgi: '8SO₂↑',
            qizdir: true,
            olovRang: '#ef4444',
            tempC: 800,
            maxTemp: 1000,
            elektronJuft: { chap: '4FeS₂', ong: '11O₂', e: '44ē' },
            belgilar: [{ k: 'K₂Cr₂O₇', v: '3H₂SO₃+K₂Cr₂O₇+4H₂SO₄', rang: '#34d399' }],
          },
          pastki: ['Har 1 mol FeS₂ jami 11 ē beradi (Fe+2S)', '4FeS₂ + 11O₂ = 2Fe₂O₃ + 8SO₂', 'K₂Cr₂⁺⁶O₇ → Cr₂⁺³(SO₄)₃ (6 ē oladi)'],
        },
      ]}
    />
  );
}

function KorgazmaMasalalar86() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 86-bet masalalar: 5,6 l H₂ va 31,6 g KMnO₄"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'cuo_h2',
          tugma: '1-masala: 5,6 l H₂',
          formula: 'CuO + H₂ = Cu + H₂O (0,25 mol Cu → 5,6 l H₂)',
          tur: 'hisob',
          cfg: {
            sarlavha: '0,25 mol mis olish uchun zarur vodorod hajmi (n.sh.)',
            tenglama: 'Cu⁺²+2ē→Cu⁰; H₂⁰-2ē→2H⁺¹   →   n(H₂) = n(Cu) = 0,25 mol',
            qadamlar: [
              { belgi: 'Balans nisbat', natija: '1 H₂ : 1 Cu', izoh: '2ē = 2ē', rang: '#38bdf8' },
              { belgi: 'n(H₂)', natija: '0,25 mol', izoh: '0,25 mol Cu ga', rang: '#fbbf24' },
              { belgi: 'V(H₂) = 0,25·22,4', natija: '5,6 litr', izoh: 'n.sh.dagi hajm', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Cu (0,25 mol)', foiz: 100, qiymat: '16 g Cu', rang: '#f97316' },
              { nom: 'H₂ (0,25 mol)', foiz: 100, qiymat: '5,6 litr', rang: '#34d399' },
            ],
            javobBadge: 'Javob: V(H₂) = 5,6 litr',
          },
          pastki: ['CuO + H₂ = Cu + H₂O (1 : 1)', 'n(H₂) = 0,25 mol', '0,25 × 22,4 = 5,6 litr'],
        },
        {
          id: 'feso4_kmno4',
          tugma: '2-masala: 31,6 g KMnO₄',
          formula: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ → 0,2 mol KMnO₄ (31,6 g)',
          tur: 'hisob',
          cfg: {
            sarlavha: '1 mol FeSO₄ ni oksidlash uchun kerakli KMnO₄ massasi',
            tenglama: '5 | Fe⁺²-1ē→Fe⁺³   va   1 | Mn⁺⁷+5ē→Mn⁺²   (10 : 2 = 5 : 1)',
            qadamlar: [
              { belgi: 'Nisbat FeSO₄:KMnO₄', natija: '5 : 1', izoh: '10 mol : 2 mol', rang: '#38bdf8' },
              { belgi: 'n(KMnO₄) = 1 / 5', natija: '0,2 mol', izoh: '1 mol FeSO₄ uchun', rang: '#a855f7' },
              { belgi: 'm = 0,2 · 158', natija: '31,6 g', izoh: 'M(KMnO₄) = 158', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'FeSO₄ (1 mol)', foiz: 100, qiymat: '152 g (5 hissa)', rang: '#38bdf8' },
              { nom: 'KMnO₄ (0,2 mol)', foiz: 20, qiymat: '31,6 g (1 hissa)', rang: '#a855f7' },
            ],
            javobBadge: 'Javob: 31,6 g KMnO₄ (0,2 mol)',
          },
          pastki: ['5 mol FeSO₄ → 1 mol KMnO₄', '1 mol FeSO₄ → 0,2 mol KMnO₄', '0,2 × 158 = 31,6 g'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (19-§) VA O'YINLAR (20-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'CuO + H₂SO₄ = CuSO₄ + H₂O nima uchun OQR ga kirmaydi?',
    variantlar: [
      { matn: 'Kislota qatnashgan', togri: false },
      { matn: 'Gaz ajralgani uchun', togri: false },
      { matn: 'Hech bir elementning OD si o\'zgarmagan', togri: true },
      { matn: 'Tuz hosil bo\'lgan', togri: false },],
    izoh: 'Cu(+2), H(+1), S(+6), O(-2) o\'zgarishsiz qolgan.',
  },
  {
    id: 't2',
    savol: 'OQR da QAYTARUVCHI nima qiladi?',
    variantlar: [
      { matn: 'Elektron beradi va o\'zi oksidlanadi', togri: true },
      { matn: 'Elektron oladi', togri: false },
      { matn: 'OD si kamayadi', togri: false },
      { matn: 'Ishtirok etmaydi', togri: false },],
    izoh: 'Qaytaruvchi elektron berib oksidlanadi.',
  },
  {
    id: 't3',
    savol: 'Azot -3 dan +5 gacha o\'tganda nechta elektron beradi?',
    variantlar: [
      { matn: '2 ē', togri: false },
      { matn: '5 ē', togri: false },
      { matn: '3 ē', togri: false },
      { matn: '8 ē', togri: true },],
    izoh: '(-3) dan (+5) gacha = 8 ta elektron.',
  },
  {
    id: 't4',
    savol: '2Li + H₂ = 2LiH va HgO + H₂ = Hg + H₂O da H₂ roli:',
    variantlar: [
      { matn: 'Ikkalasida oksidlovchi', togri: false },
      { matn: 'Li bilan oksidlovchi (H⁻¹), HgO bilan qaytaruvchi (H⁺¹)', togri: true },
      { matn: 'OQR emas', togri: false },
      { matn: 'Ikkalasida qaytaruvchi', togri: false },],
    izoh: 'Metall gidridda oksidlovchi, oksidni qaytarishda qaytaruvchi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'oddiy_oqr', nom: 'Oddiy & Nitrat OQR', tavsif: '2Al+6HCl, 8Al+30HNO₃, 4FeS₂' },
    { id: 'ichki_dis', nom: 'Ichki & Disprop.', tavsif: 'KMnO₄, H₂O₂, KClO₃, Cl₂+KOH' },
    { id: 'masala_oqr', nom: 'Masalalar & Qoida', tavsif: '5,6 l H₂, 31,6 g KMnO₄, ∑ē' },
  ],
  topshiriqlar: [
    { nom: '2Al + 6HCl = 2AlCl₃ + 3H₂↑', qisqa: 'Molekulalararo (6ē)', guruh: 'oddiy_oqr', izoh: 'EKUK(3,2) = 6.' },
    { nom: '8Al + 30HNO₃ = 8Al(NO₃)₃ + 3N₂O↑', qisqa: '+15H₂O (84-bet 2-misol)', guruh: 'oddiy_oqr', izoh: '24 ta tuzga + 6 ta gazga.' },
    { nom: '4FeS₂ + 11O₂ = 2Fe₂O₃ + 8SO₂↑', qisqa: 'Fe va S birga (-11ē)', guruh: 'oddiy_oqr', izoh: 'EKUK(11,4) = 44.' },
    { nom: '2KMnO₄ = K₂MnO₄ + MnO₂ + O₂↑', qisqa: 'Ichki OQR (∑ koef. = 5)', guruh: 'ichki_dis', izoh: 'Mn⁺⁷ → +6/+4; O⁻² → O₂⁰.' },
    { nom: '2H₂O₂ → 2H₂O + O₂↑ (O⁻¹)', qisqa: 'Disproporsiyalanish', guruh: 'ichki_dis', izoh: 'O⁻¹ ham -2, ham 0 ga o\'tadi.' },
    { nom: '3Cl₂ + 6KOH → KClO₃ + 5KCl', qisqa: 'Qaynoq ishqorda 1 : 5', guruh: 'ichki_dis', izoh: 'Cl⁰ ham +5, ham -1 ga o\'tadi.' },
    { nom: '∑ ē(berilgan) = ∑ ē(olingan)', qisqa: 'Elektron-balans sharti', guruh: 'masala_oqr', izoh: 'EKUK topilib koeffitsiyent qo\'yiladi.' },
    { nom: '0,25 mol Cu ← 5,6 l H₂ (n.sh.)', qisqa: 'CuO + H₂ (86-bet)', guruh: 'masala_oqr', izoh: '0,25 × 22,4 = 5,6 l.' },
    { nom: '1 mol FeSO₄ ← 31,6 g KMnO₄', qisqa: '5:1 nisbat (0,2 mol)', guruh: 'masala_oqr', izoh: '0,2 × 158 = 31,6 g.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '1-misol',
    savol: 'Al + HCl → AlCl₃ + H₂ tenglamasida HCl koeffitsiyenti:',
    variantlar: ['3', '2', '6 (2Al + 6HCl = 2AlCl₃ + 3H₂)', '4'],
    togri: 2,
    izoh: '2Al + 6HCl = 2AlCl₃ + 3H₂.',
  },
  {
    belgi: '3-misol',
    savol: '2KMnO₄ = K₂MnO₄ + MnO₂ + O₂ koeffitsiyentlar yig\'indisi:',
    variantlar: ['5 (2 + 1 + 1 + 1)', '4', '6', '8'],
    togri: 0,
    izoh: '85-bet: 2 + 1 + 1 + 1 = 5.',
  },
  {
    belgi: '2-misol',
    savol: '8Al + 30HNO₃ = 8Al(NO₃)₃ + 3N₂O + ?H₂O da HNO₃ va H₂O koeffitsiyentlari:',
    variantlar: ['10 va 5', '24 va 12', '16 va 8', '30 va 15'],
    togri: 3,
    izoh: '24 (tuzda) + 6 (N₂O) = 30HNO₃ va 15H₂O.',
  },
  {
    belgi: 'Disprop.',
    savol: '2H₂O₂ → 2H₂O + O₂ da kislorod O⁻¹ ning roli:',
    variantlar: ['Faqat oksidlovchi', 'Ham oksidlovchi (-2), ham qaytaruvchi (0)', 'Katalizator', 'Faqat qaytaruvchi'],
    togri: 1,
    izoh: 'O\'z-o\'zidan oksidlanish-qaytarilish (disproporsiyalanish).',
  },
  {
    belgi: '3-misol',
    savol: 'Zn + 4HNO₃ = Zn(NO₃)₂ + 2NO₂ + 2H₂O da 1 mol Zn nechta N⁺⁵ ni qaytaradi?',
    variantlar: ['4 ta N⁺⁵ ni', '2 ta N⁺⁵ ni (qolgan 2 tasi muhit)', '1 ta', '6 ta'],
    togri: 1,
    izoh: '2 ta N⁺⁵ gazga (NO₂), 2 tasi tuzga kiradi.',
  },
  {
    belgi: 'Masala 1',
    savol: 'CuO + H₂ = Cu + H₂O dan 0,25 mol Cu olish uchun necha litr H₂ kerak?',
    variantlar: ['22,4 l', '2,24 l', '11,2 l', '5,6 litr'],
    togri: 3,
    izoh: '0,25 × 22,4 = 5,6 litr.',
  },
  {
    belgi: 'Masala 2',
    savol: '10FeSO₄ + 2KMnO₄ + 8H₂SO₄ da 1 mol FeSO₄ ga necha mol KMnO₄ ketadi?',
    variantlar: ['0,2 mol (31,6 g)', '2 mol', '1 mol', '0,5 mol'],
    togri: 0,
    izoh: '10 : 2 = 5 : 1 → 1 / 5 = 0,2 mol = 31,6 g.',
  },
  {
    belgi: 'Pirit',
    savol: 'FeS₂ + O₂ = Fe₂O₃ + SO₂ tenglanganda O₂ va SO₂ koeffitsiyentlari:',
    variantlar: ['4 va 4', '2 va 4', '11 (O₂) va 8 (SO₂)', '8 va 11'],
    togri: 2,
    izoh: '4FeS₂ + 11O₂ = 2Fe₂O₃ + 8SO₂.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Elektron-balans 4 qadami',
    vazifa: 'Tenglash bosqichlarini tartiblang:',
    tartib: [
      '1. OD qo\'yib, o\'zgargan elementlarni topish',
      '2. Yarim reaksiyalar (-ē va +ē) tuzish',
      '3. EKUK orqali elektronlarni tenglash',
      '4. Koeffitsiyent qo\'yib, O va H bilan tekshirish',
    ],
    variantlar: [
      '3. EKUK orqali elektronlarni tenglash',
      '1. OD qo\'yib, o\'zgargan elementlarni topish',
      '4. Koeffitsiyent qo\'yib, O va H bilan tekshirish',
      '2. Yarim reaksiyalar (-ē va +ē) tuzish',
    ],
  },
  {
    tur: '2-masala: 1 mol FeSO₄ → 31,6 g KMnO₄',
    vazifa: 'Hisob qadamlarini joylang:',
    tartib: [
      '1. Fe⁺²−1ē→Fe⁺³ va Mn⁺⁷+5ē→Mn⁺²',
      '2. Nisbat: 10FeSO₄ : 2KMnO₄ (5 : 1)',
      '3. 1 mol FeSO₄ ga n(KMnO₄) = 0,2 mol',
      '4. m = 0,2 · 158 = 31,6 g KMnO₄',
    ],
    variantlar: [
      '2. Nisbat: 10FeSO₄ : 2KMnO₄ (5 : 1)',
      '4. m = 0,2 · 158 = 31,6 g KMnO₄',
      '1. Fe⁺²−1ē→Fe⁺³ va Mn⁺⁷+5ē→Mn⁺²',
      '3. 1 mol FeSO₄ ga n(KMnO₄) = 0,2 mol',
    ],
  },
  {
    tur: 'MnO₂ + 4HCl = MnCl₂ + Cl₂↑ + 2H₂O',
    vazifa: 'Tenglash tartibini tuzing:',
    tartib: [
      '1. Mn⁺⁴+2ē→Mn⁺² va 2Cl⁻¹−2ē→Cl₂⁰',
      '2. Cl₂ va MnCl₂ oldiga 1 qo\'yish',
      '3. 2 ta (tuz) + 2 ta (Cl₂) → 4HCl',
      '4. 4H → 2H₂O (O = 2 teng!)',
    ],
    variantlar: [
      '3. 2 ta (tuz) + 2 ta (Cl₂) → 4HCl',
      '4. 4H → 2H₂O (O = 2 teng!)',
      '1. Mn⁺⁴+2ē→Mn⁺² va 2Cl⁻¹−2ē→Cl₂⁰',
      '2. Cl₂ va MnCl₂ oldiga 1 qo\'yish',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Elektron-balans usulining bosh sharti:',
    variantlar: ['Gaz chiqishi', '∑ ē(berilgan) = ∑ ē(olingan)', 'Suv qo\'shish', 'Massa tengsizligi'],
    togri: 1,
    izoh: 'Qaytaruvchi bergan elektronlar oksidlovchi olganiga teng.',
  },
  {
    savol: '4HCl + MnO₂ = MnCl₂ + Cl₂ + 2H₂O da 4 mol HCl dan nechtasi Cl₂ bo\'ladi?',
    variantlar: ['Hammasi (4 mol)', '3 moli', '1 moli', 'Faqat 2 moli (qolgan 2 moli MnCl₂)'],
    togri: 3,
    izoh: 'Yarmi oksidlanib Cl₂ beradi, yarmi tuz hosil qiladi.',
  },
  {
    savol: '2KClO₃ → 2KCl + 3O₂ da oksidlovchi va qaytaruvchi:',
    variantlar: ['Cl⁺⁵ oksidlovchi (+6ē), O⁻² qaytaruvchi (-4ē)', 'Faqat O', 'K va Cl', 'OQR emas'],
    togri: 0,
    izoh: 'Ichki oksidlanish-qaytarilish.',
  },
  {
    savol: '8Al + 30HNO₃ = 8Al(NO₃)₃ + 3N₂O + 15H₂O da nechta HNO₃ tuzga sarflanadi?',
    variantlar: ['30 ta', '6 ta', '24 ta (8Al(NO₃)₃ tarkibida)', '15 ta'],
    togri: 2,
    izoh: '8×3 = 24 ta N tuzga, 6 tasi 3N₂O ga.',
  },
  {
    savol: '4Al + 3O₂ = 2Al₂O₃ koeffitsiyentlar yig\'indisi:',
    variantlar: ['5', '7', '9 (4 + 3 + 2)', '12'],
    togri: 2,
    izoh: '4 + 3 + 2 = 9.',
  },
  {
    savol: '3Cu + 8HNO₃ = 3Cu(NO₃)₂ + 2NO + 4H₂O da Cu va NO koeffitsiyentlari:',
    variantlar: ['3 (Cu) va 2 (NO)', '1 va 1', '8 va 4', '2 va 3'],
    togri: 0,
    izoh: '3 | Cu⁰-2ē→Cu⁺²; 2 | N⁺⁵+3ē→N⁺².',
  },
  {
    savol: '2KMnO₄ parchalanishida 2 mol tuzdan necha mol O₂ chiqadi?',
    variantlar: ['2 mol', '1 mol O₂', '0,5 mol', '5 mol'],
    togri: 1,
    izoh: '2KMnO₄ = K₂MnO₄ + MnO₂ + 1 O₂.',
  },
  {
    savol: '3H₂SO₃ + K₂Cr₂O₇ + 4H₂SO₄ da Cr⁺⁶ nechta elektron oladi (2Cr⁺⁶ → 2Cr⁺³)?',
    variantlar: ['1 ē', '2 ē', '3 ē', '6 ta elektron (2 × 3ē)'],
    togri: 3,
    izoh: 'Har Cr⁺⁶ 3 tadan, jami 6 ē.',
  },
];

export default function S8Mavzu20() {
  const korgazmalar = [
    { nom: '1. Balans 4 qadami', ikon: 'formula', komponent: <KorgazmaBalansQadamlari /> },
    { nom: '2. Metall + HNO₃ (30 / 4)', ikon: 'kolba', komponent: <KorgazmaNitratOQR /> },
    { nom: '3. KMnO₄ (∑ = 5)', ikon: 'uchqun', komponent: <KorgazmaPermanganatParchalanish /> },
    { nom: '4. H₂O₂ & Cl₂ disprop.', ikon: 'tomchi', komponent: <KorgazmaPeroksidDisprop /> },
    { nom: '5. Pirit FeS₂ & MnO₂', ikon: 'filtr', komponent: <KorgazmaMashqTenglamalar /> },
    { nom: '6. 5,6 l H₂ & 31,6 g KMnO₄', ikon: 'qidiruv', komponent: <KorgazmaMasalalar86 /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-20"
          nom="OQR turlari va tenglamalarni guruhlang"
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
          key="tezkor-20"
          nom="20-§: OQR tenglamalari"
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
          key="zanjir-20"
          nom="Balans & Hisob zanjiri"
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
          key="duel-20"
          sarlavha="20-§: Elektron-balans dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="20-§"
      mavzuNom="Oksidlanish-qaytarilish reaksiyalari tenglamalarini tuzish"
      oldingiRaqam="19-§"
      oldingiNom="Oksidlanish-qaytarilish reaksiyalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
