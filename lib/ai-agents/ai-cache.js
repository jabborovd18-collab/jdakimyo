// lib/ai-agents/ai-cache.js
//
// JDA KIMYO AI — AQLLI SEMANTIK VA MATNLI KESH TIZIMI (v1.0.0)
// Takroriy kimyoviy masalalar va savollarni 10ms da tekinga qaytaradi, API byudjetini tejaydi.

import crypto from "crypto";

const KESH_MAX_HAJMI = 2000; // Xotiradagi maksimal yechimlar soni
const KESH_TTL_MS = 24 * 60 * 60 * 1000; // 24 soat saqlash muddati

class AiKeshManager {
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
  kalitYarat({ matn = "", rasm = null, rejim = "toliq" }) {
    if (rasm && typeof rasm === "string") {
      // Rasm uchun sha256 xesh
      const rasmHash = crypto.createHash("sha256").update(rasm.slice(0, 10000)).digest("hex");
      return `img:${rejim}:${rasmHash}`;
    }

    // Matnni normalizatsiya qilish (ortiqcha bo'shliqlar, kichik harf, probellar)
    const tozaMatn = matn
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[?!.,;:]+$/g, "")
      .trim();

    const matnHash = crypto.createHash("sha256").update(tozaMatn).digest("hex").slice(0, 32);
    return `txt:${rejim}:${matnHash}`;
  }

  /**
   * Keshdan yechimni qidirish
   */
  olish(kalit) {
    this.statistika.jamiSoqovlar++;

    if (!this.kesh.has(kalit)) {
      this.statistika.keshdaTopilmadi++;
      return null;
    }

    const yozuv = this.kesh.get(kalit);
    const hozir = Date.now();

    // TTL muddati o'tgan bo'lsa
    if (hozir - yozuv.yaratilganVaqt > KESH_TTL_MS) {
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
  saqlash(kalit, qiymat, taxminiyTokenlar = 1500) {
    if (!kalit || !qiymat) return;

    // Hajm chegarasidan oshsa eng eski yozuvni o'chirish (LRU)
    if (this.kesh.size >= KESH_MAX_HAJMI) {
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
  statistikaOl() {
    const hitRate =
      this.statistika.jamiSoqovlar > 0
        ? ((this.statistika.keshdanTopildi / this.statistika.jamiSoqovlar) * 100).toFixed(1)
        : 0;

    return {
      hajm: this.kesh.size,
      maxHajm: KESH_MAX_HAJMI,
      ...this.statistika,
      samaradorlikFoizi: `${hitRate}%`,
    };
  }

  /**
   * Keshni tozalash
   */
  tozalash() {
    this.kesh.clear();
  }
}

// Global yagona singleton instansiya
export const aiKesh = global.__jdaAiKesh || new AiKeshManager();
if (process.env.NODE_ENV !== "production") global.__jdaAiKesh = aiKesh;
