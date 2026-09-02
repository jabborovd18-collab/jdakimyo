// app/api/masala/yech/route.js
//
// JDA KIMYO — Ko'p Agentli Kimyoviy Masalalar API Handler (v4.0.0).
// Groq (120B / Qwen-3.8) + OpenRouter + Gemini zaxira zanjiri bilan to'liq qurollangan.

import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { tezlikOshdimi, AI_QOIDASI } from "@/lib/tezlik-cheklov.js";
import { multiAgentMasalaYech, aiRepetitorChat } from "@/lib/ai-agents/masala-orkestrator.js";
import { aiQuota } from "@/lib/ai-agents/ai-quota.js";
import { aiHodisalarniYoz } from "@/lib/ai-agents/ai-telemetriya.js";
import { aiSozlamaniOl } from "@/lib/ai-agents/ai-config.js";

const MATN_CHEGARASI = 4000;
const RASM_BAYT_CHEGARASI = 4 * 1024 * 1024; // 4 MB

function xotiraKontekstiniTozala(xotira) {
  if (!xotira || typeof xotira !== "object") return null;
  const oxirgiXabarlar = Array.isArray(xotira.oxirgiXabarlar)
    ? xotira.oxirgiXabarlar
      .slice(-6)
      .filter((xabar) => xabar?.rol === "user" || xabar?.rol === "ai")
      .map((xabar) => ({
        rol: xabar.rol,
        matn: typeof xabar.matn === "string" ? xabar.matn.slice(0, 500) : "",
      }))
      .filter((xabar) => xabar.matn)
    : [];
  const mavzular = {};
  for (const [mavzu, soni] of Object.entries(xotira.profil?.mavzular || {}).slice(0, 30)) {
    const tozaMavzu = String(mavzu).slice(0, 60);
    const tozaSoni = Math.max(0, Math.min(10_000, Number(soni) || 0));
    if (tozaMavzu) mavzular[tozaMavzu] = tozaSoni;
  }
  return {
    oxirgiXabarlar,
    profil: Object.keys(mavzular).length ? { mavzular } : null,
  };
}

export async function POST(request) {
  const requestId = randomUUID();
  const hodisalar = [];
  let amal = "noma_lum";
  const telemetriya = (hodisa) => {
    hodisalar.push({
      ...hodisa,
      requestId,
      channel: "sayt",
      operation: amal,
    });
  };
  // Javob telemetriya yozilishini kutmaydi; server ish tugaguncha yozuvni
  // xavfsiz yakunlash uchun Next.jsning after mexanizmi ishlatiladi.
  after(async () => {
    try {
      await aiHodisalarniYoz(hodisalar);
    } catch (error) {
      console.error("[AI telemetriya yozuv xatosi]:", error?.message);
    }
  });

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

    const foydalanuvchiIsmi = session.user.fullName || session.user.username || "Do'stim";
    const { config: aiConfig } = await aiSozlamaniOl();
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ xato: "So'rov formati noto'g'ri." }, { status: 400 });
    }
    const {
      action = "yech",
      masalaMatni = "",
      rejim = "toliq",
      rasm = null,
      savol = "",
      yechim = null,
      ishlashYonalishi = "avtomatik",
      xotiraKonteksti: xomXotiraKonteksti = null,
    } = body;
    amal = action === "chat" ? "chat" : "yech";
    const xotiraKonteksti = xotiraKontekstiniTozala(xomXotiraKonteksti);

    const quotaBandQil = async () => {
      const quota = await aiQuota.bandQil(
        session.user.id,
        session.user.role,
        Boolean(session.user.isTeacher),
      );
      if (!quota.ruxsat) {
        const error = new Error(quota.xato);
        error.statusCode = 429;
        throw error;
      }
    };

    // AI REPETITOR BILAN MULOQOT (Follow-up Chat)
    if (action === "chat") {
      if (typeof savol !== "string" || !savol.trim()) {
        return NextResponse.json({ xato: "Savol matni kiritilmadi." }, { status: 400 });
      }
      if (savol.length > 2000 || typeof masalaMatni !== "string" || masalaMatni.length > MATN_CHEGARASI) {
        return NextResponse.json({ xato: "Suhbat matni ruxsat etilgan hajmdan oshdi." }, { status: 400 });
      }
      const oldingiJavob = typeof yechim?.yakuniyJavob === "string"
        ? yechim.yakuniyJavob.slice(0, 8000)
        : "";
      const chatNatija = await aiRepetitorChat({
        masalaMatni,
        yechim: { yakuniyJavob: oldingiJavob },
        savol: savol.trim(),
        foydalanuvchiId: session.user.id,
        foydalanuvchiIsmi,
        ishlashYonalishi,
        xotiraKonteksti,
        apiChaqirishdanOldin: quotaBandQil,
        kanal: "sayt",
        telemetriya,
      });
      return NextResponse.json({
        muvaffaqiyatli: true,
        action: "chat",
        javob: chatNatija.matn,
        aiYonalish: chatNatija.aiYonalish,
        kanallar: aiConfig.channels,
      });
    }

    if (action !== "yech") {
      return NextResponse.json({ xato: "Noma'lum amal." }, { status: 400 });
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
      foydalanuvchiIsmi,
      ishlashYonalishi,
      xotiraKonteksti,
      apiChaqirishdanOldin: quotaBandQil,
      kanal: "sayt",
      telemetriya,
    });

    if (!natija) {
      return NextResponse.json(
        { xato: "AI agentlari masalani tahlil qila olmadi. Iltimos, shartni to'liqroq yozing yoki qayta urinib ko'ring." },
        { status: 500 }
      );
    }
    if (natija.muvaffaqiyatli === false) {
      return NextResponse.json({ xato: natija.xato || "So'rov rad etildi." }, { status: 400 });
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      kanallar: aiConfig.channels,
      ...natija
    });
  } catch (err) {
    console.error("[Masala yech API xatosi]:", err);
    const ruxsatStatuslar = new Set([429, 502, 503, 504]);
    const status = ruxsatStatuslar.has(err?.statusCode) ? err.statusCode : 500;
    return NextResponse.json(
      { xato: status === 500 ? "Masalani tahlil qilishda server xatoligi yuz berdi." : err.message },
      { status }
    );
  }
}
