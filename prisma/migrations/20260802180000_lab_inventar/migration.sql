-- Laboratoriya va inventar.
--
-- Lab            — foydalanuvchining laboratoriyasi, bo'sh boshlanadi
-- LabItem        — kim nimaga ega va nechta
-- LabTransaction — tanga/olmos harakati
--
-- LabTransaction nima uchun kerak: balansning o'zi yetarli emas. Nimadir
-- noto'g'ri ketsa yoki kimdir aldashga urinsa, "qayerdan keldi va qayerga
-- ketdi" degan savolga javob shu jadvaldan chiqadi.

CREATE TABLE IF NOT EXISTS "Lab" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "nom"       TEXT NOT NULL DEFAULT 'Mening laboratoriyam',
  "daraja"    INTEGER NOT NULL DEFAULT 1,
  "tajriba"   INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Lab_userId_key" ON "Lab"("userId");

CREATE TABLE IF NOT EXISTS "LabItem" (
  "id"        TEXT NOT NULL,
  "labId"     TEXT NOT NULL,
  "kalit"     TEXT NOT NULL,
  "soni"      INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LabItem_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "LabItem_labId_kalit_key" ON "LabItem"("labId", "kalit");
CREATE INDEX IF NOT EXISTS "LabItem_labId_idx" ON "LabItem"("labId");
CREATE INDEX IF NOT EXISTS "LabItem_kalit_idx" ON "LabItem"("kalit");

CREATE TABLE IF NOT EXISTS "LabTransaction" (
  "id"        TEXT NOT NULL,
  "labId"     TEXT NOT NULL,
  "turi"      TEXT NOT NULL,
  "valyuta"   TEXT NOT NULL,
  "miqdor"    INTEGER NOT NULL,
  "kalit"     TEXT,
  "soni"      INTEGER,
  "izoh"      TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LabTransaction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "LabTransaction_labId_idx" ON "LabTransaction"("labId");
CREATE INDEX IF NOT EXISTS "LabTransaction_turi_idx" ON "LabTransaction"("turi");
CREATE INDEX IF NOT EXISTS "LabTransaction_createdAt_idx" ON "LabTransaction"("createdAt");

-- ─── Bog'lanishlar ───
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Lab_userId_fkey') THEN
    ALTER TABLE "Lab" ADD CONSTRAINT "Lab_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LabItem_labId_fkey') THEN
    ALTER TABLE "LabItem" ADD CONSTRAINT "LabItem_labId_fkey"
      FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  -- Katalog yozuvi o'chirilmaydi (isActive=false bo'ladi), shuning uchun
  -- RESTRICT: inventar hech qachon "yo'q narsaga" ishora qilib qolmaydi.
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LabItem_kalit_fkey') THEN
    ALTER TABLE "LabItem" ADD CONSTRAINT "LabItem_kalit_fkey"
      FOREIGN KEY ("kalit") REFERENCES "LabItemDef"("kalit") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'LabTransaction_labId_fkey') THEN
    ALTER TABLE "LabTransaction" ADD CONSTRAINT "LabTransaction_labId_fkey"
      FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
