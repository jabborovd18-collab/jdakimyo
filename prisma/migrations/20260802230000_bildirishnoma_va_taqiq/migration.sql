-- Bildirishnomalar va xarid taqiqi.
--
-- Bildirishnoma AuditLog dan farq qiladi: AuditLog — admin uchun
-- javobgarlik qaydnomasi, bu esa foydalanuvchiga yuboriladigan xabar.
-- Admin hisobga tegsa (tanga berdi, taqiq qo'ydi, rolni o'zgartirdi)
-- foydalanuvchi buni shu yerdan biladi.

-- Sarflash taqiqi: hisob to'xtatilmaydi, faqat xarid yopiladi. Muddat
-- majburiy — taqiq o'zi ochilsin, uni olib tashlash unutilmasin.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "spendBlockedUntil"  TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "spendBlockedReason" TEXT;

CREATE TABLE IF NOT EXISTS "Notification" (
  "id"          TEXT NOT NULL,
  "userId"      TEXT NOT NULL,

  "turi"        TEXT NOT NULL,
  "sarlavha"    TEXT NOT NULL,
  "matn"        TEXT,
  "havola"      TEXT,
  "icon"        TEXT,

  "oqilgan"     BOOLEAN NOT NULL DEFAULT false,
  "oqilganVaqt" TIMESTAMP(3),

  "adminId"     TEXT,

  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_oqilgan_idx" ON "Notification"("userId", "oqilgan");
CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "Notification_adminId_idx" ON "Notification"("adminId");

DO $$
BEGIN
  ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Admin o'chirilsa xabar qolsin, faqat bog'lanish uzilsin
DO $$
BEGIN
  ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
