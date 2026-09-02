// AI telemetriya faqat texnik o'lchovlarni saqlaydi. Prompt, javob, ism,
// foydalanuvchi IDsi va rasm bu qatlamga kiritilmaydi.

import { prisma } from "../prisma";

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

function percentil(sonlar, foiz) {
  if (sonlar.length === 0) return 0;
  const tartiblangan = [...sonlar].sort((a, b) => a - b);
  return tartiblangan[Math.min(tartiblangan.length - 1, Math.ceil(tartiblangan.length * foiz) - 1)];
}

function guruhla(yozuvlar, maydon) {
  const natija = {};
  for (const yozuv of yozuvlar) {
    const kalit = yozuv[maydon] || "noma'lum";
    natija[kalit] = (natija[kalit] || 0) + 1;
  }
  return Object.entries(natija)
    .map(([nom, soni]) => ({ nom, soni }))
    .sort((a, b) => b.soni - a.soni);
}

function yonalishMetrikalariniTuz(yozuvlar) {
  const guruhlar = new Map();
  for (const yozuv of yozuvlar) {
    const nom = yozuv.direction || "noma'lum";
    const guruh = guruhlar.get(nom) || { nom, jami: 0, xato: 0, vaqtlar: [] };
    guruh.jami += 1;
    if (yozuv.status === "success") {
      if (yozuv.durationMs > 0) guruh.vaqtlar.push(yozuv.durationMs);
    } else {
      guruh.xato += 1;
    }
    guruhlar.set(nom, guruh);
  }
  return [...guruhlar.values()].map((guruh) => ({
    nom: guruh.nom,
    jami: guruh.jami,
    xatoFoizi: guruh.jami ? Number(((guruh.xato / guruh.jami) * 100).toFixed(1)) : 0,
    p95Ms: percentil(guruh.vaqtlar, 0.95),
  }));
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

  const muvaffaqiyatli = yozuvlar.filter((yozuv) => yozuv.status === "success");
  const xatoSoni = yozuvlar.length - muvaffaqiyatli.length;
  const vaqtlar = muvaffaqiyatli.map((yozuv) => yozuv.durationMs).filter((son) => son > 0);
  const fallbackSoni = yozuvlar.filter((yozuv) => Number(yozuv.fallbackIndex) > 0).length;

  const soatlik = new Map();
  for (const yozuv of yozuvlar) {
    const sana = new Date(yozuv.createdAt);
    sana.setMinutes(0, 0, 0);
    const kalit = sana.toISOString();
    const nuqta = soatlik.get(kalit) || { vaqt: kalit, jami: 0, xato: 0 };
    nuqta.jami += 1;
    if (yozuv.status !== "success") nuqta.xato += 1;
    soatlik.set(kalit, nuqta);
  }

  return {
    davrSoat: xavfsizSoat,
    jami,
    namunaSoni: yozuvlar.length,
    muvaffaqiyatFoizi: yozuvlar.length ? Number(((muvaffaqiyatli.length / yozuvlar.length) * 100).toFixed(1)) : 100,
    xatoFoizi: yozuvlar.length ? Number(((xatoSoni / yozuvlar.length) * 100).toFixed(1)) : 0,
    fallbackFoizi: yozuvlar.length ? Number(((fallbackSoni / yozuvlar.length) * 100).toFixed(1)) : 0,
    p50Ms: percentil(vaqtlar, 0.5),
    p95Ms: percentil(vaqtlar, 0.95),
    keshdan: yozuvlar.filter((yozuv) => yozuv.cacheHit).length,
    deterministik: yozuvlar.filter((yozuv) => yozuv.deterministicUsed).length,
    tokenlar: {
      kirish: tokenlar._sum.inputTokens || 0,
      chiqish: tokenlar._sum.outputTokens || 0,
      jami: tokenlar._sum.totalTokens || 0,
    },
    provayderlar: guruhla(yozuvlar, "provider"),
    kanallar: guruhla(yozuvlar, "channel"),
    yonalishlar: guruhla(yozuvlar, "direction"),
    yonalishMetrikalar: yonalishMetrikalariniTuz(yozuvlar),
    soatlik: [...soatlik.values()].sort((a, b) => a.vaqt.localeCompare(b.vaqt)),
    oxirgiXatolar: xatolar,
  };
}
