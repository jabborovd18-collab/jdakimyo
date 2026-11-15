'use client';
// ============================================================
// JDA KIMYO - 8-SINF, IV BOB, 26-PARAGRAF
// "Ekvivalent qonuni" (Darslik 111-115-betlar)
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
function KorgazmaEkvivalentTushuncha() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. Ekvivalent tushunchasi (1820, Vollaston, 111-bet)"
      ikon="atom"
      variantlar={[
        {
          id: 'asos',
          tugma: 'E(H)=1, E(O)=8, E(Ca)=20',
          formula: '1 mol H (1 g) yoki 8 g O bilan birikadigan massa • Vollaston (1820)',
          tur: 'molekula',
          cfg: {
            sarlavha: 'Ekvivalent — 1 mol H (1 g) yoki 8 g O bilan reaksiyaga kirishuvchi massa',
            tenglama: 'E(H) = 1 g/mol   •   E(O) = 8 g/mol   •   CaO da E(Ca) = 40/2 = 20 g/mol',
            rejim: 'bog',
            bogJuft: { chap: 'Ca²⁺', chapRang: '#38bdf8', ong: 'O²⁻', ongRang: '#fb7185', siljish: 0 },
            metrikalar: [
              { nom: 'E(H) va E(O)', qiymat: '1 va 8 g/mol', foiz: 55, rang: '#fb7185' },
              { nom: 'CaO da E(Ca)', qiymat: '40 / 2 = 20', foiz: 85, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Tarix', v: '1820-yil V. Vollaston', rang: '#fde047' },
              { k: 'Birligi', v: 'g/mol (ekvivalent massa)', rang: '#34d399' },
            ],
          },
          pastki: ['1820-yil V. Vollaston kiritgan', 'Etalon: E(H) = 1, E(O) = 8 g/mol', 'CaO da 40 g Ca 16 g O → E(Ca) = 20'],
        },
        {
          id: 'co_co2',
          tugma: 'O\'zgaruvchan: CO vs CO₂',
          formula: 'CO (v=2) da E(C)=6 • CO₂ (v=4) da E(C)=3 • nisbat = 2 : 1',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Ekvivalent valentlikka qarab o\'zgaradi: CO (6) va CO₂ (3)',
            tenglama: 'E(C) in CO = 12 / 2 = 6 g/mol   |   E(C) in CO₂ = 12 / 4 = 3 g/mol',
            qadamlar: [
              { belgi: 'CO (C valentligi II)', natija: 'E(C) = 6 g/mol', izoh: '12 g C + 16 g O', rang: '#38bdf8' },
              { belgi: 'CO₂ (C valentligi IV)', natija: 'E(C) = 3 g/mol', izoh: '12 g C + 32 g O', rang: '#34d399' },
              { belgi: 'E(C) nisbati', natija: '6 : 3 = 2 : 1', izoh: 'Karrali nisbat', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'CO da E(C)', foiz: 100, qiymat: '6 g/mol (v=2)', rang: '#38bdf8' },
              { nom: 'CO₂ da E(C)', foiz: 50, qiymat: '3 g/mol (v=4)', rang: '#34d399' },
            ],
            javobBadge: 'Ekvivalent valentlikka bog\'liq: CO da 6, CO₂ da 3 g/mol',
          },
          pastki: ['Ekvivalent doimiy emas, valentlikka bog\'liq', 'CO da C II-valent → E(C) = 6', 'CO₂ da C IV-valent → E(C) = 3'],
        },
      ]}
    />
  );
}

function KorgazmaModdaSinflariE() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="2. Element, oksid, asos, kislota, tuz ekvivalenti (112–113-b)"
      ikon="formula"
      variantlar={[
        {
          id: 'el_oksid',
          tugma: 'Element & Oksid E',
          formula: 'E(Al)=9 • Fe²⁺=28 • Fe³⁺=18,67 • Cr₂O₃=25,33 • CrO₃=16,67',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Element: E = A/v   |   Oksid: E = M / (v · n)',
            tenglama: 'Al(III)=27/3=9  •  Fe(II)=28; Fe(III)=18,67  •  Cr₂O₃=152/6=25,33; CrO₃=100/6=16,67',
            qadamlar: [
              { belgi: 'E(Al) = 27 / 3', natija: '9 g/mol', izoh: 'Fe²⁺=28; Fe³⁺=18,67', rang: '#38bdf8' },
              { belgi: 'E(Cr₂O₃) = 152 / (3·2)', natija: '25,33 g/mol', izoh: 'v·n = 3·2 = 6', rang: '#34d399' },
              { belgi: 'E(CrO₃) = 100 / (6·1)', natija: '16,67 g/mol', izoh: 'Cr(VI), v·n = 6', rang: '#fbbf24' },
            ],
            taqqosBars: [
              { nom: 'Fe²⁺ / Fe³⁺', foiz: 85, qiymat: '28 / 18,67 g/mol', rang: '#38bdf8' },
              { nom: 'Cr₂O₃ / CrO₃', foiz: 75, qiymat: '25,33 / 16,67 g/mol', rang: '#fbbf24' },
            ],
            javobBadge: 'E(element) = A / v;   E(oksid) = M / (elementlar soni · valentlik)',
          },
          pastki: ['Element: E(Al)=9, E(Fe²⁺)=28, E(Fe³⁺)=18,67', 'Cr₂O₃: 152 / (2·3) = 25,33 g/mol', 'CrO₃: 100 / 6 = 16,67 g/mol'],
        },
        {
          id: 'asos_kislota_tuz',
          tugma: 'Asos, Kislota, Tuz E',
          formula: 'Pb(OH)₂=120,5 • Al(OH)₃=26 • HPO₃=80 • H₂SO₄=49 • AlPO₄=40,67 • Mg₃(PO₄)₂=43,67 • KClO=90,5',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Asos, kislota va tuzlarning ekvivalent massalari (112–113-bet)',
            tenglama: 'Pb(OH)₂=120,5; Al(OH)₃=26  |  HPO₃=80; H₂SO₄=49  |  AlPO₄=40,67; Mg₃(PO₄)₂=43,67; KClO=90,5',
            qadamlar: [
              { belgi: 'Asoslar (M/OH soni)', natija: 'Pb(OH)₂=120,5', izoh: 'Al(OH)₃ = 78/3 = 26', rang: '#38bdf8' },
              { belgi: 'Kislota (M/H soni)', natija: 'H₂SO₄ = 49', izoh: 'HPO₃ = 80/1 = 80', rang: '#fb7185' },
              { belgi: 'Tuz: M / (v·n)', natija: 'AlPO₄ = 40,67', izoh: 'Mg₃(PO₄)₂=43,67; KClO=90,5', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Al(OH)₃ / H₂SO₄', foiz: 50, qiymat: '26 / 49 g/mol', rang: '#fb7185' },
              { nom: 'Mg₃(PO₄)₂ / KClO', foiz: 90, qiymat: '43,67 / 90,5 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Tuzlar: E(AlPO₄)=122/3=40,67; E(Mg₃(PO₄)₂)=262/6=43,67; E(KClO)=90,5',
          },
          pastki: ['Asos: Pb(OH)₂=120,5; Al(OH)₃=78/3=26', 'Kislota: HPO₃=80; H₂SO₄=98/2=49', 'Tuz: AlPO₄=40,67; Mg₃(PO₄)₂=43,67; KClO=90,5'],
        },
      ]}
    />
  );
}

function KorgazmaEkvivalentHajm() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Gazlarning ekvivalent hajmi V_E (113-bet)"
      ikon="kolba"
      variantlar={[
        {
          id: 've_gaz',
          tugma: 'V_E(H₂)=11,2; V_E(O₂)=5,6 l',
          formula: '1 mol ekvivalent H₂ = 11,2 l • 1 mol ekvivalent O₂ = 5,6 l (n.sh.)',
          tur: 'reaksiya',
          cfg: {
            sarlavha: 'Vodorod (1 g = 0,5 mol) → 11,2 l;  Kislorod (8 g = 0,25 mol) → 5,6 l',
            tenglama: 'V_E(H₂) = 22,4 / 2 = 11,2 l/mol   •   V_E(O₂) = 22,4 / 4 = 5,6 l/mol',
            suyuqlikRang: '#38bdf8',
            stakanBelgi: 'Ekvivalent hajm',
            stakanSarlavha: 'n.sh. gazlar',
            reagentlar: [
              { belgi: 'H⁺', rang: '#38bdf8' },
              { belgi: 'O₂', rang: '#fb7185' },
            ],
            gazRang: '#fde047',
            gazBelgi: '11,2 l H₂ | 5,6 l O₂',
            belgilar: [
              { k: 'V_E(H₂)', v: '11,2 l/mol (11 200 ml)', rang: '#38bdf8' },
              { k: 'V_E(O₂)', v: '5,6 l/mol (5 600 ml)', rang: '#fb7185' },
              { k: 'Formula', v: 'm / V_gaz = E / V_E', rang: '#34d399' },
            ],
          },
          pastki: ['V_E(H₂) = 11,2 l/mol = 11 200 ml', 'V_E(O₂) = 5,6 l/mol = 5 600 ml', 'Hajm nisbati: 11,2 : 5,6 = 2 : 1'],
        },
        {
          id: 've_misol',
          tugma: '0,36 g Me + 168 ml O₂ → Mg',
          formula: 'E(Me) = 0,36 · 5600 / 168 = 12 g/mol → Mg (Ar = 24)',
          tur: 'hisob',
          cfg: {
            sarlavha: '0,36 g metall 168 ml kislorod bilan oksidlansa metallni toping',
            tenglama: 'E(Me) = m(Me) · V_E(O₂) / V(O₂) = 0,36 · 5600 / 168 = 12 g/mol',
            qadamlar: [
              { belgi: 'V(O₂) va V_E(O₂)', natija: '168 ml / 5600 ml', izoh: 'bir xil ml da', rang: '#38bdf8' },
              { belgi: 'E(Me) = 0,36·5600/168', natija: '12 g/mol', izoh: 'ekvivalent massa', rang: '#fde047' },
              { belgi: 'v = 2 → Ar = 12 · 2', natija: '24 (Magniy Mg)', izoh: 'MgO oksidi', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'E(Mg)', foiz: 50, qiymat: '12 g/mol', rang: '#fde047' },
              { nom: 'Ar(Mg) = E · 2', foiz: 100, qiymat: '24 g/mol', rang: '#34d399' },
            ],
            javobBadge: 'Javob: E(Me) = 12 g/mol → Magniy (Mg, Ar = 24)',
          },
          pastki: ['V_E(O₂) = 5600 ml/mol ishlatiladi', 'E(Me) = 0,36·5600 / 168 = 12 g/mol', 'v = 2 da Ar = 24 (Magniy Mg)'],
        },
      ]}
    />
  );
}

function KorgazmaEkvivalentQonun() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Ekvivalentlar qonuni: m₁ / m₂ = E₁ / E₂ (113-bet)"
      ikon="magnit"
      variantlar={[
        {
          id: 'na_cl',
          tugma: '1,5 g Na → 3,81 g NaCl',
          formula: 'm(Cl) = 3,81 - 1,5 = 2,31 g → E(Na) = 1,5·35,5/2,31 = 23',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Moddalar bir-biri bilan ekvivalentlariga proporsional kirishadi',
            tenglama: 'm₁ / m₂ = E₁ / E₂   →   E(Na) / 35,5 = 1,5 / (3,81 - 1,5)',
            qadamlar: [
              { belgi: 'm(Cl) = 3,81 - 1,5', natija: '2,31 g Cl', izoh: 'E(Cl) = 35,5', rang: '#34d399' },
              { belgi: 'E(Na) = 1,5 · 35,5 / 2,31', natija: '23 g/mol', izoh: 'proporsiya', rang: '#38bdf8' },
              { belgi: 'Tekshiruv (v=1)', natija: 'Ar(Na) = 23', izoh: 'NaCl tuzi', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Natriy (1,5 g)', foiz: 39, qiymat: 'E(Na) = 23', rang: '#38bdf8' },
              { nom: 'Xlor (2,31 g)', foiz: 61, qiymat: 'E(Cl) = 35,5', rang: '#34d399' },
            ],
            javobBadge: 'Javob: m₁/m₂ = E₁/E₂ → E(Na) = 23 g/mol',
          },
          pastki: ['m(Cl) = 3,81 - 1,5 = 2,31 g', 'E(Na) = 1,5 · 35,5 / 2,31 = 23', 'Ekvivalentlar qonuni: m₁/m₂ = E₁/E₂'],
        },
        {
          id: 'kislota_naoh',
          tugma: '1,225 g kislota + 1 g NaOH',
          formula: 'E(NaOH) = 40 → E(kislota) = 1,225 · 40 / 1 = 49 g/mol',
          tur: 'hisob',
          cfg: {
            sarlavha: '1,225 g kislotani neytrallashga 1 g NaOH sarflandi: E(kislota)=?',
            tenglama: 'E(kislota) / E(NaOH) = 1,225 / 1   →   E(kislota) = 1,225 · 40 = 49 g/mol',
            qadamlar: [
              { belgi: 'E(NaOH) = 40 / 1', natija: '40 g/mol', izoh: 'm(NaOH) = 1 g', rang: '#38bdf8' },
              { belgi: 'E(k) = 1,225 · 40 / 1', natija: '49 g/mol', izoh: '98 / 2 = 49', rang: '#fb7185' },
              { belgi: 'Taxminiy kislota', natija: 'H₂SO₄ (M=98)', izoh: '2 negizli', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'NaOH (1 g)', foiz: 45, qiymat: 'E = 40 g/mol', rang: '#38bdf8' },
              { nom: 'Kislota (1,225 g)', foiz: 55, qiymat: 'E = 49 g/mol', rang: '#fb7185' },
            ],
            javobBadge: 'Javob: E(kislota) = 49 g/mol (H₂SO₄)',
          },
          pastki: ['E(NaOH) = 40 g/mol', 'E(k) = 1,225 × 40 / 1 = 49 g/mol', 'H₂SO₄ uchun 98 / 2 = 49 g/mol'],
        },
      ]}
    />
  );
}

function Korgazma114Misollar() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 114–115-bet yechilgan misollari"
      ikon="grafik"
      variantlar={[
        {
          id: 'cu_cl',
          tugma: '47,26 g Cu + 52,7 g Cl',
          formula: 'E(Cu) = 47,26 · 35,45 / 52,7 = 31,8 g/mol',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Mis xloridi (47,26 g Cu va 52,7 g Cl) da mis ekvivalenti',
            tenglama: 'E(Cu) / 35,45 = 47,26 / 52,7   →   E(Cu) = 31,8 g/mol (v = 2)',
            qadamlar: [
              { belgi: 'E(Cl) qiymati', natija: '35,45 g/mol', izoh: 'm(Cl) = 52,7 g', rang: '#34d399' },
              { belgi: '47,26 · 35,45 / 52,7', natija: '31,8 g/mol', izoh: 'E(Cu) topildi', rang: '#f97316' },
              { belgi: 'Tekshiruv: 63,6 / 2', natija: 'Cu(II) (CuCl₂)', izoh: 'v = 2 valentli', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Mis (47,26 g)', foiz: 47, qiymat: 'E = 31,8', rang: '#f97316' },
              { nom: 'Xlor (52,7 g)', foiz: 53, qiymat: 'E = 35,45', rang: '#34d399' },
            ],
            javobBadge: 'Javob: E(Cu) = 31,8 g/mol (CuCl₂)',
          },
          pastki: ['E(Cl) = 35,45 g/mol olinadi', '47,26 × 35,45 / 52,7 = 31,8', 'Ar(Cu) ≈ 63,6 → valentlik = 2'],
        },
        {
          id: 'al2o3_p2o5',
          tugma: 'Al₂O₃ (52,94%) & 2 g P→P₂O₅',
          formula: 'Al₂O₃: E(Al)=9 • 2 g P → 4,58 g P₂O₅ (m(O)=2,58) → E(P)=6,2',
          tur: 'hisob',
          cfg: {
            sarlavha: '114–115-bet: Al₂O₃ tarkibi va fosforning yonishidan E(P) topish',
            tenglama: 'E(Al) = 52,94·8 / 47,06 = 9   |   E(P) = 2 · 8 / (4,58 - 2) = 6,2',
            qadamlar: [
              { belgi: 'Al₂O₃: 52,94% Al / 47,06% O', natija: 'E(Al) = 9', izoh: '52,94·8 / 47,06', rang: '#38bdf8' },
              { belgi: 'm(O) = 4,58 - 2', natija: '2,58 g O', izoh: 'P₂O₅ hosil bo\'ldi', rang: '#fb7185' },
              { belgi: 'E(P) = 2 · 8 / 2,58', natija: '6,2 g/mol', izoh: '31 / 5 = 6,2 (P⁵⁺)', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: 'Al₂O₃ da Al (52,94%)', foiz: 53, qiymat: 'E(Al) = 9', rang: '#38bdf8' },
              { nom: '2 g P → 4,58 g P₂O₅', foiz: 70, qiymat: 'E(P) = 6,2', rang: '#34d399' },
            ],
            javobBadge: 'Javoblar: E(Al) = 9 g/mol;  E(P) = 6,2 g/mol',
          },
          pastki: ['52,94 · 8 / 47,06 = 9 g/mol (Al)', 'm(O) = 4,58 - 2 = 2,58 g', 'E(P) = 2 · 8 / 2,58 = 6,2 (31/5)'],
        },
      ]}
    />
  );
}

function Korgazma26Mustaqil() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Mustaqil masalalar (115-bet: 3, 4, 5, 10-masalalar)"
      ikon="grafik"
      variantlar={[
        {
          id: 'm3_4',
          tugma: '3-m (Ca) & 4-m (PbO₂)',
          formula: '3-m: 1 g Me→0,05 g H₂ → E=20, Ar=40 (Ca) • 4-m: 86,6% Pb → PbO₂',
          tur: 'hisob',
          cfg: {
            sarlavha: '3-masala (Ca topish) va 4-masala (86,6% Pb li oksid formulasi)',
            tenglama: '3-m: E = 1·1/0,05 = 20 → Ca(40)   |   4-m: E(Pb)=86,6·8/13,4 = 51,7 → v=207/51,7=4 (PbO₂)',
            qadamlar: [
              { belgi: '3-m: 1 g Me → 0,05 g H₂', natija: 'E = 20 → Ca', izoh: 'v=2 → Ar=40', rang: '#38bdf8' },
              { belgi: '4-m: 86,6% Pb / 13,4% O', natija: 'E(Pb) = 51,7', izoh: '86,6·8 / 13,4', rang: '#fbbf24' },
              { belgi: 'v = 207 / 51,7', natija: 'v = 4 → PbO₂', izoh: 'Qo\'rg\'oshin(IV) oksid', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '3-m: Ca (E=20, v=2)', foiz: 65, qiymat: 'Ar = 40 (Ca)', rang: '#38bdf8' },
              { nom: '4-m: PbO₂ (E=51,7)', foiz: 100, qiymat: 'v = 4 (PbO₂)', rang: '#34d399' },
            ],
            javobBadge: '3-masala: Ca (Ar=40);  4-masala: PbO₂ (v=4)',
          },
          pastki: ['3-m: E = 1·1/0,05 = 20 → v=2 → Ar=40 (Ca)', '4-m: E(Pb) = 86,6·8/13,4 = 51,7', 'v = 207 / 51,7 = 4 → PbO₂'],
        },
        {
          id: 'm5_10',
          tugma: '5-m (Cu) & 10-m (Fe³⁺)',
          formula: '5-m: 20% O → E=32 → Cu (64) • 10-m: 34,42% Me / 65,58% Cl → E=18,63 (Fe³⁺)',
          tur: 'hisob',
          cfg: {
            sarlavha: '5-masala (II-valentli oksidda 20% O) va 10-masala (34,42% Me xlorid)',
            tenglama: '5-m: E = 80·8/20 = 32 → Ar=64 (Cu)   |   10-m: E = 34,42·35,45/65,58 = 18,63 (Fe³⁺)',
            qadamlar: [
              { belgi: '5-m: 80% Me / 20% O', natija: 'E(Me) = 32', izoh: '80·8/20 = 32', rang: '#f97316' },
              { belgi: 'v = 2 → Ar = 32 · 2', natija: '64 (Mis Cu)', izoh: 'CuO oksidi', rang: '#fde047' },
              { belgi: '10-m: 34,42% Me / 65,58% Cl', natija: 'E = 18,63 (Fe³⁺)', izoh: '56 / 3 = 18,67', rang: '#34d399' },
            ],
            taqqosBars: [
              { nom: '5-m: 20% O → E=32', foiz: 80, qiymat: 'Ar = 64 (Cu)', rang: '#f97316' },
              { nom: '10-m: 34,42% Me', foiz: 100, qiymat: 'E = 18,63 (FeCl₃)', rang: '#34d399' },
            ],
            javobBadge: '5-masala: Cu (Ar=64);  10-masala: Fe³⁺ (FeCl₃, E≈18,63)',
          },
          pastki: ['5-m: 80·8/20 = 32 → v=2 → Ar=64 (Cu)', '10-m: 34,42·35,45/65,58 = 18,63', '56 / 3 = 18,67 → Temir(III) xlorid FeCl₃'],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (25-§) VA O'YINLAR (26-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'n.sh. (0°C, 101,3 kPa) da 1 mol gazning molyar hajmi:',
    variantlar: [
      { matn: '5,6 l/mol', togri: false },
      { matn: '11,2 l/mol', togri: false },
      { matn: 'Vm = 22,4 l/mol = 0,0224 m³/mol', togri: true },
      { matn: '18 l/mol', togri: false },],
    izoh: '25-§ 19-jadval: n.sh. da Vm = 22,4 l/mol.',
  },
  {
    id: 't2',
    savol: 'Zichligi ρ = 2,86 g/l bo\'lgan gazning molyar massasi va formulasi:',
    variantlar: [
      { matn: '64 g/mol (SO₂)', togri: true },
      { matn: '44 g/mol (CO₂)', togri: false },
      { matn: '71 g/mol (Cl₂)', togri: false },
      { matn: '2 g/mol (H₂)', togri: false },],
    izoh: 'M = 2,86 · 22,4 = 64 g/mol (SO₂).',
  },
  {
    id: 't3',
    savol: 'Geliyga nisbatan zichligi D_He = 31 bo\'lgan oq fosfor bug\'ining formulasi:',
    variantlar: [
      { matn: 'P', togri: false },
      { matn: 'P₂', togri: false },
      { matn: 'PH₃', togri: false },
      { matn: 'P₄ (M = 124 g/mol)', togri: true },],
    izoh: 'M = 31 · 4 = 124; 124 / 31 = 4 → P₄.',
  },
  {
    id: 't4',
    savol: '40% CO va 60% CO₂ aralashmasining vodorodga nisbatan zichligi D_H2:',
    variantlar: [
      { matn: '37,6', togri: false },
      { matn: '18,8 (M_o\'rt = 37,6)', togri: true },
      { matn: '14', togri: false },
      { matn: '28', togri: false },],
    izoh: 'M_o\'rt = 0,4·28 + 0,6·44 = 37,6 → 37,6/2 = 18,8.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'element_sinf', nom: 'Element & Sinflar', tavsif: 'E=A/v, H₂SO₄, AlPO₄' },
    { id: 'qonun_ve', nom: 'Qonun & V_E', tavsif: 'm₁/m₂=E₁/E₂, 11,2 & 5,6 l' },
    { id: 'masalalar', nom: '114–115-b Masalalar', tavsif: 'Cu, Al, P, Ca, PbO₂, Fe³⁺' },
  ],
  topshiriqlar: [
    { nom: 'E(H)=1, E(O)=8; CO da 6, CO₂ da 3', qisqa: '1820 Vollaston', guruh: 'element_sinf', izoh: 'Ekvivalent valentlikka bog\'liq.' },
    { nom: 'Al=9; Fe²⁺=28; Fe³⁺=18,67; Cr₂O₃=25,33', qisqa: 'CrO₃ = 16,67 g/mol', guruh: 'element_sinf', izoh: 'E(element)=A/v; E(oksid)=M/(v·n).' },
    { nom: 'H₂SO₄=49; Al(OH)₃=26; AlPO₄=40,67', qisqa: 'Mg₃(PO₄)₂=43,67; KClO=90,5', guruh: 'element_sinf', izoh: '112–113-bet asos, kislota, tuz.' },
    { nom: 'V_E(H₂) = 11,2 l/mol; V_E(O₂) = 5,6 l/mol', qisqa: '0,36 g Me + 168 ml O₂ → 12 (Mg)', guruh: 'qonun_ve', izoh: 'V_E = 22,4 / (valentlik · atom).' },
    { nom: '1,5 g Na → 3,81 g NaCl → E(Na) = 23', qisqa: 'm(Cl) = 2,31 g', guruh: 'qonun_ve', izoh: 'm₁/m₂ = E₁/E₂ qonuni.' },
    { nom: '1,225 g kislota + 1 g NaOH(40) → E = 49', qisqa: 'H₂SO₄ kislota', guruh: 'qonun_ve', izoh: '1,225 · 40 = 49 g/mol.' },
    { nom: '47,26 g Cu + 52,7 g Cl → E(Cu) = 31,8', qisqa: 'Al₂O₃ 52,94% → E(Al)=9', guruh: 'masalalar', izoh: '2 g P → 4,58 g P₂O₅ → E(P)=6,2.' },
    { nom: '3-m: 1 g → 0,05 g H₂ → Ca; 4-m: 86,6% Pb → PbO₂', qisqa: 'E=20 (v=2); E=51,7 (v=4)', guruh: 'masalalar', izoh: '115-bet 3 va 4-masalalar.' },
    { nom: '5-m: 20% O → Cu(64); 10-m: 34,42% Me → Fe³⁺', qisqa: 'E=32; E=18,63', guruh: 'masalalar', izoh: '115-bet 5 va 10-masalalar.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'Element E',
    savol: 'Elementning ekvivalent massasini hisoblash formulasi va E(Fe²⁺), E(Fe³⁺):',
    variantlar: ['56 va 112', 'E = A·v', 'E = A/v → Fe²⁺=28, Fe³⁺=18,67', '14 va 9,3'],
    togri: 2,
    izoh: '56 / 2 = 28; 56 / 3 = 18,67 g/mol.',
  },
  {
    belgi: 'Oksid & Tuz',
    savol: 'AlPO₄ va KClO tuzlarining ekvivalent massalari:',
    variantlar: ['40,67 (122/3) va 90,5', '122 va 90,5', '61 va 45', '30 va 181'],
    togri: 0,
    izoh: '113-bet: Al(III) → 122/3 = 40,67; K(I) → 90,5/1 = 90,5.',
  },
  {
    belgi: 'V_E(O₂)',
    savol: 'Kislorodning ekvivalent hajmi V_E(O₂) n.sh. da necha litr/mol?',
    variantlar: ['22,4 l/mol', '11,2 l/mol', '1,12 l/mol', '5,6 l/mol (5600 ml)'],
    togri: 3,
    izoh: '8 g O₂ = 0,25 mol → 0,25 · 22,4 = 5,6 l/mol.',
  },
  {
    belgi: '0,36 g Me',
    savol: '0,36 g metall 168 ml O₂ bilan reaksiyaga kirishsa E(Me) nechaga teng?',
    variantlar: ['24 g/mol', '12 g/mol (Mg)', '9 g/mol', '20 g/mol'],
    togri: 1,
    izoh: '0,36 · 5600 / 168 = 12 g/mol.',
  },
  {
    belgi: '1,225 g kislota',
    savol: '1,225 g kislota 1 g NaOH (E=40) bilan to\'liq reaksiyaga kirishsa E(kislota):',
    variantlar: ['36,5 g/mol', '49 g/mol (H₂SO₄)', '98 g/mol', '63 g/mol'],
    togri: 1,
    izoh: 'E(k) = 1,225 · 40 / 1 = 49 g/mol.',
  },
  {
    belgi: '4-masala',
    savol: 'Tarkibida 86,6% Pb va 13,4% O bo\'lgan oksidda Pb valentligi va formulasi:',
    variantlar: ['II, PbO', 'I, Pb₂O', 'III, Pb₂O₃', 'IV, PbO₂ (E=51,7)'],
    togri: 3,
    izoh: '86,6·8/13,4 = 51,7; v = 207 / 51,7 = 4 → PbO₂.',
  },
  {
    belgi: '5-masala',
    savol: 'II valentli metall oksidida 20% kislorod bo\'lsa metallni toping:',
    variantlar: ['Cu (E=32, Ar=64)', 'Zn (Ar=65)', 'Fe (Ar=56)', 'Ca (Ar=40)'],
    togri: 0,
    izoh: '80·8/20 = 32; Ar = 32 · 2 = 64 (Mis Cu).',
  },
  {
    belgi: '10-masala',
    savol: '34,42% Me va 65,58% Cl li xloriddagi metallning ekvivalent massasi:',
    variantlar: ['28 g/mol', '9 g/mol', '18,63 g/mol (Fe³⁺)', '23 g/mol'],
    togri: 2,
    izoh: '34,42 · 35,45 / 65,58 = 18,63 ≈ 56/3 (Fe³⁺).',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: '115-bet 4-masala: 86,6% Pb → PbO₂',
    vazifa: 'Qo\'rg\'oshin oksidi formulasini topish qadamlarini tartiblang:',
    tartib: [
      '1. w(O) = 100 - 86,6 = 13,4% kislorod',
      '2. E(Pb) = 86,6 · 8 / 13,4 = 51,7 g/mol',
      '3. Valentlik v = Ar(Pb) / E(Pb) = 207 / 51,7 = 4',
      '4. Oksid formulasi: PbO₂',
    ],
    variantlar: [
      '3. Valentlik v = Ar(Pb) / E(Pb) = 207 / 51,7 = 4',
      '1. w(O) = 100 - 86,6 = 13,4% kislorod',
      '4. Oksid formulasi: PbO₂',
      '2. E(Pb) = 86,6 · 8 / 13,4 = 51,7 g/mol',
    ],
  },
  {
    tur: '115-bet: 2 g P → 4,58 g P₂O₅',
    vazifa: 'Fosfor ekvivalentini topish bosqichlarini tartiblang:',
    tartib: [
      '1. Berilgan: m(P) = 2 g; m(P₂O₅) = 4,58 g',
      '2. m(O) = 4,58 - 2 = 2,58 g',
      '3. E(P) = 2 · 8 / 2,58 = 6,2 g/mol',
      '4. Tekshiruv: Ar(P)/v = 31 / 5 = 6,2',
    ],
    variantlar: [
      '2. m(O) = 4,58 - 2 = 2,58 g',
      '4. Tekshiruv: Ar(P)/v = 31 / 5 = 6,2',
      '1. Berilgan: m(P) = 2 g; m(P₂O₅) = 4,58 g',
      '3. E(P) = 2 · 8 / 2,58 = 6,2 g/mol',
    ],
  },
  {
    tur: 'Ekvivalent massalar o\'sishi',
    vazifa: 'Moddalarni ekvivalent massasi ORTISHI tartibida joylang:',
    tartib: [
      'Al (E = 9 g/mol)',
      'Fe³⁺ (E = 18,67 g/mol)',
      'Al(OH)₃ (E = 26 g/mol)',
      'H₂SO₄ (E = 49 g/mol)',
    ],
    variantlar: [
      'Al(OH)₃ (E = 26 g/mol)',
      'Al (E = 9 g/mol)',
      'H₂SO₄ (E = 49 g/mol)',
      'Fe³⁺ (E = 18,67 g/mol)',
    ],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: 'Ekvivalent tushunchasini 1820-yilda kim fanga kiritgan?',
    variantlar: ['A. Avogadro', 'V. Vollaston', 'D. Mendeleyev', 'K. Sheyele'],
    togri: 1,
    izoh: '111-bet: 1820-yil V. Vollaston.',
  },
  {
    savol: 'CO va CO₂ da uglerodning ekvivalent massalari:',
    variantlar: ['12 va 12', '24 va 48', '4 va 8', '6 (CO) va 3 (CO₂)'],
    togri: 3,
    izoh: 'CO da 12/2=6; CO₂ da 12/4=3.',
  },
  {
    savol: 'Cr₂O₃ va CrO₃ oksidlarining ekvivalent massalari:',
    variantlar: ['25,33 (Cr₂O₃) va 16,67 (CrO₃)', '152 va 100', '76 va 50', '52 va 16'],
    togri: 0,
    izoh: '152/6 = 25,33; 100/6 = 16,67 g/mol.',
  },
  {
    savol: 'Pb(OH)₂ va HPO₃ larning ekvivalent massalari:',
    variantlar: ['241 va 40', '60 va 26,7', '120,5 (Pb(OH)₂) va 80 (HPO₃)', '103,5 va 31'],
    togri: 2,
    izoh: '241/2 = 120,5; 80/1 = 80 g/mol.',
  },
  {
    savol: 'V_E(H₂) n.sh. da necha litr/mol ga teng?',
    variantlar: ['5,6 l/mol', '22,4 l/mol', '11,2 l/mol', '44,8 l/mol'],
    togri: 2,
    izoh: '1 g H₂ = 0,5 mol → 11,2 litr.',
  },
  {
    savol: '114-bet misoli: 47,26 g Cu + 52,7 g Cl birikmasida E(Cu):',
    variantlar: ['31,8 g/mol', '63,6', '16', '35,45'],
    togri: 0,
    izoh: '47,26 · 35,45 / 52,7 = 31,8 g/mol.',
  },
  {
    savol: '3-masala: 1 g metall 0,05 g H₂ siqib chiqarsa E(Me) va metall:',
    variantlar: ['12 (Mg)', '20 → Ar = 40 (Ca)', '9 (Al)', '23 (Na)'],
    togri: 1,
    izoh: 'E = 1·1/0,05 = 20; v=2 → Ar=40 (Ca).',
  },
  {
    savol: 'Mg₃(PO₄)₂ tuzining ekvivalent massasi (M = 262):',
    variantlar: ['262', '131', '87,3', '43,67 g/mol (262 / 6)'],
    togri: 3,
    izoh: '3 ta Mg²⁺ → umumiy valentlik 3·2=6 → 262/6 = 43,67.',
  },
];

export default function S8Mavzu26() {
  const korgazmalar = [
    { nom: '1. E(H)=1, E(O)=8, CO/CO₂', ikon: 'atom', komponent: <KorgazmaEkvivalentTushuncha /> },
    { nom: '2. Modda sinflari E', ikon: 'formula', komponent: <KorgazmaModdaSinflariE /> },
    { nom: '3. V_E (11,2 & 5,6 l)', ikon: 'kolba', komponent: <KorgazmaEkvivalentHajm /> },
    { nom: '4. Qonun: m₁/m₂=E₁/E₂', ikon: 'magnit', komponent: <KorgazmaEkvivalentQonun /> },
    { nom: '5. 114–115-b misollar', ikon: 'grafik', komponent: <Korgazma114Misollar /> },
    { nom: '6. Mustaqil masalalar', ikon: 'grafik', komponent: <Korgazma26Mustaqil /> },
  ];

  const oyinlar = [
    {
      nom: '1. Guruhlash',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-26"
          nom="Ekvivalent qonunini guruhlang"
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
          key="tezkor-26"
          nom="26-§: Ekvivalent qonuni"
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
          key="zanjir-26"
          nom="Ekvivalent hisoblash"
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
          key="duel-26"
          sarlavha="26-§: Ekvivalent dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="26-§"
      mavzuNom="Ekvivalent qonuni"
      oldingiRaqam="25-§"
      oldingiNom="Avogadro qonuni. Molyar hajm"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
