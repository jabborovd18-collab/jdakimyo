// JDA Kimyo AI runtime siyosatining yagona server manbai.
// API kalitlari ataylab bu modulga kirmaydi: ular faqat muhit sirlarida qoladi.

import { z } from "zod";
import { prisma } from "../prisma";

export const AI_NOMZOD_KALITLARI = Object.freeze([
  "deepseekMurakkab",
  "deepseekZaxira",
  "groqTezkor",
  "groqAsosiy",
  "geminiAsosiy",
  "geminiZaxira",
  "openrouterMatn",
  "openrouterRasm",
]);

export const AI_DEFAULT_CONFIG = Object.freeze({
  enabled: true,
  channels: Object.freeze({
    sayt: true,
    telegram: true,
    ovoz: true,
    pdf: true,
  }),
  routing: Object.freeze({
    tezkor: Object.freeze(["groqTezkor", "geminiAsosiy"]),
    oddiy: Object.freeze(["groqAsosiy", "geminiAsosiy"]),
    murakkab: Object.freeze(["deepseekMurakkab", "groqAsosiy"]),
    rasm: Object.freeze(["geminiAsosiy", "openrouterRasm"]),
  }),
  directions: Object.freeze({
    tezkor: Object.freeze({ urinishChegarasi: 2, urinishVaqtiMs: 8_000, umumiyVaqtMs: 14_000, tokenChegarasi: 800 }),
    oddiy: Object.freeze({ urinishChegarasi: 2, urinishVaqtiMs: 16_000, umumiyVaqtMs: 30_000, tokenChegarasi: 2_500 }),
    murakkab: Object.freeze({ urinishChegarasi: 2, urinishVaqtiMs: 26_000, umumiyVaqtMs: 48_000, tokenChegarasi: 4_000 }),
  }),
  quotas: Object.freeze({
    bakalavr: 25,
    magistr: 25,
    mustaqil: 25,
    doktorant: 60,
    professor: 60,
    teacher: 1_000,
    moderator: 25,
    hamkor: 25,
    admin: 99_999,
    superadmin: 99_999,
  }),
  cache: Object.freeze({
    enabled: true,
    ttlMs: 24 * 60 * 60 * 1000,
    maxItems: 2_000,
    version: 1,
  }),
  quality: Object.freeze({
    deterministicCheck: true,
    formulaNormalization: true,
  }),
  alerts: Object.freeze({
    errorRatePercent: 5,
    fallbackRatePercent: 30,
    quickP95Ms: 10_000,
    normalP95Ms: 25_000,
    deepP95Ms: 45_000,
  }),
});

const nomzodSxemasi = z.enum(AI_NOMZOD_KALITLARI);
const yolSxemasi = z.array(nomzodSxemasi).min(1).max(6)
  .refine((qiymatlar) => new Set(qiymatlar).size === qiymatlar.length, "Routing ichida takroriy model bor");
const yonalishSxemasi = z.object({
  urinishChegarasi: z.number().int().min(1).max(4),
  urinishVaqtiMs: z.number().int().min(2_000).max(60_000),
  umumiyVaqtMs: z.number().int().min(4_000).max(120_000),
  tokenChegarasi: z.number().int().min(200).max(12_000),
}).refine(
  (qiymat) => qiymat.umumiyVaqtMs >= qiymat.urinishVaqtiMs,
  "Umumiy vaqt bitta urinish vaqtidan kichik bo'lmasligi kerak",
);
const musbatLimit = z.number().int().min(1).max(1_000_000);

export const AI_CONFIG_SXEMASI = z.object({
  enabled: z.boolean(),
  channels: z.object({
    sayt: z.boolean(),
    telegram: z.boolean(),
    ovoz: z.boolean(),
    pdf: z.boolean(),
  }),
  routing: z.object({
    tezkor: yolSxemasi,
    oddiy: yolSxemasi,
    murakkab: yolSxemasi,
    rasm: yolSxemasi,
  }),
  directions: z.object({
    tezkor: yonalishSxemasi,
    oddiy: yonalishSxemasi,
    murakkab: yonalishSxemasi,
  }),
  quotas: z.object({
    bakalavr: musbatLimit,
    magistr: musbatLimit,
    mustaqil: musbatLimit,
    doktorant: musbatLimit,
    professor: musbatLimit,
    teacher: musbatLimit,
    moderator: musbatLimit,
    hamkor: musbatLimit,
    admin: musbatLimit,
    superadmin: musbatLimit,
  }),
  cache: z.object({
    enabled: z.boolean(),
    ttlMs: z.number().int().min(60_000).max(7 * 24 * 60 * 60 * 1000),
    maxItems: z.number().int().min(50).max(20_000),
    version: z.number().int().min(1).max(1_000_000),
  }),
  quality: z.object({
    deterministicCheck: z.boolean(),
    formulaNormalization: z.boolean(),
  }),
  alerts: z.object({
    errorRatePercent: z.number().min(1).max(100),
    fallbackRatePercent: z.number().min(1).max(100),
    quickP95Ms: z.number().int().min(1_000).max(120_000),
    normalP95Ms: z.number().int().min(1_000).max(120_000),
    deepP95Ms: z.number().int().min(1_000).max(120_000),
  }),
});

let runtimeKesh = null;
const RUNTIME_KESH_MS = 30_000;

function nusxa(qiymat) {
  return JSON.parse(JSON.stringify(qiymat));
}

function birlashtir(xom = {}) {
  return {
    ...nusxa(AI_DEFAULT_CONFIG),
    ...xom,
    channels: { ...AI_DEFAULT_CONFIG.channels, ...(xom.channels || {}) },
    routing: { ...AI_DEFAULT_CONFIG.routing, ...(xom.routing || {}) },
    directions: {
      tezkor: { ...AI_DEFAULT_CONFIG.directions.tezkor, ...(xom.directions?.tezkor || {}) },
      oddiy: { ...AI_DEFAULT_CONFIG.directions.oddiy, ...(xom.directions?.oddiy || {}) },
      murakkab: { ...AI_DEFAULT_CONFIG.directions.murakkab, ...(xom.directions?.murakkab || {}) },
    },
    quotas: { ...AI_DEFAULT_CONFIG.quotas, ...(xom.quotas || {}) },
    cache: { ...AI_DEFAULT_CONFIG.cache, ...(xom.cache || {}) },
    quality: { ...AI_DEFAULT_CONFIG.quality, ...(xom.quality || {}) },
    alerts: { ...AI_DEFAULT_CONFIG.alerts, ...(xom.alerts || {}) },
  };
}

export function aiConfigTayyorla(xom = {}) {
  return AI_CONFIG_SXEMASI.parse(birlashtir(xom));
}

export function aiConfigXavfsizTayyorla(xom = {}) {
  const natija = AI_CONFIG_SXEMASI.safeParse(birlashtir(xom));
  return natija.success
    ? { muvaffaqiyatli: true, config: natija.data, xatolar: [] }
    : {
        muvaffaqiyatli: false,
        config: null,
        xatolar: natija.error.issues.map((xato) => ({
          yol: xato.path.join("."),
          xabar: xato.message,
        })),
      };
}

export function aiSozlamaKeshiniTozala() {
  runtimeKesh = null;
}

export async function aiSozlamaniOl({ fresh = false } = {}) {
  if (!fresh && runtimeKesh && Date.now() - runtimeKesh.vaqt < RUNTIME_KESH_MS) {
    return runtimeKesh.qiymat;
  }

  try {
    const yozuv = await prisma.aiSettings.findUnique({ where: { id: "main" } });
    const qiymat = yozuv
      ? { revision: yozuv.revision, config: aiConfigTayyorla(yozuv.config), source: "database", updatedAt: yozuv.updatedAt }
      : { revision: 0, config: aiConfigTayyorla(), source: "default", updatedAt: null };
    runtimeKesh = { vaqt: Date.now(), qiymat };
    return qiymat;
  } catch (error) {
    console.error("[AI sozlama] Faol sozlamani o'qib bo'lmadi:", error.message);
    return { revision: 0, config: aiConfigTayyorla(), source: "fallback", updatedAt: null };
  }
}

export async function aiSozlamaniSaqlash({ config, adminId, note = "", expectedRevision = null }) {
  const tozaConfig = aiConfigTayyorla(config);
  let natija = null;
  for (let urinish = 0; urinish < 3; urinish += 1) {
    try {
      natija = await prisma.$transaction(async (tx) => {
        const mavjud = await tx.aiSettings.findUnique({ where: { id: "main" } });
        const joriyRevision = mavjud?.revision || 0;
        if (expectedRevision !== null && Number(expectedRevision) !== joriyRevision) {
          const xato = new Error("AI sozlamasi boshqa admin tomonidan yangilangan. Sahifani qayta yuklang.");
          xato.statusCode = 409;
          throw xato;
        }

        const revision = joriyRevision + 1;
        const sozlama = await tx.aiSettings.upsert({
          where: { id: "main" },
          create: { id: "main", revision, config: tozaConfig, updatedById: adminId || null },
          update: { revision, config: tozaConfig, updatedById: adminId || null },
        });
        await tx.aiConfigVersion.create({
          data: {
            revision,
            config: tozaConfig,
            note: String(note || "").trim().slice(0, 500) || null,
            adminId: adminId || null,
          },
        });
        if (adminId) {
          await tx.auditLog.create({
            data: {
              adminId,
              action: "ai_config_publish",
              targetType: "ai_settings",
              targetId: String(revision),
              details: JSON.stringify({ revision, note: String(note || "").trim().slice(0, 200) }),
            },
          });
        }
        return sozlama;
      }, { isolationLevel: "Serializable" });
      break;
    } catch (error) {
      if (error?.code === "P2034" && urinish < 2) continue;
      throw error;
    }
  }

  aiSozlamaKeshiniTozala();
  return { revision: natija.revision, config: aiConfigTayyorla(natija.config), updatedAt: natija.updatedAt };
}

export async function aiSozlamaVersiyalariniOl(limit = 15) {
  return prisma.aiConfigVersion.findMany({
    orderBy: { revision: "desc" },
    take: Math.max(1, Math.min(50, Number(limit) || 15)),
    select: { id: true, revision: true, note: true, adminId: true, createdAt: true },
  });
}

export async function aiSozlamagaQaytish({ revision, adminId, expectedRevision }) {
  const revisionRaqami = Number(revision);
  if (!Number.isInteger(revisionRaqami) || revisionRaqami < 1) {
    const xato = new Error("AI sozlama versiyasi noto'g'ri.");
    xato.statusCode = 400;
    throw xato;
  }
  const versiya = await prisma.aiConfigVersion.findUnique({ where: { revision: revisionRaqami } });
  if (!versiya) {
    const xato = new Error("Tanlangan AI sozlama versiyasi topilmadi.");
    xato.statusCode = 404;
    throw xato;
  }
  return aiSozlamaniSaqlash({
    config: versiya.config,
    adminId,
    expectedRevision,
    note: `${versiya.revision}-versiyaga qaytildi`,
  });
}
