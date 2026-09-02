// AI kunlik kvotasi Postgresdagi SorovLimit yozuvida saqlanadi.
// Serverless nusxalar va qayta ishga tushishlar endi sanoqni yo'qotmaydi.
import { prisma } from '../prisma'
import { aiKunlikLimit } from './ai-quota-qoida.js'
import { aiSozlamaniOl } from './ai-config.js'

function bugunUtc() {
  const sana = new Date()
  sana.setUTCHours(0, 0, 0, 0)
  return sana
}

function natija(ishlatildi, jamiLimit) {
  const qoldi = Math.max(0, jamiLimit - ishlatildi)
  const ruxsat = ishlatildi < jamiLimit
  return {
    ruxsat,
    ishlatildi,
    jamiLimit,
    qoldi,
    foiz: Math.min(100, Math.round((ishlatildi / jamiLimit) * 100)),
    xato: ruxsat
      ? null
      : `Bugungi kunlik limitingiz (${jamiLimit} ta) tugadi. Ertaga soat 00:00 da yangilanadi.`,
  }
}

class AiQuotaManager {
  _kalit(userId) {
    return `ai:kun:${userId}`
  }

  async tekshir(userId, userRole = 'bakalavr', isTeacher = false) {
    if (!userId) return { ruxsat: false, xato: "Avtorizatsiyadan o'tmagan foydalanuvchi." }

    const { config } = await aiSozlamaniOl()
    const jamiLimit = aiKunlikLimit(userRole, isTeacher, config.quotas)
    const yozuv = await prisma.sorovLimit.findUnique({ where: { kalit: this._kalit(userId) } })
    const ishlatildi = yozuv && yozuv.oynaBoshi >= bugunUtc() ? yozuv.soni : 0
    return natija(ishlatildi, jamiLimit)
  }

  /**
   * Tashqi AI chaqiruvidan oldin bitta o'rinni atomar band qiladi.
   * Serializable tranzaksiya parallel so'rovlarning ikkalasi ham bir xil
   * oxirgi o'rinni olishiga yo'l qo'ymaydi; konflikt bo'lsa qayta urinadi.
   */
  async bandQil(userId, userRole = 'bakalavr', isTeacher = false) {
    if (!userId) return { ruxsat: false, xato: "Avtorizatsiyadan o'tmagan foydalanuvchi." }

    const { config } = await aiSozlamaniOl()
    const jamiLimit = aiKunlikLimit(userRole, isTeacher, config.quotas)
    const kalit = this._kalit(userId)

    for (let urinish = 0; urinish < 3; urinish++) {
      try {
        return await prisma.$transaction(async (tx) => {
          const kunBoshi = bugunUtc()
          const yozuv = await tx.sorovLimit.findUnique({ where: { kalit } })
          const ishlatildi = yozuv && yozuv.oynaBoshi >= kunBoshi ? yozuv.soni : 0

          if (ishlatildi >= jamiLimit) return natija(ishlatildi, jamiLimit)

          const yangiSoni = ishlatildi + 1
          await tx.sorovLimit.upsert({
            where: { kalit },
            create: { kalit, soni: 1, oynaBoshi: kunBoshi },
            update: yozuv && yozuv.oynaBoshi >= kunBoshi
              ? { soni: { increment: 1 } }
              : { soni: 1, oynaBoshi: kunBoshi },
          })

          // Bu so'rov o'rinni muvaffaqiyatli band qildi. `yangiSoni` aynan
          // limitga teng bo'lsa keyingi so'rov yopiladi, joriy so'rov emas.
          return { ...natija(yangiSoni, jamiLimit), ruxsat: true, xato: null }
        }, { isolationLevel: 'Serializable' })
      } catch (error) {
        if (error?.code === 'P2034' && urinish < 2) continue
        throw error
      }
    }
  }

  async malumotOl(userId, userRole = 'bakalavr', isTeacher = false) {
    return await this.tekshir(userId, userRole, isTeacher)
  }
}

export const aiQuota = new AiQuotaManager()
