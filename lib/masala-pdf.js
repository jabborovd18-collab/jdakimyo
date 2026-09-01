// PDF yaratish muhiti shu yerda tanlanadi; haqiqiy rendererlar alohida.
// Nega dinamik import: Chromium faqat PDF so'ralganda yuklanadi va asosiy
// AI javobining client hamda server bundle'ini keraksiz og'irlashtirmaydi.

export async function masalaPdfYukla(sozlamalar = {}) {
  if (typeof window !== "undefined") {
    const { masalaPdfBrauzerdaYukla } = await import("./masala-pdf-brauzer.js");
    return masalaPdfBrauzerdaYukla(sozlamalar);
  }

  try {
    const { masalaPdfChromiumdaYarat } = await import("./masala-pdf-chromium.js");
    return masalaPdfChromiumdaYarat(sozlamalar);
  } catch (xato) {
    // Telegram va server ishlarida Chromium vaqtincha ochilmasa ham hujjat
    // yetkaziladi; eski pdf-lib yo'li faqat favqulodda zaxira bo'lib qoladi.
    console.warn("[Server premium PDF zaxira rejimiga o'tdi]", xato);
    const { masalaPdfServerdaYarat } = await import("./masala-pdf-server.js");
    return masalaPdfServerdaYarat(sozlamalar);
  }
}
