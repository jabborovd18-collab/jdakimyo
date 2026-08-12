import { NextResponse } from "next/server";
import {
  masalaMatniniTahlilQil,
  masalaTuriniAniqla,
  yechEritmalar,
  yechGazlar,
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

// Google Interactions API orqali har qanday kimyoviy masala va savolni mukammal yechish
async function geminiBilanYech(masalaMatni) {
  const apiKey = apiKalitniOl();
  if (!apiKey) return null;

  try {
    const prompt = `Siz o'zbek tilidagi eng bilimli va professional kimyo professorisiz. Quyidagi kimyoviy masala yoki savolni diqqat bilan tahlil qiling va hisoblang:
"${masalaMatni}"

REJALASHTIRISH VA HISOBLASH QOIDALARI:
1. Agarda masala to'liq berilgan bo'lsa, barcha tenglamalarni va hisoblarni O'ZBEK TILIDA qadamma-qadam bajaring.
2. Agarda masala sharti chala yoki qo'shimcha ma'lumot yetishmasa (masalan faqat 40g O2 va O3 aralashmasi berilib, o'rtacha molyar massa berilmagan bo'lsa), buni foydalanuvchiga xushmuomalalik bilan tushuntirib, qaysi ma'lumot yetishmayotganini yozing.
3. Natijani FAQAT QUYIDAGI SOF JSON FORMATIDA QAYTARING:
{
  "tenglama": "Reaksiya tenglamasi, aralashma formulasi yoki asosiy mantiqiy hisob tengligi",
  "yakuniyJavob": "Aniq va qisqa yakuniy javob yoki yetishmayotgan ma'lumot haqida qisqa eslatma",
  "bosqichlar": [
    { "sarlavha": "1-Bosqich: Masala va birikmalar tahlili", "matn": "..." },
    { "sarlavha": "2-Bosqich: Hisoblash va mantiqiy natija", "matn": "..." }
  ],
  "ovozMatni": "Ovozli pleyerda o'zbek tilida dona-dona va tushunarli o'qiladigan 3-4 ta gapdan iborat matn"
}`;

    // 1. Interactions API endpoint
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/interactions?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "antigravity-preview-05-2026",
          input: prompt,
        }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    // Interactions API javobidan matnni ajratish
    const modelStep = data?.steps?.find((s) => s.type === "model_output");
    const rawText = modelStep?.content?.[0]?.text || "";

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Agar model JSON formatlamagan bo'lsa, matnni chiroyli strukturaga o'tkazish
    if (rawText.trim()) {
      return {
        tenglama: "Kimyoviy Masala Tahlili",
        yakuniyJavob: rawText.slice(0, 120) + "...",
        bosqichlar: [
          {
            sarlavha: "1-Bosqich: Ilmiy Tahlil va Yechim",
            matn: rawText,
          },
        ],
        ovozMatni: rawText.replace(/[*#]/g, "").slice(0, 300),
      };
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

    // 1. Birinchi navbatda Google Interactions API orqali masalani chuqur va aniq yechish
    const aiNatija = await geminiBilanYech(masalaMatni);
    if (aiNatija) {
      return NextResponse.json({
        muvaffaqiyatli: true,
        turi: "ai_interactions",
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
        tenglama: "Kimyoviy Stexiometriya va Mantiq",
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
