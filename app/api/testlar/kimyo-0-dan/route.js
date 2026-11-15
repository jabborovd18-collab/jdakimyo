import { prisma } from '@/lib/prisma'
import { KURS_SAVOL_SONI, kursIsminiTekshir, kursJavoblariniBahola, kursTestHolati, kursTestKodiniTekshir } from '@/lib/kimyo-kurs-test'
import { kursUrinishiniOch, kursUrinishiniYarat } from '@/lib/kimyo-kurs-urinish'

const xato = (error, status) => Response.json({ error }, { status })
const testMaydonlari = { id: true, sarlavha: true, mavzular: true, ochiladi: true, yopiladi: true }

function ochiqShart(hozir) {
  return { kod: { not: null }, nashrVaqti: { not: null }, ochiladi: { lte: hozir }, yopiladi: { gt: hozir } }
}

export async function GET() {
  const hozir = new Date()
  const [ochiq, keyingi] = await Promise.all([
    prisma.kimyoKursTest.findFirst({ where: ochiqShart(hozir), select: testMaydonlari }),
    prisma.kimyoKursTest.findFirst({
      where: { kod: { not: null }, nashrVaqti: { not: null }, ochiladi: { gt: hozir } },
      orderBy: { ochiladi: 'asc' },
      select: testMaydonlari,
    }),
  ])
  return Response.json({ ochiq, keyingi })
}

async function boshlash(tana) {
  const ism = kursIsminiTekshir(tana.ism)
  const kod = kursTestKodiniTekshir(tana.kod)
  if (!ism || !kod) return xato('Ismingiz va test kodini tekshiring.', 400)
  const test = await prisma.kimyoKursTest.findFirst({ where: { ...ochiqShart(new Date()), kod } })
  if (!test || test.savollar.length < KURS_SAVOL_SONI) return xato('Kod noto‘g‘ri yoki test hozir ochiq emas.', 404)

  const { token, savolTartibi } = kursUrinishiniYarat(test.id, ism, test.savollar.length)
  return Response.json({
    token,
    sarlavha: test.sarlavha,
    mavzular: test.mavzular,
    savollar: savolTartibi.map(i => {
      const { matn, variantlar } = test.savollar[i]
      return { matn, variantlar }
    }),
  })
}

async function topshirish(tana) {
  const urinishKaliti = kursUrinishiniOch(tana.token)
  if (!urinishKaliti) return xato('Test urinishini ochib bo‘lmadi.', 400)
  const { testId, topshirishId, ism, savolTartibi } = urinishKaliti
  return prisma.$transaction(async tx => {
    const [test] = await tx.$queryRaw`SELECT "nashrVaqti", "ochiladi", "yopiladi", "savollar" FROM "KimyoKursTest" WHERE "id" = ${testId} FOR SHARE`
    if (!test?.nashrVaqti) return xato('Test topilmadi.', 404)

    const kalit = { testId_topshirishId: { testId, topshirishId } }
    const select = { ball: true, topshirildi: true, javoblar: true, savolTartibi: true }
    let urinish = await tx.kimyoKursUrinish.findUnique({ where: kalit, select })
    if (!urinish) {
      const hozir = new Date()
      if (kursTestHolati(test, hozir) !== 'ochiq') return xato('Testni topshirish vaqti tugagan.', 409)
      if (!Array.isArray(tana.javoblar) || tana.javoblar.length !== KURS_SAVOL_SONI ||
          !tana.javoblar.every(Number.isInteger)) return xato('Natijani olish uchun barcha savollarga javob bering.', 400)
      const baho = kursJavoblariniBahola(test.savollar, tana.javoblar, savolTartibi)
      if (!baho) return xato('Javoblar shakli yaroqsiz.', 400)
      // Internet uzilib qayta yuborilganda o'sha topshiriq bir marta hisoblanadi.
      await tx.kimyoKursUrinish.createMany({
        data: { testId, topshirishId, ism, familiya: '', savolTartibi, javoblar: tana.javoblar, ball: baho.ball, topshirildi: hozir },
        skipDuplicates: true,
      })
      urinish = await tx.kimyoKursUrinish.findUniqueOrThrow({ where: kalit, select })
    }
    const baho = kursJavoblariniBahola(test.savollar, urinish.javoblar, urinish.savolTartibi)
    return Response.json({ ...baho, ball: urinish.ball, topshirildi: urinish.topshirildi })
  })
}

export async function POST(request) {
  const tana = await request.json().catch(() => null)
  if (tana?.amal === 'boshlash') return boshlash(tana)
  if (tana?.amal === 'topshirish') return topshirish(tana)
  return xato('Amal yaroqsiz.', 400)
}
