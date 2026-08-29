// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI GIBRID ORKESTRATOR (v6.1.0 Enterprise)
// DeepSeek-R1 Reasoner (Faqat O'ta Murakkab Masalalar uchun) + 6 Ta Soha Agenti + Smart Kesh + Memory 2.0.

import { aiModelChaqir } from "./ai-gateway.js";
import { aiKesh } from "./ai-cache.js";
import { xavfsizlikTekshir } from "./ai-security.js";
import { aiXotira } from "./ai-memory.js";
import { ORGANIK_SYSTEM_PROMPT } from "./agent-organik.js";
import { ERITMA_SYSTEM_PROMPT } from "./agent-eritma.js";
import { STEXIO_SYSTEM_PROMPT } from "./agent-stexio.js";
import { TERMO_SYSTEM_PROMPT } from "./agent-termo.js";
import { ANORGANIK_SYSTEM_PROMPT } from "./agent-anorganik.js";
import { OLIMPIADA_SYSTEM_PROMPT } from "./agent-olimpiada.js";

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

  // Agar hisoblash sharti bo'lmasa -> Erkin suhbat, nazariya yoki maslahat
  if (!isHisoblash) {
    return "suhbat";
  }

  // 1. Olimpiada va murakkab zanjirlar / Atom tuzilishi
  const olimpiadaSozlari = ["noma'lum modda", "zanjir", "izotop", "kvant son", "proton", "neytron", "elektron konfiguratsiya", "qotishma", "aralashma tarkibi", "x modda", "y modda"];
  if (olimpiadaSozlari.some((s) => m.includes(s))) return "olimpiada";

  // 2. Termokimyo, kinetika va muvozanat
  const termoSozlari = ["entalpiya", "issiqlik effekti", "reaksiya tezligi", "vant-goff", "muvozanat", "le shatelye", "k_c", "k_p", "koeffitsiyent gamma", "kj", "kkal"];
  if (termoSozlari.some((s) => m.includes(s))) return "termo";

  // 3. Anorganik sifat reaksiyalari va gidroliz
  const anorganikSozlari = ["cho'kma", "gidroliz", "ph", "muhit", "amfoter", "ionli tenglama", "sifat reaksiya", "tvorogsimon", "tuz gidrolizi"];
  if (anorganikSozlari.some((s) => m.includes(s))) return "anorganik";

  // 4. Organik kimyo
  const organikSozlari = ["gomolog", "izomer", "metil", "etil", "alkan", "alken", "alkin", "dien", "aren", "benzol", "spirt", "aldegid", "keton", "karbon kislota", "efir", "uglevod", "oqsil", "aminokislota", "geksan", "pentan", "butan", "propan", "metan", "tsiklo"];
  if (organikSozlari.some((s) => m.includes(s))) return "organik";

  // 5. Eritmalar va kristallogidratlar
  const eritmaSozlari = ["eritma", "eruvchanlik", "massaviy ulush", "molyar konsentratsiya", "kristallogidrat", "kuporos", "suv qo'shildi", "bug'latildi", "cho'kma tushdi", "titr", "erigan", "% li", "w="];
  if (eritmaSozlari.some((s) => m.includes(s))) return "eritmalar";

  // 6. Stexiometriya, gazlar va elektroliz
  const stexioSozlari = ["reaksiya", "ajraldi", "sarflandi", "koeffitsiyent", "unumi", "elektroliz", "faradey", "gaz", "litr", "normal sharoit", "aralashma", "oksidlanish", "qaytarilish", "redoks", "ovr", "mollari"];
  if (stexioSozlari.some((s) => m.includes(s))) return "stexiometriya";

  return "umumiy";
}

/**
 * Masalaning O'ta Murakkabligini va DeepSeek Reasoner kerakligini aniqlash
 * ($2 balansni maksimal tejash: faqat og'ir, ko'p bosqichli masalalarga DeepSeek ishlaydi)
 */
function isOtaMurakkabMasala(matn = "", masalaTuri = "") {
  if (masalaTuri === "suhbat") return false;

  // 1. Olimpiada va noma'lum moddalar zanjiri har doim DeepSeek ga boradi
  if (masalaTuri === "olimpiada") return true;

  const m = matn.toLowerCase();

  // 2. Murakkab ko'p komponentli shartlar
  const murakkablikBelgilari = [
    "qotishma", "aralashma", "zanjir", "noma'lum", "bosqich", "hosil bo'lgan cho'kma",
    "gazlar aralashmasi", "zichligi bo'yicha", "vodorodga nisbatan zichligi", "geliyga nisbatan",
    "havoga nisbatan", "tenglamalar sistemasi", "nisbiy zichligi", "elektron konfiguratsiya",
    "faradey", "elektroliz", "unum", "ortiqcha", "kamlik", "tuzoq"
  ];

  const belgilarSoni = murakkablikBelgilari.filter((b) => m.includes(b)).length;

  // Agar 2 tadan ortiq murakkablik belgisi bo'lsa yoki matn uzun va chalkash bo'lsa
  if (belgilarSoni >= 2 || (m.length > 160 && belgilarSoni >= 1)) {
    return true;
  }

  return false;
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
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "user",
        matn: tozaMatn || "Rasm",
        mavzu: keshdagiNatija.masalaTuri || "umumiy",
        foydalanuvchiIsmi
      });
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "ai",
        matn: keshdagiNatija.matn || keshdagiNatija.yakuniyJavob || "Yechim",
        mavzu: keshdagiNatija.masalaTuri || "umumiy",
        foydalanuvchiIsmi
      });
    }
    return keshdagiNatija;
  }

  // 3. Shaxsiy o'quvchi xotirasi (Learning Persona & Compressed Context)
  const kontekstMatni = aiXotira.kontekstPromptiTuz(foydalanuvchiId, foydalanuvchiIsmi);

  // 4. Masala yoki Muloqot turini aniqlash
  const masalaTuri = rasm ? "umumiy" : masalaTuriniAniqlash(tozaMatn);
  let tizimPrompti = "";

  if (masalaTuri === "suhbat") {
    tizimPrompti = `Siz JDA KIMYO platformasining shaxsiy, o'ta zukko, samimiy va do'stona Kimyo AI Repetitorisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan foydalanuvchi ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

SIFAT VA MULOQOT QOIDALARI:
- Siz foydalanuvchi bilan xuddi ChatGPT / Claude kabi erkin, tabiiy, iliq va jonli tilda suhbat qurasiz.
- Foydalanuvchi salomlashsa, hol-ahvol so'rasa, kimyo bo'yicha maslahat so'rasa ("qanday o'rganay?", "DTMga qanday tayyorlanay?"), nazariy tushuncha so'rasa ("valentlik nima?", "kovalent bog'lanish nima?"), yoki erkin gaplashsa — unga to'liq, mazmunli, qiziqarli, ismi bilan murojaat qilgan holda batafsil va do'stona javob bering.
- Agar kimyoviy formulalar yoki tushunchalar kelsa, ularni to'liq toza KaTeX formatida ($...$ yoki $$...$$) yozing (masalan, $\\text{O}_2$, $\\text{H}_2\\text{O}$, $\\text{KMnO}_4$, $\\text{Fe}^{3+}$). Hech qachon O$_2$ kabi aralash formatda yozmang.
- Javob oxirida suhbatni davom ettiruvchi qiziqarli savol yoki taklif bering.

SOF JSON FORMATIDA QAYTARING:
{
  "muvaffaqiyatli": true,
  "turi": "suhbat",
  "matn": "Sizning erkin, to'liq, samimiy va mazmunli javobingiz..."
}`;
  } else if (masalaTuri === "olimpiada") {
    tizimPrompti = `${OLIMPIADA_SYSTEM_PROMPT}\n${kontekstMatni}`;
  } else if (masalaTuri === "termo") {
    tizimPrompti = `${TERMO_SYSTEM_PROMPT}\n${kontekstMatni}`;
  } else if (masalaTuri === "anorganik") {
    tizimPrompti = `${ANORGANIK_SYSTEM_PROMPT}\n${kontekstMatni}`;
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
  "masalaTuri": "eritmalar | kristallogidrat | stexiometriya | gazlar | elektroliz | organik | muvozanat | termokimyo | anorganik | olimpiada",
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
  "boshqaMasalalar": [],
  "yakuniyJavob": "...",
  "ovozMatni": "O'quvchi uchun samimiy, qisqa audio xulosa matni"
}`;
  }

  const foydalanuvchiPrompti = rasm
    ? `Ilova qilingan rasmdagi kimyo masalasini (ayniqsa test variantlari va savol raqamini) sinchkovlik bilan OCR orqali o'qib oling.
${tozaMatn ? `Foydalanuvchi ko'rsatmasi: "${tozaMatn}"` : ""}

KO'P MASALALARNI BOSHQARISH QOIDASI:
1. Agar rasmda bir nechta masala yoki test raqamlari bo'lsa (masalan, #1, #2, #3 yoki #12, #13, #14):
   - Agar foydalanuvchi aniq raqamni so'ragan bo'lsa (masalan: "13-masala"), aynan o'sha masalani to'liq yeching.
   - Agar aniq raqam aytilmagan bo'lsa, rasmdagi birinchi (asosiy) masalani ${rejim} rejimida yeching.
2. "masalaMatni" maydonida aynan qaysi masala yechilayotganini ko'rsating (masalan: "[12-masala]: ...").
3. "boshqaMasalalar" massivida rasmdagi qolgan yechilmagan masalalar nomlari/raqamlarini ro'yxat qiling (masalan: ["13-masala", "14-masala"]). Agar boshqa masala bo'lmasa, bo'sh massiv [] qoldiring.`
    : `Foydalanuvchi xabari: "${tozaMatn}"`;

  // FAQAT O'TA MURAKKAB / OLIMPIADA MASALALARIGA DeepSeek-R1 (Reasoner) YO'NALTIRILADI
  const preferDeepSeek = isOtaMurakkabMasala(tozaMatn, masalaTuri);

  const natija = await aiModelChaqir(foydalanuvchiPrompti, {
    systemPrompt: tizimPrompti,
    jsonRejim: true,
    rasmBase64: rasm,
    preferDeepSeek
  });

  if (natija && natija.muvaffaqiyatli) {
    aiKesh.saqlash(keshKaliti, natija);

    if (foydalanuvchiId) {
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "user",
        matn: tozaMatn || "Rasm",
        mavzu: masalaTuri,
        foydalanuvchiIsmi
      });
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "ai",
        matn: natija.matn || natija.yakuniyJavob || "Yechim",
        mavzu: masalaTuri,
        foydalanuvchiIsmi
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
  const kontekstMatni = aiXotira.kontekstPromptiTuz(foydalanuvchiId, foydalanuvchiIsmi);

  const tizimPrompti = `Siz mehribon, o'ta bilimdon va samimiy Kimyo Repetitorisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan talaba ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

O'quvchi avval yechilgan masala yuzasidan savol bermoqda:
MASALA: "${masalaMatni}"
AVVALGI YECHIM: "${yechim?.yakuniyJavob || ''}"

TUSHUNTIRISH TALABI:
Javobingiz qisqa, aniq, pedagogik jihatdan dalillangan, do'stona va o'quvchini rag'batlantiruvchi bo'lsin.`;

  const prompt = `O'quvchining savoli: "${savol}"`;

  const javob = await aiModelChaqir(prompt, {
    systemPrompt: tizimPrompti,
    jsonRejim: false
  });

  if (javob && foydalanuvchiId) {
    aiXotira.xabarQosh(foydalanuvchiId, {
      rol: "user",
      matn: savol,
      foydalanuvchiIsmi
    });
    aiXotira.xabarQosh(foydalanuvchiId, {
      rol: "ai",
      matn: javob,
      foydalanuvchiIsmi
    });
  }

  return javob || "Kechirasiz, savolingizni qayta shakllantirib bera olasizmi?";
}
