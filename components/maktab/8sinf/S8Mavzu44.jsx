'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 44-PARAGRAF
// "Biogen elementlar va ularning tirik organizmlardagi ahamiyati" (193-199-betlar)
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
function KorgazmaMakroMikrobiogen() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Makrobiogen (98% / 99,1% / 99,4%) va 10 Mikrobiogen"
      ikon="atom"
      variantlar={[
        {
          id: 'makrobiogen',
          tugma: 'Yer, O\'simlik & Inson',
          formula: 'Yer: 98% (8 el) • O\'simlik: 99,1% (7 el) • Inson: 99,4% (H,O,C,N,Ca)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '193–194-betlar: Tabiat va tirik organizmlarning makrobiogen asosi',
            tenglama: 'Inson (99,4%): H, O, C, N, Ca  |  Ca ning 99% suyakda, 1% qonda',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Yer (O,Si,Al,Fe,Ca,Na,K,Mn)', qiymat: 98, yorliq: '98,0% (8 el.)', rang: '#fbbf24' },
              { nom: 'O\'simlik (O,C,H,Na,K,Ca,Si)', qiymat: 99, yorliq: '99,1% (7 el.)', rang: '#34d399' },
              { nom: 'Inson (H, O, C, N, Ca)', qiymat: 99.4, yorliq: '99,4% (5 el.)', rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Ca taqsimoti', v: '99% suyak/tish, 1% qon', rang: '#f8fafc' }],
          },
          pastki: ['Yer po\'stlog\'i: 8 el = 98%', 'O\'simlik: 7 el = 99,1%', 'Inson: H,O,C,N,Ca = 99,4%'],
        },
        {
          id: 'mikrobiogen',
          tugma: '10 Mikrobiogen (<0,01%)',
          formula: 'Fe, Mn, Co, Cu, Mo, Zn, F, Br, I, B',
          tur: 'biogen',
          cfg: {
            sarlavha: '10 ta hayotiy zarur mikrobiogen element (<0,01%)',
            tenglama: 'Metalllar (Fe,Mn,Co,Cu,Mo,Zn) + Metallmaslar (F,Br,I,B)',
            markazBelgi: '<0,01%',
            markazRang: '#a855f7',
            tugunlar: [
              { nom: 'Qon & Vit B₁₂', belgi: 'Fe, Co', rang: '#ef4444' },
              { nom: 'Vitamin C & O\'sish', belgi: 'Mn, Zn, Cu', rang: '#34d399' },
              { nom: 'Hosil (+Mo) & Bor', belgi: 'Mo, B', rang: '#fbbf24' },
              { nom: 'Emal, Nerv, Tiroksin', belgi: 'F, Br, I', rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Soni', v: '10 ta mikrobiogen element', rang: '#a855f7' }],
          },
          pastki: ['Fe, Mn, Co, Cu, Mo, Zn', 'F, Br, I, B', 'Miqdori < 0,01%, roli beqiyos'],
        },
      ]}
    />
  );
}

function KorgazmaOlimlarFeMnCo() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. O&apos;zbekiston olimlari va Fe, Mn, Co ahamiyati"
      ikon="yurak"
      variantlar={[
        {
          id: 'olimlar',
          tugma: 'Asqarov, Qirg\'izov & Sharipov',
          formula: '"Ferrostimulator" • "Askalsiy" • Noyob metall ajratish',
          tur: 'biogen',
          cfg: {
            sarlavha: '194–195-betlar: O\'zbekiston olimlarining biostimulyatorlari',
            tenglama: 'I.R.Asqarov & Sh.M.Qirg\'izov ("Ferrostimulator")  |  X.T.Sharipov (chiqindidan metall)',
            markazBelgi: 'UZ-BIO',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'I.R.Asqarov', belgi: 'Ferrostimulator', rang: '#ef4444' },
              { nom: 'Sh.M.Qirg\'izov', belgi: 'Paxta/Chorva', rang: '#34d399' },
              { nom: 'Kalsiy preparati', belgi: '"Askalsiy"', rang: '#38bdf8' },
              { nom: 'X.T.Sharipov', belgi: 'Noyob metall', rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Yutuq', v: 'Paxtachilik & chorvachilikda', rang: '#34d399' }],
          },
          pastki: ['I.R.Asqarov, Sh.M.Qirg\'izov: "Ferrostimulator"', '"Askalsiy" biostimulyatori', 'X.T.Sharipov: chiqindidan noyob metall'],
        },
        {
          id: 'fe_mn_co',
          tugma: 'Fe, Mn va Co',
          formula: 'Fe: gemoglobin  |  Mn: Vit C (+3–4 s/ga)  |  Co: Vit B₁₂ (+3–4 s/ga)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Temir, Marganes va Kobaltning qon va hosildagi roli',
            tenglama: 'Mn: qulupnay +3, bug\'doy +3–4, chigit +2 s/ga  |  Co: B₁₂, g\'o\'za +3–4 s/ga',
            markazBelgi: 'Fe Mn Co',
            markazRang: '#ef4444',
            tugunlar: [
              { nom: 'Temir (Fe)', belgi: 'Gemoglobin O₂', rang: '#ef4444' },
              { nom: 'Marganes (Mn)', belgi: 'Vit C (+3–4 s/ga)', rang: '#a855f7' },
              { nom: 'Kobalt (Co)', belgi: 'Vit B₁₂, DNK', rang: '#38bdf8' },
              { nom: 'Uzum & G\'o\'za', belgi: 'Qand ↑ (+Co)', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Fe tanqisligi', v: 'Kamqonlik (anemiya)', rang: '#fb7185' }],
          },
          pastki: ['Fe yetishmasa kamqonlik (anemiya)', 'Mn askorbin kislota (vit C) sintezini oshiradi', 'Co B₁₂ vitamini tarkibida, uzumda qandni oshiradi'],
        },
      ]}
    />
  );
}

function KorgazmaCuZnMoFBrI() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Cu, Zn, Mo (lampochka chiqindisi!) va F, Br, I"
      ikon="uchqun"
      variantlar={[
        {
          id: 'cu_zn_mo',
          tugma: 'Cu, Zn & Mo (+37%)',
          formula: 'Cu: Fe & xlorofill  |  Zn: barg oqarishi  |  Mo: bug\'doy +37%, paxta +7 s/ga',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Lampochka zavodi Mo chiqindisining hosildorlikka ta\'siri',
            tenglama: 'Cu yetishmasa quriydi  |  Zn yetishmasa barg oqaradi  |  Mo hosilni keskin oshiradi',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Qandlavlagi (+Mo)', qiymat: 20, yorliq: '+20%', rang: '#fbbf24' },
              { nom: 'Zig\'ir (+Mo)', qiymat: 25, yorliq: '+25%', rang: '#38bdf8' },
              { nom: 'Bug\'doy (+Mo)', qiymat: 37, yorliq: '+37%', rang: '#34d399' },
              { nom: 'Paxta (+Mo)', qiymat: 70, yorliq: '+7 s/ga', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Manba', v: 'Elektr lampochka zavodi Mo chiqindisi', rang: '#34d399' }],
          },
          pastki: ['Cu: pigmentatsiya va Fe o\'zlashtirishi', 'Zn yetishmasa sitrus/makkajo\'xori oqaradi', 'Mo: bug\'doy +37%, paxta +7 s/ga, zig\'ir +25%'],
        },
        {
          id: 'f_br_i',
          tugma: 'F, Br va I (Inson)',
          formula: 'F: emal (karies!)  |  Br: nerv muvozanat  |  I: tiroksin (bo\'qoq!)',
          tur: 'biogen',
          cfg: {
            sarlavha: '197-bet: Ftor, Brom va Yodning inson organizmidagi roli',
            tenglama: 'F: Ca₅(PO₄)₃F (karies oldi)  •  Br: nerv tizimi  •  I: qalqonsimon bez',
            markazBelgi: 'F Br I',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Ftor (F — tish)', belgi: 'Ca₅(PO₄)₃F', rang: '#f8fafc' },
              { nom: 'Brom (Br — nerv)', belgi: 'Tinchlantirish', rang: '#fb923c' },
              { nom: 'Yod (I — tiroksin)', belgi: 'O\'sish, bo\'qoq!', rang: '#a855f7' },
              { nom: 'Aqliy rivojlanish', belgi: 'Jinsiy yetilish (I)', rang: '#34d399' },
            ],
            belgilar: [{ k: 'I yetishmasa', v: 'Bo\'qoq (zob) kasalligi', rang: '#ef4444' }],
          },
          pastki: ['F: suyak va tish emali (karies profilaktika)', 'Br: oliy nerv tizimi muvozanati', 'I: qalqonsimon bez (tiroksin), bo\'qoq oldi'],
        },
      ]}
    />
  );
}

function Korgazma5AmaliyIsh() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 5-amaliy ish: O&apos;g&apos;itlarni aniqlash (25-jadval)"
      ikon="kolba"
      variantlar={[
        {
          id: 'alanga',
          tugma: 'Eruvchanlik & Alanga',
          formula: 'Ca₃(PO₄)₂ erimaydi  |  Na⁺: SARIQ  |  K⁺: BINAFSHA',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '199-bet 5-amaliy ish: Suvda erish va alanga rangi',
            tenglama: 'NaNO₃ → sariq alanga  |  KCl, KNO₃ → binafsha alanga  |  Fosforit → erimaydi',
            ikkiIdish: true,
            suyuqlikRang: '#fde047',
            tolish: 0.65,
            stakanBelgi: 'Na⁺ (Sariq)',
            stakanSarlavha: 'NaNO₃ (sariq)',
            ikkinchiSuyuqlikRang: '#a855f7',
            ikkinchiBelgi: 'K⁺ (Binafsha)',
            ikkinchiSarlavha: 'KCl (binafsha)',
            qizdir: true,
            olovRang: '#eab308',
            tempC: 450,
            maxTemp: 600,
            belgilar: [{ k: 'Erimaydi', v: 'Fosforit talqoni Ca₃(PO₄)₂', rang: '#94a3b8' }],
          },
          pastki: ['1) Suvda eruvchanlik (fosforit erimaydi)', '2) Na⁺ → sariq; K⁺ → binafsha alanga', '3) Anion va kation sifat testlari'],
        },
        {
          id: 'sifat_25',
          tugma: '25-jadval testlari',
          formula: 'NH₄⁺+NaOH → NH₃↑  |  SO₄²⁻+Ba²⁺ → BaSO₄↓  |  Cl⁻+Ag⁺ → AgCl↓',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'NH₄NO₃, (NH₄)₂SO₄ va KCl ni ajratish (199-bet)',
            tenglama: 'NH₄NO₃: faqat NH₃↑  |  (NH₄)₂SO₄: NH₃↑ + BaSO₄↓  |  KCl: binafsha + AgCl↓',
            suyuqlikRang: '#cbd5e1',
            tolish: 0.72,
            stakanBelgi: '(NH₄)₂SO₄ / KCl',
            stakanSarlavha: 'BaCl₂ & AgNO₃ testi',
            gazRang: '#34d399',
            gazBelgi: 'NH₃↑',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'BaSO₄↓ / AgCl↓',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 85,
            maxTemp: 150,
            belgilar: [{ k: 'NH₄NO₃', v: 'Ba²⁺/Ag⁺ bilan cho\'kmasiz', rang: '#38bdf8' }],
          },
          pastki: ['NH₄NO₃: NaOH bilan NH₃↑, cho\'kmasiz', '(NH₄)₂SO₄: NH₃↑ + oq BaSO₄↓', 'KCl: binafsha alanga + oq AgCl↓'],
        },
      ]}
    />
  );
}

function Korgazma44MasalalarA() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 198-bet 1–2-masalalar: 10²¹ H₂O va 5,49 g Cu"
      ikon="formula"
      variantlar={[
        {
          id: 'tomchi',
          tugma: '1-masala: 10²¹ molekula',
          formula: '0,03 ml suv (ρ=1) → 0,00167 mol → 1,003 · 10²¹ ta H₂O',
          tur: 'hisob',
          cfg: {
            sarlavha: '198-bet 1-masala: 0,03 ml suv tomchisidagi molekulalar soni',
            tenglama: 'm = 0,03 g   |   n = 0,03 / 18 = 0,001667 mol   |   N = n · 6,02·10²³',
            qadamlar: [
              { belgi: 'm(H₂O) = V·ρ', natija: '0,03 g', izoh: '0,03 ml · 1 g/ml', rang: '#38bdf8' },
              { belgi: 'n = 0,03 / 18', natija: '0,001667 mol', izoh: 'M(H₂O) = 18', rang: '#fbbf24' },
              { belgi: 'N = n · 6,02·10²³', natija: '1,003 · 10²¹', izoh: '≈ 1 · 10²¹ ta', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '1 mol suv', foiz: 100, qiymat: '6,02 · 10²³ (18 g)', rang: '#38bdf8' },
              { nom: '0,03 ml tomchi', foiz: 35, qiymat: '1,003 · 10²¹ (0,03 g)', rang: '#34d399' },
            ],
            javobBadge: 'Javob: ≈ 1,003 · 10²¹ ta H₂O molekulasi',
          },
          pastki: ['m(H₂O) = 0,03 g', 'n = 0,03 / 18 = 0,001667 mol', 'N = 1,003 × 10²¹ ta'],
        },
        {
          id: 'cheklovchi',
          tugma: '2-masala: 5,49 g Cu',
          formula: '16 g CuSO₄ (0,10 mol) + 4,8 g Fe (0,0857 mol) → 5,49 g Cu',
          tur: 'hisob',
          cfg: {
            sarlavha: '198-bet 2-masala: Fe + CuSO₄ = FeSO₄ + Cu↓ (cheklovchi Fe)',
            tenglama: 'n(CuSO₄) = 0,10 mol  >  n(Fe) = 4,8 / 56 = 0,0857 mol  →  Fe tugaydi!',
            qadamlar: [
              { belgi: 'n(CuSO₄) = 16/160', natija: '0,10 mol', izoh: 'Ortiqcha modda', rang: '#38bdf8' },
              { belgi: 'n(Fe) = 4,8/56', natija: '0,0857 mol', izoh: 'Cheklovchi (kam!)', rang: '#fb7185' },
              { belgi: 'm(Cu) = 0,0857·64', natija: '5,49 g', izoh: '5,486 g mis', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'CuSO₄ (0,10 mol)', foiz: 100, qiymat: '0,10 mol (ortiqcha)', rang: '#38bdf8' },
              { nom: 'Fe (cheklovchi)', foiz: 85.7, qiymat: '0,0857 mol (tugaydi)', rang: '#fb7185' },
              { nom: 'Cu↓ hosili', foiz: 85.7, qiymat: '5,49 g Cu', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 5,49 g mis (cheklovchi Fe)',
          },
          pastki: ['n(CuSO₄)=0,10; n(Fe)=0,0857 mol', 'Hisob cheklovchi Fe bo\'yicha boradi', '0,0857 × 64 = 5,49 g Cu'],
        },
      ]}
    />
  );
}

function Korgazma44MasalalarB() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 198-bet 3–4-masalalar: M=44 (CO₂/N₂O) va X = O₂"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'gaz_44',
          tugma: '3-masala: M = 44',
          formula: '0,448 l (0,02 mol) = 0,88 g  →  M = 44 g/mol (CO₂ / N₂O)',
          tur: 'hisob',
          cfg: {
            sarlavha: '198-bet 3-masala: Hajm va massadan gaz formulasini topish',
            tenglama: 'n = 0,448 / 22,4 = 0,02 mol   →   M = 0,88 / 0,02 = 44 g/mol',
            qadamlar: [
              { belgi: 'n = 0,448 / 22,4', natija: '0,02 mol', izoh: 'n.sh.da hajm', rang: '#38bdf8' },
              { belgi: 'M = 0,88 / 0,02', natija: '44 g/mol', izoh: 'Molyar massa', rang: '#fbbf24' },
              { belgi: 'Gazlar (M=44)', natija: 'CO₂ yoki N₂O', izoh: '12+32 va 28+16', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'O₂ (32)', foiz: 72.7, qiymat: '32 g/mol', rang: '#94a3b8' },
              { nom: 'CO₂ / N₂O (44)', foiz: 100, qiymat: '44 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: M = 44 g/mol (CO₂ yoki N₂O)',
          },
          pastki: ['n = 0,448 / 22,4 = 0,02 mol', 'M = 0,88 / 0,02 = 44 g/mol', 'CO₂ (44) yoki N₂O (44)'],
        },
        {
          id: 'aralashma_o2',
          tugma: '4-masala: X = O₂',
          formula: '25% O₃ + 75% X (D_He = 9)  →  M_ort = 36  →  M_X = 32 (O₂)',
          tur: 'hisob',
          cfg: {
            sarlavha: '198-bet 4-masala: O₃ + X aralashmasida D_He = 9 → X ni topish',
            tenglama: 'M_ort = 9·4 = 36   |   0,25·48 + 0,75·M_X = 36   →   M_X = 32 (O₂)',
            qadamlar: [
              { belgi: 'M_ort = 9 · 4', natija: '36 g/mol', izoh: 'M(He) = 4', rang: '#38bdf8' },
              { belgi: '0,75 · M_X', natija: '36 − 12 = 24', izoh: '0,25·M(O₃) = 12', rang: '#fbbf24' },
              { belgi: 'M_X = 24 / 0,75', natija: '32 g/mol', izoh: 'Kislorod O₂', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Ozon ulushi (25%·48)', foiz: 33.3, qiymat: '12 g/mol', rang: '#a855f7' },
              { nom: 'O₂ ulushi (75%·32)', foiz: 66.7, qiymat: '24 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: M_X = 32 g/mol → Kislorod (O₂)',
          },
          pastki: ['M_ort = 9 × 4 = 36 g/mol', '0,25×48 + 0,75×M_X = 36', 'M_X = 24 / 0,75 = 32 (O₂)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (43-§) VA O'YINLAR (44-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'O\'zbekistonda kaliyli o\'g\'it (kons. KCl) ishlab chiqaradigan zavod:',
    variantlar: [
      { matn: 'Navoiyazot', togri: false },
      { matn: 'Farg\'onaazot', togri: false },
      { matn: 'Dehqonobod kaliyli o\'g\'itlar zavodi', togri: true },
      { matn: 'Samarqandkimyo', togri: false },],
    izoh: 'Qashqadaryodagi Dehqonobod zavodi silvinitdan KCl oladi.',
  },
  {
    id: 't2',
    savol: 'Kartoshka, uzum, tamaki va sitrus ekinlariga qaysi kaliy o\'g\'iti beriladi?',
    variantlar: [
      { matn: 'Xlorsiz K₂SO₄, yog\'och kuli K₂CO₃ yoki KNO₃', togri: true },
      { matn: 'Faqat KCl', togri: false },
      { matn: 'Silvinit KCl·NaCl', togri: false },
      { matn: 'Kainit', togri: false },],
    izoh: 'Xlor ioni kraxmal va qand miqdorini kamaytiradi.',
  },
  {
    id: 't3',
    savol: 'Qo\'sh superfosfat (Ca(H₂PO₄)₂) oddiy superfosfatdan nimasi bilan ustun?',
    variantlar: [
      { matn: 'Suvda erimaydi', togri: false },
      { matn: 'Gips ko\'p', togri: false },
      { matn: 'Faqat kislotali tuproqqa', togri: false },
      { matn: 'Gips ballastsiz va 40–50% P₂O₅ saqlaydi', togri: true },],
    izoh: 'Oddiy superfosfatda CaSO₄·2H₂O ballasti bor.',
  },
  {
    id: 't4',
    savol: '40 t NH₄NO₃ olish ("Farg\'onaazot") uchun HNO₃ va NH₃ sarfi:',
    variantlar: [
      { matn: '10 t va 1000 m³', togri: false },
      { matn: '31,5 t HNO₃ va 11 200 m³ NH₃', togri: true },
      { matn: '40 t va 500 m³', togri: false },
      { matn: '63 t va 22 400 m³', togri: false },],
    izoh: '500 kmol · 63 = 31,5 t; 500 · 22,4 = 11 200 m³.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'makro_uzb', nom: 'Makrobiogen & Olimlar', tavsif: '99,4%, Ca, Ferrostimulator' },
    { id: 'mikro_bio', nom: '10 Mikrobiogen (<0,01%)', tavsif: 'Fe, Mn, Co, Mo, F, Br, I' },
    { id: 'amaliy_5', nom: '5-amaliy & 25-jadval', tavsif: 'Alanga, NH₃↑, BaSO₄↓, AgCl↓' },
  ],
  topshiriqlar: [
    { nom: 'Inson (99,4%): H, O, C, N, Ca', qisqa: '99% Ca suyakda, 1% qonda', guruh: 'makro_uzb', izoh: 'Yer 98% (8 el), o\'simlik 99,1% (7 el).' },
    { nom: 'Asqarov & Qirg\'izov: Ferrostimulator', qisqa: '"Askalsiy" biostimulyatori', guruh: 'makro_uzb', izoh: 'Paxtachilik va chorvachilikda.' },
    { nom: 'X.T.Sharipov va shogirdlari', qisqa: 'Chiqindidan noyob metall', guruh: 'makro_uzb', izoh: 'Tog\'-kon sanoati chiqindilari.' },
    { nom: 'Fe (gemoglobin), Co (Vit B₁₂)', qisqa: 'Mn (Vit C, +3–4 s/ga)', guruh: 'mikro_bio', izoh: 'Cu (Fe o\'zlashtirish), Zn (oqarish).' },
    { nom: 'Mo: bug\'doy +37%, paxta +7 s/ga', qisqa: 'Lampochka zavodi chiqindisi', guruh: 'mikro_bio', izoh: 'Qandlavlagi +20%, zig\'ir +25%.' },
    { nom: 'F (emal), Br (nerv), I (tiroksin)', qisqa: 'Karies va bo\'qoq oldi', guruh: 'mikro_bio', izoh: '10 ta mikrobiogen element (<0,01%).' },
    { nom: 'Na⁺ → sariq; K⁺ → binafsha alanga', qisqa: '5-amaliy alanga testi', guruh: 'amaliy_5', izoh: 'Fosforit suvda erimaydi.' },
    { nom: '(NH₄)₂SO₄: NH₃↑ + oq BaSO₄↓', qisqa: 'NH₄NO₃ cho\'kma bermaydi', guruh: 'amaliy_5', izoh: '25-jadval sifat testlari.' },
    { nom: 'KCl: binafsha alanga + AgCl↓', qisqa: 'Xlorid testi (oq cho\'kma)', guruh: 'amaliy_5', izoh: 'AgNO₃ bilan oq AgCl↓ tushadi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Makrobiogen',
    savol: 'Inson organizmi massasining 99,4% ini qaysi 5 element tashkil qiladi?',
    variantlar: ['Fe, Mn, Co, Cu, Zn', 'O, Si, Al, Fe, Ca', 'H, O, C, N, Ca', 'F, Br, I, B, Mo'],
    togri: 2,
    izoh: 'H, O, C, N, Ca inson organizmining 99,4% ini beradi.',
  },
  {
    belgi: 'Olimlar',
    savol: '"Ferrostimulator" preparatini qaysi o\'zbekistonlik olimlar yaratgan?',
    variantlar: ['I.R.Asqarov va Sh.M.Qirg\'izov', 'M.N.Nabiyev va A.Yu.Fersman', 'X.T.Sharipov', 'Yu.Libix'],
    togri: 0,
    izoh: 'I.R.Asqarov va Sh.M.Qirg\'izov temir asosida yaratgan.',
  },
  {
    belgi: 'Molibden',
    savol: 'Lampochka chiqindisidan olingan Mo bug\'doy va paxta hosilini qancha oshiradi?',
    variantlar: ['Bug\'doy +5%', 'Faqat +1 s/ga', 'Ta\'sir qilmaydi', 'Bug\'doy +37%, paxta +7 s/ga (zig\'ir +25%)'],
    togri: 3,
    izoh: '196–197-betlar: Bug\'doy +37%, paxta +7 s/ga, qandlavlagi +20%.',
  },
  {
    belgi: '5-amaliy',
    savol: '(NH₄)₂SO₄ va NH₄NO₃ o\'g\'itlarini qanday ajratish mumkin (25-jadval)?',
    variantlar: ['Ikkalasi ham erimaydi', 'BaCl₂ quyish: (NH₄)₂SO₄ da oq BaSO₄↓ tushadi, NH₄NO₃ da yo\'q', 'AgNO₃ bilan', 'Alanga rangi bilan'],
    togri: 1,
    izoh: 'Ikkalasi NaOH bilan NH₃↑ beradi, BaCl₂ bilan faqat sulfat cho\'kadi.',
  },
  {
    belgi: 'F, Br, I',
    savol: 'Tish emali, nerv muvozanati va bo\'qoq oldi uchun zarur elementlar:',
    variantlar: ['Cu, Zn, Fe', 'F (emal), Br (nerv), I (tiroksin)', 'C, H, O', 'Na, K, Ca'],
    togri: 1,
    izoh: 'F — ftorapatit, Br — nerv, I — qalqonsimon bez.',
  },
  {
    belgi: '2-masala',
    savol: '16 g CuSO₄ ga 4,8 g Fe solinganda necha gramm Cu ajraladi?',
    variantlar: ['6,4 g', '3,2 g', '16 g', '5,49 g (cheklovchi Fe = 0,0857 mol)'],
    togri: 3,
    izoh: 'n(Fe)=0,0857 < 0,10 mol CuSO₄ → 0,0857 × 64 = 5,49 g.',
  },
  {
    belgi: '1-masala',
    savol: '0,03 ml suv tomchisida (ρ=1) nechta suv molekulasi bor?',
    variantlar: ['1,003 · 10²¹ ta', '1000', '6,02 · 10²³', '3 · 10¹⁸'],
    togri: 0,
    izoh: '0,03 / 18 × 6,02·10²³ = 1,003 · 10²¹.',
  },
  {
    belgi: '4-masala',
    savol: '25% O₃ + 75% X gaz aralashmasida D_He = 9 bo\'lsa, X gazi:',
    variantlar: ['CO₂', 'CH₄', 'Kislorod O₂ (M = 32)', 'N₂'],
    togri: 2,
    izoh: 'M_ort = 36; 0,25·48 + 0,75·M_X = 36 → M_X = 32 (O₂).',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '198-bet 4-masala: 25% O₃ + 75% X → O₂',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. M_ort = D_He · M(He) = 9 · 4 = 36 g/mol',
      '2. Tenglama: 0,25·M(O₃) + 0,75·M_X = 36',
      '3. 0,25·48 = 12 → 0,75·M_X = 36 − 12 = 24',
      '4. M_X = 24 / 0,75 = 32 g/mol → Kislorod (O₂)',
    ],
    variantlar: [
      '3. 0,25·48 = 12 → 0,75·M_X = 36 − 12 = 24',
      '1. M_ort = D_He · M(He) = 9 · 4 = 36 g/mol',
      '4. M_X = 24 / 0,75 = 32 g/mol → Kislorod (O₂)',
      '2. Tenglama: 0,25·M(O₃) + 0,75·M_X = 36',
    ],
  },
  {
    tur: '198-bet 2-masala: 16 g CuSO₄ + 4,8 g Fe',
    vazifa: 'Cheklovchi reagent qadamlarini tartiblang:',
    tartib: [
      '1. Fe + CuSO₄ = FeSO₄ + Cu↓ (1:1)',
      '2. n(CuSO₄) = 16/160 = 0,10 mol',
      '3. n(Fe) = 4,8/56 = 0,0857 mol (cheklovchi!)',
      '4. m(Cu) = 0,0857 · 64 = 5,49 g',
    ],
    variantlar: [
      '2. n(CuSO₄) = 16/160 = 0,10 mol',
      '4. m(Cu) = 0,0857 · 64 = 5,49 g',
      '1. Fe + CuSO₄ = FeSO₄ + Cu↓ (1:1)',
      '3. n(Fe) = 4,8/56 = 0,0857 mol (cheklovchi!)',
    ],
  },
  {
    tur: '199-bet 5-amaliy ish (25-jadval)',
    vazifa: 'O\'g\'itlarni aniqlash algoritmini tuzing:',
    tartib: [
      '1. Suvda eritish: Ca₃(PO₄)₂ erimaydi',
      '2. Alanga: NaNO₃ sariq; KCl binafsha',
      '3. NaOH + t°: NH₄⁺ tuzlarida NH₃↑ hidi',
      '4. BaCl₂ → BaSO₄↓ ((NH₄)₂SO₄); AgNO₃ → AgCl↓ (KCl)',
    ],
    variantlar: [
      '3. NaOH + t°: NH₄⁺ tuzlarida NH₃↑ hidi',
      '4. BaCl₂ → BaSO₄↓ ((NH₄)₂SO₄); AgNO₃ → AgCl↓ (KCl)',
      '1. Suvda eritish: Ca₃(PO₄)₂ erimaydi',
      '2. Alanga: NaNO₃ sariq; KCl binafsha',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Kalsiy (Ca) ning necha foizi suyak va tishlarda?',
    variantlar: ['50% va 50%', '99% suyak/tish, 1% qon va limfa', '10% va 90%', '100% qonda'],
    togri: 1,
    izoh: '194-bet: Ca ning 99% suyak va tishlarda.',
  },
  {
    savol: 'Sitrus va makkajo\'xori barglari oqarishi qaysi element tanqisligi?',
    variantlar: ['Temir', 'Brom', 'Ftor', 'Rux (Zn)'],
    togri: 3,
    izoh: '196-bet: Zn yetishmasa barglar oqarib ketadi.',
  },
  {
    savol: 'B₁₂ vitamini tarkibiga kiruvchi va g\'o\'za hosilini +3–4 s/ga oshiruvchi:',
    variantlar: ['Kobalt (Co)', 'Kalsiy', 'Brom', 'Ftor'],
    togri: 0,
    izoh: '195-bet: Kobalt (Co) qon, DNK va B₁₂ sintezida.',
  },
  {
    savol: '0,448 l (n.sh.) gaz massasi 0,88 g bo\'lsa, bu qaysi gaz?',
    variantlar: ['O₂ (32)', 'NH₃ (17)', 'M = 44 g/mol → CO₂ yoki N₂O', 'H₂ (2)'],
    togri: 2,
    izoh: '0,88 / 0,02 = 44 g/mol.',
  },
  {
    savol: 'Pigmentatsiya va Fe o\'zlashtirilishini ta\'minlovchi mikrobiogen element:',
    variantlar: ['Brom (Br)', 'Yod (I)', 'Mis (Cu)', 'Ftor (F)'],
    togri: 2,
    izoh: '196-bet: Cu yetishmasa o\'simlik quriydi.',
  },
  {
    savol: 'Mn qaysi vitamin sintezi va qanday ekinlar hosilini oshiradi?',
    variantlar: ['C vitamini; qulupnay +3, bug\'doy +3–4, chigit +2 s/ga', 'D vitamini', 'A vitamini', 'K vitamini'],
    togri: 0,
    izoh: '195-bet: Mn askorbin kislota sintezini kuchaytiradi.',
  },
  {
    savol: '10 ta hayotiy mikrobiogen elementlar miqdori organizmda qancha?',
    variantlar: ['50%', '0,01% dan kam (< 0,01%)', '10%', '99,4%'],
    togri: 1,
    izoh: '194-bet: < 0,01% miqdorda, lekin zarur.',
  },
  {
    savol: 'Qalqonsimon bez (tiroksin), o\'sish va bo\'qoq oldi uchun mas\'ul element:',
    variantlar: ['Kalsiy', 'Rux', 'Temir', 'Yod (I)'],
    togri: 3,
    izoh: '197-bet: Yod (I).',
  },
];

export default function S8Mavzu44() {
  const korgazmalar = [
    { nom: '1. Makro & 10 Mikrobiogen', ikon: 'atom', komponent: <KorgazmaMakroMikrobiogen /> },
    { nom: '2. Olimlar & Fe, Mn, Co', ikon: 'yurak', komponent: <KorgazmaOlimlarFeMnCo /> },
    { nom: '3. Cu, Zn, Mo & F, Br, I', ikon: 'uchqun', komponent: <KorgazmaCuZnMoFBrI /> },
    { nom: '4. 5-amaliy & 25-jadval', ikon: 'kolba', komponent: <Korgazma5AmaliyIsh /> },
    { nom: '5. 10²¹ H₂O & 5,49 g Cu', ikon: 'formula', komponent: <Korgazma44MasalalarA /> },
    { nom: '6. M=44 & X = O₂', ikon: 'qidiruv', komponent: <Korgazma44MasalalarB /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-44"
          nom="Biogen elementlarni guruhlang"
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
          key="tezkor-44"
          nom="44-§: Biogen elementlar"
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
          key="zanjir-44"
          nom="5-amaliy & Hisob zanjiri"
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
          key="duel-44"
          sarlavha="44-§: Biogenlar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="44-§"
      mavzuNom="Biogen elementlar va ularning tirik organizmlardagi ahamiyati"
      oldingiRaqam="43-§"
      oldingiNom="Eng muhim asosiy mineral o'g'itlar"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
