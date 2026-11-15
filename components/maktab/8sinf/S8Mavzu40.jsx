'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 40-PARAGRAF
// "Fosfor" (Darslik 174-177-betlar)
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
function KorgazmaFosforAtomi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Fosfor atomi (Z=15) va qo&apos;zg&apos;algan holat"
      ikon="atom"
      variantlar={[
        {
          id: 'atom',
          tugma: 'Atom (2, 8, 5)',
          formula: '₁₅³¹P • 15p⁺, 16n⁰, 15ē • VA guruh',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Fosfor atomi: 3 ta elektron qavati',
            tenglama: '1s² 2s² 2p⁶ 3s² 3p³ 3d⁰   |   Ar(P) = 31',
            rejim: 'atom',
            markaz: { belgi: '+15', rang: '#f97316', r: 24 },
            qavatlar: [2, 8, 5],
            belgilar: [
              { k: 'Proton/Neytron', v: '15p⁺ / 16n⁰', rang: '#38bdf8' },
              { k: 'OD', v: '-3, 0, +3, +5', rang: '#fbbf24' },
            ],
          },
          pastki: ['Z = 15, Ar = 31', 'Tashqi qavat: 5 ē', '3s, 3p va bo\'sh 3d'],
        },
        {
          id: 'qozgalish',
          tugma: 'III vs V valent',
          formula: '3s²3p³ (III) → 3s¹3p³3d¹ (V valent)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'N da 2d yo\'q (max IV), P da 3d bor (V valent!)',
            tenglama: 'Asosiy: 3s²3p³ (PH₃, PCl₃)  →  Qo\'zg\'algan: 3s¹3p³3d¹ (P₂O₅, PCl₅)',
            rejim: 'molekula',
            markaz: { belgi: 'P⁵⁺', rang: '#fb923c', r: 24, zaryad: 'V' },
            atomlar: [
              { belgi: 'O', rang: '#ef4444', r: 17, masofa: 84, bog: 2, burchak: -1.3 },
              { belgi: 'O', rang: '#ef4444', r: 17, masofa: 84, bog: 2, burchak: 0 },
              { belgi: 'OH', rang: '#fb7185', r: 17, masofa: 84, bog: 1, burchak: 1.5 },
              { belgi: 'OH', rang: '#fb7185', r: 17, masofa: 84, bog: 1, burchak: 3.14 },
            ],
            metrikalar: [
              { nom: 'Asosiy (3 toq ē)', qiymat: 'III valent', foiz: 60, rang: '#38bdf8' },
              { nom: 'Qo\'zg\'algan (5 toq ē)', qiymat: 'V valent', foiz: 100, rang: '#f97316' },
            ],
            belgilar: [{ k: 'Sabab', v: 'Bo\'sh 3d-qavatcha', rang: '#34d399' }],
          },
          pastki: ['3 toq ē → III valent (PH₃, P₂O₃)', '5 toq ē → V valent (P₂O₅, H₃PO₄)', 'Azotdan farqi: 3d bor'],
        },
      ]}
    />
  );
}

function KorgazmaAllotropiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Fosfor allotropiyasi (22-jadval)"
      ikon="kristall"
      variantlar={[
        {
          id: 'oq',
          tugma: 'Oq fosfor (P₄)',
          formula: 'P₄ • molekulyar • Ts=44°C • 40°C yonadi • 0,1 g o\'lim!',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Oq fosfor: P₄ tetraedr (1669 X.Brendt)',
            tenglama: 'ρ = 1,8 g/cm³  |  CS₂ da eriydi  |  Qorong\'ida shu\'lalanadi',
            rejim: 'molekula',
            markaz: { belgi: 'P', rang: '#fde047', r: 21 },
            atomlar: [
              { belgi: 'P', rang: '#fde047', r: 19, masofa: 76, bog: 1, burchak: -1.57 },
              { belgi: 'P', rang: '#fef08a', r: 19, masofa: 76, bog: 1, burchak: 0.52 },
              { belgi: 'P', rang: '#fde047', r: 19, masofa: 76, bog: 1, burchak: 2.62 },
            ],
            metrikalar: [
              { nom: 'Zichlik (suv ostida)', qiymat: '1,8 g/cm³', foiz: 55, rang: '#fde047' },
              { nom: 'Zaharlilik (0,1 g)', qiymat: 'O\'ta zaharli!', foiz: 98, rang: '#ef4444' },
              { nom: 'Yonish harorati', qiymat: '40°C (o\'z-o\'zidan)', foiz: 20, rang: '#f97316' },
            ],
            belgilar: [{ k: 'Saqlash', v: 'Suv ostida!', rang: '#38bdf8' }],
          },
          pastki: ['"Yorug\'lik tashuvchi" (1669, X.Brendt)', 'CS₂ da eriydi, qorong\'ida nur sochadi', 'Suv ostida saqlanadi'],
        },
        {
          id: 'qizil',
          tugma: 'Qizil fosfor (Pn)',
          formula: 'Pn • atom panjara • CS₂ erimaydi • zaharsiz • 250°C',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Qizil fosfor: Polimer zanjir (A.Shretter, 1847)',
            tenglama: 'P₄ →(300°C, O₂ siz) Pn   |   ρ = 2,0–2,4 g/cm³',
            rejim: 'kristall',
            kristallTuri: 'atom',
            metrikalar: [
              { nom: 'Zichlik', qiymat: '2,0–2,4 g/cm³', foiz: 72, rang: '#ef4444' },
              { nom: 'CS₂ da eruvchanlik', qiymat: 'Erimaydi', foiz: 5, rang: '#34d399' },
              { nom: 'Yonish harorati', qiymat: '250°C (zaharsiz)', foiz: 65, rang: '#f97316' },
            ],
            belgilar: [{ k: 'Kashf', v: '1847 A.Shretter (300°C)', rang: '#fb7185' }],
          },
          pastki: ['Atom panjarali polimer', 'Zaharsiz, CS₂ da erimaydi', 'Xavfsiz gugurt qutisida'],
        },
        {
          id: 'qora',
          tugma: 'Qora fosfor (P)',
          formula: 'Grafitga o\'xshash • ρ=2,7 • yarim o\'tkazgich (1934)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Qora fosfor: P.Bridjmen (1934, 200°C va yuqori bosim)',
            tenglama: 'ρ = 2,7 g/cm³  |  490°C da yonadi  |  Eng barqaror',
            rejim: 'kristall',
            kristallTuri: 'metall',
            metrikalar: [
              { nom: 'Zichlik', qiymat: '2,7 g/cm³', foiz: 88, rang: '#94a3b8' },
              { nom: 'Elektr o\'tkazish', qiymat: 'Yarim o\'tkazgich', foiz: 70, rang: '#38bdf8' },
              { nom: 'Yonish', qiymat: '490°C (qiyin)', foiz: 95, rang: '#34d399' },
            ],
            belgilar: [{ k: 'Tuzilish', v: 'Grafitga o\'xshash qatlam', rang: '#cbd5e1' }],
          },
          pastki: ['P.Bridjmen (1934, yuqori bosim)', 'Elektr tokini qisman o\'tkazadi', 'CS₂ da erimaydi, zaharsiz'],
        },
      ]}
    />
  );
}

function KorgazmaTabiatOlish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Tabiatda uchrashi va elektr pechda olinishi"
      ikon="kolba"
      variantlar={[
        {
          id: 'pech',
          tugma: 'Elektr pech (1500°C)',
          formula: 'Ca₃(PO₄)₂ + 5C + 3SiO₂ → 3CaSiO₃ + 2P + 5CO↑',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Fosforitni koks va qum bilan elektr pechda qaytarish',
            tenglama: 'Ca₃(PO₄)₂ + 5C + 3SiO₂ →(1500°C) 3CaSiO₃ + 2P↑ + 5CO↑',
            bosqichlar: [
              { nom: 'Shixta yuklash', tur: 'minora', ichi: 'Fosforit+C+SiO₂', mahsulot: 'Aralashma', rang: '#a855f7' },
              { nom: 'Elektr pech (1500°C)', tur: 'pech', ichi: 'Ca₃(PO₄)₂+5C+3SiO₂', mahsulot: '2P(gaz)+5CO', rang: '#f97316' },
              { nom: 'Suv osti sovutkich', tur: 'sovutkich', ichi: 'P bug\'i + suv', mahsulot: 'Oq P₄(q)', rang: '#fde047' },
            ],
            belgilar: [{ k: 'Shlak', v: 'CaSiO₃', rang: '#94a3b8' }],
          },
          pastki: ['Qizilqum: Jeroy-Sardara phosphoriti', '1500°C elektr pechda', 'P bug\'i suv ostida P₄ bo\'ladi'],
        },
        {
          id: 'tabiat',
          tugma: 'Tabiat & Jeroy',
          formula: 'Ca₃(PO₄)₂ • Suyak • DNK/RNK • ATF',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Fosforning tabiiy minerallari va biologik o\'rni',
            tenglama: 'Fosforit va Apatit: Ca₃(PO₄)₂   |   Tirik organizmda ~1,5 kg',
            markazBelgi: 'PO₄³⁻',
            markazRang: '#f97316',
            tugunlar: [
              { nom: 'Jeroy-Sardara', belgi: 'Ca₃(PO₄)₂', rang: '#fbbf24' },
              { nom: 'Apatit', belgi: 'Ftorapatit', rang: '#38bdf8' },
              { nom: 'Suyak & Tish', belgi: '600 g P', rang: '#e2e8f0' },
              { nom: 'DNK/RNK & ATF', belgi: 'Energiya', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Tabiatda', v: 'Faqat birikma holda!', rang: '#fb7185' }],
          },
          pastki: ['Erkin holda uchramaydi', 'O\'zbekiston: Qizilqum (Jeroy-Sardara)', 'Suyak, tish, DNK va ATF tarkibi'],
        },
      ]}
    />
  );
}

function KorgazmaKimyoGugurt() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Kimyoviy xossalari va fosfin (PH₃)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kislorod_xlor',
          tugma: 'O₂, S va Cl₂ bilan',
          formula: '4P+5O₂→2P₂O₅  |  2P+3S→P₂S₃  |  PCl₃ / PCl₅',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Fosforning metallmaslar bilan reaksiyalari',
            tenglama: 'Mo\'l O₂: P₂O₅  |  Kam O₂: P₂O₃  |  Mo\'l Cl₂: PCl₅',
            suyuqlikRang: '#f97316',
            tolish: 0.4,
            stakanBelgi: 'P₄ / Pn',
            stakanSarlavha: 'Yorqin alanga',
            gazRang: '#f8fafc',
            gazBelgi: 'P₂O₅ tutun',
            qizdir: true,
            olovRang: '#fbbf24',
            tempC: 280,
            maxTemp: 400,
            reagentlar: [{ belgi: 'O₂ / Cl₂', rang: '#a3e635' }],
            belgilar: [{ k: 'Oq tutun', v: 'P₂O₅ (qattiq)', rang: '#e2e8f0' }],
          },
          pastki: ['4P + 5O₂(mo\'l) = 2P₂O₅ (oq tutun)', '2P + 3S = P₂S₃; 2P + 3Cl₂ = 2PCl₃', 'Mo\'l xlor bilan PCl₅'],
        },
        {
          id: 'fosfid_fosfin',
          tugma: 'Ca₃P₂ → PH₃↑',
          formula: '3Ca + 2P → Ca₃P₂  |  Ca₃P₂ + 6H₂O → 2PH₃↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Metallar bilan oksidlovchi P⁻³ → Zaharli fosfin',
            tenglama: 'Ca₃P₂ + 6H₂O = 3Ca(OH)₂ + 2PH₃↑  (sarimsoq hidli!)',
            suyuqlikRang: '#a7f3d0',
            tolish: 0.72,
            stakanBelgi: 'Ca(OH)₂',
            stakanSarlavha: 'Fosfid gidrolizi',
            gazRang: '#a3e635',
            gazBelgi: 'PH₃↑',
            reagentlar: [{ belgi: 'Ca₃P₂', rang: '#fb923c' }],
            belgilar: [{ k: 'PH₃', v: 'Zaharli, o\'z-o\'zidan yonadi', rang: '#ef4444' }],
          },
          pastki: ['2P + 3Ca = Ca₃P₂ (kaltsiy fosfid)', 'PH₃ — zaharli, yomon hidli gaz', 'P + 3Na → Na₃P'],
        },
      ]}
    />
  );
}

function KorgazmaGugurtIshlatilish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Gugurt reaksiyasi (KClO₃) va ishlatilishi"
      ikon="nurlar"
      variantlar={[
        {
          id: 'gugurt',
          tugma: 'Xavfsiz gugurt',
          formula: '6P(qizil) + 5KClO₃ → 5KCl + 3P₂O₅',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Gugurt qutisi yonida qizil fosfor va boshchada KClO₃',
            tenglama: '6P + 5KClO₃ →(ishqalanish) 5KCl + 3P₂O₅ + Q',
            suyuqlikRang: '#ef4444',
            tolish: 0.4,
            stakanBelgi: 'KClO₃+S',
            stakanSarlavha: 'Quti: Qizil P + shisha',
            gazRang: '#f8fafc',
            gazBelgi: 'P₂O₅',
            qizdir: true,
            olovRang: '#fb923c',
            tempC: 260,
            maxTemp: 400,
            reagentlar: [{ belgi: 'Pn', rang: '#dc2626' }],
            belgilar: [{ k: 'KClO₃', v: 'Bertole tuzi', rang: '#fbbf24' }],
          },
          pastki: ['Quti yoni: qizil P + shisha kukuni + yelim', 'Cho\'p boshi: KClO₃ + S + yelim', '6P + 5KClO₃ = 5KCl + 3P₂O₅'],
        },
        {
          id: 'sohalar',
          tugma: 'Qo\'llanish',
          formula: 'H₃PO₄ • O\'g\'it • Gugurt • Tutun parda',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Fosforning sanoat va xo\'jalikdagi asosiy yo\'nalishlari',
            tenglama: 'Fosfatli o\'g\'it • Qizil gugurt • Oq P tutun/yorituvchi snaryad',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'H₃PO₄ & O\'g\'it', qiymat: 76, yorliq: '76%', rang: '#34d399' },
              { nom: 'Gugurt (Pn)', qiymat: 10, yorliq: '10%', rang: '#ef4444' },
              { nom: 'Metallurgiya/Bronza', qiymat: 8, yorliq: '8%', rang: '#38bdf8' },
              { nom: 'Tutun/Harbiy', qiymat: 6, yorliq: '6%', rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Asosiy', v: 'H₃PO₄ va o\'g\'it', rang: '#34d399' }],
          },
          pastki: ['Fosfat kislota va o\'g\'itlar', 'Gugurt sanoati (qizil P)', 'Tutun pardalar va fosforli bronza'],
        },
      ]}
    />
  );
}

function Korgazma40Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Pech (62 g P) va gugurt (20,42 g KClO₃) masalalari"
      ikon="formula"
      variantlar={[
        {
          id: 'pech_masala',
          tugma: '1-misol: 62 g P',
          formula: '310 g Ca₃(PO₄)₂ + C + SiO₂ → m(P) = ?',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ca₃(PO₄)₂ + 5C + 3SiO₂ → 3CaSiO₃ + 2P + 5CO↑',
            tenglama: 'M(Ca₃(PO₄)₂) = 310 g/mol   →   1 mol tuz → 2 mol P',
            qadamlar: [
              { belgi: 'n(Ca₃(PO₄)₂)', natija: '1 mol', izoh: '310 / 310', rang: '#38bdf8' },
              { belgi: 'n(P) = 1 · 2', natija: '2 mol', izoh: '1 : 2 nisbat', rang: '#fbbf24' },
              { belgi: 'm(P) = 2 · 31', natija: '62 g', izoh: 'Sof fosfor', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Ca₃(PO₄)₂ (310 g)', foiz: 100, qiymat: '1 mol', rang: '#a855f7' },
              { nom: 'Fosfor P (62 g)', foiz: 20, qiymat: '2 mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 62 g fosfor olinadi',
          },
          pastki: ['M(Ca₃(PO₄)₂) = 3·40 + 2·95 = 310 g/mol', '1 mol tuz → 2 mol P', '2 × 31 = 62 g'],
        },
        {
          id: 'gugurt_masala',
          tugma: '2-misol: 20,42 g KClO₃',
          formula: '6,2 g qizil P + ? g KClO₃ (6P + 5KClO₃)',
          tur: 'hisob',
          cfg: {
            sarlavha: '6,2 g P bilan reaksiyaga kirishuvchi Bertole tuzi massasi',
            tenglama: '6P + 5KClO₃ → 5KCl + 3P₂O₅   |   M(KClO₃) = 122,5 g/mol',
            qadamlar: [
              { belgi: 'n(P) = 6,2/31', natija: '0,2 mol', izoh: 'Ar(P) = 31', rang: '#ef4444' },
              { belgi: 'n(KClO₃)', natija: '0,1667 mol', izoh: '0,2 · 5 / 6', rang: '#fbbf24' },
              { belgi: 'm = 0,1667·122,5', natija: '20,42 g', izoh: 'Bertole tuzi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Qizil P (0,2 mol)', foiz: 30, qiymat: '6,2 g', rang: '#ef4444' },
              { nom: 'KClO₃ (0,167 mol)', foiz: 100, qiymat: '20,42 g', rang: '#34d399' },
            ],
            javobBadge: 'Javob: m(KClO₃) = 20,42 g',
          },
          pastki: ['n(P) = 6,2 / 31 = 0,2 mol', '6 : 5 → n(KClO₃) = 1/6 mol', '122,5 / 6 = 20,42 g'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (39-§) VA O'YINLAR (40-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Au va Pt ni erituvchi "zar suvi" tarkibi:',
    variantlar: [
      { matn: '1 HNO₃ + 1 H₂SO₄', togri: false },
      { matn: '3 hajm HNO₃ + 1 hajm HCl', togri: false },
      { matn: '1 hajm HNO₃ + 3 hajm HCl', togri: true },
      { matn: 'Suvsiz HNO₃', togri: false },],
    izoh: '1 HNO₃ : 3 HCl nisbatida "zar suvi" tayyorlanadi.',
  },
  {
    id: 't2',
    savol: 'Cu + 4HNO₃(kons) va 3Cu + 8HNO₃(suyul) dan qaysi gazlar chiqadi?',
    variantlar: [
      { matn: 'Kons: NO₂↑; Suyul: NO↑', togri: true },
      { matn: 'Ikkalasidan H₂', togri: false },
      { matn: 'NH₃↑ va N₂↑', togri: false },
      { matn: 'SO₂↑ va H₂S↑', togri: false },],
    izoh: 'HNO₃ metallar bilan H₂ bermaydi.',
  },
  {
    id: 't3',
    savol: '2Cu(NO₃)₂ →(t°) parchalanish mahsulotlari:',
    variantlar: [
      { matn: '2Cu(NO₂)₂ + O₂', togri: false },
      { matn: '2Cu + 4NO₂ + O₂', togri: false },
      { matn: 'Cu₃N₂ + 3O₂', togri: false },
      { matn: '2CuO + 4NO₂↑ + O₂↑', togri: true },],
    izoh: 'Mg–Cu nitratlari oksid + NO₂ + O₂ beradi.',
  },
  {
    id: 't4',
    savol: '56,47% O, 16,47% N, 27,06% Na li tuz formulasi va 340 g dan chiqqan O₂:',
    variantlar: [
      { matn: 'NaNO₂ • 11,2 l', togri: false },
      { matn: 'NaNO₃ • 44,8 l', togri: true },
      { matn: 'NH₄NO₃ • 89,6 l', togri: false },
      { matn: 'KNO₃ • 22,4 l', togri: false },],
    izoh: 'NaNO₃ (M=85) → 4 mol → 2 mol O₂ = 44,8 litr.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'atom_tabiat', nom: 'Atom & Tabiat', tavsif: 'Z=15, 3s¹3p³3d¹, Jeroy' },
    { id: 'allotrop', nom: 'Allotropiya (22-j)', tavsif: 'Oq P₄, Qizil Pn, Qora P' },
    { id: 'olish_kimyo', nom: 'Olish & Reaksiya', tavsif: '1500°C pech, PH₃, gugurt' },
  ],
  topshiriqlar: [
    { nom: '₁₅P: 3s²3p³ → 3s¹3p³3d¹', qisqa: 'III va V valentlik', guruh: 'atom_tabiat', izoh: 'Bo\'sh 3d-qavatcha tufayli.' },
    { nom: 'Jeroy-Sardara (Qizilqum)', qisqa: 'Ca₃(PO₄)₂ fosforit koni', guruh: 'atom_tabiat', izoh: 'O\'zbekiston fosforit zaxirasi.' },
    { nom: 'OD = -3, 0, +3, +5', qisqa: 'Asosiy oksidlanish darajasi', guruh: 'atom_tabiat', izoh: 'PH₃(-3), P₂O₃(+3), P₂O₅(+5).' },
    { nom: 'Oq P₄: Ts=44°C, 0,1 g o\'lim', qisqa: 'CS₂ da eriydi, suv ostida', guruh: 'allotrop', izoh: 'Qorong\'ida nur sochadi.' },
    { nom: 'Qizil Pn: atom, zaharsiz', qisqa: 'CS₂ erimaydi, 250°C yonadi', guruh: 'allotrop', izoh: 'A.Shretter (1847, 300°C).' },
    { nom: 'Qora P: grafitdek, ρ=2,7', qisqa: 'Yarim o\'tkazgich (1934)', guruh: 'allotrop', izoh: 'P.Bridjmen yuqori bosimda olgan.' },
    { nom: 'Ca₃(PO₄)₂ + 5C + 3SiO₂', qisqa: '1500°C pech → 2P + 5CO↑', guruh: 'olish_kimyo', izoh: '+ 3CaSiO₃ shlak.' },
    { nom: 'Ca₃P₂ + 6H₂O → 2PH₃↑', qisqa: 'Fosfin (zaharli gaz)', guruh: 'olish_kimyo', izoh: '3Ca + 2P = Ca₃P₂ dan olinadi.' },
    { nom: '6P + 5KClO₃ → 5KCl + 3P₂O₅', qisqa: 'Xavfsiz gugurt reaksiyasi', guruh: 'olish_kimyo', izoh: 'Quti yonida qizil P.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Valentlik',
    savol: 'Nima uchun fosfor N dan farqli V valentli bo\'la oladi?',
    variantlar: ['2d qavati bor', 'Atom radiusi kichik', 'Bo\'sh 3d-qavatcha mavjud', 'Gaz modda'],
    togri: 2,
    izoh: '3s²3p³ → 3s¹3p³3d¹ ga qo\'zg\'aladi.',
  },
  {
    belgi: '22-jadval',
    savol: 'Oq P₄ qayerda va qanday saqlanadi?',
    variantlar: ['Suv ostida (40°C da o\'zi yonadi)', 'Havoda ochiq', 'CS₂ ichida', 'Spirtda'],
    togri: 0,
    izoh: 'Oq fosfor suv ostida saqlanadi; juda zaharli (0,1 g).',
  },
  {
    belgi: 'Sanoat',
    savol: 'Ca₃(PO₄)₂ + 5C + 3SiO₂ →(1500°C) shlak va gaz mahsuloti:',
    variantlar: ['CaO va N₂', 'CaCO₃ va H₂', 'CaCl₂ + POCl₃', '3CaSiO₃ + 2P + 5CO↑'],
    togri: 3,
    izoh: 'Elektr pechda oq fosfor bug\'i va CO chiqadi.',
  },
  {
    belgi: 'Fosfin',
    savol: 'Ca₃P₂ + 6H₂O → 3Ca(OH)₂ + ? qaysi gaz chiqadi?',
    variantlar: ['H₂↑', '2PH₃↑ (fosfin)', 'PO₂↑', 'O₂↑'],
    togri: 1,
    izoh: 'PH₃ — zaharli, sarimsoq hidli gaz.',
  },
  {
    belgi: 'Qizil P',
    savol: 'Qizil fosforning CS₂ da eruvchanligi va zaharliligi:',
    variantlar: ['Eriydi va o\'ta zaharli', 'Erimaydi va zaharsiz', 'Suvda eriydi', '40°C da yonadi'],
    togri: 1,
    izoh: 'Qizil Pn — atom panjarali, zaharsiz.',
  },
  {
    belgi: 'Xlorid',
    savol: 'Fosfor mo\'l xlor bilan qaysi modda beradi?',
    variantlar: ['PCl₃', 'HCl', 'PCl₂', 'PCl₅'],
    togri: 3,
    izoh: 'Xlor kamida PCl₃, mo\'lida PCl₅.',
  },
  {
    belgi: 'Gugurt',
    savol: 'Gugurt cho\'pini qutiga ishqalaganda KClO₃ bilan nima reaksiyaga kirishadi?',
    variantlar: ['Qizil Pn (6P+5KClO₃)', 'Qora P', 'Oq P₄', 'Kaltsiy'],
    togri: 0,
    izoh: 'Quti yoniga qizil fosfor surtiladi.',
  },
  {
    belgi: 'Kashf',
    savol: '1669-yilda fosforni kim ochgan va nomi nimani bildiradi?',
    variantlar: ['Shretter — "qizil"', 'Bridjmen — "qora"', 'X.Brendt — "yorug\'lik tashuvchi"', 'Boyl — "shaffof"'],
    togri: 2,
    izoh: 'Nemis alkimyogari X.Brendt (1669).',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Sanoat: Fosforit → Oq → Qizil → P₂O₅',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. Elektr pech: Ca₃(PO₄)₂+5C+3SiO₂ → 2P',
      '2. Suv ostida sovutib oq P₄ olish',
      '3. 300°C (O₂ siz): oq P₄ → qizil Pn',
      '4. 4P + 5O₂ → 2P₂O₅ (oq tutun)',
    ],
    variantlar: [
      '3. 300°C (O₂ siz): oq P₄ → qizil Pn',
      '1. Elektr pech: Ca₃(PO₄)₂+5C+3SiO₂ → 2P',
      '4. 4P + 5O₂ → 2P₂O₅ (oq tutun)',
      '2. Suv ostida sovutib oq P₄ olish',
    ],
  },
  {
    tur: '1-misol: 310 g Ca₃(PO₄)₂ → 62 g P',
    vazifa: 'Hisob tartibini tuzing:',
    tartib: [
      '1. M(Ca₃(PO₄)₂) = 310 g/mol',
      '2. n(tuz) = 310 / 310 = 1 mol',
      '3. 1 mol tuz → 2 mol P',
      '4. m(P) = 2 · 31 = 62 g',
    ],
    variantlar: [
      '2. n(tuz) = 310 / 310 = 1 mol',
      '4. m(P) = 2 · 31 = 62 g',
      '1. M(Ca₃(PO₄)₂) = 310 g/mol',
      '3. 1 mol tuz → 2 mol P',
    ],
  },
  {
    tur: '2-misol: 6,2 g P → 20,42 g KClO₃',
    vazifa: 'Hisob qadamlarini tartiblang:',
    tartib: [
      '1. Reaksiya: 6P + 5KClO₃ → 5KCl + 3P₂O₅',
      '2. n(P) = 6,2 / 31 = 0,2 mol',
      '3. n(KClO₃) = 0,2 · 5/6 = 0,1667 mol',
      '4. m(KClO₃) = 0,1667 · 122,5 = 20,42 g',
    ],
    variantlar: [
      '3. n(KClO₃) = 0,2 · 5/6 = 0,1667 mol',
      '4. m(KClO₃) = 0,1667 · 122,5 = 20,42 g',
      '1. Reaksiya: 6P + 5KClO₃ → 5KCl + 3P₂O₅',
      '2. n(P) = 6,2 / 31 = 0,2 mol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Fosfor atomi elektron formulasi:',
    variantlar: ['1s²2s²2p³', '1s²2s²2p⁶3s²3p³', '1s²2s²2p⁶3s²3p⁵', '1s²2s²2p⁶3s¹'],
    togri: 1,
    izoh: '₁₅P — tashqi qavatida 3s² 3p³.',
  },
  {
    savol: 'Qora fosfor nechanchi yilda va kim tomonidan olingan?',
    variantlar: ['1847 A.Shretter', '1869 Mendeleyev', '1669 X.Brendt', '1934 P.Bridjmen'],
    togri: 3,
    izoh: '200°C va yuqori bosimda P.Bridjmen olgan.',
  },
  {
    savol: 'Oq P₄ qaysi erituvchida yaxshi eriydi?',
    variantlar: ['Uglerod disulfid (CS₂) da', 'Benzinda', 'Suvda', 'HCl da'],
    togri: 0,
    izoh: 'P₄ molekulyar panjara — CS₂ da eriydi.',
  },
  {
    savol: '2P + 3Ca → ? mahsuloti nima deb ataladi?',
    variantlar: ['Kaltsiy fosfat', 'Kaltsiy fosfit', 'Kaltsiy fosfid (Ca₃P₂)', 'Kaltsiy nitrid'],
    togri: 2,
    izoh: 'P⁻³ birikmasi — fosfid.',
  },
  {
    savol: 'O\'zbekistonda yirik fosforit koni:',
    variantlar: ['Chorbog\'', 'Olmaliq', 'Jeroy-Sardara (Qizilqum)', 'Boysun'],
    togri: 2,
    izoh: 'Qizilqumdagi Jeroy-Sardara koni.',
  },
  {
    savol: 'Oq fosforning suyuqlanish harorati:',
    variantlar: ['44°C', '250°C', '490°C', '1500°C'],
    togri: 0,
    izoh: '44°C da eriydi, 40°C havoda o\'zi yonadi.',
  },
  {
    savol: '4P + 3O₂(yetishmaganda) = ?',
    variantlar: ['2P₂O₅', '2P₂O₃', '4PO₂', 'P₄O₁₀'],
    togri: 1,
    izoh: 'Kislorod kamida P(III) oksid — P₂O₃.',
  },
  {
    savol: 'Qizil fosfor olish uchun oq P necha gradusda qizdiriladi?',
    variantlar: ['44°C havoda', '1500°C suvda', '0°C bosimda', '300°C havosiz sharoitda'],
    togri: 3,
    izoh: 'O₂ ishtirokisiz 300°C da qizil Pn ga o\'tadi.',
  },
];

export default function S8Mavzu40() {
  const korgazmalar = [
    { nom: '1. Atom (3s¹3p³3d¹)', ikon: 'atom', komponent: <KorgazmaFosforAtomi /> },
    { nom: '2. Allotropiya (22-jadval)', ikon: 'kristall', komponent: <KorgazmaAllotropiya /> },
    { nom: '3. Tabiat & 1500°C pech', ikon: 'kolba', komponent: <KorgazmaTabiatOlish /> },
    { nom: '4. Kimyo & PH₃↑', ikon: 'uchqun', komponent: <KorgazmaKimyoGugurt /> },
    { nom: '5. Gugurt (KClO₃)', ikon: 'nurlar', komponent: <KorgazmaGugurtIshlatilish /> },
    { nom: '6. 62 g P & 20,42 g KClO₃', ikon: 'formula', komponent: <Korgazma40Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-40"
          nom="Fosfor xossalarini guruhlang"
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
          key="tezkor-40"
          nom="40-§: Fosfor"
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
          key="zanjir-40"
          nom="Pech & Gugurt zanjiri"
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
          key="duel-40"
          sarlavha="40-§: Fosfor dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="40-§"
      mavzuNom="Fosfor"
      oldingiRaqam="39-§"
      oldingiNom="Nitrat kislota"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
