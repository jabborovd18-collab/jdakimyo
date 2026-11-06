// lib/milliy-sertifikat-eksport.js
//
// Yig'ilgan javoblardan kalibrlash uchun 0/1 matritsasi yasaydi.
//
// Nega faqat birinchi urinish: natijada to'g'ri javoblar ko'rsatiladi, keyingi
// urinishda o'quvchi ularni biladi va savol aslidan oson ko'rinadi.
// Nega mehmonlar yo'q: mehmon necha marta topshirganini bilib bo'lmaydi.

// Nega 0.5: yarmidan kami bo'sh qolgan urinish bilimni emas, tashlab ketishni ko'rsatadi
const MIN_JAVOB_ULUSHI = 0.5

export function kalibrlashgaYaroqli(urinish) {
  if (urinish.urinishTartibi !== 1 || urinish.kechikkan) return false
  const berilgan = urinish.javoblar.filter((j) => j.javobBerildi).length
  return urinish.javoblar.length > 0 && berilgan / urinish.javoblar.length >= MIN_JAVOB_ULUSHI
}

/**
 * Qatorlar anonim: userId va ism faylga tushmaydi.
 *
 * @param {Array<{ urinishTartibi: number|null, kechikkan: boolean,
 *   javoblar: Array<{ savolKalit: string, togri: boolean, javobBerildi: boolean }> }>} urinishlar
 * @returns {{ matn: string, qatorlar: number, ustunlar: number, tashlangan: number }}
 */
export function javoblarCsv(urinishlar) {
  const yaroqli = urinishlar.filter(kalibrlashgaYaroqli)
  const ustunlar = [...new Set(yaroqli.flatMap((u) => u.javoblar.map((j) => j.savolKalit)))].sort()

  const qatorlar = yaroqli.map((u, i) => {
    const javob = new Map(u.javoblar.map((j) => [j.savolKalit, j.togri ? 1 : 0]))
    // Bo'sh katak: bu savol o'quvchiga umuman berilmagan, bu 0 bilan bir xil emas
    return [i + 1, ...ustunlar.map((k) => javob.get(k) ?? "")].join(",")
  })

  return {
    matn: [["qator", ...ustunlar].join(","), ...qatorlar].join("\n") + "\n",
    qatorlar: qatorlar.length,
    ustunlar: ustunlar.length,
    tashlangan: urinishlar.length - yaroqli.length,
  }
}
