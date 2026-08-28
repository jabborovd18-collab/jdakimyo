// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KLASSTERLI ORKESTRATOR (v5.0.0 Enterprise)
// Aqlli Kesh + Xavfsizlik Qalqoni + Kontekst Xotirasi + Ixtisoslashgan Soha Agentlari (Organik, Eritma, Stexio).

import { aiModelChaqir } from "./ai-gateway.js";
import { aiKesh } from "./ai-cache.js";
import { xavfsizlikTekshir } from "./ai-security.js";
import { aiXotira } from "./ai-memory.js";
import { ORGANIK_SYSTEM_PROMPT } from "./agent-organik.js";
import { ERITMA_SYSTEM_PROMPT } from "./agent-eritma.js";
import { STEXIO_SYSTEM_PROMPT } from "./agent-stexio.js";

/**
 * Masala turini matndan aniqlash (Intent & Domain Router)
 */
function masalaTuriniAniqlash(matn = "") {
  const m = matn.toLowerCase();

  // 1. Erkin suhbat signallari
  const suhbatSozlari = ["salom", "assalom", "yaxshimisan", "qalaysan", "qalesan", "charchamay", "kimsan", "isming", "rahmat", "nima gap", "gaplash"];
  const isSuhbat = suhbatSozlari.some((s) => m.includes(s)) && !m.includes("toping") && !m.includes("hisoblang") && !m.includes("nechta") && !m.includes("gramm") && !m.includes("litr");
  if (isSuhbat) return "suhbat";

  // 2. Organik kimyo signallari
  const organikSozlari = ["gomolog", "izomer", "metil", "etil", "alkan", "alken", "alkin", "dien", "aren", "benzol", "spirt", "aldegid", "keton", "karbon kislota", "efir", "uglevod", "oqsil", "aminokislota", "geksan", "pentan", "butan", "propan", "metan"];
  if (organikSozlari.some((s) => m.includes(s))) return "organik";

  // 3. Eritmalar va kristallogidrat signallari
  const eritmaSozlari = ["eritma", "eruvchanlik", "massaviy ulush", "molyar konsentratsiya", "kristallogidrat", "kuporos", "suv qo'shildi", "bug'latildi", "cho'kma tushdi", "titr", "erigan", "% li"];
  if (eritmaSozlari.some((s) => m.includes(s))) return "eritmalar";

  // 4. Stexiometriya, gazlar va elektroliz signallari
  const stexioSozlari = ["reaksiya", "ajraldi", "sarflandi", "koeffitsiyent", "unumi", "elektroliz", "faradey", "gaz", "litr", "normal sharoit", "aralashma", "oksidlanish", "qaytarilish", "redoks", "ovr"];
  if (stexioSozlari.some((s) => m.includes(s))) return "stexiometriya";

  return "umumiy";
}

/**
 * KO'P AGENTLI MASALA YECHISH VA ERKIN SUHBAT ORKESTRATORI
 */
export async function multiAgentMasalaYech({
  masalaMatni = '',
  rejim = 'toliq',
  rasm = null,
  foydalanuvchiId = null,
  foydalanuvchiIsmi = 'Diyor'
}) {
  // 1. Xavfsizlik va Prompt Injection tekshiruvi
  const xavfsizlik = xavfsizlikTekshir(masalaMatni);
  if (!xavfsizlik.xavfsiz) {
    return {
      muvaffaqiyatli: false,
      xato: xavfsizlik.sabab,
    };
  }

  const tozaMatn = xavfsizlik.tozaMatn;

  // 2. Keshdan tekshirish (10ms tezlik, 0$ xarajat)
  const keshKaliti = aiKesh.kalitYarat({ matn: tozaMatn, rasm, rejim });
  const keshdagiNatija = aiKesh.olish(keshKaliti);
  if (keshdagiNatija) {
    if (foydalanuvchiId) {
      aiXotira.xabarQosh(foydalanuvchiId, { rol: "user", matn: tozaMatn || "Rasm" });
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "ai",
        matn: keshdagiNatija.matn || keshdagiNatija.yakuniyJavob || "Yechim",
      });
    }
    return keshdagiNatija;
  }

  // 3. Kontekst xotirasi
  const oldingiMuloqot = foydalanuvchiId ? aiXotira.kontekstOl(foydalanuvchiId) : [];
  let kontekstMatni = "";
  if (oldingiMuloqot.length > 0) {
    kontekstMatni = "\n\nOLDINGI SUHBAT KONTEKSTI:\n" +
      oldingiMuloqot.map((m) => `${m.rol === "user" ? "Foydalanuvchi" : "Siz"}: ${m.matn}`).join("\n");
  }

  // 4. Masala turini aniqlab ixtisoslashgan agent tizim promptini tanlash
  const masalaTuri = rasm ? "umumiy" : masalaTuriniAniqlash(tozaMatn);
  let tizimPrompti = "";

  if (masalaTuri === "suhbat") {
    tizimPrompti = `Siz JDA KIMYO platformasining samimiy, do'stona, o'ta bilimdon Kimyo AI assistentisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan foydalanuvchi ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

Foydalanuvchi salomlashmoqda, hol-ahvol so'ramoqda yoki erkin suhbat qilmoqda.
Unga samimiy, quvnoq, xushmuomala va do'stona tarzda, ismi bilan murojaat qilib javob bering.
Masalan: "Assalomu alaykum, ${foydalanuvchiIsmi}! Men JDA Kimyo AI yaxshi, o'zingiz-chi? Bugun birga masala yechib beraymi yoki yangi masala berasanmi?"

SOF JSON FORMATIDA QAYTARING:
{
  "muvaffaqiyatli": true,
  "turi": "suhbat",
  "matn": "Assalomu alaykum, ${foydalanuvchiIsmi}! ..."
}`;
  } else if (masalaTuri === "organik") {
    tizimPrompti = `${ORGANIK_SYSTEM_PROMPT}\n${kontekstMatni}`;
  } else if (masalaTuri === "eritmalar") {
    tizimPrompti = `${ERITMA_SYSTEM_PROMPT}\n${kontekstMatni}`;
  } else if (masalaTuri === "stexiometriya") {
    tizimPrompti = `${STEXIO_SYSTEM_PROMPT}\n${kontekstMatni}`;
  } else {
    // Umumiy Klasterli Master Prompt
    tizimPrompti = `Siz JDA KIMYO platformasining DTM Bosh Eksperti va Fan Doktori sifatida ish yurituvchi Kimyo AI tizimisiz (nomingiz: JDA Kimyo AI).
Foydalanuvchi ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

QAT'IY DTM VA KIMYO QOIDALARI:
- Organik gomologlar: Aniq moddaning gomologi so'ralganda aynan shu tarmoqlanish saqlanadi (masalan, 2-metilalkanlar C4 dan boshlanadi).
- DTM test variantlari: Masalada A, B, C, D variantlari bo'lsa, "yakuniyJavob" da to'g'ri variant harfini aniq yozing.
- Rejimlar: 'tuzoq' (ayyorlik tahlili), 'yonalish' (formulalar), 'toliq' (master yechim).

SOF JSON FORMATIDA QAYTARING:
{
  "muvaffaqiyatli": true,
  "turi": "yechim",
  "rejim": "${rejim}",
  "masalaTuri": "eritmalar | kristallogidrat | stexiometriya | gazlar | elektroliz | organik | muvozanat | termokimyo",
  "masalaMatni": "Masala sharti",
  "berilgan": [ { "belgi": "m", "qiymat": "100 g" } ],
  "topishKerak": [ { "belgi": "V", "nom": "Hajm" } ],
  "tenglamalar": [],
  "tuzoqTahlili": {
    "kalitNuqta": "...",
    "nimaUchunMuhim": "...",
    "kengTarqalganXato": "..."
  },
  "yonalish": {
    "formulalar": ["..."],
    "qadamlarRejasi": ["1-qadam: ..."],
    "maslahat": "..."
  },
  "bosqichlar": [
    {
      "raqam": 1,
      "sarlavha": "1-Bosqich: ...",
      "tushuntirish": "...",
      "formula": "...",
      "mantiq": "..."
    }
  ],
  "krestSxemasi": null,
  "yakuniyJavob": "...",
  "ovozMatni": "..."
}`;
  }

  const foydalanuvchiPrompti = rasm
    ? `Ilova qilingan rasmdagi kimyo masalasini (ayniqsa test variantlari va savol raqamini) sinchkovlik bilan OCR orqali o'qib oling, barcha matn va sonlarni tahlil qiling va ${rejim} rejimida yeching.`
    : `Foydalanuvchi xabari: "${tozaMatn}"`;

  const natija = await aiModelChaqir(foydalanuvchiPrompti, {
    systemPrompt: tizimPrompti,
    jsonRejim: true,
    rasmBase64: rasm
  });

  if (natija && natija.muvaffaqiyatli) {
    aiKesh.saqlash(keshKaliti, natija);

    if (foydalanuvchiId) {
      aiXotira.xabarQosh(foydalanuvchiId, { rol: "user", matn: tozaMatn || "Rasm" });
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "ai",
        matn: natija.matn || natija.yakuniyJavob || "Yechim",
      });
    }
  }

  return natija;
}

/**
 * AI REPETITOR BILAN MULOQOT (Follow-up Chat)
 */
export async function aiRepetitorChat({
  masalaMatni,
  yechim,
  savol,
  foydalanuvchiId = null,
  foydalanuvchiIsmi = 'Diyor'
}) {
  const tizimPrompti = `Siz mehribon, o'ta bilimdon va samimiy Kimyo Repetitorisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan talaba ismi: "${foydalanuvchiIsmi}".
O'quvchi avval yechilgan masala yuzasidan savol bermoqda.
Siz unga o'zbek tilida, do'stona, tushunarli va zarur joylarda KaTeX formulalari bilan tushuntirib bering.

MASALA:
"${masalaMatni}"

AVVALGI YECHIM:
"${yechim?.yakuniyJavob || ''}"

TUSHUNTIRISH TALABI:
Javobingiz qisqa, aniq, pedagogik jihatdan dalillangan va o'quvchini rag'batlantiruvchi bo'lsin.`;

  const prompt = `O'quvchining savoli: "${savol}"`;

  const javob = await aiModelChaqir(prompt, {
    systemPrompt: tizimPrompti,
    jsonRejim: false
  });

  if (javob && foydalanuvchiId) {
    aiXotira.xabarQosh(foydalanuvchiId, { rol: "user", matn: savol });
    aiXotira.xabarQosh(foydalanuvchiId, { rol: "ai", matn: javob });
  }

  return javob || "Kechirasiz, savolingizni qayta shakllantirib bera olasizmi?";
}
