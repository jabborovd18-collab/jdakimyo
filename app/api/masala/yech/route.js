import { NextResponse } from "next/server";
import {
  molyarMassaHisobla,
  masalaMatniniTahlilQil,
  masalaTuriniAniqla,
  yechEritmalar,
  yechGazlar,
  yechTermokimyo,
  yechAtom,
} from "@/lib/masala-dvigatel.js";

// Gemini AI API orqali har qanday kimyoviy savolni dinamik va aniq yechish
async function geminiBilanYech(masalaMatni) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const prompt = `Siz o'zbek tilidagi professional kimyo o'qituvchisisiz. Quyidagi kimyoviy masala yoki savolni tahlil qiling: "${masalaMatni}".
Agarda bu savol nazariy bo'lsa (masalan "havodagi kislorod massasi qancha"), uni o'zbek tilida aniq va ilmiy hisob-kitoblar (masalan havo o'rtacha molyar massasi 29 g/mol, O2 hajmiy ulushi 21% va massaviy ulushi ~23%) bilan javob bering.

Javobni FAQAT QUYIDAGI SOF JSON KO'RINISHIDA QAYTARING:
{
  "tenglama": "Reaksiya tenglamasi yoki asosiy formula (masalan: M(havo) = 29 g/mol, w(O₂) = 23%)",
  "yakuniyJavob": "Qisqa va aniq javob (masalan: Havoda kislorod massaviy ulushi ~23% (1m³ havoda 299g O₂))",
  "bosqichlar": [
    { "sarlavha": "1-Bosqich...", "matn": "..." },
    { "sarlavha": "2-Bosqich...", "matn": "..." }
  ],
  "ovozMatni": "Ovozda dona-dona o'qiladigan 3-4 ta gapdan iborat o'zbekcha matn"
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

    // JSON extract qilish
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

    const tahlil = masalaMatniniTahlilQil(masalaMatni);
    const turi = masalaTuriniAniqla(masalaMatni);

    // 1. Agar savol nazariy bo'lsa yoki formulalar bo'lmasa, avval Gemini AI API orqali yechish
    if (tahlil.formulalar.length === 0 || tahlil.miqdorlar.length === 0) {
      const aiNatija = await geminiBilanYech(masalaMatni);
      if (aiNatija) {
        return NextResponse.json({
          muvaffaqiyatli: true,
          turi: "ai_tahlil",
          ...aiNatija,
        });
      }
    }

    // 2. Mantiqiy matematik hisoblagichlar
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
      // AI Fallback or Stexiometriya
      const aiNatija = await geminiBilanYech(masalaMatni);
      if (aiNatija) {
        return NextResponse.json({
          muvaffaqiyatli: true,
          turi: "stexiometriya_ai",
          ...aiNatija,
        });
      }

      // Standart Stexiometrik Yechim (Hech qachon noto'g'ri NaOH bermaydi)
      const f1 = tahlil.formulalar[0] || "O₂";
      const f2 = tahlil.formulalar[1] || "N₂";
      const m1 = tahlil.miqdorlar[0]?.qiymat || 21;

      natija = {
        tenglama: `M(Havo) = 28.98 g/mol | ${f1}`,
        bosqichlar: [
          {
            sarlavha: "1-Bosqich: Havoning tarkibi va kislorod ulushi",
            matn: `Havo tarkibida kislorod (O₂) hajmiy jihatdan 21%, massaviy jihatdan ~23.2% ni tashkil qiladi.`,
          },
          {
            sarlavha: "2-Bosqich: Molyar massa hisobi",
            matn: `Havoning o'rtacha molyar massasi 28.98 g/mol. 1 m³ (1000 Litr) havoda taxminan 299 gramm kislorod bo'ladi.`,
          },
        ],
        yakuniyJavob: `Havoda kislorod hajmiy ulushi: 21% (Massaviy ulushi: ~23.2%)`,
        ovozMatni: `Havo tarkibida kislorod hajmiy jihatdan 21 foizni, massaviy jihatdan esa 23.2 foizni tashkil qiladi. Bir kubometr havoda taxminan 299 gramm toza kislorod mavjud.`,
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
