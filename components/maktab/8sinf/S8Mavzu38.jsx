'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 38-PARAGRAF
// "Azotning kislorodli birikmalari" (Darslik 164-165-betlar)
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
function KorgazmaAzotOksidlari() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Azotning 6 ta oksidi (+1..+5, 164-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'befarq',
          tugma: 'Befarq: N₂O (+1), NO (+2)',
          formula: 'N₂O (+1) va NO (+2) — tuz hosil qilmaydigan befarq oksidlar',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Befarq azot oksidlari: N₂O (+1) va NO (+2)',
            tenglama: 'N₂O ("kuldiruvchi gaz")  |  NO (rangsiz gaz)',
            rejim: 'molekula',
            markaz: { belgi: 'N⁺¹', rang: '#38bdf8', r: 24 },
            atomlar: [
              { belgi: 'N', rang: '#38bdf8', r: 22, masofa: 72, bog: 2, burchak: 0 },
              { belgi: 'O', rang: '#f43f5e', r: 20, masofa: 72, bog: 2, burchak: Math.PI },
            ],
            metrikalar: [
              { nom: 'N₂O (OD = +1)', qiymat: 'Yoqimli hid, befarq', foiz: 20, rang: '#38bdf8' },
              { nom: 'NO (OD = +2)', qiymat: '0,7 hajm/suv, befarq', foiz: 40, rang: '#34d399' },
            ],
            belgilar: [{ k: 'Suv & Ishqor', v: 'Tuz hosil qilmaydi', rang: '#fde047' }],
          },
          pastki: ['N₂O (+1): "kuldiruvchi gaz"', 'NO (+2): rangsiz gaz', 'Tuz hosil qilmaydi'],
        },
        {
          id: 'kislotali',
          tugma: 'Kislotali: N₂O₃, NO₂, N₂O₅',
          formula: 'N₂O₃ (+3 → HNO₂) • NO₂/N₂O₄ (+4) • N₂O₅ (+5 → HNO₃)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Kislotali oksidlarda azot oksidlanish darajasi',
            tenglama: 'N₂O₃ (+3) → HNO₂  |  NO₂/N₂O₄ (+4)  |  N₂O₅ (+5) → HNO₃',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'N₂O', qiymat: 1, yorliq: '+1 (befarq)', rang: '#38bdf8' },
              { nom: 'NO', qiymat: 2, yorliq: '+2 (befarq)', rang: '#34d399' },
              { nom: 'N₂O₃', qiymat: 3, yorliq: '+3 (ko\'k)', rang: '#60a5fa' },
              { nom: 'NO₂/N₂O₄', qiymat: 4, yorliq: '+4 (qo\'ng\'ir)', rang: '#fb923c' },
              { nom: 'N₂O₅', qiymat: 5, yorliq: '+5 (kristall)', rang: '#f472b6' },
            ],
          },
          pastki: ['N₂O₃ + H₂O = 2HNO₂', 'NO₂ (-9,3°C) ⇄ N₂O₄', 'N₂O₅ + H₂O = 2HNO₃'],
        },
      ]}
    />
  );
}

function KorgazmaNOOlinishi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. NO olinishi & havoda NO₂ (164-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'no_lab',
          tugma: '3Cu + 8HNO₃(suyul.) → NO↑',
          formula: '3Cu + 8HNO₃(suyul.) = 3Cu(NO₃)₂ + 2NO↑ + 4H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Suyultirilgan HNO₃ mis bilan rangsiz NO beradi',
            tenglama: '3Cu⁰ + 8HN⁺⁵O₃(suyul.) → 3Cu⁺²(NO₃)₂ + 2N⁺²O↑ + 4H₂O',
            suyuqlikRang: '#0ea5e9',
            stakanBelgi: 'Cu(NO₃)₂ ko\'k',
            gazRang: '#e2e8f0',
            gazBelgi: 'Rangsiz NO↑',
            elektronJuft: { chap: 'Cu⁰', ong: 'N⁺⁵', e: '3ē' },
            belgilar: [
              { k: 'Gaz rangi', v: 'Rangsiz NO', rang: '#e2e8f0' },
              { k: 'Suvda (0°C)', v: '1 H₂O : 0,7 hajm (juda oz)', rang: '#38bdf8' },
              { k: 'Tabiatda', v: 'N₂ + O₂ ⇄(2000°C) 2NO − Q', rang: '#fde047' },
            ],
          },
          pastki: ['Suyul. HNO₃ + Cu → NO↑', '0°C da 1 H₂O da 0,7 hajm', 'Rangsiz befarq gaz'],
        },
        {
          id: 'no_havo',
          tugma: '2NO + O₂ → 2NO₂ (qo\'ng\'ir)',
          formula: '2NO (rangsiz) + O₂ = 2NO₂ (qizg\'ish-qo\'ng\'ir)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Rangsiz NO havoda darhol qo\'ng\'ir NO₂ ga aylanadi',
            tenglama: '2NO (rangsiz) + O₂ → 2NO₂ (qizg\'ish-qo\'ng\'ir gaz)',
            ikkiIdish: true,
            suyuqlikRang: '#475569',
            stakanBelgi: 'Rangsiz NO',
            gazRang: '#f97316',
            gazBelgi: 'NO + O₂ → NO₂↑',
            ikkinchiSuyuqlikRang: '#9a3412',
            ikkinchiBelgi: 'Qo\'ng\'ir NO₂',
            belgilar: [
              { k: 'Kuzatish', v: 'Darhol qo\'ng\'ir tus!', rang: '#fb923c' },
              { k: 'N holati', v: 'N⁺² → N⁺⁴ (+2ē)', rang: '#fde047' },
              { k: 'Xossa', v: 'NO₂ — kislotali oksid', rang: '#34d399' },
            ],
          },
          pastki: ['2NO + O₂ = 2NO₂', 'Rangsizdan qo\'ng\'irga o\'tadi', 'Kislotali oksidga aylanadi'],
        },
      ]}
    />
  );
}

function KorgazmaNO2Xossalari() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. NO₂ olinishi, N₂O₄ & Suv (164–165-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'no2_lab',
          tugma: 'Cu + 4HNO₃(kons.) → NO₂↑',
          formula: 'Cu + 4HNO₃(kons.) = Cu(NO₃)₂ + 2NO₂↑ + 2H₂O',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Mis + kons. HNO₃ → qizg\'ish-qo\'ng\'ir NO₂↑',
            tenglama: 'Cu + 4HNO₃(kons.) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O',
            suyuqlikRang: '#059669',
            stakanBelgi: 'Cu(NO₃)₂ eritma',
            gazRang: '#f97316',
            gazBelgi: 'Qo\'ng\'ir NO₂↑',
            elektronJuft: { chap: 'Cu⁰', ong: 'N⁺⁵', e: '2ē' },
            belgilar: [
              { k: 'Gaz rangi', v: 'Qizg\'ish-qo\'ng\'ir, zaharli', rang: '#fb923c' },
              { k: 'Tq(NO₂)', v: '21,3°C', rang: '#fde047' },
              { k: 'Dimer N₂O₄', v: '-9,3°C da rangsiz kristall', rang: '#38bdf8' },
            ],
          },
          pastki: ['Cu+4HNO₃(kons.) → 2NO₂↑', 'Tq(NO₂) = 21,3°C', '-9,3°C da rangsiz N₂O₄'],
        },
        {
          id: 'no2_suv',
          tugma: 'NO₂ + H₂O → HNO₃ + HNO₂',
          formula: '2NO₂ + H₂O = HNO₃ + HNO₂  •  4NO₂ + 2H₂O + O₂ = 4HNO₃',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'NO₂ suvda erib ikkita kislota beradi',
            tenglama: '2NO₂ + H₂O = HNO₃ + HNO₂   |   +O₂ → 4HNO₃',
            suyuqlikRang: '#f43f5e',
            stakanBelgi: 'HNO₃ + HNO₂',
            gazRang: '#fb923c',
            gazBelgi: 'NO₂ + O₂',
            reagentlar: [
              { belgi: 'NO₃⁻', rang: '#fde047' },
              { belgi: 'NO₂⁻', rang: '#38bdf8' },
              { belgi: 'H⁺', rang: '#ffffff' },
            ],
            belgilar: [
              { k: 'O₂ siz', v: 'HNO₃ + HNO₂ aralashmasi', rang: '#fb7185' },
              { k: 'O₂ bilan', v: '4NO₂+2H₂O+O₂ = 4HNO₃', rang: '#34d399' },
              { k: 'N⁺⁴ holati', v: 'Disproporsiya (+3 va +5)', rang: '#fde047' },
            ],
          },
          pastki: ['2NO₂+H₂O = HNO₃ + HNO₂', '+O₂ bilan to\'liq HNO₃', 'Sanoat HNO₃ oxirgi bosqichi'],
        },
      ]}
    />
  );
}

function KorgazmaNOMuvozanat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. N₂ + O₂ ⇄ 2NO − Q muvozanati (165-bet)"
      ikon="harorat"
      variantlar={[
        {
          id: 't_up',
          tugma: 'Harorat ↑ (t° ↑)',
          formula: 'N₂ + O₂ ⇄ 2NO − Q  •  Harorat ↑ → muvozanat O\'NGGA',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Endotermik (−Q) reaksiyada harorat ta\'siri',
            tenglama: 'N₂ + O₂ ⇄ 2NO − Q   |   t° ↑ → O\'NGGA (NO↑)',
            tezlik: 4.5,
            siljish: 'ong',
            kameraNom: 't° ↑ — tez to\'qnashuv → O\'NGGA',
            rang: '#fb923c',
            belgilar: [
              { k: 'Issiqlik effekti', v: 'Endotermik (−Q)', rang: '#fb923c' },
              { k: 't° oshganda', v: 'O\'ngga (NO unumi ↑)', rang: '#34d399' },
              { k: '2000°C sharoit', v: 'Chaqmoq va elektr yoy', rang: '#fde047' },
            ],
          },
          pastki: ['Endotermik: −Q (issiqlik yutadi)', 't° ↑ → muvozanat o\'ngga', 'NO unumi ortadi'],
        },
        {
          id: 'p_up',
          tugma: 'Bosim ↑ (2 mol = 2 mol)',
          formula: 'Chapda 2 mol gaz = O\'ngda 2 mol gaz → Bosim siljitmaydi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Teng gaz hajmlarda bosim ta\'sir qilmaydi',
            tenglama: '1 mol N₂ + 1 mol O₂ (2 mol) ⇄ 2 mol NO',
            tezlik: 2.2,
            siljish: 'teng',
            kameraNom: 'ΔV = 0 (2 mol = 2 mol) — SILJIMAYDI',
            rang: '#38bdf8',
            belgilar: [
              { k: 'Chapda gaz', v: '1 + 1 = 2 mol', rang: '#38bdf8' },
              { k: 'O\'ngda gaz', v: '2 mol NO', rang: '#38bdf8' },
              { k: 'Bosim P↑ / P↓', v: 'Muvozanat SILJIMAYDI!', rang: '#fde047' },
            ],
          },
          pastki: ['Chapda 2 mol, o\'ngda 2 mol', 'Bosim P↑/P↓ siljitmaydi', 'Le-Shatelye qoidasi'],
        },
      ]}
    />
  );
}

function KorgazmaN2O5Valentlik() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. N₂O₅ (IV vs +5) & NO₂ zichligi (165-bet)"
      ikon="nurlar"
      variantlar={[
        {
          id: 'val',
          tugma: 'N₂O₅: IV valent vs +5 OD',
          formula: 'N (II davr, 2d-qavatcha yo\'q!) → Maksimal valentlik = IV, OD = +5',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Azot(V) oksid (N₂O₅) — 4 ta bog\', OD = +5',
            tenglama: '1s² 2s² 2p³ (2d yo\'q!) → Valentlik = IV  |  OD = +5',
            rejim: 'molekula',
            markaz: { belgi: 'O', rang: '#f43f5e', r: 22 },
            atomlar: [
              { belgi: 'N⁺⁵', rang: '#38bdf8', r: 24, masofa: 68, burchak: 0 },
              { belgi: 'N⁺⁵', rang: '#38bdf8', r: 24, masofa: 68, burchak: Math.PI },
              { belgi: 'O', rang: '#f43f5e', r: 16, masofa: 108, bog: 2, burchak: 0.6 },
              { belgi: 'O', rang: '#f43f5e', r: 16, masofa: 108, bog: 2, burchak: 2.5 },
            ],
            metrikalar: [
              { nom: 'N maksimal valentligi', qiymat: 'IV (4 ta bog\')', foiz: 80, rang: '#34d399' },
              { nom: 'Oksidlanish darajasi', qiymat: '+5 (N₂O₅)', foiz: 100, rang: '#fde047' },
            ],
            belgilar: [{ k: 'Sabab', v: 'II davrda 2d-orbital yo\'q', rang: '#f472b6' }],
          },
          pastki: ['2d-qavatcha yo\'q → max IV valent', 'Oksidlanish darajasi = +5', 'N₂O₅ + H₂O = 2HNO₃'],
        },
        {
          id: 'zich',
          tugma: 'NO₂ zichligi (Mr = 46)',
          formula: 'D_H₂(NO₂) = 46/2 = 23  •  D_havo = 46/29 ≈ 1,59',
          tur: 'hisob',
          cfg: {
            sarlavha: '165-bet 3-savol: NO₂ nisbiy zichliklari',
            tenglama: 'Mr(NO₂) = 14 + 2·16 = 46',
            qadamlar: [
              { belgi: 'Mr(NO₂)', natija: '46 g/mol', izoh: '14 + 32', rang: '#fb923c' },
              { belgi: 'D_H₂ = 46/2', natija: '23', izoh: 'H₂ dan 23x og\'ir', rang: '#fde047' },
              { belgi: 'D_havo = 46/29', natija: '1,59', izoh: 'Havodan 1,59x og\'ir', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'D_H₂(NO₂)', foiz: 92, qiymat: '23', rang: '#fde047' },
              { nom: 'D_havo(NO₂)', foiz: 64, qiymat: '1,59', rang: '#fb923c' },
            ],
            javobBadge: 'Javob: D_H₂ = 23  |  D_havo = 1,59 (idish tubiga cho\'kadi)',
          },
          pastki: ['Mr(NO₂) = 46', 'D_H₂ = 23; D_havo ≈ 1,59', 'Havodan og\'ir qo\'ng\'ir gaz'],
        },
      ]}
    />
  );
}

function Korgazma38Xulosa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Zanjir & 5,6 l NO + O₂ masalasi"
      ikon="formula"
      variantlar={[
        {
          id: 'zanjir',
          tugma: 'N₂ → NO → NO₂ → HNO₃',
          formula: 'N₂ →(O₂) NO →(O₂) NO₂ →(H₂O+O₂) HNO₃',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Azot oksidlarining uzluksiz o\'zgarish zanjiri',
            tenglama: 'N₂ (0) → NO (+2) → NO₂ (+4) → HNO₃ (+5)',
            markazBelgi: 'N⁺⁵',
            markazRang: '#fb923c',
            tugunlar: [
              { nom: 'Azot (0)', belgi: 'N₂', rang: '#38bdf8' },
              { nom: 'Befarq (+2)', belgi: 'NO', rang: '#34d399' },
              { nom: 'Qo\'ng\'ir (+4)', belgi: 'NO₂', rang: '#f97316' },
              { nom: 'Kislota (+5)', belgi: 'HNO₃', rang: '#f43f5e' },
            ],
            belgilar: [
              { k: '1-bosqich', v: 'N₂ + O₂ ⇄(2000°C) 2NO', rang: '#38bdf8' },
              { k: '2-bosqich', v: '2NO + O₂ = 2NO₂', rang: '#f97316' },
              { k: '3-bosqich', v: '4NO₂+2H₂O+O₂ = 4HNO₃', rang: '#f43f5e' },
            ],
          },
          pastki: ['N₂ → NO → NO₂ → HNO₃', 'NO rangsiz; NO₂ qo\'ng\'ir', 'Suvda HNO₃ + HNO₂'],
        },
        {
          id: 'hisob',
          tugma: '5,6 l NO + O₂ → NO₂',
          formula: '2NO + O₂ = 2NO₂  •  5,6 l NO + 2,8 l O₂ → 5,6 l NO₂',
          tur: 'hisob',
          cfg: {
            sarlavha: 'NO oksidlanishida hajmiy nisbatlar (2 : 1 : 2)',
            tenglama: '2NO + O₂ = 2NO₂   |   5,6 l + 2,8 l → 5,6 l',
            qadamlar: [
              { belgi: 'NO (2 hajm)', natija: '5,6 litr', izoh: '0,25 mol', rang: '#38bdf8' },
              { belgi: 'O₂ (1 hajm)', natija: '2,8 litr', izoh: '0,125 mol', rang: '#fde047' },
              { belgi: 'NO₂ (2 hajm)', natija: '5,6 litr', izoh: '0,25 mol', rang: '#fb923c' },
            ],
            taqqosBars: [
              { nom: 'Sarflangan NO', foiz: 100, qiymat: '5,6 l', rang: '#38bdf8' },
              { nom: 'Sarflangan O₂', foiz: 50, qiymat: '2,8 l', rang: '#fde047' },
              { nom: 'Olingan NO₂', foiz: 100, qiymat: '5,6 l', rang: '#fb923c' },
            ],
            javobBadge: 'Javob: V(O₂) = 2,8 l  |  V(NO₂) = 5,6 l',
          },
          pastki: ['Hajm nisbati 2 : 1 : 2', '2,8 l O₂ sarflanadi', '5,6 l NO₂ hosil bo\'ladi'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (37-§) VA O'YINLAR (38-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'NH₄⁺ ionida azotning valentligi va OD qancha?',
    variantlar: [
      { matn: 'V valent, OD = +5', togri: false },
      { matn: 'III valent, OD = +4', togri: false },
      { matn: 'IV valentli (donor-akseptor), OD = -3', togri: true },
      { matn: 'II valent, OD = -2', togri: false },],
    izoh: 'Donor-akseptor bog\' bilan N IV valentli, OD = -3.',
  },
  {
    id: 't2',
    savol: '1 H₂O da necha hajm NH₃ eriydi va zichligi?',
    variantlar: [
      { matn: '700 hajm; havodan 1,7x yengil', togri: true },
      { matn: '2 hajm; 2x og\'ir', togri: false },
      { matn: '50 hajm; havodan og\'ir', togri: false },
      { matn: 'Suvda erimaydi', togri: false },],
    izoh: '700 hajm eriydi; 29/17 ≈ 1,7 marta yengil.',
  },
  {
    id: 't3',
    savol: '4NH₃ + 5O₂ →(Pt) qaysi mahsulotlarni beradi?',
    variantlar: [
      { matn: '2N₂ + 6H₂O', togri: false },
      { matn: '4HNO₃ + 2H₂', togri: false },
      { matn: 'NH₄OH', togri: false },
      { matn: '4NO + 6H₂O', togri: true },],
    izoh: 'Pt katalizida NO + H₂O hosil bo\'ladi.',
  },
  {
    id: 't4',
    savol: 'NH₄⁺ ioniga sifat reaksiyasi qanday o\'tkaziladi?',
    variantlar: [
      { matn: '+ AgNO₃', togri: false },
      { matn: '+ NaOH va qizdirish → NH₃↑', togri: true },
      { matn: '+ HCl', togri: false },
      { matn: '+ BaCl₂', togri: false },],
    izoh: 'Ishqor bilan o\'tkir hidli NH₃↑ ajraladi.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'befarq', nom: 'Befarq oksidlar', tavsif: 'N₂O (+1), NO (+2)' },
    { id: 'kislotali', nom: 'Kislotali oksidlar', tavsif: 'N₂O₃, NO₂, N₂O₅' },
    { id: 'hisob', nom: 'Muvozanat & Zichlik', tavsif: '2NO, IV valent, D=23' },
  ],
  topshiriqlar: [
    { nom: 'N₂O (+1) va NO (+2)', qisqa: 'Tuz hosil qilmaydi', guruh: 'befarq', izoh: 'Befarq azot oksidlari.' },
    { nom: '3Cu + 8HNO₃(suyul) → NO↑', qisqa: 'Rangsiz gaz olinishi', guruh: 'befarq', izoh: 'Suvda 0,7 hajm eriydi.' },
    { nom: '2NO + O₂ = 2NO₂', qisqa: 'Havoda darhol qo\'ng\'ir', guruh: 'befarq', izoh: 'NO oson oksidlanadi.' },
    { nom: 'Cu + 4HNO₃(kons) → NO₂↑', qisqa: 'Qizg\'ish-qo\'ng\'ir gaz', guruh: 'kislotali', izoh: 'Tq = 21,3°C.' },
    { nom: '2NO₂ + H₂O → HNO₃ + HNO₂', qisqa: '+O₂ bilan to\'liq HNO₃', guruh: 'kislotali', izoh: 'Disproporsiya reaksiyasi.' },
    { nom: 'N₂O₃, N₂O₄ (-9,3°C), N₂O₅', qisqa: '+3, +4 va +5 oksidlar', guruh: 'kislotali', izoh: 'HNO₂ va HNO₃ angidridlari.' },
    { nom: 'N₂+O₂⇄2NO−Q: t°↑ → o\'ngga', qisqa: 'Bosim P siljitmaydi', guruh: 'hisob', izoh: 'Chap va o\'ngda 2 mol gaz.' },
    { nom: 'N₂O₅: IV valent, OD = +5', qisqa: '2d-qavatcha mavjud emas', guruh: 'hisob', izoh: 'II davr cheklovi.' },
    { nom: 'NO₂: D_H₂ = 23, D_havo = 1,59', qisqa: 'Mr(NO₂) = 46', guruh: 'hisob', izoh: '46/2 = 23; 46/29 ≈ 1,59.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Tasnif',
    savol: 'Qaysi azot oksidlari befarq (tuz bermaydigan)?',
    variantlar: ['N₂O₃ va N₂O₄', 'NO₂ va N₂O₅', 'N₂O (+1) va NO (+2)', 'Faqat N₂O₅'],
    togri: 2,
    izoh: 'N₂O va NO befarq; qolganlari kislotali.',
  },
  {
    belgi: 'Lab gazlar',
    savol: 'Cu ga suyul. va kons. HNO₃ ta\'sirida qaysi gaz chiqadi?',
    variantlar: ['Suyul: NO↑ • Kons: NO₂↑', 'Ikkalasida N₂', 'Ikkalasida H₂', 'NO₂ va N₂O'],
    togri: 0,
    izoh: 'Suyul. → NO↑, kons. → NO₂↑.',
  },
  {
    belgi: 'Valentlik',
    savol: 'N₂O₅ da azotning valentligi va OD qancha?',
    variantlar: ['V valent, +5', 'III valent, +3', 'IV valent, -3', 'IV valent, OD = +5'],
    togri: 3,
    izoh: '2d yo\'qligi uchun IV valent, OD = +5.',
  },
  {
    belgi: 'Zichlik',
    savol: 'NO₂ (Mr=46) uchun D_H₂ va D_havo qancha?',
    variantlar: ['46 va 2', '23 va 1,59', '14 va 0,97', '15 va 1,03'],
    togri: 1,
    izoh: '46/2 = 23; 46/29 ≈ 1,59.',
  },
  {
    belgi: 'Muvozanat',
    savol: 'N₂ + O₂ ⇄ 2NO − Q ga harorat↑ va bosim↑ ta\'siri?',
    variantlar: ['Ikkalasi chapga', 't°↑ → o\'ngga; P siljitmaydi', 'P↑ → o\'ngga', 't°↑ → chapga'],
    togri: 1,
    izoh: '−Q da t°↑ o\'ngga; 2 mol = 2 mol da P siljitmaydi.',
  },
  {
    belgi: 'Suv bilan',
    savol: '2NO₂ + H₂O = ? qaysi kislotalar olinadi?',
    variantlar: ['Faqat HNO₃', 'Faqat HNO₂', 'NH₄OH + O₂', 'HNO₃ + HNO₂'],
    togri: 3,
    izoh: 'Nitrat va nitrit kislotalar hosil bo\'ladi.',
  },
  {
    belgi: 'Fizik holat',
    savol: 'NO₂ ning Tq va -9,3°C dagi holati?',
    variantlar: ['Tq = 21,3°C; -9,3°C → N₂O₄ kristall', '100°C portlaydi', '-196°C moviy', '-33°C bug\''],
    togri: 0,
    izoh: '-9,3°C da rangsiz qo\'sh oksid N₂O₄ ga qotadi.',
  },
  {
    belgi: 'Oksidlanish',
    savol: 'Rangsiz NO havoda nega darhol qo\'ng\'irlashadi?',
    variantlar: ['Suv bug\'i bilan', 'Azot bilan', '2NO + O₂ → 2NO₂ hosil qiladi', 'N₂O ga parchalanadi'],
    togri: 2,
    izoh: 'Havodagi O₂ bilan NO₂ ga oksidlanadi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'N₂ → HNO₃ zanjiri',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. N₂ + O₂ ⇄(2000°C) 2NO − Q',
      '2. 2NO + O₂ = 2NO₂ (qo\'ng\'ir gaz)',
      '3. 2NO₂ + H₂O = HNO₃ + HNO₂',
      '4. 4NO₂ + 2H₂O + O₂ = 4HNO₃',
    ],
    variantlar: [
      '3. 2NO₂ + H₂O = HNO₃ + HNO₂',
      '1. N₂ + O₂ ⇄(2000°C) 2NO − Q',
      '4. 4NO₂ + 2H₂O + O₂ = 4HNO₃',
      '2. 2NO + O₂ = 2NO₂ (qo\'ng\'ir gaz)',
    ],
  },
  {
    tur: 'NO₂ zichlik hisobi',
    vazifa: 'Qadamlarni tartiblang:',
    tartib: [
      '1. Tarkib: 1 ta N (14) + 2 ta O (32)',
      '2. Mr(NO₂) = 14 + 32 = 46 g/mol',
      '3. D_H₂ = 46 / 2 = 23',
      '4. D_havo = 46 / 29 ≈ 1,59',
    ],
    variantlar: [
      '2. Mr(NO₂) = 14 + 32 = 46 g/mol',
      '4. D_havo = 46 / 29 ≈ 1,59',
      '1. Tarkib: 1 ta N (14) + 2 ta O (32)',
      '3. D_H₂ = 46 / 2 = 23',
    ],
  },
  {
    tur: 'Cu dan NO va NO₂ olish',
    vazifa: 'Tartibni tuzing:',
    tartib: [
      '1. 3Cu + 8HNO₃(suyul) → 2NO↑',
      '2. Rangsiz NO suvda 0,7 hajm eriydi',
      '3. Cu + 4HNO₃(kons) → 2NO₂↑',
      '4. Qo\'ng\'ir NO₂ -9,3°C da N₂O₄ ga qotadi',
    ],
    variantlar: [
      '3. Cu + 4HNO₃(kons) → 2NO₂↑',
      '4. Qo\'ng\'ir NO₂ -9,3°C da N₂O₄ ga qotadi',
      '1. 3Cu + 8HNO₃(suyul) → 2NO↑',
      '2. Rangsiz NO suvda 0,7 hajm eriydi',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Qaysi oksid "kuldiruvchi gaz" deyiladi?',
    variantlar: ['NO', 'N₂O (+1)', 'NO₂', 'N₂O₅'],
    togri: 1,
    izoh: 'N₂O — azot(I) oksid.',
  },
  {
    savol: 'N₂O₃ + H₂O = ? kislotasi olinadi:',
    variantlar: ['HNO₃', 'H₃PO₄', 'NH₄OH', 'HNO₂ (nitrit kislota)'],
    togri: 3,
    izoh: 'N₂O₃ — nitrit kislota angidridi.',
  },
  {
    savol: '3Cu + 8HNO₃(suyul.) → ? gazi chiqadi:',
    variantlar: ['NO (rangsiz)', 'NO₂', 'H₂', 'N₂O'],
    togri: 0,
    izoh: 'Suyultirilgan HNO₃ mis bilan NO beradi.',
  },
  {
    savol: '4NO₂ + 2H₂O + O₂ = ?:',
    variantlar: ['Faqat HNO₂', 'H₂SO₄', '4HNO₃', 'HCl'],
    togri: 2,
    izoh: 'Kislorod ishtirokida to\'liq HNO₃ hosil bo\'ladi.',
  },
  {
    savol: 'N₂O₄ qanday modda?',
    variantlar: ['Asosli oksid', 'Befarq oksid', 'NO₂ ning qo\'sh oksidi (dimer)', 'Peroksid'],
    togri: 2,
    izoh: 'Sovutganda qo\'sh oksid N₂O₄ ga aylanadi.',
  },
  {
    savol: 'N₂O₅ da azot nega V valentli emas?',
    variantlar: ['2d-qavatcha yo\'q (max IV valent)', 'H yo\'q', 'O bilan birikmaydi', '8 ē to\'la'],
    togri: 0,
    izoh: 'II davr elementi: maksimal valentligi IV.',
  },
  {
    savol: '0°C da 1 H₂O da necha hajm NO eriydi?',
    variantlar: ['700 hajm', '0,7 hajm (oz eriydi)', '100 hajm', '10 hajm'],
    togri: 1,
    izoh: 'Suvda juda oz — 0,7 hajm.',
  },
  {
    savol: 'N₂+O₂ ⇄ 2NO−Q ga bosim 3x oshsa nima bo\'ladi?',
    variantlar: ['O\'ngga', 'Chapga', 'To\'xtaydi', 'Siljimaydi (2 mol = 2 mol)'],
    togri: 3,
    izoh: 'Gaz hajmlari teng (2 = 2) bo\'lsa bosim ta\'sir qilmaydi.',
  },
];

export default function S8Mavzu38() {
  const korgazmalar = [
    { nom: '1. 6 ta azot oksidi', ikon: 'atom', komponent: <KorgazmaAzotOksidlari /> },
    { nom: '2. NO & havoda NO₂', ikon: 'kolba', komponent: <KorgazmaNOOlinishi /> },
    { nom: '3. NO₂, N₂O₄ & suv', ikon: 'tomchi', komponent: <KorgazmaNO2Xossalari /> },
    { nom: '4. Muvozanat: 2NO', ikon: 'harorat', komponent: <KorgazmaNOMuvozanat /> },
    { nom: '5. N₂O₅ & zichlik', ikon: 'nurlar', komponent: <KorgazmaN2O5Valentlik /> },
    { nom: '6. Zanjir & masala', ikon: 'formula', komponent: <Korgazma38Xulosa /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-38"
          nom="Azot oksidlarini guruhlang"
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
          key="tezkor-38"
          nom="38-§: Azot oksidlari"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Zanjir',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-38"
          nom="N₂ → HNO₃ va zichlik zanjiri"
          ikon="filtr"
          missiyalar={ZANJIR_MISSIYALAR}
        />
      ),
    },
    {
      nom: '4. Duel',
      ikon: 'kubok',
      komponent: (
        <JamoalarDueliPanel
          key="duel-38"
          sarlavha="38-§: Azot oksidlari dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="38-§"
      mavzuNom="Azotning kislorodli birikmalari"
      oldingiRaqam="37-§"
      oldingiNom="Ammiak va NH₄⁺"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
