-- Do'stlar orasidagi kunlik sovg'a.
--
-- Yozuvning o'zi jurnal vazifasini bajaradi: sovg'a qilishni qo'shishdan
-- oldin kelishilgan shart shu edi — kim kimga qachon yuborgani ko'rinib
-- tursin, aks holda ko'p akkaunt bilan tanga yig'ishni aniqlab bo'lmaydi.

CREATE TABLE "Gift" (
  "id"         TEXT NOT NULL,
  "senderId"   TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  -- kutilmoqda | qabul | kuygan
  "holat"      TEXT NOT NULL DEFAULT 'kutilmoqda',
  -- TOSHKENT kuni (UTC+5). Sovg'a shu kun tugashi bilan kuyadi, shuning
  -- uchun chegara foydalanuvchi yashaydigan mintaqada bo'lishi kerak.
  "kun"        DATE NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "javobVaqt"  TIMESTAMP(3),

  CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- Bitta akkaunt kuniga bitta sovg'a. Cheklov BAZADA: kodda tekshirilsa,
-- ikkita so'rov bir vaqtda kelganda ikkalasi ham o'tib ketishi mumkin.
-- Qabul qiluvchida bunday cheklov yo'q — unga bir necha sovg'a kelaveradi.
CREATE UNIQUE INDEX "Gift_senderId_kun_key" ON "Gift"("senderId", "kun");

CREATE INDEX "Gift_receiverId_holat_idx" ON "Gift"("receiverId", "holat");
CREATE INDEX "Gift_kun_holat_idx" ON "Gift"("kun", "holat");

ALTER TABLE "Gift" ADD CONSTRAINT "Gift_senderId_fkey"
  FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_receiverId_fkey"
  FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
