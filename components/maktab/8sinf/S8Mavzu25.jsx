'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 25-PARAGRAF
// "Avogadro qonuni. Molyar hajm" (Darslik 103-111-betlar)
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
function KorgazmaAvogadroQonuni() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Avogadro qonuni (1811-yil, 103-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'qonun',
          tugma: 'Gazlar uchun Vm & N_A',
          formula: 'Bir xil T, P → teng hajmda teng N = 6,02·10²³ mol⁻¹ (faqat gazlar!)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'A. Avogadro (1811): gaz molekulasi hajmi emas, soni teng!',
            tenglama: '1 mol gaz = N_A = 6,02·10²³ ta molekula   |   Suyuq va qattiq bo\'ysunmaydi',
            kameraNom: 'Teng T, P → bir xil molekulalar soni',
            tezlik: 2.5,
            rang: '#38bdf8',
            belgilar: [
              { k: 'N_A doimiysi', v: '6,02 · 10²³ mol⁻¹', rang: '#fde047' },
              { k: 'Qo\'llanishi', v: 'Faqat gaz va bug\'larga!', rang: '#34d399' },
              { k: 'Suyuq/qattiq', v: 'Bo\'ysunmaydi (zich joyl.)', rang: '#fb7185' },
            ],
          },
          pastki: ['1811-yil A. Avogadro kashf etgan', 'N_A = 6,02·10²³ mol⁻¹', 'Faqat gazlar va bug\'lar bo\'ysunadi'],
        },
        {
          id: 'suv_misol',
          tugma: '4°C 1 l suyuq suv',
          formula: '4°C 1 l H₂O = 1000 g / 18 = 55,56 mol = 3,344·10²⁵ molekula',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Nega suyuq suv 22,4 l emas? 1 litrda 55,56 mol joylashadi!',
            tenglama: 'm(1 l H₂O) = 1000 g   →   n = 1000 / 18 = 55,56 mol   →   N = 3,344·10²⁵',
            qadamlar: [
              { belgi: 'm(4°C 1 l H₂O)', natija: '1000 g H₂O', izoh: 'ρ = 1 g/ml', rang: '#38bdf8' },
              { belgi: 'n = 1000 / 18', natija: '55,56 mol', izoh: 'M(H₂O) = 18', rang: '#fde047' },
              { belgi: 'N = 55,56 · 6,02·10²³', natija: '3,344·10²⁵ ta', izoh: 'Vm dan 55,56× ko\'p', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '1 l gaz (n.sh.)', foiz: 10, qiymat: '0,0446 mol', rang: '#38bdf8' },
              { nom: '1 l suyuq H₂O (4°C)', foiz: 100, qiymat: '55,56 mol (3,344·10²⁵)', rang: '#34d399' },
            ],
            javobBadge: '1 l suyuq suvda = 55,56 mol = 3,344·10²⁵ ta molekula',
          },
          pastki: ['4°C da 1 l H₂O massasi 1000 g', '1000 / 18 = 55,56 mol H₂O', 'N = 3,344·10²⁵ molekula (zich!)'],
        },
      ]}
    />
  );
}

function KorgazmaMolyarHajm() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Molyar hajm Vm = 22,4 l/mol (19-jadval, 105-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'vm_teng',
          tugma: 'Barcha 1 mol gazlar = 22,4 l',
          formula: 'n.sh. (0°C, 101,3 kPa): Vm = 22,4 l/mol = 0,0224 m³/mol',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '1 mol H₂ (2 g), O₂ (32 g), CO₂ (44 g), Cl₂ (71 g) — hammasi 22,4 l!',
            tenglama: 'n.sh.: T = 0°C (273 K),  P = 101,3 kPa (1 atm)   →   Vm = 22,4 l/mol',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'H₂ (2 g)', qiymat: 22.4, yorliq: '22,4 l', rang: '#38bdf8' },
              { nom: 'O₂ (32 g)', qiymat: 22.4, yorliq: '22,4 l', rang: '#fb7185' },
              { nom: 'CO₂ (44 g)', qiymat: 22.4, yorliq: '22,4 l', rang: '#34d399' },
              { nom: 'Cl₂ (71 g)', qiymat: 22.4, yorliq: '22,4 l', rang: '#a3e635' },
            ],
          },
          pastki: ['n.sh.: 0°C va 101,3 kPa sharoit', 'Vm = 22,4 l/mol = 0,0224 m³/mol', 'Massasi turlicha, hajmi esa teng!'],
        },
        {
          id: 'jadval19',
          tugma: '19-jadval (H₂ va SI)',
          formula: 'H₂: M = 0,002016 kg/mol, ρ = 0,09 kg/m³ → Vm = 0,0224 m³/mol',
          tur: 'hisob',
          cfg: {
            sarlavha: '19-jadval (105-bet): SI birliklarida molyar hajm hisobi',
            tenglama: 'Vm = M / ρ = 0,002016 kg/mol / 0,09 kg/m³ = 0,0224 m³/mol = 22,4 l/mol',
            qadamlar: [
              { belgi: 'M(H₂) SI da', natija: '0,002016 kg/mol', izoh: '2,016 g/mol', rang: '#38bdf8' },
              { belgi: 'ρ(H₂) n.sh. da', natija: '0,09 kg/m³', izoh: '0,089 g/l', rang: '#fbbf24' },
              { belgi: 'Vm = M / ρ', natija: '0,0224 m³/mol', izoh: '22,4 litr/mol', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Molar hajm (l/mol)', foiz: 100, qiymat: '22,4 l/mol', rang: '#34d399' },
              { nom: 'Molar hajm (m³/mol)', foiz: 65, qiymat: '0,0224 m³/mol', rang: '#38bdf8' },
            ],
            javobBadge: '19-jadval: Vm = 22,4 l/mol = 0,0224 m³/mol',
          },
          pastki: ['H₂: M = 0,002016 kg/mol, ρ = 0,09 kg/m³', '0,002016 / 0,09 = 0,0224 m³/mol', '1 m³ = 1000 litr → 22,4 l/mol'],
        },
      ]}
    />
  );
}

function KorgazmaGazZichligi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Gazlar zichligi ρ = M / Vm (105-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'zichliklar',
          tugma: 'Gazlar zichligi (g/l)',
          formula: 'H₂: 0,089 • Havo: 1,295 • CO₂: 1,96 • SO₂: 2,86 • Cl₂: 3,17 g/l',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'n.sh. da gazlarning zichligi (g/l): ρ = M / 22,4',
            tenglama: 'ρ = M / Vm (g/l)   |   M = ρ · 22,4 (g/mol)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'H₂ (0,089)', qiymat: 0.089, yorliq: '0,089', rang: '#38bdf8' },
              { nom: 'Havo (1,295)', qiymat: 1.295, yorliq: '1,295', rang: '#94a3b8' },
              { nom: 'CO₂ (1,96)', qiymat: 1.96, yorliq: '1,96', rang: '#34d399' },
              { nom: 'SO₂ (2,86)', qiymat: 2.86, yorliq: '2,86', rang: '#fbbf24' },
              { nom: 'Cl₂ (3,17)', qiymat: 3.17, yorliq: '3,17', rang: '#a3e635' },
            ],
          },
          pastki: ['H₂ eng yengil (0,089 g/l); Havo 1,295', 'CO₂: 44/22,4 = 1,96 g/l', 'SO₂: 2,86; Cl₂: 3,17 g/l'],
        },
        {
          id: 'zichlik_masala',
          tugma: 'ρ = 2,86 g/l → M topish',
          formula: 'M = ρ · Vm = 2,86 · 22,4 = 64 g/mol → SO₂',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Zichligi 2,86 g/l bo\'lgan gazning molyar massasi (105-bet)',
            tenglama: 'M = ρ · 22,4 = 2,86 · 22,4 = 64 g/mol   (SO₂)',
            qadamlar: [
              { belgi: 'Berilgan ρ', natija: '2,86 g/l', izoh: 'n.sh. zichligi', rang: '#38bdf8' },
              { belgi: 'M = ρ · Vm', natija: '2,86 · 22,4', izoh: 'Vm = 22,4 l/mol', rang: '#fbbf24' },
              { belgi: 'Natija M', natija: '64 g/mol (SO₂)', izoh: '32 + 2·16 = 64', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'CO₂ (1,96 g/l)', foiz: 68, qiymat: '44 g/mol', rang: '#38bdf8' },
              { nom: 'SO₂ (2,86 g/l)', foiz: 100, qiymat: '64 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: M = 64 g/mol (SO₂ — oltingugurt(IV) oksid)',
          },
          pastki: ['M = ρ · 22,4 formula asosiy', '2,86 × 22,4 = 64 g/mol', 'M(SO₂) = 32 + 32 = 64'],
        },
      ]}
    />
  );
}

function KorgazmaNisbiyZichlik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Nisbiy zichlik D = M₁ / M₂ (106-bet)"
      ikon="filtr"
      variantlar={[
        {
          id: 'd_misol',
          tugma: 'D_H2, D_havo ("tulki dumi")',
          formula: 'D_H2(O₂)=16 • D_H2(CH₄)=8 • NO₂ ("tulki dumi") D_havo=1,59',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Gazlar nisbiy zichligi va Farg\'onaazot "tulki dumi" (NO₂)',
            tenglama: 'D_H2 = M/2   |   D_He = M/4   |   D_havo = M/29   (M_havo ≈ 29)',
            qadamlar: [
              { belgi: 'D_H2(O₂) = 32/2', natija: '16', izoh: 'D_H2(CH₄)=16/2=8', rang: '#38bdf8' },
              { belgi: 'NO₂ ("tulki dumi")', natija: 'D_havo = 1,59', izoh: '46 / 29 ≈ 1,59', rang: '#f97316' },
              { belgi: 'Xulosa', natija: 'M = 2·D_H2 = 29·D_havo', izoh: 'Asosiy formulalar', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'O₂ (D_H2 = 16)', foiz: 70, qiymat: '32 g/mol', rang: '#38bdf8' },
              { nom: 'NO₂ (D_havo = 1,59)', foiz: 100, qiymat: '46 g/mol', rang: '#f97316' },
            ],
            javobBadge: 'D = M₁/M₂ • NO₂ ("tulki dumi") havodan 1,59× og\'ir',
          },
          pastki: ['D_H2(O₂) = 16; D_H2(CH₄) = 8', 'Farg\'onaazot "tulki dumi" NO₂: D_havo = 1,59', 'M₁ = D · M₂ (M_havo = 29)'],
        },
        {
          id: 'fosfor_p4',
          tugma: 'Oq fosfor bug\'i (D_He=31)',
          formula: 'D_He = 31 → M = 31·4 = 124 → N = 124/31 = 4 → P₄!',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Geliyga nisbatan zichligi 31 bo\'lgan oq fosfor bug\'i = P₄',
            tenglama: 'M = D_He · 4 = 31 · 4 = 124 g/mol   →   124 / 31 = 4 atom (P₄)',
            markaz: { belgi: 'P', rang: '#fde047', r: 21 },
            atomlar: [
              { belgi: 'P', rang: '#f97316', r: 17, masofa: 72, bog: 1, burchak: 0 },
              { belgi: 'P', rang: '#f97316', r: 17, masofa: 72, bog: 1, burchak: 2.1 },
              { belgi: 'P', rang: '#f97316', r: 17, masofa: 72, bog: 1, burchak: 4.2 },
            ],
            metrikalar: [
              { nom: 'M = 31 · 4 (He)', qiymat: '124 g/mol', foiz: 100, rang: '#fde047' },
              { nom: 'Atom soni (124/31)', qiymat: '4 ta → P₄', foiz: 85, rang: '#f97316' },
            ],
            belgilar: [{ k: 'Tetraedr', v: 'Oq fosfor bug\'i P₄', rang: '#34d399' }],
          },
          pastki: ['D_He = 31 → M = 31 × 4 = 124 g/mol', 'Ar(P) = 31 → 124 / 31 = 4', 'Formula: P₄ (tetraedrik molekula)'],
        },
      ]}
    />
  );
}

function Korgazma25Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 107-bet masalalari: m → n → V"
      ikon="formula"
      variantlar={[
        {
          id: 'uc_gaz',
          tugma: '16 g SO₂, 90 g bug\', 22 g CO₂',
          formula: '16 g SO₂ = 5,6 l • 90 g H₂O bug\' = 112 l • 22 g CO₂ = 11,2 l',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Massadan molyar hajm bo\'yicha n.sh. hajmni topish',
            tenglama: 'n = m / M   →   V = n · 22,4 l/mol',
            qadamlar: [
              { belgi: '16 g SO₂ (M=64)', natija: '5,6 litr', izoh: '0,25 mol · 22,4', rang: '#fbbf24' },
              { belgi: '90 g H₂O bug\' (M=18)', natija: '112 litr', izoh: '5 mol · 22,4', rang: '#38bdf8' },
              { belgi: '22 g CO₂ (M=44)', natija: '11,2 litr', izoh: '0,5 mol · 22,4', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '16 g SO₂ (0,25 mol)', foiz: 12, qiymat: '5,6 litr', rang: '#fbbf24' },
              { nom: '22 g CO₂ (0,5 mol)', foiz: 24, qiymat: '11,2 litr', rang: '#34d399' },
              { nom: '90 g H₂O bug\' (5 mol)', foiz: 100, qiymat: '112 litr', rang: '#38bdf8' },
            ],
            javobBadge: 'Javoblar: SO₂ = 5,6 l;  CO₂ = 11,2 l;  H₂O(bug\') = 112 l',
          },
          pastki: ['16/64 = 0,25 mol SO₂ → 5,6 l', '90/18 = 5 mol suv bug\'i → 112 l', '22/44 = 0,5 mol CO₂ → 11,2 l'],
        },
        {
          id: 'zanjir_formula',
          tugma: 'Mol ko\'prigi (n = m/M = V/Vm)',
          formula: 'm / M  =  V / 22,4  =  N / (6,02·10²³)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Avogadro va molyar hajm masalalarining yagona formulasi',
            tenglama: 'n  =  m / M  =  V / 22,4  =  N / N_A',
            qadamlar: [
              { belgi: 'Massadan', natija: 'n = m / M', izoh: 'g / (g/mol)', rang: '#38bdf8' },
              { belgi: 'Hajmdan (n.sh.)', natija: 'n = V / 22,4', izoh: 'l / (l/mol)', rang: '#fde047' },
              { belgi: 'Zarrachadan', natija: 'n = N / 6,02·10²³', izoh: 'ta / mol⁻¹', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Gaz hajmi (n.sh.)', foiz: 85, qiymat: 'V = n · 22,4 l', rang: '#fde047' },
              { nom: 'Molekula soni', foiz: 100, qiymat: 'N = n · 6,02·10²³', rang: '#34d399' },
            ],
            javobBadge: 'Universal ko\'prik: m/M = V/22,4 = N/N_A',
          },
          pastki: ['Har qanday masalada avval n topiladi', 'Gaz hajmi uchun V = n × 22,4', 'Molekula soni uchun N = n × 6,02·10²³'],
        },
      ]}
    />
  );
}

function KorgazmaGazAralashma() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Gaz aralashmalari (108-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'ch4_co',
          tugma: '7,84 m³ (CH₄ + CO) = 6,8 kg',
          formula: '71,45% CH₄ (5,6 m³ = 4 kg) + 28,55% CO (2,24 m³ = 2,8 kg) = 6,8 kg',
          tur: 'hisob',
          cfg: {
            sarlavha: '108-bet: 7,84 m³ gaz aralashmasi massasini topish',
            tenglama: 'm = 4 kg (CH₄) + 2,8 kg (CO) = 6,8 kg',
            qadamlar: [
              { belgi: '71,45% CH₄: 5,6 m³', natija: '0,25 kmol = 4 kg', izoh: '5,6/22,4·16', rang: '#38bdf8' },
              { belgi: '28,55% CO: 2,24 m³', natija: '0,1 kmol = 2,8 kg', izoh: '2,24/22,4·28', rang: '#fbbf24' },
              { belgi: 'Jami massa', natija: '6,8 kg', izoh: '4 + 2,8 kg', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'CH₄ (71,45% / 5,6 m³)', foiz: 71.5, qiymat: '4,0 kg', rang: '#38bdf8' },
              { nom: 'CO (28,55% / 2,24 m³)', foiz: 28.5, qiymat: '2,8 kg', rang: '#fbbf24' },
            ],
            javobBadge: 'Javob: 7,84 m³ aralashma massasi = 6,8 kg',
          },
          pastki: ['V(CH₄) = 7,84·0,7145 = 5,6 m³ → 4 kg', 'V(CO) = 7,84·0,2855 = 2,24 m³ → 2,8 kg', 'Umumiy massa: 4 + 2,8 = 6,8 kg'],
        },
        {
          id: 'ortacha_m',
          tugma: '40% CO + 60% CO₂ → D_H2',
          formula: 'M_o\'rt = 0,4·28 + 0,6·44 = 37,6 g/mol → D_H2 = 18,8',
          tur: 'hisob',
          cfg: {
            sarlavha: '108-bet: aralashmaning o\'rtacha molyar massasi va D_H2',
            tenglama: 'M_o\'rt = φ₁M₁ + φ₂M₂ = 0,4·28 + 0,6·44 = 37,6   →   D_H2 = 37,6/2 = 18,8',
            qadamlar: [
              { belgi: '40% CO (M=28)', natija: '0,4 · 28 = 11,2', izoh: 'CO ulushi', rang: '#38bdf8' },
              { belgi: '60% CO₂ (M=44)', natija: '0,6 · 44 = 26,4', izoh: 'CO₂ ulushi', rang: '#fde047' },
              { belgi: 'M_o\'rt = 37,6 g/mol', natija: 'D_H2 = 18,8', izoh: '37,6 / 2 = 18,8', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'CO (40%)', foiz: 40, qiymat: '11,2 g/mol', rang: '#38bdf8' },
              { nom: 'CO₂ (60%)', foiz: 60, qiymat: '26,4 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: M_o\'rt = 37,6 g/mol;  D_H2 = 18,8',
          },
          pastki: ['M_o\'rt = φ₁·M₁ + φ₂·M₂ (hajmiy ulush)', '0,4·28 + 0,6·44 = 11,2 + 26,4 = 37,6', 'D_H2 = 37,6 / 2 = 18,8'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (24-§) VA O'YINLAR (25-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '19-rasm favvora tajribasida 0°C da 1 hajm suvda necha hajm HCl eriydi?',
    variantlar: [
      { matn: '22,4 hajm', togri: false },
      { matn: '2 hajm HCl', togri: false },
      { matn: '~500 hajm HCl (ko\'k lakmus → qizil)', togri: true },
      { matn: 'Suvda erimaydi', togri: false },],
    izoh: '102-bet 24-§: ~500 hajm HCl erib vakuum hosil qiladi.',
  },
  {
    id: 't2',
    savol: 'Nima uchun quruq HCl gazi temir va rux bilan reaksiyaga kirishmaydi?',
    variantlar: [
      { matn: 'Erkin H⁺ ionlari yo\'q (suvda ajraladi)', togri: true },
      { matn: 'Og\'ir gaz', togri: false },
      { matn: 'Alanga yo\'q', togri: false },
      { matn: 'Qutbsiz bog\'', togri: false },],
    izoh: 'Kislotalik H⁺ ionlari borligida namoyon bo\'ladi.',
  },
  {
    id: 't3',
    savol: '2NaCl(q) + H₂SO₄(kons) kuchli qizdirilganda qaysi moddalar olinadi?',
    variantlar: [
      { matn: 'NaHSO₄ + Cl₂↑', togri: false },
      { matn: 'NaClO + H₂O', togri: false },
      { matn: 'Na₂S + O₂', togri: false },
      { matn: 'Na₂SO₄ + 2HCl↑', togri: true },],
    izoh: '101-bet: kuchli t° da o\'rta tuz Na₂SO₄ hosil bo\'ladi.',
  },
  {
    id: 't4',
    savol: '100 ml suvda 5,6 l HCl (0,25 mol) eritilsa HCl ning massa ulushi:',
    variantlar: [
      { matn: '5,6%', togri: false },
      { matn: '8,36% (9,125 / 109,125)', togri: true },
      { matn: '10%', togri: false },
      { matn: '37%', togri: false },],
    izoh: '103-bet masalasi: 9,125 / 109,125 = 8,36%.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'qonun_vm', nom: 'Avogadro & Vm', tavsif: '1811, N_A, 22,4 l, H₂O' },
    { id: 'zichlik', nom: 'Zichlik ρ & D', tavsif: '2,86 g/l, NO₂, P₄' },
    { id: 'aralashma', nom: 'Masalalar & Aralashma', tavsif: '16 g SO₂, 6,8 kg, 18,8' },
  ],
  topshiriqlar: [
    { nom: 'Vm = 22,4 l/mol = 0,0224 m³/mol', qisqa: '0°C, 101,3 kPa (n.sh.)', guruh: 'qonun_vm', izoh: '19-jadval (105-bet).' },
    { nom: 'N_A = 6,02·10²³ mol⁻¹ (1811, gazlar)', qisqa: 'Suyuq va qattiq bo\'ysunmaydi', guruh: 'qonun_vm', izoh: 'Avogadro qonuni faqat gazlarga.' },
    { nom: '4°C 1 l suv = 55,56 mol = 3,344·10²⁵', qisqa: '1000 / 18 = 55,56 mol', guruh: 'qonun_vm', izoh: 'Suyuq suvda zich joylashadi.' },
    { nom: 'ρ = M/Vm; ρ=2,86 → M=64 (SO₂)', qisqa: 'CO₂=1,96; Cl₂=3,17; H₂=0,089', guruh: 'zichlik', izoh: '2,86 · 22,4 = 64 g/mol.' },
    { nom: 'D_H2(O₂)=16; NO₂ ("tulki dumi") D_havo=1,59', qisqa: 'M_havo = 29 g/mol', guruh: 'zichlik', izoh: 'Farg\'onaazot misoli (106-bet).' },
    { nom: 'Oq fosfor bug\'i D_He=31 → M=124 → P₄', qisqa: '124 / 31 = 4 atom', guruh: 'zichlik', izoh: 'D_He · 4 = 124 g/mol.' },
    { nom: '16 g SO₂ = 5,6 l; 90 g H₂O(bug\') = 112 l', qisqa: '22 g CO₂ = 11,2 l', guruh: 'aralashma', izoh: '107-bet masalalari.' },
    { nom: '7,84 m³ (71,45% CH₄ + 28,55% CO) = 6,8 kg', qisqa: '4 kg CH₄ + 2,8 kg CO', guruh: 'aralashma', izoh: '108-bet aralashma massasi.' },
    { nom: '40% CO + 60% CO₂ → M_o\'rt = 37,6 → D_H2=18,8', qisqa: '0,4·28 + 0,6·44 = 37,6', guruh: 'aralashma', izoh: '108-bet o\'rtacha molyar massa.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'n.sh. Vm',
    savol: 'n.sh. (0°C, 101,3 kPa) da har qanday 1 mol gazning molyar hajmi:',
    variantlar: ['18 l/mol', '11,2 l/mol', '22,4 l/mol = 0,0224 m³/mol', '100 l/mol'],
    togri: 2,
    izoh: '105-bet 19-jadval: Vm = 22,4 l/mol.',
  },
  {
    belgi: 'Zichlik → M',
    savol: 'n.sh. da zichligi ρ = 2,86 g/l bo\'lgan gazning formulasi:',
    variantlar: ['SO₂ (M = 64 g/mol)', 'CO₂ (M=44)', 'Cl₂ (M=71)', 'CH₄ (M=16)'],
    togri: 0,
    izoh: 'M = 2,86 · 22,4 = 64 g/mol (SO₂).',
  },
  {
    belgi: 'Oq fosfor',
    savol: 'Geliyga nisbatan zichligi D_He = 31 bo\'lgan oq fosfor bug\'i formulasi:',
    variantlar: ['P', 'P₂', 'P₈', 'P₄ (M = 124 g/mol)'],
    togri: 3,
    izoh: 'M = 31 · 4 = 124; 124 / 31 = 4 → P₄.',
  },
  {
    belgi: 'O\'rtacha D_H2',
    savol: '40% CO va 60% CO₂ aralashmasining vodorodga nisbatan zichligi D_H2:',
    variantlar: ['37,6', '18,8 (M_o\'rt = 37,6)', '14', '36'],
    togri: 1,
    izoh: 'M_o\'rt = 0,4·28 + 0,6·44 = 37,6 → 37,6/2 = 18,8.',
  },
  {
    belgi: '4°C 1 l H₂O',
    savol: '4°C da 1 litr suyuq suvda nechta mol va molekula bor?',
    variantlar: ['0,0446 mol', '55,56 mol = 3,344·10²⁵ ta', '1 mol', '22,4 mol'],
    togri: 1,
    izoh: '1000 / 18 = 55,56 mol; 55,56·6,02·10²³ = 3,344·10²⁵.',
  },
  {
    belgi: 'Tulki dumi',
    savol: 'Farg\'onaazot zavodidagi "tulki dumi" (NO₂) ning havoga nisbatan zichligi:',
    variantlar: ['0,5', '16', '2,45', '1,59 (46 / 29)'],
    togri: 3,
    izoh: 'M(NO₂) = 46; D_havo = 46 / 29 ≈ 1,59.',
  },
  {
    belgi: '107-bet',
    savol: '16 g SO₂ va 90 g suv bug\'ining n.sh. dagi hajmlari:',
    variantlar: ['5,6 litr SO₂ va 112 litr H₂O bug\'', '2,8 l va 56 l', '11,2 l va 22,4 l', '22,4 l va 90 l'],
    togri: 0,
    izoh: '0,25 mol·22,4 = 5,6 l; 5 mol·22,4 = 112 l.',
  },
  {
    belgi: 'Aralashma',
    savol: '7,84 m³ (71,45% CH₄ + 28,55% CO) gaz aralashmasi massasi:',
    variantlar: ['4,0 kg', '2,8 kg', '6,8 kg (4 kg + 2,8 kg)', '7,84 kg'],
    togri: 2,
    izoh: '5,6 m³ CH₄ (4 kg) + 2,24 m³ CO (2,8 kg) = 6,8 kg.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '106-bet: Oq fosfor bug\'i P₄',
    vazifa: 'D_He = 31 dan P₄ formulasini keltirib chiqarish tartibi:',
    tartib: [
      '1. D_He = 31 (He molyar massasi M = 4 g/mol)',
      '2. M(bug\') = 31 · 4 = 124 g/mol',
      '3. Atom soni = 124 / Ar(P) = 124 / 31 = 4',
      '4. Oq fosfor bug\'i formulasi: P₄',
    ],
    variantlar: [
      '3. Atom soni = 124 / Ar(P) = 124 / 31 = 4',
      '1. D_He = 31 (He molyar massasi M = 4 g/mol)',
      '4. Oq fosfor bug\'i formulasi: P₄',
      '2. M(bug\') = 31 · 4 = 124 g/mol',
    ],
  },
  {
    tur: '108-bet: 40% CO + 60% CO₂ → D_H2',
    vazifa: 'Gaz aralashmasining D_H2 sini topish bosqichlari:',
    tartib: [
      '1. CO ulushi: 0,4 · 28 = 11,2 g/mol',
      '2. CO₂ ulushi: 0,6 · 44 = 26,4 g/mol',
      '3. M_o\'rt = 11,2 + 26,4 = 37,6 g/mol',
      '4. D_H2 = 37,6 / 2 = 18,8',
    ],
    variantlar: [
      '2. CO₂ ulushi: 0,6 · 44 = 26,4 g/mol',
      '4. D_H2 = 37,6 / 2 = 18,8',
      '1. CO ulushi: 0,4 · 28 = 11,2 g/mol',
      '3. M_o\'rt = 11,2 + 26,4 = 37,6 g/mol',
    ],
  },
  {
    tur: 'Zichlik ortishi (H₂ → Cl₂)',
    vazifa: 'Gazlarni zichligi ρ (g/l) ORTIB borishi tartibida joylang:',
    tartib: [
      'H₂ (ρ = 0,089 g/l, M = 2)',
      'Havo (ρ = 1,295 g/l, M = 29)',
      'CO₂ (ρ = 1,96 g/l, M = 44)',
      'Cl₂ (ρ = 3,17 g/l, M = 71)',
    ],
    variantlar: [
      'CO₂ (ρ = 1,96 g/l, M = 44)',
      'H₂ (ρ = 0,089 g/l, M = 2)',
      'Cl₂ (ρ = 3,17 g/l, M = 71)',
      'Havo (ρ = 1,295 g/l, M = 29)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Avogadro qonuni nechanchi yilda va qaysi moddalar uchun kashf etilgan?',
    variantlar: ['1869-yil, suyuqliklar', '1811-yil, faqat gaz va bug\'lar', '1820-yil, qattiq tuzlar', '1911-yil, metallar'],
    togri: 1,
    izoh: 'Suyuq va qattiq moddalar Avogadro qonuniga bo\'ysunmaydi.',
  },
  {
    savol: 'D_H2(O₂) va D_H2(CH₄) qiymatlari:',
    variantlar: ['32 va 16', '1,1 va 0,55', '8 va 4', '16 (O₂) va 8 (CH₄)'],
    togri: 3,
    izoh: '32/2 = 16; 16/2 = 8.',
  },
  {
    savol: '22 g CO₂ n.sh. da necha litr hajmni egallaydi?',
    variantlar: ['11,2 litr (0,5 mol)', '5,6 l', '22,4 l', '44,8 l'],
    togri: 0,
    izoh: '22 / 44 = 0,5 mol · 22,4 = 11,2 litr.',
  },
  {
    savol: 'CO₂ (M=44) ning n.sh. dagi zichligi ρ (g/l):',
    variantlar: ['0,089', '1,295', '1,96 g/l (44 / 22,4)', '2,86'],
    togri: 2,
    izoh: 'ρ(CO₂) = 44 / 22,4 ≈ 1,96 g/l.',
  },
  {
    savol: '19-jadvalga ko\'ra H₂ ning SI dagi molyar massasi va zichligi:',
    variantlar: ['1 kg/mol; 1 kg/m³', '2 g/mol; 22,4', 'M=0,002016 kg/mol; ρ=0,09 kg/m³', '32 g/mol; 1,43'],
    togri: 2,
    izoh: '0,002016 / 0,09 = 0,0224 m³/mol.',
  },
  {
    savol: 'Havoga nisbatan zichligi D_havo = 2 bo\'lgan gazning molyar massasi:',
    variantlar: ['58 g/mol (2 · 29)', '4 g/mol', '44 g/mol', '16 g/mol'],
    togri: 0,
    izoh: 'M = 2 · M(havo) = 2 · 29 = 58 g/mol.',
  },
  {
    savol: 'Avogadro doimiysi N_A ning qiymati:',
    variantlar: ['22,4 l/mol', '6,02 · 10²³ mol⁻¹', '8,31', '1,295 g/l'],
    togri: 1,
    izoh: '1 mol moddadagi zarrachalar soni.',
  },
  {
    savol: '7,84 m³ gaz aralashmasi (71,45% CH₄ + 28,55% CO) tarkibidagi CO massasi:',
    variantlar: ['4,0 kg', '6,8 kg', '1,4 kg', '2,8 kg (2,24 m³ = 0,1 kmol)'],
    togri: 3,
    izoh: '2,24 / 22,4 = 0,1 kmol · 28 = 2,8 kg CO.',
  },
];

export default function S8Mavzu25() {
  const korgazmalar = [
    { nom: '1. Avogadro (1811) & H₂O', ikon: 'atom', komponent: <KorgazmaAvogadroQonuni /> },
    { nom: '2. Vm = 22,4 l (19-jad.)', ikon: 'kolba', komponent: <KorgazmaMolyarHajm /> },
    { nom: '3. Zichlik ρ = M / Vm', ikon: 'grafik', komponent: <KorgazmaGazZichligi /> },
    { nom: '4. Nisbiy D & P₄', ikon: 'filtr', komponent: <KorgazmaNisbiyZichlik /> },
    { nom: '5. 107-bet masalalari', ikon: 'formula', komponent: <Korgazma25Masalalar /> },
    { nom: '6. Gaz aralashma (108-b)', ikon: 'grafik', komponent: <KorgazmaGazAralashma /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-25"
          nom="Avogadro qonunini guruhlang"
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
          key="tezkor-25"
          nom="25-§: Avogadro qonuni"
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
          key="zanjir-25"
          nom="Molyar hajm va zichlik"
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
          key="duel-25"
          sarlavha="25-§: Avogadro qonuni dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="25-§"
      mavzuNom="Avogadro qonuni. Molyar hajm"
      oldingiRaqam="24-§"
      oldingiNom="Vodorod xlorid"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
