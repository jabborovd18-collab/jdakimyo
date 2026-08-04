-- Email tasdig'i va elektron doskaga QR orqali kirish.

-- ─── EMAIL TASDIG'I ───
--
-- Avval email umuman tekshirilmasdi: format ham, mavjudligi ham.
-- Mavjud bo'lmagan manzil bilan istalgancha akkaunt ochish mumkin edi.
ALTER TABLE "User" ADD COLUMN "emailVerified" TIMESTAMP(3);

-- MAVJUD FOYDALANUVCHILAR TASDIQLANGAN DEB BELGILANADI.
-- Ular eski qoida bo'yicha ro'yxatdan o'tgan va ularni bir kechada
-- cheklab qo'yish adolatsiz bo'lardi. Yangi qoida faqat bundan
-- keyingi ro'yxatdan o'tishlarga tegishli.
UPDATE "User" SET "emailVerified" = NOW();

CREATE TABLE "EmailTasdiq" (
  "id"         TEXT NOT NULL,
  "userId"     TEXT NOT NULL,
  -- Olti xonali raqam. Havola emas: pochta mijozlari havolani ba'zan
  -- buzadi yoki oldindan bosib qo'yadi.
  "kod"        TEXT NOT NULL,
  -- Noto'g'ri urinishlar soni. Chegarasiz bo'lsa, olti xonali kodni
  -- yuz mingta so'rov bilan topib olish mumkin edi.
  "urinish"    INTEGER NOT NULL DEFAULT 0,
  "amalQiladi" TIMESTAMP(3) NOT NULL,
  "yuborilgan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EmailTasdiq_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EmailTasdiq_userId_key" ON "EmailTasdiq"("userId");
CREATE INDEX "EmailTasdiq_amalQiladi_idx" ON "EmailTasdiq"("amalQiladi");

ALTER TABLE "EmailTasdiq" ADD CONSTRAINT "EmailTasdiq_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── ELEKTRON DOSKA ───
--
-- Ma'ruza zalida o'qituvchi 100 talaba oldida parol tera olmaydi.
-- Doskada QR chiqadi, o'qituvchi telefonidan skanerlab tasdiqlaydi.
CREATE TABLE "DoskaSessiya" (
  "id"         TEXT NOT NULL,
  "token"      TEXT NOT NULL,
  -- kutilmoqda | tasdiqlangan | ishlatilgan | bekor
  "holat"      TEXT NOT NULL DEFAULT 'kutilmoqda',
  "userId"     TEXT,
  -- Doska sessiyasi qachon tugaydi (o'qituvchi tanlaydi)
  "tugaydi"    TIMESTAMP(3),
  -- QR ning o'zi tez eskiradi — skanerlashga berilgan vaqt
  "amalQiladi" TIMESTAMP(3) NOT NULL,
  -- Kim so'rayotgani telefonda ko'rsatiladi
  "qurilma"    TEXT,
  "ip"         TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "DoskaSessiya_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DoskaSessiya_token_key" ON "DoskaSessiya"("token");
CREATE INDEX "DoskaSessiya_holat_amalQiladi_idx" ON "DoskaSessiya"("holat", "amalQiladi");

ALTER TABLE "DoskaSessiya" ADD CONSTRAINT "DoskaSessiya_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
