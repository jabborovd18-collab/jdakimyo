-- Botda yaratiladigan bog'lash kodi (teskari yo'nalish).
--
-- Birinchi usulda odam avval saytga kirib, sozlamalarni topib, kod
-- olishi kerak edi. Amalda odam botni oldin topadi va o'sha yerdan
-- boshlashni xohlaydi. Bu jadval bot bergan kodni saqlaydi.
--
-- `TelegramKod` dan alohida, chunki u yerda kalit `userId`: u yerda
-- kod yaratilganda saytdagi odam kim ekani ma'lum. Bu yerda esa
-- faqat `chatId` ma'lum.
CREATE TABLE "TelegramBotKod" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "kod" TEXT NOT NULL,
    "username" TEXT,
    "urinish" INTEGER NOT NULL DEFAULT 0,
    "amalQiladi" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramBotKod_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelegramBotKod_chatId_key" ON "TelegramBotKod"("chatId");
CREATE UNIQUE INDEX "TelegramBotKod_kod_key" ON "TelegramBotKod"("kod");
CREATE INDEX "TelegramBotKod_amalQiladi_idx" ON "TelegramBotKod"("amalQiladi");
