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
