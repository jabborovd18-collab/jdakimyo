// app/api/laboratoriya/sifat-analiz/route.js
//
// Sifat analizi topshiriqlari: ro'yxat (GET) va javobni topshirish (POST).
//
// NEGA SERVER KERAK BO'LDI. Bu topshiriqlar avval butunlay client'da edi:
// ball ham, XP ham, tanga ham brauzerda hisoblanardi va ekranga
// "+200 XP va +60 🪙" deb yozilardi — lekin hech qayerga yuborilmasdi.
// Talaba qiyin topshiriqni yechardi, mukofot ko'rsatilardi, balansi
// o'zgarmasdi.
//
// Endi ball SERVERDA hisoblanadi. Bu majburiy: aks holda brauzer
// konsolidan "hammasi to'g'ri" degan natijani yuborib istalgancha tanga
// olish mumkin bo'lardi — lib/laboratoriya.js dagi asosiy qoida.
//
// TAKROR YECHISH uchun alohida jadval yaratilmadi: `LabExperiment`
// allaqachon "shu ishni birinchi marta qilyapsanmi" degan savolga javob
// beradi va uning `reactionId` maydoni ataylab oddiy matn. Topshiriq
// o'sha yerga `sifat-analiz:topshiriq-1` kaliti bilan yoziladi.
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { LabXatosi, labDaraja, labniOl, urinib } from '@/lib/laboratoriya'
import { MISOLLAR, ochiqRoyxat, javobniTekshir } from '@/lib/lab-sifat-analiz'

/** Jurnalda topshiriq shu prefiks bilan yoziladi */
const PREFIKS = 'sifat-analiz:'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const lab = await labniOl(session.user.id)
    const yechilgan = await prisma.labExperiment.findMany({
      where: { labId: lab.id, reactionId: { startsWith: PREFIKS } },
      select: { reactionId: true },
      distinct: ['reactionId'],
    })
    const yechilganTuplam = new Set(yechilgan.map((y) => y.reactionId.slice(PREFIKS.length)))

    // Javoblar OLIB TASHLANGAN ro'yxat: kation va anion client'ga
    // yuborilsa, o'quvchi ularni manbadan o'qib olardi.
    return NextResponse.json({
      success: true,
      topshiriqlar: ochiqRoyxat().map((t) => ({
        ...t,
        yechilgan: yechilganTuplam.has(t.id),
      })),
    })
  } catch (error) {
    console.error('[Sifat analiz GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Tizimga kirmagansiz' }, { status: 401 })
    }

    const { topshiriqId, javoblar } = await request.json()

    const topshiriq = MISOLLAR.find((m) => m.id === topshiriqId)
    if (!topshiriq) {
      return NextResponse.json({ error: 'Bunday topshiriq yo\'q' }, { status: 400 })
    }
    if (!javoblar || typeof javoblar !== 'object') {
      return NextResponse.json({ error: 'Javoblar yuborilmagan' }, { status: 400 })
    }

    // Ball SERVERDA hisoblanadi — client yuborgan ballga ishonilmaydi.
    const natija = javobniTekshir(topshiriq, javoblar)

    const lab = await labniOl(session.user.id)
    const jurnalKaliti = PREFIKS + topshiriq.id

    const yakun = await urinib(() => prisma.$transaction(async (tx) => {
      // Birinchi marta yechilganmi — tranzaksiya ichida sanaladi, aks
      // holda ikkita bir vaqtdagi so'rov ikkalasi ham "birinchi" bo'lardi.
      const oldingi = await tx.labExperiment.count({
        where: { labId: lab.id, reactionId: jurnalKaliti },
      })
      const birinchi = oldingi === 0

      // TAKRORLAGANDA TANGA BERILMAYDI. Aks holda bitta oson
      // topshiriqni qayta-qayta yechish eng foydali strategiya bo'lardi
      // va topshiriqlarning ma'nosi qolmasdi. XP esa ozgina beriladi —
      // mashq qilish jazolanmasin.
      const olinganXP = birinchi ? natija.olinganXP : Math.round(natija.olinganXP * 0.2)
      const olinganTanga = birinchi ? natija.olinganTanga : 0

      if (olinganXP > 0) {
        const yangiTajriba = lab.tajriba + olinganXP
        await tx.lab.update({
          where: { id: lab.id },
          data: { tajriba: { increment: olinganXP }, daraja: labDaraja(yangiTajriba) },
        })
      }

      if (olinganTanga > 0) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { coins: { increment: olinganTanga } },
        })
        // Har bir tanga harakati qaydnomada qoladi — "qayerdan keldi"
        // degan savolga javob shu jadvaldan chiqadi.
        await tx.labTransaction.create({
          data: {
            labId: lab.id,
            turi: 'mukofot',
            valyuta: 'coins',
            miqdor: olinganTanga,
            kalit: jurnalKaliti,
            izoh: `Sifat analizi: ${topshiriq.nom}`,
          },
        })
      }

      // Faqat muvaffaqiyatli yechim daftarga yoziladi, aks holda
      // "yechilgan" belgisi noto'g'ri chiqardi.
      if (natija.muvaffaqiyat) {
        await tx.labExperiment.create({
          data: {
            labId: lab.id,
            reactionId: jurnalKaliti,
            equation: topshiriq.nom,
            tajriba: olinganXP,
            birinchi,
          },
        })
      }

      return { birinchi, olinganXP, olinganTanga }
    }, { timeout: 15000, maxWait: 8000 }))

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true, gems: true },
    })

    return NextResponse.json({ success: true, ...natija, ...yakun, balans: user })
  } catch (error) {
    if (error instanceof LabXatosi) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('[Sifat analiz POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
