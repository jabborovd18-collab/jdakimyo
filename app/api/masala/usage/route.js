// app/api/masala/usage/route.js
//
// JDA KIMYO AI — USAGE & MODELS STATISTIKASI API HANDLER (v1.0.0)
// Claude & Gemini uslubidagi modal uchun jonli foydalanish ko'rsatkichlarini beradi.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { aiQuota } from "@/lib/ai-agents/ai-quota.js";
import { aiKesh } from "@/lib/ai-agents/ai-cache.js";
import { aiSozlamaniOl } from "@/lib/ai-agents/ai-config.js";

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
    const userRole = session.user.role || "bakalavr";

    const [quota, faolSozlama] = await Promise.all([
      aiQuota.malumotOl(userId, userRole, Boolean(session.user.isTeacher)),
      aiSozlamaniOl(),
    ]);
    const keshStat = aiKesh.statistikaOl(faolSozlama.config.cache);

    return NextResponse.json({
      muvaffaqiyatli: true,
      kanallar: faolSozlama.config.channels,
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
          nom: "JDA Kimyo Core AI (v6.0 Reasoner)",
          turi: "DTM & Olimpiada Masalalar Tahlilchisi",
          holat: "Faol (Jonli)",
          tezlik: "Yuqori tezlik",
        },
        {
          nom: "JDA Multimodal Vision",
          turi: "Darslik & Qo'lyozma Rasmlar OCR",
          holat: "Faol (Jonli)",
          tezlik: "Sekundlik",
        },
        {
          nom: "JDA Pedagog & Audio Repetitor",
          turi: "KaTeX Formulalari & Jonli Ovoz",
          holat: "Faol (Jonli)",
          tezlik: "Tabiiy nutq",
        },
        {
          nom: "JDA Smart Cache & Deterministik",
          turi: "0ms Aniq Formulalar va Molyar Dvigatel",
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
