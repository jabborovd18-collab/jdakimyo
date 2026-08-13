import { NextResponse } from "next/server";
import {
  masalaMatniniTahlilQil,
  masalaTuriniAniqla,
  yechEritmalar,
  yechKristallogidrat,
  yechGazlar,
  yechStexiometriya,
  yechTermokimyo,
  yechAtom,
} from "@/lib/masala-dvigatel.js";

function apiKalitniOl() {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_AI_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.API_KEY ||
    ""
  );
}

/**
 * Google Generative AI (Gemini Multimodal) orqali matn yoki rasm orqali masalani 3 xil rejimda yechish.
 * Rejimlar:
 *  - 'tuzoq': Masaladagi keskin burilish, yashirin qopqon va keng tarqalgan xatolar tahlili (javobsiz).
 *  - 'yonalish': Bosqichma-bosqich yo'l-yo'riq, reaksiya tenglamalari va formulalar (hisob-kitob talaba zimmasida).
 *  - 'toliq': Barcha bosqichlar, stexiometriya va yakuniy matematik javob bilan to'liq master yechim.
 */
async function geminiBilanYech(masalaMatni, rejim = "toliq", rasm = null) {
  const apiKey = apiKalitniOl();
  if (!apiKey) return null;

  try {
    let rejimTalabi = "";
    if (rejim === "tuzoq") {
      rejimTalabi = `
REJIM: "KESKIN BURILISH VA YASHIRIN TUZOQ" (O'z ustida ishlayotganlar uchun).
TALABLAR:
1. Yakuniy matematik javobni (sonni) ASLO AYTMANGLIK KERAK!
2. Masalada 90% o'quvchilar va abituriyentlar e'tibordan chetda qoldiradigan "ayyorlik", "tuzoq" yoki keskin burilish nuqtasini ochib bering (masalan: kristallogidrat suvi erituvchiga qo'shilishi, kislota-ishqor ortib qolishi, eruvchanlik chegarasi, normal sharoit va haqiqiy sharoit farqi, cheklovchi reagent va h.k.).
3. "tuzoqTahlili" obyektini to'liq to'ldiring:
   - kalitNuqta: Masaladagi eng nozik sirli qoida
   - nimaUchunMuhim: Nega bu qoidani hisobga olmaslik xatoga olib keladi
   - kengTarqalganXato: Odatda qanday xato qilinadi
4. "yakuniyJavob" maydoniga yakuniy sonni emas, balki "Ushbu nozik nuqtani hisobga olib masalani mustaqil yeching" degan qisqa xulosa yozing.`;
    } else if (rejim === "yonalish") {
      rejimTalabi = `
REJIM: "BOSQICHMA-BOSQICH YO'NALTIRISH VA FORMULALAR" (Hisoblash talaba zimmasida).
TALABLAR:
1. Yakuniy javobni (sonli natijani) MUTLAQO YASHIRING!
2. Masalani yechish uchun zarur bo'lgan barcha kimyoviy reaksiya tenglamalarini va formulalarni bering.
3. Bosqichma-bosqich aniq reja taqdim eting: 1-Qadam nima topiladi, 2-Qadam qaysi proporsiya tuziladi, 3-Qadam qanday yakunlanadi.
4. "yonalish" obyektini to'ldiring:
   - formulalar: [kerakli formulalar ro'yxati]
   - qadamlarRejasi: [1-qadam, 2-qadam...]
   - maslahat: foydalanuvchiga rag'batlantiruvchi maslahat.
5. "yakuniyJavob" maydoniga "Formulalar bo'yicha mustaqil hisoblab, yakuniy javobni toping" deb yozing.`;
    } else {
      rejimTalabi = `
REJIM: "TO'LIQ MASTER YECHIM" (Mukammal bosqichma-bosqich tushuntirish).
TALABLAR:
1. Barcha kimyoviy reaksiya tenglamalarini tenglashtirilgan holda ko'rsating.
2. Har bir bosqichning fizik-kimyoviy mohiyatini, oraliq mollar va massalarni batafsil tushuntiring.
3. "yakuniyJavob" maydoniga aniq va chiroyli yakuniy sonli javobni yozing.`;
    }

    const promptText = `Siz O'zbekistondagi eng kuchli kimyo professori, olimpiada murabbiyi va DTM ekspertisiz.
${rasm ? "Ilova qilingan rasmda kimyoviy masala yoki savol keltirilgan. Rasmdagi barcha formulalar, matn va sonlarni o'qib oling, shartini aniqlang va O'ZBEK TILIDA chuqur, mukammal va pedagogik mahorat bilan tahlil qiling." : `Quyidagi kimyoviy masalani O'ZBEK TILIDA chuqur, mukammal va pedagogik mahorat bilan tahlil qiling:\n\n"${masalaMatni}"`}

${rejimTalabi}

VIZUAL GRAFIK QOIDALARI:
Agar masalada eritmalar aralashmasi bo'lsa "krest" (Pearson diagonal), agar cheklovchi reagent bo'lsa "stexiometriya", agar kristallogidrat bo'lsa "kristallogidrat", agar gazlar bo'lsa "gaz" turidagi "vizualSxema" obyektini ham qo'shing.

NATIJANI FAQAT QUYIDAGI SOF JSON FORMATIDA QAYTARING (hech qanday markdown \`\`\`json tegisiz):
{
  "rejim": "${rejim}",
  "masalaMatni": "Rasmdan yoki matndan o'qib olingan aniq masala sharti",
  "tenglama": "Reaksiya tenglamasi yoki asosiy kimyoviy munosabat",
  "tuzoqTahlili": {
    "kalitNuqta": "...",
    "nimaUchunMuhim": "...",
    "kengTarqalganXato": "..."
  },
  "yonalish": {
    "formulalar": ["...", "..."],
    "qadamlarRejasi": ["1-qadam...", "2-qadam..."],
    "maslahat": "..."
  },
  "bosqichlar": [
    { "sarlavha": "1-Bosqich: ...", "matn": "...", "formula": "..." },
    { "sarlavha": "2-Bosqich: ...", "matn": "...", "formula": "..." }
  ],
  "yakuniyJavob": "...",
  "vizualSxema": {
    "turi": "krest | stexiometriya | kristallogidrat | gaz",
    "nomi": "...",
    ...tegishli ma'lumotlar...
  },
  "ovozMatni": "O'zbek tilida dona-dona va tushunarli o'qiladigan 3-4 ta gapdan iborat audio-matn"
}`;

    const parts = [{ text: promptText }];

    if (rasm && typeof rasm === "string") {
      let mimeType = "image/jpeg";
      let base64Data = rasm;

      if (rasm.includes(";base64,")) {
        const split = rasm.split(";base64,");
        mimeType = split[0].replace("data:", "");
        base64Data = split[1];
      }

      parts.unshift({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) {
      const resAlt = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "antigravity-preview-05-2026",
            input: promptText,
          }),
        }
      ).catch(() => null);

      if (resAlt && resAlt.ok) {
        const dataAlt = await resAlt.json();
        const modelStep = dataAlt?.steps?.find((s) => s.type === "model_output");
        const rawText = modelStep?.content?.[0]?.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
      }
      return null;
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (candidateText) {
      const jsonMatch = candidateText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }
  } catch (err) {
    console.error("Gemini API yechish xatosi:", err);
  }
  return null;
}

// POST /api/masala/yech
export async function POST(request) {
  try {
    const body = await request.json();
    const { masalaMatni = "", rejim = "toliq", rasm = null } = body;

    if (!masalaMatni.trim() && !rasm) {
      return NextResponse.json(
        { xato: "Masala matni yoki rasm kiritilmadi." },
        { status: 400 }
      );
    }

    // 1. Birinchi navbatda Google AI (Multimodal) orqali masalani tanlangan rejim bo'yicha chuqur yechish
    const aiNatija = await geminiBilanYech(masalaMatni, rejim, rasm);
    if (aiNatija) {
      return NextResponse.json({
        muvaffaqiyatli: true,
        turi: "ai_tahlil",
        rejim,
        ...aiNatija,
      });
    }

    // 2. AI ishlamasa, mahalliy determinik dvigatel orqali zaxira tahlilini yurgizish
    const tahlil = masalaMatniniTahlilQil(masalaMatni);
    const turi = masalaTuriniAniqla(masalaMatni);

    let natija = null;
    if (turi === "kristallogidrat") {
      natija = yechKristallogidrat(masalaMatni, tahlil, rejim);
    } else if (turi === "eritmalar") {
      natija = yechEritmalar(masalaMatni, tahlil, rejim);
    } else if (turi === "gazlar") {
      natija = yechGazlar(masalaMatni, tahlil, rejim);
    } else if (turi === "termokimyo") {
      natija = yechTermokimyo(masalaMatni, tahlil, rejim);
    } else if (turi === "atom") {
      natija = yechAtom(masalaMatni, tahlil, rejim);
    } else {
      natija = yechStexiometriya(masalaMatni, tahlil, rejim);
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      turi,
      rejim,
      ...natija,
    });
  } catch (err) {
    return NextResponse.json(
      { xato: err.message || "Masalani tahlil qilishda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
