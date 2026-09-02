// JDA Kimyo AI boshqaruvi: kuzatuv va o'zgartirish huquqlari ajratilgan.
// Maxfiy API kalitlari va foydalanuvchi suhbatlari bu API orqali chiqmaydi.

import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { aiKesh } from "@/lib/ai-agents/ai-cache.js";
import {
  aiConfigXavfsizTayyorla,
  aiSozlamagaQaytish,
  aiSozlamaniOl,
  aiSozlamaniSaqlash,
  aiSozlamaVersiyalariniOl,
} from "@/lib/ai-agents/ai-config.js";
import { aiModelReyestriOl, aiProvayderKorigi } from "@/lib/ai-agents/ai-gateway.js";
import { aiDashboardMalumotiOl } from "@/lib/ai-agents/ai-telemetriya.js";
import { aiSifatSinoviniIshgaTushir } from "@/lib/ai-agents/ai-eval.js";

const KORIK_ORALIGI_MS = 20_000;

function radEtildi(xabar = "Bu amal uchun ruxsat yo'q.") {
  return NextResponse.json({ xato: xabar }, { status: 403 });
}

async function korikOrniniBandQil(adminId) {
  const kalit = `admin:ai-korik:${adminId}`;
  for (let urinish = 0; urinish < 3; urinish += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const hozir = new Date();
        const yozuv = await tx.sorovLimit.findUnique({ where: { kalit } });
        if (yozuv && hozir.getTime() - yozuv.oynaBoshi.getTime() < KORIK_ORALIGI_MS) {
          const xato = new Error("Provayder ko'rigini 20 soniyadan keyin qayta ishga tushiring.");
          xato.statusCode = 429;
          throw xato;
        }
        await tx.sorovLimit.upsert({
          where: { kalit },
          create: { kalit, soni: 1, oynaBoshi: hozir },
          update: { soni: { increment: 1 }, oynaBoshi: hozir },
        });
        return true;
      }, { isolationLevel: "Serializable" });
    } catch (error) {
      if (error?.code === "P2034" && urinish < 2) continue;
      throw error;
    }
  }
}

function huquqlarniAjrat(huquq) {
  return {
    korish: Boolean(huquq.aiKorish),
    sinash: Boolean(huquq.aiSinash),
    sozlash: Boolean(huquq.aiSozlash),
    favqulodda: Boolean(huquq.aiFavqulodda),
  };
}

export async function GET(request) {
  const auth = await checkAdminAuth("aiKorish");
  if (!auth.isAdmin) return radEtildi("JDA Kimyo AI boshqaruvini ko'rish huquqi yo'q.");

  try {
    const soat = Number(new URL(request.url).searchParams.get("soat")) || 24;
    const [faol, versiyalar, dashboard, oxirgiSinovlar] = await Promise.all([
      aiSozlamaniOl({ fresh: true }),
      aiSozlamaVersiyalariniOl(15),
      aiDashboardMalumotiOl({ soat }),
      prisma.aiEvalRun.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: { id: true, revision: true, totalCases: true, passed: true, failed: true, durationMs: true, createdAt: true },
      }),
    ]);
    const ogohlantirishlar = [];
    if (dashboard.xatoFoizi >= faol.config.alerts.errorRatePercent) {
      ogohlantirishlar.push({ turi: "xato", xabar: `Xato ulushi ${dashboard.xatoFoizi}% ga yetdi.` });
    }
    if (dashboard.fallbackFoizi >= faol.config.alerts.fallbackRatePercent) {
      ogohlantirishlar.push({ turi: "fallback", xabar: `Fallback ulushi ${dashboard.fallbackFoizi}% ga yetdi.` });
    }
    const p95Chegaralar = {
      tezkor: faol.config.alerts.quickP95Ms,
      oddiy: faol.config.alerts.normalP95Ms,
      murakkab: faol.config.alerts.deepP95Ms,
    };
    for (const yonalish of dashboard.yonalishMetrikalar) {
      if (p95Chegaralar[yonalish.nom] && yonalish.p95Ms >= p95Chegaralar[yonalish.nom]) {
        ogohlantirishlar.push({ turi: "sekin", xabar: `${yonalish.nom} yo'nalishining P95 vaqti ${yonalish.p95Ms} ms.` });
      }
    }

    return NextResponse.json({
      muvaffaqiyatli: true,
      sana: new Date().toISOString(),
      huquqlar: huquqlarniAjrat(auth.huquq),
      faolSozlama: faol,
      versiyalar,
      dashboard,
      ogohlantirishlar,
      oxirgiSinovlar,
      reyestr: aiModelReyestriOl(),
      kesh: {
        ...aiKesh.statistikaOl(faol.config.cache),
        izoh: "Bu ko'rsatkich joriy server nusxasiga tegishli; umumiy natija telemetriyada ko'rinadi.",
      },
      xotira: {
        brauzer: "Qurilmadagi mahalliy xotira",
        akkaunt: "Foydalanuvchi kaliti bilan shifrlangan Vercel Blob",
        adminKorishi: false,
        xomSuhbatTelemetriyada: false,
      },
    });
  } catch (error) {
    console.error("[AI admin GET xatosi]", error);
    return NextResponse.json({ xato: "AI boshqaruv ma'lumotlarini olib bo'lmadi." }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ xato: "So'rov formati noto'g'ri." }, { status: 400 });
  }
  const action = String(body.action || "korik");
  const kerakliHuquq = action === "korik" || action === "eval" ? "aiSinash"
    : action === "favqulodda" ? "aiFavqulodda"
      : "aiSozlash";
  const auth = await checkAdminAuth(kerakliHuquq);
  if (!auth.isAdmin) return radEtildi();

  try {
    if (action === "korik") {
      await korikOrniniBandQil(auth.user.id);
      const faol = await aiSozlamaniOl();
      const testPrompt = typeof body.testPrompt === "string"
        ? body.testPrompt.trim().slice(0, 500)
        : undefined;
      const hisobot = await aiProvayderKorigi({ runtimeSozlama: faol.config, prompt: testPrompt });
      await prisma.auditLog.create({
        data: {
          adminId: auth.user.id,
          action: "ai_provider_check",
          targetType: "ai_gateway",
          details: JSON.stringify({ natijalar: hisobot.map(({ provayder, holat, sarfMs }) => ({ provayder, holat, sarfMs })) }),
        },
      });
      return NextResponse.json({ muvaffaqiyatli: true, hisobot });
    }

    if (action === "publish") {
      const tekshiruv = aiConfigXavfsizTayyorla(body.config);
      if (!tekshiruv.muvaffaqiyatli) {
        return NextResponse.json({ xato: "AI sozlamasida noto'g'ri qiymatlar bor.", xatolar: tekshiruv.xatolar }, { status: 400 });
      }
      const natija = await aiSozlamaniSaqlash({
        config: tekshiruv.config,
        adminId: auth.user.id,
        note: body.note,
        expectedRevision: body.expectedRevision,
      });
      return NextResponse.json({ muvaffaqiyatli: true, faolSozlama: natija });
    }

    if (action === "rollback") {
      const natija = await aiSozlamagaQaytish({
        revision: body.revision,
        adminId: auth.user.id,
        expectedRevision: body.expectedRevision,
      });
      return NextResponse.json({ muvaffaqiyatli: true, faolSozlama: natija });
    }

    if (action === "cache_clear") {
      const ochirilgan = aiKesh.tozalash();
      await prisma.auditLog.create({
        data: {
          adminId: auth.user.id,
          action: "ai_cache_clear",
          targetType: "ai_cache",
          details: JSON.stringify({ ochirilgan, serverNusxasi: true }),
        },
      });
      return NextResponse.json({ muvaffaqiyatli: true, ochirilgan });
    }

    if (action === "eval") {
      const faol = await aiSozlamaniOl();
      const natija = await aiSifatSinoviniIshgaTushir({ adminId: auth.user.id, revision: faol.revision });
      return NextResponse.json({ muvaffaqiyatli: true, natija });
    }

    if (action === "favqulodda") {
      if (typeof body.enabled !== "boolean") {
        return NextResponse.json({ xato: "AI holati true yoki false bo'lishi kerak." }, { status: 400 });
      }
      const faol = await aiSozlamaniOl({ fresh: true });
      const enabled = body.enabled;
      const natija = await aiSozlamaniSaqlash({
        config: { ...faol.config, enabled },
        adminId: auth.user.id,
        expectedRevision: faol.revision,
        note: enabled ? "AI favqulodda rejimdan chiqarildi" : "AI favqulodda to'xtatildi",
      });
      return NextResponse.json({ muvaffaqiyatli: true, faolSozlama: natija });
    }

    return NextResponse.json({ xato: "Noma'lum amal." }, { status: 400 });
  } catch (error) {
    console.error("[AI admin POST xatosi]", error);
    const status = [400, 404, 409, 429].includes(error?.statusCode) ? error.statusCode : 500;
    return NextResponse.json({ xato: status === 500 ? "AI boshqaruv amalini bajarib bo'lmadi." : error.message }, { status });
  }
}
