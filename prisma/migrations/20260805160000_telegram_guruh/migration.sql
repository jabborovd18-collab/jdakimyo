-- Bot qo'shilgan Telegram guruhlari.
--
-- Kunlik iqtibos guruhda ma'noliroq: bitta gap butun sinfga ko'rinadi.
-- Guruhning chatId sini eslab qolmasak, unga hech narsa yubora
-- olmaymiz — Telegram bizga guruhlar ro'yxatini bermaydi.
--
-- Yozuv bot guruhga qo'shilganda o'zi paydo bo'ladi va bot
-- chiqarilganda `faol = false` bo'ladi (o'chirilmaydi: bot qayta
-- qo'shilsa sozlama saqlanib qolsin).
CREATE TABLE "TelegramGuruh" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "nom" TEXT,
    "qoshgan" TEXT,
    "iqtiboslar" BOOLEAN NOT NULL DEFAULT true,
    "faol" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramGuruh_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelegramGuruh_chatId_key" ON "TelegramGuruh"("chatId");
CREATE INDEX "TelegramGuruh_faol_iqtiboslar_idx" ON "TelegramGuruh"("faol", "iqtiboslar");
