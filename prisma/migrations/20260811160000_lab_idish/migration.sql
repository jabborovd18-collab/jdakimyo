-- Idish xossalari: sig'im va material.
--
-- Ilgari sig'im faqat 3D modellarida (`jihoz-modellari.js`) yashardi va
-- u Three.js ni import qilgani uchun serverdan o'qib bo'lmasdi. Natijada
-- "idishga sig'maydi" degan tekshiruv umuman yo'q edi: 25 ml probirkaga
-- 500 ml quyish mumkin edi.
--
-- `material` reaksiya idishni yaroqsiz qiladimi degan savolga javob
-- beradi: ftorid kislota shishani eritadi, 500 °C dan yuqori harorat uni
-- yumshatadi, qizdirilgan ishqor yemiradi. Chinni va kvarts chidaydi.
--
-- ALOHIDA JADVAL YARATILMADI. Idishlar almashtiriladigan — "bittasi
-- yaroqsiz bo'ldi" degani sanoqni kamaytirish, qaysi biri singani
-- ahamiyatsiz. Sig'im va material esa turning xossasi, nusxaning emas.
--
-- Qiymatlar `lib/lab-idish.js` dan seed skripti orqali tushadi.
ALTER TABLE "LabItemDef" ADD COLUMN "sigim" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "LabItemDef" ADD COLUMN "material" TEXT;
