'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 23-PARAGRAF
// "Xlor" (Darslik 96-100-betlar)
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
function KorgazmaXlorAtomVaBog() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Xlor atomi (Z=17), izotoplar (Ar=35,5) va Cl₂"
      ikon="atom"
      variantlar={[
        {
          id: 'izotop',
          tugma: 'Izotoplar & Atom',
          formula: '³⁵Cl (75,5%) + ³⁷Cl (24,5%) → Ar = 35,5 • 3s²3p⁵3d⁰',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Xlor atomi (17p⁺, 18/20n⁰) va tabiiy izotoplar',
            tenglama: 'Ar(Cl) = 35·0,755 + 37·0,245 = 35,5   |   OD: -1..+7',
            rejim: 'atom',
            markaz: { belgi: '+17', rang: '#34d399', r: 24 },
            qavatlar: [2, 8, 7],
            belgilar: [
              { k: '³⁵Cl / ³⁷Cl', v: '75,5% / 24,5%', rang: '#34d399' },
              { k: 'OD', v: '-1, 0, +1, +3, +5, +7', rang: '#fde047' },
            ],
          },
          pastki: ['Z = 17, elektronlar: 2, 8, 7', '³⁵Cl (75,5%) + ³⁷Cl (24,5%) → Ar=35,5', 'Bo\'sh 3d tufayli I, III, V, VII valent'],
        },
        {
          id: 'cl2_mol',
          tugma: 'Cl–Cl molekulasi (Mr=71)',
          formula: 'Cl–Cl • qutbsiz kovalent • D_havo = 2,45 • D_H2 = 35,5',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Xlor molekulasi (Cl₂): bitta σ-bog\' va havodan 2,45 marta og\'ir',
            tenglama: 'D_H2 = 71/2 = 35,5   •   D_He = 71/4 = 17,75   •   D_havo = 71/29 = 2,45',
            rejim: 'molekula',
            markaz: { belgi: 'Cl', rang: '#34d399', r: 25 },
            atomlar: [{ belgi: 'Cl', rang: '#34d399', r: 25, masofa: 86, bog: 1, burchak: 0 }],
            metrikalar: [
              { nom: 'D_havo (havodan og\'ir)', qiymat: '2,45 (tubi pastda yig\'.)', foiz: 85, rang: '#34d399' },
              { nom: 'D_H2 / D_He', qiymat: '35,5 / 17,75', foiz: 70, rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Bog\' turi', v: 'Qutbsiz kovalent (Cl–Cl)', rang: '#fde047' }],
          },
          pastki: ['Sarg\'ish-yashil, o\'tkir bo\'g\'uvchi gaz', 'Mr(Cl₂) = 71 → D_havo = 2,45', 'D_H2 = 35,5; D_He = 17,75'],
        },
      ]}
    />
  );
}

function KorgazmaXlorMinerallar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Xlorning tabiiy minerallari (96-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'minerallar',
          tugma: 'Galit, Silvinit, Karnallit',
          formula: 'NaCl • KCl • KCl·NaCl • KCl·MgCl₂·6H₂O • MgSO₄·KCl·3H₂O',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Tabiiy xlorli minerallar (Qashqadaryo, Orolbo\'yi konlari)',
            tenglama: 'Tosh tuzi (NaCl) va kaliy-magniy tuzlari dengiz va ko\'llarda ko\'p',
            markazBelgi: 'Cl⁻',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'Galit & Silvin', belgi: 'NaCl / KCl', rang: '#38bdf8' },
              { nom: 'Silvinit', belgi: 'KCl · NaCl', rang: '#fb7185' },
              { nom: 'Karnallit', belgi: 'KCl·MgCl₂·6H₂O', rang: '#fbbf24' },
              { nom: 'Kainit', belgi: 'MgSO₄·KCl·3H₂O', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'O\'zbekiston', v: 'Xo\'jaikon, Borsakelmas', rang: '#34d399' }],
          },
          pastki: ['Galit NaCl, Silvinit KCl·NaCl', 'Karnallit KCl·MgCl₂·6H₂O', 'Kainit MgSO₄·KCl·3H₂O'],
        },
        {
          id: 'panjara',
          tugma: 'Ionli NaCl kristali',
          formula: 'Na⁺ va Cl⁻ ionli panjara (Ts = 801°C)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Osh tuzi (NaCl) ionli kristall panjarasi',
            tenglama: 'Cl⁻ inson qonida (0,9% NaCl) va oshqozon HCl tarkibida mavjud',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Fiziologik eritma', qiymat: '0,9% NaCl', foiz: 90, rang: '#38bdf8' },
              { nom: 'Oshqozon shirasi', qiymat: '~0,5% HCl', foiz: 65, rang: '#34d399' },
            ],
            belgilar: [{ k: 'Kunlik tuz', v: '5–10 g NaCl', rang: '#fbbf24' }],
          },
          pastki: ['Ion bog\'li qattiq kristall', '0,9% NaCl — fiziologik eritma', 'Oshqozonda HCl shaklida hazmda qatnashadi'],
        },
      ]}
    />
  );
}

function KorgazmaXlorOlinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Laboratoriya, Sanoat (elektroliz) va Xlorli suv"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab',
          tugma: 'Lab: MnO₂ & KMnO₄',
          formula: 'MnO₂+4HCl→Cl₂↑  |  2KMnO₄+16HCl→5Cl₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Sheyele (1774) va KMnO₄ usullari — tubi pastda yig\'iladi!',
            tenglama: 'MnO₂ + 4HCl →(t°) MnCl₂ + Cl₂↑ + 2H₂O   |   2KMnO₄ + 16HCl → 5Cl₂↑',
            ikkiIdish: true,
            suyuqlikRang: '#475569',
            tolish: 0.68,
            stakanBelgi: 'MnO₂ + 4HCl',
            stakanSarlavha: 'Sheyele (t°)',
            ikkinchiSuyuqlikRang: '#7e22ce',
            ikkinchiBelgi: 'KMnO₄ + 16HCl',
            ikkinchiSarlavha: 'Isitmasdan (5Cl₂↑)',
            gazRang: '#a3e635',
            gazBelgi: 'Cl₂↑ (2,45× og\'ir)',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 85,
            maxTemp: 150,
            belgilar: [{ k: 'Yig\'ish', v: 'Havo siqib chiqarish (pastga)', rang: '#a3e635' }],
          },
          pastki: ['Sheyele (1774): MnO₂ + 4HCl →(t°) Cl₂↑', '2KMnO₄ + 16HCl = 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O', 'Havodan 2,45× og\'ir (silindr og\'zi tepada)'],
        },
        {
          id: 'sanoat_suv',
          tugma: 'Sanoat & Xlorli suv (0,63%)',
          formula: '2NaCl+2H₂O→2NaOH+H₂↑+Cl₂↑  |  ω(Cl₂) = 0,63%',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Sanoat elektrolizi va xlorli suv hisobi (97-bet)',
            tenglama: '1 l suvda 2 l (6,34 g) Cl₂ eriydi → ω = 6,34 / 1006,34 = 0,63%',
            bosqichlar: [
              { nom: 'Katod (-)', tur: 'elektroliz', ichi: '2H₂O + 2ē', mahsulot: 'H₂↑ + 2NaOH', rang: '#38bdf8' },
              { nom: 'Anod (+)', tur: 'minora', ichi: '2Cl⁻ - 2ē', mahsulot: 'Cl₂↑ (gaz)', rang: '#a3e635' },
              { nom: 'Xlorli suv (20°C)', tur: 'sovutkich', ichi: '1000g suv + 6,34g Cl₂', mahsulot: 'ω = 0,63%', rang: '#fde047' },
            ],
            belgilar: [{ k: 'Eritma', v: '1006,34 g xlorli suv', rang: '#a3e635' }],
          },
          pastki: ['Anodda Cl₂↑, katodda H₂↑ va NaOH', '20°C da 1 l suvda 2 l (6,34 g) Cl₂ eriydi', 'ω(Cl₂) = 6,34 / 1006,34 = 0,63%'],
        },
      ]}
    />
  );
}

function KorgazmaXlorMetallar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Xlorning metallar bilan reaksiyasi (98-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'fe_na',
          tugma: 'Fe → FeCl₃ & Na',
          formula: '2Fe + 3Cl₂ → 2FeCl₃ (qo\'ng\'ir!)  |  2Na + Cl₂ = 2NaCl',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Muhim qoida: Xlor temirni FeCl₂ ga emas, FeCl₃ gacha oksidlaydi!',
            tenglama: '2Fe + 3Cl₂ →(t°) 2FeCl₃ (qo\'ng\'ir tutun)   |   2Na + Cl₂ = 2NaCl (sariq alanga)',
            ikkiIdish: true,
            suyuqlikRang: '#92400e',
            tolish: 0.65,
            stakanBelgi: '2FeCl₃ (Fe⁺³)',
            stakanSarlavha: 'Fe + Cl₂ (qo\'ng\'ir)',
            ikkinchiSuyuqlikRang: '#fef08a',
            ikkinchiBelgi: '2NaCl',
            ikkinchiSarlavha: 'Na + Cl₂ (sariq alanga)',
            gazRang: '#d97706',
            gazBelgi: 'FeCl₃ tutun',
            qizdir: true,
            olovRang: '#fbbf24',
            tempC: 350,
            maxTemp: 500,
            reagentlar: [{ belgi: 'Fe / Na', rang: '#94a3b8' }],
            belgilar: [{ k: 'Ehtiyot', v: 'HCl → FeCl₂; Cl₂ → FeCl₃!', rang: '#f97316' }],
          },
          pastki: ['Xlor kuchli oksidlovchi: Fe⁺³Cl₃ beradi', 'Natriy sariq alanga bilan yonib NaCl beradi', 'Oq tutun — NaCl kristallchalari'],
        },
        {
          id: 'cu_sb',
          tugma: 'Cu & Sb (sovuqda yonish)',
          formula: 'Cu + Cl₂ → CuCl₂  |  2Sb + 3Cl₂ → 2SbCl₃ (uchqun!)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Cho\'g\'langan mis va xona haroratida o\'zi yonadigan surma (Sb)',
            tenglama: 'Cu + Cl₂ → CuCl₂ (suvda ko\'k-zangori)   |   2Sb + 3Cl₂ → 2SbCl₃ / SbCl₅',
            ikkiIdish: true,
            suyuqlikRang: '#06b6d4',
            tolish: 0.72,
            stakanBelgi: 'CuCl₂ (aq)',
            stakanSarlavha: 'Cu + Cl₂ → ko\'k eritma',
            ikkinchiSuyuqlikRang: '#f8fafc',
            ikkinchiBelgi: 'SbCl₃ (uchqun)',
            ikkinchiSarlavha: 'Sb sovuqda yonadi',
            gazRang: '#fbbf24',
            gazBelgi: 'Uchqun',
            qizdir: true,
            olovRang: '#fb923c',
            tempC: 25,
            maxTemp: 400,
            reagentlar: [{ belgi: 'Cu / Sb', rang: '#ea580c' }],
            belgilar: [{ k: '2Sb+3Cl₂', v: 'Isitmasdan yonadi!', rang: '#fbbf24' }],
          },
          pastki: ['CuCl₂ eritmasi och ko\'k-zangori rangli', 'Surma (Sb) kukuni sovuq xlorda yonadi', 'Mo\'l xlorda SbCl₅ hosil bo\'ladi'],
        },
      ]}
    />
  );
}

function KorgazmaDisproporsiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Suv (HClO) va ishqor (0°C KClO / >50°C KClO₃)"
      ikon="filtr"
      variantlar={[
        {
          id: 'suv_javel',
          tugma: 'H₂O & Sovuq KOH (0°C)',
          formula: 'Cl₂+H₂O⇄HCl+HClO  |  Cl₂+2KOH(0°C)→KClO+KCl+H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Xlorli suv va "Javel suvi" — [O] atomar kislorod bilan dezinfeksiya',
            tenglama: 'HClO → HCl + [O] (kuchli oqartiruvchi va bakteritsid!)',
            suyuqlikRang: '#d9f99d',
            tolish: 0.74,
            stakanBelgi: 'HClO + KClO',
            stakanSarlavha: '0°C Javel & Xlorli ohak',
            elektronJuft: { chap: 'Cl⁰', ong: 'Cl⁰', e: '+1/-1' },
            belgilar: [{ k: 'CaOCl₂', v: 'Ca(OH)₂ + Cl₂ → Xlorli ohak', rang: '#fde047' }],
          },
          pastki: ['HClO beqaror: HCl + [O] (oqartiradi)', 'Sovuq KOH (0°C): KClO (gipoxlorit) + KCl', 'NaOH bilan aralashma — Javel suvi'],
        },
        {
          id: 'qaynoq_koh',
          tugma: 'Qaynoq KOH (>50°C)',
          formula: '3Cl₂ + 6KOH →(>50°C) KCl⁺⁵O₃ + 5KCl⁻¹ + 3H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Qaynoq ishqorda Bertole tuzi (KClO₃) olinishi (1 Cl⁺⁵ : 5 Cl⁻¹)',
            tenglama: '5 ta xlor atomi Cl⁻¹ gacha qaytariladi, 1 tasi Cl⁺⁵ gacha oksidlanadi',
            suyuqlikRang: '#e2e8f0',
            tolish: 0.7,
            stakanBelgi: 'KClO₃ + 5KCl',
            stakanSarlavha: '3Cl₂ + 6KOH (>50°C)',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'KClO₃↓ kristall',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 75,
            maxTemp: 100,
            elektronJuft: { chap: '1Cl⁰', ong: '5Cl⁰', e: '5ē' },
            belgilar: [{ k: 'Bertole tuzi', v: 'KClO₃ (OD = +5)', rang: '#fbbf24' }],
          },
          pastki: ['Harorat > 50°C da KClO₃ hosil bo\'ladi', '5 ta atom qaytariladi, 1 tasi oksidlanadi', 'Gugurt va labda O₂ olishda ishlatiladi'],
        },
      ]}
    />
  );
}

function KorgazmaIshlatishVaMasala() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 7 ta qo&apos;llanish va 100-bet masalalari (5,6 g Fe; 0,56 l)"
      ikon="formula"
      variantlar={[
        {
          id: 'sohalar',
          tugma: '7 ta qo\'llanish sohasi',
          formula: 'PVX • Pestitsid • Br₂/I₂ • Ruda • Oqartirish • Suv • HCl',
          tur: 'biogen',
          cfg: {
            sarlavha: '99-bet: Xlorning xalq xo\'jaligidagi 7 ta asosiy qo\'llanilishi',
            tenglama: 'Polimerlar (PVX) • Suv zararsizlantirish • Oqartirgichlar • HCl & Tuzlar',
            markazBelgi: 'Cl₂ (7)',
            markazRang: '#a3e635',
            tugunlar: [
              { nom: '1–2. PVX & Ximikatlar', belgi: 'Plastmassa', rang: '#38bdf8' },
              { nom: '3–4. Br₂/I₂ & Ruda', belgi: 'Metallurgiya', rang: '#fbbf24' },
              { nom: '5. Qog\'oz/Mato oqart.', belgi: 'CaOCl₂ / Javel', rang: '#f8fafc' },
              { nom: '6–7. Suv & HCl sintez', belgi: 'Dezinfeksiya', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Asosiy', v: 'Suvni xlorlash va PVX', rang: '#34d399' }],
          },
          pastki: ['1. PVX polimerlar; 2. Zararkunandaga qarshi', '3–4. Br₂/I₂ ajratish & ruda boyitish', '5–7. Oqartirish, suv tozalash, HCl'],
        },
        {
          id: 'masalalar',
          tugma: '3 & 5-masala (5,6 g / 0,56 l)',
          formula: '3,36 l Cl₂ → 5,6 g Fe  |  5,95 g KBr → 0,56 l Cl₂',
          tur: 'hisob',
          cfg: {
            sarlavha: '100-bet 3 va 5-masalalar: Stexiometrik hisoblar',
            tenglama: '2Fe + 3Cl₂ → 2FeCl₃ (0,15 Cl₂ → 0,1 Fe)   |   2KBr + Cl₂ → (0,05 KBr → 0,025 Cl₂)',
            qadamlar: [
              { belgi: '3-masala: 3,36 l Cl₂', natija: '5,6 g Fe', izoh: '0,15·2/3 = 0,1 mol·56', rang: '#f97316' },
              { belgi: '5-masala: 5,95 g KBr', natija: '0,05 mol KBr', izoh: '5,95 / 119', rang: '#38bdf8' },
              { belgi: 'n(Cl₂) = 0,025 mol', natija: '0,56 litr Cl₂', izoh: '0,025 · 22,4', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '3-m: Fe (0,1 mol)', foiz: 100, qiymat: '5,6 g Fe', rang: '#f97316' },
              { nom: '5-m: Cl₂ (0,025 mol)', foiz: 50, qiymat: '0,56 l Cl₂', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 3-m = 5,6 g Fe;  5-m = 0,56 l Cl₂',
          },
          pastki: ['3,36 l Cl₂ = 0,15 mol → 0,1 mol Fe = 5,6 g', '5,95 g KBr (M=119) = 0,05 mol → 0,025 Cl₂', '0,025 × 22,4 = 0,56 litr Cl₂'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (22-§) VA O'YINLAR (23-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Nima uchun ftor faqat -1 oksidlanish darajasini ko\'rsatadi?',
    variantlar: [
      { matn: 'Z = 17', togri: false },
      { matn: 'Og\'ir metall', togri: false },
      { matn: '2-davr (d-orbitali yo\'q) va EM = 4,0 eng katta', togri: true },
      { matn: 'Suvda eriydi', togri: false },],
    izoh: '93-bet: Ftor faqat elektron tortadi (-1).',
  },
  {
    id: 't2',
    savol: 'Qattiq holdan to\'g\'ri gunafsha bug\'ga aylanadigan (sublimatlanadigan) galogen:',
    variantlar: [
      { matn: 'Yod (I₂)', togri: true },
      { matn: 'Brom', togri: false },
      { matn: 'Xlor', togri: false },
      { matn: 'Ftor', togri: false },],
    izoh: '94–95-betlar: Yod sublimatsiyaga uchraydi.',
  },
  {
    id: 't3',
    savol: 'Plavik shpati (flyuorit) formulasi va galogeni:',
    variantlar: [
      { matn: 'NaCl — Xlor', togri: false },
      { matn: 'MgBr₂ — Brom', togri: false },
      { matn: 'KI — Yod', togri: false },
      { matn: 'CaF₂ — Ftor', togri: true },],
    izoh: '17-jadval: CaF₂ plavik shpati.',
  },
  {
    id: 't4',
    savol: 'Galogenid ionlari qaytaruvchilik kuchi ORTIB borish qatori:',
    variantlar: [
      { matn: 'I⁻ → Br⁻ → Cl⁻ → F⁻', togri: false },
      { matn: 'F⁻ → Cl⁻ → Br⁻ → I⁻', togri: true },
      { matn: 'Teng', togri: false },
      { matn: 'Cl⁻ → F⁻ → Br⁻ → I⁻', togri: false },],
    izoh: 'Ion radiusi ortishi bilan elektron berish osonlashadi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tuzilish_min', nom: 'Atom & Minerallar', tavsif: '³⁵Cl/³⁷Cl, Galit, Karnallit' },
    { id: 'olish_met', nom: 'Olish & Metallar', tavsif: 'MnO₂, Elektroliz, FeCl₃' },
    { id: 'ishqor_soha', nom: 'Disprop. & Qo\'llash', tavsif: 'KClO, KClO₃, PVX, 5,6 g' },
  ],
  topshiriqlar: [
    { nom: '³⁵Cl (75,5%) & ³⁷Cl (24,5%) → 35,5', qisqa: 'Xlor izotoplari', guruh: 'tuzilish_min', izoh: '3s²3p⁵; Mr(Cl₂) = 71.' },
    { nom: 'Karnallit KCl·MgCl₂·6H₂O', qisqa: 'Galit, Silvinit, Kainit', guruh: 'tuzilish_min', izoh: '96-bet tabiiy minerallar.' },
    { nom: 'D_havo = 71/29 = 2,45 (og\'ir)', qisqa: 'D_H2=35,5; D_He=17,75', guruh: 'tuzilish_min', izoh: 'Tubida to\'planadigan gaz.' },
    { nom: 'MnO₂ + 4HCl →(t°) MnCl₂ + Cl₂↑', qisqa: 'Sheyele usuli (lab)', guruh: 'olish_met', izoh: '2KMnO₄ + 16HCl isitmasdan.' },
    { nom: '2NaCl+2H₂O →(el.) 2NaOH+H₂+Cl₂', qisqa: 'Sanoat elektrolizi', guruh: 'olish_met', izoh: 'Xlorli suv ω = 0,63%.' },
    { nom: '2Fe + 3Cl₂ → 2FeCl₃; 2Sb+3Cl₂', qisqa: 'Fe⁺³ va sovuqda Sb', guruh: 'olish_met', izoh: 'Cu + Cl₂ = CuCl₂ (ko\'k eritma).' },
    { nom: 'Cl₂ + 2KOH(0°C) → KClO + KCl', qisqa: 'Javel suvi (oqartiruvchi)', guruh: 'ishqor_soha', izoh: 'HClO → HCl + [O] dezinfeksiya.' },
    { nom: '3Cl₂ + 6KOH(>50°C) → KClO₃ + 5KCl', qisqa: 'Bertole tuzi (Cl⁺⁵)', guruh: 'ishqor_soha', izoh: '5 ta qaytariladi, 1 tasi oksidlanadi.' },
    { nom: 'PVX, suv tozalash, 5,6 g Fe / 0,56 l', qisqa: '7 soha va 100-bet masalalar', guruh: 'ishqor_soha', izoh: '3,36 l Cl₂ → 5,6 g Fe.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Xlorli suv',
    savol: '20°C da 1 hajm suvda 2 hajm Cl₂ erigan xlorli suv massa ulushi:',
    variantlar: ['37%', '10%', '0,63% (6,34 / 1006,34)', '5%'],
    togri: 2,
    izoh: '97-bet hisobi: 6,34 / 1006,34 = 0,63%.',
  },
  {
    belgi: 'Qaynoq KOH',
    savol: 'Qaynoq KOH (>50°C) dan xlor o\'tkazilsa KCl bilan nima hosil bo\'ladi?',
    variantlar: ['KClO₃ (Bertole tuzi, Cl⁺⁵)', 'KClO', 'KClO₄', 'HCl'],
    togri: 0,
    izoh: '3Cl₂ + 6KOH → KClO₃ + 5KCl + 3H₂O.',
  },
  {
    belgi: 'Fe + Cl₂',
    savol: 'Qizdirilgan temir xlor bilan qaysi xloridni beradi?',
    variantlar: ['FeCl₂', 'Fe(ClO)₂', 'Reaksiyaga kirishmaydi', 'FeCl₃ (temir(III) xlorid)'],
    togri: 3,
    izoh: 'Xlor kuchli oksidlovchi sifatida Fe⁺³ hosil qiladi.',
  },
  {
    belgi: 'Mineral',
    savol: 'KCl·MgCl₂·6H₂O formulali tabiiy mineral:',
    variantlar: ['Galit', 'Karnallit', 'Kainit', 'Silvin'],
    togri: 1,
    izoh: '96-bet: Karnallit KCl·MgCl₂·6H₂O.',
  },
  {
    belgi: 'Zichlik',
    savol: 'Cl₂ (Mr=71) ning H₂ va He ga nisbatan zichliklari:',
    variantlar: ['71 va 35,5', '35,5 (H₂) va 17,75 (He)', '17 va 8,5', '2,45 va 1,2'],
    togri: 1,
    izoh: '71/2 = 35,5; 71/4 = 17,75.',
  },
  {
    belgi: 'Sovuq KOH',
    savol: 'Cl₂ + 2KOH(0°C) → qaysi mahsulotlar hosil bo\'ladi?',
    variantlar: ['KClO₃ + KCl', 'KOCl₂', 'KClO₄ + H₂', 'KClO (gipoxlorit) + KCl + H₂O'],
    togri: 3,
    izoh: 'Sovuqda gipoxlorit KClO hosil bo\'ladi.',
  },
  {
    belgi: '3-masala',
    savol: '3,36 l xlor (n.sh.) bilan reaksiyaga kirishuvchi temir massasi:',
    variantlar: ['5,6 g (0,1 mol Fe)', '2,8 g', '11,2 g', '16,8 g'],
    togri: 0,
    izoh: '0,15 mol Cl₂ → 2Fe+3Cl₂=2FeCl₃ → 0,1 mol Fe = 5,6 g.',
  },
  {
    belgi: '5-masala',
    savol: '5,95 g KBr dan Br₂ siqib chiqarish uchun necha litr Cl₂ kerak?',
    variantlar: ['2,24 l', '1,12 l', '0,56 litr (0,025 mol)', '5,6 l'],
    togri: 2,
    izoh: '0,05 mol KBr → 0,025 mol Cl₂ = 0,56 litr.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Xlorning OD o\'sish qatori (-1 → +5)',
    vazifa: 'Oksidlanish darajasi ortishi bo\'yicha joylang:',
    tartib: [
      'NaCl (OD = -1, Galit)',
      'Cl₂ (OD = 0, oddiy modda)',
      'KClO (OD = +1, Javel suvi)',
      'KClO₃ (OD = +5, Bertole tuzi)',
    ],
    variantlar: [
      'KClO (OD = +1, Javel suvi)',
      'NaCl (OD = -1, Galit)',
      'KClO₃ (OD = +5, Bertole tuzi)',
      'Cl₂ (OD = 0, oddiy modda)',
    ],
  },
  {
    tur: 'Labdan reaksiya zanjirigacha',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. MnO₂ + 4HCl → MnCl₂ + Cl₂↑ + 2H₂O',
      '2. Havodan 2,45× og\'ir gaz yig\'iladi',
      '3. 2Fe + 3Cl₂ → 2FeCl₃ (qo\'ng\'ir)',
      '4. 2NaCl + 2H₂O →(el.) 2NaOH + H₂ + Cl₂',
    ],
    variantlar: [
      '2. Havodan 2,45× og\'ir gaz yig\'iladi',
      '4. 2NaCl + 2H₂O →(el.) 2NaOH + H₂ + Cl₂',
      '1. MnO₂ + 4HCl → MnCl₂ + Cl₂↑ + 2H₂O',
      '3. 2Fe + 3Cl₂ → 2FeCl₃ (qo\'ng\'ir)',
    ],
  },
  {
    tur: 'Suv va KOH harorat zanjiri',
    vazifa: 'Harorat oshishi bo\'yicha reaksiyalarni joylang:',
    tartib: [
      '1. Cl₂ + H₂O ⇄ HCl + HClO (xlorli suv)',
      '2. Cl₂ + 2KOH(0°C) → KClO + KCl + H₂O',
      '3. 3Cl₂ + 6KOH(>50°C) → KClO₃ + 5KCl',
      '4. HClO → HCl + [O] (oqartirish)',
    ],
    variantlar: [
      '3. 3Cl₂ + 6KOH(>50°C) → KClO₃ + 5KCl',
      '4. HClO → HCl + [O] (oqartirish)',
      '1. Cl₂ + H₂O ⇄ HCl + HClO (xlorli suv)',
      '2. Cl₂ + 2KOH(0°C) → KClO + KCl + H₂O',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Cl₂ molekulasidagi kimyoviy bog\' turi:',
    variantlar: ['Qutbli kovalent', 'Qutbsiz kovalent', 'Ion bog\'', 'Vodorod bog\''],
    togri: 1,
    izoh: 'Bir xil xlor atomlari orasida qutbsiz kovalent.',
  },
  {
    savol: 'Silvinit va Kainit formulalari:',
    variantlar: ['NaCl va KCl', 'Na₂SO₄', 'CaF₂ va MgBr₂', 'KCl·NaCl va MgSO₄·KCl·3H₂O'],
    togri: 3,
    izoh: '96-bet tabiiy kaliy-magniy tuzlari.',
  },
  {
    savol: 'NaCl suvli eritmasi elektrolizining 3 ta mahsuloti:',
    variantlar: ['NaOH, H₂↑ va Cl₂↑', 'HCl, Na₂O, H₂', 'Na, Cl₂, O₂', 'NaClO, H₂'],
    togri: 0,
    izoh: '2NaCl + 2H₂O → 2NaOH + H₂↑ + Cl₂↑.',
  },
  {
    savol: 'Xlor havodan necha marta og\'ir?',
    variantlar: ['1,2 marta', '0,5 marta', '2,45 marta (71 / 29)', '10 marta'],
    togri: 2,
    izoh: 'D_havo = 71 / 29 = 2,45.',
  },
  {
    savol: 'Xlorli kolbada qizdirmasdan uchqunlanib yonadigan metall:',
    variantlar: ['Platina (Pt)', 'Oltin (Au)', 'Surma (Sb kukuni)', 'Kumush'],
    togri: 2,
    izoh: '2Sb + 3Cl₂ → 2SbCl₃ (xona t° da).',
  },
  {
    savol: 'Xlorli suvning mikroblarni o\'ldirish sababi:',
    variantlar: ['HClO → HCl + [O] atomar kislorod chiqishi', 'Tuz hosil qilishi', 'Sovutishi', 'Suvni muzlatishi'],
    togri: 0,
    izoh: 'Atomar [O] kuchli oksidlovchi va dezinfektor.',
  },
  {
    savol: '3Cl₂ + 6KOH → KClO₃ + 5KCl + 3H₂O da nechta Cl atomi qaytariladi va oksidlanadi?',
    variantlar: ['3 va 3', '5 tasi qaytariladi (Cl⁻¹), 1 tasi oksidlanadi (Cl⁺⁵)', '2 va 4', '1 va 5'],
    togri: 1,
    izoh: '5Cl⁻¹ va 1 ta KCl⁺⁵O₃.',
  },
  {
    savol: 'Tabiiy xlorning o\'rtacha Ar = 35,5 bo\'lish sababi:',
    variantlar: ['Radioaktiv', 'Sun\'iy izotop', 'O\'lchov xatosi', '³⁵Cl (75,5%) va ³⁷Cl (24,5%) izotoplari'],
    togri: 3,
    izoh: '35·0,755 + 37·0,245 = 35,5.',
  },
];

export default function S8Mavzu23() {
  const korgazmalar = [
    { nom: '1. Izotoplar (35,5) & Cl₂', ikon: 'atom', komponent: <KorgazmaXlorAtomVaBog /> },
    { nom: '2. Tabiiy minerallar', ikon: 'kristall', komponent: <KorgazmaXlorMinerallar /> },
    { nom: '3. Olish & Xlorli suv (0,63%)', ikon: 'kolba', komponent: <KorgazmaXlorOlinishi /> },
    { nom: '4. Metallar (FeCl₃, Sb)', ikon: 'uchqun', komponent: <KorgazmaXlorMetallar /> },
    { nom: '5. KClO (0°) & KClO₃ (>50°)', ikon: 'filtr', komponent: <KorgazmaDisproporsiya /> },
    { nom: '6. 7 soha & 100-bet masala', ikon: 'formula', komponent: <KorgazmaIshlatishVaMasala /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-23"
          nom="Xlor xossalarini guruhlang"
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
          key="tezkor-23"
          nom="23-§: Xlor"
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
          key="zanjir-23"
          nom="Xlor reaksiyalari zanjiri"
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
          key="duel-23"
          sarlavha="23-§: Xlor dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="23-§"
      mavzuNom="Xlor"
      oldingiRaqam="22-§"
      oldingiNom="Galogenlarning davriy sistemadagi o'rni. Atom tuzilishi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
