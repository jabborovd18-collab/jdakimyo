-- Ustozlikni ikkilamchi rolga aylantirish va tasdiqlangan hisob (galochka).
--
-- NEGA. `role` bitta maydon edi, ya'ni odam bir vaqtda ham admin, ham
-- ustoz bo'la olmasdi: adminlik berilishi bilan ustoz paneli yo'qolardi.
-- Ustozlik aslida rol emas, vazifa — u asosiy rolga qo'shimcha beriladi.

ALTER TABLE "User" ADD COLUMN "isTeacher" BOOLEAN NOT NULL DEFAULT false;

-- Tasdiqlangan hisob. Faqat superadmin qo'yadi; kim va qachon berganini
-- yozib boramiz, aks holda keyin "buni kim tasdiqlagan?" degan savolga
-- javob topilmaydi.
ALTER TABLE "User" ADD COLUMN "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN "verifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "verifiedById" TEXT;

ALTER TABLE "User" ADD CONSTRAINT "User_verifiedById_fkey"
  FOREIGN KEY ("verifiedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Mavjud ustozlarni yangi bayroqqa ko'chiramiz. 'ustoz' — eski yozuvlar
-- uchun: kodda u allaqachon 'teacher' bilan teng deb qaralardi.
UPDATE "User" SET "isTeacher" = true WHERE "role" IN ('teacher', 'ustoz');

-- Asosiy rolni tegmasdan qoldiramiz. role='teacher' bo'lgan odam shu
-- holida qoladi va tizim uni ustoz deb tanishda davom etadi — ikkala
-- belgi ham ishlashi eski hisoblarni buzilishdan saqlaydi. Asosiy rolni
-- akademik rolga almashtirishni admin o'zi, ko'rib chiqib qiladi.
