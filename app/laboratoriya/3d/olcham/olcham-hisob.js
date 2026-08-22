// Kadr piksellaridan luma gistogrammasi.
//
// Formula Rec.709 (ITU-R BT.709) — three.js ACES tonemapping dan
// keyingi sRGB kadrga qo'llanadi. Chegaralar (0.98 / 0.02) BRIF-01 da.

const BINS = 1024;

/**
 * @param {Uint8Array|Uint8ClampedArray} data RGBA, 0..255
 * @param {number} width
 * @param {number} height
 * @param {{ origin?: "top-left"|"bottom-left" }} [soz]
 */
export function kadrGistogrammasi(data, width, height, soz = {}) {
  const n = width * height;
  if (!data || n <= 0) {
    throw new Error("Kadr bo'sh: kenglik yoki balandlik 0");
  }
  if (data.length < n * 4) {
    throw new Error(`Kadr buferi qisqa: ${data.length} < ${n * 4}`);
  }

  const originBottomLeft = soz.origin === "bottom-left";
  let sum = 0;
  let kuygan = 0;
  let qora = 0;
  let yuqoriSum = 0;
  let yuqoriN = 0;
  let quyiSum = 0;
  let quyiN = 0;
  const hist = new Uint32Array(BINS);

  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const r = data[o] / 255;
    const g = data[o + 1] / 255;
    const b = data[o + 2] / 255;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sum += luma;
    if (luma > 0.98) kuygan += 1;
    if (luma < 0.02) qora += 1;
    hist[Math.min(BINS - 1, Math.floor(luma * BINS))] += 1;

    const yXom = Math.floor(i / width);
    const yYuqoridan = originBottomLeft ? height - 1 - yXom : yXom;
    const qator = yYuqoridan / height;
    if (qator < 0.15) {
      yuqoriSum += luma;
      yuqoriN += 1;
    }
    if (qator >= 0.65) {
      quyiSum += luma;
      quyiN += 1;
    }
  }

  const protsentil = (p) => {
    const nishon = p * n;
    let yigindi = 0;
    for (let i = 0; i < BINS; i++) {
      yigindi += hist[i];
      if (yigindi >= nishon) return (i + 0.5) / BINS;
    }
    return 1;
  };

  return {
    kuygan: (kuygan / n) * 100,
    qora: (qora / n) * 100,
    ortacha: sum / n,
    p50: protsentil(0.5),
    p95: protsentil(0.95),
    // Bu ikki qiymat geometriya emas, faqat ekran qatorlari. Nomlar
    // ataylab shunday: "ship/pol" deb noto'g'ri talqin qilinmasin.
    yuqoriSoha: yuqoriN ? yuqoriSum / yuqoriN : 0,
    quyiSoha: quyiN ? quyiSum / quyiN : 0,
  };
}

export function kadrQorami(data) {
  if (!data || data.length < 16) return true;
  // Bir necha joydan namuna: burchakdagi qorong'i pol "butun kadr
  // qora" emas. Hammasi ~0 bo'lsa — WebGL buferi o'qilmagan.
  const qadam = Math.max(16, Math.floor(data.length / 400) * 4);
  for (let i = 0; i < data.length; i += qadam) {
    if (data[i] > 2 || data[i + 1] > 2 || data[i + 2] > 2) return false;
  }
  return true;
}

/**
 * Kadrning YUQORI CHASTOTALI ENERGIYASI — qo'shni piksellar orasidagi
 * o'rtacha luma farqi.
 *
 * BU SON TINIQLIKNI O'LCHAMAYDI. Nomi avval `tiniqlik` edi va bu
 * XATO edi — quyidagi o'lchov buni ko'rsatdi (2026-08-23).
 *
 * Anizotropiya va mipmap qo'shilganda kutilgan natija "tiniqroq"
 * bo'lishi edi. Aslida son PASAYDI:
 *
 *   1280x720   0.00923 -> 0.00909   (-1.5%)
 *   2560x1440  0.00567 -> 0.00560   (-1.2%)
 *
 * Sabab: filtrlashning butun vazifasi ALIASINGNI (miltillashni)
 * kamaytirish, aliasing esa yuqori chastotali shovqin. Ya'ni
 * filtrlash yaxshilanganda bu son TUSHADI.
 *
 * NIMANI KO'RSATA OLADI:
 *   - teksturaning umuman yo'qolishi yoki qattiq loyqalanishi
 *     (son keskin tushadi);
 *   - shovqin yoki artefakt qo'shilishi (son keskin ko'tariladi).
 *
 * NIMANI KO'RSATA OLMAYDI:
 *   - "tiniqroq bo'ldimi" — o'sish ham, tushish ham yaxshi bo'lishi
 *     mumkin. Filtrlash o'zgarishini BU SON BILAN BAHOLAMANG.
 *
 * Shuning uchun u standart jadvalda ko'rsatilmaydi va majburiy
 * maydonlar ro'yxatiga kirmaydi — faqat `--json` da qoladi.
 *
 * Saboq: "nima yaxshi ko'rinadi" degan fikrni raqamga aylantirganda,
 * raqam fikrning faqat bir qismini ushlaydi.
 */
export function kadrYuqoriChastotasi(data, width, height) {
  const luma = (i) =>
    (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  let jami = 0;
  let soni = 0;
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const i = (y * width + x) * 4;
      const l = luma(i);
      jami += Math.abs(luma(i + 4) - l) + Math.abs(luma(i + width * 4) - l);
      soni += 1;
    }
  }
  return soni ? jami / soni : 0;
}
