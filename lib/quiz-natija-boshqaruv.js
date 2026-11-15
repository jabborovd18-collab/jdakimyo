// lib/quiz-natija-boshqaruv.js
//
// Foydalanuvchining erkin va boshqa quiz natijalarini boshqarish qoidalari:
// qadash (ko'pi bilan 3 ta), yashirish (ommaviy ko'rinishdan berkitish) va o'chirish.

export const MAX_QADALGAN_QUIZ = 3

/** Barcha ommaviy va kabinet ro'yxatlarida qadalgan natijalar birinchi chiqadi. */
export const QUIZ_NATIJA_TARTIBI = [
  { isPinned: 'desc' },
  { pinnedAt: 'desc' },
  { completedAt: 'desc' },
]

/**
 * `attemptId` prefiksiga qarab natija manbasini va o'chirish ruxsatini aniqlaydi.
 *
 * Erkin quizlar (`oddiy:...` yoki eski `null` yozuvlar) talabaning ixtiyoriy
 * mashqi bo'lgani uchun butunlay o'chirilishi mumkin; ustoz va Milliy sertifikat
 * natijalarini esa faqat yashirish yoki qadash mumkin (rasmiy qaydlarni yo'qotmaslik uchun).
 */
export function quizManbaTuri(attemptId) {
  const kalit = typeof attemptId === 'string' ? attemptId.trim() : ''
  if (!kalit || kalit.startsWith('oddiy:')) {
    return { id: 'erkin', label: 'Erkin quiz', deletable: true }
  }
  if (kalit.startsWith('ustoz:')) {
    return { id: 'ustoz', label: 'Ustoz testi', deletable: false }
  }
  if (kalit.startsWith('yopiq:')) {
    return { id: 'yopiq', label: 'Yopiq quiz', deletable: false }
  }
  if (kalit.startsWith('ms-')) {
    return { id: 'milliy-sertifikat', label: 'Milliy sertifikat', deletable: false }
  }
  return { id: 'boshqa', label: 'Test', deletable: false }
}

/** DB yozuvidan mijoz uchun xavfsiz va boyitilgan ob'ekt yasaydi. */
export function quizNatijaniBoyit(item) {
  if (!item) return null
  const manba = quizManbaTuri(item.attemptId)
  return {
    id: item.id,
    quizName: item.quizName,
    score: Number(item.score) || 0,
    totalQuestions: Number(item.totalQuestions) || 0,
    percentage: Math.round(Number(item.percentage) || 0),
    timeSpent: Math.max(0, Math.floor(Number(item.timeSpent) || 0)),
    isPinned: Boolean(item.isPinned),
    pinnedAt: item.pinnedAt || null,
    isHidden: Boolean(item.isHidden),
    completedAt: item.completedAt,
    sourceType: manba.id,
    sourceLabel: manba.label,
    isErkin: manba.id === 'erkin',
    canDelete: manba.deletable,
  }
}

/** Soniyalarni o'zbekcha o'qishli ko'rinishga o'tkazadi ("2 daq 15 son"). */
export function quizSarflanganVaqtMatni(seconds) {
  const s = Math.floor(Number(seconds) || 0)
  if (s <= 0) return ''
  if (s < 60) return `${s} son`
  const daqiqa = Math.floor(s / 60)
  const qoldiqSon = s % 60
  if (daqiqa < 60) {
    return qoldiqSon > 0 ? `${daqiqa} daq ${qoldiqSon} son` : `${daqiqa} daq`
  }
  const soat = Math.floor(daqiqa / 60)
  const qoldiqDaq = daqiqa % 60
  return qoldiqDaq > 0 ? `${soat} soat ${qoldiqDaq} daq` : `${soat} soat`
}

/**
 * Qadash, yashirish yoki o'chirish amalini tekshiradi va bajarish rejasini qaytaradi.
 * Soft-rule: yashirilganda qadash avtomatik olinadi (bo'sh joy band bo'lib qolmasligi uchun).
 */
export function quizNatijaAmalRejasi({
  natija,
  amal,
  joriyQadalganSoni = 0,
  hozir = new Date(),
}) {
  if (!natija) {
    return { ok: false, status: 404, error: 'Quiz natijasi topilmadi' }
  }

  const manba = quizManbaTuri(natija.attemptId)

  switch (amal) {
    case 'delete': {
      if (!manba.deletable) {
        return {
          ok: false,
          status: 403,
          error:
            "Faqat erkin quiz natijalarini o'chirish mumkin. Ustoz va rasmiy test natijalarini esa yashirishingiz mumkin.",
        }
      }
      return {
        ok: true,
        status: 200,
        operation: 'delete',
        message: "Erkin quiz natijasi o'chirildi",
      }
    }

    case 'pin': {
      if (natija.isHidden) {
        return {
          ok: false,
          status: 400,
          error: "Yashirilgan natijani qadash uchun avval uni ko'rinadigan qiling.",
        }
      }
      if (natija.isPinned) {
        return {
          ok: true,
          status: 200,
          operation: 'noop',
          data: {},
          message: 'Natija allaqachon qadalgan',
        }
      }
      if (Number(joriyQadalganSoni) >= MAX_QADALGAN_QUIZ) {
        return {
          ok: false,
          status: 400,
          error: `Ko'pi bilan ${MAX_QADALGAN_QUIZ} ta quiz natijasini qadash mumkin. Avval birortasini qadashdan oling.`,
        }
      }
      return {
        ok: true,
        status: 200,
        operation: 'update',
        data: { isPinned: true, pinnedAt: hozir },
        message: 'Natija profil boshiga qadaldi',
      }
    }

    case 'unpin': {
      if (!natija.isPinned) {
        return {
          ok: true,
          status: 200,
          operation: 'noop',
          data: {},
          message: 'Natija qadalmagan',
        }
      }
      return {
        ok: true,
        status: 200,
        operation: 'update',
        data: { isPinned: false, pinnedAt: null },
        message: 'Natijadan qadash olib tashlandi',
      }
    }

    case 'hide': {
      if (natija.isHidden) {
        return {
          ok: true,
          status: 200,
          operation: 'noop',
          data: {},
          message: 'Natija allaqachon yashirilgan',
        }
      }
      return {
        ok: true,
        status: 200,
        operation: 'update',
        data: { isHidden: true, isPinned: false, pinnedAt: null },
        message: "Natija profilingizdan yashirildi",
      }
    }

    case 'unhide': {
      if (!natija.isHidden) {
        return {
          ok: true,
          status: 200,
          operation: 'noop',
          data: {},
          message: "Natija allaqachon ko'rinadigan holatda",
        }
      }
      return {
        ok: true,
        status: 200,
        operation: 'update',
        data: { isHidden: false },
        message: "Natija yana ko'rinadigan qilindi",
      }
    }

    default:
      return { ok: false, status: 400, error: "Noto'g'ri amal yuborildi" }
  }
}

/** Foydalanuvchining barcha quiz natijalari bo'yicha ixcham xulosa hisoblaydi. */
export function quizNatijaXulosaHisobla(rows = []) {
  const safeRows = Array.isArray(rows) ? rows : []
  let visibleCount = 0
  let hiddenCount = 0
  let pinnedCount = 0
  let erkinCount = 0
  let officialCount = 0
  let visibleSum = 0
  let bestPercentage = 0

  for (const r of safeRows) {
    const manba = quizManbaTuri(r.attemptId)
    if (manba.id === 'erkin') erkinCount += 1
    else officialCount += 1

    const pct = Math.round(Number(r.percentage) || 0)
    if (r.isHidden) {
      hiddenCount += 1
    } else {
      visibleCount += 1
      visibleSum += pct
      if (pct > bestPercentage) bestPercentage = pct
      if (r.isPinned) pinnedCount += 1
    }
  }

  return {
    totalAll: safeRows.length,
    visibleCount,
    hiddenCount,
    pinnedCount,
    erkinCount,
    officialCount,
    avgPercentage: visibleCount > 0 ? Math.round(visibleSum / visibleCount) : 0,
    bestPercentage,
    maxPinned: MAX_QADALGAN_QUIZ,
  }
}

/** Filtr va qidiruv parametrlaridan Prisma `where` obyektini tuzadi. */
export function quizNatijaFiltrSharti(userId, { filter = 'all', source = 'all', search = '' } = {}) {
  const conditions = [{ userId }]

  if (filter === 'visible') conditions.push({ isHidden: false })
  else if (filter === 'hidden') conditions.push({ isHidden: true })
  else if (filter === 'pinned') conditions.push({ isPinned: true, isHidden: false })

  if (source === 'erkin') {
    conditions.push({
      OR: [{ attemptId: null }, { attemptId: { startsWith: 'oddiy:' } }],
    })
  } else if (source === 'rasmiy') {
    conditions.push({
      AND: [
        { attemptId: { not: null } },
        { NOT: { attemptId: { startsWith: 'oddiy:' } } },
      ],
    })
  }

  const trimmed = typeof search === 'string' ? search.trim() : ''
  if (trimmed) {
    conditions.push({
      quizName: { contains: trimmed, mode: 'insensitive' },
    })
  }

  return conditions.length === 1 ? conditions[0] : { AND: conditions }
}

/** Saralash tartibini qaytaradi. */
export function quizNatijaSaralashTartibi(sort = 'default') {
  if (sort === 'best') {
    return [{ percentage: 'desc' }, { completedAt: 'desc' }]
  }
  if (sort === 'oldest') {
    return [{ completedAt: 'asc' }]
  }
  return QUIZ_NATIJA_TARTIBI
}
