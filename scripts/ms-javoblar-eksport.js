// scripts/ms-javoblar-eksport.js
//
// Kalibrlash uchun javoblarni CSV ga chiqaradi: npm run ms:eksport
// Bazadan faqat O'QIYDI. Fayl output/ da qoladi (git'ga kirmaydi).
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { PrismaClient } from "@prisma/client"
import { javoblarCsv } from "../lib/milliy-sertifikat-eksport.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "../lib/milliy-sertifikat-data.js"

const prisma = new PrismaClient()

try {
  mkdirSync("output", { recursive: true })

  for (const { slug } of MILLIY_SERTIFIKAT_VARIANTLARI) {
    const urinishlar = await prisma.msUrinish.findMany({
      where: { slug },
      select: {
        urinishTartibi: true,
        kechikkan: true,
        javoblar: { select: { savolKalit: true, togri: true, javobBerildi: true } },
      },
    })

    const { matn, qatorlar, ustunlar, tashlangan } = javoblarCsv(urinishlar)
    const fayl = join("output", `ms-javoblar-${slug}.csv`)
    writeFileSync(fayl, matn)
    console.log(`${slug}: ${qatorlar} qator, ${ustunlar} savol, ${tashlangan} urinish tashlandi -> ${fayl}`)
  }
} finally {
  await prisma.$disconnect()
}
