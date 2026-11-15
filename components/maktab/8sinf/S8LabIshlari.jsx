'use client';
// ============================================================
// JDA KIMYO - 8-SINF, YAKUNIY LABORATORIYA MASHG'ULOTLARI
// "1–10-laboratoriya mashg'ulotlari va sifat reaksiyalari" (200-204-betlar)
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
function KorgazmaLab1Va2() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. 1–2-lab: Amfoter Zn(OH)₂ va Kristall panjaralar"
      ikon="kristall"
      variantlar={[
        {
          id: 'lab1',
          tugma: '1-lab: Zn(OH)₂ vs Cu(OH)₂',
          formula: 'Zn(OH)₂ + HCl / NaOH (eriydi)  |  Cu(OH)₂ faqat HCl da',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '200-bet (1-lab): Amfoter gidroksid Zn(OH)₂ vs asos Cu(OH)₂',
            tenglama: 'Zn(OH)₂ + 2NaOH → Na₂[Zn(OH)₄]   |   Cu(OH)₂ + NaOH → bormaydi',
            ikkiIdish: true,
            suyuqlikRang: '#e2e8f0',
            tolish: 0.72,
            stakanBelgi: 'Na₂[Zn(OH)₄]',
            stakanSarlavha: 'Zn²⁺ + ortiqcha NaOH',
            ikkinchiSuyuqlikRang: '#38bdf8',
            ikkinchiBelgi: 'Cu(OH)₂↓ (erimaydi)',
            ikkinchiSarlavha: 'Cu²⁺ + NaOH',
            chokmaRang: '#0ea5e9',
            chokmaBelgi: 'Havorang Cu(OH)₂↓',
            belgilar: [{ k: 'Amfoterlik', v: 'HCl va ortiqcha NaOH da eriydi', rang: '#34d399' }],
          },
          pastki: ['ZnSO₄ + 2NaOH → oq Zn(OH)₂↓', 'Ortiqcha NaOH da Na₂[Zn(OH)₄] (eriydi)', 'Cu(OH)₂↓ havorang, faqat kislotada eriydi'],
        },
        {
          id: 'lab2',
          tugma: '2-lab: KCl & S₈ panjarasi',
          formula: 'KCl: ionli (KS = 6)  •  S₈: molekulyar toj shakli',
          tur: 'molekula',
          cfg: {
            sarlavha: '200-bet (2-lab): Kristall panjara turlari',
            tenglama: 'K⁺ (6 ta Cl⁻ bilan)  |  Oltingugurt S₈ (8 atomli toj halqa)',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'KCl koordinatsion soni', qiymat: '6 (ionli panjara)', foiz: 85, rang: '#38bdf8' },
              { nom: 'Oltingugurt S₈', qiymat: 'Molekulyar (toj)', foiz: 55, rang: '#fde047' },
              { nom: 'SiO₂ / Olmos', qiymat: 'Atom panjara', foiz: 100, rang: '#a855f7' },
            ],
            belgilar: [{ k: 'KCl panjara', v: 'Qattiq, yuqori Ts', rang: '#34d399' }],
          },
          pastki: ['KCl: har bir K⁺ 6 ta Cl⁻ bilan (KS=6)', 'S₈: toj (kreslo) shaklli halqa', 'Ionli vs molekulyar panjara'],
        },
      ]}
    />
  );
}

function KorgazmaLab3Va4() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 3–4-lab: AgX↓, I₂+Kraxmal va Tuproqda Cl⁻"
      ikon="tomchi"
      variantlar={[
        {
          id: 'lab3',
          tugma: '3-lab: Ag⁺ & Kraxmal',
          formula: 'AgCl↓ (oq), AgBr↓ (och-sariq), AgI↓ (sariq)  |  I₂+kraxmal → ko\'k',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '201-bet (3-lab): Galogenidlar va erkin yod sifat reaksiyasi',
            tenglama: 'Ag⁺ + Cl⁻/Br⁻/I⁻ → AgX↓ (HNO₃ erimaydi)  |  I₂ + kraxmal → ko\'k',
            ikkiIdish: true,
            suyuqlikRang: '#fef08a',
            tolish: 0.72,
            stakanBelgi: 'AgCl / AgBr / AgI',
            stakanSarlavha: 'AgNO₃ + Hal⁻',
            ikkinchiSuyuqlikRang: '#1d4ed8',
            ikkinchiBelgi: 'I₂ + Kraxmal',
            ikkinchiSarlavha: 'Kartoshka/non → ko\'k',
            chokmaRang: '#facc15',
            chokmaBelgi: 'Oq → Och-sariq → Sariq',
            belgilar: [{ k: 'Kraxmal', v: 'Erkin I₂ bilan ko\'k rang', rang: '#60a5fa' }],
          },
          pastki: ['AgCl oq, AgBr och-sariq, AgI sariq', 'Galogenid cho\'kmalar HNO₃ da erimaydi', 'Kartoshka + yod → to\'q ko\'k'],
        },
        {
          id: 'lab4',
          tugma: '4-lab: Tuproq filtrati',
          formula: 'Tuproq + suv → filtrat + AgNO₃ → oq AgCl↓',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '201-bet (4-lab): Sho\'rlangan tuproqda xlorid (Cl⁻) aniqlash',
            tenglama: 'Tuproq filtrati + AgNO₃ → oq suzmasimon AgCl↓ (HNO₃ da erimaydi)',
            suyuqlikRang: '#e2e8f0',
            tolish: 0.74,
            stakanBelgi: 'Filtrat + AgNO₃',
            stakanSarlavha: 'Tuproq tahlili',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'Oq AgCl↓',
            reagentlar: [{ belgi: 'AgNO₃', rang: '#cbd5e1' }],
            belgilar: [{ k: 'Isbot', v: 'Sho\'rlanish: Cl⁻ ioni bor', rang: '#34d399' }],
          },
          pastki: ['Tuproq suvda chayqatilib filtrlanadi', 'AgNO₃ dan oq loyqa → Cl⁻ bor', 'Cho\'kma nitrat kislotada erimaydi'],
        },
      ]}
    />
  );
}

function KorgazmaLab5Va6() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 5–6-lab: Cl₂>Br₂>I₂ va Benzol ekstraksiyasi"
      ikon="filtr"
      variantlar={[
        {
          id: 'lab5',
          tugma: '5-lab: Siqib chiqarish',
          formula: 'Cl₂ > Br₂ > I₂  (teskari reaksiya BORMAYDI!)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '201–202-betlar (5-lab): Galogenlarning oksidlovchi faolligi',
            tenglama: 'Cl₂+2NaBr→Br₂  •  Cl₂+2NaI→I₂  •  Br₂+2NaI→I₂  |  I₂+NaCl ✗',
            ikkiIdish: true,
            suyuqlikRang: '#ea580c',
            tolish: 0.72,
            stakanBelgi: 'Br₂ (to\'q-sariq)',
            stakanSarlavha: 'Cl₂ + 2NaBr',
            ikkinchiSuyuqlikRang: '#78350f',
            ikkinchiBelgi: 'I₂ (qo\'ng\'ir)',
            ikkinchiSarlavha: 'Br₂ + 2NaI',
            reagentlar: [{ belgi: 'Cl₂ / Br₂', rang: '#a3e635' }],
            belgilar: [{ k: 'Qator', v: 'F₂ > Cl₂ > Br₂ > I₂', rang: '#fde047' }],
          },
          pastki: ['Xlor Br₂ va I₂ ni siqib chiqaradi', 'Brom faqat I₂ ni siqib chiqaradi', 'Yod hech birini siqib chiqara olmaydi'],
        },
        {
          id: 'lab6',
          tugma: '6-lab: Benzol ekstraksiya',
          formula: 'Suv (och sariq) + Benzol → Yuqori qatlam BINAFSHA I₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '202-bet (6-lab): Qutbsiz yodning benzol qatlamiga o\'tishi',
            tenglama: 'I₂ (suvda oz) + C₆H₆ (benzol) → Yuqorida to\'q-binafsha I₂ qatlami',
            ikkiIdish: true,
            suyuqlikRang: '#fef08a',
            tolish: 0.65,
            stakanBelgi: 'I₂ + H₂O',
            stakanSarlavha: 'Suvda (och sariq)',
            ikkinchiSuyuqlikRang: '#7e22ce',
            ikkinchiBelgi: 'I₂ / Benzol (yuqori)',
            ikkinchiSarlavha: 'Ekstraksiya (binafsha)',
            belgilar: [{ k: 'Sabab', v: '"O\'xshash o\'xshashda eriydi"', rang: '#a855f7' }],
          },
          pastki: ['Qutbsiz I₂ suvda juda kam eriydi', 'Benzol (C₆H₆) ga chayqatilsa o\'tadi', 'Yuqori qatlam binafsha, pastki suv rangsiz'],
        },
      ]}
    />
  );
}

function KorgazmaLab7Va8() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 7–8-lab: Oltingugurt minerallari va BaSO₄↓"
      ikon="kolba"
      variantlar={[
        {
          id: 'lab7',
          tugma: '7-lab: S, FeS₂, ZnS, Gips',
          formula: 'Sof S  •  Pirit FeS₂  •  Sfalerit ZnS  •  Gips CaSO₄·2H₂O',
          tur: 'molekula',
          cfg: {
            sarlavha: '202-bet (7-lab): Tabiiy oltingugurt va minerallar',
            tenglama: 'S (namlanmaydi, suvda qalqiydi)  |  FeS₂  |  ZnS  |  CaSO₄·2H₂O',
            rejim: 'kristall',
            kristallTuri: 'molekula',
            metrikalar: [
              { nom: 'Pirit (kolchedan)', qiymat: 'FeS₂ (oltinsimon kub)', foiz: 80, rang: '#fde047' },
              { nom: 'Rux aldamasi (sfalerit)', qiymat: 'ZnS (sulfid)', foiz: 65, rang: '#fb923c' },
              { nom: 'Gips (sulfat)', qiymat: 'CaSO₄·2H₂O (oq)', foiz: 50, rang: '#e2e8f0' },
            ],
            belgilar: [{ k: 'Sof S', v: 'Suv yuzida qalqiydi (flotatsiya)', rang: '#fde047' }],
          },
          pastki: ['Pirit FeS₂, rux aldamasi ZnS', 'Gips CaSO₄·2H₂O', 'Sof S suvda ho\'llanmay yuzida turadi'],
        },
        {
          id: 'lab8',
          tugma: '8-lab: Ba²⁺ + SO₄²⁻ → BaSO₄↓',
          formula: 'H₂SO₄, Na₂SO₄, CuSO₄, Al₂(SO₄)₃ + BaCl₂ → oq BaSO₄↓',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '202–203-betlar (8-lab): Sulfat ioniga (SO₄²⁻) umumiy sifat testi',
            tenglama: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓ (oq, kislota va ishqorda ERIMAYDI!)',
            suyuqlikRang: '#dbeafe',
            tolish: 0.72,
            stakanBelgi: 'SO₄²⁻ + BaCl₂',
            stakanSarlavha: '4 ta sulfatda bir xil',
            chokmaRang: '#ffffff',
            chokmaBelgi: 'Oq BaSO₄↓',
            reagentlar: [{ belgi: 'BaCl₂', rang: '#93c5fd' }],
            belgilar: [{ k: 'Farqi', v: 'HCl / HNO₃ da erimaydi!', rang: '#34d399' }],
          },
          pastki: ['4 ta sulfatda bir xil oq cho\'kma', 'Ba²⁺ + SO₄²⁻ = BaSO₄↓', 'Kislota va ishqorda erimaydi'],
        },
      ]}
    />
  );
}

function KorgazmaLab9Va10() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 9–10-lab: NH₃ olish (1,5:1) va O&apos;g&apos;it namunalari"
      ikon="harorat"
      variantlar={[
        {
          id: 'lab9',
          tugma: '9-lab: NH₃↑ & Oq tutun',
          formula: '1,5 NH₄Cl + 1 Ca(OH)₂ → 2NH₃↑  |  + HCl → NH₄Cl tutun',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '203–204-betlar (9-lab): NH₃ yig\'ish (og\'zi PASTGA), favvora va tutun',
            tenglama: '2NH₄Cl+Ca(OH)₂ → 2NH₃↑  |  Fenolftalein → MALINA  |  +HCl → oq NH₄Cl',
            ikkiIdish: true,
            suyuqlikRang: '#cbd5e1',
            tolish: 0.5,
            stakanBelgi: 'NH₄Cl+Ca(OH)₂',
            stakanSarlavha: 'Og\'zi pastga yig\'ish',
            ikkinchiSuyuqlikRang: '#ec4899',
            ikkinchiBelgi: 'NH₄OH (Malina)',
            ikkinchiSarlavha: 'Suvda 700:1 + HCl tutun',
            gazRang: '#f8fafc',
            gazBelgi: 'NH₄Cl tutun',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 160,
            maxTemp: 250,
            belgilar: [{ k: 'Nisbat', v: '1,5 g NH₄Cl : 1 g Ca(OH)₂', rang: '#34d399' }],
          },
          pastki: ['1,5 : 1 nisbat, quruq probirka og\'zi PASTGA', 'Suv + fenolftalein → MALINA rang', 'Kons. HCl tayoqchasi → oq NH₄Cl tutun'],
        },
        {
          id: 'lab10',
          tugma: '10-lab: O\'g\'it namunalari',
          formula: 'NH₄NO₃ • CO(NH₂)₂ • Superfosfat • Fosforit • KCl',
          tur: 'biogen',
          cfg: {
            sarlavha: '204-bet (10-lab): Mineral o\'g\'it namunalarini solishtirish',
            tenglama: 'Tashqi ko\'rinish, kristall/granula, suvda erish va NaOH bilan NH₃ hidi',
            markazBelgi: '10-lab',
            markazRang: '#fde047',
            tugunlar: [
              { nom: 'Azotli (oq kristall)', belgi: 'NH₄NO₃/CO(NH₂)₂', rang: '#38bdf8' },
              { nom: 'Fosforli (kulrang)', belgi: 'Superfosfat', rang: '#94a3b8' },
              { nom: 'Kaliyli (pushti/oq)', belgi: 'KCl (Silvinit)', rang: '#fb7185' },
              { nom: 'Xavfsizlik', belgi: 'Qo\'l yuvish & tartib', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Test', v: 'NH₄⁺ + NaOH → NH₃ hidi', rang: '#fbbf24' }],
          },
          pastki: ['Azotli: oq kristall/granula, eriydi', 'Fosforit erimaydi; superfosfat qisman', 'Ishdan so\'ng qo\'llar sovunlab yuviladi'],
        },
      ]}
    />
  );
}

function KorgazmaSifatXulosa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 8-sinf Sifat reaksiyalari yakuniy xaritasi"
      ikon="kubok"
      variantlar={[
        {
          id: 'anionlar',
          tugma: 'Anionlar (6 ta)',
          formula: 'Cl⁻/Br⁻/I⁻ + Ag⁺  •  SO₄²⁻ + Ba²⁺  •  PO₄³⁻ + Ag⁺  •  NO₃⁻ + Cu',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Anionlarning barcha asosiy sifat reaksiyalari',
            tenglama: 'AgCl(oq), AgBr(och-sariq), AgI(sariq)  |  BaSO₄(oq)  |  Ag₃PO₄(sariq)  |  NO₂↑',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Cl⁻ / Br⁻ / I⁻ (+Ag⁺)', qiymat: 90, yorliq: 'HNO₃ erimaydi', rang: '#fde047' },
              { nom: 'SO₄²⁻ (+Ba²⁺)', qiymat: 100, yorliq: 'BaSO₄↓ erimaydi', rang: '#38bdf8' },
              { nom: 'PO₄³⁻ (+Ag⁺)', qiymat: 70, yorliq: 'Ag₃PO₄↓ (HNO₃ eriydi)', rang: '#fbbf24' },
              { nom: 'NO₃⁻ (+H₂SO₄+Cu)', qiymat: 55, yorliq: 'Qo\'ng\'ir NO₂↑', rang: '#f97316' },
            ],
            belgilar: [{ k: 'AgI vs Ag₃PO₄', v: 'Ag₃PO₄ HNO₃ da eriydi!', rang: '#34d399' }],
          },
          pastki: ['Galogenidlar + Ag⁺: HNO₃ da erimaydi', 'SO₄²⁻ + Ba²⁺ → oq BaSO₄↓ (erimaydi)', 'PO₄³⁻ + Ag⁺ → sariq Ag₃PO₄↓ (HNO₃ eriydi)'],
        },
        {
          id: 'kation_i2',
          tugma: 'NH₄⁺, Zn²⁺, Cu²⁺ & I₂',
          formula: 'NH₄⁺→NH₃↑  •  Zn(OH)₂(amfoter)  •  Cu(OH)₂(ko\'k)  •  I₂+kraxmal',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Kationlar va erkin yod (I₂) sifat reaksiyalari',
            tenglama: 'NH₄⁺ + NaOH → NH₃↑ (HCl tutun)   |   I₂ + kraxmal → ko\'k rang',
            markazBelgi: 'SIFAT',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'NH₄⁺ + NaOH', belgi: 'NH₃↑ + lakmus ko\'k', rang: '#38bdf8' },
              { nom: 'Zn²⁺ + NaOH', belgi: 'Zn(OH)₂ (eriydi)', rang: '#e2e8f0' },
              { nom: 'Cu²⁺ + NaOH', belgi: 'Cu(OH)₂↓ (ko\'k)', rang: '#0ea5e9' },
              { nom: 'I₂ + Kraxmal', belgi: 'To\'q ko\'k rang', rang: '#1d4ed8' },
            ],
            belgilar: [{ k: 'NH₃ + HCl', v: 'Oq tutun NH₄Cl', rang: '#f8fafc' }],
          },
          pastki: ['NH₄⁺: o\'tkir hid, qizil lakmusni ko\'kartiradi', 'Zn(OH)₂ oq (amfoter); Cu(OH)₂ havorang', 'Erkin I₂ kraxmalni ko\'kartiradi'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (44-§) VA O'YINLAR (1–10-LAB)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Tirik organizm (<0,01%) uchun 10 ta hayotiy MIKROBIOGEN element:',
    variantlar: [
      { matn: 'Si, Al, Na, Cl', togri: false },
      { matn: 'C, H, O, N, Ca', togri: false },
      { matn: 'Fe, Mn, Co, Cu, Mo, Zn, F, Br, I, B', togri: true },
      { matn: 'Au, Pt, Hg, Pb', togri: false },],
    izoh: 'Fe, Mn, Co, Cu, Mo, Zn, F, Br, I, B — 10 ta mikrobiogen element.',
  },
  {
    id: 't2',
    savol: '"Ferrostimulator" preparatini yaratgan o\'zbekistonlik olimlar:',
    variantlar: [
      { matn: 'I.R.Asqarov va Sh.M.Qirg\'izov', togri: true },
      { matn: 'Yu.Libix va A.Fersman', togri: false },
      { matn: 'X.Brendt va A.Shretter', togri: false },
      { matn: 'P.Bridjmen', togri: false },],
    izoh: 'I.R.Asqarov va Sh.M.Qirg\'izov temir birikmalari asosida yaratgan.',
  },
  {
    id: 't3',
    savol: 'Bug\'doyni +37%, paxtani +7 s/ga oshiruvchi va tish emalini mustahkamlovchi elementlar:',
    variantlar: [
      { matn: 'N va K', togri: false },
      { matn: 'Br va Na', togri: false },
      { matn: 'Si va Al', togri: false },
      { matn: 'Molibden (Mo) va Ftor (F)', togri: true },],
    izoh: 'Lampochka chiqindisi Mo (+37% bug\'doy); tish emali Ca₅(PO₄)₃F.',
  },
  {
    id: 't4',
    savol: '16 g CuSO₄ + 4,8 g Fe reaksiyasidan necha gramm mis ajraladi?',
    variantlar: [
      { matn: '6,4 g', togri: false },
      { matn: '5,49 g (cheklovchi Fe = 0,0857 mol)', togri: true },
      { matn: '3,2 g', togri: false },
      { matn: '16 g', togri: false },],
    izoh: '0,0857 mol Fe < 0,10 mol CuSO₄ → 0,0857·64 = 5,49 g Cu.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'lab_1_4', nom: '1–4-lab: Amfoter & Hal', tavsif: 'Zn(OH)₂, KCl, AgX↓, tuproq' },
    { id: 'lab_5_8', nom: '5–8-lab: Hal & Sulfat', tavsif: 'Cl₂>Br₂>I₂, benzol, BaSO₄↓' },
    { id: 'lab_9_10', nom: '9–10-lab: NH₃ & O\'g\'it', tavsif: '1,5:1, malina, NH₄Cl, namunalar' },
  ],
  topshiriqlar: [
    { nom: 'Zn(OH)₂: HCl va NaOH da eriydi', qisqa: '1-lab: Amfoterlik isboti', guruh: 'lab_1_4', izoh: 'Cu(OH)₂ faqat HCl da eriydi.' },
    { nom: 'KCl (KS=6) va toj shaklli S₈', qisqa: '2-lab: Kristall panjara', guruh: 'lab_1_4', izoh: 'Ionli va molekulyar panjara.' },
    { nom: 'AgCl(oq), AgBr, AgI + tuproq Cl⁻', qisqa: '3–4-lab: AgNO₃ va kraxmal', guruh: 'lab_1_4', izoh: 'I₂ + kraxmal → ko\'k rang.' },
    { nom: 'Cl₂+2NaBr→Br₂; Br₂+2NaI→I₂', qisqa: '5-lab: Aktivlik qatori', guruh: 'lab_5_8', izoh: 'I₂ teskari siqib chiqara olmaydi.' },
    { nom: 'I₂ + Benzol → yuqorida binafsha', qisqa: '6-lab: Ekstraksiya usuli', guruh: 'lab_5_8', izoh: 'Qutbsiz I₂ organik qatlamda.' },
    { nom: 'FeS₂, ZnS, Gips & oq BaSO₄↓', qisqa: '7–8-lab: Minerallar & SO₄²⁻', guruh: 'lab_5_8', izoh: 'BaSO₄ kislotada erimaydi.' },
    { nom: '1,5 NH₄Cl : 1 Ca(OH)₂ → NH₃↑', qisqa: '9-lab: Og\'zi pastga yig\'ish', guruh: 'lab_9_10', izoh: 'Havo dan yengil gaz.' },
    { nom: 'Fenolftalein → Malina; +HCl → tutun', qisqa: '9-lab: Ishqor & NH₄Cl', guruh: 'lab_9_10', izoh: 'Suvda tez eriydi.' },
    { nom: 'NH₄NO₃, Superfosfat, KCl qiyosi', qisqa: '10-lab: O\'g\'it namunalari', guruh: 'lab_9_10', izoh: 'Eruvchanlik va NaOH bilan hid.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '1-lab',
    savol: 'Zn(OH)₂ amfoterligi Cu(OH)₂ dan nimasi bilan isbotlanadi?',
    variantlar: ['Zn(OH)₂ havorang', 'Ikkalasi NaOH da eriydi', 'Zn(OH)₂ HCl va ortiqcha NaOH da eriydi; Cu(OH)₂ faqat HCl da', 'Erimaydi'],
    togri: 2,
    izoh: 'Na₂[Zn(OH)₄] kompleks tuzi hosil bo\'ladi.',
  },
  {
    belgi: '3-lab',
    savol: 'AgNO₃ bilan Cl⁻, Br⁻, I⁻ ranglari va I₂ + kraxmal:',
    variantlar: ['AgCl oq, AgBr och-sariq, AgI sariq; kraxmal ko\'k', 'Hammasi oq', 'Qizil va yashil', 'Ko\'k cho\'kma'],
    togri: 0,
    izoh: 'Galogenidlar HNO₃ da erimaydi; kraxmal I₂ bilan ko\'karadi.',
  },
  {
    belgi: '6-lab',
    savol: 'I₂ ning suvli eritmasiga benzol quyib chayqatilsa?',
    variantlar: ['Yod yo\'qoladi', 'Oq cho\'kma tushadi', 'Pastga cho\'kadi', 'Yuqorigi benzol qatlami to\'q-binafsha rangga kiradi'],
    togri: 3,
    izoh: 'Ekstraksiya: qutbsiz I₂ benzol qatlamiga o\'tadi.',
  },
  {
    belgi: '8-lab',
    savol: 'H₂SO₄, Na₂SO₄, CuSO₄, Al₂(SO₄)₃ + BaCl₂ umumiy reaksiyasi:',
    variantlar: ['H₂ chiqadi', 'Kislota/ishqorda erimaydigan oq BaSO₄↓', 'Eritma qiziydi', 'Sariq cho\'kma'],
    togri: 1,
    izoh: 'Ba²⁺ + SO₄²⁻ = BaSO₄↓ — sulfat ionining sifat reaksiyasi.',
  },
  {
    belgi: '9-lab',
    savol: 'Ammiak olishda NH₄Cl:Ca(OH)₂ nisbati va probirka holati:',
    variantlar: ['1 : 10; og\'zi tepaga', '1,5 : 1; probirka og\'zi PASTGA qaratiladi', 'Suv ostida', '1 : 5; ochiq'],
    togri: 1,
    izoh: 'NH₃ havodan yengil (17 < 29), shuning uchun og\'zi pastga.',
  },
  {
    belgi: '5-lab',
    savol: 'Qaysi reaksiya 5-laboratoriya ishida AMALGA OSHMAYDI?',
    variantlar: ['Cl₂ + 2NaBr → Br₂', 'Br₂ + 2NaI → I₂', 'Cl₂ + 2NaI → I₂', 'I₂ + 2NaCl → Cl₂ + 2NaI'],
    togri: 3,
    izoh: 'Aktivlik F₂ > Cl₂ > Br₂ > I₂; kuchsiz I₂ Cl⁻ ni siqib chiqara olmaydi.',
  },
  {
    belgi: '7-lab',
    savol: 'Pirit, rux aldamasi va gips minerallari formulalari:',
    variantlar: ['FeS₂, ZnS, CaSO₄·2H₂O', 'CuS, PbS, BaSO₄', 'FeSO₄, ZnO, CaCO₃', 'Fe₂O₃, ZnCl₂'],
    togri: 0,
    izoh: '7-lab jadvali: FeS₂, ZnS, CaSO₄·2H₂O.',
  },
  {
    belgi: '2-lab',
    savol: 'KCl da K⁺ koordinatsion soni va S₈ molekulasi shakli:',
    variantlar: ['KS=2; chiziqli', 'KS=4; uchburchak', 'KS=6 (ionli panjara); S₈ toj (kreslo) shaklli', 'KS=8; kub'],
    togri: 2,
    izoh: '200-bet (2-lab): har K⁺ 6 ta Cl⁻ bilan o\'ralgan.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '9-lab (203-bet): NH₃ olish va tutun',
    vazifa: 'Tajriba bosqichlarini tartiblang:',
    tartib: [
      '1. 1,5:1 NH₄Cl + Ca(OH)₂ qizdiriladi',
      '2. NH₃ gazi og\'zi pastga probirkaga yig\'iladi',
      '3. Fenolftaleinli suvda malina rang hosil bo\'ladi',
      '4. Kons. HCl tayoqchada oq NH₄Cl tutuni chiqadi',
    ],
    variantlar: [
      '3. Fenolftaleinli suvda malina rang hosil bo\'ladi',
      '1. 1,5:1 NH₄Cl + Ca(OH)₂ qizdiriladi',
      '4. Kons. HCl tayoqchada oq NH₄Cl tutuni chiqadi',
      '2. NH₃ gazi og\'zi pastga probirkaga yig\'iladi',
    ],
  },
  {
    tur: '5–6-lab: Galogenlar va ekstraksiya',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. NaBr va NaI ga xlor suvi (Cl₂) quyiladi',
      '2. Cl₂ → Br₂ va Cl₂ → I₂ siqib chiqaradi',
      '3. Yodli eritmaga benzol qo\'shib chayqatiladi',
      '4. Yuqorida binafsha I₂-benzol qatlami ajraladi',
    ],
    variantlar: [
      '2. Cl₂ → Br₂ va Cl₂ → I₂ siqib chiqaradi',
      '4. Yuqorida binafsha I₂-benzol qatlami ajraladi',
      '1. NaBr va NaI ga xlor suvi (Cl₂) quyiladi',
      '3. Yodli eritmaga benzol qo\'shib chayqatiladi',
    ],
  },
  {
    tur: 'Anionlarni ketma-ket aniqlash',
    vazifa: 'Tahlil tartibini tuzing:',
    tartib: [
      '1. BaCl₂ → kislotada erimaydigan oq BaSO₄↓',
      '2. AgNO₃ → oq AgCl↓, och-sariq AgBr↓, sariq AgI↓',
      '3. Kraxmal → erkin I₂ bilan ko\'k rang',
      '4. Tuproq filtratida AgNO₃ → oq AgCl↓ (Cl⁻)',
    ],
    variantlar: [
      '3. Kraxmal → erkin I₂ bilan ko\'k rang',
      '4. Tuproq filtratida AgNO₃ → oq AgCl↓ (Cl⁻)',
      '1. BaCl₂ → kislotada erimaydigan oq BaSO₄↓',
      '2. AgNO₃ → oq AgCl↓, och-sariq AgBr↓, sariq AgI↓',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '4-lab: Tuproq filtratida Cl⁻ ni aniqlash reaktivi:',
    variantlar: ['BaCl₂', 'AgNO₃ → oq AgCl↓', 'NaOH', 'Fenolftalein'],
    togri: 1,
    izoh: 'Ag⁺ + Cl⁻ = AgCl↓ (HNO₃ da erimaydi).',
  },
  {
    savol: '3-lab: Kartoshka bo\'lagiga yod tomizilsa qanday rang chiqadi?',
    variantlar: ['Sariq', 'Malina', 'Yashil', 'To\'q ko\'k (yod + kraxmal)'],
    togri: 3,
    izoh: 'Erkin I₂ kraxmalni ko\'kartiradi.',
  },
  {
    savol: '8-lab: Barcha sulfatlar (SO₄²⁻) uchun sifat reaktivi:',
    variantlar: ['BaCl₂ (Ba²⁺ → oq BaSO₄↓)', 'HCl', 'AgNO₃', 'Kraxmal'],
    togri: 0,
    izoh: 'Kislotalarda erimaydigan oq BaSO₄↓ tushadi.',
  },
  {
    savol: '9-lab: NH₃ gaziga HCl tayoqcha tutilsa:',
    variantlar: ['Qo\'ng\'ir gaz', 'Portlaydi', 'Qalin oq tutun (NH₄Cl)', 'Moviy eritma'],
    togri: 2,
    izoh: 'NH₃ + HCl = NH₄Cl (qattiq zarrachalar).',
  },
  {
    savol: '1-lab: Ortiqcha NaOH quyilganda oq Zn(OH)₂↓:',
    variantlar: ['Havorang bo\'ladi', 'Qorayadi', 'Erib Na₂[Zn(OH)₄] beradi (amfoter)', 'Erimaydi'],
    togri: 2,
    izoh: 'Zn(OH)₂ + 2NaOH = Na₂[Zn(OH)₄].',
  },
  {
    savol: '5-lab: Brom suvi (Br₂) qaysi galogenni siqib chiqaradi?',
    variantlar: ['Yodid (I⁻ → I₂)', 'Xlorid (Cl⁻)', 'Ftorid (F⁻)', 'Hech birini'],
    togri: 0,
    izoh: 'Br₂ faqat I₂ dan kuchliroq.',
  },
  {
    savol: '6-lab: Suvdan I₂ ni benzolga o\'tkazish usuli:',
    variantlar: ['Haydash', 'Ekstraksiya', 'Sublimatsiya', 'Cho\'ktirish'],
    togri: 1,
    izoh: 'Benzol qutbsiz yodni tortib oladi.',
  },
  {
    savol: '7-lab: Rux aldamasi va pirit formulalari:',
    variantlar: ['ZnO va FeO', 'ZnSO₄ va Fe₂O₃', 'ZnCl₂ va FeS', 'ZnS va FeS₂'],
    togri: 3,
    izoh: 'ZnS (sfalerit) va FeS₂ (pirit).',
  },
];

export default function S8LabIshlari() {
  const korgazmalar = [
    { nom: '1. 1–2-lab: Amfoter & Panjara', ikon: 'kristall', komponent: <KorgazmaLab1Va2 /> },
    { nom: '2. 3–4-lab: Ag⁺, I₂ & Tuproq', ikon: 'tomchi', komponent: <KorgazmaLab3Va4 /> },
    { nom: '3. 5–6-lab: Galogen & Benzol', ikon: 'filtr', komponent: <KorgazmaLab5Va6 /> },
    { nom: '4. 7–8-lab: Minerallar & BaSO₄↓', ikon: 'kolba', komponent: <KorgazmaLab7Va8 /> },
    { nom: '5. 9–10-lab: NH₃ & O\'g\'itlar', ikon: 'harorat', komponent: <KorgazmaLab9Va10 /> },
    { nom: '6. Barcha sifat reaksiyalari', ikon: 'kubok', komponent: <KorgazmaSifatXulosa /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-lab"
          nom="1–10-lab tajribalarini guruhlang"
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
          key="tezkor-lab"
          nom="1–10-lab: Sifat tahlili"
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
          key="zanjir-lab"
          nom="Tajriba bosqichlari zanjiri"
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
          key="duel-lab"
          sarlavha="Yakuniy laboratoriya dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="Lab"
      mavzuNom="1–10-laboratoriya mashg'ulotlari va sifat reaksiyalari"
      oldingiRaqam="44-§"
      oldingiNom="Biogen elementlar va ularning tirik organizmlardagi ahamiyati"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
