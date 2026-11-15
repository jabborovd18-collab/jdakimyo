'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 21-PARAGRAF
// "Metallmaslarning umumiy xossalari" (Darslik 89-92-betlar)
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
function KorgazmaJadval16Metallmas() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. 16-jadval: Metallmas oilalari va formulalar"
      ikon="panjara"
      variantlar={[
        {
          id: 'oilalar',
          tugma: 'IIIA–VIIIA guruhlar',
          formula: '22 ta element: B–At (p-elementlar) + H, He',
          tur: 'biogen',
          cfg: {
            sarlavha: '16-jadval: Metallmaslarning asosiy guruhchalari',
            tenglama: 'IIIA(B) • IVA(C,Si) • VA(N,P,As) • VIA(O–Te) • VIIA(F–At) • VIIIA(He–Rn)',
            markazBelgi: '22 el.',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'IVA & VA (RH₄, RH₃)', belgi: 'C,Si • N,P,As', rang: '#34d399' },
              { nom: 'VIA Xalkogen (H₂R)', belgi: 'O, S, Se, Te', rang: '#fbbf24' },
              { nom: 'VIIA Galogen (HR)', belgi: 'F, Cl, Br, I, At', rang: '#f97316' },
              { nom: 'VIIIA Inert gazlar', belgi: 'He–Rn (XeO₄)', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Yuqori oksid', v: 'RO₂, R₂O₅, RO₃, R₂O₇', rang: '#38bdf8' }],
          },
          pastki: ['Xalkogenlar: O, S, Se, Te', 'Galogenlar: F, Cl, Br, I, At', 'Inert gazlar: He, Ne, Ar, Kr, Xe, Rn'],
        },
        {
          id: 'formulalar',
          tugma: 'Gidrid & Yuqori oksid',
          formula: 'RH₄→HR (uchuvchan)  |  R₂O₃→R₂O₇ (kislotali)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Guruh raqami oshishi bilan vodorodli birikma va oksid o\'zgarishi',
            tenglama: 'Oksidlar barchasi KISLOTALI: CO₂, N₂O₅, SO₃, Cl₂O₇',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'IVA: RH₄ / RO₂', qiymat: 40, yorliq: 'CH₄, CO₂', rang: '#38bdf8' },
              { nom: 'VA: RH₃ / R₂O₅', qiymat: 55, yorliq: 'NH₃, N₂O₅', rang: '#34d399' },
              { nom: 'VIA: H₂R / RO₃', qiymat: 75, yorliq: 'H₂S, SO₃', rang: '#fbbf24' },
              { nom: 'VIIA: HR / R₂O₇', qiymat: 95, yorliq: 'HCl, Cl₂O₇', rang: '#f97316' },
            ],
            belgilar: [{ k: 'IIIA (Bor)', v: 'B₂O₃', rang: '#a855f7' }],
          },
          pastki: ['Vodorodga nisbatan valentlik: 8 − guruh', 'Kislorodga nisbatan yuqori: = guruh', 'Barchasi p-element (H va He dan tashqari)'],
        },
      ]}
    />
  );
}

function KorgazmaMetallmasQatori() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Oksidlovchilik qatori (90-bet) va 92-bet 1-savol"
      ikon="chaqmoq"
      variantlar={[
        {
          id: 'em_qator',
          tugma: 'EM shkalasi (F → Si)',
          formula: 'F(4,0) > O(3,44) > Cl(3,16) > N(3,04) > S > C > H > P > Si(1,9)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '90-bet: Metallmaslarning oksidlovchilik (NEM) kamayish qatori',
            tenglama: 'Chapdan o\'ngga ē tortish kuchi kamayadi; davrda o\'ngga ortadi',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F (eng kuchli)', qiymat: 100, yorliq: 'NEM = 4,00', rang: '#ef4444' },
              { nom: 'O / Cl / N', qiymat: 82, yorliq: '3,44 • 3,16 • 3,04', rang: '#fbbf24' },
              { nom: 'S / C / H / P', qiymat: 60, yorliq: '2,58 • 2,55 • 2,20', rang: '#38bdf8' },
              { nom: 'Si (eng kuchsiz)', qiymat: 47, yorliq: 'NEM = 1,90', rang: '#94a3b8' },
            ],
            belgilar: [{ k: 'Oraliq', v: '1,80 – 4,00', rang: '#34d399' }],
          },
          pastki: ['F > O > Cl > N > S > C > H > P > Si', 'Ftor — eng kuchli oksidlovchi (4,0)', 'Kremniy (Si) — 1,90'],
        },
        {
          id: 'juftlar',
          tugma: '92-bet 1-savol juftlari',
          formula: 'N > C  •  S > P  •  Se > Te  •  O > Cl',
          tur: 'molekula',
          cfg: {
            sarlavha: '92-bet 1-savol: Qaysi element elektronni osonroq tortadi?',
            tenglama: 'Davrda o\'ngda kuchliroq (N>C, S>P); guruhda yuqorida kuchliroq (Se>Te)',
            rejim: 'bog',
            bogJuft: { chap: 'C (2,55)', ong: 'N (3,04)', siljish: 0.3, chapRang: '#94a3b8', ongRang: '#38bdf8' },
            metrikalar: [
              { nom: 'a) C vs N (2-davr)', qiymat: 'Azot (N) kuchli', foiz: 78, rang: '#38bdf8' },
              { nom: 'b) S vs P (3-davr)', qiymat: 'Oltingugurt (S)', foiz: 68, rang: '#fbbf24' },
              { nom: 'd/f) Se vs Te | O vs Cl', qiymat: 'Se > Te; O > Cl', foiz: 88, rang: '#34d399' },
            ],
            belgilar: [{ k: 'Qoida', v: 'O (3,44) > Cl (3,16)', rang: '#fb7185' }],
          },
          pastki: ['N > C va S > P (davrda o\'ngga ortadi)', 'Se > Te (guruhda pastga kamayadi)', 'O > Cl (90-bet qatori bo\'yicha)'],
        },
      ]}
    />
  );
}

function KorgazmaTabiatTarqalish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Tabiatda tarqalishi: Koinot vs Yer qobig&apos;i"
      ikon="yadro"
      variantlar={[
        {
          id: 'yer_qobigi',
          tugma: 'Yer qobig\'i & Koinot',
          formula: 'Yer: O (47%), Si (27,6%)  |  Koinot: H (75%), He (23%)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '90-bet: Yer po\'stlog\'idagi metallmaslar ulushi (74,6%+)',
            tenglama: 'Koinotda H va He eng ko\'p  |  Yer qobig\'ida O va Si yetakchi',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Kislorod (O)', qiymat: 94, yorliq: '47,0% (Yer)', rang: '#38bdf8' },
              { nom: 'Kremniy (Si)', qiymat: 55, yorliq: '27,6% (SiO₂)', rang: '#34d399' },
              { nom: 'Boshqalar (Al,Fe..)', qiymat: 50, yorliq: '25,4%', rang: '#94a3b8' },
            ],
            belgilar: [{ k: 'Havoda N₂', v: '78% (hajm) erkin gaz', rang: '#fbbf24' }],
          },
          pastki: ['Yer qobig\'ida O (47%) va Si (27,6%)', 'Koinotda H va He asosiy massa', 'O + Si + metallar = 100%'],
        },
        {
          id: 'erkin_holda',
          tugma: 'Erkin holda uchraydigan',
          formula: 'N₂, O₂, Inert gazlar • S (tug\'ma) • C (olmos/grafit)',
          tur: 'biogen',
          cfg: {
            sarlavha: '92-bet 5-savol: Tabiatda erkin holatda uchraydigan metallmaslar',
            tenglama: 'Galogenlar, P va Si tabiatda faqat BIRIKMA holda uchraydi!',
            markazBelgi: 'Erkin',
            markazRang: '#fbbf24',
            tugunlar: [
              { nom: 'Atmosfera (N₂ 78%)', belgi: 'N₂, O₂ (21%)', rang: '#38bdf8' },
              { nom: 'Inert gazlar', belgi: 'He, Ne, Ar...', rang: '#a855f7' },
              { nom: 'Oltingugurt konlari', belgi: 'Sof S', rang: '#fde047' },
              { nom: 'Uglerod', belgi: 'Olmos, Grafit', rang: '#94a3b8' },
            ],
            belgilar: [{ k: 'F, Cl, Br, I, P, Si', v: 'Erkin uchramaydi!', rang: '#fb7185' }],
          },
          pastki: ['Havoda: N₂, O₂, inert gazlar', 'Yer ostida: tug\'ma S, olmos, grafit', 'F, Cl, P, Si faqat birikmalarda'],
        },
      ]}
    />
  );
}

function KorgazmaAgregatHolat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Agregat holatlar, (H₂O)n va kristall panjara"
      ikon="kristall"
      variantlar={[
        {
          id: 'agregat',
          tugma: 'Gaz, Suyuq (Br₂), Qattiq',
          formula: '11 Gaz (H₂..Rn)  •  1 Suyuq (Br₂)  •  Qattiq (C, S, P, I₂, Si, B)',
          tur: 'biogen',
          cfg: {
            sarlavha: '90-bet: Normal sharoitda metallmaslarning agregat holati',
            tenglama: 'Brom (Br₂) — yagona suyuq metallmas!  |  Simob (Hg) — yagona suyuq metall',
            markazBelgi: '22 el.',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'Gazlar (11 ta)', belgi: 'H₂,N₂,O₂,F₂,Cl₂+6', rang: '#38bdf8' },
              { nom: 'Suyuq (yagona)', belgi: 'Br₂ (qo\'ng\'ir)', rang: '#f97316' },
              { nom: 'Atom qattiq', belgi: 'C, Si, B (qattiq)', rang: '#a855f7' },
              { nom: 'Molekulyar qattiq', belgi: 'S₈, P₄, I₂', rang: '#fde047' },
            ],
            belgilar: [{ k: 'O\'tkazuvchanlik', v: 'Dielektrik (grafitdan boshqa)', rang: '#94a3b8' }],
          },
          pastki: ['11 ta gaz: H₂, N₂, O₂, F₂, Cl₂ + 6 inert', 'Yagona suyuq metallmas: Br₂', 'Qattiqlar: C, Si, B, S, P, I₂, Se, Te, As'],
        },
        {
          id: 'vodorod_bog',
          tugma: 'Nega H₂O suyuq (92-bet)?',
          formula: 'H₂S, HCl, NH₃ — gaz  |  (H₂O)n — molekulalararo H-bog\' → SUYUQ!',
          tur: 'molekula',
          cfg: {
            sarlavha: '92-bet: Suvning assotsiatsiyasi (H₂O)n va anomal Tq = 100°C',
            tenglama: 'Kislorodning kichik radiusi va katta EM (3,44) tufayli vodorod bog\' hosil bo\'ladi',
            rejim: 'molekula',
            markaz: { belgi: 'O', rang: '#ef4444', r: 24 },
            atomlar: [
              { belgi: 'H', rang: '#38bdf8', r: 16, masofa: 72, bog: 1, burchak: -0.6 },
              { belgi: 'H', rang: '#38bdf8', r: 16, masofa: 72, bog: 1, burchak: 0.6 },
              { belgi: 'H₂O', rang: '#60a5fa', r: 18, masofa: 92, bog: 1, burchak: 3.14 },
            ],
            metrikalar: [
              { nom: 'H₂O (Mr=18) qaynash', qiymat: '+100°C (suyuq!)', foiz: 90, rang: '#38bdf8' },
              { nom: 'H₂S (Mr=34) qaynash', qiymat: '-60°C (gaz)', foiz: 25, rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Sabab', v: 'Molekulalararo vodorod bog\'i', rang: '#34d399' }],
          },
          pastki: ['H₂S gaz (-60°C), H₂O suyuq (+100°C)', 'Sababi: molekulalararo vodorod bog\'i (H₂O)n', 'Bog\'i uzilishiga qo\'shimcha energiya kerak'],
        },
      ]}
    />
  );
}

function KorgazmaVodorodVaInert() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Vodorodning ikki o&apos;rni va Inert gazlar (1962 XeF₄)"
      ikon="atom"
      variantlar={[
        {
          id: 'vodorod',
          tugma: 'Vodorod (IA & VIIA)',
          formula: '1s¹: H⁺¹ (HCl, H₂O)  va  H⁻¹ (LiH, CaH₂)',
          tur: 'molekula',
          cfg: {
            sarlavha: '91-bet: Vodorod nima uchun IA va VIIA guruhga joylashtiriladi?',
            tenglama: 'IA kabi 1 ē beradi (H⁺¹)  |  VIIA kabi to\'lishiga 1 ē yetmaydi (H⁻¹)',
            rejim: 'atom',
            markaz: { belgi: '+1', rang: '#38bdf8', r: 22 },
            qavatlar: [1],
            belgilar: [
              { k: 'OD = +1', v: 'HCl, H₂O (qaytaruvchi)', rang: '#34d399' },
              { k: 'OD = -1', v: 'NaH, CaH₂ (oksidlovchi)', rang: '#f97316' },
            ],
          },
          pastki: ['IA ga o\'xshash: 1 ta elektron (1s¹)', 'VIIA ga o\'xshash: 2 ē ga to\'lishi uchun 1 ē kam', 'Oddiy moddasi: 2 atomli H₂'],
        },
        {
          id: 'inert_gaz',
          tugma: 'Inert gazlar (1962 XeF₄)',
          formula: 'ns²np⁶ (He 1s²)  •  1962-yilda XeF₄, XeO₃, XeO₄ sintez qilindi!',
          tur: 'molekula',
          cfg: {
            sarlavha: '91-bet: VIIIA inert gazlar va 1962-yil kashfiyoti (XeF₄)',
            tenglama: 'He–Rn oktet qavati barqaror, lekin Xe + F₂ → XeF₂, XeF₄, XeF₆!',
            rejim: 'molekula',
            markaz: { belgi: 'Xe', rang: '#a855f7', r: 24 },
            atomlar: [
              { belgi: 'F', rang: '#fde047', r: 16, masofa: 82, bog: 1, burchak: 0 },
              { belgi: 'F', rang: '#fde047', r: 16, masofa: 82, bog: 1, burchak: 1.57 },
              { belgi: 'F', rang: '#fde047', r: 16, masofa: 82, bog: 1, burchak: 3.14 },
              { belgi: 'F', rang: '#fde047', r: 16, masofa: 82, bog: 1, burchak: 4.71 },
            ],
            metrikalar: [
              { nom: 'Tashqi qavat', qiymat: 'ns² np⁶ (oktet)', foiz: 100, rang: '#a855f7' },
              { nom: '1962 sintez', qiymat: 'XeF₄ (birinchi birikma)', foiz: 80, rang: '#fde047' },
            ],
            belgilar: [{ k: 'XeO₄', v: 'Yuqori oksid (RO₄)', rang: '#38bdf8' }],
          },
          pastki: ['Ilgari mutlaqo reaksiyaga kirishmaydi deyilgan', '1962-yilda XeF₄ (ksenon tetraftorid) olindi', 'He (sharlar), Ne (chiroqlar), Ar (payvand)'],
        },
      ]}
    />
  );
}

function KorgazmaOltiXulosa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Metallmaslarning 6 ta oltin xulosasi (91–92-bet)"
      ikon="kitob"
      variantlar={[
        {
          id: 'xulosa_6',
          tugma: '6 ta asosiy qonuniyat',
          formula: 'p-oilalar • NEM 1,8–4,0 • Uchuvchan RHx • Kislotali oksidlar',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Metallmaslarning umumiy xossalarini jamlash',
            tenglama: 'O\'zaro kovalent (CO₂, H₂O)   |   Metallar bilan ionli (NaCl, MgO, Na₂S)',
            markazBelgi: '6 qoida',
            markazRang: '#34d399',
            tugunlar: [
              { nom: '1–2. p-oilasi & NEM', belgi: 'NEM 1,8–4,0', rang: '#38bdf8' },
              { nom: '3–4. Gidrid & (H₂O)n', belgi: 'Gaz vs Suyuq', rang: '#fbbf24' },
              { nom: '5. Yuqori oksidlar', belgi: 'SO₃,P₂O₅ (Kislotali)', rang: '#fb7185' },
              { nom: '6. Bog\' turi (90-bet)', belgi: 'Kovalent / Ionli', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'CO₂ molekulasi', v: 'Qutbli bog\', qutbsiz mol.', rang: '#34d399' }],
          },
          pastki: ['1–2: p-elementlar (H, He dan tashqari), NEM 1,8–4,0', '3–4: Gidridlar gaz, H₂O suyuq (H-bog\')', '5–6: Oksidlari kislotali; CO₂ chiziqli qutbsiz'],
        },
        {
          id: 'co2_bog',
          tugma: 'CO₂ (qutbsiz molekula)',
          formula: 'O = C = O (chiziqli 180°): bog\'lar qutbli, molekula qutbsiz!',
          tur: 'molekula',
          cfg: {
            sarlavha: '90-bet: CO₂ da kimyoviy bog\' va molekula qutbliligi',
            tenglama: 'C=O bog\'i qutbli kovalent, simmetriya tufayli dipollar nolga teng → qutbsiz molekula',
            rejim: 'molekula',
            markaz: { belgi: 'C', rang: '#94a3b8', r: 22 },
            atomlar: [
              { belgi: 'O', rang: '#ef4444', r: 20, masofa: 86, bog: 2, burchak: 0 },
              { belgi: 'O', rang: '#ef4444', r: 20, masofa: 86, bog: 2, burchak: 3.14 },
            ],
            metrikalar: [
              { nom: 'C = O bog\'i', qiymat: 'Qutbli kovalent', foiz: 80, rang: '#fbbf24' },
              { nom: 'CO₂ molekulasi (180°)', qiymat: 'Qutbsiz (μ = 0)', foiz: 10, rang: '#34d399' },
            ],
            belgilar: [{ k: 'NaCl, CaO', v: 'Metall + metallmas = Ion', rang: '#a855f7' }],
          },
          pastki: ['Bog\'lanish turi: qutbli kovalent', 'Geometriya: chiziqli (180°)', 'Umumiy molekula: qutbsiz (dipollar muvozanatda)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (20-§) VA O'YINLAR (21-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + ?H₂O da suv koeffitsiyenti:',
    variantlar: [
      { matn: '30', togri: false },
      { matn: '8', togri: false },
      { matn: '15 (15H₂O)', togri: true },
      { matn: '6', togri: false },],
    izoh: '30 ta HNO₃ dan 15 ta H₂O hosil bo\'ladi.',
  },
  {
    id: 't2',
    savol: '2KMnO₄ = K₂MnO₄ + MnO₂ + O₂ koeffitsiyentlar yig\'indisi:',
    variantlar: [
      { matn: '5 (2 + 1 + 1 + 1)', togri: true },
      { matn: '4', togri: false },
      { matn: '6', togri: false },
      { matn: '3', togri: false },],
    izoh: '85-bet 3-misol javobi: 5.',
  },
  {
    id: 't3',
    savol: '2H₂O₂ → 2H₂O + O₂ da ham oksidlovchi, ham qaytaruvchi element:',
    variantlar: [
      { matn: 'Vodorod', togri: false },
      { matn: 'Marganes', togri: false },
      { matn: 'Hech qaysi', togri: false },
      { matn: 'Kislorod (O⁻¹ → O⁻² va O⁰)', togri: true },],
    izoh: 'H₂O₂ disproporsiyalanish reaksiyasiga kirishadi.',
  },
  {
    id: 't4',
    savol: 'CuO + H₂ = Cu + H₂O dan 0,25 mol Cu olish uchun necha litr H₂ kerak?',
    variantlar: [
      { matn: '22,4 l', togri: false },
      { matn: '5,6 litr', togri: true },
      { matn: '2,24 l', togri: false },
      { matn: '11,2 l', togri: false },],
    izoh: '0,25 × 22,4 = 5,6 litr.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'gaz_suyuq', nom: 'Gaz & Suyuq (Br₂)', tavsif: '11 gaz, suyuq Br₂, (H₂O)n' },
    { id: 'qattiq_erkin', nom: 'Qattiq & Erkin holda', tavsif: 'C, Si, B, S₈, P₄, I₂' },
    { id: 'oilalar_nem', nom: 'Oilalar & NEM qatori', tavsif: 'Xalkogen, Galogen, F→Si' },
  ],
  topshiriqlar: [
    { nom: 'H₂, N₂, O₂, F₂, Cl₂ + 6 inert', qisqa: '11 ta gazsimon metallmas', guruh: 'gaz_suyuq', izoh: 'Odatdagi sharoitda gazlar.' },
    { nom: 'Brom (Br₂) — yagona suyuq', qisqa: 'Qo\'ng\'ir uchuvchan suyuqlik', guruh: 'gaz_suyuq', izoh: '90-bet: suyuq yagona metallmas.' },
    { nom: '(H₂O)n vodorod bog\'i → suyuq', qisqa: 'H₂S dan farqli (100°C)', guruh: 'gaz_suyuq', izoh: 'Molekulalararo bog\'lanish tufayli.' },
    { nom: 'Olmos, Grafit, Si, Bor (B)', qisqa: 'Atom panjarali qattiq', guruh: 'qattiq_erkin', izoh: 'Juda qattiq va qiyin eriydi.' },
    { nom: 'Tug\'ma S₈, N₂, O₂, Olmos', qisqa: 'Tabiatda erkin uchraydi', guruh: 'qattiq_erkin', izoh: '92-bet 5-savol javobi.' },
    { nom: 'Yer qobig\'i: O (47%) & Si (27,6%)', qisqa: 'Eng keng tarqalganlar', guruh: 'qattiq_erkin', izoh: 'Koinotda esa H va He.' },
    { nom: 'Xalkogenlar (VIA) & Galogenlar', qisqa: '16-jadval oilalari', guruh: 'oilalar_nem', izoh: 'O–Te va F–At.' },
    { nom: 'F > O > Cl > N > S > C > H > P > Si', qisqa: 'Oksidlovchilik NEM qatori', guruh: 'oilalar_nem', izoh: 'NEM 1,8 – 4,0 oraliqda.' },
    { nom: 'XeF₄ (1962) & Kislotali oksidlar', qisqa: 'SO₃, P₂O₅, N₂O₅, Cl₂O₇', guruh: 'oilalar_nem', izoh: 'Inert gazlar ham birikma beradi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '90-bet',
    savol: 'Yer qobig\'i massasida eng ko\'p tarqalgan ikki metallmas:',
    variantlar: ['Vodorod va Geliy', 'Azot va Uglerod', 'Kislorod (47%) va Kremniy (27,6%)', 'Ftor va Xlor'],
    togri: 2,
    izoh: 'Yer po\'stlog\'ida O 47%, Si 27,6%.',
  },
  {
    belgi: 'Agregat',
    savol: 'Normal sharoitda SUYUQ holatdagi yagona metallmas:',
    variantlar: ['Brom (Br₂)', 'Yod', 'Oltingugurt', 'Simob (Hg)'],
    togri: 0,
    izoh: 'Simob suyuq metall; Brom yagona suyuq metallmas.',
  },
  {
    belgi: '16-jadval',
    savol: 'VIA va VIIA guruh metallmaslari qanday ataladi?',
    variantlar: ['Pniktogen va ishqor', 'Lantanoid va aktinoid', 'Inert metallar', 'Xalkogenlar (VIA) va Galogenlar (VIIA)'],
    togri: 3,
    izoh: 'VIA — xalkogenlar, VIIA — galogenlar.',
  },
  {
    belgi: 'Oila',
    savol: 'H va He dan tashqari barcha metallmaslar qaysi oilaga kiradi?',
    variantlar: ['s-elementlar', 'p-elementlar', 'f-elementlar', 'd-elementlar'],
    togri: 1,
    izoh: 'Oxirgi elektroni p-orbitalga tushadi.',
  },
  {
    belgi: '1962-yil',
    savol: 'Inert gazlar ham reaksiyaga kirishishini isbotlagan ilk birikma:',
    variantlar: ['HeCl₂', 'XeF₄ (ksenon tetraftorid)', 'NeO₂', 'ArF'],
    togri: 1,
    izoh: '1962-yilda XeF₄ sintez qilindi.',
  },
  {
    belgi: '92-bet',
    savol: 'HCl, H₂S, NH₃ gaz bo\'lib, nega H₂O suyuq?',
    variantlar: ['Massasi og\'ir', 'Metallik bog\'i bor', 'Ion bog\'li', 'Molekulalararo vodorod bog\'i (H₂O)n tufayli'],
    togri: 3,
    izoh: 'Suv molekulalari vodorod bog\'i bilan assotsiatsiyalanadi.',
  },
  {
    belgi: '1-savol',
    savol: 'a) C/N; b) S/P; f) O/Cl juftlaridan elektronni kuchli tortadiganlari:',
    variantlar: ['N (C dan), S (P dan), O (Cl dan)', 'N, P, Cl', 'C, P, Cl', 'C, S, O'],
    togri: 0,
    izoh: 'F > O > Cl > N > S > C > H > P > Si.',
  },
  {
    belgi: 'NEM',
    savol: 'Metallmaslar nisbiy elektromanfiyligi (NEM) qaysi oraliqda?',
    variantlar: ['0,7 – 1,5', '5,0 – 10,0', '1,8 – 4,00 (eng katta F = 4,0)', 'Faqat 2,0'],
    togri: 2,
    izoh: 'Si ≈ 1,9 dan F = 4,00 gacha.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '90-bet: Oksidlovchilik qatori (F → Si)',
    vazifa: 'Elektron tortish kuchi KAMAYIB borishi tartibida joylang:',
    tartib: [
      'F (4,00 — eng kuchli)',
      'O (3,44) → Cl (3,16) → N (3,04)',
      'S (2,58) → C (2,55) → P (2,19)',
      'H (2,20) → Si (1,90)',
    ],
    variantlar: [
      'S (2,58) → C (2,55) → P (2,19)',
      'F (4,00 — eng kuchli)',
      'H (2,20) → Si (1,90)',
      'O (3,44) → Cl (3,16) → N (3,04)',
    ],
  },
  {
    tur: '16-jadval: Vodorodli birikma',
    vazifa: 'IVA → VIIA guruh gidridlarini tartiblang:',
    tartib: [
      'IVA: RH₄ (CH₄, SiH₄)',
      'VA: RH₃ (NH₃, PH₃)',
      'VIA: H₂R (H₂O, H₂S)',
      'VIIA: HR (HF, HCl)',
    ],
    variantlar: [
      'VA: RH₃ (NH₃, PH₃)',
      'VIIA: HR (HF, HCl)',
      'IVA: RH₄ (CH₄, SiH₄)',
      'VIA: H₂R (H₂O, H₂S)',
    ],
  },
  {
    tur: '16-jadval: Yuqori oksidlar',
    vazifa: 'IIIA → VIIA guruh yuqori oksidlarini joylang:',
    tartib: [
      'IIIA: R₂O₃ (B₂O₃)',
      'IVA: RO₂ (CO₂, SiO₂)',
      'VA & VIA: R₂O₅ (N₂O₅), RO₃ (SO₃)',
      'VIIA: R₂O₇ (Cl₂O₇)',
    ],
    variantlar: [
      'VA & VIA: R₂O₅ (N₂O₅), RO₃ (SO₃)',
      'VIIA: R₂O₇ (Cl₂O₇)',
      'IIIA: R₂O₃ (B₂O₃)',
      'IVA: RO₂ (CO₂, SiO₂)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '90-bet: CO₂ da bog\'lanish va molekula xarakteri:',
    variantlar: ['Ion bog\'li', 'Bog\' qutbli kovalent, molekula chiziqli qutbsiz', 'Metall bog\'li', 'Vodorod bog\'li'],
    togri: 1,
    izoh: 'O=C=O (180°) dipollari o\'zaro yo\'qoladi.',
  },
  {
    savol: 'Vodorod (H) nega VIIA guruhida ham ko\'rsatiladi?',
    variantlar: ['Suyuq bo\'lgani uchun', 'Metall bo\'lgani uchun', '8 ē bor', 'Tashqi qavati to\'lishiga galogenlardek 1 ē kam (H⁻¹)'],
    togri: 3,
    izoh: 'He qobig\'iga (2 ē) 1 elektron yetmaydi.',
  },
  {
    savol: 'Metallmaslarning yuqori oksidlari (SO₃, P₂O₅, N₂O₅) xossasi:',
    variantlar: ['Kislotali oksidlar', 'Befarq', 'Asosli', 'Amfoter'],
    togri: 0,
    izoh: 'Suv va ishqorlar bilan kislota/tuz hosil qiladi.',
  },
  {
    savol: '92-bet 5-savol: Tabiatda ERKIN holda uchraydigan metallmaslar:',
    variantlar: ['F₂ va Cl₂', 'Faqat Si va P', 'N₂, O₂, inert gazlar, tug\'ma S, olmos/grafit', 'Br₂ va I₂'],
    togri: 2,
    izoh: 'Faol galogen, fosfor va kremniy erkin uchramaydi.',
  },
  {
    savol: 'Metallmaslarning elektr/issiqlik o\'tkazuvchanligi:',
    variantlar: ['Barchasi yarim o\'tkazgich', 'Metallardan yaxshi', 'Yomon o\'tkazgich (grafitdan tashqari)', 'Suvda yaxshi eriydi'],
    togri: 2,
    izoh: 'Odatda izolyator/dielektriklar.',
  },
  {
    savol: 'Koinotda eng ko\'p tarqalgan ikki metallmas:',
    variantlar: ['Vodorod (H) va Geliy (He)', 'O va Si', 'N va C', 'S va P'],
    togri: 0,
    izoh: 'Yulduz va koinotning asosini H va He tashkil qiladi.',
  },
  {
    savol: 'Qaysi qatorda BARCHA metallmaslar n.sh.da GAZ?',
    variantlar: ['Br₂, N₂, O₂', 'H₂, N₂, O₂, F₂, Cl₂, Ne, Ar', 'I₂, F₂, Cl₂', 'S, P, C'],
    togri: 1,
    izoh: 'Br₂ suyuq, I₂/S/P/C qattiq.',
  },
  {
    savol: 'F, O, Cl, N, S, C, P, H, Si qatorida eng kuchsiz oksidlovchi:',
    variantlar: ['F', 'O', 'Cl', 'Kremniy (Si = 1,90)'],
    togri: 3,
    izoh: '90-bet qatorining oxirida Si turadi.',
  },
];

export default function S8Mavzu21() {
  const korgazmalar = [
    { nom: '1. 16-jadval (Oilalar)', ikon: 'panjara', komponent: <KorgazmaJadval16Metallmas /> },
    { nom: '2. NEM qatori (F → Si)', ikon: 'chaqmoq', komponent: <KorgazmaMetallmasQatori /> },
    { nom: '3. Tabiatda (O 47%, Si 27,6%)', ikon: 'yadro', komponent: <KorgazmaTabiatTarqalish /> },
    { nom: '4. Agregat & (H₂O)n', ikon: 'kristall', komponent: <KorgazmaAgregatHolat /> },
    { nom: '5. Vodorod & XeF₄ (1962)', ikon: 'atom', komponent: <KorgazmaVodorodVaInert /> },
    { nom: '6. 6 ta xulosa & CO₂', ikon: 'kitob', komponent: <KorgazmaOltiXulosa /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-21"
          nom="Metallmaslarni guruhlang"
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
          key="tezkor-21"
          nom="21-§: Metallmaslar"
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
          key="zanjir-21"
          nom="NEM & 16-jadval zanjiri"
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
          key="duel-21"
          sarlavha="21-§: Metallmaslar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="21-§"
      mavzuNom="Metallmaslarning umumiy xossalari"
      oldingiRaqam="20-§"
      oldingiNom="Oksidlanish-qaytarilish reaksiyalari tenglamalarini tuzish"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
