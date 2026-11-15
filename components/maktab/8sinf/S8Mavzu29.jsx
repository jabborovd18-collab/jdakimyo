'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 29-PARAGRAF
// "Kislorod guruhchasi elementlari" (Darslik 130-134-betlar)
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
function KorgazmaVIAElementlar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. VI A guruh (O, S, Se, Te, Po) tuzilishi (130–131-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 's_atom',
          tugma: 'Oltingugurt (3s²3p⁴3d⁰) vs O',
          formula: 'O (d yo\'q: -2, -1, +2) • S, Se, Te (d⁰ bor: -2, +2, +4, +6) • Po radioaktiv',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Xalkogenlar (ns²np⁴): Oltingugurt d-orbitalga o\'tib +4 va +6 beradi',
            tenglama: 'S (Z=16): 2, 8, 6 (...3s²3p⁴3d⁰)  |  Kislorod +4/+6 bermaydi (OF₂:+2, H₂O₂:-1)',
            rejim: 'atom',
            markaz: { belgi: '+16 S', rang: '#fde047', r: 24 },
            qavatlar: [2, 8, 6],
            metrikalar: [
              { nom: 'Tashqi elektron (ns²np⁴)', qiymat: '6 ta ē (-2..+6)', foiz: 75, rang: '#fde047' },
              { nom: 'O (Z=8, 2s²2p⁴)', qiymat: 'd-orbital yo\'q!', foiz: 45, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Se (34), Te (52)', v: '-2, +4 (SeO₂), +6 (TeO₃)', rang: '#fb923c' },
              { k: 'Po (Z=84)', v: 'Radioaktiv element', rang: '#c084fc' },
            ],
          },
          pastki: ['O d-orbitali yo\'q → OF₂(+2), H₂O₂(-1)', 'S, Se, Te d-orbitalga ko\'chib +4, +6 beradi', 'Po (Z=84) — radioaktiv xalkogen'],
        },
      ]}
    />
  );
}

function KorgazmaSTabiatVaFlotatsiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Oltingugurt minerallari va Flotatsiya (131–132-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'minerallar',
          tugma: 'Minerallar: Sulfid & Sulfat',
          formula: 'FeS₂, ZnS, Cu₂S, PbS • CaSO₄·2H₂O, MgSO₄·7H₂O, Na₂SO₄·10H₂O',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Tabiatda S (gaz, H₂S), sulfidlar (-2) va sulfatlar (+6)',
            tenglama: 'O\'zbekiston: gaz kondensati (toza S) va mis rudalarida (Se, Te bilan)',
            markazBelgi: 'S',
            markazRang: '#fde047',
            tugunlar: [
              { nom: 'Erkin & H₂S', belgi: 'S, H₂S', rang: '#fde047' },
              { nom: 'Sulfidlar (-2)', belgi: 'FeS₂, ZnS, Cu₂S, PbS', rang: '#34d399' },
              { nom: 'Sulfatlar (+6)', belgi: 'CaSO₄·2H₂O, MgSO₄·7H₂O', rang: '#38bdf8' },
              { nom: 'Glauber & Se,Te', belgi: 'Na₂SO₄·10H₂O', rang: '#fb923c' },
            ],
            belgilar: [
              { k: 'Taxir & Glauber', v: 'MgSO₄·7H₂O va Na₂SO₄·10H₂O', rang: '#38bdf8' },
              { k: 'Gips & Ruda', v: 'CaSO₄·2H₂O; pirit FeS₂, kinovar HgS', rang: '#34d399' },
            ],
          },
          pastki: ['Sulfidlar: FeS₂, ZnS, Cu₂S, PbS', 'Sulfatlar: Gips, Taxir tuz, Glauber tuzi', 'O\'zbekistonda gazdan toza S olinadi'],
        },
        {
          id: 'flotatsiya',
          tugma: 'Flotatsiya usuli (ρ=2 g/cm³)',
          formula: 'ρ(S)=2 g/cm³, lekin suvda ho\'llanmaydi → sirtda qalqib boyitiladi!',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Flotatsiya: og\'ir S kukuni suvda ho\'llanmay yuzada qalqiydi',
            tenglama: 'Oltingugurt kukuni yuzada qalqiydi  |  "Bekorchi jins" esa tubiga cho\'kadi',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Flotatsiya',
            stakanSarlavha: 'ρ = 2 g/cm³',
            reagentlar: [
              { belgi: 'S₈', rang: '#fde047' },
              { belgi: 'S₈', rang: '#fde047' },
            ],
            gazRang: '#fde047',
            gazBelgi: 'S qalqib chiqadi!',
            chokmaRang: '#64748b',
            chokmaBelgi: 'Bekorchi jins↓',
            belgilar: [
              { k: 'Zichlik', v: 'ρ = 2 g/cm³ (suvdan og\'ir!)', rang: '#38bdf8' },
              { k: 'Sababi', v: 'Suvda HO\'LLANMAYDI (gidrofob)', rang: '#fde047' },
            ],
          },
          pastki: ['Rombik S zichligi 2 g/cm³ bo\'lsa ham qalqiydi', 'Sababi: oltingugurt kukuni suvda ho\'llanmaydi', 'Bekorchi jins cho\'kadi — boyitish usuli!'],
        },
      ]}
    />
  );
}

function KorgazmaSAllotropiya() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Oltingugurt allotropiyasi: Rombik, Monoklinik, Plastik"
      ikon="kristall"
      variantlar={[
        {
          id: 's8',
          tugma: 'S₈ toj halqasi & Haroratlar',
          formula: 'Rombik S₈ (<95,5°C) • Monoklinik (>95,5°C) • Ts=112,8°C, Tq=444,5°C → Plastik Sn',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Rombik S₈ (limon-sariq), Monoklinik S₈ va Plastik Sn zanjiri',
            tenglama: 'Ts = 112,8°C   •   Tq = 444,5°C (sovuq suvga quyib Plastik Sn!)   •   CS₂ da eriydi',
            markaz: { belgi: 'S₈', rang: '#fde047', r: 22 },
            atomlar: [
              { belgi: 'S', rang: '#fde047', r: 13, masofa: 68, bog: 1, burchak: 0 },
              { belgi: 'S', rang: '#facc15', r: 13, masofa: 68, bog: 1, burchak: 1.05 },
              { belgi: 'S', rang: '#fde047', r: 13, masofa: 68, bog: 1, burchak: 2.1 },
              { belgi: 'S', rang: '#facc15', r: 13, masofa: 68, bog: 1, burchak: 3.14 },
              { belgi: 'S', rang: '#fde047', r: 13, masofa: 68, bog: 1, burchak: 4.19 },
              { belgi: 'S', rang: '#facc15', r: 13, masofa: 68, bog: 1, burchak: 5.24 },
            ],
            metrikalar: [
              { nom: 'Ts (suyuqlanish)', qiymat: '112,8°C', foiz: 30, rang: '#fde047' },
              { nom: 'Tq (qaynash)', qiymat: '444,5°C', foiz: 100, rang: '#fb923c' },
            ],
            belgilar: [
              { k: 'Rombik / Monokl.', v: '<95,5°C sariq / >95,5°C to\'q-sariq igna', rang: '#fde047' },
              { k: 'Plastik Sn', v: '444,5°C → sovuq suv (kauchukdek)', rang: '#fb923c' },
            ],
          },
          pastki: ['Rombik S₈ limon-sariq, CS₂ da eriydi', 'Monoklinik >95,5°C da barqaror ignasimon', '444,5°C dan sovuq suvga quyib plastik Sn'],
        },
      ]}
    />
  );
}

function KorgazmaSOksidlovchi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Oltingugurt — oksidlovchi: S⁰ + 2ē → S⁻² (132–133-b)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'met_h2_c',
          tugma: 'FeS (+2), HgS, H₂S, CS₂',
          formula: 'Fe+S=FeS (Cl₂ dek Fe⁺³ emas!) • Hg+S=HgS • H₂+S=H₂S↑ • C+2S=CS₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Metallar, vodorod va uglerod bilan S elektron olib (-2) oksidlovchi bo\'ladi',
            tenglama: '2Na+S=Na₂S  •  Zn+S=ZnS  •  Fe+S=FeS(+2)  •  2Li+S=Li₂S  •  H₂+S=H₂S  •  C+2S=CS₂',
            qizdir: true,
            suyuqlikRang: '#34d399',
            stakanBelgi: 'Sulfidlar (S⁻²)',
            stakanSarlavha: 'S — oksidlovchi',
            reagentlar: [
              { belgi: 'Fe²⁺', rang: '#34d399' },
              { belgi: 'S²⁻', rang: '#fde047' },
            ],
            elektronJuft: { chap: 'Fe/H₂/C', ong: 'S⁰→S⁻²', e: '2ē' },
            belgilar: [
              { k: 'Fe + S vs Cl₂', v: 'FeS (+2!), lekin FeCl₃ (+3!)', rang: '#34d399' },
              { k: 'Demerkurizatsiya', v: 'Hg + S = HgS (xona haroratida!)', rang: '#fb923c' },
              { k: 'H₂ va C bilan', v: 'H₂+S = H₂S↑;  C+2S = CS₂ (pechda)', rang: '#fde047' },
            ],
          },
          pastki: ['S⁰ + 2ē → S⁻² (sulfidlar hosil bo\'ladi)', 'Fe + S → FeS (+2), lekin 2Fe+3Cl₂ → 2FeCl₃', 'Simob + S → HgS (xonada demerkurizatsiya)'],
        },
      ]}
    />
  );
}

function KorgazmaSQaytaruvchi() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. Oltingugurt — qaytaruvchi: O₂, Cl₂, F₂ bilan (133-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 'okf',
          tugma: 'SO₂ (+4), SCl₂ (+2), SF₆ (+6)',
          formula: 'S + O₂ = SO₂ (+4) • S + Cl₂ = SCl₂ (+2) • S + 3F₂ = SF₆ (+6 maks.)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'EM: F > O > Cl > S — kuchli metalmaslarga S elektron beradi',
            tenglama: 'S + O₂ = SO₂ (+4)   |   S + Cl₂ = SCl₂ (+2)   |   S + 3F₂ = SF₆ (+6 maksimal!)',
            qizdir: true,
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'S + O₂/Cl₂/F₂',
            stakanSarlavha: 'S — qaytaruvchi',
            reagentlar: [
              { belgi: 'S⁺⁴', rang: '#38bdf8' },
              { belgi: 'S⁺⁶', rang: '#fde047' },
            ],
            gazRang: '#a855f7',
            gazBelgi: 'SO₂ / SCl₂ / SF₆',
            elektronJuft: { chap: 'S⁰', ong: 'O,Cl,F', e: '4/6ē' },
            belgilar: [
              { k: 'Kislorodda', v: 'S + O₂ = SO₂ (havorang alanga, +4!)', rang: '#38bdf8' },
              { k: 'Xlor bilan', v: 'S + Cl₂ = SCl₂ (+2)', rang: '#34d399' },
              { k: 'Ftor bilan', v: 'S + 3F₂ = SF₆ (maksimal +6!)', rang: '#fde047' },
            ],
          },
          pastki: ['S + O₂ = SO₂ (yonishda to\'g\'ridan +4)', 'S + Cl₂ = SCl₂ (+2)', 'S + 3F₂ = SF₆ (maksimal +6 daraja)'],
        },
      ]}
    />
  );
}

function KorgazmaSeTeIshlatish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Selen, Tellur, qo'llanishi & 133-b 3-savol"
      ikon="formula"
      variantlar={[
        {
          id: 'sete_ish',
          tugma: 'Se, Te (O\'zb.) & 133-b 3-savol',
          formula: 'O\'zb. mis rudasida Se, Te • S oksidl.: Li₂S, ZnS, H₂S, CS₂ • Qaytar.: SO₂, SF₆',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Selen, Tellur va Oltingugurtning sanoatda hamda OQR da ahamiyati',
            tenglama: 'Vulkanizatsiya (rezina), gugurt, qora porox, H₂SO₄ • Yarimo\'tkazgichlar (Se, Te)',
            markazBelgi: 'S,Se,Te',
            markazRang: '#fb923c',
            tugunlar: [
              { nom: 'Se, Te (O\'zb.)', belgi: 'Quyosh bat., po\'lat', rang: '#fb923c' },
              { nom: 'Gaz kondensat', belgi: 'Yuqori toza S', rang: '#fde047' },
              { nom: 'S oksidlovchi', belgi: 'Li₂S, ZnS, H₂S, CS₂', rang: '#34d399' },
              { nom: 'S qaytaruvchi', belgi: 'SO₂ (+4), SF₆ (+6)', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Se va Te', v: 'Yarimo\'tkazgich, quyosh bat., maxsus po\'lat', rang: '#fb923c' },
              { k: 'S qo\'llanishi', v: 'Rezina vulkanizatsiya, gugurt, porox, H₂SO₄', rang: '#fde047' },
            ],
          },
          pastki: ['O\'zbekiston mis rudalarida Se va Te bor', 'Se, Te: yarimo\'tkazgich, quyosh bat., fotoelement', '133-b 3-s: Li₂S/CS₂ (oksidl.), SO₂/SF₆ (qaytar.)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (28-§) VA O'YINLAR (29-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '28-§ (20-jadval): Cl⁻, Br⁻ va I⁻ ionlari AgNO₃ bilan beradigan cho\'kmalar:',
    variantlar: [
      { matn: 'Hammasi qora', togri: false },
      { matn: 'Hammasi oq', togri: false },
      { matn: 'AgCl (oq pag\'a), AgBr (sarg\'ish), AgI (sariq)', togri: true },
      { matn: 'Cho\'kma bermaydi', togri: false },],
    izoh: '122-bet 20-jadval: Cl⁻ → oq, Br⁻ → sarg\'ish, I⁻ → sariq.',
  },
  {
    id: 't2',
    savol: 'Qalqonsimon bezdagi yod miqdori va yetishmasligidan kelib chiqadigan kasallik:',
    variantlar: [
      { matn: '15 mg — buqoq kasalligi (jami 20–25 mg)', togri: true },
      { matn: '1 mg; anemiya', togri: false },
      { matn: '50 mg; gastrit', togri: false },
      { matn: '0,1 mg; rahit', togri: false },],
    izoh: '123-bet: 20–25 mg dan 15 mg qalqonsimon bezda.',
  },
  {
    id: 't3',
    savol: 'Ftor atmosferasida shisha (SiO₂) va suv yonganda ajraladigan oddiy modda:',
    variantlar: [
      { matn: 'Vodorod (H₂)', togri: false },
      { matn: 'Kremniy (Si)', togri: false },
      { matn: 'Ozon', togri: false },
      { matn: 'Kislorod (O₂): SiF₄+O₂; 4HF+O₂', togri: true },],
    izoh: '122-bet: ftor kislorodni birikmalaridan siqadi.',
  },
  {
    id: 't4',
    savol: 'Qoramtir-qo\'ng\'ir bromli suvdan H₂S o\'tkazilganda nima kuzatiladi?',
    variantlar: [
      { matn: 'O\'zgarmaydi', togri: false },
      { matn: 'Rangsizlanadi va oltingugurt (S↓) cho\'kadi', togri: true },
      { matn: 'Ko\'k rang', togri: false },
      { matn: 'Qora cho\'kma', togri: false },],
    izoh: '129-bet test: Br₂ + H₂S = 2HBr + S↓.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tuzilish_min', nom: 'Atom & Minerallar', tavsif: 'O vs S, Gips, Taxir, Flotatsiya' },
    { id: 'allotrop_oks', nom: 'Allotropiya & Oksidlovchi', tavsif: 'S₈, Plastik Sn, FeS, HgS' },
    { id: 'qaytar_qollash', nom: 'Qaytaruvchi & Se, Te', tavsif: 'SO₂, SF₆, Se/Te, Vulkaniz.' },
  ],
  topshiriqlar: [
    { nom: 'O d-orbitali yo\'q; S, Se, Te d⁰ bor (-2..+6)', qisqa: 'Po (Z=84) radioaktiv', guruh: 'tuzilish_min', izoh: '130–131-bet ns²np⁴.' },
    { nom: 'FeS₂, ZnS, Cu₂S, PbS & Gips CaSO₄·2H₂O', qisqa: 'Taxir MgSO₄·7H₂O; Glauber', guruh: 'tuzilish_min', izoh: 'Na₂SO₄·10H₂O sulfatlar.' },
    { nom: 'Flotatsiya: ρ=2 g/cm³ S suvda ho\'llanmay qalqiydi', qisqa: 'Bekorchi jins cho\'kadi', guruh: 'tuzilish_min', izoh: '132-bet boyitish usuli.' },
    { nom: 'Rombik S₈ (Ts=112,8°C), Monoklinik (>95,5°C)', qisqa: 'Plastik Sn (444,5°C → suv)', guruh: 'allotrop_oks', izoh: 'Rombik S₈ CS₂ da eriydi.' },
    { nom: 'Fe + S = FeS (+2, Cl₂ dek Fe⁺³ emas!)', qisqa: '2Na+S=Na₂S; 2Al+3S=Al₂S₃', guruh: 'allotrop_oks', izoh: '132–133-bet S — oksidlovchi.' },
    { nom: 'Hg + S = HgS; H₂ + S = H₂S; C + 2S = CS₂', qisqa: 'Demerkurizatsiya xonada!', guruh: 'allotrop_oks', izoh: 'S⁰ + 2ē → S⁻².' },
    { nom: 'S + O₂ = SO₂ (+4); S + Cl₂ = SCl₂ (+2)', qisqa: 'S + 3F₂ = SF₆ (+6 maks.)', guruh: 'qaytar_qollash', izoh: 'EM: F > O > Cl > S.' },
    { nom: 'Se, Te (O\'zb. mis rudasi): quyosh batareyasi', qisqa: 'Yarimo\'tkazgich va maxsus po\'lat', guruh: 'qaytar_qollash', izoh: 'Gaz kondensatidan toza S.' },
    { nom: 'Kauchuk vulkanizatsiya, gugurt, porox, H₂SO₄', qisqa: 'Li₂S/CS₂ vs SO₂/SF₆', guruh: 'qaytar_qollash', izoh: '133–134-bet 3-savol.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'O vs S',
    savol: 'Nima uchun kislorod S kabi +4 va +6 oksidlanish darajasini bermaydi?',
    variantlar: ['Metallmas emas', 'Z = 16 katta', '2-davrda d-orbitali yo\'q (1s²2s²2p⁴)', 'Gaz bo\'lgani uchun'],
    togri: 2,
    izoh: '130–131-bet: S, Se, Te da bo\'sh d-orbital bor.',
  },
  {
    belgi: 'Flotatsiya',
    savol: 'Zichligi 2 g/cm³ bo\'lgan oltingugurt kukuni nima uchun suvda qalqib boyitiladi?',
    variantlar: ['Suvda HO\'LLANMAYDI (flotatsiya)', 'Suvdan yengil', 'Suvda eriydi', 'Gaz chiqaradi'],
    togri: 0,
    izoh: '132-bet: "bekorchi jins" cho\'kadi, S esa qalqiydi.',
  },
  {
    belgi: 'Allotropiya',
    savol: '444,5°C gacha qizdirilgan S ni sovuq suvga quyganda qaysi shakl olinadi?',
    variantlar: ['Rombik S₈', 'Monoklinik S₈', 'Sulfat kislota', 'Plastik oltingugurt Sn (qo\'ng\'ir)'],
    togri: 3,
    izoh: '132-bet: kauchukka o\'xshash cho\'ziluvchan massa.',
  },
  {
    belgi: 'Fe + S',
    savol: 'Temir oltingugurt va xlor bilan reaksiyada necha valentli birikma beradi?',
    variantlar: ['Ikkalasida +3', 'Fe + S → FeS (+2), 2Fe + 3Cl₂ → 2FeCl₃ (+3)', 'FeS₂ va FeCl₂', 'Ikkalasida +2'],
    togri: 1,
    izoh: 'S xlordek +3 emas, temirni +2 gacha oksidlaydi.',
  },
  {
    belgi: 'Qaytaruvchi S',
    savol: 'Oltingugurt O₂, Cl₂ va F₂ bilan hosil qiladigan birikmalar:',
    variantlar: ['SO₃, SCl₄, SF₂', 'SO₂ (+4), SCl₂ (+2), SF₆ (+6)', 'H₂S, FeS, CS₂', 'SO, S₂Cl₂'],
    togri: 1,
    izoh: '133-bet: F₂ bilan maksimal +6 daraja SF₆.',
  },
  {
    belgi: 'Simob + S',
    savol: 'Xona haroratida to\'kilgan simobni zararsizlantirish (demerkurizatsiya):',
    variantlar: ['Hg + Cl₂', 'Hg + C', 'Hg + H₂O', 'Hg + S = HgS (kinovar)'],
    togri: 3,
    izoh: 'Oltingugurt kukuni simob bilan darhol HgS ga aylanadi.',
  },
  {
    belgi: 'Se va Te',
    savol: 'O\'zbekiston mis rudalari tarkibida uchraydigan Se va Te qayerda ishlatiladi?',
    variantlar: ['Yarimo\'tkazgich, quyosh batareyasi, maxsus po\'lat', 'Osh tuzi olishda', 'O\'g\'it sifatida', 'Shinalar quyishda'],
    togri: 0,
    izoh: '132–134-bet: fotoelement va termoregulyatorlarda.',
  },
  {
    belgi: '133-b 3-savol',
    savol: 'Qaysi reaksiyalarda oltingugurt faqat OKSIDLOVCHI bo\'ladi?',
    variantlar: ['S + O₂, S + 3F₂', 'S + Cl₂', '2Li+S (Li₂S), Zn+S, H₂+S, C+2S (CS₂)', 'SO₂ + O₂'],
    togri: 2,
    izoh: 'S⁰ + 2ē → S⁻² qaytariladi → oksidlovchi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '131-bet: S ning oksidlanish darajalari',
    vazifa: 'Oltingugurt birikmalarini OD ORTIB borishi (-2 → +6) tartibida joylang:',
    tartib: [
      'H₂S, FeS, ZnS (OD = -2)',
      'S₈ rombik va plastik Sn (OD = 0)',
      'SO₂ va H₂SO₃ (OD = +4)',
      'SO₃, SF₆ va CaSO₄·2H₂O (OD = +6)',
    ],
    variantlar: [
      'SO₂ va H₂SO₃ (OD = +4)',
      'H₂S, FeS, ZnS (OD = -2)',
      'SO₃, SF₆ va CaSO₄·2H₂O (OD = +6)',
      'S₈ rombik va plastik Sn (OD = 0)',
    ],
  },
  {
    tur: '132-bet: Haroratga ko\'ra allotropiya',
    vazifa: 'Oltingugurtni qizdirish va plastik shakl olish bosqichlarini tartiblang:',
    tartib: [
      '1. Rombik S₈ sariq kristall (20°C)',
      '2. Suyuqlanish (112,8°C — sariq suyuqlik)',
      '3. Qaynash (444,5°C — to\'q qo\'ng\'ir)',
      '4. Sovuq suvga quyish → plastik oltingugurt Sn',
    ],
    variantlar: [
      '3. Qaynash (444,5°C — to\'q qo\'ng\'ir)',
      '1. Rombik S₈ sariq kristall (20°C)',
      '4. Sovuq suvga quyish → plastik oltingugurt Sn',
      '2. Suyuqlanish (112,8°C — sariq suyuqlik)',
    ],
  },
  {
    tur: '133-bet: Oddiy moddalardan birikmalar',
    vazifa: 'FeS₂ → S → H₂S → SO₂ o\'tishlar mantiqiy zanjirini tartiblang:',
    tartib: [
      '1. Pirit FeS₂ (tabiiy sulfid)',
      '2. Sof oltingugurt S (flotatsiya/tozalash)',
      '3. H₂ + S = H₂S (oksidlovchi sifatida)',
      '4. S + O₂ = SO₂ (qaytaruvchi sifatida)',
    ],
    variantlar: [
      '3. H₂ + S = H₂S (oksidlovchi sifatida)',
      '4. S + O₂ = SO₂ (qaytaruvchi sifatida)',
      '1. Pirit FeS₂ (tabiiy sulfid)',
      '2. Sof oltingugurt S (flotatsiya/tozalash)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'VI A guruh elementlarining umumiy tashqi qavat formulasi (130-bet):',
    variantlar: ['ns² np⁵ (7 ta elektron)', 'ns² np⁴ (6 ta elektron)', 'ns² np³ (5 ta elektron)', 'ns² np⁶'],
    togri: 1,
    izoh: 'O, S, Se, Te, Po tashqi qavatida 6 ta elektron tutadi.',
  },
  {
    savol: 'Glauber tuzi va Gips minerallarining formulalari (131-bet):',
    variantlar: ['FeS₂ va ZnS', 'PbS va KCl', 'MgSO₄·7H₂O va Cu₂S', 'Na₂SO₄·10H₂O (Glauber) va CaSO₄·2H₂O (Gips)'],
    togri: 3,
    izoh: 'Tabiiy sulfat kristallogidratlari.',
  },
  {
    savol: 'Rombik oltingugurt qaysi erituvchida yaxshi eriydi (132-bet)?',
    variantlar: ['Uglerod(IV) sulfid (CS₂) da', 'Spirtda', 'Suvda (H₂O)', 'Kislotada'],
    togri: 0,
    izoh: 'Suvda erimaydi, CS₂ da eriydi.',
  },
  {
    savol: 'VI A guruhdagi qaysi element radioaktiv hisoblanadi?',
    variantlar: ['Selen (Se)', 'Tellur (Te)', 'Poloniy (Po, Z=84)', 'Oltingugurt (S)'],
    togri: 2,
    izoh: '131-bet: Poloniy Po (Z=84) radioaktiv.',
  },
  {
    savol: 'S va Cl₂ ta\'sirida qanday birikma hosil bo\'ladi?',
    variantlar: ['SCl', 'SCl₆', 'SCl₂ (oltingugurt(II) xlorid)', 'Reaksiya bormaydi'],
    togri: 2,
    izoh: '133-bet: S + Cl₂ = SCl₂ (+2).',
  },
  {
    savol: 'Oltingugurtning suyuqlanish (Ts) va qaynash (Tq) haroratlari:',
    variantlar: ['112,8°C va 444,5°C', '0°C va 100°C', '95,5°C va 200°C', '800°C va 1413°C'],
    togri: 0,
    izoh: '132-bet: Ts = 112,8°C, Tq = 444,5°C.',
  },
  {
    savol: 'Kauchukdan rezina olishda oltingugurt qaysi jarayonda ishlatiladi?',
    variantlar: ['Flotatsiya', 'Vulkanizatsiya', 'Sublimatsiya', 'Elektroliz'],
    togri: 1,
    izoh: '134-bet: kauchukni vulkanizatsiya qilishda.',
  },
  {
    savol: 'Yopiq pechda ko\'mir va oltingugurt birikishidan qanday modda olinadi?',
    variantlar: ['SO₂', 'CO₂', 'H₂S', 'CS₂ (uglerod(IV) sulfid)'],
    togri: 3,
    izoh: 'C + 2S = CS₂ (uglerod(IV) sulfid).',
  },
];

export default function S8Mavzu29() {
  const korgazmalar = [
    { nom: '1. VI A: O vs S, Se, Te', ikon: 'atom', komponent: <KorgazmaVIAElementlar /> },
    { nom: '2. Minerallar & Flotatsiya', ikon: 'kristall', komponent: <KorgazmaSTabiatVaFlotatsiya /> },
    { nom: '3. S₈ & Plastik Sn', ikon: 'kristall', komponent: <KorgazmaSAllotropiya /> },
    { nom: '4. Oksidlovchi (FeS, CS₂)', ikon: 'uchqun', komponent: <KorgazmaSOksidlovchi /> },
    { nom: '5. Qaytaruvchi (SO₂, SF₆)', ikon: 'kolba', komponent: <KorgazmaSQaytaruvchi /> },
    { nom: '6. Se, Te & Qo\'llash', ikon: 'formula', komponent: <KorgazmaSeTeIshlatish /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-29"
          nom="Kislorod guruhchasini guruhlang"
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
          key="tezkor-29"
          nom="29-§: VI A guruh"
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
          key="zanjir-29"
          nom="Oltingugurt zanjirlari"
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
          key="duel-29"
          sarlavha="29-§: VI A guruh dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="29-§"
      mavzuNom="Kislorod guruhchasi elementlari"
      oldingiRaqam="28-§"
      oldingiNom="Ftor, brom, yod"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
