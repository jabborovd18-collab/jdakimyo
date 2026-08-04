-- Talabani guruhga qo'shishda rozilik.
--
-- NEGA. Ustoz istalgan odamni jimgina o'z guruhiga qo'sha olardi. Talaba
-- o'zining kimningdir ro'yxatida turganini, unga vazifa berilishini va
-- topshiriq natijalari ustozga ko'rinishini bilmasdi ham. Endi qo'shish
-- taklif: talaba qabul qilmaguncha guruh a'zosi hisoblanmaydi.
--
-- Qiymatlar: 'sorov' (javob kutilmoqda) | 'faol' (qabul qilingan) | 'rad'

ALTER TABLE "TeacherStudent" ADD COLUMN "holat" TEXT NOT NULL DEFAULT 'sorov';
ALTER TABLE "TeacherStudent" ADD COLUMN "javobVaqt" TIMESTAMP(3);

-- MAVJUD YOZUVLAR 'faol' BO'LADI. Ular eski qoida bo'yicha qo'shilgan va
-- ustozlar allaqachon ular bilan ishlayapti; hammasini 'sorov' ga
-- tushirsak, ishlab turgan guruhlar bir kechada bo'shab qolardi.
-- Yangi qoida faqat bundan keyingi qo'shishlarga tegishli.
UPDATE "TeacherStudent" SET "holat" = 'faol', "javobVaqt" = "joinedAt";

-- Holat bo'yicha filtrlash har bir ro'yxatda ishlatiladi
CREATE INDEX "TeacherStudent_studentId_holat_idx" ON "TeacherStudent"("studentId", "holat");
CREATE INDEX "TeacherStudent_teacherId_holat_idx" ON "TeacherStudent"("teacherId", "holat");
