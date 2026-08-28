// lib/ai-agents/ai-quota.js
//
// JDA KIMYO AI — USAGE, QUOTA VA BOTLARGA QARSHI HIMOYA TIZIMI (v1.0.0)
// Kunlik adolatli limitlar, anti-bot filtri va kesh orqali token tejamkorligi.

const KUNLIK_LIMITLAR = {
  USER: 25,       // Oddiy foydalanuvchi: kuniga 25 ta yangi masala
  PREMIUM: 60,    // Faol/Yulduzli talaba: kuniga 60 ta
  TEACHER: 1000,  // Ustoz: deyarli cheksiz
  SUPERADMIN: 99999, // Admin: cheksiz
  ADMIN: 99999,
};

class AiQuotaManager {
  constructor() {
    this.foydalanishJurnali = new Map(); // userId -> { sana: '2026-08-28', soni: 3 }
    this.bloklanganlar = new Set();
  }

  _bugungiSana() {
    return new Date().toISOString().slice(0, 10);
  }

  /**
   * Foydalanuvchi limitini tekshirish
   */
  tekshir(userId, userRole = "USER") {
    if (!userId) {
      return { ruxsat: false, xato: "Avtorizatsiyadan o'tmagan foydalanuvchi." };
    }

    if (this.bloklanganlar.has(userId)) {
      return { ruxsat: false, xato: "Hisobingiz shubhali faollik sababli vaqtincha cheklangan." };
    }

    const sana = this._bugungiSana();
    const maxLimit = KUNLIK_LIMITLAR[userRole] || KUNLIK_LIMITLAR.USER;

    let yozuv = this.foydalanishJurnali.get(userId);
    if (!yozuv || yozuv.sana !== sana) {
      yozuv = { sana, soni: 0 };
      this.foydalanishJurnali.set(userId, yozuv);
    }

    const qoldi = Math.max(0, maxLimit - yozuv.soni);
    const ruxsat = yozuv.soni < maxLimit;

    return {
      ruxsat,
      ishlatildi: yozuv.soni,
      jamiLimit: maxLimit,
      qoldi,
      foiz: Math.min(100, Math.round((yozuv.soni / maxLimit) * 100)),
      xato: ruxsat ? null : `Bugungi kunlik limitingiz (${maxLimit} ta) tugadi. Ertaga soat 00:00 da yangilanadi.`,
    };
  }

  /**
   * Foydalanish sonini 1 taga oshirish (faqat yangi hisoblangan masalalar uchun)
   */
  oshir(userId) {
    if (!userId) return;
    const sana = this._bugungiSana();
    let yozuv = this.foydalanishJurnali.get(userId);
    if (!yozuv || yozuv.sana !== sana) {
      yozuv = { sana, soni: 1 };
    } else {
      yozuv.soni += 1;
    }
    this.foydalanishJurnali.set(userId, yozuv);
  }

  /**
   * Foydalanuvchi statistikasini olish
   */
  malumotOl(userId, userRole = "USER") {
    return this.tekshir(userId, userRole);
  }
}

export const aiQuota = global.__jdaAiQuota || new AiQuotaManager();
if (process.env.NODE_ENV !== "production") global.__jdaAiQuota = aiQuota;
