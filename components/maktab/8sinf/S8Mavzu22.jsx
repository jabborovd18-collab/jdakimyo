'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 22-PARAGRAF
// "Galogenlarning davriy sistemadagi o'rni. Atom tuzilishi" (92-96-betlar)
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
function KorgazmaGalogenAtom() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. VIIA guruh atom tuzilishi (ns²np⁵) va Shveyger (1811)"
      ikon="atom"
      variantlar={[
        {
          id: 'ftor',
          tugma: 'Ftor (Z=9) — faqat -1',
          formula: '₉F: 1s² 2s² 2p⁵  •  2d yo\'q  •  NEM = 4,0  •  OD = -1',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Ftor atomi: 2 ta qavat, d-orbital yo\'q → faqat -1!',
            tenglama: '1811-yil I.Shveyger: "galogen" = "tuz hosil qiluvchi"',
            rejim: 'atom',
            markaz: { belgi: '+9', rang: '#fde047', r: 22 },
            qavatlar: [2, 7],
            belgilar: [
              { k: 'OD (F)', v: 'Faqat -1 (0 ham)', rang: '#fde047' },
              { k: 'At (Z=85)', v: 'Radioaktiv', rang: '#fb7185' },
            ],
          },
          pastki: ['F: 2s² 2p⁵, bo\'sh d-orbitali yo\'q', 'Shveyger (1811): galogen = tuz tug\'diruvchi', 'Barchasi ns²np⁵ → ikki atomli X₂'],
        },
        {
          id: 'xlor_br_i',
          tugma: 'Cl, Br, I (d-orbital bor)',
          formula: '₁₇Cl (2,8,7) • OD: -1, 0, +1, +3, +5, +7',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Xlor atomi (Z=17): bo\'sh 3d-orbitali hisobiga +1..+7 OD',
            tenglama: 'F → Cl → Br → I → At: radius ortadi, NEM va oksidlovchilik kamayadi',
            rejim: 'atom',
            markaz: { belgi: '+17', rang: '#34d399', r: 24 },
            qavatlar: [2, 8, 7],
            belgilar: [
              { k: 'Cl, Br, I', v: 'OD: -1, +1, +3, +5, +7', rang: '#34d399' },
              { k: 'Kashf', v: 'Cl₂ (1774), I₂ (1811)', rang: '#38bdf8' },
            ],
          },
          pastki: ['Cl, Br, I da bo\'sh d-qavatchalar bor', 'OD +7 gacha ko\'tariladi (HClO₄, KIO₄)', 'Sheyele Cl₂ (1774), Kurtua I₂ (1811)'],
        },
      ]}
    />
  );
}

function KorgazmaJadval17Tabiat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 17-jadval: Tabiatda tarqalishi va minerallar"
      ikon="yadro"
      variantlar={[
        {
          id: 'minerallar',
          tugma: 'Tabiiy minerallar',
          formula: 'CaF₂ (0,066%) • NaCl (0,05%) • MgBr₂ • KI (laminariya)',
          tur: 'biogen',
          cfg: {
            sarlavha: '17-jadval: Galogenlar tabiatda faqat birikma holda uchraydi',
            tenglama: 'Yer qobig\'ida Ftor (0,066%) Xlor (0,05%) dan ham ko\'p tarqalgan!',
            markazBelgi: '17-j.',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Ftor (0,066%)', belgi: 'Plavik CaF₂', rang: '#fde047' },
              { nom: 'Xlor (0,05%)', belgi: 'Galit NaCl, KCl', rang: '#34d399' },
              { nom: 'Brom (0,00021%)', belgi: 'MgBr₂ (sho\'r ko\'l)', rang: '#fb923c' },
              { nom: 'Yod (0,00004%)', belgi: 'Laminariya, KI', rang: '#c084fc' },
            ],
            belgilar: [{ k: 'Ftor konlari', v: 'Flyuorit CaF₂, apatit', rang: '#fde047' }],
          },
          pastki: ['F: plavik shpati (flyuorit) CaF₂, apatit', 'Cl: osh tuzi NaCl, silvin KCl', 'Br: sho\'r ko\'l; I: dengiz suvo\'ti (laminariya)'],
        },
        {
          id: 'ulush_grafik',
          tugma: 'Yer qobig\'i (%)',
          formula: 'F (0,066%) > Cl (0,05%) >> Br (0,00021%) > I (0,00004%)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Galogenlarning Yer qobig\'idagi tarqalish nisbati',
            tenglama: 'Tartib raqami ortishi bilan Yer po\'stlog\'idagi ulushi kamayadi',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F (0,066%)', qiymat: 100, yorliq: '0,066%', rang: '#fde047' },
              { nom: 'Cl (0,05%)', qiymat: 76, yorliq: '0,050%', rang: '#34d399' },
              { nom: 'Br (0,00021%)', qiymat: 14, yorliq: '0,00021%', rang: '#fb923c' },
              { nom: 'I (0,00004%)', qiymat: 6, yorliq: '0,00004%', rang: '#c084fc' },
            ],
            belgilar: [{ k: 'Eng ko\'p', v: 'Ftor (CaF₂)', rang: '#fde047' }],
          },
          pastki: ['Yer qobig\'ida F > Cl > Br > I', 'Dengiz suvida Cl⁻ ko\'p (~2%)', 'Ftorit (CaF₂) — metallurgiyada ham ishlatiladi'],
        },
      ]}
    />
  );
}

function KorgazmaOlinishVaAlmashinish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Olinishi (elektroliz) va o&apos;rin olish reaksiyalari"
      ikon="kolba"
      variantlar={[
        {
          id: 'f2_cl2',
          tugma: 'F₂ (elektroliz) & Cl₂',
          formula: '2KHF₂ →(el.) 2KF+H₂↑+F₂↑  |  2KMnO₄+10NaCl+8H₂SO₄ → 5Cl₂↑',
          tur: 'sanoat',
          cfg: {
            sarlavha: '93–94-betlar: F₂ va Cl₂ olish usullari',
            tenglama: 'F₂ faqat elektroliz bilan!  |  Cl₂ elektroliz yoki KMnO₄/MnO₂ bilan',
            bosqichlar: [
              { nom: '2KHF₂ suyuqlanma', tur: 'elektroliz', ichi: 'Elektroliz', mahsulot: 'F₂↑ + H₂↑', rang: '#fde047' },
              { nom: 'NaCl (lab KMnO₄)', tur: 'minora', ichi: 'KMnO₄+NaCl+H₂SO₄', mahsulot: '5Cl₂↑', rang: '#34d399' },
              { nom: 'Br⁻ / I⁻ tuzlari', tur: 'kataliz', ichi: 'Cl₂ + 2KBr/2KI', mahsulot: 'Br₂ / I₂↓', rang: '#fb923c' },
            ],
            belgilar: [{ k: 'Sabab (F₂)', v: 'Eng kuchli oksidlovchi', rang: '#fde047' }],
          },
          pastki: ['Ftorni kimyoviy oksidlovchi bilan olib bo\'lmaydi', 'Cl₂: 2KMnO₄ + 10NaCl + 8H₂SO₄ → 5Cl₂↑', 'NaCl eritmasi elektrolizi (sanoat)'],
        },
        {
          id: 'siqib_chiqarish',
          tugma: 'Br₂ va I₂ ajratish',
          formula: 'Cl₂ + 2KBr → 2KCl + Br₂  |  Cl₂/Br₂ + 2KI → I₂↓',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '95-bet: Har bir yuqori galogen pastdagisini tuzidan siqib chiqaradi',
            tenglama: 'Cl₂ → Br₂ & I₂   |   Br₂ → I₂ (+ kraxmal ko\'k rang!)   |   Teskari BORMAYDI',
            ikkiIdish: true,
            suyuqlikRang: '#ea580c',
            tolish: 0.72,
            stakanBelgi: '2KBr + Cl₂ → Br₂',
            stakanSarlavha: 'To\'q-sariq Br₂',
            ikkinchiSuyuqlikRang: '#1d4ed8',
            ikkinchiBelgi: 'I₂ + Kraxmal',
            ikkinchiSarlavha: 'Ko\'k kraxmal testi',
            chokmaRang: '#581c87',
            chokmaBelgi: 'I₂↓ kristall',
            belgilar: [{ k: 'Ehtiyot', v: 'I₂ + KCl ✗ (bormaydi)', rang: '#fb7185' }],
          },
          pastki: ['F₂ suvni ham portlatib oksidlaydi', 'Cl₂ bromid va yodiddan Br₂, I₂ chiqaradi', 'Br₂ faqat yodiddan I₂ ni siqib chiqaradi'],
        },
      ]}
    />
  );
}

function KorgazmaJadval18Fizik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 18-jadval: Fizik doimiylar, rang va sublimatsiya"
      ikon="harorat"
      variantlar={[
        {
          id: 'harorat',
          tugma: 'Ts & Tq (F₂ → I₂)',
          formula: 'F₂ (-220°/-188°) • Cl₂ (-101°/-34°) • Br₂ (-7°/+58°) • I₂ (+114°/+186°)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '18-jadval: Molekulyar massa ortishi bilan Ts/Tq va zichlik ortadi',
            tenglama: 'Gaz (F₂, Cl₂) → Suyuq (Br₂) → Qattiq kristall (I₂)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F₂ (och-sariq gaz)', qiymat: 18, yorliq: '1,696 g/l (-188°)', rang: '#fde047' },
              { nom: 'Cl₂ (sarg\'ish-yashil)', qiymat: 40, yorliq: '3,17 g/l (-34°)', rang: '#34d399' },
              { nom: 'Br₂ (qo\'ng\'ir suyuq)', qiymat: 70, yorliq: '3,10 g/cm³ (+58°)', rang: '#fb923c' },
              { nom: 'I₂ (to\'q-binafsha)', qiymat: 100, yorliq: '4,93 g/cm³ (+186°)', rang: '#c084fc' },
            ],
            belgilar: [{ k: 'Rang', v: 'F₂ → I₂ to\'qlashadi', rang: '#c084fc' }],
          },
          pastki: ['Zichlik: F₂ 1,696 g/l → I₂ 4,93 g/cm³', 'Rang och-sariqdan to\'q-binafshagacha to\'qlashadi', 'Molekulyar panjara (X₂)'],
        },
        {
          id: 'sublimatsiya',
          tugma: 'Yod sublimatsiyasi',
          formula: 'I₂ (qattiq) →(t°) I₂ (gunafsha bug\') — suyuqlanmasdan!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '94–95-betlar: Qattiq yodning suyuqlanmay bug\'lanishi (sublimatsiya)',
            tenglama: 'I₂ (to\'q kulrang kristall) → gunafsha bug\' → qayta kristallanadi',
            suyuqlikRang: '#581c87',
            tolish: 0.35,
            stakanBelgi: 'I₂(q) → I₂(g)',
            stakanSarlavha: 'Sublimatsiya',
            gazRang: '#a855f7',
            gazBelgi: 'Gunafsha bug\'',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 115,
            maxTemp: 200,
            belgilar: [{ k: 'Hodisa', v: 'Sublimatsiya (haydash)', rang: '#c084fc' }],
          },
          pastki: ['Qattiq → to\'g\'ri gaz = sublimatsiya', 'Sovuq devorda yana I₂ kristallari tushadi', 'Yodni tozalashda qo\'llanadi'],
        },
      ]}
    />
  );
}

function KorgazmaEruvchanlik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Suv va organik erituvchilarda eruvchanlik (94–95-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'suvda',
          tugma: 'Suvda (F₂..I₂)',
          formula: '2F₂+2H₂O→4HF+O₂  |  1:2 Cl₂  |  100 g suvda 0,02 g I₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '94-bet: Galogenlarning suvga munosabati',
            tenglama: 'F₂ suvni yondiradi  •  1 hajm suvda 2 hajm Cl₂  •  100 g da 0,02 g I₂',
            ikkiIdish: true,
            suyuqlikRang: '#d9f99d',
            tolish: 0.72,
            stakanBelgi: 'Xlorli suv (1:2)',
            stakanSarlavha: 'Cl₂+H₂O ⇄ HCl+HClO',
            ikkinchiSuyuqlikRang: '#fef08a',
            ikkinchiBelgi: '0,02 g I₂ / 100 g',
            ikkinchiSarlavha: 'Yod juda oz eriydi',
            gazRang: '#38bdf8',
            gazBelgi: 'F₂+H₂O→O₂',
            belgilar: [{ k: '2H₂O + 2F₂', v: '4HF + O₂↑ (alangali)', rang: '#fde047' }],
          },
          pastki: ['F₂ suv bilan reaksiyaga kirishib O₂ chiqaradi', 'Xlorli suv: 1 hajm suvda 2 hajm Cl₂', 'Yod suvda atigi 0,02 g/100 g eriydi'],
        },
        {
          id: 'organik',
          tugma: 'Organik erituvchilar',
          formula: 'Benzol, spirt (yod nastoykasi), benzin — "O\'xshash o\'xshashda"',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '95-bet: Qutbsiz Br₂ va I₂ organik erituvchilarda yaxshi eriydi',
            tenglama: 'I₂/H₂O + Benzol → yuqorida binafsha qatlam (ekstraksiya)  |  Spirt → nastoyka',
            ikkiIdish: true,
            suyuqlikRang: '#7e22ce',
            tolish: 0.74,
            stakanBelgi: 'Benzol (binafsha)',
            stakanSarlavha: 'Ekstraksiya',
            ikkinchiSuyuqlikRang: '#b45309',
            ikkinchiBelgi: 'Spirt (5% I₂)',
            ikkinchiSarlavha: 'Tibbiyot nastoykasi',
            belgilar: [{ k: 'Sabab', v: 'Qutbsiz X₂ qutbsiz muhitda', rang: '#c084fc' }],
          },
          pastki: ['Benzin, kerosin, benzolda yaxshi eriydi', 'Spirtdagi yod nastoykasi — antiseptik', 'Benzolda I₂ binafsha, Br₂ qo\'ng\'ir'],
        },
      ]}
    />
  );
}

function KorgazmaFaollikQatori() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Oksidlovchilik vs Qaytaruvchilik va 96-bet 5-masala"
      ikon="uchqun"
      variantlar={[
        {
          id: 'qatorlar',
          tugma: 'X₂ ↓ vs X⁻ ↑',
          formula: 'F₂ > Cl₂ > Br₂ > I₂ (oksidlovchi)  |  F⁻ < Cl⁻ < Br⁻ < I⁻ (qayt.)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '95-bet: Oksidlovchilik va qaytaruvchilik qarama-qarshi o\'zgaradi',
            tenglama: 'Radius ortishi bilan ē biriktirish qiyinlashadi (X₂ ↓), ē berish osonlashadi (X⁻ ↑)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F₂ (oks.) / F⁻ (yo\'q)', qiymat: 100, yorliq: 'F₂ eng kuchli oks.', rang: '#fde047' },
              { nom: 'Cl₂ / Cl⁻', qiymat: 78, yorliq: 'Kuchli oks. / kuchsiz qayt.', rang: '#34d399' },
              { nom: 'Br₂ / Br⁻', qiymat: 54, yorliq: 'O\'rtacha', rang: '#fb923c' },
              { nom: 'I₂ / I⁻ (eng kuchli)', qiymat: 30, yorliq: 'I⁻ eng kuchli qayt.', rang: '#c084fc' },
            ],
            belgilar: [{ k: 'I⁻ (HI)', v: 'Eng kuchli qaytaruvchi ion', rang: '#c084fc' }],
          },
          pastki: ['Oksidlovchilik kamayadi: F₂ > Cl₂ > Br₂ > I₂', 'Qaytaruvchilik ortadi: F⁻ < Cl⁻ < Br⁻ < I⁻', 'F⁻ elektron bermaydi'],
        },
        {
          id: 'masala5',
          tugma: '5-masala: 25,4 g I₂',
          formula: '2KI + Cl₂ = 2KCl + I₂  (25,4 g I₂ ← 2,24 l Cl₂)',
          tur: 'hisob',
          cfg: {
            sarlavha: '96-bet 5-masala: 25,4 g yod olish uchun zarur xlor hajmi (n.sh.)',
            tenglama: 'n(I₂) = 25,4 / 254 = 0,1 mol   →   n(Cl₂) = 0,1 mol',
            qadamlar: [
              { belgi: 'M(I₂) = 2·127', natija: '254 g/mol', izoh: 'Ikki atomli', rang: '#c084fc' },
              { belgi: 'n(I₂) = 25,4/254', natija: '0,1 mol', izoh: '1 : 1 nisbat Cl₂', rang: '#38bdf8' },
              { belgi: 'V(Cl₂) = 0,1·22,4', natija: '2,24 litr', izoh: 'n.sh.dagi hajm', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'I₂ (25,4 g)', foiz: 100, qiymat: '0,1 mol', rang: '#c084fc' },
              { nom: 'Cl₂ (2,24 l)', foiz: 100, qiymat: '0,1 mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: V(Cl₂) = 2,24 litr (0,1 mol)',
          },
          pastki: ['M(I₂) = 254 g/mol', 'n(Cl₂) = n(I₂) = 0,1 mol', '0,1 × 22,4 = 2,24 litr'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (21-§) VA O'YINLAR (22-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Yer qobig\'ida eng ko\'p tarqalgan ikki metallmas:',
    variantlar: [
      { matn: 'Azot va Uglerod', togri: false },
      { matn: 'Vodorod va Geliy', togri: false },
      { matn: 'Kislorod (47%) va Kremniy (27,6%)', togri: true },
      { matn: 'Ftor va Xlor', togri: false },],
    izoh: 'Yer po\'stlog\'ida O 47%, Si 27,6%.',
  },
  {
    id: 't2',
    savol: 'Normal sharoitda yagona suyuq metallmas:',
    variantlar: [
      { matn: 'Brom (Br₂)', togri: true },
      { matn: 'Simob', togri: false },
      { matn: 'Yod', togri: false },
      { matn: 'Oltingugurt', togri: false },],
    izoh: 'Brom (Br₂) qizil-qo\'ng\'ir suyuqlik.',
  },
  {
    id: 't3',
    savol: '1962-yilda inert gazlar reaksiyasini isbotlagan ilk birikma:',
    variantlar: [
      { matn: 'HeO₂', togri: false },
      { matn: 'ArCl₂', togri: false },
      { matn: 'NeF₂', togri: false },
      { matn: 'XeF₄ (ksenon tetraftorid)', togri: true },],
    izoh: 'Ksenon ftoridlari (XeF₄) sintez qilindi.',
  },
  {
    id: 't4',
    savol: 'Metallmaslarning NEM (nisbiy elektromanfiylik) oralig\'i:',
    variantlar: [
      { matn: '0,7 – 1,5', togri: false },
      { matn: '1,8 – 4,00 (eng yuqori F = 4,0)', togri: true },
      { matn: '0 – 1,0', togri: false },
      { matn: '5,0 – 10,0', togri: false },],
    izoh: 'Si ≈ 1,9 dan F = 4,0 gacha.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tuzilish_tab', nom: 'Atom & 17-jadval', tavsif: 'ns²np⁵, Shveyger, CaF₂' },
    { id: 'fizik_erish', nom: 'Fizik & Eruvchanlik', tavsif: '18-jadval, Br₂, I₂ subl.' },
    { id: 'faollik', nom: 'Olish & Faollik', tavsif: 'Elektroliz, X₂↓, X⁻↑' },
  ],
  topshiriqlar: [
    { nom: 'VIIA: ns² np⁵; F faqat -1', qisqa: '2d-orbitali yo\'q (EM=4,0)', guruh: 'tuzilish_tab', izoh: 'Cl, Br, I +7 gacha ko\'tariladi.' },
    { nom: 'I.Shveyger (1811): "galogen"', qisqa: '"Tuz hosil qiluvchi"', guruh: 'tuzilish_tab', izoh: 'Radioaktiv At (Z=85) ham VIIA.' },
    { nom: 'CaF₂ (0,066%) > NaCl (0,05%)', qisqa: '17-jadval: Ftor ko\'proq!', guruh: 'tuzilish_tab', izoh: 'Laminariya yod saqlaydi.' },
    { nom: 'F₂, Cl₂ gaz • Br₂ suyuq • I₂ qattiq', qisqa: '18-jadval agregat holat', guruh: 'fizik_erish', izoh: 'Molekulyar kristall panjara.' },
    { nom: 'I₂ (q) → gunafsha bug\' (subl.)', qisqa: 'Suyuqlanmasdan bug\'lanish', guruh: 'fizik_erish', izoh: 'Zichlik 4,93 g/cm³.' },
    { nom: '1:2 Cl₂; 0,02 g I₂; benzol/spirt', qisqa: 'Suv vs Organik erish', guruh: 'fizik_erish', izoh: 'Qutbsiz X₂ organikda yaxshi.' },
    { nom: '2KHF₂ →(elektroliz) F₂↑ + H₂↑', qisqa: 'Ftorni olish yagona yo\'li', guruh: 'faollik', izoh: 'Boshqa oksidlovchi kuchi yetmaydi.' },
    { nom: 'F₂ > Cl₂ > Br₂ > I₂ (oksidlovchi)', qisqa: 'Siqib chiqarish tartibi', guruh: 'faollik', izoh: 'Cl₂ + 2KBr → 2KCl + Br₂.' },
    { nom: 'F⁻ < Cl⁻ < Br⁻ < I⁻ (qayt.)', qisqa: 'I⁻ eng kuchli qaytaruvchi', guruh: 'faollik', izoh: 'Ion radiusi ortgani sari ē beradi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Atama',
    savol: '1811-yilda "galogen" so\'zini kim kiritgan va ma\'nosi nima?',
    variantlar: ['D.Mendeleyev', 'K.Sheyele — "yashil"', 'I.Shveyger — "tuz hosil qiluvchi"', 'B.Kurtua'],
    togri: 2,
    izoh: 'Nemis kimyogari I.Shveyger (1811).',
  },
  {
    belgi: 'Ftor (F)',
    savol: 'Nega F birikmalarda faqat -1 oksidlanish darajasini ko\'rsatadi?',
    variantlar: ['2-davr (d-orbitali yo\'q) va EM = 4,0 eng katta', 'Gaz bo\'lgani uchun', 'Og\'ir atom', 'Z = 17'],
    togri: 0,
    izoh: 'Elektronni faqat tortadi (-1), bera olmaydi.',
  },
  {
    belgi: '17-jadval',
    savol: 'Yer qobig\'ida eng ko\'p galogen va minerali:',
    variantlar: ['Brom — MgBr₂', 'Yod — KI', 'Astat', 'Ftor (0,066%) — plavik shpati CaF₂'],
    togri: 3,
    izoh: 'F (0,066%) > Cl (0,05%) > Br > I.',
  },
  {
    belgi: 'Sublimatsiya',
    savol: 'Qattiq I₂ qizdirilganda suyuqlanmay gunafsha bug\'ga o\'tishi:',
    variantlar: ['Kondensatsiya', 'Sublimatsiya', 'Elektroliz', 'Kristallanish'],
    togri: 1,
    izoh: 'Qattiq → to\'g\'ri gaz holatiga o\'tishi.',
  },
  {
    belgi: 'Eruvchanlik',
    savol: '1 hajm suvda necha hajm Cl₂ va 100 g suvda necha g I₂ eriydi?',
    variantlar: ['500 hajm Cl₂ va 50 g I₂', '2 hajm Cl₂ va 0,02 g I₂', '0,01 hajm va 10 g', 'Teng eriydi'],
    togri: 1,
    izoh: '18-jadval / 94-bet: Cl₂ 2 hajm, I₂ atigi 0,02 g.',
  },
  {
    belgi: 'Reaksiya',
    savol: 'Qaysi reaksiya odatdagi eritmada AMALGA OSHMAYDI?',
    variantlar: ['Cl₂ + 2KBr → Br₂', 'Cl₂ + 2KI → I₂', 'Br₂ + 2KI → I₂', 'I₂ + 2KCl → Cl₂ + 2KI'],
    togri: 3,
    izoh: 'Kuchsiz I₂ kuchli xlorid ionidan Cl₂ chiqara olmaydi.',
  },
  {
    belgi: 'Kashfiyot',
    savol: 'Cl₂ (1774) va I₂ (1811) ni ochgan olimlar:',
    variantlar: ['K.Sheyele (1774) va B.Kurtua (1811)', 'Boyle va Lomonosov', 'Libix va Shveyger', 'Mendeleyev'],
    togri: 0,
    izoh: '95-bet: Sheyele xlor, Kurtua yod ochgan.',
  },
  {
    belgi: 'Qaytaruvchilik',
    savol: 'Galogenid ionlari qaytaruvchilik kuchi ORTIB borish qatori:',
    variantlar: ['I⁻ → Br⁻ → Cl⁻ → F⁻', 'Cl⁻ → F⁻ → Br⁻', 'F⁻ → Cl⁻ → Br⁻ → I⁻', 'Barchasi teng'],
    togri: 2,
    izoh: 'Ion radiusi ortishi bilan I⁻ elektronni oson beradi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '95-bet: Oksidlovchilik kuchi',
    vazifa: 'Galogenlarni faollik KAMAYISHI bo\'yicha tartiblang:',
    tartib: [
      'F₂ (EM = 4,0; Ts = -220°C)',
      'Cl₂ (EM = 3,16; Ts = -101°C)',
      'Br₂ (EM = 2,96; Ts = -7°C)',
      'I₂ (EM = 2,66; Ts = +114°C)',
    ],
    variantlar: [
      'Br₂ (EM = 2,96; Ts = -7°C)',
      'F₂ (EM = 4,0; Ts = -220°C)',
      'I₂ (EM = 2,66; Ts = +114°C)',
      'Cl₂ (EM = 3,16; Ts = -101°C)',
    ],
  },
  {
    tur: '17-jadval: Tabiatda tarqalish (%)',
    vazifa: 'Yer qobig\'idagi ulush KAMAYISH tartibida joylang:',
    tartib: [
      'Ftor — 0,066% (CaF₂)',
      'Xlor — 0,05% (NaCl, KCl)',
      'Brom — 0,00021% (MgBr₂)',
      'Yod — 0,00004% (KI, NaI)',
    ],
    variantlar: [
      'Xlor — 0,05% (NaCl, KCl)',
      'Yod — 0,00004% (KI, NaI)',
      'Ftor — 0,066% (CaF₂)',
      'Brom — 0,00021% (MgBr₂)',
    ],
  },
  {
    tur: 'Olish va o\'rin olish zanjiri',
    vazifa: 'Ketma-ket ajratib olish tartibini tuzing:',
    tartib: [
      '1. F⁻ → faqat elektroliz bilan F₂',
      '2. 2KMnO₄ + 10NaCl + 8H₂SO₄ → 5Cl₂',
      '3. Cl₂ + 2KBr → 2KCl + Br₂',
      '4. Br₂ + 2KI → 2KBr + I₂↓',
    ],
    variantlar: [
      '3. Cl₂ + 2KBr → 2KCl + Br₂',
      '4. Br₂ + 2KI → 2KBr + I₂↓',
      '1. F⁻ → faqat elektroliz bilan F₂',
      '2. 2KMnO₄ + 10NaCl + 8H₂SO₄ → 5Cl₂',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '2KMnO₄ + 10NaCl + 8H₂SO₄ da oksidlovchi modda:',
    variantlar: ['NaCl', 'KMnO₄ (Mn⁺⁷ → Mn⁺²)', 'H₂SO₄', 'Na₂SO₄'],
    togri: 1,
    izoh: 'Mn⁺⁷ +5ē → Mn⁺².',
  },
  {
    savol: 'Galogenlar tashqi elektron formulasi:',
    variantlar: ['ns² np⁴', 'ns² np³', 'ns² np⁶', 'ns² np⁵ (7 ē)'],
    togri: 3,
    izoh: 'Oktetga 1 ta elektron yetishmaydi.',
  },
  {
    savol: '2H₂O + 2F₂ → ? (ftorning suv bilan reaksiyasi):',
    variantlar: ['4HF + O₂↑ (alangali)', 'H₂ + F₂O', 'HFO + HF', 'Erimaydi'],
    togri: 0,
    izoh: 'F₂ suvdan kislorodni siqib chiqaradi.',
  },
  {
    savol: '18-jadval: Cl₂ va Br₂ qaynash temperaturalari:',
    variantlar: ['0° va 100°', '-220° va +186°', '-34°C (Cl₂) va +58°C (Br₂)', '+34° va -58°'],
    togri: 2,
    izoh: 'Cl₂ -34°C da gaz, Br₂ +58°C da qaynaydi.',
  },
  {
    savol: '96-bet 5-masala: 25,4 g I₂ olish uchun necha litr Cl₂ kerak?',
    variantlar: ['11,2 l', '22,4 l', '2,24 litr (0,1 mol)', '5,6 l'],
    togri: 2,
    izoh: '25,4/254 = 0,1 mol → 0,1·22,4 = 2,24 l.',
  },
  {
    savol: 'Br₂ va I₂ qaysi erituvchilarda suvdan yaxshi eriydi?',
    variantlar: ['Benzol, spirt, benzin, kerosin', 'Kislotalarda', 'Ishqorda', 'Faqat issiq suvda'],
    togri: 0,
    izoh: '"O\'xshash o\'xshashda eriydi".',
  },
  {
    savol: 'Astat (At, Z=85) xususiyati:',
    variantlar: ['Eng ko\'p tarqalgan', 'Radioaktiv va juda beqaror', 'Suyuq gaz', 'Zaharli gaz'],
    togri: 1,
    izoh: 'Tabiatda deyarli uchramaydigan radioaktiv galogen.',
  },
  {
    savol: 'I₂ ning borligini qaysi modda ko\'k rang bilan isbotlaydi?',
    variantlar: ['Fenolftalein', 'Lakmus', 'Metiloranj', 'Kraxmal kleysteri'],
    togri: 3,
    izoh: 'Yod + kraxmal → to\'q ko\'k rang.',
  },
];

export default function S8Mavzu22() {
  const korgazmalar = [
    { nom: '1. Atom (ns²np⁵) & Shveyger', ikon: 'atom', komponent: <KorgazmaGalogenAtom /> },
    { nom: '2. 17-jadval (Tabiatda)', ikon: 'yadro', komponent: <KorgazmaJadval17Tabiat /> },
    { nom: '3. Elektroliz & Almashinish', ikon: 'kolba', komponent: <KorgazmaOlinishVaAlmashinish /> },
    { nom: '4. 18-jadval & Sublimatsiya', ikon: 'harorat', komponent: <KorgazmaJadval18Fizik /> },
    { nom: '5. Suv & Organik erish', ikon: 'tomchi', komponent: <KorgazmaEruvchanlik /> },
    { nom: '6. Faollik & 2,24 l Cl₂', ikon: 'uchqun', komponent: <KorgazmaFaollikQatori /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-22"
          nom="Galogen xossalarini guruhlang"
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
          key="tezkor-22"
          nom="22-§: Galogenlar"
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
          key="zanjir-22"
          nom="Galogenlar zanjiri"
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
          key="duel-22"
          sarlavha="22-§: Galogenlar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="22-§"
      mavzuNom="Galogenlarning davriy sistemadagi o'rni. Atom tuzilishi"
      oldingiRaqam="21-§"
      oldingiNom="Metallmaslarning umumiy xossalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
