-- Tajriba o'tkazish: kashfiyotlar jurnali va mahsulot moddalar.
--
-- `LabItemDef.chiqadi` — modda nechta reaksiyada MAHSULOT bo'lib chiqadi.
-- `uchraydi` esa reagent sifatidagi sonini bildiradi. Ikkisi ajratilgan,
-- chunki narx ikki xil hisoblanadi: sotib olinadigan modda reagent
-- sonidan, faqat tajribada olinadigani esa mahsulot sonidan.
ALTER TABLE "LabItemDef" ADD COLUMN IF NOT EXISTS "chiqadi" INTEGER NOT NULL DEFAULT 0;

-- Tajriba jurnali.
--
-- reactionId ataylab FOREIGN KEY emas: reaksiya bazadan o'chirilsa ham
-- foydalanuvchining daftaridagi yozuv qolishi kerak. Tenglama ham nusxa
-- qilib saqlanadi — o'sha kungi ko'rinishi bilan.
CREATE TABLE IF NOT EXISTS "LabExperiment" (
  "id"         TEXT NOT NULL,
  "labId"      TEXT NOT NULL,

  "reactionId" TEXT NOT NULL,
  "equation"   TEXT NOT NULL,

  "tajriba"    INTEGER NOT NULL DEFAULT 0,
  "birinchi"   BOOLEAN NOT NULL DEFAULT false,

  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "LabExperiment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "LabExperiment_labId_idx" ON "LabExperiment"("labId");
CREATE INDEX IF NOT EXISTS "LabExperiment_labId_reactionId_idx" ON "LabExperiment"("labId", "reactionId");
CREATE INDEX IF NOT EXISTS "LabExperiment_createdAt_idx" ON "LabExperiment"("createdAt");

DO $$
BEGIN
  ALTER TABLE "LabExperiment"
    ADD CONSTRAINT "LabExperiment_labId_fkey"
    FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
