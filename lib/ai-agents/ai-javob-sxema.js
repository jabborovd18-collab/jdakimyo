// Provayder va server validatori aynan bir xil minimal javob shartnomasiga
// tayanadi. Promptdagi misol yolg'iz manba bo'lsa model maydonlarni tashlab
// ketadi, UI esa buni faqat javob kelgandan keyin biladi.

const MATN = Object.freeze({ type: "string" });
const MATN_MASSIVI = Object.freeze({ type: "array", items: MATN });

export const AI_YECHIM_JSON_SXEMASI = Object.freeze({
  type: "object",
  properties: {
    muvaffaqiyatli: { type: "boolean", enum: [true] },
    turi: { type: "string", enum: ["yechim"] },
    rejim: MATN,
    masalaTuri: MATN,
    masalaMatni: MATN,
    berilgan: {
      type: "array",
      items: {
        type: "object",
        properties: { belgi: MATN, qiymat: MATN },
        required: ["belgi", "qiymat"],
        additionalProperties: true,
      },
    },
    topishKerak: {
      type: "array",
      items: {
        type: "object",
        properties: { belgi: MATN, nom: MATN },
        required: ["belgi", "nom"],
        additionalProperties: true,
      },
    },
    tenglamalar: MATN_MASSIVI,
    bosqichlar: {
      type: "array",
      items: {
        type: "object",
        properties: {
          raqam: { type: "integer" },
          sarlavha: MATN,
          tushuntirish: MATN,
          formula: MATN,
          mantiq: MATN,
        },
        required: ["tushuntirish"],
        additionalProperties: true,
      },
    },
    boshqaMasalalar: MATN_MASSIVI,
    yakuniyJavob: MATN,
    ovozMatni: MATN,
  },
  required: ["muvaffaqiyatli", "turi", "bosqichlar", "yakuniyJavob"],
  additionalProperties: true,
});

export const AI_SUHBAT_JSON_SXEMASI = Object.freeze({
  type: "object",
  properties: {
    muvaffaqiyatli: { type: "boolean", enum: [true] },
    turi: { type: "string", enum: ["suhbat"] },
    matn: MATN,
  },
  required: ["muvaffaqiyatli", "turi", "matn"],
  additionalProperties: true,
});

export const AI_UMUMIY_JSON_SXEMASI = Object.freeze({
  anyOf: [AI_YECHIM_JSON_SXEMASI, AI_SUHBAT_JSON_SXEMASI],
});

export function aiJavobJsonSxemasiniOl(kutilganTuri = null) {
  if (kutilganTuri === "yechim") return AI_YECHIM_JSON_SXEMASI;
  if (kutilganTuri === "suhbat") return AI_SUHBAT_JSON_SXEMASI;
  return AI_UMUMIY_JSON_SXEMASI;
}
