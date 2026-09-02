// AI uchun deterministik dalillar mavjud masala dvigatelidan olinadi.
// Atom massalarining ikkinchi nusxasi ataylab yo'q: yagona manba masala-dvigatel.js.

import {
  ATOM_MASSALAR,
  masalaMatniniTahlilQil,
  molyarMassaHisobla as asosiyMolyarMassaHisobla,
} from "../masala-dvigatel.js";

export { ATOM_MASSALAR };

export function molyarMassaHisobla(formula) {
  const natija = asosiyMolyarMassaHisobla(formula);
  return natija > 0 ? natija : null;
}

/** Pearson diagonal krestini tekshiriladigan sonlar bilan hisoblaydi. */
export function pearsonKrestiHisobla({ w1, w2, wTarget }) {
  const v1 = Number(w1);
  const v2 = Number(w2);
  const vt = Number(wTarget);
  if (![v1, v2, vt].every(Number.isFinite)) return null;

  const yuqori = Math.max(v1, v2);
  const quyi = Math.min(v1, v2);
  if (vt <= quyi || vt >= yuqori) return null;

  const qism1 = Math.abs(vt - v2);
  const qism2 = Math.abs(v1 - vt);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const boluvchi = gcd(Math.round(qism1 * 100), Math.round(qism2 * 100)) / 100;
  const n1 = (qism1 / boluvchi).toFixed(1).replace(/\.0$/, "");
  const n2 = (qism2 / boluvchi).toFixed(1).replace(/\.0$/, "");
  return { mavjud: true, w1: v1, w2: v2, wTarget: vt, qism1, qism2, nisbat: `${n1} : ${n2}` };
}

/**
 * Modelga taxmin emas, server hisoblagan molyar massalarni beradi.
 * Bu hali to'liq yechim hakami emas; noto'g'ri son o'ylab topish xavfini kamaytiruvchi tayanchdir.
 */
export function deterministikKontekstTuz(matn = "") {
  const tahlil = masalaMatniniTahlilQil(String(matn || ""));
  const dalillar = (tahlil.formulalar || [])
    .slice(0, 8)
    .map((formula) => ({ formula, molyarMassa: molyarMassaHisobla(formula) }))
    .filter((dalil) => dalil.molyarMassa !== null);
  if (dalillar.length === 0) return { ishlatildi: false, dalillar: [], prompt: "" };

  const qatorlar = dalillar.map((dalil) => `- M(${dalil.formula}) = ${dalil.molyarMassa} g/mol`).join("\n");
  return {
    ishlatildi: true,
    dalillar,
    prompt: `\n\n<server_hakami>\nQuyidagi qiymatlar yagona kimyo dvigateli hisoblagan tekshirilgan dalillardir. Ularga zid molyar massa yozmang:\n${qatorlar}\n</server_hakami>`,
  };
}
