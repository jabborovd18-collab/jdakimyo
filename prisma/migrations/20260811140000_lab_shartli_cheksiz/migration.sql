-- Shartli cheksizlik: distillagich o'rnatgan odam distillangan suvni
-- boshqa sotib olmaydi.
--
-- `cheksiz` dan farqi: u KATALOGGA tegishli (jo'mrak suvi hamma uchun
-- bepul), bu esa FOYDALANUVCHIGA — bir xil yozuv apparati bor odam
-- uchun cheksiz, boshqasi uchun ulushlab sotib olinadigan bo'lib qoladi.
--
-- Qiymat SQL da yozilmaydi: u `lib/lab-erituvchi.js` dan
-- `scripts/seed-lab-katalog.js` orqali tushadi.
ALTER TABLE "LabItemDef" ADD COLUMN "cheksizAgar" TEXT;
