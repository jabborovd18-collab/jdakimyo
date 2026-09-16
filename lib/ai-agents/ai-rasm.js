export const AI_SAYT_RASM_BAYT_CHEGARASI = 4 * 1024 * 1024;
export const AI_RASM_BAYT_CHEGARASI = 10 * 1024 * 1024;

const RUXSAT_ETILGAN_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function aiRasmDataUrliniTekshir(rasm, maxBayt = AI_RASM_BAYT_CHEGARASI) {
  if (typeof rasm !== "string" || rasm.length === 0) {
    return { yaroqli: false, sabab: "Rasm data URL matni emas." };
  }
  const vergul = rasm.indexOf(",");
  const sarlavha = vergul >= 0 ? rasm.slice(0, vergul) : "";
  const mime = sarlavha.match(/^data:([^;]+);base64$/i)?.[1]?.toLowerCase() || "";
  if (!RUXSAT_ETILGAN_MIME.has(mime)) {
    return { yaroqli: false, sabab: "Faqat JPEG, PNG yoki WebP rasmi qabul qilinadi." };
  }
  const data = rasm.slice(vergul + 1).replace(/[\r\n\s]/g, "");
  if (!data || data.length > Math.ceil(maxBayt / 3) * 4 + 4 || !/^[a-zA-Z0-9+/]*={0,2}$/.test(data)) {
    return { yaroqli: false, sabab: "Rasm base64 ma'lumoti yaroqsiz yoki juda katta." };
  }
  const toldirish = data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0;
  const bayt = Math.floor((data.length * 3) / 4) - toldirish;
  if (bayt <= 0 || bayt > maxBayt) {
    return { yaroqli: false, sabab: `Rasm hajmi ${Math.round(maxBayt / 1024 / 1024)} MB dan oshmasligi kerak.` };
  }
  return { yaroqli: true, mime, bayt };
}
