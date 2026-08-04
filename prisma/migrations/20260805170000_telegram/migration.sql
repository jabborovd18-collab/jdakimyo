-- Telegram bot bilan bog'lanish.
--
-- Telegram botga faqat `chatId` keladi va bot bu odam saytdagi kim
-- ekanini o'zi bila olmaydi. `TelegramKod` — ikkalasini bog'laydigan
-- bir martalik ip; `TelegramUlanish` esa bog'langandan keyingi holat.
CREATE TABLE "TelegramUlanish" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "username" TEXT,
    "xabarlar" BOOLEAN NOT NULL DEFAULT true,
    "bogladi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramUlanish_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelegramUlanish_userId_key" ON "TelegramUlanish"("userId");

-- chatId ham unique: bitta Telegram hisobi bitta sayt hisobiga bog'lanadi,
-- aks holda ko'p akkaunt bilan ishlash qulaylashib ketardi.
CREATE UNIQUE INDEX "TelegramUlanish_chatId_key" ON "TelegramUlanish"("chatId");

ALTER TABLE "TelegramUlanish" ADD CONSTRAINT "TelegramUlanish_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "TelegramKod" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kod" TEXT NOT NULL,
    "amalQiladi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TelegramKod_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TelegramKod_userId_key" ON "TelegramKod"("userId");
CREATE UNIQUE INDEX "TelegramKod_kod_key" ON "TelegramKod"("kod");
CREATE INDEX "TelegramKod_amalQiladi_idx" ON "TelegramKod"("amalQiladi");

ALTER TABLE "TelegramKod" ADD CONSTRAINT "TelegramKod_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
