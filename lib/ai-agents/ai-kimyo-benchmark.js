// Kimyo benchmarklari sof modulda turadi: admin sinovi ham, unit test ham
// aynan bir xil mezondan foydalanadi va test Prisma yoki tashqi tarmoqqa bog'lanmaydi.

import { aiYechiminiDeterministikTekshir } from "./deterministik-kimyo.js";
import { RESPUBLIKA_KIMYO_OLIMPIADA_BENCHMARKLARI } from "../../data/benchmarks/respublika-kimyo-olimpiada.js";

export const AI_KIMYO_BENCHMARKLARI = Object.freeze([
  Object.freeze({
    id: "stexio_h2o_mol",
    soha: "stexiometriya",
    savol: "36 g H2O necha mol bo'ladi?",
    javobNaqsh: /(?:^|\D)2(?:[.,]0+)?\s*mol\b/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true, turi: "yechim", yakuniyJavob: "2 mol H2O",
      bosqichlar: [Object.freeze({ formula: "M(H2O) = 18.015 g/mol; n = 36 / 18.015 = 1.998 mol" })],
    }),
  }),
  Object.freeze({
    id: "eritma_nacl_massasi",
    soha: "eritmalar",
    savol: "200 g 10% li NaCl eritmasida necha gramm NaCl bor?",
    javobNaqsh: /(?:^|\D)20(?:[.,]0+)?\s*g\b/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true, turi: "yechim", yakuniyJavob: "20 g NaCl",
      bosqichlar: [Object.freeze({ formula: "m(NaCl) = 200 × 10 / 100 = 20 g" })],
    }),
  }),
  Object.freeze({
    id: "gaz_normal_hajm",
    soha: "gazlar",
    savol: "Normal sharoitda 2 mol gaz qanday hajm egallaydi?",
    javobNaqsh: /(?:^|\D)44[.,]8\s*(?:l|litr)\b/i,
    namunaNatija: Object.freeze({
      muvaffaqiyatli: true, turi: "yechim", yakuniyJavob: "44.8 L",
      bosqichlar: [Object.freeze({ formula: "V = 2 × 22.4 = 44.8 L" })],
    }),
  }),
]);

/** Murakkab yo'nalish provayderini alohida sinash uchun kengaytirilgan to'plam. */
export const KENGAYTIRILGAN_KIMYO_BENCHMARKLARI = Object.freeze([
  ...AI_KIMYO_BENCHMARKLARI,
  ...RESPUBLIKA_KIMYO_OLIMPIADA_BENCHMARKLARI,
]);

function benchmarkMatni(natija) {
  if (!natija || typeof natija !== "object") return "";
  return [
    natija.yakuniyJavob,
    natija.matn,
    ...(Array.isArray(natija.bosqichlar) ? natija.bosqichlar.map((bosqich) => `${bosqich?.formula || ""} ${bosqich?.tushuntirish || ""}`) : []),
  ].filter(Boolean).join("\n");
}

export function aiBenchmarkNatijasiniBahola(benchmark, natija) {
  const matn = benchmarkMatni(natija);
  // Namuna ham haqiqiy model javobi kabi aynan o'sha savol kontekstida
  // tekshiriladi; aks holda yangi hakam qoidalari benchmarkda sinovdan o'tmaydi.
  const hakamlik = aiYechiminiDeterministikTekshir({
    ...natija,
    masalaMatni: natija?.masalaMatni || benchmark?.savol,
  });
  const tuzilmaTogri = natija?.muvaffaqiyatli === true && natija?.turi === "yechim" && Array.isArray(natija?.bosqichlar);
  const javobTogri = Boolean(benchmark?.javobNaqsh?.test(matn));
  return {
    id: benchmark?.id || "noma'lum",
    soha: benchmark?.soha || "noma'lum",
    otildi: tuzilmaTogri && javobTogri && hakamlik.ogohlantirishlar.length === 0,
    tuzilmaTogri,
    javobTogri,
    hakamOgohlantirishlari: hakamlik.ogohlantirishlar,
  };
}

export async function aiKimyoBenchmarkiniBajar({ javobBeruvchi = null, benchmarklar = AI_KIMYO_BENCHMARKLARI } = {}) {
  const details = [];
  for (const benchmark of benchmarklar) {
    try {
      const natija = javobBeruvchi
        ? await javobBeruvchi({ savol: benchmark.savol, benchmark })
        : benchmark.namunaNatija;
      details.push(aiBenchmarkNatijasiniBahola(benchmark, natija));
    } catch (error) {
      details.push({ id: benchmark.id, soha: benchmark.soha, otildi: false, xato: String(error?.message || "Noma'lum xato").slice(0, 160) });
    }
  }
  return {
    totalCases: details.length,
    passed: details.filter((detail) => detail.otildi).length,
    failed: details.filter((detail) => !detail.otildi).length,
    details,
  };
}
