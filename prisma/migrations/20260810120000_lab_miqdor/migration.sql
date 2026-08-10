-- Laboratoriya inventarini DONA dan haqiqiy MIQDOR ga o'tkazish, 1-bosqich.
--
-- Bugungacha inventar butun son bilan ishlagan: `LabItem.soni`, reaksiya esa
-- `decrement: koef` bilan sarflagan — "2NaOH" degani "2 dona NaOH". 3D
-- laboratoriyadagi millilitr esa client tomonda o'ylab topilgan konstanta
-- edi va serverga umuman yetib bormasdi.
--
-- Bu migratsiya faqat USTUN QO'SHADI, hech narsani ko'chirmaydi. Sabab:
-- moddaning birligi uning agregat holatiga bog'liq (suyuq → ml, qattiq →
-- gr), bu ma'lumot esa `lib/lab-modda.js` da yashaydi. Uni SQL ichida
-- qaytadan yozish — ikkinchi haqiqat manbai yaratish demak, ya'ni jadval
-- tuzatilganda SQL eskiligicha qolardi.
--
-- Shuning uchun to'ldirish ikkita skriptda, ular bir manbadan o'qiydi:
--   node scripts/seed-lab-katalog.js    → LabItemDef.birlik
--   node scripts/lab-miqdor-toldir.js   → LabItem.miqdor
--
-- Oraliq holat xavfsiz: yangi ustunlarni hali hech kim o'qimaydi, server
-- `soni` bilan ishlashda davom etadi.

-- Katalog: har bir buyumning o'lchov birligi ("ml" | "gr" | "dona").
-- Sukut "dona" — jihoz va texnika uchun to'g'ri javob, reagentlarniki
-- seed skripti tomonidan yoziladi.
ALTER TABLE "LabItemDef" ADD COLUMN "birlik" TEXT NOT NULL DEFAULT 'dona';

-- Inventar: haqiqiy miqdor. `soni` ataylab qoldirilyapti — u hamma joy
-- `miqdor` ga o'tgandan keyingina olib tashlanadi.
ALTER TABLE "LabItem" ADD COLUMN "miqdor" DOUBLE PRECISION NOT NULL DEFAULT 0;
