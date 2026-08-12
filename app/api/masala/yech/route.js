import { NextResponse } from "next/server";
import {
  masalaMatniniTahlilQil,
  masalaTuriniAniqla,
  yechEritmalar,
  yechGazlar,
  yechTermokimyo,
  yechAtom,
} from "@/lib/masala-dvigatel.js";

// Gemini AI API orqali har qanday kimyoviy masala yoki savolni 100% aniq va ilmiy yechish
async function geminiBilanYech(masalaMatni) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Siz o'zbek tilidagi eng bilimli va professional kimyo professorisiz. Quyidagi kimyoviy masala yoki savolni diqqat bilan tahlil qiling va hisoblang:
"${masalaMatni}"

REJALASHTIRISH VA HISOBLASH QOIDALARI:
1. Agarda masala aralashma (masalan kislorod O₂ va ozon O₃ aralashmasi), stexiometriya, eritmalar yoki nazariy savol bo'lsa, barcha tenglamalarni va matematik hisoblarni O'ZBEK TILIDA qadamma-qadam bajaring.
2. Natijani FAQAT QUYIDAGI SOF JSON FORMATIDA QAYTARING:
{
  "tenglama": "Reaksiya tenglamasi, aralashma formulasi yoki asosiy mantiqiy hisob tengligi",
  "yakuniyJavob": "Aniq va qisqa yakuniy javob (masalan: Hajmiy nisbati V(O₂) : V(O₃) = 3 : 1)",
  "bosqichlar": [
    { "sarlavha": "1-Bosqich: Molyar massalar va mollar nisbati", "matn": "M(O₂) = 32 g/mol, M(O₃) = 48 g/mol..." },
    { "sarlavha": "2-Bosqich: Matematik sistema tenglamasi", "matn": "..." }
  ],
  "ovozMatni": "Ovozli pleyerda o'zbek tilida dona-dona va tushunarli o'qiladigan 3-4 ta gapdan iborat matn"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
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
    const { masalaMatni = "" } = body;

    if (!masalaMatni.trim()) {
      return NextResponse.json(
        { xato: "Masala matni kiritilmadi." },
        { status: 400 }
      );
    }

    // 1. Birinchi navbatda Gemini AI orqali masalani chuqur va aniq yechish
    const aiNatija = await geminiBilanYech(masalaMatni);
    if (aiNatija) {
      return NextResponse.json({
        muvaffaqiyatli: true,
        turi: "ai_mukammal",
        ...aiNatija,
      });
    }

    // 2. AI ishlamasa, mahalliy determinik dvigatel orqali zaxira hisobini yurgizish
    const tahlil = masalaMatniniTahlilQil(masalaMatni);
    const turi = masalaTuriniAniqla(masalaMatni);

    let natija = null;
    if (turi === "eritmalar") {
      natija = yechEritmalar(masalaMatni, tahlil);
    } else if (turi === "gazlar") {
      natija = yechGazlar(masalaMatni, tahlil);
    } else if (turi === "termokimyo") {
      natija = yechTermokimyo(masalaMatni, tahlil);
    } else if (turi === "atom") {
      natija = yechAtom(masalaMatni, tahlil);
    } else {
      natija = {
        tenglama: "Stexiometriya va Kimyoviy Mantiq",
        bosqichlar: [
          {
            sarlavha: "1-Bosqich: Masala matnini tahlil qilish",
            matn: `Berilgan masala sharti: "${masalaMatni}".`,
          },
        ],
        yakuniyJavob: "Masalani yechish uchun ko'proq kimyoviy kattaliklar (g, mol, L) kiriting.",
        ovozMatni: "Masalani aniq hisoblash uchun iltimos moddalar formulalari va miqdorlarini to'liq kiritishni tekshiring.",
      };
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      turi,
      ...natija,
    });
  } catch (err) {
    return NextResponse.json(
      { xato: err.message || "Masalani yechishda xatolik yuz berdi." },
      { status: 500 }
    );
  }
}
