/** O'quvchi tayyor javob emas, o'zi fikrlab topishi uchun yordam so'raganini aniqlaydi. */
export function sokratikRejimniAniqla(savol = "") {
  return /(?:\btushuntir(?:ib)?\b|birga\s+yech(?:aylik)?|qanday\s+yech(?:amiz|ish)|yo'l\s+ko'rsat|yordam\s+ber)/i.test(String(savol || ""));
}

/** Modelning yakuniy javobni oshkor qilishini emas, keyingi fikrlash qadamini so'rashini belgilaydi. */
export function sokratikKorsatmaTuz() {
  return `

SOKRATIK REPETITOR REJIMI:
- Talaba "tushuntir" yoki "birga yechaylik" dedi. Tayyor yechimni, yakuniy sonni va to'liq hisob zanjirini bermang.
- Avval masaladagi berilgan va topilishi kerak bo'lgan kattalikni ajratishga yo'naltiruvchi bitta qisqa savol bering.
- So'ng o'quvchi javob berishi mumkin bo'lgan faqat bitta keyingi qadamni so'rang; kerak bo'lsa juda qisqa ishora bering.
- Talaba javob bermaguncha keyingi bosqichga o'tmang. Uning xatosini tayyor javob bilan almashtirmang, qaysi qonun yoki birlikni qayta tekshirishini so'rang.
- Javobingiz savol bilan tugasin va 900 belgidan oshmasin.`;
}
