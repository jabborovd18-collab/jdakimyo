// app/api/masala/yech/route.js
//
// JDA KIMYO — Ko'p Agentli Kimyoviy Masalalar API Handler (v4.0.0).
// Groq (120B / Qwen-3.8) + OpenRouter + Gemini zaxira zanjiri bilan to'liq qurollangan.

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { tezlikOshdimi, AI_QOIDASI } from "@/lib/tezlik-cheklov.js";
import { multiAgentMasalaYech, aiRepetitorChat } from "@/lib/ai-agents/masala-orkestrator.js";
import { aiQuota } from "@/lib/ai-agents/ai-quota.js";

const MATN_CHEGARASI = 4000;
const RASM_BAYT_CHEGARASI = 4 * 1024 * 1024; // 4 MB

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { xato: "Masala yechish uchun tizimga kiring." },
        { status: 401 }
      );
    }

    const tezlik = tezlikOshdimi(`masala:${session.user.id}`, AI_QOIDASI);
    if (tezlik) {
      return NextResponse.json({ xato: tezlik }, { status: 429 });
    }

    // Kunlik quota limitini tekshirish
    const quotaTekshiruv = aiQuota.tekshir(session.user.id, session.user.role || "USER");
    if (!quotaTekshiruv.ruxsat) {
      return NextResponse.json({ xato: quotaTekshiruv.xato }, { status: 429 });
    }

    const foydalanuvchiIsmi = session.user.fullName || session.user.name || session.user.username || "Do'stim";
    const body = await request.json();
    const { action = "yech", masalaMatni = "", rejim = "toliq", rasm = null, savol = "", yechim = null } = body;

    // AI REPETITOR BILAN MULOQOT (Follow-up Chat)
    if (action === "chat") {
      if (!savol || !savol.trim()) {
        return NextResponse.json({ xato: "Savol matni kiritilmadi." }, { status: 400 });
      }
      const javob = await aiRepetitorChat({
        masalaMatni,
        yechim,
        savol,
        foydalanuvchiId: session.user.id,
        foydalanuvchiIsmi
      });
      return NextResponse.json({
        muvaffaqiyatli: true,
        action: "chat",
        javob
      });
    }

    // MASALA YECHISH REJIMI
    if (typeof masalaMatni !== "string") {
      return NextResponse.json(
        { xato: "Masala matni noto'g'ri formatda." },
        { status: 400 }
      );
    }

    if (!masalaMatni.trim() && !rasm) {
      return NextResponse.json(
        { xato: "Masala matni yoki rasm kiritilmadi." },
        { status: 400 }
      );
    }

    if (masalaMatni.length > MATN_CHEGARASI) {
      return NextResponse.json(
        { xato: `Masala matni ${MATN_CHEGARASI} belgidan oshmasligi kerak.` },
        { status: 400 }
      );
    }

    if (rasm) {
      const taxminiyBayt = (rasm.length * 3) / 4;
      if (typeof rasm !== "string" || taxminiyBayt > RASM_BAYT_CHEGARASI) {
        return NextResponse.json(
          { xato: "Rasm hajmi 4 MB dan oshmasligi kerak." },
          { status: 413 }
        );
      }
    }

    // Ko'p agentli orkestrator orqali yechish va suhbat
    const natija = await multiAgentMasalaYech({
      masalaMatni: masalaMatni.trim(),
      rejim,
      rasm,
      foydalanuvchiId: session.user.id,
      foydalanuvchiIsmi
    });

    if (!natija) {
      return NextResponse.json(
        { xato: "AI agentlari masalani tahlil qila olmadi. Iltimos, shartni to'liqroq yozing yoki qayta urinib ko'ring." },
        { status: 500 }
      );
    }

    // Agar keshdan olinmagan bo'lsa (yangi API sarflangan bo'lsa) quota hisobini 1 ga oshiramiz
    if (!natija._keshdan) {
      aiQuota.oshir(session.user.id);
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      ...natija
    });
  } catch (err) {
    console.error("[Masala yech API xatosi]:", err);
    return NextResponse.json(
      { xato: "Masalani tahlil qilishda server xatoligi yuz berdi." },
      { status: 500 }
    );
  }
}
