'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 27-PARAGRAF
// "Xlorid kislota" (Darslik 116-120-betlar)
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
function KorgazmaHClFizikIndikator() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Konsentrlangan HCl va indikatorlar (116-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'kons',
          tugma: '37% HCl (ρ=1,19 g/cm³)',
          formula: 'Kons. HCl ≈ 37% • ρ = 1,19 g/cm³ • nam havoda tutaydi',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Konsentrlangan xlorid kislota (37%, ρ = 1,19 g/cm³)',
            tenglama: 'HCl(suv) → H⁺ + Cl⁻   |   Nam havoda HCl gazi ajralib tutaydi',
            suyuqlikRang: '#e2e8f0',
            tolish: 0.65,
            stakanBelgi: '37% HCl',
            stakanSarlavha: 'ρ = 1,19 g/cm³',
            reagentlar: [
              { belgi: 'H⁺', rang: '#fb7185' },
              { belgi: 'Cl⁻', rang: '#34d399' },
              { belgi: 'H₃O⁺', rang: '#38bdf8' },
            ],
            gazRang: '#cbd5e1',
            gazBelgi: 'Nam havoda tutaydi',
            belgilar: [
              { k: 'Konsentratsiya', v: 'Taxminan 37% HCl', rang: '#38bdf8' },
              { k: 'Zichligi', v: 'ρ = 1,19 g/cm³', rang: '#fde047' },
              { k: 'Xossasi', v: 'Rangsiz, o\'tkir hidli, tutaydi', rang: '#34d399' },
            ],
          },
          pastki: ['Konsentrlangan HCl ~37% li', 'Zichligi ρ = 1,19 g/cm³', 'Nam havoda oq tuman berib tutaydi'],
        },
        {
          id: 'indikator',
          tugma: '3 ta indikator o\'zgarishi',
          formula: 'Lakmus → qizil • Metil zarg\'aldoq → qizil • Fenolftalein → rangsiz',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Xlorid kislotada indikatorlar rangi (H⁺ ionlari ta\'siri)',
            tenglama: 'pH ≈ 1   |   Lakmus → qizil   •   Metil zarg\'aldoq → qizil   •   Fenolftalein → rangsiz',
            turi: 'ph',
            ph: 1,
            belgilar: [
              { k: 'Lakmus', v: 'Binafsha → Qizil', rang: '#ef4444' },
              { k: 'Metil zarg\'aldoq', v: 'Zarg\'aldoq → Qizil/pushti', rang: '#fb7185' },
              { k: 'Fenolftalein', v: 'Rangsiz qoladi', rang: '#cbd5e1' },
            ],
          },
          pastki: ['Ko\'k lakmus → qizil rang', 'Metil zarg\'aldoq → qizil', 'Fenolftalein → rangsiz o\'zgarmaydi'],
        },
      ]}
    />
  );
}

function KorgazmaHClReaksiyalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Umumiy va xususiy reaksiyalari (117-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'umumiy',
          tugma: 'Umumiy kislota xossasi',
          formula: 'Zn/Fe + 2HCl → tuz + H₂↑ • CaO, Cu(OH)₂, CaCO₃ • Cu/P₂O₅ ≠',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'HCl metallar, asosli oksid, asos va tuzlar bilan kirishadi',
            tenglama: 'Fe+2HCl = FeCl₂+H₂↑   •   CaO+2HCl = CaCl₂+H₂O   •   Cu+HCl ≠   •   P₂O₅+HCl ≠',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'HCl + Zn/Fe',
            stakanSarlavha: 'Umumiy xossalar',
            reagentlar: [
              { belgi: 'Zn²⁺', rang: '#38bdf8' },
              { belgi: 'Fe²⁺', rang: '#34d399' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂↑',
            belgilar: [
              { k: 'Metallar', v: 'Zn, Fe → ZnCl₂/FeCl₂ + H₂↑', rang: '#34d399' },
              { k: 'Oksid/Asos/Tuz', v: 'CaO/ZnO, Cu(OH)₂, CaCO₃', rang: '#38bdf8' },
              { k: 'Bormaydi', v: 'Cu (H dan keyin) va P₂O₅ (kisl. ok.)', rang: '#f43f5e' },
            ],
          },
          pastki: ['Aktiv metallar bilan H₂↑ chiqaradi', 'Asosli oksid, asos va karbonatlar bilan', 'Cu va kislotali P₂O₅ bilan BORMAYDI'],
        },
        {
          id: 'xususiy',
          tugma: 'Xususiy: MnO₂, KMnO₄ → Cl₂↑',
          formula: 'MnO₂ + 4HCl = MnCl₂ + Cl₂↑ + 2H₂O • 2KMnO₄ + 16HCl → 5Cl₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Xususiy qaytaruvchi xossasi: kuchli oksidlovchilardan Cl₂↑ chiqadi',
            tenglama: 'MnO₂ + 4HCl(t°) = MnCl₂ + Cl₂↑ + 2H₂O   |   2KMnO₄ + 16HCl = 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O',
            qizdir: true,
            suyuqlikRang: '#a855f7',
            stakanBelgi: 'KMnO₄ + HCl',
            stakanSarlavha: 'Cl⁻ qaytaruvchi',
            reagentlar: [
              { belgi: 'Mn²⁺', rang: '#fb7185' },
              { belgi: 'Cl⁻', rang: '#34d399' },
            ],
            gazRang: '#a3e635',
            gazBelgi: 'Cl₂↑',
            belgilar: [
              { k: 'MnO₂ (t°)', v: 'MnO₂ + 4HCl → MnCl₂ + Cl₂↑', rang: '#fde047' },
              { k: 'KMnO₄ (sovuq)', v: '2KMnO₄ + 16HCl → 5Cl₂↑', rang: '#a3e635' },
            ],
          },
          pastki: ['Cl⁻ kuchli oksidlovchilarga elektron beradi', 'MnO₂ bilan qizdirib Cl₂ olinadi', 'KMnO₄ bilan qizdirmasdan 5Cl₂↑ chiqadi'],
        },
      ]}
    />
  );
}

function KorgazmaNaClKonlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. O'zbekiston tuz konlari va NaCl (118-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'nacl',
          tugma: 'NaCl panjarasi va xossasi',
          formula: 'Ts = 800,4°C • Tq = 1413°C • ρ = 2,16 g/cm³ • 0°C: 35,6 g/100 g',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Osh tuzi (NaCl) ion kristall panjarasi va biologik me\'yori',
            tenglama: 'Ts = 800,4°C  •  Tq = 1413°C  •  ρ = 2,16 g/cm³  •  0°C: 35,6 g/100 g H₂O',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Ts / Tq', qiymat: '800,4°C / 1413°C', foiz: 85, rang: '#38bdf8' },
              { nom: '0°C eruvchanligi', qiymat: '35,6 g / 100 g suv', foiz: 65, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Zichligi', v: 'ρ = 2,16 g/cm³', rang: '#fde047' },
              { k: 'Me\'yor', v: 'Kunlik 4–6 g; yillik ~2 kg; jahonda 14 mln t', rang: '#fb7185' },
            ],
          },
          pastki: ['NaCl: Ts=800,4°C, Tq=1413°C, ρ=2,16', '0°C da 100 g suvda 35,6 g eriydi', 'Kunlik me\'yor 4–6 g, yillik ~2 kg (14 mln t)'],
        },
        {
          id: 'konlar',
          tugma: 'O\'zbekiston tuz konlari',
          formula: 'Tubokat (Qashqadaryo) • Xo\'jaikon (Surxondaryo) • Borsakelmas (Qoraqalpog\'iston)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'O\'zbekistonning yirik osh tuzi (NaCl) konlari va ahamiyati',
            tenglama: 'Tubokat (Qashqadaryo)   •   Xo\'jaikon (Surxondaryo)   •   Borsakelmas (Qoraqalpog\'iston)',
            markazBelgi: 'NaCl',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Qashqadaryo', belgi: 'Tubokat', rang: '#38bdf8' },
              { nom: 'Surxondaryo', belgi: 'Xo\'jaikon', rang: '#34d399' },
              { nom: 'Qoraqalpog\'iston', belgi: 'Borsakelmas', rang: '#fbbf24' },
              { nom: 'Inson me\'yori', belgi: '4–6 g/kun', rang: '#fb7185' },
            ],
            belgilar: [
              { k: 'Respublika konlari', v: 'Tubokat, Xo\'jaikon, Borsakelmas', rang: '#34d399' },
              { k: 'Jahon iste\'moli', v: 'Oziq uchun ~14 mln t/yil', rang: '#fde047' },
            ],
          },
          pastki: ['Qashqadaryo: Tubokat koni', 'Surxondaryo: Xo\'jaikon koni', 'Qoraqalpog\'iston: Borsakelmas koni'],
        },
      ]}
    />
  );
}

function KorgazmaXloridSifatTesti() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Erimaydigan xloridlar va Cl⁻ sifat testi (118-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'agcl',
          tugma: 'Cl⁻ + Ag⁺ → AgCl↓ (oq)',
          formula: 'AgNO₃ + HCl = AgCl↓ (oq pag\'a, HNO₃ da erimaydi) + HNO₃',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Xlorid ionini aniqlash: oq pag\'asimon AgCl↓ cho\'kma',
            tenglama: 'Cl⁻ + Ag⁺ = AgCl↓ (oq)   |   Boshqa kam eruvchanlar: PbCl₂, CuCl',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Cl⁻ + Ag⁺',
            stakanSarlavha: 'Sifat reaksiyasi',
            chokmaRang: '#f8fafc',
            chokmaBelgi: 'AgCl↓ (oq)',
            reagentlar: [
              { belgi: 'Ag⁺', rang: '#e2e8f0' },
              { belgi: 'Cl⁻', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Qisqa ionli', v: 'Ag⁺ + Cl⁻ = AgCl↓ (oq pag\'a)', rang: '#f8fafc' },
              { k: 'Barqarorlik', v: 'Nitrat kislota HNO₃ da erimaydi', rang: '#38bdf8' },
              { k: 'Boshqa tuzlar', v: 'PbCl₂, CuCl ham erimaydi', rang: '#fde047' },
            ],
          },
          pastki: ['Cl⁻ uchun sifat reaktivi — AgNO₃', 'Oq pag\'a AgCl↓ HNO₃ da erimaydi', 'Erimaydigan xloridlar: AgCl, PbCl₂, CuCl'],
        },
      ]}
    />
  );
}

function KorgazmaKislorodliKislotalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Xlorning kislorodli kislotalari (+1..+7, 119–120-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'qator',
          tugma: 'Kuch & barqarorlik o\'sishi',
          formula: 'HClO (+1) → HClO₂ (+3) → HClO₃ (+5) → HClO₄ (+7): kuch & barqarorlik ↑',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Xlor OD (+1 → +7) ortishi bilan kislota kuchi va barqarorlik ORTADI',
            tenglama: 'HClO (kuchsiz)  <  HClO₂ (o\'rta)  <  HClO₃ (kuchli)  <  HClO₄ (eng kuchli!)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'HClO (+1)', qiymat: 18, yorliq: '+1 (kuchsiz)', rang: '#38bdf8' },
              { nom: 'HClO₂ (+3)', qiymat: 40, yorliq: '+3 (portl.)', rang: '#fbbf24' },
              { nom: 'HClO₃ (+5)', qiymat: 72, yorliq: '+5 (>40% portl)', rang: '#f97316' },
              { nom: 'HClO₄ (+7)', qiymat: 100, yorliq: '+7 (eng kuchli)', rang: '#34d399' },
            ],
          },
          pastki: ['+1 dan +7 gacha kislotalik keskin ortadi', '+1 dan +7 gacha barqarorlik ham ortadi', 'HClO₄ (perxlorat) eng kuchli va barqaror'],
        },
        {
          id: 'tuzlar',
          tugma: 'CaOCl₂, HClO₂, KClO₃, HClO₄',
          formula: 'Xlorli ohak CaOCl₂ [CaCl₂·Ca(ClO)₂] • HClO → HCl + [O] • KClO₃',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Kislorodli kislotalar va ularning muhim tuzlari (119–120-bet)',
            tenglama: 'CaOCl₂ [CaCl₂·Ca(ClO)₂]  •  HClO→HCl+[O]  •  HClO₃ (>40% portl.)  •  KClO₃',
            markazBelgi: 'HClOₓ',
            markazRang: '#a855f7',
            tugunlar: [
              { nom: 'Xlorli ohak', belgi: 'CaOCl₂', rang: '#38bdf8' },
              { nom: 'Xlorit (portl.)', belgi: 'HClO₂', rang: '#fbbf24' },
              { nom: 'Bertole tuzi', belgi: 'KClO₃', rang: '#f97316' },
              { nom: 'Eng kuchli', belgi: 'HClO₄', rang: '#34d399' },
            ],
            belgilar: [
              { k: 'HClO', v: 'HClO → HCl + [O] (oqartiradi)', rang: '#38bdf8' },
              { k: 'CaOCl₂', v: 'CaCl₂·Ca(ClO)₂ xlorli ohak', rang: '#fde047' },
            ],
          },
          pastki: ['CaOCl₂ — xlorli ohak [CaCl₂·Ca(ClO)₂]', 'HClO₂ (portlaydi); HClO₃ >40% portlaydi', 'KClO₃ Bertole tuzi, HClO₄ eng kuchli'],
        },
      ]}
    />
  );
}

function Korgazma27Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 120-bet masalalari va reaksiya saralash"
      ikon="formula"
      variantlar={[
        {
          id: 'm120',
          tugma: 'D(HCl) & 11,2 m³ Cl₂ → NaCl',
          formula: 'D_H2=18,25; D_He=9,125 • 11,2 m³ Cl₂ (500 mol) → 58,5 kg NaCl + 18 kg H₂O',
          tur: 'hisob',
          cfg: {
            sarlavha: '120-bet: HCl zichliklari va 11,2 m³ xlordan HCl olish hisobi',
            tenglama: '11,2 m³ Cl₂ = 500 mol  →  1000 mol NaCl = 58,5 kg  +  1000 mol H₂O = 18 kg',
            qadamlar: [
              { belgi: 'D(HCl): 36,5 / 2; / 4', natija: '18,25 / 9,125', izoh: 'D_H2 va D_He', rang: '#38bdf8' },
              { belgi: 'n(Cl₂) = 11200 / 22,4', natija: '500 mol Cl₂', izoh: '1000 mol HCl (Cl)', rang: '#fde047' },
              { belgi: '1000 mol NaCl + H₂O', natija: '58,5 kg + 18 kg', izoh: '1000·58,5 va 1000·18', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '1000 mol NaCl', foiz: 100, qiymat: '58,5 kg', rang: '#fde047' },
              { nom: '1000 mol H₂O', foiz: 31, qiymat: '18,0 kg', rang: '#38bdf8' },
            ],
            javobBadge: 'Javob: 58,5 kg NaCl va 18 kg suv (D_H2=18,25; D_He=9,125)',
          },
          pastki: ['D_H2(HCl) = 18,25; D_He(HCl) = 9,125', '11,2 m³ Cl₂ = 500 mol → 1000 mol NaCl', 'm(NaCl) = 58,5 kg; m(H₂O) = 18 kg'],
        },
        {
          id: 'saralash',
          tugma: 'HCl bilan reaksiya saralash',
          formula: 'Kirishadi: Zn, CuO, Cu(OH)₂, Na₂S • Kirishmaydi: Cu, P₂O₅',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Qaysi moddalar HCl bilan reaksiyaga kirishadi (120-bet)?',
            tenglama: 'Zn+2HCl=ZnCl₂+H₂↑  •  CuO+2HCl=CuCl₂+H₂O  •  Na₂S+2HCl=2NaCl+H₂S↑',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'HCl + moddalar',
            stakanSarlavha: 'Saralash testi',
            reagentlar: [
              { belgi: 'Zn²⁺', rang: '#38bdf8' },
              { belgi: 'Cu²⁺', rang: '#34d399' },
              { belgi: 'Na⁺', rang: '#fbbf24' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'H₂↑ / H₂S↑',
            belgilar: [
              { k: 'Kirishadi', v: 'Zn, CuO, Cu(OH)₂, Na₂S', rang: '#34d399' },
              { k: 'Kirishmaydi', v: 'Cu (H dan keyin), P₂O₅ (kisl. ok.)', rang: '#f43f5e' },
            ],
          },
          pastki: ['Kirishadi: Zn, CuO, Cu(OH)₂, Na₂S', 'Cu(OH)₂ + 2HCl = CuCl₂ + 2H₂O', 'Cu va kislotali oksid P₂O₅ kirishmaydi'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (26-§) VA O'YINLAR (27-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Elementning ekvivalent massasi E ni hisoblash formulasi:',
    variantlar: [
      { matn: 'E = M / 22,4', togri: false },
      { matn: 'E = A · v', togri: false },
      { matn: 'E = A / v (atom massa / valentlik)', togri: true },
      { matn: 'E = m · V', togri: false },],
    izoh: '26-§: E(element) = A / v.',
  },
  {
    id: 't2',
    savol: 'Fe²⁺ va Fe³⁺ ionlarining ekvivalent massalari:',
    variantlar: [
      { matn: '28 va 18,67 g/mol', togri: true },
      { matn: '56 va 56', togri: false },
      { matn: '14 va 9,3', togri: false },
      { matn: '112 va 168', togri: false },],
    izoh: '56 / 2 = 28; 56 / 3 = 18,67 g/mol.',
  },
  {
    id: 't3',
    savol: 'Kislorodning ekvivalent hajmi V_E(O₂) n.sh. da nechaga teng?',
    variantlar: [
      { matn: '22,4 l/mol', togri: false },
      { matn: '11,2 l/mol', togri: false },
      { matn: '1,12 l/mol', togri: false },
      { matn: '5,6 litr/mol', togri: true },],
    izoh: '26-§: V_E(O₂) = 22,4 / 4 = 5,6 l/mol.',
  },
  {
    id: 't4',
    savol: 'Al₂O₃ da 52,94% Al va 47,06% O bo\'lsa Al ning ekvivalent massasi:',
    variantlar: [
      { matn: '27 g/mol', togri: false },
      { matn: '9 g/mol (52,94 · 8 / 47,06)', togri: true },
      { matn: '3 g/mol', togri: false },
      { matn: '18 g/mol', togri: false },],
    izoh: '114-bet misoli: E(Al) = 9 g/mol.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'fizik_nacl', nom: 'HCl & NaCl konlari', tavsif: '37%, 1,19, Tubokat, Borsakelmas' },
    { id: 'reaksiyalar', nom: 'Reaksiya & Sifat testi', tavsif: 'MnO₂, KMnO₄, AgCl↓, Cu/P₂O₅≠' },
    { id: 'kislorodli', nom: 'Kislorodli & Masalalar', tavsif: 'CaOCl₂, HClO₄, 58,5 kg' },
  ],
  topshiriqlar: [
    { nom: 'Kons. HCl ~37%, ρ=1,19 g/cm³ (tutaydi)', qisqa: 'Lakmus & metil → qizil', guruh: 'fizik_nacl', izoh: 'Fenolftalein rangsiz qoladi.' },
    { nom: 'NaCl: Ts=800,4°C, Tq=1413°C, ρ=2,16', qisqa: '0°C da 35,6 g/100 g suv', guruh: 'fizik_nacl', izoh: 'Kunlik 4–6 g, yillik ~2 kg.' },
    { nom: 'Tubokat, Xo\'jaikon, Borsakelmas konlari', qisqa: 'O\'zbekiston tuz konlari', guruh: 'fizik_nacl', izoh: '118-bet milliy konlar.' },
    { nom: 'Zn, CuO, Cu(OH)₂, Na₂S (Cu & P₂O₅≠)', qisqa: 'Umumiy kislota xossasi', guruh: 'reaksiyalar', izoh: '120-bet saralash.' },
    { nom: 'MnO₂ + 4HCl → Cl₂↑; 2KMnO₄ + 16HCl → 5Cl₂↑', qisqa: 'Xususiy qaytaruvchanlik', guruh: 'reaksiyalar', izoh: 'Kuchli oksidlovchi bilan Cl₂↑.' },
    { nom: 'AgCl↓ (oq pag\'a, HNO₃ da erimaydi)', qisqa: 'Boshqalar: PbCl₂, CuCl', guruh: 'reaksiyalar', izoh: 'Cl⁻ sifat reaksiyasi.' },
    { nom: 'HClO → HClO₂ → HClO₃ → HClO₄ (kuch ↑)', qisqa: '+1 dan +7 gacha barqarorlik ↑', guruh: 'kislorodli', izoh: 'HClO₄ eng kuchli kislota.' },
    { nom: 'CaOCl₂ [CaCl₂·Ca(ClO)₂] xlorli ohak', qisqa: 'KClO₃ Bertole; HClO₃ >40% portl.', guruh: 'kislorodli', izoh: '119–120-bet birikmalar.' },
    { nom: '11,2 m³ Cl₂ → 58,5 kg NaCl + 18 kg H₂O', qisqa: 'D_H2=18,25; D_He=9,125', guruh: 'kislorodli', izoh: '120-bet masalalari.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Kons. HCl',
    savol: 'Konsentrlangan xlorid kislota konsentratsiyasi va zichligi:',
    variantlar: ['98% va 1,84', '10% va 1,05', '~37% va ρ = 1,19 g/cm³', '50% va 1,5'],
    togri: 2,
    izoh: '116-bet: ~37% HCl, ρ = 1,19 g/cm³.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'Xlorid ionlari (Cl⁻) uchun sifat reaktivi va tushadigan cho\'kma:',
    variantlar: ['AgNO₃ → AgCl↓ (oq, HNO₃ da erimaydi)', 'BaCl₂ → BaSO₄', 'NaOH → oq', 'CuSO₄ → ko\'k'],
    togri: 0,
    izoh: '118-bet: boshqa erimaydiganlar PbCl₂ va CuCl.',
  },
  {
    belgi: 'Saralash',
    savol: 'Zn, Cu, CuO, Cu(OH)₂, P₂O₅, Na₂S qatoridan HCl bilan kirishmaydigani:',
    variantlar: ['Zn va Na₂S', 'CuO va Cu(OH)₂', 'Hammasi kirishadi', 'Cu va P₂O₅'],
    togri: 3,
    izoh: 'Cu aktivlik qatorida H dan keyin; P₂O₅ kislotali oksid.',
  },
  {
    belgi: 'Xlorli ohak',
    savol: 'Xlorli ohakning tarkibiy formulasi:',
    variantlar: ['CaCl₂', 'CaOCl₂ [CaCl₂ · Ca(ClO)₂]', 'NaClO', 'KClO₃'],
    togri: 1,
    izoh: '119-bet: CaOCl₂ oqartiruvchi va dezinfeksiyachi.',
  },
  {
    belgi: 'Kuch o\'sishi',
    savol: 'Xlorning kislorodli kislotalari qatorida (+1 → +7) kislota kuchi va barqarorligi:',
    variantlar: ['Kamayib boradi', 'Ortib boradi (HClO₄ eng kuchli)', 'O\'zgarmaydi', 'HClO eng kuchli'],
    togri: 1,
    izoh: '120-bet: HClO < HClO₂ < HClO₃ < HClO₄.',
  },
  {
    belgi: 'Tuz konlari',
    savol: 'O\'zbekistonning yirik osh tuzi (NaCl) konlari:',
    variantlar: ['Qizilqum va Olmalik', 'Muruntov', 'Farg\'ona va Gazli', 'Tubokat, Xo\'jaikon va Borsakelmas'],
    togri: 3,
    izoh: '118-bet: Qashqadaryo, Surxondaryo, Qoraqalpog\'iston.',
  },
  {
    belgi: '120-bet masala',
    savol: '11,2 m³ Cl₂ (500 mol) dan HCl olishga zarur NaCl va H₂O massasi:',
    variantlar: ['58,5 kg NaCl va 18 kg H₂O', '117 kg va 36 kg', '29,25 kg va 9 kg', '10 kg va 10 kg'],
    togri: 0,
    izoh: '500 mol Cl₂ → 1000 mol HCl → 1000 mol NaCl (58,5 kg) + 18 kg H₂O.',
  },
  {
    belgi: 'Xususiy reaksiya',
    savol: 'HCl xususiy qaytaruvchanligini ko\'rsatadigan reaksiya:',
    variantlar: ['NaOH + HCl', 'CaCO₃ + 2HCl', '2KMnO₄ + 16HCl → 5Cl₂↑', 'AgNO₃ + HCl'],
    togri: 2,
    izoh: 'Cl⁻ kuchli oksidlovchiga Cl₂ gazigacha oksidlanadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Kislorodli kislotalar (+1 → +7)',
    vazifa: 'Kislota kuchi va barqarorlik ORTIB borishi bo\'yicha joylang:',
    tartib: [
      'HClO (+1, xlorli ohak CaOCl₂ kislotasi)',
      'HClO₂ (+3, xlorit, portlovchi)',
      'HClO₃ (+5, >40% portlaydi, KClO₃)',
      'HClO₄ (+7, eng kuchli va barqaror)',
    ],
    variantlar: [
      'HClO₃ (+5, >40% portlaydi, KClO₃)',
      'HClO (+1, xlorli ohak CaOCl₂ kislotasi)',
      'HClO₄ (+7, eng kuchli va barqaror)',
      'HClO₂ (+3, xlorit, portlovchi)',
    ],
  },
  {
    tur: '120-bet: 11,2 m³ Cl₂ → NaCl & H₂O',
    vazifa: 'HCl olish uchun NaCl va suv massasini topish qadamlari:',
    tartib: [
      '1. n(Cl₂) = 11200 l / 22,4 = 500 mol',
      '2. Cl₂ → 2HCl dan n(NaCl) = 1000 mol',
      '3. m(NaCl) = 1000 · 58,5 = 58,5 kg',
      '4. m(H₂O) = 1000 · 18 = 18 kg',
    ],
    variantlar: [
      '2. Cl₂ → 2HCl dan n(NaCl) = 1000 mol',
      '4. m(H₂O) = 1000 · 18 = 18 kg',
      '1. n(Cl₂) = 11200 l / 22,4 = 500 mol',
      '3. m(NaCl) = 1000 · 58,5 = 58,5 kg',
    ],
  },
  {
    tur: 'NaCl konidan Cl⁻ sifat testigacha',
    vazifa: 'Bosqichlarni mantiqiy tartiblang:',
    tartib: [
      '1. Tubokat/Xo\'jaikon NaCl qazib olinadi',
      '2. NaCl + H₂SO₄ → HCl↑ gazi olinadi',
      '3. HCl suvda erib 37% (ρ=1,19) kislota beradi',
      '4. AgNO₃ ta\'sirida oq AgCl↓ cho\'kma tushadi',
    ],
    variantlar: [
      '3. HCl suvda erib 37% (ρ=1,19) kislota beradi',
      '1. Tubokat/Xo\'jaikon NaCl qazib olinadi',
      '4. AgNO₃ ta\'sirida oq AgCl↓ cho\'kma tushadi',
      '2. NaCl + H₂SO₄ → HCl↑ gazi olinadi',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Xlorid kislotada fenolftalein indikatorining rangi:',
    variantlar: ['Qizil', 'Rangsiz qoladi', 'Pushti-malina', 'Ko\'k'],
    togri: 1,
    izoh: 'Fenolftalein faqat ishqorlarda pushti bo\'ladi.',
  },
  {
    savol: 'Osh tuzi (NaCl) ning suyuqlanish va qaynash haroratlari:',
    variantlar: ['0°C va 100°C', '300°C va 900°C', '100°C va 500°C', '800,4°C va 1413°C'],
    togri: 3,
    izoh: '118-bet: ionli panjara tufayli yuqori haroratda eriydi.',
  },
  {
    savol: 'Erimaydigan xloridlar qaysilar?',
    variantlar: ['AgCl, PbCl₂, CuCl', 'FeCl₃, ZnCl₂', 'NaCl, KCl, CaCl₂', 'BaCl₂, MgCl₂'],
    togri: 0,
    izoh: '118-bet: AgCl, PbCl₂, CuCl suvda erimaydi.',
  },
  {
    savol: 'Insonning osh tuziga (NaCl) sutkalik va yillik me\'yori:',
    variantlar: ['100 g/kun', '0,1 g/kun', 'Kunlik 4–6 g, yillik ~2 kg', '20 g/kun'],
    togri: 2,
    izoh: '118-bet: jahonda yiliga 14 mln t oziq tuzi.',
  },
  {
    savol: 'HClO ning oqartirish va dezinfeksiya ta\'sirining sababi:',
    variantlar: ['Suvni isitadi', 'NaCl hosil qiladi', 'HClO → HCl + [O] (atomar kislorod)', 'Cl₂ yutadi'],
    togri: 2,
    izoh: 'Atomar kislorod [O] kuchli oksidlovchi.',
  },
  {
    savol: 'Qaysi kislota >40% konsentratsiyada portlovchi hisoblanadi?',
    variantlar: ['HClO₃ (xlorat kislota)', 'HCl', 'H₂SO₄', 'HNO₃'],
    togri: 0,
    izoh: '120-bet: HClO₂ ham portlaydi, HClO₃ >40% da portlaydi.',
  },
  {
    savol: 'Na₂S + 2HCl reaksiyasi natijasida qaysi gaz ajraladi?',
    variantlar: ['H₂↑', 'H₂S↑ (palag\'da tuxum hidli)', 'Cl₂↑', 'O₂↑'],
    togri: 1,
    izoh: 'Na₂S + 2HCl = 2NaCl + H₂S↑.',
  },
  {
    savol: 'HCl (Mr = 36,5) ning geliyga nisbatan zichligi D_He:',
    variantlar: ['18,25', '36,5', '1,259', '9,125 (36,5 / 4)'],
    togri: 3,
    izoh: '120-bet masala: 36,5 / 4 = 9,125.',
  },
];

export default function S8Mavzu27() {
  const korgazmalar = [
    { nom: '1. 37% HCl & Indikatorlar', ikon: 'kolba', komponent: <KorgazmaHClFizikIndikator /> },
    { nom: '2. Umumiy & MnO₂/KMnO₄', ikon: 'uchqun', komponent: <KorgazmaHClReaksiyalar /> },
    { nom: '3. NaCl & O\'zbek. konlari', ikon: 'kristall', komponent: <KorgazmaNaClKonlar /> },
    { nom: '4. AgCl↓ sifat testi', ikon: 'tomchi', komponent: <KorgazmaXloridSifatTesti /> },
    { nom: '5. HClO → HClO₄ (+1..+7)', ikon: 'grafik', komponent: <KorgazmaKislorodliKislotalar /> },
    { nom: '6. 120-bet masalalari', ikon: 'formula', komponent: <Korgazma27Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-27"
          nom="Xlorid kislota va tuzlarni guruhlang"
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
          key="tezkor-27"
          nom="27-§: Xlorid kislota"
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
          key="zanjir-27"
          nom="Xlor kislotalari zanjiri"
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
          key="duel-27"
          sarlavha="27-§: Xlorid kislota dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="27-§"
      mavzuNom="Xlorid kislota"
      oldingiRaqam="26-§"
      oldingiNom="Ekvivalent qonuni"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
