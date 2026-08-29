// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KLASSTERLI ORKESTRATOR (v5.5.0 Enterprise)
// Aqlli Kesh + Xavfsizlik Qalqoni + Kontekst Xotirasi + Ixtisoslashgan Soha Agentlari (Organik, Eritma, Stexio) + Erkin SI Suhbatdosh.

import { aiModelChaqir } from "./ai-gateway.js";
import { aiKesh } from "./ai-cache.js";
import { xavfsizlikTekshir } from "./ai-security.js";
import { aiXotira } from "./ai-memory.js";
import { ORGANIK_SYSTEM_PROMPT } from "./agent-organik.js";
import { ERITMA_SYSTEM_PROMPT } from "./agent-eritma.js";
import { STEXIO_SYSTEM_PROMPT } from "./agent-stexio.js";

/**
 * Masala yoki Muloqot turini aniqlash (Aqlli Intent & Domain Router)
 */
function masalaTuriniAniqlash(matn = "") {
  const m = matn.toLowerCase();

  // Hisoblash / DTM masalasi signallari
  const hisoblashBelgilari = [
    "toping", "hisoblang", "aniqlang", "necha gramm", "necha litr", "necha foiz", "necha mol",
    "nechta atom", "nechta molekula", "molyar massasi", "massaviy ulushi", "hajmi", "unumi",
    "a)", "b)", "c)", "d)", "a )", "b )", "c )", "d )", "eritma tayyorlash", "necha ml"
  ];
  const isHisoblash = hisoblashBelgilari.some((b) => m.includes(b)) || /\d+\s*(g|ml|l|mol|%|kg|litr|gramm)\b/i.test(m);

  // Agar aniq hisoblash sharti bo'lmasa -> bu erkin suhbat, nazariy savol yoki yo'l-yo'riq
  if (!isHisoblash) {
    return "suhbat";
  }

  // 1. Organik kimyo hisoblash masalalari
  const organikSozlari = ["gomolog", "izomer", "metil", "etil", "alkan", "alken", "alkin", "dien", "aren", "benzol", "spirt", "aldegid", "keton", "karbon kislota", "efir", "uglevod", "oqsil", "aminokislota", "geksan", "pentan", "butan", "propan", "metan", "tsiklo"];
  if (organikSozlari.some((s) => m.includes(s))) return "organik";

  // 2. Eritmalar va kristallogidrat hisoblash masalalari
  const eritmaSozlari = ["eritma", "eruvchanlik", "massaviy ulush", "molyar konsentratsiya", "kristallogidrat", "kuporos", "suv qo'shildi", "bug'latildi", "cho'kma tushdi", "titr", "erigan", "% li", "w="];
  if (eritmaSozlari.some((s) => m.includes(s))) return "eritmalar";

  // 3. Stexiometriya, gazlar va elektroliz hisoblash masalalari
  const stexioSozlari = ["reaksiya", "ajraldi", "sarflandi", "koeffitsiyent", "unumi", "elektroliz", "faradey", "gaz", "litr", "normal sharoit", "aralashma", "oksidlanish", "qaytarilish", "redoks", "ovr", "mollari"];
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

  // 3. Kontekst xotirasi (oxirgi suhbatlar zanjiri)
  const oldingiMuloqot = foydalanuvchiId ? aiXotira.kontekstOl(foydalanuvchiId) : [];
  let kontekstMatni = "";
  if (oldingiMuloqot.length > 0) {
    kontekstMatni = "\n\nOLDINGI SUHBAT KONTEKSTI (eslab qoling va mos muloqot qiling):\n" +
      oldingiMuloqot.map((m) => `${m.rol === "user" ? "Foydalanuvchi" : "Siz"}: ${m.matn}`).join("\n");
  }

  // 4. Masala yoki Muloqot turini aniqlash
  const masalaTuri = rasm ? "umumiy" : masalaTuriniAniqlash(tozaMatn);
  let tizimPrompti = "";

  if (masalaTuri === "suhbat") {
    tizimPrompti = `Siz JDA KIMYO platformasining shaxsiy, o'ta zukko, samimiy va do'stona Kimyo AI Repetitorisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan foydalanuvchi ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

SIFAT VA MULOQOT QOIDALARI:
- Siz foydalanuvchi bilan xuddi ChatGPT / Claude kabi erkin, tabiiy, iliq va jonli tilda suhbat qurasiz.
- Foydalanuvchi salomlashsa, hol-ahvol so'rasa, kimyo bo'yicha maslahat so'rasa ("qanday o'rganay?", "DTMga qanday tayyorlanay?"), nazariy tushuncha so'rasa ("valentlik nima?", "kovalent bog'lanish nima?"), yoki erkin gaplashsa — unga to'liq, mazmunli, qiziqarli, ismi bilan murojaat qilgan holda batafsil va do'stona javob bering.
- Hech qachon bir xil shablon takrorlamang. Har safar uning savoliga xos va boyitilgan javob bering.
- Agar kimyoviy formulalar yoki tushunchalar kelsa, ularni chiroyli KaTeX formatida ($...$) tushuntiring.
- Javob oxirida suhbatni davom ettiruvchi qiziqarli savol yoki taklif bering.

SOF JSON FORMATIDA QAYTARING:
{
  "muvaffaqiyatli": true,
  "turi": "suhbat",
  "matn": "Sizning erkin, to'liq, samimiy va mazmunli javobingiz..."
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
- DTM test variantlari: Masalada A, B, C, D variantlari bo'lsa, "yakuniyJavob" da to'g'ri variant harfini aniq yozing (masalan: "C) 3").
- Rejimlar: 'tuzoq' (ayyorlik tahlili), 'yonalish' (formulalar), 'toliq' (master yechim).
- Barcha bosqichlarda formulalarni to'liq KaTeX ($...$) bilan yozing.

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
  "ovozMatni": "O'quvchi uchun samimiy, qisqa audio xulosa matni"
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
