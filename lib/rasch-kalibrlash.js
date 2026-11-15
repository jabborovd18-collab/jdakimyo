// lib/rasch-kalibrlash.js
//
// Savol qiyinligini haqiqiy javoblardan hisoblash: Rasch CML
// (conditional maximum likelihood).
//
// Nega CML: to'g'ri javoblar soni o'quvchi darajasini to'liq ifodalaydi, shuning
// uchun qiyinlikni o'quvchi thetasini bilmasdan baholash mumkin. JMLE esa
// qiyinliklarni qisqa testlarda sistematik ravishda kengaytirib yuboradi.
//
// Nega loyiha ichida: kalibrlash uchun R yoki pullik dastur o'rnatish shart
// bo'lmasin. To'g'riligi test/rasch-kalibrlash.test.js da simulyatsiya bilan
// tekshiriladi: ma'lum qiyinliklardan yasalgan javoblar o'sha qiyinlikni qaytaradi.
import { raschEhtimollik } from './rasch-model.js'

// Rasch fit uchun odatiy oraliq
const FIT_MIN = 0.7
const FIT_MAKS = 1.3
// Nega 0.15: bundan past bog'lanish kuchli o'quvchi ham, kuchsiz ham savolni
// deyarli bir xil ishlashini bildiradi, ya'ni savol bilimni ajratmaydi
const KORRELYATSIYA_MIN = 0.15

/** Elementar simmetrik funksiyalar: gamma[r] — r ta to'g'ri javobning yig'indi vazni */
function gammalar(vaznlar) {
  const g = new Array(vaznlar.length + 1).fill(0)
  g[0] = 1
  vaznlar.forEach((v, i) => {
    for (let r = i + 1; r >= 1; r--) g[r] += v * g[r - 1]
  })
  return g
}

/** Chekka o'quvchi va savollarni olib tashlaydi: ular qiyinlik haqida ma'lumot bermaydi */
function chekkalarniOl(matritsa, ustunlar) {
  let qatorlar = matritsa
  let faol = ustunlar.map((_, i) => i)
  const chetda = []

  for (;;) {
    qatorlar = qatorlar.filter((q) => {
      const ball = faol.reduce((s, i) => s + q[i], 0)
      return ball > 0 && ball < faol.length
    })
    const qolgan = faol.filter((i) => {
      const togri = qatorlar.reduce((s, q) => s + q[i], 0)
      const chekka = togri === 0 || togri === qatorlar.length
      if (chekka) chetda.push(ustunlar[i])
      return !chekka
    })
    if (qolgan.length === faol.length) break
    faol = qolgan
  }

  return { qatorlar, faol, chetda }
}

function korrelyatsiya(x, y) {
  const n = x.length
  const ox = x.reduce((a, b) => a + b, 0) / n
  const oy = y.reduce((a, b) => a + b, 0) / n
  let sxy = 0
  let sxx = 0
  let syy = 0
  for (let i = 0; i < n; i++) {
    sxy += (x[i] - ox) * (y[i] - oy)
    sxx += (x[i] - ox) ** 2
    syy += (y[i] - oy) ** 2
  }
  return sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0
}

/** Har bir to'g'ri javoblar soni uchun theta: sum(P) = r tenglamasining yechimi */
function ballThetasi(ball, qiyinliklar) {
  let theta = 0
  for (let i = 0; i < 100; i++) {
    let kutilgan = 0
    let axborot = 0
    for (const b of qiyinliklar) {
      const p = raschEhtimollik(theta, b)
      kutilgan += p
      axborot += p * (1 - p)
    }
    // Nega cheklov: chekka ballarda Newton qadami juda katta bo'lib ketadi
    const qadam = Math.max(-1, Math.min(1, (ball - kutilgan) / axborot))
    theta += qadam
    if (Math.abs(qadam) < 1e-6) break
  }
  return theta
}

/**
 * @param {number[][]} matritsa Qator — o'quvchi, ustun — savol, qiymat 0 yoki 1
 * @param {string[]} ustunlar Savol kalitlari
 * @param {{ maxIter?: number, aniqlik?: number }} [p]
 * @returns {{
 *   savollar: Array<{ kalit: string, qiyinlik: number, se: number, infit: number,
 *     outfit: number, korrelyatsiya: number, togriFoiz: number, muammo: string[] }>,
 *   chetda: string[], ishlatilgan: number, tashlangan: number,
 *   ishonchlilik: number, yaqinlashdi: boolean, iteratsiya: number
 * }}
 */
export function kalibrla(matritsa, ustunlar, { maxIter = 2000, aniqlik = 1e-5 } = {}) {
  const { qatorlar, faol, chetda } = chekkalarniOl(matritsa, ustunlar)
  const L = faol.length
  if (L < 2 || qatorlar.length === 0) {
    throw new Error("Kalibrlash uchun yaroqli javoblar yetarli emas")
  }

  const javoblar = qatorlar.map((q) => faol.map((i) => q[i]))
  const ballar = javoblar.map((q) => q.reduce((a, b) => a + b, 0))
  const ballSoni = new Array(L + 1).fill(0)
  ballar.forEach((r) => ballSoni[r]++)
  const togriSoni = faol.map((_, i) => javoblar.reduce((s, q) => s + q[i], 0))

  const N = javoblar.length
  let b = togriSoni.map((s) => Math.log((N - s) / s))
  const markazla = (m) => {
    const o = m.reduce((x, y) => x + y, 0) / m.length
    return m.map((x) => x - o)
  }
  b = markazla(b)

  const ehtimolliklar = (qiyinlik) => {
    const vaznlar = qiyinlik.map((x) => Math.exp(-x))
    const g = gammalar(vaznlar)
    // p[i][r] — r ball olgan o'quvchining i-savolni to'g'ri ishlash ehtimoli
    return vaznlar.map((v, i) => {
      const gi = gammalar(vaznlar.filter((_, j) => j !== i))
      const p = new Array(L + 1).fill(0)
      for (let r = 1; r < L; r++) p[r] = (v * gi[r - 1]) / g[r]
      return p
    })
  }

  let yaqinlashdi = false
  let iteratsiya = 0
  for (; iteratsiya < maxIter && !yaqinlashdi; iteratsiya++) {
    const p = ehtimolliklar(b)
    const kutilgan = p.map((pi) => pi.reduce((s, x, r) => s + ballSoni[r] * x, 0))
    const yangi = markazla(b.map((x, i) => x + Math.log(kutilgan[i] / togriSoni[i])))
    yaqinlashdi = yangi.every((x, i) => Math.abs(x - b[i]) < aniqlik)
    b = yangi
  }

  const p = ehtimolliklar(b)
  const thetalar = new Array(L + 1).fill(0)
  const thetaSe = new Array(L + 1).fill(0)
  for (let r = 1; r < L; r++) {
    thetalar[r] = ballThetasi(r, b)
    const axborot = b.reduce((s, x) => {
      const pr = raschEhtimollik(thetalar[r], x)
      return s + pr * (1 - pr)
    }, 0)
    thetaSe[r] = 1 / Math.sqrt(axborot)
  }

  const savollar = faol.map((ustunIndeksi, i) => {
    let outfit = 0
    let qoldiq = 0
    let dispersiya = 0
    javoblar.forEach((q, n) => {
      const pr = raschEhtimollik(thetalar[ballar[n]], b[i])
      const w = pr * (1 - pr)
      outfit += (q[i] - pr) ** 2 / w
      qoldiq += (q[i] - pr) ** 2
      dispersiya += w
    })
    const infitQiymat = qoldiq / dispersiya
    const outfitQiymat = outfit / N
    const axborot = p[i].reduce((s, x, r) => s + ballSoni[r] * x * (1 - x), 0)
    // Nega qolgan ball: savolning o'zi umumiy ballga kirsa, bog'lanish sun'iy ko'tariladi
    const bog = korrelyatsiya(javoblar.map((q) => q[i]), ballar.map((r, n) => r - javoblar[n][i]))

    const muammo = []
    if (infitQiymat < FIT_MIN || infitQiymat > FIT_MAKS) muammo.push('infit')
    if (outfitQiymat < FIT_MIN || outfitQiymat > FIT_MAKS) muammo.push('outfit')
    if (bog < KORRELYATSIYA_MIN) muammo.push('ajratmaydi')

    return {
      kalit: ustunlar[ustunIndeksi],
      qiyinlik: Number(b[i].toFixed(3)),
      se: Number((1 / Math.sqrt(axborot)).toFixed(3)),
      infit: Number(infitQiymat.toFixed(2)),
      outfit: Number(outfitQiymat.toFixed(2)),
      korrelyatsiya: Number(bog.toFixed(2)),
      togriFoiz: Math.round((togriSoni[i] / N) * 100),
      muammo,
    }
  })

  const thetaQatorlar = ballar.map((r) => thetalar[r])
  const orta = thetaQatorlar.reduce((a, x) => a + x, 0) / N
  const dispersiya = thetaQatorlar.reduce((a, x) => a + (x - orta) ** 2, 0) / N
  const xatoKvadrat = ballar.reduce((a, r) => a + thetaSe[r] ** 2, 0) / N

  return {
    savollar,
    chetda,
    ishlatilgan: N,
    tashlangan: matritsa.length - N,
    ishonchlilik: Number(Math.max(0, 1 - xatoKvadrat / dispersiya).toFixed(2)),
    yaqinlashdi,
    iteratsiya,
  }
}
