-- Parolni taxmin qilishdan himoya.
--
-- Login'da hech qanday cheklov yo'q edi: ketma-ket urinishlar
-- to'sib qo'yilmasdi va javob vaqti ham oshmasdi, ya'ni parolni
-- avtomatik taxmin qilish ochiq edi.
ALTER TABLE "User" ADD COLUMN "kirishXatolari" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "kirishTaqiqUntil" TIMESTAMP(3);
