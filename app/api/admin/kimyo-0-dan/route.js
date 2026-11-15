import { checkAdminAuth } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { KURS_SAVOL_SONI, kursJavoblariniBahola, kursTestHolati, kursTestniTekshir } from '@/lib/kimyo-kurs-test'

const xato = (error, status) => Response.json({ error }, { status })

async function ruxsat() {
  const { authenticated, isAdmin } = await checkAdminAuth('kontent')
  if (!authenticated) return xato('Admin hisobiga kiring.', 401)
  return isAdmin ? null : xato('Bu bo‘limga ruxsat yo‘q.', 403)
}

export async function GET(request) {
  const taqiq = await ruxsat()
  if (taqiq) return taqiq
  const query = new URL(request.url).searchParams
  const id = query.get('id')
  if (!id) {
    const testlar = await prisma.kimyoKursTest.findMany({
      orderBy: { ochiladi: 'desc' },
      select: {
        id: true, sana: true, sarlavha: true, mavzular: true, nashrVaqti: true,
        ochiladi: true, yopiladi: true, _count: { select: { urinishlar: true } },
      },
    })
    return Response.json({ testlar: testlar.map(test => ({ ...test, holat: kursTestHolati(test) })) })
  }
  const sahifa = Number(query.get('sahifa') || 1)
  if (!Number.isInteger(sahifa) || sahifa < 1 || sahifa > 100000) return xato('Sahifa raqami yaroqsiz.', 400)
  const test = await prisma.kimyoKursTest.findUnique({ where: { id } })
  if (!test) return xato('Test topilmadi.', 404)
  const where = { testId: id }
  const [jami, urinishlar] = await Promise.all([
    prisma.kimyoKursUrinish.count({ where }),
    prisma.kimyoKursUrinish.findMany({
      where, orderBy: [{ topshirildi: 'desc' }, { id: 'desc' }],
      skip: (sahifa - 1) * 25, take: 25,
      select: { id: true, ism: true, familiya: true, topshirildi: true, ball: true, javoblar: true, savolTartibi: true },
    }),
  ])
  return Response.json({
    test: { ...test, holat: kursTestHolati(test) }, jami, sahifalar: Math.max(1, Math.ceil(jami / 25)),
    urinishlar: urinishlar.map(({ javoblar, savolTartibi, ...r }) => ({
      ...r,
      jami: savolTartibi?.length ?? test.savollar.length,
      xatolar: kursJavoblariniBahola(test.savollar, javoblar, savolTartibi)?.xatolar ?? [],
    })),
  })
}

export async function POST(request) {
  const taqiq = await ruxsat()
  if (taqiq) return taqiq
  const tana = await request.json().catch(() => null)
  if (tana?.amal === 'tugatish') {
    if (typeof tana.id !== 'string' || !tana.id) return xato('Testni tanlang.', 400)
    return prisma.$transaction(async tx => {
      // Qulf tugatish va ayni paytdagi topshirish uchun bitta aniq tartib belgilaydi.
      const [test] = await tx.$queryRaw`SELECT "nashrVaqti", "ochiladi", "yopiladi" FROM "KimyoKursTest" WHERE "id" = ${tana.id} FOR UPDATE`
      if (!test) return xato('Test topilmadi.', 404)
      const hozir = new Date()
      if (kursTestHolati(test, hozir) !== 'ochiq') return xato('Faqat ochiq testni tugatish mumkin.', 409)
      await tx.kimyoKursTest.update({ where: { id: tana.id }, data: { yopiladi: hozir } })
      return Response.json({ id: tana.id, yopildi: hozir })
    })
  }
  if (tana?.amal === 'nashr') {
    if (typeof tana.id !== 'string') return xato('Testni tanlang.', 400)
    const test = await prisma.kimyoKursTest.findUnique({
      where: { id: tana.id }, select: { kod: true, savollar: true },
    })
    if (!test?.kod || test.savollar.length < KURS_SAVOL_SONI) {
      return xato(`Nashr uchun test kodi va kamida ${KURS_SAVOL_SONI} ta savol kerak.`, 409)
    }
    const hozir = new Date()
    const natija = await prisma.kimyoKursTest.updateMany({
      where: {
        id: tana.id, nashrVaqti: null, yopiladi: { gt: hozir },
        kod: test.kod, savollar: { equals: test.savollar },
      },
      data: { nashrVaqti: hozir },
    })
    if (!natija.count) return xato('Qoralama o‘zgargan, nashr qilingan yoki muddati tugagan.', 409)
    return Response.json({ id: tana.id })
  }
  if (tana?.amal !== 'saqlash') return xato('Amal yaroqsiz.', 400)
  const { data, xato: sabab } = kursTestniTekshir(tana)
  if (sabab) return xato(sabab, 400)
  try {
    if (typeof tana.id === 'string' && tana.id) {
      // Oldingi natijalarni tekshirish uchun nashrdagi javob kaliti o'zgarmas.
      const natija = await prisma.kimyoKursTest.updateMany({ where: { id: tana.id, nashrVaqti: null }, data })
      if (!natija.count) return xato('Faqat qoralamani tahrirlash mumkin.', 409)
      return Response.json({ id: tana.id })
    }
    const test = await prisma.kimyoKursTest.create({ data, select: { id: true } })
    return Response.json(test, { status: 201 })
  } catch (e) {
    if (e.code === 'P2002') return xato('Bu yakshanba uchun test mavjud.', 409)
    throw e
  }
}
