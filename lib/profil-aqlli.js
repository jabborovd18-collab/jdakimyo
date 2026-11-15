// lib/profil-aqlli.js
//
// Aqlli profil tahlil dvigateli (sof funksiyalar):
// kunlik maqsadlar, Milliy Sertifikat natijalari, xavfsizlik tayyorgarligi
// va ustuvor tavsiyalarni hisoblaydi.

import { oquvMaqsadTozala } from './profil-tekshiruv.js'

const KUN_MS = 24 * 60 * 60 * 1000

export function kunlikMaqsadHolati({
  bugungiSavollar = 0,
  bugungiDaqiqalar = 0,
  learningPreferences = null,
} = {}) {
  const maqsad = oquvMaqsadTozala(learningPreferences)
  const savollar = Math.max(0, Number(bugungiSavollar) || 0)
  const daqiqalar = Math.max(0, Number(bugungiDaqiqalar) || 0)
  const savolFoiz = Math.min(100, Math.round((savollar / maqsad.dailyGoalQuestions) * 100))
  const daqiqaFoiz = Math.min(100, Math.round((daqiqalar / maqsad.dailyGoalMinutes) * 100))
  const bajarildimi =
    savollar >= maqsad.dailyGoalQuestions || daqiqalar >= maqsad.dailyGoalMinutes

  return {
    savollar,
    daqiqalar,
    savolMaqsad: maqsad.dailyGoalQuestions,
    daqiqaMaqsad: maqsad.dailyGoalMinutes,
    savolFoiz,
    daqiqaFoiz,
    bajarildimi,
    uslub: maqsad.learningStyle,
    qiyinlik: maqsad.difficultyPreference,
    til: maqsad.language,
  }
}

/**
 * XAVFSIZLIK QOIDASI: holat !== 'elon_qilindi' bo'lgan urinishlarning ball,
 * daraja yoki theta qiymatlari HECH QACHON qaytarilmaydi.
 */
export function msUrinishlarXulosasi(msUrinishlar = []) {
  const royxat = Array.isArray(msUrinishlar) ? msUrinishlar : []
  const elonQilingan = royxat
    .filter((u) => u && u.holat === 'elon_qilindi')
    .sort(
      (a, b) =>
        new Date(b.yakunlanganVaqt || b.boshlanganVaqt || 0).getTime() -
        new Date(a.yakunlanganVaqt || a.boshlanganVaqt || 0).getTime(),
    )

  const kutilayotgan = royxat.filter((u) => u && u.holat !== 'elon_qilindi')

  let engYaxshi = null
  for (const u of elonQilingan) {
    if (!Number.isFinite(Number(u.shkalaBalli))) continue
    if (!engYaxshi || Number(u.shkalaBalli) > Number(engYaxshi.shkalaBalli)) {
      engYaxshi = {
        id: u.id,
        slug: u.slug,
        turi: u.slug === 'rasch-diagnostika' ? 'rasch-diagnostika' : 'simulyator',
        shkalaBalli: Number(Number(u.shkalaBalli).toFixed(1)),
        daraja: u.daraja || null,
        theta: Number.isFinite(Number(u.theta)) ? Number(Number(u.theta).toFixed(2)) : null,
        percentile: u.percentile ?? null,
        yakunlanganVaqt: u.yakunlanganVaqt || u.boshlanganVaqt || null,
      }
    }
  }

  const songgiRow = elonQilingan[0] || null
  const oldingiRow = elonQilingan[1] || null
  const songgi = songgiRow
    ? {
        id: songgiRow.id,
        slug: songgiRow.slug,
        turi: songgiRow.slug === 'rasch-diagnostika' ? 'rasch-diagnostika' : 'simulyator',
        shkalaBalli: Number.isFinite(Number(songgiRow.shkalaBalli))
          ? Number(Number(songgiRow.shkalaBalli).toFixed(1))
          : null,
        daraja: songgiRow.daraja || null,
        theta: Number.isFinite(Number(songgiRow.theta))
          ? Number(Number(songgiRow.theta).toFixed(2))
          : null,
        oddiyFoiz: songgiRow.oddiyFoiz ?? null,
        cohortRank: songgiRow.cohortRank ?? null,
        cohortTotal: songgiRow.cohortTotal ?? null,
        percentile: songgiRow.percentile ?? null,
        yakunlanganVaqt: songgiRow.yakunlanganVaqt || songgiRow.boshlanganVaqt || null,
      }
    : null

  const osish =
    songgi?.shkalaBalli !== null &&
    songgi?.shkalaBalli !== undefined &&
    oldingiRow &&
    Number.isFinite(Number(oldingiRow.shkalaBalli))
      ? Number((songgi.shkalaBalli - Number(oldingiRow.shkalaBalli)).toFixed(1))
      : null

  return {
    jamiUrinishlar: royxat.length,
    elonQilinganSoni: elonQilingan.length,
    kutilayotganSoni: kutilayotgan.length,
    engYaxshi,
    songgi,
    osish,
  }
}

export function xavfsizlikTayyorgarligi({
  user = {},
  telegramUlangan = false,
  maxfiylik = {},
  parolBor = true,
} = {}) {
  const punktlar = [
    {
      id: 'email',
      nom: 'Email tasdiqlangan',
      tayyor: Boolean(user?.emailVerified),
      ball: 35,
      href: '/profil/sozlama?bolim=security',
    },
    {
      id: 'telegram',
      nom: 'Telegram ulangan',
      tayyor: Boolean(telegramUlangan),
      ball: 25,
      href: '/profil/telegram',
    },
    {
      id: 'parol',
      nom: 'Parol himoyasi',
      tayyor: Boolean(parolBor),
      ball: 20,
      href: '/profil/sozlama?bolim=security',
    },
    {
      id: 'maxfiylik',
      nom: 'Maxfiylik sozlangan',
      tayyor: Boolean(maxfiylik && Object.keys(maxfiylik).length > 0),
      ball: 20,
      href: '/profil/maxfiylik',
    },
  ]

  const ball = punktlar.reduce((sum, p) => sum + (p.tayyor ? p.ball : 0), 0)
  return {
    ball,
    tayyorSoni: punktlar.filter((p) => p.tayyor).length,
    jamiSoni: punktlar.length,
    punktlar,
  }
}

export function muddatiYaqinSertifikatlar(sertifikatlar = [], hozir = new Date(), kun = 45) {
  const bugunMs = new Date(hozir).getTime()
  const chegaraMs = bugunMs + kun * KUN_MS

  return (Array.isArray(sertifikatlar) ? sertifikatlar : []).filter((c) => {
    const muddat = c?.expiresAt || c?.validUntil
    if (!c || c.status === 'revoked' || c.status === 'bekor' || c.holat === 'bekor' || !muddat) {
      return false
    }
    const vMs = new Date(muddat).getTime()
    return Number.isFinite(vMs) && vMs >= bugunMs && vMs <= chegaraMs
  })
}

export function qurAqlliProfilXulosa({
  user = {},
  bugungiFaollik = null,
  msUrinishlar = [],
  sertifikatlar = [],
  topshiriqSanoq = 0,
  oqilmaganSanoq = 0,
  telegramUlangan = false,
  parolBor = true,
  maxfiylik = {},
  xavfsizlikOgohlantirishSoni = 0,
  hozir = new Date(),
} = {}) {
  const kunlikMaqsad = kunlikMaqsadHolati({
    bugungiSavollar: bugungiFaollik?.quizzesTaken || 0,
    bugungiDaqiqalar: bugungiFaollik?.studyMinutes || 0,
    learningPreferences: user?.learningPreferences,
  })
  const msXulosa = msUrinishlarXulosasi(msUrinishlar)
  const xavfsizlik = xavfsizlikTayyorgarligi({
    user,
    telegramUlangan,
    maxfiylik,
    parolBor,
  })
  const yaqinCertlar = muddatiYaqinSertifikatlar(sertifikatlar, hozir, 45)

  const tavsiyalar = []

  if (xavfsizlikOgohlantirishSoni > 0) {
    tavsiyalar.push({
      id: 'xavfsizlik-ogoh',
      ustuvorlik: 100,
      daraja: 'ogohlantirish',
      ikon: 'ogohlantirish',
      sarlavha: `${xavfsizlikOgohlantirishSoni} ta xavfsizlik qaydnomasi`,
      tavsif: "Kirish urinishlari yoki ogohlantirishlarni tekshiring.",
      href: '/profil/loglar?toifa=xavfsizlik',
      tugmaMatn: 'Loglar',
    })
  }

  if (!user?.emailVerified && user?.email) {
    tavsiyalar.push({
      id: 'email-tasdiq',
      ustuvorlik: 90,
      daraja: 'ogohlantirish',
      ikon: 'pochta',
      sarlavha: 'Email tasdiqlanmagan',
      tavsif: 'Parol tiklash va bildirishnomalar uchun pochta tasdiqlang.',
      href: '/profil/sozlama?bolim=security',
      tugmaMatn: 'Tasdiqlash',
    })
  }

  if (msXulosa.kutilayotganSoni > 0) {
    tavsiyalar.push({
      id: 'ms-kutilmoqda',
      ustuvorlik: 85,
      daraja: 'muhim',
      ikon: 'vaqt',
      sarlavha: `${msXulosa.kutilayotganSoni} ta MS natijasi kutilmoqda`,
      tavsif: "Kohort baholash yakunlangach natija avtomatik profilga tushadi.",
      href: '/profil/sertifikatlar',
      tugmaMatn: 'Tekshirish',
    })
  }

  if (topshiriqSanoq > 0) {
    tavsiyalar.push({
      id: 'topshiriqlar',
      ustuvorlik: 80,
      daraja: 'muhim',
      ikon: 'kitob',
      sarlavha: `${topshiriqSanoq} ta faol topshiriq`,
      tavsif: "Ustoz tomonidan berilgan vazifalarni o'z vaqtida topshiring.",
      href: '/profil/vazifalar',
      tugmaMatn: "O'tish",
    })
  }

  if (!kunlikMaqsad.bajarildimi) {
    tavsiyalar.push({
      id: 'kunlik-maqsad',
      ustuvorlik: 70,
      daraja: 'tavsiya',
      ikon: 'chaqmoq',
      sarlavha: `Kunlik maqsad: ${kunlikMaqsad.savollar}/${kunlikMaqsad.savolMaqsad} savol`,
      tavsif: "Streakni saqlash uchun bugungi mashqni yakunlang.",
      href: '/testlar',
      tugmaMatn: 'Mashq',
    })
  }

  if (!telegramUlangan) {
    tavsiyalar.push({
      id: 'telegram-ulash',
      ustuvorlik: 60,
      daraja: 'tavsiya',
      ikon: 'telegram',
      sarlavha: 'Telegram bot ulanmagan',
      tavsif: 'Sertifikat PDF va natijalar darhol botga kelishi uchun ulang.',
      href: '/profil/telegram',
      tugmaMatn: 'Ulash',
    })
  }

  if (yaqinCertlar.length > 0) {
    tavsiyalar.push({
      id: 'cert-muddat',
      ustuvorlik: 55,
      daraja: 'ogohlantirish',
      ikon: 'sertifikat',
      sarlavha: `${yaqinCertlar.length} ta sertifikat muddati yaqin`,
      tavsif: '45 kun ichida amal qilish muddati tugaydigan hujjatlar bor.',
      href: '/profil/sertifikatlar',
      tugmaMatn: "Ko'rish",
    })
  }

  if (!user?.university || !user?.bio) {
    tavsiyalar.push({
      id: 'profil-toldir',
      ustuvorlik: 40,
      daraja: 'tavsiya',
      ikon: 'odam',
      sarlavha: "Profil ma'lumoti to'liq emas",
      tavsif: 'OTM va qisqa bio kiritsangiz reytingda tanilish osonlashadi.',
      href: '/profil/sozlama?bolim=academic',
      tugmaMatn: "To'ldirish",
    })
  }

  if (oqilmaganSanoq > 0) {
    tavsiyalar.push({
      id: 'bildirishnoma',
      ustuvorlik: 35,
      daraja: 'tavsiya',
      ikon: 'qongiroq',
      sarlavha: `${oqilmaganSanoq} ta o'qilmagan xabar`,
      tavsif: 'Yangi bildirishnomalarni ko‘rib chiqing.',
      href: '/profil/bildirishnomalar',
      tugmaMatn: 'Ochish',
    })
  }

  tavsiyalar.sort((a, b) => b.ustuvorlik - a.ustuvorlik)

  return {
    kunlikMaqsad,
    msXulosa,
    xavfsizlik,
    muddatiYaqinSertifikatSoni: yaqinCertlar.length,
    tavsiyalar: tavsiyalar.slice(0, 4),
  }
}
