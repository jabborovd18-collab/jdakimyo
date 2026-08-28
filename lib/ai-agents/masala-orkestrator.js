// lib/ai-agents/masala-orkestrator.js
//
// JDA KIMYO — KO'P AGENTLI KIMYOVIY MASALALAR & SUHBAT ORKESTRATORI (v5.0.0 Enterprise)
// Aqlli Kesh + Xavfsizlik Qalqoni + Kontekst Xotirasi + Erkin SI Chat + Organik/DTM qoidalari.

import { aiModelChaqir } from "./ai-gateway.js";
import { aiKesh } from "./ai-cache.js";
import { xavfsizlikTekshir } from "./ai-security.js";
import { aiXotira } from "./ai-memory.js";

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
    // Xotiraga qo'shish
    if (foydalanuvchiId) {
      aiXotira.xabarQosh(foydalanuvchiId, { rol: "user", matn: tozaMatn || "Rasm" });
      aiXotira.xabarQosh(foydalanuvchiId, {
        rol: "ai",
        matn: keshdagiNatija.matn || keshdagiNatija.yakuniyJavob || "Yechim",
      });
    }
    return keshdagiNatija;
  }

  // 3. Kontekst xotirasini olish
  const oldingiMuloqot = foydalanuvchiId ? aiXotira.kontekstOl(foydalanuvchiId) : [];
  let kontekstMatni = "";
  if (oldingiMuloqot.length > 0) {
    kontekstMatni = "\n\nOLDINGI SUHBAT KONTEKSTI (Eslab qoling):\n" +
      oldingiMuloqot.map((m) => `${m.rol === "user" ? "Foydalanuvchi" : "Siz"}: ${m.matn}`).join("\n");
  }

  // 4. Asosiy Orkestrator Tizim Prompti
  const tizimPrompti = `Siz JDA KIMYO platformasining samimiy, do'stona, o'ta bilimdon Kimyo AI assistentisiz (nomingiz: JDA Kimyo AI).
Siz bilan muloqot qilayotgan foydalanuvchi ismi: "${foydalanuvchiIsmi}".${kontekstMatni}

SIZDA 2 XIL REJIM MAVJUD (NIYATNI ANGLASH):

1. ERKIN SUHBAT REJIMI (Salomlashish, hol-ahvol, tanishish, umumiy savol yoki fikr bildirish):
   - Agar foydalanuvchi salomlashsa (masalan: "Salom", "Assalomu alaykum", "Yaxshimisan", "Qalaysan"), hol-ahvol so'rasa, siz bilan suhbatlashsa yoki umumiy kimyoviy maslahat so'rasa:
   - Unga samimiy, quvnoq, xushmuomala va do'stona tarzda, ismi bilan murojaat qilib javob bering.
   - Masalan: "Assalomu alaykum, ${foydalanuvchiIsmi}! Men JDA Kimyo AI yaxshi, o'zingiz-chi? Bugun birga masala yechib beraymi yoki yangi masala berasanmi?"
   - FORMAT:
   {
     "muvaffaqiyatli": true,
     "turi": "suhbat",
     "matn": "Assalomu alaykum, ${foydalanuvchiIsmi}! ..."
   }

2. KIMYO MASALASI YECHISH REJIMI:
   - Agar foydalanuvchi aniq kimyoviy masala, tenglama, test (A, B, C, D) yoki rasm yuborsa, quyidagi 4 ta agent zanjiri bo'yicha yeching:
   
   QAT'IY DTM VA KIMYO QOIDALARI:
   - GOMOLOGIK QATOR: Aniq tuzilishdagi (2-metilalkan, 3-metilalken, alkin-2, aldegid, ikkilamchi spirt va h.k.) moddaning gomologi so'ralganda, aynan shu tarmoqlanish saqlanadi!
     * 2-metilalkanlarning eng kichik vakili — 2-metilpropan (C4). Shuning uchun 2-metilgeksan (C7) dan kichik gomologlari 3 ta (2-metilpropan C4, 2-metilbutan C5, 2-metilpentan C6).
     * 3-metilalkanlar eng kichigi C6. 2,2-dimetilalkanlar eng kichigi C5. Ketonlar eng kichigi C3.
   - TEST VARIANTLARI: A, B, C, D variantlari bo'lsa, to'g'ri variantni "yakuniyJavob" da aniq ko'rsating (masalan: "3 ta (Javob: C)").
   - REJIMLAR:
     * 'tuzoq': Yashirin qopqon va nozik ayyorlik tahlili.
     * 'yonalish': Aniq formulalar va bosqichlar rejasi (hisoblashsiz).
     * 'toliq': To'liq master-yechim.

   SOF JSON FORMATIDA QAYTARING:
   {
     "muvaffaqiyatli": true,
     "turi": "yechim",
     "rejim": "${rejim}",
     "masalaTuri": "eritmalar | kristallogidrat | stexiometriya | gazlar | elektroliz | organik | muvozanat | termokimyo",
     "masalaMatni": "O'qib olingan yoki kiritilgan aniq masala sharti",
     "berilgan": [
       { "belgi": "m(eritma)", "qiymat": "200 g" }
     ],
     "topishKerak": [
       { "belgi": "N(gomolog)", "nom": "Gomologlar soni" }
     ],
     "tenglamalar": [
       "CH_3-CH(CH_3)-CH_2-CH_2-CH_2-CH_3 \\quad (C_7H_{16})"
     ],
     "tuzoqTahlili": {
       "kalitNuqta": "Masaladagi eng nozik sirli qoida",
       "nimaUchunMuhim": "Nega buni hisobga olmaslik xatoga olib keladi",
       "kengTarqalganXato": "Ko'pchilik yo'l qo'yadigan odatiy xato"
     },
     "yonalish": {
       "formulalar": ["C_nH_{2n+2}"],
       "qadamlarRejasi": ["1-qadam: ...", "2-qadam: ..."],
       "maslahat": "..."
     },
     "bosqichlar": [
       {
         "raqam": 1,
         "sarlavha": "1-Bosqich: Moddaning tuzilishi va gomologik qatorini aniqlash",
         "tushuntirish": "...",
         "formula": "C_nH_{2n+2}",
         "mantiq": "..."
       }
     ],
     "krestSxemasi": null,
     "yakuniyJavob": "3 ta gomolog (Javob: C)",
     "ovozMatni": "O'zbek tilida dona-dona va jonli o'qiladigan 3-4 gaplik xulosa"
   }`;

  const foydalanuvchiPrompti = rasm
    ? `Ilova qilingan rasmdagi kimyo masalasini (ayniqsa test variantlari va savol raqamini) sinchkovlik bilan OCR orqali o'qib oling, barcha matn va sonlarni tahlil qiling va ${rejim} rejimida yeching.`
    : `Foydalanuvchi xabari: "${tozaMatn}"`;

  const natija = await aiModelChaqir(foydalanuvchiPrompti, {
    systemPrompt: tizimPrompti,
    jsonRejim: true,
    rasmBase64: rasm
  });

  if (natija && natija.muvaffaqiyatli) {
    // Keshga saqlash
    aiKesh.saqlash(keshKaliti, natija);

    // Xotiraga saqlash
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
