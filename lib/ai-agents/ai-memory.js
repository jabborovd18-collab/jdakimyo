// lib/ai-agents/ai-memory.js
//
// JDA KIMYO AI — KONTEKST XOTIRASI (SESSION MEMORY MANAGER) (v1.0.0)
// Foydalanuvchi bilan muloqot va oxirgi ishlangan masalalarni eslab qoladi.

const MAX_XOTIRA_UZUNLIGI = 6; // Oxirgi 6 ta xabarlar almashinuvi
const XOTIRA_TTL_MS = 60 * 60 * 1000; // 1 soat

class AiMemoryManager {
  constructor() {
    this.xotiralar = new Map();
  }

  /**
   * Foydalanuvchi kontekstini olish
   */
  kontekstOl(foydalanuvchiId) {
    if (!foydalanuvchiId || !this.xotiralar.has(foydalanuvchiId)) {
      return [];
    }

    const yozuv = this.xotiralar.get(foydalanuvchiId);
    if (Date.now() - yozuv.yangilanganVaqt > XOTIRA_TTL_MS) {
      this.xotiralar.delete(foydalanuvchiId);
      return [];
    }

    return yozuv.tarix || [];
  }

  /**
   * Yangi xabar qo'shish
   */
  xabarQosh(foydalanuvchiId, { rol = "user", matn = "" }) {
    if (!foydalanuvchiId || !matn) return;

    const joriy = this.kontekstOl(foydalanuvchiId);
    joriy.push({ rol, matn, vaqt: Date.now() });

    if (joriy.length > MAX_XOTIRA_UZUNLIGI) {
      joriy.shift();
    }

    this.xotiralar.set(foydalanuvchiId, {
      tarix: joriy,
      yangilanganVaqt: Date.now(),
    });
  }

  /**
   * Xotirani tozalash (Yangi chat boshlanganda)
   */
  tozalash(foydalanuvchiId) {
    if (foydalanuvchiId) {
      this.xotiralar.delete(foydalanuvchiId);
    }
  }
}

export const aiXotira = global.__jdaAiMemory || new AiMemoryManager();
if (process.env.NODE_ENV !== "production") global.__jdaAiMemory = aiXotira;
