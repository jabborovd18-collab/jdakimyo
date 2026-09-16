// AI telemetriya faqat texnik o'lchovlarni saqlaydi. Prompt, javob, ism,
// foydalanuvchi IDsi va rasm bu qatlamga kiritilmaydi.

import { prisma } from "../prisma";
import { aiSorovlariniYig, guruhla, percentil, yonalishMetrikalariniTuz } from "./ai-telemetriya-core.js";

const MATN_CHEGARALARI = Object.freeze({
  requestId: 80,
  channel: 24,
  operation: 40,
  direction: 24,
  problemType: 40,
  provider: 30,
  model: 120,
  status: 30,
  errorCode: 80,
});

function xavfsizMatn(nom, qiymat) {
  if (qiymat === null || qiymat === undefined || qiymat === "") return null;
  return String(qiymat).replace(/[^a-zA-Z0-9_./:+-]/g, "_").slice(0, MATN_CHEGARALARI[nom]);
}

function xavfsizSon(qiymat, max = 2_000_000_000) {
  const son = Number(qiymat);
  if (!Number.isFinite(son)) return 0;
  return Math.max(0, Math.min(max, Math.round(son)));
}

export function aiHodisaniTayyorla(hodisa = {}) {
  const requestId = xavfsizMatn("requestId", hodisa.requestId);
  const channel = xavfsizMatn("channel", hodisa.channel);
  const operation = xavfsizMatn("operation", hodisa.operation);
  const status = xavfsizMatn("status", hodisa.status);
  if (!requestId || !channel || !operation || !status) return null;

  return {
    requestId,
    channel,
    operation,
    direction: xavfsizMatn("direction", hodisa.direction),
    problemType: xavfsizMatn("problemType", hodisa.problemType),
    provider: xavfsizMatn("provider", hodisa.provider),
    model: xavfsizMatn("model", hodisa.model),
    status,
    errorCode: xavfsizMatn("errorCode", hodisa.errorCode),
    durationMs: xavfsizSon(hodisa.durationMs),
    inputTokens: xavfsizSon(hodisa.inputTokens, 10_000_000),
    outputTokens: xavfsizSon(hodisa.outputTokens, 10_000_000),
    totalTokens: xavfsizSon(hodisa.totalTokens, 20_000_000),
    cacheHit: Boolean(hodisa.cacheHit),
    deterministicUsed: Boolean(hodisa.deterministicUsed),
    fallbackIndex: hodisa.fallbackIndex === null || hodisa.fallbackIndex === undefined
      ? null
      : xavfsizSon(hodisa.fallbackIndex, 20),
  };
}

export async function aiHodisalarniYoz(hodisalar = []) {
  const tozaHodisalar = hodisalar.map(aiHodisaniTayyorla).filter(Boolean).slice(0, 20);
  if (tozaHodisalar.length === 0) return { count: 0 };
  return prisma.aiUsageEvent.createMany({ data: tozaHodisalar });
}

export async function aiDashboardMalumotiOl({ soat = 24 } = {}) {
  const xavfsizSoat = Math.max(1, Math.min(24 * 30, Number(soat) || 24));
  const boshi = new Date(Date.now() - xavfsizSoat * 60 * 60 * 1000);
  const where = { createdAt: { gte: boshi } };
  const [jami, yozuvlar, xatolar, tokenlar] = await Promise.all([
    prisma.aiUsageEvent.count({ where }),
    prisma.aiUsageEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 5_000,
      select: {
        requestId: true,
        provider: true,
        model: true,
        channel: true,
        direction: true,
        status: true,
        durationMs: true,
        fallbackIndex: true,
        cacheHit: true,
        deterministicUsed: true,
        createdAt: true,
      },
    }),
    prisma.aiUsageEvent.findMany({
      where: { ...where, status: { not: "success" } },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { provider: true, model: true, errorCode: true, status: true, durationMs: true, createdAt: true },
    }),
    prisma.aiUsageEvent.aggregate({
      where,
      _sum: { inputTokens: true, outputTokens: true, totalTokens: true },
    }),
  ]);

  const sorovlar = aiSorovlariniYig(yozuvlar);
  const muvaffaqiyatli = sorovlar.filter((sorov) => sorov.status === "success");
  const xatoSoni = sorovlar.length - muvaffaqiyatli.length;
  const vaqtlar = muvaffaqiyatli.map((sorov) => sorov.durationMs).filter((son) => son > 0);
  const fallbackSoni = sorovlar.filter((sorov) => sorov.fallbackUsed).length;

  const soatlik = new Map();
  for (const sorov of sorovlar) {
    const sana = new Date(sorov.createdAt);
    sana.setMinutes(0, 0, 0);
    const kalit = sana.toISOString();
    const nuqta = soatlik.get(kalit) || { vaqt: kalit, jami: 0, xato: 0 };
    nuqta.jami += 1;
    if (sorov.status !== "success") nuqta.xato += 1;
    soatlik.set(kalit, nuqta);
  }

  return {
    davrSoat: xavfsizSoat,
    jami: sorovlar.length,
    jamiSorov: sorovlar.length,
    jamiUrinish: jami,
    namunaSoni: yozuvlar.length,
    namunaCheklangan: jami > yozuvlar.length,
    muvaffaqiyatFoizi: sorovlar.length ? Number(((muvaffaqiyatli.length / sorovlar.length) * 100).toFixed(1)) : 100,
    xatoFoizi: sorovlar.length ? Number(((xatoSoni / sorovlar.length) * 100).toFixed(1)) : 0,
    fallbackFoizi: sorovlar.length ? Number(((fallbackSoni / sorovlar.length) * 100).toFixed(1)) : 0,
    p50Ms: percentil(vaqtlar, 0.5),
    p95Ms: percentil(vaqtlar, 0.95),
    keshdan: sorovlar.filter((sorov) => sorov.cacheHit).length,
    deterministik: sorovlar.filter((sorov) => sorov.deterministicUsed).length,
    tokenlar: {
      kirish: tokenlar._sum.inputTokens || 0,
      chiqish: tokenlar._sum.outputTokens || 0,
      jami: tokenlar._sum.totalTokens || 0,
    },
    provayderlar: guruhla(yozuvlar, "provider"),
    kanallar: guruhla(sorovlar, "channel"),
    yonalishlar: guruhla(sorovlar, "direction"),
    yonalishMetrikalar: yonalishMetrikalariniTuz(sorovlar),
    soatlik: [...soatlik.values()].sort((a, b) => a.vaqt.localeCompare(b.vaqt)),
    oxirgiXatolar: xatolar,
  };
}
