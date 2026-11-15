'use client';
// ============================================================
// JDA KIMYO - 8-SINF, V BOB, 33-PARAGRAF
// "Kimyoviy reaksiyalarning tezligi" (Darslik 141-143 & 151-153-betlar)
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
function KorgazmaTezlikTushuncha() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Reaksiya tezligi υ = (c₁ - c₂) / t (141–142-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'hisob',
          tugma: '1 → 0,4 mol/l (10 s): υ = 0,06',
          formula: 'υ = (c₁ - c₂) / t [mol/(l·s)] • (1 - 0,4) / 10 = 0,06 mol/(l·s)',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Darslik misoli (142-bet): konsentratsiya o\'zgarishi bo\'yicha tezlik',
            tenglama: 'υ = Δc / Δt = (1 mol/l - 0,4 mol/l) / 10 s = 0,06 mol/(l·s)',
            qadamlar: [
              { belgi: 'Boshlang\'ich c₁', natija: '1,0 mol/l', izoh: 't₁ = 0 s', rang: '#38bdf8' },
              { belgi: '10 s dan so\'ng c₂', natija: '0,4 mol/l', izoh: 'Δc = 0,6 mol/l', rang: '#fbbf24' },
              { belgi: 'Tezlik υ = 0,6 / 10', natija: '0,06 mol/(l·s)', izoh: 'birligi: mol/(l·s)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Boshlang\'ich c₁', foiz: 100, qiymat: '1,0 mol/l', rang: '#38bdf8' },
              { nom: 'Keyingi c₂ (10 s)', foiz: 40, qiymat: '0,4 mol/l', rang: '#fbbf24' },
            ],
            javobBadge: 'Javob: υ = (1 - 0,4) / 10 = 0,06 mol/(l·s)',
          },
          pastki: ['υ = Δc / t — vaqt birligida c o\'zgarishi', 'Birligi: mol/(l·s) yoki mol/(l·min)', '1 → 0,4 mol/l (10 s) ⇒ υ = 0,06 mol/(l·s)'],
        },
      ]}
    />
  );
}

function KorgazmaKonsentratsiyaVaBosim() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. 1-omil: Konsentratsiya va bosim (142 & 152-bet)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'havo_o2',
          tugma: 'Havo (21% O₂) vs Sof O₂ (100%)',
          formula: 'υ = k · [A]^m · [B]^n • Sof O₂ da ~5× ko\'p → ko\'mir yorqin yonadi',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Ta\'sir etuvchi massalar qonuni: konsentratsiya ↑ → to\'qnashuvlar ↑',
            tenglama: 'υ = k · [A]^m · [B]^n   |   Qattiq modda konsentratsiyasi tenglamaga kirmaydi!',
            kameraNom: 'Sof O₂ (~5× ko\'p zarracha) → tez to\'qnashuv',
            tezlik: 3.4,
            rang: '#fde047',
            belgilar: [
              { k: 'Havo (21% O₂)', v: 'Cho\'g\'langan ko\'mir sekin tutaydi', rang: '#94a3b8' },
              { k: 'Sof O₂ (100%)', v: '~5× tez to\'qnashuv → yorqin alanga!', rang: '#fde047' },
              { k: 'Qattiq modda', v: 'c o\'zgarmas → kinetik tenglamaga kirmaydi', rang: '#38bdf8' },
            ],
          },
          pastki: ['υ = k·[A]^m·[B]^n (ta\'sir etuvchi massalar)', 'Sof O₂ da konsentratsiya havodan ~5× katta', 'Qattiq modda konsentratsiyasi tenglamaga kirmaydi'],
        },
        {
          id: 'bosim_3x',
          tugma: '2NO + O₂ = 2NO₂: Bosim 3× → 27×',
          formula: 'υ₁ = k·[NO]²·[O₂] → Bosim 3× ortsa υ₂ = k·(3[NO])²·(3[O₂]) = 27·υ₁',
          tur: 'hisob',
          cfg: {
            sarlavha: '152-bet 2-misol: Gazlar bosimi 3 marta ortganda tezlik 27 marta ortadi!',
            tenglama: '2NO + O₂ = 2NO₂   ⇒   υ₂ = 3² · 3 · υ₁ = 9 · 3 · υ₁ = 27 · υ₁',
            qadamlar: [
              { belgi: 'Kinetik tenglama', natija: 'υ₁ = k·[NO]²·[O₂]', izoh: 'gaz moddalar', rang: '#38bdf8' },
              { belgi: 'P 3× → c ham 3×', natija: '(3[NO])² · (3[O₂])', izoh: '9 · 3 barobar', rang: '#fde047' },
              { belgi: 'Natija υ₂ / υ₁', natija: '27 marta ortadi!', izoh: '27 · υ₁', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'O₂ ulushi (3¹)', foiz: 33, qiymat: '3 marta', rang: '#38bdf8' },
              { nom: 'NO ulushi (3²)', foiz: 100, qiymat: '9 marta → Jami 27×', rang: '#34d399' },
            ],
            javobBadge: 'Javob: Bosim 3 marta ortganda tezlik 27 marta ortadi!',
          },
          pastki: ['Bosim N× ortsa gaz konsentratsiyasi N× ortadi', 'υ₁ = k·[NO]²·[O₂]', 'υ₂ = 3² · 3 · υ₁ = 27 · υ₁'],
        },
      ]}
    />
  );
}

function KorgazmaHaroratVantGoff() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. 2-omil: Harorat va Vant-Goff qoidasi (142–143-b)"
      ikon="harorat"
      variantlar={[
        {
          id: 'vantgoff',
          tugma: 'γ=2 da: +40°→16×, +50°→32×, +70°→128×',
          formula: 'υ_t2 = υ_t1 · γ^((t₂-t₁)/10), γ = 2–4 • Δt = 40/50/70°C da 16×, 32×, 128×',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Har 10°C da tezlik γ (2–4) marta ortadi: faol to\'qnashuvlar ko\'payadi',
            tenglama: 'υ_t2 = υ_t1 · γ^((t₂ - t₁)/10)   (γ = 2 bo\'lganda: 2¹, 2², 2⁴=16, 2⁵=32, 2⁷=128)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: '+10°C (2¹)', qiymat: 2, yorliq: '2×', rang: '#38bdf8' },
              { nom: '+20°C (2²)', qiymat: 4, yorliq: '4×', rang: '#34d399' },
              { nom: '+40°C (2⁴)', qiymat: 16, yorliq: '16×', rang: '#fbbf24' },
              { nom: '+50°C (2⁵)', qiymat: 32, yorliq: '32×', rang: '#f97316' },
              { nom: '+70°C (2⁷)', qiymat: 128, yorliq: '128×', rang: '#ef4444' },
            ],
          },
          pastki: ['υ₂ = υ₁ · γ^(Δt/10); odatda γ = 2–4', 'γ=2 da: +40°C → 16×, +50°C → 32×, +70°C → 128×', 'Sabab: faol molekulalar ulushi keskin oshadi'],
        },
      ]}
    />
  );
}

function KorgazmaTabiatVaSirt() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 3–4-omillar: Modda tabiati va Sirt yuzasi (143-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'tabiat_sirt',
          tugma: 'K > Na > Fe > Cu & Tutash sirti',
          formula: 'K (alanga) > Na > Fe (sekin) > Cu (≠) • Maydalash sirtni oshiradi (o\'ta zichlash ≠)',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Suv bilan metallar faolligi hamda maydalashning geterogen tezlikka ta\'siri',
            tenglama: 'K (alan.) > Na (tez) > Fe (sekin) > Cu (≠)  |  Yirik marmar < mayda kukun (+ HCl)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'K + H₂O (alanga)', qiymat: 100, yorliq: 'Alangalanadi', rang: '#ef4444' },
              { nom: 'Na + H₂O (tez)', qiymat: 78, yorliq: 'Tez H₂↑', rang: '#f97316' },
              { nom: 'Fe + H₂O (sekin)', qiymat: 25, yorliq: 'Sekin zang', rang: '#fbbf24' },
              { nom: 'Cu/Ag/Au (0)', qiymat: 4, yorliq: 'Kirishmaydi', rang: '#64748b' },
            ],
          },
          pastki: ['K suvda alangalanadi, Na tez, Fe sekin, Cu/Ag/Au ≠', 'Zn HCl da tez, sirka kislotada sekin eriydi', 'Mayda marmar/Fe+S tez; juda zichlansa susayadi!'],
        },
      ]}
    />
  );
}

function KorgazmaKatalizatorIngibitor() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 5-omil: Katalizatorlar, Fermentlar & Ingibitorlar (143-b)"
      ikon="filtr"
      variantlar={[
        {
          id: 'kataliz',
          tugma: 'MnO₂, V₂O₅, Ferment & Ingibitor',
          formula: 'Katalizator ↑ (massasi o\'zgarmas, muvozanatni SILJITMAYDI!) • Fermentlar • Ingibitor ↓',
          tur: 'sanoat',
          cfg: {
            sarlavha: 'Katalizator va ingibitor muvozanatni siljitmaydi — faqat tezlikni o\'zgartiradi',
            tenglama: '2H₂O₂ →(MnO₂) 2H₂O + O₂↑   |   2SO₂ + O₂ ⇄(V₂O₅) 2SO₃ + Q',
            bosqichlar: [
              { nom: 'Katalizator (↑)', tur: 'kataliz', ichi: 'MnO₂ (H₂O₂), V₂O₅', mahsulot: 'Massasi o\'zgarmas', rang: '#34d399' },
              { nom: 'Fermentlar', tur: 'kataliz', ichi: 'Biologik oqsil', mahsulot: 'Tirik organizmda', rang: '#38bdf8' },
              { nom: 'Ingibitor (↓)', tur: 'minora', ichi: 'Antioksidant / korroz.', mahsulot: 'Sekinlashtiradi', rang: '#fb7185' },
            ],
            belgilar: [
              { k: 'Katalizator', v: 'Tezlik ↑; oxirida o\'zi sarflanmaydi', rang: '#34d399' },
              { k: 'Ingibitor', v: 'Korroziya, chirishni sekinlashtiradi', rang: '#fb7185' },
              { k: 'Muvozanat', v: 'Ikkalasi ham muvozanatni SILJITMAYDI!', rang: '#fde047' },
            ],
          },
          pastki: ['2H₂O₂→(MnO₂) 2H₂O+O₂↑; V₂O₅: SO₂→SO₃', 'Tirik organizm katalizatorlari — fermentlar', 'Ingibitor sekinlashtiradi; muvozanat siljimaydi!'],
        },
      ]}
    />
  );
}

function Korgazma33Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 151–153-bet kinetika masalalari"
      ikon="formula"
      variantlar={[
        {
          id: 'm1_4',
          tugma: '50→70°C (15 s) & 30→80°C (γ=4)',
          formula: '1-m: γ=3, 50→70°C (135 s) → 135/9 = 15 s • 4-m: 30→80°C (1024×) → γ⁵=1024 → γ=4',
          tur: 'hisob',
          cfg: {
            sarlavha: '151-bet 1-misol (vaqt kamayishi) va 153-bet 4-misol (γ topish)',
            tenglama: '1) 3^((70-50)/10) = 9× → τ₂ = 135/9 = 15 s   |   4) γ^((80-30)/10) = γ⁵ = 1024 → γ = 4',
            qadamlar: [
              { belgi: '1-m: 50→70°C (γ=3)', natija: '3² = 9× tez', izoh: 'vaqt 9× kamayadi', rang: '#38bdf8' },
              { belgi: 'τ₂ = 135 s / 9', natija: '15 sekund', izoh: '151-bet 1-misol', rang: '#fde047' },
              { belgi: '4-m: 30→80°C (1024×)', natija: 'γ⁵ = 1024 → γ = 4', izoh: '153-bet 4-misol (4⁵)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '50→70°C vaqt (15 s)', foiz: 12, qiymat: '15 s (135 s dan)', rang: '#38bdf8' },
              { nom: '2NO+O₂ bosim 3×', foiz: 100, qiymat: '27× (152-bet)', rang: '#34d399' },
            ],
            javobBadge: '1-m: 15 s;  2-m (2NO+O₂, P 3×): 27×;  4-m: γ = 4',
          },
          pastki: ['50→70°C (γ=3): 9× tez → 135 / 9 = 15 s', '2NO + O₂ = 2NO₂ (P 3×): 3² · 3 = 27×', '30→80°C (1024×): γ⁵ = 1024 → γ = 4'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (32-§) VA O'YINLAR (33-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '32-§ (139-bet): Sulfat kislotani suyultirishning to\'g\'ri va xavfsiz qoidasi:',
    variantlar: [
      { matn: 'Farqi yo\'q', togri: false },
      { matn: 'Suv kislotaga tez quyiladi', togri: false },
      { matn: 'Kislota suvga oz-ozdan aralashtirib quyiladi', togri: true },
      { matn: 'Oldin qaynatiladi', togri: false },],
    izoh: 'Suvni kislotaga quyish qat\'iyan taqiqlanadi — sachraydi!',
  },
  {
    id: 't2',
    savol: 'SO₄²⁻ ionlari uchun sifat reaktivi va cho\'kma xossasi:',
    variantlar: [
      { matn: 'BaCl₂ → BaSO₄↓ (suvda va HNO₃ da erimaydi)', togri: true },
      { matn: 'AgNO₃ → AgCl↓', togri: false },
      { matn: 'Pb(NO₃)₂ → PbS↓', togri: false },
      { matn: 'NaOH → oq', togri: false },],
    izoh: '140-bet: Ba²⁺ + SO₄²⁻ = BaSO₄↓ (oq cho\'kma).',
  },
  {
    id: 't3',
    savol: 'Gips (CaSO₄·2H₂O) 150–170°C da qizdirilganda qaysi moddaga aylanadi?',
    variantlar: [
      { matn: 'Glauber tuzi', togri: false },
      { matn: 'Mis kuporosi', togri: false },
      { matn: 'Ohaktosh', togri: false },
      { matn: 'Alebastr (CaSO₄·½H₂O)', togri: true },],
    izoh: '3/4 qism suvini yo\'qotib alebastr hosil qiladi.',
  },
  {
    id: 't4',
    savol: '141-bet 4-masala: 5,4 g Al uchun 20% li H₂SO₄ eritmasidan necha g kerak?',
    variantlar: [
      { matn: '29,4 g', togri: false },
      { matn: '147 g eritma', togri: true },
      { matn: '98 g', togri: false },
      { matn: '73,5 g', togri: false },],
    izoh: '0,2 mol Al → 0,3 mol H₂SO₄ (29,4 g)/0,20 = 147 g.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'tezlik_kons', nom: 'Tezlik & Bosim', tavsif: 'υ=Δc/t, 21% vs 100%, 27×' },
    { id: 'vantgoff_sirt', nom: 'Harorat & Sirt', tavsif: 'Vant-Goff, K>Na>Fe, Marmar' },
    { id: 'kataliz_masala', nom: 'Kataliz & Masalalar', tavsif: 'MnO₂, Ingibitor, 15 s, γ=4' },
  ],
  topshiriqlar: [
    { nom: 'υ = (1 - 0,4) / 10 = 0,06 mol/(l·s)', qisqa: 'Vaqt birligida Δc', guruh: 'tezlik_kons', izoh: '142-bet darslik misoli.' },
    { nom: 'υ = k·[A]^m·[B]^n; Havo (21%) vs Sof O₂ (5×)', qisqa: 'Qattiq modda tenglamaga kirmaydi', guruh: 'tezlik_kons', izoh: 'Ta\'sir etuvchi massalar qonuni.' },
    { nom: '2NO + O₂ = 2NO₂ da bosim 3× → 27× (3²·3)', qisqa: '152-bet 2-misol', guruh: 'tezlik_kons', izoh: 'Bosim N× → gaz c ham N×.' },
    { nom: 'υ₂ = υ₁·γ^((t₂-t₁)/10): +40°→16×, +70°→128×', qisqa: 'γ=2 bo\'lganda (142-bet)', guruh: 'vantgoff_sirt', izoh: 'Faol molekulalar soni ortadi.' },
    { nom: 'K (alanga) > Na > Fe (sekin) > Cu (≠)', qisqa: 'Zn HCl da tez, sirka da sekin', guruh: 'vantgoff_sirt', izoh: '143-bet moddalar tabiati.' },
    { nom: 'Maydalash sirtni oshiradi (o\'ta zichlash susaytiradi)', qisqa: 'Marmar kukuni + HCl tez', guruh: 'vantgoff_sirt', izoh: 'Geterogen reaksiya tutash sirti.' },
    { nom: 'MnO₂ (2H₂O₂), V₂O₅, Fermentlar (oqsil)', qisqa: 'Muvozanatni SILJITMAYDI!', guruh: 'kataliz_masala', izoh: 'Oxirida tarkib/massasi o\'zgarmas.' },
    { nom: 'Ingibitorlar: korroziya, chirishni sekinlashtiradi', qisqa: 'Antioksidantlar ham ingibitor', guruh: 'kataliz_masala', izoh: '143-bet ingibitorlar.' },
    { nom: '50→70°C (γ=3): 135 s→15 s; 30→80°C (1024×) → γ=4', qisqa: '151–153-bet masalalari', guruh: 'kataliz_masala', izoh: '4⁵ = 1024 → γ = 4.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: '142-b misol',
    savol: '10 s da modda konsentratsiyasi 1 mol/l dan 0,4 mol/l ga tushsa tezlik υ:',
    variantlar: ['0,04 mol/(l·s)', '0,6 mol/(l·s)', '0,06 mol/(l·s)', '6 mol/(l·s)'],
    togri: 2,
    izoh: 'υ = (1 - 0,4) / 10 = 0,06 mol/(l·s).',
  },
  {
    belgi: '152-b 2-m',
    savol: '2NO + O₂ = 2NO₂ reaksiyasida bosim 3 marta oshirilsa tezlik necha marta ortadi?',
    variantlar: ['27 marta (3² · 3)', '3 marta', '9 marta', '6 marta'],
    togri: 0,
    izoh: 'υ = k·[NO]²·[O₂] → 3² · 3 = 27 marta.',
  },
  {
    belgi: 'Vant-Goff',
    savol: 'γ = 2 bo\'lganda harorat +70°C ga ko\'tarilsa reaksiya necha marta tezlashadi?',
    variantlar: ['14 marta', '64 marta', '32 marta', '128 marta (2⁷)'],
    togri: 3,
    izoh: '2^(70/10) = 2⁷ = 128 marta (+40°C → 16×, +50°C → 32×).',
  },
  {
    belgi: '151-b 1-m',
    savol: '50°C da 135 s da tugagan reaksiya 70°C da (γ = 3) necha s da tugaydi?',
    variantlar: ['45 s', '15 s (9 marta tez → 135/9)', '27 s', '5 s'],
    togri: 1,
    izoh: '3² = 9 marta tez → vaqt 9 marta qisqaradi: 135/9 = 15 s.',
  },
  {
    belgi: '153-b 4-m',
    savol: '30°C dan 80°C ga qizdirganda tezlik 1024 marta oshsa γ nechaga teng?',
    variantlar: ['γ = 2', 'γ = 4 (4⁵ = 1024)', 'γ = 3', 'γ = 5'],
    togri: 1,
    izoh: 'Δt/10 = 5 → γ⁵ = 1024 → γ = 4.',
  },
  {
    belgi: 'Qattiq sirt',
    savol: 'Geterogen reaksiyada qattiq moddani haddan ortiq tolqon qilib ZICHLASH nima qiladi?',
    variantlar: ['Tezlashtiradi', 'Portlatadi', 'O\'zgartirmaydi', 'Tezlikni SUSAYTIRADI (gaz/suyuqlik kira olmaydi)'],
    togri: 3,
    izoh: '143-bet: maydalash tezlashtiradi, lekin o\'ta zichlash susaytiradi.',
  },
  {
    belgi: 'Kataliz & Muv.',
    savol: 'Katalizator va ingibitor qaytar reaksiyaning muvozanatiga qanday ta\'sir qiladi?',
    variantlar: ['Muvozanatni SILJITMAYDI', 'Chapga siljitadi', 'O\'ngga siljitadi', 'To\'xtatadi'],
    togri: 0,
    izoh: '143-bet: to\'g\'ri va teskari tezlikni baravar o\'zgartiradi.',
  },
  {
    belgi: 'Tabiati',
    savol: 'Suv bilan reaksiyada metallar tezligi kamayish tartibi:',
    variantlar: ['Cu > Fe > Na > K', 'Fe > Na > K > Cu', 'K (alanga) > Na > Fe > Cu (≠)', 'Na > Fe > K > Cu'],
    togri: 2,
    izoh: '143-bet: kaliy alangalanadi, mis kirishmaydi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '151-bet 1-misol: 50°C (135 s) → 70°C (γ=3)',
    vazifa: 'Reaksiya vaqtini topish bosqichlarini tartiblang:',
    tartib: [
      '1. Δt = t₂ - t₁ = 70°C - 50°C = 20°C',
      '2. υ₂/υ₁ = γ^(Δt/10) = 3^(20/10) = 3² = 9 marta',
      '3. Tezlik 9× ortsa, vaqt 9× kamayadi',
      '4. τ₂ = 135 s / 9 = 15 s',
    ],
    variantlar: [
      '3. Tezlik 9× ortsa, vaqt 9× kamayadi',
      '1. Δt = t₂ - t₁ = 70°C - 50°C = 20°C',
      '4. τ₂ = 135 s / 9 = 15 s',
      '2. υ₂/υ₁ = γ^(Δt/10) = 3^(20/10) = 3² = 9 marta',
    ],
  },
  {
    tur: '152-bet 2-misol: 2NO + O₂ = 2NO₂ bosim 3×',
    vazifa: 'Bosim 3 marta oshganda tezlik o\'zgarishini tartiblang:',
    tartib: [
      '1. Kinetik tenglama: υ₁ = k · [NO]² · [O₂]',
      '2. Bosim 3× ortsa: [NO]₂ = 3[NO], [O₂]₂ = 3[O₂]',
      '3. υ₂ = k · (3[NO])² · (3[O₂])',
      '4. υ₂ = 9 · 3 · υ₁ = 27 · υ₁ (27 marta ortadi)',
    ],
    variantlar: [
      '2. Bosim 3× ortsa: [NO]₂ = 3[NO], [O₂]₂ = 3[O₂]',
      '4. υ₂ = 9 · 3 · υ₁ = 27 · υ₁ (27 marta ortadi)',
      '1. Kinetik tenglama: υ₁ = k · [NO]² · [O₂]',
      '3. υ₂ = k · (3[NO])² · (3[O₂])',
    ],
  },
  {
    tur: '153-bet 4-misol: 30°C → 80°C (1024×)',
    vazifa: 'Harorat koeffitsiyenti γ ni topish bosqichlarini joylang:',
    tartib: [
      '1. Δt = 80°C - 30°C = 50°C',
      '2. Daraja: Δt / 10 = 50 / 10 = 5',
      '3. Vant-Goff tenglamasi: γ⁵ = 1024',
      '4. 4⁵ = 1024 ⇒ γ = 4',
    ],
    variantlar: [
      '3. Vant-Goff tenglamasi: γ⁵ = 1024',
      '4. 4⁵ = 1024 ⇒ γ = 4',
      '1. Δt = 80°C - 30°C = 50°C',
      '2. Daraja: Δt / 10 = 50 / 10 = 5',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Kimyoviy reaksiya tezligining o\'lchov birligi:',
    variantlar: ['g/cm³', 'mol/(l·s)', 'l/mol', 'mol/kg'],
    togri: 1,
    izoh: '142-bet: konsentratsiya (mol/l) / vaqt (s).',
  },
  {
    savol: '2H₂O₂ → 2H₂O + O₂↑ reaksiyasini jadallashtiruvchi katalizator (143-bet):',
    variantlar: ['CuO', 'SiO₂', 'NaCl', 'MnO₂ (marganets(IV) oksid)'],
    togri: 3,
    izoh: 'MnO₂ tezlashtiradi va oxirida o\'zgarmas qoladi.',
  },
  {
    savol: 'Tirik organizmlardagi murakkab oqsil tabiatli biologik katalizatorlar:',
    variantlar: ['Fermentlar', 'Vitaminlar', 'Ingibitorlar', 'Elektrolitlar'],
    togri: 0,
    izoh: '143-bet: biologik reaksiyalarni boshqaruvchi fermentlar.',
  },
  {
    savol: 'Nima uchun sof kislorodli kolbada cho\'g\'langan ko\'mir havodagidan ~5× tez yonadi?',
    variantlar: ['Harorat past', 'Katalizator bor', 'O₂ konsentratsiyasi ~5 marta yuqori (100% vs 21%)', 'Bosim nol'],
    togri: 2,
    izoh: 'To\'qnashuvlar soni keskin ortadi.',
  },
  {
    savol: 'Kinetik tenglamaga υ = k·[A]^m·[B]^n qaysi agregat holatdagi modda kirmaydi?',
    variantlar: ['Eritmadagi ion', 'Gaz modda', 'Qattiq modda (c o\'zgarmas)', 'Hammasi kiradi'],
    togri: 2,
    izoh: 'Qattiq modda konsentratsiyasi o\'zgarmas bo\'ladi.',
  },
  {
    savol: 'Rux (Zn) xlorid kislotada va sirka kislotada qanday tezlikda eriydi?',
    variantlar: ['HCl da tez, sirka kislotada sekin (kislota kuchi)', 'Sirka kislotada tez', 'Bir xil', 'HCl da erimaydi'],
    togri: 0,
    izoh: '143-bet: ta\'sirlashuvchi modda tabiati omili.',
  },
  {
    savol: 'γ = 2 da harorat +40°C va +50°C ga ko\'tarilsa tezlik necha marta ortadi?',
    variantlar: ['4× va 5×', '16× (2⁴) va 32× (2⁵)', '8× va 10×', '64× va 128×'],
    togri: 1,
    izoh: '142–143-bet: 2⁴ = 16 va 2⁵ = 32 marta.',
  },
  {
    savol: 'Po\'lat idishda kislota saqlashda zanglashni to\'xtatish uchun nima qo\'shiladi?',
    variantlar: ['Katalizator', 'Ferment', 'Suv', 'Ingibitor (korroziyani sekinlashtiruvchi)'],
    togri: 3,
    izoh: '143-bet: ingibitorlar zararli reaksiyalarni sekinlashtiradi.',
  },
];

export default function S8Mavzu33() {
  const korgazmalar = [
    { nom: '1. υ = Δc/t (0,06 mol/l·s)', ikon: 'grafik', komponent: <KorgazmaTezlikTushuncha /> },
    { nom: '2. O₂ (5×) & P 3× → 27×', ikon: 'uchqun', komponent: <KorgazmaKonsentratsiyaVaBosim /> },
    { nom: '3. Vant-Goff (16×, 32×, 128×)', ikon: 'harorat', komponent: <KorgazmaHaroratVantGoff /> },
    { nom: '4. K>Na>Fe>Cu & Sirt', ikon: 'grafik', komponent: <KorgazmaTabiatVaSirt /> },
    { nom: '5. Katalizator & Ingibitor', ikon: 'filtr', komponent: <KorgazmaKatalizatorIngibitor /> },
    { nom: '6. 151–153-b (15 s, γ=4)', ikon: 'formula', komponent: <Korgazma33Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-33"
          nom="Reaksiya tezligi omillarini guruhlang"
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
          key="tezkor-33"
          nom="33-§: Reaksiya tezligi"
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
          key="zanjir-33"
          nom="Kinetika masalalari"
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
          key="duel-33"
          sarlavha="33-§: Reaksiya tezligi dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="33-§"
      mavzuNom="Kimyoviy reaksiyalarning tezligi"
      oldingiRaqam="32-§"
      oldingiNom="Sulfat kislota"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
