// lib/telegram-ai-handler.js
//
// JDA KIMYO AI — TELEGRAM BOT SHAXSIY VA GURUH INTEGRATSIYASI (v5.2 Enterprise)
// Mukammal Unicode kimyo formulalari, vaqtinchalik xabarlarni avtomatik o'chirish, guruh filtri.

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import {
  telegramYubor,
  telegramHujjatYubor,
  telegramRasmBase64Yukla,
  telegramOchir,
  tgHimoyala,
} from "@/lib/telegram";
import { multiAgentMasalaYech } from "@/lib/ai-agents/masala-orkestrator";
import { masalaPdfYukla } from "@/lib/masala-pdf";
import { latexliMatnniOddiylashtir } from "@/lib/latex-oddiy-matn";
import { aiHodisalarniYoz } from "@/lib/ai-agents/ai-telemetriya";
import { aiSozlamaniOl } from "@/lib/ai-agents/ai-config";
import { aiQuota } from "@/lib/ai-agents/ai-quota";

const SAYT = "https://www.jdakimyo.uz";

// Shaxsiy chatdagi faol AI sessiyalar (chatId -> boolean)
const faolAiSuhbatlar = new Set();

function telegramTelemetriyasi(operation) {
  const requestId = randomUUID();
  const hodisalar = [];
  return {
    qosh: (hodisa) => hodisalar.push({ ...hodisa, requestId, channel: "telegram", operation }),
    yoz: async () => {
      try { await aiHodisalarniYoz(hodisalar); } catch (error) {
        console.error("[Telegram AI telemetriya xatosi]", error?.message);
      }
    },
  };
}

function telegramQuotaBandlovchi(user) {
  if (!user?.id) return null;
  return async () => {
    const quota = await aiQuota.bandQil(user.id, user.role, Boolean(user.isTeacher));
    if (!quota.ruxsat) {
      const xato = new Error(quota.xato);
      xato.statusCode = 429;
      throw xato;
    }
  };
}

/**
 * Chat hozir AI rejimida ekanini tekshiradi
 */
export function aiRejimdami(chatId) {
  return faolAiSuhbatlar.has(String(chatId));
}

/**
 * Shaxsiy chatda AI rejimini boshlaydi
 */
export async function aiRejimniBoshla(chatId, ism = "Foydalanuvchi") {
  const id = String(chatId);
  faolAiSuhbatlar.add(id);

  const matn =
    `🧪 <b>Salom, ${tgHimoyala(ism)}!</b> Men <b>JDA Kimyo AI</b> repetitoriman.\n\n` +
    `Qanday kimyoviy masala yoki savollaringiz bor? Menga masala shartini matn holida yozing yoki rasmini yuboring — birgalikda bosqichma-bosqich yechamiz!\n\n` +
    `<i>Eslatma: AI rejimidan chiqish uchun pastdagi "🚪 AI rejimidan chiqish" tugmasini bosing.</i>`;

  return telegramYubor(id, matn, { aiKlaviatura: true });
}

/**
 * Shaxsiy chatda AI rejimini yakunlaydi
 */
export async function aiRejimniTugat(chatId) {
  const id = String(chatId);
  faolAiSuhbatlar.delete(id);

  const matn =
    `✅ <b>AI rejimi yakunlandi.</b>\n` +
    `Siz yana botning asosiy menyusidasiz.`;

  return telegramYubor(id, matn, { klaviatura: true });
}

/**
 * Telegram uchun maxsus boyitilgan kimyoviy formatlash (Unicode & HTML)
 */
function tgKimyoFormatla(matn) {
  if (!matn) return "";
  let s = latexliMatnniOddiylashtir(matn);

  // Telegram HTML qabul qiladi, lekin modeldan kelgan teglar ishonchli emas.
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

  // Ortiqcha bo'shliqlarni bittaga keltirish
  s = s.replace(/[ \t]{2,}/g, " ");

  return s.trim();
}

/**
 * Shaxsiy chatda kelgan AI xabarlarini qayta ishlash
 */
export async function shaxsiyAiXabariniBajar({ chatId, xabar, username, ism }) {
  const id = String(chatId);

  // 1. Foydalanuvchi bazada bormi tekshirish
  const ulanish = await prisma.telegramUlanish.findUnique({
    where: { chatId: id },
    include: { user: true },
  });

  const foydalanuvchiId = ulanish?.user?.id || null;
  const foydalanuvchiIsmi = ulanish?.user?.fullName || ism || "Talaba";

  // 2. Rasm yoki matnni ajratish
  let rasmBase64 = null;
  let masalaMatni = (xabar.text || xabar.caption || "").trim();

  if (xabar.photo && xabar.photo.length > 0) {
    const engKattaRasm = xabar.photo[xabar.photo.length - 1];
    rasmBase64 = await telegramRasmBase64Yukla(engKattaRasm.file_id);
  }

  if (!masalaMatni && !rasmBase64) {
    return telegramYubor(id, "Iltimos, masala shartini matn holida yozing yoki rasmini yuboring.", { aiKlaviatura: true });
  }

  // 3. Jarayon boshlanganini bildirish (vaqtinchalik xabar)
  const tempMsg = await telegramYubor(id, "🧠 <i>JDA Kimyo AI tahlil qilmoqda va yechmoqda...</i>", { aiKlaviatura: true });
  const olchov = telegramTelemetriyasi("yech_shaxsiy");

  try {
    const natija = await multiAgentMasalaYech({
      masalaMatni,
      rasm: rasmBase64,
      foydalanuvchiId,
      foydalanuvchiIsmi,
      rejim: "toliq",
      kanal: "telegram",
      telemetriya: olchov.qosh,
      apiChaqirishdanOldin: telegramQuotaBandlovchi(ulanish?.user),
    });

    // Vaqtinchalik "tahlil qilinmoqda..." xabarini o'chirish
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(id, tempMsg.natija.message_id);
    }

    if (!natija || !natija.muvaffaqiyatli) {
      return telegramYubor(
        id,
        `⚠️ <b>Xatolik yuz berdi:</b> ${tgHimoyala(natija?.xato || "Masalani yechib bo'lmadi. Iltimos, qayta urinib ko'ring.")}`,
        { aiKlaviatura: true }
      );
    }

    // A) Agar shunchaki erkin muloqot / suhbat bo'lsa
    if (natija.turi === "suhbat") {
      const javob = tgKimyoFormatla(natija.matn || "Sizga qanday yordam bera olaman?");
      return telegramYubor(id, javob, { aiKlaviatura: true });
    }

    // Asosiy javob PDF tayyorlanishini kutmaydi: hujjat xato qilsa ham
    // foydalanuvchi masalaning natijasini darhol olishi kerak.
    const javobMatni =
      `🧪 <b>JDA Kimyo AI — Masala Yechimi</b>\n\n` +
      `✅ <b>Yakuniy Javob:</b> <code>${tgHimoyala(latexliMatnniOddiylashtir(natija.yakuniyJavob || "Yechildi"))}</code>\n\n` +
      `📄 <i>To'liq bayonnoma keyingi PDF xabarida yuboriladi.</i>`;

    const matnNatijasi = await telegramYubor(id, javobMatni, { aiKlaviatura: true });

    try {
      const { config } = await aiSozlamaniOl();
      if (!config.channels.pdf) return matnNatijasi;
      const pdfBuffer = await masalaPdfYukla({
        foydalanuvchiNom: foydalanuvchiIsmi,
        masalaMatni: natija.masalaMatni || masalaMatni,
        natija,
        avtoYuklabOlish: false,
      });
      return telegramHujjatYubor(
        id,
        pdfBuffer,
        `JDA-Kimyo-Yechim-${Date.now()}.pdf`,
        `🧪 Masala yechimi bayonnomasi — ${foydalanuvchiIsmi}`,
        { aiKlaviatura: true }
      );
    } catch (pdfXato) {
      console.error("[Shaxsiy AI PDF xatosi]", pdfXato);
      return matnNatijasi;
    }
  } catch (err) {
    console.error("[Shaxsiy AI Xatosi]", err);
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(id, tempMsg.natija.message_id);
    }
    return telegramYubor(id, "⚠️ Masalani tahlil qilishda kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring.", { aiKlaviatura: true });
  } finally {
    await olchov.yoz();
  }
}

/**
 * Guruhda @jdakimyouzbot chaqirilganda ishlash
 */
export async function guruhAiXabariniBajar({ chatId, xabar, botUsername = "jdakimyouzbot" }) {
  const guruhId = String(chatId);
  const foydalanuvchiTgId = String(xabar.from?.id || "");
  const ism = xabar.from?.first_name || "Foydalanuvchi";

  // 1. Foydalanuvchi saytga ulanganmi tekshirish
  const ulanish = await prisma.telegramUlanish.findUnique({
    where: { chatId: foydalanuvchiTgId },
    include: { user: true },
  });

  // Agar sayt hisobiga ulanmagan bo'lsa -> Tushuntirish va shaxsiy botga o'tkazish
  if (!ulanish || !ulanish.user) {
    const xabarMatn =
      `⚠️ <b>Hurmatli ${tgHimoyala(ism)}!</b>\n\n` +
      `JDA Kimyo AI orqali masalalarni yechish uchun avval <b>jdakimyo.uz</b> saytida profilingizni yaratishingiz va uni botga ulashingiz kerak.\n\n` +
      `Quyidagi tugmani bosing va botning shaxsiy chatida hisobingizni 1 daqiqada ulang:`;

    return telegramYubor(guruhId, xabarMatn, {
      havola: {
        matn: "🔗 Profilni Ulash & Batafsil",
        url: `https://t.me/${botUsername}?start=ulash`,
      },
    });
  }

  const foydalanuvchiId = ulanish.user.id;
  const foydalanuvchiIsmi = ulanish.user.fullName || ism;

  // 2. Matndan bot nomini tozalash
  let matn = (xabar.text || xabar.caption || "").trim();
  matn = matn.replace(new RegExp(`@?${botUsername}\\b`, "gi"), "").trim();
  matn = matn.replace(/@jdakimyouzbot\b/gi, "").replace(/@jdakimyo\b/gi, "").trim();

  let rasmBase64 = null;
  if (xabar.photo && xabar.photo.length > 0) {
    const engKattaRasm = xabar.photo[xabar.photo.length - 1];
    rasmBase64 = await telegramRasmBase64Yukla(engKattaRasm.file_id);
  }

  if (!matn && !rasmBase64) {
    return telegramYubor(
      guruhId,
      `🧪 <b>Salom, ${tgHimoyala(foydalanuvchiIsmi)}!</b> Masala shartini yozing yoki rasmini yuborib meni belgilang (@${botUsername}), yechib beraman!`
    );
  }

  // Vaqtinchalik "tahlil qilinmoqda..." xabari
  const tempMsg = await telegramYubor(
    guruhId,
    `🧠 <i>@${tgHimoyala(xabar.from?.username || ism)} ning masalasi JDA Kimyo AI tomonidan tahlil qilinmoqda...</i>`
  );
  const olchov = telegramTelemetriyasi("yech_guruh");

  try {
    const natija = await multiAgentMasalaYech({
      masalaMatni: matn,
      rasm: rasmBase64,
      foydalanuvchiId,
      foydalanuvchiIsmi,
      rejim: "toliq",
      kanal: "telegram",
      telemetriya: olchov.qosh,
      apiChaqirishdanOldin: telegramQuotaBandlovchi(ulanish.user),
    });

    // Vaqtinchalik "tahlil qilinmoqda..." xabarini o'chirish
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(guruhId, tempMsg.natija.message_id);
    }

    if (!natija || !natija.muvaffaqiyatli) {
      return telegramYubor(
        guruhId,
        `⚠️ <b>Xatolik:</b> ${tgHimoyala(natija?.xato || "Masalani yechib bo'lmadi.")}`
      );
    }

    // A) Agar oddiy suhbat bo'lsa
    if (natija.turi === "suhbat") {
      return telegramYubor(guruhId, tgKimyoFormatla(natija.matn));
    }

    const javobMatni =
      `🧪 <b>JDA Kimyo AI (Beta)</b>\n\n` +
      `✅ <b>Yakuniy Javob:</b> <code>${tgHimoyala(latexliMatnniOddiylashtir(natija.yakuniyJavob || ""))}</code>\n\n` +
      `📄 <i>To'liq bayonnoma keyingi PDF xabarida yuboriladi.</i>`;
    const matnNatijasi = await telegramYubor(guruhId, javobMatni);

    try {
      const { config } = await aiSozlamaniOl();
      if (!config.channels.pdf) return matnNatijasi;
      const pdfBuffer = await masalaPdfYukla({
        foydalanuvchiNom: foydalanuvchiIsmi,
        masalaMatni: natija.masalaMatni || matn,
        natija,
        avtoYuklabOlish: false,
      });
      return telegramHujjatYubor(
        guruhId,
        pdfBuffer,
        `JDA-Kimyo-Yechim-${Date.now()}.pdf`,
        `Masala yechimining to'liq akademik bayonnomasi.`
      );
    } catch (pdfXato) {
      console.error("[Guruh AI PDF xatosi]", pdfXato);
      return matnNatijasi;
    }
  } catch (err) {
    console.error("[Guruh AI Xatosi]", err);
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(guruhId, tempMsg.natija.message_id);
    }
    return telegramYubor(guruhId, "⚠️ Masalani yechishda xatolik yuz berdi.");
  } finally {
    await olchov.yoz();
  }
}
