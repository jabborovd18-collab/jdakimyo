-- Profil postlari: foydalanuvchi o'z sahifasiga qoldiradigan qisqa yozuv.
--
-- Obunachilar tizimi aynan shu uchun bor edi: obuna bo'lish mumkin edi-yu,
-- obuna bo'lgandan keyin hech narsa kelmasdi.
--
-- Faqat matn saqlanadi. Rasm va havola qo'shilsa, moderatsiya va spam
-- masalasi paydo bo'ladi — kanal lentasidan farqi ham shu, kanal
-- nazorat ostida beriladi, profil posti esa hammada bor.

CREATE TABLE IF NOT EXISTS "ProfilePost" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "matn"      TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ProfilePost_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ProfilePost_userId_createdAt_idx" ON "ProfilePost"("userId", "createdAt");

DO $$
BEGIN
  ALTER TABLE "ProfilePost" ADD CONSTRAINT "ProfilePost_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
