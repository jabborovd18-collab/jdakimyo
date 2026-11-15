'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 28-PARAGRAF
// "Ftor, brom, yod" (Darslik 121-129-betlar)
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
function KorgazmaFBrITabiat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Tabiiy manbalar va dispersion kuchlar (121-bet)"
      ikon="kristall"
      variantlar={[
        {
          id: 'manbalar',
          tugma: 'Minerallar & Manbalar',
          formula: 'Flyuorit CaF₂ • Kriolit Na₃[AlF₆] • Ftorapatit Ca₅(PO₄)₃F • NaBr • Laminariya (KIO₃)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Ftor, brom va yodning tabiiy minerallari va dengiz manbalari',
            tenglama: '3Ca₃(PO₄)₂·CaF₂ (Ca₅(PO₄)₃F)   •   NaBr, KBr, MgBr₂   •   Laminariya, NaIO₃, KIO₃',
            markazBelgi: 'F, Br, I',
            markazRang: '#fde047',
            tugunlar: [
              { nom: 'Flyuorit & Kriolit', belgi: 'CaF₂, Na₃[AlF₆]', rang: '#fde047' },
              { nom: 'Ftorapatit', belgi: 'Ca₅(PO₄)₃F', rang: '#38bdf8' },
              { nom: 'Brom (suyuq)', belgi: 'NaBr, MgBr₂', rang: '#fb923c' },
              { nom: 'Yod (qattiq)', belgi: 'Laminariya, KIO₃', rang: '#c084fc' },
            ],
            belgilar: [
              { k: 'Ftor', v: 'Flyuorit, kriolit, ftorapatit', rang: '#fde047' },
              { k: 'Brom', v: 'Tuz konlari va dengiz suvi', rang: '#fb923c' },
              { k: 'Yod', v: 'Dengiz o\'tlari, Chili selitrasi yondoshi', rang: '#c084fc' },
            ],
          },
          pastki: ['F: CaF₂, Na₃[AlF₆], 3Ca₃(PO₄)₂·CaF₂', 'Br: tuz koni va yer osti NaBr, MgBr₂', 'I: laminariya suvo\'tlari, NaIO₃/KIO₃'],
        },
        {
          id: 'dispersion',
          tugma: 'Gaz → Suyuq → Qattiq sababi',
          formula: 'Z ↑ → elektron bulut ↑ → qutblanuvchanlik va dispersion kuchlar ↑',
          tur: 'muvozanat',
          cfg: {
            sarlavha: 'Galogenlar agregat holatining dispersion kuchlar tufayli o\'zgarishi',
            tenglama: 'F₂ (38, gaz)  →  Cl₂ (71, gaz)  →  Br₂ (160, suyuq)  →  I₂ (254, kristall)',
            turi: 'ustunlar',
            ustunlar: [
              { nom: 'F₂ (gaz)', qiymat: 38, yorliq: 'och-sariq gaz', rang: '#fde047' },
              { nom: 'Cl₂ (gaz)', qiymat: 71, yorliq: 'sarg\'ish-yashil', rang: '#34d399' },
              { nom: 'Br₂ (suyuq)', qiymat: 160, yorliq: 'qo\'ng\'ir suyuq', rang: '#fb923c' },
              { nom: 'I₂ (qattiq)', qiymat: 254, yorliq: 'binafsha kristall', rang: '#c084fc' },
            ],
          },
          pastki: ['F₂ eng kichik molekula → gaz', 'Br₂ o\'rta dispersion kuch → qo\'ng\'ir suyuq', 'I₂ eng katta elektron bulut → qattiq kristall'],
        },
      ]}
    />
  );
}

function KorgazmaFtorSuperFaol() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Ftorning g'ayritabiiy faolligi (121–122-betlar)"
      ikon="uchqun"
      variantlar={[
        {
          id: 'shisha_suv',
          tugma: 'Shisha (SiO₂) & Suv yonadi!',
          formula: 'SiO₂ + 2F₂ = SiF₄↑ + O₂↑ + Q  •  2H₂O + 2F₂ = 4HF + O₂↑ + Q',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Ftor oqimida shisha (SiO₂) va suv (H₂O) yonib kislorod (O₂) chiqaradi!',
            tenglama: 'SiO₂ + 2F₂ = SiF₄↑ + O₂↑   |   2H₂O + 2F₂ = 4HF + O₂↑   |   Ni/Cu/Teflon idish',
            qizdir: true,
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'SiO₂ / H₂O',
            stakanSarlavha: 'Ftor oqimi',
            reagentlar: [
              { belgi: 'F₂', rang: '#fde047' },
              { belgi: 'SiO₂', rang: '#fb923c' },
            ],
            gazRang: '#38bdf8',
            gazBelgi: 'O₂↑ + SiF₄↑',
            belgilar: [
              { k: 'Shisha yonishi', v: 'SiO₂ + 2F₂ = SiF₄↑ + O₂↑ + Q', rang: '#fb923c' },
              { k: 'Suv yonishi', v: '2H₂O + 2F₂ = 4HF + O₂↑ + Q', rang: '#38bdf8' },
              { k: 'Saqlash (122-b)', v: 'Nikel, mis yoki teflon idishda', rang: '#34d399' },
            ],
          },
          pastki: ['Ftor atmosferasida shisha (SiO₂) ham yonadi', 'Suv ftor bilan HF va O₂↑ beradi', 'Ftor Ni, Cu yoki teflon idishda saqlanadi'],
        },
        {
          id: 'inert_istisno',
          tugma: 'Inert gaz (Xe) & 3 istisno',
          formula: 'Xe + F₂ = XeF₂ + Q (Kr, Au, Pt ham) • Kirmaydi: O₂, N₂, olmos',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Inert gazlar (Xe, Kr) va Au, Pt bilan birikadi; O₂, N₂, olmos bilan yo\'q!',
            tenglama: 'Xe + F₂ = XeF₂ + Q (Au, Pt ham)   |   Bevosita kirmaydi: O₂, N₂, olmos (C)',
            qizdir: true,
            suyuqlikRang: '#fde047',
            stakanBelgi: 'Xe + F₂',
            stakanSarlavha: 'Asl gaz & metall',
            reagentlar: [
              { belgi: 'Xe', rang: '#c084fc' },
              { belgi: 'F₂', rang: '#fde047' },
            ],
            gazRang: '#34d399',
            gazBelgi: 'XeF₂ / PtFₓ',
            belgilar: [
              { k: 'Inert & Asl', v: 'Xe, Kr, Au, Pt bilan birikadi', rang: '#fde047' },
              { k: 'Sovuqda yonadi', v: 'H₂, Br₂, I₂, S, P, C, Si, B, Pb, Fe', rang: '#fb923c' },
              { k: '3 ta istisno', v: 'O₂, N₂ va olmos bilan kirmaydi!', rang: '#38bdf8' },
            ],
          },
          pastki: ['Qizdirganda Xe, Kr, Au, Pt bilan ham birikadi', 'Sovuqda H₂, S, P, Si, B bilan yonib birikadi', 'O₂, N₂ va olmos (C) bilan to\'g\'ri kirishmaydi'],
        },
      ]}
    />
  );
}

function KorgazmaBrISiqibChiqarish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. O'zaro siqib chiqarish va H₂, H₂S bilan reaksiyalar"
      ikon="kolba"
      variantlar={[
        {
          id: 'siqish',
          tugma: 'F₂>Cl₂>Br₂>I₂ & I₂+ClO₃⁻',
          formula: 'F₂+2Cl⁻→Cl₂; Cl₂+2Br⁻→Br₂; Br₂+2I⁻→I₂ • I₂+2ClO₃⁻→2IO₃⁻+Cl₂',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Yengil galogen og\'ir ionni siqadi; xloratdan esa yod xlorni siqadi!',
            tenglama: 'Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂   |   Br₂ + 2I⁻ → 2Br⁻ + I₂   |   I₂ + 2ClO₃⁻ → 2IO₃⁻ + Cl₂',
            suyuqlikRang: '#fb923c',
            stakanBelgi: 'Galogen almashinuv',
            stakanSarlavha: 'Siqib chiqarish',
            reagentlar: [
              { belgi: 'Cl₂', rang: '#34d399' },
              { belgi: 'Br⁻', rang: '#fb923c' },
              { belgi: 'I⁻', rang: '#c084fc' },
            ],
            elektronJuft: { chap: 'Br⁻/I⁻', ong: 'Cl₂/Br₂', e: '2ē' },
            belgilar: [
              { k: 'Galogenid →', v: 'F₂ → Cl₂ → Br₂ → I₂ (siqadi)', rang: '#34d399' },
              { k: 'Xloratdan (tes.)', v: 'I₂ + 2ClO₃⁻ = 2IO₃⁻ + Cl₂', rang: '#c084fc' },
            ],
          },
          pastki: ['Yengil galogen og\'ir galogenid ionini siqadi', 'Br₂ + 2I⁻ → 2Br⁻ + I₂', 'Xloratdan yod xlorni siqadi: I₂ + 2ClO₃⁻'],
        },
        {
          id: 'h2_h2s',
          tugma: 'H₂+Br₂/I₂ & Br₂+H₂S (129-b)',
          formula: 'H₂+Br₂=2HBr • H₂+I₂⇄2HI-Q • Br₂+H₂S = 2HBr + S↓ (rangsizlanadi)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Bromli suv H₂S ta\'sirida rangsizlanib sariq oltingugurt (S↓) cho\'kadi',
            tenglama: 'H₂ + Br₂ = 2HBr  •  H₂ + I₂ ⇄ 2HI - Q (endotermik)  •  Br₂ + H₂S = 2HBr + S↓',
            suyuqlikRang: '#92400e',
            stakanBelgi: 'Bromli suv + H₂S',
            stakanSarlavha: '129-bet testi',
            chokmaRang: '#fde047',
            chokmaBelgi: 'S↓ (loyqa)',
            reagentlar: [
              { belgi: 'Br₂', rang: '#fb923c' },
              { belgi: 'H₂S', rang: '#fde047' },
            ],
            belgilar: [
              { k: 'H₂ + Br₂', v: 'Qizdirganda 2HBr', rang: '#fb923c' },
              { k: 'H₂ + I₂', v: 'H₂ + I₂ ⇄ 2HI - Q (qaytar!)', rang: '#c084fc' },
              { k: 'Br₂ + H₂S', v: 'Rangsizlanadi + S↓ cho\'kadi', rang: '#fde047' },
            ],
          },
          pastki: ['H₂ + Br₂ = 2HBr; H₂ + I₂ ⇄ 2HI - Q', 'HI hosil bo\'lishi qaytar va endotermik', 'Br₂ + H₂S = 2HBr + S↓ (rangsizlanib loyq.)'],
        },
      ]}
    />
  );
}

function KorgazmaJadval20Sifat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. 20-jadval: Ag⁺ va Pb²⁺ bilan sifat testi (122-bet)"
      ikon="tomchi"
      variantlar={[
        {
          id: 'cl_br',
          tugma: 'Cl⁻ (AgCl oq) & Br⁻ (sarg\'ish)',
          formula: 'AgCl↓ (oq pag\'a) • AgBr↓ (sarg\'ish) • PbCl₂↓ & PbBr₂↓ (oq)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: '20-jadval: Xlorid va bromid ionlarining AgNO₃ hamda Pb²⁺ bilan cho\'kmalari',
            tenglama: 'NaCl+AgNO₃=AgCl↓(oq)+NaNO₃   |   NaBr+AgNO₃=AgBr↓(sarg\'ish)+NaNO₃',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Ag⁺ + Cl⁻ / Br⁻',
            stakanSarlavha: '20-jadval (122-b)',
            chokmaRang: '#fef08a',
            chokmaBelgi: 'AgCl oq / AgBr sarg\'ish',
            reagentlar: [
              { belgi: 'Ag⁺', rang: '#e2e8f0' },
              { belgi: 'Cl⁻/Br⁻', rang: '#fde68a' },
            ],
            belgilar: [
              { k: 'Cl⁻ (Ag⁺ / Pb²⁺)', v: 'AgCl↓ oq pag\'a / PbCl₂↓ oq', rang: '#f8fafc' },
              { k: 'Br⁻ (Ag⁺ / Pb²⁺)', v: 'AgBr↓ sarg\'ish / PbBr₂↓ oq', rang: '#fde68a' },
            ],
          },
          pastki: ['Cl⁻: AgCl↓ (oq pag\'a), PbCl₂↓ (oq)', 'Br⁻: AgBr↓ (sarg\'ish), PbBr₂↓ (oq)', 'AgF suvda eriydi, cho\'kma bermaydi'],
        },
        {
          id: 'yodid',
          tugma: 'I⁻ (AgI sariq / PbI₂ yorqin sariq)',
          formula: 'AgNO₃ + NaI = AgI↓ (sariq) + NaNO₃ • Pb²⁺ + 2I⁻ = PbI₂↓ (yorqin sariq)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Yodid ioni (I⁻): AgI↓ (sariq) va PbI₂↓ (yorqin sariq) cho\'kmalari',
            tenglama: 'NaI + AgNO₃ = AgI↓ (sariq) + NaNO₃   |   Pb²⁺ + 2I⁻ = PbI₂↓ (yorqin sariq)',
            suyuqlikRang: '#facc15',
            stakanBelgi: 'I⁻ + Ag⁺ / Pb²⁺',
            stakanSarlavha: 'Yodid sifat testi',
            chokmaRang: '#facc15',
            chokmaBelgi: 'AgI↓ / PbI₂↓ (sariq)',
            reagentlar: [
              { belgi: 'Pb²⁺', rang: '#94a3b8' },
              { belgi: 'I⁻', rang: '#facc15' },
            ],
            belgilar: [
              { k: 'AgI↓ rangi', v: 'Sariq cho\'kma (kislotada erimaydi)', rang: '#fde047' },
              { k: 'PbI₂↓ rangi', v: 'Yorqin sariq cho\'kma', rang: '#facc15' },
            ],
          },
          pastki: ['I⁻ + Ag⁺ = AgI↓ (sariq cho\'kma)', 'I⁻ + Pb²⁺ = PbI₂↓ (yorqin sariq)', 'Cl⁻ → Br⁻ → I⁻ qatorida rang to\'qlashadi'],
        },
      ]}
    />
  );
}

function KorgazmaBiologikAhamiyat() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. F, Br, I biologik ahamiyati va qo'llanilishi (123-bet)"
      ikon="yurak"
      variantlar={[
        {
          id: 'biogen',
          tugma: 'F (1–2 mg), Br (1 mg), I (20–25 mg)',
          formula: 'F: 1–2 mg/kun (Teflon) • Br: 1 mg/kun (AgBr) • I: 20–25 mg (15 mg bezda, KIO₃)',
          tur: 'biogen',
          cfg: {
            sarlavha: 'Galogenlarning tirik organizm va texnikadagi o\'rni (123 va 126-betlar)',
            tenglama: 'F: 1–2 mg/kun (tish, teflon, freon) • Br: 1 mg/kun (asab, AgBr) • I: 20–25 mg (KIO₃)',
            markazBelgi: 'F, Br, I',
            markazRang: '#34d399',
            tugunlar: [
              { nom: 'Ftor (tish)', belgi: '1–2 mg/kun', rang: '#fde047' },
              { nom: 'Brom (asab)', belgi: '1 mg/kun', rang: '#fb923c' },
              { nom: 'Yod (jami)', belgi: '20–25 mg', rang: '#c084fc' },
              { nom: 'Qalqon. bez', belgi: '15 mg (Buqoq!)', rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Ftor (1–2 mg)', v: 'Teflon, freon, xladon, tish emali', rang: '#fde047' },
              { k: 'Brom (1 mg)', v: 'Asab/uyqu dorilari, foto (AgBr)', rang: '#fb923c' },
              { k: 'Yod (15 mg bez)', v: 'Buqoq oldini olish: KIO₃ (+5), 5% spirt', rang: '#c084fc' },
            ],
          },
          pastki: ['F: 1–2 mg/kun; Teflon, freon, xladon', 'Br: 1 mg/kun; asab dorisi va AgBr', 'I: 20–25 mg (15 mg bezda); KIO₃ (I⁺⁵)'],
        },
      ]}
    />
  );
}

function Korgazma28Masalalar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. 125–128-bet namunaviy masalalari"
      ikon="formula"
      variantlar={[
        {
          id: 'm3_6',
          tugma: '3-m (4 g Br₂) & 6-m (1,12 l HCl)',
          formula: '3-m: 1,58 g KMnO₄ + 9,15 ml 28% HCl • 6-m: 3,27 g 75% H₂SO₄',
          tur: 'hisob',
          cfg: {
            sarlavha: '125–128-bet: 4 g Br₂ uchun KMnO₄/HCl (ρ=1,14) va 1,12 l HCl → H₂SO₄',
            tenglama: '3-m: 0,025 mol Cl₂ → 0,01 mol KMnO₄ (1,58 g) + 0,08 mol HCl (9,15 ml) • 6-m: 3,27 g',
            qadamlar: [
              { belgi: '3-m: 4 g Br₂ (0,025 mol)', natija: '1,58 g KMnO₄', izoh: '2,92 g HCl (28%)', rang: '#fb923c' },
              { belgi: 'm(28%)=10,43 g (ρ=1,14)', natija: '9,15 ml HCl', izoh: '10,43 / 1,14', rang: '#38bdf8' },
              { belgi: '6-m: 1,12 l (0,05 mol) HCl', natija: '3,27 g 75% H₂SO₄', izoh: '2,45 g / 0,75', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '3-m: 28% HCl hajmi', foiz: 100, qiymat: '9,15 ml (1,58 g KMnO₄)', rang: '#fb923c' },
              { nom: '6-m: 75% H₂SO₄', foiz: 45, qiymat: '3,27 g eritma', rang: '#34d399' },
            ],
            javobBadge: '3-m: 1,58 g KMnO₄ + 9,15 ml HCl;  6-m: 3,27 g 75% H₂SO₄',
          },
          pastki: ['3-m: 4 g Br₂ → 0,56 l Cl₂ → 1,58 g KMnO₄', '2,92 g HCl → 10,43 g / 1,14 = 9,15 ml', '6-m: 0,025 mol H₂SO₄ (2,45 g)/0,75 = 3,27 g'],
        },
        {
          id: 'm5',
          tugma: '5-m: 12,8 g Me → 27 g MeCl₂ (Cu)',
          formula: 'm(Cl) = 14,2 g → E(Me) = 35,5·12,8/14,2 = 32 → Ar = 64 (Cu)',
          tur: 'hisob',
          cfg: {
            sarlavha: '126–127-bet 5-misol: 12,8 g II-valentli metalldan 27 g MeCl₂ olindi',
            tenglama: 'm(Cl) = 27 - 12,8 = 14,2 g   →   E(Me) = 35,5 · 12,8 / 14,2 = 32   →   Ar = 64',
            qadamlar: [
              { belgi: 'm(Cl) = 27 - 12,8', natija: '14,2 g Cl', izoh: '0,4 mol Cl atomi', rang: '#34d399' },
              { belgi: 'E(Me) = 35,5·12,8/14,2', natija: '32 g/mol', izoh: 'ekvivalent massa', rang: '#38bdf8' },
              { belgi: 'v = 2 → Ar = 32 · 2', natija: '64 (Mis Cu)', izoh: 'CuCl₂ xloridi', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Metall (12,8 g)', foiz: 47.4, qiymat: 'E = 32 (Cu)', rang: '#fbbf24' },
              { nom: 'Xlor (14,2 g)', foiz: 52.6, qiymat: 'E = 35,5', rang: '#34d399' },
            ],
            javobBadge: 'Javob: E(Me) = 32 → Ar = 64 → Mis (Cu)',
          },
          pastki: ['m(Cl) = 27 - 12,8 = 14,2 g', 'E(Me) = 35,5 · 12,8 / 14,2 = 32', 'Ar = 32 · 2 = 64 (Mis, Cu)'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (27-§) VA O'YINLAR (28-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: '27-§ (116-bet): Konsentrlangan xlorid kislota konsentratsiyasi va zichligi:',
    variantlar: [
      { matn: '10% li va ρ = 1,05', togri: false },
      { matn: '96% li va ρ = 1,84', togri: false },
      { matn: '37% li va ρ = 1,19 g/cm³', togri: true },
      { matn: '50% li va ρ = 1,5', togri: false },],
    izoh: '116-bet: kons. HCl ~37%, zichligi 1,19 g/cm³.',
  },
  {
    id: 't2',
    savol: 'HClO → HClO₂ → HClO₃ → HClO₄ qatorida eng kuchli kislota:',
    variantlar: [
      { matn: 'HClO₄ (perxlorat kislota, +7)', togri: true },
      { matn: 'HClO', togri: false },
      { matn: 'HClO₂', togri: false },
      { matn: 'HClO₃', togri: false },],
    izoh: '120-bet: +1 dan +7 gacha kuch va barqarorlik ortadi.',
  },
  {
    id: 't3',
    savol: 'Bertole tuzi (KClO₃) qaynoq ishqordan olinib qayerda qo\'llanadi?',
    variantlar: [
      { matn: 'Sovutkichda', togri: false },
      { matn: 'Faqat osh tuzida', togri: false },
      { matn: 'Shisha eritishda', togri: false },
      { matn: 'Gugurt sanoati, portlovchi modda, labda O₂ olish', togri: true },],
    izoh: '120-bet: KClO₃ barqaror kuchli oksidlovchi.',
  },
  {
    id: 't4',
    savol: 'O\'zbekistondagi osh tuzi (NaCl) konlari to\'g\'ri berilgan qator:',
    variantlar: [
      { matn: 'Chili va Ural', togri: false },
      { matn: 'Xo\'jaikon, Tubokat, Borsakelmas, Boybichakon, Oqqal\'a', togri: true },
      { matn: 'Muruntov va Olmalik', togri: false },
      { matn: 'Gazli va Muborak', togri: false },],
    izoh: '118-bet: O\'zbekistonning osh tuzi konlari.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'minerallar_ftor', nom: 'Manba & Ftor', tavsif: 'CaF₂, Shisha/Suv, 3 istisno' },
    { id: 'reaksiyalar', nom: 'Siqish & 20-jadval', tavsif: 'AgCl/Br/I, PbI₂, Br₂+H₂S' },
    { id: 'biogen_masala', nom: 'Biogen & Masalalar', tavsif: '15 mg I, KIO₃, 9,15 ml, Cu' },
  ],
  topshiriqlar: [
    { nom: 'Flyuorit CaF₂, Kriolit Na₃[AlF₆], Laminariya', qisqa: 'Ftorapatit Ca₅(PO₄)₃F', guruh: 'minerallar_ftor', izoh: '121-bet tabiiy manbalar.' },
    { nom: 'SiO₂ + 2F₂ → O₂↑; 2H₂O + 2F₂ → 4HF + O₂↑', qisqa: 'Shisha va suv yonadi!', guruh: 'minerallar_ftor', izoh: 'Ni, Cu, teflon idishda saqlanadi.' },
    { nom: 'O₂, N₂, olmos (C) bilan kirmaydi; Xe+F₂=XeF₂', qisqa: '3 istisno & inert gazlar', guruh: 'minerallar_ftor', izoh: '121–122-bet ftor xossasi.' },
    { nom: 'Cl₂+2Br⁻→Br₂; Br₂+2I⁻→I₂; I₂+2ClO₃⁻→Cl₂', qisqa: 'Xloratdan yod xlorni siqadi', guruh: 'reaksiyalar', izoh: '122-bet o\'rin olish.' },
    { nom: 'Br₂ + H₂S = 2HBr + S↓; H₂ + I₂ ⇄ 2HI - Q', qisqa: 'Bromli suv rangsizlanib S↓', guruh: 'reaksiyalar', izoh: '129-bet test va endotermik.' },
    { nom: 'AgCl oq, AgBr sarg\'ish, AgI/PbI₂ sariq', qisqa: '20-jadval (122-bet)', guruh: 'reaksiyalar', izoh: 'PbI₂↓ yorqin sariq cho\'kma.' },
    { nom: 'F 1–2 mg (Teflon), Br 1 mg (asab), I 15 mg bez', qisqa: 'Buqoq: KIO₃ (+5), 5% yod', guruh: 'biogen_masala', izoh: 'Jami 20–25 mg yod.' },
    { nom: '3-m: 4 g Br₂ → 1,58 g KMnO₄ + 9,15 ml 28% HCl', qisqa: '6-m: 1,12 l HCl → 3,27 g H₂SO₄', guruh: 'biogen_masala', izoh: '125–128-bet masalalari.' },
    { nom: '5-m: 12,8 g Me → 27 g MeCl₂ → Cu (64)', qisqa: 'E = 32, v = 2 → Ar = 64', guruh: 'biogen_masala', izoh: '126–127-bet misoli.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Dispersion kuch',
    savol: 'Galogenlarda F₂ (gaz) → Br₂ (suyuq) → I₂ (qattiq) o\'zgarishi sababi:',
    variantlar: ['Ion bog\'lanish', 'Vodorod bog\'i', 'Z ortib elektron bulut va dispersion kuchlar ortishi', 'Massa kamayishi'],
    togri: 2,
    izoh: '121-bet: katta elektron bulut kuchli qutblanadi.',
  },
  {
    belgi: 'Ftor + Shisha',
    savol: 'Ftor oqimida shisha (SiO₂) va suv (H₂O) yonganda qaysi gaz ajraladi?',
    variantlar: ['O₂↑ (kislorod)', 'H₂↑', 'N₂↑', 'Cl₂↑'],
    togri: 0,
    izoh: 'SiO₂ + 2F₂ = SiF₄↑ + O₂↑; 2H₂O + 2F₂ = 4HF + O₂↑.',
  },
  {
    belgi: '3 istisno',
    savol: 'Ftor qaysi 3 modda bilan to\'g\'ridan-to\'g\'ri reaksiyaga KIRISHMAYDI?',
    variantlar: ['Xe, Kr, Au', 'H₂, S, P', 'Na, Fe, Pb', 'O₂, N₂ va olmos (C)'],
    togri: 3,
    izoh: '122-bet: ftor O₂, N₂ va olmosga bevosita kirishmaydi.',
  },
  {
    belgi: 'Xlorat + I₂',
    savol: 'Kislota-xlorat eritmasidan oddiy yod xlorni qanday siqib chiqaradi?',
    variantlar: ['Siqib chiqara olmaydi', 'I₂ + 2ClO₃⁻ → 2IO₃⁻ + Cl₂', 'Faqat F₂ bilan', 'I₂ + 2Cl⁻ → Cl₂'],
    togri: 1,
    izoh: '122-bet: oddiy yod xloratni qaytarib Cl₂ chiqaradi.',
  },
  {
    belgi: '20-jadval',
    savol: 'Pb²⁺ bilan yorqin sariq cho\'kma beruvchi galogenid va formulasi:',
    variantlar: ['Cl⁻ (PbCl₂)', 'I⁻ (PbI₂↓)', 'Br⁻ (PbBr₂)', 'F⁻ (PbF₂)'],
    togri: 1,
    izoh: 'AgCl oq, AgBr sarg\'ish, AgI sariq, PbI₂ yorqin sariq.',
  },
  {
    belgi: 'Yod va Buqoq',
    savol: 'Qalqonsimon bezda necha mg yod saqlanadi va osh tuzi nima bilan yodlanadi?',
    variantlar: ['1 mg; NaI', '5 mg; CaF₂', '100 mg; Br₂', '15 mg (jami 20–25 mg); KIO₃ (I⁺⁵)'],
    togri: 3,
    izoh: 'Yetishmasa buqoq kasalligi kelib chiqadi.',
  },
  {
    belgi: 'Bromli suv',
    savol: '129-bet test: Qo\'ng\'ir bromli suvdan H₂S o\'tkazilganda nima bo\'ladi?',
    variantlar: ['Rangsizlanadi va sariq S↓ cho\'kadi', 'Qorayadi', 'O\'zgarmaydi', 'Gaz chiqmaydi'],
    togri: 0,
    izoh: 'Br₂ + H₂S = 2HBr + S↓.',
  },
  {
    belgi: '126-b 5-misol',
    savol: '12,8 g II-valentli metall xlorda yonib 27 g MeCl₂ bersa metallni toping:',
    variantlar: ['Fe (56)', 'Zn (65)', 'Cu (E = 32, Ar = 64)', 'Mg (24)'],
    togri: 2,
    izoh: 'm(Cl)=14,2 g → E(Me)=35,5·12,8/14,2=32 → Cu.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '123-bet d-topshiriq: NaBr → AgI',
    vazifa: 'Natriy bromiddan kumush yodid cho\'kmasigacha o\'zgarish zanjirini tartiblang:',
    tartib: [
      '1. 2NaBr + Cl₂ → 2NaCl + Br₂',
      '2. 2NaCl + 2H₂O (elektroliz) → Cl₂↑ + H₂↑ + 2NaOH',
      '3. Cl₂ + 2KI → 2KCl + I₂; H₂ + I₂ ⇄ 2HI',
      '4. HI + AgNO₃ → AgI↓ (sariq cho\'kma) + HNO₃',
    ],
    variantlar: [
      '3. Cl₂ + 2KI → 2KCl + I₂; H₂ + I₂ ⇄ 2HI',
      '1. 2NaBr + Cl₂ → 2NaCl + Br₂',
      '4. HI + AgNO₃ → AgI↓ (sariq cho\'kma) + HNO₃',
      '2. 2NaCl + 2H₂O (elektroliz) → Cl₂↑ + H₂↑ + 2NaOH',
    ],
  },
  {
    tur: '123-bet a-topshiriq: HCl → Cu',
    vazifa: 'Xlorid kislotadan sof mis olish o\'zgarishlar zanjirini joylang:',
    tartib: [
      '1. 4HCl + MnO₂ → Cl₂↑ + MnCl₂ + 2H₂O',
      '2. Cl₂ + Cu → CuCl₂',
      '3. CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl',
      '4. Cu(OH)₂ —t°→ CuO; CuO + H₂ → Cu + H₂O',
    ],
    variantlar: [
      '2. Cl₂ + Cu → CuCl₂',
      '4. Cu(OH)₂ —t°→ CuO; CuO + H₂ → Cu + H₂O',
      '1. 4HCl + MnO₂ → Cl₂↑ + MnCl₂ + 2H₂O',
      '3. CuCl₂ + 2NaOH → Cu(OH)₂↓ + 2NaCl',
    ],
  },
  {
    tur: '20-jadval: AgX cho\'kmalar rangi',
    vazifa: 'Cho\'kmalarni rang to\'qlashishi tartibida joylang (Cl⁻ → Br⁻ → I⁻):',
    tartib: [
      'AgCl↓ — oq pag\'a rangli cho\'kma',
      'AgBr↓ — sarg\'ish rangli cho\'kma',
      'AgI↓ — sariq rangli cho\'kma',
      'PbI₂↓ — yorqin sariq cho\'kma',
    ],
    variantlar: [
      'AgI↓ — sariq rangli cho\'kma',
      'AgCl↓ — oq pag\'a rangli cho\'kma',
      'PbI₂↓ — yorqin sariq cho\'kma',
      'AgBr↓ — sarg\'ish rangli cho\'kma',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Inson organizmi uchun ftor va bromning kunlik me\'yori (123-bet):',
    variantlar: ['Ftor 50 mg, Brom 100 mg', 'Ftor 1–2 mg, Brom 1 mg', 'Ikkalasi 10 g', 'Ftor 0,01 mg, Brom 5 g'],
    togri: 1,
    izoh: 'Kunlik me\'yor ftor uchun 1–2 mg, brom uchun 1 mg.',
  },
  {
    savol: 'Osh tuzini yodlashda ishlatiladigan kaliy yodat (KIO₃) da yodning OD:',
    variantlar: ['+1', '+7', '-1', '+5'],
    togri: 3,
    izoh: '+1 + x + 3·(-2) = 0 → x = +5.',
  },
  {
    savol: '3,01·10²³ ta H₂ (0,5 mol) yetarli Cl₂ bilan n.sh. da necha litr HCl beradi?',
    variantlar: ['22,4 l (1 mol HCl)', '11,2 l', '44,8 l', '5,6 l'],
    togri: 0,
    izoh: 'H₂ + Cl₂ = 2HCl → 0,5 mol H₂ dan 1 mol HCl = 22,4 l.',
  },
  {
    savol: 'Pb²⁺ bilan yorqin sariq cho\'kma hosil qiluvchi galogenid ioni:',
    variantlar: ['Cl⁻', 'Br⁻', 'I⁻ (PbI₂↓)', 'F⁻'],
    togri: 2,
    izoh: '20-jadval: PbI₂↓ yorqin sariq cho\'kma.',
  },
  {
    savol: 'Flyuorit va Kriolit minerallarining kimyoviy formulalari:',
    variantlar: ['NaBr va KBr', 'NaCl va KCl', 'CaF₂ va Na₃[AlF₆]', 'NaIO₃ va KIO₃'],
    togri: 2,
    izoh: '121-bet: ftor minerallari flyuorit, kriolit, ftorapatit.',
  },
  {
    savol: '3-misol (125-bet): 4 g Br₂ olish uchun necha g KMnO₄ va ml 28% HCl kerak?',
    variantlar: ['1,58 g KMnO₄ va 9,15 ml 28% HCl', '3,16 g va 18 ml', '5,6 g va 10 ml', '2 g va 5 ml'],
    togri: 0,
    izoh: '0,025 mol Cl₂ → 0,01 mol KMnO₄ (1,58 g) + 10,43/1,14 = 9,15 ml.',
  },
  {
    savol: '6-misol (127-bet): 1,12 l HCl olish uchun 75% H₂SO₄ dan necha g kerak?',
    variantlar: ['2,45 g', '3,27 g (2,45 / 0,75)', '4,9 g', '9,8 g'],
    togri: 1,
    izoh: '0,05 mol HCl → 0,025 mol H₂SO₄ (2,45 g)/0,75 = 3,27 g.',
  },
  {
    savol: 'Yod yetishmasa qaysi kasallik kelib chiqadi va qaysi eritma antiseptik?',
    variantlar: ['Anemiya; 1%', 'Gastrit; 10%', 'Rahit; 2%', 'Buqoq kasalligi; 5% spirtli yod'],
    togri: 3,
    izoh: '123-bet: 5% spirtli yod eritmasi antiseptik.',
  },
];

export default function S8Mavzu28() {
  const korgazmalar = [
    { nom: '1. Manba & Dispersion kuch', ikon: 'kristall', komponent: <KorgazmaFBrITabiat /> },
    { nom: '2. Ftor faolligi & 3 istisno', ikon: 'uchqun', komponent: <KorgazmaFtorSuperFaol /> },
    { nom: '3. Siqib chiqarish & H₂/H₂S', ikon: 'kolba', komponent: <KorgazmaBrISiqibChiqarish /> },
    { nom: '4. 20-jadval: Ag⁺ & Pb²⁺', ikon: 'tomchi', komponent: <KorgazmaJadval20Sifat /> },
    { nom: '5. Biogen: F, Br, I (KIO₃)', ikon: 'yurak', komponent: <KorgazmaBiologikAhamiyat /> },
    { nom: '6. 125–128-b masalalari', ikon: 'formula', komponent: <Korgazma28Masalalar /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-28"
          nom="Ftor, brom, yod xossalarini guruhlang"
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
          key="tezkor-28"
          nom="28-§: Ftor, brom, yod"
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
          key="zanjir-28"
          nom="Galogenlar o'zgarish zanjiri"
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
          key="duel-28"
          sarlavha="28-§: Ftor, brom, yod dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="28-§"
      mavzuNom="Ftor, brom, yod"
      oldingiRaqam="27-§"
      oldingiNom="Xlorid kislota"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
