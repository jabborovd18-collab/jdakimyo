// scripts/ms-bank-tekshir.js
//
// Savol bankining holatini ko'rsatadi: npm run ms:bank
// Ochiq sinovda xato bo'lsa, skript 1 kodi bilan tugaydi.
import { existsSync } from "node:fs"
import { join } from "node:path"
import { tekshirBank } from "../lib/milliy-sertifikat-bank.js"
import { MILLIY_SERTIFIKAT_VARIANTLARI } from "../lib/milliy-sertifikat-data.js"
import { getSavollarBySlug } from "../data/milliy-sertifikat/savollar-ombromi.js"

const rasmBormi = (rasm) => existsSync(join("public", rasm))
let xatoBor = false

for (const variant of MILLIY_SERTIFIKAT_VARIANTLARI) {
  console.log(`\n${variant.nom} [${variant.holat}]`)

  if (variant.holat !== "ochiq") {
    console.log("  Hali ochiq emas, tekshirilmadi")
    continue
  }

  const { xatolar, ogohlantirishlar } = tekshirBank(variant, getSavollarBySlug(variant.slug), rasmBormi)
  for (const x of xatolar) console.log(`  XATO: ${x}`)
  for (const o of ogohlantirishlar) console.log(`  Diqqat: ${o}`)
  if (!xatolar.length && !ogohlantirishlar.length) console.log("  Toza")
  if (xatolar.length) xatoBor = true
}

process.exit(xatoBor ? 1 : 0)
