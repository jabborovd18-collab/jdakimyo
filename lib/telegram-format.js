import { latexliMatnniOddiylashtir } from "./latex-oddiy-matn.js";

const TELEGRAM_XABAR_CHEGARASI = 3900;
const TELEGRAM_QISQARTIRISH = "\n\n<i>(Javob davomi qisqartirildi)</i>";

/** Telegram HTML teglarini buzmasdan xavfsiz uzunlikda kesadi. */
export function tgHtmlniChekla(matn, chegara = TELEGRAM_XABAR_CHEGARASI) {
  const xabar = String(matn || "");
  if (xabar.length <= chegara) return xabar;

  const zaxira = TELEGRAM_QISQARTIRISH.length + 24;
  const ochiqTeglar = [];
  let natija = "";
  const tokenlar = xabar.match(/<[^>]+>|&(?:#\d+|#x[\da-f]+|[a-z]+);|[^<&]+/gi) || [];
  for (const token of tokenlar) {
    if (natija.length + token.length + zaxira > chegara) {
      // Matn bo'linadi, ammo HTML teg yoki entity yarmida qolsa Telegram
      // xabarni 400 bilan rad etadi.
      if (!token.startsWith("<") && !token.startsWith("&")) {
        const qolgan = Math.max(0, chegara - natija.length - zaxira);
        natija += token.slice(0, qolgan);
      }
      break;
    }
    natija += token;
    const ochish = token.match(/^<(b|i|code)>$/i);
    const yopish = token.match(/^<\/(b|i|code)>$/i);
    if (ochish) ochiqTeglar.push(ochish[1].toLowerCase());
    if (yopish) ochiqTeglar.pop();
  }
  const yopuvchilar = ochiqTeglar.reverse().map((teg) => `</${teg}>`).join("");
  return `${natija.trimEnd()}${yopuvchilar}${TELEGRAM_QISQARTIRISH}`;
}

/** Telegram uchun LaTexni Unicode formulaga, matnni xavfsiz HTMLga aylantiradi. */
export function tgKimyoFormatla(matn, chegara = TELEGRAM_XABAR_CHEGARASI) {
  if (!matn) return "";
  let s = latexliMatnniOddiylashtir(matn);
  s = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
  s = s.replace(/[ \t]{2,}/g, " ").trim();
  return Number.isFinite(chegara) ? tgHtmlniChekla(s, chegara) : s;
}
