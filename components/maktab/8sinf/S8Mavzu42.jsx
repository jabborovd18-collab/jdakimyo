'use client';
// ============================================================
// JDA KIMYO - 8-SINF, VI BOB, 42-PARAGRAF
// "Mineral o'g'itlar" (Darslik 185-188-betlar)
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
function KorgazmaMakroMikro() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Makroelementlar (NPK) va Mikroelementlar"
      ikon="atom"
      variantlar={[
        {
          id: 'makro',
          tugma: 'Makro (C,O,H + NPK)',
          formula: 'Havo CO₂ + H₂O (C,O,H)  |  Tuproq: N, P, K, S, Mg, Ca',
          tur: 'biogen',
          cfg: {
            sarlavha: '9 ta makroelement va asosiy NPK uchligi',
            tenglama: 'NH₄⁺ / NO₃⁻ (N)  •  H₂PO₄⁻ (P)  •  K⁺ (K)',
            markazBelgi: 'NPK',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'C, O, H (Havo/Suv)', belgi: 'CO₂+H₂O', rang: '#38bdf8' },
              { nom: 'Azot (N — o\'sish)', belgi: 'NH₄⁺,NO₃⁻', rang: '#22c55e' },
              { nom: 'Fosfor (P — meva)', belgi: 'H₂PO₄⁻', rang: '#fbbf24' },
              { nom: 'Kaliy (K — poya)', belgi: 'K⁺', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Shuningdek', v: 'S, Mg, Ca (tuproqdan)', rang: '#94a3b8' }],
          },
          pastki: ['C, O, H havo va suvdan olinadi', 'N: oqsil va barg; P: ildiz va meva', 'K: fotosintez, shakar va poya'],
        },
        {
          id: 'mikro',
          tugma: 'Mikro (<0,001%)',
          formula: 'Fe, Mn, B, Cu, Zn, Mo, Co — fermentlar faolligi',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Mikroelementlar (0,001% dan kam, ammo zarur!)',
            tenglama: 'Yetishmasa kasalliklar va hosil kamayishi kelib chiqadi',
            markazBelgi: '<0,001%',
            markazRang: '#fbbf24',
            tugunlar: [
              { nom: 'Temir & Marganes', belgi: 'Fe, Mn', rang: '#f97316' },
              { nom: 'Bor & Mis', belgi: 'B, Cu', rang: '#38bdf8' },
              { nom: 'Rux & Molibden', belgi: 'Zn, Mo', rang: '#a855f7' },
              { nom: 'Kobalt', belgi: 'Co', rang: '#ec4899' },
            ],
            belgilar: [{ k: 'Soni', v: '7 ta asosiy mikroelement', rang: '#fbbf24' }],
          },
          pastki: ['Miqdori < 0,001%', 'Fe, Mn, B, Cu, Zn, Mo, Co', 'Ferment va xlorofill sintezida'],
        },
      ]}
    />
  );
}

function KorgazmaOlimlarTasnif() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Yu.Libix (1840), M.N.Nabiyev va Tasnif"
      ikon="grafik"
      variantlar={[
        {
          id: 'olimlar',
          tugma: 'Libix & Nabiyev',
          formula: 'Yu.Libix (1840)  •  Akad. M.N.Nabiyev (1915–1995)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Agrokimyo poydevorichilari (186-bet)',
            tenglama: 'Yu.Libix (mineral oziqlanish, 1840)  |  M.N.Nabiyev (Qoraqat fosforitlari)',
            markazBelgi: '1840',
            markazRang: '#38bdf8',
            tugunlar: [
              { nom: 'Yu.Libix (Germaniya)', belgi: 'Mineral nazariya', rang: '#38bdf8' },
              { nom: 'M.N.Nabiyev', belgi: 'O\'g\'itlar maktabi', rang: '#34d399' },
              { nom: 'Qoraqat koni', belgi: 'Fosforit tadqiqi', rang: '#fbbf24' },
              { nom: 'Defoliantlar', belgi: 'Murakkab o\'g\'it', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'Baholash', v: '% N, % P₂O₅, % K₂O', rang: '#34d399' }],
          },
          pastki: ['1840: Yu.Libix mineral oziqlanish nazariyasi', 'Akad. M.N.Nabiyev (1915–1995) O\'zbekiston maktabi', 'Oziqa ulushi: % N, % P₂O₅, % K₂O'],
        },
        {
          id: 'tasnif',
          tugma: 'Oddiy vs Kompleks',
          formula: 'Oddiy (1 element) vs Kompleks (2–3 element)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Mineral o\'g\'itlarning tarkibiy tasnifi',
            tenglama: 'Oddiy: NaNO₃, KCl, superfosfat  |  Kompleks: KNO₃, Ammofos, Nitroammofoska',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'Oddiy (N/P/K)', qiymat: 33, yorliq: '1 ta element', rang: '#38bdf8' },
              { nom: 'Ikki el. (KNO₃/Ammofos)', qiymat: 67, yorliq: '2 element (NK, NP)', rang: '#fbbf24' },
              { nom: 'Uch el. (Nitroammofoska)', qiymat: 100, yorliq: '3 element (NPK)', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Sifat mezoni', v: '%N, %P₂O₅, %K₂O', rang: '#34d399' }],
          },
          pastki: ['Oddiy: NH₄NO₃, CO(NH₂)₂, superfosfat, KCl', 'Kompleks: KNO₃ (N+K), ammofos (N+P)', 'Uchlik: nitroammofoska (N+P+K)'],
        },
      ]}
    />
  );
}

function Korgazma24Jadval() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 24-jadval: Oziqa elementlari ulushi (%)"
      ikon="grafik"
      variantlar={[
        {
          id: 'azotli',
          tugma: 'Azotli (% N)',
          formula: 'Karbamid 46% > NH₄NO₃ 35% > (NH₄)₂SO₄ 21% > NaNO₃ 16%',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '24-jadval: Qattiq azotli o\'g\'itlarda % N (187-bet)',
            tenglama: 'CO(NH₂)₂ — qattiq azotli o\'g\'itlar rekordi (46% N)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'CO(NH₂)₂', qiymat: 92, yorliq: '46% N', rang: '#34d399' },
              { nom: 'NH₄NO₃', qiymat: 70, yorliq: '35% N', rang: '#38bdf8' },
              { nom: '(NH₄)₂SO₄', qiymat: 42, yorliq: '20–21% N', rang: '#fbbf24' },
              { nom: 'NaNO₃ / KNO₃', qiymat: 32, yorliq: '16% / 13% N', rang: '#a855f7' },
            ],
            belgilar: [{ k: 'KNO₃ da yana', v: '+ 44% K₂O (kompleks)', rang: '#34d399' }],
          },
          pastki: ['Karbamid CO(NH₂)₂: 46% N', 'Ammoniy nitrat NH₄NO₃: 35% N', 'Ammoniy sulfat: 20–21% N'],
        },
        {
          id: 'fosfor_kaliy',
          tugma: 'Fosforli & Kaliyli',
          formula: 'KCl 52–60% K₂O  •  Qo\'sh 40–50% P₂O₅  •  Ammofos 52% P₂O₅',
          tur: 'muvozanat',
          cfg: {
            sarlavha: '24-jadval: Fosforli (% P₂O₅) va Kaliyli (% K₂O) o\'g\'itlar',
            tenglama: 'Oddiy (~20%) vs Qo\'sh (~45%)  |  Ammofos: 46–52% P₂O₅ + 11–12% N',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'KCl (% K₂O)', qiymat: 95, yorliq: '52–60%', rang: '#a855f7' },
              { nom: 'Ammofos (P₂O₅)', qiymat: 82, yorliq: '46–52%', rang: '#fbbf24' },
              { nom: 'Qo\'sh superfos.', qiymat: 72, yorliq: '40–50%', rang: '#34d399' },
              { nom: 'Oddiy superfos.', qiymat: 33, yorliq: '14–20%', rang: '#94a3b8' },
            ],
            belgilar: [{ k: 'Ammofos', v: '+ 11–12% N', rang: '#38bdf8' }],
          },
          pastki: ['KCl: 52–60% K₂O', 'Qo\'sh superfosfat: 40–50% P₂O₅', 'Ammofos: 46–52% P₂O₅ + 12% N'],
        },
      ]}
    />
  );
}

function KorgazmaNPKDiagnostika() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. NPK tanqisligi belgilari va ekologiya"
      ikon="tomchi"
      variantlar={[
        {
          id: 'tanqislik',
          tugma: 'NPK tanqisligi',
          formula: 'N (sarg\'ayish)  •  P (binafsha)  •  K (cheti kuyishi)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'O\'simlik barglari bo\'yicha oziqa tanqisligini aniqlash',
            tenglama: 'Me\'yorli NPK → sog\'lom yashil barg, kuchli ildiz va mo\'l hosil',
            markazBelgi: 'Barg',
            markazRang: '#22c55e',
            tugunlar: [
              { nom: 'N kam: sarg\'ish barg', belgi: 'Xloroz', rang: '#fde047' },
              { nom: 'P kam: binafsha tus', belgi: 'Kechikish', rang: '#a855f7' },
              { nom: 'K kam: cheti qurishi', belgi: 'Nozik poya', rang: '#f97316' },
              { nom: 'Me\'yor: to\'q yashil', belgi: 'Yuqori hosil', rang: '#34d399' },
            ],
            belgilar: [{ k: 'Kuzatuv', v: 'Pastki eski barglardan boshlanadi', rang: '#fbbf24' }],
          },
          pastki: ['N yetishmasa: barg och-yashil/sarg\'ish', 'P yetishmasa: binafsha tus, kech meva', 'K yetishmasa: barg cheti qo\'ng\'irlashadi'],
        },
        {
          id: 'ekologiya',
          tugma: 'Me\'yor & Evtrofikatsiya',
          formula: 'Ortiqcha N → sabzavotda NO₃⁻  |  Yuvilgan NP → evtrofikatsiya',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'O\'g\'it me\'yorini oshirish xavfi: nitratlar va suv gullashi',
            tenglama: 'Ortiqcha NO₃⁻ zaharlaydi  |  Daryoda suv o\'tlari kislorodni yutadi',
            suyuqlikRang: '#22c55e',
            tolish: 0.72,
            stakanBelgi: 'Suv o\'ti ↑ (NO₃⁻/PO₄³⁻)',
            stakanSarlavha: 'Evtrofikatsiya xavfi',
            gazRang: '#ef4444',
            gazBelgi: 'O₂ ↓',
            belgilar: [{ k: 'Qoida', v: 'Ilmiy me\'yor & muddat', rang: '#34d399' }],
          },
          pastki: ['Polizlarda ortiqcha NO₃⁻ zaharli', 'Suv havzalarida evtrofikatsiya (baliqlar nobud bo\'ladi)', 'Tuproq analizi asosida beriladi'],
        },
      ]}
    />
  );
}

function Korgazma42MasalalarA() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 188-bet 5-savol: w(N) kamayish tartibi"
      ikon="formula"
      variantlar={[
        {
          id: 'tartib_n',
          tugma: 'NH₃ > NH₄OH > NH₄NO₃',
          formula: '82,35% > 40,00% > 35,00% > 21,21%',
          tur: 'hisob',
          cfg: {
            sarlavha: '188-bet 5-savol: To\'rtta moddada w(N) kamayish tartibi',
            tenglama: 'NH₃ (14/17) > NH₄OH (14/35) > NH₄NO₃ (28/80) > (NH₄)₂SO₄ (28/132)',
            qadamlar: [
              { belgi: '1. NH₃ (17)', natija: '82,35%', izoh: '14/17 · 100%', rang: '#34d399' },
              { belgi: '2. NH₄OH (35)', natija: '40,00%', izoh: '14/35 · 100%', rang: '#38bdf8' },
              { belgi: '3. NH₄NO₃ / (NH₄)₂SO₄', natija: '35% / 21,21%', izoh: '28/80 va 28/132', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'NH₃', foiz: 82.4, qiymat: '82,35%', rang: '#34d399' },
              { nom: 'NH₄OH', foiz: 40.0, qiymat: '40,00%', rang: '#38bdf8' },
              { nom: 'NH₄NO₃', foiz: 35.0, qiymat: '35,00%', rang: '#fbbf24' },
              { nom: '(NH₄)₂SO₄', foiz: 21.2, qiymat: '21,21%', rang: '#a855f7' },
            ],
            javobBadge: 'NH₃ > NH₄OH > NH₄NO₃ > (NH₄)₂SO₄',
          },
          pastki: ['NH₃: 14/17 = 82,35%', 'NH₄OH: 14/35 = 40,0%', 'NH₄NO₃: 35%; (NH₄)₂SO₄: 21,21%'],
        },
        {
          id: 'karbamid_kno3',
          tugma: 'Karbamid & KNO₃',
          formula: 'CO(NH₂)₂: 46,67% N  |  KNO₃: 13,86% N + 46,5% K₂O',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Karbamid (M=60) va Kaliy nitrat (M=101) tarkibi',
            tenglama: 'CO(NH₂)₂: 28/60 = 46,67% N   |   KNO₃: 14/101 = 13,86% N',
            qadamlar: [
              { belgi: 'M(CO(NH₂)₂)', natija: '60 g/mol', izoh: '12+16+2·16', rang: '#34d399' },
              { belgi: 'w(N) karbamid', natija: '46,67%', izoh: '28 / 60 (~46%)', rang: '#38bdf8' },
              { belgi: 'w(N) KNO₃ (101)', natija: '13,86%', izoh: '14/101 (+44% K₂O)', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Karbamid % N', foiz: 46.7, qiymat: '46,67%', rang: '#34d399' },
              { nom: 'KNO₃ % N', foiz: 13.9, qiymat: '13,86%', rang: '#fbbf24' },
              { nom: 'KNO₃ % K₂O', foiz: 46.5, qiymat: '~46%', rang: '#a855f7' },
            ],
            javobBadge: 'Karbamid = 46,67% N; KNO₃ = 13,86% N + K₂O',
          },
          pastki: ['Karbamid: M=60 → 28/60 = 46,67%', 'Qattiq azotli o\'g\'itlar rekordi', 'KNO₃: kompleks (N + K)'],
        },
      ]}
    />
  );
}

function Korgazma42MasalalarB() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Dala me&apos;yori (2 t NH₄NO₃) va Ammofos"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'gektar',
          tugma: '10 ga → 2 t selitra',
          formula: '70 kg N/ga × 10 ga = 700 kg N  →  700 / 0,35 = 2000 kg',
          tur: 'hisob',
          cfg: {
            sarlavha: '10 gektar maydonga ammoniy selitra (35% N) sarfi',
            tenglama: '100 kg NH₄NO₃ = 35 kg N   |   700 kg N uchun = 2000 kg (2 t)',
            qadamlar: [
              { belgi: 'Talab (10 ga·70)', natija: '700 kg N', izoh: 'Sof azot', rang: '#38bdf8' },
              { belgi: 'w(N) selitra', natija: '35% (0,35)', izoh: '28 / 80', rang: '#fbbf24' },
              { belgi: 'm = 700 / 0,35', natija: '2000 kg', izoh: '2 tonna NH₄NO₃', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Sof azot (N)', foiz: 35, qiymat: '700 kg', rang: '#38bdf8' },
              { nom: 'NH₄NO₃ (35% N)', foiz: 100, qiymat: '2000 kg (2 t)', rang: '#34d399' },
            ],
            javobBadge: 'Javob: 2000 kg (2 tonna) NH₄NO₃',
          },
          pastki: ['100 kg NH₄NO₃ da 35 kg N bor', '10 ga × 70 kg/ga = 700 kg sof N', '700 / 0,35 = 2000 kg (2 t)'],
        },
        {
          id: 'ammofos',
          tugma: 'Ammofos (NH₄H₂PO₄)',
          formula: 'M = 115  •  N = 12,17%  •  P = 26,96% (52% P₂O₅)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ammofos NH₄H₂PO₄ va KNO₃ — kompleks o\'g\'itlar tahlili',
            tenglama: 'NH₄H₂PO₄: 14/115 = 12,17% N va 31/115 = 26,96% P',
            qadamlar: [
              { belgi: 'M(NH₄H₂PO₄)', natija: '115 g/mol', izoh: '14+6+31+64', rang: '#fbbf24' },
              { belgi: 'w(N) / w(P)', natija: '12,17% / 26,96%', izoh: 'Suvda eruvchan', rang: '#34d399' },
              { belgi: 'KNO₃ xossasi', natija: 'Xlorsiz', izoh: 'Uzum, kartoshka, tamaki', rang: '#a855f7' },
            ],
            taqqosBars: [
              { nom: 'w(N) Ammofos', foiz: 12.2, qiymat: '12,17%', rang: '#38bdf8' },
              { nom: 'w(P) Ammofos', foiz: 27.0, qiymat: '26,96%', rang: '#34d399' },
              { nom: 'P₂O₅ ekvivalent', foiz: 52.0, qiymat: '46–52%', rang: '#fbbf24' },
            ],
            javobBadge: 'Ammofos = N + P; KNO₃ = N + K (xlorsiz)',
          },
          pastki: ['Ammofos: 12,17% N va 26,96% P', 'KNO₃ xlorsiz (N + K)', 'Tamaki, uzum, sitrus uchun ideal'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (41-§) VA O'YINLAR (42-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'P₂O₅ sovuq va qaynoq suvda qaysi kislotalarni hosil qiladi?',
    variantlar: [
      { matn: 'Sovuq: H₃PO₄; Qaynoq: H₄P₂O₇', togri: false },
      { matn: 'Ikkalasida HPO₃', togri: false },
      { matn: 'Sovuq: 2HPO₃; Qaynoq: 2H₃PO₄', togri: true },
      { matn: 'Reaksiyaga kirishmaydi', togri: false },],
    izoh: 'Sovuqda zaharli metafosfat HPO₃, issiqda H₃PO₄.',
  },
  {
    id: 't2',
    savol: 'PO₄³⁻ ioniga AgNO₃ qo\'shilganda qanday rangli cho\'kma tushadi?',
    variantlar: [
      { matn: 'Sariq Ag₃PO₄↓ (HNO₃ da eriydi)', togri: true },
      { matn: 'Oq AgCl↓', togri: false },
      { matn: 'Qizil cho\'kma', togri: false },
      { matn: 'Cho\'kma tushmaydi', togri: false },],
    izoh: '3AgNO₃ + H₃PO₄ = Ag₃PO₄↓ (sariq) + 3HNO₃.',
  },
  {
    id: 't3',
    savol: 'Fosforni "Hayot va tafakkur elementi" deb kim atagan?',
    variantlar: [
      { matn: 'X.Brendt', togri: false },
      { matn: 'Yu.Libix', togri: false },
      { matn: 'A.Shretter', togri: false },
      { matn: 'A.Yu.Fersman', togri: true },],
    izoh: 'Akademik A.Yu.Fersman ta\'rifi.',
  },
  {
    id: 't4',
    savol: '100 g 93% Ca₃(PO₄)₂ dan necha gramm 40% H₃PO₄ olinadi?',
    variantlar: [
      { matn: '58,8 g', togri: false },
      { matn: '147 g', togri: true },
      { matn: '310 g', togri: false },
      { matn: '98 g', togri: false },],
    izoh: '0,3 mol → 0,6 mol (58,8 g) / 0,40 = 147 g.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'makro_mikro', nom: 'Makro & Mikro', tavsif: 'NPK, C O H, 7 ta mikro' },
    { id: 'olim_tasnif', nom: 'Olim & Tasnif', tavsif: 'Libix, Nabiyev, Kompleks' },
    { id: 'jadval_24', nom: '24-jadval & Me\'yor', tavsif: '46%, 52–60%, evtrofikatsiya' },
  ],
  topshiriqlar: [
    { nom: 'C, O, H (CO₂/H₂O) + N, P, K', qisqa: 'Asosiy makroelementlar', guruh: 'makro_mikro', izoh: 'S, Mg, Ca ham makroelement.' },
    { nom: 'Fe, Mn, B, Cu, Zn, Mo, Co', qisqa: 'Mikroelement (<0,001%)', guruh: 'makro_mikro', izoh: 'Fermentlar va o\'sish uchun zarur.' },
    { nom: 'N: sarg\'ish; P: binafsha; K: kuyish', qisqa: 'Bargda tanqislik belgilari', guruh: 'makro_mikro', izoh: 'NPK yetishmasligini ko\'rsatadi.' },
    { nom: 'Yu.Libix (1840) & M.N.Nabiyev', qisqa: 'Agrokimyo asoschilari', guruh: 'olim_tasnif', izoh: 'Qoraqat fosforitlari va defoliantlar.' },
    { nom: 'NaNO₃, superfosfat, KCl', qisqa: 'Oddiy o\'g\'itlar (1 el.)', guruh: 'olim_tasnif', izoh: 'Faqat bitta oziqa elementi.' },
    { nom: 'KNO₃ (N+K) & Ammofos (N+P)', qisqa: 'Kompleks o\'g\'itlar (2–3 el.)', guruh: 'olim_tasnif', izoh: 'Nitroammofoska esa N+P+K.' },
    { nom: 'Karbamid CO(NH₂)₂ — 46% N', qisqa: 'Qattiq N o\'g\'it rekordi', guruh: 'jadval_24', izoh: '24-jadval: NH₄NO₃ 35%.' },
    { nom: 'KCl 52–60% K₂O; Qo\'sh 40–50% P₂O₅', qisqa: 'Konsentrlangan o\'g\'itlar', guruh: 'jadval_24', izoh: 'Oddiy superfosfat ~20% P₂O₅.' },
    { nom: 'Ortiqcha NO₃⁻ va suv gullashi', qisqa: 'Evtrofikatsiya xavfi', guruh: 'jadval_24', izoh: 'Me\'yorida qo\'llash shart.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Mikroelement',
    savol: 'Qaysi qatorda faqat MIKROELEMENTLAR berilgan?',
    variantlar: ['N, P, Ca, Mg, S', 'C, O, H, N, P, K', 'Fe, Mn, B, Cu, Zn, Mo, Co', 'Na, Cl, Si, Al'],
    togri: 2,
    izoh: 'Miqdori < 0,001%: Fe, Mn, B, Cu, Zn, Mo, Co.',
  },
  {
    belgi: '24-jadval',
    savol: 'Qattiq azotli o\'g\'itlar orasida % N eng yuqorisi:',
    variantlar: ['Karbamid CO(NH₂)₂ (46% N)', 'NaNO₃ (16%)', '(NH₄)₂SO₄ (21%)', 'KNO₃ (13%)'],
    togri: 0,
    izoh: 'Karbamid tarkibida 46% N (aniq 46,67%) bor.',
  },
  {
    belgi: '5-savol (188-b)',
    savol: 'w(N) kamayish tartibi qaysi qatorda to\'g\'ri?',
    variantlar: ['(NH₄)₂SO₄ > NH₄NO₃ > NH₃', 'NH₄NO₃ > NH₃ > NH₄OH', 'Teng', 'NH₃ (82,4%) > NH₄OH (40%) > NH₄NO₃ (35%) > (NH₄)₂SO₄ (21,2%)'],
    togri: 3,
    izoh: '14/17 > 14/35 > 28/80 > 28/132.',
  },
  {
    belgi: 'Olimlar',
    savol: '1840-yil mineral nazariya va O\'zbekiston o\'g\'it maktabi asoschilari:',
    variantlar: ['Mendeleyev va Brendt', 'Yu.Libix (1840) va akad. M.N.Nabiyev', 'Fersman va Lomonosov', 'Bridjmen va Shretter'],
    togri: 1,
    izoh: 'Yu.Libix (Germaniya) va M.N.Nabiyev (O\'zbekiston).',
  },
  {
    belgi: 'Kompleks',
    savol: 'Qaysilar KOMPLEKS (ko\'p elementli) o\'g\'it?',
    variantlar: ['Faqat NaNO₃ va KCl', 'KNO₃ (N+K) va Ammofos NH₄H₂PO₄ (N+P)', 'Oddiy superfosfat', 'Ca₃(PO₄)₂'],
    togri: 1,
    izoh: 'Kamida 2 ta asosiy oziqa elementi saqlaydi.',
  },
  {
    belgi: 'Kaliy (K)',
    savol: 'Fotosintez, shakar to\'planishi va poyani mustahkamlaydigan element:',
    variantlar: ['Molibden', 'Xlor', 'Natriy', 'Kaliy (K)'],
    togri: 3,
    izoh: 'Kaliy ildizmeva va poyaga mustahkamlik beradi.',
  },
  {
    belgi: 'Ionlar',
    savol: 'O\'simliklar azot va fosforni tuproqdan qaysi ionlar holida oladi?',
    variantlar: ['NH₄⁺, NO₃⁻ va H₂PO₄⁻', 'K⁺ va Cl⁻', 'N₂ gazi va P₄', 'HNO₃ bug\'lari'],
    togri: 0,
    izoh: 'Ammoniy, nitrat va digidrofosfat ionlari.',
  },
  {
    belgi: 'Superfosfat',
    savol: 'Oddiy va qo\'sh superfosfatda % P₂O₅ ulushi:',
    variantlar: ['1% va 5%', '50% va 90%', 'Oddiy ~20% (14–20%), Qo\'sh ~40% (40–50%)', '5% va 10%'],
    togri: 2,
    izoh: '24-jadval (187-bet): 20% va 40% P₂O₅.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '188-bet 5-savol: w(N) kamayish tartibi',
    vazifa: 'Azot ulushi bo\'yicha tartiblang:',
    tartib: [
      '1. NH₃ (M=17): w(N) = 14/17 = 82,35%',
      '2. NH₄OH (M=35): w(N) = 14/35 = 40,00%',
      '3. NH₄NO₃ (M=80): w(N) = 28/80 = 35,00%',
      '4. (NH₄)₂SO₄ (M=132): w(N) = 28/132 = 21,21%',
    ],
    variantlar: [
      '3. NH₄NO₃ (M=80): w(N) = 28/80 = 35,00%',
      '1. NH₃ (M=17): w(N) = 14/17 = 82,35%',
      '4. (NH₄)₂SO₄ (M=132): w(N) = 28/132 = 21,21%',
      '2. NH₄OH (M=35): w(N) = 14/35 = 40,00%',
    ],
  },
  {
    tur: '10 gektar maydonga selitra (2 t)',
    vazifa: 'Hisob qadamlarini tartiblang:',
    tartib: [
      '1. w(N) NH₄NO₃ = 28 / 80 = 35%',
      '2. 10 ga × 70 kg/ga = 700 kg sof azot',
      '3. m(selitra) = 700 / 0,35 = 2000 kg',
      '4. Javob: 2 tonna ammoniy selitra',
    ],
    variantlar: [
      '2. 10 ga × 70 kg/ga = 700 kg sof azot',
      '4. Javob: 2 tonna ammoniy selitra',
      '1. w(N) NH₄NO₃ = 28 / 80 = 35%',
      '3. m(selitra) = 700 / 0,35 = 2000 kg',
    ],
  },
  {
    tur: 'Karbamid CO(NH₂)₂ tahlili',
    vazifa: 'Formula hisobini tartiblang:',
    tartib: [
      '1. Atomlar: C(12)+O(16)+2N(28)+4H(4)',
      '2. Molyar massa M = 60 g/mol',
      '3. w(N) = 28 / 60 · 100% = 46,67%',
      '4. Eng boy qattiq azotli o\'g\'it (~46%)',
    ],
    variantlar: [
      '3. w(N) = 28 / 60 · 100% = 46,67%',
      '4. Eng boy qattiq azotli o\'g\'it (~46%)',
      '1. Atomlar: C(12)+O(16)+2N(28)+4H(4)',
      '2. Molyar massa M = 60 g/mol',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Qaysi element yetishmasa barglar sarg\'ayib o\'sish to\'xtaydi?',
    variantlar: ['Kaliy (K)', 'Azot (N)', 'Kalsiy', 'Rux'],
    togri: 1,
    izoh: 'N — barg va oqsil o\'sishining asosi.',
  },
  {
    savol: 'Akad. M.N.Nabiyev qaysi kon fosforitlarini tadqiq etgan?',
    variantlar: ['Kola koni', 'Qizilqum tuzlari', 'Chili selitrasi', 'Qoraqat fosforitlari va murakkab o\'g\'itlar'],
    togri: 3,
    izoh: 'M.N.Nabiyev Qoraqat fosforitlarini qayta ishlagan.',
  },
  {
    savol: '24-jadval: Kaliy xlorid (KCl) dagi K₂O ulushi:',
    variantlar: ['52–60% K₂O', '20%', '10–15%', '90%'],
    togri: 0,
    izoh: 'Konsentrlangan kaliyli o\'g\'it — 52–60% K₂O.',
  },
  {
    savol: '24-jadval: NaNO₃ va KNO₃ dagi % N:',
    variantlar: ['46% va 50%', '35% va 30%', 'NaNO₃ 15–16%, KNO₃ 12–13%', '82% va 60%'],
    togri: 2,
    izoh: 'KNO₃ da qo\'shimcha 44% K₂O bor.',
  },
  {
    savol: '1840-yil "Kimyoning dehqonchilikka tadbiqi" muallifi:',
    variantlar: ['A.Yu.Fersman', 'M.N.Nabiyev', 'Yustus Libix', 'X.Brendt'],
    togri: 2,
    izoh: 'Nemis olimi Yu.Libix.',
  },
  {
    savol: '(NH₄)₂SO₄ dagi azotning aniq massa ulushi:',
    variantlar: ['21,21% (jadvalda 20–21%)', '46%', '35%', '82,35%'],
    togri: 0,
    izoh: '28 / 132 = 21,21% N.',
  },
  {
    savol: 'O\'simlik C, O, H ni qayerdan oladi?',
    variantlar: ['Nitratlardan', 'Havo (CO₂) va suvdan (H₂O)', 'Mineral o\'g\'itdan', 'Fosfatlardan'],
    togri: 1,
    izoh: 'Fotosintezda CO₂ va H₂O ishlatiladi.',
  },
  {
    savol: 'Qaysilar kompleks o\'g\'it hisoblanadi?',
    variantlar: ['NaNO₃ va KCl', 'Oddiy superfosfat', 'NH₄NO₃', 'KNO₃ (N+K), Ammofos (N+P), Nitroammofoska'],
    togri: 3,
    izoh: 'Bir nechta oziqa elementini saqlaydi.',
  },
];

export default function S8Mavzu42() {
  const korgazmalar = [
    { nom: '1. Makro & Mikroelement', ikon: 'atom', komponent: <KorgazmaMakroMikro /> },
    { nom: '2. Libix, Nabiyev & Tasnif', ikon: 'grafik', komponent: <KorgazmaOlimlarTasnif /> },
    { nom: '3. 24-jadval (% oziqa)', ikon: 'grafik', komponent: <Korgazma24Jadval /> },
    { nom: '4. NPK tanqisligi & Ekologiya', ikon: 'tomchi', komponent: <KorgazmaNPKDiagnostika /> },
    { nom: '5. w(N) tartibi & Karbamid', ikon: 'formula', komponent: <Korgazma42MasalalarA /> },
    { nom: '6. 2 t selitra & Ammofos', ikon: 'qidiruv', komponent: <Korgazma42MasalalarB /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-42"
          nom="Mineral o'g'itlarni guruhlang"
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
          key="tezkor-42"
          nom="42-§: Mineral o'g'itlar"
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
          key="zanjir-42"
          nom="w(N) & Dala me'yori zanjiri"
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
          key="duel-42"
          sarlavha="42-§: O'g'itlar dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="42-§"
      mavzuNom="Mineral o'g'itlar"
      oldingiRaqam="41-§"
      oldingiNom="Fosforning kislorodli birikmalari"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
