'use client';
// ============================================================
// JDA KIMYO - 8-SINF, III BOB, 19-PARAGRAF
// "Oksidlanish-qaytarilish reaksiyalari" (Darslik 80-83-betlar)
// ============================================================

import {
  SmartDarsQobiq,
  KorgazmaRamka,
  chizFonSetka,
  chizZarracha,
  GuruhlashOyini,
  TezkorTanlovOyini,
  BosqichliZanjirOyini,
  JamoalarDueliPanel,
} from '@/components/maktab/SmartOyinYordamchi';
import { InteraktivSahnaKorgazma } from '@/components/maktab/SmartKimyoSahna';

/* ═══════════════════════════════════════════════════════════════
   1-KO'RGAZMA: REAKSIYALARNI OQR VA OQR EMASGA AJRATISH (80-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaOQRAjratish() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="1. OQR ni oddiy reaksiyalardan ajratish (80, 82-bet)"
      ikon="qidiruv"
      variantlar={[
        {
          id: 'oqrHa',
          tugma: 'OQR (2Na + Cl₂ = 2NaCl)',
          formula: '2Na⁰ + Cl₂⁰ = 2Na⁺¹Cl⁻¹  •  OD o\'zgardi → OQR!',
          tur: 'molekula',
          cfg: {
            sarlavha: '80-bet 2-misol: Elektron o\'tishi → OQR!',
            tenglama: 'Na⁰ - 1ē → Na⁺¹ (oksidlandi)  |  Cl₂⁰ + 2ē → 2Cl⁻¹ (qaytarildi)',
            rejim: 'bog',
            bogJuft: { chap: 'Na⁰→Na⁺¹', chapRang: '#f472b6', ong: 'Cl⁰→Cl⁻¹', ongRang: '#34d399', siljish: 0.85 },
            metrikalar: [
              { nom: 'Na oksidlanish', qiymat: '0 → +1 (ē berdi)', foiz: 90, rang: '#f472b6' },
              { nom: 'Cl qaytarilish', qiymat: '0 → -1 (ē oldi)', foiz: 90, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Qaytaruvchi', v: 'Na⁰ (OD ↑)', rang: '#f472b6' },
              { k: 'Oksidlovchi', v: 'Cl₂⁰ (OD ↓)', rang: '#34d399' },
              { k: 'Mezon', v: 'OD o\'zgardi → OQR', rang: '#fde047' },
            ],
          },
          pastki: [
            'CuO + H₂SO₄ va KCl + AgNO₃: OQR emas',
            '2Na + Cl₂ va FeO + CO: OQR',
            'Mezon: elementlar OD si o\'zgarishi shart',
          ],
        },
        {
          id: 'oqrEmas',
          tugma: 'OQR emas (CuO + H₂SO₄)',
          formula: 'Cu⁺²O⁻² + H₂⁺¹S⁺⁶O₄⁻² = Cu⁺²S⁺⁶O₄⁻² + H₂⁺¹O⁻²',
          tur: 'hisob',
          cfg: {
            sarlavha: '80-bet 1-misol: Hech bir elementning OD si o\'zgarmadi',
            tenglama: 'Cu: +2→+2  |  S: +6→+6  |  H: +1→+1  |  O: -2→-2',
            qadamlar: [
              { belgi: 'Cu va O', natija: 'Cu=+2, O=-2', izoh: 'Ikkala tomonda bir xil', rang: '#38bdf8' },
              { belgi: 'S va H', natija: 'S=+6, H=+1', izoh: 'Elektron almashmadi', rang: '#fbbf24' },
              { belgi: 'Xulosa', natija: 'OQR EMAS', izoh: 'Oddiy almashinish reaksiyasi', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'OD o\'zgarishi', foiz: 4, qiymat: '0 ta element', rang: '#94a3b8' },
              { nom: 'Almashinish', foiz: 100, qiymat: 'Ha', rang: '#38bdf8' },
            ],
            javobBadge: 'OD o\'zgarmadi → OQR EMAS!',
          },
          pastki: [
            'CuO + H₂SO₄ → CuSO₄ + H₂O: OQR emas',
            'Kislota + asosli oksid almashinish reaksiyasi',
            'Elektron bir atomdan boshqasiga o\'tmagan',
          ],
        },
        {
          id: 'mashq1',
          tugma: '82-bet 1-savol (KCl vs FeO)',
          formula: 'KCl + AgNO₃ (OQR emas)  vs  FeO + CO = Fe + CO₂ (OQR)',
          tur: 'hisob',
          cfg: {
            sarlavha: '82-bet 1-savol: Qaysi biri OQR?',
            tenglama: '1) KCl + AgNO₃ = KNO₃ + AgCl↓  |  2) Fe⁺²O + C⁺²O = Fe⁰ + C⁺⁴O₂',
            qadamlar: [
              { belgi: '1) KCl+AgNO₃', natija: 'OQR emas', izoh: 'K, Cl, Ag, N, O o\'zgarmadi', rang: '#94a3b8' },
              { belgi: '2) FeO + CO', natija: 'OQR!', izoh: 'Fe⁺² → Fe⁰; C⁺² → C⁺⁴', rang: '#34d399' },
              { belgi: 'Rollar', natija: 'CO qaytaruvchi', izoh: 'Fe⁺² esa oksidlovchi', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Fe⁺² → Fe⁰ (ē oldi)', foiz: 85, qiymat: '-2 daraja ↓', rang: '#34d399' },
              { nom: 'C⁺² → C⁺⁴ (ē berdi)', foiz: 85, qiymat: '+2 daraja ↑', rang: '#f472b6' },
            ],
            javobBadge: 'Faqat 2-reaksiya (FeO + CO) OQR!',
          },
          pastki: [
            'Ion almashinish (AgCl↓) OQR emas',
            'FeO + CO da Fe qaytariladi, C oksidlanadi',
            'Oddiy modda (Fe⁰) hosil bo\'lishi → OQR belgisi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   2-KO'RGAZMA: OKSIDLOVCHI VS QAYTARUVCHI MEXANIZMI (81-BET)
═══════════════════════════════════════════════════════════════ */
const OQR_MISOLLAR = {
  CuO_H2: {
    nom: 'CuO + H₂ = Cu + H₂O',
    qaytaruvchi: 'H₂⁰ - 2 ē → 2H⁺¹ (oksidlanadi)',
    oksidlovchi: 'Cu⁺² + 2 ē → Cu⁰ (qaytariladi)',
    izoh: '81-bet: H₂ CuO ga elektron beradi — qaytaruvchi.',
  },
  Fe2O3_H2: {
    nom: 'Fe₂O₃ + 3H₂ = 2Fe + 3H₂O',
    qaytaruvchi: '3H₂⁰ - 6 ē → 6H⁺¹ (oksidlanadi)',
    oksidlovchi: '2Fe⁺³ + 6 ē → 2Fe⁰ (qaytariladi)',
    izoh: '81-bet: Fe⁺³ 6 ta elektron olib Fe⁰ ga qaytariladi.',
  },
  O2_reaks: {
    nom: '2Mg + O₂ = 2MgO (Kislorod)',
    qaytaruvchi: 'Mg⁰ - 2 ē → Mg⁺² (oksidlanadi)',
    oksidlovchi: 'O₂⁰ + 4 ē → 2O⁻² (qaytariladi)',
    izoh: '81-bet: Kislorod 2ē olib O⁻² bo\'ladi — oksidlovchi.',
  },
};

function KorgazmaOksidlovchiQaytaruvchi() {
  const canvasRef = useRef(null);
  const [mid, setMid] = useState('Fe2O3_H2');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const faol = OQR_MISOLLAR[mid] || OQR_MISOLLAR.Fe2O3_H2;
    let kadr;
    let t = 0;

    const chiz = () => {
      const ctx = canvas.getContext('2d');
      const { w, h } = canvasOlchami(canvas, ctx);
      chizFonSetka(ctx, w, h);
      t += 0.03;

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 17px "Times New Roman", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`81-bet: ${faol.nom} — elektron ko'chishi`, 24, 34, w - 48);

      const cy = h * 0.42;
      // Chap: Qaytaruvchi
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.roundRect(24, cy - 58, w * 0.37, 116, 14);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#f472b6';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText('QAYTARUVCHI (ē beradi)', 24 + w * 0.185, cy - 26, w * 0.34);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.fillText(faol.qaytaruvchi, 24 + w * 0.185, cy + 8, w * 0.34);
      ctx.fillStyle = '#fde047';
      ctx.fillText('O\'zi oksidlanadi (OD ↑)', 24 + w * 0.185, cy + 36, w * 0.34);

      // O'ng: Oksidlovchi
      const rx = w * 0.63 - 24;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
      ctx.strokeStyle = '#34d399';
      ctx.beginPath();
      ctx.roundRect(rx, cy - 58, w * 0.37, 116, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px "Times New Roman", serif';
      ctx.fillText('OKSIDLOVCHI (ē oladi)', rx + w * 0.185, cy - 26, w * 0.34);
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px "Times New Roman", serif';
      ctx.fillText(faol.oksidlovchi, rx + w * 0.185, cy + 8, w * 0.34);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('O\'zi qaytariladi (OD ↓)', rx + w * 0.185, cy + 36, w * 0.34);

      // Uchayotgan elektron
      const p = (t % 2) / 2;
      const xStart = 24 + w * 0.37 + 10;
      const xEnd = rx - 10;
      ctx.strokeStyle = '#fde047';
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(xStart, cy);
      ctx.lineTo(xEnd, cy);
      ctx.stroke();
      ctx.setLineDash([]);
      chizZarracha(ctx, xStart + p * (xEnd - xStart), cy, 9, '#fde047', 'e⁻');

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(24, h - 76, w - 48, 48, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 13.5px "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.fillText(faol.izoh, w / 2, h - 47, w - 76);

      kadr = kadrSora(canvas, chiz);
    };

    kadr = kadrSora(canvas, chiz);
    return () => kadrniBekorQil(kadr);
  }, [mid]);

  return (
    <KorgazmaRamka
      sarlavha="2. Oksidlovchi (ē oluvchi) va Qaytaruvchi (ē beruvchi) — asosiy qoida (81-bet)"
      qisqaFormula="Qaytaruvchi: ē berib oksidlanadi • Oksidlovchi: ē olib qaytariladi"
      ikon="uchqun"
      boshqaruv={
        <>
          {Object.entries(OQR_MISOLLAR).map(([k, v]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setMid(k);
                tovushChiqar('bosish');
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold border transition ${
                mid === k
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'border-blue-800 bg-slate-900 text-blue-200 hover:border-amber-400/50'
              }`}
            >
              {v.nom}
            </button>
          ))}
        </>
      }
      pastkiKorinish={
        <>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-pink-300">
            Qaytaruvchi → elektron beradi → OD ortadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-emerald-300">
            Oksidlovchi → elektron oladi → OD kamayadi
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-blue-800/50 text-xs font-bold text-amber-300">
            Jarayon ikki tomonlama va bir vaqtda boradi
          </div>
        </>
      }
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </KorgazmaRamka>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3-KO'RGAZMA: METALLAR VA METALMASLARNING OQR XOSSALARI (81-82-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaIkkiYuzlamaXossa() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="3. Faqat qaytaruvchi, faqat oksidlovchi va ikki tomonlama moddalar (81-82-bet)"
      ikon="magnit"
      variantlar={[
        {
          id: 'S_O2',
          tugma: 'S + O₂ = SO₂ (Qaytaruvchi S)',
          formula: 'S⁰ - 4 ē → S⁺⁴  •  Oltingugurt QAYTARUVCHI (oksidlanadi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '81-bet: Kislorod bilan S elektron beradi (Qaytaruvchi)',
            tenglama: 'S⁰ + O₂⁰ = S⁺⁴O₂⁻²  →  S (0 → +4)',
            rejim: 'bog',
            bogJuft: { chap: 'S⁰→S⁺⁴', chapRang: '#f472b6', ong: 'O₂⁰→O⁻²', ongRang: '#38bdf8', siljish: 0.72 },
            metrikalar: [
              { nom: 'S darajasi', qiymat: '0 → +4 (4ē berdi)', foiz: 85, rang: '#f472b6' },
              { nom: 'O darajasi', qiymat: '0 → -2 (2ē oldi)', foiz: 85, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Faqat qaytaruvchi', v: 'Metallar, S⁻², Cl⁻¹', rang: '#f472b6' },
              { k: 'Faqat oksidlovchi', v: 'F₂, Mn⁺⁷, Cr⁺⁶', rang: '#38bdf8' },
              { k: 'Ikki xossa', v: 'S⁰, H₂⁰, N₂⁰, Cl₂⁰', rang: '#34d399' },
            ],
          },
          pastki: [
            'S + O₂ → SO₂ (S qaytaruvchi, oksidlanadi)',
            'Metallar reaksiyada doim qaytaruvchi',
            'Ftor reaksiyada doim oksidlovchi',
          ],
        },
        {
          id: 'S_H2',
          tugma: 'S + H₂ = H₂S (Oksidlovchi S)',
          formula: 'S⁰ + 2 ē → S⁻²  •  Oltingugurt OKSIDLOVCHI (qaytariladi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '81-bet: Vodorod bilan S elektron oladi (Oksidlovchi)',
            tenglama: 'S⁰ + H₂⁰ = H₂⁺¹S⁻²  →  S (0 → -2)',
            rejim: 'bog',
            bogJuft: { chap: 'H₂⁰→H⁺¹', chapRang: '#38bdf8', ong: 'S⁰→S⁻²', ongRang: '#34d399', siljish: 0.65 },
            metrikalar: [
              { nom: 'S darajasi', qiymat: '0 → -2 (2ē oldi)', foiz: 80, rang: '#34d399' },
              { nom: 'H darajasi', qiymat: '0 → +1 (1ē berdi)', foiz: 80, rang: '#f472b6' },
            ],
            belgilar: [
              { k: 'S roli', v: 'Oksidlovchi (S⁻²)', rang: '#34d399' },
              { k: 'H₂ roli', v: 'Qaytaruvchi (H⁺¹)', rang: '#f472b6' },
              { k: 'Qoida', v: 'Metalmaslar ikki xil', rang: '#fde047' },
            ],
          },
          pastki: [
            'S + H₂ → H₂S (S oksidlovchi, qaytariladi)',
            'Bir xil element har xil sherikda roli o\'zgaradi',
            'Ftor bundan mustasno — faqat oksidlovchi',
          ],
        },
        {
          id: 'Li_HgO',
          tugma: '82-bet 2-savol (2Li+H₂ vs HgO+H₂)',
          formula: '2Li + H₂ = 2LiH (H₂ oksidlovchi)  |  HgO + H₂ = Hg + H₂O (H₂ qaytaruvchi)',
          tur: 'hisob',
          cfg: {
            sarlavha: '82-bet 2-savol: Vodorodning ikki xil roli',
            tenglama: 'Faol metall (Li) bilan oksidlovchi • Oksid (HgO) bilan qaytaruvchi',
            qadamlar: [
              { belgi: '2Li + H₂', natija: '2Li⁺¹H⁻¹', izoh: 'H₂⁰ → H⁻¹ (H₂ oksidlovchi)', rang: '#34d399' },
              { belgi: 'HgO + H₂', natija: 'Hg⁰ + H₂⁺¹O', izoh: 'H₂⁰ → H⁺¹ (H₂ qaytaruvchi)', rang: '#f472b6' },
              { belgi: 'Xulosa', natija: 'Ikki xossa', izoh: 'H₂ ham oksidlovchi, ham qaytaruvchi', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Li bilan: H (0 → -1)', foiz: 82, qiymat: 'Oksidlovchi', rang: '#34d399' },
              { nom: 'HgO bilan: H (0 → +1)', foiz: 82, qiymat: 'Qaytaruvchi', rang: '#f472b6' },
            ],
            javobBadge: '2Li + H₂ = 2LiH da vodorod oksidlovchi!',
          },
          pastki: [
            '2Li + H₂ = 2Li⁺¹H⁻¹ (H₂ oksidlovchi)',
            'HgO + H₂ = Hg + H₂O (H₂ qaytaruvchi)',
            'Metalmaslar (F dan tashqari) ikki xossali',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   4-KO'RGAZMA: 82-83-BET SON O'QIDA ELEKTRON SANASH
═══════════════════════════════════════════════════════════════ */
function KorgazmaSonOqiOQR() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="4. Son o'qida berilgan yoki olingan elektronlarni sanash (82-83-bet)"
      ikon="grafik"
      variantlar={[
        {
          id: 'm2p4',
          tugma: 'S⁻² → S⁺⁴ (83-bet 3-savol)',
          formula: 'S⁻² - 6 ē → S⁺⁴  •  6 ē beradi → Qaytaruvchi (Oksidlanadi)',
          tur: 'hisob',
          cfg: {
            sarlavha: '83-bet 3-savol: S⁻² dan S⁺⁴ ga o\'tish',
            tenglama: '2H₂S⁻² + 3O₂ = 2S⁺⁴O₂ + 2H₂O  →  (-2) dan (+4) gacha 6 ta ē',
            qadamlar: [
              { belgi: 'Boshlang\'ich', natija: 'S⁻² (H₂S)', izoh: 'Son o\'qida -2 nuqta', rang: '#38bdf8' },
              { belgi: 'O\'tish (↑)', natija: '-2 → 0 → +4', izoh: 'O\'ngga 6 qadam = 6 ē beradi', rang: '#fbbf24' },
              { belgi: 'Roli', natija: 'Qaytaruvchi', izoh: 'O\'zi oksidlanadi (OD ↑)', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'Berilgan elektronlar', foiz: 75, qiymat: '6 ta e⁻ (beradi)', rang: '#fbbf24' },
              { nom: 'OD o\'zgarishi', foiz: 75, qiymat: '-2 → +4 (+6)', rang: '#f472b6' },
            ],
            javobBadge: '83-bet 3-savol: S⁻² - 6ē → S⁺⁴ (Qaytaruvchi)',
          },
          pastki: [
            'O\'ngga o\'tish (OD ↑): ē berish, oksidlanish',
            'Chapga o\'tish (OD ↓): ē olish, qaytarilish',
            '83-bet 3-savol: S⁻² - 6 ē → S⁺⁴',
          ],
        },
        {
          id: 'm3p5',
          tugma: '-3 dan +5 ga (82-bet)',
          formula: 'N⁻³H₃ → HNO₃ (+5)  |  (-3) dan (+5) gacha 8 ta elektron beradi',
          tur: 'hisob',
          cfg: {
            sarlavha: '82-bet sxemasi: -3 dan +5 ga o\'tish',
            tenglama: '(-3) - 8 ē = +5  →  8 ta elektron beradi (Qaytaruvchi)',
            qadamlar: [
              { belgi: 'Boshlang\'ich', natija: '-3 (NH₃, PH₃)', izoh: 'Quyi daraja -3', rang: '#38bdf8' },
              { belgi: 'O\'tish (↑)', natija: '-3 → +5', izoh: '3 + 5 = 8 ta elektron beradi', rang: '#f472b6' },
              { belgi: 'Xulosa', natija: 'Oksidlanadi', izoh: 'Zarra qaytaruvchi bo\'ladi', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'Berilgan elektronlar', foiz: 100, qiymat: '8 ta e⁻', rang: '#f472b6' },
              { nom: 'Yo\'nalish', foiz: 100, qiymat: 'O\'ngga (+8)', rang: '#fde047' },
            ],
            javobBadge: '-3 → +5: 8 ta elektron beradi (qaytaruvchi)',
          },
          pastki: [
            'Ammiak NH₃ dan nitrat HNO₃ gacha 8 ē beriladi',
            'Fosfidan H₃PO₄ ga o\'tishda ham P⁻³ - 8ē → P⁺⁵',
            'OD ortishi = oksidlanish jarayoni',
          ],
        },
        {
          id: 'p4m2',
          tugma: '+4 dan -2 ga (82-bet)',
          formula: 'S⁺⁴O₂ → S⁻²  |  (+4) dan (-2) gacha 6 ta elektron oladi (Oksidlovchi)',
          tur: 'hisob',
          cfg: {
            sarlavha: '82-bet sxemasi: +4 dan -2 ga o\'tish',
            tenglama: '(+4) + 6 ē = -2  →  6 ta elektron oladi (Oksidlovchi)',
            qadamlar: [
              { belgi: 'Boshlang\'ich', natija: 'S⁺⁴ (SO₂)', izoh: 'Musbat +4 nuqta', rang: '#fbbf24' },
              { belgi: 'O\'tish (↓)', natija: '+4 → -2', izoh: 'Chapga 6 qadam = 6 ē oladi', rang: '#34d399' },
              { belgi: 'Xulosa', natija: 'Qaytariladi', izoh: 'Zarra oksidlovchi bo\'ladi', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'Olingan elektronlar', foiz: 75, qiymat: '6 ta e⁻ (oladi)', rang: '#34d399' },
              { nom: 'OD o\'zgarishi', foiz: 75, qiymat: '+4 → -2 (-6)', rang: '#38bdf8' },
            ],
            javobBadge: '+4 → -2: 6 ta elektron oladi (oksidlovchi)',
          },
          pastki: [
            'OD kamaysa zarra elektron olgan (oksidlovchi)',
            'Chapga harakat qaytarilish jarayonini bildiradi',
            'Oksidlanish va qaytarilish soni teng bo\'ladi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   5-KO'RGAZMA: 87-BET 2-MISOL — ODDIY MODDALAR OQR REAKSIYALARI
═══════════════════════════════════════════════════════════════ */
function KorgazmaOddiyOQR87() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="5. 87-bet 2-misol: Birikish reaksiyalarida oksidlanuvchi va qaytariluvchilar"
      ikon="kolba"
      variantlar={[
        {
          id: 'nh3',
          tugma: 'N₂ + 3H₂',
          formula: 'N₂⁰ + 3H₂⁰ = 2N⁻³H₃⁺¹  (H₂ qaytaruvchi, N₂ oksidlovchi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '87-bet 2-misol: Ammiak sintezida elektron ko\'chishi',
            tenglama: 'H₂⁰ → H⁺¹ (oksidlanadi)  |  N₂⁰ → N⁻³ (qaytariladi)',
            rejim: 'bog',
            bogJuft: { chap: '3H₂⁰→6H⁺¹', chapRang: '#f472b6', ong: 'N₂⁰→2N⁻³', ongRang: '#34d399', siljish: 0.72 },
            metrikalar: [
              { nom: 'Qaytaruvchi (H₂)', qiymat: '0 → +1 (oksidlanadi)', foiz: 80, rang: '#f472b6' },
              { nom: 'Oksidlovchi (N₂)', qiymat: '0 → -3 (qaytariladi)', foiz: 80, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Vodorod', v: 'Qaytaruvchi', rang: '#f472b6' },
              { k: 'Azot', v: 'Oksidlovchi', rang: '#34d399' },
              { k: 'Turi', v: 'Birikish = OQR', rang: '#fde047' },
            ],
          },
          pastki: [
            'N₂ + 3H₂ = 2NH₃ da N = oksidlovchi (N⁻³)',
            'H₂: metall bilan oksidlovchi, N₂/Cl₂ bilan qaytaruvchi',
            'Oddiy moddalar ishtirokidagi reaksiya doim OQR',
          ],
        },
        {
          id: 'hgo',
          tugma: '2Hg + O₂',
          formula: '2Hg⁰ + O₂⁰ = 2Hg⁺²O⁻²  (Hg qaytaruvchi, O₂ oksidlovchi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '87-bet: Simobning kislorod bilan oksidlanishi',
            tenglama: 'Hg⁰ → Hg⁺² (oksidlanadi)  |  O₂⁰ → O⁻² (qaytariladi)',
            rejim: 'bog',
            bogJuft: { chap: '2Hg⁰→2Hg⁺²', chapRang: '#f472b6', ong: 'O₂⁰→2O⁻²', ongRang: '#38bdf8', siljish: 0.8 },
            metrikalar: [
              { nom: 'Simob (Hg)', qiymat: '0 → +2 (2ē berdi)', foiz: 85, rang: '#f472b6' },
              { nom: 'Kislorod (O₂)', qiymat: '0 → -2 (4ē oldi)', foiz: 85, rang: '#38bdf8' },
            ],
            belgilar: [
              { k: 'Hg⁰', v: 'Qaytaruvchi', rang: '#f472b6' },
              { k: 'O₂⁰', v: 'Oksidlovchi', rang: '#38bdf8' },
              { k: 'Mahsulot', v: 'Hg⁺²O⁻²', rang: '#fde047' },
            ],
          },
          pastki: [
            'Metall Hg⁰ doimo elektron berib (+) daraja oladi',
            'O₂⁰ oddiy modda holidan -2 ga qaytariladi',
            '2Hg⁰ + O₂⁰ = 2Hg⁺²O⁻² ham OQR dir',
          ],
        },
        {
          id: 'cacl2',
          tugma: 'Ca + Cl₂',
          formula: 'Ca⁰ + Cl₂⁰ = Ca⁺²Cl₂⁻¹  (Ca qaytaruvchi, Cl₂ oksidlovchi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '87-bet: Kalsiy va xlor birikishi',
            tenglama: 'Ca⁰ - 2ē → Ca⁺² (oksidlanadi)  |  Cl₂⁰ + 2ē → 2Cl⁻¹ (qaytariladi)',
            rejim: 'bog',
            bogJuft: { chap: 'Ca⁰→Ca⁺²', chapRang: '#fbbf24', ong: 'Cl₂⁰→2Cl⁻¹', ongRang: '#34d399', siljish: 0.9 },
            metrikalar: [
              { nom: 'Kalsiy (Ca)', qiymat: '0 → +2 (ion bog\')', foiz: 92, rang: '#fbbf24' },
              { nom: 'Xlor (Cl₂)', qiymat: '0 → -1 (qaytariladi)', foiz: 92, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'Ca⁰', v: 'Qaytaruvchi', rang: '#fbbf24' },
              { k: 'Cl₂⁰', v: 'Oksidlovchi', rang: '#34d399' },
              { k: 'Mahsulot', v: 'Ionli CaCl₂', rang: '#38bdf8' },
            ],
          },
          pastki: [
            'Faol metall Ca galogen Cl₂ ga 2 elektron beradi',
            'Xlor -1 oksidlanish darajasiga tushadi',
            'Hosila CaCl₂ — ionli bog\'langan tuz',
          ],
        },
        {
          id: 'hcl',
          tugma: 'Cl₂ + H₂',
          formula: 'Cl₂⁰ + H₂⁰ = 2H⁺¹Cl⁻¹  (H₂ qaytaruvchi, Cl₂ oksidlovchi)',
          tur: 'molekula',
          cfg: {
            sarlavha: '87-bet: Xlor va vodorod reaksiyasi',
            tenglama: 'H₂⁰ → 2H⁺¹ (oksidlanadi)  |  Cl₂⁰ → 2Cl⁻¹ (qaytariladi)',
            rejim: 'bog',
            bogJuft: { chap: 'H₂⁰→2H⁺¹', chapRang: '#38bdf8', ong: 'Cl₂⁰→2Cl⁻¹', ongRang: '#34d399', siljish: 0.72 },
            metrikalar: [
              { nom: 'Vodorod (H₂)', qiymat: '0 → +1 (qaytaruvchi)', foiz: 78, rang: '#38bdf8' },
              { nom: 'Xlor (Cl₂)', qiymat: '0 → -1 (oksidlovchi)', foiz: 78, rang: '#34d399' },
            ],
            belgilar: [
              { k: 'H₂⁰', v: 'Qaytaruvchi', rang: '#38bdf8' },
              { k: 'Cl₂⁰', v: 'Oksidlovchi', rang: '#34d399' },
              { k: 'Bog\' turi', v: 'Qutbli HCl', rang: '#fde047' },
            ],
          },
          pastki: [
            'Xlor vodoroddan kuchli elektrmanfiy (3,16 > 2,20)',
            'HCl da qutbli kovalent bog\' va OD ±1',
            'Yorug\'likda portlash bilan boradigan OQR',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   6-KO'RGAZMA: OQR TURLARINING QIYOSIY XARITASI (80-83-BET)
═══════════════════════════════════════════════════════════════ */
function KorgazmaOQRXarita() {
  return (
    <InteraktivSahnaKorgazma
      sarlavha="6. Qaysi reaksiya OQR, qaysi biri emas? — Tezkor aniqlash kaliti"
      ikon="atom"
      variantlar={[
        {
          id: 'barchasi',
          tugma: 'Barcha qoidalar',
          formula: 'Oddiy modda qatnashsa → OQR  •  Ion almashinish / neytrallanish → OQR emas',
          tur: 'hisob',
          cfg: {
            sarlavha: 'OQR ni 5 soniyada aniqlash algoritmi',
            tenglama: 'Oddiy modda (0) bor ↔ murakkab modda (±) → albatta OQR!',
            qadamlar: [
              { belgi: '1. Albatta OQR', natija: 'Oddiy modda', izoh: 'O₂, H₂, Cl₂, Fe, Na, S qatnashsa', rang: '#34d399' },
              { belgi: '2. OQR emas', natija: 'Almashinish', izoh: 'NaOH+HCl, KCl+AgNO₃, CaCO₃→CaO+CO₂', rang: '#94a3b8' },
              { belgi: '3. Nazorat', natija: 'Birga boradi', izoh: 'Biri ē bersa (↑), boshqasi ē oladi (↓)', rang: '#fde047' },
            ],
            taqqosBars: [
              { nom: 'OQR (OD o\'zgaradi)', foiz: 100, qiymat: 'ē almashadi', rang: '#34d399' },
              { nom: 'OQR emas (o\'zgarmaydi)', foiz: 15, qiymat: 'ē almashmaydi', rang: '#94a3b8' },
            ],
            javobBadge: 'Oksidlanish va qaytarilish doimo birga boradi',
          },
          pastki: [
            'OQR siz elektron almashinish bo\'lmaydi',
            'Almashinish va neytrallanish OQR emas',
            'Oksidlanish va qaytarilish doimo birga boradi',
          ],
        },
        {
          id: 'oqr',
          tugma: 'Albatta OQR',
          formula: '2Mg+O₂, Zn+2HCl, 2KClO₃→2KCl+3O₂, FeO+CO',
          tur: 'hisob',
          cfg: {
            sarlavha: 'Albatta OQR bo\'ladigan reaksiya turlari',
            tenglama: 'Oddiy modda qatnashgan birikish, o\'rin olish, parchalanish',
            qadamlar: [
              { belgi: 'Birikish', natija: '2Na+Cl₂→2NaCl', izoh: '0 darajadan ± ga o\'tish', rang: '#34d399' },
              { belgi: 'O\'rin olish', natija: 'Zn+2HCl→H₂↑', izoh: 'Metall H⁺ ni qaytaradi', rang: '#fbbf24' },
              { belgi: 'Parchalanish', natija: '2KMnO₄→O₂↑', izoh: 'Kislorod O₂⁰ ajralishi', rang: '#38bdf8' },
            ],
            taqqosBars: [
              { nom: 'O\'rin olish (barcha)', foiz: 100, qiymat: '100% OQR', rang: '#34d399' },
              { nom: 'Yonish reaksiyasi', foiz: 100, qiymat: '100% OQR', rang: '#fbbf24' },
            ],
            javobBadge: 'Har qanday oddiy modda ishtiroki → OQR!',
          },
          pastki: [
            'O\'rin olish reaksiyalari har doim OQR',
            'Yonish va elektroliz jarayonlari — OQR',
            'Kislota + metall → tuz + H₂↑ ham OQR',
          ],
        },
        {
          id: 'emas',
          tugma: 'OQR emas',
          formula: 'NaOH+HCl, CuO+H₂SO₄, KCl+AgNO₃, CaCO₃→CaO+CO₂',
          tur: 'hisob',
          cfg: {
            sarlavha: 'OQR bo\'lmaydigan (OD o\'zgarmas) reaksiyalar',
            tenglama: 'Ion almashinish, neytrallanish va tuz parchalanishi (CO₂↑)',
            qadamlar: [
              { belgi: 'Neytrallanish', natija: 'NaOH+HCl', izoh: 'H⁺¹, O⁻², Na⁺¹, Cl⁻¹ bir xil', rang: '#94a3b8' },
              { belgi: 'Cho\'kma', natija: 'KCl+AgNO₃', izoh: 'AgCl↓ tushsa ham OD o\'zgarmas', rang: '#38bdf8' },
              { belgi: 'Karbonat', natija: 'CaCO₃→CaO+CO₂', izoh: 'Ca(+2), C(+4), O(-2) saqlanadi', rang: '#f472b6' },
            ],
            taqqosBars: [
              { nom: 'Almashinish reaksiyalari', foiz: 0, qiymat: '0% OQR', rang: '#94a3b8' },
              { nom: 'Neytrallanish', foiz: 0, qiymat: '0% OQR', rang: '#38bdf8' },
            ],
            javobBadge: 'Ion almashinish → OQR emas!',
          },
          pastki: [
            'Cho\'kma yoki suv chiqishi OQR belgisi emas',
            'CaCO₃ → CaO + CO₂ da C hamon +4 qoladi',
            'Almashinishda faqat ionlar joy almashadi',
          ],
        },
      ]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MA'LUMOTLAR: TAKRORLASH (18-§) VA O'YINLAR (19-§)
═══════════════════════════════════════════════════════════════ */
const TAKRORLASH_SAVOLLAR = [
  {
    id: 't1',
    savol: 'H₃PO₄ molekulasida fosforning OD si nechaga teng (78-bet)?',
    variantlar: [
      { matn: '+3', togri: false },
      { matn: '-3', togri: false },
      { matn: '+5 (3(+1)+(+5)+4(-2)=0)', togri: true },
      { matn: '0', togri: false },
    ],
    izoh: '18-§: Fosfat kislotada fosfor +5 darajada.',
  },
  {
    id: 't2',
    savol: 'H₂O₂ da kislorod va NaH da vodorod OD lari qanday?',
    variantlar: [
      { matn: 'H₂O₂ da O = -1; NaH da H = -1', togri: true },
      { matn: 'H₂O₂ da O = -2; NaH da H = +1', togri: false },
      { matn: 'Ikkisida ham 0', togri: false },
      { matn: 'H₂O₂ da O = +2; NaH da H = +1', togri: false },
    ],
    izoh: '78-79-bet: Peroksidda O=-1, gidridlarda H=-1.',
  },
  {
    id: 't3',
    savol: 'KMnO₄ va K₂Cr₂O₇ da Mn va Cr ning OD lari qaysilar?',
    variantlar: [
      { matn: 'Mn = +4, Cr = +3', togri: false },
      { matn: 'Mn = +6, Cr = +7', togri: false },
      { matn: 'Mn = +2, Cr = +2', togri: false },
      { matn: 'Mn = +7, Cr = +6', togri: true },
    ],
    izoh: '86-87-bet: KMnO₄ da +7, K₂Cr₂O₇ da +6.',
  },
  {
    id: 't4',
    savol: 'Oddiy moddalarda (O₂, O₃, Cl₂, P₄, Fe) atomlar OD si nechaga teng?',
    variantlar: [
      { matn: '+1', togri: false },
      { matn: '0 (nol) ga teng', togri: true },
      { matn: '-1', togri: false },
      { matn: '+2', togri: false },
    ],
    izoh: '78-bet: Oddiy moddalarda elektron siljimaydi → OD = 0.',
  },
];

const GURUHLASH_DATA = {
  guruhlar: [
    { id: 'oksidlovchi', nom: 'Oksidlovchi (ē oladi)', tavsif: 'F₂, Mn⁺⁷, Cr⁺⁶, H₂O₂ / S+H₂' },
    { id: 'qaytaruvchi', nom: 'Qaytaruvchi (ē beradi)', tavsif: 'Metallar (Na, Fe), H₂+CuO, S+O₂' },
    { id: 'emas', nom: 'OQR emas (OD o\'zgarmas)', tavsif: 'Almashinish va neytrallanish' },
  ],
  topshiriqlar: [
    { nom: '2Na + Cl₂ = 2NaCl da Cl₂', qisqa: 'Cl⁰ + 1ē → Cl⁻¹', guruh: 'oksidlovchi', izoh: '80-bet: Xlor elektron olib qaytariladi.' },
    { nom: '2Li + H₂ = 2LiH da H₂', qisqa: 'H⁰ + 1ē → H⁻¹', guruh: 'oksidlovchi', izoh: '82-bet: Faol metall bilan H₂ oksidlovchi.' },
    { nom: 'S + H₂ = H₂S da S⁰', qisqa: 'S⁰ + 2ē → S⁻²', guruh: 'oksidlovchi', izoh: '81-bet: S elektron olib -2 ga qaytariladi.' },
    { nom: '2Na + Cl₂ = 2NaCl da Na⁰', qisqa: 'Na⁰ - 1ē → Na⁺¹', guruh: 'qaytaruvchi', izoh: 'Metallar doim elektron beruvchi (qaytaruvchi).' },
    { nom: 'CuO + H₂ = Cu + H₂O da H₂', qisqa: 'H₂⁰ - 2ē → 2H⁺¹', guruh: 'qaytaruvchi', izoh: '81-bet: H₂ Cu⁺² ni qaytarib oksidlanadi.' },
    { nom: 'S + O₂ = SO₂ da S⁰', qisqa: 'S⁰ - 4ē → S⁺⁴', guruh: 'qaytaruvchi', izoh: '81-bet: S kislorodga 4 ta elektron beradi.' },
    { nom: 'CuO + H₂SO₄ = CuSO₄ + H₂O', qisqa: 'Cu(+2), S(+6) bir xil', guruh: 'emas', izoh: '80-bet: OD lar o\'zgarmaydi.' },
    { nom: 'KCl + AgNO₃ = KNO₃ + AgCl↓', qisqa: 'Ion almashinish', guruh: 'emas', izoh: '82-bet: Cho\'kma tushsa ham OD o\'zgarmaydi.' },
    { nom: 'NaOH + HCl = NaCl + H₂O', qisqa: 'Neytrallanish', guruh: 'emas', izoh: 'Na(+1), O(-2), H(+1), Cl(-1) o\'zgarmas.' },
  ],
};

const TEZKOR_SAVOLLAR = [
  {
    belgi: 'OQR ta\'rifi',
    savol: 'Qanday reaksiyalar oksidlanish-qaytarilish (OQR) deyiladi?',
    variantlar: [
      'Faqat issiqlik chiqadigan reaksiyalar',
      'Faqat cho\'kma tushadigan reaksiyalar',
      'Elementlar oksidlanish darajasi o\'zgarib boradigan reaksiyalar',
      'Gaz ajralmaydigan reaksiyalar',
    ],
    togri: 2,
    izoh: '81-bet: OQR da elektronlar o\'tib OD o\'zgaradi.',
  },
  {
    belgi: '82-bet (-3 → +5)',
    savol: 'Element OD si -3 dan +5 ga o\'tsa nima sodir bo\'ladi (82-bet)?',
    variantlar: ['8 ta ē beradi, qaytaruvchi (oksidlanadi)', '5 ta elektron oladi', '8 ta elektron oladi', 'OD o\'zgarmaydi'],
    togri: 0,
    izoh: '82-bet: (-3) - 8ē = +5; 8 ē beradi → qaytaruvchi.',
  },
  {
    belgi: '83-bet 3-savol',
    savol: 'S⁻² → S⁺⁴ o\'tishida oltingugurt nechta ē beradi va u nima?',
    variantlar: ['2ē oladi, oksidlovchi', '4ē beradi, oksidlovchi', '6ē oladi, qaytariladi', '6ē beradi, qaytaruvchi (oksidlanadi)'],
    togri: 3,
    izoh: '83-bet 3-savol: (-2) - (+4) = -6 → 6ē beradi.',
  },
  {
    belgi: '82-bet 2-savol',
    savol: '2Li + H₂ = 2LiH va HgO + H₂ = Hg + H₂O da H₂ roli qanday?',
    variantlar: [
      'Ikkisida ham qaytaruvchi',
      '1-da oksidlovchi (H₂⁰→H⁻¹), 2-da qaytaruvchi (H₂⁰→H⁺¹)',
      'Ikkisida ham oksidlovchi',
      'Reaksiyaga kirmaydi',
    ],
    togri: 1,
    izoh: '82-bet: Metall bilan oksidlovchi, oksid bilan qaytaruvchi.',
  },
  {
    belgi: 'Metallar',
    savol: 'Kimyoviy reaksiyada metall atomlari (Na, Ca, Fe, Al) roli qanday?',
    variantlar: ['Doimo oksidlovchi', 'Doimo elektron beradi → har doim QAYTARUVCHI', 'Elektron olmaydi ham, bermaydi ham', 'Faqat Ftor bilan qaytaruvchi'],
    togri: 1,
    izoh: '81-bet: Metallar doim elektron beradi → qaytaruvchi.',
  },
  {
    belgi: '82-bet 1-savol',
    savol: 'KCl + AgNO₃ (1) va FeO + CO = Fe + CO₂ (2) dan qaysisi OQR?',
    variantlar: ['1-reaksiya OQR', 'Ikkisi ham OQR emas', 'Ikkisi ham OQR', 'Faqat 2-reaksiya OQR (Fe⁺²→Fe⁰, C⁺²→C⁺⁴)'],
    togri: 3,
    izoh: '82-bet: 1-da darajalar o\'zgarmas; 2-da Fe qaytariladi.',
  },
  {
    belgi: 'Oltingugurt',
    savol: 'S + O₂ = SO₂ va S + H₂ = H₂S da S qanday xossa ko\'rsatadi?',
    variantlar: [
      '1-da qaytaruvchi (S⁰→S⁺⁴), 2-da oksidlovchi (S⁰→S⁻²)',
      'Ikkisida oksidlovchi',
      'Ikkisida qaytaruvchi',
      'O\'zgarmaydi',
    ],
    togri: 0,
    izoh: '81-bet: Metalmaslar ham oksidlovchi, ham qaytaruvchi bo\'ladi.',
  },
  {
    belgi: '+4 dan -2 ga',
    savol: 'Element OD si +4 dan -2 ga o\'tganda necha elektron almashinadi?',
    variantlar: ['2 ta ē beradi', '4 ta ē oladi', '6 ta ē oladi (oksidlovchi, qaytariladi)', '6 ta ē beradi'],
    togri: 2,
    izoh: '82-bet: (+4) + 6ē = (-2); 6ē oladi → oksidlovchi.',
  },
];

const ZANJIR_MISSIYALAR = [
  {
    tur: 'Qaytarilish qadamlari',
    vazifa: 'Fe₂O₃ + 3H₂ = 2Fe + 3H₂O elektron o\'tish mantiqini tartiblang:',
    tartib: ['Vodorod (H₂⁰) elektron beradi', '6 ta elektron Fe⁺³ ionlariga o\'tadi', 'Temir (Fe⁺³ → Fe⁰) qaytariladi', 'Vodorod (H₂⁰ → 2H⁺¹) oksidlanadi'],
    variantlar: ['Temir (Fe⁺³ → Fe⁰) qaytariladi', 'Vodorod (H₂⁰) elektron beradi', 'Vodorod (H₂⁰ → 2H⁺¹) oksidlanadi', '6 ta elektron Fe⁺³ ionlariga o\'tadi'],
  },
  {
    tur: 'S⁻² → S⁺⁶ pog\'onalari',
    vazifa: 'Oltingugurtni OD ortishi (elektron berish) bo\'yicha joylang:',
    tartib: ['H₂S (S = -2)', 'S₈ (S = 0)', 'SO₂ (S = +4)', 'SO₃ / H₂SO₄ (S = +6)'],
    variantlar: ['SO₂ (S = +4)', 'H₂S (S = -2)', 'SO₃ / H₂SO₄ (S = +6)', 'S₈ (S = 0)'],
  },
  {
    tur: 'OQR aniqlash algoritmi',
    vazifa: 'Reaksiyaning OQR ligini tekshirish ketma-ketligini tuzing:',
    tartib: ['Barcha elementlar OD ni yozish', 'Chap va o\'ng OD larni solishtirish', 'Qaytaruvchi va oksidlovchini topish', 'Elektron balansga ko\'ra xulosa'],
    variantlar: ['Qaytaruvchi va oksidlovchini topish', 'Barcha elementlar OD ni yozish', 'Elektron balansga ko\'ra xulosa', 'Chap va o\'ng OD larni solishtirish'],
  },
];

const DUEL_SAVOLLAR = [
  {
    savol: '80-bet 1-misol: CuO + H₂SO₄ = CuSO₄ + H₂O nega OQR emas?',
    variantlar: ['Suv hosil bo\'ldi', 'Barcha elementlar (Cu⁺², O⁻², H⁺¹, S⁺⁶) OD si o\'zgarmadi', 'Mis sulfat tuz', 'Kislota qatnashdi'],
    togri: 1,
    izoh: '80-bet: OQR da OD o\'zgarishi shart.',
  },
  {
    savol: 'Oksidlovchi deb nimaga aytiladi va u nima bo\'ladi (81-bet)?',
    variantlar: ['ē bergan zarra, oksidlanadi', 'ē bermaydigan zarra', 'Faqat metall ionlari', 'ē olgan zarra, o\'zi qaytariladi'],
    togri: 3,
    izoh: '81-bet: Oksidlovchi elektron olib qaytariladi.',
  },
  {
    savol: '87-bet 2-misol: N₂ + 3H₂ = 2NH₃ da qaysisi oksidlanadi va qaytariladi?',
    variantlar: ['Vodorod oksidlanadi (H⁰→H⁺¹), azot qaytariladi (N⁰→N⁻³)', 'Azot oksidlanadi, H₂ qaytariladi', 'Ikkisi oksidlanadi', 'O\'zgarmaydi'],
    togri: 0,
    izoh: '87-bet: N₂ elektron olib qaytariladi, H₂ berib oksidlanadi.',
  },
  {
    savol: 'Qaysi element reaksiyalarda HECH QACHON qaytaruvchi bo\'lmaydi?',
    variantlar: ['Kislorod', 'Oltingugurt', 'Ftor (F₂ — eng yuqori NEM 4,0)', 'Xlor'],
    togri: 2,
    izoh: '81-bet: Ftor faqat oksidlovchi bo\'la oladi.',
  },
  {
    savol: 'N⁻³ → N⁺⁵ o\'tishida azot nechta elektron beradi/oladi?',
    variantlar: ['8 ta elektron oladi', '2 ta elektron beradi', '8 ta elektron beradi (qaytaruvchi)', '3 ta elektron oladi'],
    togri: 2,
    izoh: '(-3) - (+5) = -8 → 8 ta elektron beradi.',
  },
  {
    savol: 'Cl₂ + H₂ = 2HCl da xlor va vodorodning roli qanday (87-bet)?',
    variantlar: ['Xlor oksidlovchi (qaytariladi), H₂ qaytaruvchi (oksidlanadi)', 'Xlor qaytaruvchi, H₂ oksidlovchi', 'OQR emas', 'Ikkisi ham qaytaruvchi'],
    togri: 0,
    izoh: '87-bet: Cl₂⁰ + 2ē → 2Cl⁻¹; H₂⁰ - 2ē → 2H⁺¹.',
  },
  {
    savol: '83-bet 3-savol: S⁻² → S⁺⁴ jarayonida oltingugurt roli qanday?',
    variantlar: ['Oksidlovchi, 2ē oladi', 'Qaytaruvchi (oksidlanadi), 6ē beradi', 'Oksidlovchi, 6ē oladi', 'O\'zgarmaydi'],
    togri: 1,
    izoh: '(-2) dan (+4) gacha 6 ta elektron yo\'qotadi.',
  },
  {
    savol: 'Metallar reaksiyada nega faqat QAYTARUVCHI bo\'ladi?',
    variantlar: ['OD si doim 0', 'NEM i F dan katta', 'Manfiy ionga aylanadi', 'Chunki metall atomi faqat elektron beradi'],
    togri: 3,
    izoh: '81-bet: Metallar faqat musbat darajaga o\'tadi.',
  },
];

export default function S8Mavzu19() {
  const korgazmalar = [
    { nom: '1. OQR vs Oddiy reaksiya', ikon: 'qidiruv', komponent: <KorgazmaOQRAjratish /> },
    { nom: '2. Oksidlovchi & Qaytaruvchi', ikon: 'uchqun', komponent: <KorgazmaOksidlovchiQaytaruvchi /> },
    { nom: '3. Metallar va Metalmaslar', ikon: 'magnit', komponent: <KorgazmaIkkiYuzlamaXossa /> },
    { nom: '4. Son o\'qida ē sanash', ikon: 'grafik', komponent: <KorgazmaSonOqiOQR /> },
    { nom: '5. 87-bet oddiy OQRlar', ikon: 'kolba', komponent: <KorgazmaOddiyOQR87 /> },
    { nom: '6. Tezkor tanish kaliti', ikon: 'atom', komponent: <KorgazmaOQRXarita /> },
  ];

  const oyinlar = [
    {
      nom: '1. OQR rollarini ajratish',
      ikon: 'magnit',
      komponent: (
        <GuruhlashOyini
          key="guruhlash-19"
          nom="Moddalarni oksidlovchi, qaytaruvchi va OQR emasga ajratish"
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
          key="tezkor-19"
          nom="19-§: Oksidlanish-qaytarilish reaksiyalari viktorinasi"
          ikon="chaqmoq"
          savollar={TEZKOR_SAVOLLAR}
        />
      ),
    },
    {
      nom: '3. Elektron o\'tish zanjiri',
      ikon: 'filtr',
      komponent: (
        <BosqichliZanjirOyini
          key="zanjir-19"
          nom="OQR tahlili va oksidlanish darajasi zanjirlari"
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
          key="duel-19"
          sarlavha="19-§: Oksidlanish-qaytarilish reaksiyalari dueli"
          savollar={DUEL_SAVOLLAR}
        />
      ),
    },
  ];

  return (
    <SmartDarsQobiq
      mavzuRaqam="19-§"
      mavzuNom="Oksidlanish-qaytarilish reaksiyalari"
      oldingiRaqam="18-§"
      oldingiNom="Elementlarning oksidlanish darajasi"
      takrorlashSavollar={TAKRORLASH_SAVOLLAR}
      korgazmalar={korgazmalar}
      oyinlar={oyinlar}
    />
  );
}
