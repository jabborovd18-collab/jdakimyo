'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 18-PARAGRAF
// "Elementlarning oksidlanish darajasi" (Darslik 76-79-betlar)
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
   1-KO'RGAZMA: OKSIDLANISH DARAJASI TA'RIFI VA YOZILISHI (76-77-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaOksidlanishTarif() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Oksidlanish darajasi tushunchasi va belgilanish qoidasi (76-77-bet)"
      ikon="formula"
      variantlar={[
        {
          id: 'farq',
          tugma: 'Ion zaryadi vs OD',
          formula: 'Ion: Al³⁺, S²⁻, SO₄²⁻  |  OD: Al⁺³, S⁻², Na⁺¹',
          tur: 'hisob',
          cfg: {
            sarlavha: '77-bet: Ion zaryadi va OD yozish farqi',
            tenglama: 'Ion: raqam OLDIN (Al³⁺)  |  OD: ishora OLDIN (Al⁺³)',
            qadamlar: [
              { belgi: 'Ion zaryadi', natija: 'Al³⁺, S²⁻', izoh: 'Raqam + ishora (SO₄²⁻)', rang: '#38bdf8' },
              { belgi: 'OD yozuvi', natija: 'Al⁺³, S⁻²', izoh: 'Ishora (+,-) + raqam', rang: '#fbbf24' },
              { belgi: 'Oddiy modda', natija: '0 (nol)', izoh: 'H₂⁰, O₂⁰, O₃⁰, Fe⁰', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Ion: Al³⁺, SO₄²⁻', foiz: 85, qiymat: 'Raqam oldin', rang: '#38bdf8' },
              { nom: 'OD: Al⁺³, S⁻²', foiz: 85, qiymat: 'Ishora oldin', rang: '#fbbf24' },
            ],
            javobBadge: '77-bet: Ion = raqam oldin • OD = ishora oldin',
          },
          pastki: [
            'Ion: SO₄²⁻ (2 oldin) • OD: S⁺⁶O₄⁻² (+,- oldin)',
            'Birikmada barcha OD lar yig\'indisi = 0',
            'Oddiy moddalarda doim 0 (O₂, O₃, S, Fe)',
          ],
        },
        {
          id: 'oddiy',
          tugma: 'Oddiy modda (0)',
          formula: 'H₂⁰, Cl₂⁰, N₂⁰, O₂⁰, O₃⁰, S⁰, Fe⁰, Na⁰',
          tur: 'molekula',
          cfg: {
            sarlavha: '77-bet: Oddiy moddada OD = 0 (nol)',
            tenglama: 'Cl : Cl — qutbsiz bog\', elektron siljimaydi → OD = 0',
            rejim: 'bog',
            bogJuft: { chap: 'Cl⁰', chapRang: '#38bdf8', ong: 'Cl⁰', ongRang: '#38bdf8', siljish: 0 },
            metrikalar: [
              { nom: 'ΔNEM (farq)', qiymat: '0 (teng)', foiz: 0, rang: '#38bdf8' },
              { nom: 'Juft siljishi', qiymat: 'Markazda', foiz: 50, rang: '#fde047' },
            ],
            belgilar: [
              { k: 'Gazlar', v: 'H₂⁰, Cl₂⁰, O₃⁰', rang: '#38bdf8' },
              { k: 'Metallar', v: 'Na⁰, Fe⁰, Al⁰', rang: '#fde047' },
              { k: 'Qattiq', v: 'S₈⁰, P₄⁰, C⁰', rang: '#34d399' },
            ],
          },
          pastki: [
            'Bir xil atomlar orasida elektron tortishish teng',
            'Ozon O₃ va oq fosfor P₄ da ham OD = 0',
            'Barcha oddiy metallarda ham OD = 0 bo\'ladi',
          ],
        },
        {
          id: 'musbat',
          tugma: 'Elektron berish (+)',
          formula: 'Na⁺¹, Mg⁺², Al⁺³, H⁺¹, C⁺⁴, P⁺⁵, S⁺⁶, Cl⁺⁷',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Metallar faqat elektron beradi → doim (+) OD',
            tenglama: 'Al⁰ - 3 ē → Al⁺³  (tashqi qavat elektronini berdi)',
            rejim: 'atom',
            qavatlar: [2, 8],
            markaz: { belgi: 'Al', zaryad: '+3', rang: '#f472b6' },
            metrikalar: [
              { nom: 'Berilgan ē', qiymat: '3 ta elektron', foiz: 75, rang: '#f472b6' },
              { nom: 'OD belgisi', qiymat: '+3 (Al⁺³)', foiz: 90, rang: '#fde047' },
            ],
            belgilar: [
              { k: 'IA guruh', v: 'Li⁺¹, Na⁺¹, K⁺¹', rang: '#f472b6' },
              { k: 'IIA guruh', v: 'Mg⁺², Ca⁺²', rang: '#fbbf24' },
              { k: 'IIIA guruh', v: 'Al⁺³', rang: '#38bdf8' },
            ],
          },
          pastki: [
            'Metallar birikmada faqat + oksidlanish darajali',
            'Olingan elektron bo\'lmagani uchun manfiy bo\'lmaydi',
            'Maksimal + daraja guruh raqamiga teng',
          ],
        },
        {
          id: 'manfiy',
          tugma: 'Elektron olish (-)',
          formula: 'F⁻¹, Cl⁻¹, O⁻², S⁻², N⁻³, P⁻³, C⁻⁴',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Metalmaslar elektron tortib (-) OD oladi',
            tenglama: 'S⁰ + 2 ē → S⁻²  (oktet 8 ē ga to\'ldi)',
            rejim: 'atom',
            qavatlar: [2, 8, 8],
            markaz: { belgi: 'S', zaryad: '-2', rang: '#34d399' },
            metrikalar: [
              { nom: 'Olgan ē', qiymat: '2 ta elektron', foiz: 65, rang: '#34d399' },
              { nom: 'OD belgisi', qiymat: '-2 (S⁻²)', foiz: 85, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'VIIA', v: 'F⁻¹, Cl⁻¹', rang: '#34d399' },
              { k: 'VIA', v: 'O⁻², S⁻²', rang: '#38bdf8' },
              { k: 'VA / IVA', v: 'N⁻³, C⁻⁴', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Metalmaslarda ham (-), ham (+) OD uchraydi',
            'Quyi OD = -(8 - guruh raqami)',
            'Ftor eng kuchli — faqat -1 namoyon qiladi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: ALGORITM — Al₂S₃ VA H₃PO₄ DA HISOBLASH (77-78-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaHisobAlgoritm() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Birikmalarda atomlarning oksidlanish darajasini topish (77-78, 86-87-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'H3PO4',
          tugma: 'H₃PO₄',
          formula: 'H₃⁺¹ P⁺⁵ O₄⁻²  →  3(+1) + 5 + 4(-2) = 0',
          tur: 'hisob',
          cfg: {
            sarlavha: '78-bet: H₃PO₄ da fosforning OD ni topish',
            tenglama: '3·(+1) + x + 4·(-2) = 0  →  3 + x - 8 = 0  →  x = +5',
            qadamlar: [
              { belgi: '1. Ma\'lum', natija: 'H=+1, O=-2', izoh: 'Vodorod +1, Kislorod -2', rang: '#38bdf8' },
              { belgi: '2. Tenglama', natija: '3+x-8 = 0', izoh: 'Yig\'indi doimo 0 ga teng', rang: '#fbbf24' },
              { belgi: '3. Javob', natija: 'P = +5', izoh: 'H₃⁺¹ P⁺⁵ O₄⁻²', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Musbat: 3(+1)+(+5)', foiz: 80, qiymat: '+8', rang: '#f472b6' },
              { nom: 'Manfiy: 4(-2)', foiz: 80, qiymat: '-8', rang: '#34d399' },
            ],
            javobBadge: 'Fosfat kislotada P = +5 (+8 - 8 = 0)',
          },
          pastki: [
            'H₃PO₄: 3(+1) + (+5) + 4(-2) = 0',
            'Neytral molekulada Σ(OD) hamisha 0',
            'NH₃ va CH₄ da N⁻³, C⁻⁴ oldin yoziladi',
          ],
        },
        {
          id: 'Al2S3',
          tugma: 'Al₂S₃',
          formula: 'Al₂⁺³ S₃⁻²  →  2(+3) + 3(-2) = +6 - 6 = 0',
          tur: 'hisob',
          cfg: {
            sarlavha: '77-78-bet: Al₂S₃ da Al va S ning OD si',
            tenglama: '2·(+3) + 3·(-2) = +6 - 6 = 0',
            qadamlar: [
              { belgi: '1. Tartib', natija: 'Al avval, S', izoh: 'Elektrmusbat oldin, -manfiy keyin', rang: '#38bdf8' },
              { belgi: '2. Alyuminiy', natija: 'Al = +3', izoh: '3 ta elektron beradi', rang: '#f472b6' },
              { belgi: '3. Oltingugurt', natija: 'S = -2', izoh: '2 ta ē oladi: 2(+3)+3(-2)=0', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Musbat: 2 · (+3)', foiz: 75, qiymat: '+6', rang: '#f472b6' },
              { nom: 'Manfiy: 3 · (-2)', foiz: 75, qiymat: '-6', rang: '#34d399' },
            ],
            javobBadge: 'Al₂⁺³S₃⁻²: +6 + (-6) = 0',
          },
          pastki: [
            'Al₂S₃: 2(+3) + 3(-2) = 0',
            'Metallar elektron berib (+) daraja oladi',
            'Metalmas elektron olib (-) daraja oladi',
          ],
        },
        {
          id: 'K2Cr2O7',
          tugma: 'K₂Cr₂O₇',
          formula: 'K₂⁺¹ Cr₂⁺⁶ O₇⁻²  →  2(+1) + 2(+6) + 7(-2) = 0',
          tur: 'hisob',
          cfg: {
            sarlavha: '87-bet: Kaliy dixromatda Cr ning OD si',
            tenglama: '2·(+1) + 2x + 7·(-2) = 0  →  2x = +12  →  x = +6',
            qadamlar: [
              { belgi: '1. Ma\'lum', natija: 'K=+1, O=-2', izoh: 'Kaliy doim +1, Kislorod -2', rang: '#38bdf8' },
              { belgi: '2. Tenglama', natija: '2+2x-14=0', izoh: '2x = +12 (ikki xrom bor)', rang: '#fbbf24' },
              { belgi: '3. Javob', natija: 'Cr = +6', izoh: 'K₂⁺¹ Cr₂⁺⁶ O₇⁻²', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Musbat: 2(+1)+2(+6)', foiz: 92, qiymat: '+14', rang: '#fbbf24' },
              { nom: 'Manfiy: 7(-2)', foiz: 92, qiymat: '-14', rang: '#34d399' },
            ],
            javobBadge: 'Dixromatda Cr = +6 (+14 - 14 = 0)',
          },
          pastki: [
            'K₂Cr₂O₇: 2(+1) + 2x - 14 = 0 → Cr = +6',
            'Indeks 2 ni tenglamada 2x deb hisoblash shart',
            '87-betdagi asosiy OQR oksidlovchisi',
          ],
        },
        {
          id: 'KMnO4',
          tugma: 'KMnO₄',
          formula: 'K⁺¹ Mn⁺⁷ O₄⁻²  →  +1 + (+7) + 4(-2) = 0',
          tur: 'hisob',
          cfg: {
            sarlavha: '86-bet: Kaliy permanganatda Mn ning OD si',
            tenglama: '+1 + x + 4·(-2) = 0  →  x = +8 - 1  →  x = +7',
            qadamlar: [
              { belgi: '1. Ma\'lum', natija: 'K=+1, O=-2', izoh: 'Kaliy +1, Kislorod -2', rang: '#38bdf8' },
              { belgi: '2. Tenglama', natija: '1+x-8 = 0', izoh: 'x = +8 - 1', rang: '#fbbf24' },
              { belgi: '3. Javob', natija: 'Mn = +7', izoh: 'VII guruh — maksimal daraja', rang: '#a855f7' },
            ],
            taqqosBars: [
              { nom: 'Musbat: +1 + (+7)', foiz: 80, qiymat: '+8', rang: '#a855f7' },
              { nom: 'Manfiy: 4(-2)', foiz: 80, qiymat: '-8', rang: '#34d399' },
            ],
            javobBadge: 'KMnO₄ da Marganes = +7',
          },
          pastki: [
            'KMnO₄: +1 + (+7) + 4(-2) = 0',
            'Marganes VIIB guruh elementi, maksimal +7',
            'KMnO₄ kuchli oksidlovchi sifatida ishlatiladi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: MAXSUS HOLATLAR VA ISTISNOLAR (F, O, H, H₂O₂, 78-79-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaIstisnolar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Ftor, Kislorod (H₂O₂, OF₂) va Vodorodning (NaH) holatlari (78-79-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'kislorod',
          tugma: 'Kislorod (-2, -1, +2)',
          formula: 'H₂O⁻²  |  H—O⁻¹—O⁻¹—H (H₂O₂)  |  O⁺²F₂⁻¹',
          tur: 'molekula',
          cfg: {
            sarlavha: '78-79-bet (14-rasm): H₂O₂ peroksidda O = -1!',
            tenglama: 'O—O bog\'i teng — elektron siljimaydi; O faqat H dan tortadi',
            markaz: { belgi: 'O⁻¹', rang: '#38bdf8', r: 23 },
            atomlar: [
              { belgi: 'O⁻¹', burchak: 0, masofa: 86, bog: 1, rang: '#38bdf8', r: 23 },
              { belgi: 'H⁺¹', burchak: 135, masofa: 74, bog: 1, rang: '#34d399', r: 15 },
              { belgi: 'H⁺¹', burchak: 225, masofa: 74, bog: 1, rang: '#34d399', r: 15 },
            ],
            metrikalar: [
              { nom: 'Odatda (H₂O, CO₂)', qiymat: 'O = -2', foiz: 85, rang: '#38bdf8' },
              { nom: 'Peroksid (H₂O₂)', qiymat: 'O = -1', foiz: 50, rang: '#fbbf24' },
              { nom: 'Ftor bilan (OF₂)', qiymat: 'O = +2', foiz: 85, rang: '#a855f7' },
            ],
            belgilar: [
              { k: 'Odatda', v: 'O⁻² (H₂O)', rang: '#38bdf8' },
              { k: 'Peroksid', v: 'O⁻¹ (H₂O₂)', rang: '#fbbf24' },
              { k: 'OF₂', v: 'O⁺²', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Peroksid H₂O₂: O = -1; OF₂ da O = +2',
            'O—O o\'zaro bog\'i OD ga ta\'sir qilmaydi',
            '14-rasm: Vodorod peroksid H⁺¹—O⁻¹—O⁻¹—H⁺¹',
          ],
        },
        {
          id: 'ftor',
          tugma: 'Ftor (faqat -1)',
          formula: 'Li⁺¹F⁻¹,  O⁺²F₂⁻¹,  Cl⁺³F₃⁻¹',
          tur: 'molekula',
          cfg: {
            sarlavha: '78-bet: Ftor (NEM=4,0) barcha birikmada faqat -1',
            tenglama: 'Ftor hatto kisloroddan (OF₂) ham elektron tortib oladi!',
            rejim: 'bog',
            bogJuft: { chap: 'O⁺²', chapRang: '#fbbf24', ong: 'F⁻¹', ongRang: '#a855f7', siljish: 0.78 },
            metrikalar: [
              { nom: 'Ftor NEM', qiymat: '4,0 (maksimal)', foiz: 100, rang: '#a855f7' },
              { nom: 'Ftor OD', qiymat: 'Doimo -1', foiz: 95, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'LiF', v: 'Li⁺¹F⁻¹', rang: '#38bdf8' },
              { k: 'OF₂', v: 'O⁺²F₂⁻¹', rang: '#fbbf24' },
              { k: 'ClF₃', v: 'Cl⁺³F₃⁻¹', rang: '#a855f7' },
            ],
          },
          pastki: [
            'Ftor barcha birikmalarida faqat -1',
            'Eng kuchli elektrmanfiy element (NEM = 4,0)',
            'Hech kimga elektron bermaydi → (+) OD si yo\'q',
          ],
        },
        {
          id: 'vodorod',
          tugma: 'Vodorod (+1 va -1)',
          formula: 'H⁺¹Cl⁻¹, N⁻³H₃⁺¹  |  Na⁺¹H⁻¹, Ca⁺²H₂⁻¹',
          tur: 'molekula',
          cfg: {
            sarlavha: '78-bet: Vodorod metalmas bilan +1, metall bilan -1',
            tenglama: 'Na (0,93) < H (2,20) → NaH da elektron H ga siljiydi (H⁻¹)',
            rejim: 'bog',
            bogJuft: { chap: 'Na⁺¹', chapRang: '#f472b6', ong: 'H⁻¹', ongRang: '#34d399', siljish: 0.72 },
            metrikalar: [
              { nom: 'Metalmas bilan', qiymat: 'H = +1 (HCl, H₂O)', foiz: 85, rang: '#38bdf8' },
              { nom: 'Metall gidridda', qiymat: 'H = -1 (NaH, CaH₂)', foiz: 85, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'H₂O, NH₃', v: 'H = +1', rang: '#38bdf8' },
              { k: 'NaH, CaH₂', v: 'H = -1', rang: '#34d399' },
              { k: 'H₂⁰', v: 'H = 0', rang: '#fde047' },
            ],
          },
          pastki: [
            'Gidridlarda (NaH, CaH₂): H = -1',
            'HCl, H₂S, NH₃, H₂O da H = +1',
            'Oddiy modda H₂ da H = 0',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: YUQORI VA QUYI OKSIDLANISH DARAJASI (79-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaYuqoriQuyiOD() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Yuqori va quyi oksidlanish darajalari (79-bet)"
      ikon="nurlar"
      variantlar={[
        {
          id: 'yuqori',
          tugma: 'Yuqori OD (+1..+7)',
          formula: 'Yuqori OD = +Guruh raqami (Na⁺¹, Al⁺³, Si⁺⁴, P⁺⁵, S⁺⁶, Cl⁺⁷, Mn⁺⁷)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '79-bet: Yuqori OD = +guruh raqami',
            tenglama: 'Na(+1) < Mg(+2) < Al(+3) < Si(+4) < P(+5) < S(+6) < Cl, Mn(+7)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Na (IA)', qiymat: 14, yorliq: '+1', rang: '#38bdf8' },
              { nom: 'Al (IIIA)', qiymat: 42, yorliq: '+3', rang: '#34d399' },
              { nom: 'P (VA)', qiymat: 71, yorliq: '+5', rang: '#fbbf24' },
              { nom: 'S (VIA)', qiymat: 85, yorliq: '+6', rang: '#f97316' },
              { nom: 'Cl, Mn (VII)', qiymat: 100, yorliq: '+7', rang: '#f472b6' },
            ],
          },
          pastki: [
            'Marganes (+25 Mn: 2,8,13,2) → VIIB = +7',
            'Oltingugurt (VI): yuqorisi +6, quyisi -2',
            'Xlor (VII): +7 dan -1 gacha o\'zgaradi',
          ],
        },
        {
          id: 'quyi',
          tugma: 'Quyi OD (metalmaslar)',
          formula: 'Quyi OD = -(8 - valent ē)  •  Metallar quyi (manfiy) OD olmaydi',
          tur: 'hisob',
          cfg: {
            sarlavha: '79-bet: Metalmaslarning quyi OD formulasi',
            tenglama: 'Quyi OD = -(8 - guruh raqami): C(-4), N(-3), S(-2), Cl(-1)',
            qadamlar: [
              { belgi: 'IVA (Si, C)', natija: '-4 = -(8-4)', izoh: 'SiH₄, CH₄ da -4', rang: '#38bdf8' },
              { belgi: 'VA (N, P)', natija: '-3 = -(8-5)', izoh: 'NH₃, PH₃ da -3', rang: '#a855f7' },
              { belgi: 'VIA (O, S)', natija: '-2 = -(8-6)', izoh: 'H₂O, H₂S da -2', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'VIIA (HCl)', foiz: 25, qiymat: '-1', rang: '#fbbf24' },
              { nom: 'VIA (H₂S)', foiz: 50, qiymat: '-2', rang: '#34d399' },
              { nom: 'VA (PH₃)', foiz: 75, qiymat: '-3', rang: '#a855f7' },
              { nom: 'IVA (SiH₄)', foiz: 100, qiymat: '-4', rang: '#38bdf8' },
            ],
            javobBadge: 'Metallarda manfiy OD yo\'q (faqat 0 va +)',
          },
          pastki: [
            'S (VIA): yuqori +6 (SO₃), quyi -2 (H₂S)',
            'P (VA): yuqori +5 (P₂O₅), quyi -3 (PH₃)',
            'Na (IA), Al (IIIA) da quyi (-) OD bo\'lmaydi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: 79-BET 3- VA 4-TOPSHIRIQLAR (BeCl₂..XeO₄ VA PIRIT FeS₂)
═══════════════════════════════════════════════════════════════ */
function KorgazmaMashq79Bet() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 79-bet 3–4-topshiriqlar: Pirit (FeS₂), ClF₃, XeO₄ va HMnO₄"
      ikon="yadro"
      variantlar={[
        {
          id: 'FeS2',
          tugma: 'FeS₂ (Pirit)',
          formula: 'Fe⁺² va S⁻¹  (disulfid ko\'prigi S⁻¹—S⁻¹)',
          tur: 'molekula',
          cfg: {
            sarlavha: '79-bet 4-savol: Pirit (FeS₂) da temir +2, oltingugurt -1!',
            tenglama: 'Ikki S atomi o\'zaro bog\'da (S—S)²⁻ → har bir S = -1!',
            markaz: { belgi: 'Fe⁺²', rang: '#f472b6', r: 25 },
            atomlar: [
              { belgi: 'S⁻¹', burchak: -35, masofa: 86, bog: 1, rang: '#fbbf24', r: 19 },
              { belgi: 'S⁻¹', burchak: 35, masofa: 86, bog: 1, rang: '#fbbf24', r: 19 },
            ],
            metrikalar: [
              { nom: 'Temir (Fe)', qiymat: '+2', foiz: 65, rang: '#f472b6' },
              { nom: 'Har bir S', qiymat: '-1 (S₂²⁻)', foiz: 50, rang: '#fbbf24' },
            ],
            belgilar: [
              { k: 'Fe', v: '+2', rang: '#f472b6' },
              { k: '2 ta S', v: '2 · (-1) = -2', rang: '#fbbf24' },
              { k: 'Yig\'indi', v: '+2 + 2(-1) = 0', rang: '#34d399' },
            ],
          },
          pastki: [
            'Pirit (FeS₂): Fe⁺², S = -1 (disulfid)',
            'ClF₃ da Xlor = +3 (F = -1)',
            'XeO₄ da Xe = +8, HMnO₄ da Mn = +7',
          ],
        },
        {
          id: 'ClF3',
          tugma: 'ClF₃',
          formula: 'Cl⁺³ F₃⁻¹  →  x + 3(-1) = 0  →  Cl = +3',
          tur: 'hisob',
          cfg: {
            sarlavha: '79-bet 3-topshiriq: ClF₃ da xlorning OD si',
            tenglama: 'Ftor (4,0) doim -1 → x + 3(-1) = 0 → Cl = +3',
            qadamlar: [
              { belgi: '1. Ftor', natija: 'F = -1', izoh: '3 ta Ftor = -3', rang: '#a855f7' },
              { belgi: '2. Tenglama', natija: 'x + 3(-1)=0', izoh: 'x - 3 = 0', rang: '#fbbf24' },
              { belgi: '3. Javob', natija: 'Cl = +3', izoh: 'Cl⁺³ F₃⁻¹', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'Xlor (+3)', foiz: 75, qiymat: '+3', rang: '#38bdf8' },
              { nom: '3 ta Ftor', foiz: 75, qiymat: '-3', rang: '#a855f7' },
            ],
            javobBadge: 'Ftor doim -1 → ClF₃ da Cl = +3',
          },
          pastki: [
            'Ftor eng kuchli — Cl dan ham elektron oladi',
            'ClF₃ da Xlor = +3, Ftor = -1',
            '79-bet 3-topshiriq javobi',
          ],
        },
        {
          id: 'XeO4',
          tugma: 'XeO₄',
          formula: 'Xe⁺⁸ O₄⁻²  →  x + 4(-2) = 0  →  Xe = +8',
          tur: 'hisob',
          cfg: {
            sarlavha: '79-bet 3-topshiriq: XeO₄ da ksenonning OD si',
            tenglama: 'x + 4(-2) = 0  →  x - 8 = 0  →  Xe = +8',
            qadamlar: [
              { belgi: '1. Kislorod', natija: '4 · (-2) = -8', izoh: 'Kislorod -2 darajada', rang: '#38bdf8' },
              { belgi: '2. Ksenon', natija: 'Xe = +8', izoh: 'VIII guruh oliy darajasi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Xe (+8)', foiz: 95, qiymat: '+8', rang: '#34d399' },
              { nom: '4 ta O (-8)', foiz: 95, qiymat: '-8', rang: '#38bdf8' },
            ],
            javobBadge: 'XeO₄ da Xe = +8',
          },
          pastki: [
            'Ksenon VIII guruhda maksimal +8 ko\'rsatadi',
            'Xe⁺⁸ + 4O⁻²: +8 - 8 = 0',
            '79-bet 3-topshiriq misoli',
          ],
        },
        {
          id: 'HMnO4',
          tugma: 'HMnO₄, BeCl₂, SiO₂',
          formula: 'Be⁺²Cl₂⁻¹,  Si⁺⁴O₂⁻²,  H⁺¹Mn⁺⁷O₄⁻²',
          tur: 'hisob',
          cfg: {
            sarlavha: '79-bet 3-topshiriq: BeCl₂, SiO₂, HMnO₄ hisoblari',
            tenglama: 'Be = +2, Cl = -1  |  Si = +4, O = -2  |  H = +1, Mn = +7',
            qadamlar: [
              { belgi: 'BeCl₂', natija: 'Be=+2, Cl=-1', izoh: '+2 + 2(-1) = 0', rang: '#38bdf8' },
              { belgi: 'SiO₂', natija: 'Si=+4, O=-2', izoh: '+4 + 2(-2) = 0', rang: '#34d399' },
              { belgi: 'HMnO₄', natija: 'Mn = +7', izoh: '+1 + 7 + 4(-2) = 0', rang: '#a855f7' },
            ],
            taqqosBars: [
              { nom: 'Be (BeCl₂)', foiz: 28, qiymat: '+2', rang: '#38bdf8' },
              { nom: 'Si (SiO₂)', foiz: 57, qiymat: '+4', rang: '#34d399' },
              { nom: 'Mn (HMnO₄)', foiz: 100, qiymat: '+7', rang: '#a855f7' },
            ],
            javobBadge: 'Be⁺², Si⁺⁴, Mn⁺⁷',
          },
          pastki: [
            'Berilliy +2, Kremniy +4, Marganes +7',
            'Har bir birikmada Σ(OD) = 0 saqlanadi',
            'HMnO₄ permanganat kislota formulasi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: 88-BET MUSTAQIL MASHQLAR — XROM BIRIKMALARI
═══════════════════════════════════════════════════════════════ */
function KorgazmaMustaqil88() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 88-bet mustaqil mashqlar: CrO, Cr₂O₃, CrO₃, K₂Cr₂O₇ va b."
      ikon="kolba"
      variantlar={[
        {
          id: 'K2Cr2O7',
          tugma: 'Xrom qatori (+2..+6)',
          formula: 'CrO (+2) → Cr₂O₃ (+3) → CrO₃ (+6) → K₂Cr₂O₇ (+6)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '88-bet 2-mashq: Xromning o\'zgaruvchan OD lari',
            tenglama: 'CrO (+2 asosli) → Cr₂O₃ (+3 amfoter) → CrO₃, K₂Cr₂O₇ (+6 kislotali)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'CrO', qiymat: 33, yorliq: 'Cr = +2', rang: '#38bdf8' },
              { nom: 'Cr₂O₃', qiymat: 50, yorliq: 'Cr = +3', rang: '#34d399' },
              { nom: 'CrO₃', qiymat: 100, yorliq: 'Cr = +6', rang: '#fbbf24' },
              { nom: 'K₂Cr₂O₇', qiymat: 100, yorliq: 'Cr = +6', rang: '#f472b6' },
            ],
          },
          pastki: [
            'CrO (+2), Cr₂O₃ (+3), CrO₃ (+6), K₂Cr₂O₇ (+6)',
            'OD ortgan sari oksid asoslidan kislotaliga o\'tadi',
            'K₂Cr₂O₇: 2(+1) + 2(+6) + 7(-2) = 0',
          ],
        },
        {
          id: 'mashq1',
          tugma: '88-bet 1-mashq',
          formula: 'Li⁺¹F⁻¹,  N⁻³H₃⁺¹,  O₂⁰,  P₂⁺⁵O₅⁻²,  Mg⁺²I₂⁻¹,  P₄⁰',
          tur: 'hisob',
          cfg: {
            sarlavha: '88-bet 1-mashq: Har bir birikmada OD ni aniqlash',
            tenglama: 'O₂⁰ va P₄⁰ = 0  |  Li⁺¹F⁻¹, N⁻³H₃⁺¹, P₂⁺⁵O₅⁻², Mg⁺²I₂⁻¹',
            qadamlar: [
              { belgi: 'LiF, MgI₂', natija: 'Li⁺¹, F⁻¹, Mg⁺², I⁻¹', izoh: 'Metall +, metalmas -', rang: '#38bdf8' },
              { belgi: 'NH₃, P₂O₅', natija: 'N = -3, P = +5', izoh: 'H=+1, O=-2 bo\'yicha', rang: '#34d399' },
              { belgi: 'O₂, P₄', natija: 'OD = 0', izoh: 'Oddiy moddalarda nol', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'O₂⁰, P₄⁰', foiz: 10, qiymat: '0', rang: '#94a3b8' },
              { nom: 'Li⁺¹, H⁺¹', foiz: 35, qiymat: '+1', rang: '#38bdf8' },
              { nom: 'P₂O₅ da P', foiz: 88, qiymat: '+5', rang: '#fbbf24' },
            ],
            javobBadge: 'Oddiy modda O₂ va P₄ da doim 0!',
          },
          pastki: [
            'O₂⁰ va P₄⁰ oddiy modda → OD = 0',
            'NH₃ da N = -3 (N⁻³H₃⁺¹)',
            'P₂O₅ da P = +5 (2(+5) + 5(-2) = 0)',
          ],
        },
        {
          id: 'mashq3',
          tugma: '88-bet 3-mashq (H)',
          formula: 'H₂⁺¹S⁻²,  H₂⁺¹O₂⁻¹,  Na⁺¹H⁻¹,  Ca⁺²H₂⁻¹',
          tur: 'hisob',
          cfg: {
            sarlavha: '88-bet 3-mashq: Vodorodning +1 va -1 holatlari',
            tenglama: 'H₂S, H₂O, PH₃, H₂O₂ da H = +1  |  NaH, CaH₂ da H = -1',
            qadamlar: [
              { belgi: 'H₂S, PH₃', natija: 'H = +1', izoh: 'Metalmaslar H dan kuchliroq', rang: '#38bdf8' },
              { belgi: 'H₂O₂', natija: 'H=+1, O=-1', izoh: 'Peroksid: 2(+1)+2(-1)=0', rang: '#fbbf24' },
              { belgi: 'NaH, CaH₂', natija: 'H = -1', izoh: 'Gidridda H elektron oladi', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'H₂S, H₂O, PH₃', foiz: 80, qiymat: 'H = +1', rang: '#38bdf8' },
              { nom: 'NaH, CaH₂', foiz: 80, qiymat: 'H = -1', rang: '#f472b6' },
            ],
            javobBadge: 'NaH va CaH₂ da vodorod -1!',
          },
          pastki: [
            'H₂S, H₂O, PH₃, H₂O₂ da H = +1',
            'NaH va CaH₂ (gidridlar) da H = -1',
            'H₂O₂ da H=+1, O=-1',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (17-§) VA O'YINLAR (18-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'Osh tuzi (NaCl) panjara tugunlarida qanday zarralar turadi?',
    variantlar: [
      { matn: 'Neytral molekulalar', togri: false },
      { matn: 'Kovalent uglerod atomlari', togri: false },
      { matn: 'Na⁺ va Cl⁻ ionlari (6 tadan qo\'shni)', togri: true },
      { matn: 'Faqat erkin elektronlar', togri: false },
    ],
    izoh: '17-§ (74-bet): NaCl ionli kristall panjara tuzadi.',
  },
  {
    id: 't2',
    savol: 'Qaysi moddalar ATOMLI kristall panjaraga ega (74-75-bet)?',
    variantlar: [
      { matn: 'Olmos, grafit, kremniy (Si), bor (B)', togri: true },
      { matn: 'Muz, yod, quruq muz, shakar', togri: false },
      { matn: 'Osh tuzi va kaliy nitrat', togri: false },
      { matn: 'Natriy, mis va rux', togri: false },
    ],
    izoh: 'Atomli panjara tugunlarida atomlar kovalent bog\'langan.',
  },
  {
    id: 't3',
    savol: 'Yod (I₂) va quruq muz (CO₂) nega oson sublimatsiyalanadi?',
    variantlar: [
      { matn: 'Ionli panjara bo\'lgani uchun', togri: false },
      { matn: 'Atomli panjara bo\'lgani uchun', togri: false },
      { matn: 'Amorf bo\'lgani uchun', togri: false },
      { matn: 'Molekulalararo tortishish kuchsiz bo\'lgani uchun', togri: true },
    ],
    izoh: '75-bet: Molekular panjarali moddalar uchuvchan va past T_suyuq.',
  },
  {
    id: 't4',
    savol: 'Shisha, mum va smola nima uchun amorf modda deyiladi?',
    variantlar: [
      { matn: 'Tugunlarida ionlar turgani uchun', togri: false },
      { matn: 'Zarralari tartibsiz va aniq T_suyuq yo\'qligi uchun', togri: true },
      { matn: 'Elektr tokini yaxshi o\'tkazgani uchun', togri: false },
      { matn: 'Sublimatsiyalanganligi uchun', togri: false },
    ],
    izoh: '74-bet: Amorf moddalar qizdirilganda asta yumshaydi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'nol', nom: 'OD = 0 (Oddiy)', tavsif: 'O₂, N₂, O₃, P₄, Fe' },
    { id: 'musbat', nom: 'Musbat OD (+1..+8)', tavsif: 'H₃PO₄, KMnO₄, OF₂, XeO₄' },
    { id: 'manfiy', nom: 'Manfiy OD (-1..-4)', tavsif: 'F⁻¹, H₂O₂, NaH, NH₃, H₂S' },
  ],
  topshiriqlar: [
    { nom: 'O₂, O₃, Cl₂, N₂', qisqa: 'Qutbsiz gazlar', guruh: 'nol', izoh: '77-78-bet: Oddiy moddalarda OD = 0.' },
    { nom: 'P₄, S₈, C, Fe, Na', qisqa: 'Oddiy qattiq modda', guruh: 'nol', izoh: 'Bir xil atomli oddiy moddalarda 0.' },
    { nom: 'H₃PO₄ da Fosfor (P⁺⁵)', qisqa: '3(+1)+x+4(-2)=0', guruh: 'musbat', izoh: '78-bet: Fosfat kislotada P = +5.' },
    { nom: 'KMnO₄ da Mn⁺⁷ va OF₂ da O⁺²', qisqa: 'Yuqori musbat OD', guruh: 'musbat', izoh: 'OF₂ da O = +2; KMnO₄ da Mn = +7.' },
    { nom: 'K₂Cr₂O₇ da Xrom (Cr⁺⁶)', qisqa: '2(+1)+2x+7(-2)=0', guruh: 'musbat', izoh: '87-bet: Dixromatda Cr = +6.' },
    { nom: 'H₂O₂ da Kislorod (O⁻¹)', qisqa: 'Peroksid ko\'prigi', guruh: 'manfiy', izoh: '79-bet 14-rasm: Peroksidda O = -1.' },
    { nom: 'NaH va CaH₂ da H⁻¹', qisqa: 'Metall gidridlari', guruh: 'manfiy', izoh: '78-bet: Gidridlarda H = -1.' },
    { nom: 'LiF da F⁻¹ va NH₃ da N⁻³', qisqa: 'F doim -1', guruh: 'manfiy', izoh: 'Ftor doim -1, ammiakda azot -3.' },
    { nom: 'FeS₂ (pirit) da S⁻¹', qisqa: 'Disulfid anioni', guruh: 'manfiy', izoh: '79-bet 4-savol: Fe⁺², S = -1.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Fosfat kislota',
    savol: 'H₃PO₄ da fosforning oksidlanish darajasi nechaga teng (78-bet)?',
    variantlar: ['+3', '-3', '+5 (3(+1)+x+4(-2)=0)', '+1'],
    togri: 2,
    izoh: '78-bet: 3 + x - 8 = 0 → x = +5.',
  },
  {
    belgi: 'Peroksid (14-rasm)',
    savol: 'Vodorod peroksidda (H₂O₂) kislorodning OD si nechaga teng?',
    variantlar: ['-1 (H⁺¹—O⁻¹—O⁻¹—H⁺¹)', '-2', '+1', '0'],
    togri: 0,
    izoh: '78-79-bet: Peroksidda kislorod OD si -1.',
  },
  {
    belgi: 'Gidridlar (88-bet)',
    savol: 'Qaysi birikmada vodorod MANFIY (-1) oksidlanish darajali?',
    variantlar: ['H₂S', 'H₂O₂', 'NH₃', 'NaH va CaH₂ (metall gidridi)'],
    togri: 3,
    izoh: '78-bet: Vodorod metall gidridlarida -1 bo\'ladi.',
  },
  {
    belgi: 'Ftor qoidasi',
    savol: 'OF₂ da Ftor va Kislorodning oksidlanish darajalari qanday?',
    variantlar: ['O = -2, F = +1', 'F = -1 (doim), O = +2', 'O = -1, F = +1', 'O = 0, F = 0'],
    togri: 1,
    izoh: '78-bet: Ftor faqat -1; kislorod OF₂ da +2 bo\'ladi.',
  },
  {
    belgi: '77-bet izoh',
    savol: 'Ion zaryadi va OD qaysi javobda to\'g\'ri yozilgan?',
    variantlar: ['Ion: Al⁺³; OD: Al³⁺', 'Ion: Al³⁺, SO₄²⁻; OD: Al⁺³, S⁻²', 'Ikkisida ham + oldin', 'Ikkisida ham raqam oldin'],
    togri: 1,
    izoh: '77-bet: Ion — raqam oldin (Al³⁺), OD — ishora oldin (Al⁺³).',
  },
  {
    belgi: 'Pirit (FeS₂)',
    savol: '79-bet 4-savol: Pirit (FeS₂) da temir va oltingugurt OD si qanday?',
    variantlar: ['Fe⁺⁴ va S⁻²', 'Fe⁺³ va S⁻²', 'Fe⁰ va S⁰', 'Fe⁺² va S⁻¹'],
    togri: 3,
    izoh: 'Piritda temir +2, disulfid (S₂)²⁻ da har bir S = -1.',
  },
  {
    belgi: '87-bet K₂Cr₂O₇',
    savol: 'K₂Cr₂O₇ va KMnO₄ da Cr va Mn ning OD lari nechaga teng?',
    variantlar: ['Cr = +6, Mn = +7', 'Cr = +3, Mn = +4', 'Cr = +2, Mn = +6', 'Cr = +7, Mn = +6'],
    togri: 0,
    izoh: '86-87-bet: KMnO₄ da Mn = +7; K₂Cr₂O₇ da Cr = +6.',
  },
  {
    belgi: 'Oddiy modda',
    savol: 'Ozon (O₃), oq fosfor (P₄) va temir (Fe) da atomlar OD si qanday?',
    variantlar: ['O₃ da -2', 'P₄ da +5', 'Barchasida 0 (nol)', 'Fe da +3'],
    togri: 2,
    izoh: '78-bet: Oddiy moddalarda oksidlanish darajasi 0 ga teng.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'H₃PO₄ hisobi',
    vazifa: 'H₃PO₄ dagi P ning OD ni topish bosqichlarini tartiblang:',
    tartib: ['Kislorod -2, vodorod +1 deb olamiz', '3(+1) + x + 4(-2) = 0 tuzamiz', '3 + x - 8 = 0 → x = +8 - 3', 'Fosfor OD = +5 (H₃⁺¹P⁺⁵O₄⁻²)'],
    variantlar: ['3 + x - 8 = 0 → x = +8 - 3', 'Kislorod -2, vodorod +1 deb olamiz', 'Fosfor OD = +5 (H₃⁺¹P⁺⁵O₄⁻²)', '3(+1) + x + 4(-2) = 0 tuzamiz'],
  },
  {
    tur: 'Xlor OD o\'sishi',
    vazifa: 'Xlor birikmalarini OD ortishi tartibida joylang:',
    tartib: ['HCl (Cl = -1)', 'Cl₂ (Cl = 0)', 'KClO (+1) → ClF₃ (+3)', 'KClO₃ (+5) → HClO₄ (+7)'],
    variantlar: ['KClO (+1) → ClF₃ (+3)', 'HCl (Cl = -1)', 'KClO₃ (+5) → HClO₄ (+7)', 'Cl₂ (Cl = 0)'],
  },
  {
    tur: 'Kislorod holatlari',
    vazifa: 'Kislorodli moddalarni O ning OD si -2 dan +2 ga o\'sishida joylang:',
    tartib: ['H₂O (O = -2)', 'H₂O₂ (O = -1)', 'O₂ va O₃ (O = 0)', 'OF₂ (O = +2)'],
    variantlar: ['O₂ va O₃ (O = 0)', 'H₂O (O = -2)', 'OF₂ (O = +2)', 'H₂O₂ (O = -1)'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '79-bet 3-topshiriq: ClF₃ va XeO₄ da Cl va Xe ning OD lari qanday?',
    variantlar: ['Cl = -1, Xe = 0', 'Cl = +3, Xe = +8', 'Cl = +1, Xe = +4', 'Cl = +7, Xe = +2'],
    togri: 1,
    izoh: 'Cl + 3(-1) = 0 → Cl⁺³; Xe + 4(-2) = 0 → Xe⁺⁸.',
  },
  {
    savol: 'Oltingugurt (VI guruh) ning yuqori va quyi OD lari qaysilar?',
    variantlar: ['+4 va -4', '+7 va -1', '+2 va -6', '+6 va -2 (-(8-6))'],
    togri: 3,
    izoh: '79-bet: S uchun yuqori +6 (SO₃), quyi -2 (H₂S).',
  },
  {
    savol: '88-bet 2-mashq: CrO, Cr₂O₃, CrO₃ da Cr ning OD lari qanday?',
    variantlar: ['+2, +3, +6', '+1, +2, +3', '+6, +3, +2', '+3, +4, +7'],
    togri: 0,
    izoh: 'CrO (+2), Cr₂O₃ (+3), CrO₃ (+6).',
  },
  {
    savol: 'Al₂S₃ molekulasida Al va S OD lari va yig\'indisi qanday?',
    variantlar: ['Al⁺², S⁻³', 'Al⁻³, S⁺²', 'Al⁺³, S⁻²; 2(+3)+3(-2)=0', 'Al⁺¹, S⁻²'],
    togri: 2,
    izoh: '78-bet: Al₂⁺³S₃⁻², yig\'indisi 0.',
  },
  {
    savol: 'Qaysi qatordagi BARCHA element birikmada faqat (+) OD oladi?',
    variantlar: ['C, N, O, F', 'H, S, P, Cl', 'Na, Mg, Al, Ca, K (metallar)', 'O, F, Br, I'],
    togri: 2,
    izoh: '78-bet: Barcha metallar elektron beradi → faqat + OD.',
  },
  {
    savol: 'H₂O₂, NaH va H₂O haqida qaysi fikr to\'g\'ri?',
    variantlar: ['H₂O₂ da O=-1; NaH da H=-1; H₂O da O=-2', 'H₂O₂ da O = -2', 'NaH da H = +1', 'H₂O da O = -1'],
    togri: 0,
    izoh: '78-79-bet: Peroksidda O=-1, gidridda H=-1.',
  },
  {
    savol: 'Qaysi birikmada fosforning OD si +5 ga teng (88-bet)?',
    variantlar: ['PH₃ (-3)', 'P₂O₅ va H₃PO₄ (+5)', 'P₄ (0)', 'PCl₃ (+3)'],
    togri: 1,
    izoh: 'P₂O₅ da 2x + 5(-2) = 0 → x = +5.',
  },
  {
    savol: 'Birikmadagi barcha atomlar OD lari yig\'indisi nimaga teng?',
    variantlar: ['+1 ga', '-1 ga', 'Guruh raqamiga', 'Hamisha 0 (nol) ga teng'],
    togri: 3,
    izoh: '78-bet: Neytral molekulada Σ(OD) = 0.',
  },
];

export default function S8Mavzu18() {
  const korgazmalar = [
    { nom: '1. Ta\'rif va yozish (Ion vs OD)', ikon: 'formula', komponent: <KorgazmaOksidlanishTarif /> },
    { nom: '2. Al₂S₃, H₃PO₄, KMnO₄ hisobi', ikon: 'grafik', komponent: <KorgazmaHisobAlgoritm /> },
    { nom: '3. F, O (H₂O₂), H istisnolari', ikon: 'uchqun', komponent: <KorgazmaIstisnolar /> },
    { nom: '4. Yuqori va quyi darajalar', ikon: 'nurlar', komponent: <KorgazmaYuqoriQuyiOD /> },
    { nom: '5. 79-bet (FeS₂, ClF₃, XeO₄)', ikon: 'yadro', komponent: <KorgazmaMashq79Bet /> },
    { nom: '6. 88-bet mashqlar (Cr va b.)', ikon: 'kolba', komponent: <KorgazmaMustaqil88 /> },
  ];

  const oyinlar = [
    {
      nom: '1. 0, (+) va (-) OD ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-18"
          nom="Moddalardagi elementlarning oksidlanish darajasiga ko'ra guruhlash"
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
          key="tezkor-18"
          nom="18-§: Oksidlanish darajasi viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Hisob zanjirlari',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-18"
          nom="Oksidlanish darajasini aniqlash va o'sish zanjirlari"
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
          key="duel-18"
          sarlavha="18-§: Oksidlanish darajasi dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="18-§"
      mavzuNom="Elementlarning oksidlanish darajasi"
      oldingiRaqam="17-§"
      oldingiNom="Kristall panjaralar"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
