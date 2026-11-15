'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 43-PARAGRAF
// "Eng muhim asosiy mineral o'g'itlar" (Darslik 189-193-betlar)
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
function KorgazmaAzotliVaZavodlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. &apos;O&apos;zkimyosanoat&apos; zavodlari va azotli o&apos;g&apos;itlar"
      ikon="kolba"
      variantlar={[
        {
          id: 'zavodlar',
          tugma: 'O\'zbekiston zavodlari',
          formula: 'Maksam-Chirchiq • Navoiyazot • Farg\'onaazot • Samarqand • Dehqonobod',
          tur: 'sanoat',
          cfg: {
            sarlavha: '"O\'zkimyosanoat" AJ tizimidagi asosiy korxonalar (189-bet)',
            tenglama: 'NH₃ / NH₄NO₃ / CO(NH₂)₂ / Ammofos / KCl',
            bosqichlar: [
              { nom: 'Chirchiq & Navoiy', tur: 'kataliz', ichi: 'NH₃, HNO₃', mahsulot: 'Karbamid, Selitra', rang: '#38bdf8' },
              { nom: 'Farg\'onaazot & Sam.', tur: 'minora', ichi: 'H₃PO₄ + NH₃', mahsulot: 'NH₄NO₃, Ammofos', rang: '#34d399' },
              { nom: 'Dehqonobod (Qashq.)', tur: 'pech', ichi: 'Silvinit KCl·NaCl', mahsulot: 'KCl (52–60% K₂O)', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Defoliantlar', v: '"Farg\'onaazot" AJ', rang: '#fbbf24' }],
          },
          pastki: ['Maksam-Chirchiq & Navoiyazot: NH₃, karbamid', 'Farg\'onaazot: selitra, defoliantlar', 'Samarqandkimyo: ammofos; Dehqonobod: KCl'],
        },
        {
          id: 'azotli_turlar',
          tugma: 'Azotli o\'g\'itlar',
          formula: 'NH₃(s) 82,35%  |  CO(NH₂)₂ 46%  |  NH₄NO₃ 35%  |  NaNO₃ 16,4%',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Karbamid sintezi va ammoniy/nitrat selitralar',
            tenglama: 'CO₂ + 2NH₃ → CO(NH₂)₂ + H₂O   |   NH₃ + HNO₃ = NH₄NO₃',
            suyuqlikRang: '#38bdf8',
            tolish: 0.72,
            stakanBelgi: 'CO(NH₂)₂ / NH₄NO₃',
            stakanSarlavha: 'Azotli sintez',
            qizdir: true,
            olovRang: '#f97316',
            tempC: 185,
            maxTemp: 250,
            belgilar: [{ k: 'Ammiakli suv', v: '20–25% NH₃', rang: '#38bdf8' }],
          },
          pastki: ['Suyuq NH₃ (82,35%) & ammiakli suv (20–25%)', 'Karbamid CO(NH₂)₂ (46% N)', 'NaNO₃ (16,4% N), Ca(NO₃)₂, KNO₃'],
        },
      ]}
    />
  );
}

function KorgazmaFosforliOgitlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Fosforli o&apos;g&apos;itlar va gips ballastisiz turlar"
      ikon="kristall"
      variantlar={[
        {
          id: 'superfosfat',
          tugma: 'Oddiy vs Qo\'sh superfosfat',
          formula: 'Oddiy (14–20% P₂O₅, gips!)  vs  Qo\'sh (40–50% P₂O₅, ballastsiz)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Oddiy superfosfat (gips ballast!) va Qo\'sh superfosfat',
            tenglama: 'Qo\'sh: Ca₃(PO₄)₂ + 4H₃PO₄ = 3Ca(H₂PO₄)₂  (suvda to\'liq eriydi)',
            ikkiIdish: true,
            suyuqlikRang: '#94a3b8',
            tolish: 0.72,
            stakanBelgi: '+2CaSO₄·2H₂O',
            stakanSarlavha: 'Oddiy (14–20%)',
            ikkinchiSuyuqlikRang: '#34d399',
            ikkinchiBelgi: 'Ca(H₂PO₄)₂',
            ikkinchiSarlavha: 'Qo\'sh (40–50%)',
            chokmaRang: '#cbd5e1',
            chokmaBelgi: 'Gips ballasti',
            belgilar: [{ k: 'Fosforit talqoni', v: 'Faqat kislotali tuproqqa!', rang: '#fbbf24' }],
          },
          pastki: ['Fosforit talqoni Ca₃(PO₄)₂: kislotali tuproqqa', 'Oddiy: + 2CaSO₄·2H₂O gips ballasti', 'Qo\'sh Ca(H₂PO₄)₂: 40–50% P₂O₅, ballastsiz'],
        },
        {
          id: 'pretsipitat_ammofos',
          tugma: 'Pretsipitat & Ammofos',
          formula: 'CaHPO₄·2H₂O (30–35%)  •  Suyak talqoni  •  Ammofos',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Pretsipitat, Suyak talqoni va Ammofos',
            tenglama: 'H₃PO₄+Ca(OH)₂ → CaHPO₄·2H₂O   |   H₃PO₄+NH₃ → NH₄H₂PO₄ + (NH₄)₂HPO₄',
            suyuqlikRang: '#fbbf24',
            tolish: 0.72,
            stakanBelgi: 'NH₄H₂PO₄',
            stakanSarlavha: 'Ammofos (NP)',
            chokmaRang: '#e2e8f0',
            chokmaBelgi: 'CaHPO₄·2H₂O',
            belgilar: [{ k: 'Pretsipitat', v: 'Zaif kislotada eriydi', rang: '#fbbf24' }],
          },
          pastki: ['Pretsipitat CaHPO₄·2H₂O: 30–35% P₂O₅', 'Suyak talqoni: hayvon suyaklaridan', 'Ammofos: NH₄H₂PO₄ + (NH₄)₂HPO₄'],
        },
      ]}
    />
  );
}

function KorgazmaKaliyliOgitlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Kaliyli o&apos;g&apos;itlar va xlorsiz ekinlar (192-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'minerallar',
          tugma: 'Silvinit, Kainit & KCl',
          formula: 'Silvinit KCl·NaCl  •  Kainit MgSO₄·KCl·3H₂O  •  Kul K₂CO₃',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Tabiiy kaliy rudalari va Dehqonobod KCl',
            tenglama: 'Silvinit KCl·NaCl → NaCl ajratiladi → KCl (52–60% K₂O)',
            rejim: 'kristall',
            kristallTuri: 'ion',
            metrikalar: [
              { nom: 'Dehqonobod KCl', qiymat: '52–60% K₂O', foiz: 95, rang: '#a855f7' },
              { nom: 'Yog\'och kuli K₂CO₃', qiymat: 'Xlorsiz + K + Ca', foiz: 65, rang: '#34d399' },
              { nom: 'Silvinit / Kainit', qiymat: 'Tabiiy ruda (Cl⁻ ko\'p)', foiz: 45, rang: '#fbbf24' },
            ],
            belgilar: [{ k: 'Kainit', v: 'MgSO₄·KCl·3H₂O', rang: '#38bdf8' }],
          },
          pastki: ['Silvinit KCl·NaCl; Kainit MgSO₄·KCl·3H₂O', 'Dehqonobod zavodi: kons. KCl', 'Yog\'och kuli: K₂CO₃ (xlorsiz)'],
        },
        {
          id: 'xlorsiz',
          tugma: 'Xlor (Cl⁻) sezgir ekinlar',
          formula: 'Kartoshka, zig\'ir, tamaki, uzum, sitrus → K₂SO₄ / K₂CO₃ / KNO₃',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Cl⁻ ioniga sezgir ekinlarga faqat xlorsiz K-o\'g\'it beriladi!',
            tenglama: 'KCl kartoshkada kraxmalni va uzumda qandni kamaytiradi → K₂SO₄ / KNO₃ / kul!',
            markazBelgi: 'Cl⁻ XAVF',
            markazRang: '#ef4444',
            tugunlar: [
              { nom: 'Kartoshka & Zig\'ir', belgi: 'K₂SO₄ kerak', rang: '#fbbf24' },
              { nom: 'Uzum & Sitrus', belgi: 'KNO₃ kerak', rang: '#a855f7' },
              { nom: 'Tamaki', belgi: 'Yog\'och kuli K₂CO₃', rang: '#34d399' },
              { nom: 'Cl⁻ ta\'siri', belgi: 'Sifatni tushiradi!', rang: '#ef4444' },
            ],
            belgilar: [{ k: 'Tavsiya', v: 'K₂SO₄, K₂CO₃, KNO₃', rang: '#34d399' }],
          },
          pastki: ['Kartoshka, zig\'ir, tamaki, uzum, sitrus', 'KCl bu ekinlarda hosil sifatini buzadi', 'Xlorsiz: K₂SO₄, K₂CO₃ (kul), KNO₃'],
        },
      ]}
    />
  );
}

function Korgazma43MasalalarA() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Masalalar (1): NaNO₃ (16,4%) va Qo&apos;sh superfosfat (4,117 t)"
      ikon="formula"
      variantlar={[
        {
          id: 'nano3',
          tugma: 'NaNO₃ da % N (16,47%)',
          formula: 'M(NaNO₃) = 85 g/mol  →  14 / 85 · 100% = 16,47%',
          tur: 'hisob',
          cfg: {
            sarlavha: '189–190-bet misol: Natriy selitradagi azot foizi',
            tenglama: 'M(NaNO₃) = 23 + 14 + 48 = 85 g/mol   |   1 mol tuzda 14 g N',
            qadamlar: [
              { belgi: 'M(NaNO₃)', natija: '85 g/mol', izoh: '23+14+3·16', rang: '#38bdf8' },
              { belgi: 'm(N) 1 molda', natija: '14 g', izoh: '1 ta N atomi', rang: '#fbbf24' },
              { belgi: 'w(N) = 14/85·100', natija: '16,4% (16,47%)', izoh: 'Selitra N ulushi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Na (23/85)', foiz: 27.1, qiymat: '27,06%', rang: '#a855f7' },
              { nom: 'N (14/85)', foiz: 16.5, qiymat: '16,47%', rang: '#34d399' },
              { nom: 'O₃ (48/85)', foiz: 56.5, qiymat: '56,47%', rang: '#fb7185' },
            ],
            javobBadge: 'Javob: 16,4% (16,47%) azot',
          },
          pastki: ['M(NaNO₃) = 85 g/mol', '14 / 85 × 100% = 16,47%', 'Na va O ham qatnashadi'],
        },
        {
          id: 'qosh_super',
          tugma: '1 t P₂O₅ → 4,117 t',
          formula: '40% Ca(H₂PO₄)₂ (M=234) dan 1 t P₂O₅ (M=142) → 4,117 t',
          tur: 'hisob',
          cfg: {
            sarlavha: '191-bet misol: 1 t P₂O₅ uchun kerakli 40% qo\'sh superfosfat',
            tenglama: '1 mol Ca(H₂PO₄)₂ (234 g) ≡ 1 mol P₂O₅ (142 g)',
            qadamlar: [
              { belgi: 'm_sof = 234/142', natija: '1,647 t', izoh: 'Sof Ca(H₂PO₄)₂', rang: '#38bdf8' },
              { belgi: 'w(tuz)', natija: '40% (0,40)', izoh: 'O\'g\'it tarkibida', rang: '#fbbf24' },
              { belgi: 'm_ogit = 1,647/0,4', natija: '4,117 t', izoh: 'Qo\'sh superfosfat', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'P₂O₅ (ekviv.)', foiz: 24.3, qiymat: '1,00 t', rang: '#fbbf24' },
              { nom: 'Sof Ca(H₂PO₄)₂', foiz: 40.0, qiymat: '1,647 t', rang: '#38bdf8' },
              { nom: '40% o\'g\'it', foiz: 100.0, qiymat: '4,117 t', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 4,117 tonna qo\'sh superfosfat',
          },
          pastki: ['M(Ca(H₂PO₄)₂)=234; M(P₂O₅)=142', '234 / 142 = 1,647 t sof tuz', '1,647 / 0,40 = 4,117 t'],
        },
      ]}
    />
  );
}

function Korgazma43MasalalarB() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Masalalar (2): 473,3 kg K₂O va Farg&apos;onaazot (40 t)"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'k2o',
          tugma: '1 t (75% KCl) → 473,3 kg K₂O',
          formula: '750 kg KCl · 94 / 149 = 473,3 kg K₂O (47,33%)',
          tur: 'hisob',
          cfg: {
            sarlavha: '192-bet misol: 75% KCl saqlagan 1 t o\'g\'itda K₂O miqdori',
            tenglama: '2KCl (2·74,5 = 149 g)  →  1K₂O (94 g)',
            qadamlar: [
              { belgi: 'm(KCl) = 1000·0,75', natija: '750 kg', izoh: 'Toza KCl', rang: '#a855f7' },
              { belgi: 'Nisbat 2KCl:K₂O', natija: '149 : 94', izoh: '2·74,5 → 94', rang: '#fbbf24' },
              { belgi: 'X = 750·94/149', natija: '473,3 kg', izoh: '47,33% K₂O', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'KCl (75%)', foiz: 75.0, qiymat: '750 kg', rang: '#a855f7' },
              { nom: 'K₂O ekvivalenti', foiz: 47.3, qiymat: '473,3 kg', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 473,3 kg K₂O (47,33%)',
          },
          pastki: ['75% × 1000 = 750 kg KCl', '2KCl (149) → K₂O (94)', '750 × 94 / 149 = 473,3 kg'],
        },
        {
          id: 'fargona',
          tugma: '40 t NH₄NO₃ (Farg\'onaazot)',
          formula: '500 kmol  →  31,5 t HNO₃ + 11 200 m³ NH₃',
          tur: 'hisob',
          cfg: {
            sarlavha: '193-bet 5-savol: "Farg\'onaazot"da 40 t NH₄NO₃ olish sarfi',
            tenglama: 'NH₃ + HNO₃ = NH₄NO₃ (1:1:1)  |  n = 40 000 / 80 = 500 kmol',
            qadamlar: [
              { belgi: 'n(NH₄NO₃)', natija: '500 kmol', izoh: '40 000 / 80', rang: '#38bdf8' },
              { belgi: 'm(HNO₃) = 500·63', natija: '31,5 t', izoh: '31 500 kg', rang: '#fbbf24' },
              { belgi: 'V(NH₃) = 500·22,4', natija: '11 200 m³', izoh: 'n.sh.dagi gaz', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'HNO₃ (500 kmol)', foiz: 78.8, qiymat: '31,5 tonna', rang: '#fbbf24' },
              { nom: 'NH₄NO₃ (hosil)', foiz: 100.0, qiymat: '40,0 tonna', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 31,5 t HNO₃ va 11 200 m³ NH₃',
          },
          pastki: ['40 000 / 80 = 500 kmol', '500 × 63 = 31 500 kg = 31,5 t HNO₃', '500 × 22,4 = 11 200 m³ NH₃'],
        },
      ]}
    />
  );
}

function Korgazma43Solishtirish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. P va K o&apos;g&apos;itlari qiyosi hamda tuproq tanlovi"
      ikon="grafik"
      variantlar={[
        {
          id: 'qiyos',
          tugma: 'P va K xaritasi',
          formula: 'Fosforit < Oddiy (20%) < Pretsipitat (35%) < Qo\'sh (50%)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Fosforli o\'g\'itlarning % P₂O₅ va eruvchanlik qiyosi',
            tenglama: 'Fosforit (kislotali tuproq)  |  Pretsipitat (zaif kislota)  |  Superfosfat (suvda)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Oddiy (+gips)', qiymat: 36, yorliq: '14–20% P₂O₅', rang: '#94a3b8' },
              { nom: 'Pretsipitat', qiymat: 64, yorliq: '30–35% P₂O₅', rang: '#fbbf24' },
              { nom: 'Qo\'sh superfos.', qiymat: 92, yorliq: '40–50% P₂O₅', rang: '#34d399' },
              { nom: 'Ammofos (N+P)', qiymat: 100, yorliq: '52% P₂O₅+12%N', rang: '#38bdf8' },
            ],
            belgilar: [{ k: 'Gips ballast', v: 'Faqat oddiy superfosfatda!', rang: '#fb7185' }],
          },
          pastki: ['Oddiy superfosfatda CaSO₄·2H₂O ballasti bor', 'Qo\'sh superfosfat to\'liq suvda eriydi', 'Pretsipitat CaHPO₄·2H₂O kuchsiz kislotada'],
        },
        {
          id: 'tuproq',
          tugma: 'Tuproq pH & tanlov',
          formula: 'Kislotali: ohak/kul/fosforit  •  Neytral: qo\'sh & karbamid',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Tuproq muhitiga (pH) ko\'ra o\'g\'it tanlash qoidasi',
            tenglama: 'Kislotali tuproq → kul/ohak/fosforit   |   Sezgir ekin → xlorsiz K₂SO₄/KNO₃',
            turi: 'ph',
            ph: 6.5,
            kameraNom: 'Optimal tuproq (pH ≈ 6,5–7,0)',
            ustunlar: [
              { nom: 'Kislotali (<5,5)', qiymat: 35, yorliq: 'Ohak + Fosforit', rang: '#fb7185' },
              { nom: 'Neytral (6,5–7)', qiymat: 90, yorliq: 'Qo\'sh + Karbamid', rang: '#34d399' },
              { nom: 'Cl⁻ sezgir ekin', qiymat: 70, yorliq: 'K₂SO₄ / KNO₃ / Kul', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Ehtiyot', v: '(NH₄)₂SO₄ tuproqni nordonlaydi', rang: '#fbbf24' }],
          },
          pastki: ['Kislotali tuproqqa: fosforit talqoni, yog\'och kuli', 'Kartoshka, uzum, sitrusga: KCl MUMKIN EMAS', 'Neytral tuproqqa: karbamid, qo\'sh superfosfat'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (42-§) VA O'YINLAR (43-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'O\'simliklar uchun MIKROELEMENTLAR guruhi:',
    variantlar: [
      { matn: 'Ca, Mg, S', togri: false },
      { matn: 'C, O, H, N, P, K', togri: false },
      { matn: 'Fe, Mn, B, Cu, Zn, Mo, Co (< 0,001%)', togri: true },
      { matn: 'Na, Cl, Si', togri: false },],
    izoh: '7 ta asosiy mikroelement: Fe, Mn, B, Cu, Zn, Mo, Co.',
  },
  {
    id: 't2',
    savol: '1840-yilda mineral oziqlanish asoschisi va O\'zbekistonda o\'g\'itlar maktabi olimi:',
    variantlar: [
      { matn: 'Yu.Libix (1840) va akad. M.N.Nabiyev', togri: true },
      { matn: 'Fersman va Brendt', togri: false },
      { matn: 'Bridjmen va Shretter', togri: false },
      { matn: 'Lomonosov va Mendeleyev', togri: false },],
    izoh: 'Yustus Libix va akademik Malik Nabiyevich Nabiyev.',
  },
  {
    id: 't3',
    savol: '24-jadvalga ko\'ra qaysi qattiq azotli o\'g\'itda % N eng yuqori?',
    variantlar: [
      { matn: 'NH₄NO₃ (35%)', togri: false },
      { matn: 'NaNO₃ (16%)', togri: false },
      { matn: '(NH₄)₂SO₄ (21%)', togri: false },
      { matn: 'Karbamid CO(NH₂)₂ (46% N)', togri: true },],
    izoh: 'Karbamid = 46% N (aniq 46,67%).',
  },
  {
    id: 't4',
    savol: 'w(N) kamayish tartibi: NH₃, NH₄OH, NH₄NO₃, (NH₄)₂SO₄:',
    variantlar: [
      { matn: '(NH₄)₂SO₄ > NH₄NO₃ > NH₃', togri: false },
      { matn: 'NH₃ (82,4%) > NH₄OH (40%) > NH₄NO₃ (35%) > (NH₄)₂SO₄ (21,2%)', togri: true },
      { matn: 'NH₄NO₃ > NH₃ > (NH₄)₂SO₄', togri: false },
      { matn: 'NH₄OH > NH₃ > NH₄NO₃', togri: false },],
    izoh: '14/17 > 14/35 > 28/80 > 28/132.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'zavod_azot', nom: 'Zavodlar & Azotli', tavsif: 'Chirchiq, Farg\'ona, NH₄NO₃' },
    { id: 'fosforli', nom: 'Fosforli o\'g\'itlar', tavsif: 'Superfosfat, Pretsipitat, Ammofos' },
    { id: 'kaliyli', nom: 'Kaliyli & Xlorsiz', tavsif: 'Dehqonobod, Silvinit, K₂SO₄' },
  ],
  topshiriqlar: [
    { nom: 'Maksam-Chirchiq & Navoiyazot', qisqa: 'NH₃, HNO₃, karbamid, selitra', guruh: 'zavod_azot', izoh: '"O\'zkimyosanoat" AJ korxonalari.' },
    { nom: 'Farg\'onaazot & Samarqandkimyo', qisqa: 'Selitra, defoliant, ammofos', guruh: 'zavod_azot', izoh: 'Mamlakatning yirik kimyo zavodlari.' },
    { nom: 'CO₂+2NH₃→CO(NH₂)₂+H₂O (46% N)', qisqa: 'Karbamid sintezi', guruh: 'zavod_azot', izoh: 'Suyuq NH₃ esa 82,35% N.' },
    { nom: 'Ca₃(PO₄)₂ + 4H₃PO₄ = 3Ca(H₂PO₄)₂', qisqa: 'Qo\'sh superfosfat (40–50%)', guruh: 'fosforli', izoh: 'Gips ballastsiz, suvda eriydi.' },
    { nom: 'Oddiy superfosfat (+2CaSO₄·2H₂O)', qisqa: '14–20% P₂O₅, gips ballasti bor', guruh: 'fosforli', izoh: 'H₂SO₄ bilan ishlovdan olinadi.' },
    { nom: 'Pretsipitat CaHPO₄·2H₂O (30–35%)', qisqa: 'Kuchsiz kislotada eriydi', guruh: 'fosforli', izoh: 'Ammofos: NH₄H₂PO₄ + (NH₄)₂HPO₄.' },
    { nom: 'Dehqonobod kaliy zavodi', qisqa: 'Silvinit KCl·NaCl → KCl', guruh: 'kaliyli', izoh: 'Qashqadaryo, 52–60% K₂O.' },
    { nom: 'Kainit MgSO₄·KCl·3H₂O', qisqa: 'Tabiiy kaliy minerali', guruh: 'kaliyli', izoh: 'Yog\'och kuli K₂CO₃ (xlorsiz).' },
    { nom: 'Kartoshka, uzum, tamaki → K₂SO₄', qisqa: 'Xlorsiz o\'g\'it talab qiladi', guruh: 'kaliyli', izoh: 'KCl hosil sifatini tushiradi.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Zavod',
    savol: 'O\'zbekistonda kaliyli o\'g\'it (KCl) ishlab chiqaruvchi zavod:',
    variantlar: ['Farg\'onaazot', 'Navoiyazot', 'Dehqonobod zavodi (Qashqadaryo)', 'Maksam-Chirchiq'],
    togri: 2,
    izoh: 'Dehqonobod kaliyli o\'g\'itlar zavodi silvinitdan KCl oladi.',
  },
  {
    belgi: 'Qo\'sh superfos.',
    savol: 'Qo\'sh superfosfat formulasi va % P₂O₅ ulushi:',
    variantlar: ['Ca(H₂PO₄)₂ • 40–50% P₂O₅ (gipssiz)', 'Ca₃(PO₄)₂ • 10%', 'CaHPO₄ • 30%', 'CaSO₄ • 20%'],
    togri: 0,
    izoh: 'Ca₃(PO₄)₂ + 4H₃PO₄ = 3Ca(H₂PO₄)₂ (ballastsiz).',
  },
  {
    belgi: 'Minerallar',
    savol: 'Silvinit va kainit formulalari:',
    variantlar: ['K₂SO₄ va KNO₃', 'K₂CO₃ va NaOH', 'NaCl va CaCl₂', 'KCl·NaCl va MgSO₄·KCl·3H₂O'],
    togri: 3,
    izoh: 'Silvinit KCl·NaCl, Kainit MgSO₄·KCl·3H₂O.',
  },
  {
    belgi: 'Masala 1',
    savol: '40% li Ca(H₂PO₄)₂ dan 1 t P₂O₅ olish uchun necha tonna o\'g\'it kerak?',
    variantlar: ['1,0 t', '4,117 t', '2,5 t', '1,647 t'],
    togri: 1,
    izoh: '234/142 = 1,647 t sof tuz → 1,647/0,40 = 4,117 t.',
  },
  {
    belgi: 'Masala 2',
    savol: '75% KCl dan iborat 1 t o\'g\'itda necha kg K₂O bor?',
    variantlar: ['750 kg', '473,3 kg K₂O (47,33%)', '500 kg', '940 kg'],
    togri: 1,
    izoh: '750 kg KCl · 94 / 149 = 473,3 kg K₂O.',
  },
  {
    belgi: '5-savol (193-b)',
    savol: '40 t NH₄NO₃ uchun ("Farg\'onaazot") HNO₃ va NH₃ sarfi:',
    variantlar: ['10 t va 1000 m³', '40 t va 500 m³', '63 t va 22 400 m³', '31,5 t HNO₃ va 11 200 m³ NH₃'],
    togri: 3,
    izoh: '500 kmol · 63 = 31,5 t HNO₃; 500 · 22,4 = 11 200 m³.',
  },
  {
    belgi: 'Pretsipitat',
    savol: 'Pretsipitat qaysi modda va suvda eruvchanligi qanday?',
    variantlar: ['CaHPO₄·2H₂O (zaif kislotada eriydi, 30–35% P₂O₅)', 'KNO₃', 'Ca₃(PO₄)₂', '(NH₄)₂SO₄'],
    togri: 0,
    izoh: 'H₃PO₄ + Ca(OH)₂ → CaHPO₄·2H₂O.',
  },
  {
    belgi: 'Xlor xavfi',
    savol: 'Qaysi ekinlarga KCl EMAS, K₂SO₄ / kul K₂CO₃ / KNO₃ beriladi?',
    variantlar: ['Faqat bug\'doyga', 'Sholi va makkajo\'xori', 'Kartoshka, zig\'ir, tamaki, uzum, sitrus', 'Barcha begona o\'tlarga'],
    togri: 2,
    izoh: 'Cl⁻ bu ekinlarda kraxmal va qand sifatini pasaytiradi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '191-bet: 40% Ca(H₂PO₄)₂ → 4,117 t',
    vazifa: 'Bosqichlarni tartiblang:',
    tartib: [
      '1. M(Ca(H₂PO₄)₂) = 234; M(P₂O₅) = 142',
      '2. 1 t P₂O₅ ga sof tuz: 234/142 = 1,647 t',
      '3. O\'g\'itda tuz ulushi w = 0,40',
      '4. m_ogit = 1,647 / 0,40 = 4,117 t',
    ],
    variantlar: [
      '3. O\'g\'itda tuz ulushi w = 0,40',
      '1. M(Ca(H₂PO₄)₂) = 234; M(P₂O₅) = 142',
      '4. m_ogit = 1,647 / 0,40 = 4,117 t',
      '2. 1 t P₂O₅ ga sof tuz: 234/142 = 1,647 t',
    ],
  },
  {
    tur: '192-bet: 1 t 75% KCl → 473,3 kg K₂O',
    vazifa: 'Hisob qadamlarini tartiblang:',
    tartib: [
      '1. m(KCl) = 1000 · 0,75 = 750 kg',
      '2. 2KCl (2·74,5 = 149) → 1K₂O (94)',
      '3. X = 750 · 94 / 149',
      '4. Javob: 473,3 kg K₂O (47,33%)',
    ],
    variantlar: [
      '2. 2KCl (2·74,5 = 149) → 1K₂O (94)',
      '4. Javob: 473,3 kg K₂O (47,33%)',
      '1. m(KCl) = 1000 · 0,75 = 750 kg',
      '3. X = 750 · 94 / 149',
    ],
  },
  {
    tur: '193-bet: 40 t NH₄NO₃ ("Farg\'onaazot")',
    vazifa: 'Hisob tartibini tuzing:',
    tartib: [
      '1. NH₃ + HNO₃ = NH₄NO₃ (1:1:1)',
      '2. n = 40 000 / 80 = 500 kmol',
      '3. m(HNO₃) = 500 · 63 = 31,5 t',
      '4. V(NH₃) = 500 · 22,4 = 11 200 m³',
    ],
    variantlar: [
      '3. m(HNO₃) = 500 · 63 = 31,5 t',
      '4. V(NH₃) = 500 · 22,4 = 11 200 m³',
      '1. NH₃ + HNO₃ = NH₄NO₃ (1:1:1)',
      '2. n = 40 000 / 80 = 500 kmol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Natriy selitra (NaNO₃, M=85) dagi % N:',
    variantlar: ['35%', '16,4% (16,47%)', '46%', '82,35%'],
    togri: 1,
    izoh: '14 / 85 × 100% = 16,47%.',
  },
  {
    savol: 'Oddiy superfosfatda ballasti bo\'lgan modda:',
    variantlar: ['NaCl', 'SiO₂', 'K₂CO₃', 'Gips (CaSO₄·2H₂O)'],
    togri: 3,
    izoh: 'Oddiy superfosfat tarkibida gips bor (14–20% P₂O₅).',
  },
  {
    savol: 'Ammofos formulasi va oziqa elementlari:',
    variantlar: ['NH₄H₂PO₄ + (NH₄)₂HPO₄ (N va P)', 'Ca(H₂PO₄)₂', 'KCl + NaNO₃', 'CO(NH₂)₂'],
    togri: 0,
    izoh: 'Ortofosfat kislota va ammiakdan olinadi.',
  },
  {
    savol: 'Qaysi fosforli o\'g\'it faqat kislotali tuproqlarga solinadi?',
    variantlar: ['Qo\'sh superfosfat', 'Ammofos', 'Fosforit talqoni Ca₃(PO₄)₂', 'NaNO₃'],
    togri: 2,
    izoh: 'Suvda erimaydi, kislotali tuproqda eriydi.',
  },
  {
    savol: 'Yog\'och kulidagi asosiy kaliyli birikma:',
    variantlar: ['KOH', 'KCl', 'Potaš (K₂CO₃)', 'KClO₃'],
    togri: 2,
    izoh: 'K₂CO₃ xlorsiz kaliyli o\'g\'it.',
  },
  {
    savol: 'Karbamid sintezi tenglamasi:',
    variantlar: ['CO₂ + 2NH₃ → CO(NH₂)₂ + H₂O', 'N₂ + H₂ → NH₃', 'NH₃ + HNO₃ → NH₄NO₃', 'P₂O₅ + H₂O'],
    togri: 0,
    izoh: '46% N tutuvchi eng boy qattiq o\'g\'it.',
  },
  {
    savol: 'Ammofos va superfosfat chiqaradigan "O\'zkimyosanoat" zavodi:',
    variantlar: ['Dehqonobod', '"Samarqandkimyo" AJ', 'Toshkent lak', 'Olmaliq'],
    togri: 1,
    izoh: '189-bet: "Samarqandkimyo" AJ.',
  },
  {
    savol: 'G\'o\'za defoliantlari va NH₄NO₃ chiqaruvchi zavod:',
    variantlar: ['Dehqonobod', 'Asaka', 'Buxoro', '"Farg\'onaazot" AJ'],
    togri: 3,
    izoh: '189-bet: "Farg\'onaazot" AJ.',
  },
];

export default function S8Mavzu43() {
  const korgazmalar = [
    { nom: '1. Zavodlar & Azotli', ikon: 'kolba', komponent: <KorgazmaAzotliVaZavodlar /> },
    { nom: '2. Fosforli o\'g\'itlar', ikon: 'kristall', komponent: <KorgazmaFosforliOgitlar /> },
    { nom: '3. Kaliyli & Xlorsiz', ikon: 'tomchi', komponent: <KorgazmaKaliyliOgitlar /> },
    { nom: '4. NaNO₃ & 4,117 t', ikon: 'formula', komponent: <Korgazma43MasalalarA /> },
    { nom: '5. 473,3 kg & 40 t', ikon: 'qidiruv', komponent: <Korgazma43MasalalarB /> },
    { nom: '6. P/K qiyos & Tuproq', ikon: 'grafik', komponent: <Korgazma43Solishtirish /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-43"
          nom="Asosiy o'g'itlarni guruhlang"
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
          key="tezkor-43"
          nom="43-§: Asosiy o'g'itlar"
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
          key="zanjir-43"
          nom="O'g'it hisoblari zanjiri"
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
          key="duel-43"
          sarlavha="43-§: Asosiy o'g'itlar"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="43-§"
      mavzuNom="Eng muhim asosiy mineral o'g'itlar"
      oldingiRaqam="42-§"
      oldingiNom="Mineral o'g'itlar"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
