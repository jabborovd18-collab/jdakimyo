-- Tasdiqlangan hisob tanlaydigan profil bezagi.
--
-- Avval barcha tasdiqlangan hisoblar bir xil ko'rinardi. Belgi pullik
-- obuna bilan berilishi rejalashtirilgan — pul to'lagan odam o'zini
-- ifodalay olishi kerak, aks holda "premium" hamma uchun bir xil qolip
-- bo'lib qoladi.
--
-- Faqat KO'RINISH: hech qanday huquq bermaydi, shuning uchun uni
-- foydalanuvchining o'zi almashtiradi. Qiymatlar lib/premium.js da.

ALTER TABLE "User" ADD COLUMN "premiumUslub" TEXT NOT NULL DEFAULT 'kosmik';
