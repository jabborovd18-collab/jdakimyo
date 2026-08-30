// lib/telegram-ai-handler.js
//
// JDA KIMYO AI — TELEGRAM BOT SHAXSIY VA GURUH INTEGRATSIYASI (v5.2 Enterprise)
// Mukammal Unicode kimyo formulalari, vaqtinchalik xabarlarni avtomatik o'chirish, guruh filtri.

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

const SAYT = "https://www.jdakimyo.uz";

// Shaxsiy chatdagi faol AI sessiyalar (chatId -> boolean)
const faolAiSuhbatlar = new Set();

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
  let s = String(matn).trim();

  // 1. Kasrlar va nuqta-vergullar
  s = s.replace(/\\d?frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
  s = s.replace(/\{,\}/g, ".");
  s = s.replace(/\\,/g, " ");

  // 2. Strelkalar va reaksiyalar
  s = s.replace(/\\xrightarrow\[([^\]]*)\]\{([^}]+)\}/g, " —[$1, $2]→ ");
  s = s.replace(/\\xrightarrow\{([^}]+)\}/g, " —[$1]→ ");
  s = s.replace(/\\rightarrow/g, " → ");
  s = s.replace(/\\leftrightarrow/g, " ↔ ");
  s = s.replace(/\\Delta/g, "Δ (t°)");
  s = s.replace(/\\cdot/g, " · ");
  s = s.replace(/\\times/g, " × ");
  s = s.replace(/\\uparrow/g, "↑");
  s = s.replace(/\\downarrow/g, "↓");

  // 3. Matnli LaTeX teglarni olib tashlash (\text{...}, \mathrm{...})
  s = s.replace(/\\(?:text|mathrm|mathbf|textbf|mathit)\{([^}]+)\}/g, "$1");

  // 4. Superscript (Ionlar zaryadi va darajalar)
  s = s.replace(/\^\{\s*2-\s*\}/g, "²⁻");
  s = s.replace(/\^\{\s*3-\s*\}/g, "³⁻");
  s = s.replace(/\^\{\s*4-\s*\}/g, "⁴⁻");
  s = s.replace(/\^\{\s*2\+\s*\}/g, "²⁺");
  s = s.replace(/\^\{\s*3\+\s*\}/g, "³⁺");
  s = s.replace(/\^\{\s*4\+\s*\}/g, "⁴⁺");
  s = s.replace(/\^\{\s*\+\s*\}/g, "⁺");
  s = s.replace(/\^\{\s*-\s*\}/g, "⁻");
  s = s.replace(/\^2/g, "²");
  s = s.replace(/\^3/g, "³");
  s = s.replace(/\^\{\s*([0-9a-zA-Z+-]+)\s*\}/g, "^$1");

  // 5. Subscript (Indekslar)
  s = s.replace(/_\{umumiy\}/gi, " (umumiy)");
  s = s.replace(/_\{qoldiq\}/gi, " (qoldiq)");
  s = s.replace(/_\{hosil\}/gi, " (hosil)");
  s = s.replace(/_\{sarf\}/gi, " (sarf)");
  s = s.replace(/_\{(\d+)\}/g, (_, d) =>
    d
      .replace(/0/g, "₀")
      .replace(/1/g, "₁")
      .replace(/2/g, "₂")
      .replace(/3/g, "₃")
      .replace(/4/g, "₄")
      .replace(/5/g, "₅")
      .replace(/6/g, "₆")
      .replace(/7/g, "₇")
      .replace(/8/g, "₈")
      .replace(/9/g, "₉")
  );
  s = s.replace(/_0/g, "₀");
  s = s.replace(/_1/g, "₁");
  s = s.replace(/_2/g, "₂");
  s = s.replace(/_3/g, "₃");
  s = s.replace(/_4/g, "₄");
  s = s.replace(/_5/g, "₅");
  s = s.replace(/_6/g, "₆");
  s = s.replace(/_7/g, "₇");
  s = s.replace(/_8/g, "₈");
  s = s.replace(/_9/g, "₉");
  s = s.replace(/_\{([0-9a-zA-Z]+)\}/g, "$1");

  // 6. Dollar belgilarini olib tashlash
  s = s.replace(/\$\$/g, "");
  s = s.replace(/\$/g, "");

  // 7. HTML xavfsizligi va Markdown bold
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

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

  try {
    const natija = await multiAgentMasalaYech({
      masalaMatni,
      rasm: rasmBase64,
      foydalanuvchiId,
      foydalanuvchiIsmi,
      rejim: "toliq",
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

    // B) Agar masala yechimi bo'lsa -> PDF generatsiya qilish
    const pdfBuffer = await masalaPdfYukla({
      foydalanuvchiNom: foydalanuvchiIsmi,
      masalaMatni: natija.masalaMatni || masalaMatni,
      natija,
      avtoYuklabOlish: false,
    });

    const javobMatni =
      `🧪 <b>JDA Kimyo AI — Masala Yechimi</b>\n\n` +
      `✅ <b>Yakuniy Javob:</b> <code>${tgHimoyala(natija.yakuniyJavob || "Yechildi")}</code>\n\n` +
      `📄 <i>To'liq bosqichma-bosqich akademik bayonnoma quyidagi PDF faylda keltirildi:</i>`;

    await telegramYubor(id, javobMatni, { aiKlaviatura: true });

    return telegramHujjatYubor(
      id,
      pdfBuffer,
      `JDA-Kimyo-Yechim-${Date.now()}.pdf`,
      `🧪 Masala yechimi bayonnomasi — ${foydalanuvchiIsmi}`,
      { aiKlaviatura: true }
    );
  } catch (err) {
    console.error("[Shaxsiy AI Xatosi]", err);
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(id, tempMsg.natija.message_id);
    }
    return telegramYubor(id, "⚠️ Masalani tahlil qilishda kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko'ring.", { aiKlaviatura: true });
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

  try {
    const natija = await multiAgentMasalaYech({
      masalaMatni: matn,
      rasm: rasmBase64,
      foydalanuvchiId,
      foydalanuvchiIsmi,
      rejim: "toliq",
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

    // B) Agar masala bo'lsa -> PDF tayyorlab jo'natish
    const pdfBuffer = await masalaPdfYukla({
      foydalanuvchiNom: foydalanuvchiIsmi,
      masalaMatni: natija.masalaMatni || matn,
      natija,
      avtoYuklabOlish: false,
    });

    const caption =
      `🧪 <b>JDA Kimyo AI (Beta)</b>\n\n` +
      `✅ <b>Yakuniy Javob:</b> <code>${tgHimoyala(natija.yakuniyJavob || "")}</code>\n\n` +
      `Masalangiz yechimi ushbu PDF da. Masala xato ishlangan yoki savollaringiz bo'lsa, @diyorbek_jabborov ga murojaat qilishingizni so'raymiz.`;

    return telegramHujjatYubor(
      guruhId,
      pdfBuffer,
      `JDA-Kimyo-Yechim-${Date.now()}.pdf`,
      caption
    );
  } catch (err) {
    console.error("[Guruh AI Xatosi]", err);
    if (tempMsg?.natija?.message_id) {
      await telegramOchir(guruhId, tempMsg.natija.message_id);
    }
    return telegramYubor(guruhId, "⚠️ Masalani yechishda xatolik yuz berdi.");
  }
}
