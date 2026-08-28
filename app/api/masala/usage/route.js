// app/api/masala/usage/route.js
//
// JDA KIMYO AI — USAGE & MODELS STATISTIKASI API HANDLER (v1.0.0)
// Claude & Gemini uslubidagi modal uchun jonli foydalanish ko'rsatkichlarini beradi.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { aiQuota } from "@/lib/ai-agents/ai-quota.js";
import { aiKesh } from "@/lib/ai-agents/ai-cache.js";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { xato: "Tizimga kiring." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userRole = session.user.role || "USER";

    const quota = aiQuota.malumotOl(userId, userRole);
    const keshStat = aiKesh.statistikaOl();

    return NextResponse.json({
      muvaffaqiyatli: true,
      foydalanuvchi: {
        ism: session.user.fullName || session.user.name || session.user.username || "Talaba",
        rol: userRole,
      },
      quota: {
        ishlatildi: quota.ishlatildi,
        jamiLimit: quota.jamiLimit,
        qoldi: quota.qoldi,
        foiz: quota.foiz,
        yangilanish: "Har kuni soat 00:00 da",
      },
      modellar: [
        {
          nom: "Groq LPU 120B / Qwen",
          turi: "Ultra-tezkor Hisoblash",
          holat: "Faol (Jonli)",
          tezlik: "300 tok/s",
        },
        {
          nom: "OpenRouter Vision (MiniMax/Nemotron)",
          turi: "Kitob & Rasm OCR",
          holat: "Faol (Jonli)",
          tezlik: "Yuqori",
        },
        {
          nom: "Google Gemini 3.6 Flash",
          turi: "Pedagogik Tahlilchi",
          holat: "Faol (Zaxira)",
          tezlik: "Tezkor",
        },
        {
          nom: "JDA Smart Cache & Deterministik",
          turi: "0ms Kimyoviy Dvigatel",
          holat: "Faol (Tejamkor)",
          tezlik: "10ms",
        },
      ],
      keshStatistika: {
        jamiSoqovlar: keshStat.jamiSoqovlar,
        tejalganTokenlar: keshStat.tejalganTokenlar,
        samaradorlik: keshStat.samaradorlikFoizi,
      },
    });
  } catch (err) {
    console.error("[Usage API xatosi]:", err);
    return NextResponse.json(
      { xato: "Statistikani yuklab bo'lmadi." },
      { status: 500 }
    );
  }
}
