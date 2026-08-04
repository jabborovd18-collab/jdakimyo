// lib/missions.js
import { prisma } from './prisma'
import { trackActivity } from './streak'

/**
 * Missiya uchun beriladigan tanga.
 *
 * XP ga bog'lab qo'yamiz, shunda yangi missiya qo'shilganda tanga miqdorini
 * alohida o'ylash shart emas: qiyinroq missiya ko'proq XP beradi, demak
 * ko'proq tanga ham beradi.
 */
function tangaMiqdori(xpReward) {
  const xp = Number(xpReward) || 0
  return Math.max(1, Math.round(xp / 2))
}

/** Barcha kunlik missiyani bajarganga beriladigan qo'shimcha tanga */
const HAMMASI_BONUS_TANGA = 15

/** Har kuni beriladigan missiyalar soni */
export const KUNLIK_SONI = 3

/**
 * Missiya hovuzi — YAGONA ro'yxat.
 *
 * Avval bu ro'yxat ikki joyda edi (cron yaratadi, /api/missions/daily
 * ko'rsatadi) va missiya qaysi yo'l bilan yaratilganiga qarab har xil
 * bo'lib qolishi mumkin edi.
 *
 * HAR BIR MISSIYADA `tekshir` BOR. Avval bajarilganlikni hech kim
 * tekshirmasdi: `/api/missions/complete` shunchaki missiya id sini olib
 * mukofot berardi va kodda "keyinroq qo'shish mumkin" degan izoh turardi.
 * Ya'ni odam hech narsa qilmasdan tugmani bosib tanga, XP va yulduz
 * olaverardi — laboratoriya iqtisodiyoti esa aynan shu tangaga suyanadi.
 * Endi mukofot faqat haqiqiy amaldan keyin beriladi.
 *
 * Missiyalar TAKRORLANADIGAN amallardan tanlangan: har kuni yangi do'st
 * qo'shishni talab qilib bo'lmaydi, quiz yechish yoki post yozishni esa
 * bo'ladi. Shuning uchun "do'st qo'shish" hovuzda qoldi, lekin har kuni
 * chiqmaydi.
 *
 * Video missiyasi ataylab yo'q: video ko'rish faoliyat grafigida qayd
 * etiladi, lekin kunlik missiya sifatida berilmaydi.
 */
export const MISSIYA_HOVUZI = [
  {
    type: 'quiz',
    title: 'Quiz yeching',
    description: "Har qanday quizni yechib, bilimingizni sinab ko'ring",
    xpReward: 10,
    icon: '📝',
    difficulty: 'easy',
    havola: '/oquv/video-darsliklar/quiz',
    async tekshir(userId, kunBoshi) {
      const n = await prisma.quizResult.count({
        where: { userId, completedAt: { gte: kunBoshi } },
      })
      return n > 0
    },
  },
  {
    type: 'sandiq',
    title: 'Bepul sandiqni oching',
    description: 'Laboratoriyada kunlik bepul yetkazib berishni oling',
    xpReward: 10,
    icon: '📦',
    difficulty: 'easy',
    havola: '/laboratoriya',
    async tekshir(userId, kunBoshi) {
      const lab = await prisma.lab.findUnique({
        where: { userId },
        select: { oxirgiKunlikSandiq: true },
      })
      return Boolean(lab?.oxirgiKunlikSandiq && lab.oxirgiKunlikSandiq >= kunBoshi)
    },
  },
  {
    type: 'post',
    title: 'Post yozing',
    description: "Profilingizga post yozing yoki muhokamada fikr bildiring",
    xpReward: 15,
    icon: '✍️',
    difficulty: 'medium',
    havola: '/profil',
    async tekshir(userId, kunBoshi) {
      // Ikkalasi ham hisoblanadi: odam qayerda yozishni o'zi tanlasin.
      const [profil, forum] = await Promise.all([
        prisma.profilePost.count({ where: { userId, createdAt: { gte: kunBoshi } } }),
        prisma.forumPost.count({ where: { authorId: userId, createdAt: { gte: kunBoshi } } }),
      ])
      return profil + forum > 0
    },
  },
  {
    type: 'tajriba',
    title: "Tajriba o'tkazing",
    description: 'Laboratoriyada bitta reaksiyani amalda sinab ko\'ring',
    xpReward: 20,
    icon: '⚗️',
    difficulty: 'medium',
    havola: '/laboratoriya',
    async tekshir(userId, kunBoshi) {
      const n = await prisma.labExperiment.count({
        where: { lab: { userId }, createdAt: { gte: kunBoshi } },
      })
      return n > 0
    },
  },
  {
    type: 'muhokama',
    title: 'Muhokamada qatnashing',
    description: "Dolzarb mavzulardan biriga javob yozing",
    xpReward: 15,
    icon: '💬',
    difficulty: 'medium',
    havola: '/ilmiy/maqolalar/muhokama',
    async tekshir(userId, kunBoshi) {
      // Faqat JAVOB (parentId bor) — yangi mavzu 'post' missiyasiga tegishli
      const n = await prisma.forumPost.count({
        where: { authorId: userId, parentId: { not: null }, createdAt: { gte: kunBoshi } },
      })
      return n > 0
    },
  },
  {
    type: 'friend',
    title: "Do'st qo'shing",
    description: "Yangi do'st qo'shing yoki do'stlik taklifini yuboring",
    xpReward: 20,
    icon: '👥',
    difficulty: 'hard',
    havola: '/profil/dostlar',
    async tekshir(userId, kunBoshi) {
      const n = await prisma.friendRequest.count({
        where: { senderId: userId, createdAt: { gte: kunBoshi } },
      })
      return n > 0
    },
  },
]

/**
 * Berilgan kun uchun uchta missiya tanlaydi.
 *
 * Tanlov TASODIFIY EMAS, sanadan kelib chiqadi: cron va sahifa bir-biridan
 * mustaqil chaqirilsa ham bir xil uchlikni beradi. Tasodifiy bo'lsa,
 * cron bir uchlikni yozib, sahifa boshqasini ko'rsatishi mumkin edi.
 *
 * Har kuni boshlanish nuqtasi bittaga suriladi — shunda missiyalar
 * aylanadi va bir xil uchlik takrorlanavermaydi.
 */
export function kunlikMissiyalar(sana = missiyaKuni()) {
  const kunRaqami = Math.floor(sana.getTime() / 86400000)
  const boshlanish = ((kunRaqami % MISSIYA_HOVUZI.length) + MISSIYA_HOVUZI.length) % MISSIYA_HOVUZI.length

  const tanlangan = []
  for (let i = 0; i < KUNLIK_SONI; i++) {
    tanlangan.push(MISSIYA_HOVUZI[(boshlanish + i) % MISSIYA_HOVUZI.length])
  }
  return tanlangan
}

/** Bazaga yoziladigan maydonlar — `tekshir` va `havola` yozilmaydi */
export function missiyaYozuvi(shablon, sana) {
  return {
    date: sana,
    type: shablon.type,
    title: shablon.title,
    description: shablon.description,
    xpReward: shablon.xpReward,
    icon: shablon.icon,
    difficulty: shablon.difficulty,
  }
}

/** Turi bo'yicha hovuzdan topadi */
export function shablonniTop(type) {
  return MISSIYA_HOVUZI.find((m) => m.type === type) || null
}

/**
 * Missiya haqiqatan bajarilganmi.
 * Hovuzda topilmagan (eski) tur uchun `true` qaytaradi — eski missiyani
 * tekshirib bo'lmagani uchun odamni jazolash noto'g'ri bo'lardi.
 */
export async function bajarildimi(userId, type, kunBoshi = missiyaKuni()) {
  const shablon = shablonniTop(type)
  if (!shablon?.tekshir) return true
  try {
    return await shablon.tekshir(userId, kunBoshi)
  } catch (e) {
    console.error('[Missiya tekshiruvi]', type, e.message)
    // Baza javob bermasa mukofotni bermaymiz, lekin xato ham tashlamaymiz
    return false
  }
}

/**
 * Missiya kunining boshi — UTC yarim tuni.
 *
 * UTC ataylab: missiyalarni yaratadigan cron ham UTC ishlatadi. Avval
 * tekshiruvlar `setHours` (server mahalliy vaqti) bilan qilinardi va
 * server UTC bo'lmasa mos kelmasdi — foydalanuvchi bugungi missiyani
 * ko'rardi, lekin bajarmoqchi bo'lganda "bu missiya bugungi emas"
 * degan xato olardi.
 */
export function missiyaKuni() {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}

/**
 * Missiyani bajarilgan deb belgilaydi va mukofotni beradi.
 *
 * MUKOFOT MANTIG'INING YAGONA JOYI. Ikkita chaqiruvchi bor:
 *   1) completeMission()            — quiz yechilganda avtomatik
 *   2) POST /api/missions/complete  — foydalanuvchi tugmani bosganda
 *
 * Avval ikkalasida ham nusxa kod turardi va ikkalasida ham bir xil xato
 * bor edi: yulduz `todayCompletions === 3` shartida berilardi, kunlik
 * missiya esa 2 ta (cron shabloni). Ya'ni shart hech qachon bajarilmasdi
 * va tizim ishga tushganidan beri bironta ham yulduz berilmagan.
 *
 * @param {string} userId
 * @param {object} mission — chaqiruvchi tomonidan tekshirilgan Mission yozuvi
 */
export async function missiyaniBelgila(userId, mission) {
  const today = missiyaKuni()

  // TASDIQLANMAGAN EMAIL — MUKOFOT YO'Q.
  //
  // Ko'p akkaunt ochib tanga yig'ishga qarshi asosiy to'siq shu.
  // Tekshiruv mukofot beriladigan YAGONA joyda turibdi, chaqiruvchi
  // yo'llarda emas: yangi chaqiruvchi qo'shilganda uni unutib
  // qoldirish mumkin bo'lmasin.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  })

  if (!user?.emailVerified) {
    return {
      success: false,
      message: 'Mukofot olish uchun avval emailingizni tasdiqlang',
      emailKerak: true,
    }
  }

  await prisma.missionCompletion.create({
    data: { userId, missionId: mission.id },
  })

  const tanga = tangaMiqdori(mission.xpReward)
  await prisma.user.update({
    where: { id: userId },
    data: {
      experience: { increment: mission.xpReward },
      totalMissions: { increment: 1 },
      coins: { increment: tanga },
    },
  })

  // Faoliyat grafigi uchun qayd
  await trackActivity(userId, 'mission', mission.xpReward)

  const bajarilgan = await prisma.missionCompletion.count({
    where: { userId, mission: { date: today } },
  })

  // Bugun umuman nechta missiya bor edi — shart shunga bog'lanadi, qattiq
  // songa emas: cron shabloni o'zgarsa mantiq o'zi moslashadi.
  const bugungiMissiyalar = await prisma.mission.count({ where: { date: today } })

  let starEarned = false
  let bonusTanga = 0

  if (bugungiMissiyalar > 0 && bajarilgan === bugungiMissiyalar) {
    bonusTanga = HAMMASI_BONUS_TANGA
    await prisma.user.update({
      where: { id: userId },
      data: {
        stars: { increment: 1 },
        weeklyStars: { increment: 1 },
        monthlyStars: { increment: 1 },
        coins: { increment: bonusTanga },
      },
    })
    starEarned = true
  }

  const jamiTanga = tanga + bonusTanga

  return {
    success: true,
    message: `✓ Missiya bajarildi: ${mission.title} (+${mission.xpReward} XP, +${jamiTanga} 🪙)`,
    mission: {
      id: mission.id,
      title: mission.title,
      xpReward: mission.xpReward,
    },
    coinsEarned: jamiTanga,
    starEarned,
    todayCompleted: bajarilgan,
    todayTotal: bugungiMissiyalar,
  }
}

/**
 * Turi bo'yicha bugungi missiyani topib bajaradi.
 * Quiz yechilgandek hodisalarda avtomatik chaqiriladi.
 *
 * @param {string} userId
 * @param {string} missionType — 'quiz', 'video', 'friend'
 */
export async function completeMission(userId, missionType) {
  try {
    const today = missiyaKuni()

    const mission = await prisma.mission.findFirst({
      where: { date: today, type: missionType },
    })

    if (!mission) {
      return { success: false, message: 'Bugungi missiya topilmadi' }
    }

    const mavjud = await prisma.missionCompletion.findUnique({
      where: { userId_missionId: { userId, missionId: mission.id } },
    })

    if (mavjud) {
      return { success: false, message: 'Missiya allaqachon bajarilgan' }
    }

    return await missiyaniBelgila(userId, mission)
  } catch (error) {
    console.error('[Mission Complete Error]:', error)
    return { success: false, message: 'Xatolik: ' + error.message }
  }
}
