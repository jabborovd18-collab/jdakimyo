'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 39-PARAGRAF
// "Nitrat kislota va nitratlar" (Darslik 165-174-betlar)
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
function KorgazmaHNO3Olinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. HNO₃ tuzilishi, lab va sanoat (27-rasm)"
      ikon="kolba"
      variantlar={[
        {
          id: 'tuzilish',
          tugma: 'Tuzilish & xossa',
          formula: 'HNO₃ • Mr = 63 • N: IV valent, OD = +5',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Nitrat kislota: donor-akseptor N→O va sp²',
            tenglama: 'H-O-N(=O)→O  |  ρ = 1,5 g/cm³  |  Tqot = -41°C',
            rejim: 'molekula',
            markaz: { belgi: 'N⁺⁵', rang: '#38bdf8', r: 24, zaryad: 'IV' },
            atomlar: [
              { belgi: 'OH', rang: '#fb7185', r: 19, masofa: 84, bog: 1, burchak: 3.14 },
              { belgi: 'O', rang: '#ef4444', r: 20, masofa: 86, bog: 2, burchak: -1.0 },
              { belgi: 'O', rang: '#f97316', r: 19, masofa: 86, bog: 1, burchak: 1.0 },
            ],
            metrikalar: [
              { nom: 'Zichlik (suvsiz)', qiymat: '1,5 g/cm³', foiz: 75, rang: '#38bdf8' },
              { nom: 'Kons. massa ulush', qiymat: '63–65%', foiz: 65, rang: '#fbbf24' },
              { nom: 'Qaynash (parchalanadi)', qiymat: '83–84°C', foiz: 55, rang: '#ef4444' },
            ],
            belgilar: [{ k: 'Yorug\'da', v: '4HNO₃→4NO₂+O₂+2H₂O', rang: '#f97316' }],
          },
          pastki: ['N: IV valent (2d yo\'q), OD = +5', 'Yorug\'likda sariq NO₂ chiqaradi', 'Mr(HNO₃) = 63'],
        },
        {
          id: 'lab',
          tugma: 'Laboratoriya',
          formula: 'NaNO₃ + H₂SO₄(kons.) → NaHSO₄ + HNO₃↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Chili selitrasini qizdirib HNO₃ haydash',
            tenglama: 'NaNO₃ + H₂SO₄(kons.) → NaHSO₄ + HNO₃↑',
            ikkiIdish: true,
            suyuqlikRang: '#fbbf24',
            tolish: 0.65,
            stakanBelgi: 'NaNO₃+H₂SO₄',
            stakanSarlavha: 'Retorta (t°)',
            ikkinchiSuyuqlikRang: '#bae6fd',
            ikkinchiBelgi: 'HNO₃(s)',
            ikkinchiSarlavha: 'Sovitkich',
            gazRang: '#fb923c',
            gazBelgi: 'HNO₃',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 110,
            maxTemp: 150,
            belgilar: [{ k: 'Shisha', v: 'Rezina yemiriladi', rang: '#fbbf24' }],
          },
          pastki: ['Shisha asbobda (rezinasiz)', 'Kuchsiz qizdiriladi', 'Qattiq NaNO₃ + kons. H₂SO₄'],
        },
        {
          id: 'sanoat',
          tugma: 'Sanoat (3 bosqich)',
          formula: 'NH₃ → NO → NO₂ → HNO₃ (27-rasm)',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Ammiakdan nitrat kislota olish (Ostvald)',
            tenglama: '4NH₃+5O₂ → 4NO+6H₂O  →  2NO+O₂=2NO₂  →  HNO₃',
            bosqichlar: [
              { nom: '1. Kontakt (Pt/Cr₂O₃)', tur: 'kataliz', ichi: 'NH₃+O₂ 800°C', mahsulot: 'NO↑', rang: '#38bdf8' },
              { nom: '2. Sovitkich/Oksid.', tur: 'sovutkich', ichi: '2NO + O₂', mahsulot: 'NO₂', rang: '#f97316' },
              { nom: '3. Yuttirish minorasi', tur: 'minora', ichi: '4NO₂+2H₂O+O₂', mahsulot: '4HNO₃', rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Katalizator', v: 'Pt, Cr₂O₃/MnO₂', rang: '#34d399' }],
          },
          pastki: ['4NH₃ + 5O₂ → 4NO + 6H₂O', '2NO + O₂ = 2NO₂', '4NO₂ + 2H₂O + O₂ = 4HNO₃'],
        },
      ]}
    />
  );
}

function KorgazmaHNO3Metallar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Metallar, Fe/Al passivligi va &apos;Zar suvi&apos;"
      ikon="harorat"
      variantlar={[
        {
          id: 'kons_suyul',
          tugma: 'Kons. vs Suyul.',
          formula: 'Cu + HNO₃ → H₂ CHIQMAYDI!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Konsentrlangan va suyultirilgan HNO₃ + Cu',
            tenglama: 'Kons: NO₂↑ (qo\'ng\'ir)   |   Suyul: NO↑ → havoda NO₂',
            ikkiIdish: true,
            suyuqlikRang: '#0ea5e9',
            tolish: 0.72,
            stakanBelgi: 'Cu+Kons',
            stakanSarlavha: 'Kons. HNO₃',
            ikkinchiSuyuqlikRang: '#38bdf8',
            ikkinchiBelgi: 'Cu+Suyul',
            ikkinchiSarlavha: 'Suyul. HNO₃',
            gazRang: '#b45309',
            gazBelgi: 'NO₂ / NO',
            reagentlar: [{ belgi: 'Cu', rang: '#ea580c' }],
            belgilar: [{ k: 'Eritma', v: 'Cu(NO₃)₂ (havorang)', rang: '#38bdf8' }],
          },
          pastki: ['Cu + 4HNO₃(kons) → 2NO₂↑', '3Cu + 8HNO₃(suyul) → 2NO↑', 'HNO₃ metallar bilan H₂ bermaydi'],
        },
        {
          id: 'juda_suyul',
          tugma: 'Faol metall (NH₄NO₃)',
          formula: '4Fe + 10HNO₃(j.suyul) → 4Fe(NO₃)₂ + NH₄NO₃ + 3H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Juda suyultirilgan HNO₃: N⁺⁵ → N⁻³ (NH₄⁺)',
            tenglama: '4Fe + 10HNO₃ → 4Fe(NO₃)₂ + NH₄NO₃ + 3H₂O',
            suyuqlikRang: '#86efac',
            tolish: 0.75,
            stakanBelgi: 'Fe(NO₃)₂+NH₄⁺',
            stakanSarlavha: 'Juda suyul. HNO₃',
            reagentlar: [{ belgi: 'Fe', rang: '#94a3b8' }],
            elektronJuft: { chap: 'N⁺⁵', ong: 'N⁻³', e: '+8ē' },
            belgilar: [{ k: 'Sovuq kons.', v: 'Fe, Al, Cr passiv!', rang: '#fbbf24' }],
          },
          pastki: ['Faol metall N⁺⁵ ni -3 gacha qaytaradi', 'Fe, Al, Cr sovuq kons. HNO₃ da erimaydi', 'Tashish: Al/Fe sisternada'],
        },
        {
          id: 'zar_suvi',
          tugma: 'Zar suvi & 28-rasm',
          formula: '1 HNO₃ : 3 HCl (Au, Pt)  |  Skipidar yonishi',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '"Zar suvi" (Au/Pt) va 28-rasm: skipidar yonishi',
            tenglama: 'Au + HNO₃ + 3HCl = AuCl₃ + NO↑ + 2H₂O',
            ikkiIdish: true,
            suyuqlikRang: '#eab308',
            tolish: 0.7,
            stakanBelgi: 'HNO₃+3HCl',
            stakanSarlavha: 'Zar suvi (Au)',
            ikkinchiSuyuqlikRang: '#f97316',
            ikkinchiBelgi: 'Skipidar',
            ikkinchiSarlavha: '28-rasm: Yonish',
            gazRang: '#fb923c',
            gazBelgi: 'NO↑/Tutun',
            qizdir: true,
            olovRang: '#fbbf24',
            tempC: 450,
            maxTemp: 600,
            reagentlar: [{ belgi: 'Au/Pt', rang: '#fde047' }],
            belgilar: [{ k: 'Pt', v: '3Pt+4HNO₃+12HCl→3PtCl₄', rang: '#e2e8f0' }],
          },
          pastki: ['Zar suvi = 1 hajm HNO₃ + 3 hajm HCl', 'AuCl₃ va PtCl₄ hosil bo\'ladi', '28-rasm: kons. HNO₃ yog\'och/skipidarni yoqadi'],
        },
      ]}
    />
  );
}

function KorgazmaNitratlarParchalanish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Nitratlarning parchalanishi va NO₃⁻ testi"
      ikon="kristall"
      variantlar={[
        {
          id: 'faol',
          tugma: 'K–Na (nitrit)',
          formula: '2KNO₃ →(t°) 2KNO₂ + O₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Faol metall nitratlari (Mg dan chapda)',
            tenglama: '2KNO₃ →(t°) 2KNO₂ + O₂↑   (2NaNO₃ → 2NaNO₂ + O₂↑)',
            suyuqlikRang: '#cbd5e1',
            tolish: 0.45,
            stakanBelgi: 'KNO₂',
            stakanSarlavha: 'Nitrit qoladi',
            gazRang: '#38bdf8',
            gazBelgi: 'O₂↑',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 420,
            maxTemp: 600,
            belgilar: [{ k: 'Gaz', v: 'Faqat toza O₂↑', rang: '#38bdf8' }],
          },
          pastki: ['K–Ca gacha: nitrit + O₂↑', 'Barcha nitratlar suvda eriydi', 'Selitra = KNO₃, NaNO₃'],
        },
        {
          id: 'orta_va_passiv',
          tugma: 'Mg–Cu & Ag–Au',
          formula: '2Cu(NO₃)₂ → 2CuO+4NO₂+O₂  |  2AgNO₃ → 2Ag+2NO₂+O₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'O\'rta (oksid) vs Passiv metall nitratlari (erkin Me)',
            tenglama: 'Mg..Cu: MeO+NO₂+O₂   |   Cu dan o\'ngda: Me+NO₂+O₂',
            ikkiIdish: true,
            suyuqlikRang: '#0284c7',
            tolish: 0.55,
            stakanBelgi: 'Cu(NO₃)₂',
            stakanSarlavha: 'Qora CuO qoladi',
            ikkinchiSuyuqlikRang: '#e2e8f0',
            ikkinchiBelgi: 'AgNO₃',
            ikkinchiSarlavha: 'Kumush Ag qoladi',
            gazRang: '#b45309',
            gazBelgi: 'NO₂+O₂',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 320,
            maxTemp: 500,
            chokmaRang: '#334155',
            chokmaBelgi: 'CuO / Ag',
            belgilar: [{ k: 'NH₄NO₃', v: '→ N₂O↑ + 2H₂O', rang: '#fbbf24' }],
          },
          pastki: ['Mg–Cu: oksid + NO₂↑ + O₂↑', 'Cu dan keyin (Hg, Ag): metall + NO₂ + O₂', 'NH₄NO₃ →(t°) N₂O↑ + 2H₂O'],
        },
        {
          id: 'sifat',
          tugma: 'NO₃⁻ sifat testi',
          formula: 'Nitrat + H₂SO₄(kons) + Cu → qo\'ng\'ir NO₂↑',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Nitrat ionini aniqlash: Mis + kons. H₂SO₄',
            tenglama: '2NO₃⁻ + Cu + 4H⁺ → Cu²⁺(ko\'k) + 2NO₂↑(qo\'ng\'ir) + 2H₂O',
            suyuqlikRang: '#0ea5e9',
            tolish: 0.72,
            stakanBelgi: 'Cu²⁺+NO₃⁻',
            stakanSarlavha: 'Kons. H₂SO₄ + Cu',
            gazRang: '#9a3412',
            gazBelgi: 'NO₂↑',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 120,
            maxTemp: 200,
            reagentlar: [{ belgi: 'Cu', rang: '#ea580c' }],
            belgilar: [{ k: 'Belgi', v: 'Qo\'ng\'ir gaz NO₂↑', rang: '#f97316' }],
          },
          pastki: ['AgNO₃ / BaCl₂ cho\'kma bermaydi!', 'Barcha nitratlar eruvchan', 'Aniqlash: kons. H₂SO₄ + Cu → NO₂↑'],
        },
      ]}
    />
  );
}

function KorgazmaUmumiyQollanish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Kislotali xossalari va ishlatilishi"
      ikon="tomchi"
      variantlar={[
        {
          id: 'kislota',
          tugma: 'Kuchli kislota',
          formula: 'HNO₃ + CuO / Fe(OH)₃ / Na₂CO₃ → tuz + H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Oksid, asos va karbonatlar bilan almashinish',
            tenglama: 'CuO + 2HNO₃ → Cu(NO₃)₂ + H₂O  |  Na₂CO₃ + 2HNO₃ → CO₂↑',
            suyuqlikRang: '#38bdf8',
            tolish: 0.7,
            stakanBelgi: 'Cu(NO₃)₂',
            stakanSarlavha: 'To\'liq dissotsiatsiya',
            gazRang: '#e2e8f0',
            gazBelgi: 'CO₂↑',
            reagentlar: [{ belgi: 'CuO', rang: '#475569' }],
            belgilar: [{ k: 'Lakmus', v: 'Qizil (pH < 1)', rang: '#fb7185' }],
          },
          pastki: ['CuO + 2HNO₃ = Cu(NO₃)₂ + H₂O', 'Fe(OH)₃ + 3HNO₃ = Fe(NO₃)₃ + 3H₂O', 'Na₂CO₃ + 2HNO₃ = 2NaNO₃ + CO₂↑ + H₂O'],
        },
        {
          id: 'ishlatish',
          tugma: 'Ishlatilishi',
          formula: 'O\'g\'it (60%+) • Portlovchi • Bo\'yoq • Raketa',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Nitrat kislota va nitratlarning qo\'llanish ulushi',
            tenglama: 'Qora porox: KNO₃ + S + C  |  O\'g\'it: NH₄NO₃, NaNO₃',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Azotli o\'g\'it', qiymat: 68, yorliq: '68%', rang: '#34d399' },
              { nom: 'Portlovchi/Porox', qiymat: 16, yorliq: '16%', rang: '#f97316' },
              { nom: 'Bo\'yoq/Nitrobir.', qiymat: 10, yorliq: '10%', rang: '#a855f7' },
              { nom: 'Au tozalash/Raketa', qiymat: 6, yorliq: '6%', rang: '#fde047' },
            ],
            belgilar: [{ k: 'Porox', v: 'KNO₃ + S + C', rang: '#fbbf24' }],
          },
          pastki: ['Selitrali o\'g\'itlar (NH₄NO₃, KNO₃)', 'Trotil (TNT), dinamit, porox', 'Raketa yonilg\'isi oksidlovchisi'],
        },
      ]}
    />
  );
}

function Korgazma39MasalalarA() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Masalalar (1): 3,2 g Cu → NO va 5 t HNO₃ → NH₃"
      ikon="formula"
      variantlar={[
        {
          id: 'cu_no',
          tugma: '1-misol: 0,747 l NO',
          formula: '3,2 g Cu + suyul. HNO₃ → ? l NO (n.sh.)',
          tur: 'hisob',
          cfg: {
            sarlavha: '3Cu + 8HNO₃(suyul.) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
            tenglama: '3 mol Cu → 2 mol NO   |   n(Cu) = 3,2 / 64 = 0,05 mol',
            qadamlar: [
              { belgi: 'n(Cu)', natija: '0,05 mol', izoh: '3,2 / 64', rang: '#38bdf8' },
              { belgi: 'n(NO) = 0,05·2/3', natija: '0,0333 mol', izoh: 'Proporsiya 3:2', rang: '#fbbf24' },
              { belgi: 'V = 0,0333·22,4', natija: '0,747 litr', izoh: 'n.sh.da hajm', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'n(Cu) = 0,05 mol', foiz: 100, qiymat: '3,2 g', rang: '#38bdf8' },
              { nom: 'n(NO) = 0,0333', foiz: 66.7, qiymat: '0,747 l', rang: '#34d399' },
            ],
            javobBadge: 'Javob: V(NO) = 0,747 litr',
          },
          pastki: ['M(Cu) = 64 g/mol', '3 : 2 nisbat', '0,0333 × 22,4 = 0,747 l'],
        },
        {
          id: 'ammiak_mass',
          tugma: '2-misol: 0,833 t NH₃',
          formula: '5 t 60% HNO₃ (isrof 2,8%) → m(NH₃) = ?',
          tur: 'hisob',
          cfg: {
            sarlavha: 'NH₃ → HNO₃ (1:1 mol, unum η = 100% − 2,8% = 97,2%)',
            tenglama: 'm(HNO₃) = 5 · 0,6 = 3 t   |   17 t NH₃ → 63 t HNO₃',
            qadamlar: [
              { belgi: 'm(HNO₃)', natija: '3 t', izoh: '5 · 60%', rang: '#38bdf8' },
              { belgi: 'm_naz(NH₃)', natija: '0,81 t', izoh: '3 · 17 / 63', rang: '#fbbf24' },
              { belgi: 'm_am = 0,81/0,972', natija: '0,833 t', izoh: '833 kg NH₃', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Nazariy NH₃', foiz: 97.2, qiymat: '0,81 t', rang: '#fbbf24' },
              { nom: 'Amaliy NH₃ (97,2%)', foiz: 100, qiymat: '0,833 t', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 0,833 tonna (833 kg) NH₃',
          },
          pastki: ['5 t · 0,60 = 3 t HNO₃', 'Unum η = 97,2%', '0,81 / 0,972 = 0,833 t'],
        },
      ]}
    />
  );
}

function Korgazma39MasalalarB() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Masalalar (2): NaNO₃ formulasi va 44,8 l O₂"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'formula',
          tugma: 'Formula (NaNO₃)',
          formula: '56,47% O, 16,47% N, 27,06% Na → ?',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Massa ulushidan tuz formulasini topish',
            tenglama: 'n(Na) : n(N) : n(O) = 27,06/23 : 16,47/14 : 56,47/16',
            qadamlar: [
              { belgi: 'Na: 27,06/23', natija: '1,176', izoh: '÷ 1,176 = 1', rang: '#a855f7' },
              { belgi: 'N: 16,47/14', natija: '1,176', izoh: '÷ 1,176 = 1', rang: '#38bdf8' },
              { belgi: 'O: 56,47/16', natija: '3,529', izoh: '÷ 1,176 = 3', rang: '#fb7185' },
            ],
            taqqosBars: [
              { nom: 'Na (1)', foiz: 27.1, qiymat: '27,06%', rang: '#a855f7' },
              { nom: 'N (1)', foiz: 16.5, qiymat: '16,47%', rang: '#38bdf8' },
              { nom: 'O (3)', foiz: 56.5, qiymat: '56,47%', rang: '#fb7185' },
            ],
            javobBadge: 'Formula: NaNO₃ (M = 85 g/mol)',
          },
          pastki: ['1,176 : 1,176 : 3,529 = 1 : 1 : 3', 'Tuz: NaNO₃', 'Chili selitrasi'],
        },
        {
          id: 'kislorod',
          tugma: '340 g → 44,8 l O₂',
          formula: '2NaNO₃ → 2NaNO₂ + O₂↑ (340 g tuz)',
          tur: 'hisob',
          cfg: {
            sarlavha: '340 g natriy nitrat parchalanganda chiqqan O₂',
            tenglama: 'n(NaNO₃) = 340 / 85 = 4 mol   →   n(O₂) = 2 mol',
            qadamlar: [
              { belgi: 'n(NaNO₃)', natija: '4 mol', izoh: '340 / 85', rang: '#38bdf8' },
              { belgi: 'n(O₂) = 4 / 2', natija: '2 mol', izoh: '2 mol → 1 mol O₂', rang: '#fbbf24' },
              { belgi: 'V(O₂) = 2·22,4', natija: '44,8 litr', izoh: 'n.sh.da hajm', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'NaNO₃', foiz: 100, qiymat: '4 mol (340 g)', rang: '#38bdf8' },
              { nom: 'O₂↑', foiz: 50, qiymat: '2 mol (44,8 l)', rang: '#34d399' },
            ],
            javobBadge: 'Javob: V(O₂) = 44,8 litr',
          },
          pastki: ['M(NaNO₃) = 85 g/mol', '340 / 85 = 4 mol → 2 mol O₂', '2 × 22,4 = 44,8 l'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (38-§) VA O'YINLAR (39-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Rangsz NO havoga chiqqanda nega qo\'ng\'ir tusga kiradi?',
    variantlar: [
      { matn: 'Suv bilan N₂O beradi', togri: false },
      { matn: 'N₂ ga parchalanadi', togri: false },
      { matn: '2NO + O₂ = 2NO₂ (qo\'ng\'ir gaz)', togri: true },
      { matn: 'Kristallanadi', togri: false },],
    izoh: 'Rangsz NO havo kislorodi bilan NO₂ ga oksidlanadi.',
  },
  {
    id: 't2',
    savol: 'Qaysi oksid "kuldiruvchi gaz" va tibbiyotda narkoz?',
    variantlar: [
      { matn: 'N₂O (azot(I) oksid)', togri: true },
      { matn: 'NO₂', togri: false },
      { matn: 'N₂O₅', togri: false },
      { matn: 'N₂O₃', togri: false },],
    izoh: 'N₂O — azot(I) oksid, befarq oksid.',
  },
  {
    id: 't3',
    savol: 'NO₂ + H₂O reaksiyasida qaysi kislotalar hosil bo\'ladi?',
    variantlar: [
      { matn: 'Faqat HNO₃', togri: false },
      { matn: 'H₂SO₄ va NO', togri: false },
      { matn: 'Faqat NH₄OH', togri: false },
      { matn: 'HNO₃ va HNO₂ (yoki O₂ bilan HNO₃)', togri: true },],
    izoh: '2NO₂ + H₂O = HNO₃ + HNO₂ (aralash angidrid).',
  },
  {
    id: 't4',
    savol: 'Qaysi ikkita azot oksidi befarq (tuz hosil qilmaydigan)?',
    variantlar: [
      { matn: 'NO₂ va N₂O₅', togri: false },
      { matn: 'N₂O va NO', togri: true },
      { matn: 'N₂O₅ va NO', togri: false },
      { matn: 'N₂O₃ va NO₂', togri: false },],
    izoh: 'N₂O va NO befarq; N₂O₃, NO₂, N₂O₅ — kislotali.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'olish_xossa', nom: 'Tuzilish & Olish', tavsif: 'IV valent, lab, 3 bosqich' },
    { id: 'metallar', nom: 'Metallar & Zar suvi', tavsif: 'NO₂, NO, NH₄NO₃, Au/Pt' },
    { id: 'nitratlar', nom: 'Nitrat & Qollash', tavsif: 'KNO₂, CuO, Ag, NO₃⁻ testi' },
  ],
  topshiriqlar: [
    { nom: 'IV valent, OD = +5, ρ=1,5', qisqa: 'HNO₃ tuzilishi', guruh: 'olish_xossa', izoh: '2d bo\'sh orbitali yo\'q.' },
    { nom: 'NaNO₃ + H₂SO₄(kons) → HNO₃↑', qisqa: 'Lab olish usuli', guruh: 'olish_xossa', izoh: 'Shisha retortada qizdirish.' },
    { nom: 'NH₃ → NO → NO₂ → HNO₃', qisqa: 'Sanoat (27-rasm)', guruh: 'olish_xossa', izoh: 'Pt/Cr₂O₃ va yuttirish minorasi.' },
    { nom: 'Kons → NO₂↑; Suyul → NO↑', qisqa: 'Cu + HNO₃ (H₂ yo\'q)', guruh: 'metallar', izoh: 'Oksidlovchi NO₃⁻ ishlaydi.' },
    { nom: 'Fe, Al, Cr sovuqda passiv', qisqa: 'Kons. HNO₃ da erimaydi', guruh: 'metallar', izoh: 'Al sisternada tashiladi.' },
    { nom: '1 HNO₃ : 3 HCl (Zar suvi)', qisqa: 'Au va Pt ni eritadi', guruh: 'metallar', izoh: 'AuCl₃ + NO↑ + 2H₂O.' },
    { nom: 'KNO₃→KNO₂+O₂; Cu(NO₃)₂→CuO', qisqa: 'Termik parchalanish', guruh: 'nitratlar', izoh: 'AgNO₃ esa erkin Ag beradi.' },
    { nom: 'Kons. H₂SO₄ + Cu → NO₂↑', qisqa: 'NO₃⁻ sifat reaksiyasi', guruh: 'nitratlar', izoh: 'Qo\'ng\'ir gaz chiqadi.' },
    { nom: 'O\'g\'it, KNO₃+S+C porox', qisqa: 'Amaliy ishlatilishi', guruh: 'nitratlar', izoh: '68% o\'g\'itga sarflanadi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Zar suvi',
    savol: '"Zar suvi" tarkibidagi HNO₃ va HCl hajm nisbati:',
    variantlar: ['1 : 1', '3 HNO₃ : 1 HCl', '1 HNO₃ : 3 HCl', '1 : 10'],
    togri: 2,
    izoh: '1 hajm kons. HNO₃ + 3 hajm kons. HCl.',
  },
  {
    belgi: 'Passivlashish',
    savol: 'Sovuq konsentrlangan HNO₃ da qaysi metallar passivlashadi?',
    variantlar: ['Fe, Al, Cr', 'Cu, Ag, Hg', 'Na, K, Ca', 'Zn, Mg, Pb'],
    togri: 0,
    izoh: 'Zich oksid parda hosil bo\'lib reaksiya to\'xtaydi.',
  },
  {
    belgi: 'Cu + kons',
    savol: 'Cu + 4HNO₃(kons.) → qaysi gaz chiqadi?',
    variantlar: ['H₂↑', 'N₂↑', 'NH₃↑', '2NO₂↑ (qo\'ng\'ir)'],
    togri: 3,
    izoh: 'Konsentrlangan kislotadan qo\'ng\'ir NO₂ chiqadi.',
  },
  {
    belgi: 'Nitrat (K)',
    savol: '2KNO₃ →(t°) qizdirilganda nima hosil bo\'ladi?',
    variantlar: ['K₂O + NO₂', '2KNO₂ + O₂↑', 'K₃N + O₂', 'K + NO₂ + O₂'],
    togri: 1,
    izoh: 'Faol metall nitratlari nitrit va kislorod beradi.',
  },
  {
    belgi: 'Sanoat',
    savol: 'NH₃ oksidlash (27-rasm) uchun katalizatorlar:',
    variantlar: ['V₂O₅', 'Pt yoki Cr₂O₃/MnO₂', 'FeO', 'CuSO₄'],
    togri: 1,
    izoh: '800°C da Pt yoki Cr₂O₃ + MnO₂ ishlatiladi.',
  },
  {
    belgi: 'Masala',
    savol: '3,2 g Cu suyultirilgan HNO₃ da eriganda n.sh.da necha litr NO chiqadi?',
    variantlar: ['2,24 l', '0,37 l', '4,48 l', '0,747 l'],
    togri: 3,
    izoh: '0,05 · 2/3 · 22,4 = 0,747 litr.',
  },
  {
    belgi: 'Formula',
    savol: '56,47% O, 16,47% N, 27,06% Na tutgan tuz va 340 g dan chiqqan O₂:',
    variantlar: ['NaNO₃ • 44,8 l', 'NaNO₂ • 11,2 l', 'KNO₃ • 22,4 l', 'Ca(NO₃)₂ • 67,2 l'],
    togri: 0,
    izoh: 'NaNO₃ (M=85) → 4 mol → 2 mol O₂ = 44,8 l.',
  },
  {
    belgi: 'Sifat testi',
    savol: 'Nitrat ioni NO₃⁻ qanday aniqlanadi?',
    variantlar: ['AgNO₃ → oq', 'BaCl₂ → oq', 'Kons. H₂SO₄ + Cu → qo\'ng\'ir NO₂↑', 'Lakmus → ko\'k'],
    togri: 2,
    izoh: 'Barcha nitratlar eriydi; Cu + kons. H₂SO₄ dan NO₂↑ chiqadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Sanoat: NH₃ → HNO₃ (27-rasm)',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. Kontakt: 4NH₃ + 5O₂ → 4NO + 6H₂O',
      '2. Sovitkichda oksidlash: 2NO + O₂ = 2NO₂',
      '3. Minora: 4NO₂ + 2H₂O + O₂ = 4HNO₃',
      '4. Tayyor 63% kislota olish',
    ],
    variantlar: [
      '3. Minora: 4NO₂ + 2H₂O + O₂ = 4HNO₃',
      '1. Kontakt: 4NH₃ + 5O₂ → 4NO + 6H₂O',
      '4. Tayyor 63% kislota olish',
      '2. Sovitkichda oksidlash: 2NO + O₂ = 2NO₂',
    ],
  },
  {
    tur: '2-misol: 5 t 60% HNO₃ → m(NH₃)',
    vazifa: 'Hisob qadamlarini tartiblang:',
    tartib: [
      '1. m(HNO₃) = 5 · 0,6 = 3 t',
      '2. Nazariy NH₃: 3 · 17 / 63 = 0,81 t',
      '3. Unum η = 100% − 2,8% = 97,2%',
      '4. Amaliy: 0,81 / 0,972 = 0,833 t NH₃',
    ],
    variantlar: [
      '2. Nazariy NH₃: 3 · 17 / 63 = 0,81 t',
      '4. Amaliy: 0,81 / 0,972 = 0,833 t NH₃',
      '1. m(HNO₃) = 5 · 0,6 = 3 t',
      '3. Unum η = 100% − 2,8% = 97,2%',
    ],
  },
  {
    tur: 'Masala: NaNO₃ va 44,8 l O₂',
    vazifa: 'Yechish tartibini tuzing:',
    tartib: [
      '1. Na:N:O = 1:1:3 → NaNO₃ (M=85)',
      '2. 2NaNO₃ →(t°) 2NaNO₂ + O₂↑',
      '3. n(NaNO₃) = 340/85 = 4 mol → 2 mol O₂',
      '4. V(O₂) = 2 · 22,4 = 44,8 litr',
    ],
    variantlar: [
      '3. n(NaNO₃) = 340/85 = 4 mol → 2 mol O₂',
      '4. V(O₂) = 2 · 22,4 = 44,8 litr',
      '1. Na:N:O = 1:1:3 → NaNO₃ (M=85)',
      '2. 2NaNO₃ →(t°) 2NaNO₂ + O₂↑',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Lab: NaNO₃ + H₂SO₄(kons) → ?',
    variantlar: ['NaNO₂ + SO₂', 'NaHSO₄ + HNO₃↑', 'NH₃ + O₂', 'NO₂ + H₂'],
    togri: 1,
    izoh: 'Shisha retortada uchuvchan HNO₃ haydaladi.',
  },
  {
    savol: '4Fe + 10HNO₃(juda suyul) azot mahsuloti:',
    variantlar: ['NO₂', 'NO', 'N₂O', 'NH₄NO₃'],
    togri: 3,
    izoh: 'Juda suyul. kislotada N⁺⁵ → NH₄⁺ gacha qaytadi.',
  },
  {
    savol: 'Au + HNO₃ + 3HCl = ?',
    variantlar: ['AuCl₃ + NO↑ + 2H₂O', 'AuO + N₂', 'Au(NO₃)₃ + H₂', 'AuCl + H₂'],
    togri: 0,
    izoh: 'Zar suvi oltinni AuCl₃ ga aylantiradi.',
  },
  {
    savol: '2Cu(NO₃)₂ →(t°) mahsulotlari:',
    variantlar: ['2Cu(NO₂)₂ + O₂', '2Cu + 4NO₂', '2CuO + 4NO₂↑ + O₂↑', '2CuO + 2N₂'],
    togri: 2,
    izoh: 'Mg–Cu nitratlari oksid + NO₂ + O₂ beradi.',
  },
  {
    savol: 'HNO₃ da azot valentligi va OD:',
    variantlar: ['III valent, OD = +3', 'V valent, OD = +5', 'IV valent, OD = +5', 'IV valent, OD = -3'],
    togri: 2,
    izoh: 'Donor-akseptor bog\'i hisobiga IV valentli, OD = +5.',
  },
  {
    savol: '28-rasm: Skipidarga kons. HNO₃ tomizilsa?',
    variantlar: ['Alangalanib yonadi', 'Muzlaydi', 'Cho\'kma tushadi', 'Rangsiz qoladi'],
    togri: 0,
    izoh: 'Kuchli oksidlovchi organik moddani yondiradi.',
  },
  {
    savol: 'Nitrat tuzlarning suvda eruvchanligi:',
    variantlar: ['Faqat KNO₃', 'Barchasi yaxshi eriydi', 'Erimaydi', 'Faqat issiqda'],
    togri: 1,
    izoh: 'Barcha nitratlar suvda eruvchan.',
  },
  {
    savol: '2AgNO₃ →(t°) qanday parchalanadi?',
    variantlar: ['2AgNO₂ + O₂', 'Ag₂O + 2NO₂', 'Ag₂O + N₂', '2Ag + 2NO₂↑ + O₂↑'],
    togri: 3,
    izoh: 'Passiv metall nitratlari erkin Ag + NO₂ + O₂ beradi.',
  },
];

export default function S8Mavzu39() {
  const korgazmalar = [
    { nom: '1. Tuzilish & 27-rasm', ikon: 'kolba', komponent: <KorgazmaHNO3Olinishi /> },
    { nom: '2. Metallar & Zar suvi', ikon: 'harorat', komponent: <KorgazmaHNO3Metallar /> },
    { nom: '3. Nitratlar & NO₃⁻ testi', ikon: 'kristall', komponent: <KorgazmaNitratlarParchalanish /> },
    { nom: '4. Kislota & Ishlatish', ikon: 'tomchi', komponent: <KorgazmaUmumiyQollanish /> },
    { nom: '5. 0,747 l NO & 0,833 t NH₃', ikon: 'formula', komponent: <Korgazma39MasalalarA /> },
    { nom: '6. NaNO₃ & 44,8 l O₂', ikon: 'qidiruv', komponent: <Korgazma39MasalalarB /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-39"
          nom="HNO₃ va nitratlarni guruhlang"
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
          key="tezkor-39"
          nom="39-§: Nitrat kislota"
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
          key="zanjir-39"
          nom="Ostvald & Masalalar zanjiri"
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
          key="duel-39"
          sarlavha="39-§: HNO₃ dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="39-§"
      mavzuNom="Nitrat kislota"
      oldingiRaqam="38-§"
      oldingiNom="Azotning kislorodli birikmalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
