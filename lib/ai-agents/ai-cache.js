// lib/ai-agents/ai-cache.js
//
// JDA KIMYO AI — AQLLI SEMANTIK VA MATNLI KESH TIZIMI (v1.0.0)
// Takroriy kimyoviy masalalar va savollarni 10ms da tekinga qaytaradi, API byudjetini tejaydi.

import crypto from "crypto";

const KESH_MAX_HAJMI = 2000; // Sozlama bazada bo'lmasa ishlaydigan xavfsiz qiymat
const KESH_TTL_MS = 24 * 60 * 60 * 1000;

export class AiKeshManager {
  constructor() {
    this.kesh = new Map();
    this.statistika = {
      jamiSoqovlar: 0,
      keshdanTopildi: 0,
      keshdaTopilmadi: 0,
      tejalganTokenlar: 0,
    };
  }

  /**
   * Masala matni yoki rasmdan unikal va barqaror kalit yaratish
   */
  kalitYarat({
    matn = "",
    rasm = null,
    rejim = "toliq",
    foydalanuvchiId = "mehmon",
    ishlashYonalishi = "oddiy",
    xotiraKonteksti = null,
    configVersion = 1,
  }) {
    // Javobda ism va shaxsiy xotira qatnashadi. Shuning uchun bir xil savol
    // ikki hisob orasida umumiy kesh bo'la olmaydi.
    const hisobHash = crypto
      .createHash("sha256")
      .update(String(foydalanuvchiId || "mehmon"))
      .digest("hex")
      .slice(0, 16);

    // Matnni normalizatsiya qilish (ortiqcha bo'shliqlar, kichik harf, probellar)
    const tozaMatn = matn
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[?!.,;:]+$/g, "")
      .trim();
    const xotiraHash = xotiraKonteksti
      ? crypto.createHash("sha256").update(JSON.stringify(xotiraKonteksti)).digest("hex").slice(0, 12)
      : "xotirasiz";

    if (rasm && typeof rasm === "string") {
      // Butun rasm xeshlanadi. Avval faqat dastlabki 10 000 belgi olinardi:
      // bir xil data-URL boshi bor ikki boshqa rasm bitta kalitga tushardi.
      // Ko'rsatma ham kalitda, chunki bir rasmni turli savol bilan yuborish mumkin.
      const rasmHash = crypto
        .createHash("sha256")
        .update(rasm)
        .update("\0")
        .update(tozaMatn)
        .digest("hex");
      return `img:v${configVersion}:${hisobHash}:${rejim}:${ishlashYonalishi}:${xotiraHash}:${rasmHash}`;
    }

    const matnHash = crypto.createHash("sha256").update(tozaMatn).digest("hex").slice(0, 32);
    return `txt:v${configVersion}:${hisobHash}:${rejim}:${ishlashYonalishi}:${xotiraHash}:${matnHash}`;
  }

  /**
   * Keshdan yechimni qidirish
   */
  olish(kalit, { enabled = true, ttlMs = KESH_TTL_MS } = {}) {
    if (!enabled) return null;
    this.statistika.jamiSoqovlar++;

    if (!this.kesh.has(kalit)) {
      this.statistika.keshdaTopilmadi++;
      return null;
    }

    const yozuv = this.kesh.get(kalit);
    const hozir = Date.now();

    // TTL muddati o'tgan bo'lsa
    if (hozir - yozuv.yaratilganVaqt > ttlMs) {
      this.kesh.delete(kalit);
      this.statistika.keshdaTopilmadi++;
      return null;
    }

    // LRU yangilash
    this.kesh.delete(kalit);
    this.kesh.set(kalit, yozuv);

    this.statistika.keshdanTopildi++;
    this.statistika.tejalganTokenlar += yozuv.taxminiyTokenlar || 1500;

    return {
      ...yozuv.qiymat,
      _keshdan: true,
      _keshVaqti: yozuv.yaratilganVaqt,
    };
  }

  /**
   * Keshga yangi yechimni yozish
   */
  saqlash(kalit, qiymat, taxminiyTokenlar = 1500, { enabled = true, maxItems = KESH_MAX_HAJMI } = {}) {
    if (!enabled || !kalit || !qiymat) return;

    // Hajm chegarasidan oshsa eng eski yozuvni o'chirish (LRU)
    const xavfsizHajm = Math.max(1, Number(maxItems) || KESH_MAX_HAJMI);
    if (this.kesh.size >= xavfsizHajm) {
      const engEskiKalit = this.kesh.keys().next().value;
      this.kesh.delete(engEskiKalit);
    }

    this.kesh.set(kalit, {
      qiymat,
      yaratilganVaqt: Date.now(),
      taxminiyTokenlar,
    });
  }

  /**
   * Kesh statistikasini olish (Admin ko'rigi uchun)
   */
  statistikaOl({ maxItems = KESH_MAX_HAJMI } = {}) {
    const hitRate =
      this.statistika.jamiSoqovlar > 0
        ? ((this.statistika.keshdanTopildi / this.statistika.jamiSoqovlar) * 100).toFixed(1)
        : 0;

    return {
      hajm: this.kesh.size,
      maxHajm: maxItems,
      ...this.statistika,
      samaradorlikFoizi: `${hitRate}%`,
    };
  }

  /**
   * Keshni tozalash
   */
  tozalash() {
    const ochirilgan = this.kesh.size;
    this.kesh.clear();
    return ochirilgan;
  }
}

// Global yagona singleton instansiya
export const aiKesh = global.__jdaAiKesh || new AiKeshManager();
if (process.env.NODE_ENV !== "production") global.__jdaAiKesh = aiKesh;
