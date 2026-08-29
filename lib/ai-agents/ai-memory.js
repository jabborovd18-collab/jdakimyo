// lib/ai-agents/ai-memory.js
//
// JDA KIMYO AI — SHAXSIY O'QUVCHI XOTIRASI VA DINAMIK SIQISH (Memory 2.0 Enterprise)
// Talabaning bilim darajasini, kuchli/zaif mavzularini va muloqot kontekstini eslab qoladi.

const MAX_XABARLAR = 8;
const XOTIRA_TTL_MS = 24 * 60 * 60 * 1000; // 24 soat

class AiMemoryManager {
  constructor() {
    this.foydalanuvchilar = new Map(); // userId -> { profil, tarix, xulosa, yangilanganVaqt }
  }

  _profilYarat(foydalanuvchiIsmi = "Talaba") {
    return {
      ism: foydalanuvchiIsmi,
      daraja: "Abituriyent / Talaba",
      kuchliMavzular: new Set(),
      zaifMavzular: new Set(),
      jamiMasalalar: 0,
      oxirgiMavzu: null,
    };
  }

  /**
   * Foydalanuvchi yozuvini olish
   */
  _yozuvOl(foydalanuvchiId, foydalanuvchiIsmi = "Talaba") {
    if (!foydalanuvchiId) return null;

    let yozuv = this.foydalanuvchilar.get(foydalanuvchiId);
    if (!yozuv || Date.now() - yozuv.yangilanganVaqt > XOTIRA_TTL_MS) {
      yozuv = {
        profil: this._profilYarat(foydalanuvchiIsmi),
        tarix: [],
        xulosa: "",
        yangilanganVaqt: Date.now(),
      };
      this.foydalanuvchilar.set(foydalanuvchiId, yozuv);
    }
    return yozuv;
  }

  /**
   * Yangi xabar qo'shish va mavzuni tahlil qilish
   */
  xabarQosh(foydalanuvchiId, { rol = "user", matn = "", mavzu = null, muvaffaqiyatli = true, foydalanuvchiIsmi = "Talaba" }) {
    if (!foydalanuvchiId || !matn) return;

    const yozuv = this._yozuvOl(foydalanuvchiId, foydalanuvchiIsmi);
    if (!yozuv) return;

    yozuv.yangilanganVaqt = Date.now();
    yozuv.tarix.push({ rol, matn, vaqt: Date.now() });

    // Talabaning o'quv profilini boyitish
    if (mavzu && mavzu !== "suhbat" && mavzu !== "umumiy") {
      yozuv.profil.oxirgiMavzu = mavzu;
      yozuv.profil.jamiMasalalar += 1;
      if (muvaffaqiyatli) {
        yozuv.profil.kuchliMavzular.add(mavzu);
      } else {
        yozuv.profil.zaifMavzular.add(mavzu);
      }
    }

    // Xotira sig'imi oshganda dastlabki xabarlarni ixcham xulosaga aylantirish (Smart Compression)
    if (yozuv.tarix.length > MAX_XABARLAR) {
      const eskiXabarlar = yozuv.tarix.slice(0, yozuv.tarix.length - 4);
      const yangiTarix = yozuv.tarix.slice(yozuv.tarix.length - 4);
      
      const yangiXulosa = eskiXabarlar
        .map((x) => `${x.rol === "user" ? "Savol" : "Javob"}: ${x.matn.slice(0, 80)}...`)
        .join(" | ");

      yozuv.xulosa = yozuv.xulosa ? `${yozuv.xulosa} => ${yangiXulosa}` : yangiXulosa;
      yozuv.tarix = yangiTarix;
    }
  }

  /**
   * AI System Prompt uchun tayyor boyitilgan kontekst matnini tuzish
   */
  kontekstPromptiTuz(foydalanuvchiId, foydalanuvchiIsmi = "Talaba") {
    if (!foydalanuvchiId) return "";

    const yozuv = this._yozuvOl(foydalanuvchiId, foydalanuvchiIsmi);
    if (!yozuv) return "";

    const { profil, tarix, xulosa } = yozuv;
    if (tarix.length === 0 && !xulosa) return "";

    let prompt = `\n\n[TALABA BILISH PROFILI VA SHAXSIY KONTEKSTI]:\n`;
    prompt += `- Talaba ismi: ${profil.ism || foydalanuvchiIsmi}\n`;
    if (profil.oxirgiMavzu) prompt += `- Oxirgi ko'rib chiqilgan mavzu: ${profil.oxirgiMavzu}\n`;
    if (profil.kuchliMavzular.size > 0) prompt += `- Faol o'zlashtirgan mavzulari: ${Array.from(profil.kuchliMavzular).join(", ")}\n`;
    if (profil.zaifMavzular.size > 0) prompt += `- Qo'shimcha e'tibor talab mavzulari: ${Array.from(profil.zaifMavzular).join(", ")}\n`;

    if (xulosa) {
      prompt += `\n[OLDINGI SUHBATNING IXCHAM MAZMUNI]:\n${xulosa.slice(0, 400)}\n`;
    }

    if (tarix.length > 0) {
      prompt += `\n[OXIRGI XABARLAR ALMASHINUVI]:\n` +
        tarix.map((m) => `${m.rol === "user" ? "Talaba" : "Siz"}: ${m.matn}`).join("\n");
    }

    return prompt;
  }

  /**
   * Xotirani tozalash (Yangi chat bosilganda)
   */
  tozalash(foydalanuvchiId) {
    if (foydalanuvchiId && this.foydalanuvchilar.has(foydalanuvchiId)) {
      const yozuv = this.foydalanuvchilar.get(foydalanuvchiId);
      yozuv.tarix = [];
      yozuv.xulosa = "";
    }
  }
}

export const aiXotira = global.__jdaAiMemory || new AiMemoryManager();
if (process.env.NODE_ENV !== "production") global.__jdaAiMemory = aiXotira;
