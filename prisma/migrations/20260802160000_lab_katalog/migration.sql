-- Laboratoriya katalogi: reagentlar, jihozlar va texnikalar.
--
-- Manbasi — data/laboratoriya/ dagi fayllar (data/reactions → Reaction bilan
-- bir xil naqsh: fayl → seed skript → baza → ilova).
--
-- Reagentlar reaksiyalar bazasidan generatsiya qilinadi, nodirlik va narx
-- modda nechta reaksiyada uchrashidan chiqadi.

CREATE TABLE IF NOT EXISTS "LabItemDef" (
  "id"          TEXT NOT NULL,
  "kalit"       TEXT NOT NULL,
  "nom"         TEXT NOT NULL,
  "turi"        TEXT NOT NULL,
  "guruh"       TEXT,
  "icon"        TEXT,
  "tavsif"      TEXT,

  "nodirlik"    TEXT NOT NULL DEFAULT 'oddiy',
  "uchraydi"    INTEGER NOT NULL DEFAULT 0,
  "narx"        INTEGER NOT NULL DEFAULT 0,
  "sotishNarxi" INTEGER NOT NULL DEFAULT 0,
  "gemsNarxi"   INTEGER,

  "sarflanadi"  BOOLEAN NOT NULL DEFAULT false,
  "sanoat"      BOOLEAN NOT NULL DEFAULT false,
  "daraja"      INTEGER NOT NULL DEFAULT 1,

  "xom"         JSONB,
  "oilalar"     JSONB,

  "isActive"    BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,

  CONSTRAINT "LabItemDef_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "LabItemDef_kalit_key" ON "LabItemDef"("kalit");
CREATE INDEX IF NOT EXISTS "LabItemDef_turi_idx" ON "LabItemDef"("turi");
CREATE INDEX IF NOT EXISTS "LabItemDef_nodirlik_idx" ON "LabItemDef"("nodirlik");
CREATE INDEX IF NOT EXISTS "LabItemDef_guruh_idx" ON "LabItemDef"("guruh");
CREATE INDEX IF NOT EXISTS "LabItemDef_isActive_idx" ON "LabItemDef"("isActive");
