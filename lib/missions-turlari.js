// lib/missions-turlari.js
// Kunlik missiya turlari — YAGONA sof ro'yxat (`lib/missions.js` va admin panel uchun).
// Server/Prisma kutubxonasiga bog'liq emas, shuning uchun client ham, unit-test ham ishlata oladi.

export const MISSIYA_TURLARI = [
  {
    type: 'quiz',
    title: 'Quiz yeching',
    description: "Har qanday quizni yechib, bilimingizni sinab ko'ring",
    xpReward: 10,
    icon: '📝',
    difficulty: 'easy',
    havola: '/testlar',
  },
  {
    type: 'post',
    title: 'Post yozing',
    description: "Profilingizga post yozing yoki muhokamada fikr bildiring",
    xpReward: 15,
    icon: '✍️',
    difficulty: 'medium',
    havola: '/profil',
  },
  {
    type: 'muhokama',
    title: 'Muhokamada qatnashing',
    description: "Dolzarb mavzulardan biriga javob yozing",
    xpReward: 15,
    icon: '💬',
    difficulty: 'medium',
    havola: '/dolzarb',
  },
  {
    type: 'friend',
    title: "Do'st qo'shing",
    description: "Yangi do'st qo'shing yoki do'stlik taklifini yuboring",
    xpReward: 20,
    icon: '👥',
    difficulty: 'hard',
    havola: '/profil/dostlar',
  },
]

export const MISSIYA_TUR_KODI = MISSIYA_TURLARI.map((m) => m.type)
